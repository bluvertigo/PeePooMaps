# PeePooMaps

PeePooMaps è una PWA local-first per registrare eventi di pipì o cacca, con timestamp,
nota, posizione GPS opzionale e personaggi locali. Funziona offline: IndexedDB conserva
eventi, profilo e personaggi sul dispositivo.

## Sviluppo

```bash
npm install
npm run dev
```

La persistenza usa IndexedDB tramite Dexie con migrazione dalla versione MVP alla v2.
La cancellazione di un personaggio è confermata e scollega i suoi eventi senza eliminarli.
La geolocalizzazione viene richiesta solo quando si salva un evento e richiede HTTPS in
produzione (o localhost). La mappa è limitata ai confini del mondo Leaflet; le piastrelle
OpenStreetMap richiedono rete, mentre il salvataggio resta disponibile offline.

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
