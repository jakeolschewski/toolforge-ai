import type { Metadata } from 'next';
import Link from 'next/link';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how ToolForge AI collects, uses, and protects your personal information. GDPR and CCPA compliant privacy policy.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information."
      lastUpdated="February 11, 2026"
    >
      {/* Table of Contents */}
      <div className="not-prose bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          <a href="#information-we-collect" className="block text-primary-600 hover:text-primary-700">
            1. Information We Collect
          </a>
          <a href="#how-we-use" className="block text-primary-600 hover:text-primary-700">
            2. How We Use Your Information
          </a>
          <a href="#cookies" className="block text-primary-600 hover:text-primary-700">
            3. Cookies and Tracking Technologies
          </a>
          <a href="#third-party" className="block text-primary-600 hover:text-primary-700">
            4. Third-Party Services
          </a>
          <a href="#data-security" className="block text-primary-600 hover:text-primary-700">
            5. Data Security
          </a>
          <a href="#your-rights" className="block text-primary-600 hover:text-primary-700">
            6. Your Privacy Rights
          </a>
          <a href="#gdpr" className="block text-primary-600 hover:text-primary-700">
            7. GDPR Compliance (EU Users)
          </a>
          <a href="#ccpa" className="block text-primary-600 hover:text-primary-700">
            8. CCPA Rights (California Users)
          </a>
          <a href="#children" className="block text-primary-600 hover:text-primary-700">
            9. Children's Privacy
          </a>
          <a href="#changes" className="block text-primary-600 hover:text-primary-700">
            10. Changes to This Policy
          </a>
          <a href="#contact" className="block text-primary-600 hover:text-primary-700">
            11. Contact Us
          </a>
        </nav>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <p className="lead text-lg">
          At ToolForge AI ("we," "us," or "our"), we are committed to protecting your privacy and
          ensuring transparency in how we handle your personal information. This Privacy Policy
          describes how we collect, use, and share information when you use our website and services.
        </p>
        <p>
          By using ToolForge AI, you agree to the collection and use of information in accordance
          with this Privacy Policy. If you do not agree with our policies, please do not use our
          services.
        </p>
      </section>

      {/* 1. Information We Collect */}
      <section id="information-we-collect" className="mb-8">
        <h2>1. Information We Collect</h2>

        <h3>1.1 Information You Provide</h3>
        <p>We collect information that you voluntarily provide to us, including:</p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you create an account, we collect your name,
            email address, and password.
          </li>
          <li>
            <strong>Profile Information:</strong> Additional information you choose to add to your
            profile, such as bio, website, or company information.
          </li>
          <li>
            <strong>Communications:</strong> When you contact us via email or contact forms, we
            collect your name, email address, and message content.
          </li>
          <li>
            <strong>Payment Information:</strong> If you make purchases, our payment processor
            (Stripe) collects payment card information. We do not store complete payment card
            details on our servers.
          </li>
          <li>
            <strong>User-Generated Content:</strong> Reviews, comments, ratings, and other content
            you submit to our platform.
          </li>
        </ul>

        <h3>1.2 Automatically Collected Information</h3>
        <p>When you use our website, we automatically collect certain information:</p>
        <ul>
          <li>
            <strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, search
            queries, and other usage statistics.
          </li>
          <li>
            <strong>Device Information:</strong> IP address, browser type and version, device type,
            operating system, and unique device identifiers.
          </li>
          <li>
            <strong>Location Data:</strong> General location based on IP address (city/country
            level, not precise geolocation).
          </li>
          <li>
            <strong>Cookies and Similar Technologies:</strong> See our{' '}
            <Link href="/cookies">Cookie Policy</Link> for detailed information.
          </li>
        </ul>

        <h3>1.3 Information from Third Parties</h3>
        <p>We may receive information about you from third parties:</p>
        <ul>
          <li>
            <strong>Authentication Providers:</strong> If you sign in using Google or other OAuth
            providers, we receive basic profile information.
          </li>
          <li>
            <strong>Analytics Partners:</strong> Aggregated analytics data from Vercel Analytics
            and similar services.
          </li>
          <li>
            <strong>AI Tool Providers:</strong> When you click affiliate links, we may receive
            confirmation of conversions (but not your personal details).
          </li>
        </ul>
      </section>

      {/* 2. How We Use Your Information */}
      <section id="how-we-use" className="mb-8">
        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>

        <h3>2.1 Service Delivery</h3>
        <ul>
          <li>Provide, maintain, and improve our website and services</li>
          <li>Process your account registration and manage your account</li>
          <li>Enable you to submit and manage reviews and content</li>
          <li>Process payments and send transaction confirmations</li>
          <li>Respond to your inquiries and provide customer support</li>
        </ul>

        <h3>2.2 Communication</h3>
        <ul>
          <li>Send you service-related announcements and updates</li>
          <li>Send newsletters and promotional materials (with your consent)</li>
          <li>Notify you about new AI tools, features, or content that may interest you</li>
          <li>Respond to your questions and comments</li>
        </ul>

        <h3>2.3 Analytics and Improvement</h3>
        <ul>
          <li>Analyze usage patterns to improve user experience</li>
          <li>Conduct research and analytics on user behavior</li>
          <li>Test new features and optimize existing functionality</li>
          <li>Monitor and analyze trends, usage, and activities</li>
        </ul>

        <h3>2.4 Security and Fraud Prevention</h3>
        <ul>
          <li>Detect, prevent, and address technical issues</li>
          <li>Protect against fraudulent or illegal activity</li>
          <li>Enforce our Terms of Service and other policies</li>
          <li>Verify user identity and prevent abuse</li>
        </ul>

        <h3>2.5 Legal Obligations</h3>
        <ul>
          <li>Comply with legal requirements and legal process</li>
          <li>Protect our rights, privacy, safety, or property</li>
          <li>Respond to law enforcement requests</li>
        </ul>
      </section>

      {/* 3. Cookies */}
      <section id="cookies" className="mb-8">
        <h2>3. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our website and
          store certain information. You can control cookie preferences through our cookie consent
          banner or your browser settings.
        </p>
        <p>
          For detailed information about the cookies we use and your choices, please see our{' '}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </section>

      {/* 4. Third-Party Services */}
      <section id="third-party" className="mb-8">
        <h2>4. Third-Party Services</h2>
        <p>We use the following third-party service providers:</p>

        <h3>4.1 Hosting and Infrastructure</h3>
        <ul>
          <li>
            <strong>Vercel:</strong> Website hosting and deployment. See{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              Vercel Privacy Policy
            </a>
          </li>
          <li>
            <strong>Supabase:</strong> Database and authentication services. See{' '}
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
              Supabase Privacy Policy
            </a>
          </li>
        </ul>

        <h3>4.2 Payment Processing</h3>
        <ul>
          <li>
            <strong>Stripe:</strong> Payment processing for subscriptions and transactions. Stripe
            handles your payment information directly and we do not store complete payment card
            details. See{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              Stripe Privacy Policy
            </a>
          </li>
        </ul>

        <h3>4.3 Analytics and Performance</h3>
        <ul>
          <li>
            <strong>Vercel Analytics:</strong> Privacy-friendly website analytics that don't use
            cookies or track personal information.
          </li>
          <li>
            <strong>Vercel Speed Insights:</strong> Performance monitoring to improve site speed.
          </li>
        </ul>

        <h3>4.4 Email Services</h3>
        <ul>
          <li>
            <strong>Transactional Emails:</strong> We use email service providers to send
            account-related and transactional emails.
          </li>
        </ul>

        <p className="mt-4">
          <strong>Note:</strong> These third-party services have their own privacy policies. We
          recommend reviewing them to understand how they handle your data.
        </p>
      </section>

      {/* 5. Data Security */}
      <section id="data-security" className="mb-8">
        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your
          personal information against unauthorized access, alteration, disclosure, or destruction.
          These measures include:
        </p>
        <ul>
          <li>Encryption of data in transit using SSL/TLS protocols</li>
          <li>Encryption of sensitive data at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication requirements</li>
          <li>Secure password hashing (bcrypt)</li>
          <li>Regular backups and disaster recovery procedures</li>
        </ul>
        <p>
          However, no method of transmission over the internet or electronic storage is 100% secure.
          While we strive to protect your personal information, we cannot guarantee absolute
          security.
        </p>
      </section>

      {/* 6. Your Rights */}
      <section id="your-rights" className="mb-8">
        <h2>6. Your Privacy Rights</h2>
        <p>You have the following rights regarding your personal information:</p>

        <h3>6.1 Access and Portability</h3>
        <ul>
          <li>Request a copy of your personal data we hold</li>
          <li>Receive your data in a structured, machine-readable format</li>
          <li>Transfer your data to another service provider</li>
        </ul>

        <h3>6.2 Correction and Deletion</h3>
        <ul>
          <li>Correct inaccurate or incomplete personal information</li>
          <li>Request deletion of your personal data (right to be forgotten)</li>
          <li>Delete your account and associated data</li>
        </ul>

        <h3>6.3 Restriction and Objection</h3>
        <ul>
          <li>Restrict how we process your personal data</li>
          <li>Object to processing based on legitimate interests</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h3>6.4 Withdraw Consent</h3>
        <ul>
          <li>Withdraw consent for data processing where consent was the legal basis</li>
          <li>Change your cookie preferences at any time</li>
        </ul>

        <p className="mt-4">
          To exercise these rights, please contact us at{' '}
          <a href="mailto:privacy@toolforge.ai">privacy@toolforge.ai</a>. We will respond to your
          request within 30 days.
        </p>
      </section>

      {/* 7. GDPR Compliance */}
      <section id="gdpr" className="mb-8">
        <h2>7. GDPR Compliance (European Users)</h2>
        <p>
          If you are located in the European Economic Area (EEA), you have certain data protection
          rights under the General Data Protection Regulation (GDPR).
        </p>

        <h3>7.1 Legal Basis for Processing</h3>
        <p>We process your personal data based on the following legal grounds:</p>
        <ul>
          <li>
            <strong>Consent:</strong> You have given clear consent for specific processing
            activities (e.g., marketing emails, optional cookies)
          </li>
          <li>
            <strong>Contract:</strong> Processing is necessary to provide our services and fulfill
            our contractual obligations
          </li>
          <li>
            <strong>Legitimate Interests:</strong> Processing is necessary for our legitimate
            business interests (e.g., fraud prevention, security, analytics)
          </li>
          <li>
            <strong>Legal Obligation:</strong> Processing is required to comply with legal
            requirements
          </li>
        </ul>

        <h3>7.2 Data Retention</h3>
        <p>We retain your personal information only for as long as necessary to:</p>
        <ul>
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce our agreements</li>
        </ul>
        <p>
          When data is no longer needed, we will securely delete or anonymize it. Typical retention
          periods:
        </p>
        <ul>
          <li>Active account data: Duration of account plus 90 days</li>
          <li>Transaction records: 7 years (legal requirement)</li>
          <li>Analytics data: 26 months (anonymized)</li>
          <li>Marketing data: Until consent is withdrawn</li>
        </ul>

        <h3>7.3 International Data Transfers</h3>
        <p>
          Your personal information may be transferred to and processed in countries outside the
          EEA. We ensure appropriate safeguards are in place, including:
        </p>
        <ul>
          <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
          <li>Working with service providers that comply with GDPR requirements</li>
          <li>Ensuring adequate data protection measures in third countries</li>
        </ul>

        <h3>7.4 Right to Lodge a Complaint</h3>
        <p>
          You have the right to lodge a complaint with a supervisory authority if you believe we
          have not complied with GDPR requirements. In the UK, this is the Information
          Commissioner's Office (ICO).
        </p>
      </section>

      {/* 8. CCPA Compliance */}
      <section id="ccpa" className="mb-8">
        <h2>8. CCPA Rights (California Residents)</h2>
        <p>
          If you are a California resident, you have specific rights under the California Consumer
          Privacy Act (CCPA) and the California Privacy Rights Act (CPRA).
        </p>

        <h3>8.1 Categories of Personal Information</h3>
        <p>We collect and process the following categories of personal information:</p>
        <ul>
          <li>
            <strong>Identifiers:</strong> Name, email address, IP address, account username
          </li>
          <li>
            <strong>Commercial Information:</strong> Purchase history, transaction records
          </li>
          <li>
            <strong>Internet Activity:</strong> Browsing history, search history, interactions with
            our website
          </li>
          <li>
            <strong>Geolocation Data:</strong> General location based on IP address
          </li>
          <li>
            <strong>Inferences:</strong> Preferences and characteristics derived from your activity
          </li>
        </ul>

        <h3>8.2 Your CCPA Rights</h3>
        <p>California residents have the right to:</p>
        <ul>
          <li>
            <strong>Know:</strong> Request disclosure of personal information we collect, use,
            disclose, or sell
          </li>
          <li>
            <strong>Delete:</strong> Request deletion of personal information we have collected
          </li>
          <li>
            <strong>Opt-Out:</strong> Opt-out of the sale or sharing of personal information
          </li>
          <li>
            <strong>Correct:</strong> Request correction of inaccurate personal information
          </li>
          <li>
            <strong>Non-Discrimination:</strong> Not be discriminated against for exercising these
            rights
          </li>
        </ul>

        <h3>8.3 We Do Not Sell Personal Information</h3>
        <p>
          <strong>Important:</strong> We do not sell your personal information for monetary
          consideration. However, under CCPA's broad definition, sharing data with advertising
          partners may be considered a "sale." We provide cookie controls to opt-out of such
          sharing.
        </p>

        <h3>8.4 Exercising Your CCPA Rights</h3>
        <p>To exercise your CCPA rights:</p>
        <ul>
          <li>
            Email us at <a href="mailto:privacy@toolforge.ai">privacy@toolforge.ai</a>
          </li>
          <li>Use our contact form with subject "CCPA Request"</li>
          <li>We will verify your identity and respond within 45 days</li>
        </ul>

        <h3>8.5 Authorized Agents</h3>
        <p>
          You may designate an authorized agent to make a request on your behalf. We may require
          written proof of authorization.
        </p>
      </section>

      {/* 9. Children's Privacy */}
      <section id="children" className="mb-8">
        <h2>9. Children's Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 16. We do not knowingly
          collect personal information from children under 16. If you are a parent or guardian and
          believe your child has provided us with personal information, please contact us at{' '}
          <a href="mailto:privacy@toolforge.ai">privacy@toolforge.ai</a> and we will delete such
          information.
        </p>
      </section>

      {/* 10. Changes to This Policy */}
      <section id="changes" className="mb-8">
        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices,
          technology, legal requirements, or other factors. We will notify you of any material
          changes by:
        </p>
        <ul>
          <li>Posting the updated policy on this page with a new "Last Updated" date</li>
          <li>Sending an email notification to registered users (for significant changes)</li>
          <li>Displaying a prominent notice on our website</li>
        </ul>
        <p>
          Your continued use of our services after changes become effective constitutes acceptance
          of the updated Privacy Policy.
        </p>
      </section>

      {/* 11. Contact Us */}
      <section id="contact" className="mb-8">
        <h2>11. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data
          practices, please contact us:
        </p>
        <div className="not-prose bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
          <p className="font-semibold text-gray-900 mb-2">ToolForge AI Privacy Team</p>
          <p className="text-gray-700 mb-1">
            <strong>Email:</strong>{' '}
            <a href="mailto:privacy@toolforge.ai" className="text-primary-600 hover:text-primary-700">
              privacy@toolforge.ai
            </a>
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Legal Inquiries:</strong>{' '}
            <a href="mailto:legal@toolforge.ai" className="text-primary-600 hover:text-primary-700">
              legal@toolforge.ai
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Response Time:</strong> We aim to respond within 72 hours
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
            href="/cookies"
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">Cookie Policy</div>
            <div className="text-sm text-gray-600">How we use cookies</div>
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
