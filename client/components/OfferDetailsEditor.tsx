import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { TourOfferDetails } from '@/data/offerDetails';

interface OfferDetailsEditorProps {
  details: TourOfferDetails;
  onChange: (details: TourOfferDetails) => void;
  label: (ar: string, en: string, fr: string) => string;
}

function linesToList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function listToLines(items?: string[]): string {
  return (items || []).join('\n');
}

function updateText(
  details: TourOfferDetails,
  field: keyof Pick<TourOfferDetails, 'where' | 'what' | 'how' | 'when' | 'withWhat' | 'why'>,
  lang: 'ar' | 'en' | 'fr',
  value: string,
): TourOfferDetails {
  return {
    ...details,
    [field]: {
      ar: details[field]?.ar || '',
      en: details[field]?.en || '',
      fr: details[field]?.fr || '',
      [lang]: value,
    },
  };
}

function updateList(
  details: TourOfferDetails,
  field: 'highlights' | 'inclusions' | 'exclusions',
  lang: 'ar' | 'en' | 'fr',
  value: string,
): TourOfferDetails {
  return {
    ...details,
    [field]: {
      ar: details[field]?.ar || [],
      en: details[field]?.en || [],
      fr: details[field]?.fr || [],
      [lang]: linesToList(value),
    },
  };
}

export default function OfferDetailsEditor({ details, onChange, label }: OfferDetailsEditorProps) {
  const sections: Array<{
    key: keyof Pick<TourOfferDetails, 'where' | 'what' | 'how' | 'when' | 'withWhat' | 'why'>;
    titleAr: string;
    titleEn: string;
    titleFr: string;
  }> = [
    { key: 'where', titleAr: 'أين؟', titleEn: 'Where?', titleFr: 'Où ?' },
    { key: 'what', titleAr: 'ماذا؟', titleEn: 'What?', titleFr: 'Quoi ?' },
    { key: 'how', titleAr: 'كيف؟', titleEn: 'How?', titleFr: 'Comment ?' },
    { key: 'when', titleAr: 'متى؟', titleEn: 'When?', titleFr: 'Quand ?' },
    { key: 'withWhat', titleAr: 'بماذا؟ (ما يشمله البرنامج)', titleEn: 'With what? (included)', titleFr: 'Avec quoi ?' },
    { key: 'why', titleAr: 'لماذا؟', titleEn: 'Why?', titleFr: 'Pourquoi ?' },
  ];

  return (
    <div className="space-y-6 rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-5">
      <div>
        <h4 className="text-lg font-bold text-violet-900">
          {label('تفاصيل الجولة (أين / ماذا / كيف / متى / بماذا / لماذا)', 'Tour details (5W+H)', 'Détails du circuit')}
        </h4>
        <p className="text-sm text-violet-700 mt-1">
          {label(
            'اترك الحقول فارغة ليُولَّد المحتوى تلقائياً من بيانات العرض والدولة.',
            'Leave empty to auto-generate from offer and country data.',
            'Laissez vide pour génération automatique.',
          )}
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.key} className="space-y-2">
          <p className="text-sm font-semibold text-gray-800">{label(section.titleAr, section.titleEn, section.titleFr)}</p>
          <Textarea
            value={details[section.key]?.ar || ''}
            onChange={(e) => onChange(updateText(details, section.key, 'ar', e.target.value))}
            placeholder={label('النص بالعربية', 'Arabic text', 'Texte arabe')}
            rows={2}
            className="rounded-xl"
          />
          <div className="grid md:grid-cols-2 gap-2">
            <Textarea
              value={details[section.key]?.en || ''}
              onChange={(e) => onChange(updateText(details, section.key, 'en', e.target.value))}
              placeholder="English"
              rows={2}
              className="rounded-xl text-sm"
            />
            <Textarea
              value={details[section.key]?.fr || ''}
              onChange={(e) => onChange(updateText(details, section.key, 'fr', e.target.value))}
              placeholder="Français"
              rows={2}
              className="rounded-xl text-sm"
            />
          </div>
        </div>
      ))}

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label('المميزات (سطر لكل ميزة)', 'Highlights (one per line)', 'Points forts')}
          </label>
          <Textarea
            value={listToLines(details.highlights?.ar)}
            onChange={(e) => onChange(updateList(details, 'highlights', 'ar', e.target.value))}
            rows={4}
            className="rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label('يشمل البرنامج', 'Inclusions', 'Inclus')}
          </label>
          <Textarea
            value={listToLines(details.inclusions?.ar)}
            onChange={(e) => onChange(updateList(details, 'inclusions', 'ar', e.target.value))}
            rows={4}
            className="rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label('لا يشمل', 'Exclusions', 'Non inclus')}
          </label>
          <Textarea
            value={listToLines(details.exclusions?.ar)}
            onChange={(e) => onChange(updateList(details, 'exclusions', 'ar', e.target.value))}
            rows={4}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label('نسبة الخصم %', 'Discount %', 'Remise %')}
          </label>
          <Input
            type="number"
            min={0}
            max={90}
            value={details.discountPercent ?? ''}
            onChange={(e) =>
              onChange({
                ...details,
                discountPercent: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            className="rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label('السعر قبل الخصم', 'Original price', 'Prix initial')}
          </label>
          <Input
            type="number"
            min={0}
            value={details.originalPrice ?? ''}
            onChange={(e) =>
              onChange({
                ...details,
                originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label('نص شارة الخصم', 'Discount badge text', 'Texte remise')}
          </label>
          <Input
            value={details.discountLabel?.ar || ''}
            onChange={(e) =>
              onChange({
                ...details,
                discountLabel: {
                  ar: e.target.value,
                  en: details.discountLabel?.en || '',
                  fr: details.discountLabel?.fr || '',
                },
              })
            }
            placeholder={label('خصم محدود', 'Limited offer', 'Offre limitée')}
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
