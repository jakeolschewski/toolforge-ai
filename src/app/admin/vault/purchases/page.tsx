'use client';

import { useEffect, useState } from 'react';
import { Search, Download, Loader2, Calendar, DollarSign, User } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PurchasesTable from '@/components/admin/vault/PurchasesTable';
import type { VaultPurchase } from '@/types';

export default function VaultPurchasesPage() {
  const [purchases, setPurchases] = useState<VaultPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/vault/purchases', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load purchases');
      }

      const data = await response.json();
      if (data.success) {
        setPurchases(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Customer Email', 'Workflow', 'Amount', 'Status', 'Payment ID'];
    const rows = filteredPurchases.map((p) => [
      formatDate(p.purchase_date || p.purchased_at),
      p.user_email,
      p.workflow_title || 'Unknown',
      `$${p.amount.toFixed(2)}`,
      p.payment_status,
      p.stripe_payment_intent_id || 'N/A',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-purchases-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (purchase.workflow_title || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || purchase.payment_status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const purchaseDate = new Date(purchase.purchase_date || purchase.purchased_at);
      const now = new Date();
      const daysAgo = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === '7days' && daysAgo > 7) matchesDate = false;
      if (dateFilter === '30days' && daysAgo > 30) matchesDate = false;
      if (dateFilter === '90days' && daysAgo > 90) matchesDate = false;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = filteredPurchases
    .filter((p) => p.payment_status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = filteredPurchases.filter((p) => p.payment_status === 'completed').length;
  const pendingCount = filteredPurchases.filter((p) => p.payment_status === 'pending').length;
  const refundedCount = filteredPurchases.filter((p) => p.payment_status === 'refunded').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
          <p className="text-gray-600 mt-2">View and manage all workflow purchases</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Revenue</div>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Completed</div>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {completedCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Pending</div>
              <User className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Refunded</div>
              <User className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">
              {refundedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email or workflow..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>

            <Button onClick={loadPurchases} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="text-gray-600 mt-4">Loading purchases...</p>
        </div>
      ) : (
        <PurchasesTable purchases={filteredPurchases} onRefresh={loadPurchases} />
      )}
    </div>
  );
}
