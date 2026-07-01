import type { CountryData, City } from '@/data/countries';
import {
  DEFAULT_CONTACT,
  DEFAULT_SOCIAL_LINKS,
  mergeSocialLinks,
  type SocialLinks,
} from '@/data/socialPlatforms';

function isNonEmptyList<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

export interface AdminCountryData extends CountryData {
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export type AdminUserRole = 'admin' | 'supervisor' | 'agent';
export type AdminUserStatus = 'active' | 'inactive' | 'pending';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  country: string;
  offices: number;
  lastLogin: string;
  createdAt: string;
  isVerified: boolean;
}

export interface AdminSettings {
  maintenanceMode: boolean;
  showTopAnnouncement: boolean;
  announcementBar?: {
    enabled: boolean;
    texts: Array<{
      id: string;
      text: {
        ar: string;
        en: string;
        fr: string;
      };
    }>;
    speed?: number;
    fontSize?: number;
    textColor?: string;
    backgroundFrom?: string;
    backgroundTo?: string;
    accentColor?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  socialLinks?: SocialLinks;
  siteTitle: string;
  metaDescription: string;
  defaultLanguage: 'ar' | 'en' | 'fr';
  autoDetectLanguage: boolean;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  emailNotifications: boolean;
  dailyDigest: boolean;
  alertsEmail: string;
  enable2FA: boolean;
  autoLockMinutes: 15 | 30 | 60;
  failedLoginAlerts: boolean;
  dailyAutoBackup: boolean;
}

export interface HeroContent {
  headerImages: string[]; // Array of image URLs or base64
  heroTitle: {
    ar: string;
    en: string;
    fr: string;
  };
  heroSubtitle: {
    ar: string;
    en: string;
    fr: string;
  };
  heroDescription: {
    ar: string;
    en: string;
    fr: string;
  };
  primaryButtonText: {
    ar: string;
    en: string;
    fr: string;
  };
  secondaryButtonText: {
    ar: string;
    en: string;
    fr: string;
  };
  updatedAt: string;
}

export interface TravelOffice {
  id: string;
  countryId: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  address: {
    ar: string;
    en: string;
    fr: string;
  };
  phone: string;
  email: string;
  whatsapp?: string; // WhatsApp number (can be same as phone or different)
  website?: string;
  imageUrl?: string; // Main image URL or base64
  images?: string[]; // Array of image URLs or base64
  manager: {
    ar: string;
    en: string;
    fr: string;
  };
  services: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  workingHours: {
    ar: string;
    en: string;
    fr: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TourOffer {
  id: string;
  countryId: string;
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  price: number;
  currency: string;
  durationDays: number;
  isFeatured: boolean;
  imageUrl?: string;
  videos?: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Hotel {
  id: string;
  countryId: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  address: {
    ar: string;
    en: string;
    fr: string;
  };
  city: {
    ar: string;
    en: string;
    fr: string;
  };
  phone: string;
  email?: string;
  website?: string;
  imageUrl?: string;
  images?: string[];
  rating: number;
  reviews: number;
  stars: number; // 1-5 stars
  pricePerNight: number;
  currency: string;
  amenities: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarRental {
  id: string;
  countryId: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  address: {
    ar: string;
    en: string;
    fr: string;
  };
  city: {
    ar: string;
    en: string;
    fr: string;
  };
  phone: string;
  email?: string;
  website?: string;
  imageUrl?: string;
  images?: string[];
  rating: number;
  reviews: number;
  carTypes: Array<{
    type: {
      ar: string;
      en: string;
      fr: string;
    };
    pricePerDay: number;
    currency: string;
    features: {
      ar: string[];
      en: string[];
      fr: string[];
    };
  }>;
  services: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaxiDeliveryService {
  id: string;
  countryId: string;
  type: 'taxi' | 'delivery';
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  imageUrl: string;
  rating: number;
  totalRides: number;
  pricePerKm: number;
  minimumFare: number;
  phone: string;
  availableVehicles?: string[];
  serviceHours: {
    ar: string;
    en: string;
    fr: string;
  };
  features: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  coverage: {
    ar: string;
    en: string;
    fr: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarVehicle {
  id: string;
  carRentalId: string; // ID of the car rental agency
  countryId: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  brand: {
    ar: string;
    en: string;
    fr: string;
  };
  model: string;
  year: number;
  type: 'economy' | 'mid-size' | 'luxury' | 'suv' | 'van' | 'sports' | 'electric';
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  doors: number;
  pricePerDay: number;
  currency: string;
  imageUrl?: string;
  images?: string[];
  features: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  specifications: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  available: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FlightTicket {
  id: string;
  countryId: string;
  from: string;
  to: string;
  airline: string;
  classType: 'economy' | 'business' | 'first';
  price: number;
  currency: string;
  refundable: boolean;
  description?: {
    ar: string;
    en: string;
    fr: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TravelVisa {
  id: string;
  countryId: string;
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  price: number;
  currency: string;
  processingTime: string;
  requiredDocs?: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class DataManager {
  private readonly COUNTRIES_KEY = 'admin_countries_data';
  private readonly OFFICES_KEY = 'admin_travel_offices';
  private readonly OFFERS_KEY = 'admin_tour_offers';
  private readonly HOTELS_KEY = 'admin_hotels';
  private readonly CARS_KEY = 'admin_car_rentals';
  private readonly VEHICLES_KEY = 'admin_car_vehicles';
  private readonly BACKUP_KEY = 'admin_data_backup';
  private readonly USERS_KEY = 'admin_users';
  private readonly SETTINGS_KEY = 'admin_settings';
  private readonly HERO_CONTENT_KEY = 'admin_hero_content';
  private readonly TAXI_DELIVERY_KEY = 'tarhal_taxi_delivery_services';
  private readonly FLIGHT_TICKETS_KEY = 'admin_flight_tickets';
  private readonly TRAVEL_VISAS_KEY = 'admin_travel_visas';
  private readonly API_BASE = '/api/admin-data';
  private useServerStorage = true; // Enable server storage by default

  // Load countries from server
  private async loadCountriesFromServer(): Promise<AdminCountryData[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/countries`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<AdminCountryData>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading countries from server:', error);
    }
    return null;
  }

  // Save countries to server
  private async saveCountriesToServer(countries: AdminCountryData[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/countries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(countries)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving countries to server:', error);
    }
    return false;
  }

  // Get all countries (with server sync) - دائماً نفضّل بيانات السيرفر لظهورها على كل الأجهزة
  async getCountriesAsync(): Promise<AdminCountryData[]> {
    let countries: AdminCountryData[];

    if (this.useServerStorage) {
      const serverData = await this.loadCountriesFromServer();
      if (isNonEmptyList(serverData)) {
        countries = serverData;
      } else {
        const staticCountries = await this.loadStaticCountriesAsAdmin();
        countries = isNonEmptyList(staticCountries) ? staticCountries : this.getCountries();
      }
    } else {
      const staticCountries = await this.loadStaticCountriesAsAdmin();
      countries = isNonEmptyList(staticCountries) ? staticCountries : this.getCountries();
    }

    countries = this.migrateLegacyCountryImages(countries);

    try {
      localStorage.setItem(this.COUNTRIES_KEY, JSON.stringify(countries));
    } catch (e) {
      console.warn('Failed to sync countries to localStorage:', e);
    }

    return countries;
  }

  private migrateLegacyCountryImages(countries: AdminCountryData[]): AdminCountryData[] {
    const sudanLandmarks = {
      mainImage: 'https://images.unsplash.com/photo-1620487792776-a257eb0c5f2c',
      gallery: [
        'https://images.unsplash.com/photo-1620487792776-a257eb0c5f2c',
        'https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg',
        'https://images.pexels.com/photos/10546022/pexels-photo-10546022.jpeg',
        'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sudan_Jebel_Marra_Deriba_Lakes_edited.jpg',
        'https://images.pexels.com/photos/10546023/pexels-photo-10546023.jpeg',
      ],
    };
    const legacyPatterns = ['2868245', '568026', '1181519', '2869066'];

    return countries.map((country) => {
      if (country.id !== 'sudan') return country;

      const usesLegacyImages =
        legacyPatterns.some((id) => country.mainImage?.includes(id)) ||
        country.gallery?.some((url) => legacyPatterns.some((id) => url.includes(id)));

      if (!usesLegacyImages) return country;

      return {
        ...country,
        mainImage: sudanLandmarks.mainImage,
        gallery: sudanLandmarks.gallery,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  private async loadStaticCountriesAsAdmin(): Promise<AdminCountryData[]> {
    const { getAllCountries, convertCountryToAdminData } = await import('@/data/countries');
    const now = new Date().toISOString();
    return getAllCountries().map((country) => ({
      ...convertCountryToAdminData(country),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }));
  }

  getCountries(): AdminCountryData[] {
    try {
      const data = localStorage.getItem(this.COUNTRIES_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return this.getDefaultCountries();
    } catch (error) {
      console.error('Error loading countries:', error);
      return this.getDefaultCountries();
    }
  }

  // Save countries (with server sync)
  async saveCountriesAsync(countries: AdminCountryData[]): Promise<boolean> {
    // Save to server first
    if (this.useServerStorage) {
      const serverSuccess = await this.saveCountriesToServer(countries);
      if (!serverSuccess) {
        console.warn('Failed to save to server, falling back to localStorage');
      }
    }
    // Always save to localStorage as backup
    return this.saveCountries(countries);
  }

  saveCountries(countries: AdminCountryData[]): boolean {
    try {
      // Create backup before saving
      this.createBackup();
      
      // Ensure data is properly serialized
      const serialized = JSON.stringify(countries);
      
      // Check if data is too large for localStorage
      if (serialized.length > 5 * 1024 * 1024) { // 5MB limit
        console.warn('Countries data is too large for localStorage, attempting to compress...');
        // Try to save anyway, but log a warning
      }
      
      localStorage.setItem(this.COUNTRIES_KEY, serialized);
      
      // Verify the save was successful
      const saved = localStorage.getItem(this.COUNTRIES_KEY);
      if (!saved || saved !== serialized) {
        console.error('Failed to verify saved countries data');
        return false;
      }
      
      console.log(`Successfully saved ${countries.length} countries to localStorage`);
      return true;
    } catch (error) {
      console.error('Error saving countries:', error);
      // If quota exceeded, try to handle it
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Consider using server-side storage.');
      }
      return false;
    }
  }

  // Add new country (with server sync)
  async addCountryAsync(country: Omit<AdminCountryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminCountryData | null> {
    try {
      const countries = await this.getCountriesAsync();
      const newCountry: AdminCountryData = {
        ...country,
        id: `country_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      countries.push(newCountry);
      if (await this.saveCountriesAsync(countries)) {
        return newCountry;
      }
      return null;
    } catch (error) {
      console.error('Error adding country:', error);
      return null;
    }
  }

  // Add new country (sync version - for backward compatibility)
  addCountry(country: Omit<AdminCountryData, 'id' | 'createdAt' | 'updatedAt'>): AdminCountryData | null {
    // Use async version but wait for it
    let result: AdminCountryData | null = null;
    this.addCountryAsync(country).then(r => result = r).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const countries = this.getCountries();
      const newCountry: AdminCountryData = {
        ...country,
        id: `country_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      countries.push(newCountry);
      if (this.saveCountries(countries)) {
        return newCountry;
      }
      return null;
    } catch (error) {
      console.error('Error adding country:', error);
      return null;
    }
  }

  // Update country (with server sync)
  async updateCountryAsync(id: string, updates: Partial<AdminCountryData>): Promise<boolean> {
    try {
      const countries = this.getCountries();
      const index = countries.findIndex(c => c.id === id);
      
      if (index === -1) {
        console.error(`Country with id ${id} not found`);
        return false;
      }
      
      // Deep merge to ensure cities array is properly updated
      const updatedCountry: AdminCountryData = {
        ...countries[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Ensure cities array is properly set (not merged)
      if (updates.cities !== undefined) {
        updatedCountry.cities = updates.cities;
      }
      
      countries[index] = updatedCountry;
      
      const success = await this.saveCountriesAsync(countries);
      
      if (success) {
        console.log(`Successfully updated country ${id} with ${updatedCountry.cities?.length || 0} cities`);
      } else {
        console.error(`Failed to save updated country ${id}`);
      }
      
      return success;
    } catch (error) {
      console.error('Error updating country:', error);
      return false;
    }
  }

  // Update country (sync version - for backward compatibility)
  updateCountry(id: string, updates: Partial<AdminCountryData>): boolean {
    // Use async version in background
    this.updateCountryAsync(id, updates).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const countries = this.getCountries();
      const index = countries.findIndex(c => c.id === id);
      
      if (index === -1) {
        console.error(`Country with id ${id} not found`);
        return false;
      }
      
      // Deep merge to ensure cities array is properly updated
      const updatedCountry: AdminCountryData = {
        ...countries[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Ensure cities array is properly set (not merged)
      if (updates.cities !== undefined) {
        updatedCountry.cities = updates.cities;
      }
      
      countries[index] = updatedCountry;
      
      const success = this.saveCountries(countries);
      
      if (success) {
        console.log(`Successfully updated country ${id} with ${updatedCountry.cities?.length || 0} cities`);
      } else {
        console.error(`Failed to save updated country ${id}`);
      }
      
      return success;
    } catch (error) {
      console.error('Error updating country:', error);
      return false;
    }
  }

  // Delete country (with server sync)
  async deleteCountryAsync(id: string): Promise<boolean> {
    try {
      const countries = await this.getCountriesAsync();
      const filteredCountries = countries.filter(c => c.id !== id);
      
      if (filteredCountries.length === countries.length) return false;
      
      // Also delete related offices and offers
      await this.deleteOfficesByCountryAsync(id);
      await this.deleteOffersByCountryAsync(id);
      
      return await this.saveCountriesAsync(filteredCountries);
    } catch (error) {
      console.error('Error deleting country:', error);
      return false;
    }
  }

  // Delete country (sync version - for backward compatibility)
  deleteCountry(id: string): boolean {
    // Use async version in background
    this.deleteCountryAsync(id).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const countries = this.getCountries();
      const filteredCountries = countries.filter(c => c.id !== id);
      
      if (filteredCountries.length === countries.length) return false;
      
      // Also delete related offices and offers
      this.deleteOfficesByCountry(id);
      this.deleteOffersByCountry(id);
      
      return this.saveCountries(filteredCountries);
    } catch (error) {
      console.error('Error deleting country:', error);
      return false;
    }
  }

  // Get country by ID
  getCountryById(id: string): AdminCountryData | null {
    const countries = this.getCountries();
    return countries.find(c => c.id === id) || null;
  }

  // Travel Offices Management
  // Load offices from server
  private async loadOfficesFromServer(): Promise<TravelOffice[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/offices`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<TravelOffice>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading offices from server:', error);
    }
    return null;
  }

  // Save offices to server
  private async saveOfficesToServer(offices: TravelOffice[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/offices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offices)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving offices to server:', error);
    }
    return false;
  }

  async getOfficesAsync(): Promise<TravelOffice[]> {
    if (this.useServerStorage) {
      const serverData = await this.loadOfficesFromServer();
      if (isNonEmptyList(serverData)) {
        try {
          localStorage.setItem(this.OFFICES_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync server data to localStorage:', e);
        }
        return serverData;
      }
    }
    return this.getOffices();
  }

  getOffices(): TravelOffice[] {
    try {
      const data = localStorage.getItem(this.OFFICES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading offices:', error);
      return [];
    }
  }

  // Save offices (with server sync)
  async saveOfficesAsync(offices: TravelOffice[]): Promise<boolean> {
    if (this.useServerStorage) {
      const serverSuccess = await this.saveOfficesToServer(offices);
      if (!serverSuccess) {
        console.warn('Failed to save offices to server, falling back to localStorage');
      }
    }
    return this.saveOffices(offices);
  }

  // Save offices
  saveOffices(offices: TravelOffice[]): boolean {
    try {
      const data = JSON.stringify(offices);
      localStorage.setItem(this.OFFICES_KEY, data);
      return true;
    } catch (error: any) {
      console.error('Error saving offices:', error);
      // If quota exceeded, try to save without images or compress data
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn('LocalStorage quota exceeded. Consider using server upload for images.');
        // Try to save without base64 images (keep only URLs)
        try {
          const officesWithoutBase64 = offices.map(office => ({
            ...office,
            imageUrl: office.imageUrl?.startsWith('data:') ? undefined : office.imageUrl,
            images: office.images?.filter(img => !img.startsWith('data:')) || []
          }));
          localStorage.setItem(this.OFFICES_KEY, JSON.stringify(officesWithoutBase64));
          return true;
        } catch (retryError) {
          console.error('Failed to save even without base64 images:', retryError);
          return false;
        }
      }
      return false;
    }
  }

  // Add new office (with server sync)
  async addOfficeAsync(office: Omit<TravelOffice, 'id' | 'createdAt' | 'updatedAt'>): Promise<TravelOffice | null> {
    try {
      const offices = await this.getOfficesAsync();
      const newOffice: TravelOffice = {
        ...office,
        id: `office_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      offices.push(newOffice);
      if (await this.saveOfficesAsync(offices)) {
        return newOffice;
      }
      return null;
    } catch (error) {
      console.error('Error adding office:', error);
      return null;
    }
  }

  // Add new office (sync version - for backward compatibility)
  addOffice(office: Omit<TravelOffice, 'id' | 'createdAt' | 'updatedAt'>): TravelOffice | null {
    // Use async version in background
    this.addOfficeAsync(office).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const offices = this.getOffices();
      const newOffice: TravelOffice = {
        ...office,
        id: `office_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      offices.push(newOffice);
      if (this.saveOffices(offices)) {
        return newOffice;
      }
      return null;
    } catch (error) {
      console.error('Error adding office:', error);
      return null;
    }
  }

  // Update office (with server sync)
  async updateOfficeAsync(id: string, updates: Partial<TravelOffice>): Promise<boolean> {
    try {
      const offices = await this.getOfficesAsync();
      const index = offices.findIndex(o => o.id === id);
      
      if (index === -1) return false;
      
      offices[index] = {
        ...offices[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return await this.saveOfficesAsync(offices);
    } catch (error) {
      console.error('Error updating office:', error);
      return false;
    }
  }

  // Update office (sync version - for backward compatibility)
  updateOffice(id: string, updates: Partial<TravelOffice>): boolean {
    // Use async version in background
    this.updateOfficeAsync(id, updates).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const offices = this.getOffices();
      const index = offices.findIndex(o => o.id === id);
      
      if (index === -1) return false;
      
      offices[index] = {
        ...offices[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return this.saveOffices(offices);
    } catch (error) {
      console.error('Error updating office:', error);
      return false;
    }
  }

  // Delete office (with server sync)
  async deleteOfficeAsync(id: string): Promise<boolean> {
    try {
      const offices = await this.getOfficesAsync();
      const filteredOffices = offices.filter(o => o.id !== id);
      
      if (filteredOffices.length === offices.length) return false;
      
      return await this.saveOfficesAsync(filteredOffices);
    } catch (error) {
      console.error('Error deleting office:', error);
      return false;
    }
  }

  // Delete office (sync version - for backward compatibility)
  deleteOffice(id: string): boolean {
    // Use async version in background
    this.deleteOfficeAsync(id).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const offices = this.getOffices();
      const filteredOffices = offices.filter(o => o.id !== id);
      
      if (filteredOffices.length === offices.length) return false;
      
      return this.saveOffices(filteredOffices);
    } catch (error) {
      console.error('Error deleting office:', error);
      return false;
    }
  }

  // Get offices by country
  getOfficesByCountry(countryId: string): TravelOffice[] {
    const offices = this.getOffices();
    return offices.filter(o => o.countryId === countryId);
  }

  // Delete offices by country (with server sync)
  async deleteOfficesByCountryAsync(countryId: string): Promise<boolean> {
    try {
      const offices = await this.getOfficesAsync();
      const filteredOffices = offices.filter(o => o.countryId !== countryId);
      return await this.saveOfficesAsync(filteredOffices);
    } catch (error) {
      console.error('Error deleting offices by country:', error);
      return false;
    }
  }

  // Delete offices by country (sync version - for backward compatibility)
  deleteOfficesByCountry(countryId: string): boolean {
    // Use async version in background
    this.deleteOfficesByCountryAsync(countryId).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const offices = this.getOffices();
      const filteredOffices = offices.filter(o => o.countryId !== countryId);
      return this.saveOffices(filteredOffices);
    } catch (error) {
      console.error('Error deleting offices by country:', error);
      return false;
    }
  }

  // Tour Offers Management
  // Load offers from server
  private async loadOffersFromServer(): Promise<TourOffer[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/offers`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<TourOffer>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading offers from server:', error);
    }
    return null;
  }

  // Save offers to server
  private async saveOffersToServer(offers: TourOffer[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offers)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving offers to server:', error);
    }
    return false;
  }

  async getOffersAsync(): Promise<TourOffer[]> {
    if (this.useServerStorage) {
      const serverData = await this.loadOffersFromServer();
      if (isNonEmptyList(serverData)) {
        try {
          localStorage.setItem(this.OFFERS_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync server data to localStorage:', e);
        }
        return serverData;
      }
    }
    return this.getOffers();
  }

  getOffers(): TourOffer[] {
    try {
      const data = localStorage.getItem(this.OFFERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading offers:', error);
      return [];
    }
  }

  async saveOffersAsync(offers: TourOffer[]): Promise<boolean> {
    if (this.useServerStorage) {
      const serverSuccess = await this.saveOffersToServer(offers);
      if (!serverSuccess) {
        console.warn('Failed to save offers to server, falling back to localStorage');
      }
    }
    return this.saveOffers(offers);
  }

  saveOffers(offers: TourOffer[]): boolean {
    try {
      localStorage.setItem(this.OFFERS_KEY, JSON.stringify(offers));
      return true;
    } catch (error) {
      console.error('Error saving offers:', error);
      return false;
    }
  }

  // Add offer (with server sync)
  async addOfferAsync(offer: Omit<TourOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<TourOffer | null> {
    try {
      const offers = await this.getOffersAsync();
      const newOffer: TourOffer = {
        ...offer,
        id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      offers.push(newOffer);
      if (await this.saveOffersAsync(offers)) {
        return newOffer;
      }
      return null;
    } catch (error) {
      console.error('Error adding offer:', error);
      return null;
    }
  }

  // Add offer (sync version - for backward compatibility)
  addOffer(offer: Omit<TourOffer, 'id' | 'createdAt' | 'updatedAt'>): TourOffer | null {
    // Use async version in background
    this.addOfferAsync(offer).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const offers = this.getOffers();
      const newOffer: TourOffer = {
        ...offer,
        id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      offers.push(newOffer);
      if (this.saveOffers(offers)) {
        return newOffer;
      }
      return null;
    } catch (error) {
      console.error('Error adding offer:', error);
      return null;
    }
  }

  // Update offer (with server sync)
  async updateOfferAsync(id: string, updates: Partial<TourOffer>): Promise<boolean> {
    try {
      const offers = await this.getOffersAsync();
      const index = offers.findIndex(o => o.id === id);
      if (index === -1) return false;
      offers[index] = {
        ...offers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return await this.saveOffersAsync(offers);
    } catch (error) {
      console.error('Error updating offer:', error);
      return false;
    }
  }

  // Update offer (sync version - for backward compatibility)
  updateOffer(id: string, updates: Partial<TourOffer>): boolean {
    // Use async version in background
    this.updateOfferAsync(id, updates).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const offers = this.getOffers();
      const index = offers.findIndex(o => o.id === id);
      if (index === -1) return false;
      offers[index] = {
        ...offers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return this.saveOffers(offers);
    } catch (error) {
      console.error('Error updating offer:', error);
      return false;
    }
  }

  // Delete offer (with server sync)
  async deleteOfferAsync(id: string): Promise<boolean> {
    try {
      const offers = await this.getOffersAsync();
      const filteredOffers = offers.filter(o => o.id !== id);
      if (filteredOffers.length === offers.length) return false;
      return await this.saveOffersAsync(filteredOffers);
    } catch (error) {
      console.error('Error deleting offer:', error);
      return false;
    }
  }

  // Delete offer (sync version - for backward compatibility)
  deleteOffer(id: string): boolean {
    // Use async version in background
    this.deleteOfferAsync(id).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const offers = this.getOffers();
      const filteredOffers = offers.filter(o => o.id !== id);
      if (filteredOffers.length === offers.length) return false;
      return this.saveOffers(filteredOffers);
    } catch (error) {
      console.error('Error deleting offer:', error);
      return false;
    }
  }

  getOffersByCountry(countryId: string): TourOffer[] {
    const offers = this.getOffers();
    return offers.filter(o => o.countryId === countryId);
  }

  // Delete offers by country (with server sync)
  async deleteOffersByCountryAsync(countryId: string): Promise<boolean> {
    try {
      const offers = await this.getOffersAsync();
      const filteredOffers = offers.filter(o => o.countryId !== countryId);
      return await this.saveOffersAsync(filteredOffers);
    } catch (error) {
      console.error('Error deleting offers by country:', error);
      return false;
    }
  }

  // Delete offers by country (sync version - for backward compatibility)
  deleteOffersByCountry(countryId: string): boolean {
    // Use async version in background
    this.deleteOffersByCountryAsync(countryId).catch(e => console.error(e));
    // For sync version, save to localStorage immediately
    try {
      const offers = this.getOffers();
      const filteredOffers = offers.filter(o => o.countryId !== countryId);
      return this.saveOffers(filteredOffers);
    } catch (error) {
      console.error('Error deleting offers by country:', error);
      return false;
    }
  }

  // Old deleteOffersByCountry (kept for reference)
  _deleteOffersByCountry_OLD(countryId: string): boolean {
    try {
      const offers = this.getOffers();
      const filteredOffers = offers.filter(o => o.countryId !== countryId);
      return this.saveOffers(filteredOffers);
    } catch (error) {
      console.error('Error deleting offers by country:', error);
      return false;
    }
  }

  // Backup and restore
  createBackup(): boolean {
    try {
      const backup = {
        countries: this.getCountries(),
        offices: this.getOffices(),
        offers: this.getOffers(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      return false;
    }
  }

  restoreFromBackup(): boolean {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY);
      if (!backup) return false;
      
      const data = JSON.parse(backup);
      if (data.countries) {
        localStorage.setItem(this.COUNTRIES_KEY, JSON.stringify(data.countries));
      }
      if (data.offices) {
        localStorage.setItem(this.OFFICES_KEY, JSON.stringify(data.offices));
      }
      if (data.offers) {
        localStorage.setItem(this.OFFERS_KEY, JSON.stringify(data.offers));
      }
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  // Export data
  exportData(): string {
    const data = {
      countries: this.getCountries(),
      offices: this.getOffices(),
      offers: this.getOffers(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.countries && Array.isArray(data.countries)) {
        this.saveCountries(data.countries);
      }
      if (data.offices && Array.isArray(data.offices)) {
        this.saveOffices(data.offices);
      }
      if (data.offers && Array.isArray(data.offers)) {
        this.saveOffers(data.offers);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData(): boolean {
    try {
      localStorage.removeItem(this.COUNTRIES_KEY);
      localStorage.removeItem(this.OFFICES_KEY);
      localStorage.removeItem(this.OFFERS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  // ===== Admin Users Management =====
  getUsers(): AdminUser[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      if (data) {
        return JSON.parse(data);
      }

      // Seed with a few default admin users on first load
      const seed: AdminUser[] = [
        {
          id: 'admin_1',
          name: 'أحمد محمد',
          email: 'ahmed@ciar.com',
          role: 'admin',
          status: 'active',
          country: 'السعودية',
          offices: 12,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isVerified: true,
        },
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(seed));
      return seed;
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  saveUsers(users: AdminUser[]): boolean {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  addUser(user: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser | null {
    try {
      const users = this.getUsers();
      const newUser: AdminUser = {
        ...user,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      if (this.saveUsers(users)) {
        return newUser;
      }
      return null;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  }

  updateUser(id: string, updates: Partial<AdminUser>): boolean {
    try {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return false;

      users[index] = {
        ...users[index],
        ...updates,
      };

      return this.saveUsers(users);
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  deleteUser(id: string): boolean {
    try {
      const users = this.getUsers();
      const filtered = users.filter(u => u.id !== id);
      if (filtered.length === users.length) return false;
      return this.saveUsers(filtered);
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // ===== Admin Settings Management =====
  getDefaultSettings(): AdminSettings {
    return {
      maintenanceMode: false,
      showTopAnnouncement: true,
      announcementBar: {
        enabled: true,
        texts: [
          { id: '1', text: { ar: 'مرحباً بكم في منصة ciar للسياحة', en: 'Welcome to ciar Travel Platform', fr: 'Bienvenue sur la Plateforme de Voyage ciar' } },
          { id: '2', text: { ar: 'احصل على أفضل العروض السياحية', en: 'Get the best travel offers', fr: 'Obtenez les meilleures offres de voyage' } },
          { id: '3', text: { ar: 'استكشف أجمل الوجهات حول العالم', en: 'Explore the most beautiful destinations around the world', fr: 'Explorez les plus belles destinations du monde' } },
          { id: '4', text: { ar: 'خدمات سياحية متميزة بأسعار منافسة', en: 'Premium travel services at competitive prices', fr: 'Services de voyage premium à des prix compétitifs' } },
          { id: '5', text: { ar: 'حجز الفنادق والطيران بسهولة', en: 'Easy hotel and flight booking', fr: 'Réservation facile d\'hôtels et de vols' } },
          { id: '6', text: { ar: 'جولات سياحية منظمة ومميزة', en: 'Organized and unique tourist tours', fr: 'Circuits touristiques organisés et uniques' } },
          { id: '7', text: { ar: 'دعم عملاء متاح 24/7', en: '24/7 customer support available', fr: 'Support client disponible 24/7' } },
          { id: '8', text: { ar: 'تأشيرات السفر بسرعة وسهولة', en: 'Fast and easy travel visas', fr: 'Visas de voyage rapides et faciles' } },
          { id: '9', text: { ar: 'تأمين سفر شامل لرحلتك', en: 'Comprehensive travel insurance for your trip', fr: 'Assurance voyage complète pour votre voyage' } },
          { id: '10', text: { ar: 'استئجار سيارات في جميع الوجهات', en: 'Car rental in all destinations', fr: 'Location de voitures dans toutes les destinations' } },
          { id: '11', text: { ar: 'عروض خاصة وحصرية كل أسبوع', en: 'Special and exclusive offers every week', fr: 'Offres spéciales et exclusives chaque semaine' } },
          { id: '12', text: { ar: 'خطط رحلتك مع خبراء السياحة', en: 'Plan your trip with travel experts', fr: 'Planifiez votre voyage avec des experts en voyage' } },
          { id: '13', text: { ar: 'تجربة سفر لا تُنسى', en: 'An unforgettable travel experience', fr: 'Une expérience de voyage inoubliable' } },
          { id: '14', text: { ar: 'مكاتبنا منتشرة في جميع أنحاء العالم', en: 'Our offices are spread all over the world', fr: 'Nos bureaux sont répartis dans le monde entier' } },
          { id: '15', text: { ar: 'احجز الآن واحصل على خصم خاص', en: 'Book now and get a special discount', fr: 'Réservez maintenant et obtenez une réduction spéciale' } },
          { id: '16', text: { ar: 'رحلات جماعية وفردية', en: 'Group and individual trips', fr: 'Voyages en groupe et individuels' } },
          { id: '17', text: { ar: 'خدمة استقبال في المطار', en: 'Airport pickup service', fr: 'Service de transfert aéroport' } },
          { id: '18', text: { ar: 'دليل سياحي متخصص لجميع الوجهات', en: 'Specialized tourist guide for all destinations', fr: 'Guide touristique spécialisé pour toutes les destinations' } },
          { id: '19', text: { ar: 'تذاكر طيران بأفضل الأسعار', en: 'Flight tickets at the best prices', fr: 'Billets d\'avion aux meilleurs prix' } },
          { id: '20', text: { ar: 'شاهد آراء عملائنا المميزة', en: 'See our distinguished customer reviews', fr: 'Découvrez les avis distingués de nos clients' } }
        ],
        speed: 30,
        fontSize: 13,
        textColor: '#ffffff',
        backgroundFrom: '#1e3a5f',
        backgroundTo: '#0f2744',
        accentColor: '#f97316',
      },
      contactEmail: DEFAULT_CONTACT.email,
      contactPhone: DEFAULT_CONTACT.phone,
      contactWhatsapp: DEFAULT_CONTACT.whatsapp,
      socialLinks: { ...DEFAULT_SOCIAL_LINKS },
      siteTitle: 'منصة ciar للسياحة',
      metaDescription: '',
      defaultLanguage: 'ar',
      autoDetectLanguage: true,
      dateFormat: 'DD/MM/YYYY',
      emailNotifications: true,
      dailyDigest: false,
      alertsEmail: 'admin@ciar.com',
      enable2FA: false,
      autoLockMinutes: 30,
      failedLoginAlerts: true,
      dailyAutoBackup: false,
    };
  }

  private mergeSettings(defaults: AdminSettings, saved: Partial<AdminSettings>): AdminSettings {
    return {
      ...defaults,
      ...saved,
      contactEmail: saved.contactEmail || defaults.contactEmail,
      contactPhone: saved.contactPhone || defaults.contactPhone,
      contactWhatsapp: saved.contactWhatsapp || defaults.contactWhatsapp,
      socialLinks: mergeSocialLinks(saved.socialLinks),
      announcementBar: {
        ...defaults.announcementBar,
        ...(saved.announcementBar || {}),
        texts: saved.announcementBar?.texts && saved.announcementBar.texts.length > 0
          ? saved.announcementBar.texts
          : defaults.announcementBar?.texts || [],
      },
    };
  }

  getSettings(): AdminSettings {
    try {
      const defaults = this.getDefaultSettings();
      const data = localStorage.getItem(this.SETTINGS_KEY);
      if (data) {
        const saved = JSON.parse(data);
        return this.mergeSettings(defaults, saved);
      }
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(defaults));
      return defaults;
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Load settings from server
  private async loadSettingsFromServer(): Promise<AdminSettings | null> {
    try {
      const response = await fetch(`${this.API_BASE}/settings`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading settings from server:', error);
    }
    return null;
  }

  // Save settings to server
  private async saveSettingsToServer(settings: AdminSettings): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving settings to server:', error);
    }
    return false;
  }

  async getSettingsAsync(): Promise<AdminSettings> {
    const defaults = this.getDefaultSettings();
    if (this.useServerStorage) {
      const serverData = await this.loadSettingsFromServer();
      if (serverData) {
        const merged = this.mergeSettings(defaults, serverData);
        try {
          localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(merged));
        } catch (e) {
          console.warn('Failed to sync server data to localStorage:', e);
        }
        return merged;
      }
    }
    return this.getSettings();
  }

  async saveSettingsAsync(settings: AdminSettings): Promise<boolean> {
    if (this.useServerStorage) {
      const serverSuccess = await this.saveSettingsToServer(settings);
      if (!serverSuccess) {
        console.warn('Failed to save settings to server, falling back to localStorage');
      }
    }
    return this.saveSettings(settings);
  }

  saveSettings(settings: AdminSettings): boolean {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  // Hero Content Management
  // Load hero content from server
  private async loadHeroContentFromServer(): Promise<HeroContent | null> {
    try {
      const response = await fetch(`${this.API_BASE}/hero-content`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading hero content from server:', error);
    }
    return null;
  }

  // Save hero content to server
  private async saveHeroContentToServer(content: HeroContent): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/hero-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving hero content to server:', error);
    }
    return false;
  }

  // Get hero content (with server sync)
  async getHeroContentAsync(): Promise<HeroContent> {
    if (this.useServerStorage) {
      const serverData = await this.loadHeroContentFromServer();
      if (serverData) {
        // Sync to localStorage as backup
        try {
          localStorage.setItem(this.HERO_CONTENT_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync hero content to localStorage:', e);
        }
        return serverData;
      }
    }
    // Fallback to localStorage
    return this.getHeroContent();
  }

  getHeroContent(): HeroContent {
    try {
      const data = localStorage.getItem(this.HERO_CONTENT_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return this.getDefaultHeroContent();
    } catch (error) {
      console.error('Error loading hero content:', error);
      return this.getDefaultHeroContent();
    }
  }

  // Save hero content (with server sync)
  async saveHeroContentAsync(content: HeroContent): Promise<boolean> {
    // Save to server first
    if (this.useServerStorage) {
      const serverSuccess = await this.saveHeroContentToServer(content);
      if (!serverSuccess) {
        console.warn('Failed to save hero content to server, falling back to localStorage');
      }
    }
    // Always save to localStorage as backup
    return this.saveHeroContent(content);
  }

  saveHeroContent(content: HeroContent): boolean {
    try {
      const updatedContent = {
        ...content,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.HERO_CONTENT_KEY, JSON.stringify(updatedContent));
      return true;
    } catch (error) {
      console.error('Error saving hero content:', error);
      return false;
    }
  }

  // Hotels Management
  // Load hotels from server
  private async loadHotelsFromServer(): Promise<Hotel[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/hotels`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<Hotel>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading hotels from server:', error);
    }
    return null;
  }

  // Save hotels to server
  private async saveHotelsToServer(hotels: Hotel[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotels)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving hotels to server:', error);
    }
    return false;
  }

  async getHotelsAsync(): Promise<Hotel[]> {
    if (this.useServerStorage) {
      const serverData = await this.loadHotelsFromServer();
      if (isNonEmptyList(serverData)) {
        try {
          localStorage.setItem(this.HOTELS_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync server data to localStorage:', e);
        }
        return serverData;
      }
    }
    return this.getHotels();
  }

  // Safe JSON parse helper
  private safeJsonParse<T>(data: string | null, key: string, defaultValue: T): T {
    if (!data) return defaultValue;
    
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error(`Error parsing ${key} from localStorage, clearing corrupted data:`, parseError);
      localStorage.removeItem(key);
      return defaultValue;
    }
  }

  getHotels(): Hotel[] {
    try {
      const data = localStorage.getItem(this.HOTELS_KEY);
      return this.safeJsonParse<Hotel[]>(data, this.HOTELS_KEY, []);
    } catch (error) {
      console.error('Error loading hotels:', error);
      return [];
    }
  }

  async saveHotelsAsync(hotels: Hotel[]): Promise<boolean> {
    if (this.useServerStorage) {
      const serverSuccess = await this.saveHotelsToServer(hotels);
      if (!serverSuccess) {
        console.warn('Failed to save hotels to server, falling back to localStorage');
      }
    }
    return this.saveHotels(hotels);
  }

  saveHotels(hotels: Hotel[]): boolean {
    try {
      localStorage.setItem(this.HOTELS_KEY, JSON.stringify(hotels));
      return true;
    } catch (error) {
      console.error('Error saving hotels:', error);
      return false;
    }
  }

  getHotelsByCountry(countryId: string): Hotel[] {
    const hotels = this.getHotels();
    return hotels.filter(h => h.countryId === countryId && h.isActive);
  }

  addHotel(hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>): Hotel | null {
    try {
      const hotels = this.getHotels();
      const newHotel: Hotel = {
        ...hotel,
        id: `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      hotels.push(newHotel);
      if (this.saveHotels(hotels)) {
        return newHotel;
      }
      return null;
    } catch (error) {
      console.error('Error adding hotel:', error);
      return null;
    }
  }

  async addHotelAsync(hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Hotel | null> {
    try {
      const hotels = await this.getHotelsAsync();
      const newHotel: Hotel = {
        ...hotel,
        id: `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      hotels.push(newHotel);
      const saved = await this.saveHotelsAsync(hotels);
      if (saved) {
        console.log(`Successfully added hotel: ${newHotel.name.en} (ID: ${newHotel.id})`);
        return newHotel;
      } else {
        console.error(`Failed to save hotel: ${newHotel.name.en}`);
        return null;
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      return null;
    }
  }

  updateHotel(id: string, updates: Partial<Hotel>): boolean {
    try {
      const hotels = this.getHotels();
      const index = hotels.findIndex(h => h.id === id);
      if (index === -1) return false;
      hotels[index] = {
        ...hotels[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.saveHotels(hotels);
    } catch (error) {
      console.error('Error updating hotel:', error);
      return false;
    }
  }

  async updateHotelAsync(id: string, updates: Partial<Hotel>): Promise<boolean> {
    try {
      const hotels = await this.getHotelsAsync();
      const index = hotels.findIndex(h => h.id === id);
      if (index === -1) return false;
      hotels[index] = {
        ...hotels[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return await this.saveHotelsAsync(hotels);
    } catch (error) {
      console.error('Error updating hotel:', error);
      return false;
    }
  }

  deleteHotel(id: string): boolean {
    try {
      const hotels = this.getHotels();
      const filteredHotels = hotels.filter(h => h.id !== id);
      if (filteredHotels.length === hotels.length) return false;
      return this.saveHotels(filteredHotels);
    } catch (error) {
      console.error('Error deleting hotel:', error);
      return false;
    }
  }

  async deleteHotelAsync(id: string): Promise<boolean> {
    try {
      const hotels = await this.getHotelsAsync();
      const filteredHotels = hotels.filter(h => h.id !== id);
      if (filteredHotels.length === hotels.length) return false;
      return await this.saveHotelsAsync(filteredHotels);
    } catch (error) {
      console.error('Error deleting hotel:', error);
      return false;
    }
  }

  // Ensure each country has 30 hotels
  async ensureHotelsForAllCountries(): Promise<void> {
    try {
      console.log('Starting ensureHotelsForAllCountries...');
      const countries = await this.getCountriesAsync();
      console.log(`Found ${countries.length} countries`);
      
      let allHotels = await this.getHotelsAsync();
      console.log(`Current total hotels: ${allHotels.length}`);
      
      let totalAdded = 0;
      
      for (const country of countries) {
        const countryHotels = allHotels.filter(h => h.countryId === country.id);
        const needed = 30 - countryHotels.length;
        
        if (needed > 0) {
          console.log(`Country ${country.name.en} needs ${needed} hotels (has ${countryHotels.length})`);
          const countryName = country.name;
          const cities = country.cities || [];
          
          // Create all hotels for this country at once
          const newHotels: Hotel[] = [];
          
          for (let i = 0; i < needed; i++) {
            const cityIndex = i % Math.max(cities.length, 1);
            const city = cities[cityIndex] || { name: { ar: '', en: '', fr: '' } };
            
            const hotelNames = [
              { ar: 'فندق', en: 'Hotel', fr: 'Hôtel' },
              { ar: 'ريزيدنس', en: 'Residence', fr: 'Résidence' },
              { ar: 'منتجع', en: 'Resort', fr: 'Résort' },
              { ar: 'سويت', en: 'Suite', fr: 'Suite' },
              { ar: 'بالاس', en: 'Palace', fr: 'Palais' }
            ];
            
            const hotelType = hotelNames[i % hotelNames.length];
            const hotelNumber = Math.floor(i / hotelNames.length) + 1;
            
            const newHotel: Hotel = {
              countryId: country.id,
              name: {
                ar: `${hotelType.ar} ${countryName.ar} ${hotelNumber}`,
                en: `${hotelType.en} ${countryName.en} ${hotelNumber}`,
                fr: `${hotelType.fr} ${countryName.fr} ${hotelNumber}`
              },
              description: {
                ar: `فندق فاخر في ${city.name.ar || countryName.ar}`,
                en: `Luxury hotel in ${city.name.en || countryName.en}`,
                fr: `Hôtel de luxe à ${city.name.fr || countryName.fr}`
              },
              address: {
                ar: `شارع رئيسي، ${city.name.ar || countryName.ar}`,
                en: `Main Street, ${city.name.en || countryName.en}`,
                fr: `Rue principale, ${city.name.fr || countryName.fr}`
              },
              city: city.name || { ar: '', en: '', fr: '' },
              phone: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
              email: `info@hotel${country.id}_${i + 1}.com`,
              imageUrl: `https://images.pexels.com/photos/${271743 + (totalAdded + i)}/pexels-photo-${271743 + (totalAdded + i)}.jpeg?auto=compress&cs=tinysrgb&w=800`,
              images: [],
              rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
              reviews: Math.floor(Math.random() * 500) + 10,
              stars: Math.floor(Math.random() * 3) + 3, // 3-5 stars
              pricePerNight: Math.floor(Math.random() * 200) + 50,
              currency: 'USD',
              amenities: {
                ar: ['واي فاي مجاني', 'موقف سيارات', 'مطعم', 'نادي صحي'],
                en: ['Free WiFi', 'Parking', 'Restaurant', 'Fitness Center'],
                fr: ['WiFi gratuit', 'Parking', 'Restaurant', 'Centre de fitness']
              },
              isFeatured: i < 3,
              isActive: true,
              id: `hotel_${country.id}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            newHotels.push(newHotel);
          }
          
          // Add all hotels at once
          allHotels = [...allHotels, ...newHotels];
          totalAdded += newHotels.length;
          console.log(`Added ${newHotels.length} hotels for country ${country.name.en}`);
        }
      }
      
      // Save all hotels at once
      if (totalAdded > 0) {
        console.log(`Saving ${totalAdded} new hotels...`);
        const saved = await this.saveHotelsAsync(allHotels);
        if (saved) {
          console.log(`Successfully saved ${totalAdded} new hotels. Total hotels: ${allHotels.length}`);
        } else {
          console.error('Failed to save hotels');
        }
      } else {
        console.log('No new hotels needed');
      }
      
      const finalHotels = await this.getHotelsAsync();
      console.log(`Finished ensuring hotels. Total hotels: ${finalHotels.length}`);
    } catch (error) {
      console.error('Error ensuring hotels for all countries:', error);
    }
  }

  // ========== Car Rentals Management ==========
  
  // Load car rentals from server
  private async loadCarRentalsFromServer(): Promise<CarRental[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/car-rentals`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<CarRental>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading car rentals from server:', error);
    }
    return null;
  }

  // Save car rentals to server
  private async saveCarRentalsToServer(carRentals: CarRental[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/car-rentals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carRentals)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving car rentals to server:', error);
    }
    return false;
  }

  async getCarRentalsAsync(): Promise<CarRental[]> {
    if (this.useServerStorage) {
      const serverData = await this.loadCarRentalsFromServer();
      if (isNonEmptyList(serverData)) {
        try {
          localStorage.setItem(this.CARS_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync server data to localStorage:', e);
        }
        return serverData;
      }
    }
    return this.getCarRentals();
  }

  getCarRentals(): CarRental[] {
    try {
      const data = localStorage.getItem(this.CARS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading car rentals:', error);
      return [];
    }
  }

  async saveCarRentalsAsync(carRentals: CarRental[]): Promise<boolean> {
    if (this.useServerStorage) {
      const serverSuccess = await this.saveCarRentalsToServer(carRentals);
      if (!serverSuccess) {
        console.warn('Failed to save car rentals to server, falling back to localStorage');
      }
    }
    return this.saveCarRentals(carRentals);
  }

  saveCarRentals(carRentals: CarRental[]): boolean {
    try {
      localStorage.setItem(this.CARS_KEY, JSON.stringify(carRentals));
      return true;
    } catch (error) {
      console.error('Error saving car rentals:', error);
      return false;
    }
  }

  getCarRentalsByCountry(countryId: string): CarRental[] {
    const carRentals = this.getCarRentals();
    return carRentals.filter(c => c.countryId === countryId && c.isActive);
  }

  addCarRental(carRental: Omit<CarRental, 'id' | 'createdAt' | 'updatedAt'>): CarRental | null {
    try {
      const carRentals = this.getCarRentals();
      const newCarRental: CarRental = {
        ...carRental,
        id: `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      carRentals.push(newCarRental);
      if (this.saveCarRentals(carRentals)) {
        return newCarRental;
      }
      return null;
    } catch (error) {
      console.error('Error adding car rental:', error);
      return null;
    }
  }

  async addCarRentalAsync(carRental: Omit<CarRental, 'id' | 'createdAt' | 'updatedAt'>): Promise<CarRental | null> {
    try {
      const carRentals = await this.getCarRentalsAsync();
      const newCarRental: CarRental = {
        ...carRental,
        id: `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      carRentals.push(newCarRental);
      const saved = await this.saveCarRentalsAsync(carRentals);
      if (saved) {
        console.log(`Successfully added car rental: ${newCarRental.name.en} (ID: ${newCarRental.id})`);
        return newCarRental;
      } else {
        console.error(`Failed to save car rental: ${newCarRental.name.en}`);
        return null;
      }
    } catch (error) {
      console.error('Error adding car rental:', error);
      return null;
    }
  }

  updateCarRental(id: string, updates: Partial<CarRental>): boolean {
    try {
      const carRentals = this.getCarRentals();
      const index = carRentals.findIndex(c => c.id === id);
      if (index === -1) return false;
      carRentals[index] = {
        ...carRentals[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.saveCarRentals(carRentals);
    } catch (error) {
      console.error('Error updating car rental:', error);
      return false;
    }
  }

  async updateCarRentalAsync(id: string, updates: Partial<CarRental>): Promise<boolean> {
    try {
      const carRentals = await this.getCarRentalsAsync();
      const index = carRentals.findIndex(c => c.id === id);
      if (index === -1) return false;
      carRentals[index] = {
        ...carRentals[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return await this.saveCarRentalsAsync(carRentals);
    } catch (error) {
      console.error('Error updating car rental:', error);
      return false;
    }
  }

  deleteCarRental(id: string): boolean {
    try {
      const carRentals = this.getCarRentals();
      const filteredCarRentals = carRentals.filter(c => c.id !== id);
      if (filteredCarRentals.length === carRentals.length) return false;
      return this.saveCarRentals(filteredCarRentals);
    } catch (error) {
      console.error('Error deleting car rental:', error);
      return false;
    }
  }

  async deleteCarRentalAsync(id: string): Promise<boolean> {
    try {
      const carRentals = await this.getCarRentalsAsync();
      const filteredCarRentals = carRentals.filter(c => c.id !== id);
      if (filteredCarRentals.length === carRentals.length) return false;
      return await this.saveCarRentalsAsync(filteredCarRentals);
    } catch (error) {
      console.error('Error deleting car rental:', error);
      return false;
    }
  }

  // Ensure each country has 30 car rental services
  async ensureCarRentalsForAllCountries(): Promise<void> {
    try {
      console.log('Starting ensureCarRentalsForAllCountries...');
      const countries = await this.getCountriesAsync();
      console.log(`Found ${countries.length} countries`);
      
      let allCarRentals = await this.getCarRentalsAsync();
      console.log(`Current total car rentals: ${allCarRentals.length}`);
      
      let totalAdded = 0;
      
      for (const country of countries) {
        const countryCarRentals = allCarRentals.filter(c => c.countryId === country.id);
        const needed = 30 - countryCarRentals.length;
        
        if (needed > 0) {
          console.log(`Country ${country.name.en} needs ${needed} car rentals (has ${countryCarRentals.length})`);
          const countryName = country.name;
          const cities = country.cities || [];
          
          // Create all car rentals for this country at once
          const newCarRentals: CarRental[] = [];
          
          const carTypes = [
            { ar: 'اقتصادية', en: 'Economy', fr: 'Économique' },
            { ar: 'متوسطة', en: 'Mid-size', fr: 'Taille moyenne' },
            { ar: 'فاخرة', en: 'Luxury', fr: 'Luxe' },
            { ar: 'دفع رباعي', en: 'SUV', fr: 'SUV' },
            { ar: 'فان', en: 'Van', fr: 'Van' }
          ];
          
          const serviceNames = [
            { ar: ['توصيل مجاني', 'تأمين شامل', 'دعم 24/7'], en: ['Free Delivery', 'Full Insurance', '24/7 Support'], fr: ['Livraison gratuite', 'Assurance complète', 'Support 24/7'] },
            { ar: ['GPS مجاني', 'مقاعد أطفال', 'تأمين شامل'], en: ['Free GPS', 'Child Seats', 'Full Insurance'], fr: ['GPS gratuit', 'Sièges enfants', 'Assurance complète'] },
            { ar: ['تأمين شامل', 'دعم 24/7', 'GPS مجاني'], en: ['Full Insurance', '24/7 Support', 'Free GPS'], fr: ['Assurance complète', 'Support 24/7', 'GPS gratuit'] }
          ];
          
          for (let i = 0; i < needed; i++) {
            const cityIndex = i % Math.max(cities.length, 1);
            const city = cities[cityIndex] || { name: { ar: '', en: '', fr: '' } };
            
            const companyNames = [
              { ar: 'شركة', en: 'Company', fr: 'Compagnie' },
              { ar: 'وكالة', en: 'Agency', fr: 'Agence' },
              { ar: 'خدمة', en: 'Service', fr: 'Service' }
            ];
            
            const companyType = companyNames[i % companyNames.length];
            const companyNumber = Math.floor(i / companyNames.length) + 1;
            
            // Generate 3-5 car types per rental service
            const numCarTypes = 3 + (i % 3); // 3-5 types
            const generatedCarTypes = [];
            
            for (let j = 0; j < numCarTypes; j++) {
              const typeIndex = (i + j) % carTypes.length;
              const carType = carTypes[typeIndex];
              const pricePerDay = 30 + (j * 20) + Math.floor(Math.random() * 30);
              
              generatedCarTypes.push({
                type: carType,
                pricePerDay,
                currency: 'USD',
                features: {
                  ar: ['مكيف', 'ناقل تلقائي', 'بلوتوث'],
                  en: ['AC', 'Automatic', 'Bluetooth'],
                  fr: ['Climatisation', 'Automatique', 'Bluetooth']
                }
              });
            }
            
            const serviceIndex = i % serviceNames.length;
            const services = serviceNames[serviceIndex];
            
            const newCarRental: CarRental = {
              countryId: country.id,
              name: {
                ar: `${companyType.ar} ${countryName.ar} ${companyNumber}`,
                en: `${companyType.en} ${countryName.en} ${companyNumber}`,
                fr: `${companyType.fr} ${countryName.fr} ${companyNumber}`
              },
              description: {
                ar: `خدمة استئجار سيارات موثوقة في ${city.name.ar || countryName.ar}`,
                en: `Reliable car rental service in ${city.name.en || countryName.en}`,
                fr: `Service de location de voitures fiable à ${city.name.fr || countryName.fr}`
              },
              address: {
                ar: `شارع رئيسي، ${city.name.ar || countryName.ar}`,
                en: `Main Street, ${city.name.en || countryName.en}`,
                fr: `Rue principale, ${city.name.fr || countryName.fr}`
              },
              city: city.name || { ar: '', en: '', fr: '' },
              phone: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
              email: `info@car${country.id}_${i + 1}.com`,
              imageUrl: `https://images.pexels.com/photos/${[
                3802508, 164634, 2365572, 1335077, 892522, 919073, 164558, 707046,
                733745, 1077785, 1149831, 1638459, 170811, 116675, 193999, 120049,
                112460, 193991, 1164778, 1119796, 3752169, 3764984, 2365572, 627678,
                919073, 892522, 707046, 733745, 1077785, 1149831
              ][(totalAdded + i) % 30]}/pexels-photo-${[
                3802508, 164634, 2365572, 1335077, 892522, 919073, 164558, 707046,
                733745, 1077785, 1149831, 1638459, 170811, 116675, 193999, 120049,
                112460, 193991, 1164778, 1119796, 3752169, 3764984, 2365572, 627678,
                919073, 892522, 707046, 733745, 1077785, 1149831
              ][(totalAdded + i) % 30]}.jpeg?auto=compress&cs=tinysrgb&w=800`,
              images: [],
              rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
              reviews: Math.floor(Math.random() * 500) + 10,
              carTypes: generatedCarTypes,
              services: services,
              isFeatured: i < 3,
              isActive: true,
              id: `car_${country.id}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            newCarRentals.push(newCarRental);
          }
          
          // Add all car rentals at once
          allCarRentals = [...allCarRentals, ...newCarRentals];
          totalAdded += newCarRentals.length;
          console.log(`Added ${newCarRentals.length} car rentals for country ${country.name.en}`);
        }
      }
      
      // Save all car rentals at once
      if (totalAdded > 0) {
        console.log(`Saving ${totalAdded} new car rentals...`);
        const saved = await this.saveCarRentalsAsync(allCarRentals);
        if (saved) {
          console.log(`Successfully saved ${totalAdded} new car rentals. Total car rentals: ${allCarRentals.length}`);
        } else {
          console.error('Failed to save car rentals');
        }
      } else {
        console.log('No new car rentals needed');
      }
      
      const finalCarRentals = await this.getCarRentalsAsync();
      console.log(`Finished ensuring car rentals. Total car rentals: ${finalCarRentals.length}`);
    } catch (error) {
      console.error('Error ensuring car rentals for all countries:', error);
    }
  }

  // ========== Car Vehicles Management ==========
  
  // Load car vehicles from server
  private async loadCarVehiclesFromServer(): Promise<CarVehicle[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/car-vehicles`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<CarVehicle>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading car vehicles from server:', error);
    }
    return null;
  }

  // Save car vehicles to server
  private async saveCarVehiclesToServer(vehicles: CarVehicle[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/car-vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicles)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving car vehicles to server:', error);
    }
    return false;
  }

  async getCarVehiclesAsync(): Promise<CarVehicle[]> {
    if (this.useServerStorage) {
      const serverData = await this.loadCarVehiclesFromServer();
      if (isNonEmptyList(serverData)) {
        try {
          localStorage.setItem(this.VEHICLES_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync server data to localStorage:', e);
        }
        return serverData;
      }
    }
    return this.getCarVehicles();
  }

  getCarVehicles(): CarVehicle[] {
    try {
      const data = localStorage.getItem(this.VEHICLES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading car vehicles:', error);
      return [];
    }
  }

  async saveCarVehiclesAsync(vehicles: CarVehicle[]): Promise<boolean> {
    if (this.useServerStorage) {
      const serverSuccess = await this.saveCarVehiclesToServer(vehicles);
      if (!serverSuccess) {
        console.warn('Failed to save car vehicles to server, falling back to localStorage');
      }
    }
    return this.saveCarVehicles(vehicles);
  }

  saveCarVehicles(vehicles: CarVehicle[]): boolean {
    try {
      localStorage.setItem(this.VEHICLES_KEY, JSON.stringify(vehicles));
      return true;
    } catch (error) {
      console.error('Error saving car vehicles:', error);
      return false;
    }
  }

  getCarVehiclesByRental(carRentalId: string): CarVehicle[] {
    const vehicles = this.getCarVehicles();
    return vehicles.filter(v => v.carRentalId === carRentalId && v.isActive);
  }

  async getCarVehiclesByRentalAsync(carRentalId: string): Promise<CarVehicle[]> {
    const vehicles = await this.getCarVehiclesAsync();
    return vehicles.filter(v => v.carRentalId === carRentalId && v.isActive);
  }

  addCarVehicle(vehicle: Omit<CarVehicle, 'id' | 'createdAt' | 'updatedAt'>): CarVehicle | null {
    try {
      const vehicles = this.getCarVehicles();
      const newVehicle: CarVehicle = {
        ...vehicle,
        id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      vehicles.push(newVehicle);
      if (this.saveCarVehicles(vehicles)) {
        return newVehicle;
      }
      return null;
    } catch (error) {
      console.error('Error adding car vehicle:', error);
      return null;
    }
  }

  async addCarVehicleAsync(vehicle: Omit<CarVehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<CarVehicle | null> {
    try {
      const vehicles = await this.getCarVehiclesAsync();
      const newVehicle: CarVehicle = {
        ...vehicle,
        id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      vehicles.push(newVehicle);
      const saved = await this.saveCarVehiclesAsync(vehicles);
      if (saved) {
        console.log(`Successfully added vehicle: ${newVehicle.name.en} (ID: ${newVehicle.id})`);
        return newVehicle;
      } else {
        console.error(`Failed to save vehicle: ${newVehicle.name.en}`);
        return null;
      }
    } catch (error) {
      console.error('Error adding car vehicle:', error);
      return null;
    }
  }

  updateCarVehicle(id: string, updates: Partial<CarVehicle>): boolean {
    try {
      const vehicles = this.getCarVehicles();
      const index = vehicles.findIndex(v => v.id === id);
      if (index === -1) return false;
      vehicles[index] = {
        ...vehicles[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.saveCarVehicles(vehicles);
    } catch (error) {
      console.error('Error updating car vehicle:', error);
      return false;
    }
  }

  async updateCarVehicleAsync(id: string, updates: Partial<CarVehicle>): Promise<boolean> {
    try {
      const vehicles = await this.getCarVehiclesAsync();
      const index = vehicles.findIndex(v => v.id === id);
      if (index === -1) return false;
      vehicles[index] = {
        ...vehicles[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return await this.saveCarVehiclesAsync(vehicles);
    } catch (error) {
      console.error('Error updating car vehicle:', error);
      return false;
    }
  }

  deleteCarVehicle(id: string): boolean {
    try {
      const vehicles = this.getCarVehicles();
      const filteredVehicles = vehicles.filter(v => v.id !== id);
      if (filteredVehicles.length === vehicles.length) return false;
      return this.saveCarVehicles(filteredVehicles);
    } catch (error) {
      console.error('Error deleting car vehicle:', error);
      return false;
    }
  }

  async deleteCarVehicleAsync(id: string): Promise<boolean> {
    try {
      const vehicles = await this.getCarVehiclesAsync();
      const filteredVehicles = vehicles.filter(v => v.id !== id);
      if (filteredVehicles.length === vehicles.length) return false;
      return await this.saveCarVehiclesAsync(filteredVehicles);
    } catch (error) {
      console.error('Error deleting car vehicle:', error);
      return false;
    }
  }

  // Ensure each car rental has sample vehicles
  async ensureVehiclesForCarRentals(): Promise<void> {
    try {
      console.log('Starting ensureVehiclesForCarRentals...');
      const carRentals = await this.getCarRentalsAsync();
      console.log(`Found ${carRentals.length} car rentals`);
      
      let allVehicles = await this.getCarVehiclesAsync();
      console.log(`Current total vehicles: ${allVehicles.length}`);
      
      let totalAdded = 0;
      const vehiclesPerRental = 30; // 30 vehicles per rental agency
      
      const brands = [
        { ar: 'تويوتا', en: 'Toyota', fr: 'Toyota' },
        { ar: 'هوندا', en: 'Honda', fr: 'Honda' },
        { ar: 'نيسان', en: 'Nissan', fr: 'Nissan' },
        { ar: 'فورد', en: 'Ford', fr: 'Ford' },
        { ar: 'شيفروليه', en: 'Chevrolet', fr: 'Chevrolet' },
        { ar: 'بي إم دبليو', en: 'BMW', fr: 'BMW' },
        { ar: 'مرسيدس', en: 'Mercedes', fr: 'Mercedes' },
        { ar: 'أودي', en: 'Audi', fr: 'Audi' },
        { ar: 'كيا', en: 'Kia', fr: 'Kia' },
        { ar: 'هيونداي', en: 'Hyundai', fr: 'Hyundai' },
        { ar: 'مازدا', en: 'Mazda', fr: 'Mazda' },
        { ar: 'فولكس واجن', en: 'Volkswagen', fr: 'Volkswagen' },
        { ar: 'بيجو', en: 'Peugeot', fr: 'Peugeot' },
        { ar: 'رينو', en: 'Renault', fr: 'Renault' },
        { ar: 'تسلا', en: 'Tesla', fr: 'Tesla' }
      ];

      const models = [
        'Corolla', 'Camry', 'RAV4', 'Civic', 'Accord', 'CR-V', 'Altima', 'Maxima', 
        'Rogue', 'Escape', 'Explorer', 'Mustang', 'Malibu', 'Tahoe', 'Suburban',
        'X3', 'X5', 'Series 3', 'C-Class', 'E-Class', 'GLE', 'A4', 'Q5', 'Q7',
        'Sportage', 'Sorento', 'Tucson', 'Santa Fe', 'CX-5', 'Model 3'
      ];
      
      const types: CarVehicle['type'][] = ['economy', 'economy', 'mid-size', 'mid-size', 'luxury', 'suv', 'suv', 'van', 'sports', 'electric'];
      
      for (const rental of carRentals) {
        const rentalVehicles = allVehicles.filter(v => v.carRentalId === rental.id);
        const needed = vehiclesPerRental - rentalVehicles.length;
        
        if (needed > 0) {
          console.log(`Rental ${rental.name.en} needs ${needed} vehicles (has ${rentalVehicles.length})`);
          const newVehicles: CarVehicle[] = [];
          
          for (let i = 0; i < needed; i++) {
            const brandIndex = i % brands.length;
            const brand = brands[brandIndex];
            const model = models[i % models.length];
            const type = types[i % types.length];
            const year = 2020 + (i % 5); // 2020-2024
            
            const basePriceByType = {
              economy: 30,
              'mid-size': 50,
              luxury: 120,
              suv: 80,
              van: 70,
              sports: 150,
              electric: 90
            };
            
            const price = basePriceByType[type] + Math.floor(Math.random() * 30);
            
            const newVehicle: CarVehicle = {
              carRentalId: rental.id,
              countryId: rental.countryId,
              name: {
                ar: `${brand.ar} ${model}`,
                en: `${brand.en} ${model}`,
                fr: `${brand.fr} ${model}`
              },
              brand: brand,
              model: model,
              year: year,
              type: type,
              transmission: i % 2 === 0 ? 'automatic' : 'manual',
              fuelType: type === 'electric' ? 'electric' : i % 3 === 0 ? 'diesel' : 'gasoline',
              seats: type === 'van' ? 7 : type === 'economy' ? 5 : 5,
              doors: type === 'sports' ? 2 : 4,
              pricePerDay: price,
              currency: 'USD',
              imageUrl: `https://images.pexels.com/photos/${[
                170811, 1335077, 707046, 164634, 892522, 112460, 733745, 919073,
                1149831, 193999, 3802508, 1638459, 3764984, 116675, 1077785, 120049,
                193991, 627678, 1119796, 3752169, 1164778, 2365572, 244206, 305070,
                1545743, 1280560, 358070, 248747, 190574, 1280560, 1077785, 919073,
                170811, 707046, 892522, 733745, 1335077, 164634, 3802508, 1638459
              ][(totalAdded + i) % 40]}/pexels-photo-${[
                170811, 1335077, 707046, 164634, 892522, 112460, 733745, 919073,
                1149831, 193999, 3802508, 1638459, 3764984, 116675, 1077785, 120049,
                193991, 627678, 1119796, 3752169, 1164778, 2365572, 244206, 305070,
                1545743, 1280560, 358070, 248747, 190574, 1280560, 1077785, 919073,
                170811, 707046, 892522, 733745, 1335077, 164634, 3802508, 1638459
              ][(totalAdded + i) % 40]}.jpeg?auto=compress&cs=tinysrgb&w=800`,
              images: [],
              features: {
                ar: ['مكيف', 'نظام ملاحة GPS', 'بلوتوث', 'كاميرا خلفية'],
                en: ['AC', 'GPS Navigation', 'Bluetooth', 'Backup Camera'],
                fr: ['Climatisation', 'Navigation GPS', 'Bluetooth', 'Caméra de recul']
              },
              specifications: {
                ar: [`محرك ${type === 'electric' ? 'كهربائي' : '2.0 لتر'}`, 'استهلاك اقتصادي', 'أمان عالي'],
                en: [`${type === 'electric' ? 'Electric' : '2.0L'} Engine`, 'Fuel Efficient', 'High Safety'],
                fr: [`Moteur ${type === 'electric' ? 'électrique' : '2.0L'}`, 'Économique', 'Sécurité élevée']
              },
              description: {
                ar: `سيارة ${brand.ar} ${model} ${year} - مريحة واقتصادية`,
                en: `${brand.en} ${model} ${year} - Comfortable and economical`,
                fr: `${brand.fr} ${model} ${year} - Confortable et économique`
              },
              available: true,
              isFeatured: i < 2,
              isActive: true,
              id: `vehicle_${rental.id}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            newVehicles.push(newVehicle);
          }
          
          allVehicles = [...allVehicles, ...newVehicles];
          totalAdded += newVehicles.length;
          console.log(`Added ${newVehicles.length} vehicles for rental ${rental.name.en}`);
        }
      }
      
      if (totalAdded > 0) {
        console.log(`Saving ${totalAdded} new vehicles...`);
        const saved = await this.saveCarVehiclesAsync(allVehicles);
        if (saved) {
          console.log(`Successfully saved ${totalAdded} new vehicles. Total vehicles: ${allVehicles.length}`);
        } else {
          console.error('Failed to save vehicles');
        }
      } else {
        console.log('No new vehicles needed');
      }
      
      const finalVehicles = await this.getCarVehiclesAsync();
      console.log(`Finished ensuring vehicles. Total vehicles: ${finalVehicles.length}`);
    } catch (error) {
      console.error('Error ensuring vehicles for car rentals:', error);
    }
  }

  private getDefaultHeroContent(): HeroContent {
    return {
      headerImages: [
        'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/5117917/pexels-photo-5117917.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/4669408/pexels-photo-4669408.jpeg?auto=compress&cs=tinysrgb&w=1920',
      ],
      heroTitle: {
        ar: 'مرحباً بكم في',
        en: 'Welcome to',
        fr: 'Bienvenue à'
      },
      heroSubtitle: {
        ar: 'ciarTOU',
        en: 'ciarTOU',
        fr: 'ciarTOU'
      },
      heroDescription: {
        ar: 'رفيقكم المثالي لاستكشاف العالم. نقدم أفضل الخدمات السياحية عبر شبكة واسعة من المكاتب في أكثر من 50 دولة حول العالم',
        en: 'Your perfect companion to explore the world. We provide top tourism services through an extensive network of offices in more than 50 countries worldwide',
        fr: 'Votre compagnon idéal pour explorer le monde. Nous fournissons les meilleurs services touristiques grâce à un vaste réseau de bureaux dans plus de 50 pays dans le monde'
      },
      primaryButtonText: {
        ar: 'استكشف المكاتب السياحية',
        en: 'Explore Travel Offices',
        fr: 'Explorer les Bureaux de Voyage'
      },
      secondaryButtonText: {
        ar: 'اتصل بنا',
        en: 'Contact Us',
        fr: 'Contactez-nous'
      },
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate a diverse set of tour offers for a country
   */
  private generateTourOffersForCountry(country: AdminCountryData, startIndex: number, count: number): TourOffer[] {
    const offerTemplates = [
      {
        title: {
          ar: `جولة ثقافية في ${country.name.ar}`,
          en: `Cultural Tour in ${country.name.en}`,
          fr: `Tour Culturel à ${country.name.fr}`,
        },
        description: {
          ar: `اكتشف التراث الثقافي الغني لـ${country.name.ar} من خلال زيارة المتاحف والمواقع التاريخية والمعالم الثقافية المميزة.`,
          en: `Discover the rich cultural heritage of ${country.name.en} by visiting museums, historical sites, and distinctive cultural landmarks.`,
          fr: `Découvrez le riche patrimoine culturel de ${country.name.fr} en visitant des musées, des sites historiques et des monuments culturels distinctifs.`,
        },
        basePrice: 450,
        durationDays: 5,
      },
      {
        title: {
          ar: `مغامرة في طبيعة ${country.name.ar}`,
          en: `Adventure in ${country.name.en}'s Nature`,
          fr: `Aventure dans la Nature de ${country.name.fr}`,
        },
        description: {
          ar: `استمتع بمغامرة مثيرة في الطبيعة الخلابة لـ${country.name.ar} مع أنشطة متنوعة مثل المشي لمسافات طويلة والتخييم واستكشاف المناطق الطبيعية.`,
          en: `Enjoy an exciting adventure in the scenic nature of ${country.name.en} with various activities such as hiking, camping, and exploring natural areas.`,
          fr: `Profitez d'une aventure passionnante dans la nature pittoresque de ${country.name.fr} avec diverses activités telles que la randonnée, le camping et l'exploration des zones naturelles.`,
        },
        basePrice: 550,
        durationDays: 4,
      },
      {
        title: {
          ar: `رحلة شاطئية إلى ${country.name.ar}`,
          en: `Beach Trip to ${country.name.en}`,
          fr: `Voyage Plage à ${country.name.fr}`,
        },
        description: {
          ar: `استرخِ على الشواطئ الجميلة لـ${country.name.ar} واستمتع بالأنشطة المائية والرياضات البحرية والاستجمام تحت أشعة الشمس.`,
          en: `Relax on the beautiful beaches of ${country.name.en} and enjoy water activities, water sports, and relaxation under the sun.`,
          fr: `Détendez-vous sur les belles plages de ${country.name.fr} et profitez des activités aquatiques, des sports nautiques et de la détente au soleil.`,
        },
        basePrice: 400,
        durationDays: 3,
      },
      {
        title: {
          ar: `جولة في مدن ${country.name.ar}`,
          en: `City Tour in ${country.name.en}`,
          fr: `Tour de Ville à ${country.name.fr}`,
        },
        description: {
          ar: `استكشف المدن الرئيسية في ${country.name.ar} واكتشف المعالم السياحية الحديثة والمقاهي والمطاعم والحياة الليلية النابضة بالحياة.`,
          en: `Explore the main cities of ${country.name.en} and discover modern tourist attractions, cafes, restaurants, and vibrant nightlife.`,
          fr: `Explorez les principales villes de ${country.name.fr} et découvrez les attractions touristiques modernes, les cafés, les restaurants et la vie nocturne animée.`,
        },
        basePrice: 380,
        durationDays: 3,
      },
      {
        title: {
          ar: `رحلة تاريخية في ${country.name.ar}`,
          en: `Historical Journey in ${country.name.en}`,
          fr: `Voyage Historique à ${country.name.fr}`,
        },
        description: {
          ar: `تعرف على التاريخ العريق لـ${country.name.ar} من خلال زيارة القلاع والآثار القديمة والمواقع الأثرية التي تحكي قصص الحضارات القديمة.`,
          en: `Learn about the ancient history of ${country.name.en} by visiting castles, ancient monuments, and archaeological sites that tell stories of ancient civilizations.`,
          fr: `Découvrez l'histoire ancienne de ${country.name.fr} en visitant des châteaux, des monuments anciens et des sites archéologiques qui racontent des histoires de civilisations anciennes.`,
        },
        basePrice: 500,
        durationDays: 6,
      },
      {
        title: {
          ar: `تجربة طعام في ${country.name.ar}`,
          en: `Culinary Experience in ${country.name.en}`,
          fr: `Expérience Culinaire à ${country.name.fr}`,
        },
        description: {
          ar: `استمتع بتجربة طعام فريدة في ${country.name.ar} مع جولات تذوق الطعام وزيارة الأسواق المحلية وتعلم طهي الأطباق التقليدية.`,
          en: `Enjoy a unique culinary experience in ${country.name.en} with food tasting tours, visits to local markets, and learning to cook traditional dishes.`,
          fr: `Profitez d'une expérience culinaire unique à ${country.name.fr} avec des visites de dégustation, des visites aux marchés locaux et l'apprentissage de la cuisine de plats traditionnels.`,
        },
        basePrice: 420,
        durationDays: 4,
      },
      {
        title: {
          ar: `رحلة رومانسية إلى ${country.name.ar}`,
          en: `Romantic Trip to ${country.name.en}`,
          fr: `Voyage Romantique à ${country.name.fr}`,
        },
        description: {
          ar: `قضاء عطلة رومانسية في ${country.name.ar} مع أماكن إقامة فاخرة وعروض خاصة للزوجين وأنشطة رومانسية لا تُنسى.`,
          en: `Spend a romantic vacation in ${country.name.en} with luxury accommodations, special offers for couples, and unforgettable romantic activities.`,
          fr: `Passez des vacances romantiques à ${country.name.fr} avec des hébergements de luxe, des offres spéciales pour les couples et des activités romantiques inoubliables.`,
        },
        basePrice: 650,
        durationDays: 5,
      },
      {
        title: {
          ar: `رحلة عائلية إلى ${country.name.ar}`,
          en: `Family Trip to ${country.name.en}`,
          fr: `Voyage Familial à ${country.name.fr}`,
        },
        description: {
          ar: `رحلة مثالية للعائلة في ${country.name.ar} مع أنشطة مناسبة لجميع الأعمار وبرامج ترفيهية للأطفال وأماكن إقامة مريحة للعائلات.`,
          en: `Perfect family trip in ${country.name.en} with age-appropriate activities, entertainment programs for children, and comfortable family accommodations.`,
          fr: `Voyage familial parfait à ${country.name.fr} avec des activités adaptées à tous les âges, des programmes de divertissement pour les enfants et des hébergements familiaux confortables.`,
        },
        basePrice: 480,
        durationDays: 4,
      },
      {
        title: {
          ar: `جولة دينية في ${country.name.ar}`,
          en: `Religious Tour in ${country.name.en}`,
          fr: `Tour Religieux à ${country.name.fr}`,
        },
        description: {
          ar: `زيارة الأماكن المقدسة والمساجد والكنائس والمعالم الدينية المهمة في ${country.name.ar} مع مرشدين متخصصين.`,
          en: `Visit holy places, mosques, churches, and important religious landmarks in ${country.name.en} with specialized guides.`,
          fr: `Visitez les lieux saints, les mosquées, les églises et les monuments religieux importants de ${country.name.fr} avec des guides spécialisés.`,
        },
        basePrice: 350,
        durationDays: 3,
      },
      {
        title: {
          ar: `رحلة فاخرة في ${country.name.ar}`,
          en: `Luxury Trip to ${country.name.en}`,
          fr: `Voyage de Luxe à ${country.name.fr}`,
        },
        description: {
          ar: `استمتع برحلة فاخرة في ${country.name.ar} مع فنادق 5 نجوم ووسائل نقل خاصة وبرامج VIP وخدمات حصرية.`,
          en: `Enjoy a luxury trip in ${country.name.en} with 5-star hotels, private transportation, VIP programs, and exclusive services.`,
          fr: `Profitez d'un voyage de luxe à ${country.name.fr} avec des hôtels 5 étoiles, des transports privés, des programmes VIP et des services exclusifs.`,
        },
        basePrice: 850,
        durationDays: 7,
      },
    ];

    const generatedOffers: TourOffer[] = [];
    const existingCount = startIndex;

    for (let i = 0; i < count; i++) {
      const templateIndex = i % offerTemplates.length;
      const template = offerTemplates[templateIndex];
      const offerNumber = existingCount + i + 1;

      // Vary prices based on country and offer type
      const priceVariation = Math.floor(Math.random() * 200) - 100; // ±100 USD variation
      const finalPrice = template.basePrice + priceVariation + (country.totalTours || 0) * 10;

      const newOffer: TourOffer = {
        id: `offer_${country.id}_${offerNumber}_${Date.now()}_${i}`,
        countryId: country.id,
        title: template.title,
        description: template.description,
        price: Math.max(300, finalPrice), // Minimum 300 USD
        currency: 'USD',
        durationDays: template.durationDays,
        isFeatured: i % 3 === 0, // Every 3rd offer is featured
        imageUrl: country.mainImage,
        videos: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      generatedOffers.push(newOffer);
    }

    return generatedOffers;
  }

  /**
   * Ensure there are at least `minOffersPerCountry` tour offers for every country.
   * This is mainly used to bootstrap demo data for the offers page.
   */
  ensureOffersForAllCountries(minOffersPerCountry = 10): void {
    try {
      const countries = this.getCountries();
      const offers = this.getOffers();
      let changed = false;

      countries.forEach((country) => {
        const existingForCountry = offers.filter((o) => o.countryId === country.id);
        const missingCount = Math.max(0, minOffersPerCountry - existingForCountry.length);
        if (missingCount === 0) return;

        // Generate diverse offers for this country
        const newOffers = this.generateTourOffersForCountry(country, existingForCountry.length, missingCount);
        newOffers.forEach(offer => {
          offers.push(offer);
          changed = true;
        });
      });

      if (changed) {
        this.saveOffers(offers);
      }
    } catch (error) {
      console.error('Error ensuring default offers:', error);
    }
  }

  /**
   * Async version: Ensure there are at least `minOffersPerCountry` tour offers for every country and save to server.
   */
  async ensureOffersForAllCountriesAsync(minOffersPerCountry = 10): Promise<void> {
    try {
      const countries = await this.getCountriesAsync();
      const offers = await this.getOffersAsync();
      let changed = false;
      const allOffers = [...offers];

      countries.forEach((country) => {
        const existingForCountry = allOffers.filter((o) => o.countryId === country.id);
        const missingCount = Math.max(0, minOffersPerCountry - existingForCountry.length);
        if (missingCount === 0) return;

        // Generate diverse offers for this country
        const newOffers = this.generateTourOffersForCountry(country, existingForCountry.length, missingCount);
        newOffers.forEach(offer => {
          allOffers.push(offer);
          changed = true;
        });
      });

      if (changed) {
        await this.saveOffersAsync(allOffers);
      }
    } catch (error) {
      console.error('Error ensuring default offers:', error);
    }
  }

  /**
   * Ensure a minimum number of offers per country and return the updated list.
   * Can be scoped to specific country IDs to avoid generating for the entire catalog.
   */
  async ensureMinimumOffersForCountries(
    minOffersPerCountry = 10,
    targetCountryIds?: string[]
  ): Promise<TourOffer[]> {
    try {
      const countries = await this.getCountriesAsync();
      const offers = await this.getOffersAsync();
      const targetCountries = targetCountryIds?.length
        ? countries.filter((c) => targetCountryIds.includes(c.id))
        : countries;

      const allOffers = [...offers];
      let changed = false;

      targetCountries.forEach((country) => {
        const existingForCountry = allOffers.filter((o) => o.countryId === country.id);
        const missingCount = Math.max(0, minOffersPerCountry - existingForCountry.length);
        if (missingCount === 0) return;

        const newOffers = this.generateTourOffersForCountry(
          country,
          existingForCountry.length,
          missingCount
        );
        newOffers.forEach((offer) => allOffers.push(offer));
        changed = true;
      });

      if (changed) {
        await this.saveOffersAsync(allOffers);
      }

      return allOffers;
    } catch (error) {
      console.error('Error ensuring minimum offers:', error);
      return this.getOffers();
    }
  }

  // Ensure each country has at least one office; returns the full office list
  async ensureOfficesForAllCountries(): Promise<TravelOffice[]> {
    try {
      await this.getCountriesAsync();
      const { getAllCountriesWithDynamic } = await import('@/data/countries');
      const allCountries = getAllCountriesWithDynamic();
      const offices = await this.getOfficesAsync();
      let changed = false;
      let addedCount = 0;

      allCountries.forEach((country) => {
        const existingOffice = offices.find((o) => o.countryId === country.id);
        if (existingOffice) return;

        const defaultOffice: TravelOffice = {
          id: `office_${country.id}_${Date.now()}`,
          countryId: country.id,
          name: {
            ar: `مكتب ${country.name.ar}`,
            en: `${country.name.en} Office`,
            fr: `Bureau ${country.name.fr}`,
          },
          address: {
            ar: country.capital?.ar || `مركز ${country.name.ar}`,
            en: country.capital?.en || `${country.name.en} Center`,
            fr: country.capital?.fr || `Centre ${country.name.fr}`,
          },
          phone: this.getDefaultPhoneForCountry(country.id),
          email: this.getDefaultEmailForCountry(country.id),
          website: '',
          manager: {
            ar: `مدير مكتب ${country.name.ar}`,
            en: `${country.name.en} Office Manager`,
            fr: `Gestionnaire du Bureau ${country.name.fr}`,
          },
          services: {
            ar: ['حجز الفنادق', 'تنظيم الرحلات', 'تذاكر الطيران', 'التأشيرات', 'الاستقبال في المطار'],
            en: ['Hotel Booking', 'Tour Organization', 'Flight Tickets', 'Visas', 'Airport Pickup'],
            fr: ['Réservation d\'Hôtels', 'Organisation de Circuits', 'Billets d\'Avion', 'Visas', 'Transfert Aéroport'],
          },
          workingHours: {
            ar: 'السبت - الخميس: 9:00 صباحاً - 6:00 مساءً',
            en: 'Saturday - Thursday: 9:00 AM - 6:00 PM',
            fr: 'Samedi - Jeudi: 9h00 - 18h00',
          },
          coordinates: this.getDefaultCoordinatesForCountry(country.id),
          rating: country.rating || 4.5,
          reviews: Math.floor((country.totalReviews || 0) / 10),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        offices.push(defaultOffice);
        changed = true;
        addedCount++;
      });

      if (changed) {
        await this.saveOfficesAsync(offices);
        console.log(`تم إضافة ${addedCount} مكتب جديد`);
      }

      return offices;
    } catch (error) {
      console.error('Error ensuring default offices:', error);
      return this.getOffices();
    }
  }

  // Get default phone number for country
  private getDefaultPhoneForCountry(countryId: string): string {
    const phoneMap: Record<string, string> = {
      sudan: '+249 123 456 789',
      saudi: '+966 11 234 5678',
      uae: '+971 4 567 8901',
      egypt: '+20 2 234 5678',
      turkey: '+90 212 345 6789',
      morocco: '+212 522 123 456',
      jordan: '+962 6 123 4567',
      lebanon: '+961 1 234 567',
      tunisia: '+216 71 123 456',
      algeria: '+213 21 123 456',
      iraq: '+964 1 123 4567',
      yemen: '+967 1 234 567',
      syria: '+963 11 123 4567',
      libya: '+218 21 123 456',
      oman: '+968 24 123 456',
      kuwait: '+965 1 234 5678',
      qatar: '+974 4 123 456',
      bahrain: '+973 17 123 456',
    };
    return phoneMap[countryId] || '+1 234 567 8900';
  }

  // Get default email for country
  private getDefaultEmailForCountry(countryId: string): string {
    const countryNames: Record<string, string> = {
      sudan: 'khartoum',
      saudi: 'riyadh',
      uae: 'dubai',
      egypt: 'cairo',
      turkey: 'istanbul',
      morocco: 'casablanca',
      jordan: 'amman',
      lebanon: 'beirut',
      tunisia: 'tunis',
      algeria: 'algiers',
      iraq: 'baghdad',
      yemen: 'sanaa',
      syria: 'damascus',
      libya: 'tripoli',
      oman: 'muscat',
      kuwait: 'kuwait',
      qatar: 'doha',
      bahrain: 'manama',
    };
    const cityName = countryNames[countryId] || 'office';
    return `${cityName}@ciar.com`;
  }

  // Get default coordinates for country
  private getDefaultCoordinatesForCountry(countryId: string): { lat: number; lng: number } | undefined {
    const coordinatesMap: Record<string, { lat: number; lng: number }> = {
      sudan: { lat: 15.5007, lng: 32.5599 }, // Khartoum
      saudi: { lat: 24.7136, lng: 46.6753 }, // Riyadh
      uae: { lat: 25.2048, lng: 55.2708 }, // Dubai
      egypt: { lat: 30.0444, lng: 31.2357 }, // Cairo
      turkey: { lat: 41.0082, lng: 28.9784 }, // Istanbul
      morocco: { lat: 33.5731, lng: -7.5898 }, // Casablanca
      jordan: { lat: 31.9539, lng: 35.9106 }, // Amman
      lebanon: { lat: 33.8547, lng: 35.8623 }, // Beirut
      tunisia: { lat: 36.8065, lng: 10.1815 }, // Tunis
      algeria: { lat: 36.7538, lng: 3.0588 }, // Algiers
      iraq: { lat: 33.3152, lng: 44.3661 }, // Baghdad
      yemen: { lat: 15.3694, lng: 44.1910 }, // Sanaa
      syria: { lat: 33.5138, lng: 36.2765 }, // Damascus
      libya: { lat: 32.8872, lng: 13.1913 }, // Tripoli
      oman: { lat: 23.5859, lng: 58.4059 }, // Muscat
      kuwait: { lat: 29.3759, lng: 47.9774 }, // Kuwait City
      qatar: { lat: 25.2854, lng: 51.5310 }, // Doha
      bahrain: { lat: 26.0667, lng: 50.5577 }, // Manama
    };
    return coordinatesMap[countryId];
  }

  // Get statistics
  getStatistics() {
    const countries = this.getCountries();
    const offices = this.getOffices();
    
    const totalCountries = countries.length;
    const activeCountries = countries.filter(c => c.isActive).length;
    const totalOffices = offices.length;
    const activeOffices = offices.filter(o => o.isActive).length;
    
    const totalTours = countries.reduce((sum, country) => sum + (country.totalTours || 0), 0);
    const totalReviews = countries.reduce((sum, country) => sum + (country.totalReviews || 0), 0);
    const avgRating = countries.length > 0 
      ? countries.reduce((sum, country) => sum + (country.rating || 0), 0) / countries.length 
      : 0;

    return {
      totalCountries,
      activeCountries,
      totalOffices,
      activeOffices,
      totalTours,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      officesPerCountry: totalCountries > 0 ? Math.round(totalOffices / totalCountries * 10) / 10 : 0
    };
  }

  // Default countries data (fallback)
  private getDefaultCountries(): AdminCountryData[] {
    return [
      {
        id: 'sudan',
        name: { ar: 'السودان', en: 'Sudan', fr: 'Soudan' },
        description: {
          ar: 'أرض الحضارات القديمة والطبيعة الخلابة، حيث التقاء النيلين الأزرق والأبيض',
          en: 'Land of ancient civilizations and stunning nature, where the Blue and White Niles meet',
          fr: 'Terre des civilisations anciennes et de la nature époustouflante, où se rencontrent les Nils Bleu et Blanc'
        },
        continent: 'africa',
        capital: { ar: 'الخرطوم', en: 'Khartoum', fr: 'Khartoum' },
        currency: { ar: 'جن��ه سوداني', en: 'Sudanese Pound', fr: 'Livre Soudanaise' },
        language: { ar: 'العربية', en: 'Arabic', fr: 'Arabe' },
        bestTimeToVisit: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        mainImage: 'https://images.unsplash.com/photo-1620487792776-a257eb0c5f2c',
        gallery: [
          'https://images.unsplash.com/photo-1620487792776-a257eb0c5f2c',
          'https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg',
          'https://images.pexels.com/photos/10546022/pexels-photo-10546022.jpeg',
          'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sudan_Jebel_Marra_Deriba_Lakes_edited.jpg',
          'https://images.pexels.com/photos/10546023/pexels-photo-10546023.jpeg',
        ],
        rating: 4.9,
        totalReviews: 2847,
        totalTours: 25,
        highlights: {
          ar: ['ملتقى النيلين', 'أهرامات مروي', 'جزيرة مقرن', 'النيل الأزرق', 'السوق الشعبي'],
          en: ['Blue and White Nile Confluence', 'Meroe Pyramids', 'Mogran Island', 'Blue Nile', 'Traditional Souq'],
          fr: ['Confluence des Nils Bleu et Blanc', 'Pyramides de Méroé', 'Île de Mogran', 'Nil Bleu', 'Souk Traditionnel']
        },
        culture: {
          ar: ['الضيافة السودانية', 'الموسيقى التراثية', 'الحرف اليدوية', 'المأكولات الشعبية'],
          en: ['Sudanese Hospitality', 'Traditional Music', 'Handicrafts', 'Local Cuisine'],
          fr: ['Hospitalité Soudanaise', 'Musique Traditionnelle', 'Artisanat', 'Cuisine Locale']
        },
        cuisine: {
          ar: ['الملاح', 'الكسرة', 'المولح', 'عصيدة الذرة'],
          en: ['Mullah', 'Kisra', 'Mulah', 'Asida'],
          fr: ['Mullah', 'Kisra', 'Mulah', 'Asida']
        },
        transportation: {
          ar: ['الطيران المحلي', 'الحافلات', 'القطارات', 'التاكسي'],
          en: ['Domestic Flights', 'Buses', 'Trains', 'Taxis'],
          fr: ['Vols Domestiques', 'Bus', 'Trains', 'Taxis']
        },
        safety: {
          ar: ['آمن للسياح', 'مرشدين محليين متاحين', 'خدمات طوارئ 24/7'],
          en: ['Safe for Tourists', 'Local Guides Available', '24/7 Emergency Services'],
          fr: ['Sûr pour les Touristes', 'Guides Locaux Disponibles', 'Services d\'Urgence 24/7']
        },
        cities: [
          {
            name: { ar: 'الخرطوم', en: 'Khartoum', fr: 'Khartoum' },
            description: {
              ar: 'عاصمة السودان وأكبر مدنه',
              en: 'Capital and largest city of Sudan',
              fr: 'Capitale et plus grande ville du Soudan'
            },
            attractions: {
              ar: ['ملتقى النيلين', 'المتحف القومي', 'جسر النيل الأزرق'],
              en: ['Blue and White Nile Confluence', 'National Museum', 'Blue Nile Bridge'],
              fr: ['Confluence des Nils', 'Musée National', 'Pont du Nil Bleu']
            },
            bestTime: { ar: 'طوال العام', en: 'Year Round', fr: 'Toute l\'Année' },
            duration: { ar: '3-4 أيام', en: '3-4 Days', fr: '3-4 Jours' }
          }
        ],
        isActive: true,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      }
    ];
  }

  // ==================== Taxi & Delivery Services ====================

  getTaxiDeliveryServices(): TaxiDeliveryService[] {
    try {
      const data = localStorage.getItem(this.TAXI_DELIVERY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading taxi/delivery services:', error);
      return [];
    }
  }

  async getTaxiDeliveryServicesAsync(): Promise<TaxiDeliveryService[]> {
    if (this.useServerStorage) {
      const serverData = await this.loadTaxiDeliveryFromServer();
      if (isNonEmptyList(serverData)) {
        try {
          localStorage.setItem(this.TAXI_DELIVERY_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync server data to localStorage:', e);
        }
        return serverData;
      }
    }
    return this.getTaxiDeliveryServices();
  }

  private async loadTaxiDeliveryFromServer(): Promise<TaxiDeliveryService[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/taxi-delivery`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<TaxiDeliveryService>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading taxi/delivery from server:', error);
    }
    return null;
  }

  saveTaxiDeliveryServices(services: TaxiDeliveryService[]): boolean {
    try {
      localStorage.setItem(this.TAXI_DELIVERY_KEY, JSON.stringify(services));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'taxiDelivery' } }));
      return true;
    } catch (error) {
      console.error('Error saving taxi/delivery services:', error);
      return false;
    }
  }

  async saveTaxiDeliveryServicesAsync(services: TaxiDeliveryService[]): Promise<boolean> {
    if (this.useServerStorage) {
      const saved = await this.saveTaxiDeliveryToServer(services);
      if (saved) {
        try {
          localStorage.setItem(this.TAXI_DELIVERY_KEY, JSON.stringify(services));
        } catch (e) {
          console.warn('Failed to sync to localStorage:', e);
        }
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'taxiDelivery' } }));
        return true;
      }
    }
    return this.saveTaxiDeliveryServices(services);
  }

  private async saveTaxiDeliveryToServer(services: TaxiDeliveryService[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/taxi-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(services)
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving taxi/delivery to server:', error);
    }
    return false;
  }

  async ensureTaxiDeliveryServicesForAllCountries(): Promise<void> {
    console.log('[DataManager] Ensuring taxi/delivery services...');
    const countries = await this.getCountriesAsync();
    const existingServices = await this.getTaxiDeliveryServicesAsync();

    console.log('[DataManager] Countries found:', countries.length);
    console.log('[DataManager] Existing services:', existingServices.length);

    const taxiImages = [
      'https://images.pexels.com/photos/724108/pexels-photo-724108.jpeg',
      'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg',
      'https://images.pexels.com/photos/842408/pexels-photo-842408.jpeg',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
      'https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg'
    ];

    const deliveryImages = [
      'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg',
      'https://images.pexels.com/photos/7233367/pexels-photo-7233367.jpeg',
      'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg',
      'https://images.pexels.com/photos/4391429/pexels-photo-4391429.jpeg',
      'https://images.pexels.com/photos/7233410/pexels-photo-7233410.jpeg'
    ];

    const newServices: TaxiDeliveryService[] = [];

    for (const country of countries) {
      // Check if country already has services
      const countryServices = existingServices.filter(s => s.countryId === country.id);
      
      if (countryServices.length === 0) {
        console.log(`[DataManager] Creating services for ${country.name.ar}...`);
        // Add 15 taxi services per country
        for (let i = 0; i < 15; i++) {
          const service: TaxiDeliveryService = {
            id: `taxi-${country.id}-${Date.now()}-${i}`,
            countryId: country.id,
            type: 'taxi',
            name: {
              ar: `خدمة تاكسي ${country.name.ar} ${i + 1}`,
              en: `${country.name.en} Taxi Service ${i + 1}`,
              fr: `Service de Taxi ${country.name.fr} ${i + 1}`
            },
            description: {
              ar: `خدمة تاكسي موثوقة وسريعة في ${country.name.ar}. نوفر سيارات حديثة ومكيفة مع سائقين محترفين.`,
              en: `Reliable and fast taxi service in ${country.name.en}. We provide modern air-conditioned cars with professional drivers.`,
              fr: `Service de taxi fiable et rapide à ${country.name.fr}. Nous fournissons des voitures modernes climatisées avec des chauffeurs professionnels.`
            },
            imageUrl: taxiImages[i % taxiImages.length],
            rating: 4.0 + Math.random() * 1.0,
            totalRides: Math.floor(Math.random() * 5000) + 1000,
            pricePerKm: 0.5 + Math.random() * 1.5,
            minimumFare: 3 + Math.random() * 5,
            phone: `+${Math.floor(Math.random() * 900000000) + 100000000}`,
            availableVehicles: ['Sedan', 'SUV', 'Van'],
            serviceHours: {
              ar: '24/7 - متاح على مدار الساعة',
              en: '24/7 - Available round the clock',
              fr: '24/7 - Disponible 24h/24'
            },
            features: {
              ar: ['سيارات حديثة ومكيفة', 'سائقون محترفون', 'أسعار منافسة', 'خدمة على مدار الساعة', 'دفع إلكتروني'],
              en: ['Modern air-conditioned cars', 'Professional drivers', 'Competitive prices', '24/7 service', 'Electronic payment'],
              fr: ['Voitures modernes climatisées', 'Chauffeurs professionnels', 'Prix compétitifs', 'Service 24/7', 'Paiement électronique']
            },
            coverage: {
              ar: `جميع مدن ${country.name.ar}`,
              en: `All cities in ${country.name.en}`,
              fr: `Toutes les villes de ${country.name.fr}`
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          newServices.push(service);
        }

        // Add 15 delivery services per country
        for (let i = 0; i < 15; i++) {
          const service: TaxiDeliveryService = {
            id: `delivery-${country.id}-${Date.now()}-${i}`,
            countryId: country.id,
            type: 'delivery',
            name: {
              ar: `خدمة ديليفري ${country.name.ar} ${i + 1}`,
              en: `${country.name.en} Delivery Service ${i + 1}`,
              fr: `Service de Livraison ${country.name.fr} ${i + 1}`
            },
            description: {
              ar: `خدمة توصيل سريعة وآمنة في ${country.name.ar}. نوصل طلباتك بسرعة وأمان إلى باب منزلك.`,
              en: `Fast and safe delivery service in ${country.name.en}. We deliver your orders quickly and safely to your doorstep.`,
              fr: `Service de livraison rapide et sûr à ${country.name.fr}. Nous livrons vos commandes rapidement et en toute sécurité à votre porte.`
            },
            imageUrl: deliveryImages[i % deliveryImages.length],
            rating: 4.0 + Math.random() * 1.0,
            totalRides: Math.floor(Math.random() * 10000) + 2000,
            pricePerKm: 0.3 + Math.random() * 1.0,
            minimumFare: 2 + Math.random() * 3,
            phone: `+${Math.floor(Math.random() * 900000000) + 100000000}`,
            availableVehicles: ['Bike', 'Car', 'Van'],
            serviceHours: {
              ar: '24/7 - متاح على مدار الساعة',
              en: '24/7 - Available round the clock',
              fr: '24/7 - Disponible 24h/24'
            },
            features: {
              ar: ['توصيل سريع', 'تتبع الطلب', 'أسعار منافسة', 'دفع عند الاستلام', 'تغليف آمن'],
              en: ['Fast delivery', 'Order tracking', 'Competitive prices', 'Cash on delivery', 'Safe packaging'],
              fr: ['Livraison rapide', 'Suivi de commande', 'Prix compétitifs', 'Paiement à la livraison', 'Emballage sécurisé']
            },
            coverage: {
              ar: `جميع مدن ${country.name.ar}`,
              en: `All cities in ${country.name.en}`,
              fr: `Toutes les villes de ${country.name.fr}`
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          newServices.push(service);
        }
      }
    }

    if (newServices.length > 0) {
      const allServices = [...existingServices, ...newServices];
      console.log(`[DataManager] Saving ${newServices.length} new services, total: ${allServices.length}`);
      await this.saveTaxiDeliveryServicesAsync(allServices);
      console.log(`تم إضافة ${newServices.length} خدمة تاكسي/ديليفري جديدة`);
    } else {
      console.log('[DataManager] All countries already have services');
    }
  }

  // ==================== Flight Tickets ====================

  private async loadFlightTicketsFromServer(): Promise<FlightTicket[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/flight-tickets`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<FlightTicket>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading flight tickets from server:', error);
    }
    return null;
  }

  private async saveFlightTicketsToServer(flightTickets: FlightTicket[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/flight-tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightTickets),
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving flight tickets to server:', error);
    }
    return false;
  }

  getFlightTickets(): FlightTicket[] {
    try {
      const data = localStorage.getItem(this.FLIGHT_TICKETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading flight tickets:', error);
      return [];
    }
  }

  async getFlightTicketsAsync(): Promise<FlightTicket[]> {
    if (this.useServerStorage) {
      const serverData = await this.loadFlightTicketsFromServer();
      if (serverData) {
        try {
          localStorage.setItem(this.FLIGHT_TICKETS_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync flight tickets to localStorage:', e);
        }
        return serverData;
      }
    }
    return this.getFlightTickets();
  }

  saveFlightTickets(flightTickets: FlightTicket[]): boolean {
    try {
      localStorage.setItem(this.FLIGHT_TICKETS_KEY, JSON.stringify(flightTickets));
      return true;
    } catch (error) {
      console.error('Error saving flight tickets:', error);
      return false;
    }
  }

  async saveFlightTicketsAsync(flightTickets: FlightTicket[]): Promise<boolean> {
    if (this.useServerStorage) {
      const ok = await this.saveFlightTicketsToServer(flightTickets);
      if (ok) return this.saveFlightTickets(flightTickets);
    }
    return this.saveFlightTickets(flightTickets);
  }

  async addFlightTicketAsync(ticket: Omit<FlightTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<FlightTicket | null> {
    const tickets = await this.getFlightTicketsAsync();
    const newTicket: FlightTicket = {
      ...ticket,
      id: `flight_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tickets.push(newTicket);
    if (await this.saveFlightTicketsAsync(tickets)) return newTicket;
    return null;
  }

  async updateFlightTicketAsync(id: string, updates: Partial<FlightTicket>): Promise<boolean> {
    const tickets = await this.getFlightTicketsAsync();
    const idx = tickets.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    tickets[idx] = { ...tickets[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.saveFlightTicketsAsync(tickets);
  }

  async deleteFlightTicketAsync(id: string): Promise<boolean> {
    const tickets = await this.getFlightTicketsAsync();
    const filtered = tickets.filter((t) => t.id !== id);
    if (filtered.length === tickets.length) return false;
    return this.saveFlightTicketsAsync(filtered);
  }

  // ==================== Travel Visas ====================

  private async loadTravelVisasFromServer(): Promise<TravelVisa[] | null> {
    try {
      const response = await fetch(`${this.API_BASE}/travel-visas`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && isNonEmptyList<TravelVisa>(result.data)) {
          return result.data;
        }
      }
    } catch (error) {
      console.error('Error loading travel visas from server:', error);
    }
    return null;
  }

  private async saveTravelVisasToServer(visas: TravelVisa[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/travel-visas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visas),
      });
      if (response.ok) {
        const result = await response.json();
        return result.success === true;
      }
    } catch (error) {
      console.error('Error saving travel visas to server:', error);
    }
    return false;
  }

  getTravelVisas(): TravelVisa[] {
    try {
      const data = localStorage.getItem(this.TRAVEL_VISAS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading travel visas:', error);
      return [];
    }
  }

  async getTravelVisasAsync(): Promise<TravelVisa[]> {
    if (this.useServerStorage) {
      const serverData = await this.loadTravelVisasFromServer();
      if (serverData) {
        try {
          localStorage.setItem(this.TRAVEL_VISAS_KEY, JSON.stringify(serverData));
        } catch (e) {
          console.warn('Failed to sync travel visas to localStorage:', e);
        }
        return serverData;
      }
    }
    return this.getTravelVisas();
  }

  saveTravelVisas(visas: TravelVisa[]): boolean {
    try {
      localStorage.setItem(this.TRAVEL_VISAS_KEY, JSON.stringify(visas));
      return true;
    } catch (error) {
      console.error('Error saving travel visas:', error);
      return false;
    }
  }

  async saveTravelVisasAsync(visas: TravelVisa[]): Promise<boolean> {
    if (this.useServerStorage) {
      const ok = await this.saveTravelVisasToServer(visas);
      if (ok) return this.saveTravelVisas(visas);
    }
    return this.saveTravelVisas(visas);
  }

  async addTravelVisaAsync(visa: Omit<TravelVisa, 'id' | 'createdAt' | 'updatedAt'>): Promise<TravelVisa | null> {
    const visas = await this.getTravelVisasAsync();
    const newVisa: TravelVisa = {
      ...visa,
      id: `visa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    visas.push(newVisa);
    if (await this.saveTravelVisasAsync(visas)) return newVisa;
    return null;
  }

  async updateTravelVisaAsync(id: string, updates: Partial<TravelVisa>): Promise<boolean> {
    const visas = await this.getTravelVisasAsync();
    const idx = visas.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    visas[idx] = { ...visas[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.saveTravelVisasAsync(visas);
  }

  async deleteTravelVisaAsync(id: string): Promise<boolean> {
    const visas = await this.getTravelVisasAsync();
    const filtered = visas.filter((v) => v.id !== id);
    if (filtered.length === visas.length) return false;
    return this.saveTravelVisasAsync(filtered);
  }

  // ======= Generators for flight tickets & visas (demo defaults) =======
  private generateFlightTicketsForCountry(country: AdminCountryData, startIndex: number, count: number): FlightTicket[] {
    const cities = country.cities || [];
    const fromCity = cities[0]?.name?.en || country.capital?.en || country.name.en;
    const toSamples = ['Dubai', 'Riyadh', 'Doha', 'Cairo', 'Istanbul', 'London', 'Paris'];
    const airlines = ['Tarhal Air', 'SkyWays', 'Global Wings', 'AirLink'];
    const tickets: FlightTicket[] = [];

    for (let i = 0; i < count; i++) {
      const to = toSamples[(startIndex + i) % toSamples.length];
      const airline = airlines[(startIndex + i) % airlines.length];
      const classType: FlightTicket['classType'] = (['economy', 'business', 'first'] as const)[(startIndex + i) % 3];
      const base = 250 + (country.totalTours || 0) * 5 + i * 20;

      tickets.push({
        id: `flight_${country.id}_${startIndex + i + 1}_${Date.now()}_${i}`,
        countryId: country.id,
        from: fromCity,
        to,
        airline,
        classType,
        price: base,
        currency: 'USD',
        refundable: i % 2 === 0,
        description: {
          ar: `رحلة جوية من ${country.name.ar} إلى ${to}`,
          en: `Flight from ${country.name.en} to ${to}`,
          fr: `Vol de ${country.name.fr} à ${to}`
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return tickets;
  }

  private generateTravelVisasForCountry(country: AdminCountryData, startIndex: number, count: number): TravelVisa[] {
    const visas: TravelVisa[] = [];
    const titles = [
      { ar: 'تأشيرة سياحية', en: 'Tourist Visa', fr: 'Visa Touristique' },
      { ar: 'تأشيرة عمل', en: 'Work Visa', fr: 'Visa de Travail' },
      { ar: 'تأشيرة متعددة', en: 'Multiple Entry Visa', fr: 'Visa à Entrées Multiples' },
    ];

    for (let i = 0; i < count; i++) {
      const title = titles[(startIndex + i) % titles.length];
      const base = 80 + i * 20;
      visas.push({
        id: `visa_${country.id}_${startIndex + i + 1}_${Date.now()}_${i}`,
        countryId: country.id,
        title: {
          ar: `${title.ar} ${country.name.ar}`,
          en: `${title.en} ${country.name.en}`,
          fr: `${title.fr} ${country.name.fr}`,
        },
        description: {
          ar: `احصل على ${title.ar} لـ ${country.name.ar} بسهولة وسرعة.`,
          en: `Get a ${title.en} for ${country.name.en} easily and quickly.`,
          fr: `Obtenez un ${title.fr} pour ${country.name.fr} facilement et rapidement.`,
        },
        price: base,
        currency: 'USD',
        processingTime: '5-10 أيام عمل',
        requiredDocs: {
          ar: ['جواز سفر ساري', 'صورتان شخصيتان', 'حجز فندقي', 'تذكرة طيران'],
          en: ['Valid passport', '2 photos', 'Hotel booking', 'Flight ticket'],
          fr: ['Passeport valide', '2 photos', 'Réservation d’hôtel', 'Billet d’avion'],
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return visas;
  }

  async ensureFlightTicketsForAllCountries(minTicketsPerCountry = 5): Promise<FlightTicket[]> {
    try {
      const countries = await this.getCountriesAsync();
      const tickets = await this.getFlightTicketsAsync();
      const allTickets = [...tickets];
      let changed = false;

      countries.forEach((country) => {
        const existing = allTickets.filter((t) => t.countryId === country.id);
        const missing = Math.max(0, minTicketsPerCountry - existing.length);
        if (missing === 0) return;
        const generated = this.generateFlightTicketsForCountry(country, existing.length, missing);
        allTickets.push(...generated);
        changed = true;
      });

      if (changed) await this.saveFlightTicketsAsync(allTickets);
      return allTickets;
    } catch (error) {
      console.error('Error ensuring flight tickets:', error);
      return this.getFlightTickets();
    }
  }

  async ensureTravelVisasForAllCountries(minVisasPerCountry = 3): Promise<TravelVisa[]> {
    try {
      const countries = await this.getCountriesAsync();
      const visas = await this.getTravelVisasAsync();
      const allVisas = [...visas];
      let changed = false;

      countries.forEach((country) => {
        const existing = allVisas.filter((v) => v.countryId === country.id);
        const missing = Math.max(0, minVisasPerCountry - existing.length);
        if (missing === 0) return;
        const generated = this.generateTravelVisasForCountry(country, existing.length, missing);
        allVisas.push(...generated);
        changed = true;
      });

      if (changed) await this.saveTravelVisasAsync(allVisas);
      return allVisas;
    } catch (error) {
      console.error('Error ensuring travel visas:', error);
      return this.getTravelVisas();
    }
  }
}

// Create singleton instance
export const dataManager = new DataManager();
export default dataManager;
