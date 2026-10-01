import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Sparkles,
  Type,
  Check,
  Save,
  RefreshCw,
  Sliders,
  Eye,
  Layers,
  Wand2,
  Grid,
  Zap,
  Search,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Maximize2,
  RotateCcw,
  SlidersHorizontal,
  Shield,
  ArrowUpRight,
  Flame,
  Crown,
  Boxes,
} from 'lucide-react';
import { THEME_PRESETS, FONT_CATALOG, ThemePreset, loadGoogleFont } from '../data/themeCatalog.ts';
import { ThemeTokens } from '../types/index.ts';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface AdvancedThemeCustomizerProps {
  currentTheme: ThemeTokens;
  onSaveTheme: (theme: ThemeTokens) => Promise<void>;
}

export const AdvancedThemeCustomizer: React.FC<AdvancedThemeCustomizerProps> = ({
  currentTheme,
  onSaveTheme,
}) => {
  const { applyPreviewTokens, refreshCustomization } = useCustomization();
  const { theme: modeTheme } = useTheme();
  const isDark = modeTheme === 'dark';

  const [draft, setDraft] = useState<ThemeTokens>(currentTheme);
  const [activePresetId, setActivePresetId] = useState<string>(currentTheme.presetId || 'cyber_cyan');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'finetune' | 'fonts' | 'live_preview'>('presets');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const categories = [
    { id: 'All', label: 'All Themes', count: THEME_PRESETS.length },
    { id: 'Cyber & Sci-Fi', label: 'Cyber & Sci-Fi', count: 10, icon: Zap },
    { id: 'Luxury & Editorial', label: 'Luxury & Editorial', count: 10, icon: Crown },
    { id: 'Modern SaaS & Tech', label: 'Modern SaaS & Tech', count: 10, icon: Boxes },
    { id: 'Neo-Brutalist & Retro', label: 'Neo-Brutalist & Retro', count: 10, icon: Flame },
    { id: 'Nature & Organic', label: 'Nature & Organic', count: 10, icon: Sparkles },
  ];

  const filteredPresets = THEME_PRESETS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fontDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activePreset = THEME_PRESETS.find((p) => p.id === activePresetId) || THEME_PRESETS[0];

  const handleSelectPreset = (preset: ThemePreset, autoSave = false) => {
    loadGoogleFont(preset.fontDisplay);
    loadGoogleFont(preset.fontSans);
    loadGoogleFont(preset.fontMono);

    const updated: ThemeTokens = {
      ...draft,
      presetId: preset.id,
      presetName: preset.name,
      accentCyan: preset.accentPrimary,
      accentPurple: preset.accentSecondary,
      accentGradient: preset.accentGradient,
      bgTone: preset.bgTone,
      bgMainDark: preset.bgMainDark,
      bgSecondaryDark: preset.bgSecondaryDark,
      bgMainLight: preset.bgMainLight,
      bgSecondaryLight: preset.bgSecondaryLight,
      textColorDark: preset.textColorDark,
      textColorLight: preset.textColorLight,
      borderRadius: preset.borderRadius,
      borderWidth: preset.borderWidth,
      glowIntensity: preset.glowIntensity,
      buttonStyle: preset.buttonStyle,
      headerStyle: preset.headerStyle,
      backgroundPattern: preset.backgroundPattern,
      fontDisplay: preset.fontDisplay,
      fontSans: preset.fontSans,
      fontMono: preset.fontMono,
    };

    setActivePresetId(preset.id);
    setDraft(updated);
    applyPreviewTokens(updated);

    if (autoSave) {
      handleSave(updated);
    }
  };

  const handleSave = async (themeToSave?: ThemeTokens) => {
    const target = themeToSave || draft;
    setSaving(true);
    try {
      await onSaveTheme(target);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultPreset = THEME_PRESETS[0];
    handleSelectPreset(defaultPreset, false);
  };

  return (
    <div className="space-y-6">
      {/* ================= TOP COMMAND BAR ================= */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isDark ? 'bg-[#080814]/90 border-white/10 shadow-lg' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  WordPress & Shopify Grade Theme Customizer
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                  50 Full Themes
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Switch themes to transform all typography, accents, cards, buttons, backgrounds, and shadows across every page in real-time.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
              }`}
              title="Reset to factory default theme"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? '✓ Theme Published Live!' : 'Publish Theme to Website'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
          {[
            { id: 'presets', label: `50 Curated Themes (${THEME_PRESETS.length})`, icon: Palette },
            { id: 'live_preview', label: 'Live Theme Preview Canvas', icon: Eye },
            { id: 'finetune', label: 'Theme Fine-Tuner & Sliders', icon: SlidersHorizontal },
            { id: 'fonts', label: `Google Fonts Pairing (${FONT_CATALOG.length})`, icon: Type },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                    : isDark
                    ? 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: 50 CURATED THEMES ================= */}
      {activeTab === 'presets' && (
        <div className="space-y-5">
          {/* Categories Bar & Search Filter */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? isDark
                          ? 'bg-white text-black font-bold shadow-md'
                          : 'bg-zinc-950 text-white font-bold shadow-md'
                        : isDark
                        ? 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-70">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name, vibe or font..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-8 pr-3 py-2 text-xs rounded-xl border font-mono transition-all w-full sm:w-64 ${
                  isDark
                    ? 'bg-black/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-400'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-cyan-600'
                }`}
              />
            </div>
          </div>

          {/* Active Preset Notification Strip */}
          <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                style={{ backgroundColor: draft.accentCyan }}
              />
              <span className="text-xs font-mono">
                Currently Live Previewing: <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{draft.presetName || activePreset.name}</strong>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                Display: {draft.fontDisplay} · Radius: {draft.borderRadius}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleSave()}
              className="px-4 py-1.5 rounded-lg bg-[#00F0FF] text-black font-bold text-xs font-mono shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:brightness-110 transition-all shrink-0 cursor-pointer"
            >
              Publish This Theme (Save Live)
            </button>
          </div>

          {/* 50 Themes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPresets.map((preset) => {
              const isSelected = activePresetId === preset.id;

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset, false)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                    isSelected
                      ? isDark
                        ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white shadow-[0_0_30px_rgba(0,240,255,0.3)] ring-2 ring-[#00F0FF]'
                        : 'border-cyan-600 bg-cyan-50/80 text-zinc-950 shadow-lg ring-2 ring-cyan-500'
                      : isDark
                      ? 'border-white/10 bg-[#090914] text-zinc-300 hover:border-cyan-400 hover:bg-white/[0.04]'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:border-cyan-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Row: Color Swatches & Category */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4.5 h-4.5 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: preset.accentPrimary }}
                          title={`Primary: ${preset.accentPrimary}`}
                        />
                        <div
                          className="w-4.5 h-4.5 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: preset.accentSecondary }}
                          title={`Secondary: ${preset.accentSecondary}`}
                        />
                        <div
                          className="w-12 h-3 rounded-full border border-white/20"
                          style={{ background: preset.accentGradient }}
                          title="Gradient signature"
                        />
                      </div>

                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-zinc-400 uppercase tracking-wider">
                        {preset.category.split('&')[0].trim()}
                      </span>
                    </div>

                    {/* Theme Name & Tagline */}
                    <h3 className="font-bold text-sm tracking-tight mb-1 flex items-center justify-between">
                      <span>{preset.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </h3>
                    <p className={`text-[11px] leading-relaxed line-clamp-2 mb-3 ${
                      isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>
                      {preset.tagline}
                    </p>
                  </div>

                  <div>
                    {/* Mini Specimen Strip */}
                    <div className={`p-2 rounded-xl border mb-3 text-[10px] font-mono flex items-center justify-between ${
                      isDark ? 'bg-black/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <span className="text-zinc-400 truncate">Font: {preset.fontDisplay}</span>
                      <span className="text-cyan-400 shrink-0 capitalize">{preset.borderRadius}</span>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPreset(preset, false);
                          setActiveTab('live_preview');
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-semibold border transition-all text-center ${
                          isDark
                            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300'
                            : 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        Inspect Preview
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPreset(preset, true);
                        }}
                        className="py-1.5 px-3 rounded-lg text-[10px] font-mono font-bold bg-[#00F0FF] text-black hover:brightness-110 transition-all shrink-0 cursor-pointer shadow-xs"
                      >
                        1-Click Apply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: LIVE THEME PREVIEW CANVAS ================= */}
      {activeTab === 'live_preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Preview Frame (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold font-mono uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Live Preview: {draft.presetName || 'Custom Active Theme'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 ${
                    previewDevice === 'desktop' ? 'bg-[#00F0FF] text-black font-bold' : 'text-zinc-400'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 ${
                    previewDevice === 'mobile' ? 'bg-[#00F0FF] text-black font-bold' : 'text-zinc-400'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Mobile View</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Viewport Container */}
            <div className={`p-4 sm:p-6 rounded-3xl border transition-all flex justify-center ${
              isDark ? 'bg-[#05050c] border-white/10 shadow-2xl' : 'bg-slate-100 border-zinc-300'
            }`}>
              <div
                className={`transition-all duration-300 rounded-2xl overflow-hidden border shadow-2xl p-6 space-y-6 ${
                  previewDevice === 'mobile' ? 'w-[360px]' : 'w-full'
                }`}
                style={{
                  backgroundColor: isDark ? (draft.bgMainDark || '#070710') : (draft.bgMainLight || '#FFFFFF'),
                  color: isDark ? (draft.textColorDark || '#F8FAFC') : (draft.textColorLight || '#0F172A'),
                  borderColor: isDark ? `${draft.accentCyan}33` : 'rgba(0,0,0,0.1)',
                }}
              >
                {/* 1. Badge & Kicker */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border"
                    style={{
                      borderColor: `${draft.accentCyan}55`,
                      backgroundColor: `${draft.accentCyan}15`,
                      color: draft.accentCyan,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: draft.accentCyan }} />
                    <span>{draft.presetName || 'THEME ACTIVE'} · £35/HR RATE</span>
                  </div>
                </div>

                {/* 2. Hero Headline in Display Font */}
                <div className="text-center space-y-2">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight"
                    style={{ fontFamily: `'${draft.fontDisplay}', sans-serif` }}
                  >
                    WEBSITES & ONLINE SHOPS{' '}
                    <span style={{
                      background: draft.accentGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      BUILT TO GROW BUSINESS.
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed"
                    style={{ fontFamily: `'${draft.fontSans}', sans-serif` }}
                  >
                    Direct freelance collaboration with Saad M. Fast turnaround, 100% mobile perfection, transparent £35/hr rate.
                  </p>
                </div>

                {/* 3. Interactive Buttons Specimen */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-transform hover:scale-105"
                    style={{
                      backgroundColor: draft.accentCyan,
                      borderRadius: draft.borderRadius === 'sharp' ? '0px' : draft.borderRadius === 'pill' ? '9999px' : '12px',
                    }}
                  >
                    Start a Project
                  </button>

                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider border transition-all"
                    style={{
                      borderColor: `${draft.accentCyan}55`,
                      backgroundColor: `${draft.accentCyan}10`,
                      color: draft.accentCyan,
                      borderRadius: draft.borderRadius === 'sharp' ? '0px' : draft.borderRadius === 'pill' ? '9999px' : '12px',
                    }}
                  >
                    Instant Estimator
                  </button>
                </div>

                {/* 4. Sample Service Card */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
                }`}
                  style={{
                    borderRadius: draft.borderRadius === 'sharp' ? '0px' : draft.borderRadius === 'pill' ? '28px' : '16px',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ fontFamily: `'${draft.fontDisplay}', sans-serif` }}>
                      Custom High-Speed Website (React)
                    </span>
                    <span className="text-xs font-mono font-bold" style={{ color: draft.accentCyan }}>
                      £35/hr
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Sub-second load times, bespoke motion design, clean code architecture, and Google SEO setup.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Mobile Ready', 'SEO Schema', 'Fast Cloud', 'Analytics'].map((tag) => (
                      <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/20 dark:bg-white/10 text-zinc-300">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Specimen Inspector (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400">
                Active Theme Specs
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] block">PRESET IDENTITY</span>
                  <span className="font-bold">{draft.presetName || 'Custom Studio Palette'}</span>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">PRIMARY ACCENT</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: draft.accentCyan }} />
                    <span className="font-bold">{draft.accentCyan}</span>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">SECONDARY ACCENT</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: draft.accentPurple }} />
                    <span className="font-bold">{draft.accentPurple}</span>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">DISPLAY TYPOGRAPHY</span>
                  <span className="font-bold text-cyan-300">{draft.fontDisplay}</span>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">BODY TYPOGRAPHY</span>
                  <span className="font-bold text-zinc-300">{draft.fontSans}</span>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">GEOMETRY RADIUS</span>
                  <span className="font-bold capitalize">{draft.borderRadius}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-[#00F0FF] text-black font-display font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  {saving ? 'Publishing...' : 'Save & Publish This Theme'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('finetune')}
                  className={`w-full py-2 rounded-xl text-xs font-mono border transition-all ${
                    isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                  }`}
                >
                  Adjust Colors & Fonts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: THEME FINE-TUNER & SLIDERS ================= */}
      {activeTab === 'finetune' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div>
            <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              Theme Fine-Tuner & Dynamic Variables
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Customize any theme preset with your own hex codes, custom border curvature, and font pairings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Primary Accent Color */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'bg-black/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <label className="text-xs font-bold font-mono uppercase text-zinc-400 block">
                Primary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={draft.accentCyan}
                  onChange={(e) => {
                    const updated = { ...draft, accentCyan: e.target.value };
                    setDraft(updated);
                    applyPreviewTokens(updated);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={draft.accentCyan}
                  onChange={(e) => {
                    const updated = { ...draft, accentCyan: e.target.value };
                    setDraft(updated);
                    applyPreviewTokens(updated);
                  }}
                  className={`flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border uppercase ${
                    isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>
            </div>

            {/* Secondary Accent Color */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'bg-black/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <label className="text-xs font-bold font-mono uppercase text-zinc-400 block">
                Secondary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={draft.accentPurple}
                  onChange={(e) => {
                    const updated = { ...draft, accentPurple: e.target.value };
                    setDraft(updated);
                    applyPreviewTokens(updated);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={draft.accentPurple}
                  onChange={(e) => {
                    const updated = { ...draft, accentPurple: e.target.value };
                    setDraft(updated);
                    applyPreviewTokens(updated);
                  }}
                  className={`flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border uppercase ${
                    isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>
            </div>

            {/* Corner Radius System */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'bg-black/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <label className="text-xs font-bold font-mono uppercase text-zinc-400 block">
                Corner Radius Curvature
              </label>
              <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px]">
                {(['sharp', 'minimal', 'modern', 'soft', 'pill'] as const).map((rad) => (
                  <button
                    key={rad}
                    type="button"
                    onClick={() => {
                      const updated = { ...draft, borderRadius: rad };
                      setDraft(updated);
                      applyPreviewTokens(updated);
                    }}
                    className={`p-2 rounded-lg border text-center transition-all capitalize ${
                      draft.borderRadius === rad
                        ? 'bg-[#00F0FF] text-black font-bold border-[#00F0FF]'
                        : isDark
                        ? 'border-white/10 bg-white/5 text-zinc-400'
                        : 'border-zinc-300 bg-white text-zinc-700'
                    }`}
                  >
                    {rad}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#00F0FF] text-black font-bold text-xs font-mono shadow-lg hover:brightness-110 cursor-pointer"
            >
              {saving ? 'Publishing...' : 'Save & Publish Custom Adjustments'}
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 4: GOOGLE FONTS PAIRING ================= */}
      {activeTab === 'fonts' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div>
            <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              Curated Google Fonts Catalog ({FONT_CATALOG.length})
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Click any font to instantly pair it as your Primary Display Headline Font.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {FONT_CATALOG.map((font) => {
              const isSelected = draft.fontDisplay === font.family;

              return (
                <div
                  key={font.family}
                  onClick={() => {
                    loadGoogleFont(font.family);
                    const updated = { ...draft, fontDisplay: font.family };
                    setDraft(updated);
                    applyPreviewTokens(updated);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#00F0FF] bg-cyan-500/10 text-cyan-300 ring-2 ring-[#00F0FF]'
                      : isDark
                      ? 'border-white/10 bg-black/40 text-zinc-300 hover:border-cyan-400'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">{font.category}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <div className="text-base font-bold truncate" style={{ fontFamily: `'${font.family}', sans-serif` }}>
                    {font.family}
                  </div>
                  <span className="text-[10px] text-zinc-500 block truncate mt-1">
                    Quick brown fox jumps
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
