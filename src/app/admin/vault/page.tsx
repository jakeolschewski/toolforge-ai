'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Users, Download, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RevenueChart from '@/components/admin/vault/RevenueChart';

interface VaultStats {
  total_revenue: number;
  revenue_this_month: number;
  revenue_last_month: number;
  total_workflows: number;
  published_workflows: number;
  draft_workflows: number;
  total_purchases: number;
  purchases_this_month: number;
  total_members: number;
  active_members: number;
  total_downloads: number;
  downloads_this_month: number;
  avg_workflow_price: number;
}

export default function VaultDashboardPage() {
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/vault/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load stats');
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load vault stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard stats</p>
      </div>
    );
  }

  const revenueGrowth = calculateGrowth(stats.revenue_this_month, stats.revenue_last_month);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Vault Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your premium workflows and memberships</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/vault/workflows/new">
            <Button>Create Workflow</Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ${stats.total_revenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ${stats.revenue_this_month.toLocaleString()} this month
            </p>
            {revenueGrowth !== 0 && (
              <div className={`flex items-center gap-1 mt-1 text-sm ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-4 h-4 ${revenueGrowth < 0 ? 'rotate-180' : ''}`} />
                <span>{Math.abs(revenueGrowth).toFixed(1)}% vs last month</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.active_members}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.total_members} total members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Downloads</CardTitle>
              <Download className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total_downloads.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.downloads_this_month} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Workflows</CardTitle>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total_workflows}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.published_workflows} published, {stats.draft_workflows} drafts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Workflows</h3>
            <p className="text-sm text-gray-600 mb-4">
              View, edit, and organize your workflow library
            </p>
            <Link href="/admin/vault/workflows">
              <Button variant="outline" size="sm">View Workflows</Button>
            </Link>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Purchases</h3>
            <p className="text-sm text-gray-600 mb-4">
              Track sales and manage customer purchases
            </p>
            <Link href="/admin/vault/purchases">
              <Button variant="outline" size="sm">View Purchases</Button>
            </Link>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">
              Deep dive into performance metrics and trends
            </p>
            <Link href="/admin/vault/analytics">
              <Button variant="outline" size="sm">View Analytics</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            View the purchases page for detailed transaction history
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
