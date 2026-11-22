import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, HelpCircle, Search } from 'lucide-react';
import { FAQS, FaqItem } from '../data/faqs.ts';
import { INQUIRY_PREP_CHECKLIST } from '../data/websiteContent.ts';
import { FAQAccordion } from '../components/FAQAccordion.tsx';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('faq') || {};

  const isLegacyStub =
    Array.isArray(cms.faqsList) &&
    cms.faqsList.length <= 4 &&
    cms.faqsList.every((item: any) => typeof item?.id === 'string' && /^faq-[1-4]$/.test(item.id));

  const activeFaqs: FaqItem[] =
    cms.faqsList && cms.faqsList.length > 0 && !isLegacyStub ? cms.faqsList : FAQS;

  const categories = [
    'All',
    'Pricing & Rates',
    'Services & Scope',
    'Process & Delivery',
    'Communication & Availability',
    'Technical & Technology',
    'Ownership & Legal',
  ];

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return activeFaqs.length;
    return activeFaqs.filter(
      (faq: any) =>
        faq?.category === cat ||
        (cat === 'Pricing & Rates' && (faq?.category === 'Pricing' || faq?.category === 'Pricing & Rates'))
    ).length;
  };

  const filteredFaqs = (activeFaqs || []).filter((faq: any) => {
    if (!faq || !faq.question) return false;
    const matchesCategory =
      activeCategory === 'All' ||
      faq.category === activeCategory ||
      (activeCategory === 'Pricing & Rates' && (faq.category === 'Pricing' || faq.category === 'Pricing & Rates'));
    const matchesQuery =
      (faq.question || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.answer || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const schemaFaqItems = (activeFaqs || []).slice(0, 15).map((f) => ({
    '@type': 'Question',
    name: f.question || '',
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer || '',
    },
  }));

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-clip w-full max-w-full">
      <SEOHead
        title="Frequently Asked Questions (FAQ) | Click N Create — Saad M"
        description="Get instant answers to 33 frequently asked questions about pricing (£35/hr), turnarounds, contracts, intellectual property rights, maintenance, and working directly with Saad M."
        canonicalPath="/faq"
        keywords={[
          'freelance web development FAQ',
          'website developer pricing questions',
          'freelance developer contract terms',
          'Click N Create questions',
          'hire Saad M FAQ'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: schemaFaqItems,
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
            isDark
              ? 'border-[#38BDF8]/30 bg-[#0C1222]/90 text-[#38BDF8]'
              : 'border-[#1D4ED8]/30 bg-[#F3E9DC]/75 text-[#1E40AF] shadow-2xs font-semibold'
          }`}>
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{cms.badgeText || `${activeFaqs.length} Questions Answered`}</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl font-black font-display tracking-tight leading-[1.1] ${
            isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
          }`}>
            {cms.heroTitle || 'FREQUENTLY ASKED'} <span className="text-luxury-gradient">{cms.heroHighlight || 'QUESTIONS'}</span>
          </h1>

          <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
          }`}>
            {cms.heroSubtitle || 'Straightforward, honest details about working with Saad M at Click N Create. No hidden fees, no agency runarounds.'}
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., cost, e-commerce, timeline, domain)..."
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                isDark
                  ? 'border-white/10 bg-[#0C1222]/85 text-[#F1F5F9] placeholder:text-[#94A3B8] focus:border-[#38BDF8] focus:ring-[#38BDF8]/20'
                  : 'border-black/15 bg-white text-[#0F172A] placeholder:text-[#475569]/70 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 shadow-2xs'
              }`}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  activeCategory === cat
                    ? isDark
                      ? 'bg-[#38BDF8] text-[#060913] font-bold border border-[#38BDF8] shadow-xs'
                      : 'bg-[#1D4ED8] text-white font-bold border border-[#1D4ED8] shadow-xs'
                    : isDark
                    ? 'bg-[#0C1222] text-[#94A3B8] border border-white/10 hover:text-[#F1F5F9]'
                    : 'bg-white text-[#475569] border border-black/10 hover:text-[#0F172A]'
                }`}
              >
                {cat} ({getCategoryCount(cat)})
              </button>
            ))}
          </div>

          <p className={`text-xs font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
            Showing {filteredFaqs.length} of {activeFaqs.length} questions
          </p>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length > 0 ? (
          <FAQAccordion items={filteredFaqs} defaultOpenIndex={0} />
        ) : (
          <div className={`text-center py-16 rounded-2xl border ${
            isDark ? 'border-white/10 bg-[#0C1222]/85 text-[#94A3B8]' : 'border-black/10 bg-white text-[#475569]'
          }`}>
            <p className="text-sm">No questions found matching your search.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg border border-black/15 dark:border-white/15 text-xs font-mono cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Quick Resource Directory & Pre-Inquiry Checklist */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
          }`}>
            <h3 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              Explore Helpful Pages &amp; Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
              {[
                { label: 'Instant Cost Calculator', path: '/estimator' },
                { label: 'Transparent Pricing (£35/hr)', path: '/pricing' },
                { label: 'My Works (Live Previews)', path: '/my-works' },
                { label: '5-Stage Build Process', path: '/process' },
                { label: 'Speed & Security Standards', path: '/standards' },
                { label: 'Full Portfolio & CV', path: '/portfolio' },
              ].map((link) => (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => onNavigate(link.path)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isDark
                      ? 'border-white/10 bg-white/[0.03] hover:border-[#38BDF8]/40 text-slate-200'
                      : 'border-black/10 bg-slate-50 hover:border-[#1D4ED8]/40 text-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border space-y-4 ${
            isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'
          }`}>
            <h3 className={`text-base font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              Helpful Details Before Requesting a Quote
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {INQUIRY_PREP_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Still Have Questions Box */}
        <div className={`mt-16 p-8 rounded-3xl border text-center space-y-4 backdrop-blur-xl ${
          isDark
            ? 'border-white/10 bg-[#0C1222]/90 shadow-md'
            : 'border-black/10 bg-white shadow-sm'
        }`}>
          <h3 className={`text-xl font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
            Have a question not listed here?
          </h3>
          <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
            I am happy to discuss your specific project requirements directly. Send me a message and I will reply personally.
          </p>
          <div className="pt-2">
            <MagneticButton
              text="Ask Saad Directly"
              size="md"
              variant="primary"
              onClick={() => onNavigate('/contact')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
