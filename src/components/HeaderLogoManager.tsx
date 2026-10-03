import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Save,
  RefreshCw,
  Trash2,
  Eye,
  Sliders,
  CheckCircle2,
  Sparkles,
  Link2,
  Layers,
  Sun,
  Moon,
  Globe,
  Smartphone,
  Laptop,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { ClickNCreateLogo } from './ClickNCreateLogo.tsx';

interface HeaderLogoManagerProps {
  onSaved?: () => void;
}

export const HeaderLogoManager: React.FC<HeaderLogoManagerProps> = ({ onSaved }) => {
  const { customization, refreshCustomization, applyPreviewTokens } = useCustomization();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const currentTheme = customization?.theme || {};

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<'all' | 'header_logo' | 'site_icon'>('all');

  // Header Logo States
  const [logoUrl, setLogoUrl] = useState<string>(currentTheme.customLogoUrl || '');
  const [displayMode, setDisplayMode] = useState<'image_text' | 'image_only' | 'text_only'>(
    currentTheme.logoDisplayMode || 'image_text'
  );
  const [logoHeight, setLogoHeight] = useState<number>(currentTheme.logoHeight || 36);

  // Site Icon (Favicon / Browser Tab Icon) States
  const [siteIconUrl, setSiteIconUrl] = useState<string>(currentTheme.customSiteIconUrl || '');
  const [siteIconPreviewError, setSiteIconPreviewError] = useState<boolean>(false);

  // Status & Loading
  const [headerUploadLoading, setHeaderUploadLoading] = useState<boolean>(false);
  const [siteIconUploadLoading, setSiteIconUploadLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preview Sandbox Controls
  const [previewThemeMode, setPreviewThemeMode] = useState<'dark' | 'light'>(isDark ? 'dark' : 'light');
  const [previewScrolled, setPreviewScrolled] = useState<boolean>(false);

  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const siteIconFileInputRef = useRef<HTMLInputElement>(null);

  // Effective Site Icon display (falls back to default if empty)
  const effectiveSiteIcon = siteIconUrl.trim() !== '' ? siteIconUrl : '/favicon-32x32.png';

  // Header Logo Upload Handler
  const handleHeaderLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, SVG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size is too large (max 5MB).');
      return;
    }

    setErrorMessage(null);
    setHeaderUploadLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setLogoUrl(base64);
      setHeaderUploadLoading(false);
      applyPreviewTokens({
        customLogoUrl: base64,
        logoDisplayMode: displayMode,
        logoHeight: logoHeight,
        customSiteIconUrl: siteIconUrl,
      });
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
      setHeaderUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Site Icon (Favicon) Upload Handler
  const handleSiteIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.endsWith('.ico')) {
      setErrorMessage('Please select a valid icon or image file (PNG, SVG, ICO, JPG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('Icon file size is too large (max 3MB).');
      return;
    }

    setErrorMessage(null);
    setSiteIconUploadLoading(true);
    setSiteIconPreviewError(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSiteIconUrl(base64);
      setSiteIconUploadLoading(false);
      applyPreviewTokens({
        customLogoUrl: logoUrl,
        logoDisplayMode: displayMode,
        logoHeight: logoHeight,
        customSiteIconUrl: base64,
      });
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read icon file.');
      setSiteIconUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Remove / Reset Site Icon
  const handleRemoveSiteIcon = () => {
    setSiteIconUrl('');
    setSiteIconPreviewError(false);
    applyPreviewTokens({
      customLogoUrl: logoUrl,
      logoDisplayMode: displayMode,
      logoHeight: logoHeight,
      customSiteIconUrl: '',
    });
  };

  // Preset Site Icon options
  const handleSiteIconPresetSelect = (url: string) => {
    setSiteIconUrl(url);
    setSiteIconPreviewError(false);
    applyPreviewTokens({
      customLogoUrl: logoUrl,
      logoDisplayMode: displayMode,
      logoHeight: logoHeight,
      customSiteIconUrl: url,
    });
  };

  // Preset Header Logo options
  const handleHeaderPresetSelect = (presetUrl: string) => {
    setLogoUrl(presetUrl);
    applyPreviewTokens({
      customLogoUrl: presetUrl,
      logoDisplayMode: displayMode,
      logoHeight: logoHeight,
      customSiteIconUrl: siteIconUrl,
    });
  };

  // Reset Header Logo to default typography
  const handleResetHeaderLogo = () => {
    setLogoUrl('');
    setDisplayMode('image_text');
    setLogoHeight(36);
    applyPreviewTokens({
      customLogoUrl: '',
      logoDisplayMode: 'image_text',
      logoHeight: 36,
      customSiteIconUrl: siteIconUrl,
    });
  };

  // Save All Changes to Backend Database
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSaveSuccess(null);

    try {
      const token = localStorage.getItem('saad_admin_token') || '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // 1. Save Header Logo
      const logoRes = await fetch('/api/customization/logo', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          logoUrl: logoUrl.startsWith('data:') ? '' : logoUrl,
          logoBase64: logoUrl.startsWith('data:') ? logoUrl : undefined,
          logoDisplayMode: displayMode,
          logoHeight: Number(logoHeight),
          customSiteIconUrl: siteIconUrl.startsWith('data:') ? undefined : siteIconUrl,
        }),
      });
      const logoData = await logoRes.json();

      // 2. Save Site Icon if custom base64 or explicit remove
      const siteIconRes = await fetch('/api/customization/site-icon', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          siteIconUrl: siteIconUrl.startsWith('data:') ? '' : siteIconUrl,
          siteIconBase64: siteIconUrl.startsWith('data:') ? siteIconUrl : undefined,
          removeIcon: siteIconUrl === '',
        }),
      });
      const siteIconData = await siteIconRes.json();

      if (siteIconData.success && siteIconData.siteIconUrl !== undefined) {
        setSiteIconUrl(siteIconData.siteIconUrl);
      }

      if (logoData.success && logoData.logoUrl) {
        setLogoUrl(logoData.logoUrl);
      }

      if (logoData.success || siteIconData.success) {
        setSaveSuccess('Branding & Site Icons saved live across the entire website!');
        await refreshCustomization();
        if (onSaved) onSaved();
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setErrorMessage(logoData.error || siteIconData.error || 'Failed to save logo settings');
      }
    } catch (err: any) {
      console.error('Error saving branding assets:', err);
      setErrorMessage(err?.message || 'Server connection error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Main Action Card with Dual Light / Dark Theme Support */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-cyan-50/70 via-white to-slate-50 dark:from-[#0c0d24] dark:via-[#080816] dark:to-[#04040a] relative overflow-hidden shadow-sm dark:shadow-xl transition-colors duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-[#00F0FF] border border-cyan-500/30 dark:border-[#00F0FF]/30 shadow-xs">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-zinc-950 dark:text-white tracking-tight">
                Header Logo & Site Icon (Favicon) Manager
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Upload custom brand image for the website header and upload your browser tab icon (favicon) or remove/change existing icons anytime.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSaveAll()}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving to Website...' : 'Save All Brand Changes'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-zinc-200 dark:border-white/10 font-mono text-xs">
          {[
            { id: 'all', label: 'All Brand Assets', icon: Layers },
            { id: 'header_logo', label: '1. Website Header Logo', icon: ImageIcon },
            { id: 'site_icon', label: '2. Browser Site Icon (Favicon)', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-zinc-900 text-white dark:bg-white/20 dark:text-white font-bold shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-mono flex items-center gap-2">
          <X className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: HEADER LOGO CONFIGURATION */}
      {(activeTab === 'all' || activeTab === 'header_logo') && (
        <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#080816] space-y-6 shadow-xs transition-colors duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-[#00F0FF] border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-zinc-950 dark:text-white">
                  Website Header Logo & Brandmark
                </h3>
                <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  Controls the primary logo rendered in the top navbar across all desktop and mobile devices.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetHeaderLogo}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Reset Header to Typography</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Upload Form */}
            <div className="lg:col-span-6 space-y-5 font-mono text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-400 uppercase text-[11px] font-bold mb-2">
                  Upload Header Logo Image (PNG, SVG, JPG, WebP)
                </label>
                <input
                  type="file"
                  ref={headerFileInputRef}
                  onChange={handleHeaderLogoUpload}
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  className="hidden"
                />
                <div
                  onClick={() => headerFileInputRef.current?.click()}
                  className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-500 dark:hover:border-[#00F0FF] rounded-2xl p-6 text-center bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-[#00F0FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {headerUploadLoading ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div className="font-bold text-zinc-950 dark:text-white text-sm">
                    Click to browse or drop header logo
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Transparent PNG or Vector SVG recommended for crisp presentation
                  </span>
                </div>
              </div>

              {/* Direct Path Input */}
              <div>
                <label className="block text-zinc-700 dark:text-zinc-400 uppercase text-[11px] font-bold mb-2">
                  Or Image URL / Path
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      applyPreviewTokens({
                        customLogoUrl: e.target.value,
                        logoDisplayMode: displayMode,
                        logoHeight: logoHeight,
                        customSiteIconUrl: siteIconUrl,
                      });
                    }}
                    placeholder="e.g. /favicon.png or https://cdn.com/logo.png"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/50 text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <Link2 className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-3" />
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                  <span className="text-zinc-500">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleHeaderPresetSelect('/favicon.png')}
                    className="px-2 py-0.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-cyan-700 dark:text-cyan-300 border border-zinc-200 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    Favicon PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHeaderPresetSelect('/favicon.svg')}
                    className="px-2 py-0.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-cyan-700 dark:text-cyan-300 border border-zinc-200 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    Vector SVG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHeaderPresetSelect('')}
                    className="px-2 py-0.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    Typographic Brandmark
                  </button>
                </div>
              </div>

              {/* Display Mode */}
              <div>
                <label className="block text-zinc-700 dark:text-zinc-400 uppercase text-[11px] font-bold mb-2">
                  Header Display Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'image_text', label: 'Logo + Brand Name', desc: 'Recommended' },
                    { id: 'image_only', label: 'Logo Image Only', desc: 'Minimalist' },
                    { id: 'text_only', label: 'Pure Typography', desc: 'Clean Text' },
                  ].map((mode) => {
                    const isSelected = displayMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setDisplayMode(mode.id as any);
                          applyPreviewTokens({
                            customLogoUrl: logoUrl,
                            logoDisplayMode: mode.id as any,
                            logoHeight: logoHeight,
                            customSiteIconUrl: siteIconUrl,
                          });
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-50 text-cyan-950 dark:border-[#00F0FF] dark:bg-[#00F0FF]/15 dark:text-white shadow-xs dark:shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                            : 'border-zinc-200 bg-slate-50 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-black/40 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                      >
                        <div className="font-bold text-xs">{mode.label}</div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{mode.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Height Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-zinc-700 dark:text-zinc-400 uppercase text-[11px] font-bold">
                    Header Logo Max Height
                  </label>
                  <span className="text-cyan-600 dark:text-[#00F0FF] font-bold">{logoHeight}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="56"
                  step="2"
                  value={logoHeight}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setLogoHeight(val);
                    applyPreviewTokens({
                      customLogoUrl: logoUrl,
                      logoDisplayMode: displayMode,
                      logoHeight: val,
                      customSiteIconUrl: siteIconUrl,
                    });
                  }}
                  className="w-full accent-cyan-500 dark:accent-[#00F0FF] cursor-pointer"
                />
              </div>
            </div>

            {/* Right Header Live Preview Sandbox */}
            <div className="lg:col-span-6 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-600 dark:text-[#00F0FF]" />
                  <span className="font-bold text-zinc-950 dark:text-white text-sm">Header Navbar Live Preview</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewThemeMode(previewThemeMode === 'dark' ? 'light' : 'dark')}
                    className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 flex items-center gap-1.5 cursor-pointer text-[10px]"
                  >
                    {previewThemeMode === 'dark' ? <Moon className="w-3 h-3 text-cyan-500 dark:text-cyan-400" /> : <Sun className="w-3 h-3 text-amber-500" />}
                    <span>{previewThemeMode === 'dark' ? 'Dark' : 'Light'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewScrolled(!previewScrolled)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] border transition-all cursor-pointer ${
                      previewScrolled
                        ? 'bg-cyan-500 text-black font-bold border-cyan-500'
                        : 'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {previewScrolled ? 'Pill Mode' : 'Top Merged'}
                  </button>
                </div>
              </div>

              <div
                className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 flex items-center justify-center min-h-[190px] ${
                  previewThemeMode === 'dark'
                    ? 'bg-[#07070F] border-white/10 text-white'
                    : 'bg-slate-100 border-zinc-300 text-zinc-950'
                }`}
              >
                <div
                  className={`w-full transition-all duration-300 flex items-center justify-between ${
                    previewScrolled
                      ? previewThemeMode === 'dark'
                        ? 'max-w-md px-5 py-2.5 rounded-full border border-[#00F0FF]/30 bg-[#070714]/90 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,240,255,0.2)]'
                        : 'max-w-md px-5 py-2.5 rounded-full border border-zinc-300 bg-white/90 backdrop-blur-2xl shadow-lg'
                      : 'w-full px-2 py-3 border-b border-black/5 dark:border-white/5'
                  }`}
                >
                  <ClickNCreateLogo
                    size={previewScrolled ? 'sm' : 'md'}
                    overrideLogoUrl={logoUrl}
                    overrideDisplayMode={displayMode}
                  />

                  <div className="hidden sm:flex items-center gap-2 text-[10px] opacity-70">
                    <span className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                      Services
                    </span>
                    <span>Pricing</span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-[#00F0FF] text-black font-bold flex items-center justify-center text-xs shadow-sm">
                    ☰
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: BROWSER SITE ICON (FAVICON & TAB ICON) */}
      {(activeTab === 'all' || activeTab === 'site_icon') && (
        <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#080816] space-y-6 shadow-xs transition-colors duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-zinc-950 dark:text-white">
                  Browser Site Icon (Favicon / Tab Icon / App Icon)
                </h3>
                <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  Controls the browser tab icon, Google search result icon, bookmark icon, and mobile home screen icon.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveSiteIcon}
              className="px-3.5 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Custom Site Icon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Upload Site Icon Controls */}
            <div className="lg:col-span-6 space-y-5 font-mono text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-400 uppercase text-[11px] font-bold mb-2">
                  Upload Site Icon (PNG, SVG, ICO, JPG, WebP)
                </label>
                <input
                  type="file"
                  ref={siteIconFileInputRef}
                  onChange={handleSiteIconUpload}
                  accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,image/jpeg,image/webp,.ico"
                  className="hidden"
                />
                <div
                  onClick={() => siteIconFileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-500/40 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl p-6 text-center bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {siteIconUploadLoading ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div className="font-bold text-zinc-950 dark:text-white text-sm">
                    Click to upload custom site icon / favicon
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Square 1:1 aspect ratio recommended (e.g. 512x512 PNG, SVG, or ICO)
                  </span>
                </div>
              </div>

              {/* Direct Site Icon Path / URL */}
              <div>
                <label className="block text-zinc-700 dark:text-zinc-400 uppercase text-[11px] font-bold mb-2">
                  Site Icon URL / Path
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={siteIconUrl}
                    onChange={(e) => {
                      setSiteIconUrl(e.target.value);
                      applyPreviewTokens({
                        customLogoUrl: logoUrl,
                        logoDisplayMode: displayMode,
                        logoHeight: logoHeight,
                        customSiteIconUrl: e.target.value,
                      });
                    }}
                    placeholder="e.g. /favicon.png or https://cdn.com/icon.png"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/50 text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Link2 className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-3" />
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                  <span className="text-zinc-500">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleSiteIconPresetSelect('/favicon.png')}
                    className="px-2 py-0.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-purple-700 dark:text-purple-300 border border-zinc-200 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    Favicon PNG (Official)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSiteIconPresetSelect('/favicon.svg')}
                    className="px-2 py-0.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-purple-700 dark:text-purple-300 border border-zinc-200 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    Vector SVG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSiteIcon()}
                    className="px-2 py-0.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    Default System Icon
                  </button>
                </div>
              </div>

              {/* Site Icon Status Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-zinc-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">Active Site Icon Source:</span>
                  <span className="text-purple-700 dark:text-purple-400 font-bold text-[11px] truncate max-w-[200px]">
                    {siteIconUrl || 'Default (/favicon-32x32.png)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-zinc-200 dark:border-white/5 text-[10px] text-zinc-500 dark:text-zinc-400">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Configured across HTML head, Apple Touch Icons, and PWA manifests.</span>
                </div>
              </div>
            </div>

            {/* Right Live Browser Tab Mockup Preview */}
            <div className="lg:col-span-6 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-white/10">
                <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-bold text-zinc-950 dark:text-white text-sm">
                  Live Browser Tab & Bookmark Mockup
                </span>
              </div>

              {/* Simulated Web Browser Chrome */}
              <div className="rounded-2xl border border-zinc-300 dark:border-white/15 bg-slate-200 dark:bg-[#121324] overflow-hidden shadow-md dark:shadow-2xl">
                {/* Browser Tab Header Bar */}
                <div className="px-3 pt-2 pb-0 bg-slate-300/80 dark:bg-[#0d0e1c] flex items-center gap-2 border-b border-zinc-300 dark:border-white/10">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>

                  {/* Active Browser Tab */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-xl bg-white dark:bg-[#1a1b32] border-t border-l border-r border-zinc-300 dark:border-white/15 text-zinc-950 dark:text-white max-w-[240px] text-[11px] shadow-xs">
                    <div className="w-4 h-4 rounded-sm overflow-hidden shrink-0 flex items-center justify-center bg-zinc-100 dark:bg-black/40">
                      <img
                        src={effectiveSiteIcon}
                        alt="Favicon Preview"
                        onError={() => setSiteIconPreviewError(true)}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="truncate font-semibold">Click N Create | Saad M</span>
                    <span className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white text-[10px] ml-auto">×</span>
                  </div>

                  {/* Inactive Tab */}
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-zinc-500 dark:text-zinc-400 text-[10px] opacity-60">
                    <span>Google Search</span>
                  </div>
                </div>

                {/* Browser URL Bar */}
                <div className="p-3 bg-slate-100 dark:bg-[#16172e] flex items-center gap-2 text-[10px] text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>https://</span>
                  </div>
                  <span className="font-bold text-zinc-950 dark:text-white">clickncreate.co.uk</span>
                </div>

                {/* App View Inside Browser Window */}
                <div className="p-5 bg-white dark:bg-[#07070F] text-center space-y-3 transition-colors">
                  <div className="w-16 h-16 mx-auto rounded-2xl p-2 border border-purple-400/40 bg-purple-500/10 flex items-center justify-center shadow-xs dark:shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                    <img
                      src={effectiveSiteIcon}
                      alt="Site Icon Zoom"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-950 dark:text-white text-xs">
                      Custom Site Icon Ready
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Renders in browser tabs, search engine results snippets, and bookmarks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
