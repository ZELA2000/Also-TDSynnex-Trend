# Customer Management Workflow Guide

## Overview
This guide covers how to manage your End Customers. You need a Customer entity to place orders, assign licenses, and manage subscriptions.

## Authentication
Ensure you have a valid Bearer Token from the **[Authentication Guide](1_Authentication.md)**.
Include `Authorization: Bearer <token>` in all requests.

## Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v3/accounts/{accountId}/customers` | List all existing customers. |
| `POST` | `/api/v3/accounts/{accountId}/customers` | Create a new customer (and default user). |
| `GET` | `/api/v3/accounts/{accountId}/customers/{customerId}` | Get details of a specific customer. |
| `GET` | `/api/v3/accounts/{accountId}/customers/{customerId}/cloudProfiles` | Get cloud profiles (e.g., Microsoft Tenant ID). |

---

## Workflows

### 1. List Existing Customers
**Goal**: Retrieve a list of customers associated with your reseller account.

**Parameters**:
- `accountId`: Your Reseller Account ID.
- `pageSize`: (Optional) Number of records per page.
- `filter.customerName`: (Optional) Filter by name.

**Example Request**:
```http
GET /api/v3/accounts/{accountId}/customers?pageSize=10 HTTP/1.1
Host: ion.tdsynnex.com
Authorization: Bearer <token>
```

**Response**:
Returns a list of customers with their `id` (customerId), `name`, `email`, and `status`.

---

### 2. Create a New Customer
**Goal**: Onboard a new end-customer.
**Note**: This also automatically creates a default user for that customer.

**Recommended Payload**:
```json
{
  "customerOrganization": "Acme Corp",
  "customerName": "John Doe",
  "customerEmail": "john.doe@acme.com",
  "customerPhone": "+1234567890",
  "customerAddress": {
    "street": "123 Tech Blvd",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94016",
    "country": "US"
  },
  "languageCode": "en-US"
}
```

**Workflow Steps**:
1.  Submit `POST` to `/api/v3/accounts/{accountId}/customers`.
2.  **Save the `id`** from the response (this is the `customerId`).
3.  **Note the User Details**: The response includes `userName`, `password` (auto-generated), and `email` for the default admin user of this customer.

---

### 3. Get Customer Details & Cloud Profiles
**Goal**: Verify customer data or check for existing Microsoft/AWS tenants (Cloud Profiles).

**Get Customer**:
`GET /api/v3/accounts/{accountId}/customers/{customerId}`

**Get Cloud Profiles**:
`GET /api/v3/accounts/{accountId}/customers/{customerId}/cloudProfiles`

*Validating Cloud Profiles is crucial before placing orders for products that require specific tenant bindings (like Microsoft NCE).*
