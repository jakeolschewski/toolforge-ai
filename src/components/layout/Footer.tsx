'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Twitter, Github, Linkedin, Send } from 'lucide-react';
import Button from '@/components/ui/Button';

const categories = [
  { name: 'Writing', slug: 'writing' },
  { name: 'Images', slug: 'image' },
  { name: 'Video', slug: 'video' },
  { name: 'Coding', slug: 'code' },
  { name: 'Chatbots', slug: 'chat' },
  { name: 'Productivity', slug: 'productivity' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white inline-block mb-4">
              ToolForge<span className="text-primary-400">.AI</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover, compare, and choose the best AI tools for your needs.
              Comprehensive reviews and honest comparisons.
            </p>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <Button type="submit" variant="primary" size="md">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              {subscribed && (
                <p className="text-green-400 text-sm mt-2">Thanks for subscribing!</p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="hover:text-primary-400 transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-primary-400 transition-colors">
                  Submit Tool
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-primary-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-primary-400 transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} ToolForge AI. All rights reserved. We may earn a commission when you
              purchase through our affiliate links.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/toolforgeai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/toolforgeai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/toolforgeai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@toolforge.ai"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
