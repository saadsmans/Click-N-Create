import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  Cpu,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Eye,
  X,
  Languages,
  Award,
  ArrowUpRight,
  UserCheck,
  Printer,
} from 'lucide-react';
import { SAAD_PORTFOLIO } from '../data/portfolio.ts';
import { ClickNCreateLogo } from '../components/ClickNCreateLogo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { SEOHead } from '../components/SEOHead.tsx';

const InteractivePortfolioAvatar3D = React.lazy(() =>
  import('../components/InteractivePortfolioAvatar3D.tsx').then((m) => ({
    default: m.InteractivePortfolioAvatar3D,
  }))
);

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
            ? 'border-[#2B303D] bg-gradient-to-br from-[#161922] via-[#12151C] to-[#0D0F14] shadow-[0_15px_35px_rgba(0,0,0,0.45)]'
            : 'border-[#E6E2D8] bg-gradient-to-br from-[#FBF9F5] via-white to-[#F4F0E7] shadow-sm'
        }`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none bg-[#38BDF8]" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-15 pointer-events-none bg-[#10B981]" />

        {/* Browser Top Window Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/85 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/85 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/85 shadow-xs" />
            <div className={`ml-2 px-2.5 py-0.5 rounded-md font-mono text-[10px] flex items-center gap-1.5 ${
              isDark ? 'bg-white/10 text-[#BAE6FD]' : 'bg-[#F3E9DC] text-[#1E40AF]'
            }`}>
              <span className="opacity-65">https://</span>
              <span className="font-bold">owaisdashboard.vercel.app</span>
            </div>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold flex items-center gap-1.5 ${
            isDark
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : 'border-emerald-600/30 bg-emerald-50 text-emerald-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>LIVE CLIENT WORK</span>
          </span>
        </div>

        {/* Dashboard Preview Cards Layout */}
        <div className="my-auto py-2 relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${
                isDark
                  ? 'bg-[#38BDF8]/15 border-[#38BDF8]/35 text-[#BAE6FD]'
                  : 'bg-[#F3E9DC] border-[#38BDF8]/40 text-[#1D4ED8]'
              }`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-display font-black text-sm sm:text-base leading-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                  Owais <span className={isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}>Portfolio &amp; Dashboard</span>
                </h4>
                <span className={`text-[10px] font-mono block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Academic Trajectory &amp; Technical Skills
                </span>
              </div>
            </div>

            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono ${
              isDark ? 'border-white/10 bg-white/5 text-[#94A3B8]' : 'border-[#E6E2D8] bg-[#F3F6FA] text-[#475569]'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
              <span>Full Academic Records</span>
            </div>
          </div>

          {/* Mini Dashboard Widgets */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDark ? 'border-[#38BDF8]/25 bg-[#38BDF8]/5 text-[#BAE6FD]' : 'border-[#38BDF8]/30 bg-[#FBF7F1] text-[#1E40AF]'
            }`}>
              <span className={`text-[9px] uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Education</span>
              <span className="font-bold truncate">Academic Record</span>
            </div>
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDark ? 'border-white/10 bg-white/5 text-[#F1F5F9]' : 'border-[#E6E2D8] bg-[#F3F6FA] text-[#0F172A]'
            }`}>
              <span className={`text-[9px] uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Skills Matrix</span>
              <span className="font-bold truncate">Tech &amp; Soft Skills</span>
            </div>
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDark ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400' : 'border-emerald-600/25 bg-emerald-50 text-emerald-700'
            }`}>
              <span className={`text-[9px] uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Hosting</span>
              <span className="font-bold truncate">Vercel Edge</span>
            </div>
          </div>
        </div>

        {/* Footer Bar with Live Site Link */}
        <div className={`flex items-center justify-between text-[11px] font-mono border-t pt-2 relative z-10 ${
          isDark ? 'border-white/10 text-[#94A3B8]' : 'border-black/10 text-[#475569]'
        }`}>
          <span className={`flex items-center gap-1.5 font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Built &amp; Delivered by Saad M</span>
          </span>
          <a
            href="https://owaisdashboard.vercel.app"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-1 font-bold hover:underline ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}
          >
            <span>owaisdashboard.vercel.app</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  if (projectId === 'hammad-patel-portfolio') {
    return (
      <div
        className={`w-full aspect-video rounded-2xl border p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all group ${
          isDark
            ? 'border-[#2B303D] bg-gradient-to-br from-[#171923] via-[#12151C] to-[#0D0F14] shadow-[0_15px_35px_rgba(0,0,0,0.45)]'
            : 'border-[#E6E2D8] bg-gradient-to-br from-[#FBF9F5] via-white to-[#F4F0E7] shadow-sm'
        }`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none bg-[#38BDF8]" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-15 pointer-events-none bg-[#0EA5E9]" />

        {/* Browser Top Window Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/85 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/85 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/85 shadow-xs" />
            <div className={`ml-2 px-2.5 py-0.5 rounded-md font-mono text-[10px] flex items-center gap-1.5 ${
              isDark ? 'bg-white/10 text-[#BAE6FD]' : 'bg-[#F3E9DC] text-[#1E40AF]'
            }`}>
              <span className="opacity-65">https://</span>
              <span className="font-bold">hammadpatel.vercel.app</span>
            </div>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold flex items-center gap-1.5 ${
            isDark
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : 'border-emerald-600/30 bg-emerald-50 text-emerald-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>LIVE CLIENT WORK</span>
          </span>
        </div>

        {/* Portfolio Preview Cards Layout */}
        <div className="my-auto py-2 relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${
                isDark
                  ? 'bg-[#38BDF8]/15 border-[#38BDF8]/35 text-[#BAE6FD]'
                  : 'bg-[#F3E9DC] border-[#38BDF8]/40 text-[#1D4ED8]'
              }`}>
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-display font-black text-sm sm:text-base leading-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                  Hammad Patel <span className={isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}>ECE Virtual Lab</span>
                </h4>
                <span className={`text-[10px] font-mono block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Interactive ECE Field Lab Studio &amp; Portfolio
                </span>
              </div>
            </div>

            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono ${
              isDark ? 'border-white/10 bg-white/5 text-[#94A3B8]' : 'border-[#E6E2D8] bg-[#F3F6FA] text-[#475569]'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
              <span>Full ECE Studies Lab</span>
            </div>
          </div>

          {/* Mini Portfolio Widgets */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDark ? 'border-[#38BDF8]/25 bg-[#38BDF8]/5 text-[#BAE6FD]' : 'border-[#38BDF8]/30 bg-[#FBF7F1] text-[#1E40AF]'
            }`}>
              <span className={`text-[9px] uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Virtual Lab</span>
              <span className="font-bold truncate">ECE Field Studio</span>
            </div>
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDark ? 'border-white/10 bg-white/5 text-[#F1F5F9]' : 'border-[#E6E2D8] bg-[#F3F6FA] text-[#0F172A]'
            }`}>
              <span className={`text-[9px] uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Coursework</span>
              <span className="font-bold truncate">All ECE Topics</span>
            </div>
            <div className={`p-2 rounded-xl border flex flex-col justify-between ${
              isDark ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400' : 'border-emerald-600/25 bg-emerald-50 text-emerald-700'
            }`}>
              <span className={`text-[9px] uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Hosting</span>
              <span className="font-bold truncate">Vercel Edge</span>
            </div>
          </div>
        </div>

        {/* Footer Bar with Live Site Link */}
        <div className={`flex items-center justify-between text-[11px] font-mono border-t pt-2 relative z-10 ${
          isDark ? 'border-white/10 text-[#94A3B8]' : 'border-black/10 text-[#475569]'
        }`}>
          <span className={`flex items-center gap-1.5 font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Built &amp; Delivered by Saad M</span>
          </span>
          <a
            href="https://hammadpatel.vercel.app"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-1 font-bold hover:underline ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}
          >
            <span>hammadpatel.vercel.app</span>
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
            ? 'border-[#2B303D] bg-gradient-to-br from-[#161922] via-[#12151C] to-[#0D0F14] shadow-[0_15px_35px_rgba(0,0,0,0.45)]'
            : 'border-[#E6E2D8] bg-gradient-to-br from-[#FBF9F5] via-white to-[#F4F0E7] shadow-sm'
        }`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none bg-[#38BDF8]" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-15 pointer-events-none bg-[#1D4ED8]" />

        {/* Top Window Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/85 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/85 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/85 shadow-xs" />
            <div className={`ml-2 px-2.5 py-0.5 rounded-md font-mono text-[10px] flex items-center gap-1.5 ${
              isDark ? 'bg-white/10 text-[#BAE6FD]' : 'bg-[#F3E9DC] text-[#1E40AF]'
            }`}>
              <span className="opacity-65">https://</span>
              <span className="font-bold">clickncreate.co.uk</span>
            </div>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${
            isDark
              ? 'border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#BAE6FD]'
              : 'border-[#1D4ED8]/35 bg-[#F3E9DC] text-[#1E40AF]'
          }`}>
            FLAGSHIP PLATFORM
          </span>
        </div>

        {/* Middle Brand Showcase with Click N Create Logo */}
        <div className="my-auto py-3 relative z-10 flex flex-col items-center justify-center text-center space-y-2">
          <div className={`p-2.5 rounded-2xl border ${
            isDark ? 'bg-[#0D0F14]/80 border-white/10' : 'bg-white/90 border-[#E6E2D8] shadow-xs'
          }`}>
            <ClickNCreateLogo size="md" />
          </div>
          <p className={`text-[11px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
            Freelance Web Development &amp; Custom Estimator
          </p>
        </div>

        {/* Bottom Status */}
        <div className={`flex items-center justify-between text-[11px] font-mono border-t pt-2 relative z-10 ${
          isDark ? 'border-white/10 text-[#94A3B8]' : 'border-black/10 text-[#475569]'
        }`}>
          <span className={`flex items-center gap-1.5 font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Founder &amp; Lead Developer · Saad M</span>
          </span>
          <span className={`font-bold ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>clickncreate.co.uk</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full aspect-video rounded-2xl border p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
        isDark
          ? 'border-[#2B303D] bg-gradient-to-br from-[#161922] via-[#12151C] to-[#0D0F14]'
          : 'border-[#E6E2D8] bg-gradient-to-br from-[#FBF9F5] via-white to-[#F4F0E7]'
      }`}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none bg-[#38BDF8]" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-[#38BDF8]/15 text-[#7DD3FC]' : 'bg-[#F3E9DC] text-[#1D4ED8]'}`}>
            <Code2 className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
            {category}
          </span>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
          isDark ? 'border-white/10 bg-white/5 text-[#94A3B8]' : 'border-[#E6E2D8] bg-[#F3F6FA] text-[#475569]'
        }`}>
          PROD 2026
        </span>
      </div>

      <div className="space-y-1 relative z-10 my-auto py-2">
        <div className={`text-lg font-bold font-display leading-snug ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{title}</div>
      </div>

      <div className={`flex items-center justify-between text-[11px] font-mono border-t pt-2 relative z-10 ${
        isDark ? 'border-white/10 text-[#94A3B8]' : 'border-black/10 text-[#475569]'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
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

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const { generateCvPdf } = await import('../utils/cvPdfGenerator.ts');
      await generateCvPdf();
    } catch (e) {
      console.error('PDF generation error', e);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <div className="pt-28 pb-24 md:pt-36 relative overflow-x-clip w-full max-w-full">
      <SEOHead
        title="Web Developer Portfolio & Case Studies UK | Click N Create — Saad M"
        description="Explore Saad M's freelance web development portfolio: high-converting React apps, Shopify e-commerce, custom UI design, and live verified client projects."
        canonicalPath="/portfolio"
        keywords={[
          'freelance web developer portfolio UK',
          'Saad M portfolio',
          'Click N Create portfolio',
          'clickncreate.co.uk portfolio',
          'React web developer case studies',
          'hire front end developer UK',
          'download CV PDF web developer',
          'custom e-commerce developer portfolio'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: 'Saad M',
            jobTitle: 'Freelance Web Developer & UI Designer',
            url: 'https://clickncreate.co.uk/about',
            worksFor: {
              '@type': 'Organization',
              name: 'Click N Create',
              url: 'https://clickncreate.co.uk'
            },
            knowsAbout: [
              'React 19',
              'TypeScript',
              'Next.js',
              'Tailwind CSS',
              'Shopify Development',
              'WordPress',
              'Full-Stack Architecture',
              'Technical SEO & Core Web Vitals'
            ]
          }
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===================== HERO PROFILE BANNER ===================== */}
        <div
          className={`rounded-3xl border p-6 sm:p-10 md:p-12 mb-12 relative overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
            isDark
              ? 'border-[#252A36] bg-[#0C1222]/95 shadow-[0_20px_60px_rgba(0,0,0,0.65)]'
              : 'border-[#E6E2D8] bg-white/95 shadow-lg'
          }`}
        >
          {/* Subtle Warm Amber architectural backdrop */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[140px] pointer-events-none bg-[#38BDF8]/12" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-[130px] pointer-events-none bg-[#1D4ED8]/8" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Profile Content */}
            <div className="lg:col-span-12 space-y-6">
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-md border text-xs font-mono uppercase tracking-wider mb-3 ${
                    isDark
                      ? 'border-[#38BDF8]/35 bg-[#38BDF8]/10 text-[#BAE6FD]'
                      : 'border-[#38BDF8]/40 bg-[#F3E9DC] text-[#1E40AF] font-semibold'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Official Portfolio &amp; Verified Credentials</span>
                </div>

                <h1
                  className={`text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.1] ${
                    isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                  }`}
                >
                  SAAD M
                </h1>

                <p className={`text-base sm:text-xl font-medium mt-1.5 font-mono ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                  {SAAD_PORTFOLIO.title}
                </p>

                <p
                  className={`mt-4 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl ${
                    isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                  }`}
                >
                  {SAAD_PORTFOLIO.tagline}
                </p>
              </div>

              {/* Contact Meta Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <div
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    isDark ? 'border-white/10 bg-white/5 text-[#F1F5F9]' : 'border-[#E6E2D8] bg-[#F3F6FA] text-[#0F172A]'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                  <span>{SAAD_PORTFOLIO.location}</span>
                </div>

                <a
                  href={`mailto:${SAAD_PORTFOLIO.email}`}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'border-white/10 bg-white/5 hover:border-[#38BDF8]/45 text-[#F1F5F9]'
                      : 'border-[#E6E2D8] bg-[#F3F6FA] hover:border-[#1D4ED8] text-[#0F172A]'
                  }`}
                >
                  <Mail className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                  <span>{SAAD_PORTFOLIO.email}</span>
                </a>

                <div
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    isDark ? 'border-white/10 bg-white/5 text-[#F1F5F9]' : 'border-[#E6E2D8] bg-[#F3F6FA] text-[#0F172A]'
                  }`}
                >
                  <Phone className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                  <span>{SAAD_PORTFOLIO.phone} / {SAAD_PORTFOLIO.ukPhone}</span>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    isDark
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-emerald-600/30 bg-emerald-50 text-emerald-700 font-semibold'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
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
                  className="px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#111318] shadow-[0_8px_22px_rgba(56, 189, 248,0.28)] transition-all cursor-pointer flex items-center gap-2"
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
                      ? 'border-white/15 bg-white/5 hover:bg-white/10 text-[#F1F5F9]'
                      : 'border-[#D6CFC2] bg-white hover:bg-[#F3F6FA] text-[#0F172A] shadow-2xs'
                  }`}
                >
                  <FileText className={`w-4 h-4 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                  <span>View Full CV Document</span>
                </button>

                {/* 3. WhatsApp Direct Chat */}
                <a
                  href={SAAD_PORTFOLIO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Saad</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ===================== NAVIGATION TABS ===================== */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-10 border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-[#38BDF8] text-[#111318] shadow-[0_6px_18px_rgba(56, 189, 248,0.28)]'
                : isDark
                ? 'text-[#94A3B8] hover:text-[#F1F5F9] bg-white/5'
                : 'text-[#475569] hover:text-[#0F172A] bg-[#F3F6FA]'
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
                ? 'bg-[#38BDF8] text-[#111318] shadow-[0_6px_18px_rgba(56, 189, 248,0.28)]'
                : isDark
                ? 'text-[#94A3B8] hover:text-[#F1F5F9] bg-white/5'
                : 'text-[#475569] hover:text-[#0F172A] bg-[#F3F6FA]'
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
                ? 'bg-[#38BDF8] text-[#111318] shadow-[0_6px_18px_rgba(56, 189, 248,0.28)]'
                : isDark
                ? 'text-[#94A3B8] hover:text-[#F1F5F9] bg-white/5'
                : 'text-[#475569] hover:text-[#0F172A] bg-[#F3F6FA]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Skills &amp; Engineering</span>
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
                      ? 'border-[#252A36] bg-[#0C1222]/90 hover:border-[#38BDF8]/45'
                      : 'border-[#E6E2D8] bg-white hover:border-[#1D4ED8]/60 shadow-sm'
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
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                        {proj.category}
                      </span>
                      <span className={`text-xs font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        {proj.timeline}
                      </span>
                    </div>

                    <h3
                      className={`text-xl sm:text-2xl font-bold font-display ${
                        isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                      }`}
                    >
                      {proj.title}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                      }`}
                    >
                      {proj.description}
                    </p>

                    <div className="space-y-2 pt-1">
                      <span className={`text-[11px] font-mono uppercase block font-semibold ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        Key Accomplishments:
                      </span>
                      <ul className="space-y-1 text-xs">
                        {proj.achievements.map((ach, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                            <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}>
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
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            isDark
                              ? 'bg-white/5 text-[#94A3B8]'
                              : 'bg-[#F3F6FA] text-[#475569]'
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
                        className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold hover:underline ${
                          isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                        }`}
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
                isDark ? 'border-[#252A36] bg-[#0C1222]/90' : 'border-[#E6E2D8] bg-white shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 shrink-0 shadow-md ${
                  isDark ? 'border-[#38BDF8]/50 bg-[#1A1D25]' : 'border-[#38BDF8]/40 bg-[#F3F6FA]'
                }`}>
                  <img
                    src={SAAD_PORTFOLIO.cvAvatarImage}
                    alt="Saad M — Official CV Avatar"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className={`font-display font-bold text-lg ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>Curriculum Vitae Credentials</h3>
                  <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    Imported directly from official CV Resume · Saad M
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="px-4 py-2.5 rounded-xl bg-[#38BDF8] text-[#111318] font-mono font-bold text-xs flex items-center gap-2 hover:bg-[#7DD3FC] cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CV (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCvModal(true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 cursor-pointer ${
                    isDark ? 'border-white/15 hover:bg-white/10 text-[#F1F5F9]' : 'border-[#D6CFC2] hover:bg-[#F3F6FA] text-[#0F172A]'
                  }`}
                >
                  <Eye className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
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
                    isDark ? 'border-[#252A36] bg-[#0C1222]/90' : 'border-[#E6E2D8] bg-white shadow-xs'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                    <GraduationCap className="w-5 h-5" />
                    <h4 className="font-display font-bold text-base uppercase tracking-wider">
                      Education
                    </h4>
                  </div>

                  {SAAD_PORTFOLIO.education.map((edu, idx) => (
                    <div key={idx} className={`space-y-1.5 border-l pl-4 ${isDark ? 'border-[#38BDF8]/60' : 'border-[#1D4ED8]/50'}`}>
                      <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                        {edu.timeline}
                      </span>
                      <h5 className={`font-bold text-sm ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{edu.degree}</h5>
                      <div className={`text-xs font-semibold ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        {edu.field}
                      </div>
                      <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        {edu.institution}
                      </p>
                      <p className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        {edu.location}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Languages Card */}
                <div
                  className={`p-6 rounded-3xl border space-y-4 ${
                    isDark ? 'border-[#252A36] bg-[#0C1222]/90' : 'border-[#E6E2D8] bg-white shadow-xs'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
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
                          <span className={`font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{lang.name}</span>
                        </div>
                        <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div
                  className={`p-6 rounded-3xl border space-y-3 font-mono text-xs ${
                    isDark ? 'border-[#252A36] bg-[#0C1222]/90' : 'border-[#E6E2D8] bg-white shadow-xs'
                  }`}
                >
                  <h4 className={`font-display font-bold text-sm uppercase mb-2 ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                    Contact Details
                  </h4>
                  <div className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>
                    <span className={`block text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>EMAIL:</span>
                    <a href={`mailto:${SAAD_PORTFOLIO.email}`} className="hover:text-[#38BDF8]">
                      {SAAD_PORTFOLIO.email}
                    </a>
                  </div>
                  <div className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>
                    <span className={`block text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>PHONE (INDIA):</span>
                    <span>{SAAD_PORTFOLIO.phone}</span>
                  </div>
                  <div className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>
                    <span className={`block text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>PHONE / WHATSAPP (UK):</span>
                    <span>{SAAD_PORTFOLIO.ukPhone}</span>
                  </div>
                  <div className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>
                    <span className={`block text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>LOCATION:</span>
                    <span>{SAAD_PORTFOLIO.location}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: About Me, Experience & Internship */}
              <div className="lg:col-span-8 space-y-6">
                {/* About Me Section */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl border space-y-3 ${
                    isDark ? 'border-[#252A36] bg-[#0C1222]/90' : 'border-[#E6E2D8] bg-white shadow-xs'
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                    <UserCheck className="w-5 h-5" />
                    <h4 className="font-display font-bold text-base uppercase tracking-wider">
                      About Me
                    </h4>
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'
                    }`}
                  >
                    {SAAD_PORTFOLIO.aboutBio}
                  </p>
                </div>

                {/* Dedicated Key Projects Section in CV */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
                    isDark ? 'border-[#252A36] bg-[#0C1222]/90' : 'border-[#E6E2D8] bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.08] dark:border-white/[0.08]">
                    <div className={`flex items-center gap-2 ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                      <Code2 className="w-5 h-5" />
                      <h4 className="font-display font-bold text-base uppercase tracking-wider">
                        Key Projects &amp; Deliveries
                      </h4>
                    </div>
                    <span className={`text-[10px] font-mono uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                      3 Verified Works
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Project 1: Owais Academic Portfolio */}
                    <div className={`border-l pl-4 sm:pl-6 space-y-2 relative ${isDark ? 'border-[#38BDF8]/60' : 'border-[#1D4ED8]/50'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h5 className={`font-bold text-base sm:text-lg ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                            Owais Portfolio &amp; Academic Dashboard
                          </h5>
                          <span className={`text-xs font-mono ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                            Client Project · Live on Vercel
                          </span>
                        </div>
                        <a
                          href="https://owaisdashboard.vercel.app"
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-mono hover:underline ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}
                        >
                          <span>owaisdashboard.vercel.app</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}`}>
                        Comprehensive personal portfolio and interactive student dashboard built for client Owais to showcase his entire academic background, qualifications, and skill proficiency.
                      </p>

                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2">
                          <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>•</span>
                          <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}>
                            Engineered complete academic records, degree trajectory, and interactive technical &amp; soft skills matrix.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>•</span>
                          <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}>
                            Deployed live on Vercel edge infrastructure with sub-second page loads and mobile-responsive layout.
                          </span>
                        </li>
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['React / Next.js', 'Tailwind CSS', 'Vercel Edge', 'Academic Dashboard', 'Client Delivery'].map((t, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                              isDark ? 'bg-[#38BDF8]/10 text-[#BAE6FD] border border-[#38BDF8]/30' : 'bg-[#F3E9DC] text-[#1E40AF]'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project 2: Hammad Patel Personal & Engineering Portfolio */}
                    <div className={`border-l pl-4 sm:pl-6 space-y-2 relative ${isDark ? 'border-[#38BDF8]/60' : 'border-[#1D4ED8]/50'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h5 className={`font-bold text-base sm:text-lg ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                            Hammad Patel — Engineering Portfolio &amp; ECE Virtual Lab Studio
                          </h5>
                          <span className={`text-xs font-mono ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                            Client Project · Live on Vercel
                          </span>
                        </div>
                        <a
                          href="https://hammadpatel.vercel.app"
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-mono hover:underline ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}
                        >
                          <span>hammadpatel.vercel.app</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}`}>
                        Bespoke personal and engineering portfolio website designed and built for client Hammad Patel, featuring an interactive <strong>ECE Virtual Lab Studio</strong> covering all fundamental Electronics &amp; Communication topics studied in our curriculum (signals, systems, modulation, circuit simulations) along with GEC Bharuch academics and IIT Bombay internship credentials.
                      </p>

                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2">
                          <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>•</span>
                          <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}>
                            Engineered an interactive ECE Virtual Lab Studio simulating electronics &amp; communication coursework topics studied at GEC Bharuch.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>•</span>
                          <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}>
                            Deployed live on Vercel (hammadpatel.vercel.app) with dark/light responsive UI, global edge CDN, and sub-second load times.
                          </span>
                        </li>
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['ECE Virtual Lab Studio', 'React / TypeScript', 'Tailwind CSS', 'Circuit Simulation', 'Vercel Edge', 'Client Delivery'].map((t, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                              isDark ? 'bg-[#38BDF8]/10 text-[#BAE6FD] border border-[#38BDF8]/30' : 'bg-[#F3E9DC] text-[#1E40AF]'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project 3: Click N Create */}
                    <div className={`border-l pl-4 sm:pl-6 space-y-2 relative ${isDark ? 'border-[#38BDF8]/60' : 'border-[#1D4ED8]/50'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h5 className={`font-bold text-base sm:text-lg ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                            Click N Create Web Platform &amp; Brand System
                          </h5>
                          <span className={`text-xs font-mono ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                            Flagship Freelance Platform
                          </span>
                        </div>
                        <a
                          href="https://clickncreate.co.uk"
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-mono hover:underline ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}
                        >
                          <span>clickncreate.co.uk</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}`}>
                        The official digital freelance platform featuring custom geometric vector logo, real-time cost estimator, dark/light theme engine, and direct client quotation pipeline.
                      </p>

                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2">
                          <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>•</span>
                          <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}>
                            Engineered dynamic instant cost calculator with £35/hr and fixed milestone breakdown.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>•</span>
                          <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}>
                            Designed complete brand identity, typography wordmark, and multi-device responsive UI.
                          </span>
                        </li>
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['React 19', 'TypeScript', 'Tailwind CSS', 'Vector Logo', 'Interactive Estimator'].map((t, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                              isDark ? 'bg-[#38BDF8]/10 text-[#BAE6FD] border border-[#38BDF8]/30' : 'bg-[#F3E9DC] text-[#1E40AF]'
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
                    isDark ? 'border-[#252A36] bg-[#0C1222]/90' : 'border-[#E6E2D8] bg-white shadow-xs'
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                    <Briefcase className="w-5 h-5" />
                    <h4 className="font-display font-bold text-base uppercase tracking-wider">
                      Experience &amp; Internships
                    </h4>
                  </div>

                  <div className="space-y-6">
                    {SAAD_PORTFOLIO.experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className={`border-l pl-4 sm:pl-6 space-y-2 relative ${isDark ? 'border-[#38BDF8]/60' : 'border-[#1D4ED8]/50'}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className={`font-bold text-base sm:text-lg ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                            {exp.role} <span className={isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}>@ {exp.company}</span>
                          </h5>
                          <span className={`text-xs font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                            {exp.timeline}
                          </span>
                        </div>

                        <p className={`text-xs font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                          {exp.type}
                        </p>

                        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#F1F5F9]/85' : 'text-[#3A3832]'}`}>
                          {exp.description}
                        </p>

                        <ul className="space-y-1.5 pt-1 text-xs">
                          {exp.keyResponsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <span className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>•</span>
                              <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>
                                {resp}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                                isDark ? 'bg-white/5 text-[#BAE6FD]' : 'bg-[#F3E9DC] text-[#1E40AF]'
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
                    isDark ? 'border-[#252A36] bg-[#0C1222]/90' : 'border-[#E6E2D8] bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
                    <h3 className={`font-display font-bold text-base sm:text-lg flex items-center gap-2 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                      <Cpu className={`w-4 h-4 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                      <span>{cat.title}</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {cat.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{skill.name}</span>
                          <span className={`font-mono ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>{skill.level}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-[#E6E2D8] dark:bg-[#222632] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#BAE6FD]"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>

                        {skill.note && (
                          <p className={`text-[11px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
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
              ? 'border-[#252A36] bg-gradient-to-b from-[#0C1222] to-[#0D0F14] shadow-2xl'
              : 'border-[#E6E2D8] bg-gradient-to-b from-white to-[#F3F6FA] shadow-md'
          }`}
        >
          <span className={`text-xs font-mono uppercase tracking-[0.2em] font-bold block ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
            Ready to Work Together
          </span>

          <h2
            className={`text-2xl sm:text-4xl font-black font-display tracking-tight max-w-xl mx-auto ${
              isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
            }`}
          >
            LET&apos;S BRING YOUR VISION TO LIFE.
          </h2>

          <p className={`text-xs sm:text-sm max-w-lg mx-auto ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
            Whether you need a custom website, an e-commerce shop, or electronics engineering consultation, I am ready to collaborate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#111318] shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/estimator')}
              className={`px-5 py-3.5 rounded-xl border font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isDark ? 'border-white/15 hover:bg-white/10 text-[#F1F5F9]' : 'border-[#D6CFC2] hover:bg-[#F3F6FA] text-[#0F172A]'
              }`}
            >
              <span>Instant Cost Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== STICKY BOTTOM-RIGHT 3D AVATAR ===================== */}
      {!showCvModal && (
        <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-6 z-40 flex flex-col items-center pointer-events-none select-none">
          <Suspense fallback={null}>
            <InteractivePortfolioAvatar3D isDark={isDark} />
          </Suspense>
          <div
            className={`-mt-3 relative z-10 px-3 py-1 rounded-md border shadow-lg flex items-center gap-1.5 whitespace-nowrap text-[11px] font-mono font-bold ${
              isDark
                ? 'border-emerald-500/40 bg-[#0C1222]/95 text-emerald-400'
                : 'border-emerald-600/35 bg-white/95 text-emerald-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available For Work</span>
          </div>
          <span
            className={`mt-1 text-[10px] font-mono ${
              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
            }`}
          >
            Verified Web Developer
          </span>
        </div>
      )}

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
                  <div className="w-8 h-8 rounded-lg bg-[#F3E9DC] border border-[#38BDF8]/40 text-[#1D4ED8] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-zinc-950 block leading-tight">
                      Official Curriculum Vitae · Saad M
                    </span>
                    <span className="text-[11px] font-mono text-[#1E40AF]">
                      Click N Create · Verified Credentials
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1D4ED8] text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
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
                    <div className="text-[#1E40AF] font-bold text-sm sm:text-base mt-0.5">
                      Electronics &amp; Communication Engineer | Web Developer
                    </div>
                    <div className="text-xs text-zinc-600 mt-2 flex flex-wrap gap-2 font-mono">
                      <span>Bharuch, Gujarat, India</span>
                      <span>•</span>
                      <a href="mailto:saadm.clickncreate@gmail.com" className="text-[#1E40AF] hover:underline">
                        saadm.clickncreate@gmail.com
                      </a>
                      <span>•</span>
                      <span>+91 9265129400</span>
                      <span>•</span>
                      <span>+44 7927 548123</span>
                    </div>
                  </div>

                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-zinc-200 bg-white shadow-md shrink-0">
                    <img
                      src={SAAD_PORTFOLIO.cvAvatarImage}
                      alt="Saad M — Official CV Avatar"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Two-Column Resume Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 pt-2">
                  {/* Left Column: Education, Skills, Languages */}
                  <div className="sm:col-span-5 space-y-6 border-r-0 sm:border-r border-zinc-200 pr-0 sm:pr-6">
                    {/* Education */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>Education</span>
                      </h4>
                      <div className="pt-1">
                        <div className="font-bold text-zinc-950 text-xs">
                          BE Electronics &amp; Communication Engineering
                        </div>
                        <div className="text-[11px] text-zinc-600 font-medium">
                          Government Engineering College, Bharuch
                        </div>
                        <div className="text-[10px] text-[#1E40AF] font-mono font-bold mt-0.5">
                          2023 – 2027
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>Skills &amp; Capabilities</span>
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-zinc-800 pt-1">
                        <li>• Web Development (WordPress, Shopify, React)</li>
                        <li>• E-commerce Setup &amp; Website Optimization</li>
                        <li>• Google Ads, SEO &amp; UI/UX Basics</li>
                        <li>• Analog &amp; Digital Signal Conversion</li>
                        <li>• Communication Systems Fundamentals</li>
                        <li>• Satellite &amp; Wireless Communication</li>
                        <li>• Microsoft Office (Word, Excel, PowerPoint)</li>
                        <li>• Proficiency in AI Tools &amp; Workflows</li>
                        <li>• Social Media Design &amp; Brand Identity</li>
                      </ul>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5 text-[#1D4ED8]" />
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
                        <UserCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>About Me</span>
                      </h4>
                      <p className="text-[11px] text-zinc-700 leading-relaxed pt-0.5">
                        Motivated and enthusiastic Electronics &amp; Communication Engineering student with a strong interest in communication technologies, satellite communication, wireless systems, and modern web development. Experienced in developing web applications using WordPress with PHP and CSS customization, React, and responsive UI layouts. Proficient in AI tools for productivity, technical research, and innovative problem-solving.
                      </p>
                    </div>

                    {/* Dedicated Key Projects Section */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                          <span>Key Projects &amp; Web Deliveries</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">3 Verified Works</span>
                      </h4>

                      <div className="space-y-2 pt-0.5">
                        {/* Project 1: Owais Dashboard */}
                        <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 text-[11px]">
                              Owais Portfolio &amp; Academic Dashboard
                            </span>
                            <a
                              href="https://owaisdashboard.vercel.app"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-[#1D4ED8] hover:underline font-bold"
                            >
                              owaisdashboard.vercel.app ↗
                            </a>
                          </div>
                          <div className="text-[10px] text-[#1E40AF] font-mono">
                            Client Delivery · Academic Portfolio &amp; Trajectory Dashboard (Vercel)
                          </div>
                          <p className="text-[10.5px] text-zinc-700 leading-tight">
                            • Designed and deployed comprehensive student portfolio featuring verified academic records, degree milestones, and interactive technical &amp; soft skills matrix with sub-second responsive performance.
                          </p>
                        </div>

                        {/* Project 2: Hammad Patel Portfolio & ECE Virtual Lab */}
                        <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 text-[11px]">
                              Hammad Patel — Engineering Portfolio &amp; ECE Virtual Lab Studio
                            </span>
                            <a
                              href="https://hammadpatel.vercel.app"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-[#1D4ED8] hover:underline font-bold"
                            >
                              hammadpatel.vercel.app ↗
                            </a>
                          </div>
                          <div className="text-[10px] text-[#1E40AF] font-mono">
                            Client Delivery · ECE Virtual Lab Studio &amp; Engineering Showcase (Vercel)
                          </div>
                          <p className="text-[10.5px] text-zinc-700 leading-tight">
                            • Designed and built custom portfolio for client Hammad Patel featuring an interactive ECE Virtual Lab Studio simulating electronics &amp; communication curriculum concepts (signals, circuits, modulation) alongside IIT Bombay internship credentials.
                          </p>
                        </div>

                        {/* Project 3: Click N Create */}
                        <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-950 text-[11px]">
                              Click N Create Web Platform &amp; Brand System
                            </span>
                            <a
                              href="https://clickncreate.co.uk"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-[#1D4ED8] hover:underline font-bold"
                            >
                              clickncreate.co.uk ↗
                            </a>
                          </div>
                          <div className="text-[10px] text-[#1E40AF] font-mono">
                            Flagship Freelance Platform &amp; Vector Brand Identity
                          </div>
                          <p className="text-[10.5px] text-zinc-700 leading-tight">
                            • Built full-stack freelance website featuring custom geometric vector logo, real-time cost estimator (£35/hr &amp; fixed packages), dark/light theme engine, and direct WhatsApp quote automation.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>Experience</span>
                      </h4>
                      <div className="space-y-1 pt-0.5">
                        <div className="font-bold text-zinc-950 text-xs">
                          Click N Create – clickncreate.co.uk
                        </div>
                        <div className="text-[10px] text-[#1E40AF] font-mono font-bold">
                          Lead Web Developer &amp; Founder (2025 – Present)
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
                        <Award className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>Internship</span>
                      </h4>
                      <div className="space-y-0.5 pt-0.5">
                        <div className="font-bold text-zinc-950 text-xs">
                          Spoken Tutorial Project – IIT Bombay
                        </div>
                        <p className="text-[10.5px] text-zinc-700 leading-relaxed">
                          Electronic Circuit Simulation using <strong>eSim</strong> &amp; <strong>CircuitJS</strong>. Analyzed circuit behavior, signal conversion, and frequency waveforms.
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
