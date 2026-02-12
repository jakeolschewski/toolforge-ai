'use client';

// Admin Collections Management Page

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Sparkles } from 'lucide-react';
import type { Collection } from '@/types';
import toast from 'react-hot-toast';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collections?limit=100');
      const data = await response.json();

      if (data.success) {
        setCollections(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      const response = await fetch(`/api/collections/${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Collection deleted successfully');
        fetchCollections();
      } else {
        toast.error(data.error || 'Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Curated Collections
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage tool collections and curated lists
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Collection
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Collections</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {collections.length}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {collections.filter((c) => c.status === 'published').length}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
          <div className="text-2xl font-bold text-indigo-600">
            {collections.reduce((sum, c) => sum + (c.views || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : collections.length === 0 ? (
          <div className="col-span-full p-12 text-center text-gray-500 dark:text-gray-400">
            No collections found
          </div>
        ) : (
          collections.map((collection) => (
            <div
              key={collection.id}
              className="relative p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
            >
              {/* Icon */}
              {collection.icon && (
                <div className="text-4xl mb-3">{collection.icon}</div>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {collection.name}
              </h3>

              {/* Description */}
              {collection.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {collection.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {collection.tool_ids.length} tools
                </span>
                <span>•</span>
                <span>{collection.views.toLocaleString()} views</span>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    collection.status === 'published'
                      ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30'
                      : 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30'
                  }`}
                >
                  {collection.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/collections/${collection.slug}`}
                  target="_blank"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <Link
                  href={`/admin/collections/${collection.slug}/edit`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(collection.slug)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
