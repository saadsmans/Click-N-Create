import React, { useState, useEffect } from 'react';
import { Eye, Check, X, SlidersHorizontal, Sparkles, Layers, RotateCcw } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { ThemeTokens } from '../types/index.ts';

interface LivePreviewBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenThemeStudio?: () => void;
}

export const LivePreviewBar: React.FC<LivePreviewBarProps> = ({ currentPath, onNavigate, onOpenThemeStudio }) => {
  const { customization, applyPreviewTokens, refreshCustomization } = useCustomization();
  const [previewTheme, setPreviewTheme] = useState<ThemeTokens | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const activePreview = sessionStorage.getItem('cnc_live_preview_theme');
      if (activePreview) {
        try {
          const parsed = JSON.parse(activePreview);
          setPreviewTheme(parsed);
          applyPreviewTokens(parsed);
        } catch {
          setPreviewTheme(null);
        }
      } else {
        setPreviewTheme(null);
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cnc_preview_update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cnc_preview_update', handleStorageChange);
    };
  }, []);

  if (!previewTheme) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cnc_active_theme', JSON.stringify(previewTheme));
        sessionStorage.removeItem('cnc_live_preview_theme');
      }

      await fetch('/api/customization/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: previewTheme }),
      });

      const token = localStorage.getItem('saad_admin_token') || '';
      if (token) {
        await fetch('/api/customization', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ theme: previewTheme }),
        });
      }

      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        setPreviewTheme(null);
        refreshCustomization();
      }, 1500);
    } catch (err) {
      console.warn('Error publishing theme:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRevert = () => {
    sessionStorage.removeItem('cnc_live_preview_theme');
    setPreviewTheme(null);
    refreshCustomization();
    window.dispatchEvent(new Event('cnc_preview_update'));
  };

  const pages = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Estimator', path: '/estimator' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-[#070712]/95 border-b-2 border-[#00F0FF] shadow-[0_4px_30px_rgba(0,240,255,0.4)] backdrop-blur-2xl text-white px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Preview Status & Current Theme Metadata */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] font-bold">
            <Eye className="w-3.5 h-3.5 animate-pulse" />
            <span className="uppercase tracking-wider">LIVE PREVIEW ACTIVE</span>
          </div>

          <span className="font-bold text-white tracking-wide">
            {previewTheme.presetName || 'Custom Theme'}
          </span>

          <span className="hidden lg:inline text-zinc-500">|</span>

          {/* Architecture badges */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span className="px-2 py-0.5 rounded bg-white/10 text-cyan-300">
              Header: {previewTheme.headerStyle?.replace(/_/g, ' ') || 'floating glass'}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-purple-300">
              Dropdown: {previewTheme.dropdownStyle?.replace(/_/g, ' ') || 'glass blur'}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300">
              Footer: {previewTheme.footerStyle?.replace(/_/g, ' ') || 'modern columns'}
            </span>
          </div>
        </div>

        {/* Center: Rapid Page Switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
          <span className="text-[10px] text-zinc-500 px-1.5 uppercase font-bold">Inspect:</span>
          {pages.map((p) => {
            const isCurrent = currentPath === p.path;
            return (
              <button
                key={p.path}
                type="button"
                onClick={() => onNavigate(p.path)}
                className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#00F0FF] text-black font-bold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onOpenThemeStudio) {
                onOpenThemeStudio();
              } else {
                onNavigate('/admin');
              }
            }}
            className="px-2.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 text-[11px] cursor-pointer"
            title="Open 100 Themes & 115 Fonts Studio"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span className="hidden sm:inline">Theme Studio (100)</span>
          </button>

          <button
            type="button"
            onClick={handleRevert}
            className="px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-all flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-lg bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{publishSuccess ? '✓ Published!' : isPublishing ? 'Publishing...' : 'Publish Live'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
