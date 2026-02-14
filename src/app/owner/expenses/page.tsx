'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, RefreshCw, Trash2, Edit2 } from 'lucide-react';
import ExpenseForm from '@/components/owner/ExpenseForm';
import type { Expense, ExpenseCategory } from '@/types';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());

  const fetchExpenses = async () => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        fetch(`/api/owner/expenses?year=${yearFilter}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/owner/expenses?view=categories', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [expensesData, categoriesData] = await Promise.all([
        expensesRes.json(),
        categoriesRes.json(),
      ]);

      if (expensesData.success) {
        setExpenses(expensesData.data.expenses || []);
        setFilteredExpenses(expensesData.data.expenses || []);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearFilter]);

  useEffect(() => {
    let filtered = expenses;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
  }, [expenses, categoryFilter, searchTerm]);

  const handleSubmitExpense = async (data: Partial<Expense>) => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    try {
      const method = editingExpense ? 'PATCH' : 'POST';
      const body = editingExpense ? { id: editingExpense.id, ...data } : data;

      const response = await fetch('/api/owner/expenses', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        setEditingExpense(undefined);
        fetchExpenses();
      } else {
        alert(result.error || 'Failed to save expense');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      throw error;
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const token = sessionStorage.getItem('owner_token');
    if (!token) return;

    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/owner/expenses?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchExpenses();
      } else {
        alert(data.error || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const taxDeductibleTotal = expenses.filter((e) => e.is_tax_deductible).reduce((sum, e) => sum + e.amount, 0);

  const years = Array.from(new Set(expenses.map((e) => new Date(e.expense_date).getFullYear()))).sort((a, b) => b - a);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Tracking</h1>
          <p className="text-gray-600">Manage business expenses and tax records</p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(undefined);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Total Expenses ({yearFilter})</h3>
          <div className="text-3xl font-bold text-red-900">
            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-red-700 mt-1">{expenses.length} expenses</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-2">Tax Deductible</h3>
          <div className="text-3xl font-bold text-green-900">
            ${taxDeductibleTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-green-700 mt-1">
            {((taxDeductibleTotal / totalExpenses) * 100 || 0).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Average Expense</h3>
          <div className="text-3xl font-bold text-blue-900">
            ${(totalExpenses / expenses.length || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-blue-700 mt-1">per transaction</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => (
            <div key={cat.category} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">{cat.category}</div>
              <div className="text-xl font-bold text-gray-900">
                ${cat.total_amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-gray-500">{cat.expense_count} expenses</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search expenses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tax</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{expense.vendor || '-'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    {expense.is_tax_deductible ? (
                      <span className="text-xs text-green-600 font-medium">Deductible</span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingExpense(expense);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmitExpense}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(undefined);
          }}
        />
      )}
    </div>
  );
}
