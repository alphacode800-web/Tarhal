import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Plane, Calendar, Users, MapPin, Search, ArrowRight, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { dataManager, type AdminCountryData } from '@/services/dataManager';

export default function FlightTickets() {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [classType, setClassType] = useState('economy');
  const [countries, setCountries] = useState<AdminCountryData[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await dataManager.getCountriesAsync();
      setCountries(countriesData);
    };
    loadCountries();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!from || !to) {
      alert(language === 'ar' ? 'الرجاء اختيار الوجهات' : language === 'fr' ? 'Veuillez sélectionner les destinations' : 'Please select destinations');
      return;
    }

    // Navigate to booking page with search parameters
    const params = new URLSearchParams({
      from,
      to,
      departDate,
      returnDate: tripType === 'round-trip' ? returnDate : '',
      passengers: passengers.toString(),
      classType,
      tripType
    });
    
    navigate(`/flight-booking?${params.toString()}`);
  };

  const handleQuickBook = (fromCountryId: string, toCountryId: string, price: number) => {
    const params = new URLSearchParams({
      from: fromCountryId,
      to: toCountryId,
      departDate: '',
      returnDate: '',
      passengers: '1',
      classType: 'economy',
      tripType: 'round-trip',
      price: price.toString()
    });
    
    navigate(`/flight-booking?${params.toString()}`);
  };

  const features = [
    {
      icon: Clock,
      title: { ar: 'حجز فوري', en: 'Instant Booking', fr: 'Réservation instantanée' },
      description: { ar: 'احجز تذكرتك في دقائق', en: 'Book your ticket in minutes', fr: 'Réservez votre billet en minutes' }
    },
    {
      icon: DollarSign,
      title: { ar: 'أفضل الأسعار', en: 'Best Prices', fr: 'Meilleurs prix' },
      description: { ar: 'مقارنة أسعار جميع شركات الطيران', en: 'Compare prices from all airlines', fr: 'Comparez les prix de toutes les compagnies' }
    },
    {
      icon: CheckCircle2,
      title: { ar: 'دعم 24/7', en: '24/7 Support', fr: 'Support 24/7' },
      description: { ar: 'فريقنا جاهز لمساعدتك في أي وقت', en: 'Our team is ready to help anytime', fr: 'Notre équipe est prête à vous aider à tout moment' }
    }
  ];

  const popularRoutes = [
    { from: 'sudan', to: 'egypt', fromName: { ar: 'السودان', en: 'Sudan', fr: 'Soudan' }, toName: { ar: 'مصر', en: 'Egypt', fr: 'Égypte' }, price: 299 },
    { from: 'saudi', to: 'uk', fromName: { ar: 'السعودية', en: 'Saudi Arabia', fr: 'Arabie Saoudite' }, toName: { ar: 'بريطانيا', en: 'United Kingdom', fr: 'Royaume-Uni' }, price: 599 },
    { from: 'uae', to: 'france', fromName: { ar: 'الإمارات', en: 'UAE', fr: 'EAU' }, toName: { ar: 'فرنسا', en: 'France', fr: 'France' }, price: 549 },
    { from: 'qatar', to: 'usa', fromName: { ar: 'قطر', en: 'Qatar', fr: 'Qatar' }, toName: { ar: 'أمريكا', en: 'USA', fr: 'États-Unis' }, price: 899 },
    { from: 'uae', to: 'japan', fromName: { ar: 'الإمارات', en: 'UAE', fr: 'EAU' }, toName: { ar: 'اليابان', en: 'Japan', fr: 'Japon' }, price: 799 },
    { from: 'kuwait', to: 'turkey', fromName: { ar: 'الكويت', en: 'Kuwait', fr: 'Koweït' }, toName: { ar: 'تركيا', en: 'Turkey', fr: 'Turquie' }, price: 249 }
  ];

  const getLocalizedText = (obj: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tarhal-navy/95 via-tarhal-blue-dark/90 to-tarhal-blue/85" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Plane className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'تذاكر الطيران' : language === 'fr' ? 'Billets d\'avion' : 'Flight Tickets'}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              {language === 'ar' ? 'احجز تذكرتك الآن' : language === 'fr' ? 'Réservez votre billet maintenant' : 'Book Your Ticket Now'}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'اكتشف أفضل العروض على تذاكر الطيران لجميع الوجهات حول العالم'
                : language === 'fr'
                ? 'Découvrez les meilleures offres de billets d\'avion pour toutes les destinations du monde'
                : 'Discover the best deals on flight tickets to destinations worldwide'}
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6">
            <form onSubmit={handleSearch}>
              {/* Trip Type Selector */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setTripType('round-trip')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    tripType === 'round-trip'
                      ? 'bg-tarhal-orange text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'ar' ? 'ذهاب وعودة' : language === 'fr' ? 'Aller-retour' : 'Round Trip'}
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('one-way')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    tripType === 'one-way'
                      ? 'bg-tarhal-orange text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'ar' ? 'ذهاب فقط' : language === 'fr' ? 'Aller simple' : 'One Way'}
                </button>
              </div>

              {/* Search Fields */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full pr-10 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange text-gray-900 appearance-none"
                    required
                  >
                    <option value="">{language === 'ar' ? 'من' : language === 'fr' ? 'De' : 'From'}</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name[language] || country.name.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full pr-10 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange text-gray-900 appearance-none"
                    required
                  >
                    <option value="">{language === 'ar' ? 'إلى' : language === 'fr' ? 'À' : 'To'}</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name[language] || country.name.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full pr-10 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange text-gray-900"
                    required
                  />
                </div>
                {tripType === 'round-trip' && (
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full pr-10 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange text-gray-900"
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="w-full pr-10 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange text-gray-900 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>
                        {num} {language === 'ar' ? 'مسافر' : language === 'fr' ? 'passager(s)' : 'passenger(s)'}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange text-gray-900"
                >
                  <option value="economy">{language === 'ar' ? 'اقتصادية' : language === 'fr' ? 'Économique' : 'Economy'}</option>
                  <option value="business">{language === 'ar' ? 'رجال أعمال' : language === 'fr' ? 'Affaires' : 'Business'}</option>
                  <option value="first">{language === 'ar' ? 'أولى' : language === 'fr' ? 'Première' : 'First Class'}</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-tarhal-orange hover:bg-tarhal-orange-dark text-white py-6 text-lg font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'ابحث عن رحلات' : language === 'fr' ? 'Rechercher des vols' : 'Search Flights'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'ar' ? 'لماذا تحجز معنا؟' : language === 'fr' ? 'Pourquoi réserver avec nous?' : 'Why Book With Us?'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-tarhal-orange/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-tarhal-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{getLocalizedText(feature.title)}</h3>
                <p className="text-gray-600">{getLocalizedText(feature.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'ar' ? 'الوجهات الأكثر شعبية' : language === 'fr' ? 'Destinations populaires' : 'Popular Destinations'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-gray-900">{getLocalizedText(route.fromName)}</div>
                    </div>
                    <div className="mx-4">
                      <ArrowRight className="h-6 w-6 text-tarhal-orange" />
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-gray-900">{getLocalizedText(route.toName)}</div>
                    </div>
                  </div>
                  <div className="text-center border-t pt-4">
                    <div className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'من' : language === 'fr' ? 'À partir de' : 'From'}
                    </div>
                    <div className="text-3xl font-bold text-tarhal-orange mb-3">
                      {formatPrice(route.price, 'USD')}
                    </div>
                    <Button 
                      className="w-full bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
                      onClick={() => handleQuickBook(route.from, route.to, route.price)}
                    >
                      {language === 'ar' ? 'احجز الآن' : language === 'fr' ? 'Réserver' : 'Book Now'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

