import { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
  Heart,
  Search,
  ShoppingBag,
  Package,
  ShieldAlert,
  Eye,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  dataManager,
  mergeAiFeatures,
  type AdminSettings,
  type AiFeatureFlags,
} from '@/services/dataManager';
import {
  fetchAiStatus,
  fetchAiStats,
  fetchAiInsights,
  testAiConnection,
  type AiStats,
  type AiInsights,
} from '@/services/aiAssistant';

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

type FeatureKey = keyof AiFeatureFlags;

const FEATURE_META: Array<{
  key: FeatureKey;
  icon: typeof Bot;
  color: string;
  bg: string;
  title: [string, string, string];
  desc: [string, string, string];
}> = [
  {
    key: 'smartChat',
    icon: MessageSquare,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    title: ['الدردشة الآلية الذكية', 'Smart automated chat', 'Chat automatique intelligent'],
    desc: [
      'رد فوري على استفسارات العملاء عبر المساعد الذكي في الموقع.',
      'Instant replies to visitor questions via the on-site smart assistant.',
      'Réponses instantanées via l’assistant intelligent du site.',
    ],
  },
  {
    key: 'sentimentAnalysis',
    icon: Heart,
    color: 'text-rose-400',
    bg: 'bg-rose-500/15',
    title: ['تحليل المشاعر', 'Sentiment analysis', 'Analyse des sentiments'],
    desc: [
      'تحليل رسائل التواصل لمعرفة رضا العملاء ومستوى الأولوية.',
      'Analyze contact signals to gauge satisfaction and priority.',
      'Analyse des signaux pour mesurer la satisfaction client.',
    ],
  },
  {
    key: 'seoSuggestions',
    icon: Search,
    color: 'text-sky-400',
    bg: 'bg-sky-500/15',
    title: ['اقتراحات SEO', 'SEO suggestions', 'Suggestions SEO'],
    desc: [
      'اقتراح عناوين ووصف وكلمات مفتاحية لتحسين الظهور في محركات البحث.',
      'Suggest titles, descriptions, and keywords for search visibility.',
      'Suggestions de titres, descriptions et mots-clés SEO.',
    ],
  },
  {
    key: 'productRecommendations',
    icon: ShoppingBag,
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
    title: ['توصيات المنتجات', 'Product recommendations', 'Recommandations produits'],
    desc: [
      'عرض توصيات ذكية للعروض بناءً على سلوك الزوار وبيانات المنصة.',
      'Show smart offer recommendations from visitor & catalog signals.',
      'Recommandations d’offres basées sur le comportement et le catalogue.',
    ],
  },
  {
    key: 'smartInventory',
    icon: Package,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    title: ['إدارة المخزون الذكية', 'Smart inventory', 'Inventaire intelligent'],
    desc: [
      'توقّع النقص في العروض/الفنادق (صور ناقصة، عناصر غير مكتملة) لتقليل الفاقد.',
      'Forecast catalog gaps (missing images, incomplete items) to reduce waste.',
      'Anticipe les lacunes du catalogue pour réduire les pertes.',
    ],
  },
  {
    key: 'fraudDetection',
    icon: ShieldAlert,
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
    title: ['اكتشاف الاحتيال', 'Fraud detection', 'Détection de fraude'],
    desc: [
      'تحليل المعاملات المالية واكتشاف الأنماط المشبوهة في الحجوزات.',
      'Analyze payments and flag suspicious booking patterns.',
      'Analyse les paiements et signale les schémas suspects.',
    ],
  },
];

export default function AdminAiManagement({ settings, setSettings, getLocalizedText }: Props) {
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [stats, setStats] = useState<AiStats | null>(null);
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const ai = settings.aiAssistant ?? dataManager.getDefaultSettings().aiAssistant!;
  const features = mergeAiFeatures(ai.features);

  const loadInsights = useCallback(async () => {
    setLoadingInsights(true);
    try {
      const data = await fetchAiInsights();
      setInsights(data);
    } catch {
      setInsights(null);
    } finally {
      setLoadingInsights(false);
    }
  }, []);

  useEffect(() => {
    fetchAiStats().then(setStats).catch(() => {});
    fetchAiStatus()
      .then((s) => setHasExistingKey(s.configured))
      .catch(() => {});
    loadInsights();
  }, [loadInsights]);

  const updateAi = (patch: Partial<NonNullable<AdminSettings['aiAssistant']>>) => {
    setSettings({ ...settings, aiAssistant: { ...ai, ...patch } });
    setTestResult(null);
  };

  const updateFeature = (key: FeatureKey, value: boolean) => {
    const next = { ...features, [key]: value };
    const patch: Partial<NonNullable<AdminSettings['aiAssistant']>> = { features: next };
    // Smart chat master switch also drives enabled/showWidget
    if (key === 'smartChat') {
      patch.enabled = value;
      patch.showWidget = value ? true : ai.showWidget;
    }
    updateAi(patch);
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
      const mergedFeatures = mergeAiFeatures(toSave.aiAssistant.features);
      toSave.aiAssistant = {
        ...toSave.aiAssistant,
        features: mergedFeatures,
        enabled: mergedFeatures.smartChat && (toSave.aiAssistant.enabled ?? true),
        showWidget: mergedFeatures.smartChat ? (toSave.aiAssistant.showWidget ?? true) : false,
      };
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
        const [newStats] = await Promise.all([fetchAiStats(), loadInsights()]);
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

  const isReady = features.smartChat && ai.enabled;
  const hasOpenAi = hasExistingKey || Boolean(apiKeyInput.trim());
  const lang = (settings.defaultLanguage === 'en' || settings.defaultLanguage === 'fr'
    ? settings.defaultLanguage
    : 'ar') as 'ar' | 'en' | 'fr';

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
                  'رؤى ذكية ووحدات AI قابلة للتفعيل لإدارة أفضل للمنصة',
                  'Smart insights and toggleable AI modules for the platform',
                  'Insights intelligents et modules IA activables'
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
                  {hasOpenAi
                    ? getLocalizedText('جاهز (OpenAI)', 'Ready (OpenAI)', 'Prêt (OpenAI)')
                    : getLocalizedText('جاهز (محلي)', 'Ready (local)', 'Prêt (local)')}
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 me-1" />
                  {getLocalizedText('معطّل', 'Disabled', 'Désactivé')}
                </>
              )}
            </Badge>
            <Button
              variant="outline"
              onClick={loadInsights}
              disabled={loadingInsights}
              className="border-white/10 text-slate-200"
            >
              <RefreshCw className={`h-4 w-4 me-2 ${loadingInsights ? 'animate-spin' : ''}`} />
              {getLocalizedText('تحديث الرؤى', 'Refresh insights', 'Actualiser')}
            </Button>
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
            {getLocalizedText('اختبار المساعد ناجح', 'Assistant test successful', 'Test de l\'assistant réussi')}
          </p>
        )}
        {testResult === 'fail' && (
          <p className="mt-3 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {getLocalizedText('فشل الاختبار — تحقق من الإعدادات', 'Test failed — check settings', 'Échec — vérifiez les réglages')}
          </p>
        )}
        {statusMsg && <p className="mt-3 text-sm text-emerald-400">{statusMsg}</p>}
      </div>

      {/* Smart insights */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/40 rounded-3xl border border-violet-500/25 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-violet-300" />
          <h3 className="font-semibold text-slate-50">
            {getLocalizedText('رؤى ذكية للإدارة', 'Smart management insights', 'Insights de gestion')}
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: getLocalizedText('رسائل الشهر', 'Month messages', 'Messages du mois'),
              value: insights?.insights.monthMessages ?? stats?.totalChats ?? 0,
              icon: MessageSquare,
              sub: getLocalizedText('عبر المساعد الذكي', 'via AI assistant', 'via assistant IA'),
            },
            {
              label: getLocalizedText('مشاعر العملاء', 'Customer sentiment', 'Sentiment client'),
              value: `${insights?.insights.sentiment.positive ?? 0} ${getLocalizedText('إيجابي', 'Positive', 'Positif')}`,
              icon: Heart,
              sub: `${insights?.insights.sentiment.negative ?? 0} ${getLocalizedText('سلبي', 'neg', 'nég')} · ${insights?.insights.sentiment.neutral ?? 0} ${getLocalizedText('محايد', 'neu', 'neu')}`,
            },
            {
              label: getLocalizedText('مشاهدات المنصة', 'Platform views', 'Vues plateforme'),
              value: (insights?.insights.platformViews ?? 0).toLocaleString(),
              icon: Eye,
              sub: getLocalizedText('زيارات مجمّعة', 'aggregated visits', 'visites agrégées'),
            },
            {
              label: getLocalizedText('نشاط الطلبات', 'Order activity', 'Activité commandes'),
              value: insights?.insights.orderActivity ?? 0,
              icon: ShoppingBag,
              sub: `${insights?.insights.pendingOrders ?? 0} ${getLocalizedText('معلّق', 'pending', 'en attente')} · ${insights?.insights.activeOffers ?? 0} ${getLocalizedText('عرض', 'offers', 'offres')}`,
            },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className="h-4 w-4 text-violet-300" />
                <span className="text-xs text-slate-400">{card.label}</span>
              </div>
              <p className="text-xl font-bold text-slate-50">{card.value}</p>
              <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed rounded-2xl bg-black/20 border border-white/5 px-4 py-3">
          {insights?.insights.summary?.[lang] ||
            getLocalizedText(
              'فعّل الوحدات أدناه ثم احفظ لبدء جمع الرؤى الذكية.',
              'Enable modules below then save to start collecting smart insights.',
              'Activez les modules puis enregistrez pour collecter les insights.'
            )}
        </p>

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-violet-500/10 border border-violet-400/20 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-100">
              {getLocalizedText(
                'تفعيل توصيات المنتجات في الموقع لزيادة التحويل',
                'Enable product recommendations on the site to boost conversion',
                'Activer les recommandations produits pour augmenter la conversion'
              )}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {getLocalizedText(
                'يظهر للمساعد والزوار عروضاً مقترحة من الكتالوج',
                'Surfaces catalog offers to the assistant and visitors',
                'Propose des offres du catalogue à l’assistant et aux visiteurs'
              )}
            </p>
          </div>
          <Switch
            checked={features.productRecommendations}
            onCheckedChange={(v) => updateFeature('productRecommendations', v)}
          />
        </div>
      </div>

      {/* Feature modules grid */}
      <div>
        <h3 className="font-semibold text-slate-50 mb-3">
          {getLocalizedText('وحدات الذكاء الاصطناعي', 'AI feature modules', 'Modules IA')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {FEATURE_META.map((item) => {
            const Icon = item.icon;
            const on = features[item.key];
            return (
              <div
                key={item.key}
                className={`rounded-3xl border p-5 transition-all ${
                  on
                    ? 'bg-slate-950/90 border-violet-400/30 shadow-lg shadow-violet-500/10'
                    : 'bg-slate-950/60 border-slate-600/30 opacity-90'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`h-11 w-11 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <Switch checked={on} onCheckedChange={(v) => updateFeature(item.key, v)} />
                </div>
                <h4 className="mt-4 font-semibold text-slate-50 text-sm">
                  {getLocalizedText(...item.title)}
                </h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {getLocalizedText(...item.desc)}
                </p>
                <Badge
                  className={`mt-3 ${
                    on
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-700/40 text-slate-400 border-slate-600/40'
                  }`}
                >
                  {on
                    ? getLocalizedText('مفعّل', 'On', 'Activé')
                    : getLocalizedText('معطّل', 'Off', 'Désactivé')}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monitoring panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-500/40 bg-slate-950/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-400" />
              <h4 className="font-semibold text-slate-50 text-sm">
                {getLocalizedText('تنبؤ المخزون', 'Inventory forecast', 'Prévision inventaire')}
              </h4>
            </div>
            {!features.smartInventory && (
              <Badge className="bg-slate-700/50 text-slate-400 border-slate-600">
                {getLocalizedText('معطّل', 'Off', 'Off')}
              </Badge>
            )}
          </div>
          {features.smartInventory ? (
            <>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-red-500/15 text-red-300 border-red-500/30">
                  {insights?.inventory.critical ?? 0} {getLocalizedText('حرج', 'Critical', 'Critique')}
                </Badge>
                <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
                  {insights?.inventory.low ?? 0} {getLocalizedText('منخفض', 'Low', 'Faible')}
                </Badge>
              </div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>
                  {getLocalizedText('عروض بلا صورة:', 'Offers without image:', 'Offres sans image :')}{' '}
                  {insights?.inventory.missingOfferImage ?? 0}
                </li>
                <li>
                  {getLocalizedText('فنادق بلا صورة:', 'Hotels without image:', 'Hôtels sans image :')}{' '}
                  {insights?.inventory.missingHotelImage ?? 0}
                </li>
                <li>
                  {getLocalizedText('عروض غير نشطة:', 'Inactive offers:', 'Offres inactives :')}{' '}
                  {insights?.inventory.inactiveOffers ?? 0}
                </li>
              </ul>
            </>
          ) : (
            <p className="text-xs text-slate-500">
              {getLocalizedText(
                'فعّل «إدارة المخزون الذكية» لعرض التنبيهات.',
                'Enable Smart Inventory to see alerts.',
                'Activez l’inventaire intelligent pour voir les alertes.'
              )}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-500/40 bg-slate-950/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-orange-400" />
              <h4 className="font-semibold text-slate-50 text-sm">
                {getLocalizedText('مراقبة الاحتيال', 'Fraud monitoring', 'Surveillance fraude')}
              </h4>
            </div>
            {!features.fraudDetection && (
              <Badge className="bg-slate-700/50 text-slate-400 border-slate-600">
                {getLocalizedText('معطّل', 'Off', 'Off')}
              </Badge>
            )}
          </div>
          {features.fraudDetection ? (
            <>
              <Badge className="bg-orange-500/15 text-orange-300 border-orange-500/30">
                {insights?.fraud.checked ?? 0} {getLocalizedText('طلب مفحوص', 'checked', 'vérifiés')}
              </Badge>
              <p className="text-xs text-slate-400">
                {getLocalizedText('مشبوه:', 'Suspicious:', 'Suspect :')}{' '}
                <span className="text-orange-300 font-semibold">{insights?.fraud.suspiciousCount ?? 0}</span>
              </p>
              {(insights?.fraud.items?.length ?? 0) > 0 && (
                <ul className="text-xs text-slate-500 space-y-1 max-h-28 overflow-auto">
                  {insights!.fraud.items.slice(0, 5).map((item) => (
                    <li key={item.id} className="truncate">
                      {item.id.slice(0, 18)}… — {item.reason} ({item.status})
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500">
              {getLocalizedText(
                'فعّل «اكتشاف الاحتيال» لمراقبة المدفوعات المشبوهة.',
                'Enable Fraud Detection to monitor suspicious payments.',
                'Activez la détection de fraude pour surveiller les paiements.'
              )}
            </p>
          )}
        </div>
      </div>

      {/* SEO panel */}
      {features.seoSuggestions && (
        <div className="rounded-3xl border border-sky-500/25 bg-slate-950/80 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-sky-400" />
            <h4 className="font-semibold text-slate-50 text-sm">
              {getLocalizedText('اقتراحات SEO الحالية', 'Current SEO suggestions', 'Suggestions SEO actuelles')}
            </h4>
          </div>
          <ul className="space-y-2">
            {(insights?.seoSuggestions ?? []).map((s, i) => (
              <li
                key={i}
                className={`text-sm rounded-xl px-3 py-2 border ${
                  s.severity === 'good'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                    : s.severity === 'warn'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-100'
                      : 'bg-sky-500/10 border-sky-500/20 text-sky-100'
                }`}
              >
                {s[lang]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended offers preview */}
      {features.productRecommendations && (insights?.recommendedOffers?.length ?? 0) > 0 && (
        <div className="rounded-3xl border border-violet-500/25 bg-slate-950/80 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-violet-400" />
            <h4 className="font-semibold text-slate-50 text-sm">
              {getLocalizedText('عروض مُوصى بها الآن', 'Recommended offers now', 'Offres recommandées')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights!.recommendedOffers.slice(0, 6).map((o) => (
              <div key={o.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm text-slate-100 font-medium line-clamp-2">
                  {o.title?.[lang] || o.title?.ar || o.title?.en || o.id}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {o.price != null ? `$${o.price}` : '—'}
                  {o.durationDays ? ` · ${o.durationDays}d` : ''}
                </p>
              </div>
            ))}
          </div>
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
              desc: getLocalizedText(
                'يسمح بالردود الذكية (يتبع أيضاً وحدة الدردشة الآلية)',
                'Allows smart replies (also follows Smart Chat module)',
                'Active les réponses (lié au module chat)'
              ),
              value: ai.enabled && features.smartChat,
              onChange: (v: boolean) => {
                updateFeature('smartChat', v);
                updateAi({ enabled: v });
              },
            },
            {
              key: 'showWidget' as const,
              title: getLocalizedText('إظهار الأيقونة العائمة', 'Show floating icon', 'Afficher l\'icône'),
              desc: getLocalizedText('زر المساعد فوق واتساب في الصفحات العامة', 'Assistant button above WhatsApp', 'Bouton au-dessus de WhatsApp'),
              value: ai.showWidget && features.smartChat,
              onChange: (v: boolean) => updateAi({ showWidget: v }),
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
              <Switch checked={item.value} onCheckedChange={item.onChange} disabled={!features.smartChat && item.key === 'showWidget'} />
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
            { ok: features.smartChat && ai.enabled, text: getLocalizedText('الدردشة الآلية مفعّلة', 'Smart chat enabled', 'Chat intelligent activé') },
            { ok: ai.showWidget && features.smartChat, text: getLocalizedText('الأيقونة ظاهرة للزوار', 'Widget visible to visitors', 'Widget visible') },
            { ok: features.seoSuggestions, text: getLocalizedText('اقتراحات SEO مفعّلة', 'SEO suggestions on', 'SEO activé') },
            { ok: features.productRecommendations, text: getLocalizedText('توصيات المنتجات مفعّلة', 'Recommendations on', 'Recommandations activées') },
            {
              ok: true,
              text: hasOpenAi
                ? getLocalizedText('وضع OpenAI مفعّل', 'OpenAI mode active', 'Mode OpenAI actif')
                : getLocalizedText('وضع محلي يعمل بدون مفتاح', 'Local mode works without a key', 'Mode local sans clé'),
            },
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
