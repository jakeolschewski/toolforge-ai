// Dynamic imports for chart components
// Heavy recharts library is only loaded when needed

import dynamic from 'next/dynamic';

// Loading skeleton for charts
function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-400">Loading chart...</div>
    </div>
  );
}

// Dynamic import for revenue chart
export const DynamicRevenueChart = dynamic(
  () => import('@/components/owner/RevenueChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // Charts don't need SSR
  }
);

// You can add more chart components here as needed
const DynamicCharts = {
  RevenueChart: DynamicRevenueChart,
};

export default DynamicCharts;
