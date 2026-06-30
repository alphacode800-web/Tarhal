/**
 * تخزين بيانات لوحة التحكم في قاعدة SQLite الحقيقية
 * لحفظ التعديلات والصور أونلاين وجعلها تظهر على كل الأجهزة
 */
import { getDatabase } from './database.js';

export const ADMIN_KEYS = {
  countries: 'countries',
  offices: 'offices',
  offers: 'offers',
  settings: 'settings',
  heroContent: 'hero_content',
  supervisors: 'supervisors',
  hotels: 'hotels',
  carRentals: 'car_rentals',
  carVehicles: 'car_vehicles',
  taxiDelivery: 'taxi_delivery',
  flightTickets: 'flight_tickets',
  travelVisas: 'travel_visas',
  visitorStats: 'visitor_stats',
} as const;

let dbAvailable: boolean | null = null;

async function isDbAvailable(): Promise<boolean> {
  if (dbAvailable !== null) return dbAvailable;
  try {
    const db = await getDatabase();
    await db.get('SELECT 1 FROM admin_data LIMIT 1');
    dbAvailable = true;
  } catch {
    dbAvailable = false;
  }
  return dbAvailable;
}

/**
 * قراءة بيانات لوحة التحكم من قاعدة البيانات
 */
export async function getAdminData<T = unknown>(key: string): Promise<T | null> {
  try {
    if (!(await isDbAvailable())) return null;
    const db = await getDatabase();
    const row = await db.get<{ value: string }>(
      'SELECT value FROM admin_data WHERE key = ?',
      key
    );
    if (!row?.value) return null;
    return JSON.parse(row.value) as T;
  } catch (error) {
    console.error('[admin-store] getAdminData error:', key, error);
    return null;
  }
}

/**
 * حفظ بيانات لوحة التحكم في قاعدة البيانات
 */
export async function setAdminData(key: string, value: unknown): Promise<boolean> {
  try {
    if (!(await isDbAvailable())) return false;
    const db = await getDatabase();
    const valueStr = JSON.stringify(value);
    await db.run(
      `INSERT INTO admin_data (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
      key,
      valueStr
    );
    return true;
  } catch (error) {
    console.error('[admin-store] setAdminData error:', key, error);
    return false;
  }
}
