/**
 * Reports store using Zustand
 * Manages financial reports, usage statistics, and export functionality
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiClient } from '../api-client';

export interface FinancialReport {
  id: string;
  period: string;
  provider: 'also' | 'tdsynnex' | 'trend' | 'all';
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  currency: string;
  breakdown: {
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

export interface UsageStatistics {
  id: string;
  period: string;
  provider: 'also' | 'tdsynnex' | 'trend' | 'all';
  totalRequests: number;
  activeUsers: number;
  topProducts: {
    productId: string;
    productName: string;
    count: number;
    revenue: number;
  }[];
  hourlyData: {
    hour: string;
    requests: number;
    users: number;
  }[];
  dailyData: {
    date: string;
    requests: number;
    users: number;
  }[];
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

interface ReportsState {
  // Financial Reports
  financialReports: FinancialReport[];
  selectedReport: FinancialReport | null;
  financialLoading: boolean;
  financialError: string | null;

  // Usage Statistics
  usageStats: UsageStatistics[];
  selectedStats: UsageStatistics | null;
  usageLoading: boolean;
  usageError: string | null;

  // Filters
  dateRange: {
    startDate: string;
    endDate: string;
  };
  selectedProvider: 'also' | 'tdsynnex' | 'trend' | 'all';

  // Actions
  fetchFinancialReports: (provider: string, startDate: string, endDate: string) => Promise<void>;
  fetchUsageStatistics: (provider: string, startDate: string, endDate: string) => Promise<void>;
  setSelectedReport: (report: FinancialReport | null) => void;
  setSelectedStats: (stats: UsageStatistics | null) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  setSelectedProvider: (provider: 'also' | 'tdsynnex' | 'trend' | 'all') => void;
  exportToCSV: (data: Record<string, unknown>[], filename: string) => void;
  exportToPDF: (filename: string) => void;
  reset: () => void;
}

const initialState = {
  financialReports: [],
  selectedReport: null,
  financialLoading: false,
  financialError: null,
  usageStats: [],
  selectedStats: null,
  usageLoading: false,
  usageError: null,
  dateRange: {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
  selectedProvider: 'all' as const,
};

export const useReportsStore = create<ReportsState>()(
  devtools((set) => {
    // Mock data per demo
    const mockFinancialReports: FinancialReport[] = [
      {
        id: '1',
        period: `${new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}`,
        provider: 'all',
        totalRevenue: 285000,
        totalExpenses: 185000,
        netProfit: 100000,
        currency: 'EUR',
        breakdown: [
          { date: '2026-01-16', revenue: 8500, expenses: 5200, profit: 3300 },
          { date: '2026-01-17', revenue: 9200, expenses: 5800, profit: 3400 },
          { date: '2026-01-18', revenue: 7800, expenses: 5000, profit: 2800 },
          { date: '2026-01-19', revenue: 9700, expenses: 6200, profit: 3500 },
          { date: '2026-01-20', revenue: 10200, expenses: 6500, profit: 3700 },
          { date: '2026-01-21', revenue: 8900, expenses: 5600, profit: 3300 },
          { date: '2026-01-22', revenue: 9500, expenses: 6000, profit: 3500 },
          { date: '2026-01-23', revenue: 10100, expenses: 6300, profit: 3800 },
          { date: '2026-01-24', revenue: 9300, expenses: 5900, profit: 3400 },
          { date: '2026-01-25', revenue: 10500, expenses: 6600, profit: 3900 },
          { date: '2026-01-26', revenue: 9800, expenses: 6100, profit: 3700 },
          { date: '2026-01-27', revenue: 10600, expenses: 6700, profit: 3900 },
          { date: '2026-01-28', revenue: 9100, expenses: 5700, profit: 3400 },
          { date: '2026-01-29', revenue: 10400, expenses: 6500, profit: 3900 },
          { date: '2026-01-30', revenue: 9900, expenses: 6200, profit: 3700 },
        ],
      },
    ];

    const mockUsageStats: UsageStatistics[] = [
      {
        id: '1',
        period: `${new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}`,
        provider: 'all',
        totalRequests: 245670,
        activeUsers: 567,
        topProducts: [
          {
            productId: 'prod_1',
            productName: 'Cloud Security Suite',
            count: 78900,
            revenue: 145000,
          },
          {
            productId: 'prod_2',
            productName: 'Advanced Threat Protection',
            count: 62340,
            revenue: 98000,
          },
          {
            productId: 'prod_3',
            productName: 'Compliance Manager',
            count: 41200,
            revenue: 80000,
          },
          {
            productId: 'prod_4',
            productName: 'Data Protection',
            count: 35230,
            revenue: 62000,
          },
          {
            productId: 'prod_5',
            productName: 'Identity & Access',
            count: 28000,
            revenue: 45000,
          },
        ],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i.toString().padStart(2, '0')}:00`,
          requests: Math.floor(Math.random() * 2000) + 500,
          users: Math.floor(Math.random() * 100) + 10,
        })),
        dailyData: [
          { date: '2026-01-16', requests: 18900, users: 234 },
          { date: '2026-01-17', requests: 19200, users: 245 },
          { date: '2026-01-18', requests: 17800, users: 223 },
          { date: '2026-01-19', requests: 19700, users: 256 },
          { date: '2026-01-20', requests: 20200, users: 267 },
          { date: '2026-01-21', requests: 18900, users: 243 },
          { date: '2026-01-22', requests: 19500, users: 254 },
          { date: '2026-01-23', requests: 20100, users: 265 },
          { date: '2026-01-24', requests: 19300, users: 249 },
          { date: '2026-01-25', requests: 20500, users: 273 },
          { date: '2026-01-26', requests: 19800, users: 261 },
          { date: '2026-01-27', requests: 20600, users: 275 },
          { date: '2026-01-28', requests: 19100, users: 251 },
          { date: '2026-01-29', requests: 20400, users: 270 },
          { date: '2026-01-30', requests: 19900, users: 262 },
        ],
      },
    ];

    return {
      ...initialState,
      financialReports: mockFinancialReports,
      usageStats: mockUsageStats,

      fetchFinancialReports: async (provider: string, startDate: string, endDate: string) => {
        set({ financialLoading: true, financialError: null });
        try {
          const response = await apiClient.get('/reports/financial', {
            params: {
              provider,
              startDate,
              endDate,
            },
          });
          const data = (response.data as { data?: FinancialReport[] }).data || [];
          set({ financialReports: data });
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Errore nel caricamento dei report finanziari';
          set({ financialError: errorMessage });
          console.error('Error fetching financial reports:', error);
        } finally {
          set({ financialLoading: false });
        }
      },

    fetchUsageStatistics: async (provider: string, startDate: string, endDate: string) => {
      set({ usageLoading: true, usageError: null });
      try {
        const response = await apiClient.get('/reports/usage', {
          params: {
            provider,
            startDate,
            endDate,
          },
        });
        const data = (response.data as { data?: UsageStatistics[] }).data || [];
        set({ usageStats: data });
      } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Errore nel caricamento delle statistiche di utilizzo';
        set({ usageError: errorMessage });
        console.error('Error fetching usage statistics:', error);
      } finally {
        set({ usageLoading: false });
      }
    },

    setSelectedReport: (report: FinancialReport | null) => {
      set({ selectedReport: report });
    },

    setSelectedStats: (stats: UsageStatistics | null) => {
      set({ selectedStats: stats });
    },

    setDateRange: (startDate: string, endDate: string) => {
      set({
        dateRange: { startDate, endDate },
      });
    },

    setSelectedProvider: (provider: 'also' | 'tdsynnex' | 'trend' | 'all') => {
      set({ selectedProvider: provider });
    },

    exportToCSV: (data: Record<string, unknown>[], filename: string) => {
      try {
        const csv = convertToCSV(data);
        downloadFile(csv, filename, 'text/csv');
      } catch (error) {
        console.error('Error exporting to CSV:', error);
        set({ financialError: 'Errore nell\'esportazione CSV' });
      }
    },

    exportToPDF: (filename: string) => {
      try {
        // PDF export function would go here
        console.log(`PDF export to ${filename} not fully implemented yet`);
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        set({ financialError: 'Errore nell\'esportazione PDF' });
      }
    },

      reset: () => {
        set(initialState);
      },
    };
  })
);

// Helper functions
function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
