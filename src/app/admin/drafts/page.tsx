'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import DraftsList from '@/components/admin/DraftsList';
import Button from '@/components/ui/Button';
import type { ScrapedSource } from '@/types';

export default function AdminDraftsPage() {
  const [drafts, setDrafts] = useState<ScrapedSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    processed: 0,
    ignored: 0,
  });

  const loadDrafts = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/approve', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load drafts');
      }

      const data = await response.json();

      if (data.success) {
        setDrafts(data.data.pending || []);
        setStats({
          pending: data.data.count || 0,
          processed: 0,
          ignored: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Drafts</h1>
          <p className="text-gray-600 mt-2">Review and approve scraped AI tools</p>
        </div>

        <Button onClick={loadDrafts} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Processed Today</div>
          <div className="text-3xl font-bold text-green-600">{stats.processed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Ignored Today</div>
          <div className="text-3xl font-bold text-red-600">{stats.ignored}</div>
        </div>
      </div>

      {/* Drafts List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="text-gray-600 mt-4">Loading pending drafts...</p>
        </div>
      ) : (
        <DraftsList initialDrafts={drafts} onUpdate={loadDrafts} />
      )}
    </div>
  );
}
