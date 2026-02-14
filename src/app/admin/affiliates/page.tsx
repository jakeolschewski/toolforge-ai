'use client';

// Admin Interface for Managing Affiliate Links in Bulk
// Supports 100+ affiliate programs with intelligent management

import { useState, useEffect } from 'react';
import { Plus, Upload, Download, CheckCircle, XCircle, AlertCircle, ExternalLink, TrendingUp, DollarSign } from 'lucide-react';
import { affiliateManager, type AffiliateProgram } from '@/lib/affiliate-manager';

interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface AffiliateLink {
  id: string;
  tool_id: string;
  program: AffiliateProgram;
  url: string;
  commission_rate?: number;
  priority: number;
  is_active: boolean;
  status: 'active' | 'expired' | 'broken';
  last_checked?: string;
}

interface PerformanceMetric {
  program: AffiliateProgram;
  clicks: number;
  conversions: number;
  revenue: number;
  epc: number;
  conversion_rate: number;
}

export default function AffiliateManagementPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetric[]>([]);
  const [programs, setPrograms] = useState<Array<{ id: AffiliateProgram; name: string; commission_rate: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'manage' | 'bulk' | 'performance' | 'health'>('manage');

  // Bulk import state
  const [bulkImportData, setBulkImportData] = useState('');

  useEffect(() => {
    loadTools();
    loadPrograms();
  }, []);

  useEffect(() => {
    if (selectedTool) {
      loadAffiliateLinks();
      loadPerformance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTool]);

  const loadTools = async () => {
    try {
      const response = await fetch('/api/tools');
      const data = await response.json();
      if (data.success) {
        setTools(data.data);
      }
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  };

  const loadPrograms = () => {
    const supportedPrograms = affiliateManager.getSupportedPrograms();
    setPrograms(supportedPrograms);
  };

  const loadAffiliateLinks = async () => {
    if (!selectedTool) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/affiliates?toolId=${selectedTool}`);
      const data = await response.json();
      if (data.success) {
        setAffiliateLinks(data.data || []);
      }
    } catch (error) {
      console.error('Error loading affiliate links:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPerformance = async () => {
    if (!selectedTool) return;

    try {
      const metrics = await affiliateManager.getPerformanceMetrics(selectedTool);
      setPerformance(metrics);
    } catch (error) {
      console.error('Error loading performance:', error);
    }
  };

  const handleAddLink = async (program: AffiliateProgram) => {
    const url = prompt(`Enter ${program} affiliate URL:`);
    if (!url) return;

    const commissionRate = prompt('Commission rate (e.g., 0.15 for 15%):', '0.15');
    const priority = prompt('Priority (higher = preferred):', '0');

    try {
      const response = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_id: selectedTool,
          program,
          url,
          commission_rate: parseFloat(commissionRate || '0'),
          priority: parseInt(priority || '0'),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Affiliate link added successfully' });
        loadAffiliateLinks();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add link' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to add link' });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Delete this affiliate link?')) return;

    try {
      const response = await fetch(`/api/admin/affiliates/${linkId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Link deleted' });
        loadAffiliateLinks();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete link' });
    }
  };

  const handleToggleActive = async (linkId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/affiliates/${linkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });

      const data = await response.json();
      if (data.success) {
        loadAffiliateLinks();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to toggle status' });
    }
  };

  const handleBulkImport = async () => {
    if (!selectedTool) {
      setMessage({ type: 'error', text: 'Please select a tool first' });
      return;
    }

    try {
      // Parse CSV/JSON data
      const lines = bulkImportData.trim().split('\n');
      const links = lines.map(line => {
        const [program, url, commission_rate, priority] = line.split(',').map(s => s.trim());
        return {
          program: program as AffiliateProgram,
          url,
          commission_rate: parseFloat(commission_rate || '0'),
          priority: parseInt(priority || '0'),
        };
      });

      const result = await affiliateManager.bulkImportLinks(selectedTool, links);

      setMessage({
        type: result.success ? 'success' : 'error',
        text: `Imported ${result.imported} links, ${result.failed} failed`,
      });

      if (result.success) {
        setBulkImportData('');
        loadAffiliateLinks();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to import links' });
    }
  };

  const handleExport = () => {
    const csv = affiliateLinks.map(link =>
      `${link.program},${link.url},${link.commission_rate || ''},${link.priority}`
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-links-${selectedTool}.csv`;
    a.click();
  };

  const handleCheckHealth = async () => {
    if (!selectedTool) return;

    setLoading(true);
    setMessage({ type: 'info', text: 'Checking link health...' });

    try {
      const health = await affiliateManager.checkLinkHealth(selectedTool);
      setMessage({
        type: 'success',
        text: `Health check complete: ${health.healthy} healthy, ${health.broken} broken, ${health.expired} expired`,
      });
      loadAffiliateLinks();
    } catch {
      setMessage({ type: 'error', text: 'Health check failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Link Manager</h1>
          <p className="text-gray-600">Manage 100+ affiliate programs with intelligent tracking</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' :
            message.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {message.type === 'error' && <XCircle className="w-5 h-5" />}
            {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tool Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Tool
          </label>
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Select a tool --</option>
            {tools.map(tool => (
              <option key={tool.id} value={tool.id}>
                {tool.name} ({tool.category})
              </option>
            ))}
          </select>
        </div>

        {selectedTool && (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex gap-4 px-6">
                  {[
                    { id: 'manage', label: 'Manage Links' },
                    { id: 'bulk', label: 'Bulk Import' },
                    { id: 'performance', label: 'Performance' },
                    { id: 'health', label: 'Health Check' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'manage' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Affiliate Links</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={handleExport}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-12 text-gray-500">Loading...</div>
                    ) : affiliateLinks.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No affiliate links yet. Add one below.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {affiliateLinks.map(link => (
                          <div
                            key={link.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-semibold text-lg">{link.program}</span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    link.status === 'active' ? 'bg-green-100 text-green-800' :
                                    link.status === 'broken' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {link.status}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Priority: {link.priority}
                                  </span>
                                  {link.commission_rate && (
                                    <span className="text-sm text-gray-500">
                                      Commission: {(link.commission_rate * 100).toFixed(1)}%
                                    </span>
                                  )}
                                </div>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  {link.url.substring(0, 60)}...
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleActive(link.id, link.is_active)}
                                  className={`px-3 py-1 rounded text-sm font-medium ${
                                    link.is_active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {link.is_active ? 'Active' : 'Inactive'}
                                </button>
                                <button
                                  onClick={() => handleDeleteLink(link.id)}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Add New Link</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {programs.map(program => (
                          <button
                            key={program.id}
                            onClick={() => handleAddLink(program.id)}
                            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">{program.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'bulk' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Bulk Import</h2>
                    <p className="text-gray-600 mb-4">
                      Import multiple affiliate links at once. Format: program,url,commission_rate,priority (one per line)
                    </p>
                    <textarea
                      value={bulkImportData}
                      onChange={(e) => setBulkImportData(e.target.value)}
                      placeholder="amazon,https://amazon.com/...,0.03,10&#10;shareasale,https://shareasale.com/...,0.10,5"
                      className="w-full h-64 border border-gray-300 rounded-lg p-4 font-mono text-sm"
                    />
                    <button
                      onClick={handleBulkImport}
                      className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                      Import Links
                    </button>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
                    {performance.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No performance data yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {performance.map(metric => (
                          <div
                            key={metric.program}
                            className="border border-gray-200 rounded-lg p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">{metric.program}</h3>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="w-4 h-4" />
                                  <span className="font-semibold">${metric.epc.toFixed(4)} EPC</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="font-semibold">{metric.conversion_rate.toFixed(2)}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">Clicks</div>
                                <div className="text-2xl font-bold">{metric.clicks}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Conversions</div>
                                <div className="text-2xl font-bold">{metric.conversions}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Revenue</div>
                                <div className="text-2xl font-bold">${metric.revenue.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Avg Commission</div>
                                <div className="text-2xl font-bold">${(metric.revenue / metric.conversions).toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'health' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Link Health Check</h2>
                    <p className="text-gray-600 mb-4">
                      Check if affiliate links are still valid and working
                    </p>
                    <button
                      onClick={handleCheckHealth}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {loading ? 'Checking...' : 'Run Health Check'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
