# Fase 6 — decisione su account e sincronizzazione

**Obiettivo:** decidere con evidenze se il progetto necessita di dati remoti e
multi-dispositivo.

## Prima della decisione

- [ ] Raccogliere feedback sull’uso offline e sul bisogno reale di più dispositivi.
- [ ] Definire quali dati possono uscire dal dispositivo e con quale consenso.
- [ ] Stimare costi, retention, export, cancellazione e supporto.

## Opzione candidata

Supabase/Postgres con eventuale PostGIS:

- `users` gestiti dal provider di autenticazione.
- `characters` e `events` con `user_id` obbligatorio.
- Row Level Security per ogni tabella.
- Coordinate opzionali e possibilità di ridurle/arrotondarle.
- Coda outbox locale e sync idempotente, con conflitti espliciti.

## Gate di approvazione

Non implementare il backend finché non sono disponibili:

1. decisione prodotto su account e multi-dispositivo;
2. modello di minaccia e privacy policy;
3. strategia di migrazione/export dal database locale;
4. test RLS e piano di cancellazione completa.
