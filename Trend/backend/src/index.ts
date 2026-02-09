import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';

// Import routes
import authRoutes from './routes/auth';
import alertsRoutes from './routes/alerts';
import endpointsRoutes from './routes/endpoints';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Trend Vision One Backend',
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/endpoints', endpointsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
    });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Start server
app.listen(config.port, () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       Trend Vision One Backend API Server                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n🚀 Server running on port ${config.port}`);
    console.log(`📡 Trend API Base URL: ${config.trendBaseUrl}`);
    console.log(`\n📍 Available endpoints:`);
    console.log(`   - GET  /health`);
    console.log(`   - GET  /api/auth/test`);
    console.log(`   - GET  /api/alerts`);
    console.log(`   - GET  /api/alerts/:alertId`);
    console.log(`   - PATCH /api/alerts/:alertId`);
    console.log(`   - POST /api/alerts/:alertId/notes`);
    console.log(`   - GET  /api/endpoints`);
    console.log(`   - POST /api/endpoints/isolate`);
    console.log(`   - POST /api/endpoints/restore`);
    console.log(`\n✅ Ready to accept requests\n`);
});

export default app;
