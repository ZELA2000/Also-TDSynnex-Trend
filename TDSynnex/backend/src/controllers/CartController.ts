import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/CartService';
import { AppError } from '../middleware/errorHandler';

export class CartController {
    public async createCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId } = req.params;
            const cart = await cartService.createCart(customerId, req.body);
            res.status(201).json({ success: true, data: cart });
        } catch (error) {
            next(error);
        }
    }

    public async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId, cartId } = req.params;
            const cart = await cartService.getCart(customerId, cartId);
            res.json({ success: true, data: cart });
        } catch (error) {
            next(error);
        }
    }

    public async addCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId, cartId } = req.params;
            const itemData = req.body;

            if (!itemData.productId || !itemData.quantity) {
                throw new AppError('productId and quantity are required', 400);
            }

            const item = await cartService.addCartItem(customerId, cartId, itemData);
            res.status(201).json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    }

    public async updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId, cartId, itemId } = req.params;
            const item = await cartService.updateCartItem(customerId, cartId, itemId, req.body);
            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    }

    public async removeCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId, cartId, itemId } = req.params;
            await cartService.removeCartItem(customerId, cartId, itemId);
            res.json({ success: true, message: 'Item removed' });
        } catch (error) {
            next(error);
        }
    }

    public async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId, cartId } = req.params;
            const result = await cartService.checkout(customerId, cartId, req.body);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export const cartController = new CartController();
