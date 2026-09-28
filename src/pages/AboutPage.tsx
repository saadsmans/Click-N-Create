import React from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Terminal,
  Layers,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Linkedin,
  Mail,
  Phone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { SaadPortrait } from '../components/SaadPortrait.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="pt-28 pb-20 md:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===================== HERO SECTION ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 md:mb-20">
          <div className="lg:col-span-8 max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
              isDark ? 'border-white/10 bg-white/5 text-blue-400' : 'border-zinc-300 bg-white text-blue-600 shadow-2xs font-semibold'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Independent Developer</span>
            </div>

            <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>
              ABOUT <span className="text-luxury-gradient">SAAD M</span>
            </h1>

            <p className={`mt-5 text-base sm:text-xl leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Freelance web developer and the creator behind <strong className={isDark ? 'text-white' : 'text-zinc-950'}>Click N Create</strong>. Engineering refined, high-performance websites and bespoke web applications with direct personal accountability.
            </p>

            {/* Quick Contact Bar */}
            <div className="pt-6 flex flex-wrap items-center gap-3">
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: +44 7927 548123</span>
              </a>

              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-zinc-300' : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 shadow-2xs'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>{SITE_CONFIG.email}</span>
              </a>

              <a
                href={SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-zinc-300' : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 shadow-2xs'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <SaadPortrait size="lg" showUploadBadge={true} />
          </div>
        </div>

        {/* ===================== BIOGRAPHY & CORE VALUES ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-20 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              category="Background & Vision"
              title="CRAFTING DIGITAL EXPERIENCES WITHOUT AGENCY FRICTION"
              subtitle="Why Click N Create was founded as an independent digital practice."
              className="mb-6"
            />

            <div className={`space-y-4 text-base sm:text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <p>
                Click N Create was born out of a clear observation in the web design industry: traditional agencies are often bogged down by excessive overhead, layers of account managers, bloated turnaround times, and inflated fees that do not correlate to superior code quality.
              </p>
              <p>
                As an independent developer, I offer an honest and straightforward alternative. When you engage Click N Create, you work directly with me—<strong className={isDark ? 'text-white' : 'text-zinc-950'}>Saad M</strong>. I personally architect the technical structure, write every component in TypeScript and React, calibrate the responsive layout for mobile screens, and manage your cloud deployment.
              </p>
              <p>
                My rate is transparently set at <strong className="text-blue-500 font-bold">£35 per hour</strong> for flexible development, or structured as custom fixed-milestone pricing depending upon project scope. You know precisely what you are paying for, with itemized clarity and zero hidden fees.
              </p>
            </div>

            {/* Direct Values Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
              }`}>
                <Terminal className="w-6 h-6 text-blue-500 mb-3" />
                <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>Clean Code Guarantee</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  No spaghetti code or unmaintainable templates. Only modern React, TypeScript, and clean semantic markup.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
              }`}>
                <ShieldCheck className="w-6 h-6 text-emerald-500 mb-3" />
                <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>100% Asset Ownership</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  You own your code, domain accounts, and design files upon final settlement. Zero lock-in.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Developer Stats & Working Model */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`rounded-3xl border p-8 backdrop-blur-2xl ${
              isDark ? 'border-white/15 bg-[#0E0E12]/90 shadow-xl' : 'border-zinc-200 bg-white shadow-md'
            }`}>
              <span className="text-xs font-mono text-blue-500 uppercase tracking-wider block mb-2 font-semibold">
                Working Parameters
              </span>
              <h3 className={`text-2xl font-bold font-display tracking-tight mb-6 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Freelance Collaboration Model
              </h3>

              <div className="space-y-4 text-sm font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className="text-zinc-500">Standard Hourly Rate</span>
                  <span className="text-base font-bold text-blue-500">£35 / Hour</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className="text-zinc-500">Fixed Milestone Pricing</span>
                  <span className={isDark ? 'text-white' : 'text-zinc-950'}>Custom by Scope</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className="text-zinc-500">Direct Channel</span>
                  <span className="text-emerald-500 font-semibold">WhatsApp & Email</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className="text-zinc-500">Typical Turnaround</span>
                  <span className={isDark ? 'text-white' : 'text-zinc-950'}>1 – 3 Weeks</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Current Status</span>
                  <span className="text-emerald-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available for 2026
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`w-full py-3.5 px-4 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>Book a Consultation with Saad</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick WhatsApp Callout Card */}
            <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase block">Prefer Instant Messaging?</span>
                <span className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  Message Saad on WhatsApp
                </span>
              </div>
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>+44 7927 548123</span>
              </a>
            </div>
          </div>
        </div>

        {/* ===================== TECH STACK & TOOLS ===================== */}
        <div className="py-20 border-b border-black/[0.08] dark:border-white/[0.08]">
          <SectionHeading
            category="Technical Stack"
            title="TOOLS & METHODOLOGY"
            subtitle="The modern, rock-solid technologies I use to build fast, scalable, and responsive digital products."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-mono font-bold text-sm">
                TS
              </div>
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                React 19 & TypeScript
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Type-safe component architecture with predictable state and sub-second browser rendering.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-mono font-bold text-sm">
                CSS
              </div>
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Tailwind CSS
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Utility-first styling with zero runtime bloat, bespoke design tokens, and instant responsiveness.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold text-sm">
                FX
              </div>
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Framer Motion & GSAP
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Fluid spring-physics micro-interactions and scroll choreography respecting accessibility standards.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono font-bold text-sm">
                SEO
              </div>
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                On-Page SEO & Schema
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Structured Schema.org JSON-LD, OpenGraph share previews, and Core Web Vitals speed optimization.
              </p>
            </div>
          </div>
        </div>

        {/* ===================== CTA ===================== */}
        <div className="py-20 text-center max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-mono text-blue-500 tracking-widest uppercase block font-semibold">
            Ready to Collaborate?
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold font-display tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>
            Let's Discuss Your Project Directly.
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Rate: £35/hr or tailored fixed-scope quote. Reach out via form, email, or WhatsApp.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              text="Send Project Enquiry"
              size="lg"
              variant="primary"
              onClick={() => onNavigate('/contact')}
            />
            <MagneticButton
              text="View Transparent Pricing"
              size="lg"
              variant="secondary"
              showArrow={false}
              onClick={() => onNavigate('/pricing')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
