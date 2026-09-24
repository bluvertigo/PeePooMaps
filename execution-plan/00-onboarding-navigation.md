# Fase 1 — onboarding, mappa e navigazione principale

**Obiettivo:** rendere immediato il primo avvio e portare la mappa al centro
dell'esperienza, mantenendo il funzionamento local-first.

## Flusso di primo avvio

- [x] Se non esistono personaggi, mostrare una scelta bloccante all'apertura.
- [x] Offrire importazione da file JSON.
- [x] Offrire importazione dal backup nella cartella privata di Google Drive.
- [x] Offrire la creazione di un nuovo database locale vuoto.
- [ ] Dopo la scelta, guidare l'utente alla creazione del primo personaggio.
- [ ] Coprire il primo avvio con una verifica manuale ripetibile offline.

## Navigazione e azioni

- [x] Aprire l'app sulla mappa degli eventi.
- [x] Rendere sempre visibile in fondo una barra con Menu, Pipì e Cacca.
- [x] Usare Pipì e Cacca per aprire il flusso di creazione dell'evento
      corrispondente.
- [x] Spostare nel Menu personaggi, storico, profilo, import/export e
      cancellazione dei dati.
- [ ] Aggiungere test end-to-end per onboarding e azioni rapide.

## Criteri di completamento

- Il primo avvio non mostra una schermata di registrazione evento prima della mappa.
- Un evento può essere creato da entrambi i pulsanti inferiori e richiede una
  posizione, manuale o GPS.
- Import da file e Drive sostituiscono i dati solo dopo validazione del payload.
