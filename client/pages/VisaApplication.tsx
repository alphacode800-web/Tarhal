import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Upload, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { dataManager, type AdminCountryData } from '@/services/dataManager';

export default function VisaApplication() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<AdminCountryData[]>([]);
  
  const visaType = searchParams.get('type') || 'tourist';
  const destination = searchParams.get('destination') || '';
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    gender: 'male',
    
    // Passport Information
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuePlace: '',
    
    // Travel Information
    destinationCountry: destination,
    visaType: visaType,
    travelDate: '',
    returnDate: '',
    purposeOfVisit: '',
    
    // Contact & Address
    currentAddress: '',
    city: '',
    postalCode: '',
    country: '',
    
    // Employment/Education
    occupation: '',
    employer: '',
    monthlyIncome: '',
    
    // Additional Information
    previousVisit: 'no',
    criminalRecord: 'no',
    healthIssues: 'no',
    additionalInfo: ''
  });

  const [documents, setDocuments] = useState({
    passport: null as File | null,
    photo: null as File | null,
    bankStatement: null as File | null,
    employmentLetter: null as File | null,
    hotelBooking: null as File | null
  });

  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await dataManager.getCountriesAsync();
      setCountries(countriesData);
    };
    loadCountries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof typeof documents) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({
        ...documents,
        [docType]: e.target.files[0]
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert(language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : language === 'fr' ? 'Veuillez remplir tous les champs requis' : 'Please fill all required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.passportNumber || !formData.passportExpiryDate) {
        alert(language === 'ar' ? 'الرجاء ملء معلومات جواز السفر' : language === 'fr' ? 'Veuillez remplir les informations du passeport' : 'Please fill passport information');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.destinationCountry || !formData.travelDate) {
        alert(language === 'ar' ? 'الرجاء ملء معلومات السفر' : language === 'fr' ? 'Veuillez remplir les informations de voyage' : 'Please fill travel information');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  const handleSubmit = () => {
    console.log('Visa application submitted:', { formData, documents });
    alert(language === 'ar' ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.' : language === 'fr' ? 'Votre demande a été envoyée avec succès! Nous vous contacterons bientôt.' : 'Your application has been submitted successfully! We will contact you soon.');
    navigate('/travel-visa');
  };

  const getVisaTypeLabel = (type: string) => {
    const types: Record<string, { ar: string; en: string; fr: string }> = {
      tourist: { ar: 'سياحية', en: 'Tourist', fr: 'Touristique' },
      business: { ar: 'عمل', en: 'Business', fr: 'Affaires' },
      study: { ar: 'دراسية', en: 'Study', fr: 'Études' },
      work: { ar: 'إقامة', en: 'Residence', fr: 'Résidence' }
    };
    const typeLabel = types[type] || types.tourist;
    return language === 'ar' ? typeLabel.ar : language === 'fr' ? typeLabel.fr : typeLabel.en;
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue text-white py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/travel-visa')}
            className="mb-4 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'العودة' : language === 'fr' ? 'Retour' : 'Back'}
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">
            {language === 'ar' ? 'تقديم طلب تأشيرة' : language === 'fr' ? 'Demande de visa' : 'Visa Application'}
          </h1>
          <p className="text-white/80">
            {language === 'ar' ? 'أكمل طلبك في 5 خطوات سهلة' : language === 'fr' ? 'Complétez votre demande en 5 étapes faciles' : 'Complete your application in 5 easy steps'}
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                  step >= num ? 'bg-tarhal-orange text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step > num ? <Check className="h-5 w-5" /> : num}
                </div>
                {num < 5 && <div className={`w-12 h-1 mx-1 ${step > num ? 'bg-tarhal-orange' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'المعلومات الشخصية' : language === 'fr' ? 'Informations personnelles' : 'Personal Information'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الاسم الأول' : language === 'fr' ? 'Prénom' : 'First Name'} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
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
                    value={formData.lastName}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'تاريخ الميلاد' : language === 'fr' ? 'Date de naissance' : 'Date of Birth'} *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'مكان الميلاد' : language === 'fr' ? 'Lieu de naissance' : 'Place of Birth'}
                  </label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الجنسية' : language === 'fr' ? 'Nationalité' : 'Nationality'} *
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الجنس' : language === 'fr' ? 'Genre' : 'Gender'} *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                  >
                    <option value="male">{language === 'ar' ? 'ذكر' : language === 'fr' ? 'Homme' : 'Male'}</option>
                    <option value="female">{language === 'ar' ? 'أنثى' : language === 'fr' ? 'Femme' : 'Female'}</option>
                  </select>
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

          {/* Step 2: Passport Information */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'معلومات جواز السفر' : language === 'fr' ? 'Informations du passeport' : 'Passport Information'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'رقم جواز السفر' : language === 'fr' ? 'Numéro de passeport' : 'Passport Number'} *
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'تاريخ الإصدار' : language === 'fr' ? 'Date d\'émission' : 'Issue Date'} *
                  </label>
                  <input
                    type="date"
                    name="passportIssueDate"
                    value={formData.passportIssueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'تاريخ الانتهاء' : language === 'fr' ? 'Date d\'expiration' : 'Expiry Date'} *
                  </label>
                  <input
                    type="date"
                    name="passportExpiryDate"
                    value={formData.passportExpiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'مكان الإصدار' : language === 'fr' ? 'Lieu d\'émission' : 'Place of Issue'}
                  </label>
                  <input
                    type="text"
                    name="passportIssuePlace"
                    value={formData.passportIssuePlace}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                  />
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

          {/* Step 3: Travel Information */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'معلومات السفر' : language === 'fr' ? 'Informations de voyage' : 'Travel Information'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الوجهة' : language === 'fr' ? 'Destination' : 'Destination'} *
                  </label>
                  <select
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange appearance-none"
                    required
                  >
                    <option value="">{language === 'ar' ? 'اختر الدولة' : language === 'fr' ? 'Choisir le pays' : 'Select Country'}</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name[language] || country.name.en}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'نوع التأشيرة' : language === 'fr' ? 'Type de visa' : 'Visa Type'} *
                  </label>
                  <select
                    name="visaType"
                    value={formData.visaType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                  >
                    <option value="tourist">{language === 'ar' ? 'سياحية' : language === 'fr' ? 'Touristique' : 'Tourist'}</option>
                    <option value="business">{language === 'ar' ? 'عمل' : language === 'fr' ? 'Affaires' : 'Business'}</option>
                    <option value="study">{language === 'ar' ? 'دراسية' : language === 'fr' ? 'Études' : 'Study'}</option>
                    <option value="work">{language === 'ar' ? 'إقامة' : language === 'fr' ? 'Résidence' : 'Residence'}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'تاريخ السفر' : language === 'fr' ? 'Date de voyage' : 'Travel Date'} *
                  </label>
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'تاريخ العودة' : language === 'fr' ? 'Date de retour' : 'Return Date'}
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الغرض من الزيارة' : language === 'fr' ? 'Objet de la visite' : 'Purpose of Visit'}
                  </label>
                  <textarea
                    name="purposeOfVisit"
                    value={formData.purposeOfVisit}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <Button 
                  onClick={() => setStep(2)}
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

          {/* Step 4: Documents Upload */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'رفع المستندات' : language === 'fr' ? 'Télécharger les documents' : 'Upload Documents'}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <p className="text-sm text-blue-800">
                      {language === 'ar' 
                        ? 'الرجاء رفع نسخ واضحة من المستندات المطلوبة. الحد الأقصى لحجم الملف: 5 ميجابايت'
                        : language === 'fr'
                        ? 'Veuillez télécharger des copies claires des documents requis. Taille maximale du fichier: 5 Mo'
                        : 'Please upload clear copies of the required documents. Maximum file size: 5MB'}
                    </p>
                  </div>
                </div>
                
                {[
                  { key: 'passport', label: { ar: 'نسخة من جواز السفر', en: 'Passport Copy', fr: 'Copie du passeport' }, required: true },
                  { key: 'photo', label: { ar: 'صورة شخصية', en: 'Personal Photo', fr: 'Photo personnelle' }, required: true },
                  { key: 'bankStatement', label: { ar: 'كشف حساب بنكي', en: 'Bank Statement', fr: 'Relevé bancaire' }, required: false },
                  { key: 'employmentLetter', label: { ar: 'خطاب عمل', en: 'Employment Letter', fr: 'Lettre d\'emploi' }, required: false },
                  { key: 'hotelBooking', label: { ar: 'حجز فندق', en: 'Hotel Booking', fr: 'Réservation d\'hôtel' }, required: false }
                ].map((doc) => (
                  <div key={doc.key} className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-tarhal-orange transition-colors">
                    <label className="block">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                          {language === 'ar' ? doc.label.ar : language === 'fr' ? doc.label.fr : doc.label.en}
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                        {documents[doc.key as keyof typeof documents] && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, doc.key as keyof typeof documents)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tarhal-orange file:text-white hover:file:bg-tarhal-orange-dark cursor-pointer"
                      />
                      {documents[doc.key as keyof typeof documents] && (
                        <p className="mt-2 text-sm text-gray-600">
                          {documents[doc.key as keyof typeof documents]!.name}
                        </p>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-8">
                <Button 
                  onClick={() => setStep(3)}
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

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'مراجعة الطلب' : language === 'fr' ? 'Révision de la demande' : 'Review Application'}
                </h2>
                <p className="text-gray-600">
                  {language === 'ar' ? 'راجع معلوماتك قبل الإرسال' : language === 'fr' ? 'Vérifiez vos informations avant de soumettre' : 'Review your information before submitting'}
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">{language === 'ar' ? 'المعلومات الشخصية' : language === 'fr' ? 'Informations personnelles' : 'Personal Information'}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-600">{language === 'ar' ? 'الاسم' : language === 'fr' ? 'Nom' : 'Name'}:</span> <span className="font-medium">{formData.firstName} {formData.lastName}</span></div>
                    <div><span className="text-gray-600">{language === 'ar' ? 'البريد' : language === 'fr' ? 'E-mail' : 'Email'}:</span> <span className="font-medium">{formData.email}</span></div>
                    <div><span className="text-gray-600">{language === 'ar' ? 'الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'}:</span> <span className="font-medium">{formData.phone}</span></div>
                    <div><span className="text-gray-600">{language === 'ar' ? 'الجنسية' : language === 'fr' ? 'Nationalité' : 'Nationality'}:</span> <span className="font-medium">{formData.nationality}</span></div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">{language === 'ar' ? 'معلومات السفر' : language === 'fr' ? 'Informations de voyage' : 'Travel Information'}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-600">{language === 'ar' ? 'نوع التأشيرة' : language === 'fr' ? 'Type de visa' : 'Visa Type'}:</span> <span className="font-medium">{getVisaTypeLabel(formData.visaType)}</span></div>
                    <div><span className="text-gray-600">{language === 'ar' ? 'تاريخ السفر' : language === 'fr' ? 'Date de voyage' : 'Travel Date'}:</span> <span className="font-medium">{formData.travelDate}</span></div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <Button 
                  onClick={() => setStep(4)}
                  variant="outline"
                  className="flex-1 py-4"
                >
                  {language === 'ar' ? 'السابق' : language === 'fr' ? 'Précédent' : 'Previous'}
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4"
                >
                  {language === 'ar' ? 'إرسال الطلب' : language === 'fr' ? 'Soumettre la demande' : 'Submit Application'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

