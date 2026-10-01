import React, { useEffect, useRef } from 'react';

interface AnalyticsTrackerProps {
  currentPath: string;
}

function getClientCountryEstimate(): { country: string; countryCode: string; city: string } {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (timeZone.startsWith('Europe/London') || timeZone.startsWith('Europe/Belfast')) {
      return { country: 'United Kingdom', countryCode: 'GB', city: 'London' };
    }
    if (timeZone.startsWith('America/New_York')) {
      return { country: 'United States', countryCode: 'US', city: 'New York' };
    }
    if (timeZone.startsWith('America/Los_Angeles')) {
      return { country: 'United States', countryCode: 'US', city: 'Los Angeles' };
    }
    if (timeZone.startsWith('America/Chicago')) {
      return { country: 'United States', countryCode: 'US', city: 'Chicago' };
    }
    if (timeZone.startsWith('Europe/Berlin') || timeZone.startsWith('Europe/Munich')) {
      return { country: 'Germany', countryCode: 'DE', city: 'Berlin' };
    }
    if (timeZone.startsWith('America/Toronto') || timeZone.startsWith('America/Vancouver')) {
      return { country: 'Canada', countryCode: 'CA', city: 'Toronto' };
    }
    if (timeZone.startsWith('Asia/Dubai')) {
      return { country: 'United Arab Emirates', countryCode: 'AE', city: 'Dubai' };
    }
    if (timeZone.startsWith('Australia/Sydney') || timeZone.startsWith('Australia/Melbourne')) {
      return { country: 'Australia', countryCode: 'AU', city: 'Sydney' };
    }
    if (timeZone.startsWith('Europe/Paris')) {
      return { country: 'France', countryCode: 'FR', city: 'Paris' };
    }
    if (timeZone.startsWith('Asia/Kolkata') || timeZone.startsWith('Asia/Calcutta')) {
      return { country: 'India', countryCode: 'IN', city: 'Mumbai' };
    }
    if (timeZone.startsWith('Europe/Amsterdam')) {
      return { country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam' };
    }
    if (timeZone.startsWith('Europe/Rome')) {
      return { country: 'Italy', countryCode: 'IT', city: 'Rome' };
    }
    if (timeZone.startsWith('Europe/Madrid')) {
      return { country: 'Spain', countryCode: 'ES', city: 'Madrid' };
    }
    if (timeZone.startsWith('Asia/Singapore')) {
      return { country: 'Singapore', countryCode: 'SG', city: 'Singapore' };
    }
    if (timeZone.startsWith('Asia/Tokyo')) {
      return { country: 'Japan', countryCode: 'JP', city: 'Tokyo' };
    }
  } catch {
    // fallback
  }
  return { country: 'United Kingdom', countryCode: 'GB', city: 'London' };
}

function getBrowserInfo(): { browser: string; os: string } {
  if (typeof navigator === 'undefined') {
    return { browser: 'Chrome', os: 'Windows' };
  }
  const ua = navigator.userAgent;
  let browser = 'Chrome';
  let os = 'Windows';

  // OS
  if (/Macintosh|Mac OS X/.test(ua)) os = 'macOS';
  else if (/Windows NT/.test(ua)) os = 'Windows';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  // Browser
  if (/Chrome/.test(ua) && !/Edg/.test(ua) && !/OPR/.test(ua)) browser = 'Chrome';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/Edg/.test(ua)) browser = 'Edge';
  else if (/OPR/.test(ua)) browser = 'Opera';

  return { browser, os };
}

function getTrafficSource(): string {
  if (typeof document === 'undefined' || !document.referrer) return 'Direct Traffic';
  const ref = document.referrer.toLowerCase();
  if (ref.includes('google.')) return 'Google Organic Search';
  if (ref.includes('bing.')) return 'Bing Search';
  if (ref.includes('yahoo.')) return 'Yahoo Search';
  if (ref.includes('wa.me') || ref.includes('whatsapp')) return 'WhatsApp Inbound';
  if (ref.includes('linkedin.com')) return 'LinkedIn';
  if (ref.includes('twitter.com') || ref.includes('t.co') || ref.includes('x.com')) return 'X / Twitter';
  if (ref.includes('facebook.com') || ref.includes('fb.me')) return 'Facebook';
  if (ref.includes('instagram.com')) return 'Instagram';
  if (ref.includes('reddit.com')) return 'Reddit';
  if (ref.includes('github.com')) return 'GitHub';
  return `Referral: ${new URL(document.referrer).hostname}`;
}

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem('cnc_visitor_sid');
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('cnc_visitor_sid', sid);
    }
    return sid;
  } catch {
    return `sess_${Date.now()}`;
  }
}

export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ currentPath }) => {
  const lastTracked = useRef<string>('');
  const sessionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    if (currentPath === '/admin') return;
    if (lastTracked.current === currentPath) return;
    lastTracked.current = currentPath;
    sessionStartTime.current = Date.now();

    const { country, countryCode, city } = getClientCountryEstimate();
    const { browser, os } = getBrowserInfo();
    const source = getTrafficSource();
    const sessionId = getSessionId();

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const device = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    const screenRes = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080';
    const referrer = typeof document !== 'undefined' && document.referrer ? document.referrer : 'Direct Visit';
    const localTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Send Page View Log
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: currentPath,
        country,
        countryCode,
        city,
        device,
        browser,
        os,
        screen: screenRes,
        referrer,
        source,
        localTime,
        sessionId,
      }),
    }).catch(() => {});

    // 2. Set 15s Heartbeat to maintain live presence
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const dwell = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        fetch('/api/analytics/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            path: currentPath,
            country,
            countryCode,
            city,
            device,
            dwellTimeSeconds: dwell,
          }),
        }).catch(() => {});
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [currentPath]);

  return null;
};
