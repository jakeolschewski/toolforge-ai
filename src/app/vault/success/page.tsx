import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Purchase Successful - Workflow Vault',
  description: 'Your workflow purchase was successful.',
};

interface PageProps {
  searchParams: Promise<{ workflow?: string; session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const workflowSlug = params.workflow;
  const sessionId = params.session_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-fade-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
            Purchase Successful!
          </h1>
          <p className="text-xl text-gray-600 animate-slide-up">
            Your workflow is ready to download
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 animate-fade-in">
          <div className="space-y-6">
            {/* What happens next */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Confirmation Email</div>
                    <div className="text-sm text-gray-600">
                      We've sent a receipt to your email with purchase details
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Access Granted</div>
                    <div className="text-sm text-gray-600">
                      The workflow is now available in your vault for unlimited downloads
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Start Using</div>
                    <div className="text-sm text-gray-600">
                      Download and import the workflow into your AI tool
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Order Details */}
            {sessionId && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="text-gray-900 font-mono">{sessionId.substring(0, 16)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {workflowSlug ? (
            <>
              <Link
                href={`/vault/${workflowSlug}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Workflow
              </Link>
              <Link
                href="/vault/my-vault"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Go to My Vault
                <ArrowRight className="w-5 h-5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/vault/my-vault"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Go to My Vault
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/vault"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Browse More Workflows
              </Link>
            </>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Need Help Getting Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Check out our quick start guide or contact support if you have any questions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/docs/quick-start"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              View Quick Start Guide
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Social Share */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Love this workflow? Share it with your network!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Share on Twitter
            </button>
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
              Share on LinkedIn
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
