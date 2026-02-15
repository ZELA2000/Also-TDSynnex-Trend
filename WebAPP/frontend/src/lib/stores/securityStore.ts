/**
 * Security Store
 * Zustand store for managing Trend Vision One security data
 */

import { create } from 'zustand';
import {
  Alert,
  AlertFilters,
  Endpoint,
  SecurityStats,
  AlertStatus,
  ThreatDetection,
  AlertsListResponse,
  EndpointsListResponse,
  IOCDetails,
  IOCType,
} from '@/types/security';
import { apiClient } from '@/lib/api/client';

// API Response types
interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

// ==================== MOCK DATA ====================

const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-001',
    severity: 'critical',
    status: 'open',
    createdDateTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedDateTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    description: 'Ransomware activity detected on multiple endpoints',
    impactScope: [
      { entityType: 'endpoint', entityValue: 'DESKTOP-ABC123' },
      { entityType: 'endpoint', entityValue: 'LAPTOP-XYZ789' },
      { entityType: 'user', entityValue: 'john.doe@company.com' },
    ],
    indicators: [
      { type: 'hash', value: 'a1b2c3d4e5f6...' },
      { type: 'ip', value: '192.168.1.100' },
    ],
  },
  {
    id: 'alert-002',
    severity: 'high',
    status: 'in_progress',
    createdDateTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedDateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    description: 'Suspicious PowerShell execution detected',
    impactScope: [
      { entityType: 'endpoint', entityValue: 'SERVER-PROD-01' },
    ],
    indicators: [
      { type: 'hash', value: 'f7e8d9c0b1a2...' },
    ],
  },
  {
    id: 'alert-003',
    severity: 'critical',
    status: 'open',
    createdDateTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedDateTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: 'Data exfiltration attempt to external IP',
    impactScope: [
      { entityType: 'endpoint', entityValue: 'WORKSTATION-DEV-05' },
      { entityType: 'user', entityValue: 'sarah.smith@company.com' },
    ],
    indicators: [
      { type: 'ip', value: '203.0.113.42' },
      { type: 'domain', value: 'suspicious-domain.xyz' },
    ],
  },
  {
    id: 'alert-004',
    severity: 'high',
    status: 'open',
    createdDateTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedDateTime: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    description: 'Malicious email attachment opened',
    impactScope: [
      { entityType: 'user', entityValue: 'mike.johnson@company.com' },
    ],
    indicators: [
      { type: 'email', value: 'phishing@malicious.com' },
      { type: 'hash', value: 'b3c4d5e6f7a8...' },
    ],
  },
  {
    id: 'alert-005',
    severity: 'medium',
    status: 'in_progress',
    createdDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedDateTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    description: 'Unauthorized access attempt to shared folder',
    impactScope: [
      { entityType: 'endpoint', entityValue: 'FILE-SERVER-02' },
    ],
    indicators: [
      { type: 'ip', value: '10.0.2.150' },
    ],
  },
  {
    id: 'alert-006',
    severity: 'medium',
    status: 'closed',
    createdDateTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description: 'Unusual login pattern detected',
    impactScope: [
      { entityType: 'user', entityValue: 'admin@company.com' },
    ],
    indicators: [
      { type: 'ip', value: '198.51.100.25' },
    ],
  },
  {
    id: 'alert-007',
    severity: 'low',
    status: 'closed',
    createdDateTime: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedDateTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    description: 'Outdated software version detected',
    impactScope: [
      { entityType: 'endpoint', entityValue: 'DESKTOP-OLD-WIN7' },
    ],
  },
  {
    id: 'alert-008',
    severity: 'low',
    status: 'open',
    createdDateTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedDateTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    description: 'Failed login attempts from known location',
    impactScope: [
      { entityType: 'user', entityValue: 'test.user@company.com' },
    ],
  },
];

const MOCK_ENDPOINTS: Endpoint[] = [
  {
    agentGuid: 'endpoint-001',
    endpointName: 'DESKTOP-ABC123',
    ipAddress: ['192.168.1.100', '10.0.0.5'],
    osName: 'Windows 11 Pro',
    osVersion: '22H2',
    productCode: 'sao',
    status: 'online',
    macAddress: ['00:1A:2B:3C:4D:5E'],
    lastSeenDateTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-002',
    endpointName: 'LAPTOP-XYZ789',
    ipAddress: ['192.168.1.105'],
    osName: 'Windows 10 Enterprise',
    osVersion: '21H2',
    productCode: 'sao',
    status: 'isolated',
    macAddress: ['00:1A:2B:3C:4D:5F'],
    lastSeenDateTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-003',
    endpointName: 'SERVER-PROD-01',
    ipAddress: ['10.0.1.50', '172.16.0.10'],
    osName: 'Windows Server 2022',
    osVersion: '21H2',
    productCode: 'sds',
    status: 'online',
    macAddress: ['00:1A:2B:3C:4D:60'],
    lastSeenDateTime: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-004',
    endpointName: 'WORKSTATION-DEV-05',
    ipAddress: ['192.168.2.25'],
    osName: 'Ubuntu 22.04 LTS',
    osVersion: '22.04',
    productCode: 'sao',
    status: 'online',
    macAddress: ['00:1A:2B:3C:4D:61'],
    lastSeenDateTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-005',
    endpointName: 'FILE-SERVER-02',
    ipAddress: ['10.0.1.100'],
    osName: 'Windows Server 2019',
    osVersion: '1809',
    productCode: 'sds',
    status: 'online',
    macAddress: ['00:1A:2B:3C:4D:62'],
    lastSeenDateTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-006',
    endpointName: 'MACBOOK-SALES-03',
    ipAddress: ['192.168.1.150'],
    osName: 'macOS Sonoma',
    osVersion: '14.2',
    productCode: 'sao',
    status: 'offline',
    macAddress: ['00:1A:2B:3C:4D:63'],
    lastSeenDateTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-007',
    endpointName: 'DESKTOP-OLD-WIN7',
    ipAddress: ['192.168.3.50'],
    osName: 'Windows 7 Professional',
    osVersion: 'SP1',
    productCode: 'sao',
    status: 'disconnected',
    macAddress: ['00:1A:2B:3C:4D:64'],
    lastSeenDateTime: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-008',
    endpointName: 'LAPTOP-MOBILE-12',
    ipAddress: ['192.168.1.200'],
    osName: 'Windows 11 Pro',
    osVersion: '23H2',
    productCode: 'sao',
    status: 'online',
    macAddress: ['00:1A:2B:3C:4D:65'],
    lastSeenDateTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-009',
    endpointName: 'VM-TEST-CENTOS',
    ipAddress: ['10.0.2.100'],
    osName: 'CentOS Linux 8',
    osVersion: '8.5',
    productCode: 'sds',
    status: 'online',
    macAddress: ['00:1A:2B:3C:4D:66'],
    lastSeenDateTime: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  },
  {
    agentGuid: 'endpoint-010',
    endpointName: 'TABLET-FIELD-07',
    ipAddress: ['192.168.1.175'],
    osName: 'Windows 10 IoT',
    osVersion: '21H2',
    productCode: 'sao',
    status: 'offline',
    macAddress: ['00:1A:2B:3C:4D:67'],
    lastSeenDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock IOC database
const MOCK_IOCS: IOCDetails[] = [
  {
    id: 'ioc-001',
    type: 'ip',
    value: '203.0.113.42',
    severity: 'critical',
    reputation: 'malicious',
    riskScore: 95,
    threatType: 'c2',
    firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    occurrences: 47,
    sources: ['Trend Micro', 'VirusTotal', 'AbuseIPDB'],
    tags: ['command-and-control', 'botnet', 'data-exfiltration'],
    relatedAlerts: ['alert-003'],
    relatedEndpoints: ['endpoint-004'],
    geoLocation: {
      country: 'Unknown',
      city: 'Unknown',
    },
  },
  {
    id: 'ioc-002',
    type: 'domain',
    value: 'suspicious-domain.xyz',
    severity: 'high',
    reputation: 'malicious',
    riskScore: 88,
    threatType: 'phishing',
    firstSeen: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    occurrences: 23,
    sources: ['Trend Micro', 'PhishTank'],
    tags: ['phishing', 'credential-theft'],
    relatedAlerts: ['alert-003'],
    relatedEndpoints: ['endpoint-004'],
    whois: {
      registrar: 'Suspicious Registrar Inc.',
      registrationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: 'ioc-003',
    type: 'fileSha256',
    value: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    severity: 'critical',
    reputation: 'malicious',
    riskScore: 98,
    threatType: 'ransomware',
    firstSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    occurrences: 12,
    sources: ['Trend Micro', 'VirusTotal'],
    tags: ['ransomware', 'encryption', 'lockbit'],
    relatedAlerts: ['alert-001'],
    relatedEndpoints: ['endpoint-001', 'endpoint-002'],
  },
  {
    id: 'ioc-004',
    type: 'email',
    value: 'phishing@malicious.com',
    severity: 'high',
    reputation: 'malicious',
    riskScore: 85,
    threatType: 'phishing',
    firstSeen: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    occurrences: 8,
    sources: ['Trend Micro Email Security'],
    tags: ['phishing', 'spear-phishing', 'malware-delivery'],
    relatedAlerts: ['alert-004'],
    relatedEndpoints: [],
  },
  {
    id: 'ioc-005',
    type: 'ip',
    value: '192.168.1.100',
    severity: 'medium',
    reputation: 'suspicious',
    riskScore: 65,
    threatType: 'suspicious',
    firstSeen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    occurrences: 15,
    sources: ['Internal Detection'],
    tags: ['internal-scan', 'lateral-movement'],
    relatedAlerts: ['alert-001'],
    relatedEndpoints: ['endpoint-001'],
    geoLocation: {
      country: 'Internal Network',
    },
  },
  {
    id: 'ioc-006',
    type: 'url',
    value: 'https://malicious-site.example/payload.exe',
    severity: 'critical',
    reputation: 'malicious',
    riskScore: 92,
    threatType: 'malware',
    firstSeen: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    occurrences: 31,
    sources: ['Trend Micro Web Security', 'URLhaus'],
    tags: ['malware-distribution', 'trojan', 'drive-by-download'],
    relatedAlerts: ['alert-002'],
    relatedEndpoints: ['endpoint-003'],
  },
  {
    id: 'ioc-007',
    type: 'fileSha1',
    value: 'f7e8d9c0b1a2f7e8d9c0b1a2f7e8d9c0b1a2f7e8',
    severity: 'high',
    reputation: 'malicious',
    riskScore: 87,
    threatType: 'exploit',
    firstSeen: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    occurrences: 19,
    sources: ['Trend Micro', 'MITRE ATT&CK'],
    tags: ['powershell', 'privilege-escalation', 'persistence'],
    relatedAlerts: ['alert-002'],
    relatedEndpoints: ['endpoint-003'],
  },
];

const calculateMockStats = (): SecurityStats => {
  return {
    totalAlerts: MOCK_ALERTS.length,
    criticalAlerts: MOCK_ALERTS.filter(a => a.severity === 'critical').length,
    openAlerts: MOCK_ALERTS.filter(a => a.status === 'open').length,
    totalEndpoints: MOCK_ENDPOINTS.length,
    onlineEndpoints: MOCK_ENDPOINTS.filter(e => e.status === 'online').length,
    isolatedEndpoints: MOCK_ENDPOINTS.filter(e => e.status === 'isolated').length,
    offlineEndpoints: MOCK_ENDPOINTS.filter(e => e.status === 'offline').length,
  };
};

// Export for potential use in other components
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _mockStats = calculateMockStats();

// ==================== END MOCK DATA ====================

interface SecurityState {
  // Alerts
  alerts: Alert[];
  selectedAlert: Alert | null;
  alertsLoading: boolean;
  alertsError: string | null;
  alertFilters: AlertFilters;

  // Endpoints
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  endpointsLoading: boolean;
  endpointsError: string | null;

  // Stats
  stats: SecurityStats;
  statsLoading: boolean;

  // Threats
  threats: ThreatDetection[];
  threatsLoading: boolean;

  // IOCs (Indicators of Compromise)
  iocs: IOCDetails[];
  selectedIOC: IOCDetails | null;
  iocsLoading: boolean;
  iocsError: string | null;

  // Actions - Alerts
  fetchAlerts: (filters?: AlertFilters) => Promise<void>;
  fetchAlertById: (id: string) => Promise<void>;
  updateAlertStatus: (id: string, status: AlertStatus) => Promise<void>;
  addAlertNote: (id: string, content: string) => Promise<void>;
  setAlertFilters: (filters: AlertFilters) => void;
  clearAlertFilters: () => void;

  // Actions - Endpoints
  fetchEndpoints: () => Promise<void>;
  fetchEndpointById: (agentGuid: string) => Promise<void>;
  isolateEndpoint: (agentGuid: string, description?: string) => Promise<void>;
  restoreEndpoint: (agentGuid: string) => Promise<void>;

  // Actions - Stats
  fetchStats: () => Promise<void>;

  // Actions - IOC
  searchIOC: (type: IOCType, value: string) => Promise<IOCDetails | null>;
  fetchAllIOCs: () => Promise<void>;
  clearSelectedIOC: () => void;

  // Reset
  reset: () => void;
}

const initialState = {
  alerts: MOCK_ALERTS,
  selectedAlert: null,
  alertsLoading: false,
  alertsError: null,
  alertFilters: {},

  endpoints: MOCK_ENDPOINTS,
  selectedEndpoint: null,
  endpointsLoading: false,
  endpointsError: null,

  stats: {
    totalAlerts: MOCK_ALERTS.length,
    criticalAlerts: MOCK_ALERTS.filter(a => a.severity === 'critical').length,
    openAlerts: MOCK_ALERTS.filter(a => a.status === 'open').length,
    totalEndpoints: MOCK_ENDPOINTS.length,
    onlineEndpoints: MOCK_ENDPOINTS.filter(e => e.status === 'online').length,
    isolatedEndpoints: MOCK_ENDPOINTS.filter(e => e.status === 'isolated').length,
    offlineEndpoints: MOCK_ENDPOINTS.filter(e => e.status === 'offline').length,
  },
  statsLoading: false,

  threats: [],
  threatsLoading: false,

  iocs: MOCK_IOCS,
  selectedIOC: null,
  iocsLoading: false,
  iocsError: null,
};

export const useSecurityStore = create<SecurityState>((set, get) => ({
  ...initialState,

  // Fetch alerts
  fetchAlerts: async (filters?: AlertFilters) => {
    set({ alertsLoading: true, alertsError: null });
    try {
      const params = filters || get().alertFilters;
      const response = await apiClient.get('/trend/alerts', { params });
      const data = response.data as ApiResponse<AlertsListResponse>;
      
      if (data.success) {
        set({ 
          alerts: data.data.items || [],
          alertsLoading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch alerts');
      }
    } catch {
      console.warn('API not available, using mock alerts data');
      
      // Apply filters to mock data
      const params = filters || get().alertFilters;
      let filteredAlerts = [...MOCK_ALERTS];
      
      if (params.severity) {
        filteredAlerts = filteredAlerts.filter(a => a.severity === params.severity);
      }
      if (params.status) {
        filteredAlerts = filteredAlerts.filter(a => a.status === params.status);
      }
      if (params.startDateTime) {
        filteredAlerts = filteredAlerts.filter(
          a => new Date(a.createdDateTime) >= new Date(params.startDateTime!)
        );
      }
      if (params.endDateTime) {
        filteredAlerts = filteredAlerts.filter(
          a => new Date(a.createdDateTime) <= new Date(params.endDateTime!)
        );
      }
      
      set({
        alerts: filteredAlerts,
        alertsLoading: false,
        alertsError: null,
      });
    }
  },

  // Fetch alert by ID
  fetchAlertById: async (id: string) => {
    set({ alertsLoading: true, alertsError: null });
    try {
      const response = await apiClient.get(`/trend/alerts/${id}`);
      const data = response.data as ApiResponse<Alert>;
      
      if (data.success) {
        set({ 
          selectedAlert: data.data,
          alertsLoading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch alert');
      }
    } catch {
      console.warn('API not available, using mock alert data');
      const alert = MOCK_ALERTS.find(a => a.id === id);
      set({
        selectedAlert: alert || null,
        alertsLoading: false,
        alertsError: alert ? null : 'Alert not found',
      });
    }
  },

  // Update alert status
  updateAlertStatus: async (id: string, status: AlertStatus) => {
    try {
      const response = await apiClient.patch(`/trend/alerts/${id}`, { status });
      const data = response.data as ApiResponse;
      
      if (data.success) {
        // Update local state
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, status } : alert
          ),
          selectedAlert: state.selectedAlert?.id === id
            ? { ...state.selectedAlert, status }
            : state.selectedAlert,
        }));
      } else {
        throw new Error(data.message || 'Failed to update alert');
      }
    } catch {
      console.warn('API not available, updating mock data locally');
      // Update mock data locally (demo mode)
      set((state) => ({
        alerts: state.alerts.map((alert) =>
          alert.id === id ? { ...alert, status, updatedDateTime: new Date().toISOString() } : alert
        ),
        selectedAlert: state.selectedAlert?.id === id
          ? { ...state.selectedAlert, status, updatedDateTime: new Date().toISOString() }
          : state.selectedAlert,
      }));
    }
  },

  // Add note to alert
  addAlertNote: async (id: string, content: string) => {
    try {
      const response = await apiClient.post(`/trend/alerts/${id}/notes`, { content });
      const data = response.data as ApiResponse;
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to add note');
      }
    } catch {
      console.warn('API not available, note not persisted (demo mode');
      // In demo mode, notes are not persisted but we don't throw error
    }
  },

  // Set alert filters
  setAlertFilters: (filters: AlertFilters) => {
    set({ alertFilters: filters });
  },

  // Clear alert filters
  clearAlertFilters: () => {
    set({ alertFilters: {} });
  },

  // Fetch endpoints
  fetchEndpoints: async () => {
    set({ endpointsLoading: true, endpointsError: null });
    try {
      const response = await apiClient.get('/trend/endpoints');
      const data = response.data as ApiResponse<EndpointsListResponse>;
      
      if (data.success) {
        set({ 
          endpoints: data.data.items || [],
          endpointsLoading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch endpoints');
      }
    } catch {
      console.warn('API not available, using mock endpoints data');
      set({
        endpoints: MOCK_ENDPOINTS,
        endpointsLoading: false,
        endpointsError: null,
      });
    }
  },

  // Fetch endpoint by ID
  fetchEndpointById: async (agentGuid: string) => {
    set({ endpointsLoading: true, endpointsError: null });
    try {
      const response = await apiClient.get('/trend/endpoints');
      const data = response.data as ApiResponse<EndpointsListResponse>;
      
      if (data.success) {
        const endpoint = data.data.items?.find(
          (e: Endpoint) => e.agentGuid === agentGuid
        );
        set({ 
          selectedEndpoint: endpoint || null,
          endpointsLoading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch endpoint');
      }
    } catch {
      console.warn('API not available, using mock endpoint data');
      const endpoint = MOCK_ENDPOINTS.find(e => e.agentGuid === agentGuid);
      set({
        selectedEndpoint: endpoint || null,
        endpointsLoading: false,
        endpointsError: endpoint ? null : 'Endpoint not found',
      });
    }
  },

  // Isolate endpoint
  isolateEndpoint: async (agentGuid: string, description?: string) => {
    try {
      const response = await apiClient.post('/trend/endpoints/isolate', {
        agentGuid,
        description,
      });
      const data = response.data as ApiResponse;
      
      if (data.success) {
        // Update local state
        set((state) => ({
          endpoints: state.endpoints.map((endpoint) =>
            endpoint.agentGuid === agentGuid
              ? { ...endpoint, status: 'isolated' as const }
              : endpoint
          ),
        }));
      } else {
        throw new Error(data.message || 'Failed to isolate endpoint');
      }
    } catch {
      console.warn('API not available, updating mock data locally');
      // Update mock data locally (demo mode)
      set((state) => ({
        endpoints: state.endpoints.map((endpoint) =>
          endpoint.agentGuid === agentGuid
            ? { ...endpoint, status: 'isolated' as const }
            : endpoint
        ),
      }));
    }
  },

  // Restore endpoint
  restoreEndpoint: async (agentGuid: string) => {
    try {
      const response = await apiClient.post('/trend/endpoints/restore', {
        agentGuid,
      });
      const data = response.data as ApiResponse;
      
      if (data.success) {
        // Update local state
        set((state) => ({
          endpoints: state.endpoints.map((endpoint) =>
            endpoint.agentGuid === agentGuid
              ? { ...endpoint, status: 'online' as const }
              : endpoint
          ),
        }));
      } else {
        throw new Error(data.message || 'Failed to restore endpoint');
      }
    } catch {
      console.warn('API not available, updating mock data locally');
      // Update mock data locally (demo mode)
      set((state) => ({
        endpoints: state.endpoints.map((endpoint) =>
          endpoint.agentGuid === agentGuid
            ? { ...endpoint, status: 'online' as const }
            : endpoint
        ),
      }));
    }
  },

  // Fetch security stats
  fetchStats: async () => {
    set({ statsLoading: true });
    try {
      // Fetch alerts and endpoints in parallel
      const [alertsRes, endpointsRes] = await Promise.all([
        apiClient.get('/trend/alerts'),
        apiClient.get('/trend/endpoints'),
      ]);

      const alertsData = alertsRes.data as ApiResponse<AlertsListResponse>;
      const endpointsData = endpointsRes.data as ApiResponse<EndpointsListResponse>;

      if (alertsData.success && endpointsData.success) {
        const alerts = alertsData.data.items || [];
        const endpoints = endpointsData.data.items || [];

        const stats: SecurityStats = {
          totalAlerts: alerts.length,
          criticalAlerts: alerts.filter((a: Alert) => a.severity === 'critical').length,
          openAlerts: alerts.filter((a: Alert) => a.status === 'open').length,
          totalEndpoints: endpoints.length,
          onlineEndpoints: endpoints.filter((e: Endpoint) => e.status === 'online').length,
          isolatedEndpoints: endpoints.filter((e: Endpoint) => e.status === 'isolated').length,
          offlineEndpoints: endpoints.filter((e: Endpoint) => e.status === 'offline').length,
        };

        set({ stats, statsLoading: false });
      }
    } catch {
      console.warn('API not available, using mock stats data');
      // Use current state or calculate from mock data
      const currentAlerts = get().alerts.length > 0 ? get().alerts : MOCK_ALERTS;
      const currentEndpoints = get().endpoints.length > 0 ? get().endpoints : MOCK_ENDPOINTS;
      
      const stats: SecurityStats = {
        totalAlerts: currentAlerts.length,
        criticalAlerts: currentAlerts.filter((a: Alert) => a.severity === 'critical').length,
        openAlerts: currentAlerts.filter((a: Alert) => a.status === 'open').length,
        totalEndpoints: currentEndpoints.length,
        onlineEndpoints: currentEndpoints.filter((e: Endpoint) => e.status === 'online').length,
        isolatedEndpoints: currentEndpoints.filter((e: Endpoint) => e.status === 'isolated').length,
        offlineEndpoints: currentEndpoints.filter((e: Endpoint) => e.status === 'offline').length,
      };
      
      set({ stats, statsLoading: false });
    }
  },

  // Search for a specific IOC
  searchIOC: async (type: IOCType, value: string) => {
    set({ iocsLoading: true, iocsError: null, selectedIOC: null });
    try {
      const response = await apiClient.get(`/trend/ioc/search`, {
        params: { type, value },
      });

      const data = response.data as ApiResponse<{ found: boolean; ioc?: IOCDetails }>;

      if (data.success && data.data.found && data.data.ioc) {
        set({ selectedIOC: data.data.ioc, iocsLoading: false });
        return data.data.ioc;
      } else {
        set({ selectedIOC: null, iocsLoading: false });
        return null;
      }
    } catch {
      console.warn('API not available, searching mock IOC data');
      // Search in mock data
      const normalizedValue = value.toLowerCase().trim();
      const foundIOC = MOCK_IOCS.find(
        (ioc) => ioc.type === type && ioc.value.toLowerCase() === normalizedValue
      );

      set({ selectedIOC: foundIOC || null, iocsLoading: false });
      return foundIOC || null;
    }
  },

  // Fetch all IOCs
  fetchAllIOCs: async () => {
    set({ iocsLoading: true, iocsError: null });
    try {
      const response = await apiClient.get('/trend/ioc');
      const data = response.data as ApiResponse<{ items: IOCDetails[] }>;

      if (data.success) {
        set({ iocs: data.data.items, iocsLoading: false });
      } else {
        throw new Error(data.message || 'Failed to fetch IOCs');
      }
    } catch {
      console.warn('API not available, using mock IOC data');
      set({ iocs: MOCK_IOCS, iocsLoading: false });
    }
  },

  // Clear selected IOC
  clearSelectedIOC: () => {
    set({ selectedIOC: null });
  },

  // Reset store
  reset: () => set(initialState),
}));
