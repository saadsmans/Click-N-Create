import React from 'react';
import {
  ShieldCheck,
  Gauge,
  CheckCircle2,
  Smartphone,
  Eye,
  Lock,
  Code2,
  Terminal,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading.tsx';
import {
  DEVICE_TESTING_MATRIX,
  SEO_SCHEMA_CHECKLIST,
  SECURITY_HEADER_SPECS,
} from '../data/websiteContent.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface StandardsPageProps {
  onNavigate: (path: string) => void;
}

export const StandardsPage: React.FC<StandardsPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getPageContent } = useCustomization();
  const cms = getPageContent('standards') || {};

  const BENCHMARKS = [
    {
      metric: '98+',
      label: 'Google Lighthouse Performance',
      detail: 'Aggressive asset compression, tree-shaking, and critical CSS rendering.',
    },
    {
      metric: '<0.8s',
      label: 'Largest Contentful Paint (LCP)',
      detail: 'Hero typography and assets render instantaneously on mobile networks.',
    },
    {
      metric: '0.00',
      label: 'Cumulative Layout Shift (CLS)',
      detail: 'Zero visual jarring or jumping elements as components mount.',
    },
    {
      metric: '100%',
      label: 'WCAG 2.1 AA Accessibility',
      detail: 'High optical contrast, screen reader aria tags, keyboard navigation.',
    },
  ];

  const PILLARS = [
    {
      icon: Gauge,
      title: 'Sub-Second Speed & Core Web Vitals',
      description:
        'Every millisecond of latency costs conversions. I engineer lightweight modern React builds powered by Vite and Tailwind CSS. By omitting heavy WordPress plugin stacks, page speed scores consistently hit 95–100 across mobile and desktop.',
      checklist: [
        'Automated image conversion to WebP format with responsive srcset',
        'Tree-shaken JavaScript bundles with dynamic route-based code splitting',
        'Preloaded critical web fonts to eliminate Flash of Unstyled Text (FOUT)',
        'Zero render-blocking external scripts or third-party trackers',
      ],
    },
    {
      icon: Eye,
      title: 'WCAG AA Accessibility & Inclusivity',
      description:
        'Digital experiences should be accessible to all humans regardless of device, vision, or motor capability. Click N Create builds with strict semantic HTML standards.',
      checklist: [
        'Keyboard focus states with visible high-contrast ring indicators',
        'Calibrated color contrast ratios (exceeding 4.5:1 for body copy)',
        'Full screen reader support with descriptive aria labels and landmarks',
        'Respects user OS preferences for reduced motion (prefers-reduced-motion)',
      ],
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Responsive Ergonomics',
      description:
        'Over 60% of modern web traffic originates from mobile smartphones. I design and code mobile-first, ensuring natural thumb-touch zones, fluid typography, and zero horizontal scroll anomalies.',
      checklist: [
        'Continuous fluid font sizing scaled across viewport widths',
        'Minimum 48px touch targets for mobile interactive buttons',
        'Swipeable drawer menus engineered for single-hand mobile use',
        'Rigorous testing across 320px, 375px, 768px, 1024px, and 1920px viewports',
      ],
    },
    {
      icon: Code2,
      title: 'Type-Safe Architecture & Clean Code',
      description:
        'Code maintainability is non-negotiable. I write strictly typed TypeScript with modular functional components. This ensures your website can be easily extended by any developer without breaking.',
      checklist: [
        'Strict TypeScript validation preventing runtime errors',
        'Modular atomic component library organized by clear responsibility',
        'Separation of data models from presentational visual components',
        'Git version-controlled repository with clean commit history',
      ],
    },
    {
      icon: Lock,
      title: 'Modern Security & Privacy Standards',
      description:
        'Protecting your business and your users from malicious actors and data vulnerabilities.',
      checklist: [
        'Strict Content Security Policy (CSP) and HTTP security headers',
        'Auto-renewing 256-bit TLS/SSL encryption on all domain endpoints',
        'Zero sensitive client secrets exposed in frontend source code',
        'Compliant form inputs with client-side regex sanitization and validation',
      ],
    },
    {
      icon: ShieldCheck,
      title: '100% Intellectual Property Ownership',
      description:
        'You pay for custom development, and you own every single asset upon final invoice settlement. No recurring proprietary software fees, no vendor lock-in, and full source code handoff.',
      checklist: [
        'Full GitHub repository ownership transferred to your organization',
        'Domain DNS and cloud hosting accounts configured under your credentials',
        'Exported design assets and style tokens provided in clean documentation',
        '30-day post-launch warranty included with all custom builds',
      ],
    },
  ];

  return (
    <div className="pt-28 pb-24 md:pt-36 relative overflow-x-clip w-full max-w-full">
      <SEOHead
        title="Technical Standards, Core Web Vitals & Speed | Click N Create"
        description="Review Click N Create's rigorous technical standards: 98+ Google Lighthouse scores, sub-second load times, WCAG AA accessibility, and 100% clean code ownership."
        canonicalPath="/standards"
        keywords={[
          'Core Web Vitals freelance developer',
          'fast website developer',
          'Google Lighthouse 98 score',
          'accessible web development',
          'clean TypeScript code standards'
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
              isDark
                ? 'border-[#38BDF8]/30 bg-[#0C1222]/90 text-[#38BDF8]'
                : 'border-[#1D4ED8]/30 bg-[#F3E9DC]/75 text-[#1E40AF] shadow-2xs font-semibold'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{cms.badgeText || 'Engineering Principles & Code Quality'}</span>
          </div>

          <h1
            className={`text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] ${
              isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
            }`}
          >
            {cms.heroTitle || 'TECHNICAL'} <span className="text-luxury-gradient">{cms.heroHighlight || 'STANDARDS'}</span>
          </h1>

          <p
            className={`mt-5 text-base sm:text-xl leading-relaxed ${
              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
            }`}
          >
            {cms.heroSubtitle || 'Behind the elevated design lies uncompromising frontend engineering. Here is how Saad M builds websites for speed, accessibility, bulletproof security, and seamless long-term scalability.'}
          </p>
        </div>

        {/* Benchmarks Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {BENCHMARKS.map((b) => (
            <div
              key={b.label}
              className={`p-6 rounded-2xl border transition-colors ${
                isDark
                  ? 'border-white/10 bg-[#0C1222]/85'
                  : 'border-black/10 bg-white shadow-2xs'
              }`}
            >
              <div className={`text-3xl sm:text-4xl font-black font-display mb-1 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                {b.metric}
              </div>
              <div
                className={`text-xs font-bold uppercase tracking-wider font-mono mb-2 ${
                  isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                }`}
              >
                {b.label}
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}
              >
                {b.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Pillars Grid */}
        <div className="space-y-6">
          <SectionHeading
            category="The Six Pillars"
            title="HOW EVERY CLICK N CREATE WEBSITE IS CONSTRUCTED"
            subtitle="Industry-leading standards applied uniformly across every project."
            className="mb-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.title}
                  className={`p-7 rounded-3xl border flex flex-col justify-between transition-all ${
                    isDark
                      ? 'border-white/10 bg-[#0C1222]/85 hover:border-[#38BDF8]/35'
                      : 'border-black/10 bg-white hover:border-[#1D4ED8]/40 shadow-2xs'
                  }`}
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                        isDark ? 'bg-[#1A1D25] text-[#38BDF8]' : 'bg-[#F3E9DC] text-[#1D4ED8]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3
                      className={`text-lg font-bold font-display mb-3 ${
                        isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
                      }`}
                    >
                      {pillar.title}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                        isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                      }`}
                    >
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2.5">
                    {pillar.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                        <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#475569]'}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================== DEVICE QA, SEO SCHEMA & SECURITY SPECS ===================== */}
        <div className="mt-20 pt-16 border-t border-black/[0.08] dark:border-white/[0.08] space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Device & Viewport Testing Matrix */}
            <div className="lg:col-span-7 space-y-4">
              <span className={`text-xs font-mono uppercase tracking-wider font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                Multi-Viewport QA Protocol
              </span>
              <h2 className={`text-2xl font-extrabold font-display tracking-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                Devices &amp; Screen Widths Tested Before Launch
              </h2>

              <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'}`}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-xs font-mono uppercase ${isDark ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-black/10 bg-slate-50 text-slate-700'}`}>
                      <th className="py-3.5 px-4 font-bold">Device Tier</th>
                      <th className="py-3.5 px-4 font-bold">Viewport Width</th>
                      <th className="py-3.5 px-4 font-bold">Reference Targets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 dark:divide-white/10 text-xs sm:text-sm">
                    {DEVICE_TESTING_MATRIX.map((row) => (
                      <tr key={row.category}>
                        <td className={`py-3.5 px-4 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.category}</td>
                        <td className={`py-3.5 px-4 font-mono tabular-nums ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>{row.width}</td>
                        <td className={`py-3.5 px-4 ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>{row.targets}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Technical SEO Verification Checklist */}
            <div className="lg:col-span-5 space-y-4">
              <span className={`text-xs font-mono uppercase tracking-wider font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                Search &amp; Social Previews
              </span>
              <h2 className={`text-2xl font-extrabold font-display tracking-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                Technical SEO Sign-Off List
              </h2>

              <ul className={`p-6 rounded-2xl border space-y-3 text-xs sm:text-sm ${isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'}`}>
                {SEO_SCHEMA_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`} />
                    <span className={isDark ? 'text-[#F1F5F9]/85' : 'text-[#334155]'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Security Controls Matrix */}
          <div className="space-y-4">
            <h3 className={`text-xl font-bold font-display ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              Security &amp; Header Hardening Baseline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SECURITY_HEADER_SPECS.map((sec) => (
                <div
                  key={sec.control}
                  className={`p-5 rounded-2xl border space-y-2 ${isDark ? 'border-white/10 bg-[#0C1222]/85' : 'border-black/10 bg-white shadow-2xs'}`}
                >
                  <div className={`text-xs font-mono font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#1D4ED8]'}`}>
                    {sec.control}
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    {sec.spec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div
          className={`mt-20 p-8 sm:p-12 rounded-3xl border text-center max-w-4xl mx-auto ${
            isDark ? 'border-white/10 bg-[#0C1222]/90' : 'border-black/10 bg-white shadow-xl'
          }`}
        >
          <h2
            className={`text-2xl sm:text-3xl font-extrabold font-display mb-3 ${
              isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
            }`}
          >
            Ready to upgrade your website with real engineering standards?
          </h2>
          <p
            className={`text-sm sm:text-base max-w-xl mx-auto mb-8 ${
              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
            }`}
          >
            Available at a transparent standard rate of £35/hr, or as a fixed milestone package with full cost predictability.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/estimator')}
              className={`py-3 px-6 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-colors shadow-lg cursor-pointer ${
                isDark ? 'bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#060913]' : 'bg-[#1D4ED8] hover:bg-[#1D4ED8] text-white'
              }`}
            >
              Calculate Project Estimate
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className={`py-3 px-6 rounded-xl border font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-[#1A1D25] hover:bg-[#38BDF8]/15 text-[#F1F5F9]'
                  : 'border-black/15 bg-[#F3F6FA] hover:bg-[#F3E9DC] text-[#0F172A]'
              }`}
            >
              Contact Saad M Direct
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
