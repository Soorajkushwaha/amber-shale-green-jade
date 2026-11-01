import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, c as Heart, d as ChevronLeft, i as Settings, l as Flame, n as Star, o as Pause, r as Shield, s as Lock, u as Crosshair } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CUmJjlQc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var REGIONS = [
	{
		id: "north",
		name: "North India",
		line: "Towers, forts, marble and river fog"
	},
	{
		id: "west",
		name: "West India",
		line: "Sea roads, lakes and carved streets"
	},
	{
		id: "east",
		name: "East India",
		line: "Ghats, spires and hill mist"
	},
	{
		id: "south",
		name: "South India",
		line: "Gardens, palaces and warm harbours"
	},
	{
		id: "nation",
		name: "All India",
		line: "The last night over the whole map"
	}
];
function theme(sky, fog, ground, road, roof, glass, foliage, building, accent = "#e7b04a") {
	return {
		sky,
		fog,
		ground,
		road,
		roof,
		glass,
		foliage,
		accent,
		building
	};
}
function areas(list) {
	return list.map(([name, blurb]) => ({
		name,
		blurb
	}));
}
function city(id, name, region, blurb, landmark, landmarkKind, boss, enemies, areaList, look) {
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
		theme: look
	};
}
function trio(name, landmark) {
	return [
		[`${name} Streets`, `Dark lanes on the way to ${landmark}`],
		[`${name} Rooftops`, `Jump the roofs while the lamps are still out`],
		[landmark, `A darkness monster holds ${landmark}`]
	];
}
var CITIES = [
	city("gurugram", "Gurugram", "north", "Glass towers asleep under a powerless skyline.", "Cyber Hub Terrace", "glass", "Grid Wraith", [
		"shadow",
		"drone",
		"smoke"
	], [
		["Cyber City", "Skybridges between dark towers"],
		["Millennium City Centre", "Lifts over the metro cut"],
		["Golf Course Road", "Bounce the water gaps"],
		["Residential Society", "Lanes, gates and night lamps"],
		["Final Home Illumination", "The Grid Wraith guards the last house"]
	], theme("#241848", "#120e22", "#2a3344", "#3c4a60", "#2a3344", "#8eafc4", "#1d3b34", "#1b2433")),
	city("delhi", "Delhi", "north", "A wide ceremonial avenue waiting for its lamps.", "Lamp Arch", "arch", "Smog Regent", [
		"shadow",
		"guardian",
		"drone"
	], trio("Delhi", "Lamp Arch"), theme("#3a2418", "#1a120e", "#6a4a32", "#8a6244", "#5a3e2c", "#c4a078", "#2a4030", "#4a3424")),
	city("jaipur", "Jaipur", "north", "Pink stone facades gone dim before festival night.", "Palace Gate", "palace", "Fort Shadow", [
		"guardian",
		"shadow",
		"energy"
	], trio("Jaipur", "Palace Gate"), theme("#4a2030", "#241018", "#c48878", "#a86858", "#8a5048", "#e0b0a0", "#3a4030", "#a05858")),
	city("agra", "Agra", "north", "A marble dream on the river, still unlit.", "Marble Dome", "dome", "Marble Maw", [
		"drone",
		"smoke",
		"energy"
	], trio("Agra", "Marble Dome"), theme("#243044", "#141820", "#d9d2c6", "#b7b0a4", "#eee8de", "#f4f0e8", "#2c4038", "#cfc6b8")),
	city("lucknow", "Lucknow", "north", "Nawabi arches and a courtyard without its chandeliers.", "Arch Courtyard", "palace", "Nawabi Gloom", [
		"shadow",
		"smoke",
		"guardian"
	], trio("Lucknow", "Arch Courtyard"), theme("#1c2430", "#10161c", "#c4a15a", "#8a7040", "#6e5830", "#e0c488", "#243828", "#7a6234")),
	city("mumbai", "Mumbai", "west", "A sea road curled in the dark, waiting for a string of lamps.", "Sea Corniche", "bridge", "Tide Leviathan", [
		"drone",
		"energy",
		"smoke"
	], trio("Mumbai", "Sea Corniche"), theme("#0e2438", "#08141e", "#1c4a58", "#245868", "#163844", "#7eb0c0", "#143830", "#123040")),
	city("pune", "Pune", "west", "Hill ridges and college rooftops under a quiet sky.", "Hill Ridge", "fort", "Hill Stalker", [
		"shadow",
		"guardian",
		"drone"
	], trio("Pune", "Hill Ridge"), theme("#243028", "#121814", "#5a5044", "#6e6454", "#3e4a38", "#a89878", "#2e5034", "#3a4034")),
	city("ahmedabad", "Ahmedabad", "west", "Carved wooden lanes with every diya blown out.", "Carved Pol", "fort", "Pol Spectre", [
		"shadow",
		"smoke",
		"guardian"
	], trio("Ahmedabad", "Carved Pol"), theme("#3a2414", "#1c120c", "#b88848", "#8a6234", "#6a4828", "#e0b070", "#2a3820", "#6e4a28")),
	city("surat", "Surat", "west", "A riverfront that should glitter and doesn't.", "River Glint", "bridge", "Glint Devourer", [
		"energy",
		"drone",
		"smoke"
	], trio("Surat", "River Glint"), theme("#1a2840", "#0e1624", "#3a5068", "#4a6478", "#2a3c50", "#d0d8e4", "#1e3834", "#243448")),
	city("udaipur", "Udaipur", "west", "White pavilions on a lake that has lost its reflection.", "Lake Pavilion", "lake", "Lake Serpent", [
		"smoke",
		"energy",
		"guardian"
	], trio("Udaipur", "Lake Pavilion"), theme("#16304a", "#0c1c2c", "#e8e0d4", "#c8d4dc", "#f4f0ea", "#f7f4ef", "#1e4038", "#d5ddd8")),
	city("kolkata", "Kolkata", "east", "Yellow colonial fronts and a bridge in the mist.", "Mist Span", "bridge", "Howrah Hollow", [
		"smoke",
		"shadow",
		"drone"
	], trio("Kolkata", "Mist Span"), theme("#2a2418", "#16140e", "#e0c56a", "#c2a24e", "#a88838", "#f0dc88", "#2a3820", "#b8963c")),
	city("bhubaneswar", "Bhubaneswar", "east", "Temple spires pricking a sky with no festival lamps.", "Spire Court", "spire", "Spire Shade", [
		"guardian",
		"energy",
		"shadow"
	], trio("Bhubaneswar", "Spire Court"), theme("#3a2818", "#1c140e", "#c49868", "#a07848", "#8a6238", "#e8c898", "#2c4024", "#8a6840")),
	city("patna", "Patna", "east", "Wide river steps with every lamp cold.", "River Steps", "ghat", "Ghat Colossus", [
		"smoke",
		"guardian",
		"shadow"
	], trio("Patna", "River Steps"), theme("#243040", "#121820", "#8a7058", "#a08060", "#6a5844", "#d0b898", "#243428", "#5a4838")),
	city("guwahati", "Guwahati", "east", "A broad river and hills with the town lights out.", "River Bend", "ghat", "River Umbra", [
		"smoke",
		"drone",
		"energy"
	], trio("Guwahati", "River Bend"), theme("#143028", "#0c1c18", "#3a5848", "#4e6a52", "#2a4034", "#b7c8a4", "#1e5030", "#24382c")),
	city("shillong", "Shillong", "east", "Pine ridges in a cloud, cottages gone dark.", "Cloud Ridge", "fort", "Cloud Stalker", [
		"shadow",
		"drone",
		"smoke"
	], trio("Shillong", "Cloud Ridge"), theme("#1c2830", "#10181c", "#5a6870", "#6a7880", "#3e4c44", "#c5d0c8", "#2a4834", "#3a4848")),
	city("bengaluru", "Bengaluru", "south", "Rain trees and glass blocks sharing one blackout.", "Garden Glass", "glass", "Garden Null", [
		"drone",
		"energy",
		"shadow"
	], trio("Bengaluru", "Garden Glass"), theme("#14281c", "#0c1810", "#2a4034", "#3e5848", "#24382c", "#9eb8a4", "#1a5828", "#1c3024")),
	city("hyderabad", "Hyderabad", "south", "Pearl-city arches around an unlit square.", "Arch Square", "arch", "Pearl Tyrant", [
		"guardian",
		"energy",
		"drone"
	], trio("Hyderabad", "Arch Square"), theme("#2a2030", "#140e18", "#d8c8a8", "#c0a888", "#8a7048", "#f0e4cc", "#243028", "#6e5840")),
	city("chennai", "Chennai", "south", "A long marina colonnade facing a dark sea.", "Marina Colonnade", "arch", "Marina Dread", [
		"drone",
		"smoke",
		"guardian"
	], trio("Chennai", "Marina Colonnade"), theme("#3a2018", "#1c100c", "#e0b070", "#c08848", "#a07040", "#f0d0a0", "#2a3824", "#8a5830")),
	city("kochi", "Kochi", "south", "Backwater nets and warehouse roofs without a spark.", "Net Harbour", "bridge", "Net Haunter", [
		"smoke",
		"drone",
		"energy"
	], trio("Kochi", "Net Harbour"), theme("#0e3028", "#081c18", "#2a6858", "#1e5048", "#163830", "#d8c8a0", "#146040", "#14342c")),
	city("mysuru", "Mysuru", "south", "A royal palace that should be a blaze of bulbs.", "Palace Illumination", "palace", "Palace Eclipse", [
		"guardian",
		"energy",
		"shadow"
	], trio("Mysuru", "Palace Illumination"), theme("#301818", "#180c0c", "#e0b44a", "#c49030", "#8a3018", "#f0d48a", "#2a3818", "#7a2818")),
	city("india", "Light Up All India", "nation", "Every city is awake. One titan still covers the map.", "India Map", "map", "Darkness Titan", [
		"energy",
		"drone",
		"guardian"
	], [["The Last Night", "Cross the map and face the Darkness Titan"]], theme("#140e22", "#0c0814", "#2a2418", "#3a3020", "#241c14", "#e7b04a", "#1e3828", "#1a1424"))
];
function cityByIndex(index) {
	return CITIES[Math.max(0, Math.min(CITIES.length - 1, index))];
}
function cityById(id) {
	return CITIES.find((c) => c.id === id) ?? CITIES[0];
}
function hashStr(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function slab(x, w, top, thick, kind, style, extra = {}) {
	return {
		kind,
		style,
		x: x + w / 2,
		y: top - thick / 2,
		w,
		h: thick,
		...extra
	};
}
function floor(x, w, top = 0) {
	return slab(x, w, top, top <= .04 ? 2 : .5, "block", top <= .04 ? "road" : "roof");
}
function lengthOf(solids) {
	return Math.max(...solids.map((s) => s.x + s.w / 2)) + 1.2;
}
function pack(def, areaIndex, solids, spawns, boss) {
	const area = def.areas[areaIndex] ?? def.areas[0];
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
			s.duty = s.duty ?? .4;
		}
		if (s.kind === "moving") {
			s.amp = s.amp ?? 1.2;
			s.speed = s.speed ?? .9;
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
		bossTriggerX: boss ? Math.max(8, right - 16) : null
	};
}
function gurugram(areaIndex) {
	const def = cityById("gurugram");
	const solids = [];
	const spawns = [];
	if (areaIndex === 0) {
		solids.push(floor(0, 18, 0), slab(17.4, 3.2, .18, .42, "moving", "bridge", {
			axis: "x",
			amp: 3.05,
			speed: .82,
			phase: .4
		}), floor(23.2, 14.2, 0), slab(37, 2.3, 1.35, .46, "block", "roof"), slab(39.7, 2.3, 2.6, .46, "block", "roof"), slab(42.4, 2.3, 3.85, .46, "block", "roof"), slab(45, 16, 3.85, .5, "block", "glass"), slab(49.2, 3.2, 6.7, .4, "block", "glass"), slab(61.2, 2.2, 2.45, .46, "block", "roof"), slab(63.8, 2.2, 1.15, .46, "block", "roof"), floor(66.4, 16, 0), slab(83, 1.7, 2.35, .36, "crumble", "bridge"), slab(85, 1.7, 2.35, .36, "crumble", "bridge"), slab(87, 1.7, 2.35, .36, "crumble", "bridge"), slab(89, 1.7, 2.35, .36, "crumble", "bridge"), floor(82.2, 12, 0), floor(96, 8, 0), floor(108, 10.4, 0), slab(117.6, 4.6, 0, .5, "pulse", "road", {
			period: 2.35,
			duty: .38
		}), floor(121.6, 22, 0), slab(128, 1.3, 1.7, 1.7, "break", "glass", { hp: 3 }));
		spawns.push({
			kind: "coin",
			x: 4,
			y: 1.45
		}, {
			kind: "coin",
			x: 6.1,
			y: 1.7
		}, {
			kind: "coin",
			x: 8.2,
			y: 1.45
		}, {
			kind: "enemy",
			x: 13,
			y: 0,
			sub: "shadow"
		}, {
			kind: "coin",
			x: 28,
			y: 1.5
		}, {
			kind: "enemy",
			x: 32,
			y: 0,
			sub: "drone"
		}, {
			kind: "coin",
			x: 48,
			y: 4.6
		}, {
			kind: "coin",
			x: 52,
			y: 4.7
		}, {
			kind: "flame",
			x: 50.6,
			y: 7.35
		}, {
			kind: "enemy",
			x: 56,
			y: 3.9,
			sub: "drone"
		}, {
			kind: "flame",
			x: 58.5,
			y: 4.7
		}, {
			kind: "power",
			x: 72,
			y: 1.7,
			sub: "magnet"
		}, {
			kind: "enemy",
			x: 76,
			y: 0,
			sub: "smoke"
		}, {
			kind: "coin",
			x: 84,
			y: 3.15
		}, {
			kind: "coin",
			x: 88,
			y: 3.2
		}, {
			kind: "coin",
			x: 100,
			y: 1.5
		}, {
			kind: "enemy",
			x: 112,
			y: 0,
			sub: "energy"
		}, {
			kind: "flame",
			x: 133,
			y: 1.6
		}, {
			kind: "coin",
			x: 136,
			y: 2.2
		}, {
			kind: "coin",
			x: 138.2,
			y: 2.5
		});
	} else if (areaIndex === 1) {
		solids.push(floor(0, 16, 0), slab(15.4, 3.2, 1.55, .42, "moving", "bridge", {
			axis: "y",
			amp: 1.5,
			speed: .7,
			phase: 1.1
		}), slab(18.2, 9, 3.05, .48, "block", "glass"), slab(28.2, 2.4, 1.6, .44, "block", "roof"), floor(31, 10, 0), slab(40.6, 3.1, .18, .42, "moving", "bridge", {
			axis: "x",
			amp: 3.8,
			speed: .78,
			phase: .2
		}), floor(47.2, 13, 0), slab(61, 2.2, 1.4, .44, "block", "roof"), slab(63.6, 2.2, 2.7, .44, "block", "roof"), slab(66.2, 10, 2.7, .48, "block", "roof"), slab(68, 2.6, 4.9, .4, "block", "glass"), slab(76.6, 2.2, 1.4, .44, "block", "roof"), floor(79.2, 20, 0), slab(86, 3.4, 0, .5, "pulse", "road", {
			period: 2.1,
			duty: .36
		}));
		spawns.push({
			kind: "coin",
			x: 5,
			y: 1.5
		}, {
			kind: "flame",
			x: 12,
			y: 1.55
		}, {
			kind: "enemy",
			x: 22,
			y: 3,
			sub: "drone"
		}, {
			kind: "coin",
			x: 23,
			y: 3.8
		}, {
			kind: "power",
			x: 35,
			y: 1.8,
			sub: "jump"
		}, {
			kind: "enemy",
			x: 53,
			y: 0,
			sub: "shadow"
		}, {
			kind: "flame",
			x: 69.2,
			y: 5.55
		}, {
			kind: "coin",
			x: 70,
			y: 3.5
		}, {
			kind: "enemy",
			x: 82,
			y: 0,
			sub: "guardian"
		}, {
			kind: "flame",
			x: 92,
			y: 1.6
		}, {
			kind: "coin",
			x: 95,
			y: 2.1
		});
	} else if (areaIndex === 2) {
		solids.push(floor(0, 12, 0), slab(14.2, 2.6, .35, .4, "bounce", "bridge"), slab(18.8, 2.6, .9, .4, "bounce", "bridge"), slab(23.4, 2.6, .4, .4, "bounce", "bridge"), slab(28, 2.6, 1.35, .4, "bounce", "bridge"), floor(33.2, 12, 0), slab(46, 2.2, 1.3, .42, "block", "roof"), slab(48.6, 8, 1.3, .4, "block", "bridge"), slab(57.2, 2.2, 1.3, .42, "crumble", "bridge"), slab(59.6, 2.2, 1.3, .42, "crumble", "bridge"), floor(45.5, 18, 0), floor(64.5, 14, 0), slab(79, 2.6, .3, .4, "bounce", "bridge"), slab(83.6, 2.6, 1.1, .4, "bounce", "bridge"), floor(88.4, 18, 0));
		spawns.push({
			kind: "coin",
			x: 6,
			y: 1.5
		}, {
			kind: "enemy",
			x: 9,
			y: 0,
			sub: "shadow"
		}, {
			kind: "coin",
			x: 15.4,
			y: 1.5
		}, {
			kind: "coin",
			x: 24.6,
			y: 1.7
		}, {
			kind: "flame",
			x: 37,
			y: 1.6
		}, {
			kind: "enemy",
			x: 50,
			y: 1.35,
			sub: "drone"
		}, {
			kind: "power",
			x: 52,
			y: 2.5,
			sub: "shield"
		}, {
			kind: "coin",
			x: 58,
			y: 2.2
		}, {
			kind: "enemy",
			x: 70,
			y: 0,
			sub: "smoke"
		}, {
			kind: "flame",
			x: 84.8,
			y: 2.3
		}, {
			kind: "flame",
			x: 98,
			y: 1.6
		}, {
			kind: "coin",
			x: 100,
			y: 2.2
		});
	} else if (areaIndex === 3) {
		solids.push(floor(0, 14, 0), slab(14.2, 3.2, 0, .5, "pulse", "road", {
			period: 2.5,
			duty: .34
		}), floor(17.6, 8, 0), slab(26, 2.2, 1.25, .44, "block", "sand"), slab(28.6, 2.2, 2.4, .44, "block", "sand"), slab(31.2, 7, 2.4, .46, "block", "roof"), slab(33, 1.2, 4.1, 1.6, "break", "sand", { hp: 3 }), slab(38.6, 2.2, 1.2, .44, "block", "roof"), floor(41.2, 12, 0), slab(53.5, 1.6, 2.2, .36, "crumble", "bridge"), slab(55.4, 1.6, 2.2, .36, "crumble", "bridge"), slab(57.3, 1.6, 2.2, .36, "crumble", "bridge"), floor(53, 10, 0), floor(64, 10, 0), slab(73.4, 3.1, .16, .42, "moving", "bridge", {
			axis: "x",
			amp: 2.85,
			speed: .9,
			phase: 1.2
		}), floor(78.8, 18, 0));
		spawns.push({
			kind: "flame",
			x: 8,
			y: 1.55
		}, {
			kind: "enemy",
			x: 21,
			y: 0,
			sub: "shadow"
		}, {
			kind: "coin",
			x: 32,
			y: 3.2
		}, {
			kind: "flame",
			x: 34.6,
			y: 3.2
		}, {
			kind: "power",
			x: 46,
			y: 1.8,
			sub: "life"
		}, {
			kind: "enemy",
			x: 48,
			y: 0,
			sub: "energy"
		}, {
			kind: "coin",
			x: 56,
			y: 3.05
		}, {
			kind: "enemy",
			x: 68,
			y: 0,
			sub: "smoke"
		}, {
			kind: "flame",
			x: 90,
			y: 1.6
		}, {
			kind: "coin",
			x: 92,
			y: 2.3
		});
	} else {
		solids.push(floor(0, 30, 0), slab(-.8, 1.1, 4.2, 8, "block", "road"), slab(29.2, 1.1, 4.2, 8, "block", "road"), slab(8, 3.2, 2.1, .42, "block", "roof"), slab(18, 3.2, 2.4, .42, "block", "glass"));
		spawns.push({
			kind: "power",
			x: 6,
			y: 1.6,
			sub: "star"
		});
	}
	return pack(def, areaIndex, solids, spawns, areaIndex === 4);
}
function indiaLevel() {
	const level = pack(cityById("india"), 0, [
		floor(0, 12, 0),
		slab(13, 4, 1.2, .45, "block", "roof"),
		slab(18.2, 4, 1.2, .45, "block", "roof"),
		floor(23.4, 10, 0),
		slab(34, 4, 1.5, .45, "block", "glass"),
		slab(39.2, 4, 1.5, .45, "block", "glass"),
		floor(44.4, 12, 0),
		slab(57, 3, .2, .42, "moving", "bridge", {
			axis: "x",
			amp: 2,
			speed: .8,
			phase: .5
		}),
		floor(64, 28, 0),
		slab(70, 3, 2, .4, "block", "roof"),
		slab(82, 3, 2.2, .4, "block", "glass")
	], [
		{
			kind: "flame",
			x: 15,
			y: 2.05
		},
		{
			kind: "flame",
			x: 36,
			y: 2.35
		},
		{
			kind: "flame",
			x: 48,
			y: 1.6
		},
		{
			kind: "enemy",
			x: 50,
			y: 0,
			sub: "drone"
		},
		{
			kind: "flame",
			x: 60,
			y: 1.5
		},
		{
			kind: "enemy",
			x: 74,
			y: 0,
			sub: "guardian"
		},
		{
			kind: "power",
			x: 68,
			y: 1.7,
			sub: "mega"
		},
		{
			kind: "coin",
			x: 8,
			y: 1.6
		},
		{
			kind: "coin",
			x: 26,
			y: 1.6
		},
		{
			kind: "coin",
			x: 46,
			y: 1.6
		}
	], true);
	level.bossTriggerX = 66;
	return level;
}
function generated(def, areaIndex) {
	const rng = mulberry32(hashStr(`${def.id}:${areaIndex}`));
	const solids = [];
	const spawns = [];
	let x = 0;
	let h = 0;
	const addTop = (w, top, kind = "block", style) => {
		const use = style ?? (top <= .04 ? "road" : "roof");
		solids.push(floorLike(x, w, top, kind, use));
		x += w;
	};
	addTop(14, 0);
	spawns.push({
		kind: "coin",
		x: 4,
		y: 1.5
	}, {
		kind: "coin",
		x: 6.3,
		y: 1.75
	}, {
		kind: "flame",
		x: 11,
		y: 1.55
	});
	if (rng() < .8) spawns.push({
		kind: "enemy",
		x: 8.5,
		y: 0,
		sub: def.enemies[0]
	});
	const vertical = areaIndex === 1;
	for (let i = 0; i < 6; i++) {
		const roll = rng();
		if (vertical ? roll < .55 : roll < .34) {
			const gap = 4.6 + rng() * .5;
			const w = 2.8;
			const spanStart = x - .35;
			const spanEnd = x + gap + .35;
			const center = (spanStart + spanEnd) / 2;
			const amp = Math.max(1.15, (spanEnd - spanStart) / 2 - w / 2);
			const top = h + .15;
			solids.push(slab(center - w / 2, w, top, .42, "moving", "bridge", {
				axis: "x",
				amp,
				speed: .78 + rng() * .3,
				phase: rng() * 5
			}));
			x += gap;
			const land = 7 + rng() * 3;
			addTop(land, h);
			if (rng() < .65) spawns.push({
				kind: "enemy",
				x: x - land * .6,
				y: h,
				sub: def.enemies[i % def.enemies.length]
			});
			spawns.push({
				kind: "coin",
				x: x - land * .4,
				y: h + 1.5
			});
		} else if (roll < .58) {
			const step = 1.2;
			for (let s = 0; s < 3; s++) {
				solids.push(slab(x, 2.2, h + step * (s + 1), .44, "block", "roof"));
				x += 2.45;
			}
			h = Math.min(4.8, h + step * 3);
			addTop(6 + rng() * 2, h, "block", "glass");
			spawns.push({
				kind: "coin",
				x: x - 3,
				y: h + 1.35
			});
		} else if (roll < .74) {
			while (h > .2) {
				h = Math.max(0, h - 1.25);
				solids.push(slab(x, 2.3, h, .44, "block", h <= .04 ? "road" : "roof"));
				x += 2.5;
			}
			addTop(8, 0);
		} else if (roll < .88) {
			const start = x;
			addTop(11, h);
			for (let c = 0; c < 4; c++) solids.push(slab(start + 1 + c * 2, 1.55, h + 2.15, .34, "crumble", "bridge"));
			spawns.push({
				kind: "coin",
				x: start + 4,
				y: h + 2.9
			}, {
				kind: "coin",
				x: start + 7,
				y: h + 2.95
			});
		} else {
			x += 3.2;
			addTop(8, h);
			solids.push(slab(x - 8, 3.3, h, .48, "pulse", "road", {
				period: 2.2 + rng() * .4,
				duty: .34
			}));
		}
	}
	while (h > .2) {
		h = Math.max(0, h - 1.25);
		solids.push(slab(x, 2.3, Math.max(h, 0), .44, "block", "roof"));
		x += 2.5;
	}
	addTop(16, 0);
	const powers = [
		"star",
		"mega",
		"shield",
		"jump",
		"magnet",
		"life",
		"flame"
	];
	spawns.push({
		kind: "flame",
		x: x - 8,
		y: 1.6
	}, {
		kind: "flame",
		x: 22,
		y: 3.5
	}, {
		kind: "power",
		x: 16,
		y: 1.8,
		sub: powers[(areaIndex + def.name.length) % powers.length]
	}, {
		kind: "coin",
		x: x - 5,
		y: 2.2
	}, {
		kind: "coin",
		x: x - 3.2,
		y: 2.5
	});
	solids.push(slab(20, 3, 3.55, .4, "block", "glass"));
	return pack(def, areaIndex, solids, spawns, false);
}
function floorLike(x, w, top, kind, style) {
	if (kind === "block" && top <= .04) return floor(x, w, 0);
	return slab(x, w, top, top <= .04 ? 2 : .48, kind, style);
}
function bossArena(def, areaIndex) {
	const level = pack(def, areaIndex, [
		floor(0, 32, 0),
		slab(-1, 1.2, 4.5, 9, "block", "road"),
		slab(31.2, 1.2, 4.5, 9, "block", "road"),
		slab(9, 3.4, 2.15, .42, "block", "roof"),
		slab(19.5, 3.4, 2.35, .42, "block", def.landmarkKind === "glass" ? "glass" : "sand")
	], [{
		kind: "power",
		x: 5.5,
		y: 1.55,
		sub: areaIndex % 2 === 0 ? "shield" : "star"
	}], true);
	level.bossTriggerX = 4;
	return level;
}
function buildLevel(cityId, areaIndex) {
	const def = cityById(cityId);
	const idx = Math.max(0, Math.min(def.areas.length - 1, areaIndex));
	if (def.id === "gurugram") return gurugram(idx);
	if (def.id === "india") return indiaLevel();
	if (idx === def.areas.length - 1) return bossArena(def, idx);
	return generated(def, idx);
}
var KEY = "desidiya-light-up-india-v1";
function defaultQuality() {
	if (typeof navigator === "undefined") return "medium";
	const cores = navigator.hardwareConcurrency || 4;
	const touch = navigator.maxTouchPoints > 0;
	const narrow = typeof window !== "undefined" && window.innerWidth < 900;
	if ((touch || narrow) && cores <= 6) return "low";
	if (touch || narrow) return "medium";
	return "high";
}
function emptyProgress(areas) {
	return {
		areas: Array.from({ length: areas }, () => false),
		illum: Array.from({ length: areas }, () => 0),
		best: Array.from({ length: areas }, () => 0),
		bestTime: Array.from({ length: areas }, () => 0),
		noDamage: Array.from({ length: areas }, () => false)
	};
}
function defaultSave() {
	return {
		version: 1,
		seenIntro: false,
		unlocked: 0,
		weapon: 1,
		coins: 0,
		cities: {},
		settings: {
			quality: defaultQuality(),
			music: .7,
			sfx: .85,
			muted: false
		},
		indiaLit: false
	};
}
function loadSave() {
	if (typeof localStorage === "undefined") return defaultSave();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return defaultSave();
		const parsed = JSON.parse(raw);
		if (parsed.version !== 1) return defaultSave();
		const base = defaultSave();
		return {
			...base,
			...parsed,
			settings: {
				...base.settings,
				...parsed.settings
			},
			cities: parsed.cities ?? {}
		};
	} catch {
		return defaultSave();
	}
}
function writeSave(data) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(data));
}
var WEAPONS = [
	{
		id: 1,
		name: "Basic Light Blaster",
		short: "Blaster"
	},
	{
		id: 2,
		name: "Double Light Shot",
		short: "Double"
	},
	{
		id: 3,
		name: "Mega Light Beam",
		short: "Beam"
	},
	{
		id: 4,
		name: "Fireball of Light",
		short: "Fireball"
	},
	{
		id: 5,
		name: "Super Diya Blast",
		short: "Diya Blast"
	}
];
var PLAYER_NAME = "Goranksh";
var SLOGAN = "DesiDiya — Naye Bharat ki Roshani";
function progressOf(save, cityId) {
	const city = cityById(cityId);
	const got = save.cities[cityId];
	if (!got || got.areas.length !== city.areas.length) return emptyProgress(city.areas.length);
	return got;
}
function cityIllum(save, cityId) {
	const p = progressOf(save, cityId);
	if (!p.illum.length) return 0;
	return Math.round(p.illum.reduce((a, b) => a + b, 0) / p.illum.length);
}
function nextMission(save) {
	const city = cityByIndex(save.unlocked);
	const open = progressOf(save, city.id).areas.findIndex((done) => !done);
	return {
		city,
		area: open < 0 ? 0 : open
	};
}
function areaOpen(save, cityIndex, cityId, areaIndex) {
	if (cityIndex > save.unlocked) return false;
	if (areaIndex === 0) return true;
	return progressOf(save, cityId).areas[areaIndex - 1] === true;
}
function GameView() {
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	const saveRef = (0, import_react.useRef)(defaultSave());
	const [save, setSave] = (0, import_react.useState)(defaultSave());
	const [screen, setScreen] = (0, import_react.useState)("boot");
	const [hud, setHud] = (0, import_react.useState)(null);
	const [region, setRegion] = (0, import_react.useState)("north");
	const [cityId, setCityId] = (0, import_react.useState)("gurugram");
	const [result, setResult] = (0, import_react.useState)(null);
	const [bossName, setBossName] = (0, import_react.useState)(null);
	const [settings, setSettings] = (0, import_react.useState)(false);
	const [confirmReset, setConfirmReset] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [coarse, setCoarse] = (0, import_react.useState)(false);
	const [portrait, setPortrait] = (0, import_react.useState)(false);
	const [helpFrom, setHelpFrom] = (0, import_react.useState)("menu");
	const [helpDevice, setHelpDevice] = (0, import_react.useState)("pc");
	(0, import_react.useEffect)(() => {
		saveRef.current = save;
	}, [save]);
	(0, import_react.useEffect)(() => {
		const coarseQ = window.matchMedia("(pointer: coarse), (max-width: 860px)");
		const portraitQ = window.matchMedia("(orientation: portrait) and (max-width: 900px)");
		const sync = () => {
			setCoarse(coarseQ.matches);
			setPortrait(portraitQ.matches);
		};
		sync();
		coarseQ.addEventListener("change", sync);
		portraitQ.addEventListener("change", sync);
		return () => {
			coarseQ.removeEventListener("change", sync);
			portraitQ.removeEventListener("change", sync);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const data = loadSave();
		saveRef.current = data;
		setSave(data);
		const canvas = canvasRef.current;
		if (!canvas) return;
		let dead = false;
		let game = null;
		const started = performance.now();
		const onHud = (h) => setHud(h);
		const commit = (next) => {
			saveRef.current = next;
			setSave(next);
			writeSave(next);
		};
		const onEvent = (e) => {
			if (e.type === "pause") {
				game?.setPaused(true);
				setScreen("pause");
			} else if (e.type === "weapon") commit({
				...saveRef.current,
				weapon: e.level
			});
			else if (e.type === "cleared") {
				const prev = saveRef.current;
				const city = cityById(e.payload.cityId);
				const prog = progressOf(prev, city.id);
				const areas = prog.areas.slice();
				const illum = prog.illum.slice();
				const best = prog.best.slice();
				const bestTime = prog.bestTime.slice();
				const noDamage = prog.noDamage.slice();
				areas[e.payload.areaIndex] = true;
				illum[e.payload.areaIndex] = Math.max(illum[e.payload.areaIndex] ?? 0, e.payload.illum);
				best[e.payload.areaIndex] = Math.max(best[e.payload.areaIndex] ?? 0, e.payload.score);
				const priorTime = bestTime[e.payload.areaIndex] ?? 0;
				bestTime[e.payload.areaIndex] = !priorTime || e.payload.time < priorTime ? e.payload.time : priorTime;
				noDamage[e.payload.areaIndex] = Boolean(noDamage[e.payload.areaIndex] || e.payload.noDamage);
				const idx = CITIES.findIndex((c) => c.id === city.id);
				let unlocked = prev.unlocked;
				if (e.payload.cityDone && idx === unlocked && unlocked < CITIES.length - 1) unlocked = idx + 1;
				commit({
					...prev,
					unlocked,
					coins: prev.coins + e.payload.coins,
					indiaLit: prev.indiaLit || e.payload.final,
					cities: {
						...prev.cities,
						[city.id]: {
							areas,
							illum,
							best,
							bestTime,
							noDamage
						}
					}
				});
				setResult({
					...e.payload,
					best: best[e.payload.areaIndex] ?? e.payload.score
				});
				setBossName(null);
				setScreen(e.payload.final ? "final" : e.payload.cityDone ? "citylit" : "clear");
			} else if (e.type === "down") setScreen("down");
			else if (e.type === "boss") setBossName(e.name);
			else if (e.type === "fail") {
				setError(e.message);
				setScreen("error");
			}
		};
		import("./runtime-Bb3gLkj0.mjs").then(({ Game }) => {
			if (dead) return;
			try {
				game = new Game(canvas, data.settings.quality, onEvent, onHud);
				game.setMix(data.settings.music, data.settings.sfx, data.settings.muted);
				gameRef.current = game;
			} catch (err) {
				setError(err instanceof Error ? err.message : "This browser could not start the 3D night.");
				setScreen("error");
				return;
			}
			const wait = Math.max(0, 800 - (performance.now() - started));
			window.setTimeout(() => {
				if (!dead) setScreen("menu");
			}, wait);
		}).catch((err) => {
			setError(err instanceof Error ? err.message : "The game failed to load.");
			setScreen("error");
		});
		return () => {
			dead = true;
			game?.dispose();
			gameRef.current = null;
		};
	}, []);
	const openHelp = (from) => {
		setHelpFrom(from);
		setHelpDevice(coarse ? "phone" : "pc");
		setScreen("help");
	};
	const play = (opts) => {
		setBossName(null);
		setSettings(false);
		setScreen("play");
		gameRef.current?.unlockAudio();
		gameRef.current?.setPaused(false);
		gameRef.current?.startLevel(opts);
	};
	const missionOpts = (id, area) => {
		const city = cityById(id);
		const idx = CITIES.findIndex((c) => c.id === id);
		const prog = progressOf(saveRef.current, id);
		return {
			cityId: id,
			cityName: city.name,
			cityIndex: idx,
			areaIndex: area,
			weapon: saveRef.current.weapon,
			cleared: prog.areas,
			illums: prog.illum
		};
	};
	const updateSettings = (partial) => {
		const next = {
			...saveRef.current,
			settings: {
				...saveRef.current.settings,
				...partial
			}
		};
		saveRef.current = next;
		setSave(next);
		writeSave(next);
		if (partial.quality) gameRef.current?.setQuality(partial.quality);
		gameRef.current?.setMix(next.settings.music, next.settings.sfx, next.settings.muted);
	};
	const hasContinue = save.unlocked > 0 || Object.values(save.cities).some((c) => c.areas.some(Boolean));
	const selected = cityById(cityId);
	const selectedIndex = CITIES.findIndex((c) => c.id === cityId);
	const regionCities = CITIES.filter((c) => c.region === region);
	const weapon = WEAPONS[Math.max(0, Math.min(4, (hud?.weapon ?? save.weapon) - 1))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "shell",
		onPointerDown: () => gameRef.current?.unlockAudio(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stage",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", { ref: canvasRef })
			}),
			portrait && screen === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rotate-note chip",
				children: "Rotate for a wider night run"
			}) : null,
			screen === "boot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-center text-4xl text-cream",
							children: "Light Up India"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "slogan mt-1 text-center",
							children: SLOGAN
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "boot-bar mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted mt-3 text-sm",
							children: "Raising the diya and the cities…"
						})
					]
				})
			}) : null,
			screen === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl",
						children: "The night would not start"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3",
						children: error
					})]
				})
			}) : null,
			screen === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-center text-4xl",
							children: "Light Up India"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "slogan mt-1 text-center",
							children: ["Play as ", PLAYER_NAME]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed",
							children: "Carry the DesiDiya across twenty Indian cities. Touch the street diyas, cross the roofs, and the buildings light up in your wake."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-primary",
									onClick: () => save.seenIntro ? setScreen("regions") : setScreen("intro"),
									children: "Start Game"
								}),
								hasContinue ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-ember",
									onClick: () => {
										const n = nextMission(save);
										play(missionOpts(n.city.id, n.area));
									},
									children: "Continue"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-ghost",
									onClick: () => setScreen("regions"),
									children: "Regions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-ghost",
									onClick: () => openHelp("menu"),
									children: "How to play"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-ghost",
									onClick: () => setSettings(true),
									children: "Settings"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted mt-4 text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-gold underline",
								href: "https://desidiya.com/",
								target: "_blank",
								rel: "noreferrer",
								children: "desidiya.com"
							})
						})
					]
				})
			}) : null,
			screen === "intro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "icon-btn",
							onClick: () => setScreen("menu"),
							"aria-label": "Back",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker mt-4",
							children: "Lightbearer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-4xl",
							children: PLAYER_NAME
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 leading-relaxed",
							children: [
								"Cream kurta, a sharp jacket, and the DesiDiya still burning. The cities have gone dark. As ",
								PLAYER_NAME,
								" crosses each building, its windows wake. Street diyas flare the whole block."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-primary mt-5 w-full",
							onClick: () => {
								const next = {
									...saveRef.current,
									seenIntro: true
								};
								saveRef.current = next;
								setSave(next);
								writeSave(next);
								play(missionOpts("gurugram", 0));
							},
							children: "Take the Diya"
						})
					]
				})
			}) : null,
			screen === "regions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "icon-btn",
							onClick: () => setScreen("menu"),
							"aria-label": "Back",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl",
							children: "Regions"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "list mt-4",
						children: REGIONS.map((item) => {
							const cities = CITIES.filter((c) => c.region === item.id);
							const open = cities.some((c) => CITIES.indexOf(c) <= save.unlocked);
							const lit = Math.round(cities.reduce((sum, c) => sum + cityIllum(save, c.id), 0) / cities.length);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "card",
								disabled: !open,
								onClick: () => {
									setRegion(item.id);
									const first = cities.find((c) => CITIES.indexOf(c) <= save.unlocked) ?? cities[0];
									setCityId(first.id);
									setScreen("cities");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "flex items-center justify-between gap-2",
									children: [item.name, open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-gold",
										children: [lit, "%"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "mt-1 block",
									children: open ? item.line : "Still in darkness"
								})]
							}, item.id);
						})
					})]
				})
			}) : null,
			screen === "cities" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "icon-btn",
								onClick: () => setScreen("regions"),
								"aria-label": "Back",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl",
								children: REGIONS.find((r) => r.id === region)?.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex gap-2 overflow-auto pb-1",
							children: regionCities.map((city) => {
								const open = CITIES.indexOf(city) <= save.unlocked;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: city.id === cityId ? "card on shrink-0" : "card shrink-0",
									onClick: () => setCityId(city.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "flex items-center gap-2",
										children: [open ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), city.name]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: open ? `${cityIllum(save, city.id)}% lit` : "Locked" })]
								}, city.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed",
							children: selected.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "list mt-3",
							children: selected.areas.map((area, i) => {
								const open = areaOpen(save, selectedIndex, selected.id, i);
								const done = progressOf(save, selected.id).areas[i];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "card",
									disabled: !open,
									onClick: () => play(missionOpts(selected.id, i)),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											i + 1,
											". ",
											area.name
										] }), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gold",
											children: done ? "Lit" : "Play"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "mt-1 block",
										children: open ? area.blurb : "Finish the previous street first."
									})]
								}, area.name);
							})
						})
					]
				})
			}) : null,
			screen === "play" || screen === "pause" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: coarse && screen === "play" ? "hud hud-touch" : "hud",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-top",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "chip",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hearts",
									"aria-label": "Lives",
									children: Array.from({ length: hud?.maxHearts ?? 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: i < (hud?.hearts ?? 0) ? "size-4 fill-current" : "dim size-4" }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm",
									children: [
										PLAYER_NAME,
										" · ",
										weapon.short
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-gold",
									children: hud?.score ?? 0
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "chip min-w-40 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs tracking-wide text-gold",
									children: [
										"STREET LIGHT ",
										hud?.illum ?? 0,
										"%"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "meter mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${hud?.illum ?? 0}%` } })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm",
									children: [
										"AREAS ",
										hud?.areasDone ?? 0,
										"/",
										hud?.areasTotal ?? 1
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "muted text-sm",
									children: hud?.areaName
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "icon-btn",
							"aria-label": "Pause",
							onClick: () => {
								gameRef.current?.setPaused(true);
								setScreen("pause");
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-bottom",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chip text-sm",
						children: [
							hud?.power ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gold",
								children: hud.power
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "muted",
								children: selected.name
							}),
							hud?.shield ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-3.5" }),
									" ",
									hud.shield
								]
							}) : null,
							hud?.star ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "ml-2 inline size-3.5 text-gold" }) : null,
							hud?.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-xs",
								children: hud.hint
							}) : null
						]
					}), hud?.boss ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chip min-w-36 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								hud.boss.name,
								" · phase ",
								hud.boss.phase
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "meter mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.max(0, hud.boss.hp / hud.boss.max * 100)}%` } })
						})]
					}) : null]
				})]
			}) : null,
			bossName && screen === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-24 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "chip text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Boss"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: bossName
					})]
				})
			}) : null,
			coarse && screen === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "touch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stick, { on: (x, y) => {
					gameRef.current?.setTouch({
						x,
						y,
						using: true
					});
				} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hold, {
							label: "Run",
							className: "pad",
							onHold: (v) => gameRef.current?.setTouch({
								sprint: v,
								using: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hold, {
							label: "Shoot",
							className: "pad shoot",
							onHold: (v) => gameRef.current?.setTouch({
								shoot: v,
								using: true
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hold, {
							label: "Jump",
							className: "pad jump",
							onHold: (v) => gameRef.current?.setTouch({
								jump: v,
								using: true
							})
						})
					]
				})]
			}) : null,
			screen === "pause" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl",
						children: "Paused"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-primary",
								onClick: () => {
									gameRef.current?.setPaused(false);
									setScreen("play");
								},
								children: "Resume"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-ghost",
								onClick: () => openHelp("pause"),
								children: "How to play"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-ghost",
								onClick: () => setSettings(true),
								children: "Settings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-ghost",
								onClick: () => {
									gameRef.current?.showMenu();
									setScreen("cities");
								},
								children: "City map"
							})
						]
					})]
				})
			}) : null,
			screen === "help" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "icon-btn",
								onClick: () => setScreen(helpFrom),
								"aria-label": "Back",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl",
								children: "How to play"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "kicker mt-2 text-center",
							children: ["Lightbearer ", PLAYER_NAME]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: helpDevice === "pc" ? "btn btn-primary" : "btn btn-ghost",
								onClick: () => setHelpDevice("pc"),
								children: "Computer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: helpDevice === "phone" ? "btn btn-primary" : "btn btn-ghost",
								onClick: () => setHelpDevice("phone"),
								children: "Phone"
							})]
						}),
						helpDevice === "pc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "rules",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "A" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "D" }),
									" or arrow keys move. ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "A" }),
									" is left, ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "D" }),
									" is right."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "Space" }), " jumps. Tap again in the air for a second hop."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "Shift" }),
									" runs. ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "Up" }),
									" aims the diya upward."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Aim with the mouse. Click, ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "F" }),
									", or ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "J" }),
									" shoots light."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "Esc" }), " pauses."] })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "rules",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"The left stick moves ",
									PLAYER_NAME,
									". Push up to aim the diya up, down to fall faster."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Jump hops. Tap again in the air for a second hop." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Run sprints along the roofs." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Shoot fires the diya light at shadows." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pause is the button at the top right. Turn the phone sideways for a wider street." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker mt-4",
							children: "Rules"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "rules rules-num",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"You play as ",
									PLAYER_NAME,
									", carrying the DesiDiya."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"As ",
									PLAYER_NAME,
									" crosses a building, his diya wakes its windows and the fairy lights on that stretch."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Touch the brass street diyas along the way. The light jumps ahead and the block you passed flares on together." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Coins raise the score. Shadows, smoke, and drones cost a heart. A shield soaks one hit." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Reach the far end of the street, on the ground, to finish it. On a boss street the city lights fully when the darkness falls." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Streets you already lit stay lit on the India map." })
							]
						})
					]
				})
			}) : null,
			screen === "clear" && result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, {
					title: `${result.areaName} is lit`,
					result,
					action: "Next street",
					onAction: () => play(missionOpts(result.cityId, result.areaIndex + 1)),
					onMap: () => {
						gameRef.current?.showMenu();
						setScreen("cities");
					}
				})
			}) : null,
			screen === "citylit" && result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, {
					title: `${result.cityName} illuminated`,
					result,
					action: save.unlocked < CITIES.length ? "Next city" : "India map",
					onAction: () => {
						const idx = CITIES.findIndex((c) => c.id === result.cityId);
						const next = CITIES[Math.min(CITIES.length - 1, idx + 1)];
						setCityId(next.id);
						setRegion(next.region);
						play(missionOpts(next.id, 0));
					},
					onMap: () => {
						gameRef.current?.showMenu();
						setCityId(result.cityId);
						setScreen("cities");
					}
				})
			}) : null,
			screen === "final" && result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "kicker mt-3 inline-flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4" }), " India awake"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-2 text-4xl",
							children: [PLAYER_NAME, " lit the night"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3",
							children: "The Darkness Titan falls. Every city keeps its light."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-gold tabular-nums",
							children: ["Score ", result.score]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-primary mt-5 w-full",
							onClick: () => {
								gameRef.current?.showMenu();
								setScreen("menu");
							},
							children: "Back to the terrace"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted mt-4 text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-gold underline",
								href: "https://desidiya.com/",
								target: "_blank",
								rel: "noreferrer",
								children: "desidiya.com"
							})
						})
					]
				})
			}) : null,
			screen === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl",
							children: "The diya went out"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [PLAYER_NAME, " can try this street again. The cities you already lit stay lit."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-primary",
								onClick: () => resultPlayAgain(),
								children: "Retry street"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-ghost",
								onClick: () => {
									gameRef.current?.showMenu();
									setScreen("cities");
								},
								children: "City map"
							})]
						})
					]
				})
			}) : null,
			settings ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "veil z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-2xl inline-flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" }), " Settings"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-ghost",
								onClick: () => {
									setSettings(false);
									setConfirmReset(false);
								},
								children: "Close"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker mt-4",
							children: "Graphics"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid grid-cols-3 gap-2",
							children: [
								"low",
								"medium",
								"high"
							].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: save.settings.quality === q ? "btn btn-primary" : "btn btn-ghost",
								onClick: () => updateSettings({ quality: q }),
								children: q
							}, q))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm",
							children: ["Music", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1 w-full",
								type: "range",
								min: 0,
								max: 1,
								step: .01,
								value: save.settings.music,
								onChange: (e) => updateSettings({ music: Number(e.target.value) })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-sm",
							children: ["Effects", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1 w-full",
								type: "range",
								min: 0,
								max: 1,
								step: .01,
								value: save.settings.sfx,
								onChange: (e) => updateSettings({ sfx: Number(e.target.value) })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-ghost mt-4 w-full",
							onClick: () => updateSettings({ muted: !save.settings.muted }),
							children: save.settings.muted ? "Unmute" : "Mute"
						}),
						confirmReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-ember mt-3 w-full",
							onClick: () => {
								const fresh = defaultSave();
								commitSave(fresh);
								gameRef.current?.setQuality(fresh.settings.quality);
								gameRef.current?.setMix(fresh.settings.music, fresh.settings.sfx, false);
								gameRef.current?.showMenu();
								setConfirmReset(false);
								setSettings(false);
								setScreen("menu");
							},
							children: "Confirm reset"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-ghost mt-3 w-full",
							onClick: () => setConfirmReset(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-2 inline size-4" }), " Reset journey"]
						})
					]
				})
			}) : null
		]
	});
	function resultPlayAgain() {
		const id = result?.cityId ?? cityId;
		const area = result?.areaIndex ?? 0;
		play(missionOpts(id, area));
	}
	function commitSave(next) {
		saveRef.current = next;
		setSave(next);
		writeSave(next);
	}
}
function BrandLogo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className: "brand-logo",
		src: "/desidiya-logo.webp",
		alt: "DesiDiya — Naye Bharat ki Roshani"
	});
}
function ResultCard({ title, result, action, onAction, onMap }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "City light"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-3xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm",
				children: [
					"Illumination ",
					result.illum,
					"% · score ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: result.score
					}),
					result.noDamage ? " · untouched" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "muted text-sm tabular-nums",
				children: [
					"Best ",
					result.best,
					" · ",
					Math.round(result.time),
					"s"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					onClick: onAction,
					children: action
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-ghost",
					onClick: onMap,
					children: "City map"
				})]
			})
		]
	});
}
function Stick({ on }) {
	const ref = (0, import_react.useRef)(null);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const move = (clientX, clientY) => {
		const rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		let x = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
		let y = -((clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
		const mag = Math.hypot(x, y) || 1;
		if (mag > 1) {
			x /= mag;
			y /= mag;
		}
		setKnob({
			x,
			y
		});
		on(x, y);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "stick",
		onPointerDown: (e) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			move(e.clientX, e.clientY);
		},
		onPointerMove: (e) => {
			if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e.clientX, e.clientY);
		},
		onPointerUp: (e) => {
			if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
			setKnob({
				x: 0,
				y: 0
			});
			on(0, 0);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "knob",
			style: { transform: `translate(${knob.x * 28}px, ${-knob.y * 28}px)` }
		})
	});
}
function Hold({ label, className, onHold, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className,
		"aria-label": label,
		onPointerDown: (e) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			onHold(true);
		},
		onPointerUp: () => onHold(false),
		onPointerCancel: () => onHold(false),
		children: children ?? label
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameView, {});
}
//#endregion
export { buildLevel as n, routes_exports as t };
