import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Mail, Globe, Filter, Search, ArrowRight, Car as CarIcon, Award, Users, DollarSign, Shield, Clock } from 'lucide-react';
import { dataManager, type CarRental, type AdminCountryData } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCountryName } from '@/data/countries';

export default function CarRentals() {
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [countries, setCountries] = useState<AdminCountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPrice, setFilterPrice] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'name'>('rating');
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/3802512/pexels-photo-3802512.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/3802509/pexels-photo-3802509.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Loading all car rentals...');
        // Load countries
        const countriesData = await dataManager.getCountriesAsync();
        setCountries(countriesData);
        console.log('Loaded countries:', countriesData.length);
        
        // Ensure car rentals exist for all countries
        console.log('Ensuring car rentals for all countries...');
        await dataManager.ensureCarRentalsForAllCountries();
        
        // Load car rentals
        const allCarRentals = await dataManager.getCarRentalsAsync();
        console.log('Total car rentals loaded:', allCarRentals.length);
        
        const activeCarRentals = allCarRentals.filter(c => c.isActive);
        console.log('Active car rentals:', activeCarRentals.length);
        setCarRentals(activeCarRentals);
      } catch (error) {
        console.error('Error loading car rentals:', error);
        // Fallback to localStorage
        const countriesData = dataManager.getCountries();
        setCountries(countriesData);
        const allCarRentals = dataManager.getCarRentals().filter(c => c.isActive);
        console.log('Fallback: Active car rentals:', allCarRentals.length);
        setCarRentals(allCarRentals);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredCarRentals = useMemo(() => {
    let result = carRentals;

    // Country filter
    if (selectedCountry) {
      result = result.filter(carRental => carRental.countryId === selectedCountry);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(carRental => 
        carRental.name[language]?.toLowerCase().includes(query) ||
        carRental.city[language]?.toLowerCase().includes(query) ||
        carRental.description[language]?.toLowerCase().includes(query)
      );
    }

    // Price filter (based on minimum car type price)
    if (filterPrice !== 'all') {
      result = result.filter(carRental => {
        const minPrice = Math.min(...carRental.carTypes.map(ct => ct.pricePerDay));
        return minPrice <= filterPrice;
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          const aMinPrice = Math.min(...a.carTypes.map(ct => ct.pricePerDay));
          const bMinPrice = Math.min(...b.carTypes.map(ct => ct.pricePerDay));
          return aMinPrice - bMinPrice;
        case 'name':
          return (a.name[language] || '').localeCompare(b.name[language] || '');
        default:
          return 0;
      }
    });

    return result;
  }, [carRentals, selectedCountry, searchQuery, filterPrice, sortBy, language]);

  const getLocalizedText = (obj?: { ar: string; en: string; fr: string }) => {
    if (!obj) return '';
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
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
            <CarIcon className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">
              {language === 'ar' ? 'استئجار السيارات' : language === 'fr' ? 'Location de voitures' : 'Car Rental'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            {language === 'ar' ? 'استأجر سيارتك المثالية' : language === 'fr' ? 'Louez votre voiture idéale' : 'Rent Your Perfect Car'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اكتشف أفضل خدمات استئجار السيارات في جميع أنحاء العالم'
              : language === 'fr'
              ? 'Découvrez les meilleurs services de location de voitures du monde entier'
              : 'Discover the best car rental services around the world'}
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Country Filter */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange appearance-none bg-white"
                >
                  <option value="">
                    {language === 'ar' ? 'جميع الدول' : language === 'fr' ? 'Tous les pays' : 'All Countries'}
                  </option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {getCountryName(country, language)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث عن خدمة...' : language === 'fr' ? 'Rechercher un service...' : 'Search for a service...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
              >
                <option value="all">{language === 'ar' ? 'أي سعر' : language === 'fr' ? 'Tout prix' : 'Any Price'}</option>
                <option value="50">{language === 'ar' ? 'حتى 50' : language === 'fr' ? 'Jusqu\'à 50' : 'Up to 50'}</option>
                <option value="100">{language === 'ar' ? 'حتى 100' : language === 'fr' ? 'Jusqu\'à 100' : 'Up to 100'}</option>
                <option value="150">{language === 'ar' ? 'حتى 150' : language === 'fr' ? 'Jusqu\'à 150' : 'Up to 150'}</option>
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

      {/* Car Rentals Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-tarhal-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...'}
              </p>
            </div>
          ) : filteredCarRentals.length === 0 ? (
            <div className="text-center py-16">
              <CarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">
                {language === 'ar' ? 'لا توجد خدمات متاحة' : language === 'fr' ? 'Aucun service disponible' : 'No services available'}
              </p>
              <p className="text-gray-500">
                {language === 'ar' ? 'جرب تغيير معايير البحث' : language === 'fr' ? 'Essayez de modifier les critères de recherche' : 'Try changing your search criteria'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'ar' 
                    ? `تم العثور على ${filteredCarRentals.length} خدمة${filteredCarRentals.length > 1 ? 'ات' : ''}`
                    : language === 'fr'
                    ? `${filteredCarRentals.length} service${filteredCarRentals.length > 1 ? 's' : ''} trouvé${filteredCarRentals.length > 1 ? 's' : ''}`
                    : `${filteredCarRentals.length} service${filteredCarRentals.length > 1 ? 's' : ''} found`}
                </h2>
                {selectedCountry && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCountry('')}
                    className="text-sm"
                  >
                    {language === 'ar' ? 'إزالة الفلتر' : language === 'fr' ? 'Retirer le filtre' : 'Clear Filter'}
                  </Button>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCarRentals.map((carRental) => {
                  const country = countries.find(c => c.id === carRental.countryId);
                  const minPrice = Math.min(...carRental.carTypes.map(ct => ct.pricePerDay));
                  const maxPrice = Math.max(...carRental.carTypes.map(ct => ct.pricePerDay));
                  
                  return (
                    <div
                      key={carRental.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {/* Image */}
                      {carRental.imageUrl && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={carRental.imageUrl}
                            alt={getLocalizedText(carRental.name)}
                            className="w-full h-full object-cover"
                          />
                          {carRental.isFeatured && (
                            <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {language === 'ar' ? 'مميز' : language === 'fr' ? 'Recommandé' : 'Featured'}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {getLocalizedText(carRental.name)}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{getLocalizedText(carRental.city)}</span>
                          {country && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span>{getCountryName(country, language)}</span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {getLocalizedText(carRental.description)}
                        </p>

                        {/* Rating & Reviews */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{carRental.rating}</span>
                            </div>
                            <span className="text-gray-500 text-sm">
                              ({carRental.reviews} {language === 'ar' ? 'مراجعة' : language === 'fr' ? 'avis' : 'reviews'})
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-tarhal-orange">
                              {minPrice === maxPrice 
                                ? formatPrice(minPrice, carRental.carTypes[0]?.currency as any || 'USD')
                                : `${formatPrice(minPrice, carRental.carTypes[0]?.currency as any || 'USD')} - ${formatPrice(maxPrice, carRental.carTypes[0]?.currency as any || 'USD')}`
                              }
                            </div>
                            <div className="text-xs text-gray-500">
                              {language === 'ar' ? 'لليوم' : language === 'fr' ? 'par jour' : 'per day'}
                            </div>
                          </div>
                        </div>

                        {/* Car Types */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            {language === 'ar' ? 'أنواع السيارات المتاحة:' : language === 'fr' ? 'Types de voitures disponibles:' : 'Available Car Types:'}
                          </h4>
                          <div className="space-y-2">
                            {carRental.carTypes.slice(0, 3).map((carType, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 px-3 py-2 rounded-lg">
                                <span className="text-gray-700 font-medium">{getLocalizedText(carType.type)}</span>
                                <span className="text-tarhal-orange font-bold">
                                  {formatPrice(carType.pricePerDay, carType.currency as any)}
                                </span>
                              </div>
                            ))}
                            {carRental.carTypes.length > 3 && (
                              <p className="text-xs text-gray-500 text-center">
                                +{carRental.carTypes.length - 3} {language === 'ar' ? 'أكثر' : language === 'fr' ? 'plus' : 'more'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Services */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {carRental.services?.[language]?.slice(0, 3).map((service, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          {carRental.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span className="truncate">{carRental.phone}</span>
                            </div>
                          )}
                          {carRental.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{carRental.email}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
                            asChild
                          >
                            <Link to={`/car-rentals/${carRental.id}`}>
                              {language === 'ar' ? 'عرض السيارات' : language === 'fr' ? 'Voir les voitures' : 'View Cars'}
                            </Link>
                          </Button>
                          {carRental.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={carRental.website} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

