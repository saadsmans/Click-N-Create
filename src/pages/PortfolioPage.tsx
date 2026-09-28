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
import { generateCvPdf } from '../utils/cvPdfGenerator.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { SITE_CONFIG } from '../data/site.ts';

interface PortfolioPageProps {
  onNavigate: (path: string) => void;
}

// Project visual card helper that never breaks
const ProjectVisualCard: React.FC<{ projectId: string; title: string; category: string }> = ({
  projectId,
  title,
  category,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
          {projectId === 'click-n-create-platform' && (
            <div className="p-2 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF]">
              <Code2 className="w-5 h-5" />
            </div>
          )}
          {projectId === 'click-n-create-brand-identity' && (
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
          )}
          {projectId === 'click-n-create-infrastructure' && (
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
          )}
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
    <div className="pt-28 pb-24 md:pt-36">
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

              {/* 4th Card: Your Next Project Slot */}
              <div
                className={`rounded-3xl border-2 border-dashed p-6 sm:p-8 flex flex-col justify-between transition-all group ${
                  isDark
                    ? 'border-[#00F0FF]/30 bg-[#0A0A16]/50 hover:border-[#00F0FF] hover:bg-[#00F0FF]/[0.03]'
                    : 'border-cyan-400 bg-cyan-50/40 hover:border-cyan-600 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div
                    className={`w-full aspect-video rounded-2xl border p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
                      isDark
                        ? 'border-white/10 bg-gradient-to-br from-[#0e1026] via-[#090818] to-black'
                        : 'border-zinc-200 bg-gradient-to-br from-cyan-50 via-white to-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider font-bold">
                          Next Slot Available
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                        OPEN FOR HIRE
                      </span>
                    </div>

                    <div className="space-y-1 my-auto">
                      <div className="text-xs font-mono text-[#00F0FF]">// your-next-project</div>
                      <div className="text-xl font-bold font-display leading-tight">
                        Your Custom Website or Brand
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-black/10 dark:border-white/10 pt-2">
                      <span className="text-emerald-400">Standard Rate: £35 / Hour</span>
                      <span>1 – 3 Wks Turnaround</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      Bespoke Freelance Engineering
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      2026 Season
                    </span>
                  </div>

                  <h3
                    className={`text-xl sm:text-2xl font-bold font-display ${
                      isDark ? 'text-white' : 'text-zinc-950'
                    }`}
                  >
                    Have a Website, App or Brand in Mind?
                  </h3>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    Work directly with Saad M. Fast turnaround, clean code, transparent pricing, and zero middle-agency overhead.
                  </p>
                </div>

                <div className="pt-6 border-t border-black/[0.08] dark:border-white/[0.08] mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('/estimator')}
                    className="px-4 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <span>Calculate Instant Quote</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/contact')}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                      isDark
                        ? 'border-white/20 hover:bg-white/10 text-white'
                        : 'border-zinc-300 hover:bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    <span>Get in Touch</span>
                  </button>
                </div>
              </div>
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

                  {/* Right Column: About Me, Experience, Internship */}
                  <div className="sm:col-span-7 space-y-6">
                    {/* About Me */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-cyan-700" />
                        <span>About Me</span>
                      </h4>
                      <p className="text-[11px] text-zinc-700 leading-relaxed pt-1">
                        Motivated and enthusiastic Electronics & Communication Engineering student with a strong interest in communication technologies, satellite communication, wireless systems, and modern web development. Experienced in building full freelance websites (Click N Create) using WordPress with PHP and CSS customization, React, and responsive layouts. Proficient in AI tools for productivity, research, and innovative problem-solving.
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Experience</span>
                      </h4>
                      <div className="space-y-1.5 pt-1">
                        <div className="font-bold text-zinc-950 text-xs">
                          Click N Create – clickncreate.co.uk
                        </div>
                        <div className="text-[10px] text-cyan-800 font-mono font-bold">
                          Lead Web Developer & Founder (2024 – Present)
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-zinc-700 list-disc pl-4 pt-1">
                          <li>Designed and developed freelance web development website using WordPress, PHP, and modern CSS.</li>
                          <li>Configured web hosting, domain DNS, and website security protocols.</li>
                          <li>Created responsive pages tested across desktop and mobile devices.</li>
                          <li>Implemented plugin management, speed optimization, and SEO practices.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Internship */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Internship</span>
                      </h4>
                      <div className="space-y-1 pt-1">
                        <div className="font-bold text-zinc-950 text-xs">
                          Spoken Tutorial Project – IIT Bombay
                        </div>
                        <p className="text-[11px] text-zinc-700 leading-relaxed">
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
