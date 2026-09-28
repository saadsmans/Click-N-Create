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
    <div className={`mb-12 md:mb-16 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`text-xs font-mono tracking-widest uppercase mb-3 flex items-center gap-2 ${
            isDark ? 'text-[#00F0FF] font-bold' : 'text-cyan-800 font-bold'
          }`}
          style={{ justifyContent: isCenter ? 'center' : 'flex-start' }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]' : 'bg-cyan-600'}`} />
          <span>[ {category} ]</span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-balance font-display ${
          isDark ? 'text-white' : 'text-zinc-950'
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
          className={`mt-4 text-base md:text-lg leading-relaxed text-balance ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
