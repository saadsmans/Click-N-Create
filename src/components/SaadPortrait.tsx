import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, ShieldCheck, Upload, Check, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { SAAD_PORTFOLIO } from '../data/portfolio.ts';

interface SaadPortraitProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showUploadBadge?: boolean;
}

export const SaadPortrait: React.FC<SaadPortraitProps> = ({
  className = '',
  size = 'md',
  showUploadBadge = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default image source from uploaded photo
  const defaultPhotoSrc = 'file_000000002c8882099a216468f5829320.png';

  const [currentImageSrc, setCurrentImageSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saad_custom_avatar');
      if (stored) return stored;
    }
    return defaultPhotoSrc;
  });

  const [hasError, setHasError] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCurrentImageSrc(result);
          setHasError(false);
          setIsUploaded(true);
          localStorage.setItem('saad_custom_avatar', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-48 sm:w-56 aspect-[3/4]',
    lg: 'w-64 sm:w-72 aspect-[3/4]',
    hero: 'w-full max-w-[320px] aspect-[3/4]',
  };

  return (
    <div className={`relative group inline-block ${className}`}>
      {/* Hidden File Input for instant photo change */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Cyber Neon Ambient Rim Glow */}
      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#00F0FF] via-[#7000FF] to-[#FF0055] opacity-60 blur-xl group-hover:opacity-90 group-hover:blur-2xl transition duration-500 animate-pulse pointer-events-none" />

      {/* Outer Card Shell */}
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl sm:rounded-3xl overflow-hidden border-2 shadow-2xl transition-all duration-300 group-hover:scale-[1.01] ${
          isDark
            ? 'border-[#00F0FF]/50 bg-[#06060F] shadow-[0_20px_60px_rgba(0,0,0,0.9)]'
            : 'border-cyan-500 bg-zinc-950 shadow-2xl'
        }`}
      >
        {/* Main Photo Display with Automatic Fallback Handling */}
        {!hasError ? (
          <img
            src={currentImageSrc}
            alt="Saad M — Electronics & Communication Engineer & Web Developer"
            className="w-full h-full object-cover object-top"
            onError={() => {
              // Try relative or fallback path
              if (currentImageSrc === defaultPhotoSrc) {
                setCurrentImageSrc('/file_000000002c8882099a216468f5829320.png');
              } else {
                setHasError(true);
              }
            }}
          />
        ) : (
          /* High-Fidelity Stylized Digital Portrait Artwork (Exact match of Saad M with clear glasses & cyber rim light) */
          <div className="w-full h-full bg-gradient-to-b from-[#140c2e] via-[#090818] to-black flex flex-col items-center justify-between p-5 relative overflow-hidden select-none">
            {/* Ambient Cyan / Purple Rim Glows */}
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#00F0FF]/25 blur-3xl pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#7000FF]/35 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

            {/* Top Telemetry Header */}
            <div className="w-full flex items-center justify-between text-[9px] font-mono text-[#00F0FF] relative z-10">
              <span className="flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                <span>SAAD M</span>
              </span>
              <span className="text-zinc-400">EC ENG // WEB DEV</span>
            </div>

            {/* Central Stylized Portrait Vector */}
            <div className="relative my-auto flex flex-col items-center justify-center scale-110">
              {/* Head & Hair Structure */}
              <div className="relative w-28 h-32 flex flex-col items-center">
                {/* Voluminous Stylized Wavy Dark Hair */}
                <div className="absolute -top-3 w-26 h-18 bg-gradient-to-b from-[#1a1426] via-[#100c1c] to-[#0a0712] rounded-t-[45px] rounded-b-[15px] border-t-2 border-[#7000FF]/60 shadow-lg z-20">
                  {/* Subtle hair texture waves */}
                  <div className="absolute inset-x-2 top-1 h-3 bg-white/5 rounded-full blur-[1px]" />
                </div>

                {/* Face Contour */}
                <div className="w-22 h-26 mt-4 bg-gradient-to-b from-[#dfaa88] to-[#c68966] rounded-[36px] shadow-2xl relative z-10 flex flex-col items-center pt-5 border-l border-r border-[#00F0FF]/30">
                  {/* Eyebrows */}
                  <div className="flex justify-between w-14 mb-1">
                    <div className="w-5 h-1 bg-[#1a1424] rounded-full rotate-[-4deg]" />
                    <div className="w-5 h-1 bg-[#1a1424] rounded-full rotate-[4deg]" />
                  </div>

                  {/* Clear Translucent Round Glasses (Signature Look) */}
                  <div className="relative z-30 flex items-center justify-center gap-1 -mt-0.5">
                    {/* Left Frame */}
                    <div className="w-7 h-7 rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-[1px] shadow-[0_0_8px_rgba(255,255,255,0.4)] flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#181124] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/90 -mt-1 -ml-1" />
                      </div>
                    </div>

                    {/* Bridge */}
                    <div className="w-2 h-0.5 bg-white/80 rounded-full" />

                    {/* Right Frame */}
                    <div className="w-7 h-7 rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-[1px] shadow-[0_0_8px_rgba(255,255,255,0.4)] flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#181124] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/90 -mt-1 -ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Nose */}
                  <div className="w-2 h-3.5 border-r-2 border-b border-[#a86e4e] rounded-br-md my-0.5" />

                  {/* Mustache & Smile */}
                  <div className="flex flex-col items-center mt-0.5">
                    <div className="w-7 h-1 bg-[#231a30] rounded-full opacity-80" />
                    <div className="w-6 h-2 bg-[#d4657a] rounded-b-full border-t border-[#8f3647] mt-0.5" />
                    {/* Chin Stubble */}
                    <div className="w-4 h-1.5 bg-[#231a30] rounded-full opacity-60 mt-1" />
                  </div>
                </div>

                {/* Ears with Cyber Rim Lighting */}
                <div className="absolute top-10 left-1 w-3.5 h-6 rounded-l-full bg-[#c68966] border-l border-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                <div className="absolute top-10 right-1 w-3.5 h-6 rounded-r-full bg-[#c68966] border-r border-[#7000FF] shadow-[0_0_8px_#7000FF]" />

                {/* Black Shirt Collar with Neon Rim */}
                <div className="w-32 h-10 -mt-2 bg-[#0c0d16] rounded-t-2xl border-t border-white/15 relative z-20 flex justify-center pt-1 shadow-2xl">
                  {/* Collar flaps */}
                  <div className="w-6 h-5 border-l border-b border-white/20 rotate-[25deg] bg-[#121320] -mr-1" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 my-auto" />
                  <div className="w-6 h-5 border-r border-b border-white/20 rotate-[-25deg] bg-[#121320] -ml-1" />
                </div>
              </div>
            </div>

            {/* Bottom Caption & Upload Prompt */}
            <div className="w-full text-center relative z-20">
              <div className="text-white font-display font-bold text-sm tracking-tight">
                Saad M
              </div>
              <div className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider">
                Lead Engineer · Click N Create
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner Strip with Status Badge */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end justify-between z-20">
          <div>
            <div className="text-white font-bold font-display text-sm leading-tight drop-shadow-md">
              Saad M
            </div>
            <div className="text-[#00F0FF] text-[11px] font-mono flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Hire</span>
            </div>
          </div>

          {showUploadBadge && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Click to update / upload photo directly"
              className="p-2 rounded-xl bg-black/60 hover:bg-[#00F0FF] hover:text-black text-white border border-white/20 hover:border-[#00F0FF] backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg group/btn"
              aria-label="Upload custom photo"
            >
              <Camera className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
