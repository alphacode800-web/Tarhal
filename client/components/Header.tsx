import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Globe, DollarSign, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import SearchModal from './SearchModal';
import AnnouncementBar from './AnnouncementBar';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useCurrency, Currency, currencies } from '../contexts/CurrencyContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isOffersMenuOpen, setIsOffersMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [themeMounted, setThemeMounted] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const offersMenuRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setThemeMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const offersMenuItems = [
    { href: '/offers?type=local', key: 'nav.offers.local' },
    { href: '/offers?type=international', key: 'nav.offers.international' },
    { href: '/offers?type=all', key: 'nav.offers.all' },
  ];

  const navLinkClass = (active: boolean) =>
    `relative font-medium transition-colors duration-300 flex items-center gap-1 ${
      active
        ? 'text-tarhal-orange'
        : isScrolled
          ? 'text-tarhal-blue-dark hover:text-tarhal-orange dark:text-white'
          : 'text-white hover:text-tarhal-orange'
    }`;

  const renderServicesMenu = (onNavigate?: () => void) => (
    <div className="rounded-md bg-white dark:bg-slate-900 shadow-lg border border-gray-200 dark:border-slate-700 py-2 min-w-[250px] max-h-[400px] overflow-y-auto">
      {services.map((service, index) => {
        const content = (
          <div className="w-full px-4 py-3 text-sm flex items-center gap-3 text-left hover:bg-tarhal-orange/10 hover:text-tarhal-orange transition-colors text-gray-700 dark:text-gray-200">
            <span className="text-lg">{service.icon}</span>
            <span className="font-medium">{getLocalizedText(service.label, service.labelEn, service.labelFr)}</span>
          </div>
        );

        return service.href && service.href !== '#' ? (
          <Link key={index} to={service.href} onClick={onNavigate}>
            {content}
          </Link>
        ) : (
          <a
            key={index}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.();
            }}
          >
            {content}
          </a>
        );
      })}
    </div>
  );

  const languages = [
    { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  ];

  const services = [
    { label: 'حجز الفنادق', labelEn: 'Hotel Booking', labelFr: 'Réservation d\'Hôtels', icon: '🏨', href: '/hotels' },
    { label: 'استئجار السيارات', labelEn: 'Car Rental', labelFr: 'Location de Voiture', icon: '🚗', href: '/car-rentals' },
    { label: 'تذاكر الطيران', labelEn: 'Flight Tickets', labelFr: 'Billets d\'Avion', icon: '✈️', href: '/flight-tickets' },
    { label: 'تأشيرات السفر', labelEn: 'Travel Visas', labelFr: 'Visas de Voyage', icon: '📋', href: '/travel-visa' },
    { label: 'التأمين السياحي', labelEn: 'Travel Insurance', labelFr: 'Assurance Voyage', icon: '🛡️', href: '/travel-insurance' },
    { label: 'تاكسي وديليفري', labelEn: 'Taxi & Delivery', labelFr: 'Taxi et Livraison', icon: '🚕', href: '/taxi-delivery' },
    { label: 'جولات سياحية', labelEn: 'Tourist Tours', labelFr: 'Circuits Touristiques', icon: '🗺️', href: '/offers' },
  ];

  const getLocalizedText = (ar: string, en: string, fr: string) => {
    if (language === 'ar') return ar;
    if (language === 'fr') return fr;
    return en;
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handleCurrencyChange = (currencyCode: Currency) => {
    setCurrency(currencyCode);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setIsCurrencyMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
      if (offersMenuRef.current && !offersMenuRef.current.contains(event.target as Node)) {
        setIsOffersMenuOpen(false);
      }
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex flex-col gap-0 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-tarhal-gray-light dark:border-slate-800' 
        : 'bg-transparent'
    }`}>
      {/* Main Navigation */}
      <nav className={`relative w-full border-b ${
        isScrolled
          ? 'border-transparent'
          : 'border-white/10 dark:border-slate-800/40'
      }`}>
        <div className="container mx-auto px-4 py-2 md:py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="flex flex-col leading-none transition-all duration-300 group-hover:scale-[1.03]">
              <span className="logo-ciar text-2xl md:text-3xl">
                CIAR
              </span>
              <span
                className={`logo-tourism text-[9px] md:text-[10px] font-light uppercase mt-0.5 ${
                  isScrolled
                    ? 'text-tarhal-blue-dark dark:text-white/85'
                    : 'text-white/85'
                }`}
              >
                Tourism
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className={navLinkClass(location.pathname === '/')}>
              {t('nav.home')}
              {location.pathname === '/' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-tarhal-orange animate-scale-in" />
              )}
            </Link>

            <Link to="/offices" className={navLinkClass(location.pathname === '/offices' || location.pathname.startsWith('/offices/'))}>
              {t('nav.offices')}
              {(location.pathname === '/offices' || location.pathname.startsWith('/offices/')) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-tarhal-orange animate-scale-in" />
              )}
            </Link>

            {/* Offers Dropdown */}
            <div
              className="relative"
              ref={offersMenuRef}
              onMouseEnter={() => setIsOffersMenuOpen(true)}
              onMouseLeave={() => setIsOffersMenuOpen(false)}
            >
              <Link to="/offers?type=all" className={navLinkClass(location.pathname === '/offers')}>
                {t('nav.offers')}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOffersMenuOpen ? 'rotate-180' : ''}`} />
                {location.pathname === '/offers' && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-tarhal-orange animate-scale-in" />
                )}
              </Link>
              {isOffersMenuOpen && (
                <div className="absolute top-full right-0 pt-2 min-w-[220px] z-50">
                  <div className="rounded-md bg-white dark:bg-slate-900 shadow-lg border border-gray-200 dark:border-slate-700 py-2">
                    {offersMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOffersMenuOpen(false)}
                        className="block w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-tarhal-orange/10 hover:text-tarhal-orange transition-colors"
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              ref={servicesMenuRef}
              onMouseEnter={() => setIsServicesMenuOpen(true)}
              onMouseLeave={() => setIsServicesMenuOpen(false)}
            >
              <Link
                to="/#services"
                className={navLinkClass(location.pathname === '/' && location.hash === '#services')}
              >
                {t('nav.services')}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
              </Link>
              {isServicesMenuOpen && (
                <div className="absolute top-full right-0 pt-2 z-50">
                  {renderServicesMenu(() => setIsServicesMenuOpen(false))}
                </div>
              )}
            </div>

            <Link to="/contact" className={navLinkClass(location.pathname === '/contact')}>
              {t('nav.contact')}
              {location.pathname === '/contact' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-tarhal-orange animate-scale-in" />
              )}
            </Link>

            <Link to="/about" className={navLinkClass(location.pathname === '/about')}>
              {t('nav.about')}
              {location.pathname === '/about' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-tarhal-orange animate-scale-in" />
              )}
            </Link>
          </div>

          {/* Search & Menu */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {themeMounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                title={isDark ? t('theme.light') : t('theme.dark')}
                className={`p-2 ${isScrolled ? 'text-tarhal-blue-dark hover:text-tarhal-orange dark:text-white' : 'text-white hover:text-tarhal-orange'} transition-all duration-300 hover:scale-110`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 ${isScrolled ? 'text-tarhal-blue-dark hover:text-tarhal-orange dark:text-white' : 'text-white hover:text-tarhal-orange'} transition-all duration-300 hover:scale-110`}
            >
              <Search size={20} />
            </Button>

            {/* Currency Dropdown */}
            <div className="relative" ref={currencyMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 py-2 rounded-full border ${isScrolled ? 'border-tarhal-blue-dark text-tarhal-blue-dark hover:bg-tarhal-blue-dark hover:text-white' : 'border-white/60 text-white hover:bg-white hover:text-tarhal-blue-dark'} transition-all duration-300 text-xs font-semibold flex items-center gap-1`}
                onClick={() => {
                  setIsCurrencyMenuOpen((prev) => !prev);
                  setIsLanguageMenuOpen(false);
                }}
              >
                <DollarSign size={14} />
                <span>{currency}</span>
              </Button>
              {isCurrencyMenuOpen && (
                <div className="absolute right-0 mt-2 min-w-[200px] max-h-[400px] overflow-y-auto rounded-md bg-white dark:bg-slate-900 shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      className={`w-full px-3 py-2 text-sm flex items-center gap-2 text-left hover:bg-gray-100 dark:hover:bg-slate-800 ${
                        currency === curr.code ? 'font-semibold text-tarhal-blue-dark bg-tarhal-orange/10' : 'text-gray-700 dark:text-gray-200'
                      }`}
                      onClick={() => {
                        handleCurrencyChange(curr.code);
                        setIsCurrencyMenuOpen(false);
                      }}
                    >
                      <span className="text-lg">{curr.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium">{curr.name[language]}</div> 
                        <div className="text-xs text-gray-500">{curr.code} - {curr.symbol}</div>
                      </div>
                      {currency === curr.code && (
                        <span className="text-tarhal-orange">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Dropdown (beside currency) */}
            <div className="relative" ref={languageMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 py-2 rounded-full border ${isScrolled ? 'border-tarhal-blue-dark text-tarhal-blue-dark hover:bg-tarhal-blue-dark hover:text-white' : 'border-white/60 text-white hover:bg-white hover:text-tarhal-blue-dark'} transition-all duration-300 text-xs font-semibold flex items-center gap-1`}
                onClick={() => {
                  setIsLanguageMenuOpen((prev) => !prev);
                  setIsCurrencyMenuOpen(false);
                }}
              >
                <span>{languages.find((l) => l.code === language)?.flag}</span>
                <span>{language.toUpperCase()}</span>
              </Button>
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 min-w-[140px] rounded-md bg-white dark:bg-slate-900 shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`w-full px-3 py-1.5 text-sm flex items-center gap-2 text-left hover:bg-gray-100 dark:hover:bg-slate-800 ${
                        language === lang.code ? 'font-semibold text-tarhal-blue-dark' : 'text-gray-700 dark:text-gray-200'
                      }`}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setIsLanguageMenuOpen(false);
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden p-2 ${isScrolled ? 'text-tarhal-blue-dark' : 'text-white'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b border-tarhal-gray-light dark:border-slate-800 transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-[32rem] opacity-100 bg-white/95 dark:bg-slate-950/95 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-tarhal-blue-dark dark:text-white hover:text-tarhal-orange font-medium py-2 border-b border-tarhal-gray-light">
                {t('nav.home')}
              </Link>
              <Link to="/offices" onClick={() => setIsMenuOpen(false)} className="text-tarhal-blue-dark dark:text-white hover:text-tarhal-orange font-medium py-2 border-b border-tarhal-gray-light">
                {t('nav.offices')}
              </Link>

              {/* Mobile Offers Submenu */}
              <div className="border-b border-tarhal-gray-light pb-2">
                <p className="text-tarhal-blue-dark dark:text-white font-medium py-2">{t('nav.offers')}</p>
                <div className="flex flex-col gap-1 pr-4">
                  {offersMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm text-tarhal-gray-dark dark:text-gray-300 hover:text-tarhal-orange py-1.5"
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Services Submenu */}
              <div className="border-b border-tarhal-gray-light pb-2">
                <Link to="/#services" onClick={() => setIsMenuOpen(false)} className="text-tarhal-blue-dark dark:text-white hover:text-tarhal-orange font-medium py-2 block">
                  {t('nav.services')}
                </Link>
                <div className="flex flex-col gap-1 pr-4 mt-1">
                  {services.map((service, index) => (
                    <Link
                      key={index}
                      to={service.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm text-tarhal-gray-dark dark:text-gray-300 hover:text-tarhal-orange py-1.5 flex items-center gap-2"
                    >
                      <span>{service.icon}</span>
                      {getLocalizedText(service.label, service.labelEn, service.labelFr)}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-tarhal-blue-dark dark:text-white hover:text-tarhal-orange font-medium py-2 border-b border-tarhal-gray-light">
                {t('nav.contact')}
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-tarhal-blue-dark dark:text-white hover:text-tarhal-orange font-medium py-2 border-b border-tarhal-gray-light">
                {t('nav.about')}
              </Link>
              
              {/* Mobile Theme Toggle */}
              <div className="pt-4 border-t border-tarhal-gray-light">
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="flex items-center gap-2 text-tarhal-blue-dark dark:text-white text-sm font-medium"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{isDark ? t('theme.light') : t('theme.dark')}</span>
                </button>
              </div>

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-tarhal-gray-light">
                <div className="flex items-center gap-2 text-tarhal-blue-dark">
                  <Globe size={16} />
                  <span className="text-sm font-medium">{t('common.language')} / Language</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        language === lang.code
                          ? 'bg-tarhal-orange text-white'
                          : 'bg-tarhal-gray-light text-tarhal-blue-dark'
                      }`}
                    >
                      {lang.flag} {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </nav>

      {/* Announcement Bar — flush under navigation */}
      <AnnouncementBar />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
