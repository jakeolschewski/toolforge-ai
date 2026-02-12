// Individual Collection Page

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Collection, Tool } from '@/types';
import Link from 'next/link';
import ToolCard from '@/components/tools/ToolCard';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const revalidate = 600;

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: collection.seo_title || `${collection.name} - AI Tools | ToolForge AI`,
    description: collection.seo_description || collection.description,
    keywords: collection.keywords.join(', '),
    openGraph: {
      title: collection.name,
      description: collection.description || collection.seo_description,
      type: 'website',
      images: collection.featured_image ? [{ url: collection.featured_image }] : undefined,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!collection) {
    notFound();
  }

  // Fetch the tools in this collection
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .in('id', collection.tool_ids)
    .eq('status', 'published');

  if (!tools || tools.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero Section */}
      <div
        className="py-20 relative overflow-hidden"
        style={{
          background: collection.color
            ? `linear-gradient(135deg, ${collection.color} 0%, ${collection.color}cc 100%)`
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Link */}
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </Link>

          {/* Icon */}
          {collection.icon && (
            <div className="text-6xl mb-6">{collection.icon}</div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {collection.name}
          </h1>

          {/* Description */}
          {collection.description && (
            <p className="text-xl text-white/90 max-w-3xl mb-6">
              {collection.description}
            </p>
          )}

          {/* Tool Count */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">{tools.length} curated tools</span>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool: Tool, index: number) => (
            <div key={tool.id} className="relative">
              {/* Tool Number Badge */}
              <div className="absolute -top-3 -left-3 z-10">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  style={{
                    background: collection.color || '#6366f1',
                  }}
                >
                  {index + 1}
                </div>
              </div>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover More Collections
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Explore other curated collections to find the perfect AI tools for your needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/collections"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Collections
            </Link>
            <Link
              href="/tools"
              className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Schema.org Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: collection.name,
            description: collection.description,
            numberOfItems: tools.length,
            itemListElement: tools.map((tool: Tool, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'SoftwareApplication',
                name: tool.name,
                description: tool.description,
                applicationCategory: tool.category,
                offers: {
                  '@type': 'Offer',
                  price: tool.starting_price || '0',
                  priceCurrency: 'USD',
                },
              },
            })),
          }),
        }}
      />
    </div>
  );
}
