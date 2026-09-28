import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/services.ts';
import { AdaptiveServiceImage } from '../components/AdaptiveServiceImage.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { FinalCTA } from '../components/FinalCTA.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="pt-28 pb-20 md:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Hero */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
            isDark ? 'border-white/10 bg-white/5 text-blue-400' : 'border-zinc-300 bg-white text-blue-600 shadow-2xs font-semibold'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Offerings</span>
          </div>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.1] ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>
            SERVICES & <span className="text-luxury-gradient">CAPABILITIES</span>
          </h1>
          <p className={`mt-5 text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            Click N Create provides focused, high-standard digital services tailored for businesses, founders, creators, and individuals. Every service is delivered with direct communication, clean architecture, and modern visual design.
          </p>
        </div>

        {/* Services List - Large Glass Layouts */}
        <div className="space-y-16 md:space-y-24">
          {SERVICES.map((service: ServiceItem, index: number) => {
            const isEven = index % 2 === 1;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className={`rounded-3xl border p-6 sm:p-10 md:p-12 relative overflow-hidden backdrop-blur-2xl transition-all duration-300 group ${
                  isDark
                    ? 'border-white/10 bg-[#0E0E12]/85 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] hover:border-white/20'
                    : 'border-zinc-200 bg-white/90 shadow-md hover:border-zinc-300'
                }`}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Visual Image Asset */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : ''}`}>
                    <div
                      className="cursor-pointer"
                      onClick={() => onNavigate(`/services/${service.slug}`)}
                    >
                      <AdaptiveServiceImage
                        slug={service.slug}
                        imageSrc={service.image}
                        altText={service.altText}
                        accentColor={service.accentColor}
                        className="w-full aspect-[4/3] shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-1' : ''}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                          isDark ? 'text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30' : 'text-cyan-800 bg-cyan-100 border-cyan-300'
                        }`}>
                          // {service.number}
                        </span>
                        <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider font-semibold">
                          [{service.categoryTag || 'DIGITAL SERVICE'}]
                        </span>
                      </div>

                      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight ${
                        isDark ? 'text-white' : 'text-zinc-950'
                      }`}>
                        {service.title}
                      </h2>

                      <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
                        isDark ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                        {service.fullDescription}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {service.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                              isDark
                                ? 'bg-white/5 border-white/10 text-zinc-300'
                                : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className={`text-xs font-mono uppercase tracking-wider mb-3 ${
                        isDark ? 'text-zinc-300' : 'text-zinc-800'
                      }`}>
                        Key Deliverables & Features:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.features.slice(0, 4).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                            <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Who It Is For */}
                    <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>Ideal For:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {service.suitableFor.map((target, idx) => (
                          <span
                            key={idx}
                            className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                              isDark
                                ? 'text-zinc-300 bg-white/5 border-white/10'
                                : 'text-zinc-700 bg-zinc-100 border-zinc-200'
                            }`}
                          >
                            {target}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/services/${service.slug}`)}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm border transition-all cursor-pointer group/btn ${
                          isDark
                            ? 'text-white bg-white/10 hover:bg-white/15 border-white/20'
                            : 'text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border-zinc-300 shadow-2xs'
                        }`}
                      >
                        <span>Full Details & FAQs</span>
                        <ArrowUpRight className="w-4 h-4 text-blue-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate('/contact')}
                        className={`text-xs font-mono transition-colors cursor-pointer ${
                          isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        Inquire about this service →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-20">
        <FinalCTA
          onStartProject={() => onNavigate('/contact')}
          onExploreServices={() => onNavigate('/services')}
        />
      </div>
    </div>
  );
};
