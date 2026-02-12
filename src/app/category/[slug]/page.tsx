import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/shared/JsonLd';
import ToolGrid from '@/components/tools/ToolGrid';
import { supabase } from '@/lib/supabase';
import type { Tool, Category } from '@/types';
import {
  generateCategoryMetadata,
  generateItemListSchema,
  generateBreadcrumbSchema,
} from '@/utils/seo';

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const categoryData: Record<string, { name: string; description: string; icon: string }> = {
  writing: {
    name: 'Writing Tools',
    description: 'AI-powered writing assistants, content generators, and copywriting tools to enhance your writing workflow.',
    icon: '✍️',
  },
  image: {
    name: 'Image Generation',
    description: 'Create stunning images, artwork, and graphics with AI-powered image generation and editing tools.',
    icon: '🎨',
  },
  video: {
    name: 'Video Tools',
    description: 'AI video editing, generation, and enhancement tools for creators and businesses.',
    icon: '🎥',
  },
  code: {
    name: 'Coding Tools',
    description: 'AI-powered code completion, debugging, and development tools for programmers.',
    icon: '💻',
  },
  chat: {
    name: 'Chatbots',
    description: 'Conversational AI, chatbots, and virtual assistants for customer support and engagement.',
    icon: '💬',
  },
  productivity: {
    name: 'Productivity',
    description: 'Boost your productivity with AI-powered task management, note-taking, and workflow tools.',
    icon: '⚡',
  },
  marketing: {
    name: 'Marketing Tools',
    description: 'AI-driven marketing, SEO, and social media tools to grow your business.',
    icon: '📈',
  },
  design: {
    name: 'Design Tools',
    description: 'AI-powered design tools for creating logos, graphics, and UI/UX designs.',
    icon: '🎨',
  },
  audio: {
    name: 'Audio Tools',
    description: 'AI audio generation, voice synthesis, and music creation tools.',
    icon: '🎵',
  },
  research: {
    name: 'Research Tools',
    description: 'AI-powered research assistants, data analysis, and knowledge management tools.',
    icon: '🔬',
  },
};

async function getToolsByCategory(slug: string): Promise<Tool[]> {
  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .eq('category', slug)
    .order('rating', { ascending: false })
    .limit(50);

  return (data || []) as Tool[];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryData[slug];

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const tools = await getToolsByCategory(slug);

  return generateCategoryMetadata(
    {
      id: slug,
      slug,
      name: category.name,
      description: category.description,
      icon: category.icon,
      order: 0,
      tool_count: tools.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    tools.length
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categoryData[slug];

  if (!category) {
    notFound();
  }

  const tools = await getToolsByCategory(slug);

  // Generate structured data
  const categoryObj: Category = {
    id: slug,
    slug,
    name: category.name,
    description: category.description,
    icon: category.icon,
    order: 0,
    tool_count: tools.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const itemListSchema = generateItemListSchema(
    tools,
    categoryObj,
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai'}/category/${slug}`
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai' },
    { name: 'Tools', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai'}/tools` },
    { name: category.name, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai'}/category/${slug}` },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={[itemListSchema, breadcrumbSchema]} />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link
          href="/tools"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Tools
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              <p className="text-lg text-gray-600">
                {tools.length} tools available
              </p>
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl">
            {category.description}
          </p>
        </div>

        {/* Tools Grid */}
        <ToolGrid tools={tools} columns={3} />

        {/* Empty State */}
        {tools.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg mb-2">No tools found in this category yet.</p>
            <p className="text-gray-500 text-sm">Check back soon for new additions!</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Looking for something specific?
          </h2>
          <p className="text-xl text-primary-100 mb-6">
            Browse all categories or search our complete directory
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Browse All Tools
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-semibold text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Related Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(categoryData)
              .filter(([key]) => key !== slug)
              .slice(0, 5)
              .map(([key, cat]) => (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 text-center"
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <div className="font-semibold text-gray-900 text-sm">{cat.name}</div>
                </Link>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generate static paths for all categories
export async function generateStaticParams() {
  return Object.keys(categoryData).map((slug) => ({
    slug,
  }));
}
