# Subscription Management Workflow Guide

## Overview
This is the core of the Also Marketplace API: Purchasing, updating, and managing lifecycle events for services (e.g., Office 365, Azure).

## Authentication
Ensure you have a valid Session Token.
> See **[1_Authentication.md](1_Authentication.md)**.

## Endpoints
| Endpoint | Description |
| :--- | :--- |
| `POST /CreateSubscription` | Purchase a new service. |
| `POST /UpdateSubscription` | Change quantity or configuration. |
| `POST /GetSubscriptions` | List all subs for a customer. |
| `POST /TerminateAccount` | Cancel a subscription. |

## workflows

### 1. Purchase a Subscription (Create)
**Pre-requisite**: You must have called `GetFieldsForService` (see Catalog guide) to look up the correct field values (e.g., `MsDomain`).

**Request**:
`POST /CreateSubscription`

**Body**:
```json
{
  "Subscription": {
    "ParentAccountId": 100123,           // Customer ID
    "ServiceId": "Microsoft365BusinessBasic",
    "Quantity": 5,                       // Number of licenses
    "Fields": [                          // Dynamic fields from Catalog
      {
        "Id": "MsDomain",
        "Value": "customer.onmicrosoft.com"
      }
    ]
  }
}
```

**Response**:
Returns the created `Subscription` object with a new `AccountId` (the Subscription ID).

### 2. List Customer Subscriptions
**Goal**: See what a customer has purchased.

**Request**:
`POST /GetSubscriptions`

**Body**:
```json
{
  "AccountId": 100123,
  "IncludeChildNodes": true
}
```

### 3. Change Quantity (Update)
**Goal**: Add or remove seats.

**Request**:
`POST /UpdateSubscription`

**Body**:
```json
{
  "Subscription": {
    "AccountId": 555666,      // The Subscription ID
    "Quantity": 10            // New total quantity
  }
}
```

### 4. Cancel Subscription (Terminate)
**Goal**: Stop billing for a service.

**Request**:
`POST /TerminateAccount`

**Body**:
```json
{
  "AccountId": 555666,        // The Subscription ID
  "Reason": "Customer Request"
}
```
