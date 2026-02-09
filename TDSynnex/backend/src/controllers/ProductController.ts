import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/ProductService';
import { AppError } from '../middleware/errorHandler';

export class ProductController {
    /**
     * GET /api/products
     */
    public async searchProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { limit, offset, q, filters } = req.query;

            const products = await productService.searchProducts({
                limit: limit ? parseInt(limit as string) : undefined,
                offset: offset ? parseInt(offset as string) : undefined,
                q: q as string,
                filters: filters as string,
            });

            res.json({ success: true, data: products });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/products/:productId
     */
    public async getProductDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.params;
            const product = await productService.getProductDetails(productId);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/products/pricing
     */
    public async getProductPricing(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productIds } = req.body;

            if (!productIds || !Array.isArray(productIds)) {
                throw new AppError('productIds array is required', 400);
            }

            const pricing = await productService.getProductPricing(productIds);
            res.json({ success: true, data: pricing });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/products/:productId/enable
     */
    public async enableProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.params;
            const result = await productService.enableProduct(productId);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/products/:productId/disable
     */
    public async disableProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.params;
            const result = await productService.disableProduct(productId);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController();
