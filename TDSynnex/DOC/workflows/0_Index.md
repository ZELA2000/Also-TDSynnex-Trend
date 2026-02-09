# TDSynnex API Workflow Documentation

Welcome to the **Workflows Guide** for the StreamOne® Ion APIs. This documentation is organized by functional area to help you implement specific business processes.

## API Workflow Overview

```mermaid
graph TD
    Start[Start] --> Auth[1. Authentication<br/>Get Access Token]
    
    Auth --> Core{Core Workflows}
    
    Core --> Customers[2. Customer Management]
    Core --> Products[3. Product Catalog]
    Core --> Shopping[4. Shopping Cart]
    Core --> Orders[5. Orders & Subscriptions]
    
    Customers --> CustOps[List/Create<br/>Get Details<br/>Manage]
    Products --> ProdOps[Search<br/>Pricing<br/>Configuration]
    Shopping --> ShopOps[Create Cart<br/>Add Items<br/>Checkout]
    Orders --> OrderOps[Track Status<br/>Manage Subscriptions<br/>Provisioning]
    
    Core --> Advanced[6. Reports & Provisioning]
    Advanced --> AdvOps[Billing Data<br/>Provisioning Schemas]
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:4px,color:#fff
    style Auth fill:#FF9800,stroke:#E65100,stroke-width:5px,color:#000
    style Core fill:#9C27B0,stroke:#6A1B9A,stroke-width:4px,color:#fff
    style Customers fill:#4CAF50,stroke:#2E7D32,stroke-width:4px,color:#fff
    style Products fill:#2196F3,stroke:#1565C0,stroke-width:4px,color:#fff
    style Shopping fill:#00BCD4,stroke:#006064,stroke-width:4px,color:#fff
    style Orders fill:#E91E63,stroke:#AD1457,stroke-width:4px,color:#fff
    style Advanced fill:#FFC107,stroke:#F57F17,stroke-width:4px,color:#000
```

## Getting Started

1.  **Authentication**: You cannot do anything without an Access Token. Start here.
    -   **[1_Authentication.md](1_Authentication.md)**

## Core Workflows

2.  **Customers**: Manage your end-customers.
    -   **[2_Customer_Management.md](2_Customer_Management.md)** (List, Create, Get Details)

3.  **Products**: Browse the catalog and check pricing.
    -   **[3_Product_Catalog.md](3_Product_Catalog.md)** (Search, Pricing, Configuration)

4.  **Shopping**: Create carts and checkout orders.
    -   **[4_Shopping_Cart.md](4_Shopping_Cart.md)** (Cart Lifecycle, Checkout)

5.  **Orders**: Track fulfillment and subscriptions.
    -   **[5_Orders_and_Subscriptions.md](5_Orders_and_Subscriptions.md)** (Order Status, Subscription Management)

## Advanced

6.  **Reporting**: Get billing data and provisioning schemas.
    -   **[6_Reports_and_Provisioning.md](6_Reports_and_Provisioning.md)**
