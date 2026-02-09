import { apiClient } from '../utils/apiClient';
import { ProvisioningTemplate, Report } from '../types';
import dotenv from 'dotenv';

dotenv.config();

class ReportService {
    private accountId: string;

    constructor() {
        this.accountId = process.env.TDSYNNEX_ACCOUNT_ID || '';
    }

    public async getProvisioningTemplates(): Promise<ProvisioningTemplate[]> {
        const url = `/api/v3/accounts/${this.accountId}/provisionTemplates`;

        try {
            const response = await apiClient.get<any>(url);
            if (Array.isArray(response)) return response;
            if (response.items) return response.items;
            return [];
        } catch (error: any) {
            throw new Error('Failed to get provisioning templates');
        }
    }

    public async listReports(): Promise<Report[]> {
        const url = `/api/v3/accounts/${this.accountId}/reports`;

        try {
            const response = await apiClient.get<any>(url);
            if (Array.isArray(response)) return response;
            if (response.items) return response.items;
            return [];
        } catch (error: any) {
            throw new Error('Failed to list reports');
        }
    }

    public async generateReport(reportId: string, params: { startDate: string; endDate: string }): Promise<any> {
        const url = `/api/v3/accounts/${this.accountId}/reports/${reportId}/report`;

        try {
            return await apiClient.post<any>(url, params);
        } catch (error: any) {
            throw new Error('Failed to generate report');
        }
    }
}

export const reportService = new ReportService();
