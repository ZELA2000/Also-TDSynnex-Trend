'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSecurityStore } from '@/lib/stores/securityStore';
import { AlertSeverity, AlertStatus, AlertFilters } from '@/types/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ShieldAlert, 
  Search, 
  Filter,
  AlertTriangle,
  AlertCircle,
  Info,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function AlertsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { alerts, alertsLoading, setAlertFilters, clearAlertFilters } = useSecurityStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Get filters from URL on mount
  useEffect(() => {
    const severity = searchParams.get('severity') as AlertSeverity | null;
    const status = searchParams.get('status') as AlertStatus | null;

    const filters: Partial<AlertFilters> = {};
    if (severity) filters.severity = severity;
    if (status) filters.status = status;

    setAlertFilters(filters);
  }, [searchParams, setAlertFilters]);

  // Get current filters from store
  const alertFilters = useSecurityStore(state => state.alertFilters);

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'open':
        return 'destructive';
      case 'in_progress':
        return 'default';
      case 'closed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4" />;
      case 'low':
        return <Info className="h-4 w-4" />;
    }
  };

  // Apply client-side filtering
  const filteredAlerts = alerts.filter((alert) => {
    // Search filter
    if (searchQuery && !alert.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !alert.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Severity filter
    if (alertFilters.severity && alert.severity !== alertFilters.severity) {
      return false;
    }
    // Status filter
    if (alertFilters.status && alert.status !== alertFilters.status) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...alertFilters };
    if (value === 'all') {
      delete newFilters[key as keyof AlertFilters];
    } else {
      // Type assertion needed because we know the value matches the filter type
      if (key === 'severity') {
        newFilters.severity = value as AlertSeverity;
      } else if (key === 'status') {
        newFilters.status = value as AlertStatus;
      } else if (key === 'startDateTime' || key === 'endDateTime') {
        newFilters[key] = value;
      }
    }
    setAlertFilters(newFilters);
  };

  const handleClearFilters = () => {
    clearAlertFilters();
    setSearchQuery('');
    router.push('/security/alerts');
  };

  const hasActiveFilters = 
    Object.keys(alertFilters).length > 0 || searchQuery !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          Security Alerts
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            Demo Mode: {alerts.length} Alerts
          </Badge>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and investigate XDR security alerts • All data shown is sample demo data
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter alerts by severity, status, or search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Severity Filter */}
            <Select
              value={alertFilters.severity || 'all'}
              onValueChange={(value) => handleFilterChange('severity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={alertFilters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {alertsLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? 'Try adjusting your filters'
                    : 'No security alerts at this time'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredAlerts.length} {filteredAlerts.length === 1 ? 'Alert' : 'Alerts'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => router.push(`/security/alerts/${alert.id}`)}
                    className="p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded ${getSeverityColor(alert.severity)}`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{alert.description}</h4>
                            <Badge 
                              variant="outline" 
                              className={getSeverityColor(alert.severity)}
                            >
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge variant={getStatusColor(alert.status)}>
                              {alert.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>ID: {alert.id}</span>
                            <span>
                              {formatDistanceToNow(new Date(alert.createdDateTime), { addSuffix: true })}
                            </span>
                            {alert.impactScope && alert.impactScope.length > 0 && (
                              <span>
                                {alert.impactScope.length} affected {alert.impactScope.length === 1 ? 'entity' : 'entities'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function AlertsPage() {
  return (
    <ProtectedRoute>
      <AlertsPageContent />
    </ProtectedRoute>
  );
}
