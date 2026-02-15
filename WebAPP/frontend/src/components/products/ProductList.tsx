'use client';

import { Package, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/types';

interface ProductListProps {
  products: Product[];
  onCompare?: (productId: string) => void;
  comparingIds?: string[];
}

export function ProductList({ products, onCompare, comparingIds = [] }: ProductListProps) {
  const providerColors = {
    also: 'bg-blue-100 text-blue-800',
    tdsynnex: 'bg-purple-100 text-purple-800',
    trend: 'bg-green-100 text-green-800',
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No products found matching your criteria</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Products ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => {
            const isComparing = comparingIds.includes(product.id);
            
            return (
              <div
                key={product.id}
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  isComparing ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <Package className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {product.category && (
                        <span className="text-sm text-gray-600">{product.category}</span>
                      )}
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          providerColors[product.provider] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.provider.toUpperCase()}
                      </span>
                      {!product.available && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                          Unavailable
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {product.currency === 'EUR' ? '€' : '$'}{product.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">per user/month</p>
                  </div>
                  <div className="flex gap-2">
                    {onCompare && (
                      <button
                        onClick={() => onCompare(product.id)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isComparing
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isComparing ? 'Remove' : 'Compare'}
                      </button>
                    )}
                    <Link
                      href={`/products/${product.id}`}
                      className="px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      Details
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <button
                      disabled={!product.available}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        product.available
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
