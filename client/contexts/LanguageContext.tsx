import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations object
const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.offices': 'المكاتب السياحية',
    'nav.offers': 'العروض السياحية',
    'nav.offers.local': 'جولات سياحية محلية',
    'nav.offers.international': 'جولات سياحية خارجية',
    'nav.offers.all': 'الكل',
    'theme.light': 'الوضع النهاري',
    'theme.dark': 'الوضع الليلي',
    'offers.filter.local': 'عروض محلية في دولتك',
    'offers.filter.international': 'عروض سفر دولية من دولتك',
    'offers.filter.all': 'جميع العروض السياحية',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.services': 'خدماتنا',
    'nav.admin': 'لوحة الإدارة',
    
    // Common
    'common.search': 'بحث',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.readMore': 'اقرأ المزيد',
    'common.bookNow': 'احجز الآن',
    'common.viewDetails': 'عرض التفاصيل',
    'common.getStarted': 'ابدأ الآن',
    'common.learnMore': 'تعلم المزيد',
    'common.discover': 'اكتشف',
    'common.explore': 'استكشف',
    'common.days': 'أيام',
    'common.hotels': 'فنادق',
    'common.tours': 'جولا��',
    'common.reviews': 'مراجعة',
    'common.rating': 'التقييم',
    'common.description': 'الوصف',
    'common.highlights': 'المعالم البارزة',
    'common.gallery': 'معرض الصور',
    'common.overview': 'نظرة عامة',
    'common.cities': 'المدن',
    'common.culture': 'الثقافة',
    'common.cuisine': 'المأكولات',
    'common.transportation': 'المواصلات',
    'common.safety': 'الأمان',
    'common.visaRequired': 'تأشيرة مطلوبة',
    'common.noVisaRequired': 'بدون تأشيرة',
    'common.bestTime': 'أفضل وقت للزيارة',
    'common.climate': 'المناخ',
    'common.language': 'اللغة',
    'common.currency': 'العملة',
    'common.timezone': 'المنطقة الزمنية',
    'common.capital': 'العاصمة',
    
    // Homepage
    'hero.title': 'اكتشف العالم مع',
    'hero.subtitle': 'رحلات استثنائية إلى أجمل الوجهات العالمية مع خدمة متميزة وأسعار تنافسية',
    'hero.cta': 'اكتشف وجهتك القادمة',
    'home.hero.welcome': 'مرحباً بكم في',
    'home.hero.brand': 'ciar',
    'home.hero.description': 'رفيقكم المثالي لاستكشاف العالم. نقدم أفضل الخدمات السياحية عبر شبكة واسعة من المكاتب في أكثر من 50 دولة حول العالم',
    'home.hero.exploreOffices': 'استكشف المكاتب السياحية',
    'home.hero.contactUs': 'اتصل بنا',

    // Home sections
    'home.offices.title': 'مكاتبنا السياحية',
    'home.offices.subtitle': 'اكتشف وجهاتنا المميزة حول العالم',
    'home.tourism.title.line1': 'اكتشف جمال العالم',
    'home.tourism.title.line2': 'معنا',
    'home.tourism.description': 'من الشواطئ الاستوائية الخلابة إلى القمم الجبلية الشاهقة، ومن المدن التاريخية العريقة إلى الوجهات العصرية المذهلة. نحن هنا لنجعل رحلتك تجربة لا تُنسى مليئة بالمغامرات والذكريات الجميلة.',
    'home.tourism.countriesStat': 'دولة',
    'home.tourism.happyClientsStat': 'عميل سعيد',
    
    // Features
    'features.title': 'لماذا تختار ciar؟',
    'features.expert.title': 'خبرة عالمية',
    'features.expert.desc': 'أكثر من 15 عاماً في صناعة السياحة العالمية',
    'features.support.title': 'دعم 24/7',
    'features.support.desc': 'فريق دعم متخصص متاح طوال اليوم',
    'features.price.title': 'أسعار تنافسية',
    'features.price.desc': 'أفضل الأسعار والعروض الحصرية',
    'features.booking.title': 'حجز آمن',
    'features.booking.desc': 'نظام حجز إلكتروني آمن ومضمون',
    
    // Countries section
    'countries.title': 'الوجهات الأكثر شعبية',
    'countries.subtitle': 'استكشف أجمل البلدان والوجهات السياحية حول العالم',
    
    // Testimonials
    'testimonials.title': 'ماذا يقول عملاؤنا',
    'testimonials.subtitle': 'تجارب حقيقية من عملائنا الكرام',

    // Services
    'services.title': 'خدماتنا المميزة',
    'services.subtitle': 'نقدم لك مجموعة شاملة من الخدمات السياحية لضمان رحلة مثالية',

    // Newsletter
    'newsletter.title': 'ابق على اطلاع بأحدث العروض',
    'newsletter.subtitle': 'اشترك في نشرتنا الإخبارية واحصل على أفضل الصفقات والعروض الحصرية قبل الجميع',
    'newsletter.placeholder': 'أدخل بريدك الإلكتروني',
    'newsletter.cta': 'اشتراك',

    // Testimonials section heading on home
    'home.testimonials.title': 'آراء عملائنا',
    'home.testimonials.subtitle': 'نفخر بثقة عملائنا الكرام وتجاربهم الرائعة معنا',
    
    // Footer
    'footer.company': 'شركة ciar للسياحة والسفر',
    'footer.description': 'وجهتك المثالية لاستكشاف العالم مع خدمات سياحية متميزة وتجربة لا تُنسى',
    'footer.quickLinks': 'روابط سريعة',
    'footer.services': 'خدماتنا',
    'footer.contact': 'تواصل معنا',
    'footer.followUs': 'تابعنا',
    'footer.rights': 'جميع الحقوق محفوظة © 2024 شركة تر��ال للسياحة والسفر',
    
    // Search
    'search.placeholder': 'ابحث عن وجهة أو مدينة...',
    'search.noResults': 'لا ت��جد نتائج',
    'search.results': 'نتائج البحث',
    
    // Admin
    'admin.dashboard': 'لوحة التحكم',
    'admin.login': 'تسجيل الدخول',
    'admin.logout': 'تسجيل الخروج',
    'admin.addOffice': 'إضافة مكتب',
    'admin.editOffice': 'تعديل مكتب',
    'admin.deleteOffice': 'حذف مكتب',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'نحن هنا لمساعدتك في ��خطيط رحلتك المثالية',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال الرسالة',
    
    // About
    'about.title': 'من نحن',
    'about.subtitle': 'شركة رائدة في مجال السياحة والسفر',

    // Statistics
    'home.statistics.title': 'أرقامنا تتحدث عن نجاحنا',
    'home.statistics.subtitle': 'نفخر بثقة عملائنا وخبرتنا العريقة في مجال السياحة',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.offices': 'Travel Offices',
    'nav.offers': 'Tour Offers',
    'nav.offers.local': 'Local Tours',
    'nav.offers.international': 'International Tours',
    'nav.offers.all': 'All',
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'offers.filter.local': 'Local offers in your country',
    'offers.filter.international': 'International travel from your country',
    'offers.filter.all': 'All tour offers',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    'nav.services': 'Our Services',
    'nav.admin': 'Admin Dashboard',
    
    // Common
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.readMore': 'Read More',
    'common.bookNow': 'Book Now',
    'common.viewDetails': 'View Details',
    'common.getStarted': 'Get Started',
    'common.learnMore': 'Learn More',
    'common.discover': 'Discover',
    'common.explore': 'Explore',
    'common.days': 'Days',
    'common.hotels': 'Hotels',
    'common.tours': 'Tours',
    'common.reviews': 'Reviews',
    'common.rating': 'Rating',
    'common.description': 'Description',
    'common.highlights': 'Highlights',
    'common.gallery': 'Gallery',
    'common.overview': 'Overview',
    'common.cities': 'Cities',
    'common.culture': 'Culture',
    'common.cuisine': 'Cuisine',
    'common.transportation': 'Transportation',
    'common.safety': 'Safety',
    'common.visaRequired': 'Visa Required',
    'common.noVisaRequired': 'No Visa Required',
    'common.bestTime': 'Best Time to Visit',
    'common.climate': 'Climate',
    'common.language': 'Language',
    'common.currency': 'Currency',
    'common.timezone': 'Timezone',
    'common.capital': 'Capital',
    
    // Homepage
    'hero.title': 'Discover the World with',
    'hero.subtitle': 'Exceptional journeys to the world\'s most beautiful destinations with premium service and competitive prices',
    'hero.cta': 'Discover Your Next Destination',
    'home.hero.welcome': 'Welcome to',
    'home.hero.brand': 'ciar',
    'home.hero.description': 'Your perfect companion to explore the world. We provide top tourism services through an extensive network of offices in more than 50 countries.',
    'home.hero.exploreOffices': 'Explore Travel Offices',
    'home.hero.contactUs': 'Contact Us',

    // Home sections
    'home.offices.title': 'Our Travel Offices',
    'home.offices.subtitle': 'Discover our featured destinations around the world',
    'home.tourism.title.line1': 'Discover the Beauty of the World',
    'home.tourism.title.line2': 'With Us',
    'home.tourism.description': 'From stunning tropical beaches to towering mountain peaks, from ancient historic cities to modern vibrant destinations, we are here to make your trip unforgettable.',
    'home.tourism.countriesStat': 'Countries',
    'home.tourism.happyClientsStat': 'Happy Clients',
    
    // Features
    'features.title': 'Why Choose ciar?',
    'features.expert.title': 'Global Expertise',
    'features.expert.desc': 'Over 15 years in the global tourism industry',
    'features.support.title': '24/7 Support',
    'features.support.desc': 'Specialized support team available around the clock',
    'features.price.title': 'Competitive Prices',
    'features.price.desc': 'Best prices and exclusive offers',
    'features.booking.title': 'Secure Booking',
    'features.booking.desc': 'Safe and guaranteed electronic booking system',
    
    // Countries section
    'countries.title': 'Most Popular Destinations',
    'countries.subtitle': 'Explore the most beautiful countries and tourist destinations around the world',
    
    // Testimonials
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Real experiences from our valued customers',

    // Services
    'services.title': 'Our Premium Services',
    'services.subtitle': 'We provide you with a comprehensive range of travel services to ensure a perfect trip',

    // Newsletter
    'newsletter.title': 'Stay Updated with the Latest Offers',
    'newsletter.subtitle': 'Subscribe to our newsletter and get the best deals and exclusive offers before anyone else',
    'newsletter.placeholder': 'Enter your email address',
    'newsletter.cta': 'Subscribe',

    // Testimonials section heading on home
    'home.testimonials.title': 'Customer Testimonials',
    'home.testimonials.subtitle': 'We are proud of our customers\' trust and their wonderful experiences with us',
    
    // Footer
    'footer.company': 'ciar Tourism & Travel Company',
    'footer.description': 'Your ideal destination for exploring the world with premium tourism services and unforgettable experiences',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Our Services',
    'footer.contact': 'Contact Us',
    'footer.followUs': 'Follow Us',
    'footer.rights': 'All Rights Reserved © 2024 ciar Tourism & Travel Company',
    
    // Search
    'search.placeholder': 'Search for destination or city...',
    'search.noResults': 'No results found',
    'search.results': 'Search Results',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.login': 'Login',
    'admin.logout': 'Logout',
    'admin.addOffice': 'Add Office',
    'admin.editOffice': 'Edit Office',
    'admin.deleteOffice': 'Delete Office',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We\'re here to help you plan your perfect trip',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    
    // About
    'about.title': 'About Us',
    'about.subtitle': 'Leading company in tourism and travel',

    // Statistics
    'home.statistics.title': 'Our Numbers Speak for Our Success',
    'home.statistics.subtitle': 'We take pride in our customers\' trust and our extensive experience in tourism',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.offices': 'Bureaux de Voyage',
    'nav.offers': 'Offres Touristiques',
    'nav.offers.local': 'Circuits Locaux',
    'nav.offers.international': 'Circuits Internationaux',
    'nav.offers.all': 'Tout',
    'theme.light': 'Mode Jour',
    'theme.dark': 'Mode Nuit',
    'offers.filter.local': 'Offres locales dans votre pays',
    'offers.filter.international': 'Voyages internationaux depuis votre pays',
    'offers.filter.all': 'Toutes les offres touristiques',
    'nav.about': 'À Propos',
    'nav.contact': 'Contactez-nous',
    'nav.services': 'Nos Services',
    'nav.admin': 'Tableau de Bord',
    
    // Common
    'common.search': 'Rechercher',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.readMore': 'Lire Plus',
    'common.bookNow': 'Réserver Maintenant',
    'common.viewDetails': 'Voir Détails',
    'common.getStarted': 'Commencer',
    'common.learnMore': 'En Savoir Plus',
    'common.discover': 'Découvrir',
    'common.explore': 'Explorer',
    'common.days': 'Jours',
    'common.hotels': 'Hôtels',
    'common.tours': 'Tours',
    'common.reviews': 'Avis',
    'common.rating': 'Évaluation',
    'common.description': 'Description',
    'common.highlights': 'Points Forts',
    'common.gallery': 'Galerie',
    'common.overview': 'Aperçu',
    'common.cities': 'Villes',
    'common.culture': 'Culture',
    'common.cuisine': 'Cuisine',
    'common.transportation': 'Transport',
    'common.safety': 'Sécurité',
    'common.visaRequired': 'Visa Requis',
    'common.noVisaRequired': 'Pas de Visa Requis',
    'common.bestTime': 'Meilleur Moment pour Visiter',
    'common.climate': 'Climat',
    'common.language': 'Langue',
    'common.currency': 'Devise',
    'common.timezone': 'Fuseau Horaire',
    'common.capital': 'Capitale',
    
    // Homepage
    'hero.title': 'Découvrez le Monde avec',
    'hero.subtitle': 'Voyages exceptionnels vers les plus belles destinations du monde avec un service premium et des prix compétitifs',
    'hero.cta': 'Découvrez Votre Prochaine Destination',
    'home.hero.welcome': 'Bienvenue chez',
    'home.hero.brand': 'ciar',
    'home.hero.description': 'Votre compagnon idéal pour explorer le monde. Nous offrons les meilleurs services touristiques à travers un vaste réseau de bureaux dans plus de 50 pays.',
    'home.hero.exploreOffices': 'Découvrir les Bureaux de Voyage',
    'home.hero.contactUs': 'Nous Contacter',

    // Home sections
    'home.offices.title': 'Nos Bureaux de Voyage',
    'home.offices.subtitle': 'Découvrez nos destinations phares à travers le monde',
    'home.tourism.title.line1': 'Découvrez la Beauté du Monde',
    'home.tourism.title.line2': 'Avec Nous',
    'home.tourism.description': 'Des plages tropicales spectaculaires aux hauts sommets montagneux, des villes historiques anciennes aux destinations modernes et vibrantes, nous sommes là pour rendre votre voyage inoubliable.',
    'home.tourism.countriesStat': 'Pays',
    'home.tourism.happyClientsStat': 'Clients Satisfaits',
    
    // Features
    'features.title': 'Pourquoi Choisir ciar?',
    'features.expert.title': 'Expertise Mondiale',
    'features.expert.desc': 'Plus de 15 ans dans l\'industrie du tourisme mondial',
    'features.support.title': 'Support 24/7',
    'features.support.desc': 'Équipe de support spécialisée disponible 24h/24',
    'features.price.title': 'Prix Compétitifs',
    'features.price.desc': 'Meilleurs prix et offres exclusives',
    'features.booking.title': 'Réservation Sécurisée',
    'features.booking.desc': 'Système de réservation électronique sûr et garanti',
    
    // Countries section
    'countries.title': 'Destinations les Plus Populaires',
    'countries.subtitle': 'Explorez les plus beaux pays et destinations touristiques du monde',
    
    // Testimonials
    'testimonials.title': 'Ce Que Disent Nos Clients',
    'testimonials.subtitle': 'Expériences réelles de nos précieux clients',

    // Services
    'services.title': 'Nos Services Premium',
    'services.subtitle': 'Nous vous offrons une gamme complète de services touristiques pour garantir un voyage parfait',

    // Newsletter
    'newsletter.title': 'Restez Informé des Dernières Offres',
    'newsletter.subtitle': 'Abonnez-vous à notre newsletter et recevez les meilleures offres et promotions exclusives avant tout le monde',
    'newsletter.placeholder': 'Entrez votre adresse e-mail',
    'newsletter.cta': 'S\'abonner',

    // Testimonials section heading on home
    'home.testimonials.title': 'Avis de Nos Clients',
    'home.testimonials.subtitle': 'Nous sommes fiers de la confiance de nos clients et de leurs merveilleuses expériences avec nous',
    
    // Footer
    'footer.company': 'Compagnie de Tourisme et Voyage ciar',
    'footer.description': 'Votre destination idéale pour explorer le monde avec des services touristiques premium et des expériences inoubliables',
    'footer.quickLinks': 'Liens Rapides',
    'footer.services': 'Nos Services',
    'footer.contact': 'Nous Contacter',
    'footer.followUs': 'Suivez-Nous',
    'footer.rights': 'Tous Droits Réservés © 2024 Compagnie de Tourisme et Voyage ciar',
    
    // Search
    'search.placeholder': 'Rechercher une destination ou ville...',
    'search.noResults': 'Aucun résultat trouvé',
    'search.results': 'Résultats de Recherche',
    
    // Admin
    'admin.dashboard': 'Tableau de Bord',
    'admin.login': 'Connexion',
    'admin.logout': 'Déconnexion',
    'admin.addOffice': 'Ajouter Bureau',
    'admin.editOffice': 'Modifier Bureau',
    'admin.deleteOffice': 'Supprimer Bureau',
    
    // Contact
    'contact.title': 'Contactez-Nous',
    'contact.subtitle': 'Nous sommes là pour vous aider à planifier votre voyage parfait',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Envoyer Message',
    
    // About
    'about.title': 'À Propos de Nous',
    'about.subtitle': 'Entreprise leader dans le tourisme et le voyage',

    // Statistics
    'home.statistics.title': 'Nos Chiffres Parlent de Notre Succès',
    'home.statistics.subtitle': 'Nous sommes fiers de la confiance de nos clients et de notre vaste expérience en tourisme',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Set RTL/LTR direction and language on document
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Store language preference
    localStorage.setItem('ciar-language', language);
  }, [language]);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('ciar-language') as Language;
    if (savedLanguage && ['ar', 'en', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string, defaultText?: string): string => {
    const translation = translations[language]?.[key];
    return translation || defaultText || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        isRTL 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
