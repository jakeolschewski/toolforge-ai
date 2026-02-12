// Dynamic import wrapper for ToolGrid component
// Improves initial page load by code-splitting this component

import dynamic from 'next/dynamic';
import type { Tool } from '@/types';

// Loading placeholder
function ToolGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      ))}
    </div>
  );
}

// Dynamic import with loading state
const DynamicToolGrid = dynamic(() => import('@/components/tools/ToolGrid'), {
  loading: () => <ToolGridSkeleton />,
  ssr: true, // Enable SSR for SEO
});

export default DynamicToolGrid;
