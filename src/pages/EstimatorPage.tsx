import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  MessageSquare,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Cpu,
  Palette,
  Search,
  Server,
  Code2,
  Copy,
  Check,
} from 'lucide-react';
import { SITE_CONFIG } from '../data/site.ts';
import { BUDGET_BENCHMARKS, ESTIMATE_TO_QUOTE_STEPS } from '../data/websiteContent.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface EstimatorPageProps {
  onNavigate: (path: string) => void;
}

interface ProjectArchetype {
  id: string;
  name: string;
  serviceCategory: string;
  subtitle: string;
  description: string;
  baseHours: number;
  timeline: string;
  icon: any;
}

interface ServiceSubItem {
  id: string;
  name: string;
  description: string;
  hours: number;
  badge?: string;
}

interface Step2Config {
  title: string;
  subtitle: string;
  primaryControl?: {
    type: 'slider' | 'options';
    label: string;
    description: string;
    min?: number;
    max?: number;
    unit?: string;
  };
  secondaryControl?: {
    label: string;
    options: {
      id: string;
      label: string;
      sub: string;
      hours: number;
    }[];
  };
  deliverablesList: ServiceSubItem[];
}

const PROJECT_ARCHETYPES: ProjectArchetype[] = [
  {
    id: 'ecommerce-development',
    name: 'E-Commerce Development',
    serviceCategory: '01 · E-COMMERCE DEVELOPMENT',
    subtitle: 'Shopify, WooCommerce & Custom Online Stores',
    description: 'A complete online shop where customers can browse your products on their phone, add to cart, and pay safely with credit cards, Apple Pay, or PayPal.',
    baseHours: 12,
    timeline: '2 – 3 Weeks',
    icon: ShoppingBag,
  },
  {
    id: 'web-development',
    name: 'Web Development',
    serviceCategory: '02 · WEB DEVELOPMENT',
    subtitle: 'Fast, Mobile-Friendly & Easy to Edit Websites',
    description: 'A clean, modern website designed to make your business look trustworthy, open instantly on phones, and bring you customer inquiries.',
    baseHours: 8,
    timeline: '1 – 2 Weeks',
    icon: Code2,
  },
  {
    id: 'branding-design',
    name: 'Branding & Design',
    serviceCategory: '03 · BRANDING & DESIGN',
    subtitle: 'Logos, Brand Systems, Social Banners & Print',
    description: 'A complete visual identity for your brand: high-resolution logos, matching social media banners, printed flyers, business cards, and design systems.',
    baseHours: 5,
    timeline: '3 – 5 Days',
    icon: Palette,
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    serviceCategory: '04 · DIGITAL MARKETING',
    subtitle: 'SEO, Google Maps, Paid Ads & Lead Analytics',
    description: 'Help your business rank higher on Google search and maps, launch targeted ad campaigns, and track every new lead and conversion.',
    baseHours: 5,
    timeline: '4 – 7 Days',
    icon: Search,
  },
  {
    id: 'web-app-development',
    name: 'Web App Development',
    serviceCategory: '05 · WEB APP DEVELOPMENT',
    subtitle: 'Interactive Calculators, Client Portals & Dashboards',
    description: 'Have a custom workflow or SaaS idea? An instant quote estimator for your clients, a customer booking portal, or a private analytics dashboard.',
    baseHours: 16,
    timeline: '2 – 4 Weeks',
    icon: Cpu,
  },
  {
    id: 'hosting-maintenance',
    name: 'Hosting & Maintenance',
    serviceCategory: '06 · HOSTING & MAINTENANCE',
    subtitle: 'Cloud Hosting, Daily Backups & 24/7 Care',
    description: 'Fast, reliable cloud hosting, automatic daily safety backups, domain & SSL setup, and direct WhatsApp support whenever you need updates.',
    baseHours: 3,
    timeline: '1 – 3 Days / Monthly',
    icon: Server,
  },
];

// Tailored Step 2 Configurations per Archetype in Plain English
const ARCHETYPE_STEP2_CONFIG: Record<string, Step2Config> = {
  'branding-design': {
    title: 'Step 02 · Choose Your Graphic Design & Branding Items',
    subtitle: 'Pick exactly which items you want created for your business (logos, social media covers, flyers, business cards).',
    secondaryControl: {
      label: 'Brand Style Guide Depth:',
      options: [
        {
          id: 'essential',
          label: 'Quick Brand Style Sheet',
          sub: 'Primary logo rules, exact color codes & font names (+1.5h)',
          hours: 1.5,
        },
        {
          id: 'comprehensive',
          label: 'Full Brand Guidebook (PDF)',
          sub: 'Complete manual showing how to use your logo and colors everywhere (+3.5h)',
          hours: 3.5,
        },
        {
          id: 'design-system',
          label: 'Digital Design Kit',
          sub: 'Figma files and web colors ready for developers and digital ads (+5h)',
          hours: 5,
        },
      ],
    },
    deliverablesList: [
      {
        id: 'brand-logo-suite',
        name: 'Complete Logo Package (Primary, Secondary & Icon)',
        description: 'A sharp, custom logo with versions for light backgrounds, dark backgrounds, and square profile icons so it looks crisp everywhere.',
        hours: 4.5,
        badge: 'LOGO PACKAGE',
      },
      {
        id: 'brand-digital-banners',
        name: 'Website Banners & Header Images',
        description: 'Eye-catching banner images and promotional graphics for your website homepage, sales announcements, or special deals.',
        hours: 2.5,
        badge: 'DIGITAL',
      },
      {
        id: 'brand-social-pack',
        name: 'Social Media Graphics Kit',
        description: 'Profile pictures, matching cover banners, and reusable post templates for Instagram, Facebook, and LinkedIn.',
        hours: 2.5,
        badge: 'SOCIAL MEDIA',
      },
      {
        id: 'brand-print-flyers',
        name: 'Print-Ready Flyers, Leaflets & Posters',
        description: 'Promotional flyers, leaflets, or event posters designed in print-ready quality, ready to send to VistaPrint or any local printer.',
        hours: 2.5,
        badge: 'PRINT READY',
      },
      {
        id: 'brand-business-stationery',
        name: 'Business Cards & Official Letterhead',
        description: 'Double-sided luxury business card designs and official company letterhead documents for sending quotes or invoices.',
        hours: 1.5,
        badge: 'BUSINESS CARDS',
      },
      {
        id: 'brand-brochure',
        name: 'Folding Company Brochure or Price Menu',
        description: 'A folding paper brochure or digital PDF booklet showcasing your services, prices, or product catalog.',
        hours: 3.5,
        badge: 'BROCHURE / MENU',
      },
      {
        id: 'brand-pitch-deck',
        name: 'Presentation Slides Template (10+ Slides)',
        description: 'A clean slide presentation template (PowerPoint / PDF) to show your services to clients or pitch your business.',
        hours: 4.0,
        badge: 'SLIDES',
      },
      {
        id: 'brand-packaging-mockups',
        name: 'Realistic 3D Product & Merchandise Previews',
        description: 'Realistic pictures showing what your logo and branding look like on real boxes, bags, t-shirts, cups, or phone screens.',
        hours: 2.5,
        badge: '3D PREVIEWS',
      },
    ],
  },

  'digital-marketing': {
    title: 'Step 02 · Choose Your Marketing & Search Goals',
    subtitle: 'Select how you want to reach new customers (Google search, local maps, or paid ads).',
    secondaryControl: {
      label: 'Where are your target customers?',
      options: [
        {
          id: 'local',
          label: 'Local Town & Nearby Cities',
          sub: 'Google Business Profile, local maps, and town search targeting (+1.5h)',
          hours: 1.5,
        },
        {
          id: 'national',
          label: 'Across the Whole Country',
          sub: 'Target customers across the entire UK / country with search keywords (+3.5h)',
          hours: 3.5,
        },
        {
          id: 'omnichannel',
          label: 'All-In-One Growth Setup',
          sub: 'Google search + Google Ads + social media ads combined (+6h)',
          hours: 6,
        },
      ],
    },
    deliverablesList: [
      {
        id: 'mkt-seo-technical-audit',
        name: 'Google Search Health Check & Error Fixes',
        description: 'We check why your website isn\'t showing up on Google, fix broken links, and make sure search engines can easily find you.',
        hours: 2.5,
        badge: 'GOOGLE SEARCH',
      },
      {
        id: 'mkt-schema-rich-snippets',
        name: 'Google Search Star Ratings & Rich Highlights',
        description: 'Add special search info so your business can show review stars, FAQs, and price info directly on Google search results.',
        hours: 1.8,
        badge: 'SEARCH STARS',
      },
      {
        id: 'mkt-ga4-event-tracking',
        name: 'Visitor Tracking & Lead Reports (Google Analytics)',
        description: 'See how many people visit your website, where they came from, and whenever someone fills out your contact form.',
        hours: 1.8,
        badge: 'REPORTS',
      },
      {
        id: 'mkt-google-ads-campaign',
        name: 'Google Search Ads Campaign Setup',
        description: 'Set up paid ads on Google so you appear at the very top of search results when people search for what you offer.',
        hours: 3.0,
        badge: 'GOOGLE ADS',
      },
      {
        id: 'mkt-meta-ad-creatives',
        name: 'Facebook & Instagram Ad Banners & Headlines',
        description: 'Ad images and headlines designed specifically to grab attention on Facebook and Instagram feeds and stories.',
        hours: 2.5,
        badge: 'SOCIAL ADS',
      },
      {
        id: 'mkt-social-og-cards',
        name: 'Nice Link Previews on WhatsApp & Social Media',
        description: 'Makes your website link show a nice picture, title, and description when you share it on WhatsApp, iMessage, Facebook, or LinkedIn.',
        hours: 1.2,
        badge: 'WHATSAPP PREVIEWS',
      },
      {
        id: 'mkt-email-marketing-flow',
        name: 'Automated Customer Welcome Emails',
        description: 'Automatically send a friendly welcome email or information packet when a new customer sends an inquiry.',
        hours: 2.5,
        badge: 'EMAIL ALERTS',
      },
    ],
  },

  'hosting-maintenance': {
    title: 'Step 02 · Choose Your Hosting & Peace-of-Mind Care',
    subtitle: 'Select your website setup, backup frequency, and ongoing support level.',
    secondaryControl: {
      label: 'Monthly Support Plan:',
      options: [
        {
          id: 'one-time-setup',
          label: 'One-Time Setup Only',
          sub: 'We set up hosting, connect your domain, and hand over the keys (+0h)',
          hours: 0,
        },
        {
          id: 'monthly-standard',
          label: 'Standard Monthly Care Plan',
          sub: 'Monthly updates, weekly backups & 24/7 uptime monitoring (+2.5h)',
          hours: 2.5,
        },
        {
          id: 'monthly-priority',
          label: 'VIP Peace-of-Mind Plan',
          sub: 'Direct WhatsApp support, daily safety backups & free monthly edits (+5h)',
          hours: 5,
        },
      ],
    },
    deliverablesList: [
      {
        id: 'ops-cloud-deployment',
        name: 'Fast & Secure Website Hosting Setup',
        description: 'We put your website online on reliable, modern cloud hosting so it opens fast for visitors anywhere in the world.',
        hours: 1.8,
        badge: 'FAST HOSTING',
      },
      {
        id: 'ops-custom-dns-ssl',
        name: 'Connect Your Web Domain & Free SSL Padlock',
        description: 'Connect your chosen web address (e.g. yourbusiness.com) with the secure lock icon so visitors know your site is safe.',
        hours: 1.2,
        badge: 'SECURITY PADLOCK',
      },
      {
        id: 'ops-automated-backups',
        name: 'Automatic Daily Backups & Safety Copies',
        description: 'Automatic daily copies of your entire website stored safely in the cloud, so if anything goes wrong, it can be restored in minutes.',
        hours: 1.5,
        badge: 'DAILY BACKUPS',
      },
      {
        id: 'ops-speed-optimization',
        name: 'Website Speed Booster',
        description: 'Clean up images and code so your website loads in under 1 second on mobile phones, keeping visitors from clicking away.',
        hours: 2.0,
        badge: 'SPEED BOOST',
      },
      {
        id: 'ops-security-firewall',
        name: 'Website Security & Hacker Protection',
        description: 'Shield your website against spam bots, brute-force password attacks, and hackers.',
        hours: 1.8,
        badge: 'HACKER SHIELD',
      },
      {
        id: 'ops-uptime-monitoring',
        name: '24/7 Uptime Checking (Instant Alerts)',
        description: 'Automatic system checks your website every minute. If it ever goes down, Saad gets an alert immediately to fix it.',
        hours: 1.0,
        badge: '24/7 CHECKS',
      },
    ],
  },

  'web-development': {
    title: 'Step 02 · Choose Page Count & Extra Features',
    subtitle: 'Select how many pages you need and what special features you want included.',
    primaryControl: {
      type: 'slider',
      label: 'How Many Pages Does Your Website Need?',
      description: 'Typical pages include: Home, About Us, Services, Pricing / Menu, Contact Us, and Photo Gallery.',
      min: 1,
      max: 15,
      unit: 'Pages',
    },
    secondaryControl: {
      label: 'Do you already have your words & photos?',
      options: [
        {
          id: 'ready',
          label: 'I Have Words & Photos Ready',
          sub: 'You supply your text and pictures (+0h)',
          hours: 0,
        },
        {
          id: 'needs-refinement',
          label: 'I Have Rough Drafts',
          sub: 'I help polish and organize your text (+1.5h)',
          hours: 1.5,
        },
        {
          id: 'from-scratch',
          label: 'Need Help from Scratch',
          sub: 'I write professional words and find great photos (+3h)',
          hours: 3,
        },
      ],
    },
    deliverablesList: [
      {
        id: 'web-contact-routing',
        name: 'Customer Contact Form Sent Directly to Your Email',
        description: 'Visitors fill out their name, phone, and message, and it arrives instantly in your inbox with spam protection.',
        hours: 1.2,
        badge: 'ESSENTIAL',
      },
      {
        id: 'web-dark-light-mode',
        name: 'Dark & Light Mode Switcher',
        description: 'Allows your visitors to switch comfortably between a dark mode and a clean light mode.',
        hours: 1.0,
        badge: 'LOOK & FEEL',
      },
      {
        id: 'web-framer-motion',
        name: 'Smooth Animations & Visual Polish',
        description: 'Smooth button clicks, subtle page animations, and modern transitions that make your site feel premium and lively.',
        hours: 1.8,
        badge: 'PREMIUM FEEL',
      },
      {
        id: 'web-seo-schema',
        name: 'Built-In Google Search Setup',
        description: 'Proper page titles, descriptions, and keywords so search engines understand your business and show it to customers.',
        hours: 1.8,
        badge: 'GOOGLE SEARCH',
      },
      {
        id: 'web-training-video',
        name: 'Personal Video Guide on How to Edit Words',
        description: 'A short, easy-to-follow video showing you exactly how to change words, update prices, or add pictures yourself anytime.',
        hours: 1.2,
        badge: 'EASY UPDATES',
      },
    ],
  },

  'ecommerce-development': {
    title: 'Step 02 · Choose Store Size & Shopping Features',
    subtitle: 'Select how many products you are launching with and which shopping tools you want.',
    primaryControl: {
      type: 'slider',
      label: 'How Many Products Do You Want to Sell to Start?',
      description: 'Each product configured with photos, descriptions, prices, and options (sizes/colors).',
      min: 1,
      max: 50,
      unit: 'Products',
    },
    secondaryControl: {
      label: 'Which store platform do you prefer?',
      options: [
        {
          id: 'shopify',
          label: 'Shopify (Most Popular & Easy)',
          sub: 'Simple to manage from your phone with official app (+0h)',
          hours: 0,
        },
        {
          id: 'woocommerce',
          label: 'WooCommerce (WordPress)',
          sub: '100% free ownership with no monthly software fee (+2h)',
          hours: 2,
        },
        {
          id: 'headless-react',
          label: 'Custom Bespoke Store',
          sub: 'Custom shopping cart with Stripe card checkout (+4.5h)',
          hours: 4.5,
        },
      ],
    },
    deliverablesList: [
      {
        id: 'ecom-payment-gateway',
        name: 'Accept Credit Cards, Apple Pay & PayPal',
        description: 'Let customers pay securely using debit/credit cards, Apple Pay, Google Pay, or PayPal directly into your bank account.',
        hours: 2.5,
        badge: 'PAYMENTS',
      },
      {
        id: 'ecom-cart-drawer',
        name: 'Fast Slide-Out Shopping Cart',
        description: 'Customers see their shopping bag instantly without leaving the page, with a progress bar showing how close they are to free shipping.',
        hours: 2.0,
        badge: 'SHOPPING CART',
      },
      {
        id: 'ecom-product-variants',
        name: 'Product Options (Sizes, Colors, Styles)',
        description: 'Let shoppers choose different sizes, colors, or styles, with photos that change automatically to match.',
        hours: 2.0,
        badge: 'PRODUCT OPTIONS',
      },
      {
        id: 'ecom-coupons-discounts',
        name: 'Discount Codes & Special Sales',
        description: 'Create promo codes (like SAVE10) or automatic bulk deals (like Buy 2, Get 10% Off).',
        hours: 1.5,
        badge: 'DISCOUNTS',
      },
      {
        id: 'ecom-customer-accounts',
        name: 'Customer Accounts & Order Tracking',
        description: 'Customers can log in, view their past purchases, and track shipping status.',
        hours: 2.5,
        badge: 'ACCOUNTS',
      },
    ],
  },

  'web-app-development': {
    title: 'Step 02 · Choose App Features & Login Requirements',
    subtitle: 'Configure your custom online tool, user accounts, and data options.',
    secondaryControl: {
      label: 'Do your users need to log in?',
      options: [
        {
          id: 'client-only',
          label: 'No Login Needed (Open to Public)',
          sub: 'Anyone can use the calculator or tool directly on your website (+0h)',
          hours: 0,
        },
        {
          id: 'user-auth',
          label: 'User Accounts (Email or Google Login)',
          sub: 'Customers sign in to save their quotes, files, or information (+3.5h)',
          hours: 3.5,
        },
        {
          id: 'full-stack-rbac',
          label: 'Team & Admin Permissions',
          sub: 'Different permission levels for Owners, Staff, and Customers (+7h)',
          hours: 7,
        },
      ],
    },
    deliverablesList: [
      {
        id: 'app-interactive-engine',
        name: 'Custom Online Calculator or Interactive Tool',
        description: 'An interactive tool on your website that calculates quotes, estimates, or answers customer questions automatically.',
        hours: 4.5,
        badge: 'CUSTOM TOOL',
      },
      {
        id: 'app-rest-api',
        name: 'Connect to Your Other Business Apps',
        description: 'Connect your website to your CRM, booking software, email list, or payment tools so data updates automatically.',
        hours: 3.5,
        badge: 'APP SYNC',
      },
      {
        id: 'app-dashboard-charts',
        name: 'Visual Graphs & Business Dashboard',
        description: 'Easy-to-read charts, numbers, and stats showing your sales, leads, or business metrics at a glance.',
        hours: 3.5,
        badge: 'DASHBOARD',
      },
      {
        id: 'app-export-suite',
        name: 'Download PDF Quotes or Excel/CSV Files',
        description: 'Let you or your customers download printable PDF summaries, quotes, or spreadsheet files with 1 click.',
        hours: 2.5,
        badge: 'PDF DOWNLOADS',
      },
    ],
  },
};

const DELIVERY_TIERS = [
  {
    id: 'standard',
    name: 'Standard Milestone Pace',
    multiplier: 1.0,
    tag: 'REGULAR PACE',
    description: 'Comfortable timeline with regular preview links for you to review and give feedback.',
  },
  {
    id: 'express',
    name: 'Priority Rush Delivery',
    multiplier: 1.2,
    tag: 'FAST TRACK',
    description: 'Priority schedule allocation if you have an urgent deadline or launch date to hit.',
  },
];

export const EstimatorPage: React.FC<EstimatorPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('estimator') || {};

  // State
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('ecommerce-development');
  const [pageCount, setPageCount] = useState<number>(5);
  const [productCount, setProductCount] = useState<number>(10);
  const [secondaryOptionId, setSecondaryOptionId] = useState<string>('shopify');
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    'ecom-payment-gateway',
    'ecom-cart-drawer',
    'ecom-product-variants',
    'ecom-coupons-discounts',
  ]);
  const [deliveryTier, setDeliveryTier] = useState<'standard' | 'express'>('standard');
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Selected Archetype
  const currentArchetype =
    PROJECT_ARCHETYPES.find((a) => a.id === selectedArchetypeId) || PROJECT_ARCHETYPES[0];

  const currentStep2Config =
    ARCHETYPE_STEP2_CONFIG[selectedArchetypeId] || ARCHETYPE_STEP2_CONFIG['ecommerce-development'];

  // When user switches archetype in Step 1, smart-sync initial defaults for Step 2
  const handleSelectArchetype = (archetypeId: string) => {
    setSelectedArchetypeId(archetypeId);
    const config = ARCHETYPE_STEP2_CONFIG[archetypeId];
    if (config) {
      if (config.secondaryControl?.options.length) {
        setSecondaryOptionId(config.secondaryControl.options[0].id);
      }
      // Pre-select the first 3-4 typical items
      const initialIds = config.deliverablesList.slice(0, 4).map((d) => d.id);
      setSelectedDeliverables(initialIds);
    }
  };

  // Toggle deliverable
  const toggleDeliverable = (id: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllDeliverables = () => {
    setSelectedDeliverables(currentStep2Config.deliverablesList.map((d) => d.id));
  };

  const handleClearDeliverables = () => {
    setSelectedDeliverables([]);
  };

  // Calculations
  let primaryControlHours = 0;
  if (selectedArchetypeId === 'web-development') {
    primaryControlHours = Math.max(0, pageCount - 3) * 1.5;
  } else if (selectedArchetypeId === 'ecommerce-development') {
    primaryControlHours = Math.max(0, Math.ceil((productCount - 5) / 5)) * 1.0;
  }

  let secondaryControlHours = 0;
  if (currentStep2Config.secondaryControl) {
    const selectedOpt = currentStep2Config.secondaryControl.options.find(
      (o) => o.id === secondaryOptionId
    );
    if (selectedOpt) {
      secondaryControlHours = selectedOpt.hours;
    }
  }

  const deliverablesHours = selectedDeliverables.reduce((total, id) => {
    const item = currentStep2Config.deliverablesList.find((d) => d.id === id);
    return total + (item ? item.hours : 0);
  }, 0);

  const currentTierObj = DELIVERY_TIERS.find((t) => t.id === deliveryTier) || DELIVERY_TIERS[0];
  const rawHours =
    currentArchetype.baseHours + primaryControlHours + secondaryControlHours + deliverablesHours;
  const totalEstimatedHours = Math.round(rawHours * currentTierObj.multiplier * 10) / 10;
  const totalCost = Math.round(totalEstimatedHours * SITE_CONFIG.hourlyRateNumber);

  // Plain English Quote Generator
  const generateQuoteText = () => {
    const deliverableNames = selectedDeliverables
      .map((id) => currentStep2Config.deliverablesList.find((d) => d.id === id)?.name)
      .filter(Boolean)
      .join('\n  • ');

    const secondaryLabel = currentStep2Config.secondaryControl
      ? currentStep2Config.secondaryControl.options.find((o) => o.id === secondaryOptionId)?.label ||
        'Standard'
      : 'Standard';

    return `CLICK N CREATE · PROJECT PRICE ESTIMATE
Prepared by Saad M (Freelance Web Developer & Designer)
--------------------------------------------------
Service Category: ${currentArchetype.serviceCategory}
Project Type: ${currentArchetype.name}
Scope Choice: ${
      selectedArchetypeId === 'web-development'
        ? `${pageCount} Total Pages`
        : selectedArchetypeId === 'ecommerce-development'
        ? `${productCount} Initial Products`
        : secondaryLabel
    }
Package Option: ${secondaryLabel}
Delivery Schedule: ${currentTierObj.name}
Expected Delivery: ${currentArchetype.timeline}

What is included:
  • ${deliverableNames || 'Core Setup & Foundation'}

ESTIMATED WORK TIME: ~${totalEstimatedHours} hours
RATE: £${SITE_CONFIG.hourlyRateNumber}/hour (Fixed milestone package available)
ESTIMATED TOTAL COST: £${totalCost.toLocaleString()}

Contact Saad directly:
Email: saadm.clickncreate@gmail.com
WhatsApp: +44 7927 548123`;
  };

  const saveQuoteToBackend = async () => {
    try {
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedArchetypeId,
          serviceName: currentArchetype.name,
          baseHours: currentArchetype.baseHours,
          selectedDeliverables,
          pageCount: selectedArchetypeId === 'web-development' ? pageCount : undefined,
          productCount: selectedArchetypeId === 'ecommerce-development' ? productCount : undefined,
          deliveryTier,
          deliveryMultiplier: currentTierObj.multiplier,
          totalEstimatedHours,
          hourlyRate: SITE_CONFIG.hourlyRateNumber,
          totalCost,
          timeline: currentArchetype.timeline,
        }),
      });
    } catch (err) {
      console.warn('Backend quote log fallback:', err);
    }
  };

  const handleCopyQuote = () => {
    saveQuoteToBackend();
    navigator.clipboard.writeText(generateQuoteText());
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handleSendToWhatsApp = () => {
    saveQuoteToBackend();
    const encoded = encodeURIComponent(generateQuoteText());
    window.open(`https://wa.me/447927548123?text=${encoded}`, '_blank');
  };

  return (
    <div className="pt-28 pb-24 md:pt-36 relative overflow-x-clip w-full max-w-full">
      <SEOHead
        title="Interactive Project Cost & Hour Estimator | Click N Create"
        description="Calculate instant upfront website prices, development hours, and milestone scopes with Saad M's transparent £35/hr interactive project estimator."
        canonicalPath="/estimator"
        keywords={[
          'website cost estimator',
          'calculate website price',
          'freelance developer cost calculator',
          'hourly rate project calculator',
          'Click N Create estimator'
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header in Plain English */}
        <div className="max-w-3xl mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
              isDark
                ? 'border-[#38BDF8]/30 bg-[#0C1222]/90 text-[#38BDF8]'
                : 'border-[#1D4ED8]/30 bg-[#F3E9DC]/75 text-[#1E40AF] font-semibold'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{cms.badgeText || 'Instant Price Calculator'}</span>
          </div>

          <h1
            className={`text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] ${
              isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
            }`}
          >
            {cms.heroTitle || 'PROJECT'} <span className="text-luxury-gradient">{cms.heroHighlight || 'ESTIMATOR'}</span>
          </h1>

          <p
            className={`mt-4 text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
            }`}
          >
            {cms.heroSubtitle || (
              <>
                Calculate an honest, upfront price in 3 simple steps. Choose what your business needs in <strong>Step 1</strong>, pick your exact items in <strong>Step 2</strong> (like logos, banners, flyers, or search ranking), and get a transparent price with no hidden surprises.
              </>
            )}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Select Service Category */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2
                  className={`text-xs font-mono uppercase tracking-widest font-bold ${
                    isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                  }`}
                >
                  Step 01 · What does your business need?
                </h2>
                <span className={`text-xs font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  6 Clear Options
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_ARCHETYPES.map((archetype) => {
                  const Icon = archetype.icon;
                  const isSelected = selectedArchetypeId === archetype.id;

                  return (
                    <button
                      key={archetype.id}
                      type="button"
                      onClick={() => handleSelectArchetype(archetype.id)}
                      className={`text-left p-4 rounded-2xl border transition-all text-sm relative group cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-[#38BDF8] bg-[#38BDF8]/10 shadow-[0_0_25px_rgba(56, 189, 248,0.18)]'
                            : 'border-[#1D4ED8] bg-[#F3E9DC]/70 shadow-md'
                          : isDark
                          ? 'border-white/10 bg-[#0C1222]/85 hover:border-[#38BDF8]/40'
                          : 'border-black/10 bg-white hover:border-[#1D4ED8]/40 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? isDark
                                ? 'bg-[#38BDF8] text-[#060913] font-bold'
                                : 'bg-[#1D4ED8] text-white font-bold'
                              : isDark
                              ? 'bg-[#1A1D25] text-[#38BDF8]'
                              : 'bg-[#F3E9DC] text-[#1E40AF]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`font-mono text-xs ${
                            isSelected
                              ? isDark ? 'text-[#38BDF8] font-bold' : 'text-[#1E40AF] font-bold'
                              : isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                          }`}
                        >
                          ~{archetype.baseHours}h base
                        </span>
                      </div>

                      <div className={`text-[10px] font-mono uppercase tracking-wider mb-0.5 ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                        {archetype.serviceCategory}
                      </div>

                      <h3
                        className={`font-bold mb-1 ${
                          isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                        }`}
                      >
                        {archetype.name}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed ${
                          isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                        }`}
                      >
                        {archetype.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Dynamic Tailored Deliverables */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.08] dark:border-white/[0.08] pb-3">
                <div>
                  <h2
                    className={`text-xs font-mono uppercase tracking-widest ${
                      isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8] font-bold'
                    }`}
                  >
                    {currentStep2Config.title}
                  </h2>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    {currentStep2Config.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
                  <button
                    type="button"
                    onClick={handleSelectAllDeliverables}
                    className={`hover:underline cursor-pointer ${
                      isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8] font-semibold'
                    }`}
                  >
                    Select All
                  </button>
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>·</span>
                  <button
                    type="button"
                    onClick={handleClearDeliverables}
                    className={`hover:underline cursor-pointer ${
                      isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                    }`}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Slider for Pages or Products */}
              {currentStep2Config.primaryControl && (
                <div
                  className={`p-5 rounded-2xl border transition-colors ${
                    isDark ? 'border-white/10 bg-[#0C1222]' : 'border-stone-200 bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-mono font-bold block mb-0.5">
                        {currentStep2Config.primaryControl.label}
                      </span>
                      <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        {currentStep2Config.primaryControl.description}
                      </p>
                    </div>
                    <span
                      className={`text-xl font-bold font-mono px-3.5 py-1 rounded-xl ${
                        isDark ? 'bg-[#38BDF8]/15 text-[#BAE6FD]' : 'bg-[#F3E9DC] text-[#1E40AF]'
                      }`}
                    >
                      {selectedArchetypeId === 'web-development' ? pageCount : productCount}{' '}
                      {currentStep2Config.primaryControl.unit}
                    </span>
                  </div>

                  {selectedArchetypeId === 'web-development' ? (
                    <input
                      type="range"
                      min={currentStep2Config.primaryControl.min || 1}
                      max={currentStep2Config.primaryControl.max || 15}
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className={`w-full cursor-pointer ${
                        isDark ? 'accent-[#38BDF8]' : 'accent-[#1D4ED8]'
                      }`}
                    />
                  ) : (
                    <input
                      type="range"
                      min={currentStep2Config.primaryControl.min || 1}
                      max={currentStep2Config.primaryControl.max || 50}
                      value={productCount}
                      onChange={(e) => setProductCount(Number(e.target.value))}
                      className={`w-full cursor-pointer ${
                        isDark ? 'accent-[#38BDF8]' : 'accent-[#1D4ED8]'
                      }`}
                    />
                  )}
                </div>
              )}

              {/* Scope Depth or Option Selector */}
              {currentStep2Config.secondaryControl && (
                <div
                  className={`p-5 rounded-2xl border transition-colors ${
                    isDark ? 'border-white/10 bg-[#0C1222]' : 'border-stone-200 bg-white shadow-2xs'
                  }`}
                >
                  <span
                    className={`text-xs font-mono block mb-2.5 uppercase tracking-wider ${
                      isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                    }`}
                  >
                    {currentStep2Config.secondaryControl.label}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {currentStep2Config.secondaryControl.options.map((opt) => {
                      const isSelected = secondaryOptionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSecondaryOptionId(opt.id)}
                          className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                            isSelected
                              ? isDark
                                ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#F1F5F9] font-bold'
                                : 'border-[#1D4ED8] bg-[#F3E9DC] text-[#0F172A] font-bold'
                              : isDark
                              ? 'border-white/10 text-[#94A3B8] hover:text-[#F1F5F9]'
                              : 'border-stone-200 text-[#475569] bg-white'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{opt.label}</span>
                            {isSelected && (
                              <Check
                                className={`w-3.5 h-3.5 ${
                                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                                }`}
                              />
                            )}
                          </div>
                          <div
                            className={`text-[10px] mt-1 leading-snug ${
                              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                            }`}
                          >
                            {opt.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Plain English Deliverables Checklist */}
              <div className="space-y-2.5 pt-2">
                <span
                  className={`text-xs font-mono block mb-1 uppercase tracking-wider ${
                    isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                  }`}
                >
                  Check the items you want included ({selectedDeliverables.length} selected):
                </span>

                {currentStep2Config.deliverablesList.map((item) => {
                  const isChecked = selectedDeliverables.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleDeliverable(item.id)}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                        isChecked
                          ? isDark
                            ? 'border-[#38BDF8]/65 bg-[#38BDF8]/10'
                            : 'border-[#1D4ED8] bg-[#F3E9DC]/70 shadow-2xs'
                          : isDark
                          ? 'border-white/8 bg-[#0C1222] hover:border-white/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                            isChecked
                              ? isDark
                                ? 'bg-[#38BDF8] border-[#38BDF8] text-[#060913] font-bold'
                                : 'bg-[#1D4ED8] border-[#1D4ED8] text-white font-bold'
                              : isDark
                              ? 'border-white/20 bg-[#060913]'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                                  isDark
                                    ? 'bg-[#38BDF8]/15 text-[#BAE6FD] border border-[#38BDF8]/30'
                                    : 'bg-[#F3E9DC] text-[#1E40AF]'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                                isDark ? 'bg-white/8 text-[#BAE6FD]' : 'bg-[#F3E9DC] text-[#1E40AF]'
                              }`}
                            >
                              +{item.hours}h (~£{Math.round(item.hours * SITE_CONFIG.hourlyRateNumber)})
                            </span>
                          </div>
                          <p
                            className={`text-xs mt-1 leading-relaxed ${
                              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Delivery Timeline Pace */}
            <div className="space-y-4">
              <h2
                className={`text-xs font-mono uppercase tracking-widest ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8] font-bold'
                }`}
              >
                Step 03 · Delivery Pace & Timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DELIVERY_TIERS.map((tier) => {
                  const isSelected = deliveryTier === tier.id;

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setDeliveryTier(tier.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-[#38BDF8] bg-[#38BDF8]/12 text-[#F1F5F9]'
                            : 'border-[#1D4ED8] bg-[#F3E9DC]/80 text-[#0F172A]'
                          : isDark
                          ? 'border-white/10 bg-[#0C1222] text-[#94A3B8]'
                          : 'border-stone-200 bg-white text-[#475569]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm">{tier.name}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            isSelected
                              ? isDark
                                ? 'bg-[#38BDF8] text-[#060913] font-bold'
                                : 'bg-[#1D4ED8] text-white font-bold'
                              : isDark
                              ? 'bg-white/5 text-[#94A3B8]'
                              : 'bg-stone-100 text-[#475569]'
                          }`}
                        >
                          {tier.tag}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        {tier.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Live Price Summary & Direct Contact */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div
              className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-colors ${
                isDark
                  ? 'border-[#38BDF8]/35 bg-[#0C1222] shadow-[0_20px_50px_rgba(0,0,0,0.65)]'
                  : 'border-[#1D4ED8]/30 bg-white shadow-xl'
              }`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${
                  isDark ? 'via-[#38BDF8]' : 'via-[#1D4ED8]'
                } to-transparent opacity-80`}
              />

              <div className="flex items-center justify-between pb-5 border-b border-black/[0.08] dark:border-white/[0.08]">
                <div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest font-bold block ${
                      isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                    }`}
                  >
                    Your Instant Estimate
                  </span>
                  <h3
                    className={`text-xl font-bold font-display ${
                      isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                    }`}
                  >
                    Click N Create · Saad M
                  </h3>
                </div>
                <div
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold ${
                    isDark
                      ? 'bg-[#38BDF8]/15 text-[#BAE6FD] border border-[#38BDF8]/30'
                      : 'bg-[#F3E9DC] text-[#1E40AF] border border-[#1D4ED8]/30'
                  }`}
                >
                  Rate: £35/hr
                </div>
              </div>

              {/* Plain English Scope Summary */}
              <div className="py-5 space-y-3 font-mono text-xs border-b border-black/[0.08] dark:border-white/[0.08]">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Service:</span>
                  <span className={`font-semibold text-right ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                    {currentArchetype.serviceCategory}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Selected Type:</span>
                  <span className={`font-semibold text-right ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                    {currentArchetype.name}
                  </span>
                </div>

                {selectedArchetypeId === 'web-development' && (
                  <div className="flex justify-between items-center">
                    <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Page Count:</span>
                    <span className={`font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                      {pageCount} Total Pages
                    </span>
                  </div>
                )}

                {selectedArchetypeId === 'ecommerce-development' && (
                  <div className="flex justify-between items-center">
                    <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Products:</span>
                    <span className={`font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                      {productCount} Products Configured
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Included Items:</span>
                  <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                    {selectedDeliverables.length} Specific Items Checked
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Delivery Pace:</span>
                  <span className={`font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                    {currentTierObj.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Estimated Timeline:</span>
                  <span className={`font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                    {currentArchetype.timeline}
                  </span>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="py-6 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span
                      className={`text-xs uppercase font-mono tracking-wider block ${
                        isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                      }`}
                    >
                      Estimated Investment:
                    </span>
                    <span className={`text-xs font-mono ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                      ~{totalEstimatedHours} hours of work
                    </span>
                  </div>
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight tabular-nums ${
                      isDark ? 'text-[#BAE6FD]' : 'text-[#1E40AF]'
                    }`}
                  >
                    £{totalCost.toLocaleString()}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Clear, honest pricing based on £35/hr. Full ownership of all files and code, zero surprise charges, and direct communication with Saad.
                </p>
              </div>

              {/* Direct WhatsApp and Contact Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send This Estimate to WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyQuote}
                    className={`py-3 px-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      copiedQuote
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500'
                        : isDark
                        ? 'border-white/15 bg-white/5 hover:bg-white/10 text-[#F1F5F9]'
                        : 'border-stone-300 bg-white hover:bg-stone-50 text-[#0F172A] shadow-2xs'
                    }`}
                  >
                    {copiedQuote ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/contact')}
                    className={`py-3 px-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isDark
                        ? 'border-white/15 bg-white/5 hover:bg-white/10 text-[#F1F5F9]'
                        : 'border-stone-300 bg-white hover:bg-stone-50 text-[#0F172A] shadow-2xs'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Saad</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Reassurance Guarantees in Plain English */}
            <div
              className={`p-5 rounded-2xl border text-xs space-y-2.5 font-mono ${
                isDark
                  ? 'border-white/10 bg-[#0C1222] text-[#94A3B8]'
                  : 'border-stone-200 bg-white text-[#475569] shadow-2xs'
              }`}
            >
              <div
                className={`flex items-center gap-2 font-bold ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>The Click N Create Guarantee:</span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc">
                <li>100% full ownership of all website code and graphics</li>
                <li>Fixed-price milestone agreement so your price never changes</li>
                <li>Personal video tutorial on how to update words and photos yourself</li>
                <li>Direct phone & WhatsApp support with Saad</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===================== REAL-WORLD BUDGET BENCHMARKS ===================== */}
        <section className="mt-20 pt-16 border-t border-black/[0.08] dark:border-white/[0.08] space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className={`text-xs font-mono uppercase tracking-widest font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
              Reference Benchmarks
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              Typical Real-World Project Budgets
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
              Compare your calculated estimate above with four common scope benchmarks delivered at £35/hr or locked fixed milestone pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BUDGET_BENCHMARKS.map((item) => (
              <div
                key={item.tier}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-stone-200 bg-white shadow-2xs'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>{item.tier}</span>
                    <span className={`tabular-nums ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>{item.timeline}</span>
                  </div>
                  <h3 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                    {item.title}
                  </h3>
                  <div className={`text-xl font-black font-display tabular-nums ${isDark ? 'text-[#BAE6FD]' : 'text-[#1E40AF]'}`}>
                    {item.priceRange}
                  </div>
                  <div className={`text-xs font-mono tabular-nums ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    Approx. {item.hoursRange} @ £35/hr
                  </div>
                  <p className={`text-xs leading-relaxed pt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    {item.bestFor}
                  </p>
                </div>

                <ul className="space-y-1.5 pt-3 border-t border-black/10 dark:border-white/10 text-xs">
                  {item.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                      <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#334155]'}>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* From Calculator Estimate to Fixed Quote */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-stone-200 bg-[#F8FAFC]'
            }`}
          >
            <div>
              <span className={`text-xs font-mono uppercase tracking-wider font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                What Happens Next
              </span>
              <h3 className={`text-xl font-bold font-display mt-1 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                How Your Instant Estimate Becomes a Locked Fixed-Price Quote
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {ESTIMATE_TO_QUOTE_STEPS.map((step) => (
                <div
                  key={step.step}
                  className={`p-5 rounded-2xl border space-y-2 ${
                    isDark ? 'border-white/10 bg-[#070B16]' : 'border-stone-200 bg-white'
                  }`}
                >
                  <span className={`text-xs font-mono font-bold tabular-nums ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                    Step {step.step}
                  </span>
                  <h4 className={`text-sm font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                    {step.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
