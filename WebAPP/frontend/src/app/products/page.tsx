'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductList } from '@/components/products/ProductList';
import { useProductsStore } from '@/lib/stores/products';
import { Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    filters,
    categories,
    fetchProducts,
    fetchCategories,
    setFilters,
    applyFilters,
    clearError,
  } = useProductsStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [comparingIds, setComparingIds] = useState<string[]>([]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update categories when products change
  useEffect(() => {
    if (products.length > 0) {
      fetchCategories();
    }
  }, [products, fetchCategories]);

  const filteredProducts = applyFilters();

  const handleCompare = (productId: string) => {
    setComparingIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        // Limit to 4 products for comparison
        if (prev.length >= 4) {
          return [...prev.slice(1), productId];
        }
        return [...prev, productId];
      }
    });
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-600 mt-1">
              Browse {products.length} products from all providers
            </p>
          </div>
          <div className="flex gap-3">
            <UserMenu />
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          onSearchChange={(search) => setFilters({ search })}
          onProviderChange={(provider) => setFilters({ provider })}
          onCategoryChange={(category) =>
            setFilters({ category: category === 'all' ? undefined : category })
          }
          onPriceRangeChange={(min, max) => setFilters({ minPrice: min, maxPrice: max })}
          onAvailableOnlyChange={(availableOnly) => setFilters({ availableOnly })}
          onViewModeChange={setViewMode}
          categories={categories}
          viewMode={viewMode}
          currentProvider={filters.provider}
          currentCategory={filters.category || 'all'}
          currentSearch={filters.search}
          availableOnly={filters.availableOnly}
        />

        {/* Comparison Bar */}
        {comparingIds.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-indigo-900">
                  {comparingIds.length} product{comparingIds.length > 1 ? 's' : ''} selected for
                  comparison
                </span>
              </div>
              <div className="flex gap-2">
                {comparingIds.length >= 2 && (
                  <Link
                    href={`/products/compare?ids=${comparingIds.join(',')}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    Compare Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <button
                  onClick={() => setComparingIds([])}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        )}

        {/* Products Display */}
        {!loading && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onCompare={handleCompare}
                    isComparing={comparingIds.includes(product.id)}
                  />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No products found matching your criteria</p>
                  </div>
                )}
              </div>
            ) : (
              <ProductList
                products={filteredProducts}
                onCompare={handleCompare}
                comparingIds={comparingIds}
              />
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
