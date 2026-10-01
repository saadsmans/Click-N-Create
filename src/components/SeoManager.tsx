import React, { useState } from 'react';
import {
  Globe,
  Search,
  Share2,
  Code2,
  FileCode,
  CheckCircle,
  Save,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { SeoConfig } from '../types/index.ts';

interface SeoManagerProps {
  seoConfig: SeoConfig;
  onSave: (updated: SeoConfig) => Promise<void>;
}

export const SeoManager: React.FC<SeoManagerProps> = ({ seoConfig, onSave }) => {
  const [draft, setDraft] = useState<SeoConfig>(seoConfig);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'global' | 'pages' | 'schema' | 'sitemap'>('global');
  const [previewPage, setPreviewPage] = useState<string>('/');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(draft);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const currentPreviewData =
    draft.pages[previewPage] || {
      title: draft.siteTitle,
      description: draft.siteDescription,
      keywords: draft.defaultKeywords,
    };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'global', label: 'Global Metadata & Cards', icon: Globe },
            { id: 'pages', label: 'Per-Page SEO Overrides', icon: Layers },
            { id: 'schema', label: 'Schema.org JSON-LD', icon: Code2 },
            { id: 'sitemap', label: 'Sitemap & Robots.txt', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white border border-zinc-200/80 dark:border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{savedSuccess ? 'SEO Settings Saved!' : 'Save SEO Configuration'}</span>
        </button>
      </div>

      {/* SUB TAB 1: GLOBAL METADATA */}
      {activeSubTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-7 space-y-4 p-6 rounded-3xl border border-white/10 bg-[#080816] text-xs font-mono">
            <h3 className="text-sm font-bold font-display text-white">Global Meta Tags & OpenGraph</h3>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">Global Site Title</label>
              <input
                type="text"
                value={draft.siteTitle}
                onChange={(e) => setDraft({ ...draft, siteTitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">Meta Title Template</label>
              <input
                type="text"
                value={draft.titleTemplate}
                onChange={(e) => setDraft({ ...draft, titleTemplate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
              />
              <span className="text-[10px] text-zinc-500">Use %s for dynamic page title placeholder</span>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">
                Meta Description ({draft.siteDescription?.length || 0} / 160 characters)
              </label>
              <textarea
                rows={3}
                value={draft.siteDescription}
                onChange={(e) => setDraft({ ...draft, siteDescription: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">Canonical Site URL</label>
              <input
                type="url"
                value={draft.siteUrl}
                onChange={(e) => setDraft({ ...draft, siteUrl: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 uppercase mb-1">Twitter / X Handle</label>
                <input
                  type="text"
                  value={draft.twitterHandle}
                  onChange={(e) => setDraft({ ...draft, twitterHandle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">Google Site Verification</label>
                <input
                  type="text"
                  value={draft.googleSiteVerification || ''}
                  onChange={(e) => setDraft({ ...draft, googleSiteVerification: e.target.value })}
                  placeholder="Verification ID"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">Default OpenGraph Share Image URL</label>
              <input
                type="url"
                value={draft.defaultOgImage}
                onChange={(e) => setDraft({ ...draft, defaultOgImage: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
              />
            </div>
          </div>

          {/* Right Live Previews */}
          <div className="lg:col-span-5 space-y-4">
            {/* Google Search SERP Snippet Preview */}
            <div className="p-5 rounded-3xl border border-white/10 bg-[#080816] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase font-bold">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Search SERP Preview</span>
              </div>

              <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-md font-sans text-left space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
                    C
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-slate-800">Click N Create</span>
                    <span className="text-slate-400"> › </span>
                    <span className="text-slate-500">{draft.siteUrl?.replace('https://', '')}</span>
                  </div>
                </div>

                <div className="text-blue-700 hover:underline text-base font-semibold leading-snug cursor-pointer line-clamp-1">
                  {draft.siteTitle}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {draft.siteDescription}
                </p>
              </div>
            </div>

            {/* Social Share Card Preview */}
            <div className="p-5 rounded-3xl border border-white/10 bg-[#080816] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase font-bold">
                <Share2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Social Card Preview (WhatsApp / X / LinkedIn)</span>
              </div>

              <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/50 text-left">
                {draft.defaultOgImage && (
                  <div className="h-36 w-full overflow-hidden bg-zinc-900 relative">
                    <img
                      src={draft.defaultOgImage}
                      alt="Social Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-3.5 space-y-1 font-mono text-xs">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                    {draft.siteUrl?.replace('https://', '').toUpperCase()}
                  </span>
                  <div className="font-bold text-white text-sm line-clamp-1">{draft.siteTitle}</div>
                  <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">
                    {draft.siteDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: PER-PAGE SEO OVERRIDES */}
      {activeSubTab === 'pages' && (
        <div className="space-y-4 p-6 rounded-3xl border border-white/10 bg-[#080816]">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold font-display text-white">Custom Per-Page SEO Tags</h3>
              <p className="text-xs font-mono text-zinc-500">
                Optimize individual page titles, descriptions, and keywords for search engine ranking.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(draft.pages || {}).map(([route, page]: [string, any]) => (
              <div
                key={route}
                className="p-5 rounded-2xl border border-white/10 bg-black/30 space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#00F0FF]">{route}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Page Route</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Page Title Tag</label>
                    <input
                      type="text"
                      value={page.title || ''}
                      onChange={(e) => {
                        const updatedPages = { ...draft.pages };
                        updatedPages[route] = { ...page, title: e.target.value };
                        setDraft({ ...draft, pages: updatedPages });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/50 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={(page.keywords || []).join(', ')}
                      onChange={(e) => {
                        const updatedPages = { ...draft.pages };
                        updatedPages[route] = {
                          ...page,
                          keywords: e.target.value.split(',').map((k: string) => k.trim()),
                        };
                        setDraft({ ...draft, pages: updatedPages });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/50 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 uppercase mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={page.description || ''}
                      onChange={(e) => {
                        const updatedPages = { ...draft.pages };
                        updatedPages[route] = { ...page, description: e.target.value };
                        setDraft({ ...draft, pages: updatedPages });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/50 text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: SCHEMA.ORG JSON-LD */}
      {activeSubTab === 'schema' && (
        <div className="p-6 rounded-3xl border border-white/10 bg-[#080816] space-y-6 font-mono text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold font-display text-white">Schema.org Structured Data (JSON-LD)</h3>
              <p className="text-zinc-500">
                Injected into &lt;script type="application/ld+json"&gt; for Google Rich Results, star snippets, and knowledge panels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 uppercase mb-1">Schema Type</label>
              <select
                value={draft.jsonLdType}
                onChange={(e) => setDraft({ ...draft, jsonLdType: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
              >
                <option value="ProfessionalService">ProfessionalService (Recommended)</option>
                <option value="Organization">Organization</option>
                <option value="Person">Person (Freelancer)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">Brand / Studio Name</label>
              <input
                type="text"
                value={draft.companyLegalName}
                onChange={(e) => setDraft({ ...draft, companyLegalName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">Founder / Lead Engineer</label>
              <input
                type="text"
                value={draft.founderName}
                onChange={(e) => setDraft({ ...draft, founderName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">Price Range / Rate</label>
              <input
                type="text"
                value={draft.priceRange}
                onChange={(e) => setDraft({ ...draft, priceRange: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-400 uppercase mb-1">Service Geography</label>
              <input
                type="text"
                value={draft.serviceArea}
                onChange={(e) => setDraft({ ...draft, serviceArea: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white"
              />
            </div>
          </div>

          <div>
            <span className="block text-zinc-400 uppercase mb-2 font-bold">Generated JSON-LD Output Preview:</span>
            <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 text-[#00F0FF] overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(
                {
                  '@context': 'https://schema.org',
                  '@type': draft.jsonLdType,
                  name: draft.companyLegalName,
                  alternateName: 'Click N Create',
                  founder: {
                    '@type': 'Person',
                    name: draft.founderName,
                    jobTitle: 'Lead Full-Stack Web Developer & Designer',
                    email: 'Mansurisaad28012@gmail.com',
                  },
                  url: draft.siteUrl,
                  description: draft.siteDescription,
                  priceRange: draft.priceRange,
                  areaServed: draft.serviceArea,
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Web Engineering & Digital Services',
                    itemListElement: [
                      { '@type': 'Offer', name: 'Custom React Web Development', price: '35', priceCurrency: 'GBP' },
                      { '@type': 'Offer', name: 'E-commerce Shopify Storefronts', price: '35', priceCurrency: 'GBP' },
                      { '@type': 'Offer', name: 'Brand Identity & Logo Design', price: '35', priceCurrency: 'GBP' },
                    ],
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* SUB TAB 4: SITEMAP & ROBOTS.TXT */}
      {activeSubTab === 'sitemap' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
          {/* Sitemap.xml */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#080816] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold font-display text-white">XML Sitemap Index</h4>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-[#00F0FF] hover:underline flex items-center gap-1"
              >
                <span>/sitemap.xml</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-zinc-400 text-[11px]">
              Automatically generated and served at the root domain. Submits all 16 public website routes directly to Google Search Console and Bing.
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-emerald-400 text-[10px] space-y-1">
              <div>✓ Priority: 1.0 (Homepage)</div>
              <div>✓ Priority: 0.9 (Services, Portfolio, Pricing, Estimator, Contact)</div>
              <div>✓ Priority: 0.8 (About, Process, Standards, FAQ)</div>
              <div>✓ Change Frequency: Weekly</div>
            </div>
          </div>

          {/* Robots.txt */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#080816] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold font-display text-white">Robots.txt Directive</h4>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="text-[#00F0FF] hover:underline flex items-center gap-1"
              >
                <span>/robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-zinc-400 text-[11px]">
              Directs web crawlers to index all public content while securely keeping admin routes and internal endpoints disassociated.
            </p>
            <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-zinc-300 text-[11px] leading-relaxed">
              {`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${draft.siteUrl}/sitemap.xml`}
            </pre>
          </div>
        </div>
      )}
    </form>
  );
};
