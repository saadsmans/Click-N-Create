import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowUpRight, Calculator, Clock, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('pricing') || {};

  // Rate: £35 / hr (or custom CMS rate)
  const hourlyRate = cms.hourlyRateNumber || 35;

  // Interactive Project Cost Calculator State
  const [projectHours, setProjectHours] = useState<number>(20);
  const [includeSeo, setIncludeSeo] = useState<boolean>(true);
  const [includeEcommerce, setIncludeEcommerce] = useState<boolean>(false);
  const [includeMaintenance, setIncludeMaintenance] = useState<boolean>(false);

  const baseCost = projectHours * hourlyRate;
  const seoCost = includeSeo ? 85 : 0;
  const ecommerceCost = includeEcommerce ? 180 : 0;
  const maintenanceCost = includeMaintenance ? 85 : 0;
  const totalEstimatedCost = baseCost + seoCost + ecommerceCost + maintenanceCost;

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-hidden w-full max-w-full">
      <SEOHead
        title="Web Development Pricing & Hourly Rates UK (£35/hr) | Click N Create"
        description="Transparent freelance web development pricing by Saad M (£35/hr). Calculate project investment, view starter packages, and get fixed milestone quotations with zero hidden fees."
        canonicalPath="/pricing"
        keywords={[
          'freelance web developer rates UK',
          'website development cost UK',
          'hire freelance developer hourly rate £35',
          'custom website quote UK',
          'affordable website pricing UK',
          'Click N Create pricing',
          'fixed price web design quote'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'PriceSpecification',
          name: 'Click N Create Web Development Pricing',
          price: '35',
          priceCurrency: 'GBP',
          unitText: 'HOUR',
          description: 'Transparent £35/hr rate for web development, UI design, Shopify e-commerce, and maintenance.',
          eligibleRegion: {
            '@type': 'Country',
            name: 'United Kingdom'
          }
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===================== HERO SECTION ===================== */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
            isDark ? 'border-white/10 bg-white/5 text-blue-400' : 'border-zinc-300 bg-white text-blue-600 shadow-2xs font-semibold'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{cms.badgeText || 'Honest & Predictable'}</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>
            {cms.heroTitle || 'TRANSPARENT'} <span className="text-luxury-gradient">{cms.heroHighlight || 'PRICING'}</span>
          </h1>

          <p className={`mt-5 text-base sm:text-xl leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            {cms.heroSubtitle || (
              <>
                Clear, honest rates with zero hidden markups. Standard rate is <strong className="text-blue-500 font-bold">£35 per hour</strong> for flexible development, alongside bespoke fixed-price quotes tailored to your exact project scope.
              </>
            )}
          </p>
        </div>

        {/* ===================== RATE HERO BANNER ===================== */}
        <div className={`p-8 sm:p-10 rounded-3xl border mb-20 backdrop-blur-xl ${
          isDark
            ? 'border-white/15 bg-gradient-to-r from-blue-950/20 via-zinc-900 to-black text-white'
            : 'border-zinc-200 bg-gradient-to-r from-blue-50 via-white to-zinc-50 text-zinc-950 shadow-sm'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono tracking-widest text-blue-500 uppercase font-semibold">
                Direct Freelancer Rate
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
                £35 <span className="text-lg sm:text-2xl font-normal text-zinc-500">/ hour</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Available for custom component development, website redesigns, speed optimization, bug remediation, or ongoing technical maintenance.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`py-3.5 px-6 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                }`}
              >
                <span>Hire Saad at £35/hr</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discuss Scope on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* ===================== INTERACTIVE PROJECT COST ESTIMATOR ===================== */}
        <div className="py-16 border-y border-black/[0.08] dark:border-white/[0.08] mb-20">
          <SectionHeading
            category="Interactive Calculator"
            title="ESTIMATE YOUR PROJECT INVESTMENT"
            subtitle="Use this interactive estimator based on my £35/hr rate to get an immediate realistic cost range for your build."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            {/* Calculator Controls */}
            <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border space-y-6 ${
              isDark ? 'border-white/10 bg-white/[0.025]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold font-display">
                    Estimated Development Hours: <span className="text-blue-500 font-mono">{projectHours} hrs</span>
                  </label>
                  <span className="text-xs font-mono text-zinc-500">
                    £{projectHours * hourlyRate} base (@ £35/hr)
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="2"
                  value={projectHours}
                  onChange={(e) => setProjectHours(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-2">
                  <span>5 hrs (Focused Tweaks)</span>
                  <span>15 hrs (Starter Website)</span>
                  <span>60 hrs (Full Platform)</span>
                </div>
              </div>

              {/* Addon checkboxes */}
              <div className="space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">
                  Select Optional Scope Modules:
                </span>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-blue-500/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeSeo}
                      onChange={(e) => setIncludeSeo(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Get Found on Google & Social Previews</div>
                      <div className="text-[11px] text-zinc-500">Google search setup, star ratings & WhatsApp link preview cards</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-blue-500 font-bold">+£85</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-blue-500/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeEcommerce}
                      onChange={(e) => setIncludeEcommerce(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Take Online Card Payments & Shopping Cart</div>
                      <div className="text-[11px] text-zinc-500">Apple Pay, credit cards, PayPal & slide-out shopping cart</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-blue-500 font-bold">+£180</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-blue-500/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeMaintenance}
                      onChange={(e) => setIncludeMaintenance(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Hosting Setup, Domain & 30 Days of Free Help</div>
                      <div className="text-[11px] text-zinc-500">Fast cloud hosting, connect your domain, secure lock & launch support</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-blue-500 font-bold">+£85</span>
                </label>
              </div>
            </div>

            {/* Live Calculation Card */}
            <div className={`lg:col-span-5 p-8 rounded-3xl border space-y-6 ${
              isDark ? 'border-white/15 bg-[#0E0E12]/95 shadow-xl' : 'border-zinc-200 bg-white shadow-md'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Estimated Investment
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold">Transparent</span>
              </div>

              <div>
                <span className="text-xs font-mono text-zinc-500 block mb-1">Estimated Range:</span>
                <div className="text-4xl sm:text-5xl font-black font-display tracking-tight text-blue-500">
                  £{totalEstimatedCost.toLocaleString()}
                </div>
                <span className="text-xs font-mono text-zinc-500 mt-1 block">
                  Based on ~{projectHours} hours @ £35/hr + selected modules
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-zinc-500 pt-2 border-t border-black/10 dark:border-white/10">
                <div className="flex justify-between">
                  <span>Development Hours:</span>
                  <span className={isDark ? 'text-white' : 'text-zinc-900'}>{projectHours} hrs (£{baseCost})</span>
                </div>
                {includeSeo && (
                  <div className="flex justify-between">
                    <span>On-Page SEO Module:</span>
                    <span className={isDark ? 'text-white' : 'text-zinc-900'}>£85</span>
                  </div>
                )}
                {includeEcommerce && (
                  <div className="flex justify-between">
                    <span>Payment Integration:</span>
                    <span className={isDark ? 'text-white' : 'text-zinc-900'}>£180</span>
                  </div>
                )}
                {includeMaintenance && (
                  <div className="flex justify-between">
                    <span>Deployment & 30-Day QA:</span>
                    <span className={isDark ? 'text-white' : 'text-zinc-900'}>£85</span>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('/estimator')}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Open Full Project Estimator</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`w-full py-3 px-4 rounded-xl font-display font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>Lock in Estimate with Saad</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <p className="text-center text-[11px] font-mono text-zinc-500 mt-1">
                  Standard £35/hr rate or guaranteed fixed milestone quotes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== FIXED MILESTONE BRACKETS ===================== */}
        <div className="mb-20">
          <SectionHeading
            category="Clear Package Options"
            title="SIMPLE, PREDICTABLE PACKAGES"
            subtitle="For complete websites with clear requirements, I offer fixed-price packages so you know the exact cost upfront."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Tier 1 */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase">Package 01 · Quick Start</span>
                <h3 className="text-xl font-bold font-display mt-1">Single-Page Website</h3>
                <div className="text-3xl font-extrabold font-display my-4 text-blue-500">
                  £280 – £480
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                  A focused, high-converting one-page website to promote your services, launch an offer, or run ads.
                </p>
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Looks great on mobile phones & tablets</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Contact form sent directly to your email</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Dark & light reading mode</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Google search setup & WhatsApp link cards</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Fast delivery: 3 – 5 days</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`w-full mt-8 py-2.5 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-zinc-300 hover:bg-zinc-100 text-zinc-900'
                }`}
              >
                Inquire About Single-Page Site
              </button>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between relative shadow-lg ${
              isDark ? 'border-blue-500/50 bg-[#0E0E12]' : 'border-blue-600 bg-white'
            }`}>
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono uppercase tracking-wider font-bold">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-mono text-blue-500 uppercase font-semibold">Package 02 · Full Business</span>
                <h3 className="text-xl font-bold font-display mt-1">Multi-Page Business Website</h3>
                <div className="text-3xl font-extrabold font-display my-4 text-blue-500">
                  £550 – £980
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                  Complete 4 to 8 page website for companies, consultants, salons, clinics, and local services.
                </p>
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Up to 8 designed pages (About, Services, Menu, Contact)</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Customer FAQ dropdowns & photo galleries</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Customer inquiries sent straight to your email</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Domain connection, security lock & fast cloud hosting</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Personal video guide on how to change text yourself</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Typical delivery: 1 – 2 weeks</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="w-full mt-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs shadow-sm transition-colors"
              >
                Inquire About Business Website
              </button>
            </div>

            {/* Tier 3 */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between ${
              isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
            }`}>
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase">Package 03 · Store or Custom Tool</span>
                <h3 className="text-xl font-bold font-display mt-1">Online Store or Custom App</h3>
                <div className="text-3xl font-extrabold font-display my-4 text-blue-500">
                  From £950 – £1,800+
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                  Online retail storefronts or custom interactive tools (price estimators, client portals, calculators).
                </p>
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Slide-out shopping cart & card payments (Apple Pay, PayPal)</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Interactive price calculator or client booking portal</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Customer accounts & order tracking</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Direct priority WhatsApp support with Saad</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /><span>Typical delivery: 2 – 3 weeks</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`w-full mt-8 py-2.5 rounded-xl border text-xs font-mono transition-colors ${
                  isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-zinc-300 hover:bg-zinc-100 text-zinc-900'
                }`}
              >
                Inquire About Online Store or App
              </button>
            </div>
          </div>
        </div>

        {/* ===================== PRICING FAQ SECTION ===================== */}
        <div className="max-w-4xl mx-auto py-12">
          <SectionHeading
            category="Billing FAQ"
            title="FREQUENTLY ASKED PRICING QUESTIONS"
            subtitle="Straightforward answers regarding invoices, deposits, hourly vs fixed rates, and ongoing maintenance."
          />

          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-2xl border ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
              <h4 className="text-base font-bold font-display mb-2">How does the £35/hr rate work in practice?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                For hourly tasks (such as website tweaks, new component additions, performance tuning, or consultations), I track time transparently in 15-minute increments. You receive itemized activity reports showing exactly what was built.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
              <h4 className="text-base font-bold font-display mb-2">When do I pay? What is your deposit structure?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                For fixed projects, I request a 50% deposit upon contract agreement and discovery sign-off. The remaining 50% is due only upon final QA approval before live domain deployment. For hourly retainers, invoices are sent bi-weekly or monthly.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
              <h4 className="text-base font-bold font-display mb-2">Are there any hidden costs?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                None. Any third-party costs (such as your domain registration ~£10/year or specialized paid API accounts) are registered directly in your name so you retain permanent ownership without agency markup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
