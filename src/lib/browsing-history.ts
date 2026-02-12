/**
 * Browsing History Management
 * Cookie-based tracking for personalized recommendations
 * GDPR compliant - only tracks if analytics consent is given
 */

import type { Tool } from '@/types';
import type { UserBrowsingHistory } from './recommendations';
import { getCookieConsent } from './cookies';

const HISTORY_COOKIE_NAME = 'toolforge_history';
const MAX_HISTORY_ITEMS = 20;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Get user browsing history from cookies
 */
export function getUserBrowsingHistory(): UserBrowsingHistory | null {
  if (typeof window === 'undefined') return null;

  // Check if user has consented to analytics cookies
  const consent = getCookieConsent();
  if (!consent || !consent.analytics) {
    return null;
  }

  try {
    const cookieValue = getCookie(HISTORY_COOKIE_NAME);
    if (!cookieValue) {
      return {
        viewedTools: [],
        clickedTools: [],
        lastViewed: '',
        categories: [],
        pricingPreferences: []
      };
    }

    return JSON.parse(decodeURIComponent(cookieValue));
  } catch (error) {
    console.error('Failed to parse browsing history:', error);
    return null;
  }
}

/**
 * Track tool view
 */
export function trackToolView(tool: Tool): void {
  if (typeof window === 'undefined') return;

  const consent = getCookieConsent();
  if (!consent || !consent.analytics) return;

  const history = getUserBrowsingHistory() || {
    viewedTools: [],
    clickedTools: [],
    lastViewed: '',
    categories: [],
    pricingPreferences: []
  };

  // Add tool to viewed list (avoid duplicates)
  if (!history.viewedTools.includes(tool.id)) {
    history.viewedTools.unshift(tool.id);
    history.viewedTools = history.viewedTools.slice(0, MAX_HISTORY_ITEMS);
  }

  // Track categories
  if (!history.categories.includes(tool.category)) {
    history.categories.push(tool.category);
  }

  // Track pricing preferences
  if (!history.pricingPreferences.includes(tool.pricing_model)) {
    history.pricingPreferences.push(tool.pricing_model);
  }

  history.lastViewed = new Date().toISOString();

  saveHistory(history);
}

/**
 * Track tool click (affiliate link click)
 */
export function trackToolClick(toolId: string): void {
  if (typeof window === 'undefined') return;

  const consent = getCookieConsent();
  if (!consent || !consent.analytics) return;

  const history = getUserBrowsingHistory();
  if (!history) return;

  if (!history.clickedTools.includes(toolId)) {
    history.clickedTools.unshift(toolId);
    history.clickedTools = history.clickedTools.slice(0, MAX_HISTORY_ITEMS);
  }

  saveHistory(history);
}

/**
 * Clear browsing history
 */
export function clearBrowsingHistory(): void {
  if (typeof window === 'undefined') return;
  deleteCookie(HISTORY_COOKIE_NAME);
}

/**
 * Save history to cookie
 */
function saveHistory(history: UserBrowsingHistory): void {
  try {
    const value = encodeURIComponent(JSON.stringify(history));
    setCookie(HISTORY_COOKIE_NAME, value, COOKIE_MAX_AGE);
  } catch (error) {
    console.error('Failed to save browsing history:', error);
  }
}

/**
 * Get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}

/**
 * Set cookie
 */
function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

/**
 * Delete cookie
 */
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=; max-age=0; path=/`;
}

/**
 * Get viewing patterns
 */
export function getViewingPatterns(history: UserBrowsingHistory): {
  mostViewedCategory: string | null;
  preferredPricing: string | null;
  totalViews: number;
  totalClicks: number;
} {
  const categoryCount: Record<string, number> = {};
  const pricingCount: Record<string, number> = {};

  history.categories.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  history.pricingPreferences.forEach(price => {
    pricingCount[price] = (pricingCount[price] || 0) + 1;
  });

  const mostViewedCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const preferredPricing = Object.entries(pricingCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    mostViewedCategory,
    preferredPricing,
    totalViews: history.viewedTools.length,
    totalClicks: history.clickedTools.length
  };
}
