# GitHub Templates

Questa directory contiene i template per le GitHub Issues e Pull Requests del progetto.

## 📋 Issue Templates

Quando crei una nuova issue, ti verrà chiesto di scegliere tra i seguenti template:

### 🐛 [Bug Report](ISSUE_TEMPLATE/bug_report.md)
Usa questo template per segnalare bug o comportamenti anomali in uno dei quattro progetti (Also, TDSynnex, Trend, Proxy).

**Quando usarlo**:
- L'applicazione si blocca o genera errori
- Un endpoint API restituisce risposte inaspettate
- Il comportamento non corrisponde alla documentazione

### ✨ [Feature Request](ISSUE_TEMPLATE/feature_request.md)
Proponi nuove funzionalità o miglioramenti al progetto.

**Quando usarlo**:
- Hai un'idea per una nuova feature
- Vuoi suggerire un miglioramento a una funzionalità esistente
- Vuoi proporre una nuova integrazione o endpoint

### 📚 [Documentation Issue](ISSUE_TEMPLATE/documentation.md)
Segnala problemi o suggerisci miglioramenti alla documentazione.

**Quando usarlo**:
- Hai trovato informazioni errate o obsolete
- La documentazione è poco chiara o mancante
- Gli esempi di codice non funzionano
- Vuoi suggerire miglioramenti alla documentazione

### ❓ [Question / Support](ISSUE_TEMPLATE/question.md)
Fai domande o richiedi supporto tecnico.

**Quando usarlo**:
- Non capisci come usare una funzionalità
- Hai bisogno di aiuto per l'integrazione
- Hai domande generali sul progetto

### 🔌 [API Integration Issue](ISSUE_TEMPLATE/api_integration.md)
Problemi specifici di integrazione con le API esterne (Also, TDSynnex, Trend).

**Quando usarlo**:
- Problemi di autenticazione con le API
- Endpoint API esterni non rispondono
- Errori di validazione o formato nei parametri
- Rate limiting issues
- Timeout o problemi di connessione

## 🔄 Pull Request Template

Il [PR template](pull_request_template.md) viene utilizzato automaticamente quando crei una nuova Pull Request.

**Cosa includere**:
- Tipo di modifica (bug fix, feature, docs, ecc.)
- Descrizione chiara delle modifiche
- Issue correlate
- Come è stato testato
- Checklist di verifica
- Breaking changes (se presenti)
- Note per i reviewer

## 💡 Best Practices

### Per le Issue

1. **Cerca prima**: Verifica se esiste già una issue simile
2. **Sii specifico**: Fornisci dettagli concreti e riproducibili
3. **Nascondi credenziali**: Non includere mai API keys, passwords o dati sensibili
4. **Usa i label**: I maintainer aggiungeranno i label appropriati
5. **Fornisci contesto**: Includi versioni, ambiente, log

### Per le Pull Request

1. **Riferisci le issue**: Usa `Fixes #123` o `Closes #456`
2. **Test**: Assicurati che tutti i test passino
3. **Documentazione**: Aggiorna la documentazione se necessario
4. **Codice pulito**: Rimuovi console.log e codice di debug
5. **Commit atomici**: Ogni commit dovrebbe avere un singolo scopo chiaro
6. **Descrizione chiara**: Spiega cosa, perché e come

## 🏷️ Labels

I maintainer useranno questi label per organizzare le issue:

### Tipo
- `bug` - Qualcosa non funziona correttamente
- `enhancement` - Richiesta di nuova feature
- `documentation` - Miglioramenti o aggiunte alla documentazione
- `question` - Domande o richieste di chiarimenti
- `api` - Relativo alle integrazioni API
- `integration` - Problemi di integrazione

### Progetto
- `also` - Also Marketplace API
- `tdsynnex` - TDSynnex StreamOne API
- `trend` - Trend Vision One API
- `proxy` - Unified API Proxy

### Priorità
- `critical` - Richiede attenzione immediata
- `high` - Alta priorità
- `medium` - Priorità media
- `low` - Bassa priorità

### Status
- `in-progress` - Lavoro in corso
- `needs-review` - In attesa di review
- `blocked` - Bloccato da altro issue/PR
- `wontfix` - Non verrà risolto
- `duplicate` - Issue duplicata

### Area
- `backend` - Backend Node.js/TypeScript
- `docs` - Documentazione
- `ci-cd` - Continuous Integration/Deployment
- `security` - Problemi di sicurezza
- `performance` - Problemi di performance

## 📞 Contatti

Per discussioni generali o domande che non richiedono un issue:
- Usa [GitHub Discussions](../../discussions)
- Consulta la [documentazione](../DOC/)

## ⚠️ Security Issues

**NON creare issue pubbliche per vulnerabilità di sicurezza!**

Per segnalare problemi di sicurezza, contatta privatamente i maintainer.

---

**Nota**: Questi template sono progettati per aiutarti a fornire tutte le informazioni necessarie. Più dettagli fornisci, più velocemente possiamo aiutarti!
