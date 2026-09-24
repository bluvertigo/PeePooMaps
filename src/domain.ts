export type EventKind = "pee" | "poop";

export interface PooEvent {
  id?: number;
  kind: EventKind;
  occurredAt: string;
  latitude?: number;
  longitude?: number;
  note?: string;
  characterId?: string;
}

export interface Profile {
  id: "current";
  nickname: string;
}

export interface Character {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
}

export interface BackupPayload {
  version: 1;
  exportedAt: string;
  profile: Profile;
  characters: Character[];
  events: PooEvent[];
}

export const CHARACTER_OPTIONS = [
  { icon: "👩", label: "girl" },
  { icon: "👨", label: "boy" },
  { icon: "👦", label: "kid" },
  { icon: "👧", label: "kid" },
  { icon: "🐶", label: "dog" },
  { icon: "🐱", label: "cat" }
] as const;

export const CHARACTER_ICONS = CHARACTER_OPTIONS.map((option) => option.icon);
