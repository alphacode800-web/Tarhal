/** إحداثيات تقريبية لعواصم الدول — لعرض المكاتب على الخريطة */
export const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  sudan: { lat: 15.5007, lng: 32.5599 },
  saudi: { lat: 24.7136, lng: 46.6753 },
  uae: { lat: 25.2048, lng: 55.2708 },
  egypt: { lat: 30.0444, lng: 31.2357 },
  turkey: { lat: 41.0082, lng: 28.9784 },
  morocco: { lat: 33.5731, lng: -7.5898 },
  jordan: { lat: 31.9539, lng: 35.9106 },
  lebanon: { lat: 33.8547, lng: 35.8623 },
  tunisia: { lat: 36.8065, lng: 10.1815 },
  algeria: { lat: 36.7538, lng: 3.0588 },
  iraq: { lat: 33.3152, lng: 44.3661 },
  yemen: { lat: 15.3694, lng: 44.191 },
  syria: { lat: 33.5138, lng: 36.2765 },
  libya: { lat: 32.8872, lng: 13.1913 },
  oman: { lat: 23.5859, lng: 58.4059 },
  kuwait: { lat: 29.3759, lng: 47.9774 },
  qatar: { lat: 25.2854, lng: 51.531 },
  bahrain: { lat: 26.0667, lng: 50.5577 },
};

export function getCountryCoordinates(countryId: string): { lat: number; lng: number } {
  return COUNTRY_COORDINATES[countryId] ?? { lat: 15.5007, lng: 32.5599 };
}

export function resolveOfficeCoordinates(
  countryId: string,
  coordinates?: { lat: number; lng: number } | null,
): { lat: number; lng: number } {
  if (coordinates?.lat && coordinates?.lng) {
    return coordinates;
  }
  return getCountryCoordinates(countryId);
}
