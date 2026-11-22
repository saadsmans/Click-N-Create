export interface PlatformComparisonRow {
  criterion: string;
  reactCustom: string;
  wordpress: string;
  shopifyWoo: string;
}

export interface IndustryBlueprint {
  id: string;
  index: string;
  sector: string;
  idealFor: string;
  summary: string;
  keyFeatures: string[];
  recommendedServiceSlug: string;
  estimatedTurnaround: string;
}

export interface HandoverItem {
  number: string;
  title: string;
  description: string;
}

export interface ServiceSelectionGuideRow {
  goal: string;
  recommendedService: string;
  slug: string;
  typicalHours: string;
  typicalTimeline: string;
  keyOutcome: string;
}

export interface AddonCapability {
  title: string;
  estimate: string;
  summary: string;
}

export interface WorkArchitecturalSpec {
  id: string;
  client: string;
  domain: string;
  problemSolved: string;
  architectureDecision: string;
  performanceTarget: string;
  responsiveScope: string;
  deliveryWindow: string;
}

export interface BudgetBenchmark {
  tier: string;
  title: string;
  hoursRange: string;
  priceRange: string;
  timeline: string;
  bestFor: string;
  includes: string[];
}

export interface TimezoneWindow {
  region: string;
  timezone: string;
  overlapWindow: string;
  supportChannel: string;
}

export const PLATFORM_COMPARISON_ROWS: PlatformComparisonRow[] = [
  {
    criterion: 'Best Suited For',
    reactCustom: 'Custom business sites, interactive tools, SaaS MVPs & modern portfolios',
    wordpress: 'Content-heavy company sites, blogs & teams editing pages regularly',
    shopifyWoo: 'Retail brands selling physical or digital products online',
  },
  {
    criterion: 'Page Load Speed',
    reactCustom: 'Sub-0.8s (Edge static assets, zero plugin bloat)',
    wordpress: '1.0s – 1.8s (Cached PHP with lightweight custom theme)',
    shopifyWoo: '1.2s – 2.2s (Optimised storefront assets & lazy media)',
  },
  {
    criterion: 'Content & Text Editing',
    reactCustom: 'Clean JSON/CMS sections + step-by-step video walkthrough',
    wordpress: 'Visual block editor with zero code required',
    shopifyWoo: 'Visual product, price & inventory dashboard (phone app ready)',
  },
  {
    criterion: 'Monthly Platform Software Fee',
    reactCustom: '£0 hosting tier available (Vercel / Cloudflare free commercial tiers)',
    wordpress: 'Standard shared/cloud PHP hosting (~£5–£15/mo paid directly)',
    shopifyWoo: 'Shopify subscription (from ~£19/mo) or £0 software fee on WooCommerce',
  },
  {
    criterion: 'Security & Maintenance Load',
    reactCustom: 'Minimal attack surface — no database plugins to patch weekly',
    wordpress: 'Hardened login + scheduled plugin & backup care',
    shopifyWoo: 'Managed PCI-DSS checkout security via Shopify or Stripe',
  },
  {
    criterion: 'Typical Build Timeline',
    reactCustom: '5 days – 3 weeks depending on interactive tools',
    wordpress: '1 – 2 weeks for 4–8 custom pages',
    shopifyWoo: '2 – 3 weeks with catalog, shipping rules & live payment testing',
  },
];

export const INDUSTRIES_SERVED: IndustryBlueprint[] = [
  {
    id: 'local-trades',
    index: '01',
    sector: 'Trades & Local Services',
    idealFor: 'Plumbers, Electricians, Builders, Cleaning & Maintenance Firms',
    summary:
      'Service websites designed to convert mobile local searches into direct phone calls, WhatsApp messages, and quote requests.',
    keyFeatures: [
      'Click-to-call & WhatsApp sticky action buttons on mobile',
      'Postcode coverage checker & itemized service areas',
      'Before/after gallery & transparent starting price tables',
      'LocalBusiness Schema markup for Google Search & Maps visibility',
    ],
    recommendedServiceSlug: 'web-development',
    estimatedTurnaround: '5 – 10 Days',
  },
  {
    id: 'retail-ecommerce',
    index: '02',
    sector: 'Retail & Online Shops',
    idealFor: 'Clothing Labels, Specialty Food, Electronics & Craft Sellers',
    summary:
      'Mobile-first storefronts engineered for fast browsing, variant selection, and frictionless card or Apple Pay checkout.',
    keyFeatures: [
      'Slide-out shopping bag with free-shipping threshold bar',
      'Size, colour & variant selectors with synced product photos',
      'Stripe, Apple Pay, Google Pay & PayPal checkout integration',
      'Automated order confirmation & customer dispatch emails',
    ],
    recommendedServiceSlug: 'ecommerce-development',
    estimatedTurnaround: '2 – 3 Weeks',
  },
  {
    id: 'clinics-salons',
    index: '03',
    sector: 'Clinics, Salons & Wellness',
    idealFor: 'Dental Practices, Aesthetics Studios, Barbers & Fitness Coaches',
    summary:
      'Calm, high-trust digital presences featuring clear treatment menus, practitioner profiles, and instant booking links.',
    keyFeatures: [
      'Categorized treatment price lists & duration breakdowns',
      'Direct calendar / booking system embed & WhatsApp triage',
      'Accessible typography & WCAG AA contrast across light/dark modes',
      'Patient/client FAQ accordions addressing common preparation queries',
    ],
    recommendedServiceSlug: 'web-development',
    estimatedTurnaround: '1 – 2 Weeks',
  },
  {
    id: 'hospitality',
    index: '04',
    sector: 'Restaurants, Cafes & Takeaways',
    idealFor: 'Independent Restaurants, Specialty Coffee Shops & Catering Brands',
    summary:
      'Fast-loading mobile menus (no heavy PDF pinches), table reservation triggers, and seasonal promotional banners.',
    keyFeatures: [
      'Filterable HTML digital menu with dietary & allergen tags',
      'Embedded Google Maps directions & live opening-hours table',
      'Direct commission-free takeaway or table enquiry routing',
      'Matched Instagram/print QR flyer assets included if needed',
    ],
    recommendedServiceSlug: 'branding-and-design',
    estimatedTurnaround: '5 – 12 Days',
  },
  {
    id: 'consultants-startups',
    index: '05',
    sector: 'Consultants & Early-Stage Startups',
    idealFor: 'B2B Advisors, SaaS Founders, Accountants & Boutique Agencies',
    summary:
      'Authority websites paired with interactive cost estimators, intake calculators, or authenticated client dashboards.',
    keyFeatures: [
      'Interactive ROI or project cost calculator tailored to your pricing',
      'Structured case-study & service methodology breakdowns',
      'Lead-qualifying multi-step enquiry forms routed to your CRM/inbox',
      'Strict TypeScript modular codebase ready for internal scaling',
    ],
    recommendedServiceSlug: 'web-app-development',
    estimatedTurnaround: '2 – 4 Weeks',
  },
  {
    id: 'portfolios-academics',
    index: '06',
    sector: 'Engineers, Academics & Creators',
    idealFor: 'University Graduates, Researchers, Designers & Independent Creators',
    summary:
      'Distinctive interactive portfolios showcasing verified credentials, live demonstrations, and downloadable CV records.',
    keyFeatures: [
      'Structured academic timeline, coursework & internship showcases',
      'Interactive demos or virtual lab modules tailored to your field',
      'Printable CV modal / PDF download + direct recruiter contact links',
      'Deployed on global edge CDN with custom share preview cards',
    ],
    recommendedServiceSlug: 'web-development',
    estimatedTurnaround: '5 – 7 Days',
  },
];

export const HANDOVER_DELIVERABLES: HandoverItem[] = [
  {
    number: '01',
    title: '100% Code, Domain & Account Ownership',
    description:
      'Every GitHub repository, domain DNS configuration, and hosting account stays under your credentials. No proprietary lock-in or holding domains hostage.',
  },
  {
    number: '02',
    title: 'Custom Recorded Editing Walkthrough',
    description:
      'You receive a clear video walkthrough recorded specifically for your finished site showing how to update copy, swap images, or manage products safely.',
  },
  {
    number: '03',
    title: '30-Day Post-Launch Care Included',
    description:
      'Every new build carries 30 calendar days of complimentary bug fixes, browser tweaks, and launch support after going live.',
  },
  {
    number: '04',
    title: 'Google Search Console & Sitemap Check',
    description:
      'XML sitemap submission, canonical tags, OpenGraph WhatsApp share cards, and Schema.org structured data verified prior to handover.',
  },
  {
    number: '05',
    title: 'Multi-Device & Cross-Browser QA Report',
    description:
      'Layouts verified across mobile (320px/375px), tablet (768px), laptop, and desktop (1920px) screens on iOS Safari, Android Chrome, and Firefox.',
  },
  {
    number: '06',
    title: 'Transparent Support at £35/hr Anytime',
    description:
      'Need seasonal banners, a new landing page, or feature expansions months later? Message Saad directly on WhatsApp for pay-as-you-go hourly help.',
  },
];

export const SERVICE_SELECTION_MATRIX: ServiceSelectionGuideRow[] = [
  {
    goal: 'Sell physical or digital products with card checkout',
    recommendedService: '01. E-Commerce Solutions',
    slug: 'ecommerce-development',
    typicalHours: '18 – 35 hrs',
    typicalTimeline: '2 – 3 Weeks',
    keyOutcome: 'Shopify or WooCommerce store with cart, variants & Apple Pay',
  },
  {
    goal: 'Launch a fast business website or personal portfolio',
    recommendedService: '02. Web Development',
    slug: 'web-development',
    typicalHours: '10 – 25 hrs',
    typicalTimeline: '1 – 2 Weeks',
    keyOutcome: 'Sub-second responsive website built with React or WordPress',
  },
  {
    goal: 'Create a memorable logo, colour system & print flyers',
    recommendedService: '03. Branding & Design',
    slug: 'branding-and-design',
    typicalHours: '6 – 14 hrs',
    typicalTimeline: '3 – 7 Days',
    keyOutcome: 'Scalable SVG/PDF logos, brand guide, social banners & print files',
  },
  {
    goal: 'Improve Google rankings, Maps visibility & ad conversions',
    recommendedService: '04. Digital Marketing',
    slug: 'digital-marketing',
    typicalHours: '6 – 16 hrs',
    typicalTimeline: '4 – 7 Days',
    keyOutcome: 'On-page SEO, Search Console, Google Ads & GA4 event tracking',
  },
  {
    goal: 'Build an interactive calculator, booking flow or client portal',
    recommendedService: '05. Web App Development',
    slug: 'web-app-development',
    typicalHours: '20 – 45 hrs',
    typicalTimeline: '2 – 4 Weeks',
    keyOutcome: 'Custom interactive TypeScript tool, auth portal or API workflow',
  },
  {
    goal: 'Speed up an existing slow site, migrate DNS & protect uptime',
    recommendedService: '06. Hosting & Maintenance',
    slug: 'hosting-and-maintenance',
    typicalHours: '3 – 8 hrs',
    typicalTimeline: '1 – 3 Days',
    keyOutcome: 'SSL setup, compressed media, daily backups & security hardening',
  },
];

export const ADDON_CAPABILITIES: AddonCapability[] = [
  {
    title: 'Core Web Vitals & Speed Repair',
    estimate: '3 – 5 hrs (£105 – £175)',
    summary: 'Compress oversized assets, eliminate render-blocking scripts, and boost mobile Lighthouse performance.',
  },
  {
    title: 'WhatsApp & Social OpenGraph Card Kit',
    estimate: '1.5 – 2 hrs (£52 – £70)',
    summary: 'Custom share preview images, meta tags, and structured schema so links look sharp in WhatsApp & LinkedIn.',
  },
  {
    title: 'Domain DNS & Zero-Downtime Migration',
    estimate: '1.5 – 3 hrs (£52 – £105)',
    summary: 'Clean nameserver switching, SPF/DKIM email preservation, SSL issuance, and 301 redirect rules.',
  },
  {
    title: 'Interactive Quote Calculator Widget',
    estimate: '5 – 9 hrs (£175 – £315)',
    summary: 'Embed a live pricing slider or scope estimator directly inside your existing site to qualify leads.',
  },
  {
    title: 'Dual Light & Dark Theme Implementation',
    estimate: '3 – 4 hrs (£105 – £140)',
    summary: 'Accessible dual-palette colour tokens with instant toggle persistence across every page.',
  },
  {
    title: 'Print-Ready Flyer & Business Card Pack',
    estimate: '2 – 4 hrs (£70 – £140)',
    summary: 'CMYK bleed-calibrated PDFs ready for VistaPrint or local UK/India commercial print houses.',
  },
];

export const WORK_ARCHITECTURAL_SPECS: WorkArchitecturalSpec[] = [
  {
    id: 'owais-dashboard',
    client: 'Bhola Mohammed Owais',
    domain: 'owaisdashboard.vercel.app',
    problemSolved:
      'Replace static PDF resumes with a scannable, recruiter-friendly web dashboard organising Parul University AI academics, Privacy-Guard AI project specs, and verified skill depth.',
    architectureDecision:
      'Light-first editorial grid engineered with React, TypeScript, and Tailwind CSS — prioritising typographic hierarchy and zero-clutter KPI cards over heavy animations.',
    performanceTarget: 'Vercel Edge Global CDN · Sub-second First Contentful Paint',
    responsiveScope: 'Tested across 375px mobile, tablet & 1440px desktop viewports',
    deliveryWindow: '5 Days (Brief to Live Domain)',
  },
  {
    id: 'hammad-patel',
    client: 'Hammad Patel',
    domain: 'hammadpatel.vercel.app',
    problemSolved:
      'Unite Electronics & Communication Engineering credentials (GEC Bharuch & IIT Bombay internship) with real-time interactive circuit & signal demonstrations inside the browser.',
    architectureDecision:
      'Dark-mode precision engineering UI paired with an interactive ECE Virtual Lab Studio, live signal waveform visualizers, embedded CV document preview, and WhatsApp CTA.',
    performanceTarget: 'Vercel Edge Global CDN · Hardware-accelerated canvas rendering',
    responsiveScope: 'Full mobile lab controls & desktop split-pane telemetry view',
    deliveryWindow: '7 Days (Brief to Live Domain)',
  },
];

export const PORTFOLIO_LAUNCH_SPRINT = [
  {
    step: 'Day 01',
    title: 'CV Audit & Content Structuring',
    detail: 'Gather academic records, certificates, live links, and project highlights into a clean wireframe structure.',
  },
  {
    step: 'Day 02–03',
    title: 'Bespoke Interface & Theme Design',
    detail: 'Design custom typography, colour palette, and interactive visualizers (dashboards, virtual labs, or galleries).',
  },
  {
    step: 'Day 04–05',
    title: 'Responsive Build & Interactive Modules',
    detail: 'Implement React/TypeScript components, CV viewers, and mobile navigation with fast image loading.',
  },
  {
    step: 'Day 06–07',
    title: 'Vercel Edge Deployment & Share Testing',
    detail: 'Configure custom URL, verify OpenGraph recruiter link previews on LinkedIn/WhatsApp, and launch live.',
  },
];

export const TIMEZONE_AVAILABILITY: TimezoneWindow[] = [
  {
    region: 'United Kingdom',
    timezone: 'GMT / BST',
    overlapWindow: '06:00 AM – 06:30 PM UK (Full Business Day Overlap)',
    supportChannel: 'WhatsApp (+44 7927 548123) & Email',
  },
  {
    region: 'Western & Central Europe',
    timezone: 'CET / CEST',
    overlapWindow: '07:00 AM – 07:30 PM CET (Full Business Day Overlap)',
    supportChannel: 'WhatsApp, Video Call & Email',
  },
  {
    region: 'India',
    timezone: 'IST (UTC+5:30)',
    overlapWindow: '10:00 AM – 11:00 PM IST (Local Operations)',
    supportChannel: 'Phone / WhatsApp (+91 9265129400)',
  },
  {
    region: 'Middle East / UAE',
    timezone: 'GST (UTC+4)',
    overlapWindow: '08:30 AM – 09:30 PM GST',
    supportChannel: 'WhatsApp & Email',
  },
  {
    region: 'North America (East)',
    timezone: 'EST / EDT',
    overlapWindow: '07:30 AM – 01:30 PM EST (Morning Collaboration Window)',
    supportChannel: 'Async Staging Links & Scheduled Calls',
  },
];

export const ENGINEERING_COURSEWORK_MODULES = [
  {
    area: 'Analog & Digital Communication',
    relevance: 'Signals, noise filtering & bandwidth efficiency directly inform disciplined data payload design on the web.',
  },
  {
    area: 'Circuit Simulation (eSim & CircuitJS)',
    relevance: 'Experience built during the IIT Bombay Spoken Tutorial internship translates into accurate interactive browser tools.',
  },
  {
    area: 'Satellite & Wireless Systems',
    relevance: 'System-level thinking around link budgets, latency, and fault tolerance shapes reliable cloud deployments.',
  },
  {
    area: 'Full-Stack Web Engineering',
    relevance: 'React 19, TypeScript, Tailwind CSS, WordPress/PHP, and Vercel Edge CDN applied to real client businesses.',
  },
];

export const PRICING_COMPARISON_MODELS = [
  {
    feature: 'Rate Structure',
    hourly: '£35 per hour (tracked in 15-min increments)',
    fixed: 'Locked total quote agreed before kickoff',
  },
  {
    feature: 'Best Suited For',
    hourly: 'Ongoing updates, bug fixes, speed repairs & flexible consulting',
    fixed: 'Complete new websites, online stores, redesigns & defined apps',
  },
  {
    feature: 'Payment Terms',
    hourly: 'Bi-weekly or upon task completion with itemized time breakdown',
    fixed: '50% deposit to begin · 50% only after staging sign-off before launch',
  },
  {
    feature: 'Revision Rounds',
    hourly: 'Unlimited iterations billed strictly against active dev time',
    fixed: '2 structured revision rounds included per design/staging milestone',
  },
  {
    feature: 'Code & Domain Ownership',
    hourly: '100% Client-Owned',
    fixed: '100% Client-Owned upon final settlement',
  },
];

export const MAINTENANCE_PLANS = [
  {
    name: 'Pay-As-You-Go Care',
    price: '£35 / hr',
    cadence: 'No Monthly Retainer',
    idealFor: 'Sites needing occasional text edits, seasonal banners, or quarterly updates.',
    features: [
      'Direct WhatsApp message whenever an edit is needed',
      'Billed strictly for actual time worked (minimum 30 mins)',
      'Zero standing monthly commitment',
    ],
  },
  {
    name: 'Standard Care Retainer',
    price: '£85 / mo',
    cadence: 'Monthly Peace of Mind',
    idealFor: 'WordPress or growing business sites needing regular plugin & backup care.',
    features: [
      '2 hours of included updates or design tweaks monthly (£70 value)',
      'Scheduled weekly cloud backups & security/plugin updates',
      'Uptime monitoring & priority 24h fix turnaround',
    ],
  },
  {
    name: 'Priority Store & App Care',
    price: '£175 / mo',
    cadence: 'Active Growth & Storefronts',
    idealFor: 'Shopify, WooCommerce, or React apps running paid ad campaigns.',
    features: [
      '4.5 hours of monthly development, CRO tweaks, or new landing sections',
      'Daily encrypted backups + pre-campaign checkout verification',
      'Same-day priority WhatsApp support with Saad M',
    ],
  },
];

export const INCLUDED_VS_THIRD_PARTY = {
  included: [
    'Custom UI design, layout architecture, and responsive mobile coding',
    'Free SSL security certificate setup and cloud DNS routing assistance',
    'On-page SEO metadata, sitemap.xml, and WhatsApp/social preview cards',
    'Recorded personalized video tutorial showing how to manage updates',
    '30 days of complimentary bug and responsive polish support post-launch',
  ],
  thirdParty: [
    'Domain name registration (~£10–£15/year paid directly to your registrar)',
    'Shopify monthly software plan (only if choosing Shopify — paid directly to Shopify)',
    'WordPress shared/cloud hosting (~£5–£15/month; React static sites host free on Vercel/Cloudflare)',
    'Standard payment gateway card fees (e.g. Stripe/PayPal per-transaction fees)',
  ],
};

export const EXTRA_BILLING_FAQS = [
  {
    question: 'Do I have to pay monthly fees to Click N Create once my site is live?',
    answer:
      'No. Once your final invoice is settled, you own the site 100% with zero mandatory agency retainers. Static React sites can even run on free Vercel or Cloudflare commercial tiers, while domain renewal (~£10/yr) goes directly to your registrar.',
  },
  {
    question: 'Can I switch from hourly work to a fixed package (or vice versa)?',
    answer:
      'Yes. Many clients start with a 3-hour speed repair or consultation at £35/hr and then roll into a fixed-price full redesign once we map the full requirements together.',
  },
  {
    question: 'What payment methods and currencies do you accept?',
    answer:
      'Payments are accepted in GBP (£), USD ($), or EUR (€) via UK Bank Transfer (Barclays), Stripe card checkout, or PayPal, complete with itemized formal PDF invoices.',
  },
];

export const BUDGET_BENCHMARKS: BudgetBenchmark[] = [
  {
    tier: 'Tier 01',
    title: 'Single-Page / Ad Landing Site',
    hoursRange: '8 – 13 hrs',
    priceRange: '£280 – £455',
    timeline: '3 – 5 Days',
    bestFor: 'Tradespeople, event launches, Google/Instagram ad campaigns',
    includes: ['Responsive hero & offer layout', 'Lead form routed to email', 'WhatsApp & SEO basics'],
  },
  {
    tier: 'Tier 02',
    title: 'Multi-Page Business Site',
    hoursRange: '16 – 28 hrs',
    priceRange: '£560 – £980',
    timeline: '1 – 2 Weeks',
    bestFor: 'Established companies, clinics, restaurants & service firms',
    includes: ['4–8 tailored pages', 'Dark & light mode + FAQ blocks', 'Recorded editing tutorial'],
  },
  {
    tier: 'Tier 03',
    title: 'Shopify / WooCommerce Store',
    hoursRange: '24 – 42 hrs',
    priceRange: '£840 – £1,470',
    timeline: '2 – 3 Weeks',
    bestFor: 'Retail brands selling products with variants & online checkout',
    includes: ['Slide-out cart & card checkout', 'Variant swatches & shipping rules', 'Order notification flows'],
  },
  {
    tier: 'Tier 04',
    title: 'Custom Web App / Calculator',
    hoursRange: '30 – 55+ hrs',
    priceRange: '£1,050 – £1,925+',
    timeline: '2 – 4 Weeks',
    bestFor: 'Client portals, interactive pricing calculators & SaaS dashboards',
    includes: ['Custom TypeScript engine', 'Auth / role permissions', 'PDF exports & API integrations'],
  },
];

export const ESTIMATE_TO_QUOTE_STEPS = [
  {
    step: '01',
    title: 'Interactive Scope Estimate',
    detail: 'Use the calculator above to pick your service type, feature modules, and preferred pace — giving an immediate transparent cost range.',
  },
  {
    step: '02',
    title: '15-Minute WhatsApp or Call Alignment',
    detail: 'Send your calculated summary straight to WhatsApp or email. We review your exact text, photos, and any special integrations.',
  },
  {
    step: '03',
    title: 'Guaranteed Fixed-Price Sign-Off',
    detail: 'You receive a written fixed milestone quote valid for 30 days. Once approved, the price never moves unless you request extra modules.',
  },
];

export const CLIENT_LAUNCH_CHECKLIST = [
  {
    item: 'Your Business Name, Logo (or request a new one) & Brand Colours',
    note: 'If you do not have brand guidelines yet, Saad will propose clean typography and colour palettes during Stage 02.',
  },
  {
    item: 'Core Service Descriptions, Pricing or Product List',
    note: 'Even rough bullet points or voice notes work — copy refinement is included when needed.',
  },
  {
    item: 'Real Team, Workspace, or Product Photos',
    note: 'High-resolution smartphone photos are completely fine; images are colour-balanced and compressed automatically.',
  },
  {
    item: 'Target Domain Name & Preferred Contact Email',
    note: 'Share your existing registrar access when ready for launch so DNS switches cleanly with zero downtime.',
  },
];

export const WEEKLY_CADENCE = [
  {
    cadence: 'Every 48 Hours',
    title: 'Live Staging Preview Links',
    detail: 'Inspect progress on your own phone via private Vercel preview URLs rather than waiting weeks for static mockups.',
  },
  {
    cadence: 'Direct WhatsApp',
    title: 'Rapid Question & Revision Loop',
    detail: 'Drop feedback screenshots or quick voice notes directly to Saad without ticket queues or waiting days for an account manager.',
  },
  {
    cadence: '30 Days Post-Launch',
    title: 'Complimentary Warranty & Care',
    detail: 'Every shipped build includes 30 days of free bug fixes, minor spacing tweaks, and domain/search indexing checks.',
  },
];

export const DEVICE_TESTING_MATRIX = [
  { category: 'Small Mobile', width: '320px – 375px', targets: 'iPhone SE, iPhone 15, Android compact viewports' },
  { category: 'Large Mobile', width: '390px – 430px', targets: 'iPhone Pro Max, Pixel, Samsung Galaxy S-Series' },
  { category: 'Tablet', width: '768px – 1024px', targets: 'iPad Portrait & Landscape touch navigation' },
  { category: 'Laptop / Desktop', width: '1280px – 1920px+', targets: 'MacBook Air/Pro, Windows 1080p/4K Chrome, Safari & Firefox' },
];

export const SEO_SCHEMA_CHECKLIST = [
  'Dynamic per-route <title>, canonical URL, and meta description tags',
  'JSON-LD structured Schema.org objects (ProfessionalService, Service, FAQPage, Person)',
  'OpenGraph & Twitter/X summary_large_image cards verified for WhatsApp & LinkedIn shares',
  'Clean semantic HTML5 landmark hierarchy (single <h1>, ordered <h2>–<h4>, aria-labels)',
  'Automatic XML sitemap configuration & Google Search Console verification support',
];

export const SECURITY_HEADER_SPECS = [
  { control: 'Transport Encryption', spec: 'TLS 1.3 / HTTPS with HSTS auto-renewal on all routes' },
  { control: 'Secret Isolation', spec: 'Zero private keys or credentials embedded in client JS bundles' },
  { control: 'Input Validation', spec: 'Sanitized form fields, strict schema validation & rate limiting' },
  { control: 'Dependency Hygiene', spec: 'Minimal runtime dependency tree with strict TypeScript compilation' },
];

export const CONTACT_NEXT_STEPS = [
  {
    step: '01',
    title: 'Personal Review Within Hours',
    detail: 'Saad M personally reads every enquiry — usually replying within 2–4 hours on WhatsApp or same-day by email.',
  },
  {
    step: '02',
    title: 'Scope Clarity & Honest Estimate',
    detail: 'We clarify your page count, shop features, or design assets and give you a transparent fixed quote or hourly plan.',
  },
  {
    step: '03',
    title: 'Clear Kickoff Date & Preview Link',
    detail: 'Once agreed, work begins immediately on a private staging link so you can watch your site take shape live.',
  },
];

export const INQUIRY_PREP_CHECKLIST = [
  'Type of site needed (Business site, Online store, Portfolio, Logo/Branding, or Custom app)',
  'Approximate number of pages or initial products you want to start with',
  'Any reference websites whose layout or clean feel you like',
  'Your target launch date or whether you need Standard vs Priority turnaround',
];

export const SERVICE_LAUNCH_TIMELINES: Record<string, { phase: string; window: string; detail: string }[]> = {
  'ecommerce-development': [
    { phase: 'Stage 01 · Store Blueprint', window: 'Days 1–3', detail: 'Select Shopify vs WooCommerce, map product categories, tax/shipping zones, and payment gateways.' },
    { phase: 'Stage 02 · Storefront & Catalog', window: 'Days 4–10', detail: 'Build responsive product grids, variant swatches, slide-out cart, and load initial inventory.' },
    { phase: 'Stage 03 · Checkout QA & Launch', window: 'Days 11–18', detail: 'Test live card/Apple Pay flows, order notification emails, mobile UX, and point your domain.' },
  ],
  'web-development': [
    { phase: 'Stage 01 · Architecture & Wireframe', window: 'Days 1–2', detail: 'Align on page list, navigation structure, copy tone, and React vs WordPress selection.' },
    { phase: 'Stage 02 · Responsive UI Build', window: 'Days 3–8', detail: 'Develop mobile-first layouts, dark/light themes, forms, and interactive components.' },
    { phase: 'Stage 03 · Speed QA & Go Live', window: 'Days 9–12', detail: 'Verify Lighthouse metrics, SEO tags, cross-browser rendering, DNS launch, and handover video.' },
  ],
  'branding-and-design': [
    { phase: 'Stage 01 · Creative Direction', window: 'Day 1', detail: 'Define brand voice, competitor contrast, typography style, and colour palette direction.' },
    { phase: 'Stage 02 · Logo & Asset Concepts', window: 'Days 2–4', detail: 'Develop primary/secondary logos, social cover templates, and promotional print layouts.' },
    { phase: 'Stage 03 · Final Vector Exports', window: 'Days 5–6', detail: 'Deliver SVG, PNG, and print-ready CMYK PDFs alongside your colour & font guidelines.' },
  ],
  'digital-marketing': [
    { phase: 'Stage 01 · Technical & Search Audit', window: 'Days 1–2', detail: 'Inspect Search Console indexing, page speed bottlenecks, keyword gaps, and tracking.' },
    { phase: 'Stage 02 · SEO & Campaign Build', window: 'Days 3–5', detail: 'Implement schema markup, metadata rewrites, Google Ads / Meta ad creatives & tracking events.' },
    { phase: 'Stage 03 · Reporting & Tuning', window: 'Days 6–7', detail: 'Verify live conversion triggers, share dashboard report, and outline next growth actions.' },
  ],
  'web-app-development': [
    { phase: 'Stage 01 · Logic & Data Modeling', window: 'Days 1–4', detail: 'Define interactive state formulas, user authentication roles, API contracts, and UI views.' },
    { phase: 'Stage 02 · Engineering Sprints', window: 'Days 5–16', detail: 'Build TypeScript engine, interactive sliders/dashboards, export tools, and edge routes.' },
    { phase: 'Stage 03 · Edge Testing & Handover', window: 'Days 17–21', detail: 'Verify edge cases, mobile touch controls, deploy to production, and deliver code docs.' },
  ],
  'hosting-and-maintenance': [
    { phase: 'Stage 01 · Infrastructure Audit', window: 'Day 1', detail: 'Audit DNS records, SSL chain, image sizes, plugin bloat, and backup status.' },
    { phase: 'Stage 02 · Hardening & Speed', window: 'Days 2–3', detail: 'Migrate or optimise edge CDN, compress media to WebP, and configure security rules.' },
    { phase: 'Stage 03 · Monitoring & Care', window: 'Ongoing', detail: 'Verify 24/7 uptime checks, automated safety backups, and handover clear summary report.' },
  ],
};
