'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Search, Mail, Phone, Building } from 'lucide-react';
import Link from 'next/link';

interface Customer {
  id: string;
  provider: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  subscriptions: number;
  totalSpent: number;
  createdAt: string;
}

const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    provider: 'Also',
    name: 'John Smith',
    email: 'john.smith@acmecorp.com',
    phone: '+1 555-0101',
    company: 'Acme Corp',
    status: 'active',
    subscriptions: 3,
    totalSpent: 12450.00,
    createdAt: '2025-06-15',
  },
  {
    id: 'CUST-002',
    provider: 'TDSynnex',
    name: 'Sarah Johnson',
    email: 'sarah.j@techsolutions.com',
    phone: '+1 555-0202',
    company: 'Tech Solutions Ltd',
    status: 'active',
    subscriptions: 5,
    totalSpent: 28900.50,
    createdAt: '2025-03-22',
  },
  {
    id: 'CUST-003',
    provider: 'Also',
    name: 'Michael Chen',
    email: 'mchen@digitalinnov.io',
    phone: '+1 555-0303',
    company: 'Digital Innovations',
    status: 'inactive',
    subscriptions: 1,
    totalSpent: 5200.00,
    createdAt: '2025-09-10',
  },
  {
    id: 'CUST-004',
    provider: 'TDSynnex',
    name: 'Emily Rodriguez',
    email: 'emily.r@cloudservices.com',
    phone: '+1 555-0404',
    company: 'Cloud Services Inc',
    status: 'active',
    subscriptions: 7,
    totalSpent: 45600.99,
    createdAt: '2024-11-05',
  },
  {
    id: 'CUST-005',
    provider: 'Also',
    name: 'David Park',
    email: 'dpark@startuphub.co',
    phone: '+1 555-0505',
    company: 'Startup Hub',
    status: 'active',
    subscriptions: 2,
    totalSpent: 8750.00,
    createdAt: '2026-01-20',
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockCustomers.length,
    active: mockCustomers.filter((c) => c.status === 'active').length,
    totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage customer accounts and relationships</p>
          </div>
          <div className="flex gap-3">
            <UserMenu />
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Add Customer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-lg font-semibold text-indigo-600">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{customer.name}</CardTitle>
                      <p className="text-xs text-gray-600 mt-1">{customer.id}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      customer.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>{customer.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subscriptions:</span>
                      <span className="font-medium">{customer.subscriptions}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium">${customer.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">
                      View Details
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                      Edit
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
