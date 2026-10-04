export interface FaqItem {
  id: string;
  category: 'Pricing & Rates' | 'Services & Scope' | 'Process & Delivery' | 'Communication & Availability' | 'Technical & Technology' | 'Ownership & Legal';
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  // ===================== PRICING & RATES =====================
  {
    id: 'hourly-rate-details',
    category: 'Pricing & Rates',
    question: 'What is your standard rate and what is included?',
    answer: 'My standard rate is £35 per hour. This includes everything: custom website design, writing clean code, mobile phone testing, Google search setup, and direct consulting. You only pay for actual time spent, with a clear breakdown of every task.'
  },
  {
    id: 'custom-project-pricing',
    category: 'Pricing & Rates',
    question: 'How do fixed-price packages work for complete websites?',
    answer: 'If you know what pages and features you need (for example, a 5-page business site or an online shop), I provide an exact fixed price quote before we begin. This guarantees that your price will never increase unexpectedly.'
  },
  {
    id: 'payment-milestones-terms',
    category: 'Pricing & Rates',
    question: 'When and how do I pay?',
    answer: 'For fixed projects, payment is split into simple milestones: typically a 50% deposit to get started, and the final 50% only when you have reviewed the website, tested it on your phone, and are 100% happy with it before we launch live.'
  },
  {
    id: 'accepted-payment-methods',
    category: 'Pricing & Rates',
    question: 'Which payment methods do you accept?',
    answer: 'I accept UK bank transfers (BACS / Faster Payments), international bank transfers (IBAN / SWIFT), and online credit/debit card payments via Stripe. An official invoice with receipt is provided for every payment.'
  },
  {
    id: 'hidden-costs-check',
    category: 'Pricing & Rates',
    question: 'Are there any hidden costs or surprise monthly bills?',
    answer: 'None from Click N Create. You only pay for the work we agree on. Standard small third-party costs (like registering your web domain name for ~£10/year) are registered directly in your name so you retain full ownership.'
  },

  // ===================== SERVICES & SCOPE =====================
  {
    id: 'services-breakdown-summary',
    category: 'Services & Scope',
    question: 'What services does Click N Create offer in simple terms?',
    answer: 'I offer six core services: 1) Clean, modern business websites, 2) Online shops to sell products (Shopify & WooCommerce), 3) Logo and graphic design (banners, flyers, business cards), 4) Fast website hosting and daily backups, 5) Google search and marketing setup, and 6) Custom online tools (like instant quote calculators). Everything is available at £35/hr or as a fixed package.'
  },
  {
    id: 'landing-page-vs-multipage',
    category: 'Services & Scope',
    question: 'Should I choose a one-page site or a multi-page website?',
    answer: 'A single-page website is great if you want to promote one specific service, run ads, or launch a quick offer with a clear contact form. A multi-page website (4–8 pages) is ideal for businesses that need separate pages for About Us, multiple Services, customer reviews, photo galleries, and contact details.'
  },
  {
    id: 'existing-site-redesign-upgrade',
    category: 'Services & Scope',
    question: 'Can you update or redesign my old, slow website?',
    answer: 'Yes! If you currently have an old or slow website that doesn\'t work well on mobile phones, I can take your existing content and branding, modernize the design, speed it up drastically, and make sure it functions smoothly across all smartphones and laptops.'
  },
  {
    id: 'ecommerce-payment-gateway-setup',
    category: 'Services & Scope',
    question: 'How do customers pay on my online store?',
    answer: 'Customers can pay securely using their debit/credit cards, Apple Pay, Google Pay, or PayPal. All payments deposit directly into your business bank account automatically.'
  },
  {
    id: 'custom-web-apps-features',
    category: 'Services & Scope',
    question: 'Can you build custom online calculators or tools for my business?',
    answer: 'Yes! If you want an instant quote calculator on your website so clients can calculate a price, an online booking form, or a private client portal, I can build it specifically for your business workflow.'
  },

  // ===================== PROCESS & DELIVERY =====================
  {
    id: 'live-preview-and-prototypes',
    category: 'Process & Delivery',
    question: 'How do I know what my website will look like before I commit?',
    answer: 'You can explore the interactive live showcases and tech blueprints right on this website. When we begin your project, I also provide design layout previews and a private, interactive testing link so you can test everything on your own phone before the site goes live.'
  },
  {
    id: 'project-timeline-expectations',
    category: 'Process & Delivery',
    question: 'How long does it take to build a website?',
    answer: 'A single-page website usually takes 5 to 7 days. A complete 4–8 page business website takes around 2 to 3 weeks. An online store or custom web tool usually takes 3 to 4 weeks.'
  },
  {
    id: 'how-to-kickoff-project',
    category: 'Process & Delivery',
    question: 'How do we get started?',
    answer: 'Just send a quick message on WhatsApp (+44 7927 548123) or fill out the contact form. We will have a friendly chat about what you need, agree on a price, and get started right away.'
  },
  {
    id: 'revisions-and-review-cycles',
    category: 'Process & Delivery',
    question: 'Can I see the website and make changes before it goes live?',
    answer: 'Yes, absolutely! I send you a private preview link that you can open on your own phone and computer. You can click around, test everything, and tell me any tweaks or adjustments you want before the site is launched to the public.'
  },
  {
    id: 'what-client-needs-to-provide',
    category: 'Process & Delivery',
    question: 'What do I need to give you before we begin?',
    answer: 'Just your company name, any logo you have, photos of your work, and the basic information about your services. If you do not have photos or text ready yet, don\'t worry—I can help write the text and provide high-quality professional photos for you.'
  },
  {
    id: 'post-launch-warranty',
    category: 'Process & Delivery',
    question: 'Do you offer support after the website is launched?',
    answer: 'Yes! Every project comes with 30 days of free post-launch support. If you spot anything that needs adjusting or have a question, I fix it right away at zero extra cost.'
  },

  // ===================== COMMUNICATION & AVAILABILITY =====================
  {
    id: 'direct-communication-channels',
    category: 'Communication & Availability',
    question: 'How will we communicate during the project?',
    answer: 'You talk directly with Saad M via WhatsApp (+44 7927 548123) for quick questions and updates, and email (saadm.clickncreate@gmail.com) for sending files and final reviews. You will never have to wait for an agency call center.'
  },
  {
    id: 'freelancer-vs-agency-difference',
    category: 'Communication & Availability',
    question: 'Why choose Click N Create instead of an expensive agency?',
    answer: 'Agencies charge thousands extra just to pay for overhead, office rent, and account managers. With Click N Create, you get the dedicated attention of a passionate developer who personally builds your website from scratch with modern technologies, transparent milestone progress, and a fair £35/hr rate.'
  },
  {
    id: 'timezone-and-response-time',
    category: 'Communication & Availability',
    question: 'How quickly do you reply to messages?',
    answer: 'I reply promptly on WhatsApp and email during the day, typically within a couple of hours.'
  },
  {
    id: 'current-availability-slots',
    category: 'Communication & Availability',
    question: 'Are you currently available to take on new projects?',
    answer: 'Yes! I am currently accepting new website projects, redesigns, and graphic design packages. Reach out on WhatsApp to check schedule availability.'
  },

  // ===================== TECHNICAL & TECHNOLOGY =====================
  {
    id: 'tech-stack-advantages',
    category: 'Technical & Technology',
    question: 'Why do you build clean custom websites instead of slow templates?',
    answer: 'Heavy template builders are stuffed with messy code that makes websites slow and clunky on phones. By building clean, custom code, your website opens in under 1 second, looks super sharp on iPhones and Androids, and never crashes when updates happen.'
  },
  {
    id: 'dark-light-mode-architecture',
    category: 'Technical & Technology',
    question: 'Can visitors read my website in dark mode and light mode?',
    answer: 'Yes! Your website includes a simple toggle button that lets visitors switch between a comfortable dark mode and a crisp light mode, making it easy to read in any lighting.'
  },
  {
    id: 'mobile-responsiveness-standards',
    category: 'Technical & Technology',
    question: 'Will my website work properly on all mobile phones?',
    answer: 'Yes, 100%. Over 70% of people view websites on their phones today. Every button, menu, picture, and text block is tested on real iPhones, Android phones, tablets, and laptops so it is always easy to read and tap.'
  },
  {
    id: 'performance-speed-seo',
    category: 'Technical & Technology',
    question: 'Will my website load fast and show up on Google?',
    answer: 'Yes! Every website is built to load in under 1 to 2 seconds, and includes built-in Google search settings (page titles, descriptions, and sitemaps) so search engines can easily find and list your business.'
  },

  // ===================== OWNERSHIP & LEGAL =====================
  {
    id: 'intellectual-property-ownership',
    category: 'Ownership & Legal',
    question: 'Who owns the website and domain once it is finished?',
    answer: 'You own 100% of everything. Your website files, images, graphics, and domain name belong completely to you. There are no monthly lock-in contracts or penalty fees.'
  },
  {
    id: 'contracts-and-ndas',
    category: 'Ownership & Legal',
    question: 'Do you provide a written agreement or contract?',
    answer: 'Yes. Before we start, we have a clear written scope showing exactly what is included, the agreed price, and the completion deadline so both of us are completely protected.'
  },
  {
    id: 'ongoing-maintenance-retianers',
    category: 'Ownership & Legal',
    question: 'Can you help update the website in the future?',
    answer: 'Yes! You can message me on WhatsApp anytime you need a text change or new photos added at my simple £35/hr rate, or choose an affordable monthly care plan where I handle updates and daily backups for you.'
  }
];
