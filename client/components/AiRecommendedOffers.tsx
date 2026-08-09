import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecOffer {
  id: string;
  title?: { ar?: string; en?: string; fr?: string };
  price?: number;
  imageUrl?: string;
  durationDays?: number;
}

export default function AiRecommendedOffers() {
  const { language } = useLanguage();
  const lang = (language === 'fr' ? 'fr' : language === 'en' ? 'en' : 'ar') as 'ar' | 'en' | 'fr';
  const [offers, setOffers] = useState<RecOffer[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ai/recommendations')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.success && json.data?.enabled) {
          setEnabled(true);
          setOffers(Array.isArray(json.data.offers) ? json.data.offers.slice(0, 4) : []);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!enabled || offers.length === 0) return null;

  const title =
    lang === 'ar'
      ? 'موصى به لك'
      : lang === 'fr'
        ? 'Recommandé pour vous'
        : 'Recommended for you';

  return (
    <section className="py-12 bg-gradient-to-b from-tarhal-blue/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-tarhal-orange" />
          <h2 className="text-2xl font-bold text-tarhal-blue-dark">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((o) => (
            <Link
              key={o.id}
              to={`/offers/${o.id}`}
              className="group rounded-2xl overflow-hidden border border-border bg-background hover:shadow-lg transition-shadow"
            >
              {o.imageUrl ? (
                <img
                  src={o.imageUrl}
                  alt={o.title?.[lang] || ''}
                  className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="h-36 w-full bg-muted" />
              )}
              <div className="p-3">
                <p className="font-medium text-sm line-clamp-2 text-foreground">
                  {o.title?.[lang] || o.title?.ar || o.title?.en}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {o.price != null ? `$${o.price}` : ''}
                  {o.durationDays ? ` · ${o.durationDays} ${lang === 'ar' ? 'أيام' : 'days'}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
