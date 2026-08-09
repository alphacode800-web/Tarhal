import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Send,
  Upload,
  CheckCircle,
  ArrowRight,
  User,
  Building2,
  Landmark,
  Heart,
  TrendingUp,
  Handshake,
  MoreHorizontal,
  Type,
  Image as ImageIcon,
  Link2,
  Film,
  Mail,
  MessageCircle,
  Globe2,
  Clock,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  dataManager,
  type AdPlacement,
  type AdvertiserType,
  type AdContentType,
} from '@/services/dataManager';
import {
  AD_PLACEMENTS,
  ADVERTISER_TYPES,
  AD_CONTENT_TYPES,
  AD_DURATIONS,
  AD_CURRENCIES,
  calculateAdFee,
  getPlacementHint,
  type AdDurationDays,
  type AdSubmitVia,
} from '@/data/ads';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContactFromSettings, resolveSocialUrl } from '@/data/socialPlatforms';
import { cn } from '@/lib/utils';

const TYPE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  user: User,
  building: Building2,
  landmark: Landmark,
  heart: Heart,
  trending: TrendingUp,
  handshake: Handshake,
  more: MoreHorizontal,
};

export default function Advertise() {
  const { language, isRTL } = useLanguage();
  const lang = (language === 'fr' ? 'fr' : language === 'en' ? 'en' : 'ar') as 'ar' | 'en' | 'fr';
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('#');
  const [videoUploading, setVideoUploading] = useState(false);

  const [form, setForm] = useState({
    advertiserType: 'company' as AdvertiserType,
    advertiserName: '',
    title: '',
    description: '',
    adType: 'general' as AdContentType,
    tags: '',
    specifications: '',
    remainingQty: '',
    productPrice: '',
    currency: 'SAR',
    discountPercent: '',
    advertiserPhone: '',
    whatsappLink: '',
    shipping: '',
    videoUrl: '',
    placement: 'home_after_services' as AdPlacement,
    durationDays: 30 as AdDurationDays,
    imageUrl: '',
    linkUrl: '',
    submitVia: 'email' as AdSubmitVia,
  });

  useEffect(() => {
    dataManager.getSettingsAsync().then((settings) => {
      const contact = getContactFromSettings(settings);
      setContactEmail(contact.email);
      setWhatsappUrl(resolveSocialUrl('whatsapp', settings.socialLinks || {}, contact));
    });
  }, []);

  const adFee = useMemo(
    () => calculateAdFee(form.placement, form.durationDays),
    [form.placement, form.durationDays]
  );

  const placementHint = useMemo(
    () => getPlacementHint(form.placement, lang === 'ar' ? 'ar' : 'en'),
    [form.placement, lang]
  );

  const contentType = AD_CONTENT_TYPES.find((t) => t.id === form.adType);

  const t = {
    pageTitle: lang === 'ar' ? 'إنشاء إعلان' : lang === 'fr' ? 'Créer une annonce' : 'Create Ad',
    pageSub:
      lang === 'ar'
        ? 'املأ التفاصيل أدناه لإرسال طلب إعلان على منصة CIAR'
        : 'Fill in the details below to submit your CIAR ad request',
    howTitle: lang === 'ar' ? 'كيف يعمل؟' : lang === 'fr' ? 'Comment ça marche ?' : 'How it works?',
    steps: [
      {
        title: lang === 'ar' ? 'أنشئ حساباً' : 'Create an account',
        desc:
          lang === 'ar'
            ? 'التسجيل مجاني وسريع — يمكنك المتابعة مباشرة ببياناتك.'
            : 'Registration is free and fast — continue with your details.',
      },
      {
        title: lang === 'ar' ? 'أرسل تفاصيل الإعلان' : 'Send ad details',
        desc:
          lang === 'ar'
            ? 'عبّئ النموذج بمعلومات جهتك وتفاصيل الإعلان.'
            : 'Fill the form with your entity and ad information.',
      },
      {
        title: lang === 'ar' ? 'الاشتراك والدفع' : 'Subscription & payment',
        desc:
          lang === 'ar'
            ? 'يُحسب المبلغ تلقائياً حسب المدة ومكان الظهور.'
            : 'The fee is calculated automatically by duration and placement.',
      },
      {
        title: lang === 'ar' ? 'انتظر الموافقة' : 'Wait for approval',
        desc:
          lang === 'ar'
            ? 'سنتواصل معك خلال 24–48 ساعة عمل.'
            : 'We will contact you within 24–48 business hours.',
      },
    ],
    classTitle: lang === 'ar' ? 'تصنيف المعلن' : 'Advertiser classification',
    classSub:
      lang === 'ar'
        ? 'اختر الفئة التي تمثلها: شخص، شركة، مؤسسة، أو غيرها'
        : 'Choose the category you represent',
    entityTitle: lang === 'ar' ? 'معلومات الجهة' : 'Entity information',
    entitySub: lang === 'ar' ? 'اسم الجهة أو الشركة المعلنة' : 'Name of the advertising entity',
    entityName: lang === 'ar' ? 'اسم الجهة / الشركة' : 'Entity / company name',
    entityPh: lang === 'ar' ? 'مثال: شركة النور للتجارة' : 'e.g. Al-Nour Trading Co.',
    detailsTitle: lang === 'ar' ? 'تفاصيل الإعلان' : 'Ad details',
    detailsSub:
      lang === 'ar'
        ? 'عنوان جذاب ووصف واضح لمحتوى الإعلان'
        : 'Attractive title and clear description',
    adTitle: lang === 'ar' ? 'عنوان الإعلان' : 'Ad title',
    adTitlePh:
      lang === 'ar' ? 'مثال: عروض خاصة على الوحدات السكنية' : 'e.g. Special offers on residential units',
    adDesc: lang === 'ar' ? 'تفاصيل الإعلان' : 'Ad description',
    adDescPh:
      lang === 'ar'
        ? 'صف منتجك أو خدمتك، العروض المتاحة، ومدة الإعلان...'
        : 'Describe your product or service, offers, and duration…',
    byTypeTitle: lang === 'ar' ? 'تفاصيل الإعلان حسب النوع' : 'Ad details by type',
    byTypeSub:
      lang === 'ar'
        ? 'اختر نوع الإعلان لتظهر الحقول المناسبة – أزياء، عقارات، إلكترونيات، خدمات، وغيرها'
        : 'Choose the ad type to show the matching fields',
    adType: lang === 'ar' ? 'نوع الإعلان' : 'Ad type',
    tags: lang === 'ar' ? 'الوسوم' : 'Tags',
    tagsPh: lang === 'ar' ? 'عرض، جديد، محلي' : 'offer, new, local',
    specs: lang === 'ar' ? 'مواصفات' : 'Specifications',
    qty: lang === 'ar' ? 'العدد المتبقي' : 'Remaining qty',
    price: lang === 'ar' ? 'السعر' : 'Price',
    currency: lang === 'ar' ? 'العملة' : 'Currency',
    discount: lang === 'ar' ? 'نسبة الحسم %' : 'Discount %',
    phone: lang === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp',
    waLink: lang === 'ar' ? 'رابط واتساب' : 'WhatsApp link',
    shipping: lang === 'ar' ? 'الشحن' : 'Shipping',
    shippingPh:
      lang === 'ar' ? 'مجاني داخل المدينة – 3 أيام توصيل' : 'Free in city – 3 days delivery',
    videoTitle: lang === 'ar' ? 'فيديو الإعلان' : 'Ad video',
    videoHint:
      lang === 'ar'
        ? 'ارفع فيديو من جهازك أو الصق رابطاً من يوتيوب، تيك توك، إنستغرام، فيسبوك، أو أي موقع'
        : 'Upload a video or paste a YouTube / TikTok / Instagram / Facebook link',
    uploadDevice: lang === 'ar' ? 'رفع من الجهاز' : 'Upload from device',
    feeTitle: lang === 'ar' ? 'مبلغ الإعلان' : 'Ad fee',
    feeHint:
      lang === 'ar'
        ? 'يُحسب تلقائياً حسب مدة الإعلان ومكان الظهور ولا يمكن تعديله'
        : 'Calculated automatically from duration and placement — not editable',
    feeIncludes: lang === 'ar' ? 'يشمل' : 'Includes',
    whereTitle: lang === 'ar' ? 'أين يظهر الإعلان؟' : 'Where does the ad appear?',
    placement: lang === 'ar' ? 'مكان الظهور' : 'Placement',
    position: lang === 'ar' ? 'الموضع' : 'Position',
    positionFirst: lang === 'ar' ? 'الموضع الأول' : 'First position',
    duration: lang === 'ar' ? 'مدة الإعلان' : 'Ad duration',
    linksTitle:
      lang === 'ar'
        ? 'روابط إضافية (اختياري – رابط الهدف أو صورة الإعلان)'
        : 'Additional links (optional – target link or image)',
    imageLink: lang === 'ar' ? 'رابط صورة' : 'Image link',
    link: lang === 'ar' ? 'رابط' : 'Link',
    optional: lang === 'ar' ? 'اختياري' : 'Optional',
    submitMethod: lang === 'ar' ? 'طريقة إرسال الطلب' : 'Request submission method',
    submitMethodSub:
      lang === 'ar'
        ? 'اختر إرسال الطلب لفريق CIAR عبر البريد أو واتساب'
        : 'Choose to send the request via email or WhatsApp',
    email: lang === 'ar' ? 'بريد إلكتروني' : 'Email',
    whatsapp: lang === 'ar' ? 'واتساب' : 'WhatsApp',
    waNeedPhone:
      lang === 'ar' ? 'يتطلب رقم هاتف في النموذج' : 'Requires a phone number in the form',
    submit: lang === 'ar' ? 'إرسال طلب الإعلان' : 'Send ad request',
    reviewNote:
      lang === 'ar'
        ? 'سيتم مراجعة طلبك خلال 24–48 ساعة عمل'
        : 'Your request will be reviewed within 24–48 business hours',
    required: lang === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields',
    success: lang === 'ar' ? 'تم استلام طلبك!' : 'Request received!',
    successDesc:
      lang === 'ar'
        ? 'سيراجع فريق CIAR إعلانك ويتواصل معك قريباً.'
        : 'Our team will review your ad and contact you soon.',
    browse: lang === 'ar' ? 'تصفح الإعلانات' : 'Browse ads',
  };

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageUpload = async (file: File) => {
    try {
      const { uploadImageToServer } = await import('@/utils/imageUtils');
      const url = await uploadImageToServer(file);
      if (url) update('imageUrl', url);
    } catch {
      /* ignore */
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      setVideoUploading(true);
      const { isValidVideoFile, getFileSizeMB, uploadVideoToServer } = await import('@/utils/videoUtils');
      if (!isValidVideoFile(file)) {
        alert(lang === 'ar' ? 'صيغة الفيديو غير مدعومة' : 'Unsupported video format');
        return;
      }
      if (getFileSizeMB(file) > 180) {
        alert(lang === 'ar' ? 'حجم الفيديو كبير جداً' : 'Video is too large');
        return;
      }
      const url = await uploadVideoToServer(file);
      if (url) update('videoUrl', url);
    } catch {
      alert(lang === 'ar' ? 'فشل رفع الفيديو' : 'Video upload failed');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.advertiserName.trim() || !form.title.trim() || !form.description.trim()) {
      alert(t.required);
      return;
    }
    if (form.submitVia === 'whatsapp' && !form.advertiserPhone.trim()) {
      alert(t.waNeedPhone);
      return;
    }

    setSaving(true);
    try {
      const typeLabel = ADVERTISER_TYPES.find((x) => x.id === form.advertiserType);
      const contentLabel = AD_CONTENT_TYPES.find((x) => x.id === form.adType);
      const created = await dataManager.addAdAsync({
        title: { ar: form.title.trim(), en: form.title.trim(), fr: form.title.trim() },
        description: {
          ar: form.description.trim(),
          en: form.description.trim(),
          fr: form.description.trim(),
        },
        advertiserName: form.advertiserName.trim(),
        advertiserType: form.advertiserType,
        advertiserPhone: form.advertiserPhone.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        linkUrl: form.linkUrl.trim() || undefined,
        videoUrl: form.videoUrl.trim() || undefined,
        adType: form.adType,
        category: contentLabel
          ? { ar: contentLabel.ar, en: contentLabel.en, fr: contentLabel.fr }
          : undefined,
        tags: form.tags
          .split(/[,،]/)
          .map((x) => x.trim())
          .filter(Boolean),
        specifications: form.specifications.trim() || undefined,
        remainingQty: form.remainingQty ? Number(form.remainingQty) : undefined,
        productPrice: form.productPrice ? Number(form.productPrice) : undefined,
        currency: form.currency,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
        whatsappLink: form.whatsappLink.trim() || undefined,
        shipping: form.shipping.trim() || undefined,
        placement: form.placement,
        positionLabel: t.positionFirst,
        durationDays: form.durationDays,
        adFee,
        adFeeCurrency: 'SAR',
        submitVia: form.submitVia,
        status: 'pending',
        isActive: false,
        isFeatured: false,
      });

      if (!created) return;

      const summary = [
        `طلب إعلان جديد – CIAR Tourism`,
        `تصنيف المعلن: ${typeLabel?.ar || form.advertiserType}`,
        `الجهة: ${form.advertiserName}`,
        `العنوان: ${form.title}`,
        `النوع: ${contentLabel?.ar || form.adType}`,
        `المكان: ${AD_PLACEMENTS.find((p) => p.id === form.placement)?.ar || form.placement}`,
        `المدة: ${form.durationDays} يوم`,
        `المبلغ: SAR ${adFee}`,
        `الهاتف: ${form.advertiserPhone || '-'}`,
        `الوصف: ${form.description}`,
      ].join('\n');

      if (form.submitVia === 'whatsapp' && whatsappUrl && whatsappUrl !== '#') {
        const msg = encodeURIComponent(summary);
        window.open(`${whatsappUrl}${whatsappUrl.includes('?') ? '&' : '?'}text=${msg}`, '_blank');
      } else if (form.submitVia === 'email' && contactEmail) {
        const subject = encodeURIComponent(`طلب إعلان CIAR – ${form.advertiserName}`);
        const body = encodeURIComponent(summary);
        window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`, '_blank');
      }

      setSubmitted(true);
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    'rounded-xl border border-slate-200 bg-white focus-visible:ring-tarhal-orange/30 focus-visible:border-tarhal-orange';
  const labelClass = 'text-sm font-semibold text-slate-700 mb-1.5 block';
  const sectionCard = 'rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm space-y-4';

  return (
    <Layout>
      <div
        className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/40 dark:from-slate-950 dark:to-slate-900 pt-28 pb-16"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold mb-3">
              <Megaphone className="h-3.5 w-3.5" />
              CIAR Ads
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t.pageTitle}</h1>
            <p className="text-slate-600 mt-2">{t.pageSub}</p>
          </div>

          {submitted ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center max-w-2xl mx-auto">
              <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-emerald-800 mb-2">{t.success}</h2>
              <p className="text-emerald-700/80 mb-6">{t.successDesc}</p>
              <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-600 text-white">
                <Link to="/ads">
                  {t.browse}
                  <ArrowRight className="h-4 w-4 ms-2" />
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
              <div className="space-y-5">
                {/* Advertiser classification */}
                <section className={sectionCard}>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{t.classTitle}</h2>
                    <p className="text-sm text-slate-500 mt-1">{t.classSub}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ADVERTISER_TYPES.map((item) => {
                      const Icon = TYPE_ICONS[item.icon] || MoreHorizontal;
                      const selected = form.advertiserType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => update('advertiserType', item.id)}
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm transition-all',
                            selected
                              ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                              : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-amber-300 hover:bg-white'
                          )}
                        >
                          <Icon className={cn('h-5 w-5', selected ? 'text-amber-600' : 'text-slate-500')} />
                          <span className="font-medium text-center leading-tight">{item[lang]}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Entity */}
                <section className={sectionCard}>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{t.entityTitle}</h2>
                    <p className="text-sm text-slate-500 mt-1">{t.entitySub}</p>
                  </div>
                  <div>
                    <label className={labelClass}>{t.entityName}</label>
                    <div className="relative">
                      <Building2 className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={form.advertiserName}
                        onChange={(e) => update('advertiserName', e.target.value)}
                        placeholder={t.entityPh}
                        className={cn(fieldClass, 'ps-10')}
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Ad details */}
                <section className={sectionCard}>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{t.detailsTitle}</h2>
                    <p className="text-sm text-slate-500 mt-1">{t.detailsSub}</p>
                  </div>
                  <div>
                    <label className={labelClass}>{t.adTitle}</label>
                    <div className="relative">
                      <Type className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={form.title}
                        onChange={(e) => update('title', e.target.value)}
                        placeholder={t.adTitlePh}
                        className={cn(fieldClass, 'ps-10')}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{t.adDesc}</label>
                    <Textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      placeholder={t.adDescPh}
                      className={fieldClass}
                      required
                    />
                  </div>
                </section>

                {/* Details by type */}
                <section className={sectionCard}>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{t.byTypeTitle}</h2>
                    <p className="text-sm text-slate-500 mt-1">{t.byTypeSub}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t.adType}</label>
                      <select
                        value={form.adType}
                        onChange={(e) => update('adType', e.target.value as AdContentType)}
                        className={cn(fieldClass, 'w-full h-10 px-3 text-sm')}
                      >
                        {AD_CONTENT_TYPES.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item[lang]}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500 mt-1.5">
                        {lang === 'ar' ? contentType?.hintAr : contentType?.hintEn}
                      </p>
                    </div>
                    <div>
                      <label className={labelClass}>{t.tags}</label>
                      <Input
                        value={form.tags}
                        onChange={(e) => update('tags', e.target.value)}
                        placeholder={t.tagsPh}
                        className={fieldClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>{t.specs}</label>
                      <Input
                        value={form.specifications}
                        onChange={(e) => update('specifications', e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.qty}</label>
                      <Input
                        type="number"
                        min={0}
                        value={form.remainingQty}
                        onChange={(e) => update('remainingQty', e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.price}</label>
                      <Input
                        type="number"
                        min={0}
                        value={form.productPrice}
                        onChange={(e) => update('productPrice', e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.currency}</label>
                      <select
                        value={form.currency}
                        onChange={(e) => update('currency', e.target.value)}
                        className={cn(fieldClass, 'w-full h-10 px-3 text-sm')}
                      >
                        {AD_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code} {c[lang]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>{t.discount}</label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={form.discountPercent}
                        onChange={(e) => update('discountPercent', e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className={labelClass}>{t.phone}</label>
                      <Input
                        value={form.advertiserPhone}
                        onChange={(e) => update('advertiserPhone', e.target.value)}
                        placeholder="+9665..."
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.waLink}</label>
                      <Input
                        value={form.whatsappLink}
                        onChange={(e) => update('whatsappLink', e.target.value)}
                        placeholder="https://wa.me/9665..."
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.shipping}</label>
                      <Textarea
                        rows={2}
                        value={form.shipping}
                        onChange={(e) => update('shipping', e.target.value)}
                        placeholder={t.shippingPh}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <Film className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{t.videoTitle}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{t.videoHint}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium cursor-pointer hover:bg-slate-50">
                        <Upload className="h-4 w-4" />
                        {videoUploading ? '…' : t.uploadDevice}
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                        />
                      </label>
                      <Input
                        value={form.videoUrl}
                        onChange={(e) => update('videoUrl', e.target.value)}
                        placeholder="https://youtube.com/..."
                        className={cn(fieldClass, 'flex-1')}
                      />
                    </div>
                  </div>
                </section>

                {/* Fee */}
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 md:p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">{t.feeTitle}</h2>
                  <p className="text-sm text-slate-600 mb-4">{t.feeHint}</p>
                  <div className="text-4xl font-extrabold text-amber-700 tracking-tight">SAR {adFee}</div>
                  <p className="text-sm text-amber-800/70 mt-1">
                    {t.feeIncludes} {adFee} SAR
                  </p>
                </section>

                {/* Placement */}
                <section className={sectionCard}>
                  <h2 className="text-lg font-bold text-slate-900">{t.whereTitle}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>{t.placement}</label>
                      <select
                        value={form.placement}
                        onChange={(e) => update('placement', e.target.value as AdPlacement)}
                        className={cn(fieldClass, 'w-full h-10 px-3 text-sm')}
                      >
                        {AD_PLACEMENTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p[lang]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>{t.position}</label>
                      <Input value={t.positionFirst} disabled className={cn(fieldClass, 'opacity-80')} />
                    </div>
                    <div>
                      <label className={labelClass}>{t.duration}</label>
                      <select
                        value={form.durationDays}
                        onChange={(e) => update('durationDays', Number(e.target.value) as AdDurationDays)}
                        className={cn(fieldClass, 'w-full h-10 px-3 text-sm')}
                      >
                        {AD_DURATIONS.map((d) => (
                          <option key={d.days} value={d.days}>
                            {d[lang]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {placementHint ? <p className="text-xs text-slate-500">{placementHint}</p> : null}
                </section>

                {/* Extra links */}
                <section className={sectionCard}>
                  <h2 className="text-lg font-bold text-slate-900">{t.linksTitle}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        {t.imageLink}{' '}
                        <span className="text-slate-400 font-normal">({t.optional})</span>
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-slate-400" />
                        <Input
                          value={form.imageUrl}
                          onChange={(e) => update('imageUrl', e.target.value)}
                          placeholder="https://"
                          className={cn(fieldClass, 'ps-10')}
                        />
                      </div>
                      <label className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer hover:underline">
                        <Upload className="h-3.5 w-3.5" />
                        {t.uploadDevice}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        />
                      </label>
                      {form.imageUrl ? (
                        <img
                          src={form.imageUrl}
                          alt=""
                          className="mt-2 h-28 w-full object-cover rounded-xl border"
                        />
                      ) : null}
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t.link} <span className="text-slate-400 font-normal">({t.optional})</span>
                      </label>
                      <div className="relative">
                        <Link2 className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-slate-400" />
                        <Input
                          value={form.linkUrl}
                          onChange={(e) => update('linkUrl', e.target.value)}
                          placeholder="https://"
                          className={cn(fieldClass, 'ps-10')}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Submit method */}
                <section className={sectionCard}>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{t.submitMethod}</h2>
                    <p className="text-sm text-slate-500 mt-1">{t.submitMethodSub}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => update('submitVia', 'email')}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-4 text-start transition-all',
                        form.submitVia === 'email'
                          ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                          : 'border-slate-200 hover:border-amber-300'
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{t.email}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[180px]">
                          {contactEmail || 'CIAR'}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => update('submitVia', 'whatsapp')}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-4 text-start transition-all',
                        form.submitVia === 'whatsapp'
                          ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                          : 'border-slate-200 hover:border-amber-300'
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{t.whatsapp}</div>
                        <div className="text-xs text-slate-500">{t.waNeedPhone}</div>
                      </div>
                    </button>
                  </div>
                </section>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 pb-4">
                  <p className="text-sm text-slate-500 flex items-center gap-2 order-2 sm:order-1">
                    <Globe2 className="h-4 w-4" />
                    <Clock className="h-4 w-4 -ms-1" />
                    {t.reviewNote}
                  </p>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="order-1 sm:order-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-8 h-12 text-base font-semibold shadow-md"
                  >
                    <Send className="h-4 w-4 me-2" />
                    {saving ? '…' : t.submit}
                  </Button>
                </div>
              </div>

              {/* How it works sidebar */}
              <aside className="lg:sticky lg:top-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-slate-900">{t.howTitle}</h2>
                <ol className="space-y-5">
                  {t.steps.map((step, i) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400 text-white text-sm font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link
                  to="/ads"
                  className="block text-center text-sm text-amber-700 hover:underline pt-2 border-t border-slate-100"
                >
                  {t.browse}
                </Link>
              </aside>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
