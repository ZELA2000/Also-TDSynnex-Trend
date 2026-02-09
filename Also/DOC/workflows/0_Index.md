# Also Marketplace API Documentation

This directory contains workflow guides for the Also Marketplace API (`Marketplace_SimpleAPI`).

## API Workflow Overview

```mermaid
graph LR
    A[Start] --> B[1. Authentication]
    B --> C{What do you need?}
    
    C -->|Setup| D[2. Account Management]
    C -->|Products| E[3. Marketplace Catalog]
    C -->|Orders| F[4. Subscription Management]
    C -->|Reports| G[5. Reports & Finance]
    
    D --> H[Create Companies<br/>Resellers<br/>Users]
    E --> I[Search Products<br/>View Details<br/>Check Fields]
    F --> J[Purchase<br/>Update<br/>Cancel]
    G --> K[Billing Reports<br/>Credit Limits]
    
    style A fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style B fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style C fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style D fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style E fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style F fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style G fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
```

## Workflow Guides

1.  **Getting Started**:
    -   **[1_Authentication.md](1_Authentication.md)**: Authenticate with Session Tokens. **Start Here**.

2.  **Core Operations**:
    -   **[2_Account_Management.md](2_Account_Management.md)**: Create Companies, Resellers, and Users.
    -   **[3_Marketplace_Catalog.md](3_Marketplace_Catalog.md)**: Find products and required fields.
    -   **[4_Subscription_Management.md](4_Subscription_Management.md)**: Purchase, Update, and Cancel subscriptions.

3.  **Finance & Reporting**:
    -   **[5_Reports_and_Finance.md](5_Reports_and_Finance.md)**: Get billing reports and manage credit limits.
