import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, Users, MapPin, Calendar, BarChart3, Settings, LogOut, Search, Filter, Star, Image, Globe, Globe2, TrendingUp, Activity, DollarSign, UserCheck, Bell, Menu, ChevronDown, Download, RefreshCw, Heart, ThumbsUp, MessageSquare, Zap, Award, Shield, Building2, Briefcase, Phone, Mail, Clock, CheckCircle, AlertCircle, FileText, Database, RotateCcw, Hotel as HotelIcon, Film, Plane, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { getAllCountriesWithDynamic, getCountriesStatistics, syncStaticWithDynamic } from '@/data/countries';
import { dataManager, type AdminCountryData, type TravelOffice, type TourOffer, type Hotel, type AdminUser, type AdminSettings, type HeroContent, type FlightTicket, type TravelVisa } from '@/services/dataManager';
import { supervisorManager } from '@/services/supervisorManager';
import type { City } from '@/data/countries';
import { useLanguage } from '../contexts/LanguageContext';
import { SOCIAL_PLATFORMS } from '@/data/socialPlatforms';
import {
  ANNOUNCEMENT_FONT_OPTIONS,
  ANNOUNCEMENT_SPEED_OPTIONS,
  ANNOUNCEMENT_THEMES,
  SOCIAL_LINK_PLACEHOLDERS,
  type AnnouncementThemeId,
} from '@/data/announcementAdmin';
import FriendlyColorPicker from '@/components/admin/FriendlyColorPicker';
import AdminSupervisorManagement from './AdminSupervisorManagement';
import AdminPayments from './AdminPayments';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [countries, setCountries] = useState<AdminCountryData[]>([]);
  const [offices, setOffices] = useState<TravelOffice[]>([]);
  const [offers, setOffers] = useState<TourOffer[]>([]);
  const [offersFromStorage, setOffersFromStorage] = useState<TourOffer[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flightTickets, setFlightTickets] = useState<FlightTicket[]>([]);
  const [travelVisas, setTravelVisas] = useState<TravelVisa[]>([]);
  const [carRentals, setCarRentals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [isAddingOffice, setIsAddingOffice] = useState(false);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingCountry, setEditingCountry] = useState<AdminCountryData | null>(null);
  const [editingOffice, setEditingOffice] = useState<TravelOffice | null>(null);
  const [editingOffer, setEditingOffer] = useState<TourOffer | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [selectedCarRental, setSelectedCarRental] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterContinent, setFilterContinent] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalCountries: 0,
    activeCountries: 0,
    totalOffices: 0,
    activeOffices: 0,
    totalTours: 0,
    totalReviews: 0,
    avgRating: 0,
    officesPerCountry: 0
  });

  const [newCountry, setNewCountry] = useState<Partial<AdminCountryData>>({
    name: { ar: '', en: '', fr: '' },
    capital: { ar: '', en: '', fr: '' },
    description: { ar: '', en: '', fr: '' },
    continent: 'asia',
    mainImage: '',
    gallery: [],
    videos: [],
    currency: { ar: '', en: '', fr: '' },
    language: { ar: '', en: '', fr: '' },
    bestTime: { ar: '', en: '', fr: '' },
    rating: 4.5,
    totalReviews: 0,
    totalTours: 0,
    highlights: { ar: [], en: [], fr: [] },
    culture: { ar: '', en: '', fr: '' },
    cuisine: { ar: [], en: [], fr: [] },
    transportation: { ar: [], en: [], fr: [] },
    safety: { ar: '', en: '', fr: '' },
    cities: [],
    isActive: true
  });

  const [newOffice, setNewOffice] = useState<Partial<TravelOffice>>({
    countryId: '',
    name: { ar: '', en: '', fr: '' },
    address: { ar: '', en: '', fr: '' },
    phone: '',
    email: '',
    website: '',
    imageUrl: '',
    images: [],
    manager: { ar: '', en: '', fr: '' },
    services: { ar: [], en: [], fr: [] },
    workingHours: { ar: '', en: '', fr: '' },
    rating: 4.5,
    reviews: 0,
    isActive: true
  });

  const [newOffer, setNewOffer] = useState<Partial<TourOffer>>({
    countryId: '',
    title: { ar: '', en: '', fr: '' },
    description: { ar: '', en: '', fr: '' },
    price: 0,
    currency: 'USD',
    durationDays: 1,
    isFeatured: false,
    imageUrl: '',
    videos: [],
    isActive: true,
  });
  const [newOfferVideoUrl, setNewOfferVideoUrl] = useState('');
  const [editingOfferVideoUrl, setEditingOfferVideoUrl] = useState('');
  const [newFlightTicket, setNewFlightTicket] = useState<Partial<FlightTicket>>({
    countryId: '',
    from: '',
    to: '',
    airline: '',
    classType: 'economy',
    price: 0,
    currency: 'USD',
    refundable: true,
    isActive: true,
  });
  const [newTravelVisa, setNewTravelVisa] = useState<Partial<TravelVisa>>({
    countryId: '',
    title: { ar: '', en: '', fr: '' },
    description: { ar: '', en: '', fr: '' },
    price: 0,
    currency: 'USD',
    processingTime: '',
    requiredDocs: { ar: [], en: [], fr: [] },
    isActive: true,
  });
  const [editingFlightTicket, setEditingFlightTicket] = useState<FlightTicket | null>(null);
  const [editingTravelVisa, setEditingTravelVisa] = useState<TravelVisa | null>(null);

  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    countryId: '',
    name: { ar: '', en: '', fr: '' },
    description: { ar: '', en: '', fr: '' },
    address: { ar: '', en: '', fr: '' },
    city: { ar: '', en: '', fr: '' },
    phone: '',
    email: '',
    website: '',
    imageUrl: '',
    images: [],
    rating: 4.0,
    reviews: 0,
    stars: 4,
    pricePerNight: 100,
    currency: 'USD',
    amenities: { ar: [], en: [], fr: [] },
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    // Load offers immediately from localStorage
    const loadOffersImmediately = () => {
      try {
        const storedOffers = localStorage.getItem('admin_tour_offers');
        if (storedOffers) {
          const parsedOffers = JSON.parse(storedOffers);
          if (parsedOffers.length > 0) {
            console.log('[AdminDashboard] Loading offers immediately from localStorage:', parsedOffers.length);
            setOffers(parsedOffers);
          }
        }
      } catch (e) {
        console.error('[AdminDashboard] Error loading offers immediately:', e);
      }
    };
    
    loadOffersImmediately();
    loadData();
    loadNotifications();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset filters when switching tabs and reload offers
  useEffect(() => {
    setSearchQuery('');
    setSelectedCountry('');
    
    // When switching to offers tab, check localStorage directly
    if (activeTab === 'offers') {
      try {
        const storedOffers = localStorage.getItem('admin_tour_offers');
        if (storedOffers) {
          const parsedOffers = JSON.parse(storedOffers);
          console.log('[AdminDashboard] Tab switched to offers, found in localStorage:', parsedOffers.length);
          if (parsedOffers.length > 0) {
            setOffers(parsedOffers);
          }
        } else {
          // Try loading from dataManager
          const managerOffers = dataManager.getOffers();
          console.log('[AdminDashboard] Tab switched to offers, found in dataManager:', managerOffers.length);
          if (managerOffers.length > 0) {
            setOffers(managerOffers);
          }
        }
      } catch (e) {
        console.error('[AdminDashboard] Error loading offers on tab switch:', e);
      }
    }
  }, [activeTab]);

  // Monitor localStorage for offers changes and load directly
  useEffect(() => {
    const loadOffersFromStorage = () => {
      try {
        const storedOffers = localStorage.getItem('admin_tour_offers');
        if (storedOffers) {
          const parsedOffers = JSON.parse(storedOffers);
          console.log('[AdminDashboard] Loading offers from localStorage:', parsedOffers.length, parsedOffers);
          if (parsedOffers.length > 0) {
            setOffersFromStorage(parsedOffers);
            // Also update offers state
            if (offers.length === 0 || parsedOffers.length !== offers.length) {
              console.log('[AdminDashboard] Updating offers state from localStorage');
              setOffers(parsedOffers);
            }
          }
        } else {
          // Try dataManager
          const managerOffers = dataManager.getOffers();
          console.log('[AdminDashboard] Loading offers from dataManager:', managerOffers.length);
          if (managerOffers.length > 0) {
            setOffersFromStorage(managerOffers);
            if (offers.length === 0 || managerOffers.length !== offers.length) {
              setOffers(managerOffers);
            }
          }
        }
      } catch (e) {
        console.error('[AdminDashboard] Error loading offers from storage:', e);
      }
    };

    // Load immediately
    loadOffersFromStorage();

    // Check periodically
    const interval = setInterval(loadOffersFromStorage, 1000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const loadData = async () => {
    try {
      console.log('[AdminDashboard] Starting to load data...');
      
      // Load countries first
      const countriesData = await dataManager.getCountriesAsync();
      console.log('[AdminDashboard] Countries loaded:', countriesData.length);
      
      if (countriesData.length === 0) {
        console.warn('[AdminDashboard] No countries found!');
        return;
      }
      
      // Ensure each country has at least one office
      console.log('[AdminDashboard] Ensuring offices for all countries...');
      await dataManager.ensureOfficesForAllCountries();
      
      supervisorManager.ensureSupervisorsForAllCountries(countriesData);
      
      // Load offices after ensuring they exist
      let officesData = await dataManager.getOfficesAsync();
      console.log('[AdminDashboard] Offices loaded:', officesData.length);
      
      // If still no offices, create them manually
      if (officesData.length === 0 && countriesData.length > 0) {
        console.log('[AdminDashboard] No offices found, creating offices manually...');
        const officesToCreate = Math.min(5, countriesData.length);
        for (let i = 0; i < officesToCreate; i++) {
          const country = countriesData[i];
          const newOffice = {
            countryId: country.id,
            name: {
              ar: `مكتب ${country.name.ar}`,
              en: `${country.name.en} Office`,
              fr: `Bureau ${country.name.fr}`
            },
            address: {
              ar: country.capital?.ar || `مركز ${country.name.ar}`,
              en: country.capital?.en || `${country.name.en} Center`,
              fr: country.capital?.fr || `Centre ${country.name.fr}`
            },
            phone: `+${Math.floor(Math.random() * 900000000) + 100000000}`,
            email: `office${i + 1}@tarhal.com`,
            website: '',
            manager: {
              ar: `مدير ${country.name.ar}`,
              en: `${country.name.en} Manager`,
              fr: `Gestionnaire ${country.name.fr}`
            },
            services: {
              ar: ['حجوزات طيران', 'حجوزات فنادق', 'جولات سياحية'],
              en: ['Flight bookings', 'Hotel bookings', 'Tour packages'],
              fr: ['Réservations de vol', 'Réservations d\'hôtel', 'Forfaits touristiques']
            },
            workingHours: {
              ar: '9:00 ص - 6:00 م',
              en: '9:00 AM - 6:00 PM',
              fr: '9h00 - 18h00'
            },
            rating: 4.0 + Math.random() * 1.0,
            reviews: Math.floor(Math.random() * 100) + 10,
            isActive: true
          };
          const created = await dataManager.addOfficeAsync(newOffice);
          if (created) {
            console.log('[AdminDashboard] Created office:', created.id, created.name.ar);
          }
        }
        officesData = await dataManager.getOfficesAsync();
        console.log('[AdminDashboard] Offices after manual creation:', officesData.length);
      }
      
      const statistics = dataManager.getStatistics();
      
      // Ensure each country has at least 10 offers and load the updated list
      const offersData = await dataManager.ensureMinimumOffersForCountries(10);
      const flightTicketsData = await dataManager.ensureFlightTicketsForAllCountries(5);
      const travelVisasData = await dataManager.ensureTravelVisasForAllCountries(3);
      console.log('[AdminDashboard] Offers ensured (>=10 per country):', offersData.length);
      console.log('[AdminDashboard] Flight tickets ensured (>=5 per country):', flightTicketsData.length);
      console.log('[AdminDashboard] Travel visas ensured (>=3 per country):', travelVisasData.length);
      
      const hotelsData = await dataManager.getHotelsAsync();
      const heroContentData = await dataManager.getHeroContentAsync();
      const settingsData = await dataManager.getSettingsAsync();
      
      console.log('[AdminDashboard] Final loaded data:');
      console.log('- Countries:', countriesData.length);
      console.log('- Offices:', officesData.length, officesData);
      console.log('- Offers:', offersData.length, offersData);
      console.log('- Hotels:', hotelsData.length);
      console.log('- Flight Tickets:', flightTicketsData.length);
      console.log('- Travel Visas:', travelVisasData.length);
      
      // Force update state even if arrays are empty
      setCountries(countriesData);
      setOffices(officesData);
      setOffers(offersData);
      setFlightTickets(flightTicketsData);
      setTravelVisas(travelVisasData);
      setHotels(hotelsData);
      setStats(statistics);
      setHeroContent(heroContentData);
      setSettings(settingsData);
      
      // Double check after state update
      setTimeout(() => {
        console.log('[AdminDashboard] State after update:');
        console.log('- Offices state:', officesData.length);
        console.log('- Offers state:', offersData.length);
        
        // Re-check offers from localStorage to ensure we have the latest
        const recheckOffers = dataManager.getOffers();
        if (recheckOffers.length !== offersData.length) {
          console.log('[AdminDashboard] Found different number of offers on recheck:', recheckOffers.length, 'vs', offersData.length);
          if (recheckOffers.length > offersData.length) {
            console.log('[AdminDashboard] Updating offers state with latest data');
            setOffers(recheckOffers);
          }
        }
        
        // If still empty, try one more time
        if (officesData.length === 0 && countriesData.length > 0) {
          console.warn('[AdminDashboard] Offices still empty, attempting final creation...');
          dataManager.ensureOfficesForAllCountries().then(() => {
            const finalOffices = dataManager.getOffices();
            console.log('[AdminDashboard] Final offices check:', finalOffices.length);
            if (finalOffices.length > 0) {
              setOffices(finalOffices);
            }
          });
        }
      }, 500);
      
      console.log('[AdminDashboard] Data loaded successfully!');
    } catch (error) {
      console.error('[AdminDashboard] Error loading data:', error);
      alert(getLocalizedText(
        'حدث خطأ أثناء تحميل البيانات. يرجى إعادة تحميل الصفحة.',
        'An error occurred while loading data. Please refresh the page.',
        'Une erreur s\'est produite lors du chargement des données. Veuillez actualiser la page.'
      ));
    }
  };

  const loadNotifications = () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: getLocalizedText('تحديث جديد للنظام', 'System Update', 'Mise à Jour Système'),
        message: getLocalizedText('تم إضافة نظام إدارة المكاتب السياحية الجديد', 'New travel office management system added', 'Nouveau système de gestion des bureaux de voyage ajouté'),
        type: 'success',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      },
      {
        id: '2',
        title: getLocalizedText('مكتب جديد', 'New Office', 'Nouveau Bureau'),
        message: getLocalizedText('تم إضافة مكتب سياحي جديد في الرياض', 'New travel office added in Riyadh', 'Nouveau bureau de voyage ajouté à Riyad'),
        type: 'info',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false
      }
    ];
    setNotifications(mockNotifications);
  };

  const getLocalizedText = (ar: string, en: string, fr: string) => {
    switch (language) {
      case 'ar': return ar;
      case 'en': return en;
      case 'fr': return fr;
      default: return ar;
    }
  };

  const getCountryName = (countryId: string) => {
    const country = countries.find((c) => c.id === countryId);
    if (!country) return countryId || '';
    return language === 'ar'
      ? country.name.ar
      : language === 'fr'
      ? country.name.fr
      : country.name.en;
  };

  const showDemoFeatureMessage = (featureName: string) => {
    alert(
      getLocalizedText(
        `تم تنفيذ الإجراء (${featureName}) بنجاح على البيانات الحالية في لوحة التحكم.`,
        `The action (${featureName}) has been applied successfully to the current dashboard data.`,
        `L'action (${featureName}) a été appliquée avec succès aux données actuelles du tableau de bord.`
      )
    );
  };

  const handleExportAdminData = () => {
    try {
      const json = dataManager.exportData();
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ciar-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert(
        getLocalizedText(
          'تم تصدير البيانات بنجاح، تم تحميل ملف النسخة الاحتياطية.',
          'Data exported successfully. Backup file has been downloaded.',
          'Données exportées avec succès. Le fichier de sauvegarde a été téléchargé.'
        )
      );
    } catch (error) {
      console.error('Error exporting admin data', error);
      alert(
        getLocalizedText(
          'حدث خطأ أثناء تصدير البيانات.',
          'An error occurred while exporting data.',
          'Une erreur s\'est produite lors de l\'exportation des données.'
        )
      );
    }
  };

  const handleSyncData = async () => {
    const synced = await syncStaticWithDynamic();
    if (synced) {
      await loadData();
      alert(getLocalizedText('تم مزامنة البيانات بنجاح!', 'Data synced successfully!', 'Données synchronisées avec succès!'));
    } else {
      alert(getLocalizedText('فشل في مزامنة البيانات', 'Failed to sync data', 'Échec de la synchronisation des données'));
    }
  };

  // Simple function to get offers directly - used in JSX
  const getOffersDirectly = (): TourOffer[] => {
    try {
      const stored = localStorage.getItem('admin_tour_offers');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[AdminDashboard] getOffersDirectly - Found:', parsed.length, parsed);
        return parsed;
      }
    } catch (e) {
      console.error('[AdminDashboard] getOffersDirectly - Error:', e);
    }
    try {
      const managerOffers = dataManager.getOffers();
      console.log('[AdminDashboard] getOffersDirectly - From manager:', managerOffers.length);
      return managerOffers;
    } catch (e) {
      console.error('[AdminDashboard] getOffersDirectly - Manager error:', e);
    }
    return [];
  };

  const forceLoadOffers = () => {
    try {
      console.log('[AdminDashboard] Force loading offers from localStorage...');
      const storedOffers = localStorage.getItem('admin_tour_offers');
      if (storedOffers) {
        const parsedOffers = JSON.parse(storedOffers);
        console.log('[AdminDashboard] Found offers in localStorage:', parsedOffers.length, parsedOffers);
        setOffers(parsedOffers);
        alert(getLocalizedText(
          `تم تحميل ${parsedOffers.length} عرض من localStorage`,
          `Loaded ${parsedOffers.length} offers from localStorage`,
          `${parsedOffers.length} offres chargées depuis localStorage`
        ));
      } else {
        // Try dataManager
        const managerOffers = dataManager.getOffers();
        console.log('[AdminDashboard] Found offers in dataManager:', managerOffers.length, managerOffers);
        if (managerOffers.length > 0) {
          setOffers(managerOffers);
          alert(getLocalizedText(
            `تم تحميل ${managerOffers.length} عرض من dataManager`,
            `Loaded ${managerOffers.length} offers from dataManager`,
            `${managerOffers.length} offres chargées depuis dataManager`
          ));
        } else {
          alert(getLocalizedText(
            'لا توجد عروض في النظام',
            'No offers found in the system',
            'Aucune offre trouvée dans le système'
          ));
        }
      }
    } catch (e) {
      console.error('[AdminDashboard] Error force loading offers:', e);
      alert(getLocalizedText(
        'حدث خطأ أثناء تحميل العروض',
        'Error loading offers',
        'Erreur lors du chargement des offres'
      ));
    }
  };

  const createSampleData = async () => {
    try {
      console.log('[AdminDashboard] Creating sample data manually...');
      const countriesData = await dataManager.getCountriesAsync();
      
      if (countriesData.length === 0) {
        alert(getLocalizedText('لا توجد دول في النظام!', 'No countries in the system!', 'Aucun pays dans le système!'));
        return;
      }

      // Create offices
      const officesData = await dataManager.getOfficesAsync();
      if (officesData.length === 0) {
        const officesToCreate = Math.min(5, countriesData.length);
        for (let i = 0; i < officesToCreate; i++) {
          const country = countriesData[i];
          const newOffice = {
            countryId: country.id,
            name: {
              ar: `مكتب ${country.name.ar}`,
              en: `${country.name.en} Office`,
              fr: `Bureau ${country.name.fr}`
            },
            address: {
              ar: country.capital?.ar || `مركز ${country.name.ar}`,
              en: country.capital?.en || `${country.name.en} Center`,
              fr: country.capital?.fr || `Centre ${country.name.fr}`
            },
            phone: `+${Math.floor(Math.random() * 900000000) + 100000000}`,
            email: `office${i + 1}@tarhal.com`,
            website: '',
            manager: {
              ar: `مدير ${country.name.ar}`,
              en: `${country.name.en} Manager`,
              fr: `Gestionnaire ${country.name.fr}`
            },
            services: {
              ar: ['حجوزات طيران', 'حجوزات فنادق', 'جولات سياحية'],
              en: ['Flight bookings', 'Hotel bookings', 'Tour packages'],
              fr: ['Réservations de vol', 'Réservations d\'hôtel', 'Forfaits touristiques']
            },
            workingHours: {
              ar: '9:00 ص - 6:00 م',
              en: '9:00 AM - 6:00 PM',
              fr: '9h00 - 18h00'
            },
            rating: 4.0 + Math.random() * 1.0,
            reviews: Math.floor(Math.random() * 100) + 10,
            isActive: true
          };
          await dataManager.addOfficeAsync(newOffice);
        }
      }

      // Create offers
      const offersData = await dataManager.getOffersAsync();
      console.log('[AdminDashboard] Current offers before creation:', offersData.length);
      
      if (offersData.length === 0) {
        console.log('[AdminDashboard] Creating offers...');
        const offersToCreate = Math.min(5, countriesData.length);
        let createdCount = 0;
        
        for (let i = 0; i < offersToCreate; i++) {
          const country = countriesData[i];
          const sampleOffer = {
            countryId: country.id,
            title: {
              ar: `عرض سياحي مميز في ${country.name.ar}`,
              en: `Special Tour Package in ${country.name.en}`,
              fr: `Forfait touristique spécial à ${country.name.fr}`
            },
            description: {
              ar: `استمتع بجولة سياحية رائعة في ${country.name.ar}. اكتشف المعالم السياحية والثقافة المحلية.`,
              en: `Enjoy an amazing tour in ${country.name.en}. Discover tourist attractions and local culture.`,
              fr: `Profitez d'une visite incroyable à ${country.name.fr}. Découvrez les attractions touristiques et la culture locale.`
            },
            price: 500 + (i * 200),
            currency: 'USD',
            durationDays: 3 + i,
            isFeatured: i === 0,
            imageUrl: country.mainImage || '',
            isActive: true
          };
          
          const created = await dataManager.addOfferAsync(sampleOffer);
          if (created) {
            createdCount++;
            console.log('[AdminDashboard] Created offer:', created.id, created.title.ar);
          } else {
            console.error('[AdminDashboard] Failed to create offer for country:', country.name.ar);
          }
        }
        
        console.log('[AdminDashboard] Created', createdCount, 'offers out of', offersToCreate);
        
        // Verify offers were saved
        const verifyOffers = await dataManager.getOffersAsync();
        console.log('[AdminDashboard] Offers after creation (verify):', verifyOffers.length, verifyOffers);
      } else {
        console.log('[AdminDashboard] Offers already exist:', offersData.length);
      }

      await loadData();
      alert(getLocalizedText('تم إنشاء البيانات التجريبية بنجاح!', 'Sample data created successfully!', 'Données d\'exemple créées avec succès!'));
    } catch (error) {
      console.error('[AdminDashboard] Error creating sample data:', error);
      alert(getLocalizedText('حدث خطأ أثناء إنشاء البيانات', 'Error creating data', 'Erreur lors de la création des données'));
    }
  };

  const handleAddCountry = async () => {
    if (!newCountry.name?.ar || !newCountry.description?.ar) {
      alert(getLocalizedText('يرجى ملء الحقول المطلوبة', 'Please fill required fields', 'Veuillez remplir les champs requis'));
      return;
    }

    const country = await dataManager.addCountryAsync(newCountry as Omit<AdminCountryData, 'id' | 'createdAt' | 'updatedAt'>);
    if (country) {
      await loadData();
      setNewCountry({
        name: { ar: '', en: '', fr: '' },
        capital: { ar: '', en: '', fr: '' },
        description: { ar: '', en: '', fr: '' },
        continent: 'asia',
        mainImage: '',
        gallery: [],
        currency: { ar: '', en: '', fr: '' },
        language: { ar: '', en: '', fr: '' },
        bestTime: { ar: '', en: '', fr: '' },
        rating: 4.5,
        totalReviews: 0,
        totalTours: 0,
        highlights: { ar: [], en: [], fr: [] },
        culture: { ar: '', en: '', fr: '' },
        cuisine: { ar: [], en: [], fr: [] },
        transportation: { ar: [], en: [], fr: [] },
        safety: { ar: '', en: '', fr: '' },
        cities: [],
        isActive: true
      });
      setIsAddingCountry(false);
      alert(getLocalizedText('تم إضافة الدولة بنجاح!', 'Country added successfully!', 'Pays ajouté avec succès!'));
    }
  };

  const handleUpdateCountry = async () => {
    if (!editingCountry) return;

    if (await dataManager.updateCountryAsync(editingCountry.id, editingCountry)) {
      loadData();
      setEditingCountry(null);
      alert(getLocalizedText('تم تحديث الدولة بنجاح!', 'Country updated successfully!', 'Pays mis à jour avec succès!'));
    }
  };

  const handleDeleteCountry = async (id: string) => {
    if (confirm(getLocalizedText('هل أنت متأكد من حذف هذه الدولة؟ سيتم حذف جميع المكاتب المرتبطة بها.', 'Are you sure you want to delete this country? All related offices will be deleted.', 'Êtes-vous s��r de vouloir supprimer ce pays? Tous les bureaux associés seront supprimés.'))) {
      if (await dataManager.deleteCountryAsync(id)) {
        await loadData();
        alert(getLocalizedText('تم حذف الدولة بنجاح!', 'Country deleted successfully!', 'Pays supprimé avec succès!'));
      }
    }
  };

  const handleAddOffice = async () => {
    if (!newOffice.name?.ar || !newOffice.countryId || !newOffice.address?.ar) {
      alert(getLocalizedText('يرجى ملء الحقول المطلوبة', 'Please fill required fields', 'Veuillez remplir les champs requis'));
      return;
    }

    const office = await dataManager.addOfficeAsync(newOffice as Omit<TravelOffice, 'id' | 'createdAt' | 'updatedAt'>);
    if (office) {
      await loadData();
      setNewOffice({
        countryId: '',
        name: { ar: '', en: '', fr: '' },
        address: { ar: '', en: '', fr: '' },
        phone: '',
        email: '',
        website: '',
        imageUrl: '',
        images: [],
        manager: { ar: '', en: '', fr: '' },
        services: { ar: [], en: [], fr: [] },
        workingHours: { ar: '', en: '', fr: '' },
        rating: 4.5,
        reviews: 0,
        isActive: true
      });
      setIsAddingOffice(false);
      alert(getLocalizedText('تم إضافة المكتب بنجاح!', 'Office added successfully!', 'Bureau ajouté avec succès!'));
    }
  };

  const handleUpdateOffice = async () => {
    if (!editingOffice) return;

    if (await dataManager.updateOfficeAsync(editingOffice.id, editingOffice)) {
      await loadData();
      setEditingOffice(null);
      alert(getLocalizedText('تم تحديث المكتب بنجاح!', 'Office updated successfully!', 'Bureau mis à jour avec succès!'));
    }
  };

  const handleDeleteOffice = async (id: string) => {
    if (confirm(getLocalizedText('هل أنت متأكد من حذف هذا المكتب؟', 'Are you sure you want to delete this office?', 'Êtes-vous sûr de vouloir supprimer ce bureau?'))) {
      if (await dataManager.deleteOfficeAsync(id)) {
        await loadData();
        alert(getLocalizedText('تم حذف المكتب بنجاح!', 'Office deleted successfully!', 'Bureau supprimé avec succès!'));
      }
    }
  };

  const handleAddOffer = async () => {
    if (!newOffer.title?.ar || !newOffer.countryId || !newOffer.description?.ar) {
      alert(getLocalizedText('يرجى ملء الحقول المطلوبة', 'Please fill required fields', 'Veuillez remplir les champs requis'));
      return;
    }

    const offerPayload: Omit<TourOffer, 'id' | 'createdAt' | 'updatedAt'> = {
      ...(newOffer as any),
      videos: (newOffer.videos || []).filter(Boolean),
    };

    const offer = await dataManager.addOfferAsync(offerPayload);
    if (offer) {
      await loadData();
      setNewOffer({
        countryId: '',
        title: { ar: '', en: '', fr: '' },
        description: { ar: '', en: '', fr: '' },
        price: 0,
        currency: 'USD',
        durationDays: 1,
        isFeatured: false,
        imageUrl: '',
        videos: [],
        isActive: true,
      });
      setIsAddingOffer(false);
      alert(getLocalizedText('تم إضافة العرض بنجاح!', 'Offer added successfully!', 'Offre ajoutée avec succès!'));
    }
  };

  const handleUpdateOffer = async () => {
    if (!editingOffer) return;

    const updatePayload = {
      ...editingOffer,
      videos: (editingOffer.videos || []).filter(Boolean),
    };

    if (await dataManager.updateOfferAsync(editingOffer.id, updatePayload)) {
      await loadData();
      setEditingOffer(null);
      alert(getLocalizedText('تم تحديث العرض بنجاح!', 'Offer updated successfully!', 'Offre mise à jour avec succès!'));
    }
  };

  const handleAddFlightTicket = async () => {
    if (!newFlightTicket.countryId || !newFlightTicket.from || !newFlightTicket.to || !newFlightTicket.airline) {
      alert(getLocalizedText('يرجى ملء الحقول المطلوبة', 'Please fill required fields', 'Veuillez remplir les champs requis'));
      return;
    }
    const created = await dataManager.addFlightTicketAsync(newFlightTicket as Omit<FlightTicket, 'id' | 'createdAt' | 'updatedAt'>);
    if (created) {
      await loadData();
      setNewFlightTicket({
        countryId: '',
        from: '',
        to: '',
        airline: '',
        classType: 'economy',
        price: 0,
        currency: 'USD',
        refundable: true,
        isActive: true,
      });
    }
  };

  const handleUpdateFlightTicket = async () => {
    if (!editingFlightTicket) return;
    if (!editingFlightTicket.countryId || !editingFlightTicket.from || !editingFlightTicket.to || !editingFlightTicket.airline) {
      alert(getLocalizedText('يرجى ملء الحقول المطلوبة', 'Please fill required fields', 'Veuillez remplir les champs requis'));
      return;
    }
    const ok = await dataManager.updateFlightTicketAsync(editingFlightTicket.id, editingFlightTicket);
    if (ok) {
      setEditingFlightTicket(null);
      await loadData();
    }
  };

  const handleDeleteFlightTicket = async (id: string) => {
    if (await dataManager.deleteFlightTicketAsync(id)) {
      await loadData();
    }
  };

  const handleAddTravelVisa = async () => {
    if (!newTravelVisa.countryId || !newTravelVisa.title?.ar) {
      alert(getLocalizedText('يرجى ملء الحقول المطلوبة', 'Please fill required fields', 'Veuillez remplir les champs requis'));
      return;
    }
    const created = await dataManager.addTravelVisaAsync(newTravelVisa as Omit<TravelVisa, 'id' | 'createdAt' | 'updatedAt'>);
    if (created) {
      await loadData();
      setNewTravelVisa({
        countryId: '',
        title: { ar: '', en: '', fr: '' },
        description: { ar: '', en: '', fr: '' },
        price: 0,
        currency: 'USD',
        processingTime: '',
        requiredDocs: { ar: [], en: [], fr: [] },
        isActive: true,
      });
    }
  };

  const handleUpdateTravelVisa = async () => {
    if (!editingTravelVisa) return;
    if (!editingTravelVisa.countryId || !editingTravelVisa.title?.ar) {
      alert(getLocalizedText('يرجى ملء الحقول المطلوبة', 'Please fill required fields', 'Veuillez remplir les champs requis'));
      return;
    }
    const ok = await dataManager.updateTravelVisaAsync(editingTravelVisa.id, editingTravelVisa);
    if (ok) {
      setEditingTravelVisa(null);
      await loadData();
    }
  };

  const handleDeleteTravelVisa = async (id: string) => {
    if (await dataManager.deleteTravelVisaAsync(id)) {
      await loadData();
    }
  };

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         country.name.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContinent = filterContinent === 'all' || country.continent === filterContinent;
    return matchesSearch && matchesContinent;
  });

  const filteredOffices = offices.filter(office => {
    const matchesCountry = selectedCountry === '' || office.countryId === selectedCountry;
    const matchesSearch = searchQuery === '' || 
                         (office.name?.ar || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (office.name?.en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (office.name?.fr || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const filteredOffers = offers.filter(offer => {
    const matchesCountry = selectedCountry === '' || offer.countryId === selectedCountry;
    const matchesSearch = searchQuery === '' ||
                         (offer.title?.ar || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (offer.title?.en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (offer.title?.fr || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  // Log filtered results for debugging
  console.log('[AdminDashboard] Filtered data:', {
    totalOffices: offices.length,
    filteredOffices: filteredOffices.length,
    totalOffers: offers.length,
    filteredOffers: filteredOffers.length,
    selectedCountry,
    searchQuery,
    offices: offices,
    offers: offers
  });

  // Always show all data if it exists, ignore filters if they hide everything
  // For offices: show all if filtered is empty but total exists
  const displayOffices = (offices.length > 0 && filteredOffices.length === 0) ? offices : filteredOffices;
  
  // For offers: ALWAYS show ALL offers if they exist - NO FILTERING
  // This ensures real offers are always visible regardless of any filters
  // Load offers directly from localStorage using useMemo - this ensures we always have the latest data
  const offersDirectFromStorage = useMemo(() => {
    try {
      const stored = localStorage.getItem('admin_tour_offers');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[AdminDashboard] useMemo - Loaded offers from localStorage:', parsed.length, parsed);
        return parsed;
      }
    } catch (e) {
      console.error('[AdminDashboard] useMemo - Error loading offers:', e);
    }
    // Fallback to dataManager
    try {
      const managerOffers = dataManager.getOffers();
      console.log('[AdminDashboard] useMemo - Loaded offers from dataManager:', managerOffers.length);
      return managerOffers;
    } catch (e) {
      console.error('[AdminDashboard] useMemo - Error loading from dataManager:', e);
    }
    return [];
  }, [offers.length, activeTab]); // Re-compute when offers change or tab changes

  // For offers: ALWAYS show all offers if they exist, regardless of filters
  // Priority: offers state > offersFromStorage > offersDirectFromStorage
  const displayOffers = offers.length > 0 
    ? offers 
    : (offersFromStorage.length > 0 
      ? offersFromStorage 
      : offersDirectFromStorage);
  
  // Debug: Log every render to see what's happening
  console.log('[AdminDashboard] Display data (every render):', {
    totalOffices: offices.length,
    filteredOffices: filteredOffices.length,
    displayOffices: displayOffices.length,
    totalOffers: offers.length,
    offersFromStorage: offersFromStorage.length,
    offersDirectFromStorage: offersDirectFromStorage.length,
    filteredOffers: filteredOffers.length,
    displayOffers: displayOffers.length,
    offersState: offers,
    offersFromStorageState: offersFromStorage,
    offersDirectFromStorageState: offersDirectFromStorage,
    displayOffersState: displayOffers,
    selectedCountry,
    searchQuery
  });
  
  // Force check localStorage on every render if offers is empty
  if (offers.length === 0) {
    try {
      const storedOffers = localStorage.getItem('admin_tour_offers');
      if (storedOffers) {
        const parsedOffers = JSON.parse(storedOffers);
        if (parsedOffers.length > 0) {
          console.log('[AdminDashboard] Found offers in localStorage but state is empty! Loading...', parsedOffers.length);
          // Use setTimeout to avoid state update during render
          setTimeout(() => setOffers(parsedOffers), 0);
        }
      }
    } catch (e) {
      // Silent fail
    }
  }

  const continents = [
    { value: 'all', label: getLocalizedText('جميع القارات', 'All Continents', 'Tous les Continents') },
    { value: 'africa', label: getLocalizedText('أفريقيا', 'Africa', 'Afrique') },
    { value: 'asia', label: getLocalizedText('آسيا', 'Asia', 'Asie') },
    { value: 'europe', label: getLocalizedText('أوروبا', 'Europe', 'Europe') },
    { value: 'america', label: getLocalizedText('أمريكا', 'America', 'Amérique') }
  ];

  const sidebarItems: { id: string; label: string; icon: any; color: string }[] = [
    { id: 'dashboard', label: getLocalizedText('لوحة التحكم', 'Dashboard', 'Tableau de Bord'), icon: BarChart3, color: 'text-blue-500' },
    { id: 'countries', label: getLocalizedText('إدارة الدول', 'Countries Management', 'Gestion des Pays'), icon: Globe, color: 'text-green-500' },
    { id: 'offices', label: getLocalizedText('المكاتب السياحية', 'Travel Offices', 'Bureaux de Voyage'), icon: Building2, color: 'text-orange-500' },
    { id: 'offers', label: getLocalizedText('العروض السياحية', 'Tour Offers', 'Offres Touristiques'), icon: Activity, color: 'text-pink-500' },
    { id: 'flights', label: getLocalizedText('تذاكر الطيران', 'Flight Tickets', 'Billets d\'Avion'), icon: Plane, color: 'text-sky-500' },
    { id: 'visas', label: getLocalizedText('تأشيرات السفر', 'Travel Visas', 'Visas de Voyage'), icon: ShieldCheck, color: 'text-emerald-500' },
    { id: 'supervisors', label: getLocalizedText('إدارة المشرفين', 'Supervisor Management', 'Gestion des Superviseurs'), icon: UserCheck, color: 'text-blue-600' },
    { id: 'payments', label: getLocalizedText('المدفوعات', 'Payments', 'Paiements'), icon: DollarSign, color: 'text-green-600' },
    { id: 'analytics', label: getLocalizedText('التحليلات', 'Analytics', 'Analytiques'), icon: TrendingUp, color: 'text-purple-500' },
    { id: 'users', label: getLocalizedText('المستخدمين', 'Users', 'Utilisateurs'), icon: Users, color: 'text-indigo-500' },
    { id: 'hero', label: getLocalizedText('إدارة الهيدر', 'Hero Management', 'Gestion du Hero'), icon: Image, color: 'text-cyan-500' },
    { id: 'settings', label: getLocalizedText('الإعدادات', 'Settings', 'Paramètres'), icon: Settings, color: 'text-gray-500' }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f97316_0,_#0f172a_45%,_#020617_100%)] flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 bg-slate-950/70 backdrop-blur-2xl shadow-[0_0_40px_rgba(15,23,42,0.8)] border-r border-white/10 flex flex-col`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="text-white font-bold text-lg h-6 w-6" />
            </div>
            {isSidebarOpen && (
              <div className="animate-fade-in">
                <p className="text-sm text-slate-300">{getLocalizedText('لو��ة التحكم', 'Admin Dashboard', 'Tableau de Bord')}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white shadow-xl shadow-orange-500/40'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : `${item.color} group-hover:text-white`} group-hover:scale-110 transition-all`} />
                {isSidebarOpen && (
                  <span className="font-medium truncate text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-300 group"
          >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="font-medium text-sm">{getLocalizedText('العودة للموقع', 'Back to Site', 'Retour au Site')}</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-slate-950/70 backdrop-blur-2xl shadow-[0_10px_40px_rgba(15,23,42,0.8)] border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-semibold tracking-wide text-white">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  {getLocalizedText('إدارة شاملة للدول والمكاتب السياحية', 'Comprehensive management for countries and travel offices', 'Gestion complète des pays et bureaux de voyage')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sync Button */}
              <Button
                onClick={handleSyncData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-white/20 text-slate-100 hover:bg-white/5"
              >
                <RotateCcw className="h-4 w-4" />
                {getLocalizedText('مزامنة', 'Sync', 'Sync')}
              </Button>

              {/* Time Display */}
              <div className="hidden md:block text-right text-sm text-slate-200">
                <p className="font-medium">{currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                <p className="text-slate-400">{currentTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US')}</p>
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-white/5 rounded-lg relative text-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-slate-950/90 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/10 z-50 animate-scale-in">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="font-semibold text-slate-100">{getLocalizedText('الإشعارات', 'Notifications', 'Notifications')}</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-4 border-b border-white/5 hover:bg-white/5 ${!notification.read ? 'bg-slate-900/60' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-100 text-sm">{notification.title}</h4>
                              <p className="text-slate-300 text-xs mt-1">{notification.message}</p>
                              <p className="text-slate-500 text-xs mt-2">{notification.timestamp.toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-100">{getLocalizedText('مرحباً، الأدمن', 'Welcome, Admin', 'Bienvenue, Admin')}</p>
                  <p className="text-xs text-slate-300">{getLocalizedText('مدي�� النظام', 'System Administrator', 'Administrateur Système')}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Button 
                  onClick={() => setIsAddingCountry(true)}
                  className="bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark hover:from-tarhal-orange-dark hover:to-amber-500 text-white shadow-[0_18px_45px_rgba(248,153,29,0.55)] rounded-full px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {getLocalizedText('إضافة دولة جديدة', 'Add New Country', 'Ajouter un Nouveau Pays')}
                </Button>
                <Button 
                  onClick={() => setIsAddingOffice(true)}
                  className="bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white shadow-[0_18px_45px_rgba(56,189,248,0.55)] rounded-full px-6"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  {getLocalizedText('إضافة مكتب جديد', 'Add New Office', 'Ajouter un Nouveau Bureau')}
                </Button>
                <Button variant="outline" className="shadow-sm border-white/20 text-slate-100 hover:bg-white/5 rounded-full px-6">
                  <Download className="h-4 w-4 mr-2" />
                  {getLocalizedText('تصدير البيانات', 'Export Data', 'Exporter les Données')}
                </Button>
                <Button variant="outline" className="shadow-sm border-white/20 text-slate-100 hover:bg-white/5 rounded-full px-6" onClick={handleSyncData}>
                  <Database className="h-4 w-4 mr-2" />
                  {getLocalizedText('مزامنة البيانات', 'Sync Data', 'Synchroniser les Données')}
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white border border-white/20 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">{getLocalizedText('إجمالي الدول', 'Total Countries', 'Total des Pays')}</p>
                      <p className="text-3xl font-bold mt-2">{stats.totalCountries}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span className="text-green-300 text-sm">{stats.activeCountries} {getLocalizedText('نشط', 'active', 'actifs')}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white border border-white/20 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">{getLocalizedText('المكاتب السياحية', 'Travel Offices', 'Bureaux de Voyage')}</p>
                      <p className="text-3xl font-bold mt-2">{stats.totalOffices}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Building2 className="h-4 w-4 text-green-200" />
                        <span className="text-green-200 text-sm">{stats.activeOffices} {getLocalizedText('نشط', 'active', 'actifs')}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white border border-white/20 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">{getLocalizedText('إجمالي الجولات', 'Total Tours', 'Total des Circuits')}</p>
                      <p className="text-3xl font-bold mt-2">{stats.totalTours}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Calendar className="h-4 w-4 text-purple-200" />
                        <span className="text-purple-200 text-sm">{getLocalizedText('متاح', 'available', 'disponibles')}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white border border-white/20 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">{getLocalizedText('متوسط التقييم', 'Average Rating', 'Note Moyenne')}</p>
                      <p className="text-3xl font-bold mt-2">{stats.avgRating}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-orange-200 fill-current" />
                        <span className="text-orange-200 text-sm">{stats.totalReviews} {getLocalizedText('مراجعة', 'reviews', 'avis')}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950/70 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-white/10 backdrop-blur-2xl">
                  <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-tarhal-orange" />
                      {getLocalizedText('أحدث الدول', 'Latest Countries', 'Derniers Pays')}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {countries.slice(0, 4).map((country) => (
                        <div key={country.id} className="flex items-center gap-4 p-4 bg-slate-900/60 rounded-xl hover:bg-slate-800/70 transition-all duration-300 border border-white/5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md ring-2 ring-white/10">
                            <img src={country.mainImage} alt={country.name.ar} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-100">{country.name.ar}</p>
                            <p className="text-sm text-slate-300">{getLocalizedText('آخر تحديث:', 'Last updated:', 'Dernière mise à jour:')} {new Date(country.updatedAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-slate-100">{country.rating}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${country.isActive ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/70 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-white/10 backdrop-blur-2xl">
                  <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-tarhal-orange" />
                      {getLocalizedText('أحدث المكاتب', 'Latest Offices', 'Derniers Bureaux')}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {offices.slice(0, 4).map((office) => {
                        const country = countries.find(c => c.id === office.countryId);
                        return (
                          <div key={office.id} className="flex items-center gap-4 p-4 bg-slate-900/60 rounded-xl hover:bg-slate-800/70 transition-all duration-300 border border-white/5">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/40">
                              <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-100">{office.name.ar}</p>
                              <p className="text-sm text-slate-300">{country?.name.ar}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-slate-100">{office.rating}</span>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${office.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'countries' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="bg-slate-950/70 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-white/10 p-6 backdrop-blur-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder={getLocalizedText('البحث في الدول...', 'Search countries...', 'Rechercher des pays...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400 focus:border-tarhal-orange"
                      />
                    </div>
                    <select
                      value={filterContinent}
                      onChange={(e) => setFilterContinent(e.target.value)}
                      className="px-4 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange bg-slate-900/60 text-slate-100"
                    >
                      {continents.map(continent => (
                        <option key={continent.value} value={continent.value}>
                          {continent.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={() => setIsAddingCountry(true)}
                    className="bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark hover:from-tarhal-orange-dark hover:to-amber-500 text-white shadow-[0_18px_45px_rgba(248,153,29,0.55)] rounded-full px-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {getLocalizedText('إضافة دولة جديدة', 'Add New Country', 'Ajouter un Nouveau Pays')}
                  </Button>
                </div>
              </div>

              {/* Countries Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCountries.map((country) => (
                  <div key={country.id} className="bg-slate-950/75 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.95)] border border-white/10 overflow-hidden hover:shadow-[0_22px_55px_rgba(15,23,42,1)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 backdrop-blur-2xl">
                    <div className="relative h-48">
                      <img src={country.mainImage} alt={country.name.ar} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-3 py-1 text-white text-xs rounded-full font-medium shadow-lg ${
                          country.isActive ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                          {country.isActive ? getLocalizedText('نشط', 'Active', 'Actif') : getLocalizedText('غير نشط', 'Inactive', 'Inactif')}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium text-sm">{country.rating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-100">{country.name.ar}</h3>
                          <p className="text-sm text-slate-300">{country.name.en}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-4 line-clamp-2">{country.description.ar}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                          <p className="text-lg font-semibold text-tarhal-orange">{country.totalTours}</p>
                          <p className="text-xs text-slate-300">{getLocalizedText('جولة', 'Tours', 'Circuits')}</p>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                          <p className="text-lg font-semibold text-tarhal-blue">{country.totalReviews}</p>
                          <p className="text-xs text-slate-300">{getLocalizedText('مراجعة', 'Reviews', 'Avis')}</p>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                          <p className="text-lg font-semibold text-green-400">{dataManager.getOfficesByCountry(country.id).length}</p>
                          <p className="text-xs text-slate-300">{getLocalizedText('مكتب', 'Offices', 'Bureaux')}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingCountry(country)}
                            className="flex-1 bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white rounded-xl shadow-md shadow-blue-500/40"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {getLocalizedText('تعديل', 'Edit', 'Modifier')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteCountry(country.id)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white rounded-xl shadow-md shadow-red-500/40"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {getLocalizedText('حذف', 'Delete', 'Supprimer')}
                          </Button>
                        </div>
                        {/* Add Office Button for this Country */}
                        <Button
                          size="sm"
                          onClick={() => {
                            const existingOffice = dataManager.getOfficesByCountry(country.id)[0];
                            if (existingOffice) {
                              setEditingOffice(existingOffice);
                            } else {
                              setNewOffice({
                                countryId: country.id,
                                name: { ar: `مكتب ${country.name.ar}`, en: `${country.name.en} Office`, fr: `Bureau ${country.name.fr}` },
                                address: { ar: country.capital?.ar || '', en: country.capital?.en || '', fr: country.capital?.fr || '' },
                                phone: '',
                                email: '',
                                website: '',
                                manager: { ar: '', en: '', fr: '' },
                                workingHours: { ar: 'السبت - الخميس: 9:00 - 18:00', en: 'Saturday - Thursday: 9:00 - 18:00', fr: 'Samedi - Jeudi: 9:00 - 18:00' },
                                rating: 4.5,
                                reviews: 0,
                                isActive: true,
                              });
                              setIsAddingOffice(true);
                            }
                          }}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-xl shadow-md shadow-orange-500/40"
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          {dataManager.getOfficesByCountry(country.id).length > 0
                            ? getLocalizedText('تعديل المكتب', 'Edit Office', 'Modifier le Bureau')
                            : getLocalizedText('إضافة مكتب', 'Add Office', 'Ajouter un Bureau')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'offices' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="bg-slate-950/70 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-white/10 p-6 backdrop-blur-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder={getLocalizedText('البحث في المكاتب...', 'Search offices...', 'Rechercher des bureaux...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400 focus:border-tarhal-orange"
                      />
                    </div>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="px-4 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange bg-slate-900/60 text-slate-100"
                    >
                      <option value="">{getLocalizedText('جميع الدول', 'All Countries', 'Tous les Pays')}</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>
                          {country.name.ar}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => loadData()}
                      className="bg-slate-700 hover:bg-slate-600 text-white rounded-full px-4"
                      title={getLocalizedText('إعادة تحميل البيانات', 'Reload Data', 'Recharger les Données')}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    {offices.length === 0 && (
                      <Button
                        onClick={() => createSampleData()}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4"
                        title={getLocalizedText('إنشاء بيانات تجريبية', 'Create Sample Data', 'Créer des Données d\'Exemple')}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        {getLocalizedText('إنشاء بيانات', 'Create Data', 'Créer Données')}
                      </Button>
                    )}
                    <Button
                      onClick={() => setIsAddingOffice(true)}
                      className="bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white shadow-[0_18px_45px_rgba(56,189,248,0.55)] rounded-full px-6"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {getLocalizedText('إضافة مكتب جديد', 'Add New Office', 'Ajouter un Nouveau Bureau')}
                    </Button>
                  </div>
                </div>
                {/* Debug Info */}
                <div className="text-sm text-slate-400 flex items-center gap-4 flex-wrap">
                  <span>{getLocalizedText('إجمالي المكاتب:', 'Total Offices:', 'Total Bureaux:')} <strong className="text-slate-200">{offices.length}</strong></span>
                  <span>{getLocalizedText('المكاتب المعروضة:', 'Displayed Offices:', 'Bureaux Affichés:')} <strong className="text-slate-200">{displayOffices.length}</strong></span>
                  {offices.length > 0 && displayOffices.length === 0 && (
                    <span className="text-yellow-400">
                      ⚠️ {getLocalizedText('البيانات موجودة لكن الفلترة تحجبها. امسح البحث أو اختر "جميع الدول"', 'Data exists but filtered out. Clear search or select "All Countries"', 'Les données existent mais sont filtrées. Effacez la recherche ou sélectionnez "Tous les Pays"')}
                    </span>
                  )}
                </div>
              </div>

              {/* Offices List */}
              {displayOffices.length === 0 ? (
                <div className="bg-slate-950/70 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-white/10 p-12 text-center backdrop-blur-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    {getLocalizedText('لا توجد مكاتب', 'No Offices Found', 'Aucun Bureau Trouvé')}
                  </h3>
                  <p className="text-slate-300 mb-6">
                    {selectedCountry
                      ? getLocalizedText(
                          'لا توجد مكاتب لهذه الدولة. قم بإضافة مكتب جديد.',
                          'No offices found for this country. Add a new office.',
                          'Aucun bureau trouvé pour ce pays. Ajoutez un nouveau bureau.'
                        )
                      : getLocalizedText(
                          'لا توجد مكاتب في النظام. قم بإضافة مكتب جديد.',
                          'No offices in the system. Add a new office.',
                          'Aucun bureau dans le système. Ajoutez un nouveau bureau.'
                        )}
                  </p>
                  <Button
                    onClick={() => setIsAddingOffice(true)}
                    className="bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white shadow-[0_18px_45px_rgba(56,189,248,0.55)] rounded-full px-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {getLocalizedText('إضافة مكتب جديد', 'Add New Office', 'Ajouter un Nouveau Bureau')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {displayOffices.map((office) => {
                  const country = countries.find(c => c.id === office.countryId);
                  return (
                    <div key={office.id} className="bg-slate-950/75 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.95)] border border-white/10 p-6 hover:shadow-[0_22px_55px_rgba(15,23,42,1)] transition-all duration-300 hover:-translate-y-1 backdrop-blur-2xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                            <Building2 className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-100">{office.name.ar}</h3>
                            <p className="text-sm text-slate-300">{office.name.en}</p>
                            <p className="text-sm text-tarhal-orange font-medium">{country?.name.ar}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-white text-xs rounded-full font-medium ${
                            office.isActive ? 'bg-green-500' : 'bg-gray-500'
                          }`}>
                            {office.isActive ? getLocalizedText('نشط', 'Active', 'Actif') : getLocalizedText('غير نشط', 'Inactive', 'Inactif')}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{office.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-100">{getLocalizedText('العنوان', 'Address', 'Adresse')}</p>
                            <p className="text-sm text-slate-300">{office.address.ar}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-100">{getLocalizedText('الهاتف', 'Phone', 'Téléphone')}</p>
                            <p className="text-sm text-slate-300">{office.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-100">{getLocalizedText('البريد الإلكتروني', 'Email', 'Email')}</p>
                            <p className="text-sm text-slate-300">{office.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-slate-300">{office.workingHours.ar}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingOffice(office)}
                            className="bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white shadow-md shadow-blue-500/40"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {getLocalizedText('تعديل', 'Edit', 'Modifier')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteOffice(office.id)}
                            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-md shadow-red-500/40"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {getLocalizedText('حذف', 'Delete', 'Supprimer')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange bg-white"
                    >
                      <option value="">{getLocalizedText('جميع الدول', 'All Countries', 'Tous les Pays')}</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>
                          {country.name.ar}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => loadData()}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full px-4"
                      title={getLocalizedText('إعادة تحميل البيانات', 'Reload Data', 'Recharger les Données')}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => forceLoadOffers()}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4"
                      title={getLocalizedText('تحميل العروض مباشرة من localStorage', 'Load offers directly from localStorage', 'Charger les offres directement depuis localStorage')}
                    >
                      <Database className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={async () => {
                        if (confirm(getLocalizedText(
                          'هل تريد إنشاء 10 عروض سياحية لكل دولة؟ سيتم حفظها على السيرفر.',
                          'Do you want to generate 10 tour offers for each country? They will be saved to the server.',
                          'Voulez-vous générer 10 offres touristiques pour chaque pays ? Elles seront enregistrées sur le serveur.'
                        ))) {
                          try {
                            await dataManager.ensureOffersForAllCountriesAsync(10);
                            await loadData();
                            alert(getLocalizedText(
                              'تم إنشاء العروض بنجاح!',
                              'Offers created successfully!',
                              'Offres créées avec succès !'
                            ));
                          } catch (error) {
                            console.error('Error generating offers:', error);
                            alert(getLocalizedText(
                              'حدث خطأ أثناء إنشاء العروض',
                              'Error creating offers',
                              'Erreur lors de la création des offres'
                            ));
                          }
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4"
                      title={getLocalizedText('إنشاء 10 عروض لكل دولة', 'Generate 10 offers per country', 'Générer 10 offres par pays')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {getLocalizedText('إنشاء عروض تلقائياً', 'Auto Generate Offers', 'Générer Offres Auto')}
                    </Button>
                    {offers.length === 0 && (
                      <Button
                        onClick={() => createSampleData()}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4"
                        title={getLocalizedText('إنشاء بيانات تجريبية', 'Create Sample Data', 'Créer des Données d\'Exemple')}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        {getLocalizedText('إنشاء بيانات', 'Create Data', 'Créer Données')}
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setNewOffer({
                          countryId: countries[0]?.id || '',
                          title: { ar: '', en: '', fr: '' },
                          description: { ar: '', en: '', fr: '' },
                          price: 0,
                          currency: 'USD',
                          durationDays: 1,
                          isFeatured: false,
                          imageUrl: '',
                          isActive: true,
                        });
                        setIsAddingOffer(true);
                      }}
                      className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {getLocalizedText('إضافة عرض جديد', 'Add New Offer', 'Ajouter une Nouvelle Offre')}
                    </Button>
                  </div>
                </div>
                {/* Debug Info - Show direct localStorage count */}
                {(() => {
                  let directCount = 0;
                  try {
                    const stored = localStorage.getItem('admin_tour_offers');
                    if (stored) {
                      directCount = JSON.parse(stored).length;
                    }
                  } catch (e) {}
                  return (
                    <div className="text-sm text-gray-600 flex items-center gap-4 flex-wrap bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="font-bold text-blue-900">
                        {getLocalizedText('عدد العروض في localStorage:', 'Offers in localStorage:', 'Offres dans localStorage:')} <strong className="text-blue-700">{directCount}</strong>
                      </span>
                      <span>{getLocalizedText('State:', 'State:', 'State:')} <strong className="text-gray-900">{offers.length}</strong></span>
                      <span>{getLocalizedText('Storage:', 'Storage:', 'Storage:')} <strong className="text-gray-900">{offersFromStorage.length}</strong></span>
                      {directCount > 0 && (
                        <span className="text-green-600 font-bold">
                          ✓ {getLocalizedText('العروض موجودة! يجب أن تظهر أدناه', 'Offers exist! Should appear below', 'Les offres existent! Devraient apparaître ci-dessous')}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Offers List - Debug Info */}
              {(() => {
                console.log('[AdminDashboard] JSX Render - offers:', offers.length, 'offersFromStorage:', offersFromStorage.length, 'offersDirectFromStorage:', offersDirectFromStorage.length, 'displayOffers:', displayOffers.length, 'direct data:', offersDirectFromStorage);
                return null;
              })()}
              
              {/* Offers List - ULTRA SIMPLE DIRECT */}
              {(() => {
                // ULTRA SIMPLE: Read directly from localStorage
                let finalOffersList: TourOffer[] = [];
                
                // Try localStorage first
                try {
                  const stored = localStorage.getItem('admin_tour_offers');
                  if (stored) {
                    finalOffersList = JSON.parse(stored);
                    console.log('[AdminDashboard] ULTRA SIMPLE - localStorage:', finalOffersList.length, finalOffersList);
                  }
                } catch (e) {
                  console.error('[AdminDashboard] ULTRA SIMPLE - localStorage error:', e);
                }
                
                // If empty, try state
                if (finalOffersList.length === 0 && offers.length > 0) {
                  finalOffersList = offers;
                  console.log('[AdminDashboard] ULTRA SIMPLE - using state:', finalOffersList.length);
                }
                
                // If still empty, try dataManager
                if (finalOffersList.length === 0) {
                  try {
                    finalOffersList = dataManager.getOffers();
                    console.log('[AdminDashboard] ULTRA SIMPLE - dataManager:', finalOffersList.length);
                  } catch (e) {
                    console.error('[AdminDashboard] ULTRA SIMPLE - dataManager error:', e);
                  }
                }
                
                console.log('[AdminDashboard] ULTRA SIMPLE - FINAL LIST:', finalOffersList.length, finalOffersList);
                
                // Show empty message if no offers
                if (finalOffersList.length === 0) {
                  return (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity className="h-10 w-10 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {getLocalizedText('لا توجد عروض', 'No Offers Found', 'Aucune Offre Trouvée')}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {getLocalizedText(
                          'لا توجد عروض في النظام. قم بإضافة عرض جديد.',
                          'No offers in the system. Add a new offer.',
                          'Aucune offre dans le système. Ajoutez une nouvelle offre.'
                        )}
                      </p>
                      <Button
                        onClick={() => setIsAddingOffer(true)}
                        className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white shadow-lg"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {getLocalizedText('إضافة عرض جديد', 'Add New Offer', 'Ajouter une Nouvelle Offre')}
                      </Button>
                    </div>
                  );
                }
                
                // SHOW OFFERS - This MUST work!
                console.log('[AdminDashboard] RENDERING OFFERS NOW:', finalOffersList.length, 'Full data:', finalOffersList);
                
                // Validate offers have required fields
                const validOffers = finalOffersList.filter(offer => {
                  const isValid = offer && offer.id && offer.title && (offer.title.ar || offer.title.en);
                  if (!isValid) {
                    console.warn('[AdminDashboard] Invalid offer found:', offer);
                  }
                  return isValid;
                });
                
                console.log('[AdminDashboard] Valid offers:', validOffers.length, 'out of', finalOffersList.length);
                
                if (validOffers.length === 0 && finalOffersList.length > 0) {
                  console.error('[AdminDashboard] All offers are invalid!', finalOffersList);
                  return (
                    <div className="bg-red-50 rounded-2xl shadow-lg border border-red-200 p-12 text-center">
                      <h3 className="text-xl font-semibold text-red-900 mb-2">
                        {getLocalizedText('خطأ في بيانات العروض', 'Error in offers data', 'Erreur dans les données des offres')}
                      </h3>
                      <p className="text-red-600">
                        {getLocalizedText('تم العثور على', 'Found', 'Trouvé')} {finalOffersList.length} {getLocalizedText('عروض لكن البيانات غير صحيحة', 'offers but data is invalid', 'offres mais les données sont invalides')}
                      </p>
                      <p className="text-sm text-gray-600 mt-4">
                        {getLocalizedText('تحقق من Console للتفاصيل', 'Check Console for details', 'Vérifiez la Console pour les détails')}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <div className="grid grid-cols-1 gap-6">
                    {validOffers.map((offer) => {
                      const country = countries.find(c => c.id === offer.countryId);
                      console.log('[AdminDashboard] Rendering offer:', offer.id, offer.title?.ar || offer.title?.en);
                      return (
                      <div
                        key={offer.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Activity className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {offer.title?.ar || offer.title?.en || offer.title?.fr || 'No Title'}
                              </h3>
                              <p className="text-sm text-gray-600">{country?.name?.ar || country?.name?.en || 'Unknown Country'}</p>
                              <p className="text-sm text-tarhal-orange font-medium mt-1">
                                {offer.price || 0} {offer.currency || 'USD'} • {offer.durationDays || 0}{' '}
                                {getLocalizedText('أيام', 'days', 'jours')}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-white text-xs rounded-full font-medium ${
                              offer.isActive ? 'bg-green-500' : 'bg-gray-500'
                            }`}
                          >
                            {offer.isActive
                              ? getLocalizedText('نشط', 'Active', 'Actif')
                              : getLocalizedText('غير نشط', 'Inactive', 'Inactif')}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                          {offer.description?.ar || offer.description?.en || offer.description?.fr || 'No description'}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {offer.isFeatured && (
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                {getLocalizedText('عرض مميز', 'Featured Offer', 'Offre en Vedette')}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setEditingOffer({ ...offer, videos: offer.videos || [] })}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {getLocalizedText('تعديل', 'Edit', 'Modifier')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={async () => {
                                if (
                                  confirm(
                                    getLocalizedText(
                                      'هل أنت متأكد من حذف هذا العرض؟',
                                      'Are you sure you want to delete this offer?',
                                      'Êtes-vous sûr de vouloir supprimer cette offre?'
                                    )
                                  )
                                ) {
                                  if (await dataManager.deleteOfferAsync(offer.id)) {
                                    await loadData();
                                  }
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {getLocalizedText('حذف', 'Delete', 'Supprimer')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'flights' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl border border-sky-100 p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Plane className="h-6 w-6 text-sky-600" />
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {editingFlightTicket
                          ? getLocalizedText('تعديل تذكرة طيران', 'Edit Flight Ticket', 'Modifier un billet')
                          : getLocalizedText('إضافة تذكرة طيران', 'Add Flight Ticket', 'Ajouter un billet d\'avion')}
                      </h3>
                      <p className="text-sm text-slate-500">{getLocalizedText('أضف أو عدّل بيانات التذاكر بسهولة', 'Add or edit flight tickets easily', 'Ajoutez ou modifiez les billets facilement')}</p>
                    </div>
                  </div>
                  {editingFlightTicket && (
                    <Button variant="outline" onClick={() => setEditingFlightTicket(null)}>
                      {getLocalizedText('إلغاء التعديل', 'Cancel edit', 'Annuler')}
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={(editingFlightTicket?.countryId ?? newFlightTicket.countryId) || ''}
                    onChange={(e) => {
                      editingFlightTicket
                        ? setEditingFlightTicket({ ...editingFlightTicket, countryId: e.target.value })
                        : setNewFlightTicket({ ...newFlightTicket, countryId: e.target.value });
                    }}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="">{getLocalizedText('اختر الدولة', 'Select Country', 'Sélectionner le Pays')}</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name.ar}</option>
                    ))}
                  </select>
                  <Input placeholder="From" value={editingFlightTicket?.from ?? newFlightTicket.from ?? ''} onChange={(e) => {
                    editingFlightTicket
                      ? setEditingFlightTicket({ ...editingFlightTicket, from: e.target.value })
                      : setNewFlightTicket({ ...newFlightTicket, from: e.target.value });
                  }} />
                  <Input placeholder="To" value={editingFlightTicket?.to ?? newFlightTicket.to ?? ''} onChange={(e) => {
                    editingFlightTicket
                      ? setEditingFlightTicket({ ...editingFlightTicket, to: e.target.value })
                      : setNewFlightTicket({ ...newFlightTicket, to: e.target.value });
                  }} />
                  <Input placeholder="Airline" value={editingFlightTicket?.airline ?? newFlightTicket.airline ?? ''} onChange={(e) => {
                    editingFlightTicket
                      ? setEditingFlightTicket({ ...editingFlightTicket, airline: e.target.value })
                      : setNewFlightTicket({ ...newFlightTicket, airline: e.target.value });
                  }} />
                  <select
                    value={(editingFlightTicket?.classType ?? newFlightTicket.classType) || 'economy'}
                    onChange={(e) => {
                      const val = e.target.value as FlightTicket['classType'];
                      editingFlightTicket
                        ? setEditingFlightTicket({ ...editingFlightTicket, classType: val })
                        : setNewFlightTicket({ ...newFlightTicket, classType: val });
                    }}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First</option>
                  </select>
                  <Input type="number" placeholder="Price" value={editingFlightTicket?.price ?? newFlightTicket.price ?? 0} onChange={(e) => {
                    const val = Number(e.target.value);
                    editingFlightTicket
                      ? setEditingFlightTicket({ ...editingFlightTicket, price: val })
                      : setNewFlightTicket({ ...newFlightTicket, price: val });
                  }} />
                  <Input placeholder="Currency" value={editingFlightTicket?.currency ?? newFlightTicket.currency ?? 'USD'} onChange={(e) => {
                    editingFlightTicket
                      ? setEditingFlightTicket({ ...editingFlightTicket, currency: e.target.value })
                      : setNewFlightTicket({ ...newFlightTicket, currency: e.target.value });
                  }} />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={editingFlightTicket?.refundable ?? newFlightTicket.refundable ?? true} onChange={(e) => {
                      editingFlightTicket
                        ? setEditingFlightTicket({ ...editingFlightTicket, refundable: e.target.checked })
                        : setNewFlightTicket({ ...newFlightTicket, refundable: e.target.checked });
                    }} />
                    {getLocalizedText('قابل للاسترجاع', 'Refundable', 'Remboursable')}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={editingFlightTicket?.isActive ?? newFlightTicket.isActive ?? true} onChange={(e) => {
                      editingFlightTicket
                        ? setEditingFlightTicket({ ...editingFlightTicket, isActive: e.target.checked })
                        : setNewFlightTicket({ ...newFlightTicket, isActive: e.target.checked });
                    }} />
                    {getLocalizedText('نشط', 'Active', 'Actif')}
                  </label>
                </div>
                <Button
                  onClick={editingFlightTicket ? handleUpdateFlightTicket : handleAddFlightTicket}
                  className="bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-600 hover:to-blue-800 text-white"
                >
                  {editingFlightTicket
                    ? getLocalizedText('حفظ التعديلات', 'Save changes', 'Enregistrer les modifications')
                    : getLocalizedText('إضافة تذكرة', 'Add Ticket', 'Ajouter')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flightTickets.map(ticket => (
                  <div key={ticket.id} className="bg-gradient-to-br from-white via-sky-50 to-white rounded-3xl shadow-lg border border-sky-100 p-5 space-y-3 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide">{getCountryName(ticket.countryId)}</p>
                        <h4 className="text-xl font-bold text-slate-900">{ticket.from} → {ticket.to}</h4>
                        <p className="text-sm text-slate-600">{ticket.airline} · {ticket.classType}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={ticket.isActive ? 'default' : 'secondary'}>
                          {ticket.isActive ? getLocalizedText('نشط', 'Active', 'Actif') : getLocalizedText('غير نشط', 'Inactive', 'Inactif')}
                        </Badge>
                        <Badge variant="outline">
                          {ticket.refundable ? getLocalizedText('قابل للاسترجاع', 'Refundable', 'Remboursable') : getLocalizedText('غير قابل للاسترجاع', 'Non-refundable', 'Non remboursable')}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-lg font-extrabold text-sky-700">{ticket.price} {ticket.currency}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingFlightTicket(ticket)}>
                        {getLocalizedText('تعديل', 'Edit', 'Modifier')}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteFlightTicket(ticket.id)}>
                        {getLocalizedText('حذف', 'Delete', 'Supprimer')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'visas' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {editingTravelVisa
                          ? getLocalizedText('تعديل تأشيرة سفر', 'Edit Travel Visa', 'Modifier un visa')
                          : getLocalizedText('إضافة تأشيرة سفر', 'Add Travel Visa', 'Ajouter un visa')}
                      </h3>
                      <p className="text-sm text-slate-500">{getLocalizedText('أضف أو عدّل خدمات التأشيرات بسهولة', 'Add or edit visas easily', 'Ajoutez ou modifiez les visas facilement')}</p>
                    </div>
                  </div>
                  {editingTravelVisa && (
                    <Button variant="outline" onClick={() => setEditingTravelVisa(null)}>
                      {getLocalizedText('إلغاء التعديل', 'Cancel edit', 'Annuler')}
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={(editingTravelVisa?.countryId ?? newTravelVisa.countryId) || ''}
                    onChange={(e) => {
                      editingTravelVisa
                        ? setEditingTravelVisa({ ...editingTravelVisa, countryId: e.target.value })
                        : setNewTravelVisa({ ...newTravelVisa, countryId: e.target.value });
                    }}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="">{getLocalizedText('اختر الدولة', 'Select Country', 'Sélectionner le Pays')}</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name.ar}</option>
                    ))}
                  </select>
                  <Input placeholder={getLocalizedText('عنوان التأشيرة (ع)', 'Visa title (AR)', 'Titre du visa (AR)')} value={editingTravelVisa?.title?.ar ?? newTravelVisa.title?.ar ?? ''} onChange={(e) => {
                    const val = e.target.value;
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, title: { ...(editingTravelVisa.title || { ar: '', en: '', fr: '' }), ar: val } })
                      : setNewTravelVisa({ ...newTravelVisa, title: { ...(newTravelVisa.title || { ar: '', en: '', fr: '' }), ar: val } });
                  }} />
                  <Input placeholder="Visa title (EN)" value={editingTravelVisa?.title?.en ?? newTravelVisa.title?.en ?? ''} onChange={(e) => {
                    const val = e.target.value;
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, title: { ...(editingTravelVisa.title || { ar: '', en: '', fr: '' }), en: val } })
                      : setNewTravelVisa({ ...newTravelVisa, title: { ...(newTravelVisa.title || { ar: '', en: '', fr: '' }), en: val } });
                  }} />
                  <Input placeholder="Titre du visa (FR)" value={editingTravelVisa?.title?.fr ?? newTravelVisa.title?.fr ?? ''} onChange={(e) => {
                    const val = e.target.value;
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, title: { ...(editingTravelVisa.title || { ar: '', en: '', fr: '' }), fr: val } })
                      : setNewTravelVisa({ ...newTravelVisa, title: { ...(newTravelVisa.title || { ar: '', en: '', fr: '' }), fr: val } });
                  }} />
                  <Textarea placeholder={getLocalizedText('وصف (ع)', 'Description (AR)', 'Description (AR)')} value={editingTravelVisa?.description?.ar ?? newTravelVisa.description?.ar ?? ''} onChange={(e) => {
                    const val = e.target.value;
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, description: { ...(editingTravelVisa.description || { ar: '', en: '', fr: '' }), ar: val } })
                      : setNewTravelVisa({ ...newTravelVisa, description: { ...(newTravelVisa.description || { ar: '', en: '', fr: '' }), ar: val } });
                  }} />
                  <Textarea placeholder="Description (EN)" value={editingTravelVisa?.description?.en ?? newTravelVisa.description?.en ?? ''} onChange={(e) => {
                    const val = e.target.value;
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, description: { ...(editingTravelVisa.description || { ar: '', en: '', fr: '' }), en: val } })
                      : setNewTravelVisa({ ...newTravelVisa, description: { ...(newTravelVisa.description || { ar: '', en: '', fr: '' }), en: val } });
                  }} />
                  <Textarea placeholder="Description (FR)" value={editingTravelVisa?.description?.fr ?? newTravelVisa.description?.fr ?? ''} onChange={(e) => {
                    const val = e.target.value;
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, description: { ...(editingTravelVisa.description || { ar: '', en: '', fr: '' }), fr: val } })
                      : setNewTravelVisa({ ...newTravelVisa, description: { ...(newTravelVisa.description || { ar: '', en: '', fr: '' }), fr: val } });
                  }} />
                  <Input type="number" placeholder={getLocalizedText('السعر', 'Price', 'Prix')} value={editingTravelVisa?.price ?? newTravelVisa.price ?? 0} onChange={(e) => {
                    const val = Number(e.target.value);
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, price: val })
                      : setNewTravelVisa({ ...newTravelVisa, price: val });
                  }} />
                  <Input placeholder="Currency" value={editingTravelVisa?.currency ?? newTravelVisa.currency ?? 'USD'} onChange={(e) => {
                    const val = e.target.value;
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, currency: val })
                      : setNewTravelVisa({ ...newTravelVisa, currency: val });
                  }} />
                  <Input placeholder={getLocalizedText('مدة المعالجة', 'Processing time', 'Délai de traitement')} value={editingTravelVisa?.processingTime ?? newTravelVisa.processingTime ?? ''} onChange={(e) => {
                    const val = e.target.value;
                    editingTravelVisa
                      ? setEditingTravelVisa({ ...editingTravelVisa, processingTime: val })
                      : setNewTravelVisa({ ...newTravelVisa, processingTime: val });
                  }} />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={editingTravelVisa?.isActive ?? newTravelVisa.isActive ?? true} onChange={(e) => {
                      editingTravelVisa
                        ? setEditingTravelVisa({ ...editingTravelVisa, isActive: e.target.checked })
                        : setNewTravelVisa({ ...newTravelVisa, isActive: e.target.checked });
                    }} />
                    {getLocalizedText('نشط', 'Active', 'Actif')}
                  </label>
                </div>
                <Button onClick={editingTravelVisa ? handleUpdateTravelVisa : handleAddTravelVisa} className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white">
                  {editingTravelVisa
                    ? getLocalizedText('حفظ التعديلات', 'Save changes', 'Enregistrer les modifications')
                    : getLocalizedText('إضافة تأشيرة', 'Add Visa', 'Ajouter')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {travelVisas.map(visa => (
                  <div key={visa.id} className="bg-gradient-to-br from-white via-emerald-50 to-white rounded-3xl shadow-lg border border-emerald-100 p-5 space-y-3 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">{getCountryName(visa.countryId)}</p>
                        <h4 className="text-lg font-bold text-slate-900">{visa.title?.ar || visa.title?.en}</h4>
                      </div>
                      <Badge variant={visa.isActive ? 'default' : 'secondary'}>
                        {visa.isActive ? getLocalizedText('نشط', 'Active', 'Actif') : getLocalizedText('غير نشط', 'Inactive', 'Inactif')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{visa.description?.ar || visa.description?.en}</p>
                    <p className="text-sm font-semibold text-emerald-700">{visa.price} {visa.currency}</p>
                    <p className="text-xs text-gray-500">{visa.processingTime}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingTravelVisa(visa)}>
                        {getLocalizedText('تعديل', 'Edit', 'Modifier')}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteTravelVisa(visa.id)}>
                        {getLocalizedText('حذف', 'Delete', 'Supprimer')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange bg-white"
                    >
                      <option value="">{getLocalizedText('جميع الدول', 'All Countries', 'Tous les Pays')}</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>
                          {country.name.ar}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={() => {
                      setNewHotel({
                        countryId: countries[0]?.id || '',
                        name: { ar: '', en: '', fr: '' },
                        description: { ar: '', en: '', fr: '' },
                        address: { ar: '', en: '', fr: '' },
                        city: { ar: '', en: '', fr: '' },
                        phone: '',
                        email: '',
                        website: '',
                        imageUrl: '',
                        images: [],
                        rating: 4.0,
                        reviews: 0,
                        stars: 4,
                        pricePerNight: 100,
                        currency: 'USD',
                        amenities: { ar: [], en: [], fr: [] },
                        isFeatured: false,
                        isActive: true,
                      });
                      setIsAddingHotel(true);
                    }}
                    className="bg-tarhal-orange hover:bg-tarhal-orange-dark text-white shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {getLocalizedText('إضافة فندق جديد', 'Add New Hotel', 'Ajouter un Nouvel Hôtel')}
                  </Button>
                </div>
              </div>

              {/* Hotels List */}
              <div className="grid grid-cols-1 gap-6">
                {hotels
                  .filter(h => !selectedCountry || h.countryId === selectedCountry)
                  .map((hotel) => {
                    const country = countries.find(c => c.id === hotel.countryId);
                    return (
                      <div
                        key={hotel.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            {hotel.imageUrl && (
                              <img
                                src={hotel.imageUrl}
                                alt={hotel.name.ar}
                                className="w-20 h-20 object-cover rounded-xl"
                              />
                            )}
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{hotel.name.ar}</h3>
                              <p className="text-sm text-gray-600">{country?.name.ar} • {hotel.city.ar}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < hotel.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">
                                  {hotel.rating} ({hotel.reviews} {getLocalizedText('مراجعة', 'reviews', 'avis')})
                                </span>
                              </div>
                              <p className="text-sm text-tarhal-orange font-medium mt-1">
                                {hotel.pricePerNight} {hotel.currency} {getLocalizedText('للليلة', 'per night', 'par nuit')}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-white text-xs rounded-full font-medium ${
                              hotel.isActive ? 'bg-green-500' : 'bg-gray-500'
                            }`}
                          >
                            {hotel.isActive
                              ? getLocalizedText('نشط', 'Active', 'Actif')
                              : getLocalizedText('غير نشط', 'Inactive', 'Inactif')}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                          {hotel.description.ar}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {hotel.isFeatured && (
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                {getLocalizedText('فندق مميز', 'Featured Hotel', 'Hôtel en Vedette')}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setEditingHotel(hotel)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {getLocalizedText('تعديل', 'Edit', 'Modifier')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                if (
                                  confirm(
                                    getLocalizedText(
                                      'هل أنت متأكد من حذف هذا الفندق؟',
                                      'Are you sure you want to delete this hotel?',
                                      'Êtes-vous sûr de vouloir supprimer cet hôtel ?',
                                    ),
                                  )
                                ) {
                                  dataManager.deleteHotelAsync(hotel.id).then(() => {
                                    loadData();
                                  });
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {getLocalizedText('حذف', 'Delete', 'Supprimer')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {activeTab === 'supervisors' && (
            <div className="space-y-6">
              <AdminSupervisorManagement />
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <AdminPayments />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* هيدر التحليلات + أزرار (مكوّنات 1-3) */}
              <div className="bg-slate-950/80 rounded-3xl shadow-[0_24px_70px_rgba(15,23,42,1)] border border-purple-500/40 p-6 md:p-8 backdrop-blur-3xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/40 to-fuchsia-500/60 flex items-center justify-center shadow-lg shadow-purple-500/40">
                      <TrendingUp className="h-7 w-7 text-fuchsia-50" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-50">
                        {getLocalizedText('لوحة التحليلات', 'Analytics Dashboard', 'Tableau de Bord Analytique')}
                      </h3>
                      <p className="text-sm text-slate-300 max-w-xl">
                        {getLocalizedText(
                          'رؤية شاملة للأداء اليومي للدول والمكاتب والعروض السياحية في منصة ciar.',
                          'A complete view of daily performance for countries, offices and tour offers in ciar.',
                          'Une vue complète des performances quotidiennes des pays, bureaux et offres touristiques dans ciar.'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* 1: زر تحديث التحليلات */}
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white rounded-full shadow-[0_18px_45px_rgba(168,85,247,0.7)] px-5"
                      onClick={() => showDemoFeatureMessage(getLocalizedText('تحديث التحليلات', 'Refresh analytics', 'Actualiser les analyses'))}
                    >
                      <RefreshCw className="h-4 w-4 ml-1" />
                      {getLocalizedText('تحديث التحليلات', 'Refresh Analytics', 'Actualiser les Analyses')}
                    </Button>
                    {/* 2: زر تصدير التقارير */}
                    <Button
                      variant="outline"
                      className="border-purple-400/50 text-purple-200 bg-slate-900/70 rounded-full"
                      onClick={() => showDemoFeatureMessage(getLocalizedText('تصدير تقارير التحليلات', 'Export analytics reports', 'Exporter les rapports analytiques'))}
                    >
                      <FileText className="h-4 w-4 ml-1" />
                      {getLocalizedText('تصدير التقارير', 'Export Reports', 'Exporter les Rapports')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* بطاقات مؤشرات أساسية (مكوّنات 4-7) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-900/40">
                  <div>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText('إجمالي الحجوزات اليوم', 'Total bookings today', 'Réservations totales aujourd\'hui')}
                    </p>
                    <p className="text-2xl font-bold text-emerald-300 mt-1">248</p>
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +18% {getLocalizedText('مقارنة بالأمس', 'vs yesterday', 'par rapport à hier')}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/25 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-100" />
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-sky-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-sky-900/40">
                  <div>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText('الدخل لهذا الشهر', 'Revenue this month', 'Revenus ce mois')}
                    </p>
                    <p className="text-2xl font-bold text-sky-300 mt-1">$84,320</p>
                    <p className="text-[11px] text-sky-400 mt-1">
                      {getLocalizedText('متوسط يومي', 'Daily average', 'Moyenne quotidienne')} 2,811$
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/25 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-sky-100" />
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-amber-900/40">
                  <div>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText('الدول النشطة', 'Active countries', 'Pays actifs')}
                    </p>
                    <p className="text-2xl font-bold text-amber-300 mt-1">{countries.length || 24}</p>
                    <p className="text-[11px] text-amber-400 mt-1">
                      {getLocalizedText('تغطي أكثر من 120 مدينة سياحية', 'Covering more than 120 travel cities', 'Couvrant plus de 120 villes touristiques')}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/25 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-amber-100" />
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-rose-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-rose-900/40">
                  <div>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText('العروض المميزة', 'Featured offers', 'Offres en vedette')}
                    </p>
                    <p className="text-2xl font-bold text-rose-300 mt-1">
                      {offers.filter(o => o.isFeatured).length || 42}
                    </p>
                    <p className="text-[11px] text-rose-400 mt-1">
                      {getLocalizedText('أعلى معدل تحويل للحجوزات', 'Highest booking conversion rate', 'Meilleur taux de conversion')}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/25 flex items-center justify-center">
                    <Star className="h-5 w-5 text-rose-100 fill-current" />
                  </div>
                </div>
              </div>

              {/* شريط الفلاتر والمدة الزمنية (مكوّنات 8-12) */}
              <div className="bg-slate-950/80 rounded-3xl border border-slate-700/70 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 backdrop-blur-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                {/* 8: اختيار المدة الزمنية */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <select className="bg-slate-900/80 border border-slate-700 text-xs text-slate-100 rounded-2xl px-3 py-2 focus:outline-none">
                    <option>{getLocalizedText('آخر 7 أيام', 'Last 7 days', '7 derniers jours')}</option>
                    <option>{getLocalizedText('آخر 30 يوم', 'Last 30 days', '30 derniers jours')}</option>
                    <option>{getLocalizedText('آخر 90 يوم', 'Last 90 days', '90 derniers jours')}</option>
                    <option>{getLocalizedText('هذا العام', 'This year', 'Cette année')}</option>
                  </select>
                </div>
                {/* 9: اختيار الدولة */}
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <select className="w-full bg-slate-900/80 border border-slate-700 text-xs text-slate-100 rounded-2xl px-3 py-2 focus:outline-none">
                    <option value="all">{getLocalizedText('كل الدول', 'All countries', 'Tous les pays')}</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name.ar}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* 10: نوع التقرير */}
                  <select className="bg-slate-900/80 border border-slate-700 text-xs text-slate-100 rounded-2xl px-3 py-2 focus:outline-none">
                    <option>{getLocalizedText('كل المؤشرات', 'All metrics', 'Tous les indicateurs')}</option>
                    <option>{getLocalizedText('الحجوزات فقط', 'Bookings only', 'Réservations seulement')}</option>
                    <option>{getLocalizedText('الإيرادات فقط', 'Revenue only', 'Revenus seulement')}</option>
                  </select>
                  {/* 11: زر الفلاتر المتقدمة */}
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-200 bg-slate-900/70 rounded-2xl px-3 py-2 text-xs flex items-center gap-1"
                  >
                    <Filter className="h-3 w-3" />
                    {getLocalizedText('فلاتر متقدمة', 'Advanced filters', 'Filtres avancés')}
                  </Button>
                  {/* 12: سويتش مقارنة بالفترة السابقة */}
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Switch />
                    <span>{getLocalizedText('مقارنة بالفترة السابقة', 'Compare with previous period', 'Comparer avec la période précédente')}</span>
                  </div>
                </div>
              </div>

              {/* شبكة الرسوم البيانية الرئيسية (مكوّنات 13-16) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* 13: إيرادات الشهر على شكل مخطط وهمي */}
                <div className="xl:col-span-2 bg-slate-950/80 rounded-3xl border border-purple-500/40 p-5 md:p-6 backdrop-blur-2xl shadow-[0_24px_70px_rgba(15,23,42,1)]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-50">
                        {getLocalizedText('منحنى الإيرادات اليومية', 'Daily revenue curve', 'Courbe des revenus quotidiens')}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {getLocalizedText('توزيع الإيرادات خلال آخر 30 يوم', 'Revenue distribution over last 30 days', 'Répartition des revenus sur les 30 derniers jours')}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-[11px] text-purple-200 border border-purple-400/40">
                      {getLocalizedText('محاكاة تصميم المخطط', 'Chart design mock', 'Simulation de design de graphique')}
                    </span>
                  </div>
                  {/* شكل مخطط وهمي باستخدام divs */}
                  <div className="h-40 md:h-52 bg-gradient-to-t from-slate-900 to-slate-950 rounded-2xl border border-slate-800 flex items-end gap-1 p-3">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full bg-gradient-to-t from-fuchsia-600/20 via-purple-500/50 to-sky-400/80"
                        style={{ height: `${20 + (i % 5) * 13}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                    <span>{getLocalizedText('أداء مستقر مع نمو تدريجي', 'Stable performance with gradual growth', 'Performance stable avec croissance progressive')}</span>
                    <span>{getLocalizedText('ذروة الطلب في عطلة نهاية الأسبوع', 'Peak demand on weekends', 'Pic de demande le week-end')}</span>
                  </div>
                </div>

                {/* 14-16: بطاقات إضافية جانبية */}
                <div className="space-y-4">
                  <div className="bg-slate-950/80 rounded-2xl border border-emerald-500/40 p-4 shadow-lg shadow-emerald-900/40">
                    <p className="text-xs text-slate-400 mb-1">
                      {getLocalizedText('نسبة التحويل من الزيارة إلى الحجز', 'Visit to booking conversion rate', 'Taux de conversion visite → réservation')}
                    </p>
                    <p className="text-2xl font-bold text-emerald-300">4.7%</p>
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                    </div>
                    <p className="text-[11px] text-emerald-300 mt-1">
                      +0.8% {getLocalizedText('خلال 30 يوم', 'in 30 days', 'en 30 jours')}
                    </p>
                  </div>
                  <div className="bg-slate-950/80 rounded-2xl border border-sky-500/40 p-4 shadow-lg shadow-sky-900/40">
                    <p className="text-xs text-slate-400 mb-1">
                      {getLocalizedText('أكثر قناة تحقق حجوزات', 'Top booking channel', 'Canal de réservation le plus performant')}
                    </p>
                    <p className="text-sm font-semibold text-sky-200">
                      {getLocalizedText('المكاتب السياحية المباشرة', 'Direct travel offices', 'Bureaux de voyage directs')}
                    </p>
                    <ul className="mt-2 space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                      <li>{getLocalizedText('41% من إجمالي الحجوزات', '41% of total bookings', '41% des réservations totales')}</li>
                      <li>{getLocalizedText('متوسط قيمة حجز أعلى من القنوات الأخرى', 'Higher booking value than other channels', 'Valeur de réservation plus élevée')}</li>
                    </ul>
                  </div>
                  <div className="bg-slate-950/80 rounded-2xl border border-rose-500/40 p-4 shadow-lg shadow-rose-900/40">
                    <p className="text-xs text-slate-400 mb-2">
                      {getLocalizedText('تنبيهات الأداء', 'Performance alerts', 'Alertes de performance')}
                    </p>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <p className="text-slate-200">
                          {getLocalizedText('انخفاض الحجوزات في أوروبا بنسبة 9% هذا الأسبوع.', 'Bookings in Europe down 9% this week.', 'Réservations en Europe en baisse de 9% cette semaine.')}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <p className="text-slate-200">
                          {getLocalizedText('ارتفاع الحجوزات في الشرق الأوسط بنسبة 15%.', 'Bookings in Middle East up 15%.', 'Réservations au Moyen-Orient en hausse de 15%.')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* جدول أفضل الدول أداءً (مكوّنات 17-20) */}
              <div className="bg-slate-950/80 rounded-3xl border border-slate-700/70 overflow-hidden backdrop-blur-2xl shadow-[0_24px_70px_rgba(15,23,42,1)]">
                <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-50">
                      {getLocalizedText('أفضل الدول من حيث الأداء', 'Top performing countries', 'Pays les plus performants')}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {getLocalizedText('ترتيب بحسب عدد الحجوزات والإيرادات المتوقعة.', 'Ranked by bookings and expected revenue.', 'Classé par réservations et revenus attendus.')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-200 bg-slate-900/70 rounded-full text-[11px]"
                  >
                    <BarChart3 className="h-3 w-3 ml-1" />
                    {getLocalizedText('عرض كامل للتقرير', 'View full report', 'Voir le rapport complet')}
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm text-slate-100">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 text-right">{getLocalizedText('الدولة', 'Country', 'Pays')}</th>
                        <th className="px-4 py-3 text-right">{getLocalizedText('الحجوزات', 'Bookings', 'Réservations')}</th>
                        <th className="px-4 py-3 text-right">{getLocalizedText('الإيرادات التقديرية', 'Estimated revenue', 'Revenus estimés')}</th>
                        <th className="px-4 py-3 text-right">{getLocalizedText('نمو شهري', 'Monthly growth', 'Croissance mensuelle')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {[
                        { country: 'السعودية', bookings: 482, revenue: '$38,900', growth: '+12%' },
                        { country: 'تركيا', bookings: 361, revenue: '$27,450', growth: '+9%' },
                        { country: 'الإمارات', bookings: 298, revenue: '$31,220', growth: '+15%' },
                        { country: 'المغرب', bookings: 214, revenue: '$16,800', growth: '+7%' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                          <td className="px-4 py-3 text-[11px] md:text-xs">{row.country}</td>
                          <td className="px-4 py-3 text-[11px] md:text-xs text-slate-100">{row.bookings}</td>
                          <td className="px-4 py-3 text-[11px] md:text-xs text-emerald-300">{row.revenue}</td>
                          <td className="px-4 py-3 text-[11px] md:text-xs text-emerald-400">{row.growth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 md:px-6 py-3 border-t border-slate-800 bg-slate-950/90 text-[11px] md:text-xs text-slate-300">
                  <div>
                    {getLocalizedText('إظهار 1 - 4 من أفضل 20 دولة', 'Showing 1 - 4 of top 20 countries', 'Affichage de 1 - 4 sur les 20 meilleurs pays')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="rounded-full border-slate-700 text-slate-300 bg-slate-900/80">
                      {getLocalizedText('السابق', 'Previous', 'Précédent')}
                    </Button>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-100">1</span>
                    <span className="px-2 text-slate-500">/ 5</span>
                    <Button size="sm" variant="outline" className="rounded-full border-slate-700 text-slate-300 bg-slate-900/80">
                      {getLocalizedText('التالي', 'Next', 'Suivant')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Top header + actions */}
              <div className="bg-slate-950/80 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,1)] border border-sky-500/30 p-6 md:p-8 backdrop-blur-3xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/40 to-blue-500/60 flex items-center justify-center shadow-lg shadow-sky-500/40">
                      <Users className="h-7 w-7 text-sky-50" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-50">
                        {getLocalizedText('إدارة المستخدمين', 'User Management', 'Gestion des Utilisateurs')}
                      </h3>
                      <p className="text-sm text-slate-300">
                        {getLocalizedText(
                          'تحكم في حسابات الأدمن والمشرفين والوكلاء من مكان واحد',
                          'Manage admins, supervisors and agents from one place',
                          'Gérez les admins, superviseurs et agents à partir d\'un seul endroit'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* مكوّن 1: زر إضافة مستخدم جديد */}
                    <Button
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-full shadow-[0_18px_45px_rgba(56,189,248,0.7)] px-5"
                      onClick={() => showDemoFeatureMessage(getLocalizedText('إضافة مستخدم جديد', 'Add new user', 'Ajouter un nouvel utilisateur'))}
                    >
                      <Plus className="h-4 w-4 ml-1" />
                      {getLocalizedText('إضافة مستخدم جديد', 'Add New User', 'Ajouter un Nouvel Utilisateur')}
                    </Button>
                    {/* مكوّن 2: زر تصدير المستخدمين */}
                    <Button
                      variant="outline"
                      className="border-sky-400/40 text-sky-200 bg-slate-900/60 rounded-full"
                      onClick={() => showDemoFeatureMessage(getLocalizedText('تصدير قائمة المستخدمين', 'Export users list', 'Exporter la liste des utilisateurs'))}
                    >
                      <Download className="h-4 w-4 ml-1" />
                      {getLocalizedText('تصدير', 'Export', 'Exporter')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* إحصائيات المستخدمين (مكوّنات 3-6) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 border border-sky-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-sky-900/40">
                  <div>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText('إجمالي المستخدمين', 'Total Users', 'Utilisateurs Totaux')}
                    </p>
                    <p className="text-2xl font-bold text-slate-50 mt-1">128</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-sky-100" />
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-900/40">
                  <div>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText('مستخدمون نشطون الآن', 'Active Now', 'Actifs Maintenant')}
                    </p>
                    <p className="text-2xl font-bold text-emerald-300 mt-1">32</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-200" />
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-amber-900/40">
                  <div>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText('المشرفون', 'Supervisors', 'Superviseurs')}
                    </p>
                    <p className="text-2xl font-bold text-amber-300 mt-1">18</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-amber-200" />
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-rose-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-rose-900/40">
                  <div>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText('حسابات تحتاج مراجعة', 'Need Review', 'Comptes à Vérifier')}
                    </p>
                    <p className="text-2xl font-bold text-rose-300 mt-1">7</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-rose-200" />
                  </div>
                </div>
              </div>

              {/* شريط البحث والفلاتر (مكوّنات 7-12) */}
              <div className="bg-slate-950/80 rounded-3xl border border-slate-700/60 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 backdrop-blur-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                {/* 7: مربع البحث */}
                <div className="flex-1 flex items-center gap-2 bg-slate-900/70 border border-slate-700 rounded-2xl px-3 py-2.5">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={getLocalizedText('بحث باسم المستخدم أو البريد...', 'Search by name or email...', 'Rechercher par nom ou email...')}
                    className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* 8: فلتر الدور */}
                  <select className="bg-slate-900/80 border border-slate-700 text-xs text-slate-100 rounded-2xl px-3 py-2 focus:outline-none">
                    <option value="all">{getLocalizedText('كل الأدوار', 'All roles', 'Tous les rôles')}</option>
                    <option value="admin">{getLocalizedText('أدمن', 'Admin', 'Admin')}</option>
                    <option value="supervisor">{getLocalizedText('مشرف', 'Supervisor', 'Superviseur')}</option>
                    <option value="agent">{getLocalizedText('وكيل', 'Agent', 'Agent')}</option>
                  </select>
                  {/* 9: فلتر الحالة */}
                  <select className="bg-slate-900/80 border border-slate-700 text-xs text-slate-100 rounded-2xl px-3 py-2 focus:outline-none">
                    <option value="all">{getLocalizedText('كل الحالات', 'All statuses', 'Tous les statuts')}</option>
                    <option value="active">{getLocalizedText('نشط', 'Active', 'Actif')}</option>
                    <option value="inactive">{getLocalizedText('موقوف', 'Inactive', 'Inactif')}</option>
                    <option value="pending">{getLocalizedText('قيد المراجعة', 'Pending', 'En Attente')}</option>
                  </select>
                  {/* 10: زر الفلاتر المتقدمة */}
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-200 bg-slate-900/60 rounded-2xl px-3 py-2 text-xs flex items-center gap-1"
                  >
                    <Filter className="h-3 w-3" />
                    {getLocalizedText('فلاتر متقدمة', 'Advanced filters', 'Filtres avancés')}
                  </Button>
                  {/* 11: سويتش إظهار النشطين فقط */}
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Switch />
                    <span>{getLocalizedText('النشطون فقط', 'Active only', 'Actifs seulement')}</span>
                  </div>
                </div>
              </div>

              {/* جدول المستخدمين (مكوّنات 13-20) */}
              <div className="bg-slate-950/80 rounded-3xl border border-slate-700/60 overflow-hidden backdrop-blur-2xl shadow-[0_24px_70px_rgba(15,23,42,1)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm text-slate-100">
                    <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 text-right">{getLocalizedText('المستخدم', 'User', 'Utilisateur')}</th>
                        <th className="px-4 py-3 text-right">{getLocalizedText('الدور', 'Role', 'Rôle')}</th>
                        <th className="px-4 py-3 text-right">{getLocalizedText('الدولة / المكاتب', 'Country / Offices', 'Pays / Bureaux')}</th>
                        <th className="px-4 py-3 text-right">{getLocalizedText('آخر تسجيل دخول', 'Last Login', 'Dernière Connexion')}</th>
                        <th className="px-4 py-3 text-right">{getLocalizedText('الحالة', 'Status', 'Statut')}</th>
                        <th className="px-4 py-3 text-right">{getLocalizedText('إجراءات', 'Actions', 'Actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {[
                        {
                          name: 'أحمد محمد',
                          email: 'ahmed@ciar.com',
                          role: getLocalizedText('أدمن', 'Admin', 'Admin'),
                          roleColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900',
                          country: 'السعودية',
                          offices: 12,
                          lastLogin: 'اليوم - 10:15 ص',
                          status: getLocalizedText('نشط', 'Active', 'Actif'),
                          statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                        },
                        {
                          name: 'سارة علي',
                          email: 'sara@ciar.com',
                          role: getLocalizedText('مشرف', 'Supervisor', 'Superviseur'),
                          roleColor: 'bg-gradient-to-r from-sky-500 to-blue-500 text-slate-50',
                          country: 'المغرب',
                          offices: 7,
                          lastLogin: 'أمس - 4:22 م',
                          status: getLocalizedText('نشط', 'Active', 'Actif'),
                          statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                        },
                        {
                          name: 'يوسف عمر',
                          email: 'yousef@ciar.com',
                          role: getLocalizedText('وكيل', 'Agent', 'Agent'),
                          roleColor: 'bg-gradient-to-r from-violet-500 to-indigo-500 text-slate-50',
                          country: 'تركيا',
                          offices: 3,
                          lastLogin: 'منذ 3 أيام',
                          status: getLocalizedText('قيد المراجعة', 'Pending', 'En Attente'),
                          statusColor: 'bg-amber-500/15 text-amber-300 border-amber-400/40',
                        },
                        {
                          name: 'ليلى حسن',
                          email: 'leila@ciar.com',
                          role: getLocalizedText('مشرف', 'Supervisor', 'Superviseur'),
                          roleColor: 'bg-gradient-to-r from-sky-500 to-blue-500 text-slate-50',
                          country: 'مصر',
                          offices: 5,
                          lastLogin: 'منذ أسبوع',
                          status: getLocalizedText('موقوف', 'Inactive', 'Inactif'),
                          statusColor: 'bg-rose-500/15 text-rose-300 border-rose-400/40',
                        },
                      ].map((user, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold">{user.name}</span>
                              <span className="text-[11px] text-slate-400">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${user.roleColor}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[11px] md:text-xs text-slate-200">
                            {user.country} • {user.offices}{' '}
                            {getLocalizedText('مكاتب', 'offices', 'bureaux')}
                          </td>
                          <td className="px-4 py-3 text-[11px] md:text-xs text-slate-300">{user.lastLogin}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${user.statusColor}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2 justify-end">
                              {/* 17: زر عرض التفاصيل */}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 text-[11px] rounded-full"
                                onClick={() => showDemoFeatureMessage(getLocalizedText('عرض تفاصيل المستخدم', 'View user details', 'Voir les détails de l\'utilisateur'))}
                              >
                                <Eye className="h-3 w-3 ml-1" />
                                {getLocalizedText('عرض', 'View', 'Voir')}
                              </Button>
                              {/* 18: زر تعديل */}
                              <Button
                                size="sm"
                                className="bg-sky-600 hover:bg-sky-500 text-white text-[11px] rounded-full"
                                onClick={() => showDemoFeatureMessage(getLocalizedText('تعديل بيانات المستخدم', 'Edit user data', 'Modifier les données de l\'utilisateur'))}
                              >
                                <Edit className="h-3 w-3 ml-1" />
                                {getLocalizedText('تعديل', 'Edit', 'Modifier')}
                              </Button>
                              {/* 19: زر إعادة تعيين كلمة المرور */}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-400/60 text-amber-200 bg-slate-900/60 hover:bg-slate-800/80 text-[11px] rounded-full"
                                onClick={() => showDemoFeatureMessage(getLocalizedText('إعادة تعيين كلمة مرور المستخدم', 'Reset user password', 'Réinitialiser le mot de passe de l\'utilisateur'))}
                              >
                                <RotateCcw className="h-3 w-3 ml-1" />
                                {getLocalizedText('إعادة تعيين كلمة المرور', 'Reset password', 'Réinitialiser le mot de passe')}
                              </Button>
                              {/* 20: زر إيقاف / تفعيل */}
                              <Button
                                size="sm"
                                className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] rounded-full"
                                onClick={() => showDemoFeatureMessage(getLocalizedText('تغيير حالة المستخدم', 'Toggle user status', 'Changer le statut de l\'utilisateur'))}
                              >
                                <UserCheck className="h-3 w-3 ml-1" />
                                {getLocalizedText('تغيير الحالة', 'Toggle status', 'Changer le statut')}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* شريط تحكم أسفل الجدول (مكوّن إضافي لتحسين التجربة) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-800 bg-slate-950/90 text-[11px] md:text-xs text-slate-300">
                  <div>
                    {getLocalizedText('إظهار 1 - 10 من 128 مستخدم', 'Showing 1 - 10 of 128 users', 'Affichage de 1 - 10 sur 128 utilisateurs')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="rounded-full border-slate-700 text-slate-300 bg-slate-900/80">
                      {getLocalizedText('السابق', 'Previous', 'Précédent')}
                    </Button>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-100">1</span>
                    <span className="px-2 text-slate-500">/ 13</span>
                    <Button size="sm" variant="outline" className="rounded-full border-slate-700 text-slate-300 bg-slate-900/80">
                      {getLocalizedText('التالي', 'Next', 'Suivant')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-slate-950/80 rounded-3xl shadow-[0_24px_70px_rgba(15,23,42,1)] border border-cyan-500/40 p-6 md:p-8 backdrop-blur-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-cyan-600/60 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    <Image className="h-7 w-7 text-cyan-50" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-50">
                      {getLocalizedText('إدارة محتوى الهيدر', 'Hero Content Management', 'Gestion du Contenu Hero')}
                    </h3>
                    <p className="text-sm text-slate-300 max-w-xl">
                      {getLocalizedText(
                        'قم بتعديل صور الخلفية والنصوص في الهيدر الرئيسي للموقع',
                        'Edit background images and texts in the main site header',
                        'Modifiez les images de fond et les textes dans l\'en-tête principal du site'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero Content Editor */}
              {heroContent && (
                <div className="bg-slate-950/80 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,1)] border border-white/10 p-6 backdrop-blur-3xl">
                  <div className="space-y-6">
                    {/* Background Images Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <Image className="h-5 w-5 text-cyan-400" />
                        {getLocalizedText('صور الخلفية', 'Background Images', 'Images de Fond')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {heroContent.headerImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative h-48 rounded-xl overflow-hidden border-2 border-white/10">
                              <img
                                src={image}
                                alt={`Hero image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {index > 0 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                                    onClick={() => {
                                      const newImages = [...heroContent.headerImages];
                                      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
                                      setHeroContent({ ...heroContent, headerImages: newImages });
                                    }}
                                    title={getLocalizedText('نقل للأعلى', 'Move Up', 'Déplacer vers le haut')}
                                  >
                                    ↑
                                  </Button>
                                )}
                                {index < heroContent.headerImages.length - 1 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                                    onClick={() => {
                                      const newImages = [...heroContent.headerImages];
                                      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
                                      setHeroContent({ ...heroContent, headerImages: newImages });
                                    }}
                                    title={getLocalizedText('نقل للأسفل', 'Move Down', 'Déplacer vers le bas')}
                                  >
                                    ↓
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    const newImages = heroContent.headerImages.filter((_, i) => i !== index);
                                    setHeroContent({ ...heroContent, headerImages: newImages });
                                  }}
                                  title={getLocalizedText('حذف الصورة', 'Delete Image', 'Supprimer l\'image')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 text-center">
                              {getLocalizedText('صورة', 'Image', 'Image')} {index + 1}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          {getLocalizedText('إضافة صورة جديدة', 'Add New Image', 'Ajouter une Nouvelle Image')}
                        </label>
                        <div className="flex gap-4">
                          <Input
                            type="url"
                            placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                            className="flex-1 bg-slate-900/60 border-white/10 text-slate-100"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement;
                                if (input.value.trim()) {
                                  setHeroContent({
                                    ...heroContent,
                                    headerImages: [...heroContent.headerImages, input.value.trim()]
                                  });
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <label className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            {getLocalizedText('رفع من الجهاز', 'Upload', 'Télécharger')}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const base64 = event.target?.result as string;
                                    setHeroContent({
                                      ...heroContent,
                                      headerImages: [...heroContent.headerImages, base64]
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Text Content Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cyan-400" />
                        {getLocalizedText('النصوص', 'Texts', 'Textes')}
                      </h4>

                      {/* Hero Title */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('العنوان الرئيسي (عربي)', 'Main Title (Arabic)', 'Titre Principal (Arabe)')}
                          </label>
                          <Input
                            value={heroContent.heroTitle.ar}
                            onChange={(e) => setHeroContent({ ...heroContent, heroTitle: { ...heroContent.heroTitle, ar: e.target.value } })}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('العنوان الرئيسي (إنجليزي)', 'Main Title (English)', 'Titre Principal (Anglais)')}
                          </label>
                          <Input
                            value={heroContent.heroTitle.en}
                            onChange={(e) => setHeroContent({ ...heroContent, heroTitle: { ...heroContent.heroTitle, en: e.target.value } })}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('العنوان الرئيسي (فرنسي)', 'Main Title (French)', 'Titre Principal (Français)')}
                          </label>
                          <Input
                            value={heroContent.heroTitle.fr}
                            onChange={(e) => setHeroContent({ ...heroContent, heroTitle: { ...heroContent.heroTitle, fr: e.target.value } })}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                      </div>

                      {/* Hero Subtitle */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('العنوان الفرعي (عربي)', 'Subtitle (Arabic)', 'Sous-titre (Arabe)')}
                          </label>
                          <Input
                            value={heroContent.heroSubtitle.ar}
                            onChange={(e) => setHeroContent({ ...heroContent, heroSubtitle: { ...heroContent.heroSubtitle, ar: e.target.value } })}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('العنوان الفرعي (إنجليزي)', 'Subtitle (English)', 'Sous-titre (Anglais)')}
                          </label>
                          <Input
                            value={heroContent.heroSubtitle.en}
                            onChange={(e) => setHeroContent({ ...heroContent, heroSubtitle: { ...heroContent.heroSubtitle, en: e.target.value } })}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('العنوان الفرعي (فرنسي)', 'Subtitle (French)', 'Sous-titre (Français)')}
                          </label>
                          <Input
                            value={heroContent.heroSubtitle.fr}
                            onChange={(e) => setHeroContent({ ...heroContent, heroSubtitle: { ...heroContent.heroSubtitle, fr: e.target.value } })}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                      </div>

                      {/* Hero Description */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('الوصف (عربي)', 'Description (Arabic)', 'Description (Arabe)')}
                          </label>
                          <Textarea
                            value={heroContent.heroDescription.ar}
                            onChange={(e) => setHeroContent({ ...heroContent, heroDescription: { ...heroContent.heroDescription, ar: e.target.value } })}
                            rows={3}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('الوصف (إنجليزي)', 'Description (English)', 'Description (Anglais)')}
                          </label>
                          <Textarea
                            value={heroContent.heroDescription.en}
                            onChange={(e) => setHeroContent({ ...heroContent, heroDescription: { ...heroContent.heroDescription, en: e.target.value } })}
                            rows={3}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('الوصف (فرنسي)', 'Description (French)', 'Description (Français)')}
                          </label>
                          <Textarea
                            value={heroContent.heroDescription.fr}
                            onChange={(e) => setHeroContent({ ...heroContent, heroDescription: { ...heroContent.heroDescription, fr: e.target.value } })}
                            rows={3}
                            className="bg-slate-900/60 border-white/10 text-slate-100"
                          />
                        </div>
                      </div>

                      {/* Button Texts */}
                      <div className="space-y-4">
                        <h5 className="text-md font-semibold text-slate-100 mt-4">
                          {getLocalizedText('نصوص الأزرار', 'Button Texts', 'Textes des Boutons')}
                        </h5>
                        
                        {/* Primary Button Text */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                              {getLocalizedText('نص الزر الرئيسي (عربي)', 'Primary Button Text (Arabic)', 'Texte Bouton Principal (Arabe)')}
                            </label>
                            <Input
                              value={heroContent.primaryButtonText.ar}
                              onChange={(e) => setHeroContent({ ...heroContent, primaryButtonText: { ...heroContent.primaryButtonText, ar: e.target.value } })}
                              className="bg-slate-900/60 border-white/10 text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                              {getLocalizedText('نص الزر الرئيسي (إنجليزي)', 'Primary Button Text (English)', 'Texte Bouton Principal (Anglais)')}
                            </label>
                            <Input
                              value={heroContent.primaryButtonText.en}
                              onChange={(e) => setHeroContent({ ...heroContent, primaryButtonText: { ...heroContent.primaryButtonText, en: e.target.value } })}
                              className="bg-slate-900/60 border-white/10 text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                              {getLocalizedText('نص الزر الرئيسي (فرنسي)', 'Primary Button Text (French)', 'Texte Bouton Principal (Français)')}
                            </label>
                            <Input
                              value={heroContent.primaryButtonText.fr}
                              onChange={(e) => setHeroContent({ ...heroContent, primaryButtonText: { ...heroContent.primaryButtonText, fr: e.target.value } })}
                              className="bg-slate-900/60 border-white/10 text-slate-100"
                            />
                          </div>
                        </div>

                        {/* Secondary Button Text */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                              {getLocalizedText('نص الزر الثانوي (عربي)', 'Secondary Button Text (Arabic)', 'Texte Bouton Secondaire (Arabe)')}
                            </label>
                            <Input
                              value={heroContent.secondaryButtonText.ar}
                              onChange={(e) => setHeroContent({ ...heroContent, secondaryButtonText: { ...heroContent.secondaryButtonText, ar: e.target.value } })}
                              className="bg-slate-900/60 border-white/10 text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                              {getLocalizedText('نص الزر الثانوي (إنجليزي)', 'Secondary Button Text (English)', 'Texte Bouton Secondaire (Anglais)')}
                            </label>
                            <Input
                              value={heroContent.secondaryButtonText.en}
                              onChange={(e) => setHeroContent({ ...heroContent, secondaryButtonText: { ...heroContent.secondaryButtonText, en: e.target.value } })}
                              className="bg-slate-900/60 border-white/10 text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                              {getLocalizedText('نص الزر الثانوي (فرنسي)', 'Secondary Button Text (French)', 'Texte Bouton Secondaire (Français)')}
                            </label>
                            <Input
                              value={heroContent.secondaryButtonText.fr}
                              onChange={(e) => setHeroContent({ ...heroContent, secondaryButtonText: { ...heroContent.secondaryButtonText, fr: e.target.value } })}
                              className="bg-slate-900/60 border-white/10 text-slate-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center gap-3 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (confirm(getLocalizedText(
                            'هل أنت متأكد من إعادة تعيين محتوى الهيدر للقيم الافتراضية؟',
                            'Are you sure you want to reset hero content to default values?',
                            'Êtes-vous sûr de vouloir réinitialiser le contenu hero aux valeurs par défaut?'
                          ))) {
                            const defaultHeroContent: HeroContent = {
                              headerImages: [
                                'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg',
                                'https://images.pexels.com/photos/5117917/pexels-photo-5117917.jpeg',
                                'https://images.pexels.com/photos/4669408/pexels-photo-4669408.jpeg',
                                'https://images.pexels.com/photos/11542516/pexels-photo-11542516.jpeg',
                                'https://images.pexels.com/photos/33388483/pexels-photo-33388483.jpeg',
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
                            setHeroContent(defaultHeroContent);
                          }
                        }}
                        className="border-white/20 text-slate-300 hover:bg-white/10"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {getLocalizedText('إعادة التعيين', 'Reset to Default', 'Réinitialiser')}
                      </Button>
                      
                      <Button
                        onClick={async () => {
                          if (heroContent && await dataManager.saveHeroContentAsync(heroContent)) {
                            alert(getLocalizedText('تم حفظ التغييرات بنجاح!', 'Changes saved successfully!', 'Modifications enregistrées avec succès!'));
                            await loadData();
                          } else {
                            alert(getLocalizedText('حدث خطأ أثناء الحفظ!', 'Error saving changes!', 'Erreur lors de l\'enregistrement!'));
                          }
                        }}
                        className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-lg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {getLocalizedText('حفظ التغييرات', 'Save Changes', 'Enregistrer les Modifications')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* 1-4: General settings */}
                <div className="bg-slate-950/80 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,1)] border border-slate-500/40 p-6 backdrop-blur-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-500/40 to-slate-300/40 rounded-xl flex items-center justify-center">
                      <Settings className="h-5 w-5 text-slate-100" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {getLocalizedText('إعدادات عامة', 'General Settings', 'Paramètres Généraux')}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {getLocalizedText('التحكم في الإعدادات الأساسية للنظام', 'Control core system preferences', 'Contrôlez les préférences principales du système')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 text-xs text-slate-200">
                    {/* 1 */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('تفعيل وضع الصيانة', 'Maintenance mode', 'Mode Maintenance')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('إيقاف الواجهة الأمامية أثناء أعمال الصيانة', 'Disable public site during maintenance', 'Désactiver le site public pendant la maintenance')}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    {/* 2 */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('إظهار شريط التنبيه العلوي', 'Show top announcement bar', 'Afficher la barre d\'annonce')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('استخدمه لإظهار رسائل مهمة للزوار', 'Use it to show important messages to visitors', 'Utilisez-le pour afficher des messages importants')}
                        </p>
                      </div>
                      <Switch 
                        checked={settings?.showTopAnnouncement || settings?.announcementBar?.enabled || false}
                        onCheckedChange={(checked) => {
                          if (settings) {
                            setSettings({
                              ...settings,
                              showTopAnnouncement: checked,
                              announcementBar: {
                                ...(settings.announcementBar || { texts: [], speed: 30 }),
                                enabled: checked,
                              },
                            });
                          }
                        }}
                      />
                    </div>
                    {/* 3 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-full">
                        <p className="font-medium">
                          {getLocalizedText('عنوان الموقع الرئيسي', 'Main site title', 'Titre Principal du Site')}
                        </p>
                        <Input
                          className="mt-1 bg-slate-900/60 border-white/10 text-slate-100 text-xs"
                          placeholder={getLocalizedText('مثال: منصة ciar للسياحة', 'e.g. ciar Travel Platform', 'ex. Plateforme de Voyage ciar')}
                        />
                      </div>
                    </div>
                    {/* 4 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-full">
                        <p className="font-medium">
                          {getLocalizedText('وصف ميتا للموقع', 'Site meta description', 'Description Méta du Site')}
                        </p>
                        <Textarea
                          rows={3}
                          className="mt-1 bg-slate-900/60 border-white/10 text-slate-100 text-xs"
                          placeholder={getLocalizedText('وصف قصير لتحسين نتائج محركات البحث', 'Short description for SEO', 'Courte description pour le SEO')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Announcement Bar Settings */}
                <div className="xl:col-span-3 bg-slate-950/80 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,1)] border border-cyan-500/40 p-6 backdrop-blur-3xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/40 to-cyan-300/40 rounded-xl flex items-center justify-center">
                      <Bell className="h-5 w-5 text-cyan-100" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {getLocalizedText('إدارة الشريط الإخباري', 'Announcement Bar Management', 'Gestion de la Barre d\'Annonce')}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {getLocalizedText('تخصيص الشريط الإخباري العلوي للموقع', 'Customize the top announcement bar', 'Personnalisez la barre d\'annonce supérieure')}
                      </p>
                    </div>
                  </div>

                  {settings && (
                    <div className="space-y-6">
                      {/* Enable/Disable */}
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-100">
                            {getLocalizedText('تفعيل الشريط الإخباري', 'Enable Announcement Bar', 'Activer la Barre d\'Annonce')}
                          </p>
                          <p className="text-slate-400 text-xs mt-1">
                            {getLocalizedText('إظهار الشريط الإخباري المتحرك في أعلى الصفحة', 'Show scrolling announcement bar at top of page', 'Afficher la barre d\'annonce défilante en haut de la page')}
                          </p>
                        </div>
                        <Switch
                          checked={settings.announcementBar?.enabled ?? settings.showTopAnnouncement ?? false}
                          onCheckedChange={(checked) => {
                            setSettings({
                              ...settings,
                              showTopAnnouncement: checked,
                              announcementBar: {
                                ...(settings.announcementBar || {
                                  texts: [],
                                  speed: 30
                                }),
                                enabled: checked
                              }
                            });
                          }}
                        />
                      </div>

                      {/* Speed Control */}
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          {getLocalizedText('سرعة حركة الشريط', 'Ticker scroll speed', 'Vitesse du défilement')}
                        </label>
                        <p className="text-xs text-slate-400 mb-2">
                          {getLocalizedText('اختر السرعة المناسبة لقراءة الزوار', 'Choose a speed that is easy to read', 'Choisissez une vitesse facile à lire')}
                        </p>
                        <select
                          value={settings.announcementBar?.speed || 30}
                          onChange={(e) => {
                            const speed = parseInt(e.target.value, 10) || 30;
                            setSettings({
                              ...settings,
                              announcementBar: {
                                ...(settings.announcementBar || {
                                  enabled: false,
                                  texts: [],
                                  speed: 30
                                }),
                                speed
                              }
                            });
                          }}
                          className="w-full bg-slate-900/60 border border-white/10 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400"
                        >
                          {ANNOUNCEMENT_SPEED_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {getLocalizedText(option.label.ar, option.label.en, option.label.fr)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Appearance Controls */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('مظهر الشريط', 'Bar appearance', 'Apparence de la barre')}
                          </label>
                          <p className="text-xs text-slate-400 mb-2">
                            {getLocalizedText('اختر نمطاً جاهزاً بألوان متناسقة', 'Pick a ready-made color style', 'Choisissez un style prêt à l\'emploi')}
                          </p>
                          <select
                            value={(() => {
                              const bar = settings.announcementBar;
                              const match = (Object.entries(ANNOUNCEMENT_THEMES) as [AnnouncementThemeId, typeof ANNOUNCEMENT_THEMES.ciar][]).find(
                                ([, theme]) =>
                                  (bar?.backgroundFrom || ANNOUNCEMENT_THEMES.ciar.backgroundFrom) === theme.backgroundFrom &&
                                  (bar?.backgroundTo || ANNOUNCEMENT_THEMES.ciar.backgroundTo) === theme.backgroundTo &&
                                  (bar?.textColor || ANNOUNCEMENT_THEMES.ciar.textColor) === theme.textColor &&
                                  (bar?.accentColor || ANNOUNCEMENT_THEMES.ciar.accentColor) === theme.accentColor
                              );
                              return match?.[0] || 'ciar';
                            })()}
                            onChange={(e) => {
                              const theme = ANNOUNCEMENT_THEMES[e.target.value as AnnouncementThemeId];
                              if (!theme) return;
                              setSettings({
                                ...settings,
                                announcementBar: {
                                  ...(settings.announcementBar || { enabled: false, texts: [], speed: 30 }),
                                  backgroundFrom: theme.backgroundFrom,
                                  backgroundTo: theme.backgroundTo,
                                  textColor: theme.textColor,
                                  accentColor: theme.accentColor,
                                },
                              });
                            }}
                            className="w-full bg-slate-900/60 border border-white/10 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400"
                          >
                            {(Object.entries(ANNOUNCEMENT_THEMES) as [AnnouncementThemeId, typeof ANNOUNCEMENT_THEMES.ciar][]).map(([id, theme]) => (
                              <option key={id} value={id}>
                                {getLocalizedText(theme.label.ar, theme.label.en, theme.label.fr)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            {getLocalizedText('حجم خط الشريط', 'Ticker font size', 'Taille du texte')}
                          </label>
                          <select
                            value={settings.announcementBar?.fontSize || 16}
                            onChange={(e) => {
                              const fontSize = parseInt(e.target.value, 10) || 16;
                              setSettings({
                                ...settings,
                                announcementBar: {
                                  ...(settings.announcementBar || { enabled: false, texts: [], speed: 30 }),
                                  fontSize,
                                },
                              });
                            }}
                            className="w-full bg-slate-900/60 border border-white/10 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400"
                          >
                            {ANNOUNCEMENT_FONT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {getLocalizedText(option.label.ar, option.label.en, option.label.fr)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-4 space-y-3">
                          <p className="text-sm font-medium text-slate-100">
                            {getLocalizedText('تعديل الألوان يدوياً (اختياري)', 'Custom colors (optional)', 'Couleurs personnalisées (optionnel)')}
                          </p>
                          <p className="text-xs text-slate-400">
                            {getLocalizedText('اضغط على المربع الملوّن واختر اللون الذي تريده', 'Tap the colored box to pick a color', 'Appuyez sur la case colorée pour choisir')}
                          </p>
                          <div className="grid md:grid-cols-2 gap-3">
                            <FriendlyColorPicker
                              label={getLocalizedText('لون النص', 'Text color', 'Couleur du texte')}
                              hint={getLocalizedText('لون كتابة العبارات', 'Color of the messages', 'Couleur des messages')}
                              value={settings.announcementBar?.textColor || '#ffffff'}
                              onChange={(textColor) => setSettings({
                                ...settings,
                                announcementBar: {
                                  ...(settings.announcementBar || { enabled: false, texts: [], speed: 30 }),
                                  textColor,
                                },
                              })}
                            />
                            <FriendlyColorPicker
                              label={getLocalizedText('لون الخلفية الأول', 'First background color', 'Première couleur de fond')}
                              value={settings.announcementBar?.backgroundFrom || '#1e3a5f'}
                              onChange={(backgroundFrom) => setSettings({
                                ...settings,
                                announcementBar: {
                                  ...(settings.announcementBar || { enabled: false, texts: [], speed: 30 }),
                                  backgroundFrom,
                                },
                              })}
                            />
                            <FriendlyColorPicker
                              label={getLocalizedText('لون الخلفية الثاني', 'Second background color', 'Deuxième couleur de fond')}
                              value={settings.announcementBar?.backgroundTo || '#0f2744'}
                              onChange={(backgroundTo) => setSettings({
                                ...settings,
                                announcementBar: {
                                  ...(settings.announcementBar || { enabled: false, texts: [], speed: 30 }),
                                  backgroundTo,
                                },
                              })}
                            />
                            <FriendlyColorPicker
                              label={getLocalizedText('لون النقطة بين العبارات', 'Dot between messages', 'Point entre les messages')}
                              value={settings.announcementBar?.accentColor || '#f97316'}
                              onChange={(accentColor) => setSettings({
                                ...settings,
                                announcementBar: {
                                  ...(settings.announcementBar || { enabled: false, texts: [], speed: 30 }),
                                  accentColor,
                                },
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Live Preview */}
                      <div>
                        <label className="block text-xs font-medium text-slate-200 mb-2">
                          {getLocalizedText('معاينة الشريط', 'Bar Preview', 'Aperçu de la Barre')}
                        </label>
                        <div
                          className="rounded-lg py-3 px-4 overflow-hidden border border-white/10"
                          style={{
                            background: `linear-gradient(to right, ${settings.announcementBar?.backgroundFrom || '#1e3a5f'}, ${settings.announcementBar?.backgroundTo || '#0f2744'})`,
                            color: settings.announcementBar?.textColor || '#ffffff',
                            fontSize: `${settings.announcementBar?.fontSize || 16}px`,
                          }}
                        >
                          {(settings.announcementBar?.texts || []).find((t) => t.text.ar || t.text.en || t.text.fr)?.text.ar
                            || getLocalizedText('مرحباً بكم في منصة ciar للسياحة', 'Welcome to ciar Travel Platform', 'Bienvenue sur la Plateforme de Voyage ciar')}
                          <span style={{ color: settings.announcementBar?.accentColor || '#f97316' }}> • </span>
                          {getLocalizedText('احصل على أفضل العروض السياحية', 'Get the best travel offers', 'Obtenez les meilleures offres de voyage')}
                        </div>
                      </div>

                      {/* Announcement Texts List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-100">
                            {getLocalizedText('نصوص الشريط الإخباري', 'Announcement Texts', 'Textes de la Barre d\'Annonce')}
                          </h4>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const newId = Date.now().toString();
                              const newText = {
                                id: newId,
                                text: {
                                  ar: '',
                                  en: '',
                                  fr: ''
                                }
                              };
                              setSettings({
                                ...settings,
                                announcementBar: {
                                  ...(settings.announcementBar || {
                                    enabled: false,
                                    texts: [],
                                    speed: 30
                                  }),
                                  texts: [...(settings.announcementBar?.texts || []), newText]
                                }
                              });
                            }}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {getLocalizedText('إضافة نص', 'Add Text', 'Ajouter un Texte')}
                          </Button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {(settings.announcementBar?.texts || []).map((announcement, index) => (
                            <div key={announcement.id} className="bg-slate-900/60 border border-white/10 rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-300">
                                  {getLocalizedText(`نص ${index + 1}`, `Text ${index + 1}`, `Texte ${index + 1}`)}
                                </span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const updatedTexts = (settings.announcementBar?.texts || []).filter(
                                      (t) => t.id !== announcement.id
                                    );
                                    setSettings({
                                      ...settings,
                                      announcementBar: {
                                        ...(settings.announcementBar || {
                                          enabled: false,
                                          texts: [],
                                          speed: 30
                                        }),
                                        texts: updatedTexts
                                      }
                                    });
                                  }}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid md:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-slate-200 mb-1">
                                    {getLocalizedText('عربي', 'Arabic', 'Arabe')}
                                  </label>
                                  <Input
                                    value={announcement.text.ar}
                                    onChange={(e) => {
                                      const updatedTexts = (settings.announcementBar?.texts || []).map((t) =>
                                        t.id === announcement.id
                                          ? { ...t, text: { ...t.text, ar: e.target.value } }
                                          : t
                                      );
                                      setSettings({
                                        ...settings,
                                        announcementBar: {
                                          ...(settings.announcementBar || {
                                            enabled: false,
                                            texts: [],
                                            speed: 30
                                          }),
                                          texts: updatedTexts
                                        }
                                      });
                                    }}
                                    className="bg-slate-800/60 border-white/10 text-slate-100 text-xs"
                                    placeholder={getLocalizedText('أدخل النص', 'Enter text', 'Entrez le texte')}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-200 mb-1">
                                    {getLocalizedText('إنجليزي', 'English', 'Anglais')}
                                  </label>
                                  <Input
                                    value={announcement.text.en}
                                    onChange={(e) => {
                                      const updatedTexts = (settings.announcementBar?.texts || []).map((t) =>
                                        t.id === announcement.id
                                          ? { ...t, text: { ...t.text, en: e.target.value } }
                                          : t
                                      );
                                      setSettings({
                                        ...settings,
                                        announcementBar: {
                                          ...(settings.announcementBar || {
                                            enabled: false,
                                            texts: [],
                                            speed: 30
                                          }),
                                          texts: updatedTexts
                                        }
                                      });
                                    }}
                                    className="bg-slate-800/60 border-white/10 text-slate-100 text-xs"
                                    placeholder={getLocalizedText('Enter text', 'Enter text', 'Entrez le texte')}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-200 mb-1">
                                    {getLocalizedText('فرنسي', 'French', 'Français')}
                                  </label>
                                  <Input
                                    value={announcement.text.fr}
                                    onChange={(e) => {
                                      const updatedTexts = (settings.announcementBar?.texts || []).map((t) =>
                                        t.id === announcement.id
                                          ? { ...t, text: { ...t.text, fr: e.target.value } }
                                          : t
                                      );
                                      setSettings({
                                        ...settings,
                                        announcementBar: {
                                          ...(settings.announcementBar || {
                                            enabled: false,
                                            texts: [],
                                            speed: 30
                                          }),
                                          texts: updatedTexts
                                        }
                                      });
                                    }}
                                    className="bg-slate-800/60 border-white/10 text-slate-100 text-xs"
                                    placeholder={getLocalizedText('Entrez le texte', 'Enter text', 'Entrez le texte')}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!settings.announcementBar?.texts || settings.announcementBar.texts.length === 0) && (
                            <div className="text-center py-8 text-slate-400 text-sm">
                              {getLocalizedText('لا توجد نصوص. اضغط على "إضافة نص" لإضافة نص جديد.', 'No texts. Click "Add Text" to add a new text.', 'Aucun texte. Cliquez sur "Ajouter un Texte" pour ajouter un nouveau texte.')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-4 border-t border-white/10">
                        <Button
                          onClick={async () => {
                            if (settings && await dataManager.saveSettingsAsync(settings)) {
                              // Dispatch custom event to notify AnnouncementBar of changes
                              window.dispatchEvent(new Event('settingsUpdated'));
                              alert(getLocalizedText('تم حفظ الإعدادات بنجاح!', 'Settings saved successfully!', 'Paramètres enregistrés avec succès!'));
                              loadData();
                            } else {
                              alert(getLocalizedText('حدث خطأ أثناء الحفظ!', 'Error saving settings!', 'Erreur lors de l\'enregistrement!'));
                            }
                          }}
                          className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-lg"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {getLocalizedText('حفظ إعدادات الشريط', 'Save Announcement Bar', 'Enregistrer la Barre d\'Annonce')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5-7: Language & locale */}
                <div className="bg-slate-950/80 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,1)] border border-slate-500/40 p-6 backdrop-blur-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500/40 to-sky-300/40 rounded-xl flex items-center justify-center">
                      <Globe className="h-5 w-5 text-sky-100" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {getLocalizedText('اللغة والمنطقة', 'Language & Locale', 'Langue & Région')}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {getLocalizedText('إعدادات الترجمة والوقت والعملات', 'Translation, time & currency settings', 'Paramètres de traduction, heure et devise')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 text-xs text-slate-200">
                    {/* 5 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('اللغة الافتراضية للموقع', 'Default site language', 'Langue par Défaut')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('ستظهر هذه اللغة للزوار الجدد', 'Shown to new visitors by default', 'Affichée aux nouveaux visiteurs')}
                        </p>
                      </div>
                      <select className="bg-slate-900/60 border border-white/10 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none">
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    {/* 6 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('اكتشاف اللغة تلقائياً', 'Auto-detect language', 'Détection Automatique de la Langue')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('اعتماداً على لغة المتصفح أو الدولة', 'Based on browser language or country', 'Basé sur la langue du navigateur ou le pays')}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    {/* 7 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('تنسيق التاريخ والوقت', 'Date & time format', 'Format de Date & Heure')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('اختيار تنسيق العرض في لوحة التحكم والتقارير', 'Choose how to display in dashboard & reports', 'Choisissez le format pour le tableau de bord et les rapports')}
                        </p>
                      </div>
                      <select className="bg-slate-900/60 border border-white/10 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-slate-950/80 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,1)] border border-blue-500/40 p-6 backdrop-blur-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/40 to-blue-300/40 rounded-xl flex items-center justify-center">
                      <Globe2 className="h-5 w-5 text-blue-100" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {getLocalizedText('روابط وسائل التواصل', 'Social Media Links', 'Liens des Réseaux Sociaux')}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {getLocalizedText(
                          'أدخل بيانات التواصل وروابط حساباتك فقط — بدون رموز تقنية',
                          'Enter contact details and account links only — no technical codes',
                          'Saisissez les coordonnées et liens — sans codes techniques'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs text-slate-200">
                    <div>
                      <label className="block font-medium mb-1 flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-tarhal-orange" />
                        {getLocalizedText('البريد الإلكتروني', 'Email', 'Email')}
                      </label>
                      <Input
                        type="email"
                        value={settings?.contactEmail || ''}
                        onChange={(e) => settings && setSettings({ ...settings, contactEmail: e.target.value })}
                        className="bg-slate-900/60 border-white/10 text-slate-100 text-xs"
                        placeholder={getLocalizedText('مثال: azasnaa628@gmail.com', 'e.g. your@email.com', 'ex. votre@email.com')}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1 flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-tarhal-orange" />
                        {getLocalizedText('رقم التواصل', 'Phone', 'Téléphone')}
                      </label>
                      <Input
                        value={settings?.contactPhone || ''}
                        onChange={(e) => settings && setSettings({ ...settings, contactPhone: e.target.value })}
                        className="bg-slate-900/60 border-white/10 text-slate-100 text-xs"
                        placeholder={getLocalizedText('مثال: 00963993153333', 'e.g. 00963993153333', 'ex. 00963993153333')}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1 flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-green-400" />
                        {getLocalizedText('واتساب', 'WhatsApp', 'WhatsApp')}
                      </label>
                      <Input
                        value={settings?.contactWhatsapp || settings?.socialLinks?.whatsapp || ''}
                        onChange={(e) => settings && setSettings({
                          ...settings,
                          contactWhatsapp: e.target.value,
                          socialLinks: { ...settings.socialLinks, whatsapp: e.target.value },
                        })}
                        className="bg-slate-900/60 border-white/10 text-slate-100 text-xs"
                        placeholder={getLocalizedText('نفس رقم الهاتف أو رقم واتساب آخر', 'Same as phone or another WhatsApp number', 'Même numéro ou autre numéro WhatsApp')}
                      />
                    </div>

                    {SOCIAL_PLATFORMS.filter((p) => p.key !== 'whatsapp').map((platform) => (
                      <div key={platform.key}>
                        <label className="block font-medium mb-1">
                          {language === 'ar' ? platform.name.ar : language === 'fr' ? platform.name.fr : platform.name.en}
                        </label>
                        <Input
                          type="text"
                          value={settings?.socialLinks?.[platform.key] || ''}
                          onChange={(e) => {
                            if (settings) {
                              setSettings({
                                ...settings,
                                socialLinks: {
                                  ...settings.socialLinks,
                                  [platform.key]: e.target.value,
                                },
                              });
                            }
                          }}
                          className="bg-slate-900/60 border-white/10 text-slate-100 text-xs"
                          placeholder={getLocalizedText(
                            SOCIAL_LINK_PLACEHOLDERS[platform.key]?.ar || 'الصق رابط الحساب هنا',
                            SOCIAL_LINK_PLACEHOLDERS[platform.key]?.en || 'Paste account link here',
                            SOCIAL_LINK_PLACEHOLDERS[platform.key]?.fr || 'Collez le lien ici'
                          )}
                        />
                      </div>
                    ))}

                    {/* Save Button */}
                    <div className="pt-3 border-t border-white/10">
                      <Button
                        onClick={async () => {
                          if (settings && await dataManager.saveSettingsAsync(settings)) {
                            alert(getLocalizedText('تم حفظ روابط السوشيال ميديا بنجاح!', 'Social media links saved successfully!', 'Liens des réseaux sociaux enregistrés avec succès!'));
                            loadData();
                          } else {
                            alert(getLocalizedText('حدث خطأ أثناء الحفظ!', 'Error saving settings!', 'Erreur lors de l\'enregistrement!'));
                          }
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {getLocalizedText('حفظ الروابط', 'Save Links', 'Enregistrer les Liens')}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 8-10: Notifications */}
                <div className="bg-slate-950/80 rounded-3xl.shadow-[0_18px_45px_rgba(15,23,42,1)] border border-slate-500/40 p-6 backdrop-blur-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/40 to-emerald-300/40 rounded-xl flex items-center justify-center">
                      <Bell className="h-5 w-5 text-emerald-100" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {getLocalizedText('إعدادات الإشعارات', 'Notification Settings', 'Paramètres de Notification')}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {getLocalizedText('تحكم في كيفية إرسال التنبيهات للأدمن والمستخدمين', 'Control how alerts are sent to admins and users', 'Contrôlez la manière dont les alertes sont envoyées')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 text-xs text-slate-200">
                    {/* 8 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('إشعارات البريد الإلكتروني', 'Email notifications', 'Notifications par Email')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('استقبال بريد عند كل حجز جديد', 'Receive email on every new booking', 'Recevoir un email pour chaque nouvelle réservation')}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    {/* 9 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('ملخص يومي للأداء', 'Daily performance digest', 'Résumé Quotidien des Performances')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('إرسال تقرير مختصر يومي للأدمن', 'Send daily summary to admin email', 'Envoyer un résumé quotidien à l\'admin')}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    {/* 10 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-full">
                        <p className="font-medium">
                          {getLocalizedText('بريد التنبيهات الرئيسي', 'Primary alerts email', 'Email Principal d\'Alerte')}
                        </p>
                        <Input
                          type="email"
                          className="mt-1 bg-slate-900/60 border-white/10 text-slate-100 text-xs"
                          placeholder="admin@ciar.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 11-13: Security */}
                <div className="bg-slate-950/80 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,1)] border border-red-500/40 p-6 backdrop-blur-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500/40 to-red-300/40 rounded-xl flex items-center justify-center">
                      <Shield className="h-5 w-5 text-red-100" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {getLocalizedText('الأمان والصلاحيات', 'Security & Access', 'Sécurité & Accès')}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {getLocalizedText('حماية لوحة التحكم وإدارة تسجيل الدخول', 'Protect the dashboard and login access', 'Protégez le tableau de bord et l\'accès')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 text-xs text-slate-200">
                    {/* 11 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('تفعيل المصادقة الثنائية', 'Enable 2FA', 'Activer la 2FA')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('إضافة طبقة أمان إضافية لحسابات الأدمن', 'Add extra security layer for admin accounts', 'Ajouter une couche de sécurité pour les comptes admin')}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    {/* 12 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('قفل تلقائي للجلسة', 'Auto session lock', 'Verrouillage Automatique de Session')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('تسجيل خروج تلقائي بعد فترة من عدم النشاط', 'Auto logout after inactivity', 'Déconnexion automatique après inactivité')}
                        </p>
                      </div>
                      <select className="bg-slate-900/60 border border-white/10 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none">
                        <option>15 {getLocalizedText('دقيقة', 'min', 'min')}</option>
                        <option>30 {getLocalizedText('دقيقة', 'min', 'min')}</option>
                        <option>60 {getLocalizedText('دقيقة', 'min', 'min')}</option>
                      </select>
                    </div>
                    {/* 13 */}
                    <div className="flex items-center.justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('إخطار عند محاولات الدخول الفاشلة', 'Failed login alerts', 'Alertes de Connexion Échouée')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('إرسال تنبيه عند تجاوز الحد المسموح', 'Notify when limit is exceeded', 'Notifier lorsque la limite est dépassée')}
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                {/* 14-15: Backups & branding */}
                <div className="bg-slate-950/80 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,1)] border border-amber-500/40 p-6 backdrop-blur-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500/40 to-amber-300/40 rounded-xl flex items-center justify-center">
                      <Database className="h-5 w-5 text-amber-100" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {getLocalizedText('النسخ الاحتياطي والبيانات', 'Backups & Data', 'Sauvegardes & Données')}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {getLocalizedText('إدارة النسخ الاحتياطية وتصدير البيانات', 'Manage backups and data export', 'Gérer les sauvegardes et l\'export des données')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 text-xs text-slate-200">
                    {/* 14 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('نسخ احتياطي تلقائي يومي', 'Daily auto backup', 'Sauvegarde Quotidienne Auto')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('حفظ نسخة احتياطية من قاعدة البيانات كل يوم', 'Save database snapshot every day', 'Sauvegarder la.base de données chaque jour')}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    {/* 15 */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getLocalizedText('تصدير البيانات يدوياً', 'Manual data export', 'Export Manuel des Données')}
                        </p>
                        <p className="text-slate-400">
                          {getLocalizedText('تحميل ملف يحتوي على جميع البيانات الحالية', 'Download a file with all current data', 'Télécharger un fichier avec toutes les données')}
                        </p>
                      </div>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950" onClick={handleExportAdminData}>
                        <Download className="h-4 w-4 mr-1" />
                        {getLocalizedText('تصدير الآن', 'Export now', 'Exporter Maintenant')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      {/* Add Country Modal */}
      {isAddingCountry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="p-6 bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{getLocalizedText('إضافة دولة جديدة', 'Add New Country', 'Ajouter un Nouveau Pays')}</h3>
                <button
                  onClick={() => setIsAddingCountry(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الاسم بالعربية *', 'Arabic Name *', 'Nom en Arabe *')}</label>
                  <Input
                    value={newCountry.name?.ar || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, name: { ...newCountry.name!, ar: e.target.value } })}
                    placeholder={getLocalizedText('اسم الدولة بالعربية', 'Country name in Arabic', 'Nom du pays en arabe')}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الاسم بالإنجليزية *', 'English Name *', 'Nom en Anglais *')}</label>
                  <Input
                    value={newCountry.name?.en || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, name: { ...newCountry.name!, en: e.target.value } })}
                    placeholder="Country name in English"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الاسم بالفرنسية', 'French Name', 'Nom en Français')}</label>
                  <Input
                    value={newCountry.name?.fr || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, name: { ...newCountry.name!, fr: e.target.value } })}
                    placeholder="Nom du pays en français"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('القارة', 'Continent', 'Continent')}</label>
                  <select
                    value={newCountry.continent || 'asia'}
                    onChange={(e) => setNewCountry({ ...newCountry, continent: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                  >
                    <option value="africa">{getLocalizedText('أفريقيا', 'Africa', 'Afrique')}</option>
                    <option value="asia">{getLocalizedText('آسيا', 'Asia', 'Asie')}</option>
                    <option value="europe">{getLocalizedText('أوروبا', 'Europe', 'Europe')}</option>
                    <option value="america">{getLocalizedText('أمريكا', 'America', 'Amérique')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('صورة الدولة الرئيسية', 'Main Country Image', 'Image Principale du Pays')}</label>
                  <div className="flex gap-4">
                    <Input
                      type="url"
                      value={newCountry.mainImage || ''}
                      onChange={(e) => setNewCountry({ ...newCountry, mainImage: e.target.value })}
                      placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                      className="flex-1 rounded-xl"
                    />
                    <label className="px-4 py-2 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white rounded-xl cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {getLocalizedText('رفع من الجهاز', 'Upload from Device', 'Télécharger depuis l\'Appareil')}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              // Try to upload to server first
                              const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                              let imageUrl: string;
                              
                              try {
                                imageUrl = await uploadImageToServer(file);
                              } catch (uploadError) {
                                // Fallback to compressed base64
                                imageUrl = await compressImage(file);
                              }
                              
                              setNewCountry({ ...newCountry, mainImage: imageUrl });
                            } catch (error) {
                              console.error('Error processing image:', error);
                              alert(getLocalizedText('حدث خطأ أثناء معالجة الصورة', 'Error processing image', 'Erreur lors du traitement de l\'image'));
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {newCountry.mainImage && (
                    <div className="mt-2">
                      <img
                        src={newCountry.mainImage}
                        alt={getLocalizedText('صورة الدولة', 'Country Image', 'Image du Pays')}
                        className="w-full h-48 object-cover rounded-xl border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('وصف الدولة *', 'Country Description *', 'Description du Pays *')}</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Textarea
                    value={newCountry.description?.ar || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, description: { ...newCountry.description!, ar: e.target.value } })}
                    placeholder={getLocalizedText('وصف مفصل باللغة العربية...', 'Detailed description in Arabic...', 'Description détaillée en arabe...')}
                    rows={3}
                    className="rounded-xl"
                  />
                  <Textarea
                    value={newCountry.description?.en || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, description: { ...newCountry.description!, en: e.target.value } })}
                    placeholder="Detailed description in English..."
                    rows={3}
                    className="rounded-xl"
                  />
                  <Textarea
                    value={newCountry.description?.fr || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, description: { ...newCountry.description!, fr: e.target.value } })}
                    placeholder="Description détaillée en français..."
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العاصمة بالعربية', 'Capital in Arabic', 'Capitale en Arabe')}</label>
                  <Input
                    value={newCountry.capital?.ar || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, capital: { ...newCountry.capital!, ar: e.target.value } })}
                    placeholder={getLocalizedText('اسم العاصمة بالعربية', 'Capital name in Arabic', 'Nom de la capitale en arabe')}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العاصمة بالإنجليزية', 'Capital in English', 'Capitale en Anglais')}</label>
                  <Input
                    value={newCountry.capital?.en || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, capital: { ...newCountry.capital!, en: e.target.value } })}
                    placeholder="Capital name in English"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العاصمة بالفرنسية', 'Capital in French', 'Capitale en Français')}</label>
                  <Input
                    value={newCountry.capital?.fr || ''}
                    onChange={(e) => setNewCountry({ ...newCountry, capital: { ...newCountry.capital!, fr: e.target.value } })}
                    placeholder="Nom de la capitale en français"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('التقييم', 'Rating', 'Évaluation')}</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newCountry.rating || 4.5}
                    onChange={(e) => setNewCountry({ ...newCountry, rating: parseFloat(e.target.value) || 4.5 })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عدد الجولات', 'Number of Tours', 'Nombre de Circuits')}</label>
                  <Input
                    type="number"
                    min="0"
                    value={typeof newCountry.totalTours === "number" ? newCountry.totalTours : ""}
                    onChange={(e) => {
                      const num = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                      setNewCountry({ ...newCountry, totalTours: Number.isNaN(num) ? undefined : num });
                    }}
                    className="rounded-xl"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عدد المراجعات', 'Number of Reviews', 'Nombre d\'Avis')}</label>
                  <Input
                    type="number"
                    value={newCountry.totalReviews || 0}
                    onChange={(e) => setNewCountry({ ...newCountry, totalReviews: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Gallery Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">{getLocalizedText('معرض الصور', 'Image Gallery', 'Galerie d\'Images')}</label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                    className="flex-1 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          setNewCountry({ ...newCountry, gallery: [...(newCountry.gallery || []), input.value.trim()] });
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع صورة', 'Upload Image', 'Télécharger Image')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                            let imageUrl: string;
                            try {
                              imageUrl = await uploadImageToServer(file);
                            } catch (uploadError) {
                              imageUrl = await compressImage(file);
                            }
                            setNewCountry({ ...newCountry, gallery: [...(newCountry.gallery || []), imageUrl] });
                          } catch (error) {
                            console.error('Error processing image:', error);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {newCountry.gallery && newCountry.gallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {newCountry.gallery.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = newCountry.gallery?.filter((_, i) => i !== index) || [];
                            setNewCountry({ ...newCountry, gallery: newGallery });
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Videos Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('معرض الفيديوهات', 'Video Gallery', 'Galerie Vidéos')}</label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder={getLocalizedText('أدخل رابط الفيديو (YouTube, Vimeo, أو رابط مباشر)', 'Enter video URL (YouTube, Vimeo, or direct link)', 'Entrez l\'URL de la vidéo (YouTube, Vimeo, ou lien direct)')}
                      className="flex-1 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            setNewCountry({ ...newCountry, videos: [...(newCountry.videos || []), input.value.trim()] });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {getLocalizedText('رفع فيديو', 'Upload Video', 'Télécharger Vidéo')}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const { uploadVideoToServer, isValidVideoFile, getFileSizeMB } = await import('@/utils/videoUtils');
                              if (!isValidVideoFile(file)) {
                                alert(getLocalizedText('نوع الملف غير مدعوم. يرجى اختيار ملف فيديو.', 'File type not supported. Please select a video file.', 'Type de fichier non pris en charge. Veuillez sélectionner un fichier vidéo.'));
                                return;
                              }
                              const fileSizeMB = getFileSizeMB(file);
                              if (fileSizeMB > 100) {
                                alert(getLocalizedText('حجم الملف كبير جداً. الحد الأقصى 100 ميجابايت.', 'File size too large. Maximum 100MB.', 'Taille de fichier trop grande. Maximum 100 Mo.'));
                                return;
                              }
                              let videoUrl: string;
                              try {
                                videoUrl = await uploadVideoToServer(file);
                              } catch (uploadError) {
                                alert(getLocalizedText('فشل رفع الفيديو. يرجى المحاولة مرة أخرى أو استخدام رابط.', 'Failed to upload video. Please try again or use a link.', 'Échec du téléchargement de la vidéo. Veuillez réessayer ou utiliser un lien.'));
                                return;
                              }
                              setNewCountry({ ...newCountry, videos: [...(newCountry.videos || []), videoUrl] });
                            } catch (error) {
                              console.error('Error processing video:', error);
                              alert(getLocalizedText('حدث خطأ أثناء معالجة الفيديو', 'An error occurred while processing the video', 'Une erreur s\'est produite lors du traitement de la vidéo'));
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {newCountry.videos && newCountry.videos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {newCountry.videos.map((video, index) => (
                        <div key={index} className="relative group">
                          {video.includes('youtube.com') || video.includes('youtu.be') ? (
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <iframe
                                src={video.includes('youtube.com/embed') ? video : `https://www.youtube.com/embed/${video.split('/').pop()?.split('?')[0]}`}
                                className="w-full h-full rounded-lg"
                                allowFullScreen
                              />
                            </div>
                          ) : video.includes('vimeo.com') ? (
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <iframe
                                src={`https://player.vimeo.com/video/${video.split('/').pop()}`}
                                className="w-full h-full rounded-lg"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <video
                              src={video}
                              controls
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const newVideos = newCountry.videos?.filter((_, i) => i !== index) || [];
                              setNewCountry({ ...newCountry, videos: newVideos });
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCountry.isActive || false}
                    onChange={(e) => setNewCountry({ ...newCountry, isActive: e.target.checked })}
                    className="w-4 h-4 text-tarhal-orange bg-gray-100 border-gray-300 rounded focus:ring-tarhal-orange focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{getLocalizedText('دولة نشطة', 'Active Country', 'Pays Actif')}</span>
                </label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                onClick={handleAddCountry}
                className="flex-1 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                {getLocalizedText('حفظ الدولة', 'Save Country', 'Enregistrer le Pays')}
              </Button>
              <Button
                onClick={() => setIsAddingCountry(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                {getLocalizedText('إلغاء', 'Cancel', 'Annuler')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Office Modal */}
      {isAddingOffice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{getLocalizedText('إضافة مكتب سياحي جديد', 'Add New Travel Office', 'Ajouter un Nouveau Bureau de Voyage')}</h3>
                <button
                  onClick={() => setIsAddingOffice(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الدولة *', 'Country *', 'Pays *')}</label>
                <select
                  value={newOffice.countryId || ''}
                  onChange={(e) => setNewOffice({ ...newOffice, countryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{getLocalizedText('اختر الدولة', 'Select Country', 'Sélectionner le Pays')}</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name.ar} ({country.name.en})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('اسم المكتب بالعربية *', 'Office Name in Arabic *', 'Nom du Bureau en Arabe *')}</label>
                  <Input
                    value={newOffice.name?.ar || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, name: { ...newOffice.name!, ar: e.target.value } })}
                    placeholder={getLocalizedText('اسم المكتب بالعربية', 'Office name in Arabic', 'Nom du bureau en arabe')}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('اسم المكتب بالإنجليزية', 'Office Name in English', 'Nom du Bureau en Anglais')}</label>
                  <Input
                    value={newOffice.name?.en || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, name: { ...newOffice.name!, en: e.target.value } })}
                    placeholder="Office name in English"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('اسم المكتب بالفرنسية', 'Office Name in French', 'Nom du Bureau en Français')}</label>
                  <Input
                    value={newOffice.name?.fr || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, name: { ...newOffice.name!, fr: e.target.value } })}
                    placeholder="Nom du bureau en français"
                    className="rounded-xl"
                  />
                </div>
              </div> 

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العنوان بالعربية *', 'Address in Arabic *', 'Adresse en Arabe *')}</label>
                  <Input
                    value={newOffice.address?.ar || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, address: { ...newOffice.address!, ar: e.target.value } })}
                    placeholder={getLocalizedText('العنوان الكامل بالعربية', 'Full address in Arabic', 'Adresse complète en arabe')}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العنوان بالإنجليزية', 'Address in English', 'Adresse en Anglais')}</label>
                  <Input
                    value={newOffice.address?.en || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, address: { ...newOffice.address!, en: e.target.value } })}
                    placeholder="Full address in English"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العنوان بالفرنسية', 'Address in French', 'Adresse en Français')}</label>
                  <Input
                    value={newOffice.address?.fr || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, address: { ...newOffice.address!, fr: e.target.value } })}
                    placeholder="Adresse complète en français"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('رقم الهاتف *', 'Phone Number *', 'Numéro de Téléphone *')}</label>
                  <Input
                    value={newOffice.phone || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, phone: e.target.value })}
                    placeholder="+966 11 123 4567"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('البريد الإلكتروني *', 'Email *', 'Email *')}</label>
                  <Input
                    type="email"
                    value={newOffice.email || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, email: e.target.value })}
                    placeholder="office@example.com"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الموقع الإلكتروني', 'Website', 'Site Web')}</label>
                  <Input
                    type="url"
                    value={newOffice.website || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, website: e.target.value })}
                    placeholder="https://www.example.com"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getLocalizedText('صورة المكتب الرئيسية', 'Main Office Image', 'Image Principale du Bureau')}
                </label>
                <div className="flex gap-4">
                  <Input
                    type="url"
                    value={newOffice.imageUrl || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, imageUrl: e.target.value })}
                    placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                    className="flex-1 rounded-xl"
                  />
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع من الجهاز', 'Upload from Device', 'Télécharger depuis l\'Appareil')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            // Try to upload to server first
                            const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                            let imageUrl: string;
                            
                            try {
                              imageUrl = await uploadImageToServer(file);
                            } catch (uploadError) {
                              // Fallback to compressed base64
                              imageUrl = await compressImage(file);
                            }
                            
                            setNewOffice({ ...newOffice, imageUrl });
                          } catch (error) {
                            console.error('Error processing image:', error);
                            alert(getLocalizedText('حدث خطأ أثناء معالجة الصورة', 'Error processing image', 'Erreur lors du traitement de l\'image'));
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {newOffice.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={newOffice.imageUrl}
                      alt={getLocalizedText('صورة المكتب', 'Office Image', 'Image du Bureau')}
                      className="w-full h-48 object-cover rounded-xl border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}

                {/* Additional Images */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getLocalizedText('صور إضافية للمكتب', 'Additional Office Images', 'Images Supplémentaires du Bureau')}
                  </label>
                  <div className="flex gap-4 mb-4">
                    <Input
                      type="url"
                      placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                      className="flex-1 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            setNewOffice({
                              ...newOffice,
                              images: [...(newOffice.images || []), input.value.trim()]
                            });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {getLocalizedText('رفع من الجهاز', 'Upload', 'Télécharger')}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              // Try to upload to server first
                              const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                              let imageUrl: string;
                              
                              try {
                                imageUrl = await uploadImageToServer(file);
                              } catch (uploadError) {
                                // Fallback to compressed base64
                                imageUrl = await compressImage(file);
                              }
                              
                              setNewOffice({
                                ...newOffice,
                                images: [...(newOffice.images || []), imageUrl]
                              });
                            } catch (error) {
                              console.error('Error processing image:', error);
                              alert(getLocalizedText('حدث خطأ أثناء معالجة الصورة', 'Error processing image', 'Erreur lors du traitement de l\'image'));
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {newOffice.images && newOffice.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {newOffice.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`${getLocalizedText('صورة', 'Image', 'Image')} ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                            }}
                          />
                          <button
                            onClick={() => {
                              const newImages = newOffice.images?.filter((_, i) => i !== index) || [];
                              setNewOffice({ ...newOffice, images: newImages });
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={getLocalizedText('حذف الصورة', 'Delete Image', 'Supprimer l\'image')}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('اسم المدير بالعربية', 'Manager Name in Arabic', 'Nom du Manager en Arabe')}</label>
                  <Input
                    value={newOffice.manager?.ar || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, manager: { ...newOffice.manager!, ar: e.target.value } })}
                    placeholder={getLocalizedText('اسم مدير المكتب', 'Office manager name', 'Nom du gestionnaire du bureau')}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('اسم ال��دير بالإنجليزية', 'Manager Name in English', 'Nom du Manager en Anglais')}</label>
                  <Input
                    value={newOffice.manager?.en || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, manager: { ...newOffice.manager!, en: e.target.value } })}
                    placeholder="Office manager name"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('ساعات العمل بالعربية', 'Working Hours in Arabic', 'Heures de Travail en Arabe')}</label>
                  <Input
                    value={newOffice.workingHours?.ar || ''}
                    onChange={(e) => setNewOffice({ ...newOffice, workingHours: { ...newOffice.workingHours!, ar: e.target.value } })}
                    placeholder={getLocalizedText('السبت - الخميس: 9:00 - 18:00', 'Saturday - Thursday: 9:00 - 18:00', 'Samedi - Jeudi: 9:00 - 18:00')}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('التقييم', 'Rating', 'Évaluation')}</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newOffice.rating || 4.5}
                    onChange={(e) => setNewOffice({ ...newOffice, rating: parseFloat(e.target.value) || 4.5 })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عدد المراجعات', 'Number of Reviews', 'Nombre d\'Avis')}</label>
                  <Input
                    type="number"
                    value={newOffice.reviews || 0}
                    onChange={(e) => setNewOffice({ ...newOffice, reviews: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newOffice.isActive || false}
                    onChange={(e) => setNewOffice({ ...newOffice, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{getLocalizedText('مكتب نشط', 'Active Office', 'Bureau Actif')}</span>
                </label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                onClick={handleAddOffice}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                {getLocalizedText('حفظ المكتب', 'Save Office', 'Enregistrer le Bureau')}
              </Button>
              <Button
                onClick={() => setIsAddingOffice(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                {getLocalizedText('إلغاء', 'Cancel', 'Annuler')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Country Modal */}
      {editingCountry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{getLocalizedText('تعديل الدولة', 'Edit Country', 'Modifier le Pays')}</h3>
                <button
                  onClick={() => setEditingCountry(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الاسم بالعربية', 'Arabic Name', 'Nom en Arabe')}</label>
                  <Input
                    value={editingCountry.name.ar}
                    onChange={(e) => setEditingCountry({ ...editingCountry, name: { ...editingCountry.name, ar: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الاسم بالإنجليزية', 'English Name', 'Nom en Anglais')}</label>
                  <Input
                    value={editingCountry.name.en}
                    onChange={(e) => setEditingCountry({ ...editingCountry, name: { ...editingCountry.name, en: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('التقييم', 'Rating', 'Évaluation')}</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingCountry.rating}
                    onChange={(e) => setEditingCountry({ ...editingCountry, rating: parseFloat(e.target.value) || 4.5 })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عدد الجولات', 'Tours', 'Circuits')}</label>
                  <Input
                    type="number"
                    value={editingCountry.totalTours}
                    onChange={(e) => setEditingCountry({ ...editingCountry, totalTours: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عدد المراجعات', 'Reviews', 'Avis')}</label>
                  <Input
                    type="number"
                    value={editingCountry.totalReviews}
                    onChange={(e) => setEditingCountry({ ...editingCountry, totalReviews: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Main Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getLocalizedText('صورة الدولة الرئيسية', 'Main Country Image', 'Image Principale du Pays')}
                </label>
                <div className="flex gap-4">
                  <Input
                    type="url"
                    value={editingCountry.mainImage || ''}
                    onChange={(e) => setEditingCountry({ ...editingCountry, mainImage: e.target.value })}
                    placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                    className="flex-1 rounded-xl"
                  />
                  <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع من الجهاز', 'Upload from Device', 'Télécharger depuis l\'Appareil')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            // Try to upload to server first
                            const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                            let imageUrl: string;
                            
                            try {
                              imageUrl = await uploadImageToServer(file);
                            } catch (uploadError) {
                              // Fallback to compressed base64
                              imageUrl = await compressImage(file);
                            }
                            
                            setEditingCountry({ ...editingCountry, mainImage: imageUrl });
                          } catch (error) {
                            console.error('Error processing image:', error);
                            alert(getLocalizedText('حدث خطأ أثناء معالجة الصورة', 'Error processing image', 'Erreur lors du traitement de l\'image'));
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {editingCountry.mainImage && (
                  <div className="mt-2">
                    <img
                      src={editingCountry.mainImage}
                      alt={getLocalizedText('صورة الدولة', 'Country Image', 'Image du Pays')}
                      className="w-full h-48 object-cover rounded-xl border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الوصف بالعربية', 'Description in Arabic', 'Description en Arabe')}</label>
                <Textarea
                  value={editingCountry.description.ar}
                  onChange={(e) => setEditingCountry({ ...editingCountry, description: { ...editingCountry.description, ar: e.target.value } })}
                  rows={3}
                  className="rounded-xl"
                />
              </div>

              {/* Gallery Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">{getLocalizedText('معرض الصور', 'Image Gallery', 'Galerie d\'Images')}</label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                    className="flex-1 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          setEditingCountry({ ...editingCountry, gallery: [...(editingCountry.gallery || []), input.value.trim()] });
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع صورة', 'Upload Image', 'Télécharger Image')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                            let imageUrl: string;
                            try {
                              imageUrl = await uploadImageToServer(file);
                            } catch (uploadError) {
                              imageUrl = await compressImage(file);
                            }
                            setEditingCountry({ ...editingCountry, gallery: [...(editingCountry.gallery || []), imageUrl] });
                          } catch (error) {
                            console.error('Error processing image:', error);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {editingCountry.gallery && editingCountry.gallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {editingCountry.gallery.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = editingCountry.gallery?.filter((_, i) => i !== index) || [];
                            setEditingCountry({ ...editingCountry, gallery: newGallery });
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Videos Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('معرض الفيديوهات', 'Video Gallery', 'Galerie Vidéos')}</label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder={getLocalizedText('أدخل رابط الفيديو (YouTube, Vimeo, أو رابط مباشر)', 'Enter video URL (YouTube, Vimeo, or direct link)', 'Entrez l\'URL de la vidéo (YouTube, Vimeo, ou lien direct)')}
                      className="flex-1 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            setEditingCountry({ ...editingCountry, videos: [...(editingCountry.videos || []), input.value.trim()] });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {getLocalizedText('رفع فيديو', 'Upload Video', 'Télécharger Vidéo')}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const { uploadVideoToServer, isValidVideoFile, getFileSizeMB } = await import('@/utils/videoUtils');
                              if (!isValidVideoFile(file)) {
                                alert(getLocalizedText('نوع الملف غير مدعوم. يرجى اختيار ملف فيديو.', 'File type not supported. Please select a video file.', 'Type de fichier non pris en charge. Veuillez sélectionner un fichier vidéo.'));
                                return;
                              }
                              const fileSizeMB = getFileSizeMB(file);
                              if (fileSizeMB > 100) {
                                alert(getLocalizedText('حجم الملف كبير جداً. الحد الأقصى 100 ميجابايت.', 'File size too large. Maximum 100MB.', 'Taille de fichier trop grande. Maximum 100 Mo.'));
                                return;
                              }
                              let videoUrl: string;
                              try {
                                videoUrl = await uploadVideoToServer(file);
                              } catch (uploadError) {
                                alert(getLocalizedText('فشل رفع الفيديو. يرجى المحاولة مرة أخرى أو استخدام رابط.', 'Failed to upload video. Please try again or use a link.', 'Échec du téléchargement de la vidéo. Veuillez réessayer ou utiliser un lien.'));
                                return;
                              }
                              setEditingCountry({ ...editingCountry, videos: [...(editingCountry.videos || []), videoUrl] });
                            } catch (error) {
                              console.error('Error processing video:', error);
                              alert(getLocalizedText('حدث خطأ أثناء معالجة الفيديو', 'An error occurred while processing the video', 'Une erreur s\'est produite lors du traitement de la vidéo'));
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editingCountry.videos && editingCountry.videos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {editingCountry.videos.map((video, index) => (
                        <div key={index} className="relative group">
                          {video.includes('youtube.com') || video.includes('youtu.be') ? (
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <iframe
                                src={video.includes('youtube.com/embed') ? video : `https://www.youtube.com/embed/${video.split('/').pop()?.split('?')[0]}`}
                                className="w-full h-full rounded-lg"
                                allowFullScreen
                              />
                            </div>
                          ) : video.includes('vimeo.com') ? (
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <iframe
                                src={`https://player.vimeo.com/video/${video.split('/').pop()}`}
                                className="w-full h-full rounded-lg"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <video
                              src={video}
                              controls
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const newVideos = editingCountry.videos?.filter((_, i) => i !== index) || [];
                              setEditingCountry({ ...editingCountry, videos: newVideos });
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* إدارة المدن التابعة للدولة */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {getLocalizedText('المدن السياحية في هذه الدولة', 'Tourist cities in this country', 'Villes touristiques de ce pays')}
                  </h4>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                    onClick={() => {
                      const newCity: City = {
                        id: `city_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                        name: { ar: '', en: '', fr: '' },
                        description: { ar: '', en: '', fr: '' },
                        image: '',
                        attractions: { ar: [], en: [], fr: [] },
                        bestTime: { ar: '', en: '', fr: '' },
                        duration: { ar: '', en: '', fr: '' },
                        rating: 4.5,
                        reviews: 0,
                        highlights: { ar: [], en: [], fr: [] },
                        gallery: [],
                      };
                      setEditingCountry({
                        ...editingCountry,
                        cities: [...(editingCountry.cities || []), newCity],
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {getLocalizedText('إضافة مدينة', 'Add City', 'Ajouter une Ville')}
                  </Button>
                </div>

                {(editingCountry.cities || []).length === 0 && (
                  <p className="text-xs text-gray-500">
                    {getLocalizedText(
                      'لم يتم إضافة مدن بعد، يمكنك إضافة المدن السياحية الرئيسية في هذه الدولة.',
                      'No cities added yet. You can add the main tourist cities in this country.',
                      'Aucune ville ajoutée pour le moment. Vous pouvez ajouter les principales villes touristiques de ce pays.'
                    )}
                  </p>
                )}

                <div className="space-y-3">
                  {(editingCountry.cities || []).map((city, index) => (
                    <div
                      key={city.id || index}
                      className="border border-gray-200 rounded-2xl p-3 bg-gray-50/60 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-800">
                          {getLocalizedText('مدينة', 'City', 'Ville')} #{index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingCountry.cities || []).filter((c) => c.id !== city.id);
                            setEditingCountry({
                              ...editingCountry,
                              cities: updated,
                            });
                          }}
                          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          {getLocalizedText('حذف', 'Delete', 'Supprimer')}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          value={city.name.ar}
                          onChange={(e) => {
                            const updated = (editingCountry.cities || []).map((c) =>
                              c.id === city.id ? { ...c, name: { ...c.name, ar: e.target.value } } : c
                            );
                            setEditingCountry({
                              ...editingCountry,
                              cities: updated,
                            });
                          }}
                          placeholder={getLocalizedText('اسم المدينة بالعربية', 'City name in Arabic', 'Nom de la ville en arabe')}
                          className="rounded-xl text-xs"
                        />
                        <Input
                          value={city.name.en}
                          onChange={(e) => {
                            const updated = (editingCountry.cities || []).map((c) =>
                              c.id === city.id ? { ...c, name: { ...c.name, en: e.target.value } } : c
                            );
                            setEditingCountry({
                              ...editingCountry,
                              cities: updated,
                            });
                          }}
                          placeholder={getLocalizedText('City name in English', 'City name in English', 'Nom de la ville en anglais')}
                          className="rounded-xl text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={city.image}
                          onChange={(e) => {
                            const updated = (editingCountry.cities || []).map((c) =>
                              c.id === city.id ? { ...c, image: e.target.value } : c
                            );
                            setEditingCountry({
                              ...editingCountry,
                              cities: updated,
                            });
                          }}
                          placeholder={getLocalizedText(
                            'رابط صورة تعبر عن المدينة (اختياري)',
                            'Image URL for the city (optional)',
                            'URL d\'image pour la ville (optionnel)'
                          )}
                          className="rounded-xl text-xs flex-1"
                        />
                        <label className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center gap-1 text-xs">
                          <Upload className="h-3 w-3" />
                          {getLocalizedText('رفع', 'Upload', 'Télécharger')}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                                  let imageUrl: string;
                                  
                                  try {
                                    imageUrl = await uploadImageToServer(file);
                                  } catch (uploadError) {
                                    imageUrl = await compressImage(file);
                                  }
                                  
                                  const updated = (editingCountry.cities || []).map((c) =>
                                    c.id === city.id ? { ...c, image: imageUrl } : c
                                  );
                                  setEditingCountry({
                                    ...editingCountry,
                                    cities: updated,
                                  });
                                } catch (error) {
                                  console.error('Error processing image:', error);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCountry.isActive}
                    onChange={(e) => setEditingCountry({ ...editingCountry, isActive: e.target.checked })}
                    className="w-4 h-4 text-tarhal-orange bg-gray-100 border-gray-300 rounded focus:ring-tarhal-orange focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{getLocalizedText('دولة نشطة', 'Active Country', 'Pays Actif')}</span>
                </label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                onClick={handleUpdateCountry}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                {getLocalizedText('حفظ التغييرات', 'Save Changes', 'Enregistrer les Modifications')}
              </Button>
              <Button
                onClick={() => setEditingCountry(null)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                {getLocalizedText('��لغاء', 'Cancel', 'Annuler')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Office Modal */}
      {editingOffice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{getLocalizedText('تعديل المكتب السياحي', 'Edit Travel Office', 'Modifier le Bureau de Voyage')}</h3>
                <button
                  onClick={() => setEditingOffice(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('اسم المكتب ��العربية', 'Office Name in Arabic', 'Nom du Bureau en Arabe')}</label>
                  <Input
                    value={editingOffice.name.ar}
                    onChange={(e) => setEditingOffice({ ...editingOffice, name: { ...editingOffice.name, ar: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('اسم المكتب بالإنجليزية', 'Office Name in English', 'Nom du Bureau en Anglais')}</label>
                  <Input
                    value={editingOffice.name.en}
                    onChange={(e) => setEditingOffice({ ...editingOffice, name: { ...editingOffice.name, en: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('رقم الهاتف', 'Phone Number', 'Numéro de Téléphone')}</label>
                  <Input
                    value={editingOffice.phone}
                    onChange={(e) => setEditingOffice({ ...editingOffice, phone: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('البريد الإلكتروني', 'Email', 'Email')}</label>
                  <Input
                    type="email"
                    value={editingOffice.email}
                    onChange={(e) => setEditingOffice({ ...editingOffice, email: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العنوان بالعربية', 'Address in Arabic', 'Adresse en Arabe')}</label>
                <Input
                  value={editingOffice.address.ar}
                  onChange={(e) => setEditingOffice({ ...editingOffice, address: { ...editingOffice.address, ar: e.target.value } })}
                  className="rounded-xl"
                />
              </div>

              {/* Image Upload Section for Edit */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getLocalizedText('صورة المكتب الرئيسية', 'Main Office Image', 'Image Principale du Bureau')}
                </label>
                <div className="flex gap-4">
                  <Input
                    type="url"
                    value={editingOffice.imageUrl || ''}
                    onChange={(e) => setEditingOffice({ ...editingOffice, imageUrl: e.target.value })}
                    placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                    className="flex-1 rounded-xl"
                  />
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع من الجهاز', 'Upload from Device', 'Télécharger depuis l\'Appareil')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            // Try to upload to server first
                            const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                            let imageUrl: string;
                            
                            try {
                              imageUrl = await uploadImageToServer(file);
                            } catch (uploadError) {
                              // Fallback to compressed base64
                              imageUrl = await compressImage(file);
                            }
                            
                            setEditingOffice({ ...editingOffice, imageUrl });
                          } catch (error) {
                            console.error('Error processing image:', error);
                            alert(getLocalizedText('حدث خطأ أثناء معالجة الصورة', 'Error processing image', 'Erreur lors du traitement de l\'image'));
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {editingOffice.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={editingOffice.imageUrl}
                      alt={getLocalizedText('صورة المكتب', 'Office Image', 'Image du Bureau')}
                      className="w-full h-48 object-cover rounded-xl border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}

                {/* Additional Images for Edit */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getLocalizedText('صور إضافية للمكتب', 'Additional Office Images', 'Images Supplémentaires du Bureau')}
                  </label>
                  <div className="flex gap-4 mb-4">
                    <Input
                      type="url"
                      placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                      className="flex-1 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            setEditingOffice({
                              ...editingOffice,
                              images: [...(editingOffice.images || []), input.value.trim()]
                            });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {getLocalizedText('رفع من الجهاز', 'Upload', 'Télécharger')}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              // Try to upload to server first
                              const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                              let imageUrl: string;
                              
                              try {
                                imageUrl = await uploadImageToServer(file);
                              } catch (uploadError) {
                                // Fallback to compressed base64
                                imageUrl = await compressImage(file);
                              }
                              
                              setEditingOffice({
                                ...editingOffice,
                                images: [...(editingOffice.images || []), imageUrl]
                              });
                            } catch (error) {
                              console.error('Error processing image:', error);
                              alert(getLocalizedText('حدث خطأ أثناء معالجة الصورة', 'Error processing image', 'Erreur lors du traitement de l\'image'));
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editingOffice.images && editingOffice.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {editingOffice.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`${getLocalizedText('صورة', 'Image', 'Image')} ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                            }}
                          />
                          <button
                            onClick={() => {
                              const newImages = editingOffice.images?.filter((_, i) => i !== index) || [];
                              setEditingOffice({ ...editingOffice, images: newImages });
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={getLocalizedText('حذف الصورة', 'Delete Image', 'Supprimer l\'image')}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('التقييم', 'Rating', 'Évaluation')}</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingOffice.rating}
                    onChange={(e) => setEditingOffice({ ...editingOffice, rating: parseFloat(e.target.value) || 4.5 })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عدد المراجعات', 'Reviews', 'Avis')}</label>
                  <Input
                    type="number"
                    value={editingOffice.reviews}
                    onChange={(e) => setEditingOffice({ ...editingOffice, reviews: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffice.isActive}
                    onChange={(e) => setEditingOffice({ ...editingOffice, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{getLocalizedText('مكتب نشط', 'Active Office', 'Bureau Actif')}</span>
                </label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                onClick={handleUpdateOffice}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                {getLocalizedText('حفظ التغييرات', 'Save Changes', 'Enregistrer les Modifications')}
              </Button>
              <Button
                onClick={() => setEditingOffice(null)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                {getLocalizedText('إلغاء', 'Cancel', 'Annuler')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Offer Modal */}
      {isAddingOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="p-6 bg-gradient-to-r from-pink-600 to-pink-700 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{getLocalizedText('إضافة عرض سياحي جديد', 'Add New Tour Offer', 'Ajouter une Nouvelle Offre Touristique')}</h3>
                <button
                  onClick={() => setIsAddingOffer(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الدولة *', 'Country *', 'Pays *')}</label>
                <select
                  value={newOffer.countryId || ''}
                  onChange={(e) => setNewOffer({ ...newOffer, countryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">{getLocalizedText('اختر الدولة', 'Select Country', 'Sélectionner le Pays')}</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name.ar} ({country.name.en})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عنوان العرض بالعربية *', 'Offer Title in Arabic *', 'Titre de l\'Offre en Arabe *')}</label>
                  <Input
                    value={newOffer.title?.ar || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, title: { ...newOffer.title!, ar: e.target.value } })}
                    placeholder={getLocalizedText('عنوان العرض بالعربية', 'Offer title in Arabic', 'Titre de l\'offre en arabe')}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عنوان العرض بالإنجليزية', 'Offer Title in English', 'Titre de l\'Offre en Anglais')}</label>
                  <Input
                    value={newOffer.title?.en || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, title: { ...newOffer.title!, en: e.target.value } })}
                    placeholder="Offer title in English"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عنوان العرض بالفرنسية', 'Offer Title in French', 'Titre de l\'Offre en Français')}</label>
                  <Input
                    value={newOffer.title?.fr || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, title: { ...newOffer.title!, fr: e.target.value } })}
                    placeholder="Titre de l'offre en français"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('وصف العرض *', 'Offer Description *', 'Description de l\'Offre *')}</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Textarea
                    value={newOffer.description?.ar || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, description: { ...newOffer.description!, ar: e.target.value } })}
                    placeholder={getLocalizedText('وصف مفصل باللغة العربية...', 'Detailed description in Arabic...', 'Description détaillée en arabe...')}
                    rows={3}
                    className="rounded-xl"
                  />
                  <Textarea
                    value={newOffer.description?.en || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, description: { ...newOffer.description!, en: e.target.value } })}
                    placeholder="Detailed description in English..."
                    rows={3}
                    className="rounded-xl"
                  />
                  <Textarea
                    value={newOffer.description?.fr || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, description: { ...newOffer.description!, fr: e.target.value } })}
                    placeholder="Description détaillée en français..."
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getLocalizedText('صورة العرض', 'Offer Image', 'Image de l\'Offre')}
                </label>
                <div className="flex gap-4">
                  <Input
                    type="url"
                    value={newOffer.imageUrl || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, imageUrl: e.target.value })}
                    placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                    className="flex-1 rounded-xl"
                  />
                  <label className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع من الجهاز', 'Upload from Device', 'Télécharger depuis l\'Appareil')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                            let imageUrl: string;
                            
                            try {
                              imageUrl = await uploadImageToServer(file);
                            } catch (uploadError) {
                              imageUrl = await compressImage(file);
                            }
                            
                            setNewOffer({ ...newOffer, imageUrl });
                          } catch (error) {
                            console.error('Error processing image:', error);
                            alert(getLocalizedText('حدث خطأ أثناء معالجة الصورة', 'Error processing image', 'Erreur lors du traitement de l\'image'));
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {newOffer.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={newOffer.imageUrl}
                      alt={getLocalizedText('صورة العرض', 'Offer Image', 'Image de l\'Offre')}
                      className="w-full h-48 object-cover rounded-xl border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Videos Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Film className="h-4 w-4 text-pink-600" />
                  {getLocalizedText('روابط الفيديو', 'Video Links', 'Liens vidéo')}
                </label>
                <div className="flex gap-3">
                  <Input
                    type="url"
                    value={newOfferVideoUrl}
                    onChange={(e) => setNewOfferVideoUrl(e.target.value)}
                    placeholder={getLocalizedText('أدخل رابط فيديو', 'Enter video URL', 'Entrez l\'URL de la vidéo')}
                    className="flex-1 rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (!newOfferVideoUrl) return;
                      setNewOffer({
                        ...newOffer,
                        videos: [...(newOffer.videos || []), newOfferVideoUrl],
                      });
                      setNewOfferVideoUrl('');
                    }}
                  >
                    {getLocalizedText('إضافة', 'Add', 'Ajouter')}
                  </Button>
                  <label className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع فيديو', 'Upload Video', 'Téléverser une vidéo')}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { isValidVideoFile, getFileSizeMB, uploadVideoToServer } = await import('@/utils/videoUtils');
                          if (!isValidVideoFile(file)) {
                            alert(getLocalizedText('صيغة فيديو غير مدعومة', 'Unsupported video format', 'Format vidéo non pris en charge'));
                            return;
                          }
                          if (getFileSizeMB(file) > 180) {
                            alert(getLocalizedText('حجم الفيديو كبير جداً (أقصى 180MB)', 'Video too large (max 180MB)', 'Vidéo trop volumineuse (max 180MB)'));
                            return;
                          }
                          const url = await uploadVideoToServer(file);
                          setNewOffer({
                            ...newOffer,
                            videos: [...(newOffer.videos || []), url],
                          });
                        } catch (error) {
                          console.error('Video upload error', error);
                          alert(getLocalizedText('فشل رفع الفيديو', 'Failed to upload video', 'Échec du téléchargement de la vidéo'));
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>

                {newOffer.videos && newOffer.videos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {newOffer.videos.map((video, index) => (
                      <div key={index} className="relative border rounded-xl p-2 bg-gray-50">
                        <video src={video} controls className="w-full h-40 rounded-lg bg-black" />
                        <button
                          onClick={() => {
                            const updated = newOffer.videos?.filter((_, i) => i !== index) || [];
                            setNewOffer({ ...newOffer, videos: updated });
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                          title={getLocalizedText('حذف الفيديو', 'Delete video', 'Supprimer la vidéo')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('السعر *', 'Price *', 'Prix *')}</label>
                  <Input
                    type="number"
                    value={newOffer.price || 0}
                    onChange={(e) => setNewOffer({ ...newOffer, price: parseFloat(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العملة', 'Currency', 'Devise')}</label>
                  <select
                    value={newOffer.currency || 'USD'}
                    onChange={(e) => setNewOffer({ ...newOffer, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="SAR">SAR</option>
                    <option value="AED">AED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('مدة الرحلة (أيام)', 'Duration (Days)', 'Durée (Jours)')}</label>
                  <Input
                    type="number"
                    value={newOffer.durationDays || 1}
                    onChange={(e) => setNewOffer({ ...newOffer, durationDays: parseInt(e.target.value) || 1 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newOffer.isFeatured || false}
                      onChange={(e) => setNewOffer({ ...newOffer, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{getLocalizedText('عرض مميز', 'Featured Offer', 'Offre en Vedette')}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newOffer.isActive || false}
                    onChange={(e) => setNewOffer({ ...newOffer, isActive: e.target.checked })}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{getLocalizedText('عرض نشط', 'Active Offer', 'Offre Active')}</span>
                </label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                onClick={handleAddOffer}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                {getLocalizedText('حفظ العرض', 'Save Offer', 'Enregistrer l\'Offre')}
              </Button>
              <Button
                onClick={() => setIsAddingOffer(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                {getLocalizedText('إلغاء', 'Cancel', 'Annuler')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal */}
      {editingOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="p-6 bg-gradient-to-r from-pink-600 to-pink-700 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{getLocalizedText('تعديل العرض السياحي', 'Edit Tour Offer', 'Modifier l\'Offre Touristique')}</h3>
                <button
                  onClick={() => setEditingOffer(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('الدولة *', 'Country *', 'Pays *')}</label>
                <select
                  value={editingOffer.countryId || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, countryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">{getLocalizedText('اختر الدولة', 'Select Country', 'Sélectionner le Pays')}</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name.ar} ({country.name.en})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عنوان العرض بالعربية *', 'Offer Title in Arabic *', 'Titre de l\'Offre en Arabe *')}</label>
                  <Input
                    value={editingOffer.title?.ar || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: { ...editingOffer.title!, ar: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عنوان العرض بالإنجليزية', 'Offer Title in English', 'Titre de l\'Offre en Anglais')}</label>
                  <Input
                    value={editingOffer.title?.en || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: { ...editingOffer.title!, en: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('عنوان العرض بالفرنسية', 'Offer Title in French', 'Titre de l\'Offre en Français')}</label>
                  <Input
                    value={editingOffer.title?.fr || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: { ...editingOffer.title!, fr: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('وصف العرض *', 'Offer Description *', 'Description de l\'Offre *')}</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Textarea
                    value={editingOffer.description?.ar || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: { ...editingOffer.description!, ar: e.target.value } })}
                    rows={3}
                    className="rounded-xl"
                  />
                  <Textarea
                    value={editingOffer.description?.en || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: { ...editingOffer.description!, en: e.target.value } })}
                    rows={3}
                    className="rounded-xl"
                  />
                  <Textarea
                    value={editingOffer.description?.fr || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: { ...editingOffer.description!, fr: e.target.value } })}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Image Upload Section for Edit */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getLocalizedText('صورة العرض', 'Offer Image', 'Image de l\'Offre')}
                </label>
                <div className="flex gap-4">
                  <Input
                    type="url"
                    value={editingOffer.imageUrl || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, imageUrl: e.target.value })}
                    placeholder={getLocalizedText('أدخل رابط الصورة', 'Enter image URL', 'Entrez l\'URL de l\'image')}
                    className="flex-1 rounded-xl"
                  />
                  <label className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع من الجهاز', 'Upload from Device', 'Télécharger depuis l\'Appareil')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const { uploadImageToServer, compressImage } = await import('@/utils/imageUtils');
                            let imageUrl: string;
                            
                            try {
                              imageUrl = await uploadImageToServer(file);
                            } catch (uploadError) {
                              imageUrl = await compressImage(file);
                            }
                            
                            setEditingOffer({ ...editingOffer, imageUrl });
                          } catch (error) {
                            console.error('Error processing image:', error);
                            alert(getLocalizedText('حدث خطأ أثناء معالجة الصورة', 'Error processing image', 'Erreur lors du traitement de l\'image'));
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {editingOffer.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={editingOffer.imageUrl}
                      alt={getLocalizedText('صورة العرض', 'Offer Image', 'Image de l\'Offre')}
                      className="w-full h-48 object-cover rounded-xl border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Videos Section for Edit */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Film className="h-4 w-4 text-pink-600" />
                  {getLocalizedText('روابط الفيديو', 'Video Links', 'Liens vidéo')}
                </label>
                <div className="flex gap-3">
                  <Input
                    type="url"
                    value={editingOfferVideoUrl}
                    onChange={(e) => setEditingOfferVideoUrl(e.target.value)}
                    placeholder={getLocalizedText('أدخل رابط فيديو', 'Enter video URL', 'Entrez l\'URL de la vidéo')}
                    className="flex-1 rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (!editingOfferVideoUrl) return;
                      setEditingOffer({
                        ...editingOffer,
                        videos: [...(editingOffer.videos || []), editingOfferVideoUrl],
                      });
                      setEditingOfferVideoUrl('');
                    }}
                  >
                    {getLocalizedText('إضافة', 'Add', 'Ajouter')}
                  </Button>
                  <label className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {getLocalizedText('رفع فيديو', 'Upload Video', 'Téléverser une vidéo')}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { isValidVideoFile, getFileSizeMB, uploadVideoToServer } = await import('@/utils/videoUtils');
                          if (!isValidVideoFile(file)) {
                            alert(getLocalizedText('صيغة فيديو غير مدعومة', 'Unsupported video format', 'Format vidéo non pris en charge'));
                            return;
                          }
                          if (getFileSizeMB(file) > 180) {
                            alert(getLocalizedText('حجم الفيديو كبير جداً (أقصى 180MB)', 'Video too large (max 180MB)', 'Vidéo trop volumineuse (max 180MB)'));
                            return;
                          }
                          const url = await uploadVideoToServer(file);
                          setEditingOffer({
                            ...editingOffer,
                            videos: [...(editingOffer.videos || []), url],
                          });
                        } catch (error) {
                          console.error('Video upload error', error);
                          alert(getLocalizedText('فشل رفع الفيديو', 'Failed to upload video', 'Échec du téléchargement de la vidéo'));
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>

                {editingOffer.videos && editingOffer.videos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editingOffer.videos.map((video, index) => (
                      <div key={index} className="relative border rounded-xl p-2 bg-gray-50">
                        <video src={video} controls className="w-full h-40 rounded-lg bg-black" />
                        <button
                          onClick={() => {
                            const updated = editingOffer.videos?.filter((_, i) => i !== index) || [];
                            setEditingOffer({ ...editingOffer, videos: updated });
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                          title={getLocalizedText('حذف الفيديو', 'Delete video', 'Supprimer la vidéo')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('السعر *', 'Price *', 'Prix *')}</label>
                  <Input
                    type="number"
                    value={editingOffer.price || 0}
                    onChange={(e) => setEditingOffer({ ...editingOffer, price: parseFloat(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('العملة', 'Currency', 'Devise')}</label>
                  <select
                    value={editingOffer.currency || 'USD'}
                    onChange={(e) => setEditingOffer({ ...editingOffer, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="SAR">SAR</option>
                    <option value="AED">AED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getLocalizedText('مدة الرحلة (أيام)', 'Duration (Days)', 'Durée (Jours)')}</label>
                  <Input
                    type="number"
                    value={editingOffer.durationDays || 1}
                    onChange={(e) => setEditingOffer({ ...editingOffer, durationDays: parseInt(e.target.value) || 1 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingOffer.isFeatured || false}
                      onChange={(e) => setEditingOffer({ ...editingOffer, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{getLocalizedText('عرض مميز', 'Featured Offer', 'Offre en Vedette')}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffer.isActive || false}
                    onChange={(e) => setEditingOffer({ ...editingOffer, isActive: e.target.checked })}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{getLocalizedText('عرض نشط', 'Active Offer', 'Offre Active')}</span>
                </label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                onClick={handleUpdateOffer}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                {getLocalizedText('حفظ التغييرات', 'Save Changes', 'Enregistrer les Modifications')}
              </Button>
              <Button
                onClick={() => setEditingOffer(null)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                {getLocalizedText('إلغاء', 'Cancel', 'Annuler')}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
