# Trend Vision One API Documentation

## API Workflow Overview

```mermaid
graph TD
    Start[Start] --> Auth[1. Authentication & Setup<br/>API Key Configuration]
    
    Auth --> Core{Select Operation}
    
    Core --> Alerts[2. Workbench Alerts]
    Core --> Endpoints[3. Endpoint Security]
    
    Alerts --> AlertOps[List Alerts<br/>Filter by Severity<br/>Update Status<br/>Investigate]
    
    Endpoints --> EndpointOps[List Endpoints<br/>Get Details<br/>Check Status]
    
    Endpoints --> Actions[Response Actions]
    Actions --> ActionOps[Isolate Endpoint<br/>Restore Connection<br/>Terminate Process<br/>Collect Files]
    
    AlertOps --> Monitor[Continuous Monitoring]
    ActionOps --> Monitor
    
    style Start fill:#4A90E2,stroke:#2E5C8A,stroke-width:4px,color:#fff
    style Auth fill:#FF9800,stroke:#E65100,stroke-width:5px,color:#000
    style Core fill:#9C27B0,stroke:#6A1B9A,stroke-width:4px,color:#fff
    style Alerts fill:#E91E63,stroke:#AD1457,stroke-width:4px,color:#fff
    style Endpoints fill:#4CAF50,stroke:#2E7D32,stroke-width:4px,color:#fff
    style Actions fill:#F44336,stroke:#C62828,stroke-width:4px,color:#fff
    style Monitor fill:#00BCD4,stroke:#006064,stroke-width:4px,color:#fff
```

This directory contains two types of documentation:
1.  **Workflows**: Hand-written guides for common use cases.
2.  **Generated References**: Full API specs generated from the JSON reference.

## Workflow Guides

1.  **Getting Started**:
    -   **[1_Authentication_and_Setup.md](1_Authentication_and_Setup.md)**: How to get your API Key and find your regional URL.

2.  **Core Operations**:
    -   **[2_Workbench_Alerts.md](2_Workbench_Alerts.md)**: Managing XDR alerts and incidents.
    -   **[3_Endpoint_Security.md](3_Endpoint_Security.md)**: Managing and isolating endpoints.

## Reference Documentation (Generated)
*Full parameter lists and schemas for all 63 API tags.*

-   [Accounts](Generated_Docs/Accounts.md)
-   [Audit Logs](Generated_Docs/Audit%20Logs.md)
-   [Attack Surface Discovery](Generated_Docs/Attack%20Surface%20Discovery.md)
-   [Endpoint Security](Generated_Docs/Endpoint%20Security.md)
-   [Workbench](Generated_Docs/Workbench.md)
-   [Search](Generated_Docs/Search.md)
-   [Threat Intelligence](Generated_Docs/Trend%20Threat%20Intelligence%20Feed.md)
-   *(See the `Generated_Docs` folder for the full list)*
