// Alert types
export interface Alert {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'in_progress' | 'closed';
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
}

export interface UpdateAlertStatusRequest {
    status: 'open' | 'in_progress' | 'closed';
}

export interface AddNoteRequest {
    content: string;
}

// Endpoint types
export interface Endpoint {
    agentGuid: string;
    endpointName: string;
    ipAddress: string[];
    osName: string;
    osVersion: string;
    productCode: string;
    status: string;
}

export interface EndpointsListResponse {
    items: Endpoint[];
    nextLink?: string;
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

// Error types
export interface TrendApiError {
    error: {
        code: string;
        message: string;
        innererror?: {
            code: string;
            message: string;
        };
    };
}
