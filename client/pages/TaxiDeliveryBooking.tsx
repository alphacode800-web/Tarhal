import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Car, Package, MapPin, Phone, Clock, DollarSign, Calendar, User, Mail, CreditCard, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { dataManager } from '@/services/dataManager';

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  notes: string;
}

export default function TaxiDeliveryBooking() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    notes: ''
  });

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const services = await dataManager.getTaxiDeliveryServicesAsync();
      const foundService = services.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
      }
    } catch (error) {
      console.error('Error loading service:', error);
    }
    setLoading(false);
  };

  const getLocalizedText = (obj: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate step 1
      if (!formData.fullName || !formData.email || !formData.phone) {
        alert(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : language === 'fr' ? 'Veuillez remplir tous les champs requis' : 'Please fill all required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate step 2
      if (!formData.pickupLocation || !formData.dropoffLocation || !formData.pickupDate || !formData.pickupTime) {
        alert(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : language === 'fr' ? 'Veuillez remplir tous les champs requis' : 'Please fill all required fields');
        return;
      }
      setStep(3);
    } else {
      // Submit booking
      console.log('Booking submitted:', { service, formData });
      alert(language === 'ar' ? 'تم تأكيد الحجز بنجاح!' : language === 'fr' ? 'Réservation confirmée avec succès!' : 'Booking confirmed successfully!');
      navigate('/taxi-delivery');
    }
  };

  if (loading || !service) {
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${
                      step >= s ? 'bg-tarhal-orange text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > s ? <Check className="h-6 w-6" /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-tarhal-orange' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className={step >= 1 ? 'text-tarhal-orange font-semibold' : 'text-gray-500'}>
                  {language === 'ar' ? 'معلوماتك' : language === 'fr' ? 'Vos Infos' : 'Your Info'}
                </span>
                <span className={step >= 2 ? 'text-tarhal-orange font-semibold' : 'text-gray-500'}>
                  {language === 'ar' ? 'تفاصيل الرحلة' : language === 'fr' ? 'Détails du Trajet' : 'Trip Details'}
                </span>
                <span className={step >= 3 ? 'text-tarhal-orange font-semibold' : 'text-gray-500'}>
                  {language === 'ar' ? 'التأكيد' : language === 'fr' ? 'Confirmation' : 'Confirmation'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Booking Form */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-3xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {step === 1 && (language === 'ar' ? 'معلوماتك الشخصية' : language === 'fr' ? 'Vos Informations Personnelles' : 'Your Personal Information')}
                    {step === 2 && (language === 'ar' ? 'تفاصيل الرحلة' : language === 'fr' ? 'Détails du Trajet' : 'Trip Details')}
                    {step === 3 && (language === 'ar' ? 'مراجعة وتأكيد' : language === 'fr' ? 'Révision et Confirmation' : 'Review & Confirm')}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                      <>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            {language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom Complet' : 'Full Name'} *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'E-mail' : 'Email'} *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            {language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'} *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 2: Trip Details */}
                    {step === 2 && (
                      <>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            {language === 'ar' ? 'موقع الانطلاق' : language === 'fr' ? 'Lieu de Départ' : 'Pickup Location'} *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="text"
                              name="pickupLocation"
                              value={formData.pickupLocation}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder={language === 'ar' ? 'أدخل عنوان الانطلاق' : language === 'fr' ? 'Entrez l\'adresse de départ' : 'Enter pickup address'}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            {language === 'ar' ? 'موقع الوصول' : language === 'fr' ? 'Lieu d\'Arrivée' : 'Dropoff Location'} *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="text"
                              name="dropoffLocation"
                              value={formData.dropoffLocation}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder={language === 'ar' ? 'أدخل عنوان الوصول' : language === 'fr' ? 'Entrez l\'adresse d\'arrivée' : 'Enter dropoff address'}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              {language === 'ar' ? 'التاريخ' : language === 'fr' ? 'Date' : 'Date'} *
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                type="date"
                                name="pickupDate"
                                value={formData.pickupDate}
                                onChange={handleChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              {language === 'ar' ? 'الوقت' : language === 'fr' ? 'Heure' : 'Time'} *
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                type="time"
                                name="pickupTime"
                                value={formData.pickupTime}
                                onChange={handleChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {service.type === 'taxi' && (
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              {language === 'ar' ? 'عدد الركاب' : language === 'fr' ? 'Nombre de Passagers' : 'Number of Passengers'}
                            </label>
                            <Input
                              type="number"
                              name="passengers"
                              value={formData.passengers}
                              onChange={handleChange}
                              min="1"
                              max="8"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            {language === 'ar' ? 'ملاحظات إضافية' : language === 'fr' ? 'Notes Supplémentaires' : 'Additional Notes'}
                          </label>
                          <Textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder={language === 'ar' ? 'أي تفاصيل إضافية...' : language === 'fr' ? 'Tout détail supplémentaire...' : 'Any additional details...'}
                          />
                        </div>
                      </>
                    )}

                    {/* Step 3: Review & Confirm */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="font-bold text-gray-900 mb-4">
                            {language === 'ar' ? 'ملخص الحجز' : language === 'fr' ? 'Résumé de la Réservation' : 'Booking Summary'}
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{language === 'ar' ? 'الاسم' : language === 'fr' ? 'Nom' : 'Name'}:</span>
                              <span className="font-medium">{formData.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'E-mail' : 'Email'}:</span>
                              <span className="font-medium">{formData.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{language === 'ar' ? 'الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'}:</span>
                              <span className="font-medium">{formData.phone}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600">{language === 'ar' ? 'من' : language === 'fr' ? 'De' : 'From'}:</span>
                                <span className="font-medium">{formData.pickupLocation}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">{language === 'ar' ? 'إلى' : language === 'fr' ? 'À' : 'To'}:</span>
                                <span className="font-medium">{formData.dropoffLocation}</span>
                              </div>
                            </div>
                            <div className="border-t pt-3 mt-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">{language === 'ar' ? 'التاريخ والوقت' : language === 'fr' ? 'Date et Heure' : 'Date & Time'}:</span>
                                <span className="font-medium">{formData.pickupDate} - {formData.pickupTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <p className="text-sm text-blue-800">
                            {language === 'ar' 
                              ? 'سيتم التواصل معك عبر الهاتف أو البريد الإلكتروني لتأكيد الحجز والتفاصيل النهائية.'
                              : language === 'fr'
                              ? 'Vous serez contacté par téléphone ou par e-mail pour confirmer la réservation et les détails finaux.'
                              : 'You will be contacted via phone or email to confirm the booking and final details.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-6">
                      {step > 1 && (
                        <Button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          variant="outline"
                          className="flex-1"
                        >
                          {language === 'ar' ? 'السابق' : language === 'fr' ? 'Précédent' : 'Previous'}
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="flex-1 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
                      >
                        {step === 3 
                          ? (language === 'ar' ? 'تأكيد الحجز' : language === 'fr' ? 'Confirmer la Réservation' : 'Confirm Booking')
                          : (language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next')}
                        {step < 3 && <ChevronRight className="h-5 w-5 ml-2" />}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Service Info Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-4">
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                    <img
                      src={service.imageUrl}
                      alt={getLocalizedText(service.name)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {getLocalizedText(service.name)}
                  </h3>

                  <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold mb-4 ${
                    service.type === 'taxi' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {service.type === 'taxi' 
                      ? (language === 'ar' ? 'تاكسي' : language === 'fr' ? 'Taxi' : 'Taxi')
                      : (language === 'ar' ? 'ديليفري' : language === 'fr' ? 'Livraison' : 'Delivery')}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4 text-tarhal-orange" />
                      <span>{formatPrice(service.pricePerKm, 'USD')}/{language === 'ar' ? 'كم' : 'km'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 text-tarhal-orange" />
                      <span>{getLocalizedText(service.serviceHours)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-tarhal-orange" />
                      <span>{service.phone}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-bold text-gray-900 mb-3">
                      {language === 'ar' ? 'المميزات' : language === 'fr' ? 'Fonctionnalités' : 'Features'}
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {getLocalizedText(service.features).slice(0, 4).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
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

