import React, { useState } from 'react';
import { CheckCircle2, ArrowUpRight, Calculator, Sparkles, MessageSquare } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading.tsx';
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
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-clip w-full max-w-full">
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
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
            isDark
              ? 'border-[#38BDF8]/30 bg-[#0C1222]/90 text-[#38BDF8]'
              : 'border-[#1D4ED8]/30 bg-[#F3E9DC]/75 text-[#1E40AF] shadow-2xs font-semibold'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{cms.badgeText || 'Honest & Predictable'}</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] ${
            isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
          }`}>
            {cms.heroTitle || 'TRANSPARENT'} <span className="text-luxury-gradient">{cms.heroHighlight || 'PRICING'}</span>
          </h1>

          <p className={`mt-5 text-base sm:text-xl leading-relaxed ${
            isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
          }`}>
            {cms.heroSubtitle || (
              <>
                Clear, honest rates with zero hidden markups. Standard rate is <strong className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>£35 per hour</strong> for flexible development, alongside bespoke fixed-price quotes tailored to your exact project scope.
              </>
            )}
          </p>
        </div>

        {/* ===================== RATE HERO BANNER ===================== */}
        <div className={`p-8 sm:p-10 rounded-3xl border mb-20 backdrop-blur-xl ${
          isDark
            ? 'border-[#38BDF8]/25 bg-gradient-to-r from-[#1A1D25] via-[#0C1222] to-[#060913] text-[#F1F5F9]'
            : 'border-black/10 bg-gradient-to-r from-[#F3E9DC]/60 via-white to-[#F3F6FA] text-[#0F172A] shadow-sm'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className={`text-xs font-mono tracking-widest uppercase font-semibold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                Direct Freelancer Rate
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
                £35 <span className={`text-lg sm:text-2xl font-normal ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>/ hour</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                Available for custom component development, website redesigns, speed optimization, bug remediation, or ongoing technical maintenance.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`py-3.5 px-6 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isDark ? 'bg-[#38BDF8] text-[#060913] hover:bg-[#7DD3FC]' : 'bg-[#1D4ED8] text-white hover:bg-[#1D4ED8]'
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
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold font-display">
                    Estimated Development Hours: <span className={`font-mono ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>{projectHours} hrs</span>
                  </label>
                  <span className={`text-xs font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
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
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    isDark ? 'bg-[#1A1D25] accent-[#38BDF8]' : 'bg-[#EAE6DF] accent-[#1D4ED8]'
                  }`}
                />
                <div className={`flex justify-between text-[11px] font-mono mt-2 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  <span>5 hrs (Focused Tweaks)</span>
                  <span>15 hrs (Starter Website)</span>
                  <span>60 hrs (Full Platform)</span>
                </div>
              </div>

              {/* Addon checkboxes */}
              <div className="space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
                <span className={`text-xs font-mono uppercase tracking-wider block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Select Optional Scope Modules:
                </span>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#1D4ED8]/50 dark:hover:border-[#38BDF8]/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeSeo}
                      onChange={(e) => setIncludeSeo(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#38BDF8] focus:ring-[#38BDF8]"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Get Found on Google & Social Previews</div>
                      <div className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Google search setup, star ratings & WhatsApp link preview cards</div>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>+£85</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#1D4ED8]/50 dark:hover:border-[#38BDF8]/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeEcommerce}
                      onChange={(e) => setIncludeEcommerce(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#38BDF8] focus:ring-[#38BDF8]"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Take Online Card Payments & Shopping Cart</div>
                      <div className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Apple Pay, credit cards, PayPal & slide-out shopping cart</div>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>+£180</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#1D4ED8]/50 dark:hover:border-[#38BDF8]/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeMaintenance}
                      onChange={(e) => setIncludeMaintenance(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#38BDF8] focus:ring-[#38BDF8]"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Hosting Setup, Domain & 30 Days of Free Help</div>
                      <div className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Fast cloud hosting, connect your domain, secure lock & launch support</div>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>+£85</span>
                </label>
              </div>
            </div>

            {/* Live Calculation Card */}
            <div className={`lg:col-span-5 p-8 rounded-3xl border space-y-6 ${
              isDark ? 'border-[#38BDF8]/25 bg-[#0C1222]/95 shadow-xl' : 'border-black/10 bg-white shadow-md'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Calculator className={`w-5 h-5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Estimated Investment
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold">Transparent</span>
              </div>

              <div>
                <span className={`text-xs font-mono block mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Estimated Range:</span>
                <div className={`text-4xl sm:text-5xl font-black font-display tracking-tight ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                  £{totalEstimatedCost.toLocaleString()}
                </div>
                <span className={`text-xs font-mono mt-1 block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Based on ~{projectHours} hours @ £35/hr + selected modules
                </span>
              </div>

              <div className={`space-y-2 text-xs font-mono pt-2 border-t border-black/10 dark:border-white/10 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                <div className="flex justify-between">
                  <span>Development Hours:</span>
                  <span className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>{projectHours} hrs (£{baseCost})</span>
                </div>
                {includeSeo && (
                  <div className="flex justify-between">
                    <span>On-Page SEO Module:</span>
                    <span className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>£85</span>
                  </div>
                )}
                {includeEcommerce && (
                  <div className="flex justify-between">
                    <span>Payment Integration:</span>
                    <span className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>£180</span>
                  </div>
                )}
                {includeMaintenance && (
                  <div className="flex justify-between">
                    <span>Deployment & 30-Day QA:</span>
                    <span className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>£85</span>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('/estimator')}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer ${
                    isDark ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#060913]' : 'bg-[#1D4ED8] hover:bg-[#1D4ED8] text-white'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>Open Full Project Estimator</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`w-full py-3 px-4 rounded-xl font-display font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isDark ? 'bg-[#F1F5F9] text-[#060913] hover:bg-[#38BDF8]' : 'bg-[#0F172A] text-white hover:bg-[#2a2b30]'
                  }`}
                >
                  <span>Lock in Estimate with Saad</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <p className={`text-center text-[11px] font-mono mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
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
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
            }`}>
              <div>
                <span className={`text-xs font-mono uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Package 01 · Quick Start</span>
                <h3 className="text-xl font-bold font-display mt-1">Single-Page Website</h3>
                <div className={`text-3xl font-extrabold font-display my-4 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                  £280 – £480
                </div>
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  A focused, high-converting one-page website to promote your services, launch an offer, or run ads.
                </p>
                <div className={`space-y-2 text-xs ${isDark ? 'text-[#F1F5F9]/85' : 'text-[#475569]'}`}>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Looks great on mobile phones & tablets</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Contact form sent directly to your email</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Dark & light reading mode</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Google search setup & WhatsApp link cards</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Fast delivery: 3 – 5 days</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`w-full mt-8 py-2.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  isDark ? 'border-white/20 hover:bg-white/10 text-[#F1F5F9]' : 'border-black/15 hover:bg-[#F3F6FA] text-[#0F172A]'
                }`}
              >
                Inquire About Single-Page Site
              </button>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between relative shadow-lg ${
              isDark ? 'border-[#38BDF8]/55 bg-[#0C1222]' : 'border-[#1D4ED8] bg-white'
            }`}>
              <div className={`absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                isDark ? 'bg-[#38BDF8] text-[#060913]' : 'bg-[#1D4ED8] text-white'
              }`}>
                Most Popular
              </div>
              <div>
                <span className={`text-xs font-mono uppercase font-semibold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>Package 02 · Full Business</span>
                <h3 className="text-xl font-bold font-display mt-1">Multi-Page Business Website</h3>
                <div className={`text-3xl font-extrabold font-display my-4 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                  £550 – £980
                </div>
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Complete 4 to 8 page website for companies, consultants, salons, clinics, and local services.
                </p>
                <div className={`space-y-2 text-xs ${isDark ? 'text-[#F1F5F9]/85' : 'text-[#475569]'}`}>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Up to 8 designed pages (About, Services, Menu, Contact)</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Customer FAQ dropdowns & photo galleries</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Customer inquiries sent straight to your email</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Domain connection, security lock & fast cloud hosting</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Personal video guide on how to change text yourself</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Typical delivery: 1 – 2 weeks</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`w-full mt-8 py-2.5 rounded-xl font-mono text-xs font-bold shadow-sm transition-colors cursor-pointer ${
                  isDark ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#060913]' : 'bg-[#1D4ED8] hover:bg-[#1D4ED8] text-white'
                }`}
              >
                Inquire About Business Website
              </button>
            </div>

            {/* Tier 3 */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between ${
              isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
            }`}>
              <div>
                <span className={`text-xs font-mono uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Package 03 · Store or Custom Tool</span>
                <h3 className="text-xl font-bold font-display mt-1">Online Store or Custom App</h3>
                <div className={`text-3xl font-extrabold font-display my-4 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                  From £950 – £1,800+
                </div>
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                  Online retail storefronts or custom interactive tools (price estimators, client portals, calculators).
                </p>
                <div className={`space-y-2 text-xs ${isDark ? 'text-[#F1F5F9]/85' : 'text-[#475569]'}`}>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Slide-out shopping cart & card payments (Apple Pay, PayPal)</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Interactive price calculator or client booking portal</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Customer accounts & order tracking</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Direct priority WhatsApp support with Saad</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} /><span>Typical delivery: 2 – 3 weeks</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className={`w-full mt-8 py-2.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  isDark ? 'border-white/20 hover:bg-white/10 text-[#F1F5F9]' : 'border-black/15 hover:bg-[#F3F6FA] text-[#0F172A]'
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
            <div className={`p-6 rounded-2xl border ${isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white'}`}>
              <h4 className="text-base font-bold font-display mb-2">How does the £35/hr rate work in practice?</h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                For hourly tasks (such as website tweaks, new component additions, performance tuning, or consultations), I track time transparently in 15-minute increments. You receive itemized activity reports showing exactly what was built.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white'}`}>
              <h4 className="text-base font-bold font-display mb-2">When do I pay? What is your deposit structure?</h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                For fixed projects, I request a 50% deposit upon contract agreement and discovery sign-off. The remaining 50% is due only upon final QA approval before live domain deployment. For hourly retainers, invoices are sent bi-weekly or monthly.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white'}`}>
              <h4 className="text-base font-bold font-display mb-2">Are there any hidden costs?</h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                None. Any third-party costs (such as your domain registration ~£10/year or specialized paid API accounts) are registered directly in your name so you retain permanent ownership without agency markup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
