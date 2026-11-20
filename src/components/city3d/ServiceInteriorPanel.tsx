import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  ChevronDown,
  Calculator,
  PoundSterling,
  Eye,
  FileText,
} from 'lucide-react';
import { ServiceItem } from '../../data/services.ts';
import { useTheme } from '../../context/ThemeContext.tsx';

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
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.05,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * Editorial Service Presentation Overlay revealed when any 3D Service House door opens,
 * synced 1:1 with the full 6-service editorial information.
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
  const [activeTab, setActiveTab] = useState<'capabilities' | 'approach' | 'faqs'>('capabilities');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [viewRoomOnly, setViewRoomOnly] = useState(false);

  useEffect(() => {
    setActiveTab('capabilities');
    setOpenFaq(0);
    setViewRoomOnly(false);
  }, [serviceIndex, visible]);

  if (!service || serviceIndex === null) return null;

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
          className={`absolute inset-0 z-30 flex flex-col pt-16 sm:pt-20 px-3 sm:px-6 pb-3 sm:pb-6 transition-colors ${
            viewRoomOnly
              ? 'pointer-events-none justify-end bg-transparent'
              : isDark
              ? 'pointer-events-auto bg-[#080A14]/56 text-[#FAF6F0]'
              : 'pointer-events-auto bg-[#0F172A]/28 text-slate-900'
          }`}
        >
          {viewRoomOnly ? (
            <motion.div
              key="room-inspect-dock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto w-full max-w-3xl mx-auto mb-2 px-4 py-3 rounded-2xl border shadow-2xl flex flex-wrap items-center justify-between gap-3 ${
                isDark
                  ? 'bg-[#0B0D18]/92 border-[#F59E0B]/35 text-[#FAF6F0] shadow-[0_18px_48px_rgba(4,5,12,0.85)]'
                  : 'bg-white/95 border-sky-200 text-slate-900 shadow-[0_18px_44px_rgba(15,23,42,0.18)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={onExitHouse}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isDark
                      ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-100'
                      : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Street</span>
                </button>
                <div className="min-w-0">
                  <span
                    className="font-mono text-[11px] font-bold block leading-tight"
                    style={{ color: isDark ? '#F59E0B' : '#1D6FD8' }}
                  >
                    House {service.number} · 3D Studio Interior
                  </span>
                  <span className="font-display text-xs sm:text-sm font-bold truncate block">
                    {service.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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
                  className={`font-mono text-xs tabular-nums px-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {serviceIndex + 1}/{totalServices}
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

                <button
                  type="button"
                  onClick={() => setViewRoomOnly(false)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 cursor-pointer ${
                    isDark
                      ? 'bg-[#F59E0B] text-[#0B0D18]'
                      : 'bg-[#1D6FD8] text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Show Service Details</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 14 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-5xl mx-auto flex-1 min-h-0 flex flex-col rounded-2xl border overflow-hidden shadow-2xl ${
                isDark
                  ? 'bg-[#0B0D18]/94 border-[#F59E0B]/28 shadow-[0_24px_70px_rgba(4,5,12,0.88)]'
                  : 'bg-white/95 border-sky-200/95 shadow-[0_24px_64px_rgba(15,23,42,0.16)]'
              }`}
            >
            {/* Top Navigation Strip */}
            <motion.div
              variants={itemVariants}
              className={`px-4 sm:px-7 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                isDark ? 'border-white/10 bg-[#131627]' : 'border-sky-100 bg-[#F4F8FC]'
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

                <div className="flex items-center gap-2 text-xs min-w-0 truncate">
                  <span
                    className="font-mono font-bold tabular-nums shrink-0"
                    style={{ color: isDark ? '#F59E0B' : '#1D6FD8' }}
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

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewRoomOnly(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer mr-1 ${
                    isDark
                      ? 'border-[#F59E0B]/35 bg-[#F59E0B]/12 hover:bg-[#F59E0B]/22 text-[#FCD34D]'
                      : 'border-sky-300 bg-sky-50 hover:bg-sky-100 text-[#1D6FD8]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect 3D Interior</span>
                </button>
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

            {/* Scrollable Editorial Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-5 sm:py-6 space-y-6">
              {/* Hero Title + Commercial Summary */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col lg:flex-row lg:items-start justify-between gap-5"
              >
                <div className="space-y-2.5 max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-balance">
                    {service.title}
                  </h2>
                  <p
                    className={`text-sm sm:text-base font-semibold ${
                      isDark ? 'text-[#FCD34D]' : 'text-[#1D6FD8]'
                    }`}
                  >
                    {service.tagline}
                  </p>
                  <div className="space-y-2.5 pt-1">
                    {service.introParagraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 shrink-0 lg:w-68">
                  <div
                    className={`p-3.5 rounded-xl border ${
                      isDark
                        ? 'bg-[#131627] border-[#F59E0B]/22'
                        : 'bg-[#F4F8FC] border-sky-200'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${
                        isDark ? 'text-[#F59E0B]' : 'text-[#1D6FD8]'
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
                        ? 'bg-[#131627] border-[#F59E0B]/22'
                        : 'bg-[#F4F8FC] border-sky-200'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${
                        isDark ? 'text-[#F59E0B]' : 'text-[#1D6FD8]'
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

              {/* Segmented Tabs */}
              <motion.div
                variants={itemVariants}
                className={`flex flex-wrap items-center gap-1.5 pb-3 border-b ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                {[
                  { id: 'capabilities', label: `Core Capabilities (${service.coreCapabilities.length})` },
                  { id: 'approach', label: 'Approach, Tech & Result' },
                  { id: 'faqs', label: `Common Questions (${service.faqs.length})` },
                ].map((t) => {
                  const isTab = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id as 'capabilities' | 'approach' | 'faqs')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isTab
                          ? isDark
                            ? 'bg-[#F59E0B] text-[#0B0D18]'
                            : 'bg-[#1D6FD8] text-white'
                          : isDark
                          ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                          : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </motion.div>

              {/* Tab Views */}
              <AnimatePresence mode="wait">
                {activeTab === 'capabilities' && (
                  <motion.div
                    key="tab-capabilities"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* Spotlight */}
                    <div
                      className={`p-4 sm:p-5 rounded-xl border space-y-2 ${
                        isDark
                          ? 'bg-[#131627] border-[#F59E0B]/22'
                          : 'bg-[#F4F8FC] border-sky-200'
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold block ${
                          isDark ? 'text-[#F59E0B]' : 'text-[#1D6FD8]'
                        }`}
                      >
                        {service.spotlight.kicker}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold font-display">
                        {service.spotlight.heading}
                      </h3>
                      <div className="space-y-2">
                        {service.spotlight.paragraphs.map((p, idx) => (
                          <p
                            key={idx}
                            className={`text-xs sm:text-[13px] leading-relaxed ${
                              isDark ? 'text-slate-300' : 'text-slate-600'
                            }`}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Numbered Core Capabilities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.coreCapabilities.map((cap, idx) => (
                        <div
                          key={cap.title}
                          className={`p-4 rounded-xl border space-y-2 ${
                            isDark
                              ? 'bg-[#131627]/80 border-white/10'
                              : 'bg-[#F4F8FC] border-sky-200/80'
                          }`}
                        >
                          <div className="flex items-baseline gap-2">
                            <span
                              className={`font-mono text-xs font-bold tabular-nums shrink-0 ${
                                isDark ? 'text-[#F59E0B]' : 'text-[#1D6FD8]'
                              }`}
                            >
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <h4 className="text-sm font-bold font-display">{cap.title}</h4>
                          </div>
                          {cap.subtitle && (
                            <p
                              className={`text-xs font-semibold ${
                                isDark ? 'text-[#FCD34D]' : 'text-[#1D6FD8]'
                              }`}
                            >
                              {cap.subtitle}
                            </p>
                          )}
                          <div className="space-y-2">
                            {cap.paragraphs.map((p, pIdx) => (
                              <p
                                key={pIdx}
                                className={`text-xs leading-relaxed ${
                                  isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'approach' && (
                  <motion.div
                    key="tab-approach"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div
                        className={`p-5 rounded-xl border space-y-3 ${
                          isDark
                            ? 'bg-[#131627]/85 border-white/10'
                            : 'bg-[#F4F8FC] border-sky-200'
                        }`}
                      >
                        <h3
                          className={`text-sm font-bold font-display ${
                            isDark ? 'text-[#FCD34D]' : 'text-[#1D6FD8]'
                          }`}
                        >
                          {service.approachSection.title}
                        </h3>
                        <div className="space-y-2.5">
                          {service.approachSection.paragraphs.map((p, idx) => (
                            <p
                              key={idx}
                              className={`text-xs sm:text-[13px] leading-relaxed ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {service.technologySection && (
                          <div
                            className={`p-5 rounded-xl border space-y-2.5 ${
                              isDark
                                ? 'bg-[#131627]/85 border-white/10'
                                : 'bg-[#F4F8FC] border-sky-200'
                            }`}
                          >
                            <h3
                              className={`text-sm font-bold font-display ${
                                isDark ? 'text-[#FCD34D]' : 'text-[#1D6FD8]'
                              }`}
                            >
                              {service.technologySection.title}
                            </h3>
                            {service.technologySection.paragraphs.map((p, idx) => (
                              <p
                                key={idx}
                                className={`text-xs sm:text-[13px] leading-relaxed ${
                                  isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {p}
                              </p>
                            ))}
                            <p
                              className={`text-xs font-mono pt-1 ${
                                isDark ? 'text-[#F59E0B]' : 'text-[#1D6FD8]'
                              }`}
                            >
                              {service.techStack.join(' · ')}
                            </p>
                          </div>
                        )}

                        <div
                          className={`p-5 rounded-xl border space-y-2 ${
                            isDark
                              ? 'bg-[#131627]/85 border-[#F59E0B]/25'
                              : 'bg-[#F4F8FC] border-sky-200'
                          }`}
                        >
                          <span
                            className={`text-xs font-semibold block ${
                              isDark ? 'text-[#F59E0B]' : 'text-[#1D6FD8]'
                            }`}
                          >
                            {service.resultSection.kicker}
                          </span>
                          <h3 className="text-sm font-bold font-display">
                            {service.resultSection.heading}
                          </h3>
                          {service.resultSection.paragraphs.map((p, idx) => (
                            <p
                              key={idx}
                              className={`text-xs sm:text-[13px] leading-relaxed ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Personal Sign-Off Note */}
                    <div
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark
                          ? 'bg-white/[0.02] border-white/10'
                          : 'bg-[#F4F8FC] border-sky-200'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold font-display">
                          {service.closingCta.heading}
                        </p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {service.closingCta.description}
                        </p>
                      </div>
                      <div className="text-xs shrink-0 sm:text-right">
                        <span className="font-semibold block">{service.closingCta.signOffName}</span>
                        <span className={isDark ? 'text-[#FCD34D]' : 'text-[#1D6FD8]'}>
                          {service.closingCta.signOffBrand}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'faqs' && (
                  <motion.div
                    key="tab-faqs"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2.5"
                  >
                    {service.faqs.map((faq, i) => {
                      const isOpen = openFaq === i;
                      return (
                        <div
                          key={i}
                          className={`rounded-xl border overflow-hidden ${
                            isDark
                              ? 'bg-[#131627] border-white/10'
                              : 'bg-[#F4F8FC] border-sky-200'
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
                              style={{ color: isDark ? '#F59E0B' : '#1D6FD8' }}
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

            {/* Footer Action Bar */}
            <motion.div
              variants={itemVariants}
              className={`px-4 sm:px-7 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                isDark ? 'border-white/10 bg-[#131627]' : 'border-sky-100 bg-[#F4F8FC]'
              }`}
            >
              <button
                type="button"
                onClick={() => onNavigate(`/services/${service.slug}`)}
                className={`text-xs font-semibold inline-flex items-center gap-1.5 hover:underline whitespace-nowrap shrink-0 cursor-pointer ${
                  isDark ? 'text-[#F59E0B]' : 'text-[#1D6FD8]'
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
                      ? 'bg-[#F59E0B] text-[#0B0D18]'
                      : 'bg-[#1D6FD8] text-white'
                  }`}
                >
                  <span>Enquire About This Service</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
