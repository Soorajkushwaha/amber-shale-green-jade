import type {
  CityDef,
  EnemyKind,
  LandmarkKind,
  Level,
  RegionId,
  Solid,
  SolidStyle,
  Spawn,
  Theme,
} from "@/game/types";

export const REGIONS: { id: RegionId; name: string; line: string }[] = [
  { id: "north", name: "North India", line: "Towers, forts, marble and river fog" },
  { id: "west", name: "West India", line: "Sea roads, lakes and carved streets" },
  { id: "east", name: "East India", line: "Ghats, spires and hill mist" },
  { id: "south", name: "South India", line: "Gardens, palaces and warm harbours" },
  { id: "nation", name: "All India", line: "The last night over the whole map" },
];

function theme(
  sky: string,
  fog: string,
  ground: string,
  road: string,
  roof: string,
  glass: string,
  foliage: string,
  building: string,
  accent = "#e7b04a",
): Theme {
  return { sky, fog, ground, road, roof, glass, foliage, accent, building };
}

function areas(list: [string, string][]) {
  return list.map(([name, blurb]) => ({ name, blurb }));
}

function city(
  id: string,
  name: string,
  region: RegionId,
  blurb: string,
  landmark: string,
  landmarkKind: LandmarkKind,
  boss: string,
  enemies: EnemyKind[],
  areaList: [string, string][],
  look: Theme,
): CityDef {
  return {
    id,
    name,
    region,
    blurb,
    landmark,
    landmarkKind,
    boss,
    enemies,
    areas: areas(areaList),
    theme: look,
  };
}

function trio(name: string, landmark: string): [string, string][] {
  return [
    [`${name} Streets`, `Dark lanes on the way to ${landmark}`],
    [`${name} Rooftops`, `Jump the roofs while the lamps are still out`],
    [landmark, `A darkness monster holds ${landmark}`],
  ];
}

export const CITIES: CityDef[] = [
  city(
    "gurugram",
    "Gurugram",
    "north",
    "Glass towers asleep under a powerless skyline.",
    "Cyber Hub Terrace",
    "glass",
    "Grid Wraith",
    ["shadow", "drone", "smoke"],
    [
      ["Cyber City", "Skybridges between dark towers"],
      ["Millennium City Centre", "Lifts over the metro cut"],
      ["Golf Course Road", "Bounce the water gaps"],
      ["Residential Society", "Lanes, gates and night lamps"],
      ["Final Home Illumination", "The Grid Wraith guards the last house"],
    ],
    theme("#241848", "#120e22", "#2a3344", "#3c4a60", "#2a3344", "#8eafc4", "#1d3b34", "#1b2433"),
  ),
  city(
    "delhi",
    "Delhi",
    "north",
    "A wide ceremonial avenue waiting for its lamps.",
    "Lamp Arch",
    "arch",
    "Smog Regent",
    ["shadow", "guardian", "drone"],
    trio("Delhi", "Lamp Arch"),
    theme("#3a2418", "#1a120e", "#6a4a32", "#8a6244", "#5a3e2c", "#c4a078", "#2a4030", "#4a3424"),
  ),
  city(
    "jaipur",
    "Jaipur",
    "north",
    "Pink stone facades gone dim before festival night.",
    "Palace Gate",
    "palace",
    "Fort Shadow",
    ["guardian", "shadow", "energy"],
    trio("Jaipur", "Palace Gate"),
    theme("#4a2030", "#241018", "#c48878", "#a86858", "#8a5048", "#e0b0a0", "#3a4030", "#a05858"),
  ),
  city(
    "agra",
    "Agra",
    "north",
    "A marble dream on the river, still unlit.",
    "Marble Dome",
    "dome",
    "Marble Maw",
    ["drone", "smoke", "energy"],
    trio("Agra", "Marble Dome"),
    theme("#243044", "#141820", "#d9d2c6", "#b7b0a4", "#eee8de", "#f4f0e8", "#2c4038", "#cfc6b8"),
  ),
  city(
    "lucknow",
    "Lucknow",
    "north",
    "Nawabi arches and a courtyard without its chandeliers.",
    "Arch Courtyard",
    "palace",
    "Nawabi Gloom",
    ["shadow", "smoke", "guardian"],
    trio("Lucknow", "Arch Courtyard"),
    theme("#1c2430", "#10161c", "#c4a15a", "#8a7040", "#6e5830", "#e0c488", "#243828", "#7a6234"),
  ),
  city(
    "mumbai",
    "Mumbai",
    "west",
    "A sea road curled in the dark, waiting for a string of lamps.",
    "Sea Corniche",
    "bridge",
    "Tide Leviathan",
    ["drone", "energy", "smoke"],
    trio("Mumbai", "Sea Corniche"),
    theme("#0e2438", "#08141e", "#1c4a58", "#245868", "#163844", "#7eb0c0", "#143830", "#123040"),
  ),
  city(
    "pune",
    "Pune",
    "west",
    "Hill ridges and college rooftops under a quiet sky.",
    "Hill Ridge",
    "fort",
    "Hill Stalker",
    ["shadow", "guardian", "drone"],
    trio("Pune", "Hill Ridge"),
    theme("#243028", "#121814", "#5a5044", "#6e6454", "#3e4a38", "#a89878", "#2e5034", "#3a4034"),
  ),
  city(
    "ahmedabad",
    "Ahmedabad",
    "west",
    "Carved wooden lanes with every diya blown out.",
    "Carved Pol",
    "fort",
    "Pol Spectre",
    ["shadow", "smoke", "guardian"],
    trio("Ahmedabad", "Carved Pol"),
    theme("#3a2414", "#1c120c", "#b88848", "#8a6234", "#6a4828", "#e0b070", "#2a3820", "#6e4a28"),
  ),
  city(
    "surat",
    "Surat",
    "west",
    "A riverfront that should glitter and doesn't.",
    "River Glint",
    "bridge",
    "Glint Devourer",
    ["energy", "drone", "smoke"],
    trio("Surat", "River Glint"),
    theme("#1a2840", "#0e1624", "#3a5068", "#4a6478", "#2a3c50", "#d0d8e4", "#1e3834", "#243448"),
  ),
  city(
    "udaipur",
    "Udaipur",
    "west",
    "White pavilions on a lake that has lost its reflection.",
    "Lake Pavilion",
    "lake",
    "Lake Serpent",
    ["smoke", "energy", "guardian"],
    trio("Udaipur", "Lake Pavilion"),
    theme("#16304a", "#0c1c2c", "#e8e0d4", "#c8d4dc", "#f4f0ea", "#f7f4ef", "#1e4038", "#d5ddd8"),
  ),
  city(
    "kolkata",
    "Kolkata",
    "east",
    "Yellow colonial fronts and a bridge in the mist.",
    "Mist Span",
    "bridge",
    "Howrah Hollow",
    ["smoke", "shadow", "drone"],
    trio("Kolkata", "Mist Span"),
    theme("#2a2418", "#16140e", "#e0c56a", "#c2a24e", "#a88838", "#f0dc88", "#2a3820", "#b8963c"),
  ),
  city(
    "bhubaneswar",
    "Bhubaneswar",
    "east",
    "Temple spires pricking a sky with no festival lamps.",
    "Spire Court",
    "spire",
    "Spire Shade",
    ["guardian", "energy", "shadow"],
    trio("Bhubaneswar", "Spire Court"),
    theme("#3a2818", "#1c140e", "#c49868", "#a07848", "#8a6238", "#e8c898", "#2c4024", "#8a6840"),
  ),
  city(
    "patna",
    "Patna",
    "east",
    "Wide river steps with every lamp cold.",
    "River Steps",
    "ghat",
    "Ghat Colossus",
    ["smoke", "guardian", "shadow"],
    trio("Patna", "River Steps"),
    theme("#243040", "#121820", "#8a7058", "#a08060", "#6a5844", "#d0b898", "#243428", "#5a4838"),
  ),
  city(
    "guwahati",
    "Guwahati",
    "east",
    "A broad river and hills with the town lights out.",
    "River Bend",
    "ghat",
    "River Umbra",
    ["smoke", "drone", "energy"],
    trio("Guwahati", "River Bend"),
    theme("#143028", "#0c1c18", "#3a5848", "#4e6a52", "#2a4034", "#b7c8a4", "#1e5030", "#24382c"),
  ),
  city(
    "shillong",
    "Shillong",
    "east",
    "Pine ridges in a cloud, cottages gone dark.",
    "Cloud Ridge",
    "fort",
    "Cloud Stalker",
    ["shadow", "drone", "smoke"],
    trio("Shillong", "Cloud Ridge"),
    theme("#1c2830", "#10181c", "#5a6870", "#6a7880", "#3e4c44", "#c5d0c8", "#2a4834", "#3a4848"),
  ),
  city(
    "bengaluru",
    "Bengaluru",
    "south",
    "Rain trees and glass blocks sharing one blackout.",
    "Garden Glass",
    "glass",
    "Garden Null",
    ["drone", "energy", "shadow"],
    trio("Bengaluru", "Garden Glass"),
    theme("#14281c", "#0c1810", "#2a4034", "#3e5848", "#24382c", "#9eb8a4", "#1a5828", "#1c3024"),
  ),
  city(
    "hyderabad",
    "Hyderabad",
    "south",
    "Pearl-city arches around an unlit square.",
    "Arch Square",
    "arch",
    "Pearl Tyrant",
    ["guardian", "energy", "drone"],
    trio("Hyderabad", "Arch Square"),
    theme("#2a2030", "#140e18", "#d8c8a8", "#c0a888", "#8a7048", "#f0e4cc", "#243028", "#6e5840"),
  ),
  city(
    "chennai",
    "Chennai",
    "south",
    "A long marina colonnade facing a dark sea.",
    "Marina Colonnade",
    "arch",
    "Marina Dread",
    ["drone", "smoke", "guardian"],
    trio("Chennai", "Marina Colonnade"),
    theme("#3a2018", "#1c100c", "#e0b070", "#c08848", "#a07040", "#f0d0a0", "#2a3824", "#8a5830"),
  ),
  city(
    "kochi",
    "Kochi",
    "south",
    "Backwater nets and warehouse roofs without a spark.",
    "Net Harbour",
    "bridge",
    "Net Haunter",
    ["smoke", "drone", "energy"],
    trio("Kochi", "Net Harbour"),
    theme("#0e3028", "#081c18", "#2a6858", "#1e5048", "#163830", "#d8c8a0", "#146040", "#14342c"),
  ),
  city(
    "mysuru",
    "Mysuru",
    "south",
    "A royal palace that should be a blaze of bulbs.",
    "Palace Illumination",
    "palace",
    "Palace Eclipse",
    ["guardian", "energy", "shadow"],
    trio("Mysuru", "Palace Illumination"),
    theme("#301818", "#180c0c", "#e0b44a", "#c49030", "#8a3018", "#f0d48a", "#2a3818", "#7a2818"),
  ),
  city(
    "india",
    "Light Up All India",
    "nation",
    "Every city is awake. One titan still covers the map.",
    "India Map",
    "map",
    "Darkness Titan",
    ["energy", "drone", "guardian"],
    [["The Last Night", "Cross the map and face the Darkness Titan"]],
    theme("#140e22", "#0c0814", "#2a2418", "#3a3020", "#241c14", "#e7b04a", "#1e3828", "#1a1424"),
  ),
];

export function cityByIndex(index: number): CityDef {
  return CITIES[Math.max(0, Math.min(CITIES.length - 1, index))]!;
}

export function cityById(id: string): CityDef {
  return CITIES.find((c) => c.id === id) ?? CITIES[0]!;
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function slab(
  x: number,
  w: number,
  top: number,
  thick: number,
  kind: Solid["kind"],
  style: SolidStyle,
  extra: Partial<Solid> = {},
): Solid {
  return { kind, style, x: x + w / 2, y: top - thick / 2, w, h: thick, ...extra };
}

function floor(x: number, w: number, top = 0): Solid {
  const thick = top <= 0.04 ? 2 : 0.5;
  return slab(x, w, top, thick, "block", top <= 0.04 ? "road" : "roof");
}

function lengthOf(solids: Solid[]) {
  return Math.max(...solids.map((s) => s.x + s.w / 2)) + 1.2;
}

function pack(
  def: CityDef,
  areaIndex: number,
  solids: Solid[],
  spawns: Spawn[],
  boss: boolean,
): Level {
  const area = def.areas[areaIndex] ?? def.areas[0]!;
  const right = Math.max(...solids.map((s) => s.x + s.w / 2));
  for (const s of solids) {
    s.baseX = s.x;
    s.baseY = s.y;
    s.dx = 0;
    s.dy = 0;
    s.dead = false;
    if (s.kind === "break") s.hp = s.hp ?? 3;
    if (s.kind === "crumble") s.fall = 0;
    if (s.kind === "pulse") {
      s.period = s.period ?? 2.2;
      s.duty = s.duty ?? 0.4;
    }
    if (s.kind === "moving") {
      s.amp = s.amp ?? 1.2;
      s.speed = s.speed ?? 0.9;
      s.phase = s.phase ?? 0;
      s.axis = s.axis ?? "x";
    }
  }
  return {
    cityId: def.id,
    areaIndex,
    name: area.name,
    blurb: area.blurb,
    landmark: def.landmark,
    landmarkKind: def.landmarkKind,
    theme: def.theme,
    solids,
    spawns,
    boss,
    bossName: def.boss,
    titan: def.id === "india",
    goalX: boss ? Number.POSITIVE_INFINITY : right - 2.2,
    length: lengthOf(solids),
    bossTriggerX: boss ? Math.max(8, right - 16) : null,
  };
}

function gurugram(areaIndex: number): Level {
  const def = cityById("gurugram");
  const solids: Solid[] = [];
  const spawns: Spawn[] = [];
  if (areaIndex === 0) {
    solids.push(
      floor(0, 18, 0),
      slab(17.4, 3.2, 0.18, 0.42, "moving", "bridge", { axis: "x", amp: 3.05, speed: 0.82, phase: 0.4 }),
      floor(23.2, 14.2, 0),
      slab(37, 2.3, 1.35, 0.46, "block", "roof"),
      slab(39.7, 2.3, 2.6, 0.46, "block", "roof"),
      slab(42.4, 2.3, 3.85, 0.46, "block", "roof"),
      slab(45, 16, 3.85, 0.5, "block", "glass"),
      slab(49.2, 3.2, 6.7, 0.4, "block", "glass"),
      slab(61.2, 2.2, 2.45, 0.46, "block", "roof"),
      slab(63.8, 2.2, 1.15, 0.46, "block", "roof"),
      floor(66.4, 16, 0),
      slab(83, 1.7, 2.35, 0.36, "crumble", "bridge"),
      slab(85, 1.7, 2.35, 0.36, "crumble", "bridge"),
      slab(87, 1.7, 2.35, 0.36, "crumble", "bridge"),
      slab(89, 1.7, 2.35, 0.36, "crumble", "bridge"),
      floor(82.2, 12, 0),
      floor(96, 8, 0),
      floor(108, 10.4, 0),
      slab(117.6, 4.6, 0, 0.5, "pulse", "road", { period: 2.35, duty: 0.38 }),
      floor(121.6, 22, 0),
      slab(128, 1.3, 1.7, 1.7, "break", "glass", { hp: 3 }),
    );
    spawns.push(
      { kind: "coin", x: 4, y: 1.45 },
      { kind: "coin", x: 6.1, y: 1.7 },
      { kind: "coin", x: 8.2, y: 1.45 },
      { kind: "enemy", x: 13, y: 0, sub: "shadow" },
      { kind: "coin", x: 28, y: 1.5 },
      { kind: "enemy", x: 32, y: 0, sub: "drone" },
      { kind: "coin", x: 48, y: 4.6 },
      { kind: "coin", x: 52, y: 4.7 },
      { kind: "flame", x: 50.6, y: 7.35 },
      { kind: "enemy", x: 56, y: 3.9, sub: "drone" },
      { kind: "flame", x: 58.5, y: 4.7 },
      { kind: "power", x: 72, y: 1.7, sub: "magnet" },
      { kind: "enemy", x: 76, y: 0, sub: "smoke" },
      { kind: "coin", x: 84, y: 3.15 },
      { kind: "coin", x: 88, y: 3.2 },
      { kind: "coin", x: 100, y: 1.5 },
      { kind: "enemy", x: 112, y: 0, sub: "energy" },
      { kind: "flame", x: 133, y: 1.6 },
      { kind: "coin", x: 136, y: 2.2 },
      { kind: "coin", x: 138.2, y: 2.5 },
    );
  } else if (areaIndex === 1) {
    solids.push(
      floor(0, 16, 0),
      slab(15.4, 3.2, 1.55, 0.42, "moving", "bridge", { axis: "y", amp: 1.5, speed: 0.7, phase: 1.1 }),
      slab(18.2, 9, 3.05, 0.48, "block", "glass"),
      slab(28.2, 2.4, 1.6, 0.44, "block", "roof"),
      floor(31, 10, 0),
      slab(40.6, 3.1, 0.18, 0.42, "moving", "bridge", { axis: "x", amp: 3.8, speed: 0.78, phase: 0.2 }),
      floor(47.2, 13, 0),
      slab(61, 2.2, 1.4, 0.44, "block", "roof"),
      slab(63.6, 2.2, 2.7, 0.44, "block", "roof"),
      slab(66.2, 10, 2.7, 0.48, "block", "roof"),
      slab(68, 2.6, 4.9, 0.4, "block", "glass"),
      slab(76.6, 2.2, 1.4, 0.44, "block", "roof"),
      floor(79.2, 20, 0),
      slab(86, 3.4, 0, 0.5, "pulse", "road", { period: 2.1, duty: 0.36 }),
    );
    spawns.push(
      { kind: "coin", x: 5, y: 1.5 },
      { kind: "flame", x: 12, y: 1.55 },
      { kind: "enemy", x: 22, y: 3, sub: "drone" },
      { kind: "coin", x: 23, y: 3.8 },
      { kind: "power", x: 35, y: 1.8, sub: "jump" },
      { kind: "enemy", x: 53, y: 0, sub: "shadow" },
      { kind: "flame", x: 69.2, y: 5.55 },
      { kind: "coin", x: 70, y: 3.5 },
      { kind: "enemy", x: 82, y: 0, sub: "guardian" },
      { kind: "flame", x: 92, y: 1.6 },
      { kind: "coin", x: 95, y: 2.1 },
    );
  } else if (areaIndex === 2) {
    solids.push(
      floor(0, 12, 0),
      slab(14.2, 2.6, 0.35, 0.4, "bounce", "bridge"),
      slab(18.8, 2.6, 0.9, 0.4, "bounce", "bridge"),
      slab(23.4, 2.6, 0.4, 0.4, "bounce", "bridge"),
      slab(28, 2.6, 1.35, 0.4, "bounce", "bridge"),
      floor(33.2, 12, 0),
      slab(46, 2.2, 1.3, 0.42, "block", "roof"),
      slab(48.6, 8, 1.3, 0.4, "block", "bridge"),
      slab(57.2, 2.2, 1.3, 0.42, "crumble", "bridge"),
      slab(59.6, 2.2, 1.3, 0.42, "crumble", "bridge"),
      floor(45.5, 18, 0),
      floor(64.5, 14, 0),
      slab(79, 2.6, 0.3, 0.4, "bounce", "bridge"),
      slab(83.6, 2.6, 1.1, 0.4, "bounce", "bridge"),
      floor(88.4, 18, 0),
    );
    spawns.push(
      { kind: "coin", x: 6, y: 1.5 },
      { kind: "enemy", x: 9, y: 0, sub: "shadow" },
      { kind: "coin", x: 15.4, y: 1.5 },
      { kind: "coin", x: 24.6, y: 1.7 },
      { kind: "flame", x: 37, y: 1.6 },
      { kind: "enemy", x: 50, y: 1.35, sub: "drone" },
      { kind: "power", x: 52, y: 2.5, sub: "shield" },
      { kind: "coin", x: 58, y: 2.2 },
      { kind: "enemy", x: 70, y: 0, sub: "smoke" },
      { kind: "flame", x: 84.8, y: 2.3 },
      { kind: "flame", x: 98, y: 1.6 },
      { kind: "coin", x: 100, y: 2.2 },
    );
  } else if (areaIndex === 3) {
    solids.push(
      floor(0, 14, 0),
      slab(14.2, 3.2, 0, 0.5, "pulse", "road", { period: 2.5, duty: 0.34 }),
      floor(17.6, 8, 0),
      slab(26, 2.2, 1.25, 0.44, "block", "sand"),
      slab(28.6, 2.2, 2.4, 0.44, "block", "sand"),
      slab(31.2, 7, 2.4, 0.46, "block", "roof"),
      slab(33, 1.2, 4.1, 1.6, "break", "sand", { hp: 3 }),
      slab(38.6, 2.2, 1.2, 0.44, "block", "roof"),
      floor(41.2, 12, 0),
      slab(53.5, 1.6, 2.2, 0.36, "crumble", "bridge"),
      slab(55.4, 1.6, 2.2, 0.36, "crumble", "bridge"),
      slab(57.3, 1.6, 2.2, 0.36, "crumble", "bridge"),
      floor(53, 10, 0),
      floor(64, 10, 0),
      slab(73.4, 3.1, 0.16, 0.42, "moving", "bridge", { axis: "x", amp: 2.85, speed: 0.9, phase: 1.2 }),
      floor(78.8, 18, 0),
    );
    spawns.push(
      { kind: "flame", x: 8, y: 1.55 },
      { kind: "enemy", x: 21, y: 0, sub: "shadow" },
      { kind: "coin", x: 32, y: 3.2 },
      { kind: "flame", x: 34.6, y: 3.2 },
      { kind: "power", x: 46, y: 1.8, sub: "life" },
      { kind: "enemy", x: 48, y: 0, sub: "energy" },
      { kind: "coin", x: 56, y: 3.05 },
      { kind: "enemy", x: 68, y: 0, sub: "smoke" },
      { kind: "flame", x: 90, y: 1.6 },
      { kind: "coin", x: 92, y: 2.3 },
    );
  } else {
    solids.push(
      floor(0, 30, 0),
      slab(-0.8, 1.1, 4.2, 8, "block", "road"),
      slab(29.2, 1.1, 4.2, 8, "block", "road"),
      slab(8, 3.2, 2.1, 0.42, "block", "roof"),
      slab(18, 3.2, 2.4, 0.42, "block", "glass"),
    );
    spawns.push({ kind: "power", x: 6, y: 1.6, sub: "star" });
  }
  return pack(def, areaIndex, solids, spawns, areaIndex === 4);
}

function indiaLevel(): Level {
  const def = cityById("india");
  const solids: Solid[] = [
    floor(0, 12, 0),
    slab(13, 4, 1.2, 0.45, "block", "roof"),
    slab(18.2, 4, 1.2, 0.45, "block", "roof"),
    floor(23.4, 10, 0),
    slab(34, 4, 1.5, 0.45, "block", "glass"),
    slab(39.2, 4, 1.5, 0.45, "block", "glass"),
    floor(44.4, 12, 0),
    slab(57, 3, 0.2, 0.42, "moving", "bridge", { axis: "x", amp: 2, speed: 0.8, phase: 0.5 }),
    floor(64, 28, 0),
    slab(70, 3, 2, 0.4, "block", "roof"),
    slab(82, 3, 2.2, 0.4, "block", "glass"),
  ];
  const spawns: Spawn[] = [
    { kind: "flame", x: 15, y: 2.05 },
    { kind: "flame", x: 36, y: 2.35 },
    { kind: "flame", x: 48, y: 1.6 },
    { kind: "enemy", x: 50, y: 0, sub: "drone" },
    { kind: "flame", x: 60, y: 1.5 },
    { kind: "enemy", x: 74, y: 0, sub: "guardian" },
    { kind: "power", x: 68, y: 1.7, sub: "mega" },
    { kind: "coin", x: 8, y: 1.6 },
    { kind: "coin", x: 26, y: 1.6 },
    { kind: "coin", x: 46, y: 1.6 },
  ];
  const level = pack(def, 0, solids, spawns, true);
  level.bossTriggerX = 66;
  return level;
}

function generated(def: CityDef, areaIndex: number): Level {
  const rng = mulberry32(hashStr(`${def.id}:${areaIndex}`));
  const solids: Solid[] = [];
  const spawns: Spawn[] = [];
  let x = 0;
  let h = 0;
  const addTop = (w: number, top: number, kind: Solid["kind"] = "block", style?: SolidStyle) => {
    const use = style ?? (top <= 0.04 ? "road" : "roof");
    solids.push(floorLike(x, w, top, kind, use));
    x += w;
  };
  addTop(14, 0);
  spawns.push({ kind: "coin", x: 4, y: 1.5 }, { kind: "coin", x: 6.3, y: 1.75 }, { kind: "flame", x: 11, y: 1.55 });
  if (rng() < 0.8) spawns.push({ kind: "enemy", x: 8.5, y: 0, sub: def.enemies[0] });

  const vertical = areaIndex === 1;
  for (let i = 0; i < 6; i++) {
    const roll = rng();
    if (vertical ? roll < 0.55 : roll < 0.34) {
      const gap = 4.6 + rng() * 0.5;
      const w = 2.8;
      const spanStart = x - 0.35;
      const spanEnd = x + gap + 0.35;
      const center = (spanStart + spanEnd) / 2;
      const amp = Math.max(1.15, (spanEnd - spanStart) / 2 - w / 2);
      const top = h + 0.15;
      solids.push(
        slab(center - w / 2, w, top, 0.42, "moving", "bridge", {
          axis: "x",
          amp,
          speed: 0.78 + rng() * 0.3,
          phase: rng() * 5,
        }),
      );
      x += gap;
      const land = 7 + rng() * 3;
      addTop(land, h);
      if (rng() < 0.65) spawns.push({ kind: "enemy", x: x - land * 0.6, y: h, sub: def.enemies[i % def.enemies.length] });
      spawns.push({ kind: "coin", x: x - land * 0.4, y: h + 1.5 });
    } else if (roll < 0.58) {
      const step = 1.2;
      for (let s = 0; s < 3; s++) {
        solids.push(slab(x, 2.2, h + step * (s + 1), 0.44, "block", "roof"));
        x += 2.45;
      }
      h = Math.min(4.8, h + step * 3);
      addTop(6 + rng() * 2, h, "block", "glass");
      spawns.push({ kind: "coin", x: x - 3, y: h + 1.35 });
    } else if (roll < 0.74) {
      while (h > 0.2) {
        h = Math.max(0, h - 1.25);
        solids.push(slab(x, 2.3, h, 0.44, "block", h <= 0.04 ? "road" : "roof"));
        x += 2.5;
      }
      addTop(8, 0);
    } else if (roll < 0.88) {
      const start = x;
      addTop(11, h);
      for (let c = 0; c < 4; c++) {
        solids.push(slab(start + 1 + c * 2, 1.55, h + 2.15, 0.34, "crumble", "bridge"));
      }
      spawns.push({ kind: "coin", x: start + 4, y: h + 2.9 }, { kind: "coin", x: start + 7, y: h + 2.95 });
    } else {
      x += 3.2;
      addTop(8, h);
      solids.push(slab(x - 8, 3.3, h, 0.48, "pulse", "road", { period: 2.2 + rng() * 0.4, duty: 0.34 }));
    }
  }
  while (h > 0.2) {
    h = Math.max(0, h - 1.25);
    solids.push(slab(x, 2.3, Math.max(h, 0), 0.44, "block", "roof"));
    x += 2.5;
  }
  addTop(16, 0);
  const powers = ["star", "mega", "shield", "jump", "magnet", "life", "flame"];
  spawns.push(
    { kind: "flame", x: x - 8, y: 1.6 },
    { kind: "flame", x: 22, y: 3.5 },
    { kind: "power", x: 16, y: 1.8, sub: powers[(areaIndex + def.name.length) % powers.length] },
    { kind: "coin", x: x - 5, y: 2.2 },
    { kind: "coin", x: x - 3.2, y: 2.5 },
  );
  solids.push(slab(20, 3, 3.55, 0.4, "block", "glass"));
  return pack(def, areaIndex, solids, spawns, false);
}

function floorLike(x: number, w: number, top: number, kind: Solid["kind"], style: SolidStyle): Solid {
  if (kind === "block" && top <= 0.04) return floor(x, w, 0);
  const thick = top <= 0.04 ? 2 : 0.48;
  return slab(x, w, top, thick, kind, style);
}

function bossArena(def: CityDef, areaIndex: number): Level {
  const solids: Solid[] = [
    floor(0, 32, 0),
    slab(-1, 1.2, 4.5, 9, "block", "road"),
    slab(31.2, 1.2, 4.5, 9, "block", "road"),
    slab(9, 3.4, 2.15, 0.42, "block", "roof"),
    slab(19.5, 3.4, 2.35, 0.42, "block", def.landmarkKind === "glass" ? "glass" : "sand"),
  ];
  const spawns: Spawn[] = [{ kind: "power", x: 5.5, y: 1.55, sub: areaIndex % 2 === 0 ? "shield" : "star" }];
  const level = pack(def, areaIndex, solids, spawns, true);
  level.bossTriggerX = 4;
  return level;
}

export function buildLevel(cityId: string, areaIndex: number): Level {
  const def = cityById(cityId);
  const idx = Math.max(0, Math.min(def.areas.length - 1, areaIndex));
  if (def.id === "gurugram") return gurugram(idx);
  if (def.id === "india") return indiaLevel();
  const last = idx === def.areas.length - 1;
  if (last) return bossArena(def, idx);
  return generated(def, idx);
}
