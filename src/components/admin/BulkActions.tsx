'use client';

import { useState } from 'react';
import { Trash2, Eye, EyeOff, Star, StarOff, FolderOpen, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onActionComplete: () => void;
}

export default function BulkActions({
  selectedIds,
  onClearSelection,
  onActionComplete,
}: BulkActionsProps) {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<string>('');

  const handleBulkAction = async () => {
    if (!action) {
      toast.error('Please select an action');
      return;
    }

    if (selectedIds.length === 0) {
      toast.error('No items selected');
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${selectedIds.length} item(s)?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          ids: selectedIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully ${action}ed ${selectedIds.length} item(s)`);
        onActionComplete();
        onClearSelection();
        setAction('');
      } else {
        toast.error(data.error || 'Bulk action failed');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (quickAction: string) => {
    if (selectedIds.length === 0) {
      toast.error('No items selected');
      return;
    }

    const confirmMessage = `Are you sure you want to ${quickAction} ${selectedIds.length} item(s)?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: quickAction,
          ids: selectedIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully ${quickAction}ed ${selectedIds.length} item(s)`);
        onActionComplete();
        onClearSelection();
      } else {
        toast.error(data.error || 'Bulk action failed');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedIds.length} item(s) selected
            </span>

            <Button
              size="sm"
              variant="outline"
              onClick={onClearSelection}
              disabled={loading}
            >
              Clear Selection
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction('publish')}
              disabled={loading}
              title="Publish selected"
            >
              <Eye className="w-4 h-4" />
              Publish
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction('unpublish')}
              disabled={loading}
              title="Unpublish selected"
            >
              <EyeOff className="w-4 h-4" />
              Unpublish
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction('feature')}
              disabled={loading}
              title="Feature selected"
            >
              <Star className="w-4 h-4" />
              Feature
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction('unfeature')}
              disabled={loading}
              title="Unfeature selected"
            >
              <StarOff className="w-4 h-4" />
              Unfeature
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction('archive')}
              disabled={loading}
              title="Archive selected"
            >
              <FolderOpen className="w-4 h-4" />
              Archive
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => handleQuickAction('delete')}
              disabled={loading}
              title="Delete selected"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>

            {/* Advanced Actions Dropdown */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">More Actions...</option>
                <option value="change_category">Change Category</option>
                <option value="update_pricing">Update Pricing Model</option>
                <option value="add_tag">Add Tag</option>
                <option value="remove_tag">Remove Tag</option>
              </select>

              <Button
                size="sm"
                onClick={handleBulkAction}
                disabled={loading || !action}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
