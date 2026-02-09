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
    
    style A fill:#4A90E2,stroke:#2E5C8A,stroke-width:4px,color:#fff
    style B fill:#FF9800,stroke:#E65100,stroke-width:4px,color:#000
    style C fill:#9C27B0,stroke:#6A1B9A,stroke-width:4px,color:#fff
    style D fill:#4CAF50,stroke:#2E7D32,stroke-width:4px,color:#fff
    style E fill:#2196F3,stroke:#1565C0,stroke-width:4px,color:#fff
    style F fill:#E91E63,stroke:#AD1457,stroke-width:4px,color:#fff
    style G fill:#FFC107,stroke:#F57F17,stroke-width:4px,color:#000
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
