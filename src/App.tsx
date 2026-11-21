/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { CustomizationProvider } from './context/CustomizationContext.tsx';
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CookieConsent } from './components/CookieConsent.tsx';
import { AnalyticsTracker } from './components/AnalyticsTracker.tsx';
import { LivePreviewBar } from './components/LivePreviewBar.tsx';

// Eager initial landing page; code-split secondary routes & heavy modals for instant first paint
import { HomePage } from './pages/HomePage.tsx';

const ServicesPage = lazy(() => import('./pages/ServicesPage.tsx').then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage.tsx').then((m) => ({ default: m.ServiceDetailPage })));
const AboutPage = lazy(() => import('./pages/AboutPage.tsx').then((m) => ({ default: m.AboutPage })));
const MyWorksPage = lazy(() => import('./pages/MyWorksPage.tsx').then((m) => ({ default: m.MyWorksPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage.tsx').then((m) => ({ default: m.PortfolioPage })));
const PricingPage = lazy(() => import('./pages/PricingPage.tsx').then((m) => ({ default: m.PricingPage })));
const ProcessPage = lazy(() => import('./pages/ProcessPage.tsx').then((m) => ({ default: m.ProcessPage })));
const FAQPage = lazy(() => import('./pages/FAQPage.tsx').then((m) => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import('./pages/ContactPage.tsx').then((m) => ({ default: m.ContactPage })));
const EstimatorPage = lazy(() => import('./pages/EstimatorPage.tsx').then((m) => ({ default: m.EstimatorPage })));
const StandardsPage = lazy(() => import('./pages/StandardsPage.tsx').then((m) => ({ default: m.StandardsPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.tsx').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage.tsx').then((m) => ({ default: m.TermsPage })));
const AdminPage = lazy(() => import('./pages/AdminPage.tsx').then((m) => ({ default: m.AdminPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx').then((m) => ({ default: m.NotFoundPage })));
const ThemeStudioModal = lazy(() => import('./components/ThemeStudioModal.tsx').then((m) => ({ default: m.ThemeStudioModal })));

function normalizePath(rawPath: string): string {
  if (!rawPath) return '/';
  let cleaned = rawPath.trim();
  if (cleaned.includes('?')) cleaned = cleaned.split('?')[0];
  if (cleaned.includes('#') && !cleaned.startsWith('/#')) cleaned = cleaned.split('#')[0];
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned.toLowerCase() || '/';
}

const PageChunkFallback: React.FC = () => (
  <div className="min-h-[65vh] w-full flex items-center justify-center pt-28">
    <div className="w-7 h-7 rounded-full border-2 border-[#38BDF8]/30 border-t-[#38BDF8] animate-spin" />
  </div>
);

function AppContent() {
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  // Idle-prefetch primary navigation chunks so route transitions feel instant
  useEffect(() => {
    const prefetchCoreRoutes = () => {
      import('./pages/MyWorksPage.tsx').catch(() => {});
      import('./pages/PortfolioPage.tsx').catch(() => {});
      import('./pages/ServicesPage.tsx').catch(() => {});
      import('./pages/EstimatorPage.tsx').catch(() => {});
      import('./pages/AboutPage.tsx').catch(() => {});
    };

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(prefetchCoreRoutes, { timeout: 2200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(prefetchCoreRoutes, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Alt + A or Cmd/Ctrl + Shift + A to open Admin Hub
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        handleNavigate('/admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (path: string) => {
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');
      const normalizedCurrent = normalizePath(currentPath);
      if (normalizedCurrent !== '/') {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const normalizedTarget = normalizePath(path);
    if (normalizedTarget !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(normalizedTarget);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCurrentPage = () => {
    const path = normalizePath(currentPath);

    if (path === '/' || path === '') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    if (path === '/services') {
      return <ServicesPage onNavigate={handleNavigate} />;
    }

    if (path === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    if (path === '/my-works' || path === '/works') {
      return <MyWorksPage onNavigate={handleNavigate} />;
    }

    if (path === '/portfolio') {
      return <PortfolioPage onNavigate={handleNavigate} />;
    }

    if (path === '/pricing') {
      return <PricingPage onNavigate={handleNavigate} />;
    }

    if (path === '/estimator') {
      return <EstimatorPage onNavigate={handleNavigate} />;
    }

    if (path === '/process') {
      return <ProcessPage onNavigate={handleNavigate} />;
    }

    if (path === '/standards') {
      return <StandardsPage onNavigate={handleNavigate} />;
    }

    if (path === '/faq') {
      return <FAQPage onNavigate={handleNavigate} />;
    }

    if (path === '/contact') {
      return <ContactPage />;
    }

    if (path === '/admin' || path === '/backend' || path === '/admin/backend' || path === '/dashboard') {
      return <AdminPage onNavigate={handleNavigate} initialTab={path === '/backend' ? 'system_ops' : undefined} />;
    }

    if (path === '/privacy-policy') {
      return <PrivacyPolicyPage onNavigate={handleNavigate} />;
    }

    if (path === '/terms') {
      return <TermsPage onNavigate={handleNavigate} />;
    }

    if (path.startsWith('/services/')) {
      const slug = path.replace('/services/', '').replace(/\/$/, '');
      return <ServiceDetailPage slug={slug} onNavigate={handleNavigate} />;
    }

    return <NotFoundPage onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 relative flex flex-col justify-between overflow-x-clip w-full max-w-full">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Consolidated Real-Time Visitor Analytics Tracker */}
      <AnalyticsTracker currentPath={currentPath} />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Floating Interactive Live Theme Preview Controller */}
      <LivePreviewBar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenThemeStudio={() => setIsThemeStudioOpen(true)}
      />

      {/* Fixed Sticky Glass Navbar with Typographic Wordmark & Theme Toggle */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenThemeStudio={() => setIsThemeStudioOpen(true)}
      />

      {/* Main Page Viewport with Crisp GPU-Composited Page Transitions */}
      <main className="flex-1 w-full max-w-full overflow-x-clip relative">
        <Suspense fallback={<PageChunkFallback />}>
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {renderCurrentPage()}
          </motion.div>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* WordPress & Shopify Grade 100 Themes & 115 Fonts Studio Modal (loaded only when opened) */}
      {isThemeStudioOpen && (
        <Suspense fallback={null}>
          <ThemeStudioModal
            isOpen={isThemeStudioOpen}
            onClose={() => setIsThemeStudioOpen(false)}
          />
        </Suspense>
      )}

      {/* GDPR / UK DPA Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <CustomizationProvider>
          <AppContent />
        </CustomizationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
