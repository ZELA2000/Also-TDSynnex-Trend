'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSubscriptionsStore } from '@/lib/stores/subscriptions';
import { useToast } from '@/lib/toast-context';
import SubscriptionFormModal from '@/components/subscriptions/SubscriptionFormModal';
import { 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  DollarSign, 
  Package, 
  User, 
  CheckCircle, 
  XCircle,
  Edit2,
  Trash2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import type { Subscription } from '@/types';

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { getSubscription, fetchSubscriptions, updateSubscription, deleteSubscription, loading } = useSubscriptionsStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const subscriptionId = params.id as string;

  useEffect(() => {
    loadSubscription();
  }, [subscriptionId]);

  const loadSubscription = async () => {
    setIsLoading(true);
    try {
      // Try to get from store first
      let sub = getSubscription(subscriptionId);
      
      // If not in store, fetch all subscriptions
      if (!sub) {
        await fetchSubscriptions('all');
        sub = getSubscription(subscriptionId);
      }

      if (sub) {
        setSubscription(sub);
      } else {
        showToast('Subscription not found', 'error');
        router.push('/subscriptions');
      }
    } catch (error) {
      showToast('Failed to load subscription', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubscription(subscriptionId);
      showToast('Subscription cancelled successfully', 'success');
      router.push('/subscriptions');
    } catch (error) {
      // Error already handled by store
    }
  };

  const handleUpdate = async (data: Partial<Subscription>) => {
    try {
      await updateSubscription(subscriptionId, data);
      showToast('Subscription updated successfully', 'success');
      setShowEditModal(false);
      await loadSubscription();
    } catch (error) {
      // Error already handled by store
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!subscription) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Subscription not found</h2>
          <Link href="/subscriptions" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            Back to subscriptions
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/subscriptions"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscription Details</h1>
              <p className="text-gray-600 mt-1">ID: {subscription.id}</p>
            </div>
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadSubscription}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <UserMenu />
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`px-6 py-4 rounded-lg border-2 ${getStatusColor(subscription.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {subscription.status === 'active' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
              <div>
                <h3 className="font-semibold capitalize">Status: {subscription.status}</h3>
                <p className="text-sm">
                  {subscription.autoRenew ? 'Auto-renewal enabled' : 'Auto-renewal disabled'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Provider</p>
              <p className="text-lg font-bold capitalize">{subscription.provider}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Subscription Information */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Product ID</p>
                  <p className="text-base font-medium text-gray-900">{subscription.productId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Customer ID</p>
                  <p className="text-base font-medium text-gray-900">{subscription.customerId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(subscription.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {subscription.endDate && (
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(subscription.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscription.currency} {subscription.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Auto Renewal</p>
                <div className="flex items-center gap-2">
                  {subscription.autoRenew ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-base font-medium text-gray-900">Enabled</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="text-base font-medium text-gray-900">Disabled</span>
                    </>
                  )}
                </div>
              </div>

              {subscription.metadata && Object.keys(subscription.metadata).length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">Metadata</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-xs text-gray-800 overflow-x-auto">
                      {JSON.stringify(subscription.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Log - Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Activity log coming soon</p>
            </div>
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
                  onClick={() => setShowDeleteModal(false)}

        {/* Edit Form Modal */}
        {subscription && (
          <SubscriptionFormModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleUpdate}
            subscription={subscription}
            mode="edit"
          />
        )}
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
