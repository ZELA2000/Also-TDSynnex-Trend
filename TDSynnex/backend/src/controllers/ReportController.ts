import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/ReportService';
import { AppError } from '../middleware/errorHandler';

export class ReportController {
    public async getProvisioningTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const templates = await reportService.getProvisioningTemplates();
            res.json({ success: true, data: templates });
        } catch (error) {
            next(error);
        }
    }

    public async listReports(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reports = await reportService.listReports();
            res.json({ success: true, data: reports });
        } catch (error) {
            next(error);
        }
    }

    public async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { reportId } = req.params;
            const { startDate, endDate } = req.body;

            if (!startDate || !endDate) {
                throw new AppError('startDate and endDate are required', 400);
            }

            const result = await reportService.generateReport(reportId, { startDate, endDate });
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export const reportController = new ReportController();
