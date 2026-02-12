'use client';

// Admin Comparisons Management Page

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, TrendingUp } from 'lucide-react';
import type { Comparison } from '@/types';
import toast from 'react-hot-toast';

export default function AdminComparisonsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisons();
  }, []);

  const fetchComparisons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/compare?limit=100');
      const data = await response.json();

      if (data.success) {
        setComparisons(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching comparisons:', error);
      toast.error('Failed to load comparisons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this comparison?')) return;

    try {
      const response = await fetch(`/api/compare/${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Comparison deleted successfully');
        fetchComparisons();
      } else {
        toast.error(data.error || 'Failed to delete comparison');
      }
    } catch (error) {
      console.error('Error deleting comparison:', error);
      toast.error('Failed to delete comparison');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tool Comparisons
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage side-by-side tool comparisons
          </p>
        </div>
        <Link
          href="/admin/comparisons/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Comparison
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Comparisons</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {comparisons.length}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {comparisons.filter((c) => c.status === 'published').length}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
          <div className="text-2xl font-bold text-indigo-600">
            {comparisons.reduce((sum, c) => sum + (c.views || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Comparisons List */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comparisons.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No comparisons found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {comparisons.map((comparison) => (
              <div key={comparison.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {comparison.title}
                    </h3>
                    {comparison.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {comparison.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{comparison.tool_ids.length} tools</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {comparison.views.toLocaleString()} views
                      </span>
                      <span>•</span>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          comparison.status === 'published'
                            ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30'
                            : 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30'
                        }`}
                      >
                        {comparison.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/compare/${comparison.slug}`}
                      target="_blank"
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/comparisons/${comparison.slug}/edit`}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(comparison.slug)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
