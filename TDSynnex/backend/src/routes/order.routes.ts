import { Router } from 'express';
import { orderController } from '../controllers/OrderController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

// GET /api/orders
router.get('/orders', (req, res, next) => orderController.listOrders(req, res, next));

// GET /api/customers/:customerId/orders
router.get('/customers/:customerId/orders', (req, res, next) => orderController.listCustomerOrders(req, res, next));

// GET /api/customers/:customerId/orders/:orderId
router.get('/customers/:customerId/orders/:orderId', (req, res, next) => orderController.getOrderDetails(req, res, next));

// GET /api/subscriptions
router.get('/subscriptions', (req, res, next) => orderController.listSubscriptions(req, res, next));

// GET /api/customers/:customerId/subscriptions/:subscriptionId
router.get('/customers/:customerId/subscriptions/:subscriptionId', (req, res, next) => orderController.getSubscriptionDetails(req, res, next));

export default router;
