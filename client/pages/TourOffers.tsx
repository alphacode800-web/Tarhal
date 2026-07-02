import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, ArrowRight, Filter, TrendingUp, DollarSign, Sparkles, Heart, Share2, Calendar, Users, Award, Zap, Globe } from 'lucide-react';
import { dataManager, type AdminCountryData, type TourOffer } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { detectUserCountry, mapCountryCodeToId } from '@/services/geoLocation';
import { offerMatchesCountry, resolveCountryIdInCatalog } from '@/data/countries';
import { Switch } from '@/components/ui/switch';
import OfferVideo from '@/components/OfferVideo';

type TourFilterType = 'local' | 'international' | 'all';

export default function TourOffers() {
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const tourType = (searchParams.get('type') as TourFilterType) || 'all';
  const [countries, setCountries] = useState<AdminCountryData[]>([]);
  const [offers, setOffers] = useState<TourOffer[]>([]);
  const [userCountryId, setUserCountryId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'recommended' | 'priceAsc' | 'priceDesc' | 'durationAsc' | 'durationDesc'
  >('recommended');
  const [maxPriceFilter, setMaxPriceFilter] = useState<string>('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  // صور خلفية فاخرة ومتنوعة للهيدر
  const heroImages = [
    'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/2901211/pexels-photo-2901211.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/2901213/pexels-photo-2901213.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/2901217/pexels-photo-2901217.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ];

  useEffect(() => {
    (async () => {
      try {
        const [countriesFromServer] = await Promise.all([
          dataManager.getCountriesAsync()
        ]);
        const countries = countriesFromServer.length > 0 ? countriesFromServer : dataManager.getCountries();
        setCountries(countries);

        const ensuredOffers = await dataManager.ensureMinimumOffersForCountries(10);
        setOffers(ensuredOffers);
      } catch (e) {
        const ensuredOffers = await dataManager.ensureMinimumOffersForCountries(10);
        const countries = await dataManager.getCountriesAsync();
        setCountries(countries);
        setOffers(ensuredOffers);
      }
    })();
  }, []);

  useEffect(() => {
    detectUserCountry()
      .then((geo) => {
        if (!geo) return;
        const countryId = mapCountryCodeToId(geo.country);
        if (countryId) setUserCountryId(countryId);
      })
      .catch(() => {});
  }, []);

  const resolvedUserCountryId = useMemo(() => {
    if (!userCountryId || countries.length === 0) return userCountryId;
    return resolveCountryIdInCatalog(countries, userCountryId);
  }, [userCountryId, countries]);

  useEffect(() => {
    if (tourType === 'local' && resolvedUserCountryId) {
      setSelectedCountry(resolvedUserCountryId);
    } else if (tourType === 'international' || tourType === 'all') {
      setSelectedCountry('');
    }
  }, [tourType, resolvedUserCountryId]);

  // تغيير الصور الخلفية تلقائياً
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeOffers = useMemo(
    () => offers.filter((offer) => offer.isActive !== false),
    [offers],
  );

  const stats = useMemo(() => {
    const totalOffers = activeOffers.length;
    const countriesWithOffers = new Set(activeOffers.map((o) => o.countryId)).size;
    const featuredCount = activeOffers.filter((o) => o.isFeatured).length;
    const avgPrice =
      totalOffers > 0
        ? Math.round(
            (activeOffers.reduce((sum, o) => sum + (o.price || 0), 0) / totalOffers) * 10,
          ) / 10
        : 0;
    return { totalOffers, countriesWithOffers, featuredCount, avgPrice };
  }, [activeOffers]);

  const visibleOffers = useMemo(() => {
    let result = [...activeOffers];

    if (selectedCountry) {
      result = result.filter((offer) =>
        offerMatchesCountry(countries, offer.countryId, selectedCountry),
      );
    } else if (tourType === 'local' && resolvedUserCountryId) {
      result = result.filter((offer) =>
        offerMatchesCountry(countries, offer.countryId, resolvedUserCountryId),
      );
    } else if (tourType === 'international' && resolvedUserCountryId) {
      result = result.filter(
        (offer) => !offerMatchesCountry(countries, offer.countryId, resolvedUserCountryId),
      );
    }

    if (onlyFeatured) {
      result = result.filter((offer) => offer.isFeatured);
    }

    if (maxPriceFilter) {
      const max = Number(maxPriceFilter);
      result = result.filter((offer) => offer.price <= max);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'durationAsc':
          return a.durationDays - b.durationDays;
        case 'durationDesc':
          return b.durationDays - a.durationDays;
        default:
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.price - a.price;
      }
    });

    return result;
  }, [
    activeOffers,
    countries,
    selectedCountry,
    sortBy,
    maxPriceFilter,
    onlyFeatured,
    tourType,
    resolvedUserCountryId,
  ]);

  const filterLabel = useMemo(() => {
    if (tourType === 'local') return t('offers.filter.local');
    if (tourType === 'international') return t('offers.filter.international');
    return t('offers.filter.all');
  }, [tourType, t]);

  const getCountryName = (countryId: string) => {
    const country = countries.find((c) => c.id === countryId);
    if (!country) return '';
    return language === 'ar'
      ? country.name.ar
      : language === 'fr'
      ? country.name.fr
      : country.name.en;
  };

  const getLocalizedText = (obj?: { ar: string; en: string; fr: string }) => {
    if (!obj) return '';
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
  };

  const toggleFavorite = (offerId: string) => {
    setFavorites(prev =>
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  return (
    <Layout>
      {/* Hero Section with Enhanced Background Images */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Images with Smooth Fade Effect */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ 
                backgroundImage: `url(${image})`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
              }}
            />
          ))}
          {/* Enhanced Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-tarhal-navy/92 via-tarhal-blue-dark/88 to-tarhal-blue/85 z-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-20" />
        </div>

        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden z-30">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-tarhal-orange/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-10 w-72 h-72 border-2 border-white/30 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-20 left-1/3 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">{filterLabel}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
              {t('home.offices.title', 'العروض السياحية')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              {t(
                'home.offices.subtitle',
                'اكتشف أفضل العروض السياحية المختارة بعناية في مختلف دول العالم',
              )}
            </p>
          </div>

          {/* Filter Type Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {([
              { type: 'local' as const, key: 'nav.offers.local' },
              { type: 'international' as const, key: 'nav.offers.international' },
              { type: 'all' as const, key: 'nav.offers.all' },
            ]).map((item) => (
              <Link
                key={item.type}
                to={`/offers?type=${item.type}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  tourType === item.type
                    ? 'bg-tarhal-orange text-white shadow-lg'
                    : 'bg-white/15 text-white/90 border border-white/25 hover:bg-white/25'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Filters Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <label className="text-sm font-medium text-white/90 whitespace-nowrap">
                  {t('countries.title', 'اختر الدولة')}
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={tourType === 'local' && !!resolvedUserCountryId}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-tarhal-orange backdrop-blur-sm transition-all hover:bg-white/25 disabled:opacity-60"
                >
                  <option value="" className="text-gray-900">{t('countries.subtitle', 'جميع الدول')}</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id} className="text-gray-900">
                      {getCountryName(country.id)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                <div className="flex items-center gap-2 text-xs md:text-sm text-white/90 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">{t('offers.sortBy', 'ترتيب حسب')}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                  >
                    <option value="recommended">
                      {t('offers.sort.recommended', 'المقترحة')}
                    </option>
                    <option value="priceAsc">{t('offers.sort.priceAsc', 'الأقل سعراً')}</option>
                    <option value="priceDesc">{t('offers.sort.priceDesc', 'الأعلى سعراً')}</option>
                    <option value="durationAsc">{t('offers.sort.durationAsc', 'أقصر مدة')}</option>
                    <option value="durationDesc">{t('offers.sort.durationDesc', 'أطول مدة')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs md:text-sm text-white/90 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="font-medium">{t('offers.maxPrice', 'حد السعر')}</span>
                  <select
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                  >
                    <option value="">{t('offers.anyPrice', 'أي سعر')}</option>
                    <option value="1000">≤ 1000</option>
                    <option value="3000">≤ 3000</option>
                    <option value="5000">≤ 5000</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs md:text-sm text-white/90 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="font-medium">{t('offers.featuredOnly', 'العروض المميزة فقط')}</span>
                  <Switch checked={onlyFeatured} onCheckedChange={setOnlyFeatured} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between border border-white/20 shadow-xl hover:bg-white/25 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div>
                <p className="text-xs text-white/80 font-medium mb-1">
                  {t('offers.stats.totalOffers', 'إجمالي العروض')}
                </p>
                <p className="text-3xl font-extrabold text-white">{stats.totalOffers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-400/25 flex items-center justify-center border border-yellow-400/40 shadow-lg">
                <Star className="h-6 w-6 text-yellow-300 fill-current" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between border border-white/20 shadow-xl hover:bg-white/25 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div>
                <p className="text-xs text-white/80 font-medium mb-1">
                  {t('offers.stats.countries', 'دول بها عروض')}
                </p>
                <p className="text-3xl font-extrabold text-white">{stats.countriesWithOffers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-tarhal-orange/25 flex items-center justify-center border border-tarhal-orange/40 shadow-lg">
                <MapPin className="h-6 w-6 text-tarhal-orange" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between border border-white/20 shadow-xl hover:bg-white/25 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div>
                <p className="text-xs text-white/80 font-medium mb-1">
                  {t('offers.stats.featured', 'عروض مميزة')}
                </p>
                <p className="text-3xl font-extrabold text-white">{stats.featuredCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-400/25 flex items-center justify-center border border-emerald-400/40 shadow-lg">
                <TrendingUp className="h-6 w-6 text-emerald-300" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between border border-white/20 shadow-xl hover:bg-white/25 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div>
                <p className="text-xs text-white/80 font-medium mb-1">
                  {t('offers.stats.avgPrice', 'متوسط السعر')}
                </p>
                <p className="text-3xl font-extrabold text-white">{formatPrice(stats.avgPrice)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/25 flex items-center justify-center border border-amber-400/40 shadow-lg">
                <DollarSign className="h-6 w-6 text-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Dropdown Section */}
      <section className="py-12 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-tarhal-blue-dark mb-3">
                {t('offers.selectCountry', 'اختر الدولة')}
              </h2>
              <p className="text-gray-600 text-lg">
                {t('offers.selectCountrySubtitle', 'استكشف العروض السياحية حسب الدولة')}
              </p>
            </div>

            {/* Countries Dropdown */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-tarhal-orange" />
                {t('countries.title', 'اختر الدولة')}
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                disabled={tourType === 'local' && !!resolvedUserCountryId}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:border-tarhal-orange focus:ring-4 focus:ring-tarhal-orange/20 text-gray-800 font-semibold text-lg bg-white hover:border-tarhal-orange/50 transition-all duration-300 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23f97316%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23f97316' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                }}
              >
                <option value="" className="text-gray-900 font-semibold py-2">
                  {t('countries.subtitle', 'جميع الدول')} ({activeOffers.length} {t('offers.offers', 'عرض')})
                </option>
                {countries
                  .filter((country) =>
                    activeOffers.some((offer) =>
                      offerMatchesCountry(countries, offer.countryId, country.id),
                    ),
                  )
                  .map((country) => {
                    const countryOffersCount = activeOffers.filter((o) =>
                      offerMatchesCountry(countries, o.countryId, country.id),
                    ).length;
                    return (
                      <option key={country.id} value={country.id} className="text-gray-900 py-2">
                        {getCountryName(country.id)} ({countryOffersCount} {t('offers.offers', 'عرض')})
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Selected Country Info */}
            {selectedCountry && (
              <div className="bg-gradient-to-r from-tarhal-orange/10 to-tarhal-orange/5 border-2 border-tarhal-orange/20 rounded-2xl p-6 mb-8 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-lg ring-2 ring-tarhal-orange/30">
                    {(() => {
                      const country = countries.find(c => c.id === selectedCountry);
                      return country?.mainImage ? (
                        <img
                          src={country.mainImage}
                          alt={getCountryName(selectedCountry)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark">
                          <MapPin className="h-8 w-8 text-white" />
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-tarhal-blue-dark mb-1">
                      {t('offers.offersIn', 'عروض في')} {getCountryName(selectedCountry)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {visibleOffers.length} {t('offers.availableOffers', 'عرض متاح')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCountry('')}
                  className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-tarhal-orange transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl"
                >
                  {t('common.clear', 'مسح')}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offers List Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {visibleOffers.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-200 p-12 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-tarhal-orange/20 to-tarhal-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-tarhal-orange" />
              </div>
              <p className="text-gray-800 text-xl font-bold mb-4">
                {selectedCountry
                  ? t('offers.noOffersInCountry', `لا توجد عروض متاحة في ${getCountryName(selectedCountry)} حالياً`)
                  : t('search.noResults', 'لا توجد عروض سياحية متاحة حالياً')
                }
              </p>
              <p className="text-gray-600 text-sm">
                {t(
                  'search.noResultsSubtitle',
                  'سيتم إضافة المزيد من العروض المميزة قريباً',
                )}
              </p>
              {selectedCountry && (
                <button
                  onClick={() => setSelectedCountry('')}
                  className="mt-6 px-6 py-3 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('offers.viewAllOffers', 'عرض جميع العروض')}
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {visibleOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="group bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 border border-gray-100 hover:border-tarhal-orange/30 relative"
                >
                  {/* Featured Badge */}
                  {offer.isFeatured && (
                    <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Award className="h-3.5 w-3.5" />
                      <span>{t('offers.featured', 'مميز')}</span>
                    </div>
                  )}

                  {offer.imageUrl && (
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                      <img
                        src={offer.imageUrl}
                        alt={getLocalizedText(offer.title)}
                        className="w-full h-full object-cover transform group-hover:scale-115 transition-transform duration-700"
                      />
                      {/* Image Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(offer.id);
                        }}
                        className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                          favorites.includes(offer.id)
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white/80 text-gray-700 hover:bg-white'
                        }`}
                      >
                        <Heart 
                          className={`h-5 w-5 ${favorites.includes(offer.id) ? 'fill-current' : ''}`} 
                        />
                      </button>

                      {/* Country Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20">
                        <MapPin className="h-3.5 w-3.5 text-tarhal-orange" />
                        <span>{getCountryName(offer.countryId)}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
                    {offer.videos && offer.videos.length > 0 && (
                      <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 bg-black">
                        <OfferVideo src={offer.videos[0]} className="w-full h-48 object-cover" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-extrabold text-tarhal-blue-dark mb-2 flex-1 group-hover:text-tarhal-orange transition-colors duration-300 line-clamp-2">
                        {getLocalizedText(offer.title)}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {getLocalizedText(offer.description)}
                    </p>

                    {/* Info Icons */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-tarhal-blue" />
                        <span className="font-medium">
                          {offer.durationDays} {t('home.tourism.countriesStat', language === 'ar' ? 'أيام' : 'days')}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-tarhal-orange" />
                        <span className="font-medium">{t('offers.available', 'متاح الآن')}</span>
                      </span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between mb-5 pt-4 border-t border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-tarhal-orange">
                            {formatPrice(offer.price, offer.currency as any)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('offers.perPerson', 'للشخص الواحد')}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <Link to={`/offers/${offer.id}`} className="flex-1">
                        <Button
                          className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark hover:from-tarhal-orange-dark hover:to-tarhal-orange text-white font-semibold rounded-xl py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          {t('common.viewDetails', 'عرض التفاصيل')}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <button
                        className="p-2.5 rounded-xl border border-gray-300 hover:border-tarhal-orange hover:bg-tarhal-orange/5 transition-all duration-300"
                        title={t('common.share', 'مشاركة')}
                      >
                        <Share2 className="h-4 w-4 text-gray-600 hover:text-tarhal-orange" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}


