import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { PROCESS_STAGES } from '../data/site.ts';
import { SectionHeading } from './SectionHeading.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

export const ProcessSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 70%'],
  });

  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          category="Process"
          title="FROM IDEA TO LAUNCH"
          subtitle="A structured 5-stage journey ensuring complete transparency, high development standards, and direct client involvement from first discussion to live deployment."
        />

        {/* Process Timeline Container */}
        <div className="relative mt-16 max-w-4xl mx-auto">
          {/* Background vertical tracking line */}
          <div className="absolute left-6 md:left-8 top-4 bottom-4 w-[2px] bg-black/10 dark:bg-white/10" />

          {/* Animated SVG drawing progress line */}
          <motion.div
            className="absolute left-6 md:left-8 top-4 w-[2px] bg-gradient-to-b from-[#2563EB] via-[#38BDF8] to-[#BAE6FD] origin-top shadow-xs"
            style={{
              height: useTransform(lineHeight, [0, 1], ['0%', '100%']),
            }}
          />

          {/* Stages List */}
          <div className="space-y-12 md:space-y-16">
            {PROCESS_STAGES.map((stage) => {
              return (
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative flex items-start gap-6 md:gap-10 group"
                >
                  {/* Timeline Node Badge */}
                  <div className={`relative z-10 shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 ${
                    isDark
                      ? 'border-white/15 bg-[#0C1222] text-[#BAE6FD] shadow-md group-hover:border-[#38BDF8]/50'
                      : 'border-stone-300 bg-white text-[#1D4ED8] shadow-sm group-hover:border-[#1D4ED8]'
                  }`}>
                    <span className="text-xs md:text-sm font-mono font-bold">
                      {stage.number}
                    </span>
                  </div>

                  {/* Stage Content Card */}
                  <div className={`flex-1 rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 ${
                    isDark
                      ? 'border-white/10 bg-[#1A1D25]/60 hover:border-[#38BDF8]/40 hover:bg-[#1A1D25]/90'
                      : 'border-stone-200 bg-white hover:border-[#1D4ED8]/45 hover:shadow-md'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className={`text-xs font-mono tracking-widest uppercase font-semibold ${
                        isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                      }`}>
                        Stage {stage.number} · {stage.stage}
                      </span>
                    </div>

                    <h3 className={`text-xl sm:text-2xl font-bold font-display tracking-tight mb-3 ${
                      isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                    }`}>
                      {stage.title}
                    </h3>

                    <p className={`text-sm sm:text-base leading-relaxed mb-5 ${
                      isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                    }`}>
                      {stage.description}
                    </p>

                    {/* Deliverables */}
                    <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                      <span className={`text-[11px] font-mono uppercase tracking-wider block mb-2 ${
                        isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                      }`}>
                        Key Deliverables:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {stage.deliverables.map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono ${
                              isDark
                                ? 'bg-white/5 border-white/10 text-[#94A3B8]'
                                : 'bg-[#F3F6FA] border-stone-200 text-[#0F172A]'
                            }`}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
