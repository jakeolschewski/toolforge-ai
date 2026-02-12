'use client';

import { Filter, ChevronDown } from 'lucide-react';
import type { ConversionFunnel as ConversionFunnelType } from '@/types';

interface ConversionFunnelProps {
  data: ConversionFunnelType[];
}

export default function ConversionFunnel({ data }: ConversionFunnelProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-600" />
          Conversion Funnel
        </h3>
        <p className="text-sm text-gray-500 mt-1">User journey from view to conversion</p>
      </div>

      <div className="space-y-2">
        {data.map((stage, index) => (
          <div key={index}>
            <div className="relative">
              {/* Stage Bar */}
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 transition-all duration-500 hover:shadow-lg"
                style={{
                  width: `${(stage.count / maxCount) * 100}%`,
                  minWidth: '200px',
                }}
              >
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="font-semibold">{stage.stage}</div>
                    <div className="text-xs opacity-90">{stage.percentage.toFixed(1)}% of initial</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{stage.count.toLocaleString()}</div>
                    {stage.drop_off !== undefined && stage.drop_off > 0 && (
                      <div className="text-xs opacity-90">-{stage.drop_off.toFixed(1)}% drop</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow between stages */}
            {index < data.length - 1 && (
              <div className="flex justify-center my-1">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {data[0]?.count.toLocaleString() || 0}
            </div>
            <div className="text-xs text-gray-500">Total Views</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {data[data.length - 1]?.count.toLocaleString() || 0}
            </div>
            <div className="text-xs text-gray-500">Conversions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data[data.length - 1]?.percentage.toFixed(2) || 0}%
            </div>
            <div className="text-xs text-gray-500">Overall CVR</div>
          </div>
        </div>
      </div>
    </div>
  );
}
