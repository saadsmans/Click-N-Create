import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Share2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Check,
  Send,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { Invoice, InvoiceLineItem } from '../types/index.ts';
import { ClickNCreateLogo } from './ClickNCreateLogo.tsx';

interface InvoiceViewProps {
  invoice: Invoice;
  onBack?: () => void;
  onUpdateStatus?: (id: string, newStatus: Invoice['status']) => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, onBack, onUpdateStatus }) => {
  const printableRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.status === 'overdue';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] no-print">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-zinc-400">Invoice:</span>
            <span className="text-sm font-mono font-bold text-[#00F0FF]">{invoice.invoiceNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Badge & Selector */}
          {onUpdateStatus && (
            <select
              value={invoice.status}
              onChange={(e) => onUpdateStatus(invoice.id, e.target.value as any)}
              className="text-xs font-mono px-3 py-2 rounded-xl border bg-black/40 border-white/20 text-white cursor-pointer"
            >
              <option value="draft">Status: Draft</option>
              <option value="sent">Status: Sent</option>
              <option value="paid">Status: Paid</option>
              <option value="overdue">Status: Overdue</option>
            </select>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38bdf8] text-black font-display font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div
        ref={printableRef}
        className="p-8 sm:p-12 rounded-3xl border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#070712] text-slate-900 dark:text-white shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white print:text-black"
      >
        {/* Subtle Cyber Glow Watermark */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 print:hidden" />

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-black/[0.08] dark:border-white/[0.08] mb-8">
          <div>
            <div className="mb-4">
              <ClickNCreateLogo size="lg" />
            </div>
            <div className="text-xs font-mono text-zinc-500 space-y-1">
              <p className="font-bold text-zinc-800 dark:text-zinc-200">Click N Create Digital Studio</p>
              <p>Lead Engineer: Saad M</p>
              <p>Email: saadm.clickncreate@gmail.com</p>
              <p>WhatsApp: +44 7927 548123</p>
              <p>Web: clickncreate.dev · London, United Kingdom</p>
            </div>
          </div>

          <div className="sm:text-right">
            <div className="inline-block mb-3">
              <span
                className={`text-xs font-mono px-3.5 py-1 rounded-full uppercase tracking-wider font-black ${
                  isPaid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isOverdue
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                }`}
              >
                {invoice.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-2">
              INVOICE
            </h1>
            <div className="text-xs font-mono text-zinc-500 space-y-1">
              <p>
                <span className="text-zinc-400">Invoice No:</span>{' '}
                <span className="font-bold text-slate-900 dark:text-white">{invoice.invoiceNumber}</span>
              </p>
              <p>
                <span className="text-zinc-400">Issue Date:</span>{' '}
                <span>{new Date(invoice.date).toLocaleDateString()}</span>
              </p>
              <p>
                <span className="text-zinc-400">Due Date:</span>{' '}
                <span className="font-semibold text-rose-400">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bill To & Project Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-black/[0.08] dark:border-white/[0.08] mb-8 text-xs font-mono">
          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] space-y-1.5">
            <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider block mb-2">
              BILL TO CLIENT:
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-display">
              {invoice.clientName || 'Client Name'}
            </p>
            {invoice.clientBusiness && <p className="font-semibold">{invoice.clientBusiness}</p>}
            <p className="text-zinc-500">{invoice.clientEmail}</p>
            {invoice.clientAddress && <p className="text-zinc-500">{invoice.clientAddress}</p>}
            {invoice.clientVat && <p className="text-zinc-500">VAT/Tax ID: {invoice.clientVat}</p>}
          </div>

          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] space-y-1.5">
            <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider block mb-2">
              PROJECT SPECIFICATION:
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-display">
              {invoice.projectTitle}
            </p>
            <p className="text-zinc-500 leading-relaxed">
              {invoice.projectDescription || 'Full-stack development, custom UI/UX design, responsive testing, and complete source code delivery.'}
            </p>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black/[0.1] dark:border-white/[0.1] text-zinc-500 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-2">Deliverable / Scope Description</th>
                <th className="py-3 px-2 text-center w-24">Hours / Qty</th>
                <th className="py-3 px-2 text-right w-28">Rate ({invoice.currencySymbol})</th>
                <th className="py-3 px-2 text-right w-28">Amount ({invoice.currencySymbol})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
              {(invoice.lineItems || []).map((item: InvoiceLineItem, idx: number) => (
                <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3.5 px-2 font-medium text-slate-900 dark:text-white">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-2 text-center text-zinc-500">{item.quantityOrHours}</td>
                  <td className="py-3.5 px-2 text-right text-zinc-500">
                    {invoice.currencySymbol}
                    {item.unitRate}
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold text-slate-900 dark:text-white">
                    {invoice.currencySymbol}
                    {item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary Calculation Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 pb-8 border-b border-black/[0.08] dark:border-white/[0.08] mb-8">
          {/* Payment Details */}
          <div className="max-w-md text-xs font-mono space-y-2 p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] w-full sm:w-auto flex-1">
            <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider block mb-2">
              PAYMENT INSTRUCTIONS:
            </span>
            <div className="grid grid-cols-2 gap-2 text-zinc-500">
              <span>Bank Name:</span>
              <span className="text-slate-900 dark:text-white font-semibold">{invoice.bankName}</span>
              <span>Account Name:</span>
              <span className="text-slate-900 dark:text-white font-semibold">{invoice.accountName}</span>
              <span>Sort Code:</span>
              <span className="text-slate-900 dark:text-white font-semibold">{invoice.sortCode}</span>
              <span>Account No:</span>
              <span className="text-slate-900 dark:text-white font-semibold">{invoice.accountNumber}</span>
              {invoice.iban && (
                <>
                  <span>IBAN:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{invoice.iban}</span>
                </>
              )}
              {invoice.paypalEmail && (
                <>
                  <span>PayPal:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{invoice.paypalEmail}</span>
                </>
              )}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="w-full sm:w-72 text-xs font-mono space-y-2">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {invoice.currencySymbol}
                {invoice.subtotal.toLocaleString()}
              </span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({invoice.discountPercentage}%):</span>
                <span>
                  -{invoice.currencySymbol}
                  {invoice.discountAmount.toLocaleString()}
                </span>
              </div>
            )}

            {invoice.taxAmount > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>VAT / Tax ({invoice.taxPercentage}%):</span>
                <span>
                  +{invoice.currencySymbol}
                  {invoice.taxAmount.toLocaleString()}
                </span>
              </div>
            )}

            {invoice.depositPaid > 0 && (
              <div className="flex justify-between text-blue-400">
                <span>Deposit Already Paid:</span>
                <span>
                  -{invoice.currencySymbol}
                  {invoice.depositPaid.toLocaleString()}
                </span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-black/[0.1] dark:border-white/[0.1] flex justify-between items-center text-sm font-bold">
              <span className="font-display">TOTAL BALANCE DUE:</span>
              <span className="text-xl font-black font-display text-[#00F0FF]">
                {invoice.currencySymbol}
                {invoice.totalDue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="text-center text-xs font-mono text-zinc-500 space-y-1">
          <p className="font-medium text-slate-800 dark:text-zinc-300">{invoice.paymentNotes}</p>
          <p className="text-[10px]">
            Thank you for choosing Click N Create. For questions regarding this invoice, contact Saad M at{' '}
            <span className="text-[#00F0FF]">saadm.clickncreate@gmail.com</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
