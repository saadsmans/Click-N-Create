import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Layers,
  MessageSquare,
  PoundSterling,
} from 'lucide-react';
import { SERVICES } from '../data/services.ts';
import { AdaptiveServiceImage } from '../components/AdaptiveServiceImage.tsx';
import { FAQAccordion } from '../components/FAQAccordion.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const serviceIndex = SERVICES.findIndex((s) => s.slug === slug);
  const service = serviceIndex >= 0 ? SERVICES[serviceIndex] : undefined;

  if (!service) {
    return (
      <div className="pt-40 pb-24 text-center px-4">
        <SEOHead
          title="Service Not Found | Click N Create"
          description="The requested freelance service could not be located."
          canonicalPath="/services"
        />
        <h1 className="text-3xl font-display font-bold mb-4">Service Not Found</h1>
        <p className={isDark ? 'text-slate-400 mb-8' : 'text-slate-600 mb-8'}>
          The requested service page does not exist.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/services')}
          className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
            isDark
              ? 'border-white/15 bg-[#0C1222] text-slate-100 hover:bg-white/10'
              : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
          }`}
        >
          View All Services
        </button>
      </div>
    );
  }

  const prevService = SERVICES[(serviceIndex - 1 + SERVICES.length) % SERVICES.length];
  const nextService = SERVICES[(serviceIndex + 1) % SERVICES.length];

  const faqItems = service.faqs.map((f, i) => ({
    id: `faq-${service.id}-${i}`,
    category: service.title,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="pt-28 pb-24 md:pt-36 relative overflow-x-clip w-full max-w-full">
      <SEOHead
        title={`${service.title} | Click N Create — Saad M`}
        description={service.shortDescription}
        canonicalPath={`/services/${service.slug}`}
        keywords={[
          service.title.toLowerCase(),
          `freelance ${service.title.toLowerCase()}`,
          `${service.slug} developer`,
          'Click N Create services',
          'Saad M web developer',
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          provider: {
            '@type': 'ProfessionalService',
            name: 'Click N Create — Saad M',
          },
          description: service.shortDescription,
          offers: {
            '@type': 'Offer',
            price: '35',
            priceCurrency: 'GBP',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Utility & 6-Service Switcher Bar */}
        <div
          className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-10 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => onNavigate('/services')}
            className={`inline-flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer group whitespace-nowrap shrink-0 self-start lg:self-auto ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <ArrowLeft
              className={`w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform ${
                isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
              }`}
            />
            <span>All 6 Services</span>
          </button>

          <nav
            aria-label="Switch Service"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1"
          >
            {SERVICES.map((item) => {
              const isCurrent = item.slug === service.slug;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(`/services/${item.slug}`)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isCurrent
                      ? isDark
                        ? 'bg-[#38BDF8] text-[#040B16] font-semibold'
                        : 'bg-[#1D4ED8] text-white font-semibold'
                      : isDark
                      ? 'text-slate-300 hover:bg-white/8 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <span className="font-mono tabular-nums opacity-75 mr-1.5">{item.number}.</span>
                  {item.title}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ===================== 1. EDITORIAL HERO SPLIT ===================== */}
        <header
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch pb-16 md:pb-20 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span
                className={`font-mono font-bold tabular-nums ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`}
              >
                Service {service.number} of 06
              </span>
              <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-300'}>
                ·
              </span>
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {service.categoryTag}
              </span>
            </div>

            <div className="space-y-3">
              <h1
                className={`text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold font-display tracking-tight leading-[1.08] text-balance ${
                  isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                }`}
              >
                {service.title}
              </h1>

              <p
                className={`text-lg sm:text-xl font-semibold tracking-tight leading-snug text-balance ${
                  isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                }`}
              >
                {service.tagline}
              </p>
            </div>

            <div className="space-y-4 max-w-2xl">
              {service.introParagraphs.map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className={`text-[15px] sm:text-base leading-[1.75] ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#040B16]'
                    : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
                }`}
              >
                <span>Start a Project Enquiry</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/estimator')}
                className={`px-5 py-3 rounded-xl border text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-slate-100'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-900'
                }`}
              >
                <span>Estimate Project Scope</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <AdaptiveServiceImage
              slug={service.slug}
              imageSrc={service.image}
              altText={service.altText}
              accentColor={service.accentColor}
              className="w-full aspect-[4/3] lg:h-full lg:min-h-[340px]"
            />
          </div>
        </header>

        {/* ===================== 2. COMMERCIAL SUMMARY STRIP ===================== */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className="space-y-1">
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <PoundSterling
                className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}
              />
              <span>Engagement &amp; Pricing</span>
            </div>
            <p className={`text-sm font-semibold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {service.pricingEstimate}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {service.rateNote}
            </p>
          </div>

          <div className="space-y-1">
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
              <span>Typical Delivery</span>
            </div>
            <p className={`text-sm font-semibold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {service.typicalTimeline}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Direct communication with Saad M
            </p>
          </div>

          <div className="space-y-1">
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
              <span>Core Stack &amp; Tools</span>
            </div>
            <p className={`text-sm font-medium leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {service.techStack.join(' · ')}
            </p>
          </div>
        </div>

        {/* ===================== 3. EDITORIAL SPOTLIGHT BAND ===================== */}
        <section
          className={`py-16 md:py-20 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-2.5 lg:sticky lg:top-28">
              <p
                className={`text-xs font-semibold tracking-wide ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`}
              >
                {service.spotlight.kicker}
              </p>
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight leading-tight text-balance ${
                  isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                }`}
              >
                {service.spotlight.heading}
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-5 max-w-2xl">
              {service.spotlight.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={`text-[15px] sm:text-base leading-[1.78] ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 4. CORE CAPABILITIES DIRECTORY ===================== */}
        <section
          id="capabilities"
          className={`py-16 md:py-20 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className="max-w-2xl mb-12 space-y-2.5">
            <p
              className={`text-xs font-semibold tracking-wide ${
                isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
              }`}
            >
              What Is Included
            </p>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-balance ${
                isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
              }`}
            >
              Core Areas of {service.title}
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Every layer is carefully planned, structured, and delivered around your business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {service.coreCapabilities.map((cap, idx) => {
              const num = String(idx + 1).padStart(2, '0');
              return (
                <article
                  key={cap.title}
                  className={`p-6 sm:p-8 rounded-2xl border flex flex-col gap-4 transition-colors ${
                    isDark
                      ? 'bg-[#0C1222]/80 border-white/10 hover:border-[#38BDF8]/30'
                      : 'bg-white border-slate-200 hover:border-[#1D4ED8]/30'
                  }`}
                >
                  <div className="space-y-1.5">
                    <span
                      className={`font-mono text-xs font-bold tabular-nums block ${
                        isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                      }`}
                    >
                      {num}.
                    </span>
                    <h3
                      className={`text-lg sm:text-xl font-bold font-display tracking-tight ${
                        isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                      }`}
                    >
                      {cap.title}
                    </h3>
                    {cap.subtitle && (
                      <p
                        className={`text-sm font-semibold ${
                          isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                        }`}
                      >
                        {cap.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3.5">
                    {cap.paragraphs.map((para, pIdx) => (
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
                </article>
              );
            })}
          </div>
        </section>

        {/* ===================== 5. APPROACH, TECHNOLOGY & WHO CAN BENEFIT ===================== */}
        <section
          className={`py-16 md:py-20 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div
            className={`grid grid-cols-1 ${
              service.technologySection ? 'lg:grid-cols-12' : ''
            } gap-8 lg:gap-12`}
          >
            {/* Approach Column */}
            <div
              className={`${
                service.technologySection ? 'lg:col-span-7' : 'max-w-3xl'
              } space-y-5`}
            >
              <div className="space-y-2">
                <p
                  className={`text-xs font-semibold tracking-wide ${
                    isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                  }`}
                >
                  Process &amp; Execution
                </p>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${
                    isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                  }`}
                >
                  {service.approachSection.title}
                </h2>
              </div>

              <div className="space-y-4">
                {service.approachSection.paragraphs.map((para, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span
                      className={`font-mono text-xs font-bold tabular-nums mt-1.5 shrink-0 ${
                        isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <p
                      className={`text-[15px] sm:text-base leading-[1.75] ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {para}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology & Platforms Column */}
            {service.technologySection && (
              <div
                className={`lg:col-span-5 p-6 sm:p-8 rounded-2xl border space-y-5 self-start ${
                  isDark
                    ? 'bg-[#0C1222]/85 border-white/10'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <p
                    className={`text-xs font-semibold tracking-wide ${
                      isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                    }`}
                  >
                    Toolkit
                  </p>
                  <h3
                    className={`text-xl sm:text-2xl font-bold font-display tracking-tight ${
                      isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                    }`}
                  >
                    {service.technologySection.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {service.technologySection.paragraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className={`text-sm sm:text-[15px] leading-[1.72] ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <div
                  className={`pt-4 border-t ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                >
                  <p
                    className={`text-xs font-medium mb-1.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Primary Technologies
                  </p>
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {service.techStack.join(' · ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Optional Who Can Benefit Section (e.g. Web Application Development) */}
          {service.whoCanBenefitSection && (
            <div
              className={`mt-12 pt-12 border-t grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <div className="lg:col-span-4 space-y-2">
                <p
                  className={`text-xs font-semibold tracking-wide ${
                    isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                  }`}
                >
                  Audience &amp; Fit
                </p>
                <h3
                  className={`text-2xl font-extrabold font-display tracking-tight ${
                    isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                  }`}
                >
                  {service.whoCanBenefitSection.title}
                </h3>
              </div>
              <div className="lg:col-span-8 space-y-4 max-w-2xl">
                {service.whoCanBenefitSection.paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={`text-[15px] sm:text-base leading-[1.75] ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ===================== 6. THE RESULT / THE GOAL ===================== */}
        <section
          className={`py-16 md:py-20 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div
            className={`p-8 sm:p-12 rounded-2xl border grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${
              isDark
                ? 'bg-[#0C1222]/90 border-[#38BDF8]/20'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="lg:col-span-5 space-y-2.5">
              <p
                className={`text-xs font-semibold tracking-wide ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`}
              >
                {service.resultSection.kicker}
              </p>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight leading-tight text-balance ${
                  isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                }`}
              >
                {service.resultSection.heading}
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {service.resultSection.paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={`text-[15px] sm:text-base leading-[1.75] ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 7. DELIVERABLES & SCOPE CHECKLIST ===================== */}
        <section
          className={`py-16 md:py-20 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <p
                  className={`text-xs font-semibold tracking-wide ${
                    isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                  }`}
                >
                  Handover Checklist
                </p>
                <h2
                  className={`text-2xl font-extrabold font-display tracking-tight ${
                    isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                  }`}
                >
                  Key Deliverables
                </h2>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {service.deliverables.map((item, idx) => (
                  <li
                    key={idx}
                    className={`p-4 rounded-xl border flex items-start gap-3 text-sm leading-snug ${
                      isDark
                        ? 'bg-[#0C1222]/75 border-white/10 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                      }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <h3
                  className={`text-base font-bold font-display ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Included in Scope
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {service.scopeInclusions.map((inc, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2.5 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <span
                        className={`font-bold shrink-0 ${
                          isDark ? 'text-emerald-400' : 'text-emerald-700'
                        }`}
                      >
                        +
                      </span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`pt-5 border-t space-y-2.5 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                <h3
                  className={`text-sm font-semibold ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  External Third-Party Costs (Not Included)
                </h3>
                <ul className={`space-y-2 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {service.scopeExclusions.map((exc, idx) => (
                    <li key={idx}>– {exc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 8. FREQUENTLY ASKED QUESTIONS ===================== */}
        <section
          className={`py-16 md:py-20 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className="max-w-3xl space-y-6">
            <div className="space-y-1.5">
              <p
                className={`text-xs font-semibold tracking-wide ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`}
              >
                Questions
              </p>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${
                  isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                }`}
              >
                Common Questions About {service.title}
              </h2>
            </div>

            <FAQAccordion items={faqItems} defaultOpenIndex={0} />
          </div>
        </section>

        {/* ===================== 9. CLOSING CTA & PERSONAL SIGN-OFF ===================== */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-balance ${
                isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
              }`}
            >
              {service.closingCta.heading}
            </h2>

            <p
              className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {service.closingCta.description}
            </p>

            {/* Editorial Author Sign-Off */}
            <div
              className={`pt-2 inline-flex flex-col items-center text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <span className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {service.closingCta.signOffName}
              </span>
              <span className={`text-xs mt-0.5 ${isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'}`}>
                {service.closingCta.signOffBrand} · {service.closingCta.signOffRole}
              </span>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`px-7 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#040B16]'
                    : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
                }`}
              >
                <span>Get In Touch</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/447927548123"
                target="_blank"
                rel="noreferrer"
                className={`px-6 py-3.5 rounded-xl border text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
                  isDark
                    ? 'border-white/15 bg-white/[0.04] hover:bg-white/[0.09] text-slate-100'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </div>

          {/* Previous / Next Service Navigation Footer */}
          <div
            className={`mt-16 pt-8 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => onNavigate(`/services/${prevService.slug}`)}
              className={`group p-4 rounded-xl border text-left transition-colors cursor-pointer flex items-center gap-3 ${
                isDark
                  ? 'border-white/10 bg-[#0C1222]/70 hover:border-[#38BDF8]/35'
                  : 'border-slate-200 bg-white hover:border-[#1D4ED8]/35'
              }`}
            >
              <ArrowLeft
                className={`w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`}
              />
              <div>
                <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Previous Service
                </span>
                <span className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {prevService.number}. {prevService.title}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate(`/services/${nextService.slug}`)}
              className={`group p-4 rounded-xl border text-right transition-colors cursor-pointer flex items-center justify-end gap-3 ${
                isDark
                  ? 'border-white/10 bg-[#0C1222]/70 hover:border-[#38BDF8]/35'
                  : 'border-slate-200 bg-white hover:border-[#1D4ED8]/35'
              }`}
            >
              <div>
                <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Next Service
                </span>
                <span className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {nextService.number}. {nextService.title}
                </span>
              </div>
              <ArrowRight
                className={`w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
