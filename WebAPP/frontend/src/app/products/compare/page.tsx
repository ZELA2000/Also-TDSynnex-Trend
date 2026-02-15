'use client';

import { useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductsStore } from '@/lib/stores/products';
import {
  ArrowLeft,
  Package,
  CheckCircle,
  XCircle,
  ShoppingCart,
  X,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/types';

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading, fetchProducts, compareProducts } = useProductsStore();
  
  // Derive selectedIds from URL params
  const selectedIds = useMemo(() => {
    const idsParam = searchParams.get('ids');
    return idsParam ? idsParam.split(',').filter(Boolean) : [];
  }, [searchParams]);

  // Derive comparison products from selectedIds
  const comparisonProducts = useMemo(() => {
    if (selectedIds.length > 0 && products.length > 0) {
      return compareProducts(selectedIds);
    }
    return [];
  }, [selectedIds, products, compareProducts]);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const addProduct = (productId: string) => {
    if (!selectedIds.includes(productId) && selectedIds.length < 4) {
      const newIds = [...selectedIds, productId];
      router.push(`/products/compare?ids=${newIds.join(',')}`);
    }
  };

  const removeProduct = (productId: string) => {
    const newIds = selectedIds.filter((id) => id !== productId);
    if (newIds.length === 0) {
      router.push('/products');
    } else {
      router.push(`/products/compare?ids=${newIds.join(',')}`);
    }
  };

  const providerColors = {
    also: 'bg-blue-100 text-blue-800',
    tdsynnex: 'bg-purple-100 text-purple-800',
    trend: 'bg-green-100 text-green-800',
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
            </div>
            <UserMenu />
          </div>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (comparisonProducts.length === 0) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
            </div>
            <UserMenu />
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                No products selected for comparison. Select at least 2 products from the catalog.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Link>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Get all available products for adding
  const availableProducts = products.filter((p) => !selectedIds.includes(p.id));

  // Comparison attributes
  const comparisonAttributes = [
    { key: 'name', label: 'Name' },
    { key: 'provider', label: 'Provider' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', format: (p: Product) => `${p.currency === 'EUR' ? '€' : '$'}${p.price.toFixed(2)}/month` },
    { key: 'available', label: 'Availability', format: (p: Product) => p.available ? 'Available' : 'Unavailable' },
    { key: 'currency', label: 'Currency' },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
              <p className="text-gray-600 mt-1">
                Comparing {comparisonProducts.length} product{comparisonProducts.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <UserMenu />
        </div>

        {/* Add More Products */}
        {comparisonProducts.length < 4 && availableProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Add More Products (max 4)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {availableProducts.slice(0, 10).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product.id)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-3 w-3" />
                    {product.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="p-4 text-left bg-gray-50 font-medium text-gray-700 w-48">
                      Attribute
                    </th>
                    {comparisonProducts.map((product) => (
                      <th key={product.id} className="p-4 bg-gray-50 min-w-[250px]">
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <Package className="h-8 w-8 text-indigo-600" />
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Remove from comparison"
                            >
                              <X className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm mb-1">
                              {product.name}
                            </p>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                providerColors[product.provider] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {product.provider.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonAttributes.map((attr, idx) => (
                    <tr
                      key={attr.key}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="p-4 font-medium text-gray-700 border-r border-gray-200">
                        {attr.label}
                      </td>
                      {comparisonProducts.map((product) => {
                        const value = attr.format
                          ? attr.format(product)
                          : product[attr.key as keyof Product];
                        
                        // Convert value to string if it's an object
                        const displayValue = typeof value === 'object' && value !== null
                          ? JSON.stringify(value)
                          : value;
                        
                        const isPrice = attr.key === 'price';
                        const lowestPrice = isPrice
                          ? Math.min(...comparisonProducts.map((p) => p.price))
                          : null;
                        const isLowest = isPrice && product.price === lowestPrice;

                        return (
                          <td
                            key={product.id}
                            className={`p-4 text-center ${
                              isLowest ? 'bg-green-50 font-bold text-green-700' : ''
                            }`}
                          >
                            {attr.key === 'available' ? (
                              <div className="flex items-center justify-center gap-2">
                                {product.available ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-green-600">Available</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <span className="text-red-600">Unavailable</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span>{displayValue || 'N/A'}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Description Row */}
                  <tr className="bg-white">
                    <td className="p-4 font-medium text-gray-700 border-r border-gray-200 align-top">
                      Description
                    </td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4 text-sm text-gray-700">
                        {product.description || 'No description available'}
                      </td>
                    ))}
                  </tr>
                  {/* Actions Row */}
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium text-gray-700 border-r border-gray-200">
                      Actions
                    </td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            View Details
                          </Link>
                          <button
                            disabled={!product.available}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                              product.available
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {product.available ? 'Add to Cart' : 'Unavailable'}
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}
