'use client';

import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Tool } from '@/types';

interface ToolEditorProps {
  tool: Tool;
  onSave: (tool: Tool) => void;
  onCancel: () => void;
}

export default function ToolEditor({ tool, onSave, onCancel }: ToolEditorProps) {
  const [formData, setFormData] = useState<Partial<Tool>>(tool);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/tools/${tool.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Tool updated successfully');
        onSave(data.data);
      } else {
        toast.error(data.error || 'Failed to update tool');
      }
    } catch (error) {
      toast.error('Failed to update tool');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Tool, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Short, catchy description"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="productivity">Productivity</option>
              <option value="content-creation">Content Creation</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="analytics">Analytics</option>
              <option value="automation">Automation</option>
              <option value="communication">Communication</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          {/* Pricing Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pricing Model *
            </label>
            <select
              value={formData.pricing_model || 'freemium'}
              onChange={(e) => handleChange('pricing_model', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>

          {/* Starting Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Price
            </label>
            <input
              type="text"
              value={formData.starting_price || ''}
              onChange={(e) => handleChange('starting_price', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., $9.99/month"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL *
            </label>
            <input
              type="url"
              value={formData.website_url || ''}
              onChange={(e) => handleChange('website_url', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Affiliate Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affiliate Link
            </label>
            <input
              type="url"
              value={formData.affiliate_link || ''}
              onChange={(e) => handleChange('affiliate_link', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status || 'draft'}
              onChange={(e) => handleChange('status', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured || false}
              onChange={(e) => handleChange('is_featured', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
              Featured Tool
            </label>
          </div>

          {/* Sponsored */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_sponsored"
              checked={formData.is_sponsored || false}
              onChange={(e) => handleChange('is_sponsored', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="is_sponsored" className="text-sm font-medium text-gray-700">
              Sponsored Tool
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>

            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
