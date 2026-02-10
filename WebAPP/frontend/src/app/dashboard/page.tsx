'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowUpRight, ArrowDownRight, ShoppingCart, Package, Users, Shield } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalProducts: number;
  totalCustomers: number;
  criticalAlerts: number;
  subscriptionGrowth: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalProducts: 0,
    totalCustomers: 0,
    criticalAlerts: 0,
    subscriptionGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // TODO: Implement /dashboard/stats endpoint
        // For now, use mock data
        setStats({
          totalSubscriptions: 248,
          activeSubscriptions: 231,
          totalProducts: 1420,
          totalCustomers: 89,
          criticalAlerts: 3,
          subscriptionGrowth: 12.5,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const statCards = [
    {
      title: 'Total Subscriptions',
      value: stats.totalSubscriptions,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: stats.subscriptionGrowth,
      changeType: stats.subscriptionGrowth > 0 ? 'increase' : 'decrease',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: 8.2,
      changeType: 'increase',
    },
    {
      title: 'Products Available',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 3.1,
      changeType: 'increase',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: 5.4,
      changeType: 'increase',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-3">
          <UserMenu />
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            New Subscription
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const links = ['/subscriptions', '/subscriptions', '/products', '/customers'];
          return (
            <Link key={index} href={links[index]}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stat.value.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {stat.changeType === 'increase' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}%
                        </span>
                        <span className="text-sm text-gray-600">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Alert Banner */}
      {stats.criticalAlerts > 0 && (
        <Link href="/alerts">
          <Card className="border-l-4 border-l-red-500 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {stats.criticalAlerts} Critical Security Alert{stats.criticalAlerts > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Immediate attention required for security issues detected by Trend Vision One
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                  View Alerts
                </button>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Provider Status Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Also Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              Also Marketplace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Subscriptions</span>
                <span className="font-medium">87</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Sync</span>
                <span className="font-medium">2 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TDSynnex Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              TDSynnex StreamOne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Subscriptions</span>
                <span className="font-medium">144</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Sync</span>
                <span className="font-medium">5 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              Trend Vision One
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Security Alerts</span>
                <span className="font-medium text-red-600">3 Critical</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Endpoints Monitored</span>
                <span className="font-medium">156</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New subscription created', provider: 'Also', time: '5 minutes ago', color: 'bg-blue-500' },
              { action: 'Product catalog updated', provider: 'TDSynnex', time: '12 minutes ago', color: 'bg-purple-500' },
              { action: 'Security alert resolved', provider: 'Trend', time: '23 minutes ago', color: 'bg-red-500' },
              { action: 'Customer account modified', provider: 'Also', time: '1 hour ago', color: 'bg-blue-500' },
              { action: 'Subscription renewed', provider: 'TDSynnex', time: '2 hours ago', color: 'bg-purple-500' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`h-2 w-2 rounded-full ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.provider} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
}
