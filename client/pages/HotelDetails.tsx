import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import GoogleMap from '@/components/GoogleMap';
import OptimizedImage from '@/components/OptimizedImage';
import { resolveHotelCoordinates } from '@/data/countryCoordinates';
import { getCountryName } from '@/data/countries';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { dataManager, type Hotel, type AdminCountryData } from '@/services/dataManager';
import {
  ArrowLeft,
  Award,
  Calendar,
  Car,
  Check,
  ChevronRight,
  Coffee,
  ConciergeBell,
  Dumbbell,
  Globe,
  Hotel as HotelIcon,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Star,
  UtensilsCrossed,
  Waves,
  Wifi,
} from 'lucide-react';

function getAmenityIcon(label: string) {
  const text = label.toLowerCase();
  if (text.includes('wifi') || text.includes('واي فاي') || text.includes('wi-fi')) return Wifi;
  if (text.includes('parking') || text.includes('موقف') || text.includes('garage')) return Car;
  if (text.includes('restaurant') || text.includes('مطعم') || text.includes('dining')) return UtensilsCrossed;
  if (text.includes('pool') || text.includes('مسبح') || text.includes('piscine')) return Waves;
  if (text.includes('gym') || text.includes('fitness') || text.includes('صحي') || text.includes('نادي')) return Dumbbell;
  if (text.includes('spa') || text.includes('سبا')) return Sparkles;
  if (text.includes('breakfast') || text.includes('إفطار') || text.includes('petit')) return Coffee;
  if (text.includes('room service') || text.includes('خدمة الغرف')) return ConciergeBell;
  return Check;
}

export default function HotelDetails() {
  const { hotelId, countryId: routeCountryId } = useParams<{ hotelId: string; countryId?: string }>();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [country, setCountry] = useState<AdminCountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const tr = (ar: string, en: string, fr: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const getLocalizedText = (obj?: { ar: string; en: string; fr: string }) => {
    if (!obj) return '';
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
  };

  useEffect(() => {
    const load = async () => {
      if (!hotelId) return;
      setLoading(true);
      try {
        const [hotels, countries] = await Promise.all([
          dataManager.getHotelsAsync(),
          dataManager.getCountriesAsync(),
        ]);
        const found = hotels.find((h) => h.id === hotelId && h.isActive !== false);
        setHotel(found || null);
        if (found) {
          setCountry(countries.find((c) => c.id === found.countryId) || null);
        }
      } catch {
        const hotels = dataManager.getHotels();
        const found = hotels.find((h) => h.id === hotelId);
        setHotel(found || null);
        if (found) {
          setCountry(dataManager.getCountries().find((c) => c.id === found.countryId) || null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hotelId]);

  const gallery = useMemo(() => {
    if (!hotel) return [];
    const imgs = [...(hotel.images || [])];
    if (hotel.imageUrl && !imgs.includes(hotel.imageUrl)) {
      imgs.unshift(hotel.imageUrl);
    }
    return imgs.length > 0
      ? imgs
      : ['https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1200'];
  }, [hotel]);

  const amenities = hotel?.amenities?.[language] || hotel?.amenities?.ar || [];
  const mapPosition = hotel
    ? resolveHotelCoordinates(hotel.countryId, hotel.coordinates)
    : { lat: 24, lng: 45 };

  const bookingPath = hotel
    ? `/offices/${hotel.countryId}/hotels/${hotel.id}/booking`
    : '/hotels';

  const backPath = routeCountryId
    ? `/offices/${routeCountryId}/hotels`
    : hotel
      ? `/hotels?country=${hotel.countryId}`
      : '/hotels';

  const renderStars = (stars: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ));

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-tarhal-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{tr('جاري تحميل تفاصيل الفندق...', 'Loading hotel details...', 'Chargement des détails...')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hotel) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
          <HotelIcon className="h-16 w-16 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-800">{tr('الفندق غير موجود', 'Hotel not found', 'Hôtel introuvable')}</h1>
          <Link to="/hotels">
            <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
              <ArrowLeft className="h-4 w-4 ml-2" />
              {tr('العودة للفنادق', 'Back to hotels', 'Retour aux hôtels')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Gallery Hero */}
      <section className="bg-slate-950">
        <div className="container mx-auto px-4 pt-28 pb-6">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
            <Link to="/" className="hover:text-tarhal-orange transition-colors">{tr('الرئيسية', 'Home', 'Accueil')}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/hotels" className="hover:text-tarhal-orange transition-colors">{tr('الفنادق', 'Hotels', 'Hôtels')}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{getLocalizedText(hotel.name)}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
            <div className="relative h-[280px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src={gallery[activeImage]}
                alt={getLocalizedText(hotel.name)}
                className="w-full h-full object-cover"
              />
              {hotel.isFeatured && (
                <div className="absolute top-4 right-4 bg-amber-400 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Award className="h-3.5 w-3.5" />
                  {tr('فندق مميز', 'Featured Hotel', 'Hôtel recommandé')}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 h-[280px] md:h-[420px]">
              {gallery.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-tarhal-orange ring-2 ring-tarhal-orange/40' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <OptimizedImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">{renderStars(hotel.stars)}</div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {getLocalizedText(hotel.name)}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-tarhal-orange" />
                        {getLocalizedText(hotel.address)}
                      </span>
                      {country && (
                        <span className="text-sm bg-tarhal-orange/10 text-tarhal-orange px-3 py-1 rounded-full font-medium">
                          {getCountryName(country, language)} — {getLocalizedText(hotel.city)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-xl">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-xl font-bold">{hotel.rating}</span>
                    <span className="text-sm opacity-80">
                      ({hotel.reviews} {tr('تقييم', 'reviews', 'avis')})
                    </span>
                  </div>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  {getLocalizedText(hotel.description)}
                </p>
              </div>

              {/* Amenities */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {tr('مميزات الفندق وما يوفره', 'Hotel Features & Services', 'Équipements et services')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {tr(
                    'استمتع بتجربة إقامة متكاملة مع أفضل الخدمات والمرافق',
                    'Enjoy a complete stay with premium services and facilities',
                    'Profitez d\'un séjour complet avec des services et équipements premium',
                  )}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {amenities.map((amenity, idx) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-700 hover:border-tarhal-orange/40 transition-colors"
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-tarhal-blue to-tarhal-navy flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {tr('لماذا تختار هذا الفندق؟', 'Why Choose This Hotel?', 'Pourquoi choisir cet hôtel ?')}
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Shield,
                      title: tr('إقامة موثوقة', 'Trusted Stay', 'Séjour fiable'),
                      desc: tr('معايير جودة عالمية', 'Global quality standards', 'Normes de qualité internationales'),
                    },
                    {
                      icon: Calendar,
                      title: tr('حجز مرن', 'Flexible Booking', 'Réservation flexible'),
                      desc: tr('تأكيد سريع ودعم 24/7', 'Fast confirmation & 24/7 support', 'Confirmation rapide et support 24/7'),
                    },
                    {
                      icon: Award,
                      title: tr('تجربة مميزة', 'Premium Experience', 'Expérience premium'),
                      desc: tr('خدمات مصممة لراحتك', 'Services tailored for your comfort', 'Services adaptés à votre confort'),
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="text-center p-5 rounded-xl bg-gradient-to-b from-tarhal-orange/5 to-transparent border border-tarhal-orange/10">
                      <item.icon className="h-8 w-8 text-tarhal-orange mx-auto mb-3" />
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {tr('موقع الفندق على الخريطة', 'Hotel Location', 'Emplacement de l\'hôtel')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-tarhal-orange" />
                  {getLocalizedText(hotel.address)}, {getLocalizedText(hotel.city)}
                </p>
                <GoogleMap
                  center={mapPosition}
                  zoom={14}
                  height="380px"
                  markers={[{
                    position: mapPosition,
                    title: getLocalizedText(hotel.name),
                    info: getLocalizedText(hotel.address),
                  }]}
                  className="border border-gray-200 dark:border-slate-600"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700 sticky top-28">
                <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-slate-700">
                  <div className="text-3xl font-bold text-tarhal-orange mb-1">
                    {formatPrice(hotel.pricePerNight, hotel.currency as any)}
                  </div>
                  <div className="text-sm text-gray-500">{tr('لليلة الواحدة', 'per night', 'par nuit')}</div>
                </div>

                <Link to={bookingPath} className="block mb-4">
                  <Button className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white py-6 text-lg font-semibold hover:shadow-lg transition-all">
                    <Calendar className="h-5 w-5 ml-2" />
                    {tr('احجز الآن', 'Book Now', 'Réserver')}
                  </Button>
                </Link>

                <Link to={backPath}>
                  <Button variant="outline" className="w-full mb-6">
                    <ArrowLeft className="h-4 w-4 ml-2" />
                    {tr('العودة للقائمة', 'Back to list', 'Retour à la liste')}
                  </Button>
                </Link>

                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  {tr('تواصل مع الفندق', 'Contact the Hotel', 'Contacter l\'hôtel')}
                </h3>
                <div className="space-y-3">
                  {hotel.phone && (
                    <a
                      href={`tel:${hotel.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 hover:bg-tarhal-orange/10 transition-colors group"
                      aria-label={tr('اتصال', 'Call', 'Appeler')}
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tr('اتصال هاتفي', 'Phone call', 'Appel téléphonique')}</span>
                    </a>
                  )}
                  {hotel.email && (
                    <a
                      href={`mailto:${hotel.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 hover:bg-tarhal-orange/10 transition-colors group"
                      aria-label={tr('بريد', 'Email', 'E-mail')}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tr('بريد إلكتروني', 'Email', 'E-mail')}</span>
                    </a>
                  )}
                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 hover:bg-tarhal-orange/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tr('الموقع الإلكتروني', 'Website', 'Site web')}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
