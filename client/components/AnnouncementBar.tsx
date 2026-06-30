import { useState, useEffect, useRef, useCallback } from 'react';
import { dataManager } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';

type AnnouncementText = {
  id: string;
  text: { ar: string; en: string; fr: string };
};

type BarStyle = {
  fontSize: number;
  textColor: string;
  backgroundFrom: string;
  backgroundTo: string;
  accentColor: string;
};

const DEFAULT_STYLE: BarStyle = {
  fontSize: 16,
  textColor: '#ffffff',
  backgroundFrom: '#1e3a5f',
  backgroundTo: '#0f2744',
  accentColor: '#f97316',
};

export default function AnnouncementBar() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementText[]>([]);
  const [barSpeed, setBarSpeed] = useState(30);
  const [barStyle, setBarStyle] = useState<BarStyle>(DEFAULT_STYLE);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const loadBarSettings = useCallback(async () => {
    const settings = await dataManager.getSettingsAsync();
    const bar = settings?.announcementBar;
    const defaults = dataManager.getDefaultSettings().announcementBar;

    setBarSpeed(bar?.speed ?? defaults?.speed ?? 30);
    setBarStyle({
      fontSize: bar?.fontSize ?? defaults?.fontSize ?? DEFAULT_STYLE.fontSize,
      textColor: bar?.textColor ?? defaults?.textColor ?? DEFAULT_STYLE.textColor,
      backgroundFrom: bar?.backgroundFrom ?? defaults?.backgroundFrom ?? DEFAULT_STYLE.backgroundFrom,
      backgroundTo: bar?.backgroundTo ?? defaults?.backgroundTo ?? DEFAULT_STYLE.backgroundTo,
      accentColor: bar?.accentColor ?? defaults?.accentColor ?? DEFAULT_STYLE.accentColor,
    });

    const defaultTexts = defaults?.texts || [];
    const effectiveTexts = bar?.texts && bar.texts.length > 0 ? bar.texts : defaultTexts;
    const isEnabled = bar?.enabled ?? settings.showTopAnnouncement ?? false;

    if (isEnabled && effectiveTexts.length > 0) {
      setAnnouncements(effectiveTexts);
      setIsVisible(true);
    } else {
      setAnnouncements([]);
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    loadBarSettings();

    const handleSettingsUpdate = () => {
      loadBarSettings();
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loadBarSettings]);

  useEffect(() => {
    if (!isVisible || announcements.length === 0 || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const speed = barSpeed;
    let position = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      const contentWidth = container.scrollWidth / 2;
      const containerWidth = container.offsetWidth;

      position = containerWidth - (elapsed * speed);

      if (position <= -contentWidth) {
        position = containerWidth;
        startTime = timestamp;
      }

      container.style.transform = `translateX(${position}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    if (containerRef.current) {
      position = containerRef.current.offsetWidth;
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, announcements, language, barSpeed]);

  if (!isVisible || announcements.length === 0) {
    return null;
  }

  return (
    <div
      className="py-3 overflow-hidden relative w-full border-t border-white/10"
      style={{
        background: `linear-gradient(to right, ${barStyle.backgroundFrom}, ${barStyle.backgroundTo})`,
        color: barStyle.textColor,
      }}
    >
      <div className="relative w-full h-full flex items-center">
        <div
          ref={containerRef}
          className="flex items-center gap-8 whitespace-nowrap"
          style={{ willChange: 'transform' }}
        >
          {[...announcements, ...announcements].map((announcement, index) => (
            <div
              key={`${announcement.id}-${index}`}
              className="flex items-center gap-4 px-4 flex-shrink-0"
            >
              <span
                className="font-medium"
                style={{ fontSize: `${barStyle.fontSize}px`, color: barStyle.textColor }}
              >
                {announcement.text[language] || announcement.text.ar}
              </span>
              <span className="text-lg" style={{ color: barStyle.accentColor }}>•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
