import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Shield, Check, X, Sliders, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  acceptedAt: string;
}

export const CookieConsent: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [functionalEnabled, setFunctionalEnabled] = useState(true);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('cnc_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth page entrance without layout shift
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
      acceptedAt: new Date().toISOString(),
    };
    localStorage.setItem('cnc_cookie_consent', JSON.stringify(prefs));
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptEssential = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      functional: false,
      acceptedAt: new Date().toISOString(),
    };
    localStorage.setItem('cnc_cookie_consent', JSON.stringify(prefs));
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: analyticsEnabled,
      functional: functionalEnabled,
      acceptedAt: new Date().toISOString(),
    };
    localStorage.setItem('cnc_cookie_consent', JSON.stringify(prefs));
    setIsVisible(false);
    setShowPreferences(false);
  };

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      <AnimatePresence>
        {isVisible && !showPreferences && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
          >
            <div
              className={`p-5 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all ${
                isDark
                  ? 'bg-[#080816]/95 border-[#00F0FF]/30 text-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
                  : 'bg-white/95 border-cyan-500/30 text-zinc-800 shadow-2xl'
              }`}
            >
              {/* Header Icon + Label */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shrink-0">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
                    <span>Privacy & Cookie Choices</span>
                  </div>
                  <h3 className={`text-sm font-display font-bold leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                    We value your digital privacy
                  </h3>
                </div>
              </div>

              {/* Description Body */}
              <p className="text-xs leading-relaxed text-zinc-400 mb-4 font-sans">
                We use essential cookies for theme settings, performance diagnostics, and instant quote calculation. No intrusive tracking or data selling.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_20px_rgba(0,240,255,0.7)] transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Accept All</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAcceptEssential}
                    className={`py-2.5 px-3.5 rounded-xl font-mono text-xs transition-colors cursor-pointer border ${
                      isDark
                        ? 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
                        : 'border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span>Essential Only</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-500">
                  <button
                    type="button"
                    onClick={() => setShowPreferences(true)}
                    className="hover:text-[#00F0FF] transition-colors flex items-center gap-1 cursor-pointer underline underline-offset-2"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Customise Preferences</span>
                  </button>

                  <a
                    href="/privacy-policy"
                    className="hover:text-zinc-300 transition-colors"
                  >
                    Policy Details →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Cookie Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto scrollbar-thin ${
                isDark
                  ? 'bg-[#080816]/98 border-[#00F0FF]/30 text-zinc-200'
                  : 'bg-white/98 border-zinc-300 text-zinc-800'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.08] dark:border-white/[0.08] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-base font-display font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                      Cookie & Storage Preferences
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-500">
                      Manage what data is stored during your session
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preferences Options List */}
              <div className="space-y-4 mb-6 text-xs">
                {/* 1. Strictly Necessary */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm font-display text-white">1. Strictly Necessary</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                      ALWAYS ACTIVE
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Essential for page routing, security headers, high-contrast theme selection, and ensuring smooth 60fps animations.
                  </p>
                </div>

                {/* 2. Functional & Calculator Memory */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm font-display text-white">2. Functional Features</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={functionalEnabled}
                        onChange={(e) => setFunctionalEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00F0FF]"></div>
                    </label>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Saves your calculator selections, customized tech stack preferences, and form state so you don't lose work when navigating pages.
                  </p>
                </div>

                {/* 3. Performance Diagnostics */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm font-display text-white">3. Speed & Performance Metrics</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analyticsEnabled}
                        onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00F0FF]"></div>
                    </label>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Anonymous latency and Core Web Vitals diagnostics to ensure mobile loading times remain sub-second across all devices.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.08] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={handleAcceptEssential}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Reject Optional
                </button>

                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-6 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                >
                  Save My Choices
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
