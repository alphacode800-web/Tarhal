import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { useLanguage } from '@/contexts/LanguageContext';
import { dataManager } from '@/services/dataManager';
import {
  DEFAULT_CONTACT,
  getContactFromSettings,
  mergeSocialLinks,
  resolveSocialUrl,
  type SiteContact,
  type SocialLinks,
} from '@/data/socialPlatforms';

export default function FloatingWhatsApp() {
  const { language } = useLanguage();
  const [contact, setContact] = useState<SiteContact>(DEFAULT_CONTACT);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(mergeSocialLinks());

  useEffect(() => {
    const load = async () => {
      const settings = await dataManager.getSettingsAsync();
      setContact(getContactFromSettings(settings));
      setSocialLinks(mergeSocialLinks(settings.socialLinks));
    };
    load();

    const onUpdate = () => load();
    window.addEventListener('settingsUpdated', onUpdate);
    return () => window.removeEventListener('settingsUpdated', onUpdate);
  }, []);

  const href = resolveSocialUrl('whatsapp', socialLinks, contact);
  if (!href || href === '#') return null;

  const label =
    language === 'ar'
      ? 'تواصل معنا عبر واتساب'
      : language === 'fr'
        ? 'Contactez-nous sur WhatsApp'
        : 'Chat with us on WhatsApp';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110 hover:shadow-[0_12px_28px_rgba(37,211,102,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" aria-hidden />
      <FaWhatsapp className="relative h-7 w-7" aria-hidden />
    </a>
  );
}
