import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Layout, Store, Flame, Compass, Briefcase, Cpu } from 'lucide-react';
import { CAPABILITIES } from '../data/site.ts';
import { SectionHeading } from './SectionHeading.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface CapabilitiesSectionProps {
  onEnquire: () => void;
}

const ICONS = [Layout, Store, Flame, Compass, Briefcase, Cpu];

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ onEnquire }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`relative py-24 md:py-32 border-y transition-colors ${
      isDark ? 'bg-[#0C1222]/50 border-white/[0.06]' : 'bg-[#EFECE5]/60 border-stone-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            category="Capabilities"
            title="WHAT I CAN BUILD"
            subtitle="Transparently presenting the types of digital experiences I am equipped to design and code for you. These represent my technical capabilities and architectural readiness, not fabricated past projects."
            className="mb-0"
          />

          <div className="shrink-0">
            <button
              type="button"
              onClick={onEnquire}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-[#F1F5F9]'
                  : 'border-stone-300 bg-white hover:bg-stone-50 text-[#0F172A] shadow-xs'
              }`}
            >
              <span>Discuss Your Build</span>
              <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
            </button>
          </div>
        </div>

        {/* Grid of Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, index) => {
            const Icon = ICONS[index % ICONS.length];

            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className={`group relative rounded-2xl border p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                  isDark
                    ? 'border-white/10 bg-[#1A1D25]/60 hover:border-[#38BDF8]/40 hover:bg-[#1A1D25]/90'
                    : 'border-stone-200/90 bg-white hover:border-[#1D4ED8]/45 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                      isDark
                        ? 'border-white/12 bg-white/5 text-[#38BDF8] group-hover:text-[#BAE6FD] group-hover:border-[#38BDF8]/40'
                        : 'border-stone-200 bg-[#F3F6FA] text-[#1D4ED8] group-hover:text-[#1D4ED8]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-mono tracking-wider uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold font-display tracking-tight mb-2.5 transition-colors ${
                    isDark ? 'text-[#F1F5F9] group-hover:text-[#BAE6FD]' : 'text-[#0F172A] group-hover:text-[#1D4ED8]'
                  }`}>
                    {cap.title}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-6 ${
                    isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                  }`}>
                    {cap.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] space-y-3">
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 font-bold ${
                      isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                    }`}>
                      Tech Stack:
                    </span>
                    <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                      {cap.techStack?.map((t, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded border ${
                            isDark
                              ? 'bg-[#38BDF8]/10 text-[#BAE6FD] border-[#38BDF8]/25'
                              : 'bg-[#F3E9DC] text-[#1E40AF] border-[#38BDF8]/35'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                      Key Highlights:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.highlights.map((h, i) => (
                        <span
                          key={i}
                          className={`text-xs font-mono px-2 py-0.5 rounded border ${
                            isDark
                              ? 'text-[#94A3B8] bg-white/5 border-white/10'
                              : 'text-[#475569] bg-stone-100 border-stone-200'
                          }`}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
