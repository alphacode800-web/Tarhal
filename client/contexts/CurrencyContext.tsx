import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'SDG' | 'SAR' | 'AED' | 'EGP' | 'USD' | 'EUR' | 'GBP' | 'TRY' | 'MAD' | 'KWD' | 'QAR' | 'OMR';

export interface CurrencyInfo {
  code: Currency;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  symbol: string;
  flag: string;
}

export const currencies: CurrencyInfo[] = [
  { code: 'SDG', name: { ar: 'الجنيه السوداني', en: 'Sudanese Pound', fr: 'Livre soudanaise' }, symbol: 'SDG', flag: '🇸🇩' },
  { code: 'SAR', name: { ar: 'الريال السعودي', en: 'Saudi Riyal', fr: 'Riyal saoudien' }, symbol: 'ر.س', flag: '🇸🇦' },
  { code: 'AED', name: { ar: 'درهم إماراتي', en: 'UAE Dirham', fr: 'Dirham émirati' }, symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'EGP', name: { ar: 'جنيه مصري', en: 'Egyptian Pound', fr: 'Livre égyptienne' }, symbol: 'ج.م', flag: '🇪🇬' },
  { code: 'USD', name: { ar: 'دولار أمريكي', en: 'US Dollar', fr: 'Dollar américain' }, symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: { ar: 'يورو', en: 'Euro', fr: 'Euro' }, symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: { ar: 'جنيه إسترليني', en: 'British Pound', fr: 'Livre sterling' }, symbol: '£', flag: '🇬🇧' },
  { code: 'TRY', name: { ar: 'ليرة تركية', en: 'Turkish Lira', fr: 'Livre turque' }, symbol: '₺', flag: '🇹🇷' },
  { code: 'MAD', name: { ar: 'درهم مغربي', en: 'Moroccan Dirham', fr: 'Dirham marocain' }, symbol: 'د.م', flag: '🇲🇦' },
  { code: 'KWD', name: { ar: 'دينار كويتي', en: 'Kuwaiti Dinar', fr: 'Dinar koweïtien' }, symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'QAR', name: { ar: 'ريال قطري', en: 'Qatari Riyal', fr: 'Riyal qatari' }, symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'OMR', name: { ar: 'ريال عماني', en: 'Omani Rial', fr: 'Rial omanais' }, symbol: 'ر.ع', flag: '🇴🇲' },
];

// Exchange rates relative to USD (base currency)
// These rates should be updated periodically or fetched from an API
const exchangeRates: Record<Currency, number> = {
  USD: 1.0,
  SDG: 600.0,      // 1 USD = 600 SDG (approximate)
  SAR: 3.75,       // 1 USD = 3.75 SAR
  AED: 3.67,       // 1 USD = 3.67 AED
  EGP: 50.0,       // 1 USD = 50 EGP (approximate)
  EUR: 0.92,       // 1 USD = 0.92 EUR
  GBP: 0.79,       // 1 USD = 0.79 GBP
  TRY: 32.0,       // 1 USD = 32 TRY (approximate)
  MAD: 10.0,       // 1 USD = 10 MAD (approximate)
  KWD: 0.31,       // 1 USD = 0.31 KWD
  QAR: 3.64,       // 1 USD = 3.64 QAR
  OMR: 0.38,       // 1 USD = 0.38 OMR
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceUSD: number, fromCurrency?: Currency) => number;
  formatPrice: (priceUSD: number, fromCurrency?: Currency) => string;
  getCurrencyInfo: () => CurrencyInfo;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('SDG');

  // Load saved currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('ciar-currency') as Currency;
    if (savedCurrency && currencies.find(c => c.code === savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('ciar-currency', newCurrency);
  };

  // Convert price from USD (or specified currency) to selected currency
  const convertPrice = (priceUSD: number, fromCurrency: Currency = 'USD'): number => {
    if (fromCurrency === currency) {
      return priceUSD;
    }
    
    // Convert from source currency to USD first
    const priceInUSD = fromCurrency === 'USD' 
      ? priceUSD 
      : priceUSD / exchangeRates[fromCurrency];
    
    // Convert from USD to target currency
    return priceInUSD * exchangeRates[currency];
  };

  // Format price with currency symbol
  const formatPrice = (priceUSD: number, fromCurrency: Currency = 'USD'): string => {
    const convertedPrice = convertPrice(priceUSD, fromCurrency);
    const currencyInfo = currencies.find(c => c.code === currency)!;
    
    // Format number with appropriate decimal places
    const formattedNumber = convertedPrice >= 1000
      ? convertedPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    
    // For Arabic currencies, show symbol on the right
    const isRTL = ['SDG', 'SAR', 'AED', 'EGP', 'MAD', 'KWD', 'QAR', 'OMR'].includes(currency);
    
    return isRTL
      ? `${formattedNumber} ${currencyInfo.symbol}`
      : `${currencyInfo.symbol}${formattedNumber}`;
  };

  const getCurrencyInfo = (): CurrencyInfo => {
    return currencies.find(c => c.code === currency) || currencies[0];
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        formatPrice,
        getCurrencyInfo,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

