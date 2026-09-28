import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Zap,
  Gauge,
  CheckCircle2,
  Cpu,
  Smartphone,
  Eye,
  Lock,
  Code2,
  FileCode,
  ArrowUpRight,
  Terminal,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { SITE_CONFIG } from '../data/site.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface StandardsPageProps {
  onNavigate: (path: string) => void;
}

export const StandardsPage: React.FC<StandardsPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <div className="pt-28 pb-24 md:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-4 ${
              isDark
                ? 'border-white/10 bg-white/5 text-blue-400'
                : 'border-zinc-300 bg-white text-blue-600 shadow-2xs font-semibold'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Engineering Principles & Code Quality</span>
          </div>

          <h1
            className={`text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}
          >
            TECHNICAL <span className="text-luxury-gradient">STANDARDS</span>
          </h1>

          <p
            className={`mt-5 text-base sm:text-xl leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            Behind the elevated design lies uncompromising frontend engineering. Here is how Saad M builds websites for speed, accessibility, bulletproof security, and seamless long-term scalability.
          </p>
        </div>

        {/* Benchmarks Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {BENCHMARKS.map((b) => (
            <div
              key={b.label}
              className={`p-6 rounded-2xl border transition-colors ${
                isDark
                  ? 'border-white/10 bg-white/[0.02]'
                  : 'border-zinc-200 bg-white shadow-2xs'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black font-display text-blue-600 dark:text-blue-400 mb-1">
                {b.metric}
              </div>
              <div
                className={`text-xs font-bold uppercase tracking-wider font-mono mb-2 ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}
              >
                {b.label}
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
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
                      ? 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-2xs'
                  }`}
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                        isDark ? 'bg-white/5 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3
                      className={`text-lg font-bold font-display mb-3 ${
                        isDark ? 'text-white' : 'text-zinc-950'
                      }`}
                    >
                      {pillar.title}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                        isDark ? 'text-zinc-400' : 'text-zinc-600'
                      }`}
                    >
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2.5">
                    {pillar.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
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

        {/* CTA Bar */}
        <div
          className={`mt-20 p-8 sm:p-12 rounded-3xl border text-center max-w-4xl mx-auto ${
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white shadow-xl'
          }`}
        >
          <h2
            className={`text-2xl sm:text-3xl font-extrabold font-display mb-3 ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}
          >
            Ready to upgrade your website with real engineering standards?
          </h2>
          <p
            className={`text-sm sm:text-base max-w-xl mx-auto mb-8 ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            Available at a transparent standard rate of £35/hr, or as a fixed milestone package with full cost predictability.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/estimator')}
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
            >
              Calculate Project Estimate
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className={`py-3 px-6 rounded-xl border font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
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
