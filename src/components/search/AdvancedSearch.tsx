'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Filter,
  Sparkles,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Tool } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
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
  { label: 'Free', value: 'free' },
  { label: 'Freemium', value: 'freemium' },
  { label: 'Paid', value: 'paid' },
  { label: 'Enterprise', value: 'subscription' },
];

const sortOptions = [
  { label: 'Most Relevant', value: 'relevance' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Price: Low to High', value: 'price' },
];

export default function AdvancedSearch({ isOpen, onClose }: AdvancedSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>(undefined);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch suggestions as user types
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&suggestions=true`
      );
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  }, []);

  // Fetch search results
  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setResultCount(0);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        q: query,
        sortBy,
        limit: '10',
      });

      if (selectedCategories.length > 0) {
        params.set('category', selectedCategories[0]); // API supports single category
      }

      if (selectedPricing.length > 0) {
        params.set('pricing', selectedPricing[0]); // API supports single pricing
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data.data || []);
        setResultCount(data.data.pagination.total || 0);

        // Track search analytics
        trackSearch(query, data.data.pagination.total || 0);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedCategories, selectedPricing, sortBy]);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query);
      fetchResults();
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, fetchSuggestions, fetchResults]);

  // Track search analytics
  const trackSearch = async (searchQuery: string, resultsCount: number) => {
    try {
      await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          results_count: resultsCount,
        }),
      });
    } catch {
      // Silent fail for analytics
    }
  };

  // Track tool click
  const handleToolClick = async (tool: Tool) => {
    try {
      await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          results_count: resultCount,
          clicked_tool_id: tool.id,
        }),
      });
    } catch {
      // Silent fail
    }

    router.push(`/tools/${tool.slug}`);
    onClose();
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle pricing filter
  const togglePricing = (pricing: string) => {
    setSelectedPricing(prev =>
      prev.includes(pricing)
        ? prev.filter(p => p !== pricing)
        : [...prev, pricing]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPricing([]);
    setSortBy('relevance');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedPricing.length > 0 || sortBy !== 'relevance';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start md:items-start justify-center md:pt-20 px-0 md:px-4"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-4xl bg-white md:rounded-2xl shadow-2xl h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-4 md:p-6 border-b">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Search Tools</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI tools by name, feature, or category..."
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 font-medium">Suggestions:</span>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Filters Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="primary" className="ml-1">
                  {selectedCategories.length + selectedPricing.length}
                </Badge>
              )}
            </button>

            {query && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      className="flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.value)}
                        onChange={() => toggleCategory(cat.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Pricing</h4>
                <div className="space-y-2">
                  {pricingOptions.map((price) => (
                    <label
                      key={price.value}
                      className="flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPricing.includes(price.value)}
                        onChange={() => togglePricing(price.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{price.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h4>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="primary"
                      className="cursor-pointer"
                      onClick={() => toggleCategory(cat)}
                    >
                      {categories.find((c) => c.value === cat)?.label}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                  {selectedPricing.map((price) => (
                    <Badge
                      key={price}
                      variant="primary"
                      className="cursor-pointer"
                      onClick={() => togglePricing(price)}
                    >
                      {pricingOptions.find((p) => p.value === price)?.label}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {!query ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Discover AI Tools
              </h3>
              <p className="text-gray-600">
                Start typing to search across 1000+ AI tools
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try different keywords or filters
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                >
                  {tool.logo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {tool.name[0]}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h4>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" />
                    </div>
                    {tool.tagline && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {tool.tagline}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary">{tool.category}</Badge>
                      {tool.pricing_model && (
                        <Badge variant="outline">
                          {tool.pricing_model.charAt(0).toUpperCase() +
                            tool.pricing_model.slice(1)}
                        </Badge>
                      )}
                      {tool.rating > 0 && (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          ⭐ {tool.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {resultCount > results.length && (
                <button
                  onClick={() => {
                    router.push(`/tools?search=${encodeURIComponent(query)}`);
                    onClose();
                  }}
                  className="w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View all {resultCount} results
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
