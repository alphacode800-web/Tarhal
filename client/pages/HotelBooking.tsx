import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, Users, CreditCard, ShieldCheck, CheckCircle, AlertCircle, Hotel as HotelIcon, Star, MapPin, Phone, Mail, Globe, User, Clock } from 'lucide-react';
import PaymentCheckoutPanel from '@/components/PaymentCheckoutPanel';
import { dataManager, type Hotel, type AdminCountryData } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency, type Currency } from '@/contexts/CurrencyContext';
import { getCountryName } from '@/data/countries';

const MAX_STAY_NIGHTS = 30;
const MAX_ROOMS = 5;

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  specialRequests: string;
}

export default function HotelBooking() {
  const { countryId, hotelId } = useParams<{ countryId: string; hotelId: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [country, setCountry] = useState<AdminCountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    rooms: 1,
    specialRequests: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const countries = await dataManager.getCountriesAsync();
        const hotels = await dataManager.getHotelsAsync();
        
        if (countryId) {
          const foundCountry = countries.find(c => c.id === countryId);
          setCountry(foundCountry || null);
        }
        
        if (hotelId) {
          const foundHotel = hotels.find(h => h.id === hotelId);
          setHotel(foundHotel || null);
        }
      } catch (error) {
        console.error('Error loading hotel data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [countryId, hotelId]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof BookingFormData, string>> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = language === 'ar' ? 'الاسم الكامل مطلوب' : language === 'fr' ? 'Le nom complet est requis' : 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : language === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : language === 'fr' ? 'Email invalide' : 'Invalid email';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = language === 'ar' ? 'رقم الهاتف مطلوب' : language === 'fr' ? 'Le numéro de téléphone est requis' : 'Phone number is required';
    }
    
    if (!formData.checkIn) {
      errors.checkIn = language === 'ar' ? 'تاريخ الوصول مطلوب' : language === 'fr' ? 'La date d\'arrivée est requise' : 'Check-in date is required';
    }
    
    if (!formData.checkOut) {
      errors.checkOut = language === 'ar' ? 'تاريخ المغادرة مطلوب' : language === 'fr' ? 'La date de départ est requise' : 'Check-out date is required';
    } else if (formData.checkIn && formData.checkOut <= formData.checkIn) {
      errors.checkOut = language === 'ar' ? 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول' : language === 'fr' ? 'La date de départ doit être après la date d\'arrivée' : 'Check-out date must be after check-in date';
    } else if (formData.checkIn && formData.checkOut) {
      const nights = calculateNights();
      if (nights > MAX_STAY_NIGHTS) {
        errors.checkOut = language === 'ar'
          ? `الحد الأقصى للإقامة ${MAX_STAY_NIGHTS} ليلة`
          : language === 'fr'
            ? `Séjour maximum de ${MAX_STAY_NIGHTS} nuits`
            : `Maximum stay is ${MAX_STAY_NIGHTS} nights`;
      }
    }
    
    if (formData.rooms < 1) {
      errors.rooms = language === 'ar' ? 'يجب أن يكون عدد الغرف على الأقل 1' : language === 'fr' ? 'Le nombre de chambres doit être au moins 1' : 'Rooms must be at least 1';
    } else if (formData.rooms > MAX_ROOMS) {
      errors.rooms = language === 'ar'
        ? `الحد الأقصى ${MAX_ROOMS} غرف`
        : language === 'fr'
          ? `Maximum ${MAX_ROOMS} chambres`
          : `Maximum ${MAX_ROOMS} rooms`;
    }

    if (formData.adults < 1) {
      errors.adults = language === 'ar' ? 'يجب أن يكون عدد البالغين على الأقل 1' : language === 'fr' ? 'Le nombre d\'adultes doit être au moins 1' : 'Adults must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateNights = (): number => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(`${formData.checkIn}T12:00:00`);
    const checkOut = new Date(`${formData.checkOut}T12:00:00`);
    if (checkOut <= checkIn) return 0;
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getMaxCheckOutDate = (): string | undefined => {
    if (!formData.checkIn) return undefined;
    const max = new Date(`${formData.checkIn}T12:00:00`);
    max.setDate(max.getDate() + MAX_STAY_NIGHTS);
    return max.toISOString().split('T')[0];
  };

  const calculateTotal = (): number => {
    if (!hotel) return 0;
    const nights = calculateNights();
    return hotel.pricePerNight * nights * formData.rooms;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (calculateTotal() <= 0) {
        return;
      }
      setCurrentStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
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

  if (!hotel) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <HotelIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">
              {language === 'ar' ? 'الفندق غير موجود' : language === 'fr' ? 'Hôtel introuvable' : 'Hotel not found'}
            </p>
            <Link to={`/offices/${countryId}/hotels`}>
              <Button className="mt-4">
                {language === 'ar' ? 'العودة إلى الفنادق' : language === 'fr' ? 'Retour aux hôtels' : 'Back to Hotels'}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const nights = calculateNights();
  const total = calculateTotal();
  const hotelCurrency = (hotel?.currency || 'USD') as Currency;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-tarhal-navy to-tarhal-blue-dark text-white py-8">
          <div className="container mx-auto px-4">
            <Link
              to={`/offices/${countryId}/hotels`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{language === 'ar' ? 'العودة إلى الفنادق' : language === 'fr' ? 'Retour aux hôtels' : 'Back to Hotels'}</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === 'ar' ? 'حجز فندق' : language === 'fr' ? 'Réservation d\'hôtel' : 'Hotel Booking'}
            </h1>
            <p className="text-white/80">
              {language === 'ar' ? 'أكمل معلومات الحجز' : language === 'fr' ? 'Complétez les informations de réservation' : 'Complete your booking information'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 'details' ? (
                <form onSubmit={handleBookingSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-tarhal-orange" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === 'ar' ? 'معلومات الحجز' : language === 'fr' ? 'Informations de réservation' : 'Booking Information'}
                    </h2>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {language === 'ar' ? 'المعلومات الشخصية' : language === 'fr' ? 'Informations personnelles' : 'Personal Information'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom complet' : 'Full Name'} *
                        </label>
                        <Input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : language === 'fr' ? 'Entrez votre nom complet' : 'Enter your full name'}
                          className={`w-full ${formErrors.fullName ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email'} *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                          className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'} *
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder={language === 'ar' ? '+966 5XX XXX XXX' : language === 'fr' ? '+33 X XX XX XX XX' : '+1 XXX XXX XXXX'}
                          className={`w-full ${formErrors.phone ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {language === 'ar' ? 'تفاصيل الحجز' : language === 'fr' ? 'Détails de la réservation' : 'Booking Details'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'تاريخ الوصول' : language === 'fr' ? 'Date d\'arrivée' : 'Check-in Date'} *
                        </label>
                        <Input
                          type="date"
                          value={formData.checkIn}
                          onChange={(e) => handleInputChange('checkIn', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full ${formErrors.checkIn ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.checkIn && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.checkIn}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'تاريخ المغادرة' : language === 'fr' ? 'Date de départ' : 'Check-out Date'} *
                        </label>
                        <Input
                          type="date"
                          value={formData.checkOut}
                          onChange={(e) => handleInputChange('checkOut', e.target.value)}
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          max={getMaxCheckOutDate()}
                          className={`w-full ${formErrors.checkOut ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.checkOut && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.checkOut}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'عدد البالغين' : language === 'fr' ? 'Nombre d\'adultes' : 'Adults'} *
                        </label>
                        <Input
                          type="number"
                          value={formData.adults}
                          onChange={(e) => handleInputChange('adults', parseInt(e.target.value) || 1)}
                          min={1}
                          max={20}
                          className={`w-full ${formErrors.adults ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.adults && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.adults}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'عدد الأطفال' : language === 'fr' ? 'Nombre d\'enfants' : 'Children'}
                        </label>
                        <Input
                          type="number"
                          value={formData.children}
                          onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
                          min={0}
                          max={10}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'عدد الغرف' : language === 'fr' ? 'Nombre de chambres' : 'Rooms'} *
                        </label>
                        <Input
                          type="number"
                          value={formData.rooms}
                          onChange={(e) => handleInputChange('rooms', parseInt(e.target.value) || 1)}
                          min={1}
                          max={MAX_ROOMS}
                          className={`w-full ${formErrors.rooms ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.rooms && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.rooms}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {language === 'ar' ? 'طلبات خاصة' : language === 'fr' ? 'Demandes spéciales' : 'Special Requests'}
                      </label>
                      <Textarea
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        placeholder={language === 'ar' ? 'أي طلبات خاصة أو ملاحظات...' : language === 'fr' ? 'Toute demande spéciale ou note...' : 'Any special requests or notes...'}
                        rows={4}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white font-semibold py-6 text-lg hover:shadow-xl transition-all duration-300"
                  >
                    {language === 'ar' ? 'المتابعة إلى الدفع' : language === 'fr' ? 'Continuer vers le paiement' : 'Continue to Payment'}
                    <CreditCard className="mr-2 h-5 w-5" />
                  </Button>
                </form>
              ) : submitted ? (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {language === 'ar' ? 'تم الحجز بنجاح!' : language === 'fr' ? 'Réservation réussie!' : 'Booking Successful!'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {language === 'ar' ? 'سيتم إرسال تأكيد الحجز إلى بريدك الإلكتروني' : language === 'fr' ? 'Une confirmation de réservation sera envoyée à votre email' : 'A booking confirmation will be sent to your email'}
                    </p>
                    <Link to={`/offices/${countryId}/hotels`}>
                      <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
                        {language === 'ar' ? 'العودة إلى الفنادق' : language === 'fr' ? 'Retour aux hôtels' : 'Back to Hotels'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <PaymentCheckoutPanel
                  amount={total}
                  currency={hotelCurrency}
                  description={`${getLocalizedText(hotel.name)} - ${nights} ${language === 'ar' ? 'ليلة' : 'nights'}`}
                  customerEmail={formData.email}
                  customerName={formData.fullName}
                  onBack={() => setCurrentStep('details')}
                  onLocalPaymentSuccess={() => {
                    setSubmitted(true);
                    setTimeout(() => navigate(`/offices/${countryId}/hotels`), 4000);
                  }}
                  metadata={{
                    source: 'hotel_booking',
                    hotelId: hotel.id,
                    countryId: hotel.countryId,
                    booking: formData,
                    nights,
                    rooms: formData.rooms,
                  }}
                  bookingSummary={
                    <div className="bg-gray-50 dark:bg-slate-900/60 rounded-xl p-4 mb-6 border border-gray-200 dark:border-slate-700">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                        {language === 'ar' ? 'ملخص الحجز' : language === 'fr' ? 'Résumé de la réservation' : 'Booking Summary'}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'ar' ? 'الفندق:' : 'Hotel:'}</span>
                          <span className="font-medium text-gray-900">{getLocalizedText(hotel.name)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                          <span className="font-medium text-gray-900">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'ar' ? 'البريد:' : 'Email:'}</span>
                          <span className="font-medium text-gray-900">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'ar' ? 'الوصول:' : 'Check-in:'}</span>
                          <span className="font-medium text-gray-900">{formData.checkIn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'ar' ? 'المغادرة:' : 'Check-out:'}</span>
                          <span className="font-medium text-gray-900">{formData.checkOut}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'ar' ? 'الليالي:' : 'Nights:'}</span>
                          <span className="font-medium text-gray-900">{nights}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'ar' ? 'الغرف:' : 'Rooms:'}</span>
                          <span className="font-medium text-gray-900">{formData.rooms}</span>
                        </div>
                      </div>
                    </div>
                  }
                />
              )}
            </div>

            {/* Sidebar - Hotel Info & Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-28 border border-gray-100 dark:border-slate-700">
                {/* Hotel Info */}
                <div className="mb-6">
                  {hotel.imageUrl && (
                    <img
                      src={hotel.imageUrl}
                      alt={getLocalizedText(hotel.name)}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {getLocalizedText(hotel.name)}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(hotel.stars)}
                    <span className="text-sm text-gray-600">
                      {hotel.rating} ({hotel.reviews} {language === 'ar' ? 'مراجعة' : language === 'fr' ? 'avis' : 'reviews'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{getLocalizedText(hotel.city)}</span>
                  </div>
                  {hotel.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="h-4 w-4" />
                      <span>{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{hotel.email}</span>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    {language === 'ar' ? 'ملخص السعر' : language === 'fr' ? 'Résumé des prix' : 'Price Summary'}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {formatPrice(hotel.pricePerNight, hotel.currency as any)} × {nights} {language === 'ar' ? 'ليلة' : language === 'fr' ? 'nuits' : 'nights'} × {formData.rooms} {language === 'ar' ? 'غرفة' : language === 'fr' ? 'chambre' : 'room'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(hotel.pricePerNight * nights * formData.rooms, hotel.currency as any)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-700 font-semibold">
                        {language === 'ar' ? 'الإجمالي' : language === 'fr' ? 'Total' : 'Total'}
                      </span>
                      <span className="text-2xl font-extrabold text-tarhal-orange">
                        {formatPrice(total, hotel.currency as any)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

