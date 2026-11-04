import * as THREE from "three";
import type { EnemyKind } from "@/game/types";

export type ActorKind = EnemyKind | "boss" | "titan";

/** Visual scale per actor. Villains read bigger on screen; hitboxes in actorStats grow to match. */
const VIS: Record<ActorKind, number> = {
  shadow: 1.4,
  drone: 1.45,
  smoke: 1.4,
  energy: 1.4,
  guardian: 1.35,
  boss: 1.3,
  titan: 1.25,
};

/** Rim / light colour per villain. */
const RIM: Record<ActorKind, number> = {
  shadow: 0xff2a48,
  drone: 0xff9a2a,
  smoke: 0x9aa0c0,
  energy: 0xff6a2a,
  guardian: 0xff4a24,
  boss: 0xff3a2a,
  titan: 0xff2a80,
};

const cache = new Map<string, THREE.BufferGeometry>();
function g(key: string, build: () => THREE.BufferGeometry) {
  let geo = cache.get(key);
  if (!geo) {
    geo = build();
    cache.set(key, geo);
  }
  return geo;
}

const matCache = new Map<string, THREE.Material>();
function m<T extends THREE.Material>(key: string, build: () => T): T {
  let mat = matCache.get(key) as T | undefined;
  if (!mat) {
    mat = build();
    matCache.set(key, mat);
  }
  return mat;
}

function standard(key: string, color: number, emissive: number, rough = 0.6, ei = 1) {
  return m(key, () => new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: ei, roughness: rough, metalness: 0.15 }));
}
function glowMat(key: string, color: number, opacity = 1) {
  return m(key, () => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false }));
}

let glowTex: THREE.Texture | null = null;
function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.35, "rgba(255,255,255,0.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}
/** Soft additive halo sprite, used for menacing auras and glowing eyes. */
function halo(parent: THREE.Object3D, color: number, size: number, x: number, y: number, z: number, opacity = 0.7, name?: string) {
  const mat = m(`halo-${color}-${opacity}`, () =>
    new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  const s = new THREE.Sprite(mat);
  s.scale.setScalar(size);
  s.position.set(x, y, z);
  if (name) s.name = name;
  parent.add(s);
  return s;
}

export function makeActor(kind: ActorKind): THREE.Group {
  const root = new THREE.Group();
  root.name = kind;
  const body = new THREE.Group();
  body.name = "body";
  body.scale.setScalar(VIS[kind]);
  root.add(body);
  if (kind === "shadow") shadow(body);
  else if (kind === "drone") drone(body);
  else if (kind === "smoke") smoke(body);
  else if (kind === "energy") energy(body);
  else if (kind === "guardian") guardian(body);
  else boss(body, kind === "titan");
  const rim = RIM[kind];
  const outline = m(`rim-${rim}`, () =>
    new THREE.MeshBasicMaterial({ color: rim, side: THREE.BackSide, transparent: true, opacity: 1, toneMapped: false, depthWrite: false }),
  );
  const solids: THREE.Mesh[] = [];
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      const basic = (mesh.material as THREE.Material).type === "MeshBasicMaterial";
      mesh.castShadow = !basic;
      mesh.receiveShadow = !basic;
      if (!basic && !mesh.parent?.name.startsWith("face")) solids.push(mesh);
    }
  });
  // Glowing rim outline: back-face shell slightly larger than each body part (cheap, no real lights).
  for (const mesh of solids) {
    const shell = new THREE.Mesh(mesh.geometry, outline);
    shell.scale.setScalar(kind === "boss" || kind === "titan" ? 1.05 : 1.1);
    shell.castShadow = false;
    shell.renderOrder = -1;
    mesh.add(shell);
  }
  // Light pool on the ground so villains look like they emit light.
  const pool = new THREE.Mesh(
    g("pool", () => new THREE.CircleGeometry(0.9, 24)),
    m(`pool-${rim}`, () =>
      new THREE.MeshBasicMaterial({ map: glowTexture(), color: rim, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    ),
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = kind === "drone" ? 0.03 : 0.04;
  pool.scale.setScalar(VIS[kind] * (kind === "boss" || kind === "titan" ? 2.6 : 1.2));
  pool.name = "pool";
  root.add(pool);
  return root;
}

export function actorStats(kind: ActorKind) {
  // Hitboxes grow with the bigger art (height fully, width a bit less so lanes stay fair).
  const v = VIS[kind];
  const wv = 1 + (v - 1) * 0.6;
  const base = (() => {
    switch (kind) {
      case "shadow":
        return { hp: 2, w: 0.7, h: 1.5, fly: false };
      case "drone":
        return { hp: 2, w: 0.8, h: 0.7, fly: true };
      case "smoke":
        return { hp: 4, w: 0.9, h: 1.6, fly: false };
      case "energy":
        return { hp: 3, w: 0.75, h: 1.45, fly: false };
      case "guardian":
        return { hp: 6, w: 1, h: 1.9, fly: false };
      case "boss":
        return { hp: 36, w: 2.4, h: 3.3, fly: false };
      case "titan":
        return { hp: 72, w: 3.4, h: 4.6, fly: false };
    }
  })();
  return { ...base, w: base.w * wv, h: base.h * v };
}

export function animateActor(root: THREE.Group, time: number, kind: ActorKind) {
  const body = (root.getObjectByName("body") as THREE.Group) ?? root;
  const s = Math.sin(time * (kind === "drone" ? 6 : 3));
  const pulse = 0.75 + Math.sin(time * 5 + root.id) * 0.25;
  const cape = body.getObjectByName("cape");
  if (cape) cape.rotation.x = 0.1 + Math.sin(time * 2.2 + root.id) * 0.06;
  const aura = body.getObjectByName("aura");
  if (aura) aura.scale.setScalar((aura.userData.base ?? (aura.userData.base = aura.scale.x)) * (0.9 + pulse * 0.2));
  if (kind === "drone") {
    const hub = body.getObjectByName("hub");
    if (hub) hub.rotation.y = time * 1.4;
    const ring = body.getObjectByName("ring");
    if (ring) ring.rotation.z = time * 3;
    root.rotation.z = Math.sin(time * 5) * 0.08;
  } else if (kind === "smoke") {
    body.rotation.y = Math.sin(time * 0.8) * 0.2;
    body.scale.y = VIS.smoke * (1 + Math.sin(time * 2) * 0.06);
    body.children.forEach((c, i) => {
      if (c.name === "puff") c.position.x = Math.sin(time * 1.6 + i) * 0.06;
    });
  } else if (kind === "boss" || kind === "titan") {
    body.rotation.y = Math.sin(time * 0.7) * 0.12;
    const arm = body.getObjectByName("armL");
    const armR = body.getObjectByName("armR");
    if (arm) arm.rotation.z = -(0.2 + s * 0.15);
    if (armR) armR.rotation.z = 0.2 + s * 0.15;
    const core = body.getObjectByName("core");
    if (core) {
      core.rotation.y = time * 2;
      core.scale.setScalar(0.9 + pulse * 0.25);
    }
  } else if (kind === "energy") {
    const top = body.getObjectByName("orbit");
    if (top) top.rotation.y = time * 2.5;
    body.position.y = Math.sin(time * 3) * 0.04;
  } else {
    root.rotation.z = s * 0.02;
    body.position.y = Math.abs(Math.sin(time * 6)) * 0.03;
  }
}

function add(parent: THREE.Object3D, mesh: THREE.Mesh, x = 0, y = 0, z = 0) {
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}


/** Menacing face: glowing slanted eyes with pupils, angry brows, and a glowing mouth with fangs. */
function face(parent: THREE.Object3D, eyeColor: number, y: number, z: number, k = 1) {
  const fg = new THREE.Group();
  fg.name = "face";
  fg.position.set(0, y, z);
  fg.scale.setScalar(k);
  parent.add(fg);
  const eye = glowMat(`eye-${eyeColor}`, eyeColor);
  const pupil = glowMat("pupil", 0x120404);
  const brow = glowMat("brow", 0x0a0306);
  const mouth = glowMat("mouth", 0x2a0404);
  const fang = glowMat("fang", 0xfff2dc);
  const lip = glowMat(`lip-${eyeColor}`, eyeColor);
  for (const sx of [-1, 1]) {
    const e = add(fg, new THREE.Mesh(g("f-eye", () => new THREE.SphereGeometry(0.05, 10, 8)), eye), 0.075 * sx, 0, 0);
    e.scale.set(1.3, 0.75, 0.6);
    e.rotation.z = 0.35 * sx;
    add(fg, new THREE.Mesh(g("f-pupil", () => new THREE.SphereGeometry(0.018, 6, 6)), pupil), 0.07 * sx, -0.004, 0.03).scale.set(0.6, 1.4, 0.6);
    const b = add(fg, new THREE.Mesh(g("f-brow", () => new THREE.BoxGeometry(0.11, 0.025, 0.03)), brow), 0.075 * sx, 0.055, 0.02);
    b.rotation.z = 0.5 * sx;
    halo(fg, eyeColor, 0.32, 0.075 * sx, 0, 0.03, 0.85);
  }
  const mo = add(fg, new THREE.Mesh(g("f-mouth", () => new THREE.BoxGeometry(0.15, 0.05, 0.02)), mouth), 0, -0.1, 0);
  mo.rotation.z = 0;
  add(fg, new THREE.Mesh(g("f-lip", () => new THREE.BoxGeometry(0.16, 0.008, 0.022)), lip), 0, -0.077, 0.002);
  add(fg, new THREE.Mesh(g("f-lip", () => new THREE.BoxGeometry(0.16, 0.008, 0.022)), lip), 0, -0.123, 0.002);
  for (const x of [-0.05, -0.017, 0.017, 0.05]) {
    const t = add(fg, new THREE.Mesh(g("f-fang", () => new THREE.ConeGeometry(0.011, 0.03, 4)), fang), x, -0.088, 0.014);
    t.rotation.z = Math.PI;
  }
  for (const x of [-0.033, 0.033]) add(fg, new THREE.Mesh(g("f-fang", () => new THREE.ConeGeometry(0.011, 0.03, 4)), fang), x, -0.112, 0.014);
  return fg;
}

function shadow(root: THREE.Group) {
  darkLord(root, 1, false, false);
}

function drone(root: THREE.Group) {
  const shell = standard("dr-shell", 0x2a1c24, 0x6a2010, 0.3, 0.7);
  const trim = standard("dr-trim", 0xb08030, 0x3a2008, 0.25, 0.5);
  const hub = new THREE.Group();
  hub.name = "hub";
  root.add(hub);
  halo(root, 0xff8a2a, 1.6, 0, 0.9, -0.15, 0.6, "aura");
  add(hub, new THREE.Mesh(g("oct", () => new THREE.OctahedronGeometry(0.3)), shell), 0, 0.9, 0);
  add(hub, new THREE.Mesh(g("wing", () => new THREE.BoxGeometry(0.85, 0.04, 0.2)), trim), 0, 0.95, 0);
  add(hub, new THREE.Mesh(g("wing2", () => new THREE.BoxGeometry(0.2, 0.04, 0.85)), trim), 0, 0.95, 0);
  for (const [x, z] of [[0.42, 0], [-0.42, 0], [0, 0.42], [0, -0.42]] as const) {
    add(hub, new THREE.Mesh(g("rotor", () => new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12)), glowMat("rotor", 0xffc46a, 0.45)), x, 0.99, z);
  }
  const ring = add(root, new THREE.Mesh(g("dr-ring", () => new THREE.TorusGeometry(0.2, 0.025, 6, 16)), glowMat("dr-ring", 0xff6a2a)), 0, 0.9, 0.22);
  ring.name = "ring";
  add(root, new THREE.Mesh(g("dr-eye", () => new THREE.SphereGeometry(0.09, 10, 8)), glowMat("dr-eye", 0xffb03a)), 0, 0.9, 0.2);
  halo(root, 0xffb03a, 0.7, 0, 0.9, 0.25, 0.9);
  const dBrow = add(root, new THREE.Mesh(g("dr-brow", () => new THREE.BoxGeometry(0.26, 0.04, 0.04)), glowMat("brow", 0x0a0306)), 0, 1.03, 0.24);
  dBrow.rotation.z = 0.0;
  const face2 = face(root, 0xffb03a, 0.86, 0.27, 0.9);
  face2.children.filter((c) => c.position.y >= -0.01).forEach((c) => (c.visible = false));
}

function smoke(root: THREE.Group) {
  const puff = standard("sm-puff", 0x34343a, 0x1a1210, 0.95, 0.5);
  const dark = standard("sm-dark", 0x1e1e24, 0x120808, 0.95, 0.5);
  halo(root, 0x6a6a7a, 2.4, 0, 0.9, -0.3, 0.5, "aura");
  const puffs: [number, number, number, number, THREE.Material][] = [
    [0.34, 0, 0.42, 0, puff],
    [0.24, 0.25, 0.55, -0.05, dark],
    [0.24, -0.25, 0.5, -0.05, dark],
    [0.28, 0.06, 0.9, 0, puff],
    [0.2, -0.05, 1.25, 0, puff],
    [0.13, 0.1, 1.5, -0.02, dark],
  ];
  puffs.forEach(([r, x, y, z, mat], i) => {
    const mesh = add(root, new THREE.Mesh(g(`p-${r}`, () => new THREE.SphereGeometry(r, 12, 10)), mat), x, y, z);
    mesh.name = i === 0 ? "base" : "puff";
  });
  face(root, 0xe7b04a, 0.97, 0.3, 1.2);
}

function energy(root: THREE.Group) {
  const crystal = standard("en-crystal", 0x3a2418, 0xe25a24, 0.2, 0.9);
  const dark = standard("en-dark", 0x1a1010, 0x3a1008, 0.4, 0.6);
  halo(root, 0xff5a24, 2.0, 0, 0.9, -0.1, 0.6, "aura");
  add(root, new THREE.Mesh(g("ico", () => new THREE.IcosahedronGeometry(0.34, 0)), crystal), 0, 0.88, 0);
  add(root, new THREE.Mesh(g("ico2", () => new THREE.OctahedronGeometry(0.17)), crystal), 0, 1.38, 0);
  const orbit = new THREE.Group();
  orbit.name = "orbit";
  orbit.position.y = 0.88;
  root.add(orbit);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    add(orbit, new THREE.Mesh(g("shard", () => new THREE.TetrahedronGeometry(0.08)), glowMat("shard", 0xffc46a)), Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5);
  }
  add(root, new THREE.Mesh(g("legc", () => new THREE.BoxGeometry(0.09, 0.45, 0.09)), dark), -0.12, 0.3, 0);
  add(root, new THREE.Mesh(g("legc", () => new THREE.BoxGeometry(0.09, 0.45, 0.09)), dark), 0.12, 0.3, 0);
  face(root, 0xfff0b0, 0.92, 0.3, 1.1);
}

function guardian(root: THREE.Group) {
  const plate = standard("gu-plate", 0x241a12, 0x3a2010, 0.4, 0.6);
  const gold = standard("gu-gold", 0x8a6020, 0x4a2a08, 0.3, 0.5);
  halo(root, 0xe25a24, 2.6, 0, 1.1, -0.3, 0.55, "aura");
  add(root, new THREE.Mesh(g("gbody", () => new THREE.BoxGeometry(0.72, 0.9, 0.42)), plate), 0, 0.98, 0);
  add(root, new THREE.Mesh(g("gbelt", () => new THREE.BoxGeometry(0.76, 0.1, 0.46)), gold), 0, 0.6, 0);
  add(root, new THREE.Mesh(g("gpad", () => new THREE.SphereGeometry(0.2, 10, 8)), gold), -0.42, 1.38, 0);
  add(root, new THREE.Mesh(g("gpad", () => new THREE.SphereGeometry(0.2, 10, 8)), gold), 0.42, 1.38, 0);
  add(root, new THREE.Mesh(g("ghead", () => new THREE.BoxGeometry(0.38, 0.34, 0.34)), plate), 0, 1.6, 0);
  const crest = add(root, new THREE.Mesh(g("gcrest", () => new THREE.ConeGeometry(0.08, 0.3, 4)), gold), 0, 1.9, 0);
  crest.rotation.y = Math.PI / 4;
  add(root, new THREE.Mesh(g("glegs", () => new THREE.BoxGeometry(0.18, 0.55, 0.22)), plate), -0.17, 0.27, 0);
  add(root, new THREE.Mesh(g("glegs", () => new THREE.BoxGeometry(0.18, 0.55, 0.22)), plate), 0.17, 0.27, 0);
  const shield = add(root, new THREE.Mesh(g("shield", () => new THREE.CylinderGeometry(0.34, 0.34, 0.08, 14)), gold), -0.52, 1.0, 0.15);
  shield.rotation.x = Math.PI / 2;
  shield.rotation.z = 0.15;
  add(root, new THREE.Mesh(g("shield-gem", () => new THREE.OctahedronGeometry(0.08)), glowMat("gu-gem", 0xff4a24)), -0.52, 1.0, 0.22);
  // visor slit
  face(root, 0xff5a24, 1.63, 0.18, 1.05);
}


function boss(root: THREE.Group, titan: boolean) {
  // Bosses are the same dark lord, scaled up to their hitbox height with extra armour.
  darkLord(root, titan ? 3.05 : 2.2, true, titan);
}

const bx = new Map<string, THREE.BoxGeometry>();
function B(w: number, h: number, d: number) {
  const k = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}`;
  let geo = bx.get(k);
  if (!geo) {
    geo = new THREE.BoxGeometry(w, h, d);
    bx.set(k, geo);
  }
  return geo;
}

/**
 * Blocky chibi "dark lord" matching the villain reference: spiky black hair, goatee,
 * angry brows, glowing red eyes, maroon armoured coat with red glowing trim,
 * high collar and a big dark-red cape, glowing chest emblem, dark boots.
 */
function darkLord(root: THREE.Group, k: number, isBoss: boolean, titan: boolean) {
  const skin = standard("dl-skin", 0xd8a07c, 0x4a2014, 0.65, 0.4);
  const hair = standard("dl-hair", 0x0e0a0e, 0x000000, 0.5, 0);
  const coat = standard("dl-coat", 0x55182a, 0x1a0408, 0.6, 0.6);
  const coat2 = standard("dl-coat2", 0x2e0e18, 0x0c0206, 0.55, 0.5);
  const capeM = standard("dl-cape", 0x6a1020, 0x1a0206, 0.75, 0.6);
  const lining = standard("dl-lining", 0x8a1422, 0x2a0408, 0.7, 0.6);
  const bootM = standard("dl-boot", 0x120c10, 0x000000, 0.5, 0);
  const metal = standard("dl-metal", 0x3a2a30, 0x100408, 0.35, 0.5);
  const goldM = standard("bs-gold", 0x9a7020, 0x4a2a08, 0.3, 0.6);
  const glow = glowMat("dl-glow", 0xff2a2a);
  const glowHot = glowMat("dl-glow-hot", 0xff6a3a);
  const g = new THREE.Group();
  g.scale.setScalar(k);
  root.add(g);
  halo(root, titan ? 0xb01a60 : 0xd01a2a, (isBoss ? 2.6 : 2.3) * k, 0, 0.85 * k, -0.4 * k, 0.6, "aura");

  // Legs + boots
  for (const sx of [-1, 1]) {
    add(g, new THREE.Mesh(B(0.15, 0.34, 0.16), coat2), 0.1 * sx, 0.27, 0);
    add(g, new THREE.Mesh(B(0.17, 0.16, 0.24), bootM), 0.1 * sx, 0.08, 0.03);
    add(g, new THREE.Mesh(B(0.175, 0.03, 0.25), glow), 0.1 * sx, 0.165, 0.03);
  }
  // Long coat skirt (split front) with glowing trim
  add(g, new THREE.Mesh(B(0.46, 0.34, 0.22), coat), 0, 0.5, -0.03);
  add(g, new THREE.Mesh(B(0.19, 0.3, 0.04), coat), -0.13, 0.48, 0.1).rotation.z = 0.08;
  add(g, new THREE.Mesh(B(0.19, 0.3, 0.04), coat), 0.13, 0.48, 0.1).rotation.z = -0.08;
  add(g, new THREE.Mesh(B(0.02, 0.3, 0.01), glow), -0.04, 0.48, 0.125);
  add(g, new THREE.Mesh(B(0.02, 0.3, 0.01), glow), 0.04, 0.48, 0.125);
  add(g, new THREE.Mesh(B(0.47, 0.025, 0.25), glow), 0, 0.335, -0.02);
  // Torso armour
  add(g, new THREE.Mesh(B(0.44, 0.42, 0.26), coat2), 0, 0.85, 0);
  add(g, new THREE.Mesh(B(0.3, 0.3, 0.02), coat), 0, 0.87, 0.135);
  add(g, new THREE.Mesh(B(0.46, 0.05, 0.28), metal), 0, 0.65, 0);
  add(g, new THREE.Mesh(B(0.02, 0.4, 0.01), glow), -0.16, 0.85, 0.135);
  add(g, new THREE.Mesh(B(0.02, 0.4, 0.01), glow), 0.16, 0.85, 0.135);
  // Glowing chest emblem
  const emb = add(g, new THREE.Mesh(B(0.11, 0.11, 0.02), glow), 0, 0.88, 0.15);
  emb.rotation.z = Math.PI / 4;
  const embIn = add(g, new THREE.Mesh(B(0.05, 0.05, 0.02), glowHot), 0, 0.88, 0.16);
  embIn.rotation.z = Math.PI / 4;
  halo(g, 0xff2a2a, 0.5, 0, 0.88, 0.2, 0.9);
  if (isBoss) {
    const gem = add(g, new THREE.Mesh(g2("core-oct", () => new THREE.OctahedronGeometry(0.07)), glowMat("bs-core", 0xffb03a)), 0, 0.88, 0.2);
    gem.name = "core";
  }
  // Shoulder pauldrons
  for (const sx of [-1, 1]) {
    add(g, new THREE.Mesh(B(0.17, 0.1, 0.3), metal), 0.29 * sx, 1.04, 0);
    add(g, new THREE.Mesh(B(0.18, 0.02, 0.31), glow), 0.29 * sx, 0.99, 0);
    if (isBoss) {
      const sp = add(g, new THREE.Mesh(g2("spike", () => new THREE.ConeGeometry(0.035, 0.14, 4)), goldM), 0.32 * sx, 1.14, 0);
      sp.rotation.z = -0.4 * sx;
    }
  }
  // Arms (pivot at shoulder so bosses can raise them)
  for (const sx of [-1, 1]) {
    const arm = new THREE.Group();
    arm.name = sx < 0 ? "armL" : "armR";
    arm.position.set(0.29 * sx, 1.0, 0);
    arm.rotation.z = 0.12 * sx * -1;
    g.add(arm);
    add(arm, new THREE.Mesh(B(0.13, 0.26, 0.14), coat2), 0, -0.15, 0);
    add(arm, new THREE.Mesh(B(0.12, 0.2, 0.13), coat), 0, -0.36, 0);
    add(arm, new THREE.Mesh(B(0.135, 0.025, 0.145), glow), 0, -0.44, 0);
    add(arm, new THREE.Mesh(B(0.1, 0.09, 0.1), skin), 0, -0.51, 0);
  }
  // Cape + high collar
  const cape = new THREE.Group();
  cape.name = "cape";
  cape.position.set(0, 1.07, -0.15);
  g.add(cape);
  add(cape, new THREE.Mesh(B(0.74, 0.7, 0.03), capeM), 0, -0.35, 0);
  add(cape, new THREE.Mesh(B(0.7, 0.66, 0.01), lining), 0, -0.35, 0.02);
  const hem = add(cape, new THREE.Mesh(B(0.9, 0.4, 0.03), capeM), 0, -0.86, -0.07);
  hem.rotation.x = 0.22;
  for (const sx of [-1, 1]) {
    const side = add(cape, new THREE.Mesh(B(0.03, 0.95, 0.3), capeM), 0.4 * sx, -0.5, 0.1);
    side.rotation.z = 0.16 * sx;
  }
  for (const sx of [-1, 1]) {
    const col = add(g, new THREE.Mesh(B(0.06, 0.4, 0.24), capeM), 0.25 * sx, 1.24, -0.04);
    col.rotation.z = -0.38 * sx;
    const colIn = add(g, new THREE.Mesh(B(0.015, 0.38, 0.22), lining), 0.215 * sx, 1.24, -0.03);
    colIn.rotation.z = -0.38 * sx;
  }
  add(g, new THREE.Mesh(B(0.38, 0.22, 0.04), capeM), 0, 1.2, -0.17);

  // Head
  const hy = 1.26;
  add(g, new THREE.Mesh(B(0.36, 0.36, 0.34), skin), 0, hy, 0);
  add(g, new THREE.Mesh(B(0.05, 0.08, 0.06), skin), -0.2, hy, 0);
  add(g, new THREE.Mesh(B(0.05, 0.08, 0.06), skin), 0.2, hy, 0);
  // Spiky hair
  add(g, new THREE.Mesh(B(0.38, 0.1, 0.36), hair), 0, hy + 0.2, -0.005);
  add(g, new THREE.Mesh(B(0.38, 0.26, 0.08), hair), 0, hy + 0.06, -0.15);
  add(g, new THREE.Mesh(B(0.05, 0.16, 0.32), hair), -0.18, hy + 0.1, -0.01);
  add(g, new THREE.Mesh(B(0.05, 0.16, 0.32), hair), 0.18, hy + 0.1, -0.01);
  const spikes: [number, number, number, number][] = [
    [-0.15, 0.08, 0.7, 0.16], [-0.06, 0.1, 0.25, 0.2], [0.05, 0.1, -0.2, 0.22], [0.15, 0.06, -0.7, 0.16],
    [-0.12, -0.08, 0.5, 0.18], [0.0, -0.06, 0.05, 0.24], [0.12, -0.1, -0.5, 0.18], [-0.19, 0.0, 1.1, 0.12], [0.19, 0.0, -1.1, 0.12],
  ];
  for (const [x, z, r, h] of spikes) {
    const sp = add(g, new THREE.Mesh(B(0.1, h * 1.3, 0.1), hair), x, hy + 0.24 + h * 0.4, z);
    sp.rotation.z = r;
    sp.rotation.x = z < 0 ? -0.35 : 0.2;
  }
  // fringe spikes over forehead
  for (const x of [-0.1, 0, 0.1]) {
    const f = add(g, new THREE.Mesh(B(0.08, 0.09, 0.05), hair), x, hy + 0.13, 0.16);
    f.rotation.z = x * 3;
  }
  if (isBoss) {
    for (const sx of [-1, 1]) {
      const horn = add(g, new THREE.Mesh(g2("horn", () => new THREE.ConeGeometry(0.04, 0.22, 4)), goldM), 0.14 * sx, hy + 0.36, 0.02);
      horn.rotation.z = -0.45 * sx;
    }
  }
  if (titan) {
    for (const sx of [-1, 1]) {
      const wing = add(g, new THREE.Mesh(B(0.5, 0.7, 0.02), capeM), 0.42 * sx, 1.05, -0.2);
      wing.rotation.z = -0.5 * sx;
      wing.rotation.y = 0.3 * sx;
    }
  }
  // Face
  const face = new THREE.Group();
  face.name = "face";
  face.position.set(0, hy, 0.171);
  g.add(face);
  const brow = glowMat("brow", 0x0a0306);
  const eye = glowMat("dl-eye", 0xff2a1a);
  const mouth = glowMat("mouth", 0x2a0404);
  const tooth = glowMat("fang", 0xfff2dc);
  for (const sx of [-1, 1]) {
    const e = add(face, new THREE.Mesh(B(0.07, 0.035, 0.01), eye), 0.075 * sx, 0.02, 0.002);
    e.rotation.z = 0.25 * sx;
    halo(face, 0xff2a1a, 0.22, 0.075 * sx, 0.02, 0.02, 0.9);
    const b = add(face, new THREE.Mesh(B(0.11, 0.035, 0.02), brow), 0.075 * sx, 0.075, 0.006);
    b.rotation.z = 0.42 * sx;
  }
  // nose
  add(g, new THREE.Mesh(B(0.04, 0.05, 0.03), skin), 0, hy - 0.04, 0.18);
  // mustache + goatee
  add(face, new THREE.Mesh(B(0.16, 0.03, 0.02), hair), 0, -0.075, 0.006);
  add(face, new THREE.Mesh(B(0.03, 0.06, 0.02), hair), -0.075, -0.1, 0.006);
  add(face, new THREE.Mesh(B(0.03, 0.06, 0.02), hair), 0.075, -0.1, 0.006);
  add(face, new THREE.Mesh(B(0.1, 0.02, 0.01), mouth), 0, -0.105, 0.003);
  add(face, new THREE.Mesh(B(0.08, 0.008, 0.012), tooth), 0, -0.1, 0.006);
  add(face, new THREE.Mesh(B(0.09, 0.09, 0.03), hair), 0, -0.165, 0.0);
  add(face, new THREE.Mesh(B(0.05, 0.05, 0.03), hair), 0, -0.225, 0.0);
}

function g2(key: string, build: () => THREE.BufferGeometry) {
  return g(key, build);
}
