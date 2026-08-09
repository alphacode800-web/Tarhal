import { Router, RequestHandler } from 'express';
import { z } from 'zod';
import { buildSystemPrompt, getCachedPlatformContext } from '../utils/ai-context.js';
import {
  getAiConfig,
  isAiChatReady,
  getAiProvider,
  sanitizeUserMessage,
  invalidateAiConfigCache,
  maskApiKey,
} from '../utils/ai-config.js';
import { checkRateLimit } from '../utils/ai-rate-limit.js';
import { getAiChatStats, recordAiChatSuccess, recordAiChatError } from '../utils/ai-stats.js';
import { generateLocalReply } from '../utils/ai-local.js';
import { buildAiInsights } from '../utils/ai-insights.js';

const router = Router();

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
  language: z.enum(['ar', 'en', 'fr']).default('en'),
  userCountry: z.string().max(50).optional(),
});

function clientIp(req: { ip?: string; headers: Record<string, unknown> }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip ?? 'unknown';
}

async function callOpenAI(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error('[ai-chat] OpenAI error:', response.status, errBody.slice(0, 300));
      throw new Error(`openai_${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('empty_response');
    return reply;
  } finally {
    clearTimeout(timeout);
  }
}

export const getAiStatus: RequestHandler = async (_req, res) => {
  const config = await getAiConfig();
  const chatReady = isAiChatReady(config);
  const provider = getAiProvider(config);

  res.json({
    success: true,
    data: {
      showWidget: config.showWidget,
      enabled: config.enabled,
      chatReady,
      configured: Boolean(config.apiKey),
      provider,
      model: provider === 'openai' ? config.model : 'local',
      welcomeMessage: config.welcomeMessage,
      quickPrompts: config.quickPrompts,
      apiKeyHint: config.apiKey ? maskApiKey(config.apiKey) : null,
      features: config.features,
      productRecommendations: config.features.productRecommendations,
    },
  });
};

export const getAiStats: RequestHandler = async (_req, res) => {
  const [stats, config] = await Promise.all([getAiChatStats(), getAiConfig()]);
  const provider = getAiProvider(config);
  res.json({
    success: true,
    data: {
      ...stats,
      configured: Boolean(config.apiKey),
      chatReady: isAiChatReady(config),
      provider,
      model: provider === 'openai' ? config.model : 'local',
      apiKeyHint: config.apiKey ? maskApiKey(config.apiKey) : null,
    },
  });
};

router.get('/status', getAiStatus);
router.get('/stats', getAiStats);

router.get('/insights', async (_req, res) => {
  try {
    const data = await buildAiInsights();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('[ai-chat] insights failed:', error?.message ?? error);
    res.status(500).json({ success: false, error: 'Failed to build AI insights' });
  }
});

router.get('/recommendations', async (_req, res) => {
  try {
    const config = await getAiConfig();
    if (!config.features.productRecommendations) {
      return res.json({ success: true, data: { enabled: false, offers: [] } });
    }
    const data = await buildAiInsights();
    res.json({
      success: true,
      data: { enabled: true, offers: data.recommendedOffers },
    });
  } catch (error: any) {
    console.error('[ai-chat] recommendations failed:', error?.message ?? error);
    res.status(500).json({ success: false, error: 'Failed to load recommendations' });
  }
});

router.post('/test', async (req, res) => {
  try {
    const config = await getAiConfig();
    const testKey = (req.body?.apiKey as string)?.trim() || config.apiKey;

    // Without OpenAI key, verify local assistant responds
    if (!testKey) {
      const reply = await generateLocalReply('hello', 'en');
      invalidateAiConfigCache();
      return res.json({
        success: true,
        data: { ok: Boolean(reply?.trim()), model: 'local', reply: reply.slice(0, 50), provider: 'local' },
      });
    }

    const model = config.model;
    const reply = await callOpenAI(
      testKey,
      model,
      [
        { role: 'system', content: 'Reply with exactly: OK' },
        { role: 'user', content: 'ping' },
      ],
      10,
      0
    );

    invalidateAiConfigCache();
    res.json({
      success: true,
      data: { ok: reply.includes('OK'), model, reply: reply.slice(0, 50), provider: 'openai' },
    });
  } catch (error: any) {
    console.error('[ai-chat] test failed:', error?.message);
    await recordAiChatError();
    res.status(502).json({ success: false, error: 'Connection test failed' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Invalid request', code: 'INVALID_REQUEST' });
    }

    const config = await getAiConfig();

    if (!isAiChatReady(config)) {
      return res.status(503).json({
        success: false,
        error: 'AI assistant is disabled',
        code: 'AI_NOT_CONFIGURED',
      });
    }

    const ip = clientIp(req);
    const rate = checkRateLimit(`ai:${ip}`, config.rateLimitPerMinute);
    if (!rate.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        code: 'RATE_LIMITED',
        retryAfterSec: rate.retryAfterSec,
      });
    }

    const { messages, language, userCountry } = parsed.data;
    const sanitized = messages.map((m) => ({
      role: m.role,
      content: m.role === 'user' ? sanitizeUserMessage(m.content) : m.content,
    }));

    const lastUser = [...sanitized].reverse().find((m) => m.role === 'user')?.content ?? '';
    const provider = getAiProvider(config);

    // Local catalog assistant when no OpenAI key
    if (provider === 'local') {
      const reply = await generateLocalReply(lastUser, language, userCountry);
      await recordAiChatSuccess();
      return res.json({ success: true, data: { reply, model: 'local', provider: 'local' } });
    }

    const context = await getCachedPlatformContext(language);
    let systemPrompt = buildSystemPrompt(language, context);
    if (config.systemPromptExtra) {
      systemPrompt += `\n\nAdditional instructions:\n${config.systemPromptExtra}`;
    }
    if (config.features.productRecommendations) {
      systemPrompt +=
        '\n\nProduct recommendations are enabled: when helpful, suggest 1–2 concrete offers with paths like /offers.';
    }
    if (userCountry) {
      systemPrompt += `\n\nUser's detected country code: ${userCountry}. Prefer local offers when relevant.`;
    }

    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...sanitized.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const reply = await callOpenAI(
        config.apiKey,
        config.model,
        openaiMessages,
        config.maxTokens,
        config.temperature
      );

      await recordAiChatSuccess();
      return res.json({ success: true, data: { reply, model: config.model, provider: 'openai' } });
    } catch (openaiError: any) {
      // Graceful fallback if OpenAI fails
      console.error('[ai-chat] OpenAI failed, falling back to local:', openaiError?.message ?? openaiError);
      const reply = await generateLocalReply(lastUser, language, userCountry);
      await recordAiChatSuccess();
      return res.json({ success: true, data: { reply, model: 'local', provider: 'local' } });
    }
  } catch (error: any) {
    await recordAiChatError();
    if (error?.name === 'AbortError') {
      return res.status(504).json({ success: false, error: 'Request timed out', code: 'TIMEOUT' });
    }
    console.error('[ai-chat] error:', error?.message ?? error);
    res.status(502).json({ success: false, error: 'AI service unavailable', code: 'AI_ERROR' });
  }
});

export default router;
