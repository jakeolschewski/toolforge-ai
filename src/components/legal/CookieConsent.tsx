'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Settings, Check } from 'lucide-react';
import {
  hasConsented,
  acceptAllCookies,
  rejectAllCookies,
  setCookieConsent,
  getCookieConsent,
  type CookiePreferences,
} from '@/lib/cookies';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    if (!hasConsented()) {
      setIsVisible(true);
    }

    // Load existing preferences if any
    const existing = getCookieConsent();
    if (existing) {
      setPreferences(existing);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setCookieConsent(preferences);
    setIsVisible(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Cookie Preferences</h2>
                  <p className="text-sm text-primary-100 mt-1">
                    We value your privacy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {!showSettings ? (
              // Simple view
              <div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We use cookies to enhance your browsing experience, serve personalized content,
                  and analyze our traffic. By clicking "Accept All", you consent to our use of
                  cookies. You can also customize your preferences or reject non-essential cookies.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Customize
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Learn more in our{' '}
                  <Link href="/cookies" className="text-primary-600 hover:text-primary-700 underline">
                    Cookie Policy
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            ) : (
              // Settings view
              <div>
                <p className="text-gray-700 mb-6">
                  Choose which cookies you want to allow. Essential cookies are required for the
                  site to function properly.
                </p>

                {/* Cookie categories */}
                <div className="space-y-4 mb-6">
                  {/* Essential */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          Required
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        These cookies are necessary for the website to function and cannot be
                        disabled. They are usually set in response to actions you make such as
                        setting your privacy preferences or logging in.
                      </p>
                    </div>
                    <div className="ml-4 flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg">
                      <Check className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies help us understand how visitors interact with our website by
                        collecting and reporting information anonymously. This helps us improve our
                        site performance.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('analytics')}
                      className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.analytics ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                      aria-label="Toggle analytics cookies"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies track your online activity to help advertisers deliver more
                        relevant advertising or to limit how many times you see an ad. We may share
                        this information with advertising partners.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('marketing')}
                      className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.marketing ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                      aria-label="Toggle marketing cookies"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
