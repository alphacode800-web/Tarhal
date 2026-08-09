import { getAdminData, ADMIN_KEYS } from '../database/admin-store.js';

type Lang = 'ar' | 'en' | 'fr';

type Named = { ar?: string; en?: string; fr?: string };

interface Destination {
  id: string;
  name: string;
  names: string[];
  hasOffice: boolean;
}

interface Catalog {
  destinations: Destination[];
  offers: Array<{ title: string; price?: string | number; days?: string | number; countryId?: string }>;
  hotels: Array<{ name: string; place: string }>;
  officesCount: number;
  whatsapp?: string;
  phone?: string;
}

function pick(obj: Named | undefined, lang: Lang): string {
  if (!obj) return '';
  return obj[lang] || obj.en || obj.ar || obj.fr || '';
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .trim();
}

function includesAny(text: string, words: string[]): boolean {
  const t = normalize(text);
  return words.some((w) => t.includes(normalize(w)));
}

async function loadCatalog(lang: Lang): Promise<Catalog> {
  const [countries, offers, hotels, offices, settings] = await Promise.all([
    getAdminData<any[]>(ADMIN_KEYS.countries),
    getAdminData<any[]>(ADMIN_KEYS.offers),
    getAdminData<any[]>(ADMIN_KEYS.hotels),
    getAdminData<any[]>(ADMIN_KEYS.offices),
    getAdminData<any>(ADMIN_KEYS.settings),
  ]);

  const officeCountryIds = new Set(
    (offices ?? []).filter((o) => o.isActive !== false).map((o) => o.countryId).filter(Boolean)
  );

  const destinations: Destination[] = (countries ?? [])
    .filter((c) => c.isActive !== false)
    .map((c) => {
      const names = [c.name?.ar, c.name?.en, c.name?.fr].filter(Boolean) as string[];
      return {
        id: c.id as string,
        name: pick(c.name, lang),
        names,
        hasOffice: officeCountryIds.has(c.id),
      };
    })
    .filter((d) => d.name && d.id);

  const activeOffers = (offers ?? [])
    .filter((o) => o.isActive !== false)
    .slice(0, 12)
    .map((o) => ({
      title: pick(o.title, lang),
      price: o.priceUSD ?? o.price,
      days: o.durationDays ?? o.duration,
      countryId: o.countryId,
    }))
    .filter((o) => o.title);

  const activeHotels = (hotels ?? [])
    .filter((h) => h.isActive !== false)
    .slice(0, 10)
    .map((h) => ({
      name: pick(h.name, lang),
      place: pick(h.city, lang) || pick(h.country, lang),
    }))
    .filter((h) => h.name);

  return {
    destinations,
    offers: activeOffers,
    hotels: activeHotels,
    officesCount: officeCountryIds.size,
    whatsapp: settings?.contactWhatsapp || settings?.whatsapp,
    phone: settings?.contactPhone || settings?.phone,
  };
}

function formatOfferLine(o: Catalog['offers'][0], lang: Lang): string {
  const parts = [o.title];
  if (o.days) {
    parts.push(
      lang === 'ar' ? `${o.days} أيام` : lang === 'fr' ? `${o.days} jours` : `${o.days} days`
    );
  }
  if (o.price) parts.push(`$${o.price}`);
  return `- ${parts.join(' · ')}`;
}

function contactHint(catalog: Catalog, lang: Lang): string {
  if (catalog.whatsapp) {
    return lang === 'ar'
      ? `للتواصل السريع: واتساب ${catalog.whatsapp}`
      : lang === 'fr'
        ? `Contact rapide : WhatsApp ${catalog.whatsapp}`
        : `Quick contact: WhatsApp ${catalog.whatsapp}`;
  }
  if (catalog.phone) {
    return lang === 'ar'
      ? `للتواصل: ${catalog.phone}`
      : lang === 'fr'
        ? `Contact : ${catalog.phone}`
        : `Contact: ${catalog.phone}`;
  }
  return lang === 'ar'
    ? 'يمكنك التواصل عبر صفحة /contact'
    : lang === 'fr'
      ? 'Vous pouvez nous contacter via /contact'
      : 'You can reach us via /contact';
}

function matchDestination(text: string, catalog: Catalog): Destination | null {
  const normalized = normalize(text);
  // Prefer longer names first (e.g. United Arab Emirates before Emirates-like short matches)
  const sorted = [...catalog.destinations].sort(
    (a, b) => Math.max(...b.names.map((n) => n.length)) - Math.max(...a.names.map((n) => n.length))
  );
  for (const dest of sorted) {
    if (dest.names.some((n) => normalized.includes(normalize(n)))) return dest;
  }
  return null;
}

function replyOffers(catalog: Catalog, lang: Lang): string {
  if (!catalog.offers.length) {
    return lang === 'ar'
      ? `حالياً لا توجد عروض ظاهرة في الكتالوج. تصفّح /offers أو ${contactHint(catalog, lang)}.`
      : lang === 'fr'
        ? `Aucune offre visible pour le moment. Parcourez /offers ou ${contactHint(catalog, lang)}.`
        : `No offers are listed right now. Browse /offers or ${contactHint(catalog, lang)}.`;
  }
  const list = catalog.offers.slice(0, 5).map((o) => formatOfferLine(o, lang)).join('\n');
  return lang === 'ar'
    ? `إليك أبرز العروض المتاحة:\n${list}\n\nالمزيد في /offers — أو اسألني عن وجهة معيّنة.`
    : lang === 'fr'
      ? `Voici nos principales offres :\n${list}\n\nPlus sur /offers — ou demandez une destination.`
      : `Here are our top offers:\n${list}\n\nSee more at /offers — or ask about a destination.`;
}

function replyDestinations(catalog: Catalog, lang: Lang): string {
  if (!catalog.destinations.length) {
    return lang === 'ar'
      ? 'تصفّح الوجهات عبر /offices أو /offers.'
      : lang === 'fr'
        ? 'Parcourez les destinations via /offices ou /offers.'
        : 'Browse destinations via /offices or /offers.';
  }
  const names = catalog.destinations
    .slice(0, 12)
    .map((d) => d.name)
    .join(lang === 'ar' ? '، ' : ', ');
  return lang === 'ar'
    ? `نعم، نغطّي وجهات كثيرة مثل: ${names} وغيرها.\n\nاختر مكتباً من /offices أو عروضاً من /offers.`
    : lang === 'fr'
      ? `Oui, nous couvrons notamment : ${names}, et plus encore.\n\nBureaux : /offices · Offres : /offers.`
      : `Yes — we cover destinations such as: ${names}, and more.\n\nOffices: /offices · Offers: /offers.`;
}

function replyBooking(lang: Lang): string {
  return lang === 'ar'
    ? 'للحجز:\n1) اختر عرضاً من /offers أو فندقاً من /hotels\n2) افتح صفحة التفاصيل واتبع خطوات الحجز\n3) أو راسلنا عبر /contact لنجهّز طلبك.'
    : lang === 'fr'
      ? 'Pour réserver :\n1) Choisissez une offre (/offers) ou un hôtel (/hotels)\n2) Ouvrez la page détail et suivez les étapes\n3) Ou écrivez-nous via /contact.'
      : 'To book:\n1) Pick an offer at /offers or a hotel at /hotels\n2) Open the detail page and follow the steps\n3) Or message us via /contact.';
}

function replyServices(lang: Lang): string {
  return lang === 'ar'
    ? 'خدمات CIAR Tourism:\n• عروض سياحية /offers\n• فنادق /hotels\n• تأجير سيارات /car-rentals\n• تذاكر طيران /flight-tickets\n• تأشيرات /travel-visa\n• تأمين سفر /travel-insurance\n• تاكسي وتوصيل /taxi-delivery\n• مكاتب السفر /offices'
    : lang === 'fr'
      ? 'Services CIAR Tourism :\n• Offres /offers\n• Hôtels /hotels\n• Location de voitures /car-rentals\n• Vols /flight-tickets\n• Visas /travel-visa\n• Assurance /travel-insurance\n• Taxi & livraison /taxi-delivery\n• Bureaux /offices'
      : 'CIAR Tourism services:\n• Tour offers /offers\n• Hotels /hotels\n• Car rentals /car-rentals\n• Flights /flight-tickets\n• Visas /travel-visa\n• Travel insurance /travel-insurance\n• Taxi & delivery /taxi-delivery\n• Travel offices /offices';
}

function replyHotels(catalog: Catalog, lang: Lang): string {
  if (!catalog.hotels.length) {
    return lang === 'ar'
      ? 'تصفّح الفنادق من /hotels أو أخبرني بالمدينة المطلوبة.'
      : lang === 'fr'
        ? 'Parcourez les hôtels sur /hotels ou indiquez une ville.'
        : 'Browse hotels at /hotels or tell me the city you need.';
  }
  const list = catalog.hotels
    .slice(0, 5)
    .map((h) => `- ${h.name}${h.place ? ` · ${h.place}` : ''}`)
    .join('\n');
  return lang === 'ar'
    ? `فنادق متاحة:\n${list}\n\nالمزيد في /hotels.`
    : lang === 'fr'
      ? `Hôtels disponibles :\n${list}\n\nPlus sur /hotels.`
      : `Available hotels:\n${list}\n\nMore at /hotels.`;
}

function replyGreeting(lang: Lang): string {
  return lang === 'ar'
    ? 'هلا! أنا مساعد CIAR Tourism. اسألني عن الوجهات، العروض، الفنادق، الحجز أو خدماتنا.'
    : lang === 'fr'
      ? 'Bonjour ! Je suis l’assistant CIAR Tourism. Demandez destinations, offres, hôtels, réservation ou services.'
      : "Hi! I'm the CIAR Tourism assistant. Ask about destinations, offers, hotels, booking, or our services.";
}

function replyHelp(lang: Lang): string {
  return lang === 'ar'
    ? 'يمكنني مساعدتك في:\n• العروض السياحية\n• الوجهات والمكاتب\n• الفنادق والحجز\n• التأشيرات والطيران والخدمات\n\nجرّب مثلاً: «هل يمكنني السفر إلى إندونيسيا؟» أو «ما أفضل العروض؟»'
    : lang === 'fr'
      ? 'Je peux vous aider pour :\n• Offres\n• Destinations et bureaux\n• Hôtels et réservation\n• Visas, vols et services\n\nEssayez : « Puis-je voyager en Indonésie ? » ou « Quelles offres ? »'
      : 'I can help with:\n• Tour offers\n• Destinations & offices\n• Hotels & booking\n• Visas, flights & services\n\nTry: “Can I travel to Indonesia?” or “What offers do you have?”';
}

function replyAboutDestination(dest: Destination, catalog: Catalog, lang: Lang): string {
  const related = catalog.offers.filter(
    (o) =>
      o.countryId === dest.id ||
      o.title.toLowerCase().includes(dest.name.toLowerCase()) ||
      dest.names.some((n) => o.title.toLowerCase().includes(n.toLowerCase()))
  );
  const page = `/offices/${dest.id}`;

  if (related.length) {
    const list = related.slice(0, 4).map((o) => formatOfferLine(o, lang)).join('\n');
    return lang === 'ar'
      ? `نعم، ${dest.name} من وجهاتنا. عروض مرتبطة:\n${list}\n\nصفحة الوجهة: ${page}\nالعروض: /offers`
      : lang === 'fr'
        ? `Oui, ${dest.name} fait partie de nos destinations. Offres liées :\n${list}\n\nPage : ${page}\nOffres : /offers`
        : `Yes — ${dest.name} is one of our destinations. Related offers:\n${list}\n\nPage: ${page}\nOffers: /offers`;
  }

  if (dest.hasOffice) {
    return lang === 'ar'
      ? `نعم، يمكنك السفر إلى ${dest.name} عبر CIAR Tourism.\nلدينا مكتب هناك — افتح ${page} للاطلاع على التفاصيل والحجز، أو تصفّح العروض في /offers.\n${contactHint(catalog, lang)}`
      : lang === 'fr'
        ? `Oui, vous pouvez voyager vers ${dest.name} avec CIAR Tourism.\nNous avons un bureau là-bas — ouvrez ${page} pour les détails, ou /offers.\n${contactHint(catalog, lang)}`
        : `Yes — you can travel to ${dest.name} with CIAR Tourism.\nWe have an office there — open ${page} for details, or browse /offers.\n${contactHint(catalog, lang)}`;
  }

  return lang === 'ar'
    ? `نعم، ${dest.name} ضمن وجهاتنا. تصفّح ${page} والعروض في /offers، أو ${contactHint(catalog, lang)}.`
    : lang === 'fr'
      ? `Oui, ${dest.name} fait partie de nos destinations. Voir ${page} et /offers, ou ${contactHint(catalog, lang)}.`
      : `Yes — ${dest.name} is one of our destinations. See ${page} and /offers, or ${contactHint(catalog, lang)}.`;
}

function replyUnknownDestination(hint: string | null, catalog: Catalog, lang: Lang): string {
  const samples = catalog.destinations
    .slice(0, 8)
    .map((d) => d.name)
    .join(lang === 'ar' ? '، ' : ', ');
  if (hint) {
    return lang === 'ar'
      ? `حالياً لا أجد «${hint}» ضمن وجهاتنا الظاهرة. من الوجهات المتوفرة: ${samples}.\nتصفّح /offices أو ${contactHint(catalog, lang)}.`
      : lang === 'fr'
        ? `Je ne trouve pas « ${hint} » parmi nos destinations. Exemples : ${samples}.\nVoir /offices ou ${contactHint(catalog, lang)}.`
        : `I don’t currently see “${hint}” among our destinations. Examples: ${samples}.\nBrowse /offices or ${contactHint(catalog, lang)}.`;
  }
  return lang === 'ar'
    ? `أخبرني باسم الدولة أو المدينة. من وجهاتنا: ${samples}.\nأو تصفّح /offices.`
    : lang === 'fr'
      ? `Indiquez un pays ou une ville. Exemples : ${samples}.\nOu parcourez /offices.`
      : `Tell me a country or city. Examples: ${samples}.\nOr browse /offices.`;
}

function extractTravelTarget(text: string): string | null {
  const patterns = [
    /(?:الى|إلى|to|vers)\s+([^\s؟?!.،,]{2,40})/i,
    /(?:سفر|السفر|travel|voyage|voyager)\s+(?:الى|إلى|to|vers)?\s*([^\s؟?!.،,]{2,40})/i,
    /(?:أريد|اريد|ابي|أبغى|want)\s+(?:السفر|سفر|travel)?\s*(?:الى|إلى|to|vers)?\s*([^\s؟?!.،,]{2,40})/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

/**
 * Local travel assistant — answers from live catalog data when OpenAI is unavailable.
 */
export async function generateLocalReply(
  userText: string,
  lang: Lang,
  _userCountry?: string
): Promise<string> {
  const text = userText.trim();
  const catalog = await loadCatalog(lang);

  const dest = matchDestination(text, catalog);
  const travelIntent = includesAny(text, [
    'سفر',
    'اسافر',
    'أسافر',
    'اريد',
    'أريد',
    'هل يمكن',
    'ممكن',
    'travel',
    'trip',
    'visit',
    'go to',
    'voyage',
    'visiter',
    'الى',
    'إلى',
  ]);
  const mentionsDest = Boolean(
    dest && dest.names.some((n) => normalize(text).includes(normalize(n)))
  );

  // Country-specific questions first (e.g. travel to Indonesia)
  if (dest && (travelIntent || mentionsDest)) {
    const listingAllDestinations =
      includesAny(text, ['وجهات', 'دول', 'destinations', 'countries', 'تغطون']) && !mentionsDest;
    if (!listingAllDestinations) {
      return replyAboutDestination(dest, catalog, lang);
    }
  }

  if (
    includesAny(text, [
      'هلا',
      'مرحبا',
      'السلام',
      'اهلا',
      'أهلين',
      'hi',
      'hello',
      'hey',
      'bonjour',
      'salut',
      'bonsoir',
    ]) &&
    text.length < 40 &&
    !dest
  ) {
    return replyGreeting(lang);
  }

  if (includesAny(text, ['مساعدة', 'help', 'aide', 'ماذا تستطيع', 'what can you'])) {
    return replyHelp(lang);
  }

  if (
    includesAny(text, [
      'عرض',
      'عروض',
      'باقة',
      'offer',
      'package',
      'tour',
      'offre',
      'forfait',
      'سعر',
      'price',
      'prix',
      'خصم',
      'discount',
    ])
  ) {
    return replyOffers(catalog, lang);
  }

  if (
    includesAny(text, [
      'وجهة',
      'وجهات',
      'دولة',
      'دول',
      'بلد',
      'destination',
      'country',
      'countries',
      'أين تسافر',
      'تغطون',
      'cover',
    ])
  ) {
    return replyDestinations(catalog, lang);
  }

  if (
    includesAny(text, [
      'حجز',
      'احجز',
      'book',
      'booking',
      'reserve',
      'réserver',
      'reservation',
      'كيف أحجز',
    ])
  ) {
    return replyBooking(lang);
  }

  if (
    includesAny(text, [
      'فندق',
      'فنادق',
      'hotel',
      'hôtel',
      'إقامة',
      'سكن',
      'accommodation',
    ])
  ) {
    return replyHotels(catalog, lang);
  }

  if (
    includesAny(text, [
      'خدمة',
      'خدمات',
      'تأشير',
      'visa',
      'طيران',
      'flight',
      'تأمين',
      'insurance',
      'سيارة',
      'car',
      'تاكسي',
      'taxi',
      'service',
    ])
  ) {
    return replyServices(lang);
  }

  if (
    includesAny(text, [
      'مكتب',
      'مكاتب',
      'office',
      'bureau',
      'تواصل',
      'واتساب',
      'whatsapp',
      'contact',
      'هاتف',
      'phone',
    ])
  ) {
    const offices =
      catalog.officesCount > 0
        ? lang === 'ar'
          ? `لدينا ${catalog.officesCount} مكتباً — تصفّحها من /offices.`
          : lang === 'fr'
            ? `Nous avons ${catalog.officesCount} bureaux — voir /offices.`
            : `We have ${catalog.officesCount} offices — see /offices.`
        : lang === 'ar'
          ? 'تصفّح مكاتبنا من /offices.'
          : lang === 'fr'
            ? 'Parcourez nos bureaux sur /offices.'
            : 'Browse our offices at /offices.';
    return `${offices}\n${contactHint(catalog, lang)}`;
  }

  if (travelIntent && !dest) {
    return replyUnknownDestination(extractTravelTarget(text), catalog, lang);
  }

  const tip =
    catalog.offers.length > 0
      ? lang === 'ar'
        ? `\nمن العروض الحالية: ${catalog.offers[0].title}. المزيد في /offers.`
        : lang === 'fr'
          ? `\nOffre du moment : ${catalog.offers[0].title}. Plus sur /offers.`
          : `\nCurrent highlight: ${catalog.offers[0].title}. More at /offers.`
      : '';

  return lang === 'ar'
    ? `فهمت سؤالك. يمكنني المساعدة حول العروض، الوجهات، الفنادق، الحجز والخدمات.${tip}\n${contactHint(catalog, lang)}`
    : lang === 'fr'
      ? `Je peux vous aider sur les offres, destinations, hôtels, réservation et services.${tip}\n${contactHint(catalog, lang)}`
      : `I can help with offers, destinations, hotels, booking, and services.${tip}\n${contactHint(catalog, lang)}`;
}
