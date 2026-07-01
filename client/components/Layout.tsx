import { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import { dataManager } from '@/services/dataManager';
import { recordVisitIfNeeded } from '@/services/visitorStats';

interface LayoutProps {
  children: ReactNode;
}

/** تحميل بيانات السيرفر مرة واحدة عند فتح أي صفحة لضمان ظهور التعديلات على كل الأجهزة */
function useHydrateFromServer() {
  useEffect(() => {
    const loadCritical = async () => {
      try {
        await Promise.all([
          dataManager.getCountriesAsync(),
          dataManager.getHeroContentAsync(),
        ]);
      } catch (_) {}
    };

    const loadSecondary = async () => {
      try {
        await Promise.all([
          dataManager.getOfficesAsync(),
          dataManager.getOffersAsync(),
          dataManager.getSettingsAsync(),
        ]);
      } catch (_) {}
    };

    loadCritical();
    recordVisitIfNeeded().catch(() => {});
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => loadSecondary());
    } else {
      setTimeout(loadSecondary, 1500);
    }
  }, []);
}

export default function Layout({ children }: LayoutProps) {
  useHydrateFromServer();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
