import { FormEvent, useEffect, useRef, useState } from "react";
import type { Character, EventKind, PooEvent } from "./domain";
import { CHARACTER_ICONS } from "./domain";
import { requestCurrentLocation } from "./location";
import type { Coordinates } from "./location";
import MapPicker from "./MapPicker";
import {
  clearLocalData, deleteCharacter, getProfile, listCharacters, listEvents,
  saveCharacter, saveEvent, saveProfile
} from "./storage";
import { exportBackup, importBackup } from "./backup";
import { backupToDrive, importFromDrive } from "./driveBackup";
import MapView from "./MapView";

const labels: Record<EventKind, string> = { pee: "Pipì", poop: "Cacca" };
const id = () => crypto.randomUUID();

export default function App() {
  const [events, setEvents] = useState<PooEvent[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState("");
  const [kind, setKind] = useState<EventKind>("pee");
  const [nickname, setNickname] = useState("");
  const [newName, setNewName] = useState("");
  const [icon, setIcon] = useState(CHARACTER_ICONS[0]);
  const [note, setNote] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [menuOpen, setMenuOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [filterKind, setFilterKind] = useState<"all" | EventKind>("all");
  const [filterCharacter, setFilterCharacter] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today" | "week">("all");
  const fileInput = useRef<HTMLInputElement>(null);

  async function refresh() {
    const [storedEvents, storedCharacters, profile] = await Promise.all([listEvents(), listCharacters(), getProfile()]);
    setEvents(storedEvents);
    setCharacters(storedCharacters);
    setNickname(profile.nickname);
    setSelected((current) => current || storedCharacters[0]?.id || "");
    setNeedsSetup(storedCharacters.length === 0);
  }

  useEffect(() => {
    void refresh().catch(() => setMessage("Impossibile aprire i dati locali."));
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    addEventListener("online", on);
    addEventListener("offline", off);
    return () => {
      removeEventListener("online", on);
      removeEventListener("offline", off);
    };
  }, []);

  function openComposer(eventKind: EventKind) {
    setKind(eventKind);
    setCoordinates(undefined);
    setMessage("");
    setComposerOpen(true);
    setMenuOpen(false);
  }

  async function addEvent(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    if (!coordinates) {
      setLoading(false);
      setMessage("Scegli un punto sulla mappa prima di salvare l'evento.");
      return;
    }
    try {
      await saveEvent({
        kind, occurredAt: new Date().toISOString(), ...coordinates,
        note: note.trim() || undefined, characterId: selected || undefined
      });
      await refresh();
      setNote("");
      setCoordinates(undefined);
      setComposerOpen(false);
      setMessage(`${labels[kind]} registrata con posizione.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossibile salvare l'evento.");
    } finally {
      setLoading(false);
    }
  }

  async function addCharacter(event: FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const character = { id: id(), name, icon, createdAt: new Date().toISOString() };
    await saveCharacter(character);
    setNewName("");
    setSelected(character.id);
    await refresh();
    setNeedsSetup(false);
    setMessage(`${name} aggiunto ai personaggi.`);
  }

  async function removeCharacter(character: Character) {
    if (!confirm(`Eliminare ${character.name}? Gli eventi resteranno nello storico senza personaggio.`)) return;
    await deleteCharacter(character.id);
    if (selected === character.id) setSelected("");
    await refresh();
    setMessage("Personaggio eliminato.");
  }

  async function removeAll() {
    if (!confirm("Cancellare personaggi, eventi e profilo da questo dispositivo?")) return;
    await clearLocalData();
    setEvents([]);
    setCharacters([]);
    setSelected("");
    setNickname("");
    setNeedsSetup(true);
    setMessage("Dati locali cancellati.");
  }

  async function loadBackup(file: Blob) {
    try {
      await importBackup(file);
      await refresh();
      setMessage("Backup importato.");
      setMenuOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import fallito.");
    }
  }

  async function loadDriveBackup() {
    try {
      await loadBackup(await importFromDrive());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import da Drive fallito.");
    }
  }

  const byId = new Map(characters.map((character) => [character.id, character]));
  const since = filterPeriod === "today"
    ? new Date(new Date().setHours(0, 0, 0, 0))
    : filterPeriod === "week" ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : undefined;
  const filteredEvents = events.filter((item) =>
    (filterKind === "all" || item.kind === filterKind) &&
    (filterCharacter === "all" || (filterCharacter === "none" ? !item.characterId : item.characterId === filterCharacter)) &&
    (!since || new Date(item.occurredAt) >= since));

  return <main className="app-shell">
    <header className="topbar">
      <div><p className="eyebrow">DIARIO LOCALE · PWA</p><h1>PeePoo<span>Maps</span></h1></div>
      <strong className={online ? "connection online" : "connection"}>{online ? "● ONLINE" : "● OFFLINE"}</strong>
    </header>

    <section className="card map-card">
      <div className="section-heading"><div><h2>MAPPA</h2><p className="muted">I tuoi eventi, direttamente sul territorio.</p></div><small>{events.length} EVENTI</small></div>
      <MapView events={events} />
      <p className="map-help">La mappa mostra solo eventi con GPS. Le piastrelle possono non apparire offline.</p>
    </section>

    {message && <p className="status global-status" role="status">{message}</p>}

    {composerOpen && <section className="card composer">
      <div className="section-heading"><h2>NUOVA {labels[kind].toUpperCase()}</h2><button className="icon-button" aria-label="Chiudi" onClick={() => setComposerOpen(false)}>×</button></div>
      <form onSubmit={addEvent}>
        <label htmlFor="character">Personaggio</label>
        <select id="character" value={selected} onChange={(event) => setSelected(event.target.value)}>
          <option value="">Nessun personaggio</option>
          {characters.map((character) => <option value={character.id} key={character.id}>{character.icon} {character.name}</option>)}
        </select>
        <label htmlFor="note">Nota facoltativa</label>
        <input id="note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={140} placeholder="Come ti senti?" />
        <label>Posizione dell'evento</label>
        <MapPicker value={coordinates} onChange={setCoordinates} />
        <button type="button" className="secondary location-button" onClick={() => void requestCurrentLocation().then(setCoordinates).catch(() => setMessage("Posizione GPS non disponibile: scegli il punto manualmente sulla mappa."))}>USA POSIZIONE ATTUALE</button>
        <button className="primary" disabled={loading}>{loading ? "SALVATAGGIO…" : `SALVA ${labels[kind].toUpperCase()}`}</button>
      </form>
    </section>}

    {menuOpen && <section className="card menu-panel">
      <div className="section-heading"><h2>MENU</h2><button className="icon-button" aria-label="Chiudi menu" onClick={() => setMenuOpen(false)}>×</button></div>
      <h3>PERSONAGGI</h3>
      <form className="character-form" onSubmit={addCharacter}>
        <input aria-label="Nome personaggio" value={newName} onChange={(event) => setNewName(event.target.value)} maxLength={32} placeholder="Nome (es. Leo)" />
        <select aria-label="Icona personaggio" value={icon} onChange={(event) => setIcon(event.target.value)}>{CHARACTER_ICONS.map((item) => <option key={item}>{item}</option>)}</select>
        <button className="secondary">AGGIUNGI</button>
      </form>
      <div className="character-list">{characters.map((character) => <div className="character" key={character.id}><span className="avatar">{character.icon}</span><strong>{character.name}</strong><button className="icon-button" aria-label={`Elimina ${character.name}`} onClick={() => void removeCharacter(character)}>×</button></div>)}</div>
      <h3>PROFILO</h3>
      <label htmlFor="nickname">Nickname (solo locale)</label>
      <input id="nickname" value={nickname} onChange={(event) => { setNickname(event.target.value); void saveProfile(event.target.value); }} maxLength={40} placeholder="Il tuo nome" />
      <h3>STORICO <small>{filteredEvents.length}/{events.length} EVENTI</small></h3>
      <div className="filters" aria-label="Filtri storico">
        <select aria-label="Filtra tipo" value={filterKind} onChange={(event) => setFilterKind(event.target.value as "all" | EventKind)}><option value="all">Tutti i tipi</option><option value="pee">Pipì</option><option value="poop">Cacca</option></select>
        <select aria-label="Filtra personaggio" value={filterCharacter} onChange={(event) => setFilterCharacter(event.target.value)}><option value="all">Tutti i personaggi</option><option value="none">Senza personaggio</option>{characters.map((character) => <option value={character.id} key={character.id}>{character.icon} {character.name}</option>)}</select>
        <select aria-label="Filtra periodo" value={filterPeriod} onChange={(event) => setFilterPeriod(event.target.value as "all" | "today" | "week")}><option value="all">Sempre</option><option value="today">Oggi</option><option value="week">Ultimi 7 giorni</option></select>
      </div>
      {filteredEvents.length === 0 ? <p className="muted">{events.length ? "Nessun evento corrisponde ai filtri." : "Nessun evento ancora."}</p> : <ul className="events">{filteredEvents.map((item) => <li key={item.id}><strong>{labels[item.kind]} {item.characterId && byId.get(item.characterId)?.icon}</strong><time dateTime={item.occurredAt}>{new Date(item.occurredAt).toLocaleString("it-IT")}</time><span>{item.latitude !== undefined ? "GPS salvato" : "Senza posizione"}{item.note ? ` · ${item.note}` : ""}{item.characterId && byId.get(item.characterId) ? ` · ${byId.get(item.characterId)?.name}` : ""}</span></li>)}</ul>}
      <h3>IMPORT E BACKUP</h3>
      <p className="muted">I dati restano locali. Drive usa solo la cartella privata dell'app.</p>
      <div className="actions">
        <button className="secondary" onClick={() => void exportBackup()}>ESPORTA JSON</button>
        <label className="file-button">IMPORTA JSON<input ref={fileInput} type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && void loadBackup(event.target.files[0])} /></label>
        <button className="secondary" onClick={() => void backupToDrive().then(() => setMessage("Backup Drive completato.")).catch((error) => setMessage(error instanceof Error ? error.message : "Backup Drive fallito."))}>BACKUP DRIVE</button>
        <button className="secondary" onClick={() => void loadDriveBackup()}>IMPORTA DA DRIVE</button>
      </div>
      <button className="danger" onClick={() => void removeAll()}>CANCELLA TUTTI I DATI LOCALI</button>
    </section>}

    <nav className="bottom-nav" aria-label="Azioni principali">
      <button className={menuOpen ? "nav-button active" : "nav-button"} onClick={() => { setMenuOpen(!menuOpen); setComposerOpen(false); }}><span>☰</span><small>MENU</small></button>
      <button className="nav-button event-pee" aria-label="Registra pipì" onClick={() => openComposer("pee")}><img src="/pixel-art/child-pee.svg" alt="" /></button>
      <button className="nav-button event-poop" aria-label="Registra cacca" onClick={() => openComposer("poop")}><img src="/pixel-art/poop-button.svg" alt="" /></button>
    </nav>

    {needsSetup && <div className="setup-backdrop"><section className="setup-dialog" role="dialog" aria-modal="true" aria-labelledby="setup-title">
      <p className="eyebrow">BENVENUTO</p><h2 id="setup-title">Come vuoi iniziare?</h2>
      <p>Non c'è ancora nessun personaggio salvato. Puoi importare i tuoi dati o iniziare con un nuovo database locale.</p>
      <div className="setup-actions">
        <label className="choice selected">IMPORTA DA FILE<input type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && void loadBackup(event.target.files[0])} /></label>
        <button className="choice" onClick={() => void loadDriveBackup()}>IMPORTA DA GOOGLE DRIVE</button>
        <button className="primary" onClick={() => { setNeedsSetup(false); setMenuOpen(true); }}>CREA NUOVO DATABASE</button>
      </div>
      {message && <p className="status" role="status">{message}</p>}
    </section></div>}
  </main>;
}
