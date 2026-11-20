import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
  Calculator,
  PoundSterling,
} from 'lucide-react';
import { ServiceItem } from '../../data/services.ts';
import { useTheme } from '../../context/ThemeContext.tsx';
import { SERVICE_HOUSE_PALETTES } from './types.ts';

interface ServiceInteriorPanelProps {
  service: ServiceItem | null;
  serviceIndex: number | null;
  totalServices: number;
  visible: boolean;
  onExitHouse: () => void;
  onSwitchHouse: (index: number) => void;
  onNavigate: (path: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * Full-Cinematic Service Presentation Overlay revealed smoothly with choreographed Motion effects
 * when any house door opens (replacing a cluttered 3D room interior with crystal-clear, animated
 * service data, deliverables, £35/hr transparent pricing, tech stack, and FAQs).
 */
export const ServiceInteriorPanel: React.FC<ServiceInteriorPanelProps> = ({
  service,
  serviceIndex,
  totalServices,
  visible,
  onExitHouse,
  onSwitchHouse,
  onNavigate,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'overview' | 'deliverables' | 'faqs'>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Reset tab & FAQ state cleanly when switching between houses
  useEffect(() => {
    setActiveTab('overview');
    setOpenFaq(0);
  }, [serviceIndex]);

  if (!service || serviceIndex === null) return null;

  const pal = SERVICE_HOUSE_PALETTES[serviceIndex % SERVICE_HOUSE_PALETTES.length];
  const prevIdx = (serviceIndex - 1 + totalServices) % totalServices;
  const nextIdx = (serviceIndex + 1) % totalServices;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`door-reveal-${service.id}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`absolute inset-0 z-30 flex flex-col pt-16 sm:pt-20 px-3 sm:px-6 pb-3 sm:pb-6 pointer-events-auto transition-colors ${
            isDark ? 'bg-[#060A15]/95 text-slate-100' : 'bg-[#F3F6FA]/96 text-slate-900'
          }`}
        >
          {/* Centered Futuristic Architectural Editorial Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 18 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-5xl mx-auto flex-1 min-h-0 flex flex-col rounded-2xl border overflow-hidden shadow-2xl ${
              isDark
                ? 'bg-[#0B1222] border-[#38BDF8]/22 shadow-[0_24px_70px_rgba(2,8,23,0.85)]'
                : 'bg-white border-slate-200/95 shadow-[0_24px_64px_rgba(15,23,42,0.12)]'
            }`}
          >
            {/* Top Navigation Strip inside Service Reveal */}
            <motion.div
              variants={itemVariants}
              className={`px-4 sm:px-7 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                isDark ? 'border-white/10 bg-[#0F182D]' : 'border-slate-200 bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={onExitHouse}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isDark
                      ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-100'
                      : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Street</span>
                </button>

                <div
                  className={`hidden sm:block h-4 w-px ${
                    isDark ? 'bg-white/12' : 'bg-slate-300'
                  }`}
                />

                {/* Clean unboxed typographic metadata (Zero-Pill discipline) */}
                <div className="flex items-center gap-2 text-xs min-w-0 truncate">
                  <span
                    className="font-mono font-bold tabular-nums shrink-0"
                    style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
                  >
                    House {service.number}
                  </span>
                  <span aria-hidden="true" className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                    ·
                  </span>
                  <span className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {service.categoryTag}
                  </span>
                </div>
              </div>

              {/* Clean House Switcher Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onSwitchHouse(prevIdx)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                    isDark
                      ? 'border-white/12 hover:bg-white/10 text-slate-200'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                  aria-label="Previous Service House"
                  title="Previous Service House"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span
                  className={`font-mono text-xs tabular-nums px-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {serviceIndex + 1} / {totalServices}
                </span>
                <button
                  type="button"
                  onClick={() => onSwitchHouse(nextIdx)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                    isDark
                      ? 'border-white/12 hover:bg-white/10 text-slate-200'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                  aria-label="Next Service House"
                  title="Next Service House"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Scrollable Animated Service Content Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-5 sm:py-6 space-y-6">
              {/* Hero Title + Transparent Rate & Timeline Row */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col lg:flex-row lg:items-start justify-between gap-5"
              >
                <div className="space-y-2.5 max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-balance">
                    {service.title}
                  </h2>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {service.fullDescription}
                  </p>
                </div>

                {/* Key Commercial Figures (Clean Hairline Surfaces) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 shrink-0 lg:w-72">
                  <div
                    className={`p-3.5 rounded-xl border ${
                      isDark
                        ? 'bg-[#101A30] border-[#38BDF8]/18'
                        : 'bg-[#F8FAFC] border-slate-200'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${
                        isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                      }`}
                    >
                      <PoundSterling className="w-3.5 h-3.5" />
                      <span>Investment &amp; Rate</span>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">
                      {service.pricingEstimate}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {service.rateNote}
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${
                      isDark
                        ? 'bg-[#101A30] border-[#38BDF8]/18'
                        : 'bg-[#F8FAFC] border-slate-200'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${
                        isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Typical Turnaround</span>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">
                      {service.typicalTimeline}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Segmented Navigation Tabs */}
              <motion.div
                variants={itemVariants}
                className={`flex flex-wrap items-center gap-1.5 pb-3 border-b ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                {[
                  { id: 'overview', label: 'What You Get & Stack' },
                  { id: 'deliverables', label: 'Deliverables & Scope' },
                  { id: 'faqs', label: `Common Questions (${service.faqs.length})` },
                ].map((t) => {
                  const isTab = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id as 'overview' | 'deliverables' | 'faqs')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isTab
                          ? isDark
                            ? 'bg-[#38BDF8] text-[#040B16]'
                            : 'bg-[#1D4ED8] text-white'
                          : isDark
                          ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </motion.div>

              {/* Animated Tab Views */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="tab-overview"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    <div className="lg:col-span-8 space-y-3">
                      <h3
                        className={`text-sm font-semibold ${
                          isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                        }`}
                      >
                        Core Capabilities &amp; Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feat, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.32,
                              delay: i * 0.04,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className={`p-3.5 rounded-xl border text-xs sm:text-[13px] leading-relaxed flex items-start gap-2.5 ${
                              isDark
                                ? 'bg-[#101A30] border-white/8 text-slate-200'
                                : 'bg-[#F8FAFC] border-slate-200 text-slate-800'
                            }`}
                          >
                            <CheckCircle2
                              className="w-4 h-4 shrink-0 mt-0.5"
                              style={{ color: isDark ? '#38BDF8' : pal.accentCss }}
                            />
                            <span>{feat}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-5">
                      <div>
                        <h3
                          className={`text-sm font-semibold mb-2 ${
                            isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                          }`}
                        >
                          Technologies &amp; Tools
                        </h3>
                        <p
                          className={`text-xs sm:text-[13px] leading-relaxed ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {service.techStack.join(' · ')}
                        </p>
                      </div>

                      <div
                        className={`pt-4 border-t ${
                          isDark ? 'border-white/10' : 'border-slate-200'
                        }`}
                      >
                        <h3
                          className={`text-sm font-semibold mb-2.5 ${
                            isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                          }`}
                        >
                          Ideal For
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-[13px]">
                          {service.suitableFor.map((item, i) => (
                            <li
                              key={i}
                              className={`flex items-start gap-2 ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              <span
                                className="font-bold"
                                style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
                              >
                                –
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'deliverables' && (
                  <motion.div
                    key="tab-deliverables"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="space-y-3">
                      <h3
                        className={`text-sm font-semibold ${
                          isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                        }`}
                      >
                        Handover Deliverables
                      </h3>
                      <ul className="space-y-2.5">
                        {service.deliverables.map((del, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: i * 0.04,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className={`p-3.5 rounded-xl border text-xs sm:text-[13px] flex items-start gap-2.5 ${
                              isDark
                                ? 'bg-[#101A30] border-white/8 text-slate-200'
                                : 'bg-[#F8FAFC] border-slate-200 text-slate-800'
                            }`}
                          >
                            <Layers
                              className="w-4 h-4 shrink-0 mt-0.5"
                              style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
                            />
                            <span>{del}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <h3
                          className={`text-sm font-semibold mb-2.5 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-800'
                          }`}
                        >
                          Included in Scope
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-[13px]">
                          {service.scopeInclusions.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2
                                className={`w-4 h-4 shrink-0 mt-0.5 ${
                                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                                }`}
                              />
                              <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                                {inc}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div
                        className={`p-4 rounded-xl border ${
                          isDark
                            ? 'bg-white/[0.02] border-white/10'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <h3
                          className={`text-xs font-semibold mb-2 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          External Pass-Through Costs (Not Included)
                        </h3>
                        <ul
                          className={`space-y-1.5 text-xs ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {service.scopeExclusions.map((exc, i) => (
                            <li key={i}>– {exc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'faqs' && (
                  <motion.div
                    key="tab-faqs"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-2.5"
                  >
                    {service.faqs.map((faq, i) => {
                      const isOpen = openFaq === i;
                      return (
                        <div
                          key={i}
                          className={`rounded-xl border overflow-hidden ${
                            isDark
                              ? 'bg-[#101A30] border-white/10'
                              : 'bg-[#F8FAFC] border-slate-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaq(isOpen ? null : i)}
                            className="w-full p-4 flex items-center justify-between gap-4 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`w-4 h-4 shrink-0 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
                            />
                          </button>
                          {isOpen && (
                            <div
                              className={`px-4 pb-4 text-xs sm:text-[13px] leading-relaxed ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clean Footer Action Bar */}
            <motion.div
              variants={itemVariants}
              className={`px-4 sm:px-7 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                isDark ? 'border-white/10 bg-[#0F182D]' : 'border-slate-200 bg-[#F8FAFC]'
              }`}
            >
              <button
                type="button"
                onClick={() => onNavigate(`/services/${service.slug}`)}
                className={`text-xs font-semibold inline-flex items-center gap-1.5 hover:underline whitespace-nowrap shrink-0 cursor-pointer ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`}
              >
                <span>Open Full Service Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('/estimator')}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isDark
                      ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-100'
                      : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Calculate Quote</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 shadow-sm cursor-pointer ${
                    isDark
                      ? 'bg-[#38BDF8] text-[#040B16]'
                      : 'bg-[#1D4ED8] text-white'
                  }`}
                >
                  <span>Enquire About This Service</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
