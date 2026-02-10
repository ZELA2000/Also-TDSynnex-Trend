import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { alsoApi, tdsynnexApi } from '../api';
import type { Subscription } from '@/types';

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
            const response = await alsoApi.getSubscriptions();
            subs = [...subs, ...(response.data || [])];
          }

          if (provider === 'tdsynnex' || provider === 'all') {
            const response = await tdsynnexApi.getSubscriptions();
            subs = [...subs, ...(response.data || [])];
          }

          set({ subscriptions: subs, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch subscriptions',
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
