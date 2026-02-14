'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Download, DollarSign, Users, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import RevenueChart from '@/components/admin/vault/RevenueChart';

interface AnalyticsData {
  revenue_by_workflow: Array<{
    workflow_id: string;
    workflow_title: string;
    revenue: number;
    purchases: number;
    downloads: number;
  }>;
  revenue_by_month: Array<{
    month: string;
    revenue: number;
    purchases: number;
  }>;
  top_workflows: Array<{
    workflow_id: string;
    workflow_title: string;
    downloads: number;
    favorites: number;
    rating: number;
  }>;
  conversion_metrics: {
    views_to_downloads: number;
    free_to_premium: number;
    avg_purchase_value: number;
  };
  customer_metrics: {
    total_customers: number;
    new_customers_this_month: number;
    repeat_customers: number;
    avg_customer_lifetime_value: number;
  };
}

export default function VaultAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/vault/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Performance insights and trends</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {analytics.customer_metrics.total_customers}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              +{analytics.customer_metrics.new_customers_this_month} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Repeat Customers</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {analytics.customer_metrics.repeat_customers}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {((analytics.customer_metrics.repeat_customers / analytics.customer_metrics.total_customers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Purchase Value</CardTitle>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ${analytics.conversion_metrics.avg_purchase_value.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Customer LTV</CardTitle>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ${analytics.customer_metrics.avg_customer_lifetime_value.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={analytics.revenue_by_month} />

      {/* Top Workflows by Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Top Workflows by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.revenue_by_workflow.slice(0, 10).map((workflow, index) => (
              <div key={workflow.workflow_id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{workflow.workflow_title}</div>
                    <div className="text-sm text-gray-600">
                      {workflow.purchases} purchases • {workflow.downloads} downloads
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    ${workflow.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    ${(workflow.revenue / workflow.purchases).toFixed(2)} avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Workflows by Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.top_workflows.slice(0, 10).map((workflow, index) => (
              <div key={workflow.workflow_id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{workflow.workflow_title}</div>
                    <div className="text-sm text-gray-600">
                      {workflow.favorites} favorites • {workflow.rating ? `${workflow.rating.toFixed(1)}/5` : 'No rating'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-gray-400" />
                  <div className="font-bold text-gray-900">
                    {workflow.downloads.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Views to Downloads</div>
              <div className="text-3xl font-bold text-gray-900">
                {(analytics.conversion_metrics.views_to_downloads * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Free to Premium Conversion</div>
              <div className="text-3xl font-bold text-gray-900">
                {(analytics.conversion_metrics.free_to_premium * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Average Purchase Value</div>
              <div className="text-3xl font-bold text-gray-900">
                ${analytics.conversion_metrics.avg_purchase_value.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
