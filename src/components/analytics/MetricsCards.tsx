'use client';

import { TrendingUp, TrendingDown, DollarSign, MousePointerClick, ShoppingCart, Target } from 'lucide-react';
import type { DashboardMetrics } from '@/types';

interface MetricsCardsProps {
  data: DashboardMetrics;
}

export default function MetricsCards({ data }: MetricsCardsProps) {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const cards = [
    {
      title: 'Today Revenue',
      value: formatCurrency(data.today_revenue),
      change: data.today_revenue_change,
      icon: DollarSign,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      subtitle: `${data.today_clicks} clicks • ${data.today_conversions} conversions`,
    },
    {
      title: 'This Week',
      value: formatCurrency(data.week_revenue),
      change: data.week_revenue_change,
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      subtitle: `${data.week_clicks} clicks • ${data.week_conversions} conversions`,
    },
    {
      title: 'This Month',
      value: formatCurrency(data.month_revenue),
      change: data.month_revenue_change,
      icon: ShoppingCart,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      subtitle: `${data.month_clicks} clicks • ${data.month_conversions} conversions`,
    },
    {
      title: 'All Time',
      value: formatCurrency(data.all_time_revenue),
      change: null,
      icon: Target,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      subtitle: 'Total earnings',
    },
    {
      title: 'Avg Conversion Rate',
      value: `${data.avg_conversion_rate.toFixed(2)}%`,
      change: null,
      icon: TrendingUp,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      subtitle: 'Click to conversion',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(data.avg_order_value),
      change: null,
      icon: DollarSign,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      subtitle: 'Per conversion',
    },
    {
      title: 'EPC',
      value: formatCurrency(data.epc),
      change: null,
      icon: MousePointerClick,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      subtitle: 'Earnings per click',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.iconBg} p-3 rounded-lg`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            {card.change !== null && (
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                card.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {formatPercent(card.change)}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-xs text-gray-500">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
