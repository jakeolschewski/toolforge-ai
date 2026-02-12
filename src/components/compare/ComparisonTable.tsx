// ComparisonTable Component - Side-by-side feature comparison

import { Check, X, Minus } from 'lucide-react';
import type { Tool, ComparisonFeature } from '@/types';

interface ComparisonTableProps {
  tools: Tool[];
  features: ComparisonFeature[];
}

export default function ComparisonTable({ tools, features }: ComparisonTableProps) {
  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-red-500 mx-auto" />
      );
    }
    if (value === '-' || value === 'N/A') {
      return <Minus className="w-5 h-5 text-gray-400 mx-auto" />;
    }
    return <span className="text-center">{value}</span>;
  };

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, ComparisonFeature[]>);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900">
            <th className="p-4 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 w-1/4">
              Feature
            </th>
            {tools.map((tool) => (
              <th
                key={tool.id}
                className="p-4 text-center font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800"
              >
                <div className="flex flex-col items-center gap-2">
                  {tool.logo_url && (
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="w-12 h-12 object-contain rounded-lg"
                    />
                  )}
                  <span>{tool.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <>
              {/* Category Header */}
              <tr key={`category-${category}`}>
                <td
                  colSpan={tools.length + 1}
                  className="p-3 bg-indigo-50 dark:bg-indigo-900/20 font-semibold text-indigo-900 dark:text-indigo-300 border-b border-gray-200 dark:border-gray-800"
                >
                  {category}
                </td>
              </tr>
              {/* Category Features */}
              {categoryFeatures.map((feature, idx) => (
                <tr
                  key={`${category}-${idx}`}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <td className="p-4 text-gray-700 dark:text-gray-300">
                    {feature.name}
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4 text-gray-600 dark:text-gray-400">
                      {renderValue(feature.values[tool.id] || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
