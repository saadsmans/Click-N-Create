import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '../data/faqs.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface AccordionItem {
  id?: string;
  category?: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  defaultOpenIndex,
  className = '',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex ?? null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.id || index}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? isDark
                  ? 'border-[#38BDF8]/40 bg-[#1A1D25]/85 shadow-md'
                  : 'border-[#1D4ED8]/45 bg-white shadow-xs'
                : isDark
                ? 'border-white/10 bg-[#1A1D25]/45 hover:border-[#38BDF8]/30 hover:bg-[#1A1D25]/70'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/70'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              aria-expanded={isOpen}
            >
              <span className={`text-base sm:text-lg font-bold font-display tracking-tight ${
                isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
              }`}>
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={`p-1.5 rounded-full border shrink-0 transition-colors ${
                  isOpen
                    ? isDark
                      ? 'border-[#38BDF8]/40 text-[#BAE6FD] bg-[#38BDF8]/15'
                      : 'border-[#1D4ED8]/40 text-[#1D4ED8] bg-[#F3E9DC]'
                    : isDark
                    ? 'border-white/10 text-[#94A3B8] bg-white/5'
                    : 'border-stone-200 text-[#475569] bg-stone-100'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={`px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed border-t font-medium ${
                    isDark
                      ? 'text-[#94A3B8] border-white/[0.06]'
                      : 'text-[#475569] border-stone-200/70'
                  }`}>
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
