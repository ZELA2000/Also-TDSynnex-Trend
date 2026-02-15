'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

interface Subscription {
  id: string;
  provider: string;
  customer: string;
  product: string;
  status: 'active' | 'suspended' | 'cancelled';
  startDate: string;
  price: number;
  autoRenew: boolean;
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'SUB-001',
    provider: 'Also',
    customer: 'Acme Corp',
    product: 'Microsoft 365 E3',
    status: 'active',
    startDate: '2026-01-15',
    price: 2499.99,
    autoRenew: true,
  },
  {
    id: 'SUB-002',
    provider: 'TDSynnex',
    customer: 'Tech Solutions Ltd',
    product: 'Adobe Creative Cloud',
    status: 'active',
    startDate: '2025-12-01',
    price: 1899.50,
    autoRenew: true,
  },
  {
    id: 'SUB-003',
    provider: 'Also',
    customer: 'Digital Innovations',
    product: 'Autodesk AutoCAD',
    status: 'suspended',
    startDate: '2025-11-20',
    price: 1299.00,
    autoRenew: false,
  },
  {
    id: 'SUB-004',
    provider: 'TDSynnex',
    customer: 'Cloud Services Inc',
    product: 'Salesforce Enterprise',
    status: 'active',
    startDate: '2026-02-01',
    price: 3499.99,
    autoRenew: true,
  },
];

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredSubscriptions = mockSubscriptions.filter((sub) => {
    const matchesSearch =
      sub.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-100 text-green-800';
    if (status === 'suspended') return 'bg-yellow-100 text-yellow-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
            <p className="text-gray-600 mt-1">Manage all subscriptions across providers</p>
          </div>
          <div className="flex gap-3">
            <UserMenu />
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              New Subscription
            </button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions ({filteredSubscriptions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Provider</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Start Date</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{sub.id}</td>
                      <td className="py-3 px-4">{sub.customer}</td>
                      <td className="py-3 px-4">{sub.product}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {sub.provider}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{sub.startDate}</td>
                      <td className="py-3 px-4 text-right font-medium">${sub.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
