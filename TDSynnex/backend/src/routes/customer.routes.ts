import { Router } from 'express';
import { customerController } from '../controllers/CustomerController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Apply authentication middleware to all customer routes
router.use(authMiddleware);

// GET /api/customers - List customers
router.get('/', (req, res, next) => customerController.listCustomers(req, res, next));

// POST /api/customers - Create customer
router.post('/', (req, res, next) => customerController.createCustomer(req, res, next));

// GET /api/customers/:customerId - Get customer details
router.get('/:customerId', (req, res, next) => customerController.getCustomerDetails(req, res, next));

// GET /api/customers/:customerId/cloud-profiles - Get cloud profiles
router.get('/:customerId/cloud-profiles', (req, res, next) => customerController.getCloudProfiles(req, res, next));

export default router;
