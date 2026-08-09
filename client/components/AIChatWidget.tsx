import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, X, Send, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { detectUserCountry, mapCountryCodeToId } from '@/services/geoLocation';
import {
  fetchAiStatus,
  sendChatMessage,
  loadChatSession,
  saveChatSession,
  clearChatSession,
  getErrorMessage,
  AiChatError,
  type ChatMessage,
  type ChatLanguage,
  type AiStatus,
} from '@/services/aiAssistant';

const MAX_INPUT = 500;
const HIDDEN_PREFIXES = ['/admin', '/supervisor'];

function uid() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function renderMessageContent(text: string) {
  const parts = text.split(/(\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+)/g);
  return parts.map((part, i) => {
    if (part.match(/^\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+$/)) {
      return (
        <Link key={i} to={part} className="underline font-medium hover:opacity-80" onClick={() => {}}>
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const LABELS: Record<
  ChatLanguage,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    thinking: string;
    notConfigured: string;
    open: string;
    close: string;
    quickTitle: string;
    clear: string;
    poweredBy: string;
  }
> = {
  ar: {
    title: 'مساعد السفر الذكي',
    subtitle: 'مدعوم بالذكاء الاصطناعي',
    placeholder: 'اسأل عن الوجهات، العروض، أو الحجز…',
    send: 'إرسال',
    thinking: 'يفكر…',
    notConfigured: 'المساعد الذكي قيد الإعداد. تواصل معنا عبر واتساب أو تصفح العروض.',
    open: 'فتح مساعد السفر الذكي',
    close: 'إغلاق المساعد',
    quickTitle: 'أسئلة سريعة',
    clear: 'محادثة جديدة',
    poweredBy: 'CIAR Tourism AI',
  },
  en: {
    title: 'AI Travel Assistant',
    subtitle: 'Powered by AI',
    placeholder: 'Ask about destinations, offers, or booking…',
    send: 'Send',
    thinking: 'Thinking…',
    notConfigured: 'AI assistant is being set up. Contact us on WhatsApp or browse offers.',
    open: 'Open AI travel assistant',
    close: 'Close assistant',
    quickTitle: 'Quick questions',
    clear: 'New chat',
    poweredBy: 'CIAR Tourism AI',
  },
  fr: {
    title: 'Assistant Voyage IA',
    subtitle: 'Propulsé par l\'IA',
    placeholder: 'Posez vos questions sur les destinations, offres ou réservations…',
    send: 'Envoyer',
    thinking: 'Réflexion…',
    notConfigured: 'L\'assistant IA est en cours de configuration. Contactez-nous sur WhatsApp.',
    open: 'Ouvrir l\'assistant voyage IA',
    close: 'Fermer l\'assistant',
    quickTitle: 'Questions rapides',
    clear: 'Nouvelle conversation',
    poweredBy: 'CIAR Tourism AI',
  },
};

export default function AIChatWidget() {
  const { language, isRTL } = useLanguage();
  const lang = language as ChatLanguage;
  const labels = LABELS[lang];
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatSession());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hidden = HIDDEN_PREFIXES.some((p) => location.pathname.startsWith(p));

  const quickPrompts = useMemo(
    () => status?.quickPrompts?.[lang] ?? [],
    [status?.quickPrompts, lang]
  );

  const loadStatus = useCallback(() => {
    fetchAiStatus()
      .then(setStatus)
      .catch(() =>
        setStatus({
          showWidget: true,
          enabled: false,
          chatReady: false,
          configured: false,
          provider: null,
          model: 'gpt-4o-mini',
        })
      );
  }, []);

  useEffect(() => {
    loadStatus();
    window.addEventListener('settingsUpdated', loadStatus);
    return () => window.removeEventListener('settingsUpdated', loadStatus);
  }, [loadStatus]);

  useEffect(() => {
    detectUserCountry()
      .then((geo) => {
        if (geo) setUserCountry(mapCountryCodeToId(geo.countryCode) ?? geo.countryCode);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    saveChatSession(messages);
  }, [messages]);

  const welcomeText =
    status?.welcomeMessage?.[lang] ??
    (lang === 'ar'
      ? 'مرحباً! أنا مساعدك الذكي في CIAR Tourism.'
      : lang === 'fr'
        ? 'Bonjour ! Je suis l\'assistant IA de CIAR Tourism.'
        : "Hello! I'm CIAR Tourism's AI assistant.");

  const initWelcome = useCallback(() => {
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        content: status?.chatReady ? welcomeText : labels.notConfigured,
      },
    ]);
  }, [status?.chatReady, welcomeText, labels.notConfigured]);

  useEffect(() => {
    if (!status?.chatReady) return;
    const stale = messages.some(
      (m) =>
        m.role === 'assistant' &&
        (m.content.includes('قيد الإعداد') ||
          m.content.includes('being set up') ||
          m.content.includes('en cours de configuration'))
    );
    if (stale || (open && messages.length === 0)) {
      clearChatSession();
      setMessages([
        {
          id: uid(),
          role: 'assistant',
          content: welcomeText,
        },
      ]);
    }
  }, [status?.chatReady, welcomeText]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open && messages.length === 0 && status) initWelcome();
  }, [open, messages.length, initWelcome, status]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, MAX_INPUT);
      if (!trimmed || loading) return;

      if (!status?.chatReady) {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: 'user', content: trimmed },
          { id: uid(), role: 'assistant', content: labels.notConfigured },
        ]);
        setInput('');
        return;
      }

      const userMsg: ChatMessage = { id: uid(), role: 'user', content: trimmed };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput('');
      setLoading(true);

      try {
        const apiMessages = history.map((m) => ({ role: m.role, content: m.content }));
        const reply = await sendChatMessage(apiMessages, lang, userCountry);
        setMessages((prev) => [...prev, { id: uid(), role: 'assistant', content: reply }]);
      } catch (err) {
        const code = err instanceof AiChatError ? err.code : 'UNKNOWN';
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: 'assistant', content: getErrorMessage(code, lang) },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, status?.chatReady, messages, lang, userCountry, labels.notConfigured]
  );

  const handleClear = () => {
    clearChatSession();
    setMessages([]);
    initWelcome();
  };

  if (hidden || (status && !status.showWidget)) return null;

  return (
    <>
      <div
        className={cn(
          'fixed z-50 flex flex-col overflow-hidden border border-border bg-background shadow-2xl transition-all duration-300',
          'max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-2xl max-sm:max-h-[85vh]',
          'sm:bottom-[10.5rem] sm:end-6 sm:w-[min(100vw-2rem,400px)] sm:rounded-2xl',
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none max-sm:translate-y-full'
        )}
        role="dialog"
        aria-label={labels.title}
        aria-hidden={!open}
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-tarhal-navy to-tarhal-blue-dark px-4 py-3 text-white shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">{labels.title}</p>
            <p className="text-xs text-white/70 truncate">{labels.subtitle}</p>
          </div>
          {messages.length > 1 && (
            <button
              onClick={handleClear}
              className="rounded-full p-1.5 hover:bg-white/15 transition-colors"
              aria-label={labels.clear}
              title={labels.clear}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 hover:bg-white/15 transition-colors"
            aria-label={labels.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ScrollArea className="flex-1 min-h-0 px-3 py-3 max-sm:h-[50vh] sm:h-80">
          <div className="flex flex-col gap-3">
            {status === null ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                        msg.role === 'user'
                          ? 'bg-tarhal-blue text-white rounded-ee-sm'
                          : 'bg-muted text-foreground rounded-es-sm'
                      )}
                    >
                      {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl rounded-es-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {labels.thinking}
                    </div>
                  </div>
                )}

                {status.chatReady && messages.length <= 1 && !loading && quickPrompts.length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs text-muted-foreground mb-2 px-1">{labels.quickTitle}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickPrompts.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:bg-muted transition-colors text-start"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border p-3 shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={labels.placeholder}
                rows={1}
                disabled={loading}
                dir={isRTL ? 'rtl' : 'ltr'}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tarhal-blue/40 disabled:opacity-50 max-h-24"
              />
              {input.length > MAX_INPUT * 0.8 && (
                <span className="absolute bottom-1 end-2 text-[10px] text-muted-foreground">
                  {input.length}/{MAX_INPUT}
                </span>
              )}
            </div>
            <Button
              size="icon"
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="shrink-0 bg-tarhal-orange hover:bg-tarhal-orange-dark rounded-xl h-9 w-9"
              aria-label={labels.send}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">{labels.poweredBy}</p>
        </div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? labels.close : labels.open}
        aria-expanded={open}
        className={cn(
          'fixed bottom-[5.5rem] end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          open
            ? 'max-sm:hidden bg-muted-foreground shadow-none scale-95'
            : 'bg-gradient-to-br from-tarhal-blue to-tarhal-navy shadow-[0_8px_24px_rgba(33,95,154,0.45)] focus-visible:ring-tarhal-blue animate-in fade-in'
        )}
      >
        <Bot className="h-6 w-6" />
      </button>
    </>
  );
}
