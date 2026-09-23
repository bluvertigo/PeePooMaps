# PeePooMaps — execution plan

Questa cartella contiene la roadmap operativa del progetto. Ogni fase deve produrre
un incremento verificabile, mantenendo il principio **local-first** e senza introdurre
sincronizzazione remota prima di aver stabilizzato il dominio locale.

## Ordine delle fasi

| Fase | Obiettivo | Stato |
| --- | --- | --- |
| 0 | Fondazioni PWA e MVP locale | Completata |
| 1 | Stabilizzazione dati, UX e test | Prossima |
| 2 | Backup Google Drive | Prototipo implementato, da configurare e hardenizzare |
| 3 | Accessibilità, privacy e installabilità | Da fare |
| 4 | Preparazione backend e sincronizzazione | Decisione architetturale |
| 5 | Beta e rilascio | Da fare |

## Regole di avanzamento

- Ogni fase deve avere test e una verifica manuale ripetibile.
- Le migrazioni IndexedDB devono essere additive e retrocompatibili.
- GPS e backup sono opzionali: l’app deve restare utile offline e senza permessi.
- Non memorizzare token OAuth in IndexedDB, localStorage o nei backup JSON.
- Non pubblicare coordinate o dati degli utenti senza consenso esplicito e policy definita.

## Documenti

- [`01-stabilization.md`](./01-stabilization.md): qualità del MVP locale e gestione dati.
- [`02-drive-backup.md`](./02-drive-backup.md): configurazione e hardening del backup Drive.
- [`03-privacy-accessibility.md`](./03-privacy-accessibility.md): accessibilità, privacy e PWA.
- [`04-sync-decision.md`](./04-sync-decision.md): criteri per decidere se introdurre backend/sync.
- [`05-beta-release.md`](./05-beta-release.md): beta, osservabilità minima e rilascio.
