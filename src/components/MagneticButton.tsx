import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface MagneticButtonProps {
  children?: React.ReactNode;
  text?: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  text,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  showArrow = true,
  className = '',
}) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = (clientX - centerX) * 0.3;
    const distanceY = (clientY - centerY) * 0.3;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base font-semibold',
  };

  const getVariantClasses = () => {
    if (variant === 'primary') {
      return isDark
        ? 'text-black font-bold border border-[#00F0FF] bg-[#00F0FF] hover:bg-[#38bdf8] shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)]'
        : 'text-white font-bold border border-cyan-600 bg-cyan-600 hover:bg-cyan-700 shadow-[0_4px_14px_rgba(0,180,216,0.3)] hover:shadow-[0_6px_20px_rgba(0,180,216,0.5)]';
    }
    if (variant === 'secondary') {
      return isDark
        ? 'text-zinc-200 border border-[#00F0FF]/30 bg-[#00F0FF]/5 hover:bg-[#00F0FF]/15 hover:text-[#00F0FF] hover:border-[#00F0FF]/60 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
        : 'text-cyan-900 border border-cyan-300 bg-cyan-50/60 hover:bg-cyan-100 hover:text-cyan-950 hover:border-cyan-400 shadow-sm';
    }
    // glass
    return isDark
      ? 'text-[#00F0FF] border border-[#00F0FF]/30 bg-[#00F0FF]/5 hover:bg-[#00F0FF]/10 backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.15)]'
      : 'text-cyan-800 border border-cyan-400/40 bg-white/80 hover:bg-white backdrop-blur-md shadow-sm';
  };

  const content = (
    <motion.div
      className="flex items-center justify-center gap-2 select-none relative z-10"
      animate={{ scale: isHovered ? 1.02 : 1 }}
      transition={{ duration: 0.15 }}
    >
      <span>{text || children}</span>
      {showArrow && (
        <motion.div
          animate={{ x: isHovered ? 2 : 0, y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowUpRight className="w-4 h-4 shrink-0 transition-colors" />
        </motion.div>
      )}
    </motion.div>
  );

  const commonProps = {
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: handleMouseLeave,
    className: `inline-flex items-center justify-center rounded-xl overflow-hidden font-display transition-all duration-200 cursor-pointer ${sizeClasses[size]} ${getVariantClasses()} ${className}`,
    style: { x, y },
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        {...commonProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      {...commonProps}
    >
      {content}
    </motion.button>
  );
};
