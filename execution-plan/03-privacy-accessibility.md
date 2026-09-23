# Fase 3 — privacy, accessibilità e installabilità

**Obiettivo:** rendere l’app pronta per utenti reali senza cambiare il modello
local-first.

## Attività

- [ ] Aggiungere una schermata privacy/onboarding con consenso informato per GPS,
      mappa e backup Drive.
- [ ] Rendere esplicita la retention locale e il comportamento di “cancella tutto”.
- [ ] Verificare tastiera, focus, contrasto, screen reader, zoom 200% e target touch.
- [ ] Aggiungere annunci `aria-live` per salvataggi, errori e stato offline.
- [ ] Verificare icone PWA reali, splash/install prompt e aggiornamento service worker.
- [ ] Aggiungere fallback quando Leaflet non carica le tile e indicare il limite
      geografico della mappa.
- [ ] Applicare una Content Security Policy compatibile con Leaflet, GIS e Drive.
- [ ] Eseguire audit Lighthouse/axe e correggere i problemi bloccanti.

## Criteri di completamento

- Flussi principali completabili senza mouse e con lettore di schermo.
- Installazione e riapertura offline funzionano su mobile supportato.
- Privacy e limiti tecnici sono visibili prima dell’uso dei permessi.
