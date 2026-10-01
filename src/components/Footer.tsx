import React from 'react';
import { ArrowUpRight, Mail, MessageSquare, Linkedin, Lock, ShieldCheck, Shield } from 'lucide-react';
import { ClickNCreateLogo } from './ClickNCreateLogo.tsx';
import { SITE_CONFIG, NAV_ITEMS } from '../data/site.ts';
import { SERVICES } from '../data/services.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const socialLinks = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      href: SITE_CONFIG.whatsappUrl,
      icon: MessageSquare,
      label: 'Chat on WhatsApp',
    },
    {
      id: 'email',
      name: 'Email',
      href: `mailto:${SITE_CONFIG.email}`,
      icon: Mail,
      label: `Email ${SITE_CONFIG.email}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      href: SITE_CONFIG.linkedinUrl,
      icon: Linkedin,
      label: 'LinkedIn Profile',
    },
  ];

  return (
    <footer className="relative pt-10 pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start relative">
        {/* Left Side: 3 Floating Neon Social Action Pills */}
        <div className="flex lg:flex-col gap-3 z-20 shrink-0 p-1">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#00F0FF] hover:bg-[#38bdf8] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </a>
            );
          })}
        </div>

        {/* Main Architectural Card */}
        <div className={`flex-1 w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border relative overflow-hidden transition-all duration-200 ${
          isDark
            ? 'border-[#00F0FF]/25 bg-[#06060E] text-white shadow-[0_25px_70px_rgba(0,0,0,0.8)]'
            : 'border-cyan-300 bg-white text-zinc-950 shadow-[0_20px_50px_rgba(0,180,216,0.15)]'
        }`}>
          {/* Subtle Ambient Background Glow */}
          <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-[#00F0FF]/15' : 'bg-cyan-400/10'
          }`} />
          <div className={`absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-[#7000FF]/15' : 'bg-purple-400/10'
          }`} />

          {/* Top Section: Hero CTA Banner */}
          <div className={`pb-10 sm:pb-12 border-b relative z-10 ${
            isDark ? 'border-white/10' : 'border-zinc-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className={`text-3xl sm:text-5xl font-black font-display tracking-tight leading-[1.1] ${
                  isDark ? 'text-white' : 'text-zinc-950'
                }`}>
                  Do you like <br />
                  <span className={isDark ? 'text-[#00F0FF]' : 'text-cyan-600'}>what you see?</span>
                </h2>
              </div>

              {/* Start a project Pill Button */}
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="group relative inline-flex items-center gap-3.5 px-8 py-4 sm:py-4.5 rounded-full bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-black text-base sm:text-lg tracking-tight shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_45px_rgba(0,240,255,0.8)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>Start a project</span>
                  <div className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Middle Section: Clean Multi-Column Site Navigation */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 py-10 sm:py-12 border-b relative z-10 ${
            isDark ? 'border-white/10' : 'border-zinc-200'
          }`}>
            {/* Brand Column with CLICK N CREATE logo */}
            <div className="lg:col-span-2 space-y-4">
              <a
                href="/"
                onClick={(e) => handleNav(e, '/')}
                className="inline-block cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00F0FF] rounded-lg"
              >
                <ClickNCreateLogo size="lg" brandColorClass={isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-800 group-hover:text-zinc-950'} />
              </a>

              <p className={`text-sm max-w-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Freelance Web Development operated by Saad M. Offering high-impact websites, e-commerce storefronts, and custom web applications. Standard rate: <strong className={isDark ? 'text-[#00F0FF]' : 'text-cyan-700'}>£35/hr</strong> or fixed project scope.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="space-y-3">
              <span className={`text-xs font-mono uppercase tracking-widest font-bold block ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                Navigation
              </span>
              <ul className="space-y-2.5 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNav(e, item.href)}
                      className={`transition-colors flex items-center gap-1.5 group cursor-pointer font-medium ${
                        isDark ? 'text-zinc-200 hover:text-[#00F0FF]' : 'text-zinc-700 hover:text-cyan-600'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className={`w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                        isDark ? 'text-[#00F0FF]' : 'text-cyan-600'
                      }`} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Column */}
            <div className="lg:col-span-2 space-y-3">
              <span className={`text-xs font-mono uppercase tracking-widest font-bold block ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                Services & Architectures
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {SERVICES.map((s) => (
                  <a
                    key={s.id}
                    href={`/#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(s.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onNavigate(`/services`);
                      }
                    }}
                    className={`transition-colors flex items-center gap-1.5 group cursor-pointer font-medium ${
                      isDark ? 'text-zinc-200 hover:text-[#00F0FF]' : 'text-zinc-700 hover:text-cyan-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-[#00F0FF]' : 'bg-cyan-600'}`} />
                    <span className="truncate">{s.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Navigation Links */}
          <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono relative z-10 ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            <div>
              © {new Date().getFullYear()} <span className={`font-semibold ${isDark ? 'text-zinc-400' : 'text-zinc-800'}`}>Click N Create</span> · Operated by Saad M. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              <a
                href="/privacy-policy"
                onClick={(e) => handleNav(e, '/privacy-policy')}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:text-[#00F0FF] text-zinc-300' : 'hover:text-cyan-600 text-zinc-600'
                }`}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                onClick={(e) => handleNav(e, '/terms')}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:text-[#00F0FF] text-zinc-300' : 'hover:text-cyan-600 text-zinc-600'
                }`}
              >
                Terms & Conditions
              </a>
              <a
                href="/portal"
                onClick={(e) => handleNav(e, '/portal')}
                className={`transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDark ? 'hover:text-[#00F0FF] text-zinc-300' : 'hover:text-cyan-600 text-zinc-600'
                }`}
              >
                <Lock className={`w-3 h-3 ${isDark ? 'text-[#00F0FF]' : 'text-cyan-600'}`} />
                <span>Client Portal</span>
              </a>
              <a
                href="/admin"
                onClick={(e) => handleNav(e, '/admin')}
                className={`hover:underline transition-colors flex items-center gap-1.5 font-bold cursor-pointer ${
                  isDark ? 'text-[#00F0FF]' : 'text-cyan-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
