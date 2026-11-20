import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  DoorOpen,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';
import { SERVICES, ServiceItem } from '../../data/services.ts';
import { SITE_CONFIG } from '../../data/site.ts';
import { useCustomization } from '../../context/CustomizationContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { HeroEmojiActionWidget } from '../HeroEmojiActionWidget.tsx';
import { CityServicesViewport, HOUSE_TOUR_PROGRESS } from './CityServicesViewport.tsx';
import { ServiceInteriorPanel } from './ServiceInteriorPanel.tsx';
import { ExplorationPhase, SERVICE_HOUSE_PALETTES } from './types.ts';

gsap.registerPlugin(ScrollTrigger);

interface CityScrollExperienceProps {
  onNavigate: (path: string) => void;
}

const SPATIAL_CHAPTERS = [
  { id: 'clouds', code: '01', label: 'Above Clouds', targetT: 0.0, minPct: 0, maxPct: 22 },
  { id: 'city', code: '02', label: 'Whole City', targetT: 0.25, minPct: 22, maxPct: 39 },
  { id: 'boulevard', code: '03', label: 'Boulevard', targetT: 0.48, minPct: 39, maxPct: 56 },
  { id: 'houses', code: '04', label: '6 Houses', targetT: 0.6, minPct: 56, maxPct: 101 },
];

export const CityScrollExperience: React.FC<CityScrollExperienceProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('home');
  const servicesCms = getPageContent('services');

  // Preserve 100% of base services data + merge CMS overrides cleanly
  const mergedServices: ServiceItem[] = useMemo(() => {
    const cmsList = servicesCms?.servicesList;
    if (!Array.isArray(cmsList) || cmsList.length === 0) return SERVICES;
    return SERVICES.map((base, idx) => {
      const override = cmsList.find((c: any) => c.slug === base.slug) || cmsList[idx];
      if (!override) return base;
      return {
        ...base,
        title: override.title || base.title,
        shortDescription: override.description || base.shortDescription,
        typicalTimeline: override.turnaround || base.typicalTimeline,
        pricingEstimate: override.rate || base.pricingEstimate,
        deliverables:
          Array.isArray(override.deliverables) && override.deliverables.length > 0
            ? override.deliverables
            : base.deliverables,
      };
    });
  }, [servicesCms]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const labelElementsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const [scrollPercent, setScrollPercent] = useState(0);
  const [selectedHouseIdx, setSelectedHouseIdx] = useState<number | null>(null);
  const [hoveredHouseIdx, setHoveredHouseIdx] = useState<number | null>(null);
  const [tourHouseIdx, setTourHouseIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<ExplorationPhase>('aerial_scroll');
  const [dockCollapsed, setDockCollapsed] = useState(false);

  // Graceful hover persistence so moving pointer from a 3D house to the bottom-left card to click "Learn More" never drops the card
  const hoverClearTimerRef = useRef<number | null>(null);
  const isPointerInCardRef = useRef(false);

  const handleHoverHouse = (idx: number | null) => {
    if (hoverClearTimerRef.current !== null) {
      window.clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
    if (idx !== null) {
      setHoveredHouseIdx(idx);
    } else if (!isPointerInCardRef.current) {
      hoverClearTimerRef.current = window.setTimeout(() => {
        if (!isPointerInCardRef.current) {
          setHoveredHouseIdx(null);
        }
        hoverClearTimerRef.current = null;
      }, 240);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverClearTimerRef.current !== null) {
        window.clearTimeout(hoverClearTimerRef.current);
      }
    };
  }, []);

  // Sync ScrollTrigger across the 880vh Deep Above-Clouds Descent -> Whole City Panorama -> Boulevard -> 6-House Tour runway
  useEffect(() => {
    const triggerEl = wrapperRef.current;
    if (!triggerEl) return;

    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.9,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        const pct = Math.round(self.progress * 100);
        setScrollPercent((prev) => (Math.abs(prev - pct) >= 1 ? pct : prev));
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const scrollToProgress = (targetT: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(1, targetT));
    const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
    const targetY = el.offsetTop + scrollable * clamped;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  };

  const jumpToTourStart = () => {
    scrollToProgress(HOUSE_TOUR_PROGRESS[0] ?? 0.6);
  };

  const handleSelectHouse = (idx: number) => {
    if (scrollProgressRef.current < 0.54) {
      scrollToProgress(HOUSE_TOUR_PROGRESS[idx] ?? 0.99);
    }
    setSelectedHouseIdx(idx);
  };

  const activeTourService =
    tourHouseIdx !== null ? mergedServices[tourHouseIdx] ?? null : null;

  const chapterLabel =
    phase !== 'aerial_scroll'
      ? `House ${mergedServices[selectedHouseIdx ?? 0]?.number ?? '01'} · Service Overview`
      : scrollPercent < 22
      ? '01. High-Altitude Above-Clouds Descent'
      : scrollPercent < 39
      ? '02. Whole-City Panoramic Overlook'
      : scrollPercent < 56
      ? '03. Sapphire Skyscraper Canyon & River Bridge'
      : activeTourService
      ? `House ${activeTourService.number} of 06 · ${activeTourService.title}`
      : '04. The Six Service Houses';

  const midJourneyMessage =
    scrollPercent < 22
      ? 'Descending Deep From Above the Stratospheric Cloud Sea Toward the Metropolis'
      : scrollPercent < 39
      ? 'Wide Panoramic Whole-City Overlook · Blue-Glass Skyline, Skybridges & Maglev'
      : scrollPercent < 50
      ? 'Gliding Cleanly Down Sapphire Boulevard Beneath Twin Skybridges & Maglev Rail'
      : 'Crossing the Illuminated Tied-Arch River Bridge Toward the 6 Service Houses';

  const heroOpacity = Math.max(0, Math.min(1, 1 - scrollPercent / 12));
  const showHeroOverlay = heroOpacity > 0.04 && selectedHouseIdx === null;
  const showMidJourneyBar =
    scrollPercent >= 11 && scrollPercent < 56 && selectedHouseIdx === null;
  const showNeighborhoodDock = scrollPercent >= 56 && selectedHouseIdx === null;

  return (
    <section
      id="services"
      ref={wrapperRef}
      className={`relative w-full h-[780vh] sm:h-[880vh] ${
        isDark ? 'bg-[#060913]' : 'bg-[#CDE0F5]'
      }`}
    >
      {/* Sticky Full-Screen Photorealistic 3D Deep Cloud Descent -> Whole City -> Boulevard -> 6 Houses Stage */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <CityServicesViewport
          services={mergedServices}
          scrollProgressRef={scrollProgressRef}
          selectedIndex={selectedHouseIdx}
          externalHoveredIndex={hoveredHouseIdx}
          onSelectHouse={handleSelectHouse}
          onHoverHouse={handleHoverHouse}
          onTourHouseChange={setTourHouseIdx}
          onPhaseChange={setPhase}
          isDarkMode={isDark}
          labelElementsRef={labelElementsRef}
        />

        {/* Subtle Theme-Aware Atmospheric Contrast Scrim while Hero Text is Visible */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: showHeroOverlay
              ? isDark
                ? 'radial-gradient(circle at 50% 45%, rgba(6,9,19,0.34) 0%, rgba(6,9,19,0.74) 100%)'
                : 'radial-gradient(circle at 50% 44%, rgba(243,246,250,0.78) 0%, rgba(227,238,249,0.46) 62%, rgba(205,224,245,0.22) 100%)'
              : isDark
              ? 'linear-gradient(to bottom, rgba(6,9,19,0.18) 0%, rgba(6,9,19,0) 16%, rgba(6,9,19,0) 86%, rgba(6,9,19,0.28) 100%)'
              : 'none',
          }}
        />

        {/* Projected Ultra-Legible Architectural House Markers synced to the 6 Realistic Homes */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {mergedServices.map((srv, idx) => {
            const isHighlighted = hoveredHouseIdx === idx || tourHouseIdx === idx;
            const pal = SERVICE_HOUSE_PALETTES[idx % SERVICE_HOUSE_PALETTES.length];
            return (
              <button
                key={srv.id}
                ref={(el) => {
                  labelElementsRef.current[idx] = el;
                }}
                type="button"
                onClick={() => handleSelectHouse(idx)}
                onMouseEnter={() => handleHoverHouse(idx)}
                onMouseLeave={() => handleHoverHouse(null)}
                style={{
                  opacity: 0,
                  pointerEvents: 'none',
                }}
                className={`group absolute top-0 left-0 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isDark
                    ? isHighlighted
                      ? 'bg-[#050C18] border-2 border-[#7DD3FC] text-white shadow-[0_0_28px_rgba(56,189,248,0.7),0_10px_30px_rgba(0,0,0,0.98)] scale-105 z-30'
                      : 'bg-[#030712]/96 border-2 border-[#38BDF8] text-white shadow-[0_0_18px_rgba(56,189,248,0.45),0_8px_24px_rgba(0,0,0,0.95)] hover:border-[#7DD3FC]'
                    : isHighlighted
                    ? 'bg-white border-2 border-[#1D4ED8] text-[#0F172A] shadow-[0_10px_26px_rgba(29,78,216,0.24)] scale-105 z-30'
                    : 'bg-white/98 border-2 border-slate-300 text-[#0F172A] shadow-md hover:border-blue-500'
                }`}
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {/* High-visibility glowing number badge */}
                  <span
                    className={`font-mono text-xs font-black tabular-nums px-1.5 py-0.5 rounded ${
                      isDark
                        ? 'bg-[#38BDF8] text-[#020817] shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                        : 'bg-[#1D4ED8] text-white shadow-xs'
                    }`}
                  >
                    {srv.number}
                  </span>

                  {/* Crystal-clear high-contrast service title */}
                  <span
                    className={`font-display text-xs sm:text-[13px] font-extrabold tracking-wide ${
                      isDark
                        ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]'
                        : 'text-[#0F172A]'
                    }`}
                  >
                    {srv.title}
                  </span>

                  {/* Micro action cue */}
                  <span
                    className={`text-[11px] font-bold transition-transform duration-150 ${
                      isDark
                        ? isHighlighted
                          ? 'text-[#38BDF8] translate-x-0.5'
                          : 'text-sky-300/60'
                        : isHighlighted
                        ? 'text-blue-600 translate-x-0.5'
                        : 'text-slate-400'
                    }`}
                  >
                    →
                  </span>
                </div>

                {/* Downward pointing architectural indicator pin targeting the house rooftop */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-b-2 border-r-2 ${
                    isDark
                      ? isHighlighted
                        ? 'bg-[#050C18] border-[#7DD3FC]'
                        : 'bg-[#030712] border-[#38BDF8]'
                      : isHighlighted
                      ? 'bg-white border-[#1D4ED8]'
                      : 'bg-white border-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Sleek Top-Left Futuristic Spatial Chapter Bar */}
        <div className="absolute top-20 sm:top-24 left-4 sm:left-8 z-20 pointer-events-none">
          <div
            className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium shadow-md transition-colors duration-200 ${
              isDark
                ? 'border-[#38BDF8]/25 bg-[#0C1222]/94 text-[#F1F5F9]'
                : 'border-slate-300/95 bg-white/95 text-[#0F172A]'
            }`}
          >
            <span
              className={`w-1.5 h-3.5 rounded-xs shrink-0 ${
                isDark ? 'bg-[#38BDF8]' : 'bg-[#1D4ED8]'
              }`}
            />
            <span
              style={{ color: isDark ? '#7DD3FC' : '#1D4ED8' }}
              className="font-semibold tracking-tight"
            >
              {chapterLabel}
            </span>
            <span
              className={`font-mono tabular-nums text-[11px] ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              · {scrollPercent}%
            </span>
          </div>
        </div>

        {/* Desktop Right-Side Futuristic Spatial Chapter Scrubber Rail (Instant 1-Click Flight Navigation) */}
        {selectedHouseIdx === null && (
          <nav
            aria-label="3D City Flight Chapters"
            className="hidden lg:flex flex-col gap-1.5 absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto"
          >
            <div
              className={`p-2 rounded-2xl border shadow-lg flex flex-col gap-1 ${
                isDark
                  ? 'border-[#38BDF8]/20 bg-[#0C1222]/92'
                  : 'border-slate-300/90 bg-white/94'
              }`}
            >
              {SPATIAL_CHAPTERS.map((chap) => {
                const isActive =
                  scrollPercent >= chap.minPct && scrollPercent < chap.maxPct;
                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => scrollToProgress(chap.targetT)}
                    className={`px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                      isActive
                        ? isDark
                          ? 'bg-[#38BDF8] text-[#040B16] font-bold shadow-[0_4px_14px_rgba(56,189,248,0.3)]'
                          : 'bg-[#1D4ED8] text-white font-bold shadow-[0_4px_14px_rgba(29,78,216,0.28)]'
                        : isDark
                        ? 'text-slate-300 hover:bg-[#131D33] hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        isActive
                          ? isDark
                            ? 'text-[#040B16]/80'
                            : 'text-white/80'
                          : isDark
                          ? 'text-[#38BDF8]'
                          : 'text-[#1D4ED8]'
                      }`}
                    >
                      {chap.code}
                    </span>
                    <span className="text-[11px] font-display tracking-tight">
                      {chap.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* CHAPTER 1: HIGH-LEVEL FUTURISTIC EDITORIAL HERO OVER DEEP VOLUMETRIC CLOUDS */}
        {showHeroOverlay && (
          <div
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 z-20 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
              {/* Quiet Unboxed Identity Kicker */}
              <div
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide pointer-events-auto ${
                  isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                }`}
              >
                <span>{cms.badgeText || `${SITE_CONFIG.freelancer} · Web Developer & Designer`}</span>
                <span aria-hidden="true">·</span>
                <span>{SITE_CONFIG.brand}</span>
              </div>

              {/* Clean Main Headline */}
              <h1
                className={`text-3xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight leading-[1.08] text-balance ${
                  isDark
                    ? 'text-[#F1F5F9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.88)]'
                    : 'text-[#0F172A] drop-shadow-[0_2px_16px_rgba(255,255,255,0.92)]'
                }`}
              >
                {cms.heroTitle || 'Websites & Online Shops'}{' '}
                <span className="text-luxury-gradient">
                  {cms.heroHighlight || 'That Get You Customers.'}
                </span>
              </h1>

              {/* Supporting Copy */}
              <p
                className={`text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal ${
                  isDark
                    ? 'text-slate-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]'
                    : 'text-[#1E293B] font-medium drop-shadow-[0_1px_10px_rgba(255,255,255,0.92)]'
                }`}
              >
                {cms.heroSubtitle ||
                  'I help business owners, shops, and creators get more calls and sales with clean websites that open fast on phones, look professional, and are easy for you to edit anytime.'}
              </p>

              {/* Primary Hero Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap shrink-0 shadow-md ${
                    isDark
                      ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#040B16] shadow-[0_8px_24px_rgba(56,189,248,0.28)]'
                      : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-[0_8px_24px_rgba(29,78,216,0.25)]'
                  }`}
                >
                  <span>Get In Touch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={jumpToTourStart}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                    isDark
                      ? 'border-[#38BDF8]/30 bg-[#0C1222]/92 hover:bg-[#131D33] text-[#F1F5F9]'
                      : 'border-slate-300 bg-white/95 hover:bg-slate-50 text-[#0F172A]'
                  }`}
                >
                  <span>Tour the 6 Service Houses</span>
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/estimator')}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                    isDark
                      ? 'border-white/15 bg-[#0C1222]/88 hover:bg-[#131D33] text-slate-200'
                      : 'border-slate-300 bg-white/94 hover:bg-slate-50 text-[#1E293B]'
                  }`}
                >
                  <span>Instant Price Calculator</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Trust Anchor Pillars */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto w-full text-xs pointer-events-auto">
                {[
                  {
                    icon: Smartphone,
                    title: '100% Mobile Ready',
                    sub: 'Looks sharp on phones',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Clear £35/hr Rate',
                    sub: 'Or fixed project quote',
                  },
                  {
                    icon: MessageSquare,
                    title: 'Direct WhatsApp',
                    sub: 'Quick direct support',
                  },
                  {
                    icon: Zap,
                    title: 'Fast Delivery',
                    sub: '1 – 3 week turnaround',
                  },
                ].map((pillar) => {
                  const IconComp = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className={`p-3 rounded-xl border text-center shadow-sm ${
                        isDark
                          ? 'border-[#38BDF8]/18 bg-[#0C1222]/90 text-[#F1F5F9]'
                          : 'border-slate-300/90 bg-white/95 text-[#0F172A]'
                      }`}
                    >
                      <IconComp
                        className="w-4 h-4 mx-auto mb-1"
                        style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
                      />
                      <span className="font-semibold block text-xs">{pillar.title}</span>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {pillar.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Scroll Cue */}
            <div
              className={`absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[11px] font-medium px-4 py-1.5 rounded-xl border shadow-sm ${
                isDark
                  ? 'border-[#38BDF8]/25 bg-[#0C1222]/92 text-slate-200'
                  : 'border-slate-300/90 bg-white/95 text-[#0F172A]'
              }`}
            >
              <span>Scroll to Descend Through Clouds Over the Whole Futuristic City</span>
              <ArrowDown
                className="w-3.5 h-3.5"
                style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
              />
            </div>

            {/* Bottom-Right Quick Connect Widget */}
            <div className="hidden xl:block absolute bottom-6 right-6 z-30">
              <HeroEmojiActionWidget onNavigate={onNavigate} />
            </div>
          </div>
        )}

        {/* CHAPTER 2–3 HUD: DEEP CLOUD DESCENT -> WHOLE CITY PANORAMA -> SAPPHIRE BOULEVARD */}
        {showMidJourneyBar && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[94vw]">
            <div
              className={`px-4 py-2.5 rounded-xl border text-xs flex items-center gap-3 shadow-lg transition-colors duration-200 ${
                isDark
                  ? 'border-[#38BDF8]/25 bg-[#0C1222]/94 text-[#F1F5F9]'
                  : 'border-slate-300 bg-white/96 text-[#0F172A]'
              }`}
            >
              <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                {midJourneyMessage}
              </span>
              <button
                type="button"
                onClick={jumpToTourStart}
                className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#38BDF8] text-[#040B16] hover:bg-[#7DD3FC]'
                    : 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                }`}
              >
                Jump to House 01
              </button>
            </div>
          </div>
        )}

        {/* CHAPTER 4: LINE-BY-LINE 6 SERVICE HOUSES GUIDED TOUR DOCK */}
        {showNeighborhoodDock && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(980px,94vw)] flex flex-col items-center pointer-events-none">
            <button
              type="button"
              onClick={() => setDockCollapsed((c) => !c)}
              className={`pointer-events-auto mb-1.5 px-3.5 py-1 rounded-t-lg border border-b-0 text-[11px] font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isDark
                  ? 'border-[#38BDF8]/22 bg-[#0C1222]/96 text-slate-300 hover:text-white'
                  : 'border-slate-300 bg-white/96 text-slate-600 hover:text-slate-950'
              }`}
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp
                    className="w-3.5 h-3.5"
                    style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
                  />
                  <span>Show 6 Service Houses</span>
                </>
              ) : (
                <>
                  <ChevronDown
                    className="w-3.5 h-3.5"
                    style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
                  />
                  <span>
                    {activeTourService
                      ? `Visiting House ${activeTourService.number} of 06 · Keep Scrolling for Next House`
                      : 'Select Any House to Open Door & View Service Details'}
                  </span>
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div
                className={`pointer-events-auto w-full rounded-2xl border p-2.5 sm:p-3 shadow-xl space-y-2.5 ${
                  isDark
                    ? 'border-[#38BDF8]/22 bg-[#0C1222]/96'
                    : 'border-slate-200 bg-white/96'
                }`}
              >
                {/* Line-by-Line Active House Spotlight Bar when Camera Visits Each House */}
                {activeTourService && tourHouseIdx !== null && (
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 rounded-xl border ${
                      isDark
                        ? 'bg-[#131D33] border-[#38BDF8]/20 text-[#F1F5F9]'
                        : 'bg-[#F3F6FA] border-slate-200 text-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums shrink-0"
                        style={{
                          backgroundColor: isDark
                            ? 'rgba(56,189,248,0.16)'
                            : 'rgba(29,78,216,0.1)',
                          color: isDark ? '#7DD3FC' : '#1D4ED8',
                        }}
                      >
                        House {activeTourService.number} / 06
                      </span>
                      <span className="font-display text-xs sm:text-sm font-bold truncate">
                        {activeTourService.title}
                      </span>
                      <span
                        className={`hidden md:inline text-xs truncate ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        · {activeTourService.pricingEstimate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectHouse(tourHouseIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#38BDF8] text-[#040B16] hover:bg-[#7DD3FC]'
                            : 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                        }`}
                      >
                        <DoorOpen className="w-3.5 h-3.5" />
                        <span>Open Door</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (tourHouseIdx < mergedServices.length - 1) {
                            scrollToProgress(HOUSE_TOUR_PROGRESS[tourHouseIdx + 1] ?? 0.995);
                          } else {
                            scrollToProgress(0.995);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer ${
                          isDark
                            ? 'border-[#38BDF8]/25 bg-[#0C1222] hover:bg-[#1A2845] text-slate-200'
                            : 'border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A]'
                        }`}
                      >
                        <span>
                          {tourHouseIdx < mergedServices.length - 1 ? 'Next House' : 'All 6 View'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* All 6 Service Houses Selector Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {mergedServices.map((srv, idx) => {
                    const isHov = hoveredHouseIdx === idx;
                    const isTourFocus = tourHouseIdx === idx;
                    const pal = SERVICE_HOUSE_PALETTES[idx % SERVICE_HOUSE_PALETTES.length];
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleSelectHouse(idx)}
                        onMouseEnter={() => setHoveredHouseIdx(idx)}
                        onMouseLeave={() => setHoveredHouseIdx(null)}
                        style={{
                          borderColor:
                            isTourFocus || isHov
                              ? isDark
                                ? '#38BDF8'
                                : '#1D4ED8'
                              : undefined,
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isTourFocus
                            ? isDark
                              ? 'bg-[#172542] text-[#F1F5F9] shadow-md'
                              : 'bg-[#E6EEF8] text-[#0F172A] shadow-sm'
                            : isDark
                            ? 'bg-[#111A2E] border-white/8 hover:bg-[#172542] text-[#F1F5F9]'
                            : 'bg-[#F8FAFC] border-slate-200 hover:bg-slate-100 text-[#0F172A]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className="font-mono text-[11px] font-bold tabular-nums"
                            style={{ color: isDark ? '#7DD3FC' : pal.accentCss }}
                          >
                            House {srv.number}
                          </span>
                          <DoorOpen
                            className="w-3.5 h-3.5"
                            style={{ color: isDark ? '#38BDF8' : pal.accentCss }}
                          />
                        </div>
                        <span className="font-display text-xs font-bold leading-snug line-clamp-2">
                          {srv.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DOOR TRANSITION PROMPT (Approaching & Opening Wooden Front Door) */}
        {(phase === 'approaching_door' || phase === 'opening_door') &&
          selectedHouseIdx !== null && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              <div
                className={`px-5 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-3 shadow-xl ${
                  isDark
                    ? 'border-[#38BDF8]/30 bg-[#0C1222]/96 text-[#F1F5F9]'
                    : 'border-slate-300 bg-white/96 text-[#0F172A]'
                }`}
              >
                <DoorOpen
                  className="w-4 h-4"
                  style={{ color: isDark ? '#38BDF8' : '#1D4ED8' }}
                />
                <span>
                  {phase === 'approaching_door'
                    ? `Arriving at ${mergedServices[selectedHouseIdx]?.title}...`
                    : `Opening Door · Loading ${mergedServices[selectedHouseIdx]?.title}...`}
                </span>
              </div>
            </div>
          )}

        {/* BOTTOM-LEFT SERVICE HOVER CARD (Appears when hovering any 3D house or rooftop marker) */}
        {hoveredHouseIdx !== null && selectedHouseIdx === null && (
          <div
            onMouseEnter={() => {
              isPointerInCardRef.current = true;
              if (hoverClearTimerRef.current !== null) {
                window.clearTimeout(hoverClearTimerRef.current);
                hoverClearTimerRef.current = null;
              }
            }}
            onMouseLeave={() => {
              isPointerInCardRef.current = false;
              handleHoverHouse(null);
            }}
            className="absolute bottom-5 left-5 z-40 max-w-[350px] w-[calc(100vw-2.5rem)] pointer-events-auto transition-all duration-150"
          >
            {(() => {
              const hovSrv = mergedServices[hoveredHouseIdx];
              const pal = SERVICE_HOUSE_PALETTES[hoveredHouseIdx % SERVICE_HOUSE_PALETTES.length];
              if (!hovSrv) return null;
              return (
                <div
                  className={`p-4 rounded-2xl border-2 shadow-2xl flex flex-col gap-3 ${
                    isDark
                      ? 'border-[#38BDF8] bg-[#030712]/98 text-white shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(56,189,248,0.35)] backdrop-blur-md'
                      : 'border-slate-300 bg-white text-slate-900 shadow-[0_18px_44px_rgba(15,23,42,0.16)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className="font-mono font-bold tracking-tight"
                      style={{ color: isDark ? '#38BDF8' : pal.accentCss }}
                    >
                      House {hovSrv.number} · {hovSrv.categoryTag.split('·')[0]?.trim()}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-semibold tabular-nums ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {hovSrv.pricingEstimate}
                    </span>
                  </div>

                  <div>
                    <h4
                      className={`font-display text-base font-extrabold tracking-tight mb-1 ${
                        isDark ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]' : 'text-slate-950'
                      }`}
                    >
                      {hovSrv.title}
                    </h4>
                    <p
                      className={`text-xs line-clamp-2 leading-relaxed ${
                        isDark ? 'text-slate-100' : 'text-slate-600'
                      }`}
                    >
                      {hovSrv.shortDescription}
                    </p>
                  </div>

                  {hovSrv.deliverables && hovSrv.deliverables.length > 0 && (
                    <div
                      className={`text-[11px] leading-snug ${
                        isDark ? 'text-sky-300 font-medium' : 'text-slate-600'
                      }`}
                    >
                      {hovSrv.deliverables.slice(0, 2).join(' · ')}
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-between pt-2.5 border-t ${
                      isDark ? 'border-sky-300/25' : 'border-slate-200'
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {hovSrv.typicalTimeline}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        isPointerInCardRef.current = false;
                        handleSelectHouse(hoveredHouseIdx);
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-md whitespace-nowrap shrink-0 ${
                        isDark
                          ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#020817] shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                          : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-xs'
                      }`}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* CINEMATIC MOTION SERVICE DATA PRESENTATION (Opens Directly When Door Swings Open) */}
        <ServiceInteriorPanel
          service={selectedHouseIdx !== null ? mergedServices[selectedHouseIdx] || null : null}
          serviceIndex={selectedHouseIdx}
          totalServices={mergedServices.length}
          visible={phase === 'inside_house' && selectedHouseIdx !== null}
          onExitHouse={() => setSelectedHouseIdx(null)}
          onSwitchHouse={(idx) => setSelectedHouseIdx(idx)}
          onNavigate={onNavigate}
        />
      </div>
    </section>
  );
};
