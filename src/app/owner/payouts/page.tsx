'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';
import PayoutsList from '@/components/owner/PayoutsList';
import type { Payout } from '@/types';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    network: '',
    tool_name: '',
    amount: '',
    payment_method: '',
    due_date: '',
    notes: '',
  });

  const fetchPayouts = async () => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      const response = await fetch('/api/owner/payouts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setPayouts(data.data.payouts || []);
        setFilteredPayouts(data.data.payouts || []);
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = payouts;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Apply network filter
    if (networkFilter !== 'all') {
      filtered = filtered.filter((p) => p.network === networkFilter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.network.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tool_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayouts(filtered);
  }, [payouts, statusFilter, networkFilter, searchTerm]);

  const handleAddPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      const response = await fetch('/api/owner/payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowAddForm(false);
        setFormData({
          network: '',
          tool_name: '',
          amount: '',
          payment_method: '',
          due_date: '',
          notes: '',
        });
        fetchPayouts();
      } else {
        alert(data.error || 'Failed to create payout');
      }
    } catch (error) {
      console.error('Error creating payout:', error);
      alert('Failed to create payout');
    }
  };

  const handleUpdatePayout = async (id: string, updates: Partial<Payout>) => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      const response = await fetch('/api/owner/payouts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updates }),
      });

      const data = await response.json();

      if (data.success) {
        fetchPayouts();
      } else {
        alert(data.error || 'Failed to update payout');
      }
    } catch (error) {
      console.error('Error updating payout:', error);
      alert('Failed to update payout');
    }
  };

  const handleDeletePayout = async (id: string) => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      const response = await fetch(`/api/owner/payouts?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchPayouts();
      } else {
        alert(data.error || 'Failed to delete payout');
      }
    } catch (error) {
      console.error('Error deleting payout:', error);
      alert('Failed to delete payout');
    }
  };

  const uniqueNetworks = Array.from(new Set(payouts.map((p) => p.network)));

  const totalPending = payouts.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalReceived = payouts.filter((p) => p.status === 'received').reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payouts Management</h1>
          <p className="text-gray-600">Track and manage affiliate payouts</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Payout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Pending Payouts</h3>
          <div className="text-3xl font-bold text-yellow-900">
            ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            {payouts.filter((p) => p.status === 'pending').length} payment(s)
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-2">Received Payouts</h3>
          <div className="text-3xl font-bold text-green-900">
            ${totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-green-700 mt-1">
            {payouts.filter((p) => p.status === 'received').length} payment(s)
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Total Payouts</h3>
          <div className="text-3xl font-bold text-blue-900">
            ${(totalPending + totalReceived).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-blue-700 mt-1">{payouts.length} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by network or tool..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Network Filter */}
          <div>
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Networks</option>
              {uniqueNetworks.map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payouts List */}
      <PayoutsList
        payouts={filteredPayouts}
        onUpdate={handleUpdatePayout}
        onDelete={handleDeletePayout}
      />

      {/* Add Payout Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Payout</h2>
            <form onSubmit={handleAddPayout} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Network <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Impact, ShareASale"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tool Name</label>
                <input
                  type="text"
                  value={formData.tool_name}
                  onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <input
                  type="text"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., PayPal, Bank Transfer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors font-medium"
                >
                  Add Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
