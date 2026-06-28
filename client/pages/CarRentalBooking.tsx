import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle, Car, MapPin, Phone, Mail, User } from 'lucide-react';
import { dataManager, type CarRental, type CarVehicle, type AdminCountryData } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  driverLicense: string;
  specialRequests: string;
}

export default function CarRentalBooking() {
  const { rentalId, vehicleId } = useParams<{ rentalId: string; vehicleId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [carRental, setCarRental] = useState<CarRental | null>(null);
  const [vehicle, setVehicle] = useState<CarVehicle | null>(null);
  const [country, setCountry] = useState<AdminCountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    returnLocation: '',
    driverLicense: '',
    specialRequests: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const countries = await dataManager.getCountriesAsync();
        const carRentals = await dataManager.getCarRentalsAsync();
        const vehicles = await dataManager.getCarVehiclesAsync();
        
        if (rentalId) {
          const foundRental = carRentals.find(r => r.id === rentalId);
          setCarRental(foundRental || null);
          
          if (foundRental) {
            const foundCountry = countries.find(c => c.id === foundRental.countryId);
            setCountry(foundCountry || null);
          }
        }
        
        if (vehicleId) {
          const foundVehicle = vehicles.find(v => v.id === vehicleId);
          setVehicle(foundVehicle || null);
        }
      } catch (error) {
        console.error('Error loading car rental data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [rentalId, vehicleId]);

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
    
    if (!formData.pickupDate) {
      errors.pickupDate = language === 'ar' ? 'تاريخ الاستلام مطلوب' : language === 'fr' ? 'La date de prise en charge est requise' : 'Pickup date is required';
    }
    
    if (!formData.returnDate) {
      errors.returnDate = language === 'ar' ? 'تاريخ الإرجاع مطلوب' : language === 'fr' ? 'La date de retour est requise' : 'Return date is required';
    } else if (formData.pickupDate && formData.returnDate <= formData.pickupDate) {
      errors.returnDate = language === 'ar' ? 'تاريخ الإرجاع يجب أن يكون بعد تاريخ الاستلام' : language === 'fr' ? 'La date de retour doit être après la date de prise en charge' : 'Return date must be after pickup date';
    }
    
    if (!formData.driverLicense.trim()) {
      errors.driverLicense = language === 'ar' ? 'رقم رخصة القيادة مطلوب' : language === 'fr' ? 'Le numéro de permis de conduire est requis' : 'Driver license number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateDays = (): number => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  };

  const calculateTotal = (): number => {
    if (!vehicle) return 0;
    const days = calculateDays();
    return vehicle.pricePerDay * days;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePayment = async () => {
    // Here you would integrate with payment gateway
    // For now, just simulate success
    setSubmitted(true);
    setTimeout(() => {
      navigate(`/car-rentals/${rentalId}`);
    }, 3000);
  };

  const getLocalizedText = (obj?: { ar: string; en: string; fr: string }) => {
    if (!obj) return '';
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
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

  if (!vehicle || !carRental) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">
              {language === 'ar' ? 'السيارة غير موجودة' : language === 'fr' ? 'Véhicule introuvable' : 'Vehicle not found'}
            </p>
            <Link to={`/car-rentals/${rentalId}`}>
              <Button className="mt-4">
                {language === 'ar' ? 'العودة إلى السيارات' : language === 'fr' ? 'Retour aux voitures' : 'Back to Cars'}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const days = calculateDays();
  const total = calculateTotal();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-tarhal-navy to-tarhal-blue-dark text-white py-8">
          <div className="container mx-auto px-4">
            <Link
              to={`/car-rentals/${rentalId}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{language === 'ar' ? 'العودة إلى السيارات' : language === 'fr' ? 'Retour aux voitures' : 'Back to Cars'}</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === 'ar' ? 'حجز سيارة' : language === 'fr' ? 'Réservation de voiture' : 'Car Rental Booking'}
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
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'رقم رخصة القيادة' : language === 'fr' ? 'Numéro de permis' : 'Driver License'} *
                        </label>
                        <Input
                          type="text"
                          value={formData.driverLicense}
                          onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                          placeholder={language === 'ar' ? 'رقم رخصة القيادة' : language === 'fr' ? 'Numéro de permis' : 'Driver license number'}
                          className={`w-full ${formErrors.driverLicense ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.driverLicense && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.driverLicense}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rental Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {language === 'ar' ? 'تفاصيل الاستئجار' : language === 'fr' ? 'Détails de location' : 'Rental Details'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'تاريخ الاستلام' : language === 'fr' ? 'Date de prise en charge' : 'Pickup Date'} *
                        </label>
                        <Input
                          type="date"
                          value={formData.pickupDate}
                          onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full ${formErrors.pickupDate ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.pickupDate && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.pickupDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'تاريخ الإرجاع' : language === 'fr' ? 'Date de retour' : 'Return Date'} *
                        </label>
                        <Input
                          type="date"
                          value={formData.returnDate}
                          onChange={(e) => handleInputChange('returnDate', e.target.value)}
                          min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                          className={`w-full ${formErrors.returnDate ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.returnDate && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.returnDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'مكان الاستلام' : language === 'fr' ? 'Lieu de prise en charge' : 'Pickup Location'}
                        </label>
                        <Input
                          type="text"
                          value={formData.pickupLocation}
                          onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                          placeholder={language === 'ar' ? 'مكان الاستلام' : language === 'fr' ? 'Lieu de prise en charge' : 'Pickup location'}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'مكان الإرجاع' : language === 'fr' ? 'Lieu de retour' : 'Return Location'}
                        </label>
                        <Input
                          type="text"
                          value={formData.returnLocation}
                          onChange={(e) => handleInputChange('returnLocation', e.target.value)}
                          placeholder={language === 'ar' ? 'مكان الإرجاع' : language === 'fr' ? 'Lieu de retour' : 'Return location'}
                          className="w-full"
                        />
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
                    className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white font-semibold py-6 text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {language === 'ar' ? 'المتابعة إلى الدفع' : language === 'fr' ? 'Continuer vers le paiement' : 'Continue to Payment'}
                    <CreditCard className="h-5 w-5" />
                  </Button>
                </form>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {language === 'ar' ? 'تم الحجز بنجاح!' : language === 'fr' ? 'Réservation réussie!' : 'Booking Successful!'}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {language === 'ar' ? 'سيتم إرسال تأكيد الحجز إلى بريدك الإلكتروني' : language === 'fr' ? 'Une confirmation de réservation sera envoyée à votre email' : 'A booking confirmation will be sent to your email'}
                      </p>
                      <Link to={`/car-rentals/${rentalId}`}>
                        <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
                          {language === 'ar' ? 'العودة إلى السيارات' : language === 'fr' ? 'Retour aux voitures' : 'Back to Cars'}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-tarhal-blue-dark" />
                          <h2 className="text-2xl font-bold text-gray-900">
                            {language === 'ar' ? 'تفاصيل الدفع' : language === 'fr' ? 'Détails du paiement' : 'Payment Details'}
                          </h2>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep('details')}
                          className="text-sm"
                        >
                          {language === 'ar' ? 'العودة' : language === 'fr' ? 'Retour' : 'Back'}
                        </Button>
                      </div>

                      {/* Booking Summary */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">
                          {language === 'ar' ? 'ملخص الحجز' : language === 'fr' ? 'Résumé de la réservation' : 'Booking Summary'}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{language === 'ar' ? 'الاسم:' : language === 'fr' ? 'Nom:' : 'Name:'}</span>
                            <span className="font-medium text-gray-900">{formData.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{language === 'ar' ? 'البريد:' : language === 'fr' ? 'Email:' : 'Email:'}</span>
                            <span className="font-medium text-gray-900">{formData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{language === 'ar' ? 'الاستلام:' : language === 'fr' ? 'Prise en charge:' : 'Pickup:'}</span>
                            <span className="font-medium text-gray-900">{formData.pickupDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{language === 'ar' ? 'الإرجاع:' : language === 'fr' ? 'Retour:' : 'Return:'}</span>
                            <span className="font-medium text-gray-900">{formData.returnDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{language === 'ar' ? 'الأيام:' : language === 'fr' ? 'Jours:' : 'Days:'}</span>
                            <span className="font-medium text-gray-900">{days}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white font-semibold py-6 text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {language === 'ar' ? 'تأكيد الحجز والدفع' : language === 'fr' ? 'Confirmer la réservation et payer' : 'Confirm Booking & Pay'}
                        <CreditCard className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>{language === 'ar' ? 'دفع آمن ومشفّر' : language === 'fr' ? 'Paiement sécurisé et crypté' : 'Secure and encrypted payment'}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Vehicle Info & Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                {/* Vehicle Info */}
                <div className="mb-6">
                  {vehicle.imageUrl && (
                    <img
                      src={vehicle.imageUrl}
                      alt={getLocalizedText(vehicle.name)}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {getLocalizedText(vehicle.name)}
                  </h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {getLocalizedText(vehicle.brand)} {vehicle.model} ({vehicle.year})
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                    <span>{vehicle.seats} {language === 'ar' ? 'مقاعد' : language === 'fr' ? 'sièges' : 'seats'}</span>
                    <span>•</span>
                    <span>{vehicle.doors} {language === 'ar' ? 'أبواب' : language === 'fr' ? 'portes' : 'doors'}</span>
                    <span>•</span>
                    <span>{vehicle.transmission === 'automatic' ? (language === 'ar' ? 'أوتوماتيك' : language === 'fr' ? 'Automatique' : 'Automatic') : (language === 'ar' ? 'يدوي' : language === 'fr' ? 'Manuel' : 'Manual')}</span>
                  </div>
                  {carRental.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="h-4 w-4" />
                      <span>{carRental.phone}</span>
                    </div>
                  )}
                  {carRental.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{carRental.email}</span>
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
                        {formatPrice(vehicle.pricePerDay, vehicle.currency as any)} × {days} {language === 'ar' ? 'يوم' : language === 'fr' ? 'jours' : 'days'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(vehicle.pricePerDay * days, vehicle.currency as any)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-700 font-semibold">
                        {language === 'ar' ? 'الإجمالي' : language === 'fr' ? 'Total' : 'Total'}
                      </span>
                      <span className="text-2xl font-extrabold text-tarhal-orange">
                        {formatPrice(total, vehicle.currency as any)}
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
