import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DownloadButton from '@/components/vault/DownloadButton';
import AccessBadge, { PricingTypeBadge } from '@/components/vault/AccessBadge';
import WorkflowCard from '@/components/vault/WorkflowCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/vault/constants';
import type { VaultWorkflow } from '@/types';
import {
  Star,
  Download,
  Heart,
  Clock,
  BarChart,
  CheckCircle,
  Lightbulb,
  Package,
  User,
  Calendar,
  Share2
} from 'lucide-react';

export const revalidate = 3600;

async function getWorkflow(slug: string): Promise<VaultWorkflow | null> {
  const { data } = await supabase
    .from('vault_workflows')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return data as VaultWorkflow | null;
}

async function getRelatedWorkflows(workflow: VaultWorkflow): Promise<VaultWorkflow[]> {
  const { data } = await supabase
    .from('vault_workflows')
    .select('*')
    .eq('status', 'published')
    .eq('category_id', workflow.category_id)
    .neq('id', workflow.id)
    .limit(3);

  return (data || []) as VaultWorkflow[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const workflow = await getWorkflow(slug);

  if (!workflow) {
    return {
      title: 'Workflow Not Found',
    };
  }

  return {
    title: workflow.seo_title || `${workflow.title} - Workflow Vault`,
    description: workflow.seo_description || workflow.description,
    keywords: workflow.keywords || workflow.seo_keywords || [],
    openGraph: {
      title: workflow.title,
      description: workflow.description,
      images: workflow.thumbnail_url ? [workflow.thumbnail_url] : undefined,
      type: 'article',
    },
  };
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const workflow = await getWorkflow(slug);

  if (!workflow) {
    notFound();
  }

  const relatedWorkflows = await getRelatedWorkflows(workflow);

  // Mock user access - in production, check actual user authentication and purchases
  const pricingType = workflow.pricing_type || (workflow.is_free ? 'free' : 'premium');
  const hasAccess = pricingType === 'free';
  const isPremium = pricingType === 'members_only';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {workflow.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6">
                    {workflow.description}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3 flex-wrap mb-6">
                <PricingTypeBadge type={pricingType as any} price={workflow.price} />
                {workflow.difficulty_level && (
                  <Badge variant={
                    workflow.difficulty_level === 'beginner' ? 'success' :
                    workflow.difficulty_level === 'intermediate' ? 'warning' : 'danger'
                  } size="md">
                    {workflow.difficulty_level}
                  </Badge>
                )}
                {workflow.category_name && (
                  <Badge variant="outline" size="md">{workflow.category_name}</Badge>
                )}
                {workflow.is_featured && (
                  <Badge variant="primary" size="md">Featured</Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Download className="w-5 h-5" />
                  <div>
                    <div className="text-sm text-gray-500">Downloads</div>
                    <div className="font-semibold text-gray-900">{(workflow.downloads || 0).toLocaleString()}</div>
                  </div>
                </div>
                {workflow.rating && workflow.rating > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <div>
                      <div className="text-sm text-gray-500">Rating</div>
                      <div className="font-semibold text-gray-900">
                        {workflow.rating.toFixed(1)} ({workflow.review_count || 0})
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-5 h-5" />
                  <div>
                    <div className="text-sm text-gray-500">Favorites</div>
                    <div className="font-semibold text-gray-900">{(workflow.favorites || 0).toLocaleString()}</div>
                  </div>
                </div>
                {workflow.estimated_time && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <div>
                      <div className="text-sm text-gray-500">Setup Time</div>
                      <div className="font-semibold text-gray-900">{workflow.estimated_time}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {workflow.long_description && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Workflow</h2>
                  <div className="prose max-w-none text-gray-600">
                    {workflow.long_description}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            {workflow.features && workflow.features.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-primary-600" />
                  Key Features
                </h2>
                <ul className="space-y-3">
                  {workflow.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Use Cases */}
            {workflow.use_cases && workflow.use_cases.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-primary-600" />
                  Use Cases
                </h2>
                <ul className="space-y-3">
                  {workflow.use_cases.map((useCase, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {workflow.requirements && workflow.requirements.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary-600" />
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {workflow.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Preview Image */}
              {workflow.thumbnail_url && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <img
                    src={workflow.thumbnail_url}
                    alt={workflow.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Download Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center mb-6">
                  {pricingType === 'free' ? (
                    <div>
                      <div className="text-4xl font-bold text-green-600 mb-2">Free</div>
                      <p className="text-gray-600">No payment required</p>
                    </div>
                  ) : pricingType === 'members_only' ? (
                    <div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">Members Only</div>
                      <p className="text-gray-600">Requires active membership</p>
                    </div>
                  ) : workflow.price ? (
                    <div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {formatPrice(workflow.price)}
                      </div>
                      <p className="text-gray-600">One-time purchase</p>
                    </div>
                  ) : null}
                </div>

                <DownloadButton
                  workflowId={workflow.id}
                  workflowSlug={workflow.slug}
                  workflowTitle={workflow.title}
                  hasAccess={hasAccess}
                  isPremium={isPremium}
                  fileUrl={workflow.file_url}
                  price={workflow.price}
                  className="w-full mb-4"
                />

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4" />
                  Add to Favorites
                </button>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mt-2">
                  <Share2 className="w-4 h-4" />
                  Share Workflow
                </button>
              </div>

              {/* Author Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Workflow Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Created by <span className="font-medium text-gray-900">{workflow.author}</span></span>
                  </div>
                  {workflow.version && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <BarChart className="w-4 h-4" />
                      <span>Version {workflow.version}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {new Date(workflow.updated_at).toLocaleDateString()}</span>
                  </div>
                  {workflow.file_size && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>Size: {(workflow.file_size / 1024).toFixed(1)} KB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {workflow.tags.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {workflow.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Workflows */}
        {relatedWorkflows.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Workflows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedWorkflows.map((related) => (
                <WorkflowCard key={related.id} workflow={related} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
