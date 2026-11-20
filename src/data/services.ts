export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceEditorialSection {
  title: string;
  subtitle?: string;
  paragraphs: string[];
}

export interface ServiceEditorialSpotlight {
  kicker: string;
  heading: string;
  paragraphs: string[];
}

export interface ServiceClosingCta {
  heading: string;
  description: string;
  signOffName: string;
  signOffBrand: string;
  signOffRole: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  categoryTag: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  introParagraphs: string[];
  spotlight: ServiceEditorialSpotlight;
  coreCapabilities: ServiceEditorialSection[];
  technologySection?: ServiceEditorialSection;
  approachSection: ServiceEditorialSection;
  whoCanBenefitSection?: ServiceEditorialSection;
  resultSection: ServiceEditorialSpotlight;
  closingCta: ServiceClosingCta;
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
    title: 'E-Commerce Solutions',
    slug: 'ecommerce-development',
    categoryTag: 'Shopify · WooCommerce · Digital Commerce',
    tagline: 'Building Digital Stores That Turn Visitors Into Customers.',
    shortDescription:
      'Complete digital commerce platforms designed to showcase your products, connect with customers, and simplify online selling across every device.',
    fullDescription:
      'Take your business beyond traditional boundaries with powerful e-commerce solutions designed to simplify online selling and create seamless shopping experiences. I develop complete digital commerce platforms that help businesses showcase their products, connect with customers and manage their online operations efficiently.',
    introParagraphs: [
      'Take your business beyond traditional boundaries with powerful e-commerce solutions designed to simplify online selling and create seamless shopping experiences. I develop complete digital commerce platforms that help businesses showcase their products, connect with customers and manage their online operations efficiently.',
      'From launching a new online store to expanding an established retail business into the digital marketplace, I focus on creating solutions that combine attractive storefronts, reliable functionality and convenient shopping experiences. Every element is designed around your business model, customer expectations and long-term goals.',
    ],
    spotlight: {
      kicker: 'The Digital Storefront',
      heading: 'Your Online Store, Your Brand Identity.',
      paragraphs: [
        'Your online store is often the first interaction customers have with your business. It should communicate trust, showcase your products beautifully and make purchasing effortless. I create customised digital storefronts with modern layouts, carefully organised product displays and intuitive navigation.',
        'From the homepage to individual product pages, every part of the shopping journey is designed to maintain consistency and encourage customer engagement. The objective is to create an online destination that reflects your brand and makes customers comfortable exploring and purchasing your products.',
      ],
    },
    coreCapabilities: [
      {
        title: 'Complete Commerce Experience',
        paragraphs: [
          'A successful e-commerce platform requires more than attractive product displays. It needs a complete ecosystem that connects product discovery, shopping carts, checkout, payments and order management into one seamless experience.',
          'I develop online stores with structured product catalogues, detailed product information, product variations, inventory management and streamlined checkout functionality. Customers can browse categories, discover products, add items to their shopping carts and complete purchases through an organised buying process.',
        ],
      },
      {
        title: 'Payment and Order Management',
        paragraphs: [
          'A smooth purchasing experience is essential for online businesses. I integrate suitable payment solutions that allow customers to complete transactions conveniently and securely, depending on the supported payment providers and business requirements.',
          'The store can also include order management functionality to help business owners monitor purchases, manage order statuses and organise fulfilment. Customer notifications and administrative tools help make everyday store operations more manageable.',
        ],
      },
      {
        title: 'Product and Inventory Management',
        paragraphs: [
          'Managing products should be simple and efficient. I create organised product management systems that allow businesses to maintain product information, images, descriptions, prices, categories and variations.',
          'Inventory management functionality helps keep track of product availability and supports better organisation as the catalogue expands. Whether you manage a small collection or a growing product range, the platform can be structured around your operational requirements.',
        ],
      },
      {
        title: 'Customer Shopping Experience',
        paragraphs: [
          'Every successful online store depends on how customers interact with it. I focus on creating intuitive shopping journeys with clear product information, organised categories, convenient search functionality and responsive interfaces.',
          'Features such as product filtering, customer accounts, wishlists, product reviews and order tracking can be incorporated according to the requirements of your business. The goal is to reduce unnecessary complexity and make the shopping experience straightforward from the first visit to the final purchase.',
        ],
      },
      {
        title: 'Mobile Commerce',
        paragraphs: [
          'Customers increasingly discover and purchase products through mobile devices. Your online store should deliver the same quality of experience across smartphones, tablets and desktop computers.',
          'I develop responsive shopping experiences with adaptable layouts, mobile-friendly navigation, readable product information and convenient checkout interactions. Every important part of the store is considered to ensure customers can browse and shop comfortably regardless of their device.',
        ],
      },
      {
        title: 'Business Growth and Scalability',
        paragraphs: [
          'Your e-commerce platform should support your business as it develops. I focus on creating flexible solutions that can accommodate new products, additional categories, evolving business requirements and future integrations.',
          'Search-engine-friendly structures, analytics integrations and performance optimisation can help establish a stronger foundation for your online business. With the right technical setup, your store can continue evolving alongside your products, customers and commercial goals.',
        ],
      },
    ],
    technologySection: {
      title: 'E-Commerce Platforms and Technology',
      paragraphs: [
        'I work with established e-commerce platforms and modern web technologies to develop digital stores suited to different business requirements. Solutions can be built using WooCommerce and WordPress or Shopify, depending on the desired functionality, management preferences and business model.',
        'Additional technologies such as HTML, CSS, JavaScript, React and TypeScript can support customised frontend experiences and advanced integrations where required. The technology is selected to provide the right balance of flexibility, functionality and maintainability.',
      ],
    },
    approachSection: {
      title: 'My Approach',
      paragraphs: [
        'Every e-commerce project begins with understanding the business model, product range, target audience and operational requirements. This helps establish the right platform, functionality and shopping experience for the project.',
        'The development process then moves through planning, storefront design, product organisation, functionality development and integration. Once the store is built, its essential features are tested across devices and browsers, including product browsing, cart functionality and checkout interactions.',
        'After testing, the store is prepared for launch with the necessary configuration and deployment support. Ongoing technical assistance and maintenance can also be arranged according to the business requirements.',
      ],
    },
    resultSection: {
      kicker: 'The Result',
      heading: 'A Complete Digital Commerce Experience.',
      paragraphs: [
        'An effective online store brings your products, brand and customers together in one convenient digital environment. My focus is to create e-commerce solutions that look professional, function reliably and provide a strong foundation for online business operations.',
        'Whether you are starting your first online store or expanding an existing business into digital commerce, I aim to transform your requirements into a practical and engaging shopping experience.',
      ],
    },
    closingCta: {
      heading: "Let's Build Your Online Store.",
      description:
        "Your business deserves a digital storefront that reflects its potential. Let's create an e-commerce experience that showcases your products, connects with your customers and supports your next stage of growth.",
      signOffName: 'Saad M',
      signOffBrand: 'Click N Create',
      signOffRole: 'Web Developer & Digital Experience Designer',
    },
    image: '/file_000000003d8861f9978bc4e948bee359.png',
    altText:
      'E-Commerce Solutions 3D digital shopping cart with product items, payment cards, and checkout verification',
    pricingEstimate: 'Fixed milestone package or £35/hr',
    typicalTimeline: '2 – 3 Weeks',
    rateNote: 'Guaranteed fixed price with full launch and training support',
    techStack: ['Shopify', 'WooCommerce', 'WordPress', 'React', 'TypeScript', 'HTML / CSS / JS'],
    accentColor: '#38BDF8',
    features: [
      'Customised digital storefronts with modern layouts and intuitive navigation',
      'Structured product catalogues with variations, filtering, and search',
      'Secure payment integrations and streamlined checkout workflows',
      'Order management, fulfilment tracking, and automated customer notifications',
      'Organised product and inventory management systems',
      'Customer accounts, wishlists, product reviews, and order tracking',
      'Responsive mobile commerce optimised across phones, tablets, and desktops',
      'Search-engine-friendly architecture with analytics and scalability built in',
    ],
    deliverables: [
      'Fully working e-commerce store live on your custom web domain',
      'Secure payment processing connected directly to your business bank account',
      'Structured product catalogues, categories, and variations configured',
      'Automated customer notifications and order management tools',
      'Cross-device and cross-browser checkout and cart verification',
      'Launch configuration, deployment support, and handover walkthrough',
    ],
    suitableFor: [
      'New brands launching their first online retail store',
      'Established retail businesses expanding into digital commerce',
      'Independent creators selling physical or digital collections',
      'Growing stores seeking flexible, scalable e-commerce architecture',
    ],
    scopeInclusions: [
      'Storefront design aligned with your brand identity',
      'Payment provider and checkout integration',
      'Product catalogue, variation, and inventory setup',
      'Mobile commerce optimisation and cross-browser testing',
      'Launch configuration and deployment assistance',
    ],
    scopeExclusions: [
      'Shopify monthly software plan (paid directly to Shopify if chosen)',
      'Standard transaction processing fees from card providers',
    ],
    faqs: [
      {
        question: 'Should I choose Shopify or WooCommerce for my online store?',
        answer:
          'Both platforms are strong options depending on your goals. Shopify offers an all-in-one hosted platform with minimal maintenance, while WooCommerce on WordPress gives full ownership and deep customisation. I build both and help select the best fit for your business model.',
      },
      {
        question: 'Will I be able to manage products and inventory myself?',
        answer:
          'Yes. Every store is organised with an intuitive product and inventory management dashboard so you can update descriptions, images, prices, categories, and stock availability easily.',
      },
      {
        question: 'Is the store tested on mobile phones before launch?',
        answer:
          'Yes. Essential features—including product browsing, filtering, cart interactions, and checkout—are tested across smartphones, tablets, and desktop browsers prior to launch.',
      },
    ],
  },
  {
    id: 'web-dev',
    number: '02',
    title: 'Web Development',
    slug: 'web-development',
    categoryTag: 'Custom Websites · React · Next.js · WordPress',
    tagline: 'Turning Ideas Into Powerful Digital Experiences.',
    shortDescription:
      'Modern, visually engaging, and high-performance websites combining thoughtful UI/UX design, modern development, and seamless functionality.',
    fullDescription:
      'Your website is more than just an online presence. It is the digital identity of your business, your brand and your vision. I specialise in creating modern, visually engaging and high-performance websites that combine creative design, advanced technology and seamless functionality to deliver meaningful digital experiences.',
    introParagraphs: [
      'Your website is more than just an online presence. It is the digital identity of your business, your brand and your vision. I specialise in creating modern, visually engaging and high-performance websites that combine creative design, advanced technology and seamless functionality to deliver meaningful digital experiences.',
      'From professional business websites and personal portfolios to complex, customised web platforms, I develop solutions that are carefully tailored to your requirements. Every website is designed with a strong focus on visual identity, user experience, responsiveness and performance, ensuring that your digital presence makes a lasting impression.',
    ],
    spotlight: {
      kicker: 'The Experience',
      heading: 'A Great Website Begins With a Great Experience.',
      paragraphs: [
        'I believe a successful website should do more than simply look attractive. It should communicate your message clearly, guide visitors naturally and make every interaction feel effortless. My approach combines thoughtful UI/UX design with modern development techniques to create websites that are visually distinctive, intuitive and functional.',
        'Every project begins with understanding your vision, business objectives and target audience. From the initial structure and visual direction to the smallest interaction, each element is developed with purpose. The result is a website that reflects your identity while providing visitors with a smooth and engaging experience.',
      ],
    },
    coreCapabilities: [
      {
        title: 'Custom Website Development',
        paragraphs: [
          'Every business has a different story, and its website should reflect that individuality. I create customised websites based on your specific requirements, avoiding unnecessary limitations of generic designs. Whether you need a minimal corporate website, an interactive creative portfolio or a sophisticated digital platform, the entire experience can be developed around your brand and objectives.',
        ],
      },
      {
        title: 'Business Website Development',
        paragraphs: [
          'A professional business website helps establish credibility, communicate your services and connect with potential customers. I develop modern business websites with carefully structured pages, compelling content presentation and intuitive navigation. The focus is on creating a professional digital identity that represents your organisation and makes it easier for customers to understand what you offer.',
        ],
      },
      {
        title: 'Frontend Development',
        paragraphs: [
          'The frontend is where design becomes an interactive experience. Using modern technologies, I transform visual concepts into responsive and functional interfaces. From carefully crafted layouts and typography to interactive components and smooth animations, every detail is developed to create a consistent experience across different devices and screen sizes.',
        ],
      },
      {
        title: 'Interactive Web Experiences',
        paragraphs: [
          'Modern websites can offer much more than static pages. I incorporate meaningful animations, scroll-based interactions, transitions and dynamic visual elements to make digital experiences more engaging. These interactions are carefully implemented to complement the content rather than distract visitors, creating a balance between visual creativity and usability.',
        ],
      },
      {
        title: 'Website Redesign',
        paragraphs: [
          'An outdated website can affect how people perceive a business. I help transform existing websites into modern digital experiences through improved layouts, refined typography, better navigation and updated visual presentation. The redesign process focuses on preserving important existing information and functionality while improving the overall appearance, usability and performance.',
        ],
      },
      {
        title: 'Responsive Development',
        paragraphs: [
          'A website should provide an equally smooth experience regardless of how it is accessed. I develop responsive interfaces that adapt naturally to desktops, laptops, tablets and smartphones. Layouts, images, navigation and interactive elements are optimised to maintain consistency, readability and usability across different screen sizes.',
        ],
      },
      {
        title: 'Functionality and Integration',
        paragraphs: [
          "Beyond the visual experience, I develop the functionality that makes a website useful. Depending on project requirements, this can include contact forms, dynamic content, API integrations, database connectivity, third-party services and content management systems. Each integration is selected to support the website's purpose and provide practical value.",
        ],
      },
      {
        title: 'Performance and Quality',
        paragraphs: [
          'A visually impressive website should also perform efficiently. I focus on creating optimised digital experiences with attention to loading speed, responsive behaviour, clean implementation and maintainable code. Search-engine-friendly structures and technical SEO foundations can also be incorporated to help establish a stronger online presence.',
        ],
      },
    ],
    technologySection: {
      title: 'Technology and Development',
      paragraphs: [
        "I work with modern web technologies and development tools to create flexible, maintainable and scalable websites. My development toolkit includes HTML, CSS, JavaScript, TypeScript, React, Next.js and Tailwind CSS, along with tools such as Framer Motion and GSAP for interactive experiences. For content-driven websites, I also work with WordPress and Elementor. The technology stack is selected according to the project's complexity, functionality and long-term requirements.",
      ],
    },
    approachSection: {
      title: 'My Development Approach',
      paragraphs: [
        'Every project follows a structured development journey, beginning with understanding the requirements and defining the overall direction. I then plan the website architecture, organise its content and establish the visual approach. Once the design direction is clear, development begins, transforming the concept into a functional and responsive website.',
        'Throughout development, attention is given to performance, usability, browser compatibility and technical quality. Before launch, the website undergoes testing to identify issues and ensure that its essential features work correctly. After successful testing, the website is prepared for deployment, with assistance available for domain configuration, hosting and ongoing maintenance.',
      ],
    },
    resultSection: {
      kicker: 'The Goal',
      heading: 'Building Digital Experiences That Make an Impact.',
      paragraphs: [
        'My goal is to create websites that bring together design, technology and functionality in a meaningful way. Every project is an opportunity to turn an idea into something tangible, useful and memorable. Whether you are launching a new business, building your personal brand or transforming an existing website, I aim to deliver a digital experience that reflects your vision and supports your ambitions.',
      ],
    },
    closingCta: {
      heading: "Let's Build Something Meaningful.",
      description:
        "Your vision deserves more than an ordinary website. Let's transform your ideas into a powerful digital experience that represents your identity, connects with your audience and creates opportunities for growth.",
      signOffName: 'Saad M',
      signOffBrand: 'Click N Create',
      signOffRole: 'Web Developer & Digital Experience Designer',
    },
    image: '',
    altText:
      'Web Development 3D laptop representation with code interface, cloud components, and styling elements',
    pricingEstimate: '£35/hr or fixed project quotes',
    typicalTimeline: '1 – 3 Weeks',
    rateNote: 'Fixed price quote agreed before starting, or flexible £35/hr',
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'WordPress'],
    accentColor: '#0EA5E9',
    features: [
      'Custom website development built around your brand and objectives',
      'Structured business websites with clear navigation and messaging',
      'Modern frontend engineering with React, Next.js, TypeScript, and Tailwind CSS',
      'Interactive scroll animations and transitions with Framer Motion & GSAP',
      'Complete website redesigns preserving vital content while modernising UX',
      'Responsive interfaces across desktops, laptops, tablets, and smartphones',
      'Contact forms, API integrations, CMS setup, and database connectivity',
      'Performance optimisation, clean code, and technical SEO foundations',
    ],
    deliverables: [
      'Complete, finished website live on your custom domain',
      'Responsive mobile, tablet, and desktop layouts tested across browsers',
      'Working contact forms, integrations, or CMS dashboard',
      'Technical SEO structure and loading speed optimisation',
      'Domain configuration, hosting deployment, and handover support',
    ],
    suitableFor: [
      'Businesses establishing a credible, modern digital identity',
      'Founders and creators building distinctive personal portfolios',
      'Organisations modernising outdated or slow legacy websites',
      'Companies needing custom frontend interactivity and integrations',
    ],
    scopeInclusions: [
      'Architecture planning, content organisation, and visual direction',
      'Responsive UI/UX and frontend development',
      'Form, CMS, and third-party API integration as scoped',
      'Cross-browser and multi-device quality testing',
      'Deployment assistance for domain and hosting configuration',
    ],
    scopeExclusions: [
      'Domain registration renewal fees paid directly to registrar',
      'Third-party paid software licences where required',
    ],
    faqs: [
      {
        question: 'Which technology stack will be used for my website?',
        answer:
          'The stack is chosen to match your project goals—ranging from React, Next.js, TypeScript, and Tailwind CSS for high-performance custom sites to WordPress and Elementor for content-driven sites you want to edit visually.',
      },
      {
        question: 'Can you redesign my existing website without losing my content?',
        answer:
          'Yes. Website redesigns focus on preserving your important existing information and functionality while elevating layout structure, typography, navigation, responsiveness, and loading speed.',
      },
      {
        question: 'Do you assist with launching the website on my domain?',
        answer:
          'Yes. After testing across devices and browsers, I prepare the site for deployment and assist with domain configuration, hosting setup, and ongoing maintenance if needed.',
      },
    ],
  },
  {
    id: 'branding-design',
    number: '03',
    title: 'Branding & Design',
    slug: 'branding-and-design',
    categoryTag: 'Brand Identity · Logo Design · Graphic & Print Design',
    tagline: 'Creating Identities That Make Brands Unforgettable.',
    shortDescription:
      'Distinctive logos, cohesive visual brand identity systems, social media kits, marketing materials, and packaging concepts built for lasting recognition.',
    fullDescription:
      'A strong brand is more than a logo. It is the identity, personality and visual language that communicates what a business stands for. I create distinctive branding and visual design experiences that help businesses establish recognition, communicate their values and build meaningful connections with their audiences.',
    introParagraphs: [
      'A strong brand is more than a logo. It is the identity, personality and visual language that communicates what a business stands for. I create distinctive branding and visual design experiences that help businesses establish recognition, communicate their values and build meaningful connections with their audiences.',
      'From developing a complete brand identity to designing individual visual assets, my approach combines creativity, consistency and strategic thinking. Every design decision is made to ensure that your brand communicates the right message and creates a lasting impression.',
    ],
    spotlight: {
      kicker: 'The Creative Identity',
      heading: 'Your Brand. Your Story. Your Identity.',
      paragraphs: [
        'Every successful brand begins with a clear identity. The colours, typography, visual elements and overall presentation work together to create a recognisable personality. I focus on developing cohesive visual identities that reflect your business vision and distinguish your brand from competitors.',
        'Whether you are launching a new business or refreshing an existing identity, I create design systems that bring consistency to your communication across digital and physical platforms.',
      ],
    },
    coreCapabilities: [
      {
        title: 'Logo Design',
        paragraphs: [
          'A logo is often the first visual element people associate with a brand. I create distinctive and memorable logo concepts that communicate your business identity through thoughtful typography, shapes, symbols and visual composition.',
          'The focus is on creating a logo that feels appropriate for your brand, remains recognisable across different applications and works effectively in both digital and print environments.',
        ],
      },
      {
        title: 'Visual Brand Identity',
        paragraphs: [
          'A recognisable brand requires more than a logo. I develop cohesive visual identity systems that establish how your brand looks and feels across different platforms. This includes carefully selected colour palettes, typography systems, graphic elements, iconography and visual guidelines.',
          'Every component is designed to work together, creating a consistent brand appearance that strengthens recognition and communicates professionalism.',
        ],
      },
      {
        title: 'Graphic Design',
        paragraphs: [
          'Visual communication plays an important role in how people understand and interact with a business. I create creative graphic design assets that communicate ideas clearly while maintaining consistency with your brand identity.',
          'From promotional graphics and marketing materials to digital banners, presentations and branded visuals, each design is developed with attention to composition, typography, colours and visual hierarchy.',
        ],
      },
      {
        title: 'Social Media Design',
        paragraphs: [
          'Your social media presence is an important part of your brand identity. I create visually consistent social media designs that help businesses present themselves professionally across digital platforms.',
          'The designs can include promotional posts, campaign graphics, announcement visuals, branded templates and other creative assets that maintain a recognisable appearance across your social media communication.',
        ],
      },
      {
        title: 'Marketing and Promotional Materials',
        paragraphs: [
          'Effective marketing design combines clear communication with compelling visuals. I develop promotional materials that present your products, services and business messages in an engaging way.',
          'This can include digital advertisements, promotional banners, brochures, flyers, business cards and other branded communication materials designed according to your business requirements.',
        ],
      },
      {
        title: 'Packaging and Brand Applications',
        paragraphs: [
          'Packaging is an opportunity to extend your brand identity beyond the screen. I create packaging concepts and branded visual applications that help products communicate their identity through colours, typography, graphics and presentation.',
          'The objective is to maintain consistency between your product, packaging and overall brand experience.',
        ],
      },
    ],
    technologySection: {
      title: 'Design Tools and Technologies',
      paragraphs: [
        'I use modern creative tools and design software to develop professional visual assets and branding experiences. My toolkit includes Adobe Photoshop, Adobe Illustrator, Figma and other design applications depending on the requirements of each project.',
        'These tools support everything from logo creation and image editing to interface design, brand assets and marketing materials.',
      ],
    },
    approachSection: {
      title: 'Design Approach',
      paragraphs: [
        'My design process begins with understanding your business, audience, industry and creative direction. This helps establish a clear visual concept that reflects the personality and objectives of your brand.',
        'The process then moves into research, visual exploration, concept development and refinement. Different design elements are carefully considered to create a cohesive result that communicates effectively.',
        'Once the direction is finalised, the designs are prepared in suitable formats for their intended applications, whether digital platforms, print materials or other brand touchpoints.',
      ],
    },
    resultSection: {
      kicker: 'The Result',
      heading: 'A Brand That Stands Apart.',
      paragraphs: [
        'Your brand deserves an identity that people can recognise, remember and connect with. My goal is to create thoughtful visual experiences that communicate your business personality, establish consistency and help your brand present itself with confidence.',
        'Whether you need a completely new brand identity, a professional logo or creative marketing materials, I aim to transform your ideas into a distinctive visual language.',
      ],
    },
    closingCta: {
      heading: "Let's Create Your Identity.",
      description:
        "Every great brand has a story worth telling. Let's give yours a visual identity that represents your vision and leaves a lasting impression.",
      signOffName: 'Saad M',
      signOffBrand: 'Click N Create',
      signOffRole: 'Web Developer & Digital Experience Designer',
    },
    image: '/file_000000003c4c61f9a6295fced3c44012.png',
    altText:
      'Branding and design creative workspace with color swatches, typographic hierarchy, responsive layout frames, and aesthetic guidelines',
    pricingEstimate: 'Standalone design package or £35/hr',
    typicalTimeline: '3 – 7 Days',
    rateNote: 'Fixed price quote based on brand identity and print deliverables',
    techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Vector SVG', 'Print-Ready CMYK'],
    accentColor: '#2563EB',
    features: [
      'Distinctive logo concepts crafted for digital and print scalability',
      'Complete visual brand identity: colours, typography, iconography, and guidelines',
      'Graphic design assets including banners, presentations, and branded visuals',
      'Cohesive social media posts, campaign creatives, and reusable templates',
      'Marketing & print collateral: flyers, brochures, adverts, and business cards',
      'Product packaging concepts extending your identity beyond the screen',
    ],
    deliverables: [
      'Master logo files in digital and print formats (SVG, PNG, PDF, JPG)',
      'Visual identity guidelines covering colour palettes and typography',
      'Social media graphics, campaign visuals, and branded templates',
      'Print-ready PDFs for brochures, flyers, business cards, or packaging',
      'Full commercial ownership of all finalised design assets',
    ],
    suitableFor: [
      'New businesses establishing their first cohesive visual identity',
      'Existing companies refreshing an outdated logo or brand presentation',
      'Product brands requiring packaging concepts and print collateral',
      'Organisations seeking visual consistency across web and social media',
    ],
    scopeInclusions: [
      'Brand discovery, visual research, and creative direction',
      'Concept exploration and structured iterative refinement',
      'Exporting production-ready digital and print formats',
    ],
    scopeExclusions: [
      'Physical printing production and courier shipping costs',
      'Complex 3D animated motion intros unless separately scoped',
    ],
    faqs: [
      {
        question: 'What file formats will I receive for my logo and brand assets?',
        answer:
          'Finalised designs are prepared in all suitable formats for their intended touchpoints—including scalable vector files (SVG/PDF) for signage and print, plus crisp high-resolution PNG and JPG files for web and social media.',
      },
      {
        question: 'Can you design both digital assets and print materials?',
        answer:
          'Yes. From social media templates and digital ads to brochures, flyers, business cards, and packaging concepts, every asset is designed to keep your brand visually cohesive across digital and physical platforms.',
      },
    ],
  },
  {
    id: 'digital-marketing',
    number: '04',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    categoryTag: 'SEO · Social Media · Paid Ads · Analytics',
    tagline: 'Building Visibility. Creating Connections. Driving Growth.',
    shortDescription:
      'Strategic digital marketing combining SEO, social media, content marketing, targeted advertising, and data-driven analytics to grow your online presence.',
    fullDescription:
      "In today's digital world, having a great website or product is only the beginning. Reaching the right audience, building brand awareness and creating meaningful customer relationships require a strong digital marketing strategy.",
    introParagraphs: [
      "In today's digital world, having a great website or product is only the beginning. Reaching the right audience, building brand awareness and creating meaningful customer relationships require a strong digital marketing strategy.",
      'I help businesses strengthen their online presence through creative digital marketing solutions that combine strategic planning, compelling content and data-driven optimisation. From improving search visibility to creating engaging social media campaigns, the focus is on connecting your brand with the people who matter most.',
    ],
    spotlight: {
      kicker: 'The Digital Presence',
      heading: 'Turn Your Online Presence Into an Opportunity.',
      paragraphs: [
        'Your digital presence represents how people discover, perceive and interact with your business online. A consistent and well-planned marketing approach helps establish credibility, communicate your value and keep your brand visible across relevant digital platforms.',
        'I focus on creating marketing strategies that align with your business objectives, target audience and industry. Every campaign should have a clear purpose, whether it is increasing brand awareness, attracting website visitors, generating enquiries or supporting business growth.',
      ],
    },
    coreCapabilities: [
      {
        title: 'Search Engine Optimisation',
        subtitle: 'Be Found Where Your Customers Are Searching.',
        paragraphs: [
          'Search Engine Optimisation helps improve how your website appears in search engine results. I focus on building SEO-friendly website structures, optimising page content, improving metadata and organising information so that search engines can better understand your website.',
          "The approach includes keyword research, on-page optimisation, technical SEO foundations and content improvements. The objective is to strengthen your website's organic search visibility and help potential customers discover your products and services through relevant searches.",
        ],
      },
      {
        title: 'Social Media Marketing',
        subtitle: 'Build Your Brand. Engage Your Audience.',
        paragraphs: [
          'Social media provides businesses with an opportunity to communicate directly with their audiences and develop a recognisable online identity. I help create consistent social media experiences through creative content, branded visuals and platform-focused marketing strategies.',
          'From promotional content and educational posts to campaign creatives and brand storytelling, the focus is on presenting your business professionally while encouraging meaningful audience engagement.',
        ],
      },
      {
        title: 'Content Marketing',
        subtitle: 'Create Content That Communicates Value.',
        paragraphs: [
          'Good content helps people understand your business, builds trust and gives your audience a reason to engage with your brand. I focus on developing content ideas and digital communication that reflect your brand identity and address the interests of your target audience.',
          'This can include website content, promotional copy, informative articles, social media content and campaign messaging designed to communicate your services and products effectively.',
        ],
      },
      {
        title: 'Paid Advertising',
        subtitle: 'Reach the Right Audience With Targeted Campaigns.',
        paragraphs: [
          'Paid digital advertising allows businesses to reach specific audiences through online advertising platforms. I help plan and structure advertising campaigns based on business objectives, audience interests and campaign requirements.',
          'From promotional campaigns to lead-generation initiatives, the focus is on creating relevant advertisements, clear messaging and effective landing page experiences. Campaign performance can be monitored and refined using available analytics and advertising data.',
        ],
      },
      {
        title: 'Brand Awareness',
        subtitle: 'Make Your Business Recognisable.',
        paragraphs: [
          'Building a memorable brand requires consistency across every digital interaction. I help businesses maintain a cohesive online presence through consistent visual communication, content presentation and digital campaign direction.',
          'The objective is to create a recognisable identity that helps audiences understand what your business offers and remember your brand when they need your products or services.',
        ],
      },
      {
        title: 'Website Traffic and Conversion Optimisation',
        paragraphs: [
          'Attracting visitors is important, but creating meaningful actions is equally valuable. I focus on improving the digital journey from the first interaction to the final enquiry or purchase.',
          'This includes reviewing website navigation, landing page structure, content clarity, calls to action and user experience. The goal is to reduce unnecessary friction and make it easier for visitors to engage with your business.',
        ],
      },
      {
        title: 'Analytics and Performance',
        subtitle: 'Understand Your Results. Improve Your Strategy.',
        paragraphs: [
          'Effective digital marketing requires understanding what is working and where improvements are needed. Analytics tools provide valuable insights into website traffic, visitor behaviour, audience engagement and campaign performance.',
          'I focus on using available performance data to identify opportunities, evaluate marketing activities and support informed decisions. This creates a more structured approach to improving your digital presence over time.',
        ],
      },
    ],
    technologySection: {
      title: 'Tools and Platforms',
      paragraphs: [
        'Digital marketing activities can involve tools and platforms such as Google Analytics, Google Search Console, Google Ads, Meta Ads Manager, WordPress, SEO tools and social media platforms. The selection depends on the campaign objectives and business requirements.',
      ],
    },
    approachSection: {
      title: 'My Marketing Approach',
      paragraphs: [
        'Every marketing project begins with understanding your business, target audience, industry and objectives. Based on these requirements, a suitable digital marketing direction is established.',
        'The process involves identifying relevant platforms, planning content and campaigns, developing creative materials and implementing the selected marketing activities. Performance is then reviewed using available data to identify opportunities for refinement and improvement.',
        'The approach focuses on consistency, relevance and measurable objectives rather than relying on random promotional activities.',
      ],
    },
    resultSection: {
      kicker: 'The Result',
      heading: 'A Stronger Digital Presence for Your Business.',
      paragraphs: [
        'Digital marketing is about creating opportunities for people to discover your brand, understand your value and connect with your business. My focus is to help establish a consistent and effective online presence through creative communication, strategic marketing and continuous improvement.',
        'Whether you are launching a new business, building brand awareness or looking to strengthen your existing online presence, the right digital marketing approach can help you move towards your business goals.',
      ],
    },
    closingCta: {
      heading: "Let's Grow Your Digital Presence.",
      description:
        "Your brand deserves to be seen, recognised and remembered. Let's create a digital marketing strategy that connects your business with the right audience and builds opportunities for growth.",
      signOffName: 'Saad M',
      signOffBrand: 'Click N Create',
      signOffRole: 'Web Developer & Digital Experience Designer',
    },
    image: '/file_00000000d60c61f9a5d3f27f2976b911.png',
    altText:
      'Digital marketing and SEO 3D visual with growth analytics chart, target bullseye, search ranking graphs, and conversion megaphone',
    pricingEstimate: 'One-time setup package or monthly support',
    typicalTimeline: '4 – 7 Days',
    rateNote: 'Fixed setup package or ongoing monthly growth support',
    techStack: ['Google Analytics', 'Search Console', 'Google Ads', 'Meta Ads Manager', 'Technical SEO'],
    accentColor: '#60A5FA',
    features: [
      'Keyword research, on-page SEO, metadata, and technical search foundations',
      'Consistent social media marketing, creatives, and brand storytelling',
      'Value-driven website copy, articles, and campaign content marketing',
      'Targeted paid advertising campaigns across Google and Meta platforms',
      'Cohesive brand awareness across every digital touchpoint',
      'Conversion optimisation for navigation, landing pages, and calls to action',
      'Performance tracking and strategic insights via Google Analytics & Search Console',
    ],
    deliverables: [
      'SEO structure, metadata optimisation, and Google Search Console setup',
      'Google Analytics performance tracking configuration',
      'Tailored content direction and social/ad creative materials',
      'Landing page and conversion journey review',
      'Structured performance evaluation and refinement roadmap',
    ],
    suitableFor: [
      'Businesses strengthening organic visibility in search engines',
      'Brands building consistent recognition across social media platforms',
      'Companies launching targeted Google Ads or Meta lead campaigns',
      'Websites seeking clearer conversion journeys and measurable analytics',
    ],
    scopeInclusions: [
      'Audience, objective, and platform strategy planning',
      'Technical and on-page SEO foundations',
      'Analytics and Search Console setup',
      'Campaign structure, creatives, and conversion recommendations',
    ],
    scopeExclusions: [
      'Direct paid advertising spend budget paid to Google or Meta',
      'Unethical spam link-building schemes',
    ],
    faqs: [
      {
        question: 'Which platforms and tools do you work with?',
        answer:
          'Depending on your campaign objectives, I work with Google Analytics, Google Search Console, Google Ads, Meta Ads Manager, WordPress, technical SEO tools, and major social media platforms.',
      },
      {
        question: 'How do we measure if the marketing strategy is working?',
        answer:
          'Using Google Analytics, Search Console, and platform advertising data, we track website traffic, visitor behaviour, engagement, and enquiries so decisions and refinements are always grounded in real performance data.',
      },
    ],
  },
  {
    id: 'web-apps',
    number: '05',
    title: 'Web Application Development',
    slug: 'web-app-development',
    categoryTag: 'Custom Web Apps · Dashboards · Client Portals · APIs',
    tagline: 'Engineering Powerful Applications. Transforming Ideas Into Digital Solutions.',
    shortDescription:
      'Customised interactive web applications, dashboards, customer portals, backend systems, and workflow automation engineered around your exact requirements.',
    fullDescription:
      'Modern businesses need more than traditional websites. They need intelligent, interactive and scalable digital solutions that simplify operations, improve productivity and create better experiences for users.',
    introParagraphs: [
      'Modern businesses need more than traditional websites. They need intelligent, interactive and scalable digital solutions that simplify operations, improve productivity and create better experiences for users.',
      'I develop customised web applications that combine modern technologies, intuitive interfaces and powerful functionality to solve real-world business challenges. From business management platforms and customer portals to interactive dashboards and complex web-based systems, every application is developed around specific requirements and objectives.',
    ],
    spotlight: {
      kicker: 'The Digital Experience',
      heading: 'Beyond Traditional Websites.',
      paragraphs: [
        'A web application is designed to do more than display information. It allows users to interact with systems, manage information, perform tasks and access services through a dynamic digital environment.',
        'My approach focuses on creating applications that are practical, responsive and easy to use. Every interaction, workflow and interface element is planned to make the application intuitive while maintaining the functionality required to support its purpose.',
      ],
    },
    coreCapabilities: [
      {
        title: 'Custom Web Application Development',
        paragraphs: [
          'Every business has unique operational requirements. I develop customised web applications that are designed around specific workflows, user requirements and business objectives.',
          'Whether you need an internal management platform, a customer-facing application or a specialised web-based solution, the development process focuses on creating functionality that addresses your actual needs rather than forcing your business to adapt to generic software.',
        ],
      },
      {
        title: 'Interactive Dashboards',
        paragraphs: [
          'Data becomes more useful when it is organised and presented effectively. I develop interactive dashboards that help users access important information, monitor activities and understand performance through structured visual interfaces.',
          'Depending on the application requirements, dashboards can include data visualisations, reports, activity summaries, management controls and real-time information where supported by the underlying system.',
        ],
      },
      {
        title: 'User Authentication and Management',
        paragraphs: [
          'Applications often require different access levels for different users. I implement authentication and user management functionality to support secure access and organised user experiences.',
          'Depending on the project, this can include user registration, login systems, profile management, role-based permissions and administrative controls.',
        ],
      },
      {
        title: 'Database and Backend Development',
        paragraphs: [
          'A powerful application requires a reliable system behind its interface. I develop and integrate backend functionality that supports data processing, storage, application logic and communication between different components.',
          "Database architecture and API integrations are planned according to the application's requirements, helping establish a structured foundation for managing information and supporting future development.",
        ],
      },
      {
        title: 'API and Third-Party Integrations',
        paragraphs: [
          'Modern applications frequently need to communicate with external platforms and services. I integrate suitable APIs and third-party tools to extend application functionality and connect different systems.',
          'This can include payment services, external data sources, communication tools, analytics platforms and other business systems depending on project requirements.',
        ],
      },
      {
        title: 'Business Automation',
        paragraphs: [
          'Repetitive manual processes can consume valuable time and resources. I develop application functionality that helps streamline workflows, organise information and automate suitable business operations.',
          'From automated notifications and data processing to structured approval workflows and administrative tasks, the objective is to make everyday processes more efficient and manageable.',
        ],
      },
      {
        title: 'Responsive Web Applications',
        paragraphs: [
          'Applications should provide a consistent experience regardless of the device being used. I develop responsive interfaces that adapt to desktops, laptops, tablets and smartphones.',
          'Layouts, navigation, forms and interactive components are designed to remain accessible and easy to use across different screen sizes, ensuring users can access important functionality wherever they are.',
        ],
      },
      {
        title: 'Security and Performance',
        paragraphs: [
          "A reliable web application needs careful attention to performance, data handling and security. I focus on implementing appropriate authentication, access controls, input validation and secure integration practices based on the application's requirements.",
          'Performance optimisation, efficient data handling and maintainable architecture are also important considerations throughout development. These foundations help create applications that remain responsive and manageable as their functionality evolves.',
        ],
      },
    ],
    technologySection: {
      title: 'Technologies and Development',
      paragraphs: [
        'I work with modern development technologies to create flexible and maintainable web applications. My frontend toolkit includes React, JavaScript, TypeScript and Tailwind CSS, supported by modern interface and animation tools where appropriate.',
        "Backend services, databases, authentication systems and APIs are selected according to the technical requirements of each project. The objective is to establish an architecture that supports the application's functionality, performance and future development.",
      ],
    },
    approachSection: {
      title: 'My Development Process',
      paragraphs: [
        'Every application begins with understanding the problem it needs to solve. I work to identify the intended users, required functionality, business workflows and technical requirements before establishing the development direction.',
        'The process then moves through application planning, interface design, frontend development, backend integration and database configuration. Each component is developed with attention to functionality, usability and maintainability.',
        'Once development is complete, the application is tested across different devices and browsers. Important workflows, user interactions, authentication and integrations are checked before deployment. The application is then prepared for launch, with ongoing improvements and technical support available according to project requirements.',
      ],
    },
    whoCanBenefitSection: {
      title: 'Who Can Benefit?',
      paragraphs: [
        'Web applications can support startups, established businesses, service providers, educational organisations, entrepreneurs and companies looking to digitise their operations.',
        'Whether the requirement involves a customer portal, booking platform, management dashboard, internal business system or a completely customised digital product, the application can be designed around the intended users and workflows.',
      ],
    },
    resultSection: {
      kicker: 'The Result',
      heading: 'Turning Complex Requirements Into Simple Experiences.',
      paragraphs: [
        'The best applications make complicated processes feel simple. My goal is to transform ideas and business requirements into functional digital products that improve accessibility, organise information and create meaningful user experiences.',
        'Every project is an opportunity to build something useful, scalable and purpose-driven through the combination of thoughtful design and modern technology.',
      ],
    },
    closingCta: {
      heading: "Let's Build Your Next Digital Product.",
      description:
        "Have an idea for a web application? Let's turn it into a powerful digital solution designed around your vision, your users and your business goals.",
      signOffName: 'Saad M',
      signOffBrand: 'Click N Create',
      signOffRole: 'Web Developer & Digital Experience Designer',
    },
    image: '/file_00000000dcbc61f9ac09271ea9b4755e.png',
    altText:
      'Web Application Development interface with dynamic modular widgets, data visualization charts, interactive controls, and user settings panel',
    pricingEstimate: 'Itemised project quote or £35/hr',
    typicalTimeline: '2 – 4 Weeks',
    rateNote: 'Itemised milestone quote with clear feature breakdown',
    techStack: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Auth & Databases'],
    accentColor: '#38BDF8',
    features: [
      'Custom web applications tailored to specific business workflows',
      'Interactive dashboards with structured visualisations and management controls',
      'User registration, login, role-based permissions, and admin panels',
      'Database architecture and backend API engineering',
      'Third-party integrations (payments, data sources, notifications, analytics)',
      'Workflow automation for approvals, data processing, and admin tasks',
      'Responsive interfaces accessible across desktop, tablet, and mobile',
      'Security best practices, input validation, and scalable performance',
    ],
    deliverables: [
      'Custom web application live on your domain',
      'Frontend UI, backend logic, and database architecture configured',
      'User authentication and role-based access control where required',
      'Third-party API and automation integrations verified',
      'End-to-end testing across devices and browsers before launch',
    ],
    suitableFor: [
      'Startups and entrepreneurs launching custom digital products',
      'Established businesses digitising internal workflows and operations',
      'Service providers needing booking platforms or customer portals',
      'Educational and commercial organisations needing management dashboards',
    ],
    scopeInclusions: [
      'Workflow discovery, architecture planning, and UI design',
      'Frontend engineering, backend APIs, and database setup',
      'Authentication, access controls, and validation',
      'Cross-device testing and production deployment',
    ],
    scopeExclusions: [
      'Third-party cloud database or API usage fees billed by providers',
      'External SaaS platform subscriptions',
    ],
    faqs: [
      {
        question: 'Can you build role-based logins and admin dashboards?',
        answer:
          'Yes. I implement user registration, secure login flows, profile management, role-based permissions, and structured administrative dashboards tailored to your exact user roles.',
      },
      {
        question: 'Can my web application connect with external tools and APIs?',
        answer:
          'Yes. Applications can integrate with payment gateways, external data sources, communication tools, analytics platforms, and other business systems via APIs.',
      },
    ],
  },
  {
    id: 'hosting-maintenance',
    number: '06',
    title: 'Hosting & Maintenance',
    slug: 'hosting-maintenance',
    categoryTag: 'Web Hosting · Deployment · Backups · Security Care',
    tagline: 'Reliable Hosting. Continuous Care. Complete Peace of Mind.',
    shortDescription:
      'Dependable website hosting, smooth deployment, regular software updates, security protection, backups, SSL/DNS management, and ongoing technical support.',
    fullDescription:
      'A successful website needs more than great design and development. It requires a reliable hosting environment, regular maintenance and ongoing technical attention to remain secure, accessible and performing at its best.',
    introParagraphs: [
      'A successful website needs more than great design and development. It requires a reliable hosting environment, regular maintenance and ongoing technical attention to remain secure, accessible and performing at its best.',
      'I provide website hosting and maintenance solutions designed to keep your digital presence running smoothly. From server configuration and website deployment to regular updates, performance optimisation and technical support, I focus on maintaining a stable and dependable online environment.',
    ],
    spotlight: {
      kicker: 'The Foundation',
      heading: 'Your Website Deserves a Reliable Home.',
      paragraphs: [
        'Web hosting is the foundation that makes your website accessible to visitors around the world. Choosing the right hosting environment is essential for website performance, reliability and future growth.',
        "I help configure and manage suitable hosting solutions based on your website's requirements, traffic expectations and technical needs. Whether you operate a small business website, a professional portfolio or an e-commerce platform, the hosting environment should provide the stability and resources your website needs.",
      ],
    },
    coreCapabilities: [
      {
        title: 'Website Hosting',
        paragraphs: [
          'Every website requires a properly configured hosting environment to operate efficiently. I assist with selecting suitable hosting solutions, connecting domains, configuring hosting settings and deploying websites to their live environments.',
          'The focus is on establishing a reliable foundation that supports website accessibility, performance and smooth operation. Hosting recommendations are based on the specific requirements of each project rather than a one-size-fits-all approach.',
        ],
      },
      {
        title: 'Website Deployment',
        paragraphs: [
          'Taking a website from development to a live environment requires careful configuration and testing. I handle the deployment process, ensuring that website files, databases, domain settings and essential configurations are properly connected.',
          'Whether launching a new website or migrating an existing one, the objective is to make the transition as smooth as possible while minimising disruption.',
        ],
      },
      {
        title: 'Website Maintenance',
        paragraphs: [
          "Websites require regular attention to remain functional and up to date. I provide maintenance services that help keep your website's software, plugins, themes and essential components updated.",
          'Regular maintenance helps identify potential issues, maintain compatibility and reduce the risk of problems caused by outdated software. The goal is to keep your website operating reliably as technologies and requirements evolve.',
        ],
      },
      {
        title: 'Security and Protection',
        paragraphs: [
          'Website security is an important part of maintaining a professional online presence. I focus on essential security practices such as software updates, secure configurations, access management and appropriate backup arrangements.',
          'Depending on the hosting environment and website requirements, additional security measures can be implemented to help protect website data and reduce exposure to common security threats.',
        ],
      },
      {
        title: 'Performance Optimisation',
        paragraphs: [
          'A slow website can affect user experience and make it difficult for visitors to access information efficiently. I focus on improving website performance through image optimisation, caching configuration, resource management and other suitable optimisation techniques.',
          'The objective is to create a faster and smoother browsing experience while maintaining the quality and functionality of your website.',
        ],
      },
      {
        title: 'Backups and Recovery',
        paragraphs: [
          'Website data is valuable and should be protected against unexpected problems. I help configure appropriate backup arrangements for website files and databases, depending on the hosting platform and project requirements.',
          'Having reliable backups provides a recovery option if data is accidentally lost, a technical issue occurs or an update causes unexpected problems.',
        ],
      },
      {
        title: 'Domain and DNS Management',
        paragraphs: [
          'Your domain is an important part of your digital identity. I assist with domain configuration, DNS records, domain connections and related technical settings to ensure your website and associated services are connected correctly.',
          'This can include domain pointing, SSL configuration and assistance with website-related email settings where supported by the hosting provider.',
        ],
      },
      {
        title: 'SSL and HTTPS Configuration',
        paragraphs: [
          'A secure website connection helps protect information exchanged between visitors and your website. I assist with SSL certificate configuration and HTTPS setup to establish secure connections and avoid common browser security warnings.',
        ],
      },
      {
        title: 'Ongoing Technical Support',
        paragraphs: [
          'Technical problems can occur even when a website is properly developed and maintained. I provide assistance with troubleshooting, website errors, broken functionality, configuration issues and other maintenance-related requirements.',
          'The aim is to resolve technical issues efficiently and help your website continue operating as expected.',
        ],
      },
    ],
    approachSection: {
      title: 'My Maintenance Approach',
      paragraphs: [
        'Every website has different hosting and maintenance requirements. The process begins with reviewing the existing website, its technology stack, hosting environment and operational needs.',
        'Based on this assessment, suitable hosting configurations and maintenance requirements are established. The website is then monitored and maintained through planned updates, performance improvements, backup arrangements and technical assistance according to the agreed support scope.',
      ],
    },
    resultSection: {
      kicker: 'The Result',
      heading: 'A Website That Stays Ready for Business.',
      paragraphs: [
        'Your website should remain accessible, reliable and ready for visitors. My focus is to provide the technical foundation and ongoing care needed to support your digital presence.',
        'From initial deployment to regular maintenance, I help ensure that your website receives the attention it needs as your business continues to grow.',
      ],
    },
    closingCta: {
      heading: "Let's Keep Your Website Running.",
      description:
        "Your digital presence deserves reliable infrastructure and continuous care. Let's create a hosting and maintenance setup that keeps your website secure, updated and performing smoothly.",
      signOffName: 'Saad M',
      signOffBrand: 'Click N Create',
      signOffRole: 'Web Developer & Digital Experience Designer',
    },
    image: '/file_00000000f0ec61f9aa41eb3fa7a57a0f.png',
    altText:
      'Hosting and maintenance 3D graphic showing secure server tower, cloud synchronization, SSL padlock, and speed monitoring dials',
    pricingEstimate: 'Setup included with builds, or flexible monthly care',
    typicalTimeline: '24 – 48 Hours setup, or ongoing monthly care',
    rateNote: 'Affordable monthly care plan or pay-as-you-go £35/hr',
    techStack: ['Cloud Hosting', 'Domain & DNS', 'SSL / HTTPS', 'Automated Backups', 'Speed & Security'],
    accentColor: '#06B6D4',
    features: [
      'Tailored hosting setup matched to traffic and technical requirements',
      'Smooth live deployment and zero-disruption website migrations',
      'Planned updates for core software, plugins, themes, and components',
      'Security hardening, access management, and vulnerability mitigation',
      'Image optimisation, caching configuration, and speed tuning',
      'Scheduled backups and recovery readiness for files and databases',
      'Domain pointing, DNS record configuration, and SSL/HTTPS setup',
      'Direct ongoing technical troubleshooting and error resolution',
    ],
    deliverables: [
      'Configured hosting environment and live website deployment',
      'Domain, DNS records, and HTTPS/SSL certificate verified',
      'Backup and recovery system configured for files and databases',
      'Performance caching and regular software update schedule',
      'Ongoing technical support channel for troubleshooting and updates',
    ],
    suitableFor: [
      'Business owners seeking reliable infrastructure without server headaches',
      'Websites and e-commerce platforms needing regular updates and backups',
      'Companies migrating from slow hosting to a stable modern environment',
      'Teams wanting dependable technical support on hand when issues arise',
    ],
    scopeInclusions: [
      'Hosting environment assessment and configuration',
      'Domain, DNS, and SSL/HTTPS setup',
      'Backup configuration and planned software maintenance',
      'Performance optimisation and technical troubleshooting',
    ],
    scopeExclusions: [
      'Annual domain registrar renewal fees paid to registrar',
      'Dedicated enterprise bare-metal server hardware fees',
    ],
    faqs: [
      {
        question: 'Can you migrate my existing website to better hosting without disruption?',
        answer:
          'Yes. I carefully coordinate files, databases, DNS records, and SSL settings so migrating an existing website to a more reliable hosting environment happens smoothly with minimal disruption.',
      },
      {
        question: 'What happens if an update or technical issue breaks part of my site?',
        answer:
          'With planned updates, scheduled file and database backups, and direct ongoing technical support, issues can be diagnosed quickly and recovered safely so your site stays ready for business.',
      },
    ],
  },
];
