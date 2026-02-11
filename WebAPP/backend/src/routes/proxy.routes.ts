import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';

const router = Router();

const PROXY_BASE_URL = process.env.PROXY_URL || 'http://localhost:4000';

/**
 * Proxy middleware to forward requests to Unified Proxy Backend
 */
const proxyRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUrl = `${PROXY_BASE_URL}${req.originalUrl}`;
    
    console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${targetUrl}`);

    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined, // Remove host header
      },
      params: req.query,
      validateStatus: () => true, // Don't throw on any status code
    });

    // Forward response
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Proxy] Error:', error.message);
    next(error);
  }
};

// Proxy all /also/* requests
router.all('/also/*', proxyRequest);

// Proxy all /tdsynnex/* requests
router.all('/tdsynnex/*', proxyRequest);

// Proxy all /trend/* requests
router.all('/trend/*', proxyRequest);

export default router;
