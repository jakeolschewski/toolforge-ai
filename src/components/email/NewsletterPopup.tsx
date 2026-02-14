'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { getCookie, setCookie } from '@/lib/cookies';
import toast from 'react-hot-toast';

interface NewsletterPopupProps {
  variant?: 'default' | 'minimal' | 'premium';
  delayMs?: number;
}

export default function NewsletterPopup({
  variant = 'default',
  delayMs = 5000
}: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or subscribed
    const dismissed = getCookie('newsletter_dismissed');
    const subscribed = getCookie('newsletter_subscribed');

    if (dismissed || subscribed) {
      return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasInteracted) return;
      if (e.clientY <= 0) {
        setIsVisible(true);
        setHasInteracted(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delayMs, hasInteracted]);

  const handleClose = () => {
    setIsVisible(false);
    // Set cookie to not show again for 30 days
    setCookie('newsletter_dismissed', 'true', 30);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'popup',
          variant,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Successfully subscribed!');
        setIsVisible(false);
        setCookie('newsletter_subscribed', 'true', 365); // 1 year

        // Track conversion
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).gtag) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).gtag('event', 'newsletter_subscribe', {
            method: 'popup',
            variant,
          });
        }
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto animate-slide-up relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>

          {variant === 'default' && (
            <div className="p-8">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Stay Ahead of the AI Curve
              </h2>

              <p className="text-gray-600 text-center mb-6">
                Get weekly AI tool roundups, exclusive deals, and insider tips delivered to your inbox.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>Discover new AI tools before they go mainstream</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>Exclusive deals and discounts up to 50% off</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Zap className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>Expert tips to boost your productivity</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  disabled={isLoading}
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Subscribing...' : 'Get Free Updates'}
                </button>
              </form>

              {/* Privacy note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                No spam, ever. Unsubscribe anytime with one click.
              </p>
            </div>
          )}

          {variant === 'minimal' && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Join 10,000+ AI Enthusiasts
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Weekly AI tool roundups + exclusive deals
              </p>

              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                  disabled={isLoading}
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          )}

          {variant === 'premium' && (
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Premium AI Newsletter</h3>
                    <p className="text-sm text-gray-600">Join 10,000+ subscribers</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Weekly curated AI tool roundups
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Exclusive deals up to 50% off
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Early access to new tools
                  </li>
                </ul>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    disabled={isLoading}
                    required
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Subscribing...' : 'Get Free Access'}
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Free forever. Unsubscribe anytime.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
