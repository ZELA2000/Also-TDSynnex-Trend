import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { alsoApi, tdsynnexApi } from '../api';
import type { Product } from '@/types';

// Mock data for demo purposes
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'ALSO-001',
    provider: 'also',
    name: 'Microsoft 365 Business Premium',
    description: 'Complete productivity and security solution for businesses with Office apps, email, file storage and advanced security features.',
    price: 22.00,
    currency: 'USD',
    category: 'Productivity Suite',
    available: true,
    metadata: {
      users: 'Up to 300',
      storage: '1TB per user',
      support: '24/7',
    },
  },
  {
    id: 'ALSO-002',
    provider: 'also',
    name: 'Autodesk AutoCAD 2026',
    description: 'Professional CAD software for architects, engineers and construction professionals.',
    price: 185.00,
    currency: 'USD',
    category: 'CAD Software',
    available: true,
    metadata: {
      license: 'Annual subscription',
      platform: 'Windows, Mac',
    },
  },
  {
    id: 'ALSO-003',
    provider: 'also',
    name: 'Zoom Enterprise',
    description: 'Video conferencing platform for large organizations with unlimited meeting duration and cloud recording.',
    price: 19.99,
    currency: 'USD',
    category: 'Communication',
    available: true,
    metadata: {
      participants: 'Up to 1000',
      recording: 'Cloud storage included',
    },
  },
  {
    id: 'TDS-001',
    provider: 'tdsynnex',
    name: 'Adobe Creative Cloud All Apps',
    description: 'Access to all Adobe creative applications including Photoshop, Illustrator, Premiere Pro and more.',
    price: 54.99,
    currency: 'USD',
    category: 'Design Software',
    available: true,
    metadata: {
      apps: '20+ applications',
      storage: '100GB cloud',
    },
  },
  {
    id: 'TDS-002',
    provider: 'tdsynnex',
    name: 'Salesforce Sales Cloud',
    description: 'Customer relationship management platform with sales automation and analytics.',
    price: 125.00,
    currency: 'USD',
    category: 'CRM',
    available: false,
    metadata: {
      users: 'Unlimited',
      integrations: '1000+ apps',
    },
  },
  {
    id: 'TDS-003',
    provider: 'tdsynnex',
    name: 'Slack Business+',
    description: 'Team collaboration and messaging platform with advanced features and integrations.',
    price: 12.50,
    currency: 'USD',
    category: 'Communication',
    available: true,
    metadata: {
      messages: 'Unlimited history',
      integrations: '2400+ apps',
    },
  },
  {
    id: 'ALSO-004',
    provider: 'also',
    name: 'QuickBooks Online Plus',
    description: 'Comprehensive accounting software for small to medium businesses.',
    price: 85.00,
    currency: 'USD',
    category: 'Accounting',
    available: true,
  },
  {
    id: 'TDS-004',
    provider: 'tdsynnex',
    name: 'Dropbox Business Advanced',
    description: 'Secure file storage and collaboration with unlimited storage and advanced admin controls.',
    price: 24.00,
    currency: 'USD',
    category: 'Cloud Storage',
    available: true,
    metadata: {
      storage: 'Unlimited',
      users: 'Minimum 3 users',
    },
  },
  {
    id: 'ALSO-005',
    provider: 'also',
    name: 'Norton 360 Deluxe',
    description: 'Complete security solution with antivirus, VPN, password manager and cloud backup.',
    price: 8.33,
    currency: 'USD',
    category: 'Security',
    available: true,
    metadata: {
      devices: 'Up to 5',
      vpn: 'Unlimited',
      backup: '50GB cloud',
    },
  },
  {
    id: 'TDS-005',
    provider: 'tdsynnex',
    name: 'Atlassian Jira Software',
    description: 'Project management and issue tracking software for agile teams.',
    price: 7.75,
    currency: 'USD',
    category: 'Project Management',
    available: true,
    metadata: {
      users: 'Per user pricing',
      storage: '250GB',
    },
  },
  {
    id: 'ALSO-006',
    provider: 'also',
    name: 'Mailchimp Premium',
    description: 'Email marketing platform with advanced automation and analytics.',
    price: 299.00,
    currency: 'USD',
    category: 'Marketing',
    available: true,
  },
  {
    id: 'TDS-006',
    provider: 'tdsynnex',
    name: 'DocuSign Business Pro',
    description: 'Electronic signature solution for businesses with advanced features.',
    price: 65.00,
    currency: 'USD',
    category: 'Document Management',
    available: true,
    metadata: {
      envelopes: 'Unlimited',
      templates: 'Custom branding',
    },
  },
];

interface ProductFilters {
  provider?: 'also' | 'tdsynnex' | 'all';
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  categories: string[];
  
  // Fetching
  fetchProducts: (provider?: 'also' | 'tdsynnex' | 'all') => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  
  // Filters
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => Product[];
  
  // Categories
  fetchCategories: () => Promise<void>;
  
  // Comparison
  compareProducts: (productIds: string[]) => Product[];
  
  // Utilities
  clearError: () => void;
}

/**
 * Products store using Zustand
 */
export const useProductsStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      filters: {
        provider: 'all',
        availableOnly: true,
      },
      categories: [],

      fetchProducts: async (provider = 'all') => {
        set({ loading: true, error: null });
        
        try {
          let products: Product[] = [];

          if (provider === 'also' || provider === 'all') {
            try {
              const response = await alsoApi.getProducts();
              products = [...products, ...(response.data || [])];
            } catch (err) {
              console.warn('Also API not available, using mock data');
              // Fallback to mock data for Also
              const alsoMockProducts = MOCK_PRODUCTS.filter(p => p.provider === 'also');
              products = [...products, ...alsoMockProducts];
            }
          }

          if (provider === 'tdsynnex' || provider === 'all') {
            try {
              const response = await tdsynnexApi.getProducts();
              products = [...products, ...(response.data || [])];
            } catch (err) {
              console.warn('TDSynnex API not available, using mock data');
              // Fallback to mock data for TDSynnex
              const tdsMockProducts = MOCK_PRODUCTS.filter(p => p.provider === 'tdsynnex');
              products = [...products, ...tdsMockProducts];
            }
          }

          // If no products were fetched (all APIs failed), use all mock data
          if (products.length === 0) {
            console.warn('All APIs failed, using complete mock data');
            products = MOCK_PRODUCTS;
          }

          set({ products, loading: false });
        } catch (error) {
          // Final fallback: use mock data
          console.error('Error fetching products, using mock data:', error);
          set({ 
            products: MOCK_PRODUCTS,
            error: 'Using demo data - API connection unavailable',
            loading: false 
          });
        }
      },

      getProduct: (id: string) => {
        return get().products.find(product => product.id === id);
      },

      setFilters: (newFilters: Partial<ProductFilters>) => {
        set({ 
          filters: { ...get().filters, ...newFilters } 
        });
      },

      clearFilters: () => {
        set({ 
          filters: {
            provider: 'all',
            availableOnly: true,
          } 
        });
      },

      applyFilters: () => {
        const { products, filters } = get();
        
        return products.filter(product => {
          // Provider filter
          if (filters.provider && filters.provider !== 'all' && product.provider !== filters.provider) {
            return false;
          }

          // Category filter
          if (filters.category && product.category !== filters.category) {
            return false;
          }

          // Search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesName = product.name.toLowerCase().includes(searchLower);
            const matchesDescription = product.description?.toLowerCase().includes(searchLower);
            if (!matchesName && !matchesDescription) {
              return false;
            }
          }

          // Price range filter
          if (filters.minPrice !== undefined && product.price < filters.minPrice) {
            return false;
          }
          if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
            return false;
          }

          // Available only filter
          if (filters.availableOnly && !product.available) {
            return false;
          }

          return true;
        });
      },

      fetchCategories: async () => {
        try {
          const { products } = get();
          const categorySet = new Set<string>();
          
          products.forEach(product => {
            if (product.category) {
              categorySet.add(product.category);
            }
          });

          set({ categories: Array.from(categorySet).sort() });
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      },

      compareProducts: (productIds: string[]) => {
        const { products } = get();
        return products.filter(product => productIds.includes(product.id));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'products-store' }
  )
);
