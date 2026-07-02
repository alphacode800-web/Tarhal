import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import OfferVideo from '@/components/OfferVideo';
import {
  buildOfferDetails,
  getLocalizedOfferList,
  getLocalizedOfferText,
  OFFER_DETAIL_SECTIONS,
} from '@/data/offerDetails';
import { offerMatchesCountry } from '@/data/countries';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { dataManager, type AdminCountryData, type TourOffer } from '@/services/dataManager';
import {
  ArrowLeft,
  Award,
  Backpack,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Heart,
  MapPin,
  MessageCircle,
  Percent,
  Route,
  Share2,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';

const SECTION_ICONS = {
  MapPin,
  Compass,
  Route,
  Calendar,
  Backpack,
  Heart,
} as const;

export default function OfferDetail() {
  const { offerId } = useParams<{ offerId: string }>();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [offer, setOffer] = useState<TourOffer | null>(null);
  const [country, setCountry] = useState<AdminCountryData | null>(null);
  const [relatedOffers, setRelatedOffers] = useState<TourOffer[]>([]);
  const [countries, setCountries] = useState<AdminCountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const tr = (ar: string, en: string, fr: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const getText = (obj?: { ar: string; en: string; fr: string }) =>
    getLocalizedOfferText(obj, language);

  useEffect(() => {
    const load = async () => {
      if (!offerId) return;
      setLoading(true);
      try {
        const [offers, countriesList] = await Promise.all([
          dataManager.getOffersAsync(),
          dataManager.getCountriesAsync(),
        ]);
        setCountries(countriesList);
        const found = offers.find((o) => o.id === offerId && o.isActive !== false);
        setOffer(found || null);
        if (found) {
          const matchedCountry =
            countriesList.find((c) => c.id === found.countryId) ||
            countriesList.find((c) => offerMatchesCountry(countriesList, found.countryId, c.id)) ||
            null;
          setCountry(matchedCountry);
          setRelatedOffers(
            offers
              .filter(
                (o) =>
                  o.id !== found.id &&
                  o.isActive !== false &&
                  offerMatchesCountry(countriesList, o.countryId, found.countryId),
              )
              .slice(0, 3),
          );
        }
      } catch {
        const offers = dataManager.getOffers();
        const countriesList = dataManager.getCountries();
        setCountries(countriesList);
        const found = offers.find((o) => o.id === offerId);
        setOffer(found || null);
        if (found) {
          setCountry(countriesList.find((c) => c.id === found.countryId) || null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [offerId]);

  const details = useMemo(
    () => (offer ? buildOfferDetails(offer, country) : null),
    [offer, country],
  );

  const gallery = details?.gallery || [];
  const hasDiscount = (details?.discountPercent || 0) > 0 && details?.originalPrice;

  const shareOffer = async () => {
    const url = window.location.href;
    const title = offer ? getText(offer.title) : '';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-tarhal-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{tr('جاري تحميل تفاصيل الجولة...', 'Loading tour details...', 'Chargement...')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!offer || !details) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
          <Sparkles className="h-16 w-16 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-800">{tr('الجولة غير موجودة', 'Tour not found', 'Circuit introuvable')}</h1>
          <Link to="/offers">
            <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
              <ArrowLeft className="h-4 w-4 ml-2" />
              {tr('العودة للعروض', 'Back to offers', 'Retour aux offres')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const countryName = country ? getText(country.name) : '';

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={gallery[activeImage] || offer.imageUrl}
            alt={getText(offer.title)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-10 pt-28">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {tr('العروض السياحية', 'Tour offers', 'Offres touristiques')}
            </Link>
            {country && (
              <>
                <ChevronRight className="h-4 w-4 text-white/50" />
                <Link
                  to={`/offices/${country.id}`}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  {countryName}
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {offer.isFeatured && (
              <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                <Award className="h-3.5 w-3.5" />
                {tr('عرض مميز', 'Featured', 'Vedette')}
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Percent className="h-3.5 w-3.5" />
                {details.discountLabel
                  ? getText(details.discountLabel)
                  : tr(`خصم ${details.discountPercent}%`, `${details.discountPercent}% off`, `-${details.discountPercent}%`)}
              </span>
            )}
            {countryName && (
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/25">
                <MapPin className="h-3.5 w-3.5 text-tarhal-orange" />
                {countryName}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 max-w-4xl leading-tight drop-shadow-lg">
            {getText(offer.title)}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-white/90 text-sm">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-tarhal-orange" />
              {offer.durationDays} {tr('أيام', 'days', 'jours')}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-tarhal-orange" />
              {getText(details.groupSize)}
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              {getText(details.difficulty)}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-tarhal-orange ring-2 ring-tarhal-orange/30' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                {getText(offer.description)}
              </p>
            </div>

            {/* Videos */}
            {offer.videos && offer.videos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-tarhal-blue-dark dark:text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-tarhal-orange" />
                  {tr('فيديو الجولة', 'Tour video', 'Vidéo du circuit')}
                </h2>
                {offer.videos.map((video, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-black">
                    <OfferVideo src={video} className="w-full h-64 md:h-80 object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* 5W+H Sections */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-tarhal-blue-dark dark:text-white">
                {tr('تفاصيل البرنامج', 'Program details', 'Détails du programme')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {OFFER_DETAIL_SECTIONS.map((section) => {
                  const Icon = SECTION_ICONS[section.icon as keyof typeof SECTION_ICONS];
                  const text = getText(details[section.key]);
                  return (
                    <div
                      key={section.key}
                      className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-tarhal-orange/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-tarhal-orange" />
                        </div>
                        <h3 className="font-bold text-tarhal-blue-dark dark:text-white text-lg">
                          {language === 'ar' ? section.labelAr : language === 'fr' ? section.labelFr : section.labelEn}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-bold text-tarhal-blue-dark dark:text-white mb-4 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                {tr('المميزات', 'Highlights', 'Points forts')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {getLocalizedOfferList(details.highlights, language).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-xl p-4"
                  >
                    <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 p-6">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  {tr('يشمل البرنامج', 'Included', 'Inclus')}
                </h3>
                <ul className="space-y-2">
                  {getLocalizedOfferList(details.inclusions, language).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                      <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/50 p-6">
                <h3 className="font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                  <X className="h-5 w-5" />
                  {tr('لا يشمل', 'Not included', 'Non inclus')}
                </h3>
                <ul className="space-y-2">
                  {getLocalizedOfferList(details.exclusions, language).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                      <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-2xl font-bold text-tarhal-blue-dark dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-tarhal-orange" />
                {tr('البرنامج اليومي', 'Daily itinerary', 'Programme journalier')}
              </h2>
              <div className="space-y-4">
                {details.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="flex gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-tarhal-orange text-white font-extrabold flex items-center justify-center text-lg">
                      {day.day}
                    </div>
                    <div>
                      <h4 className="font-bold text-tarhal-blue-dark dark:text-white mb-1">
                        {getText(day.title)}
                      </h4>
                      <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
                        {getText(day.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
                <h4 className="font-semibold text-tarhal-blue-dark dark:text-white mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-tarhal-orange" />
                  {tr('نقطة اللقاء', 'Meeting point', 'Point de rendez-vous')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-slate-300">{getText(details.meetingPoint)}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
                <h4 className="font-semibold text-tarhal-blue-dark dark:text-white mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-tarhal-orange" />
                  {tr('أفضل موسم', 'Best season', 'Meilleure saison')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-slate-300">{getText(details.bestSeason)}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
                <h4 className="font-semibold text-tarhal-blue-dark dark:text-white mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-tarhal-orange" />
                  {tr('سياسة الإلغاء', 'Cancellation policy', 'Politique d\'annulation')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-slate-300">{getText(details.cancellationPolicy)}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
                <h4 className="font-semibold text-tarhal-blue-dark dark:text-white mb-2">
                  {tr('لغات المرشد', 'Guide languages', 'Langues du guide')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getLocalizedOfferList(details.languages, language).map((lang, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium bg-tarhal-orange/10 text-tarhal-orange px-3 py-1 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl p-6 space-y-5">
              <div>
                {hasDiscount && (
                  <p className="text-sm text-gray-400 line-through mb-1">
                    {formatPrice(details.originalPrice!, offer.currency as 'USD')}
                  </p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-tarhal-orange">
                    {formatPrice(offer.price, offer.currency as 'USD')}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-lg">
                      -{details.discountPercent}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{tr('للشخص الواحد', 'per person', 'par personne')}</p>
              </div>

              <div className="space-y-3 text-sm text-gray-600 dark:text-slate-300 border-t border-gray-100 dark:border-slate-700 pt-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-tarhal-orange" />
                  <span>{offer.durationDays} {tr('أيام', 'days', 'jours')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-tarhal-orange" />
                  <span>{countryName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-tarhal-orange" />
                  <span>{getText(details.groupSize)}</span>
                </div>
              </div>

              <Link to="/contact" className="block">
                <Button className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark hover:opacity-90 text-white font-bold py-6 rounded-xl text-base shadow-lg">
                  <MessageCircle className="h-5 w-5 ml-2" />
                  {tr('احجز الآن / استفسر', 'Book now / Inquire', 'Réserver / Demander')}
                </Button>
              </Link>

              <button
                onClick={shareOffer}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-tarhal-orange hover:text-tarhal-orange transition-colors text-sm font-medium"
              >
                <Share2 className="h-4 w-4" />
                {tr('مشاركة الجولة', 'Share tour', 'Partager')}
              </button>

              {country && (
                <Link
                  to={`/offices/${country.id}`}
                  className="block text-center text-sm text-tarhal-orange hover:underline"
                >
                  {tr(`استكشف ${countryName}`, `Explore ${countryName}`, `Explorer ${countryName}`)}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Related offers */}
        {relatedOffers.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-tarhal-blue-dark dark:text-white mb-6">
              {tr('جولات أخرى في نفس الوجهة', 'More tours in this destination', 'Autres circuits')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedOffers.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/offers/${rel.id}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
                >
                  {rel.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={rel.imageUrl}
                        alt={getText(rel.title)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-tarhal-blue-dark dark:text-white line-clamp-2 group-hover:text-tarhal-orange transition-colors">
                      {getText(rel.title)}
                    </h3>
                    <p className="text-tarhal-orange font-bold mt-2">
                      {formatPrice(rel.price, rel.currency as 'USD')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
