# Reports and Finance Workflow Guide

## Overview
Automate your financial reconciliation by retrieving reports, invoices, and managing credit limits.

## Authentication
Ensure you have a valid Session Token.
> See **[1_Authentication.md](1_Authentication.md)**.

## Endpoints
| Endpoint | Description |
| :--- | :--- |
| `POST /GetReports` | List available report types. |
| `POST /ExecuteReport` | Generate a specific report (e.g., Billing Data). |
| `POST /GetCreditLimit` | Check a company's financial standing. |
| `POST /SetCreditLimit` | Update limits. |

## workflow

### 1. List Available Reports
**Goal**: See which reports you can run.

**Request**:
`POST /GetReports`
*(Empty Body)*

**Response**:
Returns an array of reports. Look for `Name` and `Parameters`. Common reports:
-   `BillingData`: Monthly consumption.
-   `SubscriptionList`: Active audits.

### 2. Run a Billing Report
**Goal**: Get billing data for a specific period.

**Request**:
`POST /ExecuteReport`

**Body**:
```json
{
  "ReportName": "BillingData",
  "Parameters": [
    {
      "Name": "StartDate",
      "Value": "2023-10-01"
    },
    {
      "Name": "EndDate",
      "Value": "2023-10-31"
    }
  ]
}
```

**Response**:
Returns the report data (format varies, often JSON or CSV-like structures within the JSON response).

### 3. Check Company Credit Limit
**Goal**: Verify if a customer has enough credit before buying.

**Request**:
`POST /GetCreditLimit`

**Body**:
```json
{
  "AccountId": 100123
}
```

**Response**:
Returns:
-   `Limit`: Max credit.
-   `Usage`: Current spent.
-   `Remaining`: Limit - Usage.

### 4. Approve/Decline Credit Checks
If manual approval is configured, use:
-   `POST /ListCreditCheckOrdersForApproval`
-   `POST /ApproveCreditCheckOrder`
-   `POST /DeclineCreditCheckOrder`
