'use client';

import { useRouter } from 'next/navigation';
import CSVImporter from '@/components/admin/CSVImporter';

export default function AdminImportPage() {
  const router = useRouter();

  const handleImportComplete = () => {
    // Refresh tools list
    router.push('/admin/tools');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Data</h1>
        <p className="text-gray-600 mt-2">
          Import tools and reviews in bulk using CSV files
        </p>
      </div>

      <CSVImporter onImportComplete={handleImportComplete} />
    </div>
  );
}
