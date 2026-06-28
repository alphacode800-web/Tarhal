import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Phone, Building2, ArrowRight, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllCountriesWithDynamic, getCountryName } from '@/data/countries';
import { dataManager, type TravelOffice } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { optimizeImageUrl } from '@/utils/imageUtils';
import OptimizedImage from '@/components/OptimizedImage';

type OfficeCard = TravelOffice & {
  countryName: string;
  countryFlag: string;
  continent: string;
  image: string;
  featured: boolean;
};

export default function TravelOffices() {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offices, setOffices] = useState<OfficeCard[]>([]);
  const [loading, setLoading] = useState(true);

  const headerImages = [
    'https://images.pexels.com/photos/33337243/pexels-photo-33337243.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % headerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await dataManager.getCountriesAsync();
        await dataManager.ensureOfficesForAllCountries();
        const [officeList, countries] = await Promise.all([
          dataManager.getOfficesAsync(),
          Promise.resolve(getAllCountriesWithDynamic()),
        ]);

        const countryMap = new Map(countries.map((c) => [c.id, c]));
        const featuredCountries = new Set(['sudan', 'saudi', 'uae', 'egypt', 'morocco']);

        const cards: OfficeCard[] = officeList
          .filter((o) => o.isActive !== false)
          .map((office) => {
            const country = countryMap.get(office.countryId);
            return {
              ...office,
              countryName: country ? getCountryName(country, language) : office.countryId,
              countryFlag: country?.flag || '🌍',
              continent: country?.continent || 'asia',
              image:
                office.imageUrl ||
                office.images?.[0] ||
                country?.mainImage ||
                'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg?auto=compress&cs=tinysrgb&w=800',
              featured: featuredCountries.has(office.countryId) || office.rating >= 4.7,
            };
          });

        setOffices(cards);
      } finally {
        setLoading(false);
      }
    })();
  }, [language]);

  const tr = (ar: string, en: string, fr: string) => {
    if (language === 'ar') return ar;
    if (language === 'fr') return fr;
    return en;
  };

  const getOfficeName = (office: OfficeCard) =>
    office.name[language] || office.name.ar;

  const getOfficeAddress = (office: OfficeCard) =>
    office.address[language] || office.address.ar;

  const continents = [
    { value: 'all', label: tr('جميع القارات', 'All Continents', 'Tous les Continents') },
    { value: 'africa', label: tr('أفريقيا', 'Africa', 'Afrique') },
    { value: 'asia', label: tr('آسيا', 'Asia', 'Asie') },
    { value: 'europe', label: tr('أوروبا', 'Europe', 'Europe') },
    { value: 'america', label: tr('أمريكا', 'America', 'Amérique') },
  ];

  const sortOptions = [
    { value: 'name', label: tr('الاسم', 'Name', 'Nom') },
    { value: 'rating', label: tr('التقييم', 'Rating', 'Note') },
    { value: 'reviews', label: tr('المراجعات', 'Reviews', 'Avis') },
  ];

  const filteredOffices = useMemo(() => {
    return offices
      .filter((office) => {
        const name = getOfficeName(office).toLowerCase();
        const country = office.countryName.toLowerCase();
        const address = getOfficeAddress(office).toLowerCase();
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q || name.includes(q) || country.includes(q) || address.includes(q);
        const matchesContinent =
          selectedContinent === 'all' || office.continent === selectedContinent;
        return matchesSearch && matchesContinent;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'reviews':
            return b.reviews - a.reviews;
          default:
            return getOfficeName(a).localeCompare(getOfficeName(b), language === 'ar' ? 'ar' : 'en');
        }
      });
  }, [offices, searchQuery, selectedContinent, sortBy, language]);

  const featuredOffices = offices.filter((o) => o.featured);

  const toggleFavorite = (officeId: string) => {
    setFavorites((prev) =>
      prev.includes(officeId) ? prev.filter((id) => id !== officeId) : [...prev, officeId]
    );
  };

  const OfficeCardView = ({
    office,
    index,
    large = false,
  }: {
    office: OfficeCard;
    index: number;
    large?: boolean;
  }) => (
    <div
      className={`group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 animate-scale-in ${
        large ? '' : 'border border-tarhal-gray-light/50'
      }`}
      style={{ animationDelay: `${(index % 12) * 80}ms` }}
    >
      <div className={`relative overflow-hidden ${large ? 'h-64' : 'h-48'}`}>
        <OptimizedImage
          src={office.image}
          alt={getOfficeName(office)}
          width={large ? 800 : 480}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="text-2xl drop-shadow">{office.countryFlag}</span>
          <button
            onClick={() => toggleFavorite(office.id)}
            className={`p-2 rounded-full transition-colors ${
              favorites.includes(office.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-tarhal-gray-dark hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="h-4 w-4" fill={favorites.includes(office.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        {office.featured && (
          <div className="absolute top-3 left-3 bg-tarhal-orange text-white px-3 py-1 rounded-full text-xs font-semibold">
            {tr('مميز', 'Featured', 'En Vedette')}
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold">{office.rating}</span>
        </div>
      </div>

      <div className={large ? 'p-6' : 'p-4'}>
        <p className="text-sm text-tarhal-orange font-medium mb-1">{office.countryName}</p>
        <h3 className={`font-bold text-tarhal-blue-dark mb-2 ${large ? 'text-2xl' : 'text-lg'}`}>
          {getOfficeName(office)}
        </h3>
        <div className="flex items-start gap-2 text-sm text-tarhal-gray-dark mb-2">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-tarhal-orange" />
          <span className="line-clamp-2">{getOfficeAddress(office)}</span>
        </div>
        {office.phone && (
          <div className="flex items-center gap-2 text-sm text-tarhal-gray-dark mb-4">
            <Phone className="h-4 w-4 text-tarhal-blue" />
            <span dir="ltr">{office.phone}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Link to={`/offices/${office.countryId}/contact/${office.id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white">
              {tr('تواصل مع المكتب', 'Contact Office', 'Contacter le Bureau')}
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/offices/${office.countryId}`}>
            <Button variant="outline" size="sm" className="h-full">
              {tr('الدولة', 'Country', 'Pays')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <section className="relative h-[60vh] overflow-hidden pt-20">
        <div className="absolute inset-0 bg-slate-900">
          {headerImages.map((image, index) => (
            <img
              key={index}
              src={optimizeImageUrl(image, 1920)}
              alt=""
              aria-hidden
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-tarhal-navy/90 via-tarhal-blue-dark/70 to-tarhal-orange/30" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              {tr('مكاتبنا السياحية', 'Our Travel Offices', 'Nos Bureaux de Voyage')}
              <span className="block text-tarhal-orange text-3xl md:text-4xl font-normal mt-2">
                {tr('خدمة محلية في كل دولة', 'Local service in every country', 'Service local dans chaque pays')}
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 animate-fade-in">
              {tr(
                'تصفح مكاتبنا السياحية المعتمدة حول العالم واحجز خدماتك مباشرة مع فريقنا المحلي',
                'Browse our certified travel offices worldwide and book directly with our local teams',
                'Parcourez nos bureaux de voyage certifiés et réservez directement avec nos équipes locales'
              )}
            </p>
            <div className="max-w-2xl mx-auto animate-scale-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tarhal-gray-dark h-5 w-5" />
                <Input
                  type="text"
                  placeholder={tr('ابحث عن مكتب أو دولة...', 'Search office or country...', 'Rechercher un bureau ou pays...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/95 border-none rounded-xl focus:ring-2 focus:ring-tarhal-orange"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-tarhal-gray-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-tarhal-blue-dark" />
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="px-4 py-2 border border-tarhal-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
              >
                {continents.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-tarhal-blue-dark font-medium">{tr('ترتيب حسب:', 'Sort by:', 'Trier par:')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-tarhal-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="text-tarhal-gray-dark">
              <span className="font-semibold text-tarhal-blue-dark">{filteredOffices.length}</span>{' '}
              {tr('مكتب متاح', 'offices available', 'bureaux disponibles')}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="py-24 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-tarhal-orange border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-tarhal-gray-dark">{tr('جاري تحميل المكاتب...', 'Loading offices...', 'Chargement des bureaux...')}</p>
        </section>
      ) : (
        <>
          {searchQuery === '' && selectedContinent === 'all' && featuredOffices.length > 0 && (
            <section className="py-16 bg-gradient-to-br from-tarhal-orange/5 to-tarhal-blue/5">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4">
                    {tr('المكاتب المميزة', 'Featured Offices', 'Bureaux en Vedette')}
                  </h2>
                  <p className="text-xl text-tarhal-gray-dark">
                    {tr('أبرز مكاتبنا السياحية حول العالم', 'Our top travel offices worldwide', 'Nos principaux bureaux de voyage')}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredOffices.slice(0, 6).map((office, index) => (
                    <OfficeCardView key={office.id} office={office} index={index} large />
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-tarhal-blue-dark mb-4 flex items-center justify-center gap-3">
                  <Building2 className="h-10 w-10 text-tarhal-orange" />
                  {searchQuery || selectedContinent !== 'all'
                    ? tr('نتائج البحث', 'Search Results', 'Résultats')
                    : tr('جميع المكاتب', 'All Offices', 'Tous les Bureaux')}
                </h2>
                <p className="text-xl text-tarhal-gray-dark">
                  {filteredOffices.length}{' '}
                  {tr('مكتب سياحي جاهز لخدمتك', 'travel offices ready to serve you', 'bureaux prêts à vous servir')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOffices.map((office, index) => (
                  <OfficeCardView key={office.id} office={office} index={index} />
                ))}
              </div>

              {filteredOffices.length === 0 && (
                <div className="text-center py-16">
                  <Building2 className="h-16 w-16 text-tarhal-gray-dark mx-auto mb-4 opacity-40" />
                  <h3 className="text-2xl font-bold text-tarhal-blue-dark mb-4">
                    {tr('لا توجد مكاتب', 'No offices found', 'Aucun bureau trouvé')}
                  </h3>
                  <p className="text-tarhal-gray-dark mb-6">
                    {tr('لم نجد مكاتب تطابق بحثك', 'No offices match your search', 'Aucun bureau ne correspond à votre recherche')}
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedContinent('all');
                    }}
                    className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
                  >
                    {tr('إعادة تعيين البحث', 'Reset search', 'Réinitialiser')}
                  </Button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <section className="py-16 bg-gradient-to-br from-tarhal-blue-dark to-tarhal-navy">
        <div className="container mx-auto px-4 text-center">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-4xl font-bold text-tarhal-orange mb-2">{offices.length}+</div>
              <div className="text-lg">{tr('مكتب سياحي', 'Travel Offices', 'Bureaux de Voyage')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-tarhal-orange mb-2">
                {new Set(offices.map((o) => o.countryId)).size}+
              </div>
              <div className="text-lg">{tr('دولة', 'Countries', 'Pays')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-tarhal-orange mb-2">
                {offices.reduce((sum, o) => sum + o.reviews, 0).toLocaleString()}+
              </div>
              <div className="text-lg">{tr('مراجعة عميل', 'Client Reviews', 'Avis Clients')}</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
