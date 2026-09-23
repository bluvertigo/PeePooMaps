# Fase 2 — backup Google Drive

**Obiettivo:** offrire un backup volontario e best-effort senza trasformare Drive
in un sistema di login applicativo.

## Attività

- [ ] Creare e documentare un OAuth client web per gli origin di sviluppo e produzione.
- [ ] Configurare `VITE_GOOGLE_CLIENT_ID` solo tramite variabili d’ambiente; non
      committare client secret o credenziali.
- [ ] Testare consenso, revoca, token scaduto, rete assente e risposta API non valida.
- [ ] Confermare che la ricerca aggiorni un solo file `peepoomaps-backup.json`
      nella cartella `appDataFolder`.
- [ ] Rendere il payload di backup atomico: serializzazione e validazione prima
      della richiesta, senza modificare i dati locali se l’upload fallisce.
- [ ] Mostrare data/risultato dell’ultimo tentativo senza conservare token.
- [ ] Definire una cadenza giornaliera best-effort con `document.visibilityState`,
      service worker e limiti del browser; non promettere esecuzione in background.
- [ ] Aggiungere documentazione per cancellare il file Drive e revocare il consenso.

## Criteri di completamento

- Nessun token compare in IndexedDB, localStorage, URL, log o file esportato.
- Il backup funziona con una nuova autorizzazione e con un file già presente.
- Fallimenti Drive lasciano intatti gli eventi locali e producono un messaggio chiaro.
