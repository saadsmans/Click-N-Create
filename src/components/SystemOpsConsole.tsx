import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server,
  Activity,
  Database,
  Download,
  Upload,
  RefreshCw,
  Terminal,
  ShieldAlert,
  Webhook,
  Send,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  HardDrive,
  Cpu,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Image as ImageIcon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { MediaAsset, WebhookConfig, MaintenanceConfig, ServerEventLog } from '../types/index.ts';
import { safeParseJson } from '../utils/api.ts';

interface SystemOpsConsoleProps {
  token: string;
}

export const SystemOpsConsole: React.FC<SystemOpsConsoleProps> = ({ token }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'health' | 'backup' | 'logs' | 'webhooks' | 'media' | 'maintenance' | 'email_test'>('health');
  
  // Health & stats
  const [health, setHealth] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(false);

  // Server logs
  const [logs, setLogs] = useState<ServerEventLog[]>([]);
  const [logFilter, setLogFilter] = useState<string>('all');

  // Webhooks
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showNewWebhookModal, setShowNewWebhookModal] = useState<boolean>(false);
  const [newWhName, setNewWhName] = useState<string>('');
  const [newWhUrl, setNewWhUrl] = useState<string>('');
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
  const [testWebhookResult, setTestWebhookResult] = useState<any>(null);

  // Media
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [newMediaName, setNewMediaName] = useState<string>('');
  const [newMediaUrl, setNewMediaUrl] = useState<string>('');
  const [newMediaCategory, setNewMediaCategory] = useState<string>('portfolio');
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);

  // Maintenance
  const [maintenance, setMaintenance] = useState<MaintenanceConfig>({
    enabled: false,
    headline: 'Scheduled System Upgrade',
    message: 'We are upgrading our high-speed servers. Services resume shortly.',
    allowAdminBypass: true,
    updatedAt: '',
  });

  // Email test
  const [testEmailTo, setTestEmailTo] = useState<string>('mansurisaad28012@gmail.com');
  const [testTemplateId, setTestTemplateId] = useState<string>('tmpl-quote');
  const [emailDispatchResult, setEmailDispatchResult] = useState<any>(null);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  // Status / Toast feedback
  const [toastMessage, setToastMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch health
  const fetchHealth = async () => {
    try {
      setLoadingHealth(true);
      const res = await fetch('/api/system/health', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseJson(res);
      if (data.success) {
        setHealth(data.health);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHealth(false);
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/system/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseJson(res);
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch webhooks
  const fetchWebhooks = async () => {
    try {
      const res = await fetch('/api/webhooks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseJson(res);
      if (data.success) {
        setWebhooks(data.webhooks || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch media
  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseJson(res);
      if (data.success) {
        setMediaAssets(data.media || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch maintenance
  const fetchMaintenance = async () => {
    try {
      const res = await fetch('/api/system/maintenance');
      const data = await safeParseJson(res);
      if (data.success) {
        setMaintenance(data.maintenance);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchLogs();
    fetchWebhooks();
    fetchMedia();
    fetchMaintenance();
  }, [token]);

  // Seed demo data
  const handleSeedDemo = async () => {
    if (confirm('Inject realistic commercial client sprint, project and task data?')) {
      const res = await fetch('/api/system/seed-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseJson(res);
      if (data.success) {
        showToast('Realistic demo data seeded successfully!');
        fetchHealth();
      }
    }
  };

  // Clear server logs
  const handleClearLogs = async () => {
    if (confirm('Clear server event logs?')) {
      await fetch('/api/system/logs', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs([]);
      showToast('Logs cleared.');
    }
  };

  // Test webhook
  const handleTestWebhook = async (id: string) => {
    try {
      setTestingWebhookId(id);
      const res = await fetch(`/api/webhooks/${id}/test`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseJson(res);
      setTestWebhookResult(data);
      showToast('Test webhook payload dispatched!');
      fetchWebhooks();
    } catch (e) {
      console.error(e);
    } finally {
      setTestingWebhookId(null);
    }
  };

  // Add webhook
  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhUrl) return;
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newWhName || 'Discord / Zapier Inbound',
          url: newWhUrl,
          enabled: true,
          events: ['inquiry.created', 'invoice.paid', 'quote.submitted'],
        }),
      });
      const data = await safeParseJson(res);
      if (data.success) {
        setNewWhName('');
        setNewWhUrl('');
        setShowNewWebhookModal(false);
        fetchWebhooks();
        showToast('Webhook endpoint registered.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete webhook
  const handleDeleteWebhook = async (id: string) => {
    if (confirm('Delete webhook?')) {
      await fetch(`/api/webhooks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWebhooks();
      showToast('Webhook deleted.');
    }
  };

  // Add media asset
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl) return;
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newMediaName || 'Media Proof Asset',
          url: newMediaUrl,
          category: newMediaCategory,
          type: 'image/jpeg',
          sizeBytes: 120400,
        }),
      });
      const data = await safeParseJson(res);
      if (data.success) {
        setNewMediaName('');
        setNewMediaUrl('');
        setShowMediaModal(false);
        fetchMedia();
        showToast('Media asset recorded.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle maintenance mode
  const handleToggleMaintenance = async () => {
    const updatedState = !maintenance.enabled;
    const res = await fetch('/api/system/maintenance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...maintenance,
        enabled: updatedState,
      }),
    });
    const data = await safeParseJson(res);
    if (data.success) {
      setMaintenance(data.maintenance);
      showToast(`Maintenance mode ${updatedState ? 'ENABLED' : 'DISABLED'}`);
    }
  };

  // Dispatch simulated test email
  const handleDispatchTestEmail = async () => {
    try {
      setIsSendingEmail(true);
      const res = await fetch('/api/email/dispatch-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId: testTemplateId,
          toEmail: testEmailTo,
          params: {
            clientName: 'Alexander Ward',
            projectName: 'Aurora Homes Architectural Showcase',
            totalCost: '1,400',
            hours: '40',
            timeline: '2 Weeks',
            portalAccessKey: 'AURORA-2026-KEY',
          },
        }),
      });
      const data = await safeParseJson(res);
      setEmailDispatchResult(data);
      showToast('Simulated email rendered and dispatched!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (logFilter === 'all') return true;
    return l.level === logFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDark ? 'bg-[#080814]/90 border-white/10 shadow-lg' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  Server Ops & Backend Telemetry
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  Node.js Express + Atomic DB
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Hardware telemetry, full database backups, webhook event triggers, server logs, and media proofs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchHealth}
              disabled={loadingHealth}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:text-white' : 'border-zinc-200 bg-zinc-50 text-zinc-700'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
            <a
              href="/api/system/backup"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1.5 hover:brightness-110 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full DB Dump</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`p-1.5 rounded-2xl border flex flex-wrap items-center gap-1.5 ${
        isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-zinc-100 border-zinc-200'
      }`}>
        {[
          { id: 'health', label: 'Telemetry & Resources', icon: Activity },
          { id: 'backup', label: 'Database Backup & Restore', icon: Database },
          { id: 'logs', label: 'Live Server Logs', icon: Terminal },
          { id: 'webhooks', label: 'Webhooks & Integrations', icon: Webhook },
          { id: 'media', label: 'Media & File Assets', icon: ImageIcon },
          { id: 'maintenance', label: 'Maintenance Mode', icon: ShieldAlert },
          { id: 'email_test', label: 'Email Dispatch Test', icon: Send },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'bg-white text-cyan-700 border border-cyan-200 shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: TELEMETRY & RESOURCES ================= */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {health ? (
            <>
              {/* Telemetry Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span className="text-[10px] font-mono uppercase">Server Uptime</span>
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    {health.uptimeFormatted}
                  </div>
                  <span className="text-[10px] text-zinc-500">Continuous execution</span>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span className="text-[10px] font-mono uppercase">Memory RSS</span>
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-lg font-bold font-mono text-purple-400">
                    {health.memory?.rssMB} MB
                  </div>
                  <span className="text-[10px] text-zinc-500">Heap Used: {health.memory?.heapUsedMB} MB</span>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span className="text-[10px] font-mono uppercase">Database Footprint</span>
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {health.database?.fileSizeKB} KB
                  </div>
                  <span className="text-[10px] text-zinc-500">data/db.json file size</span>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span className="text-[10px] font-mono uppercase">Node Runtime</span>
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-lg font-bold font-mono text-amber-400">
                    {health.nodeVersion}
                  </div>
                  <span className="text-[10px] text-zinc-500">PID: {health.pid} · {health.platform}</span>
                </div>
              </div>

              {/* Database Records Summary Table */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <h3 className={`text-sm font-bold uppercase font-mono tracking-wider ${
                  isDark ? 'text-zinc-300' : 'text-zinc-800'
                }`}>
                  Database Schema Collections & Entity Count
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {Object.entries(health.database || {})
                    .filter(([k]) => k.endsWith('Count'))
                    .map(([key, val]: any) => (
                      <div key={key} className={`p-3 rounded-xl border ${
                        isDark ? 'bg-black/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                        <div className="text-lg font-bold font-mono text-cyan-400">{val}</div>
                        <div className="text-[10px] text-zinc-400 truncate uppercase tracking-wider font-mono">
                          {key.replace('Count', '')}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs">
              Loading server telemetry...
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: DATABASE BACKUP & RESTORE ================= */}
      {activeTab === 'backup' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div>
            <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              Database Synchronization & Full Snapshots
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Click N Create uses atomic file-backed JSON synchronization. Backups include all client accounts, invoices, projects, inquiries, and page edits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-black/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">1-Click Full Backup</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download a timestamped complete JSON copy of your entire studio database for offline backup or migration.
              </p>
              <a
                href="/api/system/backup"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Database JSON</span>
              </a>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-black/40 border-white/5' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Seed Realistic Demo Data</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Inject realistic commercial client sprint profiles, active project tasks, and test invoices for testing.
              </p>
              <button
                type="button"
                onClick={handleSeedDemo}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inject Sample Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SERVER EVENT LOGS ================= */}
      {activeTab === 'logs' && (
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className={`text-sm font-bold uppercase font-mono tracking-wider ${
                isDark ? 'text-zinc-300' : 'text-zinc-800'
              }`}>
                Live Server Activity & Security Event Stream ({logs.length})
              </h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Audit of all backend operations, logins, page updates, and system pings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className={`px-3 py-1.5 text-xs rounded-xl border font-mono ${
                  isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
                <option value="security">Security</option>
              </select>
              <button
                type="button"
                onClick={handleClearLogs}
                className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-mono"
              >
                Clear Logs
              </button>
            </div>
          </div>

          <div className={`rounded-xl border max-h-[460px] overflow-y-auto font-mono text-xs ${
            isDark ? 'bg-black/80 border-white/5' : 'bg-zinc-900 text-zinc-200 border-zinc-800'
          }`}>
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No logs matching filter.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredLogs.map((log) => {
                  const levelColor =
                    log.level === 'error'
                      ? 'text-rose-400 bg-rose-500/10'
                      : log.level === 'warn'
                      ? 'text-amber-400 bg-amber-500/10'
                      : log.level === 'security'
                      ? 'text-purple-400 bg-purple-500/10'
                      : 'text-cyan-400 bg-cyan-500/10';

                  return (
                    <div key={log.id} className="p-3 flex items-start gap-3 hover:bg-white/5 transition-colors">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${levelColor}`}>
                        {log.level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-zinc-200 truncate">{log.event}</div>
                        {log.details && <div className="text-zinc-400 text-[11px] truncate">{log.details}</div>}
                      </div>
                      <span className="text-[10px] text-zinc-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: WEBHOOKS ================= */}
      {activeTab === 'webhooks' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Outbound Webhook Dispatchers ({webhooks.length})
              </h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Trigger instant POST payloads to Slack, Discord, Zapier or external CRM when an inquiry or invoice is paid.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewWebhookModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00F0FF] text-black"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Webhook</span>
            </button>
          </div>

          <div className="space-y-3">
            {webhooks.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                No webhooks configured. Click "Add Webhook" to connect Slack or Zapier.
              </div>
            ) : (
              webhooks.map((wh) => (
                <div key={wh.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold">{wh.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                        {wh.events.join(', ')}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 truncate max-w-md">{wh.url}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTestWebhook(wh.id)}
                      disabled={testingWebhookId === wh.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center gap-1"
                    >
                      <Radio className="w-3 h-3" />
                      <span>{testingWebhookId === wh.id ? 'Pinging...' : 'Send Test Ping'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWebhook(wh.id)}
                      className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {testWebhookResult && (
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 font-mono text-xs space-y-2">
              <div className="font-bold text-cyan-300">✓ Webhook Test Result:</div>
              <pre className="text-[11px] overflow-x-auto text-zinc-300">
                {JSON.stringify(testWebhookResult, null, 2)}
              </pre>
            </div>
          )}

          {/* New Webhook Modal */}
          {showNewWebhookModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <form onSubmit={handleAddWebhook} className={`w-full max-w-md p-6 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#080814] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-950 shadow-2xl'
              }`}>
                <h3 className="text-base font-bold font-display">Register New Webhook Endpoint</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1">Webhook Name</label>
                  <input
                    type="text"
                    required
                    value={newWhName}
                    onChange={(e) => setNewWhName(e.target.value)}
                    placeholder="e.g. Discord #leads channel"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/50 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Target POST URL</label>
                  <input
                    type="url"
                    required
                    value={newWhUrl}
                    onChange={(e) => setNewWhUrl(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/50 border-white/10 text-cyan-400 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewWebhookModal(false)}
                    className="px-4 py-2 rounded-xl text-xs border border-white/10 text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00F0FF] text-black"
                  >
                    Register Webhook
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: MEDIA & FILE ASSETS ================= */}
      {activeTab === 'media' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Media Proofs & Asset Vault ({mediaAssets.length})
              </h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Store image proofs, receipts, contracts, and portfolio artwork URLs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMediaModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00F0FF] text-black"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Media Asset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {mediaAssets.map((asset) => (
              <div key={asset.id} className={`p-3 rounded-xl border space-y-2 ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className="aspect-video rounded-lg overflow-hidden bg-black/60 relative group">
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/80 text-cyan-400">
                    {asset.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{asset.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(asset.url);
                      setCopiedId(asset.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="p-1 text-zinc-400 hover:text-cyan-400"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Media Modal */}
          {showMediaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <form onSubmit={handleAddMedia} className={`w-full max-w-md p-6 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#080814] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-950 shadow-2xl'
              }`}>
                <h3 className="text-base font-bold font-display">Record Media Asset</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={newMediaName}
                    onChange={(e) => setNewMediaName(e.target.value)}
                    placeholder="e.g. Lumina Storefront Proof"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/50 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Image / Asset URL</label>
                  <input
                    type="url"
                    required
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/50 border-white/10 text-cyan-400 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMediaModal(false)}
                    className="px-4 py-2 rounded-xl text-xs border border-white/10 text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00F0FF] text-black"
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 6: MAINTENANCE MODE ================= */}
      {activeTab === 'maintenance' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Emergency Maintenance & Broadcast Mode
              </h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                When enabled, visitors will see an architectural upgrade notice while you perform upgrades.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleMaintenance}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                maintenance.enabled
                  ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              }`}
            >
              {maintenance.enabled ? '● MAINTENANCE IS ON (DISABLE)' : '○ SITE IS LIVE (ACTIVATE MAINTENANCE)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Headline Notice</label>
              <input
                type="text"
                value={maintenance.headline}
                onChange={(e) => setMaintenance({ ...maintenance, headline: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border bg-black/50 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Message Body</label>
              <input
                type="text"
                value={maintenance.message}
                onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border bg-black/50 border-white/10 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: EMAIL DISPATCH TEST ================= */}
      {activeTab === 'email_test' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#080814]/90 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div>
            <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              Email Dispatch Engine & Dynamic Variable Simulator
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Test email templates and verify dynamic replacement variables before sending to real clients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Select Template</label>
              <select
                value={testTemplateId}
                onChange={(e) => setTestTemplateId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border bg-black/50 border-white/10 text-white font-mono"
              >
                <option value="tmpl-quote">Project Quotation Proposal</option>
                <option value="tmpl-welcome">Client Onboarding & Portal Key</option>
                <option value="tmpl-invoice">Invoice Issued & Settlement</option>
                <option value="tmpl-followup">3-Day Follow-Up Message</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Test Recipient Address</label>
              <input
                type="email"
                value={testEmailTo}
                onChange={(e) => setTestEmailTo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border bg-black/50 border-white/10 text-white font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleDispatchTestEmail}
            disabled={isSendingEmail}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSendingEmail ? 'Dispatching...' : 'Render & Dispatch Test Email'}</span>
          </button>

          {emailDispatchResult && (
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 font-mono text-xs space-y-2">
              <div className="font-bold text-cyan-300">✓ Subject: {emailDispatchResult.renderedSubject}</div>
              <pre className="text-[11px] whitespace-pre-wrap text-zinc-300 font-sans p-3 bg-black/40 rounded-lg">
                {emailDispatchResult.renderedBody}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
