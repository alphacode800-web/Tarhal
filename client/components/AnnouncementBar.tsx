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
  fontSize: 13,
  textColor: '#ffffff',
  backgroundFrom: '#1e3a5f',
  backgroundTo: '#0f2744',
  accentColor: '#f97316',
};

function hasAnnouncementContent(item: AnnouncementText): boolean {
  return Boolean(item.text.ar?.trim() || item.text.en?.trim() || item.text.fr?.trim());
}

function pickAnnouncementTexts(
  saved: AnnouncementText[] | undefined,
  defaults: AnnouncementText[],
): AnnouncementText[] {
  const savedValid = (saved || []).filter(hasAnnouncementContent);
  if (savedValid.length > 0) return savedValid;
  return defaults.filter(hasAnnouncementContent);
}

export default function AnnouncementBar() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementText[]>([]);
  const [barSpeed, setBarSpeed] = useState(30);
  const [barStyle, setBarStyle] = useState<BarStyle>(DEFAULT_STYLE);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const loadBarSettings = useCallback(async () => {
    const settings = await dataManager.getSettingsAsync();
    const bar = settings?.announcementBar;
    const defaults = dataManager.getDefaultSettings().announcementBar;

    const isEnabled =
      bar?.enabled ??
      settings.showTopAnnouncement ??
      defaults?.enabled ??
      false;

    if (!isEnabled) {
      setAnnouncements([]);
      setIsVisible(false);
      return;
    }

    setBarSpeed(bar?.speed ?? defaults?.speed ?? 30);
    setBarStyle({
      fontSize: bar?.fontSize ?? defaults?.fontSize ?? DEFAULT_STYLE.fontSize,
      textColor: bar?.textColor ?? defaults?.textColor ?? DEFAULT_STYLE.textColor,
      backgroundFrom: bar?.backgroundFrom ?? defaults?.backgroundFrom ?? DEFAULT_STYLE.backgroundFrom,
      backgroundTo: bar?.backgroundTo ?? defaults?.backgroundTo ?? DEFAULT_STYLE.backgroundTo,
      accentColor: bar?.accentColor ?? defaults?.accentColor ?? DEFAULT_STYLE.accentColor,
    });

    const effectiveTexts = pickAnnouncementTexts(bar?.texts, defaults?.texts || []);

    if (effectiveTexts.length > 0) {
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
    if (!isVisible || announcements.length === 0 || !trackRef.current || !viewportRef.current) {
      return;
    }

    const track = trackRef.current;
    const viewport = viewportRef.current;
    const speed = Math.max(barSpeed, 10);
    let startTime: number | null = null;

    const getViewportWidth = () => viewport.clientWidth || window.innerWidth;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      const contentWidth = track.scrollWidth / 2;
      const viewportWidth = getViewportWidth();

      let position = viewportWidth - elapsed * speed;

      if (position <= -contentWidth) {
        position = viewportWidth;
        startTime = timestamp;
      }

      track.style.transform = `translateX(${position}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    track.style.transform = `translateX(${getViewportWidth()}px)`;
    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      startTime = null;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
      className="py-1 overflow-hidden relative w-full leading-none"
      style={{
        background: `linear-gradient(to right, ${barStyle.backgroundFrom}, ${barStyle.backgroundTo})`,
        color: barStyle.textColor,
      }}
    >
      <div ref={viewportRef} className="relative w-full min-h-[1.25rem] flex items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-6 whitespace-nowrap"
          style={{ willChange: 'transform' }}
        >
          {[...announcements, ...announcements].map((announcement, index) => (
            <div
              key={`${announcement.id}-${index}`}
              className="flex items-center gap-2 px-2 flex-shrink-0"
            >
              <span
                className="font-normal leading-tight"
                style={{ fontSize: `${Math.max(barStyle.fontSize, 12)}px`, color: barStyle.textColor }}
              >
                {announcement.text[language]?.trim() || announcement.text.ar || announcement.text.en}
              </span>
              <span className="text-xs" style={{ color: barStyle.accentColor }}>•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
