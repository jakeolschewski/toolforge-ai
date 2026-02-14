// Individual Comparison Page

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Tool } from '@/types';
import ComparisonTable from '@/components/compare/ComparisonTable';
import PricingComparison from '@/components/compare/PricingComparison';
import Link from 'next/link';
import { ExternalLink, Award, ThumbsUp, ThumbsDown } from 'lucide-react';

export const revalidate = 600;

interface ComparisonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: comparison } = await supabase
    .from('comparisons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!comparison) {
    return {
      title: 'Comparison Not Found',
    };
  }

  return {
    title: comparison.seo_title || `${comparison.title} | ToolForge AI`,
    description: comparison.seo_description || comparison.description,
    keywords: (comparison.keywords || []).join(', '),
    openGraph: {
      title: comparison.title,
      description: comparison.description || comparison.seo_description,
      type: 'article',
    },
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { slug } = await params;
  const { data: comparison } = await supabase
    .from('comparisons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!comparison) {
    notFound();
  }

  // Fetch the tools being compared
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .in('id', comparison.tool_ids || []);

  if (!tools || tools.length === 0) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comparisonData = comparison.comparison_data as any;
  const winner = tools.find((t) => t.id === comparison.winner_tool_id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-white/80">
            <Link href="/compare" className="hover:text-white">Comparisons</Link>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {comparison.title}
          </h1>

          {comparison.description && (
            <p className="text-xl text-white/90 max-w-3xl">
              {comparison.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tools Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool: Tool) => {
            const isWinner = tool.id === comparison.winner_tool_id;
            return (
              <div
                key={tool.id}
                className={`relative p-6 rounded-xl border ${
                  isWinner
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 ring-2 ring-yellow-500'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                }`}
              >
                {isWinner && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      <Award className="w-3 h-3" />
                      Our Pick
                    </span>
                  </div>
                )}
                {tool.logo_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={tool.logo_url}
                    alt={tool.name}
                    className="w-16 h-16 object-contain rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {tool.name}
                </h3>
                {tool.tagline && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {tool.tagline}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded">
                    {tool.pricing_model}
                  </span>
                  {tool.starting_price && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      from {tool.starting_price}
                    </span>
                  )}
                </div>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:gap-3 transition-all"
                >
                  View Details
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pricing Comparison */}
        {comparisonData.pricing && comparisonData.pricing.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Pricing Comparison
            </h2>
            <PricingComparison
              tools={tools as Tool[]}
              pricingData={comparisonData.pricing}
            />
          </section>
        )}

        {/* Feature Comparison */}
        {comparisonData.features && comparisonData.features.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Feature Comparison
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <ComparisonTable
                tools={tools as Tool[]}
                features={comparisonData.features}
              />
            </div>
          </section>
        )}

        {/* Pros & Cons */}
        {comparisonData.pros_cons && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Pros & Cons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {Object.entries(comparisonData.pros_cons).map(([toolId, data]: [string, any]) => {
                const tool = tools.find((t) => t.id === toolId);
                if (!tool) return null;

                return (
                  <div
                    key={toolId}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {tool.name}
                    </h3>

                    {/* Pros */}
                    {data.pros && data.pros.length > 0 && (
                      <div className="mb-4">
                        <h4 className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400 mb-2">
                          <ThumbsUp className="w-4 h-4" />
                          Pros
                        </h4>
                        <ul className="space-y-1">
                          {data.pros.map((pro: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 dark:text-gray-400 pl-4"
                            >
                              • {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cons */}
                    {data.cons && data.cons.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400 mb-2">
                          <ThumbsDown className="w-4 h-4" />
                          Cons
                        </h4>
                        <ul className="space-y-1">
                          {data.cons.map((con: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 dark:text-gray-400 pl-4"
                            >
                              • {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Verdict */}
        {comparisonData.verdict && (
          <section className="mb-16">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Verdict</h2>
              <div
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: comparisonData.verdict }}
              />
              {winner && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-white/90 mb-4">We recommend:</p>
                  <Link
                    href={`/tools/${winner.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Award className="w-5 h-5" />
                    {winner.name}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
