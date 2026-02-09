# Authentication Workflow Guide

## Overview
The StreamOne® Ion APIs use the OAuth2 protocol for secure authentication. Before making any API calls to manage customers, orders, or products, you must obtain an **Access Token**.

This guide explains how to:
1. Obtain a new Access Token.
2. Validate an existing Access Token.
3. Refresh an expired Access Token.

## Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/oauth/token` | Requests a new access token or refreshes a token. |
| `POST` | `/oauth/validateAccess` | Validates if an access token is still active. |

---

## workflows

### 1. Initial Authentication (Get Token)
**Goal**: Obtain a generic `access_token` to authenticate subsequent API requests.

**Prerequisites**:
- You must have an initial token or credentials provided by the StreamOne® Ion admin portal (or a refresh token).

**Steps**:
1.  **Prepare the Request**:
    -   URL: `https://ion.tdsynnex.com/oauth/token`
    -   Method: `POST`
    -   Header: `Content-Type: application/x-www-form-urlencoded`
    -   Body: `grant_type=password&username=...&password=...` (Standard OAuth2) or via `refresh_token`.
    *Note: The API reference specifically mentions `grant_type` and `refresh_token` in schemas.*

2.  **Send Request** (Example using Refresh Token flow):
    ```http
    POST /oauth/token HTTP/1.1
    Host: ion.tdsynnex.com
    Content-Type: application/x-www-form-urlencoded

    grant_type=refresh_token&refresh_token=MGFKYWE3MTYTYJJKNS01YMRILWFJNJGTMJQ2ZDM2OWEZZWE3
    ```

3.  **Handle Response**:
    -   **Success (200 OK)**:
        ```json
        {
          "access_token": "ZMM4MGEZMZGTYWFKYY0ZNZBKLWE0NZETODZMN2IYYMM1NJA5",
          "expires_in": 7200,
          "refresh_token": "MGFKYWE3MTYTYJJKNS01YMRILWFJNJGTMJQ2ZDM2OWEZZWE3",
          "token_type": "Bearer"
        }
        ```
    -   **Important**:
        -   `access_token` is valid for **2 hours** (7200 seconds).
        -   `refresh_token` is valid for **32 days** but is **SINGLE USE** only. You get a new refresh token with each response.

### 2. Validate a Token
**Goal**: Check if your stored token is still valid before attempting an operation, to avoid 401 errors.

**Steps**:
1.  Call `/oauth/validateAccess`.
2.  Pass the `access_token` in the body.

**Example**:
```http
POST /oauth/validateAccess HTTP/1.1
Host: ion.tdsynnex.com
Content-Type: application/x-www-form-urlencoded

access_token=ZMM4MGEZMZGTYWFKYY0ZNZBKLWE0NZETODZMN2IYYMM1NJA5
```

**Response**:
```json
{
  "access_expires_in": 6673,
  "refresh_expires_in": 2764273
}
```

---

## Next Steps
Once you have the `access_token`:
1.  Include it in the **Authorization** header of every API call:
    `Authorization: Bearer <your_access_token>`
2.  Proceed to **[Customer Management](2_Customer_Management.md)** to list or create customers.
