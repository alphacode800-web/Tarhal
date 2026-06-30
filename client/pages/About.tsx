import { useState, useEffect } from 'react';
import { Users, Award, Globe, Heart, Target, Eye, Gem, Zap, Shield, Clock, CheckCircle, Star, ArrowRight, Quote, Calendar, TrendingUp, UserCheck } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { dataManager } from '@/services/dataManager';
import {
  SOCIAL_PLATFORMS,
  getContactFromSettings,
  mergeSocialLinks,
  resolveSocialUrl,
  type SocialLinks,
  type SiteContact,
} from '@/data/socialPlatforms';
import SocialBrandIcon from '@/components/SocialBrandIcon';

export default function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(mergeSocialLinks());
  const [contact, setContact] = useState<SiteContact>(getContactFromSettings());

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await dataManager.getSettingsAsync();
      setContact(getContactFromSettings(settings));
      setSocialLinks(mergeSocialLinks(settings.socialLinks));
    };
    loadSettings();
    window.addEventListener('settingsUpdated', loadSettings);
    return () => window.removeEventListener('settingsUpdated', loadSettings);
  }, []);

  const headerImages = [
    'https://images.pexels.com/photos/33337243/pexels-photo-33337243.jpeg',
    'https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg',
    'https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg',
    'https://images.pexels.com/photos/33351942/pexels-photo-33351942.jpeg',
    'https://images.pexels.com/photos/53537/caravan-desert-safari-dune-53537.jpeg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % headerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const flipCards = [
    {
      front: {
        title: 'رؤيتنا',
        icon: <Eye className="h-8 w-8" />,
        description: 'أن نكون الشركة الرائدة عالمياً في مجال السياحة والسفر',
        color: 'from-tarhal-blue to-tarhal-blue-dark'
      },
      back: {
        content: 'نسعى لأن نكون الخيار الأول للمسافرين حول العالم من خلال تقديم خدمات استثنائية وتجارب لا تُنسى. نحلم بعالم بلا حدود حيث يمكن للجميع استكشاف جمال الأرض وثقافاتها المتنوعة.',
        details: ['الريادة في الخدمات السياحية', 'تجارب سفر استثنائية', 'تواجد عالمي متميز', 'رضا عملاء 100%']
      }
    },
    {
      front: {
        title: 'مهمتنا',
        icon: <Target className="h-8 w-8" />,
        description: 'تقديم أفضل الخدمات السياحية بمعايير عالمية',
        color: 'from-tarhal-orange to-tarhal-orange-dark'
      },
      back: {
        content: 'نقدم حلول سياحية متكاملة تشمل الحجوزات والإرشاد والدعم لضمان حصول عملائنا على تجربة سفر مثالية. نلتزم بتحويل أحلام السفر إلى ذكريات خالدة.',
        details: ['خدمات سياحية شاملة', 'دعم 24/7', 'أسعار تنافسية', 'ضمان الجودة']
      }
    },
    {
      front: {
        title: 'قيمنا',
        icon: <Gem className="h-8 w-8" />,
        description: 'الجودة والمصداقية والاحترافية في كل تفصيل',
        color: 'from-tarhal-navy to-tarhal-blue'
      },
      back: {
        content: 'نؤمن بالشفافية والصدق في التعامل مع عملائنا. نلتزم بأعلى معايير الجودة والأخلاق المهنية في جميع خدماتنا ونضع رضا العملاء فوق كل اعتبار.',
        details: ['المصداقية والشفافية', 'الاحترافية العالية', 'الالتزام بالوقت', 'التطوير المستمر']
      }
    },
    {
      front: {
        title: 'التزامنا',
        icon: <Heart className="h-8 w-8" />,
        description: 'نلتزم بتقديم تجارب سفر آمنة ومريحة',
        color: 'from-red-500 to-pink-600'
      },
      back: {
        content: 'نضع سلامة وراحة عملائنا في المقدمة. نقدم خدمات التأمين والدعم اللوجستي المتكامل لضمان رحلة آمنة ومريحة من البداية حتى النهاية.',
        details: ['ضمان السلامة', 'تأمين شامل', 'دعم طوارئ', 'متابعة مستمرة']
      }
    },
    {
      front: {
        title: 'خبرتنا',
        icon: <Award className="h-8 w-8" />,
        description: 'أكثر من 15 عاماً من الخبرة في السياحة',
        color: 'from-yellow-500 to-orange-500'
      },
      back: {
        content: 'بدأنا رحلتنا عام 2008 ونمونا لنصبح واحدة من أكبر شركات السياحة في المنطقة. خبرتنا الطويلة مكنتنا من فهم احتياجات المسافرين وتقديم أفضل الحلول.',
        details: ['15+ سنة خبرة', '100,000+ عميل سعيد', '50+ وجهة سياحية', 'فريق خبراء محترف']
      }
    },
    {
      front: {
        title: 'الابتكار',
        icon: <Zap className="h-8 w-8" />,
        description: 'نواكب أحدث التقنيات في صناعة السياحة',
        color: 'from-purple-500 to-indigo-600'
      },
      back: {
        content: 'نستخدم أحدث التقنيات والمنصات الرقمية لتسهيل عمليات الحجز والدفع. نطور باستمرار خدماتنا لتواكب توقعات العصر الرقمي.',
        details: ['حجز إلكتروني متطور', 'تطبيق جوال', 'دفع آمن', 'خدمات ذكية']
      }
    }
  ];

  const features = [
    {
      icon: <Globe className="h-12 w-12 text-tarhal-orange" />,
      title: 'تغطية عالمية',
      description: 'مكاتب في أكثر من 50 دولة حول العالم',
      stats: '50+ دولة'
    },
    {
      icon: <Users className="h-12 w-12 text-tarhal-blue" />,
      title: 'فريق محترف',
      description: 'خبراء سياحة معتمدون ومدربون على أعلى مستوى',
      stats: '500+ خبير'
    },
    {
      icon: <Shield className="h-12 w-12 text-tarhal-navy" />,
      title: 'أمان وثقة',
      description: 'حماية كاملة وتأمين شامل لجميع رحلاتكم',
      stats: '100% آمن'
    },
    {
      icon: <Clock className="h-12 w-12 text-tarhal-orange-dark" />,
      title: 'خدمة 24/7',
      description: 'دعم ومساعدة على مدار الساعة طوال أيام الأسبوع',
      stats: '24/7 دعم'
    }
  ];

  const achievements = [
    {
      icon: <Award className="h-8 w-8" />,
      title: 'أفضل شركة سياحة',
      year: '2023',
      description: 'جائزة أفضل شركة سياحة في الشرق الأوسط'
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'تقييم 5 نجوم',
      year: '2022',
      description: 'حصلنا على تقييم 5 نجوم من 95% من عملائنا'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'نمو مستمر',
      year: '2021',
      description: 'نمو بنسبة 150% في عدد العملاء'
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: 'شهادة الجودة',
      year: '2020',
      description: 'شهادة ISO للجودة في خدمات السياحة'
    }
  ];

  const timeline = [
    {
      year: '2008',
      title: 'التأسيس',
      description: 'تأسيس شركة ciar في الخرطوم، السودان',
      icon: <Calendar className="h-6 w-6" />
    },
    {
      year: '2010',
      title: 'التوسع الأول',
      description: 'افتتاح أول فرع خارج السودان في القاهرة',
      icon: <Globe className="h-6 w-6" />
    },
    {
      year: '2015',
      title: 'النمو السريع',
      description: 'الوصول إلى 25 مكتب في 15 دولة',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      year: '2018',
      title: 'التحول الرقمي',
      description: 'إطلاق منصة الحجز الإلكترونية',
      icon: <Zap className="h-6 w-6" />
    },
    {
      year: '2020',
      title: 'جائزة التميز',
      description: 'حصولنا على جائزة التميز في السياحة',
      icon: <Award className="h-6 w-6" />
    },
    {
      year: '2024',
      title: 'القيادة العالمية',
      description: 'أكثر من 50 مكتب في 6 قارات',
      icon: <Star className="h-6 w-6" />
    }
  ];

  const testimonials = [
    {
      name: 'أحمد محمد',
      location: 'الرياض، السعودية',
      text: 'تجربة رائعة مع ciar! نظموا لنا رحلة إلى تركيا كانت أكثر من رائعة. الخدمة احترافية والأسعار ممتازة.',
      rating: 5,
      image: 'https://images.pexels.com/photos/2868245/pexels-photo-2868245.jpeg'
    },
    {
      name: 'فاطمة أحمد',
      location: 'دبي، الإمارات',
      text: 'شكراً لفريق ciar على تنظيم رحلة العمرة المباركة. كل شيء كان منظم ومرتب بأعلى مستوى من الاحترافية.',
      rating: 5,
      image: 'https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg'
    },
    {
      name: 'محمد علي',
      location: 'الخرطوم، السودان',
      text: 'أنصح الجميع بالتعامل مع ciar. فريق محترف وخدمة ممتازة. رحلتي إلى ماليزيا كانت حلم تحقق.',
      rating: 5,
      image: 'https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg'
    }
  ];

  const socialLinksDisplay = SOCIAL_PLATFORMS.map((platform) => ({
    key: platform.key,
    name: platform.name.ar,
    url: resolveSocialUrl(platform.key, socialLinks, contact),
  }));

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          {headerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-tarhal-navy/90 via-tarhal-blue-dark/70 to-tarhal-orange/40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              من نحن
              <span className="block text-tarhal-orange text-3xl md:text-4xl font-normal mt-2">
                قصة نجاح ciar
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '300ms' }}>
              منذ عام 2008، نحن نصنع ذكريات لا تُنسى ونحول أحلام السفر إلى واقع جميل. 
              رحلتنا بدأت بحلم بسيط: جعل العالم أقرب إليكم
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '600ms' }}>
              <Button className="bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white px-8 py-3 text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                رحلتنا الشركة
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-tarhal-blue-dark px-8 py-3 text-lg font-semibold transition-all duration-300">
                قصص النجاح
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6">
                قصة ciar
                <span className="block text-tarhal-orange text-2xl font-normal mt-2">
                  من حلم إلى حقيقة
                </span>
              </h2>
              <div className="space-y-6 text-lg text-tarhal-gray-dark leading-relaxed">
                <p>
                  بدأت رحلة ciar عام 2008 كحلم بسيط في قلب الخرطوم. كان لدينا رؤية واضحة: 
                  أن نجعل السفر تجربة سهلة وممتعة لكل شخص يحلم باستكشاف العالم.
                </p>
                <p>
                  من مكتب صغير في السودان، نمونا لنصبح شبكة عالمية تضم أكثر من 50 مكتب 
                  في 6 قارات. كل خطوة في رحلتنا كانت مدفوعة بشغفنا لخدمة عملائنا وتحقيق أحلامهم.
                </p>
                <p>
                  اليوم، نحن فخورون بأن نكون جزءاً من ذكريات أكثر من 100,000 مسافر حول العالم. 
                  وما زلنا نحلم ونعمل لنكون الخيار الأول لكل من يريد استكشاف جمال هذا العالم.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-tarhal-orange/10 rounded-xl">
                  <div className="text-3xl font-bold text-tarhal-orange">15+</div>
                  <div className="text-tarhal-blue-dark font-medium">سنة خبرة</div>
                </div>
                <div className="text-center p-4 bg-tarhal-blue/10 rounded-xl">
                  <div className="text-3xl font-bold text-tarhal-blue">100K+</div>
                  <div className="text-tarhal-blue-dark font-medium">عميل سعيد</div>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/33337243/pexels-photo-33337243.jpeg"
                  alt="قصة ciar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tarhal-navy/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <Quote className="h-8 w-8 text-tarhal-orange mb-4" />
                  <p className="text-lg font-medium italic">
                    "رحلتنا بدأت بحلم... واليوم نحن نحقق أحلام الآخرين"
                  </p>
                  <p className="text-sm mt-2 text-white/80">- مؤسس ش��كة ciar</p>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-full flex items-center justify-center shadow-xl animate-float">
                <span className="text-white text-4xl">🏆</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Flip Cards */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              قيمنا ومبادئنا
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              المبادئ التي نؤمن بها وتوجه عملنا في كل يوم
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flipCards.map((card, index) => (
              <div
                key={index}
                className="group perspective-1000 h-80 animate-rotate-in"
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  hoveredCard === index ? 'rotate-y-180' : ''
                }`}>
                  {/* Front */}
                  <div className={`absolute inset-0 backface-hidden bg-gradient-to-br ${card.front.color} rounded-2xl p-8 flex flex-col items-center justify-center text-white shadow-xl cursor-pointer`}>
                    <div className="mb-6 p-4 bg-white/20 rounded-full">
                      {card.front.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-center">{card.front.title}</h3>
                    <p className="text-center text-white/90 leading-relaxed">{card.front.description}</p>
                    <div className="mt-6 text-sm text-white/70">
                      مرر للمزيد من التفاصيل
                    </div>
                  </div>
                  
                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl p-8 flex flex-col justify-center shadow-xl border border-tarhal-gray-light">
                    <p className="text-tarhal-gray-dark leading-relaxed mb-6">
                      {card.back.content}
                    </p>
                    <ul className="space-y-2">
                      {card.back.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-tarhal-orange flex-shrink-0" />
                          <span className="text-tarhal-blue-dark">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-tarhal-blue-dark to-tarhal-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              ما يميزنا
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
              المميزات التي تجعل ciar خيارك الأول في السفر والسياحة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-scale-in group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 mb-4 leading-relaxed">{feature.description}</p>
                <div className="inline-block px-4 py-2 bg-tarhal-orange/20 text-tarhal-orange rounded-full text-sm font-semibold">
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              رحلة النجاح
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              معالم مهمة في تاريخ شركة ciar
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-tarhal-orange to-tarhal-blue hidden lg:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } animate-slide-up`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-tarhal-gray-light">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-tarhal-orange/10 rounded-lg text-tarhal-orange">
                          {item.icon}
                        </div>
                        <span className="text-2xl font-bold text-tarhal-orange">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-tarhal-blue-dark mb-2">{item.title}</h3>
                      <p className="text-tarhal-gray-dark">{item.description}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex w-4 h-4 bg-tarhal-orange rounded-full border-4 border-white shadow-lg relative z-10"></div>

                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-br from-tarhal-orange/5 to-tarhal-blue/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tarhal-blue-dark mb-6 animate-fade-in">
              إنجازاتنا
            </h2>
            <p className="text-xl text-tarhal-gray-dark max-w-3xl mx-auto animate-slide-up">
              جوائز وتقديرات حصلنا عليها تقديراً لجهودنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-tarhal-orange/10 rounded-lg text-tarhal-orange">
                    {achievement.icon}
                  </div>
                  <span className="text-lg font-bold text-tarhal-blue-dark">{achievement.year}</span>
                </div>
                <h3 className="text-lg font-bold text-tarhal-blue-dark mb-2">{achievement.title}</h3>
                <p className="text-tarhal-gray-dark text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-tarhal-blue to-tarhal-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              شهادات عملائنا
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
              كلمات من القلب من عملائنا الكرام
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-tarhal-orange mb-4" />
                <p className="text-white/90 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-white/70">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-tarhal-blue-dark mb-4 animate-fade-in">
            تابعونا على وسائل التواصل
          </h2>
          <p className="text-tarhal-gray-dark mb-8 animate-slide-up">
            ابقوا على اطلاع بأحدث العروض والوجهات
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap animate-scale-in max-w-4xl mx-auto">
            {socialLinksDisplay.map((social, index) => (
              <a
                key={social.key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="w-16 h-16 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center hover:shadow-xl hover:border-tarhal-orange/30 transform hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <SocialBrandIcon platform={social.key} size={32} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
