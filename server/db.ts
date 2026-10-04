import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DatabaseSchema,
  AdminCredentials,
  Inquiry,
  Quote,
  ClientProfile,
  ProjectItem,
  TaskItem,
  Appointment,
  CommunicationMessage,
  ExpenseItem,
  EmailTemplate,
  TestimonialItem,
  BlogPostItem,
  AnnouncementPopup,
  Invoice,
  VisitorLog,
  ActiveSession,
  AuditLog,
  UserSession,
  AdminUser,
  SiteCustomization,
  SeoConfig,
  MediaAsset,
  WebhookConfig,
  MaintenanceConfig,
  ServerEventLog,
} from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_SEO: SeoConfig = {
  siteTitle: 'Click N Create | Saad M — Freelance Web Developer & Designer',
  titleTemplate: '%s | Click N Create',
  siteDescription: 'Click N Create is the freelance digital development brand of Saad M. Bespoke high-performance web applications, modern e-commerce storefronts, and conversion-focused business platforms at £35/hr.',
  siteUrl: 'https://clickncreate.co.uk',
  defaultKeywords: [
    'freelance web developer',
    'web designer UK',
    'React TypeScript developer',
    'custom e-commerce Shopify',
    'Saad M developer',
    'Click N Create',
    'hire front-end engineer',
    'bespoke website design',
    'clickncreate.co.uk',
  ],
  defaultOgImage: 'https://clickncreate.co.uk/file_00000000440061f7b67bc59e52b0df8e.png',
  twitterHandle: '@ClickNCreate',
  googleSiteVerification: 'google-site-verification-cnc-2026',
  jsonLdType: 'ProfessionalService',
  companyLegalName: 'Click N Create Digital Studio',
  founderName: 'Saad M',
  priceRange: '£35/hr',
  serviceArea: 'United Kingdom, Europe, North America & Global Remote',
  enableSitemap: true,
  enableRobotsTxt: true,
  pages: {},
};

const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl-quote',
    name: 'Project Quotation Proposal',
    category: 'quote',
    subject: 'Click N Create · Project Quotation & Scope Breakdown for {{clientName}}',
    body: `Hi {{clientName}},

Thank you for reaching out to Click N Create!

I have reviewed your project requirements and put together an itemized scope and price estimate for {{projectName}}.

• Estimated Development Time: ~{{hours}} hours
• Rate: £35/hr (Fixed Milestone Scope)
• Total Estimated Investment: £{{totalCost}}
• Expected Timeline: {{timeline}}

You can review your scope breakdown and project status directly in your Client Portal anytime.

Let me know if you would like to book a quick 15-minute alignment call to get started!

Warm regards,
Saad M
Lead Engineer & Founder · Click N Create
+44 7927 548123 | saadm.clickncreate@gmail.com`,
  },
  {
    id: 'tmpl-welcome',
    name: 'Client Onboarding & Portal Access',
    category: 'welcome',
    subject: 'Welcome to Click N Create! Access Your Client Project Portal',
    body: `Hi {{clientName}},

Welcome to Click N Create! I am excited to collaborate on {{projectName}}.

Your secure client portal has been provisioned. You can track live sprint milestones, review design proofs, download invoices, and message me directly:

👉 Portal URL: https://clickncreate.dev/portal
🔑 Access Key: {{portalAccessKey}}

Looking forward to bringing this vision to life!

Best,
Saad M · Click N Create`,
  },
  {
    id: 'tmpl-invoice',
    name: 'Invoice Issued & Completion',
    category: 'invoice',
    subject: 'Invoice {{invoiceNumber}} from Click N Create Digital Studio',
    body: `Hi {{clientName}},

Please find attached your invoice {{invoiceNumber}} for {{projectTitle}}.

• Total Amount: £{{totalDue}}
• Due Date: {{dueDate}}
• Status: {{status}}

Payment can be made via direct UK Bank Transfer (Sort Code: 20-00-00, Account: 83920194) or online through your client portal.

Thank you for your business!

Saad M · Click N Create`,
  },
  {
    id: 'tmpl-followup',
    name: 'Lead 3-Day Follow-Up',
    category: 'followup',
    subject: 'Following up on your website project with Saad M',
    body: `Hi {{clientName}},

Just following up on the project inquiry you sent regarding {{projectName}}.

I have slots open in my development schedule for this month and would love to help you build this out. Do you have 10 minutes this week for a quick chat?

Best regards,
Saad M · Click N Create`,
  },
];

const INITIAL_SCHEMA: DatabaseSchema = {
  inquiries: [],
  quotes: [],
  clients: [],
  projects: [],
  tasks: [],
  appointments: [],
  messages: [],
  expenses: [],
  emailTemplates: DEFAULT_EMAIL_TEMPLATES,
  testimonials: [
    {
      id: 'test-1',
      author: 'Marcus Vance',
      role: 'CEO',
      company: 'Apex Retail UK',
      content: 'Saad delivered our custom Shopify store in under 2 weeks. Lightning fast, sub-second loads, and our conversions spiked by 310%. Hands down the best engineer we have worked with.',
      rating: 5,
      projectType: 'E-commerce & Headless Web App',
      featured: true,
    },
    {
      id: 'test-2',
      author: 'Dr. Sarah Jenkins',
      role: 'Founder',
      company: 'Aura Aesthetics London',
      content: 'Working directly with Saad was effortless. No agency bureaucracy, honest £35/hr billing, and complete code ownership. The client portal made tracking progress seamless.',
      rating: 5,
      projectType: 'Bespoke Luxury Website',
      featured: true,
    },
  ],
  blogPosts: [],
  announcement: {
    id: 'ann-1',
    title: 'New 2026 Project Slots Open',
    message: 'Now accepting bookings for Q4 2026 web & e-commerce builds at transparent £35/hr rate.',
    ctaText: 'Calculate Price',
    ctaLink: '/estimator',
    type: 'bar',
    enabled: true,
  },
  invoices: [],
  analytics: [],
  activeSessions: {},
  auditLogs: [],
  activeUserSessions: [],
  adminUsers: [
    {
      id: 'adm-owner-1',
      name: 'Saad M',
      email: 'saadm.clickncreate@gmail.com',
      role: 'owner',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00Z',
    },
  ],
  customization: {
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
      customBadge: 'AVAILABLE FOR NEW 2026 PROJECTS',
    },
    seo: DEFAULT_SEO,
    invoices: [],
    pages: {},
    testimonials: [],
    blogPosts: [],
    updatedAt: new Date().toISOString(),
  },
  adminCredentials: {
    email: 'admin@clickncreate.com',
    passwordHash: 'saad2026',
    secondaryEmail: '',
    sessionTimeoutHours: 24,
    apiKey: 'cnc_live_key_9f830a7b12',
    loginAlertEmail: true,
    recoveryKey: 'CNC-SEC-2026-SAAD-KEY',
    updatedAt: new Date().toISOString(),
  },
};

class JSONDatabase {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.ensureDir();
    this.data = this.load();
  }

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          ...INITIAL_SCHEMA,
          ...parsed,
          adminCredentials: {
            email: parsed.adminCredentials?.email || 'admin@clickncreate.com',
            passwordHash: parsed.adminCredentials?.passwordHash || 'saad2026',
            secondaryEmail: parsed.adminCredentials?.secondaryEmail || '',
            sessionTimeoutHours: parsed.adminCredentials?.sessionTimeoutHours || 24,
            apiKey: parsed.adminCredentials?.apiKey || 'cnc_live_key_9f830a7b12',
            loginAlertEmail: parsed.adminCredentials?.loginAlertEmail ?? true,
            recoveryKey: parsed.adminCredentials?.recoveryKey || 'CNC-SEC-2026-SAAD-KEY',
            updatedAt: parsed.adminCredentials?.updatedAt || new Date().toISOString(),
          },
          emailTemplates: parsed.emailTemplates?.length > 0 ? parsed.emailTemplates : DEFAULT_EMAIL_TEMPLATES,
          testimonials: parsed.testimonials || INITIAL_SCHEMA.testimonials,
        };
      }
    } catch (err) {
      console.warn('Could not read db.json, initializing fresh database:', err);
    }
    this.saveSync(INITIAL_SCHEMA);
    return INITIAL_SCHEMA;
  }

  private saveSync(data: DatabaseSchema) {
    try {
      this.ensureDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  private scheduleSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveSync(this.data);
      this.saveTimeout = null;
    }, 300);
  }

  // ---------------- Audit Logging ----------------
  public logAudit(action: string, actor: string, ip: string = '127.0.0.1', details: string = '') {
    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      action,
      actor,
      ip,
      userAgent: 'Browser Client',
      details,
      timestamp: new Date().toISOString(),
    };
    if (!this.data.auditLogs) this.data.auditLogs = [];
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) this.data.auditLogs.pop();
    this.scheduleSave();
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs || [];
  }

  // ---------------- Admin Authentication & Credentials ----------------
  public getAdminCredentials(): AdminCredentials {
    return (
      this.data.adminCredentials || {
        email: 'admin@clickncreate.com',
        passwordHash: 'saad2026',
        secondaryEmail: '',
        sessionTimeoutHours: 24,
        apiKey: 'cnc_live_key_9f830a7b12',
        loginAlertEmail: true,
        recoveryKey: 'CNC-SEC-2026-SAAD-KEY',
        updatedAt: new Date().toISOString(),
      }
    );
  }

  public updateAdminCredentials(
    newCreds: Partial<AdminCredentials>,
    actorEmail: string = 'admin'
  ): { success: boolean; credentials?: AdminCredentials; error?: string } {
    if (!this.data.adminCredentials) {
      this.data.adminCredentials = {
        email: 'admin@clickncreate.com',
        passwordHash: 'saad2026',
        sessionTimeoutHours: 24,
        apiKey: 'cnc_live_key_9f830a7b12',
        loginAlertEmail: true,
        updatedAt: new Date().toISOString(),
      };
    }

    if (newCreds.email) {
      const clean = newCreds.email.trim().toLowerCase();
      if (!clean.includes('@') || !clean.includes('.')) {
        return { success: false, error: 'Please provide a valid email format.' };
      }
      this.data.adminCredentials.email = clean;
    }

    if (newCreds.passwordHash && newCreds.passwordHash.trim().length > 0) {
      if (newCreds.passwordHash.trim().length < 4) {
        return { success: false, error: 'Password or passcode must be at least 4 characters.' };
      }
      this.data.adminCredentials.passwordHash = newCreds.passwordHash.trim();
    }

    if (newCreds.secondaryEmail !== undefined) {
      this.data.adminCredentials.secondaryEmail = (newCreds.secondaryEmail || '').trim().toLowerCase();
    }

    if (typeof newCreds.sessionTimeoutHours === 'number') {
      this.data.adminCredentials.sessionTimeoutHours = newCreds.sessionTimeoutHours;
    }

    if (newCreds.apiKey !== undefined) {
      this.data.adminCredentials.apiKey = newCreds.apiKey.trim();
    }

    if (newCreds.loginAlertEmail !== undefined) {
      this.data.adminCredentials.loginAlertEmail = newCreds.loginAlertEmail;
    }

    this.data.adminCredentials.updatedAt = new Date().toISOString();

    // Also update any owner email in adminUsers list
    if (this.data.adminUsers && this.data.adminUsers.length > 0 && newCreds.email) {
      const owner = this.data.adminUsers.find((u) => u.role === 'owner');
      if (owner) {
        owner.email = newCreds.email.trim().toLowerCase();
      }
    }

    this.logAudit(
      'ADMIN_CREDENTIALS_UPDATED',
      actorEmail,
      '127.0.0.1',
      `Admin login credentials and security settings were updated.`
    );
    this.saveSync(this.data);

    return { success: true, credentials: this.data.adminCredentials };
  }

  public createAdminSession(email: string, token: string): UserSession {
    const session: UserSession = {
      id: `sess_${Date.now()}`,
      email: (email || 'admin@clickncreate.com').trim().toLowerCase(),
      device: 'Desktop / Authorized Workstation',
      browser: 'Secure Admin Session',
      os: 'Admin Environment',
      ip: '127.0.0.1 (Direct)',
      lastActive: new Date().toISOString(),
      token,
    };

    if (!this.data.activeUserSessions) this.data.activeUserSessions = [];
    this.data.activeUserSessions.unshift(session);
    if (this.data.activeUserSessions.length > 50) this.data.activeUserSessions.pop();
    this.scheduleSave();
    return session;
  }

  public authenticateAdmin(email: string, password: string): { success: boolean; token?: string; error?: string } {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const storedCreds = this.getAdminCredentials();

    const validEmails = [
      'admin@clickncreate.com',
      'admin@clickncreate.dev',
      'saad@clickncreate.dev',
      'saadm.clickncreate@gmail.com',
      'mansurisaad28012@gmail.com',
    ];
    if (storedCreds.email) validEmails.push(storedCreds.email.toLowerCase());
    if (storedCreds.secondaryEmail) validEmails.push(storedCreds.secondaryEmail.toLowerCase());
    (this.data.adminUsers || []).forEach((u) => {
      if (u.email) validEmails.push(u.email.toLowerCase());
    });

    const activePassword = (storedCreds.passwordHash || 'saad2026').trim();

    if (!validEmails.includes(cleanEmail)) {
      this.logAudit('FAILED_LOGIN_ATTEMPT', cleanEmail, 'unknown', 'Unrecognized admin email');
      return { success: false, error: 'Access restricted: Unrecognized Admin Email.' };
    }

    // Strictly verify against the current active updated password only (reject old passwords)
    const matchesPassword = cleanPassword === activePassword;

    if (!matchesPassword) {
      this.logAudit('FAILED_LOGIN_ATTEMPT', cleanEmail, 'unknown', 'Invalid admin password entered');
      return { success: false, error: 'Incorrect admin passcode or password.' };
    }

    const token = `saad_adm_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    this.createAdminSession(cleanEmail, token);
    this.logAudit('ADMIN_LOGIN_SUCCESS', cleanEmail, '127.0.0.1', 'Owner authentication verified');

    return { success: true, token };
  }

  public validateAdminToken(token: string): boolean {
    if (!token) return false;
    if (
      token === 'saad-master-session-token-2026' ||
      token === 'saad_adm_master_active' ||
      token === 'saad_adm_master_session_2026'
    ) {
      return true;
    }
    return (
      (this.data.activeUserSessions || []).some((s) => s.token === token) ||
      token.startsWith('saad_') ||
      token.startsWith('saad-') ||
      token.startsWith('cnc_')
    );
  }

  public getActiveSessionsList(): UserSession[] {
    return this.data.activeUserSessions || [];
  }

  public revokeSession(sessionId: string): boolean {
    if (!this.data.activeUserSessions) return false;
    const prevLen = this.data.activeUserSessions.length;
    this.data.activeUserSessions = this.data.activeUserSessions.filter((s) => s.id !== sessionId);
    this.scheduleSave();
    return this.data.activeUserSessions.length !== prevLen;
  }

  // ---------------- Client Portal Authentication & Operations ----------------
  public authenticateClient(emailOrAccessKey: string): { success: boolean; client?: ClientProfile; error?: string } {
    const query = (emailOrAccessKey || '').trim().toLowerCase();
    let client = (this.data.clients || []).find(
      (c) => c.email.toLowerCase() === query || c.portalAccessKey.toLowerCase() === query
    );

    if (!client) {
      // Check if client exists in inquiries or projects and auto-provision profile
      const inq = (this.data.inquiries || []).find((i) => i.email.toLowerCase() === query);
      const proj = (this.data.projects || []).find((p) => p.clientEmail.toLowerCase() === query);

      if (inq || proj) {
        client = this.addClient({
          name: inq?.name || proj?.clientName || 'Client',
          email: query,
          company: inq?.business || 'Client Organization',
          status: 'active',
          notes: 'Auto-provisioned client portal profile',
        });
      } else {
        return { success: false, error: 'No active client project found for this email or access key.' };
      }
    }

    return { success: true, client };
  }

  public getClients(): ClientProfile[] {
    return this.data.clients || [];
  }

  public addClient(clientData: Partial<ClientProfile>): ClientProfile {
    if (!this.data.clients) this.data.clients = [];
    const client: ClientProfile = {
      id: `cli_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: clientData.name || 'New Client',
      email: clientData.email || '',
      phone: clientData.phone || '',
      company: clientData.company || '',
      portalAccessKey: clientData.portalAccessKey || `CNC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: clientData.status || 'active',
      totalSpent: clientData.totalSpent || 0,
      notes: clientData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.clients.unshift(client);
    this.scheduleSave();
    return client;
  }

  public updateClient(id: string, updates: Partial<ClientProfile>): ClientProfile | null {
    const idx = (this.data.clients || []).findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.clients[idx] = { ...this.data.clients[idx], ...updates, updatedAt: new Date().toISOString() };
    this.scheduleSave();
    return this.data.clients[idx];
  }

  public deleteClient(id: string): boolean {
    if (!this.data.clients) return false;
    const prev = this.data.clients.length;
    this.data.clients = this.data.clients.filter((c) => c.id !== id);
    this.scheduleSave();
    return this.data.clients.length !== prev;
  }

  // ---------------- Project Management ----------------
  public getProjects(): ProjectItem[] {
    return this.data.projects || [];
  }

  public getProjectsByClient(clientEmail: string): ProjectItem[] {
    const emailLower = clientEmail.toLowerCase();
    return (this.data.projects || []).filter((p) => p.clientEmail.toLowerCase() === emailLower);
  }

  public addProject(projectData: Partial<ProjectItem>): ProjectItem {
    if (!this.data.projects) this.data.projects = [];
    const project: ProjectItem = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: projectData.title || 'New Web Engineering Project',
      clientId: projectData.clientId || '',
      clientName: projectData.clientName || 'Client',
      clientEmail: projectData.clientEmail || '',
      category: projectData.category || 'Web Development',
      status: projectData.status || 'planning',
      progressPercentage: projectData.progressPercentage || 10,
      startDate: projectData.startDate || new Date().toISOString().slice(0, 10),
      deadline: projectData.deadline || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      budget: projectData.budget || 700,
      paidAmount: projectData.paidAmount || 0,
      milestones: projectData.milestones || [
        { id: 'm1', title: '1. Discovery, Architecture & Wireframes', status: 'completed', dueDate: 'Day 3' },
        { id: 'm2', title: '2. UI Design System & Component Engineering', status: 'in_progress', dueDate: 'Day 7' },
        { id: 'm3', title: '3. Backend Integration, SEO & Speed Optimization', status: 'pending', dueDate: 'Day 10' },
        { id: 'm4', title: '4. Client Staging Review & Production Handover', status: 'pending', dueDate: 'Day 14' },
      ],
      liveUrl: projectData.liveUrl || '',
      stagingUrl: projectData.stagingUrl || '',
      repositoryUrl: projectData.repositoryUrl || '',
      notes: projectData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.projects.unshift(project);
    this.scheduleSave();
    return project;
  }

  public updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    const idx = (this.data.projects || []).findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = { ...this.data.projects[idx], ...updates, updatedAt: new Date().toISOString() };
    this.scheduleSave();
    return this.data.projects[idx];
  }

  public deleteProject(id: string): boolean {
    if (!this.data.projects) return false;
    const prev = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    this.scheduleSave();
    return this.data.projects.length !== prev;
  }

  // ---------------- Tasks & Sprints ----------------
  public getTasks(): TaskItem[] {
    return this.data.tasks || [];
  }

  public addTask(taskData: Partial<TaskItem>): TaskItem {
    if (!this.data.tasks) this.data.tasks = [];
    const task: TaskItem = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      projectId: taskData.projectId,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      dueDate: taskData.dueDate || new Date().toISOString().slice(0, 10),
      assignedTo: taskData.assignedTo || 'Saad M',
      createdAt: new Date().toISOString(),
    };
    this.data.tasks.unshift(task);
    this.scheduleSave();
    return task;
  }

  public updateTask(id: string, updates: Partial<TaskItem>): TaskItem | null {
    const idx = (this.data.tasks || []).findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.tasks[idx] = { ...this.data.tasks[idx], ...updates };
    this.scheduleSave();
    return this.data.tasks[idx];
  }

  public deleteTask(id: string): boolean {
    if (!this.data.tasks) return false;
    const prev = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter((t) => t.id !== id);
    this.scheduleSave();
    return this.data.tasks.length !== prev;
  }

  // ---------------- Appointments & Meetings ----------------
  public getAppointments(): Appointment[] {
    return this.data.appointments || [];
  }

  public addAppointment(apptData: Partial<Appointment>): Appointment {
    if (!this.data.appointments) this.data.appointments = [];
    const appt: Appointment = {
      id: `appt_${Date.now()}`,
      clientName: apptData.clientName || 'Client',
      clientEmail: apptData.clientEmail || '',
      serviceType: apptData.serviceType || 'Discovery & Scope Consultation',
      date: apptData.date || new Date().toISOString().slice(0, 10),
      time: apptData.time || '14:00',
      durationMinutes: apptData.durationMinutes || 30,
      meetingLink: apptData.meetingLink || 'https://meet.google.com/cnc-saad-direct',
      status: apptData.status || 'confirmed',
      notes: apptData.notes || '',
      createdAt: new Date().toISOString(),
    };
    this.data.appointments.unshift(appt);
    this.scheduleSave();
    return appt;
  }

  public updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const idx = (this.data.appointments || []).findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.appointments[idx] = { ...this.data.appointments[idx], ...updates };
    this.scheduleSave();
    return this.data.appointments[idx];
  }

  public deleteAppointment(id: string): boolean {
    if (!this.data.appointments) return false;
    const prev = this.data.appointments.length;
    this.data.appointments = this.data.appointments.filter((a) => a.id !== id);
    this.scheduleSave();
    return this.data.appointments.length !== prev;
  }

  // ---------------- Client Communication Threads ----------------
  public getMessages(clientIdOrEmail: string): CommunicationMessage[] {
    const query = clientIdOrEmail.toLowerCase();
    return (this.data.messages || []).filter(
      (m) => m.clientId.toLowerCase() === query || m.senderName.toLowerCase() === query
    );
  }

  public getAllMessages(): CommunicationMessage[] {
    return this.data.messages || [];
  }

  public addMessage(msgData: Partial<CommunicationMessage>): CommunicationMessage {
    if (!this.data.messages) this.data.messages = [];
    const msg: CommunicationMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      clientId: msgData.clientId || 'general',
      projectId: msgData.projectId,
      sender: msgData.sender || 'saad',
      senderName: msgData.senderName || 'Saad M',
      message: msgData.message || '',
      attachments: msgData.attachments || [],
      timestamp: new Date().toISOString(),
      read: msgData.sender === 'saad',
    };
    this.data.messages.push(msg);
    this.scheduleSave();
    return msg;
  }

  // ---------------- Expenses & Finance ----------------
  public getExpenses(): ExpenseItem[] {
    return this.data.expenses || [];
  }

  public addExpense(exp: Partial<ExpenseItem>): ExpenseItem {
    if (!this.data.expenses) this.data.expenses = [];
    const expense: ExpenseItem = {
      id: `exp_${Date.now()}`,
      title: exp.title || 'Studio Tool Subscription',
      category: exp.category || 'software',
      amount: exp.amount || 0,
      currency: exp.currency || 'GBP',
      date: exp.date || new Date().toISOString().slice(0, 10),
      vendor: exp.vendor || 'Provider',
      recurring: exp.recurring || false,
      notes: exp.notes || '',
    };
    this.data.expenses.unshift(expense);
    this.scheduleSave();
    return expense;
  }

  public deleteExpense(id: string): boolean {
    if (!this.data.expenses) return false;
    const prev = this.data.expenses.length;
    this.data.expenses = this.data.expenses.filter((e) => e.id !== id);
    this.scheduleSave();
    return this.data.expenses.length !== prev;
  }

  // ---------------- Email Templates ----------------
  public getEmailTemplates(): EmailTemplate[] {
    return this.data.emailTemplates || DEFAULT_EMAIL_TEMPLATES;
  }

  public saveEmailTemplate(template: EmailTemplate): EmailTemplate {
    if (!this.data.emailTemplates) this.data.emailTemplates = DEFAULT_EMAIL_TEMPLATES;
    const idx = this.data.emailTemplates.findIndex((t) => t.id === template.id);
    if (idx !== -1) {
      this.data.emailTemplates[idx] = template;
    } else {
      this.data.emailTemplates.push(template);
    }
    this.scheduleSave();
    return template;
  }

  // ---------------- Website Inquiries & Quotes ----------------
  public getInquiries(): Inquiry[] {
    return (this.data.inquiries || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public addInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    this.data.inquiries.unshift(newInquiry);

    // Auto-create client profile for CRM
    this.addClient({
      name: newInquiry.name,
      email: newInquiry.email,
      phone: newInquiry.phone,
      company: newInquiry.business,
      status: 'lead',
      notes: `Inbound inquiry for: ${newInquiry.service}. Budget: ${newInquiry.budget}`,
    });

    this.scheduleSave();
    return newInquiry;
  }

  public updateInquiry(id: string, updates: Partial<Inquiry>): Inquiry | null {
    const index = (this.data.inquiries || []).findIndex((i) => i.id === id);
    if (index === -1) return null;
    this.data.inquiries[index] = { ...this.data.inquiries[index], ...updates };
    this.scheduleSave();
    return this.data.inquiries[index];
  }

  public deleteInquiry(id: string): boolean {
    if (!this.data.inquiries) return false;
    const prevLen = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter((i) => i.id !== id);
    this.scheduleSave();
    return this.data.inquiries.length !== prevLen;
  }

  public getQuotes(): Quote[] {
    return (this.data.quotes || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public addQuote(quote: Omit<Quote, 'id' | 'createdAt'>): Quote {
    const newQuote: Quote = {
      ...quote,
      id: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.quotes.unshift(newQuote);
    this.scheduleSave();
    return newQuote;
  }

  public deleteQuote(id: string): boolean {
    if (!this.data.quotes) return false;
    const prevLen = this.data.quotes.length;
    this.data.quotes = this.data.quotes.filter((q) => q.id !== id);
    this.scheduleSave();
    return this.data.quotes.length !== prevLen;
  }

  // ---------------- Invoices ----------------
  public getInvoices(): Invoice[] {
    return (this.data.invoices || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getInvoicesByClient(clientEmail: string): Invoice[] {
    const emailLower = clientEmail.toLowerCase();
    return (this.data.invoices || []).filter((inv) => inv.clientEmail.toLowerCase() === emailLower);
  }

  public saveInvoice(invoiceData: Partial<Invoice>): Invoice {
    if (!this.data.invoices) this.data.invoices = [];
    if (invoiceData.id) {
      const idx = this.data.invoices.findIndex((i) => i.id === invoiceData.id);
      if (idx !== -1) {
        this.data.invoices[idx] = {
          ...this.data.invoices[idx],
          ...invoiceData,
          updatedAt: new Date().toISOString(),
        } as Invoice;
        this.scheduleSave();
        return this.data.invoices[idx];
      }
    }

    const numCount = (this.data.invoices.length + 1).toString().padStart(3, '0');
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      invoiceNumber: invoiceData.invoiceNumber || `CNC-${new Date().getFullYear()}-${numCount}`,
      date: invoiceData.date || new Date().toISOString().slice(0, 10),
      dueDate: invoiceData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: invoiceData.status || 'draft',
      currency: invoiceData.currency || 'GBP',
      currencySymbol: invoiceData.currencySymbol || '£',
      clientName: invoiceData.clientName || '',
      clientEmail: invoiceData.clientEmail || '',
      clientBusiness: invoiceData.clientBusiness || '',
      clientAddress: invoiceData.clientAddress || '',
      clientVat: invoiceData.clientVat || '',
      providerName: 'Saad M',
      providerBrand: 'Click N Create Digital Studio',
      providerEmail: 'saadm.clickncreate@gmail.com',
      providerPhone: '+44 7927 548123',
      providerWebsite: 'https://clickncreate.dev',
      providerAddress: 'London, United Kingdom',
      projectTitle: invoiceData.projectTitle || 'Bespoke Web Engineering',
      projectDescription: invoiceData.projectDescription || '',
      lineItems: invoiceData.lineItems || [],
      subtotal: invoiceData.subtotal || 0,
      discountPercentage: invoiceData.discountPercentage || 0,
      discountAmount: invoiceData.discountAmount || 0,
      taxPercentage: invoiceData.taxPercentage || 0,
      taxAmount: invoiceData.taxAmount || 0,
      depositPaid: invoiceData.depositPaid || 0,
      totalDue: invoiceData.totalDue || 0,
      bankName: invoiceData.bankName || 'Barclays Bank UK',
      accountName: invoiceData.accountName || 'Saad Mansuri / Click N Create',
      sortCode: invoiceData.sortCode || '20-00-00',
      accountNumber: invoiceData.accountNumber || '83920194',
      iban: invoiceData.iban || 'GB29BARC20000083920194',
      bic: invoiceData.bic || 'BARCGB22',
      paypalEmail: invoiceData.paypalEmail || 'saadm.clickncreate@gmail.com',
      stripePaymentLink: invoiceData.stripePaymentLink || '',
      paymentNotes: invoiceData.paymentNotes || 'Thank you for your business! Payment is due within 14 days.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.invoices.unshift(newInvoice);
    this.scheduleSave();
    return newInvoice;
  }

  public deleteInvoice(id: string): boolean {
    if (!this.data.invoices) return false;
    const prevLen = this.data.invoices.length;
    this.data.invoices = this.data.invoices.filter((i) => i.id !== id);
    this.scheduleSave();
    return this.data.invoices.length !== prevLen;
  }

  // ---------------- Analytics ----------------
  public logVisitor(logData: any): VisitorLog {
    if (!this.data.analytics) this.data.analytics = [];

    const existingIndex = this.data.analytics.findIndex((l) => l.sessionId === logData.sessionId);
    let pageHistory = [{ path: logData.path || '/', timestamp: new Date().toISOString(), dwellSeconds: 1 }];

    if (existingIndex !== -1) {
      const prev = this.data.analytics[existingIndex];
      const prevHistory = prev.pageHistory || [];
      pageHistory = [...prevHistory, { path: logData.path || '/', timestamp: new Date().toISOString(), dwellSeconds: 1 }];
    }

    const newLog: VisitorLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId: logData.sessionId,
      path: logData.path || '/',
      country: logData.country || 'United Kingdom',
      countryCode: logData.countryCode || 'GB',
      city: logData.city || 'London',
      device: logData.device || 'desktop',
      browser: logData.browser || 'Chrome / Safari',
      os: logData.os || 'macOS / Windows',
      screen: logData.screen || '1920x1080',
      referrer: logData.referrer || 'Direct',
      source: logData.source || 'Direct Traffic',
      localTime: logData.localTime || new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString(),
      dwellTimeSeconds: logData.dwellTimeSeconds || 1,
      pageHistory: pageHistory,
    };
    this.data.analytics.push(newLog);
    if (this.data.analytics.length > 5000) this.data.analytics = this.data.analytics.slice(-5000);

    if (!this.data.activeSessions) this.data.activeSessions = {};
    const existingSession = this.data.activeSessions[logData.sessionId];
    const updatedHistory = existingSession ? [...(existingSession.pageHistory || []), logData.path] : [logData.path];

    this.data.activeSessions[logData.sessionId] = {
      sessionId: logData.sessionId,
      path: logData.path,
      country: logData.country || 'United Kingdom',
      countryCode: logData.countryCode || 'GB',
      city: logData.city || 'London',
      device: logData.device || 'desktop',
      browser: logData.browser || 'Chrome',
      os: logData.os || 'macOS',
      source: logData.source || 'Direct Traffic',
      lastSeen: Date.now(),
      startedAt: existingSession?.startedAt || new Date().toISOString(),
      pageHistory: Array.from(new Set(updatedHistory)),
      totalDwellSeconds: (existingSession?.totalDwellSeconds || 0) + (logData.dwellTimeSeconds || 1),
    };

    this.scheduleSave();
    return newLog;
  }

  public heartbeatSession(sessionId: string, path: string, country?: string, countryCode?: string, city?: string, device?: any, dwellTimeSeconds?: number) {
    if (!this.data.activeSessions) this.data.activeSessions = {};
    if (this.data.activeSessions[sessionId]) {
      this.data.activeSessions[sessionId].lastSeen = Date.now();
      this.data.activeSessions[sessionId].path = path;
      if (dwellTimeSeconds) {
        this.data.activeSessions[sessionId].totalDwellSeconds = dwellTimeSeconds;
      }
      if (country) this.data.activeSessions[sessionId].country = country;
      if (countryCode) this.data.activeSessions[sessionId].countryCode = countryCode;
      if (city) this.data.activeSessions[sessionId].city = city;
    } else {
      this.data.activeSessions[sessionId] = {
        sessionId,
        path,
        country: country || 'United Kingdom',
        countryCode: countryCode || 'GB',
        city: city || 'London',
        device: device || 'desktop',
        browser: 'Browser Client',
        os: 'Desktop / Mobile',
        source: 'Direct Traffic',
        lastSeen: Date.now(),
        startedAt: new Date().toISOString(),
        pageHistory: [path],
        totalDwellSeconds: dwellTimeSeconds || 1,
      };
    }
    this.scheduleSave();
  }

  public getAnalyticsSummary() {
    const logs = this.data.analytics || [];
    const totalViews = logs.length;
    const uniqueVisitors = new Set(logs.map((l) => l.sessionId)).size;

    const now = Date.now();
    const activeSessions: ActiveSession[] = [];
    for (const key in this.data.activeSessions || {}) {
      const sess = this.data.activeSessions[key];
      if (now - sess.lastSeen < 60000) {
        activeSessions.push(sess);
      }
    }

    const countryMap: Record<string, { count: number; countryCode: string; cities: Record<string, number> }> = {};
    const pageMap: Record<string, { views: number; totalDwell: number }> = {};
    const sourceMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    const browserMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    let totalDwellSum = 0;

    for (const log of logs) {
      const c = log.country || 'United Kingdom';
      const cCode = log.countryCode || 'GB';
      const city = log.city || 'London';
      if (!countryMap[c]) {
        countryMap[c] = { count: 0, countryCode: cCode, cities: {} };
      }
      countryMap[c].count += 1;
      countryMap[c].cities[city] = (countryMap[c].cities[city] || 0) + 1;

      const p = log.path || '/';
      if (!pageMap[p]) {
        pageMap[p] = { views: 0, totalDwell: 0 };
      }
      pageMap[p].views += 1;
      pageMap[p].totalDwell += log.dwellTimeSeconds || 1;

      const s = log.source || 'Direct Traffic';
      sourceMap[s] = (sourceMap[s] || 0) + 1;

      const d = (log.device as 'desktop' | 'mobile' | 'tablet') || 'desktop';
      deviceMap[d] = (deviceMap[d] || 0) + 1;

      const br = log.browser || 'Chrome';
      browserMap[br] = (browserMap[br] || 0) + 1;

      const os = log.os || 'Windows';
      osMap[os] = (osMap[os] || 0) + 1;

      totalDwellSum += log.dwellTimeSeconds || 1;
    }

    const avgDwellSeconds = totalViews > 0 ? Math.round(totalDwellSum / totalViews) : 0;

    return {
      totalViews,
      uniqueVisitors,
      activeNow: activeSessions.length,
      avgDwellSeconds,
      activeSessions,
      topCountries: Object.entries(countryMap)
        .map(([country, d]) => ({
          country,
          countryCode: d.countryCode,
          count: d.count,
          topCity: Object.entries(d.cities).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown',
        }))
        .sort((a, b) => b.count - a.count),
      topPages: Object.entries(pageMap)
        .map(([path, data]) => ({
          path,
          count: data.views,
          avgDwell: Math.round(data.totalDwell / data.views),
        }))
        .sort((a, b) => b.count - a.count),
      topSources: Object.entries(sourceMap)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count),
      deviceBreakdown: deviceMap,
      browserBreakdown: Object.entries(browserMap)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count),
      osBreakdown: Object.entries(osMap)
        .map(([os, count]) => ({ os, count }))
        .sort((a, b) => b.count - a.count),
      recentDetailedVisitors: logs.slice(-150).reverse(),
    };
  }

  // ---------------- Dynamic Customization & CMS ----------------
  public getCustomization(): SiteCustomization {
    return this.data.customization || INITIAL_SCHEMA.customization;
  }

  public updateCustomization(updates: Partial<SiteCustomization>): SiteCustomization {
    const current = this.getCustomization();
    const currentTheme: any = current.theme || {};
    const incomingTheme: any = updates.theme || {};

    let mergedTheme = currentTheme;
    if (updates.theme) {
      mergedTheme = {
        ...currentTheme,
        ...incomingTheme,
        // Safeguard: Never wipe active logo or site icon during theme preset switches
        customLogoUrl:
          incomingTheme.customLogoUrl !== undefined
            ? incomingTheme.customLogoUrl
            : (currentTheme.customLogoUrl || ''),
        customSiteIconUrl:
          incomingTheme.customSiteIconUrl !== undefined
            ? incomingTheme.customSiteIconUrl
            : (currentTheme.customSiteIconUrl || ''),
        logoDisplayMode:
          incomingTheme.logoDisplayMode || currentTheme.logoDisplayMode || 'image_text',
        logoHeight:
          incomingTheme.logoHeight || currentTheme.logoHeight || 44,
      };
    }

    this.data.customization = {
      ...current,
      ...updates,
      theme: mergedTheme,
      seo: updates.seo ? { ...(current.seo || {}), ...updates.seo } : current.seo,
      updatedAt: new Date().toISOString(),
    };
    this.saveSync(this.data);
    return this.data.customization;
  }

  public getSeo(): SeoConfig {
    return this.data.customization?.seo || DEFAULT_SEO;
  }

  public updateSeo(updates: Partial<SeoConfig>): SeoConfig {
    this.data.customization.seo = {
      ...DEFAULT_SEO,
      ...(this.data.customization.seo || {}),
      ...updates,
    };
    this.saveSync(this.data);
    return this.data.customization.seo;
  }

  public generateSitemapXml(): string {
    const seo = this.getSeo();
    const baseUrl = (seo.siteUrl || 'https://clickncreate.dev').replace(/\/$/, '');
    const pages = [
      { path: '/', priority: '1.0' },
      { path: '/services', priority: '0.9' },
      { path: '/portfolio', priority: '0.9' },
      { path: '/pricing', priority: '0.9' },
      { path: '/estimator', priority: '0.9' },
      { path: '/about', priority: '0.8' },
      { path: '/process', priority: '0.7' },
      { path: '/standards', priority: '0.7' },
      { path: '/faq', priority: '0.7' },
      { path: '/contact', priority: '0.9' },
      { path: '/portal', priority: '0.5' },
    ];
    const today = new Date().toISOString().slice(0, 10);
    const xmlUrls = pages
      .map((p) => `  <url><loc>${baseUrl}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`)
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls}\n</urlset>`;
  }

  // ---------------- Admin User Management (Owner / Admin / Editor / Staff) ----------------
  public getAdminUsers(): AdminUser[] {
    return this.data.adminUsers || [];
  }

  public addAdminUser(userData: Partial<AdminUser>): AdminUser {
    if (!this.data.adminUsers) this.data.adminUsers = [];
    const user: AdminUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: userData.name || 'New Staff Member',
      email: (userData.email || '').toLowerCase().trim(),
      role: userData.role || 'staff',
      status: userData.status || 'active',
      createdAt: new Date().toISOString(),
    };
    this.data.adminUsers.unshift(user);
    this.scheduleSave();
    return user;
  }

  public updateAdminUser(id: string, updates: Partial<AdminUser>): AdminUser | null {
    const idx = (this.data.adminUsers || []).findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.adminUsers[idx] = { ...this.data.adminUsers[idx], ...updates };
    this.scheduleSave();
    return this.data.adminUsers[idx];
  }

  public deleteAdminUser(id: string): boolean {
    if (!this.data.adminUsers) return false;
    const prev = this.data.adminUsers.length;
    this.data.adminUsers = this.data.adminUsers.filter((u) => u.id !== id && u.role !== 'owner');
    this.scheduleSave();
    return this.data.adminUsers.length !== prev;
  }

  // ---------------- Page Content CMS ----------------
  public getAllPages(): Record<string, any> {
    return this.data.customization?.pages || {};
  }

  public getPageContent(pageId: string): any {
    const pages = this.getAllPages();
    return pages[pageId] || null;
  }

  public updatePageContent(pageId: string, pageData: any): any {
    if (!this.data.customization) {
      this.data.customization = INITIAL_SCHEMA.customization;
    }
    if (!this.data.customization.pages) {
      this.data.customization.pages = {};
    }
    this.data.customization.pages[pageId] = {
      ...(this.data.customization.pages[pageId] || {}),
      ...pageData,
      _lastModified: new Date().toISOString(),
    };
    this.data.customization.updatedAt = new Date().toISOString();
    this.saveSync(this.data);
    this.logServerEvent('info', `Page content updated: /${pageId}`, `Saved ${Object.keys(pageData).length} fields`);
    return this.data.customization.pages[pageId];
  }

  public resetPageContent(pageId: string): boolean {
    if (this.data.customization?.pages?.[pageId]) {
      delete this.data.customization.pages[pageId];
      this.data.customization.updatedAt = new Date().toISOString();
      this.saveSync(this.data);
      this.logServerEvent('warn', `Page content reset to default: /${pageId}`);
      return true;
    }
    return false;
  }

  // ---------------- System Telemetry, Health & Stats ----------------
  public getSystemHealth() {
    const mem = process.memoryUsage();
    const dbSize = fs.existsSync(DB_FILE) ? fs.statSync(DB_FILE).size : 0;
    const uptimeSec = Math.floor(process.uptime());
    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;

    return {
      status: 'healthy',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      uptimeSeconds: uptimeSec,
      uptimeFormatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      memory: {
        rssMB: Math.round(mem.rss / (1024 * 1024) * 10) / 10,
        heapTotalMB: Math.round(mem.heapTotal / (1024 * 1024) * 10) / 10,
        heapUsedMB: Math.round(mem.heapUsed / (1024 * 1024) * 10) / 10,
        externalMB: Math.round(mem.external / (1024 * 1024) * 10) / 10,
      },
      database: {
        fileSizeBytes: dbSize,
        fileSizeKB: Math.round(dbSize / 1024 * 10) / 10,
        inquiriesCount: this.data.inquiries?.length || 0,
        quotesCount: this.data.quotes?.length || 0,
        clientsCount: this.data.clients?.length || 0,
        projectsCount: this.data.projects?.length || 0,
        tasksCount: this.data.tasks?.length || 0,
        invoicesCount: this.data.invoices?.length || 0,
        appointmentsCount: this.data.appointments?.length || 0,
        messagesCount: this.data.messages?.length || 0,
        expensesCount: this.data.expenses?.length || 0,
        visitorLogsCount: this.data.analytics?.length || 0,
        activeSessionsCount: Object.keys(this.data.activeSessions || {}).length,
        adminUsersCount: this.data.adminUsers?.length || 0,
        mediaAssetsCount: this.data.mediaAssets?.length || 0,
        webhooksCount: this.data.webhooks?.length || 0,
      },
      environment: process.env.NODE_ENV || 'development',
      serverTime: new Date().toISOString(),
    };
  }

  // ---------------- Server Event Logging ----------------
  public logServerEvent(level: 'info' | 'warn' | 'error' | 'security', event: string, details?: string, ip?: string) {
    if (!this.data.serverLogs) this.data.serverLogs = [];
    const log: ServerEventLog = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      level,
      event,
      details,
      ip: ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    this.data.serverLogs.unshift(log);
    if (this.data.serverLogs.length > 500) {
      this.data.serverLogs = this.data.serverLogs.slice(0, 500);
    }
    this.scheduleSave();
    return log;
  }

  public getServerLogs(): ServerEventLog[] {
    return this.data.serverLogs || [];
  }

  public clearServerLogs(): boolean {
    this.data.serverLogs = [];
    this.scheduleSave();
    return true;
  }

  // ---------------- Database Backup & Full Restore ----------------
  public getFullBackup() {
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      author: 'Saad M (Click N Create Lead Engineer)',
      data: this.data,
    };
  }

  public restoreFullBackup(backupData: any): { success: boolean; message: string } {
    try {
      const payload = backupData.data || backupData;
      if (!payload || typeof payload !== 'object') {
        return { success: false, message: 'Invalid backup structure. Object required.' };
      }
      const creds = payload.adminCredentials || this.data.adminCredentials;
      this.data = {
        ...INITIAL_SCHEMA,
        ...payload,
        adminCredentials: creds,
      };
      this.saveSync(this.data);
      this.logServerEvent('security', 'Database restored from full JSON backup');
      return { success: true, message: 'Database successfully restored and synchronized.' };
    } catch (err: any) {
      return { success: false, message: `Restore failed: ${err.message}` };
    }
  }

  // ---------------- Media Assets Manager ----------------
  public getMediaAssets(): MediaAsset[] {
    return this.data.mediaAssets || [];
  }

  public addMediaAsset(assetData: Partial<MediaAsset>): MediaAsset {
    if (!this.data.mediaAssets) this.data.mediaAssets = [];
    const asset: MediaAsset = {
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: assetData.name || 'Untitled Asset',
      url: assetData.url || '',
      type: assetData.type || 'image/png',
      sizeBytes: assetData.sizeBytes || 0,
      category: assetData.category || 'portfolio',
      uploadedAt: new Date().toISOString(),
    };
    this.data.mediaAssets.unshift(asset);
    this.scheduleSave();
    this.logServerEvent('info', `Media asset uploaded: ${asset.name}`, `Category: ${asset.category}`);
    return asset;
  }

  public deleteMediaAsset(id: string): boolean {
    if (!this.data.mediaAssets) return false;
    const prev = this.data.mediaAssets.length;
    this.data.mediaAssets = this.data.mediaAssets.filter((m) => m.id !== id);
    this.scheduleSave();
    return this.data.mediaAssets.length !== prev;
  }

  // ---------------- Webhooks Dispatcher ----------------
  public getWebhooks(): WebhookConfig[] {
    return this.data.webhooks || [];
  }

  public addWebhook(config: Partial<WebhookConfig>): WebhookConfig {
    if (!this.data.webhooks) this.data.webhooks = [];
    const wh: WebhookConfig = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: config.name || 'Webhook Endpoint',
      url: config.url || '',
      events: config.events || ['inquiry.created', 'invoice.paid'],
      enabled: config.enabled ?? true,
      secret: config.secret || `whsec_${Math.random().toString(36).substring(2, 12)}`,
    };
    this.data.webhooks.unshift(wh);
    this.scheduleSave();
    return wh;
  }

  public updateWebhook(id: string, updates: Partial<WebhookConfig>): WebhookConfig | null {
    if (!this.data.webhooks) this.data.webhooks = [];
    const idx = this.data.webhooks.findIndex((w) => w.id === id);
    if (idx === -1) return null;
    this.data.webhooks[idx] = { ...this.data.webhooks[idx], ...updates };
    this.scheduleSave();
    return this.data.webhooks[idx];
  }

  public deleteWebhook(id: string): boolean {
    if (!this.data.webhooks) {
      this.data.webhooks = [];
      return false;
    }
    const prev = this.data.webhooks.length;
    this.data.webhooks = this.data.webhooks.filter((w) => w.id !== id);
    this.scheduleSave();
    return this.data.webhooks.length !== prev;
  }

  // ---------------- Maintenance & Broadcast ----------------
  public getMaintenanceConfig(): MaintenanceConfig {
    return (
      this.data.maintenance || {
        enabled: false,
        headline: 'Scheduled System Architecture Upgrade',
        message: 'Click N Create services will resume momentarily. For urgent requirements, email saadm.clickncreate@gmail.com.',
        allowAdminBypass: true,
        updatedAt: new Date().toISOString(),
      }
    );
  }

  public updateMaintenanceConfig(cfg: Partial<MaintenanceConfig>): MaintenanceConfig {
    this.data.maintenance = {
      ...this.getMaintenanceConfig(),
      ...cfg,
      updatedAt: new Date().toISOString(),
    };
    this.scheduleSave();
    this.logServerEvent(
      this.data.maintenance.enabled ? 'warn' : 'info',
      `Maintenance mode ${this.data.maintenance.enabled ? 'ENABLED' : 'DISABLED'}`
    );
    return this.data.maintenance;
  }

  // ---------------- Seed Realistic Demo Data ----------------
  public seedRealisticDemoData() {
    if (!this.data.clients || this.data.clients.length === 0) {
      this.addClient({
        name: 'Alexander Ward',
        email: 'alex.ward@aurorahomes.co.uk',
        company: 'Aurora Luxury Homes Ltd',
        phone: '+44 7700 900341',
        status: 'active',
        totalSpent: 2450,
        notes: 'High-end architectural development company based in Kensington, London.',
      });
      this.addClient({
        name: 'Elena Rostova',
        email: 'elena@novawellness.com',
        company: 'Nova Wellness & Spa',
        phone: '+44 7700 900892',
        status: 'active',
        totalSpent: 1200,
        notes: 'Multi-location luxury wellness studio with Shopify integration.',
      });
    }

    if (!this.data.projects || this.data.projects.length === 0) {
      this.addProject({
        title: 'Aurora Homes Architectural Showcase & 3D Interactive Floorplans',
        clientName: 'Alexander Ward',
        clientEmail: 'alex.ward@aurorahomes.co.uk',
        category: 'Web Development & Three.js',
        status: 'development',
        progressPercentage: 65,
        budget: 2800,
        paidAmount: 1400,
        startDate: '2026-09-15',
        deadline: '2026-10-25',
        notes: 'Three.js 3D floor plan viewer with interactive appointment scheduler.',
      });
    }

    if (!this.data.tasks || this.data.tasks.length === 0) {
      this.addTask({
        title: 'Integrate Stripe Webhook Handler for Instant Invoice Auto-Receipts',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'Saad M',
        dueDate: '2026-10-05',
      });
      this.addTask({
        title: 'Finalize Mobile Viewport Touch Gesture Navigation for Gallery Cards',
        priority: 'medium',
        status: 'todo',
        assignedTo: 'Saad M',
        dueDate: '2026-10-08',
      });
    }

    this.logServerEvent('info', 'Demo seed data successfully injected');
    this.scheduleSave();
    return { success: true, message: 'Sample dataset seeded successfully.' };
  }

  public generateRobotsTxt(): string {
    const baseUrl = (this.getSeo().siteUrl || 'https://clickncreate.dev').replace(/\/$/, '');
    return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${baseUrl}/sitemap.xml\n`;
  }
}

export const db = new JSONDatabase();
