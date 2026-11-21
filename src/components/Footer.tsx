import React from 'react';
import { ArrowUpRight, Mail, MessageSquare, Linkedin, Instagram, ShieldCheck } from 'lucide-react';
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
      id: 'instagram',
      name: 'Instagram',
      href: SITE_CONFIG.instagramUrl,
      icon: Instagram,
      label: 'Connect on Instagram (@saads.125)',
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
        {/* Left Side: Social Action Pills */}
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
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05050A] shadow-[0_8px_22px_rgba(0,240,255,0.32)]'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_8px_22px_rgba(8,145,178,0.26)]'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </a>
            );
          })}
        </div>

        {/* Main Card */}
        <div
          className={`flex-1 w-full border relative overflow-hidden transition-all duration-300 rounded-3xl p-7 sm:p-10 lg:p-12 ${
            isDark
              ? 'bg-[#0A0A16] border-[#00F0FF]/20 shadow-[0_24px_64px_rgba(0,0,0,0.72)]'
              : 'bg-white border-slate-200 shadow-[0_18px_48px_rgba(15,23,42,0.07)]'
          }`}
        >
          {/* Subtle Cyber-Cyan / Space-Violet Glow */}
          <div
            className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
              isDark ? 'bg-[#00F0FF]/10' : 'bg-cyan-500/8'
            }`}
          />
          <div
            className={`absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
              isDark ? 'bg-[#7000FF]/12' : 'bg-indigo-200/28'
            }`}
          />

          {/* Top Section: Hero CTA Banner */}
          <div
            className={`pb-10 sm:pb-12 border-b relative z-10 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2
                  className={`text-3xl sm:text-5xl font-black font-display tracking-tight leading-[1.1] ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Do you like <br />
                  <span className={isDark ? 'text-[#00F0FF]' : 'text-cyan-700'}>what you see?</span>
                </h2>
              </div>

              {/* Start a project Pill Button */}
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className={`group relative inline-flex items-center gap-3.5 px-8 py-4 sm:py-4.5 rounded-full font-display font-black text-base sm:text-lg tracking-tight hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05050A] shadow-[0_12px_30px_rgba(0,240,255,0.34)]'
                      : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_12px_30px_rgba(8,145,178,0.28)]'
                  }`}
                >
                  <span>Start a project</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isDark ? 'bg-black/15' : 'bg-white/20'}`}>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Middle Section: Clean Multi-Column Site Navigation */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 py-10 sm:py-12 border-b relative z-10 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            {/* Brand Column with CLICK N CREATE logo */}
            <div className="lg:col-span-2 space-y-4">
              <a
                href="/"
                onClick={(e) => handleNav(e, '/')}
                className="inline-block cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00F0FF] rounded-lg"
              >
                <ClickNCreateLogo
                  size="lg"
                  brandColorClass={
                    isDark
                      ? 'text-slate-300 group-hover:text-white'
                      : 'text-slate-700 group-hover:text-slate-950'
                  }
                />
              </a>

              <p className={`text-sm max-w-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Freelance Web Development operated by Saad M. Offering high-impact websites, e-commerce storefronts, and custom web applications. Standard rate:{' '}
                <strong className={isDark ? 'text-[#00F0FF]' : 'text-cyan-700'}>£35/hr</strong> or fixed project scope.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="space-y-3">
              <span
                className={`text-xs font-mono uppercase tracking-widest font-bold block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Navigation
              </span>
              <ul className="space-y-2.5 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNav(e, item.href)}
                      className={`transition-colors flex items-center gap-1.5 group cursor-pointer font-medium ${
                        isDark ? 'text-slate-200 hover:text-[#00F0FF]' : 'text-slate-700 hover:text-cyan-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight
                        className={`w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                          isDark ? 'text-[#00F0FF]' : 'text-cyan-700'
                        }`}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Column */}
            <div className="lg:col-span-2 space-y-3">
              <span
                className={`text-xs font-mono uppercase tracking-widest font-bold block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Core Services
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {SERVICES.map((s) => (
                  <a
                    key={s.id}
                    href={`/services/${s.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/services/${s.slug}`);
                    }}
                    className={`transition-colors flex items-center gap-1.5 group cursor-pointer font-medium ${
                      isDark ? 'text-slate-200 hover:text-[#00F0FF]' : 'text-slate-700 hover:text-cyan-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isDark ? 'bg-[#00F0FF]' : 'bg-cyan-600'
                      }`}
                    />
                    <span className="truncate">{s.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Navigation Links */}
          <div
            className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono relative z-10 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <div>
              © {new Date().getFullYear()}{' '}
              <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Click N Create
              </span>{' '}
              · Operated by Saad M. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              <a
                href="/privacy-policy"
                onClick={(e) => handleNav(e, '/privacy-policy')}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:text-[#00F0FF] text-slate-300' : 'hover:text-cyan-700 text-slate-600'
                }`}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                onClick={(e) => handleNav(e, '/terms')}
                className={`transition-colors cursor-pointer ${
                  isDark ? 'hover:text-[#00F0FF] text-slate-300' : 'hover:text-cyan-700 text-slate-600'
                }`}
              >
                Terms &amp; Conditions
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
