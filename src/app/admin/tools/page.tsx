'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ToolEditor from '@/components/admin/ToolEditor';
import BulkActions from '@/components/admin/BulkActions';
import type { Tool } from '@/types';

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const loadTools = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/tools', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load tools');
      }

      const data = await response.json();

      if (data.success) {
        setTools(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load tools:', error);
      toast.error('Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleDelete = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/tools/${toolId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Tool deleted successfully');
        setTools((prev) => prev.filter((t) => t.id !== toolId));
      } else {
        toast.error(data.error || 'Failed to delete tool');
      }
    } catch (error) {
      toast.error('Failed to delete tool');
      console.error(error);
    }
  };

  const handleSave = (updatedTool: Tool) => {
    setTools((prev) =>
      prev.map((t) => (t.id === updatedTool.id ? updatedTool : t))
    );
    setEditingTool(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTools.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (toolId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, toolId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== toolId));
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || tool.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (editingTool) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Tool</h1>
          <p className="text-gray-600 mt-2">Update tool information</p>
        </div>

        <ToolEditor
          tool={editingTool}
          onSave={handleSave}
          onCancel={() => setEditingTool(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Tools</h1>
          <p className="text-gray-600 mt-2">Edit, delete, and organize your tools</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
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

            <Button onClick={loadTools} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>

          {/* Bulk selection info */}
          {selectedIds.length > 0 && (
            <div className="mt-3 flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-primary-700">
                {selectedIds.length} item(s) selected
              </span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Selection
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Tools</div>
          <div className="text-3xl font-bold text-gray-900">{tools.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Published</div>
          <div className="text-3xl font-bold text-green-600">
            {tools.filter((t) => t.status === 'published').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Drafts</div>
          <div className="text-3xl font-bold text-yellow-600">
            {tools.filter((t) => t.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Archived</div>
          <div className="text-3xl font-bold text-gray-600">
            {tools.filter((t) => t.status === 'archived').length}
          </div>
        </div>
      </div>

      {/* Tools List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="text-gray-600 mt-4">Loading tools...</p>
        </div>
      ) : filteredTools.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No tools found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          {filteredTools.length > 0 && (
            <div className="flex items-center gap-2 px-2">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredTools.length && filteredTools.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Select All
              </label>
            </div>
          )}

          {filteredTools.map((tool) => (
            <Card key={tool.id} hover>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(tool.id)}
                      onChange={(e) => handleSelectOne(tool.id, e.target.checked)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500 mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {tool.name}
                        </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          tool.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : tool.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tool.status}
                      </span>
                      {tool.is_featured && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {tool.description}
                    </p>

                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Category: {tool.category}</span>
                        <span>Views: {tool.views || 0}</span>
                        <span>Clicks: {tool.clicks || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/tools/${tool.slug}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTool(tool)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(tool.id)}
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

      {/* Bulk Actions Bar */}
      <BulkActions
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onActionComplete={() => {
          loadTools();
          setSelectedIds([]);
        }}
      />
    </div>
  );
}
