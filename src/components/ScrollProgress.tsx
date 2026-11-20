import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useTheme } from '../context/ThemeContext.tsx';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 origin-left pointer-events-none"
      style={{
        scaleX,
        background: isDark
          ? 'linear-gradient(90deg, #2563EB 0%, #38BDF8 55%, #BAE6FD 100%)'
          : 'linear-gradient(90deg, #1E40AF 0%, #1D4ED8 60%, #38BDF8 100%)',
        boxShadow: isDark
          ? '0 0 10px rgba(56, 189, 248, 0.55)'
          : '0 0 8px rgba(29, 78, 216, 0.35)',
      }}
    />
  );
};
