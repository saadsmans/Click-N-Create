import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowUpRight, Sparkles, Clock, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { PROCESS_STAGES, SITE_CONFIG } from '../data/site.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface ProcessPageProps {
  onNavigate: (path: string) => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('process') || {};

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-hidden w-full max-w-full">
      <SEOHead
        title="Development Process & Milestones | Click N Create — Saad M"
        description="Discover Saad M's 5-stage freelance development methodology: Discovery & Scope, Wireframes & UI, Agile Coding, QA Testing, and Final Launch."
        canonicalPath="/process"
        keywords={[
          'web development process',
          'freelance developer workflow',
          'agile development milestones',
          'Click N Create process',
          'website delivery stages'
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===================== HERO SECTION ===================== */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
            isDark ? 'border-white/10 bg-white/5 text-blue-400' : 'border-zinc-300 bg-white text-blue-600 shadow-2xs font-semibold'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{cms.badgeText || 'End-to-End Methodology'}</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>
            {cms.heroTitle || 'HOW WE'} <span className="text-luxury-gradient">{cms.heroHighlight || 'COLLABORATE'}</span>
          </h1>

          <p className={`mt-5 text-base sm:text-xl leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            {cms.heroSubtitle || 'A structured 5-stage blueprint engineered to eliminate guesswork, keep you directly involved at every milestone, and deliver production-grade code on time and within budget.'}
          </p>
        </div>

        {/* ===================== PROCESS STAGES DETAILED ===================== */}
        <div className="space-y-12 md:space-y-16 mb-20">
          {PROCESS_STAGES.map((stage, idx) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`p-8 sm:p-10 rounded-3xl border transition-all duration-300 backdrop-blur-xl ${
                isDark
                  ? 'border-white/10 bg-[#0E0E12]/85 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]'
                  : 'border-zinc-200 bg-white shadow-md'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Step indicator */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl font-black font-display text-blue-500">
                      {stage.number}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      Stage {stage.number}
                    </span>
                  </div>

                  <h3 className={`text-2xl font-bold font-display tracking-tight ${
                    isDark ? 'text-white' : 'text-zinc-950'
                  }`}>
                    {stage.stage}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 pt-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Typical Duration: {stage.durationEstimate}</span>
                  </div>
                </div>

                {/* Right: Description & Deliverables */}
                <div className="lg:col-span-8 space-y-5">
                  <h4 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                    {stage.title}
                  </h4>

                  <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {stage.description}
                  </p>

                  <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-3 font-semibold">
                      Milestone Deliverables:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {stage.deliverables.map((item, dIdx) => (
                        <div
                          key={dIdx}
                          className={`flex items-start gap-2 text-xs sm:text-sm p-2.5 rounded-xl border ${
                            isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===================== GUARANTEES & STANDARDS ===================== */}
        <div className="py-16 border-y border-black/[0.08] dark:border-white/[0.08] mb-20">
          <SectionHeading
            category="Quality Standards"
            title="STANDARDS UPHELD ON EVERY SINGLE PROJECT"
            subtitle="Regardless of whether you hire me for 5 hours or a full custom application build, these quality benchmarks are non-negotiable."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Zero Lock-In
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                You retain complete, independent ownership of all repository code, domain registrations, and cloud hosting accounts.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <Terminal className="w-6 h-6 text-blue-500" />
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Rigorous Mobile QA
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Every layout is verified across iOS Safari, Android Chrome, tablet viewports, and laptops before staging review.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <Clock className="w-6 h-6 text-indigo-500" />
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Direct Updates
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Clear milestone updates delivered directly via WhatsApp or email so you always know current progress.
              </p>
            </div>
          </div>
        </div>

        {/* ===================== CTA ===================== */}
        <div className="py-16 text-center max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-mono text-blue-500 tracking-widest uppercase block font-semibold">
            Ready to Begin Stage 01?
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold font-display tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>
            Let's Start with Discovery.
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Send your project brief. Saad M will review your requirements and provide an honest estimate.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              text="Send Project Brief"
              size="lg"
              variant="primary"
              onClick={() => onNavigate('/contact')}
            />
            <MagneticButton
              text="Explore Transparent Pricing"
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
