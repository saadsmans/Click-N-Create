export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  timeline: string;
  location: string;
  highlights: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  website?: string;
  timeline: string;
  type: string;
  description: string;
  keyResponsibilities: string[];
  techStack: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: { name: string; level: number; note?: string }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  clientOrRole: string;
  timeline: string;
  description: string;
  featuredImage: string;
  tags: string[];
  achievements: string[];
  liveUrl?: string;
}

export const SAAD_PORTFOLIO = {
  name: 'Saad M',
  title: 'Electronics & Communication Engineer | Web Developer',
  tagline: 'Engineering modern, high-speed websites and innovative digital solutions with a solid technical foundation.',
  avatarImage: '/file_000000002c8882099a216468f5829320.png',
  cvDocumentImage: '/White%20simple%20Sales%20Representative%20Cv%20Resume_20260802_150122_0000.png',
  email: 'Mansurisaad28012@gmail.com',
  phone: '+91 9265129400',
  ukPhone: '+44 7927 548123',
  whatsappUrl: 'https://wa.me/447927548123',
  location: 'Bharuch, Gujarat, India',
  availability: 'Available for Freelance Projects Worldwide',

  aboutBio: `Motivated and enthusiastic Electronics & Communication Engineering student with a strong interest in communication technologies, satellite communication, wireless systems, and modern web development.

I have hands-on experience building my freelance brand website, Click N Create, using WordPress with PHP and CSS customization, alongside modern React and TypeScript, which has strengthened my understanding of website development, responsive design, cloud hosting, and user experience.

I am also proficient in using AI tools to enhance productivity, research, content creation, and problem-solving. I enjoy learning emerging technologies, exploring innovative solutions, and continuously expanding my technical knowledge. With strong analytical thinking, communication, adaptability, and teamwork skills, I am eager to contribute to meaningful projects, gain industry experience, and build a successful career in communication engineering, web development, and AI-driven technology solutions.`,

  education: [
    {
      degree: 'Bachelor of Engineering (BE)',
      field: 'Electronics And Communication Engineering',
      institution: 'Government Engineering College, Bharuch',
      timeline: '2023 – 2027',
      location: 'Bharuch, Gujarat, India',
      highlights: [
        'Specializing in communication systems, wireless networks, and digital signal processing',
        'Bridging hardware signal understanding with modern web software architecture',
        'Academic excellence combined with active freelance web development projects'
      ]
    }
  ],

  experience: [
    {
      role: 'Lead Web Developer & Founder',
      company: 'Click N Create',
      website: 'https://clickncreate.co.uk',
      timeline: '2024 – Present',
      type: 'Freelance Digital Development',
      description: 'Independent digital development brand building custom websites, e-commerce stores, and interactive estimators for business clients.',
      keyResponsibilities: [
        'Designed and developed the freelance web development platform using modern web technologies',
        'Customized website architectures using PHP, CSS, React, and WordPress for seamless client self-editing',
        'Configured cloud hosting, DNS domain routing, SSL certificates, and security protocols',
        'Engineered responsive, mobile-first layouts tested across phones, tablets, and desktops',
        'Implemented SEO best practices, structured schema, Google Search Console indexing, and speed optimization'
      ],
      techStack: ['WordPress', 'React', 'PHP', 'Tailwind CSS', 'TypeScript', 'Shopify', 'SEO']
    },
    {
      role: 'Project Intern',
      company: 'Spoken Tutorial Project – IIT Bombay',
      timeline: 'Academic Internship',
      type: 'Technical Engineering Internship',
      description: 'Completed circuit simulation project under the guidance of IIT Bombay Spoken Tutorial Project.',
      keyResponsibilities: [
        'Executed Electronic Circuit Simulation using eSim and CircuitJS',
        'Analyzed analog and digital circuit behavior, signal conversion, and voltage waveforms',
        'Documented technical workflows and simulation test cases according to national standards'
      ],
      techStack: ['eSim', 'CircuitJS', 'Analog & Digital Signals', 'Electronic Simulation']
    }
  ],

  skillCategories: [
    {
      title: 'Web & E-Commerce Development',
      icon: 'Code2',
      skills: [
        { name: 'Web Development (WordPress, Shopify, React)', level: 95, note: 'Custom themes, Liquid & component architecture' },
        { name: 'E-commerce Setup & Website Optimization', level: 90, note: 'Cart drawers, Stripe checkout & inventory' },
        { name: 'Mobile-First Responsive Design', level: 95, note: 'Flawless UI on iPhones, Androids & laptops' },
        { name: 'Speed Tuning & Core Web Vitals', level: 90, note: 'Fast loading (<1s) & asset compression' }
      ]
    },
    {
      title: 'Digital Marketing & Design',
      icon: 'TrendingUp',
      skills: [
        { name: 'Google Ads & SEO Basics', level: 85, note: 'Search indexing, keywords & rich snippets' },
        { name: 'UI / UX Design & Typography', level: 90, note: 'Modern layouts, dark/light mode & user flows' },
        { name: 'Social Media & Print Graphic Design', level: 85, note: 'Banners, flyers, posters & promo collateral' },
        { name: 'Microsoft Office (Word, Excel, PowerPoint)', level: 95, note: 'Documentation, reports & client pitch decks' }
      ]
    },
    {
      title: 'Electronics & Communication Engineering',
      icon: 'Cpu',
      skills: [
        { name: 'Analog & Digital Signal Conversion', level: 88, note: 'Sampling, modulation & signal integrity' },
        { name: 'Communication Systems Fundamentals', level: 85, note: 'Transmitters, receivers & data transmission' },
        { name: 'Satellite & Wireless Communication', level: 82, note: 'RF propagation, antenna systems & links' },
        { name: 'Circuit Simulation (eSim & CircuitJS)', level: 88, note: 'Schematic capture & circuit verification' }
      ]
    },
    {
      title: 'Modern AI Tools & Productivity',
      icon: 'Sparkles',
      skills: [
        { name: 'Proficiency in AI Tools', level: 95, note: 'Productivity acceleration, research & automated workflows' },
        { name: 'Fast Technical Problem Solving', level: 92, note: 'Rapid debugging and emerging tech exploration' },
        { name: 'Client Communication & Transparency', level: 95, note: 'Clear timelines, no jargon & honest billing' }
      ]
    }
  ],

  languages: [
    { name: 'English', proficiency: 'Professional Working Proficiency', flag: '🇬🇧' },
    { name: 'Hindi', proficiency: 'Fluent', flag: '🇮🇳' },
    { name: 'Gujarati', proficiency: 'Native / Bilingual', flag: '🇮🇳' }
  ],

  projects: [
    {
      id: 'click-n-create-platform',
      title: 'Click N Create Web Platform & Custom Estimator',
      category: 'Full-Stack Web Development & Custom Tool',
      clientOrRole: 'Founder & Full-Stack Developer',
      timeline: '2024 – Present (Flagship Platform)',
      description: 'The official freelance digital development platform for Click N Create. Built from scratch featuring an interactive real-time cost calculator, multi-page client hub, responsive glassmorphism UI, high-contrast dark/light theme engine, sub-second speed performance, and 1-click WhatsApp quote generator.',
      featuredImage: '/file_00000000440061f7b67bc59e52b0df8e.png',
      tags: ['React 19', 'TypeScript', 'Tailwind CSS', 'Interactive Estimator', 'Responsive UI', 'Sub-Second Speed'],
      achievements: [
        'Engineered custom real-time quote estimator with transparent £35/hr and fixed milestone calculation',
        'Built responsive mobile-first architecture with sub-second page loads and zero layout shift',
        'Integrated seamless WhatsApp and direct email quotation pipelines for instant client onboarding'
      ],
      liveUrl: 'https://clickncreate.co.uk'
    },
    {
      id: 'click-n-create-brand-identity',
      title: 'Click N Create Brand Identity & Vector Logo System',
      category: 'Brand Identity & Graphic Design',
      clientOrRole: 'Brand Designer & Creator',
      timeline: '2024 – Present',
      description: 'Complete visual identity system and logo design crafted for the Click N Create brand. Includes custom geometric typography wordmark, vector icon badge, dark/light high-contrast color palettes, social media banners, and digital promotional collateral.',
      featuredImage: '/file_000000003c4c61f9a6295fced3c44012.png',
      tags: ['Vector Logo Design', 'Brand Guidelines', 'Typography System', 'Dark/Light Palette', 'Social Media Assets'],
      achievements: [
        'Designed distinctive cyber-futuristic logo and typography wordmark for high legibility across screens',
        'Crafted dark & light mode adaptable brand color schemes and glowing UI assets',
        'Exported multi-resolution vector SVG, PNG, and print-ready graphic assets'
      ],
      liveUrl: 'https://clickncreate.co.uk'
    },
    {
      id: 'click-n-create-infrastructure',
      title: 'Production Cloud Infrastructure, Domain & Security Setup',
      category: 'Cloud Deployment & DevOps',
      clientOrRole: 'Lead Systems & Deployment Engineer',
      timeline: '2024 – Present',
      description: 'End-to-end cloud infrastructure configuration and production setup for Click N Create. Includes custom domain DNS routing, automated SSL/TLS 1.3 encryption, edge CDN caching, SEO meta tag architecture, Google Search Console indexing, and GDPR-compliant cookie consent.',
      featuredImage: '/file_00000000dcbc61f9ac09271ea9b4755e.png',
      tags: ['Cloud Hosting', 'DNS Management', 'SSL / TLS 1.3', 'Technical SEO', 'GDPR Compliance', '60fps Optimization'],
      achievements: [
        'Configured custom domain DNS records with automated HTTPS security and global edge CDN caching',
        'Implemented technical SEO, OpenGraph social cards, and Schema.org structured data for search discovery',
        'Engineered zero-lag, 60fps responsive performance with GPU hardware acceleration'
      ],
      liveUrl: 'https://clickncreate.co.uk'
    }
  ]
};
