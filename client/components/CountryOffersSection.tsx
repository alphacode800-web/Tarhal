import { Link } from 'react-router-dom';
import { Award, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OfferVideo from '@/components/OfferVideo';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { TourOffer } from '@/services/dataManager';

interface CountryOffersSectionProps {
  offers: TourOffer[];
  countryName: string;
  countryId: string;
  language: 'ar' | 'en' | 'fr';
}

export default function CountryOffersSection({
  offers,
  countryName,
  countryId,
  language,
}: CountryOffersSectionProps) {
  const { formatPrice } = useCurrency();

  const t = (ar: string, en: string, fr: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const getText = (obj: { ar: string; en: string; fr: string }) =>
    language === 'ar' ? obj.ar : language === 'fr' ? obj.fr : obj.en;

  if (offers.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl border-2 border-gray-200 dark:border-slate-700 p-12 shadow-lg">
        <div className="w-20 h-20 bg-gradient-to-br from-tarhal-orange/20 to-tarhal-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-10 w-10 text-tarhal-orange" />
        </div>
        <p className="text-gray-800 dark:text-slate-100 text-xl font-bold mb-4">
          {t(
            `لا توجد جولات أو عروض في ${countryName} حالياً`,
            `No tours or offers in ${countryName} yet`,
            `Aucune offre à ${countryName} pour le moment`,
          )}
        </p>
        <p className="text-gray-600 dark:text-slate-400 text-sm mb-6">
          {t(
            'سيتم إضافة البرامج السياحية قريباً من لوحة الإدارة',
            'Tour programs will be added soon from the admin panel',
            'Les programmes seront ajoutés bientôt depuis l\'administration',
          )}
        </p>
        <Link to={`/offers?type=local`}>
          <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
            {t('عرض جميع العروض السياحية', 'View all tour offers', 'Voir toutes les offres')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="text-center animate-fade-in">
        <h2 className="text-4xl font-bold text-tarhal-blue-dark dark:text-white mb-4">
          {t('الجولات والعروض السياحية', 'Tours & Travel Offers', 'Circuits et offres touristiques')}
        </h2>
        <p className="text-xl text-tarhal-gray-dark dark:text-slate-300 max-w-3xl mx-auto">
          {t(
            `اكتشف أفضل البرامج والرحلات في ${countryName}`,
            `Discover the best programs and trips in ${countryName}`,
            `Découvrez les meilleurs programmes à ${countryName}`,
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {offers.map((offer, index) => (
          <article
            key={offer.id}
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg dark:shadow-black/20 border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {offer.imageUrl && (
              <div className="relative h-56 overflow-hidden">
                <img
                  src={offer.imageUrl}
                  alt={getText(offer.title)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {offer.isFeatured && (
                  <span className="absolute top-4 left-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    {t('مميز', 'Featured', 'Vedette')}
                  </span>
                )}
              </div>
            )}

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-tarhal-blue-dark dark:text-white">
                {getText(offer.title)}
              </h3>

              <p className="text-tarhal-gray-dark dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {getText(offer.description)}
              </p>

              {offer.videos && offer.videos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-tarhal-blue-dark dark:text-slate-200">
                    {t('فيديو العرض', 'Offer video', 'Vidéo de l\'offre')}
                  </p>
                  {offer.videos.map((video, videoIndex) => (
                    <div key={`${offer.id}-video-${videoIndex}`} className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                      <OfferVideo src={video} className="w-full h-52 bg-black" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-tarhal-gray-dark dark:text-slate-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-tarhal-orange" />
                  {offer.durationDays} {t('أيام', 'days', 'jours')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-tarhal-blue" />
                  {t('متاح للحجز', 'Available', 'Disponible')}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-tarhal-orange" />
                  {countryName}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                <div>
                  <p className="text-2xl font-extrabold text-tarhal-orange">
                    {formatPrice(offer.price, offer.currency as 'USD')}
                  </p>
                  <p className="text-xs text-gray-500">{t('للشخص الواحد', 'per person', 'par personne')}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/offers/${offer.id}`}>
                    <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
                      {t('عرض التفاصيل', 'View details', 'Détails')}
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline">{t('احجز الآن', 'Book now', 'Réserver')}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
