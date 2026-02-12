import type { Metadata } from 'next';
import Link from 'next/link';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our Terms of Service to understand the rules and regulations governing the use of ToolForge AI.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="Please read these Terms of Service carefully before using ToolForge AI. By accessing or using our service, you agree to be bound by these terms."
      lastUpdated="February 11, 2026"
    >
      {/* Table of Contents */}
      <div className="not-prose bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          <a href="#acceptance" className="block text-primary-600 hover:text-primary-700">
            1. Acceptance of Terms
          </a>
          <a href="#changes" className="block text-primary-600 hover:text-primary-700">
            2. Changes to Terms
          </a>
          <a href="#account" className="block text-primary-600 hover:text-primary-700">
            3. Account Registration
          </a>
          <a href="#use-of-service" className="block text-primary-600 hover:text-primary-700">
            4. Use of Service
          </a>
          <a href="#user-content" className="block text-primary-600 hover:text-primary-700">
            5. User-Generated Content
          </a>
          <a href="#intellectual-property" className="block text-primary-600 hover:text-primary-700">
            6. Intellectual Property
          </a>
          <a href="#prohibited-conduct" className="block text-primary-600 hover:text-primary-700">
            7. Prohibited Conduct
          </a>
          <a href="#payments" className="block text-primary-600 hover:text-primary-700">
            8. Payments and Subscriptions
          </a>
          <a href="#affiliate" className="block text-primary-600 hover:text-primary-700">
            9. Affiliate Links
          </a>
          <a href="#disclaimers" className="block text-primary-600 hover:text-primary-700">
            10. Disclaimers
          </a>
          <a href="#limitation" className="block text-primary-600 hover:text-primary-700">
            11. Limitation of Liability
          </a>
          <a href="#indemnification" className="block text-primary-600 hover:text-primary-700">
            12. Indemnification
          </a>
          <a href="#termination" className="block text-primary-600 hover:text-primary-700">
            13. Termination
          </a>
          <a href="#dispute" className="block text-primary-600 hover:text-primary-700">
            14. Dispute Resolution
          </a>
          <a href="#general" className="block text-primary-600 hover:text-primary-700">
            15. General Provisions
          </a>
          <a href="#contact" className="block text-primary-600 hover:text-primary-700">
            16. Contact Information
          </a>
        </nav>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <p className="lead text-lg">
          Welcome to ToolForge AI. These Terms of Service ("Terms") govern your access to and use of
          the ToolForge AI website, services, and applications (collectively, the "Service"). Please
          read these Terms carefully.
        </p>
      </section>

      {/* 1. Acceptance of Terms */}
      <section id="acceptance" className="mb-8">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using ToolForge AI, you agree to be bound by these Terms and our{' '}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree to these Terms, you may
          not access or use the Service.
        </p>
        <p>
          You represent that you are at least 16 years old and have the legal capacity to enter into
          these Terms. If you are using the Service on behalf of an organization, you represent that
          you have authority to bind that organization to these Terms.
        </p>
      </section>

      {/* 2. Changes to Terms */}
      <section id="changes" className="mb-8">
        <h2>2. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify users of material
          changes by:
        </p>
        <ul>
          <li>Posting the updated Terms on this page with a new "Last Updated" date</li>
          <li>Sending an email notification to registered users</li>
          <li>Displaying a notice on our website</li>
        </ul>
        <p>
          Your continued use of the Service after changes become effective constitutes acceptance of
          the modified Terms. If you do not agree to the modified Terms, you must stop using the
          Service.
        </p>
      </section>

      {/* 3. Account Registration */}
      <section id="account" className="mb-8">
        <h2>3. Account Registration</h2>

        <h3>3.1 Account Creation</h3>
        <p>
          To access certain features, you must create an account. You agree to provide accurate,
          current, and complete information during registration and to update such information to
          keep it accurate, current, and complete.
        </p>

        <h3>3.2 Account Security</h3>
        <p>You are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your account password</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized access or use</li>
        </ul>
        <p>
          We are not liable for any loss or damage arising from your failure to protect your account
          credentials.
        </p>

        <h3>3.3 Account Types</h3>
        <p>We offer different account types with varying features and limitations:</p>
        <ul>
          <li>
            <strong>Free Accounts:</strong> Basic access to our directory and limited features
          </li>
          <li>
            <strong>Premium Accounts:</strong> Enhanced features, detailed comparisons, and priority
            support
          </li>
          <li>
            <strong>Business Accounts:</strong> Team features, API access, and advanced analytics
          </li>
        </ul>
      </section>

      {/* 4. Use of Service */}
      <section id="use-of-service" className="mb-8">
        <h2>4. Use of Service</h2>

        <h3>4.1 License</h3>
        <p>
          Subject to these Terms, we grant you a limited, non-exclusive, non-transferable,
          revocable license to access and use the Service for your personal or internal business
          purposes.
        </p>

        <h3>4.2 Restrictions</h3>
        <p>You agree not to:</p>
        <ul>
          <li>Copy, modify, or create derivative works of the Service</li>
          <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
          <li>Remove or modify any proprietary notices or labels</li>
          <li>Use the Service for any illegal or unauthorized purpose</li>
          <li>Interfere with or disrupt the Service or servers</li>
          <li>
            Use automated systems (bots, scrapers) to access the Service without permission
          </li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Use the Service to transmit malware, viruses, or harmful code</li>
        </ul>

        <h3>4.3 API Usage</h3>
        <p>
          If you have access to our API, additional terms apply. API usage is subject to rate limits
          and fair use policies. Abuse of API access may result in suspension or termination.
        </p>
      </section>

      {/* 5. User Content */}
      <section id="user-content" className="mb-8">
        <h2>5. User-Generated Content</h2>

        <h3>5.1 Your Content</h3>
        <p>
          You may submit reviews, comments, ratings, and other content ("User Content") to the
          Service. You retain ownership of your User Content, but you grant us certain rights as
          described below.
        </p>

        <h3>5.2 License to Your Content</h3>
        <p>
          By submitting User Content, you grant ToolForge AI a worldwide, non-exclusive,
          royalty-free, transferable license to use, reproduce, modify, adapt, publish, translate,
          distribute, and display your User Content in connection with operating and promoting the
          Service.
        </p>

        <h3>5.3 Content Standards</h3>
        <p>Your User Content must:</p>
        <ul>
          <li>Be accurate and not misleading</li>
          <li>Not violate any laws or regulations</li>
          <li>Not infringe on intellectual property rights</li>
          <li>Not contain hate speech, harassment, or offensive material</li>
          <li>Not contain spam, advertising, or promotional content</li>
          <li>Not contain personal information of others without consent</li>
        </ul>

        <h3>5.4 Content Moderation</h3>
        <p>
          We reserve the right to review, monitor, edit, or remove any User Content at our sole
          discretion, without notice. We may remove content that violates these Terms or is
          otherwise objectionable.
        </p>

        <h3>5.5 Representations and Warranties</h3>
        <p>You represent and warrant that:</p>
        <ul>
          <li>You own or have the necessary rights to your User Content</li>
          <li>Your User Content does not violate any third-party rights</li>
          <li>Your User Content complies with these Terms and applicable laws</li>
        </ul>
      </section>

      {/* 6. Intellectual Property */}
      <section id="intellectual-property" className="mb-8">
        <h2>6. Intellectual Property Rights</h2>

        <h3>6.1 Our Content</h3>
        <p>
          The Service and its content (excluding User Content), including but not limited to text,
          graphics, logos, icons, images, audio clips, video clips, data compilations, software, and
          the compilation thereof (the "ToolForge Content"), are the property of ToolForge AI or its
          licensors and are protected by copyright, trademark, and other intellectual property laws.
        </p>

        <h3>6.2 Trademarks</h3>
        <p>
          "ToolForge AI," our logo, and other marks are trademarks of ToolForge AI. You may not use
          these trademarks without our prior written permission. Other trademarks appearing on the
          Service are the property of their respective owners.
        </p>

        <h3>6.3 DMCA Notice</h3>
        <p>
          We respect intellectual property rights and will respond to notices of alleged copyright
          infringement that comply with the Digital Millennium Copyright Act (DMCA). If you believe
          your copyrighted work has been infringed, please contact our DMCA agent at{' '}
          <a href="mailto:dmca@toolforge.ai">dmca@toolforge.ai</a> with:
        </p>
        <ul>
          <li>Identification of the copyrighted work</li>
          <li>Identification of the infringing material and its location</li>
          <li>Your contact information</li>
          <li>A statement of good faith belief</li>
          <li>A statement of accuracy under penalty of perjury</li>
          <li>Your physical or electronic signature</li>
        </ul>
      </section>

      {/* 7. Prohibited Conduct */}
      <section id="prohibited-conduct" className="mb-8">
        <h2>7. Prohibited Conduct</h2>
        <p>When using the Service, you agree not to:</p>

        <h3>7.1 Unlawful Activity</h3>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Engage in fraudulent or deceptive practices</li>
          <li>Infringe on intellectual property rights</li>
          <li>Violate privacy rights or publicity rights</li>
        </ul>

        <h3>7.2 Harmful Behavior</h3>
        <ul>
          <li>Harass, threaten, or intimidate other users</li>
          <li>Post hate speech or discriminatory content</li>
          <li>Impersonate any person or entity</li>
          <li>Engage in cyberbullying or stalking</li>
        </ul>

        <h3>7.3 Service Abuse</h3>
        <ul>
          <li>Submit fake reviews or manipulate ratings</li>
          <li>Create multiple accounts to evade bans or restrictions</li>
          <li>Engage in spam or unsolicited advertising</li>
          <li>Distribute malware or malicious code</li>
          <li>Attempt to hack, crack, or compromise security</li>
          <li>Overload or interfere with Service infrastructure</li>
        </ul>

        <h3>7.4 Data Scraping</h3>
        <ul>
          <li>Use automated tools to scrape or download content</li>
          <li>Harvest user data or email addresses</li>
          <li>Build competing services using our data</li>
        </ul>
      </section>

      {/* 8. Payments */}
      <section id="payments" className="mb-8">
        <h2>8. Payments and Subscriptions</h2>

        <h3>8.1 Pricing</h3>
        <p>
          Pricing for premium features and subscriptions is displayed on our website. All prices are
          in US Dollars unless otherwise specified and are subject to change with notice.
        </p>

        <h3>8.2 Payment Processing</h3>
        <p>
          Payments are processed through Stripe. You agree to provide accurate payment information
          and authorize us to charge your payment method. We do not store complete payment card
          details on our servers.
        </p>

        <h3>8.3 Subscriptions</h3>
        <p>For subscription services:</p>
        <ul>
          <li>Subscriptions automatically renew unless canceled</li>
          <li>You will be charged at the beginning of each billing cycle</li>
          <li>You can cancel anytime through your account settings</li>
          <li>Cancellations take effect at the end of the current billing period</li>
          <li>No refunds for partial subscription periods</li>
        </ul>

        <h3>8.4 Refund Policy</h3>
        <p>
          We offer refunds within 14 days of purchase for annual subscriptions if you are not
          satisfied with the Service. Monthly subscriptions are non-refundable. To request a refund,
          contact <a href="mailto:support@toolforge.ai">support@toolforge.ai</a>.
        </p>

        <h3>8.5 Taxes</h3>
        <p>
          You are responsible for any applicable taxes. If we are required to collect taxes, they
          will be added to your invoice.
        </p>
      </section>

      {/* 9. Affiliate Links */}
      <section id="affiliate" className="mb-8">
        <h2>9. Affiliate Links and Commissions</h2>
        <p>
          Our Service contains affiliate links to third-party AI tools and services. When you click
          these links and make a purchase, we may earn a commission at no additional cost to you.
        </p>
        <p>
          <strong>Important disclosures:</strong>
        </p>
        <ul>
          <li>Affiliate relationships do not influence our editorial content or reviews</li>
          <li>We only recommend tools we genuinely believe provide value</li>
          <li>Our ratings and reviews are independent and unbiased</li>
          <li>Affiliate commissions help us maintain and improve the Service</li>
        </ul>
        <p>
          For more information, see our{' '}
          <Link href="/disclaimer">Affiliate Disclosure</Link>.
        </p>
      </section>

      {/* 10. Disclaimers */}
      <section id="disclaimers" className="mb-8">
        <h2>10. Disclaimers</h2>

        <h3>10.1 "AS IS" Service</h3>
        <p className="uppercase font-semibold">
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <h3>10.2 No Guarantee of Accuracy</h3>
        <p>
          We strive to provide accurate and up-to-date information, but we do not guarantee the
          accuracy, completeness, or reliability of any content on the Service. Information about AI
          tools, pricing, and features may change without notice.
        </p>

        <h3>10.3 Third-Party Services</h3>
        <p>
          The Service contains links to third-party websites and services. We are not responsible
          for the content, privacy practices, or availability of third-party sites. Your
          interactions with third parties are solely between you and them.
        </p>

        <h3>10.4 User Content</h3>
        <p>
          We do not endorse, verify, or take responsibility for User Content. Reviews and ratings
          reflect the opinions of individual users and may not represent our views or official
          position.
        </p>

        <h3>10.5 No Professional Advice</h3>
        <p>
          The Service provides general information and recommendations but should not be considered
          professional, financial, legal, or technical advice. Consult qualified professionals for
          specific advice tailored to your situation.
        </p>

        <h3>10.6 Availability</h3>
        <p>
          We do not guarantee that the Service will be uninterrupted, secure, or error-free. We may
          modify, suspend, or discontinue any aspect of the Service at any time without notice.
        </p>
      </section>

      {/* 11. Limitation of Liability */}
      <section id="limitation" className="mb-8">
        <h2>11. Limitation of Liability</h2>
        <p className="uppercase font-semibold">
          TO THE FULLEST EXTENT PERMITTED BY LAW, TOOLFORGE AI AND ITS AFFILIATES, OFFICERS,
          DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS
          OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
        </p>
        <ul>
          <li>Your access to or use of (or inability to access or use) the Service</li>
          <li>Any conduct or content of any third party on the Service</li>
          <li>Any content obtained from the Service</li>
          <li>Unauthorized access, use, or alteration of your data</li>
        </ul>
        <p className="mt-4">
          IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS RELATING TO THE SERVICE EXCEED
          THE AMOUNT YOU PAID US IN THE 12 MONTHS PRIOR TO THE CLAIM, OR $100 USD, WHICHEVER IS
          GREATER.
        </p>
        <p className="mt-4">
          Some jurisdictions do not allow the exclusion of certain warranties or limitation of
          liability for incidental or consequential damages. In such jurisdictions, our liability
          will be limited to the maximum extent permitted by law.
        </p>
      </section>

      {/* 12. Indemnification */}
      <section id="indemnification" className="mb-8">
        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless ToolForge AI and its affiliates,
          officers, directors, employees, agents, and licensors from and against any claims,
          liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising
          out of or in any way connected with:
        </p>
        <ul>
          <li>Your access to or use of the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your User Content or submissions</li>
          <li>Your violation of any third-party rights</li>
          <li>Your violation of any applicable laws or regulations</li>
        </ul>
      </section>

      {/* 13. Termination */}
      <section id="termination" className="mb-8">
        <h2>13. Termination</h2>

        <h3>13.1 By You</h3>
        <p>
          You may terminate your account at any time by contacting us or using the account deletion
          feature in your account settings. Termination does not entitle you to a refund of any
          fees already paid.
        </p>

        <h3>13.2 By Us</h3>
        <p>
          We may suspend or terminate your account and access to the Service at any time, with or
          without notice, for any reason, including but not limited to:
        </p>
        <ul>
          <li>Violation of these Terms</li>
          <li>Suspected fraudulent or illegal activity</li>
          <li>Extended periods of inactivity</li>
          <li>At our sole discretion</li>
        </ul>

        <h3>13.3 Effect of Termination</h3>
        <p>Upon termination:</p>
        <ul>
          <li>Your right to access and use the Service immediately ceases</li>
          <li>We may delete your account and data</li>
          <li>You remain liable for any obligations incurred before termination</li>
          <li>Provisions that should survive termination remain in effect</li>
        </ul>
      </section>

      {/* 14. Dispute Resolution */}
      <section id="dispute" className="mb-8">
        <h2>14. Dispute Resolution</h2>

        <h3>14.1 Informal Resolution</h3>
        <p>
          If you have a dispute with us, please contact us first at{' '}
          <a href="mailto:legal@toolforge.ai">legal@toolforge.ai</a> to attempt to resolve the
          issue informally. Most disputes can be resolved through good-faith negotiation.
        </p>

        <h3>14.2 Arbitration</h3>
        <p>
          If we cannot resolve a dispute informally, any dispute arising out of or relating to these
          Terms or the Service shall be resolved through binding arbitration in accordance with the
          rules of the American Arbitration Association. The arbitration shall take place in San
          Francisco, California, USA.
        </p>

        <h3>14.3 Class Action Waiver</h3>
        <p>
          You agree to resolve disputes with us on an individual basis and waive any right to bring
          claims as part of a class action, consolidated action, or representative action.
        </p>

        <h3>14.4 Exceptions</h3>
        <p>
          Notwithstanding the above, either party may seek injunctive or other equitable relief in
          any court of competent jurisdiction to protect intellectual property rights or prevent
          unauthorized use of the Service.
        </p>
      </section>

      {/* 15. General Provisions */}
      <section id="general" className="mb-8">
        <h2>15. General Provisions</h2>

        <h3>15.1 Governing Law</h3>
        <p>
          These Terms are governed by and construed in accordance with the laws of the State of
          California, USA, without regard to conflict of law principles. For EU users, mandatory
          consumer protection laws in your country of residence may also apply.
        </p>

        <h3>15.2 Entire Agreement</h3>
        <p>
          These Terms, together with our Privacy Policy and any other legal notices published on the
          Service, constitute the entire agreement between you and ToolForge AI regarding the
          Service.
        </p>

        <h3>15.3 Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining
          provisions shall remain in full force and effect, and the invalid provision shall be
          modified to achieve the intent of the parties to the maximum extent possible.
        </p>

        <h3>15.4 Waiver</h3>
        <p>
          Our failure to enforce any right or provision of these Terms shall not be deemed a waiver
          of such right or provision.
        </p>

        <h3>15.5 Assignment</h3>
        <p>
          You may not assign or transfer these Terms or your rights hereunder without our prior
          written consent. We may assign these Terms without restriction.
        </p>

        <h3>15.6 Force Majeure</h3>
        <p>
          We shall not be liable for any failure or delay in performance due to circumstances beyond
          our reasonable control, including acts of God, war, terrorism, pandemics, or internet
          service failures.
        </p>
      </section>

      {/* 16. Contact */}
      <section id="contact" className="mb-8">
        <h2>16. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us:
        </p>
        <div className="not-prose bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
          <p className="font-semibold text-gray-900 mb-2">ToolForge AI Legal Department</p>
          <p className="text-gray-700 mb-1">
            <strong>General Inquiries:</strong>{' '}
            <a href="mailto:legal@toolforge.ai" className="text-primary-600 hover:text-primary-700">
              legal@toolforge.ai
            </a>
          </p>
          <p className="text-gray-700 mb-1">
            <strong>DMCA Agent:</strong>{' '}
            <a href="mailto:dmca@toolforge.ai" className="text-primary-600 hover:text-primary-700">
              dmca@toolforge.ai
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Support:</strong>{' '}
            <a href="mailto:support@toolforge.ai" className="text-primary-600 hover:text-primary-700">
              support@toolforge.ai
            </a>
          </p>
        </div>
      </section>

      {/* Related Links */}
      <div className="not-prose mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Legal Documents</h3>
        <div className="grid sm:grid-cols-3 gap-4">
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
          <Link
            href="/disclaimer"
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">Disclaimer</div>
            <div className="text-sm text-gray-600">Affiliate disclosure</div>
          </Link>
        </div>
      </div>
    </LegalLayout>
  );
}
