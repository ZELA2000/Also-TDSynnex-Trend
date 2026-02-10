# Guida ai Contributi

Grazie per il tuo interesse nel contribuire a questo progetto! 🎉

Questo documento fornisce linee guida e best practices per contribuire al progetto **Also + TDSynnex + Trend API Integration**.

## 📋 Indice

- [Codice di Condotta](#codice-di-condotta)
- [Come Posso Contribuire?](#come-posso-contribuire)
- [Setup Ambiente di Sviluppo](#setup-ambiente-di-sviluppo)
- [Processo di Sviluppo](#processo-di-sviluppo)
- [Standard di Codifica](#standard-di-codifica)
- [Testing](#testing)
- [Commit e Pull Request](#commit-e-pull-request)
- [Documentazione](#documentazione)
- [Segnalazione Bug](#segnalazione-bug)
- [Risorse Utili](#risorse-utili)

## 📜 Codice di Condotta

Questo progetto aderisce al [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Partecipando, ti impegni a rispettare questo codice. Segnala comportamenti inaccettabili aprendo una issue confidenziale.

## 🤝 Come Posso Contribuire?

Ci sono molti modi per contribuire a questo progetto:

### 🐛 Segnalazione di Bug

- Usa il [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml)
- Cerca prima tra le issue esistenti per evitare duplicati
- Includi passi dettagliati per riprodurre il problema
- Fornisci informazioni sull'ambiente (OS, Node.js version, ecc.)
- **Non includere mai credenziali reali o dati sensibili**

### ✨ Proposta di Nuove Funzionalità

- Usa il [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.yml)
- Descrivi chiaramente il problema che la funzionalità risolverebbe
- Fornisci esempi concreti di utilizzo
- Considera alternative e spiega perché la tua proposta è la migliore

### 🔌 Problemi di Integrazione API

- Usa il [API Integration Template](.github/ISSUE_TEMPLATE/api_integration.yml)
- Fornisci dettagli completi di request/response (redacted!)
- Includi riferimenti alla documentazione API ufficiale
- Descrivi tentativi già effettuati e workaround

### 📚 Miglioramenti alla Documentazione

- Usa il [Documentation Template](.github/ISSUE_TEMPLATE/documentation.yml)
- Segnala errori, typo o informazioni mancanti
- Proponi miglioramenti per rendere la documentazione più chiara
- Suggerisci esempi pratici o tutorial

### ❓ Domande e Supporto

- Usa il [Question Template](.github/ISSUE_TEMPLATE/question.yml)
- Consulta prima la documentazione esistente
- Descrivi cosa hai già provato
- Fornisci contesto sul tuo obiettivo

## 🛠️ Setup Ambiente di Sviluppo

### Prerequisiti

- **Node.js**: >= 18.0.0
- **npm** o **yarn**
- **Git**
- Account di sviluppo per le API (Also, TDSynnex, Trend)

### Setup Iniziale

1. **Fork del Repository**

   ```bash
   # Vai su GitHub e fai il fork del repository
   ```

2. **Clone del Fork**

   ```bash
   git clone https://github.com/TUO-USERNAME/Also-TDSynnex-Trend.git
   cd Also-TDSynnex-Trend
   ```

3. **Aggiungi Remote Upstream**

   ```bash
   git remote add upstream https://github.com/ZELA2000/Also-TDSynnex-Trend.git
   ```

4. **Installa Dependencies**

   Scegli il progetto su cui vuoi lavorare:

   ```bash
   # Per Also API
   cd Also/backend
   npm install
   
   # Per TDSynnex API
   cd TDSynnex/backend
   npm install
   
   # Per Trend API
   cd Trend/backend
   npm install
   
   # Per Unified Proxy
   cd Proxy/backend
   npm install
   ```

5. **Configura Variabili d'Ambiente**

   Crea un file `.env` nella directory del progetto:

   ```bash
   cp .env.example .env
   # Modifica .env con le tue credenziali
   ```

   **⚠️ IMPORTANTE**: Non committare mai il file `.env`!

6. **Verifica l'Installazione**

   ```bash
   npm run build
   npm test
   ```

## 🔄 Processo di Sviluppo

### 1. Crea un Branch

Crea sempre un nuovo branch per il tuo lavoro:

```bash
git checkout -b tipo/descrizione-breve
```

**Tipi di branch**:
- `feature/` - Nuove funzionalità
- `bugfix/` - Correzioni di bug
- `docs/` - Modifiche alla documentazione
- `refactor/` - Refactoring del codice
- `test/` - Aggiunta o modifica di test
- `chore/` - Task di manutenzione

**Esempi**:
```bash
git checkout -b feature/also-subscription-renewal
git checkout -b bugfix/tdsynnex-auth-token-expiry
git checkout -b docs/update-api-examples
```

### 2. Sviluppa

- Scrivi codice pulito e ben documentato
- Aggiungi test per nuove funzionalità
- Aggiorna la documentazione se necessario
- Segui gli [Standard di Codifica](#standard-di-codifica)

### 3. Testa

```bash
# Esegui i test
npm test

# Esegui i test con coverage
npm run test:coverage

# Esegui il linter
npm run lint

# Fix automatico dei problemi di linting
npm run lint:fix
```

### 4. Commit

Segui le [convenzioni di commit](#convenzioni-di-commit):

```bash
git add .
git commit -m "tipo(scope): descrizione breve"
```

### 5. Push e Pull Request

```bash
git push origin nome-del-tuo-branch
```

Poi apri una Pull Request su GitHub usando il [PR Template](.github/pull_request_template.md).

## 📝 Standard di Codifica

### TypeScript

- Usa **TypeScript** per tutto il codice
- Abilita `strict: true` in `tsconfig.json`
- Evita `any`; usa tipi specifici o `unknown`
- Documenta interfacce e tipi complessi

### Convenzioni di Naming

```typescript
// Classi e Interfacce: PascalCase
class AlsoApiClient {}
interface SubscriptionData {}

// Funzioni e variabili: camelCase
function fetchSubscription() {}
const userId = "123";

// Costanti: UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";
const MAX_RETRY_ATTEMPTS = 3;

// File: kebab-case
// subscription-controller.ts
// api-client.ts
```

### Struttura del Codice

```typescript
// 1. Imports
import { Request, Response } from 'express';
import { AlsoApiClient } from '../client/AlsoApiClient';

// 2. Interfacce e Tipi
interface SubscriptionRequest {
  customerId: string;
  planId: string;
}

// 3. Costanti
const DEFAULT_TIMEOUT = 30000;

// 4. Funzioni/Classi
export class SubscriptionController {
  // Metodi pubblici prima
  public async createSubscription(req: Request, res: Response) {
    // ...
  }
  
  // Metodi privati dopo
  private validateRequest(data: unknown): SubscriptionRequest {
    // ...
  }
}
```

### Error Handling

```typescript
// ✅ BUONO
try {
  const result = await apiClient.fetchData();
  return result;
} catch (error) {
  logger.error('Failed to fetch data', { error });
  throw new ApiError('Data fetch failed', 500, error);
}

// ❌ CATTIVO
try {
  const result = await apiClient.fetchData();
  return result;
} catch (error) {
  console.log(error); // Non usare console.log
  throw error; // Non fare re-throw grezzo
}
```

### Async/Await

```typescript
// ✅ BUONO
async function processSubscription(id: string): Promise<Subscription> {
  const data = await fetchSubscriptionData(id);
  const validated = await validateSubscription(data);
  return validated;
}

// ❌ CATTIVO
function processSubscription(id: string) {
  return fetchSubscriptionData(id)
    .then(data => validateSubscription(data))
    .then(validated => validated);
}
```

### Commenti e Documentazione

```typescript
/**
 * Recupera una subscription dal sistema Also.
 * 
 * @param subscriptionId - L'ID univoco della subscription
 * @param options - Opzioni aggiuntive per il fetch
 * @returns La subscription richiesta
 * @throws {ApiError} Se la subscription non esiste o l'API fallisce
 * 
 * @example
 * ```typescript
 * const subscription = await getSubscription('sub_123', { 
 *   includeDetails: true 
 * });
 * ```
 */
export async function getSubscription(
  subscriptionId: string,
  options?: FetchOptions
): Promise<Subscription> {
  // Implementation
}
```

## 🧪 Testing

### Struttura dei Test

```typescript
describe('SubscriptionController', () => {
  describe('createSubscription', () => {
    it('should create a new subscription successfully', async () => {
      // Arrange
      const mockRequest = createMockRequest({ planId: 'plan_123' });
      const mockResponse = createMockResponse();
      
      // Act
      await controller.createSubscription(mockRequest, mockResponse);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: expect.any(String) })
      );
    });
    
    it('should return 400 for invalid request', async () => {
      // Test error case
    });
  });
});
```

### Coverage

Mantieni una coverage minima del **80%**:

```bash
npm run test:coverage
```

### Test delle API

Non testare direttamente le API di produzione. Usa:
- Mock per i test unitari
- Ambiente sandbox/test per integration test
- Nock o MSW per mock delle chiamate HTTP

## 📤 Commit e Pull Request

### Convenzioni di Commit

Usiamo [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope): descrizione breve

[corpo opzionale]

[footer opzionale]
```

**Tipi**:
- `feat`: Nuova funzionalità
- `fix`: Correzione di bug
- `docs`: Modifiche alla documentazione
- `style`: Formattazione, punto e virgola mancante, ecc.
- `refactor`: Refactoring del codice
- `test`: Aggiunta o modifica di test
- `chore`: Modifiche al processo di build, dependencies, ecc.

**Scope** (opzionale):
- `also`, `tdsynnex`, `trend`, `proxy`
- `auth`, `subscription`, `catalog`, `reports`

**Esempi**:
```bash
feat(also): add subscription renewal endpoint
fix(tdsynnex): correct OAuth token refresh logic
docs(readme): update installation instructions
test(proxy): add integration tests for health checks
refactor(auth): simplify token validation logic
chore(deps): update express to v4.18.2
```

### Pull Request

1. **Titolo Chiaro**: Usa le convenzioni di commit
   ```
   feat(also): Add automatic subscription renewal
   ```

2. **Descrizione Completa**: Usa il [PR template](.github/pull_request_template.md)
   - Descrivi cosa cambia e perché
   - Riferisci le issue correlate (`Closes #123`)
   - Lista eventuali breaking changes
   - Aggiungi screenshot se applicabile

3. **Checklist**:
   - [ ] Ho testato le modifiche localmente
   - [ ] Ho aggiunto/aggiornato i test
   - [ ] Ho aggiornato la documentazione
   - [ ] Il codice passa il linter (`npm run lint`)
   - [ ] Tutti i test passano (`npm test`)
   - [ ] Ho seguito gli standard di codifica
   - [ ] Non ho committato credenziali o dati sensibili

4. **Request Review**: Tagga i reviewer appropriati

5. **Rispondi ai Feedback**: Rispondi a tutti i commenti di review

## 📚 Documentazione

### Quando Aggiornare la Documentazione

Aggiorna la documentazione quando:
- Aggiungi nuove funzionalità o endpoint
- Modifichi il comportamento esistente
- Correggi errori nella documentazione
- Aggiungi nuove configurazioni o variabili d'ambiente

### Dove Aggiornare

- **README.md**: Setup generale, overview del progetto
- **DOC/workflows/*.md**: Guide passo-passo per workflow specifici
- **OpenAPI Specs**: Per modifiche agli endpoint API
- **Code Comments**: Per logica complessa nel codice

### Stile della Documentazione

- Usa un linguaggio chiaro e conciso
- Fornisci esempi pratici
- Includi esempi di codice funzionanti
- Usa screenshot quando utile
- Mantieni la documentazione aggiornata con il codice

## 🐛 Segnalazione Bug

### Prima di Segnalare

1. Cerca tra le [issue esistenti](../../issues)
2. Verifica di usare l'ultima versione
3. Controlla la documentazione
4. Prova a riprodurre il bug

### Informazioni da Includere

- Descrizione chiara del problema
- Passi per riprodurre
- Comportamento atteso vs effettivo
- Screenshot o log (redatti!)
- Informazioni sull'ambiente
- Versioni (Node.js, package, OS)

### Esempio di Bug Report

```markdown
## 🐛 Descrizione
L'endpoint /api/subscriptions restituisce 500 invece di 404 quando la subscription non esiste

## 🔄 Passi per Riprodurre
1. Chiama GET /api/subscriptions/non-existent-id
2. Osserva la risposta

## ✅ Comportamento Atteso
Status: 404
Body: { "error": "Subscription not found" }

## ❌ Comportamento Effettivo
Status: 500
Body: { "error": "Internal server error" }

## 🌍 Ambiente
- OS: Windows 11
- Node.js: v18.17.0
- Package: v1.2.3
```

## 🔒 Sicurezza

### Responsabilità

- **Non committare mai credenziali**, API keys, o dati sensibili
- Usa `.env` per configurazioni sensibili
- Redigi sempre credenziali nelle issue/PR (`***REDACTED***`)
- Usa variabili d'ambiente per secrets
- Non loggare informazioni sensibili

### Segnalazione Vulnerabilità

Per segnalare vulnerabilità di sicurezza:
1. **NON aprire una issue pubblica**
2. Invia un'email privata ai maintainer
3. Fornisci dettagli sulla vulnerabilità
4. Attendi una risposta prima di divulgare pubblicamente

## 🌐 Risorse Utili

### Documentazione del Progetto

- [Also API Documentation](Also/DOC/README.md)
- [TDSynnex API Documentation](TDSynnex/DOC/README.md)
- [Trend API Documentation](Trend/DOC/README.md)
- [Proxy Documentation](Proxy/DOC/README.md)

### Documentazione Esterna

- [Also Marketplace API](https://marketplace.also.com/api/docs)
- [TDSynnex StreamOne](https://www.tdsynnex.com/streamone)
- [Trend Vision One](https://www.trendmicro.com/visionone)

### Strumenti

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🙏 Ringraziamenti

Grazie per aver dedicato del tempo a contribuire a questo progetto! Ogni contributo, grande o piccolo, è prezioso e apprezzato.

Se hai domande o hai bisogno di aiuto, non esitare a:
- Aprire una [Discussion](../../discussions)
- Chiedere nella issue correlata
- Contattare i maintainer

---

**Happy Contributing! 🚀**
