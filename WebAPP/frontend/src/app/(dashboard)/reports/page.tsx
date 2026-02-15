/**
 * Reports page
 * Displays financial reports and usage statistics with charts
 */

'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { useReportsStore } from '@/lib/stores/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw, TrendingUp } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function ReportsContent() {
  const {
    financialReports,
    usageStats,
    financialLoading,
    usageLoading,
    financialError,
    usageError,
    dateRange,
    selectedProvider,
    fetchFinancialReports,
    fetchUsageStatistics,
    setDateRange,
    setSelectedProvider,
    exportToCSV,
  } = useReportsStore();

  const [activeTab, setActiveTab] = useState<'financial' | 'usage'>('financial');
  const { addToast } = useToast();

  useEffect(() => {
    // Fetch initial data
    const { startDate, endDate } = dateRange;
    if (financialReports.length === 0) {
      fetchFinancialReports(selectedProvider, startDate, endDate);
    }
    if (usageStats.length === 0) {
      fetchUsageStatistics(selectedProvider, startDate, endDate);
    }
  }, [dateRange, selectedProvider, fetchFinancialReports, fetchUsageStatistics, financialReports.length, usageStats.length]);

  const handleRefresh = async () => {
    const { startDate, endDate } = dateRange;
    await Promise.all([
      fetchFinancialReports(selectedProvider, startDate, endDate),
      fetchUsageStatistics(selectedProvider, startDate, endDate),
    ]);
    addToast('success', 'Report aggiornati con successo');
  };

  const handleExportCSV = () => {
    if (activeTab === 'financial' && financialReports[0]) {
      const data = financialReports[0].breakdown;
      exportToCSV(data, `financial-report-${selectedProvider}.csv`);
      addToast('success', 'Report esportato in CSV');
    } else if (activeTab === 'usage' && usageStats[0]) {
      const data = usageStats[0].dailyData;
      exportToCSV(data, `usage-report-${selectedProvider}.csv`);
      addToast('success', 'Report esportato in CSV');
    }
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const { startDate, endDate } = dateRange;
    if (type === 'start') {
      const newStart = value;
      if (new Date(newStart) <= new Date(endDate)) {
        setDateRange(newStart, endDate);
      }
    } else {
      const newEnd = value;
      if (new Date(startDate) <= new Date(newEnd)) {
        setDateRange(startDate, newEnd);
      }
    }
  };

  // Loading state for Financial Reports
  if (financialLoading && financialReports.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report e Analytics</h1>
            <p className="text-muted-foreground mt-2">Visualizza report finanziari e statistiche di utilizzo</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            Live
          </Badge>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report e Analytics</h1>
          <p className="text-muted-foreground mt-2">Visualizza report finanziari e statistiche di utilizzo</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            Live
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={financialLoading || usageLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
          <Button
            size="sm"
            onClick={handleExportCSV}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Esporta CSV
          </Button>
          <UserMenu />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Provider</label>
              <Select value={selectedProvider} onValueChange={(value: 'also' | 'tdsynnex' | 'trend' | 'all') => setSelectedProvider(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="also">Also</SelectItem>
                  <SelectItem value="tdsynnex">TDSynnex</SelectItem>
                  <SelectItem value="trend">Trend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Data Inizio</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data Fine</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'financial'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Report Finanziari
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'usage'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Statistiche di Utilizzo
        </button>
      </div>

      {/* Financial Reports Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {financialError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {financialError}
            </div>
          )}

          {financialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : financialReports.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Ricavi Totali</CardTitle>
                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{financialReports[0].totalRevenue?.toLocaleString('it-IT') || '0'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Questo periodo</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Spese Totali</CardTitle>
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{financialReports[0].totalExpenses?.toLocaleString('it-IT') || '0'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Questo periodo</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Utile Netto</CardTitle>
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      €{financialReports[0].netProfit?.toLocaleString('it-IT') || '0'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Questo periodo</p>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Ricavi e Spese nel Tempo</CardTitle>
                  <CardDescription>Analisi giornaliera dei ricavi e delle spese</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={financialReports[0]?.breakdown || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        formatter={(value) => `€${value}`}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#4f46e5" name="Ricavi" strokeWidth={2} />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Spese" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Profit Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Utile Netto nel Tempo</CardTitle>
                  <CardDescription>Andamento della redditività</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialReports[0]?.breakdown || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        formatter={(value) => `€${value}`}
                      />
                      <Legend />
                      <Bar dataKey="profit" fill="#10b981" name="Utile Netto" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Nessun dato disponibile per questo periodo</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Usage Statistics Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          {usageError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {usageError}
            </div>
          )}

          {usageLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : usageStats.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Richieste Totali</CardTitle>
                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {usageStats[0]?.totalRequests?.toLocaleString('it-IT') || '0'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Questo periodo</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Utenti Attivi</CardTitle>
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {usageStats[0]?.activeUsers?.toLocaleString('it-IT') || '0'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Utenti unici</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Richieste Medie/Giorno</CardTitle>
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {usageStats[0]?.dailyData?.length
                        ? Math.round(usageStats[0].totalRequests / usageStats[0].dailyData.length)
                        : 0}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Media giornaliera</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Prodotti Top 3</CardTitle>
                  <CardDescription>I prodotti più utilizzati</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={usageStats[0]?.topProducts || []}
                        dataKey="count"
                        nameKey="productName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Daily Requests Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Richieste Giornaliere</CardTitle>
                  <CardDescription>Tendenza delle richieste nel tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={usageStats[0]?.dailyData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#4f46e5"
                        name="Richieste"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Hourly Requests Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Richieste Orarie (Oggi)</CardTitle>
                  <CardDescription>Distribuzione oraria delle richieste</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageStats[0]?.hourlyData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="requests" fill="#4f46e5" name="Richieste" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Nessun dato disponibile per questo periodo</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsContent />
    </ProtectedRoute>
  );
}


