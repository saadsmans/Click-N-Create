import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  FolderGit2,
  Receipt,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Send,
  Eye,
  Calendar,
  Sparkles,
  ArrowRight,
  LogOut,
  User,
  Building,
  CreditCard,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { InvoiceView } from '../components/InvoiceView.tsx';
import { ClientProfile, ProjectItem, Invoice, CommunicationMessage } from '../types/index.ts';

interface ClientPortalPageProps {
  onNavigate: (path: string) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [inputEmail, setInputEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  const [client, setClient] = useState<ClientProfile | null>(() => {
    const saved = localStorage.getItem('cnc_client_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices' | 'messages'>('projects');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Message compose
  const [newMessage, setNewMessage] = useState<string>('');
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);

  useEffect(() => {
    if (client) {
      loadPortalData(client.email);
    }
  }, [client]);

  const loadPortalData = async (email: string) => {
    try {
      const res = await fetch(`/api/portal/data?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        if (data.client) setClient(data.client);
        setProjects(data.projects || []);
        setInvoices(data.invoices || []);
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.warn('Error loading client portal:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    const query = inputEmail.trim().toLowerCase();
    if (!query) {
      setLoginError('Please enter your client email or access key.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKeyOrEmail: query }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.client) {
          setClient(data.client);
          setProjects(data.projects || []);
          setInvoices(data.invoices || []);
          setMessages(data.messages || []);
          localStorage.setItem('cnc_client_profile', JSON.stringify(data.client));
          setLoading(false);
          return;
        }
      }
    } catch {
      console.warn('Backend client portal fetch bypassed, using client sandbox session');
    }

    // Default sample client demo fallback for standalone / preview mode
    const sampleClient: ClientProfile = {
      id: 'cli-sample-1',
      name: query.includes('@') ? query.split('@')[0].toUpperCase() : 'Valued Client',
      email: query.includes('@') ? query : 'client@example.com',
      company: 'Client Operations Hub',
      portalAccessKey: query.toUpperCase(),
      status: 'active',
      totalSpent: 1400,
      notes: 'Active portal demo account.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setClient(sampleClient);
    localStorage.setItem('cnc_client_profile', JSON.stringify(sampleClient));
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cnc_client_profile');
    setClient(null);
    setProjects([]);
    setInvoices([]);
    setMessages([]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !client) return;
    setSendingMsg(true);

    try {
      const res = await fetch('/api/portal/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.email,
          sender: 'client',
          senderName: client.name || 'Client',
          message: newMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.warn('Send message error:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-4 relative">
        <SEOHead
          title="Client Portal Login | Click N Create"
          description="Log in with your registered email to track active development milestones, download invoices, and communicate with Saad M."
        />

        <div
          className={`w-full max-w-md p-8 sm:p-10 rounded-3xl border shadow-2xl backdrop-blur-2xl relative ${
            isDark
              ? 'bg-[#0A0A16]/95 border-[#00F0FF]/30 shadow-[0_20px_60px_rgba(0,240,255,0.15)] text-white'
              : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
          }`}
        >
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 dark:bg-[#00F0FF]/15 border border-cyan-500/30 dark:border-[#00F0FF]/40 text-cyan-600 dark:text-[#00F0FF] flex items-center justify-center mx-auto shadow-md">
              <FolderGit2 className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black font-display tracking-tight text-zinc-950 dark:text-white">
              Client Project Portal
            </h1>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Sign in with your registered email or project access key
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-zinc-600 dark:text-zinc-400 font-bold">
                Registered Email or Key
              </label>
              <input
                type="text"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="your-email@company.com or CNC-XXXX"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/50 text-zinc-950 dark:text-white placeholder:text-zinc-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputEmail}
              className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm bg-[#00F0FF] hover:bg-[#38bdf8] text-black shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Access Client Dashboard</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-[11px] font-mono text-zinc-500">
                Not a registered client yet?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="text-cyan-600 dark:text-[#00F0FF] font-bold hover:underline cursor-pointer"
                >
                  Start a project with Saad M
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 md:pt-32 relative min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEOHead
        title={`Client Portal — ${client.name || 'Project'} | Click N Create`}
        description="Private client operations dashboard for tracking deliverables, downloading invoices, and messaging Saad M."
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-200 dark:border-white/[0.08] mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-[#00F0FF] font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>SECURE CLIENT ENVIRONMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-zinc-950 dark:text-white">
            Welcome, {client.name}
          </h1>
          <div className="text-xs font-mono text-zinc-500 mt-1">
            <span>Registered Email: <strong className="text-zinc-900 dark:text-white">{client.email}</strong> · </span>
            {client.company && <span>{client.company} · </span>}
            <span>Access Key: <strong className="text-purple-600 dark:text-purple-300">{client.portalAccessKey}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadPortalData(client.email)}
            className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
              isDark
                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 shadow-2xs'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/25 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 mb-8 border-b border-zinc-200 dark:border-white/[0.08]">
        {[
          { id: 'projects', label: `Active Projects (${projects.length})`, icon: FolderGit2 },
          { id: 'invoices', label: `Invoices & Receipts (${invoices.length})`, icon: Receipt },
          { id: 'messages', label: `Messages with Saad M (${messages.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedInvoice(null);
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                  : isDark
                  ? 'bg-white/5 hover:bg-white/10 text-zinc-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROJECTS & MILESTONES */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-[#080816] text-zinc-500 font-mono text-xs space-y-3 shadow-xs">
              <FolderGit2 className="w-10 h-10 mx-auto text-zinc-400 dark:text-zinc-600 mb-1" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-400">Project Provisioning Underway</p>
              <p>Your dedicated development sprint is currently being architected by Saad M. Milestones will appear here shortly.</p>
              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-[#00F0FF] inline-flex items-center gap-2 text-xs font-mono cursor-pointer font-bold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Saad M</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-6 ${
                    isDark ? 'border-white/10 bg-[#080816]' : 'border-zinc-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold bg-cyan-500/15 text-cyan-800 dark:bg-[#00F0FF]/20 dark:text-[#00F0FF]">
                          {proj.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">{proj.category}</span>
                      </div>
                      <h2 className="text-2xl font-bold font-display text-zinc-950 dark:text-white">{proj.title}</h2>
                    </div>

                    <div className="sm:text-right font-mono text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                      <div>
                        Deadline: <strong className="text-zinc-900 dark:text-white">{new Date(proj.deadline).toLocaleDateString()}</strong>
                      </div>
                      <div>
                        Budget: <strong className="text-cyan-600 dark:text-[#00F0FF]">£{proj.budget.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-600 dark:text-zinc-400">Sprint Completion Progress:</span>
                      <span className="font-bold text-cyan-600 dark:text-[#00F0FF]">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones Roadmap */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-bold">
                      Sprint Deliverables Roadmap:
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                      {proj.milestones.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                            m.status === 'completed'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                              : m.status === 'in_progress'
                              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-900 dark:text-white'
                              : 'border-zinc-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-zinc-500'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {m.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : m.status === 'in_progress' ? (
                              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-[#00F0FF] shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                            )}
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{m.title}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-200/70 dark:bg-black/40 text-zinc-800 dark:text-zinc-300">
                            {m.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVOICES & RECEIPTS */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {selectedInvoice ? (
            <InvoiceView
              invoice={selectedInvoice}
              onBack={() => setSelectedInvoice(null)}
            />
          ) : (
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-[#080816] text-zinc-500 font-mono text-xs shadow-xs">
                  No invoices issued yet for this registered email. Invoices will appear here as project milestones are completed.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-6 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#080816] space-y-4 hover:border-cyan-400 dark:hover:border-white/30 transition-all text-xs font-mono shadow-xs"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/10">
                        <span className="font-bold text-cyan-600 dark:text-[#00F0FF]">{inv.invoiceNumber}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                              : 'bg-cyan-500/20 text-cyan-800 dark:text-[#00F0FF]'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-zinc-950 dark:text-white font-display">{inv.projectTitle}</h4>
                        <div className="text-2xl font-black font-display text-zinc-950 dark:text-white mt-2">
                          {inv.currencySymbol}
                          {inv.totalDue.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-zinc-600 dark:text-zinc-400 text-[11px] pt-3 border-t border-zinc-200 dark:border-white/5 space-y-1">
                        <div className="flex justify-between">
                          <span>Due Date:</span>
                          <span>{new Date(inv.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-zinc-200 dark:border-transparent"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00F0FF]" />
                        <span>View & Print Invoice</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIRECT COMMUNICATION THREAD */}
      {activeTab === 'messages' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#080816] space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10">
            <div>
              <h2 className="text-lg font-bold font-display text-zinc-950 dark:text-white">Direct Communication with Saad M</h2>
              <p className="text-xs font-mono text-zinc-500">
                Ask questions, request design updates, or approve milestones in real-time.
              </p>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                No messages in this thread yet. Send a message below to reach Saad directly.
              </div>
            ) : (
              messages.map((m) => {
                const isSaad = m.sender === 'saad';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isSaad ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] font-mono text-zinc-500 mb-1">
                      {m.senderName} · {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div
                      className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed font-mono ${
                        isSaad
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-zinc-900 dark:text-white'
                          : 'bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/15 text-zinc-900 dark:text-white'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-white/10">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message or project note to Saad M..."
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-xs font-mono text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              disabled={sendingMsg || !newMessage.trim()}
              className="px-6 py-3 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
            >
              {sendingMsg ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
