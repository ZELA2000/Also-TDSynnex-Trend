import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { alsoApi, tdsynnexApi } from '../api';
import type { Subscription } from '@/types';

// Mock data for demo purposes
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'SUB-ALSO-001',
    provider: 'also',
    customerId: 'CUST-001',
    productId: 'ALSO-001',
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2027-01-15',
    autoRenew: true,
    price: 22.00,
    currency: 'USD',
    metadata: {
      productName: 'Microsoft 365 Business Premium',
      users: 25,
      billingCycle: 'monthly',
    },
  },
  {
    id: 'SUB-ALSO-002',
    provider: 'also',
    customerId: 'CUST-002',
    productId: 'ALSO-003',
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2027-02-01',
    autoRenew: true,
    price: 19.99,
    currency: 'USD',
    metadata: {
      productName: 'Zoom Enterprise',
      users: 50,
      billingCycle: 'monthly',
    },
  },
  {
    id: 'SUB-TDS-001',
    provider: 'tdsynnex',
    customerId: 'CUST-003',
    productId: 'TDS-001',
    status: 'active',
    startDate: '2025-12-01',
    endDate: '2026-12-01',
    autoRenew: false,
    price: 54.99,
    currency: 'USD',
    metadata: {
      productName: 'Adobe Creative Cloud',
      users: 10,
      billingCycle: 'monthly',
    },
  },
  {
    id: 'SUB-TDS-002',
    provider: 'tdsynnex',
    customerId: 'CUST-004',
    productId: 'TDS-003',
    status: 'active',
    startDate: '2026-01-10',
    endDate: '2027-01-10',
    autoRenew: true,
    price: 12.50,
    currency: 'USD',
    metadata: {
      productName: 'Slack Business+',
      users: 75,
      billingCycle: 'monthly',
    },
  },
  {
    id: 'SUB-ALSO-003',
    provider: 'also',
    customerId: 'CUST-005',
    productId: 'ALSO-002',
    status: 'suspended',
    startDate: '2025-11-01',
    endDate: '2026-11-01',
    autoRenew: false,
    price: 185.00,
    currency: 'USD',
    metadata: {
      productName: 'Autodesk AutoCAD',
      users: 5,
      billingCycle: 'annual',
      suspendedReason: 'Payment pending',
    },
  },
  {
    id: 'SUB-TDS-003',
    provider: 'tdsynnex',
    customerId: 'CUST-001',
    productId: 'TDS-004',
    status: 'active',
    startDate: '2026-02-05',
    endDate: '2027-02-05',
    autoRenew: true,
    price: 24.00,
    currency: 'USD',
    metadata: {
      productName: 'Dropbox Business',
      users: 15,
      billingCycle: 'monthly',
    },
  },
];

interface SubscriptionState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  
  fetchSubscriptions: (provider?: 'also' | 'tdsynnex' | 'all') => Promise<void>;
  getSubscription: (id: string) => Subscription | undefined;
  createSubscription: (data: Partial<Subscription>) => Promise<void>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Subscriptions store using Zustand
 */
export const useSubscriptionsStore = create<SubscriptionState>()(
  devtools(
    (set, get) => ({
      subscriptions: [],
      loading: false,
      error: null,

      fetchSubscriptions: async (provider = 'all') => {
        set({ loading: true, error: null });
        
        try {
          let subs: Subscription[] = [];

          if (provider === 'also' || provider === 'all') {
            try {
              const response = await alsoApi.getSubscriptions();
              subs = [...subs, ...(response.data || [])];
            } catch (err) {
              console.warn('Also API not available, using mock data');
              const alsoMockSubs = MOCK_SUBSCRIPTIONS.filter(s => s.provider === 'also');
              subs = [...subs, ...alsoMockSubs];
            }
          }

          if (provider === 'tdsynnex' || provider === 'all') {
            try {
              const response = await tdsynnexApi.getSubscriptions();
              subs = [...subs, ...(response.data || [])];
            } catch (err) {
              console.warn('TDSynnex API not available, using mock data');
              const tdsMockSubs = MOCK_SUBSCRIPTIONS.filter(s => s.provider === 'tdsynnex');
              subs = [...subs, ...tdsMockSubs];
            }
          }

          // If no subscriptions were fetched, use all mock data
          if (subs.length === 0) {
            console.warn('All APIs failed, using complete mock data');
            subs = MOCK_SUBSCRIPTIONS;
          }

          set({ subscriptions: subs, loading: false });
        } catch (error) {
          console.error('Error fetching subscriptions, using mock data:', error);
          set({ 
            subscriptions: MOCK_SUBSCRIPTIONS,
            error: 'Using demo data - API connection unavailable',
            loading: false 
          });
        }
      },

      getSubscription: (id: string) => {
        return get().subscriptions.find(sub => sub.id === id);
      },

      createSubscription: async (data: Partial<Subscription>) => {
        set({ loading: true, error: null });
        
        try {
          const provider = data.provider || 'also';
          
          if (provider === 'also') {
            await alsoApi.createSubscription(data);
          } else if (provider === 'tdsynnex') {
            await tdsynnexApi.createSubscription(data);
          }

          // Refresh subscriptions
          await get().fetchSubscriptions();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create subscription',
            loading: false 
          });
          throw error;
        }
      },

      updateSubscription: async (id: string, data: Partial<Subscription>) => {
        set({ loading: true, error: null });
        
        try {
          const subscription = get().getSubscription(id);
          if (!subscription) {
            throw new Error('Subscription not found');
          }

          if (subscription.provider === 'also') {
            await alsoApi.updateSubscription(id, data);
          }
          // Add TDSynnex update when available

          // Refresh subscriptions
          await get().fetchSubscriptions();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update subscription',
            loading: false 
          });
          throw error;
        }
      },

      deleteSubscription: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const subscription = get().getSubscription(id);
          if (!subscription) {
            throw new Error('Subscription not found');
          }

          if (subscription.provider === 'also') {
            await alsoApi.cancelSubscription(id);
          }
          // Add TDSynnex delete when available

          // Refresh subscriptions
          await get().fetchSubscriptions();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete subscription',
            loading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'subscriptions-store' }
  )
);
