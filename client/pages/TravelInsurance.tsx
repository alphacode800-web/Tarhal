import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Shield, Check, User, Calendar, MapPin, Mail, Phone, CreditCard, Heart, Plane, Briefcase, Users, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function TravelInsurance() {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    destination: '',
    travelStartDate: '',
    travelEndDate: '',
    numberOfTravelers: 1
  });

  const features = [
    {
      icon: Heart,
      title: { ar: 'التغطية الطبية', en: 'Medical Coverage', fr: 'Couverture médicale' },
      description: { ar: 'تغطية شاملة للحالات الطبية الطارئة', en: 'Comprehensive coverage for medical emergencies', fr: 'Couverture complète pour les urgences médicales' }
    },
    {
      icon: Plane,
      title: { ar: 'إلغاء الرحلة', en: 'Trip Cancellation', fr: 'Annulation de voyage' },
      description: { ar: 'استرداد تكاليف الرحلة الملغاة', en: 'Refund for cancelled trips', fr: 'Remboursement pour les voyages annulés' }
    },
    {
      icon: Briefcase,
      title: { ar: 'فقدان الأمتعة', en: 'Lost Luggage', fr: 'Perte de bagages' },
      description: { ar: 'تعويض عن الأمتعة المفقودة أو المتأخرة', en: 'Compensation for lost or delayed luggage', fr: 'Indemnisation pour les bagages perdus ou retardés' }
    },
    {
      icon: Users,
      title: { ar: 'دعم 24/7', en: '24/7 Support', fr: 'Support 24/7' },
      description: { ar: 'مساعدة على مدار الساعة في أي مكان', en: 'Round-the-clock assistance anywhere', fr: 'Assistance 24h/24 partout' }
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: { ar: 'أساسي', en: 'Basic', fr: 'Basique' },
      price: 25,
      duration: { ar: 'لمدة أسبوع', en: 'Per Week', fr: 'Par Semaine' },
      coverage: {
        medical: 50000,
        luggage: 1000,
        cancellation: 2000
      },
      features: [
        { ar: 'تغطية طبية حتى 50,000$', en: 'Medical coverage up to $50,000', fr: 'Couverture médicale jusqu\'à 50 000 $' },
        { ar: 'تأمين الأمتعة حتى 1,000$', en: 'Luggage insurance up to $1,000', fr: 'Assurance bagages jusqu\'à 1 000 $' },
        { ar: 'إلغاء الرحلة حتى 2,000$', en: 'Trip cancellation up to $2,000', fr: 'Annulation de voyage jusqu\'à 2 000 $' },
        { ar: 'دعم عبر البريد الإلكتروني', en: 'Email support', fr: 'Support par e-mail' }
      ]
    },
    {
      id: 'standard',
      name: { ar: 'قياسي', en: 'Standard', fr: 'Standard' },
      price: 45,
      duration: { ar: 'لمدة أسبوع', en: 'Per Week', fr: 'Par Semaine' },
      coverage: {
        medical: 100000,
        luggage: 2500,
        cancellation: 5000
      },
      features: [
        { ar: 'تغطية طبية حتى 100,000$', en: 'Medical coverage up to $100,000', fr: 'Couverture médicale jusqu\'à 100 000 $' },
        { ar: 'تأمين الأمتعة حتى 2,500$', en: 'Luggage insurance up to $2,500', fr: 'Assurance bagages jusqu\'à 2 500 $' },
        { ar: 'إلغاء الرحلة حتى 5,000$', en: 'Trip cancellation up to $5,000', fr: 'Annulation de voyage jusqu\'à 5 000 $' },
        { ar: 'دعم هاتفي 24/7', en: '24/7 phone support', fr: 'Support téléphonique 24/7' },
        { ar: 'تغطية تأخير الرحلة', en: 'Flight delay coverage', fr: 'Couverture retard de vol' }
      ],
      recommended: true
    },
    {
      id: 'premium',
      name: { ar: 'مميز', en: 'Premium', fr: 'Premium' },
      price: 75,
      duration: { ar: 'لمدة أسبوع', en: 'Per Week', fr: 'Par Semaine' },
      coverage: {
        medical: 250000,
        luggage: 5000,
        cancellation: 10000
      },
      features: [
        { ar: 'تغطية طبية حتى 250,000$', en: 'Medical coverage up to $250,000', fr: 'Couverture médicale jusqu\'à 250 000 $' },
        { ar: 'تأمين الأمتعة حتى 5,000$', en: 'Luggage insurance up to $5,000', fr: 'Assurance bagages jusqu\'à 5 000 $' },
        { ar: 'إلغاء الرحلة حتى 10,000$', en: 'Trip cancellation up to $10,000', fr: 'Annulation de voyage jusqu\'à 10 000 $' },
        { ar: 'دعم VIP على مدار الساعة', en: 'VIP 24/7 support', fr: 'Support VIP 24/7' },
        { ar: 'تغطية الرياضات المغامرة', en: 'Adventure sports coverage', fr: 'Couverture sports d\'aventure' },
        { ar: 'إخلاء طبي طارئ', en: 'Emergency medical evacuation', fr: 'Évacuation médicale d\'urgence' },
        { ar: 'تأمين الإلكترونيات', en: 'Electronics insurance', fr: 'Assurance électronique' }
      ]
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPurchaseForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Insurance purchase:', { plan: selectedPlan, formData });
    alert(language === 'ar' ? 'تم شراء التأمين بنجاح!' : language === 'fr' ? 'Assurance achetée avec succès!' : 'Insurance purchased successfully!');
    navigate('/');
  };

  const getLocalizedText = (obj: { ar: string; en: string; fr: string }) => {
    if (language === 'ar') return obj.ar;
    if (language === 'fr') return obj.fr;
    return obj.en;
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://images.pexels.com/photos/3856026/pexels-photo-3856026.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tarhal-navy/95 via-tarhal-blue-dark/90 to-tarhal-blue/85" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Shield className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">
              {language === 'ar' ? 'التأمين السياحي' : language === 'fr' ? 'Assurance voyage' : 'Travel Insurance'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            {language === 'ar' ? 'سافر بأمان واطمئنان' : language === 'fr' ? 'Voyagez en toute sécurité' : 'Travel with Peace of Mind'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'احم نفسك ورحلتك مع أفضل خطط التأمين السياحي'
              : language === 'fr'
              ? 'Protégez-vous et votre voyage avec les meilleurs plans d\'assurance voyage'
              : 'Protect yourself and your trip with the best travel insurance plans'}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'ar' ? 'ماذا نغطي؟' : language === 'fr' ? 'Que couvrons-nous?' : 'What We Cover?'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-tarhal-orange/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-tarhal-orange" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{getLocalizedText(feature.title)}</h3>
                <p className="text-gray-600 text-sm">{getLocalizedText(feature.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'اختر خطتك المثالية' : language === 'fr' ? 'Choisissez votre plan idéal' : 'Choose Your Perfect Plan'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'خطط تأمين مرنة تناسب احتياجاتك وميزانيتك'
                : language === 'fr'
                ? 'Plans d\'assurance flexibles adaptés à vos besoins et à votre budget'
                : 'Flexible insurance plans tailored to your needs and budget'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  plan.recommended ? 'ring-4 ring-tarhal-orange transform scale-105' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="bg-tarhal-orange text-white text-center py-2 font-semibold text-sm">
                    {language === 'ar' ? 'الأكثر شعبية' : language === 'fr' ? 'Le plus populaire' : 'Most Popular'}
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{getLocalizedText(plan.name)}</h3>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-tarhal-orange mb-1">
                      {formatPrice(plan.price, 'USD')}
                    </div>
                    <div className="text-sm text-gray-600">{getLocalizedText(plan.duration)}</div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{getLocalizedText(feature)}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-4 ${
                      plan.recommended
                        ? 'bg-tarhal-orange hover:bg-tarhal-orange-dark text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {language === 'ar' ? 'اختر هذه الخطة' : language === 'fr' ? 'Choisir ce plan' : 'Choose This Plan'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'ar' ? 'لماذا تختار تأميننا؟' : language === 'fr' ? 'Pourquoi choisir notre assurance?' : 'Why Choose Our Insurance?'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'تغطية شاملة' : language === 'fr' ? 'Couverture complète' : 'Comprehensive Coverage'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'حماية شاملة لجميع جوانب رحلتك'
                  : language === 'fr'
                  ? 'Protection complète pour tous les aspects de votre voyage'
                  : 'Complete protection for all aspects of your trip'}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'موثوق ومعتمد' : language === 'fr' ? 'Fiable et certifié' : 'Trusted & Certified'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'شركاء موثوقون ومعتمدون دولياً'
                  : language === 'fr'
                  ? 'Partenaires de confiance et certifiés internationalement'
                  : 'Trusted partners certified internationally'}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'استجابة سريعة' : language === 'fr' ? 'Réponse rapide' : 'Quick Response'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'معالجة سريعة للمطالبات في حالات الطوارئ'
                  : language === 'fr'
                  ? 'Traitement rapide des réclamations en cas d\'urgence'
                  : 'Fast claim processing in emergencies'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Form Modal */}
      {showPurchaseForm && selectedPlanData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'إكمال الشراء' : language === 'fr' ? 'Finaliser l\'achat' : 'Complete Purchase'}
              </h2>

              <div className="bg-tarhal-blue-light rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{getLocalizedText(selectedPlanData.name)}</h3>
                    <p className="text-sm text-gray-600">{getLocalizedText(selectedPlanData.duration)}</p>
                  </div>
                  <div className="text-2xl font-bold text-tarhal-orange">
                    {formatPrice(selectedPlanData.price, 'USD')}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom complet' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'E-mail' : 'Email'} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'تاريخ بدء الرحلة' : language === 'fr' ? 'Date de début' : 'Trip Start Date'} *
                    </label>
                    <input
                      type="date"
                      name="travelStartDate"
                      value={formData.travelStartDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {language === 'ar' ? 'تاريخ انتهاء الرحلة' : language === 'fr' ? 'Date de fin' : 'Trip End Date'} *
                    </label>
                    <input
                      type="date"
                      name="travelEndDate"
                      value={formData.travelEndDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {language === 'ar' ? 'الوجهة' : language === 'fr' ? 'Destination' : 'Destination'} *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tarhal-orange"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowPurchaseForm(false);
                      setSelectedPlan(null);
                    }}
                    variant="outline"
                    className="flex-1 py-4"
                  >
                    {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-tarhal-orange hover:bg-tarhal-orange-dark text-white py-4"
                  >
                    {language === 'ar' ? 'شراء الآن' : language === 'fr' ? 'Acheter maintenant' : 'Purchase Now'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

