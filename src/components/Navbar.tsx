import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  Layers,
  Calculator,
  ShieldCheck,
  Terminal,
  Sparkles,
  HelpCircle,
  Server,
  Sun,
  Moon,
} from 'lucide-react';
import { ClickNCreateLogo } from './ClickNCreateLogo.tsx';
import { NAV_ITEMS } from '../data/site.ts';
import { ThemeToggle } from './ThemeToggle.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { getHeaderClass } from '../data/themes/themeArchitectureStyles.ts';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenThemeStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenThemeStudio }) => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pagesDropdownRef = useRef<HTMLDivElement>(null);
  const rightMenuRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { customization } = useCustomization();
  const currentTheme = customization?.theme || {};
  const headerStyle = currentTheme.headerStyle || 'floating_glass';
  const dropdownStyle = currentTheme.dropdownStyle || 'glass_blur';

  const getHeaderContainerClass = () => {
    if (!scrolled) {
      return 'w-full max-w-7xl mx-auto px-0 py-0 rounded-none border-0 bg-transparent shadow-none';
    }
    return isDark
      ? 'w-full max-w-4xl sm:max-w-5xl px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-[#38BDF8]/30 bg-[#080D1B]/92 shadow-[0_14px_38px_rgba(2,8,23,0.68)] text-[#F1F5F9]'
      : 'w-full max-w-4xl sm:max-w-5xl px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-slate-300/90 bg-white/94 shadow-[0_10px_30px_rgba(15,23,42,0.09)] text-[#0F172A]';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (pagesDropdownRef.current && !pagesDropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (rightMenuRef.current && !rightMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    onNavigate(href);
  };

  return (
    <>
      {/* Minimal Floating Outer Container */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out flex justify-center ${
          scrolled
            ? 'py-3 px-3 sm:px-6 pointer-events-none'
            : 'py-3.5 sm:py-4 px-4 sm:px-8 border-b border-slate-900/[0.07] dark:border-[#38BDF8]/[0.12] bg-[#F3F6FA]/90 dark:bg-[#060913]/88'
        }`}
      >
        {/* Unified Morphing Header Container */}
        <div
          className={`transition-all duration-300 ease-out flex items-center justify-between relative pointer-events-auto ${getHeaderContainerClass()}`}
        >
          {/* Zone 1: Brand Title Wordmark */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-2 focus:outline-none rounded-lg group select-none shrink-0"
            aria-label="Click N Create Home"
          >
            <ClickNCreateLogo size={scrolled ? 'sm' : 'md'} />
          </a>

          {/* Zone 2: Navigation Links & Pages Dropdown (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <div
              className={`flex items-center gap-1 transition-all duration-300 ${
                !scrolled
                  ? isDark
                    ? 'px-2.5 py-1 rounded-full border border-[#38BDF8]/18 bg-[#0C1222]/85'
                    : 'px-2.5 py-1 rounded-full border border-slate-300/85 bg-white/92 shadow-2xs'
                  : ''
              }`}
            >
              {NAV_ITEMS.slice(0, 5).map((item) => {
                const isActive =
                  currentPath === item.href ||
                  (item.href === '/services' && currentPath.startsWith('/services'));

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`relative px-3.5 py-1.5 text-xs font-mono transition-colors duration-200 rounded-full whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'text-[#7DD3FC] font-bold'
                          : 'text-[#1D4ED8] font-bold'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-100'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill-active"
                        className={`absolute inset-0 rounded-full border ${
                          isDark
                            ? 'bg-[#38BDF8]/15 border-[#38BDF8]/45'
                            : 'bg-[#2563EB]/10 border-[#2563EB]/40'
                        }`}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}

              {/* Directory Pages Dropdown Trigger */}
              <div className="relative" ref={pagesDropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    dropdownOpen
                      ? isDark
                        ? 'bg-[#38BDF8]/18 text-[#7DD3FC] border border-[#38BDF8]/45'
                        : 'bg-[#2563EB]/12 text-[#1D4ED8] border border-[#2563EB]/40'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                  aria-expanded={dropdownOpen}
                >
                  <span className="font-semibold uppercase tracking-wider">Explore</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180 text-[#38BDF8]' : 'text-slate-500'
                    }`}
                  />
                </button>

                {/* Architectural Pages Dropdown Box */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute top-full right-0 mt-3 w-80 z-50 transition-all duration-200 rounded-2xl p-5 border shadow-2xl ${
                        isDark
                          ? 'bg-[#0B1120]/96 border-[#38BDF8]/25 text-[#F1F5F9]'
                          : 'bg-white/98 border-slate-200 text-[#0F172A]'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-900/[0.08] dark:border-white/[0.08] mb-3 text-[10px] font-mono">
                        <span className={isDark ? 'text-[#38BDF8] font-bold uppercase tracking-widest' : 'text-[#1D4ED8] font-bold uppercase tracking-widest'}>
                          Studio Directory
                        </span>
                        <span className="text-slate-400">Saad M</span>
                      </div>

                      {/* Theme Mode Toggle Row */}
                      <div className="mb-3 p-2.5 rounded-xl border border-slate-900/[0.08] dark:border-white/[0.08] bg-slate-900/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium">Appearance</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {isDark ? 'Midnight Glass' : 'Glacier Day'}
                          </span>
                        </div>
                        <ThemeToggle showLabel={false} />
                      </div>

                      <div className="space-y-1">
                        <a
                          href="/portfolio"
                          onClick={(e) => handleLinkClick(e, '/portfolio')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#38BDF8]/12 text-slate-100' : 'hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-[#38BDF8]/15 text-[#38BDF8]' : 'bg-[#2563EB]/12 text-[#1D4ED8]'}`}>
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>Portfolio &amp; CV</span>
                              <span className={`text-[10px] ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>RESUME</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Projects &amp; CV PDF Download
                            </span>
                          </div>
                        </a>

                        <a
                          href="/estimator"
                          onClick={(e) => handleLinkClick(e, '/estimator')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#38BDF8]/12 text-slate-100' : 'hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-[#38BDF8]/15 text-[#38BDF8]' : 'bg-[#2563EB]/12 text-[#1D4ED8]'}`}>
                            <Calculator className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>Project Estimator</span>
                              <span className={`text-[10px] ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>CALC</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Real-world hours &amp; scope
                            </span>
                          </div>
                        </a>

                        <a
                          href="/standards"
                          onClick={(e) => handleLinkClick(e, '/standards')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#38BDF8]/12 text-slate-100' : 'hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                            <Terminal className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>Tech Standards</span>
                              <span className="text-[10px] text-sky-500">ARCH</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Speed &amp; Core Web Vitals
                            </span>
                          </div>
                        </a>

                        <a
                          href="/process"
                          onClick={(e) => handleLinkClick(e, '/process')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#38BDF8]/12 text-slate-100' : 'hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>Workflow &amp; Process</span>
                              <span className="text-[10px] text-emerald-500">STAGES</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Milestone blueprint
                            </span>
                          </div>
                        </a>

                        <a
                          href="/about"
                          onClick={(e) => handleLinkClick(e, '/about')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#38BDF8]/12 text-slate-100' : 'hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">About Saad M</div>
                            <span className="text-[10px] text-slate-400 block">
                              Independent developer
                            </span>
                          </div>
                        </a>

                        <a
                          href="/faq"
                          onClick={(e) => handleLinkClick(e, '/faq')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#38BDF8]/12 text-slate-100' : 'hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-500/15 text-slate-400 flex items-center justify-center shrink-0">
                            <HelpCircle className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">FAQ Directory (25+)</div>
                            <span className="text-[10px] text-slate-400 block">
                              Full answers database
                            </span>
                          </div>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </nav>

          {/* Zone 3: Right-Side Menu Dropdown Trigger & Dropdown Box */}
          <div className="relative" ref={rightMenuRef}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`relative p-2.5 sm:p-3 rounded-full font-mono text-xs transition-all duration-300 cursor-pointer overflow-hidden border ${
                  mobileMenuOpen
                    ? isDark
                      ? 'border-[#7DD3FC] bg-[#7DD3FC] text-[#040B16] shadow-[0_8px_24px_rgba(56,189,248,0.45)]'
                      : 'border-[#1E40AF] bg-[#1E40AF] text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)]'
                    : isDark
                    ? 'border-[#38BDF8]/60 bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#040B16] shadow-[0_6px_18px_rgba(56,189,248,0.32)]'
                    : 'border-[#1D4ED8]/70 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-[0_6px_18px_rgba(29,78,216,0.28)]'
                } flex items-center justify-center`}
                aria-label={mobileMenuOpen ? 'Close menu dropdown' : 'Open menu dropdown'}
                aria-expanded={mobileMenuOpen}
                title={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Right-Side Menu Dropdown Box */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute top-full right-0 mt-3 w-80 sm:w-92 max-h-[82vh] overflow-y-auto z-50 scrollbar-thin transition-all duration-200 rounded-2xl p-5 border shadow-2xl ${
                    isDark
                      ? 'bg-[#0B1120]/96 border-[#38BDF8]/25 text-[#F1F5F9]'
                      : 'bg-white/98 border-slate-200 text-[#0F172A]'
                  }`}
                >
                  {/* Top Header Row in Dropdown */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900/[0.08] dark:border-white/[0.08] mb-3 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold uppercase tracking-wider ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                        Navigation Menu
                      </span>
                    </div>
                    <span className="text-slate-400 text-[10px] font-mono">Saad M</span>
                  </div>

                  {/* Theme Mode Toggle Row */}
                  <div className="mb-3 p-2.5 rounded-xl border border-slate-900/[0.08] dark:border-white/[0.08] bg-slate-900/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#38BDF8]/15 text-[#38BDF8]' : 'bg-[#2563EB]/12 text-[#1D4ED8]'}`}>
                        {isDark ? <Moon className="w-3.5 h-3.5 text-[#7DD3FC]" /> : <Sun className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                      </div>
                      <div>
                        <div className="text-xs font-mono font-medium">Appearance</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {isDark ? 'Midnight Glass' : 'Glacier Daylight'}
                        </div>
                      </div>
                    </div>
                    <ThemeToggle showLabel={false} />
                  </div>

                  {/* Main Navigation Pages Grid */}
                  <div className="space-y-1 mb-4">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-1 py-1">
                      Website Pages
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      {NAV_ITEMS.map((item) => {
                        const isActive =
                          currentPath === item.href ||
                          (item.href === '/services' && currentPath.startsWith('/services'));

                        return (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className={`p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                              isActive
                                ? isDark
                                  ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#7DD3FC] font-bold'
                                  : 'border-[#2563EB] bg-[#2563EB]/10 text-[#1D4ED8] font-bold'
                                : isDark
                                ? 'border-white/6 bg-white/[0.02] text-slate-300 hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 hover:text-white'
                                : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-[#2563EB] hover:bg-blue-50/60 hover:text-slate-950'
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            <ArrowUpRight
                              className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                isActive ? (isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]') : 'text-slate-500'
                              }`}
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2 border-t border-slate-900/[0.08] dark:border-white/[0.08]">
                    <button
                      type="button"
                      onClick={(e) => handleLinkClick(e, '/contact')}
                      className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isDark
                          ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#040B16] shadow-[0_8px_22px_rgba(56,189,248,0.3)]'
                          : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-[0_8px_22px_rgba(29,78,216,0.25)]'
                      }`}
                    >
                      <span>Start a Project / Contact</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
};
