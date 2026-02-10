# IMPORTANTE: Problemi con OneDrive

Se stai usando OneDrive e hai problemi con `npm install`, devi escludere la cartella `node_modules` dalla sincronizzazione.

## Soluzione 1: Escludere node_modules da OneDrive (Consigliato)

1. Fai click destro sull'icona OneDrive nella system tray
2. Vai su Settings > Sync and backup > Manage backup
3. Cerca la cartella `frontend\node_modules`
4. Deselezionala per escluderla dalla sincronizzazione

## Soluzione 2: Creare un file .npmrc locale

Ho creato un file `.npmrc` che dovrebbe evitare il problema.

## Soluzione 3: Installare in modalità admin

Prova ad aprire PowerShell come Amministratore e eseguire:

```powershell
cd "C:\Users\gabrielebovina.CASH\OneDrive - COMPUTER CASH FERRARA SRL\Desktop\Codici\Also + TDSynnex+ Trend\frontend"

# Elimina tutto
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Reinstalla
npm install --no-optional --legacy-peer-deps
```

## Soluzione 4: Spostare il progetto fuori da OneDrive (Migliore per sviluppo)

```powershell
# Sposta il progetto in C:\Dev
New-Item -ItemType Directory -Path "C:\Dev" -Force
Copy-Item -Recurse "C:\Users\gabrielebovina.CASH\OneDrive - COMPUTER CASH FERRARA SRL\Desktop\Codici\Also + TDSynnex+ Trend" "C:\Dev\Also + TDSynnex+ Trend"
cd "C:\Dev\Also + TDSynnex+ Trend\frontend"
npm install
```

## Verifica dopo l'installazione

```powershell
npm run dev
```

Dovrebbe partire sulla porta 3001.
