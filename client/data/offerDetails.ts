import type { AdminCountryData, TourOffer } from '@/services/dataManager';

export interface LocalizedText {
  ar: string;
  en: string;
  fr: string;
}

export interface LocalizedList {
  ar: string[];
  en: string[];
  fr: string[];
}

export interface TourItineraryDay {
  day: number;
  title: LocalizedText;
  description: LocalizedText;
}

export interface TourOfferDetails {
  where?: LocalizedText;
  what?: LocalizedText;
  how?: LocalizedText;
  when?: LocalizedText;
  withWhat?: LocalizedText;
  why?: LocalizedText;
  highlights?: LocalizedList;
  inclusions?: LocalizedList;
  exclusions?: LocalizedList;
  itinerary?: TourItineraryDay[];
  discountPercent?: number;
  discountLabel?: LocalizedText;
  originalPrice?: number;
  meetingPoint?: LocalizedText;
  groupSize?: LocalizedText;
  difficulty?: LocalizedText;
  languages?: LocalizedList;
  gallery?: string[];
  bestSeason?: LocalizedText;
  cancellationPolicy?: LocalizedText;
}

export interface ResolvedOfferDetails extends Required<
  Pick<
    TourOfferDetails,
    | 'where'
    | 'what'
    | 'how'
    | 'when'
    | 'withWhat'
    | 'why'
    | 'highlights'
    | 'inclusions'
    | 'exclusions'
    | 'itinerary'
    | 'meetingPoint'
    | 'groupSize'
    | 'difficulty'
    | 'languages'
    | 'gallery'
    | 'bestSeason'
    | 'cancellationPolicy'
  >
> {
  discountPercent: number;
  discountLabel?: LocalizedText;
  originalPrice?: number;
}

function pickLang<T extends LocalizedText | LocalizedList>(
  obj: T,
  lang: 'ar' | 'en' | 'fr',
): T extends LocalizedText ? string : string[] {
  if (Array.isArray((obj as LocalizedList).ar)) {
    const list = obj as LocalizedList;
    return (list[lang]?.length ? list[lang] : list.ar) as T extends LocalizedText ? string : string[];
  }
  const text = obj as LocalizedText;
  return (text[lang] || text.ar || text.en) as T extends LocalizedText ? string : string[];
}

export function getLocalizedOfferText(
  obj: LocalizedText | undefined,
  lang: 'ar' | 'en' | 'fr',
): string {
  if (!obj) return '';
  return obj[lang] || obj.ar || obj.en || '';
}

export function getLocalizedOfferList(
  obj: LocalizedList | undefined,
  lang: 'ar' | 'en' | 'fr',
): string[] {
  if (!obj) return [];
  return pickLang(obj, lang) as string[];
}

function countryName(country: AdminCountryData | null | undefined, lang: 'ar' | 'en' | 'fr') {
  if (!country) return lang === 'ar' ? 'الوجهة' : lang === 'fr' ? 'la destination' : 'the destination';
  return country.name[lang] || country.name.ar;
}

function capitalName(country: AdminCountryData | null | undefined, lang: 'ar' | 'en' | 'fr') {
  if (!country?.capital) return '';
  return country.capital[lang] || country.capital.ar;
}

function buildDefaultItinerary(
  offer: TourOffer,
  country: AdminCountryData | null | undefined,
): TourItineraryDay[] {
  const days = Math.max(1, offer.durationDays || 1);
  const name = country?.name || { ar: 'الوجهة', en: 'destination', fr: 'destination' };

  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    if (day === 1) {
      return {
        day,
        title: {
          ar: 'الوصول والاستقبال',
          en: 'Arrival & Welcome',
          fr: 'Arrivée et accueil',
        },
        description: {
          ar: `الاستقبال في ${name.ar}، تسجيل الوصول، وجولة تعريفية قصيرة بالمعالم القريبة.`,
          en: `Welcome in ${name.en}, check-in, and a short orientation tour of nearby landmarks.`,
          fr: `Accueil à ${name.fr}, enregistrement et courte visite d'orientation des environs.`,
        },
      };
    }
    if (day === days) {
      return {
        day,
        title: {
          ar: 'اليوم الأخير والمغادرة',
          en: 'Final Day & Departure',
          fr: 'Dernier jour et départ',
        },
        description: {
          ar: 'وقت حر للتسوق أو الاسترخاء، ثم التوجه إلى نقطة المغادرة مع مرشد الجولة.',
          en: 'Free time for shopping or relaxation, then transfer to the departure point with your guide.',
          fr: 'Temps libre pour shopping ou détente, puis transfert vers le point de départ avec votre guide.',
        },
      };
    }
    return {
      day,
      title: {
        ar: `يوم ${day}: استكشاف ${name.ar}`,
        en: `Day ${day}: Exploring ${name.en}`,
        fr: `Jour ${day} : Explorer ${name.fr}`,
      },
      description: {
        ar: `جولة يومية تشمل أبرز المعالم السياحية والأنشطة المختارة في برنامج ${getLocalizedOfferText(offer.title, 'ar')}.`,
        en: `A full-day tour covering key attractions and activities included in ${getLocalizedOfferText(offer.title, 'en')}.`,
        fr: `Excursion d'une journée couvrant les attractions et activités du programme ${getLocalizedOfferText(offer.title, 'fr')}.`,
      },
    };
  });
}

export function buildOfferDetails(
  offer: TourOffer,
  country?: AdminCountryData | null,
): ResolvedOfferDetails {
  const custom = offer.details || {};
  const title = offer.title;
  const desc = offer.description;
  const cn = countryName(country, 'ar');
  const cnEn = countryName(country, 'en');
  const cnFr = countryName(country, 'fr');
  const cap = capitalName(country, 'ar');
  const capEn = capitalName(country, 'en');
  const capFr = capitalName(country, 'fr');

  const defaultWhere: LocalizedText = {
    ar: cap
      ? `تُنفَّذ الجولة في ${cn}، انطلاقاً من ${cap} وزيارة أهم المناطق السياحية والمعالم الثقافية.`
      : `تُنفَّذ الجولة في ${cn} وتشمل أبرز المدن والمعالم السياحية.`,
    en: capEn
      ? `The tour takes place in ${cnEn}, starting from ${capEn} and visiting key tourist areas and cultural landmarks.`
      : `The tour takes place in ${cnEn} and covers the main cities and tourist attractions.`,
    fr: capFr
      ? `Le circuit se déroule en ${cnFr}, au départ de ${capFr}, avec visite des principales zones touristiques.`
      : `Le circuit se déroule en ${cnFr} et couvre les principales villes et attractions.`,
  };

  const defaultWhat: LocalizedText = {
    ar: desc.ar || `برنامج سياحي متكامل: ${title.ar}`,
    en: desc.en || `A complete travel program: ${title.en}`,
    fr: desc.fr || `Programme touristique complet : ${title.fr}`,
  };

  const defaultHow: LocalizedText = {
    ar: 'تنقل مريح بسيارة سياحية مكيفة مع مرشد محلي متخصص، وجدول زمني منظم يشمل زيارات يومية واستراحات.',
    en: 'Comfortable air-conditioned transport with a licensed local guide and a structured daily schedule with planned stops.',
    fr: 'Transport climatisé confortable avec guide local agréé et programme journalier organisé avec pauses.',
  };

  const defaultWhen: LocalizedText = {
    ar: `مدة البرنامج ${offer.durationDays} ${offer.durationDays === 1 ? 'يوم' : 'أيام'} — يمكن الحجز على مدار العام حسب التوفر.`,
    en: `Program duration: ${offer.durationDays} day(s) — bookable year-round subject to availability.`,
    fr: `Durée : ${offer.durationDays} jour(s) — réservable toute l'année selon disponibilité.`,
  };

  const defaultWithWhat: LocalizedText = {
    ar: 'يشمل البرنامج: النقل، المرشد السياحي، رسوم الدخول للمعالم المذكورة، ومياه معدنية يومياً.',
    en: 'Includes: transport, tour guide, entrance fees to listed sites, and daily bottled water.',
    fr: 'Comprend : transport, guide, frais d\'entrée aux sites listés et eau en bouteille quotidienne.',
  };

  const defaultWhy: LocalizedText = {
    ar: `تجربة مختارة بعناية لاكتشاف ${cn} بأفضل قيمة — برنامج منظم، مرشدون محليون، وأسعار تنافسية.`,
    en: `A carefully curated experience to discover ${cnEn} with great value — organized itinerary, local guides, competitive pricing.`,
    fr: `Expérience soigneusement sélectionnée pour découvrir ${cnFr} — programme organisé, guides locaux, prix compétitifs.`,
  };

  const defaultHighlights: LocalizedList = {
    ar: [
      'مرشد سياحي محلي متخصص',
      'نقل مريح ومكيف',
      'معالم سياحية مختارة بعناية',
      'مرونة في الحجز',
      offer.isFeatured ? 'عرض مميز بأسعار خاصة' : 'برنامج سياحي متكامل',
    ],
    en: [
      'Licensed local tour guide',
      'Comfortable air-conditioned transport',
      'Hand-picked tourist attractions',
      'Flexible booking',
      offer.isFeatured ? 'Featured offer with special pricing' : 'Complete travel package',
    ],
    fr: [
      'Guide local agréé',
      'Transport climatisé confortable',
      'Attractions soigneusement sélectionnées',
      'Réservation flexible',
      offer.isFeatured ? 'Offre vedette à prix spécial' : 'Forfait touristique complet',
    ],
  };

  const defaultInclusions: LocalizedList = {
    ar: ['النقل خلال البرنامج', 'مرشد سياحي', 'رسوم دخول المعالم', 'مياه معدنية'],
    en: ['Program transport', 'Tour guide', 'Site entrance fees', 'Bottled water'],
    fr: ['Transport pendant le programme', 'Guide touristique', 'Frais d\'entrée', 'Eau en bouteille'],
  };

  const defaultExclusions: LocalizedList = {
    ar: ['تذاكر الطيران', 'الإقامة الفندقية (إن لم تُذكر)', 'الوجبات الشخصية', 'التأمين الصحي'],
    en: ['Flight tickets', 'Hotel accommodation (unless stated)', 'Personal meals', 'Travel insurance'],
    fr: ['Billets d\'avion', 'Hébergement (sauf mention)', 'Repas personnels', 'Assurance voyage'],
  };

  const gallery = [
    ...(custom.gallery || []),
    ...(offer.imageUrl ? [offer.imageUrl] : []),
    ...(country?.gallery?.slice(0, 4) || []),
  ].filter((url, index, arr) => url && arr.indexOf(url) === index);

  const discountPercent = custom.discountPercent ?? (offer.isFeatured ? 10 : 0);
  const originalPrice =
    custom.originalPrice ??
    (discountPercent > 0 ? Math.round(offer.price / (1 - discountPercent / 100)) : undefined);

  return {
    where: custom.where?.ar ? custom.where : defaultWhere,
    what: custom.what?.ar ? custom.what : defaultWhat,
    how: custom.how?.ar ? custom.how : defaultHow,
    when: custom.when?.ar ? custom.when : defaultWhen,
    withWhat: custom.withWhat?.ar ? custom.withWhat : defaultWithWhat,
    why: custom.why?.ar ? custom.why : defaultWhy,
    highlights:
      custom.highlights?.ar?.length ? custom.highlights : defaultHighlights,
    inclusions:
      custom.inclusions?.ar?.length ? custom.inclusions : defaultInclusions,
    exclusions:
      custom.exclusions?.ar?.length ? custom.exclusions : defaultExclusions,
    itinerary:
      custom.itinerary?.length ? custom.itinerary : buildDefaultItinerary(offer, country),
    meetingPoint: custom.meetingPoint || {
      ar: cap ? `نقطة اللقاء: وسط ${cap} أو الفندق المحدد عند الحجز` : `نقطة اللقاء تُحدَّد عند تأكيد الحجز`,
      en: capEn ? `Meeting point: central ${capEn} or your confirmed hotel` : 'Meeting point confirmed upon booking',
      fr: capFr ? `Point de rendez-vous : centre de ${capFr} ou hôtel confirmé` : 'Point de rendez-vous confirmé à la réservation',
    },
    groupSize: custom.groupSize || {
      ar: 'مجموعات صغيرة (2–15 شخصاً)',
      en: 'Small groups (2–15 people)',
      fr: 'Petits groupes (2–15 personnes)',
    },
    difficulty: custom.difficulty || {
      ar: 'سهل إلى متوسط — مناسب لمعظم الأعمار',
      en: 'Easy to moderate — suitable for most ages',
      fr: 'Facile à modéré — adapté à la plupart des âges',
    },
    languages: custom.languages?.ar?.length
      ? custom.languages
      : {
          ar: ['العربية', 'الإنجليزية'],
          en: ['Arabic', 'English'],
          fr: ['Arabe', 'Anglais'],
        },
    gallery: gallery.length > 0 ? gallery : ['https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg'],
    bestSeason: custom.bestSeason || (country?.bestTime
      ? country.bestTime
      : {
          ar: 'على مدار العام',
          en: 'Year-round',
          fr: 'Toute l\'année',
        }),
    cancellationPolicy: custom.cancellationPolicy || {
      ar: 'إلغاء مجاني حتى 48 ساعة قبل موعد الانطلاق. بعد ذلك تُطبَّق رسوم إدارية.',
      en: 'Free cancellation up to 48 hours before departure. Administrative fees apply thereafter.',
      fr: 'Annulation gratuite jusqu\'à 48 h avant le départ. Frais administratifs ensuite.',
    },
    discountPercent,
    discountLabel: custom.discountLabel,
    originalPrice,
  };
}

export const OFFER_DETAIL_SECTIONS = [
  { key: 'where' as const, icon: 'MapPin', labelAr: 'أين؟', labelEn: 'Where?', labelFr: 'Où ?' },
  { key: 'what' as const, icon: 'Compass', labelAr: 'ماذا؟', labelEn: 'What?', labelFr: 'Quoi ?' },
  { key: 'how' as const, icon: 'Route', labelAr: 'كيف؟', labelEn: 'How?', labelFr: 'Comment ?' },
  { key: 'when' as const, icon: 'Calendar', labelAr: 'متى؟', labelEn: 'When?', labelFr: 'Quand ?' },
  { key: 'withWhat' as const, icon: 'Backpack', labelAr: 'بماذا؟', labelEn: 'With what?', labelFr: 'Avec quoi ?' },
  { key: 'why' as const, icon: 'Heart', labelAr: 'لماذا؟', labelEn: 'Why?', labelFr: 'Pourquoi ?' },
];
