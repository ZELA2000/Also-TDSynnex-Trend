# Marketplace Catalog Workflow Guide

## Overview
Before purchasing a subscription, you need to know which services are available and what inputs (fields) they require.
The **Marketplace** APIs allow you to explore the catalog and valid product configurations.

## Authentication
Ensure you have a valid Session Token. Include it in the `Authenticate` header.
> See **[1_Authentication.md](1_Authentication.md)**.

## workflows

### 1. List Available Marketplaces
**Goal**: Get the ID of the marketplace you have access to.

**Request**:
`POST /GetMarketplaces`
*(Empty Body)*

**Response**:
Returns a list of marketplaces. note the `MarketplaceId` (e.g., `1`).

### 2. Discover Services (Products)
**Goal**: List all products available in a specific marketplace.

**Request**:
`POST /GetAvailableServicesForMarketplace`

**Body**:
```json
{
  "MarketplaceId": 1
}
```

**Response**:
Returns an array of services. Key fields:
-   `ServiceId`: The unique ID (e.g., `Microsoft365BusinessBasic`).
-   `Name`: Display name.
-   `IsAddon`: `true`/`false`.

### 3. Check Eligibility for a Customer
**Goal**: Check which services *this specific customer* is allowed to buy. Some services might be restricted or mutually exclusive.

**Request**:
`POST /GetPossibleServicesForParent`

**Body**:
```json
{
  "AccountId": 100123  // The Customer's AccountId
}
```

### 4. Get Provisioning Fields (Critical)
**Goal**: Before creating a subscription, you must know what data Microsoft/Vendor requires (e.g., "Microsoft Domain", "Contact Email"). This API tells you exactly what fields to send.

**Request**:
`POST /GetFieldsForService`

**Body**:
```json
{
  "AccountId": 100123,     // The Customer
  "ServiceId": "Microsoft365BusinessBasic"
}
```

**Response**:
Returns a `Fields` array. Each field object contains:
-   `Id`: The field name (e.g., `MsDomain`).
-   `IsMandatory`: `true`/`false`.
-   `Type`: `Text`, `Enum`, etc.
-   `ValidationExpression`: Regex for validation.
