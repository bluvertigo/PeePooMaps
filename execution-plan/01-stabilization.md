# Fase 1 — stabilizzazione del MVP locale

**Obiettivo:** rendere affidabili dati, flussi principali e regressioni prima di
aggiungere funzionalità remote.

## Attività

- [x] Aggiungere test per repository Dexie, migrazione v1→v2, cancellazione personaggio
      e scollegamento degli eventi.
- [x] Validare l’import JSON con schema completo: tipi, date, coordinate, lunghezze,
      duplicati e payload troppo grandi.
- [ ] Definire una politica per import: sostituzione completa con conferma oppure merge.
- [x] Aggiungere gestione esplicita degli errori IndexedDB, quota esaurita e database
      non disponibile.
- [ ] Consentire modifica/cancellazione del singolo evento.
- [x] Aggiungere filtro storico per personaggio, tipo e intervallo temporale.
- [ ] Verificare che la posizione `0,0`, coordinate fuori range e date non valide
      non entrino nel database.
- [ ] Separare le stringhe UI e preparare la localizzazione italiana.

## Criteri di completamento

- `npm test` copre dominio, storage, import/export e flusso di cancellazione.
- `npm run build` passa senza warning funzionali nuovi.
- Una prova manuale in modalità offline crea, ricarica e visualizza eventi.
- Un database proveniente dalla v1 viene aperto senza perdita di dati.
