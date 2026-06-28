import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Car, Package, MapPin, Phone, Star, Clock, DollarSign, Users, Shield, Zap, Search, Filter, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { dataManager, type AdminCountryData } from '@/services/dataManager';

interface TaxiDeliveryService {
  id: string;
  countryId: string;
  type: 'taxi' | 'delivery';
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  imageUrl: string;
  rating: number;
  totalRides: number;
  pricePerKm: number;
  minimumFare: number;
  phone: string;
  availableVehicles?: string[];
  serviceHours: {
    ar: string;
    en: string;
    fr: string;
  };
  features: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  coverage: {
    ar: string;
    en: string;
    fr: string;
  };
}

export default function TaxiDelivery() {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const countryId = searchParams.get('country');

  const [services, setServices] = useState<TaxiDeliveryService[]>([]);
  const [countries, setCountries] = useState<AdminCountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'taxi' | 'delivery'>('all');
  const [selectedCountry, setSelectedCountry] = useState(countryId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'rides'>('rating');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('[TaxiDelivery] Loading data...');
      const countriesData = await dataManager.getCountriesAsync();
      const servicesData = await dataManager.getTaxiDeliveryServicesAsync();
      
      console.log('[TaxiDelivery] Countries:', countriesData.length);
      console.log('[TaxiDelivery] Services:', servicesData.length);
      
      setCountries(countriesData);
      setServices(servicesData);

      // Ensure services for all countries
      if (servicesData.length === 0) {
        console.log('[TaxiDelivery] No services found, creating default services...');
        await dataManager.ensureTaxiDeliveryServicesForAllCountries();
        const newServices = await dataManager.getTaxiDeliveryServicesAsync();
        console.log('[TaxiDelivery] Created services:', newServices.length);
        setServices(newServices);
      }
    } catch (error) {
      console.error('[TaxiDelivery] Error loading data:', error);
    }
    setLoading(false);
  };

  const getLocalizedText = (obj: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
  };

  const filteredServices = services
    .filter(service => {
      const typeMatch = selectedType === 'all' || service.type === selectedType;
      const countryMatch = !selectedCountry || service.countryId === selectedCountry;
      const searchMatch = !searchQuery || 
        getLocalizedText(service.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getLocalizedText(service.description).toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && countryMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.pricePerKm - b.pricePerKm;
      if (sortBy === 'rides') return b.totalRides - a.totalRides;
      return 0;
    });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-tarhal-orange mx-auto mb-4"></div>
            <p className="text-gray-600">
              {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://images.pexels.com/photos/7233367/pexels-photo-7233367.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tarhal-navy/95 via-tarhal-blue-dark/90 to-tarhal-blue/85" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Car className="h-5 w-5 text-yellow-300" />
            <Package className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">
              {language === 'ar' ? 'خدمات التاكسي والديليفري' : language === 'fr' ? 'Services de Taxi et Livraison' : 'Taxi & Delivery Services'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            {language === 'ar' ? 'احجز تاكسي أو طلب ديليفري' : language === 'fr' ? 'Réservez un Taxi ou une Livraison' : 'Book a Taxi or Order Delivery'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'خدمات نقل وتوصيل سريعة وآمنة في جميع المدن'
              : language === 'fr'
              ? 'Services de transport et de livraison rapides et sûrs dans toutes les villes'
              : 'Fast and safe transportation and delivery services in all cities'}
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث...' : language === 'fr' ? 'Rechercher...' : 'Search...'}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
              />
            </div>

            {/* Service Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
            >
              <option value="all">{language === 'ar' ? 'جميع الخدمات' : language === 'fr' ? 'Tous les Services' : 'All Services'}</option>
              <option value="taxi">{language === 'ar' ? 'تاكسي' : language === 'fr' ? 'Taxi' : 'Taxi'}</option>
              <option value="delivery">{language === 'ar' ? 'ديليفري' : language === 'fr' ? 'Livraison' : 'Delivery'}</option>
            </select>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
            >
              <option value="">{language === 'ar' ? 'جميع الدول' : language === 'fr' ? 'Tous les Pays' : 'All Countries'}</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {getLocalizedText(country.name)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
            >
              <option value="rating">{language === 'ar' ? 'الأعلى تقييماً' : language === 'fr' ? 'Mieux Noté' : 'Highest Rated'}</option>
              <option value="price">{language === 'ar' ? 'الأقل سعراً' : language === 'fr' ? 'Prix le Plus Bas' : 'Lowest Price'}</option>
              <option value="rides">{language === 'ar' ? 'الأكثر استخداماً' : language === 'fr' ? 'Plus Utilisé' : 'Most Used'}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد خدمات متاحة' : language === 'fr' ? 'Aucun Service Disponible' : 'No Services Available'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar' ? 'جرب تغيير الفلاتر' : language === 'fr' ? 'Essayez de changer les filtres' : 'Try changing the filters'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const country = countries.find(c => c.id === service.countryId);
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Service Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={getLocalizedText(service.name)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                          service.type === 'taxi' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {service.type === 'taxi' 
                            ? (language === 'ar' ? 'تاكسي' : language === 'fr' ? 'Taxi' : 'Taxi')
                            : (language === 'ar' ? 'ديليفري' : language === 'fr' ? 'Livraison' : 'Delivery')}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">{service.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{getLocalizedText(service.name)}</h3>
                        {service.type === 'taxi' ? (
                          <Car className="h-6 w-6 text-blue-500" />
                        ) : (
                          <Package className="h-6 w-6 text-green-500" />
                        )}
                      </div>

                      {country && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{getLocalizedText(country.name)}</span>
                        </div>
                      )}

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {getLocalizedText(service.description)}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-tarhal-orange" />
                          <div>
                            <div className="text-xs text-gray-500">
                              {language === 'ar' ? 'سعر الكيلو' : language === 'fr' ? 'Prix/km' : 'Per km'}
                            </div>
                            <div className="font-bold text-gray-900">{formatPrice(service.pricePerKm, 'USD')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-tarhal-orange" />
                          <div>
                            <div className="text-xs text-gray-500">
                              {language === 'ar' ? 'الرحلات' : language === 'fr' ? 'Trajets' : 'Rides'}
                            </div>
                            <div className="font-bold text-gray-900">{service.totalRides.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="h-4 w-4" />
                        <span>{getLocalizedText(service.serviceHours)}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/taxi-delivery/book/${service.id}`)}
                          className="flex-1 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
                        >
                          {language === 'ar' ? 'احجز الآن' : language === 'fr' ? 'Réserver' : 'Book Now'}
                        </Button>
                        <Button
                          onClick={() => window.location.href = `tel:${service.phone}`}
                          variant="outline"
                          className="px-4"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'ar' ? 'لماذا تختار خدماتنا؟' : language === 'fr' ? 'Pourquoi Choisir Nos Services?' : 'Why Choose Our Services?'}
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'خدمة سريعة' : language === 'fr' ? 'Service Rapide' : 'Fast Service'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ar' ? 'وصول سريع في دقائق' : language === 'fr' ? 'Arrivée rapide en minutes' : 'Quick arrival in minutes'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'آمن وموثوق' : language === 'fr' ? 'Sûr et Fiable' : 'Safe & Reliable'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ar' ? 'سائقون محترفون ومعتمدون' : language === 'fr' ? 'Chauffeurs professionnels certifiés' : 'Professional certified drivers'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'أسعار منافسة' : language === 'fr' ? 'Prix Compétitifs' : 'Competitive Prices'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ar' ? 'أفضل الأسعار في السوق' : language === 'fr' ? 'Les meilleurs prix du marché' : 'Best prices in the market'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'متاح 24/7' : language === 'fr' ? 'Disponible 24/7' : 'Available 24/7'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ar' ? 'خدمة على مدار الساعة' : language === 'fr' ? 'Service 24h/24' : 'Round-the-clock service'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

