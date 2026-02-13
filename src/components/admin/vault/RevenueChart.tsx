'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

interface RevenueData {
  month: string;
  revenue: number;
  purchases: number;
}

export default function RevenueChart({ data }: { data?: RevenueData[] }) {
  const [chartData, setChartData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) {
      setChartData(data);
      setLoading(false);
    } else {
      loadData();
    }
  }, [data]);

  const loadData = async () => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/vault/revenue-trend', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setChartData(result.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </CardContent>
      </Card>
    );
  }

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No revenue data available
          </div>
        ) : (
          <div className="space-y-4">
            {chartData.map((item, index) => {
              const percentage = (item.revenue / maxRevenue) * 100;

              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-600 text-right">
                    {new Date(item.month).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full flex items-center justify-end px-3 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 20 && (
                            <span className="text-xs font-semibold text-white">
                              ${item.revenue.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {percentage <= 20 && (
                        <span className="text-sm font-semibold text-gray-700 min-w-[80px]">
                          ${item.revenue.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.purchases} {item.purchases === 1 ? 'purchase' : 'purchases'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
