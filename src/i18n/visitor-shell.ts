import { navItems } from "@/config/site";

export type VisitorShellMessages = {
  nav: Record<string, string>;
  header: {
    servicesMenuTitle: string;
    viewAllServices: string;
  };
  footer: {
    tagline: string;
    freeTrial: string;
    callUs: string;
    explore: string;
    exploreHome: string;
    exploreAbout: string;
    explorePortfolio: string;
    exploreContact: string;
    exploreServices: string;
    explorePricing: string;
    exploreSchedule: string;
    servicesHeading: string;
    noPhones: string;
  };
  pricing: {
    single: string;
    bulk: string;
    disclaimer: string;
  };
  languageBar: {
    hint: string;
    english: string;
  };
  nativeLanguageName: string;
  cta: {
    orderNow: string;
  };
  layout: {
    locateUsEyebrow: string;
    locateUsHeading: string;
    mapNotSet: string;
  };
  pages: {
    contactTitle: string;
    contactSubtitle: string;
    contactScheduleEyebrow: string;
    contactScheduleTitle: string;
    contactScheduleBody: string;
    contactOpenScheduler: string;
    orderTitle: string;
    orderSubtitle: string;
    freeTrialTitle: string;
    freeTrialSubtitle: string;
  };
  forms: {
    contactEyebrow: string;
    contactHeading: string;
    sendMessage: string;
    sending: string;
    fullName: string;
    email: string;
    whatsapp: string;
    message: string;
    phName: string;
    phEmail: string;
    phWhatsapp: string;
    phMessage: string;
    messageReceived: string;
    messageReceivedThanks: string;
    couldNotSend: string;
    country: string;
    selectCountry: string;
    countryOther: string;
    orderStepService: string;
    orderStepDetails: string;
    orderStepDate: string;
    orderStepMessage: string;
    next: string;
    back: string;
    deadline: string;
    googleDriveLink: string;
    phDrive: string;
    submitOrder: string;
    submittingOrder: string;
    trialRequest: string;
  };
};

const EN: VisitorShellMessages = {
  nav: {
    "/": "Home",
    "/services": "Services",
    "/portfolio": "Portfolio",
    "/about": "About Us",
    "/pricing": "Pricing",
    "/contact": "Contact",
    "/free-trial": "Free Trial",
  },
  header: {
    servicesMenuTitle: "Services",
    viewAllServices: "View all services",
  },
  footer: {
    tagline:
      "Automotive photo editing for dealers, marketplaces, and creators.",
    freeTrial: "Free trial",
    callUs: "Call us",
    explore: "Explore",
    exploreHome: "Home",
    exploreAbout: "About us",
    explorePortfolio: "Portfolio",
    exploreContact: "Contact",
    exploreServices: "Services",
    explorePricing: "Pricing",
    exploreSchedule: "Schedule a meeting",
    servicesHeading: "Services",
    noPhones:
      "Add office phone numbers in Settings — maps stay on the page above.",
  },
  pricing: {
    single: "Single",
    bulk: "Bulk",
    disclaimer:
      "Prices are converted from USD using daily market rates and rounded for display; your bank or payment provider may use a slightly different rate.",
  },
  languageBar: {
    hint: "Language",
    english: "English",
  },
  nativeLanguageName: "English",
  cta: {
    orderNow: "Order now",
  },
  layout: {
    locateUsEyebrow: "Locate us",
    locateUsHeading: "Our offices",
    mapNotSet: "Map not set",
  },
  pages: {
    contactTitle: "Contact us",
    contactSubtitle: "Reach out to us if you have any problems and questions.",
    contactScheduleEyebrow: "Schedule a meeting",
    contactScheduleTitle: "Book a 1-on-1 with our team",
    contactScheduleBody:
      "Pick a date and time. We'll review your photos and build a plan with you.",
    contactOpenScheduler: "Open scheduler",
    orderTitle: "Place your order",
    orderSubtitle: "Select a service and send your details.",
    freeTrialTitle: "Start your free trial",
    freeTrialSubtitle: "Send your details and sample images.",
  },
  forms: {
    contactEyebrow: "Contact",
    contactHeading: "Send a message",
    sendMessage: "Send message",
    sending: "Sending…",
    fullName: "Full name",
    email: "Email",
    whatsapp: "WhatsApp",
    message: "Message",
    phName: "Your name",
    phEmail: "you@example.com",
    phWhatsapp: "+1 234 567 8900",
    phMessage: "Write your message…",
    messageReceived: "Message received.",
    messageReceivedThanks: "Thanks! We'll get back to you shortly.",
    couldNotSend: "Couldn't send",
    country: "Country",
    selectCountry: "Select your country",
    countryOther: "Other",
    orderStepService: "Service",
    orderStepDetails: "Details",
    orderStepDate: "Date",
    orderStepMessage: "Message",
    next: "Next",
    back: "Back",
    deadline: "Deadline",
    googleDriveLink: "Google Drive link",
    phDrive: "https://drive.google.com/...",
    submitOrder: "Proceed with order",
    submittingOrder: "Submitting…",
    trialRequest: "Request free trial",
  },
};

const BN: Partial<VisitorShellMessages> = {
  nav: {
    "/": "হোম",
    "/services": "সেবাসমূহ",
    "/portfolio": "পোর্টফোলিও",
    "/about": "আমাদের সম্পর্কে",
    "/pricing": "মূল্য তালিকা",
    "/contact": "যোগাযোগ",
    "/free-trial": "বিনামূল্যে ট্রায়াল",
  },
  header: {
    servicesMenuTitle: "সেবাসমূহ",
    viewAllServices: "সব সেবা দেখুন",
  },
  footer: {
    tagline:
      "ডিলার, মার্কেটপ্লেস ও ক্রিয়েটরদের জন্য অটোমোটিভ ফটো এডিটিং।",
    freeTrial: "বিনামূল্যে ট্রায়াল",
    callUs: "কল করুন",
    explore: "ঘুরে দেখুন",
    exploreHome: "হোম",
    exploreAbout: "আমাদের সম্পর্কে",
    explorePortfolio: "পোর্টফোলিও",
    exploreContact: "যোগাযোগ",
    exploreServices: "সেবাসমূহ",
    explorePricing: "মূল্য তালিকা",
    exploreSchedule: "মিটিং নির্ধারণ",
    servicesHeading: "সেবাসমূহ",
    noPhones:
      "সেটিংস থেকে অফিসের ফোন নম্বর যোগ করুন — মানচিত্র উপরেই থাকে।",
  },
  pricing: {
    single: "একক",
    bulk: "বাল্ক",
    disclaimer:
      "মূল্য USD থেকে দৈনিক বাজার হারে রূপান্তরিত ও প্রদর্শনের জন্য রাউন্ড করা; আপনার ব্যাংক ভিন্ন হার ব্যবহার করতে পারে।",
  },
  languageBar: {
    hint: "ভাষা",
    english: "ইংরেজি",
  },
  nativeLanguageName: "বাংলা",
};

const ES: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Inicio",
    "/services": "Servicios",
    "/portfolio": "Portafolio",
    "/about": "Nosotros",
    "/pricing": "Precios",
    "/contact": "Contacto",
    "/free-trial": "Prueba gratis",
  },
  header: {
    servicesMenuTitle: "Servicios",
    viewAllServices: "Ver todos los servicios",
  },
  footer: {
    tagline:
      "Edición fotográfica automotriz para concesionarios, marketplaces y creadores.",
    freeTrial: "Prueba gratis",
    callUs: "Llámanos",
    explore: "Explorar",
    exploreHome: "Inicio",
    exploreAbout: "Nosotros",
    explorePortfolio: "Portafolio",
    exploreContact: "Contacto",
    exploreServices: "Servicios",
    explorePricing: "Precios",
    exploreSchedule: "Agendar reunión",
    servicesHeading: "Servicios",
    noPhones:
      "Añade teléfonos de oficina en Ajustes; los mapas siguen arriba en la página.",
  },
  pricing: {
    single: "Individual",
    bulk: "Por volumen",
    disclaimer:
      "Los precios se convierten desde USD con tipos de mercado diarios; tu banco puede aplicar otro tipo.",
  },
  languageBar: { hint: "Idioma", english: "Inglés" },
  nativeLanguageName: "Español",
};

const DE: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Start",
    "/services": "Leistungen",
    "/portfolio": "Portfolio",
    "/about": "Über uns",
    "/pricing": "Preise",
    "/contact": "Kontakt",
    "/free-trial": "Kostenlose Testversion",
  },
  header: {
    servicesMenuTitle: "Leistungen",
    viewAllServices: "Alle Leistungen",
  },
  footer: {
    tagline:
      "Automotive-Bildbearbeitung für Händler, Marktplätze und Creator.",
    freeTrial: "Kostenlose Testversion",
    callUs: "Rufen Sie uns an",
    explore: "Entdecken",
    exploreHome: "Start",
    exploreAbout: "Über uns",
    explorePortfolio: "Portfolio",
    exploreContact: "Kontakt",
    exploreServices: "Leistungen",
    explorePricing: "Preise",
    exploreSchedule: "Termin vereinbaren",
    servicesHeading: "Leistungen",
    noPhones:
      "Bitte Bürotelefone in den Einstellungen hinterlegen — Karten bleiben oben.",
  },
  pricing: {
    single: "Einzeln",
    bulk: "Menge",
    disclaimer:
      "Preise werden von USD mit täglichen Marktkursen umgerechnet; Ihre Bank kann abweichen.",
  },
  languageBar: { hint: "Sprache", english: "Englisch" },
  nativeLanguageName: "Deutsch",
};

const FR: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Accueil",
    "/services": "Services",
    "/portfolio": "Portfolio",
    "/about": "À propos",
    "/pricing": "Tarifs",
    "/contact": "Contact",
    "/free-trial": "Essai gratuit",
  },
  header: {
    servicesMenuTitle: "Services",
    viewAllServices: "Voir tous les services",
  },
  footer: {
    tagline:
      "Retouche photo automobile pour concessionnaires, marketplaces et créateurs.",
    freeTrial: "Essai gratuit",
    callUs: "Appelez-nous",
    explore: "Explorer",
    exploreHome: "Accueil",
    exploreAbout: "À propos",
    explorePortfolio: "Portfolio",
    exploreContact: "Contact",
    exploreServices: "Services",
    explorePricing: "Tarifs",
    exploreSchedule: "Planifier un rendez-vous",
    servicesHeading: "Services",
    noPhones:
      "Ajoutez les téléphones du bureau dans les réglages — la carte reste au-dessus.",
  },
  pricing: {
    single: "À l’unité",
    bulk: "Volume",
    disclaimer:
      "Prix convertis depuis l’USD avec les taux du jour; votre banque peut appliquer un taux différent.",
  },
  languageBar: { hint: "Langue", english: "Anglais" },
  nativeLanguageName: "Français",
};

const HI: Partial<VisitorShellMessages> = {
  nav: {
    "/": "होम",
    "/services": "सेवाएँ",
    "/portfolio": "पोर्टफोलियो",
    "/about": "हमारे बारे में",
    "/pricing": "मूल्य निर्धारण",
    "/contact": "संपर्क",
    "/free-trial": "निःशुल्क परीक्षण",
  },
  header: {
    servicesMenuTitle: "सेवाएँ",
    viewAllServices: "सभी सेवाएँ देखें",
  },
  footer: {
    tagline:
      "डीलरों, मार्केटप्लेस और निर्माताओं के लिए ऑटोमोटिव फोटो संपादन।",
    freeTrial: "निःशुल्क परीक्षण",
    callUs: "हमें कॉल करें",
    explore: "अन्वेषण",
    exploreHome: "होम",
    exploreAbout: "हमारे बारे में",
    explorePortfolio: "पोर्टफोलियो",
    exploreContact: "संपर्क",
    exploreServices: "सेवाएँ",
    explorePricing: "मूल्य निर्धारण",
    exploreSchedule: "मीटिंग निर्धारित करें",
    servicesHeading: "सेवाएँ",
    noPhones:
      "सेटिंग्स में कार्यालय फोन जोड़ें — मानचित्र पृष्ठ के ऊपर रहते हैं।",
  },
  pricing: {
    single: "एकल",
    bulk: "थोक",
    disclaimer:
      "मूल्य USD से दैनिक बाजार दरों पर परिवर्तित; आपका बैंक भिन्न दर लगा सकता है।",
  },
  languageBar: { hint: "भाषा", english: "अंग्रेज़ी" },
  nativeLanguageName: "हिन्दी",
};

const PT: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Início",
    "/services": "Serviços",
    "/portfolio": "Portfólio",
    "/about": "Sobre",
    "/pricing": "Preços",
    "/contact": "Contato",
    "/free-trial": "Teste grátis",
  },
  footer: {
    tagline:
      "Edição fotográfica automotiva para revendas, marketplaces e criadores.",
    freeTrial: "Teste grátis",
    callUs: "Ligue para nós",
    explore: "Explorar",
    exploreHome: "Início",
    exploreAbout: "Sobre",
    explorePortfolio: "Portfólio",
    exploreContact: "Contato",
    exploreServices: "Serviços",
    explorePricing: "Preços",
    exploreSchedule: "Agendar reunião",
    servicesHeading: "Serviços",
    noPhones:
      "Adicione telefones do escritório nas configurações — mapas ficam acima.",
  },
  pricing: {
    single: "Unitário",
    bulk: "Volume",
    disclaimer:
      "Preços convertidos de USD com taxas diárias; seu banco pode usar outra taxa.",
  },
  languageBar: { hint: "Idioma", english: "Inglês" },
  nativeLanguageName: "Português",
};

const JA: Partial<VisitorShellMessages> = {
  nav: {
    "/": "ホーム",
    "/services": "サービス",
    "/portfolio": "ポートフォリオ",
    "/about": "会社概要",
    "/pricing": "料金",
    "/contact": "お問い合わせ",
    "/free-trial": "無料トライアル",
  },
  footer: {
    tagline: "ディーラー、マーケットプレイス、クリエイター向けの自動車写真編集。",
    freeTrial: "無料トライアル",
    callUs: "お電話",
    explore: "メニュー",
    exploreHome: "ホーム",
    exploreAbout: "会社概要",
    explorePortfolio: "ポートフォリオ",
    exploreContact: "お問い合わせ",
    exploreServices: "サービス",
    explorePricing: "料金",
    exploreSchedule: "ミーティング予約",
    servicesHeading: "サービス",
    noPhones: "設定で電話番号を追加してください。地図はページ上部にあります。",
  },
  pricing: {
    single: "単品",
    bulk: "バルク",
    disclaimer:
      "表示はUSDから為替レートで換算しています。金融機関のレートと異なる場合があります。",
  },
  languageBar: { hint: "言語", english: "英語" },
  nativeLanguageName: "日本語",
};

const KO: Partial<VisitorShellMessages> = {
  nav: {
    "/": "홈",
    "/services": "서비스",
    "/portfolio": "포트폴리오",
    "/about": "소개",
    "/pricing": "가격",
    "/contact": "문의",
    "/free-trial": "무료 체험",
  },
  footer: {
    tagline: "딜러, 마켓플레이스, 크리에이터를 위한 자동차 사진 편집.",
    freeTrial: "무료 체험",
    callUs: "전화",
    explore: "둘러보기",
    exploreHome: "홈",
    exploreAbout: "소개",
    explorePortfolio: "포트폴리오",
    exploreContact: "문의",
    exploreServices: "서비스",
    explorePricing: "가격",
    exploreSchedule: "미팅 예약",
    servicesHeading: "서비스",
    noPhones: "설정에서 사무실 전화를 추가하세요. 지도는 위에 있습니다.",
  },
  pricing: {
    single: "단건",
    bulk: "대량",
    disclaimer:
      "가격은 USD 기준 일일 환율로 환산되며 은행과 다를 수 있습니다.",
  },
  languageBar: { hint: "언어", english: "영어" },
  nativeLanguageName: "한국어",
};

const ZH: Partial<VisitorShellMessages> = {
  nav: {
    "/": "首页",
    "/services": "服务",
    "/portfolio": "作品集",
    "/about": "关于我们",
    "/pricing": "价格",
    "/contact": "联系",
    "/free-trial": "免费试用",
  },
  footer: {
    tagline: "面向经销商、市场和创作者的汽车照片修图服务。",
    freeTrial: "免费试用",
    callUs: "致电我们",
    explore: "浏览",
    exploreHome: "首页",
    exploreAbout: "关于我们",
    explorePortfolio: "作品集",
    exploreContact: "联系",
    exploreServices: "服务",
    explorePricing: "价格",
    exploreSchedule: "预约会议",
    servicesHeading: "服务",
    noPhones: "请在设置中添加办公电话 — 地图显示在页面顶部。",
  },
  pricing: {
    single: "单次",
    bulk: "批量",
    disclaimer: "价格由美元按每日汇率换算显示，银行实际扣款汇率可能不同。",
  },
  languageBar: { hint: "语言", english: "英语" },
  nativeLanguageName: "中文",
};

const AR: Partial<VisitorShellMessages> = {
  nav: {
    "/": "الرئيسية",
    "/services": "الخدمات",
    "/portfolio": "معرض الأعمال",
    "/about": "من نحن",
    "/pricing": "الأسعار",
    "/contact": "اتصل بنا",
    "/free-trial": "تجربة مجانية",
  },
  footer: {
    tagline: "تحرير صور السيارات للوكالات والأسواق والمبدعين.",
    freeTrial: "تجربة مجانية",
    callUs: "اتصل بنا",
    explore: "استكشف",
    exploreHome: "الرئيسية",
    exploreAbout: "من نحن",
    explorePortfolio: "معرض الأعمال",
    exploreContact: "اتصل بنا",
    exploreServices: "الخدمات",
    explorePricing: "الأسعار",
    exploreSchedule: "جدولة اجتماع",
    servicesHeading: "الخدمات",
    noPhones: "أضف أرقام المكتب في الإعدادات — الخرائط أعلى الصفحة.",
  },
  pricing: {
    single: "فردي",
    bulk: "كميات",
    disclaimer: "الأسعار محوّلة من الدولار بأسعار السوق اليومية وقد يختلف البنك.",
  },
  languageBar: { hint: "اللغة", english: "الإنجليزية" },
  nativeLanguageName: "العربية",
};

const IT: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Home",
    "/services": "Servizi",
    "/portfolio": "Portfolio",
    "/about": "Chi siamo",
    "/pricing": "Prezzi",
    "/contact": "Contatti",
    "/free-trial": "Prova gratuita",
  },
  footer: {
    tagline:
      "Fotoritocco automotive per concessionarie, marketplace e creator.",
    freeTrial: "Prova gratuita",
    callUs: "Chiamaci",
    explore: "Esplora",
    exploreHome: "Home",
    exploreAbout: "Chi siamo",
    explorePortfolio: "Portfolio",
    exploreContact: "Contatti",
    exploreServices: "Servizi",
    explorePricing: "Prezzi",
    exploreSchedule: "Prenota riunione",
    servicesHeading: "Servizi",
    noPhones:
      "Aggiungi i telefoni in Impostazioni — le mappe restano sopra nella pagina.",
  },
  pricing: {
    single: "Singolo",
    bulk: "Volume",
    disclaimer:
      "Prezzi convertiti da USD con tassi giornalieri; la banca può applicare tassi diversi.",
  },
  languageBar: { hint: "Lingua", english: "Inglese" },
  nativeLanguageName: "Italiano",
};

const NL: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Home",
    "/services": "Diensten",
    "/portfolio": "Portfolio",
    "/about": "Over ons",
    "/pricing": "Prijzen",
    "/contact": "Contact",
    "/free-trial": "Gratis proef",
  },
  header: {
    servicesMenuTitle: "Diensten",
    viewAllServices: "Alle diensten bekijken",
  },
  footer: {
    tagline:
      "Automotive fotobewerking voor dealers, marktplaatsen en makers.",
    freeTrial: "Gratis proef",
    callUs: "Bel ons",
    explore: "Ontdek",
    exploreHome: "Home",
    exploreAbout: "Over ons",
    explorePortfolio: "Portfolio",
    exploreContact: "Contact",
    exploreServices: "Diensten",
    explorePricing: "Prijzen",
    exploreSchedule: "Afspraak plannen",
    servicesHeading: "Diensten",
    noPhones:
      "Voeg kantoortelefoons toe in Instellingen — kaarten blijven boven op de pagina.",
  },
  pricing: {
    single: "Los",
    bulk: "Volume",
    disclaimer:
      "Prijzen omgerekend vanaf USD met dagkoersen; uw bank kan afwijken.",
  },
  languageBar: { hint: "Taal", english: "Engels" },
  nativeLanguageName: "Nederlands",
  cta: {
    orderNow: "Bestellen",
  },
  layout: {
    locateUsEyebrow: "Vind ons",
    locateUsHeading: "Onze kantoren",
    mapNotSet: "Kaart niet ingesteld",
  },
  pages: {
    contactTitle: "Contact",
    contactSubtitle: "Neem contact op bij vragen of problemen.",
    contactScheduleEyebrow: "Afspraak plannen",
    contactScheduleTitle: "Plan een 1-op-1 met ons team",
    contactScheduleBody:
      "Kies datum en tijd. We bekijken je foto's en maken samen een plan.",
    contactOpenScheduler: "Planner openen",
    orderTitle: "Je bestelling plaatsen",
    orderSubtitle: "Kies een dienst en stuur je gegevens.",
    freeTrialTitle: "Start je gratis proefperiode",
    freeTrialSubtitle: "Stuur je gegevens en voorbeeldfoto's.",
  },
  forms: {
    contactEyebrow: "Contact",
    contactHeading: "Stuur een bericht",
    sendMessage: "Bericht versturen",
    sending: "Verzenden…",
    fullName: "Volledige naam",
    email: "E-mail",
    whatsapp: "WhatsApp",
    message: "Bericht",
    phName: "Je naam",
    phEmail: "jij@voorbeeld.nl",
    phWhatsapp: "+31 6 12345678",
    phMessage: "Schrijf je bericht…",
    messageReceived: "Bericht ontvangen.",
    messageReceivedThanks: "Bedankt! We reageren zo snel mogelijk.",
    couldNotSend: "Verzenden mislukt",
    country: "Land",
    selectCountry: "Selecteer je land",
    countryOther: "Overig",
    orderStepService: "Dienst",
    orderStepDetails: "Gegevens",
    orderStepDate: "Datum",
    orderStepMessage: "Bericht",
    next: "Volgende",
    back: "Terug",
    deadline: "Uiterste datum",
    googleDriveLink: "Google Drive-link",
    phDrive: "https://drive.google.com/...",
    submitOrder: "Bestelling afronden",
    submittingOrder: "Verzenden…",
    trialRequest: "Gratis proef aanvragen",
  },
};

const PL: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Strona główna",
    "/services": "Usługi",
    "/portfolio": "Portfolio",
    "/about": "O nas",
    "/pricing": "Cennik",
    "/contact": "Kontakt",
    "/free-trial": "Darmowy trial",
  },
  header: {
    servicesMenuTitle: "Usługi",
    viewAllServices: "Zobacz wszystkie usługi",
  },
  footer: {
    tagline:
      "Edycja zdjęć motoryzacyjnych dla dealerów, marketplace’ów i twórców.",
    freeTrial: "Darmowy trial",
    callUs: "Zadzwoń",
    explore: "Odkrywaj",
    exploreHome: "Strona główna",
    exploreAbout: "O nas",
    explorePortfolio: "Portfolio",
    exploreContact: "Kontakt",
    exploreServices: "Usługi",
    explorePricing: "Cennik",
    exploreSchedule: "Umów spotkanie",
    servicesHeading: "Usługi",
    noPhones:
      "Dodaj telefony biura w Ustawieniach — mapy pozostają u góry strony.",
  },
  pricing: {
    single: "Pojedynczo",
    bulk: "Hurt",
    disclaimer:
      "Ceny przeliczone z USD według dziennych kursów; bank może stosować inny kurs.",
  },
  languageBar: { hint: "Język", english: "Angielski" },
  nativeLanguageName: "Polski",
};

const TR: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Ana sayfa",
    "/services": "Hizmetler",
    "/portfolio": "Portföy",
    "/about": "Hakkımızda",
    "/pricing": "Fiyatlandırma",
    "/contact": "İletişim",
    "/free-trial": "Ücretsiz deneme",
  },
  header: {
    servicesMenuTitle: "Hizmetler",
    viewAllServices: "Tüm hizmetleri görüntüle",
  },
  footer: {
    tagline:
      "Bayiler, pazar yerleri ve içerik üreticileri için otomotiv fotoğraf düzenleme.",
    freeTrial: "Ücretsiz deneme",
    callUs: "Bizi arayın",
    explore: "Keşfet",
    exploreHome: "Ana sayfa",
    exploreAbout: "Hakkımızda",
    explorePortfolio: "Portföy",
    exploreContact: "İletişim",
    exploreServices: "Hizmetler",
    explorePricing: "Fiyatlandırma",
    exploreSchedule: "Toplantı planla",
    servicesHeading: "Hizmetler",
    noPhones:
      "Ayardan ofis telefonlarını ekleyin — haritalar sayfanın üstünde kalır.",
  },
  pricing: {
    single: "Tekli",
    bulk: "Toplu",
    disclaimer:
      "Fiyatlar USD’den günlük kurla çevrilir; bankanız farklı kur uygulayabilir.",
  },
  languageBar: { hint: "Dil", english: "İngilizce" },
  nativeLanguageName: "Türkçe",
};

const RU: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Главная",
    "/services": "Услуги",
    "/portfolio": "Портфолио",
    "/about": "О нас",
    "/pricing": "Цены",
    "/contact": "Контакты",
    "/free-trial": "Бесплатный пробный",
  },
  header: {
    servicesMenuTitle: "Услуги",
    viewAllServices: "Все услуги",
  },
  footer: {
    tagline:
      "Автомобильная ретушь для дилеров, маркетплейсов и авторов контента.",
    freeTrial: "Бесплатный пробный",
    callUs: "Позвоните нам",
    explore: "Разделы",
    exploreHome: "Главная",
    exploreAbout: "О нас",
    explorePortfolio: "Портфолио",
    exploreContact: "Контакты",
    exploreServices: "Услуги",
    explorePricing: "Цены",
    exploreSchedule: "Запланировать встречу",
    servicesHeading: "Услуги",
    noPhones:
      "Добавьте офисные телефоны в настройках — карты остаются выше на странице.",
  },
  pricing: {
    single: "Разовая",
    bulk: "Опт",
    disclaimer:
      "Цены пересчитаны из USD по дневному курсу; банк может применить другой.",
  },
  languageBar: { hint: "Язык", english: "Английский" },
  nativeLanguageName: "Русский",
};

const VI: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Trang chủ",
    "/services": "Dịch vụ",
    "/portfolio": "Portfolio",
    "/about": "Giới thiệu",
    "/pricing": "Bảng giá",
    "/contact": "Liên hệ",
    "/free-trial": "Dùng thử miễn phí",
  },
  header: {
    servicesMenuTitle: "Dịch vụ",
    viewAllServices: "Xem tất cả dịch vụ",
  },
  footer: {
    tagline:
      "Chỉnh sửa ảnh xe cho đại lý, sàn TMĐT và nhà sáng tạo nội dung.",
    freeTrial: "Dùng thử miễn phí",
    callUs: "Gọi cho chúng tôi",
    explore: "Khám phá",
    exploreHome: "Trang chủ",
    exploreAbout: "Giới thiệu",
    explorePortfolio: "Portfolio",
    exploreContact: "Liên hệ",
    exploreServices: "Dịch vụ",
    explorePricing: "Bảng giá",
    exploreSchedule: "Đặt lịch họp",
    servicesHeading: "Dịch vụ",
    noPhones:
      "Thêm số điện thoại văn phòng trong Cài đặt — bản đồ vẫn ở trên trang.",
  },
  pricing: {
    single: "Đơn lẻ",
    bulk: "Số lượng lớn",
    disclaimer:
      "Giá quy đổi từ USD theo tỷ giá thị trường hằng ngày; ngân hàng có thể khác.",
  },
  languageBar: { hint: "Ngôn ngữ", english: "Tiếng Anh" },
  nativeLanguageName: "Tiếng Việt",
};

const TH: Partial<VisitorShellMessages> = {
  nav: {
    "/": "หน้าแรก",
    "/services": "บริการ",
    "/portfolio": "ผลงาน",
    "/about": "เกี่ยวกับเรา",
    "/pricing": "ราคา",
    "/contact": "ติดต่อ",
    "/free-trial": "ทดลองใช้ฟรี",
  },
  header: {
    servicesMenuTitle: "บริการ",
    viewAllServices: "ดูบริการทั้งหมด",
  },
  footer: {
    tagline: "บริการแต่งภาพรถยนต์สำหรับดีลเลอร์ แมร์เก็ตเพลส และครีเอเตอร์",
    freeTrial: "ทดลองใช้ฟรี",
    callUs: "โทรหาเรา",
    explore: "สำรวจ",
    exploreHome: "หน้าแรก",
    exploreAbout: "เกี่ยวกับเรา",
    explorePortfolio: "ผลงาน",
    exploreContact: "ติดต่อ",
    exploreServices: "บริการ",
    explorePricing: "ราคา",
    exploreSchedule: "นัดประชุม",
    servicesHeading: "บริการ",
    noPhones: "เพิ่มเบอร์สำนักงานในการตั้งค่า — แผนที่อยู่ด้านบนของหน้า",
  },
  pricing: {
    single: "รายชิ้น",
    bulk: "จำนวนมาก",
    disclaimer:
      "ราคาแปลงจาก USD ตามอัตราตลาดรายวัน ธนาคารอาจใช้อัตราต่างกัน",
  },
  languageBar: { hint: "ภาษา", english: "อังกฤษ" },
  nativeLanguageName: "ไทย",
};

const ID: Partial<VisitorShellMessages> = {
  nav: {
    "/": "Beranda",
    "/services": "Layanan",
    "/portfolio": "Portofolio",
    "/about": "Tentang kami",
    "/pricing": "Harga",
    "/contact": "Kontak",
    "/free-trial": "Uji coba gratis",
  },
  header: {
    servicesMenuTitle: "Layanan",
    viewAllServices: "Lihat semua layanan",
  },
  footer: {
    tagline:
      "Editing foto otomotif untuk dealer, marketplace, dan kreator konten.",
    freeTrial: "Uji coba gratis",
    callUs: "Hubungi kami",
    explore: "Jelajahi",
    exploreHome: "Beranda",
    exploreAbout: "Tentang kami",
    explorePortfolio: "Portofolio",
    exploreContact: "Kontak",
    exploreServices: "Layanan",
    explorePricing: "Harga",
    exploreSchedule: "Jadwalkan pertemuan",
    servicesHeading: "Layanan",
    noPhones:
      "Tambahkan telepon kantor di Pengaturan — peta tetap di atas halaman.",
  },
  pricing: {
    single: "Satuan",
    bulk: "Jumlah besar",
    disclaimer:
      "Harga dikonversi dari USD dengan kurs harian; bank dapat memakai kurs berbeda.",
  },
  languageBar: { hint: "Bahasa", english: "Inggris" },
  nativeLanguageName: "Bahasa Indonesia",
};

const OVERRIDES: Record<string, Partial<VisitorShellMessages>> = {
  bn: BN,
  es: ES,
  de: DE,
  fr: FR,
  hi: HI,
  pt: PT,
  ja: JA,
  ko: KO,
  zh: ZH,
  ar: AR,
  it: IT,
  nl: NL,
  pl: PL,
  tr: TR,
  ru: RU,
  vi: VI,
  th: TH,
  id: ID,
};

/** Locales with visitor-shell copy (nav/footer/pricing). Used to match `Accept-Language`. */
export const VISITOR_SHELL_ALT_LOCALES: ReadonlySet<string> = new Set(Object.keys(OVERRIDES));

/** All UI language codes for the public language picker: English first, then A–Z by code. */
export const VISITOR_SHELL_UI_LOCALES: readonly string[] = [
  "en",
  ...Array.from(VISITOR_SHELL_ALT_LOCALES).sort(),
];

function mergeShell(loc: string): VisitorShellMessages {
  const o = OVERRIDES[loc] ?? {};
  return {
    nav: { ...EN.nav, ...o.nav },
    header: { ...EN.header, ...o.header },
    footer: { ...EN.footer, ...o.footer },
    pricing: { ...EN.pricing, ...o.pricing },
    languageBar: { ...EN.languageBar, ...o.languageBar },
    nativeLanguageName: o.nativeLanguageName ?? EN.nativeLanguageName,
    cta: { ...EN.cta, ...o.cta },
    layout: { ...EN.layout, ...o.layout },
    pages: { ...EN.pages, ...o.pages },
    forms: { ...EN.forms, ...o.forms },
  };
}

export function getVisitorShellMessages(locale: string): VisitorShellMessages {
  const loc = (locale || "en").toLowerCase().slice(0, 5);
  return mergeShell(loc);
}

export function navLabelsFromMessages(m: VisitorShellMessages): string[] {
  return navItems.map((item) => m.nav[item.href] ?? item.label);
}
