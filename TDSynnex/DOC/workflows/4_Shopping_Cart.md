# Shopping Cart Workflow Guide

## Overview
The Shopping Cart API mimics a standard e-commerce flow. You create a temporary "cart" for a specific customer, add products (items) to it, configure them, and finally "checkout" to place the order.

## Authentication
Ensure you have a valid Bearer Token from the **[Authentication Guide](1_Authentication.md)**.
You also need a `customerId` from the **[Customer Management Guide](2_Customer_Management.md)**.

## Endpoints Summary

- **Cart Management**: `POST/GET/PUT/DELETE` on `/api/v3/customers/{customerId}/carts`
- **Item Management**: `POST/GET/PUT/DELETE` on `.../carts/{cartId}/cartItems`
- **Checkout**: `POST .../carts/{cartId}:checkout`

---

## Workflows

### 1. Create a Cart
**Goal**: Initialize a new shopping session for a customer.

**Request**:
`POST /api/v3/customers/{customerId}/carts`
(Body can be empty or contain initial metadata)

**Response**:
Returns a `cartId`. **Save this ID.**

### 2. Add Item to Cart
**Goal**: Add a product to the cart. This is where you specify quantity and configuration.

**Request**:
```http
POST /api/v3/customers/{customerId}/carts/{cartId}/cartItems HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "productId": "MS-365-BUS-STD",
  "quantity": 5,
  "attributes": {
     "key": "value"
     // Provider specific attributes (e.g. domain name) required for provisioning
  }
}
```

*Note: Determining the correct `attributes` usually requires checking the Product Details or Provisioning Template.*

**Response**:
Returns a `cartItemId`.

### 3. Review Cart
**Goal**: key check before checkout.

**Request**:
`GET /api/v3/customers/{customerId}/carts/{cartId}`

**Response**:
Returns full cart details, including total price and validation errors (if any configuration is missing).

### 4. Checkout (Place Order)
**Goal**: Finalize the purchase and trigger provisioning.

**Request**:
```http
POST /api/v3/customers/{customerId}/carts/{cartId}:checkout HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
   "poNumber": "MY-PO-12345" // Optional Purchase Order number
}
```

**Response**:
Returns an `orderId` (or a `listing` of generated orders if multiple vendors were involved).
The cart is usually emptied or archived after a successful checkout.

---

## Next Steps
- Track the status of your order in **[Orders and Subscriptions](5_Orders_and_Subscriptions.md)**.
