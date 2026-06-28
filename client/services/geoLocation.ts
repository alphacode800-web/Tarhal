// Service to detect user's country from IP address

export interface GeoLocationData {
  country: string;
  countryCode: string;
  countryName: string;
}

/**
 * Detect user's country from IP address
 * Uses multiple free APIs as fallback
 */
export async function detectUserCountry(): Promise<GeoLocationData | null> {
  try {
    // Try ipapi.co first (free tier: 1000 requests/day)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data.country_code && data.country_name) {
          return {
            country: data.country_code.toLowerCase(),
            countryCode: data.country_code,
            countryName: data.country_name,
          };
        }
      }
    } catch (e) {
      console.log('[GeoLocation] ipapi.co failed, trying fallback...');
    }

    // Fallback to ip-api.com (free tier: 45 requests/minute)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch('https://ip-api.com/json/?fields=status,country,countryCode', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.countryCode && data.country) {
          return {
            country: data.countryCode.toLowerCase(),
            countryCode: data.countryCode,
            countryName: data.country,
          };
        }
      }
    } catch (e) {
      console.log('[GeoLocation] ip-api.com failed, trying last fallback...');
    }

    // Last fallback: use browser's timezone to guess country
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Map common timezones to countries
      const timezoneToCountry: Record<string, string> = {
        'Africa/Cairo': 'eg',
        'Asia/Riyadh': 'sa',
        'Asia/Dubai': 'ae',
        'Asia/Kuwait': 'kw',
        'Asia/Bahrain': 'bh',
        'Asia/Qatar': 'qa',
        'Asia/Muscat': 'om',
        'Asia/Amman': 'jo',
        'Asia/Beirut': 'lb',
        'Asia/Damascus': 'sy',
        'Asia/Baghdad': 'iq',
        'Africa/Khartoum': 'sd',
        'Africa/Tunis': 'tn',
        'Africa/Algiers': 'dz',
        'Africa/Tripoli': 'ly',
        'Africa/Casablanca': 'ma',
        'Europe/Istanbul': 'tr',
        'Asia/Tehran': 'ir',
        'Asia/Kabul': 'af',
        'Asia/Karachi': 'pk',
        'Asia/Dhaka': 'bd',
        'Asia/Male': 'mv',
        'Asia/Jakarta': 'id',
        'Asia/Kuala_Lumpur': 'my',
        'Asia/Brunei': 'bn',
        'Europe/Paris': 'fr',
        'Europe/Madrid': 'es',
        'Europe/Rome': 'it',
        'Europe/Berlin': 'de',
        'Europe/Athens': 'gr',
        'Europe/Lisbon': 'pt',
        'Europe/Amsterdam': 'nl',
        'Europe/Brussels': 'be',
        'Europe/Zurich': 'ch',
        'Europe/Vienna': 'at',
        'Europe/London': 'uk',
        'Europe/Dublin': 'ie',
        'Europe/Warsaw': 'pl',
        'Europe/Prague': 'cz',
        'Europe/Budapest': 'hu',
        'Europe/Bucharest': 'ro',
        'Europe/Sofia': 'bg',
        'Europe/Zagreb': 'hr',
        'Europe/Oslo': 'no',
        'Europe/Stockholm': 'se',
        'Europe/Copenhagen': 'dk',
        'Europe/Helsinki': 'fi',
        'Atlantic/Reykjavik': 'is',
        'Europe/Moscow': 'ru',
        'Europe/Kiev': 'ua',
        'Europe/Belgrade': 'rs',
        'Europe/Ljubljana': 'si',
      };

      const countryCode = timezoneToCountry[timezone];
      if (countryCode) {
        return {
          country: countryCode,
          countryCode: countryCode.toUpperCase(),
          countryName: 'Detected from timezone',
        };
      }
    } catch (e) {
      console.error('[GeoLocation] Timezone detection failed:', e);
    }

    return null;
  } catch (error) {
    console.error('[GeoLocation] Error detecting country:', error);
    return null;
  }
}

/**
 * Map country codes to country IDs in our system
 */
export function mapCountryCodeToId(countryCode: string): string | null {
  const codeToIdMap: Record<string, string> = {
    'sd': 'sudan',
    'sa': 'saudi',
    'ae': 'uae',
    'eg': 'egypt',
    'ma': 'morocco',
    'jo': 'jordan',
    'lb': 'lebanon',
    'sy': 'syria',
    'iq': 'iraq',
    'kw': 'kuwait',
    'bh': 'bahrain',
    'qa': 'qatar',
    'om': 'oman',
    'ye': 'yemen',
    'ps': 'palestine',
    'tn': 'tunisia',
    'dz': 'algeria',
    'ly': 'libya',
    'mr': 'mauritania',
    'so': 'somalia',
    'dj': 'djibouti',
    'km': 'comoros',
    'tr': 'turkey',
    'ir': 'iran',
    'af': 'afghanistan',
    'pk': 'pakistan',
    'bd': 'bangladesh',
    'mv': 'maldives',
    'id': 'indonesia',
    'my': 'malaysia',
    'bn': 'brunei',
    'fr': 'france',
    'es': 'spain',
    'it': 'italy',
    'de': 'germany',
    'gr': 'greece',
    'pt': 'portugal',
    'nl': 'netherlands',
    'be': 'belgium',
    'ch': 'switzerland',
    'at': 'austria',
    'gb': 'uk',
    'ie': 'ireland',
    'pl': 'poland',
    'cz': 'czech',
    'hu': 'hungary',
    'ro': 'romania',
    'bg': 'bulgaria',
    'hr': 'croatia',
    'no': 'norway',
    'se': 'sweden',
    'dk': 'denmark',
    'fi': 'finland',
    'is': 'iceland',
    'ru': 'russia',
    'ua': 'ukraine',
    'rs': 'serbia',
    'si': 'slovenia',
  };

  return codeToIdMap[countryCode.toLowerCase()] || null;
}
