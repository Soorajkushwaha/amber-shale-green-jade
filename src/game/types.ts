export type Quality = "low" | "medium" | "high";

export type RegionId = "north" | "west" | "east" | "south" | "nation";

export type EnemyKind = "shadow" | "drone" | "smoke" | "energy" | "guardian";

export type PowerId = "star" | "mega" | "shield" | "jump" | "magnet" | "life" | "flame";

export type SolidKind = "block" | "moving" | "crumble" | "bounce" | "pulse" | "break";

export type SolidStyle = "road" | "roof" | "glass" | "bridge" | "sand" | "spire";

export type LandmarkKind =
  | "glass"
  | "arch"
  | "dome"
  | "palace"
  | "fort"
  | "ghat"
  | "spire"
  | "bridge"
  | "lake"
  | "map";

export type Theme = {
  sky: string;
  fog: string;
  ground: string;
  road: string;
  roof: string;
  glass: string;
  foliage: string;
  accent: string;
  building: string;
};

export type Solid = {
  kind: SolidKind;
  style: SolidStyle;
  x: number;
  y: number;
  w: number;
  h: number;
  axis?: "x" | "y";
  amp?: number;
  speed?: number;
  phase?: number;
  baseX?: number;
  baseY?: number;
  dx?: number;
  dy?: number;
  vy?: number;
  fall?: number;
  falling?: boolean;
  dead?: boolean;
  hp?: number;
  period?: number;
  duty?: number;
};

export type Spawn = {
  kind: "coin" | "flame" | "enemy" | "power";
  x: number;
  y: number;
  sub?: string;
};

export type Level = {
  cityId: string;
  areaIndex: number;
  name: string;
  blurb: string;
  landmark: string;
  landmarkKind: LandmarkKind;
  theme: Theme;
  solids: Solid[];
  spawns: Spawn[];
  boss: boolean;
  bossName: string;
  titan: boolean;
  goalX: number;
  length: number;
  bossTriggerX: number | null;
};

export type AreaMeta = { name: string; blurb: string };

export type CityDef = {
  id: string;
  name: string;
  region: RegionId;
  blurb: string;
  landmark: string;
  landmarkKind: LandmarkKind;
  boss: string;
  enemies: EnemyKind[];
  areas: AreaMeta[];
  theme: Theme;
};

export type CityProgress = {
  areas: boolean[];
  illum: number[];
  best: number[];
  bestTime: number[];
  noDamage: boolean[];
};

export type SaveData = {
  version: 1;
  seenIntro: boolean;
  unlocked: number;
  weapon: number;
  coins: number;
  cities: Record<string, CityProgress>;
  settings: { quality: Quality; music: number; sfx: number; muted: boolean };
  indiaLit: boolean;
};

export type Hud = {
  mode: "menu" | "play";
  hearts: number;
  maxHearts: number;
  weapon: number;
  score: number;
  illum: number;
  areasDone: number;
  areasTotal: number;
  areaName: string;
  cityName: string;
  boss: { name: string; hp: number; max: number; phase: number } | null;
  time: number;
  shield: number;
  star: boolean;
  power: string | null;
  hint: string | null;
  noDamage: boolean;
  /** True for a moment right after the hero takes damage (drives the screen flash). */
  hit: boolean;
};

export type ClearPayload = {
  cityId: string;
  cityName: string;
  areaIndex: number;
  areaName: string;
  score: number;
  time: number;
  illum: number;
  noDamage: boolean;
  cityDone: boolean;
  final: boolean;
  best: number;
  coins: number;
};

export type GameEvent =
  | { type: "ready" }
  | { type: "pause" }
  | { type: "cleared"; payload: ClearPayload }
  | { type: "down" }
  | { type: "boss"; name: string }
  | { type: "weapon"; level: number }
  | { type: "fail"; message: string };

export const WEAPONS = [
  { id: 1, name: "Basic Light Blaster", short: "Blaster" },
  { id: 2, name: "Double Light Shot", short: "Double" },
  { id: 3, name: "Mega Light Beam", short: "Beam" },
  { id: 4, name: "Fireball of Light", short: "Fireball" },
  { id: 5, name: "Super Diya Blast", short: "Diya Blast" },
] as const;

export const PLAYER_NAME = "Goranksh";

export const SLOGAN = "DesiDiya — Naye Bharat ki Roshani";
