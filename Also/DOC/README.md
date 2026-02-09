# Also Marketplace API - Documentation

Benvenuto nella documentazione dell'**API Also Marketplace**, la piattaforma cloud marketplace che consente di gestire sottoscrizioni, prodotti e account per soluzioni Microsoft e altre tecnologie cloud.

## 📚 Struttura della Documentazione

### OpenAPI Specification
- **[MarketplaceSimpleAPI-MarketplaceSimpleAPI-1.0.0-resolved.yaml](MarketplaceSimpleAPI-MarketplaceSimpleAPI-1.0.0-resolved.yaml)**: Specifica OpenAPI completa dell'API

### Guide Workflow

La directory `workflows/` contiene guide dettagliate per l'utilizzo dell'API:

1. **[0_Index.md](workflows/0_Index.md)**: Panoramica generale e indice di tutte le guide
2. **[1_Authentication.md](workflows/1_Authentication.md)**: Autenticazione con Session Token ⭐ **INIZIA DA QUI**
3. **[2_Account_Management.md](workflows/2_Account_Management.md)**: Gestione aziende, rivenditori e utenti
4. **[3_Marketplace_Catalog.md](workflows/3_Marketplace_Catalog.md)**: Catalogo prodotti e configurazione
5. **[4_Subscription_Management.md](workflows/4_Subscription_Management.md)**: Acquisto, modifica e cancellazione sottoscrizioni
6. **[5_Reports_and_Finance.md](workflows/5_Reports_and_Finance.md)**: Report di fatturazione e limiti di credito

## 🎯 Cosa fa Also Marketplace?

Also Marketplace è una piattaforma che fornisce:
- **Gestione Account** multi-livello (Company → Department → User)
- **Catalogo Prodotti** con Microsoft 365, Azure, e altre soluzioni cloud
- **Lifecycle Sottoscrizioni** completo (acquisto, upgrade, downgrade, cancellazione)
- **Billing & Reporting** con report finanziari e gestione crediti
- **API REST** per integrazioni B2B e portali di rivendita

## 🏗️ Architettura

```mermaid
graph TB
    Client["🖥️ Partner/Reseller Application"]
    
    API["⚡ Also Marketplace API<br/>Marketplace_SimpleAPI"]
    
    Auth["🔐 Authentication<br/>Session Token"]
    Accounts["🏢 Account Management<br/>Companies, Departments, Users"]
    Catalog["📦 Product Catalog<br/>Microsoft, Adobe, etc."]
    Subscriptions["📋 Subscriptions<br/>Lifecycle Management"]
    Reports["📊 Reports & Finance<br/>Billing, Credits"]
    
    Client -->|HTTPS + Session Token| API
    
    API --> Auth
    Auth --> Accounts
    Auth --> Catalog
    Auth --> Subscriptions
    Auth --> Reports
    
    Subscriptions -.->|Linked to| Accounts
    Subscriptions -.->|Uses| Catalog
    Reports -.->|Aggregates| Subscriptions
    
    style Client fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style API fill:#fff3e0,stroke:#e65100,stroke-width:3px
    style Auth fill:#ffebee,stroke:#c62828,stroke-width:2px
    style Accounts fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style Catalog fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style Subscriptions fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style Reports fill:#fff3e0,stroke:#e65100,stroke-width:2px
```

## 🚀 Quick Start

### 1. Prerequisiti
- Credenziali Also Marketplace valide
- Accesso alle API (fornito da Also)
- Base URL: dipende dalla tua istanza

### 2. Autenticazione

```bash
# Ottieni Session Token
curl -X POST https://your-also-instance/GetSessionToken \
  -H "Content-Type: application/json" \
  -d '{
    "UserName": "YOUR_USERNAME",
    "Password": "YOUR_PASSWORD"
  }'

# Response: "C9C5MlqrpMwG/6bQ3mAVlm0Z6hi/eh1vsQs4i1I/g=="
```

### 3. Usa il Session Token

```bash
# Tutte le richieste successive richiedono l'header Authenticate
curl https://your-also-instance/GetProducts \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_SESSION_TOKEN" \
  -d '{}'
```

## 📖 Esempi di Utilizzo

### Account Management

```bash
# Crea una nuova azienda
curl -X POST https://your-also-instance/CreateCompany \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "CompanyName": "Acme Corporation",
    "Address": {
      "Street": "Via Roma 1",
      "City": "Milano",
      "PostalCode": "20100",
      "Country": "IT"
    },
    "Contact": {
      "FirstName": "Mario",
      "LastName": "Rossi",
      "Email": "mario.rossi@acme.it",
      "Phone": "+39 02 1234567"
    }
  }'

# Crea un utente
curl -X POST https://your-also-instance/CreateUser \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "ParentAccountId": 100123,
    "UserName": "mario.rossi@acme.it",
    "FirstName": "Mario",
    "LastName": "Rossi",
    "Email": "mario.rossi@acme.it"
  }'
```

### Catalogo Prodotti

```bash
# Lista tutti i prodotti
curl -X POST https://your-also-instance/GetProducts \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{}'

# Ottieni dettagli prodotto
curl -X POST https://your-also-instance/GetProduct \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "ProductId": "MS-0A-O365-ENTERPRIS"
  }'

# Verifica campi richiesti
curl -X POST https://your-also-instance/GetRequiredProductFields \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "ProductId": "MS-0A-O365-ENTERPRIS"
  }'
```

### Gestione Sottoscrizioni

```bash
# Crea nuova sottoscrizione
curl -X POST https://your-also-instance/CreateSubscription \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "ProductId": "MS-0A-O365-ENTERPRIS",
    "Quantity": 10,
    "BillingCycle": "Monthly",
    "ParentAccountId": 100123,
    "Parameters": [
      {
        "Name": "DomainPrefix",
        "Value": "acmecorp"
      }
    ]
  }'

# Aggiorna quantità
curl -X POST https://your-also-instance/UpdateSubscriptionQuantity \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "SubscriptionId": "sub-12345",
    "Quantity": 15
  }'

# Cancella sottoscrizione
curl -X POST https://your-also-instance/CancelSubscription \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "SubscriptionId": "sub-12345"
  }'
```

### Report e Finanza

```bash
# Report fatturazione
curl -X POST https://your-also-instance/GetBillingReport \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "StartDate": "2026-02-01",
    "EndDate": "2026-02-28",
    "AccountId": 100123
  }'

# Ottieni limite di credito
curl -X POST https://your-also-instance/GetCreditLimit \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{
    "AccountId": 100123
  }'
```

## 🔐 Autenticazione

Also Marketplace utilizza **Session Token authentication**:

### Workflow Autenticazione

```mermaid
sequenceDiagram
    participant Client
    participant API as Also API
    
    Client->>API: POST /GetSessionToken<br/>{username, password}
    API-->>Client: SessionToken
    
    Note over Client: Memorizza token<br/>per riutilizzo
    
    Client->>API: POST /CreateCompany<br/>Header: Authenticate CCPSessionId TOKEN
    API-->>Client: CompanyId
    
    Client->>API: POST /GetProducts<br/>Header: Authenticate CCPSessionId TOKEN
    API-->>Client: Product List
    
    Note over Client,API: Token valido per<br/>durata sessione
    
    Client->>API: POST /TerminateSessionToken<br/>Header: Authenticate CCPSessionId TOKEN
    API-->>Client: Session Closed
```

### Best Practices
- ✅ Memorizza il Session Token in modo sicuro
- ✅ Riutilizza lo stesso token per multiple richieste
- ✅ Implementa refresh automatico alla scadenza
- ✅ Chiama `/TerminateSessionToken` quando hai finito
- ❌ Non includere credenziali nel codice sorgente
- ❌ Non loggare i Session Token

## 🏢 Gerarchia Account

```mermaid
graph TD
    Reseller[Reseller Account] --> Company1[Company 1]
    Reseller --> Company2[Company 2]
    
    Company1 --> Dept1[Department A]
    Company1 --> Dept2[Department B]
    
    Dept1 --> User1[User 1]
    Dept1 --> User2[User 2]
    Dept2 --> User3[User 3]
    
    User1 --> Sub1[Subscription 1<br/>Office 365 x10]
    User2 --> Sub2[Subscription 2<br/>Azure x5]
    User3 --> Sub3[Subscription 3<br/>Dynamics x2]
    
    style Reseller fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    style Company1 fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style Company2 fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style Dept1 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style Dept2 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style User1 fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style User2 fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style User3 fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style Sub1 fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style Sub2 fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style Sub3 fill:#fce4ec,stroke:#880e4f,stroke-width:2px
```

## 🔄 Lifecycle Sottoscrizione

```mermaid
stateDiagram-v2
    [*] --> Pending: CreateSubscription
    Pending --> Active: Provisioning Complete
    Active --> Suspended: Payment Issue
    Suspended --> Active: Payment Resolved
    Active --> Modified: UpdateQuantity<br/>ChangePlan
    Modified --> Active: Update Applied
    Active --> Cancelled: CancelSubscription
    Cancelled --> [*]
    
    note right of Pending
        Attesa provisioning<br/>
        da fornitore (Microsoft, ecc.)
    end note
    
    note right of Active
        Sottoscrizione attiva<br/>
        Fatturazione in corso
    end note
    
    note right of Suspended
        Servizio sospeso<br/>
        Richiede azione
    end note
```

## 🛠️ Sviluppo Backend

Il backend Node.js/TypeScript fornisce un layer REST per semplificare l'integrazione:

```bash
cd Also/backend
npm install
cp .env.example .env
# Configura ALSO_BASE_URL, ALSO_USERNAME, ALSO_PASSWORD
npm run dev
```

### Endpoint Backend

| Endpoint | Descrizione |
|----------|-------------|
| `POST /api/auth/login` | Ottieni session token |
| `POST /api/auth/logout` | Termina sessione |
| `GET /api/accounts/company` | Info azienda |
| `POST /api/accounts/resellers` | Crea reseller |
| `GET /api/catalog/products` | Lista prodotti |
| `GET /api/catalog/products/:id` | Dettagli prodotto |
| `POST /api/subscriptions` | Crea sottoscrizione |
| `PATCH /api/subscriptions/:id` | Aggiorna sottoscrizione |
| `DELETE /api/subscriptions/:id` | Cancella sottoscrizione |
| `GET /api/reports/billing` | Report fatturazione |

## 🔧 Troubleshooting

### Errori Comuni

| Errore | Causa | Soluzione |
|--------|-------|-----------|
| Session Token invalido | Token scaduto o errato | Richiedi nuovo token con `/GetSessionToken` |
| Parameter validation failed | Campi obbligatori mancanti | Verifica con `/GetRequiredProductFields` |
| Account not found | AccountId inesistente | Verifica AccountId con `/GetCompany` |
| Insufficient permissions | Permessi insufficienti | Contatta Also per permessi account |
| Product not available | Prodotto non più disponibile | Controlla catalogo aggiornato |

### Debug

```bash
# Test autenticazione
curl -v -X POST https://your-also-instance/GetSessionToken \
  -H "Content-Type: application/json" \
  -d '{"UserName":"user","Password":"pass"}'

# Test validità token
curl -X POST https://your-also-instance/PingPong \
  -H "Content-Type: application/json" \
  -H "Authenticate: CCPSessionId YOUR_TOKEN" \
  -d '{}'
```

## 📚 Risorse Aggiuntive

### Guide Workflow
- **[Authentication](workflows/1_Authentication.md)**: Setup e gestione session token
- **[Account Management](workflows/2_Account_Management.md)**: Creazione account hierarchy
- **[Marketplace Catalog](workflows/3_Marketplace_Catalog.md)**: Navigazione catalogo
- **[Subscription Management](workflows/4_Subscription_Management.md)**: Gestione completa sottoscrizioni
- **[Reports & Finance](workflows/5_Reports_and_Finance.md)**: Billing e reporting

### Backend README
- **Backend**: `Also/backend/README.md`

## 💡 Best Practices

1. **Autenticazione**:
   - Riutilizza Session Token per multiple richieste
   - Implementa auto-refresh prima della scadenza
   - Chiama sempre `/TerminateSessionToken` al termine

2. **Account Management**:
   - Segui gerarchia: Reseller → Company → Department → User
   - Memorizza AccountId per riferimenti futuri
   - Valida dati prima della creazione

3. **Sottoscrizioni**:
   - Verifica sempre campi richiesti con `/GetRequiredProductFields`
   - Testa in sandbox prima di produzione
   - Gestisci stati transitori (Pending, Provisioning)

4. **Performance**:
   - Batch operations quando possibile
   - Implementa caching per catalogo prodotti
   - Usa pagination per grandi dataset

5. **Error Handling**:
   - Log tutte le chiamate API
   - Gestisci retry per errori temporanei
   - Valida input prima di inviare richieste

## 🤝 Supporto

Per domande o problemi:
1. Consulta questa documentazione
2. Verifica i log dell'applicazione
3. Controlla OpenAPI specification
4. Contatta Also Support

## 📝 License

Questo backend è fornito come esempio di integrazione. Also Marketplace è un servizio commerciale di Also.

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Febbraio 2026  
**Compatibilità API**: Also Marketplace SimpleAPI
