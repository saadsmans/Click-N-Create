import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  X,
  Check,
  Sparkles,
  Zap,
  Crown,
  Boxes,
  Flame,
  Search,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  Laptop,
  Smartphone,
  Tablet,
  Type,
  Maximize2,
  ExternalLink,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { THEME_PRESETS, FONT_CATALOG, ThemePreset, loadGoogleFont, loadGoogleFontsBatch } from '../data/themeCatalog.ts';
import { FontStudioGallery } from './FontStudioGallery.tsx';
import { FontSelectDropdown } from './FontSelectDropdown.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { ThemeTokens } from '../types/index.ts';

interface ThemeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeStudioModal: React.FC<ThemeStudioModalProps> = ({ isOpen, onClose }) => {
  const { customization, applyPreviewTokens, refreshCustomization, saveTheme } = useCustomization();
  const { theme: modeTheme } = useTheme();
  const isDark = modeTheme === 'dark';

  const [activeTab, setActiveTab] = useState<'presets' | 'fonts' | 'live_preview' | 'finetune'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePresetId, setActivePresetId] = useState<string>(customization.theme.presetId || 'cyber_cyan');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewPage, setPreviewPage] = useState<'home' | 'pricing' | 'services'>('home');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [originalTheme] = useState<ThemeTokens>(customization.theme);

  // Draft customization for fine-tuning
  const [draftTheme, setDraftTheme] = useState<ThemeTokens>(customization.theme);

  // Load all 115 fonts into head whenever modal is open
  useEffect(() => {
    if (isOpen) {
      loadGoogleFontsBatch(FONT_CATALOG.map((f) => f.family));
    }
  }, [isOpen]);

  useEffect(() => {
    setDraftTheme(customization.theme);
    if (customization.theme.presetId) {
      setActivePresetId(customization.theme.presetId);
    }
  }, [customization.theme]);

  const categories = [
    { id: 'All', label: 'All 100 Themes', count: THEME_PRESETS.length, icon: Palette },
    { id: 'Cyber & Sci-Fi', label: 'Cyber & Sci-Fi', count: 20, icon: Zap },
    { id: 'Luxury & Editorial', label: 'Luxury & Editorial', count: 20, icon: Crown },
    { id: 'Modern SaaS & Tech', label: 'Modern SaaS & Tech', count: 20, icon: Boxes },
    { id: 'Neo-Brutalist & Retro', label: 'Neo-Brutalist & Retro', count: 20, icon: Flame },
    { id: 'Nature & Organic', label: 'Nature & Organic', count: 20, icon: Sparkles },
  ];

  const filteredPresets = THEME_PRESETS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fontDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.headerStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.footerStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dropdownStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activePreset = THEME_PRESETS.find((p) => p.id === activePresetId) || THEME_PRESETS[0];

  const handleSelectTheme = async (preset: ThemePreset, persist = false) => {
    loadGoogleFont(preset.fontDisplay);
    loadGoogleFont(preset.fontSans);
    loadGoogleFont(preset.fontMono);

    const updated: ThemeTokens = {
      ...customization.theme,
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
      footerStyle: preset.footerStyle,
      dropdownStyle: preset.dropdownStyle,
      backgroundPattern: preset.backgroundPattern,
      fontDisplay: preset.fontDisplay,
      fontSans: preset.fontSans,
      fontMono: preset.fontMono,
    };

    setActivePresetId(preset.id);
    setDraftTheme(updated);
    applyPreviewTokens(updated);

    if (persist) {
      await saveThemeToBackend(updated);
    }
  };

  const handleFullSitePreview = (preset: ThemePreset) => {
    handleSelectTheme(preset, false);
    const updated: ThemeTokens = {
      ...draftTheme,
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
      footerStyle: preset.footerStyle,
      dropdownStyle: preset.dropdownStyle,
      backgroundPattern: preset.backgroundPattern,
      fontDisplay: preset.fontDisplay,
      fontSans: preset.fontSans,
      fontMono: preset.fontMono,
    };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cnc_live_preview_theme', JSON.stringify(updated));
      window.dispatchEvent(new Event('cnc_preview_update'));
    }
  };

  const handleApplyDraft = async (persist = false) => {
    applyPreviewTokens(draftTheme);
    if (typeof window !== 'undefined') {
      try {
        const cleanDraft: any = { ...draftTheme };
        if (cleanDraft.customLogoUrl?.startsWith('data:')) delete cleanDraft.customLogoUrl;
        if (cleanDraft.customSiteIconUrl?.startsWith('data:')) delete cleanDraft.customSiteIconUrl;
        sessionStorage.setItem('cnc_live_preview_theme', JSON.stringify(cleanDraft));
        window.dispatchEvent(new Event('cnc_preview_update'));
      } catch (e) {
        console.warn('sessionStorage preview update warning:', e);
      }
    }
    if (persist) {
      await saveThemeToBackend(draftTheme);
    }
  };

  const saveThemeToBackend = async (themeToSave: ThemeTokens) => {
    setIsSaving(true);
    try {
      if (typeof window !== 'undefined') {
        try {
          const cleanTheme: any = { ...themeToSave };
          if (cleanTheme.customLogoUrl?.startsWith('data:')) delete cleanTheme.customLogoUrl;
          if (cleanTheme.customSiteIconUrl?.startsWith('data:')) delete cleanTheme.customSiteIconUrl;
          localStorage.setItem('cnc_active_theme', JSON.stringify(cleanTheme));
        } catch (e) {
          console.warn('localStorage theme quota warning in ThemeStudioModal:', e);
        }
        try {
          sessionStorage.removeItem('cnc_live_preview_theme');
        } catch {
          // ignore
        }
      }

      await saveTheme(themeToSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      await refreshCustomization();
    } catch (err) {
      console.warn('Theme save warning:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevert = () => {
    applyPreviewTokens(originalTheme);
    setActivePresetId(originalTheme.presetId || 'cyber_cyan');
    setDraftTheme(originalTheme);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cnc_live_preview_theme');
      window.dispatchEvent(new Event('cnc_preview_update'));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Slide-out Theme Customizer Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`relative z-10 w-full max-w-4xl h-full flex flex-col shadow-2xl border-l backdrop-blur-3xl overflow-hidden ${
              isDark
                ? 'bg-[#080816]/98 border-white/10 text-white'
                : 'bg-white/98 border-zinc-200 text-zinc-950'
            }`}
          >
            {/* 1. Header Bar */}
            <div className="p-4 sm:p-5 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between shrink-0 bg-black/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold shadow-md"
                  style={{ background: draftTheme.accentGradient || draftTheme.accentCyan }}
                >
                  <Palette className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base font-display">
                      WordPress & Shopify Theme Studio
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30">
                      100 THEMES
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Active: <span className="font-bold text-cyan-400">{draftTheme.presetName || activePreset.name}</span> · Live real-time styling
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => saveThemeToBackend(draftTheme)}
                  disabled={isSaving}
                  className="hidden sm:flex px-4 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-bold text-xs items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{saveSuccess ? 'Saved Live!' : 'Publish Theme'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close customizer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Top Sub-Navigation Tabs */}
            <div className="px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between shrink-0 bg-black/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {[
                  { id: 'presets', label: `100 Themes Catalog (${THEME_PRESETS.length})`, icon: Palette },
                  { id: 'fonts', label: `100+ Font Options (${FONT_CATALOG.length})`, icon: Type },
                  { id: 'live_preview', label: 'Interactive Live Preview Canvas', icon: Eye },
                  { id: 'finetune', label: 'Theme Fine-Tuner & Styles', icon: SlidersHorizontal },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                          : isDark
                          ? 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleRevert}
                className="hidden md:flex text-[11px] font-mono text-zinc-400 hover:text-white items-center gap-1 cursor-pointer transition-colors"
                title="Revert back to initial theme"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Revert</span>
              </button>
            </div>

            {/* 3. Main Body Content Based on Active Tab */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {/* TAB 1: 50 THEMES CATALOG */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  {/* Category Pills & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? 'bg-white text-black font-bold shadow-xs'
                                  : 'bg-zinc-950 text-white font-bold shadow-xs'
                                : isDark
                                ? 'bg-white/5 text-zinc-400 hover:text-white'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{cat.label}</span>
                            <span className="opacity-60 text-[10px]">({cat.count})</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative min-w-[200px]">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search 100 themes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-xl border ${
                          isDark
                            ? 'bg-black/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-400'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-cyan-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Themes Grid (2-columns on desktop) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredPresets.map((preset) => {
                      const isSelected = activePresetId === preset.id;

                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectTheme(preset, false)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                            isSelected
                              ? isDark
                                ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-[#00F0FF]'
                                : 'border-cyan-600 bg-cyan-50/80 text-zinc-950 shadow-md ring-1 ring-cyan-500'
                              : isDark
                              ? 'border-white/10 bg-black/40 text-zinc-300 hover:border-cyan-400/50 hover:bg-white/5'
                              : 'border-zinc-200 bg-white text-zinc-800 hover:border-cyan-400 hover:shadow-xs'
                          }`}
                        >
                          <div>
                            {/* Card Top: Name, Category, Color Pills */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-xs sm:text-sm font-display truncate">
                                    {preset.name}
                                  </h4>
                                  {isSelected && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#00F0FF] text-black">
                                      ACTIVE
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {preset.category}
                                </span>
                              </div>

                              {/* Color Swatch Circle Dots */}
                              <div className="flex items-center gap-1.5 shrink-0 p-1 rounded-lg bg-black/30 dark:bg-white/5 border border-white/10">
                                <div
                                  className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/20"
                                  style={{ backgroundColor: preset.accentPrimary }}
                                  title={`Primary: ${preset.accentPrimary}`}
                                />
                                <div
                                  className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/20"
                                  style={{ backgroundColor: preset.accentSecondary }}
                                  title={`Secondary: ${preset.accentSecondary}`}
                                />
                                <div
                                  className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/20"
                                  style={{ backgroundColor: preset.bgMainDark }}
                                  title={`Dark BG: ${preset.bgMainDark}`}
                                />
                              </div>
                            </div>

                            <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2.5">
                              {preset.tagline}
                            </p>

                            {/* Architectural Signature Badges: Header, Dropdown, Footer, Pattern */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-2.5 text-[9px] font-mono text-center">
                              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 truncate" title={`Header: ${preset.headerStyle}`}>
                                H: {preset.headerStyle.replace('_', ' ')}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 truncate" title={`Dropdown: ${preset.dropdownStyle}`}>
                                D: {preset.dropdownStyle.replace('_', ' ')}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 truncate" title={`Footer: ${preset.footerStyle}`}>
                                F: {preset.footerStyle.replace('_', ' ')}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 truncate" title={`Pattern: ${preset.backgroundPattern}`}>
                                P: {preset.backgroundPattern}
                              </span>
                            </div>

                            {/* Prominent Font Style & Sample Preview Box (Before Going for Preview) */}
                            <div className={`p-3 rounded-2xl border mb-3 space-y-1.5 transition-all ${
                              isDark
                                ? 'bg-black/40 border-cyan-500/25 shadow-inner'
                                : 'bg-cyan-50/70 border-cyan-200 shadow-2xs'
                            }`}>
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="flex items-center gap-1 font-bold text-cyan-600 dark:text-[#00F0FF] uppercase tracking-wider">
                                  <Type className="w-3.5 h-3.5" />
                                  <span>Theme Font Style:</span>
                                </span>
                                <span className="text-[10px] font-mono text-zinc-400">
                                  {preset.buttonStyle} · {preset.borderRadius}
                                </span>
                              </div>

                              {/* Font Name rendered in its OWN unique style look */}
                              <div className="flex items-baseline justify-between gap-2">
                                <div
                                  className="text-lg sm:text-xl font-bold tracking-tight truncate text-cyan-700 dark:text-[#00F0FF]"
                                  style={{ fontFamily: `'${preset.fontDisplay}', sans-serif` }}
                                  title={`Font: ${preset.fontDisplay}`}
                                >
                                  {preset.fontDisplay}
                                </div>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 shrink-0 font-bold">
                                  Headline
                                </span>
                              </div>

                              {/* Sample preview of its unique style alongside the name */}
                              <div
                                className={`text-xs sm:text-sm font-semibold tracking-wide truncate px-2.5 py-1.5 rounded-xl border ${
                                  isDark
                                    ? 'bg-black/60 border-white/5 text-zinc-200'
                                    : 'bg-white border-zinc-200 text-zinc-900 shadow-2xs'
                                }`}
                                style={{ fontFamily: `'${preset.fontDisplay}', sans-serif` }}
                              >
                                Aa Bb Gg Rr 123 · Style Preview
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-1.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectTheme(preset, false);
                                  setActiveTab('live_preview');
                                }}
                                className={`flex-1 py-1.5 px-2.5 rounded-xl text-[10px] font-mono font-medium border text-center transition-colors cursor-pointer ${
                                  isDark
                                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
                                    : 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800'
                                }`}
                              >
                                Inspect Specs
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectTheme(preset, true);
                                }}
                                className="py-1.5 px-3.5 rounded-xl text-[10px] font-mono font-bold bg-[#00F0FF] hover:bg-[#38bdf8] text-black transition-all cursor-pointer shadow-xs shrink-0"
                              >
                                1-Click Activate
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFullSitePreview(preset);
                              }}
                              className={`w-full py-1.5 px-2.5 rounded-xl text-[10px] font-mono font-bold border transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                isDark
                                  ? 'border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300'
                                  : 'border-cyan-600/40 bg-cyan-50 hover:bg-cyan-100 text-cyan-900'
                              }`}
                            >
                              <Eye className="w-3 h-3" />
                              <span>✨ Live Full-Site Preview (All Pages)</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: 100+ GOOGLE FONTS STUDIO */}
              {activeTab === 'fonts' && (
                <FontStudioGallery
                  currentDisplayFont={draftTheme.fontDisplay}
                  currentSansFont={draftTheme.fontSans}
                  currentMonoFont={draftTheme.fontMono}
                  onSelectFont={(family, target) => {
                    const updated = {
                      ...draftTheme,
                      fontDisplay: target === 'display' ? family : draftTheme.fontDisplay,
                      fontSans: target === 'sans' ? family : draftTheme.fontSans,
                      fontMono: target === 'mono' ? family : draftTheme.fontMono,
                    };
                    setDraftTheme(updated);
                    applyPreviewTokens(updated);
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('cnc_live_preview_theme', JSON.stringify(updated));
                      window.dispatchEvent(new Event('cnc_preview_update'));
                    }
                  }}
                  isDark={isDark}
                />
              )}

              {/* TAB 2: INTERACTIVE LIVE PREVIEW CANVAS */}
              {activeTab === 'live_preview' && (
                <div className="space-y-4">
                  {/* Viewport Toolbar */}
                  <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-2xl border bg-black/10 dark:bg-white/5 border-black/[0.06] dark:border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono">Simulated Viewport:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('desktop')}
                          className={`p-1.5 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                            previewDevice === 'desktop' ? 'bg-[#00F0FF] text-black font-bold' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Laptop className="w-3.5 h-3.5" />
                          <span>Desktop</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('tablet')}
                          className={`p-1.5 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                            previewDevice === 'tablet' ? 'bg-[#00F0FF] text-black font-bold' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Tablet className="w-3.5 h-3.5" />
                          <span>Tablet</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('mobile')}
                          className={`p-1.5 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                            previewDevice === 'mobile' ? 'bg-[#00F0FF] text-black font-bold' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Mobile</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">Page:</span>
                      <div className="flex items-center gap-1">
                        {(['home', 'pricing', 'services'] as const).map((pg) => (
                          <button
                            key={pg}
                            type="button"
                            onClick={() => setPreviewPage(pg)}
                            className={`px-2 py-1 rounded-md text-[11px] font-mono capitalize cursor-pointer ${
                              previewPage === pg ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            {pg}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Device Frame */}
                  <div className={`p-4 sm:p-6 rounded-3xl border flex justify-center transition-all ${
                    isDark ? 'bg-black/60 border-white/10' : 'bg-zinc-100 border-zinc-200'
                  }`}>
                    <div
                      className={`transition-all duration-300 rounded-2xl overflow-hidden border shadow-2xl p-6 space-y-6 ${
                        previewDevice === 'mobile' ? 'w-[360px]' : previewDevice === 'tablet' ? 'w-[640px]' : 'w-full'
                      }`}
                      style={{
                        backgroundColor: isDark ? (draftTheme.bgMainDark || '#07070F') : (draftTheme.bgMainLight || '#F8FAFC'),
                        color: isDark ? (draftTheme.textColorDark || '#F8FAFC') : (draftTheme.textColorLight || '#0F172A'),
                        borderColor: isDark ? `${draftTheme.accentCyan}33` : 'rgba(0,0,0,0.1)',
                      }}
                    >
                      {/* 1. Header Wordmark Sample */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full animate-pulse"
                            style={{ backgroundColor: draftTheme.accentCyan }}
                          />
                          <span className="font-display font-black text-sm tracking-tight" style={{ fontFamily: draftTheme.fontDisplay }}>
                            CLICK N CREATE
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: `${draftTheme.accentCyan}44`,
                            color: draftTheme.accentCyan,
                          }}
                        >
                          £35/HR · 2026 ACTIVE
                        </span>
                      </div>

                      {/* 2. Hero Headline & Subtitle */}
                      <div className="text-center space-y-3 py-4">
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
                          style={{
                            borderColor: `${draftTheme.accentCyan}44`,
                            backgroundColor: `${draftTheme.accentCyan}15`,
                            color: draftTheme.accentCyan,
                          }}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>THEME: {draftTheme.presetName || activePreset.name}</span>
                        </div>

                        <h2
                          className="text-2xl sm:text-3xl font-black font-display tracking-tight"
                          style={{ fontFamily: draftTheme.fontDisplay }}
                        >
                          Engineering <span style={{ color: draftTheme.accentCyan }}>Digital Reality</span> with Precision
                        </h2>

                        <p
                          className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-sans"
                          style={{ fontFamily: draftTheme.fontSans }}
                        >
                          This simulated canvas previews typography, border radii, button states, and color swatches in real-time.
                        </p>

                        {/* Interactive Buttons */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <button
                            type="button"
                            className="px-5 py-2.5 font-display font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
                            style={{
                              backgroundColor: draftTheme.accentCyan,
                              color: '#000000',
                              borderRadius: draftTheme.borderRadius === 'sharp' ? '0px' : draftTheme.borderRadius === 'pill' ? '9999px' : '12px',
                              boxShadow: draftTheme.buttonStyle === 'brutalist' ? '4px 4px 0px #000' : `0 0 20px ${draftTheme.accentCyan}66`,
                            }}
                          >
                            Explore Deliverables
                          </button>

                          <button
                            type="button"
                            className="px-5 py-2.5 font-mono text-xs border transition-all cursor-pointer"
                            style={{
                              borderColor: `${draftTheme.accentCyan}66`,
                              color: draftTheme.accentCyan,
                              backgroundColor: 'transparent',
                              borderRadius: draftTheme.borderRadius === 'sharp' ? '0px' : draftTheme.borderRadius === 'pill' ? '9999px' : '12px',
                            }}
                          >
                            View Portfolio
                          </button>
                        </div>
                      </div>

                      {/* 3. Cards Grid Sample */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div
                          className="p-4 border rounded-2xl space-y-2"
                          style={{
                            backgroundColor: isDark ? (draftTheme.bgSecondaryDark || '#0D0D1C') : (draftTheme.bgSecondaryLight || '#FFFFFF'),
                            borderColor: `${draftTheme.accentCyan}33`,
                            borderRadius: draftTheme.borderRadius === 'sharp' ? '0px' : '16px',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold" style={{ fontFamily: draftTheme.fontDisplay }}>
                              Full-Stack Web Apps
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400">£1,200</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            High-concurrency React & Express architectures with zero layout shift.
                          </p>
                        </div>

                        <div
                          className="p-4 border rounded-2xl space-y-2"
                          style={{
                            backgroundColor: isDark ? (draftTheme.bgSecondaryDark || '#0D0D1C') : (draftTheme.bgSecondaryLight || '#FFFFFF'),
                            borderColor: `${draftTheme.accentPurple}33`,
                            borderRadius: draftTheme.borderRadius === 'sharp' ? '0px' : '16px',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold" style={{ fontFamily: draftTheme.fontDisplay }}>
                              Brand & Design Systems
                            </span>
                            <span className="text-[10px] font-mono text-purple-400">£850</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            Bespoke typography, SVG icon kits, design tokens, and fluid interactions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: THEME FINE-TUNER & CONTROLS */}
              {activeTab === 'finetune' && (
                <div className="space-y-6">
                  {/* Colors Section */}
                  <div className="p-4 rounded-2xl border bg-black/10 dark:bg-white/5 border-black/[0.06] dark:border-white/[0.08] space-y-4">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Color Palette & Gradients</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Accent 1 */}
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1.5">
                          Primary Accent Color:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={draftTheme.accentCyan}
                            onChange={(e) => {
                              const updated = { ...draftTheme, accentCyan: e.target.value };
                              setDraftTheme(updated);
                              applyPreviewTokens(updated);
                            }}
                            className="w-9 h-9 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={draftTheme.accentCyan}
                            onChange={(e) => {
                              const updated = { ...draftTheme, accentCyan: e.target.value };
                              setDraftTheme(updated);
                              applyPreviewTokens(updated);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl border bg-black/40 border-white/10 text-white"
                          />
                        </div>
                      </div>

                      {/* Accent 2 */}
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1.5">
                          Secondary Accent Color:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={draftTheme.accentPurple}
                            onChange={(e) => {
                              const updated = { ...draftTheme, accentPurple: e.target.value };
                              setDraftTheme(updated);
                              applyPreviewTokens(updated);
                            }}
                            className="w-9 h-9 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={draftTheme.accentPurple}
                            onChange={(e) => {
                              const updated = { ...draftTheme, accentPurple: e.target.value };
                              setDraftTheme(updated);
                              applyPreviewTokens(updated);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl border bg-black/40 border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typography Pairing */}
                  <div className="p-4 rounded-2xl border bg-black/10 dark:bg-white/5 border-black/[0.06] dark:border-white/[0.08] space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                        <Type className="w-3.5 h-3.5" />
                        <span>Typography & Font Engine (115 Fonts)</span>
                      </h4>

                      <button
                        type="button"
                        onClick={() => setActiveTab('fonts')}
                        className="px-3 py-1 rounded-xl text-[11px] font-mono font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 hover:bg-[#00F0FF] hover:text-black transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Browse 115+ Fonts Visually</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Headlines & Display Font: 100+ Fonts Selection List With Font Style Look & Sample Previews */}
                      <FontSelectDropdown
                        label="Headlines & Display Font:"
                        value={draftTheme.fontDisplay}
                        target="display"
                        isDark={isDark}
                        filterCategories={['Display', 'Futuristic', 'Serif', 'Sans-Serif']}
                        onChange={(family) => {
                          loadGoogleFont(family);
                          const updated = { ...draftTheme, fontDisplay: family };
                          setDraftTheme(updated);
                          applyPreviewTokens(updated);
                        }}
                      />

                      {/* Body & UI Font: 100+ Fonts Selection List With Font Style Look & Sample Previews */}
                      <FontSelectDropdown
                        label="Body & UI Font:"
                        value={draftTheme.fontSans}
                        target="sans"
                        isDark={isDark}
                        filterCategories={['Sans-Serif', 'Monospace', 'Serif']}
                        onChange={(family) => {
                          loadGoogleFont(family);
                          const updated = { ...draftTheme, fontSans: family };
                          setDraftTheme(updated);
                          applyPreviewTokens(updated);
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('fonts')}
                      className="mt-3 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open 100+ Fonts Visual Studio (All fonts named in their own styles) →</span>
                    </button>
                  </div>

                  {/* Radii & Buttons */}
                  <div className="p-4 rounded-2xl border bg-black/10 dark:bg-white/5 border-black/[0.06] dark:border-white/[0.08] space-y-4">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Shapes, Radii & Button Styles</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Radius */}
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1.5">
                          Corner Radius System:
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {(['sharp', 'minimal', 'modern', 'soft', 'pill'] as const).map((rad) => (
                            <button
                              key={rad}
                              type="button"
                              onClick={() => {
                                const updated = { ...draftTheme, borderRadius: rad };
                                setDraftTheme(updated);
                                applyPreviewTokens(updated);
                              }}
                              className={`py-1.5 text-[10px] font-mono capitalize rounded-lg border transition-all cursor-pointer ${
                                draftTheme.borderRadius === rad
                                  ? 'bg-[#00F0FF] text-black font-bold border-[#00F0FF]'
                                  : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {rad}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Button Style */}
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1.5">
                          Button Style:
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(['glow', 'flat', 'brutalist', 'outline'] as const).map((btn) => (
                            <button
                              key={btn}
                              type="button"
                              onClick={() => {
                                const updated = { ...draftTheme, buttonStyle: btn };
                                setDraftTheme(updated);
                                applyPreviewTokens(updated);
                              }}
                              className={`py-1.5 text-[10px] font-mono capitalize rounded-lg border transition-all cursor-pointer ${
                                draftTheme.buttonStyle === btn
                                  ? 'bg-[#00F0FF] text-black font-bold border-[#00F0FF]'
                                  : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {btn}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Bottom Command Bar */}
            <div className="p-4 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-3 shrink-0 bg-black/10 dark:bg-white/5">
              <button
                type="button"
                onClick={handleRevert}
                className="px-4 py-2.5 rounded-xl text-xs font-mono border border-zinc-300 dark:border-white/10 text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to Default</span>
              </button>

              <div className="flex items-center gap-2 flex-1 justify-end">
                <button
                  type="button"
                  onClick={() => handleApplyDraft(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 hover:text-white cursor-pointer"
                >
                  Live Preview on Page
                </button>

                <button
                  type="button"
                  onClick={() => saveThemeToBackend(draftTheme)}
                  disabled={isSaving}
                  className="py-2.5 px-6 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{saveSuccess ? 'Theme Saved Live!' : 'Keep & Save Active Theme'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
