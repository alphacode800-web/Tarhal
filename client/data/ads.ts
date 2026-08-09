export type AdPlacement =
  | 'home_after_services'
  | 'home_before_why'
  | 'offices_top'
  | 'offers_mid'
  | 'country_mid'
  | 'listing';

export type AdStatus = 'pending' | 'approved' | 'rejected';

export type AdvertiserType =
  | 'person'
  | 'company'
  | 'institution'
  | 'government'
  | 'ngo'
  | 'investor'
  | 'partner'
  | 'other';

export type AdContentType =
  | 'general'
  | 'fashion'
  | 'real_estate'
  | 'electronics'
  | 'services'
  | 'travel'
  | 'other';

export type AdDurationDays = 7 | 15 | 30 | 60 | 90;

export type AdSubmitVia = 'email' | 'whatsapp';

export const ADVERTISER_TYPES: Array<{
  id: AdvertiserType;
  ar: string;
  en: string;
  fr: string;
  icon: string;
}> = [
  { id: 'person', ar: 'شخص', en: 'Person', fr: 'Personne', icon: 'user' },
  { id: 'company', ar: 'شركة', en: 'Company', fr: 'Société', icon: 'building' },
  { id: 'institution', ar: 'مؤسسة', en: 'Institution', fr: 'Institution', icon: 'landmark' },
  { id: 'government', ar: 'جهة حكومية', en: 'Government', fr: 'Gouvernement', icon: 'landmark' },
  { id: 'ngo', ar: 'جمعية / منظمة', en: 'NGO / Association', fr: 'Association', icon: 'heart' },
  { id: 'investor', ar: 'مستثمر', en: 'Investor', fr: 'Investisseur', icon: 'trending' },
  { id: 'partner', ar: 'شريك', en: 'Partner', fr: 'Partenaire', icon: 'handshake' },
  { id: 'other', ar: 'أخرى', en: 'Other', fr: 'Autre', icon: 'more' },
];

export const AD_CONTENT_TYPES: Array<{
  id: AdContentType;
  ar: string;
  en: string;
  fr: string;
  hintAr: string;
  hintEn: string;
}> = [
  {
    id: 'general',
    ar: 'عام',
    en: 'General',
    fr: 'Général',
    hintAr: 'إعلان عام – وسوم ومواصفات',
    hintEn: 'General ad – tags and specs',
  },
  {
    id: 'fashion',
    ar: 'أزياء',
    en: 'Fashion',
    fr: 'Mode',
    hintAr: 'أزياء وملابس – مقاسات وألوان',
    hintEn: 'Fashion – sizes and colors',
  },
  {
    id: 'real_estate',
    ar: 'عقارات',
    en: 'Real estate',
    fr: 'Immobilier',
    hintAr: 'عقارات – موقع ومساحة',
    hintEn: 'Real estate – location and area',
  },
  {
    id: 'electronics',
    ar: 'إلكترونيات',
    en: 'Electronics',
    fr: 'Électronique',
    hintAr: 'إلكترونيات – مواصفات تقنية',
    hintEn: 'Electronics – tech specs',
  },
  {
    id: 'services',
    ar: 'خدمات',
    en: 'Services',
    fr: 'Services',
    hintAr: 'خدمات – نطاق التغطية',
    hintEn: 'Services – coverage area',
  },
  {
    id: 'travel',
    ar: 'سفر وسياحة',
    en: 'Travel',
    fr: 'Voyage',
    hintAr: 'عروض سفر – وجهة ومدة',
    hintEn: 'Travel offers – destination and duration',
  },
  {
    id: 'other',
    ar: 'أخرى',
    en: 'Other',
    fr: 'Autre',
    hintAr: 'تصنيف مخصص',
    hintEn: 'Custom category',
  },
];

export const AD_DURATIONS: Array<{ days: AdDurationDays; ar: string; en: string; fr: string }> = [
  { days: 7, ar: '7 أيام', en: '7 days', fr: '7 jours' },
  { days: 15, ar: '15 يوم', en: '15 days', fr: '15 jours' },
  { days: 30, ar: '30 يوم', en: '30 days', fr: '30 jours' },
  { days: 60, ar: '60 يوم', en: '60 days', fr: '60 jours' },
  { days: 90, ar: '90 يوم', en: '90 days', fr: '90 jours' },
];

export const AD_CURRENCIES = [
  { code: 'SAR', ar: 'الريال السعودي', en: 'Saudi Riyal', fr: 'Riyal saoudien', flag: '🇸🇦' },
  { code: 'USD', ar: 'دولار أمريكي', en: 'US Dollar', fr: 'Dollar US', flag: '🇺🇸' },
  { code: 'EUR', ar: 'يورو', en: 'Euro', fr: 'Euro', flag: '🇪🇺' },
  { code: 'SYP', ar: 'ليرة سورية', en: 'Syrian Pound', fr: 'Livre syrienne', flag: '🇸🇾' },
  { code: 'AED', ar: 'درهم إماراتي', en: 'UAE Dirham', fr: 'Dirham EAU', flag: '🇦🇪' },
] as const;

export const AD_PLACEMENTS: Array<{
  id: AdPlacement;
  ar: string;
  en: string;
  fr: string;
  hintAr: string;
  hintEn: string;
  basePriceSar: number;
}> = [
  {
    id: 'home_after_services',
    ar: 'الصفحة الرئيسية – بعد بطاقات الخدمات (الموضع الأول)',
    en: 'Home – after services cards (1st slot)',
    fr: 'Accueil – après les services (1er emplacement)',
    hintAr: 'يظهر بين قسم الخدمات والتوصيات الذكية',
    hintEn: 'Between services and smart recommendations',
    basePriceSar: 149,
  },
  {
    id: 'home_before_why',
    ar: 'الصفحة الرئيسية – قبل «لماذا تختارنا»',
    en: 'Home – before “Why choose us”',
    fr: 'Accueil – avant « Pourquoi nous »',
    hintAr: 'موضع بارز قبل قسم المزايا',
    hintEn: 'Prominent slot before features',
    basePriceSar: 129,
  },
  {
    id: 'offices_top',
    ar: 'صفحة المكاتب – أعلى الصفحة',
    en: 'Offices page – top',
    fr: 'Page bureaux – haut',
    hintAr: 'أعلى قائمة المكاتب السياحية',
    hintEn: 'Top of travel offices listing',
    basePriceSar: 99,
  },
  {
    id: 'offers_mid',
    ar: 'صفحة العروض – وسط المحتوى',
    en: 'Offers page – mid content',
    fr: 'Page offres – milieu',
    hintAr: 'بين أقسام تصفح العروض',
    hintEn: 'Between offer browsing sections',
    basePriceSar: 119,
  },
  {
    id: 'country_mid',
    ar: 'صفحة تفاصيل الدولة – وسط المحتوى',
    en: 'Country detail – mid content',
    fr: 'Détail pays – milieu',
    hintAr: 'داخل صفحة الدولة بين الأقسام',
    hintEn: 'Inside country page between sections',
    basePriceSar: 89,
  },
  {
    id: 'listing',
    ar: 'صفحة جميع الإعلانات',
    en: 'All ads listing',
    fr: 'Liste de toutes les annonces',
    hintAr: 'يظهر في دليل الإعلانات فقط',
    hintEn: 'Appears in the ads directory only',
    basePriceSar: 49,
  },
];

const DURATION_MULTIPLIER: Record<AdDurationDays, number> = {
  7: 0.4,
  15: 0.7,
  30: 1,
  60: 1.8,
  90: 2.5,
};

export function getPlacementLabel(id: AdPlacement, lang: 'ar' | 'en' | 'fr'): string {
  const item = AD_PLACEMENTS.find((p) => p.id === id);
  return item ? item[lang] : id;
}

export function getPlacementHint(id: AdPlacement, lang: 'ar' | 'en'): string {
  const item = AD_PLACEMENTS.find((p) => p.id === id);
  if (!item) return '';
  return lang === 'ar' ? item.hintAr : item.hintEn;
}

export function calculateAdFee(placement: AdPlacement, durationDays: AdDurationDays): number {
  const base = AD_PLACEMENTS.find((p) => p.id === placement)?.basePriceSar ?? 99;
  const mult = DURATION_MULTIPLIER[durationDays] ?? 1;
  return Math.round(base * mult);
}
