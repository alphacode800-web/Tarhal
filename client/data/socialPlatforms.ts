export interface SocialLinks {
  whatsapp?: string;
  telegram?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
  pinterest?: string;
  threads?: string;
}

export interface SiteContact {
  email: string;
  phone: string;
  whatsapp: string;
}

export const DEFAULT_CONTACT: SiteContact = {
  email: 'azasnaa628@gmail.com',
  phone: '00963993153333',
  whatsapp: '00963993153333',
};

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  whatsapp: DEFAULT_CONTACT.whatsapp,
  telegram: '',
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
  snapchat: '',
  pinterest: '',
  threads: '',
};

export type SocialPlatformKey = keyof SocialLinks;

export interface SocialPlatformMeta {
  key: SocialPlatformKey;
  name: { ar: string; en: string; fr: string };
  color: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformMeta[] = [
  { key: 'whatsapp', name: { ar: 'واتساب', en: 'WhatsApp', fr: 'WhatsApp' }, color: 'hover:bg-green-600' },
  { key: 'telegram', name: { ar: 'تيليجرام', en: 'Telegram', fr: 'Telegram' }, color: 'hover:bg-blue-500' },
  { key: 'facebook', name: { ar: 'فيسبوك', en: 'Facebook', fr: 'Facebook' }, color: 'hover:bg-blue-600' },
  { key: 'instagram', name: { ar: 'إنستغرام', en: 'Instagram', fr: 'Instagram' }, color: 'hover:bg-pink-500' },
  { key: 'twitter', name: { ar: 'تويتر', en: 'Twitter / X', fr: 'Twitter / X' }, color: 'hover:bg-sky-500' },
  { key: 'linkedin', name: { ar: 'لينكد إن', en: 'LinkedIn', fr: 'LinkedIn' }, color: 'hover:bg-blue-700' },
  { key: 'youtube', name: { ar: 'يوتيوب', en: 'YouTube', fr: 'YouTube' }, color: 'hover:bg-red-600' },
  { key: 'tiktok', name: { ar: 'تيك توك', en: 'TikTok', fr: 'TikTok' }, color: 'hover:bg-gray-800' },
  { key: 'snapchat', name: { ar: 'سناب شات', en: 'Snapchat', fr: 'Snapchat' }, color: 'hover:bg-yellow-400' },
  { key: 'pinterest', name: { ar: 'بنترست', en: 'Pinterest', fr: 'Pinterest' }, color: 'hover:bg-red-700' },
  { key: 'threads', name: { ar: 'ثريدز', en: 'Threads', fr: 'Threads' }, color: 'hover:bg-gray-700' },
];

export const SOCIAL_BRAND_SLUGS: Record<SocialPlatformKey, string> = {
  whatsapp: 'whatsapp',
  telegram: 'telegram',
  facebook: 'facebook',
  instagram: 'instagram',
  twitter: 'x',
  linkedin: 'linkedin',
  youtube: 'youtube',
  tiktok: 'tiktok',
  snapchat: 'snapchat',
  pinterest: 'pinterest',
  threads: 'threads',
};

/** Official brand hex colors (Simple Icons) */
export const SOCIAL_BRAND_COLORS: Record<SocialPlatformKey, string> = {
  whatsapp: '25D366',
  telegram: '26A5E4',
  facebook: '0866FF',
  instagram: 'E4405F',
  twitter: '000000',
  linkedin: '0A66C2',
  youtube: 'FF0000',
  tiktok: '000000',
  snapchat: 'FFFC00',
  pinterest: 'E60023',
  threads: '000000',
};

export function getSocialBrandIconUrl(
  platform: SocialPlatformKey,
  variant: 'brand' | 'white' = 'brand',
): string {
  const slug = SOCIAL_BRAND_SLUGS[platform];
  const color = variant === 'white' ? 'white' : SOCIAL_BRAND_COLORS[platform];
  return `https://cdn.simpleicons.org/${slug}/${color}`;
}

export function toWhatsAppUrl(value: string): string {
  if (value.startsWith('http')) return value;
  const digits = value.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '#';
}

export function mergeSocialLinks(links?: Partial<SocialLinks>): SocialLinks {
  return { ...DEFAULT_SOCIAL_LINKS, ...links };
}

export function resolveSocialUrl(
  key: SocialPlatformKey,
  links: SocialLinks,
  contact: SiteContact = DEFAULT_CONTACT,
): string {
  if (key === 'whatsapp') {
    const raw = links.whatsapp || contact.whatsapp || contact.phone;
    return raw ? toWhatsAppUrl(raw) : '#';
  }
  const raw = links[key]?.trim();
  return raw || '#';
}

export function getContactFromSettings(settings?: {
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
}): SiteContact {
  return {
    email: settings?.contactEmail || DEFAULT_CONTACT.email,
    phone: settings?.contactPhone || DEFAULT_CONTACT.phone,
    whatsapp: settings?.contactWhatsapp || settings?.contactPhone || DEFAULT_CONTACT.whatsapp,
  };
}
