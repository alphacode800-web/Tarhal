import { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Key,
  MessageSquare,
  Sliders,
  Zap,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { dataManager, type AdminSettings } from '@/services/dataManager';
import { fetchAiStatus, fetchAiStats, testAiConnection, type AiStats } from '@/services/aiAssistant';

interface Props {
  settings: AdminSettings;
  setSettings: (s: AdminSettings) => void;
  getLocalizedText: (ar: string, en: string, fr: string) => string;
}

const MODELS = [
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini — سريع واقتصادي (موصى به)' },
  { id: 'gpt-4o', label: 'GPT-4o — أعلى جودة' },
  { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo — أقدم وأرخص' },
];

export default function AdminAiManagement({ settings, setSettings, getLocalizedText }: Props) {
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [stats, setStats] = useState<AiStats | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasExistingKey, setHasExistingKey] = useState(false);

  const ai = settings.aiAssistant ?? dataManager.getDefaultSettings().aiAssistant!;

  useEffect(() => {
    fetchAiStats().then(setStats).catch(() => {});
    fetchAiStatus()
      .then((s) => setHasExistingKey(s.configured))
      .catch(() => {});
  }, []);

  const updateAi = (patch: Partial<NonNullable<AdminSettings['aiAssistant']>>) => {
    setSettings({ ...settings, aiAssistant: { ...ai, ...patch } });
    setTestResult(null);
  };

  const updateQuickPrompt = (lng: 'ar' | 'en' | 'fr', index: number, value: string) => {
    const prompts = [...ai.quickPrompts[lng]];
    prompts[index] = value;
    updateAi({ quickPrompts: { ...ai.quickPrompts, [lng]: prompts } });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg('');
    const toSave = { ...settings };
    if (toSave.aiAssistant) {
      const key = apiKeyInput.trim();
      if (key) {
        toSave.aiAssistant = { ...toSave.aiAssistant, apiKey: key };
      } else if (hasExistingKey) {
        const { apiKey: _, ...rest } = toSave.aiAssistant;
        toSave.aiAssistant = rest as typeof toSave.aiAssistant;
      }
    }

    try {
      const ok = await dataManager.saveSettingsAsync(toSave);
      if (ok) {
        setStatusMsg(getLocalizedText('تم الحفظ بنجاح', 'Saved successfully', 'Enregistré avec succès'));
        if (apiKeyInput.trim()) {
          setHasExistingKey(true);
          setApiKeyInput('');
        }
        window.dispatchEvent(new Event('settingsUpdated'));
        const newStats = await fetchAiStats();
        setStats(newStats);
      } else {
        setStatusMsg(getLocalizedText('فشل الحفظ', 'Save failed', 'Échec'));
      }
    } catch {
      setStatusMsg(getLocalizedText('حدث خطأ', 'Error occurred', 'Erreur'));
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const key = apiKeyInput.trim() || undefined;
      const result = await testAiConnection(key);
      setTestResult(result.ok ? 'ok' : 'fail');
    } catch {
      setTestResult('fail');
    } finally {
      setTesting(false);
    }
  };

  const isReady = hasExistingKey && ai.enabled;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-950/80 rounded-3xl border border-violet-500/30 p-6 backdrop-blur-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-tarhal-blue rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-50">
                {getLocalizedText('إدارة الذكاء الاصطناعي', 'AI Management', 'Gestion IA')}
              </h2>
              <p className="text-sm text-slate-400">
                {getLocalizedText(
                  'إعداد وإطلاق مساعد السفر الذكي للزوار',
                  'Configure and launch the AI travel assistant',
                  'Configurez et lancez l\'assistant voyage IA'
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                isReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }
            >
              {isReady ? (
                <>
                  <CheckCircle className="h-3 w-3 me-1" />
                  {getLocalizedText('جاهز للإطلاق', 'Launch ready', 'Prêt au lancement')}
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 me-1" />
                  {getLocalizedText('يحتاج مفتاح API', 'Needs API key', 'Clé API requise')}
                </>
              )}
            </Badge>
            <Button variant="outline" onClick={handleTest} disabled={testing} className="border-white/10 text-slate-200">
              <Zap className="h-4 w-4 me-2" />
              {testing
                ? getLocalizedText('جاري الاختبار…', 'Testing…', 'Test…')
                : getLocalizedText('اختبار الاتصال', 'Test connection', 'Tester')}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-tarhal-orange hover:bg-tarhal-orange-dark">
              <Save className="h-4 w-4 me-2" />
              {saving
                ? getLocalizedText('جاري الحفظ…', 'Saving…', 'Enregistrement…')
                : getLocalizedText('حفظ ونشر', 'Save & publish', 'Enregistrer')}
            </Button>
          </div>
        </div>

        {testResult === 'ok' && (
          <p className="mt-3 text-sm text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {getLocalizedText('الاتصال بـ OpenAI ناجح', 'OpenAI connection successful', 'Connexion OpenAI réussie')}
          </p>
        )}
        {testResult === 'fail' && (
          <p className="mt-3 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {getLocalizedText('فشل الاتصال — تحقق من المفتاح', 'Connection failed — check API key', 'Échec — vérifiez la clé')}
          </p>
        )}
        {statusMsg && <p className="mt-3 text-sm text-emerald-400">{statusMsg}</p>}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: getLocalizedText('محادثات اليوم', 'Chats today', 'Chats aujourd\'hui'),
              value: stats.todayChats,
              icon: MessageSquare,
              color: 'text-violet-400',
            },
            {
              label: getLocalizedText('إجمالي المحادثات', 'Total chats', 'Total chats'),
              value: stats.totalChats,
              icon: BarChart3,
              color: 'text-cyan-400',
            },
            {
              label: getLocalizedText('أخطاء', 'Errors', 'Erreurs'),
              value: stats.totalErrors,
              icon: AlertCircle,
              color: 'text-red-400',
            },
            {
              label: getLocalizedText('النموذج', 'Model', 'Modèle'),
              value: stats.model,
              icon: Bot,
              color: 'text-emerald-400',
              isText: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-slate-950/80 rounded-2xl border border-slate-500/30 p-4 backdrop-blur-3xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
              <p className={`font-bold text-slate-50 ${item.isText ? 'text-sm' : 'text-2xl'}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Activation */}
        <div className="bg-slate-950/80 rounded-3xl border border-slate-500/40 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-violet-400" />
            <h3 className="font-semibold text-slate-50">
              {getLocalizedText('التفعيل والعرض', 'Activation', 'Activation')}
            </h3>
          </div>

          {[
            {
              key: 'enabled' as const,
              title: getLocalizedText('تفعيل المساعد الذكي', 'Enable AI assistant', 'Activer l\'assistant'),
              desc: getLocalizedText('يسمح بالردود الذكية على استفسارات الزوار', 'Enables smart replies', 'Active les réponses intelligentes'),
              value: ai.enabled,
            },
            {
              key: 'showWidget' as const,
              title: getLocalizedText('إظهار الأيقونة العائمة', 'Show floating icon', 'Afficher l\'icône'),
              desc: getLocalizedText('زر 🤖 فوق واتساب في كل الصفحات العامة', 'Bot button above WhatsApp', 'Bouton au-dessus de WhatsApp'),
              value: ai.showWidget,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5"
            >
              <div>
                <p className="font-medium text-slate-200 text-sm">{item.title}</p>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
              <Switch
                checked={item.value}
                onCheckedChange={(v) => updateAi({ [item.key]: v })}
              />
            </div>
          ))}
        </div>

        {/* API */}
        <div className="bg-slate-950/80 rounded-3xl border border-slate-500/40 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-amber-400" />
            <h3 className="font-semibold text-slate-50">OpenAI API</h3>
          </div>

          {hasExistingKey && stats?.apiKeyHint && (
            <p className="text-xs text-emerald-400 font-mono bg-emerald-500/10 rounded-lg px-3 py-2">
              {getLocalizedText('المفتاح الحالي:', 'Current key:', 'Clé actuelle:')} {stats.apiKeyHint}
            </p>
          )}

          <Input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder={
              hasExistingKey
                ? getLocalizedText('اتركه فارغاً للإبقاء على المفتاح الحالي', 'Leave empty to keep current key', 'Laisser vide pour conserver')
                : 'sk-...'
            }
            className="bg-slate-900/60 border-white/10 text-slate-100 font-mono text-xs"
          />

          <select
            value={ai.model}
            onChange={(e) => updateAi({ model: e.target.value })}
            className="w-full rounded-xl bg-slate-900/60 border border-white/10 text-slate-100 text-sm px-3 py-2.5"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              {getLocalizedText('حد الطلبات / دقيقة لكل زائر', 'Rate limit per visitor / min', 'Limite / min')}
            </label>
            <Input
              type="number"
              min={5}
              max={60}
              value={ai.rateLimitPerMinute}
              onChange={(e) => updateAi({ rateLimitPerMinute: Number(e.target.value) })}
              className="bg-slate-900/60 border-white/10 text-slate-100 text-sm"
            />
          </div>
        </div>

        {/* Welcome */}
        <div className="bg-slate-950/80 rounded-3xl border border-slate-500/40 p-6 space-y-4 xl:col-span-2">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-50">
              {getLocalizedText('رسائل الترحيب', 'Welcome Messages', 'Messages de bienvenue')}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['ar', 'en', 'fr'] as const).map((lng) => (
              <Textarea
                key={lng}
                rows={3}
                value={ai.welcomeMessage[lng]}
                onChange={(e) =>
                  updateAi({ welcomeMessage: { ...ai.welcomeMessage, [lng]: e.target.value } })
                }
                className="bg-slate-900/60 border-white/10 text-slate-100 text-xs resize-none"
                dir={lng === 'ar' ? 'rtl' : 'ltr'}
                placeholder={lng.toUpperCase()}
              />
            ))}
          </div>
        </div>

        {/* Quick prompts */}
        <div className="bg-slate-950/80 rounded-3xl border border-slate-500/40 p-6 space-y-4 xl:col-span-2">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-pink-400" />
            <h3 className="font-semibold text-slate-50">
              {getLocalizedText('أسئلة سريعة', 'Quick Prompts', 'Questions rapides')}
            </h3>
          </div>
          {(['ar', 'en', 'fr'] as const).map((lng) => (
            <div key={lng}>
              <p className="text-xs text-slate-400 mb-2 uppercase">{lng}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ai.quickPrompts[lng].map((prompt, i) => (
                  <Input
                    key={`${lng}-${i}`}
                    value={prompt}
                    onChange={(e) => updateQuickPrompt(lng, i, e.target.value)}
                    className="bg-slate-900/60 border-white/10 text-slate-100 text-xs"
                    dir={lng === 'ar' ? 'rtl' : 'ltr'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Advanced */}
        <div className="bg-slate-950/80 rounded-3xl border border-slate-500/40 p-6 space-y-4 xl:col-span-2">
          <div className="flex items-center gap-3">
            <Sliders className="h-5 w-5 text-orange-400" />
            <h3 className="font-semibold text-slate-50">
              {getLocalizedText('إعدادات متقدمة', 'Advanced', 'Avancé')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Temperature ({ai.temperature})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={ai.temperature}
                onChange={(e) => updateAi({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-violet-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Max Tokens</label>
              <Input
                type="number"
                min={100}
                max={2000}
                value={ai.maxTokens}
                onChange={(e) => updateAi({ maxTokens: Number(e.target.value) })}
                className="bg-slate-900/60 border-white/10 text-slate-100 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              {getLocalizedText('تعليمات إضافية للمساعد', 'Extra system instructions', 'Instructions supplémentaires')}
            </label>
            <Textarea
              rows={4}
              value={ai.systemPromptExtra}
              onChange={(e) => updateAi({ systemPromptExtra: e.target.value })}
              placeholder={getLocalizedText(
                'مثال: ركّز على العروض المحلية في السودان…',
                'e.g. Focus on local offers in Sudan…',
                'ex. Focus sur les offres locales…'
              )}
              className="bg-slate-900/60 border-white/10 text-slate-100 text-xs resize-none"
            />
          </div>
        </div>
      </div>

      {/* Launch checklist */}
      <div className="bg-gradient-to-r from-violet-500/10 to-tarhal-blue/10 rounded-3xl border border-violet-500/20 p-6">
        <h3 className="font-semibold text-slate-50 mb-4">
          {getLocalizedText('قائمة الإطلاق', 'Launch Checklist', 'Checklist de lancement')}
        </h3>
        <ul className="space-y-2 text-sm">
          {[
            { ok: hasExistingKey || Boolean(apiKeyInput.trim()), text: getLocalizedText('مفتاح OpenAI API مُعدّ', 'OpenAI API key configured', 'Clé API configurée') },
            { ok: ai.enabled, text: getLocalizedText('المساعد مفعّل', 'Assistant enabled', 'Assistant activé') },
            { ok: ai.showWidget, text: getLocalizedText('الأيقونة ظاهرة للزوار', 'Widget visible to visitors', 'Widget visible') },
            { ok: Boolean(ai.welcomeMessage.ar?.trim()), text: getLocalizedText('رسالة ترحيب عربية', 'Arabic welcome message', 'Message AR défini') },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-slate-300">
              {item.ok ? (
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              )}
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
