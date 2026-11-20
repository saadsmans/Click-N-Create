import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext.tsx';

interface SectionHeadingProps {
  category?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  category,
  title,
  subtitle,
  align = 'left',
  className = '',
}) => {
  const isCenter = align === 'center';
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`mb-10 md:mb-16 w-full max-w-full overflow-hidden ${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`text-xs font-mono tracking-[0.18em] uppercase mb-3 flex items-center gap-2.5 flex-wrap ${
            isDark ? 'text-[#7DD3FC] font-semibold' : 'text-[#1D4ED8] font-semibold'
          }`}
          style={{ justifyContent: isCenter ? 'center' : 'flex-start' }}
        >
          <span className={`w-4 h-[1px] shrink-0 ${isDark ? 'bg-[#38BDF8]' : 'bg-[#1D4ED8]'}`} />
          <span className="break-words">{category}</span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.1] break-words font-display ${
          isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
        }`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed break-words ${
            isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
