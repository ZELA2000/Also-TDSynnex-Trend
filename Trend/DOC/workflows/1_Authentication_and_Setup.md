# Authentication and Setup - Trend Vision One

## Overview
Accessing Trend Vision One APIs requires an **Authentication Token**. This is typically a long-lived API Key that you generate from the Vision One console.

## Prerequisites
1.  A Trend Vision One account.
2.  Permissions to generate API Keys (Administration roles).

## 1. Obtain an API Key
Unlike OAuth2 flows that require a login exchange, Trend Vision One uses static API tokens for simplicity in automation.

1.  Log in to the **Trend Vision One** console.
2.  Navigate to **Administration > User Accounts > API Keys**.
3.  Click **Add API Key**.
4.  Configure:
    -   **Name**: A descriptive name (e.g., "SIEM Integration").
    -   **Role**: Select the role that defines permissions (e.g., "Standard User", "Administrator", or a custom role).
    -   **Expiration**: Set a validity period.
5.  **Copy the generated key immediately**. You cannot view it again later.

## 2. Identify Your Region
Your API requests must be sent to the correct regional data center. Using the wrong URL will result in 403/404 errors.

Common Base URLs:
-   **United States**: `https://api.xdr.trendmicro.com`
-   **Europe (Germany)**: `https://api.eu.xdr.trendmicro.com`
-   **Japan**: `https://api.xdr.trendmicro.co.jp`
-   **Australia**: `https://api.au.xdr.trendmicro.com`
-   **Singapore**: `https://api.sg.xdr.trendmicro.com`

*Check your console URL to determine your region (e.g., if you log into `portal.eu.xdr...`, use the EU API).*

## 3. Making Requests
Include the token in the `Authorization` header with the `Bearer` scheme.

**Example**:
```http
GET /v3.0/oat/detections HTTP/1.1
Host: api.xdr.trendmicro.com
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json;charset=utf-8
```

## 4. IP Allow Lists
If your organization uses IP restrictions:
1.  Go to **Administration > Network Security > IP Allow List** in the console.
2.  Add the public IP addresses of the servers/scripts that will be calling the API.
