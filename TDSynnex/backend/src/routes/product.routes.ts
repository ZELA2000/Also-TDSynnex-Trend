import { Router } from 'express';
import { productController } from '../controllers/ProductController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

// GET /api/products - Search products
router.get('/', (req, res, next) => productController.searchProducts(req, res, next));

// POST /api/products/pricing - Get pricing
router.post('/pricing', (req, res, next) => productController.getProductPricing(req, res, next));

// GET /api/products/:productId - Get product details
router.get('/:productId', (req, res, next) => productController.getProductDetails(req, res, next));

// POST /api/products/:productId/enable - Enable product
router.post('/:productId/enable', (req, res, next) => productController.enableProduct(req, res, next));

// POST /api/products/:productId/disable - Disable product
router.post('/:productId/disable', (req, res, next) => productController.disableProduct(req, res, next));

export default router;
