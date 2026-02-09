import { Router } from 'express';
import { reportController } from '../controllers/ReportController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

// GET /api/provisioning-templates
router.get('/provisioning-templates', (req, res, next) => reportController.getProvisioningTemplates(req, res, next));

// GET /api/reports
router.get('/reports', (req, res, next) => reportController.listReports(req, res, next));

// POST /api/reports/:reportId/generate
router.post('/reports/:reportId/generate', (req, res, next) => reportController.generateReport(req, res, next));

export default router;
