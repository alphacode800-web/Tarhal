import { dataManager, type AdminCountryData } from '@/services/dataManager';

export interface City {
  id: string;
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
  image: string;
  attractions: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  bestTime: {
    ar: string;
    en: string;
    fr: string;
  };
  duration: {
    ar: string;
    en: string;
    fr: string;
  };
  rating: number;
  reviews: number;
  highlights: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  gallery: string[];
  videos?: string[]; // Array of video URLs
}

export interface CountryData {
  id: string;
  continent?: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  capital: {
    ar: string;
    en: string;
    fr: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  mainImage: string;
  flag: string;
  currency: {
    ar: string;
    en: string;
    fr: string;
  };
  language: {
    ar: string;
    en: string;
    fr: string;
  };
  timeZone: string;
  climate: {
    ar: string;
    en: string;
    fr: string;
  };
  bestTime: {
    ar: string;
    en: string;
    fr: string;
  };
  visaRequired: boolean;
  rating: number;
  totalReviews: number;
  totalTours: number;
  totalHotels: number;
  cities: City[];
  highlights: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  culture: {
    ar: string;
    en: string;
    fr: string;
  };
  cuisine: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  transportation: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  safety: {
    ar: string;
    en: string;
    fr: string;
  };
  gallery: string[];
  videos?: string[]; // Array of video URLs
}

/** صور معالم السودان لصفحة الهيدر (النيل، الأهرامات، جبل مرة، كردفان) */
export const SUDAN_LANDMARK_GALLERY = [
  'https://images.unsplash.com/photo-1620487792776-a257eb0c5f2c', // ملتقى النيل - جزيرة توتي، الخرطوم
  'https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg', // أهرامات مروي
  'https://images.pexels.com/photos/10546022/pexels-photo-10546022.jpeg', // أهرامات مروي - منظر آخر
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sudan_Jebel_Marra_Deriba_Lakes_edited.jpg', // جبل مرة - بحيرات دريبا
  'https://images.pexels.com/photos/10546023/pexels-photo-10546023.jpeg', // شمال كردفان
] as const;

export const isSudanLegacyImage = (url?: string) =>
  !!url &&
  (url.includes('2868245') ||
    url.includes('568026') ||
    url.includes('1181519') ||
    url.includes('2869066'));

export const countries: Record<string, CountryData> = {
  sudan: {
    id: 'sudan',
    name: {
      ar: 'السودان',
      en: 'Sudan',
      fr: 'Soudan'
    },
    capital: {
      ar: 'الخرطوم',
      en: 'Khartoum',
      fr: 'Khartoum'
    },
    description: {
      ar: 'السودان، أرض الحضارات القديمة والطبيعة الخلابة، حيث التقاء النيلين الأزرق والأبيض يصنع لوحة ساحرة من الجمال الطبيعي.',
      en: 'Sudan, land of ancient civilizations and stunning nature, where the Blue and White Niles meet to create an enchanting canvas of natural beauty.',
      fr: 'Le Soudan, terre des civilisations anciennes et de la nature époustouflante, où les Nils Bleu et Blanc se rencontrent pour créer une toile enchanteresse de beauté naturelle.'
    },
    mainImage: SUDAN_LANDMARK_GALLERY[0],
    flag: '🇸🇩',
    currency: {
      ar: 'الجنيه السوداني (SDG)',
      en: 'Sudanese Pound (SDG)',
      fr: 'Livre soudanaise (SDG)'
    },
    language: {
      ar: 'العربية، الإنجليزية',
      en: 'Arabic, English',
      fr: 'Arabe, Anglais'
    },
    timeZone: 'GMT+2',
    climate: {
      ar: 'مداري حار وجاف',
      en: 'Hot and dry tropical',
      fr: 'Tropical chaud et sec'
    },
    bestTime: {
      ar: 'نوفمبر - مارس',
      en: 'November - March',
      fr: 'Novembre - Mars'
    },
    visaRequired: true,
    rating: 4.9,
    totalReviews: 2847,
    totalTours: 25,
    totalHotels: 150,
    highlights: {
      ar: ['التقاء النيلين الأزرق والأبيض', 'الأهرامات النوبية في مروي', 'جزيرة مقرن الساحرة'],
      en: ['Blue and White Nile confluence', 'Nubian Pyramids of Meroe', 'Charming Mogran Island'],
      fr: ['Confluence des Nils Bleu et Blanc', 'Pyramides nubiennes de Méroé', 'Île charmante de Mogran']
    },
    culture: {
      ar: 'السودان بلد متنوع ثقافياً، يحتضن أكثر من 500 قبيلة وجماعة إثنية مختلفة.',
      en: 'Sudan is a culturally diverse country, home to more than 500 different tribes and ethnic groups.',
      fr: 'Le Soudan est un pays culturellement diversifié, abritant plus de 500 tribus et groupes ethniques différents.'
    },
    cuisine: {
      ar: ['الملاح (اللحم بالبامية)', 'الكسرة والملا', 'الودك والسلطة'],
      en: ['Mulah (meat with okra)', 'Kisra and Mullah', 'Wadak and salad'],
      fr: ['Mulah (viande aux gombos)', 'Kisra et Mullah', 'Wadak et salade']
    },
    transportation: {
      ar: ['طيران السودان ومطار الخرطوم الدولي', 'شبكة حافلات داخلية', 'تأجير السيارات'],
      en: ['Sudan Airways and Khartoum International Airport', 'Domestic bus network', 'Car rental'],
      fr: ['Sudan Airways et Aéroport International de Khartoum', 'Réseau de bus domestique', 'Location de voitures']
    },
    safety: {
      ar: 'السودان بلد آمن للسياحة مع ا��خاذ الاحتياطات المعتادة.',
      en: 'Sudan is a safe country for tourism with standard precautions.',
      fr: 'Le Soudan est un pays sûr pour le tourisme avec les précautions standard.'
    },
    cities: [
      {
        id: 'khartoum',
        name: {
          ar: 'الخرطوم',
          en: 'Khartoum',
          fr: 'Khartoum'
        },
        description: {
          ar: 'العاصمة السودانية الجميلة، حيث يلتقي النيلان الأزرق والأبيض ليكونا النيل الأبيض.',
          en: 'The beautiful Sudanese capital where the Blue and White Niles meet to form the White Nile.',
          fr: 'La belle capitale soudanaise où les Nils Bleu et Blanc se rencontrent pour former le Nil Blanc.'
        },
        image: SUDAN_LANDMARK_GALLERY[0],
        attractions: {
          ar: ['التقاء النيلين', 'القصر الجمهوري', 'جامعة الخرطوم'],
          en: ['Nile Confluence', 'Republican Palace', 'University of Khartoum'],
          fr: ['Confluence du Nil', 'Palais Républicain', 'Université de Khartoum']
        },
        bestTime: {
          ar: '��وفمبر - فبراير',
          en: 'November - February',
          fr: 'Novembre - Février'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.8,
        reviews: 1250,
        highlights: {
          ar: ['نقطة التقاء النيلين', 'العمارة الاستعمارية'],
          en: ['Nile confluence point', 'Colonial architecture'],
          fr: ['Point de confluence du Nil', 'Architecture coloniale']
        },
        gallery: [SUDAN_LANDMARK_GALLERY[0]]
      },
      {
        id: 'portsudan',
        name: { ar: 'بورتسودان', en: 'Port Sudan', fr: 'Port-Soudan' },
        description: {
          ar: 'الميناء الرئيسي للسودان على البحر الأحمر، مدينة ساحلية جميلة تشتهر بالشعاب المرجانية والغوص.',
          en: 'Sudan\'s main port on the Red Sea, a beautiful coastal city famous for coral reefs and diving.',
          fr: 'Le principal port du Soudan sur la mer Rouge, une belle ville côtière célèbre pour ses récifs coralliens et la plongée.'
        },
        image: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
        attractions: {
          ar: ['الشعاب المرجانية', 'شاطئ أركويت', 'ميناء بورتسودان', 'جزر سواكن'],
          en: ['Coral reefs', 'Arkowit Beach', 'Port Sudan Harbor', 'Suakin Islands'],
          fr: ['Récifs coralliens', 'Plage d\'Arkowit', 'Port de Port-Soudan', 'Îles de Suakin']
        },
        bestTime: { ar: 'ديسمبر - مارس', en: 'December - March', fr: 'Décembre - Mars' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.6,
        reviews: 890,
        highlights: {
          ar: ['الغوص والسباحة', 'الشواطئ الرملية', 'الحياة البحرية'],
          en: ['Diving and swimming', 'Sandy beaches', 'Marine life'],
          fr: ['Plongée et natation', 'Plages de sable', 'Vie marine']
        },
        gallery: ['https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg']
      },
      {
        id: 'kassala',
        name: { ar: 'كسلا', en: 'Kassala', fr: 'Kassala' },
        description: {
          ar: 'مدينة جبلية ساحرة في شرق السودان، تشتهر بجبل التاكا والثقافة المتنوعة.',
          en: 'A charming mountain city in eastern Sudan, famous for Mount Taka and diverse culture.',
          fr: 'Une charmante ville de montagne dans l\'est du Soudan, célèbre pour le mont Taka et la culture diversifiée.'
        },
        image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
        attractions: {
          ar: ['جبل التاكا', 'سوق كسلا التقليدي', 'وادي حلفا', 'الآثار التاريخية'],
          en: ['Mount Taka', 'Kassala Traditional Market', 'Halfa Valley', 'Historical monuments'],
          fr: ['Mont Taka', 'Marché traditionnel de Kassala', 'Vallée de Halfa', 'Monuments historiques']
        },
        bestTime: { ar: 'أكتوبر - أبريل', en: 'October - April', fr: 'Octobre - Avril' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 650,
        highlights: {
          ar: ['المناظر الجبلية', 'الثقافة المحلية', 'الفنون التقليدية'],
          en: ['Mountain views', 'Local culture', 'Traditional arts'],
          fr: ['Vues de montagne', 'Culture locale', 'Arts traditionnels']
        },
        gallery: ['https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg']
      },
      {
        id: 'wadmedani',
        name: { ar: 'ود مدني', en: 'Wad Medani', fr: 'Wad Medani' },
        description: {
          ar: 'عاصمة ولاية الجزيرة، مدينة زراعية هادئة على ضفاف النيل الأزرق.',
          en: 'Capital of Gezira State, a quiet agricultural city on the banks of the Blue Nile.',
          fr: 'Capitale de l\'État de Gezira, une ville agricole tranquille sur les rives du Nil Bleu.'
        },
        image: 'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg',
        attractions: {
          ar: ['النيل الأزرق', 'مشروع الجزيرة', 'جامعة الجزيرة', 'الأسواق الزراعية'],
          en: ['Blue Nile', 'Gezira Scheme', 'University of Gezira', 'Agricultural markets'],
          fr: ['Nil Bleu', 'Projet Gezira', 'Université de Gezira', 'Marchés agricoles']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.3,
        reviews: 420,
        highlights: {
          ar: ['المناطق الزراعية', 'النيل الأزرق', 'الهدوء والاسترخاء'],
          en: ['Agricultural areas', 'Blue Nile', 'Peace and relaxation'],
          fr: ['Zones agricoles', 'Nil Bleu', 'Paix et détente']
        },
        gallery: ['https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg']
      },
      {
        id: 'elobeid',
        name: { ar: 'الأبيض', en: 'El Obeid', fr: 'El Obeid' },
        description: {
          ar: 'عاصمة ولاية شمال كردفان، مدينة تجارية مهمة في وسط السودان.',
          en: 'Capital of North Kordofan State, an important commercial city in central Sudan.',
          fr: 'Capitale de l\'État du Kordofan du Nord, une importante ville commerciale au centre du Soudan.'
        },
        image: 'https://images.pexels.com/photos/2901211/pexels-photo-2901211.jpeg',
        attractions: {
          ar: ['سوق الأبيض الكبير', 'المساجد التاريخية', 'المناطق الصحراوية', 'الثقافة المحلية'],
          en: ['El Obeid Grand Market', 'Historical mosques', 'Desert areas', 'Local culture'],
          fr: ['Grand marché d\'El Obeid', 'Mosquées historiques', 'Zones désertiques', 'Culture locale']
        },
        bestTime: { ar: 'نوفمبر - فبراير', en: 'November - February', fr: 'Novembre - Février' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.2,
        reviews: 380,
        highlights: {
          ar: ['التجارة التقليدية', 'الثقافة الكردفانية', 'الصحراء'],
          en: ['Traditional trade', 'Kordofan culture', 'Desert'],
          fr: ['Commerce traditionnel', 'Culture du Kordofan', 'Désert']
        },
        gallery: ['https://images.pexels.com/photos/2901211/pexels-photo-2901211.jpeg']
      },
      {
        id: 'dongola',
        name: { ar: 'دنقلا', en: 'Dongola', fr: 'Dongola' },
        description: {
          ar: 'مدينة تاريخية على ضفاف النيل في شمال السودان، موطن الآثار النوبية القديمة.',
          en: 'A historical city on the banks of the Nile in northern Sudan, home to ancient Nubian monuments.',
          fr: 'Une ville historique sur les rives du Nil dans le nord du Soudan, berceau des monuments nubiens anciens.'
        },
        image: 'https://images.pexels.com/photos/2901213/pexels-photo-2901213.jpeg',
        attractions: {
          ar: ['الآثار النوبية', 'قلعة دنقلا', 'النيل', 'المتاحف التاريخية'],
          en: ['Nubian monuments', 'Dongola Fortress', 'Nile River', 'Historical museums'],
          fr: ['Monuments nubiens', 'Forteresse de Dongola', 'Nil', 'Musées historiques']
        },
        bestTime: { ar: 'ديسمبر - فبراير', en: 'December - February', fr: 'Décembre - Février' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.7,
        reviews: 720,
        highlights: {
          ar: ['التراث النوبي', 'الآثار القديمة', 'النيل'],
          en: ['Nubian heritage', 'Ancient monuments', 'Nile River'],
          fr: ['Patrimoine nubien', 'Monuments anciens', 'Nil']
        },
        gallery: ['https://images.pexels.com/photos/2901213/pexels-photo-2901213.jpeg']
      },
      {
        id: 'atbara',
        name: { ar: 'عطبرة', en: 'Atbara', fr: 'Atbara' },
        description: {
          ar: 'مدينة سكك حديد السودان، تقع عند التقاء نهر عطبرة مع النيل.',
          en: 'Sudan\'s railway city, located at the confluence of the Atbara River and the Nile.',
          fr: 'La ville ferroviaire du Soudan, située à la confluence de la rivière Atbara et du Nil.'
        },
        image: 'https://images.pexels.com/photos/2901217/pexels-photo-2901217.jpeg',
        attractions: {
          ar: ['متحف السكك الحديدية', 'نهر عطبرة', 'الجسور التاريخية', 'المناطق الصناعية'],
          en: ['Railway Museum', 'Atbara River', 'Historical bridges', 'Industrial areas'],
          fr: ['Musée du chemin de fer', 'Rivière Atbara', 'Ponts historiques', 'Zones industrielles']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.1,
        reviews: 310,
        highlights: {
          ar: ['تاريخ السكك الحديدية', 'التقاء الأنهار', 'التراث الصناعي'],
          en: ['Railway history', 'River confluence', 'Industrial heritage'],
          fr: ['Histoire ferroviaire', 'Confluence des rivières', 'Patrimoine industriel']
        },
        gallery: ['https://images.pexels.com/photos/2901217/pexels-photo-2901217.jpeg']
      },
      {
        id: 'karima',
        name: { ar: 'كريمة', en: 'Karima', fr: 'Karima' },
        description: {
          ar: 'مدينة صغيرة جميلة بالقرب من أهرامات مروي، بوابة للتراث النوبي القديم.',
          en: 'A beautiful small city near the Meroe pyramids, gateway to ancient Nubian heritage.',
          fr: 'Une belle petite ville près des pyramides de Méroé, porte d\'entrée du patrimoine nubien ancien.'
        },
        image: 'https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg',
        attractions: {
          ar: ['أهرامات مروي', 'جبل البركل', 'الآثار النوبية', 'المعابد القديمة'],
          en: ['Meroe Pyramids', 'Jebel Barkal', 'Nubian monuments', 'Ancient temples'],
          fr: ['Pyramides de Méroé', 'Jebel Barkal', 'Monuments nubiens', 'Temples anciens']
        },
        bestTime: { ar: 'ديسمبر - فبراير', en: 'December - February', fr: 'Décembre - Février' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.9,
        reviews: 1100,
        highlights: {
          ar: ['الأهرامات النوبية', 'التراث القديم', 'المناظر الطبيعية'],
          en: ['Nubian pyramids', 'Ancient heritage', 'Natural landscapes'],
          fr: ['Pyramides nubiennes', 'Patrimoine ancien', 'Paysages naturels']
        },
        gallery: ['https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg']
      },
      {
        id: 'meroe',
        name: { ar: 'مروي', en: 'Meroe', fr: 'Méroé' },
        description: {
          ar: 'موقع أهرامات مروي الشهيرة، عاصمة مملكة كوش القديمة.',
          en: 'Site of the famous Meroe pyramids, capital of the ancient Kingdom of Kush.',
          fr: 'Site des célèbres pyramides de Méroé, capitale de l\'ancien royaume de Kouch.'
        },
        image: 'https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg',
        attractions: {
          ar: ['أهرامات مروي الملكية', 'المعابد النوبية', 'المقابر الملكية', 'المتحف الأثري'],
          en: ['Royal Meroe Pyramids', 'Nubian temples', 'Royal tombs', 'Archaeological museum'],
          fr: ['Pyramides royales de Méroé', 'Temples nubiens', 'Tombes royales', 'Musée archéologique']
        },
        bestTime: { ar: 'ديسمبر - فبراير', en: 'December - February', fr: 'Décembre - Février' },
        duration: { ar: '4-5 أيام', en: '4-5 days', fr: '4-5 jours' },
        rating: 5.0,
        reviews: 1850,
        highlights: {
          ar: ['الأهرامات النوبية', 'التراث العالمي', 'التاريخ القديم'],
          en: ['Nubian pyramids', 'World heritage', 'Ancient history'],
          fr: ['Pyramides nubiennes', 'Patrimoine mondial', 'Histoire ancienne']
        },
        gallery: ['https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg']
      },
      {
        id: 'shendi',
        name: { ar: 'شندي', en: 'Shendi', fr: 'Shendi' },
        description: {
          ar: 'مدينة تجارية تاريخية على النيل، بوابة للوصول إلى أهرامات مروي.',
          en: 'A historical commercial city on the Nile, gateway to the Meroe pyramids.',
          fr: 'Une ville commerciale historique sur le Nil, porte d\'entrée vers les pyramides de Méroé.'
        },
        image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
        attractions: {
          ar: ['سوق شندي', 'النيل', 'الآثار القريبة', 'الثقافة المحلية'],
          en: ['Shendi Market', 'Nile River', 'Nearby monuments', 'Local culture'],
          fr: ['Marché de Shendi', 'Nil', 'Monuments proches', 'Culture locale']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.3,
        reviews: 450,
        highlights: {
          ar: ['التجارة التقليدية', 'القرب من مروي', 'النيل'],
          en: ['Traditional trade', 'Proximity to Meroe', 'Nile River'],
          fr: ['Commerce traditionnel', 'Proximité de Méroé', 'Nil']
        },
        gallery: ['https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg']
      },
      {
        id: 'sennar',
        name: { ar: 'سنار', en: 'Sennar', fr: 'Sennar' },
        description: {
          ar: 'مدينة تاريخية على النيل الأزرق، كانت عاصمة مملكة الفونج.',
          en: 'A historical city on the Blue Nile, once the capital of the Funj Kingdom.',
          fr: 'Une ville historique sur le Nil Bleu, autrefois capitale du royaume Funj.'
        },
        image: 'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg',
        attractions: {
          ar: ['قلعة سنار', 'النيل الأزرق', 'الآثار التاريخية', 'المساجد القديمة'],
          en: ['Sennar Fortress', 'Blue Nile', 'Historical monuments', 'Old mosques'],
          fr: ['Forteresse de Sennar', 'Nil Bleu', 'Monuments historiques', 'Vieilles mosquées']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.4,
        reviews: 580,
        highlights: {
          ar: ['التراث التاريخي', 'مملكة الفونج', 'النيل الأزرق'],
          en: ['Historical heritage', 'Funj Kingdom', 'Blue Nile'],
          fr: ['Patrimoine historique', 'Royaume Funj', 'Nil Bleu']
        },
        gallery: ['https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg']
      },
      {
        id: 'gedaref',
        name: { ar: 'القضارف', en: 'Gedaref', fr: 'Gedaref' },
        description: {
          ar: 'مدينة زراعية مهمة في شرق السودان، تشتهر بزراعة السمسم والحبوب.',
          en: 'An important agricultural city in eastern Sudan, famous for sesame and grain cultivation.',
          fr: 'Une importante ville agricole dans l\'est du Soudan, célèbre pour la culture du sésame et des céréales.'
        },
        image: 'https://images.pexels.com/photos/2901211/pexels-photo-2901211.jpeg',
        attractions: {
          ar: ['المزارع الواسعة', 'سوق القضارف', 'المناطق الزراعية', 'الثقافة المحلية'],
          en: ['Vast farms', 'Gedaref Market', 'Agricultural areas', 'Local culture'],
          fr: ['Vastes fermes', 'Marché de Gedaref', 'Zones agricoles', 'Culture locale']
        },
        bestTime: { ar: 'أكتوبر - أبريل', en: 'October - April', fr: 'Octobre - Avril' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.2,
        reviews: 340,
        highlights: {
          ar: ['الزراعة', 'المناطق الخضراء', 'الاسترخاء'],
          en: ['Agriculture', 'Green areas', 'Relaxation'],
          fr: ['Agriculture', 'Zones vertes', 'Détente']
        },
        gallery: ['https://images.pexels.com/photos/2901211/pexels-photo-2901211.jpeg']
      },
      {
        id: 'elfasher',
        name: { ar: 'الفاشر', en: 'El Fasher', fr: 'El Fasher' },
        description: {
          ar: 'عاصمة ولاية شمال دارفور، مدينة صحراوية ذات ثقافة غنية.',
          en: 'Capital of North Darfur State, a desert city with rich culture.',
          fr: 'Capitale de l\'État du Darfour du Nord, une ville désertique à la culture riche.'
        },
        image: 'https://images.pexels.com/photos/2901213/pexels-photo-2901213.jpeg',
        attractions: {
          ar: ['الصحراء', 'الثقافة الدارفورية', 'الأسواق التقليدية', 'المساجد'],
          en: ['Desert', 'Darfur culture', 'Traditional markets', 'Mosques'],
          fr: ['Désert', 'Culture du Darfour', 'Marchés traditionnels', 'Mosquées']
        },
        bestTime: { ar: 'نوفمبر - فبراير', en: 'November - February', fr: 'Novembre - Février' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.3,
        reviews: 410,
        highlights: {
          ar: ['الثقافة المحلية', 'الصحراء', 'التراث الدارفوري'],
          en: ['Local culture', 'Desert', 'Darfur heritage'],
          fr: ['Culture locale', 'Désert', 'Patrimoine du Darfour']
        },
        gallery: ['https://images.pexels.com/photos/2901213/pexels-photo-2901213.jpeg']
      },
      {
        id: 'nyala',
        name: { ar: 'نيالا', en: 'Nyala', fr: 'Nyala' },
        description: {
          ar: 'عاصمة ولاية جنوب دارفور، أكبر مدينة في دارفور.',
          en: 'Capital of South Darfur State, the largest city in Darfur.',
          fr: 'Capitale de l\'État du Darfour du Sud, la plus grande ville du Darfour.'
        },
        image: 'https://images.pexels.com/photos/2901217/pexels-photo-2901217.jpeg',
        attractions: {
          ar: ['سوق نيالا الكبير', 'الثقافة الدارفورية', 'المناطق الصحراوية', 'الفنون التقليدية'],
          en: ['Nyala Grand Market', 'Darfur culture', 'Desert areas', 'Traditional arts'],
          fr: ['Grand marché de Nyala', 'Culture du Darfour', 'Zones désertiques', 'Arts traditionnels']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.4,
        reviews: 520,
        highlights: {
          ar: ['التجارة', 'الثقافة', 'الصحراء'],
          en: ['Trade', 'Culture', 'Desert'],
          fr: ['Commerce', 'Culture', 'Désert']
        },
        gallery: ['https://images.pexels.com/photos/2901217/pexels-photo-2901217.jpeg']
      },
      {
        id: 'kadugli',
        name: { ar: 'كادقلي', en: 'Kadugli', fr: 'Kadugli' },
        description: {
          ar: 'عاصمة ولاية جنوب كردفان، مدينة جبلية جميلة.',
          en: 'Capital of South Kordofan State, a beautiful mountain city.',
          fr: 'Capitale de l\'État du Kordofan du Sud, une belle ville de montagne.'
        },
        image: 'https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg',
        attractions: {
          ar: ['الجبال', 'الثقافة المحلية', 'المناطق الطبيعية', 'الأسواق'],
          en: ['Mountains', 'Local culture', 'Natural areas', 'Markets'],
          fr: ['Montagnes', 'Culture locale', 'Zones naturelles', 'Marchés']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.2,
        reviews: 290,
        highlights: {
          ar: ['المناظر الجبلية', 'الطبيعة', 'الثقافة'],
          en: ['Mountain views', 'Nature', 'Culture'],
          fr: ['Vues de montagne', 'Nature', 'Culture']
        },
        gallery: ['https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg']
      },
      {
        id: 'damazin',
        name: { ar: 'الدمازين', en: 'Damazin', fr: 'Damazin' },
        description: {
          ar: 'عاصمة ولاية النيل الأزرق، مدينة على ضفاف النيل الأزرق.',
          en: 'Capital of Blue Nile State, a city on the banks of the Blue Nile.',
          fr: 'Capitale de l\'État du Nil Bleu, une ville sur les rives du Nil Bleu.'
        },
        image: 'https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg',
        attractions: {
          ar: ['النيل الأزرق', 'سد الروصيرص', 'المناطق الزراعية', 'الطبيعة'],
          en: ['Blue Nile', 'Roseires Dam', 'Agricultural areas', 'Nature'],
          fr: ['Nil Bleu', 'Barrage de Roseires', 'Zones agricoles', 'Nature']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.3,
        reviews: 360,
        highlights: {
          ar: ['النيل الأزرق', 'السد', 'الزراعة'],
          en: ['Blue Nile', 'Dam', 'Agriculture'],
          fr: ['Nil Bleu', 'Barrage', 'Agriculture']
        },
        gallery: ['https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg']
      },
      {
        id: 'kosti',
        name: { ar: 'القطينة', en: 'Kosti', fr: 'Kosti' },
        description: {
          ar: 'مدينة على النيل الأبيض، مركز تجاري مهم.',
          en: 'A city on the White Nile, an important commercial center.',
          fr: 'Une ville sur le Nil Blanc, un important centre commercial.'
        },
        image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
        attractions: {
          ar: ['النيل الأبيض', 'السوق التجاري', 'الجسور', 'المناطق الزراعية'],
          en: ['White Nile', 'Commercial market', 'Bridges', 'Agricultural areas'],
          fr: ['Nil Blanc', 'Marché commercial', 'Ponts', 'Zones agricoles']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.1,
        reviews: 280,
        highlights: {
          ar: ['النيل الأبيض', 'التجارة', 'الهدوء'],
          en: ['White Nile', 'Trade', 'Tranquility'],
          fr: ['Nil Blanc', 'Commerce', 'Tranquillité']
        },
        gallery: ['https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg']
      },
      {
        id: 'hasahisa',
        name: { ar: 'الحصاحيصا', en: 'Hasahisa', fr: 'Hasahisa' },
        description: {
          ar: 'مدينة زراعية في ولاية الجزيرة، تشتهر بالقطن والزراعة.',
          en: 'An agricultural city in Gezira State, famous for cotton and agriculture.',
          fr: 'Une ville agricole dans l\'État de Gezira, célèbre pour le coton et l\'agriculture.'
        },
        image: 'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg',
        attractions: {
          ar: ['المزارع', 'المناطق الزراعية', 'النيل الأزرق', 'الطبيعة'],
          en: ['Farms', 'Agricultural areas', 'Blue Nile', 'Nature'],
          fr: ['Fermes', 'Zones agricoles', 'Nil Bleu', 'Nature']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.0,
        reviews: 220,
        highlights: {
          ar: ['الزراعة', 'الطبيعة', 'الاسترخاء'],
          en: ['Agriculture', 'Nature', 'Relaxation'],
          fr: ['Agriculture', 'Nature', 'Détente']
        },
        gallery: ['https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg']
      },
      {
        id: 'rafaa',
        name: { ar: 'رفاعة', en: 'Rafaa', fr: 'Rafaa' },
        description: {
          ar: 'مدينة تاريخية في ولاية الجزيرة، موطن للتراث الثقافي.',
          en: 'A historical city in Gezira State, home to cultural heritage.',
          fr: 'Une ville historique dans l\'État de Gezira, berceau du patrimoine culturel.'
        },
        image: 'https://images.pexels.com/photos/2901211/pexels-photo-2901211.jpeg',
        attractions: {
          ar: ['التراث الثقافي', 'المساجد القديمة', 'الأسواق', 'التاريخ'],
          en: ['Cultural heritage', 'Old mosques', 'Markets', 'History'],
          fr: ['Patrimoine culturel', 'Vieilles mosquées', 'Marchés', 'Histoire']
        },
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March', fr: 'Novembre - Mars' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.1,
        reviews: 250,
        highlights: {
          ar: ['التراث', 'التاريخ', 'الثقافة'],
          en: ['Heritage', 'History', 'Culture'],
          fr: ['Patrimoine', 'Histoire', 'Culture']
        },
        gallery: ['https://images.pexels.com/photos/2901211/pexels-photo-2901211.jpeg']
      },
      {
        id: 'suakin',
        name: { ar: 'سواكن', en: 'Suakin', fr: 'Suakin' },
        description: {
          ar: 'مدينة ساحلية تاريخية على البحر الأحمر، كانت ميناءً مهماً في الماضي.',
          en: 'A historical coastal city on the Red Sea, once an important port.',
          fr: 'Une ville côtière historique sur la mer Rouge, autrefois un port important.'
        },
        image: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
        attractions: {
          ar: ['الآثار التاريخية', 'الميناء القديم', 'البحر الأحمر', 'التراث المعماري'],
          en: ['Historical monuments', 'Old port', 'Red Sea', 'Architectural heritage'],
          fr: ['Monuments historiques', 'Vieux port', 'Mer Rouge', 'Patrimoine architectural']
        },
        bestTime: { ar: 'ديسمبر - مارس', en: 'December - March', fr: 'Décembre - Mars' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.6,
        reviews: 680,
        highlights: {
          ar: ['التراث التاريخي', 'البحر الأحمر', 'الآثار'],
          en: ['Historical heritage', 'Red Sea', 'Monuments'],
          fr: ['Patrimoine historique', 'Mer Rouge', 'Monuments']
        },
        gallery: ['https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg']
      }
    ],
    gallery: [...SUDAN_LANDMARK_GALLERY],
  },

  saudi: {
    id: 'saudi',
    name: {
      ar: 'المملكة العربية السعودية',
      en: 'Saudi Arabia',
      fr: 'Arabie Saoudite'
    },
    capital: {
      ar: 'الرياض',
      en: 'Riyadh',
      fr: 'Riyad'
    },
    description: {
      ar: 'المملكة العربية السعودية، أرض الحرمين الشريفين ومهبط الوحي.',
      en: 'Saudi Arabia, land of the Two Holy Mosques and the birthplace of Islam.',
      fr: 'L\'Arabie Saoudite, terre des Deux Saintes Mosquées et berceau de l\'Islam.'
    },
    mainImage: 'https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg',
    flag: '🇸🇦',
    currency: {
      ar: 'الريال السعودي (SAR)',
      en: 'Saudi Riyal (SAR)',
      fr: 'Riyal saoudien (SAR)'
    },
    language: {
      ar: 'العربية',
      en: 'Arabic',
      fr: 'Arabe'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'صحراوي حار وجاف',
      en: 'Hot and dry desert',
      fr: 'Désert chaud et sec'
    },
    bestTime: {
      ar: 'نوفمبر - فبراير',
      en: 'November - February',
      fr: 'Novembre - Février'
    },
    visaRequired: true,
    rating: 4.7,
    totalReviews: 8945,
    totalTours: 35,
    totalHotels: 520,
    highlights: {
      ar: ['المسجد الحرام والكعبة المشرفة', 'المسجد النبوي الشريف', 'مدائن صالح'],
      en: ['The Grand Mosque and Holy Kaaba', 'Prophet\'s Mosque', 'Mada\'in Salih'],
      fr: ['La Grande Mosquée et la Sainte Kaaba', 'Mosquée du Prophète', 'Mada\'in Salih']
    },
    culture: {
      ar: 'المملكة العربية السعودية مهد الإسلام والثقافة العربية الأصيلة.',
      en: 'Saudi Arabia is the cradle of Islam and authentic Arab culture.',
      fr: 'L\'Arabie Saoudite est le berceau de l\'Islam et de la culture arabe authentique.'
    },
    cuisine: {
      ar: ['الكبسة السعودية', 'المندي والمظبي', 'الجريش والقرصان'],
      en: ['Saudi Kabsa', 'Mandi and Madhbi', 'Jareesh and Qursan'],
      fr: ['Kabsa saoudien', 'Mandi et Madhbi', 'Jareesh et Qursan']
    },
    transportation: {
      ar: ['الخطوط السعودية', 'قطار الحرمين السريع', 'شبكة طرق حديثة'],
      en: ['Saudi Airlines', 'Haramain High Speed Rail', 'Modern road network'],
      fr: ['Saudi Airlines', 'Train à grande vitesse Haramain', 'Réseau routier moderne']
    },
    safety: {
      ar: 'المملكة من أأمن دول العالم للسياحة والسفر.',
      en: 'The Kingdom is one of the safest countries in the world for tourism and travel.',
      fr: 'Le Royaume est l\'un des pays les plus sûrs au monde pour le tourisme et les voyages.'
    },
    cities: [
      {
        id: 'riyadh',
        name: {
          ar: 'الرياض',
          en: 'Riyadh',
          fr: 'Riyad'
        },
        description: {
          ar: 'العاصمة السعودية النابضة بالحياة، مركز التجارة والاقتصاد.',
          en: 'The vibrant Saudi capital, center of commerce and economy.',
          fr: 'La capitale saoudienne dynamique, centre du commerce et de l\'économie.'
        },
        image: 'https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg',
        attractions: {
          ar: ['برج المملكة', 'المتحف الوطني', 'قصر المصمك'],
          en: ['Kingdom Tower', 'National Museum', 'Masmak Palace'],
          fr: ['Tour du Royaume', 'Musée National', 'Palais Masmak']
        },
        bestTime: {
          ar: 'نوفمبر - مارس',
          en: 'November - March',
          fr: 'Novembre - Mars'
        },
        duration: {
          ar: '3-4 أيام',
          en: '3-4 days',
          fr: '3-4 jours'
        },
        rating: 4.6,
        reviews: 2150,
        highlights: {
          ar: ['الأبراج الحديثة', 'التراث السعودي'],
          en: ['Modern towers', 'Saudi heritage'],
          fr: ['Tours modernes', 'Patrimoine saoudien']
        },
        gallery: ['https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/31565687/pexels-photo-31565687.jpeg']
  },

  uae: {
    id: 'uae',
    name: {
      ar: 'الإمارات العربية المتحدة',
      en: 'United Arab Emirates',
      fr: 'Émirats Arabes Unis'
    },
    capital: {
      ar: 'أبوظبي',
      en: 'Abu Dhabi',
      fr: 'Abu Dhabi'
    },
    description: {
      ar: 'دولة الإمارات العربية المتحدة، أرض المستقبل والفخامة حيث ناطحات السحاب تلامس النجوم.',
      en: 'The United Arab Emirates, land of the future and luxury where skyscrapers touch the stars.',
      fr: 'Les Émirats Arabes Unis, terre du futur et du luxe où les gratte-ciel touchent les étoiles.'
    },
    mainImage: 'https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg',
    flag: '🇦🇪',
    currency: {
      ar: 'الدرهم الإماراتي (AED)',
      en: 'UAE Dirham (AED)',
      fr: 'Dirham des EAU (AED)'
    },
    language: {
      ar: 'العربية، الإنجليزية',
      en: 'Arabic, English',
      fr: 'Arabe, Anglais'
    },
    timeZone: 'GMT+4',
    climate: {
      ar: 'صحراوي حار ورطب',
      en: 'Hot and humid desert',
      fr: 'Désert chaud et humide'
    },
    bestTime: {
      ar: 'نوفمبر - مارس',
      en: 'November - March',
      fr: 'Novembre - Mars'
    },
    visaRequired: false,
    rating: 4.9,
    totalReviews: 12458,
    totalTours: 40,
    totalHotels: 680,
    highlights: {
      ar: ['برج خليفة أطول مبنى في العالم', 'جزر النخلة الاصطناعية', 'مسجد الشيخ زايد الكبير'],
      en: ['Burj Khalifa - world\'s tallest building', 'Artificial Palm Islands', 'Sheikh Zayed Grand Mosque'],
      fr: ['Burj Khalifa - plus haut bâtiment du monde', 'Îles Palm artificielles', 'Grande Mosquée Sheikh Zayed']
    },
    culture: {
      ar: 'الإمارات تجمع بين التراث البدوي الأصيل والثقافة العالمية الحديثة.',
      en: 'The UAE combines authentic Bedouin heritage with modern global culture.',
      fr: 'Les EAU combinent l\'héritage bédouin authentique avec la culture mondiale moderne.'
    },
    cuisine: {
      ar: ['المجبوس الإماراتي', 'الهريس والثريد', 'اللقيمات والخنفروش'],
      en: ['Emirati Majboos', 'Harees and Thareed', 'Luqaimat and Khanfaroosh'],
      fr: ['Majboos émirati', 'Harees et Thareed', 'Luqaimat et Khanfaroosh']
    },
    transportation: {
      ar: ['طيران الإمارات', 'مترو دبي وترام', 'تأجير السيارات الفاخرة'],
      en: ['Emirates Airlines', 'Dubai Metro and Tram', 'Luxury car rental'],
      fr: ['Emirates Airlines', 'Métro et Tram de Dubaï', 'Location de voitures de luxe']
    },
    safety: {
      ar: 'الإمارات من أأمن دول العالم بنظام أمني متطور.',
      en: 'The UAE is one of the safest countries in the world with an advanced security system.',
      fr: 'Les EAU sont l\'un des pays les plus sûrs au monde avec un système de sécurité avancé.'
    },
    cities: [
      {
        id: 'dubai',
        name: {
          ar: 'دبي',
          en: 'Dubai',
          fr: 'Dubaï'
        },
        description: {
          ar: 'مدينة المستقبل والابتكار، حيث تتلاقى الأحلام مع الواقع.',
          en: 'The city of the future and innovation, where dreams meet reality.',
          fr: 'La ville du futur et de l\'innovation, où les rêves rencontrent la réalité.'
        },
        image: 'https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg',
        attractions: {
          ar: ['برج خليفة', 'نافورة دبي', 'مول دبي'],
          en: ['Burj Khalifa', 'Dubai Fountain', 'Dubai Mall'],
          fr: ['Burj Khalifa', 'Fontaine de Dubaï', 'Dubai Mall']
        },
        bestTime: {
          ar: 'نوفمبر - أبريل',
          en: 'November - April',
          fr: 'Novembre - Avril'
        },
        duration: {
          ar: '3-5 أيام',
          en: '3-5 days',
          fr: '3-5 jours'
        },
        rating: 4.9,
        reviews: 5200,
        highlights: {
          ar: ['ناطحات السحاب', 'التسوق الفاخر'],
          en: ['Skyscrapers', 'Luxury shopping'],
          fr: ['Gratte-ciel', 'Shopping de luxe']
        },
        gallery: ['https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/33338662/pexels-photo-33338662.jpeg']
  },

  egypt: {
    id: 'egypt',
    continent: 'africa',
    name: {
      ar: 'مصر',
      en: 'Egypt',
      fr: 'Égypte'
    },
    capital: {
      ar: 'القاهرة',
      en: 'Cairo',
      fr: 'Le Caire'
    },
    description: {
      ar: 'مصر، أم الدنيا وأرض الفراعنة، حيث تحتضن أهرامات الجيزة وأبو الهول.',
      en: 'Egypt, Mother of the World and land of the Pharaohs, home to the Giza Pyramids and Sphinx.',
      fr: 'L\'Égypte, Mère du Monde et terre des Pharaons, abritant les Pyramides de Gizeh et le Sphinx.'
    },
    mainImage: 'https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg',
    flag: '🇪🇬',
    currency: {
      ar: 'الجنيه المصري (EGP)',
      en: 'Egyptian Pound (EGP)',
      fr: 'Livre égyptienne (EGP)'
    },
    language: {
      ar: 'العربية',
      en: 'Arabic',
      fr: 'Arabe'
    },
    timeZone: 'GMT+2',
    climate: {
      ar: 'صحراوي جاف',
      en: 'Dry desert',
      fr: 'Désert sec'
    },
    bestTime: {
      ar: 'أكتوبر - أبريل',
      en: 'October - April',
      fr: 'Octobre - Avril'
    },
    visaRequired: true,
    rating: 4.8,
    totalReviews: 15420,
    totalTours: 60,
    totalHotels: 890,
    highlights: {
      ar: ['أهرامات الجيزة', 'أبو الهول', 'معابد الأقصر', 'نهر النيل'],
      en: ['Giza Pyramids', 'Sphinx', 'Luxor Temples', 'Nile River'],
      fr: ['Pyramides de Gizeh', 'Sphinx', 'Temples de Louxor', 'Fleuve Nil']
    },
    culture: {
      ar: 'مصر مهد الحضارة الفرعونية العريقة وملتقى الثقافات الأفريقية والعربية.',
      en: 'Egypt is the cradle of ancient Pharaonic civilization and meeting point of African and Arab cultures.',
      fr: 'L\'Égypte est le berceau de l\'ancienne civilisation pharaonique et point de rencontre des cultures africaines et arabes.'
    },
    cuisine: {
      ar: ['الكشري المصري', 'الملوخية', 'الفول والطعمية'],
      en: ['Egyptian Koshary', 'Molokhia', 'Ful and Falafel'],
      fr: ['Koshary égyptien', 'Molokhia', 'Ful et Falafel']
    },
    transportation: {
      ar: ['مصر للطيران', 'قطارات السكك الحديدية', 'النقل النهري بالنيل'],
      en: ['EgyptAir', 'Railway trains', 'Nile river transport'],
      fr: ['EgyptAir', 'Trains ferroviaires', 'Transport fluvial du Nil']
    },
    safety: {
      ar: 'مصر وجهة سياحية آمنة مع وجود أمن سياحي متخصص.',
      en: 'Egypt is a safe tourist destination with specialized tourist security.',
      fr: 'L\'Égypte est une destination touristique sûre avec une sécurité touristique spécialisée.'
    },
    cities: [
      {
        id: 'cairo',
        name: {
          ar: 'القاهرة',
          en: 'Cairo',
          fr: 'Le Caire'
        },
        description: {
          ar: 'عاصمة مصر ومدينة الألف مئذنة، تحتضن التاريخ والحداثة.',
          en: 'Capital of Egypt and city of a thousand minarets, embracing history and modernity.',
          fr: 'Capitale de l\'Égypte et ville aux mille minarets, embrassant l\'histoire et la modernité.'
        },
        image: 'https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg',
        attractions: {
          ar: ['أهرامات الجيزة', 'المتحف المصري', 'قلعة صلاح الدين'],
          en: ['Giza Pyramids', 'Egyptian Museum', 'Saladin Citadel'],
          fr: ['Pyramides de Gizeh', 'Musée égyptien', 'Citadelle de Saladin']
        },
        bestTime: {
          ar: 'نوفمبر - مارس',
          en: 'November - March',
          fr: 'Novembre - Mars'
        },
        duration: {
          ar: '3-4 أيام',
          en: '3-4 days',
          fr: '3-4 jours'
        },
        rating: 4.7,
        reviews: 3420,
        highlights: {
          ar: ['الآثار الفرعونية', 'الحضارة الإسلامية'],
          en: ['Pharaonic monuments', 'Islamic civilization'],
          fr: ['Monuments pharaoniques', 'Civilisation islamique']
        },
        gallery: ['https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg']
  },

  morocco: {
    id: 'morocco',
    name: {
      ar: 'المغرب',
      en: 'Morocco',
      fr: 'Maroc'
    },
    capital: {
      ar: 'الرباط',
      en: 'Rabat',
      fr: 'Rabat'
    },
    description: {
      ar: 'المغرب، بوابة إفريقيا وجوهرة المغرب العربي، حيث تلتقي الثقافة العربية والأمازيغية.',
      en: 'Morocco, gateway to Africa and jewel of the Maghreb, where Arab and Berber cultures meet.',
      fr: 'Le Maroc, porte de l\'Afrique et joyau du Maghreb, où les cultures arabe et berbère se rencontrent.'
    },
    mainImage: 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg',
    flag: '🇲🇦',
    currency: {
      ar: 'الدرهم المغربي (MAD)',
      en: 'Moroccan Dirham (MAD)',
      fr: 'Dirham marocain (MAD)'
    },
    language: {
      ar: 'العربية، الأمازيغية، الفرنسية',
      en: 'Arabic, Berber, French',
      fr: 'Arabe, Berbère, Français'
    },
    timeZone: 'GMT+1',
    climate: {
      ar: 'متوسطي معتدل',
      en: 'Temperate Mediterranean',
      fr: 'Méditerranéen tempéré'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 9850,
    totalTours: 45,
    totalHotels: 650,
    highlights: {
      ar: ['مراكش الحمراء', 'فاس العتيقة', 'صحراء مرزوقة', 'الدار البيضاء'],
      en: ['Red Marrakech', 'Ancient Fez', 'Merzouga Desert', 'Casablanca'],
      fr: ['Marrakech Rouge', 'Fès Ancienne', 'Désert de Merzouga', 'Casablanca']
    },
    culture: {
      ar: 'المغرب بلد التنوع الثقافي الذي يجمع بين التراث العربي والأمازيغي والأندلسي.',
      en: 'Morocco is a country of cultural diversity that combines Arab, Berber and Andalusian heritage.',
      fr: 'Le Maroc est un pays de diversité culturelle qui combine l\'héritage arabe, berbère et andalou.'
    },
    cuisine: {
      ar: ['الطاجين المغربي', 'الكسكس', 'الحريرة والمعمار'],
      en: ['Moroccan Tagine', 'Couscous', 'Harira and Mammar'],
      fr: ['Tajine marocain', 'Couscous', 'Harira et Mammar']
    },
    transportation: {
      ar: ['الخطوط الملكية المغربية', 'قطار البراق عالي السرعة', 'شبكة طرق متطورة'],
      en: ['Royal Air Maroc', 'Al Boraq High-Speed Train', 'Advanced road network'],
      fr: ['Royal Air Maroc', 'Train à grande vitesse Al Boraq', 'Réseau routier avancé']
    },
    safety: {
      ar: 'المغرب بلد آمن للسياحة مع استقرار سياسي واجتماعي.',
      en: 'Morocco is a safe country for tourism with political and social stability.',
      fr: 'Le Maroc est un pays sûr pour le tourisme avec une stabilité politique et sociale.'
    },
    cities: [
      {
        id: 'marrakech',
        name: {
          ar: 'مراكش',
          en: 'Marrakech',
          fr: 'Marrakech'
        },
        description: {
          ar: 'المدينة الحمراء وعاصمة السياحة المغربية، تشتهر بساحة جامع الفنا.',
          en: 'The Red City and capital of Moroccan tourism, famous for Jemaa el-Fnaa square.',
          fr: 'La Ville Rouge et capitale du tourisme marocain, célèbre pour la place Jemaa el-Fnaa.'
        },
        image: 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg',
        attractions: {
          ar: ['ساحة جامع الفنا', 'قصر الباهية', 'مسجد الكتبية'],
          en: ['Jemaa el-Fnaa Square', 'Bahia Palace', 'Koutoubia Mosque'],
          fr: ['Place Jemaa el-Fnaa', 'Palais de la Bahia', 'Mosquée Koutoubia']
        },
        bestTime: {
          ar: 'أكتوبر - أبريل',
          en: 'October - April',
          fr: 'Octobre - Avril'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.5,
        reviews: 2890,
        highlights: {
          ar: ['الأسواق التقليدية', 'الهندسة المعمارية المغربية'],
          en: ['Traditional souks', 'Moroccan architecture'],
          fr: ['Souks traditionnels', 'Architecture marocaine']
        },
        gallery: ['https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg']
  },

  jordan: {
    id: 'jordan',
    name: {
      ar: 'الأردن',
      en: 'Jordan',
      fr: 'Jordanie'
    },
    capital: {
      ar: 'عمان',
      en: 'Amman',
      fr: 'Amman'
    },
    description: {
      ar: 'الأردن، المملكة الهاشمية وأرض الحضارات، موطن البتراء الوردية ووادي القمر.',
      en: 'Jordan, the Hashemite Kingdom and land of civilizations, home to the rose-red Petra and Wadi Rum.',
      fr: 'La Jordanie, le Royaume Hachémite et terre de civilisations, abritant Petra la rose et Wadi Rum.'
    },
    mainImage: 'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg',
    flag: '🇯🇴',
    currency: {
      ar: 'الدينار الأردني (JOD)',
      en: 'Jordanian Dinar (JOD)',
      fr: 'Dinar jordanien (JOD)'
    },
    language: {
      ar: 'العربية، الإنجليزية',
      en: 'Arabic, English',
      fr: 'Arabe, Anglais'
    },
    timeZone: 'GMT+2',
    climate: {
      ar: 'معتدل جاف',
      en: 'Temperate dry',
      fr: 'Tempéré sec'
    },
    bestTime: {
      ar: 'مارس - مايو، سبتمبر - نوفمبر',
      en: 'March - May, September - November',
      fr: 'Mars - Mai, Septembre - Novembre'
    },
    visaRequired: true,
    rating: 4.7,
    totalReviews: 6740,
    totalTours: 30,
    totalHotels: 420,
    highlights: {
      ar: ['البتراء الوردية', 'وادي رم القمري', 'البحر الميت', 'جرش الأثرية'],
      en: ['Rose-red Petra', 'Lunar Wadi Rum', 'Dead Sea', 'Ancient Jerash'],
      fr: ['Petra la rose', 'Wadi Rum lunaire', 'Mer Morte', 'Jerash antique']
    },
    culture: {
      ar: 'الأردن ملتقى الحضارات القديمة والثقافة العربية الأصيلة.',
      en: 'Jordan is a meeting point of ancient civilizations and authentic Arab culture.',
      fr: 'La Jordanie est un point de rencontre des civilisations anciennes et de la culture arabe authentique.'
    },
    cuisine: {
      ar: ['المنسف الأردني', 'المقلوبة', 'الكنافة النابلسية'],
      en: ['Jordanian Mansaf', 'Maqluba', 'Nabulsi Kanafeh'],
      fr: ['Mansaf jordanien', 'Maqluba', 'Kanafeh de Naplouse']
    },
    transportation: {
      ar: ['الملكية الأردنية', 'شبكة طرق حديثة', 'حافلات سياحية'],
      en: ['Royal Jordanian', 'Modern road network', 'Tourist buses'],
      fr: ['Royal Jordanian', 'Réseau routier moderne', 'Bus touristiques']
    },
    safety: {
      ar: 'الأردن من أأمن دول المنطقة وأكثرها استقراراً.',
      en: 'Jordan is one of the safest and most stable countries in the region.',
      fr: 'La Jordanie est l\'un des pays les plus sûrs et les plus stables de la région.'
    },
    cities: [
      {
        id: 'petra',
        name: {
          ar: 'البتراء',
          en: 'Petra',
          fr: 'Petra'
        },
        description: {
          ar: 'المدينة الوردية المنحوتة في الصخر، إحدى عجائب الدنيا السبع الجديدة.',
          en: 'The rose-red city carved in stone, one of the New Seven Wonders of the World.',
          fr: 'La ville rose taillée dans la pierre, l\'une des Nouvelles Sept Merveilles du Monde.'
        },
        image: 'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg',
        attractions: {
          ar: ['الخزنة', 'الد��ر', 'المسرح الروماني'],
          en: ['The Treasury', 'The Monastery', 'Roman Theatre'],
          fr: ['Le Trésor', 'Le Monastère', 'Théâtre Romain']
        },
        bestTime: {
          ar: 'مارس - مايو، أكتوبر - نوفمبر',
          en: 'March - May, October - November',
          fr: 'Mars - Mai, Octobre - Novembre'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.9,
        reviews: 4200,
        highlights: {
          ar: ['العمارة النبطية', 'التراث العالمي'],
          en: ['Nabataean architecture', 'World Heritage'],
          fr: ['Architecture nabatéenne', 'Patrimoine mondial']
        },
        gallery: ['https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg']
  },

  lebanon: {
    id: 'lebanon',
    name: {
      ar: 'لبنان',
      en: 'Lebanon',
      fr: 'Liban'
    },
    capital: {
      ar: 'بيروت',
      en: 'Beirut',
      fr: 'Beyrouth'
    },
    description: {
      ar: 'لبنان، سويسرا الشرق وأرض الأرز، حيث تلتقي الجبال الثلجية با��شواطئ الذهبية.',
      en: 'Lebanon, the Switzerland of the East and land of cedars, where snowy mountains meet golden beaches.',
      fr: 'Le Liban, la Suisse de l\'Orient et terre des cèdres, où les montagnes enneigées rencontrent les plages dorées.'
    },
    mainImage: 'https://images.pexels.com/photos/6510405/pexels-photo-6510405.jpeg',
    flag: '🇱🇧',
    currency: {
      ar: 'الليرة اللبنانية (LBP)',
      en: 'Lebanese Pound (LBP)',
      fr: 'Livre libanaise (LBP)'
    },
    language: {
      ar: 'العربية، الفرنسية، الإنجليزية',
      en: 'Arabic, French, English',
      fr: 'Arabe, Français, Anglais'
    },
    timeZone: 'GMT+2',
    climate: {
      ar: 'متوسطي معتدل',
      en: 'Temperate Mediterranean',
      fr: 'Méditerranéen tempéré'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: false,
    rating: 4.5,
    totalReviews: 4580,
    totalTours: 25,
    totalHotels: 320,
    highlights: {
      ar: ['بعلبك الأثرية', 'غابة الأرز', 'بيروت الثقافية', '��بال لبنان'],
      en: ['Ancient Baalbek', 'Cedar Forest', 'Cultural Beirut', 'Lebanon Mountains'],
      fr: ['Baalbek antique', 'Forêt de Cèdres', 'Beyrouth culturelle', 'Montagnes du Liban']
    },
    culture: {
      ar: 'لبنان ملتقى الحضارات الشرقية والغربية وموطن الثقافة والفنون.',
      en: 'Lebanon is a meeting point of Eastern and Western civilizations and home to culture and arts.',
      fr: 'Le Liban est un point de rencontre des civilisations orientales et occidentales et foyer de culture et d\'arts.'
    },
    cuisine: {
      ar: ['المزة اللبنانية', 'الحمص والتبولة', 'الكبة والفتوش'],
      en: ['Lebanese Meze', 'Hummus and Tabbouleh', 'Kibbeh and Fattoush'],
      fr: ['Mezzé libanais', 'Houmous et Taboulé', 'Kibbeh et Fattoush']
    },
    transportation: {
      ar: ['طيران الشرق الأوسط', 'سيارات الأجرة والحافلات', 'تأجير السيارات'],
      en: ['Middle East Airlines', 'Taxis and buses', 'Car rental'],
      fr: ['Middle East Airlines', 'Taxis et bus', 'Location de voitures']
    },
    safety: {
      ar: 'لبنان وجهة سياحية جميلة مع ضرورة متابعة التطورات الأمنية.',
      en: 'Lebanon is a beautiful tourist destination with the need to monitor security developments.',
      fr: 'Le Liban est une belle destination touristique avec la nécessité de surveiller les développements sécuritaires.'
    },
    cities: [
      {
        id: 'beirut',
        name: {
          ar: 'بيروت',
          en: 'Beirut',
          fr: 'Beyrouth'
        },
        description: {
          ar: 'عا��مة لبنان وباريس الشرق، مدينة الثقافة وا��حياة الليلية.',
          en: 'Capital of Lebanon and Paris of the East, city of culture and nightlife.',
          fr: 'Capitale du Liban et Paris de l\'Orient, ville de culture et de vie nocturne.'
        },
        image: 'https://images.pexels.com/photos/6510405/pexels-photo-6510405.jpeg',
        attractions: {
          ar: ['وسط بيروت', 'صخرة الروشة', 'المتحف الوطني'],
          en: ['Downtown Beirut', 'Raouche Rock', 'National Museum'],
          fr: ['Centre-ville de Beyrouth', 'Rocher de Raouche', 'Musée National']
        },
        bestTime: {
          ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
          en: 'April - June, September - November',
          fr: 'Avril - Juin, Septembre - Novembre'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.4,
        reviews: 1890,
        highlights: {
          ar: ['الحياة الثقافية', 'المطاعم الراقية'],
          en: ['Cultural life', 'Fine dining'],
          fr: ['Vie culturelle', 'Gastronomie raffinée']
        },
        gallery: ['https://images.pexels.com/photos/6510405/pexels-photo-6510405.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/6510405/pexels-photo-6510405.jpeg']
  },

  syria: {
    id: 'syria',
    name: {
      ar: 'سوريا',
      en: 'Syria',
      fr: 'Syrie'
    },
    capital: {
      ar: 'دمشق',
      en: 'Damascus',
      fr: 'Damas'
    },
    description: {
      ar: 'سوريا، مهد الحضارات وأرض الياسمين، حيث تحتضن دمشق أقدم عاصمة مأهولة في العالم.',
      en: 'Syria, cradle of civilizations and land of jasmine, where Damascus embraces the world\'s oldest inhabited capital.',
      fr: 'La Syrie, berceau des civilisations et terre de jasmin, où Damas abrite la plus ancienne capitale habitée du monde.'
    },
    mainImage: 'https://images.pexels.com/photos/13503798/pexels-photo-13503798.jpeg',
    flag: '🇸🇾',
    currency: {
      ar: 'الليرة السورية (SYP)',
      en: 'Syrian Pound (SYP)',
      fr: 'Livre syrienne (SYP)'
    },
    language: {
      ar: 'العربية',
      en: 'Arabic',
      fr: 'Arabe'
    },
    timeZone: 'GMT+2',
    climate: {
      ar: 'متوسطي جاف',
      en: 'Dry Mediterranean',
      fr: 'Méditerranéen sec'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: true,
    rating: 4.3,
    totalReviews: 2890,
    totalTours: 15,
    totalHotels: 180,
    highlights: {
      ar: ['دمشق القديمة', 'حلب التاريخية', 'تدمر الأثرية', 'قلعة الحصن'],
      en: ['Old Damascus', 'Historic Aleppo', 'Ancient Palmyra', 'Krak des Chevaliers'],
      fr: ['Vieux Damas', 'Alep historique', 'Palmyre antique', 'Krak des Chevaliers']
    },
    culture: {
      ar: 'سوريا موطن أقدم الحضارات الإنسانية وملتقى طريق الحرير التاريخي.',
      en: 'Syria is home to the oldest human civilizations and crossroads of the historic Silk Road.',
      fr: 'La Syrie abrite les plus anciennes civilisations humaines et carrefour de la Route de la Soie historique.'
    },
    cuisine: {
      ar: ['الكبة الشامية', 'الفتة والباذنجان', 'المحشي السوري'],
      en: ['Damascene Kibbeh', 'Fatteh and Eggplant', 'Syrian Stuffed Vegetables'],
      fr: ['Kibbeh damascène', 'Fatteh et Aubergine', 'Légumes farcis syriens']
    },
    transportation: {
      ar: ['السورية للطيران', 'حافلات النقل الداخلي', 'تاكسي ��سيارات الأجرة'],
      en: ['Syrian Air', 'Domestic transport buses', 'Taxis and car rental'],
      fr: ['Syrian Air', 'Bus de transport domestique', 'Taxis et location de voitures']
    },
    safety: {
      ar: 'يُنصح بمتابعة التطورات الأمنية والتنسيق مع السلطات المحلية.',
      en: 'It is advised to monitor security developments and coordinate with local authorities.',
      fr: 'Il est conseillé de surveiller les développements sécuritaires et de coordonner avec les autorités locales.'
    },
    cities: [
      {
        id: 'damascus',
        name: {
          ar: 'دمشق',
          en: 'Damascus',
          fr: 'Damas'
        },
        description: {
          ar: 'أقدم عاصمة مأهولة في العالم، مدينة الياسمين والتاريخ العريق.',
          en: 'The world\'s oldest inhabited capital, city of jasmine and ancient history.',
          fr: 'La plus ancienne capitale habitée du monde, ville de jasmin et d\'histoire ancienne.'
        },
        image: 'https://images.pexels.com/photos/13503798/pexels-photo-13503798.jpeg',
        attractions: {
          ar: ['الجامع الأموي', 'البيت القديم', 'سوق الحميدية'],
          en: ['Umayyad Mosque', 'Old House', 'Hamidiyeh Souq'],
          fr: ['Mosquée des Omeyyades', 'Vieille Maison', 'Souk Hamidiyeh']
        },
        bestTime: {
          ar: 'أبريل - يونيو، أكتوبر - نوفمبر',
          en: 'April - June, October - November',
          fr: 'Avril - Juin, Octobre - Novembre'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.2,
        reviews: 1340,
        highlights: {
          ar: ['التراث الإسلامي', 'الأسواق التقليدية'],
          en: ['Islamic heritage', 'Traditional markets'],
          fr: ['Patrimoine islamique', 'Marchés traditionnels']
        },
        gallery: ['https://images.pexels.com/photos/13503798/pexels-photo-13503798.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/13503798/pexels-photo-13503798.jpeg']
  },

  iraq: {
    id: 'iraq',
    name: {
      ar: 'العراق',
      en: 'Iraq',
      fr: 'Irak'
    },
    capital: {
      ar: 'بغداد',
      en: 'Baghdad',
      fr: 'Bagdad'
    },
    description: {
      ar: 'العراق، مهد الحضارات وأرض الرافدين، حيث نشأت أولى المدن في التاريخ الإنساني.',
      en: 'Iraq, cradle of civilizations and land of Mesopotamia, where the first cities in human history emerged.',
      fr: 'L\'Irak, berceau des civilisations et terre de Mésopotamie, où les premières villes de l\'histoire humaine ont émergé.'
    },
    mainImage: 'https://images.pexels.com/photos/11961251/pexels-photo-11961251.jpeg',
    flag: '🇮🇶',
    currency: {
      ar: 'الدينار العراقي (IQD)',
      en: 'Iraqi Dinar (IQD)',
      fr: 'Dinar irakien (IQD)'
    },
    language: {
      ar: 'العربية، الكردية',
      en: 'Arabic, Kurdish',
      fr: 'Arabe, Kurde'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'صحراوي حار',
      en: 'Hot desert',
      fr: 'Désert chaud'
    },
    bestTime: {
      ar: 'نوفمبر - مارس',
      en: 'November - March',
      fr: 'Novembre - Mars'
    },
    visaRequired: true,
    rating: 4.0,
    totalReviews: 1890,
    totalTours: 12,
    totalHotels: 150,
    highlights: {
      ar: ['بابل الأثرية', 'أور القديمة', 'مدينة بغداد التاريخية', 'الأهوار العراقية'],
      en: ['Ancient Babylon', 'Ancient Ur', 'Historic Baghdad', 'Iraqi Marshlands'],
      fr: ['Babylone antique', 'Ur antique', 'Bagdad historique', 'Marais irakiens']
    },
    culture: {
      ar: 'العراق موطن أقدم الحضارات الإن��انية والتراث الثقافي العريق.',
      en: 'Iraq is home to the oldest human civilizations and ancient cultural heritage.',
      fr: 'L\'Irak abrite les plus anciennes civilisations humaines et un patrimoine culturel ancien.'
    },
    cuisine: {
      ar: ['المسگوف العراقي', 'الدولمة العراقية', 'الكباب العراقي'],
      en: ['Iraqi Masgouf', 'Iraqi Dolma', 'Iraqi Kebab'],
      fr: ['Masgouf irakien', 'Dolma irakienne', 'Kebab irakien']
    },
    transportation: {
      ar: ['الخطوط الجوية العراقية', 'حافلات النقل الداخلي', 'تاكسي وسيارات الأجرة'],
      en: ['Iraqi Airways', 'Domestic transport buses', 'Taxis and car rental'],
      fr: ['Iraqi Airways', 'Bus de transport domestique', 'Taxis et location de voitures']
    },
    safety: {
      ar: 'يُنصح بمتابعة التطورات الأمنية والتنسيق مع الجهات المختصة.',
      en: 'It is advised to monitor security developments and coordinate with relevant authorities.',
      fr: 'Il est conseillé de surveiller les développements sécuritaires et de coordonner avec les autorités compétentes.'
    },
    cities: [
      {
        id: 'baghdad',
        name: {
          ar: 'بغداد',
          en: 'Baghdad',
          fr: 'Bagdad'
        },
        description: {
          ar: 'عاصمة العراق ومدينة السلام، مركز الحضارة العباسية التاريخية.',
          en: 'Capital of Iraq and City of Peace, center of historic Abbasid civilization.',
          fr: 'Capitale de l\'Irak et Ville de la Paix, centre de la civilisation abbasside historique.'
        },
        image: 'https://images.pexels.com/photos/11961251/pexels-photo-11961251.jpeg',
        attractions: {
          ar: ['المدينة المدورة', 'المتحف العراقي', 'شارع المتنبي'],
          en: ['Round City', 'Iraqi Museum', 'Al-Mutanabbi Street'],
          fr: ['Ville Ronde', 'Musée irakien', 'Rue Al-Mutanabbi']
        },
        bestTime: {
          ar: 'ديسمبر - فبراير',
          en: 'December - February',
          fr: 'Décembre - Février'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 3.9,
        reviews: 890,
        highlights: {
          ar: ['التراث العباسي', 'الثقافة العراقية'],
          en: ['Abbasid heritage', 'Iraqi culture'],
          fr: ['Patrimoine abbasside', 'Culture irakienne']
        },
        gallery: ['https://images.pexels.com/photos/11961251/pexels-photo-11961251.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/11961251/pexels-photo-11961251.jpeg']
  },

  kuwait: {
    id: 'kuwait',
    name: {
      ar: 'الكويت',
      en: 'Kuwait',
      fr: 'Koweït'
    },
    capital: {
      ar: 'مدينة الكويت',
      en: 'Kuwait City',
      fr: 'Ville de Koweït'
    },
    description: {
      ar: 'الكويت، لؤلؤة الخليج العربي ومركز التجارة والثقافة في المنطقة.',
      en: 'Kuwait, pearl of the Arabian Gulf and center of trade and culture in the region.',
      fr: 'Le Koweït, perle du Golfe Arabique et centre de commerce et de culture dans la région.'
    },
    mainImage: 'https://images.pexels.com/photos/19023071/pexels-photo-19023071.jpeg',
    flag: '🇰🇼',
    currency: {
      ar: 'الدينار الكويتي (KWD)',
      en: 'Kuwaiti Dinar (KWD)',
      fr: 'Dinar koweïtien (KWD)'
    },
    language: {
      ar: 'العر��ية، الإنجليزية',
      en: 'Arabic, English',
      fr: 'Arabe, Anglais'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'صحراوي حار',
      en: 'Hot desert',
      fr: 'Désert chaud'
    },
    bestTime: {
      ar: 'نوفمبر - مارس',
      en: 'November - March',
      fr: 'Novembre - Mars'
    },
    visaRequired: true,
    rating: 4.3,
    totalReviews: 3200,
    totalTours: 18,
    totalHotels: 280,
    highlights: {
      ar: ['أبراج الكويت', 'المتحف الوطني', 'بيت السادو', 'السوق الكبير'],
      en: ['Kuwait Towers', 'National Museum', 'Sadu House', 'Grand Souk'],
      fr: ['Tours du Koweït', 'Musée National', 'Maison Sadu', 'Grand Souk']
    },
    culture: {
      ar: 'الكويت تجمع بين التراث البدوي الأصيل والحداثة الخليجية.',
      en: 'Kuwait combines authentic Bedouin heritage with Gulf modernity.',
      fr: 'Le Koweït combine l\'héritage bédouin authentique avec la modernité du Golfe.'
    },
    cuisine: {
      ar: ['المجبوس الكويتي', 'الهريس', 'الزلابية الكويتية'],
      en: ['Kuwaiti Majboos', 'Harees', 'Kuwaiti Jalebi'],
      fr: ['Majboos koweïtien', 'Harees', 'Jalebi koweïtien']
    },
    transportation: {
      ar: ['الخطوط الجوية الكويتية', 'حافلات النقل العام', 'تأجير السيارات'],
      en: ['Kuwait Airways', 'Public transport buses', 'Car rental'],
      fr: ['Kuwait Airways', 'Bus de transport public', 'Location de voitures']
    },
    safety: {
      ar: 'الكويت من الدول الآمنة في المنطقة مع أمن متطور.',
      en: 'Kuwait is one of the safe countries in the region with advanced security.',
      fr: 'Le Koweït est l\'un des pays sûrs de la région avec une sécurité avancée.'
    },
    cities: [
      {
        id: 'kuwait_city',
        name: {
          ar: 'مدينة الكويت',
          en: 'Kuwait City',
          fr: 'Ville de Koweït'
        },
        description: {
          ar: 'عاصمة الكويت والمركز التجاري والثقافي للبلاد.',
          en: 'Capital of Kuwait and the country\'s commercial and cultural center.',
          fr: 'Capitale du Koweït et centre commercial et culturel du pays.'
        },
        image: 'https://images.pexels.com/photos/19023071/pexels-photo-19023071.jpeg',
        attractions: {
          ar: ['أبراج الكويت', 'المتحف الوطني', 'مارينا مول'],
          en: ['Kuwait Towers', 'National Museum', 'Marina Mall'],
          fr: ['Tours du Koweït', 'Musée National', 'Marina Mall']
        },
        bestTime: {
          ar: 'ديسمبر - فبراير',
          en: 'December - February',
          fr: 'Décembre - Février'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.2,
        reviews: 1450,
        highlights: {
          ar: ['الهندسة المعمارية الحديثة', 'التسوق والمطاعم'],
          en: ['Modern architecture', 'Shopping and dining'],
          fr: ['Architecture moderne', 'Shopping et restaurants']
        },
        gallery: ['https://images.pexels.com/photos/19023071/pexels-photo-19023071.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/19023071/pexels-photo-19023071.jpeg']
  },

  bahrain: {
    id: 'bahrain',
    name: {
      ar: 'البحرين',
      en: 'Bahrain',
      fr: 'Bahreïn'
    },
    capital: {
      ar: 'المنامة',
      en: 'Manama',
      fr: 'Manama'
    },
    description: {
      ar: 'البحرين، لؤلؤة الخليج ومملكة اللؤلؤ، أرخبيل من الجزر الساحرة في قلب الخليج ا��عربي.',
      en: 'Bahrain, pearl of the Gulf and kingdom of pearls, an archipelago of charming islands in the heart of the Arabian Gulf.',
      fr: 'Bahreïn, perle du Golfe et royaume des perles, un archipel d\'îles charmantes au cœur du Golfe Arabique.'
    },
    mainImage: 'https://images.pexels.com/photos/9028901/pexels-photo-9028901.jpeg',
    flag: '🇧🇭',
    currency: {
      ar: 'الدينار الب��ريني (BHD)',
      en: 'Bahraini Dinar (BHD)',
      fr: 'Dinar bahreïni (BHD)'
    },
    language: {
      ar: 'العربية، الإنجليزية',
      en: 'Arabic, English',
      fr: 'Arabe, Anglais'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'صحراوي حار ورطب',
      en: 'Hot and humid desert',
      fr: 'Désert chaud et humide'
    },
    bestTime: {
      ar: 'نوفمبر - مارس',
      en: 'November - March',
      fr: 'Novembre - Mars'
    },
    visaRequired: true,
    rating: 4.4,
    totalReviews: 2890,
    totalTours: 20,
    totalHotels: 220,
    highlights: {
      ar: ['قلعة البحرين الأثرية', 'متحف البحرين الوطني', 'سوق المنامة', 'جزر الدار'],
      en: ['Bahrain Fort', 'Bahrain National Museum', 'Manama Souq', 'Dar Islands'],
      fr: ['Fort de Bahreïn', 'Musée National de Bahreïn', 'Souk de Manama', 'Îles Dar']
    },
    culture: {
      ar: 'البحرين موطن حضارة دلمون القديمة ومركز تجارة اللؤلؤ التاريخي.',
      en: 'Bahrain is home to the ancient Dilmun civilization and historic pearl trading center.',
      fr: 'Bahreïn abrite l\'ancienne civilisation de Dilmun et centre historique du commerce des perles.'
    },
    cuisine: {
      ar: ['المجبوس البحريني', '��لهامور المشوي', 'المحمر والزلابية'],
      en: ['Bahraini Majboos', 'Grilled Hamour', 'Mahammer and Jalebi'],
      fr: ['Majboos bahreïni', 'Hamour grillé', 'Mahammer et Jalebi']
    },
    transportation: {
      ar: ['طيران الخليج', 'جسر الملك فهد', 'تاكسي وحافلات'],
      en: ['Gulf Air', 'King Fahd Causeway', 'Taxis and buses'],
      fr: ['Gulf Air', 'Chaussée du Roi Fahd', 'Taxis et bus']
    },
    safety: {
      ar: 'البحرين من أأمن دول الخليج مع استقرار سياسي واجتماعي.',
      en: 'Bahrain is one of the safest Gulf countries with political and social stability.',
      fr: 'Bahreïn est l\'un des pays du Golfe les plus sûrs avec une stabilité politique et sociale.'
    },
    cities: [
      {
        id: 'manama',
        name: {
          ar: 'المنامة',
          en: 'Manama',
          fr: 'Manama'
        },
        description: {
          ar: 'عاصمة البحرين والمركز المالي والتجاري للمملكة.',
          en: 'Capital of Bahrain and the kingdom\'s financial and commercial center.',
          fr: 'Capitale de Bahreïn et centre financier et commercial du royaume.'
        },
        image: 'https://images.pexels.com/photos/9028901/pexels-photo-9028901.jpeg',
        attractions: {
          ar: ['سوق المنامة', 'مجمع البحرين التجاري', 'كورنيش المنامة'],
          en: ['Manama Souq', 'Bahrain World Trade Center', 'Manama Corniche'],
          fr: ['Souk de Manama', 'Centre du Commerce Mondial de Bahreïn', 'Corniche de Manama']
        },
        bestTime: {
          ar: 'نوفمبر - مارس',
          en: 'November - March',
          fr: 'Novembre - Mars'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.3,
        reviews: 1680,
        highlights: {
          ar: ['المراكز التجارية الحديثة', 'الضيافة الخليجية'],
          en: ['Modern shopping centers', 'Gulf hospitality'],
          fr: ['Centres commerciaux modernes', 'Hospitalité du Golfe']
        },
        gallery: ['https://images.pexels.com/photos/9028901/pexels-photo-9028901.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/9028901/pexels-photo-9028901.jpeg']
  },

  qatar: {
    id: 'qatar',
    name: {
      ar: 'قطر',
      en: 'Qatar',
      fr: 'Qatar'
    },
    capital: {
      ar: 'الدو��ة',
      en: 'Doha',
      fr: 'Doha'
    },
    description: {
      ar: 'قطر، لؤلؤة الخليج العربي ومضيفة كأس العالم، حيث تلتقي الأصالة مع الحداثة.',
      en: 'Qatar, pearl of the Arabian Gulf and World Cup host, where authenticity meets modernity.',
      fr: 'Qatar, perle du Golfe Arabique et hôte de la Coupe du Monde, où l\'authenticité rencontre la modernité.'
    },
    mainImage: 'https://images.pexels.com/photos/10644567/pexels-photo-10644567.jpeg',
    flag: '🇶🇦',
    currency: {
      ar: 'الريال القطري (QAR)',
      en: 'Qatari Riyal (QAR)',
      fr: 'Riyal qatarien (QAR)'
    },
    language: {
      ar: 'العربية، الإنجليزية',
      en: 'Arabic, English',
      fr: 'Arabe, Anglais'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'صحراوي حار ورطب',
      en: 'Hot and humid desert',
      fr: 'Désert chaud et humide'
    },
    bestTime: {
      ar: 'نوفمبر - مارس',
      en: 'November - March',
      fr: 'Novembre - Mars'
    },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 4780,
    totalTours: 25,
    totalHotels: 350,
    highlights: {
      ar: ['متحف قطر الوطني', 'سوق واقف', 'كتارا الثقافية', 'اللؤلؤة قطر'],
      en: ['National Museum of Qatar', 'Souq Waqif', 'Katara Cultural Village', 'The Pearl Qatar'],
      fr: ['Musée National du Qatar', 'Souq Waqif', 'Village Culturel Katara', 'The Pearl Qatar']
    },
    culture: {
      ar: 'قطر تجمع بين التراث العربي الأصيل والرؤية المستقبلية الطموحة.',
      en: 'Qatar combines authentic Arab heritage with ambitious future vision.',
      fr: 'Qatar combine l\'héritage arabe authentique avec une vision future ambitieuse.'
    },
    cuisine: {
      ar: ['المجبوس القطري', 'الهريس', 'اللقيمات والكنافة'],
      en: ['Qatari Majboos', 'Harees', 'Luqaimat and Kanafeh'],
      fr: ['Majboos qatarien', 'Harees', 'Luqaimat et Kanafeh']
    },
    transportation: {
      ar: ['الخطوط الجوية القطرية', 'مترو الدوحة', 'تاكسي وأوبر'],
      en: ['Qatar Airways', 'Doha Metro', 'Taxi and Uber'],
      fr: ['Qatar Airways', 'Métro de Doha', 'Taxi et Uber']
    },
    safety: {
      ar: 'قطر من أأمن دول العالم مع نظام أمني متطور.',
      en: 'Qatar is one of the safest countries in the world with advanced security system.',
      fr: 'Qatar est l\'un des pays les plus sûrs au monde avec un système de sécurité avancé.'
    },
    cities: [
      {
        id: 'doha',
        name: {
          ar: 'الدوحة',
          en: 'Doha',
          fr: 'Doha'
        },
        description: {
          ar: 'عاصمة قطر ومدينة المستقبل، تجمع بين الأصالة والحداثة.',
          en: 'Capital of Qatar and city of the future, combining authenticity and modernity.',
          fr: 'Capitale du Qatar et ville du futur, combinant authenticité et modernité.'
        },
        image: 'https://images.pexels.com/photos/10644567/pexels-photo-10644567.jpeg',
        attractions: {
          ar: ['سوق واقف', 'متحف قطر الوطني', 'كورنيش الدوحة'],
          en: ['Souq Waqif', 'National Museum of Qatar', 'Doha Corniche'],
          fr: ['Souq Waqif', 'Musée National du Qatar', 'Corniche de Doha']
        },
        bestTime: {
          ar: 'ن��فمبر - مارس',
          en: 'November - March',
          fr: 'Novembre - Mars'
        },
        duration: {
          ar: '2-4 أيام',
          en: '2-4 days',
          fr: '2-4 jours'
        },
        rating: 4.5,
        reviews: 2890,
        highlights: {
          ar: ['الهندسة المعمارية المستقبلية', 'المتاحف العالم��ة'],
          en: ['Futuristic architecture', 'World-class museums'],
          fr: ['Architecture futuriste', 'Musées de classe mondiale']
        },
        gallery: ['https://images.pexels.com/photos/10644567/pexels-photo-10644567.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/10644567/pexels-photo-10644567.jpeg']
  },

  oman: {
    id: 'oman',
    name: {
      ar: 'عُمان',
      en: 'Oman',
      fr: 'Oman'
    },
    capital: {
      ar: 'مسقط',
      en: 'Muscat',
      fr: 'Mascate'
    },
    description: {
      ar: 'عُمان، سلطنة الجمال الطبيعي والتراث العريق، حيث تلتقي الجبال الشامخة بالبحر الأزرق.',
      en: 'Oman, sultanate of natural beauty and ancient heritage, where towering mountains meet the blue sea.',
      fr: 'Oman, sultanat de beauté naturelle et patrimoine ancien, où les hautes montagnes rencontrent la mer bleue.'
    },
    mainImage: 'https://images.pexels.com/photos/15582263/pexels-photo-15582263.jpeg',
    flag: '🇴🇲',
    currency: {
      ar: 'الريال العُماني (OMR)',
      en: 'Omani Rial (OMR)',
      fr: 'Rial omanais (OMR)'
    },
    language: {
      ar: 'العربية، الإنجليزية',
      en: 'Arabic, English',
      fr: 'Arabe, Anglais'
    },
    timeZone: 'GMT+4',
    climate: {
      ar: 'صحراوي حار ومعتدل',
      en: 'Hot desert and temperate',
      fr: 'Désert chaud et tempéré'
    },
    bestTime: {
      ar: 'أكتوبر - أبريل',
      en: 'October - April',
      fr: 'Octobre - Avril'
    },
    visaRequired: true,
    rating: 4.7,
    totalReviews: 5420,
    totalTours: 35,
    totalHotels: 380,
    highlights: {
      ar: ['جامع السلطان قابوس الكبير', 'وادي شاب', 'صحراء وهيبة', 'نزوى التاريخية'],
      en: ['Sultan Qaboos Grand Mosque', 'Wadi Shab', 'Wahiba Sands', 'Historic Nizwa'],
      fr: ['Grande Mosquée du Sultan Qaboos', 'Wadi Shab', 'Sables de Wahiba', 'Nizwa Historique']
    },
    culture: {
      ar: 'عُمان تحتفظ بتراثها العربي الأصيل وتقاليدها البحرية العريقة.',
      en: 'Oman preserves its authentic Arab heritage and ancient maritime traditions.',
      fr: 'Oman préserve son héritage arabe authentique et ses traditions maritimes anciennes.'
    },
    cuisine: {
      ar: ['الشوى العُماني', 'الأرز بالهيل', 'الحلوى العُمانية'],
      en: ['Omani Grilled Meat', 'Cardamom Rice', 'Omani Halwa'],
      fr: ['Viande Grillée Omanaise', 'Riz à la Cardamome', 'Halwa Omanais']
    },
    transportation: {
      ar: ['الطيران العُماني', 'شبكة طرق حديثة', 'تأجير السيارات'],
      en: ['Oman Air', 'Modern road network', 'Car rental'],
      fr: ['Oman Air', 'Réseau routier moderne', 'Location de voitures']
    },
    safety: {
      ar: 'عُمان من أأمن دول المنطقة والعالم للسياحة.',
      en: 'Oman is one of the safest countries in the region and world for tourism.',
      fr: 'Oman est l\'un des pays les plus sûrs de la région et du monde pour le tourisme.'
    },
    cities: [
      {
        id: 'muscat',
        name: {
          ar: 'مسقط',
          en: 'Muscat',
          fr: 'Mascate'
        },
        description: {
          ar: 'عاصمة عُمان البيضاء، تجمع بين الطبيعة الخلابة والعمارة التقليدية.',
          en: 'Oman\'s white capital, combining stunning nature with traditional architecture.',
          fr: 'Capitale blanche d\'Oman, combinant nature époustouflante et architecture traditionnelle.'
        },
        image: 'https://images.pexels.com/photos/15582263/pexels-photo-15582263.jpeg',
        attractions: {
          ar: ['جامع السلطان قابوس', 'دار الأوبرا', 'سوق مطرح'],
          en: ['Sultan Qaboos Mosque', 'Opera House', 'Muttrah Souq'],
          fr: ['Mosquée Sultan Qaboos', 'Opéra', 'Souk de Muttrah']
        },
        bestTime: {
          ar: 'أكتوبر - أبريل',
          en: 'October - April',
          fr: 'Octobre - Avril'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.6,
        reviews: 2340,
        highlights: {
          ar: ['العمارة العُمانية التقليدية', 'الطبيعة الجبلية'],
          en: ['Traditional Omani architecture', 'Mountainous nature'],
          fr: ['Architecture omanaise traditionnelle', 'Nature montagneuse']
        },
        gallery: ['https://images.pexels.com/photos/15582263/pexels-photo-15582263.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/15582263/pexels-photo-15582263.jpeg']
  },

  yemen: {
    id: 'yemen',
    name: {
      ar: 'اليمن',
      en: 'Yemen',
      fr: 'Yémen'
    },
    capital: {
      ar: 'صنعاء',
      en: 'Sanaa',
      fr: 'Sanaa'
    },
    description: {
      ar: 'اليمن، أرض الحضارة اليمنية القديمة وموطن ملكة سبأ، حيث ا��تاريخ العريق والطبيعة الخلابة.',
      en: 'Yemen, land of ancient Yemeni civilization and home of Queen of Sheba, where ancient history meets stunning nature.',
      fr: 'Yémen, terre de l\'ancienne civilisation yéménite et foyer de la Reine de Saba, où l\'histoire ancienne rencontre une nature époustouflante.'
    },
    mainImage: 'https://images.pexels.com/photos/18928162/pexels-photo-18928162.jpeg',
    flag: '🇾🇪',
    currency: {
      ar: 'الريال اليمني (YER)',
      en: 'Yemeni Rial (YER)',
      fr: 'Rial yéménite (YER)'
    },
    language: {
      ar: 'العربية',
      en: 'Arabic',
      fr: 'Arabe'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'مداري جاف ومعتدل',
      en: 'Tropical dry and temperate',
      fr: 'Tropical sec et tempéré'
    },
    bestTime: {
      ar: 'أكتوبر - أبريل',
      en: 'October - April',
      fr: 'Octobre - Avril'
    },
    visaRequired: true,
    rating: 4.1,
    totalReviews: 1890,
    totalTours: 10,
    totalHotels: 120,
    highlights: {
      ar: ['صنعاء القديمة', 'جزيرة سقطرى', 'مدين�� شبام', 'جبال الحراز'],
      en: ['Old Sanaa', 'Socotra Island', 'Shibam City', 'Haraz Mountains'],
      fr: ['Vieux Sanaa', 'Île de Socotra', 'Ville de Shibam', 'Montagnes Haraz']
    },
    culture: {
      ar: 'اليمن مهد الحضارة العربية الجنوبية وموطن التراث المعماري الفريد.',
      en: 'Yemen is the cradle of South Arabian civilization and home to unique architectural heritage.',
      fr: 'Le Yémen est le berceau de la civilisation arabe du Sud et foyer d\'un patrimoine architectural unique.'
    },
    cuisine: {
      ar: ['السلتة اليمنية', 'الزربيان', 'الفحسة والملوح'],
      en: ['Yemeni Saltah', 'Zurbiyan', 'Fahsa and Malooh'],
      fr: ['Saltah yéménite', 'Zurbiyan', 'Fahsa et Malooh']
    },
    transportation: {
      ar: ['الخطوط اليمنية', 'حافلات النقل الداخلي', 'سيارات الأجرة'],
      en: ['Yemenia Airways', 'Domestic transport buses', 'Taxis'],
      fr: ['Yemenia Airways', 'Bus de transport domestique', 'Taxis']
    },
    safety: {
      ar: 'يُنصح بمتابعة التطورات الأمنية والتنسيق مع الجهات المختصة.',
      en: 'It is advised to monitor security developments and coordinate with relevant authorities.',
      fr: 'Il est conseillé de surveiller les développements sécuritaires et de coordonner avec les autorités compétentes.'
    },
    cities: [
      {
        id: 'sanaa',
        name: {
          ar: 'صنعاء',
          en: 'Sanaa',
          fr: 'Sanaa'
        },
        description: {
          ar: 'عاصمة اليمن التاريخية، إحدى أقدم المدن المأهولة في العالم.',
          en: 'Yemen\'s historic capital, one of the world\'s oldest continuously inhabited cities.',
          fr: 'Capitale historique du Yémen, l\'une des plus anciennes villes continuellement habitées du monde.'
        },
        image: 'https://images.pexels.com/photos/18928162/pexels-photo-18928162.jpeg',
        attractions: {
          ar: ['البيوت الطينية التقليدية', 'سوق صنعاء القديم', 'دار الحجر'],
          en: ['Traditional mud houses', 'Old Sanaa Market', 'Dar al-Hajar'],
          fr: ['Maisons traditionnelles en terre', 'Vieux Marché de Sanaa', 'Dar al-Hajar']
        },
        bestTime: {
          ar: 'أكتوبر - مارس',
          en: 'October - March',
          fr: 'Octobre - Mars'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.0,
        reviews: 890,
        highlights: {
          ar: ['العمارة اليمنية التقليدية', 'التراث العالمي'],
          en: ['Traditional Yemeni architecture', 'World Heritage'],
          fr: ['Architecture yéménite traditionnelle', 'Patrimoine mondial']
        },
        gallery: ['https://images.pexels.com/photos/18928162/pexels-photo-18928162.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/18928162/pexels-photo-18928162.jpeg']
  },

  palestine: {
    id: 'palestine',
    name: {
      ar: 'فلسطين',
      en: 'Palestine',
      fr: 'Palestine'
    },
    capital: {
      ar: 'القدس',
      en: 'Jerusalem',
      fr: 'Jérusalem'
    },
    description: {
      ar: 'فلسطين، أرض الرسالات والحضارات، موطن القدس الشريف والمسجد الأقصى المبارك.',
      en: 'Palestine, land of messages and civilizations, home to holy Jerusalem and blessed Al-Aqsa Mosque.',
      fr: 'Palestine, terre de messages et de civilisations, foyer de la sainte Jérusalem et de la bénie Mosquée Al-Aqsa.'
    },
    mainImage: 'https://images.pexels.com/photos/6207599/pexels-photo-6207599.jpeg',
    flag: '🇵🇸',
    currency: {
      ar: 'الشيكل الإسرائيلي (ILS)',
      en: 'Israeli Shekel (ILS)',
      fr: 'Shekel israélien (ILS)'
    },
    language: {
      ar: 'العربية، الإنجليزية',
      en: 'Arabic, English',
      fr: 'Arabe, Anglais'
    },
    timeZone: 'GMT+2',
    climate: {
      ar: 'متوسطي معتدل',
      en: 'Temperate Mediterranean',
      fr: 'Méditerranéen tempéré'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: true,
    rating: 4.8,
    totalReviews: 6780,
    totalTours: 30,
    totalHotels: 280,
    highlights: {
      ar: ['المسجد الأقصى المبارك', 'كنيسة المهد في بيت لحم', 'البلدة القديمة في القدس', 'رام الله الثقافية'],
      en: ['Blessed Al-Aqsa Mosque', 'Church of Nativity in Bethlehem', 'Old City of Jerusalem', 'Cultural Ramallah'],
      fr: ['Bénie Mosquée Al-Aqsa', 'Église de la Nativité à Bethléem', 'Vieille Ville de Jérusalem', 'Ramallah Culturelle']
    },
    culture: {
      ar: 'فلسطين مهد ال��يانات السماوية الثلاث وموطن التراث الكنعاني والعربي.',
      en: 'Palestine is the cradle of the three Abrahamic religions and home to Canaanite and Arab heritage.',
      fr: 'La Palestine est le berceau des trois religions abrahamiques et foyer du patrimoine cananéen et arabe.'
    },
    cuisine: {
      ar: ['المسخن الفلسطيني', 'الكنافة النابلسية', 'المقلوبة الفلسطينية'],
      en: ['Palestinian Musakhan', 'Nabulsi Kanafeh', 'Palestinian Maqluba'],
      fr: ['Musakhan palestinien', 'Kanafeh de Naplouse', 'Maqluba palestinienne']
    },
    transportation: {
      ar: ['حافلات النقل العام', 'سيارات الأجرة', 'الطرق الداخلية'],
      en: ['Public transport buses', 'Taxis', 'Internal roads'],
      fr: ['Bus de transport public', 'Taxis', 'Routes intérieures']
    },
    safety: {
      ar: 'يُنصح بمتابعة التطورات الأمنية والتنسيق مع الجهات المختصة.',
      en: 'It is advised to monitor security developments and coordinate with relevant authorities.',
      fr: 'Il est conseillé de surveiller les développements sécuritaires et de coordonner avec les autorités compétentes.'
    },
    cities: [
      {
        id: 'jerusalem',
        name: {
          ar: 'القدس',
          en: 'Jerusalem',
          fr: 'J��rusalem'
        },
        description: {
          ar: 'مدينة القدس الشريف، أولى القبلتين وثالث الحرمين الشريفين.',
          en: 'Holy City of Jerusalem, first of the two qiblas and third of the holy sanctuaries.',
          fr: 'Sainte Ville de Jérusalem, première des deux qiblas et troisième des sanctuaires sacrés.'
        },
        image: 'https://images.pexels.com/photos/6207599/pexels-photo-6207599.jpeg',
        attractions: {
          ar: ['المسجد الأقصى', 'قبة الصخرة', 'البلدة القديمة'],
          en: ['Al-Aqsa Mosque', 'Dome of the Rock', 'Old City'],
          fr: ['Mosquée Al-Aqsa', 'Dôme du Rocher', 'Vieille Ville']
        },
        bestTime: {
          ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
          en: 'April - June, September - November',
          fr: 'Avril - Juin, Septembre - Novembre'
        },
        duration: {
          ar: '2-4 أيام',
          en: '2-4 days',
          fr: '2-4 jours'
        },
        rating: 4.9,
        reviews: 3890,
        highlights: {
          ar: ['الأماكن المقدسة', 'التراث الديني'],
          en: ['Sacred places', 'Religious heritage'],
          fr: ['Lieux sacrés', 'Patrimoine religieux']
        },
        gallery: ['https://images.pexels.com/photos/6207599/pexels-photo-6207599.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/6207599/pexels-photo-6207599.jpeg']
  },

  tunisia: {
    id: 'tunisia',
    name: {
      ar: 'تونس',
      en: 'Tunisia',
      fr: 'Tunisie'
    },
    capital: {
      ar: 'تونس العاصمة',
      en: 'Tunis',
      fr: 'Tunis'
    },
    description: {
      ar: 'تونس، لؤلؤة شمال إفريقيا وموطن قرطاج التاريخية، حيث تلتقي الحضارة العربية بالتراث المتوسطي.',
      en: 'Tunisia, pearl of North Africa and home to historic Carthage, where Arab civilization meets Mediterranean heritage.',
      fr: 'La Tunisie, perle de l\'Afrique du Nord et foyer de la Carthage historique, où la civilisation arabe rencontre l\'héritage méditerranéen.'
    },
    mainImage: 'https://images.pexels.com/photos/4825711/pexels-photo-4825711.jpeg',
    flag: '🇹🇳',
    currency: {
      ar: 'الدينار التونسي (TND)',
      en: 'Tunisian Dinar (TND)',
      fr: 'Dinar tunisien (TND)'
    },
    language: {
      ar: 'العربية، الفرنسية',
      en: 'Arabic, French',
      fr: 'Arabe, Français'
    },
    timeZone: 'GMT+1',
    climate: {
      ar: 'متوسطي معتدل',
      en: 'Temperate Mediterranean',
      fr: 'Méditerranéen tempéré'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: false,
    rating: 4.5,
    totalReviews: 7890,
    totalTours: 40,
    totalHotels: 480,
    highlights: {
      ar: ['سيدي بو سعيد الخلابة', 'قرطاج الأثرية', 'جامع الزيتونة', 'الصحراء التونسية'],
      en: ['Picturesque Sidi Bou Said', 'Ancient Carthage', 'Zitouna Mosque', 'Tunisian Sahara'],
      fr: ['Pittoresque Sidi Bou Said', 'Carthage Antique', 'Mosquée Zitouna', 'Sahara Tunisien']
    },
    culture: {
      ar: 'تونس جسر بين الحضارات العربية والأفريقية والمتوسطية.',
      en: 'Tunisia is a bridge between Arab, African and Mediterranean civilizations.',
      fr: 'La Tunisie est un pont entre les civilisations arabe, africaine et méditerranéenne.'
    },
    cuisine: {
      ar: ['ال��سكس التونسي', 'البريك والحريسة', 'الطاجين ��لتونسي'],
      en: ['Tunisian Couscous', 'Brik and Harissa', 'Tunisian Tajine'],
      fr: ['Couscous tunisien', 'Brik et Harissa', 'Tajine tunisien']
    },
    transportation: {
      ar: ['الخطوط التونسية', 'شبكة قطارات حديثة', 'تأجير السيارات'],
      en: ['Tunisair', 'Modern train network', 'Car rental'],
      fr: ['Tunisair', 'Réseau ferroviaire moderne', 'Location de voitures']
    },
    safety: {
      ar: 'تونس وجهة سياحية آمنة مع أمن سياحي متخصص.',
      en: 'Tunisia is a safe tourist destination with specialized tourist security.',
      fr: 'La Tunisie est une destination touristique sûre avec une sécurité touristique spécialisée.'
    },
    cities: [
      {
        id: 'tunis',
        name: {
          ar: 'تونس العاصمة',
          en: 'Tunis',
          fr: 'Tunis'
        },
        description: {
          ar: 'عاصمة تونس وقلب الحضارة التونسية النابض.',
          en: 'Capital of Tunisia and beating heart of Tunisian civilization.',
          fr: 'Capitale de la Tunisie et cœur battant de la civilisation tunisienne.'
        },
        image: 'https://images.pexels.com/photos/4825711/pexels-photo-4825711.jpeg',
        attractions: {
          ar: ['المدينة العتيقة', 'جامع الزيتونة', 'متحف باردو'],
          en: ['Old Medina', 'Zitouna Mosque', 'Bardo Museum'],
          fr: ['Vieille Médina', 'Mosquée Zitouna', 'Musée du Bardo']
        },
        bestTime: {
          ar: 'أبريل - يونيو، سب��مبر - نوفمبر',
          en: 'April - June, September - November',
          fr: 'Avril - Juin, Septembre - Novembre'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.4,
        reviews: 2890,
        highlights: {
          ar: ['التراث الإسلامي', 'الثقافة المتوسطية'],
          en: ['Islamic heritage', 'Mediterranean culture'],
          fr: ['Patrimoine islamique', 'Culture méditerranéenne']
        },
        gallery: ['https://images.pexels.com/photos/4825711/pexels-photo-4825711.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/4825711/pexels-photo-4825711.jpeg']
  },

  algeria: {
    id: 'algeria',
    name: {
      ar: 'الجزائر',
      en: 'Algeria',
      fr: 'Algérie'
    },
    capital: {
      ar: 'الجزائر العاصمة',
      en: 'Algiers',
      fr: 'Alger'
    },
    description: {
      ar: 'الجز��ئر، بلاد المليون شهيد وأكبر دول إفريقيا، تمتد من البحر المتوسط إلى قلب الصحراء الكبرى.',
      en: 'Algeria, land of a million martyrs and Africa\'s largest country, stretching from the Mediterranean to the heart of the Sahara.',
      fr: 'L\'Algérie, terre d\'un million de martyrs et plus grand pays d\'Afrique, s\'étendant de la Méditerranée au cœur du Sahara.'
    },
    mainImage: 'https://images.pexels.com/photos/12894688/pexels-photo-12894688.jpeg',
    flag: '🇩🇿',
    currency: {
      ar: 'الدينار الجزائري (DZD)',
      en: 'Algerian Dinar (DZD)',
      fr: 'Dinar algérien (DZD)'
    },
    language: {
      ar: 'العربية، الأمازيغية، الفرنسية',
      en: 'Arabic, Berber, French',
      fr: 'Arabe, Berbère, Français'
    },
    timeZone: 'GMT+1',
    climate: {
      ar: 'متوسطي وصحراوي',
      en: 'Mediterranean and desert',
      fr: 'Méditerranéen et désertique'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: true,
    rating: 4.3,
    totalReviews: 4890,
    totalTours: 25,
    totalHotels: 350,
    highlights: {
      ar: ['القصبة الجزائرية', 'تيبازة الأثرية', 'الصحراء الكبرى', 'قسنطينة المعلقة'],
      en: ['Algiers Casbah', 'Ancient Tipaza', 'Great Sahara', 'Suspended Constantine'],
      fr: ['Casbah d\'Alger', 'Tipaza Antique', 'Grand Sahara', 'Constantine Suspendue']
    },
    culture: {
      ar: 'الجزائر تجمع بين التراث العربي والأمازيغي والتأثيرات المتوسطية.',
      en: 'Algeria combines Arab and Berber heritage with Mediterranean influences.',
      fr: 'L\'Algérie combine l\'héritage arabe et berbère avec les influences méditerranéennes.'
    },
    cuisine: {
      ar: ['الكسكس الجزائري', 'الطاجين الجزائري', 'الحلويات العربية'],
      en: ['Algerian Couscous', 'Algerian Tajine', 'Arabic Sweets'],
      fr: ['Couscous algérien', 'Tajine algérien', 'Pâtisseries arabes']
    },
    transportation: {
      ar: ['الخطوط الجوية الجزائرية', 'شبكة طرق واسعة', 'قطارات داخلية'],
      en: ['Air Algérie', 'Extensive road network', 'Domestic trains'],
      fr: ['Air Algérie', 'Vaste réseau routier', 'Trains domestiques']
    },
    safety: {
      ar: 'الجزائر بلد آمن للسياحة مع ضرورة اتباع الإرشادات المحلية.',
      en: 'Algeria is a safe country for tourism with the need to follow local guidelines.',
      fr: 'L\'Algérie est un pays sûr pour le tourisme avec la nécessité de suivre les directives locales.'
    },
    cities: [
      {
        id: 'algiers',
        name: {
          ar: 'الجزائر العاصمة',
          en: 'Algiers',
          fr: 'Alger'
        },
        description: {
          ar: 'عاصمة الجزائر وبوابة المغرب العربي، تشتهر بالقصبة التاريخية.',
          en: 'Capital of Algeria and gateway to the Maghreb, famous for its historic Casbah.',
          fr: 'Capitale de l\'Algérie et porte du Maghreb, célèbre pour sa Casbah historique.'
        },
        image: 'https://images.pexels.com/photos/12894688/pexels-photo-12894688.jpeg',
        attractions: {
          ar: ['القصبة التاريخية', 'مسجد كتشاوة', 'متحف المجاهد'],
          en: ['Historic Casbah', 'Ketchaoua Mosque', 'Mujahid Museum'],
          fr: ['Casbah Historique', 'Mosquée Ketchaoua', 'Musée du Mujahid']
        },
        bestTime: {
          ar: 'أبريل - يونيو، أكتوبر - ديسمبر',
          en: 'April - June, October - December',
          fr: 'Avril - Juin, Octobre - Décembre'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.2,
        reviews: 1890,
        highlights: {
          ar: ['العمارة العثمانية', 'التراث الثوري'],
          en: ['Ottoman architecture', 'Revolutionary heritage'],
          fr: ['Architecture ottomane', 'Patrimoine révolutionnaire']
        },
        gallery: ['https://images.pexels.com/photos/12894688/pexels-photo-12894688.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/12894688/pexels-photo-12894688.jpeg']
  },

  libya: {
    id: 'libya',
    name: {
      ar: 'ليبيا',
      en: 'Libya',
      fr: 'Libye'
    },
    capital: {
      ar: 'طرابلس',
      en: 'Tripoli',
      fr: 'Tripoli'
    },
    description: {
      ar: 'ليبيا، أرض الحضارة الرومانية والبيزنطية، تحتضن آثار لبدة الكبرى وصبراتة.',
      en: 'Libya, land of Roman and Byzantine civilization, home to the ruins of Leptis Magna and Sabratha.',
      fr: 'La Libye, terre de civilisation romaine et byzantine, abritant les ruines de Leptis Magna et Sabratha.'
    },
    mainImage: 'https://images.pexels.com/photos/12347040/pexels-photo-12347040.jpeg',
    flag: '🇱🇾',
    currency: {
      ar: 'الدينار الل��بي (LYD)',
      en: 'Libyan Dinar (LYD)',
      fr: 'Dinar libyen (LYD)'
    },
    language: {
      ar: 'العربية',
      en: 'Arabic',
      fr: 'Arabe'
    },
    timeZone: 'GMT+2',
    climate: {
      ar: 'صحراوي حار وجاف',
      en: 'Hot and dry desert',
      fr: 'Désert chaud et sec'
    },
    bestTime: {
      ar: 'أكتوبر - أبريل',
      en: 'October - April',
      fr: 'Octobre - Avril'
    },
    visaRequired: true,
    rating: 4.0,
    totalReviews: 1450,
    totalTours: 8,
    totalHotels: 120,
    highlights: {
      ar: ['لبدة الكبرى الأثرية', 'صبراتة الرومانية', 'مدينة طرابلس القديمة', 'أكاكوس الصحراوية'],
      en: ['Ancient Leptis Magna', 'Roman Sabratha', 'Old City of Tripoli', 'Saharan Akakus'],
      fr: ['Antique Leptis Magna', 'Sabratha Romaine', 'Vieille Ville de Tripoli', 'Akakus Saharien']
    },
    culture: {
      ar: 'ليبيا موطن حضارات متعددة من الرومانية إلى العربية الإسلامية.',
      en: 'Libya is home to multiple civilizations from Roman to Arab-Islamic.',
      fr: 'La Libye abrite de multiples civilisations, de la romaine à l\'arabo-islamique.'
    },
    cuisine: {
      ar: ['الك��كس الليبي', 'البازين', 'الشوربة الليبية'],
      en: ['Libyan Couscous', 'Bazin', 'Libyan Soup'],
      fr: ['Couscous libyen', 'Bazin', 'Soupe libyenne']
    },
    transportation: {
      ar: ['الخطوط الليبية', 'شبكة طرق ساحلية', 'النقل البري'],
      en: ['Libyan Airlines', 'Coastal road network', 'Land transport'],
      fr: ['Libyan Airlines', 'Réseau routier côtier', 'Transport terrestre']
    },
    safety: {
      ar: 'يُنصح بمتابعة التطورات الأمنية والتنسيق مع الجهات المختصة.',
      en: 'It is advised to monitor security developments and coordinate with relevant authorities.',
      fr: 'Il est conseillé de surveiller les développements sécuritaires et de coordonner avec les autorités compétentes.'
    },
    cities: [
      {
        id: 'tripoli',
        name: {
          ar: 'طرابلس',
          en: 'Tripoli',
          fr: 'Tripoli'
        },
        description: {
          ar: 'عاصمة ليبيا وميناؤها الرئيسي على البحر المتوسط.',
          en: 'Capital of Libya and its main port on the Mediterranean Sea.',
          fr: 'Capitale de la Libye et son port principal sur la Méditerranée.'
        },
        image: 'https://images.pexels.com/photos/12347040/pexels-photo-12347040.jpeg',
        attractions: {
          ar: ['المدينة القديمة', 'سوق الترك', 'قوس ��اركوس أوريليوس'],
          en: ['Old City', 'Souq al-Turk', 'Arch of Marcus Aurelius'],
          fr: ['Vieille Ville', 'Souq al-Turk', 'Arc de Marc Aurèle']
        },
        bestTime: {
          ar: 'أكتوبر - أبريل',
          en: 'October - April',
          fr: 'Octobre - Avril'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 3.9,
        reviews: 670,
        highlights: {
          ar: ['التراث العثماني', 'الآثار الرومانية'],
          en: ['Ottoman heritage', 'Roman ruins'],
          fr: ['Patrimoine ottoman', 'Ruines romaines']
        },
        gallery: ['https://images.pexels.com/photos/12347040/pexels-photo-12347040.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/12347040/pexels-photo-12347040.jpeg']
  },

  mauritania: {
    id: 'mauritania',
    name: {
      ar: 'موريتانيا',
      en: 'Mauritania',
      fr: 'Mauritanie'
    },
    capital: {
      ar: 'نواكشوط',
      en: 'Nouakchott',
      fr: 'Nouakchott'
    },
    description: {
      ar: 'موريتانيا، بوابة المغرب العربي إلى إفريقيا السوداء، أرض الصحراء الذهبية والتراث العربي الأصيل.',
      en: 'Mauritania, gateway of the Maghreb to Black Africa, land of golden desert and authentic Arab heritage.',
      fr: 'La Mauritanie, porte du Maghreb vers l\'Afrique Noire, terre de désert doré et patrimoine arabe authentique.'
    },
    mainImage: 'https://images.pexels.com/photos/17745848/pexels-photo-17745848.jpeg',
    flag: '🇲🇷',
    currency: {
      ar: 'الأوقية الموريتانية (MRU)',
      en: 'Mauritanian Ouguiya (MRU)',
      fr: 'Ouguiya mauritanien (MRU)'
    },
    language: {
      ar: 'العربية، الفرنسية',
      en: 'Arabic, French',
      fr: 'Arabe, Français'
    },
    timeZone: 'GMT+0',
    climate: {
      ar: 'صحراوي حار وجاف',
      en: 'Hot and dry desert',
      fr: 'Désert chaud et sec'
    },
    bestTime: {
      ar: 'نوفمبر - فبراير',
      en: 'November - February',
      fr: 'Novembre - Février'
    },
    visaRequired: true,
    rating: 4.1,
    totalReviews: 890,
    totalTours: 12,
    totalHotels: 80,
    highlights: {
      ar: ['شنقيط التاريخية', 'أدرار الصحراوية', 'حديقة بانك دارجين الوطنية', 'نواكشوط العاصمة'],
      en: ['Historic Chinguetti', 'Saharan Adrar', 'Banc d\'Arguin National Park', 'Capital Nouakchott'],
      fr: ['Chinguetti Historique', 'Adrar Saharien', 'Parc National du Banc d\'Arguin', 'Capitale Nouakchott']
    },
    culture: {
      ar: 'موريتانيا ملتقى الثقافة العربية والأفريقية مع تراث بدوي عريق.',
      en: 'Mauritania is a meeting point of Arab and African culture with ancient Bedouin heritage.',
      fr: 'La Mauritanie est un point de rencontre de la culture arabe et africaine avec un patrimoine bédouin ancien.'
    },
    cuisine: {
      ar: ['الثيبودين الموريتاني', 'اللحم المشوي', 'الشاي الموريتاني'],
      en: ['Mauritanian Thieboudienne', 'Grilled Meat', 'Mauritanian Tea'],
      fr: ['Thieboudienne mauritanien', 'Viande Grillée', 'Thé mauritanien']
    },
    transportation: {
      ar: ['موريتانيا للطيران', 'النقل البري عبر الصحراء', 'حافلات النقل الداخلي'],
      en: ['Mauritania Airlines', 'Desert land transport', 'Domestic transport buses'],
      fr: ['Mauritania Airlines', 'Transport terrestre du désert', 'Bus de transport domestique']
    },
    safety: {
      ar: 'يُنصح بالتنسيق مع الجهات المحلية والحصول على الإرشادات الأمنية.',
      en: 'It is advised to coordinate with local authorities and obtain security guidance.',
      fr: 'Il est conseillé de coordonner avec les autorités locales et d\'obtenir des conseils de sécurité.'
    },
    cities: [
      {
        id: 'nouakchott',
        name: {
          ar: 'نواكشوط',
          en: 'Nouakchott',
          fr: 'Nouakchott'
        },
        description: {
          ar: 'عاصمة موريتانيا الحديثة، تقع على ساحل المحيط الأطلسي.',
          en: 'Modern capital of Mauritania, located on the Atlantic Ocean coast.',
          fr: 'Capitale moderne de la Mauritanie, située sur la côte de l\'Océan Atlantique.'
        },
        image: 'https://images.pexels.com/photos/17745848/pexels-photo-17745848.jpeg',
        attractions: {
          ar: ['السوق الكبير', 'شاطئ المحيط الأطلسي', 'مسجد نواكشوط الكبير'],
          en: ['Grand Market', 'Atlantic Ocean Beach', 'Grand Mosque of Nouakchott'],
          fr: ['Grand Marché', 'Plage de l\'Océan Atlantique', 'Grande Mosquée de Nouakchott']
        },
        bestTime: {
          ar: 'نوفمبر - فبراير',
          en: 'November - February',
          fr: 'Novembre - Février'
        },
        duration: {
          ar: '1-2 يوم',
          en: '1-2 days',
          fr: '1-2 jours'
        },
        rating: 4.0,
        reviews: 450,
        highlights: {
          ar: ['الثقافة الموريتانية', 'الحياة الصحراوية'],
          en: ['Mauritanian culture', 'Desert life'],
          fr: ['Culture mauritanienne', 'Vie désertique']
        },
        gallery: ['https://images.pexels.com/photos/17745848/pexels-photo-17745848.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/17745848/pexels-photo-17745848.jpeg']
  },

  somalia: {
    id: 'somalia',
    name: {
      ar: 'الصومال',
      en: 'Somalia',
      fr: 'Somalie'
    },
    capital: {
      ar: 'مقديشو',
      en: 'Mogadishu',
      fr: 'Mogadiscio'
    },
    description: {
      ar: 'الصومال، أرض القرن الأفريقي وموطن الثقافة الصومالية العريقة، يطل على المحيط الهندي والبحر الأحمر.',
      en: 'Somalia, land of the Horn of Africa and home to ancient Somali culture, overlooking the Indian Ocean and Red Sea.',
      fr: 'La Somalie, terre de la Corne de l\'Afrique et foyer de l\'ancienne culture somalienne, donnant sur l\'Océan Indien et la Mer Rouge.'
    },
    mainImage: 'https://images.pexels.com/photos/18127882/pexels-photo-18127882.jpeg',
    flag: '🇸🇴',
    currency: {
      ar: 'الشلن الصومالي (SOS)',
      en: 'Somali Shilling (SOS)',
      fr: 'Shilling somalien (SOS)'
    },
    language: {
      ar: 'الصومالية، العربية، الإنجليزية',
      en: 'Somali, Arabic, English',
      fr: 'Somali, Arabe, Anglais'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'مداري حار وجاف',
      en: 'Hot and dry tropical',
      fr: 'Tropical chaud et sec'
    },
    bestTime: {
      ar: 'ديسمبر - فبراير',
      en: 'December - February',
      fr: 'Décembre - Février'
    },
    visaRequired: true,
    rating: 3.8,
    totalReviews: 680,
    totalTours: 6,
    totalHotels: 45,
    highlights: {
      ar: ['شواطئ المحيط الهندي', 'مقديشو التاريخية', 'مدينة هرجيسا', 'التراث الصومالي'],
      en: ['Indian Ocean beaches', 'Historic Mogadishu', 'Hargeisa city', 'Somali heritage'],
      fr: ['Plages de l\'Océan Indien', 'Mogadiscio historique', 'Ville de Hargeisa', 'Patrimoine somalien']
    },
    culture: {
      ar: 'الصومال موطن ثقافة بحرية وتجارية عريقة تمتد لقرون.',
      en: 'Somalia is home to an ancient maritime and trading culture spanning centuries.',
      fr: 'La Somalie abrite une ancienne culture maritime et commerciale s\'étendant sur des siècles.'
    },
    cuisine: {
      ar: ['الأرز الصومالي بالتوابل', 'السمك المشوي', 'ال��بز الصومالي'],
      en: ['Spiced Somali Rice', 'Grilled Fish', 'Somali Bread'],
      fr: ['Riz somalien épicé', 'Poisson grillé', 'Pain somalien']
    },
    transportation: {
      ar: ['رحلات داخلية محدودة', 'النقل البحري', 'النقل البري'],
      en: ['Limited domestic flights', 'Maritime transport', 'Land transport'],
      fr: ['Vols domestiques limités', 'Transport maritime', 'Transport terrestre']
    },
    safety: {
      ar: 'يُنصح بشدة بمتابعة التطورات الأمنية والتنسيق مع السلطات.',
      en: 'It is strongly advised to monitor security developments and coordinate with authorities.',
      fr: 'Il est fortement conseillé de surveiller les développements sécuritaires et de coordonner avec les autorités.'
    },
    cities: [
      {
        id: 'mogadishu',
        name: {
          ar: 'مقديشو',
          en: 'Mogadishu',
          fr: 'Mogadiscio'
        },
        description: {
          ar: 'عاصمة الصومال وأكبر مدنها، مركز التجارة والثقافة الصو��الية.',
          en: 'Capital and largest city of Somalia, center of Somali trade and culture.',
          fr: 'Capitale et plus grande ville de Somalie, centre du commerce et de la culture somalienne.'
        },
        image: 'https://images.pexels.com/photos/18127882/pexels-photo-18127882.jpeg',
        attractions: {
          ar: ['الأسواق التقليدية', 'الشواطئ', 'المباني التاريخية'],
          en: ['Traditional markets', 'Beaches', 'Historic buildings'],
          fr: ['Marchés traditionnels', 'Plages', 'Bâtiments historiques']
        },
        bestTime: {
          ar: 'ديسمبر - فبراير',
          en: 'December - February',
          fr: 'Décembre - Février'
        },
        duration: {
          ar: '1-2 يوم',
          en: '1-2 days',
          fr: '1-2 jours'
        },
        rating: 3.7,
        reviews: 290,
        highlights: {
          ar: ['الثقافة الصومالية', 'الحياة البحرية'],
          en: ['Somali culture', 'Maritime life'],
          fr: ['Culture somalienne', 'Vie maritime']
        },
        gallery: ['https://images.pexels.com/photos/18127882/pexels-photo-18127882.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/18127882/pexels-photo-18127882.jpeg']
  },

  djibouti: {
    id: 'djibouti',
    name: {
      ar: 'جيبوتي',
      en: 'Djibouti',
      fr: 'Djibouti'
    },
    capital: {
      ar: 'مدينة جيبوتي',
      en: 'Djibouti City',
      fr: 'Ville de Djibouti'
    },
    description: {
      ar: 'جيبوتي، لؤلؤة القرن الأفريقي الصغيرة، تقع على مضيق باب المندب الاستراتيجي.',
      en: 'Djibouti, small pearl of the Horn of Africa, located on the strategic Bab el-Mandeb strait.',
      fr: 'Djibouti, petite perle de la Corne de l\'Afrique, située sur le détroit stratégique de Bab el-Mandeb.'
    },
    mainImage: 'https://images.pexels.com/photos/21570476/pexels-photo-21570476.jpeg',
    flag: '🇩🇯',
    currency: {
      ar: 'الفرنك الجيبوتي (DJF)',
      en: 'Djiboutian Franc (DJF)',
      fr: 'Franc djiboutien (DJF)'
    },
    language: {
      ar: 'العربية، الفرنسية، الصومالية',
      en: 'Arabic, French, Somali',
      fr: 'Arabe, Français, Somali'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'صحراوي حار وجاف',
      en: 'Hot and dry desert',
      fr: 'Désert chaud et sec'
    },
    bestTime: {
      ar: 'نوفمبر - مارس',
      en: 'November - March',
      fr: 'Novembre - Mars'
    },
    visaRequired: true,
    rating: 4.2,
    totalReviews: 720,
    totalTours: 8,
    totalHotels: 55,
    highlights: {
      ar: ['بحيرة عسل الما��حة', 'بحيرة عبة', 'خليج تادجورة', 'الأسواق التقليدية'],
      en: ['Lake Assal salt lake', 'Lake Abbe', 'Gulf of Tadjoura', 'Traditional markets'],
      fr: ['Lac salé Assal', 'Lac Abbe', 'Golfe de Tadjourah', 'Marchés traditionnels']
    },
    culture: {
      ar: 'جيبوتي ملتقى الثقافات العربية والأفريقية والفرنسية.',
      en: 'Djibouti is a meeting point of Arab, African and French cultures.',
      fr: 'Djibouti est un point de rencontre des cultures arabe, africaine et française.'
    },
    cuisine: {
      ar: ['الأسماك الطازجة', 'الخ��ز الفرنسي', 'القهوة العربية'],
      en: ['Fresh fish', 'French bread', 'Arabic coffee'],
      fr: ['Poisson frais', 'Pain français', 'Café arabe']
    },
    transportation: {
      ar: ['مطار جيبوتي الدولي', 'الموانئ البحرية', 'النقل البري'],
      en: ['Djibouti International Airport', 'Seaports', 'Land transport'],
      fr: ['Aéroport International de Djibouti', 'Ports maritimes', 'Transport terrestre']
    },
    safety: {
      ar: 'جيبوتي بلد آمن نسبياً مع استقرار سياسي.',
      en: 'Djibouti is a relatively safe country with political stability.',
      fr: 'Djibouti est un pays relativement sûr avec une stabilité politique.'
    },
    cities: [
      {
        id: 'djibouti_city',
        name: {
          ar: 'مدينة جيبوتي',
          en: 'Djibouti City',
          fr: 'Ville de Djibouti'
        },
        description: {
          ar: 'عاصمة جيبوتي وميناؤها الرئيسي، نافذة إفريقيا على العالم.',
          en: 'Capital of Djibouti and its main port, Africa\'s window to the world.',
          fr: 'Capitale de Djibouti et son port principal, fenêtre de l\'Afrique sur le monde.'
        },
        image: 'https://images.pexels.com/photos/21570476/pexels-photo-21570476.jpeg',
        attractions: {
          ar: ['الميناء التجاري', 'الأسواق المحلية', 'القصر الرئاسي'],
          en: ['Commercial port', 'Local markets', 'Presidential palace'],
          fr: ['Port commercial', 'Marchés locaux', 'Palais présidentiel']
        },
        bestTime: {
          ar: 'نوفمبر - مارس',
          en: 'November - March',
          fr: 'Novembre - Mars'
        },
        duration: {
          ar: '1-2 يوم',
          en: '1-2 days',
          fr: '1-2 jours'
        },
        rating: 4.1,
        reviews: 380,
        highlights: {
          ar: ['الموقع الاستراتيجي', 'التنوع الثقافي'],
          en: ['Strategic location', 'Cultural diversity'],
          fr: ['Position stratégique', 'Diversité culturelle']
        },
        gallery: ['https://images.pexels.com/photos/21570476/pexels-photo-21570476.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/21570476/pexels-photo-21570476.jpeg']
  },

  comoros: {
    id: 'comoros',
    name: {
      ar: 'جزر القمر',
      en: 'Comoros',
      fr: 'Comores'
    },
    capital: {
      ar: 'موروني',
      en: 'Moroni',
      fr: 'Moroni'
    },
    description: {
      ar: 'جزر القمر، لآلئ المحيط الهندي العربية، أرخبيل ساحر يجمع بين الثقافة العربية والأفريقية.',
      en: 'Comoros, Arabic pearls of the Indian Ocean, a charming archipelago combining Arab and African culture.',
      fr: 'Comores, perles arabes de l\'Océan Indien, un archipel charmant combinant culture arabe et africaine.'
    },
    mainImage: 'https://images.pexels.com/photos/25914203/pexels-photo-25914203.jpeg',
    flag: '🇰🇲',
    currency: {
      ar: 'الفرنك القمري (KMF)',
      en: 'Comorian Franc (KMF)',
      fr: 'Franc comorien (KMF)'
    },
    language: {
      ar: 'العربية، الفرنسية، القمرية',
      en: 'Arabic, French, Comorian',
      fr: 'Arabe, Français, Comorien'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'مداري معتدل',
      en: 'Temperate tropical',
      fr: 'Tropical tempéré'
    },
    bestTime: {
      ar: 'مايو - أكتوبر',
      en: 'May - October',
      fr: 'Mai - Octobre'
    },
    visaRequired: true,
    rating: 4.4,
    totalReviews: 580,
    totalTours: 10,
    totalHotels: 35,
    highlights: {
      ar: ['شواطئ بركانية خلابة', 'جبل كارثالا النشط', 'الثقافة العربية الأفريقية', 'الطبيعة الاستوائية'],
      en: ['Stunning volcanic beaches', 'Active Mount Karthala', 'Arab-African culture', 'Tropical nature'],
      fr: ['Plages volcaniques magnifiques', 'Mont Karthala actif', 'Culture arabo-africaine', 'Nature tropicale']
    },
    culture: {
      ar: 'جزر القمر تمزج بين التراث العربي الإسلامي والثقافة الأفريقية والفرنس��ة.',
      en: 'Comoros blends Arab-Islamic heritage with African and French culture.',
      fr: 'Les Comores mélangent l\'héritage arabo-islamique avec la culture africaine et française.'
    },
    cuisine: {
      ar: ['الأرز بجوز الهند', 'السمك بالكاري', 'الفواكه الاستوائية'],
      en: ['Coconut rice', 'Curry fish', 'Tropical fruits'],
      fr: ['Riz à la noix de coco', 'Poisson au curry', 'Fruits tropicaux']
    },
    transportation: {
      ar: ['رحلات جوية بين الجزر', 'قوارب بحرية', 'تاكسي محلي'],
      en: ['Inter-island flights', 'Maritime boats', 'Local taxis'],
      fr: ['Vols inter-îles', 'Bateaux maritimes', 'Taxis locaux']
    },
    safety: {
      ar: 'جزر القمر وجهة آمنة مع ضرورة اتخاذ الاحتياطات المعتادة.',
      en: 'Comoros is a safe destination with the need for standard precautions.',
      fr: 'Les Comores sont une destination sûre avec la nécessité de précautions standard.'
    },
    cities: [
      {
        id: 'moroni',
        name: {
          ar: 'موروني',
          en: 'Moroni',
          fr: 'Moroni'
        },
        description: {
          ar: 'عاصمة جزر القمر الساحرة، تقع على ساحل ج��يرة القمر الكبرى.',
          en: 'Charming capital of Comoros, located on the coast of Grande Comore island.',
          fr: 'Charmante capitale des Comores, située sur la côte de l\'île de Grande Comore.'
        },
        image: 'https://images.pexels.com/photos/25914203/pexels-photo-25914203.jpeg',
        attractions: {
          ar: ['المسجد الكبير', 'السوق القديم', 'الشواطئ البركانية'],
          en: ['Grand Mosque', 'Old Market', 'Volcanic beaches'],
          fr: ['Grande Mosquée', 'Vieux Marché', 'Plages volcaniques']
        },
        bestTime: {
          ar: 'مايو - أكتوبر',
          en: 'May - October',
          fr: 'Mai - Octobre'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.3,
        reviews: 290,
        highlights: {
          ar: ['الهندسة المعمارية الإسلامية', 'الطبيعة البركانية'],
          en: ['Islamic architecture', 'Volcanic nature'],
          fr: ['Architecture islamique', 'Nature volcanique']
        },
        gallery: ['https://images.pexels.com/photos/25914203/pexels-photo-25914203.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/25914203/pexels-photo-25914203.jpeg']
  },

  turkey: {
    id: 'turkey',
    name: {
      ar: 'تركيا',
      en: 'Turkey',
      fr: 'Turquie'
    },
    capital: {
      ar: 'أنقرة',
      en: 'Ankara',
      fr: 'Ankara'
    },
    description: {
      ar: 'تركيا، جسر بين قارتين وحضارتين، حيث تلتقي آسيا وأوروبا في إسطنبول الساحرة.',
      en: 'Turkey, bridge between two continents and civilizations, where Asia and Europe meet in charming Istanbul.',
      fr: 'La Turquie, pont entre deux continents et civilisations, où l\'Asie et l\'Europe se rencontrent dans la charmante Istanbul.'
    },
    mainImage: 'https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg',
    flag: '🇹🇷',
    currency: {
      ar: 'الليرة التركية (TRY)',
      en: 'Turkish Lira (TRY)',
      fr: 'Livre turque (TRY)'
    },
    language: {
      ar: 'التركية، الإنجليزية',
      en: 'Turkish, English',
      fr: 'Turc, Anglais'
    },
    timeZone: 'GMT+3',
    climate: {
      ar: 'متوسطي وقاري',
      en: 'Mediterranean and continental',
      fr: 'Méditerranéen et continental'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: true,
    rating: 4.7,
    totalReviews: 18450,
    totalTours: 80,
    totalHotels: 1200,
    highlights: {
      ar: ['آيا صوفيا العريقة', 'كابادوكيا السحرية', 'مضيق البوسفور', 'القصر الأزرق'],
      en: ['Historic Hagia Sophia', 'Magical Cappadocia', 'Bosphorus Strait', 'Blue Mosque'],
      fr: ['Historique Sainte-Sophie', 'Magique Cappadoce', 'Détroit du Bosphore', 'Mosquée Bleue']
    },
    culture: {
      ar: 'تركيا تجمع بين التراث العثماني والبيزنطي والثقافة الحديثة.',
      en: 'Turkey combines Ottoman and Byzantine heritage with modern culture.',
      fr: 'La Turquie combine l\'héritage ottoman et byzantin avec la culture moderne.'
    },
    cuisine: {
      ar: ['الكباب التركي', 'البقلاوة', 'الدولما والبوريك'],
      en: ['Turkish Kebab', 'Baklava', 'Dolma and Borek'],
      fr: ['Kebab turc', 'Baklava', 'Dolma et Borek']
    },
    transportation: {
      ar: ['الخطوط التركية', 'شبكة قطارات حديثة', 'العبارات البحرية'],
      en: ['Turkish Airlines', 'Modern train network', 'Maritime ferries'],
      fr: ['Turkish Airlines', 'Réseau ferroviaire moderne', 'Ferries maritimes']
    },
    safety: {
      ar: 'تركيا وجهة سياحية آمنة مع نظام أمني متطور.',
      en: 'Turkey is a safe tourist destination with advanced security system.',
      fr: 'La Turquie est une destination touristique sûre avec un système de sécurité avancé.'
    },
    cities: [
      {
        id: 'istanbul',
        name: {
          ar: 'إسطنبول',
          en: 'Istanbul',
          fr: 'Istanbul'
        },
        description: {
          ar: 'المدينة الجسر بين القارات، موطن آيا صوفيا والقصر الأزرق.',
          en: 'The bridge city between continents, home to Hagia Sophia and Blue Mosque.',
          fr: 'La ville pont entre les continents, foyer de Sainte-Sophie et de la Mosquée Bleue.'
        },
        image: 'https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg',
        attractions: {
          ar: ['آيا صوفيا', 'القصر الأزرق', 'البازار الكبير'],
          en: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar'],
          fr: ['Sainte-Sophie', 'Mosquée Bleue', 'Grand Bazar']
        },
        bestTime: {
          ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
          en: 'April - June, September - November',
          fr: 'Avril - Juin, Septembre - Novembre'
        },
        duration: {
          ar: '3-5 أيام',
          en: '3-5 days',
          fr: '3-5 jours'
        },
        rating: 4.8,
        reviews: 8900,
        highlights: {
          ar: ['التراث البيزنطي والعثماني', 'مضيق البوسفور'],
          en: ['Byzantine and Ottoman heritage', 'Bosphorus Strait'],
          fr: ['Patrimoine byzantin et ottoman', 'Détroit du Bosphore']
        },
        gallery: ['https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg']
  },

  iran: {
    id: 'iran',
    name: {
      ar: 'إيران',
      en: 'Iran',
      fr: 'Iran'
    },
    capital: {
      ar: 'طهران',
      en: 'Tehran',
      fr: 'Téhéran'
    },
    description: {
      ar: 'إيران، أرض الحضارة الفارسية العريقة، موطن أصفهان الجميلة وشيراز الشعر.',
      en: 'Iran, land of ancient Persian civilization, home to beautiful Isfahan and poetic Shiraz.',
      fr: 'L\'Iran, terre de l\'ancienne civilisation perse, foyer de la belle Ispahan et de la poétique Shiraz.'
    },
    mainImage: 'https://images.pexels.com/photos/10408708/pexels-photo-10408708.jpeg',
    flag: '🇮🇷',
    currency: {
      ar: 'الريال الإيراني (IRR)',
      en: 'Iranian Rial (IRR)',
      fr: 'Rial iranien (IRR)'
    },
    language: {
      ar: 'الفارسية، العربية',
      en: 'Persian, Arabic',
      fr: 'Persan, Arabe'
    },
    timeZone: 'GMT+3:30',
    climate: {
      ar: 'قاري جاف ومعتدل',
      en: 'Dry continental and temperate',
      fr: 'Continental sec et tempéré'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: true,
    rating: 4.5,
    totalReviews: 5680,
    totalTours: 35,
    totalHotels: 420,
    highlights: {
      ar: ['أصفهان نصف العالم', 'برسيبوليس الأثرية', 'مسجد الشيخ لطف الله', 'حدائق شيراز'],
      en: ['Isfahan half of the world', 'Ancient Persepolis', 'Sheikh Lotfollah Mosque', 'Shiraz gardens'],
      fr: ['Ispahan moitié du monde', 'Persépolis antique', 'Mosquée Sheikh Lotfollah', 'Jardins de Shiraz']
    },
    culture: {
      ar: 'إيران موطن الحضارة الفارسي�� والشعر والفن الإسلامي.',
      en: 'Iran is home to Persian civilization, poetry and Islamic art.',
      fr: 'L\'Iran abrite la civilisation perse, la poésie et l\'art islamique.'
    },
    cuisine: {
      ar: ['الرز الإيراني بالزعفران', 'الكباب الإيراني', 'الحلويات الفارسية'],
      en: ['Iranian saffron rice', 'Iranian kebab', 'Persian sweets'],
      fr: ['Riz iranien au safran', 'Kebab iranien', 'Pâtisseries persanes']
    },
    transportation: {
      ar: ['إيران للطيران', 'شبكة قطارات واسعة', 'حافلات بين المدن'],
      en: ['Iran Air', 'Extensive train network', 'Inter-city buses'],
      fr: ['Iran Air', 'Vaste réseau ferroviaire', 'Bus interurbains']
    },
    safety: {
      ar: 'إيران بلد آمن للسياحة مع ضرورة متابعة الإرشادات.',
      en: 'Iran is a safe country for tourism with the need to follow guidelines.',
      fr: 'L\'Iran est un pays sûr pour le tourisme avec la nécessité de suivre les directives.'
    },
    cities: [
      {
        id: 'isfahan',
        name: {
          ar: 'أصفهان',
          en: 'Isfahan',
          fr: 'Ispahan'
        },
        description: {
          ar: 'جوهرة إيران ونصف العالم، تشتهر بعمارتها الإسلامية الرائعة.',
          en: 'Jewel of Iran and half of the world, famous for its magnificent Islamic architecture.',
          fr: 'Joyau de l\'Iran et moitié du monde, célèbre pour sa magnifique architecture islamique.'
        },
        image: 'https://images.pexels.com/photos/10408708/pexels-photo-10408708.jpeg',
        attractions: {
          ar: ['مسجد الإمام', 'ميدان نقش جهان', 'قصر علي قابو'],
          en: ['Imam Mosque', 'Naqsh-e Jahan Square', 'Ali Qapu Palace'],
          fr: ['Mosquée de l\'Imam', 'Place Naqsh-e Jahan', 'Palais Ali Qapu']
        },
        bestTime: {
          ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
          en: 'April - June, September - November',
          fr: 'Avril - Juin, Septembre - Novembre'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.6,
        reviews: 2890,
        highlights: {
          ar: ['العمارة الصفوية', 'الحرف التقليدية'],
          en: ['Safavid architecture', 'Traditional crafts'],
          fr: ['Architecture safavide', 'Artisanat traditionnel']
        },
        gallery: ['https://images.pexels.com/photos/10408708/pexels-photo-10408708.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/10408708/pexels-photo-10408708.jpeg']
  },

  afghanistan: {
    id: 'afghanistan',
    name: {
      ar: 'أفغانستان',
      en: 'Afghanistan',
      fr: 'Afghanistan'
    },
    capital: {
      ar: 'كابول',
      en: 'Kabul',
      fr: 'Kaboul'
    },
    description: {
      ar: 'أفغانستان، أرض الجبال الشاهقة والتاريخ العريق، ملتقى طرق الحرير التاريخية.',
      en: 'Afghanistan, land of towering mountains and ancient history, crossroads of historic Silk Roads.',
      fr: 'L\'Afghanistan, terre de hautes montagnes et d\'histoire ancienne, carrefour des Routes de la Soie historiques.'
    },
    mainImage: 'https://images.pexels.com/photos/11705141/pexels-photo-11705141.jpeg',
    flag: '🇦🇫',
    currency: {
      ar: 'الأفغاني (AFN)',
      en: 'Afghan Afghani (AFN)',
      fr: 'Afghani afghan (AFN)'
    },
    language: {
      ar: 'الدري، الباشتو',
      en: 'Dari, Pashto',
      fr: 'Dari, Pachto'
    },
    timeZone: 'GMT+4:30',
    climate: {
      ar: 'قاري جاف وجبلي',
      en: 'Dry continental and mountainous',
      fr: 'Continental sec et montagneux'
    },
    bestTime: {
      ar: 'أبريل - يونيو، سبتمبر - نوفمبر',
      en: 'April - June, September - November',
      fr: 'Avril - Juin, Septembre - Novembre'
    },
    visaRequired: true,
    rating: 3.5,
    totalReviews: 450,
    totalTours: 3,
    totalHotels: 25,
    highlights: {
      ar: ['مدينة هرات التاريخية', 'باميان والآثار البوذية', 'جبال هندو كوش', 'الحرف التقليدية'],
      en: ['Historic city of Herat', 'Bamiyan and Buddhist ruins', 'Hindu Kush mountains', 'Traditional crafts'],
      fr: ['Ville historique d\'Herat', 'Bamiyan et ruines bouddhistes', 'Montagnes Hindu Kush', 'Artisanat traditionnel']
    },
    culture: {
      ar: 'أفغانستان ملتقى الحضارات الآسيوية والإسلامية مع تراث ثقافي متنوع.',
      en: 'Afghanistan is a meeting point of Asian and Islamic civilizations with diverse cultural heritage.',
      fr: 'L\'Afghanistan est un point de rencontre des civilisations asiatiques et islamiques avec un patrimoine culturel diversifié.'
    },
    cuisine: {
      ar: ['البلاو الأفغاني', 'الكباب الأفغاني', 'الشاي الأفغاني'],
      en: ['Afghan Pilau', 'Afghan Kebab', 'Afghan Tea'],
      fr: ['Pilau afghan', 'Kebab afghan', 'Thé afghan']
    },
    transportation: {
      ar: ['رحلات جوية محدودة', 'النقل البري', 'الطرق الجبلية'],
      en: ['Limited flights', 'Land transport', 'Mountain roads'],
      fr: ['Vols limités', 'Transport terrestre', 'Routes de montagne']
    },
    safety: {
      ar: 'يُنصح بشدة بمتابعة التطو��ات الأمنية والتنسيق مع السلطات.',
      en: 'It is strongly advised to monitor security developments and coordinate with authorities.',
      fr: 'Il est fortement conseillé de surveiller les développements sécuritaires et de coordonner avec les autorités.'
    },
    cities: [
      {
        id: 'kabul',
        name: {
          ar: 'كابول',
          en: 'Kabul',
          fr: 'Kaboul'
        },
        description: {
          ar: 'عاصمة أفغانستان التاريخية، محاطة بالجبال الشاهقة.',
          en: 'Historic capital of Afghanistan, surrounded by towering mountains.',
          fr: 'Capitale historique de l\'Afghanistan, entourée de hautes montagnes.'
        },
        image: 'https://images.pexels.com/photos/11705141/pexels-photo-11705141.jpeg',
        attractions: {
          ar: ['المتحف الوطني', 'حدائق بابر', 'قصر دار الأمان'],
          en: ['National Museum', 'Babur Gardens', 'Darul Aman Palace'],
          fr: ['Musée National', 'Jardins de Babur', 'Palais Darul Aman']
        },
        bestTime: {
          ar: 'أبريل - يونيو، سبتمبر - أكتوبر',
          en: 'April - June, September - October',
          fr: 'Avril - Juin, Septembre - Octobre'
        },
        duration: {
          ar: '1-2 يوم',
          en: '1-2 days',
          fr: '1-2 jours'
        },
        rating: 3.4,
        reviews: 180,
        highlights: {
          ar: ['التراث الآسيوي', 'الطبيعة الجبلية'],
          en: ['Asian heritage', 'Mountainous nature'],
          fr: ['Patrimoine asiatique', 'Nature montagneuse']
        },
        gallery: ['https://images.pexels.com/photos/11705141/pexels-photo-11705141.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/11705141/pexels-photo-11705141.jpeg']
  },

  pakistan: {
    id: 'pakistan',
    name: {
      ar: 'باكستان',
      en: 'Pakistan',
      fr: 'Pakistan'
    },
    capital: {
      ar: 'إسلام آباد',
      en: 'Islamabad',
      fr: 'Islamabad'
    },
    description: {
      ar: 'باكستان، أرض النهر الخالد وحضارة وادي السند، تمتد من جبال الهمالايا إلى بحر العرب.',
      en: 'Pakistan, land of the immortal river and Indus Valley civilization, stretching from Himalayas to Arabian Sea.',
      fr: 'Le Pakistan, terre du fleuve immortel et de la civilisation de la vallée de l\'Indus, s\'étendant de l\'Himalaya à la mer d\'Arabie.'
    },
    mainImage: 'https://images.pexels.com/photos/20832306/pexels-photo-20832306.jpeg',
    flag: '🇵🇰',
    currency: {
      ar: 'الروبية الباكستانية (PKR)',
      en: 'Pakistani Rupee (PKR)',
      fr: 'Roupie pakistanaise (PKR)'
    },
    language: {
      ar: 'الأردية، الإنجليزية',
      en: 'Urdu, English',
      fr: 'Ourdou, Anglais'
    },
    timeZone: 'GMT+5',
    climate: {
      ar: 'مداري وقاري متنوع',
      en: 'Diverse tropical and continental',
      fr: 'Tropical et continental diversifié'
    },
    bestTime: {
      ar: 'أكتوبر - أبريل',
      en: 'October - April',
      fr: 'Octobre - Avril'
    },
    visaRequired: true,
    rating: 4.3,
    totalReviews: 3890,
    totalTours: 25,
    totalHotels: 380,
    highlights: {
      ar: ['جبل K2 الشاهق', 'لاهور التاريخية', 'موهنجو دارو الأثرية', 'شواطئ كراتشي'],
      en: ['Towering K2 mountain', 'Historic Lahore', 'Ancient Mohenjo-daro', 'Karachi beaches'],
      fr: ['Mont K2 imposant', 'Lahore historique', 'Mohenjo-daro antique', 'Plages de Karachi']
    },
    culture: {
      ar: 'باك��تان تجمع بين التراث الإسلامي والحضارة الهندية القديمة.',
      en: 'Pakistan combines Islamic heritage with ancient Indian civilization.',
      fr: 'Le Pakistan combine l\'héritage islamique avec l\'ancienne civilisation indienne.'
    },
    cuisine: {
      ar: ['البرياني الباكستاني', 'الكراي الباكستاني', 'الروتي والنان'],
      en: ['Pakistani Biryani', 'Pakistani Curry', 'Roti and Naan'],
      fr: ['Biryani pakistanais', 'Curry pakistanais', 'Roti et Naan']
    },
    transportation: {
      ar: ['الخطوط الباكستانية', 'شبكة قطارات واسعة', 'حافلات النقل'],
      en: ['Pakistan International Airlines', 'Extensive train network', 'Transport buses'],
      fr: ['Pakistan International Airlines', 'Vaste réseau ferroviaire', 'Bus de transport']
    },
    safety: {
      ar: 'ينصح بمتابعة التطورات الأمنية والتنسيق مع الجهات المحلية.',
      en: 'It is advised to monitor security developments and coordinate with local authorities.',
      fr: 'Il est conseillé de surveiller les développements sécuritaires et de coordonner avec les autorités locales.'
    },
    cities: [
      {
        id: 'islamabad',
        name: {
          ar: 'إسلام آباد',
          en: 'Islamabad',
          fr: 'Islamabad'
        },
        description: {
          ar: 'عاصمة باكستان الحديثة، مدينة خضراء محاطة بجبال مارغالا.',
          en: 'Modern capital of Pakistan, a green city surrounded by Margalla hills.',
          fr: 'Capitale moderne du Pakistan, ville verte entourée des collines Margalla.'
        },
        image: 'https://images.pexels.com/photos/20832306/pexels-photo-20832306.jpeg',
        attractions: {
          ar: ['مسجد فيصل', 'جبال مارغالا', 'النصب التذكاري'],
          en: ['Faisal Mosque', 'Margalla Hills', 'Pakistan Monument'],
          fr: ['Mosquée Faisal', 'Collines Margalla', 'Monument du Pakistan']
        },
        bestTime: {
          ar: 'أكتوبر - ��بريل',
          en: 'October - April',
          fr: 'Octobre - Avril'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.2,
        reviews: 1890,
        highlights: {
          ar: ['العمارة الإسلامية الحديثة', 'الطبيعة الخضراء'],
          en: ['Modern Islamic architecture', 'Green nature'],
          fr: ['Architecture islamique moderne', 'Nature verte']
        },
        gallery: ['https://images.pexels.com/photos/20832306/pexels-photo-20832306.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/20832306/pexels-photo-20832306.jpeg']
  },

  bangladesh: {
    id: 'bangladesh',
    name: {
      ar: 'بنغلاديش',
      en: 'Bangladesh',
      fr: 'Bangladesh'
    },
    capital: {
      ar: 'دكا',
      en: 'Dhaka',
      fr: 'Dhaka'
    },
    description: {
      ar: 'بنغلاديش، أرض الأنهار والمساحات الخضراء، بلد جميل في دلتا نهري الغانج وبراهمابوترا.',
      en: 'Bangladesh, land of rivers and green spaces, a beautiful country in the Ganges-Brahmaputra delta.',
      fr: 'Le Bangladesh, terre de rivières et d\'espaces verts, un beau pays dans le delta du Gange-Brahmapoutre.'
    },
    mainImage: 'https://images.pexels.com/photos/20832306/pexels-photo-20832306.jpeg',
    flag: '🇧🇩',
    currency: {
      ar: 'التاكا البنغلاديشية (BDT)',
      en: 'Bangladeshi Taka (BDT)',
      fr: 'Taka bangladais (BDT)'
    },
    language: {
      ar: 'البنغالية، الإنجليزية',
      en: 'Bengali, English',
      fr: 'Bengali, Anglais'
    },
    timeZone: 'GMT+6',
    climate: {
      ar: 'مداري رطب',
      en: 'Humid tropical',
      fr: 'Tropical humide'
    },
    bestTime: {
      ar: 'نوفمبر - فبراير',
      en: 'November - February',
      fr: 'Novembre - Février'
    },
    visaRequired: true,
    rating: 4.1,
    totalReviews: 2340,
    totalTours: 15,
    totalHotels: 220,
    highlights: {
      ar: ['أطول شاطئ في العالم في كوكس بازار', 'سوندربانز غابات المنغروف', 'مدينة دكا التاريخية', 'القوارب النهرية'],
      en: ['World\'s longest beach at Cox\'s Bazar', 'Sundarbans mangrove forests', 'Historic Dhaka city', 'River boats'],
      fr: ['Plus longue plage du monde à Cox\'s Bazar', 'Forêts de mangroves Sundarbans', 'Ville historique de Dhaka', 'Bateaux fluviaux']
    },
    culture: {
      ar: 'بنغلاديش موطن الثقافة البنغالية الغنية والتراث الإسلامي.',
      en: 'Bangladesh is home to rich Bengali culture and Islamic heritage.',
      fr: 'Le Bangladesh abrite une riche culture bengalie et un patrimoine islamique.'
    },
    cuisine: {
      ar: ['الأرز البنغالي بالسمك', 'البرياني البنغلاديشي', 'الحلويات البنغالية'],
      en: ['Bengali fish and rice', 'Bangladeshi biryani', 'Bengali sweets'],
      fr: ['Poisson et riz bengali', 'Biryani bangladais', 'Douceurs bengalies']
    },
    transportation: {
      ar: ['بيمان بنغلاديش', '��لقطارات والحافلات', 'النقل النهري'],
      en: ['Biman Bangladesh', 'Trains and buses', 'River transport'],
      fr: ['Biman Bangladesh', 'Trains et bus', 'Transport fluvial']
    },
    safety: {
      ar: 'بنغلاديش بلد آمن للسياحة مع ضرورة اتخاذ الاحتياطات المعتادة.',
      en: 'Bangladesh is a safe country for tourism with standard precautions needed.',
      fr: 'Le Bangladesh est un pays sûr pour le tourisme avec des précautions standard nécessaires.'
    },
    cities: [
      {
        id: 'dhaka',
        name: {
          ar: 'دكا',
          en: 'Dhaka',
          fr: 'Dhaka'
        },
        description: {
          ar: 'عاصمة بنغلاديش النابضة بالحياة، مدينة المساجد والتاريخ.',
          en: 'Vibrant capital of Bangladesh, city of mosques and history.',
          fr: 'Capitale dynamique du Bangladesh, ville de mosquées et d\'histoire.'
        },
        image: 'https://images.pexels.com/photos/20832306/pexels-photo-20832306.jpeg',
        attractions: {
          ar: ['مسجد الستون عمود', 'قصر أهسان منزل', 'نهر بوريغانغا'],
          en: ['Sixty Dome Mosque', 'Ahsan Manzil Palace', 'Buriganga River'],
          fr: ['Mosquée aux Soixante Dômes', 'Palais Ahsan Manzil', 'Rivière Buriganga']
        },
        bestTime: {
          ar: 'نوفمبر - فبراير',
          en: 'November - February',
          fr: 'Novembre - Février'
        },
        duration: {
          ar: '2-3 أيام',
          en: '2-3 days',
          fr: '2-3 jours'
        },
        rating: 4.0,
        reviews: 1340,
        highlights: {
          ar: ['التراث البنغالي', 'الحياة النهرية'],
          en: ['Bengali heritage', 'River life'],
          fr: ['Patrimoine bengali', 'Vie fluviale']
        },
        gallery: ['https://images.pexels.com/photos/20832306/pexels-photo-20832306.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/20832306/pexels-photo-20832306.jpeg']
  },

  maldives: {
    id: 'maldives',
    name: {
      ar: 'جزر المالديف',
      en: 'Maldives',
      fr: 'Maldives'
    },
    capital: {
      ar: 'ماليه',
      en: 'Male',
      fr: 'Malé'
    },
    description: {
      ar: 'جزر المالديف، لؤلؤة المحيط الهندي، أرخبيل من الجزر المرجانية الساحرة والشواطئ البيضاء.',
      en: 'Maldives, pearl of the Indian Ocean, an archipelago of charming coral islands and white beaches.',
      fr: 'Les Maldives, perle de l\'Océan Indien, un archipel d\'îles coralliennes charmantes et de plages blanches.'
    },
    mainImage: 'https://images.pexels.com/photos/1139040/pexels-photo-1139040.jpeg',
    flag: '🇲🇻',
    currency: {
      ar: 'الروفية المالديفية (MVR)',
      en: 'Maldivian Rufiyaa (MVR)',
      fr: 'Rufiyaa maldivienne (MVR)'
    },
    language: {
      ar: 'الديفهي، الإنجليزية',
      en: 'Dhivehi, English',
      fr: 'Dhivehi, Anglais'
    },
    timeZone: 'GMT+5',
    climate: {
      ar: 'مداري دافئ',
      en: 'Warm tropical',
      fr: 'Tropical chaud'
    },
    bestTime: {
      ar: 'نوفمبر - أبريل',
      en: 'November - April',
      fr: 'Novembre - Avril'
    },
    visaRequired: false,
    rating: 4.9,
    totalReviews: 8950,
    totalTours: 30,
    totalHotels: 150,
    highlights: {
      ar: ['المنتجعات المائية الفاخرة', 'الشعاب المرجانية الملونة', 'الغوص والسنوركل', 'الشواطئ البيضاء الناعمة'],
      en: ['Luxury water resorts', 'Colorful coral reefs', 'Diving and snorkeling', 'Soft white beaches'],
      fr: ['Resorts aquatiques de luxe', 'Récifs coralliens colorés', 'Plongée et snorkeling', 'Plages blanches douces']
    },
    culture: {
      ar: 'المالديف تتميز بثقافة بحرية فريدة متأثرة بالتراث الإسلامي والعربي.',
      en: 'Maldives features unique maritime culture influenced by Islamic and Arab heritage.',
      fr: 'Les Maldives présentent une culture maritime unique influencée par l\'héritage islamique et arabe.'
    },
    cuisine: {
      ar: ['السمك بالكاري المالديفي', 'الرز بجوز الهند', 'الفواكه الاستوائية'],
      en: ['Maldivian fish curry', 'Coconut rice', 'Tropical fruits'],
      fr: ['Curry de poisson maldivien', 'Riz à la noix de coco', 'Fruits tropicaux']
    },
    transportation: {
      ar: ['الطائرات المائية', 'القوارب السريعة', 'رحلات بين الجزر'],
      en: ['Seaplanes', 'Speed boats', 'Inter-island flights'],
      fr: ['Hydravions', 'Bateaux rapides', 'Vols inter-îles']
    },
    safety: {
      ar: 'المالديف وجهة آمنة جداً مع أعلى مستويات الأمان السياحي.',
      en: 'Maldives is a very safe destination with highest levels of tourist security.',
      fr: 'Les Maldives sont une destination très sûre avec les plus hauts niveaux de sécurité touristique.'
    },
    cities: [
      {
        id: 'male',
        name: {
          ar: 'ماليه',
          en: 'Male',
          fr: 'Malé'
        },
        description: {
          ar: 'عا��مة المالديف ومركزها التجاري، جزيرة صغيرة نابضة بالحياة.',
          en: 'Capital of Maldives and its commercial center, a small vibrant island.',
          fr: 'Capitale des Maldives et son centre commercial, une petite île dynamique.'
        },
        image: 'https://images.pexels.com/photos/1139040/pexels-photo-1139040.jpeg',
        attractions: {
          ar: ['المسجد الكبير', 'السوق المحلي', 'متحف المالديف الوطني'],
          en: ['Grand Mosque', 'Local Market', 'Maldives National Museum'],
          fr: ['Grande Mosquée', 'Marché Local', 'Musée National des Maldives']
        },
        bestTime: {
          ar: 'نوفمبر - أبريل',
          en: 'November - April',
          fr: 'Novembre - Avril'
        },
        duration: {
          ar: '1 يوم',
          en: '1 day',
          fr: '1 jour'
        },
        rating: 4.4,
        reviews: 1890,
        highlights: {
          ar: ['الحياة المالديفية المحلية', 'العمارة الاستوائية'],
          en: ['Local Maldivian life', 'Tropical architecture'],
          fr: ['Vie locale maldivienne', 'Architecture tropicale']
        },
        gallery: ['https://images.pexels.com/photos/1139040/pexels-photo-1139040.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1139040/pexels-photo-1139040.jpeg']
  },

  indonesia: {
    id: 'indonesia',
    name: {
      ar: 'إندونيسيا',
      en: 'Indonesia',
      fr: 'Indonésie'
    },
    capital: {
      ar: 'جاكرتا',
      en: 'Jakarta',
      fr: 'Jakarta'
    },
    description: {
      ar: 'إندونيسيا، أكبر أرخبيل في العالم ومهد الحضارات الآسيوية، تضم آلاف الجزر الساحرة.',
      en: 'Indonesia, world\'s largest archipelago and cradle of Asian civilizations, comprising thousands of charming islands.',
      fr: 'L\'Indonésie, plus grand archipel du monde et berceau des civilisations asiatiques, comprenant des milliers d\'îles charmantes.'
    },
    mainImage: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg',
    flag: '🇮🇩',
    currency: {
      ar: 'الروبية الإندونيسية (IDR)',
      en: 'Indonesian Rupiah (IDR)',
      fr: 'Roupie indonésienne (IDR)'
    },
    language: {
      ar: 'الإندونيسية، الإنجليزي��',
      en: 'Indonesian, English',
      fr: 'Indonésien, Anglais'
    },
    timeZone: 'GMT+7 to GMT+9',
    climate: {
      ar: 'مداري استوائي',
      en: 'Tropical equatorial',
      fr: 'Tropical équatorial'
    },
    bestTime: {
      ar: 'أبريل - أكتوبر',
      en: 'April - October',
      fr: 'Avril - Octobre'
    },
    visaRequired: true,
    rating: 4.6,
    totalReviews: 12450,
    totalTours: 60,
    totalHotels: 890,
    highlights: {
      ar: ['معبد بوروبودور البوذي', 'جزيرة بالي الساحرة', 'براكين جاوا النشطة', 'جزر راجا أمبات'],
      en: ['Buddhist Borobudur Temple', 'Charming Bali Island', 'Active Java volcanoes', 'Raja Ampat Islands'],
      fr: ['Temple bouddhiste Borobudur', 'Île charmante de Bali', 'Volcans actifs de Java', 'Îles Raja Ampat']
    },
    culture: {
      ar: 'إندونيسيا تضم تنوعاً ثقافياً هائلاً مع تأثيرات إسلامية وهندوسية وبوذية.',
      en: 'Indonesia has immense cultural diversity with Islamic, Hindu and Buddhist influences.',
      fr: 'L\'Indonésie a une diversité culturelle immense avec des influences islamiques, hindoues et bouddhistes.'
    },
    cuisine: {
      ar: ['الناسي جورينج', 'الساتيه الإندونيسي', 'الرندانج'],
      en: ['Nasi Goreng', 'Indonesian Satay', 'Rendang'],
      fr: ['Nasi Goreng', 'Satay indonésien', 'Rendang']
    },
    transportation: {
      ar: ['جارودا إندونيسيا', 'العبارات بين الجزر', 'القطارات في جاوا'],
      en: ['Garuda Indonesia', 'Inter-island ferries', 'Java trains'],
      fr: ['Garuda Indonesia', 'Ferries inter-îles', 'Trains de Java']
    },
    safety: {
      ar: 'إندونيسيا وجهة آمنة للسياحة مع ضرورة الحذر من الكوارث الطبيعية.',
      en: 'Indonesia is a safe tourist destination with need for caution regarding natural disasters.',
      fr: 'L\'Indonésie est une destination touristique sûre avec la nécessité de prudence concernant les catastrophes naturelles.'
    },
    cities: [
      {
        id: 'bali',
        name: {
          ar: 'بالي',
          en: 'Bali',
          fr: 'Bali'
        },
        description: {
          ar: 'جزيرة الآلهة الساحرة، موطن المعابد الهندوسية والشواطئ الرملية.',
          en: 'Charming Island of the Gods, home to Hindu temples and sandy beaches.',
          fr: 'Charmante Île des Dieux, foyer de temples hindous et de plages de sable.'
        },
        image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg',
        attractions: {
          ar: ['معبد تاناه لوت', 'حقول الأرز المدرجة', 'جبل باتور'],
          en: ['Tanah Lot Temple', 'Terraced rice fields', 'Mount Batur'],
          fr: ['Temple Tanah Lot', 'Rizières en terrasses', 'Mont Batur']
        },
        bestTime: {
          ar: 'أبريل - أكتوبر',
          en: 'April - October',
          fr: 'Avril - Octobre'
        },
        duration: {
          ar: '4-7 أيام',
          en: '4-7 days',
          fr: '4-7 jours'
        },
        rating: 4.7,
        reviews: 6890,
        highlights: {
          ar: ['الثقافة الهندوسية', 'الطبيعة الاستوائية'],
          en: ['Hindu culture', 'Tropical nature'],
          fr: ['Culture hindoue', 'Nature tropicale']
        },
        gallery: ['https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg']
  },

  malaysia: {
    id: 'malaysia',
    name: {
      ar: 'ماليزيا',
      en: 'Malaysia',
      fr: 'Malaisie'
    },
    capital: {
      ar: 'كوالالمبور',
      en: 'Kuala Lumpur',
      fr: 'Kuala Lumpur'
    },
    description: {
      ar: 'ماليزيا، آسيا الحقيقية وملتقى الحضارات، تجمع بين المدن الحديثة والغابات الاستوائية.',
      en: 'Malaysia, Truly Asia and meeting point of civilizations, combining modern cities with tropical forests.',
      fr: 'La Malaisie, Vraiment l\'Asie et point de rencontre des civilisations, combinant villes modernes et forêts tropicales.'
    },
    mainImage: 'https://images.pexels.com/photos/2845013/pexels-photo-2845013.jpeg',
    flag: '🇲🇾',
    currency: {
      ar: 'الرينغت الماليزي (MYR)',
      en: 'Malaysian Ringgit (MYR)',
      fr: 'Ringgit malaisien (MYR)'
    },
    language: {
      ar: 'الماليزية، الإنجليزية، ال��ربية',
      en: 'Malay, English, Arabic',
      fr: 'Malais, Anglais, Arabe'
    },
    timeZone: 'GMT+8',
    climate: {
      ar: 'مداري استوائي رطب',
      en: 'Humid tropical',
      fr: 'Tropical humide'
    },
    bestTime: {
      ar: 'ديسمبر - فبراير، يونيو - أغسطس',
      en: 'December - February, June - August',
      fr: 'Décembre - Février, Juin - Août'
    },
    visaRequired: false,
    rating: 4.5,
    totalReviews: 9850,
    totalTours: 45,
    totalHotels: 680,
    highlights: {
      ar: ['أبراج بتروناس التوأم', 'جزيرة لنكاوي', 'مرتفعات كاميرون', 'مدينة ملقا التاريخية'],
      en: ['Petronas Twin Towers', 'Langkawi Island', 'Cameron Highlands', 'Historic Malacca'],
      fr: ['Tours jumelles Petronas', 'Île de Langkawi', 'Hautes terres Cameron', 'Malacca historique']
    },
    culture: {
      ar: 'ماليزيا نموذج للتنوع الثقافي مع مجتمعات مالاوية وصينية وهندية وعربية.',
      en: 'Malaysia is a model of cultural diversity with Malay, Chinese, Indian and Arab communities.',
      fr: 'La Malaisie est un modèle de diversité culturelle avec des communautés malaises, chinoises, indiennes et arabes.'
    },
    cuisine: {
      ar: ['الناسي لماك', 'لاكسا الماليزية', 'رندانج الماليزي'],
      en: ['Nasi Lemak', 'Malaysian Laksa', 'Malaysian Rendang'],
      fr: ['Nasi Lemak', 'Laksa malaisien', 'Rendang malaisien']
    },
    transportation: {
      ar: ['الخطوط الماليزية', 'قطار الغابة', 'شبكة مواصلات متطورة'],
      en: ['Malaysia Airlines', 'Jungle Railway', 'Advanced transport network'],
      fr: ['Malaysia Airlines', 'Train de la Jungle', 'Réseau de transport avancé']
    },
    safety: {
      ar: 'ماليزيا من أأمن دول آسيا للسياحة والسفر.',
      en: 'Malaysia is one of the safest Asian countries for tourism and travel.',
      fr: 'La Malaisie est l\'un des pays asiatiques les plus sûrs pour le tourisme et les voyages.'
    },
    cities: [
      {
        id: 'kuala_lumpur',
        name: {
          ar: 'كوالالمبور',
          en: 'Kuala Lumpur',
          fr: 'Kuala Lumpur'
        },
        description: {
          ar: 'عاصمة ماليزيا الحديثة، موطن أبراج بتروناس الشهيرة.',
          en: 'Modern capital of Malaysia, home to famous Petronas Towers.',
          fr: 'Capitale moderne de la Malaisie, foyer des célèbres Tours Petronas.'
        },
        image: 'https://images.pexels.com/photos/2845013/pexels-photo-2845013.jpeg',
        attractions: {
          ar: ['أبراج بتروناس', 'برج كوالالمبور', 'شارع العرب'],
          en: ['Petronas Towers', 'KL Tower', 'Arab Street'],
          fr: ['Tours Petronas', 'Tour KL', 'Rue Arabe']
        },
        bestTime: {
          ar: 'مايو - يوليو، ديسمبر - فبراير',
          en: 'May - July, December - February',
          fr: 'Mai - Juillet, Décembre - Février'
        },
        duration: {
          ar: '2-4 أيام',
          en: '2-4 days',
          fr: '2-4 jours'
        },
        rating: 4.4,
        reviews: 4890,
        highlights: {
          ar: ['التنوع الثقافي', 'العمارة الحديثة'],
          en: ['Cultural diversity', 'Modern architecture'],
          fr: ['Diversité culturelle', 'Architecture moderne']
        },
        gallery: ['https://images.pexels.com/photos/2845013/pexels-photo-2845013.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/2845013/pexels-photo-2845013.jpeg']
  },

  brunei: {
    id: 'brunei',
    name: {
      ar: 'بروناي',
      en: 'Brunei',
      fr: 'Brunei'
    },
    capital: {
      ar: 'بندر سري بكاوان',
      en: 'Bandar Seri Begawan',
      fr: 'Bandar Seri Begawan'
    },
    description: {
      ar: 'بروناي، سلطنة الثراء والهدوء، دولة صغيرة غنية بالنفط على ساحل بورنيو.',
      en: 'Brunei, sultanate of wealth and tranquility, a small oil-rich country on Borneo\'s coast.',
      fr: 'Brunei, sultanat de richesse et de tranquillité, un petit pays riche en pétrole sur la côte de Bornéo.'
    },
    mainImage: 'https://images.pexels.com/photos/3601426/pexels-photo-3601426.jpeg',
    flag: '🇧🇳',
    currency: {
      ar: 'الدولار البروناي (BND)',
      en: 'Brunei Dollar (BND)',
      fr: 'Dollar de Brunei (BND)'
    },
    language: {
      ar: 'الماليزية، الإنجليزية، العربية',
      en: 'Malay, English, Arabic',
      fr: 'Malais, Anglais, Arabe'
    },
    timeZone: 'GMT+8',
    climate: {
      ar: 'مداري استوائي رطب',
      en: 'Humid tropical',
      fr: 'Tropical humide'
    },
    bestTime: {
      ar: 'فبراير - أبريل، يونيو - أغسطس',
      en: 'February - April, June - August',
      fr: 'Février - Avril, Juin - Août'
    },
    visaRequired: true,
    rating: 4.3,
    totalReviews: 1450,
    totalTours: 12,
    totalHotels: 85,
    highlights: {
      ar: ['مسجد السلطان عمر علي سيف الدين', 'القصر الملكي', 'قرية كمبونغ آير المائية', 'الغابات الاستوائية'],
      en: ['Sultan Omar Ali Saifuddien Mosque', 'Royal Palace', 'Kampong Ayer water village', 'Tropical rainforests'],
      fr: ['Mosquée Sultan Omar Ali Saifuddien', 'Palais Royal', 'Village aquatique Kampong Ayer', 'Forêts tropicales']
    },
    culture: {
      ar: 'بروناي تحافظ على التقاليد الإسلامية الماليزية مع الثراء الحديث.',
      en: 'Brunei preserves Islamic Malay traditions with modern wealth.',
      fr: 'Brunei préserve les traditions islamiques malaises avec la richesse moderne.'
    },
    cuisine: {
      ar: ['أمبويات بروناي', 'السمك المشوي الحار', 'الحلويات الماليزية'],
      en: ['Brunei Ambuyat', 'Spicy grilled fish', 'Malay desserts'],
      fr: ['Ambuyat de Brunei', 'Poisson grillé épicé', 'Desserts malais']
    },
    transportation: {
      ar: ['رويال بروناي', 'الحافلات المحلية', 'القوارب المائية'],
      en: ['Royal Brunei', 'Local buses', 'Water boats'],
      fr: ['Royal Brunei', 'Bus locaux', 'Bateaux aquatiques']
    },
    safety: {
      ar: 'بروناي من أأمن دول العالم مع معدلات جريمة منخفضة جداً.',
      en: 'Brunei is one of the world\'s safest countries with very low crime rates.',
      fr: 'Brunei est l\'un des pays les plus sûrs au monde avec des taux de criminalité très bas.'
    },
    cities: [
      {
        id: 'bandar_seri_begawan',
        name: {
          ar: 'بندر سري بكاوان',
          en: 'Bandar Seri Begawan',
          fr: 'Bandar Seri Begawan'
        },
        description: {
          ar: 'عاصمة بروناي الهادئة، تشتهر بمسجدها الذهبي الجميل.',
          en: 'Peaceful capital of Brunei, famous for its beautiful golden mosque.',
          fr: 'Capitale paisible de Brunei, célèbre pour sa belle mosquée dorée.'
        },
        image: 'https://images.pexels.com/photos/3601426/pexels-photo-3601426.jpeg',
        attractions: {
          ar: ['مسجد السلطان عمر', 'متحف بروناي', 'قرية الماء'],
          en: ['Sultan Omar Mosque', 'Brunei Museum', 'Water Village'],
          fr: ['Mosquée Sultan Omar', 'Musée de Brunei', 'Village Aquatique']
        },
        bestTime: {
          ar: 'فبراير - أبريل، يونيو - أغسطس',
          en: 'February - April, June - August',
          fr: 'Février - Avril, Juin - Août'
        },
        duration: {
          ar: '1-2 يوم',
          en: '1-2 days',
          fr: '1-2 jours'
        },
        rating: 4.2,
        reviews: 780,
        highlights: {
          ar: ['الهندسة المعمارية الإسلامية', 'الهدوء والنظافة'],
          en: ['Islamic architecture', 'Peace and cleanliness'],
          fr: ['Architecture islamique', 'Paix et propreté']
        },
        gallery: ['https://images.pexels.com/photos/3601426/pexels-photo-3601426.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/3601426/pexels-photo-3601426.jpeg']
  },

  // European Countries
  france: {
    id: 'france',
    name: { ar: 'فرنسا', en: 'France', fr: 'France' },
    capital: { ar: 'باريس', en: 'Paris', fr: 'Paris' },
    description: {
      ar: 'فرنسا، أرض الفن والثقافة والجمال، حيث تتجلى الأناقة الفرنسية في كل زاوية من زواياها الساحرة.',
      en: 'France, land of art, culture and beauty, where French elegance is manifested in every corner of its charming places.',
      fr: 'La France, terre d\'art, de culture et de beauté, où l\'élégance française se manifeste à chaque coin de ses lieux charmants.'
    },
    mainImage: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
    flag: '🇫🇷',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الفرنسية', en: 'French', fr: 'Français' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
    visaRequired: false,
    rating: 4.8,
    totalReviews: 12500,
    totalTours: 85,
    totalHotels: 1200,
    highlights: {
      ar: ['برج إيفل', 'قصر فرساي', 'متحف اللوفر', 'ريفيرا الفرنسية'],
      en: ['Eiffel Tower', 'Palace of Versailles', 'Louvre Museum', 'French Riviera'],
      fr: ['Tour Eiffel', 'Château de Versailles', 'Musée du Louvre', 'Riviera française']
    },
    culture: {
      ar: 'فرنسا هي مهد الفن والثقافة العالمية، موطن أعظم المتاحف والمعارض الفنية في العالم.',
      en: 'France is the cradle of world art and culture, home to the greatest museums and art galleries in the world.',
      fr: 'La France est le berceau de l\'art et de la culture mondiale, foyer des plus grands musées et galeries d\'art du monde.'
    },
    cuisine: {
      ar: ['الكرواسان', 'الباجيت', 'الجبن الفرنسي', 'النبيذ الفرنسي'],
      en: ['Croissant', 'Baguette', 'French cheese', 'French wine'],
      fr: ['Croissant', 'Baguette', 'Fromage français', 'Vin français']
    },
    transportation: {
      ar: ['قطار TGV السريع', 'مترو باريس', 'تأجير السيارات'],
      en: ['High-speed TGV train', 'Paris Metro', 'Car rental'],
      fr: ['Train TGV à grande vitesse', 'Métro de Paris', 'Location de voitures']
    },
    safety: {
      ar: 'فرنسا دولة آمنة للسياحة مع وجود أمن جيد في المدن الكبرى.',
      en: 'France is a safe country for tourism with good security in major cities.',
      fr: 'La France est un pays sûr pour le tourisme avec une bonne sécurité dans les grandes villes.'
    },
    cities: [
      {
        id: 'paris',
        name: { ar: 'باريس', en: 'Paris', fr: 'Paris' },
        description: {
          ar: 'عاصمة الأناقة والجمال، مدينة النور التي تجمع بين التاريخ العريق والحداثة.',
          en: 'Capital of elegance and beauty, the City of Light that combines ancient history and modernity.',
          fr: 'Capitale de l\'élégance et de la beauté, la Ville Lumière qui combine l\'histoire ancienne et la modernité.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['برج إيفل', 'متحف اللوفر', 'قوس النصر', 'كاتدرائية نوتردام'],
          en: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomphe', 'Notre-Dame Cathedral'],
          fr: ['Tour Eiffel', 'Musée du Louvre', 'Arc de Triomphe', 'Cathédrale Notre-Dame']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '4-5 أيام', en: '4-5 days', fr: '4-5 jours' },
        rating: 4.9,
        reviews: 8500,
        highlights: { ar: ['الفن والثقافة', 'المتاحف العالمية'], en: ['Art and culture', 'World museums'], fr: ['Art et culture', 'Musées du monde'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'lyon',
        name: { ar: 'ليون', en: 'Lyon', fr: 'Lyon' },
        description: {
          ar: 'ثاني أكبر مدينة في فرنسا، عاصمة الطهي الفرنسي والتراث التاريخي.',
          en: 'Second largest city in France, capital of French cuisine and historical heritage.',
          fr: 'Deuxième plus grande ville de France, capitale de la cuisine française et du patrimoine historique.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['البلدة القديمة', 'كاتدرائية ليون', 'متحف الفنون الجميلة', 'مطاعم ليون الشهيرة'],
          en: ['Old Town', 'Lyon Cathedral', 'Fine Arts Museum', 'Famous Lyon restaurants'],
          fr: ['Vieille ville', 'Cathédrale de Lyon', 'Musée des Beaux-Arts', 'Restaurants célèbres de Lyon']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.7,
        reviews: 5200,
        highlights: { ar: ['الطعام الفرنسي', 'التاريخ'], en: ['French food', 'History'], fr: ['Cuisine française', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'marseille',
        name: { ar: 'مارسيليا', en: 'Marseille', fr: 'Marseille' },
        description: {
          ar: 'أقدم مدينة في فرنسا، ميناء متوسطي جميل على ساحل البحر الأبيض المتوسط.',
          en: 'Oldest city in France, beautiful Mediterranean port on the Mediterranean coast.',
          fr: 'Plus ancienne ville de France, beau port méditerranéen sur la côte méditerranéenne.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['الميناء القديم', 'كاتدرائية نوتردام دو لا جارد', 'قلعة إيف', 'جزر فريول'],
          en: ['Old Port', 'Notre-Dame de la Garde Cathedral', 'Château d\'If', 'Frioul Islands'],
          fr: ['Vieux-Port', 'Cathédrale Notre-Dame de la Garde', 'Château d\'If', 'Îles du Frioul']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.6,
        reviews: 4800,
        highlights: { ar: ['البحر المتوسط', 'الميناء'], en: ['Mediterranean', 'Port'], fr: ['Méditerranée', 'Port'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'nice',
        name: { ar: 'نيس', en: 'Nice', fr: 'Nice' },
        description: {
          ar: 'جوهرة الريفيرا الفرنسية، مدينة ساحلية جميلة على البحر الأبيض المتوسط.',
          en: 'Jewel of the French Riviera, beautiful coastal city on the Mediterranean Sea.',
          fr: 'Joyau de la Riviera française, belle ville côtière sur la mer Méditerranée.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['شاطئ نيس', 'البلدة القديمة', 'متحف ماتيس', 'جبل القلعة'],
          en: ['Nice Beach', 'Old Town', 'Matisse Museum', 'Castle Hill'],
          fr: ['Plage de Nice', 'Vieille ville', 'Musée Matisse', 'Colline du Château']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.8,
        reviews: 7200,
        highlights: { ar: ['الريفيرا', 'الشواطئ'], en: ['Riviera', 'Beaches'], fr: ['Riviera', 'Plages'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'toulouse',
        name: { ar: 'تولوز', en: 'Toulouse', fr: 'Toulouse' },
        description: {
          ar: 'المدينة الوردية، مركز صناعة الطيران الفرنسي والثقافة الغنية.',
          en: 'The Pink City, center of French aviation industry and rich culture.',
          fr: 'La Ville Rose, centre de l\'industrie aéronautique française et de la culture riche.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['كاتدرائية سانت سيرنين', 'متحف الطيران', 'قناة دو ميدي', 'البلدة القديمة'],
          en: ['Saint-Sernin Cathedral', 'Aviation Museum', 'Canal du Midi', 'Old Town'],
          fr: ['Cathédrale Saint-Sernin', 'Musée de l\'aviation', 'Canal du Midi', 'Vieille ville']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 3800,
        highlights: { ar: ['الطيران', 'العمارة'], en: ['Aviation', 'Architecture'], fr: ['Aviation', 'Architecture'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'bordeaux',
        name: { ar: 'بوردو', en: 'Bordeaux', fr: 'Bordeaux' },
        description: {
          ar: 'عاصمة النبيذ الفرنسي، مدينة أنيقة على نهر جارون.',
          en: 'Capital of French wine, elegant city on the Garonne River.',
          fr: 'Capitale du vin français, ville élégante sur la Garonne.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['متحف النبيذ', 'كاتدرائية بوردو', 'ميدان الكوميديا', 'مناطق النبيذ'],
          en: ['Wine Museum', 'Bordeaux Cathedral', 'Place de la Comédie', 'Wine regions'],
          fr: ['Musée du vin', 'Cathédrale de Bordeaux', 'Place de la Comédie', 'Régions viticoles']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.7,
        reviews: 5600,
        highlights: { ar: ['النبيذ', 'الأناقة'], en: ['Wine', 'Elegance'], fr: ['Vin', 'Élégance'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'strasbourg',
        name: { ar: 'ستراسبورغ', en: 'Strasbourg', fr: 'Strasbourg' },
        description: {
          ar: 'عاصمة أوروبا، مدينة جميلة على الحدود الألمانية الفرنسية.',
          en: 'Capital of Europe, beautiful city on the French-German border.',
          fr: 'Capitale de l\'Europe, belle ville à la frontière franco-allemande.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['كاتدرائية ستراسبورغ', 'الحي الألماني', 'قصر أوروبا', 'القنوات'],
          en: ['Strasbourg Cathedral', 'German Quarter', 'Palace of Europe', 'Canals'],
          fr: ['Cathédrale de Strasbourg', 'Quartier allemand', 'Palais de l\'Europe', 'Canaux']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.6,
        reviews: 4400,
        highlights: { ar: ['أوروبا', 'العمارة'], en: ['Europe', 'Architecture'], fr: ['Europe', 'Architecture'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'nantes',
        name: { ar: 'نانت', en: 'Nantes', fr: 'Nantes' },
        description: {
          ar: 'مدينة على نهر اللوار، موطن للثقافة والفنون.',
          en: 'City on the Loire River, home to culture and arts.',
          fr: 'Ville sur la Loire, foyer de culture et d\'arts.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['قلعة دوقات بريتاني', 'متحف الفنون', 'جزيرة الآلات', 'الكاتدرائية'],
          en: ['Dukes of Brittany Castle', 'Art Museum', 'Machines Island', 'Cathedral'],
          fr: ['Château des ducs de Bretagne', 'Musée d\'art', 'Île aux Machines', 'Cathédrale']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 3200,
        highlights: { ar: ['الثقافة', 'الفنون'], en: ['Culture', 'Arts'], fr: ['Culture', 'Arts'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'montpellier',
        name: { ar: 'مونبلييه', en: 'Montpellier', fr: 'Montpellier' },
        description: {
          ar: 'مدينة جامعية جميلة في جنوب فرنسا، مشهورة بالشمس والثقافة.',
          en: 'Beautiful university city in southern France, famous for sun and culture.',
          fr: 'Belle ville universitaire du sud de la France, célèbre pour le soleil et la culture.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['ميدان الكوميديا', 'الجامعة', 'الحدائق', 'المتاحف'],
          en: ['Place de la Comédie', 'University', 'Gardens', 'Museums'],
          fr: ['Place de la Comédie', 'Université', 'Jardins', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.5,
        reviews: 3600,
        highlights: { ar: ['الجامعة', 'الشمس'], en: ['University', 'Sun'], fr: ['Université', 'Soleil'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'lille',
        name: { ar: 'ليل', en: 'Lille', fr: 'Lille' },
        description: {
          ar: 'مدينة في شمال فرنسا، مشهورة بالعمارة الفلمنكية والثقافة.',
          en: 'City in northern France, famous for Flemish architecture and culture.',
          fr: 'Ville du nord de la France, célèbre pour l\'architecture flamande et la culture.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['البلدة القديمة', 'متحف الفنون الجميلة', 'قصر الفنون', 'السوق الكبير'],
          en: ['Old Town', 'Fine Arts Museum', 'Palace of Arts', 'Grand Market'],
          fr: ['Vieille ville', 'Musée des Beaux-Arts', 'Palais des Arts', 'Grand Marché']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 2800,
        highlights: { ar: ['العمارة', 'الثقافة'], en: ['Architecture', 'Culture'], fr: ['Architecture', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'rennes',
        name: { ar: 'رين', en: 'Rennes', fr: 'Rennes' },
        description: {
          ar: 'عاصمة بريتاني، مدينة تاريخية جميلة.',
          en: 'Capital of Brittany, beautiful historical city.',
          fr: 'Capitale de la Bretagne, belle ville historique.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['البلدة القديمة', 'البرلمان', 'المتاحف', 'الحدائق'],
          en: ['Old Town', 'Parliament', 'Museums', 'Gardens'],
          fr: ['Vieille ville', 'Parlement', 'Musées', 'Jardins']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.3,
        reviews: 2400,
        highlights: { ar: ['التاريخ', 'بريتاني'], en: ['History', 'Brittany'], fr: ['Histoire', 'Bretagne'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'reims',
        name: { ar: 'رانس', en: 'Reims', fr: 'Reims' },
        description: {
          ar: 'مدينة الشمبانيا، موطن كاتدرائية رانس الشهيرة.',
          en: 'Champagne city, home to the famous Reims Cathedral.',
          fr: 'Ville du champagne, foyer de la célèbre cathédrale de Reims.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['كاتدرائية رانس', 'متحف الشمبانيا', 'قصر تاو', 'المناطق الريفية'],
          en: ['Reims Cathedral', 'Champagne Museum', 'Tau Palace', 'Countryside areas'],
          fr: ['Cathédrale de Reims', 'Musée du champagne', 'Palais du Tau', 'Zones rurales']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.5,
        reviews: 3400,
        highlights: { ar: ['الشمبانيا', 'الكاتدرائية'], en: ['Champagne', 'Cathedral'], fr: ['Champagne', 'Cathédrale'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'saint_etienne',
        name: { ar: 'سانت إتيان', en: 'Saint-Étienne', fr: 'Saint-Étienne' },
        description: {
          ar: 'مدينة صناعية في وسط فرنسا، مشهورة بالتصميم والثقافة.',
          en: 'Industrial city in central France, famous for design and culture.',
          fr: 'Ville industrielle du centre de la France, célèbre pour le design et la culture.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['متحف التصميم', 'الحدائق', 'المتاحف', 'المناطق الصناعية'],
          en: ['Design Museum', 'Gardens', 'Museums', 'Industrial areas'],
          fr: ['Musée du design', 'Jardins', 'Musées', 'Zones industrielles']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.2,
        reviews: 1800,
        highlights: { ar: ['التصميم', 'الصناعة'], en: ['Design', 'Industry'], fr: ['Design', 'Industrie'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'toulon',
        name: { ar: 'طولون', en: 'Toulon', fr: 'Toulon' },
        description: {
          ar: 'ميناء بحري جميل على البحر الأبيض المتوسط.',
          en: 'Beautiful naval port on the Mediterranean Sea.',
          fr: 'Beau port naval sur la mer Méditerranée.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['الميناء', 'الشواطئ', 'المتاحف البحرية', 'الحدائق'],
          en: ['Port', 'Beaches', 'Naval museums', 'Gardens'],
          fr: ['Port', 'Plages', 'Musées navals', 'Jardins']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 2600,
        highlights: { ar: ['البحر', 'الميناء'], en: ['Sea', 'Port'], fr: ['Mer', 'Port'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'grenoble',
        name: { ar: 'غرونوبل', en: 'Grenoble', fr: 'Grenoble' },
        description: {
          ar: 'مدينة جبلية في جبال الألب الفرنسية، مشهورة بالرياضات الشتوية.',
          en: 'Mountain city in the French Alps, famous for winter sports.',
          fr: 'Ville de montagne dans les Alpes françaises, célèbre pour les sports d\'hiver.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['جبال الألب', 'الرياضات الشتوية', 'المتاحف', 'المناظر الطبيعية'],
          en: ['Alps', 'Winter sports', 'Museums', 'Natural landscapes'],
          fr: ['Alpes', 'Sports d\'hiver', 'Musées', 'Paysages naturels']
        },
        bestTime: { ar: 'ديسمبر - مارس، يونيو - سبتمبر', en: 'December - March, June - September', fr: 'Décembre - Mars, Juin - Septembre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 3000,
        highlights: { ar: ['الجبال', 'الرياضات'], en: ['Mountains', 'Sports'], fr: ['Montagnes', 'Sports'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'dijon',
        name: { ar: 'ديجون', en: 'Dijon', fr: 'Dijon' },
        description: {
          ar: 'عاصمة برغوندي، مشهورة بالخردل والنبيذ.',
          en: 'Capital of Burgundy, famous for mustard and wine.',
          fr: 'Capitale de la Bourgogne, célèbre pour la moutarde et le vin.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['قصر دوقات برغوندي', 'متحف الخردل', 'الكاتدرائية', 'البلدة القديمة'],
          en: ['Palace of Dukes of Burgundy', 'Mustard Museum', 'Cathedral', 'Old Town'],
          fr: ['Palais des ducs de Bourgogne', 'Musée de la moutarde', 'Cathédrale', 'Vieille ville']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 2800,
        highlights: { ar: ['الخردل', 'النبيذ'], en: ['Mustard', 'Wine'], fr: ['Moutarde', 'Vin'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'angers',
        name: { ar: 'أنجيه', en: 'Angers', fr: 'Angers' },
        description: {
          ar: 'مدينة على نهر اللوار، مشهورة بالقلعة والثقافة.',
          en: 'City on the Loire River, famous for castle and culture.',
          fr: 'Ville sur la Loire, célèbre pour le château et la culture.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['قلعة أنجيه', 'الكاتدرائية', 'المتاحف', 'الحدائق'],
          en: ['Angers Castle', 'Cathedral', 'Museums', 'Gardens'],
          fr: ['Château d\'Angers', 'Cathédrale', 'Musées', 'Jardins']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.3,
        reviews: 2200,
        highlights: { ar: ['القلعة', 'التاريخ'], en: ['Castle', 'History'], fr: ['Château', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'nimes',
        name: { ar: 'نيم', en: 'Nîmes', fr: 'Nîmes' },
        description: {
          ar: 'مدينة رومانية قديمة في جنوب فرنسا، مشهورة بالآثار الرومانية.',
          en: 'Ancient Roman city in southern France, famous for Roman ruins.',
          fr: 'Ancienne ville romaine du sud de la France, célèbre pour les ruines romaines.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['الساحة الرومانية', 'معبد مايسون كاري', 'المنتدى الروماني', 'المتاحف'],
          en: ['Roman Arena', 'Maison Carrée Temple', 'Roman Forum', 'Museums'],
          fr: ['Arène romaine', 'Temple de la Maison Carrée', 'Forum romain', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.5,
        reviews: 3200,
        highlights: { ar: ['الآثار الرومانية', 'التاريخ'], en: ['Roman ruins', 'History'], fr: ['Ruines romaines', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'aix_en_provence',
        name: { ar: 'آكس أون بروفانس', en: 'Aix-en-Provence', fr: 'Aix-en-Provence' },
        description: {
          ar: 'مدينة بروفانس الجميلة، مشهورة بالنوافير والفنون.',
          en: 'Beautiful Provence city, famous for fountains and arts.',
          fr: 'Belle ville de Provence, célèbre pour les fontaines et les arts.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['النوافير', 'متحف غرانيت', 'الكاتدرائية', 'الأسواق'],
          en: ['Fountains', 'Granet Museum', 'Cathedral', 'Markets'],
          fr: ['Fontaines', 'Musée Granet', 'Cathédrale', 'Marchés']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.6,
        reviews: 3800,
        highlights: { ar: ['النوافير', 'الفنون'], en: ['Fountains', 'Arts'], fr: ['Fontaines', 'Arts'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'cannes',
        name: { ar: 'كان', en: 'Cannes', fr: 'Cannes' },
        description: {
          ar: 'مدينة الريفيرا الفرنسية الشهيرة، موطن مهرجان كان السينمائي.',
          en: 'Famous French Riviera city, home to Cannes Film Festival.',
          fr: 'Célèbre ville de la Riviera française, foyer du Festival de Cannes.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['مهرجان كان', 'شاطئ كان', 'قصر المهرجانات', 'المناطق الفاخرة'],
          en: ['Cannes Festival', 'Cannes Beach', 'Festival Palace', 'Luxury areas'],
          fr: ['Festival de Cannes', 'Plage de Cannes', 'Palais des Festivals', 'Zones de luxe']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.7,
        reviews: 5200,
        highlights: { ar: ['المهرجان', 'الفخامة'], en: ['Festival', 'Luxury'], fr: ['Festival', 'Luxe'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'avignon',
        name: { ar: 'أفينيون', en: 'Avignon', fr: 'Avignon' },
        description: {
          ar: 'مدينة الباباوات، مشهورة بقصر الباباوات والجسر القديم.',
          en: 'City of Popes, famous for Popes Palace and old bridge.',
          fr: 'Ville des papes, célèbre pour le Palais des Papes et le vieux pont.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['قصر الباباوات', 'جسر أفينيون', 'الكاتدرائية', 'المهرجان'],
          en: ['Popes Palace', 'Avignon Bridge', 'Cathedral', 'Festival'],
          fr: ['Palais des Papes', 'Pont d\'Avignon', 'Cathédrale', 'Festival']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.6,
        reviews: 4000,
        highlights: { ar: ['قصر الباباوات', 'التاريخ'], en: ['Popes Palace', 'History'], fr: ['Palais des Papes', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      },
      {
        id: 'versailles',
        name: { ar: 'فرساي', en: 'Versailles', fr: 'Versailles' },
        description: {
          ar: 'موطن قصر فرساي الشهير، رمز العظمة الفرنسية.',
          en: 'Home to the famous Versailles Palace, symbol of French grandeur.',
          fr: 'Foyer du célèbre château de Versailles, symbole de la grandeur française.'
        },
        image: 'https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg',
        attractions: {
          ar: ['قصر فرساي', 'حدائق فرساي', 'قصر تريانون', 'المتاحف'],
          en: ['Versailles Palace', 'Versailles Gardens', 'Trianon Palace', 'Museums'],
          fr: ['Château de Versailles', 'Jardins de Versailles', 'Palais de Trianon', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '1 يوم', en: '1 day', fr: '1 jour' },
        rating: 4.9,
        reviews: 9800,
        highlights: { ar: ['قصر فرساي', 'التاريخ الملكي'], en: ['Versailles Palace', 'Royal history'], fr: ['Château de Versailles', 'Histoire royale'] },
        gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1823681/pexels-photo-1823681.jpeg']
  },

  spain: {
    id: 'spain',
    name: { ar: 'إسبانيا', en: 'Spain', fr: 'Espagne' },
    capital: { ar: 'مدريد', en: 'Madrid', fr: 'Madrid' },
    description: {
      ar: 'إسبانيا، أرض الفلامنكو والثقافة الغنية، حيث الشمس الدافئة والشواطئ الذهبية تجتمع مع التراث التاريخي العريق.',
      en: 'Spain, land of flamenco and rich culture, where warm sun and golden beaches meet with rich historical heritage.',
      fr: 'L\'Espagne, terre du flamenco et de la culture riche, où le soleil chaud et les plages dorées rencontrent le riche patrimoine historique.'
    },
    mainImage: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
    flag: '🇪🇸',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الإسبانية', en: 'Spanish', fr: 'Espagnol' },
    timeZone: 'GMT+1',
    climate: { ar: 'متوسطي', en: 'Mediterranean', fr: 'Méditerranéen' },
    bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
    visaRequired: false,
    rating: 4.7,
    totalReviews: 9800,
    totalTours: 72,
    totalHotels: 950,
    highlights: {
      ar: ['قصر الحمراء', 'ساغرادا فاميليا', 'شواطئ كوستا ديل سول', 'متحف برادو'],
      en: ['Alhambra Palace', 'Sagrada Familia', 'Costa del Sol beaches', 'Prado Museum'],
      fr: ['Palais de l\'Alhambra', 'Sagrada Familia', 'Plages de la Costa del Sol', 'Musée du Prado']
    },
    culture: {
      ar: 'إسبانيا موطن للفن والثقافة الغنية، من الفلامنكو إلى العمارة الحديثة.',
      en: 'Spain is home to rich art and culture, from flamenco to modern architecture.',
      fr: 'L\'Espagne abrite un art et une culture riches, du flamenco à l\'architecture moderne.'
    },
    cuisine: {
      ar: ['الباييلا', 'التاباس', 'الجازباتشو', 'السانجريا'],
      en: ['Paella', 'Tapas', 'Gazpacho', 'Sangria'],
      fr: ['Paella', 'Tapas', 'Gazpacho', 'Sangria']
    },
    transportation: {
      ar: ['قطار AVE السريع', 'مترو مدريد', 'الحافلات السياحية'],
      en: ['High-speed AVE train', 'Madrid Metro', 'Tourist buses'],
      fr: ['Train AVE à grande vitesse', 'Métro de Madrid', 'Bus touristiques']
    },
    safety: {
      ar: 'إسبانيا دولة آمنة للسياحة مع بنية تحتية سياحية ممتازة.',
      en: 'Spain is a safe country for tourism with excellent tourist infrastructure.',
      fr: 'L\'Espagne est un pays sûr pour le tourisme avec une excellente infrastructure touristique.'
    },
    cities: [
      {
        id: 'madrid',
        name: { ar: 'مدريد', en: 'Madrid', fr: 'Madrid' },
        description: {
          ar: 'عاصمة إسبانيا النابضة بالحياة، مدينة الفنون والثقافة والترفيه.',
          en: 'The vibrant capital of Spain, city of arts, culture and entertainment.',
          fr: 'La capitale vibrante de l\'Espagne, ville des arts, de la culture et du divertissement.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['متحف برادو', 'قصر مدريد الملكي', 'بلازا مايور', 'حديقة ريتيرو'],
          en: ['Prado Museum', 'Royal Palace of Madrid', 'Plaza Mayor', 'Retiro Park'],
          fr: ['Musée du Prado', 'Palais Royal de Madrid', 'Plaza Mayor', 'Parc du Retiro']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.8,
        reviews: 6200,
        highlights: { ar: ['المتاحف الفنية', 'الحياة الليلية'], en: ['Art museums', 'Nightlife'], fr: ['Musées d\'art', 'Vie nocturne'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'barcelona',
        name: { ar: 'برشلونة', en: 'Barcelona', fr: 'Barcelone' },
        description: {
          ar: 'جوهرة كاتالونيا، مدينة غاودي والفن والثقافة على البحر المتوسط.',
          en: 'Jewel of Catalonia, city of Gaudí, art and culture on the Mediterranean.',
          fr: 'Joyau de la Catalogne, ville de Gaudí, art et culture sur la Méditerranée.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['ساغرادا فاميليا', 'بارك غويل', 'البلدة القديمة', 'شاطئ برشلونة'],
          en: ['Sagrada Familia', 'Park Güell', 'Old Town', 'Barcelona Beach'],
          fr: ['Sagrada Familia', 'Parc Güell', 'Vieille ville', 'Plage de Barcelone']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '4-5 أيام', en: '4-5 days', fr: '4-5 jours' },
        rating: 4.9,
        reviews: 11200,
        highlights: { ar: ['غاودي', 'الفن'], en: ['Gaudí', 'Art'], fr: ['Gaudí', 'Art'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'valencia',
        name: { ar: 'بلنسية', en: 'Valencia', fr: 'Valence' },
        description: {
          ar: 'مدينة الباييلا والفنون والعلوم على البحر المتوسط.',
          en: 'City of paella, arts and sciences on the Mediterranean.',
          fr: 'Ville de la paella, des arts et des sciences sur la Méditerranée.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['مدينة الفنون والعلوم', 'كاتدرائية بلنسية', 'شاطئ بلنسية', 'البلدة القديمة'],
          en: ['City of Arts and Sciences', 'Valencia Cathedral', 'Valencia Beach', 'Old Town'],
          fr: ['Cité des Arts et des Sciences', 'Cathédrale de Valence', 'Plage de Valence', 'Vieille ville']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.7,
        reviews: 6800,
        highlights: { ar: ['الباييلا', 'الفنون'], en: ['Paella', 'Arts'], fr: ['Paella', 'Arts'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'seville',
        name: { ar: 'إشبيلية', en: 'Seville', fr: 'Séville' },
        description: {
          ar: 'عاصمة الأندلس، موطن الفلامنكو والثقافة الأندلسية.',
          en: 'Capital of Andalusia, home of flamenco and Andalusian culture.',
          fr: 'Capitale de l\'Andalousie, foyer du flamenco et de la culture andalouse.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['كاتدرائية إشبيلية', 'قصر ألكازار', 'برج خيرالدا', 'البلدة القديمة'],
          en: ['Seville Cathedral', 'Alcázar Palace', 'Giralda Tower', 'Old Town'],
          fr: ['Cathédrale de Séville', 'Palais de l\'Alcázar', 'Tour de la Giralda', 'Vieille ville']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.8,
        reviews: 8200,
        highlights: { ar: ['الفلامنكو', 'الأندلس'], en: ['Flamenco', 'Andalusia'], fr: ['Flamenco', 'Andalousie'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'granada',
        name: { ar: 'غرناطة', en: 'Granada', fr: 'Grenade' },
        description: {
          ar: 'مدينة قصر الحمراء الشهير، جوهرة الأندلس.',
          en: 'City of the famous Alhambra Palace, jewel of Andalusia.',
          fr: 'Ville du célèbre palais de l\'Alhambra, joyau de l\'Andalousie.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['قصر الحمراء', 'الحي العربي', 'كاتدرائية غرناطة', 'جبال سييرا نيفادا'],
          en: ['Alhambra Palace', 'Arab Quarter', 'Granada Cathedral', 'Sierra Nevada Mountains'],
          fr: ['Palais de l\'Alhambra', 'Quartier arabe', 'Cathédrale de Grenade', 'Montagnes de la Sierra Nevada']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.9,
        reviews: 9800,
        highlights: { ar: ['قصر الحمراء', 'الأندلس'], en: ['Alhambra', 'Andalusia'], fr: ['Alhambra', 'Andalousie'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'bilbao',
        name: { ar: 'بلباو', en: 'Bilbao', fr: 'Bilbao' },
        description: {
          ar: 'مدينة الباسك الصناعية، مشهورة بمتحف غوغنهايم.',
          en: 'Basque industrial city, famous for Guggenheim Museum.',
          fr: 'Ville industrielle basque, célèbre pour le musée Guggenheim.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['متحف غوغنهايم', 'البلدة القديمة', 'جسر زوبيزوري', 'المتاحف'],
          en: ['Guggenheim Museum', 'Old Town', 'Zubizuri Bridge', 'Museums'],
          fr: ['Musée Guggenheim', 'Vieille ville', 'Pont Zubizuri', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.6,
        reviews: 4800,
        highlights: { ar: ['غوغنهايم', 'الباسك'], en: ['Guggenheim', 'Basque'], fr: ['Guggenheim', 'Basque'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'malaga',
        name: { ar: 'مالقة', en: 'Málaga', fr: 'Málaga' },
        description: {
          ar: 'مدينة ساحلية جميلة على كوستا ديل سول، موطن بيكاسو.',
          en: 'Beautiful coastal city on Costa del Sol, home of Picasso.',
          fr: 'Belle ville côtière sur la Costa del Sol, foyer de Picasso.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['متحف بيكاسو', 'قلعة جبل طارق', 'شاطئ مالقة', 'البلدة القديمة'],
          en: ['Picasso Museum', 'Gibralfaro Castle', 'Málaga Beach', 'Old Town'],
          fr: ['Musée Picasso', 'Château de Gibralfaro', 'Plage de Málaga', 'Vieille ville']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.7,
        reviews: 6200,
        highlights: { ar: ['بيكاسو', 'الشواطئ'], en: ['Picasso', 'Beaches'], fr: ['Picasso', 'Plages'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'cordoba',
        name: { ar: 'قرطبة', en: 'Córdoba', fr: 'Cordoue' },
        description: {
          ar: 'مدينة المسجد الكبير، عاصمة الأندلس القديمة.',
          en: 'City of the Great Mosque, ancient capital of Andalusia.',
          fr: 'Ville de la Grande Mosquée, ancienne capitale de l\'Andalousie.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['المسجد الكبير', 'الحي اليهودي', 'قصر الملوك', 'الجسر الروماني'],
          en: ['Great Mosque', 'Jewish Quarter', 'Palace of Kings', 'Roman Bridge'],
          fr: ['Grande Mosquée', 'Quartier juif', 'Palais des Rois', 'Pont romain']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.8,
        reviews: 7200,
        highlights: { ar: ['المسجد', 'الأندلس'], en: ['Mosque', 'Andalusia'], fr: ['Mosquée', 'Andalousie'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'salamanca',
        name: { ar: 'شلمنقة', en: 'Salamanca', fr: 'Salamanque' },
        description: {
          ar: 'مدينة الجامعة الذهبية، مركز التعليم والثقافة.',
          en: 'City of the Golden University, center of education and culture.',
          fr: 'Ville de l\'Université Dorée, centre d\'éducation et de culture.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['الجامعة', 'الكاتدرائية', 'بلازا مايور', 'المتاحف'],
          en: ['University', 'Cathedral', 'Plaza Mayor', 'Museums'],
          fr: ['Université', 'Cathédrale', 'Plaza Mayor', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.6,
        reviews: 4200,
        highlights: { ar: ['الجامعة', 'التعليم'], en: ['University', 'Education'], fr: ['Université', 'Éducation'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'toledo',
        name: { ar: 'طليطلة', en: 'Toledo', fr: 'Tolède' },
        description: {
          ar: 'المدينة الإمبراطورية، موطن الثقافات الثلاث.',
          en: 'Imperial City, home of three cultures.',
          fr: 'Ville impériale, foyer de trois cultures.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['كاتدرائية طليطلة', 'قلعة طليطلة', 'المسجد', 'المتاحف'],
          en: ['Toledo Cathedral', 'Toledo Castle', 'Mosque', 'Museums'],
          fr: ['Cathédrale de Tolède', 'Château de Tolède', 'Mosquée', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.7,
        reviews: 5400,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'zaragoza',
        name: { ar: 'سرقسطة', en: 'Zaragoza', fr: 'Saragosse' },
        description: {
          ar: 'مدينة على نهر إبرو، مشهورة بالبازيليكا والثقافة.',
          en: 'City on the Ebro River, famous for basilica and culture.',
          fr: 'Ville sur l\'Èbre, célèbre pour la basilique et la culture.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['بازيليكا بيلار', 'قصر الجعفرية', 'الكاتدرائية', 'المتاحف'],
          en: ['Basilica of Pilar', 'Aljafería Palace', 'Cathedral', 'Museums'],
          fr: ['Basilique du Pilar', 'Palais de l\'Aljafería', 'Cathédrale', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.5,
        reviews: 3600,
        highlights: { ar: ['البازيليكا', 'التاريخ'], en: ['Basilica', 'History'], fr: ['Basilique', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'palma',
        name: { ar: 'بالما', en: 'Palma', fr: 'Palma' },
        description: {
          ar: 'عاصمة مايوركا، مدينة ساحلية جميلة على البحر المتوسط.',
          en: 'Capital of Majorca, beautiful coastal city on the Mediterranean.',
          fr: 'Capitale de Majorque, belle ville côtière sur la Méditerranée.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['كاتدرائية بالما', 'قلعة بيلفر', 'شاطئ بالما', 'البلدة القديمة'],
          en: ['Palma Cathedral', 'Bellver Castle', 'Palma Beach', 'Old Town'],
          fr: ['Cathédrale de Palma', 'Château de Bellver', 'Plage de Palma', 'Vieille ville']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.6,
        reviews: 5200,
        highlights: { ar: ['الشواطئ', 'الجزر'], en: ['Beaches', 'Islands'], fr: ['Plages', 'Îles'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'santiago',
        name: { ar: 'سانتياغو دي كومبوستيلا', en: 'Santiago de Compostela', fr: 'Saint-Jacques-de-Compostelle' },
        description: {
          ar: 'نهاية طريق سانت جيمس، مدينة الحج الشهيرة.',
          en: 'End of the Camino de Santiago, famous pilgrimage city.',
          fr: 'Fin du chemin de Saint-Jacques, célèbre ville de pèlerinage.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['كاتدرائية سانتياغو', 'بلازا ديل أوبرادويرو', 'دير سان مارتين', 'المتاحف'],
          en: ['Santiago Cathedral', 'Plaza del Obradoiro', 'San Martín Monastery', 'Museums'],
          fr: ['Cathédrale de Saint-Jacques', 'Plaza del Obradoiro', 'Monastère de San Martín', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.7,
        reviews: 5800,
        highlights: { ar: ['الحج', 'التاريخ'], en: ['Pilgrimage', 'History'], fr: ['Pèlerinage', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'san_sebastian',
        name: { ar: 'سان سيباستيان', en: 'San Sebastián', fr: 'Saint-Sébastien' },
        description: {
          ar: 'مدينة ساحلية جميلة في الباسك، مشهورة بالطعام والشواطئ.',
          en: 'Beautiful coastal city in the Basque Country, famous for food and beaches.',
          fr: 'Belle ville côtière au Pays basque, célèbre pour la nourriture et les plages.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['شاطئ لا كونشا', 'جزيرة سانتا كلارا', 'البلدة القديمة', 'المطاعم'],
          en: ['La Concha Beach', 'Santa Clara Island', 'Old Town', 'Restaurants'],
          fr: ['Plage de La Concha', 'Île de Santa Clara', 'Vieille ville', 'Restaurants']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.8,
        reviews: 6800,
        highlights: { ar: ['الطعام', 'الشواطئ'], en: ['Food', 'Beaches'], fr: ['Nourriture', 'Plages'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'ibiza',
        name: { ar: 'إيبيزا', en: 'Ibiza', fr: 'Ibiza' },
        description: {
          ar: 'جزيرة الحفلات والحياة الليلية على البحر المتوسط.',
          en: 'Island of parties and nightlife on the Mediterranean.',
          fr: 'Île des fêtes et de la vie nocturne sur la Méditerranée.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['الحياة الليلية', 'الشواطئ', 'البلدة القديمة', 'النوادي'],
          en: ['Nightlife', 'Beaches', 'Old Town', 'Clubs'],
          fr: ['Vie nocturne', 'Plages', 'Vieille ville', 'Clubs']
        },
        bestTime: { ar: 'يونيو - سبتمبر', en: 'June - September', fr: 'Juin - Septembre' },
        duration: { ar: '4-5 أيام', en: '4-5 days', fr: '4-5 jours' },
        rating: 4.6,
        reviews: 7200,
        highlights: { ar: ['الحفلات', 'الشواطئ'], en: ['Parties', 'Beaches'], fr: ['Fêtes', 'Plages'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'alicante',
        name: { ar: 'أليكانتي', en: 'Alicante', fr: 'Alicante' },
        description: {
          ar: 'مدينة ساحلية على كوستا بلانكا، مشهورة بالشواطئ والطقس المشمس.',
          en: 'Coastal city on Costa Blanca, famous for beaches and sunny weather.',
          fr: 'Ville côtière sur la Costa Blanca, célèbre pour les plages et le temps ensoleillé.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['قلعة سانتا باربرا', 'شاطئ أليكانتي', 'البلدة القديمة', 'المتاحف'],
          en: ['Santa Bárbara Castle', 'Alicante Beach', 'Old Town', 'Museums'],
          fr: ['Château de Santa Bárbara', 'Plage d\'Alicante', 'Vieille ville', 'Musées']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.5,
        reviews: 4800,
        highlights: { ar: ['الشواطئ', 'الشمس'], en: ['Beaches', 'Sun'], fr: ['Plages', 'Soleil'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'murcia',
        name: { ar: 'مرسية', en: 'Murcia', fr: 'Murcie' },
        description: {
          ar: 'مدينة في جنوب شرق إسبانيا، مشهورة بالكاتدرائية والثقافة.',
          en: 'City in southeastern Spain, famous for cathedral and culture.',
          fr: 'Ville du sud-est de l\'Espagne, célèbre pour la cathédrale et la culture.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['كاتدرائية مرسية', 'البلدة القديمة', 'المتاحف', 'الحدائق'],
          en: ['Murcia Cathedral', 'Old Town', 'Museums', 'Gardens'],
          fr: ['Cathédrale de Murcie', 'Vieille ville', 'Musées', 'Jardins']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 3200,
        highlights: { ar: ['الكاتدرائية', 'الثقافة'], en: ['Cathedral', 'Culture'], fr: ['Cathédrale', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'cadiz',
        name: { ar: 'قادس', en: 'Cádiz', fr: 'Cadix' },
        description: {
          ar: 'أقدم مدينة في أوروبا، مدينة ساحلية جميلة على المحيط الأطلسي.',
          en: 'Oldest city in Europe, beautiful coastal city on the Atlantic Ocean.',
          fr: 'Plus ancienne ville d\'Europe, belle ville côtière sur l\'océan Atlantique.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['الكاتدرائية', 'البلدة القديمة', 'الشواطئ', 'المتاحف'],
          en: ['Cathedral', 'Old Town', 'Beaches', 'Museums'],
          fr: ['Cathédrale', 'Vieille ville', 'Plages', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 3800,
        highlights: { ar: ['التاريخ', 'البحر'], en: ['History', 'Sea'], fr: ['Histoire', 'Mer'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'pamplona',
        name: { ar: 'بامبلونا', en: 'Pamplona', fr: 'Pampelune' },
        description: {
          ar: 'مدينة سان فيرمين، مشهورة بسباق الثيران.',
          en: 'City of San Fermín, famous for running of the bulls.',
          fr: 'Ville de San Fermín, célèbre pour la course des taureaux.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['مهرجان سان فيرمين', 'الكاتدرائية', 'البلدة القديمة', 'المتاحف'],
          en: ['San Fermín Festival', 'Cathedral', 'Old Town', 'Museums'],
          fr: ['Festival de San Fermín', 'Cathédrale', 'Vieille ville', 'Musées']
        },
        bestTime: { ar: 'يوليو (للمهرجان)', en: 'July (for festival)', fr: 'Juillet (pour le festival)' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 4200,
        highlights: { ar: ['المهرجان', 'الثقافة'], en: ['Festival', 'Culture'], fr: ['Festival', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'segovia',
        name: { ar: 'سيغوفيا', en: 'Segovia', fr: 'Ségovie' },
        description: {
          ar: 'مدينة القناة الرومانية والقلعة، موقع تراث عالمي.',
          en: 'City of Roman aqueduct and castle, World Heritage site.',
          fr: 'Ville de l\'aqueduc romain et du château, site du patrimoine mondial.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['القناة الرومانية', 'قلعة سيغوفيا', 'الكاتدرائية', 'المتاحف'],
          en: ['Roman Aqueduct', 'Segovia Castle', 'Cathedral', 'Museums'],
          fr: ['Aqueduc romain', 'Château de Ségovie', 'Cathédrale', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.6,
        reviews: 4600,
        highlights: { ar: ['القناة', 'القلعة'], en: ['Aqueduct', 'Castle'], fr: ['Aqueduc', 'Château'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'cuenca',
        name: { ar: 'كونكا', en: 'Cuenca', fr: 'Cuenca' },
        description: {
          ar: 'مدينة المنازل المعلقة، موقع تراث عالمي.',
          en: 'City of hanging houses, World Heritage site.',
          fr: 'Ville des maisons suspendues, site du patrimoine mondial.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['المنازل المعلقة', 'الكاتدرائية', 'البلدة القديمة', 'المتاحف'],
          en: ['Hanging Houses', 'Cathedral', 'Old Town', 'Museums'],
          fr: ['Maisons suspendues', 'Cathédrale', 'Vieille ville', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.5,
        reviews: 3400,
        highlights: { ar: ['المنازل المعلقة', 'التاريخ'], en: ['Hanging Houses', 'History'], fr: ['Maisons suspendues', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'gijon',
        name: { ar: 'خيخون', en: 'Gijón', fr: 'Gijón' },
        description: {
          ar: 'مدينة ساحلية في أستورياس، مشهورة بالشواطئ والثقافة.',
          en: 'Coastal city in Asturias, famous for beaches and culture.',
          fr: 'Ville côtière des Asturies, célèbre pour les plages et la culture.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['الشواطئ', 'الميناء', 'المتاحف', 'الحدائق'],
          en: ['Beaches', 'Port', 'Museums', 'Gardens'],
          fr: ['Plages', 'Port', 'Musées', 'Jardins']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.4,
        reviews: 3000,
        highlights: { ar: ['الشواطئ', 'الثقافة'], en: ['Beaches', 'Culture'], fr: ['Plages', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      },
      {
        id: 'valladolid',
        name: { ar: 'بلد الوليد', en: 'Valladolid', fr: 'Valladolid' },
        description: {
          ar: 'مدينة في كاستيا وليون، مشهورة بالتاريخ والثقافة.',
          en: 'City in Castile and León, famous for history and culture.',
          fr: 'Ville de Castille-et-León, célèbre pour l\'histoire et la culture.'
        },
        image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
        attractions: {
          ar: ['الكاتدرائية', 'البلدة القديمة', 'المتاحف', 'الحدائق'],
          en: ['Cathedral', 'Old Town', 'Museums', 'Gardens'],
          fr: ['Cathédrale', 'Vieille ville', 'Musées', 'Jardins']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.3,
        reviews: 2600,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg']
  },

  italy: {
    id: 'italy',
    name: { ar: 'إيطاليا', en: 'Italy', fr: 'Italie' },
    capital: { ar: 'روما', en: 'Rome', fr: 'Rome' },
    description: {
      ar: 'إيطاليا، مهد الحضارة الرومانية وعصر النهضة، حيث التاريخ والفن والطعام الإيطالي الشهي يجتمعون في تناغم رائع.',
      en: 'Italy, cradle of Roman civilization and the Renaissance, where history, art and delicious Italian food come together in wonderful harmony.',
      fr: 'L\'Italie, berceau de la civilisation romaine et de la Renaissance, où l\'histoire, l\'art et la délicieuse cuisine italienne se rencontrent dans une merveilleuse harmonie.'
    },
    mainImage: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
    flag: '🇮🇹',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الإيطالية', en: 'Italian', fr: 'Italien' },
    timeZone: 'GMT+1',
    climate: { ar: 'متوسطي', en: 'Mediterranean', fr: 'Méditerranéen' },
    bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
    visaRequired: false,
    rating: 4.9,
    totalReviews: 15200,
    totalTours: 95,
    totalHotels: 1400,
    highlights: {
      ar: ['الكولوسيوم', 'برج بيزا المائل', 'البندقية', 'فلورنسا'],
      en: ['Colosseum', 'Leaning Tower of Pisa', 'Venice', 'Florence'],
      fr: ['Colisée', 'Tour penchée de Pise', 'Venise', 'Florence']
    },
    culture: {
      ar: 'إيطاليا موطن للفن الكلاسيكي والهندسة المعمارية الرائعة والتراث الثقافي الغني.',
      en: 'Italy is home to classical art, magnificent architecture and rich cultural heritage.',
      fr: 'L\'Italie abrite l\'art classique, l\'architecture magnifique et le riche patrimoine culturel.'
    },
    cuisine: {
      ar: ['البيتزا', 'الباستا', 'الجيلاتو', 'القهوة الإيطالية'],
      en: ['Pizza', 'Pasta', 'Gelato', 'Italian coffee'],
      fr: ['Pizza', 'Pâtes', 'Gelato', 'Café italien']
    },
    transportation: {
      ar: ['قطار Frecciarossa السريع', 'مترو روما', 'تأجير السيارات'],
      en: ['High-speed Frecciarossa train', 'Rome Metro', 'Car rental'],
      fr: ['Train Frecciarossa à grande vitesse', 'Métro de Rome', 'Location de voitures']
    },
    safety: {
      ar: 'إيطاليا دولة آمنة للسياحة مع وجود أمن جيد في المناطق السياحية.',
      en: 'Italy is a safe country for tourism with good security in tourist areas.',
      fr: 'L\'Italie est un pays sûr pour le tourisme avec une bonne sécurité dans les zones touristiques.'
    },
    cities: [
      {
        id: 'rome',
        name: { ar: 'روما', en: 'Rome', fr: 'Rome' },
        description: {
          ar: 'المدينة الخالدة، عاصمة الإمبراطورية الرومانية القديمة وموطن الكنيسة الكاثوليكية.',
          en: 'The Eternal City, capital of the ancient Roman Empire and home of the Catholic Church.',
          fr: 'La Ville Éternelle, capitale de l\'ancien Empire romain et foyer de l\'Église catholique.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['الكولوسيوم', 'منتدى روما', 'الفاتيكان', 'نافورة تريفي'],
          en: ['Colosseum', 'Roman Forum', 'Vatican', 'Trevi Fountain'],
          fr: ['Colisée', 'Forum romain', 'Vatican', 'Fontaine de Trevi']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '4-5 أيام', en: '4-5 days', fr: '4-5 jours' },
        rating: 4.9,
        reviews: 11200,
        highlights: { ar: ['التاريخ الروماني', 'الفن الكلاسيكي'], en: ['Roman history', 'Classical art'], fr: ['Histoire romaine', 'Art classique'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'venice',
        name: { ar: 'البندقية', en: 'Venice', fr: 'Venise' },
        description: {
          ar: 'مدينة القنوات والجسور، جوهرة البحر الأدرياتيكي.',
          en: 'City of canals and bridges, jewel of the Adriatic Sea.',
          fr: 'Ville des canaux et des ponts, joyau de la mer Adriatique.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['قناة غراندي', 'ساحة سان ماركو', 'قصر دوجي', 'جسر ريالتو'],
          en: ['Grand Canal', 'St. Mark\'s Square', 'Doge\'s Palace', 'Rialto Bridge'],
          fr: ['Grand Canal', 'Place Saint-Marc', 'Palais des Doges', 'Pont du Rialto']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.9,
        reviews: 12800,
        highlights: { ar: ['القنوات', 'الفن'], en: ['Canals', 'Art'], fr: ['Canaux', 'Art'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'florence',
        name: { ar: 'فلورنسا', en: 'Florence', fr: 'Florence' },
        description: {
          ar: 'مهد عصر النهضة، مدينة الفن والثقافة الإيطالية.',
          en: 'Cradle of the Renaissance, city of Italian art and culture.',
          fr: 'Berceau de la Renaissance, ville de l\'art et de la culture italienne.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['كاتدرائية فلورنسا', 'معرض أوفيزي', 'جسر بونتي فيكيو', 'قصر بيتي'],
          en: ['Florence Cathedral', 'Uffizi Gallery', 'Ponte Vecchio Bridge', 'Pitti Palace'],
          fr: ['Cathédrale de Florence', 'Galerie des Offices', 'Pont du Ponte Vecchio', 'Palais Pitti']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.9,
        reviews: 11200,
        highlights: { ar: ['عصر النهضة', 'الفن'], en: ['Renaissance', 'Art'], fr: ['Renaissance', 'Art'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'milan',
        name: { ar: 'ميلانو', en: 'Milan', fr: 'Milan' },
        description: {
          ar: 'عاصمة الموضة والتصميم الإيطالي، مدينة الأناقة والثقافة.',
          en: 'Capital of Italian fashion and design, city of elegance and culture.',
          fr: 'Capitale de la mode et du design italiens, ville d\'élégance et de culture.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['كاتدرائية ميلانو', 'دار أوبرا لا سكالا', 'قلعة سفورزا', 'جاليريا فيتوريو إيمانويل'],
          en: ['Milan Cathedral', 'La Scala Opera House', 'Sforza Castle', 'Galleria Vittorio Emanuele'],
          fr: ['Cathédrale de Milan', 'Opéra La Scala', 'Château Sforza', 'Galerie Vittorio Emanuele']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.7,
        reviews: 9800,
        highlights: { ar: ['الموضة', 'التصميم'], en: ['Fashion', 'Design'], fr: ['Mode', 'Design'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'naples',
        name: { ar: 'نابولي', en: 'Naples', fr: 'Naples' },
        description: {
          ar: 'مدينة البيتزا الأصلية، بوابة إلى بومبي وجزيرة كابري.',
          en: 'City of original pizza, gateway to Pompeii and Capri Island.',
          fr: 'Ville de la pizza originale, porte d\'entrée vers Pompéi et l\'île de Capri.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['بومبي', 'جبل فيزوف', 'جزيرة كابري', 'البلدة القديمة'],
          en: ['Pompeii', 'Mount Vesuvius', 'Capri Island', 'Old Town'],
          fr: ['Pompéi', 'Mont Vésuve', 'Île de Capri', 'Vieille ville']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.6,
        reviews: 8200,
        highlights: { ar: ['البيتزا', 'بومبي'], en: ['Pizza', 'Pompeii'], fr: ['Pizza', 'Pompéi'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'pisa',
        name: { ar: 'بيزا', en: 'Pisa', fr: 'Pise' },
        description: {
          ar: 'مدينة برج بيزا المائل الشهير، موطن الجامعة العريقة.',
          en: 'City of the famous Leaning Tower of Pisa, home to ancient university.',
          fr: 'Ville de la célèbre tour penchée de Pise, foyer de l\'ancienne université.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['برج بيزا المائل', 'كاتدرائية بيزا', 'المعمدان', 'ساحة المعجزات'],
          en: ['Leaning Tower of Pisa', 'Pisa Cathedral', 'Baptistery', 'Piazza dei Miracoli'],
          fr: ['Tour penchée de Pise', 'Cathédrale de Pise', 'Baptistère', 'Place des Miracles']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.7,
        reviews: 9200,
        highlights: { ar: ['برج بيزا', 'التاريخ'], en: ['Leaning Tower', 'History'], fr: ['Tour penchée', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'bologna',
        name: { ar: 'بولونيا', en: 'Bologna', fr: 'Bologne' },
        description: {
          ar: 'مدينة الطعام الإيطالي، موطن أقدم جامعة في أوروبا.',
          en: 'City of Italian food, home to the oldest university in Europe.',
          fr: 'Ville de la cuisine italienne, foyer de la plus ancienne université d\'Europe.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['البرجين المائلين', 'الجامعة', 'البلدة القديمة', 'المطاعم'],
          en: ['Two Leaning Towers', 'University', 'Old Town', 'Restaurants'],
          fr: ['Deux tours penchées', 'Université', 'Vieille ville', 'Restaurants']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.6,
        reviews: 6800,
        highlights: { ar: ['الطعام', 'الجامعة'], en: ['Food', 'University'], fr: ['Nourriture', 'Université'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'turin',
        name: { ar: 'تورينو', en: 'Turin', fr: 'Turin' },
        description: {
          ar: 'عاصمة بيدمونت، مدينة الشوكولاتة والصناعة الإيطالية.',
          en: 'Capital of Piedmont, city of chocolate and Italian industry.',
          fr: 'Capitale du Piémont, ville du chocolat et de l\'industrie italienne.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['قصر رويال', 'متحف السينما', 'كاتدرائية تورينو', 'المتاحف'],
          en: ['Royal Palace', 'Cinema Museum', 'Turin Cathedral', 'Museums'],
          fr: ['Palais Royal', 'Musée du Cinéma', 'Cathédrale de Turin', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 5600,
        highlights: { ar: ['الشوكولاتة', 'الصناعة'], en: ['Chocolate', 'Industry'], fr: ['Chocolat', 'Industrie'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'genoa',
        name: { ar: 'جنوة', en: 'Genoa', fr: 'Gênes' },
        description: {
          ar: 'ميناء بحري تاريخي، موطن كريستوفر كولومبوس.',
          en: 'Historic seaport, home of Christopher Columbus.',
          fr: 'Port maritime historique, foyer de Christophe Colomb.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['الميناء القديم', 'قصر دوجي', 'كاتدرائية جنوة', 'المتاحف'],
          en: ['Old Port', 'Doge\'s Palace', 'Genoa Cathedral', 'Museums'],
          fr: ['Vieux Port', 'Palais des Doges', 'Cathédrale de Gênes', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 4800,
        highlights: { ar: ['الميناء', 'التاريخ'], en: ['Port', 'History'], fr: ['Port', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'verona',
        name: { ar: 'فيرونا', en: 'Verona', fr: 'Vérone' },
        description: {
          ar: 'مدينة روميو وجولييت، موطن الحب والثقافة.',
          en: 'City of Romeo and Juliet, home of love and culture.',
          fr: 'Ville de Roméo et Juliette, foyer de l\'amour et de la culture.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['منزل جولييت', 'الساحة الرومانية', 'قلعة فيرونا', 'المتاحف'],
          en: ['Juliet\'s House', 'Roman Arena', 'Verona Castle', 'Museums'],
          fr: ['Maison de Juliette', 'Arène romaine', 'Château de Vérone', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.6,
        reviews: 6200,
        highlights: { ar: ['روميو وجولييت', 'الحب'], en: ['Romeo and Juliet', 'Love'], fr: ['Roméo et Juliette', 'Amour'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'palermo',
        name: { ar: 'باليرمو', en: 'Palermo', fr: 'Palerme' },
        description: {
          ar: 'عاصمة صقلية، مدينة الثقافة العربية النورمانية.',
          en: 'Capital of Sicily, city of Arab-Norman culture.',
          fr: 'Capitale de la Sicile, ville de la culture arabo-normande.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['كاتدرائية باليرمو', 'قصر نورماني', 'المسارح', 'المتاحف'],
          en: ['Palermo Cathedral', 'Norman Palace', 'Theaters', 'Museums'],
          fr: ['Cathédrale de Palerme', 'Palais normand', 'Théâtres', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.5,
        reviews: 5400,
        highlights: { ar: ['صقلية', 'الثقافة'], en: ['Sicily', 'Culture'], fr: ['Sicile', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'catania',
        name: { ar: 'كاتانيا', en: 'Catania', fr: 'Catane' },
        description: {
          ar: 'مدينة بركانية في صقلية، مشهورة بالعمارة الباروكية.',
          en: 'Volcanic city in Sicily, famous for Baroque architecture.',
          fr: 'Ville volcanique de Sicile, célèbre pour l\'architecture baroque.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['جبل إتنا', 'كاتدرائية كاتانيا', 'البلدة القديمة', 'المتاحف'],
          en: ['Mount Etna', 'Catania Cathedral', 'Old Town', 'Museums'],
          fr: ['Mont Etna', 'Cathédrale de Catane', 'Vieille ville', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.4,
        reviews: 4200,
        highlights: { ar: ['جبل إتنا', 'البراكين'], en: ['Mount Etna', 'Volcanoes'], fr: ['Mont Etna', 'Volcans'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'siena',
        name: { ar: 'سيينا', en: 'Siena', fr: 'Sienne' },
        description: {
          ar: 'مدينة عصر النهضة، مشهورة بسباق الخيول باليو.',
          en: 'Renaissance city, famous for Palio horse race.',
          fr: 'Ville de la Renaissance, célèbre pour la course de chevaux du Palio.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['ساحة ديل كامبو', 'كاتدرائية سيينا', 'قصر بوبليكو', 'المتاحف'],
          en: ['Piazza del Campo', 'Siena Cathedral', 'Palazzo Pubblico', 'Museums'],
          fr: ['Piazza del Campo', 'Cathédrale de Sienne', 'Palazzo Pubblico', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.7,
        reviews: 6800,
        highlights: { ar: ['الباليو', 'عصر النهضة'], en: ['Palio', 'Renaissance'], fr: ['Palio', 'Renaissance'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'padua',
        name: { ar: 'بادوفا', en: 'Padua', fr: 'Padoue' },
        description: {
          ar: 'مدينة الجامعة القديمة، موطن الفن والثقافة.',
          en: 'City of ancient university, home of art and culture.',
          fr: 'Ville de l\'ancienne université, foyer de l\'art et de la culture.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['الجامعة', 'كاتدرائية بادوفا', 'الكنائس', 'المتاحف'],
          en: ['University', 'Padua Cathedral', 'Churches', 'Museums'],
          fr: ['Université', 'Cathédrale de Padoue', 'Églises', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 3800,
        highlights: { ar: ['الجامعة', 'الفن'], en: ['University', 'Art'], fr: ['Université', 'Art'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'perugia',
        name: { ar: 'بيروجيا', en: 'Perugia', fr: 'Pérouse' },
        description: {
          ar: 'عاصمة أومبريا، مدينة الشوكولاتة والفنون.',
          en: 'Capital of Umbria, city of chocolate and arts.',
          fr: 'Capitale de l\'Ombrie, ville du chocolat et des arts.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['كاتدرائية بيروجيا', 'قصر بريوري', 'المتاحف', 'الشوكولاتة'],
          en: ['Perugia Cathedral', 'Palazzo dei Priori', 'Museums', 'Chocolate'],
          fr: ['Cathédrale de Pérouse', 'Palazzo dei Priori', 'Musées', 'Chocolat']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 3600,
        highlights: { ar: ['الشوكولاتة', 'الفنون'], en: ['Chocolate', 'Arts'], fr: ['Chocolat', 'Arts'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'ravenna',
        name: { ar: 'رافينا', en: 'Ravenna', fr: 'Ravenne' },
        description: {
          ar: 'مدينة الفسيفساء البيزنطية، موقع تراث عالمي.',
          en: 'City of Byzantine mosaics, World Heritage site.',
          fr: 'Ville des mosaïques byzantines, site du patrimoine mondial.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['الفسيفساء البيزنطية', 'الكنائس', 'المتاحف', 'الآثار'],
          en: ['Byzantine mosaics', 'Churches', 'Museums', 'Monuments'],
          fr: ['Mosaïques byzantines', 'Églises', 'Musées', 'Monuments']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.6,
        reviews: 5200,
        highlights: { ar: ['الفسيفساء', 'البيزنطية'], en: ['Mosaics', 'Byzantine'], fr: ['Mosaïques', 'Byzantin'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'bari',
        name: { ar: 'باري', en: 'Bari', fr: 'Bari' },
        description: {
          ar: 'عاصمة بوليا، مدينة ساحلية على البحر الأدرياتيكي.',
          en: 'Capital of Puglia, coastal city on the Adriatic Sea.',
          fr: 'Capitale des Pouilles, ville côtière sur la mer Adriatique.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['البلدة القديمة', 'كاتدرائية باري', 'القلعة', 'الشواطئ'],
          en: ['Old Town', 'Bari Cathedral', 'Castle', 'Beaches'],
          fr: ['Vieille ville', 'Cathédrale de Bari', 'Château', 'Plages']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.4,
        reviews: 4000,
        highlights: { ar: ['البحر', 'بوليا'], en: ['Sea', 'Puglia'], fr: ['Mer', 'Pouilles'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'brindisi',
        name: { ar: 'برينديزي', en: 'Brindisi', fr: 'Brindisi' },
        description: {
          ar: 'ميناء بحري في بوليا، بوابة إلى اليونان.',
          en: 'Seaport in Puglia, gateway to Greece.',
          fr: 'Port maritime des Pouilles, porte d\'entrée vers la Grèce.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['الميناء', 'الآثار الرومانية', 'الكاتدرائية', 'الشواطئ'],
          en: ['Port', 'Roman ruins', 'Cathedral', 'Beaches'],
          fr: ['Port', 'Ruines romaines', 'Cathédrale', 'Plages']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '1-2 أيام', en: '1-2 days', fr: '1-2 jours' },
        rating: 4.3,
        reviews: 2800,
        highlights: { ar: ['الميناء', 'الآثار'], en: ['Port', 'Ruins'], fr: ['Port', 'Ruines'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'lecce',
        name: { ar: 'ليتشي', en: 'Lecce', fr: 'Lecce' },
        description: {
          ar: 'فلورنسا الجنوب، مدينة العمارة الباروكية.',
          en: 'Florence of the South, city of Baroque architecture.',
          fr: 'Florence du Sud, ville de l\'architecture baroque.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['الكاتدرائية', 'البلدة القديمة', 'المتاحف', 'العمارة الباروكية'],
          en: ['Cathedral', 'Old Town', 'Museums', 'Baroque architecture'],
          fr: ['Cathédrale', 'Vieille ville', 'Musées', 'Architecture baroque']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.5,
        reviews: 3800,
        highlights: { ar: ['الباروك', 'العمارة'], en: ['Baroque', 'Architecture'], fr: ['Baroque', 'Architecture'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'trento',
        name: { ar: 'ترينتو', en: 'Trento', fr: 'Trente' },
        description: {
          ar: 'مدينة جبلية في ترينتينو، مشهورة بالجبال والثقافة.',
          en: 'Mountain city in Trentino, famous for mountains and culture.',
          fr: 'Ville de montagne du Trentin, célèbre pour les montagnes et la culture.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['القلعة', 'الكاتدرائية', 'الجبال', 'المتاحف'],
          en: ['Castle', 'Cathedral', 'Mountains', 'Museums'],
          fr: ['Château', 'Cathédrale', 'Montagnes', 'Musées']
        },
        bestTime: { ar: 'يونيو - سبتمبر', en: 'June - September', fr: 'Juin - Septembre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 3200,
        highlights: { ar: ['الجبال', 'الطبيعة'], en: ['Mountains', 'Nature'], fr: ['Montagnes', 'Nature'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'trieste',
        name: { ar: 'ترييستي', en: 'Trieste', fr: 'Trieste' },
        description: {
          ar: 'مدينة ساحلية على البحر الأدرياتيكي، بوابة إلى أوروبا الوسطى.',
          en: 'Coastal city on the Adriatic Sea, gateway to Central Europe.',
          fr: 'Ville côtière sur la mer Adriatique, porte d\'entrée vers l\'Europe centrale.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['الميناء', 'القلعة', 'الكاتدرائية', 'المتاحف'],
          en: ['Port', 'Castle', 'Cathedral', 'Museums'],
          fr: ['Port', 'Château', 'Cathédrale', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.3,
        reviews: 3000,
        highlights: { ar: ['البحر', 'الثقافة'], en: ['Sea', 'Culture'], fr: ['Mer', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      },
      {
        id: 'bergamo',
        name: { ar: 'بيرغامو', en: 'Bergamo', fr: 'Bergame' },
        description: {
          ar: 'مدينة جبلية في لومباردي، مشهورة بالبلدة القديمة.',
          en: 'Mountain city in Lombardy, famous for Old Town.',
          fr: 'Ville de montagne en Lombardie, célèbre pour la vieille ville.'
        },
        image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
        attractions: {
          ar: ['البلدة القديمة', 'القلعة', 'الكاتدرائية', 'المتاحف'],
          en: ['Old Town', 'Castle', 'Cathedral', 'Museums'],
          fr: ['Vieille ville', 'Château', 'Cathédrale', 'Musées']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2 أيام', en: '2 days', fr: '2 jours' },
        rating: 4.4,
        reviews: 3400,
        highlights: { ar: ['البلدة القديمة', 'الجبال'], en: ['Old Town', 'Mountains'], fr: ['Vieille ville', 'Montagnes'] },
        gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg']
  },

  germany: {
    id: 'germany',
    name: { ar: 'ألمانيا', en: 'Germany', fr: 'Allemagne' },
    capital: { ar: 'برلين', en: 'Berlin', fr: 'Berlin' },
    description: {
      ar: 'ألمانيا، أرض القلاع الخيالية والغابات الساحرة، حيث التاريخ العريق يلتقي بالحداثة والتكنولوجيا.',
      en: 'Germany, land of fairy-tale castles and enchanting forests, where ancient history meets modernity and technology.',
      fr: 'L\'Allemagne, terre des châteaux de conte de fées et des forêts enchanteresses, où l\'histoire ancienne rencontre la modernité et la technologie.'
    },
    mainImage: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg',
    flag: '🇩🇪',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الألمانية', en: 'German', fr: 'Allemand' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 8900,
    totalTours: 68,
    totalHotels: 1100,
    highlights: {
      ar: ['قلعة نويشفانشتاين', 'بوابة براندنبورغ', 'الغابة السوداء', 'مهرجان أكتوبر'],
      en: ['Neuschwanstein Castle', 'Brandenburg Gate', 'Black Forest', 'Oktoberfest'],
      fr: ['Château de Neuschwanstein', 'Porte de Brandebourg', 'Forêt Noire', 'Oktoberfest']
    },
    culture: {
      ar: 'ألمانيا موطن للفلسفة والموسيقى الكلاسيكية والهندسة المعمارية المتميزة.',
      en: 'Germany is home to philosophy, classical music and distinguished architecture.',
      fr: 'L\'Allemagne abrite la philosophie, la musique classique et l\'architecture distinguée.'
    },
    cuisine: {
      ar: ['النقانق الألمانية', 'البيرة الألمانية', 'الساوركراوت', 'الكعك الألماني'],
      en: ['German sausages', 'German beer', 'Sauerkraut', 'German cake'],
      fr: ['Saucisses allemandes', 'Bière allemande', 'Choucroute', 'Gâteau allemand']
    },
    transportation: {
      ar: ['قطار ICE السريع', 'مترو برلين', 'الطريق السريع الألماني'],
      en: ['High-speed ICE train', 'Berlin Metro', 'German Autobahn'],
      fr: ['Train ICE à grande vitesse', 'Métro de Berlin', 'Autoroute allemande']
    },
    safety: {
      ar: 'ألمانيا دولة آمنة جداً للسياحة مع بنية تحتية ممتازة.',
      en: 'Germany is a very safe country for tourism with excellent infrastructure.',
      fr: 'L\'Allemagne est un pays très sûr pour le tourisme avec une excellente infrastructure.'
    },
    cities: [
      {
        id: 'berlin',
        name: { ar: 'برلين', en: 'Berlin', fr: 'Berlin' },
        description: {
          ar: 'عاصمة ألمانيا الموحدة، مدينة الثقافة والفن والتاريخ الحديث.',
          en: 'Capital of unified Germany, city of culture, art and modern history.',
          fr: 'Capitale de l\'Allemagne unifiée, ville de culture, d\'art et d\'histoire moderne.'
        },
        image: 'https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg',
        attractions: {
          ar: ['بوابة براندنبورغ', 'جدار برلين', 'متحف بيرغامون', 'جزيرة المتاحف'],
          en: ['Brandenburg Gate', 'Berlin Wall', 'Pergamon Museum', 'Museum Island'],
          fr: ['Porte de Brandebourg', 'Mur de Berlin', 'Musée de Pergame', 'Île aux Musées']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.7,
        reviews: 7800,
        highlights: { ar: ['التاريخ الحديث', 'المتاحف'], en: ['Modern history', 'Museums'], fr: ['Histoire moderne', 'Musées'] },
        gallery: ['https://images.pexels.com/photos/10546025/pexels-photo-10546025.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg']
  },

  greece: {
    id: 'greece',
    name: { ar: 'اليونان', en: 'Greece', fr: 'Grèce' },
    capital: { ar: 'أثينا', en: 'Athens', fr: 'Athènes' },
    description: {
      ar: 'اليونان، مهد الحضارة الغربية، حيث الجزر الساحرة والشواطئ الذهبية تلتقي بالتاريخ القديم والأساطير.',
      en: 'Greece, cradle of Western civilization, where enchanting islands and golden beaches meet ancient history and mythology.',
      fr: 'La Grèce, berceau de la civilisation occidentale, où les îles enchanteresses et les plages dorées rencontrent l\'histoire ancienne et la mythologie.'
    },
    mainImage: 'https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg',
    flag: '🇬🇷',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'اليونانية', en: 'Greek', fr: 'Grec' },
    timeZone: 'GMT+2',
    climate: { ar: 'متوسطي', en: 'Mediterranean', fr: 'Méditerranéen' },
    bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
    visaRequired: false,
    rating: 4.8,
    totalReviews: 11200,
    totalTours: 78,
    totalHotels: 980,
    highlights: {
      ar: ['الأكروبوليس', 'جزر سانتوريني', 'ميكونوس', 'دلفي'],
      en: ['Acropolis', 'Santorini Islands', 'Mykonos', 'Delphi'],
      fr: ['Acropole', 'Îles de Santorin', 'Mykonos', 'Delphes']
    },
    culture: {
      ar: 'اليونان موطن الفلسفة القديمة والأساطير اليونانية والتراث الثقافي العريق.',
      en: 'Greece is home to ancient philosophy, Greek mythology and rich cultural heritage.',
      fr: 'La Grèce abrite la philosophie ancienne, la mythologie grecque et le riche patrimoine culturel.'
    },
    cuisine: {
      ar: ['الموساكا', 'الجيريكو سالاد', 'الدولماديس', 'الزيتون اليوناني'],
      en: ['Moussaka', 'Greek salad', 'Dolmades', 'Greek olives'],
      fr: ['Moussaka', 'Salade grecque', 'Dolmades', 'Olives grecques']
    },
    transportation: {
      ar: ['العبارات بين الجزر', 'مترو أثينا', 'تأجير السيارات'],
      en: ['Ferries between islands', 'Athens Metro', 'Car rental'],
      fr: ['Ferries entre les îles', 'Métro d\'Athènes', 'Location de voitures']
    },
    safety: {
      ar: 'اليونان دولة آمنة للسياحة مع شعب مضياف وودود.',
      en: 'Greece is a safe country for tourism with hospitable and friendly people.',
      fr: 'La Grèce est un pays sûr pour le tourisme avec un peuple hospitalier et amical.'
    },
    cities: [
      {
        id: 'athens',
        name: { ar: 'أثينا', en: 'Athens', fr: 'Athènes' },
        description: {
          ar: 'عاصمة اليونان القديمة، موطن الأكروبوليس والتراث اليوناني العريق.',
          en: 'Capital of ancient Greece, home of the Acropolis and rich Greek heritage.',
          fr: 'Capitale de la Grèce antique, foyer de l\'Acropole et du riche patrimoine grec.'
        },
        image: 'https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg',
        attractions: {
          ar: ['الأكروبوليس', 'متحف الأكروبوليس', 'أغورا القديمة', 'معبد زيوس'],
          en: ['Acropolis', 'Acropolis Museum', 'Ancient Agora', 'Temple of Zeus'],
          fr: ['Acropole', 'Musée de l\'Acropole', 'Agora antique', 'Temple de Zeus']
        },
        bestTime: { ar: 'أبريل - يونيو، سبتمبر - أكتوبر', en: 'April - June, September - October', fr: 'Avril - Juin, Septembre - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.8,
        reviews: 9200,
        highlights: { ar: ['التاريخ القديم', 'الآثار اليونانية'], en: ['Ancient history', 'Greek ruins'], fr: ['Histoire ancienne', 'Ruines grecques'] },
        gallery: ['https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg']
  },

  portugal: {
    id: 'portugal',
    name: { ar: 'البرتغال', en: 'Portugal', fr: 'Portugal' },
    capital: { ar: 'لشبونة', en: 'Lisbon', fr: 'Lisbonne' },
    description: {
      ar: 'البرتغال، أرض المستكشفين والشواطئ الذهبية، حيث التاريخ البحري العريق يلتقي بالجمال الطبيعي الساحر.',
      en: 'Portugal, land of explorers and golden beaches, where rich maritime history meets charming natural beauty.',
      fr: 'Le Portugal, terre des explorateurs et des plages dorées, où l\'histoire maritime riche rencontre la beauté naturelle charmante.'
    },
    mainImage: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
    flag: '🇵🇹',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'البرتغالية', en: 'Portuguese', fr: 'Portugais' },
    timeZone: 'GMT+0',
    climate: { ar: 'متوسطي', en: 'Mediterranean', fr: 'Méditerranéen' },
    bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
    visaRequired: false,
    rating: 4.7,
    totalReviews: 7600,
    totalTours: 58,
    totalHotels: 720,
    highlights: {
      ar: ['برج بيليم', 'دير جيرونيموس', 'شواطئ ألغارف', 'بورتو'],
      en: ['Belém Tower', 'Jerónimos Monastery', 'Algarve beaches', 'Porto'],
      fr: ['Tour de Belém', 'Monastère des Hiéronymites', 'Plages de l\'Algarve', 'Porto']
    },
    culture: {
      ar: 'البرتغال موطن للفنون والثقافة البحرية والتراث التاريخي الغني.',
      en: 'Portugal is home to arts, maritime culture and rich historical heritage.',
      fr: 'Le Portugal abrite les arts, la culture maritime et le riche patrimoine historique.'
    },
    cuisine: {
      ar: ['الباستيل دي ناتا', 'الباكالهاو', 'البرتغال المشوي', 'النبيذ البرتغالي'],
      en: ['Pastel de nata', 'Bacalhau', 'Portuguese grilled', 'Portuguese wine'],
      fr: ['Pastel de nata', 'Bacalhau', 'Grillé portugais', 'Vin portugais']
    },
    transportation: {
      ar: ['مترو لشبونة', 'الترام الكهربائي', 'تأجير السيارات'],
      en: ['Lisbon Metro', 'Electric tram', 'Car rental'],
      fr: ['Métro de Lisbonne', 'Tramway électrique', 'Location de voitures']
    },
    safety: {
      ar: 'البرتغال دولة آمنة للسياحة مع شعب ودود ومضياف.',
      en: 'Portugal is a safe country for tourism with friendly and hospitable people.',
      fr: 'Le Portugal est un pays sûr pour le tourisme avec un peuple amical et hospitalier.'
    },
    cities: [
      {
        id: 'lisbon',
        name: { ar: 'لشبونة', en: 'Lisbon', fr: 'Lisbonne' },
        description: {
          ar: 'عاصمة البرتغال الجميلة، مدينة التلال والترام الكهربائي والتاريخ البحري.',
          en: 'Beautiful capital of Portugal, city of hills, electric trams and maritime history.',
          fr: 'Belle capitale du Portugal, ville de collines, de tramways électriques et d\'histoire maritime.'
        },
        image: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
        attractions: {
          ar: ['برج بيليم', 'دير جيرونيموس', 'قصر سينترا', 'حي ألفاما'],
          en: ['Belém Tower', 'Jerónimos Monastery', 'Sintra Palace', 'Alfama district'],
          fr: ['Tour de Belém', 'Monastère des Hiéronymites', 'Palais de Sintra', 'Quartier d\'Alfama']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.7,
        reviews: 6400,
        highlights: { ar: ['التاريخ البحري', 'العمارة الجميلة'], en: ['Maritime history', 'Beautiful architecture'], fr: ['Histoire maritime', 'Belle architecture'] },
        gallery: ['https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg']
  },

  netherlands: {
    id: 'netherlands',
    name: { ar: 'هولندا', en: 'Netherlands', fr: 'Pays-Bas' },
    capital: { ar: 'أمستردام', en: 'Amsterdam', fr: 'Amsterdam' },
    description: {
      ar: 'هولندا، أرض طواحين الهواء والزهور، حيث القنوات الساحرة والثقافة الفنية الغنية.',
      en: 'Netherlands, land of windmills and flowers, where charming canals and rich artistic culture meet.',
      fr: 'Pays-Bas, terre des moulins à vent et des fleurs, où les canaux charmants et la riche culture artistique se rencontrent.'
    },
    mainImage: 'https://images.pexels.com/photos/2499862/pexels-photo-2499862.jpeg',
    flag: '🇳🇱',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الهولندية', en: 'Dutch', fr: 'Néerlandais' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل بحري', en: 'Maritime temperate', fr: 'Tempéré maritime' },
    bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 6800,
    totalTours: 52,
    totalHotels: 850,
    highlights: {
      ar: ['قنوات أمستردام', 'طواحين الهواء', 'حدائق كيوكينهوف', 'متحف فان جوخ'],
      en: ['Amsterdam canals', 'Windmills', 'Keukenhof gardens', 'Van Gogh Museum'],
      fr: ['Canaux d\'Amsterdam', 'Moulins à vent', 'Jardins de Keukenhof', 'Musée Van Gogh']
    },
    culture: {
      ar: 'هولندا موطن للفنون الكلاسيكية والهندسة المعمارية المتميزة والثقافة المتحررة.',
      en: 'Netherlands is home to classical arts, distinguished architecture and liberal culture.',
      fr: 'Les Pays-Bas abritent les arts classiques, l\'architecture distinguée et la culture libérale.'
    },
    cuisine: {
      ar: ['الجبن الهولندي', 'السترووبافل', 'السمك المملح', 'البيتزا الهولندية'],
      en: ['Dutch cheese', 'Stroopwafel', 'Salted fish', 'Dutch pizza'],
      fr: ['Fromage néerlandais', 'Stroopwafel', 'Poisson salé', 'Pizza néerlandaise']
    },
    transportation: {
      ar: ['الدراجات الهولندية', 'مترو أمستردام', 'الترام'],
      en: ['Dutch bicycles', 'Amsterdam Metro', 'Tram'],
      fr: ['Vélos néerlandais', 'Métro d\'Amsterdam', 'Tramway']
    },
    safety: {
      ar: 'هولندا دولة آمنة جداً للسياحة مع بنية تحتية ممتازة.',
      en: 'Netherlands is a very safe country for tourism with excellent infrastructure.',
      fr: 'Les Pays-Bas sont un pays très sûr pour le tourisme avec une excellente infrastructure.'
    },
    cities: [
      {
        id: 'amsterdam',
        name: { ar: 'أمستردام', en: 'Amsterdam', fr: 'Amsterdam' },
        description: {
          ar: 'عاصمة هولندا الجميلة، مدينة القنوات والجسور والثقافة الفنية.',
          en: 'Beautiful capital of Netherlands, city of canals, bridges and artistic culture.',
          fr: 'Belle capitale des Pays-Bas, ville de canaux, de ponts et de culture artistique.'
        },
        image: 'https://images.pexels.com/photos/2499862/pexels-photo-2499862.jpeg',
        attractions: {
          ar: ['قنوات أمستردام', 'متحف فان جوخ', 'متحف ريكز', 'منطقة جوردان'],
          en: ['Amsterdam canals', 'Van Gogh Museum', 'Rijksmuseum', 'Jordaan district'],
          fr: ['Canaux d\'Amsterdam', 'Musée Van Gogh', 'Rijksmuseum', 'Quartier Jordaan']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.6,
        reviews: 5600,
        highlights: { ar: ['القنوات', 'المتاحف الفنية'], en: ['Canals', 'Art museums'], fr: ['Canaux', 'Musées d\'art'] },
        gallery: ['https://images.pexels.com/photos/2499862/pexels-photo-2499862.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/2499862/pexels-photo-2499862.jpeg']
  },

  belgium: {
    id: 'belgium',
    name: { ar: 'بلجيكا', en: 'Belgium', fr: 'Belgique' },
    capital: { ar: 'بروكسل', en: 'Brussels', fr: 'Bruxelles' },
    description: {
      ar: 'بلجيكا، أرض الشوكولاتة والبيرة، حيث العمارة القوطية الجميلة والثقافة الأوروبية المتنوعة.',
      en: 'Belgium, land of chocolate and beer, where beautiful Gothic architecture and diverse European culture meet.',
      fr: 'La Belgique, terre du chocolat et de la bière, où la belle architecture gothique et la culture européenne diversifiée se rencontrent.'
    },
    mainImage: 'https://images.pexels.com/photos/159213/hall-congress-architecture-building-159213.jpeg',
    flag: '🇧🇪',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الفرنسية، الهولندية، الألمانية', en: 'French, Dutch, German', fr: 'Français, Néerlandais, Allemand' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل بحري', en: 'Maritime temperate', fr: 'Tempéré maritime' },
    bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
    visaRequired: false,
    rating: 4.5,
    totalReviews: 5400,
    totalTours: 42,
    totalHotels: 680,
    highlights: {
      ar: ['ساحة جراند بلاس', 'تمثال مانيكين بيس', 'كاتدرائية بروكسل', 'مدينة بروج'],
      en: ['Grand Place square', 'Manneken Pis statue', 'Brussels Cathedral', 'Bruges city'],
      fr: ['Place Grand Place', 'Statue Manneken Pis', 'Cathédrale de Bruxelles', 'Ville de Bruges']
    },
    culture: {
      ar: 'بلجيكا موطن للفنون والهندسة المعمارية القوطية والثقافة الأوروبية المتنوعة.',
      en: 'Belgium is home to arts, Gothic architecture and diverse European culture.',
      fr: 'La Belgique abrite les arts, l\'architecture gothique et la culture européenne diversifiée.'
    },
    cuisine: {
      ar: ['الشوكولاتة البلجيكية', 'الوافل البلجيكي', 'البطاطس المقلية', 'البيرة البلجيكية'],
      en: ['Belgian chocolate', 'Belgian waffle', 'French fries', 'Belgian beer'],
      fr: ['Chocolat belge', 'Gaufre belge', 'Frites', 'Bière belge']
    },
    transportation: {
      ar: ['مترو بروكسل', 'الترام', 'تأجير السيارات'],
      en: ['Brussels Metro', 'Tram', 'Car rental'],
      fr: ['Métro de Bruxelles', 'Tramway', 'Location de voitures']
    },
    safety: {
      ar: 'بلجيكا دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Belgium is a safe country for tourism with good infrastructure.',
      fr: 'La Belgique est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'brussels',
        name: { ar: 'بروكسل', en: 'Brussels', fr: 'Bruxelles' },
        description: {
          ar: 'عاصمة بلجيكا وأوروبا، مدينة الفنون والثقافة الأوروبية.',
          en: 'Capital of Belgium and Europe, city of arts and European culture.',
          fr: 'Capitale de la Belgique et de l\'Europe, ville des arts et de la culture européenne.'
        },
        image: 'https://images.pexels.com/photos/159213/pexels-photo-159213.jpeg',
        attractions: {
          ar: ['ساحة جراند بلاس', 'تمثال مانيكين بيس', 'كاتدرائية بروكسل', 'متحف الفنون الجميلة'],
          en: ['Grand Place square', 'Manneken Pis statue', 'Brussels Cathedral', 'Fine Arts Museum'],
          fr: ['Place Grand Place', 'Statue Manneken Pis', 'Cathédrale de Bruxelles', 'Musée des Beaux-Arts']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 4200,
        highlights: { ar: ['العمارة القوطية', 'الشوكولاتة'], en: ['Gothic architecture', 'Chocolate'], fr: ['Architecture gothique', 'Chocolat'] },
        gallery: ['https://images.pexels.com/photos/159213/pexels-photo-159213.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/159213/pexels-photo-159213.jpeg']
  },

  switzerland: {
    id: 'switzerland',
    name: { ar: 'سويسرا', en: 'Switzerland', fr: 'Suisse' },
    capital: { ar: 'برن', en: 'Bern', fr: 'Berne' },
    description: {
      ar: 'سويسرا، أرض الجبال الشاهقة والبحيرات الصافية، حيث الطبيعة الخلابة تلتقي بالرفاهية والجودة.',
      en: 'Switzerland, land of towering mountains and crystal-clear lakes, where stunning nature meets luxury and quality.',
      fr: 'La Suisse, terre de montagnes imposantes et de lacs cristallins, où la nature époustouflante rencontre le luxe et la qualité.'
    },
    mainImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    flag: '🇨🇭',
    currency: { ar: 'الفرنك السويسري (CHF)', en: 'Swiss Franc (CHF)', fr: 'Franc suisse (CHF)' },
    language: { ar: 'الألمانية، الفرنسية، الإيطالية', en: 'German, French, Italian', fr: 'Allemand, Français, Italien' },
    timeZone: 'GMT+1',
    climate: { ar: 'جبلي معتدل', en: 'Mountain temperate', fr: 'Tempéré montagnard' },
    bestTime: { ar: 'يونيو - سبتمبر', en: 'June - September', fr: 'Juin - Septembre' },
    visaRequired: false,
    rating: 4.9,
    totalReviews: 9800,
    totalTours: 65,
    totalHotels: 1100,
    highlights: {
      ar: ['جبال الألب', 'بحيرة جنيف', 'ماترهورن', 'قصر شيلون'],
      en: ['Alps mountains', 'Lake Geneva', 'Matterhorn', 'Chillon Castle'],
      fr: ['Montagnes des Alpes', 'Lac de Genève', 'Matterhorn', 'Château de Chillon']
    },
    culture: {
      ar: 'سويسرا موطن للجودة والرفاهية والطبيعة الخلابة والثقافة المتنوعة.',
      en: 'Switzerland is home to quality, luxury, stunning nature and diverse culture.',
      fr: 'La Suisse abrite la qualité, le luxe, la nature époustouflante et la culture diversifiée.'
    },
    cuisine: {
      ar: ['الشوكولاتة السويسرية', 'الفوندو', 'الراكليت', 'النقانق السويسرية'],
      en: ['Swiss chocolate', 'Fondue', 'Raclette', 'Swiss sausages'],
      fr: ['Chocolat suisse', 'Fondue', 'Raclette', 'Saucisses suisses']
    },
    transportation: {
      ar: ['قطار الجبال السويسري', 'الترام', 'تأجير السيارات'],
      en: ['Swiss mountain train', 'Tram', 'Car rental'],
      fr: ['Train de montagne suisse', 'Tramway', 'Location de voitures']
    },
    safety: {
      ar: 'سويسرا من أأمن دول العالم مع معدلات جريمة منخفضة جداً.',
      en: 'Switzerland is one of the world\'s safest countries with very low crime rates.',
      fr: 'La Suisse est l\'un des pays les plus sûrs au monde avec des taux de criminalité très bas.'
    },
    cities: [
      {
        id: 'zurich',
        name: { ar: 'زيورخ', en: 'Zurich', fr: 'Zurich' },
        description: {
          ar: 'أكبر مدينة في سويسرا، مركز مالي وثقافي مهم.',
          en: 'Largest city in Switzerland, important financial and cultural center.',
          fr: 'Plus grande ville de Suisse, important centre financier et culturel.'
        },
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
        attractions: {
          ar: ['بحيرة زيورخ', 'البلدة القديمة', 'متحف الفنون', 'جبل أوتليبرغ'],
          en: ['Lake Zurich', 'Old Town', 'Art Museum', 'Uetliberg Mountain'],
          fr: ['Lac de Zurich', 'Vieille ville', 'Musée d\'art', 'Mont Uetliberg']
        },
        bestTime: { ar: 'يونيو - سبتمبر', en: 'June - September', fr: 'Juin - Septembre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.8,
        reviews: 7200,
        highlights: { ar: ['الطبيعة', 'الجودة'], en: ['Nature', 'Quality'], fr: ['Nature', 'Qualité'] },
        gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
  },

  austria: {
    id: 'austria',
    name: { ar: 'النمسا', en: 'Austria', fr: 'Autriche' },
    capital: { ar: 'فيينا', en: 'Vienna', fr: 'Vienne' },
    description: {
      ar: 'النمسا، أرض الموسيقى الكلاسيكية والجبال الشاهقة، حيث الثقافة الفنية العريقة تلتقي بالطبيعة الخلابة.',
      en: 'Austria, land of classical music and towering mountains, where rich artistic culture meets stunning nature.',
      fr: 'L\'Autriche, terre de musique classique et de montagnes imposantes, où la riche culture artistique rencontre la nature époustouflante.'
    },
    mainImage: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
    flag: '🇦🇹',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الألمانية', en: 'German', fr: 'Allemand' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل جبلي', en: 'Mountain temperate', fr: 'Tempéré montagnard' },
    bestTime: { ar: 'مايو - أكتوبر', en: 'May - October', fr: 'Mai - Octobre' },
    visaRequired: false,
    rating: 4.7,
    totalReviews: 7200,
    totalTours: 55,
    totalHotels: 880,
    highlights: {
      ar: ['قصر شونبرون', 'سالزبورغ', 'جبال الألب النمساوية', 'متحف الفنون'],
      en: ['Schönbrunn Palace', 'Salzburg', 'Austrian Alps', 'Art Museum'],
      fr: ['Palais de Schönbrunn', 'Salzbourg', 'Alpes autrichiennes', 'Musée d\'art']
    },
    culture: {
      ar: 'النمسا موطن للموسيقى الكلاسيكية والفنون والثقافة الأوروبية العريقة.',
      en: 'Austria is home to classical music, arts and rich European culture.',
      fr: 'L\'Autriche abrite la musique classique, les arts et la riche culture européenne.'
    },
    cuisine: {
      ar: ['السنتشل', 'الفيينا شنيتزل', 'الكعك النمساوي', 'القهوة النمساوية'],
      en: ['Schnitzel', 'Wiener Schnitzel', 'Austrian cake', 'Austrian coffee'],
      fr: ['Schnitzel', 'Wiener Schnitzel', 'Gâteau autrichien', 'Café autrichien']
    },
    transportation: {
      ar: ['مترو فيينا', 'الترام', 'تأجير السيارات'],
      en: ['Vienna Metro', 'Tram', 'Car rental'],
      fr: ['Métro de Vienne', 'Tramway', 'Location de voitures']
    },
    safety: {
      ar: 'النمسا دولة آمنة جداً للسياحة مع بنية تحتية ممتازة.',
      en: 'Austria is a very safe country for tourism with excellent infrastructure.',
      fr: 'L\'Autriche est un pays très sûr pour le tourisme avec une excellente infrastructure.'
    },
    cities: [
      {
        id: 'vienna',
        name: { ar: 'فيينا', en: 'Vienna', fr: 'Vienne' },
        description: {
          ar: 'عاصمة النمسا الجميلة، مدينة الموسيقى الكلاسيكية والفنون.',
          en: 'Beautiful capital of Austria, city of classical music and arts.',
          fr: 'Belle capitale de l\'Autriche, ville de musique classique et d\'arts.'
        },
        image: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
        attractions: {
          ar: ['قصر شونبرون', 'دار الأوبرا', 'كاتدرائية سانت ستيفن', 'متحف الفنون'],
          en: ['Schönbrunn Palace', 'Opera House', 'St. Stephen\'s Cathedral', 'Art Museum'],
          fr: ['Palais de Schönbrunn', 'Opéra', 'Cathédrale Saint-Étienne', 'Musée d\'art']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.7,
        reviews: 5800,
        highlights: { ar: ['الموسيقى الكلاسيكية', 'الفنون'], en: ['Classical music', 'Arts'], fr: ['Musique classique', 'Arts'] },
        gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
  },

  uk: {
    id: 'uk',
    name: { ar: 'المملكة المتحدة', en: 'United Kingdom', fr: 'Royaume-Uni' },
    capital: { ar: 'لندن', en: 'London', fr: 'Londres' },
    description: {
      ar: 'المملكة المتحدة، أرض التاريخ العريق والثقافة الغنية، حيث التقاليد الملكية تلتقي بالحداثة.',
      en: 'United Kingdom, land of rich history and culture, where royal traditions meet modernity.',
      fr: 'Royaume-Uni, terre d\'histoire et de culture riches, où les traditions royales rencontrent la modernité.'
    },
    mainImage: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    flag: '🇬🇧',
    currency: { ar: 'الجنيه الإسترليني (GBP)', en: 'British Pound (GBP)', fr: 'Livre sterling (GBP)' },
    language: { ar: 'الإنجليزية', en: 'English', fr: 'Anglais' },
    timeZone: 'GMT+0',
    climate: { ar: 'معتدل بحري', en: 'Maritime temperate', fr: 'Tempéré maritime' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 11200,
    totalTours: 82,
    totalHotels: 1300,
    highlights: {
      ar: ['برج لندن', 'قصر باكنغهام', 'ستون هنج', 'إدنبرة'],
      en: ['Tower of London', 'Buckingham Palace', 'Stonehenge', 'Edinburgh'],
      fr: ['Tour de Londres', 'Palais de Buckingham', 'Stonehenge', 'Édimbourg']
    },
    culture: {
      ar: 'المملكة المتحدة موطن للتاريخ العريق والثقافة الغنية والتقاليد الملكية.',
      en: 'United Kingdom is home to rich history, culture and royal traditions.',
      fr: 'Le Royaume-Uni abrite une histoire riche, une culture et des traditions royales.'
    },
    cuisine: {
      ar: ['السمك والبطاطس', 'الإفطار الإنجليزي', 'شاي بعد الظهر', 'اللحم المشوي'],
      en: ['Fish and chips', 'English breakfast', 'Afternoon tea', 'Roast meat'],
      fr: ['Fish and chips', 'Petit-déjeuner anglais', 'Thé de l\'après-midi', 'Viande rôtie']
    },
    transportation: {
      ar: ['مترو لندن', 'الحافلات الحمراء', 'قطار الأنفاق'],
      en: ['London Metro', 'Red buses', 'Underground train'],
      fr: ['Métro de Londres', 'Bus rouges', 'Train souterrain']
    },
    safety: {
      ar: 'المملكة المتحدة دولة آمنة للسياحة مع بنية تحتية ممتازة.',
      en: 'United Kingdom is a safe country for tourism with excellent infrastructure.',
      fr: 'Le Royaume-Uni est un pays sûr pour le tourisme avec une excellente infrastructure.'
    },
    cities: [
      {
        id: 'london',
        name: { ar: 'لندن', en: 'London', fr: 'Londres' },
        description: {
          ar: 'عاصمة المملكة المتحدة، مدينة التاريخ والثقافة والحداثة.',
          en: 'Capital of United Kingdom, city of history, culture and modernity.',
          fr: 'Capitale du Royaume-Uni, ville d\'histoire, de culture et de modernité.'
        },
        image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
        attractions: {
          ar: ['برج لندن', 'قصر باكنغهام', 'جسر تاور', 'متحف بريطانيا'],
          en: ['Tower of London', 'Buckingham Palace', 'Tower Bridge', 'British Museum'],
          fr: ['Tour de Londres', 'Palais de Buckingham', 'Pont de la Tour', 'Musée britannique']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '4-5 أيام', en: '4-5 days', fr: '4-5 jours' },
        rating: 4.6,
        reviews: 9800,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg']
  },

  ireland: {
    id: 'ireland',
    name: { ar: 'أيرلندا', en: 'Ireland', fr: 'Irlande' },
    capital: { ar: 'دبلن', en: 'Dublin', fr: 'Dublin' },
    description: {
      ar: 'أيرلندا، أرض الخضرة والقلاع القديمة، حيث الطبيعة الخلابة تلتقي بالثقافة الغنية والتاريخ العريق.',
      en: 'Ireland, land of greenery and ancient castles, where stunning nature meets rich culture and history.',
      fr: 'L\'Irlande, terre de verdure et de châteaux anciens, où la nature époustouflante rencontre la culture riche et l\'histoire.'
    },
    mainImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
    flag: '🇮🇪',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الإنجليزية، الأيرلندية', en: 'English, Irish', fr: 'Anglais, Irlandais' },
    timeZone: 'GMT+0',
    climate: { ar: 'معتدل بحري', en: 'Maritime temperate', fr: 'Tempéré maritime' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 5800,
    totalTours: 45,
    totalHotels: 650,
    highlights: {
      ar: ['قلعة بلارني', 'منحدرات موهير', 'دبلن', 'المناظر الطبيعية الخضراء'],
      en: ['Blarney Castle', 'Cliffs of Moher', 'Dublin', 'Green landscapes'],
      fr: ['Château de Blarney', 'Falaises de Moher', 'Dublin', 'Paysages verts']
    },
    culture: {
      ar: 'أيرلندا موطن للثقافة الغنية والموسيقى التقليدية والتاريخ العريق.',
      en: 'Ireland is home to rich culture, traditional music and history.',
      fr: 'L\'Irlande abrite une culture riche, une musique traditionnelle et une histoire.'
    },
    cuisine: {
      ar: ['اللحم الأيرلندي', 'البطاطس الأيرلندية', 'الخبز الأيرلندي', 'البيرة الأيرلندية'],
      en: ['Irish meat', 'Irish potatoes', 'Irish bread', 'Irish beer'],
      fr: ['Viande irlandaise', 'Pommes de terre irlandaises', 'Pain irlandais', 'Bière irlandaise']
    },
    transportation: {
      ar: ['مترو دبلن', 'الحافلات', 'تأجير السيارات'],
      en: ['Dublin Metro', 'Buses', 'Car rental'],
      fr: ['Métro de Dublin', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'أيرلندا دولة آمنة للسياحة مع شعب ودود ومضياف.',
      en: 'Ireland is a safe country for tourism with friendly and hospitable people.',
      fr: 'L\'Irlande est un pays sûr pour le tourisme avec un peuple amical et hospitalier.'
    },
    cities: [
      {
        id: 'dublin',
        name: { ar: 'دبلن', en: 'Dublin', fr: 'Dublin' },
        description: {
          ar: 'عاصمة أيرلندا الجميلة، مدينة الأدب والثقافة والموسيقى.',
          en: 'Beautiful capital of Ireland, city of literature, culture and music.',
          fr: 'Belle capitale de l\'Irlande, ville de littérature, de culture et de musique.'
        },
        image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
        attractions: {
          ar: ['قلعة دبلن', 'كاتدرائية سانت باتريك', 'متحف غينيس', 'حديقة فينيكس'],
          en: ['Dublin Castle', 'St. Patrick\'s Cathedral', 'Guinness Museum', 'Phoenix Park'],
          fr: ['Château de Dublin', 'Cathédrale Saint-Patrick', 'Musée Guinness', 'Parc Phoenix']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.6,
        reviews: 4800,
        highlights: { ar: ['الثقافة', 'الموسيقى'], en: ['Culture', 'Music'], fr: ['Culture', 'Musique'] },
        gallery: ['https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg']
  },

  poland: {
    id: 'poland',
    name: { ar: 'بولندا', en: 'Poland', fr: 'Pologne' },
    capital: { ar: 'وارسو', en: 'Warsaw', fr: 'Varsovie' },
    description: {
      ar: 'بولندا، أرض التاريخ العريق والثقافة الغنية، حيث المدن القديمة الجميلة تلتقي بالتراث الأوروبي.',
      en: 'Poland, land of rich history and culture, where beautiful old cities meet European heritage.',
      fr: 'La Pologne, terre d\'histoire et de culture riches, où les belles villes anciennes rencontrent le patrimoine européen.'
    },
    mainImage: 'https://images.pexels.com/photos/159306/construction-site-buildings-construction-work-159306.jpeg',
    flag: '🇵🇱',
    currency: { ar: 'الزلوتي البولندي (PLN)', en: 'Polish Zloty (PLN)', fr: 'Zloty polonais (PLN)' },
    language: { ar: 'البولندية', en: 'Polish', fr: 'Polonais' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.5,
    totalReviews: 6400,
    totalTours: 48,
    totalHotels: 780,
    highlights: {
      ar: ['كراكوف', 'وارسو القديمة', 'معسكر أوشفيتز', 'جبال تاترا'],
      en: ['Krakow', 'Old Warsaw', 'Auschwitz camp', 'Tatra Mountains'],
      fr: ['Cracovie', 'Vieille Varsovie', 'Camp d\'Auschwitz', 'Montagnes Tatras']
    },
    culture: {
      ar: 'بولندا موطن للتاريخ العريق والثقافة الغنية والتراث الأوروبي.',
      en: 'Poland is home to rich history, culture and European heritage.',
      fr: 'La Pologne abrite une histoire riche, une culture et un patrimoine européen.'
    },
    cuisine: {
      ar: ['البيروجي', 'الكباب البولندي', 'الشوربة البولندية', 'الكعك البولندي'],
      en: ['Pierogi', 'Polish kebab', 'Polish soup', 'Polish cake'],
      fr: ['Pierogi', 'Kebab polonais', 'Soupe polonaise', 'Gâteau polonais']
    },
    transportation: {
      ar: ['مترو وارسو', 'الحافلات', 'تأجير السيارات'],
      en: ['Warsaw Metro', 'Buses', 'Car rental'],
      fr: ['Métro de Varsovie', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'بولندا دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Poland is a safe country for tourism with good infrastructure.',
      fr: 'La Pologne est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'warsaw',
        name: { ar: 'وارسو', en: 'Warsaw', fr: 'Varsovie' },
        description: {
          ar: 'عاصمة بولندا، مدينة التاريخ والثقافة والحداثة.',
          en: 'Capital of Poland, city of history, culture and modernity.',
          fr: 'Capitale de la Pologne, ville d\'histoire, de culture et de modernité.'
        },
        image: 'https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg',
        attractions: {
          ar: ['البلدة القديمة', 'قصر الثقافة', 'متحف وارسو', 'حديقة لازينكي'],
          en: ['Old Town', 'Palace of Culture', 'Warsaw Museum', 'Łazienki Park'],
          fr: ['Vieille ville', 'Palais de la Culture', 'Musée de Varsovie', 'Parc Łazienki']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.5,
        reviews: 5200,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg']
  },

  czech: {
    id: 'czech',
    name: { ar: 'جمهورية التشيك', en: 'Czech Republic', fr: 'République tchèque' },
    capital: { ar: 'براغ', en: 'Prague', fr: 'Prague' },
    description: {
      ar: 'جمهورية التشيك، أرض القلاع الخيالية والجسور الجميلة، حيث العمارة القوطية تلتقي بالثقافة الأوروبية.',
      en: 'Czech Republic, land of fairy-tale castles and beautiful bridges, where Gothic architecture meets European culture.',
      fr: 'République tchèque, terre des châteaux de conte de fées et des beaux ponts, où l\'architecture gothique rencontre la culture européenne.'
    },
    mainImage: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
    flag: '🇨🇿',
    currency: { ar: 'الكرونة التشيكية (CZK)', en: 'Czech Koruna (CZK)', fr: 'Couronne tchèque (CZK)' },
    language: { ar: 'التشيكية', en: 'Czech', fr: 'Tchèque' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 7200,
    totalTours: 55,
    totalHotels: 850,
    highlights: {
      ar: ['قلعة براغ', 'جسر تشارلز', 'الساعة الفلكية', 'كارلوفي فاري'],
      en: ['Prague Castle', 'Charles Bridge', 'Astronomical Clock', 'Karlovy Vary'],
      fr: ['Château de Prague', 'Pont Charles', 'Horloge astronomique', 'Karlovy Vary']
    },
    culture: {
      ar: 'جمهورية التشيك موطن للعمارة القوطية الجميلة والثقافة الأوروبية الغنية.',
      en: 'Czech Republic is home to beautiful Gothic architecture and rich European culture.',
      fr: 'La République tchèque abrite une belle architecture gothique et une riche culture européenne.'
    },
    cuisine: {
      ar: ['الخبز التشيكي', 'النقانق التشيكية', 'البيرة التشيكية', 'الكعك التشيكي'],
      en: ['Czech bread', 'Czech sausages', 'Czech beer', 'Czech cake'],
      fr: ['Pain tchèque', 'Saucisses tchèques', 'Bière tchèque', 'Gâteau tchèque']
    },
    transportation: {
      ar: ['مترو براغ', 'الترام', 'تأجير السيارات'],
      en: ['Prague Metro', 'Tram', 'Car rental'],
      fr: ['Métro de Prague', 'Tramway', 'Location de voitures']
    },
    safety: {
      ar: 'جمهورية التشيك دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Czech Republic is a safe country for tourism with good infrastructure.',
      fr: 'La République tchèque est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'prague',
        name: { ar: 'براغ', en: 'Prague', fr: 'Prague' },
        description: {
          ar: 'عاصمة جمهورية التشيك الجميلة، مدينة الجسور والقلاع والعمارة القوطية.',
          en: 'Beautiful capital of Czech Republic, city of bridges, castles and Gothic architecture.',
          fr: 'Belle capitale de la République tchèque, ville de ponts, de châteaux et d\'architecture gothique.'
        },
        image: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
        attractions: {
          ar: ['قلعة براغ', 'جسر تشارلز', 'الساعة الفلكية', 'البلدة القديمة'],
          en: ['Prague Castle', 'Charles Bridge', 'Astronomical Clock', 'Old Town'],
          fr: ['Château de Prague', 'Pont Charles', 'Horloge astronomique', 'Vieille ville']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.6,
        reviews: 6000,
        highlights: { ar: ['العمارة القوطية', 'الجسور'], en: ['Gothic architecture', 'Bridges'], fr: ['Architecture gothique', 'Ponts'] },
        gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
  },

  hungary: {
    id: 'hungary',
    name: { ar: 'المجر', en: 'Hungary', fr: 'Hongrie' },
    capital: { ar: 'بودابست', en: 'Budapest', fr: 'Budapest' },
    description: {
      ar: 'المجر، أرض الحمامات الحرارية والجسور الجميلة، حيث الثقافة الأوروبية تلتقي بالتراث التاريخي.',
      en: 'Hungary, land of thermal baths and beautiful bridges, where European culture meets historical heritage.',
      fr: 'La Hongrie, terre des bains thermaux et des beaux ponts, où la culture européenne rencontre le patrimoine historique.'
    },
    mainImage: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
    flag: '🇭🇺',
    currency: { ar: 'الفورنت المجري (HUF)', en: 'Hungarian Forint (HUF)', fr: 'Forint hongrois (HUF)' },
    language: { ar: 'المجرية', en: 'Hungarian', fr: 'Hongrois' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
    visaRequired: false,
    rating: 4.5,
    totalReviews: 5800,
    totalTours: 42,
    totalHotels: 720,
    highlights: {
      ar: ['حمامات بودابست', 'جسر السلسلة', 'قلعة بودا', 'البرلمان المجري'],
      en: ['Budapest baths', 'Chain Bridge', 'Buda Castle', 'Hungarian Parliament'],
      fr: ['Bains de Budapest', 'Pont des Chaînes', 'Château de Buda', 'Parlement hongrois']
    },
    culture: {
      ar: 'المجر موطن للثقافة الأوروبية الغنية والتراث التاريخي العريق.',
      en: 'Hungary is home to rich European culture and historical heritage.',
      fr: 'La Hongrie abrite une riche culture européenne et un patrimoine historique.'
    },
    cuisine: {
      ar: ['الغولاش', 'لانجوس', 'الكعك المجري', 'النبيذ المجري'],
      en: ['Goulash', 'Langos', 'Hungarian cake', 'Hungarian wine'],
      fr: ['Goulash', 'Langos', 'Gâteau hongrois', 'Vin hongrois']
    },
    transportation: {
      ar: ['مترو بودابست', 'الترام', 'تأجير السيارات'],
      en: ['Budapest Metro', 'Tram', 'Car rental'],
      fr: ['Métro de Budapest', 'Tramway', 'Location de voitures']
    },
    safety: {
      ar: 'المجر دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Hungary is a safe country for tourism with good infrastructure.',
      fr: 'La Hongrie est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'budapest',
        name: { ar: 'بودابست', en: 'Budapest', fr: 'Budapest' },
        description: {
          ar: 'عاصمة المجر الجميلة، مدينة الحمامات الحرارية والجسور الجميلة.',
          en: 'Beautiful capital of Hungary, city of thermal baths and beautiful bridges.',
          fr: 'Belle capitale de la Hongrie, ville des bains thermaux et des beaux ponts.'
        },
        image: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
        attractions: {
          ar: ['حمامات بودابست', 'جسر السلسلة', 'قلعة بودا', 'البرلمان المجري'],
          en: ['Budapest baths', 'Chain Bridge', 'Buda Castle', 'Hungarian Parliament'],
          fr: ['Bains de Budapest', 'Pont des Chaînes', 'Château de Buda', 'Parlement hongrois']
        },
        bestTime: { ar: 'أبريل - أكتوبر', en: 'April - October', fr: 'Avril - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.5,
        reviews: 4800,
        highlights: { ar: ['الحمامات الحرارية', 'الجسور'], en: ['Thermal baths', 'Bridges'], fr: ['Bains thermaux', 'Ponts'] },
        gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
  },

  romania: {
    id: 'romania',
    name: { ar: 'رومانيا', en: 'Romania', fr: 'Roumanie' },
    capital: { ar: 'بوخارست', en: 'Bucharest', fr: 'Bucarest' },
    description: {
      ar: 'رومانيا، أرض القلاع الخيالية والجبال الشاهقة، حيث التاريخ العريق يلتقي بالطبيعة الخلابة.',
      en: 'Romania, land of fairy-tale castles and towering mountains, where rich history meets stunning nature.',
      fr: 'La Roumanie, terre des châteaux de conte de fées et des montagnes imposantes, où l\'histoire riche rencontre la nature époustouflante.'
    },
    mainImage: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
    flag: '🇷🇴',
    currency: { ar: 'الليو الروماني (RON)', en: 'Romanian Leu (RON)', fr: 'Leu roumain (RON)' },
    language: { ar: 'الرومانية', en: 'Romanian', fr: 'Roumain' },
    timeZone: 'GMT+2',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.4,
    totalReviews: 5200,
    totalTours: 38,
    totalHotels: 680,
    highlights: {
      ar: ['قلعة دراكولا', 'ترانسيلفانيا', 'جبال الكاربات', 'بوخارست'],
      en: ['Dracula Castle', 'Transylvania', 'Carpathian Mountains', 'Bucharest'],
      fr: ['Château de Dracula', 'Transylvanie', 'Montagnes des Carpates', 'Bucarest']
    },
    culture: {
      ar: 'رومانيا موطن للتاريخ العريق والثقافة الأوروبية والتراث الغني.',
      en: 'Romania is home to rich history, European culture and heritage.',
      fr: 'La Roumanie abrite une histoire riche, une culture européenne et un patrimoine.'
    },
    cuisine: {
      ar: ['السارميل', 'الماماليجا', 'الكعك الروماني', 'النبيذ الروماني'],
      en: ['Sarmale', 'Mamaliga', 'Romanian cake', 'Romanian wine'],
      fr: ['Sarmale', 'Mamaliga', 'Gâteau roumain', 'Vin roumain']
    },
    transportation: {
      ar: ['مترو بوخارست', 'الحافلات', 'تأجير السيارات'],
      en: ['Bucharest Metro', 'Buses', 'Car rental'],
      fr: ['Métro de Bucarest', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'رومانيا دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Romania is a safe country for tourism with good infrastructure.',
      fr: 'La Roumanie est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'bucharest',
        name: { ar: 'بوخارست', en: 'Bucharest', fr: 'Bucarest' },
        description: {
          ar: 'عاصمة رومانيا، مدينة التاريخ والثقافة والحداثة.',
          en: 'Capital of Romania, city of history, culture and modernity.',
          fr: 'Capitale de la Roumanie, ville d\'histoire, de culture et de modernité.'
        },
        image: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
        attractions: {
          ar: ['قصر البرلمان', 'البلدة القديمة', 'متحف رومانيا', 'حديقة هيراستراو'],
          en: ['Parliament Palace', 'Old Town', 'Romania Museum', 'Herăstrău Park'],
          fr: ['Palais du Parlement', 'Vieille ville', 'Musée de la Roumanie', 'Parc Herăstrău']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.4,
        reviews: 4200,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
  },

  bulgaria: {
    id: 'bulgaria',
    name: { ar: 'بلغاريا', en: 'Bulgaria', fr: 'Bulgarie' },
    capital: { ar: 'صوفيا', en: 'Sofia', fr: 'Sofia' },
    description: {
      ar: 'بلغاريا، أرض الجبال الشاهقة والشواطئ الذهبية، حيث الطبيعة الخلابة تلتقي بالتراث التاريخي.',
      en: 'Bulgaria, land of towering mountains and golden beaches, where stunning nature meets historical heritage.',
      fr: 'La Bulgarie, terre de montagnes imposantes et de plages dorées, où la nature époustouflante rencontre le patrimoine historique.'
    },
    mainImage: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
    flag: '🇧🇬',
    currency: { ar: 'الليف البلغاري (BGN)', en: 'Bulgarian Lev (BGN)', fr: 'Lev bulgare (BGN)' },
    language: { ar: 'البلغارية', en: 'Bulgarian', fr: 'Bulgare' },
    timeZone: 'GMT+2',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.3,
    totalReviews: 4800,
    totalTours: 35,
    totalHotels: 620,
    highlights: {
      ar: ['صوفيا', 'شواطئ البحر الأسود', 'جبال ريلا', 'بلوفديف'],
      en: ['Sofia', 'Black Sea beaches', 'Rila Mountains', 'Plovdiv'],
      fr: ['Sofia', 'Plages de la mer Noire', 'Montagnes de Rila', 'Plovdiv']
    },
    culture: {
      ar: 'بلغاريا موطن للتراث التاريخي الغني والثقافة الأوروبية.',
      en: 'Bulgaria is home to rich historical heritage and European culture.',
      fr: 'La Bulgarie abrite un riche patrimoine historique et une culture européenne.'
    },
    cuisine: {
      ar: ['البانيتسا', 'الكباب البلغاري', 'الجبن البلغاري', 'السلطة البلغارية'],
      en: ['Banitsa', 'Bulgarian kebab', 'Bulgarian cheese', 'Bulgarian salad'],
      fr: ['Banitsa', 'Kebab bulgare', 'Fromage bulgare', 'Salade bulgare']
    },
    transportation: {
      ar: ['مترو صوفيا', 'الحافلات', 'تأجير السيارات'],
      en: ['Sofia Metro', 'Buses', 'Car rental'],
      fr: ['Métro de Sofia', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'بلغاريا دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Bulgaria is a safe country for tourism with good infrastructure.',
      fr: 'La Bulgarie est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'sofia',
        name: { ar: 'صوفيا', en: 'Sofia', fr: 'Sofia' },
        description: {
          ar: 'عاصمة بلغاريا، مدينة التاريخ والثقافة.',
          en: 'Capital of Bulgaria, city of history and culture.',
          fr: 'Capitale de la Bulgarie, ville d\'histoire et de culture.'
        },
        image: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
        attractions: {
          ar: ['كاتدرائية ألكسندر نيفسكي', 'البلدة القديمة', 'متحف بلغاريا', 'حديقة بوريسوفا'],
          en: ['Alexander Nevsky Cathedral', 'Old Town', 'Bulgaria Museum', 'Borisova Garden'],
          fr: ['Cathédrale Alexandre Nevski', 'Vieille ville', 'Musée de la Bulgarie', 'Jardin Borisova']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.3,
        reviews: 3800,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
  },

  croatia: {
    id: 'croatia',
    name: { ar: 'كرواتيا', en: 'Croatia', fr: 'Croatie' },
    capital: { ar: 'زغرب', en: 'Zagreb', fr: 'Zagreb' },
    description: {
      ar: 'كرواتيا، أرض الشواطئ الذهبية والجزر الساحرة، حيث البحر الأدرياتيكي الجميل يلتقي بالتراث التاريخي.',
      en: 'Croatia, land of golden beaches and enchanting islands, where the beautiful Adriatic Sea meets historical heritage.',
      fr: 'La Croatie, terre de plages dorées et d\'îles enchanteresses, où la belle mer Adriatique rencontre le patrimoine historique.'
    },
    mainImage: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
    flag: '🇭🇷',
    currency: { ar: 'الكونا الكرواتية (HRK)', en: 'Croatian Kuna (HRK)', fr: 'Kuna croate (HRK)' },
    language: { ar: 'الكرواتية', en: 'Croatian', fr: 'Croate' },
    timeZone: 'GMT+1',
    climate: { ar: 'متوسطي', en: 'Mediterranean', fr: 'Méditerranéen' },
    bestTime: { ar: 'مايو - أكتوبر', en: 'May - October', fr: 'Mai - Octobre' },
    visaRequired: false,
    rating: 4.7,
    totalReviews: 8200,
    totalTours: 62,
    totalHotels: 920,
    highlights: {
      ar: ['دوبروفنيك', 'شواطئ دالماتيا', 'حديقة بليتفيتش', 'زغرب'],
      en: ['Dubrovnik', 'Dalmatian beaches', 'Plitvice Park', 'Zagreb'],
      fr: ['Dubrovnik', 'Plages de Dalmatie', 'Parc de Plitvice', 'Zagreb']
    },
    culture: {
      ar: 'كرواتيا موطن للشواطئ الجميلة والجزر الساحرة والتراث التاريخي.',
      en: 'Croatia is home to beautiful beaches, enchanting islands and historical heritage.',
      fr: 'La Croatie abrite de belles plages, des îles enchanteresses et un patrimoine historique.'
    },
    cuisine: {
      ar: ['الباستا الكرواتية', 'السمك المشوي', 'الجبن الكرواتي', 'النبيذ الكرواتي'],
      en: ['Croatian pasta', 'Grilled fish', 'Croatian cheese', 'Croatian wine'],
      fr: ['Pâtes croates', 'Poisson grillé', 'Fromage croate', 'Vin croate']
    },
    transportation: {
      ar: ['العبارات بين الجزر', 'الحافلات', 'تأجير السيارات'],
      en: ['Ferries between islands', 'Buses', 'Car rental'],
      fr: ['Ferries entre les îles', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'كرواتيا دولة آمنة للسياحة مع شواطئ جميلة وطبيعة خلابة.',
      en: 'Croatia is a safe country for tourism with beautiful beaches and stunning nature.',
      fr: 'La Croatie est un pays sûr pour le tourisme avec de belles plages et une nature époustouflante.'
    },
    cities: [
      {
        id: 'dubrovnik',
        name: { ar: 'دوبروفنيك', en: 'Dubrovnik', fr: 'Dubrovnik' },
        description: {
          ar: 'لؤلؤة البحر الأدرياتيكي، مدينة الجدران القديمة والشواطئ الجميلة.',
          en: 'Pearl of the Adriatic, city of ancient walls and beautiful beaches.',
          fr: 'Perle de l\'Adriatique, ville des murs anciens et des belles plages.'
        },
        image: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
        attractions: {
          ar: ['الجدران القديمة', 'البلدة القديمة', 'شاطئ بانج', 'دير الدومينيكان'],
          en: ['Ancient walls', 'Old Town', 'Banje Beach', 'Dominican Monastery'],
          fr: ['Murs anciens', 'Vieille ville', 'Plage de Banje', 'Monastère dominicain']
        },
        bestTime: { ar: 'مايو - أكتوبر', en: 'May - October', fr: 'Mai - Octobre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.8,
        reviews: 6800,
        highlights: { ar: ['الشواطئ', 'التاريخ'], en: ['Beaches', 'History'], fr: ['Plages', 'Histoire'] },
        gallery: ['https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg']
  },

  norway: {
    id: 'norway',
    name: { ar: 'النرويج', en: 'Norway', fr: 'Norvège' },
    capital: { ar: 'أوسلو', en: 'Oslo', fr: 'Oslo' },
    description: {
      ar: 'النرويج، أرض الفيوردات والشفق القطبي، حيث الطبيعة الخلابة تلتقي بالرفاهية والجودة.',
      en: 'Norway, land of fjords and Northern Lights, where stunning nature meets luxury and quality.',
      fr: 'La Norvège, terre des fjords et des aurores boréales, où la nature époustouflante rencontre le luxe et la qualité.'
    },
    mainImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    flag: '🇳🇴',
    currency: { ar: 'الكرونة النرويجية (NOK)', en: 'Norwegian Krone (NOK)', fr: 'Couronne norvégienne (NOK)' },
    language: { ar: 'النرويجية', en: 'Norwegian', fr: 'Norvégien' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل بحري', en: 'Maritime temperate', fr: 'Tempéré maritime' },
    bestTime: { ar: 'يونيو - أغسطس', en: 'June - August', fr: 'Juin - Août' },
    visaRequired: false,
    rating: 4.8,
    totalReviews: 7600,
    totalTours: 58,
    totalHotels: 950,
    highlights: {
      ar: ['الفيوردات النرويجية', 'الشفق القطبي', 'أوسلو', 'برغن'],
      en: ['Norwegian fjords', 'Northern Lights', 'Oslo', 'Bergen'],
      fr: ['Fjords norvégiens', 'Aurores boréales', 'Oslo', 'Bergen']
    },
    culture: {
      ar: 'النرويج موطن للطبيعة الخلابة والرفاهية والجودة العالية.',
      en: 'Norway is home to stunning nature, luxury and high quality.',
      fr: 'La Norvège abrite une nature époustouflante, le luxe et une qualité élevée.'
    },
    cuisine: {
      ar: ['السلمون النرويجي', 'اللحم النرويجي', 'الجبن النرويجي', 'الخبز النرويجي'],
      en: ['Norwegian salmon', 'Norwegian meat', 'Norwegian cheese', 'Norwegian bread'],
      fr: ['Saumon norvégien', 'Viande norvégienne', 'Fromage norvégien', 'Pain norvégien']
    },
    transportation: {
      ar: ['قطار النرويج', 'العبارات', 'تأجير السيارات'],
      en: ['Norway train', 'Ferries', 'Car rental'],
      fr: ['Train de Norvège', 'Ferries', 'Location de voitures']
    },
    safety: {
      ar: 'النرويج من أأمن دول العالم مع معدلات جريمة منخفضة جداً.',
      en: 'Norway is one of the world\'s safest countries with very low crime rates.',
      fr: 'La Norvège est l\'un des pays les plus sûrs au monde avec des taux de criminalité très bas.'
    },
    cities: [
      {
        id: 'oslo',
        name: { ar: 'أوسلو', en: 'Oslo', fr: 'Oslo' },
        description: {
          ar: 'عاصمة النرويج الجميلة، مدينة الثقافة والطبيعة.',
          en: 'Beautiful capital of Norway, city of culture and nature.',
          fr: 'Belle capitale de la Norvège, ville de culture et de nature.'
        },
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
        attractions: {
          ar: ['متحف فايكنغ', 'قصر أوسلو', 'حديقة فيجلاند', 'متحف مونش'],
          en: ['Viking Museum', 'Oslo Palace', 'Vigeland Park', 'Munch Museum'],
          fr: ['Musée viking', 'Palais d\'Oslo', 'Parc Vigeland', 'Musée Munch']
        },
        bestTime: { ar: 'يونيو - أغسطس', en: 'June - August', fr: 'Juin - Août' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.8,
        reviews: 6200,
        highlights: { ar: ['الطبيعة', 'الثقافة'], en: ['Nature', 'Culture'], fr: ['Nature', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
  },

  sweden: {
    id: 'sweden',
    name: { ar: 'السويد', en: 'Sweden', fr: 'Suède' },
    capital: { ar: 'ستوكهولم', en: 'Stockholm', fr: 'Stockholm' },
    description: {
      ar: 'السويد، أرض الرفاهية والجودة، حيث الطبيعة الخلابة تلتقي بالثقافة الحديثة.',
      en: 'Sweden, land of luxury and quality, where stunning nature meets modern culture.',
      fr: 'La Suède, terre de luxe et de qualité, où la nature époustouflante rencontre la culture moderne.'
    },
    mainImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    flag: '🇸🇪',
    currency: { ar: 'الكرونة السويدية (SEK)', en: 'Swedish Krona (SEK)', fr: 'Couronne suédoise (SEK)' },
    language: { ar: 'السويدية', en: 'Swedish', fr: 'Suédois' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'يونيو - أغسطس', en: 'June - August', fr: 'Juin - Août' },
    visaRequired: false,
    rating: 4.7,
    totalReviews: 6800,
    totalTours: 52,
    totalHotels: 880,
    highlights: {
      ar: ['ستوكهولم', 'جوتلاند', 'الشفق القطبي', 'المناظر الطبيعية'],
      en: ['Stockholm', 'Gotland', 'Northern Lights', 'Natural landscapes'],
      fr: ['Stockholm', 'Gotland', 'Aurores boréales', 'Paysages naturels']
    },
    culture: {
      ar: 'السويد موطن للرفاهية والجودة والثقافة الحديثة.',
      en: 'Sweden is home to luxury, quality and modern culture.',
      fr: 'La Suède abrite le luxe, la qualité et la culture moderne.'
    },
    cuisine: {
      ar: ['اللحم السويدي', 'السمك السويدي', 'الكعك السويدي', 'القهوة السويدية'],
      en: ['Swedish meat', 'Swedish fish', 'Swedish cake', 'Swedish coffee'],
      fr: ['Viande suédoise', 'Poisson suédois', 'Gâteau suédois', 'Café suédois']
    },
    transportation: {
      ar: ['مترو ستوكهولم', 'الترام', 'تأجير السيارات'],
      en: ['Stockholm Metro', 'Tram', 'Car rental'],
      fr: ['Métro de Stockholm', 'Tramway', 'Location de voitures']
    },
    safety: {
      ar: 'السويد من أأمن دول العالم مع معدلات جريمة منخفضة جداً.',
      en: 'Sweden is one of the world\'s safest countries with very low crime rates.',
      fr: 'La Suède est l\'un des pays les plus sûrs au monde avec des taux de criminalité très bas.'
    },
    cities: [
      {
        id: 'stockholm',
        name: { ar: 'ستوكهولم', en: 'Stockholm', fr: 'Stockholm' },
        description: {
          ar: 'عاصمة السويد الجميلة، مدينة الجزر والثقافة الحديثة.',
          en: 'Beautiful capital of Sweden, city of islands and modern culture.',
          fr: 'Belle capitale de la Suède, ville d\'îles et de culture moderne.'
        },
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
        attractions: {
          ar: ['البلدة القديمة', 'قصر ستوكهولم', 'متحف فاسا', 'حديقة دجورجاردن'],
          en: ['Old Town', 'Stockholm Palace', 'Vasa Museum', 'Djurgården Park'],
          fr: ['Vieille ville', 'Palais de Stockholm', 'Musée Vasa', 'Parc Djurgården']
        },
        bestTime: { ar: 'يونيو - أغسطس', en: 'June - August', fr: 'Juin - Août' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.7,
        reviews: 5600,
        highlights: { ar: ['الجزر', 'الثقافة'], en: ['Islands', 'Culture'], fr: ['Îles', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
  },

  denmark: {
    id: 'denmark',
    name: { ar: 'الدنمارك', en: 'Denmark', fr: 'Danemark' },
    capital: { ar: 'كوبنهاغن', en: 'Copenhagen', fr: 'Copenhague' },
    description: {
      ar: 'الدنمارك، أرض السعادة والرفاهية، حيث الثقافة الحديثة تلتقي بالتاريخ العريق.',
      en: 'Denmark, land of happiness and luxury, where modern culture meets rich history.',
      fr: 'Le Danemark, terre du bonheur et du luxe, où la culture moderne rencontre l\'histoire riche.'
    },
    mainImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    flag: '🇩🇰',
    currency: { ar: 'الكرونة الدنماركية (DKK)', en: 'Danish Krone (DKK)', fr: 'Couronne danoise (DKK)' },
    language: { ar: 'الدنماركية', en: 'Danish', fr: 'Danois' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل بحري', en: 'Maritime temperate', fr: 'Tempéré maritime' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 6200,
    totalTours: 48,
    totalHotels: 820,
    highlights: {
      ar: ['تمثال الحورية الصغيرة', 'قصر أمالينبورغ', 'حديقة تيفولي', 'كوبنهاغن'],
      en: ['Little Mermaid statue', 'Amalienborg Palace', 'Tivoli Park', 'Copenhagen'],
      fr: ['Statue de la Petite Sirène', 'Palais d\'Amalienborg', 'Parc Tivoli', 'Copenhague']
    },
    culture: {
      ar: 'الدنمارك موطن للسعادة والرفاهية والثقافة الحديثة.',
      en: 'Denmark is home to happiness, luxury and modern culture.',
      fr: 'Le Danemark abrite le bonheur, le luxe et la culture moderne.'
    },
    cuisine: {
      ar: ['الساندويتش الدنماركي', 'الكعك الدنماركي', 'اللحم الدنماركي', 'الجبن الدنماركي'],
      en: ['Danish sandwich', 'Danish cake', 'Danish meat', 'Danish cheese'],
      fr: ['Sandwich danois', 'Gâteau danois', 'Viande danoise', 'Fromage danois']
    },
    transportation: {
      ar: ['مترو كوبنهاغن', 'الدراجات', 'تأجير السيارات'],
      en: ['Copenhagen Metro', 'Bicycles', 'Car rental'],
      fr: ['Métro de Copenhague', 'Vélos', 'Location de voitures']
    },
    safety: {
      ar: 'الدنمارك من أأمن دول العالم مع معدلات جريمة منخفضة جداً.',
      en: 'Denmark is one of the world\'s safest countries with very low crime rates.',
      fr: 'Le Danemark est l\'un des pays les plus sûrs au monde avec des taux de criminalité très bas.'
    },
    cities: [
      {
        id: 'copenhagen',
        name: { ar: 'كوبنهاغن', en: 'Copenhagen', fr: 'Copenhague' },
        description: {
          ar: 'عاصمة الدنمارك الجميلة، مدينة السعادة والثقافة الحديثة.',
          en: 'Beautiful capital of Denmark, city of happiness and modern culture.',
          fr: 'Belle capitale du Danemark, ville du bonheur et de la culture moderne.'
        },
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
        attractions: {
          ar: ['تمثال الحورية الصغيرة', 'قصر أمالينبورغ', 'حديقة تيفولي', 'البلدة القديمة'],
          en: ['Little Mermaid statue', 'Amalienborg Palace', 'Tivoli Park', 'Old Town'],
          fr: ['Statue de la Petite Sirène', 'Palais d\'Amalienborg', 'Parc Tivoli', 'Vieille ville']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.6,
        reviews: 5200,
        highlights: { ar: ['السعادة', 'الثقافة'], en: ['Happiness', 'Culture'], fr: ['Bonheur', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
  },

  finland: {
    id: 'finland',
    name: { ar: 'فنلندا', en: 'Finland', fr: 'Finlande' },
    capital: { ar: 'هلسنكي', en: 'Helsinki', fr: 'Helsinki' },
    description: {
      ar: 'فنلندا، أرض الآلاف من البحيرات والشفق القطبي، حيث الطبيعة الخلابة تلتقي بالثقافة الحديثة.',
      en: 'Finland, land of thousands of lakes and Northern Lights, where stunning nature meets modern culture.',
      fr: 'La Finlande, terre de milliers de lacs et d\'aurores boréales, où la nature époustouflante rencontre la culture moderne.'
    },
    mainImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    flag: '🇫🇮',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'الفنلندية', en: 'Finnish', fr: 'Finnois' },
    timeZone: 'GMT+2',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'يونيو - أغسطس', en: 'June - August', fr: 'Juin - Août' },
    visaRequired: false,
    rating: 4.6,
    totalReviews: 5800,
    totalTours: 45,
    totalHotels: 780,
    highlights: {
      ar: ['هلسنكي', 'الشفق القطبي', 'المنتجعات الشتوية', 'المناظر الطبيعية'],
      en: ['Helsinki', 'Northern Lights', 'Winter resorts', 'Natural landscapes'],
      fr: ['Helsinki', 'Aurores boréales', 'Stations de ski', 'Paysages naturels']
    },
    culture: {
      ar: 'فنلندا موطن للطبيعة الخلابة والثقافة الحديثة والجودة العالية.',
      en: 'Finland is home to stunning nature, modern culture and high quality.',
      fr: 'La Finlande abrite une nature époustouflante, une culture moderne et une qualité élevée.'
    },
    cuisine: {
      ar: ['اللحم الفنلندي', 'السمك الفنلندي', 'الجبن الفنلندي', 'الخبز الفنلندي'],
      en: ['Finnish meat', 'Finnish fish', 'Finnish cheese', 'Finnish bread'],
      fr: ['Viande finlandaise', 'Poisson finlandais', 'Fromage finlandais', 'Pain finlandais']
    },
    transportation: {
      ar: ['مترو هلسنكي', 'الحافلات', 'تأجير السيارات'],
      en: ['Helsinki Metro', 'Buses', 'Car rental'],
      fr: ['Métro d\'Helsinki', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'فنلندا من أأمن دول العالم مع معدلات جريمة منخفضة جداً.',
      en: 'Finland is one of the world\'s safest countries with very low crime rates.',
      fr: 'La Finlande est l\'un des pays les plus sûrs au monde avec des taux de criminalité très bas.'
    },
    cities: [
      {
        id: 'helsinki',
        name: { ar: 'هلسنكي', en: 'Helsinki', fr: 'Helsinki' },
        description: {
          ar: 'عاصمة فنلندا الجميلة، مدينة الثقافة الحديثة والطبيعة.',
          en: 'Beautiful capital of Finland, city of modern culture and nature.',
          fr: 'Belle capitale de la Finlande, ville de culture moderne et de nature.'
        },
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
        attractions: {
          ar: ['كاتدرائية هلسنكي', 'سوق هلسنكي', 'متحف فنلندا', 'حديقة إسبو'],
          en: ['Helsinki Cathedral', 'Helsinki Market', 'Finland Museum', 'Espoo Park'],
          fr: ['Cathédrale d\'Helsinki', 'Marché d\'Helsinki', 'Musée de la Finlande', 'Parc Espoo']
        },
        bestTime: { ar: 'يونيو - أغسطس', en: 'June - August', fr: 'Juin - Août' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.6,
        reviews: 4800,
        highlights: { ar: ['الطبيعة', 'الثقافة'], en: ['Nature', 'Culture'], fr: ['Nature', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
  },

  iceland: {
    id: 'iceland',
    name: { ar: 'آيسلندا', en: 'Iceland', fr: 'Islande' },
    capital: { ar: 'ريكيافيك', en: 'Reykjavik', fr: 'Reykjavik' },
    description: {
      ar: 'آيسلندا، أرض النار والجليد، حيث البراكين والأنهار الجليدية تلتقي بالشفق القطبي الساحر.',
      en: 'Iceland, land of fire and ice, where volcanoes and glaciers meet the enchanting Northern Lights.',
      fr: 'L\'Islande, terre de feu et de glace, où les volcans et les glaciers rencontrent les aurores boréales enchanteresses.'
    },
    mainImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    flag: '🇮🇸',
    currency: { ar: 'الكرونة الآيسلندية (ISK)', en: 'Icelandic Krone (ISK)', fr: 'Couronne islandaise (ISK)' },
    language: { ar: 'الآيسلندية', en: 'Icelandic', fr: 'Islandais' },
    timeZone: 'GMT+0',
    climate: { ar: 'معتدل بحري', en: 'Maritime temperate', fr: 'Tempéré maritime' },
    bestTime: { ar: 'يونيو - أغسطس', en: 'June - August', fr: 'Juin - Août' },
    visaRequired: false,
    rating: 4.8,
    totalReviews: 7200,
    totalTours: 55,
    totalHotels: 850,
    highlights: {
      ar: ['الشفق القطبي', 'الأنهار الجليدية', 'البراكين', 'الينابيع الحرارية'],
      en: ['Northern Lights', 'Glaciers', 'Volcanoes', 'Hot springs'],
      fr: ['Aurores boréales', 'Glaciers', 'Volcans', 'Sources chaudes']
    },
    culture: {
      ar: 'آيسلندا موطن للطبيعة الخلابة والثقافة الفريدة.',
      en: 'Iceland is home to stunning nature and unique culture.',
      fr: 'L\'Islande abrite une nature époustouflante et une culture unique.'
    },
    cuisine: {
      ar: ['السمك الآيسلندي', 'اللحم الآيسلندي', 'الجبن الآيسلندي', 'الخبز الآيسلندي'],
      en: ['Icelandic fish', 'Icelandic meat', 'Icelandic cheese', 'Icelandic bread'],
      fr: ['Poisson islandais', 'Viande islandaise', 'Fromage islandais', 'Pain islandais']
    },
    transportation: {
      ar: ['تأجير السيارات', 'الحافلات', 'الطائرات الداخلية'],
      en: ['Car rental', 'Buses', 'Domestic flights'],
      fr: ['Location de voitures', 'Bus', 'Vols intérieurs']
    },
    safety: {
      ar: 'آيسلندا من أأمن دول العالم مع معدلات جريمة منخفضة جداً.',
      en: 'Iceland is one of the world\'s safest countries with very low crime rates.',
      fr: 'L\'Islande est l\'un des pays les plus sûrs au monde avec des taux de criminalité très bas.'
    },
    cities: [
      {
        id: 'reykjavik',
        name: { ar: 'ريكيافيك', en: 'Reykjavik', fr: 'Reykjavik' },
        description: {
          ar: 'عاصمة آيسلندا، مدينة الثقافة والطبيعة الخلابة.',
          en: 'Capital of Iceland, city of culture and stunning nature.',
          fr: 'Capitale de l\'Islande, ville de culture et de nature époustouflante.'
        },
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
        attractions: {
          ar: ['الكنيسة اللوثرية', 'متحف آيسلندا', 'الينابيع الحرارية', 'الشفق القطبي'],
          en: ['Lutheran Church', 'Iceland Museum', 'Hot springs', 'Northern Lights'],
          fr: ['Église luthérienne', 'Musée d\'Islande', 'Sources chaudes', 'Aurores boréales']
        },
        bestTime: { ar: 'يونيو - أغسطس', en: 'June - August', fr: 'Juin - Août' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.8,
        reviews: 6000,
        highlights: { ar: ['الطبيعة', 'الشفق القطبي'], en: ['Nature', 'Northern Lights'], fr: ['Nature', 'Aurores boréales'] },
        gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
  },

  russia: {
    id: 'russia',
    name: { ar: 'روسيا', en: 'Russia', fr: 'Russie' },
    capital: { ar: 'موسكو', en: 'Moscow', fr: 'Moscou' },
    description: {
      ar: 'روسيا، أرض الشاسعة والثقافة الغنية، حيث التاريخ العريق يلتقي بالحداثة.',
      en: 'Russia, land of vastness and rich culture, where rich history meets modernity.',
      fr: 'La Russie, terre de vastitude et de culture riche, où l\'histoire riche rencontre la modernité.'
    },
    mainImage: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
    flag: '🇷🇺',
    currency: { ar: 'الروبل الروسي (RUB)', en: 'Russian Ruble (RUB)', fr: 'Rouble russe (RUB)' },
    language: { ar: 'الروسية', en: 'Russian', fr: 'Russe' },
    timeZone: 'GMT+3',
    climate: { ar: 'قاري', en: 'Continental', fr: 'Continental' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: true,
    rating: 4.5,
    totalReviews: 9800,
    totalTours: 72,
    totalHotels: 1200,
    highlights: {
      ar: ['الكرملين', 'ميدان الأحمر', 'كاتدرائية القديس باسيل', 'سانت بطرسبرغ'],
      en: ['Kremlin', 'Red Square', 'St. Basil\'s Cathedral', 'St. Petersburg'],
      fr: ['Kremlin', 'Place Rouge', 'Cathédrale Saint-Basile', 'Saint-Pétersbourg']
    },
    culture: {
      ar: 'روسيا موطن للتاريخ العريق والثقافة الغنية والفنون.',
      en: 'Russia is home to rich history, culture and arts.',
      fr: 'La Russie abrite une histoire riche, une culture et des arts.'
    },
    cuisine: {
      ar: ['البورش', 'البليمني', 'الكافيار', 'الفودكا'],
      en: ['Borscht', 'Pelmeni', 'Caviar', 'Vodka'],
      fr: ['Bortsch', 'Pelmeni', 'Caviar', 'Vodka']
    },
    transportation: {
      ar: ['مترو موسكو', 'القطار السريع', 'تأجير السيارات'],
      en: ['Moscow Metro', 'High-speed train', 'Car rental'],
      fr: ['Métro de Moscou', 'Train à grande vitesse', 'Location de voitures']
    },
    safety: {
      ar: 'روسيا دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Russia is a safe country for tourism with good infrastructure.',
      fr: 'La Russie est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'moscow',
        name: { ar: 'موسكو', en: 'Moscow', fr: 'Moscou' },
        description: {
          ar: 'عاصمة روسيا، مدينة التاريخ والثقافة والحداثة.',
          en: 'Capital of Russia, city of history, culture and modernity.',
          fr: 'Capitale de la Russie, ville d\'histoire, de culture et de modernité.'
        },
        image: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
        attractions: {
          ar: ['الكرملين', 'ميدان الأحمر', 'كاتدرائية القديس باسيل', 'متحف الكرملين'],
          en: ['Kremlin', 'Red Square', 'St. Basil\'s Cathedral', 'Kremlin Museum'],
          fr: ['Kremlin', 'Place Rouge', 'Cathédrale Saint-Basile', 'Musée du Kremlin']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '4-5 أيام', en: '4-5 days', fr: '4-5 jours' },
        rating: 4.5,
        reviews: 8200,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
  },

  ukraine: {
    id: 'ukraine',
    name: { ar: 'أوكرانيا', en: 'Ukraine', fr: 'Ukraine' },
    capital: { ar: 'كييف', en: 'Kyiv', fr: 'Kiev' },
    description: {
      ar: 'أوكرانيا، أرض الخصوبة والثقافة الغنية، حيث التاريخ العريق يلتقي بالتراث الأوروبي.',
      en: 'Ukraine, land of fertility and rich culture, where rich history meets European heritage.',
      fr: 'L\'Ukraine, terre de fertilité et de culture riche, où l\'histoire riche rencontre le patrimoine européen.'
    },
    mainImage: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
    flag: '🇺🇦',
    currency: { ar: 'الهريفنيا الأوكرانية (UAH)', en: 'Ukrainian Hryvnia (UAH)', fr: 'Hryvnia ukrainienne (UAH)' },
    language: { ar: 'الأوكرانية', en: 'Ukrainian', fr: 'Ukrainien' },
    timeZone: 'GMT+2',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.4,
    totalReviews: 5600,
    totalTours: 42,
    totalHotels: 720,
    highlights: {
      ar: ['كييف', 'أوديسا', 'لفيف', 'تشيرنوبيل'],
      en: ['Kyiv', 'Odessa', 'Lviv', 'Chernobyl'],
      fr: ['Kiev', 'Odessa', 'Lviv', 'Tchernobyl']
    },
    culture: {
      ar: 'أوكرانيا موطن للثقافة الغنية والتراث الأوروبي.',
      en: 'Ukraine is home to rich culture and European heritage.',
      fr: 'L\'Ukraine abrite une culture riche et un patrimoine européen.'
    },
    cuisine: {
      ar: ['البورش الأوكراني', 'الفارينيكي', 'الكباب الأوكراني', 'الخبز الأوكراني'],
      en: ['Ukrainian borscht', 'Varenyky', 'Ukrainian kebab', 'Ukrainian bread'],
      fr: ['Bortsch ukrainien', 'Varenyky', 'Kebab ukrainien', 'Pain ukrainien']
    },
    transportation: {
      ar: ['مترو كييف', 'الحافلات', 'تأجير السيارات'],
      en: ['Kyiv Metro', 'Buses', 'Car rental'],
      fr: ['Métro de Kiev', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'أوكرانيا دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Ukraine is a safe country for tourism with good infrastructure.',
      fr: 'L\'Ukraine est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'kyiv',
        name: { ar: 'كييف', en: 'Kyiv', fr: 'Kiev' },
        description: {
          ar: 'عاصمة أوكرانيا، مدينة التاريخ والثقافة.',
          en: 'Capital of Ukraine, city of history and culture.',
          fr: 'Capitale de l\'Ukraine, ville d\'histoire et de culture.'
        },
        image: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
        attractions: {
          ar: ['كاتدرائية سانت صوفيا', 'دير الكهوف', 'ميدان الاستقلال', 'متحف أوكرانيا'],
          en: ['St. Sophia Cathedral', 'Cave Monastery', 'Independence Square', 'Ukraine Museum'],
          fr: ['Cathédrale Sainte-Sophie', 'Monastère des Grottes', 'Place de l\'Indépendance', 'Musée de l\'Ukraine']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '3-4 أيام', en: '3-4 days', fr: '3-4 jours' },
        rating: 4.4,
        reviews: 4600,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
  },

  serbia: {
    id: 'serbia',
    name: { ar: 'صربيا', en: 'Serbia', fr: 'Serbie' },
    capital: { ar: 'بلغراد', en: 'Belgrade', fr: 'Belgrade' },
    description: {
      ar: 'صربيا، أرض التاريخ العريق والثقافة الغنية، حيث التراث الأوروبي يلتقي بالطبيعة الخلابة.',
      en: 'Serbia, land of rich history and culture, where European heritage meets stunning nature.',
      fr: 'La Serbie, terre d\'histoire et de culture riches, où le patrimoine européen rencontre la nature époustouflante.'
    },
    mainImage: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
    flag: '🇷🇸',
    currency: { ar: 'الدينار الصربي (RSD)', en: 'Serbian Dinar (RSD)', fr: 'Dinar serbe (RSD)' },
    language: { ar: 'الصربية', en: 'Serbian', fr: 'Serbe' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.3,
    totalReviews: 4800,
    totalTours: 35,
    totalHotels: 650,
    highlights: {
      ar: ['بلغراد', 'نوفي ساد', 'دير سوبوتيكا', 'المناظر الطبيعية'],
      en: ['Belgrade', 'Novi Sad', 'Sopocani Monastery', 'Natural landscapes'],
      fr: ['Belgrade', 'Novi Sad', 'Monastère de Sopocani', 'Paysages naturels']
    },
    culture: {
      ar: 'صربيا موطن للتراث التاريخي الغني والثقافة الأوروبية.',
      en: 'Serbia is home to rich historical heritage and European culture.',
      fr: 'La Serbie abrite un riche patrimoine historique et une culture européenne.'
    },
    cuisine: {
      ar: ['السيفابسيتشي', 'البوريك', 'الكعك الصربي', 'النبيذ الصربي'],
      en: ['Ćevapčići', 'Burek', 'Serbian cake', 'Serbian wine'],
      fr: ['Ćevapčići', 'Burek', 'Gâteau serbe', 'Vin serbe']
    },
    transportation: {
      ar: ['مترو بلغراد', 'الحافلات', 'تأجير السيارات'],
      en: ['Belgrade Metro', 'Buses', 'Car rental'],
      fr: ['Métro de Belgrade', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'صربيا دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Serbia is a safe country for tourism with good infrastructure.',
      fr: 'La Serbie est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'belgrade',
        name: { ar: 'بلغراد', en: 'Belgrade', fr: 'Belgrade' },
        description: {
          ar: 'عاصمة صربيا، مدينة التاريخ والثقافة.',
          en: 'Capital of Serbia, city of history and culture.',
          fr: 'Capitale de la Serbie, ville d\'histoire et de culture.'
        },
        image: 'https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg',
        attractions: {
          ar: ['قلعة بلغراد', 'البلدة القديمة', 'متحف صربيا', 'حديقة كالميغدان'],
          en: ['Belgrade Fortress', 'Old Town', 'Serbia Museum', 'Kalemegdan Park'],
          fr: ['Forteresse de Belgrade', 'Vieille ville', 'Musée de la Serbie', 'Parc Kalemegdan']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.3,
        reviews: 4000,
        highlights: { ar: ['التاريخ', 'الثقافة'], en: ['History', 'Culture'], fr: ['Histoire', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/1115762/pexels-photo-1115762.jpeg']
  },

  slovenia: {
    id: 'slovenia',
    name: { ar: 'سلوفينيا', en: 'Slovenia', fr: 'Slovénie' },
    capital: { ar: 'ليوبليانا', en: 'Ljubljana', fr: 'Ljubljana' },
    description: {
      ar: 'سلوفينيا، أرض الجبال الشاهقة والبحيرات الصافية، حيث الطبيعة الخلابة تلتقي بالثقافة الأوروبية.',
      en: 'Slovenia, land of towering mountains and crystal-clear lakes, where stunning nature meets European culture.',
      fr: 'La Slovénie, terre de montagnes imposantes et de lacs cristallins, où la nature époustouflante rencontre la culture européenne.'
    },
    mainImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    flag: '🇸🇮',
    currency: { ar: 'اليورو (EUR)', en: 'Euro (EUR)', fr: 'Euro (EUR)' },
    language: { ar: 'السلوفينية', en: 'Slovenian', fr: 'Slovène' },
    timeZone: 'GMT+1',
    climate: { ar: 'معتدل', en: 'Temperate', fr: 'Tempéré' },
    bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
    visaRequired: false,
    rating: 4.5,
    totalReviews: 5200,
    totalTours: 38,
    totalHotels: 680,
    highlights: {
      ar: ['ليوبليانا', 'بحيرة بليد', 'كهوف بوستوينا', 'المناظر الطبيعية'],
      en: ['Ljubljana', 'Lake Bled', 'Postojna Caves', 'Natural landscapes'],
      fr: ['Ljubljana', 'Lac de Bled', 'Grottes de Postojna', 'Paysages naturels']
    },
    culture: {
      ar: 'سلوفينيا موطن للطبيعة الخلابة والثقافة الأوروبية.',
      en: 'Slovenia is home to stunning nature and European culture.',
      fr: 'La Slovénie abrite une nature époustouflante et une culture européenne.'
    },
    cuisine: {
      ar: ['اللحم السلوفيني', 'الجبن السلوفيني', 'الكعك السلوفيني', 'النبيذ السلوفيني'],
      en: ['Slovenian meat', 'Slovenian cheese', 'Slovenian cake', 'Slovenian wine'],
      fr: ['Viande slovène', 'Fromage slovène', 'Gâteau slovène', 'Vin slovène']
    },
    transportation: {
      ar: ['مترو ليوبليانا', 'الحافلات', 'تأجير السيارات'],
      en: ['Ljubljana Metro', 'Buses', 'Car rental'],
      fr: ['Métro de Ljubljana', 'Bus', 'Location de voitures']
    },
    safety: {
      ar: 'سلوفينيا دولة آمنة للسياحة مع بنية تحتية جيدة.',
      en: 'Slovenia is a safe country for tourism with good infrastructure.',
      fr: 'La Slovénie est un pays sûr pour le tourisme avec une bonne infrastructure.'
    },
    cities: [
      {
        id: 'ljubljana',
        name: { ar: 'ليوبليانا', en: 'Ljubljana', fr: 'Ljubljana' },
        description: {
          ar: 'عاصمة سلوفينيا الجميلة، مدينة الثقافة والطبيعة.',
          en: 'Beautiful capital of Slovenia, city of culture and nature.',
          fr: 'Belle capitale de la Slovénie, ville de culture et de nature.'
        },
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
        attractions: {
          ar: ['قلعة ليوبليانا', 'البلدة القديمة', 'متحف سلوفينيا', 'حديقة تيفولي'],
          en: ['Ljubljana Castle', 'Old Town', 'Slovenia Museum', 'Tivoli Park'],
          fr: ['Château de Ljubljana', 'Vieille ville', 'Musée de la Slovénie', 'Parc Tivoli']
        },
        bestTime: { ar: 'مايو - سبتمبر', en: 'May - September', fr: 'Mai - Septembre' },
        duration: { ar: '2-3 أيام', en: '2-3 days', fr: '2-3 jours' },
        rating: 4.5,
        reviews: 4200,
        highlights: { ar: ['الطبيعة', 'الثقافة'], en: ['Nature', 'Culture'], fr: ['Nature', 'Culture'] },
        gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
      }
    ],
    gallery: ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg']
  }
};

// دالة للحصول على بيانات دولة محددة
export const getCountryData = (countryId: string): CountryData | null => {
  return countries[countryId] || null;
};

// دالة للحصول على جميع الدول
export const getAllCountries = (): CountryData[] => {
  return Object.values(countries);
};

/** يطابق معرّف دولة ثابت (مثل syria) مع معرّف السيرفر (مثل country_1769...) عبر الاسم */
export const resolveCountryIdInCatalog = (
  catalog: Pick<AdminCountryData, 'id' | 'name'>[],
  countryIdOrLegacy: string,
): string => {
  if (!countryIdOrLegacy) return countryIdOrLegacy;
  if (catalog.some((c) => c.id === countryIdOrLegacy)) return countryIdOrLegacy;

  const staticCountry = countries[countryIdOrLegacy];
  if (!staticCountry) return countryIdOrLegacy;

  const byName = catalog.find(
    (c) =>
      c.name.en?.toLowerCase() === staticCountry.name.en?.toLowerCase() ||
      c.name.ar === staticCountry.name.ar,
  );
  return byName?.id ?? countryIdOrLegacy;
};

export const countryIdsEquivalent = (
  catalog: Pick<AdminCountryData, 'id' | 'name'>[],
  idA: string,
  idB: string,
): boolean => {
  if (!idA || !idB) return false;
  return (
    resolveCountryIdInCatalog(catalog, idA) === resolveCountryIdInCatalog(catalog, idB)
  );
};

export const offerMatchesCountry = (
  catalog: Pick<AdminCountryData, 'id' | 'name'>[],
  offerCountryId: string,
  targetCountryId: string,
): boolean => countryIdsEquivalent(catalog, offerCountryId, targetCountryId);

// دالة للحصول على اسم المدينة بناءً على اللغة
export const getCityName = (city: City, language: 'ar' | 'en' | 'fr' = 'ar'): string => {
  return city.name[language] || city.name.ar;
};

// دالة للحصول على اسم الدولة بناءً على اللغة
export const getCountryName = (country: CountryData, language: 'ar' | 'en' | 'fr' = 'ar'): string => {
  return country.name[language] || country.name.ar;
};

// دالة للحصول على وصف الدولة بناءً على اللغة
export const getCountryDescription = (country: CountryData, language: 'ar' | 'en' | 'fr' = 'ar'): string => {
  return country.description[language] || country.description.ar;
};

// دوال التكامل مع نظام إدارة البيانات الديناميكي

// دالة للحصول على جميع الدول (ثابتة + ديناميكية)
export const getAllCountriesWithDynamic = (): CountryData[] => {
  const staticCountries = getAllCountries();
  const dynamicCountries = dataManager.getCountries().map(convertAdminToCountryData);

  // مفتاح فريد يعتمد على الاسم لمنع التكرار (نفضل البيانات الديناميكية)
  const keyOf = (c: CountryData) => (c.name.en || c.name.ar || '').trim().toLowerCase();

  const byKey = new Map<string, CountryData>();

  // أضف الديناميكي أولاً (الأحدث)
  for (const c of dynamicCountries) {
    // افتراضياً كل الدول الديناميكية نشطة إلا إذا تم تعطيلها في لوحة الأدمن
    const admin = dataManager.getCountryById(c.id);
    if (admin && admin.isActive === false) continue;
    const k = keyOf(c);
    if (!k) continue;
    byKey.set(k, c);
  }

  // ثم أضف الثابت فقط إذا لم يكن له مقابل ديناميكي بنفس الاسم
  for (const c of staticCountries) {
    const k = keyOf(c);
    if (!k) continue;
    if (!byKey.has(k)) {
      byKey.set(k, c);
    }
  }

  return Array.from(byKey.values());
};

// دالة للحصول على بيانات دولة محددة (ثابتة + ديناميكية)
export const getCountryDataWithDynamic = (countryId: string): CountryData | null => {
  // أولاً، جرب البحث في البيانات الديناميكية
  const adminCountry = dataManager.getCountryById(countryId);
  const staticCountry = getCountryData(countryId);
  
  if (adminCountry && adminCountry.isActive) {
    const dynamicData = convertAdminToCountryData(adminCountry);
    
    // دمج المدن: ندمج المدن الديناميكية مع الثابتة
    // نفضل المدن الديناميكية (المحدثة) على الثابتة، لكن نضيف الثابتة إذا لم تكن موجودة
    if (staticCountry && staticCountry.cities && staticCountry.cities.length > 0) {
      if (dynamicData.cities && dynamicData.cities.length > 0) {
        // إذا كانت هناك مدن ديناميكية وثابتة، ندمجها
        // نستخدم المدن الديناميكية أولاً، ثم نضيف الثابتة التي لا توجد في الديناميكية
        const dynamicCityIds = new Set(dynamicData.cities.map(c => c.id).filter(Boolean));
        const staticCitiesToAdd = staticCountry.cities.filter(c => !c.id || !dynamicCityIds.has(c.id));
        dynamicData.cities = [...dynamicData.cities, ...staticCitiesToAdd];
      } else {
        // إذا لم توجد مدن ديناميكية، استخدم المدن الثابتة
        dynamicData.cities = staticCountry.cities;
      }
    }

    // دمج صور الهيدر: استبدال الصور القديمة (صور أشخاص) بمعالم السودان
    const dynamicUsesLegacyHero =
      isSudanLegacyImage(dynamicData.mainImage) ||
      (dynamicData.gallery?.some((url) => isSudanLegacyImage(url)) ?? false);

    if (countryId === 'sudan' && staticCountry?.gallery?.length && dynamicUsesLegacyHero) {
      dynamicData.mainImage = staticCountry.mainImage;
      dynamicData.gallery = staticCountry.gallery;
    } else if (staticCountry?.gallery?.length && (dynamicUsesLegacyHero || !dynamicData.gallery?.length)) {
      dynamicData.mainImage = staticCountry.mainImage;
      dynamicData.gallery = staticCountry.gallery;
    } else if (staticCountry?.mainImage && isSudanLegacyImage(dynamicData.mainImage)) {
      dynamicData.mainImage = staticCountry.mainImage;
    }
    
    return dynamicData;
  }

  // إذا لم توجد بيانات ديناميكية، استخدم البيانات الثابتة
  return staticCountry;
};

// دالة لتحويل بيانات الأدمن إلى بيانات الدولة العادية
export const convertAdminToCountryData = (adminCountry: AdminCountryData): CountryData => {
  return {
    id: adminCountry.id,
    name: adminCountry.name,
    capital: adminCountry.capital,
    description: adminCountry.description,
    mainImage: adminCountry.mainImage,
    flag: '🌍', // قيمة افتراضية
    currency: adminCountry.currency,
    language: adminCountry.language,
    timeZone: 'GMT+3', // قيمة افتراضية
    climate: { ar: 'معتدل', en: 'Moderate', fr: 'Modéré' }, // قيمة افتراضية
    bestTime: adminCountry.bestTimeToVisit,
    visaRequired: false, // قيمة افتراضية
    rating: adminCountry.rating,
    totalReviews: adminCountry.totalReviews,
    totalTours: adminCountry.totalTours,
    totalHotels: 100, // قيمة افتراضية
    highlights: adminCountry.highlights,
    culture: adminCountry.culture,
    cuisine: adminCountry.cuisine,
    transportation: adminCountry.transportation,
    safety: adminCountry.safety,
    cities: adminCountry.cities,
    gallery: adminCountry.gallery?.length
      ? adminCountry.gallery
      : adminCountry.mainImage
        ? [adminCountry.mainImage]
        : [],
    continent: adminCountry.continent
  };
};

// دالة لتحويل بيانات الدولة العادية إلى بيانات الأدمن
export const convertCountryToAdminData = (country: CountryData): Omit<AdminCountryData, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> => {
  return {
    name: country.name,
    capital: country.capital,
    description: country.description,
    continent: country.continent || resolveCountryContinent(country.id, country.name),
    mainImage: country.mainImage,
    gallery: country.gallery,
    currency: country.currency,
    language: country.language,
    bestTimeToVisit: country.bestTime,
    rating: country.rating,
    totalReviews: country.totalReviews,
    totalTours: country.totalTours,
    highlights: country.highlights,
    culture: country.culture,
    cuisine: country.cuisine,
    transportation: country.transportation,
    safety: country.safety,
    cities: country.cities
  };
};

// دالة لمزامنة البيانات الثابتة مع النظام الديناميكي (تعمل مرة واحدة فقط)
export const syncStaticWithDynamic = async (): Promise<boolean> => {
  try {
    const syncFlag = localStorage.getItem('tarhal_data_synced');
    if (syncFlag === 'true') {
      return true;
    }

    await dataManager.ensureOfficesForAllCountries();

    const staticCountries = getAllCountries();
    let syncCount = 0;

    staticCountries.forEach(country => {
      const existingAdminCountry = dataManager.getCountryById(country.id);
      if (!existingAdminCountry) {
        const adminData = convertCountryToAdminData(country);
        const newAdminCountry = dataManager.addCountry({
          ...adminData,
          isActive: true
        });
        if (newAdminCountry) {
          syncCount++;
        }
      }
    });

    // وضع علامة أن المزامنة تمت
    localStorage.setItem('tarhal_data_synced', 'true');
    console.log(`تم مزامنة ${syncCount} دولة مع النظام الديناميكي`);
    return true;
  } catch (error) {
    console.error('خطأ في مزامنة البيانات:', error);
    return false;
  }
};

// دالة لإعادة تعيين المزامنة (للاستخدام في حالات الطوارئ)
export const resetDataSync = (): boolean => {
  try {
    localStorage.removeItem('tarhal_data_synced');
    console.log('تم إعادة تعيين حالة المزامنة');
    return true;
  } catch (error) {
    console.error('خطأ في إعادة تعيين المزامنة:', error);
    return false;
  }
};

// دالة لتنظيف البيانات المكررة
export const cleanDuplicateCountries = (): boolean => {
  try {
    const allDynamicCountries = dataManager.getCountries();
    const staticCountryIds = getAllCountries().map(c => c.id);

    let removedCount = 0;
    allDynamicCountries.forEach(dynamicCountry => {
      // إذا كانت الدولة موجودة في البيانات الثابتة وتم إنشاؤها بواسطة المزامنة
      if (staticCountryIds.includes(dynamicCountry.id)) {
        const createdDate = new Date(dynamicCountry.createdAt);
        const updatedDate = new Date(dynamicCountry.updatedAt);

        // إذا كانت تواريخ الإنشاء والتحديث متشابهة (مزامنة تلقائية)
        if (Math.abs(createdDate.getTime() - updatedDate.getTime()) < 1000) {
          dataManager.deleteCountry(dynamicCountry.id);
          removedCount++;
        }
      }
    });

    console.log(`تم حذف ${removedCount} دولة مكررة`);
    return true;
  } catch (error) {
    console.error('خطأ في تنظي�� البيانات المكررة:', error);
    return false;
  }
};

// دالة للبحث في الدول
export const searchCountries = (query: string, language: 'ar' | 'en' | 'fr' = 'ar'): CountryData[] => {
  const allCountries = getAllCountriesWithDynamic();
  const searchTerm = query.toLowerCase();

  return allCountries.filter(country => {
    const name = country.name[language]?.toLowerCase() || '';
    const description = country.description[language]?.toLowerCase() || '';
    const capital = country.capital[language]?.toLowerCase() || '';

    return name.includes(searchTerm) ||
           description.includes(searchTerm) ||
           capital.includes(searchTerm);
  });
};

// دالة لتصفية الدول حسب القارة
export const filterCountriesByContinent = (continent: string): CountryData[] => {
  const allCountries = getAllCountriesWithDynamic();

  if (continent === 'all') {
    return allCountries;
  }

  return allCountries.filter(country => country.continent === continent);
};

// دالة للحصول على إحصائيات الدول
export const getCountriesStatistics = () => {
  const allCountries = getAllCountriesWithDynamic();
  const dynamicStats = dataManager.getStatistics();

  const totalCountries = allCountries.length;
  const avgRating = totalCountries > 0
    ? allCountries.reduce((sum, country) => sum + country.rating, 0) / totalCountries
    : 0;

  const totalTours = allCountries.reduce((sum, country) => sum + country.totalTours, 0);
  const totalReviews = allCountries.reduce((sum, country) => sum + country.totalReviews, 0);

  const continentStats = allCountries.reduce((acc, country) => {
    const continent = country.continent || 'unknown';
    acc[continent] = (acc[continent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalCountries,
    avgRating: Math.round(avgRating * 10) / 10,
    totalTours,
    totalReviews,
    continentStats,
    dynamicCountries: dynamicStats.totalCountries,
    staticCountries: totalCountries - dynamicStats.totalCountries,
    totalOffices: dynamicStats.totalOffices
  };
};
