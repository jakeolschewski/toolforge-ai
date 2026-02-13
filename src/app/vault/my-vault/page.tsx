import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WorkflowCard from '@/components/vault/WorkflowCard';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import type { VaultWorkflow, VaultPurchase } from '@/types';
import { Package, Download, Heart, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Vault - Purchased Workflows',
  description: 'Access all your purchased workflows and downloads.',
};

async function getUserWorkflows(userId: string): Promise<VaultWorkflow[]> {
  // Get user's purchases
  const { data: purchases } = await supabase
    .from('vault_purchases')
    .select('workflow_id')
    .eq('user_id', userId)
    .eq('access_granted', true);

  if (!purchases || purchases.length === 0) {
    return [];
  }

  const workflowIds = purchases.map(p => p.workflow_id);

  // Get the actual workflows
  const { data: workflows } = await supabase
    .from('vault_workflows')
    .select('*')
    .in('id', workflowIds)
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  return (workflows || []) as VaultWorkflow[];
}

async function getMembershipWorkflows(userId: string): Promise<VaultWorkflow[]> {
  // Check if user has active membership
  const { data: membership } = await supabase
    .from('vault_memberships')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!membership) {
    return [];
  }

  // Get all member-only workflows
  const { data: workflows } = await supabase
    .from('vault_workflows')
    .select('*')
    .eq('pricing_type', 'members_only')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (workflows || []) as VaultWorkflow[];
}

export default async function MyVaultPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/vault/my-vault');
  }

  const userId = session.user.id;

  const [purchasedWorkflows, membershipWorkflows] = await Promise.all([
    getUserWorkflows(userId),
    getMembershipWorkflows(userId),
  ]);

  const allWorkflows = [...purchasedWorkflows, ...membershipWorkflows];
  const hasMembership = membershipWorkflows.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Vault</h1>
          <p className="text-lg text-gray-600">
            Access and download all your workflows
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-primary-600" />
              <span className="text-3xl font-bold text-gray-900">
                {allWorkflows.length}
              </span>
            </div>
            <p className="text-gray-600">Total Workflows</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Download className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                {purchasedWorkflows.length}
              </span>
            </div>
            <p className="text-gray-600">Purchased</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">
                {membershipWorkflows.length}
              </span>
            </div>
            <p className="text-gray-600">Via Membership</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/vault/my-vault/downloads"
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
              <span className="font-medium text-gray-900 group-hover:text-primary-600">
                Download History
              </span>
            </div>
          </Link>

          <Link
            href="/vault/favorites"
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
              <span className="font-medium text-gray-900 group-hover:text-primary-600">
                Favorites
              </span>
            </div>
          </Link>

          <Link
            href="/membership/pricing"
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
              <span className="font-medium text-gray-900 group-hover:text-primary-600">
                {hasMembership ? 'Manage Membership' : 'Upgrade to Membership'}
              </span>
            </div>
          </Link>
        </div>

        {/* Workflows Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          {allWorkflows.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Workflows</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allWorkflows.map((workflow) => (
                  <WorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    isPurchased={true}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No workflows yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't purchased any workflows yet. Browse our vault to find workflows that fit your needs.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/vault"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Browse Workflows
                </Link>
                <Link
                  href="/membership/pricing"
                  className="inline-flex items-center gap-2 bg-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  View Membership
                </Link>
              </div>
            </div>
          )}
        </Suspense>
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
