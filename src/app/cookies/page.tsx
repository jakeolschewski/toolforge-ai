import type { Metadata } from 'next';
import Link from 'next/link';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Learn about how ToolForge AI uses cookies and similar tracking technologies. GDPR compliant cookie policy.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="This Cookie Policy explains how ToolForge AI uses cookies and similar tracking technologies, and how you can control them."
      lastUpdated="February 11, 2026"
    >
      {/* Table of Contents */}
      <div className="not-prose bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          <a href="#what-are-cookies" className="block text-primary-600 hover:text-primary-700">
            1. What Are Cookies?
          </a>
          <a href="#how-we-use" className="block text-primary-600 hover:text-primary-700">
            2. How We Use Cookies
          </a>
          <a href="#types-of-cookies" className="block text-primary-600 hover:text-primary-700">
            3. Types of Cookies We Use
          </a>
          <a href="#third-party" className="block text-primary-600 hover:text-primary-700">
            4. Third-Party Cookies
          </a>
          <a href="#your-choices" className="block text-primary-600 hover:text-primary-700">
            5. Your Cookie Choices
          </a>
          <a href="#other-technologies" className="block text-primary-600 hover:text-primary-700">
            6. Other Tracking Technologies
          </a>
          <a href="#updates" className="block text-primary-600 hover:text-primary-700">
            7. Updates to This Policy
          </a>
          <a href="#contact" className="block text-primary-600 hover:text-primary-700">
            8. Contact Us
          </a>
        </nav>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <p className="lead text-lg">
          This Cookie Policy explains how ToolForge AI uses cookies and similar technologies to
          recognize you when you visit our website. It explains what these technologies are, why we
          use them, and your rights to control our use of them.
        </p>
      </section>

      {/* 1. What Are Cookies */}
      <section id="what-are-cookies" className="mb-8">
        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your device (computer, smartphone, or
          tablet) when you visit a website. Cookies are widely used to make websites work more
          efficiently and provide information to website owners.
        </p>
        <p>Cookies serve various purposes:</p>
        <ul>
          <li>
            <strong>Session Cookies:</strong> Temporary cookies that expire when you close your
            browser, used to maintain your session as you navigate the site
          </li>
          <li>
            <strong>Persistent Cookies:</strong> Cookies that remain on your device for a set
            period or until you delete them, used to remember your preferences
          </li>
          <li>
            <strong>First-Party Cookies:</strong> Cookies set by the website you're visiting
          </li>
          <li>
            <strong>Third-Party Cookies:</strong> Cookies set by domains other than the one you're
            visiting, often used for advertising and analytics
          </li>
        </ul>
      </section>

      {/* 2. How We Use Cookies */}
      <section id="how-we-use" className="mb-8">
        <h2>2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>

        <h3>2.1 Essential Operations</h3>
        <p>
          Some cookies are essential for the operation of our website. These cookies enable core
          functionality such as security, network management, and accessibility. You cannot opt-out
          of these cookies as they are strictly necessary for the website to function.
        </p>

        <h3>2.2 Authentication and Security</h3>
        <p>
          We use cookies to authenticate users and prevent fraudulent use of login credentials. This
          helps us keep your account secure and protect against unauthorized access.
        </p>

        <h3>2.3 Preferences and Settings</h3>
        <p>
          We use cookies to remember your preferences and settings, such as your language preference,
          display settings, and cookie consent choices. This provides a more personalized experience
          on subsequent visits.
        </p>

        <h3>2.4 Analytics and Performance</h3>
        <p>
          We use cookies to understand how visitors interact with our website. This helps us analyze
          usage patterns, identify popular features, and improve our services. These cookies collect
          information in an aggregated form.
        </p>

        <h3>2.5 Marketing and Advertising</h3>
        <p>
          We may use cookies to deliver relevant advertisements and track the effectiveness of our
          marketing campaigns. These cookies help us show you ads that may be of interest to you
          based on your browsing behavior.
        </p>
      </section>

      {/* 3. Types of Cookies */}
      <section id="types-of-cookies" className="mb-8">
        <h2>3. Types of Cookies We Use</h2>
        <p>
          Below is a detailed list of the cookies we use on our website. We've categorized them by
          purpose to help you understand why we need them.
        </p>

        {/* Essential Cookies Table */}
        <h3>3.1 Essential Cookies</h3>
        <p>These cookies are strictly necessary for the website to function properly.</p>
        <div className="not-prose overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cookie Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">next-auth.session-token</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  Maintains user authentication session
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">30 days</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">next-auth.csrf-token</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  Protects against Cross-Site Request Forgery attacks
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Session</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">toolforge_cookie_consent</td>
                <td className="px-4 py-3 text-sm text-gray-600">Stores your cookie preferences</td>
                <td className="px-4 py-3 text-sm text-gray-600">1 year</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Analytics Cookies Table */}
        <h3 className="mt-6">3.2 Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors use our website so we can improve it.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cookie Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">__vercel_live_token</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  Vercel Analytics tracking (privacy-friendly, no personal data)
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Persistent</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">_ga</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  Google Analytics - distinguishes unique users
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">2 years</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">_ga_*</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  Google Analytics - persists session state
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">2 years</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Marketing Cookies Table */}
        <h3 className="mt-6">3.3 Marketing Cookies</h3>
        <p>
          These cookies track your browsing habits to deliver personalized advertising.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cookie Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">_fbp</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  Facebook Pixel - tracks conversions and remarketing
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">3 months</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">_gcl_au</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  Google Ads - conversion tracking
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">3 months</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Third-Party Cookies */}
      <section id="third-party" className="mb-8">
        <h2>4. Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we use various third-party services that may set cookies
          on your device. These services include:
        </p>

        <h3>4.1 Vercel Analytics</h3>
        <p>
          We use Vercel Analytics for privacy-friendly website analytics. Unlike traditional
          analytics tools, Vercel Analytics does not use cookies or collect personal information.
          Learn more in{' '}
          <a
            href="https://vercel.com/docs/concepts/analytics/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel's Privacy Policy
          </a>
          .
        </p>

        <h3>4.2 Google Analytics (If Enabled)</h3>
        <p>
          We may use Google Analytics to analyze website traffic and usage patterns. Google Analytics
          uses cookies to collect information about your use of our website. You can opt-out of
          Google Analytics by installing the{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>

        <h3>4.3 Social Media Plugins</h3>
        <p>
          Our website may include social media features (e.g., share buttons). These features may
          set cookies to track your interactions. These cookies are governed by the privacy policies
          of the respective social media platforms.
        </p>

        <h3>4.4 Advertising Partners</h3>
        <p>
          We work with advertising partners to display relevant ads. These partners may use cookies
          to serve personalized ads based on your browsing behavior. You can opt-out of personalized
          advertising through our cookie consent banner or industry opt-out tools.
        </p>
      </section>

      {/* 5. Your Choices */}
      <section id="your-choices" className="mb-8">
        <h2>5. Your Cookie Choices</h2>
        <p>You have several options to control and manage cookies:</p>

        <h3>5.1 Cookie Consent Banner</h3>
        <p>
          When you first visit our website, you'll see a cookie consent banner. You can choose to:
        </p>
        <ul>
          <li>
            <strong>Accept All:</strong> Allow all cookies, including analytics and marketing
            cookies
          </li>
          <li>
            <strong>Reject All:</strong> Only allow essential cookies required for the website to
            function
          </li>
          <li>
            <strong>Customize:</strong> Choose which categories of cookies you want to allow
          </li>
        </ul>
        <p>
          You can change your cookie preferences at any time by clicking the "Cookie Settings" link
          in our website footer.
        </p>

        <h3>5.2 Browser Settings</h3>
        <p>
          Most web browsers allow you to control cookies through their settings. You can configure
          your browser to:
        </p>
        <ul>
          <li>Block all cookies</li>
          <li>Block third-party cookies only</li>
          <li>Delete cookies when you close your browser</li>
          <li>Receive notifications when cookies are set</li>
        </ul>
        <p>Here's how to manage cookies in popular browsers:</p>
        <ul>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          <strong>Note:</strong> Blocking cookies may affect your experience on our website and
          prevent certain features from working properly.
        </p>

        <h3>5.3 Opt-Out Tools</h3>
        <p>You can opt-out of interest-based advertising through these industry tools:</p>
        <ul>
          <li>
            <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
              Digital Advertising Alliance (DAA)
            </a>
          </li>
          <li>
            <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
              Network Advertising Initiative (NAI)
            </a>
          </li>
          <li>
            <a href="https://youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">
              Your Online Choices (EU)
            </a>
          </li>
        </ul>

        <h3>5.4 Mobile Device Settings</h3>
        <p>
          Mobile devices offer settings to limit ad tracking:
        </p>
        <ul>
          <li>
            <strong>iOS:</strong> Settings &gt; Privacy &gt; Tracking &gt; "Allow Apps to Request
            to Track" (disable)
          </li>
          <li>
            <strong>Android:</strong> Settings &gt; Google &gt; Ads &gt; "Opt out of Ads
            Personalization"
          </li>
        </ul>

        <h3>5.5 Do Not Track</h3>
        <p>
          Some browsers have a "Do Not Track" (DNT) feature that signals to websites that you don't
          want your online activity tracked. Currently, there is no universal standard for how
          websites should respond to DNT signals. We honor DNT signals where technically feasible.
        </p>
      </section>

      {/* 6. Other Technologies */}
      <section id="other-technologies" className="mb-8">
        <h2>6. Other Tracking Technologies</h2>
        <p>In addition to cookies, we may use other tracking technologies:</p>

        <h3>6.1 Web Beacons (Pixels)</h3>
        <p>
          Web beacons are tiny graphics with a unique identifier that track user behavior. We may use
          web beacons in emails to track open rates and click-throughs, helping us understand the
          effectiveness of our communications.
        </p>

        <h3>6.2 Local Storage</h3>
        <p>
          We use local storage (localStorage and sessionStorage) to store preferences and data
          locally in your browser. This data persists across browser sessions and helps provide a
          better user experience.
        </p>

        <h3>6.3 Server Logs</h3>
        <p>
          Our servers automatically collect certain information when you visit our website, including
          your IP address, browser type, operating system, referring URLs, and pages visited. This
          information is used for analytics, security, and troubleshooting purposes.
        </p>
      </section>

      {/* 7. Updates */}
      <section id="updates" className="mb-8">
        <h2>7. Updates to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our practices,
          technology, or legal requirements. When we make material changes, we will update the "Last
          Updated" date at the top of this page and may provide additional notice (such as a banner
          on our website).
        </p>
        <p>
          We encourage you to review this Cookie Policy periodically to stay informed about our use
          of cookies.
        </p>
      </section>

      {/* 8. Contact */}
      <section id="contact" className="mb-8">
        <h2>8. Contact Us</h2>
        <p>
          If you have questions about our use of cookies or this Cookie Policy, please contact us:
        </p>
        <div className="not-prose bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
          <p className="font-semibold text-gray-900 mb-2">ToolForge AI Privacy Team</p>
          <p className="text-gray-700 mb-1">
            <strong>Email:</strong>{' '}
            <a href="mailto:privacy@toolforge.ai" className="text-primary-600 hover:text-primary-700">
              privacy@toolforge.ai
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Subject Line:</strong> Cookie Policy Inquiry
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
            <div className="text-sm text-gray-600">How we protect your data</div>
          </Link>
          <Link
            href="/terms"
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">Terms of Service</div>
            <div className="text-sm text-gray-600">Our terms and conditions</div>
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
