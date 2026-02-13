import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WorkflowCard from '@/components/vault/WorkflowCard';
import { supabase } from '@/lib/supabase';
import type { VaultWorkflow } from '@/types';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Favorites - Workflow Vault',
  description: 'Your favorited workflows for quick access.',
};

// In production, get this from auth session
const MOCK_USER_ID = 'mock-user-id';

async function getFavoriteWorkflows(userId: string): Promise<VaultWorkflow[]> {
  // Get user's favorites
  const { data: favorites } = await supabase
    .from('vault_favorites')
    .select('workflow_id')
    .eq('user_id', userId);

  if (!favorites || favorites.length === 0) {
    return [];
  }

  const workflowIds = favorites.map(f => f.workflow_id);

  // Get the actual workflows
  const { data: workflows } = await supabase
    .from('vault_workflows')
    .select('*')
    .in('id', workflowIds)
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  return (workflows || []) as VaultWorkflow[];
}

export default async function FavoritesPage() {
  const userId = MOCK_USER_ID; // Replace with actual auth
  const favoriteWorkflows = await getFavoriteWorkflows(userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Vault
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Heart className="w-10 h-10 text-red-500 fill-current" />
            Favorite Workflows
          </h1>
          <p className="text-lg text-gray-600">
            Quick access to your most-loved workflows
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {favoriteWorkflows.length}
              </div>
              <p className="text-gray-600">Favorited Workflows</p>
            </div>
            <Heart className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>

        {/* Workflows Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          {favoriteWorkflows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  isFavorited={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start favoriting workflows to quickly access them later. Just click the heart icon on any workflow.
              </p>
              <Link
                href="/vault"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Workflows
              </Link>
            </div>
          )}
        </Suspense>

        {/* Tips */}
        {favoriteWorkflows.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Pro Tips for Favorites
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Organize your favorites by using them as a quick reference library</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Remove workflows you no longer need by clicking the heart icon again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Share your favorite workflows with team members</span>
              </li>
            </ul>
          </div>
        )}
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
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
