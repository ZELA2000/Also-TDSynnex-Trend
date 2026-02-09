---
name: API Integration Issue
about: Problemi specifici di integrazione con le API esterne
title: '[API] '
labels: api, integration
assignees: ''
---

## 🔌 API Coinvolta

- [ ] Also Marketplace API
- [ ] TDSynnex StreamOne Ion API
- [ ] Trend Vision One API

## 🐛 Tipo di Problema

- [ ] Autenticazione fallita
- [ ] Endpoint non risponde / timeout
- [ ] Response format errato
- [ ] Rate limiting
- [ ] Parametri non accettati
- [ ] Errore di validazione
- [ ] Altro

## 📋 Dettagli Endpoint

**Endpoint**: `POST /api/endpoint/path`  
**Metodo HTTP**: `GET | POST | PUT | PATCH | DELETE`  
**Base URL**: `https://api.example.com`

## 🔐 Autenticazione (NON includere credenziali reali)

**Tipo di autenticazione usata**:
- [ ] Session Token (Also)
- [ ] OAuth 2.0 (TDSynnex)
- [ ] API Key (Trend)
- [ ] Bearer Token

**Problema di autenticazione**:
```
Descrivi se il problema è legato all'autenticazione
```

## 📤 Request

### Headers
```http
Content-Type: application/json
Authorization: Bearer ***REDACTED***
```

### Body
```json
{
  "param1": "value1",
  "param2": "value2"
}
```

### Query Parameters
```
?param1=value1&param2=value2
```

## 📥 Response

### Status Code
`[es. 401, 500, 422]`

### Headers
```http
Content-Type: application/json
X-RateLimit-Remaining: 0
```

### Body
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## ✅ Response Attesa

Descrivi quale response ti aspettavi di ricevere.

```json
{
  "success": true,
  "data": {
    // ...
  }
}
```

## 🔄 Frequenza del Problema

- [ ] Accade sempre (100%)
- [ ] Accade spesso (> 50%)
- [ ] Accade occasionalmente (< 50%)
- [ ] Accade raramente
- [ ] Accaduto una sola volta

## ⏱️ Timestamp / Rate Limiting

**Quando è accaduto**: `2026-02-09 14:30:00 UTC`  
**Rate limit hit**: `[ ] Sì [ ] No [ ] Non so`  
**Request/secondo**: `[es. 10 req/s]`

## 🌍 Ambiente

- **Backend Environment**: [Sandbox / Production]
- **Node.js Version**: [es. 18.17.0]
- **Network**: [es. Corporate proxy, Direct internet]
- **Region**: [es. EU, US, Asia]

## 📊 Impatto

- [ ] Critico - blocca tutte le operazioni
- [ ] Alto - impatta funzionalità principale
- [ ] Medio - impatta funzionalità secondaria
- [ ] Basso - workaround disponibile

## 🔍 Risoluzione Provata

Descrivi cosa hai già provato per risolvere il problema:

- [ ] Verificato credenziali API
- [ ] Controllato formato request
- [ ] Testato con Postman/curl
- [ ] Controllato documentazione API ufficiale
- [ ] Verificato network/firewall
- [ ] Altro: _______________

## 📝 Log / Debug Info

```
Incolla qui eventuali log rilevanti dall'applicazione
```

## 🔗 Riferimenti

- Link alla documentazione API ufficiale: 
- Issue correlate: 
- Postman Collection (se disponibile):

## 📸 Screenshot (opzionale)

Aggiungi screenshot di Postman, browser DevTools, o altro strumento di debug.

## 📝 Note Aggiuntive

Aggiungi qualsiasi altro contesto che possa aiutare a diagnosticare il problema.
