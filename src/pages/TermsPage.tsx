import React from 'react';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  Code2,
  CreditCard,
  Layers,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Mail,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { SITE_CONFIG } from '../data/site.ts';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const termsSections = [
    {
      number: '01',
      title: 'Engagement & Operating Structure',
      icon: Scale,
      content:
        'Click N Create is an independent digital development and engineering practice operated solely by freelance web developer Saad M. All project deliverables, timelines, milestones, and scope specifications are executed on a direct 1-on-1 collaborative basis with no offshore outsourcing or middle-agency markups.',
    },
    {
      number: '02',
      title: 'Rates, Quotations & Pricing Models',
      icon: CreditCard,
      content:
        'Services are provided under two transparent commercial models: (a) Fixed-Scope Milestone Contracts based on itemized technical blueprints, or (b) Hourly Engineering & Consulting billed at the standard rate of £35/hr. Written quotes remain valid for 30 calendar days from issuance.',
    },
    {
      number: '03',
      title: 'Payment Schedules & Milestone Structure',
      icon: CheckCircle2,
      content:
        'For fixed-price projects, a standard 50% initial commitment deposit is required prior to project kickoff, architecture planning, and environment provisioning. The remaining 50% balance is payable upon staging environment approval and live preview verification, prior to final source code handoff and DNS production pointing.',
    },
    {
      number: '04',
      title: 'Client Materials, Brand Assets & Timelines',
      icon: Layers,
      content:
        'The client is responsible for supplying necessary text copy, brand assets, photography, and required API credentials in a timely manner. Project delivery estimates are contingent upon prompt client feedback (within 3 business days of milestone submissions).',
    },
    {
      number: '05',
      title: 'Revisions & Scope Management Protocol',
      icon: RefreshCw,
      content:
        'Each milestone includes two rounds of focused revisions to refine typography, visual aesthetics, and component interactions to your exact satisfaction. Substantive architectural changes or additional feature additions requested after scope sign-off will be estimated separately at the standard £35/hr rate.',
    },
    {
      number: '06',
      title: '100% Intellectual Property & Code Ownership',
      icon: Code2,
      content:
        'Upon final payment settlement, 100% full legal ownership of all bespoke code, frontend components, custom layouts, and created graphics transfers unconditionally to the client. You receive clean, unminified, well-commented source code with zero vendor lock-in.',
    },
    {
      number: '07',
      title: '30-Day Post-Launch Technical Warranty',
      icon: Sparkles,
      content:
        'Every website and web application delivered includes a complimentary 30-day technical warranty starting from launch day. Any unintended software bugs, layout discrepancies, or responsive quirks will be corrected immediately at zero additional expense.',
    },
    {
      number: '08',
      title: 'Hosting, Domains & Third-Party Services',
      icon: AlertCircle,
      content:
        'Clients retain direct ownership of their third-party accounts (e.g., Vercel, Cloudflare, Netlify, domain registrars, and payment gateways like Stripe). Click N Create will assist in zero-downtime deployment and DNS configuration without holding your domain hostage.',
    },
    {
      number: '09',
      title: 'Cancellation & Termination Policy',
      icon: ShieldAlert,
      content:
        'Either party may terminate an engagement with written notice. In the event of early cancellation, the client is only billed for work completed up to the cancellation date, and will receive all code, assets, and design files produced up to that milestone.',
    },
    {
      number: '10',
      title: 'Governing Law & Jurisdiction',
      icon: Scale,
      content:
        'These Terms & Conditions are governed by and construed in accordance with the Laws of England and Wales (United Kingdom). Any dispute arising under these terms shall be resolved through good-faith negotiation, or under the jurisdiction of the courts of England & Wales.',
    },
  ];

  return (
    <div className="pt-28 pb-20 md:pt-36">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Back Navigation Bar */}
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
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            <span>Commercial Terms · Saad M</span>
          </div>
        </div>

        {/* Hero Card */}
        <div
          className={`rounded-3xl border p-8 sm:p-10 mb-10 backdrop-blur-2xl relative overflow-hidden ${
            isDark
              ? 'border-[#00F0FF]/30 bg-[#060612]/90 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
              : 'border-zinc-200 bg-white shadow-xl'
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-wider mb-3 font-semibold">
            <FileText className="w-4 h-4" />
            <span>Freelance Engineering Agreement</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-display font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            Terms & Conditions
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <span><strong>Last Updated:</strong> September 2026</span>
            <span>·</span>
            <span><strong>Standard Rate:</strong> £35/hour</span>
            <span>·</span>
            <span><strong>Operator:</strong> Saad M (Click N Create)</span>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300 max-w-3xl">
            These terms establish a transparent, fair, and professional working relationship between you (the Client) and <strong className="text-white">Saad M</strong> operating as <strong className="text-white">Click N Create</strong>. No hidden fees, no confusing legal jargon — just clean engineering agreements.
          </p>
        </div>

        {/* Structured Terms List */}
        <div className="space-y-6">
          {termsSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.number}
                className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                  isDark
                    ? 'border-white/10 bg-[#070714]/80 hover:border-[#00F0FF]/30'
                    : 'border-zinc-200 bg-white shadow-sm hover:border-cyan-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className={`text-lg sm:text-xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                      {sec.title}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#00F0FF] px-2.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/25 self-start sm:self-auto">
                    SECTION {sec.number}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  {sec.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact / Direct Clarity Card */}
        <div
          className={`mt-10 rounded-3xl border p-8 sm:p-10 backdrop-blur-xl ${
            isDark
              ? 'border-[#00F0FF]/40 bg-[#08081A]/95 text-zinc-300 shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
              : 'border-cyan-400 bg-cyan-50/50 text-zinc-800 shadow-lg'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Questions About These Terms?</span>
              </span>
              <h3 className={`text-2xl font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Have a specific project contract or NDA requirement?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                I am happy to review and sign mutual Non-Disclosure Agreements (NDAs) and customize milestone deliverables to suit your enterprise or startup requirements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="px-7 py-3.5 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
              >
                <span>Start a Project</span>
              </button>

              <a
                href="mailto:mansurisaad28012@gmail.com"
                className={`px-5 py-3.5 rounded-xl border font-mono text-xs flex items-center justify-center gap-2 transition-colors ${
                  isDark
                    ? 'border-white/10 hover:bg-white/10 text-white'
                    : 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Email Saad M</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
