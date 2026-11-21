import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Globe,
  Maximize2,
  X,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface MyWorksPageProps {
  onNavigate: (path: string) => void;
}

interface FeaturedWork {
  id: string;
  index: string;
  clientName: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  hosting: string;
  liveUrl: string;
  displayUrl: string;
  frontImage: string;
  imageAlt: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

const FEATURED_WORKS: FeaturedWork[] = [
  {
    id: 'owais-dashboard',
    index: '01',
    clientName: 'Bhola Mohammed Owais',
    title: 'AI & Data Science Portfolio',
    subtitle: 'Academic Dashboard & Interactive Project Showcase',
    category: 'Client Website',
    year: '2026',
    hosting: 'Vercel Edge',
    liveUrl: 'https://owaisdashboard.vercel.app',
    displayUrl: 'owaisdashboard.vercel.app',
    frontImage: '/images/work-owais-front.png',
    imageAlt:
      'Front page design of Bhola Mohammed Owais AI and Data Science portfolio website built by Saad M',
    summary:
      'A crisp, data-driven portfolio and academic dashboard designed and developed for Bhola Mohammed Owais, a B.Tech Artificial Intelligence student at Parul University. Built with a clean editorial layout featuring a candidate profile snapshot, interactive KPI overview, Privacy-Guard AI showcase, and categorized technical capabilities.',
    highlights: [
      'Structured academic timeline, degree milestones, and candidate profile snapshot',
      'Featured AI & ML project visualizers including Privacy-Guard AI',
      'Clean high-contrast light editorial aesthetic tuned for recruiters and academics',
      'Deployed live on Vercel Edge CDN with fast responsive layouts across all screens',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel Edge', 'Responsive UI'],
  },
  {
    id: 'hammad-patel',
    index: '02',
    clientName: 'Hammad Patel',
    title: 'Engineering Portfolio & Virtual Lab',
    subtitle: 'Electronics & Communication Portfolio with Live Signal Lab',
    category: 'Client Website',
    year: '2026',
    hosting: 'Vercel Edge',
    liveUrl: 'https://hammadpatel.vercel.app',
    displayUrl: 'hammadpatel.vercel.app',
    frontImage: '/images/work-hammad-front.png',
    imageAlt:
      'Front page design of Hammad Patel Electronics and Communication Engineer portfolio and Virtual Lab website built by Saad M',
    summary:
      'A bespoke dark-themed engineering portfolio and interactive virtual lab built for Hammad Patel, an Electronics & Communication Engineering student at GEC Bharuch and IIT Bombay Spoken Tutorial intern. Combines personal branding, CV viewer, WhatsApp connect, and live interactive signal demonstrations.',
    highlights: [
      'Interactive ECE Virtual Lab Studio and Live Signal Lab for coursework experiments',
      'Dedicated sections for GEC Bharuch academic record and IIT Bombay internship',
      'Direct Hire CTA, integrated CV viewer, and instant WhatsApp contact flow',
      'Sub-second global performance hosted on Vercel with dark-mode visual precision',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Interactive Signal Lab', 'Vercel Edge'],
  },
];

export const MyWorksPage: React.FC<MyWorksPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [lightboxWork, setLightboxWork] = useState<FeaturedWork | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!lightboxWork) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxWork(null);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxWork]);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen relative overflow-x-clip">
      <SEOHead
        title="My Works | Live Websites Built by Saad M"
        description="Explore live client websites designed and built by Saad M at Click N Create — featuring front-page design previews of Bhola Mohammed Owais's AI & Data Science Portfolio and Hammad Patel's Engineering Portfolio & ECE Virtual Lab."
        canonicalPath="/my-works"
        ogImage="/images/work-owais-front.png"
        keywords={[
          'Saad M websites',
          'Click N Create my works',
          'Owais dashboard portfolio',
          'Hammad Patel portfolio',
          'live client websites React',
        ]}
      />

      {/* Subtle Ambient Backdrop */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full blur-[140px] ${
          isDark ? 'bg-[#00F0FF]/[0.07]' : 'bg-cyan-500/[0.08]'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Hero Header */}
        <header className="max-w-3xl mb-16 sm:mb-20">
          <p
            className={`text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-4 ${
              isDark ? 'text-[#00F0FF]' : 'text-cyan-700'
            }`}
          >
            Selected Client Websites
          </p>

          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.05] text-balance ${
              isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
            }`}
          >
            My Works
          </h1>

          <p
            className={`mt-5 text-base sm:text-lg leading-relaxed max-w-2xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Two live websites designed, developed, and launched from scratch for real clients — presented with their actual front-page designs and direct live links.
          </p>

          <div
            className={`mt-7 pt-6 border-t flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono ${
              isDark
                ? 'border-white/10 text-slate-400'
                : 'border-slate-200 text-slate-500'
            }`}
          >
            <span className={isDark ? 'text-slate-200 font-semibold' : 'text-slate-900 font-semibold'}>
              2 Live Client Websites
            </span>
            <span aria-hidden="true">·</span>
            <span>Vercel Edge Deployed</span>
            <span aria-hidden="true">·</span>
            <span>Click any preview to inspect full screen</span>
          </div>
        </header>

        {/* Featured Website Showcase Stack */}
        <div className="space-y-14 sm:space-y-20">
          {FEATURED_WORKS.map((work, idx) => {
            const isReversed = idx % 2 === 1;
            const imageHasFailed = Boolean(failedImages[work.id]);

            return (
              <motion.article
                key={work.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-3xl border overflow-hidden transition-colors duration-300 ${
                  isDark
                    ? 'border-white/10 bg-[#0A0A16]/90 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.75)]'
                    : 'border-slate-200/90 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.12)]'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Front-Page Design Visual Column (7 cols on lg for true media-first scale) */}
                  <div
                    className={`lg:col-span-7 p-4 sm:p-6 md:p-8 flex flex-col justify-center ${
                      isReversed ? 'lg:order-2' : 'lg:order-1'
                    } ${
                      isDark
                        ? 'bg-[#06060E]/90 border-b lg:border-b-0 border-white/10 ' +
                          (isReversed ? 'lg:border-l' : 'lg:border-r')
                        : 'bg-slate-50/90 border-b lg:border-b-0 border-slate-200/80 ' +
                          (isReversed ? 'lg:border-l' : 'lg:border-r')
                    }`}
                  >
                    {/* Browser Frame Wrapping the Real Front-Page Screenshot */}
                    <div
                      className={`rounded-2xl border overflow-hidden shadow-2xl transition-transform duration-300 ${
                        isDark
                          ? 'border-white/12 bg-[#0D101B]'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* Clean Browser Chrome Bar */}
                      <div
                        className={`px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-3 border-b ${
                          isDark
                            ? 'bg-[#111524] border-white/10'
                            : 'bg-slate-100/90 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        </div>

                        <a
                          href={work.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`min-w-0 flex-1 max-w-xs mx-auto px-3 py-1 rounded-md text-[11px] font-mono flex items-center justify-center gap-1.5 truncate transition-colors ${
                            isDark
                              ? 'bg-black/40 text-slate-300 hover:text-[#00F0FF]'
                              : 'bg-white text-slate-600 hover:text-cyan-700 border border-slate-200/80'
                          }`}
                        >
                          <Lock className="w-3 h-3 shrink-0 opacity-65" />
                          <span className="truncate">{work.displayUrl}</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setLightboxWork(work)}
                          aria-label={`Inspect full front design of ${work.clientName}`}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                            isDark
                              ? 'text-slate-400 hover:text-white hover:bg-white/10'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/70'
                          }`}
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Actual Front-Page Screenshot Viewport (1440x900 = 16:10 exact ratio) */}
                      <button
                        type="button"
                        onClick={() => setLightboxWork(work)}
                        className="group relative block w-full aspect-[16/10] overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] cursor-pointer"
                        aria-label={`Open full-screen preview of ${work.clientName} website front design`}
                      >
                        {!imageHasFailed ? (
                          <img
                            src={work.frontImage}
                            alt={work.imageAlt}
                            referrerPolicy="no-referrer"
                            loading={idx === 0 ? 'eager' : 'lazy'}
                            onError={() => handleImageError(work.id)}
                            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex flex-col items-center justify-center p-8 text-center ${
                              isDark ? 'bg-[#0C101E] text-slate-300' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Globe className="w-8 h-8 mb-3 opacity-60" />
                            <p className="font-display font-bold text-lg">{work.clientName}</p>
                            <p className="text-xs font-mono opacity-75 mt-1">{work.displayUrl}</p>
                          </div>
                        )}

                        {/* Hover Inspect Overlay */}
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/35 transition-colors duration-300 flex items-end justify-end p-4">
                          <span className="opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/85 text-white text-xs font-mono border border-white/15 backdrop-blur-md">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Inspect Full Design</span>
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Subtle Image Caption */}
                    <div
                      className={`mt-3.5 flex items-center justify-between text-xs font-mono ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      <span>Live Homepage Capture · 1440×900 Desktop</span>
                      <button
                        type="button"
                        onClick={() => setLightboxWork(work)}
                        className={`underline-offset-4 hover:underline cursor-pointer ${
                          isDark ? 'text-[#00F0FF]' : 'text-cyan-700'
                        }`}
                      >
                        Zoom preview
                      </button>
                    </div>
                  </div>

                  {/* Project Narrative & Action Column (5 cols on lg) */}
                  <div
                    className={`lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-7 ${
                      isReversed ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="space-y-5">
                      {/* Unboxed Metadata Line */}
                      <div
                        className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        <span
                          className={`font-bold ${
                            isDark ? 'text-[#00F0FF]' : 'text-cyan-700'
                          }`}
                        >
                          {work.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{work.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{work.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{work.hosting}</span>
                      </div>

                      {/* Title & Client Subtitle */}
                      <div>
                        <p
                          className={`text-sm font-medium mb-1 ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {work.clientName}
                        </p>
                        <h2
                          className={`text-2xl sm:text-3xl font-black font-display tracking-tight leading-tight text-balance ${
                            isDark ? 'text-white' : 'text-slate-950'
                          }`}
                        >
                          {work.title}
                        </h2>
                        <p
                          className={`mt-1.5 text-sm font-medium ${
                            isDark ? 'text-[#00F0FF]/85' : 'text-cyan-700'
                          }`}
                        >
                          {work.subtitle}
                        </p>
                      </div>

                      {/* Project Summary */}
                      <p
                        className={`text-sm sm:text-[15px] leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {work.summary}
                      </p>

                      {/* Key Deliverables */}
                      <ul className="space-y-2.5 pt-1">
                        {work.highlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isDark ? 'text-[#00F0FF]' : 'text-cyan-600'
                              }`}
                            />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stack Metadata & CTA Buttons */}
                    <div
                      className={`pt-6 border-t space-y-5 ${
                        isDark ? 'border-white/10' : 'border-slate-200'
                      }`}
                    >
                      <p
                        className={`text-xs font-mono leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {work.stack.join(' · ')}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={work.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            isDark
                              ? 'bg-[#00F0FF] hover:bg-[#5CF6FF] text-[#05050A] shadow-[0_8px_24px_rgba(0,240,255,0.22)]'
                              : 'bg-slate-950 hover:bg-cyan-700 text-white shadow-sm'
                          }`}
                        >
                          <Globe className="w-4 h-4" />
                          <span>Visit Live Site</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setLightboxWork(work)}
                          className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border font-mono font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                            isDark
                              ? 'border-white/15 hover:bg-white/10 text-slate-200'
                              : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Full Preview</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom Project CTA */}
        <section
          className={`mt-20 sm:mt-24 rounded-3xl border p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 ${
            isDark
              ? 'border-white/10 bg-[#0A0A16]/85'
              : 'border-slate-200 bg-white shadow-sm'
          }`}
        >
          <div className="max-w-2xl">
            <p
              className={`text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-3 ${
                isDark ? 'text-[#00F0FF]' : 'text-cyan-700'
              }`}
            >
              Start Your Project
            </p>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-balance ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Want a custom website or portfolio built like these?
            </h2>
            <p
              className={`mt-3 text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Get a clear timeline and honest quote directly from Saad M — whether you need a personal portfolio, business website, or custom interactive web app.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#00F0FF] hover:bg-[#5CF6FF] text-[#05050A]'
                  : 'bg-slate-950 hover:bg-cyan-700 text-white'
              }`}
            >
              <span>Discuss Your Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/estimator')}
              className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border font-mono font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/15 hover:bg-white/10 text-slate-200'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <span>Estimate Cost</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      {/* Fullscreen Front-Design Lightbox Modal */}
      <AnimatePresence>
        {lightboxWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setLightboxWork(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${lightboxWork.clientName} front-page design preview`}
            className="fixed inset-0 z-[100] bg-slate-950/92 backdrop-blur-md p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl flex flex-col max-h-[92vh]"
            >
              {/* Lightbox Header */}
              <div className="flex items-center justify-between gap-4 pb-3.5 text-white">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider truncate">
                    {lightboxWork.clientName} · {lightboxWork.displayUrl}
                  </p>
                  <h3 className="text-base sm:text-lg font-display font-bold truncate">
                    {lightboxWork.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={lightboxWork.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00F0FF] hover:bg-[#5CF6FF] text-[#05050A] font-mono font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Open Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setLightboxWork(null)}
                    aria-label="Close full design preview"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* High-Resolution Front-Page Screenshot */}
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#0A0D18] shadow-2xl overflow-y-auto">
                <img
                  src={lightboxWork.frontImage}
                  alt={lightboxWork.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
