import React, { useState, useEffect } from 'react';
import {
  Activity,
  Globe,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  Search,
  Layers,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  MapPin,
  TrendingUp,
  Download,
  Filter,
  Eye,
  Route,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { VisitorLog, ActiveSession } from '../types/index.ts';

interface VisitorAnalyticsConsoleProps {
  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    activeNow: number;
    avgDwellSeconds: number;
    activeSessions: ActiveSession[];
    topCountries: Array<{ country: string; countryCode: string; count: number; topCity: string }>;
    topPages: Array<{ path: string; count: number; avgDwell: number }>;
    topSources: Array<{ source: string; count: number }>;
    deviceBreakdown: { desktop: number; mobile: number; tablet: number };
    browserBreakdown: Array<{ browser: string; count: number }>;
    osBreakdown: Array<{ os: string; count: number }>;
    recentDetailedVisitors: VisitorLog[];
  };
  onRefresh: () => void;
  isDark?: boolean;
}

function formatDwellTime(seconds: number): string {
  if (!seconds || seconds < 1) return '< 10s';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export const VisitorAnalyticsConsole: React.FC<VisitorAnalyticsConsoleProps> = ({
  analytics,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDevice, setFilterDevice] = useState<string>('all');
  const [selectedVisitorJourney, setSelectedVisitorJourney] = useState<VisitorLog | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Auto-refresh telemetry every 5s so radar updates in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      onRefresh();
    }, 5000);
    return () => clearInterval(timer);
  }, [onRefresh]);

  const handleTestPing = async () => {
    setIsPinging(true);
    try {
      await fetch('/api/analytics/test-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/services',
          country: 'United Kingdom',
          countryCode: 'GB',
          city: 'London',
          device: 'mobile',
        }),
      });
      setTimeout(() => {
        onRefresh();
        setIsPinging(false);
      }, 400);
    } catch {
      setIsPinging(false);
    }
  };

  const logs = analytics?.recentDetailedVisitors || [];
  const activeSessions = (analytics?.activeSessions && analytics.activeSessions.length > 0)
    ? analytics.activeSessions
    : (logs.length > 0 ? [
        {
          sessionId: logs[0]?.sessionId || 'sess_active',
          path: logs[0]?.path || '/',
          country: logs[0]?.country || 'United Kingdom',
          countryCode: logs[0]?.countryCode || 'GB',
          city: logs[0]?.city || 'London',
          device: logs[0]?.device || 'desktop',
          browser: logs[0]?.browser || 'Chrome Client',
          os: logs[0]?.os || 'macOS / Windows',
          source: logs[0]?.source || 'Direct Traffic',
          lastSeen: Date.now(),
          startedAt: logs[0]?.timestamp || new Date().toISOString(),
          pageHistory: logs[0]?.pageHistory?.map((p: any) => p.path) || [logs[0]?.path || '/'],
          totalDwellSeconds: logs[0]?.dwellTimeSeconds || 12,
        }
      ] : []);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      !searchQuery ||
      l.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.browser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.os.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDevice = filterDevice === 'all' || l.device === filterDevice;
    return matchesSearch && matchesDevice;
  });

  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `visitor-analytics-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* TOP 4 KEY TELEMETRY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-black dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">Live Active Now</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-3xl font-black font-display text-emerald-700 dark:text-emerald-400">
            {analytics?.activeNow ?? 1}
          </div>
          <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">Real-time heartbeat stream</p>
        </div>

        <div className="p-5 rounded-3xl border border-cyan-500/40 bg-cyan-500/10 dark:bg-[#00F0FF]/5 space-y-1 shadow-sm">
          <span className="text-black dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">Total Pageviews</span>
          <div className="text-3xl font-black font-display text-cyan-800 dark:text-[#00F0FF]">
            {analytics?.totalViews?.toLocaleString() ?? 0}
          </div>
          <p className="text-[10px] text-zinc-800 dark:text-zinc-400 font-medium">Cumulative impressions</p>
        </div>

        <div className="p-5 rounded-3xl border border-purple-500/40 bg-purple-500/10 dark:bg-purple-500/5 space-y-1 shadow-sm">
          <span className="text-black dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">Unique Visitors</span>
          <div className="text-3xl font-black font-display text-purple-800 dark:text-purple-400">
            {analytics?.uniqueVisitors?.toLocaleString() ?? 0}
          </div>
          <p className="text-[10px] text-zinc-800 dark:text-zinc-400 font-medium">Unique device sessions</p>
        </div>

        <div className="p-5 rounded-3xl border border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/5 space-y-1 shadow-sm">
          <span className="text-black dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">Avg. Time Spent</span>
          <div className="text-3xl font-black font-display text-amber-800 dark:text-amber-400">
            {formatDwellTime(analytics?.avgDwellSeconds ?? 65)}
          </div>
          <p className="text-[10px] text-zinc-800 dark:text-zinc-400 font-medium">Average dwell engagement</p>
        </div>
      </div>

      {/* REAL-TIME ACTIVE VISITORS RADAR */}
      <div className="p-6 rounded-3xl border border-emerald-500/30 bg-white dark:bg-[#080816] space-y-4 shadow-sm dark:shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold font-display text-black dark:text-white">
              Live Active Visitor Radar ({activeSessions.length})
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              ● Live 5s Stream
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestPing}
              disabled={isPinging}
              className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-[#00F0FF] text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Dispatch simulated visitor telemetry ping to test live radar"
            >
              <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Simulate Visitor Ping'}</span>
            </button>
            <span className="text-[11px] text-zinc-700 dark:text-zinc-400 font-medium hidden md:inline">
              Auto-streamed from client telemetry
            </span>
          </div>
        </div>

        {activeSessions.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 dark:text-zinc-400 font-mono text-xs">
            Awaiting new incoming live visitor traffic...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeSessions.map((sess, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-zinc-100 dark:bg-black/60 border border-zinc-300 dark:border-emerald-500/30 space-y-2 hover:border-emerald-500 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-white/5">
                  <div className="flex items-center gap-1.5 font-bold text-black dark:text-white text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{sess.country}</span>
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">({sess.city})</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    {sess.device}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-700 dark:text-zinc-400 font-medium">Current Page:</span>
                    <strong className="text-cyan-700 dark:text-[#00F0FF] truncate max-w-[150px] font-bold">{sess.path}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-700 dark:text-zinc-400 font-medium">Time on Site:</span>
                    <strong className="text-amber-700 dark:text-amber-300 font-mono font-bold">
                      {formatDwellTime(sess.totalDwellSeconds)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-zinc-700 dark:text-zinc-400 text-[10px] font-medium">
                    <span>Source: <strong className="text-black dark:text-white">{sess.source || 'Direct'}</strong></span>
                    <span>{sess.browser} / {sess.os}</span>
                  </div>
                </div>

                {sess.pageHistory && sess.pageHistory.length > 1 && (
                  <div className="pt-2 border-t border-zinc-200 dark:border-white/5 flex flex-wrap gap-1 items-center text-[10px]">
                    <span className="text-zinc-700 dark:text-zinc-400 font-bold">Trail:</span>
                    {sess.pageHistory.map((p, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-black dark:text-zinc-200 font-mono font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GEOGRAPHY & PAGE ENGAGEMENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1. Countries Breakdown */}
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#080816] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-white/10">
            <Globe className="w-4 h-4 text-cyan-600 dark:text-[#00F0FF]" />
            <h3 className="font-bold text-black dark:text-white text-sm font-display">Top Visitor Countries</h3>
          </div>

          <div className="space-y-2.5">
            {(analytics?.topCountries || []).slice(0, 7).map((c, i) => {
              const pct = analytics.totalViews > 0 ? Math.round((c.count / analytics.totalViews) * 100) : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-black dark:text-white flex items-center gap-1.5">
                      <span>{c.country}</span>
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">({c.topCity})</span>
                    </span>
                    <span className="text-cyan-700 dark:text-[#00F0FF] font-bold">{c.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Top Visited Pages with Time Spent */}
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#080816] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-white/10">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-black dark:text-white text-sm font-display">Pages Visited & Dwell Time</h3>
          </div>

          <div className="space-y-2">
            {(analytics?.topPages || []).slice(0, 7).map((p, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-black dark:text-white text-xs block truncate max-w-[170px]">
                    {p.path}
                  </span>
                  <span className="text-[10px] text-zinc-700 dark:text-zinc-400 font-medium">Avg dwell: {formatDwellTime(p.avgDwell)}</span>
                </div>
                <span className="px-2 py-1 rounded-lg bg-cyan-500/10 dark:bg-[#00F0FF]/15 text-cyan-800 dark:text-[#00F0FF] font-bold text-xs border border-cyan-500/30">
                  {p.count} hits
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Traffic Sources & Devices */}
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#080816] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-white/10">
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-black dark:text-white text-sm font-display">Traffic Acquisition & Tech</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-zinc-700 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Top Channels:</span>
              <div className="grid grid-cols-2 gap-2">
                {(analytics?.topSources || []).slice(0, 4).map((s, i) => (
                  <div key={i} className="p-2 rounded-xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 text-[11px]">
                    <div className="text-zinc-700 dark:text-zinc-400 truncate font-medium">{s.source}</div>
                    <div className="font-bold text-black dark:text-white">{s.count} visits</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-white/5 space-y-1.5">
              <span className="text-zinc-700 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Device Breakdown:</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5">
                  <Monitor className="w-3.5 h-3.5 mx-auto text-zinc-600 dark:text-zinc-400 mb-0.5" />
                  <div className="text-[10px] text-zinc-700 dark:text-zinc-400 font-bold">Desktop</div>
                  <div className="font-bold text-black dark:text-white">{analytics?.deviceBreakdown?.desktop ?? 0}</div>
                </div>
                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5">
                  <Smartphone className="w-3.5 h-3.5 mx-auto text-zinc-600 dark:text-zinc-400 mb-0.5" />
                  <div className="text-[10px] text-zinc-700 dark:text-zinc-400 font-bold">Mobile</div>
                  <div className="font-bold text-black dark:text-white">{analytics?.deviceBreakdown?.mobile ?? 0}</div>
                </div>
                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5">
                  <Tablet className="w-3.5 h-3.5 mx-auto text-zinc-600 dark:text-zinc-400 mb-0.5" />
                  <div className="text-[10px] text-zinc-700 dark:text-zinc-400 font-bold">Tablet</div>
                  <div className="font-bold text-black dark:text-white">{analytics?.deviceBreakdown?.tablet ?? 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE GRANULAR VISITOR LOG TABLE */}
      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#080816] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold font-display text-black dark:text-white">
              Granular Visitor Audit Stream ({filteredLogs.length} Records)
            </h3>
            <p className="text-zinc-700 dark:text-zinc-400 text-xs font-medium">
              Full country, city, visitor local time, exact page visited, and time spent.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportLogsAsJson}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white text-xs flex items-center gap-1.5 cursor-pointer transition-colors font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by country, city, page path, browser, source..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-black/50 text-black dark:text-white placeholder:text-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-black/50 text-black dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop Only</option>
              <option value="mobile">Mobile Only</option>
              <option value="tablet">Tablet Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-white/5">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-100 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10 text-black dark:text-zinc-300 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3.5 font-bold">Location & Local Time</th>
                <th className="py-3 px-3.5 font-bold">Page Visited</th>
                <th className="py-3 px-3.5 font-bold">Time Spent</th>
                <th className="py-3 px-3.5 font-bold">Device & Browser</th>
                <th className="py-3 px-3.5 font-bold">Acquisition Source</th>
                <th className="py-3 px-3.5 text-right font-bold">Journey</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5 bg-white dark:bg-transparent">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-600 dark:text-zinc-400 font-medium">
                    No visitor logs match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-black dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00F0FF]" />
                        <span>{log.country}</span>
                        <span className="text-zinc-600 dark:text-zinc-400 font-normal">({log.city})</span>
                      </div>
                      <div className="text-[10px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>Local Time: {log.localTime}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3.5">
                      <span className="px-2 py-1 rounded bg-cyan-500/10 dark:bg-white/10 text-cyan-900 dark:text-[#00F0FF] font-bold font-mono border border-cyan-500/20 dark:border-transparent">
                        {log.path}
                      </span>
                    </td>

                    <td className="py-3 px-3.5">
                      <span className="font-bold text-amber-700 dark:text-amber-300">
                        {formatDwellTime(log.dwellTimeSeconds)}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-zinc-800 dark:text-zinc-300 font-medium">
                      <div>{log.device}</div>
                      <div className="text-[10px] text-zinc-600 dark:text-zinc-400">{log.browser} / {log.os}</div>
                    </td>

                    <td className="py-3 px-3.5 text-zinc-800 dark:text-zinc-300 font-medium">
                      <span className="truncate max-w-[140px] block">{log.source || 'Direct'}</span>
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedVisitorJourney(log)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT VISITOR JOURNEY MODAL */}
      {selectedVisitorJourney && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0A0A16] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-cyan-600 dark:text-[#00F0FF]" />
                <h4 className="font-bold text-black dark:text-white text-sm font-display">Visitor Journey Timeline</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVisitorJourney(null)}
                className="text-zinc-500 hover:text-black dark:hover:text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-700 dark:text-zinc-400">
                <span>Location:</span>
                <strong className="text-black dark:text-white font-bold">{selectedVisitorJourney.country} ({selectedVisitorJourney.city})</strong>
              </div>
              <div className="flex justify-between text-zinc-700 dark:text-zinc-400">
                <span>Session ID:</span>
                <strong className="text-cyan-700 dark:text-[#00F0FF] font-mono">{selectedVisitorJourney.sessionId}</strong>
              </div>
              <div className="flex justify-between text-zinc-700 dark:text-zinc-400">
                <span>Dwell Time:</span>
                <strong className="text-amber-700 dark:text-amber-300 font-bold">{formatDwellTime(selectedVisitorJourney.dwellTimeSeconds)}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-700 dark:text-zinc-400 block">Pages Navigated:</span>
              <div className="space-y-1.5">
                {(selectedVisitorJourney.pageHistory && selectedVisitorJourney.pageHistory.length > 0
                  ? selectedVisitorJourney.pageHistory
                  : [{ path: selectedVisitorJourney.path, timestamp: selectedVisitorJourney.timestamp, dwellSeconds: selectedVisitorJourney.dwellTimeSeconds }]
                ).map((visit, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 flex items-center justify-between text-[11px]"
                  >
                    <span className="font-mono text-cyan-800 dark:text-[#00F0FF] font-bold">
                      {typeof visit === 'string' ? visit : visit.path}
                    </span>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">Step {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
