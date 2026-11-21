import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  ExternalLink,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Code2,
  Globe,
  Cpu,
} from 'lucide-react';
import { SAAD_PORTFOLIO } from '../data/portfolio.ts';
import { SectionHeading } from './SectionHeading.tsx';
import { ClickNCreateLogo } from './ClickNCreateLogo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface RecentWorksSectionProps {
  onNavigate: (path: string) => void;
}

export const RecentWorksSection: React.FC<RecentWorksSectionProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const owaisProject = SAAD_PORTFOLIO.projects.find((p) => p.id === 'owais-academic-portfolio') || SAAD_PORTFOLIO.projects[0];
  const hammadProject = SAAD_PORTFOLIO.projects.find((p) => p.id === 'hammad-patel-portfolio');
  const clickNCreateProject = SAAD_PORTFOLIO.projects.find((p) => p.id === 'click-n-create-platform') || SAAD_PORTFOLIO.projects[2];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="works">
      {/* Diffused ambient light */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[450px] blur-[140px] pointer-events-none transition-opacity ${
          isDark ? 'bg-[#38BDF8]/10' : 'bg-[#38BDF8]/10'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <SectionHeading
            category="Recent Client Delivery"
            title="RECENT WORKS & CLIENT PROJECTS"
            subtitle="Real websites, custom dashboards, and high-performance digital solutions crafted and deployed live by Saad M."
            className="mb-0"
          />

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-end">
            <button
              type="button"
              onClick={() => onNavigate('/my-works')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                isDark
                  ? 'border-[#00F0FF]/50 bg-[#00F0FF] hover:bg-[#5CF6FF] text-[#05050A] shadow-[0_8px_24px_rgba(0,240,255,0.2)]'
                  : 'border-slate-950 bg-slate-950 hover:bg-cyan-700 text-white shadow-2xs'
              }`}
            >
              <span>View My Works</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/portfolio')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                isDark
                  ? 'border-[#38BDF8]/40 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#BAE6FD] shadow-[0_8px_24px_rgba(56, 189, 248,0.16)]'
                  : 'border-[#1D4ED8]/45 bg-[#F3E9DC] hover:bg-[#EBDDCA] text-[#1E40AF] shadow-2xs'
              }`}
            >
              <span>View Full Portfolio & CV</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WORK 1: OWAIS PORTFOLIO & ACADEMIC DASHBOARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl border p-6 sm:p-10 md:p-12 mb-10 relative overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
            isDark
              ? 'border-[#38BDF8]/30 bg-gradient-to-br from-[#161922]/95 via-[#111319]/95 to-[#060913]/95 shadow-[0_20px_60px_-10px_rgba(56, 189, 248,0.14)]'
              : 'border-stone-200 bg-white/95 shadow-xl hover:border-[#1D4ED8]/50'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#38BDF8]/15 via-[#2563EB]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Client Project Info */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>RECENT CLIENT WORK · 2026</span>
                  </span>

                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border ${
                    isDark ? 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#BAE6FD]' : 'bg-[#F3E9DC] border-[#1D4ED8]/35 text-[#1E40AF]'
                  }`}>
                    ACADEMIC DASHBOARD & PORTFOLIO
                  </span>
                </div>

                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight leading-tight break-words ${
                  isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                }`}>
                  Owais Portfolio & <span className="text-cyber-gradient">Academic Dashboard</span>
                </h3>

                <p className={`mt-4 text-sm sm:text-base leading-relaxed ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}>
                  Successfully designed, built, and launched for client <strong>Owais</strong>. A clean, responsive portfolio and academic background dashboard featuring his educational trajectory, degree milestones, interactive skill matrices, and personal accomplishments with zero-lag performance.
                </p>
              </div>

              {/* Key Deliverables Matrix */}
              <div className="space-y-2.5 pt-1">
                <span className={`text-xs font-mono uppercase tracking-widest font-bold block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Delivered Features & Technical Highlights:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                    <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>
                      Full Academic Timeline & Milestone Showcase
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                    <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>
                      Categorized Technical & Soft Skills Matrix
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                    <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>
                      Live Cloud Deployment on Vercel CDN
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                    <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>
                      100% Responsive Desktop, Tablet & Mobile UI
                    </span>
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {owaisProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-mono px-3 py-1 rounded-lg border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-[#94A3B8]'
                        : 'bg-[#F3F6FA] border-stone-200 text-[#0F172A]'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href="https://owaisdashboard.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#060913] font-mono font-bold text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(56, 189, 248,0.28)] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`px-5 py-3.5 rounded-xl border text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isDark
                      ? 'border-white/20 hover:bg-white/10 text-[#F1F5F9]'
                      : 'border-stone-300 bg-white hover:bg-stone-50 text-[#0F172A] shadow-2xs'
                  }`}
                >
                  Request Similar Project
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Browser Window Mockup */}
            <div className="lg:col-span-6">
              <div
                className={`rounded-2xl border p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl ${
                  isDark
                    ? 'border-[#38BDF8]/30 bg-[#0D0F14] shadow-[0_15px_45px_rgba(56, 189, 248,0.12)]'
                    : 'border-stone-300 bg-white shadow-xl'
                }`}
              >
                {/* Browser Window Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-black/10 dark:border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-xs" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-xs" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-xs" />
                  </div>

                  {/* URL Bar */}
                  <a
                    href="https://owaisdashboard.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 font-mono text-[11px] flex items-center gap-1.5 hover:underline ${
                      isDark ? 'text-[#BAE6FD]' : 'text-[#1D4ED8]'
                    }`}
                  >
                    <span className="opacity-50">https://</span>
                    <span className="font-bold">owaisdashboard.vercel.app</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  <span className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    VERCEL LIVE
                  </span>
                </div>

                {/* Dashboard Inner Layout Mockup */}
                <div className="space-y-4">
                  {/* Top Profile Banner in Mockup */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      isDark
                        ? 'border-white/10 bg-gradient-to-r from-[#38BDF8]/15 via-[#1A1D25] to-[#060913]'
                        : 'border-stone-200 bg-gradient-to-r from-[#F3F6FA] via-white to-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-[#38BDF8]/15 border-[#38BDF8]/30 text-[#38BDF8]' : 'bg-[#F3E9DC] border-[#1D4ED8]/30 text-[#1D4ED8]'
                      }`}>
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`font-display font-bold text-base leading-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                          Owais Dashboard
                        </h4>
                        <p className={`text-xs font-mono ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                          Student Academic Portfolio & Skills
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30">
                      100% Uptime
                    </span>
                  </div>

                  {/* Dashboard Widgets Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'border-[#38BDF8]/25 bg-[#38BDF8]/10 text-[#F1F5F9]' : 'border-[#1D4ED8]/25 bg-[#F3E9DC]/70 text-[#0F172A]'
                      }`}
                    >
                      <div className={`flex items-center gap-1.5 mb-1 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase font-bold">Academics</span>
                      </div>
                      <div className="text-xs font-bold leading-tight">All Degrees & History</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Verified Records</div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'border-white/10 bg-white/5 text-[#F1F5F9]' : 'border-stone-200 bg-stone-50 text-[#0F172A]'
                      }`}
                    >
                      <div className={`flex items-center gap-1.5 mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        <Cpu className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase font-bold">Skills Matrix</span>
                      </div>
                      <div className="text-xs font-bold leading-tight">Technical & Soft</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Categorized Matrix</div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border col-span-2 sm:col-span-1 ${
                        isDark ? 'border-emerald-500/20 bg-emerald-950/20 text-[#F1F5F9]' : 'border-emerald-200 bg-emerald-50/70 text-[#0F172A]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-emerald-500 mb-1">
                        <Globe className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase font-bold">Deployment</span>
                      </div>
                      <div className="text-xs font-bold leading-tight">Vercel Edge Global</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Fast Edge CDN</div>
                    </div>
                  </div>

                  {/* Bottom Verification Seal in Mockup */}
                  <div className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Client Delivery: Completed & Live</span>
                    <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>Saad M · Click N Create</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* WORK 2: HAMMAD PATEL PERSONAL & ENGINEERING PORTFOLIO */}
        {hammadProject && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className={`rounded-3xl border p-6 sm:p-10 md:p-12 mb-10 relative overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
              isDark
                ? 'border-[#38BDF8]/30 bg-gradient-to-br from-[#161922]/95 via-[#111319]/95 to-[#060913]/95 shadow-[0_20px_60px_-10px_rgba(56, 189, 248,0.14)]'
                : 'border-stone-200 bg-white/95 shadow-xl hover:border-[#1D4ED8]/50'
            }`}
          >
            {/* Subtle Ambient Glow */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#38BDF8]/15 via-[#2563EB]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column: Interactive Browser Window Mockup */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div
                  className={`rounded-2xl border p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl ${
                    isDark
                      ? 'border-[#38BDF8]/30 bg-[#0D0F14] shadow-[0_15px_45px_rgba(56, 189, 248,0.12)]'
                      : 'border-stone-300 bg-white shadow-xl'
                  }`}
                >
                  {/* Browser Window Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-black/10 dark:border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-xs" />
                    </div>

                    {/* URL Bar */}
                    <a
                      href="https://hammadpatel.vercel.app"
                      target="_blank"
                      rel="noreferrer"
                      className={`px-3.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 font-mono text-[11px] flex items-center gap-1.5 hover:underline ${
                        isDark ? 'text-[#BAE6FD]' : 'text-[#1D4ED8]'
                      }`}
                    >
                      <span className="opacity-50">https://</span>
                      <span className="font-bold">hammadpatel.vercel.app</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>

                    <span className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      VERCEL LIVE
                    </span>
                  </div>

                  {/* Portfolio Inner Layout Mockup */}
                  <div className="space-y-4">
                    {/* Top Profile Banner in Mockup */}
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        isDark
                          ? 'border-white/10 bg-gradient-to-r from-[#38BDF8]/15 via-[#1A1D25] to-[#060913]'
                          : 'border-stone-200 bg-gradient-to-r from-[#F3F6FA] via-white to-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                          isDark ? 'bg-[#38BDF8]/15 border-[#38BDF8]/30 text-[#38BDF8]' : 'bg-[#F3E9DC] border-[#1D4ED8]/30 text-[#1D4ED8]'
                        }`}>
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`font-display font-bold text-base leading-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                            Hammad Patel
                          </h4>
                          <p className={`text-xs font-mono ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                            E&amp;C Portfolio &amp; ECE Virtual Lab Studio
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30">
                        Virtual Lab Live
                      </span>
                    </div>

                    {/* Portfolio Widgets Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div
                        className={`p-3 rounded-xl border ${
                          isDark ? 'border-[#38BDF8]/25 bg-[#38BDF8]/10 text-[#F1F5F9]' : 'border-[#1D4ED8]/25 bg-[#F3E9DC]/70 text-[#0F172A]'
                        }`}
                      >
                        <div className={`flex items-center gap-1.5 mb-1 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                          <Cpu className="w-4 h-4" />
                          <span className="text-[10px] font-mono uppercase font-bold">Virtual Lab</span>
                        </div>
                        <div className="text-xs font-bold leading-tight">ECE Lab Studio</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Circuit &amp; Signals</div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border ${
                          isDark ? 'border-white/10 bg-white/5 text-[#F1F5F9]' : 'border-stone-200 bg-stone-50 text-[#0F172A]'
                        }`}
                      >
                        <div className={`flex items-center gap-1.5 mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                          <Code2 className="w-4 h-4" />
                          <span className="text-[10px] font-mono uppercase font-bold">Curriculum</span>
                        </div>
                        <div className="text-xs font-bold leading-tight">All Studied Topics</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Interactive Demos</div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border col-span-2 sm:col-span-1 ${
                          isDark ? 'border-emerald-500/20 bg-emerald-950/20 text-[#F1F5F9]' : 'border-emerald-200 bg-emerald-50/70 text-[#0F172A]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-emerald-500 mb-1">
                          <Globe className="w-4 h-4" />
                          <span className="text-[10px] font-mono uppercase font-bold">Deployment</span>
                        </div>
                        <div className="text-xs font-bold leading-tight">Vercel Edge CDN</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Instant Load</div>
                      </div>
                    </div>

                    {/* Bottom Verification Seal in Mockup */}
                    <div className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">Client Delivery: Completed &amp; Live</span>
                      <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>Saad M · Click N Create</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Client Project Info */}
              <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>RECENT CLIENT WORK · 2026</span>
                    </span>

                    <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border ${
                      isDark ? 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#BAE6FD]' : 'bg-[#F3E9DC] border-[#1D4ED8]/35 text-[#1E40AF]'
                    }`}>
                      ECE VIRTUAL LAB STUDIO &amp; PORTFOLIO
                    </span>
                  </div>

                  <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight leading-tight break-words ${
                    isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                  }`}>
                    Hammad Patel — <span className="text-cyber-gradient">ECE Virtual Lab Studio</span>
                  </h3>

                  <p className={`mt-4 text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                  }`}>
                    Designed, engineered, and deployed for client <strong>Hammad Patel</strong>. A comprehensive personal and engineering portfolio website featuring an interactive <strong>ECE Virtual Lab Studio</strong> covering core electronics &amp; communication coursework studied at GEC Bharuch (analog &amp; digital signal processing, circuit simulations, modulation, and communications) alongside his IIT Bombay internship experience.
                  </p>
                </div>

                {/* Key Deliverables Matrix */}
                <div className="space-y-2.5 pt-1">
                  <span className={`text-xs font-mono uppercase tracking-widest font-bold block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    Delivered Features &amp; Technical Highlights:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {hammadProject.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                        <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>
                          {ach}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {hammadProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-mono px-3 py-1 rounded-lg border ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-[#94A3B8]'
                          : 'bg-[#F3F6FA] border-stone-200 text-[#0F172A]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href="https://hammadpatel.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#060913] font-mono font-bold text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(56, 189, 248,0.28)] flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onNavigate('/contact')}
                    className={`px-5 py-3.5 rounded-xl border text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      isDark
                        ? 'border-white/20 hover:bg-white/10 text-[#F1F5F9]'
                        : 'border-stone-300 bg-white hover:bg-stone-50 text-[#0F172A] shadow-2xs'
                    }`}
                  >
                    Request Similar Project
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* WORK 3: CLICK N CREATE PLATFORM & BRAND IDENTITY */}
        {clickNCreateProject && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className={`rounded-3xl border p-6 sm:p-10 md:p-12 relative overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
              isDark
                ? 'border-white/12 bg-gradient-to-br from-[#161922]/90 via-[#111319]/90 to-[#060913] shadow-xl'
                : 'border-stone-200 bg-white/95 shadow-lg'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column: Brand Mockup with Logo */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div
                  className={`rounded-2xl border p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 ${
                    isDark
                      ? 'border-[#38BDF8]/30 bg-[#0D0F14]'
                      : 'border-stone-200 bg-[#F3F6FA]'
                  }`}
                >
                  <div className="p-3 rounded-2xl bg-black/30 dark:bg-white/[0.04] border border-black/10 dark:border-white/10">
                    <ClickNCreateLogo size="lg" />
                  </div>
                  <div className="space-y-1">
                    <span className={`text-xs font-mono uppercase font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                      Official Brand & Digital System
                    </span>
                    <p className="text-xs text-zinc-500 font-mono">
                      Custom Geometric Typography, Vector Logos & Live Cost Estimator
                    </p>
                  </div>

                  <div className="w-full pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>Founder & Creator</span>
                    <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>clickncreate.co.uk</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Platform Info */}
              <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border ${
                      isDark ? 'bg-[#38BDF8]/15 border-[#38BDF8]/30 text-[#BAE6FD]' : 'bg-[#F3E9DC] border-[#1D4ED8]/35 text-[#1E40AF]'
                    }`}>
                      FLAGSHIP PLATFORM & BRAND
                    </span>
                  </div>

                  <h3 className={`text-2xl sm:text-3xl font-black font-display tracking-tight leading-tight break-words ${
                    isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                  }`}>
                    {clickNCreateProject.title}
                  </h3>

                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    {clickNCreateProject.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {clickNCreateProject.achievements.map((ach, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                      <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>{ach}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {clickNCreateProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-mono px-3 py-1 rounded-lg border ${
                        isDark ? 'bg-white/5 border-white/10 text-[#94A3B8]' : 'bg-[#F3F6FA] border-stone-200 text-[#0F172A]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
