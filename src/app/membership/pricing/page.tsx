'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PricingCard, { PricingTier } from '@/components/vault/PricingCard';
import { Check, Sparkles, Crown, Zap, Shield, Users } from 'lucide-react';

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    slug: 'free',
    description: 'Perfect for trying out workflows',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Access to all free workflows',
      '3 premium workflow downloads per month',
      'Community support',
      'Basic workflow templates',
      'Email notifications',
    ],
    cta: 'Get Started Free',
    ctaLink: '/auth/signup',
  },
  {
    name: 'Pro',
    slug: 'pro',
    description: 'Best for professionals',
    monthlyPrice: 29,
    yearlyPrice: 290,
    isPopular: true,
    features: [
      'Everything in Free',
      'Unlimited workflow downloads',
      'Access to all premium workflows',
      'Priority support',
      'Advanced workflow templates',
      'Custom workflow requests (1/month)',
      'Early access to new workflows',
      'Commercial usage rights',
    ],
    cta: 'Start Pro Trial',
    ctaLink: '/auth/signup?plan=pro',
  },
  {
    name: 'Premium',
    slug: 'premium',
    description: 'For teams and enterprises',
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      'Everything in Pro',
      'Team collaboration features',
      'Up to 10 team members',
      'Custom workflow development',
      '1-on-1 onboarding session',
      'Dedicated account manager',
      'SLA guarantee',
      'API access',
      'White-label options',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact?subject=premium',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Choose Your Plan
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto animate-slide-up">
            Get unlimited access to professional AI workflows. Start free, upgrade when you're ready.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-1 mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.slug}
              tier={tier}
              billingPeriod={billingPeriod}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare Plans
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-gray-900">Features</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-900">Pro</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Free workflows</td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Premium downloads/month</td>
                    <td className="text-center py-4 px-6 text-gray-900">3</td>
                    <td className="text-center py-4 px-6 text-gray-900 font-bold">Unlimited</td>
                    <td className="text-center py-4 px-6 text-gray-900 font-bold">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Priority support</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Custom workflow requests</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6 text-gray-900">1/month</td>
                    <td className="text-center py-4 px-6 text-gray-900">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Team members</td>
                    <td className="text-center py-4 px-6 text-gray-900">1</td>
                    <td className="text-center py-4 px-6 text-gray-900">1</td>
                    <td className="text-center py-4 px-6 text-gray-900">10</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">API access</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Dedicated account manager</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Our Membership?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Every workflow is professionally designed and thoroughly tested
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600">
                Pre-built workflows save you hours of configuration work
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Exclusive Access</h3>
              <p className="text-gray-600">
                Get early access to new workflows before anyone else
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Money-Back Guarantee</h3>
              <p className="text-gray-600">
                30-day money-back guarantee if you're not satisfied
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">
                Join our community of AI workflow enthusiasts
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Regular Updates</h3>
              <p className="text-gray-600">
                New workflows added every week, included in your membership
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">What happens to my downloads if I cancel?</h3>
              <p className="text-gray-600">
                Any workflows you've downloaded are yours to keep forever, even if you cancel your membership.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee on all plans. No questions asked.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">
                Absolutely! You can change your plan at any time. We'll prorate the difference.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to supercharge your AI workflows?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already saving time with our workflows.
          </p>
          <a
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
            <Sparkles className="w-5 h-5" />
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
