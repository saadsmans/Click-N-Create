export interface NavItem {
  label: string;
  href: string;
}

export interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  techStack: string[];
}

export interface WhyReasonItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ProcessStageItem {
  number: string;
  stage: string;
  title: string;
  description: string;
  deliverables: string[];
  durationEstimate: string;
}

export const SITE_CONFIG = {
  brand: 'Click N Create',
  domain: 'clickncreate.co.uk',
  siteUrl: 'https://clickncreate.co.uk',
  freelancer: 'Saad M',
  role: 'Freelance Web Developer & Designer',
  headline: 'WEBSITES & ONLINE STORES BUILT TO GROW YOUR BUSINESS.',
  subheadline: 'I help business owners, shops, and creators get more customers with clean websites, easy-to-use online stores, memorable logos, and friendly direct support.',
  hourlyRate: '£35/hr',
  hourlyRateNumber: 35,
  currency: '£',
  email: 'saadm.clickncreate@gmail.com',
  phone: '+44 7927 548123',
  whatsappUrl: 'https://wa.me/447927548123',
  linkedinUrl: 'https://www.linkedin.com/in/saad-m-aa54bb375?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  location: 'United Kingdom',
  areaServed: 'United Kingdom, Europe, North America & Worldwide Remote',
  priceRange: '£35/hr',
  aboutSummary: 'Click N Create is run by Saad M. I build websites that look great, load instantly, and are easy for you to manage—with simple £35/hr pricing or fixed project quotes so there are never any surprise bills.',
  copyright: `© ${new Date().getFullYear()} Click N Create. Operated by Saad M. All rights reserved.`
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Estimator', href: '/estimator' },
  { label: 'Process', href: '/process' },
  { label: 'Standards', href: '/standards' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' }
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'wordpress-development',
    title: 'Easy-to-Edit Business Websites (WordPress)',
    description: 'A clean, modern website designed specifically for your company. You can easily log in to change words, swap out pictures, or add new blog posts anytime with zero coding knowledge.',
    highlights: ['Super simple visual editor for you to change text', 'Looks sharp on all phones, tablets & computers', 'Built-in security protection against spam & hackers', 'Loads fast so customers never wait'],
    techStack: ['WordPress', 'Simple Editor', 'Mobile Friendly', 'Fast & Secure']
  },
  {
    id: 'shopify-woocommerce',
    title: 'Online Stores (Shopify & WooCommerce)',
    description: 'A complete online shop where customers can easily browse your products on their phone, add items to a slide-out cart, and pay safely using credit cards, Apple Pay, or PayPal.',
    highlights: ['Accept debit cards, credit cards, Apple Pay & PayPal', 'Smooth slide-out cart for fast checkout', 'Easily manage products, prices & inventory', 'Automatic order confirmation emails to buyers'],
    techStack: ['Shopify', 'WooCommerce', 'Stripe Payments', 'PayPal']
  },
  {
    id: 'business-websites',
    title: 'Custom High-Speed Websites (React)',
    description: 'For companies that want a custom, one-of-a-kind website that loads in the blink of an eye, builds instant trust with prospective clients, and gets you more phone calls and inquiries.',
    highlights: ['Opens in under 1 second on mobile phones', 'Clear contact forms sent straight to your email', 'Modern look that makes your business stand out', 'Proper Google search setup so clients find you'],
    techStack: ['React', 'Lightning Fast', 'Modern Design', 'SEO Ready']
  },
  {
    id: 'landing-pages',
    title: 'High-Converting Sales & Lead Pages',
    description: 'A focused single-page website built to promote a specific service, launch a new product, or run social media ads. Designed with clear headlines to turn visitors into paying leads.',
    highlights: ['Clear, persuasive headlines that grab attention', 'Quick contact & quote request forms', 'Looks beautiful on Instagram & TikTok ad clicks', 'Zero clutter or distractions for visitors'],
    techStack: ['Lead Capture', 'Fast Page', 'Ad Ready', 'Mobile Optimized']
  },
  {
    id: 'custom-web-apps',
    title: 'Custom Web Tools & Interactive Calculators',
    description: 'Have a specific business idea or need a custom tool for your clients? I build interactive price calculators, booking portals, client intake forms, and customer dashboards.',
    highlights: ['Instant calculations as clients type or slide', 'Customer login areas and private portals', 'Export quotes or reports to printable PDFs', 'Connects directly to your email or database'],
    techStack: ['Custom Logic', 'Interactive Tools', 'Client Portals', 'Data Exports']
  },
  {
    id: 'speed-seo-overhaul',
    title: 'Website Speed Boost & Google Ranking Help',
    description: 'Is your current website slow, broken, or impossible to find on Google? I clean up messy code, shrink heavy pictures, and fix search settings so your site jumps up in Google search results.',
    highlights: ['Makes slow websites open up to 3x faster', 'Fixes search errors so Google indexes all pages', 'Shows review star ratings & rich info on Google', 'Better experience so visitors do not bounce away'],
    techStack: ['Google Search', 'Speed Boost', 'Image Optimization', 'SEO Fixes']
  }
];

export const WHY_US_REASONS: WhyReasonItem[] = [
  {
    id: 'direct-comm',
    number: '01',
    title: 'Talk Directly with Saad (No Middlemen)',
    description: 'You speak directly with Saad M—the person actually designing and building your website. No pushy salespeople, no confusing agency layers, and no miscommunicated messages.'
  },
  {
    id: 'transparent-pricing',
    number: '02',
    title: 'Honest £35/hr or Fixed-Price Quotes',
    description: 'You always know the cost before we start. Work by the hour at a straightforward £35/hr, or choose a fixed-price package where the price is locked in with zero surprise invoices.'
  },
  {
    id: 'design-dev-synergy',
    number: '03',
    title: 'Both Great Design & Solid Code',
    description: 'Some developers make sites that work but look dull; some designers make pretty graphics that don\'t work on phones. I do both, so your site looks amazing and works seamlessly.'
  },
  {
    id: 'responsive-craft',
    number: '04',
    title: 'Tested on Every Phone & Computer',
    description: 'Over 70% of web visitors browse on their phones. Every single button, menu, and photo is tested on iPhones, Android phones, tablets, and laptops so it always looks clean.'
  },
  {
    id: 'post-launch-care',
    number: '05',
    title: 'Support After Launch',
    description: 'I do not disappear once the website is launched. I am always a quick WhatsApp message away to help with updates, questions, backups, or future additions.'
  }
];

export const PROCESS_STAGES: ProcessStageItem[] = [
  {
    number: '01',
    stage: 'PLAN',
    title: '1. Friendly Chat & Project Plan',
    description: 'We talk through what your business does, who your ideal customers are, and what pages you need. We agree on an honest price and a clear timeline before any work starts.',
    deliverables: ['Simple Project Plan', 'Clear Price & Deadline', 'Checklist of What We Need'],
    durationEstimate: '1 – 2 Days'
  },
  {
    number: '02',
    stage: 'DESIGN',
    title: '2. Visual Design & Layout Preview',
    description: 'I create the visual look for your website—choosing colors, fonts, and layouts that match your brand. You get to review and approve the design before it is built into code.',
    deliverables: ['Color & Style Choices', 'Homepage & Page Previews', 'Your Feedback & Tweaks'],
    durationEstimate: '3 – 5 Days'
  },
  {
    number: '03',
    stage: 'BUILD',
    title: '3. Building Your Website & Adding Content',
    description: 'I write clean code, add your text and photos, set up contact forms, connect your payment systems, and make sure everything is fast and mobile-friendly.',
    deliverables: ['Working Private Preview Link', 'Working Contact Forms', 'Online Payment Testing'],
    durationEstimate: '1 – 2 Weeks'
  },
  {
    number: '04',
    stage: 'LAUNCH',
    title: '4. Testing, Going Live & Handover',
    description: 'We test everything on multiple phones and computers. Once you are 100% happy, we link your web domain and launch the site live to the world! You also get a video guide showing how to update text.',
    deliverables: ['Live Website on Your Domain', 'Free SSL Security Padlock', 'Personal Video Guide on How to Edit Words'],
    durationEstimate: '1 – 2 Days'
  }
];
