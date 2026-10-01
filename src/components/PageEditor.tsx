import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layout,
  Save,
  RefreshCw,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  Sparkles,
  Type,
  Layers,
  HelpCircle,
  Briefcase,
  FolderGit2,
  DollarSign,
  Phone,
  ShieldCheck,
  FileText,
  Search,
  Check,
  ArrowRight,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  Palette,
  Info,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';

interface PageEditorProps {
  onNavigate: (path: string) => void;
}

export type PageId =
  | 'home'
  | 'services'
  | 'portfolio'
  | 'pricing'
  | 'estimator'
  | 'about'
  | 'process'
  | 'standards'
  | 'faq'
  | 'contact'
  | 'terms'
  | 'privacy';

interface PageMeta {
  id: PageId;
  name: string;
  path: string;
  category: 'core' | 'commercial' | 'company' | 'legal';
  description: string;
  icon: any;
}

const PAGES_CATALOG: PageMeta[] = [
  { id: 'home', name: 'Home Landing Page', path: '/', category: 'core', description: 'Hero banner, 4 stats metrics, value props, services preview', icon: Layout },
  { id: 'services', name: 'Services & Capabilities', path: '/services', category: 'commercial', description: '6 full service cards with deliverables, pricing, turnaround', icon: Briefcase },
  { id: 'portfolio', name: 'Portfolio & Case Studies', path: '/portfolio', category: 'core', description: 'Curated commercial client builds, metrics, tags, and live links', icon: FolderGit2 },
  { id: 'pricing', name: 'Pricing & Packages', path: '/pricing', category: 'commercial', description: '£35/hr transparent rate breakdown and 3 client launch packages', icon: DollarSign },
  { id: 'estimator', name: 'Interactive Estimator', path: '/estimator', category: 'commercial', description: '3-step instant price calculation tool headlines and copy', icon: Sliders },
  { id: 'about', name: 'About Saad M', path: '/about', category: 'company', description: 'Developer biography, engineering principles, and tech stack tags', icon: Type },
  { id: 'process', name: 'Development Process', path: '/process', category: 'company', description: '4-stage project workflow: Discovery, Design, Build, Launch', icon: Layers },
  { id: 'standards', name: 'Standards & Guarantees', path: '/standards', category: 'company', description: 'Performance, mobile responsiveness, and code ownership guarantees', icon: ShieldCheck },
  { id: 'faq', name: 'Frequently Asked Questions', path: '/faq', category: 'company', description: 'Interactive Q&A accordion items, rates, and timelines', icon: HelpCircle },
  { id: 'contact', name: 'Contact & Inbound', path: '/contact', category: 'core', description: 'Direct contact info, WhatsApp number, email, and availability status', icon: Phone },
  { id: 'terms', name: 'Terms of Service', path: '/terms', category: 'legal', description: 'Client agreement, payment terms, and 100% code ownership policy', icon: FileText },
  { id: 'privacy', name: 'Privacy Policy', path: '/privacy', category: 'legal', description: 'Data privacy, security standards, and zero third-party tracking', icon: ShieldCheck },
];

export const PageEditor: React.FC<PageEditorProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { customization, getPageContent, updatePageContent, resetPageContent, importPagesJson } = useCustomization();

  // Active page selector
  const [selectedPageId, setSelectedPageId] = useState<PageId>('home');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Local working copy for the active page
  const [formData, setFormData] = useState<any>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'sections' | 'seo' | 'preview'>('hero');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Load active page data into state when page selection changes or customization updates
  useEffect(() => {
    const content = getPageContent(selectedPageId);
    if (content) {
      setFormData(JSON.parse(JSON.stringify(content)));
      setIsDirty(false);
    }
  }, [selectedPageId, customization.pages]);

  const activeMeta = PAGES_CATALOG.find((p) => p.id === selectedPageId) || PAGES_CATALOG[0];

  // Field change handler
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
    setSaveSuccess(false);
  };

  // Nested array item change
  const handleNestedItemChange = (arrayKey: string, index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const arr = Array.isArray(prev[arrayKey]) ? [...prev[arrayKey]] : [];
      if (arr[index]) {
        arr[index] = { ...arr[index], [field]: value };
      }
      return { ...prev, [arrayKey]: arr };
    });
    setIsDirty(true);
  };

  // Add array item
  const handleAddArrayItem = (arrayKey: string, template: any) => {
    setFormData((prev: any) => {
      const arr = Array.isArray(prev[arrayKey]) ? [...prev[arrayKey]] : [];
      return { ...prev, [arrayKey]: [...arr, template] };
    });
    setIsDirty(true);
  };

  // Remove array item
  const handleRemoveArrayItem = (arrayKey: string, index: number) => {
    setFormData((prev: any) => {
      const arr = Array.isArray(prev[arrayKey]) ? [...prev[arrayKey]] : [];
      arr.splice(index, 1);
      return { ...prev, [arrayKey]: arr };
    });
    setIsDirty(true);
  };

  // Save handler
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setStatusMessage('Saving & deploying changes...');
      const ok = await updatePageContent(selectedPageId, formData);
      if (ok) {
        setIsDirty(false);
        setSaveSuccess(true);
        setStatusMessage('Page published successfully to live website!');
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setStatusMessage('Error updating page. Check console.');
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default copy
  const handleReset = async () => {
    if (confirm(`Reset all content of "${activeMeta.name}" to factory defaults?`)) {
      setIsSaving(true);
      await resetPageContent(selectedPageId);
      setIsSaving(false);
      setIsDirty(false);
      setStatusMessage('Page copy reset to original defaults.');
    }
  };

  // Export page JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${selectedPageId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import page JSON
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormData(parsed);
      setIsDirty(true);
      setShowJsonModal(false);
      setStatusMessage('JSON imported into editor. Click Save & Publish to apply.');
    } catch (e) {
      alert('Invalid JSON format. Please verify syntax.');
    }
  };

  const filteredCatalog = PAGES_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ================= TOP COMMAND BAR ================= */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isDark ? 'bg-[#080814]/90 border-white/10 shadow-lg' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  Visual Page Editor & CMS
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
                {isDirty && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    Unsaved Edits
                  </span>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Edit all headlines, subtitles, badges, buttons, cards, and text across every website page in real-time.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Viewport switcher */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-100 border-zinc-200'
            }`}>
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                title="Desktop View (100%)"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewportMode === 'desktop'
                    ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white text-cyan-600 shadow-xs'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('tablet')}
                title="Tablet View (768px)"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewportMode === 'tablet'
                    ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white text-cyan-600 shadow-xs'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                title="Mobile View (375px)"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewportMode === 'mobile'
                    ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white text-cyan-600 shadow-xs'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* View Live */}
            <button
              type="button"
              onClick={() => onNavigate(activeMeta.path)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isDark
                  ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className={`p-2 rounded-xl border text-xs transition-all ${
                isDark
                  ? 'border-white/10 bg-white/5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-rose-600 hover:bg-rose-50'
              }`}
              title="Reset to default copy"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJson}
              className={`p-2 rounded-xl border text-xs transition-all ${
                isDark
                  ? 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900'
              }`}
              title="Export Page JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Import JSON */}
            <button
              type="button"
              onClick={() => {
                setJsonInput(JSON.stringify(formData, null, 2));
                setShowJsonModal(true);
              }}
              className={`p-2 rounded-xl border text-xs transition-all ${
                isDark
                  ? 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900'
              }`}
              title="Import JSON"
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Primary Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : isDirty
                  ? 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110'
                  : isDark
                  ? 'bg-white/10 text-white hover:bg-white/15'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved Live!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Publish</span>
                </>
              )}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Info className="w-3.5 h-3.5" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* ================= PAGE SELECTOR CAROUSEL / GRID ================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Select Page To Edit ({PAGES_CATALOG.length} Pages Available):
            </span>
          </div>
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter pages..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className={`w-full pl-8 pr-3 py-1 text-xs rounded-xl border transition-all ${
                isDark
                  ? 'bg-black/40 border-white/10 text-white placeholder-zinc-500'
                  : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {filteredCatalog.map((page) => {
            const isSelected = selectedPageId === page.id;
            const PageIcon = page.icon;

            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setSelectedPageId(page.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-cyan-50 border-cyan-500 text-zinc-950 shadow-xs'
                    : isDark
                    ? 'bg-[#080814]/60 border-white/5 text-zinc-300 hover:border-white/20 hover:bg-[#0c0c1e]'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : isDark
                      ? 'bg-white/5 text-zinc-400 group-hover:text-cyan-400'
                      : 'bg-zinc-100 text-zinc-500 group-hover:text-cyan-600'
                  }`}>
                    <PageIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 truncate">
                    {page.path}
                  </span>
                </div>
                <div className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-400' : ''}`}>
                  {page.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN SPLIT WORKSPACE: EDITOR & LIVE PREVIEW ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Subtabs for Section Switcher */}
          <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 ${
            isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-zinc-100 border-zinc-200'
          }`}>
            <button
              type="button"
              onClick={() => setActiveSubTab('hero')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeSubTab === 'hero'
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'bg-white text-cyan-700 border border-cyan-200 shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hero & Headlines</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('sections')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeSubTab === 'sections'
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'bg-white text-cyan-700 border border-cyan-200 shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Content & Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('seo')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeSubTab === 'seo'
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'bg-white text-cyan-700 border border-cyan-200 shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Page SEO Preview</span>
            </button>
          </div>

          {/* TAB 1: HERO & MAIN HEADLINES */}
          {activeSubTab === 'hero' && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
              isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${
                    isDark ? 'text-cyan-400' : 'text-cyan-700'
                  }`}>
                    Hero Banner Configuration · /{selectedPageId}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Define the primary hook, highlighted phrases, and top call-to-actions.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                  Route: {activeMeta.path}
                </span>
              </div>

              {/* Badge Kicker */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Top Badge Kicker Text
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.badgeText || ''}
                    onChange={(e) => handleFieldChange('badgeText', e.target.value)}
                    placeholder="e.g. DIRECT COLLABORATION WITH SAAD M · £35/HR RATE"
                    className={`flex-1 px-3 py-2 text-xs rounded-xl border transition-all font-mono ${
                      isDark
                        ? 'bg-black/50 border-white/10 text-white focus:border-cyan-400'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-cyan-600'
                    }`}
                  />
                </div>
              </div>

              {/* Main Headline Title */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Main Headline (Primary Title)
                </label>
                <input
                  type="text"
                  value={formData.heroTitle || ''}
                  onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                  placeholder="e.g. WEBSITES & ONLINE SHOPS"
                  className={`w-full px-3 py-2 text-sm font-bold font-display rounded-xl border transition-all ${
                    isDark
                      ? 'bg-black/50 border-white/10 text-white focus:border-cyan-400'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              {/* Highlight Phrase */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Gradient Highlight Text (Appears in glowing gradient)
                </label>
                <input
                  type="text"
                  value={formData.heroHighlight || ''}
                  onChange={(e) => handleFieldChange('heroHighlight', e.target.value)}
                  placeholder="e.g. THAT GET YOU CUSTOMERS."
                  className={`w-full px-3 py-2 text-sm font-bold font-display rounded-xl border transition-all text-cyan-400 ${
                    isDark
                      ? 'bg-black/50 border-white/10 focus:border-cyan-400'
                      : 'bg-zinc-50 border-zinc-300 focus:border-cyan-600'
                  }`}
                />
              </div>

              {/* Subtitle / Lead Paragraph */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Hero Subtitle / Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formData.heroSubtitle || ''}
                  onChange={(e) => handleFieldChange('heroSubtitle', e.target.value)}
                  placeholder="Compelling introductory paragraph..."
                  className={`w-full px-3 py-2 text-xs rounded-xl border transition-all leading-relaxed ${
                    isDark
                      ? 'bg-black/50 border-white/10 text-zinc-200 focus:border-cyan-400'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              {/* Call to Actions (CTAs) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.primaryCtaText || ''}
                    onChange={(e) => handleFieldChange('primaryCtaText', e.target.value)}
                    placeholder="e.g. START A PROJECT"
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                  <input
                    type="text"
                    value={formData.primaryCtaLink || ''}
                    onChange={(e) => handleFieldChange('primaryCtaLink', e.target.value)}
                    placeholder="e.g. /contact"
                    className={`w-full mt-2 px-3 py-1.5 text-xs font-mono rounded-xl border ${
                      isDark ? 'bg-black/50 border-white/10 text-cyan-400' : 'bg-zinc-50 border-zinc-300 text-cyan-700'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCtaText || ''}
                    onChange={(e) => handleFieldChange('secondaryCtaText', e.target.value)}
                    placeholder="e.g. EXPLORE SERVICES"
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                  <input
                    type="text"
                    value={formData.secondaryCtaLink || ''}
                    onChange={(e) => handleFieldChange('secondaryCtaLink', e.target.value)}
                    placeholder="e.g. /services"
                    className={`w-full mt-2 px-3 py-1.5 text-xs font-mono rounded-xl border ${
                      isDark ? 'bg-black/50 border-white/10 text-cyan-400' : 'bg-zinc-50 border-zinc-300 text-cyan-700'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAGE-SPECIFIC DYNAMIC CONTENT SECTIONS */}
          {activeSubTab === 'sections' && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-6 ${
              isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${
                    isDark ? 'text-cyan-400' : 'text-cyan-700'
                  }`}>
                    Section Details · {activeMeta.name}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Customize specific items, stats, cards, and deliverables for this page.
                  </p>
                </div>
              </div>

              {/* HOME PAGE SPECIFICS: 4 LIVE METRICS & 3 VALUE PROPS */}
              {selectedPageId === 'home' && (
                <div className="space-y-5">
                  <h4 className={`text-xs font-bold uppercase font-mono tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                    4 Live Hero Stats & Proof Points
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className={`p-3 rounded-xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                        <span className="text-[10px] font-mono text-zinc-400">Metric #{num}</span>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <input
                            type="text"
                            value={formData[`stat${num}Value`] || ''}
                            onChange={(e) => handleFieldChange(`stat${num}Value`, e.target.value)}
                            placeholder="Value (e.g. £35/hr)"
                            className={`col-span-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border font-mono ${
                              isDark ? 'bg-black/60 border-white/10 text-cyan-400' : 'bg-white border-zinc-300 text-cyan-700'
                            }`}
                          />
                          <input
                            type="text"
                            value={formData[`stat${num}Label`] || ''}
                            onChange={(e) => handleFieldChange(`stat${num}Label`, e.target.value)}
                            placeholder="Label (e.g. Flat Rate)"
                            className={`col-span-2 px-2.5 py-1.5 text-xs rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className={`text-xs font-bold uppercase font-mono tracking-wider pt-3 ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                    3 Core Value Propositions
                  </h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className={`p-3 rounded-xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                            {num}
                          </span>
                          <input
                            type="text"
                            value={formData[`feature${num}Title`] || ''}
                            onChange={(e) => handleFieldChange(`feature${num}Title`, e.target.value)}
                            placeholder="Feature Title"
                            className={`flex-1 px-2.5 py-1 text-xs font-bold rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={formData[`feature${num}Desc`] || ''}
                          onChange={(e) => handleFieldChange(`feature${num}Desc`, e.target.value)}
                          placeholder="Feature Description"
                          className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                            isDark ? 'bg-black/60 border-white/10 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SERVICES PAGE: SERVICES LIST WITH DELIVERABLES */}
              {selectedPageId === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold uppercase font-mono tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                      Active Services List ({formData.servicesList?.length || 0})
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddArrayItem('servicesList', {
                          id: `srv-${Date.now()}`,
                          title: 'New Bespoke Service',
                          slug: 'new-service',
                          rate: '£35/hr or milestone package',
                          turnaround: '1 – 2 Weeks',
                          description: 'High standard commercial web engineering.',
                          deliverables: ['Custom Mobile Design', 'Google SEO Integration', 'Production Handover'],
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.servicesList || []).map((srv: any, idx: number) => (
                      <div key={srv.id || idx} className={`p-4 rounded-xl border space-y-3 ${
                        isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={srv.title || ''}
                            onChange={(e) => handleNestedItemChange('servicesList', idx, 'title', e.target.value)}
                            placeholder="Service Title"
                            className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveArrayItem('servicesList', idx)}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                            title="Remove Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={srv.rate || ''}
                            onChange={(e) => handleNestedItemChange('servicesList', idx, 'rate', e.target.value)}
                            placeholder="Rate (e.g. £35/hr or from £500)"
                            className={`px-3 py-1.5 text-xs rounded-lg border font-mono ${
                              isDark ? 'bg-black/60 border-white/10 text-cyan-400' : 'bg-white border-zinc-300 text-cyan-700'
                            }`}
                          />
                          <input
                            type="text"
                            value={srv.turnaround || ''}
                            onChange={(e) => handleNestedItemChange('servicesList', idx, 'turnaround', e.target.value)}
                            placeholder="Turnaround (e.g. 1 – 2 Weeks)"
                            className={`px-3 py-1.5 text-xs rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={srv.description || ''}
                          onChange={(e) => handleNestedItemChange('servicesList', idx, 'description', e.target.value)}
                          placeholder="Service description..."
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                            isDark ? 'bg-black/60 border-white/10 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PORTFOLIO SPECIFICS: PROJECTS LIST */}
              {selectedPageId === 'portfolio' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold uppercase font-mono tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                      Featured Projects List ({formData.projectsList?.length || 0})
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddArrayItem('projectsList', {
                          id: `proj_${Date.now()}`,
                          title: 'New Commercial Showcase',
                          client: 'Private Client UK',
                          category: 'Web Development',
                          year: '2026',
                          metric: '+250% Inbound Leads',
                          description: 'Custom responsive web application built with modern React.',
                          tags: ['React 19', 'TypeScript', 'Tailwind CSS'],
                          liveUrl: 'https://clickncreate.dev',
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.projectsList || []).map((proj: any, idx: number) => (
                      <div key={proj.id || idx} className={`p-4 rounded-xl border space-y-3 ${
                        isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={proj.title || ''}
                            onChange={(e) => handleNestedItemChange('projectsList', idx, 'title', e.target.value)}
                            placeholder="Project Title"
                            className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveArrayItem('projectsList', idx)}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={proj.client || ''}
                            onChange={(e) => handleNestedItemChange('projectsList', idx, 'client', e.target.value)}
                            placeholder="Client / Company"
                            className={`px-3 py-1.5 text-xs rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                          <input
                            type="text"
                            value={proj.category || ''}
                            onChange={(e) => handleNestedItemChange('projectsList', idx, 'category', e.target.value)}
                            placeholder="Category"
                            className={`px-3 py-1.5 text-xs rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                          <input
                            type="text"
                            value={proj.metric || ''}
                            onChange={(e) => handleNestedItemChange('projectsList', idx, 'metric', e.target.value)}
                            placeholder="Result Metric (e.g. +180% Conv.)"
                            className={`px-3 py-1.5 text-xs rounded-lg border font-mono ${
                              isDark ? 'bg-black/60 border-white/10 text-emerald-400' : 'bg-white border-zinc-300 text-emerald-700'
                            }`}
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={proj.description || ''}
                          onChange={(e) => handleNestedItemChange('projectsList', idx, 'description', e.target.value)}
                          placeholder="Project story and achievements..."
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                            isDark ? 'bg-black/60 border-white/10 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRICING SPECIFICS */}
              {selectedPageId === 'pricing' && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Standard Hourly Base Rate (£)
                    </label>
                    <input
                      type="number"
                      value={formData.hourlyRateNumber || 35}
                      onChange={(e) => handleFieldChange('hourlyRateNumber', Number(e.target.value))}
                      className={`w-32 px-3 py-1.5 text-sm font-bold font-mono rounded-xl border ${
                        isDark ? 'bg-black/50 border-white/10 text-cyan-400' : 'bg-zinc-50 border-zinc-300 text-cyan-700'
                      }`}
                    />
                  </div>

                  <div className="space-y-4 pt-3 border-t border-white/5">
                    {[1, 2, 3].map((tierNum) => (
                      <div key={tierNum} className={`p-4 rounded-xl border space-y-2 ${
                        isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center justify-center font-bold">
                            T{tierNum}
                          </span>
                          <input
                            type="text"
                            value={formData[`tier${tierNum}Title`] || ''}
                            onChange={(e) => handleFieldChange(`tier${tierNum}Title`, e.target.value)}
                            placeholder={`Tier ${tierNum} Title`}
                            className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                          <input
                            type="text"
                            value={formData[`tier${tierNum}Price`] || ''}
                            onChange={(e) => handleFieldChange(`tier${tierNum}Price`, e.target.value)}
                            placeholder="Price Range (e.g. £500 – £950)"
                            className={`w-40 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-cyan-400' : 'bg-white border-zinc-300 text-cyan-700'
                            }`}
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={formData[`tier${tierNum}Desc`] || ''}
                          onChange={(e) => handleFieldChange(`tier${tierNum}Desc`, e.target.value)}
                          placeholder="Tier package summary..."
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                            isDark ? 'bg-black/60 border-white/10 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABOUT SAAD M SPECIFICS */}
              {selectedPageId === 'about' && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Bio Paragraph 1 (Background & Mission)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bioParagraph1 || ''}
                      onChange={(e) => handleFieldChange('bioParagraph1', e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Bio Paragraph 2 (Technical Mastery & Full-Stack Stack)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bioParagraph2 || ''}
                      onChange={(e) => handleFieldChange('bioParagraph2', e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Engineering Principles Headline & Details
                    </label>
                    <input
                      type="text"
                      value={formData.approachTitle || ''}
                      onChange={(e) => handleFieldChange('approachTitle', e.target.value)}
                      className={`w-full px-3 py-1.5 text-xs font-bold rounded-xl border mb-2 ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                    <textarea
                      rows={2}
                      value={formData.approachText || ''}
                      onChange={(e) => handleFieldChange('approachText', e.target.value)}
                      className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                        isDark ? 'bg-black/50 border-white/10 text-zinc-300' : 'bg-zinc-50 border-zinc-300 text-zinc-700'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* FAQ ITEMS MANAGER */}
              {selectedPageId === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold uppercase font-mono tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                      FAQ Accordion Questions ({formData.faqsList?.length || 0})
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddArrayItem('faqsList', {
                          id: `faq-${Date.now()}`,
                          question: 'New Question regarding project scope or rate?',
                          answer: 'Clear, transparent explanation with zero ambiguity.',
                          category: 'General',
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.faqsList || []).map((faq: any, idx: number) => (
                      <div key={faq.id || idx} className={`p-4 rounded-xl border space-y-2.5 ${
                        isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={faq.question || ''}
                            onChange={(e) => handleNestedItemChange('faqsList', idx, 'question', e.target.value)}
                            placeholder="Question"
                            className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                              isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveArrayItem('faqsList', idx)}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={faq.answer || ''}
                          onChange={(e) => handleNestedItemChange('faqsList', idx, 'answer', e.target.value)}
                          placeholder="Answer..."
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                            isDark ? 'bg-black/60 border-white/10 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACT PAGE SPECIFICS */}
              {selectedPageId === 'contact' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      WhatsApp Direct Number
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappNumber || ''}
                      onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)}
                      placeholder="+44 7927 548123"
                      className={`w-full px-3 py-1.5 text-xs font-mono rounded-xl border ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Personal Direct Email
                    </label>
                    <input
                      type="text"
                      value={formData.emailAddress || ''}
                      onChange={(e) => handleFieldChange('emailAddress', e.target.value)}
                      placeholder="Mansurisaad28012@gmail.com"
                      className={`w-full px-3 py-1.5 text-xs font-mono rounded-xl border ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Availability Status Text
                    </label>
                    <input
                      type="text"
                      value={formData.availabilityText || ''}
                      onChange={(e) => handleFieldChange('availabilityText', e.target.value)}
                      placeholder="Rate: £35/hr · Open for 2026 Projects"
                      className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                        isDark ? 'bg-black/50 border-white/10 text-cyan-400' : 'bg-zinc-50 border-zinc-300 text-cyan-700'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* PROCESS PAGE SPECIFICS */}
              {selectedPageId === 'process' && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <div key={stepNum} className={`p-4 rounded-xl border space-y-2 ${
                      isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center justify-center font-bold">
                          0{stepNum}
                        </span>
                        <input
                          type="text"
                          value={formData[`step${stepNum}Title`] || ''}
                          onChange={(e) => handleFieldChange(`step${stepNum}Title`, e.target.value)}
                          placeholder={`Step 0${stepNum} Title`}
                          className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                            isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                          }`}
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={formData[`step${stepNum}Desc`] || ''}
                        onChange={(e) => handleFieldChange(`step${stepNum}Desc`, e.target.value)}
                        placeholder={`Step 0${stepNum} description...`}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                          isDark ? 'bg-black/60 border-white/10 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* STANDARDS PAGE SPECIFICS */}
              {selectedPageId === 'standards' && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className={`p-3 rounded-xl border flex items-center gap-3 ${
                      isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <input
                        type="text"
                        value={formData[`guarantee${num}`] || ''}
                        onChange={(e) => handleFieldChange(`guarantee${num}`, e.target.value)}
                        placeholder={`Guarantee #${num}`}
                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg border ${
                          isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SEO PREVIEW & META OVERRIDES */}
          {activeSubTab === 'seo' && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
              isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <div className="pb-3 border-b border-white/5">
                <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'text-cyan-400' : 'text-cyan-700'
                }`}>
                  Google Search Snippet Preview · {activeMeta.name}
                </h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Live preview of how this specific page appears in Google search engine results.
                </p>
              </div>

              {/* Mock Google Result Card */}
              <div className="p-4 rounded-xl border border-zinc-700/40 bg-black/60 font-sans max-w-xl">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-[9px] font-bold">
                    C
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono truncate">
                    https://clickncreate.dev{activeMeta.path}
                  </span>
                </div>
                <h4 className="text-base text-cyan-400 font-medium hover:underline cursor-pointer truncate">
                  {formData.heroTitle || activeMeta.name} | Click N Create · Saad M
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                  {formData.heroSubtitle || activeMeta.description} Direct freelance web developer collaboration at £35/hr.
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sitemap Priority: {selectedPageId === 'home' ? '1.0 (Maximum)' : '0.8'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Canonical URL automatically configured: https://clickncreate.dev{activeMeta.path}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Device Frame Preview (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Real-Time Viewport Preview ({viewportMode})
            </span>
            <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
              ● Live Updates As You Type
            </span>
          </div>

          {/* Interactive Simulated Device Chassis */}
          <div className={`p-4 rounded-2xl border transition-all flex justify-center ${
            isDark ? 'bg-[#05050c] border-white/10' : 'bg-slate-100 border-zinc-300'
          }`}>
            <div
              className={`transition-all duration-300 rounded-xl overflow-hidden border shadow-2xl ${
                viewportMode === 'mobile'
                  ? 'w-[340px] min-h-[580px]'
                  : viewportMode === 'tablet'
                  ? 'w-[480px] min-h-[580px]'
                  : 'w-full min-h-[580px]'
              } ${isDark ? 'bg-[#07070F] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-950'}`}
            >
              {/* Simulated Browser Bar */}
              <div className={`px-3 py-2 border-b flex items-center justify-between text-[10px] font-mono ${
                isDark ? 'bg-black/60 border-white/10 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>
                <span className="truncate max-w-[200px] text-zinc-400">
                  clickncreate.dev{activeMeta.path}
                </span>
                <span className="w-2" />
              </div>

              {/* Simulated Live Page Content */}
              <div className="p-4 sm:p-6 space-y-5 text-center">
                {/* Badge */}
                {formData.badgeText && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-[10px] font-mono text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{formData.badgeText}</span>
                  </div>
                )}

                {/* Main Headline */}
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight leading-tight">
                    {formData.heroTitle || activeMeta.name}{' '}
                    {formData.heroHighlight && (
                      <span className="text-cyber-gradient block sm:inline">
                        {formData.heroHighlight}
                      </span>
                    )}
                  </h1>
                </div>

                {/* Subtitle */}
                {formData.heroSubtitle && (
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    {formData.heroSubtitle}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {formData.primaryCtaText && (
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-[#00F0FF] text-black font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                    >
                      {formData.primaryCtaText}
                    </button>
                  )}
                  {formData.secondaryCtaText && (
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/5 text-xs font-semibold text-zinc-200"
                    >
                      {formData.secondaryCtaText}
                    </button>
                  )}
                </div>

                {/* Dynamic Preview Section based on page */}
                {selectedPageId === 'home' && (
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5 text-left">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="text-xs font-bold font-mono text-cyan-400">
                          {formData[`stat${num}Value`] || '—'}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">
                          {formData[`stat${num}Label`] || `Stat #${num}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedPageId === 'pricing' && (
                  <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{formData.tier1Title || 'Essential Launch'}</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{formData.tier1Price || '£500 – £950'}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">{formData.tier1Desc || 'Ideal for starter websites.'}</p>
                  </div>
                )}

                {selectedPageId === 'services' && (
                  <div className="space-y-2 pt-2 text-left">
                    {(formData.servicesList || []).slice(0, 2).map((srv: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{srv.title}</span>
                          <span className="text-[10px] font-mono text-cyan-400">{srv.rate}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{srv.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedPageId === 'faq' && (
                  <div className="space-y-2 pt-2 text-left">
                    {(formData.faqsList || []).slice(0, 2).map((faq: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                        <div className="text-xs font-semibold text-cyan-300">Q: {faq.question}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-2">A: {faq.answer}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= JSON IMPORT MODAL ================= */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-xl p-6 rounded-2xl border ${
            isDark ? 'bg-[#080814] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-950 shadow-2xl'
          }`}>
            <h3 className="text-base font-bold font-display mb-2">Import Page Configuration (JSON)</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Paste a custom page configuration JSON below to populate this editor.
            </p>
            <textarea
              rows={12}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className={`w-full p-3 font-mono text-xs rounded-xl border ${
                isDark ? 'bg-black/60 border-white/10 text-cyan-300' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
              }`}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 rounded-xl text-xs border border-white/10 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00F0FF] text-black hover:brightness-110"
              >
                Apply JSON to Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
