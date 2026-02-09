import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/OrderService';

export class OrderController {
    public async listOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { pageSize, offset } = req.query;
            const orders = await orderService.listOrders({
                pageSize: pageSize ? parseInt(pageSize as string) : undefined,
                offset: offset ? parseInt(offset as string) : undefined,
            });
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    }

    public async listCustomerOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId } = req.params;
            const { pageSize } = req.query;
            const orders = await orderService.listCustomerOrders(customerId, {
                pageSize: pageSize ? parseInt(pageSize as string) : undefined,
            });
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    }

    public async getOrderDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId, orderId } = req.params;
            const order = await orderService.getOrderDetails(customerId, orderId);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    public async listSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { pageSize } = req.query;
            const subscriptions = await orderService.listSubscriptions({
                pageSize: pageSize ? parseInt(pageSize as string) : undefined,
            });
            res.json({ success: true, data: subscriptions });
        } catch (error) {
            next(error);
        }
    }

    public async getSubscriptionDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId, subscriptionId } = req.params;
            const subscription = await orderService.getSubscriptionDetails(customerId, subscriptionId);
            res.json({ success: true, data: subscription });
        } catch (error) {
            next(error);
        }
    }
}

export const orderController = new OrderController();
