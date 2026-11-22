import React from 'react';
import {
  Terminal,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  Linkedin,
  Instagram,
  Mail,
  Sparkles,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { ENGINEERING_COURSEWORK_MODULES, TIMEZONE_AVAILABILITY } from '../data/websiteContent.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('about') || {};

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-clip w-full max-w-full">
      <SEOHead
        title="About Saad M | Click N Create Founder & Full-Stack Developer"
        description="Learn about Saad M, the founder and independent engineer behind Click N Create. Background in Electronics & Communication Engineering, WordPress, and modern React."
        canonicalPath="/about"
        keywords={[
          'about Saad M',
          'freelance developer bio',
          'Click N Create founder',
          'independent web developer UK India',
          'full stack freelance engineer'
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===================== HERO SECTION ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 md:mb-20">
          <div className="lg:col-span-8 max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
              isDark
                ? 'border-[#38BDF8]/30 bg-[#0C1222]/90 text-[#38BDF8]'
                : 'border-[#1D4ED8]/30 bg-[#F3E9DC]/75 text-[#1E40AF] shadow-2xs font-semibold'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cms.badgeText || 'Independent Freelance Web Developer'}</span>
            </div>

            <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] ${
              isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
            }`}>
              {cms.heroTitle || 'ABOUT'} <span className="text-luxury-gradient">{cms.heroHighlight || 'SAAD M'}</span>
            </h1>

            <p className={`mt-5 text-base sm:text-xl leading-relaxed ${
              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
            }`}>
              {cms.heroSubtitle || (
                <>
                  Freelance web developer and founder of <strong className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>Click N Create</strong>. Engineering high-performance React websites, e-commerce storefronts, and bespoke digital tools with direct 1-on-1 personal accountability.
                </>
              )}
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
                  isDark ? 'border-white/15 bg-[#0C1222] hover:border-[#38BDF8]/40 text-[#F1F5F9]' : 'border-black/15 bg-white hover:border-[#1D4ED8]/40 text-[#0F172A] shadow-2xs'
                }`}
              >
                <Mail className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                <span>{SITE_CONFIG.email}</span>
              </a>

              <a
                href={SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-white/15 bg-[#0C1222] hover:border-[#38BDF8]/40 text-[#F1F5F9]' : 'border-black/15 bg-white hover:border-[#1D4ED8]/40 text-[#0F172A] shadow-2xs'
                }`}
              >
                <Linkedin className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="w-3 h-3 text-[#94A3B8]" />
              </a>

              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-white/15 bg-[#0C1222] hover:border-[#38BDF8]/40 text-[#F1F5F9]' : 'border-black/15 bg-white hover:border-[#1D4ED8]/40 text-[#0F172A] shadow-2xs'
                }`}
              >
                <Instagram className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                <span>Instagram (@saads.125)</span>
                <ArrowUpRight className="w-3 h-3 text-[#94A3B8]" />
              </a>
            </div>
          </div>

          {/* Clean Architectural Developer Overview Bento Card */}
          <div className="lg:col-span-4">
            <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 shadow-xl ${
              isDark ? 'border-[#38BDF8]/25 bg-[#0C1222]/95' : 'border-black/10 bg-white'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-[#38BDF8]' : 'bg-[#1D4ED8]'}`} />
                  <span className={`font-mono text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                    Saad M · Click N Create
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between py-1 border-b border-black/[0.05] dark:border-white/[0.05]">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Role</span>
                  <span className="font-bold">Lead Developer & Founder</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-black/[0.05] dark:border-white/[0.05]">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Hourly Rate</span>
                  <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>£35 / hour</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-black/[0.05] dark:border-white/[0.05]">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Specialty</span>
                  <span className="font-bold">React, TypeScript, E-Com</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-black/[0.05] dark:border-white/[0.05]">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Direct Contact</span>
                  <span className="font-bold">1-on-1 No Middlemen</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Delivery</span>
                  <span className="font-bold text-emerald-500">Milestone-Based</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isDark
                    ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#060913]'
                    : 'bg-[#1D4ED8] hover:bg-[#1D4ED8] text-white'
                }`}
              >
                <span>Hire Saad Directly</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
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

            <div className={`space-y-4 text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
              <p>
                {cms.bioParagraph1 || 'Click N Create was born out of a clear observation in the web design industry: traditional agencies are often bogged down by excessive overhead, layers of account managers, bloated turnaround times, and inflated fees that do not correlate to superior code quality.'}
              </p>
              <p>
                {cms.bioParagraph2 || (
                  <>
                    As an independent developer, I offer an honest and straightforward alternative. When you engage Click N Create, you work directly with me—<strong className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>Saad M</strong>. I personally architect the technical structure, write every component in TypeScript and React, calibrate the responsive layout for mobile screens, and manage your cloud deployment.
                  </>
                )}
              </p>
              <p>
                My rate is transparently set at <strong className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>£35 per hour</strong> for flexible development, or structured as custom fixed-milestone pricing depending upon project scope. You know precisely what you are paying for, with itemized clarity and zero hidden fees.
              </p>
            </div>

            {/* Direct Values Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
              }`}>
                <Terminal className={`w-6 h-6 mb-3 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                <h4 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>Clean Code Guarantee</h4>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  No spaghetti code or unmaintainable templates. Only modern React, TypeScript, and clean semantic markup.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${
                isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
              }`}>
                <ShieldCheck className="w-6 h-6 text-emerald-500 mb-3" />
                <h4 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>100% Asset Ownership</h4>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  You own your code, domain accounts, and design files upon final settlement. Zero lock-in.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Developer Stats & Working Model */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`rounded-3xl border p-8 backdrop-blur-2xl ${
              isDark ? 'border-white/15 bg-[#0C1222]/95 shadow-xl' : 'border-black/10 bg-white shadow-md'
            }`}>
              <span className={`text-xs font-mono uppercase tracking-wider block mb-2 font-semibold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                Working Parameters
              </span>
              <h3 className={`text-2xl font-bold font-display tracking-tight mb-6 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                Freelance Collaboration Model
              </h3>

              <div className="space-y-4 text-sm font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Standard Hourly Rate</span>
                  <span className={`text-base font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>£35 / Hour</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Fixed Milestone Pricing</span>
                  <span className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>Custom by Scope</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Direct Channel</span>
                  <span className="text-emerald-500 font-semibold">WhatsApp & Email</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Typical Turnaround</span>
                  <span className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>1 – 3 Weeks</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Current Status</span>
                  <span className="text-emerald-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Available for 2026
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`w-full py-3.5 px-4 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isDark ? 'bg-[#F1F5F9] text-[#060913] hover:bg-[#38BDF8]' : 'bg-[#0F172A] text-white hover:bg-[#2a2b30]'
                  }`}
                >
                  <span>Book a Consultation with Saad</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick WhatsApp Callout Card */}
            <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
            }`}>
              <div>
                <span className={`text-xs font-mono uppercase block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Prefer Instant Messaging?</span>
                <span className={`text-sm font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
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
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                isDark ? 'bg-[#38BDF8]/10 text-[#38BDF8]' : 'bg-[#F3E9DC] text-[#1E40AF]'
              }`}>
                TS
              </div>
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                React 19 & TypeScript
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                Type-safe component architecture with predictable state and sub-second browser rendering.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                isDark ? 'bg-[#94A3B8]/10 text-[#94A3B8]' : 'bg-[#EAE6DF] text-[#475569]'
              }`}>
                CSS
              </div>
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                Tailwind CSS
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                Utility-first styling with zero runtime bloat, bespoke design tokens, and instant responsiveness.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold text-sm">
                FX
              </div>
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                Framer Motion & GSAP
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                Fluid spring-physics micro-interactions and scroll choreography respecting accessibility standards.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                isDark ? 'bg-[#7DD3FC]/10 text-[#7DD3FC]' : 'bg-[#F3E9DC] text-[#1D4ED8]'
              }`}>
                SEO
              </div>
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                On-Page SEO & Schema
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                Structured Schema.org JSON-LD, OpenGraph share previews, and Core Web Vitals speed optimization.
              </p>
            </div>
          </div>
        </div>

        {/* ===================== ENGINEERING BACKGROUND & GLOBAL TIMEZONE AVAILABILITY ===================== */}
        <div className="py-20 border-b border-black/[0.08] dark:border-white/[0.08] space-y-16">
          <div className="space-y-6">
            <SectionHeading
              category="Education & Academic Track"
              title="ENGINEERING RIGOUR APPLIED TO WEB SOFTWARE"
              subtitle="Studying BE Electronics & Communication Engineering at GEC Bharuch (2023–2027) alongside circuit simulation training with IIT Bombay Spoken Tutorial."
              className="mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {ENGINEERING_COURSEWORK_MODULES.map((mod) => (
                <div
                  key={mod.area}
                  className={`p-6 rounded-2xl border space-y-2.5 ${
                    isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
                  }`}
                >
                  <h4 className={`text-sm font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                    {mod.area}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    {mod.relevance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading
              category="Working Hours & Overlapping Support"
              title="TIMEZONE COVERAGE & RESPONSE WINDOWS"
              subtitle="Full business-day overlap with clients across the United Kingdom, Europe, Middle East, and India."
              className="mb-4"
            />

            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[620px]">
                  <thead>
                    <tr className={`border-b text-xs font-mono uppercase tracking-wider ${isDark ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-black/10 bg-slate-50 text-slate-700'}`}>
                      <th className="py-3.5 px-5 font-bold">Client Region</th>
                      <th className="py-3.5 px-5 font-bold">Timezone</th>
                      <th className="py-3.5 px-5 font-bold">Live Collaboration Window</th>
                      <th className="py-3.5 px-5 font-bold">Primary Channel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 dark:divide-white/10 text-xs sm:text-sm">
                    {TIMEZONE_AVAILABILITY.map((tz) => (
                      <tr key={tz.region}>
                        <td className={`py-3.5 px-5 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{tz.region}</td>
                        <td className={`py-3.5 px-5 font-mono ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>{tz.timezone}</td>
                        <td className={`py-3.5 px-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{tz.overlapWindow}</td>
                        <td className={`py-3.5 px-5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tz.supportChannel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== CTA ===================== */}
        <div className="py-20 text-center max-w-3xl mx-auto space-y-6">
          <span className={`text-xs font-mono tracking-widest uppercase block font-semibold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
            Ready to Collaborate?
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold font-display tracking-tight ${
            isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
          }`}>
            Let's Discuss Your Project Directly.
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
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
