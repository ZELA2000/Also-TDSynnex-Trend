import { Router } from 'express';
import {
    listAlerts,
    getAlertDetails,
    updateAlertStatus,
    addNote,
} from '../controllers/alertsController';

const router = Router();

/**
 * GET /api/alerts
 * List alerts with optional filters
 * Query params: startDateTime, endDateTime, severity, status
 */
router.get('/', listAlerts);

/**
 * GET /api/alerts/:alertId
 * Get details of a specific alert
 */
router.get('/:alertId', getAlertDetails);

/**
 * PATCH /api/alerts/:alertId
 * Update alert status
 * Body: { status: 'open' | 'in_progress' | 'closed' }
 */
router.patch('/:alertId', updateAlertStatus);

/**
 * POST /api/alerts/:alertId/notes
 * Add a note to an alert
 * Body: { content: string }
 */
router.post('/:alertId/notes', addNote);

export default router;
