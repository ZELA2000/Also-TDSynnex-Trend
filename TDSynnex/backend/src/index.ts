import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { apiClient } from './utils/apiClient';
import { authService } from './services/AuthService';

// Import routes
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import reportRoutes from './routes/report.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'TDSynnex Backend API',
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api', cartRoutes);  // Cart routes include customer ID in path
app.use('/api', orderRoutes); // Order routes have mixed paths
app.use('/api', reportRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'TDSynnex Backend API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            customers: '/api/customers',
            products: '/api/products',
            carts: '/api/customers/:customerId/carts',
            orders: '/api/orders',
            subscriptions: '/api/subscriptions',
            reports: '/api/reports',
        },
        documentation: 'See README.md for detailed API documentation',
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Configure API client with token provider
apiClient.setTokenProvider(async () => {
    return await authService.getAccessToken();
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TDSynnex Backend API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/`);
    console.log('');
    console.log('🔐 Remember to configure your .env file with TDSynnex credentials');
});

export default app;
