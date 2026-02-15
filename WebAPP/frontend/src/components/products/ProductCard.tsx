'use client';

import Link from 'next/link';
import { Package, ExternalLink, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onCompare?: (productId: string) => void;
  isComparing?: boolean;
}

export function ProductCard({ product, onCompare, isComparing }: ProductCardProps) {
  const providerColors = {
    also: 'bg-blue-100 text-blue-800',
    tdsynnex: 'bg-purple-100 text-purple-800',
    trend: 'bg-green-100 text-green-800',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Package className="h-10 w-10 text-indigo-600" />
          <div className="flex gap-2 items-center">
            {onCompare && (
              <button
                onClick={() => onCompare(product.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isComparing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isComparing ? 'Remove from comparison' : 'Add to comparison'}
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                providerColors[product.provider] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {product.provider.toUpperCase()}
            </span>
          </div>
        </div>
        <CardTitle className="mt-4 line-clamp-2">{product.name}</CardTitle>
        {product.category && (
          <p className="text-sm text-gray-600">{product.category}</p>
        )}
      </CardHeader>
      <CardContent>
        {product.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-3">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {product.currency === 'EUR' ? '€' : '$'}{product.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600">per user/month</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}`}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
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
      </CardContent>
    </Card>
  );
}
