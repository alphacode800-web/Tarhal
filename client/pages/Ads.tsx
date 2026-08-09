import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Plus, Search, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dataManager, type Advertisement, type AdPlacement } from '@/services/dataManager';
import { AD_PLACEMENTS, getPlacementLabel } from '@/data/ads';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function Ads() {
  const { language, isRTL } = useLanguage();
  const lang = (language === 'fr' ? 'fr' : language === 'en' ? 'en' : 'ar') as 'ar' | 'en' | 'fr';
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [query, setQuery] = useState('');
  const [placement, setPlacement] = useState<AdPlacement | 'all'>('all');

  useEffect(() => {
    dataManager.getAdsAsync().then(setAds);
  }, []);

  const visible = useMemo(() => {
    return ads.filter((ad) => {
      if (!ad.isActive || ad.status !== 'approved') return false;
      if (placement !== 'all' && ad.placement !== placement) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        ad.title[lang]?.toLowerCase().includes(q) ||
        ad.description[lang]?.toLowerCase().includes(q) ||
        ad.advertiserName.toLowerCase().includes(q) ||
        ad.category?.[lang]?.toLowerCase().includes(q) ||
        (ad.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [ads, placement, query, lang]);

  const t = {
    badge: lang === 'ar' ? 'إعلانات CIAR' : lang === 'fr' ? 'Annonces CIAR' : 'CIAR Ads',
    title: lang === 'ar' ? 'جميع الإعلانات' : lang === 'fr' ? 'Toutes les annonces' : 'All Ads',
    subtitle:
      lang === 'ar'
        ? 'استكشف الإعلانات النشطة على منصة CIAR – عروض، شركاء، وخدمات مميزة'
        : lang === 'fr'
          ? 'Explorez les annonces actives sur CIAR – offres, partenaires et services'
          : 'Explore active ads on CIAR – offers, partners, and featured services',
    cta: lang === 'ar' ? 'أعلن معنا +' : lang === 'fr' ? 'Annoncez avec nous +' : 'Advertise with us +',
    search: lang === 'ar' ? 'ابحث في الإعلانات…' : lang === 'fr' ? 'Rechercher…' : 'Search ads…',
    all: lang === 'ar' ? 'الكل' : lang === 'fr' ? 'Tous' : 'All',
    showing:
      lang === 'ar'
        ? `عرض ${visible.length} إعلان`
        : lang === 'fr'
          ? `${visible.length} annonces`
          : `Showing ${visible.length} ads`,
    empty:
      lang === 'ar'
        ? 'لا توجد إعلانات مطابقة حالياً.'
        : lang === 'fr'
          ? 'Aucune annonce pour le moment.'
          : 'No matching ads right now.',
    ad: lang === 'ar' ? 'إعلان' : 'Ad',
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tarhal-orange/10 text-tarhal-orange px-3 py-1 text-xs font-semibold mb-4">
              <Megaphone className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-3">{t.title}</h1>
            <p className="text-tarhal-gray-dark text-lg mb-6">{t.subtitle}</p>
            <Button asChild className="rounded-full bg-tarhal-orange hover:bg-tarhal-orange-dark px-6">
              <Link to="/advertise">
                <Plus className="h-4 w-4 me-1" />
                {t.cta}
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur p-4 mb-6 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search}
                className="ps-9 rounded-xl"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPlacement('all')}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                  placement === 'all'
                    ? 'bg-tarhal-orange text-white border-tarhal-orange'
                    : 'bg-background border-border hover:border-tarhal-orange/50'
                )}
              >
                {t.all}
              </button>
              {AD_PLACEMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlacement(p.id)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                    placement === p.id
                      ? 'bg-tarhal-orange text-white border-tarhal-orange'
                      : 'bg-background border-border hover:border-tarhal-orange/50'
                  )}
                >
                  {p[lang]}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{t.showing}</p>
          </div>

          {visible.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">{t.empty}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((ad) => {
                const href = ad.linkUrl || '#';
                const external = href.startsWith('http');
                const body = (
                  <article className="h-full overflow-hidden rounded-2xl border border-border bg-background shadow-sm hover:shadow-lg transition-shadow group">
                    <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                      {ad.imageUrl && (
                        <img
                          src={ad.imageUrl}
                          alt={ad.title[lang]}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-3 start-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-tarhal-navy/90 text-white text-[10px] px-2 py-1">
                          {getPlacementLabel(ad.placement, lang)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-tarhal-orange text-white text-[10px] px-2 py-1 font-semibold">
                          <Megaphone className="h-3 w-3" />
                          {t.ad}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">{ad.advertiserName}</p>
                      <h2 className="font-bold text-lg text-tarhal-blue-dark line-clamp-2 group-hover:text-tarhal-orange transition-colors">
                        {ad.title[lang]}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ad.description[lang]}</p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {ad.category?.[lang] && (
                          <span className="rounded-lg bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                            {ad.category[lang]}
                          </span>
                        )}
                        {(ad.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-lg bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                        {external && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ms-auto" />}
                      </div>
                    </div>
                  </article>
                );
                return external ? (
                  <a key={ad.id} href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {body}
                  </a>
                ) : href !== '#' ? (
                  <Link key={ad.id} to={href} className="block h-full">
                    {body}
                  </Link>
                ) : (
                  <div key={ad.id}>{body}</div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
