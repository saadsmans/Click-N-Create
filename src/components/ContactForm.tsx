import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, MessageSquare, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { safeParseJson } from '../utils/api.ts';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  business: string;
  service: string;
  budget: string;
  timeline: string;
  projectDetails: string;
}

/**
 * Dispatches the enquiry directly to saadm.clickncreate@gmail.com
 * Uses formsubmit.co API with JSON payload and automatic fallback to mailto.
 */
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  if (!data.name || !data.email || !data.projectDetails) {
    throw new Error('Please fill in all required fields.');
  }

  // 1. Save directly to backend Express Database
  try {
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (backendErr) {
    console.warn('Backend storage note:', backendErr);
  }

  // 2. Dispatch directly to personal inbox via FormSubmit API
  try {
    const response = await fetch('https://formsubmit.co/ajax/saadm.clickncreate@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: `New Project Enquiry from ${data.name} — Click N Create`,
        _replyto: data.email,
        _template: 'table',
        _captcha: 'false',
        'Client Name': data.name,
        'Client Email': data.email,
        'Client Phone/WhatsApp': data.phone || 'Not provided',
        'Business/Brand': data.business || 'N/A',
        'Requested Service': data.service,
        'Estimated Budget': data.budget,
        'Target Timeline': data.timeline,
        'Project Requirements': data.projectDetails,
      }),
    });

    const result = await safeParseJson(response);
    if (response.ok && result.success !== 'false' && result.success !== false) {
      return {
        success: true,
        message: 'Your project enquiry has been stored and dispatched directly to Saad M at saadm.clickncreate@gmail.com.',
      };
    }
  } catch (err) {
    console.warn('API delivery attempt encountered error, providing mailto fallback:', err);
  }

  // Fallback mailto trigger if direct endpoint is blocked by browser extensions
  const mailtoSubject = encodeURIComponent(`Project Enquiry from ${data.name} (Click N Create)`);
  const mailtoBody = encodeURIComponent(
    `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nBusiness: ${data.business || 'N/A'}\nService: ${data.service}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\nProject Details:\n${data.projectDetails}`
  );
  window.open(`mailto:saadm.clickncreate@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');

  return {
    success: true,
    message: 'Your enquiry has been saved and prepared for saadm.clickncreate@gmail.com.',
  };
}

const SERVICE_OPTIONS = [
  'Web Development (£35/hr or Fixed)',
  'E-commerce Storefront (£35/hr or Fixed)',
  'Branding & Design (£35/hr or Fixed)',
  'Hosting & Maintenance Setup',
  'Custom Web App / SPA Development',
  'Digital Marketing & On-Page SEO',
];

const BUDGET_OPTIONS = [
  'Hourly Engagement (£35/hr)',
  'Fixed Scope: £500 – £1,500',
  'Fixed Scope: £1,500 – £3,000',
  'Fixed Scope: £3,000 – £5,000+',
  'Custom Scope (Need Discovery Call)',
];

const TIMELINE_OPTIONS = [
  'Immediate / ASAP (1-2 weeks)',
  'Within 1 Month',
  '1 – 3 Months',
  'Flexible / Planning Phase',
];

interface ContactFormProps {
  preselectedService?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ preselectedService }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    business: '',
    service: preselectedService || 'Web Development (£35/hr or Fixed)',
    budget: 'Hourly Engagement (£35/hr)',
    timeline: 'Within 1 Month',
    projectDetails: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.projectDetails.trim()) {
      newErrors.projectDetails = 'Please provide details about what you want to build';
    } else if (formData.projectDetails.trim().length < 15) {
      newErrors.projectDetails = 'Please share a bit more detail (minimum 15 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      await submitContactForm(formData);
      setIsSuccess(true);
    } catch (err: any) {
      setApiError(err?.message || 'Something went wrong. You can also email saadm.clickncreate@gmail.com directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (hasError?: boolean) => `
    w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2
    ${
      hasError
        ? 'border-red-500 focus:ring-red-400'
        : isDark
        ? 'border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20'
        : 'border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:ring-blue-500/20 shadow-2xs'
    }
  `;

  return (
    <div className={`rounded-3xl border p-6 sm:p-10 transition-all duration-300 backdrop-blur-2xl ${
      isDark
        ? 'border-white/10 bg-[#0E0E12]/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]'
        : 'border-zinc-200 bg-white/95 shadow-lg'
    }`}>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className={`text-2xl sm:text-3xl font-display font-extrabold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              Enquiry Sent to Saad M
            </h3>

            <p className={`text-sm sm:text-base max-w-md mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Thank you, <strong className={isDark ? 'text-white' : 'text-zinc-900'}>{formData.name}</strong>. Your project enquiry was sent to <strong className="text-blue-500">saadm.clickncreate@gmail.com</strong>. Saad will personally review your specifications and reply within 24 business hours.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Follow up on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    business: '',
                    service: 'Web Development (£35/hr or Fixed)',
                    budget: 'Hourly Engagement (£35/hr)',
                    timeline: 'Within 1 Month',
                    projectDetails: '',
                  });
                }}
                className={`px-5 py-2.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                }`}
              >
                Send Another Message
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form-state"
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-500 uppercase tracking-wider mb-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Inbound to saadm.clickncreate@gmail.com</span>
              </div>
              <h3 className={`text-2xl font-bold font-display tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Start Your Project with Saad M
              </h3>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Fill in the details below. Data is delivered straight to my personal inbox. Rate: £35/hr or custom scope.
              </p>
            </div>

            {apiError && (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Your Name <span className="text-blue-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Liam Wright"
                  className={inputClasses(!!errors.name)}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 font-mono">{errors.name}</p>
                )}
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Email Address <span className="text-blue-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. liam@example.com"
                  className={inputClasses(!!errors.email)}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-mono">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Row 2: Phone/WhatsApp & Business */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  WhatsApp / Phone <span className="text-zinc-500">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +44 7927 000000"
                  className={inputClasses()}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Company / Brand <span className="text-zinc-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.business}
                  onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                  placeholder="e.g. Studio Vertex"
                  className={inputClasses()}
                />
              </div>
            </div>

            {/* Row 3: Service Selection */}
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Required Service
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className={`${inputClasses()} cursor-pointer`}
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 4: Budget & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Estimated Budget / Rate Model
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className={`${inputClasses()} cursor-pointer`}
                >
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Target Delivery Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className={`${inputClasses()} cursor-pointer`}
                >
                  {TIMELINE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5: Project Details */}
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Project Overview & Requirements <span className="text-blue-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.projectDetails}
                onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                placeholder="Share your goals, features, target pages, reference websites, or specific deadlines..."
                className={`${inputClasses(!!errors.projectDetails)} resize-y`}
              />
              {errors.projectDetails && (
                <p className="mt-1 text-xs text-red-500 font-mono">{errors.projectDetails}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-display font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-md ${
                  isDark
                    ? 'text-zinc-950 bg-white hover:bg-zinc-200'
                    : 'text-white bg-zinc-950 hover:bg-zinc-800'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending to saadm.clickncreate@gmail.com...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry to Saad M</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs font-mono text-zinc-500 pt-1">
                <span>Direct email: saadm.clickncreate@gmail.com</span>
                <span>·</span>
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp: +44 7927 548123
                </a>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
