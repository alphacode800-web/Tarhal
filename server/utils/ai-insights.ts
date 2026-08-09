import { getAdminData, ADMIN_KEYS } from '../database/admin-store.js';
import { getAiChatStats } from './ai-stats.js';
import { getAiConfig } from './ai-config.js';

export interface AiFeatureFlags {
  smartChat: boolean;
  sentimentAnalysis: boolean;
  seoSuggestions: boolean;
  productRecommendations: boolean;
  smartInventory: boolean;
  fraudDetection: boolean;
}

export const DEFAULT_AI_FEATURES: AiFeatureFlags = {
  smartChat: true,
  sentimentAnalysis: true,
  seoSuggestions: true,
  productRecommendations: true,
  smartInventory: false,
  fraudDetection: false,
};

export function mergeAiFeatures(features?: Partial<AiFeatureFlags> | null): AiFeatureFlags {
  return { ...DEFAULT_AI_FEATURES, ...(features || {}) };
}

type Sentiment = 'positive' | 'negative' | 'neutral';

const POSITIVE = [
  'ممتاز', 'رائع', 'شكرا', 'شكراً', ' Lovely', 'great', 'thanks', 'merci', 'excellent', 'amazing',
  'جيد', 'سعيد', 'حبيت', 'أعجبني', 'اعجبني', 'love', 'perfect', 'super',
];
const NEGATIVE = [
  'سيء', 'سئ', 'مشكلة', 'تأخر', 'فاشل', 'bad', 'terrible', 'worst', 'scam', 'احتيال',
  'غضبان', 'زعلان', 'لم يعجبني', 'disappoint', 'angry', 'refund', 'استرجاع',
];

export function analyzeSentiment(text: string): Sentiment {
  const t = text.toLowerCase();
  let score = 0;
  for (const w of POSITIVE) if (t.includes(w.toLowerCase())) score += 1;
  for (const w of NEGATIVE) if (t.includes(w.toLowerCase())) score -= 1;
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

function pickName(obj: { ar?: string; en?: string; fr?: string } | undefined): string {
  if (!obj) return '';
  return obj.ar || obj.en || obj.fr || '';
}

export async function buildAiInsights() {
  const [config, chatStats, settings, offers, hotels, offices, visitorStats] = await Promise.all([
    getAiConfig(),
    getAiChatStats(),
    getAdminData<any>(ADMIN_KEYS.settings),
    getAdminData<any[]>(ADMIN_KEYS.offers),
    getAdminData<any[]>(ADMIN_KEYS.hotels),
    getAdminData<any[]>(ADMIN_KEYS.offices),
    getAdminData<{ baseCount?: number; visits?: number }>(ADMIN_KEYS.visitorStats),
  ]);

  const features = mergeAiFeatures((settings?.aiAssistant as any)?.features);
  const activeOffers = (offers ?? []).filter((o) => o.isActive !== false);
  const activeHotels = (hotels ?? []).filter((h) => h.isActive !== false);
  const platformViews = (visitorStats?.baseCount || 10000) + (visitorStats?.visits || 0);

  // Sentiment from offer titles/descriptions is weak; use chat volume as proxy + sample contact-like text from settings
  // Better: scan recent offer descriptions + office names for demo signals, and use chat count
  let positive = 0;
  let negative = 0;
  let neutral = 0;

  if (features.sentimentAnalysis) {
    const samples: string[] = [];
    for (const o of activeOffers.slice(0, 20)) {
      samples.push(pickName(o.description) || pickName(o.title));
    }
    // Synthetic baseline from chat activity (neutral until real message store exists)
    neutral += Math.max(0, chatStats.totalChats);
    for (const s of samples) {
      if (!s.trim()) continue;
      const sent = analyzeSentiment(s);
      if (sent === 'positive') positive += 1;
      else if (sent === 'negative') negative += 1;
      else neutral += 1;
    }
  }

  // Inventory-style health for tourism catalog
  const missingOfferImage = activeOffers.filter((o) => !o.imageUrl).length;
  const missingHotelImage = activeHotels.filter((h) => !h.imageUrl && !(h.images && h.images.length)).length;
  const inactiveOffers = (offers ?? []).filter((o) => o.isActive === false).length;
  const officesWithoutPhone = (offices ?? []).filter((o) => o.isActive !== false && !o.phone).length;
  const critical = missingOfferImage + (officesWithoutPhone > 3 ? 1 : 0);
  const low = missingHotelImage + Math.min(inactiveOffers, 5);

  // Fraud signals from payments if available
  let payments: any[] = [];
  try {
    const { PaymentModel } = await import('../models/Payment.js');
    payments = await PaymentModel.list({ limit: 100 });
  } catch {
    payments = [];
  }

  const pending = payments.filter((p) => p.status === 'pending');
  const failed = payments.filter((p) => p.status === 'failed');
  const highAmount = payments.filter((p) => Number(p.amount) >= 50000); // cents or units
  const suspicious = [
    ...failed.map((p) => ({
      id: p.id,
      reason: 'failed_payment',
      amount: p.amount,
      status: p.status,
    })),
    ...highAmount.filter((p) => p.status === 'pending').map((p) => ({
      id: p.id,
      reason: 'high_pending_amount',
      amount: p.amount,
      status: p.status,
    })),
  ].slice(0, 20);

  // SEO suggestions
  const seoSuggestions: Array<{ severity: 'info' | 'warn' | 'good'; ar: string; en: string; fr: string }> = [];
  const siteTitle = settings?.siteTitle || '';
  const meta = settings?.metaDescription || '';
  if (!siteTitle || siteTitle.length < 8) {
    seoSuggestions.push({
      severity: 'warn',
      ar: 'عنوان الموقع قصير أو فارغ — أضف عنواناً واضحاً يتضمن اسم العلامة.',
      en: 'Site title is missing or too short — add a clear brand title.',
      fr: 'Le titre du site est manquant ou trop court.',
    });
  } else {
    seoSuggestions.push({
      severity: 'good',
      ar: `عنوان الموقع مضبوط: «${siteTitle}»`,
      en: `Site title looks good: “${siteTitle}”`,
      fr: `Titre du site OK : « ${siteTitle} »`,
    });
  }
  if (!meta || meta.length < 50) {
    seoSuggestions.push({
      severity: 'warn',
      ar: 'الوصف التعريفي (meta) قصير — يُفضّل 120–160 حرفاً لتحسين الظهور في البحث.',
      en: 'Meta description is short — aim for 120–160 characters.',
      fr: 'La meta description est courte — visez 120–160 caractères.',
    });
  }
  if (missingOfferImage > 0) {
    seoSuggestions.push({
      severity: 'warn',
      ar: `${missingOfferImage} عرض بدون صورة رئيسية — الصور تحسّن الظهور والنقرات.`,
      en: `${missingOfferImage} offers lack a main image — images improve SEO & CTR.`,
      fr: `${missingOfferImage} offres sans image principale.`,
    });
  }
  const thinOffers = activeOffers.filter((o) => (pickName(o.description) || '').length < 40).length;
  if (thinOffers > 0) {
    seoSuggestions.push({
      severity: 'info',
      ar: `${thinOffers} عرض بوصف قصير — أطل أوصاف العروض بكلمات مفتاحية للوجهات.`,
      en: `${thinOffers} offers have thin descriptions — expand with destination keywords.`,
      fr: `${thinOffers} offres avec description courte.`,
    });
  }
  if (seoSuggestions.length < 2) {
    seoSuggestions.push({
      severity: 'good',
      ar: 'الكتالوج جاهز نسبياً لمحركات البحث. راجع العناوين بانتظام.',
      en: 'Catalog is reasonably SEO-ready. Review titles regularly.',
      fr: 'Le catalogue est plutôt prêt pour le SEO.',
    });
  }

  // Recommended offers for homepage / chat
  const recommendedOffers = activeOffers
    .slice()
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(b.price || 0) - Number(a.price || 0))
    .slice(0, 6)
    .map((o) => ({
      id: o.id,
      title: o.title,
      price: o.priceUSD ?? o.price,
      imageUrl: o.imageUrl,
      countryId: o.countryId,
      durationDays: o.durationDays ?? o.duration,
    }));

  const monthMessages = chatStats.todayChats + chatStats.totalChats; // approximate "month" from available stats
  const orderActivity = pending.length + failed.length;

  const summaryAr = `خلال الفترة الأخيرة: ${monthMessages} رسالة عبر المساعد، ${positive} تقييم إيجابي، ${platformViews.toLocaleString('ar-EG')} مشاهدة للمنصة، و${orderActivity} نشاط طلبات.`;
  const summaryEn = `Recently: ${monthMessages} assistant messages, ${positive} positive signals, ${platformViews.toLocaleString('en-US')} platform views, and ${orderActivity} order activities.`;
  const summaryFr = `Récemment : ${monthMessages} messages assistant, ${positive} signaux positifs, ${platformViews.toLocaleString('fr-FR')} vues, et ${orderActivity} activités de commande.`;

  return {
    features,
    chatReady: config.enabled && features.smartChat,
    insights: {
      monthMessages,
      sentiment: { positive, negative, neutral },
      platformViews,
      orderActivity,
      pendingOrders: pending.length,
      activeOffers: activeOffers.length,
      activeHotels: activeHotels.length,
      summary: { ar: summaryAr, en: summaryEn, fr: summaryFr },
    },
    inventory: {
      critical,
      low,
      missingOfferImage,
      missingHotelImage,
      inactiveOffers,
      officesWithoutPhone,
    },
    fraud: {
      checked: payments.length,
      suspiciousCount: suspicious.length,
      items: suspicious,
    },
    seoSuggestions,
    recommendedOffers,
  };
}
