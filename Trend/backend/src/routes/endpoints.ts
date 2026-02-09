import { Router } from 'express';
import {
    listEndpoints,
    isolateEndpoint,
    restoreEndpoint,
} from '../controllers/endpointsController';

const router = Router();

/**
 * GET /api/endpoints
 * List all managed endpoints
 */
router.get('/', listEndpoints);

/**
 * POST /api/endpoints/isolate
 * Isolate an endpoint from the network
 * Body: { agentGuid: string, description?: string }
 */
router.post('/isolate', isolateEndpoint);

/**
 * POST /api/endpoints/restore
 * Restore network access to an endpoint
 * Body: { agentGuid: string }
 */
router.post('/restore', restoreEndpoint);

export default router;
