# Reports and Provisioning Workflow Guide

## Overview
This section covers advanced operations: generating reports for billing/Usage and retrieving validation templates (schemas) required for complex product provisioning.

## Authentication
Ensure you have a valid Bearer Token from the **[Authentication Guide](1_Authentication.md)**.

## Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v3/accounts/{accountId}/provisionTemplates` | Get provisioning templates/schemas. |
| `GET` | `/api/v3/accounts/{accountId}/reports` | List available report types. |
| `POST` | `/api/v3/accounts/{accountId}/reports/{reportId}/report` | Request generation of a specific report. |

---

## Workflows

### 1. Retrieve Provisioning Templates
**Goal**: key for "Shopping Cart" items. Before adding a complex product (like AWS or Azure) to a cart, you need to know *exactly* what fields are required (e.g., `domain`, `tenantId`, `mpnId`).

**Steps**:
1.  Call `GET /api/v3/accounts/{accountId}/provisionTemplates`.
2.  Filter by the `vendor` or `product` you are interested in.
3.  Use the returned JSON Schema to validate your `cartItem` attributes.

### 2. Generate and Download Reports
**Goal**: Get a CSV of all billing data or active subscriptions.

**Steps**:
1.  **List Reports**: `GET /api/v3/accounts/{accountId}/reports` to find the `reportId` (e.g., "DailyBillingReport").
2.  **Request Report**:
    ```http
    POST /api/v3/accounts/{accountId}/reports/{reportId}/report HTTP/1.1
    Content-Type: application/json
    Authorization: Bearer <token>
    
    {
       "startDate": "2023-01-01",
       "endDate": "2023-01-31"
    }
    ```
3.  **Download**: The API will response with data or a link to download the CSV/stream.

### 3. Refresh Provider Cache
**Goal**: If you made changes directly in a Vendor portal (e.g., Microsoft Partner Center) and they aren't showing up in StreamOne, force a refresh.

**Request**:
`GET /api/v3/accounts/{accountId}/providers/{providerId}/refreshCacheEnhanced`
