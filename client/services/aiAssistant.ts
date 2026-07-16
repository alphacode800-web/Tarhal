export type ChatLanguage = 'ar' | 'en' | 'fr';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface AiStatus {
  showWidget: boolean;
  enabled: boolean;
  chatReady: boolean;
  configured: boolean;
  provider: string | null;
  model: string;
  welcomeMessage?: { ar: string; en: string; fr: string };
  quickPrompts?: { ar: string[]; en: string[]; fr: string[] };
  apiKeyHint?: string | null;
}

export interface AiStats {
  totalChats: number;
  todayChats: number;
  todayDate: string;
  totalErrors: number;
  lastChatAt: string | null;
  configured: boolean;
  chatReady: boolean;
  model: string;
  apiKeyHint?: string | null;
}

const SESSION_KEY = 'ciar-ai-chat-session';

export async function fetchAiStatus(): Promise<AiStatus> {
  const res = await fetch('/api/ai/status');
  const json = await res.json();
  return (
    json.data ?? {
      showWidget: true,
      enabled: false,
      chatReady: false,
      configured: false,
      provider: null,
      model: 'gpt-4o-mini',
    }
  );
}

export async function fetchAiStats(): Promise<AiStats> {
  const res = await fetch('/api/ai/stats');
  const json = await res.json();
  return json.data;
}

export async function testAiConnection(apiKey?: string): Promise<{ ok: boolean; model: string }> {
  const res = await fetch('/api/ai/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiKey ? { apiKey } : {}),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Test failed');
  return json.data;
}

export class AiChatError extends Error {
  code: string;
  retryAfterSec?: number;

  constructor(code: string, message: string, retryAfterSec?: number) {
    super(message);
    this.code = code;
    this.retryAfterSec = retryAfterSec;
  }
}

export async function sendChatMessage(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  language: ChatLanguage,
  userCountry?: string | null
): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, language, userCountry }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new AiChatError(
      json.code ?? 'UNKNOWN',
      json.error ?? 'Chat request failed',
      json.retryAfterSec
    );
  }

  return json.data.reply as string;
}

export function loadChatSession(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveChatSession(messages: ChatMessage[]): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages.slice(-30)));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function clearChatSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export const DEFAULT_QUICK_PROMPTS: Record<ChatLanguage, string[]> = {
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

export function getErrorMessage(code: string, lang: ChatLanguage): string {
  const messages: Record<string, Record<ChatLanguage, string>> = {
    RATE_LIMITED: {
      ar: 'طلبات كثيرة — انتظر قليلاً ثم حاول مجدداً.',
      en: 'Too many requests — please wait a moment and try again.',
      fr: 'Trop de requêtes — veuillez patienter un instant.',
    },
    TIMEOUT: {
      ar: 'استغرق الرد وقتاً طويلاً. حاول مرة أخرى.',
      en: 'The response took too long. Please try again.',
      fr: 'La réponse a pris trop de temps. Réessayez.',
    },
    AI_NOT_CONFIGURED: {
      ar: 'المساعد الذكي غير مفعّل بعد.',
      en: 'AI assistant is not configured yet.',
      fr: 'L\'assistant IA n\'est pas encore configuré.',
    },
  };
  return messages[code]?.[lang] ?? (
    lang === 'ar'
      ? 'حدث خطأ. حاول مرة أخرى.'
      : lang === 'fr'
        ? 'Une erreur s\'est produite. Réessayez.'
        : 'Something went wrong. Please try again.'
  );
}
