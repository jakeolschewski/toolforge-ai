import type { Metadata } from 'next';
import Link from 'next/link';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'ToolForge AI refund policy for workflow purchases and membership subscriptions.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      description="We want you to be satisfied with your purchases. This policy outlines our refund process for workflow purchases and membership subscriptions."
      lastUpdated="February 13, 2026"
    >
      {/* Table of Contents */}
      <div className="not-prose bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          <a href="#overview" className="block text-primary-600 hover:text-primary-700">
            1. Overview
          </a>
          <a href="#workflow-purchases" className="block text-primary-600 hover:text-primary-700">
            2. Workflow Purchases
          </a>
          <a href="#membership-subscriptions" className="block text-primary-600 hover:text-primary-700">
            3. Membership Subscriptions
          </a>
          <a href="#how-to-request" className="block text-primary-600 hover:text-primary-700">
            4. How to Request a Refund
          </a>
          <a href="#processing" className="block text-primary-600 hover:text-primary-700">
            5. Processing Timeline
          </a>
          <a href="#exceptions" className="block text-primary-600 hover:text-primary-700">
            6. Exceptions
          </a>
          <a href="#contact" className="block text-primary-600 hover:text-primary-700">
            7. Contact Information
          </a>
        </nav>
      </div>

      {/* 1. Overview */}
      <section id="overview" className="mb-8">
        <h2>1. Overview</h2>
        <p>
          At ToolForge AI, we are committed to your satisfaction. If you are not happy with a
          purchase, we offer refunds under the conditions outlined below. This policy applies to all
          purchases made through our website, including individual workflow purchases and membership
          subscriptions.
        </p>
      </section>

      {/* 2. Workflow Purchases */}
      <section id="workflow-purchases" className="mb-8">
        <h2>2. Workflow Purchases</h2>

        <h3>2.1 Refund Window</h3>
        <p>
          Individual workflow purchases are eligible for a refund within <strong>14 days</strong> of
          the original purchase date. After the 14-day window has expired, purchases are
          non-refundable.
        </p>

        <h3>2.2 Conditions</h3>
        <ul>
          <li>Refund requests must be submitted within 14 days of purchase</li>
          <li>You must provide your order details (email address, workflow name, and approximate purchase date)</li>
          <li>Free workflows are excluded from this policy as no purchase was made</li>
          <li>Each refund request is subject to review</li>
        </ul>

        <h3>2.3 What Happens After a Refund</h3>
        <ul>
          <li>Access to the refunded workflow will be revoked</li>
          <li>You should delete any downloaded copies of the workflow</li>
          <li>The refund will be credited to your original payment method</li>
        </ul>
      </section>

      {/* 3. Membership Subscriptions */}
      <section id="membership-subscriptions" className="mb-8">
        <h2>3. Membership Subscriptions</h2>

        <h3>3.1 Annual Subscriptions</h3>
        <p>
          Annual membership subscriptions are eligible for a refund within{' '}
          <strong>14 days</strong> of the initial purchase or renewal date.
        </p>

        <h3>3.2 Monthly Subscriptions</h3>
        <p>
          Monthly membership subscriptions are <strong>non-refundable</strong>. You may cancel your
          monthly subscription at any time, and it will remain active until the end of the current
          billing period.
        </p>

        <h3>3.3 Cancellation</h3>
        <p>
          Canceling a subscription stops future charges but does not entitle you to a refund for the
          current billing period. Your access continues until the end of the period you have already
          paid for.
        </p>
      </section>

      {/* 4. How to Request a Refund */}
      <section id="how-to-request" className="mb-8">
        <h2>4. How to Request a Refund</h2>
        <p>To request a refund, please follow these steps:</p>
        <ol>
          <li>
            Email{' '}
            <a href="mailto:support@toolforge.ai">support@toolforge.ai</a> with the subject line
            "Refund Request"
          </li>
          <li>
            Include the following information in your email:
            <ul>
              <li>Your account email address</li>
              <li>The name of the workflow or subscription</li>
              <li>Your approximate purchase date</li>
              <li>The reason for your refund request</li>
            </ul>
          </li>
          <li>Our support team will review your request and respond within 2 business days</li>
        </ol>
      </section>

      {/* 5. Processing Timeline */}
      <section id="processing" className="mb-8">
        <h2>5. Processing Timeline</h2>
        <ul>
          <li>
            <strong>Review:</strong> We will review your refund request within 2 business days of
            receiving it
          </li>
          <li>
            <strong>Approval Notification:</strong> You will receive an email confirming whether
            your refund has been approved or denied
          </li>
          <li>
            <strong>Processing:</strong> Approved refunds are processed within 5-10 business days
          </li>
          <li>
            <strong>Credit:</strong> Depending on your payment provider, it may take an additional
            5-10 business days for the refund to appear on your statement
          </li>
        </ul>
      </section>

      {/* 6. Exceptions */}
      <section id="exceptions" className="mb-8">
        <h2>6. Exceptions</h2>
        <p>Refunds may be denied in the following circumstances:</p>
        <ul>
          <li>The refund request is made after the 14-day window has expired</li>
          <li>Evidence of abuse, fraud, or violation of our Terms of Service</li>
          <li>
            Excessive refund requests indicating a pattern of abuse (e.g., repeatedly purchasing
            and refunding workflows)
          </li>
          <li>
            Chargebacks filed with your payment provider instead of contacting us first — we
            encourage you to reach out to us directly so we can resolve your concern
          </li>
        </ul>
      </section>

      {/* 7. Contact Information */}
      <section id="contact" className="mb-8">
        <h2>7. Contact Information</h2>
        <p>
          If you have any questions about our refund policy, please contact us:
        </p>
        <div className="not-prose bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
          <p className="font-semibold text-gray-900 mb-2">ToolForge AI Support</p>
          <p className="text-gray-700 mb-1">
            <strong>Refund Requests:</strong>{' '}
            <a href="mailto:support@toolforge.ai" className="text-primary-600 hover:text-primary-700">
              support@toolforge.ai
            </a>
          </p>
          <p className="text-gray-700">
            <strong>General Inquiries:</strong>{' '}
            <a href="mailto:legal@toolforge.ai" className="text-primary-600 hover:text-primary-700">
              legal@toolforge.ai
            </a>
          </p>
        </div>
      </section>

      {/* Related Links */}
      <div className="not-prose mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Legal Documents</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/terms"
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">Terms of Service</div>
            <div className="text-sm text-gray-600">Our terms and conditions</div>
          </Link>
          <Link
            href="/privacy"
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">Privacy Policy</div>
            <div className="text-sm text-gray-600">How we handle your data</div>
          </Link>
          <Link
            href="/cookies"
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">Cookie Policy</div>
            <div className="text-sm text-gray-600">Our use of cookies</div>
          </Link>
        </div>
      </div>
    </LegalLayout>
  );
}
