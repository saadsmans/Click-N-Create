import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../context/ThemeContext.tsx';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const auraSpringConfig = { damping: 40, stiffness: 120 };
  const auraX = useSpring(mouseX, auraSpringConfig);
  const auraY = useSpring(mouseY, auraSpringConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest('a, button, input, textarea, select, [role="button"], .interactive-hover');
      setIsHovered(!!clickable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Cyber diffused aura */}
      <motion.div
        className={`absolute top-0 left-0 w-44 h-44 -ml-22 -mt-22 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none ${
          isDark ? 'bg-[#00F0FF]/20' : 'bg-cyan-500/15'
        }`}
        style={{
          x: auraX,
          y: auraY,
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.45 : 0.2,
        }}
      />

      {/* Outer cyber ring */}
      <motion.div
        className={`absolute top-0 left-0 w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border backdrop-blur-[1px] transition-colors ${
          isHovered
            ? isDark
              ? 'border-[#00F0FF] shadow-[0_0_12px_#00F0FF]'
              : 'border-cyan-600 shadow-sm'
            : isDark
            ? 'border-white/30'
            : 'border-zinc-800/40'
        }`}
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovered ? 1.7 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />

      {/* Center cyber dot */}
      <motion.div
        className={`absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full shadow-xs ${
          isDark ? 'bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]' : 'bg-cyan-700'
        }`}
        style={{
          x: mouseX,
          y: mouseY,
          scale: isHovered ? 0.7 : 1,
        }}
      />
    </div>
  );
};
