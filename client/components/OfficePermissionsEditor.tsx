import {
  mergeOfficePermissions,
  servicesFromPermissions,
  OFFICE_PERMISSION_KEYS,
  OFFICE_PERMISSION_LABELS,
  type OfficePermissions,
  type OfficePermissionKey,
} from '@/services/dataManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield } from 'lucide-react';

interface Props {
  value?: Partial<OfficePermissions> | null;
  onChange: (permissions: OfficePermissions) => void;
  /** Dark admin panels vs light modals */
  variant?: 'light' | 'dark';
}

export default function OfficePermissionsEditor({ value, onChange, variant = 'light' }: Props) {
  const { language } = useLanguage();
  const lang = (language === 'fr' ? 'fr' : language === 'en' ? 'en' : 'ar') as 'ar' | 'en' | 'fr';
  const getLocalizedText = (ar: string, en: string, fr: string) =>
    lang === 'ar' ? ar : lang === 'fr' ? fr : en;
  const permissions = mergeOfficePermissions(value);

  const toggle = (key: OfficePermissionKey, checked: boolean) => {
    onChange({ ...permissions, [key]: checked });
  };

  const setAll = (checked: boolean) => {
    const next = { ...permissions };
    for (const key of OFFICE_PERMISSION_KEYS) next[key] = checked;
    onChange(next);
  };

  const enabledCount = OFFICE_PERMISSION_KEYS.filter((k) => permissions[k]).length;
  const isDark = variant === 'dark';

  return (
    <div
      className={
        isDark
          ? 'rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3'
          : 'rounded-2xl border border-blue-100 bg-blue-50/60 p-4 space-y-3'
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Shield className={`h-4 w-4 ${isDark ? 'text-violet-300' : 'text-blue-600'}`} />
          <h4 className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
            {getLocalizedText('صلاحيات المكتب', 'Office Permissions', 'Permissions du bureau')}
          </h4>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            ({enabledCount}/{OFFICE_PERMISSION_KEYS.length})
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-white/10 text-slate-200 hover:bg-white/15' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}`}
          >
            {getLocalizedText('تحديد الكل', 'Select all', 'Tout sélectionner')}
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-white/10 text-slate-200 hover:bg-white/15' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {getLocalizedText('إلغاء الكل', 'Clear all', 'Tout effacer')}
          </button>
        </div>
      </div>

      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
        {getLocalizedText(
          'حدد الخدمات التي يُسمح لهذا المكتب بتقديمها للزوار.',
          'Choose which services this office is allowed to offer visitors.',
          'Choisissez les services que ce bureau peut proposer aux visiteurs.'
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {OFFICE_PERMISSION_KEYS.map((key) => (
          <label
            key={key}
            className={`flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2 transition-colors ${
              isDark
                ? permissions[key]
                  ? 'bg-violet-500/15 border border-violet-400/30'
                  : 'bg-slate-950/40 border border-white/5 hover:border-white/15'
                : permissions[key]
                  ? 'bg-white border border-blue-300 shadow-sm'
                  : 'bg-white/70 border border-gray-200 hover:border-blue-200'
            }`}
          >
            <input
              type="checkbox"
              checked={permissions[key]}
              onChange={(e) => toggle(key, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={`text-sm ${isDark ? 'text-slate-100' : 'text-gray-700'}`}>
              {OFFICE_PERMISSION_LABELS[key][lang]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

/** Apply permissions and sync marketing `services` labels before save */
export function withSyncedOfficePermissions<
  T extends {
    permissions?: Partial<OfficePermissions> | null;
    services?: { ar: string[]; en: string[]; fr: string[] };
  },
>(office: T): T {
  const permissions = mergeOfficePermissions(office.permissions);
  return {
    ...office,
    permissions,
    services: servicesFromPermissions(permissions),
  };
}
