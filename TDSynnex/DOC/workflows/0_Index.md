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
    
    style Start fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style Auth fill:#fff3e0,stroke:#e65100,stroke-width:3px
    style Core fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style Customers fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style Products fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style Shopping fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style Orders fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style Advanced fill:#fce4ec,stroke:#880e4f,stroke-width:2px
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
