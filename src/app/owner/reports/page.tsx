'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Printer, RefreshCw } from 'lucide-react';

export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [reportType, setReportType] = useState('profit-loss');
  const [startDate, setStartDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(`${new Date().getFullYear()}-12-31`);
  const [customRange, setCustomRange] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reportData, setReportData] = useState<any>(null);

  const getToken = () => sessionStorage.getItem('owner_token') || '';

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const handleYearChange = (y: string) => {
    setYear(y);
    if (!customRange) {
      setStartDate(`${y}-01-01`);
      setEndDate(`${y}-12-31`);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/owner/reports?type=${reportType}&year=${year}&start=${startDate}&end=${endDate}&format=json`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await res.json();
      if (data.success) setReportData(data.data);
      else alert(data.error);
    } catch { alert('Failed to fetch report'); }
    finally { setLoading(false); }
  };

  const openPrintableReport = () => {
    const token = getToken();
    const url = `/api/owner/reports?type=${reportType}&year=${year}&start=${startDate}&end=${endDate}&format=html`;
    // Open in new tab with auth — we need to use fetch + blob for auth headers
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.text())
      .then(html => {
        const w = window.open('', '_blank');
        if (w) { w.document.write(html); w.document.close(); }
      })
      .catch(() => alert('Failed to open report'));
  };

  const downloadCSV = async (type: string) => {
    const token = getToken();
    try {
      const response = await fetch(`/api/owner/export?type=${type}&year=${year}&format=csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${year}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch { alert('Failed to download'); }
  };

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
        <p className="text-gray-600">Generate, view, and print/PDF financial reports</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="profit-loss">Profit & Loss</option>
              <option value="annual">Annual Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
            <select value={year} onChange={(e) => handleYearChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="custom" checked={customRange} onChange={(e) => setCustomRange(e.target.checked)} className="rounded" />
            <label htmlFor="custom" className="text-sm text-gray-700">Custom date range</label>
          </div>

          <button onClick={fetchReportData} disabled={loading} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Report
          </button>
        </div>

        {customRange && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Exports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Exports</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={openPrintableReport} className="flex items-center gap-2 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 text-purple-700 font-medium text-sm">
            <Printer className="w-4 h-4" /> Print / PDF Report
          </button>
          <button onClick={() => downloadCSV('profit-loss')} className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-green-700 font-medium text-sm">
            <Download className="w-4 h-4" /> P&L CSV
          </button>
          <button onClick={() => downloadCSV('revenue')} className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-blue-700 font-medium text-sm">
            <Download className="w-4 h-4" /> Revenue CSV
          </button>
          <button onClick={() => downloadCSV('expenses')} className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 text-red-700 font-medium text-sm">
            <Download className="w-4 h-4" /> Expenses CSV
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {reportData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-sm font-semibold text-green-800 mb-2">Total Revenue</h3>
              <div className="text-3xl font-bold text-green-900">${fmt(reportData.summary.totalRevenue)}</div>
              <p className="text-xs text-green-700 mt-1">{reportData.transactions.revenue} transactions</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Total Expenses</h3>
              <div className="text-3xl font-bold text-red-900">${fmt(reportData.summary.totalExpenses)}</div>
              <p className="text-xs text-red-700 mt-1">{reportData.transactions.expenses} transactions</p>
            </div>
            <div className={`rounded-xl p-6 border ${reportData.summary.totalProfit >= 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'}`}>
              <h3 className={`text-sm font-semibold mb-2 ${reportData.summary.totalProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Net Profit</h3>
              <div className={`text-3xl font-bold ${reportData.summary.totalProfit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>${fmt(reportData.summary.totalProfit)}</div>
              <p className={`text-xs mt-1 ${reportData.summary.totalProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                {reportData.summary.totalRevenue > 0 ? ((reportData.summary.totalProfit / reportData.summary.totalRevenue) * 100).toFixed(1) : 0}% margin
              </p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tax Deductible Expenses</h3>
              <div className="text-2xl font-bold text-gray-900">${fmt(reportData.summary.taxDeductible)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Withdrawals</h3>
              <div className="text-2xl font-bold text-gray-900">${fmt(reportData.summary.totalWithdrawals)}</div>
            </div>
          </div>

          {/* Monthly P&L Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Monthly Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Month</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Expenses</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {Object.entries(reportData.monthly).map(([month, vals]: [string, any]) => (
                    <tr key={month} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                      <td className="py-3 px-4 text-sm text-right text-green-700 font-medium">${fmt(vals.revenue)}</td>
                      <td className="py-3 px-4 text-sm text-right text-red-700 font-medium">${fmt(vals.expenses)}</td>
                      <td className={`py-3 px-4 text-sm text-right font-bold ${vals.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>${fmt(vals.profit)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                    <td className="py-3 px-4 text-sm">Total</td>
                    <td className="py-3 px-4 text-sm text-right text-green-700">${fmt(reportData.summary.totalRevenue)}</td>
                    <td className="py-3 px-4 text-sm text-right text-red-700">${fmt(reportData.summary.totalExpenses)}</td>
                    <td className={`py-3 px-4 text-sm text-right ${reportData.summary.totalProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>${fmt(reportData.summary.totalProfit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue by Source + Expense by Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Source</h3>
              {Object.keys(reportData.revenueBySource).length > 0 ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {Object.entries(reportData.revenueBySource).sort((a: any, b: any) => b[1] - a[1]).map(([src, amt]: [string, any]) => (
                    <div key={src} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 capitalize">{src}</span>
                      <span className="text-sm font-semibold text-gray-900">${fmt(amt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No revenue data</p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
              {Object.keys(reportData.expenseByCategory).length > 0 ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {Object.entries(reportData.expenseByCategory).sort((a: any, b: any) => b[1] - a[1]).map(([cat, amt]: [string, any]) => (
                    <div key={cat} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 capitalize">{cat}</span>
                      <span className="text-sm font-semibold text-gray-900">${fmt(amt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No expense data</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
