'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSubscriptionsStore } from '@/lib/stores/subscriptions';
import { useToast } from '@/lib/toast-context';
import SubscriptionFormModal from '@/components/subscriptions/SubscriptionFormModal';
import { Package, Search, Filter, Plus, Loader2, RefreshCw, Eye, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Subscription } from '@/types';

export default function SubscriptionsPage() {
  const { subscriptions, loading, error, fetchSubscriptions, createSubscription, updateSubscription, deleteSubscription, clearError } = useSubscriptionsStore();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>(undefined);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Load subscriptions on mount
  useEffect(() => {
    loadSubscriptions();
  }, []);

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      clearError();
    }
  }, [error]);

  const loadSubscriptions = async () => {
    try {
      await fetchSubscriptions('all');
      showToast('Subscriptions loaded successfully', 'success');
    } catch (err) {
      // Error already handled by store
    }
  };

  const handleDelete = async () => {
    if (!subscriptionToDelete) return;
    
    try {
      await deleteSubscription(subscriptionToDelete);
      showToast('Subscription cancelled successfully', 'success');
      setShowDeleteModal(false);
      setSubscriptionToDelete(null);
    } catch (err) {
      // Error already handled by store
    }
  };

  const handleCreateOrUpdate = async (data: Partial<Subscription>) => {
    try {
      if (formMode === 'create') {
        await createSubscription(data);
        showToast('Subscription created successfully', 'success');
      } else if (editingSubscription) {
        await updateSubscription(editingSubscription.id, data);
        showToast('Subscription updated successfully', 'success');
      }
      setShowFormModal(false);
      setEditingSubscription(undefined);
    } catch (err) {
      // Error already handled by store
      throw err;
    }
  };

  const openCreateModal = () => {
    setFormMode('create');
    setEditingSubscription(undefined);
    setShowFormModal(true);
  };

  const openEditModal = (subscription: Subscription) => {
    setFormMode('edit');
    setEditingSubscription(subscription);
    setShowFormModal(true);
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.productId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesProvider = filterProvider === 'all' || sub.provider === filterProvider;

    return matchesSearch && matchesStatus && matchesProvider;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <button
              onClick={loadSubscriptions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <UserMenu />
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="h-4 w-4" />
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

              {/* Provider Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Providers</option>
                  <option value="also">Also</option>
                  <option value="tdsynnex">TDSynnex</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              All Subscriptions ({filteredSubscriptions.length})
              {loading && <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && subscriptions.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-3 text-gray-600">Loading subscriptions...</span>
              </div>
            ) : filteredSubscriptions.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterProvider !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by creating a new subscription'}
                </p>
              </div>
            ) : (
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
                        <td clonClick={() => openEditModal(sub)}
                              assName="py-3 px-4">{sub.customerId}</td>
                        <td className="py-3 px-4">{sub.productId}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            sub.provider === 'also' ? 'bg-blue-100 text-blue-800' : 
                            sub.provider === 'tdsynnex' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {sub.provider}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(sub.status)}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(sub.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {sub.currency} {sub.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/subscriptions/${sub.id}`}
                              className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100"
                              title="Edit subscription"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSubscriptionToDelete(sub.id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Cancel subscription"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

        {/* Create/Edit Form Modal */}
        <SubscriptionFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setEditingSubscription(undefined);
          }}
          onSubmit={handleCreateOrUpdate}
          subscription={editingSubscription}
          mode={formMode}
        />
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Subscription</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this subscription? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSubscriptionToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Cancelling...' : 'Yes, Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
