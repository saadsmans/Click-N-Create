import React from 'react';
import { MessageSquare, Mail, Phone, Linkedin, Clock, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
import { ContactForm } from '../components/ContactForm.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

export const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('contact');

  const phoneDisplay = cms.phoneNumber || SITE_CONFIG.phone;
  const emailDisplay = cms.emailAddress || SITE_CONFIG.email;
  const whatsappDisplay = cms.whatsappNumber || SITE_CONFIG.phone;

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-hidden w-full max-w-full">
      <SEOHead
        title="Contact Saad M | Hire Freelance Web Developer · Click N Create"
        description="Get in touch directly with Saad M for new web development projects, bespoke quotes, WhatsApp chats, or quick questions. Response within 24 hours."
        canonicalPath="/contact"
        keywords={[
          'contact freelance web developer',
          'hire Saad M developer',
          'Click N Create contact',
          'request website quote',
          'WhatsApp freelance developer'
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Collaboration Context & Verified Contact Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
                isDark ? 'border-white/10 bg-white/5 text-blue-400' : 'border-zinc-300 bg-white text-blue-600 shadow-2xs font-semibold'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{cms.badgeText || 'Direct Inbound to Saad M'}</span>
              </div>

              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.05] ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                {cms.heroTitle || "LET'S TALK ABOUT YOUR"} <span className="text-luxury-gradient">{cms.heroHighlight || 'PROJECT.'}</span>
              </h1>

              <p className={`mt-5 text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {cms.heroSubtitle || 'You communicate directly with Saad M. Standard rate is £35/hr, with custom milestone scopes available. Messages submit straight to my personal inbox.'}
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="space-y-3 pt-1">
              {/* WhatsApp Card */}
              <a
                href={cms.whatsappNumber ? `https://wa.me/${cms.whatsappNumber.replace(/[^0-9]/g, '')}` : SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                  isDark
                    ? 'border-white/10 bg-white/[0.025] hover:border-emerald-500/40 hover:bg-emerald-500/5'
                    : 'border-zinc-200 bg-white hover:border-emerald-500/50 hover:bg-emerald-50/50 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase block">WhatsApp (Direct Chat)</span>
                    <span className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                      {whatsappDisplay}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${emailDisplay}`}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                  isDark
                    ? 'border-white/10 bg-white/[0.025] hover:border-blue-500/40 hover:bg-blue-500/5'
                    : 'border-zinc-200 bg-white hover:border-blue-500/50 hover:bg-blue-50/50 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase block">Direct Email</span>
                    <span className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                      {emailDisplay}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* LinkedIn Card */}
              <a
                href={cms.linkedinUrl || SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                  isDark
                    ? 'border-white/10 bg-white/[0.025] hover:border-indigo-500/40 hover:bg-indigo-500/5'
                    : 'border-zinc-200 bg-white hover:border-indigo-500/50 hover:bg-indigo-50/50 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase block">Professional Profile</span>
                    <span className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                      Saad M on LinkedIn
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Availability Badge */}
            <div className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
              isDark
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                : 'border-emerald-600/20 bg-emerald-50 text-emerald-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{cms.availabilityText || 'Rate: £35/hr · Open for 2026 Projects'}</span>
              </div>
              <span className="font-bold">{cms.availabilityStatus || 'Active'}</span>
            </div>
          </div>

          {/* Right Column: Project Enquiry Form (Dispatches to Mansurisaad28012@gmail.com) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};
