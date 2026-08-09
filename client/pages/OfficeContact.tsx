import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Clock, Globe, User, Star, MessageCircle, Share2, Building, CheckCircle, Send, MessageSquare } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { dataManager, type TravelOffice, getOfficeDisplayServices } from '@/services/dataManager';
import { getCountryDataWithDynamic, getCountryName, getAllCountriesWithDynamic, syncStaticWithDynamic } from '@/data/countries';
import { useLanguage } from '@/contexts/LanguageContext';
import GoogleMap from '@/components/GoogleMap';

export default function OfficeContact() {
  const { countryId, officeId } = useParams<{ countryId?: string; officeId?: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [office, setOffice] = useState<TravelOffice | null>(null);
  const [countryName, setCountryName] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadOfficeData();
  }, [countryId, officeId]);

  const loadOfficeData = async () => {
    if (countryId) {
      await syncStaticWithDynamic();
      await dataManager.getCountriesAsync();
      await dataManager.getOfficesAsync();
      await dataManager.ensureOfficesForAllCountries();

      const countryData = getCountryDataWithDynamic(countryId);
      if (!countryData) {
        console.error(`Country ${countryId} not found`);
        return;
      }
      
      let offices = dataManager.getOfficesByCountry(countryId);
      let selectedOffice = officeId 
        ? offices.find(o => o.id === officeId)
        : offices[0];
      
      // If still no office found, create one directly for this country
      if (!selectedOffice && countryData) {
        // Get default values
        const phoneMap: Record<string, string> = {
          sudan: '+249 123 456 789',
          saudi: '+966 11 234 5678',
          uae: '+971 4 567 8901',
          egypt: '+20 2 234 5678',
          turkey: '+90 212 345 6789',
          morocco: '+212 522 123 456',
        };
        
        const emailMap: Record<string, string> = {
          sudan: 'khartoum@ciar.com',
          saudi: 'riyadh@ciar.com',
          uae: 'dubai@ciar.com',
          egypt: 'cairo@ciar.com',
          turkey: 'istanbul@ciar.com',
          morocco: 'casablanca@ciar.com',
        };
        
        const coordinatesMap: Record<string, { lat: number; lng: number }> = {
          sudan: { lat: 15.5007, lng: 32.5599 },
          saudi: { lat: 24.7136, lng: 46.6753 },
          uae: { lat: 25.2048, lng: 55.2708 },
          egypt: { lat: 30.0444, lng: 31.2357 },
          turkey: { lat: 41.0082, lng: 28.9784 },
          morocco: { lat: 33.5731, lng: -7.5898 },
        };
        
        const newOfficeData = {
          countryId: countryId,
          name: {
            ar: `مكتب ${countryData.name.ar}`,
            en: `${countryData.name.en} Office`,
            fr: `Bureau ${countryData.name.fr}`,
          },
          address: {
            ar: countryData.capital?.ar || `مركز ${countryData.name.ar}`,
            en: countryData.capital?.en || `${countryData.name.en} Center`,
            fr: countryData.capital?.fr || `Centre ${countryData.name.fr}`,
          },
          phone: phoneMap[countryId] || '+249 123 456 789',
          email: emailMap[countryId] || `${countryId}@ciar.com`,
          website: '',
          manager: {
            ar: `مدير مكتب ${countryData.name.ar}`,
            en: `${countryData.name.en} Office Manager`,
            fr: `Gestionnaire du Bureau ${countryData.name.fr}`,
          },
          services: {
            ar: ['حجز الفنادق', 'تنظيم الرحلات', 'تذاكر الطيران', 'التأشيرات', 'الاستقبال في المطار'],
            en: ['Hotel Booking', 'Tour Organization', 'Flight Tickets', 'Visas', 'Airport Pickup'],
            fr: ['Réservation d\'Hôtels', 'Organisation de Circuits', 'Billets d\'Avion', 'Visas', 'Transfert Aéroport'],
          },
          workingHours: {
            ar: 'السبت - الخميس: 9:00 صباحاً - 6:00 مساءً',
            en: 'Saturday - Thursday: 9:00 AM - 6:00 PM',
            fr: 'Samedi - Jeudi: 9h00 - 18h00',
          },
          coordinates: coordinatesMap[countryId],
          rating: countryData.rating || 4.5,
          reviews: Math.floor((countryData.totalReviews || 0) / 10),
          isActive: true,
        };
        
        // Add office to dataManager
        const createdOffice = dataManager.addOffice(newOfficeData);
        if (createdOffice) {
          selectedOffice = createdOffice;
        }
      }
      
      if (selectedOffice) {
        setOffice(selectedOffice);
        setCountryName(getCountryName(countryData, language));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  if (!office) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-tarhal-blue-dark mb-4">
              {language === 'ar' ? 'المكتب غير موجود' : language === 'fr' ? 'Bureau introuvable' : 'Office not found'}
            </h1>
            <p className="text-tarhal-gray-dark mb-6">
              {language === 'ar' ? 'عذراً، لم نتمكن من العثور على بيانات هذا المكتب' : language === 'fr' ? 'Désolé, nous n\'avons pas pu trouver les données de ce bureau' : 'Sorry, we couldn\'t find this office data'}
            </p>
            <Link to="/offices">
              <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
                {language === 'ar' ? 'العودة للمكاتب' : language === 'fr' ? 'Retour aux bureaux' : 'Back to Offices'}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative h-[50vh] overflow-hidden bg-gradient-to-br from-tarhal-blue-dark to-tarhal-navy">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/25 rounded-full"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6 animate-slide-in-left">
                <Link 
                  to={countryId ? `/offices/${countryId}` : '/offices'} 
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>{language === 'ar' ? 'العودة' : language === 'fr' ? 'Retour' : 'Back'}</span>
                </Link>
              </div>
              
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-tarhal-orange rounded-full flex items-center justify-center">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                      {office.name[language]}
                    </h1>
                    {countryName && (
                      <p className="text-xl text-tarhal-orange font-medium mt-2">{countryName}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Star className="h-5 w-5 text-tarhal-orange" />
                    <span className="text-white font-semibold">{office.rating}</span>
                    <span className="text-white/80">({office.reviews} {language === 'ar' ? 'تقييم' : language === 'fr' ? 'avis' : 'reviews'})</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Clock className="h-5 w-5 text-tarhal-orange" />
                    <span className="text-white">{office.workingHours[language]}</span>
                  </div>
                  <a 
                    href={`https://wa.me/${(office.whatsapp || office.phone).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>{language === 'ar' ? 'واتساب' : language === 'fr' ? 'WhatsApp' : 'WhatsApp'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-tarhal-blue-dark mb-6">
                  {language === 'ar' ? 'معلومات التواصل' : language === 'fr' ? 'Informations de Contact' : 'Contact Information'}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="rounded-2xl p-6 border border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-800 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tarhal-blue-dark">
                          {language === 'ar' ? 'الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'}
                        </h3>
                      </div>
                    </div>
                    <a 
                      href={`tel:${office.phone}`}
                      className="text-tarhal-blue-dark font-semibold hover:text-tarhal-orange transition-colors text-lg"
                    >
                      {office.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="rounded-2xl p-6 border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tarhal-blue-dark">
                          {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email'}
                        </h3>
                      </div>
                    </div>
                    <a 
                      href={`mailto:${office.email}`}
                      className="text-tarhal-blue-dark font-semibold hover:text-tarhal-orange transition-colors text-lg break-all"
                    >
                      {office.email}
                    </a>
                  </div>

                  {/* WhatsApp */}
                  <div className="rounded-2xl p-6 border border-emerald-100 dark:border-emerald-500/20 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tarhal-blue-dark">
                          {language === 'ar' ? 'واتساب' : language === 'fr' ? 'WhatsApp' : 'WhatsApp'}
                        </h3>
                      </div>
                    </div>
                    <a 
                      href={`https://wa.me/${(office.whatsapp || office.phone).replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>{language === 'ar' ? 'تواصل عبر الواتساب' : language === 'fr' ? 'Contacter via WhatsApp' : 'Contact via WhatsApp'}</span>
                    </a>
                  </div>

                  {/* Address */}
                  <div className="rounded-2xl p-6 border border-red-100 dark:border-red-500/20 bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900 dark:to-slate-800 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tarhal-blue-dark">
                          {language === 'ar' ? 'العنوان' : language === 'fr' ? 'Adresse' : 'Address'}
                        </h3>
                      </div>
                    </div>
                    <p className="text-tarhal-blue-dark font-medium leading-relaxed">
                      {office.address[language]}
                    </p>
                  </div>

                  {/* Manager */}
                  <div className="rounded-2xl p-6 border border-purple-100 dark:border-purple-500/20 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tarhal-blue-dark">
                          {language === 'ar' ? 'مدير المكتب' : language === 'fr' ? 'Directeur du Bureau' : 'Office Manager'}
                        </h3>
                      </div>
                    </div>
                    <p className="text-tarhal-blue-dark font-medium">
                      {office.manager[language]}
                    </p>
                  </div>

                  {/* Website */}
                  {office.website && (
                    <div className="rounded-2xl p-6 border border-cyan-100 dark:border-cyan-500/20 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-tarhal-blue-dark">
                            {language === 'ar' ? 'الموقع الإلكتروني' : language === 'fr' ? 'Site Web' : 'Website'}
                          </h3>
                        </div>
                      </div>
                      <a 
                        href={office.website.startsWith('http') ? office.website : `https://${office.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tarhal-blue-dark font-semibold hover:text-tarhal-orange transition-colors text-lg break-all"
                      >
                        {office.website}
                      </a>
                    </div>
                  )}

                  {/* Working Hours */}
                  <div className="rounded-2xl p-6 border border-orange-100 dark:border-orange-500/20 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-tarhal-orange rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tarhal-blue-dark">
                          {language === 'ar' ? 'ساعات العمل' : language === 'fr' ? 'Heures d\'Ouverture' : 'Working Hours'}
                        </h3>
                      </div>
                    </div>
                    <p className="text-tarhal-blue-dark font-medium">
                      {office.workingHours[language]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Services */}
              {getOfficeDisplayServices(office, language).length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-tarhal-blue-dark mb-6">
                    {language === 'ar' ? 'الخدمات المتاحة' : language === 'fr' ? 'Services Disponibles' : 'Available Services'}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getOfficeDisplayServices(office, language).map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gradient-to-br from-tarhal-blue/5 to-tarhal-orange/5 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-tarhal-orange/20 dark:border-slate-700 hover:shadow-md transition-shadow duration-300"
                      >
                        <CheckCircle className="h-5 w-5 text-tarhal-orange flex-shrink-0" />
                        <span className="text-tarhal-blue-dark font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {office.coordinates && (
                <div>
                  <h2 className="text-3xl font-bold text-tarhal-blue-dark mb-6">
                    {language === 'ar' ? 'الموقع على الخريطة' : language === 'fr' ? 'Localisation sur la Carte' : 'Location on Map'}
                  </h2>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <GoogleMap
                      center={office.coordinates}
                      zoom={15}
                      markers={[{
                        position: office.coordinates,
                        title: office.name[language],
                        info: `${office.address[language]}<br/>${office.phone}<br/>${office.email}`
                      }]}
                      height="400px"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-tarhal-blue-dark to-tarhal-navy rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {language === 'ar' ? 'تواصل معنا' : language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
                </h2>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      {language === 'ar' ? 'تم إرسال الرسالة!' : language === 'fr' ? 'Message envoyé!' : 'Message sent!'}
                    </h3>
                    <p className="text-white/80">
                      {language === 'ar' ? 'سيتم الرد عليك قريباً' : language === 'fr' ? 'Nous vous répondrons bientôt' : 'We will reply to you soon'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        name="name"
                        placeholder={language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom complet' : 'Full Name'}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        name="email"
                        placeholder={language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email'}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder={language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone Number'}
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="subject"
                        placeholder={language === 'ar' ? 'الموضوع' : language === 'fr' ? 'Sujet' : 'Subject'}
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                      />
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        placeholder={language === 'ar' ? 'رسالتك' : language === 'fr' ? 'Votre message' : 'Your Message'}
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark hover:from-tarhal-orange-dark hover:to-tarhal-orange text-white font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          {language === 'ar' ? 'جاري الإرسال...' : language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'إرسال الرسالة' : language === 'fr' ? 'Envoyer le Message' : 'Send Message'}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

