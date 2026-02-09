# Authentication Workflow Guide - Also Marketplace

## Overview
The Also Marketplace API uses a **session-based authentication** mechanism. You must first exchange your credentials for a `SessionToken`, which is then validated and used in the headers of all subsequent requests.

## Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/GetSessionToken` | Exchanges username/password for a session token. |
| `POST` | `/PingPong` | Validates if a session is still active. |
| `POST` | `/TerminateSessionToken` | Logs out and invalidates the token. |

## workflow

### 1. Get a Session Token
**Goal**: Authenticate to start a session.

**Request**:
```http
POST /GetSessionToken HTTP/1.1
Content-Type: application/json;charset=utf-8

{
  "UserName": "YOUR_USERNAME",
  "Password": "YOUR_PASSWORD"
}
```

**Response**:
```json
"C9C5MlqrpMwG/6bQ3mAVlm0Z6hi/eh1vsQs4i1I/g=="
```
*Store this string. It is your `SessionToken`.*

### 2. Add Authentication Header
For **ALL** subsequent API calls (e.g., creating customers, placing orders), you must include the `Authenticate` header with the prefix `CCPSessionId`.

**Header Format**:
```http
Authenticate: CCPSessionId <Your_Session_Token>
```

**Example** (using `PingPong` to test):
```http
POST /PingPong HTTP/1.1
Content-Type: application/json;charset=utf-8
Authenticate: CCPSessionId C9C5MlqrpMwG/6bQ3mAVlm0Z6hi/eh1vsQs4i1I/g==

{}
```

### 3. Terminate Session (Logout)
**Goal**: Securely close the session when done.

**Request**:
```http
POST /TerminateSessionToken HTTP/1.1
Authenticate: CCPSessionId <Your_Session_Token>

{}
```
