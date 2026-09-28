import React, { useState } from 'react';
import {
  Code2,
  ShoppingCart,
  Palette,
  Server,
  Layers,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Megaphone,
  CreditCard,
  Cloud,
  Wrench,
  Search,
  PenTool,
  Sparkles,
  Eye,
  Check,
  Type,
  FileCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface AdaptiveServiceImageProps {
  slug: string;
  imageSrc: string;
  altText: string;
  accentColor: string;
  className?: string;
}

export const AdaptiveServiceImage: React.FC<AdaptiveServiceImageProps> = ({
  slug,
  imageSrc,
  altText,
  accentColor,
  className = '',
}) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md group transition-all duration-300 ${
        isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white/80 shadow-md'
      } ${className}`}
    >
      {/* Subtle diffused background radiance */}
      <div
        className="absolute -top-12 -right-12 w-52 h-52 rounded-full blur-3xl opacity-30 pointer-events-none transition-opacity duration-500 group-hover:opacity-60"
        style={{ backgroundColor: accentColor || '#00F0FF' }}
      />

      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {!loadFailed && imageSrc && imageSrc.trim() !== '' ? (
        <img
          src={imageSrc}
          alt={altText}
          referrerPolicy="no-referrer"
          onError={() => setLoadFailed(true)}
          className="w-full h-full object-cover relative z-10 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        /* Bespoke CSS/Glass/Vector visual composition matching the user's service asset motifs */
        <div className="w-full h-full min-h-[270px] sm:min-h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 relative z-10 select-none">
          
          {/* 1. Custom Business Websites */}
          {slug === 'web-development' && (
            <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
              <div
                className={`w-full rounded-2xl border p-4 shadow-2xl relative transition-all duration-300 group-hover:-translate-y-1 ${
                  isDark
                    ? 'border-cyan-500/30 bg-gradient-to-b from-white/[0.08] to-black/80 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,240,255,0.15)]'
                    : 'border-cyan-400 bg-white/95 backdrop-blur-xl shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-500 font-bold">App.tsx · Fast Load</span>
                </div>
                <div className="mt-3.5 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Code2 className="w-4 h-4 text-[#00F0FF]" />
                    <span>&lt;SaadM.Build /&gt;</span>
                  </div>
                  <div className="w-3/4 h-2.5 rounded bg-black/10 dark:bg-white/20" />
                  <div className="flex gap-2">
                    <div className="w-1/2 h-2.5 rounded bg-cyan-500/40" />
                    <div className="w-1/3 h-2.5 rounded bg-purple-500/40" />
                  </div>
                  <div className="w-5/6 h-2.5 rounded bg-black/5 dark:bg-white/10" />
                </div>
                <div
                  className={`mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono`}
                >
                  <span className="flex items-center gap-1.5 text-cyan-500 font-semibold">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Vite · React · WP</span>
                  </span>
                  <span className="text-emerald-500 text-[10px] font-bold">99/100 SPEED</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Online Shops & Stores (Ecommerce) */}
          {slug === 'ecommerce-development' && (
            <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
              <div
                className={`w-full rounded-2xl border p-5 shadow-2xl relative transition-all duration-300 group-hover:-translate-y-1 ${
                  isDark
                    ? 'border-rose-500/30 bg-gradient-to-b from-white/[0.08] to-black/80 backdrop-blur-xl shadow-[0_15px_40px_rgba(255,0,85,0.15)]'
                    : 'border-rose-300 bg-white/95 backdrop-blur-xl shadow-xl'
                }`}
              >
                <div className="w-full h-2.5 rounded-t-lg bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 opacity-90 mb-4" />
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-500 shadow-md">
                    <ShoppingCart className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-xs font-mono text-zinc-500 block uppercase tracking-wider">Instant Checkout</span>
                    <span className={`text-2xl font-black font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                      £149.00
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5 text-rose-500 font-mono font-semibold">
                    <CreditCard className="w-4 h-4" />
                    <span>Apple Pay · Stripe</span>
                  </div>
                  <span className="text-emerald-500 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    PAID 100%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Logo & Graphic Design (Branding) */}
          {(slug === 'branding-and-design' || slug === 'branding-design' || slug === 'logo-design') && (
            <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
              <div
                className={`w-full rounded-2xl border p-5 shadow-2xl relative transition-all duration-300 group-hover:-translate-y-1 ${
                  isDark
                    ? 'border-purple-500/35 bg-gradient-to-br from-white/[0.08] to-[#0A0A18]/90 backdrop-blur-xl shadow-[0_15px_40px_rgba(168,85,247,0.18)]'
                    : 'border-purple-300 bg-white/95 backdrop-blur-xl shadow-xl'
                }`}
              >
                {/* Visual Identity Emblem Top Showcase */}
                <div className="flex items-center justify-between mb-4">
                  {/* Glowing 3D Vector Monogram Emblem */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00F0FF] via-purple-600 to-pink-500 p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-[14px] bg-[#0A0A18] flex items-center justify-center text-white relative overflow-hidden">
                        {/* Grid lines inside logo */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                        <span className="font-display font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-purple-300">
                          CNC
                        </span>
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0A18] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </span>
                  </div>

                  {/* CMYK / Hex Color Palette Swatches */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#00F0FF] border-2 border-white/30 shadow-sm" title="#00F0FF" />
                      <span className="w-5 h-5 rounded-full bg-[#8B5CF6] border-2 border-white/30 shadow-sm" title="#8B5CF6" />
                      <span className="w-5 h-5 rounded-full bg-[#EC4899] border-2 border-white/30 shadow-sm" title="#EC4899" />
                      <span className="w-5 h-5 rounded-full bg-[#10B981] border-2 border-white/30 shadow-sm" title="#10B981" />
                    </div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">
                      VECTOR · 300 DPI
                    </span>
                  </div>
                </div>

                {/* Typography & Pen Tool Blueprint Indicator */}
                <div className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                      <PenTool className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Bezier Curves</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">SVG · PDF · PNG</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Type className="w-3 h-3 text-purple-400" />
                      <span>Brand Typography</span>
                    </span>
                    <span className="text-emerald-400 font-bold">PRINT READY</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Get Found on Google & Marketing */}
          {slug === 'digital-marketing' && (
            <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
              <div
                className={`w-full rounded-2xl border p-5 shadow-2xl relative transition-all duration-300 group-hover:-translate-y-1 ${
                  isDark
                    ? 'border-amber-500/30 bg-gradient-to-b from-white/[0.08] to-black/80 backdrop-blur-xl shadow-[0_15px_40px_rgba(245,158,11,0.15)]'
                    : 'border-amber-300 bg-white/95 backdrop-blur-xl shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-md">
                    <Megaphone className="w-7 h-7" />
                  </div>
                  <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1 font-mono text-xs font-bold">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>+240% LEADS</span>
                  </div>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                      <Search className="w-3.5 h-3.5" />
                      Google #1 Rank
                    </span>
                    <span className="text-emerald-500 font-bold">LOCAL SEO</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">Google Maps · Analytics · Reviews</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Hosting, Backups & Care */}
          {slug === 'hosting-maintenance' && (
            <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
              <div
                className={`w-full rounded-2xl border p-5 shadow-2xl relative transition-all duration-300 group-hover:-translate-y-1 ${
                  isDark
                    ? 'border-emerald-500/30 bg-gradient-to-b from-white/[0.08] to-black/80 backdrop-blur-xl shadow-[0_15px_40px_rgba(16,185,129,0.15)]'
                    : 'border-emerald-300 bg-white/95 backdrop-blur-xl shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-md">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-amber-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 font-semibold">24/7 Cloud & SSL</span>
                    <span className="text-emerald-400 font-bold">100% UPTIME</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>Daily Backups</span>
                    <span className="text-cyan-400 font-bold">Active Shield</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. Custom Web Tools & Portals */}
          {slug === 'web-app-development' && (
            <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
              <div
                className={`w-full rounded-2xl border p-5 shadow-2xl relative transition-all duration-300 group-hover:-translate-y-1 ${
                  isDark
                    ? 'border-indigo-500/30 bg-gradient-to-b from-white/[0.08] to-black/80 backdrop-blur-xl shadow-[0_15px_40px_rgba(99,102,241,0.15)]'
                    : 'border-indigo-300 bg-white/95 backdrop-blur-xl shadow-xl'
                }`}
              >
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="col-span-2 h-14 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-2.5 flex flex-col justify-between">
                    <div className="w-1/2 h-2 rounded bg-indigo-500/50" />
                    <div className="w-3/4 h-2 rounded bg-cyan-500/30" />
                  </div>
                  <div className="h-14 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-md">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>Calculators & Portals</span>
                  </span>
                  <span className="text-emerald-400 font-bold">LIVE SYNC</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtle edge fade */}
      <div
        className={`absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t pointer-events-none z-20 ${
          isDark
            ? 'from-[#09090B]/90 via-[#09090B]/40 to-transparent'
            : 'from-white/90 via-white/40 to-transparent'
        }`}
      />
    </div>
  );
};
