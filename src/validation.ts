import type { BackupPayload, Character, EventKind, PooEvent, Profile } from "./domain";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function validateEvent(value: unknown): asserts value is PooEvent {
  if (!isRecord(value) || !["pee", "poop"].includes(value.kind as string) ||
      typeof value.occurredAt !== "string" || Number.isNaN(Date.parse(value.occurredAt))) {
    throw new Error("Evento non valido: tipo o data non riconosciuti.");
  }
  if (value.note !== undefined && (typeof value.note !== "string" || value.note.length > 140)) {
    throw new Error("Evento non valido: la nota supera 140 caratteri.");
  }
  const hasLatitude = value.latitude !== undefined;
  const hasLongitude = value.longitude !== undefined;
  if (hasLatitude !== hasLongitude ||
      (hasLatitude && (typeof value.latitude !== "number" || typeof value.longitude !== "number" ||
        !Number.isFinite(value.latitude) || !Number.isFinite(value.longitude) ||
        value.latitude < -90 || value.latitude > 90 || value.longitude < -180 || value.longitude > 180 ||
        (value.latitude === 0 && value.longitude === 0)))) {
    throw new Error("Evento non valido: coordinate GPS fuori intervallo.");
  }
}

export function validateCharacter(value: unknown): asserts value is Character {
  if (!isRecord(value) || typeof value.id !== "string" || !value.id ||
      typeof value.name !== "string" || !value.name.trim() || value.name.length > 32 ||
      typeof value.icon !== "string" || typeof value.createdAt !== "string" ||
      Number.isNaN(Date.parse(value.createdAt))) {
    throw new Error("Personaggio non valido.");
  }
}

export function validateBackup(value: unknown): asserts value is BackupPayload {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.events) ||
      !Array.isArray(value.characters) || !isRecord(value.profile) ||
      value.profile.id !== "current" || typeof value.profile.nickname !== "string") {
    throw new Error("Backup non riconosciuto: serve un JSON PeePooMaps versione 1.");
  }
  const ids = new Set<string>();
  value.characters.forEach((character) => {
    validateCharacter(character);
    if (ids.has(character.id)) throw new Error("Backup non valido: personaggi duplicati.");
    ids.add(character.id);
  });
  value.events.forEach((event) => {
    validateEvent(event);
    if (event.characterId && !ids.has(event.characterId)) {
      throw new Error("Backup non valido: evento associato a un personaggio inesistente.");
    }
  });
}
