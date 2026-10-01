import { useEffect, useRef } from 'react';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'sess_unknown';
  let sid = sessionStorage.getItem('cnc_session_id');
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('cnc_session_id', sid);
  }
  return sid;
}

function detectDevice(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
    return 'tablet';
  }
  if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Chrome';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Internet';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Microsoft Edge';
  if (ua.includes('Chrome')) return 'Google Chrome';
  if (ua.includes('Safari')) return 'Apple Safari';
  return 'Browser';
}

function detectOS(): string {
  if (typeof window === 'undefined') return 'Windows';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown OS';
}

function detectSource(): string {
  if (typeof window === 'undefined') return 'Direct Visit';
  const ref = document.referrer.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (search.includes('utm_source=google') || ref.includes('google.')) return 'Google Search';
  if (search.includes('utm_source=whatsapp') || ref.includes('whatsapp') || ref.includes('api.whatsapp.com')) return 'WhatsApp Inbound';
  if (search.includes('utm_source=linkedin') || ref.includes('linkedin.')) return 'LinkedIn Referral';
  if (search.includes('utm_source=instagram') || ref.includes('instagram.')) return 'Instagram';
  if (search.includes('utm_source=twitter') || search.includes('utm_source=x') || ref.includes('t.co') || ref.includes('twitter.')) return 'X / Twitter';
  if (search.includes('utm_source=github') || ref.includes('github.com')) return 'GitHub';
  if (ref.includes('aistudio.google.com')) return 'AI Studio Preview';
  if (ref) {
    try {
      const url = new URL(ref);
      return url.hostname.replace('www.', '');
    } catch {
      return ref;
    }
  }
  return 'Direct Traffic';
}

function inferGeo() {
  if (typeof window === 'undefined') {
    return { country: 'United Kingdom', countryCode: 'GB', city: 'London' };
  }
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (tz.includes('Europe/London') || tz.includes('GMT') || tz.includes('UTC')) {
    return { country: 'United Kingdom', countryCode: 'GB', city: 'London' };
  }
  if (tz.includes('America/New_York')) return { country: 'United States', countryCode: 'US', city: 'New York' };
  if (tz.includes('America/Los_Angeles')) return { country: 'United States', countryCode: 'US', city: 'Los Angeles' };
  if (tz.includes('America/Chicago')) return { country: 'United States', countryCode: 'US', city: 'Chicago' };
  if (tz.includes('Europe/Paris')) return { country: 'France', countryCode: 'FR', city: 'Paris' };
  if (tz.includes('Europe/Berlin')) return { country: 'Germany', countryCode: 'DE', city: 'Berlin' };
  if (tz.includes('Asia/Dubai')) return { country: 'United Arab Emirates', countryCode: 'AE', city: 'Dubai' };
  if (tz.includes('Asia/Kolkata') || tz.includes('Calcutta')) return { country: 'India', countryCode: 'IN', city: 'Mumbai' };
  if (tz.includes('Asia/Tokyo')) return { country: 'Japan', countryCode: 'JP', city: 'Tokyo' };
  if (tz.includes('Asia/Singapore')) return { country: 'Singapore', countryCode: 'SG', city: 'Singapore' };
  if (tz.includes('Australia/Sydney')) return { country: 'Australia', countryCode: 'AU', city: 'Sydney' };
  if (tz.includes('America/Toronto')) return { country: 'Canada', countryCode: 'CA', city: 'Toronto' };

  const parts = tz.split('/');
  return {
    country: parts[0] || 'United Kingdom',
    countryCode: 'GB',
    city: parts[1]?.replace(/_/g, ' ') || 'London',
  };
}

export function useVisitorTracker(currentPath: string) {
  const pageStartTimeRef = useRef<number>(Date.now());
  const dwellTimerRef = useRef<number>(0);

  useEffect(() => {
    const sessionId = getSessionId();
    const geo = inferGeo();
    const device = detectDevice();
    const browser = detectBrowser();
    const os = detectOS();
    const source = detectSource();
    const screen = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080';
    const localTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    pageStartTimeRef.current = Date.now();
    dwellTimerRef.current = 0;

    // Send page view track log
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        path: currentPath,
        country: geo.country,
        countryCode: geo.countryCode,
        city: geo.city,
        device,
        browser,
        os,
        screen,
        referrer: document.referrer || 'Direct',
        source,
        localTime,
        dwellTimeSeconds: 1,
      }),
    }).catch(() => {});

    // Periodic Heartbeat every 8s
    const interval = setInterval(() => {
      dwellTimerRef.current = Math.round((Date.now() - pageStartTimeRef.current) / 1000);

      fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          path: currentPath,
          country: geo.country,
          countryCode: geo.countryCode,
          city: geo.city,
          device,
          dwellTimeSeconds: dwellTimerRef.current,
        }),
      }).catch(() => {});
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [currentPath]);
}
