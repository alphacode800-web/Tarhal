import Layout from '@/components/Layout';
import PaymentButton from '@/components/PaymentButton';
import { useEffect, useState } from 'react';
import { Lock, ShieldCheck, CreditCard, Sparkles, Globe, User, Mail, Phone, Calendar, Users, MapPin, FileText, CheckCircle, AlertCircle, Plane } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  returnDate: string;
  participants: number;
  specialRequests: string;
}

export default function CheckoutDemo() {
  const { formatPrice, currency: selectedCurrency } = useCurrency();
  const { language, t } = useLanguage();
  const [amount, setAmount] = useState(49.99);
  const [amountInput, setAmountInput] = useState('49.99');
  const [currency, setCurrency] = useState('USD');
  const [methods, setMethods] = useState<string[]>(['card']);
  const [desc, setDesc] = useState<string>('حجز رحلة سياحية');
  const [currentStep, setCurrentStep] = useState<'booking' | 'payment'>('booking');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [message, setMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    returnDate: '',
    participants: 1,
    specialRequests: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetAmount = params.get('amount');
    const presetCurrency = params.get('currency');
    const presetDesc = params.get('desc');
    if (presetAmount) {
      const n = Number(presetAmount);
      if (!isNaN(n) && n > 0) {
        setAmount(n);
        setAmountInput(String(n));
      }
    }
    if (presetCurrency) setCurrency(presetCurrency);
    if (presetDesc) setDesc(decodeURIComponent(presetDesc));

    const status = params.get('status');
    const sessionId = params.get('session_id');
    if (status === 'success' && sessionId) {
      fetch(`/api/payments/confirm?session_id=${encodeURIComponent(sessionId)}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            setMessage(d.payment_status === 'paid' 
              ? (language === 'ar' ? 'تم الدفع بنجاح ✅' : language === 'fr' ? 'Paiement réussi ✅' : 'Payment successful ✅')
              : (language === 'ar' ? 'تمت العودة من بوابة الدفع' : language === 'fr' ? 'Retour de la passerelle de paiement' : 'Returned from payment gateway'));
          } else {
            setMessage(language === 'ar' ? 'تعذر تأكيد عملية الدفع' : language === 'fr' ? 'Impossible de confirmer le paiement' : 'Failed to confirm payment');
          }
        })
        .catch(() => setMessage(language === 'ar' ? 'تعذر تأكيد عملية الدفع' : language === 'fr' ? 'Impossible de confirmer le paiement' : 'Failed to confirm payment'));
    } else if (status === 'cancel') {
      setMessage(language === 'ar' ? 'تم إلغاء عملية الدفع' : language === 'fr' ? 'Paiement annulé' : 'Payment cancelled');
    }
  }, [language]);

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
    
    if (!formData.travelDate) {
      errors.travelDate = language === 'ar' ? 'تاريخ السفر مطلوب' : language === 'fr' ? 'La date de voyage est requise' : 'Travel date is required';
    }
    
    if (formData.participants < 1) {
      errors.participants = language === 'ar' ? 'عدد المشاركين يجب أن يكون على الأقل 1' : language === 'fr' ? 'Le nombre de participants doit être au moins 1' : 'Participants must be at least 1';
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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const translations = {
    ar: {
      title: 'صفحة الحجز',
      subtitle: 'أكمل معلومات الحجز وأكمل عملية الدفع',
      securePayment: 'عملية دفع آمنة ومشفّرة',
      bookingInfo: 'معلومات الحجز',
      personalInfo: 'المعلومات الشخصية',
      travelDetails: 'تفاصيل الرحلة',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      travelDate: 'تاريخ السفر',
      returnDate: 'تاريخ العودة (اختياري)',
      participants: 'عدد المشاركين',
      specialRequests: 'طلبات خاصة أو ملاحظات',
      continueToPayment: 'المتابعة إلى الدفع',
      orderSummary: 'ملخص الطلب',
      description: 'الوصف',
      amount: 'القيمة',
      processingFee: 'رسوم المعالجة',
      total: 'الإجمالي المستحق',
      paymentDetails: 'تفاصيل الدفع',
      paymentMethods: 'طرق الدفع',
      completePayment: 'أكمل الدفع الآن',
      backToBooking: 'العودة إلى الحجز',
      pciCompliant: 'متوافق مع PCI DSS',
      poweredBy: 'مدعوم بواسطة Stripe',
      recommended: 'موصى بها',
      priceIncludes: 'الأسعار تشمل الضرائب عند الاقتضاء. يتم معالجة الدفع عبر Stripe.',
      paymentNote: 'قد تتطلب بعض الطرق عملات أو إعدادات خاصة في حساب Stripe.'
    },
    en: {
      title: 'Booking Page',
      subtitle: 'Complete your booking information and proceed to payment',
      securePayment: 'Secure and encrypted payment',
      bookingInfo: 'Booking Information',
      personalInfo: 'Personal Information',
      travelDetails: 'Travel Details',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      travelDate: 'Travel Date',
      returnDate: 'Return Date (Optional)',
      participants: 'Number of Participants',
      specialRequests: 'Special Requests or Notes',
      continueToPayment: 'Continue to Payment',
      orderSummary: 'Order Summary',
      description: 'Description',
      amount: 'Amount',
      processingFee: 'Processing Fee',
      total: 'Total Due',
      paymentDetails: 'Payment Details',
      paymentMethods: 'Payment Methods',
      completePayment: 'Complete Payment Now',
      backToBooking: 'Back to Booking',
      pciCompliant: 'PCI DSS Compliant',
      poweredBy: 'Powered by Stripe',
      recommended: 'Recommended',
      priceIncludes: 'Prices include taxes where applicable. Payment is processed via Stripe.',
      paymentNote: 'Some methods may require specific currencies or settings in your Stripe account.'
    },
    fr: {
      title: 'Page de Réservation',
      subtitle: 'Complétez vos informations de réservation et procédez au paiement',
      securePayment: 'Paiement sécurisé et crypté',
      bookingInfo: 'Informations de Réservation',
      personalInfo: 'Informations Personnelles',
      travelDetails: 'Détails du Voyage',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      travelDate: 'Date de Voyage',
      returnDate: 'Date de Retour (Optionnel)',
      participants: 'Nombre de Participants',
      specialRequests: 'Demandes Spéciales ou Notes',
      continueToPayment: 'Continuer vers le Paiement',
      orderSummary: 'Résumé de la Commande',
      description: 'Description',
      amount: 'Montant',
      processingFee: 'Frais de Traitement',
      total: 'Total Dû',
      paymentDetails: 'Détails du Paiement',
      paymentMethods: 'Méthodes de Paiement',
      completePayment: 'Compléter le Paiement Maintenant',
      backToBooking: 'Retour à la Réservation',
      pciCompliant: 'Conforme PCI DSS',
      poweredBy: 'Alimenté par Stripe',
      recommended: 'Recommandé',
      priceIncludes: 'Les prix incluent les taxes le cas échéant. Le paiement est traité via Stripe.',
      paymentNote: 'Certaines méthodes peuvent nécessiter des devises ou des paramètres spécifiques dans votre compte Stripe.'
    }
  };

  const tr = translations[language];

  return (
    <Layout>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue/80" />
        <div className="max-w-7xl mx-auto py-8 md:py-12 px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm mb-4">
              <Lock className="w-4 h-4" /> {tr.securePayment}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-3">
              {tr.title}
            </h1>
            <p className="text-white/90 mt-2 text-lg">{tr.subtitle}</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              message.includes('✅') || message.includes('successful') || message.includes('réussi')
                ? 'bg-green-50/90 border-green-200 text-green-800'
                : 'bg-yellow-50/90 border-yellow-200 text-yellow-800'
            } text-sm backdrop-blur-sm`}>
              <div className="flex items-center gap-2">
                {message.includes('✅') || message.includes('successful') || message.includes('réussi') ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message}</span>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Booking Form - Left Column (2/3 on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 'booking' ? (
                <form onSubmit={handleBookingSubmit} className="bg-white/95 backdrop-blur rounded-2xl p-6 md:p-8 shadow-2xl border border-white/40">
                  <div className="flex items-center gap-3 mb-6">
                    <Plane className="w-6 h-6 text-tarhal-orange" />
                    <h2 className="text-2xl font-bold text-gray-900">{tr.bookingInfo}</h2>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-tarhal-blue-dark" />
                      <h3 className="text-lg font-semibold text-gray-800">{tr.personalInfo}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {tr.fullName} *
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
                          {tr.email} *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder={language === 'ar' ? 'your@email.com' : 'your@email.com'}
                          className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {tr.phone} *
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

                  {/* Travel Details */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-tarhal-orange" />
                      <h3 className="text-lg font-semibold text-gray-800">{tr.travelDetails}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {tr.travelDate} *
                        </label>
                        <Input
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) => handleInputChange('travelDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full ${formErrors.travelDate ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.travelDate && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.travelDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {tr.returnDate}
                        </label>
                        <Input
                          type="date"
                          value={formData.returnDate}
                          onChange={(e) => handleInputChange('returnDate', e.target.value)}
                          min={formData.travelDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {tr.participants} *
                        </label>
                        <Input
                          type="number"
                          value={formData.participants}
                          onChange={(e) => handleInputChange('participants', parseInt(e.target.value) || 1)}
                          min={1}
                          max={50}
                          className={`w-full ${formErrors.participants ? 'border-red-500' : ''}`}
                          required
                        />
                        {formErrors.participants && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.participants}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {tr.specialRequests}
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
                    {tr.continueToPayment}
                    <CreditCard className="mr-2 h-5 w-5" />
                  </Button>
                </form>
              ) : (
                <div className="bg-white/95 backdrop-blur rounded-2xl p-6 md:p-8 shadow-2xl border border-white/40">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-tarhal-blue-dark" />
                      <h2 className="text-2xl font-bold text-gray-900">{tr.paymentDetails}</h2>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('booking')}
                      className="text-sm"
                    >
                      {tr.backToBooking}
                    </Button>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">{tr.bookingInfo}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{tr.fullName}:</span>
                        <span className="font-medium text-gray-900">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{tr.email}:</span>
                        <span className="font-medium text-gray-900">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{tr.phone}:</span>
                        <span className="font-medium text-gray-900">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{tr.travelDate}:</span>
                        <span className="font-medium text-gray-900">{formData.travelDate}</span>
                      </div>
                      {formData.returnDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{tr.returnDate}:</span>
                          <span className="font-medium text-gray-900">{formData.returnDate}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">{tr.participants}:</span>
                        <span className="font-medium text-gray-900">{formData.participants}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {language === 'ar' ? 'المبلغ' : language === 'fr' ? 'Montant' : 'Amount'}
                      </label>
                      <Input
                        type="number"
                        value={amountInput}
                        onChange={(e) => {
                          const v = e.target.value;
                          setAmountInput(v);
                          const n = parseFloat(v);
                          setAmount(Number.isFinite(n) ? n : 0);
                        }}
                        className="w-full"
                        min={1}
                        step={0.5}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {language === 'ar' ? 'العملة' : language === 'fr' ? 'Devise' : 'Currency'}
                      </label>
                      <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)} 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="SAR">SAR</option>
                        <option value="AED">AED</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-3 font-medium text-gray-700">{tr.paymentMethods}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'card', label: language === 'ar' ? 'بطاقة بنكية' : language === 'fr' ? 'Carte bancaire' : 'Card', icons: ['https://cdn.simpleicons.org/visa','https://cdn.simpleicons.org/mastercard'] },
                          { id: 'whish', label: 'Whish Money', icons: ['/payments/whish-money.png'], local: true },
                          { id: 'ciar_card', label: language === 'ar' ? 'بطاقة CIAR' : 'CIAR Card', icons: ['/payments/ciar-mastercard.png'], local: true },
                          { id: 'sepa_debit', label: 'SEPA Debit', icons: [] },
                          { id: 'sofort', label: 'SOFORT', icons: ['https://cdn.simpleicons.org/sofort'] },
                          { id: 'giropay', label: 'giropay', icons: ['https://cdn.simpleicons.org/giropay'] },
                          { id: 'ideal', label: 'iDEAL', icons: ['https://cdn.simpleicons.org/ideal'] },
                          { id: 'bancontact', label: 'Bancontact', icons: ['https://cdn.simpleicons.org/bancontact'] },
                          { id: 'eps', label: 'EPS', icons: ['https://cdn.simpleicons.org/eps'] },
                          { id: 'p24', label: 'Przelewy24', icons: ['https://cdn.simpleicons.org/przelewy24'] },
                          { id: 'grabpay', label: 'GrabPay', icons: ['https://cdn.simpleicons.org/grab'] },
                          { id: 'alipay', label: 'Alipay', icons: ['https://cdn.simpleicons.org/alipay'] },
                        ].map((m) => {
                          const selected = methods.includes(m.id);
                          return (
                            <label
                              key={m.id}
                              className={`flex items-center justify-between gap-3 border rounded-xl px-3 py-3 cursor-pointer transition-all ${
                                selected ? 'border-tarhal-orange bg-tarhal-orange/10 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  className="accent-tarhal-orange"
                                  checked={selected}
                                  onChange={(e) => setMethods((prev) => e.target.checked ? Array.from(new Set([...prev, m.id])) : prev.filter(x => x !== m.id))}
                                />
                                <div className="flex items-center gap-2">
                                  {m.id === 'card' ? (
                                    <div className="flex items-center gap-1">
                                      <img src={m.icons[0]} alt="Visa" className="w-6 h-6" />
                                      <img src={m.icons[1]} alt="Mastercard" className="w-6 h-6" />
                                    </div>
                                  ) : m.icons.length ? (
                                    <img src={m.icons[0]} alt={m.label} className={`${'local' in m && m.local ? 'h-8 w-auto max-w-[72px] object-contain' : 'w-7 h-7'}`} />
                                  ) : (
                                    <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500">
                                      {m.label.split(' ')[0]}
                                    </div>
                                  )}
                                  <span className="text-sm font-medium">{m.label}</span>
                                </div>
                              </div>
                              {m.id === 'card' && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-tarhal-orange/20 text-tarhal-orange font-medium">
                                  {tr.recommended}
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{tr.paymentNote}</p>
                    </div>

                    <PaymentButton
                      amount={amount}
                      currency={currency}
                      description={`${desc} - ${formData.fullName} (${currency} ${amount.toFixed(2)})`}
                      metadata={{ 
                        source: 'booking', 
                        methods,
                        bookingData: formData
                      }}
                      customerEmail={formData.email}
                      paymentMethodTypes={methods}
                      className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white font-semibold py-6 text-lg hover:shadow-xl transition-all duration-300"
                    >
                      {tr.completePayment}
                    </PaymentButton>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-600" /> {tr.pciCompliant}
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://cdn.simpleicons.org/stripe" alt="Stripe" className="w-12 h-4" />
                        <span>{tr.poweredBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary - Right Column (1/3 on large screens) */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl border border-white/40 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-tarhal-orange" />
                    <h2 className="text-lg font-semibold text-gray-900">{tr.orderSummary}</h2>
                  </div>
                  <Globe className="w-5 h-5 text-tarhal-blue-dark" />
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-gray-600">{tr.description}</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%]">{desc}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{tr.amount}</span>
                    <span className="font-semibold text-gray-900">{formatPrice(amount, currency as any)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{tr.processingFee}</span>
                    <span className="text-gray-800">{formatPrice(0)}</span>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">{tr.total}</span>
                    <span className="text-2xl font-extrabold text-tarhal-blue-dark">{formatPrice(amount, currency as any)}</span>
                  </div>
                </div>
                <div className="mt-6 text-xs text-gray-500 leading-relaxed">
                  {tr.priceIncludes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
