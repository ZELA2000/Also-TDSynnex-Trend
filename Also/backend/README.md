# Also Marketplace Backend

Node.js/Express backend implementation for the Also Marketplace API. This backend provides a RESTful wrapper around the Also Marketplace Simple API, making it easier to integrate Also services into your applications.

## Features

- ✅ **Authentication**: Session-based authentication with token management
- ✅ **Account Management**: Create and update companies and users
- ✅ **Marketplace Catalog**: Discover marketplaces, services, and provisioning fields
- ✅ **Subscription Management**: Full CRUD operations for subscriptions
- ✅ **Reports & Finance**: Execute billing reports and manage credit limits
- 🔒 **Security**: Helmet.js security headers, CORS support
- 📝 **Logging**: Winston-based structured logging
- 🎯 **TypeScript**: Full type safety with TypeScript

## Prerequisites

- Node.js 18+ and npm
- Also Marketplace API credentials

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
PORT=3000
ALSO_API_BASE_URL=https://marketplacetest.ccpaas.net/SimpleAPI/SimpleAPIService.svc/rest
ALSO_API_USERNAME=your_username
ALSO_API_PASSWORD=your_password
```

## Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## Production

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check
```http
GET /api/health
```

---

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "UserName": "your_username",
  "Password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "C9C5MlqrpMwG/6bQ3mAVlm0Z6hi/eh1vsQs4i1I/g==",
  "message": "Authentication successful"
}
```

#### Validate Session
```http
POST /api/auth/validate
Authorization: Bearer <your_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <your_token>
```

---

### Company Management

#### Create Company
```http
POST /api/companies
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "Company": {
    "Name": "Example Company GmbH",
    "Email": "admin@example.com",
    "Address": "Example St. 1",
    "City": "Berlin",
    "Country": "DE",
    "Zip": "10115",
    "Phone": "+49123456789",
    "VatId": "DE123456789"
  }
}
```

#### Update Company
```http
PUT /api/companies/:id
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "Company": {
    "Address": "New Address St. 99",
    "City": "Munich"
  }
}
```

---

### User Management

#### Create User
```http
POST /api/users
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "User": {
    "Email": "user@example.com",
    "FirstName": "John",
    "LastName": "Doe",
    "Role": "User",
    "ParentAccountId": 100123
  }
}
```

#### Get Users
```http
GET /api/users/:accountId
Authorization: Bearer <your_token>
```

---

### Marketplace Catalog

#### List Marketplaces
```http
GET /api/marketplaces
Authorization: Bearer <your_token>
```

#### Get Services for Marketplace
```http
GET /api/marketplaces/:id/services
Authorization: Bearer <your_token>
```

#### Check Service Eligibility
```http
GET /api/services/eligible/:accountId
Authorization: Bearer <your_token>
```

#### Get Service Provisioning Fields
```http
GET /api/services/:serviceId/fields/:accountId
Authorization: Bearer <your_token>
```

---

### Subscription Management

#### Create Subscription
```http
POST /api/subscriptions
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "Subscription": {
    "ParentAccountId": 100123,
    "ServiceId": "Microsoft365BusinessBasic",
    "Quantity": 5,
    "Fields": [
      {
        "Id": "MsDomain",
        "Value": "customer.onmicrosoft.com"
      }
    ]
  }
}
```

#### Update Subscription
```http
PUT /api/subscriptions/:id
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "Subscription": {
    "Quantity": 10
  }
}
```

#### Get Subscription
```http
GET /api/subscriptions/:id
Authorization: Bearer <your_token>
```

#### List Subscriptions
```http
GET /api/subscriptions/account/:accountId?includeChildNodes=true
Authorization: Bearer <your_token>
```

#### Terminate Subscription
```http
DELETE /api/subscriptions/:id
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "Reason": "Customer request"
}
```

---

### Reports & Finance

#### List Available Reports
```http
GET /api/reports
Authorization: Bearer <your_token>
```

#### Execute Report
```http
POST /api/reports/execute
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "ReportName": "BillingData",
  "Parameters": [
    {
      "Name": "StartDate",
      "Value": "2023-10-01"
    },
    {
      "Name": "EndDate",
      "Value": "2023-10-31"
    }
  ]
}
```

#### Get Credit Limit
```http
GET /api/credit-limit/:accountId
Authorization: Bearer <your_token>
```

#### Set Credit Limit
```http
PUT /api/credit-limit/:accountId
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "CreditLimit": 50000
}
```

---

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run integration tests:
```bash
npm run test:integration
```

## Project Structure

```
Also/
├── src/
│   ├── client/
│   │   └── AlsoApiClient.ts      # HTTP client for Also API
│   ├── config/
│   │   └── index.ts               # Configuration management
│   ├── controllers/
│   │   ├── auth.controller.ts     # Authentication logic
│   │   ├── account.controller.ts  # Account management logic
│   │   ├── catalog.controller.ts  # Catalog discovery logic
│   │   ├── subscription.controller.ts  # Subscription logic
│   │   └── reports.controller.ts  # Reports and finance logic
│   ├── middleware/
│   │   ├── auth.ts                # Authentication middleware
│   │   └── errorHandler.ts       # Error handling middleware
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── account.routes.ts
│   │   ├── catalog.routes.ts
│   │   ├── subscription.routes.ts
│   │   ├── reports.routes.ts
│   │   └── index.ts               # Main router
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   └── logger.ts              # Winston logger
│   └── index.ts                   # Application entry point
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Workflows

The backend implements all workflows documented in `Also/DOC/workflows/`:

1. **Authentication** - Session token management
2. **Account Management** - Company and user operations
3. **Marketplace Catalog** - Service discovery and field validation
4. **Subscription Management** - Subscription lifecycle
5. **Reports and Finance** - Billing and credit management

## Error Handling

All API errors are returned in a consistent format:

```json
{
  "error": "Error message",
  "statusCode": 400,
  "details": "Additional error details (development only)"
}
```

## Logging

Logs are written to:
- `logs/error.log` - Error level logs
- `logs/combined.log` - All logs
- Console output (development mode)

## License

ISC
