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
          ? 'linear-gradient(90deg, #00F0FF 0%, #7928CA 50%, #FF0055 100%)'
          : 'linear-gradient(90deg, #00B4D8 0%, #6366F1 50%, #E11D48 100%)',
        boxShadow: isDark
          ? '0 0 12px rgba(0, 240, 255, 0.7)'
          : '0 0 10px rgba(0, 180, 216, 0.4)',
      }}
    />
  );
};
