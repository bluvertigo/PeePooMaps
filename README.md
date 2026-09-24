# PeePooMaps

PeePooMaps è una PWA local-first per registrare eventi di pipì o cacca, con timestamp,
nota, posizione scelta sulla mappa e personaggi locali. La posizione è obbligatoria:
un evento non viene salvato finché non viene scelto un punto.

## Sviluppo

```bash
npm install
npm run dev
```

La persistenza usa IndexedDB tramite Dexie con migrazione dalla versione MVP alla v2.
La cancellazione di un personaggio è confermata e scollega i suoi eventi senza eliminarli.
Il pulsante GPS può proporre la posizione corrente e richiede HTTPS in produzione (o
localhost). La mappa è limitata ai confini del mondo Leaflet. Con rete si può cliccare
direttamente la mappa OpenStreetMap; offline compare una griglia minimale cliccabile per
scegliere il punto e continuare a salvare senza piastrelle remote.

## Backup

Esporta/importa un JSON con schema `version: 1`. Il backup Google Drive è best-effort:
configura `VITE_GOOGLE_CLIENT_ID` con un OAuth client web e abilita Google Identity Services.
Usa esclusivamente `drive.appdata`, aggiorna un singolo file `peepoomaps-backup.json` e
mantiene il token solo in memoria (mai in IndexedDB). Non è un login applicativo.

## Verifica

```bash
npm run build
```

La build genera anche manifest e service worker tramite `vite-plugin-pwa`.
La PWA controlla gli aggiornamenti all'apertura e quando torna visibile dopo essere
stata lasciata in background; se trova una nuova build, aggiorna il service worker e
ricarica l'interfaccia una sola volta.
L'icona installabile della PWA è il gabinetto pixel-art in
`public/pixel-art/toilet.svg`, usato nel manifest e come icona del documento.
I nuovi personaggi possono usare sei icone con le label `girl`, `boy`, `kid`, `kid`,
`dog` e `cat`.

## Deploy su Netlify

Il repository include `netlify.toml`: Netlify deve usare `npm run build` come comando
di build e `dist` come directory pubblicata. La configurazione include il fallback
SPA e impedisce al service worker di rimanere bloccato su una build precedente.

Dopo il deploy, se viene mostrata una versione vecchia o incompleta, eseguire un hard
refresh oppure disinstallare la PWA e riaprirla. La mappa pixel-art vettoriale usa
OpenFreeMap e richiede una connessione per caricare i dati cartografici.
