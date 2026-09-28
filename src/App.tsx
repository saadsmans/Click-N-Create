/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CookieConsent } from './components/CookieConsent.tsx';
import { RealtimePresence } from './components/realtime/RealtimePresence.tsx';

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
import { NotFoundPage } from './pages/NotFoundPage.tsx';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');
      if (currentPath !== '/') {
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

    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCurrentPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/services') {
      return <ServicesPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/portfolio') {
      return <PortfolioPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/pricing') {
      return <PricingPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/estimator') {
      return <EstimatorPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/process') {
      return <ProcessPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/standards') {
      return <StandardsPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/faq') {
      return <FAQPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/terms') {
      return <TermsPage onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/services/')) {
      const slug = currentPath.replace('/services/', '').replace(/\/$/, '');
      return <ServiceDetailPage slug={slug} onNavigate={handleNavigate} />;
    }

    return <NotFoundPage onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 relative flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Architecture readiness for future realtime */}
      <RealtimePresence enabled={false} />

      {/* Fixed Sticky Glass Navbar with Typographic Wordmark & Theme Toggle */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Page Viewport */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden relative">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* GDPR / UK DPA Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </HelmetProvider>
  );
}
