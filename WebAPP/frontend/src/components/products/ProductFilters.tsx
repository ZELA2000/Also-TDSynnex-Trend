'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Grid, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProductFiltersProps {
  onSearchChange: (search: string) => void;
  onProviderChange: (provider: 'also' | 'tdsynnex' | 'all') => void;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (min?: number, max?: number) => void;
  onAvailableOnlyChange: (availableOnly: boolean) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  categories: string[];
  viewMode: 'grid' | 'list';
  currentProvider?: string;
  currentCategory?: string;
  currentSearch?: string;
  availableOnly?: boolean;
}

export function ProductFilters({
  onSearchChange,
  onProviderChange,
  onCategoryChange,
  onPriceRangeChange,
  onAvailableOnlyChange,
  onViewModeChange,
  categories,
  viewMode,
  currentProvider = 'all',
  currentCategory = 'all',
  currentSearch = '',
  availableOnly = true,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearchChange]);

  const handlePriceChange = () => {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;
    onPriceRangeChange(min, max);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    onProviderChange('all');
    onCategoryChange('all');
    onPriceRangeChange(undefined, undefined);
    onAvailableOnlyChange(true);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* Main Filters Row */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Provider Filter */}
          <select
            value={currentProvider}
            onChange={(e) => onProviderChange(e.target.value as 'also' | 'tdsynnex' | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Providers</option>
            <option value="also">Also</option>
            <option value="tdsynnex">TDSynnex</option>
          </select>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={currentCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showAdvanced
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showAdvanced ? 'Hide' : 'More'} Filters
          </button>

          {/* View Mode Toggle */}
          <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
              }`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={handlePriceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={handlePriceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Available Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Availability</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => onAvailableOnlyChange(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Available only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
