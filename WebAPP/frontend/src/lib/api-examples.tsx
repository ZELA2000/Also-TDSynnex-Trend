/**
 * Example usage of the API client
 * 
 * This file demonstrates how to use the API client and stores
 * in your React components.
 */

import React from 'react';
import { alsoApi, tdsynnexApi, trendApi, unifiedApi } from './api';
import { useSubscriptionsStore } from './stores/subscriptions';
import { useAuthStore } from './auth';

/**
 * Example 1: Fetch subscriptions from Also
 */
export async function fetchAlsoSubscriptions() {
  try {
    const response = await alsoApi.getSubscriptions({ page: 1, limit: 10 });
    
    if (response.success && response.data) {
      console.log('Subscriptions:', response.data);
      console.log('Pagination:', response.meta);
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
  }
}

/**
 * Example 2: Create a new subscription
 */
export async function createNewSubscription() {
  try {
    const newSubscription = {
      provider: 'also' as const,
      customerId: 'CUST-123',
      productId: 'PROD-456',
      price: 99.99,
      currency: 'EUR',
      autoRenew: true,
    };

    const response = await alsoApi.createSubscription(newSubscription);
    
    if (response.success) {
      console.log('Subscription created:', response.data);
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
  }
}

/**
 * Example 3: Use Zustand store in a component
 */
export function ExampleComponent() {
  const { subscriptions, loading, error, fetchSubscriptions } = useSubscriptionsStore();
  const { isAuthenticated, login, logout } = useAuthStore();

  // Fetch on mount
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptions('all');
    }
  }, [isAuthenticated, fetchSubscriptions]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Subscriptions ({subscriptions.length})</h1>
      <ul>
        {subscriptions.map(sub => (
          <li key={sub.id}>
            {sub.provider} - {sub.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 4: Fetch security alerts from Trend
 */
export async function fetchSecurityAlerts() {
  try {
    const response = await trendApi.getAlerts({ 
      severity: 'critical',
      status: 'open' 
    });
    
    if (response.success && response.data) {
      console.log('Critical alerts:', response.data);
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
  }
}

/**
 * Example 5: Get unified data from all providers
 */
export async function fetchUnifiedData() {
  try {
    // Get all subscriptions from both Also and TDSynnex
    const { data: subscriptions } = await unifiedApi.getAllSubscriptions();
    console.log('All subscriptions:', subscriptions);

    // Get all products
    const { data: products } = await unifiedApi.getAllProducts();
    console.log('All products:', products);

    // Get dashboard stats
    const stats = await unifiedApi.getDashboardStats();
    console.log('Dashboard stats:', stats);
  } catch (error) {
    console.error('Error fetching unified data:', error);
  }
}

/**
 * Example 6: Authentication flow
 */
export async function loginExample() {
  const { login } = useAuthStore.getState();

  try {
    const response = await alsoApi.login({
      username: 'user@example.com',
      password: 'password123',
    });

    if (response.success && response.data) {
      // Store token and user info
      login(response.data.token, response.data.user);
      console.log('Logged in successfully');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}

/**
 * Example 7: Error handling with try-catch
 */
export async function handleApiErrors() {
  try {
    const response = await alsoApi.getSubscription('invalid-id');
    console.log(response.data);
  } catch (error) {
    if (error instanceof Error) {
      // Error is already formatted by the API client
      console.error('API Error:', error.message);
      
      // Show user-friendly message
      alert(`Failed to fetch subscription: ${error.message}`);
    }
  }
}
