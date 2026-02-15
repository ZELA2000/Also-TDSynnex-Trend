'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { useSecurityStore } from '@/lib/stores/securityStore';
import { AlertStatus } from '@/types/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  FileText,
  Target,
  Activity
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

function AlertDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const alertId = params.id as string;
  
  const { selectedAlert, alertsLoading, fetchAlertById, updateAlertStatus, addAlertNote } = useSecurityStore();
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (alertId) {
      fetchAlertById(alertId);
    }
  }, [alertId, fetchAlertById]);

  const getSeverityColor = (severity: string) => {
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5" />;
      case 'low':
        return <Info className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
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

  const handleStatusChange = async (newStatus: AlertStatus) => {
    setIsUpdating(true);
    try {
      await updateAlertStatus(alertId, newStatus);
      toast.success('Alert status updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update alert status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setIsUpdating(true);
    try {
      await addAlertNote(alertId, note);
      toast.success('Note added successfully');
      setNote('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add note');
    } finally {
      setIsUpdating(false);
    }
  };

  if (alertsLoading || !selectedAlert) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{selectedAlert.description}</h1>
            <Badge 
              variant="outline" 
              className={getSeverityColor(selectedAlert.severity)}
            >
              {selectedAlert.severity.toUpperCase()}
            </Badge>
            <Badge variant={getStatusColor(selectedAlert.status)}>
              {selectedAlert.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              Demo
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Alert ID: {selectedAlert.id} • Sample demo data
          </p>
        </div>
      </div>

      {/* Alert Details Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Alert Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Alert Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded ${getSeverityColor(selectedAlert.severity)}`}>
                {getSeverityIcon(selectedAlert.severity)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Severity</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {selectedAlert.severity}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedAlert.createdDateTime), 'PPpp')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(selectedAlert.createdDateTime), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedAlert.updatedDateTime), 'PPpp')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(selectedAlert.updatedDateTime), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Management */}
        <Card>
          <CardHeader>
            <CardTitle>Status Management</CardTitle>
            <CardDescription>
              Update the alert status and add notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Status</label>
              <Select
                value={selectedAlert.status}
                onValueChange={(value) => handleStatusChange(value as AlertStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Add Note</label>
              <Textarea
                placeholder="Enter investigation notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                disabled={isUpdating}
              />
              <Button
                onClick={handleAddNote}
                disabled={isUpdating || !note.trim()}
                className="w-full"
              >
                Add Note
              </Button>
            </div>

            {/* Demo Mode Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                <strong>Demo Mode:</strong> Status changes update locally. Notes are not persisted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Scope */}
      {selectedAlert.impactScope && selectedAlert.impactScope.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Impact Scope
            </CardTitle>
            <CardDescription>
              Affected entities ({selectedAlert.impactScope.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {selectedAlert.impactScope.map((entity, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-muted/50"
                >
                  <p className="text-sm font-medium capitalize">{entity.entityType}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {entity.entityValue}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicators */}
      {selectedAlert.indicators && selectedAlert.indicators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Indicators of Compromise
            </CardTitle>
            <CardDescription>
              Detected IOCs ({selectedAlert.indicators.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedAlert.indicators.map((indicator, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="capitalize">
                      {indicator.type}
                    </Badge>
                  </div>
                  <p className="text-sm font-mono break-all">
                    {indicator.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AlertDetailPage() {
  return (
    <ProtectedRoute>
      <AlertDetailPageContent />
    </ProtectedRoute>
  );
}
