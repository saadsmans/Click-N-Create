export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  categoryTag: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  altText: string;
  pricingEstimate: string;
  typicalTimeline: string;
  rateNote: string;
  techStack: string[];
  features: string[];
  deliverables: string[];
  suitableFor: string[];
  scopeInclusions: string[];
  scopeExclusions: string[];
  faqs: ServiceFaq[];
  accentColor: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'ecommerce-dev',
    number: '01',
    title: 'E-Commerce Development',
    slug: 'ecommerce-development',
    categoryTag: 'SHOPIFY · WOOCOMMERCE · HIGH-CONVERSION STORES',
    shortDescription: 'Complete online stores where customers browse your products effortlessly, add items to a slide-out cart, and buy safely with Apple Pay, cards, or PayPal.',
    fullDescription: 'Want to sell products online without the headache? I engineer high-converting e-commerce storefronts that make shopping effortless for your customers. From smooth mobile browsing and product color/size pickers to instant checkout with Apple Pay, credit cards, and PayPal, your store is built to take orders 24/7.',
    image: '/file_000000003d8861f9978bc4e948bee359.png',
    altText: 'E-Commerce Development 3D digital shopping cart with product items, payment cards, and checkout verification',
    pricingEstimate: 'Fixed milestone package based on how many products you have',
    typicalTimeline: '2 – 3 Weeks',
    rateNote: 'Guaranteed fixed price with full launch and training support',
    techStack: ['Shopify', 'WooCommerce', 'Apple Pay', 'Google Pay', 'Stripe Cards', 'PayPal'],
    accentColor: '#38BDF8',
    features: [
      'Take customer payments safely with Apple Pay, Google Pay, Visa, Mastercard, and PayPal',
      'Smooth slide-out cart drawer so shoppers can checkout in seconds',
      'Product options like sizes, colors, and materials with pictures that switch automatically',
      'Free shipping progress meter (e.g. "Add £10 more for Free Delivery!") to boost order sizes',
      'Simple admin dashboard on your phone or laptop to view new orders and print shipping labels',
      'Automatic order confirmation emails and receipts sent to your buyers',
      'Discount codes, promo sales, and seasonal campaigns (e.g. 10% off for new customers)',
      'Customer account portal where buyers can view their past orders and track parcels'
    ],
    deliverables: [
      'Fully working e-commerce store live on your custom web domain',
      'Secure payment processing connected directly to your business bank account',
      'Your initial products and collections uploaded with high-quality photos',
      'Automated customer receipts and order notification emails',
      'Shipping rates and tax settings configured properly',
      'Step-by-step video tutorial showing you how to add new items and fulfill orders',
      '30 days of free post-launch support to answer any questions'
    ],
    suitableFor: [
      'Anyone launching a clothing, fashion, beauty, jewelry, or lifestyle brand',
      'Physical shops and local retail stores wanting to sell online',
      'Creators selling handmade crafts, art, books, or digital downloads',
      'Sellers moving away from Etsy or Amazon fees to own their independent shop'
    ],
    scopeInclusions: [
      'Store design and custom branding',
      'Setting up payment cards and bank deposit accounts',
      'Organizing product categories, tags, and collections',
      'Setting up shipping rules (e.g. standard UK delivery, worldwide delivery)',
      'Testing real checkout purchases before going live',
      'Personal walkthrough on how to manage your orders'
    ],
    scopeExclusions: [
      'Shopify monthly software plan (paid directly to Shopify if chosen)',
      'Standard small transaction processing fees from card processors (Stripe/PayPal)'
    ],
    faqs: [
      {
        question: 'Should I pick Shopify or WooCommerce for my online store?',
        answer: 'If you want an all-in-one system with zero technical maintenance, Shopify is usually the easiest choice. If you want 100% free ownership with no monthly platform fees and deep WordPress power, WooCommerce is fantastic. I build both and will guide you to what fits your budget best!'
      },
      {
        question: 'Do I need technical skills to add new products or change prices?',
        answer: 'No technical skills needed at all! Both Shopify and WooCommerce have super easy mobile apps and web dashboards. You can add a new product or change a price in 60 seconds from your phone.'
      },
      {
        question: 'How do I receive the money when customers buy?',
        answer: 'Payments from credit cards, Apple Pay, and PayPal deposit directly into your business bank account automatically on a regular schedule.'
      }
    ]
  },
  {
    id: 'web-dev',
    number: '02',
    title: 'Web Development',
    slug: 'web-development',
    categoryTag: 'CUSTOM WEBSITES · WORDPRESS · REACT · ULTRA-FAST',
    shortDescription: 'Clean, modern websites that make your business look trustworthy, open in under a second on phones, and make it effortless for customers to contact you.',
    fullDescription: 'Your website is usually the very first impression a potential customer has of your company. I build clean, high-performance websites designed to build trust and win you more clients. Whether you want an easy-to-edit WordPress site or a bespoke high-speed React website, everything is engineered to look sharp on mobile phones, load instantly, and rank on Google.',
    image: '',
    altText: 'Web Development 3D laptop representation with code interface, cloud components, and styling elements',
    pricingEstimate: 'Simple hourly rate (£35/hr) or fixed project quotes',
    typicalTimeline: '1 – 3 Weeks depending on how many pages you need',
    rateNote: 'Fixed price quote agreed before starting, or flexible £35/hr',
    techStack: ['React', 'WordPress', 'TypeScript', 'Mobile First', 'Speed Boost', 'Contact Forms'],
    accentColor: '#0EA5E9',
    features: [
      'Looks clean and easy to read on every phone, tablet, and computer screen',
      'Contact forms that send inquiries and quotes directly to your email inbox',
      'Loads fast in under 1 second so impatient visitors never click away',
      'Easy to update yourself (or I can handle updates for you anytime)',
      'Built-in Google search setup so local clients can discover your business',
      'Click-to-call phone buttons and instant WhatsApp chat buttons for quick leads',
      'Free secure lock icon (HTTPS) so visitors know your website is safe',
      'Clear, clean navigation so visitors easily find your services and prices'
    ],
    deliverables: [
      'Complete, finished website live on your own custom web address (.com / .co.uk)',
      'Working contact form with spam protection sending straight to your email',
      'Mobile-friendly menus and easy-to-read pages',
      'Google search setup and link preview images when sharing on social media',
      'Free SSL security padlock installation',
      'Short personalized video showing you how to change words or photos yourself',
      '100% full ownership of all files and website content with zero vendor lock-in'
    ],
    suitableFor: [
      'Local businesses (contractors, cleaners, electricians, salons, gyms, mechanics)',
      'Professional services (consultants, accountants, lawyers, private clinics)',
      'Companies with an outdated website that looks bad on mobile phones',
      'New startups and independent creators launching their business identity',
      'Anyone who wants a website that actually generates phone calls and inquiries'
    ],
    scopeInclusions: [
      'Planning out your website structure and pages',
      'Designing clean colors, fonts, and page layouts',
      'Adding your text, logos, services, and photos',
      'Setting up contact forms and instant inquiry notifications',
      'Testing on real iPhones, Androids, iPads, and laptops',
      'Connecting your domain name and launching the site live',
      'Friendly post-launch support if you have questions'
    ],
    scopeExclusions: [
      'Domain name yearly registration fee (~£10/year paid to registrar)',
      'Paid third-party specialized software subscriptions'
    ],
    faqs: [
      {
        question: 'Can I edit the words and photos myself after you build it?',
        answer: 'Yes! If you choose WordPress or an easy CMS, I set up a simple dashboard and give you a short, friendly video guide showing you exactly how to change words, update prices, or add new photos anytime.'
      },
      {
        question: 'Will my website look good on iPhones and Android phones?',
        answer: 'Yes, 100%. More than 70% of web traffic comes from phones today. Every button, image, and text block is carefully designed and tested to look great and be easy to tap on all smartphones.'
      },
      {
        question: 'Can you update or redesign my old, slow website?',
        answer: 'Definitely. I can take your existing content, refresh the design so it looks modern and professional, speed it up drastically, and make it work smoothly on phones.'
      },
      {
        question: 'Do I own the website once it is finished?',
        answer: 'Yes, completely. You own 100% of your website, your content, and your domain. There are no sneaky monthly lock-in fees or penalties.'
      }
    ]
  },
  {
    id: 'branding-design',
    number: '03',
    title: 'Branding & Design',
    slug: 'branding-and-design',
    categoryTag: 'BRAND IDENTITY · LOGOS · UI/UX · PRINT & DIGITAL',
    shortDescription: 'Memorable logos, cohesive brand systems, social media banners, print-ready flyers, and business cards that give your business an unmistakable premium identity.',
    fullDescription: 'Before someone reads a single sentence, they judge your business by how polished it looks. I craft memorable logos, complete brand identities, social media kits, print flyers, business cards, and UI/UX visuals that elevate your business across both digital screens and physical print.',
    image: '/file_000000003c4c61f9a6295fced3c44012.png',
    altText: 'Branding and design creative workspace with color swatches, typographic hierarchy, responsive layout frames, and aesthetic guidelines',
    pricingEstimate: 'Standalone design package or added to your website build',
    typicalTimeline: '3 – 7 Days',
    rateNote: 'Fixed price quote based on which graphics and print files you need',
    techStack: ['Vector Logo', 'Brand Identity', 'Print Ready CMYK', 'Social Media Kit', 'Figma'],
    accentColor: '#2563EB',
    features: [
      'Complete Logo Suite: High-resolution files for social media, websites, clothing, and signs',
      'Transparent background files (PNG & SVG) so your logo looks crisp on any color',
      'Social Media Pack: Profile pictures, cover headers, and post templates for Instagram, Facebook, and LinkedIn',
      'Print-ready flyers, posters, and promo paper with crop marks ready for local printers',
      'Luxury business cards and official letterhead templates for your quotes and invoices',
      'Carefully chosen brand color palette and easy-to-read typography pairings',
      'Realistic 3D mockup previews showing your logo on real shirts, boxes, cards, or screens',
      'Brand Style Cheat Sheet so your business looks consistent everywhere you post'
    ],
    deliverables: [
      'Master logo files in all essential formats (Vector SVG, PNG, PDF, JPG)',
      'Versions for light backgrounds, dark backgrounds, and square profile icons',
      'Matching social media banner graphics',
      'Print-ready PDF files for flyers or business cards ready for any print shop',
      'Brand guide sheet listing your exact color codes and font names',
      'Full commercial ownership of all graphic assets'
    ],
    suitableFor: [
      'New businesses needing their first official logo and matching graphics',
      'Companies whose current logo looks blurry, outdated, or homemade',
      'Traders, salons, restaurants, and shops needing paper flyers or promo menus',
      'Founders preparing to launch a new product, app, or professional service'
    ],
    scopeInclusions: [
      'Brainstorming your brand style and reviewing examples you like',
      'Initial concept choices for you to review and give feedback on',
      'Refining your chosen direction until you love it',
      'Exporting all standard high-res file types for web and physical printing'
    ],
    scopeExclusions: [
      'Physical printing delivery costs (paid directly to your chosen printer)',
      'Complex 3D animated video intros'
    ],
    faqs: [
      {
        question: 'What file formats will I receive for my logo?',
        answer: 'You receive all industry-standard files: sharp vector SVG and PDF (which never lose quality when scaled huge on shop signs or vehicles), high-res PNGs with transparent backgrounds for websites and social media, and clean JPGs.'
      },
      {
        question: 'Can I take the flyer or business card files straight to a printer?',
        answer: 'Yes! All print files are prepared in print-ready CMYK color with proper bleed and crop marks, so you can upload them to VistaPrint or hand them to any local printer without issues.'
      }
    ]
  },
  {
    id: 'digital-marketing',
    number: '04',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    categoryTag: 'SEO · GOOGLE ADS · SOCIAL GROWTH · ANALYTICS',
    shortDescription: 'Help your business rank higher on Google search and maps, run high-ROI Google & social ads, and track every new lead, call, and sale.',
    fullDescription: 'Having a great website only works when customers can find it. I help your business climb Google search and Google Maps rankings, launch targeted Google Ads and social media campaigns, and configure transparent analytics dashboards so you can measure every click, call, and conversion.',
    image: '/file_00000000d60c61f9a5d3f27f2976b911.png',
    altText: 'Digital marketing and SEO 3D visual with growth analytics chart, target bullseye, search ranking graphs, and conversion megaphone',
    pricingEstimate: 'One-time setup package or monthly marketing support',
    typicalTimeline: '4 – 7 Days',
    rateNote: 'Fixed price setup or ongoing monthly growth support',
    techStack: ['Technical SEO', 'Google Maps', 'Google Ads', 'GA4 Analytics', 'Meta Ads'],
    accentColor: '#60A5FA',
    features: [
      'Fix Google search errors so all your website pages show up in search results',
      'Local SEO setup so your company appears when people search "near me" in your area',
      'Google search star ratings and FAQ dropdowns to make your search listing stand out',
      'Google Analytics setup so you can see how many people visited and how many contacted you',
      'Google Search Ads setup to put your business at the very top of Google for key search terms',
      'Attention-grabbing ad image creatives for Facebook and Instagram promotions',
      'Clean link previews with image and description when sharing your website on WhatsApp',
      'Automated email welcome sequences when a new customer sends an inquiry'
    ],
    deliverables: [
      'Full checkup report of your website\'s Google search health and what was fixed',
      'Submission to Google Search Console to speed up page indexing',
      'Google Analytics 4 dashboard tracking form inquiries and phone calls',
      'Custom preview cards for WhatsApp and social media link shares',
      'Simple, plain-English summary of recommendations to keep growing traffic'
    ],
    suitableFor: [
      'Local service businesses wanting more inquiries from their town or city',
      'Companies not currently showing up on Google search results',
      'Websites that recently lost search ranking and need immediate fixes',
      'Businesses wanting to run paid Google or Facebook ads for new customer leads'
    ],
    scopeInclusions: [
      'Checking and fixing page titles and Google descriptions',
      'Submitting your sitemap to Google Search Console',
      'Setting up lead and phone call tracking in Google Analytics',
      'Creating shareable social media link cards',
      'Setting up your Google Ads keywords and ad copy if selected'
    ],
    scopeExclusions: [
      'Your paid ad spend budget (paid directly by your card to Google/Meta)',
      'Spam link buying schemes that harm your website reputation'
    ],
    faqs: [
      {
        question: 'How long does it take for my website to appear on Google?',
        answer: 'Once we submit your site directly to Google, search crawlers usually review and list your pages within 48 to 72 hours. Your rankings for competitive keywords will grow steadily over the coming weeks as more visitors interact with your site.'
      },
      {
        question: 'Will I be able to see how many people visit my website?',
        answer: 'Yes! I set up a free Google Analytics report for you. You can easily see how many visitors came to your site, what town they are in, and whenever someone submits a contact form.'
      }
    ]
  },
  {
    id: 'web-apps',
    number: '05',
    title: 'Web App Development',
    slug: 'web-app-development',
    categoryTag: 'CUSTOM WEB APPS · CLIENT PORTALS · DASHBOARDS',
    shortDescription: 'Bespoke interactive web applications that save your business time—instant quote calculators, customer booking portals, SaaS MVPs, and live data dashboards.',
    fullDescription: 'When a standard brochure website is not enough for your business operations, I engineer custom interactive web applications. Whether you want an instant quote estimator that prices jobs automatically, an authenticated client portal, or a real-time analytics dashboard, I turn your business workflow into fast, reliable software.',
    image: '/file_00000000dcbc61f9ac09271ea9b4755e.png',
    altText: 'Web app development interface with dynamic modular widgets, data visualization charts, interactive controls, and user settings panel',
    pricingEstimate: 'Clear project quote based on the features you need',
    typicalTimeline: '2 – 4 Weeks',
    rateNote: 'Itemized milestone quote with clear feature breakdown',
    techStack: ['React & TypeScript', 'Client Portals', 'User Logins', 'REST APIs', 'PDF Generators'],
    accentColor: '#38BDF8',
    features: [
      'Instant calculations: Sliders and forms that calculate prices or estimates on the fly',
      'Secure user login portals: Let customers sign in with email or Google to see their files',
      'Filterable tables & search: Search and organize leads, client orders, or inventory easily',
      'Downloadable PDF quotes and receipts: Customers can print or download quotes with 1 click',
      'Email alerts: Automatic notifications sent whenever a client completes a calculation or form',
      'Connects with your favorite tools (like Google Sheets, Mailchimp, Stripe, or your CRM)',
      'Works smoothly on mobile phones just like a native phone app',
      'Clean, easy-to-use screens that anyone can understand without a training manual'
    ],
    deliverables: [
      'Finished custom web application or interactive tool live on your domain',
      'Custom calculation formulas and pricing rules programmed accurately',
      'User login and account security if requested',
      'PDF download or email notification features configured',
      'Full testing across browsers and phones before launch',
      'Complete ownership of the code with zero ongoing software licensing royalties'
    ],
    suitableFor: [
      'Service companies needing an online price estimator to qualify incoming leads',
      'Businesses replacing messy paper forms or Excel spreadsheets with an easy online tool',
      'Startups building an initial prototype or Minimum Viable Product (MVP)',
      'Agencies and consultants wanting an interactive intake portal for new clients'
    ],
    scopeInclusions: [
      'Mapping out the logic and user steps in plain English',
      'Designing clean, intuitive screens that are easy to use',
      'Programming the calculation formulas and form validations',
      'Setting up account logins or document exports if needed',
      'Testing everything thoroughly with real test numbers'
    ],
    scopeExclusions: [
      'Monthly database server fees (if a large database is required)',
      'Paid third-party API subscriptions'
    ],
    faqs: [
      {
        question: 'Can this connect to my existing software or Google Sheets?',
        answer: 'Yes! I can connect your custom web app directly to Google Sheets, your email system, Slack, Stripe, or other software so you never have to copy and paste data manually.'
      },
      {
        question: 'Can my customers download their quote as a PDF?',
        answer: 'Yes. I can add a clean "Download PDF Quote" button that instantly generates a branded document with your company logo, terms, and the calculated price.'
      }
    ]
  },
  {
    id: 'hosting-maintenance',
    number: '06',
    title: 'Hosting & Maintenance',
    slug: 'hosting-maintenance',
    categoryTag: 'CLOUD HOSTING · DAILY BACKUPS · 24/7 SECURITY',
    shortDescription: 'Fast, secure cloud hosting, domain setup, daily automated backups, security updates, and friendly ongoing support so your site stays online 24/7.',
    fullDescription: 'Never worry about your website going down, getting hacked, or losing files. I set up fast, modern cloud hosting, connect your domain name, install SSL security encryption, and manage daily backups and software updates. Whenever you need a quick edit or technical help, I am right here on WhatsApp.',
    image: '/file_00000000f0ec61f9aa41eb3fa7a57a0f.png',
    altText: 'Hosting and maintenance 3D graphic showing secure server tower, cloud synchronization, SSL padlock, and speed monitoring dials',
    pricingEstimate: 'Setup included with every build, or low monthly care plan',
    typicalTimeline: '24 – 48 Hours for setup, or ongoing monthly care',
    rateNote: 'Affordable monthly care plan or pay-as-you-go £35/hr',
    techStack: ['Cloud Hosting', 'Domain & DNS', 'Daily Backups', 'SSL & Firewall', 'WhatsApp Support'],
    accentColor: '#06B6D4',
    features: [
      'Fast, modern cloud hosting so your website opens quickly for visitors anywhere',
      'We connect your chosen web domain (.com / .co.uk) with zero hassle',
      'Free SSL security certificate (the lock icon in web browsers) with automatic renewals',
      'Daily automatic backups stored safely in the cloud so your files are always protected',
      'Regular security updates to keep WordPress and plugins safe from hackers',
      'Automatic 24/7 uptime check: If your site ever has an issue, I get an alert immediately',
      'Protection shield against spam bots and malicious traffic',
      'Direct priority WhatsApp access (+44 7927 548123) whenever you need a quick edit'
    ],
    deliverables: [
      'Your website published on fast, reliable modern cloud servers',
      'Custom web address connected with the secure lock padlock active',
      'Automatic daily backup system running quietly in the background',
      'Monthly health check to make sure everything stays fast and secure',
      'Direct phone & WhatsApp support whenever you need help'
    ],
    suitableFor: [
      'Business owners who want zero headache managing technical servers or hosting',
      'Anyone who wants peace of mind knowing their website is backed up every day',
      'Companies wanting a developer on-call for quick text updates and photos',
      'WordPress site owners tired of broken plugins and security warnings'
    ],
    scopeInclusions: [
      'Setting up fast cloud servers and domain DNS routing',
      'Enabling HTTPS security lock encryption',
      'Setting up automatic daily backup schedules',
      'Ongoing software and security patch updates',
      'Friendly WhatsApp and email assistance'
    ],
    scopeExclusions: [
      'Domain registration renewal fee (~£10/year paid to registrar)',
      'Enterprise dedicated private server hardware'
    ],
    faqs: [
      {
        question: 'Can you move my existing website over from a slow host?',
        answer: 'Yes! I handle the full move with zero downtime, copying your website files, pictures, and domain settings safely to fast modern cloud hosting.'
      },
      {
        question: 'What happens if I need a quick text change or picture swapped?',
        answer: 'Simply send me a WhatsApp message or an email with what you want changed, and I take care of it for you quickly.'
      }
    ]
  }
];
