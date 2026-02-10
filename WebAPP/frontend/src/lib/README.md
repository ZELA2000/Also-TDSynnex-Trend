# API Client Documentation

Documentazione completa per l'utilizzo del client API frontend.

## 📚 Indice

- [Panoramica](#panoramica)
- [Configurazione](#configurazione)
- [API Client Base](#api-client-base)
- [Endpoint Disponibili](#endpoint-disponibili)
- [State Management](#state-management)
- [Esempi di Utilizzo](#esempi-di-utilizzo)
- [Error Handling](#error-handling)

## 🎯 Panoramica

Il frontend comunica con il **Unified Proxy** (porta 3000) che gestisce le chiamate verso:
- Also Marketplace API (porta 4001)
- TDSynnex StreamOne API (porta 4002)
- Trend Vision One API (porta 4003)

## ⚙️ Configurazione

### Variabili d'Ambiente

```env
# .env o .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Struttura Files

```
src/lib/
├── api-client.ts           # Client Axios base con interceptors
├── api.ts                  # Endpoint organizzati per provider
├── auth.ts                 # Zustand store per autenticazione
├── stores/
│   └── subscriptions.ts    # Zustand store per subscriptions
└── api-examples.ts         # Esempi di utilizzo
```

## 🔧 API Client Base

### Features

✅ **Retry Logic**: Ritenta automaticamente le richieste fallite (max 3 tentativi)  
✅ **Error Handling**: Formatta gli errori in modo consistente  
✅ **Interceptors**: Aggiunge automaticamente token di autenticazione  
✅ **Type Safety**: Completamente tipizzato con TypeScript  
✅ **Logging**: Log delle richieste in development mode  

### Metodi Disponibili

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const data = await apiClient.get<YourType>('/endpoint');

// POST request
const result = await apiClient.post<YourType>('/endpoint', { data });

// PUT request
await apiClient.put<YourType>('/endpoint/id', { data });

// DELETE request
await apiClient.delete('/endpoint/id');

// GET with pagination
const paginated = await apiClient.getPaginated<YourType>('/endpoint', {
  page: 1,
  limit: 10
});
```

## 📡 Endpoint Disponibili

### Also Marketplace API

```typescript
import { alsoApi } from '@/lib/api';

// Authentication
await alsoApi.login({ username, password });

// Subscriptions
const subs = await alsoApi.getSubscriptions({ page: 1, limit: 10 });
const sub = await alsoApi.getSubscription(id);
await alsoApi.createSubscription(data);
await alsoApi.updateSubscription(id, data);
await alsoApi.cancelSubscription(id);

// Products
const products = await alsoApi.getProducts({ category: 'software' });
const product = await alsoApi.getProduct(id);

// Accounts
const account = await alsoApi.getAccount(id);
```

### TDSynnex StreamOne API

```typescript
import { tdsynnexApi } from '@/lib/api';

// Authentication
await tdsynnexApi.authenticate();

// Customers
const customers = await tdsynnexApi.getCustomers();
const customer = await tdsynnexApi.getCustomer(id);
await tdsynnexApi.createCustomer(data);

// Subscriptions
const subs = await tdsynnexApi.getSubscriptions({ customerId: 'xxx' });
await tdsynnexApi.createSubscription(data);

// Products
const products = await tdsynnexApi.getProducts();
const results = await tdsynnexApi.searchProducts('Microsoft');
```

### Trend Vision One API

```typescript
import { trendApi } from '@/lib/api';

// Security Alerts
const alerts = await trendApi.getAlerts({ 
  severity: 'critical', 
  status: 'open' 
});
await trendApi.acknowledgeAlert(id);
await trendApi.resolveAlert(id);

// Endpoints
const endpoints = await trendApi.getEndpoints();
const endpoint = await trendApi.getEndpoint(id);

// Workbench
const workbenchAlerts = await trendApi.getWorkbenchAlerts();
```

### Unified API (Aggregated)

```typescript
import { unifiedApi } from '@/lib/api';

// Get data from all providers
const allSubs = await unifiedApi.getAllSubscriptions();
const allProducts = await unifiedApi.getAllProducts();
const stats = await unifiedApi.getDashboardStats();
```

## 🗄️ State Management

### Auth Store (Zustand)

```typescript
import { useAuthStore } from '@/lib/auth';

function Component() {
  const { isAuthenticated, user, login, logout } = useAuthStore();

  const handleLogin = async () => {
    const response = await alsoApi.login({ username, password });
    if (response.success) {
      login(response.data.token, response.data.user);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user?.name}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Subscriptions Store

```typescript
import { useSubscriptionsStore } from '@/lib/stores/subscriptions';

function SubscriptionsList() {
  const { 
    subscriptions, 
    loading, 
    error, 
    fetchSubscriptions,
    createSubscription 
  } = useSubscriptionsStore();

  useEffect(() => {
    fetchSubscriptions('all'); // 'also' | 'tdsynnex' | 'all'
  }, [fetchSubscriptions]);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <ul>
      {subscriptions.map(sub => (
        <li key={sub.id}>{sub.provider} - {sub.status}</li>
      ))}
    </ul>
  );
}
```

## 💡 Esempi di Utilizzo

### Esempio 1: Fetch e Display Data

```typescript
'use client';

import { useState, useEffect } from 'react';
import { alsoApi } from '@/lib/api';
import type { Subscription } from '@/types';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await alsoApi.getSubscriptions();
        if (response.success && response.data) {
          setSubscriptions(response.data);
        }
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Subscriptions</h1>
      {subscriptions.map(sub => (
        <div key={sub.id}>{sub.status}</div>
      ))}
    </div>
  );
}
```

### Esempio 2: Create Subscription

```typescript
async function handleCreateSubscription(formData: any) {
  try {
    const newSub = {
      provider: 'also' as const,
      customerId: formData.customerId,
      productId: formData.productId,
      price: parseFloat(formData.price),
      currency: 'EUR',
      autoRenew: formData.autoRenew,
    };

    const response = await alsoApi.createSubscription(newSub);
    
    if (response.success) {
      alert('Subscription created successfully!');
      // Refresh list or redirect
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}`);
    }
  }
}
```

### Esempio 3: Unified Data con Aggregazione

```typescript
async function loadDashboard() {
  try {
    // Fetch in parallelo da più provider
    const [alsoSubs, tdSubs, alerts] = await Promise.all([
      alsoApi.getSubscriptions({ limit: 5 }),
      tdsynnexApi.getSubscriptions({ limit: 5 }),
      trendApi.getAlerts({ severity: 'critical' }),
    ]);

    // Aggrega i risultati
    const allSubscriptions = [
      ...(alsoSubs.data || []),
      ...(tdSubs.data || []),
    ];

    return {
      subscriptions: allSubscriptions,
      alerts: alerts.data || [],
      totalSubs: allSubscriptions.length,
    };
  } catch (error) {
    console.error('Dashboard load failed:', error);
    throw error;
  }
}
```

## ⚠️ Error Handling

### Try-Catch Pattern

```typescript
try {
  const response = await alsoApi.getSubscription(id);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    // Error già formattato dal client
    console.error(error.message);
    
    // Show to user
    toast.error(error.message);
  }
}
```

### Con React Error Boundaries

```typescript
function SubscriptionDetails({ id }: { id: string }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    alsoApi.getSubscription(id)
      .then(res => setData(res.data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return <div>{/* Render data */}</div>;
}
```

### Global Error Handler

```typescript
// In un componente root o layout
useEffect(() => {
  // Intercetta errori non gestiti
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled API error:', event.reason);
    toast.error('An unexpected error occurred');
  });
}, []);
```

## 🔐 Autenticazione

### Flow di Login

```typescript
import { useAuthStore } from '@/lib/auth';
import { alsoApi } from '@/lib/api';

async function handleLogin(username: string, password: string) {
  const { login } = useAuthStore.getState();

  try {
    const response = await alsoApi.login({ username, password });
    
    if (response.success && response.data) {
      // Store token globally
      login(response.data.token, response.data.user);
      
      // Token viene automaticamente aggiunto a tutte le richieste successive
      router.push('/dashboard');
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}
```

### Protected Routes

```typescript
'use client';

import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

## 📊 Type Safety

Tutti gli endpoint sono completamente tipizzati:

```typescript
// TypeScript inferisce automaticamente i tipi
const response = await alsoApi.getSubscriptions();
// response è di tipo PaginatedResponse<Subscription>

const subscription = response.data?.[0];
// subscription è di tipo Subscription | undefined

// Autocomplete funziona perfettamente
subscription?.provider // 'also' | 'tdsynnex' | 'trend'
subscription?.status  // 'active' | 'suspended' | 'cancelled' | 'pending'
```

---

## 🔗 Links Utili

- [Proxy API Documentation](../../Proxy/DOC/README.md)
- [Also API Documentation](../../Also/DOC/README.md)
- [TDSynnex API Documentation](../../TDSynnex/DOC/README.md)
- [Trend API Documentation](../../Trend/DOC/README.md)
