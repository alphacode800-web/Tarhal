import { useState, useEffect, useRef } from 'react';
import { dataManager } from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AnnouncementBar() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [announcements, setAnnouncements] = useState<Array<{
    id: string;
    text: {
      ar: string;
      en: string;
      fr: string;
    };
  }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [barSpeed, setBarSpeed] = useState(30);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const settings = await dataManager.getSettingsAsync();
      const bar = settings?.announcementBar;

      setBarSpeed(bar?.speed ?? 30);
      const defaultTexts = dataManager.getDefaultSettings().announcementBar?.texts || [];
      const effectiveTexts = bar?.texts && bar.texts.length > 0 ? bar.texts : defaultTexts;

      if (bar?.enabled && effectiveTexts.length > 0) {
        setAnnouncements(effectiveTexts);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    })();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
      const elapsed = (timestamp - startTime) / 1000; // Convert to seconds
      
      // Calculate content width (half because we duplicate)
      const contentWidth = container.scrollWidth / 2;
      const containerWidth = container.offsetWidth;
      
      // Start from right (container width) and move to left
      position = containerWidth - (elapsed * speed);
      
      // When content goes completely off screen to the left, reset to start from right again
      if (position <= -contentWidth) {
        position = containerWidth;
        startTime = timestamp;
      }
      
      container.style.transform = `translateX(${position}px)`;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize position to start from right
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
    <div className="bg-gradient-to-r from-tarhal-blue-dark to-tarhal-navy text-white py-3 overflow-hidden relative w-full">
      <div className="relative w-full h-full flex items-center">
        <div
          ref={containerRef}
          className="flex items-center gap-8 whitespace-nowrap"
          style={{ willChange: 'transform' }}
        >
          {/* Duplicate content for seamless loop */}
          {[...announcements, ...announcements].map((announcement, index) => (
            <div
              key={`${announcement.id}-${index}`}
              className="flex items-center gap-4 px-4 flex-shrink-0"
            >
              <span className="text-base font-medium">
                {announcement.text[language] || announcement.text.ar}
              </span>
              <span className="text-tarhal-orange text-lg">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
