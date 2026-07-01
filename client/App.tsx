import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Index from "./pages/Index";
import TravelOffices from "./pages/TravelOffices";
import CountryDetail from "./pages/CountryDetail";
import CityDetail from "./pages/CityDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OfficeContact from "./pages/OfficeContact";
import TourOffers from "./pages/TourOffers";
import Hotels from "./pages/Hotels";
import AllHotels from "./pages/AllHotels";
import CarRentals from "./pages/CarRentals";
import CarRentalDetails from "./pages/CarRentalDetails";
import CarRentalBooking from "./pages/CarRentalBooking";
import FlightTickets from "./pages/FlightTickets";
import FlightBooking from "./pages/FlightBooking";
import TravelVisa from "./pages/TravelVisa";
import VisaApplication from "./pages/VisaApplication";
import TravelInsurance from "./pages/TravelInsurance";
import TaxiDelivery from "./pages/TaxiDelivery";
import TaxiDeliveryBooking from "./pages/TaxiDeliveryBooking";
import HotelBooking from "./pages/HotelBooking";
import HotelDetails from "./pages/HotelDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SupervisorLogin from "./pages/SupervisorLogin";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import SupervisorCityManager from "./pages/SupervisorCityManager";
import SupervisorOfficeManager from "./pages/SupervisorOfficeManager";
import SupervisorOfferManager from "./pages/SupervisorOfferManager";
import AdminSupervisorManagement from "./pages/AdminSupervisorManagement";
import NotFound from "./pages/NotFound";
import CheckoutDemo from "./pages/CheckoutDemo";
import './services/supervisorInitialData';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="tarhal-theme" disableTransitionOnChange>
    <TooltipProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/offices" element={<TravelOffices />} />
            <Route path="/offers" element={<TourOffers />} />
            <Route path="/hotels" element={<AllHotels />} />
            <Route path="/hotels/:hotelId" element={<HotelDetails />} />
            <Route path="/car-rentals" element={<CarRentals />} />
            <Route path="/car-rentals/:id" element={<CarRentalDetails />} />
            <Route path="/car-rentals/:rentalId/booking/:vehicleId" element={<CarRentalBooking />} />
            <Route path="/flight-tickets" element={<FlightTickets />} />
            <Route path="/flight-booking" element={<FlightBooking />} />
            <Route path="/travel-visa" element={<TravelVisa />} />
            <Route path="/visa-application" element={<VisaApplication />} />
            <Route path="/travel-insurance" element={<TravelInsurance />} />
            <Route path="/taxi-delivery" element={<TaxiDelivery />} />
            <Route path="/taxi-delivery/book/:serviceId" element={<TaxiDeliveryBooking />} />
            <Route path="/offices/:countryId" element={<CountryDetail />} />
            <Route path="/offices/:countryId/hotels" element={<Hotels />} />
            <Route path="/offices/:countryId/hotels/:hotelId" element={<HotelDetails />} />
            <Route path="/offices/:countryId/hotels/:hotelId/booking" element={<HotelBooking />} />
            <Route path="/offices/:countryId/city/:cityId" element={<CityDetail />} />
            <Route path="/offices/:countryId/contact" element={<OfficeContact />} />
            <Route path="/offices/:countryId/contact/:officeId" element={<OfficeContact />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<CheckoutDemo />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/supervisors" element={<AdminSupervisorManagement />} />
            <Route path="/supervisor/login" element={<SupervisorLogin />} />
            <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
            <Route path="/supervisor/cities/:mode" element={<SupervisorCityManager />} />
            <Route path="/supervisor/cities/:mode/:cityId" element={<SupervisorCityManager />} />
            <Route path="/supervisor/offices/:mode" element={<SupervisorOfficeManager />} />
            <Route path="/supervisor/offices/:mode/:officeId" element={<SupervisorOfficeManager />} />
            <Route path="/supervisor/offers/:mode" element={<SupervisorOfferManager />} />
            <Route path="/supervisor/offers/:mode/:offerId" element={<SupervisorOfferManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </CurrencyProvider>
      </LanguageProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
