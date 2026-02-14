// Comparison Hub Page - Browse all comparisons

import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import type { Comparison } from '@/types';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Tool Comparisons - Find the Best AI Tool for You | ToolForge AI',
  description: 'Compare AI tools side-by-side. See detailed feature comparisons, pricing, pros & cons to make informed decisions.',
  keywords: 'AI tool comparison, compare AI tools, best AI tools, tool reviews, feature comparison',
};

export const revalidate = 600;

export default async function CompareHubPage() {
  // Fetch popular comparisons (most viewed)
  const { data: popularComparisons } = await supabase
    .from('comparisons')
    .select('*')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(6);

  // Fetch recent comparisons
  const { data: recentComparisons } = await supabase
    .from('comparisons')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            AI Tool Comparisons
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Make informed decisions with our detailed side-by-side comparisons of AI tools
          </p>
        </div>
      </div>

      {/* Popular Comparisons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Popular Comparisons
          </h2>
        </div>

        {popularComparisons && popularComparisons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularComparisons.map((comparison: Comparison) => (
              <Link
                key={comparison.id}
                href={`/compare/${comparison.slug}`}
                className="group block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {comparison.title}
                </h3>
                {comparison.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {comparison.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {(comparison.views ?? 0).toLocaleString()} views
                  </span>
                  <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">
            No comparisons available yet.
          </p>
        )}
      </section>

      {/* Recent Comparisons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recent Comparisons
          </h2>
        </div>

        {recentComparisons && recentComparisons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentComparisons.map((comparison: Comparison) => (
              <Link
                key={comparison.id}
                href={`/compare/${comparison.slug}`}
                className="group block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {comparison.title}
                </h3>
                {comparison.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {comparison.description}
                  </p>
                )}
                <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">
            No comparisons available yet.
          </p>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our complete directory of AI tools to find the perfect solution for your needs
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
