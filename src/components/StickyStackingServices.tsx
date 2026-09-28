import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/services.ts';
import { AdaptiveServiceImage } from './AdaptiveServiceImage.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface StickyStackingServicesProps {
  onSelectService: (slug: string) => void;
  onExploreAll: () => void;
}

export const StickyStackingServices: React.FC<StickyStackingServicesProps> = ({
  onSelectService,
  onExploreAll,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services (6)' },
    { id: 'Websites', label: 'Business Websites' },
    { id: 'E-Commerce', label: 'Online Shops' },
    { id: 'Web Apps', label: 'Custom Web Apps' },
    { id: 'SEO & Growth', label: 'SEO & Speed' },
  ];

  const filteredServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter((s) => {
        if (activeCategory === 'Websites') return s.slug === 'custom-business-websites' || s.slug === 'managed-website-care';
        if (activeCategory === 'E-Commerce') return s.slug === 'online-shops-ecommerce';
        if (activeCategory === 'Web Apps') return s.slug === 'web-app-development';
        if (activeCategory === 'SEO & Growth') return s.slug === 'get-found-on-google-seo' || s.slug === 'logo-brand-identity';
        return true;
      });

  return (
    <section id="services" className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle diffused background glow */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] blur-[140px] pointer-events-none transition-opacity ${
          isDark ? 'bg-[#00F0FF]/8' : 'bg-cyan-400/8'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <div
              className={`text-xs font-mono tracking-widest uppercase mb-3 flex items-center gap-2 ${
                isDark ? 'text-[#00F0FF]' : 'text-cyan-800 font-semibold'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>[ CORE ARCHITECTURES & SERVICES ]</span>
            </div>
            <h2
              className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] font-display ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}
            >
              WHAT I <span className="text-cyber-gradient">CREATE</span>
            </h2>
            <p
              className={`mt-4 text-sm sm:text-base md:text-lg leading-relaxed ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              From custom React 19 web applications to high-converting Shopify storefronts and manageable WordPress CMS builds. Engineered for speed, clean aesthetics, and real business results.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onExploreAll}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border font-mono text-xs transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'border-[#00F0FF]/40 bg-[#00F0FF]/10 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'border-cyan-400 bg-white hover:bg-cyan-50 text-cyan-800 shadow-sm'
              }`}
            >
              <span>View All Services Details</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-mono text-xs whitespace-nowrap transition-all duration-200 cursor-pointer border select-none ${
                  isActive
                    ? isDark
                      ? 'border-[#00F0FF] bg-[#00F0FF] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                      : 'border-cyan-600 bg-cyan-600 text-white font-bold shadow-sm'
                    : isDark
                    ? 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* High-Performance Smooth Service Cards Grid (Zero Stutter, Native 60fps) */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service: ServiceItem, index: number) => {
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full rounded-3xl border p-6 sm:p-8 md:p-10 transition-all duration-300 relative overflow-hidden shadow-xl transform-gpu ${
                    isDark
                      ? 'border-white/10 bg-[#080816]/90 hover:border-[#00F0FF]/50 shadow-[0_15px_40px_rgba(0,0,0,0.6)]'
                      : 'border-zinc-200 bg-white/95 hover:border-cyan-500 shadow-md'
                  }`}
                >
                  {/* Top Glowing Accent Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${service.accentColor || '#00F0FF'} 50%, transparent 100%)`,
                    }}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    {/* Left Column: Info, Stacks & Features */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                      <div>
                        {/* Telemetry Header */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span
                            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                              isDark
                                ? 'text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30'
                                : 'text-cyan-800 bg-cyan-100 border-cyan-300'
                            }`}
                          >
                            // 0{index + 1}
                          </span>

                          <span className="text-[11px] font-mono text-[#00F0FF] font-semibold uppercase tracking-widest">
                            [{service.categoryTag || 'CORE CAPABILITY'}]
                          </span>

                          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                            CLICK N CREATE · SAAD M
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-display ${
                            isDark ? 'text-white' : 'text-zinc-950'
                          }`}
                        >
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p
                          className={`mt-3 text-sm sm:text-base leading-relaxed ${
                            isDark ? 'text-zinc-300' : 'text-zinc-600'
                          }`}
                        >
                          {service.shortDescription}
                        </p>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                          Engineered With:
                        </span>
                        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                          {service.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className={`px-2.5 py-1 rounded-md border text-[11px] ${
                                isDark
                                  ? 'border-white/10 bg-white/5 text-zinc-300'
                                  : 'border-zinc-200 bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-black/[0.08] dark:border-white/[0.08]">
                        {service.features.slice(0, 4).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs">
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              style={{ color: service.accentColor || '#00F0FF' }}
                            />
                            <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Actions */}
                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <button
                          type="button"
                          onClick={() => onSelectService(service.slug)}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer group/btn ${
                            isDark
                              ? 'border-[#00F0FF]/50 bg-[#00F0FF]/15 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                              : 'border-cyan-600 bg-cyan-50 hover:bg-cyan-600 text-cyan-800 hover:text-white'
                          }`}
                        >
                          <span>Explore Service & Rates</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </button>

                        <span className="text-xs font-mono text-zinc-400">
                          ⏱ {service.typicalTimeline}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Visual Component Display */}
                    <div className="lg:col-span-5">
                      <div
                        className="cursor-pointer"
                        onClick={() => onSelectService(service.slug)}
                      >
                        <AdaptiveServiceImage
                          slug={service.slug}
                          imageSrc={service.image}
                          altText={service.altText}
                          accentColor={service.accentColor || '#00F0FF'}
                          className="w-full aspect-[4/3] rounded-2xl shadow-xl border border-white/10"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
