import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Sparkles, MessageSquare, CheckCircle2, ShieldCheck, Zap, Smartphone } from 'lucide-react';
import { HeroMotionGraphics } from '../components/HeroMotionGraphics.tsx';
import { StickyStackingServices } from '../components/StickyStackingServices.tsx';
import { CapabilitiesSection } from '../components/CapabilitiesSection.tsx';
import { RecentWorksSection } from '../components/RecentWorksSection.tsx';
import { WhyUsSection } from '../components/WhyUsSection.tsx';
import { ProcessSection } from '../components/ProcessSection.tsx';
import { FAQAccordion } from '../components/FAQAccordion.tsx';
import { FinalCTA } from '../components/FinalCTA.tsx';
import { CyberBreakout } from '../components/CyberBreakout.tsx';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { FAQS } from '../data/faqs.ts';
import { SITE_CONFIG } from '../data/site.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('home');

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('/services');
    }
  };

  return (
    <div className="relative overflow-hidden">
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
          'sub-second fast website development'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': 'https://clickncreate.co.uk/#localbusiness',
          name: 'Click N Create — Freelance Web Development by Saad M',
          image: 'https://clickncreate.co.uk/file_00000000440061f7b67bc59e52b0df8e.png',
          url: 'https://clickncreate.co.uk',
          email: 'Mansurisaad28012@gmail.com',
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
              'https://www.linkedin.com/in/saad-m-aa54bb375?utm_source=share_via&utm_content=profile&utm_medium=member_android'
            ]
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'GB',
            addressRegion: 'United Kingdom'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '51.5074',
            longitude: '-0.1278'
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:00',
              closes: '20:00'
            }
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '28',
            bestRating: '5',
            worstRating: '1'
          },
          description: 'Specialized freelance web development brand creating high-speed websites, e-commerce storefronts, and custom interactive digital solutions.'
        }}
      />
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] blur-[140px] pointer-events-none transition-opacity ${
          isDark ? 'bg-cyan-500/15' : 'bg-cyan-400/10'
        }`} />
        <div className={`absolute bottom-10 right-1/4 w-[450px] h-[350px] blur-[130px] pointer-events-none transition-opacity ${
          isDark ? 'bg-purple-600/10' : 'bg-purple-400/5'
        }`} />
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Next-Level 3D Holographic Space System & Planetary Service Matrix */}
        <HeroMotionGraphics onNavigate={onNavigate} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center pointer-events-none">
          <div className="p-0 transition-all duration-300">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="space-y-6 md:space-y-8 z-20 flex flex-col items-center"
            >
            {/* Badge Kicker - Friendly Status */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-mono transition-colors pointer-events-auto ${
                isDark
                  ? 'border-[#00F0FF]/40 bg-[#060611]/80 text-zinc-100 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'border-cyan-500 bg-white text-cyan-950 shadow-sm font-semibold'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]" />
              <span className="tracking-wider uppercase font-bold">
                {cms.badgeText || `${SITE_CONFIG.freelancer} · Web Developer & Designer`}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="space-y-2 max-w-3xl"
            >
              <span className="block font-mono text-xs sm:text-sm tracking-widest text-[#00F0FF] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                [ {SITE_CONFIG.brand} ]
              </span>
              <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight leading-tight sm:leading-[1.08] break-words drop-shadow-[0_3px_16px_rgba(0,0,0,0.8)] ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                {cms.heroTitle || 'WEBSITES & ONLINE SHOPS'} <span className="text-cyber-gradient">{cms.heroHighlight || 'THAT GET YOU CUSTOMERS.'}</span>
              </h1>
            </motion.div>

            {/* Supporting Copy */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${
                isDark ? 'text-zinc-200' : 'text-zinc-700 font-medium'
              }`}
            >
              {cms.heroSubtitle || 'I help business owners, shops, and creators get more calls and sales with clean websites that open fast on phones, look professional, and are easy for you to edit anytime.'}
            </motion.p>

            {/* Hero Action Buttons - Fade in & Slide up */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 },
                },
              }}
              className="flex flex-wrap items-center justify-center gap-3.5 pt-2 pointer-events-auto"
            >
              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                type="button"
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#00F0FF] hover:bg-[#38bdf8] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Get In Touch</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                type="button"
                onClick={scrollToServices}
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'border-[#00F0FF]/40 bg-[#060611]/80 hover:bg-[#00F0FF]/20 text-[#00F0FF]'
                    : 'border-cyan-500 bg-white hover:bg-cyan-50 text-cyan-900 shadow-xs'
                }`}
              >
                <span>See What I Build</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#00F0FF]" />
              </motion.button>

              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                type="button"
                onClick={() => onNavigate('/estimator')}
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border font-mono text-xs transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'border-white/20 bg-[#060611]/80 hover:border-[#00F0FF]/40 text-zinc-200'
                    : 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 shadow-xs'
                }`}
              >
                <span>Instant Price Calculator</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </motion.button>
            </motion.div>

            {/* Quick Trust Anchor Strip - Plain English */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full text-xs font-mono pointer-events-auto"
            >
              <div className={`p-3 rounded-xl border text-center transition-colors ${
                isDark ? 'border-white/15 bg-[#060611]/80 text-zinc-200' : 'border-zinc-300 bg-white text-zinc-800 shadow-xs'
              }`}>
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-[#00F0FF]" />
                <span className="font-bold block text-[11px]">100% Mobile Ready</span>
                <span className="text-[10px] text-zinc-400">Looks sharp on phones</span>
              </div>

              <div className={`p-3 rounded-xl border text-center transition-colors ${
                isDark ? 'border-white/15 bg-[#060611]/80 text-zinc-200' : 'border-zinc-300 bg-white text-zinc-800 shadow-xs'
              }`}>
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#00F0FF]" />
                <span className="font-bold block text-[11px]">Clear £35/hr Rate</span>
                <span className="text-[10px] text-zinc-400">Or fixed project quote</span>
              </div>

              <div className={`p-3 rounded-xl border text-center transition-colors ${
                isDark ? 'border-white/15 bg-[#060611]/80 text-zinc-200' : 'border-zinc-300 bg-white text-zinc-800 shadow-xs'
              }`}>
                <MessageSquare className="w-4 h-4 mx-auto mb-1 text-[#00F0FF]" />
                <span className="font-bold block text-[11px]">Direct WhatsApp</span>
                <span className="text-[10px] text-zinc-400">Quick direct support</span>
              </div>

              <div className={`p-3 rounded-xl border text-center transition-colors ${
                isDark ? 'border-white/15 bg-[#060611]/80 text-zinc-200' : 'border-zinc-300 bg-white text-zinc-800 shadow-xs'
              }`}>
                <Zap className="w-4 h-4 mx-auto mb-1 text-[#00F0FF]" />
                <span className="font-bold block text-[11px]">Fast Delivery</span>
                <span className="text-[10px] text-zinc-400">1 – 3 week turnaround</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

      {/* ===================== SERVICES STACKING SECTION ===================== */}
      <StickyStackingServices
        onSelectService={(slug) => onNavigate(`/services/${slug}`)}
        onExploreAll={() => onNavigate('/services')}
      />

      {/* ===================== TRANSPARENT PRICING SNAPSHOT ===================== */}
      <section className={`py-20 border-y transition-colors ${
        isDark ? 'bg-[#0E0E12]/50 border-white/[0.06]' : 'bg-[#F4F4F6]/60 border-zinc-200/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-mono text-blue-500 uppercase font-semibold">
                Clear & Predictable Pricing
              </span>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight break-words ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                HONEST £35/HR RATE OR FIXED-PRICE PACKAGES
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Work directly with Saad M. Whether you need a quick business website, an online shop, or logo and banner designs, pricing is transparent with zero hidden fees.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/estimator')}
                className={`py-3.5 px-6 rounded-xl font-display font-semibold text-sm transition-all flex items-center gap-2 ${
                  isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                }`}
              >
                <span>Instant Cost Calculator</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/portfolio')}
                className={`py-3.5 px-5 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-[#00F0FF]/40 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF]' : 'border-cyan-400 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 shadow-2xs'
                }`}
              >
                Portfolio & CV
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/process')}
                className={`py-3.5 px-5 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 shadow-2xs'
                }`}
              >
                How We Work
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className={`py-3.5 px-5 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 shadow-2xs'
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
      <CyberBreakout />

      {/* ===================== FAQ PREVIEW SECTION ===================== */}
      <section className={`relative py-24 md:py-32 border-t transition-colors ${
        isDark ? 'bg-[#0E0E12]/30 border-white/[0.06]' : 'bg-[#F4F4F6]/50 border-zinc-200/80'
      }`}>
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
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 shadow-2xs'
              }`}
            >
              <span>View All 25+ FAQs</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
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
