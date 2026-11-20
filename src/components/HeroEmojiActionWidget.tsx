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
        className={`relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-2xl max-w-[360px] sm:max-w-[420px] w-full text-left ${
          isDark
            ? 'border-[#38BDF8]/25 bg-[#0C1222]/95 shadow-[0_20px_50px_rgba(0,0,0,0.75)] text-[#F1F5F9]'
            : 'border-stone-300 bg-[#FFFFFF]/95 shadow-2xl text-[#0F172A]'
        }`}
      >
        {/* Permanent Circular Avatar (User's Photo) */}
        <div className="mb-4">
          <div className="relative inline-block">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#38BDF8]/60 bg-zinc-900 shadow-md">
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
            isDark ? 'text-[#94A3B8]' : 'text-stone-600'
          }`}>
            Web design with a personal touch.
          </p>
        </div>

        {/* Availability Status Line */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          <span className={`text-xs sm:text-sm font-medium ${
            isDark ? 'text-[#F1F5F9]/85' : 'text-stone-700'
          }`}>
            Currently available for new projects
          </span>
        </div>

        {/* Action Buttons Row: Start your project + Or view pricing */}
        <div className="flex flex-wrap items-center gap-3.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#060913] font-bold text-sm px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all shadow-[0_8px_22px_rgba(56, 189, 248,0.3)] cursor-pointer"
          >
            <span>Start your project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/pricing')}
            className={`font-semibold text-sm inline-flex items-center gap-1 transition-colors cursor-pointer group ${
              isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-stone-700 hover:text-[#0F172A]'
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
