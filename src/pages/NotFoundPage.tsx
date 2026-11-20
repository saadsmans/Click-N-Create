import React from 'react';
import { motion } from 'motion/react';
import { MagneticButton } from '../components/MagneticButton.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-28 pb-20 px-4 relative overflow-x-clip w-full max-w-full">
      <SEOHead
        title="404 — Page Not Found | Click N Create"
        description="The requested page could not be found on Click N Create."
      />
      <div className={`max-w-md w-full rounded-3xl border p-8 sm:p-10 text-center shadow-xl relative z-10 space-y-6 backdrop-blur-2xl transition-colors ${
        isDark ? 'border-white/10 bg-[#0C1222]/90' : 'border-black/10 bg-white/95'
      }`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <span className="text-7xl sm:text-8xl font-black font-display tracking-tighter text-luxury-gradient">
            404
          </span>
        </motion.div>

        <div className="space-y-2">
          <h2 className={`text-xl font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
            Looks like this page doesn't exist.
          </h2>
          <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
            The route you navigated to could not be found or has moved.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <MagneticButton
            text="Back Home"
            size="md"
            variant="primary"
            showArrow={false}
            onClick={() => onNavigate('/')}
          />

          <MagneticButton
            text="Explore Services"
            size="md"
            variant="secondary"
            showArrow={false}
            onClick={() => onNavigate('/services')}
          />
        </div>

        <div className="text-[11px] font-mono text-zinc-500 pt-2">
          Click N Create · Saad M
        </div>
      </div>
    </div>
  );
};
