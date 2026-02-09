import { Request, Response } from 'express';
import { trendApiClient } from '../utils/trendApiClient';
import {
    EndpointsListResponse,
    IsolateEndpointRequest,
    RestoreEndpointRequest,
    ResponseActionResult,
} from '../types';

/**
 * List all managed endpoints
 */
export const listEndpoints = async (req: Request, res: Response) => {
    try {
        const response = await trendApiClient.get<EndpointsListResponse>(
            '/v3.0/ei/endpoints'
        );

        res.json({
            success: true,
            data: response.data,
        });
    } catch (error: any) {
        console.error('Failed to list endpoints:', error);
        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to retrieve endpoints',
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Isolate an endpoint from the network
 */
export const isolateEndpoint = async (req: Request, res: Response) => {
    try {
        const { agentGuid, description } = req.body as IsolateEndpointRequest;

        if (!agentGuid) {
            return res.status(400).json({
                success: false,
                message: 'agentGuid is required',
            });
        }

        const response = await trendApiClient.post<ResponseActionResult>(
            '/v3.0/response/endpoints/isolate',
            [{ agentGuid, description }]
        );

        res.json({
            success: true,
            message: 'Endpoint isolation initiated',
            data: response.data,
        });
    } catch (error: any) {
        console.error('Failed to isolate endpoint:', error);
        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to isolate endpoint',
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Restore network access to an endpoint
 */
export const restoreEndpoint = async (req: Request, res: Response) => {
    try {
        const { agentGuid } = req.body as RestoreEndpointRequest;

        if (!agentGuid) {
            return res.status(400).json({
                success: false,
                message: 'agentGuid is required',
            });
        }

        const response = await trendApiClient.post<ResponseActionResult>(
            '/v3.0/response/endpoints/restore',
            [{ agentGuid }]
        );

        res.json({
            success: true,
            message: 'Endpoint restoration initiated',
            data: response.data,
        });
    } catch (error: any) {
        console.error('Failed to restore endpoint:', error);
        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to restore endpoint',
            error: error.response?.data || error.message,
        });
    }
};
