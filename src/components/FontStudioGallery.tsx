import React, { useState, useEffect } from 'react';
import { Search, Check, Sparkles, Type, Code, AlignLeft, RefreshCw, X } from 'lucide-react';
import { FONT_CATALOG, FontOption, loadGoogleFont, loadGoogleFontsBatch } from '../data/themeCatalog.ts';

interface FontStudioGalleryProps {
  currentDisplayFont: string;
  currentSansFont: string;
  currentMonoFont: string;
  onSelectFont: (fontFamily: string, target: 'display' | 'sans' | 'mono') => void;
  isDark: boolean;
}

export const FontStudioGallery: React.FC<FontStudioGalleryProps> = ({
  currentDisplayFont,
  currentSansFont,
  currentMonoFont,
  onSelectFont,
  isDark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customSampleText, setCustomSampleText] = useState<string>('Click N Create — Bespoke Digital Studio');
  const [activeTarget, setActiveTarget] = useState<'display' | 'sans' | 'mono'>('display');

  // Preload all 115 fonts in batches so every option card renders its true typeface before selection
  useEffect(() => {
    loadGoogleFontsBatch(FONT_CATALOG.map((f) => f.family));
  }, []);

  const categories = [
    { id: 'All', label: 'All 115 Fonts', count: FONT_CATALOG.length },
    { id: 'Display', label: 'Display & Headlines', count: 25 },
    { id: 'Sans-Serif', label: 'Sans-Serif Body & UI', count: 25 },
    { id: 'Serif', label: 'Serif & Luxury', count: 20 },
    { id: 'Monospace', label: 'Monospace & Terminal', count: 18 },
    { id: 'Futuristic', label: 'Futuristic & Sci-Fi', count: 15 },
    { id: 'Script', label: 'Artisan & Script', count: 12 },
  ];

  const filteredFonts = FONT_CATALOG.filter((font) => {
    const matchesCategory = selectedCategory === 'All' || font.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      font.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (font.previewText && font.previewText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const samplePresets = [
    'Click N Create 2026',
    'Bespoke Digital Engineering',
    'Aa Bb Cc 1 2 3 ! ? #',
    'The quick brown fox jumps over the lazy dog',
  ];

  const handleApply = (family: string, target: 'display' | 'sans' | 'mono') => {
    loadGoogleFont(family);
    onSelectFont(family, target);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-cyan-950/30 via-purple-950/20 to-black/60 border-cyan-500/30'
            : 'bg-gradient-to-r from-cyan-50 via-purple-50 to-white border-cyan-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 uppercase tracking-wider">
                115+ GOOGLE FONTS CATALOG
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Visual Live Typeface Specimen Engine
              </span>
            </div>
            <h3 className={`text-base sm:text-lg font-bold font-display mt-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              Choose Your Brand Typography
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Every font below is actively rendered in its genuine Google Font typeface. Type test phrases to inspect the font style in real time before choosing.
            </p>
          </div>

          {/* Target Assignment Selector */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Currently Assigning To:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTarget('display')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTarget === 'display'
                    ? 'bg-[#00F0FF] text-black font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Headline (Display)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTarget('sans')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTarget === 'sans'
                    ? 'bg-[#00F0FF] text-black font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Body (Sans)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTarget('mono')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTarget === 'mono'
                    ? 'bg-[#00F0FF] text-black font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Code (Mono)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current Active Fonts Summary Badges */}
        <div className="mt-3.5 pt-3 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-[10px] text-zinc-400">ACTIVE PAIRING:</span>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            Headline: <strong className="text-white" style={{ fontFamily: `'${currentDisplayFont}', sans-serif` }}>{currentDisplayFont}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">
            Body: <strong className="text-white" style={{ fontFamily: `'${currentSansFont}', sans-serif` }}>{currentSansFont}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            Mono: <strong className="text-white" style={{ fontFamily: `'${currentMonoFont}', monospace` }}>{currentMonoFont}</strong>
          </span>
        </div>
      </div>

      {/* 2. Interactive Specimen & Sample Text Bar */}
      <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-zinc-200 shadow-xs'}`}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">
              TYPE CUSTOM SPECIMEN TEXT (PREVIEWED LIVE ACROSS ALL 115 FONTS):
            </span>
            <div className="relative">
              <input
                type="text"
                value={customSampleText}
                onChange={(e) => setCustomSampleText(e.target.value)}
                placeholder="Type your own headline or brand name to test all fonts..."
                className={`w-full px-3.5 py-2 text-xs font-mono rounded-xl border ${
                  isDark
                    ? 'bg-black/60 border-white/15 text-white placeholder:text-zinc-600 focus:border-cyan-400'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-950 placeholder:text-zinc-400 focus:border-cyan-600'
                }`}
              />
              {customSampleText && (
                <button
                  type="button"
                  onClick={() => setCustomSampleText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  title="Clear text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="sm:w-64 relative">
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">
              SEARCH FONTS:
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search font name..."
                className={`w-full pl-8 pr-3 py-2 text-xs font-mono rounded-xl border ${
                  isDark
                    ? 'bg-black/60 border-white/15 text-white placeholder:text-zinc-600 focus:border-cyan-400'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-950 placeholder:text-zinc-400 focus:border-cyan-600'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Quick Specimen Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
          <span className="text-[10px] text-zinc-500">Quick Test:</span>
          {samplePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setCustomSampleText(preset)}
              className={`px-2 py-0.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                customSampleText === preset
                  ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300 font-bold'
                  : isDark
                  ? 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-white text-black font-bold shadow-xs'
                    : 'bg-zinc-950 text-white font-bold shadow-xs'
                  : isDark
                  ? 'bg-white/5 text-zinc-400 hover:text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className="opacity-60 text-[10px]">({cat.count})</span>
            </button>
          );
        })}
      </div>

      {/* 4. Font Cards Grid (115 Fonts With True Typeface Previews) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[640px] overflow-y-auto pr-1">
        {filteredFonts.map((font) => {
          const isHeadlineActive = currentDisplayFont === font.family;
          const isBodyActive = currentSansFont === font.family;
          const isMonoActive = currentMonoFont === font.family;
          const isTargetActive =
            activeTarget === 'display'
              ? isHeadlineActive
              : activeTarget === 'sans'
              ? isBodyActive
              : isMonoActive;

          return (
            <div
              key={font.family}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                isTargetActive
                  ? isDark
                    ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white shadow-[0_0_25px_rgba(0,240,255,0.25)] ring-1 ring-[#00F0FF]'
                    : 'border-cyan-600 bg-cyan-50/90 text-zinc-950 shadow-md ring-1 ring-cyan-500'
                  : isDark
                  ? 'border-white/10 bg-black/40 text-zinc-200 hover:border-cyan-400/60 hover:bg-white/5 shadow-sm'
                  : 'border-zinc-200 bg-white text-zinc-800 hover:border-cyan-500 hover:shadow-md'
              }`}
            >
              <div>
                {/* Top: Prominent Font Name rendered in its OWN genuine font style! */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-xl sm:text-2xl font-bold tracking-tight leading-tight select-none truncate transition-transform group-hover:scale-[1.01] ${
                        isDark ? 'text-white' : 'text-zinc-950'
                      }`}
                      style={{ fontFamily: `'${font.family}', sans-serif` }}
                      title={`Font: ${font.family}`}
                    >
                      {font.family}
                    </h4>

                    {/* Font Alphabet Signature Preview in its OWN font look */}
                    <div
                      className="text-xs sm:text-sm font-semibold tracking-wide text-cyan-600 dark:text-[#00F0FF] select-none truncate mt-0.5"
                      style={{ fontFamily: `'${font.family}', sans-serif` }}
                    >
                      Aa Bb Gg Rr · 0 1 2 3 4 5
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-[#00F0FF] border border-cyan-500/25 font-bold">
                      {font.category}
                    </span>
                    {isHeadlineActive && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00F0FF] text-black shadow-2xs" title="Active Headline Font">
                        HEAD
                      </span>
                    )}
                    {isBodyActive && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500 text-white shadow-2xs" title="Active Body Font">
                        BODY
                      </span>
                    )}
                    {isMonoActive && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500 text-black shadow-2xs" title="Active Monospace Font">
                        MONO
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtitle / Available Weights */}
                <div className="text-[10px] font-mono text-zinc-400 mb-2">
                  Weights: {font.weights.join(', ')}
                </div>

                {/* Specimen Box Rendered in Genuine Font Typeface */}
                <div
                  className={`p-3 sm:p-3.5 rounded-xl border my-2 min-h-[64px] flex items-center transition-colors ${
                    isDark
                      ? isTargetActive ? 'bg-[#00F0FF]/10 border-[#00F0FF]/30' : 'bg-black/50 border-white/5'
                      : isTargetActive ? 'bg-cyan-100/70 border-cyan-300' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <p
                    className={`text-sm sm:text-base leading-snug line-clamp-2 select-text ${
                      isTargetActive
                        ? isDark ? 'text-[#00F0FF] font-medium' : 'text-cyan-900 font-semibold'
                        : isDark ? 'text-zinc-200' : 'text-zinc-800'
                    }`}
                    style={{
                      fontFamily: `'${font.family}', sans-serif`,
                    }}
                  >
                    {customSampleText || font.previewText || 'The quick brown fox jumps over the lazy dog'}
                  </p>
                </div>
              </div>

              {/* Bottom Actions: Apply to Active Target or Specific Target */}
              <div className="pt-2.5 mt-1 border-t border-black/10 dark:border-white/10 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApply(font.family, activeTarget)}
                  className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    isTargetActive
                      ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : isDark
                      ? 'bg-white/10 hover:bg-[#00F0FF] hover:text-black text-white hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'bg-zinc-100 hover:bg-cyan-600 hover:text-white text-zinc-900'
                  }`}
                >
                  {isTargetActive ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>
                    {isTargetActive
                      ? `Currently Active (${activeTarget.toUpperCase()})`
                      : `Apply as ${activeTarget === 'display' ? 'Headline Font' : activeTarget === 'sans' ? 'Body Font' : 'Code Font'}`}
                  </span>
                </button>

                {/* Quick 1-Click Alternate Assigners */}
                <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                  <span className="text-zinc-500 text-[9px] uppercase">Assign:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleApply(font.family, 'display')}
                      title="Set as Headline & Display Font"
                      className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                        isHeadlineActive
                          ? 'bg-[#00F0FF] text-black font-bold'
                          : 'bg-black/20 dark:bg-white/5 hover:bg-cyan-500/20 text-zinc-400 hover:text-cyan-400'
                      }`}
                    >
                      Headline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApply(font.family, 'sans')}
                      title="Set as Body & UI Font"
                      className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                        isBodyActive
                          ? 'bg-purple-500 text-white font-bold'
                          : 'bg-black/20 dark:bg-white/5 hover:bg-purple-500/20 text-zinc-400 hover:text-purple-400'
                      }`}
                    >
                      Body
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApply(font.family, 'mono')}
                      title="Set as Terminal & Monospace Font"
                      className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                        isMonoActive
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-black/20 dark:bg-white/5 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400'
                      }`}
                    >
                      Mono
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
