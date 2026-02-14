'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe } from 'lucide-react';
import type { TrafficSource } from '@/types';

interface TrafficSourcesProps {
  data: TrafficSource[];
}

export default function TrafficSources({ data }: TrafficSourcesProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{item.source}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Visits:</span>
              <span className="font-semibold">{item.visits.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Clicks:</span>
              <span className="font-semibold">{item.clicks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Conversions:</span>
              <span className="font-semibold">{item.conversions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Revenue:</span>
              <span className="font-semibold">${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Traffic Sources
        </h3>
        <p className="text-sm text-gray-500 mt-1">Where your visitors come from</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis dataKey="source" type="category" width={120} stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="visits" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Details Table */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="space-y-3">
          {data.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{source.source}</div>
                <div className="text-xs text-gray-500">
                  {source.clicks.toLocaleString()} clicks • {source.conversions.toLocaleString()} conversions
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${source.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500">{source.percentage.toFixed(1)}% of traffic</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
