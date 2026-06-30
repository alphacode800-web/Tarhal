import { cn } from '@/lib/utils';
import {
  SOCIAL_BRAND_COLORS,
  SOCIAL_PLATFORMS,
  type SocialPlatformKey,
} from '@/data/socialPlatforms';
import {
  FaWhatsapp,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaSnapchat,
  FaPinterest,
  FaXTwitter,
} from 'react-icons/fa6';
import { SiThreads } from 'react-icons/si';
import type { IconType } from 'react-icons';

interface SocialBrandIconProps {
  platform: SocialPlatformKey;
  size?: number;
  variant?: 'brand' | 'white';
  className?: string;
}

const platformLabels = Object.fromEntries(
  SOCIAL_PLATFORMS.map((p) => [p.key, p.name.en]),
) as Record<SocialPlatformKey, string>;

const PLATFORM_ICONS: Record<SocialPlatformKey, IconType> = {
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  snapchat: FaSnapchat,
  pinterest: FaPinterest,
  threads: SiThreads,
};

export default function SocialBrandIcon({
  platform,
  size = 28,
  variant = 'brand',
  className,
}: SocialBrandIconProps) {
  const Icon = PLATFORM_ICONS[platform];
  const color =
    variant === 'white'
      ? '#ffffff'
      : platform === 'snapchat'
        ? '#000000'
        : `#${SOCIAL_BRAND_COLORS[platform]}`;

  return (
    <Icon
      aria-label={platformLabels[platform]}
      size={size}
      color={color}
      className={cn('shrink-0', className)}
    />
  );
}
