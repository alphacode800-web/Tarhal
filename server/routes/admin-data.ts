import express, { RequestHandler } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { getAdminData, setAdminData, ADMIN_KEYS } from '../database/admin-store.js';
import { serverDataDir } from '../utils/paths.js';

const DATA_DIR = serverDataDir();
const COUNTRIES_FILE = path.join(DATA_DIR, 'countries.json');
const OFFICES_FILE = path.join(DATA_DIR, 'offices.json');
const OFFERS_FILE = path.join(DATA_DIR, 'offers.json');
const HOTELS_FILE = path.join(DATA_DIR, 'hotels.json');
const CAR_RENTALS_FILE = path.join(DATA_DIR, 'car-rentals.json');
const CAR_VEHICLES_FILE = path.join(DATA_DIR, 'car-vehicles.json');
const TAXI_DELIVERY_FILE = path.join(DATA_DIR, 'taxi-delivery.json');
const FLIGHT_TICKETS_FILE = path.join(DATA_DIR, 'flight-tickets.json');
const TRAVEL_VISAS_FILE = path.join(DATA_DIR, 'travel-visas.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const HERO_CONTENT_FILE = path.join(DATA_DIR, 'hero-content.json');
const SUPERVISORS_FILE = path.join(DATA_DIR, 'supervisors.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Helper function to read JSON file
async function readJsonFile(filePath: string, defaultValue: any = null) {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    
    // Check if file is empty
    if (!data || data.trim() === '') {
      console.log(`File ${filePath} is empty, returning default value`);
      return defaultValue;
    }
    
    // Try to parse JSON
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error(`JSON parse error in ${filePath}:`, parseError);
      // Delete corrupted file and return default
      try {
        await fs.unlink(filePath);
        console.log(`Deleted corrupted file: ${filePath}`);
      } catch (unlinkError) {
        console.error(`Could not delete corrupted file:`, unlinkError);
      }
      return defaultValue;
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default value
      return defaultValue;
    }
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filePath: string, data: any) {
  try {
    await ensureDataDir();
    const tempFilePath = `${filePath}.tmp`;
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(tempFilePath, jsonString, 'utf-8');
    try {
      const verifyData = await fs.readFile(tempFilePath, 'utf-8');
      JSON.parse(verifyData);
    } catch (verifyError) {
      console.error('Written file is not valid JSON:', verifyError);
      await fs.unlink(tempFilePath).catch(() => {});
      return false;
    }
    await fs.rename(tempFilePath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

/** قراءة من قاعدة البيانات أولاً ثم من ملف JSON؛ إن وُجدت بيانات في الملف فقط نملأ DB لمرة واحدة */
async function readFromDbOrFile(key: string, filePath: string, defaultValue: any) {
  const fromDb = await getAdminData(key);
  if (fromDb !== null && fromDb !== undefined) return fromDb;
  const fromFile = await readJsonFile(filePath, defaultValue);
  if (fromFile !== null && fromFile !== undefined) {
    setAdminData(key, fromFile).catch(() => {}); // تهجير لمرة واحدة من الملف إلى قاعدة البيانات
  }
  return fromFile;
}

/** حفظ في قاعدة البيانات ثم في ملف JSON كنسخة احتياطية */
async function saveToDbAndFile(key: string, filePath: string, data: any) {
  const dbOk = await setAdminData(key, data);
  const fileOk = await writeJsonFile(filePath, data);
  return dbOk || fileOk;
}

// Countries endpoints
export const getCountries: RequestHandler = async (req, res) => {
  try {
    const countries = await readFromDbOrFile(ADMIN_KEYS.countries, COUNTRIES_FILE, []);
    res.json({ success: true, data: countries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch countries' });
  }
};

export const saveCountries: RequestHandler = async (req, res) => {
  try {
    const countries = req.body;
    if (!Array.isArray(countries)) {
      return res.status(400).json({ success: false, error: 'Countries must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.countries, COUNTRIES_FILE, countries);
    if (success) {
      res.json({ success: true, message: `Saved ${countries.length} countries` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save countries' });
    }
  } catch (error) {
    console.error('Error saving countries:', error);
    res.status(500).json({ success: false, error: 'Failed to save countries' });
  }
};

// Offices endpoints
export const getOffices: RequestHandler = async (req, res) => {
  try {
    const offices = await readFromDbOrFile(ADMIN_KEYS.offices, OFFICES_FILE, []);
    res.json({ success: true, data: offices });
  } catch (error) {
    console.error('Error fetching offices:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch offices' });
  }
};

export const saveOffices: RequestHandler = async (req, res) => {
  try {
    const offices = req.body;
    if (!Array.isArray(offices)) {
      return res.status(400).json({ success: false, error: 'Offices must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.offices, OFFICES_FILE, offices);
    if (success) {
      res.json({ success: true, message: `Saved ${offices.length} offices` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save offices' });
    }
  } catch (error) {
    console.error('Error saving offices:', error);
    res.status(500).json({ success: false, error: 'Failed to save offices' });
  }
};

// Offers endpoints
export const getOffers: RequestHandler = async (req, res) => {
  try {
    const offers = await readFromDbOrFile(ADMIN_KEYS.offers, OFFERS_FILE, []);
    res.json({ success: true, data: offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch offers' });
  }
};

export const saveOffers: RequestHandler = async (req, res) => {
  try {
    const offers = req.body;
    if (!Array.isArray(offers)) {
      return res.status(400).json({ success: false, error: 'Offers must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.offers, OFFERS_FILE, offers);
    if (success) {
      res.json({ success: true, message: `Saved ${offers.length} offers` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save offers' });
    }
  } catch (error) {
    console.error('Error saving offers:', error);
    res.status(500).json({ success: false, error: 'Failed to save offers' });
  }
};

// Settings endpoints
export const getSettings: RequestHandler = async (req, res) => {
  try {
    const settings = await readFromDbOrFile(ADMIN_KEYS.settings, SETTINGS_FILE, null);
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
};

export const saveSettings: RequestHandler = async (req, res) => {
  try {
    const settings = req.body;
    const success = await saveToDbAndFile(ADMIN_KEYS.settings, SETTINGS_FILE, settings);
    if (success) {
      res.json({ success: true, message: 'Settings saved successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save settings' });
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save settings' });
  }
};

// Hotels endpoints
export const getHotels: RequestHandler = async (req, res) => {
  try {
    const hotels = await readFromDbOrFile(ADMIN_KEYS.hotels, HOTELS_FILE, []);
    res.json({ success: true, data: hotels });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch hotels' });
  }
};

export const saveHotels: RequestHandler = async (req, res) => {
  try {
    const hotels = req.body;
    if (!Array.isArray(hotels)) {
      return res.status(400).json({ success: false, error: 'Hotels must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.hotels, HOTELS_FILE, hotels);
    if (success) {
      res.json({ success: true, message: `Saved ${hotels.length} hotels` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save hotels' });
    }
  } catch (error) {
    console.error('Error saving hotels:', error);
    res.status(500).json({ success: false, error: 'Failed to save hotels' });
  }
};

// Hero content endpoints
export const getHeroContent: RequestHandler = async (req, res) => {
  try {
    const heroContent = await readFromDbOrFile(ADMIN_KEYS.heroContent, HERO_CONTENT_FILE, null);
    res.json({ success: true, data: heroContent });
  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch hero content' });
  }
};

export const saveHeroContent: RequestHandler = async (req, res) => {
  try {
    const heroContent = req.body;
    const success = await saveToDbAndFile(ADMIN_KEYS.heroContent, HERO_CONTENT_FILE, heroContent);
    if (success) {
      res.json({ success: true, message: 'Hero content saved successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save hero content' });
    }
  } catch (error) {
    console.error('Error saving hero content:', error);
    res.status(500).json({ success: false, error: 'Failed to save hero content' });
  }
};

// Supervisors endpoints
export const getSupervisors: RequestHandler = async (req, res) => {
  try {
    const supervisors = await readFromDbOrFile(ADMIN_KEYS.supervisors, SUPERVISORS_FILE, []);
    res.json({ success: true, data: supervisors });
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch supervisors' });
  }
};

export const saveSupervisors: RequestHandler = async (req, res) => {
  try {
    const supervisors = req.body;
    if (!Array.isArray(supervisors)) {
      return res.status(400).json({ success: false, error: 'Supervisors must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.supervisors, SUPERVISORS_FILE, supervisors);
    if (success) {
      res.json({ success: true, message: `Saved ${supervisors.length} supervisors` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save supervisors' });
    }
  } catch (error) {
    console.error('Error saving supervisors:', error);
    res.status(500).json({ success: false, error: 'Failed to save supervisors' });
  }
};

// Router setup
const router = express.Router();

// Countries routes
router.get('/countries', getCountries);
router.post('/countries', saveCountries);

// Offices routes
router.get('/offices', getOffices);
router.post('/offices', saveOffices);

// Offers routes
router.get('/offers', getOffers);
router.post('/offers', saveOffers);

// Hotels routes
router.get('/hotels', getHotels);
router.post('/hotels', saveHotels);

// Car Rentals endpoints
export const getCarRentals: RequestHandler = async (req, res) => {
  try {
    const carRentals = await readFromDbOrFile(ADMIN_KEYS.carRentals, CAR_RENTALS_FILE, []);
    res.json({ success: true, data: carRentals });
  } catch (error) {
    console.error('Error fetching car rentals:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch car rentals' });
  }
};

export const saveCarRentals: RequestHandler = async (req, res) => {
  try {
    const carRentals = req.body;
    if (!Array.isArray(carRentals)) {
      return res.status(400).json({ success: false, error: 'Car rentals must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.carRentals, CAR_RENTALS_FILE, carRentals);
    if (success) {
      res.json({ success: true, message: `Saved ${carRentals.length} car rentals` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save car rentals' });
    }
  } catch (error) {
    console.error('Error saving car rentals:', error);
    res.status(500).json({ success: false, error: 'Failed to save car rentals' });
  }
};

// Car Rentals routes
router.get('/car-rentals', getCarRentals);
router.post('/car-rentals', saveCarRentals);

// Car Vehicles endpoints
export const getCarVehicles: RequestHandler = async (req, res) => {
  try {
    const carVehicles = await readFromDbOrFile(ADMIN_KEYS.carVehicles, CAR_VEHICLES_FILE, []);
    res.json({ success: true, data: carVehicles });
  } catch (error) {
    console.error('Error fetching car vehicles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch car vehicles' });
  }
};

export const saveCarVehicles: RequestHandler = async (req, res) => {
  try {
    const carVehicles = req.body;
    if (!Array.isArray(carVehicles)) {
      return res.status(400).json({ success: false, error: 'Car vehicles must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.carVehicles, CAR_VEHICLES_FILE, carVehicles);
    if (success) {
      res.json({ success: true, message: `Saved ${carVehicles.length} car vehicles` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save car vehicles' });
    }
  } catch (error) {
    console.error('Error saving car vehicles:', error);
    res.status(500).json({ success: false, error: 'Failed to save car vehicles' });
  }
};

// Car Vehicles routes
router.get('/car-vehicles', getCarVehicles);
router.post('/car-vehicles', saveCarVehicles);

// Flight Tickets endpoints
const getFlightTickets: RequestHandler = async (_req, res) => {
  try {
    const data = await readFromDbOrFile(ADMIN_KEYS.flightTickets, FLIGHT_TICKETS_FILE, []);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching flight tickets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flight tickets' });
  }
};

const saveFlightTickets: RequestHandler = async (req, res) => {
  try {
    const flightTickets = req.body;
    if (!Array.isArray(flightTickets)) {
      return res.status(400).json({ success: false, error: 'Flight tickets must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.flightTickets, FLIGHT_TICKETS_FILE, flightTickets);
    if (success) {
      res.json({ success: true, message: `Saved ${flightTickets.length} flight tickets` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save flight tickets' });
    }
  } catch (error) {
    console.error('Error saving flight tickets:', error);
    res.status(500).json({ success: false, error: 'Failed to save flight tickets' });
  }
};

// Travel Visas endpoints
const getTravelVisas: RequestHandler = async (_req, res) => {
  try {
    const data = await readFromDbOrFile(ADMIN_KEYS.travelVisas, TRAVEL_VISAS_FILE, []);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching travel visas:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch travel visas' });
  }
};

const saveTravelVisas: RequestHandler = async (req, res) => {
  try {
    const travelVisas = req.body;
    if (!Array.isArray(travelVisas)) {
      return res.status(400).json({ success: false, error: 'Travel visas must be an array' });
    }
    const success = await saveToDbAndFile(ADMIN_KEYS.travelVisas, TRAVEL_VISAS_FILE, travelVisas);
    if (success) {
      res.json({ success: true, message: `Saved ${travelVisas.length} travel visas` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save travel visas' });
    }
  } catch (error) {
    console.error('Error saving travel visas:', error);
    res.status(500).json({ success: false, error: 'Failed to save travel visas' });
  }
};

// Taxi & Delivery routes
const getTaxiDelivery: RequestHandler = async (req, res) => {
  try {
    const data = await readFromDbOrFile(ADMIN_KEYS.taxiDelivery, TAXI_DELIVERY_FILE, []);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting taxi/delivery:', error);
    res.status(500).json({ success: false, error: 'Failed to load taxi/delivery services' });
  }
};

const saveTaxiDelivery: RequestHandler = async (req, res) => {
  try {
    const success = await saveToDbAndFile(ADMIN_KEYS.taxiDelivery, TAXI_DELIVERY_FILE, req.body);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save taxi/delivery services' });
    }
  } catch (error) {
    console.error('Error saving taxi/delivery:', error);
    res.status(500).json({ success: false, error: 'Failed to save taxi/delivery services' });
  }
};

router.get('/taxi-delivery', getTaxiDelivery);
router.post('/taxi-delivery', saveTaxiDelivery);

// Flight Tickets routes
router.get('/flight-tickets', getFlightTickets);
router.post('/flight-tickets', saveFlightTickets);

// Travel Visas routes
router.get('/travel-visas', getTravelVisas);
router.post('/travel-visas', saveTravelVisas);

// Settings routes
router.get('/settings', getSettings);
router.post('/settings', saveSettings);

// Hero content routes
router.get('/hero-content', getHeroContent);
router.post('/hero-content', saveHeroContent);

// Supervisors routes
router.get('/supervisors', getSupervisors);
router.post('/supervisors', saveSupervisors);

export default router;

