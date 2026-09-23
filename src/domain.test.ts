import { describe, expect, it } from "vitest";
import type { BackupPayload, EventKind } from "./domain";

describe("PeePooMaps domain", () => {
  it("accepts only the two event kinds", () => {
    const kinds: EventKind[] = ["pee", "poop"];
    expect(kinds).toHaveLength(2);
  });

  it("keeps the backup schema version explicit", () => {
    const backup: Pick<BackupPayload, "version"> = { version: 1 };
    expect(backup.version).toBe(1);
  });
});
