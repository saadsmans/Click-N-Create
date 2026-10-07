import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadGoogleFont, loadGoogleFontsBatch, FONT_CATALOG } from '../data/themeCatalog.ts';
import { SeoConfig, Invoice, ThemeTokens } from '../types/index.ts';
import { safeParseJson } from '../utils/api.ts';

export type { ThemeTokens };

export interface CmsServiceItem {
  id: string;
  title: string;
  slug: string;
  rate: string;
  turnaround: string;
  description: string;
  deliverables: string[];
}

export interface CmsProjectItem {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  metric: string;
  description: string;
  tags: string[];
  liveUrl?: string;
}

export interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SiteCustomization {
  theme: ThemeTokens;
  seo?: SeoConfig;
  invoices?: Invoice[];
  pages: {
    home: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      badgeText: string;
      primaryCtaText: string;
      primaryCtaLink: string;
      secondaryCtaText: string;
      secondaryCtaLink: string;
      stat1Value: string;
      stat1Label: string;
      stat2Value: string;
      stat2Label: string;
      stat3Value: string;
      stat3Label: string;
      stat4Value: string;
      stat4Label: string;
      feature1Title: string;
      feature1Desc: string;
      feature2Title: string;
      feature2Desc: string;
      feature3Title: string;
      feature3Desc: string;
    };
    about: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      badgeText: string;
      bioParagraph1: string;
      bioParagraph2: string;
      approachTitle: string;
      approachText: string;
      techStack: string[];
    };
    services: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      badgeText: string;
      servicesList: CmsServiceItem[];
    };
    portfolio: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      badgeText: string;
      projectsList: CmsProjectItem[];
    };
    pricing: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      badgeText: string;
      hourlyRateNumber: number;
      tier1Title: string;
      tier1Price: string;
      tier1Desc: string;
      tier1Features: string[];
      tier2Title: string;
      tier2Price: string;
      tier2Desc: string;
      tier2Features: string[];
      tier3Title: string;
      tier3Price: string;
      tier3Desc: string;
      tier3Features: string[];
    };
    estimator: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      badgeText: string;
      hourlyRate: number;
      step1Title: string;
      step2Title: string;
      step3Title: string;
    };
    contact: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      badgeText: string;
      whatsappNumber: string;
      phoneNumber: string;
      emailAddress: string;
      linkedinUrl: string;
      availabilityStatus: string;
      availabilityText: string;
    };
    process: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
      step4Title: string;
      step4Desc: string;
    };
    standards: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      guarantee1: string;
      guarantee2: string;
      guarantee3: string;
      guarantee4: string;
    };
    faq: {
      heroTitle: string;
      heroHighlight: string;
      heroSubtitle: string;
      faqsList: CmsFaqItem[];
    };
  };
  updatedAt: string;
}

export const DEFAULT_CUSTOMIZATION: SiteCustomization = {
  theme: {
    presetId: 'cyber_cyan',
    presetName: 'Cyber Neon Cyan (Default)',
    fontDisplay: 'Syne',
    fontSans: 'Plus Jakarta Sans',
    fontMono: 'Hubot Sans',
    accentCyan: '#00F0FF',
    accentPurple: '#A855F7',
    accentGradient: 'linear-gradient(135deg, #00F0FF 0%, #A855F7 50%, #FF0055 100%)',
    bgTone: 'default',
    glowEffect: true,
    glowIntensity: 'cyber',
    borderRadius: 'modern',
    showGame: true,
    showGrid: true,
    customBadge: 'AVAILABLE FOR 2026 CLIENT PROJECTS · £35/HR',
    customLogoUrl: '/uploads/header-logo-1791033749583.png',
    logoDisplayMode: 'image_text',
    logoHeight: 44,
    customSiteIconUrl: '/uploads/site-icon-1791034074249.png',
  },
  pages: {
    home: {
      heroTitle: 'WEBSITES & ONLINE SHOPS',
      heroHighlight: 'THAT GET YOU CUSTOMERS.',
      heroSubtitle: 'I help business owners, shops, and creators get more calls and sales with clean websites that open fast on phones, look professional, and are easy for you to edit anytime.',
      badgeText: 'DIRECT COLLABORATION WITH SAAD M · £35/HR RATE',
      primaryCtaText: 'START A PROJECT',
      primaryCtaLink: '/contact',
      secondaryCtaText: 'EXPLORE SERVICES',
      secondaryCtaLink: '/services',
      stat1Value: '£35/hr',
      stat1Label: 'Transparent Flat Rate',
      stat2Value: '100%',
      stat2Label: 'On-Time Project Delivery',
      stat3Value: '<24h',
      stat3Label: 'Direct Response Time',
      stat4Value: '0.5s',
      stat4Label: 'Mobile Speed Optimization',
      feature1Title: 'Direct One-on-One Communication',
      feature1Desc: 'You communicate directly with Saad M from initial discovery to final deployment. No account managers or middle agencies.',
      feature2Title: 'Engineered for Real Conversion',
      feature2Desc: 'Fast load speeds, mobile responsiveness, and clean layouts that turn casual visitors into paying customers.',
      feature3Title: 'Clear & Predictable Pricing',
      feature3Desc: 'Straightforward £35/hr rate or fixed milestone scopes with zero hidden fees or retainer contracts.',
    },
    about: {
      heroTitle: 'THE DEVELOPER BEHIND',
      heroHighlight: 'CLICK N CREATE',
      heroSubtitle: 'Saad M — An independent full-stack web developer and UI designer focused on building ultra-fast, high-converting digital storefronts, custom applications, and clean company websites.',
      badgeText: 'DIRECT COLLABORATION · £35/HR RATE',
      bioParagraph1: 'Based in the UK, I work with ambitious business owners, e-commerce brands, and founders across the UK, Europe, and North America. My philosophy is straightforward: build websites that load in under a second, look exceptional across all screens, and generate quantifiable business value.',
      bioParagraph2: 'With complete full-stack mastery spanning modern React, TypeScript, Node.js, Express, Tailwind CSS, and scalable Cloud architectures, I manage the full development lifecycle from architectural blueprint to live deployment and Google Search indexing.',
      approachTitle: 'Engineering Principles & Philosophy',
      approachText: 'Zero bloated templates. Every site is built with clean, type-safe code, semantic HTML for top Google rankings, and intuitive content management.',
      techStack: ['React 19', 'TypeScript', 'Node.js & Express', 'Tailwind CSS', 'Next.js', 'PostgreSQL & SQLite', 'Stripe & Shopify API', 'Cloudflare & Cloud Run'],
    },
    services: {
      heroTitle: 'ENGINEERED DIGITAL',
      heroHighlight: 'SOLUTIONS & SERVICES',
      heroSubtitle: 'From rapid commercial websites to bespoke e-commerce storefronts and custom web tools, explore transparent services tailored for business growth.',
      badgeText: 'TRANSPARENT PRICING · £35/HR OR FIXED MILESTONES',
      servicesList: [
        {
          id: 'srv-web-dev',
          title: 'Business Websites (WordPress / Custom React)',
          slug: 'web-development',
          rate: '£35/hr or from £500 fixed',
          turnaround: '1 – 2 Weeks',
          description: 'Clean, mobile-first websites designed to build trust, showcase your services, and generate customer leads automatically.',
          deliverables: ['Custom Mobile-Optimized Design', 'Contact Form to Inbox', 'Google Search & SEO Setup', 'Fast Cloud Hosting Setup', 'Video Guide for Easy Editing'],
        },
        {
          id: 'srv-ecom',
          title: 'E-Commerce Online Stores (Shopify / WooCommerce)',
          slug: 'ecommerce-development',
          rate: '£35/hr or from £850 fixed',
          turnaround: '2 – 3 Weeks',
          description: 'High-converting online shops with instant slide-out carts, card payments (Stripe/Apple Pay/PayPal), and inventory tracking.',
          deliverables: ['Secure Checkout Integration', 'Slide-Out Drawer Cart', 'Product Variant Options', 'Discount & Promo Engine', 'Customer Order Accounts'],
        },
        {
          id: 'srv-branding',
          title: 'Logos, Banners & Graphic Design',
          slug: 'branding-design',
          rate: '£35/hr or from £280 fixed',
          turnaround: '3 – 7 Days',
          description: 'Complete visual identity kits: high-resolution logos, matching social media cover banners, print flyers, and luxury business cards.',
          deliverables: ['Primary & Secondary Logo Suite', 'Social Media Graphics Kit', 'Print-Ready Flyers & Leaflets', 'Double-Sided Business Cards', 'Brand Color & Typography Guide'],
        },
        {
          id: 'srv-marketing',
          title: 'Google Search & Digital Marketing',
          slug: 'digital-marketing',
          rate: '£35/hr or from £350 fixed',
          turnaround: '4 – 7 Days',
          description: 'Rank higher on Google search results, optimize local Google Maps presence, and set up tracking to measure conversion.',
          deliverables: ['Technical SEO Audit & Fixes', 'Google Search Rich Snippets', 'Google Analytics (GA4) Tracking', 'WhatsApp & Social Link Previews', 'Search Keyword Optimization'],
        },
        {
          id: 'srv-hosting',
          title: 'Website Hosting & Monthly Care Support',
          slug: 'hosting-maintenance',
          rate: '£35/hr or monthly care',
          turnaround: '1 – 3 Days',
          description: 'Fast, secure cloud hosting, automated daily safety backups, domain connection, and direct WhatsApp support whenever you need updates.',
          deliverables: ['High-Speed Cloud Hosting', 'Free SSL Security Padlock', 'Automated Daily Safety Backups', '24/7 Uptime Monitoring', 'Speed & Security Booster'],
        },
        {
          id: 'srv-custom-apps',
          title: 'Custom Web Apps & Online Calculators',
          slug: 'web-app-development',
          rate: '£35/hr or custom scope',
          turnaround: '2 – 4 Weeks',
          description: 'Interactive price estimators, customer portals, staff dashboards, or bespoke tools tailored to your operational workflows.',
          deliverables: ['Interactive Estimation Engine', 'User Authentication & Logins', 'Visual Analytics Dashboards', 'PDF & CSV Export Tools', 'REST API & Third-Party Sync'],
        },
      ],
    },
    portfolio: {
      heroTitle: 'CURATED ARCHIVE OF',
      heroHighlight: 'FEATURED CASE STUDIES',
      heroSubtitle: 'Explore real-world commercial builds, online storefronts, web applications, and interactive portals engineered for measurable client results.',
      badgeText: 'VERIFIED CLIENT WORK · 2026 PORTFOLIO',
      projectsList: [
        {
          id: 'proj_01',
          title: 'Lumina Luxury Boutique',
          client: 'Lumina Retail UK',
          category: 'E-Commerce & Branding',
          year: '2026',
          metric: '+180% Mobile Conversion',
          description: 'Ultra-fast headless commerce storefront with dynamic slide-out cart, multi-currency Stripe checkout, and 99+ mobile Google PageSpeed score.',
          tags: ['React 19', 'Shopify API', 'Tailwind CSS', 'Stripe'],
          liveUrl: 'https://clickncreate.co.uk',
        },
        {
          id: 'proj_02',
          title: 'Vertex Architecture Showcase',
          client: 'Vertex Studio',
          category: 'Web Development',
          year: '2026',
          metric: '0.4s First Paint Time',
          description: 'Interactive architectural portfolio featuring real-time WebGL floor plan previews, smooth physics scrolling, and instant consultation scheduling.',
          tags: ['TypeScript', 'Three.js', 'Framer Motion', 'Tailwind'],
          liveUrl: 'https://clickncreate.co.uk',
        },
        {
          id: 'proj_03',
          title: 'Apex Freight Logistics Hub',
          client: 'Apex Global',
          category: 'Custom Web App',
          year: '2026',
          metric: '40hrs Weekly Admin Saved',
          description: 'Enterprise fleet dispatch dashboard with live tracking indicators, automated PDF quote generator, and client dispatch management.',
          tags: ['Node.js', 'Express', 'React', 'TypeScript'],
          liveUrl: 'https://clickncreate.co.uk',
        },
      ],
    },
    pricing: {
      heroTitle: 'TRANSPARENT RATES &',
      heroHighlight: 'PREDICTABLE BUDGETING',
      heroSubtitle: 'Clear, honest pricing with zero hidden fees. Standard hourly rate is £35/hr, with fixed milestone scopes available for all defined projects.',
      badgeText: 'NO RETAINERS REQUIRED · £35/HR FLAT RATE',
      hourlyRateNumber: 35,
      tier1Title: 'Essential Launch Package',
      tier1Price: '£500 – £950',
      tier1Desc: 'Ideal for small businesses, trades, consultants, and creators launching a high-impact digital presence.',
      tier1Features: ['Up to 5 Mobile-Optimized Pages', 'Direct Contact Form to Inbox', 'Google Search & Local Maps Setup', 'Fast Cloud Hosting & Domain SSL', '1-on-1 Video Handover Tutorial'],
      tier2Title: 'Growth & E-Commerce Store',
      tier2Price: '£1,200 – £2,400',
      tier2Desc: 'Complete online shop or multi-service platform built to convert visitors and process automated card payments.',
      tier2Features: ['Full Product Store (Shopify / Custom)', 'Slide-Out Fast Drawer Cart', 'Stripe, Apple Pay & PayPal Setup', 'Product Options (Sizes/Colors)', 'Advanced SEO & Speed Boost'],
      tier3Title: 'Bespoke Application / Portal',
      tier3Price: '£2,500 – £5,000+',
      tier3Desc: 'Custom online calculators, client login portals, private dashboards, and multi-user web applications.',
      tier3Features: ['Tailored Interactive Web Tool', 'Secure User Login / Accounts', 'Visual Data Charts & Dashboards', 'PDF & CSV Export Suites', 'Ongoing Priority WhatsApp Support'],
    },
    estimator: {
      heroTitle: 'INTERACTIVE PROJECT',
      heroHighlight: 'PRICE & HOUR ESTIMATOR',
      heroSubtitle: 'Calculate an honest, upfront price in 3 simple steps. Pick your deliverables and generate a transparent proposal with no hidden surprises.',
      badgeText: 'INSTANT UPFRONT PRICING · £35/HR',
      hourlyRate: 35,
      step1Title: 'Step 01 · What does your business need?',
      step2Title: 'Step 02 · Choose Deliverables & Extra Features',
      step3Title: 'Step 03 · Delivery Timeline Pace',
    },
    contact: {
      heroTitle: "LET'S TALK ABOUT YOUR",
      heroHighlight: 'UPCOMING PROJECT.',
      heroSubtitle: 'You communicate directly with Saad M. Standard rate is £35/hr, with custom milestone scopes available. Messages submit straight to my personal inbox.',
      badgeText: 'DIRECT INBOUND TO SAAD M',
      whatsappNumber: '+44 7927 548123',
      phoneNumber: '+44 7927 548123',
      emailAddress: 'saadm.clickncreate@gmail.com',
      linkedinUrl: 'https://linkedin.com',
      availabilityStatus: 'Active & Open',
      availabilityText: 'Rate: £35/hr · Open for 2026 Projects',
    },
    process: {
      heroTitle: 'A PREDICTABLE 4-STAGE',
      heroHighlight: 'DEVELOPMENT PROCESS',
      heroSubtitle: 'From initial discovery message to final live deployment, every project follows a transparent, collaborative roadmap.',
      step1Title: '01 · Discovery & Blueprint',
      step1Desc: 'We define your goals, target audience, page structures, and tech requirements with a crystal-clear fixed or hourly scope.',
      step2Title: '02 · Design & Wireframing',
      step2Desc: 'Interactive wireframes and design mockups crafted to capture your brand visual identity and optimize user flow.',
      step3Title: '03 · Full-Stack Engineering',
      step3Desc: 'Production development with clean TypeScript, lightning-fast component rendering, and responsive mobile testing.',
      step4Title: '04 · Testing, SEO & Launch',
      step4Desc: 'Rigorous cross-browser checks, Google Search optimization, SSL setup, and seamless handover with complete ownership.',
    },
    standards: {
      heroTitle: 'ENGINEERING EXCELLENCE &',
      heroHighlight: 'QUALITY GUARANTEES',
      heroSubtitle: 'Every website delivered by Click N Create is built according to stringent performance, accessibility, and security standards.',
      guarantee1: '100% Mobile & Tablet Optimization across all screen viewports',
      guarantee2: 'Sub-second First Contentful Paint (<0.8s) for maximum conversions',
      guarantee3: 'Clean Semantic HTML & Structured JSON-LD Schema for Google Search',
      guarantee4: 'Zero Retainers or Lock-In: You own 100% of your source code and assets',
    },
    faq: {
      heroTitle: 'FREQUENTLY ASKED',
      heroHighlight: 'QUESTIONS & ANSWERS',
      heroSubtitle: 'Straightforward answers regarding rates, delivery timelines, payment terms, and working directly with Saad M.',
      faqsList: [
        {
          id: 'faq-1',
          question: 'What is your standard rate and how do payments work?',
          answer: 'My standard rate is £35/hour. For defined projects, I offer fixed milestone packages (e.g. 50% deposit upon start, 50% upon successful launch). All prices are completely transparent with zero hidden fees.',
          category: 'Pricing',
        },
        {
          id: 'faq-2',
          question: 'How long does it take to build a website?',
          answer: 'A standard 5-page business website typically takes 1 to 2 weeks. E-commerce shops take roughly 2 to 3 weeks. Express rush delivery is also available if you have an urgent launch deadline.',
          category: 'Timeline',
        },
        {
          id: 'faq-3',
          question: 'Can I easily edit words and prices myself after launch?',
          answer: 'Yes! Every project includes a personalized video walkthrough showing you exactly how to edit text, update prices, or add new photos yourself anytime without needing to write code.',
          category: 'Management',
        },
        {
          id: 'faq-4',
          question: 'Do you provide website hosting and domain setup?',
          answer: 'Yes, I handle connecting your domain, setting up high-speed cloud hosting, free SSL security locks, and automated daily backups.',
          category: 'Hosting',
        },
      ],
    },
  },
  updatedAt: new Date().toISOString(),
};

/**
 * Sanitize theme tokens before caching in localStorage so large base64 data URIs
 * never exceed browser storage quota limits.
 */
const sanitizeThemeForStorage = (theme: ThemeTokens): Partial<ThemeTokens> => {
  if (!theme || typeof theme !== 'object') return {};
  const clean: any = { ...theme };
  if (clean.customLogoUrl && typeof clean.customLogoUrl === 'string' && clean.customLogoUrl.startsWith('data:')) {
    delete clean.customLogoUrl;
  }
  if (clean.customSiteIconUrl && typeof clean.customSiteIconUrl === 'string' && clean.customSiteIconUrl.startsWith('data:')) {
    delete clean.customSiteIconUrl;
  }
  return clean;
};

const safeSetLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringVal);
  } catch (err) {
    console.warn(`[LocalStorage] Storage quota warning or write error for "${key}":`, err);
    try {
      localStorage.removeItem('cnc_active_theme');
    } catch {
      // ignore
    }
  }
};

interface CustomizationContextType {
  customization: SiteCustomization;
  loading: boolean;
  getPageContent: (pageKey: string) => any;
  refreshCustomization: () => Promise<void>;
  applyPreviewTokens: (tokens: Partial<ThemeTokens>) => void;
  saveTheme: (theme: ThemeTokens) => Promise<boolean>;
  updatePageContent: (pageKey: string, pageData: any) => Promise<boolean>;
  resetPageContent: (pageKey: string) => Promise<boolean>;
  importPagesJson: (pagesJson: any) => Promise<boolean>;
}

const CustomizationContext = createContext<CustomizationContextType>({
  customization: DEFAULT_CUSTOMIZATION,
  loading: false,
  getPageContent: (key) => (DEFAULT_CUSTOMIZATION.pages as any)[key] || {},
  refreshCustomization: async () => {},
  applyPreviewTokens: () => {},
  saveTheme: async () => false,
  updatePageContent: async () => false,
  resetPageContent: async () => false,
  importPagesJson: async () => false,
});

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customization, setCustomization] = useState<SiteCustomization>(DEFAULT_CUSTOMIZATION);
  const [loading, setLoading] = useState(false);

  const applyThemeToDOM = (theme: ThemeTokens) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const accent1 = theme.accentCyan || '#00F0FF';
    const accent2 = theme.accentPurple || '#A855F7';
    const gradient = theme.accentGradient || `linear-gradient(135deg, ${accent1} 0%, ${accent2} 100%)`;

    // 1. Dynamic Google Fonts Loading
    if (theme.fontDisplay) {
      loadGoogleFont(theme.fontDisplay);
      root.style.setProperty('--font-display', `'${theme.fontDisplay}', sans-serif`);
    }
    if (theme.fontSans) {
      loadGoogleFont(theme.fontSans);
      root.style.setProperty('--font-sans', `'${theme.fontSans}', sans-serif`);
    }
    if (theme.fontMono) {
      loadGoogleFont(theme.fontMono);
      root.style.setProperty('--font-mono', `'${theme.fontMono}', monospace, sans-serif`);
    }

    // 2. CSS Color Variables
    root.style.setProperty('--accent-cyan', accent1);
    root.style.setProperty('--accent-primary', accent1);
    root.style.setProperty('--cyber-cyan', accent1);
    root.style.setProperty('--accent-purple', accent2);
    root.style.setProperty('--accent-secondary', accent2);
    root.style.setProperty('--cyber-purple', accent2);
    root.style.setProperty('--accent-gradient', gradient);

    // 3. Radius System
    const radiusMap: Record<string, { base: string; btn: string; card: string }> = {
      sharp: { base: '0px', btn: '0px', card: '0px' },
      minimal: { base: '6px', btn: '6px', card: '8px' },
      modern: { base: '16px', btn: '12px', card: '20px' },
      soft: { base: '24px', btn: '16px', card: '28px' },
      pill: { base: '9999px', btn: '9999px', card: '32px' },
    };
    const rad = radiusMap[theme.borderRadius || 'modern'] || radiusMap.modern;
    root.style.setProperty('--border-radius', rad.base);
    root.style.setProperty('--btn-radius', rad.btn);
    root.style.setProperty('--card-radius', rad.card);

    // 4. Background and Text Tone Calculations for BOTH Light & Dark modes
    const bgMainDark = theme.bgMainDark || (theme.bgTone === 'void' ? '#000000' : theme.bgTone === 'obsidian' ? '#080812' : theme.bgTone === 'slate' ? '#0B0F19' : theme.bgTone === 'emerald' ? '#02120B' : theme.bgTone === 'navy' ? '#040B1A' : theme.bgTone === 'warm_sand' ? '#120B05' : '#07070F');
    const bgSecondaryDark = theme.bgSecondaryDark || (theme.bgTone === 'void' ? '#050508' : theme.bgTone === 'obsidian' ? '#100E22' : theme.bgTone === 'slate' ? '#111827' : theme.bgTone === 'emerald' ? '#072418' : theme.bgTone === 'navy' ? '#0A1633' : theme.bgTone === 'warm_sand' ? '#22150A' : '#0D0D1C');
    const textColorDark = theme.textColorDark || '#F8FAFC';
    const textMutedDark = '#94A3B8';
    const borderColorDark = `${accent1}33`;

    const bgMainLight = theme.bgMainLight || (theme.bgTone === 'cream' || theme.bgTone === 'paper' ? '#FAF8F5' : theme.bgTone === 'ice' ? '#F0F9FF' : '#F8FAFC');
    const bgSecondaryLight = theme.bgSecondaryLight || '#FFFFFF';
    const textColorLight = theme.textColorLight || '#0F172A';
    const textMutedLight = '#64748B';
    const borderColorLight = 'rgba(0, 0, 0, 0.1)';

    // Clean up any inline overrides so CSS selectors (:root.dark vs :root:not(.dark)) have full control
    root.style.removeProperty('--bg-main');
    root.style.removeProperty('--bg-secondary');
    root.style.removeProperty('--card-bg');
    root.style.removeProperty('--text-main');
    root.style.removeProperty('--text-muted');
    root.style.removeProperty('--border-main');

    // Set dataset attributes for layout variants
    root.dataset.headerStyle = theme.headerStyle || 'floating_glass';
    root.dataset.footerStyle = theme.footerStyle || 'modern_columns';
    root.dataset.dropdownStyle = theme.dropdownStyle || 'glass_blur';
    root.dataset.themePreset = theme.presetId || 'cyber_cyan';

    // 5. Glow & Shadow calculation
    let glowShadow = `0 0 25px ${accent1}66`;
    if (theme.glowIntensity === 'none') {
      glowShadow = 'none';
    } else if (theme.glowIntensity === 'subtle') {
      glowShadow = `0 4px 20px -2px rgba(0,0,0,0.25)`;
    } else if (theme.glowIntensity === 'medium') {
      glowShadow = `0 0 20px ${accent1}44`;
    } else if (theme.glowIntensity === 'brutalist') {
      glowShadow = `4px 4px 0px #000000`;
    }
    root.style.setProperty('--glow-color', `${accent1}66`);
    root.style.setProperty('--card-shadow', glowShadow);

    // 6. Complete Dynamic CSS Overrides
    let styleTag = document.getElementById('dynamic-cnc-theme-overrides') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-cnc-theme-overrides';
      document.head.appendChild(styleTag);
    }

    const isBrutalist = theme.buttonStyle === 'brutalist' || theme.borderWidth === 'brutalist';
    const isSharp = theme.borderRadius === 'sharp';
    const isOutline = theme.buttonStyle === 'outline';
    const isFlat = theme.buttonStyle === 'flat';
    const pattern = theme.backgroundPattern || 'grid';

    styleTag.innerHTML = `
      /* Mode-Specific Color & Background Variables */
      :root:not(.dark), html:not(.dark) {
        --bg-main: ${bgMainLight};
        --bg-secondary: ${bgSecondaryLight};
        --card-bg: ${bgSecondaryLight};
        --card-bg-subtle: #F1F5F9;
        --text-main: ${textColorLight};
        --text-muted: ${textMutedLight};
        --border-main: ${borderColorLight};
        --border-subtle: rgba(0, 0, 0, 0.05);
        --glow-color: rgba(2, 132, 199, 0.2);
        color-scheme: light;
      }

      :root.dark, html.dark {
        --bg-main: ${bgMainDark};
        --bg-secondary: ${bgSecondaryDark};
        --card-bg: ${bgSecondaryDark};
        --card-bg-subtle: #121226;
        --text-main: ${textColorDark};
        --text-muted: ${textMutedDark};
        --border-main: ${borderColorDark};
        --border-subtle: rgba(255, 255, 255, 0.04);
        --glow-color: ${accent1}66;
        color-scheme: dark;
      }

      /* Global Viewport Background & Base Colors That Adapt Instantly */
      body, #root, .min-h-screen {
        background-color: var(--bg-main) !important;
        color: var(--text-main) !important;
      }

      /* Typography */
      h1, h2, h3, h4, h5, h6, .font-display {
        font-family: var(--font-display, '${theme.fontDisplay || 'Syne'}', sans-serif) !important;
        letter-spacing: ${isBrutalist ? '0.02em' : '-0.02em'} !important;
      }
      body, p, input, select, textarea, .font-sans {
        font-family: var(--font-sans, '${theme.fontSans || 'Plus Jakarta Sans'}', sans-serif) !important;
      }
      code, pre, .font-mono {
        font-family: var(--font-mono, '${theme.fontMono || 'Hubot Sans'}', monospace) !important;
      }

      /* Core Color Swaps Across All Primary Components */
      .text-\\[\\#00F0FF\\], .text-\\[\\#00f0ff\\], .text-cyan-400, .text-cyan-500, .text-cyan-300 {
        color: ${accent1} !important;
      }
      .bg-\\[\\#00F0FF\\], .bg-\\[\\#00f0ff\\], .bg-cyan-400, .bg-cyan-500 {
        background-color: ${accent1} !important;
      }
      .bg-\\[\\#00F0FF\\]\\/10, .bg-\\[\\#00F0FF\\]\\/15, .bg-\\[\\#00F0FF\\]\\/20, .bg-cyan-500\\/10, .bg-cyan-500\\/15, .bg-cyan-500\\/20 {
        background-color: ${accent1}22 !important;
      }
      .border-\\[\\#00F0FF\\], .border-\\[\\#00f0ff\\], .border-cyan-400, .border-cyan-500 {
        border-color: ${accent1} !important;
      }
      .border-\\[\\#00F0FF\\]\\/20, .border-\\[\\#00F0FF\\]\\/30, .border-\\[\\#00F0FF\\]\\/40, .border-cyan-500\\/20, .border-cyan-500\\/30, .border-cyan-500\\/40 {
        border-color: ${accent1}55 !important;
      }

      /* Secondary Color Swaps */
      .text-\\[\\#A855F7\\], .text-\\[\\#a855f7\\], .text-purple-400, .text-purple-500, .text-purple-300 {
        color: ${accent2} !important;
      }
      .bg-\\[\\#A855F7\\], .bg-\\[\\#a855f7\\], .bg-purple-500, .bg-purple-600 {
        background-color: ${accent2} !important;
      }
      .bg-\\[\\#A855F7\\]\\/10, .bg-\\[\\#A855F7\\]\\/15, .bg-\\[\\#A855F7\\]\\/20, .bg-purple-500\\/10, .bg-purple-500\\/20 {
        background-color: ${accent2}22 !important;
      }
      .border-\\[\\#A855F7\\], .border-\\[\\#a855f7\\], .border-purple-400, .border-purple-500 {
        border-color: ${accent2} !important;
      }

      /* Background Tones Replacements across Container Classes — SCOPED TO DARK MODE ONLY */
      .dark .bg-\\[\\#07070F\\], .dark .bg-\\[\\#07070f\\], .dark .bg-\\[\\#05050C\\], .dark .bg-\\[\\#05020C\\], .dark .bg-\\[\\#080816\\], .dark .bg-\\[\\#070710\\], .dark .bg-\\[\\#080814\\], .dark .bg-\\[\\#040406\\], .dark .bg-\\[\\#020603\\], .dark .bg-\\[\\#0A0905\\], .dark .bg-\\[\\#030816\\], .dark .bg-\\[\\#02120B\\], .dark .bg-\\[\\#120B05\\], .dark .bg-\\[\\#040B1A\\] {
        background-color: var(--bg-main) !important;
      }

      .dark .bg-\\[\\#0D0D1C\\], .dark .bg-\\[\\#0d0d1c\\], .dark .bg-\\[\\#0A0A18\\], .dark .bg-\\[\\#0a0a18\\], .dark .bg-\\[\\#0C061A\\], .dark .bg-\\[\\#09090E\\], .dark .bg-\\[\\#08122C\\], .dark .bg-\\[\\#072418\\] {
        background-color: var(--bg-secondary) !important;
      }

      /* Card Styling and Shadows for both Light and Dark */
      html.dark .cyber-card {
        background-color: var(--bg-secondary) !important;
        border-color: var(--border-main) !important;
        border-radius: var(--card-radius, 16px) !important;
        box-shadow: ${glowShadow} !important;
      }

      html:not(.dark) .cyber-card {
        background-color: var(--bg-secondary) !important;
        border-color: var(--border-main) !important;
        border-radius: var(--card-radius, 16px) !important;
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.06) !important;
      }

      /* Gradients & Text Fills */
      .text-cyber-gradient, .text-luxury-gradient {
        background: ${gradient} !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }
      .bg-cyber-gradient {
        background: ${gradient} !important;
      }

      /* Glow & Box Shadows */
      .shadow-\\[0_0_15px_rgba\\(0\\,240\\,255\\,0\\.4\\)\\],
      .shadow-\\[0_0_20px_rgba\\(0\\,240\\,255\\,0\\.4\\)\\],
      .shadow-\\[0_0_25px_rgba\\(0\\,240\\,255\\,0\\.4\\)\\],
      .shadow-\\[0_0_30px_rgba\\(0\\,240\\,255\\,0\\.7\\)\\] {
        box-shadow: ${glowShadow} !important;
      }

      /* Corner Radii Adaptations */
      ${isSharp ? `
        button, .rounded-xl, .rounded-2xl, .rounded-3xl, .rounded-full, .cyber-card {
          border-radius: 0px !important;
        }
      ` : `
        button:not(.rounded-full) {
          border-radius: var(--btn-radius, 12px) !important;
        }
        .rounded-2xl, .rounded-3xl, .cyber-card {
          border-radius: var(--card-radius, 20px) !important;
        }
      `}

      /* Neo-Brutalist Mode Styling */
      ${isBrutalist ? `
        html.dark button:not(.no-brutalist), html.dark .btn-primary, html.dark .btn-secondary {
          border: 2px solid #FFFFFF !important;
          box-shadow: 4px 4px 0px ${accent1} !important;
          border-radius: 0px !important;
          font-weight: 800 !important;
          letter-spacing: 0.05em !important;
        }
        html:not(.dark) button:not(.no-brutalist), html:not(.dark) .btn-primary, html:not(.dark) .btn-secondary {
          border: 2px solid #000000 !important;
          box-shadow: 4px 4px 0px #000000 !important;
          border-radius: 0px !important;
          font-weight: 800 !important;
          letter-spacing: 0.05em !important;
        }
        html.dark button:not(.no-brutalist):active {
          transform: translate(2px, 2px) !important;
          box-shadow: 2px 2px 0px ${accent1} !important;
        }
        html:not(.dark) button:not(.no-brutalist):active {
          transform: translate(2px, 2px) !important;
          box-shadow: 2px 2px 0px #000000 !important;
        }
        html.dark .rounded-2xl, html.dark .rounded-3xl, html.dark .cyber-card {
          border: 2px solid ${accent1} !important;
          box-shadow: 6px 6px 0px #000000 !important;
        }
        html:not(.dark) .rounded-2xl, html:not(.dark) .rounded-3xl, html:not(.dark) .cyber-card {
          border: 2px solid #000000 !important;
          box-shadow: 6px 6px 0px rgba(0,0,0,0.15) !important;
        }
      ` : ''}

      /* Outline Button Mode */
      ${isOutline ? `
        button.bg-\\[\\#00F0FF\\], button.bg-cyan-500 {
          background-color: transparent !important;
          border: 2px solid ${accent1} !important;
          color: ${accent1} !important;
          box-shadow: 0 0 15px ${accent1}33 !important;
        }
      ` : ''}

      /* Flat Button Mode */
      ${isFlat ? `
        button {
          box-shadow: none !important;
        }
      ` : ''}

      /* Header Style Adaptation */
      ${theme.headerStyle === 'solid_bar' ? `
        header > div {
          border-radius: 0px !important;
          background-color: var(--bg-main) !important;
          border-bottom: 2px solid var(--border-main) !important;
        }
      ` : theme.headerStyle === 'editorial_clean' ? `
        header > div {
          border-radius: 0px !important;
          background-color: transparent !important;
          border: none !important;
          border-bottom: 1px solid var(--border-main) !important;
        }
      ` : `
        header .rounded-full {
          border-radius: ${rad.base === '0px' ? '0px' : '9999px'} !important;
          border-color: ${accent1}55 !important;
        }
      `}

      /* Background Atmosphere Pattern */
      ${pattern === 'dots' ? `
        .grid-bg, .noise-bg {
          background-image: radial-gradient(${accent1}25 1.5px, transparent 0) !important;
          background-size: 24px 24px !important;
        }
      ` : pattern === 'clean' ? `
        .grid-bg, .noise-bg {
          background-image: none !important;
        }
      ` : pattern === 'aurora' ? `
        .grid-bg, .noise-bg {
          background-image: radial-gradient(circle at 20% 20%, ${accent1}15 0%, transparent 40%), radial-gradient(circle at 80% 80%, ${accent2}15 0%, transparent 40%) !important;
          background-size: 100% 100% !important;
        }
      ` : `
        .grid-bg {
          background-size: 40px 40px !important;
          background-image: 
            linear-gradient(to right, ${accent1}12 1px, transparent 1px),
            linear-gradient(to bottom, ${accent1}12 1px, transparent 1px) !important;
        }
      `}
    `;
  };

  const refreshCustomization = async () => {
    try {
      setLoading(true);
      // Immediate localStorage hydration for fast theme load
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cnc_active_theme');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.presetId) {
              applyThemeToDOM(parsed);
            }
          } catch {
            // ignore
          }
        }
      }

      // Always fetch directly from server with cache-busting timestamp to prevent stale browser caches
      const res = await fetch(`/api/customization?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      const data = await safeParseJson(res);
      if (data.success && data.customization) {
        setCustomization(data.customization);
        applyThemeToDOM(data.customization.theme);
        if (typeof window !== 'undefined') {
          const sanitized = sanitizeThemeForStorage(data.customization.theme);
          safeSetLocalStorage('cnc_active_theme', sanitized);
        }
      }
    } catch (err) {
      console.warn('Backend customization load fallback:', err);
      applyThemeToDOM(customization.theme);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCustomization();
    if (typeof window !== 'undefined') {
      const handleRemoteSync = () => {
        refreshCustomization();
      };
      window.addEventListener('storage', handleRemoteSync);
      window.addEventListener('cnc_customization_saved', handleRemoteSync);

      const timer = setTimeout(() => {
        loadGoogleFontsBatch(FONT_CATALOG.map((f) => f.family));
      }, 50);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('storage', handleRemoteSync);
        window.removeEventListener('cnc_customization_saved', handleRemoteSync);
      };
    }
  }, []);

  const getPageContent = (pageKey: string): any => {
    if (!customization || !customization.pages) {
      return (DEFAULT_CUSTOMIZATION.pages as any)[pageKey] || {};
    }
    return (customization.pages as any)[pageKey] || (DEFAULT_CUSTOMIZATION.pages as any)[pageKey] || {};
  };

  const applyPreviewTokens = (tokens: Partial<ThemeTokens>) => {
    const merged = { ...customization.theme, ...tokens };
    setCustomization((prev) => ({ ...prev, theme: merged }));
    if (typeof window !== 'undefined') {
      const sanitized = sanitizeThemeForStorage(merged);
      safeSetLocalStorage('cnc_active_theme', sanitized);
    }
    applyThemeToDOM(merged);
  };

  const saveTheme = async (themeToSave: ThemeTokens): Promise<boolean> => {
    try {
      const token = localStorage.getItem('saad_admin_token') || 'saad_adm_master_active';
      const cleanTheme = { ...themeToSave };
      if (cleanTheme.customLogoUrl?.startsWith('data:')) delete cleanTheme.customLogoUrl;
      if (cleanTheme.customSiteIconUrl?.startsWith('data:')) delete cleanTheme.customSiteIconUrl;

      // 1. Call dedicated theme endpoint
      const res = await fetch('/api/customization/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: themeToSave }),
      });
      const data = await safeParseJson(res);

      if (data.success && data.theme) {
        setCustomization((prev) => ({
          ...prev,
          theme: data.theme,
        }));
        applyThemeToDOM(data.theme);
        if (typeof window !== 'undefined') {
          safeSetLocalStorage('cnc_active_theme', sanitizeThemeForStorage(data.theme));
          window.dispatchEvent(new Event('cnc_customization_saved'));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save theme to server:', err);
      return false;
    }
  };

  const updatePageContent = async (pageKey: string, pageData: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem('saad_admin_token') || 'saad_adm_master_active';
      const res = await fetch(`/api/pages/${pageKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pageData),
      });
      const data = await safeParseJson(res);
      if (data.success) {
        setCustomization((prev) => ({
          ...prev,
          pages: {
            ...prev.pages,
            [pageKey]: {
              ...(prev.pages as any)[pageKey],
              ...pageData,
            },
          },
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Fallback optimistic page update:', err);
      setCustomization((prev) => ({
        ...prev,
        pages: {
          ...prev.pages,
          [pageKey]: {
            ...(prev.pages as any)[pageKey],
            ...pageData,
          },
        },
      }));
      return true;
    }
  };

  const resetPageContent = async (pageKey: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('saad_admin_token') || 'saad_adm_master_active';
      const res = await fetch(`/api/pages/reset/${pageKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await safeParseJson(res);
      if (data.success) {
        await refreshCustomization();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to reset page content:', err);
      return false;
    }
  };

  const importPagesJson = async (pagesJson: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem('saad_admin_token') || 'saad_adm_master_active';
      const res = await fetch('/api/pages-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pagesJson),
      });
      const data = await safeParseJson(res);
      if (data.success) {
        await refreshCustomization();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to import pages:', err);
      return false;
    }
  };

  return (
    <CustomizationContext.Provider
      value={{
        customization,
        loading,
        getPageContent,
        refreshCustomization,
        applyPreviewTokens,
        saveTheme,
        updatePageContent,
        resetPageContent,
        importPagesJson,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => useContext(CustomizationContext);
