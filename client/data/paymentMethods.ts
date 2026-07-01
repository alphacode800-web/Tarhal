export type PaymentMethodId =
  | 'card'
  | 'whish'
  | 'ciar_card'
  | 'paypal'
  | 'google_pay'
  | 'apple_pay'
  | 'amex'
  | 'unionpay'
  | 'sepa_debit'
  | 'sofort'
  | 'giropay'
  | 'ideal'
  | 'bancontact'
  | 'eps'
  | 'p24'
  | 'grabpay'
  | 'alipay';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  stripeTypes?: string[];
  local?: boolean;
  label: { ar: string; en: string; fr: string };
  icons?: string[];
  iconType?: 'visa-mastercard' | 'text' | 'image' | 'apple';
  textLabel?: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'card',
    stripeTypes: ['card'],
    label: { ar: 'بطاقة بنكية (Visa / Mastercard)', en: 'Bank Card (Visa / Mastercard)', fr: 'Carte bancaire (Visa / Mastercard)' },
    iconType: 'visa-mastercard',
    icons: ['https://cdn.simpleicons.org/visa', 'https://cdn.simpleicons.org/mastercard'],
  },
  {
    id: 'whish',
    local: true,
    label: { ar: 'Whish Money', en: 'Whish Money', fr: 'Whish Money' },
    iconType: 'image',
    icons: ['/payments/whish-money.png'],
  },
  {
    id: 'ciar_card',
    local: true,
    label: { ar: 'بطاقة CIAR Mastercard', en: 'CIAR Prepaid Mastercard', fr: 'Carte CIAR Mastercard' },
    iconType: 'image',
    icons: ['/payments/ciar-mastercard.png'],
  },
  {
    id: 'paypal',
    stripeTypes: ['card'],
    label: { ar: 'PayPal', en: 'PayPal', fr: 'PayPal' },
    iconType: 'text',
    textLabel: 'PayPal',
  },
  {
    id: 'google_pay',
    stripeTypes: ['card'],
    label: { ar: 'Google Pay', en: 'Google Pay', fr: 'Google Pay' },
    iconType: 'text',
    textLabel: 'G Pay',
  },
  {
    id: 'apple_pay',
    stripeTypes: ['card'],
    label: { ar: 'Apple Pay', en: 'Apple Pay', fr: 'Apple Pay' },
    iconType: 'apple',
  },
  {
    id: 'amex',
    stripeTypes: ['card'],
    label: { ar: 'American Express', en: 'American Express', fr: 'American Express' },
    iconType: 'text',
    textLabel: 'AMEX',
  },
  {
    id: 'unionpay',
    stripeTypes: ['card'],
    label: { ar: 'UnionPay', en: 'UnionPay', fr: 'UnionPay' },
    iconType: 'text',
    textLabel: 'UnionPay',
  },
  {
    id: 'sepa_debit',
    stripeTypes: ['sepa_debit'],
    label: { ar: 'SEPA Debit', en: 'SEPA Debit', fr: 'SEPA Debit' },
    iconType: 'text',
    textLabel: 'SEPA',
  },
  {
    id: 'sofort',
    stripeTypes: ['sofort'],
    label: { ar: 'SOFORT', en: 'SOFORT', fr: 'SOFORT' },
    icons: ['https://cdn.simpleicons.org/sofort'],
    iconType: 'image',
  },
  {
    id: 'giropay',
    stripeTypes: ['giropay'],
    label: { ar: 'giropay', en: 'giropay', fr: 'giropay' },
    icons: ['https://cdn.simpleicons.org/giropay'],
    iconType: 'image',
  },
  {
    id: 'ideal',
    stripeTypes: ['ideal'],
    label: { ar: 'iDEAL', en: 'iDEAL', fr: 'iDEAL' },
    icons: ['https://cdn.simpleicons.org/ideal'],
    iconType: 'image',
  },
  {
    id: 'bancontact',
    stripeTypes: ['bancontact'],
    label: { ar: 'Bancontact', en: 'Bancontact', fr: 'Bancontact' },
    icons: ['https://cdn.simpleicons.org/bancontact'],
    iconType: 'image',
  },
  {
    id: 'eps',
    stripeTypes: ['eps'],
    label: { ar: 'EPS', en: 'EPS', fr: 'EPS' },
    icons: ['https://cdn.simpleicons.org/eps'],
    iconType: 'image',
  },
  {
    id: 'p24',
    stripeTypes: ['p24'],
    label: { ar: 'Przelewy24', en: 'Przelewy24', fr: 'Przelewy24' },
    icons: ['https://cdn.simpleicons.org/przelewy24'],
    iconType: 'image',
  },
  {
    id: 'grabpay',
    stripeTypes: ['grabpay'],
    label: { ar: 'GrabPay', en: 'GrabPay', fr: 'GrabPay' },
    icons: ['https://cdn.simpleicons.org/grab'],
    iconType: 'image',
  },
  {
    id: 'alipay',
    stripeTypes: ['alipay'],
    label: { ar: 'Alipay', en: 'Alipay', fr: 'Alipay' },
    icons: ['https://cdn.simpleicons.org/alipay'],
    iconType: 'image',
  },
];

export function getStripeTypesForMethod(methodId: PaymentMethodId): string[] {
  const method = PAYMENT_METHODS.find((m) => m.id === methodId);
  return method?.stripeTypes || ['card'];
}

export function isLocalPaymentMethod(methodId: PaymentMethodId): boolean {
  return PAYMENT_METHODS.find((m) => m.id === methodId)?.local === true;
}
