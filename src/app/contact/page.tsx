'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'general',
          message: '',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again or email us directly.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We'd love to hear from you. Our team
            typically responds within 24-48 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-3">
                For general inquiries and support
              </p>
              <a
                href="mailto:hello@toolforge.ai"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                hello@toolforge.ai
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600">
                We aim to respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">
                San Francisco, CA
                <br />
                United States
              </p>
            </div>

            {/* Specific Contacts */}
            <div className="bg-primary-50 rounded-lg border border-primary-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Specific Inquiries
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Partnership & Business</p>
                  <a
                    href="mailto:partnerships@toolforge.ai"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    partnerships@toolforge.ai
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Legal & Privacy</p>
                  <a
                    href="mailto:legal@toolforge.ai"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    legal@toolforge.ai
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Press & Media</p>
                  <a
                    href="mailto:press@toolforge.ai"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    press@toolforge.ai
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Technical Support</p>
                  <a
                    href="mailto:support@toolforge.ai"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    support@toolforge.ai
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We'll get back to you within 24-48 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Send Us a Message
                  </h2>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press & Media</option>
                      <option value="tool-submission">Submit a Tool</option>
                      <option value="report">Report an Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="How can we help?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        By submitting this form, you agree to our{' '}
                        <a href="/privacy" className="text-primary-600 hover:text-primary-700">
                          Privacy Policy
                        </a>
                        . We'll only use your information to respond to your inquiry.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I submit a new AI tool?
              </h3>
              <p className="text-gray-600">
                You can submit a new AI tool by selecting "Submit a Tool" in the contact form
                category, or email us directly at{' '}
                <a href="mailto:submissions@toolforge.ai" className="text-primary-600">
                  submissions@toolforge.ai
                </a>{' '}
                with details about the tool.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How can I claim my tool listing?
              </h3>
              <p className="text-gray-600">
                If you're the owner or developer of an AI tool listed on our platform, contact us
                at{' '}
                <a href="mailto:hello@toolforge.ai" className="text-primary-600">
                  hello@toolforge.ai
                </a>{' '}
                to claim and verify your listing.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer advertising opportunities?
              </h3>
              <p className="text-gray-600">
                Yes! We offer various advertising and sponsorship opportunities. Contact our
                partnerships team at{' '}
                <a href="mailto:partnerships@toolforge.ai" className="text-primary-600">
                  partnerships@toolforge.ai
                </a>{' '}
                for more information.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I report incorrect information?
              </h3>
              <p className="text-gray-600">
                We strive for accuracy in all our listings. If you notice incorrect information,
                please use the "Report an Issue" category in the contact form, or email{' '}
                <a href="mailto:support@toolforge.ai" className="text-primary-600">
                  support@toolforge.ai
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
