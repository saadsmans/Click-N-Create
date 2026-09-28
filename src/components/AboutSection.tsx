import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Sparkles, MessageSquareCode, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading.tsx';
import { SaadPortrait } from './SaadPortrait.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface AboutSectionProps {
  onContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onContact }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Stylized Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full flex justify-center"
            >
              <SaadPortrait size="hero" showUploadBadge={true} />
            </motion.div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              category="About"
              title="THE PERSON BEHIND CLICK N CREATE"
              subtitle="An independent, transparent approach to freelance web development."
              className="mb-6"
            />

            <div className={`space-y-4 text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <p>
                Hello, I am <strong className={isDark ? 'text-white font-medium' : 'text-zinc-950 font-semibold'}>Saad M</strong>. Click N Create is my freelance digital development brand, dedicated to building responsive, aesthetically sharp, and high-performance websites and web applications for businesses, creators, and individuals.
              </p>
              <p>
                As an independent developer, I do not operate as an agency with layers of sales reps or account managers. When you hire Click N Create, you collaborate directly with me. Every line of code, visual layout decision, and mobile responsiveness tweak is handled with personal care and accountability.
              </p>
              <p>
                My focus centers on combining modern frontend engineering—utilizing React, TypeScript, and Tailwind CSS—with distinctive glassmorphism and subtle motion design. I am committed to continuous learning, refining my craft, and delivering digital experiences that move people and serve real business needs.
              </p>
            </div>

            {/* Core Values / Work Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
              }`}>
                <MessageSquareCode className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>Direct Communication</h4>
                  <p className="text-xs text-zinc-500 mt-1">Speak directly with the developer building your site from day one.</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-2xs'
              }`}>
                <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>Design + Code Synergy</h4>
                  <p className="text-xs text-zinc-500 mt-1">Visual aesthetic and performant code developed together in harmony.</p>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onContact}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all cursor-pointer ${
                  isDark
                    ? 'text-white bg-white/10 hover:bg-white/15 border border-white/20'
                    : 'text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300'
                }`}
              >
                <span>Start A Conversation With Saad</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
