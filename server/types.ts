export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  service: string;
  budget: string;
  timeline: string;
  projectDetails: string;
  status: 'new' | 'in_review' | 'contacted' | 'closed';
  source?: string;
  createdAt: string;
  notes?: string;
}

export interface Quote {
  id: string;
  serviceId: string;
  serviceName: string;
  baseHours: number;
  selectedDeliverables: string[];
  pageCount?: number;
  productCount?: number;
  deliveryTier: string;
  deliveryMultiplier: number;
  totalEstimatedHours: number;
  hourlyRate: number;
  totalCost: number;
  timeline: string;
  clientName?: string;
  clientEmail?: string;
  clientBusiness?: string;
  createdAt: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  portalAccessKey: string;
  portalPassword?: string;
  status: 'active' | 'lead' | 'completed' | 'archived';
  totalSpent: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  category: string;
  status: 'planning' | 'design' | 'development' | 'testing' | 'launched' | 'paused';
  progressPercentage: number;
  startDate: string;
  deadline: string;
  budget: number;
  paidAmount: number;
  milestones: ProjectMilestone[];
  liveUrl?: string;
  stagingUrl?: string;
  repositoryUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  dueDate?: string;
  assignedTo: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  date: string;
  time: string;
  durationMinutes: number;
  meetingLink?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface CommunicationMessage {
  id: string;
  clientId: string;
  projectId?: string;
  sender: 'saad' | 'client';
  senderName: string;
  message: string;
  attachments?: { name: string; url: string; size?: string }[];
  timestamp: string;
  read: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'quote' | 'invoice' | 'welcome' | 'followup' | 'kickoff';
  body: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'hosting' | 'domain' | 'software' | 'hardware' | 'advertising' | 'other';
  amount: number;
  currency: string;
  date: string;
  vendor: string;
  receiptUrl?: string;
  recurring: boolean;
  notes?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantityOrHours: number;
  unitRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  currency: string;
  currencySymbol: string;
  
  // Client Info
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientBusiness: string;
  clientAddress?: string;
  clientVat?: string;

  // Provider Info
  providerName: string;
  providerBrand: string;
  providerEmail: string;
  providerPhone: string;
  providerWebsite: string;
  providerAddress: string;

  // Project Details
  projectTitle: string;
  projectDescription?: string;

  // Financials
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  depositPaid: number;
  totalDue: number;

  // Payment instructions
  bankName: string;
  accountName: string;
  sortCode: string;
  accountNumber: string;
  iban?: string;
  bic?: string;
  paypalEmail?: string;
  stripePaymentLink?: string;
  paymentNotes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  projectType: string;
  featured: boolean;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  published: boolean;
}

export interface AnnouncementPopup {
  id: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  type: 'banner' | 'popup' | 'bar';
  enabled: boolean;
  startDate?: string;
  endDate?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  ip: string;
  userAgent: string;
  details?: string;
  timestamp: string;
}

export interface UserSession {
  id: string;
  email: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  lastActive: string;
  token: string;
}

export interface VisitorPageVisit {
  path: string;
  timestamp: string;
  dwellSeconds: number;
}

export interface VisitorLog {
  id: string;
  sessionId: string;
  path: string;
  country: string;
  countryCode: string;
  city: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  screen: string;
  referrer: string;
  source: string;
  localTime: string;
  timestamp: string;
  dwellTimeSeconds: number;
  pageHistory: VisitorPageVisit[];
}

export interface ActiveSession {
  sessionId: string;
  path: string;
  country: string;
  countryCode: string;
  city: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  source: string;
  lastSeen: number;
  startedAt: string;
  pageHistory: string[];
  totalDwellSeconds: number;
}

export interface SeoPageSetting {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface SeoConfig {
  siteTitle: string;
  titleTemplate: string;
  siteDescription: string;
  siteUrl: string;
  defaultKeywords: string[];
  defaultOgImage: string;
  twitterHandle: string;
  googleSiteVerification?: string;
  jsonLdType: 'ProfessionalService' | 'Organization' | 'Person';
  companyLegalName: string;
  founderName: string;
  priceRange: string;
  serviceArea: string;
  enableSitemap: boolean;
  enableRobotsTxt: boolean;
  pages: Record<string, SeoPageSetting>;
}

export interface ThemeTokens {
  presetId?: string;
  presetName?: string;
  fontDisplay: string;
  fontSans: string;
  fontMono: string;
  accentCyan: string;
  accentPurple: string;
  accentGradient: string;
  bgTone: string;
  bgMainDark?: string;
  bgSecondaryDark?: string;
  bgMainLight?: string;
  bgSecondaryLight?: string;
  textColorDark?: string;
  textColorLight?: string;
  glowEffect: boolean;
  glowIntensity: 'none' | 'subtle' | 'medium' | 'cyber' | 'brutalist';
  borderRadius: 'sharp' | 'minimal' | 'modern' | 'soft' | 'pill';
  borderWidth?: 'none' | 'thin' | 'bold' | 'brutalist';
  buttonStyle?: 'glow' | 'flat' | 'brutalist' | 'outline' | 'glass';
  headerStyle?: string;
  footerStyle?: string;
  dropdownStyle?: string;
  backgroundPattern?: 'grid' | 'dots' | 'noise' | 'clean' | 'aurora' | 'circuit' | 'scanlines' | 'mesh';
  showGame: boolean;
  showGrid: boolean;
  customBadge?: string;
  customLogoUrl?: string;
  logoDisplayMode?: 'image_text' | 'image_only' | 'text_only';
  logoHeight?: number;
  customSiteIconUrl?: string;
}

export interface SiteCustomization {
  theme: ThemeTokens;
  seo: SeoConfig;
  invoices: Invoice[];
  pages: any;
  testimonials: TestimonialItem[];
  blogPosts: BlogPostItem[];
  announcement?: AnnouncementPopup;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'staff';
  status: 'active' | 'suspended';
  lastLogin?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  sizeBytes: number;
  category: 'banner' | 'portfolio' | 'receipt' | 'avatar' | 'document' | 'other';
  uploadedAt: string;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: ('inquiry.created' | 'invoice.paid' | 'quote.submitted' | 'project.updated' | 'page.edited')[];
  enabled: boolean;
  secret?: string;
  lastTriggered?: string;
  lastStatus?: number;
}

export interface MaintenanceConfig {
  enabled: boolean;
  message: string;
  headline: string;
  estimatedReturnTime?: string;
  allowAdminBypass: boolean;
  updatedAt: string;
}

export interface ServerEventLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'security';
  event: string;
  details?: string;
  ip?: string;
  timestamp: string;
}

export interface AdminCredentials {
  email: string;
  passwordHash: string;
  secondaryEmail?: string;
  sessionTimeoutHours?: number;
  apiKey?: string;
  loginAlertEmail?: boolean;
  recoveryKey?: string;
  updatedAt?: string;
}

export interface DatabaseSchema {
  inquiries: Inquiry[];
  quotes: Quote[];
  clients: ClientProfile[];
  projects: ProjectItem[];
  tasks: TaskItem[];
  appointments: Appointment[];
  messages: CommunicationMessage[];
  expenses: ExpenseItem[];
  emailTemplates: EmailTemplate[];
  testimonials: TestimonialItem[];
  blogPosts: BlogPostItem[];
  announcement: AnnouncementPopup;
  invoices: Invoice[];
  analytics: VisitorLog[];
  activeSessions: Record<string, ActiveSession>;
  auditLogs: AuditLog[];
  activeUserSessions: UserSession[];
  adminUsers: AdminUser[];
  customization: SiteCustomization;
  mediaAssets?: MediaAsset[];
  webhooks?: WebhookConfig[];
  maintenance?: MaintenanceConfig;
  serverLogs?: ServerEventLog[];
  adminCredentials: AdminCredentials;
}
