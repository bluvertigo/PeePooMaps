import type { BackupPayload } from "./domain";
import { getAllData, replaceAllData } from "./storage";
import { validateBackup } from "./validation";

export async function exportBackup(): Promise<void> {
  const payload: BackupPayload = { version: 1, exportedAt: new Date().toISOString(), ...(await getAllData()) };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `peepoomaps-backup-${payload.exportedAt.slice(0, 10)}.json`;
  anchor.click(); URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<void> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("Il file non contiene JSON valido.");
  }
  validateBackup(parsed);
  await replaceAllData({ profile: parsed.profile, characters: parsed.characters, events: parsed.events });
}
