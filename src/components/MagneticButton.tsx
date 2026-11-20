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
        ? 'text-[#060913] font-bold border border-[#38BDF8] bg-[#38BDF8] hover:bg-[#7DD3FC] shadow-[0_8px_24px_rgba(56, 189, 248,0.28)] hover:shadow-[0_10px_28px_rgba(56, 189, 248,0.45)]'
        : 'text-white font-bold border border-[#1D4ED8] bg-[#1D4ED8] hover:bg-[#1D4ED8] shadow-[0_6px_18px_rgba(29, 78, 216,0.28)]';
    }
    if (variant === 'secondary') {
      return isDark
        ? 'text-[#F1F5F9] border border-[#38BDF8]/35 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/18 hover:text-[#BAE6FD] hover:border-[#38BDF8]/65'
        : 'text-[#0F172A] border border-stone-300 bg-[#FFFFFF] hover:bg-stone-200/70 hover:border-[#1D4ED8] shadow-xs';
    }
    // glass
    return isDark
      ? 'text-[#7DD3FC] border border-[#38BDF8]/30 bg-[#0C1222]/85 hover:bg-[#1C1F28] backdrop-blur-md'
      : 'text-[#1E40AF] border border-stone-300 bg-white/90 hover:bg-white backdrop-blur-md shadow-sm';
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
