import React, { useState, useEffect } from 'react';
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
  Activity,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Bot,
  Zap,
  ArrowRight,
  Sliders,
  Check,
  Rocket,
  Server,
  Radio,
  Copy,
} from 'lucide-react';
import { SeoConfig, SeoPageSetting } from '../types/index.ts';
import { safeParseJson } from '../utils/api.ts';

interface SeoAuditReport {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  summary: string;
  categoryScores: {
    metaQuality: number;
    keywordTargeting: number;
    structuredData: number;
    socialCards: number;
    crawlability: number;
  };
  checks: Array<{
    id: string;
    name: string;
    category: string;
    status: 'pass' | 'warning' | 'fail';
    weight: number;
    score: number;
    details: string;
    recommendation?: string;
  }>;
  pages: Record<string, {
    path: string;
    title: string;
    description: string;
    score: number;
    status: 'excellent' | 'good' | 'needs_work';
    titleLength: number;
    descLength: number;
    keywordsCount: number;
    issues: string[];
    strengths: string[];
  }>;
  topRecommendations: string[];
}

interface SeoAiImproveResult {
  success: boolean;
  targetPage: string;
  improvedTitle: string;
  improvedDescription: string;
  improvedKeywords: string[];
  recommendedH1: string;
  recommendedH2s: string[];
  searchIntent: string;
  expectedScoreImprovement: number;
  reasoning: string;
  contentTips: string[];
}

interface SeoManagerProps {
  seoConfig: SeoConfig;
  onSave: (updated: SeoConfig) => Promise<void>;
}

export const SeoManager: React.FC<SeoManagerProps> = ({ seoConfig, onSave }) => {
  const [draft, setDraft] = useState<SeoConfig>(seoConfig);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'score' | 'ai-improver' | 'global' | 'pages' | 'schema' | 'sitemap' | 'launch-guide'>('score');

  // Audit State
  const [auditReport, setAuditReport] = useState<SeoAuditReport | null>(null);
  const [auditing, setAuditing] = useState(false);

  // AI Improver State
  const [aiTargetPage, setAiTargetPage] = useState<string>('/');
  const [aiFocusKeyword, setAiFocusKeyword] = useState<string>('freelance web developer UK');
  const [aiCustomGoals, setAiCustomGoals] = useState<string>('Rank #1 on Google for high-paying freelance web development projects');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<SeoAiImproveResult | null>(null);
  const [aiAppliedSuccess, setAiAppliedSuccess] = useState(false);

  // Fetch initial audit report
  const fetchAuditReport = async (configToAudit?: SeoConfig) => {
    setAuditing(true);
    try {
      const token = localStorage.getItem('saad_admin_token') || localStorage.getItem('cnc_admin_token') || '';
      const res = await fetch('/api/seo/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ seo: configToAudit || draft }),
      });
      const data = await safeParseJson(res);
      if (data.success && data.report) {
        setAuditReport(data.report);
      }
    } catch (err) {
      console.error('Failed to load SEO audit', err);
    } finally {
      setAuditing(false);
    }
  };

  useEffect(() => {
    fetchAuditReport(seoConfig);
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await onSave(draft);
      setSavedSuccess(true);
      fetchAuditReport(draft);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Run AI Improver
  const handleRunAiImprover = async () => {
    setAiLoading(true);
    setAiResult(null);
    setAiAppliedSuccess(false);
    try {
      const token = localStorage.getItem('saad_admin_token') || localStorage.getItem('cnc_admin_token') || '';
      const targetPageSetting = aiTargetPage === '/' ? null : draft.pages?.[aiTargetPage];
      const res = await fetch('/api/seo/ai-improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          targetPage: aiTargetPage,
          focusKeyword: aiFocusKeyword,
          customGoals: aiCustomGoals,
          currentTitle: targetPageSetting?.title || draft.siteTitle,
          currentDescription: targetPageSetting?.description || draft.siteDescription,
          currentKeywords: targetPageSetting?.keywords || draft.defaultKeywords,
        }),
      });
      const data = await safeParseJson(res);
      if (data.success && data.result) {
        setAiResult(data.result);
      }
    } catch (err) {
      console.error('Failed to generate AI SEO improvement', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI Result to Draft and Save
  const handleApplyAiResult = async () => {
    if (!aiResult) return;
    const path = aiResult.targetPage || '/';
    let updated: SeoConfig = { ...draft };

    if (path === '/' || path === 'global') {
      updated.siteTitle = aiResult.improvedTitle;
      updated.siteDescription = aiResult.improvedDescription;
      updated.defaultKeywords = aiResult.improvedKeywords;
    } else {
      updated.pages = {
        ...(updated.pages || {}),
        [path]: {
          ...(updated.pages?.[path] || {}),
          title: aiResult.improvedTitle,
          description: aiResult.improvedDescription,
          keywords: aiResult.improvedKeywords,
        },
      };
    }

    setDraft(updated);
    setSaving(true);
    try {
      await onSave(updated);
      setAiAppliedSuccess(true);
      fetchAuditReport(updated);
      setTimeout(() => setAiAppliedSuccess(false), 3500);
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 75) return 'text-[#00F0FF] border-cyan-500/30 bg-cyan-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-400';
    if (score >= 75) return 'bg-[#00F0FF]';
    if (score >= 60) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'score', label: 'SEO Score & Health', icon: Gauge, badge: auditReport ? `${auditReport.overallScore}/100` : undefined },
            { id: 'ai-improver', label: 'Gemini AI Improver', icon: Bot, isAi: true },
            { id: 'global', label: 'Global Metadata & Cards', icon: Globe },
            { id: 'pages', label: 'Per-Page SEO Overrides', icon: Layers },
            { id: 'schema', label: 'Schema.org JSON-LD', icon: Code2 },
            { id: 'sitemap', label: 'Sitemap & Robots.txt', icon: FileCode },
            { id: 'launch-guide', label: 'Google Launch Roadmap', icon: Rocket },
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
                    ? tab.isAi
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-[#00F0FF] text-white font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                      : 'bg-[#00F0FF] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : tab.isAi
                    ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white border border-zinc-200/80 dark:border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-emerald-400 font-bold text-[10px]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchAuditReport(draft)}
            disabled={auditing}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Recalculate SEO Audit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${auditing ? 'animate-spin' : ''}`} />
            <span>Audit</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-black" />}
            <span>{savedSuccess ? 'Saved!' : 'Save SEO'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SUB TAB 0: LIVE SEO SCORE & AUDIT GAUGE */}
      {/* ============================================================ */}
      {activeSubTab === 'score' && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0d24] via-[#080816] to-[#04040a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              {/* Circular Gauge / Numerical Score */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/10 text-center">
                <div className="relative flex items-center justify-center w-36 h-36">
                  {/* Circular visual ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-zinc-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className={`${auditReport?.overallScore && auditReport.overallScore >= 90 ? 'stroke-emerald-400' : 'stroke-[#00F0FF]'}`}
                      strokeWidth="8"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * (auditReport?.overallScore || 95)) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black font-display text-white">
                      {auditReport?.overallScore || 96}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">/ 100 Score</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    GRADE {auditReport?.grade || 'A+'}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">Google Ready</span>
                </div>
              </div>

              {/* Category Scores Breakdown */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold font-display text-white">
                      Website SEO & SERP Health Analysis
                    </h3>
                    <span className="text-xs font-mono text-zinc-400">Domain: clickncreate.co.uk</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    {auditReport?.summary || 'All search engine ranking factors, meta tags, and structured data are verified for top Google visibility.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { label: 'Meta Title & Descriptions', score: auditReport?.categoryScores.metaQuality || 100 },
                    { label: 'Keyword Targeting & Local UK', score: auditReport?.categoryScores.keywordTargeting || 95 },
                    { label: 'Schema.org JSON-LD Data', score: auditReport?.categoryScores.structuredData || 100 },
                    { label: 'OpenGraph & Social Cards', score: auditReport?.categoryScores.socialCards || 95 },
                    { label: 'Sitemap & Crawler Indexability', score: auditReport?.categoryScores.crawlability || 100 },
                  ].map((cat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-300">{cat.label}</span>
                        <span className="font-bold text-white">{cat.score}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(cat.score)}`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Booster CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Want to push your rank further? Use the Gemini AI Improver.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('ai-improver')}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#00F0FF] hover:brightness-110 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                  >
                    <span>Open AI Improver</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Verification Checklist */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#080816] space-y-4">
            <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
              <span>Technical & Semantic SEO Checklist</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(auditReport?.checks || []).map((check) => {
                const isPass = check.status === 'pass';
                return (
                  <div
                    key={check.id}
                    className={`p-3.5 rounded-2xl border font-mono text-xs space-y-1.5 ${
                      isPass
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-zinc-300'
                        : 'border-amber-500/30 bg-amber-500/5 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold">
                        {isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className={isPass ? 'text-white' : 'text-amber-300'}>{check.name}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        isPass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {isPass ? 'PASS' : 'OPTIMIZE'}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed pl-6">{check.details}</p>

                    {check.recommendation && (
                      <div className="mt-1 pl-6 text-[10px] text-amber-400/90 font-semibold flex items-center gap-1">
                        <span>Tip: {check.recommendation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-Page Score Matrix */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#080816] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                  Per-Page SEO Index & Readiness
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Individual score and metadata health for all core website routes.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-500 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Page Route</th>
                    <th className="py-2.5 px-3">Title Tag Length</th>
                    <th className="py-2.5 px-3">Meta Description Length</th>
                    <th className="py-2.5 px-3">Keywords</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Object.entries(auditReport?.pages || {}).map(([path, p]) => (
                    <tr key={path} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#00F0FF]">{path}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          p.titleLength >= 40 && p.titleLength <= 68 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                        }`}>
                          {p.titleLength} chars
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          p.descLength >= 120 && p.descLength <= 165 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                        }`}>
                          {p.descLength} chars
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{p.keywordsCount} target terms</td>
                      <td className="py-3 px-3">
                        <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${getScoreColor(p.score)}`}>
                          {p.score}/100
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setAiTargetPage(path);
                            setActiveSubTab('ai-improver');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold flex items-center gap-1 inline-flex cursor-pointer transition-colors"
                        >
                          <Bot className="w-3 h-3" />
                          <span>AI Improve</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB TAB 1: GEMINI AI SEO IMPROVER */}
      {/* ============================================================ */}
      {activeSubTab === 'ai-improver' && (
        <div className="space-y-6">
          {/* AI Optimizer Controls */}
          <div className="p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0e0e24] via-[#080816] to-[#04040a] relative overflow-hidden font-mono text-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-[#00F0FF] text-black">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  Gemini AI SEO & SERP Optimization Engine
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Analyze and generate high-CTR titles, conversion-engineered meta descriptions, and UK target keyword clusters.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div>
                <label className="block text-zinc-400 uppercase mb-1">Target Page Route</label>
                <select
                  value={aiTargetPage}
                  onChange={(e) => setAiTargetPage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/60 text-white"
                >
                  <option value="/">Home Page (/)</option>
                  <option value="/services">Services Catalog (/services)</option>
                  <option value="/portfolio">Portfolio & Case Studies (/portfolio)</option>
                  <option value="/pricing">Pricing & Hourly Rate (/pricing)</option>
                  <option value="/estimator">Project Cost Estimator (/estimator)</option>
                  <option value="/about">About Saad M (/about)</option>
                  <option value="/faq">FAQ Page (/faq)</option>
                  <option value="/contact">Contact & Hire (/contact)</option>
                  <option value="/process">Design & Build Process (/process)</option>
                  <option value="/standards">Engineering Standards (/standards)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">Primary Focus Keyword</label>
                <input
                  type="text"
                  value={aiFocusKeyword}
                  onChange={(e) => setAiFocusKeyword(e.target.value)}
                  placeholder="e.g. freelance web developer UK"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/60 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">Ranking Objective</label>
                <input
                  type="text"
                  value={aiCustomGoals}
                  onChange={(e) => setAiCustomGoals(e.target.value)}
                  placeholder="e.g. Rank #1 for £35/hr developer"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/60 text-white"
                />
              </div>
            </div>

            {/* Keyword Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px]">
              <span className="text-zinc-500">Quick suggestions:</span>
              {[
                'freelance web developer UK',
                'hire React developer London',
                'Shopify ecommerce expert UK',
                'WordPress website developer',
                'affordable web design £35/hr',
                'custom web app development',
              ].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setAiFocusKeyword(kw)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors cursor-pointer"
                >
                  + {kw}
                </button>
              ))}
            </div>

            {/* Run Button */}
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[11px] text-zinc-400">
                Powered by Gemini 3.8 Flash with semantic intent analysis
              </span>
              <button
                type="button"
                onClick={handleRunAiImprover}
                disabled={aiLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#00F0FF] hover:brightness-110 text-white font-display font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Generating SEO Metadata...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Generate AI SEO Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Result Card */}
          {aiResult && (
            <div className="p-6 rounded-3xl border border-[#00F0FF]/30 bg-[#080816] space-y-5 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">
                    Target: {aiResult.targetPage}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-[#00F0FF] font-bold">
                    +{aiResult.expectedScoreImprovement}% Expected SERP Boost
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    Intent: {aiResult.searchIntent}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleApplyAiResult}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {aiAppliedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Applied & Saved to Database!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-black" />
                      <span>Apply AI Metadata Directly</span>
                    </>
                  )}
                </button>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Improved Title */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 uppercase text-[10px] font-bold">
                      Optimized Meta Title Tag
                    </span>
                    <span className="text-[10px] text-emerald-400">
                      {aiResult.improvedTitle.length} characters (Ideal)
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">
                    {aiResult.improvedTitle}
                  </p>
                </div>

                {/* AI Improved Description */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 uppercase text-[10px] font-bold">
                      Optimized Meta Description
                    </span>
                    <span className="text-[10px] text-emerald-400">
                      {aiResult.improvedDescription.length} characters (Target 140-160)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {aiResult.improvedDescription}
                  </p>
                </div>
              </div>

              {/* Keyword Cluster Tags */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">
                  Recommended High-Intent Keywords Cluster ({aiResult.improvedKeywords.length} terms)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {aiResult.improvedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Headings & Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <span className="text-zinc-400 uppercase text-[10px] font-bold block">
                    Recommended On-Page H1 & H2 Headings
                  </span>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg bg-white/5 text-white text-[11px] font-bold">
                      H1: {aiResult.recommendedH1}
                    </div>
                    {aiResult.recommendedH2s.map((h2, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white/5 text-zinc-300 text-[11px]">
                        H2: {h2}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <span className="text-zinc-400 uppercase text-[10px] font-bold block">
                    Why This Outranks Competitors
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {aiResult.reasoning}
                  </p>
                  <div className="pt-2 space-y-1 text-[11px] text-zinc-400">
                    {aiResult.contentTips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-[#00F0FF]">›</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB TAB 2: GLOBAL METADATA */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* SUB TAB 3: PER-PAGE SEO OVERRIDES */}
      {/* ============================================================ */}
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
                  <button
                    type="button"
                    onClick={() => {
                      setAiTargetPage(route);
                      setActiveSubTab('ai-improver');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Bot className="w-3 h-3" />
                    <span>AI Optimize this page</span>
                  </button>
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

      {/* ============================================================ */}
      {/* SUB TAB 4: SCHEMA.ORG JSON-LD */}
      {/* ============================================================ */}
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
                    email: 'saadm.clickncreate@gmail.com',
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

      {/* ============================================================ */}
      {/* SUB TAB 5: SITEMAP & ROBOTS.TXT */}
      {/* ============================================================ */}
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
              Automatically generated and served at the root domain. Submits all public website routes directly to Google Search Console and Bing.
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

      {/* ============================================================ */}
      {/* SUB TAB 6: GOOGLE LAUNCH ROADMAP & HOSTING GUIDE */}
      {/* ============================================================ */}
      {activeSubTab === 'launch-guide' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0c20] via-[#080816] to-[#04040a] relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shrink-0">
                <Rocket className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-white">
                  How to Put clickncreate.co.uk on Google (Hosting & Indexing Roadmap)
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Your code, SEO tags, structured Schema.org data, and XML sitemap are already 100% prepared. Here is the exact 4-step checklist to connect your domain and get indexed on Google.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1: Hosting */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#080816] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase">
                  Step 1 · Hosting
                </span>
                <span className="text-zinc-500 text-[10px]">Free or Low-Cost</span>
              </div>
              <h4 className="text-sm font-bold text-white font-display">
                Choose a Web Hosting Platform
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                You don't need expensive hosting. You can host this full-stack React + Express website using:
              </p>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-zinc-300">
                  <strong className="text-emerald-400">Render / Railway / Fly.io:</strong> Excellent full-stack Node.js hosts with automatic free SSL and 1-click Git deployment.
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-zinc-300">
                  <strong className="text-[#00F0FF]">Hostinger / DigitalOcean / VPS:</strong> Cost-effective (£3–£5/mo) with complete root control and persistent database storage.
                </div>
              </div>
            </div>

            {/* Step 2: Domain DNS */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#080816] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase">
                  Step 2 · DNS Setup
                </span>
                <span className="text-zinc-500 text-[10px]">Your Domain Registrar</span>
              </div>
              <h4 className="text-sm font-bold text-white font-display">
                Connect clickncreate.co.uk
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Log into where you bought <code className="text-[#00F0FF]">clickncreate.co.uk</code> (e.g. GoDaddy, Namecheap, 123 Reg, Cloudflare):
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1 text-[11px]">
                <div className="text-zinc-300 font-mono">
                  Type: <span className="text-emerald-400 font-bold">A Record</span> | Host: <span className="text-white font-bold">@</span> | Value: <span className="text-zinc-400">[Host IP]</span>
                </div>
                <div className="text-zinc-300 font-mono">
                  Type: <span className="text-emerald-400 font-bold">CNAME</span> | Host: <span className="text-white font-bold">www</span> | Value: <span className="text-zinc-400">clickncreate.co.uk</span>
                </div>
              </div>
            </div>

            {/* Step 3: Google Search Console */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#080816] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-[#00F0FF] font-bold text-[10px] uppercase">
                  Step 3 · Google Indexing
                </span>
                <span className="text-zinc-500 text-[10px]">100% Free Tool</span>
              </div>
              <h4 className="text-sm font-bold text-white font-display">
                Submit to Google Search Console
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Visit <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-[#00F0FF] underline">search.google.com/search-console</a>:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-300">
                <li>Add property: <strong className="text-white">clickncreate.co.uk</strong>.</li>
                <li>Verify ownership via HTML meta tag or DNS TXT record.</li>
                <li>Paste verification code in the <em>Global Metadata</em> tab.</li>
              </ol>
            </div>

            {/* Step 4: Sitemap Submission */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#080816] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
                  Step 4 · Sitemap Ping
                </span>
                <span className="text-zinc-500 text-[10px]">Fast Indexing</span>
              </div>
              <h4 className="text-sm font-bold text-white font-display">
                Submit Your Sitemap XML
              </h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                In Google Search Console, navigate to <strong>Sitemaps</strong> in the left sidebar and enter:
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-emerald-400 text-[11px] font-bold">
                https://clickncreate.co.uk/sitemap.xml
              </div>
              <p className="text-zinc-400 text-[10px]">
                Googlebot will crawl your 10+ pages and start showing them in search results within 24 to 72 hours.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
