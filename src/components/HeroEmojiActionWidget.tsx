import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface HeroEmojiActionWidgetProps {
  onNavigate: (path: string) => void;
  className?: string;
}

export const HeroEmojiActionWidget: React.FC<HeroEmojiActionWidgetProps> = ({
  onNavigate,
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Permanent official avatar photo (locked, cannot be changed by visitors)
  const avatarSrc = '/assets/aistudio/profile_photo_under_1mb-1_26da4b57.jpg';

  return (
    <div className={`pointer-events-auto select-none z-30 transition-all duration-300 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        className={`relative rounded-3xl border p-5 sm:p-6 backdrop-blur-2xl transition-all duration-300 shadow-2xl max-w-[360px] sm:max-w-[420px] w-full text-left ${
          isDark
            ? 'border-white/10 bg-[#0B0D14]/95 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white'
            : 'border-zinc-200 bg-white/95 shadow-2xl text-zinc-950'
        }`}
      >
        {/* Ambient subtle glow in dark mode */}
        {isDark && (
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#2EE59D]/10 blur-3xl pointer-events-none" />
        )}

        {/* Permanent Circular Avatar (User's Photo) */}
        <div className="mb-4">
          <div className="relative inline-block">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/40 dark:border-white/20 bg-zinc-900 shadow-md">
              <img
                src={avatarSrc}
                alt="Saad M — Web Developer"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-1 mb-3">
          <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight leading-snug">
            Remote
          </h3>
          <p className={`text-sm sm:text-base font-normal leading-relaxed ${
            isDark ? 'text-zinc-300' : 'text-zinc-600'
          }`}>
            Web design with a personal touch.
          </p>
        </div>

        {/* Availability Status Line */}
        <div className="flex items-center gap-2 mb-5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EE59D] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2EE59D]" />
          </span>
          <span className={`text-xs sm:text-sm font-medium ${
            isDark ? 'text-zinc-300' : 'text-zinc-700'
          }`}>
            Currently available for new projects
          </span>
        </div>

        {/* Action Buttons Row: Start your project + Or view pricing */}
        <div className="flex flex-wrap items-center gap-3.5 pt-1">
          {/* Primary Mint Green Pill Button */}
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="bg-[#2EE59D] hover:bg-[#28cf8d] text-[#0A1B14] font-bold text-sm px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all shadow-[0_4px_20px_rgba(46,229,157,0.35)] hover:shadow-[0_4px_25px_rgba(46,229,157,0.55)] cursor-pointer"
          >
            <span>Start your project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Secondary Link: Or view pricing -> */}
          <button
            type="button"
            onClick={() => onNavigate('/pricing')}
            className={`font-semibold text-sm inline-flex items-center gap-1 transition-colors cursor-pointer group ${
              isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            <span>Or view pricing</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
