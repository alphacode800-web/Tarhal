export const ANNOUNCEMENT_SPEED_OPTIONS = [
  { value: 15, label: { ar: 'بطيء', en: 'Slow', fr: 'Lent' } },
  { value: 30, label: { ar: 'متوسط', en: 'Medium', fr: 'Moyen' } },
  { value: 50, label: { ar: 'سريع', en: 'Fast', fr: 'Rapide' } },
] as const;

export const ANNOUNCEMENT_FONT_OPTIONS = [
  { value: 14, label: { ar: 'صغير', en: 'Small', fr: 'Petit' } },
  { value: 16, label: { ar: 'متوسط', en: 'Medium', fr: 'Moyen' } },
  { value: 20, label: { ar: 'كبير', en: 'Large', fr: 'Grand' } },
  { value: 24, label: { ar: 'كبير جداً', en: 'Extra large', fr: 'Très grand' } },
] as const;

export type AnnouncementThemeId = 'ciar' | 'orange' | 'dark' | 'light';

export const ANNOUNCEMENT_THEMES: Record<
  AnnouncementThemeId,
  {
    label: { ar: string; en: string; fr: string };
    backgroundFrom: string;
    backgroundTo: string;
    textColor: string;
    accentColor: string;
  }
> = {
  ciar: {
    label: { ar: 'ألوان الموقع (أزرق)', en: 'Site blue', fr: 'Bleu du site' },
    backgroundFrom: '#1e3a5f',
    backgroundTo: '#0f2744',
    textColor: '#ffffff',
    accentColor: '#f97316',
  },
  orange: {
    label: { ar: 'برتقالي', en: 'Orange', fr: 'Orange' },
    backgroundFrom: '#ea580c',
    backgroundTo: '#c2410c',
    textColor: '#ffffff',
    accentColor: '#ffffff',
  },
  dark: {
    label: { ar: 'داكن', en: 'Dark', fr: 'Sombre' },
    backgroundFrom: '#0f172a',
    backgroundTo: '#020617',
    textColor: '#ffffff',
    accentColor: '#f97316',
  },
  light: {
    label: { ar: 'فاتح', en: 'Light', fr: 'Clair' },
    backgroundFrom: '#f1f5f9',
    backgroundTo: '#e2e8f0',
    textColor: '#1e3a5f',
    accentColor: '#f97316',
  },
};

export const SOCIAL_LINK_PLACEHOLDERS: Record<string, { ar: string; en: string; fr: string }> = {
  telegram: { ar: 'رابط حساب تيليجرام', en: 'Telegram profile link', fr: 'Lien Telegram' },
  facebook: { ar: 'رابط صفحة فيسبوك', en: 'Facebook page link', fr: 'Lien Facebook' },
  instagram: { ar: 'رابط حساب إنستغرام', en: 'Instagram profile link', fr: 'Lien Instagram' },
  twitter: { ar: 'رابط حساب X', en: 'X profile link', fr: 'Lien X' },
  linkedin: { ar: 'رابط لينكد إن', en: 'LinkedIn link', fr: 'Lien LinkedIn' },
  youtube: { ar: 'رابط قناة يوتيوب', en: 'YouTube channel link', fr: 'Lien YouTube' },
  tiktok: { ar: 'رابط حساب تيك توك', en: 'TikTok profile link', fr: 'Lien TikTok' },
  snapchat: { ar: 'رابط سناب شات', en: 'Snapchat link', fr: 'Lien Snapchat' },
  pinterest: { ar: 'رابط بنترست', en: 'Pinterest link', fr: 'Lien Pinterest' },
  threads: { ar: 'رابط ثريدز', en: 'Threads link', fr: 'Lien Threads' },
};
