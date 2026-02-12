'use client';

import { useState } from 'react';
import { CheckCircle, Clock, XCircle, Trash2, Edit2 } from 'lucide-react';
import type { Payout } from '@/types';
import { cn } from '@/utils/helpers';

interface PayoutsListProps {
  payouts: Payout[];
  onUpdate: (id: string, updates: Partial<Payout>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function PayoutsList({ payouts, onUpdate, onDelete }: PayoutsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Payout>>({});

  const handleEdit = (payout: Payout) => {
    setEditingId(payout.id);
    setEditForm(payout);
  };

  const handleSave = async (id: string) => {
    await onUpdate(id, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleMarkReceived = async (payout: Payout) => {
    await onUpdate(payout.id, {
      status: 'received',
      received_date: new Date().toISOString().split('T')[0],
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      received: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border', styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200')}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (payouts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payouts Yet</h3>
        <p className="text-gray-600">Create your first payout to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Network</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tool</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Received</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payout.status)}
                    <span className="font-medium text-gray-900">{payout.network}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{payout.tool_name || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">
                    ${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">{payout.currency}</span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(payout.status)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {payout.due_date ? new Date(payout.due_date).toLocaleDateString() : '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {payout.received_date ? new Date(payout.received_date).toLocaleDateString() : '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {payout.status === 'pending' && (
                      <button
                        onClick={() => handleMarkReceived(payout)}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Received
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(payout)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this payout?')) {
                          onDelete(payout.id);
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
