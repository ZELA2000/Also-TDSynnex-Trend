import { Request, Response } from 'express';
import { trendApiClient } from '../utils/trendApiClient';
import {
    AlertsListResponse,
    Alert,
    UpdateAlertStatusRequest,
    AddNoteRequest,
} from '../types';

/**
 * List alerts with optional filters
 */
export const listAlerts = async (req: Request, res: Response) => {
    try {
        const { startDateTime, endDateTime, severity, status } = req.query;

        // Build filter header
        const filters: string[] = [];
        if (severity) {
            filters.push(`severity eq '${severity}'`);
        }
        if (status) {
            filters.push(`status eq '${status}'`);
        }

        const params: any = {};
        if (startDateTime) params.startDateTime = startDateTime;
        if (endDateTime) params.endDateTime = endDateTime;

        const headers: any = {};
        if (filters.length > 0) {
            headers['TMV1-Filter'] = filters.join(' and ');
        }

        const response = await trendApiClient.get<AlertsListResponse>(
            '/v3.0/workbench/alerts',
            { params, headers }
        );

        res.json({
            success: true,
            data: response.data,
        });
    } catch (error: any) {
        console.error('Failed to list alerts:', error);
        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to retrieve alerts',
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Get details of a specific alert
 */
export const getAlertDetails = async (req: Request, res: Response) => {
    try {
        const { alertId } = req.params;

        const response = await trendApiClient.get<Alert>(
            `/v3.0/workbench/alerts/${alertId}`
        );

        res.json({
            success: true,
            data: response.data,
        });
    } catch (error: any) {
        console.error(`Failed to get alert ${req.params.alertId}:`, error);
        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to retrieve alert details',
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Update alert status
 */
export const updateAlertStatus = async (req: Request, res: Response) => {
    try {
        const { alertId } = req.params;
        const { status } = req.body as UpdateAlertStatusRequest;

        if (!status || !['open', 'in_progress', 'closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: open, in_progress, closed',
            });
        }

        const response = await trendApiClient.patch(
            `/v3.0/workbench/alerts/${alertId}`,
            { status }
        );

        res.json({
            success: true,
            message: 'Alert status updated successfully',
            data: response.data,
        });
    } catch (error: any) {
        console.error(`Failed to update alert ${req.params.alertId}:`, error);
        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to update alert status',
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Add a note to an alert
 */
export const addNote = async (req: Request, res: Response) => {
    try {
        const { alertId } = req.params;
        const { content } = req.body as AddNoteRequest;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Note content is required',
            });
        }

        const response = await trendApiClient.post(
            `/v3.0/workbench/alerts/${alertId}/notes`,
            { content }
        );

        res.json({
            success: true,
            message: 'Note added successfully',
            data: response.data,
        });
    } catch (error: any) {
        console.error(`Failed to add note to alert ${req.params.alertId}:`, error);
        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to add note',
            error: error.response?.data || error.message,
        });
    }
};
