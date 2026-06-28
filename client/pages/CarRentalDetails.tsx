import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Mail, Globe, ArrowLeft, Car, Users, Gauge, Fuel, Cog, Calendar, Filter, Search, Check, X } from 'lucide-react';
import { dataManager, type CarRental, type CarVehicle, type AdminCountryData } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCountryName } from '@/data/countries';

export default function CarRentalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [carRental, setCarRental] = useState<CarRental | null>(null);
  const [vehicles, setVehicles] = useState<CarVehicle[]>([]);
  const [country, setCountry] = useState<AdminCountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<CarVehicle | null>(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  
  // Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTransmission, setFilterTransmission] = useState<string>('all');
  const [filterPrice, setFilterPrice] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'year' | 'name'>('price');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        console.log('Loading car rental details for ID:', id);
        
        // Load car rental
        const allRentals = await dataManager.getCarRentalsAsync();
        const rental = allRentals.find(r => r.id === id);
        
        if (!rental) {
          console.error('Car rental not found');
          setLoading(false);
          return;
        }
        
        setCarRental(rental);
        console.log('Found car rental:', rental.name.en);
        
        // Load country
        const countries = await dataManager.getCountriesAsync();
        const foundCountry = countries.find(c => c.id === rental.countryId);
        setCountry(foundCountry || null);
        
        // Ensure vehicles exist
        await dataManager.ensureVehiclesForCarRentals();
        
        // Load vehicles for this rental
        const rentalVehicles = await dataManager.getCarVehiclesByRentalAsync(id);
        console.log('Loaded vehicles:', rentalVehicles.length);
        setVehicles(rentalVehicles);
      } catch (error) {
        console.error('Error loading car rental details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const filteredVehicles = useMemo(() => {
    let result = vehicles;

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(v => v.type === filterType);
    }

    // Transmission filter
    if (filterTransmission !== 'all') {
      result = result.filter(v => v.transmission === filterTransmission);
    }

    // Price filter
    if (filterPrice !== 'all') {
      result = result.filter(v => v.pricePerDay <= filterPrice);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.name[language]?.toLowerCase().includes(query) ||
        v.brand[language]?.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerDay - b.pricePerDay;
        case 'year':
          return b.year - a.year;
        case 'name':
          return (a.name[language] || '').localeCompare(b.name[language] || '');
        default:
          return 0;
      }
    });

    return result;
  }, [vehicles, filterType, filterTransmission, filterPrice, searchQuery, sortBy, language]);

  const getLocalizedText = (obj?: { ar: string; en: string; fr: string }) => {
    if (!obj) return '';
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
  };

  const getTypeLabel = (type: CarVehicle['type']) => {
    const labels = {
      economy: { ar: 'اقتصادية', en: 'Economy', fr: 'Économique' },
      'mid-size': { ar: 'متوسطة', en: 'Mid-size', fr: 'Taille moyenne' },
      luxury: { ar: 'فاخرة', en: 'Luxury', fr: 'Luxe' },
      suv: { ar: 'دفع رباعي', en: 'SUV', fr: 'SUV' },
      van: { ar: 'فان', en: 'Van', fr: 'Van' },
      sports: { ar: 'رياضية', en: 'Sports', fr: 'Sportive' },
      electric: { ar: 'كهربائية', en: 'Electric', fr: 'Électrique' }
    };
    return getLocalizedText(labels[type]);
  };

  const getTransmissionLabel = (transmission: 'automatic' | 'manual') => {
    return transmission === 'automatic' 
      ? (language === 'ar' ? 'أوتوماتيك' : language === 'fr' ? 'Automatique' : 'Automatic')
      : (language === 'ar' ? 'يدوي' : language === 'fr' ? 'Manuelle' : 'Manual');
  };

  const getFuelTypeLabel = (fuel: CarVehicle['fuelType']) => {
    const labels = {
      gasoline: { ar: 'بنزين', en: 'Gasoline', fr: 'Essence' },
      diesel: { ar: 'ديزل', en: 'Diesel', fr: 'Diesel' },
      electric: { ar: 'كهربائي', en: 'Electric', fr: 'Électrique' },
      hybrid: { ar: 'هجين', en: 'Hybrid', fr: 'Hybride' }
    };
    return getLocalizedText(labels[fuel]);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-tarhal-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!carRental) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'الوكالة غير موجودة' : language === 'fr' ? 'Agence introuvable' : 'Agency not found'}
          </h2>
          <Button onClick={() => navigate('/car-rentals')} className="mt-4">
            {language === 'ar' ? 'العودة إلى القائمة' : language === 'fr' ? 'Retour à la liste' : 'Back to List'}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue text-white py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/car-rentals')}
            className="mb-6 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'العودة إلى القائمة' : language === 'fr' ? 'Retour' : 'Back'}
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Agency Info */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                {carRental.imageUrl && (
                  <img
                    src={carRental.imageUrl}
                    alt={getLocalizedText(carRental.name)}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-bold mb-2">{getLocalizedText(carRental.name)}</h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="h-5 w-5" />
                    <span>{getLocalizedText(carRental.city)}</span>
                    {country && (
                      <>
                        <span>•</span>
                        <span>{getCountryName(country, language)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-white/90 mb-4">{getLocalizedText(carRental.description)}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{carRental.rating}</span>
                  <span className="text-white/70">
                    ({carRental.reviews} {language === 'ar' ? 'مراجعة' : language === 'fr' ? 'avis' : 'reviews'})
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'معلومات الاتصال' : language === 'fr' ? 'Contact' : 'Contact Info'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <a href={`tel:${carRental.phone}`} className="hover:underline">{carRental.phone}</a>
                </div>
                {carRental.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    <a href={`mailto:${carRental.email}`} className="hover:underline">{carRental.email}</a>
                  </div>
                )}
                {carRental.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    <a href={carRental.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {language === 'ar' ? 'الموقع الإلكتروني' : language === 'fr' ? 'Site web' : 'Website'}
                    </a>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-1" />
                  <span>{getLocalizedText(carRental.address)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث عن سيارة...' : language === 'fr' ? 'Rechercher...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                />
              </div>
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : language === 'fr' ? 'Tous types' : 'All Types'}</option>
              <option value="economy">{language === 'ar' ? 'اقتصادية' : language === 'fr' ? 'Économique' : 'Economy'}</option>
              <option value="mid-size">{language === 'ar' ? 'متوسطة' : language === 'fr' ? 'Moyenne' : 'Mid-size'}</option>
              <option value="luxury">{language === 'ar' ? 'فاخرة' : language === 'fr' ? 'Luxe' : 'Luxury'}</option>
              <option value="suv">{language === 'ar' ? 'دفع رباعي' : language === 'fr' ? 'SUV' : 'SUV'}</option>
              <option value="van">{language === 'ar' ? 'فان' : language === 'fr' ? 'Van' : 'Van'}</option>
              <option value="sports">{language === 'ar' ? 'رياضية' : language === 'fr' ? 'Sportive' : 'Sports'}</option>
              <option value="electric">{language === 'ar' ? 'كهربائية' : language === 'fr' ? 'Électrique' : 'Electric'}</option>
            </select>

            {/* Transmission Filter */}
            <select
              value={filterTransmission}
              onChange={(e) => setFilterTransmission(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
            >
              <option value="all">{language === 'ar' ? 'كل ناقل الحركة' : language === 'fr' ? 'Toutes transmissions' : 'All Transmissions'}</option>
              <option value="automatic">{language === 'ar' ? 'أوتوماتيك' : language === 'fr' ? 'Automatique' : 'Automatic'}</option>
              <option value="manual">{language === 'ar' ? 'يدوي' : language === 'fr' ? 'Manuelle' : 'Manual'}</option>
            </select>

            {/* Price Filter */}
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
            >
              <option value="price">{language === 'ar' ? 'الأقل سعراً' : language === 'fr' ? 'Prix croissant' : 'Lowest Price'}</option>
              <option value="year">{language === 'ar' ? 'الأحدث' : language === 'fr' ? 'Plus récent' : 'Newest'}</option>
              <option value="name">{language === 'ar' ? 'الاسم' : language === 'fr' ? 'Nom' : 'Name'}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {language === 'ar' ? 'السيارات المتاحة' : language === 'fr' ? 'Véhicules disponibles' : 'Available Vehicles'}
            <span className="text-tarhal-orange ml-2">({filteredVehicles.length})</span>
          </h2>

          {filteredVehicles.length === 0 ? (
            <div className="text-center py-16">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">
                {language === 'ar' ? 'لا توجد سيارات متاحة' : language === 'fr' ? 'Aucun véhicule disponible' : 'No vehicles available'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Image */}
                  {vehicle.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={vehicle.imageUrl}
                        alt={getLocalizedText(vehicle.name)}
                        className="w-full h-full object-cover"
                      />
                      {vehicle.isFeatured && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {language === 'ar' ? 'مميزة' : language === 'fr' ? 'Recommandé' : 'Featured'}
                        </div>
                      )}
                      {!vehicle.available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {language === 'ar' ? 'غير متاح' : language === 'fr' ? 'Indisponible' : 'Unavailable'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {getLocalizedText(vehicle.name)}
                        </h3>
                        <p className="text-sm text-gray-600">{vehicle.year}</p>
                      </div>
                      <span className="bg-tarhal-blue-light text-tarhal-blue px-2 py-1 rounded text-xs font-medium">
                        {getTypeLabel(vehicle.type)}
                      </span>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{vehicle.seats} {language === 'ar' ? 'مقاعد' : language === 'fr' ? 'sièges' : 'seats'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cog className="h-4 w-4" />
                        <span>{getTransmissionLabel(vehicle.transmission)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-4 w-4" />
                        <span>{getFuelTypeLabel(vehicle.fuelType)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>{vehicle.doors} {language === 'ar' ? 'أبواب' : language === 'fr' ? 'portes' : 'doors'}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {vehicle.features[language]?.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price & Book */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold text-tarhal-orange">
                            {formatPrice(vehicle.pricePerDay, vehicle.currency as any)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {language === 'ar' ? 'لليوم' : language === 'fr' ? 'par jour' : 'per day'}
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
                        disabled={!vehicle.available}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (id && vehicle.id) {
                            navigate(`/car-rentals/${id}/booking/${vehicle.id}`);
                          }
                        }}
                      >
                        {language === 'ar' ? 'احجز الآن' : language === 'fr' ? 'Réserver maintenant' : 'Book Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Vehicle Details Modal */}
      {showVehicleModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {getLocalizedText(selectedVehicle.name)}
              </h2>
              <button
                onClick={() => {
                  setShowVehicleModal(false);
                  setSelectedVehicle(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Main Image */}
              {selectedVehicle.imageUrl && (
                <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={selectedVehicle.imageUrl}
                    alt={getLocalizedText(selectedVehicle.name)}
                    className="w-full h-full object-cover"
                  />
                  {selectedVehicle.isFeatured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {language === 'ar' ? 'مميزة' : language === 'fr' ? 'Recommandé' : 'Featured'}
                    </div>
                  )}
                  {!selectedVehicle.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {language === 'ar' ? 'غير متاح' : language === 'fr' ? 'Indisponible' : 'Unavailable'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Vehicle Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'ar' ? 'معلومات السيارة' : language === 'fr' ? 'Informations' : 'Vehicle Information'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-gray-600">{language === 'ar' ? 'الماركة' : language === 'fr' ? 'Marque' : 'Brand'}</span>
                        <span className="font-semibold">{getLocalizedText(selectedVehicle.brand)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-gray-600">{language === 'ar' ? 'الموديل' : language === 'fr' ? 'Modèle' : 'Model'}</span>
                        <span className="font-semibold">{selectedVehicle.model}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-gray-600">{language === 'ar' ? 'السنة' : language === 'fr' ? 'Année' : 'Year'}</span>
                        <span className="font-semibold">{selectedVehicle.year}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-gray-600">{language === 'ar' ? 'النوع' : language === 'fr' ? 'Type' : 'Type'}</span>
                        <span className="font-semibold">{getTypeLabel(selectedVehicle.type)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-tarhal-blue-light rounded-2xl p-6 text-center">
                    <div className="text-gray-600 text-sm mb-2">
                      {language === 'ar' ? 'السعر لليوم' : language === 'fr' ? 'Prix par jour' : 'Price per day'}
                    </div>
                    <div className="text-4xl font-bold text-tarhal-orange mb-1">
                      {formatPrice(selectedVehicle.pricePerDay, selectedVehicle.currency as any)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {language === 'ar' ? 'شامل التأمين' : language === 'fr' ? 'Assurance incluse' : 'Insurance included'}
                    </div>
                  </div>
                </div>

                {/* Right Column - Specifications */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'ar' ? 'المواصفات' : language === 'fr' ? 'Spécifications' : 'Specifications'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-tarhal-orange" />
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'المقاعد' : language === 'fr' ? 'Sièges' : 'Seats'}
                          </span>
                        </div>
                        <div className="text-xl font-bold">{selectedVehicle.seats}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="h-5 w-5 text-tarhal-orange" />
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'الأبواب' : language === 'fr' ? 'Portes' : 'Doors'}
                          </span>
                        </div>
                        <div className="text-xl font-bold">{selectedVehicle.doors}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Cog className="h-5 w-5 text-tarhal-orange" />
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'ناقل الحركة' : language === 'fr' ? 'Transmission' : 'Transmission'}
                          </span>
                        </div>
                        <div className="text-sm font-bold">{getTransmissionLabel(selectedVehicle.transmission)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Fuel className="h-5 w-5 text-tarhal-orange" />
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'نوع الوقود' : language === 'fr' ? 'Carburant' : 'Fuel Type'}
                          </span>
                        </div>
                        <div className="text-sm font-bold">{getFuelTypeLabel(selectedVehicle.fuelType)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {language === 'ar' ? 'الوصف' : language === 'fr' ? 'Description' : 'Description'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {getLocalizedText(selectedVehicle.description)}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {language === 'ar' ? 'المميزات' : language === 'fr' ? 'Caractéristiques' : 'Features'}
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {selectedVehicle.features[language]?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                      <Check className="h-5 w-5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              {selectedVehicle.specifications && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {language === 'ar' ? 'المواصفات التقنية' : language === 'fr' ? 'Spécifications techniques' : 'Technical Specifications'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedVehicle.specifications[language]?.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                        <Gauge className="h-5 w-5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowVehicleModal(false);
                    setSelectedVehicle(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  {language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}
                </Button>
                <Button
                  className="flex-1 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
                  disabled={!selectedVehicle.available}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (selectedVehicle && selectedVehicle.id && id) {
                      navigate(`/car-rentals/${id}/booking/${selectedVehicle.id}`);
                    }
                  }}
                >
                  {language === 'ar' ? 'احجز الآن' : language === 'fr' ? 'Réserver maintenant' : 'Book Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

