import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, CreditCard, Plane, AlertTriangle, Scale, RefreshCw } from 'lucide-react';

export default function TermsAndConditions() {
  const { language } = useLanguage();

  const tr = (ar: string, en: string, fr: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const sections = [
    {
      icon: FileText,
      title: tr('القبول بالشروط', 'Acceptance of Terms', 'Acceptation des conditions'),
      content: tr(
        'باستخدامك لموقع ciar وحجز أي من خدماتنا (رحلات، فنادق، تذاكر طيران، تأشيرات، تأمين سفر، وغيرها)، فإنك توافق على هذه الشروط والأحكام. إذا لم توافق عليها، يرجى عدم استخدام الموقع.',
        'By using the ciar website and booking any of our services (tours, hotels, flights, visas, travel insurance, etc.), you agree to these terms and conditions. If you do not agree, please do not use the site.',
        'En utilisant le site ciar et en réservant nos services, vous acceptez ces conditions. Dans le cas contraire, veuillez ne pas utiliser le site.',
      ),
    },
    {
      icon: Plane,
      title: tr('الحجوزات والخدمات', 'Bookings & Services', 'Réservations et services'),
      content: tr(
        'تُنفَّذ الحجوزات وفق توفر الخدمة والأسعار المعلنة وقت الحجز. نعمل كوسيط سياحي بينك وبين مزودي الخدمة (خطوط طيران، فنادق، شركات نقل). تخضع بعض الخدمات لشروط إضافية يفرضها المزود ويُبلَّغ بها عند الحجز.',
        'Bookings are subject to service availability and prices displayed at the time of booking. We act as a travel intermediary between you and service providers (airlines, hotels, transport companies). Some services are subject to additional provider terms communicated at booking.',
        'Les réservations dépendent de la disponibilité et des tarifs affichés. Nous agissons comme intermédiaire entre vous et les prestataires. Certaines prestations sont soumises à des conditions supplémentaires.',
      ),
    },
    {
      icon: CreditCard,
      title: tr('الأسعار والدفع', 'Pricing & Payment', 'Tarifs et paiement'),
      content: tr(
        'جميع الأسعار معروضة بالعملة المحددة على الموقع وقد تشمل أو لا تشمل الضرائب والرسوم حسب ما يُبيَّن. يجب إتمام الدفع وفق الطريقة المتاحة لإتمام الحجز. نحتفظ بالحق في تصحيح الأخطاء السعرية الواضحة قبل تأكيد الحجز.',
        'All prices are shown in the currency indicated on the site and may or may not include taxes and fees as stated. Payment must be completed via available methods to confirm booking. We reserve the right to correct obvious pricing errors before confirmation.',
        'Les prix sont affichés dans la devise indiquée et peuvent inclure ou non les taxes. Le paiement doit être effectué pour confirmer la réservation. Nous nous réservons le droit de corriger les erreurs de prix évidentes.',
      ),
    },
    {
      icon: RefreshCw,
      title: tr('الإلغاء والاسترداد', 'Cancellation & Refunds', 'Annulation et remboursement'),
      content: tr(
        'تخضع سياسات الإلغاء والاسترداد لنوع الخدمة المحجوزة وشروط المزود. قد تُفرض رسوم إدارية على الإلغاء. يُرجى مراجعة تفاصيل كل عرض أو خدمة قبل الحجز. للاستفسار عن إلغاء حجز محدد، تواصل معنا عبر «اتصل بنا».',
        'Cancellation and refund policies depend on the booked service type and provider terms. Administrative fees may apply. Please review details for each offer before booking. For cancellation inquiries, contact us via Contact.',
        'Les politiques d\'annulation et de remboursement dépendent du type de service et du prestataire. Des frais administratifs peuvent s\'appliquer. Consultez les détails avant de réserver.',
      ),
    },
    {
      icon: AlertTriangle,
      title: tr('مسؤولية المسافر', 'Traveler Responsibility', 'Responsabilité du voyageur'),
      content: tr(
        'يتحمل المسافر مسؤولية التأكد من صلاحية جواز السفر والتأشيرات والتطعيمات المطلوبة للوجهة. ciar غير مسؤولة عن رفض الدخول أو تأخر الرحلات الناتج عن ظروف خارجة عن إرادتنا (طقس، إضرابات، قرارات حكومية).',
        'Travelers are responsible for valid passports, visas, and required vaccinations. ciar is not liable for entry denial or delays caused by circumstances beyond our control (weather, strikes, government decisions).',
        'Le voyageur est responsable de la validité du passeport, des visas et des vaccinations. ciar n\'est pas responsable des refus d\'entrée ou retards dus à des circonstances indépendantes de notre volonté.',
      ),
    },
    {
      icon: Scale,
      title: tr('القانون الحاكم', 'Governing Law', 'Droit applicable'),
      content: tr(
        'تخضع هذه الشروط للقوانين المعمول بها في بلد تشغيل شركة ciar. أي نزاع يُحاول حله ودياً أولاً. عند تعذر ذلك، تُحال المسألة إلى الجهات القضائية المختصة.',
        'These terms are governed by the laws applicable in ciar\'s country of operation. Disputes will first be resolved amicably; failing that, competent courts shall have jurisdiction.',
        'Ces conditions sont régies par les lois du pays d\'exploitation de ciar. Les litiges seront d\'abord résolus à l\'amiable, puis devant les tribunaux compétents.',
      ),
    },
  ];

  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
            <FileText className="h-8 w-8 text-tarhal-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {tr('الشروط والأحكام', 'Terms & Conditions', 'Conditions Générales')}
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            {tr(
              'يرجى قراءة هذه الشروط بعناية قبل استخدام خدمات ciar للسياحة والسفر.',
              'Please read these terms carefully before using ciar travel services.',
              'Veuillez lire attentivement ces conditions avant d\'utiliser les services ciar.',
            )}
          </p>
          <p className="text-sm text-white/60 mt-4">
            {tr('آخر تحديث: يوليو 2026', 'Last updated: July 2026', 'Dernière mise à jour : juillet 2026')}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-lg">
            {tr(
              'تحكم هذه الشروط والأحكام استخدامك لموقع ciar وجميع الخدمات السياحية والسفر المقدمة من خلاله.',
              'These terms and conditions govern your use of the ciar website and all travel and tourism services offered through it.',
              'Ces conditions régissent votre utilisation du site ciar et l\'ensemble des services touristiques proposés.',
            )}
          </p>

          {sections.map((section, index) => (
            <article
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-tarhal-orange/10 flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-tarhal-orange" />
                </div>
                <h2 className="text-xl font-bold text-tarhal-blue-dark dark:text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                {section.content}
              </p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
