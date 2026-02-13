import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/shared/JsonLd';
import ToolGrid from '@/components/tools/ToolGrid';
import { supabase } from '@/lib/supabase';
import type { Tool } from '@/types';
import { generateOrganizationSchema } from '@/utils/seo';

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedTools(): Promise<Tool[]> {
  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(6);

  return (data || []) as Tool[];
}

async function getLatestTools(): Promise<Tool[]> {
  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(8);

  return (data || []) as Tool[];
}

async function getSiteStats(): Promise<{ toolCount: number }> {
  const { count } = await supabase
    .from('tools')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');

  return { toolCount: count || 0 };
}

export default async function HomePage() {
  const [featuredTools, latestTools, siteStats] = await Promise.all([
    getFeaturedTools(),
    getLatestTools(),
    getSiteStats(),
  ]);

  // Generate Organization schema
  const organizationSchema = generateOrganizationSchema();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <JsonLd data={organizationSchema} />
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover the{' '}
            <span className="gradient-text">Best AI Tools</span>
            <br />
            for Your Needs
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive reviews, honest comparisons, and curated recommendations
            to help you find the perfect AI tools for your workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
            >
              Browse All Tools
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/category/writing"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold text-lg"
            >
              Explore Categories
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{siteStats.toolCount}+</div>
            <div className="text-gray-600">AI Tools Reviewed</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">Daily</div>
            <div className="text-gray-600">New Tools Added</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
            <div className="text-gray-600">Honest Reviews</div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      {featuredTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Tools</h2>
            <Link
              href="/tools?featured=true"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <ToolGrid tools={featuredTools} columns={3} featured />
        </section>
      )}

      {/* Latest Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Tools</h2>
          <Link
            href="/tools"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View All
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <ToolGrid tools={latestTools} columns={4} />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { slug: 'writing', name: 'Writing', icon: '✍️' },
            { slug: 'image', name: 'Images', icon: '🎨' },
            { slug: 'video', name: 'Video', icon: '🎥' },
            { slug: 'code', name: 'Coding', icon: '💻' },
            { slug: 'chat', name: 'Chatbots', icon: '💬' },
            { slug: 'productivity', name: 'Productivity', icon: '⚡' },
            { slug: 'marketing', name: 'Marketing', icon: '📈' },
            { slug: 'design', name: 'Design', icon: '🎨' },
            { slug: 'audio', name: 'Audio', icon: '🎵' },
            { slug: 'research', name: 'Research', icon: '🔬' },
          ].map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 text-center"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-semibold text-gray-900">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Supercharge Your Workflow?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands who've discovered their perfect AI tools
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
