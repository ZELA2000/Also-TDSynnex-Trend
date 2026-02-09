import { Router } from 'express';
import { cartController } from '../controllers/CartController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

// POST /api/customers/:customerId/carts
router.post('/:customerId/carts', (req, res, next) => cartController.createCart(req, res, next));

// GET /api/customers/:customerId/carts/:cartId
router.get('/:customerId/carts/:cartId', (req, res, next) => cartController.getCart(req, res, next));

// POST /api/customers/:customerId/carts/:cartId/items
router.post('/:customerId/carts/:cartId/items', (req, res, next) => cartController.addCartItem(req, res, next));

// PUT /api/customers/:customerId/carts/:cartId/items/:itemId
router.put('/:customerId/carts/:cartId/items/:itemId', (req, res, next) => cartController.updateCartItem(req, res, next));

// DELETE /api/customers/:customerId/carts/:cartId/items/:itemId
router.delete('/:customerId/carts/:cartId/items/:itemId', (req, res, next) => cartController.removeCartItem(req, res, next));

// POST /api/customers/:customerId/carts/:cartId/checkout
router.post('/:customerId/carts/:cartId/checkout', (req, res, next) => cartController.checkout(req, res, next));

export default router;
