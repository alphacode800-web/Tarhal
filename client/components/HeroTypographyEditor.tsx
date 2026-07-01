import {
  HERO_FONT_OPTIONS,
  HERO_FONT_SIZE_OPTIONS,
  HERO_FONT_WEIGHT_OPTIONS,
  HERO_LETTER_SPACING_OPTIONS,
  HERO_LINE_HEIGHT_OPTIONS,
  type HeroButtonStyle,
  type HeroOverlayStyle,
  type HeroTextStyle,
  type HeroTypography,
} from '@/data/heroTypography';
import FriendlyColorPicker from '@/components/admin/FriendlyColorPicker';

interface HeroTypographyEditorProps {
  typography: HeroTypography;
  onChange: (typography: HeroTypography) => void;
  getLocalizedText: (ar: string, en: string, fr: string) => string;
}

function nearestOption<T extends { value: number }>(options: readonly T[], value: number): number {
  return options.reduce((best, opt) =>
    Math.abs(opt.value - value) < Math.abs(best - value) ? opt.value : best,
  options[0]?.value ?? value);
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: readonly { value: string | number; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-200 mb-2">{label}</label>
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-xl bg-slate-900/60 border border-white/10 text-slate-100 text-sm px-3"
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)} className="text-gray-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextStyleFields({
  title,
  style,
  onChange,
  getLocalizedText,
  showTransform = true,
}: {
  title: string;
  style: HeroTextStyle;
  onChange: (style: HeroTextStyle) => void;
  getLocalizedText: HeroTypographyEditorProps['getLocalizedText'];
  showTransform?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 space-y-4">
      <h5 className="text-base font-semibold text-cyan-200">{title}</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label={getLocalizedText('نوع الخط', 'Font', 'Police')}
          value={style.fontFamily}
          onChange={(fontFamily) => onChange({ ...style, fontFamily })}
          options={HERO_FONT_OPTIONS}
        />
        <SelectField
          label={getLocalizedText('حجم الخط', 'Size', 'Taille')}
          value={nearestOption(HERO_FONT_SIZE_OPTIONS, style.fontSize)}
          onChange={(v) => onChange({ ...style, fontSize: Number(v) })}
          options={HERO_FONT_SIZE_OPTIONS}
        />
        <SelectField
          label={getLocalizedText('سُمك الخط', 'Weight', 'Épaisseur')}
          value={style.fontWeight}
          onChange={(fontWeight) => onChange({ ...style, fontWeight })}
          options={HERO_FONT_WEIGHT_OPTIONS}
        />
        <SelectField
          label={getLocalizedText('ارتفاع السطر', 'Line spacing', 'Interligne')}
          value={nearestOption(HERO_LINE_HEIGHT_OPTIONS, style.lineHeight)}
          onChange={(v) => onChange({ ...style, lineHeight: Number(v) })}
          options={HERO_LINE_HEIGHT_OPTIONS}
        />
        <SelectField
          label={getLocalizedText('تباعد الحروف', 'Letter spacing', 'Espacement')}
          value={nearestOption(HERO_LETTER_SPACING_OPTIONS, style.letterSpacing)}
          onChange={(v) => onChange({ ...style, letterSpacing: Number(v) })}
          options={HERO_LETTER_SPACING_OPTIONS}
        />
        {showTransform && (
          <>
            <SelectField
              label={getLocalizedText('شكل الأحرف', 'Letter case', 'Casse')}
              value={style.textTransform}
              onChange={(textTransform) =>
                onChange({ ...style, textTransform: textTransform as HeroTextStyle['textTransform'] })
              }
              options={[
                { value: 'none', label: getLocalizedText('كما هو', 'As typed', 'Tel quel') },
                { value: 'uppercase', label: getLocalizedText('أحرف كبيرة', 'All caps', 'Majuscules') },
                { value: 'lowercase', label: getLocalizedText('أحرف صغيرة', 'All lowercase', 'Minuscules') },
                { value: 'capitalize', label: getLocalizedText('أول حرف كبير', 'Capitalize', 'Capitaliser') },
              ]}
            />
            <SelectField
              label={getLocalizedText('نمط الكتابة', 'Style', 'Style')}
              value={style.fontStyle}
              onChange={(fontStyle) =>
                onChange({ ...style, fontStyle: fontStyle as HeroTextStyle['fontStyle'] })
              }
              options={[
                { value: 'normal', label: getLocalizedText('عادي', 'Normal', 'Normal') },
                { value: 'italic', label: getLocalizedText('مائل', 'Italic', 'Italique') },
              ]}
            />
          </>
        )}
      </div>
      <FriendlyColorPicker
        label={getLocalizedText('لون النص', 'Text color', 'Couleur du texte')}
        hint={getLocalizedText('اضغط على المربع الملون لاختيار اللون', 'Click the color box to pick a color', 'Cliquez sur la couleur')}
        value={/^#[0-9A-Fa-f]{6}$/.test(style.color) ? style.color : '#ffffff'}
        onChange={(color) => onChange({ ...style, color })}
      />
    </div>
  );
}

function ButtonStyleFields({
  title,
  style,
  onChange,
  getLocalizedText,
}: {
  title: string;
  style: HeroButtonStyle;
  onChange: (style: HeroButtonStyle) => void;
  getLocalizedText: HeroTypographyEditorProps['getLocalizedText'];
}) {
  const pickColor = (key: keyof HeroButtonStyle, label: string, hint: string) => (
    <FriendlyColorPicker
      label={label}
      hint={hint}
      value={/^#[0-9A-Fa-f]{6}$/.test(String(style[key])) ? String(style[key]) : '#ffffff'}
      onChange={(color) => onChange({ ...style, [key]: color })}
    />
  );

  return (
    <div className="space-y-4">
      <TextStyleFields
        title={title}
        style={style}
        onChange={onChange}
        getLocalizedText={getLocalizedText}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
        {pickColor(
          'backgroundColor',
          getLocalizedText('لون خلفية الزر', 'Button background', 'Fond du bouton'),
          getLocalizedText('لون الخلفية الأساسي للزر', 'Main button background', 'Couleur de fond'),
        )}
        {pickColor(
          'borderColor',
          getLocalizedText('لون إطار الزر', 'Button border', 'Bordure'),
          getLocalizedText('لون الحدود حول الزر', 'Border around button', 'Couleur de bordure'),
        )}
        {pickColor(
          'hoverBackgroundColor',
          getLocalizedText('لون الخلفية عند التمرير', 'Hover background', 'Fond au survol'),
          getLocalizedText('يظهر عند مرور المؤشر فوق الزر', 'Shown when hovering', 'Au survol'),
        )}
        {pickColor(
          'hoverTextColor',
          getLocalizedText('لون النص عند التمرير', 'Hover text', 'Texte au survol'),
          getLocalizedText('لون كتابة الزر عند التمرير', 'Text color on hover', 'Couleur du texte au survol'),
        )}
      </div>
    </div>
  );
}

export default function HeroTypographyEditor({
  typography,
  onChange,
  getLocalizedText,
}: HeroTypographyEditorProps) {
  const update = (patch: Partial<HeroTypography>) => onChange({ ...typography, ...patch });
  const updateOverlay = (patch: Partial<HeroOverlayStyle>) =>
    update({ overlay: { ...typography.overlay, ...patch } });

  const opacityLabel =
    typography.overlay.opacity <= 30
      ? getLocalizedText('خفيفة', 'Light', 'Légère')
      : typography.overlay.opacity <= 60
        ? getLocalizedText('متوسطة', 'Medium', 'Moyenne')
        : typography.overlay.opacity <= 85
          ? getLocalizedText('قوية', 'Strong', 'Forte')
          : getLocalizedText('كثيفة جداً', 'Very strong', 'Très forte');

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-lg font-semibold text-slate-100 mb-1">
          {getLocalizedText('تنسيق الخطوط والألوان', 'Fonts and colors', 'Polices et couleurs')}
        </h4>
        <p className="text-sm text-slate-400">
          {getLocalizedText(
            'اختر الخطوط والألوان بسهولة — بدون رموز أو أكواد',
            'Pick fonts and colors easily — no codes needed',
            'Choisissez polices et couleurs facilement',
          )}
        </p>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 cursor-pointer">
        <input
          type="checkbox"
          checked={typography.useBrandSplit}
          onChange={(e) => update({ useBrandSplit: e.target.checked })}
          className="h-4 w-4 accent-cyan-500"
        />
        <span className="text-sm text-slate-200">
          {getLocalizedText(
            'عرض الشعار على جزئين منفصلين',
            'Show brand in two separate parts',
            'Afficher la marque en deux parties',
          )}
        </span>
      </label>

      <TextStyleFields
        title={getLocalizedText('العنوان الرئيسي', 'Main title', 'Titre principal')}
        style={typography.heroTitle}
        onChange={(heroTitle) => update({ heroTitle })}
        getLocalizedText={getLocalizedText}
      />

      {typography.useBrandSplit ? (
        <>
          <TextStyleFields
            title={getLocalizedText('الجزء الأول من الشعار', 'Brand — first part', 'Marque — 1re partie')}
            style={typography.heroBrandPrimary}
            onChange={(heroBrandPrimary) => update({ heroBrandPrimary })}
            getLocalizedText={getLocalizedText}
          />
          <TextStyleFields
            title={getLocalizedText('الجزء الثاني من الشعار', 'Brand — second part', 'Marque — 2e partie')}
            style={typography.heroBrandSecondary}
            onChange={(heroBrandSecondary) => update({ heroBrandSecondary })}
            getLocalizedText={getLocalizedText}
          />
        </>
      ) : (
        <TextStyleFields
          title={getLocalizedText('العنوان الفرعي', 'Subtitle', 'Sous-titre')}
          style={typography.heroSubtitle}
          onChange={(heroSubtitle) => update({ heroSubtitle })}
          getLocalizedText={getLocalizedText}
        />
      )}

      <TextStyleFields
        title={getLocalizedText('الوصف', 'Description', 'Description')}
        style={typography.heroDescription}
        onChange={(heroDescription) => update({ heroDescription })}
        getLocalizedText={getLocalizedText}
      />

      <ButtonStyleFields
        title={getLocalizedText('الزر الرئيسي', 'Main button', 'Bouton principal')}
        style={typography.primaryButton}
        onChange={(primaryButton) => update({ primaryButton })}
        getLocalizedText={getLocalizedText}
      />

      <ButtonStyleFields
        title={getLocalizedText('الزر الثانوي', 'Secondary button', 'Bouton secondaire')}
        style={typography.secondaryButton}
        onChange={(secondaryButton) => update({ secondaryButton })}
        getLocalizedText={getLocalizedText}
      />

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 space-y-4">
        <h5 className="text-base font-semibold text-cyan-200">
          {getLocalizedText('طبقة اللون فوق صور الخلفية', 'Color overlay on images', 'Couche sur les images')}
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FriendlyColorPicker
            label={getLocalizedText('لون البداية', 'Start color', 'Couleur de départ')}
            hint={getLocalizedText('من جهة بداية الصورة', 'From the start side', 'Côté départ')}
            value={typography.overlay.fromColor}
            onChange={(fromColor) => updateOverlay({ fromColor })}
          />
          <FriendlyColorPicker
            label={getLocalizedText('لون الوسط', 'Middle color', 'Couleur centrale')}
            hint={getLocalizedText('في منتصف التدرج', 'Middle of gradient', 'Au milieu')}
            value={typography.overlay.viaColor}
            onChange={(viaColor) => updateOverlay({ viaColor })}
          />
          <FriendlyColorPicker
            label={getLocalizedText('لون النهاية', 'End color', 'Couleur de fin')}
            hint={getLocalizedText('من جهة نهاية الصورة', 'Toward the end', 'Côté fin')}
            value={typography.overlay.toColor}
            onChange={(toColor) => updateOverlay({ toColor })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            {getLocalizedText('قوة الطبقة اللونية', 'Overlay strength', 'Intensité')}
            <span className="text-cyan-300 mr-2">— {opacityLabel}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={typography.overlay.opacity}
            onChange={(e) => updateOverlay({ opacity: Number(e.target.value) })}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
