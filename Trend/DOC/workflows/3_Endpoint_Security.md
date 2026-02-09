# Endpoint Security Workflow Guide

## Overview
These APIs allow you to manage the inventory of endpoints (computers/servers) protected by Trend Micro Apex One or Cloud One - Workload Security. You can also trigger response actions like isolation.

## Authentication
Ensure you have a valid API Key from the **[Authentication Guide](1_Authentication_and_Setup.md)**.
Include `Authorization: Bearer <key>` in all requests.

## Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/v3.0/ei/endpoints` | List managed endpoints. |
| `POST` | `/v3.0/response/endpoints/isolate` | Isolate an endpoint from the network. |
| `POST` | `/v3.0/response/endpoints/restore` | Restore network access to an endpoint. |
| `POST` | `/v3.0/response/endpoints/collectFile` | Collect a suspicious file from an endpoint. |

---

## Workflows

### 1. List Managed Endpoints
**Goal**: Get a list of all agents, their status, and OS information.

**Request**:
```http
GET /v3.0/ei/endpoints HTTP/1.1
Host: api.xdr.trendmicro.com
Authorization: Bearer <key>
```

**Response**:
Returns a list containing:
-   `agentGuid`: The unique ID for the agent (critical for actions).
-   `endpointName`: Hostname.
-   `ipAddress`: IP list.
-   `osName`: Operating System.

### 2. Isolate a Compromised Endpoint
**Goal**: Cut off network access for a compromised machine (except for communication with the XDR server) to prevent lateral movement.

**Steps**:
1.  Find the `agentGuid` from the **List Endpoints** API or from a **Workbench Alert**.
2.  Send the isolation command.

**Request**:
```http
POST /v3.0/response/endpoints/isolate HTTP/1.1
Content-Type: application/json

[
  {
    "agentGuid": "example-guid-1234-5678",
    "description": "Isolating via API due to Alert WB-1234"
  }
]
```

**Response**:
Returns a `taskId` and `status` (`queued`, `running`). You can poll the Task API to check for completion.

### 3. Restore Connection
**Goal**: Re-enable network access after investigation/cleanup.

**Request**:
```http
POST /v3.0/response/endpoints/restore HTTP/1.1
Content-Type: application/json

[
  {
    "agentGuid": "example-guid-1234-5678"
  }
]
```
