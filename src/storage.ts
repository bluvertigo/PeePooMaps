import Dexie, { type EntityTable } from "dexie";
import type { Character, PooEvent, Profile } from "./domain";
import { validateCharacter, validateEvent } from "./validation";

class PeePooDatabase extends Dexie {
  events!: EntityTable<PooEvent, "id">;
  profiles!: EntityTable<Profile, "id">;
  characters!: EntityTable<Character, "id">;

  constructor() {
    super("peepoomaps");
    this.version(1).stores({
      events: "++id, kind, occurredAt",
      profiles: "id"
    });
    this.version(2).stores({
      events: "++id, kind, occurredAt, characterId",
      profiles: "id",
      characters: "id, createdAt"
    });
  }
}

export const db = new PeePooDatabase();

export async function listEvents(): Promise<PooEvent[]> {
  return db.events.orderBy("occurredAt").reverse().toArray();
}

export async function saveEvent(event: PooEvent): Promise<number> {
  validateEvent(event);
  const id = await db.events.add(event);
  if (id === undefined) throw new Error("Impossibile salvare l'evento.");
  return id;
}

export async function getProfile(): Promise<Profile> {
  return (await db.profiles.get("current")) ?? { id: "current", nickname: "" };
}

export async function saveProfile(nickname: string): Promise<void> {
  await db.profiles.put({ id: "current", nickname: nickname.trim() });
}

export async function clearLocalData(): Promise<void> {
  await db.transaction("rw", db.events, db.profiles, db.characters, async () => {
    await db.events.clear();
    await db.profiles.clear();
    await db.characters.clear();
  });
}

export const listCharacters = () => db.characters.orderBy("createdAt").toArray();
export const saveCharacter = (character: Character) => {
  validateCharacter(character);
  return db.characters.put(character);
};
export const deleteCharacter = async (id: string) => db.transaction("rw", db.events, db.characters, async () => {
  await db.events.where("characterId").equals(id).modify({ characterId: undefined });
  await db.characters.delete(id);
});
export const getAllData = async () => ({
  profile: await getProfile(),
  characters: await listCharacters(),
  events: await db.events.toArray()
});
export async function replaceAllData(data: Awaited<ReturnType<typeof getAllData>>): Promise<void> {
  data.events.forEach(validateEvent);
  data.characters.forEach(validateCharacter);
  await db.transaction("rw", db.events, db.profiles, db.characters, async () => {
    await db.events.clear(); await db.profiles.clear(); await db.characters.clear();
    await db.profiles.put(data.profile);
    await db.characters.bulkPut(data.characters);
    await db.events.bulkPut(data.events);
  });
}
