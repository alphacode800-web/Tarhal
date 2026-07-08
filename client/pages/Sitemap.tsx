import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Map, ChevronLeft } from 'lucide-react';

const SITEMAP_GROUPS = [
  {
    titleAr: 'الصفحات الرئيسية',
    titleEn: 'Main Pages',
    titleFr: 'Pages principales',
    links: [
      { to: '/', ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },
      { to: '/about', ar: 'من نحن', en: 'About Us', fr: 'À propos' },
      { to: '/contact', ar: 'اتصل بنا', en: 'Contact', fr: 'Contact' },
      { to: '/offices', ar: 'مكاتب السفر', en: 'Travel Offices', fr: 'Bureaux de voyage' },
    ],
  },
  {
    titleAr: 'الخدمات',
    titleEn: 'Services',
    titleFr: 'Services',
    links: [
      { to: '/offers', ar: 'العروض السياحية', en: 'Tour Offers', fr: 'Offres touristiques' },
      { to: '/hotels', ar: 'الفنادق', en: 'Hotels', fr: 'Hôtels' },
      { to: '/flight-tickets', ar: 'تذاكر الطيران', en: 'Flight Tickets', fr: 'Billets d\'avion' },
      { to: '/travel-visa', ar: 'التأشيرات', en: 'Travel Visas', fr: 'Visas' },
      { to: '/travel-insurance', ar: 'تأمين السفر', en: 'Travel Insurance', fr: 'Assurance voyage' },
      { to: '/car-rentals', ar: 'تأجير السيارات', en: 'Car Rentals', fr: 'Location de voitures' },
      { to: '/taxi-delivery', ar: 'التاكسي والتوصيل', en: 'Taxi & Delivery', fr: 'Taxi et livraison' },
    ],
  },
  {
    titleAr: 'معلومات قانونية',
    titleEn: 'Legal',
    titleFr: 'Informations légales',
    links: [
      { to: '/privacy', ar: 'سياسة الخصوصية', en: 'Privacy Policy', fr: 'Politique de confidentialité' },
      { to: '/terms', ar: 'الشروط والأحكام', en: 'Terms & Conditions', fr: 'Conditions générales' },
    ],
  },
];

export default function Sitemap() {
  const { language } = useLanguage();

  const tr = (ar: string, en: string, fr: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
            <Map className="h-8 w-8 text-tarhal-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {tr('خريطة الموقع', 'Sitemap', 'Plan du site')}
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            {tr(
              'دليل سريع لجميع صفحات وخدمات موقع ciar.',
              'A quick guide to all ciar website pages and services.',
              'Guide rapide de toutes les pages et services du site ciar.',
            )}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SITEMAP_GROUPS.map((group) => (
              <div
                key={group.titleEn}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm"
              >
                <h2 className="text-lg font-bold text-tarhal-blue-dark dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-slate-700">
                  {tr(group.titleAr, group.titleEn, group.titleFr)}
                </h2>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-tarhal-orange transition-colors text-sm"
                      >
                        <ChevronLeft className="h-3.5 w-3.5 text-tarhal-orange flex-shrink-0" />
                        {tr(link.ar, link.en, link.fr)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
