'use client';

import { useMemo } from 'react';
import type { MonthlyRevenueTrend } from '@/types';

interface RevenueChartProps {
  data: MonthlyRevenueTrend[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = useMemo(() => {
    // Group by month
    const byMonth: Record<string, { month: string; revenue: number; sources: Record<string, number> }> = {};

    data.forEach((item) => {
      const monthKey = new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      if (!byMonth[monthKey]) {
        byMonth[monthKey] = {
          month: monthKey,
          revenue: 0,
          sources: {},
        };
      }

      byMonth[monthKey].revenue += item.revenue;
      byMonth[monthKey].sources[item.source] = (byMonth[monthKey].sources[item.source] || 0) + item.revenue;
    });

    return Object.values(byMonth).reverse().slice(0, 12);
  }, [data]);

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  const sourceColors: Record<string, string> = {
    affiliate: 'bg-blue-500',
    membership: 'bg-green-500',
    ads: 'bg-purple-500',
    sponsorship: 'bg-orange-500',
    other: 'bg-gray-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends (Last 12 Months)</h3>

      {/* Chart */}
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium text-gray-600 text-right">
              {item.month}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full flex items-center justify-end px-3 transition-all duration-500"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  >
                    <span className="text-xs font-semibold text-white">
                      ${item.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Source breakdown */}
              <div className="flex gap-1 mt-1 h-2">
                {Object.entries(item.sources).map(([source, amount]) => (
                  <div
                    key={source}
                    className={`${sourceColors[source] || 'bg-gray-400'} rounded-sm`}
                    style={{ width: `${(amount / item.revenue) * 100}%` }}
                    title={`${source}: $${amount.toLocaleString()}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
        {Object.entries(sourceColors).map(([source, color]) => (
          <div key={source} className="flex items-center gap-2">
            <div className={`w-3 h-3 ${color} rounded-sm`} />
            <span className="text-xs text-gray-600 capitalize">{source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
