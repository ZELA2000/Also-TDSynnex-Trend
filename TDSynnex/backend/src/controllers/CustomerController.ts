import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/CustomerService';
import { AppError } from '../middleware/errorHandler';

export class CustomerController {
    /**
     * GET /api/customers
     * List all customers
     */
    public async listCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { pageSize, offset, filterName } = req.query;

            const customers = await customerService.listCustomers({
                pageSize: pageSize ? parseInt(pageSize as string) : undefined,
                offset: offset ? parseInt(offset as string) : undefined,
                filterName: filterName as string,
            });

            res.json({
                success: true,
                data: customers,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/customers
     * Create a new customer
     */
    public async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerData = req.body;

            // Basic validation
            if (!customerData.customerOrganization || !customerData.customerName || !customerData.customerEmail) {
                throw new AppError('customerOrganization, customerName, and customerEmail are required', 400);
            }

            const customer = await customerService.createCustomer(customerData);

            res.status(201).json({
                success: true,
                data: customer,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/customers/:customerId
     * Get customer details
     */
    public async getCustomerDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                throw new AppError('customerId is required', 400);
            }

            const customer = await customerService.getCustomerDetails(customerId);

            res.json({
                success: true,
                data: customer,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/customers/:customerId/cloud-profiles
     * Get customer cloud profiles
     */
    public async getCloudProfiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                throw new AppError('customerId is required', 400);
            }

            const profiles = await customerService.getCloudProfiles(customerId);

            res.json({
                success: true,
                data: profiles,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const customerController = new CustomerController();
