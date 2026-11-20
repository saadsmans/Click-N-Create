import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Cpu, Layers, Smartphone, LifeBuoy } from 'lucide-react';
import { WHY_US_REASONS } from '../data/site.ts';
import { SectionHeading } from './SectionHeading.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

const ICONS = [MessageSquare, Cpu, Layers, Smartphone, LifeBuoy];

export const WhyUsSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`relative py-24 md:py-32 border-t transition-colors ${
      isDark ? 'bg-[#0C1222]/45 border-white/[0.06]' : 'bg-[#EFECE5]/60 border-stone-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          category="Why Click N Create"
          title="PURPOSEFUL DEVELOPMENT, HONEST COLLABORATION"
          subtitle="How I approach client projects as an independent freelance developer. No agency overhead, no inflated claims—just transparent execution and dedicated craftsmanship."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {WHY_US_REASONS.map((reason, index) => {
            const Icon = ICONS[index % ICONS.length];
            const isMarquee = index === 0;

            return (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                  isDark
                    ? 'border-white/10 bg-[#1A1D25]/60 hover:border-[#38BDF8]/40 hover:bg-[#1A1D25]/90'
                    : 'border-stone-200 bg-white hover:border-[#1D4ED8]/45 hover:shadow-md'
                } ${isMarquee ? 'lg:col-span-2' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-colors ${
                      isDark
                        ? 'border-white/12 bg-white/5 text-[#38BDF8]'
                        : 'border-stone-200 bg-[#F3F6FA] text-[#1D4ED8]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'text-[#94A3B8] bg-white/5 border-white/10'
                        : 'text-[#475569] bg-stone-100 border-stone-200'
                    }`}>
                      {reason.number}
                    </span>
                  </div>

                  <h3 className={`text-xl sm:text-2xl font-bold font-display tracking-tight mb-3 ${
                    isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                  }`}>
                    {reason.title}
                  </h3>

                  <p className={`text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                  }`}>
                    {reason.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}>Dedicated Craft</span>
                  <span className={isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}>
                    Direct Execution
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
