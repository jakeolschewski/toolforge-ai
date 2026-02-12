import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, DollarSign, FileText, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure - ToolForge AI',
  description: 'Learn about our affiliate relationships, how we earn commissions, and our commitment to honest, unbiased reviews.',
  keywords: ['affiliate disclosure', 'transparency', 'ftc disclosure', 'affiliate links'],
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Affiliate Disclosure
          </h1>
          <p className="text-lg text-gray-600">
            Transparency is important to us. Here's how we operate and earn revenue.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 space-y-8">
          {/* FTC Disclosure */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">FTC Disclosure Statement</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  In accordance with FTC guidelines, ToolForge AI discloses that we have financial
                  relationships with some of the tools and services mentioned on this website, and
                  ToolForge AI may be compensated if consumers choose to click these links and make
                  purchases.
                </p>
              </div>
            </div>
          </div>

          {/* How We Earn */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Earn Revenue</h2>
                <p className="text-gray-700 mb-4">
                  ToolForge AI is supported through affiliate marketing. Here's how it works:
                </p>
              </div>
            </div>

            <div className="space-y-4 ml-9">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Affiliate Commissions</h4>
                <p className="text-gray-700">
                  When you click on certain links on our website and make a purchase, we may earn
                  a commission from the tool provider. This commission comes at no additional cost
                  to you and helps us maintain and improve our service.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Sponsored Placements</h4>
                <p className="text-gray-700">
                  Some tools may pay for premium placement in our directory. These placements are
                  always clearly labeled as "Sponsored" and are separate from our editorial reviews
                  and recommendations.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">No Extra Cost to You</h4>
                <p className="text-gray-700">
                  Using our affiliate links costs you nothing extra. The prices you pay are the same
                  whether you use our links or go directly to the tool's website. Your purchase simply
                  helps support our work.
                </p>
              </div>
            </div>
          </section>

          {/* Our Commitment */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to You</h2>
                <p className="text-gray-700 mb-4">
                  We take our editorial independence seriously. Here are our core principles:
                </p>
              </div>
            </div>

            <div className="ml-9 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary-600 font-bold mt-0.5">1.</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Honest Reviews Only</h4>
                  <p className="text-gray-700">
                    Our reviews are based on genuine testing, research, and user feedback. Affiliate
                    relationships do not influence our ratings, reviews, or recommendations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-primary-600 font-bold mt-0.5">2.</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">We Recommend What We Believe In</h4>
                  <p className="text-gray-700">
                    We only recommend tools that we genuinely believe provide value. If a tool doesn't
                    meet our standards, we won't recommend it, regardless of potential commissions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-primary-600 font-bold mt-0.5">3.</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Transparent Labeling</h4>
                  <p className="text-gray-700">
                    Sponsored content and placements are clearly labeled. Our editorial content is
                    separate from advertising and always marked as such.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-primary-600 font-bold mt-0.5">4.</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Balanced Perspectives</h4>
                  <p className="text-gray-700">
                    We highlight both pros and cons of every tool. Our goal is to help you make
                    informed decisions, not just generate clicks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-primary-600 font-bold mt-0.5">5.</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Regular Updates</h4>
                  <p className="text-gray-700">
                    We continuously update our reviews to reflect changes in features, pricing, and
                    performance. If a tool declines in quality, we'll update our recommendation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Rights & Choices</h2>
            <p className="text-gray-700 mb-3">
              You have complete control over your purchasing decisions:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>You can visit any tool's website directly without using our affiliate links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>You're never obligated to make a purchase through our links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Our reviews and comparisons are available whether you use our links or not.</span>
              </li>
            </ul>
          </section>

          {/* Support Note */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">How You Can Support Us</h2>
            <p className="text-gray-700 mb-4">
              If you find our content helpful and want to support our work, using our affiliate
              links when making purchases is the best way to do so. It costs you nothing extra
              and helps us:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">✓</span>
                <span>Continue providing free, high-quality content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">✓</span>
                <span>Test and review more tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">✓</span>
                <span>Keep our database updated and comprehensive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">✓</span>
                <span>Maintain an ad-free, user-friendly experience</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Questions or Concerns?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our affiliate relationships, our review process, or
              this disclosure, please don't hesitate to reach out.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Us →
            </Link>
          </section>

          {/* Last Updated */}
          <div className="text-sm text-gray-500 text-center pt-6 border-t border-gray-200">
            Last Updated: February 11, 2026
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link
            href="/about"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <h3 className="font-semibold text-gray-900 mb-2">About Us</h3>
            <p className="text-sm text-gray-600">Learn more about our mission and values</p>
          </Link>

          <Link
            href="/privacy"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Privacy Policy</h3>
            <p className="text-sm text-gray-600">How we protect your data and privacy</p>
          </Link>

          <Link
            href="/terms"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Terms of Service</h3>
            <p className="text-sm text-gray-600">Our terms and conditions</p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
