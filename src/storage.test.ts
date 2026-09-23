import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { db, deleteCharacter, getAllData, replaceAllData, saveCharacter, saveEvent } from "./storage";

afterEach(async () => {
  await db.delete();
  await db.open();
});

describe("Dexie storage", () => {
  it("keeps the v2 character index and validates writes", async () => {
    expect(db.events.schema.indexes.some((index) => index.name === "characterId")).toBe(true);
    const character = { id: "leo", name: "Leo", icon: "🐻", createdAt: "2026-09-23T10:00:00.000Z" };
    await saveCharacter(character);
    await saveEvent({ kind: "pee", occurredAt: "2026-09-23T10:00:00.000Z", characterId: character.id });
    await deleteCharacter(character.id);
    expect((await getAllData()).events[0].characterId).toBeUndefined();
  });

  it("replaces all data atomically for an import", async () => {
    await replaceAllData({
      profile: { id: "current", nickname: "Test" },
      characters: [{ id: "cat", name: "Cat", icon: "🐱", createdAt: "2026-09-23T10:00:00.000Z" }],
      events: [{ id: 42, kind: "poop", occurredAt: "2026-09-23T10:00:00.000Z", characterId: "cat" }]
    });
    const data = await getAllData();
    expect(data.profile.nickname).toBe("Test");
    expect(data.characters).toHaveLength(1);
    expect(data.events[0].id).toBe(42);
  });
});
