import React from 'react';
import { MessageSquare, Mail, Linkedin, Instagram, Sparkles, ArrowUpRight } from 'lucide-react';
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

  const emailDisplay = cms.emailAddress || SITE_CONFIG.email;
  const whatsappDisplay = cms.whatsappNumber || SITE_CONFIG.phone;

  return (
    <div className="pt-28 pb-20 md:pt-36 relative overflow-x-clip w-full max-w-full">
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
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
                isDark
                  ? 'border-[#38BDF8]/30 bg-[#0C1222]/90 text-[#38BDF8]'
                  : 'border-[#1D4ED8]/30 bg-[#F3E9DC]/75 text-[#1E40AF] shadow-2xs font-semibold'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{cms.badgeText || 'Direct Inbound to Saad M'}</span>
              </div>

              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.05] ${
                isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
              }`}>
                {cms.heroTitle || "LET'S TALK ABOUT YOUR"} <span className="text-luxury-gradient">{cms.heroHighlight || 'PROJECT.'}</span>
              </h1>

              <p className={`mt-5 text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
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
                    ? 'border-white/10 bg-[#0C1222]/85 hover:border-emerald-500/40 hover:bg-emerald-500/5'
                    : 'border-black/10 bg-white hover:border-emerald-500/50 hover:bg-emerald-50/50 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs font-mono uppercase block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>WhatsApp (Direct Chat)</span>
                    <span className={`text-sm font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
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
                    ? 'border-white/10 bg-[#0C1222]/85 hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/5'
                    : 'border-black/10 bg-white hover:border-[#1D4ED8]/50 hover:bg-[#F3E9DC]/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-[#38BDF8]/10 text-[#38BDF8]' : 'bg-[#F3E9DC] text-[#1D4ED8]'
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs font-mono uppercase block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Direct Email</span>
                    <span className={`text-sm font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                      {emailDisplay}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'
                }`} />
              </a>

              {/* LinkedIn Card */}
              <a
                href={cms.linkedinUrl || SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                  isDark
                    ? 'border-white/10 bg-[#0C1222]/85 hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/5'
                    : 'border-black/10 bg-white hover:border-[#1D4ED8]/50 hover:bg-[#F3E9DC]/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-[#94A3B8]/10 text-[#94A3B8]' : 'bg-[#EAE6DF] text-[#475569]'
                  }`}>
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs font-mono uppercase block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Professional Profile</span>
                    <span className={`text-sm font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                      Saad M on LinkedIn
                    </span>
                  </div>
                </div>
                <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`} />
              </a>

              {/* Instagram Card */}
              <a
                href={cms.instagramUrl || SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                  isDark
                    ? 'border-white/10 bg-[#0C1222]/85 hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/5'
                    : 'border-black/10 bg-white hover:border-[#1D4ED8]/50 hover:bg-[#F3E9DC]/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-[#7DD3FC]/10 text-[#7DD3FC]' : 'bg-[#F3E9DC] text-[#1D4ED8]'
                  }`}>
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs font-mono uppercase block ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>Instagram Direct</span>
                    <span className={`text-sm font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                      @saads.125 on Instagram
                    </span>
                  </div>
                </div>
                <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${
                  isDark ? 'text-[#7DD3FC]' : 'text-[#1D4ED8]'
                }`} />
              </a>
            </div>

            {/* Availability Badge */}
            <div className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
              isDark
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                : 'border-emerald-600/20 bg-emerald-50 text-emerald-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{cms.availabilityText || 'Rate: £35/hr · Open for 2026 Projects'}</span>
              </div>
              <span className="font-bold">{cms.availabilityStatus || 'Active'}</span>
            </div>
          </div>

          {/* Right Column: Project Enquiry Form (Dispatches to saadm.clickncreate@gmail.com) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};
