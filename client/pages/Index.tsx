import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Star, Globe, Users, Award, Shield, MapPin, Mail, Phone, Send, Lock, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { getAllCountriesWithDynamic, getCountryName, getCountryDescription, syncStaticWithDynamic, convertAdminToCountryData } from '@/data/countries';
import { useLanguage } from '@/contexts/LanguageContext';
import { dataManager } from '@/services/dataManager';
import { detectUserCountry, mapCountryCodeToId } from '@/services/geoLocation';
import { optimizeImageUrl, preloadImage } from '@/utils/imageUtils';
import OptimizedImage from '@/components/OptimizedImage';
import GoogleMap from '@/components/GoogleMap';
import { resolveOfficeCoordinates } from '@/data/countryCoordinates';
import { fetchVisitorCount } from '@/services/visitorStats';
import {
  heroButtonStyleToCss,
  heroTextStyleToCss,
  normalizeHeroTypography,
} from '@/data/heroTypography';

export default function Index() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tourismImageIndex, setTourismImageIndex] = useState(0);
  const { language, t } = useLanguage();
  const [countries, setCountries] = useState(getAllCountriesWithDynamic());
  const [heroContent, setHeroContent] = useState(dataManager.getHeroContent());
  const [detectedCountryId, setDetectedCountryId] = useState<string | null>(null);
  const [officeMapMarkers, setOfficeMapMarkers] = useState<Array<{
    position: { lat: number; lng: number };
    title: string;
    info: string;
  }>>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 24, lng: 45 });
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#services') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  useEffect(() => {
    const mergeCountries = (dynamicCountries: Awaited<ReturnType<typeof dataManager.getCountriesAsync>>) => {
      const staticCountries = getAllCountriesWithDynamic();
      const staticById = new Map(staticCountries.map((c) => [c.id, c]));
      const staticByName = new Map(
        staticCountries.map((c) => [(c.name.en || c.name.ar || '').trim().toLowerCase(), c])
      );
      const countriesMap = new Map<string, ReturnType<typeof getAllCountriesWithDynamic>[number]>();

      staticCountries.forEach((c) => countriesMap.set(c.id, c));
      dynamicCountries.forEach((adminCountry) => {
        if (adminCountry.isActive === false) return;
        const dynamic = convertAdminToCountryData(adminCountry);
        const nameKey = (adminCountry.name.en || adminCountry.name.ar || '').trim().toLowerCase();
        const staticMatch =
          staticById.get(adminCountry.id) ||
          staticByName.get(nameKey);
        const targetId = staticMatch?.id ?? adminCountry.id;
        const base = countriesMap.get(targetId) ?? staticMatch ?? dynamic;

        countriesMap.set(targetId, {
          ...base,
          ...dynamic,
          id: targetId,
          mainImage: dynamic.mainImage?.trim() || staticMatch?.mainImage || base.mainImage || '',
          gallery: dynamic.gallery?.length ? dynamic.gallery : staticMatch?.gallery ?? base.gallery ?? [],
          flag: staticMatch?.flag ?? base.flag ?? dynamic.flag,
        });

        if (staticMatch && adminCountry.id !== targetId) {
          countriesMap.delete(adminCountry.id);
        }
      });

      setCountries(Array.from(countriesMap.values()));
    };

    // مزامنة خلفية — لا تُعطّل عرض الصفحة
    syncStaticWithDynamic().catch((error) => {
      console.error('[Index] Error syncing static data:', error);
    });

    dataManager.getCountriesAsync()
      .then(mergeCountries)
      .catch((error) => {
        console.error('[Index] Error loading countries:', error);
      });

    dataManager.getHeroContentAsync()
      .then((content) => {
        if (content?.headerImages?.length) {
          setHeroContent(content);
        }
      })
      .catch((error) => {
        console.error('[Index] Error loading hero content:', error);
      });

    detectUserCountry()
      .then((geoData) => {
        if (!geoData) return;
        const countryId = mapCountryCodeToId(geoData.country);
        if (countryId) setDetectedCountryId(countryId);
      })
      .catch((error) => {
        console.error('[Index] Error detecting country:', error);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadVisitorCount = () => {
      fetchVisitorCount().then((count) => {
        if (!cancelled) setVisitorCount(count);
      });
    };
    loadVisitorCount();
    const timer = setTimeout(loadVisitorCount, 800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    dataManager.getOfficesAsync()
      .then((offices) => {
        const activeOffices = offices.filter((office) => office.isActive !== false);
        const markers = activeOffices.map((office) => {
          const position = resolveOfficeCoordinates(office.countryId, office.coordinates);
          const title = office.name[language] || office.name.ar;
          const info = office.address[language] || office.address.ar;
          return { position, title, info };
        });

        const finalMarkers = markers.length > 0 ? markers : [{
          position: resolveOfficeCoordinates('sudan'),
          title: language === 'ar' ? 'مكتب الخرطوم' : 'Khartoum Office',
          info: language === 'ar' ? 'الخرطوم، السودان' : 'Khartoum, Sudan',
        }];

        setOfficeMapMarkers(finalMarkers);
        const avgLat = finalMarkers.reduce((sum, m) => sum + m.position.lat, 0) / finalMarkers.length;
        const avgLng = finalMarkers.reduce((sum, m) => sum + m.position.lng, 0) / finalMarkers.length;
        setMapCenter({ lat: avgLat, lng: avgLng });
      })
      .catch((error) => {
        console.error('[Index] Error loading offices for map:', error);
      });
  }, [language]);

  // Update image index when images change
  useEffect(() => {
    if (heroContent.headerImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroContent.headerImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [heroContent.headerImages]);

  const headerImages = heroContent.headerImages.length > 0 
    ? heroContent.headerImages 
    : [
        'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/5117917/pexels-photo-5117917.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/4669408/pexels-photo-4669408.jpeg?auto=compress&cs=tinysrgb&w=1920',
      ];

  const heroTypography = normalizeHeroTypography(heroContent.typography);

  const tourismImages = [
    'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/4669408/pexels-photo-4669408.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/33388483/pexels-photo-33388483.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  const heroSlideIndices = headerImages.length <= 1
    ? [0]
    : [
        currentImageIndex,
        (currentImageIndex + 1) % headerImages.length,
      ];

  useEffect(() => {
    preloadImage(headerImages[0]);
  }, [headerImages[0]]);

  useEffect(() => {
    const nextIndex = (currentImageIndex + 1) % headerImages.length;
    preloadImage(headerImages[nextIndex]);
  }, [currentImageIndex, headerImages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTourismImageIndex((prev) => (prev + 1) % tourismImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Globe,
      title: '50+ مكتب حول العالم',
      description: 'شبكة واسعة من المكاتب السياحية في أكثر من 50 دولة'
    },
    {
      icon: Users,
      title: 'فريق محترف',
      description: 'خبراء سياحة معتمدون لخدمتكم على مدار الساعة'
    },
    {
      icon: Award,
      title: 'جودة عالية',
      description: 'أفضل الخدمات السياحية بمعايير عالمية'
    },
    {
      icon: Shield,
      title: 'أمان وثقة',
      description: 'حماية كاملة لرحلاتكم وحجوزاتكم'
    }
  ];

  const aboutCards = [
    {
      front: {
        title: 'رؤيتنا',
        icon: '@',
        description: 'أن نكون الشركة الرائدة في مجال السياحة'
      },
      back: {
        content: 'نسعى لأن نكون الخيار الأول للمسافرين حول العالم من خلال تقديم خدمات استثنائية وتجارب لا تُنسى في كل رحلة.'
      }
    },
    {
      front: {
        title: 'مهمتنا',
        icon: '🎯',
        description: 'تقديم أفضل الخدمات السياحية'
      },
      back: {
        content: 'نقدم حلول سياحية متكاملة تشمل الحجوزات والإرشاد والدعم لضمان حصول عملائنا على تجربة سفر مثالية.'
      }
    },
    {
      front: {
        title: 'قيمنا',
        icon: '💎',
        description: 'الجودة والمصداقية والاحترافية'
      },
      back: {
        content: 'نؤمن بالشفافية والصدق في التعامل مع عملائنا، ونلتزم بأعلى معايير الجودة في جميع خدماتنا.'
      }
    }
  ];

  // Use actual countries data - prioritize detected country
  const displayedCountries = (() => {
    const allCountries = [...countries];
    
    // إذا تم اكتشاف دولة، ضعها في المقدمة
    if (detectedCountryId) {
      const detectedIndex = allCountries.findIndex(c => c.id === detectedCountryId);
      if (detectedIndex > -1) {
        const detectedCountry = allCountries.splice(detectedIndex, 1)[0];
        return [detectedCountry, ...allCountries.slice(0, 11)];
      }
    }
    
    // إذا لم يتم اكتشاف دولة، اعرض أول 12 دولة
    return allCountries.slice(0, 12);
  })();

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative h-[75vh] overflow-hidden pt-28 md:pt-32">
        {/* Background Images */}
        <div className="absolute inset-0 bg-slate-900">
          {heroSlideIndices.map((index) => (
            <img
              key={index}
              src={optimizeImageUrl(headerImages[index], 1920)}
              alt=""
              aria-hidden
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${heroTypography.overlay.fromColor}, ${heroTypography.overlay.viaColor}, ${heroTypography.overlay.toColor})`,
              opacity: heroTypography.overlay.opacity / 100,
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl animate-fade-in">
              <h1
                className="mb-3 animate-slide-up"
                style={heroTextStyleToCss(heroTypography.heroTitle)}
              >
                {heroContent.heroTitle[language]}
              </h1>
              {heroTypography.useBrandSplit ? (
                <p className="mb-5 leading-none animate-slide-up" style={{ animationDelay: '150ms' }}>
                  <span style={heroTextStyleToCss(heroTypography.heroBrandPrimary)}>
                    {heroContent.heroBrandPrimary?.[language] || 'ciar'}
                  </span>
                  <span className="ml-1" style={heroTextStyleToCss(heroTypography.heroBrandSecondary)}>
                    {heroContent.heroBrandSecondary?.[language] || 'TOU'}
                  </span>
                </p>
              ) : (
                <p
                  className="mb-5 animate-slide-up"
                  style={{ ...heroTextStyleToCss(heroTypography.heroSubtitle), animationDelay: '150ms' }}
                >
                  {heroContent.heroSubtitle[language]}
                </p>
              )}
              <p
                className="mb-8 max-w-2xl animate-slide-up"
                style={{ ...heroTextStyleToCss(heroTypography.heroDescription), animationDelay: '300ms' }}
              >
                {heroContent.heroDescription[language]}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '450ms' }}>
                <Link to="/offices">
                  <Button
                    className="px-6 py-3 md:px-8 md:py-4 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    style={heroButtonStyleToCss(heroTypography.primaryButton)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = heroTypography.primaryButton.hoverBackgroundColor;
                      e.currentTarget.style.color = heroTypography.primaryButton.hoverTextColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = heroTypography.primaryButton.backgroundColor;
                      e.currentTarget.style.color = heroTypography.primaryButton.color;
                    }}
                  >
                    {heroContent.primaryButtonText[language]}
                    <ArrowRight className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="px-6 py-3 md:px-8 md:py-4 transition-all duration-300"
                    style={heroButtonStyleToCss(heroTypography.secondaryButton)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = heroTypography.secondaryButton.hoverBackgroundColor;
                      e.currentTarget.style.color = heroTypography.secondaryButton.hoverTextColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = heroTypography.secondaryButton.backgroundColor;
                      e.currentTarget.style.color = heroTypography.secondaryButton.color;
                    }}
                  >
                    {heroContent.secondaryButtonText[language]}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div> */}
      </section>

      {/* Travel Offices Slider Section – مباشرة بعد الهيدر */}
      <section className="py-20 bg-gradient-to-br from-tarhal-navy to-tarhal-blue-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              مكاتبنا السياحية
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
              اكتشف وجهاتنا المميزة حول العالم
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {displayedCountries.map((country, index) => {
              const isDetectedCountry = detectedCountryId === country.id;
              return (
              <Link
                key={country.id}
                to={`/offices/${country.id}`}
                className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-scale-in block ${
                  isDetectedCountry ? 'ring-4 ring-tarhal-orange ring-offset-2' : ''
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage
                    src={country.mainImage}
                    alt={getCountryName(country, language)}
                    width={480}
                    priority={index < 5}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  {isDetectedCountry && (
                    <div className="absolute top-2 right-2 bg-tarhal-orange text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse z-10">
                      {language === 'ar' ? '📍 موقعك' : language === 'en' ? '📍 Your Location' : '📍 Votre Emplacement'}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-tarhal-orange text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {country.totalTours} {t('common.tours')}
                  </div>
                  <div className="absolute top-4 left-4 text-3xl">
                    {country.flag}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-tarhal-blue-dark mb-2">
                    {getCountryName(country, language)}
                    {isDetectedCountry && (
                      <span className="ml-2 text-tarhal-orange text-sm">
                        {language === 'ar' ? '📍' : '📍'}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-tarhal-gray-dark font-semibold">
                      {country.rating}
                    </span>
                  </div>
                </div>
              </Link>
            )})}
          </div>

          <div className="text-center">
            <Link to="/offices">
              <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                عرض جميع المكاتب
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tourism Images Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Images Stack */}
            <div className="relative">
              <div className="relative w-full h-96 overflow-hidden rounded-2xl shadow-2xl bg-slate-200">
                {[tourismImageIndex, (tourismImageIndex + 1) % tourismImages.length].map((index) => (
                  <img
                    key={index}
                    src={optimizeImageUrl(tourismImages[index], 1200)}
                    alt=""
                    aria-hidden
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 transform ${
                      index === tourismImageIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                    }`}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-full flex items-center justify-center shadow-lg animate-float">
                <span className="text-white text-4xl">✈️</span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 animate-slide-in-right">
              <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark leading-tight">
                اكتشف جمال العالم
                <span className="block text-tarhal-orange">معنا</span>
              </h2>
              <p className="text-lg text-tarhal-gray-dark leading-relaxed">
                من الشواطئ الاستوائية الخلابة إلى القمم الجبلية الشاهقة، ومن المدن التاريخية العريقة إلى الوجهات العصرية المذهلة. 
                نحن هنا لنجعل رحلتك تجربة لا تُنسى مليئة بالمغامرات والذكريات الجميلة.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-tarhal-orange">50+</div>
                  <div className="text-tarhal-gray-dark">دولة</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-tarhal-blue">1000+</div>
                  <div className="text-tarhal-gray-dark">عميل سعيد</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-tarhal-blue-dark to-tarhal-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              لماذا تختار ciar؟
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
              نقدم لكم أفضل الخدمات السياحية بمعايير عالمية واحترافية عالية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-scale-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us Cards Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              معلومات عنا
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              تعرف على قيمنا ومهمتنا في خدمة عملائنا الكرام
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {aboutCards.map((card, index) => (
              <div
                key={index}
                className="group perspective-1000 h-64 animate-rotate-in"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-tarhal-blue to-tarhal-blue-dark rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-xl">
                    <div className="text-4xl mb-4">{card.front.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{card.front.title}</h3>
                    <p className="text-center text-white/80">{card.front.description}</p>
                  </div>
                  
                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-2xl p-6 flex items-center justify-center text-white shadow-xl">
                    <p className="text-center text-lg leading-relaxed">{card.back.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/about">
              <Button className="bg-tarhal-blue hover:bg-tarhal-blue-dark text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                اعرف المزيد عنا
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Offices Slider Section */}
      {/* <section className="py-20 bg-gradient-to-br from-tarhal-navy to-tarhal-blue-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              مكاتبنا السياحية
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
              اكتشف وجهاتنا المميزة حول العالم
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {displayedCountries.map((country, index) => (
              <Link
                key={country.id}
                to={`/offices/${country.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-scale-in block"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={country.mainImage}
                    alt={getCountryName(country, language)}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-tarhal-orange text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {country.totalTours} {t('common.tours')}
                  </div>
                  <div className="absolute top-4 left-4 text-3xl">
                    {country.flag}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-tarhal-blue-dark mb-2">{getCountryName(country, language)}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-tarhal-gray-dark font-semibold">{country.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/offices">
              <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                عرض جميع المكاتب
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/25 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 right-1/3 w-8 h-8 border border-white/15 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              {t('home.statistics.title') || 'أرقامنا تتحدث عن نجاحنا'}
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-medium max-w-3xl mx-auto animate-slide-up">
              {t('home.statistics.subtitle') || 'نفخر بثقة عملائنا وخبرتنا العريقة في مجال السياحة'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Users className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-scale-in drop-shadow-sm">50,000+</div>
              <div className="text-base md:text-lg font-semibold text-white/90">{t('home.statistics.happyCustomers')}</div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Globe className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-scale-in drop-shadow-sm">{countries.length}</div>
              <div className="text-base md:text-lg font-semibold text-white/90">{t('home.statistics.destinations')}</div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Award className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-scale-in drop-shadow-sm">15</div>
              <div className="text-base md:text-lg font-semibold text-white/90">{t('home.statistics.yearsExperience')}</div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Star className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-scale-in drop-shadow-sm">4.9</div>
              <div className="text-base md:text-lg font-semibold text-white/90">{t('home.statistics.rating')}</div>
            </div>

            <div className="text-center group col-span-2 sm:col-span-1">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Eye className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 animate-scale-in drop-shadow-sm">
                {visitorCount !== null
                  ? visitorCount.toLocaleString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US')
                  : '—'}
              </div>
              <div className="text-base md:text-lg font-semibold text-white/90">{t('home.statistics.visitors')}</div>
            </div>
          </div>
        </div>
      </section> 

      {/* Featured Destinations */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              الوجهات المميزة
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              اكتشف أجمل الوجهات السياحية التي نوصي بها لرحلة لا تُنسى
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.slice(0, 6).map((country, index) => (
              <div key={country.id} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative h-80 overflow-hidden">
                  <OptimizedImage
                    src={country.mainImage}
                    alt={getCountryName(country, language)}
                    width={640}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Country Flag */}
                  <div className="absolute top-4 right-4 text-4xl group-hover:scale-110 transition-transform duration-300">
                    {country.flag}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 bg-tarhal-orange text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    {country.rating}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {getCountryName(country, language)}
                    </h3>
                    <p className="text-white/80 mb-4 line-clamp-2">
                      {getCountryDescription(country, language)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-white/60 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {country.totalTours} جولة
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {country.totalReviews} مراجعة
                        </span>
                      </div>
                      <Link to={`/offices/${country.id}`}>
                        <Button size="sm" className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          استكشف
                          <ArrowRight className="mr-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              آراء عملائنا
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              نفخر بثقة عملائنا الكرام وتجاربهم الرائعة معنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'أحمد محمد العلي',
                country: 'السعودية',
                image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
                rating: 5,
                review: 'تجربة رائعة مع شركة ciar، تنظيم ممتاز وخدمة عملاء متميزة. أنصح الجميع بالتعامل معهم.',
                trip: 'رحلة إلى تركيا'
              },
              {
                name: 'فاطمة أحمد',
                country: 'الإمارات',
                image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
                rating: 5,
                review: 'خدمة احترافية عالية المستوى، الفريق متعاون جداً والأسعار مناسبة. رحلة لا تُنسى!',
                trip: 'رحلة إلى المغرب'
              },
              {
                name: 'علي حسن',
                country: 'السودان',
                image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
                rating: 5,
                review: 'أفضل شركة سياحة تعاملت معها، كل شيء كان منظم ومرتب. شكراً لفريق ciar الرائع.',
                trip: 'رحلة إلى مصر'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 animate-scale-in border-l-4 border-tarhal-orange" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-tarhal-blue-dark">{testimonial.name}</h4>
                    <p className="text-tarhal-gray-dark text-sm">{testimonial.country}</p>
                    <p className="text-tarhal-orange text-sm font-medium">{testimonial.trip}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-tarhal-gray-dark leading-relaxed italic">
                  "{testimonial.review}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              ابق على اطلاع بأحدث العروض
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 animate-slide-up">
              اشترك في نشرتنا الإخبارية واحصل على أفضل الصفقات والعروض الحصرية قبل الجميع
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex gap-4 animate-scale-in">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/70 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-300"
                />
                <Button className="bg-white text-tarhal-orange hover:bg-gray-100 px-8 py-4 font-semibold rounded-xl transform hover:scale-105 transition-all duration-300">
                  اشتراك
                  <Send className="mr-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-white/70 text-sm mt-4">
                لن نشارك بياناتك مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              خدماتنا المميزة
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              نقدم لك مجموعة شاملة من الخدمات السياحية لضمان رحلة مثالية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '✈️',
                title: 'حجز الطيران',
                description: 'أفضل أسعار تذاكر الطيران مع جميع الخطوط الجوية العالمية',
                color: 'from-blue-500 to-blue-600',
                href: '/flight-tickets',
              },
              {
                icon: '🏨',
                title: 'حجز الفنادق',
                description: 'اختر من بين آلاف الفنادق المصنفة في جميع أنحاء العالم',
                color: 'from-green-500 to-green-600',
                href: '/hotels',
              },
              {
                icon: '🚗',
                title: 'استئجار السيارات',
                description: 'أحدث السيارات وأفضل الأسعار لرحلة مريحة وآمنة',
                color: 'from-purple-500 to-purple-600',
                href: '/car-rentals',
              },
              {
                icon: '🗺️',
                title: 'الجولات السياحية',
                description: 'برامج سياحية متنوعة مع مرشدين محليين خبراء',
                color: 'from-orange-500 to-orange-600',
                href: '/offers',
              },
              {
                icon: '📋',
                title: 'استخراج التأشيرات',
                description: 'نساعدك في استخراج جميع أنواع التأشيرات بسهولة ويسر',
                color: 'from-red-500 to-red-600',
                href: '/travel-visa',
              },
              {
                icon: '🛡️',
                title: 'التأمين السياحي',
                description: 'حماية شاملة لرحلتك ضد جميع المخاطر المحتملة',
                color: 'from-indigo-500 to-indigo-600',
                href: '/travel-insurance',
              },
              {
                icon: '💼',
                title: 'السياحة العلاجية',
                description: 'برامج متخصصة للسياحة العلاجية في أفضل المراكز الطبية',
                color: 'from-pink-500 to-pink-600',
                href: '/contact',
              },
              {
                icon: '🎓',
                title: 'السياحة التعليمية',
                description: 'رحلات تعليمية وثقافية للطلاب والمهتمين بالتعلم',
                color: 'from-cyan-500 to-cyan-600',
                href: '/contact',
              },
            ].map((service, index) => (
              <Link
                key={service.href}
                to={service.href}
                className="group bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 animate-scale-in hover:-translate-y-2 border border-transparent dark:border-slate-800"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-tarhal-blue-dark mb-4 text-center group-hover:text-tarhal-orange transition-colors">
                  {service.title}
                </h3>
                <p className="text-tarhal-gray-dark text-center leading-relaxed">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              مواقعنا حول العالم
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              تجد مكاتبنا في أهم المدن السياحية حول العالم
            </p>
          </div>

          <GoogleMap
            center={mapCenter}
            zoom={officeMapMarkers.length > 1 ? 4 : 12}
            markers={officeMapMarkers}
            height="500px"
            className="shadow-xl animate-scale-in"
          />
          {officeMapMarkers.length > 0 && (
            <p className="text-center text-sm text-tarhal-gray-dark mt-4">
              {language === 'ar'
                ? `${officeMapMarkers.length} موقع مكتب على الخريطة — اضغط على العلامة لعرض التفاصيل`
                : `${officeMapMarkers.length} office locations on the map — click a pin for details`}
            </p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-tarhal-blue to-tarhal-navy">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contact Form */}
            <div className="animate-slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                تواصل معنا
              </h2>
              <p className="text-xl text-white/80 mb-8">
                نحن هنا لخدمتكم على مدار الساعة
              </p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-lg text-white placeholder:text-white/75 focus:outline-none focus:border-tarhal-orange focus:bg-white/25"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-lg text-white placeholder:text-white/75 focus:outline-none focus:border-tarhal-orange focus:bg-white/25"
                  />
                </div>
                <input
                  type="text"
                  placeholder="الموضوع"
                  className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-lg text-white placeholder:text-white/75 focus:outline-none focus:border-tarhal-orange focus:bg-white/25"
                />
                <textarea
                  rows={5}
                  placeholder="رسالتك"
                  className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-lg text-white placeholder:text-white/75 focus:outline-none focus:border-tarhal-orange focus:bg-white/25 resize-none"
                ></textarea>
                <Button className="bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white px-8 py-3 text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  إرسال الرسالة
                  <Send className="mr-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Animated Illustration */}
            <div className="relative animate-slide-in-right">
              <div className="relative w-full h-96 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-tarhal-orange/20 to-tarhal-orange-dark/20 rounded-full animate-pulse-slow"></div>
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                    <Mail className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    نتلقى رسائلكم بسرعة
                  </h3>
                  <p className="text-white/80">
                    فريقنا جاهز للرد على استفساراتكم في أقل من 24 ساعة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {language === 'ar' ? 'وسائل الدفع' : language === 'fr' ? 'Moyens de Paiement' : 'Payment Methods'}
              </h2>
              <Lock className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'نقبل وسائل الدفع العالمية و المحلية بما فيها Whish Money و بطاقة CIAR' 
                : language === 'fr'
                ? 'Nous acceptons les moyens de paiement internationaux et locaux, dont Whish Money et la carte CIAR'
                : 'We accept international and local payment methods including Whish Money and the CIAR card'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Whish Money */}
            <div className="bg-white rounded-xl p-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <img
                src="/payments/whish-money.png"
                alt="Whish Money"
                className="h-16 w-full max-w-[140px] object-contain"
              />
            </div>

            {/* CIAR Prepaid Mastercard */}
            <div className="bg-white rounded-xl p-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <img
                src="/payments/ciar-mastercard.png"
                alt="CIAR Prepaid Mastercard"
                className="h-16 w-full max-w-[140px] object-contain rounded-md"
              />
            </div>

            {/* Mastercard */}
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <div className="flex items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-[#EB001B]"></div>
                <div className="w-10 h-10 rounded-full bg-[#F79E1B] -ml-6"></div>
              </div>
            </div>

            {/* Visa */}
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <span className="text-[#1A1F71] font-bold text-2xl tracking-wider">VISA</span>
            </div>

            {/* PayPal */}
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <span className="text-[#00457C] font-bold text-xl">PayPal</span>
            </div>

            {/* American Express */}
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <div className="text-center">
                <div className="text-[#006FCF] font-bold text-[10px] leading-tight">AMERICAN</div>
                <div className="text-[#006FCF] font-bold text-[10px] leading-tight">EXPRESS</div>
              </div>
            </div>

            {/* Stripe */}
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <span className="text-[#635BFF] font-semibold text-lg lowercase">stripe</span>
            </div>

            {/* Google Pay */}
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-[#4285F4]"></div>
                <div className="w-5 h-5 rounded-full bg-[#EA4335] -ml-2"></div>
                <div className="w-5 h-5 rounded-full bg-[#FBBC04] -ml-2"></div>
                <div className="w-5 h-5 rounded-full bg-[#34A853] -ml-2"></div>
                <span className="text-gray-700 font-semibold text-sm ml-2">Pay</span>
              </div>
            </div>

            {/* Apple Pay */}
            <div className="bg-black rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-white font-semibold text-sm">Pay</span>
              </div>
            </div>

            {/* UnionPay */}
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[100px]">
              <div className="flex items-center gap-1">
                <div className="w-4 h-8 bg-[#E21836]"></div>
                <div className="w-4 h-8 bg-[#0066CC]"></div>
                <div className="w-4 h-8 bg-[#00A651]"></div>
                <span className="text-gray-800 font-semibold text-[10px] ml-2">UnionPay</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              {language === 'ar' 
                ? 'جميع المعاملات مشفرة وآمنة' 
                : language === 'fr'
                ? 'Toutes les transactions sont cryptées et sécurisées'
                : 'All transactions are encrypted and secure'}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
