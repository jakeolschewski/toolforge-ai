'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign } from 'lucide-react';
import type { RevenueByProgram } from '@/types';

interface RevenuePieChartProps {
  data: RevenueByProgram[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function RevenuePieChart({ data }: RevenuePieChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{item.program}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Revenue:</span>
              <span className="font-semibold">${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Percentage:</span>
              <span className="font-semibold">{item.percentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Conversions:</span>
              <span className="font-semibold">{item.conversions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Clicks:</span>
              <span className="font-semibold">{item.clicks.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(0)}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Revenue by Affiliate Program
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Total: <span className="font-semibold text-gray-900">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="revenue"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div key={item.program} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{item.program}</div>
              <div className="text-xs text-gray-500">
                ${item.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                {' • '}
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
