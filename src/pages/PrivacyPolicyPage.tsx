import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  FileCheck,
  Server,
  Cookie,
  UserCheck,
  HelpCircle,
  Mail,
  ChevronDown,
  Scale,
  Clock,
  Globe,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { SEOHead } from '../components/SEOHead.tsx';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState<string>('intro');

  const sections = [
    { id: 'controller', title: '1. Data Controller & Scope', icon: Shield },
    { id: 'lawful-basis', title: '2. Lawful Basis for Processing', icon: Scale },
    { id: 'data-collected', title: '3. What Information We Collect', icon: Eye },
    { id: 'data-use', title: '4. How Your Data Is Utilized', icon: FileCheck },
    { id: 'third-parties', title: '5. Third-Party Processors & Infrastructure', icon: Server },
    { id: 'cookies', title: '6. Cookies & Local Browser Storage', icon: Cookie },
    { id: 'retention', title: '7. Retention Schedules', icon: Clock },
    { id: 'your-rights', title: '8. Your Statutory Rights (GDPR / DPA)', icon: UserCheck },
    { id: 'security', title: '9. Security & Cryptographic Safeguards', icon: Lock },
    { id: 'contact', title: '10. Inquiries & Supervisory Authority', icon: Mail },
  ];

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-hidden w-full max-w-full">
      <SEOHead
        title="Privacy Policy | Click N Create (Saad M)"
        description="Review Click N Create's UK GDPR and Data Protection Act 2018 compliance, data processing standards, and privacy safeguards."
        canonicalPath="/privacy-policy"
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#00F0FF] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>UK GDPR & DPA 2018 Compliant</span>
          </div>
        </div>

        {/* Hero Header Card */}
        <div
          className={`rounded-3xl border p-8 sm:p-10 mb-8 backdrop-blur-2xl relative overflow-hidden ${
            isDark
              ? 'border-[#00F0FF]/30 bg-[#060612]/90 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
              : 'border-zinc-200 bg-white shadow-xl'
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-wider mb-3 font-semibold">
            <Shield className="w-4 h-4" />
            <span>Legal Notice & Transparency Declaration</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-display font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            Privacy Policy
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <span><strong>Effective Date:</strong> September 2026</span>
            <span>·</span>
            <span><strong>Brand:</strong> Click N Create (Saad M)</span>
            <span>·</span>
            <span><strong>Jurisdiction:</strong> United Kingdom & European Union</span>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300 max-w-3xl">
            This Privacy Policy sets out how <strong className="text-white">Click N Create</strong> (operated by independent freelance web developer Saad M) collects, protects, processes, and respects your personal data in strict compliance with the <strong>UK General Data Protection Regulation (UK GDPR)</strong>, the <strong>Data Protection Act 2018</strong>, and the <strong>EU GDPR</strong>.
          </p>
        </div>

        {/* Two-Column Structured Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents Sticky Pill Navigator */}
          <div className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div
              className={`p-4 rounded-2xl border backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#080814]/80' : 'border-zinc-200 bg-zinc-50'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold px-2 mb-3">
                Contents Jump Matrix
              </div>
              <nav className="space-y-1 text-xs font-mono">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="p-2 rounded-xl flex items-center gap-2.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                      <span className="truncate">{sec.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Main Legal Articles */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Data Controller */}
            <div
              id="controller"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  1. Data Controller & Identity
                </h2>
              </div>
              <div className="space-y-3 text-sm text-zinc-300 leading-relaxed font-sans">
                <p>
                  The data controller responsible for the processing of your personal information collected via this website (<code className="text-[#00F0FF] font-mono">clickncreate.dev</code>) is:
                </p>
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
                  isDark ? 'border-white/10 bg-white/[0.02] text-zinc-300' : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                }`}>
                  <div><strong className="text-white">Entity Name:</strong> Click N Create (Sole Freelance Practice)</div>
                  <div><strong className="text-white">Lead Engineer / Operator:</strong> Saad M</div>
                  <div><strong className="text-white">Email Address:</strong> <a href="mailto:mansurisaad28012@gmail.com" className="text-[#00F0FF] hover:underline">mansurisaad28012@gmail.com</a></div>
                  <div><strong className="text-white">Location:</strong> United Kingdom (Available Worldwide)</div>
                </div>
              </div>
            </div>

            {/* 2. Lawful Basis */}
            <div
              id="lawful-basis"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  2. Lawful Basis for Processing (Article 6 UK GDPR)
                </h2>
              </div>
              <div className="space-y-3 text-sm text-zinc-300 leading-relaxed font-sans">
                <p>We process your personal data under the following legal frameworks:</p>
                <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-zinc-400">
                  <li>
                    <strong className="text-white">Contractual Necessity (Art. 6(1)(b)):</strong> To prepare accurate scope proposals, price calculations, deliver custom software milestones, and provide requested technical support.
                  </li>
                  <li>
                    <strong className="text-white">Legitimate Interests (Art. 6(1)(f)):</strong> To maintain website security, prevent fraud and malicious traffic, and optimize mobile responsiveness and page performance.
                  </li>
                  <li>
                    <strong className="text-white">Explicit Consent (Art. 6(1)(a)):</strong> When you voluntarily submit a project inquiry or configure non-essential storage preferences via our cookie banner.
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Data Collected */}
            <div
              id="data-collected"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  3. Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
                <div>
                  <h3 className="font-bold text-white mb-1.5 font-display text-base">A. Information You Provide Directly</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    When using our Project Estimator or Contact Form:
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-zinc-400 font-mono">
                    <li>Full Name & Business / Brand Identifier</li>
                    <li>Email Address & Optional WhatsApp / Phone Number</li>
                    <li>Selected Service Category & Feature Architecture</li>
                    <li>Estimated Budget, Delivery Deadlines & Project Specifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-white mb-1.5 font-display text-base">B. Automatically Logged Technical Data</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    For DDoS mitigation and CDN edge delivery:
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-zinc-400 font-mono">
                    <li>IP Address (Anonymized at edge nodes)</li>
                    <li>Browser User-Agent, Operating System & Screen Viewport resolution</li>
                    <li>Referrer URLs and HTTP Request Timestamps</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Use of Information */}
            <div
              id="data-use"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  4. How We Utilize Your Data
                </h2>
              </div>
              <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
                <p>Your data is processed strictly for legitimate commercial engineering purposes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50'}`}>
                    <strong className="text-white block mb-1">Direct Communication</strong>
                    Responding directly to your development inquiries, scheduling technical calls, and sending project milestones.
                  </div>
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50'}`}>
                    <strong className="text-white block mb-1">Custom Quoting</strong>
                    Generating transparent, itemized fixed-price proposals or calculating milestone hours at £35/hr.
                  </div>
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50'}`}>
                    <strong className="text-white block mb-1">Zero Marketing Lists</strong>
                    We never sell, rent, lease, or monetize your contact records. No third-party spam lists.
                  </div>
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50'}`}>
                    <strong className="text-white block mb-1">Invoicing & Accounting</strong>
                    Generating compliant invoices for tax and statutory accounting under UK HMRC requirements.
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Third-Party Processors */}
            <div
              id="third-parties"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  5. Third-Party Infrastructure & Processors
                </h2>
              </div>
              <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
                <p>We work exclusively with ISO-27001 and SOC-2 certified infrastructure providers:</p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div>
                      <strong className="text-white font-sans">Edge CDN & Hosting:</strong> Vercel / Cloudflare
                    </div>
                    <span className="text-[#00F0FF]">TLS 1.3 / Global Edge</span>
                  </div>
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div>
                      <strong className="text-white font-sans">Email Dispatch Relay:</strong> Formspree / Resend
                    </div>
                    <span className="text-[#00F0FF]">Encrypted In Transit</span>
                  </div>
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div>
                      <strong className="text-white font-sans">Fonts & Typography:</strong> Self-hosted & Google Fonts
                    </div>
                    <span className="text-[#00F0FF]">Zero User Profiling</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Cookies & Storage */}
            <div
              id="cookies"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center">
                  <Cookie className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  6. Cookies & Local Browser Storage
                </h2>
              </div>
              <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
                <p>
                  We believe in zero surveillance. This website utilizes minimal browser storage keys:
                </p>
                <ul className="space-y-2 text-xs font-mono text-zinc-400">
                  <li><code className="text-[#00F0FF]">cnc_theme_preference:</code> Stores your Dark/Light mode preference locally.</li>
                  <li><code className="text-[#00F0FF]">cnc_cookie_consent:</code> Remembers your cookie acceptance preferences so you aren't asked repeatedly.</li>
                  <li><code className="text-[#00F0FF]">cnc_estimator_state:</code> Caches your chosen calculator options during the active session.</li>
                </ul>
              </div>
            </div>

            {/* 7. Retention */}
            <div
              id="retention"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  7. Data Retention Schedules
                </h2>
              </div>
              <div className="space-y-2 text-sm text-zinc-300 leading-relaxed">
                <p>
                  <strong>Enquiry Records:</strong> General project questions and calculator submissions are retained for up to <strong>12 months</strong>, after which they are purged if no active client engagement is established.
                </p>
                <p>
                  <strong>Contractual & Financial Records:</strong> Formal project contracts, invoices, and payment receipts are retained for <strong>6 years</strong> in accordance with UK statutory accounting and tax compliance laws.
                </p>
              </div>
            </div>

            {/* 8. Your Statutory Rights */}
            <div
              id="your-rights"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  8. Your Rights Under UK & EU GDPR
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <p>You maintain the following unalienable rights regarding your personal records:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <strong className="text-[#00F0FF] block">Right of Access</strong>
                    Request an exported copy of any data we hold about you.
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <strong className="text-[#00F0FF] block">Right to Rectification</strong>
                    Correct any inaccurate or incomplete details.
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <strong className="text-[#00F0FF] block">Right to Erasure (To be Forgotten)</strong>
                    Request complete deletion of non-statutory records.
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <strong className="text-[#00F0FF] block">Right to Data Portability</strong>
                    Receive your data in a structured, machine-readable JSON format.
                  </div>
                </div>
              </div>
            </div>

            {/* 9. Security */}
            <div
              id="security"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  9. Security & Encryption Standards
                </h2>
              </div>
              <div className="space-y-2 text-sm text-zinc-300 leading-relaxed font-sans">
                <p>
                  All network communication is strictly enforced over <strong>HTTPS with TLS 1.3 encryption</strong>, HTTP Strict Transport Security (HSTS), Content Security Policies (CSP), and sanitized form endpoints to prevent Cross-Site Scripting (XSS) and injection attacks.
                </p>
              </div>
            </div>

            {/* 10. Contact & ICO */}
            <div
              id="contact"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
                isDark ? 'border-[#00F0FF]/30 bg-[#080818]/95' : 'border-zinc-300 bg-zinc-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  10. Contact Information & Complaints
                </h2>
              </div>
              <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
                <p>
                  To exercise any of your statutory rights or submit a privacy inquiry, please contact Saad M directly:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:mansurisaad28012@gmail.com"
                    className="px-5 py-3 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email: mansurisaad28012@gmail.com</span>
                  </a>
                  <a
                    href={SITE_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl border border-white/15 hover:border-[#00F0FF]/40 text-white font-mono text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Direct WhatsApp Chat</span>
                  </a>
                </div>
                <p className="text-xs text-zinc-500 pt-2 font-mono">
                  You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-[#00F0FF] underline">ico.org.uk</a> if you believe your data has been handled unlawfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
