import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  Cpu,
  Globe2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Eye,
  X,
  Languages,
  Award,
  ArrowUpRight,
  UserCheck,
  Camera,
  Upload,
  Printer,
  ShieldCheck,
  ShoppingCart,
  Palette,
  Terminal,
} from 'lucide-react';
import { SAAD_PORTFOLIO, PortfolioProject, SkillCategory } from '../data/portfolio.ts';
import { ClickNCreateLogo } from '../components/ClickNCreateLogo.tsx';
import { generateCvPdf } from '../utils/cvPdfGenerator.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { SEOHead } from '../components/SEOHead.tsx';

interface PortfolioPageProps {
  onNavigate: (path: string) => void;
}

// Project visual card helper that never breaks
const ProjectVisualCard: React.FC<{ projectId: string; title: string; category: string; liveUrl?: string }> = ({
  projectId,
  title,
  category,
  liveUrl,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (projectId === 'owais-academic-portfolio') {
    return (
      <div
        className={`w-full aspect-video rounded-2xl border p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all group ${
          isDark
            ? 'border-cyan-500/30 bg-gradient-to-br from-[#0b0c1e] via-[#080916] to-[#04040a] shadow-[0_15px_35px_rgba(0,240,255,0.15)]'
            : 'border-cyan-300 bg-gradient-to-br from-cyan-50 via-white to-sky-50 shadow-md'
        }`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-35 pointer-events-none bg-[#00F0FF]" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none bg-indigo-500" />

        {/* Browser Top Window Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-xs" />
            <div className="ml-2 px-2.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-mono text-[10px] text-cyan-600 dark:text-cyan-300 flex items-center gap-1.5">
              <span className="opacity-60">https://</span>
              <span className="font-bold">owaisdashboard.vercel.app</span>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE CLIENT WORK</span>
          </span>
        </div>

        {/* Dashboard Preview Cards Layout (Clean, without OD logo) */}
        <div className="my-auto py-2 relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-black text-sm sm:text-base leading-tight">
                  Owais <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-indigo-400">Portfolio & Dashboard</span>
                </h4>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  Academic Trajectory & Technical Skills
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] font-mono text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Academic Records</span>
            </div>
          </div>

          {/* Mini Dashboard Widget Pills */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
            <div className="p-2 rounded-xl border border-cyan-500/25 bg-cyan-500/5 text-cyan-400 flex flex-col justify-between">
              <span className="text-zinc-400 text-[9px] uppercase">Education</span>
              <span className="font-bold truncate">Academic Record</span>
            </div>
            <div className="p-2 rounded-xl border border-indigo-500/25 bg-indigo-500/5 text-indigo-300 flex flex-col justify-between">
              <span className="text-zinc-400 text-[9px] uppercase">Skills Matrix</span>
              <span className="font-bold truncate">Tech & Soft Skills</span>
            </div>
            <div className="p-2 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 flex flex-col justify-between">
              <span className="text-zinc-400 text-[9px] uppercase">Hosting</span>
              <span className="font-bold truncate">Vercel Edge</span>
            </div>
          </div>
        </div>

        {/* Footer Bar with Live Site Link */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-black/10 dark:border-white/10 pt-2 relative z-10">
          <span className="flex items-center gap-1.5 text-cyan-500 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Built & Delivered by Saad M</span>
          </span>
          <a
            href="https://owaisdashboard.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-bold text-[#00F0FF] hover:underline"
          >
            <span>owaisdashboard.vercel.app</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  if (projectId === 'click-n-create-platform') {
    return (
      <div
        className={`w-full aspect-video rounded-2xl border p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all group ${
          isDark
            ? 'border-cyan-500/30 bg-gradient-to-br from-[#0c0d1e] via-[#070714] to-black shadow-[0_15px_35px_rgba(0,240,255,0.15)]'
            : 'border-cyan-300 bg-gradient-to-br from-cyan-50 via-white to-sky-50 shadow-md'
        }`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-35 pointer-events-none bg-[#00F0FF]" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none bg-purple-500" />

        {/* Top Window Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-xs" />
            <div className="ml-2 px-2.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-mono text-[10px] text-cyan-600 dark:text-cyan-300 flex items-center gap-1.5">
              <span className="opacity-60">https://</span>
              <span className="font-bold">clickncreate.co.uk</span>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-[#00F0FF] font-bold">
            FLAGSHIP PLATFORM
          </span>
        </div>

        {/* Middle Brand Showcase with Click N Create Logo */}
        <div className="my-auto py-3 relative z-10 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-2 rounded-2xl bg-black/40 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 backdrop-blur-md">
            <ClickNCreateLogo size="md" />
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Freelance Web Development & Custom Estimator
          </p>
        </div>

        {/* Bottom Status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-black/10 dark:border-white/10 pt-2 relative z-10">
          <span className="flex items-center gap-1.5 text-cyan-500 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Founder & Lead Developer · Saad M</span>
          </span>
          <span className="text-[#00F0FF] font-bold">clickncreate.co.uk</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full aspect-video rounded-2xl border p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
        isDark
          ? 'border-white/10 bg-gradient-to-br from-[#0c0d1c] via-[#070712] to-black'
          : 'border-zinc-200 bg-gradient-to-br from-cyan-50/60 via-white to-zinc-50'
      }`}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none bg-[#00F0FF]" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF]">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            {category}
          </span>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 bg-white/5 text-zinc-400">
          PROD 2026
        </span>
      </div>

      <div className="space-y-1 relative z-10 my-auto py-2">
        <div className="text-xs font-mono text-[#00F0FF]">// {projectId}</div>
        <div className="text-lg font-bold font-display leading-snug">{title}</div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-black/10 dark:border-white/10 pt-2 relative z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Architecture</span>
        </span>
        <span className="text-xs">Saad M</span>
      </div>
    </div>
  );
};

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'projects' | 'resume' | 'skills'>('projects');
  const [showCvModal, setShowCvModal] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      generateCvPdf();
    } catch (e) {
      console.error('PDF generation error', e);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  return (
    <div className="pt-28 pb-24 md:pt-36 relative overflow-x-hidden w-full max-w-full">
      <SEOHead
        title="Portfolio & CV Resume · Saad M | Click N Create Web Developer"
        description="Explore Saad M's freelance web development portfolio, Click N Create platform architecture, verified credentials, tech skills matrix, and official downloadable CV PDF."
        canonicalPath="/portfolio"
        keywords={[
          'Saad M portfolio',
          'freelance web developer portfolio',
          'download CV PDF web developer',
          'Click N Create projects',
          'React developer resume',
          'front end developer portfolio'
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===================== HERO PROFILE BANNER ===================== */}
        <div
          className={`rounded-3xl border p-6 sm:p-10 md:p-12 mb-12 relative overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
            isDark
              ? 'border-white/10 bg-[#0A0A16]/90 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
              : 'border-zinc-200 bg-white/95 shadow-xl'
          }`}
        >
          {/* Subtle neon gradient ambient background */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[140px] pointer-events-none bg-[#00F0FF]/15" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-[130px] pointer-events-none bg-[#A855F7]/10" />

          <div className="relative z-10 max-w-4xl space-y-6">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-3 ${
                  isDark
                    ? 'border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF]'
                    : 'border-cyan-400 bg-cyan-50 text-cyan-800 font-semibold'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official Portfolio & Verified Credentials</span>
              </div>

              <h1
                className={`text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.1] ${
                  isDark ? 'text-white' : 'text-zinc-950'
                }`}
              >
                SAAD M
              </h1>

              <p className="text-base sm:text-xl font-medium text-[#00F0FF] mt-1.5 font-mono">
                {SAAD_PORTFOLIO.title}
              </p>

              <p
                className={`mt-4 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl ${
                  isDark ? 'text-zinc-300' : 'text-zinc-600'
                }`}
              >
                {SAAD_PORTFOLIO.tagline}
              </p>
            </div>

            {/* Contact Meta Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                  isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>{SAAD_PORTFOLIO.location}</span>
              </div>

              <a
                href={`mailto:${SAAD_PORTFOLIO.email}`}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  isDark
                    ? 'border-white/10 bg-white/5 hover:border-[#00F0FF]/40 text-zinc-300'
                    : 'border-zinc-200 bg-zinc-50 hover:border-cyan-400 text-zinc-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>{SAAD_PORTFOLIO.email}</span>
              </a>

              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                  isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>{SAAD_PORTFOLIO.phone} / {SAAD_PORTFOLIO.ukPhone}</span>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                  isDark
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open for Worldwide Projects</span>
              </div>
            </div>

            {/* Action Buttons (Download CV, View Original, WhatsApp) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* 1. PDF Download Button */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#00F0FF] hover:bg-[#38bdf8] text-black shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Creating PDF...' : 'Download CV (PDF)'}</span>
              </button>

              {/* 2. View Original CV Document Modal */}
              <button
                type="button"
                onClick={() => setShowCvModal(true)}
                className={`px-5 py-3.5 rounded-xl border font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  isDark
                    ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 shadow-2xs'
                }`}
              >
                <FileText className="w-4 h-4 text-[#00F0FF]" />
                <span>View Full CV Document</span>
              </button>

              {/* 3. WhatsApp Direct Chat */}
              <a
                href={SAAD_PORTFOLIO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Saad</span>
              </a>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION TABS ===================== */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : isDark
                ? 'text-zinc-400 hover:text-white bg-white/5'
                : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Featured Projects</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'resume'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : isDark
                ? 'text-zinc-400 hover:text-white bg-white/5'
                : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Curriculum Vitae</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : isDark
                ? 'text-zinc-400 hover:text-white bg-white/5'
                : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Skills & Engineering</span>
          </button>
        </div>

        {/* ===================== TAB 1: FEATURED PROJECTS ===================== */}
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SAAD_PORTFOLIO.projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`rounded-3xl border overflow-hidden p-6 sm:p-8 flex flex-col justify-between transition-all group ${
                    isDark
                      ? 'border-white/10 bg-[#0A0A16]/80 hover:border-[#00F0FF]/40'
                      : 'border-zinc-200 bg-white hover:border-cyan-400 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Reliable, Never-Broken Interactive Visual */}
                    <ProjectVisualCard
                      projectId={proj.id}
                      title={proj.title}
                      category={proj.category}
                      liveUrl={proj.liveUrl}
                    />

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider font-bold">
                        {proj.category}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        {proj.timeline}
                      </span>
                    </div>

                    <h3
                      className={`text-xl sm:text-2xl font-bold font-display ${
                        isDark ? 'text-white' : 'text-zinc-950'
                      }`}
                    >
                      {proj.title}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-zinc-400' : 'text-zinc-600'
                      }`}
                    >
                      {proj.description}
                    </p>

                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-mono uppercase text-zinc-400 block font-semibold">
                        Key Accomplishments:
                      </span>
                      <ul className="space-y-1 text-xs">
                        {proj.achievements.map((ach, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                              {ach}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-black/[0.08] dark:border-white/[0.08] mt-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isDark
                              ? 'bg-white/5 text-zinc-300'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00F0FF] hover:underline"
                      >
                        <span>Visit Site</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===================== TAB 2: FULL CV RESUME DETAILS ===================== */}
        {activeTab === 'resume' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* Top CV Action Bar */}
            <div
              className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
              }`}
            >
              <div>
                <h3 className="font-display font-bold text-lg">Curriculum Vitae Credentials</h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Imported directly from official CV Resume · Saad M
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="px-4 py-2.5 rounded-xl bg-[#00F0FF] text-black font-mono font-bold text-xs flex items-center gap-2 hover:bg-cyan-300 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CV (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCvModal(true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 cursor-pointer ${
                    isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>View Printable CV</span>
                </button>
              </div>
            </div>

            {/* Structured CV View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Education, Languages & Personal Info */}
              <div className="lg:col-span-4 space-y-6">
                {/* Education Card */}
                <div
                  className={`p-6 rounded-3xl border space-y-4 ${
                    isDark ? 'border-white/10 bg-[#0A0A16]/80' : 'border-zinc-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#00F0FF]">
                    <GraduationCap className="w-5 h-5" />
                    <h4 className="font-display font-bold text-base uppercase tracking-wider">
                      Education
                    </h4>
                  </div>

                  {SAAD_PORTFOLIO.education.map((edu, idx) => (
                    <div key={idx} className="space-y-1.5 border-l-2 border-[#00F0FF] pl-4">
                      <span className="text-[10px] font-mono text-[#00F0FF] font-bold">
                        {edu.timeline}
                      </span>
                      <h5 className="font-bold text-sm">{edu.degree}</h5>
                      <div className="text-xs font-semibold text-zinc-400">
                        {edu.field}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {edu.institution}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {edu.location}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Languages Card */}
                <div
                  className={`p-6 rounded-3xl border space-y-4 ${
                    isDark ? 'border-white/10 bg-[#0A0A16]/80' : 'border-zinc-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#00F0FF]">
                    <Languages className="w-5 h-5" />
                    <h4 className="font-display font-bold text-base uppercase tracking-wider">
                      Languages
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {SAAD_PORTFOLIO.languages.map((lang, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span className="font-bold">{lang.name}</span>
                        </div>
                        <span className="text-zinc-500">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div
                  className={`p-6 rounded-3xl border space-y-3 font-mono text-xs ${
                    isDark ? 'border-white/10 bg-[#0A0A16]/80' : 'border-zinc-200 bg-white shadow-xs'
                  }`}
                >
                  <h4 className="font-display font-bold text-sm text-[#00F0FF] uppercase mb-2">
                    Contact Details
                  </h4>
                  <div className="text-zinc-400">
                    <span className="text-zinc-500 block text-[10px]">EMAIL:</span>
                    <a href={`mailto:${SAAD_PORTFOLIO.email}`} className="hover:text-[#00F0FF]">
                      {SAAD_PORTFOLIO.email}
                    </a>
                  </div>
                  <div className="text-zinc-400">
                    <span className="text-zinc-500 block text-[10px]">PHONE (INDIA):</span>
                    <span>{SAAD_PORTFOLIO.phone}</span>
                  </div>
                  <div className="text-zinc-400">
                    <span className="text-zinc-500 block text-[10px]">PHONE / WHATSAPP (UK):</span>
                    <span>{SAAD_PORTFOLIO.ukPhone}</span>
                  </div>
                  <div className="text-zinc-400">
                    <span className="text-zinc-500 block text-[10px]">LOCATION:</span>
                    <span>{SAAD_PORTFOLIO.location}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: About Me, Experience & Internship */}
              <div className="lg:col-span-8 space-y-6">
                {/* About Me Section */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl border space-y-3 ${
                    isDark ? 'border-white/10 bg-[#0A0A16]/80' : 'border-zinc-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#00F0FF] mb-2">
                    <UserCheck className="w-5 h-5" />
                    <h4 className="font-display font-bold text-base uppercase tracking-wider">
                      About Me
                    </h4>
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isDark ? 'text-zinc-300' : 'text-zinc-700'
                    }`}
                  >
                    {SAAD_PORTFOLIO.aboutBio}
                  </p>
                </div>

                {/* Dedicated Key Projects Section in CV */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
                    isDark ? 'border-white/10 bg-[#0A0A16]/80' : 'border-zinc-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.08] dark:border-white/[0.08]">
                    <div className="flex items-center gap-2 text-[#00F0FF]">
                      <Code2 className="w-5 h-5" />
                      <h4 className="font-display font-bold text-base uppercase tracking-wider">
                        Key Projects & Deliveries
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      2 Verified Works
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Project 1: Owais Academic Portfolio */}
                    <div className="border-l-2 border-[#00F0FF] pl-4 sm:pl-6 space-y-2 relative">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-base sm:text-lg">
                            Owais Portfolio & Academic Dashboard
                          </h5>
                          <span className="text-xs font-mono text-[#00F0FF]">
                            Client Project · Live on Vercel
                          </span>
                        </div>
                        <a
                          href="https://owaisdashboard.vercel.app"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline"
                        >
                          <span>owaisdashboard.vercel.app</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Comprehensive personal portfolio and interactive student dashboard built for client Owais to showcase his entire academic background, qualifications, and skill proficiency.
                      </p>

                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2">
                          <span className="text-[#00F0FF] font-bold">•</span>
                          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                            Engineered complete academic records, degree trajectory, and interactive technical & soft skills matrix.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#00F0FF] font-bold">•</span>
                          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                            Deployed live on Vercel edge infrastructure with sub-second page loads and mobile-responsive layout.
                          </span>
                        </li>
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['React / Next.js', 'Tailwind CSS', 'Vercel Edge', 'Academic Dashboard', 'Client Delivery'].map((t, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isDark ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'bg-cyan-50 text-cyan-800'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project 2: Click N Create */}
                    <div className="border-l-2 border-indigo-500 pl-4 sm:pl-6 space-y-2 relative">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-base sm:text-lg">
                            Click N Create Web Platform & Brand System
                          </h5>
                          <span className="text-xs font-mono text-indigo-400">
                            Flagship Freelance Platform
                          </span>
                        </div>
                        <a
                          href="https://clickncreate.co.uk"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-indigo-400 hover:underline"
                        >
                          <span>clickncreate.co.uk</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        The official digital freelance platform featuring custom geometric vector logo, real-time cost estimator, dark/light theme engine, and direct client quotation pipeline.
                      </p>

                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                            Engineered dynamic instant cost calculator with £35/hr and fixed milestone breakdown.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                            Designed complete brand identity, typography wordmark, and multi-device responsive UI.
                          </span>
                        </li>
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['React 19', 'TypeScript', 'Tailwind CSS', 'Vector Logo', 'Interactive Estimator'].map((t, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isDark ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-800'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience & Internship Section */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
                    isDark ? 'border-white/10 bg-[#0A0A16]/80' : 'border-zinc-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#00F0FF] mb-2">
                    <Briefcase className="w-5 h-5" />
                    <h4 className="font-display font-bold text-base uppercase tracking-wider">
                      Experience & Internships
                    </h4>
                  </div>

                  <div className="space-y-6">
                    {SAAD_PORTFOLIO.experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className="border-l-2 border-[#00F0FF] pl-4 sm:pl-6 space-y-2 relative"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="font-bold text-base sm:text-lg">
                            {exp.role} <span className="text-[#00F0FF]">@ {exp.company}</span>
                          </h5>
                          <span className="text-xs font-mono text-zinc-500">
                            {exp.timeline}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 font-mono">
                          {exp.type}
                        </p>

                        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {exp.description}
                        </p>

                        <ul className="space-y-1.5 pt-1 text-xs">
                          {exp.keyResponsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <span className="text-[#00F0FF] font-bold">•</span>
                              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                                {resp}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                isDark ? 'bg-white/5 text-[#00F0FF]' : 'bg-cyan-50 text-cyan-800'
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===================== TAB 3: TECHNICAL SKILLS MATRIX ===================== */}
        {activeTab === 'skills' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SAAD_PORTFOLIO.skillCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className={`p-6 sm:p-8 rounded-3xl border space-y-5 ${
                    isDark ? 'border-white/10 bg-[#0A0A16]/80' : 'border-zinc-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
                    <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#00F0FF]" />
                      <span>{cat.title}</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {cat.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold">{skill.name}</span>
                          <span className="font-mono text-[#00F0FF]">{skill.level}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#A855F7]"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>

                        {skill.note && (
                          <p className="text-[11px] text-zinc-500 font-mono">
                            {skill.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===================== FINAL CALL TO ACTION ===================== */}
        <div
          className={`mt-16 p-8 sm:p-12 rounded-3xl border text-center space-y-5 relative overflow-hidden ${
            isDark
              ? 'border-white/15 bg-gradient-to-b from-[#0A0A16] to-black shadow-2xl'
              : 'border-zinc-200 bg-gradient-to-b from-white to-zinc-50 shadow-md'
          }`}
        >
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider font-bold block">
            [ READY TO WORK TOGETHER? ]
          </span>

          <h2
            className={`text-2xl sm:text-4xl font-black font-display tracking-tight max-w-xl mx-auto ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}
          >
            LET'S BRING YOUR VISION TO LIFE.
          </h2>

          <p className={`text-xs sm:text-sm max-w-lg mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Whether you need a custom website, an e-commerce shop, or electronics engineering consultation, I am ready to collaborate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#00F0FF] hover:bg-[#38bdf8] text-black shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/estimator')}
              className={`px-5 py-3.5 rounded-xl border font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-zinc-300 hover:bg-zinc-100 text-zinc-900'
              }`}
            >
              <span>Instant Cost Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== FULL AUTHENTIC DIGITAL CV RESUME MODAL (FULL WHITE ONLY) ===================== */}
      <AnimatePresence>
        {showCvModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full max-h-[92vh] rounded-3xl border border-zinc-200 bg-white text-zinc-950 overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Top Bar (Full White with Clean Border) */}
              <div className="px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-zinc-950 block leading-tight">
                      Official Curriculum Vitae · Saad M
                    </span>
                    <span className="text-[11px] font-mono text-cyan-800">
                      Click N Create · Verified Credentials
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-mono text-xs font-medium flex items-center gap-1.5 cursor-pointer hidden sm:flex transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCvModal(false)}
                    aria-label="Close CV preview"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Full White Printable CV Document Body (Edge to Edge Seamless White) */}
              <div className="overflow-y-auto p-6 sm:p-10 bg-white text-zinc-900 font-sans text-xs space-y-6">
                {/* CV Header */}
                <div className="border-b-2 border-zinc-200 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-zinc-950">
                      SAAD M
                    </h1>
                    <div className="text-cyan-800 font-bold text-sm sm:text-base mt-0.5">
                      Electronics & Communication Engineer | Web Developer
                    </div>
                    <div className="text-xs text-zinc-600 mt-2 flex flex-wrap gap-2 font-mono">
                      <span>Bharuch, Gujarat, India</span>
                      <span>•</span>
                      <a href="mailto:Mansurisaad28012@gmail.com" className="text-cyan-800 hover:underline">
                        Mansurisaad28012@gmail.com
                      </a>
                      <span>•</span>
                      <span>+91 9265129400</span>
                      <span>•</span>
                      <span>+44 7927 548123</span>
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-zinc-950 text-[#00F0FF] flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-md">
                    SM
                  </div>
                </div>

                {/* Two-Column Resume Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 pt-2">
                  {/* Left Column: Education, Skills, Languages */}
                  <div className="sm:col-span-5 space-y-6 border-r-0 sm:border-r border-zinc-200 pr-0 sm:pr-6">
                    {/* Education */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Education</span>
                      </h4>
                      <div className="pt-1">
                        <div className="font-bold text-zinc-950 text-xs">
                          BE Electronics & Communication Engineering
                        </div>
                        <div className="text-[11px] text-zinc-600 font-medium">
                          Government Engineering College, Bharuch
                        </div>
                        <div className="text-[10px] text-cyan-800 font-mono font-bold mt-0.5">
                          2023 – 2027
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Skills & Capabilities</span>
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-zinc-800 pt-1">
                        <li>• Web Development (WordPress, Shopify, React)</li>
                        <li>• E-commerce Setup & Website Optimization</li>
                        <li>• Google Ads, SEO & UI/UX Basics</li>
                        <li>• Analog & Digital Signal Conversion</li>
                        <li>• Communication Systems Fundamentals</li>
                        <li>• Satellite & Wireless Communication</li>
                        <li>• Microsoft Office (Word, Excel, PowerPoint)</li>
                        <li>• Proficiency in AI Tools & Workflows</li>
                        <li>• Social Media Design & Brand Identity</li>
                      </ul>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Languages</span>
                      </h4>
                      <div className="space-y-1 text-[11px] text-zinc-800 pt-1">
                        <div>• <strong>English:</strong> Professional Working Proficiency</div>
                        <div>• <strong>Hindi:</strong> Fluent / Native</div>
                        <div>• <strong>Gujarati:</strong> Native</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: About Me, Projects, Experience, Internship */}
                  <div className="sm:col-span-7 space-y-5">
                    {/* About Me */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-cyan-700" />
                        <span>About Me</span>
                      </h4>
                      <p className="text-[11px] text-zinc-700 leading-relaxed pt-0.5">
                        Motivated and enthusiastic Electronics & Communication Engineering student with a strong interest in communication technologies, satellite communication, wireless systems, and modern web development. Experienced in developing web applications using WordPress with PHP and CSS customization, React, and responsive UI layouts. Proficient in AI tools for productivity, technical research, and innovative problem-solving.
                      </p>
                    </div>

                    {/* Dedicated Key Projects Section */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-cyan-700" />
                          <span>Key Projects & Web Deliveries</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">2 Verified Works</span>
                      </h4>

                      <div className="space-y-2 pt-0.5">
                        {/* Project 1: Owais Dashboard */}
                        <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 text-[11px]">
                              Owais Portfolio & Academic Dashboard
                            </span>
                            <a
                              href="https://owaisdashboard.vercel.app"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-cyan-700 hover:underline font-bold"
                            >
                              owaisdashboard.vercel.app ↗
                            </a>
                          </div>
                          <div className="text-[10px] text-cyan-800 font-mono">
                            Client Delivery · Academic Portfolio & Trajectory Dashboard (Vercel)
                          </div>
                          <p className="text-[10.5px] text-zinc-700 leading-tight">
                            • Designed and deployed comprehensive student portfolio featuring verified academic records, degree milestones, and interactive technical & soft skills matrix with sub-second responsive performance.
                          </p>
                        </div>

                        {/* Project 2: Click N Create */}
                        <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 text-[11px]">
                              Click N Create Web Platform & Brand System
                            </span>
                            <a
                              href="https://clickncreate.co.uk"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-cyan-700 hover:underline font-bold"
                            >
                              clickncreate.co.uk ↗
                            </a>
                          </div>
                          <div className="text-[10px] text-cyan-800 font-mono">
                            Flagship Freelance Platform & Vector Brand Identity
                          </div>
                          <p className="text-[10.5px] text-zinc-700 leading-tight">
                            • Built full-stack freelance website featuring custom geometric vector logo, real-time cost estimator (£35/hr & fixed packages), dark/light theme engine, and direct WhatsApp quote automation.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Experience</span>
                      </h4>
                      <div className="space-y-1 pt-0.5">
                        <div className="font-bold text-zinc-950 text-xs">
                          Click N Create – clickncreate.co.uk
                        </div>
                        <div className="text-[10px] text-cyan-800 font-mono font-bold">
                          Lead Web Developer & Founder (2024 – Present)
                        </div>
                        <ul className="space-y-1 text-[10.5px] text-zinc-700 list-disc pl-4 pt-0.5">
                          <li>Designed and developed freelance web development website using WordPress, PHP, and modern CSS/React.</li>
                          <li>Configured web hosting, domain DNS, and website security protocols.</li>
                          <li>Created responsive pages tested across desktop and mobile devices.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Internship */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Internship</span>
                      </h4>
                      <div className="space-y-0.5 pt-0.5">
                        <div className="font-bold text-zinc-950 text-xs">
                          Spoken Tutorial Project – IIT Bombay
                        </div>
                        <p className="text-[10.5px] text-zinc-700 leading-relaxed">
                          Electronic Circuit Simulation using <strong>eSim</strong> & <strong>CircuitJS</strong>. Analyzed circuit behavior, signal conversion, and frequency waveforms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Footer */}
                <div className="border-t-2 border-zinc-200 pt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Official Curriculum Vitae · Saad M</span>
                  <span>Click N Create · clickncreate.co.uk</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
