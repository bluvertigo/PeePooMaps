import { FormEvent, useEffect, useState } from "react";
import type { Character, EventKind, PooEvent } from "./domain";
import { CHARACTER_ICONS } from "./domain";
import { requestCurrentLocation } from "./location";
import { clearLocalData, deleteCharacter, getProfile, listCharacters, listEvents, saveCharacter, saveEvent, saveProfile } from "./storage";
import { exportBackup, importBackup } from "./backup";
import { backupToDrive } from "./driveBackup";
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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [filterKind, setFilterKind] = useState<"all" | EventKind>("all");
  const [filterCharacter, setFilterCharacter] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today" | "week">("all");

  async function refresh() {
    const [storedEvents, storedCharacters, profile] = await Promise.all([listEvents(), listCharacters(), getProfile()]);
    setEvents(storedEvents); setCharacters(storedCharacters); setNickname(profile.nickname);
    setSelected((current) => current || storedCharacters[0]?.id || "");
  }
  useEffect(() => {
    void refresh().catch(() => setMessage("Impossibile aprire i dati locali."));
    const on = () => setOnline(true); const off = () => setOnline(false);
    addEventListener("online", on); addEventListener("offline", off);
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, []);

  async function addEvent(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    let coordinates;
    try { coordinates = await requestCurrentLocation(); } catch { setMessage("GPS non disponibile: salvo comunque offline senza posizione."); }
    try {
      await saveEvent({ kind, occurredAt: new Date().toISOString(), ...coordinates, note: note.trim() || undefined, characterId: selected || undefined });
      await refresh(); setNote(""); setMessage(`${labels[kind]} registrata${coordinates ? " con posizione." : " senza posizione."}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossibile salvare l'evento.");
    } finally { setLoading(false); }
  }
  async function addCharacter(event: FormEvent) {
    event.preventDefault(); const name = newName.trim(); if (!name) return;
    const character = { id: id(), name, icon, createdAt: new Date().toISOString() };
    await saveCharacter(character); setNewName(""); setSelected(character.id); await refresh();
  }
  async function removeCharacter(character: Character) {
    if (!confirm(`Eliminare ${character.name}? Gli eventi resteranno nello storico senza personaggio.`)) return;
    await deleteCharacter(character.id); if (selected === character.id) setSelected(""); await refresh(); setMessage("Personaggio eliminato.");
  }
  async function removeAll() {
    if (!confirm("Cancellare personaggi, eventi e profilo da questo dispositivo?")) return;
    await clearLocalData(); setEvents([]); setCharacters([]); setSelected(""); setNickname(""); setMessage("Dati locali cancellati.");
  }
  async function loadBackup(file: File) { try { await importBackup(file); await refresh(); setMessage("Backup importato."); } catch (error) { setMessage(error instanceof Error ? error.message : "Import fallito."); } }
  const byId = new Map(characters.map((character) => [character.id, character]));
  const since = filterPeriod === "today" ? new Date(new Date().setHours(0, 0, 0, 0)) :
    filterPeriod === "week" ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : undefined;
  const filteredEvents = events.filter((item) =>
    (filterKind === "all" || item.kind === filterKind) &&
    (filterCharacter === "all" || (filterCharacter === "none" ? !item.characterId : item.characterId === filterCharacter)) &&
    (!since || new Date(item.occurredAt) >= since));

  return <main>
    <header className="hero"><div><p className="eyebrow">DIARIO LOCALE · PWA</p><h1>PeePoo<span>Maps</span></h1><p>Un diario pixel-friendly, privato e funzionante anche senza rete.</p></div><strong className={online ? "connection online" : "connection"}>{online ? "● ONLINE" : "● OFFLINE"}</strong></header>
    <section className="notice"><strong>Privacy prima.</strong> Dati e coordinate restano nel browser. La mappa usa OpenStreetMap e necessita rete per le piastrelle; gli eventi continuano a salvarsi offline.</section>
    <section className="card"><h2>NUOVO EVENTO</h2><form onSubmit={addEvent}>
      <div className="choices">{(Object.keys(labels) as EventKind[]).map((option) => <button type="button" className={kind === option ? "choice selected" : "choice"} onClick={() => setKind(option)} key={option}>{option === "pee" ? "💧" : "🟤"} {labels[option]}</button>)}</div>
      <label htmlFor="character">Personaggio</label><select id="character" value={selected} onChange={(event) => setSelected(event.target.value)}><option value="">Nessun personaggio</option>{characters.map((character) => <option value={character.id} key={character.id}>{character.icon} {character.name}</option>)}</select>
      <label htmlFor="note">Nota facoltativa</label><input id="note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={140} placeholder="Come ti senti?" />
      <button className="primary" disabled={loading}>{loading ? "SALVATAGGIO…" : "SALVA EVENTO + GPS"}</button>
    </form>{message && <p className="status" role="status">{message}</p>}</section>
    <section className="card"><h2>PERSONAGGI LOCALI</h2><form className="character-form" onSubmit={addCharacter}><input aria-label="Nome personaggio" value={newName} onChange={(event) => setNewName(event.target.value)} maxLength={32} placeholder="Nome (es. Leo)" /><select aria-label="Icona personaggio" value={icon} onChange={(event) => setIcon(event.target.value)}>{CHARACTER_ICONS.map((item) => <option key={item}>{item}</option>)}</select><button className="secondary">AGGIUNGI</button></form><div className="character-list">{characters.map((character) => <div className="character" key={character.id}><span className="avatar">{character.icon}</span><strong>{character.name}</strong><button className="icon-button" aria-label={`Elimina ${character.name}`} onClick={() => void removeCharacter(character)}>×</button></div>)}</div></section>
    <section className="card"><h2>PROFILO</h2><label htmlFor="nickname">Nickname (solo locale)</label><input id="nickname" value={nickname} onChange={(event) => { setNickname(event.target.value); void saveProfile(event.target.value); }} maxLength={40} placeholder="Il tuo nome" /></section>
    <section className="card"><h2>MAPPA</h2><MapView events={events} /><p className="map-help">La mappa mostra solo eventi con GPS. Le piastrelle possono non apparire offline; nessun dato viene inviato dal diario.</p></section>
    <section className="card"><h2>STORICO <small>{filteredEvents.length}/{events.length} EVENTI</small></h2>
      <div className="filters" aria-label="Filtri storico">
        <select aria-label="Filtra tipo" value={filterKind} onChange={(event) => setFilterKind(event.target.value as "all" | EventKind)}><option value="all">Tutti i tipi</option><option value="pee">Pipì</option><option value="poop">Cacca</option></select>
        <select aria-label="Filtra personaggio" value={filterCharacter} onChange={(event) => setFilterCharacter(event.target.value)}><option value="all">Tutti i personaggi</option><option value="none">Senza personaggio</option>{characters.map((character) => <option value={character.id} key={character.id}>{character.icon} {character.name}</option>)}</select>
        <select aria-label="Filtra periodo" value={filterPeriod} onChange={(event) => setFilterPeriod(event.target.value as "all" | "today" | "week")}><option value="all">Sempre</option><option value="today">Oggi</option><option value="week">Ultimi 7 giorni</option></select>
      </div>
      {filteredEvents.length === 0 ? <p className="muted">{events.length ? "Nessun evento corrisponde ai filtri." : "Nessun evento ancora."}</p> : <ul className="events">{filteredEvents.map((item) => <li key={item.id}><strong>{labels[item.kind]} {item.characterId && byId.get(item.characterId)?.icon}</strong><time dateTime={item.occurredAt}>{new Date(item.occurredAt).toLocaleString("it-IT")}</time><span>{item.latitude !== undefined ? "GPS salvato" : "Senza posizione"}{item.note ? ` · ${item.note}` : ""}{item.characterId && byId.get(item.characterId) ? ` · ${byId.get(item.characterId)?.name}` : ""}</span></li>)}</ul>}</section>
    <section className="card"><h2>BACKUP E PRIVACY</h2><p className="muted">Esporta un JSON versionato per conservarlo. Il backup Drive usa solo la cartella app-data, non crea un account PeePooMaps e non salva token in IndexedDB.</p><div className="actions"><button className="secondary" onClick={() => void exportBackup()}>ESPORTA JSON</button><label className="file-button">IMPORTA JSON<input type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && void loadBackup(event.target.files[0])} /></label><button className="secondary" onClick={() => void backupToDrive().then(() => setMessage("Backup Drive completato.")).catch((error) => setMessage(error instanceof Error ? error.message : "Backup Drive fallito."))}>BACKUP DRIVE</button></div></section>
    <button className="danger" onClick={() => void removeAll}>CANCELLA TUTTI I DATI LOCALI</button>
  </main>;
}
