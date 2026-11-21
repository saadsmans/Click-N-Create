import React, { Suspense, lazy } from 'react';
import {
  ArrowUpRight,
  ArrowDown,
  Smartphone,
  ShieldCheck,
  MessageSquare,
  Zap,
  Sparkles,
} from 'lucide-react';
import { HeroMotionGraphics } from '../components/HeroMotionGraphics.tsx';
import { StickyStackingServices } from '../components/StickyStackingServices.tsx';
import { CapabilitiesSection } from '../components/CapabilitiesSection.tsx';
import { RecentWorksSection } from '../components/RecentWorksSection.tsx';
import { WhyUsSection } from '../components/WhyUsSection.tsx';
import { ProcessSection } from '../components/ProcessSection.tsx';
import { FAQAccordion } from '../components/FAQAccordion.tsx';
import { FinalCTA } from '../components/FinalCTA.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { FAQS } from '../data/faqs.ts';
import { SITE_CONFIG } from '../data/site.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { HeroEmojiActionWidget } from '../components/HeroEmojiActionWidget.tsx';

const CyberBreakout = lazy(() =>
  import('../components/CyberBreakout.tsx').then((m) => ({ default: m.CyberBreakout }))
);

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('home') || {};

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('/services');
    }
  };

  return (
    <div className="relative overflow-x-clip">
      <SEOHead
        title="Click N Create | Saad M — Freelance Web Developer UK (£35/hr)"
        description="Hire Saad M at Click N Create. Top-rated UK freelance web developer building ultra-fast React websites, Shopify stores, WordPress, and branding at honest £35/hr pricing."
        canonicalPath="/"
        keywords={[
          'freelance web developer UK',
          'Click N Create',
          'clickncreate.co.uk',
          'Saad M freelance developer',
          'hire web developer UK',
          'custom React website developer',
          'WordPress website design UK',
          'Shopify ecommerce developer UK',
          'affordable website designer',
          'freelance full stack developer London UK',
          'sub-second fast website development',
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': 'https://clickncreate.co.uk/#localbusiness',
          name: 'Click N Create — Freelance Web Development by Saad M',
          image: 'https://clickncreate.co.uk/file_00000000440061f7b67bc59e52b0df8e.png',
          url: 'https://clickncreate.co.uk',
          email: 'saadm.clickncreate@gmail.com',
          telephone: '+447927548123',
          priceRange: '£35/hr',
          currenciesAccepted: 'GBP, USD, EUR',
          paymentAccepted: 'Bank Transfer, Stripe, Credit Card, PayPal',
          founder: {
            '@type': 'Person',
            name: 'Saad M',
            jobTitle: 'Founder & Full-Stack Web Developer',
            url: 'https://clickncreate.co.uk/about',
            sameAs: [
              'https://www.linkedin.com/in/saad-m-aa54bb375?utm_source=share_via&utm_content=profile&utm_medium=member_android',
              'https://www.instagram.com/saads.125?exln=aXEyZnduNGc3dThj',
            ],
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'GB',
            addressRegion: 'United Kingdom',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '51.5074',
            longitude: '-0.1278',
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:00',
              closes: '20:00',
            },
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '28',
            bestRating: '5',
            worstRating: '1',
          },
          description:
            'Specialized freelance web development brand creating high-speed websites, e-commerce storefronts, and custom interactive digital solutions.',
        }}
      />

      {/* ===================== 3D INTERACTIVE SOLAR SYSTEM HERO ===================== */}
      <section
        className={`relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-24 pb-24 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-[#04040C] via-[#060614] to-[#05050A]'
            : 'bg-gradient-to-b from-[#F0F9FF] via-[#F8FAFC] to-[#EEF6FF]'
        }`}
      >
        {/* Subtle Space Grid Backdrop */}
        <div className="absolute inset-0 grid-bg opacity-45 pointer-events-none" />

        {/* Ambient Nebula Glows */}
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[680px] h-[420px] rounded-full blur-[160px] pointer-events-none ${
            isDark ? 'bg-[#00F0FF]/10' : 'bg-cyan-400/12'
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-[480px] h-[360px] rounded-full blur-[150px] pointer-events-none ${
            isDark ? 'bg-[#7000FF]/12' : 'bg-indigo-400/10'
          }`}
        />

        {/* Real 3D WebGL Interactive Solar System */}
        <HeroMotionGraphics onNavigate={onNavigate} />

        {/* Hero Editorial Content Overlay (pointer-events-none so 3D drag/orbit stays responsive) */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-4 sm:gap-5 pointer-events-none">
          {/* Identity Badge */}
          <div
            className={`inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider pointer-events-auto ${
              isDark
                ? 'border-[#00F0FF]/35 bg-[#060612]/80 text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.16)]'
                : 'border-cyan-500/40 bg-white/85 text-cyan-800 shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{cms.badgeText || `${SITE_CONFIG.freelancer} · Web Developer & Designer`}</span>
            <span aria-hidden="true">·</span>
            <span>{SITE_CONFIG.brand}</span>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-black font-display tracking-tight leading-[1.08] max-w-4xl mx-auto ${
              isDark
                ? 'text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.85)]'
                : 'text-slate-950 drop-shadow-[0_2px_18px_rgba(255,255,255,0.9)]'
            }`}
          >
            {cms.heroTitle || 'WEBSITES & ONLINE SHOPS'}{' '}
            <span className="text-cyber-gradient">
              {cms.heroHighlight || 'THAT GET YOU CUSTOMERS.'}
            </span>
          </h1>

          {/* Supporting Copy */}
          <p
            className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
              isDark
                ? 'text-zinc-300 drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]'
                : 'text-slate-700 font-medium drop-shadow-[0_1px_12px_rgba(255,255,255,0.9)]'
            }`}
          >
            {cms.heroSubtitle ||
              'I help business owners, shops, and creators get more calls and sales with clean websites that open fast on phones, look professional, and are easy for you to edit anytime.'}
          </p>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1 pointer-events-auto">
            <button
              type="button"
              onClick={() => onNavigate(cms.primaryCtaLink || '/contact')}
              className={`px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 ${
                isDark
                  ? 'bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05050A] shadow-[0_0_24px_rgba(0,240,255,0.35)]'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md'
              }`}
            >
              <span>{cms.primaryCtaText || 'Start A Project'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={scrollToServices}
              className={`px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl border font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer inline-flex items-center gap-2 ${
                isDark
                  ? 'border-[#00F0FF]/40 bg-[#080816]/85 hover:bg-[#00F0FF]/15 text-white'
                  : 'border-cyan-400 bg-white/90 hover:bg-cyan-50 text-slate-900 shadow-sm'
              }`}
            >
              <span>{cms.secondaryCtaText || 'Explore Services'}</span>
              <ArrowDown className="w-4 h-4 text-[#00F0FF]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/estimator')}
              className={`px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border font-mono text-xs sm:text-sm font-medium backdrop-blur-md transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                isDark
                  ? 'border-white/15 bg-[#080816]/80 hover:bg-white/10 text-zinc-200'
                  : 'border-slate-300 bg-white/90 hover:bg-slate-50 text-slate-800 shadow-sm'
              }`}
            >
              <span>Price Calculator</span>
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
                  className={`p-2.5 sm:p-3 rounded-xl border backdrop-blur-md text-center transition-colors ${
                    isDark
                      ? 'border-white/10 bg-[#080816]/80 text-white'
                      : 'border-slate-200 bg-white/88 text-slate-900 shadow-xs'
                  }`}
                >
                  <IconComp
                    className={`w-4 h-4 mx-auto mb-1 ${
                      isDark ? 'text-[#00F0FF]' : 'text-cyan-700'
                    }`}
                  />
                  <span className="font-semibold block text-[11px] sm:text-xs leading-tight">
                    {pillar.title}
                  </span>
                  <span
                    className={`text-[10px] sm:text-[11px] leading-tight block mt-0.5 ${
                      isDark ? 'text-zinc-400' : 'text-slate-500'
                    }`}
                  >
                    {pillar.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Connect Strip (Direct Access Card with Saad's Avatar) */}
      <div
        className={`py-8 px-4 flex justify-center border-y transition-colors ${
          isDark ? 'bg-[#070712] border-white/[0.06]' : 'bg-[#F8FAFC] border-slate-200'
        }`}
      >
        <HeroEmojiActionWidget onNavigate={onNavigate} />
      </div>

      {/* ===================== CORE SERVICES SHOWCASE ===================== */}
      <StickyStackingServices
        onSelectService={(slug) => onNavigate(`/services/${slug}`)}
        onExploreAll={() => onNavigate('/services')}
      />

      {/* ===================== TRANSPARENT PRICING SNAPSHOT ===================== */}
      <section
        className={`py-20 border-y transition-colors ${
          isDark ? 'bg-[#0A0A18]/70 border-white/[0.07]' : 'bg-white/80 border-slate-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span
                className={`text-xs font-mono uppercase font-semibold tracking-wider ${
                  isDark ? 'text-[#00F0FF]' : 'text-cyan-700'
                }`}
              >
                Clear &amp; Predictable Pricing
              </span>
              <h2
                className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight break-words ${
                  isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                }`}
              >
                HONEST £35/HR RATE OR FIXED-PRICE PACKAGES
              </h2>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}
              >
                Work directly with Saad M. Whether you need a quick business website, an online
                shop, or logo and banner designs, pricing is transparent with zero hidden fees.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/estimator')}
                className={`py-3.5 px-6 rounded-xl font-display font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? 'bg-[#00F0FF] text-[#05050A] hover:bg-[#38BDF8] shadow-[0_8px_24px_rgba(0,240,255,0.25)]'
                    : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm'
                }`}
              >
                <span>Instant Cost Calculator</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/portfolio')}
                className={`py-3.5 px-5 rounded-xl border text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'border-[#00F0FF]/40 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF]'
                    : 'border-cyan-500/40 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 shadow-2xs'
                }`}
              >
                Portfolio &amp; CV
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/process')}
                className={`py-3.5 px-5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/15 hover:bg-white/10 text-[#F1F5F9]'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] shadow-2xs'
                }`}
              >
                How We Work
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className={`py-3.5 px-5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/15 hover:bg-white/10 text-[#F1F5F9]'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] shadow-2xs'
                }`}
              >
                About Saad M
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHAT I CAN BUILD SECTION ===================== */}
      <CapabilitiesSection onEnquire={() => onNavigate('/contact')} />

      {/* ===================== RECENT CLIENT WORKS & DELIVERIES ===================== */}
      <RecentWorksSection onNavigate={onNavigate} />

      {/* ===================== WHY CLICK N CREATE ===================== */}
      <WhyUsSection />

      {/* ===================== PROCESS SECTION ===================== */}
      <ProcessSection />

      {/* ===================== CYBER BREAKOUT ARCADE SECTION ===================== */}
      <Suspense fallback={<div className="py-24" />}>
        <CyberBreakout />
      </Suspense>

      {/* ===================== FAQ PREVIEW SECTION ===================== */}
      <section
        className={`relative py-24 md:py-32 border-t transition-colors ${
          isDark ? 'bg-[#080816]/50 border-white/[0.06]' : 'bg-slate-50/80 border-slate-200/80'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeading
              category="Common Inquiries"
              title="FREQUENTLY ASKED QUESTIONS"
              subtitle="Straightforward answers regarding rates (£35/hr), milestones, WhatsApp communications, and source code ownership."
              className="mb-0"
            />

            <button
              type="button"
              onClick={() => onNavigate('/faq')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer self-start md:self-end ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-[#F1F5F9]'
                  : 'border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] shadow-2xs'
              }`}
            >
              <span>View All 25+ FAQs</span>
              <ArrowUpRight className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F0FF]' : 'text-cyan-700'}`} />
            </button>
          </div>

          <FAQAccordion items={FAQS.slice(0, 6)} defaultOpenIndex={0} />
        </div>
      </section>

      {/* ===================== FINAL DRAMATIC CTA ===================== */}
      <FinalCTA
        onStartProject={() => onNavigate('/contact')}
        onExploreServices={() => onNavigate('/services')}
      />
    </div>
  );
};
