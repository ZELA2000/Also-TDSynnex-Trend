# Unified API Proxy

Proxy unificato per l'accesso centralizzato alle API di Also Marketplace, TDSynnex StreamOne e Trend Vision One. Questo proxy fornisce un'interfaccia unificata per comunicare con tutte e tre le API attraverso un singolo endpoint.

## 🎯 Caratteristiche

- **Proxy Unificato**: Un unico punto di accesso per tre diverse API
- **Gestione Automatica Autenticazione**: 
  - Also: Authentication token con auto-refresh
  - TDSynnex: OAuth2 con gestione refresh token
  - Trend: API Key authentication
- **Logging Strutturato**: Winston per logging completo di tutte le richieste
- **Gestione Errori**: Error handling centralizzato con logging dettagliato
- **Type Safety**: TypeScript per sicurezza sui tipi
- **Security**: Helmet.js e CORS configurabili

## 🏗️ Architettura

```
Client Application
        ↓
Unified API Proxy (Port 4000)
        ↓
    ┌───┴────┬─────────┬──────────┐
    ↓        ↓         ↓          ↓
/api/also  /api/tdsynnex  /api/trend
    ↓        ↓         ↓          ↓
Also API  TDSynnex API  Trend API
(Port 3001) (Port 3002)  (Port 3003)
```

## 📋 Prerequisiti

- Node.js 18+ e npm
- Le tre API backend devono essere in esecuzione:
  - Also Marketplace Backend (porta 3001)
  - TDSynnex Backend (porta 3002)
  - Trend Vision One Backend (porta 3003)

## 🚀 Installazione

1. **Installa le dipendenze:**
```bash
cd Proxy/backend
npm install
```

2. **Configura le variabili d'ambiente:**
```bash
copy .env.example .env
```

3. **Modifica il file `.env` con le tue configurazioni:**
```env
# Proxy Server Configuration
PORT=4000
NODE_ENV=development
LOG_LEVEL=info

# Also Marketplace API Configuration
ALSO_API_BASE_URL=http://localhost:3001
ALSO_API_USERNAME=your_also_username
ALSO_API_PASSWORD=your_also_password

# TDSynnex API Configuration
TDSYNNEX_API_BASE_URL=http://localhost:3002
TDSYNNEX_REFRESH_TOKEN=your_tdsynnex_refresh_token
TDSYNNEX_ACCOUNT_ID=your_tdsynnex_account_id

# Trend Vision One API Configuration
TREND_API_BASE_URL=http://localhost:3003
TREND_API_KEY=your_trend_api_key
```

## 🎮 Utilizzo

### Modalità Sviluppo
```bash
npm run dev
```

### Build Production
```bash
npm run build
npm start
```

### Verifica il Server
Apri http://localhost:4000 nel browser o:
```bash
curl http://localhost:4000/api/health
```

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T10:00:00.000Z",
  "service": "Unified API Proxy",
  "uptime": 123.456,
  "apis": {
    "also": "available",
    "tdsynnex": "available",
    "trend": "available"
  }
}
```

### API Status
```http
GET /api/status
```

### Also Marketplace API
Tutti gli endpoint Also sono accessibili con il prefisso `/api/also`:

```http
# Esempio: Login
POST /api/also/auth/login
Content-Type: application/json

{
  "UserName": "username",
  "Password": "password"
}

# Esempio: Get Subscriptions
GET /api/also/subscriptions

# Esempio: Create Company
POST /api/also/companies
```

### TDSynnex StreamOne API
Tutti gli endpoint TDSynnex sono accessibili con il prefisso `/api/tdsynnex`:

```http
# Esempio: List Customers
GET /api/tdsynnex/customers

# Esempio: Search Products
GET /api/tdsynnex/products?search=microsoft

# Esempio: Create Customer
POST /api/tdsynnex/customers
```

### Trend Vision One API
Tutti gli endpoint Trend sono accessibili con il prefisso `/api/trend`:

```http
# Esempio: Test Authentication
GET /api/trend/auth/test

# Esempio: List Alerts
GET /api/trend/alerts?severity=high

# Esempio: List Endpoints
GET /api/trend/endpoints
```

## 🔄 Flusso di Autenticazione

### Also Marketplace
Il proxy gestisce automaticamente:
1. Login iniziale con username/password
2. Caching del token di sessione
3. Auto-refresh quando il token sta per scadere (23 ore)

### TDSynnex
Il proxy gestisce automaticamente:
1. Ottenimento access token dal refresh token
2. Caching dell'access token
3. Auto-refresh quando l'access token scade (50 minuti)

### Trend Vision One
Il proxy usa l'API key configurata per tutte le richieste.

## 📊 Logging

Il proxy utilizza Winston per il logging strutturato:

```
2026-02-06T10:00:00.000Z [info]: GET /api/also/subscriptions {"statusCode":200,"duration":"245ms"}
2026-02-06T10:01:00.000Z [info]: Proxying to Also API: GET /api/subscriptions
```

Livelli di log configurabili tramite `LOG_LEVEL` in `.env`:
- `error`: Solo errori
- `warn`: Warning ed errori
- `info`: Informazioni generali (default)
- `debug`: Debug dettagliato

## 🔒 Sicurezza

- **Helmet.js**: Security headers automatici
- **CORS**: Configurabile per limitare l'accesso
- **Token Management**: Token e credenziali gestiti in memoria, non esposti
- **Environment Variables**: Credenziali sensibili solo in `.env`

## 🛠️ Struttura del Progetto

```
Proxy/backend/
├── src/
│   ├── index.ts                 # Entry point del server
│   ├── config/
│   │   └── index.ts             # Configurazioni centralizzate
│   ├── clients/
│   │   ├── AlsoClient.ts        # Client per Also API
│   │   ├── TDSynnexClient.ts    # Client per TDSynnex API
│   │   └── TrendClient.ts       # Client per Trend API
│   ├── middleware/
│   │   ├── errorHandler.ts     # Gestione errori globale
│   │   └── logger.ts            # Middleware logging richieste
│   ├── routes/
│   │   ├── index.ts             # Router principale
│   │   ├── also.routes.ts       # Routes per Also
│   │   ├── tdsynnex.routes.ts   # Routes per TDSynnex
│   │   └── trend.routes.ts      # Routes per Trend
│   ├── types/
│   │   └── index.ts             # Type definitions TypeScript
│   └── utils/
│       └── logger.ts            # Utility logger Winston
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 📝 Esempi di Utilizzo

### JavaScript/Node.js
```javascript
const axios = require('axios');

const PROXY_URL = 'http://localhost:4000';

// Also API - Get Subscriptions
async function getAlsoSubscriptions() {
  const response = await axios.get(`${PROXY_URL}/api/also/subscriptions`);
  return response.data;
}

// TDSynnex API - List Customers
async function getTDSynnexCustomers() {
  const response = await axios.get(`${PROXY_URL}/api/tdsynnex/customers`);
  return response.data;
}

// Trend API - List Alerts
async function getTrendAlerts() {
  const response = await axios.get(`${PROXY_URL}/api/trend/alerts`, {
    params: { severity: 'high' }
  });
  return response.data;
}
```

### Python
```python
import requests

PROXY_URL = 'http://localhost:4000'

# Also API - Get Subscriptions
def get_also_subscriptions():
    response = requests.get(f'{PROXY_URL}/api/also/subscriptions')
    return response.json()

# TDSynnex API - List Customers
def get_tdsynnex_customers():
    response = requests.get(f'{PROXY_URL}/api/tdsynnex/customers')
    return response.json()

# Trend API - List Alerts
def get_trend_alerts():
    response = requests.get(f'{PROXY_URL}/api/trend/alerts', 
                           params={'severity': 'high'})
    return response.json()
```

### cURL
```bash
# Also API - Get Subscriptions
curl http://localhost:4000/api/also/subscriptions

# TDSynnex API - List Customers
curl http://localhost:4000/api/tdsynnex/customers

# Trend API - List Alerts
curl "http://localhost:4000/api/trend/alerts?severity=high"
```

## 🐛 Troubleshooting

### Il proxy non si connette a un'API backend

1. Verifica che l'API backend sia in esecuzione
2. Controlla l'URL configurato in `.env`
3. Controlla i log del proxy per errori specifici

### Errori di autenticazione

1. Verifica che le credenziali in `.env` siano corrette
2. Per TDSynnex, assicurati che il refresh token sia valido
3. Per Trend, verifica che l'API key sia corretta

### Timeout delle richieste

Il timeout predefinito è 30 secondi. Se le richieste impiegano più tempo, puoi modificare il timeout nei client:
```typescript
// In src/clients/AlsoClient.ts (o altri client)
this.client = axios.create({
    baseURL: config.also.baseUrl,
    timeout: 60000, // 60 secondi
    // ...
});
```

## 🔄 Aggiornamenti Futuri

Funzionalità pianificate:
- [ ] Rate limiting
- [ ] Caching delle risposte
- [ ] Metrics e monitoring (Prometheus)
- [ ] API key authentication per i client del proxy
- [ ] Load balancing per le API backend
- [ ] Retry logic con exponential backoff
- [ ] Circuit breaker pattern per fault tolerance

## 📄 Licenza

ISC

## 👥 Supporto

Per problemi o domande, consulta la documentazione delle singole API:
- [Also Marketplace API](../Also/backend/README.md)
- [TDSynnex StreamOne API](../TDSynnex/backend/README.md)
- [Trend Vision One API](../Trend/backend/README.md)
