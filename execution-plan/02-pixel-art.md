# Fase 2 — identità visuale pixel art e asset

**Obiettivo:** adottare un linguaggio grafico pixel art originale e coerente con
il riferimento `esempio-grafico.jpg`, senza modificare il modello local-first,
lo schema IndexedDB o i flussi funzionali dell'app.

## Direzione visuale

- [x] Definire una palette basata su cielo azzurro, prato verde, terra,
      crema/bianco e contorni blu scuro.
- [x] Usare bordi spessi, ombre offset, superfici a livelli e stati premuti
      chiaramente visibili.
- [x] Portare titoli e CTA verso un trattamento display/block ad alto contrasto.
- [ ] Verificare una font pixel dedicata con fallback locale e licenza compatibile.

## Asset e componenti

- [x] Aggiungere asset SVG originali per le azioni Pipì e Cacca.
- [x] Aggiungere una decorazione nuvola riutilizzabile per lo sfondo.
- [ ] Aggiungere ulteriori decorazioni originali per personaggi, terreno e
      stato vuoto della mappa.
- [x] Rendere gli asset nitidi con `image-rendering: pixelated`.
- [ ] Verificare che gli asset siano inclusi nel precache PWA e funzionino offline.

## Interfaccia da aggiornare

- [x] Restyling della shell, header e card principale della mappa.
- [x] Restyling della barra inferiore e delle azioni Pipì/Cacca.
- [x] Restyling di onboarding, composer evento e menu.
- [x] Restyling di form, filtri, storico, messaggi e azioni distruttive.
- [ ] Valutare icone pixel art per personaggi e stati invece delle sole emoji.

## Accessibilità e verifica

- [ ] Controllare contrasto tra testi, pannelli e sfondo.
- [ ] Verificare focus da tastiera, target touch e zoom al 200%.
- [ ] Eseguire controllo responsive su viewport mobile e desktop.
- [ ] Eseguire prova manuale di primo avvio, creazione eventi, menu, import e
      modalità offline.
- [ ] Eseguire `npm test` e `npm run build`.

## Criteri di completamento

- La mappa resta il punto di ingresso e la barra inferiore mantiene le tre
  azioni principali.
- La grafica principale non dipende da CDN e rimane disponibile offline.
- Il riferimento viene usato solo come ispirazione: niente branding, testi o
  illustrazioni copiati.
