// Dynamic imports for heavy admin components
// These are only loaded in admin routes, not public pages

import dynamic from 'next/dynamic';

// Generic loading state
function AdminComponentSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

// Tool Editor - heavy form component
export const DynamicToolEditor = dynamic(
  () => import('@/components/admin/ToolEditor'),
  {
    loading: () => <AdminComponentSkeleton />,
    ssr: false,
  }
);

// Review Editor
export const DynamicReviewEditor = dynamic(
  () => import('@/components/admin/ReviewEditor'),
  {
    loading: () => <AdminComponentSkeleton />,
    ssr: false,
  }
);

// CSV Importer - heavy component with file processing
export const DynamicCSVImporter = dynamic(
  () => import('@/components/admin/CSVImporter'),
  {
    loading: () => <AdminComponentSkeleton />,
    ssr: false,
  }
);

// Comparison Table - heavy data table
export const DynamicComparisonTable = dynamic(
  () => import('@/components/compare/ComparisonTable'),
  {
    loading: () => <AdminComponentSkeleton />,
    ssr: true, // Keep SSR for SEO
  }
);

const DynamicAdminComponents = {
  ToolEditor: DynamicToolEditor,
  ReviewEditor: DynamicReviewEditor,
  CSVImporter: DynamicCSVImporter,
  ComparisonTable: DynamicComparisonTable,
};

export default DynamicAdminComponents;
