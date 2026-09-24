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

## Mappa pixel art e rendering

- [x] Mantenere la mappa come vista primaria e il punto di ingresso dell'app.
- [x] Usare MapLibre GL JS con OpenFreeMap e una sorgente vettoriale OpenStreetMap.
- [x] Applicare uno style vettoriale personalizzato con palette, strade, acqua,
      edifici e testi coerenti con il linguaggio pixel art.
- [x] Riutilizzare le stesse icone pixel art degli eventi come marker della mappa.
- [x] Mostrare sui marker l'iniziale del personaggio e l'icona dell'evento in un
      riquadro compatto ispirato ai giochi portatili retro.
- [x] Usare lo stesso renderer e lo stesso style anche nel selettore posizione
      del composer evento.
- [x] Mantenere l'attribuzione OSM visibile e il fallback offline del picker.
- [ ] Valutare tile self-hosted e offline completo prima del rilascio pubblico.

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
- La mappa richiede rete per i dati vettoriali; il selettore mantiene il fallback
  offline già esistente.
- Il riferimento viene usato solo come ispirazione: niente branding, testi o
  illustrazioni copiati.
