'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, TrendingUp, DollarSign, Users, MousePointerClick } from 'lucide-react';
import FinancialSummary from '@/components/owner/FinancialSummary';
import RevenueChart from '@/components/owner/RevenueChart';
import type { FinancialSummary as FinancialSummaryType, MonthlyRevenueTrend, RevenueByTool, Payout } from '@/types';

export default function OwnerDashboard() {
  const [summary, setSummary] = useState<FinancialSummaryType | null>(null);
  const [trends, setTrends] = useState<MonthlyRevenueTrend[]>([]);
  const [topTools, setTopTools] = useState<RevenueByTool[]>([]);
  const [recentPayouts, setRecentPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      // Fetch all data in parallel
      const [summaryRes, trendsRes, toolsRes, payoutsRes] = await Promise.all([
        fetch('/api/owner/revenue?view=summary', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/owner/revenue?view=trends', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/owner/revenue?view=by-tool', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/owner/payouts?limit=5', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [summaryData, trendsData, toolsData, payoutsData] = await Promise.all([
        summaryRes.json(),
        trendsRes.json(),
        toolsRes.json(),
        payoutsRes.json(),
      ]);

      if (summaryData.success) setSummary(summaryData.data);
      if (trendsData.success) setTrends(trendsData.data);
      if (toolsData.success) setTopTools(toolsData.data.slice(0, 10));
      if (payoutsData.success) setRecentPayouts(payoutsData.data.payouts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleExport = async (type: string) => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      const response = await fetch(`/api/owner/export?type=${type}&format=csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Track revenue, expenses, and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="relative group">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport('payouts')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg text-sm"
              >
                Export Payouts
              </button>
              <button
                onClick={() => handleExport('expenses')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
              >
                Export Expenses
              </button>
              <button
                onClick={() => handleExport('revenue')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
              >
                Export Revenue
              </button>
              <button
                onClick={() => handleExport('profit-loss')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg text-sm"
              >
                Export P&L Statement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      {summary && <FinancialSummary data={summary} />}

      {/* Revenue Chart */}
      {trends.length > 0 && (
        <div className="mt-8">
          <RevenueChart data={trends} />
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Earning Tools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top Earning Tools
          </h3>
          <div className="space-y-4">
            {topTools.slice(0, 5).map((tool, index) => (
              <div key={tool.tool_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-lg font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{tool.tool_name}</div>
                    <div className="text-xs text-gray-500">
                      {tool.total_conversions} conversions • {tool.conversion_rate.toFixed(2)}% CVR
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ${tool.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500">{tool.transaction_count} sales</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Recent Payouts
          </h3>
          <div className="space-y-4">
            {recentPayouts.length > 0 ? (
              recentPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-medium text-gray-900">{payout.network}</div>
                    <div className="text-xs text-gray-500">
                      {payout.payment_date ? new Date(payout.payment_date).toLocaleDateString() : 'No date'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs ${payout.status === 'received' ? 'text-green-600' : payout.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {payout.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent payouts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
