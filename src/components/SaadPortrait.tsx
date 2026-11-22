import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface SaadPortraitProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

const PERMANENT_AVATAR_SRC = '/assets/aistudio/profile_photo_under_1mb-1_26da4b57.jpg';

export const SaadPortrait: React.FC<SaadPortraitProps> = ({
  className = '',
  size = 'md',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hasError, setHasError] = useState(false);

  // Clear any legacy custom avatar override so the permanent avatar is always displayed
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('saad_custom_avatar')) {
        localStorage.removeItem('saad_custom_avatar');
      }
    } catch {
      // Ignore storage access restrictions
    }
  }, []);

  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-48 sm:w-56 aspect-[3/4]',
    lg: 'w-64 sm:w-72 aspect-[3/4]',
    hero: 'w-full max-w-[320px] aspect-[3/4]',
  };

  return (
    <div className={`relative group inline-block select-none ${className}`}>
      {/* Cyber Neon Ambient Rim Glow */}
      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#00F0FF] via-[#7000FF] to-[#FF0055] opacity-60 blur-xl group-hover:opacity-90 group-hover:blur-2xl transition duration-500 animate-pulse pointer-events-none" />

      {/* Outer Card Shell */}
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl sm:rounded-3xl overflow-hidden border-2 shadow-2xl transition-all duration-300 group-hover:scale-[1.01] ${
          isDark
            ? 'border-[#00F0FF]/50 bg-[#06060F] shadow-[0_20px_60px_rgba(0,0,0,0.9)]'
            : 'border-cyan-500 bg-zinc-950 shadow-2xl'
        }`}
      >
        {/* Permanent Official Portrait Display */}
        {!hasError ? (
          <img
            src={PERMANENT_AVATAR_SRC}
            alt="Saad M — Electronics & Communication Engineer & Web Developer"
            draggable={false}
            className="w-full h-full object-cover object-top"
            onError={() => setHasError(true)}
          />
        ) : (
          /* Stylized Fallback Portrait */
          <div className="w-full h-full bg-gradient-to-b from-[#140c2e] via-[#090818] to-black flex flex-col items-center justify-between p-5 relative overflow-hidden select-none">
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#00F0FF]/25 blur-3xl pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#7000FF]/35 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

            <div className="w-full flex items-center justify-between text-[9px] font-mono text-[#00F0FF] relative z-10">
              <span className="flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                <span>SAAD M</span>
              </span>
              <span className="text-zinc-400">EC ENG · WEB DEV</span>
            </div>

            <div className="w-full text-center relative z-20 my-auto">
              <div className="text-white font-display font-bold text-lg tracking-tight">
                Saad M
              </div>
              <div className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider mt-1">
                Lead Engineer · Click N Create
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner Strip with Status Badge (no edit/camera button) */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end justify-between z-20">
          <div>
            <div className="text-white font-bold font-display text-sm leading-tight drop-shadow-md">
              Saad M
            </div>
            <div className="text-[#00F0FF] text-[11px] font-mono flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Hire</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

