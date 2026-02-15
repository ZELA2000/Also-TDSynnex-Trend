/**
 * Security Dashboard Types
 * Types for Trend Vision One XDR alerts and endpoints
 */

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'open' | 'in_progress' | 'closed';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdDateTime: string;
  updatedDateTime: string;
  description: string;
  impactScope?: {
    entityType: string;
    entityValue: string;
  }[];
  indicators?: {
    type: string;
    value: string;
  }[];
}

export interface AlertsListResponse {
  items: Alert[];
  nextLink?: string;
  count?: number;
}

export interface UpdateAlertStatusRequest {
  status: AlertStatus;
}

export interface AddNoteRequest {
  content: string;
}

// Endpoint types
export type EndpointStatus = 
  | 'online'
  | 'offline'
  | 'isolated'
  | 'disconnected'
  | 'unmanaged';

export interface Endpoint {
  agentGuid: string;
  endpointName: string;
  ipAddress: string[];
  osName: string;
  osVersion: string;
  productCode: string;
  status: EndpointStatus;
  macAddress?: string[];
  lastSeenDateTime?: string;
}

export interface EndpointsListResponse {
  items: Endpoint[];
  nextLink?: string;
  count?: number;
}

export interface IsolateEndpointRequest {
  agentGuid: string;
  description?: string;
}

export interface RestoreEndpointRequest {
  agentGuid: string;
}

export interface ResponseActionResult {
  taskId: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
}

// Filters
export interface AlertFilters {
  severity?: AlertSeverity;
  status?: AlertStatus;
  startDateTime?: string;
  endDateTime?: string;
}

export interface SecurityStats {
  totalAlerts: number;
  criticalAlerts: number;
  openAlerts: number;
  totalEndpoints: number;
  onlineEndpoints: number;
  isolatedEndpoints: number;
  offlineEndpoints: number;
}

// Threat Detection
export type IOCType = 'ip' | 'domain' | 'url' | 'fileSha256' | 'fileSha1' | 'email';
export type ThreatType = 'malware' | 'ransomware' | 'phishing' | 'c2' | 'exploit' | 'suspicious';

export interface ThreatIndicator {
  type: IOCType;
  value: string;
  severity: AlertSeverity;
  firstSeen: string;
  lastSeen: string;
  occurrences: number;
  threatType?: ThreatType;
  sources?: string[];
  tags?: string[];
}

export interface IOCDetails extends ThreatIndicator {
  id: string;
  reputation: 'malicious' | 'suspicious' | 'unknown' | 'clean';
  riskScore: number; // 0-100
  relatedAlerts: string[];
  relatedEndpoints: string[];
  geoLocation?: {
    country: string;
    city?: string;
  };
  whois?: {
    registrar?: string;
    registrationDate?: string;
  };
}

export interface ThreatDetection {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  indicators: ThreatIndicator[];
  affectedEndpoints: string[];
  detectedAt: string;
  mitigationSteps?: string[];
}

export interface IOCSearchRequest {
  type: IOCType;
  value: string;
}

export interface IOCSearchResponse {
  found: boolean;
  ioc?: IOCDetails;
}
