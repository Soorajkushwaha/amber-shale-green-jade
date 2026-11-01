import type { CityProgress, Quality, SaveData } from "@/game/types";

const KEY = "desidiya-light-up-india-v1";

export function defaultQuality(): Quality {
  if (typeof navigator === "undefined") return "medium";
  const cores = navigator.hardwareConcurrency || 4;
  const touch = navigator.maxTouchPoints > 0;
  const narrow = typeof window !== "undefined" && window.innerWidth < 900;
  if ((touch || narrow) && cores <= 6) return "low";
  if (touch || narrow) return "medium";
  return "high";
}

export function emptyProgress(areas: number): CityProgress {
  return {
    areas: Array.from({ length: areas }, () => false),
    illum: Array.from({ length: areas }, () => 0),
    best: Array.from({ length: areas }, () => 0),
    bestTime: Array.from({ length: areas }, () => 0),
    noDamage: Array.from({ length: areas }, () => false),
  };
}

export function defaultSave(): SaveData {
  return {
    version: 1,
    seenIntro: false,
    unlocked: 0,
    weapon: 1,
    coins: 0,
    cities: {},
    settings: { quality: defaultQuality(), music: 0.7, sfx: 0.85, muted: false },
    indiaLit: false,
  };
}

export function loadSave(): SaveData {
  if (typeof localStorage === "undefined") return defaultSave();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    if (parsed.version !== 1) return defaultSave();
    const base = defaultSave();
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...parsed.settings },
      cities: parsed.cities ?? {},
    };
  } catch {
    return defaultSave();
  }
}

export function writeSave(data: SaveData) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export interface SaveStore {
  load: () => SaveData;
  save: (data: SaveData) => void;
}

/** Local now. A cloud store can wrap the same SaveData later. */
export const localSaveStore: SaveStore = { load: loadSave, save: writeSave };
