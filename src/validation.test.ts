import { describe, expect, it } from "vitest";
import { validateBackup, validateEvent } from "./validation";

const validEvent = { kind: "pee", occurredAt: "2026-09-23T10:00:00.000Z" };

describe("data validation", () => {
  it("accepts valid offline events and rejects invalid coordinates", () => {
    expect(() => validateEvent(validEvent)).not.toThrow();
    expect(() => validateEvent({ ...validEvent, latitude: 0, longitude: 0 })).toThrow(/coordinate/);
    expect(() => validateEvent({ ...validEvent, latitude: 95, longitude: 12 })).toThrow(/coordinate/);
  });

  it("rejects malformed or inconsistent imports", () => {
    expect(() => validateBackup({ version: 1, profile: { id: "current", nickname: "" }, characters: [], events: [] })).not.toThrow();
    expect(() => validateBackup({ version: 2, characters: [], events: [] })).toThrow(/Backup/);
    expect(() => validateBackup({
      version: 1, profile: { id: "current", nickname: "" },
      characters: [{ id: "leo", name: "Leo", icon: "🐻", createdAt: "2026-09-23T10:00:00.000Z" }],
      events: [{ ...validEvent, characterId: "missing" }]
    })).toThrow(/inesistente/);
  });
});
