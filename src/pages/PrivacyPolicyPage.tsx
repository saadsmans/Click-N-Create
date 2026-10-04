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
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-900 dark:text-zinc-200 hover:text-cyan-600 dark:hover:text-[#00F0FF] transition-colors cursor-pointer group font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00F0FF] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-800 dark:text-zinc-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>UK GDPR & DPA 2018 Compliant</span>
          </div>
        </div>

        {/* Hero Header Card */}
        <div
          className={`rounded-3xl border p-8 sm:p-10 mb-8 backdrop-blur-2xl relative overflow-hidden transition-colors ${
            isDark
              ? 'border-[#00F0FF]/30 bg-[#060612]/90 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
              : 'border-zinc-200 bg-white shadow-xl'
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 dark:bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-[#00F0FF] uppercase tracking-wider mb-3 font-bold">
            <Shield className="w-4 h-4" />
            <span>Legal Notice & Transparency Declaration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-black dark:text-white">
            Privacy Policy
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-900 dark:text-zinc-200 font-medium">
            <span><strong>Effective Date:</strong> September 2026</span>
            <span>·</span>
            <span><strong>Brand:</strong> Click N Create (Saad M)</span>
            <span>·</span>
            <span><strong>Jurisdiction:</strong> United Kingdom & European Union</span>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-black dark:text-white max-w-3xl font-medium">
            This Privacy Policy sets out how <strong className="font-bold text-cyan-700 dark:text-[#00F0FF]">Click N Create</strong> (operated by independent freelance web developer Saad M) collects, protects, processes, and respects your personal data in strict compliance with the <strong className="font-bold text-black dark:text-white">UK General Data Protection Regulation (UK GDPR)</strong>, the <strong className="font-bold text-black dark:text-white">Data Protection Act 2018</strong>, and the <strong className="font-bold text-black dark:text-white">EU GDPR</strong>.
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
              <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-700 dark:text-[#00F0FF] font-bold px-2 mb-3">
                Contents Jump Matrix
              </div>
              <nav className="space-y-1 text-xs font-mono">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="p-2 rounded-xl flex items-center gap-2.5 text-black dark:text-white hover:text-cyan-700 dark:hover:text-[#00F0FF] hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group cursor-pointer font-medium"
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00F0FF] shrink-0" />
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
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  1. Data Controller & Identity
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>
                  The data controller responsible for the processing of your personal information collected via this website (<code className="text-cyan-700 dark:text-[#00F0FF] font-mono font-bold">clickncreate.dev</code>) is:
                </p>
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-1 text-xs font-mono">
                  <p className="font-bold text-black dark:text-white">Click N Create (Sole Freelance Practice)</p>
                  <p className="text-black dark:text-white">Saad M</p>
                  <p className="text-cyan-700 dark:text-[#00F0FF] font-bold">saadm.clickncreate@gmail.com</p>
                  <p className="text-black dark:text-white">United Kingdom (Available Worldwide)</p>
                </div>
                <p>
                  Because Click N Create operates as a direct independent freelance practice, you work directly with Saad M without agency intermediaries, offshore subcontractors, or unaccountable data brokers.
                </p>
              </div>
            </div>

            {/* 2. Lawful Basis */}
            <div
              id="lawful-basis"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  2. Lawful Basis for Processing
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>Under Article 6 of the UK GDPR, personal data is processed under the following legal bases:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-black dark:text-white">Contractual Necessity (Art. 6(1)(b)):</strong> To prepare technical quotes, scope milestone specifications, provide client project portal access, and deliver code handovers.
                  </li>
                  <li>
                    <strong className="text-black dark:text-white">Legitimate Interests (Art. 6(1)(f)):</strong> To monitor website uptime, defend against cybersecurity attacks, prevent fraudulent spam submissions, and refine responsive UI performance.
                  </li>
                  <li>
                    <strong className="text-black dark:text-white">Consent (Art. 6(1)(a)):</strong> When you voluntarily submit project details, schedule calendar consultations, or request direct WhatsApp correspondence.
                  </li>
                  <li>
                    <strong className="text-black dark:text-white">Legal Obligation (Art. 6(1)(c)):</strong> To maintain accurate commercial invoicing and tax accounting records in accordance with UK HMRC statutory standards.
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Data Collected */}
            <div
              id="data-collected"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  3. Information We Collect
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>We strictly limit data collection to what is essential for freelance software engineering:</p>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <h3 className="font-bold text-black dark:text-white text-sm mb-1">A. Contact & Proposal Data</h3>
                    <p className="text-xs text-black dark:text-white">
                      Your full name, business email address, phone number / WhatsApp handle, company brand name, project specifications, budget tiers, and target delivery timelines.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <h3 className="font-bold text-black dark:text-white text-sm mb-1">B. Client Portal & Invoicing Records</h3>
                    <p className="text-xs text-black dark:text-white">
                      Portal access authentication keys, approved milestone sign-offs, invoice identifiers, and VAT/billing addresses for commercial accounting.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <h3 className="font-bold text-black dark:text-white text-sm mb-1">C. Technical Telemetry (Privacy-Preserving)</h3>
                    <p className="text-xs text-black dark:text-white">
                      Anonymized browser user-agent, operating system, referrer URL, and general country location for debugging Web Vitals and viewport responsive breakpoints.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. How Your Data Is Utilized */}
            <div
              id="data-use"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  4. How Your Data Is Utilized
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>We process your data exclusively to:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Generate transparent engineering estimates and itemized project contracts.</li>
                  <li>Develop, test, and deploy bespoke frontend and full-stack software architectures.</li>
                  <li>Enable real-time communication via email, WhatsApp, or the Client Portal.</li>
                  <li>Provide 30 days of post-launch technical warranty and bug remediation.</li>
                  <li>Issue compliant commercial invoices with Barclays UK or PayPal details.</li>
                </ul>
                <p className="font-bold text-cyan-700 dark:text-[#00F0FF] pt-1">
                  We NEVER sell, rent, monetize, or disclose your personal contact information or source code repositories to third-party advertisers.
                </p>
              </div>
            </div>

            {/* 5. Third-Party Processors */}
            <div
              id="third-parties"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  5. Third-Party Processors & Infrastructure
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>We utilize trusted enterprise infrastructure providers that adhere to ISO 27001, SOC 2, and UK/EU GDPR standard contractual clauses:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <strong className="text-black dark:text-white block mb-1">Vercel & Cloudflare</strong>
                    <span className="text-black dark:text-white">Edge hosting, DDoS mitigation, SSL encryption, and static asset distribution.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <strong className="text-black dark:text-white block mb-1">Google Workspace & Resend</strong>
                    <span className="text-black dark:text-white">Encrypted email dispatch and transactional milestone notifications.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <strong className="text-black dark:text-white block mb-1">GitHub Enterprise</strong>
                    <span className="text-black dark:text-white">Private version control and automated CI/CD deployment pipelines.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <strong className="text-black dark:text-white block mb-1">Barclays Bank & PayPal</strong>
                    <span className="text-black dark:text-white">Secure bank transfer verification and invoice settlement.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Cookies */}
            <div
              id="cookies"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <Cookie className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  6. Cookies & Local Browser Storage
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>
                  This site uses only essential first-party cookies and local storage tokens (<code className="text-cyan-700 dark:text-[#00F0FF] font-mono font-bold">saad_theme</code>, <code className="text-cyan-700 dark:text-[#00F0FF] font-mono font-bold">saad_admin_token</code>, <code className="text-cyan-700 dark:text-[#00F0FF] font-mono font-bold">saad_client_auth</code>) required to remember your Dark/Light mode theme preferences and authenticate client portal sessions.
                </p>
                <p>
                  We do not use intrusive third-party cross-site advertising cookies or invasive tracking beacons.
                </p>
              </div>
            </div>

            {/* 7. Retention */}
            <div
              id="retention"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  7. Retention Schedules
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong className="text-black dark:text-white">Inquiries & Quotes:</strong> Retained for 12 months, then securely purged if an engagement is not commenced.</li>
                  <li><strong className="text-black dark:text-white">Active Project Data:</strong> Retained for the duration of the engineering contract and 30-day post-launch warranty period.</li>
                  <li><strong className="text-black dark:text-white">Invoices & Financial Records:</strong> Retained for 6 years in strict adherence to UK HMRC commercial tax regulations.</li>
                </ul>
              </div>
            </div>

            {/* 8. Your Rights */}
            <div
              id="your-rights"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  8. Your Statutory Rights (GDPR)
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>As a data subject under the UK GDPR, you have the right to:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong className="text-black dark:text-white">Right of Access (Subject Access Request):</strong> Request a full copy of your personal data.</li>
                  <li><strong className="text-black dark:text-white">Right to Rectification:</strong> Request correction of inaccurate information.</li>
                  <li><strong className="text-black dark:text-white">Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your contact records.</li>
                  <li><strong className="text-black dark:text-white">Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                </ul>
                <p className="text-xs text-black dark:text-white pt-1">
                  To exercise any statutory right, simply email Saad M at <a href="mailto:saadm.clickncreate@gmail.com" className="text-cyan-700 dark:text-[#00F0FF] font-bold hover:underline">saadm.clickncreate@gmail.com</a>. Requests will be fulfilled free of charge within 30 calendar days.
                </p>
              </div>
            </div>

            {/* 9. Security */}
            <div
              id="security"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  9. Security & Cryptographic Safeguards
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>
                  All network transmissions are protected with strict Transport Layer Security (TLS 1.3 / SSL encryption) with automated HSTS preloading. Access keys and tokens are salted and securely hashed. Production source code repositories use multi-factor authentication (MFA) and granular role-based permissions.
                </p>
              </div>
            </div>

            {/* 10. Contact */}
            <div
              id="contact"
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                isDark ? 'border-white/10 bg-[#070712]/80' : 'border-zinc-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 text-cyan-700 dark:text-[#00F0FF] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-display font-bold text-black dark:text-white">
                  10. Inquiries & Supervisory Authority
                </h2>
              </div>
              <div className="space-y-3 text-sm text-black dark:text-white leading-relaxed font-sans font-medium">
                <p>
                  If you have questions regarding this Privacy Policy, please contact Saad M directly at <a href="mailto:saadm.clickncreate@gmail.com" className="text-cyan-700 dark:text-[#00F0FF] font-bold hover:underline">saadm.clickncreate@gmail.com</a>.
                </p>
                <p className="text-xs text-black dark:text-white">
                  You also hold the statutory right to lodge a complaint with the UK supervisory authority: Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-cyan-700 dark:text-[#00F0FF] font-bold hover:underline">ico.org.uk</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
