import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, Award, Shield, HeartHandshake, Star, ArrowRight, Globe2, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { dataManager } from '@/services/dataManager';
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
import { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(mergeSocialLinks());
  const [contact, setContact] = useState<SiteContact>(DEFAULT_CONTACT);

  // Load social links from settings
  useEffect(() => {
    const loadSocialLinks = async () => {
      const settings = await dataManager.getSettingsAsync();
      setContact(getContactFromSettings(settings));
      setSocialLinks(mergeSocialLinks(settings.socialLinks));
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

  const getLocalizedText = (ar: string, en: string, fr: string) => {
    switch (language) {
      case 'ar': return ar;
      case 'en': return en;
      case 'fr': return fr;
      default: return ar;
    }
  };

  const quickLinks = [
    { href: '/', label: 'الرئيسية', labelEn: 'Home', labelFr: 'Accueil' },
    { href: '/offices', label: 'المكاتب السياحية', labelEn: 'Travel Offices', labelFr: 'Bureaux de Voyage' },
    { href: '/about', label: 'من نحن', labelEn: 'About Us', labelFr: 'À Propos' },
    { href: '/contact', label: 'التواصل', labelEn: 'Contact', labelFr: 'Contact' },
  ];

  const destinations = [
    { name: 'السودان', nameEn: 'Sudan', nameFr: 'Soudan', flag: '🇸🇩' },
    { name: 'مصر', nameEn: 'Egypt', nameFr: 'Égypte', flag: '🇪🇬' },
    { name: 'الإمارات', nameEn: 'UAE', nameFr: 'EAU', flag: '🇦🇪' },
    { name: 'السعودية', nameEn: 'Saudi Arabia', nameFr: 'Arabie Saoudite', flag: '🇸🇦' },
    { name: 'تركيا', nameEn: 'Turkey', nameFr: 'Turquie', flag: '🇹🇷' },
    { name: 'المغرب', nameEn: 'Morocco', nameFr: 'Maroc', flag: '🇲' },
  ];

  const socialLinksArray = SOCIAL_PLATFORMS.map((platform) => ({
    ...platform,
    href: resolveSocialUrl(platform.key, socialLinks, contact),
    label: getLocalizedText(platform.name.ar, platform.name.en, platform.name.fr),
  }));

  const certifications = [
    { name: 'ISO 9001', desc: 'ضمان الجودة', icon: Award },
    { name: 'IATA', desc: 'عضو معتمد', icon: Shield },
    { name: 'محفظة آمنة', desc: 'دفع آمن', icon: HeartHandshake },
  ];

  return (
    <footer className="bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/15 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 border border-white/10 rounded-full"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Company Info */}
          <div className="space-y-6 animate-fade-in lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-xl flex items-center justify-center shadow-lg">
                  <Globe2 size={24} className="text-white" />
                </div>
                <div>
                  <div className="flex flex-col leading-none">
                    <span className="logo-ciar text-3xl">CIAR</span>
                    <span className="logo-tourism text-[10px] font-light uppercase text-white/85 mt-1">Tourism</span>
                  </div>
                  <p className="text-xs text-white/70">
                    {getLocalizedText('سياحة وسفر', 'Travel & Tourism', 'Voyage & Tourisme')}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-white/80 leading-relaxed">
                {getLocalizedText(
                  'شركة ciar للسياحة والسفر، رفيقك المثالي لاستكشاف العالم. نقدم أفضل الخدمات السياحية عبر شبكة واسعة من المكاتب حول العالم.',
                  'ciar Travel & Tourism Company, your perfect companion to explore the world. We offer the best tourism services through an extensive network of offices worldwide.',
                  'ciar Travel & Tourism, votre compagnon idéal pour explorer le monde. Nous offrons les meilleurs services touristiques à travers un vaste réseau de bureaux dans le monde entier.'
                )}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-tarhal-orange/20 rounded-lg flex items-center justify-center group-hover:bg-tarhal-orange/30 transition-colors">
                  <MapPin size={16} className="text-tarhal-orange" />
                </div>
                <span className="text-sm text-white/90">{getLocalizedText('الخرطوم، السودان', 'Khartoum, Sudan', 'Khartoum, Soudan')}</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-tarhal-orange/20 rounded-lg flex items-center justify-center group-hover:bg-tarhal-orange/30 transition-colors">
                  <Phone size={16} className="text-tarhal-orange" />
                </div>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-sm text-white/90 hover:text-tarhal-orange transition-colors">
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-tarhal-orange/20 rounded-lg flex items-center justify-center group-hover:bg-tarhal-orange/30 transition-colors">
                  <MessageCircle size={16} className="text-tarhal-orange" />
                </div>
                <a
                  href={resolveSocialUrl('whatsapp', socialLinks, contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/90 hover:text-tarhal-orange transition-colors"
                >
                  {contact.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-tarhal-orange/20 rounded-lg flex items-center justify-center group-hover:bg-tarhal-orange/30 transition-colors">
                  <Mail size={16} className="text-tarhal-orange" />
                </div>
                <a href={`mailto:${contact.email}`} className="text-sm text-white/90 hover:text-tarhal-orange transition-colors">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-tarhal-orange/20 rounded-lg flex items-center justify-center group-hover:bg-tarhal-orange/30 transition-colors">
                  <Clock size={16} className="text-tarhal-orange" />
                </div>
                <span className="text-sm text-white/90">{getLocalizedText('24/7 خدمة العملاء', '24/7 Customer Service', '24/7 Service Client')}</span>
              </div>
            </div>

            {/* Certifications */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold mb-3 text-tarhal-orange">
                {getLocalizedText('شهادات الجودة', 'Quality Certifications', 'Certifications de Qualité')}
              </h4>
              <div className="flex gap-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                      <cert.icon size={16} className="text-tarhal-orange" />
                    </div>
                    <div className="absolute opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-tarhal-navy rounded-lg px-3 py-2 text-xs shadow-lg mt-2 border border-white/10">
                      <div className="font-semibold">{cert.name}</div>
                      <div className="text-tarhal-gray-light">{cert.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold relative">
              {getLocalizedText('روابط سريعة', 'Quick Links', 'Liens Rapides')}
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark rounded"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-tarhal-orange transition-all duration-300 text-sm flex items-center gap-3 group"
                  >
                    <ArrowRight size={14} className="text-tarhal-orange group-hover:translate-x-1 transition-transform" />
                    {getLocalizedText(link.label, link.labelEn, link.labelFr)}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Customer Reviews Summary */}
            <div className="pt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold">4.9/5</span>
              </div>
              <p className="text-xs text-white/70">
                {getLocalizedText('أكثر من 10,000 عميل راضٍ', 'Over 10,000 satisfied customers', 'Plus de 10 000 clients satisfaits')}
              </p>
            </div>
          </div>

          {/* Destinations & Social */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <h3 className="text-xl font-bold relative">
              {getLocalizedText('وجهات مميزة', 'Featured Destinations', 'Destinations Vedettes')}
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark rounded"></span>
            </h3>
            <ul className="space-y-3">
              {destinations.map((destination, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-tarhal-orange transition-all duration-300 text-sm flex items-center gap-3 group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{destination.flag}</span>
                    <span>{getLocalizedText(destination.name, destination.nameEn, destination.nameFr)}</span>
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Social Media */}
            <div className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>{getLocalizedText('تواصل معنا', 'Follow Us', 'Suivez-nous')}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinksArray.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} backdrop-blur-sm border border-white/10 group`}
                    title={social.label}
                  >
                    <span className="group-hover:scale-110 transition-transform">
                      <SocialBrandIcon platform={social.key} size={22} variant="white" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-white/10 bg-gradient-to-r from-tarhal-navy/80 to-tarhal-blue/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-right space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-tarhal-orange bg-clip-text text-transparent">
                {getLocalizedText('اشترك في نشرتنا الإخبارية', 'Subscribe to Our Newsletter', 'Abonnez-vous à Notre Newsletter')}
              </h3>
              <p className="text-white/80">
                {getLocalizedText('احصل على أحدث العروض والوجهات السياحية', 'Get the latest offers and travel destinations', 'Obtenez les dernières offres et destinations de voyage')}
              </p>
              <div className="flex items-center gap-2 justify-center lg:justify-start text-sm text-tarhal-orange">
                <Shield size={16} />
                <span>{getLocalizedText('لن نشارك بياناتك مع أي طرف ثالث', 'We will never share your data', 'Nous ne partagerons jamais vos données')}</span>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto max-w-md">
              <div className="relative flex-1 lg:w-80">
                <input
                  type="email"
                  placeholder={getLocalizedText('أدخل بريدك الإلكتروني', 'Enter your email', 'Entrez votre email')}
                  className="w-full px-5 py-4 rounded-xl bg-white/15 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:border-tarhal-orange focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                />
                <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
                <Send size={18} />
                {getLocalizedText('اشتراك', 'Subscribe', 'S\'abonner')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 bg-tarhal-navy">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-right text-white/75 text-sm space-y-2">
              <p className="font-medium">
                © {currentYear} {getLocalizedText('شركة ciar للسياحة والسفر', 'ciar Travel & Tourism Company', 'Société ciar Voyage & Tourisme')} - {getLocalizedText('جميع الحقوق محفوظة', 'All Rights Reserved', 'Tous Droits Réservés')}.
              </p>
              <p className="text-xs">
                {getLocalizedText('مرخصة من وزارة السياحة والآثار', 'Licensed by Ministry of Tourism', 'Agréé par le Ministère du Tourisme')} | {getLocalizedText('رقم الترخيص', 'License No', 'N° de Licence')}: TR-2024-001
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/75">
              <Link to="/privacy" className="hover:text-tarhal-orange transition-colors duration-300 relative group">
                {getLocalizedText('سياسة الخصوصية', 'Privacy Policy', 'Politique de Confidentialité')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tarhal-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/terms" className="hover:text-tarhal-orange transition-colors duration-300 relative group">
                {getLocalizedText('الشروط والأحكام', 'Terms & Conditions', 'Conditions Générales')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tarhal-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/sitemap" className="hover:text-tarhal-orange transition-colors duration-300 relative group">
                {getLocalizedText('خريطة الموقع', 'Sitemap', 'Plan du Site')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tarhal-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/contact" className="hover:text-tarhal-orange transition-colors duration-300 relative group">
                {getLocalizedText('اتصل بنا', 'Contact Us', 'Contactez-nous')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tarhal-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
