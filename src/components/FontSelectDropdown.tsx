import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Type, ChevronDown, Search, Check, Sparkles, X } from 'lucide-react';
import { FONT_CATALOG, FontOption, loadGoogleFont } from '../data/themeCatalog.ts';

interface FontSelectDropdownProps {
  label: string;
  value: string;
  target?: 'display' | 'sans' | 'mono';
  onChange: (family: string) => void;
  isDark?: boolean;
  filterCategories?: string[];
}

export const FontSelectDropdown: React.FC<FontSelectDropdownProps> = ({
  label,
  value,
  target = 'display',
  onChange,
  isDark = true,
  filterCategories,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ['All', 'Display', 'Sans-Serif', 'Serif', 'Monospace', 'Futuristic'];

  const filteredFonts = FONT_CATALOG.filter((f) => {
    if (filterCategories && filterCategories.length > 0 && selectedCategory === 'All') {
      if (!filterCategories.includes(f.category)) return false;
    }
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      f.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (family: string) => {
    loadGoogleFont(family);
    onChange(family);
    setIsOpen(false);
  };

  return (
    <div className="relative font-mono text-xs" ref={dropdownRef}>
      <label className="block text-xs font-mono text-zinc-400 mb-1.5 font-medium">
        {label}
      </label>

      {/* Selected Font Trigger Button with Prominent Font Style Preview */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left cursor-pointer ${
          isOpen
            ? 'border-[#00F0FF] ring-2 ring-[#00F0FF]/30'
            : isDark
            ? 'border-white/10 bg-black/50 hover:border-cyan-400/50 hover:bg-black/70'
            : 'border-zinc-300 bg-white hover:border-cyan-500 hover:shadow-xs'
        }`}
        aria-expanded={isOpen}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
              <Type className="w-3 h-3" />
              <span>Active Font:</span>
            </span>
            <span className="text-[10px] text-zinc-400">({filteredFonts.find(f => f.family === value)?.category || 'Selected'})</span>
          </div>

          {/* Font Name rendered in its OWN font style look */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className={`text-lg sm:text-xl font-bold tracking-tight truncate ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}
              style={{ fontFamily: `'${value}', sans-serif` }}
            >
              {value}
            </span>

            {/* Sample preview of its unique style */}
            <span
              className="text-xs text-cyan-400 truncate max-w-[200px]"
              style={{ fontFamily: `'${value}', sans-serif` }}
            >
              Aa Bb Gg 123 · Style Look
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-zinc-400">
          <span className="text-[10px] hidden sm:inline text-zinc-500">Change (100+)</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#00F0FF]' : ''
            }`}
          />
        </div>
      </button>

      {/* 100+ Fonts Interactive Selection Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-2xl ${
              isDark
                ? 'bg-[#0A0A16]/98 border-cyan-500/30 text-white'
                : 'bg-white/98 border-zinc-300 text-zinc-950'
            }`}
            style={{ width: 'min(100vw - 2rem, 520px)', maxWidth: '520px' }}
          >
            {/* Header: Title & Search Bar */}
            <div className="p-3.5 border-b border-black/10 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-cyan-400 uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Choose From 100+ Typographic Fonts</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {filteredFonts.length} of {FONT_CATALOG.length} fonts
                </span>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search font by name (e.g. Syne, Outfit, Inter, Clash)..."
                  className={`w-full pl-8 pr-8 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                    isDark
                      ? 'bg-black/60 border-white/15 text-white placeholder:text-zinc-500'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-950 placeholder:text-zinc-400'
                  }`}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#00F0FF] text-black font-bold border-[#00F0FF]'
                        : isDark
                        ? 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                        : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Font Options List (Each row displays font name in its own style + sample preview) */}
            <div className="max-h-[340px] overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
              {filteredFonts.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs font-mono">
                  No fonts match "{searchQuery}"
                </div>
              ) : (
                filteredFonts.map((font) => {
                  const isSelected = font.family === value;

                  return (
                    <button
                      key={font.family}
                      type="button"
                      onClick={() => handleSelect(font.family)}
                      className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white shadow-xs'
                            : 'border-cyan-600 bg-cyan-50 text-cyan-950 font-bold shadow-xs'
                          : isDark
                          ? 'border-white/5 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-white/5 text-zinc-300 hover:text-white'
                          : 'border-zinc-100 bg-white hover:border-cyan-400 hover:bg-cyan-50/50 text-zinc-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        {/* Font Name rendered in its own unique font style look */}
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-base sm:text-lg font-bold tracking-tight truncate ${
                              isSelected
                                ? 'text-[#00F0FF]'
                                : isDark
                                ? 'text-white group-hover:text-cyan-300'
                                : 'text-zinc-950 group-hover:text-cyan-700'
                            }`}
                            style={{ fontFamily: `'${font.family}', sans-serif` }}
                          >
                            {font.family}
                          </span>

                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 font-mono">
                            {font.category}
                          </span>
                        </div>

                        {/* Sample preview of its unique style */}
                        <div
                          className="text-xs sm:text-sm font-semibold tracking-wide truncate text-zinc-400 group-hover:text-zinc-200"
                          style={{ fontFamily: `'${font.family}', sans-serif` }}
                        >
                          Aa Bb Gg Rr 12345 · The quick brown fox jumps
                        </div>
                      </div>

                      {/* Right Checkmark / Select Action */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#00F0FF] text-black flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
                            Select →
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with hint */}
            <div className="p-2.5 border-t border-black/10 dark:border-white/10 bg-black/20 dark:bg-white/[0.02] flex items-center justify-between text-[10px] text-zinc-400">
              <span>Click any font to apply & preview instantly</span>
              <span className="font-bold text-cyan-400">115 Total Fonts Loaded</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
