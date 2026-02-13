import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WorkflowCard from '@/components/vault/WorkflowCard';
import WorkflowFilters from '@/components/vault/WorkflowFilters';
import Pagination from '@/components/shared/Pagination';
import { supabase } from '@/lib/supabase';
import type { VaultWorkflow, VaultCategory } from '@/types';
import { Sparkles, Layers, Shield } from 'lucide-react';

export const revalidate = 1800; // Revalidate every 30 minutes

export const metadata: Metadata = {
  title: 'Workflow Vault - Premium AI Workflows',
  description: 'Browse our comprehensive library of premium AI workflows. Download ready-to-use workflows for Claude, ChatGPT, and more.',
  keywords: ['ai workflows', 'claude workflows', 'chatgpt workflows', 'automation', 'ai templates'],
};

async function getWorkflows(searchParams: any): Promise<{ workflows: VaultWorkflow[]; total: number }> {
  const page = parseInt(searchParams.page || '1');
  const limit = 24;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('vault_workflows')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category);
  }

  if (searchParams.pricing) {
    query = query.eq('pricing_tier', searchParams.pricing);
  }

  if (searchParams.difficulty) {
    query = query.eq('difficulty_level', searchParams.difficulty);
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
  }

  const sortBy = searchParams.sortBy || 'newest';
  switch (sortBy) {
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'popular':
      query = query.order('favorite_count', { ascending: false });
      break;
    case 'downloads':
      query = query.order('download_count', { ascending: false });
      break;
    case 'name':
      query = query.order('title', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count } = await query;
  return {
    workflows: (data || []) as VaultWorkflow[],
    total: count || 0,
  };
}

async function getCategories(): Promise<VaultCategory[]> {
  const { data } = await supabase
    .from('vault_categories')
    .select('*')
    .order('order_index', { ascending: true });

  return (data || []) as VaultCategory[];
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function VaultPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [{ workflows, total }, categories] = await Promise.all([
    getWorkflows(params),
    getCategories(),
  ]);

  const page = parseInt(params.page || '1');
  const limit = 24;
  const totalPages = Math.ceil(total / limit);

  const categoriesWithCount = categories.map(cat => ({
    slug: cat.id,
    name: cat.name,
    count: cat.workflow_count,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Workflow Vault
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-slide-up">
              Professional AI workflows ready to download and use. Save hours of work with our curated collection.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Sparkles className="w-8 h-8 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{total}+</div>
                <div className="text-primary-100">Premium Workflows</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Layers className="w-8 h-8 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">9</div>
                <div className="text-primary-100">System Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Shield className="w-8 h-8 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">Privacy-First</div>
                <div className="text-primary-100">W.E.D.G.E. Framework</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <WorkflowFilters totalCount={total} categories={categoriesWithCount} />

        {/* Workflows Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          {workflows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {workflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  featured={workflow.is_featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No workflows found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/vault"
            searchParams={params}
          />
        )}

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want unlimited access to all workflows?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our membership program and get instant access to our entire workflow library, plus new workflows every week.
          </p>
          <a
            href="/membership/pricing"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            View Membership Plans
            <Sparkles className="w-5 h-5" />
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
