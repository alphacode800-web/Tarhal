import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, Eye, Database, Mail, Cookie } from 'lucide-react';

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  const tr = (ar: string, en: string, fr: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const sections = [
    {
      icon: Database,
      title: tr('البيانات التي نجمعها', 'Data We Collect', 'Données collectées'),
      content: tr(
        'قد نجمع البيانات التالية عند استخدامك لموقع ciar: الاسم، البريد الإلكتروني، رقم الهاتف، بيانات الحجز (الوجهة، التواريخ، عدد المسافرين)، ومعلومات الدفع اللازمة لإتمام المعاملة. كما نجمع بيانات تقنية مثل عنوان IP ونوع المتصفح لتحسين تجربة الاستخدام.',
        'When you use the ciar website, we may collect: name, email, phone number, booking details (destination, dates, travelers), and payment information needed to complete transactions. We also collect technical data such as IP address and browser type to improve your experience.',
        'Lors de l\'utilisation du site ciar, nous pouvons collecter : nom, e-mail, téléphone, détails de réservation (destination, dates, voyageurs) et informations de paiement. Des données techniques (adresse IP, navigateur) sont également collectées pour améliorer l\'expérience.',
      ),
    },
    {
      icon: Eye,
      title: tr('كيف نستخدم بياناتك', 'How We Use Your Data', 'Utilisation des données'),
      content: tr(
        'نستخدم بياناتك لمعالجة الحجوزات والاستفسارات، وتقديم الدعم الفني، وإرسال تأكيدات الحجز والتحديثات المتعلقة بخدماتك. قد نرسل لك عروضاً سياحية إذا وافقت على الاشتراك في النشرة البريدية. لن نبيع بياناتك الشخصية لأطراف ثالثة.',
        'We use your data to process bookings and inquiries, provide support, and send booking confirmations and service updates. We may send travel offers if you subscribe to our newsletter. We will never sell your personal data to third parties.',
        'Nous utilisons vos données pour traiter les réservations, fournir l\'assistance et envoyer les confirmations. Des offres touristiques peuvent vous être envoyées si vous vous abonnez à notre newsletter. Nous ne vendons jamais vos données personnelles.',
      ),
    },
    {
      icon: Lock,
      title: tr('حماية البيانات', 'Data Protection', 'Protection des données'),
      content: tr(
        'نطبّق إجراءات أمنية تقنية وتنظيمية لحماية بياناتك من الوصول غير المصرح به أو الفقدان أو التعديل. تشمل ذلك التشفير أثناء النقل (HTTPS) وتقييد الوصول إلى البيانات للموظفين المخولين فقط.',
        'We apply technical and organizational security measures to protect your data from unauthorized access, loss, or alteration. This includes encryption in transit (HTTPS) and restricting data access to authorized personnel only.',
        'Nous appliquons des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou altération, notamment le chiffrement HTTPS.',
      ),
    },
    {
      icon: Cookie,
      title: tr('ملفات تعريف الارتباط', 'Cookies', 'Cookies'),
      content: tr(
        'يستخدم موقعنا ملفات تعريف الارتباط (Cookies) لتحسين الأداء وتذكر تفضيلاتك مثل اللغة والعملة. يمكنك التحكم في ملفات الارتباط من إعدادات متصفحك، لكن تعطيلها قد يؤثر على بعض وظائف الموقع.',
        'Our website uses cookies to improve performance and remember your preferences such as language and currency. You can control cookies through your browser settings, but disabling them may affect some site features.',
        'Notre site utilise des cookies pour améliorer les performances et mémoriser vos préférences (langue, devise). Vous pouvez les contrôler via votre navigateur.',
      ),
    },
    {
      icon: Shield,
      title: tr('حقوقك', 'Your Rights', 'Vos droits'),
      content: tr(
        'يحق لك طلب الاطلاع على بياناتك الشخصية أو تصحيحها أو حذفها، أو الاعتراض على معالجتها، أو سحب موافقتك في أي وقت. لممارسة هذه الحقوق، تواصل معنا عبر صفحة «اتصل بنا».',
        'You have the right to access, correct, or delete your personal data, object to its processing, or withdraw consent at any time. To exercise these rights, contact us via the Contact page.',
        'Vous avez le droit d\'accéder, de corriger ou de supprimer vos données, de vous opposer à leur traitement ou de retirer votre consentement. Contactez-nous via la page Contact.',
      ),
    },
    {
      icon: Mail,
      title: tr('التواصل معنا', 'Contact Us', 'Nous contacter'),
      content: tr(
        'لأي استفسار متعلق بسياسة الخصوصية أو بياناتك الشخصية، يرجى التواصل معنا عبر صفحة «اتصل بنا» على الموقع. نلتزم بالرد خلال 5 أيام عمل.',
        'For any questions about this privacy policy or your personal data, please contact us via the Contact page. We aim to respond within 5 business days.',
        'Pour toute question relative à cette politique ou à vos données, contactez-nous via la page Contact. Réponse sous 5 jours ouvrables.',
      ),
    },
  ];

  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
            <Shield className="h-8 w-8 text-tarhal-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {tr('سياسة الخصوصية', 'Privacy Policy', 'Politique de Confidentialité')}
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            {tr(
              'نلتزم بحماية خصوصيتك وبياناتك الشخصية عند استخدام خدمات ciar للسياحة والسفر.',
              'We are committed to protecting your privacy and personal data when using ciar travel services.',
              'Nous nous engageons à protéger votre vie privée lors de l\'utilisation des services ciar.',
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
              'توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها لنا عبر موقع ciar الإلكتروني وتطبيقاتنا وخدماتنا السياحية.',
              'This policy explains how we collect, use, and protect personal information you provide through the ciar website, apps, and travel services.',
              'Cette politique explique comment nous collectons, utilisons et protégeons les informations personnelles fournies via le site ciar et nos services.',
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
