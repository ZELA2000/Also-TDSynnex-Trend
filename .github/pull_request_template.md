# Pull Request

## 📋 Tipo di Modifica

- [ ] 🐛 Bug fix (modifica non breaking che risolve un problema)
- [ ] ✨ Nuova funzionalità (modifica non breaking che aggiunge funzionalità)
- [ ] 💥 Breaking change (fix o feature che causerebbe malfunzionamenti in funzionalità esistenti)
- [ ] 📚 Documentazione (solo aggiornamenti documentazione)
- [ ] 🎨 Style (formattazione, mancanza punti e virgola, ecc; nessuna modifica al codice)
- [ ] ♻️ Refactoring (né fix né aggiunta di feature)
- [ ] ⚡ Performance (migliora le performance)
- [ ] ✅ Test (aggiunta o correzione test)
- [ ] 🔧 Chore (modifiche al processo di build, tools, ecc)

## 📋 Progetto Interessato

- [ ] Also Marketplace API
- [ ] TDSynnex StreamOne API
- [ ] Trend Vision One API
- [ ] Unified Proxy
- [ ] Documentazione
- [ ] CI/CD
- [ ] Generale

## 📝 Descrizione

Descrivi chiaramente le modifiche apportate e il problema che risolvono.

### Issue Correlate

Fixes #(issue number)  
Closes #(issue number)  
Related to #(issue number)

## 🎯 Motivazione e Contesto

Perché questa modifica è necessaria? Quale problema risolve?

## 🔄 Come è Stato Testato?

Descrivi i test che hai eseguito per verificare le tue modifiche.

- [ ] Test unitari
- [ ] Test di integrazione
- [ ] Test manuali
- [ ] Test E2E

### Ambiente di Test

- **OS**: [es. Windows 11]
- **Node.js**: [es. 18.17.0]
- **Browser** (se applicabile): [es. Chrome 120]

### Passi per Testare

1. 
2. 
3. 

## 📸 Screenshot (se applicabile)

Aggiungi screenshot per mostrare le modifiche visibili.

## ✅ Checklist

### Codice

- [ ] Il mio codice segue lo style guide di questo progetto
- [ ] Ho eseguito una self-review del mio codice
- [ ] Ho commentato il mio codice, specialmente nelle aree complesse
- [ ] Non ci sono warning o errori nella console
- [ ] Non ho introdotto nuove dipendenze senza necessità
- [ ] Ho rimosso codice di debug/console.log

### Test

- [ ] Ho aggiunto test che dimostrano che il mio fix è efficace o che la mia feature funziona
- [ ] I nuovi e i vecchi unit test passano localmente con le mie modifiche
- [ ] Tutti i test passano in CI/CD
- [ ] La code coverage è mantenuta o migliorata

### Documentazione

- [ ] Ho aggiornato la documentazione di conseguenza
- [ ] Ho aggiornato il README se necessario
- [ ] Ho aggiornato le API specs (OpenAPI) se applicabile
- [ ] Ho aggiunto/aggiornato esempi di codice
- [ ] Ho aggiornato i commenti JSDoc/TSDoc

### Breaking Changes

- [ ] Questa PR introduce breaking changes
- [ ] Ho documentato le breaking changes nella sezione apposita
- [ ] Ho aggiornato la migration guide

## 💥 Breaking Changes (se applicabile)

Descrivi eventuali breaking changes e come gli utenti devono migrare.

### Prima
```javascript
// Codice vecchio
```

### Dopo
```javascript
// Codice nuovo
```

### Migration Guide
1. 
2. 
3. 

## 📊 Impatto sulle Performance

- [ ] Nessun impatto sulle performance
- [ ] Migliora le performance
- [ ] Potrebbe impattare le performance (spiegare sotto)

**Dettagli**: 

## 🔒 Security

- [ ] Questa PR introduce modifiche relative alla security
- [ ] Ho verificato che non ci sono vulnerabilità note
- [ ] Non espone credenziali o dati sensibili
- [ ] Le dipendenze aggiunte sono da fonti fidate

## 🚀 Deploy Notes

Note speciali per il deployment (variabili ambiente, migration, ecc)

- [ ] Richiede aggiornamento variabili ambiente
- [ ] Richiede migration database
- [ ] Richiede riavvio servizi
- [ ] Richiede configurazione particolare

**Dettagli**:

## 📝 Note Aggiuntive per i Reviewer

Aggiungi qualsiasi nota che possa aiutare i reviewer (aree su cui concentrarsi, dubbi, ecc).

## 🔗 Riferimenti

- Documentazione: 
- Design doc: 
- Issue tracking: 
- RFC: 

---

## 👀 Reviewer Checklist

**Per i reviewer**:

- [ ] Il codice è chiaro e ben strutturato
- [ ] I test sono adeguati e passano
- [ ] La documentazione è accurata e completa
- [ ] Non ci sono problemi di security evidenti
- [ ] Le performance sono accettabili
- [ ] I naming sono consistenti con il resto del codebase
- [ ] Il codice segue i pattern esistenti nel progetto
