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
      // Normal top position: completely merged edge-to-edge with the page top
      return 'w-full max-w-7xl mx-auto px-0 py-0 rounded-none border-0 bg-transparent shadow-none';
    }
    // Scrolled position: floating luxury pill shape
    return isDark
      ? 'w-full max-w-4xl sm:max-w-5xl px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-[#00F0FF]/30 bg-[#070714]/90 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,240,255,0.2)] text-white'
      : 'w-full max-w-4xl sm:max-w-5xl px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-zinc-200/90 bg-white/90 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-zinc-950';
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
      {/* Sticky Floating Outer Container */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out flex justify-center ${
          scrolled
            ? 'py-3 px-3 sm:px-6 pointer-events-none'
            : 'py-4 sm:py-5 px-4 sm:px-8 border-b border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-[#07070F]/80 backdrop-blur-md'
        }`}
      >
        {/* The Unified Morphing Header Container */}
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
                    ? 'px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02]'
                    : 'px-3 py-1.5 rounded-full border border-zinc-200 bg-white/80 shadow-2xs'
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
                    className={`relative px-3.5 py-1.5 text-xs font-mono transition-colors duration-200 rounded-full whitespace-nowrap cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'text-[#00F0FF] font-bold'
                          : 'text-cyan-800 font-bold'
                        : isDark
                        ? 'text-zinc-400 hover:text-white'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill-active"
                        className={`absolute inset-0 rounded-full border ${
                          isDark
                            ? 'bg-[#00F0FF]/15 border-[#00F0FF]/50 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                            : 'bg-cyan-100/90 border-cyan-400'
                        }`}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}

              {/* High-Tech Pages Dropdown Trigger */}
              <div className="relative" ref={pagesDropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 rounded-full transition-all cursor-pointer ${
                    dropdownOpen
                      ? isDark
                        ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                        : 'bg-cyan-100 text-cyan-800 border border-cyan-400'
                      : isDark
                      ? 'text-zinc-300 hover:text-white hover:bg-white/5'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                  aria-expanded={dropdownOpen}
                >
                  <span className="font-semibold uppercase tracking-wider">Pages</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180 text-[#00F0FF]' : 'text-zinc-500'
                    }`}
                  />
                </button>

                {/* Cyber Pages Dropdown Box */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute top-full right-0 mt-3 w-80 z-50 transition-all duration-200 rounded-3xl p-5 border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-2xl ${
                        isDark ? 'bg-[#0A0A16]/95 text-white' : 'bg-white/95 text-zinc-950'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/[0.08] mb-3 text-[10px] font-mono">
                        <span className="text-[#00F0FF] font-bold uppercase tracking-widest">
                          [ DIRECTORY MATRIX ]
                        </span>
                        <span className="text-zinc-500">Saad M</span>
                      </div>

                      {/* Dark Mode Toggle in Pages Dropdown */}
                      <div className="mb-3 p-2.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium">Dark Mode</span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            [{isDark ? 'DARK' : 'LIGHT'}]
                          </span>
                        </div>
                        <ThemeToggle showLabel={false} />
                      </div>

                      <div className="space-y-1">
                        <a
                          href="/portfolio"
                          onClick={(e) => handleLinkClick(e, '/portfolio')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#00F0FF]/10 text-zinc-200' : 'hover:bg-cyan-50 text-zinc-800'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>Portfolio & CV</span>
                              <span className="text-[10px] text-[#00F0FF]">RESUME</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block">
                              Projects & CV PDF Download
                            </span>
                          </div>
                        </a>

                        <a
                          href="/estimator"
                          onClick={(e) => handleLinkClick(e, '/estimator')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#00F0FF]/10 text-zinc-200' : 'hover:bg-cyan-50 text-zinc-800'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center shrink-0">
                            <Calculator className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>Project Estimator</span>
                              <span className="text-[10px] text-[#00F0FF]">CALC</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block">
                              Real-world hours & scope
                            </span>
                          </div>
                        </a>

                        <a
                          href="/standards"
                          onClick={(e) => handleLinkClick(e, '/standards')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#00F0FF]/10 text-zinc-200' : 'hover:bg-cyan-50 text-zinc-800'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                            <Terminal className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>Tech Standards</span>
                              <span className="text-[10px] text-indigo-400">ARCH</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block">
                              Speed & Core Web Vitals
                            </span>
                          </div>
                        </a>

                        <a
                          href="/process"
                          onClick={(e) => handleLinkClick(e, '/process')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#00F0FF]/10 text-zinc-200' : 'hover:bg-cyan-50 text-zinc-800'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>Workflow & Process</span>
                              <span className="text-[10px] text-emerald-400">STAGES</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block">
                              Milestone blueprint
                            </span>
                          </div>
                        </a>

                        <a
                          href="/about"
                          onClick={(e) => handleLinkClick(e, '/about')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#00F0FF]/10 text-zinc-200' : 'hover:bg-cyan-50 text-zinc-800'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">About Saad M</div>
                            <span className="text-[10px] text-zinc-500 block">
                              Independent developer
                            </span>
                          </div>
                        </a>

                        <a
                          href="/faq"
                          onClick={(e) => handleLinkClick(e, '/faq')}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                            isDark ? 'hover:bg-[#00F0FF]/10 text-zinc-200' : 'hover:bg-cyan-50 text-zinc-800'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                            <HelpCircle className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">FAQ Directory (25+)</div>
                            <span className="text-[10px] text-zinc-500 block">
                              Full answers database
                            </span>
                          </div>
                        </a>

                        {/* Admin & Backend Page Link */}
                        <div className="pt-2 mt-2 border-t border-black/[0.08] dark:border-white/[0.08]">
                          <a
                            href="/admin"
                            onClick={(e) => handleLinkClick(e, '/admin')}
                            className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-mono transition-all group ${
                              currentPath === '/admin' || currentPath === '/backend'
                                ? isDark
                                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                                  : 'bg-cyan-100 text-cyan-800 border border-cyan-400 font-bold'
                                : isDark
                                ? 'hover:bg-[#00F0FF]/15 bg-[#00F0FF]/5 text-cyan-300 border border-[#00F0FF]/20'
                                : 'hover:bg-cyan-100/70 bg-cyan-50/80 text-cyan-900 border border-cyan-300/60'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold flex items-center justify-between">
                                <span className="truncate">Admin & Backend</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00F0FF]/25 text-[#00F0FF] font-bold shrink-0">
                                  OWNER
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-500 block truncate">
                                CMS, Server Ops & Telemetry
                              </span>
                            </div>
                          </a>
                        </div>
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
              {/* Pure Icon Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`relative p-2.5 sm:p-3 rounded-full font-mono text-xs transition-all duration-300 cursor-pointer overflow-hidden border ${
                  mobileMenuOpen
                    ? 'border-[#00F0FF] bg-[#00F0FF] text-black shadow-[0_0_25px_rgba(0,240,255,0.7)]'
                    : 'border-[#00F0FF]/50 bg-[#00F0FF] hover:bg-[#38bdf8] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.8)]'
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

            {/* Normal Right-Side Menu Dropdown Box (No Full-Page Takeover) */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute top-full right-0 mt-3 w-80 sm:w-92 max-h-[82vh] overflow-y-auto z-50 scrollbar-thin transition-all duration-200 rounded-3xl p-5 border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-2xl ${
                    isDark ? 'bg-[#0A0A16]/95 text-white' : 'bg-white/95 text-zinc-950'
                  }`}
                >
                  {/* Top Header Row in Dropdown */}
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/[0.08] mb-3 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                      <span className="text-[#00F0FF] font-bold uppercase tracking-wider">
                        NAVIGATION MENU
                      </span>
                    </div>
                    <span className="text-zinc-500 text-[10px] font-mono">Saad M</span>
                  </div>

                  {/* Dark Mode Toggle Icon Row */}
                  <div className="mb-3 p-2.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-cyan-500/15 text-[#00F0FF] flex items-center justify-center">
                        {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-mono font-medium">Dark Mode</div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          {isDark ? 'Cyber Dark Mode' : 'Bright Light Mode'}
                        </div>
                      </div>
                    </div>
                    <ThemeToggle showLabel={false} />
                  </div>

                  {/* Main Navigation Pages Grid */}
                  <div className="space-y-1 mb-4">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-1 py-1">
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
                                  ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                                  : 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold'
                                : isDark
                                ? 'border-white/5 bg-white/[0.02] text-zinc-300 hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/5 hover:text-white'
                                : 'border-zinc-200/80 bg-zinc-50/80 text-zinc-700 hover:border-cyan-400 hover:bg-cyan-50/50 hover:text-zinc-950'
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            <ArrowUpRight
                              className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                isActive ? 'text-[#00F0FF]' : 'text-zinc-500'
                              }`}
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2 border-t border-black/[0.08] dark:border-white/[0.08] space-y-2">
                    <a
                      href="/admin"
                      onClick={(e) => handleLinkClick(e, '/admin')}
                      className={`w-full p-2.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                        currentPath === '/admin' || currentPath === '/backend'
                          ? isDark
                            ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                            : 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold'
                          : isDark
                          ? 'border-[#00F0FF]/30 bg-[#00F0FF]/5 hover:bg-[#00F0FF]/15 text-cyan-300'
                          : 'border-cyan-400/50 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="text-left font-mono">
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <span>Admin & Backend Console</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00F0FF]/25 text-[#00F0FF] font-bold">
                              OWNER
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 block">
                            CMS Editor, Server Ops & DB
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#00F0FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    <button
                      type="button"
                      onClick={(e) => handleLinkClick(e, '/contact')}
                      className="w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#00F0FF] hover:bg-[#38bdf8] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
