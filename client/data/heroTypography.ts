import type { CSSProperties } from 'react';
import type { HeroContent } from '@/services/dataManager';

export interface HeroTextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  lineHeight: number;
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontStyle: 'normal' | 'italic';
}

export interface HeroButtonStyle extends HeroTextStyle {
  backgroundColor: string;
  borderColor: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
}

export interface HeroOverlayStyle {
  fromColor: string;
  viaColor: string;
  toColor: string;
  opacity: number;
}

export interface HeroTypography {
  useBrandSplit: boolean;
  heroTitle: HeroTextStyle;
  heroSubtitle: HeroTextStyle;
  heroBrandPrimary: HeroTextStyle;
  heroBrandSecondary: HeroTextStyle;
  heroDescription: HeroTextStyle;
  primaryButton: HeroButtonStyle;
  secondaryButton: HeroButtonStyle;
  overlay: HeroOverlayStyle;
}

export const HERO_FONT_OPTIONS = [
  { value: 'Cairo', label: 'خط القاهرة — عربي حديث' },
  { value: 'Amiri', label: 'خط أميري — عربي كلاسيكي' },
  { value: 'Tajawal', label: 'خط تجوال — عربي أنيق' },
  { value: 'Inter', label: 'خط إنتر — إنجليزي واضح' },
  { value: 'Cinzel', label: 'خط سينزل — فخم' },
  { value: 'Cinzel Decorative', label: 'خط سينزل المزخرف — للشعارات' },
  { value: 'Georgia', label: 'جورجيا — تقليدي' },
  { value: 'Times New Roman', label: 'تايمز — رسمي' },
  { value: 'Arial', label: 'آريال — بسيط' },
  { value: 'system-ui', label: 'خط الجهاز الافتراضي' },
  { value: 'serif', label: 'خط بزوغات' },
  { value: 'sans-serif', label: 'خط بدون بزوغات' },
] as const;

export const HERO_FONT_WEIGHT_OPTIONS = [
  { value: '300', label: 'خفيف' },
  { value: '400', label: 'عادي' },
  { value: '500', label: 'متوسط' },
  { value: '600', label: 'شبه عريض' },
  { value: '700', label: 'عريض' },
  { value: '800', label: 'عريض جداً' },
  { value: '900', label: 'أسود' },
] as const;

export const HERO_FONT_SIZE_OPTIONS = [
  { value: 14, label: 'صغير جداً' },
  { value: 16, label: 'صغير' },
  { value: 18, label: 'مناسب للنصوص' },
  { value: 20, label: 'متوسط' },
  { value: 24, label: 'كبير' },
  { value: 28, label: 'كبير جداً' },
  { value: 32, label: 'عنوان فرعي' },
  { value: 36, label: 'عنوان بارز' },
  { value: 42, label: 'عنوان رئيسي' },
  { value: 48, label: 'ضخم' },
  { value: 56, label: 'ضخم جداً' },
] as const;

export const HERO_LINE_HEIGHT_OPTIONS = [
  { value: 1, label: 'مضغوط' },
  { value: 1.2, label: 'مناسب للعناوين' },
  { value: 1.4, label: 'مريح' },
  { value: 1.6, label: 'مناسب للفقرات' },
  { value: 1.8, label: 'واسع' },
  { value: 2, label: 'واسع جداً' },
] as const;

export const HERO_LETTER_SPACING_OPTIONS = [
  { value: 0, label: 'طبيعي' },
  { value: 1, label: 'متباعد قليلاً' },
  { value: 2, label: 'متباعد' },
  { value: 4, label: 'واسع' },
  { value: -0.5, label: 'متماسك' },
] as const;

const baseText = (overrides: Partial<HeroTextStyle>): HeroTextStyle => ({
  fontFamily: 'Cairo',
  fontSize: 32,
  fontWeight: '700',
  color: '#ffffff',
  lineHeight: 1.2,
  letterSpacing: 0,
  textTransform: 'none',
  fontStyle: 'normal',
  ...overrides,
});

export const DEFAULT_HERO_TYPOGRAPHY: HeroTypography = {
  useBrandSplit: true,
  heroTitle: baseText({
    fontFamily: 'Cairo',
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 1.15,
  }),
  heroSubtitle: baseText({
    fontFamily: 'Cinzel Decorative',
    fontSize: 36,
    fontWeight: '700',
    color: '#f97316',
    lineHeight: 1,
  }),
  heroBrandPrimary: baseText({
    fontFamily: 'Cinzel Decorative',
    fontSize: 36,
    fontWeight: '700',
    color: '#f97316',
    lineHeight: 1,
  }),
  heroBrandSecondary: baseText({
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 1,
    textTransform: 'uppercase',
    letterSpacing: 2,
  }),
  heroDescription: baseText({
    fontFamily: 'Cairo',
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.6,
  }),
  primaryButton: {
    ...baseText({
      fontFamily: 'Cairo',
      fontSize: 18,
      fontWeight: '600',
      color: '#ffffff',
    }),
    backgroundColor: '#f97316',
    borderColor: 'transparent',
    hoverBackgroundColor: '#ea580c',
    hoverTextColor: '#ffffff',
  },
  secondaryButton: {
    ...baseText({
      fontFamily: 'Cairo',
      fontSize: 18,
      fontWeight: '600',
      color: '#ffffff',
    }),
    backgroundColor: 'transparent',
    borderColor: '#ffffff',
    hoverBackgroundColor: '#ffffff',
    hoverTextColor: '#1e3a5f',
  },
  overlay: {
    fromColor: '#0f2744',
    viaColor: '#1a3a5c',
    toColor: 'transparent',
    opacity: 80,
  },
};

export function normalizeHeroTypography(
  typography?: Partial<HeroTypography> | null,
): HeroTypography {
  const defaults = DEFAULT_HERO_TYPOGRAPHY;
  if (!typography) return { ...defaults };

  const mergeText = (
    base: HeroTextStyle,
    patch?: Partial<HeroTextStyle>,
  ): HeroTextStyle => ({ ...base, ...patch });

  const mergeButton = (
    base: HeroButtonStyle,
    patch?: Partial<HeroButtonStyle>,
  ): HeroButtonStyle => ({ ...base, ...patch });

  return {
    useBrandSplit: typography.useBrandSplit ?? defaults.useBrandSplit,
    heroTitle: mergeText(defaults.heroTitle, typography.heroTitle),
    heroSubtitle: mergeText(defaults.heroSubtitle, typography.heroSubtitle),
    heroBrandPrimary: mergeText(defaults.heroBrandPrimary, typography.heroBrandPrimary),
    heroBrandSecondary: mergeText(defaults.heroBrandSecondary, typography.heroBrandSecondary),
    heroDescription: mergeText(defaults.heroDescription, typography.heroDescription),
    primaryButton: mergeButton(defaults.primaryButton, typography.primaryButton),
    secondaryButton: mergeButton(defaults.secondaryButton, typography.secondaryButton),
    overlay: { ...defaults.overlay, ...typography.overlay },
  };
}

export function normalizeHeroContent(content: Partial<HeroContent> | null): HeroContent {
  const defaults = {
    headerImages: [
      'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/5117917/pexels-photo-5117917.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/4669408/pexels-photo-4669408.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    heroTitle: { ar: 'مرحباً بكم في', en: 'Welcome to', fr: 'Bienvenue à' },
    heroSubtitle: { ar: 'ciarTOU', en: 'ciarTOU', fr: 'ciarTOU' },
    heroBrandPrimary: { ar: 'ciar', en: 'ciar', fr: 'ciar' },
    heroBrandSecondary: { ar: 'TOU', en: 'TOU', fr: 'TOU' },
    heroDescription: {
      ar: 'رفيقكم المثالي لاستكشاف العالم. نقدم أفضل الخدمات السياحية عبر شبكة واسعة من المكاتب في أكثر من 50 دولة حول العالم',
      en: 'Your perfect companion to explore the world. We provide top tourism services through an extensive network of offices in more than 50 countries worldwide',
      fr: 'Votre compagnon idéal pour explorer le monde. Nous fournissons les meilleurs services touristiques grâce à un vaste réseau de bureaux dans plus de 50 pays dans le monde',
    },
    primaryButtonText: {
      ar: 'استكشف المكاتب السياحية',
      en: 'Explore Travel Offices',
      fr: 'Explorer les Bureaux de Voyage',
    },
    secondaryButtonText: {
      ar: 'اتصل بنا',
      en: 'Contact Us',
      fr: 'Contactez-nous',
    },
    typography: DEFAULT_HERO_TYPOGRAPHY,
    updatedAt: new Date().toISOString(),
  };

  if (!content) return defaults as HeroContent;

  return {
    ...defaults,
    ...content,
    heroTitle: { ...defaults.heroTitle, ...content.heroTitle },
    heroSubtitle: { ...defaults.heroSubtitle, ...content.heroSubtitle },
    heroBrandPrimary: {
      ...defaults.heroBrandPrimary,
      ...content.heroBrandPrimary,
    },
    heroBrandSecondary: {
      ...defaults.heroBrandSecondary,
      ...content.heroBrandSecondary,
    },
    heroDescription: { ...defaults.heroDescription, ...content.heroDescription },
    primaryButtonText: { ...defaults.primaryButtonText, ...content.primaryButtonText },
    secondaryButtonText: {
      ...defaults.secondaryButtonText,
      ...content.secondaryButtonText,
    },
    headerImages: content.headerImages?.length ? content.headerImages : defaults.headerImages,
    typography: normalizeHeroTypography(content.typography),
    updatedAt: content.updatedAt || new Date().toISOString(),
  };
}

export function heroTextStyleToCss(style: HeroTextStyle): CSSProperties {
  return {
    fontFamily: `'${style.fontFamily}', system-ui, sans-serif`,
    fontSize: `clamp(${Math.round(style.fontSize * 0.72)}px, 2.4vw, ${style.fontSize}px)`,
    fontWeight: style.fontWeight,
    color: style.color,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
    textTransform: style.textTransform,
    fontStyle: style.fontStyle,
  };
}

export function heroButtonStyleToCss(style: HeroButtonStyle): CSSProperties {
  return {
    ...heroTextStyleToCss(style),
    backgroundColor: style.backgroundColor,
    borderColor: style.borderColor,
    borderWidth: '1px',
    borderStyle: 'solid',
  };
}
