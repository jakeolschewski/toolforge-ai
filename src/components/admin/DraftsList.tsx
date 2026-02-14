'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { ScrapedSource } from '@/types';

interface DraftsListProps {
  initialDrafts: ScrapedSource[];
  onUpdate: () => void;
}

export default function DraftsList({ initialDrafts, onUpdate }: DraftsListProps) {
  const [drafts, setDrafts] = useState<ScrapedSource[]>(initialDrafts);
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());

  const handleApprove = async (sourceId: string, autoGenerate: boolean = true) => {
    setLoading(sourceId);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sourceId, autoGenerate }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Tool approved and published!');
        setDrafts((prev) => prev.filter((d) => d.id !== sourceId));
        onUpdate();
      } else {
        toast.error(data.error || 'Failed to approve');
      }
    } catch (error) {
      toast.error('Failed to approve tool');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleIgnore = async (sourceId: string) => {
    setLoading(sourceId);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/approve?id=${sourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Source ignored');
        setDrafts((prev) => prev.filter((d) => d.id !== sourceId));
        onUpdate();
      } else {
        toast.error('Failed to ignore source');
      }
    } catch (error) {
      toast.error('Failed to ignore source');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedDrafts.size === 0) {
      toast.error('No drafts selected');
      return;
    }

    setLoading('bulk');

    const token = sessionStorage.getItem('admin_token');
    const promises = Array.from(selectedDrafts).map((id) =>
      fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sourceId: id, autoGenerate: true }),
      })
    );

    try {
      const results = await Promise.allSettled(promises);
      const successCount = results.filter((r) => r.status === 'fulfilled').length;

      toast.success(`Approved ${successCount} of ${selectedDrafts.size} drafts`);
      setDrafts((prev) => prev.filter((d) => !selectedDrafts.has(d.id)));
      setSelectedDrafts(new Set());
      onUpdate();
    } catch (error) {
      toast.error('Failed to approve drafts');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedDrafts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedDrafts.size === drafts.length) {
      setSelectedDrafts(new Set());
    } else {
      setSelectedDrafts(new Set(drafts.map((d) => d.id)));
    }
  };

  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">No pending drafts to review</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedDrafts.size > 0 && (
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-primary-900">
                {selectedDrafts.size} draft{selectedDrafts.size > 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={loading === 'bulk'}
                >
                  {loading === 'bulk' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Approve All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedDrafts(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Select All */}
      <div className="flex items-center gap-2 px-2">
        <input
          type="checkbox"
          checked={selectedDrafts.size === drafts.length}
          onChange={toggleSelectAll}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label className="text-sm text-gray-600">Select all</label>
      </div>

      {/* Drafts List */}
      {drafts.map((draft) => (
        <Card key={draft.id} hover>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedDrafts.has(draft.id)}
                onChange={() => toggleSelect(draft.id)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {draft.tool_name}
                </h3>

                {draft.category && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium mb-3">
                    {draft.category}
                  </span>
                )}

                {draft.description && (
                  <p className="text-gray-700 mb-3">{draft.description}</p>
                )}

                {draft.tool_url && (
                  <a
                    href={draft.tool_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Website
                  </a>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Discovered: {new Date(draft.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(draft.id, true)}
                  disabled={loading === draft.id}
                >
                  {loading === draft.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className="ml-1">Approve</span>
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleIgnore(draft.id)}
                  disabled={loading === draft.id}
                >
                  <XCircle className="w-4 h-4" />
                  <span className="ml-1">Ignore</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
