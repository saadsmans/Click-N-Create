import React from 'react';
import { ArrowLeft, CheckCircle2, UserCheck } from 'lucide-react';
import { SERVICES } from '../data/services.ts';
import { AdaptiveServiceImage } from '../components/AdaptiveServiceImage.tsx';
import { FAQAccordion } from '../components/FAQAccordion.tsx';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="pt-40 pb-20 text-center px-4">
        <SEOHead
          title="Service Not Found | Click N Create"
          description="The requested freelance service could not be located."
          canonicalPath="/services"
        />
        <h1 className="text-3xl font-display font-bold mb-4">Service Not Found</h1>
        <p className="text-zinc-500 mb-8">The requested service page does not exist.</p>
        <button
          type="button"
          onClick={() => onNavigate('/services')}
          className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-white/20 bg-zinc-100 dark:bg-white/5 font-mono text-sm"
        >
          View All Services
        </button>
      </div>
    );
  }

  const faqItems = service.faqs.map((f, i) => ({
    id: `faq-${service.id}-${i}`,
    category: service.title,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-hidden w-full max-w-full">
      <SEOHead
        title={`${service.title} | Click N Create — Saad M`}
        description={service.shortDescription || `${service.title} services by freelance developer Saad M. Transparent rates, quick delivery, and high technical quality.`}
        canonicalPath={`/services/${service.slug}`}
        keywords={[
          service.title.toLowerCase(),
          `freelance ${service.title.toLowerCase()}`,
          `${service.slug} developer`,
          'hire freelance developer',
          'Click N Create services'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          provider: {
            '@type': 'ProfessionalService',
            name: 'Click N Create — Saad M'
          },
          description: service.shortDescription,
          offers: {
            '@type': 'Offer',
            price: '35',
            priceCurrency: 'GBP'
          }
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => onNavigate('/services')}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-500 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Services</span>
          </button>
        </div>

        {/* ===================== HERO ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-16 md:pb-24 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                isDark ? 'text-white bg-white/10 border-white/10' : 'text-zinc-900 bg-zinc-100 border-zinc-200'
              }`}>
                Service {service.number}
              </span>
              <span className="text-xs font-mono text-blue-500 uppercase tracking-wider font-semibold">
                Click N Create
              </span>
            </div>

            <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.1] ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>
              {service.title}
            </h1>

            <p className={`text-base sm:text-lg md:text-xl leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              {service.fullDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <MagneticButton
                text={`Enquire About ${service.title}`}
                size="md"
                variant="primary"
                onClick={() => onNavigate('/contact')}
              />

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('details-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-5 py-2.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 shadow-2xs'
                }`}
              >
                View Features & FAQs ↓
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <AdaptiveServiceImage
              slug={service.slug}
              imageSrc={service.image}
              altText={service.altText}
              accentColor={service.accentColor}
              className="w-full aspect-[4/3] shadow-lg"
            />
          </div>
        </div>

        {/* ===================== PRICING & SCOPE BANNER ===================== */}
        <div className={`my-12 p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl ${
          isDark
            ? 'border-white/10 bg-white/[0.02]'
            : 'border-zinc-200 bg-white shadow-sm'
        }`}>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-semibold block mb-1">
              Investment & Pricing
            </span>
            <div className={`text-2xl sm:text-3xl font-extrabold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              Standard Rate: £35 / hr
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
              {service.pricingEstimate}. Available on an hourly basis or as a guaranteed fixed milestone agreement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('/estimator')}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Estimate This Scope
            </button>
            <a
              href="https://wa.me/447927548123"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              WhatsApp Direct
            </a>
          </div>
        </div>

        {/* ===================== OVERVIEW & WHAT I CAN PROVIDE ===================== */}
        <section id="details-section" className="py-16 md:py-24 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-4">
              <SectionHeading
                category="Overview"
                title="WHAT I CAN PROVIDE"
                subtitle="Every deliverable is crafted from scratch according to the specific needs of your project."
                className="mb-0"
              />

              <p className={`text-sm sm:text-base leading-relaxed pt-2 ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                When we collaborate on <strong className={isDark ? 'text-white' : 'text-zinc-950'}>{service.title}</strong>, you receive direct communication from Saad M throughout every iteration. No templates, no inflated promises—just solid code, responsive UI, and thoughtful design.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-5 backdrop-blur-xl transition-all flex flex-col justify-between ${
                    isDark
                      ? 'border-white/10 bg-white/[0.025] hover:border-white/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                    <span className={`text-sm font-medium leading-snug ${
                      isDark ? 'text-zinc-200' : 'text-zinc-800'
                    }`}>
                      {item}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 mt-4 self-end uppercase">
                    Deliverable 0{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== SCOPE INCLUSIONS & EXCLUSIONS ===================== */}
        <section className="py-16 md:py-24 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-3xl border ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'}`}>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-500 font-semibold mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scope Inclusions</span>
              </div>
              <ul className="space-y-3">
                {service.scopeInclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'}`}>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                <span>Exclusions & Third-Party Boundaries</span>
              </div>
              <ul className="space-y-3">
                {service.scopeExclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
                    <span className="text-zinc-500">{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===================== FEATURES ===================== */}
        <section className="py-16 md:py-24 border-b border-black/[0.08] dark:border-white/[0.08]">
          <SectionHeading
            category="Specifications"
            title="TECHNICAL & DESIGN FEATURES"
            subtitle="The core architectural and aesthetic qualities embedded into this service."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {service.features.map((feat, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-6 transition-all space-y-3 ${
                  isDark
                    ? 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-2xs'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold border ${
                  isDark ? 'border-white/15 bg-white/5 text-blue-400' : 'border-zinc-200 bg-zinc-50 text-blue-600'
                }`}>
                  0{idx + 1}
                </div>
                <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  {feat}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== WHO IT IS FOR ===================== */}
        <section className="py-16 md:py-24 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="max-w-3xl">
            <SectionHeading
              category="Suitability"
              title="WHO THIS IS FOR"
              subtitle="This service is structured to bring maximum value to clients who prioritize direct collaboration, high visual quality, and reliable execution."
            />

            <div className="space-y-3 pt-2">
              {service.suitableFor.map((target, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    isDark ? 'border-white/10 bg-white/[0.025] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-800 shadow-2xs'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-sm sm:text-base">{target}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== SERVICE SPECIFIC FAQ ===================== */}
        <section className="py-16 md:py-24 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="max-w-4xl">
            <SectionHeading
              category="Questions"
              title={`${service.title.toUpperCase()} FAQ`}
              subtitle="Specific questions and honest answers about this service."
            />

            <div className="pt-4">
              <FAQAccordion items={faqItems} defaultOpenIndex={0} />
            </div>
          </div>
        </section>

        {/* ===================== ENQUIRY CTA ===================== */}
        <div className="py-20 text-center max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-mono text-blue-500 tracking-widest uppercase block font-semibold">
            Let's Collaborate
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>
            Ready to Build Your {service.title}?
          </h2>
          <p className={`text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Let's talk through your goals, features, and timeline. You communicate directly with Saad M.
          </p>
          <div className="pt-4 flex justify-center">
            <MagneticButton
              text="Send Project Enquiry"
              size="lg"
              variant="primary"
              onClick={() => onNavigate('/contact')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
