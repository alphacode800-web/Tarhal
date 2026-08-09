import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { dataManager, type Advertisement, type AdPlacement } from '@/services/dataManager';
import { AD_PLACEMENTS, getPlacementLabel } from '@/data/ads';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Props {
  placement: AdPlacement;
  className?: string;
  limit?: number;
  compact?: boolean;
}

export default function AdSlot({ placement, className, limit = 3, compact = false }: Props) {
  const { language } = useLanguage();
  const lang = (language === 'fr' ? 'fr' : language === 'en' ? 'en' : 'ar') as 'ar' | 'en' | 'fr';
  const [ads, setAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    dataManager.getAdsAsync().then((all) => {
      setAds(
        all
          .filter((a) => a.isActive && a.status === 'approved' && a.placement === placement)
          .slice(0, limit)
      );
    });
  }, [placement, limit]);

  const label = useMemo(() => getPlacementLabel(placement, lang), [placement, lang]);

  if (ads.length === 0) return null;

  return (
    <section className={cn('py-10', className)} aria-label={label}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 text-tarhal-blue-dark">
            <Megaphone className="h-4 w-4 text-tarhal-orange" />
            <span className="text-sm font-semibold">
              {lang === 'ar' ? 'إعلان مميز' : lang === 'fr' ? 'Publicité' : 'Sponsored'}
            </span>
          </div>
          <Link to="/ads" className="text-xs text-tarhal-orange hover:underline">
            {lang === 'ar' ? 'جميع الإعلانات' : lang === 'fr' ? 'Toutes les annonces' : 'All ads'}
          </Link>
        </div>
        <div className={cn('grid gap-4', compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3')}>
          {ads.map((ad) => {
            const href = ad.linkUrl || '/ads';
            const isExternal = href.startsWith('http');
            const Card = (
              <article className="group overflow-hidden rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {ad.imageUrl ? (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title[lang]}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}
                  <div className="absolute top-3 start-3 flex gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-tarhal-orange px-2.5 py-1 text-[11px] font-semibold text-white">
                      <Megaphone className="h-3 w-3" />
                      {lang === 'ar' ? 'إعلان' : 'Ad'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{ad.advertiserName}</p>
                  <h3 className="font-bold text-tarhal-blue-dark line-clamp-2 group-hover:text-tarhal-orange transition-colors">
                    {ad.title[lang]}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{ad.description[lang]}</p>
                </div>
              </article>
            );
            return isExternal ? (
              <a key={ad.id} href={href} target="_blank" rel="noopener noreferrer">
                {Card}
              </a>
            ) : (
              <Link key={ad.id} to={href}>
                {Card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { AD_PLACEMENTS };
