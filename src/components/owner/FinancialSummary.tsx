'use client';

import { DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import type { FinancialSummary } from '@/types';

interface FinancialSummaryProps {
  data: FinancialSummary;
}

export default function FinancialSummaryComponent({ data }: FinancialSummaryProps) {
  const netProfit = data.total_revenue - data.total_expenses;
  const netProfit30Days = data.revenue_last_30_days - data.expenses_last_30_days;

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${data.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `$${data.revenue_last_30_days.toLocaleString('en-US', { minimumFractionDigits: 2 })} last 30 days`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Total Expenses',
      value: `$${data.total_expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `$${data.expenses_last_30_days.toLocaleString('en-US', { minimumFractionDigits: 2 })} last 30 days`,
      icon: TrendingDown,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: 'Net Profit',
      value: `$${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `$${netProfit30Days.toLocaleString('en-US', { minimumFractionDigits: 2 })} last 30 days`,
      icon: TrendingUp,
      color: netProfit >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600',
      bgColor: netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50',
      textColor: netProfit >= 0 ? 'text-blue-700' : 'text-orange-700',
    },
    {
      title: 'Pending Payouts',
      value: `$${data.pending_payouts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${data.pending_payout_count} pending payment${data.pending_payout_count !== 1 ? 's' : ''}`,
      icon: Clock,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent mb-1`}>
              {card.value}
            </div>
            <p className="text-xs text-gray-500">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
