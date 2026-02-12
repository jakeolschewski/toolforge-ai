'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface InlineSignupProps {
  variant?: 'default' | 'compact' | 'sidebar' | 'footer' | 'cta';
  title?: string;
  description?: string;
  buttonText?: string;
  source?: string;
}

export default function InlineSignup({
  variant = 'default',
  title,
  description,
  buttonText = 'Subscribe',
  source = 'inline'
}: InlineSignupProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
          source,
          variant,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Successfully subscribed!');
        setIsSuccess(true);
        setEmail('');

        // Track conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_subscribe', {
            method: source,
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

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-900 mb-1">
          You're all set!
        </h3>
        <p className="text-sm text-green-700">
          Check your inbox for a welcome email.
        </p>
      </div>
    );
  }

  // Default variant
  if (variant === 'default') {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {title || 'Join Our Newsletter'}
            </h3>
          </div>

          <p className="text-gray-700 mb-6">
            {description || 'Get weekly AI tool roundups, exclusive deals, and expert tips delivered straight to your inbox.'}
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
            >
              {isLoading ? 'Subscribing...' : buttonText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-3">
            Join 10,000+ AI enthusiasts. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
          {title || 'Get AI Updates'}
        </h4>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white font-medium px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
          >
            {isLoading ? 'Sending...' : 'Subscribe'}
          </button>
        </form>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <h4 className="font-bold text-lg">
            {title || 'Weekly AI Digest'}
          </h4>
        </div>

        <p className="text-purple-100 text-sm mb-4">
          {description || 'Get the best AI tools and deals every week.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none text-sm"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-colors text-sm disabled:opacity-50"
          >
            {isLoading ? 'Subscribing...' : buttonText}
          </button>
        </form>

        <p className="text-xs text-purple-100 mt-3 text-center">
          Free forever. No spam.
        </p>
      </div>
    );
  }

  // Footer variant
  if (variant === 'footer') {
    return (
      <div>
        <h4 className="font-bold text-gray-900 mb-3">
          {title || 'Newsletter'}
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {description || 'Get weekly AI tool updates and exclusive deals.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm bg-white"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
          >
            {isLoading ? 'Subscribing...' : buttonText}
          </button>
        </form>
      </div>
    );
  }

  // CTA variant
  if (variant === 'cta') {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-3">
            {title || 'Do not Miss Out on AI Innovations'}
          </h3>
          <p className="text-lg text-purple-100 mb-6">
            {description || 'Join 10,000+ professionals getting weekly AI tool roundups and exclusive deals.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-purple-600 font-bold px-8 py-3 rounded-lg hover:bg-purple-50 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              {isLoading ? 'Subscribing...' : buttonText}
            </button>
          </form>

          <p className="text-sm text-purple-100 mt-4">
            No spam, ever. Unsubscribe with one click.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
