import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import authRoutes from './routes/auth.routes';
import proxyRoutes from './routes/proxy.routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Webapp Backend',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Webapp Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', proxyRoutes); // Proxy routes for also, tdsynnex, trend

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: config.nodeEnv === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log('==============================================');
  console.log('🚀 Webapp Backend Server Started');
  console.log('==============================================');
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log('==============================================');
  console.log('📝 Default Credentials:');
  console.log(`   Username: ${config.admin.username}`);
  console.log(`   Password: ${config.admin.password}`);
  console.log('==============================================');
});

export default app;
