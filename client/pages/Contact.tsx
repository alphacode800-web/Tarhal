import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Calendar, User, Building, Globe, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import GoogleMap from '@/components/GoogleMap';
import { dataManager } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DEFAULT_CONTACT,
  SOCIAL_PLATFORMS,
  getContactFromSettings,
  mergeSocialLinks,
  resolveSocialUrl,
  type SocialLinks,
  type SiteContact,
} from '@/data/socialPlatforms';
import SocialBrandIcon from '@/components/SocialBrandIcon';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  contactMethod: string;
  tripType: string;
}

export default function Contact() {
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    country: '',
    subject: '',
    message: '',
    contactMethod: 'email',
    tripType: 'leisure'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(mergeSocialLinks());
  const [contact, setContact] = useState<SiteContact>(DEFAULT_CONTACT);

  const headerImages = [
    'https://images.pexels.com/photos/33337243/pexels-photo-33337243.jpeg',
    'https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg',
    'https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg',
    'https://images.pexels.com/photos/33351942/pexels-photo-33351942.jpeg',
    'https://images.pexels.com/photos/53537/caravan-desert-safari-dune-53537.jpeg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % headerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Load social links from settings
  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const settings = await dataManager.getSettingsAsync();
        setContact(getContactFromSettings(settings));
        setSocialLinks(mergeSocialLinks(settings.socialLinks));
      } catch (error) {
        console.error('Error loading social links:', error);
      }
    };
    loadSocialLinks();

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      loadSocialLinks();
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        country: '',
        subject: '',
        message: '',
        contactMethod: 'email',
        tripType: 'leisure'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'اتصل بنا',
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'واتساب',
      href: resolveSocialUrl('whatsapp', socialLinks, contact),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'راسلنا',
      href: `mailto:${contact.email}`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'زورنا',
      details: ['الخرطوم، السودان'],
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'أوقات العمل',
      details: ['السبت - الخميس: 9 صباحاً - 6 مساءً', 'الجمعة: 2 ظهراً - 6 مساءً', 'دعم طوارئ: 24/7'],
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const socialPlatforms = SOCIAL_PLATFORMS.map((platform) => ({
    ...platform,
    url: resolveSocialUrl(platform.key, socialLinks, contact),
  }));

  const officeLocations = [
    {
      city: 'الخرطوم',
      country: 'السودان',
      countryId: 'sudan',
      address: 'شارع البلدية، الخرطوم',
      phone: '+249 123 456 789',
      email: 'khartoum@ciar.com',
      manager: 'أحمد محمد علي',
      image: 'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg',
      coordinates: { lat: 15.5007, lng: 32.5599 }
    },
    {
      city: 'الرياض',
      country: 'السعودية',
      countryId: 'saudi',
      address: 'طريق الملك عبدالعزيز، الرياض',
      phone: '+966 11 234 5678',
      email: 'riyadh@ciar.com',
      manager: 'محمد عبدالله',
      image: 'https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg',
      coordinates: { lat: 24.7136, lng: 46.6753 }
    },
    {
      city: 'دبي',
      country: 'الإمارات',
      countryId: 'uae',
      address: 'شارع الشيخ زايد، دبي',
      phone: '+971 4 567 8901',
      email: 'dubai@ciar.com',
      manager: 'فاطمة أحمد',
      image: 'https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg',
      coordinates: { lat: 25.2048, lng: 55.2708 }
    },
    {
      city: 'القاهرة',
      country: 'مصر',
      countryId: 'egypt',
      address: 'شارع التحرير، القاهرة',
      phone: '+20 2 234 5678',
      email: 'cairo@ciar.com',
      manager: 'عمر حسن',
      image: 'https://images.pexels.com/photos/33337243/pexels-photo-33337243.jpeg',
      coordinates: { lat: 30.0444, lng: 31.2357 }
    },
    {
      city: 'إسطنبول',
      country: 'تركيا',
      countryId: 'turkey',
      address: 'شارع الاستقلال، إسطنبول',
      phone: '+90 212 345 6789',
      email: 'istanbul@ciar.com',
      manager: 'أيلين أوزتورك',
      image: 'https://images.pexels.com/photos/33351942/pexels-photo-33351942.jpeg',
      coordinates: { lat: 41.0082, lng: 28.9784 }
    },
    {
      city: 'الدار البيضاء',
      country: 'المغرب',
      countryId: 'morocco',
      address: 'شارع محمد الخامس، الدار البيضاء',
      phone: '+212 522 123 456',
      email: 'casablanca@ciar.com',
      manager: 'يوسف بن علي',
      image: 'https://images.pexels.com/photos/53537/caravan-desert-safari-dune-53537.jpeg',
      coordinates: { lat: 33.5731, lng: -7.5898 }
    }
  ];

  const [selectedOffice, setSelectedOffice] = useState(officeLocations[0]);

  const countries = [
    'السودان', 'السعودية', 'الإمارات', 'مصر', 'الأردن', 'لبنان', 'سوريا', 'العراق',
    'الكويت', 'قطر', 'البحرين', 'عمان', 'المغرب', 'الجزائر', 'تونس', 'ليبيا',
    'تركيا', 'إيران', 'باكستان', 'أفغانستان', 'ماليزيا', 'إندونيسيا', 'أخرى'
  ];

  const subjects = [
    'استفسار عام',
    'حجز رحلة',
    'إلغاء أو تعديل',
    'شكوى',
    'اقتراح',
    'طلب عرض سعر',
    'دعم تقني',
    'شراكة تجارية'
  ];

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          {headerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-tarhal-navy/90 via-tarhal-blue-dark/70 to-tarhal-orange/40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              تواصل معنا
              <span className="block text-tarhal-orange text-3xl md:text-4xl font-normal mt-2">
                نحن هنا لخدمتكم
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '300ms' }}>
              فريقنا المتخصص جاهز للإجابة على جميع استفساراتكم ومساعدتكم في تخطيط رحلتكم المثالية
            </p>
            
            <div className="flex gap-4 justify-center animate-scale-in" style={{ animationDelay: '600ms' }}>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                aria-label={language === 'ar' ? 'اتصل بنا' : language === 'fr' ? 'Appelez-nous' : 'Call us'}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <Phone className="h-7 w-7 text-tarhal-orange" />
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label={language === 'ar' ? 'راسلنا بالبريد' : language === 'fr' ? 'Envoyez un e-mail' : 'Email us'}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <Mail className="h-7 w-7 text-tarhal-orange" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4 animate-fade-in">
              طرق التواصل
            </h2>
            <p className="text-xl text-tarhal-gray-dark animate-slide-up">
              اختر الطريقة الأنسب للتواصل معنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {contactInfo.map((info, index) => {
              const cardContent = (
                <>
                  <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-bold text-tarhal-blue-dark mb-2">{info.title}</h3>
                  {'details' in info && info.details ? (
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-tarhal-gray-dark text-sm">{detail}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-tarhal-gray-dark text-sm">
                      {language === 'ar' ? 'اضغط للتواصل' : language === 'fr' ? 'Cliquez pour contacter' : 'Click to contact'}
                    </p>
                  )}
                </>
              );

              return 'href' in info && info.href ? (
                <a
                  key={index}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-scale-in border border-tarhal-gray-light/50 block"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {cardContent}
                </a>
              ) : (
                <div
                  key={index}
                  className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-scale-in border border-tarhal-gray-light/50"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form and Animation */}
      <section className="py-20 bg-gradient-to-br from-tarhal-blue to-tarhal-navy">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Contact Form */}
            <div className="animate-slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                أرسل لنا رسالة
              </h2>
              <p className="text-xl text-white/80 mb-8">
                املأ النموذج وسنتواصل معك في أقرب وقت ممكن
              </p>
              
              {submitted ? (
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 text-center animate-scale-in">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">تم إرسال رسالتك بنجاح!</h3>
                  <p className="text-white/80">سنتواصل معك خلال 24 ساعة</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 font-medium">الاسم الكامل *</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:border-tarhal-orange backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-medium">البريد الإلكتروني *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:border-tarhal-orange backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 font-medium">رقم ��لهاتف</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={contact.phone}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:border-tarhal-orange backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-medium">الدولة</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-tarhal-orange backdrop-blur-sm"
                      >
                        <option value="" className="bg-tarhal-navy">اختر دولتك</option>
                        {countries.map((country, idx) => (
                          <option key={idx} value={country} className="bg-tarhal-navy">{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 font-medium">موضوع الرسالة *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-tarhal-orange backdrop-blur-sm"
                      >
                        <option value="" className="bg-tarhal-navy">اختر الموضوع</option>
                        {subjects.map((subject, idx) => (
                          <option key={idx} value={subject} className="bg-tarhal-navy">{subject}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-medium">نوع الرحلة</label>
                      <select
                        name="tripType"
                        value={formData.tripType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-tarhal-orange backdrop-blur-sm"
                      >
                        <option value="leisure" className="bg-tarhal-navy">سياحة وترفيه</option>
                        <option value="business" className="bg-tarhal-navy">رحلة عمل</option>
                        <option value="pilgrimage" className="bg-tarhal-navy">حج وعمرة</option>
                        <option value="medical" className="bg-tarhal-navy">سياحة علاجية</option>
                        <option value="education" className="bg-tarhal-navy">سياحة تعليمية</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">طريقة التواصل المفضلة</label>
                    <div className="flex gap-4 flex-wrap">
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="email"
                          checked={formData.contactMethod === 'email'}
                          onChange={handleInputChange}
                          className="text-tarhal-orange"
                        />
                        <Mail className="h-4 w-4" />
                        بريد إلكتروني
                      </label>
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="phone"
                          checked={formData.contactMethod === 'phone'}
                          onChange={handleInputChange}
                          className="text-tarhal-orange"
                        />
                        <Phone className="h-4 w-4" />
                        هاتف
                      </label>
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="whatsapp"
                          checked={formData.contactMethod === 'whatsapp'}
                          onChange={handleInputChange}
                          className="text-tarhal-orange"
                        />
                        <MessageCircle className="h-4 w-4" />
                        واتساب
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">رسالتك *</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="اكتب رسالتك هنا... أخبرنا عن رحلتك المثالية وسنساعدك في تحقيقها"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:border-tarhal-orange resize-none backdrop-blur-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white px-8 py-4 text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال الرسالة
                        <Send className="mr-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Animated Illustration */}
            <div className="relative animate-slide-in-right">
              <div className="relative w-full h-96 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-tarhal-orange/20 to-tarhal-orange-dark/20 rounded-full animate-pulse-slow"></div>
                <div className="relative z-10 text-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                    <MessageCircle className="h-20 w-20 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    نتلقى رسائلكم بسرعة
                  </h3>
                  <p className="text-white/80 text-lg mb-6">
                    فريقنا المتخصص جاهز للرد على استفساراتكم في أقل من 2 ساعة
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0s' }}>
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4 animate-fade-in">
            {language === 'ar' ? 'تابعونا على وسائل التواصل' : language === 'fr' ? 'Suivez-nous sur les réseaux sociaux' : 'Follow Us on Social Media'}
          </h2>
          <p className="text-xl text-tarhal-gray-dark mb-8 animate-slide-up">
            {language === 'ar' ? 'ابقوا على اطلاع بأحدث العروض والوجهات السياحية' : language === 'fr' ? 'Restez informé des dernières offres et destinations touristiques' : 'Stay updated with the latest offers and tourist destinations'}
          </p>
          
          <div className="flex justify-center gap-5 flex-wrap animate-scale-in max-w-5xl mx-auto">
            {socialPlatforms.map((platform, index) => (
              <a
                key={platform.key}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-16 h-16 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center hover:shadow-xl hover:border-tarhal-orange/30 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
                title={language === 'ar' ? platform.name.ar : language === 'fr' ? platform.name.fr : platform.name.en}
              >
                <SocialBrandIcon platform={platform.key} size={32} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                  {language === 'ar' ? platform.name.ar : language === 'fr' ? platform.name.fr : platform.name.en}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-gradient-to-br from-tarhal-blue-dark to-tarhal-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              مكاتبنا حول العالم
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
              زوروا مكاتبنا في أهم المدن العربية والعالمية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={office.image}
                    alt={office.city}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{office.city}</h3>
                    <p className="text-sm text-white/80">{office.country}</p>
                  </div>
                </div>
                
                <div className="p-6 text-white">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-tarhal-orange mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-tarhal-orange flex-shrink-0" />
                      <span className="text-sm">{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-tarhal-orange flex-shrink-0" />
                      <span className="text-sm">{office.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-tarhal-orange flex-shrink-0" />
                      <span className="text-sm">مدير المكتب: {office.manager}</span>
                    </div>
                  </div>
                  
                  <Link to={`/offices/${office.countryId}/contact`}>
                    <Button className="w-full mt-4 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
                      تواصل مع المكتب
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              موقعنا على الخريطة
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              يمكنكم العثور على مكاتبنا بسهولة في جميع أنحاء العالم
            </p>
          </div>

          {/* Office Selection */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {officeLocations.map((office, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOffice(office)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedOffice.city === office.city
                      ? 'bg-tarhal-orange text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-tarhal-blue-dark hover:bg-gray-200'
                  }`}
                >
                  {office.city}
                </button>
              ))}
            </div>
          </div>

          {/* Google Map */}
          <div className="mb-8">
            <GoogleMap
              center={selectedOffice.coordinates}
              zoom={14}
              markers={[
                {
                  position: selectedOffice.coordinates,
                  title: `مكتب ${selectedOffice.city}`,
                  info: `${selectedOffice.address}<br/>${selectedOffice.phone}<br/>${selectedOffice.email}`
                }
              ]}
              height="600px"
              className="shadow-2xl"
            />
          </div>

          {/* Selected Office Info */}
          <div className="bg-gradient-to-br from-tarhal-orange/10 to-tarhal-blue/10 rounded-2xl p-8 border-2 border-tarhal-orange/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-tarhal-blue-dark mb-4">
                  مكتب {selectedOffice.city}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-tarhal-orange mt-0.5 flex-shrink-0" />
                    <span className="text-tarhal-gray-dark">{selectedOffice.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-tarhal-orange flex-shrink-0" />
                    <span className="text-tarhal-gray-dark">{selectedOffice.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-tarhal-orange flex-shrink-0" />
                    <span className="text-tarhal-gray-dark">{selectedOffice.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-tarhal-orange flex-shrink-0" />
                    <span className="text-tarhal-gray-dark">مدير المكتب: {selectedOffice.manager}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedOffice.coordinates.lat},${selectedOffice.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                >
                  <MapPin className="h-5 w-5" />
                  فتح في خرائط جوجل
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-tarhal-orange/5 to-tarhal-blue/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4 animate-fade-in">
              الأسئلة الشائعة
            </h2>
            <p className="text-xl text-tarhal-gray-dark animate-slide-up">
              إجابات على أكثر الأسئلة تكراراً
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              {
                question: 'كيف يمكنني حجز رحلة؟',
                answer: 'يمكنكم الحجز عبر موقعنا الإلكتروني أو زيارة أحد مكاتبنا أو الاتصال بنا مباشرة.'
              },
              {
                question: 'هل تقدمون خدمات التأشيرة؟',
                answer: 'نعم، نقدم خدمات استخراج التأشيرات لجميع الوجهات التي نغطيها.'
              },
              {
                question: 'ما هي سياسة الإلغاء؟',
                answer: 'سياسة الإلغاء تختلف حسب نوع الحجز والوجهة. يمكن الاطلاع على التفاصيل عند الحجز.'
              },
              {
                question: 'هل تقدمون عروض للمجموعات؟',
                answer: 'نعم، لدينا عروض خاصة للمجموعات والرحلات العائلية والشركات.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <h3 className="text-lg font-bold text-tarhal-blue-dark mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-tarhal-orange" />
                  {faq.question}
                </h3>
                <p className="text-tarhal-gray-dark">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
