# Product Catalog Workflow Guide

## Overview
The Product Catalog APIs allow you to browse available cloud services (SKUs), check pricing, and manage product visibility for your reseller account.

## Authentication
Ensure you have a valid Bearer Token from the **[Authentication Guide](1_Authentication.md)**.

## Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v3/accounts/{accountId}/products` | Search and list products. |
| `GET` | `/api/v3/accounts/{accountId}/products/{productId}` | Get details for a specific product. |
| `POST` | `/api/v3/accounts/{accountId}/products:pricing` | Get real-time pricing for products. |
| `POST` | `/api/v3/accounts/{accountId}/products/{productId}:enable` | Enable a product for your catalog. |
| `POST` | `/api/v3/accounts/{accountId}/products/{productId}:disable` | Disable a product. |
| `GET` | `/api/v3/accounts/{accountId}/products_programs` | List configured programs. |
| `PUT` | `/api/v3/accounts/{accountId}/products_programs/{productId}:batchUpdate` | Batch update product programs. |

---

## Workflows

### 1. Search for Products
**Goal**: Find products to resell (e.g., "Microsoft 365 Business Standard").

**Parameters**:
- `limit`: Number of results (default 10).
- `offset`: Pagination offset.
- `q`: Search query string.
- `filters`: Filter by vendor, category, etc.

**Example Request**:
```http
GET /api/v3/accounts/{accountId}/products?q=Microsoft%20365&limit=5 HTTP/1.1
Authorization: Bearer <token>
```

**Response**:
Returns a list of products. **Key field**: `id` (the Product ID / SKU).

### 2. Check Product Pricing
**Goal**: Get the cost and retail price for specific products before adding them to a cart.

**Request**:
```http
POST /api/v3/accounts/{accountId}/products:pricing HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "productIds": ["MS-365-BUS-STD", "ANOTHER-SKU"]
}
```

**Response**:
Returns pricing details including `unitPrice`, `retailPrice`, and currency.

### 3. Product Details & Configuration
**Goal**: Get extended details, including **provisioning schema**.
Many cloud products (like Azure NCE) require specific configuration parameters (domain, tenant ID, quantity) during checkout.

**Step**:
Call `GET /api/v3/accounts/{accountId}/products/{productId}`.
Inspect the `configurations` or `constraints` fields to understand what data is needed for the Cart Item.

### 4. Manage Product Visibility
**Goal**: Control which products are visible/purchasable in your downstream marketplace.
- **Enable**: `POST .../products/{productId}:enable`
- **Disable**: `POST .../products/{productId}:disable`
