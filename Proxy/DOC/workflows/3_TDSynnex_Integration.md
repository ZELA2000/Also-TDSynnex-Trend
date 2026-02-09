# TDSynnex StreamOne Integration - Unified API Proxy

## Overview
This guide explains how to access the TDSynnex StreamOne API through the Unified API Proxy. The proxy transparently forwards all TDSynnex-related requests to the TDSynnex backend while maintaining OAuth2 authentication and request context.

## Endpoint Structure

All TDSynnex StreamOne endpoints are accessed through the `/api/tdsynnex` prefix:

| Proxy Endpoint | Forwarded To | Description |
|----------------|--------------|-------------|
| `POST /api/tdsynnex/auth/token` | `POST http://localhost:3002/api/auth/token` | Get OAuth2 token |
| `GET /api/tdsynnex/products` | `GET http://localhost:3002/api/products` | List products |
| `POST /api/tdsynnex/customers` | `POST http://localhost:3002/api/customers` | Create customer |
| `POST /api/tdsynnex/orders` | `POST http://localhost:3002/api/orders` | Place order |

**Pattern**: `http://localhost:4000/api/tdsynnex/*` → `http://localhost:3002/api/*`

## Authentication Workflow

### 1. Obtain OAuth2 Token

**Request to Proxy**:
```bash
curl -X POST http://localhost:4000/api/tdsynnex/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "grant_type": "client_credentials"
  }'
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def502004a8b3c..."
}
```

### 2. Use Access Token in Subsequent Requests

Include the `Authorization` header with Bearer token:

```bash
curl -X GET http://localhost:4000/api/tdsynnex/products \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Refresh Token (Optional)

When the access token expires, use the refresh token:

```bash
curl -X POST http://localhost:4000/api/tdsynnex/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "def502004a8b3c...",
    "grant_type": "refresh_token"
  }'
```

## Common Operations

### Customer Management

#### Create Customer
```bash
curl -X POST http://localhost:4000/api/tdsynnex/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Acme Corporation",
    "email": "admin@acme.com",
    "country": "US",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001"
    }
  }'
```

#### Get Customer Details
```bash
curl -X GET http://localhost:4000/api/tdsynnex/customers/CUST123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### List All Customers
```bash
curl -X GET http://localhost:4000/api/tdsynnex/customers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Product Catalog

#### Search Products
```bash
curl -X GET "http://localhost:4000/api/tdsynnex/products?search=office365&vendor=Microsoft" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Product Details
```bash
curl -X GET http://localhost:4000/api/tdsynnex/products/PROD456 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Product Pricing
```bash
curl -X GET http://localhost:4000/api/tdsynnex/products/PROD456/pricing \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Shopping Cart Management

#### Create Cart
```bash
curl -X POST http://localhost:4000/api/tdsynnex/carts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "customerId": "CUST123"
  }'
```

#### Add Item to Cart
```bash
curl -X POST http://localhost:4000/api/tdsynnex/carts/CART789/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "productId": "PROD456",
    "quantity": 5,
    "billingCycle": "monthly"
  }'
```

#### Get Cart Contents
```bash
curl -X GET http://localhost:4000/api/tdsynnex/carts/CART789 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Order Management

#### Create Order from Cart
```bash
curl -X POST http://localhost:4000/api/tdsynnex/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "cartId": "CART789",
    "customerId": "CUST123",
    "purchaseOrderNumber": "PO-2026-001"
  }'
```

#### Get Order Status
```bash
curl -X GET http://localhost:4000/api/tdsynnex/orders/ORD999 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### List Orders
```bash
curl -X GET "http://localhost:4000/api/tdsynnex/orders?customerId=CUST123&status=active" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Subscription Management

#### Update Subscription Quantity
```bash
curl -X PATCH http://localhost:4000/api/tdsynnex/subscriptions/SUB555 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "quantity": 10
  }'
```

#### Cancel Subscription
```bash
curl -X POST http://localhost:4000/api/tdsynnex/subscriptions/SUB555/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "reason": "Customer request",
    "cancellationType": "immediate"
  }'
```

### Reports

#### Get Usage Report
```bash
curl -X GET "http://localhost:4000/api/tdsynnex/reports/usage?startDate=2026-02-01&endDate=2026-02-28" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Billing Report
```bash
curl -X GET "http://localhost:4000/api/tdsynnex/reports/billing?month=2026-02" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Proxy
    participant TDSynnex

    Client->>Proxy: POST /api/tdsynnex/auth/token
    Note over Proxy: Remove /tdsynnex prefix
    Proxy->>TDSynnex: POST /api/auth/token
    TDSynnex-->>Proxy: OAuth2 Tokens
    Proxy-->>Client: OAuth2 Tokens
    
    Client->>Proxy: GET /api/tdsynnex/products<br/>Header: Authorization: Bearer TOKEN
    Note over Proxy: Forward headers + body
    Proxy->>TDSynnex: GET /api/products<br/>Header: Authorization: Bearer TOKEN
    TDSynnex-->>Proxy: Product List
    Proxy-->>Client: Product List
```

## Error Handling

### Backend Not Available
```json
{
  "success": false,
  "message": "connect ECONNREFUSED 127.0.0.1:3002"
}
```
**Solution**: Ensure TDSynnex backend is running on port 3002

### Invalid or Expired Token
```json
{
  "success": false,
  "error": "invalid_token",
  "error_description": "The access token expired"
}
```
**Solution**: Refresh the token or re-authenticate

### Invalid Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```
**Solution**: Check request body and fix validation errors

### Resource Not Found
```json
{
  "success": false,
  "message": "Customer not found",
  "code": "CUSTOMER_NOT_FOUND"
}
```
**Solution**: Verify the resource ID exists

## Best Practices

1. **Token Management**:
   - Store access tokens and refresh tokens securely
   - Implement automatic token refresh before expiration
   - Handle 401 errors by refreshing or re-authenticating

2. **Customer Data**:
   - Validate customer data before submission
   - Store customer IDs for future orders
   - Keep customer information synchronized

3. **Orders and Subscriptions**:
   - Always validate cart contents before checkout
   - Store order references for tracking
   - Implement webhook handlers for order status updates

4. **Error Handling**:
   - Implement retry logic for transient failures
   - Log all API errors with context
   - Handle rate limiting (429 errors)

5. **Performance**:
   - Reuse tokens across multiple requests
   - Implement caching for product catalog
   - Use pagination for large result sets

## Complete Example

```javascript
// JavaScript/Node.js Example
const axios = require('axios');

const PROXY_BASE_URL = 'http://localhost:4000/api/tdsynnex';

async function tdsynnexWorkflow() {
  try {
    // 1. Authenticate
    const authResponse = await axios.post(`${PROXY_BASE_URL}/auth/token`, {
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET',
      grant_type: 'client_credentials'
    });
    
    const accessToken = authResponse.data.access_token;
    
    // 2. Create axios instance with auth header
    const tdsynnexApi = axios.create({
      baseURL: PROXY_BASE_URL,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    // 3. Create customer
    const customer = await tdsynnexApi.post('/customers', {
      name: 'Acme Corporation',
      email: 'admin@acme.com',
      country: 'US'
    });
    console.log('Customer created:', customer.data);
    
    // 4. Search products
    const products = await tdsynnexApi.get('/products?search=office365');
    console.log('Products found:', products.data);
    
    // 5. Create cart and add items
    const cart = await tdsynnexApi.post('/carts', {
      customerId: customer.data.id
    });
    
    await tdsynnexApi.post(`/carts/${cart.data.id}/items`, {
      productId: products.data.items[0].id,
      quantity: 5,
      billingCycle: 'monthly'
    });
    
    // 6. Place order
    const order = await tdsynnexApi.post('/orders', {
      cartId: cart.data.id,
      customerId: customer.data.id,
      purchaseOrderNumber: 'PO-2026-001'
    });
    console.log('Order placed:', order.data);
    
    // 7. Get order status
    const orderStatus = await tdsynnexApi.get(`/orders/${order.data.id}`);
    console.log('Order status:', orderStatus.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

tdsynnexWorkflow();
```

## Token Refresh Example

```javascript
let accessToken = null;
let refreshToken = null;
let tokenExpiry = null;

async function getValidToken() {
  // Check if token is still valid
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }
  
  // Try to refresh if we have a refresh token
  if (refreshToken) {
    try {
      const response = await axios.post(`${PROXY_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });
      
      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return accessToken;
    } catch (error) {
      // Refresh failed, need to re-authenticate
      refreshToken = null;
    }
  }
  
  // Get new token
  const response = await axios.post(`${PROXY_BASE_URL}/auth/token`, {
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    grant_type: 'client_credentials'
  });
  
  accessToken = response.data.access_token;
  refreshToken = response.data.refresh_token;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000);
  
  return accessToken;
}
```

## Related Documentation

- **TDSynnex API Direct Documentation**: See `TDSynnex/DOC/workflows/` for detailed TDSynnex API documentation
- **Also Integration**: [2_Also_Integration.md](2_Also_Integration.md)
- **Trend Integration**: [4_Trend_Integration.md](4_Trend_Integration.md)
- **Monitoring**: [5_Monitoring_and_Health.md](5_Monitoring_and_Health.md)
