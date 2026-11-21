import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
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
import { ExplorationPhase, HOUSE_TOUR_PROGRESS, SERVICE_HOUSE_PALETTES } from './types.ts';

const CityServicesViewport = lazy(() =>
  import('./CityServicesViewport.tsx').then((m) => ({ default: m.CityServicesViewport }))
);
const ServiceInteriorPanel = lazy(() =>
  import('./ServiceInteriorPanel.tsx').then((m) => ({ default: m.ServiceInteriorPanel }))
);

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
  const [hasOpenedInterior, setHasOpenedInterior] = useState(false);
  const prefetchedInteriorRef = useRef(false);

  // Prefetch the interactive house interior panel as visitor nears the neighborhood
  useEffect(() => {
    if (!prefetchedInteriorRef.current && (scrollPercent >= 50 || selectedHouseIdx !== null)) {
      prefetchedInteriorRef.current = true;
      import('./ServiceInteriorPanel.tsx').catch(() => {});
    }
  }, [scrollPercent, selectedHouseIdx]);

  // Graceful hover persistence so moving pointer from a 3D house to the bottom-left card to click "Learn More" never drops the card
  const hoverClearTimerRef = useRef<number | null>(null);
  const isPointerInCardRef = useRef(false);

  const canHoverHouses = () =>
    typeof window !== 'undefined' &&
    window.innerWidth >= 768 &&
    !window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const handleHoverHouse = (idx: number | null) => {
    if (hoverClearTimerRef.current !== null) {
      window.clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
    if (idx !== null && !canHoverHouses()) {
      setHoveredHouseIdx(null);
      return;
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
    const onResize = () => {
      if (!canHoverHouses()) {
        setHoveredHouseIdx(null);
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
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
    setHasOpenedInterior(true);
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
      ? '02. Whole Riverside City Panorama'
      : scrollPercent < 56
      ? '03. Waterfront Skyline & Multi-Arch Bridge'
      : activeTourService
      ? `House ${activeTourService.number} of 06 · ${activeTourService.title}`
      : '04. The Six Service Houses';

  const heroOpacity = Math.max(0, Math.min(1, 1 - scrollPercent / 12));
  const showHeroOverlay = heroOpacity > 0.04 && selectedHouseIdx === null;
  const showNeighborhoodDock = scrollPercent >= 56 && selectedHouseIdx === null;

  return (
    <section
      id="services"
      ref={wrapperRef}
      className={`relative w-full h-[800vh] sm:h-[900vh] ${
        isDark ? 'bg-[#080F20]' : 'bg-[#DDD6C8]'
      }`}
    >
      {/* Sticky Full-Screen Photorealistic 3D Deep Cloud Descent -> Whole City -> Boulevard -> 6 Houses Stage */}
      <div
        className={`sticky top-0 h-[100dvh] w-full overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-[#060C1A] via-[#0B162C] to-[#1A1614]'
            : 'bg-gradient-to-b from-[#3E6A96] via-[#89A5BD] to-[#DDD6C8]'
        }`}
      >
        <Suspense fallback={null}>
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
        </Suspense>

        {/* Subtle Theme-Aware Atmospheric Contrast Scrim while Hero Text is Visible */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: showHeroOverlay
              ? isDark
                ? 'radial-gradient(circle at 50% 45%, rgba(8,15,32,0.38) 0%, rgba(8,15,32,0.74) 100%)'
                : 'radial-gradient(circle at 50% 44%, rgba(244,238,228,0.72) 0%, rgba(221,214,200,0.42) 62%, rgba(168,192,212,0.16) 100%)'
              : isDark
              ? 'linear-gradient(to bottom, rgba(8,15,32,0.18) 0%, rgba(8,15,32,0) 16%, rgba(8,15,32,0) 86%, rgba(8,15,32,0.28) 100%)'
              : 'none',
          }}
        />

        {/* Projected Ultra-Legible Architectural House Markers synced to the 6 Realistic Homes */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {mergedServices.map((srv, idx) => {
            const isHighlighted = hoveredHouseIdx === idx || tourHouseIdx === idx;
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
                className={`group absolute top-0 left-0 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                  isDark
                    ? isHighlighted
                      ? 'bg-[#0B0D18]/96 border border-[#FDE68A] text-white shadow-[0_0_18px_rgba(245,158,11,0.58),0_6px_18px_rgba(0,0,0,0.92)] z-30'
                      : 'bg-[#090B15]/94 border border-[#F59E0B]/85 text-white shadow-[0_0_12px_rgba(245,158,11,0.34),0_4px_14px_rgba(0,0,0,0.88)] hover:border-[#FDE68A]'
                    : isHighlighted
                    ? 'bg-white/98 border border-[#1D6FD8] text-[#0F172A] shadow-[0_6px_18px_rgba(29,111,216,0.24)] z-30'
                    : 'bg-white/95 border border-slate-300/95 text-[#0F172A] shadow-sm hover:border-[#1D6FD8]'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                  {/* Compact high-visibility number badge */}
                  <span
                    className={`font-mono text-[8.5px] sm:text-[10px] font-extrabold tabular-nums px-1 py-0.5 rounded leading-none shrink-0 ${
                      isDark
                        ? 'bg-[#F59E0B] text-[#0B0D18]'
                        : 'bg-[#1D6FD8] text-white'
                    }`}
                  >
                    {srv.number}
                  </span>

                  {/* Clean compact service title (never oversized or overflowing on mobile) */}
                  <span
                    className={`font-sans text-[9.5px] sm:text-[11px] font-bold tracking-tight leading-tight max-w-[106px] sm:max-w-[168px] truncate ${
                      isDark
                        ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                        : 'text-[#0F172A]'
                    }`}
                  >
                    {srv.title}
                  </span>

                  {/* Subtle action cue on tablet/desktop */}
                  <span
                    className={`hidden sm:inline text-[10px] font-bold transition-transform duration-150 ${
                      isDark
                        ? isHighlighted
                          ? 'text-[#FDE68A] translate-x-0.5'
                          : 'text-amber-300/75'
                        : isHighlighted
                        ? 'text-[#1D6FD8] translate-x-0.5'
                        : 'text-slate-400'
                    }`}
                  >
                    →
                  </span>
                </div>

                {/* Compact downward architectural indicator pin targeting the house rooftop */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-b border-r ${
                    isDark
                      ? isHighlighted
                        ? 'bg-[#0B0D18] border-[#FDE68A]'
                        : 'bg-[#090B15] border-[#F59E0B]/85'
                      : isHighlighted
                      ? 'bg-white border-[#1D6FD8]'
                      : 'bg-white border-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Sleek Top-Left Spatial Chapter Bar (shown cleanly once user starts scrolling past Hero so it never overlaps Hero headline) */}
        {(!showHeroOverlay || scrollPercent >= 8 || phase !== 'aerial_scroll') && (
          <div className="fixed sm:absolute top-[74px] sm:top-24 left-3 sm:left-8 z-20 pointer-events-none">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-medium shadow-md transition-colors duration-200 max-w-[calc(100vw-1.5rem)] ${
                isDark
                  ? 'border-[#F59E0B]/30 bg-[#131627]/94 text-[#FAF6F0]'
                  : 'border-slate-300/95 bg-white/95 text-[#0F172A]'
              }`}
            >
              <span
                className={`w-1.5 h-3 rounded-xs shrink-0 ${
                  isDark ? 'bg-[#F59E0B]' : 'bg-[#1D6FD8]'
                }`}
              />
              <span
                style={{ color: isDark ? '#FCD34D' : '#1D6FD8' }}
                className="font-semibold tracking-tight truncate"
              >
                {chapterLabel}
              </span>
              <span
                className={`font-mono tabular-nums text-[10px] sm:text-[11px] shrink-0 ${
                  isDark ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                · {scrollPercent}%
              </span>
            </div>
          </div>
        )}

        {/* Desktop Right-Side Spatial Chapter Scrubber Rail (Instant 1-Click Flight Navigation) */}
        {selectedHouseIdx === null && (
          <nav
            aria-label="3D City Flight Chapters"
            className="hidden lg:flex flex-col gap-1.5 absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto"
          >
            <div
              className={`p-2 rounded-2xl border shadow-lg flex flex-col gap-1 ${
                isDark
                  ? 'border-[#F59E0B]/25 bg-[#131627]/92'
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
                          ? 'bg-[#F59E0B] text-[#0B0D18] font-bold shadow-[0_4px_14px_rgba(245,158,11,0.34)]'
                          : 'bg-[#1D6FD8] text-white font-bold shadow-[0_4px_14px_rgba(29,111,216,0.28)]'
                        : isDark
                        ? 'text-slate-300 hover:bg-[#1C2038] hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        isActive
                          ? isDark
                            ? 'text-[#0B0D18]/80'
                            : 'text-white/80'
                          : isDark
                          ? 'text-[#F59E0B]'
                          : 'text-[#1D6FD8]'
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
            className="absolute inset-0 z-20 flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-4 sm:pb-6 pointer-events-none overflow-y-auto"
          >
            <div className="my-auto w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-3 sm:gap-5 py-1">
              {/* Quiet Identity Kicker safely below Navbar */}
              <div
                className={`inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase pointer-events-auto px-3 py-1 rounded-full border ${
                  isDark
                    ? 'border-[#F59E0B]/30 bg-[#131627]/80 text-[#FCD34D]'
                    : 'border-[#1D6FD8]/20 bg-white/80 text-[#1D6FD8]'
                }`}
              >
                <span>{cms.badgeText || `${SITE_CONFIG.freelancer} · Web Developer & Designer`}</span>
                <span aria-hidden="true">·</span>
                <span>{SITE_CONFIG.brand}</span>
              </div>

              {/* Clean Responsive Main Headline (never clips into header or breaks mid-word) */}
              <h1
                className={`text-[21px] sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold font-display tracking-tight leading-[1.15] hyphens-none max-w-3xl mx-auto ${
                  isDark
                    ? 'text-[#FAF6F0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.88)]'
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
                className={`text-xs sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
                  isDark
                    ? 'text-slate-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]'
                    : 'text-[#1E293B] font-medium drop-shadow-[0_1px_10px_rgba(255,255,255,0.92)]'
                }`}
              >
                {cms.heroSubtitle ||
                  'I help business owners, shops, and creators get more calls and sales with clean websites that open fast on phones, look professional, and are easy for you to edit anytime.'}
              </p>

              {/* Primary Hero Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-0.5 pointer-events-auto w-full max-w-2xl">
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-md ${
                    isDark
                      ? 'bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0D18] shadow-[0_8px_24px_rgba(245,158,11,0.32)]'
                      : 'bg-[#1D6FD8] hover:bg-[#1E40AF] text-white shadow-[0_8px_24px_rgba(29,111,216,0.28)]'
                  }`}
                >
                  <span>Get In Touch</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  type="button"
                  onClick={jumpToTourStart}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                    isDark
                      ? 'border-[#F59E0B]/35 bg-[#131627]/92 hover:bg-[#1C2038] text-[#FAF6F0]'
                      : 'border-slate-300 bg-white/95 hover:bg-slate-50 text-[#0F172A]'
                  }`}
                >
                  <span>Tour 6 Houses</span>
                  <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/estimator')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                    isDark
                      ? 'border-white/15 bg-[#131627]/88 hover:bg-[#1C2038] text-slate-200'
                      : 'border-slate-300 bg-white/94 hover:bg-slate-50 text-[#1E293B]'
                  }`}
                >
                  <span>Price Calculator</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* 4 Trust Anchor Pillars */}
              <div className="pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 max-w-2xl mx-auto w-full text-xs pointer-events-auto">
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
                      className={`p-2 sm:p-3 rounded-xl border text-center shadow-sm ${
                        isDark
                          ? 'border-[#F59E0B]/20 bg-[#131627]/90 text-[#FAF6F0]'
                          : 'border-slate-300/90 bg-white/95 text-[#0F172A]'
                      }`}
                    >
                      <IconComp
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto mb-0.5 sm:mb-1"
                        style={{ color: isDark ? '#F59E0B' : '#1D6FD8' }}
                      />
                      <span className="font-semibold block text-[11px] sm:text-xs leading-tight">
                        {pillar.title}
                      </span>
                      <span
                        className={`text-[10px] sm:text-[11px] leading-tight block mt-0.5 ${
                          isDark ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {pillar.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Scroll Cue cleanly in flex flow (never collides with Trust Cards) */}
            <div
              className={`mt-2 sm:mt-3 shrink-0 inline-flex items-center gap-2 text-[10.5px] sm:text-[11px] font-medium px-3.5 py-1.5 rounded-xl border shadow-sm ${
                isDark
                  ? 'border-[#F59E0B]/30 bg-[#131627]/92 text-slate-200'
                  : 'border-slate-300/90 bg-white/95 text-[#0F172A]'
              }`}
            >
              <span>Scroll to Descend Over the City</span>
              <ArrowDown
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0"
                style={{ color: isDark ? '#F59E0B' : '#1D6FD8' }}
              />
            </div>

            {/* Bottom-Right Quick Connect Widget */}
            <div className="hidden xl:block absolute bottom-6 right-6 z-30">
              <HeroEmojiActionWidget onNavigate={onNavigate} />
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
                  ? 'border-[#F59E0B]/25 bg-[#131627]/96 text-slate-300 hover:text-white'
                  : 'border-slate-300 bg-white/96 text-slate-600 hover:text-slate-950'
              }`}
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp
                    className="w-3.5 h-3.5"
                    style={{ color: isDark ? '#F59E0B' : '#1D6FD8' }}
                  />
                  <span>Show 6 Service Houses</span>
                </>
              ) : (
                <>
                  <ChevronDown
                    className="w-3.5 h-3.5"
                    style={{ color: isDark ? '#F59E0B' : '#1D6FD8' }}
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
                    ? 'border-[#F59E0B]/25 bg-[#131627]/96'
                    : 'border-slate-200 bg-white/96'
                }`}
              >
                {/* Line-by-Line Active House Spotlight Bar when Camera Visits Each House */}
                {activeTourService && tourHouseIdx !== null && (
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 rounded-xl border ${
                      isDark
                        ? 'bg-[#1B1F35] border-[#F59E0B]/25 text-[#FAF6F0]'
                        : 'bg-[#F4F8FC] border-slate-200 text-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums shrink-0"
                        style={{
                          backgroundColor: isDark
                            ? 'rgba(245,158,11,0.18)'
                            : 'rgba(29,111,216,0.1)',
                          color: isDark ? '#FCD34D' : '#1D6FD8',
                        }}
                      >
                        House {activeTourService.number} / 06
                      </span>
                      <span className="font-display text-xs sm:text-sm font-bold truncate">
                        {activeTourService.title}
                      </span>
                      <span
                        className={`hidden md:inline text-xs truncate ${
                          isDark ? 'text-slate-300' : 'text-slate-500'
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
                            ? 'bg-[#F59E0B] text-[#0B0D18] hover:bg-[#FBBF24]'
                            : 'bg-[#1D6FD8] text-white hover:bg-[#1E40AF]'
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
                            ? 'border-[#F59E0B]/30 bg-[#131627] hover:bg-[#222742] text-slate-200'
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
                        onMouseEnter={() => handleHoverHouse(idx)}
                        onMouseLeave={() => handleHoverHouse(null)}
                        style={{
                          borderColor:
                            isTourFocus || isHov
                              ? isDark
                                ? '#F59E0B'
                                : '#1D6FD8'
                              : undefined,
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isTourFocus
                            ? isDark
                              ? 'bg-[#222640] text-[#FAF6F0] shadow-md'
                              : 'bg-[#E6F0FA] text-[#0F172A] shadow-sm'
                            : isDark
                            ? 'bg-[#171B2F] border-white/10 hover:bg-[#222640] text-[#FAF6F0]'
                            : 'bg-[#F8FAFC] border-slate-200 hover:bg-slate-100 text-[#0F172A]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className="font-mono text-[11px] font-bold tabular-nums"
                            style={{ color: isDark ? '#FCD34D' : pal.accentCss }}
                          >
                            House {srv.number}
                          </span>
                          <DoorOpen
                            className="w-3.5 h-3.5"
                            style={{ color: isDark ? '#F59E0B' : pal.accentCss }}
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
                    ? 'border-[#F59E0B]/35 bg-[#131627]/96 text-[#FAF6F0]'
                    : 'border-slate-300 bg-white/96 text-[#0F172A]'
                }`}
              >
                <DoorOpen
                  className="w-4 h-4"
                  style={{ color: isDark ? '#F59E0B' : '#1D6FD8' }}
                />
                <span>
                  {phase === 'approaching_door'
                    ? `Arriving at ${mergedServices[selectedHouseIdx]?.title}...`
                    : `Opening Door · Stepping Inside ${mergedServices[selectedHouseIdx]?.title} Studio...`}
                </span>
              </div>
            </div>
          )}

        {/* BOTTOM-LEFT SERVICE HOVER CARD (Desktop only — disabled on mobile view) */}
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
            className="hidden md:block absolute bottom-5 left-5 z-40 max-w-[350px] w-[calc(100vw-2.5rem)] pointer-events-auto transition-all duration-150"
          >
            {(() => {
              const hovSrv = mergedServices[hoveredHouseIdx];
              const pal = SERVICE_HOUSE_PALETTES[hoveredHouseIdx % SERVICE_HOUSE_PALETTES.length];
              if (!hovSrv) return null;
              return (
                <div
                  className={`p-4 rounded-2xl border-2 shadow-2xl flex flex-col gap-3 ${
                    isDark
                      ? 'border-[#F59E0B] bg-[#0B0D18]/98 text-white shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(245,158,11,0.35)]'
                      : 'border-slate-300 bg-white text-slate-900 shadow-[0_18px_44px_rgba(15,23,42,0.16)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className="font-mono font-bold tracking-tight"
                      style={{ color: isDark ? '#FCD34D' : pal.accentCss }}
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
                        isDark ? 'text-amber-300 font-medium' : 'text-slate-600'
                      }`}
                    >
                      {hovSrv.deliverables.slice(0, 2).join(' · ')}
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-between pt-2.5 border-t ${
                      isDark ? 'border-amber-300/25' : 'border-slate-200'
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
                          ? 'bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0D18] shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                          : 'bg-[#1D6FD8] hover:bg-[#1E40AF] text-white shadow-xs'
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

        {/* CINEMATIC MOTION SERVICE DATA PRESENTATION (Loaded & mounted cleanly when door swings open) */}
        {hasOpenedInterior && (
          <Suspense fallback={null}>
            <ServiceInteriorPanel
              service={selectedHouseIdx !== null ? mergedServices[selectedHouseIdx] || null : null}
              serviceIndex={selectedHouseIdx}
              totalServices={mergedServices.length}
              visible={phase === 'inside_house' && selectedHouseIdx !== null}
              onExitHouse={() => setSelectedHouseIdx(null)}
              onSwitchHouse={(idx) => setSelectedHouseIdx(idx)}
              onNavigate={onNavigate}
            />
          </Suspense>
        )}
      </div>
    </section>
  );
};
