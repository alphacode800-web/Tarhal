import { getAdminData, ADMIN_KEYS } from '../database/admin-store.js';

export interface AiAssistantConfig {
  enabled: boolean;
  showWidget: boolean;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  rateLimitPerMinute: number;
  welcomeMessage: { ar: string; en: string; fr: string };
  quickPrompts: { ar: string[]; en: string[]; fr: string[] };
  systemPromptExtra: string;
}

const DEFAULT_WELCOME = {
  ar: 'مرحباً! أنا مساعدك الذكي في CIAR Tourism. كيف يمكنني مساعدتك في تخطيط رحلتك؟',
  en: "Hello! I'm CIAR Tourism's AI assistant. How can I help you plan your trip?",
  fr: 'Bonjour ! Je suis l\'assistant IA de CIAR Tourism. Comment puis-je vous aider à planifier votre voyage ?',
};

export const DEFAULT_QUICK_PROMPTS = {
  ar: [
    'ما أفضل العروض السياحية المتاحة؟',
    'كيف أحجز فندق أو رحلة؟',
    'ما الوجهات التي تغطونها؟',
    'هل تقدمون خدمات التأشيرات والطيران؟',
  ],
  en: [
    'What tour offers do you have?',
    'How do I book a hotel or trip?',
    'Which destinations do you cover?',
    'Do you offer visas and flights?',
  ],
  fr: [
    'Quelles offres touristiques proposez-vous ?',
    'Comment réserver un hôtel ou un voyage ?',
    'Quelles destinations couvrez-vous ?',
    'Proposez-vous des visas et des vols ?',
  ],
};

export const ALLOWED_MODELS = new Set([
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
]);

let configCache: { config: AiAssistantConfig; at: number } | null = null;
const CONFIG_TTL_MS = 30_000;

export function invalidateAiConfigCache(): void {
  configCache = null;
}

export async function getAiConfig(): Promise<AiAssistantConfig> {
  const now = Date.now();
  if (configCache && now - configCache.at < CONFIG_TTL_MS) {
    return configCache.config;
  }

  const settings = await getAdminData<{
    aiAssistant?: Partial<AiAssistantConfig>;
  }>(ADMIN_KEYS.settings);

  const ai = settings?.aiAssistant ?? {};
  const model = ai.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const config: AiAssistantConfig = {
    enabled: ai.enabled ?? process.env.AI_ASSISTANT_ENABLED !== 'false',
    showWidget: ai.showWidget ?? true,
    apiKey: ai.apiKey?.trim() || process.env.OPENAI_API_KEY?.trim() || '',
    model: ALLOWED_MODELS.has(model) ? model : 'gpt-4o-mini',
    temperature: Math.min(1, Math.max(0, ai.temperature ?? 0.6)),
    maxTokens: Math.min(2000, Math.max(100, ai.maxTokens ?? 600)),
    rateLimitPerMinute: Math.min(60, Math.max(5, ai.rateLimitPerMinute ?? 20)),
    welcomeMessage: {
      ar: ai.welcomeMessage?.ar || DEFAULT_WELCOME.ar,
      en: ai.welcomeMessage?.en || DEFAULT_WELCOME.en,
      fr: ai.welcomeMessage?.fr || DEFAULT_WELCOME.fr,
    },
    quickPrompts: {
      ar: ai.quickPrompts?.ar?.length ? ai.quickPrompts.ar.slice(0, 6) : DEFAULT_QUICK_PROMPTS.ar,
      en: ai.quickPrompts?.en?.length ? ai.quickPrompts.en.slice(0, 6) : DEFAULT_QUICK_PROMPTS.en,
      fr: ai.quickPrompts?.fr?.length ? ai.quickPrompts.fr.slice(0, 6) : DEFAULT_QUICK_PROMPTS.fr,
    },
    systemPromptExtra: (ai.systemPromptExtra ?? '').slice(0, 1000),
  };

  configCache = { config, at: now };
  return config;
}

export function isAiChatReady(config: AiAssistantConfig): boolean {
  return config.enabled && Boolean(config.apiKey);
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '';
  return `${key.slice(0, 7)}…${key.slice(-4)}`;
}

/** Strip prompt-injection patterns from user messages */
export function sanitizeUserMessage(text: string): string {
  return text
    .replace(/ignore (all )?(previous|above) instructions/gi, '')
    .replace(/you are now/gi, '')
    .trim()
    .slice(0, 2000);
}
