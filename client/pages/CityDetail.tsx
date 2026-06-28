import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Calendar, Camera, Users, Clock, Heart, Share2, Download, Play, Sun, Cloud, Droplets, Wind, Shield, Plane, Hotel, Car, Globe, Image as ImageIcon, Award, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { getCountryDataWithDynamic, getCountryName, getCityName } from '@/data/countries';
import type { CountryData, City } from '@/data/countries';
import { useLanguage } from '@/contexts/LanguageContext';
import { dataManager } from '@/services/dataManager';

export default function CityDetail() {
  const { countryId, cityId } = useParams<{ countryId: string; cityId: string }>();
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [cityData, setCityData] = useState<City | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (countryId) {
      (async () => {
        await dataManager.getCountriesAsync();
        const data = getCountryDataWithDynamic(countryId);
        setCountryData(data);

        if (data && cityId) {
        // Try to find city by ID first (exact match)
        let city = data.cities?.find(c => c.id === cityId);
        
        // If not found by ID, try to find by index (for cities without IDs or with generated IDs)
        if (!city && data.cities && data.cities.length > 0) {
          // Check if cityId is in format city_countryId_index
          const parts = cityId.split('_');
          if (parts.length >= 3 && parts[0] === 'city') {
            const cityIndex = parseInt(parts[parts.length - 1]);
            if (!isNaN(cityIndex) && cityIndex >= 0 && cityIndex < data.cities.length) {
              city = data.cities[cityIndex];
              // Ensure the city has an ID for future reference
              if (city && !city.id) {
                city = { ...city, id: cityId };
              }
            }
          }
          
          // If still not found, try to find by matching the cityId with any city's ID or index
          if (!city) {
            // Try to find by comparing with city names or using index as fallback
            const numericId = parseInt(cityId);
            if (!isNaN(numericId) && numericId >= 0 && numericId < data.cities.length) {
              city = data.cities[numericId];
            } else {
              // Last resort: try to find by name (if cityId looks like a name)
              city = data.cities.find(c => 
                c.name?.ar === cityId || 
                c.name?.en === cityId || 
                c.name?.fr === cityId ||
                c.id === cityId
              );
            }
          }
        }
        
        // If still not found, log for debugging
        if (!city && data.cities && data.cities.length > 0) {
          console.warn(`City not found with ID: ${cityId}. Available cities:`, 
            data.cities.map((c, idx) => ({ id: c.id, name: c.name?.ar || c.name?.en, index: idx }))
          );
        }
        
        setCityData(city || null);
        }
      })();
    }
  }, [countryId, cityId]);

  useEffect(() => {
    if (cityData?.gallery?.length) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % (cityData.gallery?.length || 1));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [cityData?.gallery?.length]);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Loading state
  if (!countryData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-16 w-16 border-4 border-tarhal-orange border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-tarhal-blue-dark mb-4">
              {language === 'ar' ? 'جاري تحميل بيانات الدولة...' : language === 'fr' ? 'Chargement des données du pays...' : 'Loading country data...'}
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state - city not found
  if (!cityData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-tarhal-blue-dark mb-4">
              {language === 'ar' ? 'المدينة غير موجودة' : language === 'fr' ? 'Ville introuvable' : 'City not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'عذراً، لم نتمكن من العثور على هذه المدينة.' 
                : language === 'fr'
                ? 'Désolé, nous n\'avons pas pu trouver cette ville.'
                : 'Sorry, we couldn\'t find this city.'}
            </p>
            <Link to={`/offices/${countryId}`}>
              <Button className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white">
                {language === 'ar' ? 'العودة للدولة' : language === 'fr' ? 'Retour au pays' : 'Back to Country'}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Safely get city images
  const cityImages = (cityData.gallery && cityData.gallery.length > 0) 
    ? cityData.gallery.filter(img => img) 
    : (cityData.image ? [cityData.image] : []);

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {cityImages.map((image, index) => (
            <div
              key={image || index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-tarhal-navy/90 via-tarhal-blue-dark/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6 animate-slide-in-left">
                <Link 
                  to={`/offices/${countryId}`} 
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>{language === 'ar' ? 'العودة للدولة' : language === 'fr' ? 'Retour au pays' : 'Back to Country'}</span>
                </Link>
              </div>
              
              <div className="mb-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <MapPin className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-medium text-white">
                    {getCountryName(countryData, language)}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                  {getCityName(cityData, language)}
                </h1>
                <p className="text-xl text-white/90 mb-6">{cityData.name?.[language] || cityData.name?.en || cityData.name?.ar || ''}</p>
                
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{cityData.rating}</span>
                    <span className="text-white/80 text-sm">({cityData.reviews} {language === 'ar' ? 'مراجعة' : language === 'fr' ? 'avis' : 'reviews'})</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                    <Calendar className="h-5 w-5 text-white" />
                    <span className="text-white text-sm">{cityData.bestTime?.[language] || cityData.bestTime?.ar || ''}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                    <Clock className="h-5 w-5 text-white" />
                    <span className="text-white text-sm">{cityData.duration?.[language] || cityData.duration?.ar || ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-20 z-40 bg-white border-b border-tarhal-gray-light shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : language === 'fr' ? 'Aperçu' : 'Overview', icon: <MapPin className="h-4 w-4" /> },
              { id: 'attractions', label: language === 'ar' ? 'المعالم السياحية' : language === 'fr' ? 'Attractions' : 'Attractions', icon: <Camera className="h-4 w-4" /> },
              { id: 'highlights', label: language === 'ar' ? 'النقاط البارزة' : language === 'fr' ? 'Points forts' : 'Highlights', icon: <Star className="h-4 w-4" /> },
              { id: 'gallery', label: language === 'ar' ? 'المعرض' : language === 'fr' ? 'Galerie' : 'Gallery', icon: <ImageIcon className="h-4 w-4" /> },
              { id: 'videos', label: language === 'ar' ? 'الفيديوهات' : language === 'fr' ? 'Vidéos' : 'Videos', icon: <Play className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-tarhal-orange text-tarhal-orange'
                    : 'border-transparent text-tarhal-gray-dark hover:text-tarhal-blue-dark'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {activeTab === 'overview' && (
            <div className="space-y-16">
              {/* Description */}
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-tarhal-blue-dark mb-6">
                  {language === 'ar' ? 'عن المدينة' : language === 'fr' ? 'À propos de la ville' : 'About the City'}
                </h2>
                <p className="text-lg text-tarhal-gray-dark leading-relaxed max-w-4xl">
                  {cityData.description?.[language] || cityData.description?.ar || ''}
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid md:grid-cols-4 gap-6 animate-slide-up">
                <div className="bg-gradient-to-br from-tarhal-orange/5 to-tarhal-blue/5 rounded-2xl p-6 text-center">
                  <Star className="h-8 w-8 text-tarhal-orange mx-auto mb-3" />
                  <div className="text-2xl font-bold text-tarhal-blue-dark mb-1">{cityData.rating}</div>
                  <div className="text-sm text-tarhal-gray-dark">{language === 'ar' ? 'التقييم' : language === 'fr' ? 'Note' : 'Rating'}</div>
                </div>
                <div className="bg-gradient-to-br from-tarhal-orange/5 to-tarhal-blue/5 rounded-2xl p-6 text-center">
                  <Users className="h-8 w-8 text-tarhal-orange mx-auto mb-3" />
                  <div className="text-2xl font-bold text-tarhal-blue-dark mb-1">{cityData.reviews}</div>
                  <div className="text-sm text-tarhal-gray-dark">{language === 'ar' ? 'مراجعة' : language === 'fr' ? 'Avis' : 'Reviews'}</div>
                </div>
                <div className="bg-gradient-to-br from-tarhal-orange/5 to-tarhal-blue/5 rounded-2xl p-6 text-center">
                  <Calendar className="h-8 w-8 text-tarhal-orange mx-auto mb-3" />
                  <div className="text-sm font-bold text-tarhal-blue-dark mb-1">{cityData.bestTime?.[language] || cityData.bestTime?.ar || ''}</div>
                  <div className="text-sm text-tarhal-gray-dark">{language === 'ar' ? 'أفضل وقت للزيارة' : language === 'fr' ? 'Meilleur moment' : 'Best Time'}</div>
                </div>
                <div className="bg-gradient-to-br from-tarhal-orange/5 to-tarhal-blue/5 rounded-2xl p-6 text-center">
                  <Clock className="h-8 w-8 text-tarhal-orange mx-auto mb-3" />
                  <div className="text-sm font-bold text-tarhal-blue-dark mb-1">{cityData.duration?.[language] || cityData.duration?.ar || ''}</div>
                  <div className="text-sm text-tarhal-gray-dark">{language === 'ar' ? 'مدة الزيارة' : language === 'fr' ? 'Durée' : 'Duration'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attractions' && (
            <div className="space-y-12">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4">
                  {language === 'ar' ? 'المعالم السياحية' : language === 'fr' ? 'Attractions touristiques' : 'Tourist Attractions'}
                </h2>
                <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto">
                  {language === 'ar' 
                    ? 'اكتشف أجمل المعالم والأماكن السياحية في هذه المدينة'
                    : language === 'fr'
                    ? 'Découvrez les plus beaux sites et attractions touristiques de cette ville'
                    : 'Discover the most beautiful sites and tourist attractions in this city'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(cityData.attractions?.[language] || []).map((attraction, index) => (
                  <div
                    key={`${cityData.id}-attraction-${index}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-scale-in border border-gray-100"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-tarhal-orange/20 to-tarhal-blue/20 flex items-center justify-center">
                      <Camera className="h-16 w-16 text-tarhal-orange/50" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-tarhal-blue-dark mb-2 group-hover:text-tarhal-orange transition-colors">
                        {attraction}
                      </h3>
                      <p className="text-tarhal-gray-dark text-sm">
                        {language === 'ar' 
                          ? 'معلم سياحي مميز يستحق الزيارة'
                          : language === 'fr'
                          ? 'Site touristique remarquable à visiter'
                          : 'Remarkable tourist site worth visiting'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="space-y-12">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4">
                  {language === 'ar' ? 'النقاط البارزة' : language === 'fr' ? 'Points forts' : 'Highlights'}
                </h2>
                <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto">
                  {language === 'ar' 
                    ? 'ما يميز هذه المدينة ويجعلها وجهة سياحية مميزة'
                    : language === 'fr'
                    ? 'Ce qui distingue cette ville et en fait une destination touristique exceptionnelle'
                    : 'What makes this city special and a unique tourist destination'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(cityData.highlights?.[language] || []).map((highlight, index) => (
                  <div
                    key={`${cityData.id}-highlight-${index}`}
                    className="flex items-center gap-4 p-6 bg-gradient-to-br from-tarhal-orange/5 to-tarhal-blue/5 rounded-xl hover:shadow-lg transition-shadow duration-300 animate-scale-in border border-tarhal-orange/10"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-12 h-12 bg-tarhal-orange rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-tarhal-blue-dark font-medium text-lg">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-12">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4">
                  {language === 'ar' ? 'معرض الصور' : language === 'fr' ? 'Galerie de photos' : 'Photo Gallery'}
                </h2>
                <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto">
                  {language === 'ar' 
                    ? 'استمتع بمجموعة من أجمل الصور لهذه المدينة'
                    : language === 'fr'
                    ? 'Profitez d\'une collection des plus belles photos de cette ville'
                    : 'Enjoy a collection of the most beautiful photos of this city'}
                </p>
              </div>

              {cityImages.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cityImages.map((image, index) => (
                    <div
                      key={`${cityData.id}-gallery-${index}`}
                      className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer animate-scale-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsGalleryOpen(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${getCityName(cityData, language)} - ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-200">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {language === 'ar' ? 'لا توجد صور متاحة حالياً' : language === 'fr' ? 'Aucune photo disponible pour le moment' : 'No photos available at the moment'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-12">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4">
                  {language === 'ar' ? 'الفيديوهات' : language === 'fr' ? 'Vidéos' : 'Videos'}
                </h2>
                <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto">
                  {language === 'ar' 
                    ? 'شاهد فيديوهات رائعة عن هذه المدينة'
                    : language === 'fr'
                    ? 'Regardez de superbes vidéos sur cette ville'
                    : 'Watch amazing videos about this city'}
                </p>
              </div>

              {cityData.videos && cityData.videos.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cityData.videos.map((video, index) => {
                    // Helper function to get embed URL
                    const getVideoEmbedUrl = (url: string): string => {
                      if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        // Extract video ID from YouTube URL
                        let videoId = '';
                        if (url.includes('youtube.com/embed/')) {
                          return url;
                        } else if (url.includes('youtube.com/watch?v=')) {
                          videoId = url.split('v=')[1]?.split('&')[0] || '';
                        } else if (url.includes('youtu.be/')) {
                          videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
                        }
                        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                      } else if (url.includes('vimeo.com')) {
                        // Extract video ID from Vimeo URL
                        const videoId = url.split('/').pop()?.split('?')[0] || '';
                        return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
                      }
                      return url; // Direct video URL
                    };

                    const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
                    const isVimeo = video.includes('vimeo.com');
                    const isDirectVideo = !isYouTube && !isVimeo;

                    return (
                      <div
                        key={`${cityData.id || 'city'}-video-${index}`}
                        className="group relative overflow-hidden rounded-2xl bg-gray-900 aspect-video animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {isYouTube ? (
                          <iframe
                            src={getVideoEmbedUrl(video)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${getCityName(cityData, language)} - Video ${index + 1}`}
                          />
                        ) : isVimeo ? (
                          <iframe
                            src={getVideoEmbedUrl(video)}
                            className="w-full h-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title={`${getCityName(cityData, language)} - Video ${index + 1}`}
                          />
                        ) : (
                          <video
                            src={video}
                            controls
                            className="w-full h-full object-cover"
                            title={`${getCityName(cityData, language)} - Video ${index + 1}`}
                          >
                            {language === 'ar' 
                              ? 'المتصفح الخاص بك لا يدعم تشغيل الفيديو.'
                              : language === 'fr'
                              ? 'Votre navigateur ne prend pas en charge la lecture vidéo.'
                              : 'Your browser does not support video playback.'}
                          </video>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-200">
                  <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {language === 'ar' ? 'لا توجد فيديوهات متاحة حالياً' : language === 'fr' ? 'Aucune vidéo disponible pour le moment' : 'No videos available at the moment'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Modal */}
      {isGalleryOpen && cityImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-tarhal-orange transition-colors z-10 bg-black/50 rounded-full p-2"
            >
              <span className="text-2xl">×</span>
            </button>
            <img
              src={cityImages[currentImageIndex]}
              alt={`${getCityName(cityData, language)} - ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {cityImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev - 1 + cityImages.length) % cityImages.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-tarhal-orange transition-colors bg-black/50 rounded-full p-3 z-10"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev + 1) % cityImages.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-tarhal-orange transition-colors bg-black/50 rounded-full p-3 z-10"
                >
                  <ArrowLeft className="h-6 w-6 rotate-180" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 rounded-full px-4 py-2 z-10">
                  {currentImageIndex + 1} / {cityImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

