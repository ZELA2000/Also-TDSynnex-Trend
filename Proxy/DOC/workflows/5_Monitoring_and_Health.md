# Monitoring and Health - Unified API Proxy

## Overview
This guide covers health checks, monitoring, logging, and operational best practices for the Unified API Proxy. Proper monitoring ensures high availability and helps quickly identify and resolve issues.

## Health Check Endpoints

### Basic Health Check

**Endpoint**: `GET /api/health`

Check if the proxy service is running and responsive.

**Request**:
```bash
curl http://localhost:4000/api/health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T10:30:15.123Z",
  "service": "Unified API Proxy",
  "uptime": 3665.789,
  "apis": {
    "also": "available",
    "tdsynnex": "available",
    "trend": "available"
  }
}
```

**Use Cases**:
- Docker health checks
- Kubernetes liveness probes
- Load balancer health checks
- Monitoring systems (Datadog, New Relic, etc.)

### API Status Check

**Endpoint**: `GET /api/status`

Get detailed status and configuration information.

**Request**:
```bash
curl http://localhost:4000/api/status
```

**Response**:
```json
{
  "version": "1.0.0",
  "apis": [
    {
      "name": "Also Marketplace",
      "prefix": "/api/also",
      "status": "active",
      "description": "Marketplace, subscriptions, account management"
    },
    {
      "name": "TDSynnex StreamOne",
      "prefix": "/api/tdsynnex",
      "status": "active",
      "description": "Cloud products, customers, orders"
    },
    {
      "name": "Trend Vision One",
      "prefix": "/api/trend",
      "status": "active",
      "description": "XDR security, alerts, endpoint management"
    }
  ]
}
```

**Use Cases**:
- Documentation generation
- API discovery
- Version tracking
- Service catalog integration

## Logging

### Log Levels

The proxy uses Winston for structured logging with the following levels:

| Level | Description | Example |
|-------|-------------|---------|
| `error` | Error events | Backend connection failures, authentication errors |
| `warn` | Warning events | Slow response times, deprecated endpoints |
| `info` | Informational | Request logging, service startup |
| `debug` | Debug information | Request/response payloads, detailed flow |

### Configure Log Level

Set the `LOG_LEVEL` environment variable:

```bash
# .env file
LOG_LEVEL=debug  # For development
LOG_LEVEL=info   # For production
LOG_LEVEL=error  # For minimal logging
```

### Log Format

Logs are output in JSON format for easy parsing:

```json
{
  "level": "info",
  "message": "Proxying Also request: POST /api/auth/login",
  "timestamp": "2026-02-06T10:30:15.123Z",
  "service": "unified-api-proxy"
}
```

### Request Logging

Every request is automatically logged:

```json
{
  "level": "info",
  "message": "Incoming request",
  "method": "GET",
  "url": "/api/also/catalog/products",
  "ip": "192.168.1.100",
  "userAgent": "axios/1.6.0",
  "timestamp": "2026-02-06T10:30:15.123Z"
}
```

### Error Logging

Errors include stack traces and context:

```json
{
  "level": "error",
  "message": "Also proxy route error: connect ECONNREFUSED 127.0.0.1:3001",
  "stack": "Error: connect ECONNREFUSED...",
  "url": "/api/also/catalog/products",
  "timestamp": "2026-02-06T10:30:15.123Z"
}
```

### Custom Log Viewing

**View logs in real-time**:
```bash
npm run dev | npx pino-pretty
```

**Filter by level**:
```bash
npm run dev | grep -i error
npm run dev | grep -i "proxy request"
```

**Export logs to file**:
```bash
npm run dev >> logs/proxy.log 2>&1
```

## Monitoring Setup

### Docker Health Check

Add to your `docker-compose.yml`:

```yaml
services:
  proxy:
    image: unified-api-proxy:latest
    ports:
      - "4000:4000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Kubernetes Liveness Probe

Add to your Kubernetes deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unified-api-proxy
spec:
  template:
    spec:
      containers:
      - name: proxy
        image: unified-api-proxy:latest
        ports:
        - containerPort: 4000
        livenessProbe:
          httpGet:
            path: /api/health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/status
            port: 4000
          initialDelaySeconds: 10
          periodSeconds: 5
```

### Prometheus Metrics

For advanced monitoring, you can add Prometheus metrics:

```javascript
// Add to src/index.ts
const promClient = require('prom-client');

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

### External Monitoring Services

#### Datadog

```javascript
const tracer = require('dd-trace').init({
  hostname: 'localhost',
  port: 8126,
  service: 'unified-api-proxy',
  env: process.env.NODE_ENV
});

app.use(tracer.middleware());
```

#### New Relic

```javascript
require('newrelic');  // Must be first line in index.ts

// newrelic.js configuration
exports.config = {
  app_name: ['Unified API Proxy'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  }
};
```

## Performance Monitoring

### Response Time Tracking

Monitor response times for each backend API:

```javascript
// Custom middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
    
    // Alert if slow
    if (duration > 5000) {
      logger.warn('Slow request detected', {
        url: req.url,
        duration: `${duration}ms`
      });
    }
  });
  
  next();
});
```

### Backend Availability Monitoring

Create a monitoring script:

```javascript
// monitor.js
const axios = require('axios');

const backends = [
  { name: 'Also', url: 'http://localhost:3001/api/health' },
  { name: 'TDSynnex', url: 'http://localhost:3002/api/health' },
  { name: 'Trend', url: 'http://localhost:3003/api/health' }
];

async function checkBackends() {
  for (const backend of backends) {
    try {
      const start = Date.now();
      await axios.get(backend.url, { timeout: 5000 });
      const duration = Date.now() - start;
      
      console.log(`✓ ${backend.name}: OK (${duration}ms)`);
    } catch (error) {
      console.error(`✗ ${backend.name}: FAIL - ${error.message}`);
      // Send alert (email, Slack, PagerDuty, etc.)
    }
  }
}

// Run every minute
setInterval(checkBackends, 60000);
checkBackends();
```

## Alerting

### Error Rate Monitoring

```javascript
let errorCount = 0;
let requestCount = 0;

setInterval(() => {
  const errorRate = (errorCount / requestCount) * 100;
  
  if (errorRate > 5) {
    // Send alert
    logger.error('High error rate detected', {
      rate: `${errorRate.toFixed(2)}%`,
      errors: errorCount,
      total: requestCount
    });
  }
  
  // Reset counters
  errorCount = 0;
  requestCount = 0;
}, 60000); // Every minute
```

### Slack Notifications

```javascript
const axios = require('axios');

async function sendSlackAlert(message) {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: message,
    channel: '#alerts',
    username: 'Proxy Monitor',
    icon_emoji: ':warning:'
  });
}

// Use in error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error', error);
  
  sendSlackAlert(`🚨 Proxy Error: ${error.message}\nURL: ${req.url}`);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});
```

## Debugging

### Debug Mode

Enable debug logging:

```bash
LOG_LEVEL=debug npm run dev
```

### Request/Response Inspection

Add middleware to log full requests and responses:

```javascript
// Only in development!
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Request:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    });
    
    const originalSend = res.send;
    res.send = function(data) {
      console.log('Response:', {
        status: res.statusCode,
        body: data
      });
      originalSend.call(this, data);
    };
    
    next();
  });
}
```

### Network Traffic Analysis

Use tools like `tcpdump` or Wireshark to analyze traffic:

```bash
# Capture traffic on port 4000
tcpdump -i any -s 0 -X port 4000

# Or use mitmproxy for HTTP inspection
mitmproxy --mode reverse:http://localhost:4000
```

## Operational Best Practices

### 1. Health Check Automation

Create a monitoring dashboard:

```bash
#!/bin/bash
# health-check.sh

echo "=== Proxy Health Check ==="
echo "Proxy: $(curl -s http://localhost:4000/api/health | jq -r '.status')"
echo "Also: $(curl -s http://localhost:3001/api/health | jq -r '.status')"
echo "TDSynnex: $(curl -s http://localhost:3002/api/health | jq -r '.status')"
echo "Trend: $(curl -s http://localhost:3003/api/health | jq -r '.status')"
```

### 2. Log Rotation

Configure log rotation to prevent disk space issues:

```bash
# /etc/logrotate.d/proxy
/var/log/proxy/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 node node
    sharedscripts
    postrotate
        systemctl reload proxy
    endscript
}
```

### 3. Graceful Shutdown

Handle shutdown signals properly:

```javascript
// In src/index.ts
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
```

### 4. Rate Limiting

Protect the proxy from abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

app.use('/api/', limiter);
```

### 5. Backup and Recovery

Document recovery procedures:

```markdown
## Proxy Failure Recovery

1. Check proxy health: `curl http://localhost:4000/api/health`
2. Check logs: `tail -f /var/log/proxy/error.log`
3. Restart service: `systemctl restart proxy`
4. Verify backend APIs are running
5. Check environment variables are set correctly
6. Review recent code changes
```

## Troubleshooting

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Proxy not responding | Connection refused | Check if proxy is running, verify port 4000 |
| Backend unavailable | 503 errors | Verify backend APIs are running on correct ports |
| High latency | Slow responses | Check backend API performance, network issues |
| Authentication errors | 401/403 errors | Verify credentials are being forwarded correctly |
| Memory leaks | Increasing memory usage | Review code for memory leaks, restart service |

## Related Documentation

- **Getting Started**: [1_Getting_Started.md](1_Getting_Started.md)
- **Also Integration**: [2_Also_Integration.md](2_Also_Integration.md)
- **TDSynnex Integration**: [3_TDSynnex_Integration.md](3_TDSynnex_Integration.md)
- **Trend Integration**: [4_Trend_Integration.md](4_Trend_Integration.md)
