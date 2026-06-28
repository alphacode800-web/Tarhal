import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Globe, Phone, Mail, Settings, DollarSign, ChevronDown } from 'lucide-react';
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
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', key: 'nav.home', icon: undefined },
    { href: '/offices', key: 'nav.offices', icon: undefined },
    { href: '/offers', key: 'nav.offers', icon: undefined },
    { href: '/about', key: 'nav.about', icon: undefined },
    { href: '/contact', key: 'nav.contact', icon: undefined },
    // { href: '/admin', key: 'nav.admin', icon: Settings },
  ];

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
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/20 backdrop-blur-md shadow-lg border-b border-tarhal-gray-light' 
        : 'bg-transparent border-b border-tarhal-gray-light'
    }`}>
      {/* Top Bar */}
      {/* <div className="bg-tarhal-navy text-white py-2 px-4 text-sm hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+249 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>info@ciar.com</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe size={14} />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="bg-transparent border-none text-white text-sm focus:outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-tarhal-navy">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="h-24 w-auto flex items-center">
              <img
                src="/1000104922.png"
                alt="شعار ciar"
                className="h-24 w-auto object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)] group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-medium transition-colors duration-300 flex items-center gap-2 ${
                  location.pathname === link.href || (link.href === '/admin' && location.pathname.startsWith('/admin'))
                    ? 'text-tarhal-orange'
                    : isScrolled ? 'text-tarhal-blue-dark hover:text-tarhal-orange' : 'text-white hover:text-tarhal-orange'
                }`}
              >
                {link.icon && <link.icon size={16} />}
                {t(link.key)}
                {(location.pathname === link.href || (link.href === '/admin' && location.pathname.startsWith('/admin'))) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-tarhal-orange animate-scale-in"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Search & Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 ${isScrolled ? 'text-tarhal-blue-dark hover:text-tarhal-orange' : 'text-white hover:text-tarhal-orange'} transition-all duration-300 hover:scale-110`}
            >
              <Search size={20} />
            </Button>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 py-2 rounded-full border ${isScrolled ? 'border-tarhal-blue-dark text-tarhal-blue-dark hover:bg-tarhal-blue-dark hover:text-white' : 'border-white/60 text-white hover:bg-white hover:text-tarhal-blue-dark'} transition-all duration-300 text-xs font-semibold flex items-center gap-1`}
                onClick={() => {
                  setIsServicesMenuOpen((prev) => !prev);
                  setIsLanguageMenuOpen(false);
                  setIsCurrencyMenuOpen(false);
                }}
              >
                <span>{getLocalizedText('خدماتنا', 'Services', 'Services')}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
              </Button>
              {isServicesMenuOpen && (
                <div className="absolute right-0 mt-2 min-w-[250px] max-h-[400px] overflow-y-auto rounded-md bg-white shadow-lg border border-gray-200 py-2 z-50">
                  {services.map((service, index) => {
                    const content = (
                      <div className="w-full px-4 py-3 text-sm flex items-center gap-3 text-left hover:bg-tarhal-orange/10 hover:text-tarhal-orange transition-colors text-gray-700">
                        <span className="text-lg">{service.icon}</span>
                        <span className="font-medium">{getLocalizedText(service.label, service.labelEn, service.labelFr)}</span>
                      </div>
                    );
                    
                    return service.href && service.href !== '#' ? (
                      <Link
                        key={index}
                        to={service.href}
                        onClick={() => setIsServicesMenuOpen(false)}
                      >
                        {content}
                      </Link>
                    ) : (
                      <a
                        key={index}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsServicesMenuOpen(false);
                        }}
                      >
                        {content}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Currency Dropdown */}
            <div className="relative" ref={currencyMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 py-2 rounded-full border ${isScrolled ? 'border-tarhal-blue-dark text-tarhal-blue-dark hover:bg-tarhal-blue-dark hover:text-white' : 'border-white/60 text-white hover:bg-white hover:text-tarhal-blue-dark'} transition-all duration-300 text-xs font-semibold flex items-center gap-1`}
                onClick={() => {
                  setIsCurrencyMenuOpen((prev) => !prev);
                  setIsLanguageMenuOpen(false);
                  setIsServicesMenuOpen(false);
                }}
              >
                <DollarSign size={14} />
                <span>{currency}</span>
              </Button>
              {isCurrencyMenuOpen && (
                <div className="absolute right-0 mt-2 min-w-[200px] max-h-[400px] overflow-y-auto rounded-md bg-white shadow-lg border border-gray-200 py-1 z-50">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      className={`w-full px-3 py-2 text-sm flex items-center gap-2 text-left hover:bg-gray-100 ${
                        currency === curr.code ? 'font-semibold text-tarhal-blue-dark bg-tarhal-orange/10' : 'text-gray-700'
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
                  setIsServicesMenuOpen(false);
                }}
              >
                <span>{languages.find((l) => l.code === language)?.flag}</span>
                <span>{language.toUpperCase()}</span>
              </Button>
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 min-w-[140px] rounded-md bg-white shadow-lg border border-gray-200 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`w-full px-3 py-1.5 text-sm flex items-center gap-2 text-left hover:bg-gray-100 ${
                        language === lang.code ? 'font-semibold text-tarhal-blue-dark' : 'text-gray-700'
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
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-tarhal-gray-light transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-tarhal-blue-dark hover:text-tarhal-orange font-medium py-2 border-b border-tarhal-gray-light transition-all duration-300 animate-slide-in-left flex items-center gap-2`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.icon && <link.icon size={16} />}
                  {t(link.key)}
                </Link>
              ))}
              
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
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Announcement Bar - Below Navigation */}
      <AnnouncementBar />
    </header>
  );
}
