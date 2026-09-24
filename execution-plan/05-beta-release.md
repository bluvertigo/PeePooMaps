# Fase 7 — beta e rilascio

**Obiettivo:** pubblicare una beta controllata e misurare affidabilità senza
introdurre tracking invasivo.

## Attività

- [ ] Preparare ambienti `development`, `staging` e `production`.
- [ ] Automatizzare test, type-check e build in CI.
- [ ] Aggiungere controllo dipendenze e aggiornamenti periodici.
- [ ] Definire browser/device supportati e una checklist di smoke test.
- [ ] Preparare changelog, guida privacy, guida backup e procedura di rollback.
- [ ] Eseguire beta con dati sintetici e poi con volontari consenzienti.
- [ ] Raccogliere solo metriche tecniche aggregate e opt-in, se necessarie.

## Gate di rilascio

- Build riproducibile e artefatto PWA verificato.
- Nessun segreto nel repository o nell’artefatto client.
- Backup e cancellazione verificati su dati di prova.
- Problemi critici di privacy, accessibilità o perdita dati assenti.
