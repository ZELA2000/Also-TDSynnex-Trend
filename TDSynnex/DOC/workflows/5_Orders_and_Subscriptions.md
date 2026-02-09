# Orders and Subscriptions Workflow Guide

## Overview
Once a cart is checked out, it becomes an **Order**. When an order is fulfilled (provisioned), it generates one or more **Subscriptions**.
This guide explains how to track order status and view active subscriptions.

## Authentication
Ensure you have a valid Bearer Token from the **[Authentication Guide](1_Authentication.md)**.

## Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v3/accounts/{accountId}/orders` | List orders for the reseller account. |
| `GET` | `/api/v3/accounts/{accountId}/customers/{customerId}/orders` | List orders for a specific customer. |
| `GET` | `/api/v3/accounts/{accountId}/customers/{customerId}/orders/{orderId}` | Get details of a specific order. |
| `GET` | `/api/v3/accounts/{accountId}/subscriptions` | List all subscriptions. |
| `GET` | `/api/v3/accounts/{accountId}/customers/{customerId}/subscriptions/{Id}` | Get details of a specific subscription. |

---

## Workflows

### 1. Track Order Status
**Goal**: Check if an order has been successfully provisioned.

**Steps**:
1.  Call `GET /api/v3/accounts/{accountId}/customers/{customerId}/orders/{orderId}`.
2.  Check the `status` field. Common statuses include:
    -   `PROCESSING`: Provisioning is underway.
    -   `COMPLETED`: Successfully provisioned.
    -   `FAILED`: Provisioning failed (check `statusDetail` for errors).

### 2. List Active Subscriptions
**Goal**: See what products a customer currently has active.

**Request**:
```http
GET /api/v3/accounts/{accountId}/customers/{customerId}/subscriptions?pageSize=20 HTTP/1.1
Authorization: Bearer <token>
```

**Response**:
Returns a list of subscriptions. **Key Fields**:
-   `subscriptionId`: Unique ID for the subscription.
-   `status`: e.g., `ACTIVE`, `SUSPENDED`.
-   `quantity`: Number of licenses.
-   `product`: Product details.

### 3. Manage Subscription (Upgrade/Downgrade)
**Context**: To change the quantity of an active subscription, you typically **create a new Order** with type `UPDATE`.

**Workflow**:
1.  Identified the `subscriptionId` you want to modify.
2.  Follow the **[Shopping Cart](4_Shopping_Cart.md)** flow, but add the item with a reference to the existing `subscriptionId` (depending on provider requirements, this might be a specific field in the cart item attributes).
3.  Checkout the cart. The system processes this as a `CHANGE` order.
