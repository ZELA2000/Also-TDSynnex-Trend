'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserMenu } from '@/components/auth/UserMenu';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SecurityAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  status: 'open' | 'acknowledged' | 'resolved';
  affectedEndpoints: string[];
}

const mockAlerts: SecurityAlert[] = [
  {
    id: 'ALT-001',
    severity: 'critical',
    title: 'Ransomware Activity Detected',
    description: 'Suspicious encryption activity detected on multiple endpoints',
    timestamp: '2026-02-10T09:15:00Z',
    status: 'open',
    affectedEndpoints: ['WS-FINANCE-01', 'WS-HR-03'],
  },
  {
    id: 'ALT-002',
    severity: 'high',
    title: 'Unauthorized Access Attempt',
    description: 'Multiple failed login attempts from unusual location',
    timestamp: '2026-02-10T08:30:00Z',
    status: 'acknowledged',
    affectedEndpoints: ['SRV-DB-01'],
  },
  {
    id: 'ALT-003',
    severity: 'medium',
    title: 'Outdated Security Patch',
    description: 'Critical security updates are pending on 15 endpoints',
    timestamp: '2026-02-09T14:20:00Z',
    status: 'open',
    affectedEndpoints: ['Various'],
  },
  {
    id: 'ALT-004',
    severity: 'low',
    title: 'USB Device Connected',
    description: 'Unrecognized USB device connected to workstation',
    timestamp: '2026-02-09T11:45:00Z',
    status: 'resolved',
    affectedEndpoints: ['WS-DEV-07'],
  },
  {
    id: 'ALT-005',
    severity: 'high',
    title: 'Malware Quarantined',
    description: 'Trojan detected and quarantined successfully',
    timestamp: '2026-02-08T16:00:00Z',
    status: 'resolved',
    affectedEndpoints: ['WS-SALES-02'],
  },
];

export default function AlertsPage() {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'acknowledged':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const stats = {
    total: mockAlerts.length,
    open: mockAlerts.filter((a) => a.status === 'open').length,
    critical: mockAlerts.filter((a) => a.severity === 'critical' && a.status === 'open').length,
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security Alerts</h1>
            <p className="text-gray-600 mt-1">Monitor and manage security threats from Trend Vision One</p>
          </div>
          <UserMenu />
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Open Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${getSeverityBorder(alert.severity)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {getStatusIcon(alert.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{alert.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">Alert ID:</span> 
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{alert.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">Time:</span>
                        <span>{new Date(alert.timestamp).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">Endpoints:</span>
                        <span className="truncate">{alert.affectedEndpoints.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {alert.status === 'open' && (
                      <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Acknowledge
                      </button>
                    )}
                    {alert.status === 'acknowledged' && (
                      <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                        Resolve
                      </button>
                    )}
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Details
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
