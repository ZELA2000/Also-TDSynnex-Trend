import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import logger from './utils/logger';
import routes from './routes';
import errorHandler from './middleware/errorHandler';
import requestLogger from './middleware/logger';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: '*', // Configure this based on your requirements
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Unified API Proxy',
        version: '1.0.0',
        description: 'Unified proxy for Also, TDSynnex, and Trend Vision One APIs',
        endpoints: {
            health: '/api/health',
            status: '/api/status',
            also: '/api/also/*',
            tdsynnex: '/api/tdsynnex/*',
            trend: '/api/trend/*',
        },
        documentation: 'See README.md for detailed API documentation',
    });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
        availableEndpoints: ['/api/also/*', '/api/tdsynnex/*', '/api/trend/*'],
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`==============================================`);
    logger.info(`🚀 Unified API Proxy Server Started`);
    logger.info(`==============================================`);
    logger.info(`Port: ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Log Level: ${config.logLevel}`);
    logger.info(`==============================================`);
    logger.info(`Connected APIs:`);
    logger.info(`  • Also Marketplace: ${config.also.baseUrl}`);
    logger.info(`  • TDSynnex StreamOne: ${config.tdsynnex.baseUrl}`);
    logger.info(`  • Trend Vision One: ${config.trend.baseUrl}`);
    logger.info(`==============================================`);
    logger.info(`Proxy Endpoints:`);
    logger.info(`  • Also: http://localhost:${PORT}/api/also/*`);
    logger.info(`  • TDSynnex: http://localhost:${PORT}/api/tdsynnex/*`);
    logger.info(`  • Trend: http://localhost:${PORT}/api/trend/*`);
    logger.info(`==============================================`);
});

export default app;
