'use client';

import { useEffect, useState } from 'react';
import { Building2, ArrowDownToLine, RefreshCw, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';

interface BankAccount {
  id: string;
  bank_name: string;
  account_holder: string;
  account_number_last4: string;
  routing_number_last4: string;
  account_type: string;
  is_default: boolean;
  notes: string;
  status: string;
  created_at: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  bank_account_id: string | null;
  bank_info: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  notes: string;
  requested_at: string;
  completed_at: string | null;
  created_at: string;
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const [bankForm, setBankForm] = useState({
    bank_name: '',
    account_holder: '',
    account_number_last4: '',
    routing_number_last4: '',
    account_type: 'checking',
    is_default: false,
    notes: '',
  });

  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    bank_account_id: '',
    notes: '',
  });

  const getToken = () => sessionStorage.getItem('owner_token') || '';

  const fetchData = async () => {
    const token = getToken();
    try {
      const [wRes, bRes] = await Promise.all([
        fetch('/api/owner/withdrawals?view=withdrawals', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/owner/withdrawals?view=bank-accounts', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [wData, bData] = await Promise.all([wRes.json(), bRes.json()]);

      if (wData.success) {
        setWithdrawals(wData.data.withdrawals || []);
        setTotalWithdrawn(wData.data.totalWithdrawn || 0);
        setTotalPending(wData.data.totalPending || 0);
      }
      if (bData.success) {
        setBankAccounts(bData.data || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawal data:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, []);

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/owner/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ type: 'bank-account', ...bankForm }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddBank(false);
        setBankForm({ bank_name: '', account_holder: '', account_number_last4: '', routing_number_last4: '', account_type: 'checking', is_default: false, notes: '' });
        fetchData();
      } else {
        alert(data.error);
      }
    } catch { alert('Failed to add bank account'); }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/owner/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ amount: parseFloat(withdrawForm.amount), bank_account_id: withdrawForm.bank_account_id || undefined, notes: withdrawForm.notes }),
      });
      const data = await res.json();
      if (data.success) {
        setShowWithdraw(false);
        setWithdrawForm({ amount: '', bank_account_id: '', notes: '' });
        fetchData();
      } else {
        alert(data.error);
      }
    } catch { alert('Failed to create withdrawal'); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/owner/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) fetchData();
      else alert(data.error);
    } catch { alert('Failed to update'); }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/owner/withdrawals?id=${id}&type=${type}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) fetchData();
      else alert(data.error);
    } catch { alert('Failed to delete'); }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': case 'processing': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fund Withdrawals</h1>
          <p className="text-gray-600">Withdraw funds to your bank accounts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddBank(true)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Add Bank
          </button>
          <button onClick={() => setShowWithdraw(true)} className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 font-medium flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4" /> Withdraw Funds
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-2">Total Withdrawn</h3>
          <div className="text-3xl font-bold text-green-900">${totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Pending Withdrawals</h3>
          <div className="text-3xl font-bold text-yellow-900">${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Bank Accounts</h3>
          <div className="text-3xl font-bold text-blue-900">{bankAccounts.length}</div>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" /> Your Bank Accounts
        </h3>
        {bankAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((bank) => (
              <div key={bank.id} className={`p-4 rounded-lg border-2 ${bank.is_default ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">{bank.bank_name}</div>
                  <div className="flex items-center gap-2">
                    {bank.is_default && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">Default</span>}
                    <button onClick={() => handleDelete(bank.id, 'bank-account')} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{bank.account_holder}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {bank.account_type.charAt(0).toUpperCase() + bank.account_type.slice(1)} ****{bank.account_number_last4}
                </div>
                {bank.notes && <div className="text-xs text-gray-400 mt-2">{bank.notes}</div>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No bank accounts added yet. Add one to start withdrawing funds.</p>
        )}
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-green-600" /> Withdrawal History
        </h3>
        {withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Bank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Notes</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{new Date(w.requested_at || w.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">${w.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{w.bank_info || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusColor(w.status)}`}>
                        {statusIcon(w.status)} {w.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 max-w-[200px] truncate">{w.notes || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {w.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(w.id, 'completed')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Complete</button>
                            <button onClick={() => handleUpdateStatus(w.id, 'failed')} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Failed</button>
                          </>
                        )}
                        <button onClick={() => handleDelete(w.id, 'withdrawal')} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No withdrawals yet</p>
        )}
      </div>

      {/* Add Bank Account Modal */}
      {showAddBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Bank Account</h2>
            <form onSubmit={handleAddBank} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Name *</label>
                <input type="text" value={bankForm.bank_name} onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Chase, Bank of America" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Account Holder *</label>
                <input type="text" value={bankForm.account_holder} onChange={(e) => setBankForm({ ...bankForm, account_holder: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Full name on account" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last 4 of Account #</label>
                  <input type="text" maxLength={4} value={bankForm.account_number_last4} onChange={(e) => setBankForm({ ...bankForm, account_number_last4: e.target.value.replace(/\D/g, '') })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="1234" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last 4 of Routing #</label>
                  <input type="text" maxLength={4} value={bankForm.routing_number_last4} onChange={(e) => setBankForm({ ...bankForm, routing_number_last4: e.target.value.replace(/\D/g, '') })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="5678" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type</label>
                <select value={bankForm.account_type} onChange={(e) => setBankForm({ ...bankForm, account_type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_default" checked={bankForm.is_default} onChange={(e) => setBankForm({ ...bankForm, is_default: e.target.checked })} className="rounded" />
                <label htmlFor="is_default" className="text-sm text-gray-700">Set as default account</label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <input type="text" value={bankForm.notes} onChange={(e) => setBankForm({ ...bankForm, notes: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Optional notes" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddBank(false)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 font-medium">Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Withdraw Funds</h2>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (USD) *</label>
                <input type="number" step="0.01" min="0.01" value={withdrawForm.amount} onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Destination Bank Account</label>
                <select value={withdrawForm.bank_account_id} onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_account_id: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select a bank account...</option>
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>{b.bank_name} - ****{b.account_number_last4} {b.is_default ? '(Default)' : ''}</option>
                  ))}
                </select>
                {bankAccounts.length === 0 && <p className="text-xs text-amber-600 mt-1">No bank accounts. Add one first.</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea value={withdrawForm.notes} onChange={(e) => setWithdrawForm({ ...withdrawForm, notes: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Optional notes..." />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowWithdraw(false)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 font-medium">Request Withdrawal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
