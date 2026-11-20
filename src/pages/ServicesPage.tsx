import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/services.ts';
import { AdaptiveServiceImage } from '../components/AdaptiveServiceImage.tsx';
import { FinalCTA } from '../components/FinalCTA.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Interactive filter: 'all' shows all 6 structured service directories; selecting any service shows its complete full-length guide cleanly
  const [selectedSlug, setSelectedSlug] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleServices: ServiceItem[] =
    selectedSlug === 'all'
      ? SERVICES
      : SERVICES.filter((srv) => srv.slug === selectedSlug);

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-clip w-full max-w-full">
      <SEOHead
        title="Digital Services & Capabilities | Click N Create — Saad M"
        description="Explore all 6 core digital services by Saad M at Click N Create: E-Commerce Solutions, Web Development, Branding & Design, Digital Marketing, Web Application Development, and Hosting & Maintenance."
        canonicalPath="/services"
        keywords={[
          'e-commerce solutions UK',
          'custom web development UK',
          'branding and visual identity design',
          'digital marketing and SEO',
          'web application development React',
          'website hosting and maintenance',
          'Click N Create services',
          'Saad M web developer',
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Web Development & Digital Experience Design',
          provider: {
            '@type': 'ProfessionalService',
            name: 'Click N Create — Saad M',
            url: 'https://clickncreate.co.uk',
          },
          areaServed: {
            '@type': 'Country',
            name: 'United Kingdom',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Click N Create Digital Services',
            itemListElement: SERVICES.map((srv) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: srv.title,
                description: srv.shortDescription,
              },
            })),
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===================== EDITORIAL PAGE HEADER ===================== */}
        <header className="max-w-3xl mb-10 md:mb-14 space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className={isDark ? 'text-[#38BDF8] font-semibold' : 'text-[#1D4ED8] font-semibold'}>
              Click N Create
            </span>
            <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-300'}>
              ·
            </span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              6 Core Digital Disciplines
            </span>
          </div>

          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight leading-[1.08] text-balance ${
              isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
            }`}
          >
            Services Built for <span className="text-luxury-gradient">Clarity &amp; Growth.</span>
          </h1>

          <p
            className={`text-base sm:text-lg leading-relaxed max-w-2xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Six focused services tailored to modern businesses, brands, and founders. Browse the
            full overview below or choose a specific discipline to read every detail in full.
          </p>
        </header>

        {/* ===================== INTERACTIVE 6-SERVICE FILTER TABS ===================== */}
        <div
          className={`sticky top-16 sm:top-20 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 py-3 mb-12 border-y transition-colors ${
            isDark
              ? 'bg-[#060913]/95 border-white/10'
              : 'bg-[#F3F6FA]/95 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedSlug('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedSlug === 'all'
                  ? isDark
                    ? 'bg-[#38BDF8] text-[#040B16]'
                    : 'bg-[#1D4ED8] text-white'
                  : isDark
                  ? 'text-slate-300 hover:bg-white/8 hover:text-white'
                  : 'text-slate-700 hover:bg-white hover:text-slate-950'
              }`}
            >
              All 6 Services
            </button>

            {SERVICES.map((srv) => {
              const active = selectedSlug === srv.slug;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => setSelectedSlug(srv.slug)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? isDark
                        ? 'bg-[#38BDF8] text-[#040B16] font-semibold'
                        : 'bg-[#1D4ED8] text-white font-semibold'
                      : isDark
                      ? 'text-slate-300 hover:bg-white/8 hover:text-white'
                      : 'text-slate-700 hover:bg-white hover:text-slate-950'
                  }`}
                >
                  <span className="font-mono tabular-nums opacity-75 mr-1.5">{srv.number}.</span>
                  {srv.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================== STRUCTURED 6-SERVICE SHOWCASE ===================== */}
        <div className="space-y-14 md:space-y-20">
          {visibleServices.map((service, index) => {
            const isFocusedSingle = selectedSlug !== 'all';
            const isExpanded = isFocusedSingle || Boolean(expandedIds[service.id]);
            const isAlternating = selectedSlug === 'all' && index % 2 === 1;

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  isDark
                    ? 'bg-[#0C1222]/88 border-white/10'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Primary Top Summary Split */}
                <div className="p-6 sm:p-10 lg:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    {/* Visual Column */}
                    <div
                      className={`lg:col-span-5 flex flex-col justify-between gap-4 ${
                        isAlternating ? 'lg:order-2' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onNavigate(`/services/${service.slug}`)}
                        className="text-left block w-full h-full cursor-pointer group"
                      >
                        <AdaptiveServiceImage
                          slug={service.slug}
                          imageSrc={service.image}
                          altText={service.altText}
                          accentColor={service.accentColor}
                          className="w-full aspect-[4/3] lg:h-full lg:min-h-[300px]"
                        />
                      </button>
                    </div>

                    {/* Editorial Intro & Key Scope Column */}
                    <div
                      className={`lg:col-span-7 flex flex-col justify-between space-y-6 ${
                        isAlternating ? 'lg:order-1' : ''
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Unboxed Editorial Kicker */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                          <span
                            className={`font-mono font-bold tabular-nums ${
                              isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                            }`}
                          >
                            {service.number}.
                          </span>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            {service.categoryTag}
                          </span>
                          <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-300'}>
                            ·
                          </span>
                          <span
                            className={`font-mono tabular-nums ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {service.typicalTimeline}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h2
                            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight leading-tight text-balance ${
                              isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                            }`}
                          >
                            {service.title}
                          </h2>
                          <p
                            className={`text-base sm:text-lg font-semibold leading-snug ${
                              isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                            }`}
                          >
                            {service.tagline}
                          </p>
                        </div>

                        <div className="space-y-3.5 max-w-2xl">
                          {service.introParagraphs.map((para, pIdx) => (
                            <p
                              key={pIdx}
                              className={`text-sm sm:text-[15px] leading-[1.72] ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Tidy Numbered Capability Index Preview */}
                      <div
                        className={`pt-5 border-t ${
                          isDark ? 'border-white/10' : 'border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-xs font-semibold mb-3 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          Key Areas Covered ({service.coreCapabilities.length})
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {service.coreCapabilities.map((cap, cIdx) => (
                            <div
                              key={cap.title}
                              className="flex items-baseline gap-2.5 text-xs sm:text-sm"
                            >
                              <span
                                className={`font-mono text-[11px] font-bold tabular-nums shrink-0 ${
                                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                                }`}
                              >
                                {String(cIdx + 1).padStart(2, '0')}.
                              </span>
                              <span
                                className={`font-medium ${
                                  isDark ? 'text-slate-200' : 'text-slate-800'
                                }`}
                              >
                                {cap.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clean Inline Technology Line + Actions */}
                      <div
                        className={`pt-5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isDark ? 'border-white/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => onNavigate(`/services/${service.slug}`)}
                            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                              isDark
                                ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#040B16]'
                                : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
                            }`}
                          >
                            <span>Open Dedicated Page</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          {!isFocusedSingle && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(service.id)}
                              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                                isDark
                                  ? 'border-white/15 bg-white/[0.04] hover:bg-white/[0.09] text-slate-100'
                                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900'
                              }`}
                            >
                              <span>{isExpanded ? 'Hide Full Details' : 'Read Full Breakdown'}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onNavigate('/contact')}
                          className={`text-xs font-semibold whitespace-nowrap shrink-0 hover:underline cursor-pointer self-start sm:self-auto ${
                            isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                          }`}
                        >
                          Discuss this service →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===================== FULL EXPANDED EDITORIAL GUIDE ===================== */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`border-t px-6 sm:px-10 lg:px-12 py-10 space-y-12 ${
                        isDark
                          ? 'border-white/10 bg-[#080D1B]/70'
                          : 'border-slate-200 bg-slate-50/75'
                      }`}
                    >
                      {/* Spotlight Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                        <div className="lg:col-span-4 space-y-1.5">
                          <p
                            className={`text-xs font-semibold tracking-wide ${
                              isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                            }`}
                          >
                            {service.spotlight.kicker}
                          </p>
                          <h3
                            className={`text-xl sm:text-2xl font-extrabold font-display tracking-tight leading-snug ${
                              isDark ? 'text-white' : 'text-slate-950'
                            }`}
                          >
                            {service.spotlight.heading}
                          </h3>
                        </div>
                        <div className="lg:col-span-8 space-y-4 max-w-2xl">
                          {service.spotlight.paragraphs.map((para, pIdx) => (
                            <p
                              key={pIdx}
                              className={`text-sm sm:text-[15px] leading-[1.75] ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Complete Capabilities Grid (Clean Hairline Rows, Zero Card-in-Card Bloat) */}
                      <div
                        className={`pt-10 border-t ${
                          isDark ? 'border-white/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                          {service.coreCapabilities.map((cap, cIdx) => (
                            <div key={cap.title} className="space-y-2.5">
                              <div className="flex items-baseline gap-2.5">
                                <span
                                  className={`font-mono text-xs font-bold tabular-nums shrink-0 ${
                                    isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                                  }`}
                                >
                                  {String(cIdx + 1).padStart(2, '0')}.
                                </span>
                                <h4
                                  className={`text-base sm:text-lg font-bold font-display tracking-tight ${
                                    isDark ? 'text-white' : 'text-slate-950'
                                  }`}
                                >
                                  {cap.title}
                                </h4>
                              </div>
                              {cap.subtitle && (
                                <p
                                  className={`text-xs sm:text-sm font-semibold pl-7 ${
                                    isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                                  }`}
                                >
                                  {cap.subtitle}
                                </p>
                              )}
                              <div className="space-y-3 pl-7">
                                {cap.paragraphs.map((para, pIdx) => (
                                  <p
                                    key={pIdx}
                                    className={`text-sm leading-[1.72] ${
                                      isDark ? 'text-slate-300' : 'text-slate-600'
                                    }`}
                                  >
                                    {para}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Approach & Technology Structured Split */}
                      <div
                        className={`pt-10 border-t grid grid-cols-1 ${
                          service.technologySection ? 'lg:grid-cols-12' : ''
                        } gap-8 lg:gap-10 ${
                          isDark ? 'border-white/10' : 'border-slate-200'
                        }`}
                      >
                        <div
                          className={`${
                            service.technologySection ? 'lg:col-span-7' : 'max-w-3xl'
                          } space-y-3.5`}
                        >
                          <h4
                            className={`text-lg font-bold font-display tracking-tight ${
                              isDark ? 'text-white' : 'text-slate-950'
                            }`}
                          >
                            {service.approachSection.title}
                          </h4>
                          <div className="space-y-3">
                            {service.approachSection.paragraphs.map((para, pIdx) => (
                              <p
                                key={pIdx}
                                className={`text-sm leading-[1.72] ${
                                  isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {para}
                              </p>
                            ))}
                          </div>
                        </div>

                        {service.technologySection && (
                          <div className="lg:col-span-5 space-y-3.5">
                            <h4
                              className={`text-lg font-bold font-display tracking-tight ${
                                isDark ? 'text-white' : 'text-slate-950'
                              }`}
                            >
                              {service.technologySection.title}
                            </h4>
                            <div className="space-y-3">
                              {service.technologySection.paragraphs.map((para, pIdx) => (
                                <p
                                  key={pIdx}
                                  className={`text-sm leading-[1.72] ${
                                    isDark ? 'text-slate-300' : 'text-slate-600'
                                  }`}
                                >
                                  {para}
                                </p>
                              ))}
                            </div>
                            <p
                              className={`text-xs font-mono pt-1 ${
                                isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                              }`}
                            >
                              {service.techStack.join(' · ')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Optional Who Can Benefit */}
                      {service.whoCanBenefitSection && (
                        <div
                          className={`pt-8 border-t space-y-3 max-w-3xl ${
                            isDark ? 'border-white/10' : 'border-slate-200'
                          }`}
                        >
                          <h4
                            className={`text-lg font-bold font-display tracking-tight ${
                              isDark ? 'text-white' : 'text-slate-950'
                            }`}
                          >
                            {service.whoCanBenefitSection.title}
                          </h4>
                          {service.whoCanBenefitSection.paragraphs.map((para, pIdx) => (
                            <p
                              key={pIdx}
                              className={`text-sm leading-[1.72] ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* The Result + Closing Sign-Off Strip */}
                      <div
                        className={`pt-10 border-t grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${
                          isDark ? 'border-white/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="lg:col-span-7 space-y-3">
                          <p
                            className={`text-xs font-semibold tracking-wide ${
                              isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                            }`}
                          >
                            {service.resultSection.kicker}
                          </p>
                          <h4
                            className={`text-xl font-extrabold font-display tracking-tight ${
                              isDark ? 'text-white' : 'text-slate-950'
                            }`}
                          >
                            {service.resultSection.heading}
                          </h4>
                          {service.resultSection.paragraphs.map((para, pIdx) => (
                            <p
                              key={pIdx}
                              className={`text-sm leading-[1.72] ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {para}
                            </p>
                          ))}
                        </div>

                        <div className="lg:col-span-5 space-y-4">
                          <h4
                            className={`text-lg font-bold font-display tracking-tight ${
                              isDark ? 'text-white' : 'text-slate-950'
                            }`}
                          >
                            {service.closingCta.heading}
                          </h4>
                          <p
                            className={`text-sm leading-relaxed ${
                              isDark ? 'text-slate-300' : 'text-slate-600'
                            }`}
                          >
                            {service.closingCta.description}
                          </p>
                          <div className="text-xs">
                            <span
                              className={`font-semibold block ${
                                isDark ? 'text-white' : 'text-slate-950'
                              }`}
                            >
                              {service.closingCta.signOffName} · {service.closingCta.signOffBrand}
                            </span>
                            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                              {service.closingCta.signOffRole}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={() => onNavigate('/contact')}
                              className={`px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                                isDark
                                  ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#040B16]'
                                  : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
                              }`}
                            >
                              <span>Start This Project</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href="https://wa.me/447927548123"
                              target="_blank"
                              rel="noreferrer"
                              className={`px-4 py-2 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                                isDark
                                  ? 'border-white/15 bg-white/[0.04] hover:bg-white/[0.09] text-slate-100'
                                  : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-900'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-20">
        <FinalCTA
          onStartProject={() => onNavigate('/contact')}
          onExploreServices={() => {
            setSelectedSlug('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </div>
  );
};
