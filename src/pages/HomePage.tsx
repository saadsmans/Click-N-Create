import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CityScrollExperience } from '../components/city3d/CityScrollExperience.tsx';
import { CapabilitiesSection } from '../components/CapabilitiesSection.tsx';
import { RecentWorksSection } from '../components/RecentWorksSection.tsx';
import { WhyUsSection } from '../components/WhyUsSection.tsx';
import { ProcessSection } from '../components/ProcessSection.tsx';
import { FAQAccordion } from '../components/FAQAccordion.tsx';
import { FinalCTA } from '../components/FinalCTA.tsx';
import { CyberBreakout } from '../components/CyberBreakout.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { FAQS } from '../data/faqs.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { HeroEmojiActionWidget } from '../components/HeroEmojiActionWidget.tsx';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
          'sub-second fast website development'
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
              'https://www.instagram.com/saads.125?exln=aXEyZnduNGc3dThj'
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

      {/* ===================== 3D CINEMATIC CITY & 6 SERVICE HOUSES EXPERIENCE ===================== */}
      <CityScrollExperience onNavigate={onNavigate} />

      {/* Mobile / Tablet Quick Connect Strip (Preserving HeroEmojiActionWidget on smaller viewports) */}
      <div
        className={`xl:hidden py-6 px-4 flex justify-center border-t transition-colors ${
          isDark ? 'bg-[#060913] border-white/[0.06]' : 'bg-[#F3F6FA] border-stone-200'
        }`}
      >
        <HeroEmojiActionWidget onNavigate={onNavigate} />
      </div>

      {/* ===================== TRANSPARENT PRICING SNAPSHOT ===================== */}
      <section className={`py-20 border-y transition-colors ${
        isDark ? 'bg-[#0C1222]/70 border-white/[0.07]' : 'bg-white/75 border-stone-200/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className={`text-xs font-mono uppercase font-semibold tracking-wider ${
                isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
              }`}>
                Clear & Predictable Pricing
              </span>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight break-words ${
                isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
              }`}>
                HONEST £35/HR RATE OR FIXED-PRICE PACKAGES
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                Work directly with Saad M. Whether you need a quick business website, an online shop, or logo and banner designs, pricing is transparent with zero hidden fees.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/estimator')}
                className={`py-3.5 px-6 rounded-xl font-display font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? 'bg-[#38BDF8] text-[#060913] hover:bg-[#7DD3FC] shadow-[0_8px_24px_rgba(56, 189, 248,0.22)]'
                    : 'bg-[#0F172A] text-[#F3F6FA] hover:bg-[#2A2622]'
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
                    ? 'border-[#38BDF8]/40 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#BAE6FD]'
                    : 'border-[#1D4ED8]/40 bg-[#F3E9DC] hover:bg-[#EBDDCA] text-[#1E40AF] shadow-2xs'
                }`}
              >
                Portfolio & CV
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/process')}
                className={`py-3.5 px-5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/15 hover:bg-white/10 text-[#F1F5F9]'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-[#0F172A] shadow-2xs'
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
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-[#0F172A] shadow-2xs'
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
        isDark ? 'bg-[#0C1222]/40 border-white/[0.06]' : 'bg-[#EFECE5]/60 border-stone-200/80'
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
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-[#F1F5F9]'
                  : 'border-stone-300 bg-white hover:bg-stone-50 text-[#0F172A] shadow-2xs'
              }`}
            >
              <span>View All 25+ FAQs</span>
              <ArrowUpRight className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
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
