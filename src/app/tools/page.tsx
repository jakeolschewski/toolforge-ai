import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolGrid from '@/components/tools/ToolGrid';
import ToolFilters from '@/components/tools/ToolFilters';
import Pagination from '@/components/shared/Pagination';
import { supabase } from '@/lib/supabase';
import type { Tool } from '@/types';

export const revalidate = 1800; // Revalidate every 30 minutes

export const metadata: Metadata = {
  title: 'All AI Tools Directory',
  description: 'Browse our comprehensive directory of AI tools. Filter by category, pricing, and more to find the perfect AI tool for your needs.',
  keywords: ['ai tools directory', 'ai software', 'artificial intelligence tools', 'ai tool comparison'],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAllTools(searchParams: any): Promise<{ tools: Tool[]; total: number }> {
  const page = parseInt(searchParams.page || '1');
  const limit = 24;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('tools')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }

  if (searchParams.pricing) {
    query = query.eq('pricing_model', searchParams.pricing);
  }

  if (searchParams.featured === 'true') {
    query = query.eq('is_featured', true);
  }

  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
  }

  const sortBy = searchParams.sortBy || 'newest';
  switch (sortBy) {
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'popular':
      query = query.order('views', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count } = await query;
  return {
    tools: (data || []) as Tool[],
    total: count || 0,
  };
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ToolsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { tools, total } = await getAllTools(params);

  const page = parseInt(params.page || '1');
  const limit = 24;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All AI Tools
          </h1>
          <p className="text-lg text-gray-600">
            Browse our comprehensive directory of {total}+ AI tools
          </p>
        </div>

        {/* Filters */}
        <ToolFilters totalCount={total} />

        {/* Tools Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          <ToolGrid tools={tools} columns={3} />
        </Suspense>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/tools"
          searchParams={params}
        />
      </main>

      <Footer />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}
