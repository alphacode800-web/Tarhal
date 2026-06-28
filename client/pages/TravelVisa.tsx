import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Globe, Clock, CheckCircle2, Shield, Users, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TravelVisa() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    destination: '',
    visaType: 'tourist',
    travelDate: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to application page
    navigate('/visa-application');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: Clock,
      title: { ar: 'معالجة سريعة', en: 'Fast Processing', fr: 'Traitement rapide' },
      description: { ar: 'نعالج طلبك في أسرع وقت ممكن', en: 'We process your application as quickly as possible', fr: 'Nous traitons votre demande le plus rapidement possible' }
    },
    {
      icon: Shield,
      title: { ar: 'آمن وموثوق', en: 'Safe & Reliable', fr: 'Sûr et fiable' },
      description: { ar: 'معلوماتك محمية بالكامل', en: 'Your information is fully protected', fr: 'Vos informations sont entièrement protégées' }
    },
    {
      icon: Users,
      title: { ar: 'دعم متخصص', en: 'Expert Support', fr: 'Support expert' },
      description: { ar: 'فريق متخصص لمساعدتك في كل خطوة', en: 'Specialized team to help you every step', fr: 'Équipe spécialisée pour vous aider à chaque étape' }
    },
    {
      icon: CheckCircle2,
      title: { ar: 'معدل نجاح عالي', en: 'High Success Rate', fr: 'Taux de réussite élevé' },
      description: { ar: 'نسبة نجاح تزيد عن 95%', en: 'Success rate over 95%', fr: 'Taux de réussite supérieur à 95%' }
    }
  ];

  const visaTypes = [
    {
      type: 'tourist',
      title: { ar: 'تأشيرة سياحية', en: 'Tourist Visa', fr: 'Visa touristique' },
      duration: { ar: '30-90 يوم', en: '30-90 days', fr: '30-90 jours' },
      description: { ar: 'للسياحة والزيارات القصيرة', en: 'For tourism and short visits', fr: 'Pour le tourisme et les courtes visites' }
    },
    {
      type: 'business',
      title: { ar: 'تأشيرة عمل', en: 'Business Visa', fr: 'Visa d\'affaires' },
      duration: { ar: '90-180 يوم', en: '90-180 days', fr: '90-180 jours' },
      description: { ar: 'لأغراض العمل والاجتماعات', en: 'For business purposes and meetings', fr: 'Pour les affaires et les réunions' }
    },
    {
      type: 'study',
      title: { ar: 'تأشيرة دراسية', en: 'Study Visa', fr: 'Visa d\'études' },
      duration: { ar: '1-4 سنوات', en: '1-4 years', fr: '1-4 ans' },
      description: { ar: 'للدراسة والتعليم', en: 'For studying and education', fr: 'Pour les études et l\'éducation' }
    },
    {
      type: 'work',
      title: { ar: 'تأشيرة إقامة', en: 'Residence Visa', fr: 'Visa de résidence' },
      duration: { ar: '1-5 سنوات', en: '1-5 years', fr: '1-5 ans' },
      description: { ar: 'للإقامة والعمل الطويل', en: 'For long-term residence and work', fr: 'Pour la résidence et le travail à long terme' }
    }
  ];

  const popularCountries = [
    { name: { ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates', fr: 'Émirats arabes unis' }, flag: '🇦🇪', processing: '3-5 days' },
    { name: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia', fr: 'Arabie saoudite' }, flag: '🇸🇦', processing: '5-7 days' },
    { name: { ar: 'مصر', en: 'Egypt', fr: 'Égypte' }, flag: '🇪🇬', processing: '3-5 days' },
    { name: { ar: 'تركيا', en: 'Turkey', fr: 'Turquie' }, flag: '🇹🇷', processing: '2-4 days' },
    { name: { ar: 'الولايات المتحدة', en: 'United States', fr: 'États-Unis' }, flag: '🇺🇸', processing: '10-15 days' },
    { name: { ar: 'المملكة المتحدة', en: 'United Kingdom', fr: 'Royaume-Uni' }, flag: '🇬🇧', processing: '7-10 days' },
    { name: { ar: 'كندا', en: 'Canada', fr: 'Canada' }, flag: '🇨🇦', processing: '10-15 days' },
    { name: { ar: 'أستراليا', en: 'Australia', fr: 'Australie' }, flag: '🇦🇺', processing: '7-12 days' }
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
            style={{ backgroundImage: 'url(https://images.pexels.com/photos/3359734/pexels-photo-3359734.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tarhal-navy/95 via-tarhal-blue-dark/90 to-tarhal-blue/85" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <FileText className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">
              {language === 'ar' ? 'تأشيرة السفر' : language === 'fr' ? 'Visa de voyage' : 'Travel Visa'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            {language === 'ar' ? 'احصل على تأشيرتك بسهولة' : language === 'fr' ? 'Obtenez votre visa facilement' : 'Get Your Visa Easily'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'نساعدك في الحصول على تأشيرة السفر لأكثر من 100 دولة حول العالم'
              : language === 'fr'
              ? 'Nous vous aidons à obtenir un visa de voyage pour plus de 100 pays à travers le monde'
              : 'We help you obtain a travel visa for over 100 countries worldwide'}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'ar' ? 'لماذا تختارنا؟' : language === 'fr' ? 'Pourquoi nous choisir?' : 'Why Choose Us?'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-tarhal-orange/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-tarhal-orange" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{getLocalizedText(feature.title)}</h3>
                <p className="text-gray-600 text-sm">{getLocalizedText(feature.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'ar' ? 'أنواع التأشيرات' : language === 'fr' ? 'Types de visas' : 'Visa Types'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaTypes.map((visa, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-tarhal-orange">
                <div className="text-center mb-4">
                  <Globe className="h-12 w-12 text-tarhal-orange mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{getLocalizedText(visa.title)}</h3>
                  <div className="inline-block bg-tarhal-orange/10 text-tarhal-orange px-3 py-1 rounded-full text-sm font-medium">
                    {getLocalizedText(visa.duration)}
                  </div>
                </div>
                <p className="text-gray-600 text-center text-sm mb-4">{getLocalizedText(visa.description)}</p>
                <Button 
                  className="w-full bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
                  onClick={() => navigate(`/visa-application?type=${visa.type}`)}
                >
                  {language === 'ar' ? 'تقدم الآن' : language === 'fr' ? 'Postuler maintenant' : 'Apply Now'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'ar' ? 'الوجهات الشائعة' : language === 'fr' ? 'Destinations populaires' : 'Popular Destinations'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCountries.map((country, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="text-5xl mb-3">{country.flag}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{getLocalizedText(country.name)}</h3>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{country.processing}</span>
                  </div>
                  <Button 
                    className="w-full bg-tarhal-blue hover:bg-tarhal-blue-dark text-white"
                    onClick={() => navigate(`/visa-application?destination=${country.name.en.toLowerCase()}`)}
                  >
                    {language === 'ar' ? 'تقدم بطلب' : language === 'fr' ? 'Demander' : 'Apply'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'تقدم بطلبك الآن' : language === 'fr' ? 'Soumettez votre demande maintenant' : 'Submit Your Application Now'}
              </h2>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'املأ النموذج وسيتواصل معك فريقنا في أقرب وقت'
                  : language === 'fr'
                  ? 'Remplissez le formulaire et notre équipe vous contactera dans les plus brefs délais'
                  : 'Fill out the form and our team will contact you as soon as possible'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom complet' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'E-mail' : 'Email'}
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
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone Number'}
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
                    {language === 'ar' ? 'الجنسية' : language === 'fr' ? 'Nationalité' : 'Nationality'}
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
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الوجهة' : language === 'fr' ? 'Destination' : 'Destination'}
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'نوع التأشيرة' : language === 'fr' ? 'Type de visa' : 'Visa Type'}
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
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'ar' ? 'تاريخ السفر المتوقع' : language === 'fr' ? 'Date de voyage prévue' : 'Expected Travel Date'}
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

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'ar' ? 'ملاحظات إضافية' : language === 'fr' ? 'Notes supplémentaires' : 'Additional Notes'}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange resize-none"
                />
              </div>

              <Button type="submit" className="w-full bg-tarhal-orange hover:bg-tarhal-orange-dark text-white py-4 text-lg font-semibold">
                {language === 'ar' ? 'إرسال الطلب' : language === 'fr' ? 'Envoyer la demande' : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

