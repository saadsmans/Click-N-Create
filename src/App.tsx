/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { CustomizationProvider } from './context/CustomizationContext.tsx';
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CookieConsent } from './components/CookieConsent.tsx';
import { RealtimePresence } from './components/realtime/RealtimePresence.tsx';
import { AnalyticsTracker } from './components/AnalyticsTracker.tsx';
import { LivePreviewBar } from './components/LivePreviewBar.tsx';
import { ThemeStudioModal } from './components/ThemeStudioModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { ServiceDetailPage } from './pages/ServiceDetailPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { PortfolioPage } from './pages/PortfolioPage.tsx';
import { PricingPage } from './pages/PricingPage.tsx';
import { ProcessPage } from './pages/ProcessPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { EstimatorPage } from './pages/EstimatorPage.tsx';
import { StandardsPage } from './pages/StandardsPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { ClientPortalPage } from './pages/ClientPortalPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { useVisitorTracker } from './hooks/useVisitorTracker.ts';

function normalizePath(rawPath: string): string {
  if (!rawPath) return '/';
  let cleaned = rawPath.trim();
  // Remove hash/search if passed as full pathname
  if (cleaned.includes('?')) cleaned = cleaned.split('?')[0];
  if (cleaned.includes('#') && !cleaned.startsWith('/#')) cleaned = cleaned.split('#')[0];
  // Remove trailing slash unless root
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned.toLowerCase() || '/';
}

function AppContent() {
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  // Advanced real-time visitor telemetry tracking
  useVisitorTracker(currentPath);

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
        }, 100);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

    if (path === '/portal' || path === '/client-portal' || path === '/client') {
      return <ClientPortalPage onNavigate={handleNavigate} />;
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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 relative flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Global Real-Time Visitor Analytics Tracker */}
      <AnalyticsTracker currentPath={currentPath} />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Architecture readiness for future realtime */}
      <RealtimePresence enabled={false} />

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

      {/* Main Page Viewport */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden relative">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* WordPress & Shopify Grade 100 Themes & 115 Fonts Studio Modal */}
      <ThemeStudioModal
        isOpen={isThemeStudioOpen}
        onClose={() => setIsThemeStudioOpen(false)}
      />

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
