'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Package, Search, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  provider: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  description: string;
}

const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    provider: 'Also',
    name: 'Microsoft 365 Business Premium',
    category: 'Productivity Suite',
    price: 22.00,
    available: true,
    description: 'Complete productivity and security solution for businesses',
  },
  {
    id: 'PROD-002',
    provider: 'TDSynnex',
    name: 'Adobe Creative Cloud All Apps',
    category: 'Design Software',
    price: 54.99,
    available: true,
    description: 'Access to all Adobe creative applications',
  },
  {
    id: 'PROD-003',
    provider: 'Also',
    name: 'Autodesk AutoCAD 2026',
    category: 'CAD Software',
    price: 185.00,
    available: true,
    description: 'Professional CAD software for architects and engineers',
  },
  {
    id: 'PROD-004',
    provider: 'TDSynnex',
    name: 'Salesforce Sales Cloud',
    category: 'CRM',
    price: 125.00,
    available: false,
    description: 'Customer relationship management platform',
  },
  {
    id: 'PROD-005',
    provider: 'Also',
    name: 'Zoom Enterprise',
    category: 'Communication',
    price: 19.99,
    available: true,
    description: 'Video conferencing for large organizations',
  },
  {
    id: 'PROD-006',
    provider: 'TDSynnex',
    name: 'Slack Business+',
    category: 'Communication',
    price: 12.50,
    available: true,
    description: 'Team collaboration and messaging platform',
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterCategory === 'all' || product.category === filterCategory;

    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(mockProducts.map((p) => p.category)));

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-600 mt-1">Browse products from all providers</p>
          </div>
          <div className="flex gap-3">
            <UserMenu />
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
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

              {/* View Mode Toggle */}
              <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Package className="h-10 w-10 text-indigo-600" />
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {product.provider}
                    </span>
                  </div>
                  <CardTitle className="mt-4">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                      <p className="text-xs text-gray-600">per user/month</p>
                    </div>
                    <button
                      disabled={!product.available}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        product.available
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.available ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="h-8 w-8 text-indigo-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <div className="flex gap-3 mt-1">
                          <span className="text-sm text-gray-600">{product.category}</span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                            {product.provider}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">${product.price}</p>
                        <p className="text-xs text-gray-600">per user/month</p>
                      </div>
                      <button
                        disabled={!product.available}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          product.available
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.available ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
