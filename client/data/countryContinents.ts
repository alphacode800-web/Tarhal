/** تصنيف القارات للدول — يُستخدم عند غياب الحقل أو تصحيح أخطاء قديمة */
export const COUNTRY_CONTINENT_BY_ID: Record<string, string> = {
  sudan: 'africa',
  egypt: 'africa',
  morocco: 'africa',
  tunisia: 'africa',
  algeria: 'africa',
  libya: 'africa',
  mauritania: 'africa',
  somalia: 'africa',
  djibouti: 'africa',
  comoros: 'africa',
  saudi: 'asia',
  uae: 'asia',
  jordan: 'asia',
  lebanon: 'asia',
  syria: 'asia',
  iraq: 'asia',
  kuwait: 'asia',
  bahrain: 'asia',
  qatar: 'asia',
  oman: 'asia',
  yemen: 'asia',
  palestine: 'asia',
  turkey: 'asia',
  iran: 'asia',
  france: 'europe',
  spain: 'europe',
  italy: 'europe',
  germany: 'europe',
  uk: 'europe',
};

export function resolveCountryContinent(
  countryId: string,
  countryName?: { ar?: string; en?: string },
  existing?: string,
): string {
  if (COUNTRY_CONTINENT_BY_ID[countryId]) {
    return COUNTRY_CONTINENT_BY_ID[countryId];
  }
  if (countryName?.ar === 'مصر' || countryName?.en === 'Egypt') {
    return 'africa';
  }
  return existing || 'asia';
}
