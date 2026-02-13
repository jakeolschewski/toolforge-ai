/**
 * Cookie Consent Management Utilities
 * GDPR and CCPA compliant cookie consent handling
 */

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Set a cookie with a name, value, and optional expiry in days
 */
export function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export type CookiePreferences = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_CONSENT_KEY = 'toolforge_cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0';

/**
 * Get cookie consent preferences from localStorage
 */
export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    if (data.version !== COOKIE_CONSENT_VERSION) return null;

    return data.preferences;
  } catch {
    return null;
  }
}

/**
 * Save cookie consent preferences to localStorage
 */
export function setCookieConsent(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        version: COOKIE_CONSENT_VERSION,
        preferences,
        timestamp: new Date().toISOString(),
      })
    );

    // Apply preferences immediately
    applyCookiePreferences(preferences);
  } catch (error) {
    console.error('Failed to save cookie preferences:', error);
  }
}

/**
 * Check if user has made a cookie consent choice
 */
export function hasConsented(): boolean {
  return getCookieConsent() !== null;
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  setCookieConsent({
    essential: true,
    analytics: true,
    marketing: true,
  });
}

/**
 * Reject all non-essential cookies
 */
export function rejectAllCookies(): void {
  setCookieConsent({
    essential: true,
    analytics: false,
    marketing: false,
  });
}

/**
 * Clear cookie consent (for testing or reset)
 */
export function clearCookieConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
}

/**
 * Apply cookie preferences by enabling/disabling third-party scripts
 */
function applyCookiePreferences(preferences: CookiePreferences): void {
  // Analytics cookies (Google Analytics, Vercel Analytics, etc.)
  if (preferences.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }

  // Marketing cookies (ad platforms, remarketing, etc.)
  if (preferences.marketing) {
    enableMarketing();
  } else {
    disableMarketing();
  }
}

/**
 * Enable analytics tracking
 */
function enableAnalytics(): void {
  // Vercel Analytics is enabled by default in layout.tsx
  // Add other analytics initialization here if needed
  if (typeof window !== 'undefined') {
    (window as any).__ANALYTICS_ENABLED__ = true;
  }
}

/**
 * Disable analytics tracking
 */
function disableAnalytics(): void {
  if (typeof window !== 'undefined') {
    (window as any).__ANALYTICS_ENABLED__ = false;

    // Disable Google Analytics if present
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  }
}

/**
 * Enable marketing cookies
 */
function enableMarketing(): void {
  if (typeof window !== 'undefined') {
    (window as any).__MARKETING_ENABLED__ = true;

    // Enable Google Ads consent if present
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  }
}

/**
 * Disable marketing cookies
 */
function disableMarketing(): void {
  if (typeof window !== 'undefined') {
    (window as any).__MARKETING_ENABLED__ = false;

    // Disable Google Ads consent if present
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  }
}
