// Collections Hub Page - Browse all curated collections

import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import type { Collection } from '@/types';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated AI Tool Collections | ToolForge AI',
  description: 'Discover hand-picked collections of the best AI tools for every use case. From productivity to creative work, find your perfect toolkit.',
  keywords: 'AI tool collections, best AI tools, curated AI tools, AI toolkits, productivity tools',
};

export const revalidate = 600;

export default async function CollectionsPage() {
  // Fetch all published collections
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .eq('status', 'published')
    .order('order_index', { ascending: true })
    .order('views', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Curated Collections
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Discover hand-picked collections of the best AI tools for every use case
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {collections && collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection: Collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group block"
              >
                <div
                  className="relative h-full p-8 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl"
                  style={{
                    background: collection.color
                      ? `linear-gradient(135deg, ${collection.color}15 0%, ${collection.color}05 100%)`
                      : 'linear-gradient(135deg, #818cf815 0%, #818cf805 100%)',
                    borderColor: collection.color || '#818cf8',
                    borderWidth: '2px',
                  }}
                >
                  {/* Icon */}
                  {collection.icon && (
                    <div className="text-5xl mb-4">{collection.icon}</div>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {collection.name}
                  </h3>

                  {/* Description */}
                  {collection.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                      {collection.description}
                    </p>
                  )}

                  {/* Tool Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {collection.tool_ids.length} tools
                    </span>
                    <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Views */}
                  {collection.views > 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded">
                        {collection.views.toLocaleString()} views
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No collections available yet.
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Explore All AI Tools
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our complete directory to discover thousands of AI tools across all categories
          </p>
          <Link
            href="/tools"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse All Tools
          </Link>
        </div>
      </section>
    </div>
  );
}
