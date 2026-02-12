import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileText } from 'lucide-react';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  lastUpdated: string;
}

export default function LegalLayout({
  children,
  title,
  description,
  lastUpdated,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          </div>
          {description && (
            <p className="text-lg text-gray-600 mb-4">{description}</p>
          )}
          <p className="text-sm text-gray-500">
            <strong>Last Updated:</strong> {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-8 md:p-12 prose prose-gray max-w-none">
            {children}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6 text-center border border-primary-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Have Questions?
          </h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about our legal policies, please don't hesitate to contact us.
          </p>
          <a
            href="mailto:legal@toolforge.ai"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Contact Legal Team
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
