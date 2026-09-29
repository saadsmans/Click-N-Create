import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

/**
 * Pure Typographic Brandmark for Click N Create (clean sleek typography)
 */
export const ClickNCreateLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: {
      brand: 'text-base sm:text-lg',
      sub: 'text-[9px]',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      brand: 'text-lg sm:text-xl',
      sub: 'text-[10px]',
      dot: 'w-2 h-2',
    },
    lg: {
      brand: 'text-xl sm:text-2xl',
      sub: 'text-[11px]',
      dot: 'w-2.5 h-2.5',
    },
    xl: {
      brand: 'text-2xl sm:text-3xl',
      sub: 'text-xs',
      dot: 'w-3 h-3',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col leading-none select-none group cursor-pointer ${className}`}>
      <div className="flex items-center gap-1.5">
        <span
          className={`font-display font-extrabold tracking-tight transition-colors duration-200 ${
            isDark ? 'text-white group-hover:text-zinc-200' : 'text-zinc-950 group-hover:text-zinc-800'
          } ${currentSize.brand}`}
        >
          CLICK <span className="font-light text-zinc-400">N</span> CREATE
        </span>
        <span className={`rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] ${currentSize.dot}`} />
      </div>
      {showText && (
        <span className={`font-mono tracking-widest uppercase mt-1 text-zinc-500 font-medium ${currentSize.sub}`}>
          Saad M // Freelance Web Dev
        </span>
      )}
    </div>
  );
};
