import { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PaymentButton from '@/components/PaymentButton';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  PAYMENT_METHODS,
  getStripeTypesForMethod,
  isLocalPaymentMethod,
  type PaymentMethodId,
} from '@/data/paymentMethods';

interface PaymentCheckoutPanelProps {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName?: string;
  bookingSummary: React.ReactNode;
  metadata?: Record<string, unknown>;
  onBack?: () => void;
  onLocalPaymentSuccess?: () => void;
}

export default function PaymentCheckoutPanel({
  amount,
  currency,
  description,
  customerEmail,
  customerName = '',
  bookingSummary,
  metadata = {},
  onBack,
  onLocalPaymentSuccess,
}: PaymentCheckoutPanelProps) {
  const { language } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('card');
  const [processing, setProcessing] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [cardName, setCardName] = useState(customerName);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [whishPhone, setWhishPhone] = useState('');
  const [whishPin, setWhishPin] = useState('');
  const [ciarCardNumber, setCiarCardNumber] = useState('');
  const [ciarCardPin, setCiarCardPin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  const tr = (ar: string, en: string, fr: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const label = (obj: { ar: string; en: string; fr: string }) =>
    language === 'ar' ? obj.ar : language === 'fr' ? obj.fr : obj.en;

  const validateLocalPayment = (): boolean => {
    const next: Record<string, string> = {};
    if (selectedMethod === 'whish') {
      if (!whishPhone.trim()) next.whishPhone = tr('رقم Whish مطلوب', 'Whish number required', 'Numéro Whish requis');
      if (!whishPin.trim()) next.whishPin = tr('رمز التأكيد مطلوب', 'PIN required', 'Code PIN requis');
    }
    if (selectedMethod === 'ciar_card') {
      if (!ciarCardNumber.trim()) next.ciarCardNumber = tr('رقم البطاقة مطلوب', 'Card number required', 'Numéro de carte requis');
      if (!ciarCardPin.trim()) next.ciarCardPin = tr('رمز البطاقة مطلوب', 'Card PIN required', 'Code PIN requis');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateCardFields = (): boolean => {
    if (isLocalPaymentMethod(selectedMethod)) return true;
    const next: Record<string, string> = {};
    if (!cardName.trim()) next.cardName = tr('اسم حامل البطاقة مطلوب', 'Cardholder name required', 'Nom du titulaire requis');
    if (!cardNumber.replace(/\s/g, '').match(/^\d{12,19}$/)) {
      next.cardNumber = tr('رقم البطاقة غير صالح', 'Invalid card number', 'Numéro de carte invalide');
    }
    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
      next.cardExpiry = tr('تاريخ الانتهاء MM/YY', 'Expiry MM/YY', 'Expiration MM/AA');
    }
    if (!cardCvv.match(/^\d{3,4}$/)) {
      next.cardCvv = tr('رمز CVV غير صالح', 'Invalid CVV', 'CVV invalide');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLocalPay = async () => {
    if (!validateLocalPayment()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    setLocalSuccess(true);
    onLocalPaymentSuccess?.();
  };

  const renderMethodIcon = (method: (typeof PAYMENT_METHODS)[number]) => {
    if (method.iconType === 'visa-mastercard' && method.icons?.length === 2) {
      return (
        <div className="flex items-center gap-1 shrink-0">
          <img src={method.icons[0]} alt="Visa" className="w-7 h-7" />
          <img src={method.icons[1]} alt="Mastercard" className="w-7 h-7" />
        </div>
      );
    }
    if (method.iconType === 'image' && method.icons?.[0]) {
      return (
        <img
          src={method.icons[0]}
          alt={label(method.label)}
          className={`shrink-0 ${method.local ? 'h-8 w-auto max-w-[72px] object-contain' : 'w-7 h-7'}`}
        />
      );
    }
    if (method.iconType === 'apple') {
      return (
        <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-semibold"> Pay</span>
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-600">
        {method.textLabel || label(method.label).split(' ')[0]}
      </div>
    );
  };

  if (localSuccess) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-slate-700">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {tr('تم استلام طلب الدفع بنجاح', 'Payment request received', 'Demande de paiement reçue')}
        </h2>
        <p className="text-gray-600">
          {tr('سيتم تأكيد الحجز بعد معالجة الدفع', 'Your booking will be confirmed after payment processing', 'Votre réservation sera confirmée après traitement du paiement')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-tarhal-orange" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {tr('اختيار طريقة الدفع', 'Choose Payment Method', 'Choisir le mode de paiement')}
          </h2>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="text-sm">
            {tr('العودة', 'Back', 'Retour')}
          </Button>
        )}
      </div>

      {bookingSummary}

      <div className="mb-6 p-4 rounded-xl bg-tarhal-orange/5 dark:bg-tarhal-orange/10 border border-tarhal-orange/20 flex justify-between items-center">
        <span className="font-semibold text-gray-800 dark:text-gray-100">{tr('المبلغ المستحق', 'Amount due', 'Montant dû')}</span>
        <span className="text-2xl font-bold text-tarhal-orange">
          {amount.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
        </span>
      </div>

      <div className="mb-6">
        <label className="block mb-3 font-semibold text-gray-800 dark:text-gray-100">
          {tr('طرق الدفع المتاحة', 'Available Payment Methods', 'Moyens de paiement disponibles')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
          {PAYMENT_METHODS.map((method) => {
            const selected = selectedMethod === method.id;
            return (
              <label
                key={method.id}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                  selected
                    ? 'border-tarhal-orange bg-tarhal-orange/10 shadow-sm ring-1 ring-tarhal-orange/30'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 bg-white dark:bg-slate-900/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  className="accent-tarhal-orange shrink-0"
                  checked={selected}
                  onChange={() => {
                    setSelectedMethod(method.id);
                    setErrors({});
                  }}
                />
                {renderMethodIcon(method)}
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">{label(method.label)}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mb-6 space-y-4 border-t pt-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {tr('بيانات الدفع', 'Payment Details', 'Détails de paiement')}
        </h3>

        {selectedMethod === 'whish' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr('رقم Whish Money', 'Whish Money Number', 'Numéro Whish Money')} *
              </label>
              <Input value={whishPhone} onChange={(e) => setWhishPhone(e.target.value)} placeholder="00963..." className={errors.whishPhone ? 'border-red-500' : ''} />
              {errors.whishPhone && <p className="text-red-500 text-xs mt-1">{errors.whishPhone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr('رمز التأكيد', 'Confirmation PIN', 'Code PIN')} *
              </label>
              <Input type="password" value={whishPin} onChange={(e) => setWhishPin(e.target.value)} className={errors.whishPin ? 'border-red-500' : ''} />
              {errors.whishPin && <p className="text-red-500 text-xs mt-1">{errors.whishPin}</p>}
            </div>
          </div>
        )}

        {selectedMethod === 'ciar_card' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr('رقم بطاقة CIAR', 'CIAR Card Number', 'Numéro carte CIAR')} *
              </label>
              <Input value={ciarCardNumber} onChange={(e) => setCiarCardNumber(e.target.value)} placeholder="XXXX XXXX XXXX XXXX" className={errors.ciarCardNumber ? 'border-red-500' : ''} />
              {errors.ciarCardNumber && <p className="text-red-500 text-xs mt-1">{errors.ciarCardNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr('رمز البطاقة', 'Card PIN', 'Code PIN')} *
              </label>
              <Input type="password" value={ciarCardPin} onChange={(e) => setCiarCardPin(e.target.value)} className={errors.ciarCardPin ? 'border-red-500' : ''} />
              {errors.ciarCardPin && <p className="text-red-500 text-xs mt-1">{errors.ciarCardPin}</p>}
            </div>
          </div>
        )}

        {!isLocalPaymentMethod(selectedMethod) && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr('اسم حامل البطاقة', 'Cardholder Name', 'Nom du titulaire')} *
              </label>
              <Input value={cardName} onChange={(e) => setCardName(e.target.value)} className={errors.cardName ? 'border-red-500' : ''} />
              {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr('رقم البطاقة', 'Card Number', 'Numéro de carte')} *
              </label>
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ''))}
                placeholder="1234 5678 9012 3456"
                className={errors.cardNumber ? 'border-red-500' : ''}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr('تاريخ الانتهاء', 'Expiry', 'Expiration')} *
              </label>
              <Input
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className={errors.cardExpiry ? 'border-red-500' : ''}
              />
              {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
              <Input
                type="password"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                placeholder="123"
                className={errors.cardCvv ? 'border-red-500' : ''}
              />
              {errors.cardCvv && <p className="text-red-500 text-xs mt-1">{errors.cardCvv}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr('عنوان الفوترة (اختياري)', 'Billing Address (optional)', 'Adresse de facturation (optionnel)')}
              </label>
              <Input value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {isLocalPaymentMethod(selectedMethod) ? (
        <Button
          onClick={handleLocalPay}
          disabled={processing || amount <= 0}
          className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white font-semibold py-6 text-lg"
        >
          {processing
            ? tr('جاري المعالجة...', 'Processing...', 'Traitement...')
            : tr('تأكيد الدفع', 'Confirm Payment', 'Confirmer le paiement')}
        </Button>
      ) : (
        <PaymentButton
          amount={amount}
          currency={currency}
          description={description}
          beforePay={validateCardFields}
          metadata={{
            ...metadata,
            paymentMethod: selectedMethod,
            billing: { cardName, billingAddress },
          }}
          customerEmail={customerEmail}
          paymentMethodTypes={getStripeTypesForMethod(selectedMethod)}
          className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white font-semibold py-6 text-lg hover:shadow-xl transition-all duration-300"
        >
          {tr('إتمام الدفع الآن', 'Complete Payment Now', 'Finaliser le paiement')}
        </PaymentButton>
      )}

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>{tr('دفع آمن ومشفّر — متوافق مع معايير الأمان العالمية', 'Secure encrypted payment', 'Paiement sécurisé et crypté')}</span>
      </div>
    </div>
  );
}
