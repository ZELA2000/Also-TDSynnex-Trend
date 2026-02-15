'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSecurityStore } from '@/lib/stores/securityStore';
import { Endpoint, EndpointStatus } from '@/types/security';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Server, 
  Search, 
  Filter,
  ShieldOff,
  ShieldCheck,
  MonitorX,
  X,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

function EndpointsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { endpoints, endpointsLoading, isolateEndpoint, restoreEndpoint } = useSecurityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EndpointStatus | 'all'>('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [actionDialog, setActionDialog] = useState<'isolate' | 'restore' | null>(null);
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status') as EndpointStatus | null;
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  const getStatusIcon = (status: EndpointStatus) => {
    switch (status) {
      case 'online':
        return <ShieldCheck className="h-4 w-4" />;
      case 'offline':
        return <MonitorX className="h-4 w-4" />;
      case 'isolated':
        return <ShieldOff className="h-4 w-4" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: EndpointStatus) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'isolated':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'disconnected':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      searchQuery === '' ||
      endpoint.endpointName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.agentGuid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.ipAddress.some(ip => ip.includes(searchQuery));

    const matchesStatus = statusFilter === 'all' || endpoint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleIsolate = async () => {
    if (!selectedEndpoint) return;
    
    setIsPerformingAction(true);
    try {
      await isolateEndpoint(selectedEndpoint.agentGuid, 'Isolated via Security Dashboard');
      toast.success(`Endpoint ${selectedEndpoint.endpointName} isolated successfully (Demo Mode)`);
      setActionDialog(null);
      setSelectedEndpoint(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to isolate endpoint');
    } finally {
      setIsPerformingAction(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedEndpoint) return;
    
    setIsPerformingAction(true);
    try {
      await restoreEndpoint(selectedEndpoint.agentGuid);
      toast.success(`Endpoint ${selectedEndpoint.endpointName} restored successfully (Demo Mode)`);
      setActionDialog(null);
      setSelectedEndpoint(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to restore endpoint');
    } finally {
      setIsPerformingAction(false);
    }
  };

  const hasActiveFilters = statusFilter !== 'all' || searchQuery !== '';

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    router.push('/security/endpoints');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          Endpoint Management
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            Demo Mode: {endpoints.length} Endpoints
          </Badge>
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage endpoint security status • All data shown is sample demo data
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
            Filter endpoints by status or search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as EndpointStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="isolated">Isolated</SelectItem>
                <SelectItem value="disconnected">Disconnected</SelectItem>
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

      {/* Endpoints List */}
      <div className="space-y-4">
        {endpointsLoading ? (
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
        ) : filteredEndpoints.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Server className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No endpoints found</h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? 'Try adjusting your filters'
                    : 'No managed endpoints at this time'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredEndpoints.length} {filteredEndpoints.length === 1 ? 'Endpoint' : 'Endpoints'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredEndpoints.map((endpoint) => (
                  <div
                    key={endpoint.agentGuid}
                    className="p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded ${getStatusColor(endpoint.status)}`}>
                          {getStatusIcon(endpoint.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{endpoint.endpointName}</h4>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(endpoint.status)}
                            >
                              {endpoint.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div>
                              <span className="font-medium">OS:</span> {endpoint.osName} {endpoint.osVersion}
                            </div>
                            <div>
                              <span className="font-medium">IP:</span> {endpoint.ipAddress.join(', ')}
                            </div>
                            <div>
                              <span className="font-medium">Agent:</span> {endpoint.agentGuid}
                            </div>
                            {endpoint.lastSeenDateTime && (
                              <div>
                                <span className="font-medium">Last Seen:</span>{' '}
                                {formatDistanceToNow(new Date(endpoint.lastSeenDateTime), { addSuffix: true })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {endpoint.status !== 'isolated' ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedEndpoint(endpoint);
                              setActionDialog('isolate');
                            }}
                          >
                            <ShieldOff className="h-4 w-4 mr-1" />
                            Isolate
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedEndpoint(endpoint);
                              setActionDialog('restore');
                            }}
                          >
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Isolate Confirmation Dialog */}
      <AlertDialog open={actionDialog === 'isolate'} onOpenChange={(open) => !open && setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Isolate Endpoint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to isolate <strong>{selectedEndpoint?.endpointName}</strong>?
              This will disconnect the endpoint from the network.
              <br/><br/>
              <span className="text-blue-600 text-xs">
                <strong>Demo Mode:</strong> Changes will update locally only.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPerformingAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleIsolate}
              disabled={isPerformingAction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPerformingAction ? 'Isolating...' : 'Isolate Endpoint'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={actionDialog === 'restore'} onOpenChange={(open) => !open && setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Endpoint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore network access for <strong>{selectedEndpoint?.endpointName}</strong>?
              <br/><br/>
              <span className="text-blue-600 text-xs">
                <strong>Demo Mode:</strong> Changes will update locally only.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPerformingAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={isPerformingAction}
            >
              {isPerformingAction ? 'Restoring...' : 'Restore Endpoint'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function EndpointsPage() {
  return (
    <ProtectedRoute>
      <EndpointsPageContent />
    </ProtectedRoute>
  );
}
