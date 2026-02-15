'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Info,
  DollarSign,
  Tag,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products, loading, error, fetchProducts, getProduct } = useProductsStore();
  
  const productId = params.id as string;
  const product = getProduct(productId);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
            </div>
            <UserMenu />
          </div>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading product details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !product) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Product Not Found</h1>
            </div>
            <UserMenu />
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {error || 'The product you are looking for could not be found.'}
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

  const providerColors = {
    also: 'bg-blue-100 text-blue-800',
    tdsynnex: 'bg-purple-100 text-purple-800',
    trend: 'bg-green-100 text-green-800',
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-1">Product ID: {product.id}</p>
            </div>
          </div>
          <UserMenu />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Overview</CardTitle>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      providerColors[product.provider] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.provider.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="h-20 w-20 text-indigo-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                    {product.description && (
                      <p className="text-gray-700">{product.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium text-gray-900">
                        {product.category || 'Uncategorized'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Provider</p>
                      <p className="font-medium text-gray-900">
                        {product.provider.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Currency</p>
                      <p className="font-medium text-gray-900">{product.currency}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {product.available ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Availability</p>
                      <p
                        className={`font-medium ${
                          product.available ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {product.available ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                {product.metadata && Object.keys(product.metadata).length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(product.metadata).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-gray-600">{key}: </span>
                          <span className="font-medium text-gray-900">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-gray-900">
                    {product.currency === 'EUR' ? '€' : '$'}
                    {product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600 mt-2">per user/month</p>
                </div>
                <button
                  disabled={!product.available}
                  className={`w-full mt-4 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    product.available
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.available ? 'Add to Cart' : 'Unavailable'}
                </button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href={`/products/compare?ids=${product.id}`}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Compare with other products
                </Link>
                <Link
                  href="/subscriptions/new"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Create Subscription
                </Link>
                <Link
                  href="/products"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Catalog
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
