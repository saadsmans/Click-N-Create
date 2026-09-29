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

  // Purely personal bio as originally designed
  aboutBio: `Motivated and enthusiastic Electronics & Communication Engineering student with a strong interest in communication technologies, satellite communication, wireless systems, and modern web development.

I have hands-on experience building my freelance brand website, Click N Create, using WordPress with PHP and CSS customization, alongside modern React and TypeScript, which has strengthened my understanding of website development, responsive design, cloud hosting, and user experience.

I am also proficient in using AI tools to enhance productivity, research, content creation, and problem-solving. I enjoy learning emerging technologies, exploring innovative solutions, and continuously expanding my technical knowledge. With strong analytical thinking, communication, adaptability, and teamwork skills, I am eager to contribute to meaningful projects, gain industry experience, and build a successful career in communication engineering, web development, and AI-driven technology solutions.`,

  education: [
    {
      degree: 'Bachelor of Engineering (BE)',
      field: 'Electronics & Communication Engineering',
      institution: 'Government Engineering College, Bharuch',
      timeline: '2023 – 2027',
      location: 'Bharuch, Gujarat, India',
      highlights: [
        'Specializing in communication systems, wireless networks, and digital signal processing',
        'Bridging hardware signal understanding with modern web software architecture',
        'Academic excellence combined with active technical projects'
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
      description: 'Independent digital development brand designing and developing modern websites, custom client solutions, and brand identities.',
      keyResponsibilities: [
        'Designed and developed freelance web development platform using modern web technologies',
        'Customized website architectures using PHP, CSS, React, and WordPress for seamless client self-editing',
        'Configured web hosting, domain DNS, and website security protocols',
        'Created responsive pages tested across desktop and mobile devices',
        'Implemented plugin management, speed optimization, and SEO practices'
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

  // Dedicated Projects for CV & Portfolio
  projects: [
    {
      id: 'owais-academic-portfolio',
      title: 'Owais Portfolio & Academic Dashboard',
      category: 'Client Project · Academic Portfolio & Dashboard',
      clientOrRole: 'Client: Owais (Freelance Web Developer)',
      timeline: '2026 (Recent Client Delivery)',
      description: 'Comprehensive personal portfolio website and interactive academic background dashboard built for client Owais. Highlights his full academic history, educational trajectory, technical & soft skill proficiencies, projects, and personal achievements with a modern, high-speed responsive user interface.',
      featuredImage: 'https://owaisdashboard.vercel.app',
      tags: ['Client Project', 'Academic Dashboard', 'Portfolio Website', 'React / Next.js', 'Vercel Deployment', 'Tailwind CSS', 'Responsive UI'],
      achievements: [
        'Designed & engineered personal portfolio and academic showcase website for client Owais',
        'Structured complete educational records, academic milestones, and interactive skill proficiency matrix',
        'Deployed live on Vercel (owaisdashboard.vercel.app) with global edge CDN and zero downtime',
        'Built modern mobile-first responsive layout with dark/light visual polish and instant page transitions'
      ],
      liveUrl: 'https://owaisdashboard.vercel.app'
    },
    {
      id: 'click-n-create-platform',
      title: 'Click N Create Web Platform & Brand Identity',
      category: 'Freelance Web Platform & Brand System',
      clientOrRole: 'Founder & Full-Stack Developer',
      timeline: '2024 – Present (Flagship Platform)',
      description: 'The official freelance digital development platform and brand identity for Click N Create. Built from scratch featuring custom geometric vector logo, real-time interactive cost estimator, responsive glassmorphism UI, high-contrast dark/light theme engine, sub-second speed performance, and 1-click WhatsApp quote generator.',
      featuredImage: '/file_00000000440061f7b67bc59e52b0df8e.png',
      tags: ['Official Brand & Logo', 'React 19', 'TypeScript', 'Tailwind CSS', 'Interactive Estimator', 'Responsive UI', 'Sub-Second Speed'],
      achievements: [
        'Crafted complete Click N Create brand identity, typography wordmark, and vector logo system',
        'Engineered custom real-time quote estimator with transparent £35/hr and fixed milestone calculation',
        'Built responsive mobile-first architecture with sub-second page loads and zero layout shift',
        'Integrated seamless WhatsApp and direct email quotation pipelines for instant client onboarding'
      ],
      liveUrl: 'https://clickncreate.co.uk'
    }
  ],

  skillCategories: [
    {
      title: 'Web & E-Commerce Development',
      icon: 'Code2',
      skills: [
        { name: 'Modern React & TypeScript', level: 95, note: 'Component architectures, state management & Vite tooling' },
        { name: 'Tailwind CSS & Responsive UI', level: 98, note: 'Mobile-first design, fluid glassmorphism & dark/light themes' },
        { name: 'WordPress & PHP Customization', level: 90, note: 'Custom themes, templates, hooks & plugin architectures' },
        { name: 'Vercel & Cloud Deployment', level: 92, note: 'Edge CDN caching, DNS routing, SSL security & CI/CD' },
        { name: 'E-Commerce (Shopify & WooCommerce)', level: 88, note: 'Store setup, product variants & conversion optimization' }
      ]
    },
    {
      title: 'Electronics & Communication Engineering',
      icon: 'Radio',
      skills: [
        { name: 'Analog & Digital Signal Conversion', level: 88, note: 'Sampling theorems, quantization, filtering & ADC/DAC circuits' },
        { name: 'Communication Systems Fundamentals', level: 90, note: 'AM/FM/PM modulation, noise figures & transmission lines' },
        { name: 'Satellite & Wireless Communication', level: 85, note: 'Link budgets, orbital propagation & cellular standards' },
        { name: 'Circuit Simulation (eSim & CircuitJS)', level: 90, note: 'Schematic capture, transient analysis & frequency response' }
      ]
    },
    {
      title: 'Brand Identity & Digital Assets',
      icon: 'Palette',
      skills: [
        { name: 'Vector Logo Design & Typography', level: 92, note: 'Geometric branding, scalable SVG wordmarks & icons' },
        { name: 'Social Media & Graphic Design', level: 90, note: 'Banners, promotional collateral & marketing cards' },
        { name: 'Technical SEO & OpenGraph', level: 92, note: 'Structured JSON-LD schema, Twitter cards & Google Search Console' }
      ]
    },
    {
      title: 'Tools, AI & Professional Workflow',
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
  ]
};
