import { getAdminData, ADMIN_KEYS } from '../database/admin-store.js';

type Lang = 'ar' | 'en' | 'fr';

function pickName(
  obj: { ar?: string; en?: string; fr?: string } | undefined,
  lang: Lang
): string {
  if (!obj) return '';
  return obj[lang] || obj.en || obj.ar || obj.fr || '';
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

/**
 * Build a compact platform context string for the AI system prompt.
 * Keeps token usage low while grounding answers in real catalog data.
 */
export async function buildPlatformContext(lang: Lang): Promise<string> {
  const [countries, offers, hotels, settings] = await Promise.all([
    getAdminData<any[]>(ADMIN_KEYS.countries),
    getAdminData<any[]>(ADMIN_KEYS.offers),
    getAdminData<any[]>(ADMIN_KEYS.hotels),
    getAdminData<any>(ADMIN_KEYS.settings),
  ]);

  const activeCountries = (countries ?? [])
    .filter((c) => c.isActive !== false)
    .slice(0, 20)
    .map((c) => {
      const name = pickName(c.name, lang);
      const capital = pickName(c.capital, lang);
      return `- ${name}${capital ? ` (${capital})` : ''}`;
    });

  const activeOffers = (offers ?? [])
    .filter((o) => o.isActive !== false)
    .slice(0, 15)
    .map((o) => {
      const title = pickName(o.title, lang);
      const price = o.priceUSD ?? o.price ?? '';
      const days = o.duration ?? '';
      return `- ${title}${days ? ` · ${days} days` : ''}${price ? ` · from $${price}` : ''}`;
    });

  const activeHotels = (hotels ?? [])
    .filter((h) => h.isActive !== false)
    .slice(0, 10)
    .map((h) => `- ${pickName(h.name, lang)} · ${pickName(h.city, lang) || pickName(h.country, lang)}`);

  const siteTitle = settings?.siteTitle ?? 'CIAR Tourism';
  const services = [
    'Tour offers (/offers)',
    'Hotels (/hotels)',
    'Car rentals (/car-rentals)',
    'Flight tickets (/flight-tickets)',
    'Travel visas (/travel-visa)',
    'Travel insurance (/travel-insurance)',
    'Taxi & delivery (/taxi-delivery)',
    'Travel offices by country (/offices)',
  ];

  const lines = [
    `Platform: ${siteTitle} — international travel agency.`,
    `Services: ${services.join(', ')}.`,
    `Destinations (${activeCountries.length}):`,
    ...activeCountries,
  ];

  if (activeOffers.length) {
    lines.push(`Tour offers (${activeOffers.length}):`, ...activeOffers);
  }
  if (activeHotels.length) {
    lines.push(`Hotels (${activeHotels.length}):`, ...activeHotels);
  }

  return truncate(lines.join('\n'), 4000);
}

let cachedContext: { lang: string; text: string; at: number } | null = null;
const CONTEXT_TTL_MS = 5 * 60_000;

export function invalidateAiContextCache(): void {
  cachedContext = null;
}

export async function getCachedPlatformContext(lang: Lang): Promise<string> {
  const now = Date.now();
  if (cachedContext && cachedContext.lang === lang && now - cachedContext.at < CONTEXT_TTL_MS) {
    return cachedContext.text;
  }
  const text = await buildPlatformContext(lang);
  cachedContext = { lang, text, at: now };
  return text;
}

export function buildSystemPrompt(lang: Lang, context: string): string {
  const langInstruction =
    lang === 'ar'
      ? 'رد دائماً باللغة العربية.'
      : lang === 'fr'
        ? 'Répondez toujours en français.'
        : 'Always respond in English.';

  return `You are CIAR Tourism's AI travel assistant — knowledgeable, concise, and helpful.

${langInstruction}

Rules:
- Answer only about travel, CIAR Tourism services, destinations, bookings, and related topics.
- Use the platform data below when recommending destinations or offers.
- When unsure, suggest visiting the relevant page or contacting support via WhatsApp.
- Keep answers under 150 words unless the user asks for detail.
- Never invent prices, availability, or policies not in the data.
- For bookings, guide users to the correct page (e.g. /offers, /hotels, /contact).
- When mentioning pages, use full paths like /offers so users can navigate.
- Be warm and professional — you represent a premium travel agency.

Platform data:
${context}`;
}
