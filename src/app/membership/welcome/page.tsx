import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Sparkles, Download, Heart, Zap, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Welcome to Your Membership - ToolForge AI',
  description: 'Get started with your new membership.',
};

interface PageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function WelcomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const plan = params.plan || 'pro';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to {plan === 'premium' ? 'Premium' : 'Pro'}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You're all set! Here's everything you need to know to get started with your new membership.
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Browse the Workflow Vault</h3>
                <p className="text-gray-600 mb-3">
                  Explore our complete library of premium AI workflows. You now have unlimited access!
                </p>
                <Link
                  href="/vault"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Browse Workflows
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Download Your First Workflow</h3>
                <p className="text-gray-600 mb-3">
                  Pick a workflow that matches your needs and download it with one click. No limits!
                </p>
                <Link
                  href="/vault?sortBy=popular"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Popular Workflows
                  <Download className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Import and Customize</h3>
                <p className="text-gray-600 mb-3">
                  Import the workflow into your AI tool and customize it to fit your specific needs.
                </p>
                <Link
                  href="/docs/importing-workflows"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read Import Guide
                  <BookOpen className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Join the Community</h3>
                <p className="text-gray-600 mb-3">
                  Connect with other members, share tips, and get help from our community.
                </p>
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Join Community
                  <Users className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included in Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Unlimited Downloads</div>
                <div className="text-sm text-gray-600">Download as many workflows as you need</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">All Premium Workflows</div>
                <div className="text-sm text-gray-600">Access to our entire premium library</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Priority Support</div>
                <div className="text-sm text-gray-600">Get help faster with priority queue</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Early Access</div>
                <div className="text-sm text-gray-600">Try new workflows before everyone else</div>
              </div>
            </div>

            {plan === 'premium' && (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Team Features</div>
                    <div className="text-sm text-gray-600">Collaborate with up to 10 team members</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Custom Development</div>
                    <div className="text-sm text-gray-600">Request custom workflows for your needs</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Helpful Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/docs/getting-started"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <BookOpen className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">
              Documentation
            </h3>
            <p className="text-sm text-gray-600">
              Learn how to get the most out of your workflows
            </p>
          </Link>

          <Link
            href="/vault/favorites"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <Heart className="w-8 h-8 text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">
              Favorites
            </h3>
            <p className="text-sm text-gray-600">
              Save workflows for quick access later
            </p>
          </Link>

          <Link
            href="/contact"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <Zap className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">
              Support
            </h3>
            <p className="text-sm text-gray-600">
              Need help? Our team is here for you
            </p>
          </Link>
        </div>

        {/* Next Steps CTA */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Jump into the vault and start exploring. Your perfect workflow is waiting!
          </p>
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Explore Workflow Vault
          </Link>
        </div>

        {/* Confirmation Email Notice */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            A confirmation email has been sent to your inbox with your membership details.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
