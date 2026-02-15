'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useSecurityStore } from '@/lib/stores/securityStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldAlert, 
  Server, 
  AlertTriangle,
  ShieldCheck,
  Activity,
  ShieldOff
} from 'lucide-react';
import Link from 'next/link';

function SecurityDashboardContent() {
  const { stats, statsLoading } = useSecurityStore();

  if (statsLoading && stats.totalAlerts === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor XDR alerts and endpoint security status
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
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

  const statCards = [
    {
      title: 'Total Alerts',
      value: stats.totalAlerts,
      description: `${stats.openAlerts} open alerts`,
      icon: ShieldAlert,
      color: 'text-blue-600',
      link: '/security/alerts',
    },
    {
      title: 'Critical Alerts',
      value: stats.criticalAlerts,
      description: 'Require immediate attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      link: '/security/alerts?severity=critical',
    },
    {
      title: 'Total Endpoints',
      value: stats.totalEndpoints,
      description: `${stats.onlineEndpoints} online`,
      icon: Server,
      color: 'text-green-600',
      link: '/security/endpoints',
    },
    {
      title: 'Isolated Endpoints',
      value: stats.isolatedEndpoints,
      description: `${stats.offlineEndpoints} offline`,
      icon: ShieldOff,
      color: 'text-orange-600',
      link: '/security/endpoints?status=isolated',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor XDR alerts and endpoint security status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.link}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Latest security alerts from Trend Vision One
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link 
                href="/security/alerts"
                className="block p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">View All Alerts</span>
                  <Badge variant="secondary">{stats.totalAlerts}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and investigate security alerts
                </p>
              </Link>
              
              {stats.criticalAlerts > 0 && (
                <Link 
                  href="/security/alerts?severity=critical"
                  className="block p-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-900">Critical Alerts</span>
                    <Badge variant="destructive">{stats.criticalAlerts}</Badge>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Require immediate attention
                  </p>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Endpoint Status
            </CardTitle>
            <CardDescription>
              Overview of managed endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link 
                href="/security/endpoints"
                className="block p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">View All Endpoints</span>
                  <Badge variant="secondary">{stats.totalEndpoints}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor and manage endpoint security
                </p>
              </Link>
              
              {stats.isolatedEndpoints > 0 && (
                <Link 
                  href="/security/endpoints?status=isolated"
                  className="block p-4 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-orange-900">Isolated Endpoints</span>
                    <Badge variant="outline" className="bg-orange-200">{stats.isolatedEndpoints}</Badge>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Endpoints currently isolated from network
                  </p>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Detection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Threat Detection
          </CardTitle>
          <CardDescription>
            Advanced threat detection and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link 
              href="/security/alerts"
              className="p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <h4 className="font-medium mb-1">Alert Management</h4>
              <p className="text-sm text-muted-foreground">
                Investigate and respond to security alerts
              </p>
            </Link>
            
            <Link 
              href="/security/endpoints"
              className="p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <h4 className="font-medium mb-1">Endpoint Response</h4>
              <p className="text-sm text-muted-foreground">
                Isolate and restore compromised endpoints
              </p>
            </Link>
            
            <Link 
              href="/security/threats"
              className="p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <h4 className="font-medium mb-1">Threat Intelligence</h4>
              <p className="text-sm text-muted-foreground">
                IOC analysis and lookups
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SecurityDashboard() {
  return (
    <ProtectedRoute>
      <SecurityDashboardContent />
    </ProtectedRoute>
  );
}
