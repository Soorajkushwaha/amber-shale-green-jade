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
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      const basic = (mesh.material as THREE.Material).type === "MeshBasicMaterial";
      mesh.castShadow = !basic;
      mesh.receiveShadow = !basic;
    }
  });
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
    if (arm) arm.rotation.z = 0.4 + s * 0.3;
    if (armR) armR.rotation.z = -0.4 - s * 0.3;
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
    root.rotation.z = s * 0.04;
    body.position.y = Math.abs(Math.sin(time * 6)) * 0.03;
  }
}

function add(parent: THREE.Object3D, mesh: THREE.Mesh, x = 0, y = 0, z = 0) {
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function eyes(parent: THREE.Object3D, color: number, y: number, z: number, dx: number, r: number) {
  const eye = glowMat(`eye-${color}`, color);
  const geo = g(`eye-${r}`, () => new THREE.SphereGeometry(r, 8, 6));
  add(parent, new THREE.Mesh(geo, eye), -dx, y, z);
  add(parent, new THREE.Mesh(geo, eye), dx, y, z);
  halo(parent, color, r * 9, -dx, y, z + 0.02, 0.8);
  halo(parent, color, r * 9, dx, y, z + 0.02, 0.8);
}

function shadow(root: THREE.Group) {
  const body = standard("sh-body", 0x1a1020, 0x4a1030, 0.7, 0.8);
  const cloak = standard("sh-cloak", 0x120a18, 0x2a0820, 0.9, 0.6);
  halo(root, 0x8a1fb0, 2.2, 0, 0.95, -0.2, 0.35, "aura");
  // Tattered cloak cone
  add(root, new THREE.Mesh(g("sh-cloak", () => new THREE.ConeGeometry(0.42, 1.1, 9, 1, true)), cloak), 0, 0.55, 0);
  add(root, new THREE.Mesh(g("sh-body", () => new THREE.CapsuleGeometry(0.22, 0.7, 4, 8)), body), 0, 0.95, 0);
  add(root, new THREE.Mesh(g("sh-head", () => new THREE.SphereGeometry(0.2, 12, 10)), body), 0, 1.45, 0.03);
  // Hood
  const hood = add(root, new THREE.Mesh(g("sh-hood", () => new THREE.ConeGeometry(0.26, 0.45, 8)), cloak), 0, 1.62, -0.03);
  hood.rotation.x = -0.25;
  // Claws / arms
  const armL = add(root, new THREE.Mesh(g("sh-arm", () => new THREE.CapsuleGeometry(0.06, 0.6, 3, 6)), body), -0.3, 0.95, 0.05);
  armL.rotation.z = 0.7;
  const armR = armL.clone();
  armR.position.x = 0.3;
  armR.rotation.z = -0.7;
  root.add(armR);
  const claw = glowMat("claw", 0xff4a3a);
  add(root, new THREE.Mesh(g("sh-claw", () => new THREE.ConeGeometry(0.06, 0.16, 5)), claw), -0.52, 0.72, 0.05).rotation.z = Math.PI;
  add(root, new THREE.Mesh(g("sh-claw", () => new THREE.ConeGeometry(0.06, 0.16, 5)), claw), 0.52, 0.72, 0.05).rotation.z = Math.PI;
  eyes(root, 0xff5a24, 1.48, 0.17, 0.075, 0.04);
}

function drone(root: THREE.Group) {
  const shell = standard("dr-shell", 0x2a1c24, 0x6a2010, 0.3, 0.7);
  const trim = standard("dr-trim", 0xb08030, 0x3a2008, 0.25, 0.5);
  const hub = new THREE.Group();
  hub.name = "hub";
  root.add(hub);
  halo(root, 0xff8a2a, 1.6, 0, 0.9, -0.15, 0.35, "aura");
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
}

function smoke(root: THREE.Group) {
  const puff = standard("sm-puff", 0x34343a, 0x1a1210, 0.95, 0.5);
  const dark = standard("sm-dark", 0x1e1e24, 0x120808, 0.95, 0.5);
  halo(root, 0x6a6a7a, 2.4, 0, 0.9, -0.3, 0.25, "aura");
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
  eyes(root, 0xe7b04a, 0.97, 0.24, 0.09, 0.045);
  // Jagged grin
  add(root, new THREE.Mesh(g("sm-mouth", () => new THREE.BoxGeometry(0.18, 0.03, 0.02)), glowMat("sm-mouth", 0xff6a2a)), 0, 0.84, 0.27);
}

function energy(root: THREE.Group) {
  const crystal = standard("en-crystal", 0x3a2418, 0xe25a24, 0.2, 0.9);
  const dark = standard("en-dark", 0x1a1010, 0x3a1008, 0.4, 0.6);
  halo(root, 0xff5a24, 2.0, 0, 0.9, -0.1, 0.4, "aura");
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
  eyes(root, 0xfff0b0, 0.95, 0.3, 0.09, 0.035);
}

function guardian(root: THREE.Group) {
  const plate = standard("gu-plate", 0x241a12, 0x3a2010, 0.4, 0.6);
  const gold = standard("gu-gold", 0x8a6020, 0x4a2a08, 0.3, 0.5);
  halo(root, 0xe25a24, 2.6, 0, 1.1, -0.3, 0.3, "aura");
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
  add(root, new THREE.Mesh(g("gvisor", () => new THREE.BoxGeometry(0.28, 0.05, 0.02)), glowMat("gu-visor", 0xff5a24)), 0, 1.63, 0.18);
  halo(root, 0xff5a24, 0.55, 0, 1.63, 0.2, 0.8);
}

function boss(root: THREE.Group, titan: boolean) {
  const scale = titan ? 1.45 : 1;
  const hide = standard(titan ? "bs-hide-t" : "bs-hide", titan ? 0x1a0a1a : 0x140c14, titan ? 0x5a1030 : 0x4a1820, 0.5, 0.8);
  const bone = standard("bs-bone", 0xd8c8a8, 0x2a1a08, 0.5, 0.3);
  const gold = standard("bs-gold", 0x9a7020, 0x4a2a08, 0.3, 0.6);
  halo(root, titan ? 0xb01a60 : 0xe23a24, 5 * scale, 0, 1.7 * scale, -0.6, 0.35, "aura");
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55 * scale, 1.3 * scale, 5, 12), hide);
  body.position.y = 1.5 * scale;
  root.add(body);
  // Chest armour & collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.42 * scale, 0.08 * scale, 6, 16), gold);
  collar.position.y = 2.15 * scale;
  collar.rotation.x = Math.PI / 2;
  root.add(collar);
  for (const sx of [-1, 1]) {
    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.26 * scale, 10, 8), gold);
    pad.position.set(0.62 * sx * scale, 2.1 * scale, 0);
    pad.scale.y = 0.7;
    root.add(pad);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.07 * scale, 0.3 * scale, 6), bone);
    spike.position.set(0.68 * sx * scale, 2.32 * scale, 0);
    spike.rotation.z = -0.5 * sx;
    root.add(spike);
  }
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.4 * scale, 14, 12), hide);
  head.position.y = 2.5 * scale;
  root.add(head);
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.4 * scale, 0.12 * scale, 0.2 * scale), bone);
  jaw.position.set(0, 2.3 * scale, 0.28 * scale);
  root.add(jaw);
  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.1 * scale, 0.6 * scale, 7), bone);
  hornL.position.set(-0.22 * scale, 2.95 * scale, 0);
  hornL.rotation.z = 0.5;
  root.add(hornL);
  const hornR = hornL.clone();
  hornR.position.x = 0.22 * scale;
  hornR.rotation.z = -0.5;
  root.add(hornR);
  if (titan) {
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.3 * scale, 0.36 * scale, 0.14 * scale, 8, 1, true), gold);
    crown.position.y = 2.85 * scale;
    root.add(crown);
  }
  const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.14 * scale, 1.1 * scale, 4, 8), hide);
  armL.name = "armL";
  armL.position.set(-0.75 * scale, 1.7 * scale, 0);
  armL.rotation.z = 0.5;
  root.add(armL);
  const fist = new THREE.Mesh(new THREE.SphereGeometry(0.2 * scale, 10, 8), gold);
  fist.position.y = -0.7 * scale;
  armL.add(fist);
  const armR = armL.clone();
  armR.name = "armR";
  armR.position.x = 0.75 * scale;
  armR.rotation.z = -0.5;
  root.add(armR);
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.8 * scale, 0.5 * scale, 0.5 * scale), hide);
  legs.position.y = 0.3 * scale;
  root.add(legs);
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.24 * scale), glowMat("bs-core", 0xffb03a));
  gem.position.set(0, 1.55 * scale, 0.5 * scale);
  gem.name = "core";
  root.add(gem);
  halo(root, 0xffb03a, 1.4 * scale, 0, 1.55 * scale, 0.55 * scale, 0.85);
  if (titan) {
    for (const sx of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.2, 3), hide);
      wing.position.set(1.0 * sx, 2.6, -0.4);
      wing.rotation.z = -1.1 * sx;
      wing.scale.z = 0.08;
      root.add(wing);
    }
  }
  eyes(root, 0xff3a1a, 2.55 * scale, 0.33 * scale, 0.14 * scale, 0.065 * scale);
}
