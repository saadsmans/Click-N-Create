import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { MagneticButton } from './MagneticButton.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface FinalCTAProps {
  onStartProject: () => void;
  onExploreServices: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartProject, onExploreServices }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      {/* Diffused ambient light */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[150px] pointer-events-none transition-opacity ${
        isDark ? 'bg-gradient-to-r from-[#00F0FF]/15 to-[#FF0055]/15' : 'bg-cyan-400/15'
      }`} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Subtle kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase mb-6 ${
            isDark
              ? 'border-[#00F0FF]/40 bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
              : 'border-cyan-400 bg-white text-cyan-800 shadow-2xs font-semibold'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>[ NEW PROJECT AVAILABILITY // 2026 ]</span>
        </motion.div>

        {/* Large Typography */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-2 mb-8"
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-mono tracking-wider uppercase text-zinc-500">
            HAVE AN IDEA?
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tight leading-tight sm:leading-none break-words">
            LET'S <span className="text-cyber-gradient">CREATE</span> IT.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-base sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12 ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}
        >
          Tell me what you're building and let's start the conversation. Direct collaboration, custom engineering, and refined modern aesthetics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            text="Start a Project"
            size="lg"
            variant="primary"
            onClick={onStartProject}
          />

          <MagneticButton
            text="Explore Services"
            size="lg"
            variant="secondary"
            showArrow={false}
            onClick={onExploreServices}
          />
        </motion.div>

        <div className="mt-12 text-xs font-mono text-zinc-500">
          Direct communication with Saad M · Independent freelance delivery
        </div>
      </div>
    </section>
  );
};
