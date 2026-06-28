import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Plane, Calendar, Users, CreditCard, User, Mail, Phone, MapPin, ArrowLeft, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { dataManager, type AdminCountryData } from '@/services/dataManager';

export default function FlightBooking() {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<AdminCountryData[]>([]);
  const [fromCountry, setFromCountry] = useState<AdminCountryData | null>(null);
  const [toCountry, setToCountry] = useState<AdminCountryData | null>(null);
  
  // Flight details from URL params
  const tripType = searchParams.get('tripType') || 'round-trip';
  const departDate = searchParams.get('departDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const classType = searchParams.get('classType') || 'economy';
  const basePrice = parseFloat(searchParams.get('price') || '0');
  
  // Passenger information
  const [passengerData, setPassengerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: ''
  });

  // Payment information
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const countriesData = await dataManager.getCountriesAsync();
      setCountries(countriesData);
      
      const fromId = searchParams.get('from');
      const toId = searchParams.get('to');
      
      if (fromId) {
        const from = countriesData.find(c => c.id === fromId);
        setFromCountry(from || null);
      }
      
      if (toId) {
        const to = countriesData.find(c => c.id === toId);
        setToCountry(to || null);
      }
    };
    
    loadData();
  }, [searchParams]);

  const calculateTotal = () => {
    let price = basePrice || 500; // Default price if not provided
    
    // Adjust based on class type
    if (classType === 'business') price *= 2.5;
    if (classType === 'first') price *= 4;
    
    // Multiply by number of passengers
    price *= passengers;
    
    // Round trip is slightly cheaper per leg
    if (tripType === 'round-trip') price *= 1.8;
    
    return Math.round(price);
  };

  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassengerData({
      ...passengerData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!passengerData.firstName || !passengerData.lastName || !passengerData.email || !passengerData.phone) {
        alert(language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : language === 'fr' ? 'Veuillez remplir tous les champs requis' : 'Please fill all required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        alert(language === 'ar' ? 'الرجاء ملء معلومات الدفع' : language === 'fr' ? 'Veuillez remplir les informations de paiement' : 'Please fill payment information');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = () => {
    console.log('Booking submitted:', { passengerData, paymentData });
    alert(language === 'ar' ? 'تم حجز تذكرتك بنجاح!' : language === 'fr' ? 'Votre billet a été réservé avec succès!' : 'Your ticket has been booked successfully!');
    navigate('/');
  };

  const getClassLabel = () => {
    if (classType === 'business') return language === 'ar' ? 'رجال أعمال' : language === 'fr' ? 'Affaires' : 'Business';
    if (classType === 'first') return language === 'ar' ? 'أولى' : language === 'fr' ? 'Première' : 'First Class';
    return language === 'ar' ? 'اقتصادية' : language === 'fr' ? 'Économique' : 'Economy';
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue text-white py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/flight-tickets')}
            className="mb-4 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'العودة' : language === 'fr' ? 'Retour' : 'Back'}
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">
            {language === 'ar' ? 'حجز تذكرة الطيران' : language === 'fr' ? 'Réservation de billet d\'avion' : 'Flight Ticket Booking'}
          </h1>
          <p className="text-white/80">
            {language === 'ar' ? 'أكمل حجزك في 3 خطوات سهلة' : language === 'fr' ? 'Complétez votre réservation en 3 étapes faciles' : 'Complete your booking in 3 easy steps'}
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= num ? 'bg-tarhal-orange text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step > num ? <Check className="h-6 w-6" /> : num}
                </div>
                {num < 3 && <div className={`w-20 h-1 mx-2 ${step > num ? 'bg-tarhal-orange' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-20 mt-4 text-sm">
            <span className={step >= 1 ? 'text-tarhal-orange font-semibold' : 'text-gray-600'}>
              {language === 'ar' ? 'معلومات المسافر' : language === 'fr' ? 'Informations passager' : 'Passenger Info'}
            </span>
            <span className={step >= 2 ? 'text-tarhal-orange font-semibold' : 'text-gray-600'}>
              {language === 'ar' ? 'الدفع' : language === 'fr' ? 'Paiement' : 'Payment'}
            </span>
            <span className={step >= 3 ? 'text-tarhal-orange font-semibold' : 'text-gray-600'}>
              {language === 'ar' ? 'تأكيد' : language === 'fr' ? 'Confirmation' : 'Confirmation'}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Passenger Information */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'معلومات المسافر' : language === 'fr' ? 'Informations du passager' : 'Passenger Information'}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'الاسم الأول' : language === 'fr' ? 'Prénom' : 'First Name'} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={passengerData.firstName}
                      onChange={handlePassengerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'اسم العائلة' : language === 'fr' ? 'Nom de famille' : 'Last Name'} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={passengerData.lastName}
                      onChange={handlePassengerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'E-mail' : 'Email'} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={passengerData.email}
                      onChange={handlePassengerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={passengerData.phone}
                      onChange={handlePassengerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'الجنسية' : language === 'fr' ? 'Nationalité' : 'Nationality'}
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={passengerData.nationality}
                      onChange={handlePassengerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'رقم جواز السفر' : language === 'fr' ? 'Numéro de passeport' : 'Passport Number'}
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={passengerData.passportNumber}
                      onChange={handlePassengerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'تاريخ الميلاد' : language === 'fr' ? 'Date de naissance' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={passengerData.dateOfBirth}
                      onChange={handlePassengerChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleNextStep}
                  className="w-full mt-8 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white py-4"
                >
                  {language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next'}
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'معلومات الدفع' : language === 'fr' ? 'Informations de paiement' : 'Payment Information'}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'رقم البطاقة' : language === 'fr' ? 'Numéro de carte' : 'Card Number'} *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'اسم حامل البطاقة' : language === 'fr' ? 'Nom du titulaire' : 'Cardholder Name'} *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        {language === 'ar' ? 'تاريخ الانتهاء' : language === 'fr' ? 'Date d\'expiration' : 'Expiry Date'} *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <Button 
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 py-4"
                  >
                    {language === 'ar' ? 'السابق' : language === 'fr' ? 'Précédent' : 'Previous'}
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    className="flex-1 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white py-4"
                  >
                    {language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'تأكيد الحجز' : language === 'fr' ? 'Confirmation de réservation' : 'Booking Confirmation'}
                  </h2>
                  <p className="text-gray-600">
                    {language === 'ar' ? 'راجع تفاصيل حجزك قبل التأكيد' : language === 'fr' ? 'Vérifiez les détails de votre réservation avant confirmation' : 'Review your booking details before confirming'}
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600">{language === 'ar' ? 'المسافر' : language === 'fr' ? 'Passager' : 'Passenger'}</span>
                    <span className="font-semibold">{passengerData.firstName} {passengerData.lastName}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600">{language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'E-mail' : 'Email'}</span>
                    <span className="font-semibold">{passengerData.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600">{language === 'ar' ? 'من' : language === 'fr' ? 'De' : 'From'}</span>
                    <span className="font-semibold">{fromCountry?.name[language] || fromCountry?.name.en}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600">{language === 'ar' ? 'إلى' : language === 'fr' ? 'À' : 'To'}</span>
                    <span className="font-semibold">{toCountry?.name[language] || toCountry?.name.en}</span>
                  </div>
                  {departDate && (
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600">{language === 'ar' ? 'تاريخ المغادرة' : language === 'fr' ? 'Date de départ' : 'Departure Date'}</span>
                      <span className="font-semibold">{departDate}</span>
                    </div>
                  )}
                  {returnDate && tripType === 'round-trip' && (
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600">{language === 'ar' ? 'تاريخ العودة' : language === 'fr' ? 'Date de retour' : 'Return Date'}</span>
                      <span className="font-semibold">{returnDate}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 py-4"
                  >
                    {language === 'ar' ? 'السابق' : language === 'fr' ? 'Précédent' : 'Previous'}
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4"
                  >
                    {language === 'ar' ? 'تأكيد الحجز' : language === 'fr' ? 'Confirmer la réservation' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'ملخص الحجز' : language === 'fr' ? 'Résumé de réservation' : 'Booking Summary'}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-tarhal-orange" />
                  <div>
                    <div className="font-semibold">{fromCountry?.name[language] || fromCountry?.name.en}</div>
                    <div className="text-gray-500 text-xs">{language === 'ar' ? 'من' : language === 'fr' ? 'De' : 'From'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-tarhal-orange" />
                  <div>
                    <div className="font-semibold">{toCountry?.name[language] || toCountry?.name.en}</div>
                    <div className="text-gray-500 text-xs">{language === 'ar' ? 'إلى' : language === 'fr' ? 'À' : 'To'}</div>
                  </div>
                </div>
                
                {departDate && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-5 w-5 text-tarhal-orange" />
                    <div>
                      <div className="font-semibold">{departDate}</div>
                      <div className="text-gray-500 text-xs">{language === 'ar' ? 'المغادرة' : language === 'fr' ? 'Départ' : 'Departure'}</div>
                    </div>
                  </div>
                )}
                
                {returnDate && tripType === 'round-trip' && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-5 w-5 text-tarhal-orange" />
                    <div>
                      <div className="font-semibold">{returnDate}</div>
                      <div className="text-gray-500 text-xs">{language === 'ar' ? 'العودة' : language === 'fr' ? 'Retour' : 'Return'}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-5 w-5 text-tarhal-orange" />
                  <div>
                    <div className="font-semibold">{passengers} {language === 'ar' ? 'مسافر' : language === 'fr' ? 'passager(s)' : 'passenger(s)'}</div>
                    <div className="text-gray-500 text-xs">{getClassLabel()}</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">{language === 'ar' ? 'المجموع' : language === 'fr' ? 'Total' : 'Total'}</span>
                  <span className="text-3xl font-bold text-tarhal-orange">{formatPrice(calculateTotal(), 'USD')}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {language === 'ar' ? 'شامل جميع الضرائب والرسوم' : language === 'fr' ? 'Toutes taxes et frais inclus' : 'All taxes and fees included'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

