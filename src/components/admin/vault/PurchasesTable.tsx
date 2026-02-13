'use client';

import { useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/helpers';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { VaultPurchase } from '@/types';

interface PurchasesTableProps {
  purchases: VaultPurchase[];
  onRefresh: () => void;
}

export default function PurchasesTable({ purchases, onRefresh }: PurchasesTableProps) {
  const [processingRefund, setProcessingRefund] = useState<string | null>(null);

  const handleRefund = async (purchaseId: string) => {
    if (!confirm('Are you sure you want to refund this purchase?')) {
      return;
    }

    setProcessingRefund(purchaseId);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/vault/purchases/${purchaseId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Refund processed successfully');
        onRefresh();
      } else {
        toast.error(data.error || 'Failed to process refund');
      }
    } catch (error) {
      toast.error('Failed to process refund');
      console.error(error);
    } finally {
      setProcessingRefund(null);
    }
  };

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">No purchases found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(purchase.purchase_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {purchase.user_email}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {purchase.user_id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {purchase.workflow_title || 'Unknown Workflow'}
                    </div>
                    {purchase.workflow_slug && (
                      <a
                        href={`/vault/${purchase.workflow_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${purchase.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">{purchase.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        purchase.payment_status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : purchase.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : purchase.payment_status === 'refunded'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {purchase.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        purchase.access_granted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {purchase.access_granted ? 'Granted' : 'Denied'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {purchase.payment_status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefund(purchase.id)}
                        disabled={processingRefund === purchase.id}
                      >
                        {processingRefund === purchase.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          'Refund'
                        )}
                      </Button>
                    )}
                    {purchase.stripe_payment_intent_id && (
                      <a
                        href={`https://dashboard.stripe.com/payments/${purchase.stripe_payment_intent_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="w-4 h-4 inline" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
