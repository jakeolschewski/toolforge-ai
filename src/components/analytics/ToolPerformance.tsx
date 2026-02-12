'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, Eye, MousePointerClick, DollarSign } from 'lucide-react';
import type { ToolPerformanceMetrics } from '@/types';

interface ToolPerformanceProps {
  data: ToolPerformanceMetrics[];
}

type SortField = 'tool_name' | 'views' | 'clicks' | 'conversions' | 'revenue' | 'ctr' | 'conversion_rate' | 'epc';
type SortDirection = 'asc' | 'desc';

export default function ToolPerformance({ data }: ToolPerformanceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(tool =>
        tool.tool_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const multiplier = sortDirection === 'asc' ? 1 : -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * multiplier;
      }

      return ((aVal as number) - (bVal as number)) * multiplier;
    });

    return result;
  }, [data, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Tool Performance Metrics
        </h3>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                <button
                  onClick={() => handleSort('tool_name')}
                  className="flex items-center gap-2 hover:text-gray-900"
                >
                  Tool Name
                  <SortIcon field="tool_name" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                <button
                  onClick={() => handleSort('views')}
                  className="flex items-center gap-2 hover:text-gray-900 ml-auto"
                >
                  <Eye className="w-4 h-4" />
                  Views
                  <SortIcon field="views" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                <button
                  onClick={() => handleSort('clicks')}
                  className="flex items-center gap-2 hover:text-gray-900 ml-auto"
                >
                  <MousePointerClick className="w-4 h-4" />
                  Clicks
                  <SortIcon field="clicks" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                <button
                  onClick={() => handleSort('ctr')}
                  className="flex items-center gap-2 hover:text-gray-900 ml-auto"
                >
                  CTR
                  <SortIcon field="ctr" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                <button
                  onClick={() => handleSort('conversions')}
                  className="flex items-center gap-2 hover:text-gray-900 ml-auto"
                >
                  Conv.
                  <SortIcon field="conversions" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                <button
                  onClick={() => handleSort('conversion_rate')}
                  className="flex items-center gap-2 hover:text-gray-900 ml-auto"
                >
                  CVR
                  <SortIcon field="conversion_rate" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                <button
                  onClick={() => handleSort('revenue')}
                  className="flex items-center gap-2 hover:text-gray-900 ml-auto"
                >
                  <DollarSign className="w-4 h-4" />
                  Revenue
                  <SortIcon field="revenue" />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                <button
                  onClick={() => handleSort('epc')}
                  className="flex items-center gap-2 hover:text-gray-900 ml-auto"
                >
                  EPC
                  <SortIcon field="epc" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tool) => (
              <tr
                key={tool.tool_id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{tool.tool_name}</div>
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-600">
                  {tool.views.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-600">
                  {tool.clicks.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-sm font-medium ${
                    tool.ctr >= 5 ? 'text-green-600' :
                    tool.ctr >= 2 ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {formatPercent(tool.ctr)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-600">
                  {tool.conversions.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-sm font-medium ${
                    tool.conversion_rate >= 3 ? 'text-green-600' :
                    tool.conversion_rate >= 1 ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {formatPercent(tool.conversion_rate)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(tool.revenue)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-sm font-medium ${
                    tool.epc >= 1 ? 'text-green-600' :
                    tool.epc >= 0.5 ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {formatCurrency(tool.epc)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
            {filteredAndSortedData.length} tools
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1 + Math.max(0, currentPage - 3);
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tools found matching your search.</p>
        </div>
      )}
    </div>
  );
}
