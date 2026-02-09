# TDSynnex Backend API

Backend proxy/adapter service for TDSynnex StreamOne® Ion APIs. This backend provides a simplified REST API wrapper around the TDSynnex Ion platform, handling authentication, token management, and request proxying.

## Features

- 🔐 **OAuth2 Authentication** with automatic token refresh and caching
- 👥 **Customer Management** - Create and manage end customers
- 📦 **Product Catalog** - Browse and price cloud products
- 🛒 **Shopping Cart** - Full cart lifecycle management
- 📋 **Orders & Subscriptions** - Track provisioning and active subscriptions
- 📊 **Reports** - Generate billing reports and provisioning templates

## Technology Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client for TDSynnex API calls

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- TDSynnex Ion API credentials

### Installation

1. **Clone or navigate to the backend directory**
   ```bash
   cd TSSynnex/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` and fill in your TDSynnex credentials:
   ```env
   TDSYNNEX_API_BASE_URL=https://ion.tdsynnex.com
   TDSYNNEX_REFRESH_TOKEN=your_initial_refresh_token_here
   TDSYNNEX_ACCOUNT_ID=your_account_id_here
   PORT=3000
   ```

4. **Build the TypeScript code**
   ```bash
   npm run build
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Or start in production:
   ```bash
   npm start
   ```

6. **Verify the server is running**
   
   Open http://localhost:3000/health in your browser.

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/token` | Get new access token |
| POST | `/api/auth/refresh` | Refresh current token |
| POST | `/api/auth/validate` | Validate token |
| GET | `/api/auth/status` | Get auth status |
| POST | `/api/auth/logout` | Clear cached tokens |

### Customers (`/api/customers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create new customer |
| GET | `/api/customers/:customerId` | Get customer details |
| GET | `/api/customers/:customerId/cloud-profiles` | Get cloud profiles |

### Products (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Search products |
| GET | `/api/products/:productId` | Get product details |
| POST | `/api/products/pricing` | Get product pricing |
| POST | `/api/products/:productId/enable` | Enable product |
| POST | `/api/products/:productId/disable` | Disable product |

### Shopping Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers/:customerId/carts` | Create cart |
| GET | `/api/customers/:customerId/carts/:cartId` | Get cart |
| POST | `/api/customers/:customerId/carts/:cartId/items` | Add item |
| PUT | `/api/customers/:customerId/carts/:cartId/items/:itemId` | Update item |
| DELETE | `/api/customers/:customerId/carts/:cartId/items/:itemId` | Remove item |
| POST | `/api/customers/:customerId/carts/:cartId/checkout` | Checkout |

### Orders & Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| GET | `/api/customers/:customerId/orders` | List customer orders |
| GET | `/api/customers/:customerId/orders/:orderId` | Get order details |
| GET | `/api/subscriptions` | List subscriptions |
| GET | `/api/customers/:customerId/subscriptions/:subscriptionId` | Get subscription details |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/provisioning-templates` | Get provisioning schemas |
| GET | `/api/reports` | List available reports |
| POST | `/api/reports/:reportId/generate` | Generate report |

## Usage Examples

### 1. Get Access Token
```bash
POST http://localhost:3000/api/auth/refresh
```

Response:
```json
{
  "success": true,
  "data": {
    "access_token": "ZMM4MGEZMZGTYWFKYY...",
    "expires_in": 7200,
    "refresh_token": "MGFKYWE3MTYTYJJKNS...",
    "token_type": "Bearer"
  }
}
```

### 2. List Customers
```bash
GET http://localhost:3000/api/customers?pageSize=10
Authorization: Bearer YOUR_TOKEN
```

### 3. Create Customer
```bash
POST http://localhost:3000/api/customers
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "customerOrganization": "Acme Corp",
  "customerName": "John Doe",
  "customerEmail": "john.doe@acme.com",
  "customerAddress": {
    "street": "123 Tech Blvd",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94016",
    "country": "US"
  }
}
```

### 4. Search Products
```bash
GET http://localhost:3000/api/products?q=Microsoft&limit=5
Authorization: Bearer YOUR_TOKEN
```

### 5. Create Cart and Checkout
```bash
# Create cart
POST http://localhost:3000/api/customers/{customerId}/carts
Authorization: Bearer YOUR_TOKEN

# Add item
POST http://localhost:3000/api/customers/{customerId}/carts/{cartId}/items
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "MS-365-BUS-STD",
  "quantity": 5,
  "attributes": {}
}

# Checkout
POST http://localhost:3000/api/customers/{customerId}/carts/{cartId}/checkout
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "poNumber": "PO-12345"
}
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic & TDSynnex API calls
│   ├── routes/           # Express route definitions
│   ├── middleware/       # Custom middleware (auth, errors)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utilities (API client)
│   └── index.ts          # Application entry point
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Authentication Flow

The backend automatically manages OAuth2 tokens:

1. Initial token is loaded from `.env` (`TDSYNNEX_REFRESH_TOKEN`)
2. Token is cached in memory with expiration tracking
3. Before each API call, the token is automatically refreshed if needed
4. New refresh tokens are saved (single-use tokens)

## Error Handling

All endpoints return a standardized error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP status codes are preserved from TDSynnex API responses.

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## Notes

- All endpoint paths requiring authentication will automatically inject the Bearer token
- Account ID from `.env` is used for all account-scoped operations
- Token refresh happens automatically before requests

## Support

For TDSynnex API documentation, refer to the workflow guides in `../DOC/workflows/`
