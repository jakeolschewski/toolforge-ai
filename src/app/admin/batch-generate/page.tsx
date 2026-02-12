'use client';

import { useState, useEffect } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import type { Tool } from '@/types';

export default function BatchGeneratePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [template, setTemplate] = useState('standard');

  useEffect(() => {
    loadToolsWithoutReviews();
  }, []);

  const loadToolsWithoutReviews = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/tools-without-reviews', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTools(tools.map((t) => t.id));
    } else {
      setSelectedTools([]);
    }
  };

  const handleSelectTool = (toolId: string, checked: boolean) => {
    if (checked) {
      setSelectedTools((prev) => [...prev, toolId]);
    } else {
      setSelectedTools((prev) => prev.filter((id) => id !== toolId));
    }
  };

  const handleGenerate = async () => {
    if (selectedTools.length === 0) {
      toast.error('Please select at least one tool');
      return;
    }

    const proceed = confirm(
      `Generate reviews for ${selectedTools.length} tool(s)? This may take a few minutes.`
    );

    if (!proceed) return;

    setGenerating(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/batch-generate-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolIds: selectedTools,
          template,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Successfully generated ${data.generated} review(s). ${data.failed || 0} failed.`
        );
        loadToolsWithoutReviews();
        setSelectedTools([]);
      } else {
        toast.error(data.error || 'Failed to generate reviews');
      }
    } catch (error) {
      console.error('Generate error:', error);
      toast.error('Failed to generate reviews');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Batch Review Generator</h1>
        <p className="text-gray-600 mt-2">
          Generate AI-powered reviews for multiple tools at once
        </p>
      </div>

      {/* Template Selection */}
      <Card>
        <CardContent className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Template
          </label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="standard">Standard Review</option>
            <option value="detailed">Detailed Analysis</option>
            <option value="quick">Quick Overview</option>
            <option value="comparison">Comparison Style</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Choose the style and depth of the generated reviews
          </p>
        </CardContent>
      </Card>

      {/* Tools List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-4" />
            <p className="text-gray-600">Loading tools...</p>
          </CardContent>
        </Card>
      ) : tools.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">All tools have reviews!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedTools.length === tools.length && tools.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Select All ({tools.length} tools)
                  </label>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating || selectedTools.length === 0}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate {selectedTools.length > 0 && `(${selectedTools.length})`}
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool.id)}
                      onChange={(e) => handleSelectTool(tool.id, e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {tool.description}
                      </p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        <span>{tool.category}</span>
                        <span>{tool.pricing_model}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info */}
      <Card>
        <CardContent className="py-4">
          <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Select one or more tools without reviews</li>
            <li>• Choose a review template style</li>
            <li>• AI will generate comprehensive reviews based on tool information</li>
            <li>• Generated reviews are saved as drafts for your review</li>
            <li>• You can edit and publish reviews from the Reviews page</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
