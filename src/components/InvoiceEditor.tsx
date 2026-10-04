import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Calculator, ArrowRight, RefreshCw } from 'lucide-react';
import { Invoice, InvoiceLineItem } from '../types/index.ts';

interface InvoiceEditorProps {
  initialInvoice?: Partial<Invoice>;
  onSave: (invoiceData: Partial<Invoice>) => Promise<void>;
  onCancel: () => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ initialInvoice, onSave, onCancel }) => {
  const [saving, setSaving] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState(initialInvoice?.currencySymbol || '£');
  const [currency, setCurrency] = useState(initialInvoice?.currency || 'GBP');

  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber || `CNC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [date, setDate] = useState(initialInvoice?.date || new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(
    initialInvoice?.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<Invoice['status']>(initialInvoice?.status || 'sent');

  // Client info
  const [clientName, setClientName] = useState(initialInvoice?.clientName || '');
  const [clientEmail, setClientEmail] = useState(initialInvoice?.clientEmail || '');
  const [clientBusiness, setClientBusiness] = useState(initialInvoice?.clientBusiness || '');
  const [clientAddress, setClientAddress] = useState(initialInvoice?.clientAddress || '');
  const [clientVat, setClientVat] = useState(initialInvoice?.clientVat || '');

  // Project details
  const [projectTitle, setProjectTitle] = useState(
    initialInvoice?.projectTitle || 'Bespoke Web Development & Digital Engineering'
  );
  const [projectDescription, setProjectDescription] = useState(
    initialInvoice?.projectDescription ||
      'Production development, responsive mobile testing, modern UI/UX design, and complete source code handover.'
  );

  // Line items
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(
    initialInvoice?.lineItems && initialInvoice.lineItems.length > 0
      ? initialInvoice.lineItems
      : [
          {
            id: 'item-1',
            description: 'Custom React & TypeScript Web Application Architecture',
            quantityOrHours: 16,
            unitRate: 35,
            total: 560,
          },
          {
            id: 'item-2',
            description: 'High-Impact Mobile UI/UX Design & Micro-Animations',
            quantityOrHours: 8,
            unitRate: 35,
            total: 280,
          },
          {
            id: 'item-3',
            description: 'On-Page SEO Optimization, SSL & Production Launch',
            quantityOrHours: 4,
            unitRate: 35,
            total: 140,
          },
        ]
  );

  // Adjustments
  const [discountPercentage, setDiscountPercentage] = useState<number>(initialInvoice?.discountPercentage || 0);
  const [taxPercentage, setTaxPercentage] = useState<number>(initialInvoice?.taxPercentage || 0);
  const [depositPaid, setDepositPaid] = useState<number>(initialInvoice?.depositPaid || 0);

  // Bank Info
  const [bankName, setBankName] = useState(initialInvoice?.bankName || 'Barclays Bank UK');
  const [accountName, setAccountName] = useState(initialInvoice?.accountName || 'Saad Mansuri / Click N Create');
  const [sortCode, setSortCode] = useState(initialInvoice?.sortCode || '20-00-00');
  const [accountNumber, setAccountNumber] = useState(initialInvoice?.accountNumber || '83920194');
  const [iban, setIban] = useState(initialInvoice?.iban || 'GB29BARC20000083920194');
  const [paypalEmail, setPaypalEmail] = useState(initialInvoice?.paypalEmail || 'saadm.clickncreate@gmail.com');
  const [paymentNotes, setPaymentNotes] = useState(
    initialInvoice?.paymentNotes ||
      'Thank you for your business! Please include your Invoice Number in bank transfer reference.'
  );

  const handleLineItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...lineItems];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantityOrHours' || field === 'unitRate') {
      const q = parseFloat(item.quantityOrHours as any) || 0;
      const r = parseFloat(item.unitRate as any) || 0;
      item.total = Math.round(q * r * 100) / 100;
    }
    updated[index] = item;
    setLineItems(updated);
  };

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: `item-${Date.now()}`,
        description: 'New Engineering Milestone Deliverable',
        quantityOrHours: 4,
        unitRate: 35,
        total: 140,
      },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = lineItems.reduce((acc, item) => acc + (parseFloat(item.total as any) || 0), 0);
  const discountAmount = Math.round(((subtotal * discountPercentage) / 100) * 100) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = Math.round(((taxableAmount * taxPercentage) / 100) * 100) / 100;
  const grandTotal = taxableAmount + taxAmount;
  const totalDue = Math.max(0, Math.round((grandTotal - depositPaid) * 100) / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        invoiceNumber,
        date,
        dueDate,
        status,
        currency,
        currencySymbol,
        clientName,
        clientEmail,
        clientBusiness,
        clientAddress,
        clientVat,
        projectTitle,
        projectDescription,
        lineItems,
        subtotal,
        discountPercentage,
        discountAmount,
        taxPercentage,
        taxAmount,
        depositPaid,
        totalDue,
        bankName,
        accountName,
        sortCode,
        accountNumber,
        iban,
        paypalEmail,
        paymentNotes,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0A0A18] text-zinc-950 dark:text-white space-y-6 max-w-4xl mx-auto shadow-2xl transition-colors">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-white/10">
        <div>
          <span className="text-[10px] font-mono text-cyan-600 dark:text-[#00F0FF] uppercase font-bold tracking-wider block">
            [ INVOICE BUILDER & PDF GENERATOR ]
          </span>
          <h2 className="text-2xl font-bold font-display text-zinc-950 dark:text-white">
            {initialInvoice?.id ? 'Edit Client Invoice' : 'Generate Project Completion Invoice'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Invoice Meta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Invoice Number</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-cyan-700 dark:text-[#00F0FF] font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Issue Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] space-y-4 text-xs font-mono">
        <h3 className="text-sm font-bold font-display text-zinc-950 dark:text-white">Client Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Client Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@company.com"
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Company / Brand</label>
            <input
              type="text"
              value={clientBusiness}
              onChange={(e) => setClientBusiness(e.target.value)}
              placeholder="e.g. Apex Retail UK"
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Project Specs */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] space-y-4 text-xs font-mono">
        <h3 className="text-sm font-bold font-display text-zinc-950 dark:text-white">Project Scope Specification</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Project Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Project Description & Deliverables</label>
            <textarea
              rows={2}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Line Items Table Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-display text-zinc-950 dark:text-white font-mono">Itemized Deliverables & Hours</h3>
          <button
            type="button"
            onClick={handleAddLineItem}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/25 text-cyan-800 dark:text-[#00F0FF] text-xs font-mono flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {lineItems.map((item, idx) => (
            <div key={item.id || idx} className="flex items-center gap-2 text-xs font-mono">
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                placeholder="Description"
                className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="number"
                step="0.5"
                value={item.quantityOrHours}
                onChange={(e) => handleLineItemChange(idx, 'quantityOrHours', parseFloat(e.target.value) || 0)}
                placeholder="Hours"
                className="w-20 px-2 py-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-zinc-950 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="number"
                step="1"
                value={item.unitRate}
                onChange={(e) => handleLineItemChange(idx, 'unitRate', parseFloat(e.target.value) || 0)}
                placeholder="Rate"
                className="w-24 px-2 py-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-zinc-950 dark:text-white text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <div className="w-24 px-2 py-2 rounded-xl border border-zinc-200 dark:border-white/5 bg-slate-100 dark:bg-black/20 text-cyan-700 dark:text-[#00F0FF] font-bold text-right font-mono">
                {currencySymbol}
                {item.total}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLineItem(idx)}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Totals & Adjustments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] text-xs font-mono">
        <div className="space-y-3">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-300">Discounts & Deposits</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Discount (%)</label>
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">VAT / Tax (%)</label>
              <input
                type="number"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-zinc-600 dark:text-zinc-400 uppercase mb-1 font-bold">Deposit Already Paid ({currencySymbol})</label>
              <input
                type="number"
                value={depositPaid}
                onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 p-4 rounded-xl bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/5 shadow-xs">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Subtotal:</span>
            <span className="text-zinc-950 dark:text-white font-bold font-mono">
              {currencySymbol}
              {subtotal.toLocaleString()}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Discount ({discountPercentage}%):</span>
              <span>
                -{currencySymbol}
                {discountAmount.toLocaleString()}
              </span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>VAT / Tax ({taxPercentage}%):</span>
              <span>
                +{currencySymbol}
                {taxAmount.toLocaleString()}
              </span>
            </div>
          )}
          {depositPaid > 0 && (
            <div className="flex justify-between text-blue-600 dark:text-blue-400 font-medium">
              <span>Deposit Deduction:</span>
              <span>
                -{currencySymbol}
                {depositPaid.toLocaleString()}
              </span>
            </div>
          )}
          <div className="pt-2 border-t border-zinc-200 dark:border-white/10 flex justify-between items-center text-sm font-bold">
            <span className="font-display text-zinc-950 dark:text-white">TOTAL BALANCE DUE:</span>
            <span className="text-xl font-black text-cyan-600 dark:text-[#00F0FF] font-display">
              {currencySymbol}
              {totalDue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-bold text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer transition-all"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save & Generate Invoice</span>
        </button>
      </div>
    </form>
  );
};
