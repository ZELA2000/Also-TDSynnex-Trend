# Getting Started - Unified API Proxy

## Overview
The Unified API Proxy is a centralized gateway that provides a single entry point for accessing multiple backend APIs (Also Marketplace, TDSynnex StreamOne, and Trend Vision One). It handles request routing, authentication forwarding, and provides unified logging and error handling.

## Prerequisites

Before starting the proxy, ensure you have:
1. **Node.js 18+** and npm installed
2. **Backend APIs running**:
   - Also Marketplace Backend (default: `http://localhost:3001`)
   - TDSynnex Backend (default: `http://localhost:3002`)
   - Trend Vision One Backend (default: `http://localhost:3003`)

## Installation

### 1. Install Dependencies

```bash
cd Proxy/backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `Proxy/backend` directory:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development
LOG_LEVEL=debug

# Also Marketplace API Configuration
ALSO_BASE_URL=http://localhost:3001

# TDSynnex StreamOne API Configuration
TDSYNNEX_BASE_URL=http://localhost:3002

# Trend Vision One API Configuration
TREND_BASE_URL=http://localhost:3003
```

### 3. Start the Proxy

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm run build
npm start
```

## Verify Installation

### 1. Check Proxy Health

**Request**:
```bash
curl http://localhost:4000/api/health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T10:30:00.000Z",
  "service": "Unified API Proxy",
  "uptime": 123.456,
  "apis": {
    "also": "available",
    "tdsynnex": "available",
    "trend": "available"
  }
}
```

### 2. Check API Status

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

## Basic Usage

The proxy automatically forwards all requests to the appropriate backend API based on the URL prefix.

### URL Mapping

| Proxy URL | Forwarded To | Backend API |
|-----------|--------------|-------------|
| `http://localhost:4000/api/also/*` | `http://localhost:3001/api/*` | Also Marketplace |
| `http://localhost:4000/api/tdsynnex/*` | `http://localhost:3002/api/*` | TDSynnex StreamOne |
| `http://localhost:4000/api/trend/*` | `http://localhost:3003/api/*` | Trend Vision One |

### Example: Also API Request

**Direct to Also Backend**:
```bash
curl http://localhost:3001/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

**Via Proxy**:
```bash
curl http://localhost:4000/api/also/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

### Example: TDSynnex API Request

**Via Proxy**:
```bash
curl http://localhost:4000/api/tdsynnex/auth/token -X POST \
  -H "Content-Type: application/json" \
  -d '{"client_id": "xxx", "client_secret": "yyy"}'
```

### Example: Trend API Request

**Via Proxy**:
```bash
curl http://localhost:4000/api/trend/alerts -X GET \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Authentication

The proxy is **transparent** regarding authentication. It forwards all headers (including authentication headers) to the backend APIs without modification.

### Also Authentication
Include the `Authenticate` header:
```bash
curl http://localhost:4000/api/also/catalog/products \
  -H "Authenticate: CCPSessionId YOUR_SESSION_TOKEN"
```

### TDSynnex Authentication
Include the `Authorization` header:
```bash
curl http://localhost:4000/api/tdsynnex/customers \
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"
```

### Trend Authentication
Include the `Authorization` header:
```bash
curl http://localhost:4000/api/trend/alerts \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Logging

The proxy logs all requests and responses using Winston:

```
info: Proxying Also request: POST /api/auth/login
info: Proxying TDSynnex request: GET /api/customers
error: Also proxy route error: Connection refused
```

Logs include:
- Request method and path
- Response status and time
- Error messages with stack traces
- Timestamp and log level

## Error Handling

All errors are caught and returned in a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

Common error scenarios:
- **503 Service Unavailable**: Backend API is not running
- **401 Unauthorized**: Invalid or missing authentication
- **404 Not Found**: Invalid route or resource
- **500 Internal Server Error**: Unexpected error

## Next Steps

- **[Also Integration](2_Also_Integration.md)**: Learn how to use Also Marketplace API through the proxy
- **[TDSynnex Integration](3_TDSynnex_Integration.md)**: Learn how to use TDSynnex API through the proxy
- **[Trend Integration](4_Trend_Integration.md)**: Learn how to use Trend Vision One API through the proxy
- **[Monitoring and Health](5_Monitoring_and_Health.md)**: Set up monitoring and health checks
