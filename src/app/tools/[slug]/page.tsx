import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Star, ExternalLink, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/shared/JsonLd';
import ShareButtons from '@/components/shared/ShareButtons';
import { supabase } from '@/lib/supabase';
import type { Tool, Review } from '@/types';
import { formatDate } from '@/utils/helpers';
import {
  generateToolMetadata,
  generateProductSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
  generateCanonicalUrl,
} from '@/utils/seo';

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getToolBySlug(slug: string): Promise<{ tool: Tool; reviews: Review[] } | null> {
  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!tool) return null;

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('tool_id', tool.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return {
    tool: tool as Tool,
    reviews: (reviews || []) as Review[],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getToolBySlug(slug);

  if (!data) {
    return {
      title: 'Tool Not Found',
    };
  }

  const { tool, reviews } = data;
  return generateToolMetadata(tool, reviews[0]);
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getToolBySlug(slug);

  if (!data) {
    notFound();
  }

  const { tool, reviews } = data;
  const mainReview = reviews[0];

  // Generate structured data
  const productSchema = generateProductSchema(tool);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai' },
    { name: 'Tools', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai'}/tools` },
    { name: tool.category, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai'}/category/${tool.category.toLowerCase()}` },
    { name: tool.name, url: generateCanonicalUrl(`/tools/${tool.slug}`) },
  ]);

  const schemas = [productSchema, breadcrumbSchema];
  if (mainReview) {
    schemas.push(generateReviewSchema(tool, mainReview));
  }

  const pageUrl = generateCanonicalUrl(`/tools/${tool.slug}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={schemas} />
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link
          href="/tools"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Link>

        {/* Tool Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{tool.name}</h1>
                {tool.is_featured && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              {tool.tagline && (
                <p className="text-xl text-gray-700 mb-4">{tool.tagline}</p>
              )}

              <div className="flex items-center gap-4 mb-6">
                {tool.rating > 0 && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-semibold text-lg">{tool.rating.toFixed(1)}</span>
                    <span className="text-gray-600 ml-1">/ 5.0</span>
                  </div>
                )}

                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {tool.category}
                </span>

                <span className="text-gray-600">
                  {tool.views} views
                </span>
              </div>

              <p className="text-gray-700 mb-6">{tool.description}</p>

              {/* Share Buttons */}
              <div className="mb-6">
                <ShareButtons
                  url={pageUrl}
                  title={`${tool.name} - ${tool.tagline || 'AI Tool'}`}
                  description={tool.description}
                />
              </div>

              {/* CTA Button */}
              <a
                href={tool.affiliate_link || tool.website_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
                onClick={() => {
                  // Track click
                  fetch('/api/track/click', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ toolId: tool.id }),
                  });
                }}
              >
                Visit {tool.name}
                <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-lg mb-2">Pricing</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {tool.pricing_model === 'free' && 'Free'}
                {tool.pricing_model === 'freemium' && 'Free + Premium'}
                {tool.pricing_model === 'paid' && 'Paid'}
                {tool.pricing_model === 'subscription' && 'Subscription'}
              </span>
              {tool.starting_price && (
                <span className="text-gray-600">starting at {tool.starting_price}</span>
              )}
            </div>
          </div>

          {/* Features */}
          {tool.features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Review */}
        {mainReview && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{mainReview.title}</h2>

            <div className="text-gray-600 text-sm mb-6">
              By {mainReview.author} • {formatDate(mainReview.published_at || mainReview.created_at)} • {mainReview.read_time} min read
            </div>

            <div className="prose prose-slate max-w-none mb-8">
              {/* Content */}
              <div dangerouslySetInnerHTML={{ __html: mainReview.content.replace(/\n/g, '<br/>') }} />
            </div>

            {/* Pros & Cons */}
            {(mainReview.pros_html || mainReview.cons_html) && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {mainReview.pros_html && (
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg text-green-900 mb-3">Pros</h3>
                    <div dangerouslySetInnerHTML={{ __html: mainReview.pros_html }} />
                  </div>
                )}

                {mainReview.cons_html && (
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg text-red-900 mb-3">Cons</h3>
                    <div dangerouslySetInnerHTML={{ __html: mainReview.cons_html }} />
                  </div>
                )}
              </div>
            )}

            {/* Verdict */}
            {mainReview.verdict && (
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-primary-900 mb-3">Our Verdict</h3>
                <p className="text-gray-700">{mainReview.verdict}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to try {tool.name}?
          </h3>
          <a
            href={tool.affiliate_link || tool.website_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Get Started Now
            <ExternalLink className="ml-2 w-5 h-5" />
          </a>
          <p className="text-primary-100 text-sm mt-4">
            We may earn a commission if you purchase through our link
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
