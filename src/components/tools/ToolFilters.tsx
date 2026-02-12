'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const categories = [
  { label: 'All Categories', value: '' },
  { label: 'Writing', value: 'writing' },
  { label: 'Images', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Coding', value: 'code' },
  { label: 'Chatbots', value: 'chat' },
  { label: 'Productivity', value: 'productivity' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Design', value: 'design' },
  { label: 'Audio', value: 'audio' },
  { label: 'Research', value: 'research' },
];

const pricingOptions = [
  { label: 'All Pricing', value: '' },
  { label: 'Free', value: 'free' },
  { label: 'Freemium', value: 'freemium' },
  { label: 'Paid', value: 'paid' },
  { label: 'Subscription', value: 'subscription' },
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Alphabetical', value: 'name' },
];

export interface ToolFiltersProps {
  totalCount?: number;
}

export default function ToolFilters({ totalCount }: ToolFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentPricing = searchParams.get('pricing') || '';
  const currentSort = searchParams.get('sortBy') || 'newest';
  const currentFeatured = searchParams.get('featured') === 'true';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to first page when filtering
    router.push(`/tools?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/tools');
  };

  const hasActiveFilters = currentCategory || currentPricing || currentFeatured;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {totalCount !== undefined && (
            <span className="text-sm text-gray-600">({totalCount} tools)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200">
          {currentCategory && (
            <Badge variant="primary" className="cursor-pointer" onClick={() => updateFilter('category', '')}>
              {categories.find(c => c.value === currentCategory)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {currentPricing && (
            <Badge variant="primary" className="cursor-pointer" onClick={() => updateFilter('pricing', '')}>
              {pricingOptions.find(p => p.value === currentPricing)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {currentFeatured && (
            <Badge variant="primary" className="cursor-pointer" onClick={() => updateFilter('featured', '')}>
              Featured Only
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>
      )}

      {/* Filter Controls */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showMobileFilters ? '' : 'hidden md:grid'}`}>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pricing
          </label>
          <select
            value={currentPricing}
            onChange={(e) => updateFilter('pricing', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {pricingOptions.map((price) => (
              <option key={price.value} value={price.value}>
                {price.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {sortOptions.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured
          </label>
          <Button
            variant={currentFeatured ? 'primary' : 'outline'}
            className="w-full"
            onClick={() => updateFilter('featured', currentFeatured ? '' : 'true')}
          >
            {currentFeatured ? 'Featured Only' : 'All Tools'}
          </Button>
        </div>
      </div>
    </div>
  );
}
