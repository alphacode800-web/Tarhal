import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Mail, Globe, Wifi, Car, Utensils, Dumbbell, Filter, Search, ArrowRight, Hotel as HotelIcon, Award, Users, DollarSign } from 'lucide-react';
import { dataManager, type Hotel, type AdminCountryData } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCountryName } from '@/data/countries';

export default function Hotels() {
  const { countryId } = useParams<{ countryId: string }>();
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [countries, setCountries] = useState<AdminCountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStars, setFilterStars] = useState<number | 'all'>('all');
  const [filterPrice, setFilterPrice] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'name'>('rating');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Loading hotels for country:', countryId);
        // Load countries
        const countriesData = await dataManager.getCountriesAsync();
        setCountries(countriesData);
        console.log('Loaded countries:', countriesData.length);
        
        // Ensure hotels exist for all countries
        console.log('Ensuring hotels for all countries...');
        await dataManager.ensureHotelsForAllCountries();
        
        // Load hotels
        const allHotels = await dataManager.getHotelsAsync();
        console.log('Total hotels loaded:', allHotels.length);
        
        if (countryId) {
          const countryHotels = allHotels.filter(h => h.countryId === countryId && h.isActive);
          console.log(`Hotels for country ${countryId}:`, countryHotels.length);
          setHotels(countryHotels);
        } else {
          const activeHotels = allHotels.filter(h => h.isActive);
          console.log('Active hotels:', activeHotels.length);
          setHotels(activeHotels);
        }
      } catch (error) {
        console.error('Error loading hotels:', error);
        // Fallback to localStorage
        const countriesData = dataManager.getCountries();
        setCountries(countriesData);
        if (countryId) {
          const countryHotels = dataManager.getHotelsByCountry(countryId);
          console.log('Fallback: Hotels for country:', countryHotels.length);
          setHotels(countryHotels);
        } else {
          const allHotels = dataManager.getHotels().filter(h => h.isActive);
          console.log('Fallback: Active hotels:', allHotels.length);
          setHotels(allHotels);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [countryId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const country = countries.find(c => c.id === countryId);
  const countryName = country ? getCountryName(country, language) : '';

  const filteredHotels = useMemo(() => {
    let result = hotels;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(hotel => 
        hotel.name[language]?.toLowerCase().includes(query) ||
        hotel.city[language]?.toLowerCase().includes(query) ||
        hotel.description[language]?.toLowerCase().includes(query)
      );
    }

    // Stars filter
    if (filterStars !== 'all') {
      result = result.filter(hotel => hotel.stars === filterStars);
    }

    // Price filter
    if (filterPrice !== 'all') {
      result = result.filter(hotel => hotel.pricePerNight <= filterPrice);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.pricePerNight - b.pricePerNight;
        case 'name':
          return (a.name[language] || '').localeCompare(b.name[language] || '');
        default:
          return 0;
      }
    });

    return result;
  }, [hotels, searchQuery, filterStars, filterPrice, sortBy, language]);

  const getLocalizedText = (obj?: { ar: string; en: string; fr: string }) => {
    if (!obj) return '';
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
  };

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-tarhal-navy/92 via-tarhal-blue-dark/88 to-tarhal-blue/85 z-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />
        </div>

        <div className="container mx-auto px-4 relative z-30 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <HotelIcon className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">
              {language === 'ar' ? 'الفنادق' : language === 'fr' ? 'Hôtels' : 'Hotels'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            {language === 'ar' ? `فنادق ${countryName}` : language === 'fr' ? `Hôtels ${countryName}` : `${countryName} Hotels`}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اكتشف أفضل الفنادق والمنتجعات في وجهتك القادمة'
              : language === 'fr'
              ? 'Découvrez les meilleurs hôtels et resorts de votre destination'
              : 'Discover the best hotels and resorts in your next destination'}
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث عن فندق...' : language === 'fr' ? 'Rechercher un hôtel...' : 'Search for a hotel...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                />
              </div>
            </div>

            {/* Stars Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterStars}
                onChange={(e) => setFilterStars(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
              >
                <option value="all">{language === 'ar' ? 'جميع النجوم' : language === 'fr' ? 'Toutes les étoiles' : 'All Stars'}</option>
                <option value="5">5 {language === 'ar' ? 'نجوم' : language === 'fr' ? 'étoiles' : 'stars'}</option>
                <option value="4">4 {language === 'ar' ? 'نجوم' : language === 'fr' ? 'étoiles' : 'stars'}</option>
                <option value="3">3 {language === 'ar' ? 'نجوم' : language === 'fr' ? 'étoiles' : 'stars'}</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
              >
                <option value="all">{language === 'ar' ? 'أي سعر' : language === 'fr' ? 'Tout prix' : 'Any Price'}</option>
                <option value="100">{language === 'ar' ? 'حتى 100' : language === 'fr' ? 'Jusqu\'à 100' : 'Up to 100'}</option>
                <option value="200">{language === 'ar' ? 'حتى 200' : language === 'fr' ? 'Jusqu\'à 200' : 'Up to 200'}</option>
                <option value="300">{language === 'ar' ? 'حتى 300' : language === 'fr' ? 'Jusqu\'à 300' : 'Up to 300'}</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
              >
                <option value="rating">{language === 'ar' ? 'الأعلى تقييماً' : language === 'fr' ? 'Mieux notés' : 'Highest Rated'}</option>
                <option value="price">{language === 'ar' ? 'الأقل سعراً' : language === 'fr' ? 'Moins cher' : 'Lowest Price'}</option>
                <option value="name">{language === 'ar' ? 'الاسم' : language === 'fr' ? 'Nom' : 'Name'}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-tarhal-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...'}
              </p>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-16">
              <HotelIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">
                {language === 'ar' ? 'لا توجد فنادق متاحة' : language === 'fr' ? 'Aucun hôtel disponible' : 'No hotels available'}
              </p>
              <p className="text-gray-500">
                {language === 'ar' ? 'جرب تغيير معايير البحث' : language === 'fr' ? 'Essayez de modifier les critères de recherche' : 'Try changing your search criteria'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <Link to={`/offices/${countryId}/hotels/${hotel.id}`} className="block">
                  {/* Image */}
                  {hotel.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={hotel.imageUrl}
                        alt={getLocalizedText(hotel.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {hotel.isFeatured && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {language === 'ar' ? 'مميز' : language === 'fr' ? 'Recommandé' : 'Featured'}
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 flex gap-1">
                        {renderStars(hotel.stars)}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {getLocalizedText(hotel.name)}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{getLocalizedText(hotel.city)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {getLocalizedText(hotel.description)}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{hotel.rating}</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          ({hotel.reviews} {language === 'ar' ? 'مراجعة' : language === 'fr' ? 'avis' : 'reviews'})
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-tarhal-orange">
                          {formatPrice(hotel.pricePerNight, hotel.currency as any)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {language === 'ar' ? 'للليلة' : language === 'fr' ? 'par nuit' : 'per night'}
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities?.[language]?.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex gap-2 px-6 pb-6">
                    <Link to={`/offices/${countryId}/hotels/${hotel.id}/booking`} className="flex-1">
                      <Button className="w-full bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
                        {language === 'ar' ? 'احجز الآن' : language === 'fr' ? 'Réserver maintenant' : 'Book Now'}
                      </Button>
                    </Link>
                    <Link to={`/offices/${countryId}/hotels/${hotel.id}`}>
                      <Button variant="outline" size="sm">
                        {language === 'ar' ? 'التفاصيل' : language === 'fr' ? 'Détails' : 'Details'}
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </Link>
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

