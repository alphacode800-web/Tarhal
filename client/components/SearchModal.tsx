import { useState, useEffect } from 'react';
import { Search, X, Filter, MapPin, Calendar, Users, Plane, Star, ArrowRight, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SearchResult {
  id: string;
  type: 'country' | 'city' | 'tour' | 'hotel';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  rating: number;
  price?: string;
  location: string;
  tags: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    rating: 0,
    priceRange: 'all',
    continent: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Sample search data - في التطبيق الحقيقي، هذه البيانات ستأتي من API
  const sampleResults: SearchResult[] = [
    {
      id: 'sudan',
      type: 'country',
      title: 'السودان',
      subtitle: 'أرض الحضارات القديمة',
      description: 'اكتشف جمال التقاء النيلين والأهرامات النوبية في مروي',
      image: 'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg',
      rating: 4.9,
      location: 'أفريقيا',
      tags: ['تاريخ', 'ثقافة', 'طبيعة', 'أنهار']
    },
    {
      id: 'khartoum',
      type: 'city',
      title: 'الخرطوم',
      subtitle: 'العاصمة السودانية',
      description: 'شاهد التقاء النيلين الأزرق والأبيض في منظر خلاب',
      image: 'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg',
      rating: 4.8,
      location: 'السودان',
      tags: ['عاصمة', 'أنهار', 'تاريخ']
    },
    {
      id: 'meroe',
      type: 'city',
      title: 'مروي',
      subtitle: 'مدينة الأهرامات النوبية',
      description: 'اكتشف أكثر من 200 هرم نوبي في هذا الموقع الأثري المدهش',
      image: 'https://images.pexels.com/photos/33388483/pexels-photo-33388483.jpeg',
      rating: 4.9,
      location: 'السودان',
      tags: ['آثار', 'أهرامات', 'تاريخ', 'نوبة']
    },
    {
      id: 'egypt',
      type: 'country',
      title: 'مصر',
      subtitle: 'أم الدنيا',
      description: 'اكتشف حضارة الفراعنة والأهرامات العظيمة',
      image: 'https://images.pexels.com/photos/33337243/pexels-photo-33337243.jpeg',
      rating: 4.8,
      location: 'أفريقيا',
      tags: ['فراعنة', 'أهرامات', 'نيل', 'تاريخ']
    },
    {
      id: 'uae',
      type: 'country',
      title: 'الإمارات',
      subtitle: 'أرض المستقبل',
      description: 'استمتع بالفخامة والحداثة في دولة الإمارات',
      image: 'https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg',
      rating: 4.9,
      price: 'من 1200 دولار',
      location: 'آسيا',
      tags: ['حداثة', 'تسوق', 'فخامة', 'صحراء']
    },
    {
      id: 'turkey',
      type: 'country',
      title: 'تركيا',
      subtitle: 'جسر بين القارات',
      description: 'تمتع بالتاريخ العثماني والطبيعة الخلابة',
      image: 'https://images.pexels.com/photos/33351942/pexels-photo-33351942.jpeg',
      rating: 4.8,
      price: 'من 800 دولار',
      location: 'أوروبا/آسيا',
      tags: ['تاريخ', 'ثقافة', 'طبيعة', 'عثماني']
    }
  ];

  const searchTypes = [
    { value: 'all', label: 'الكل', icon: <Search className="h-4 w-4" /> },
    { value: 'country', label: 'دول', icon: <MapPin className="h-4 w-4" /> },
    { value: 'city', label: 'مدن', icon: <MapPin className="h-4 w-4" /> },
    { value: 'tour', label: 'جولات', icon: <Plane className="h-4 w-4" /> },
    { value: 'hotel', label: 'فنادق', icon: <Users className="h-4 w-4" /> }
  ];

  const continents = [
    { value: 'all', label: 'جميع القارات' },
    { value: 'africa', label: 'أفريقيا' },
    { value: 'asia', label: 'آسيا' },
    { value: 'europe', label: 'أوروبا' },
    { value: 'america', label: 'أمريكا' }
  ];

  const priceRanges = [
    { value: 'all', label: 'جميع الأسعار' },
    { value: 'budget', label: 'اقتصادي (أقل من 500$)' },
    { value: 'mid', label: 'متوسط (500$ - 1500$)' },
    { value: 'luxury', label: 'فاخر (أكثر من 1500$)' }
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // محاكاة API call
      const timer = setTimeout(() => {
        const filtered = sampleResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              result.tags.some(tag => tag.includes(searchQuery));
          
          const matchesType = filters.type === 'all' || result.type === filters.type;
          const matchesRating = result.rating >= filters.rating;
          
          return matchesQuery && matchesType && matchesRating;
        });
        setSearchResults(filtered);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setSearchResults(sampleResults.slice(0, 6)); // عرض النتائج الشائعة
    }
  }, [searchQuery, filters]);

  const popularSearches = [
    'السودان', 'الخرطوم', 'مروي', 'مصر', 'الأهرامات', 'تركيا', 'الإمارات', 'دبي'
  ];

  const recentSearches = [
    'رحلة عائلية إلى تركيا', 'جولة الأهرامات', 'عروض الإمارات'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-tarhal-gray-light">
          <h2 className="text-2xl font-bold text-tarhal-blue-dark">البحث في ciar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tarhal-gray-light rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-tarhal-gray-dark" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-tarhal-gray-light">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tarhal-gray-dark h-5 w-5" />
            <Input
              type="text"
              placeholder="ابحث عن وجهة، مدينة، فندق، أو جولة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-tarhal-gray-light rounded-xl focus:border-tarhal-orange focus:ring-0"
              autoFocus
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilters(prev => ({ ...prev, type: type.value }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  filters.type === type.value
                    ? 'bg-tarhal-orange text-white'
                    : 'bg-tarhal-gray-light text-tarhal-gray-dark hover:bg-tarhal-orange/10'
                }`}
              >
                {type.icon}
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveFilter(activeFilter === 'rating' ? null : 'rating')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-tarhal-blue-dark border border-tarhal-gray-light rounded-lg hover:bg-tarhal-gray-light transition-colors"
            >
              <Star className="h-4 w-4" />
              التقييم
              <Filter className="h-3 w-3" />
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-tarhal-blue-dark border border-tarhal-gray-light rounded-lg hover:bg-tarhal-gray-light transition-colors"
            >
              <span>💰</span>
              السعر
              <Filter className="h-3 w-3" />
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'location' ? null : 'location')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-tarhal-blue-dark border border-tarhal-gray-light rounded-lg hover:bg-tarhal-gray-light transition-colors"
            >
              <MapPin className="h-4 w-4" />
              الموقع
              <Filter className="h-3 w-3" />
            </button>
          </div>

          {/* Filter Dropdowns */}
          {activeFilter === 'rating' && (
            <div className="mt-4 p-4 bg-tarhal-gray-light/50 rounded-lg animate-slide-up">
              <div className="flex gap-2">
                {[0, 3, 4, 4.5, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilters(prev => ({ ...prev, rating }))}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                      filters.rating === rating
                        ? 'bg-tarhal-orange text-white'
                        : 'bg-white text-tarhal-gray-dark hover:bg-tarhal-orange/10'
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">{rating === 0 ? 'الكل' : `${rating}+`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeFilter === 'price' && (
            <div className="mt-4 p-4 bg-tarhal-gray-light/50 rounded-lg animate-slide-up">
              <div className="grid grid-cols-2 gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setFilters(prev => ({ ...prev, priceRange: range.value }))}
                    className={`p-3 text-right rounded-lg transition-colors ${
                      filters.priceRange === range.value
                        ? 'bg-tarhal-orange text-white'
                        : 'bg-white text-tarhal-gray-dark hover:bg-tarhal-orange/10'
                    }`}
                  >
                    <span className="text-sm">{range.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeFilter === 'location' && (
            <div className="mt-4 p-4 bg-tarhal-gray-light/50 rounded-lg animate-slide-up">
              <div className="grid grid-cols-2 gap-2">
                {continents.map((continent) => (
                  <button
                    key={continent.value}
                    onClick={() => setFilters(prev => ({ ...prev, continent: continent.value }))}
                    className={`p-3 text-right rounded-lg transition-colors ${
                      filters.continent === continent.value
                        ? 'bg-tarhal-orange text-white'
                        : 'bg-white text-tarhal-gray-dark hover:bg-tarhal-orange/10'
                    }`}
                  >
                    <span className="text-sm">{continent.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {searchQuery.trim() === '' ? (
            // Popular and Recent Searches
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-tarhal-blue-dark mb-4">عمليات بحث شائعة</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="px-3 py-2 bg-tarhal-orange/10 text-tarhal-orange rounded-lg hover:bg-tarhal-orange hover:text-white transition-colors text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-tarhal-blue-dark mb-4">عمليات بحث حديثة</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="flex items-center gap-3 w-full p-3 hover:bg-tarhal-gray-light rounded-lg transition-colors"
                    >
                      <Clock className="h-4 w-4 text-tarhal-gray-dark" />
                      <span className="text-tarhal-gray-dark">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Search Results
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-tarhal-orange border-t-transparent rounded-full"></div>
                  <span className="mr-3 text-tarhal-gray-dark">جاري البحث...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-tarhal-blue-dark">
                      النتائج ({searchResults.length})
                    </h3>
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-4 p-4 hover:bg-tarhal-gray-light/50 rounded-xl transition-colors cursor-pointer group animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        if (result.type === 'country') {
                          window.location.href = `/offices/${result.id}`;
                        }
                      }}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-tarhal-blue-dark truncate">{result.title}</h4>
                          <span className="text-xs px-2 py-1 bg-tarhal-orange/10 text-tarhal-orange rounded-full">
                            {result.type === 'country' ? 'دولة' : 
                             result.type === 'city' ? 'مدينة' : 
                             result.type === 'tour' ? 'جولة' : 'فندق'}
                          </span>
                        </div>
                        <p className="text-sm text-tarhal-gray-dark mb-1">{result.subtitle}</p>
                        <p className="text-xs text-tarhal-gray-dark truncate">{result.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{result.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-tarhal-gray-dark" />
                            <span className="text-xs text-tarhal-gray-dark">{result.location}</span>
                          </div>
                          {result.price && (
                            <span className="text-xs font-medium text-tarhal-orange">{result.price}</span>
                          )}
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-tarhal-gray-dark group-hover:text-tarhal-orange transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-tarhal-gray-light mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-tarhal-blue-dark mb-2">لا توجد نتائج</h3>
                  <p className="text-tarhal-gray-dark">جرب كلمات بحث مختلفة أو قم بتعديل الفلاتر</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-tarhal-gray-light bg-tarhal-gray-light/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-tarhal-gray-dark">
              💡 نصيحة: استخدم كلمات بحث بسيطة للحصول على أفضل النتائج
            </div>
            <Button
              onClick={onClose}
              className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
