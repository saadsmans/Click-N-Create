import React from 'react';
import { ArrowUpRight, Mail, MessageSquare, Linkedin } from 'lucide-react';
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

        {/* Main Architectural Black Card */}
        <div
          className={`flex-1 w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border shadow-2xl relative overflow-hidden transition-all ${
            isDark
              ? 'bg-[#06060E] border-[#00F0FF]/20 text-zinc-300 shadow-[0_25px_70px_rgba(0,0,0,0.8)]'
              : 'bg-[#0C0D14] border-zinc-800 text-zinc-300 shadow-2xl'
          }`}
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#7000FF]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Section: Hero CTA Banner */}
          <div className="pb-10 sm:pb-12 border-b border-white/10 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-[1.1]">
                  Do you like <br />
                  <span className="text-[#00F0FF]">what you see?</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 py-10 sm:py-12 border-b border-white/10 relative z-10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <a
                href="/"
                onClick={(e) => handleNav(e, '/')}
                className="inline-block cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00F0FF] rounded-lg"
              >
                <ClickNCreateLogo size="lg" />
              </a>

              <p className="text-sm max-w-sm leading-relaxed text-zinc-400">
                Freelance Web Development operated by Saad M. Offering high-impact websites, e-commerce storefronts, and custom web applications. Standard rate: <strong className="text-[#00F0FF]">£35/hr</strong> or fixed project scope.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                Navigation
              </span>
              <ul className="space-y-2.5 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNav(e, item.href)}
                      className="hover:text-[#00F0FF] transition-colors flex items-center gap-1.5 group cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#00F0FF]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Column */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                Services
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {SERVICES.map((service) => (
                  <a
                    key={service.id}
                    href={`/services/${service.slug}`}
                    onClick={(e) => handleNav(e, `/services/${service.slug}`)}
                    className="hover:text-[#00F0FF] transition-colors flex items-center gap-1.5 group cursor-pointer truncate"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-[#00F0FF] transition-colors shrink-0" />
                    <span className="truncate">{service.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500 relative z-10">
            <div>
              {SITE_CONFIG.copyright}
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="/privacy-policy"
                onClick={(e) => handleNav(e, '/privacy-policy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <span>·</span>
              <a
                href="/terms"
                onClick={(e) => handleNav(e, '/terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

