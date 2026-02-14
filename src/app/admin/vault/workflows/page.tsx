'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, Search, Plus, Loader2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { VaultWorkflow } from '@/types';
import { formatPrice } from '@/lib/vault/constants';

export default function VaultWorkflowsPage() {
  const [workflows, setWorkflows] = useState<VaultWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pricingFilter, setPricingFilter] = useState<string>('all');

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/vault/workflows', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load workflows');
      }

      const data = await response.json();
      if (data.success) {
        setWorkflows(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/vault/workflows/${workflowId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Workflow deleted successfully');
        setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
      } else {
        toast.error(data.error || 'Failed to delete workflow');
      }
    } catch (error) {
      toast.error('Failed to delete workflow');
      console.error(error);
    }
  };

  const handleDuplicate = async (workflow: VaultWorkflow) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/vault/workflows', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...workflow,
          id: undefined,
          slug: `${workflow.slug}-copy`,
          title: `${workflow.title} (Copy)`,
          status: 'draft',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Workflow duplicated successfully');
        loadWorkflows();
      } else {
        toast.error(data.error || 'Failed to duplicate workflow');
      }
    } catch (error) {
      toast.error('Failed to duplicate workflow');
      console.error(error);
    }
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || workflow.status === statusFilter;

    const matchesPricing =
      pricingFilter === 'all' || workflow.pricing_type === pricingFilter;

    return matchesSearch && matchesStatus && matchesPricing;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-2">Manage your workflow library</p>
        </div>
        <Link href="/admin/vault/workflows/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workflows..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={pricingFilter}
              onChange={(e) => setPricingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Pricing</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="members_only">Members Only</option>
            </select>

            <Button onClick={loadWorkflows} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Workflows</div>
          <div className="text-3xl font-bold text-gray-900">{workflows.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Published</div>
          <div className="text-3xl font-bold text-green-600">
            {workflows.filter((w) => w.status === 'published').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Drafts</div>
          <div className="text-3xl font-bold text-yellow-600">
            {workflows.filter((w) => w.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Downloads</div>
          <div className="text-3xl font-bold text-blue-600">
            {workflows.reduce((sum, w) => sum + (w.downloads || 0), 0)}
          </div>
        </div>
      </div>

      {/* Workflows List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="text-gray-600 mt-4">Loading workflows...</p>
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No workflows found</p>
            <Link href="/admin/vault/workflows/new">
              <Button className="mt-4">Create Your First Workflow</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} hover>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {workflow.thumbnail_url && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={workflow.thumbnail_url}
                        alt={workflow.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {workflow.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            workflow.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : workflow.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {workflow.status}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            workflow.pricing_type === 'free'
                              ? 'bg-blue-100 text-blue-700'
                              : workflow.pricing_type === 'premium'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {workflow.pricing_type === 'members_only' ? 'Members Only' : workflow.pricing_type}
                        </span>
                        {workflow.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {workflow.description}
                      </p>

                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Downloads: {workflow.downloads}</span>
                        <span>Favorites: {workflow.favorites}</span>
                        {workflow.price && (
                          <span className="font-semibold text-green-600">
                            {formatPrice(workflow.price)}
                          </span>
                        )}
                        {workflow.rating && (
                          <span>Rating: {workflow.rating.toFixed(1)}/5</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/vault/${workflow.slug}`, '_blank')}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(workflow)}
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>

                    <Link href={`/admin/vault/workflows/${workflow.id}/edit`}>
                      <Button size="sm" variant="outline" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(workflow.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
