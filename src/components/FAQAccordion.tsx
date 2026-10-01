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
                  ? 'border-white/20 bg-white/[0.04] shadow-md'
                  : 'border-zinc-300 bg-zinc-50/80 shadow-xs'
                : isDark
                ? 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.035]'
                : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-expanded={isOpen}
            >
              <span className={`text-base sm:text-lg font-bold font-display tracking-tight ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={`p-1.5 rounded-full border shrink-0 transition-colors ${
                  isOpen
                    ? isDark
                      ? 'border-white/20 text-white bg-white/10'
                      : 'border-zinc-300 text-zinc-900 bg-zinc-200/60'
                    : isDark
                    ? 'border-white/10 text-zinc-400 bg-white/5'
                    : 'border-zinc-200 text-zinc-500 bg-zinc-100'
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
                      ? 'text-zinc-100 border-white/[0.04]'
                      : 'text-zinc-900 border-zinc-200/60'
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
