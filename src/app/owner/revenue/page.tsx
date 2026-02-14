'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, MousePointerClick, RefreshCw } from 'lucide-react';
import RevenueChart from '@/components/owner/RevenueChart';
import type { MonthlyRevenueTrend, RevenueByTool } from '@/types';

export default function RevenuePage() {
  const [trends, setTrends] = useState<MonthlyRevenueTrend[]>([]);
  const [topTools, setTopTools] = useState<RevenueByTool[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [revenueBySource, setRevenueBySource] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      const [trendsRes, toolsRes, sourceRes] = await Promise.all([
        fetch('/api/owner/revenue?view=trends', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/owner/revenue?view=by-tool', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/owner/revenue?view=by-source', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [trendsData, toolsData, sourceData] = await Promise.all([
        trendsRes.json(),
        toolsRes.json(),
        sourceRes.json(),
      ]);

      if (trendsData.success) setTrends(trendsData.data);
      if (toolsData.success) setTopTools(toolsData.data);
      if (sourceData.success) setRevenueBySource(sourceData.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalRevenue = revenueBySource.reduce((sum, s) => sum + s.total_revenue, 0);
  const totalConversions = revenueBySource.reduce((sum, s) => sum + s.total_conversions, 0);
  const totalClicks = revenueBySource.reduce((sum, s) => sum + s.total_clicks, 0);
  const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  const sourceColors: Record<string, string> = {
    affiliate: 'from-blue-500 to-blue-600',
    membership: 'from-green-500 to-green-600',
    ads: 'from-purple-500 to-purple-600',
    sponsorship: 'from-orange-500 to-orange-600',
    other: 'from-gray-500 to-gray-600',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Analytics</h1>
        <p className="text-gray-600">Detailed revenue tracking and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-green-800 mb-1">Total Revenue</h3>
          <div className="text-3xl font-bold text-green-900">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Conversions</h3>
          <div className="text-3xl font-bold text-blue-900">{totalConversions.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <MousePointerClick className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-purple-800 mb-1">Total Clicks</h3>
          <div className="text-3xl font-bold text-purple-900">{totalClicks.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-orange-800 mb-1">Conversion Rate</h3>
          <div className="text-3xl font-bold text-orange-900">{avgConversionRate.toFixed(2)}%</div>
        </div>
      </div>

      {/* Revenue by Source */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {revenueBySource.map((source) => (
            <div key={source.source} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-700 capitalize">{source.source}</h4>
                <div className={`px-3 py-1 bg-gradient-to-r ${sourceColors[source.source] || 'from-gray-500 to-gray-600'} text-white rounded-full text-xs font-bold`}>
                  {((source.total_revenue / totalRevenue) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${source.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500">{source.count} transactions</div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Clicks:</span>
                    <span className="font-semibold text-gray-900">{source.total_clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Conversions:</span>
                    <span className="font-semibold text-gray-900">{source.total_conversions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">CVR:</span>
                    <span className="font-semibold text-gray-900">
                      {source.total_clicks > 0
                        ? ((source.total_conversions / source.total_clicks) * 100).toFixed(2)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trends Chart */}
      {trends.length > 0 && <RevenueChart data={trends} />}

      {/* Top Tools Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Tools</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tool</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Conversions</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Clicks</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">CVR</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Avg Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topTools.map((tool, index) => (
                <tr key={tool.tool_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-lg font-bold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{tool.tool_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      ${tool.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{tool.total_conversions.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{tool.total_clicks.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full"
                          style={{ width: `${Math.min(tool.conversion_rate, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{tool.conversion_rate.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ${tool.avg_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
