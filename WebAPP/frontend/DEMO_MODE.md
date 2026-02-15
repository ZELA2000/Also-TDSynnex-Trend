# 🎮 Demo Mode - Unified API Dashboard

## 📋 Overview

Il frontend è configurato con **dati demo/mock** per permettere di testare tutte le funzionalità senza dover configurare backend o API esterne.

## ✨ Cosa Include la Demo

### 🛍️ Product Catalog (12 prodotti)
- **6 prodotti Also**: Microsoft 365, AutoCAD, Zoom, QuickBooks, Norton, Mailchimp
- **6 prodotti TDSynnex**: Adobe Creative Cloud, Salesforce, Slack, Dropbox, Jira, DocuSign
- Categorie: Productivity, CAD Software, Communication, CRM, Security, Accounting, Cloud Storage, Project Management, Marketing, Document Management
- Prezzi variabili da $7.75 a $299/mese
- Alcuni prodotti non disponibili per testare filtri

### 📋 Subscriptions (6 subscriptions)
- **3 subscriptions Also**
- **3 subscriptions TDSynnex**
- Mix di stati: active, suspended
- Auto-renew: true/false
- Metadata inclusi (utenti, billing cycle, ecc.)

### �️ Security Dashboard (Trend Vision One)
- **8 alerts**: 3 critical, 2 high, 2 medium, 1 low
- **10 endpoints/agents**: Windows, Linux, macOS con diversi stati
- Status alerts: open, in_progress, closed
- Status endpoints: online, isolated, offline, disconnected
- Indicators of Compromise (IOCs): IP, hash, domain, email
- Impact scope: endpoints, users
- Real-time stats dashboard con auto-refresh (30s)
- Endpoint isolation/restoration actions
- Alert status management e note

### �📊 Dashboard Statistics
- Total Subscriptions: 248
- Active Subscriptions: 231
- Total Products: 1,420
- Total Customers: 89
- Critical Alerts: 3- Total Security Alerts: 8
- Total Endpoints: 10
- Online Endpoints: 6
- Isolated Endpoints: 1- Subscription Growth: +12.5%

## 🔧 Come Funziona

### Modalità Fallback Intelligente

Gli store Zustand tentano prima di chiamare le API reali, poi usano i dati mock come fallback:

```typescript
// Esempio: Products Store
try {
  const response = await alsoApi.getProducts();
  products = response.data;
} catch (err) {
  console.warn('API not available, using mock data');
  products = MOCK_PRODUCTS.filter(p => p.provider === 'also');
}
```

### 🎯 Comportamento

1. **API Disponibili**: Usa dati reali dalle API
2. **API Non Disponibili**: Usa dati mock automaticamente
3. **Mix**: Combina dati reali + mock se solo alcune API funzionano
4. **Banner Informativo**: Mostra avviso visivo quando in modalità demo

## 🧪 Test delle Funzionalità

### Product Catalog (/products)
✅ Visualizzazione grid/list  
✅ Filtro per provider (Also/TDSynnex/All)  
✅ Filtro per categoria (10 categorie)  
✅ Ricerca prodotti in tempo reale  
✅ Range prezzo ($7-$299)  
✅ Filtro disponibilità  
✅ Selezione per comparazione  

### Product Detail (/products/[id])
✅ Dettaglio completo prodotto  
✅ Metadata e informazioni aggiuntive  
✅ Pricing card  
✅ Quick actions  

### Product Comparison (/products/compare)
✅ Comparazione fino a 4 prodotti  
✅ Vista tabellare side-by-side  
✅ Evidenziazione prezzo migliore  
✅ Add/remove prodotti dinamicamente  

### Subscriptions (/subscriptions)
✅ Lista subscriptions  
✅ Filtro per provider  
✅ Filtro per status (active/suspended)  
✅ Ricerca  
✅ Dettaglio subscription  
✅ Create/Edit forms (mock)  

### Security Dashboard (/security)
✅ Overview stats con auto-refresh  
✅ Critical alerts highlight  
✅ Total/online/isolated endpoints count  
✅ Quick access to alerts e endpoints  

### Security Alerts (/security/alerts)
✅ Lista completa alert con filtri  
✅ Filtro per severity (critical/high/medium/low)  
✅ Filtro per status (open/in_progress/closed)  
✅ Ricerca per description/ID  
✅ Severity badges colorate  
✅ Icons per severity  

### Alert Detail (/security/alerts/[id])
✅ Dettaglio completo alert  
✅ Impact scope list  
✅ Indicators of Compromise (IOCs)  
✅ Status update dropdown  
✅ Note textarea (demo mode, non persistito)  
✅ Toast notifications  

### Endpoints Management (/security/endpoints)
✅ Lista endpoints con status  
✅ Filtro per status  
✅ Ricerca per nome/IP  
✅ Isolate endpoint action con confirm dialog  
✅ Restore endpoint action con confirm dialog  
✅ Status badges e icons  
✅ Auto-refresh ogni 60s  

### Threat Intelligence (/security/threats)
✅ IOC Lookup interface  
✅ Search by IOC type (IP, Domain, URL, File Hash, Email)  
✅ 7 mock IOCs in database  
✅ Risk score visualization (0-100)  
✅ Reputation badges (malicious/suspicious/unknown/clean)  
✅ Threat type classification  
✅ Timeline (first seen, last seen)  
✅ Occurrences count  
✅ Intelligence sources list  
✅ Tags e categorization  
✅ Geo location info  
✅ WHOIS data (for domains)  
✅ Related alerts e endpoints  
✅ Recent searches history  
✅ Known IOCs database preview  

### Dashboard (/)
✅ Statistiche aggregate  
✅ Card con trends  
✅ Quick links  

## 📁 File con Dati Mock

### Products
```
WebAPP/frontend/src/lib/stores/products.ts
```
Contiene `MOCK_PRODUCTS` array con 12 prodotti completi

### Subscriptions
```
WebAPP/frontend/src/lib/stores/subscriptions.ts
```
Contiene `MOCK_SUBSCRIPTIONS` array con 6 subscriptions

### Security (Trend Vision One)
```
WebAPP/frontend/src/lib/stores/securityStore.ts
```
Contiene:
- `MOCK_ALERTS` array con 8 alert (3 critical, 2 high, 2 medium, 1 low)
- `MOCK_ENDPOINTS` array con 10 endpoints (6 online, 1 isolated, 2 offline, 1 disconnected)
- `MOCK_IOCS` array con 7 indicators of compromise (IOCs)
- `calculateMockStats()` funzione per statistiche in tempo reale
- Fallback intelligente su tutte le operazioni API
- Demo mode per isolation/restoration actions
- IOC search e lookup con mock database

### Dashboard
```
WebAPP/frontend/src/app/dashboard/page.tsx
```
Statistiche mock hardcoded nella useEffect

## 🎨 UI Components Ready

### Banner Demo
- Visibile in alto in tutte le pagine dashboard
- Dismissible (X button)
- Spiega che si stanno usando dati demo
- Colore blue/indigo distintivo

### Tutti i Componenti Funzionanti
- ✅ ProductCard
- ✅ ProductFilters  
- ✅ ProductList
- ✅ SubscriptionCard
- ✅ SubscriptionList
- ✅ Dashboard Stats Cards
- ✅ Loading States
- ✅ Error States
- ✅ Empty States

## 🚀 Quick Start Demo

### 1. Avvia il Frontend
```bash
cd WebAPP/frontend
npm install
npm run dev
```

### 2. Accedi
- URL: http://localhost:3000
- Redirect automatico a `/login`
- Usa credenziali qualsiasi (auth mock)

### 3. Esplora
- **Dashboard**: Overview con stats
- **Products**: Catalogo 12 prodotti con filtri
- **Subscriptions**: 6 subscriptions demo
- **Comparazione**: Seleziona 2-4 prodotti e compara

## 🔄 Passaggio da Demo a Produzione

Quando le API saranno configurate:

1. **Nessuna modifica al codice necessaria!**
2. Gli store automaticamente useranno dati reali
3. Il banner demo non apparirà (o può essere condizionale)
4. I dati mock rimangono come fallback per resilienza

### Opzionale: Rimuovere Dati Mock

Se vuoi rimuovere completamente i mock in produzione:

```typescript
// In products.ts e subscriptions.ts
// Commenta/rimuovi MOCK_PRODUCTS e MOCK_SUBSCRIPTIONS
// Rimuovi i try/catch che usano fallback ai mock
```

## 📊 Dati Mock Dettagliati

### Prodotti per Categoria
- **Productivity Suite**: 1 prodotto (Microsoft 365)
- **CAD Software**: 1 prodotto (AutoCAD)
- **Communication**: 2 prodotti (Zoom, Slack)
- **Design Software**: 1 prodotto (Adobe Creative Cloud)
- **CRM**: 1 prodotto (Salesforce - unavailable)
- **Accounting**: 1 prodotto (QuickBooks)
- **Cloud Storage**: 1 prodotto (Dropbox)
- **Security**: 1 prodotto (Norton 360)
- **Project Management**: 1 prodotto (Jira)
- **Marketing**: 1 prodotto (Mailchimp)
- **Document Management**: 1 prodotto (DocuSign)

### Subscriptions per Provider
**Also (3)**:
- Microsoft 365 - 25 users - Active
- Zoom Enterprise - 50 users - Active
- AutoCAD - 5 users - Suspended (payment pending)

**TDSynnex (3)**:
- Adobe Creative Cloud - 10 users - Active
- Slack Business+ - 75 users - Active
- Dropbox Business - 15 users - Active

### Security Alerts by Severity
**Critical (3)**:
- Ransomware activity on multiple endpoints (open, 2h ago)
- Data exfiltration to external IP (open, 3h ago)

**High (2)**:
- Suspicious PowerShell execution (in_progress, 5h ago)
- Malicious email attachment opened (open, 12h ago)

**Medium (2)**:
- Unauthorized folder access attempt (in_progress, 24h ago)
- Unusual login pattern (closed, 48h ago)

**Low (2)**:
- Outdated software version (closed, 72h ago)
- Failed login attempts (open, 6h ago)

### Endpoints by Status
**Online (6)**:
- DESKTOP-ABC123 (Windows 11 Pro)
- SERVER-PROD-01 (Windows Server 2022)
- WORKSTATION-DEV-05 (Ubuntu 22.04)
- FILE-SERVER-02 (Windows Server 2019)
- LAPTOP-MOBILE-12 (Windows 11 Pro)
- VM-TEST-CENTOS (CentOS Linux 8)

**Isolated (1)**:
- LAPTOP-XYZ789 (Windows 10 Enterprise) - Ransomware detected

**Offline (2)**:
- MACBOOK-SALES-03 (macOS Sonoma) - 48h offline
- TABLET-FIELD-07 (Windows 10 IoT) - 24h offline

**Disconnected (1)**:
- DESKTOP-OLD-WIN7 (Windows 7 Professional) - 7 days offline

### Threat Intelligence IOCs (7 total)
**Critical IOCs (3)**:
- IP: 203.0.113.42 - C2 server (Risk: 95)
  * Tags: command-and-control, botnet, data-exfiltration
  * Sources: Trend Micro, VirusTotal, AbuseIPDB
  * Related: alert-003, endpoint-004
  
- Hash (SHA256): a1b2c3d4... - Ransomware (Risk: 98)
  * Tags: ransomware, encryption, lockbit
  * Sources: Trend Micro, VirusTotal
  * Related: alert-001, endpoints 001-002
  
- URL: https://malicious-site.example/payload.exe - Malware distribution (Risk: 92)
  * Tags: malware-distribution, trojan, drive-by-download
  * Sources: Trend Micro Web Security, URLhaus
  * Related: alert-002, endpoint-003

**High IOCs (3)**:
- Domain: suspicious-domain.xyz - Phishing (Risk: 88)
  * Tags: phishing, credential-theft
  * Sources: Trend Micro, PhishTank
  * WHOIS: Registered 20 days ago
  * Related: alert-003, endpoint-004
  
- Email: phishing@malicious.com - Phishing (Risk: 85)
  * Tags: phishing, spear-phishing, malware-delivery
  * Sources: Trend Micro Email Security
  * Related: alert-004
  
- Hash (SHA1): f7e8d9c0... - Exploit (Risk: 87)
  * Tags: powershell, privilege-escalation, persistence
  * Sources: Trend Micro, MITRE ATT&CK
  * Related: alert-002, endpoint-003

**Medium IOCs (1)**:
- IP: 192.168.1.100 - Suspicious activity (Risk: 65)
  * Tags: internal-scan, lateral-movement
  * Sources: Internal Detection
  * Geo: Internal Network
  * Related: alert-001, endpoint-001

## 🎯 Scenari di Test Consigliati

### Product Catalog
1. **Filtri Multipli**: Combina provider + category + price range
2. **Ricerca**: Cerca "Adobe", "Microsoft", "Cloud"
3. **Comparazione**: Confronta prodotti stesso provider vs diversi
4. **Disponibilità**: Filtra solo disponibili, vedi Salesforce sparire
5. **View Modes**: Passa tra Grid e List view
6. **Product Details**: Clicca su ogni prodotto per vedere dettagli

### Subscriptions
1. **Subscriptions Status**: Filtra solo "active" o "suspended"
2. **Provider Filter**: Visualizza solo Also o TDSynnex
3. **Search**: Cerca per nome prodotto o cliente

### Security Dashboard
1. **Overview Stats**: Visualizza statistiche aggregate in tempo reale
2. **Critical Alerts**: Clicca sul banner Critical Alerts per vedere solo critical
3. **Alert Filtering**: 
   - Filtra per severity (critical/high/medium/low)
   - Filtra per status (open/in_progress/closed)
   - Ricerca per description o ID
4. **Alert Detail**: 
   - Clicca su un alert
   - Vedi Impact Scope e IOCs
   - Cambia status da open → in_progress → closed
   - Aggiungi note (mock, non persistito)
5. **Endpoint Management**:
   - Filtra per status (online/isolated/offline)
   - Ricerca per endpoint name o IP
   - Isola un endpoint online (es. DESKTOP-ABC123)
   - Ripristina endpoint isolato (LAPTOP-XYZ789)
   - Conferma actions con dialog
6. **Auto-refresh**: 
   - Lascia aperta la dashboard e osserva stats refresh (30s)
   - Apri endpoints page e osserva refresh (60s)
7. **Toast Notifications**: 
   - Isola/Ripristina endpoint per vedere toast
   - Cambia status alert per vedere toast
8. **Threat Intelligence**:
   - Cerca IOC per tipo: prova "203.0.113.42" come IP
   - Cerca domain: "suspicious-domain.xyz"
   - Cerca email: "phishing@malicious.com"
   - Cerca hash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"
   - Cerca IOC non esistente per vedere "No Threat Found"
   - Vedi risk score, reputation, sources, tags
   - Clicca su "Related Alerts" per navigare agli alert
   - Usa "Known IOCs Database" per quick search
   - Controlla "Recent Searches" history

### General
9. **Mobile**: Testa responsive design su mobile

## 💡 Tips

- Il banner demo può essere chiuso con X
- Console log mostra "using mock data" quando APIs falliscono
- Tutti i dati hanno metadata realistici
- Prezzi variano per testare "lowest price" highlight
- Alcune subscriptions hanno auto-renew false per varietà

## 🐛 Troubleshooting

**Non vedo i prodotti?**
- Apri console: dovresti vedere "using mock data"
- Verifica che products.ts abbia MOCK_PRODUCTS

**Banner demo non appare?**
- Controlla DashboardLayout.tsx include <DemoBanner />
- Verifica import corretto di DemoBanner component

**Filtri non funzionano?**
- Store applica filtri lato client su MOCK_PRODUCTS
- Dovrebbero funzionare istantaneamente

---

**🎉 Enjoy la demo! Tutte le features sono completamente funzionanti con dati realistici.**
