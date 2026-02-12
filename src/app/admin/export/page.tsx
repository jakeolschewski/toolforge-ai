'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function AdminExportPage() {
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('tools');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    pricing_model: '',
    date_from: '',
    date_to: '',
    search: '',
  });

  const handleExport = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: exportType,
          format: 'csv',
          filters,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}_export_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
        <p className="text-gray-600 mt-2">
          Export tools, reviews, and analytics to CSV files
        </p>
      </div>

      <Card>
        <CardContent className="py-6 space-y-6">
          {/* Export Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Type
            </label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="tools">Tools</option>
              <option value="reviews">Reviews</option>
              <option value="analytics">Analytics</option>
              <option value="clicks">Click Logs</option>
            </select>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Filters (Optional)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              {(exportType === 'tools' || exportType === 'analytics') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="AI Tools">AI Tools</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>
              )}

              {/* Status Filter */}
              {(exportType === 'tools' || exportType === 'reviews' || exportType === 'analytics') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              )}

              {/* Pricing Model Filter */}
              {exportType === 'tools' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={filters.pricing_model}
                    onChange={(e) => setFilters({ ...filters, pricing_model: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Pricing Models</option>
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
              )}

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Search */}
              {exportType === 'tools' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search by name or description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleExport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export to CSV
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Info */}
      <Card>
        <CardContent className="py-4">
          <h3 className="font-semibold text-gray-900 mb-2">Export Information</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Tools export includes all tool data with selected filters</li>
            <li>• Reviews export includes review content and metadata</li>
            <li>• Analytics export includes views, clicks, and ratings</li>
            <li>• Click logs are limited to the most recent 10,000 entries</li>
            <li>• All exports are in CSV format for easy import to Excel</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
