import React, { useState } from 'react';
import { HelpCircle, Search } from 'lucide-react';
import { FAQS, FaqItem } from '../data/faqs.ts';
import { FAQAccordion } from '../components/FAQAccordion.tsx';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categories = [
    'All',
    'Pricing & Rates',
    'Services & Scope',
    'Process & Delivery',
    'Communication & Availability',
    'Technical & Technology',
    'Ownership & Legal',
  ];

  const filteredFaqs = FAQS.filter((faq: FaqItem) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const schemaFaqItems = FAQS.slice(0, 10).map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  }));

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-hidden w-full max-w-full">
      <SEOHead
        title="Frequently Asked Questions (FAQ) | Click N Create — Saad M"
        description="Get instant answers about pricing (£35/hr), turnarounds, contracts, intellectual property rights, maintenance, and working directly with Saad M."
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
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
            isDark ? 'border-white/10 bg-white/5 text-blue-400' : 'border-zinc-300 bg-white text-blue-600 shadow-2xs font-semibold'
          }`}>
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Transparency & Answers</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl font-black font-display tracking-tight leading-[1.1] ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>
            FREQUENTLY ASKED <span className="text-luxury-gradient">QUESTIONS</span>
          </h1>

          <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            Straightforward, honest details about working with Saad M at Click N Create. No hidden fees, no agency runarounds.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., cost, e-commerce, timeline)..."
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                isDark
                  ? 'border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-500 focus:border-blue-500'
                  : 'border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 shadow-2xs'
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
                className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  activeCategory === cat
                    ? isDark
                      ? 'bg-white/15 text-white border border-white/25 shadow-xs'
                      : 'bg-zinc-900 text-white border border-zinc-900 shadow-xs'
                    : isDark
                    ? 'bg-white/[0.02] text-zinc-400 border border-white/5 hover:text-white'
                    : 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:text-zinc-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length > 0 ? (
          <FAQAccordion items={filteredFaqs} defaultOpenIndex={0} />
        ) : (
          <div className={`text-center py-16 rounded-2xl border ${
            isDark ? 'border-white/10 bg-white/[0.02] text-zinc-400' : 'border-zinc-200 bg-white text-zinc-600'
          }`}>
            <p className="text-sm">No questions found matching your search.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/20 text-xs font-mono"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Still Have Questions Box */}
        <div className={`mt-16 p-8 rounded-3xl border text-center space-y-4 backdrop-blur-xl ${
          isDark
            ? 'border-white/10 bg-[#0E0E12]/80 shadow-md'
            : 'border-zinc-200 bg-white shadow-sm'
        }`}>
          <h3 className={`text-xl font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            Have a question not listed here?
          </h3>
          <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
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
