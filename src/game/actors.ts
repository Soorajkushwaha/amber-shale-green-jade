import * as THREE from "three";
import type { EnemyKind } from "@/game/types";

export type ActorKind = EnemyKind | "boss" | "titan";

const cache = new Map<string, THREE.BufferGeometry>();
function g(key: string, build: () => THREE.BufferGeometry) {
  let geo = cache.get(key);
  if (!geo) {
    geo = build();
    cache.set(key, geo);
  }
  return geo;
}

function standard(color: number, emissive: number, rough = 0.6) {
  return new THREE.MeshStandardMaterial({ color, emissive, roughness: rough, metalness: 0.08 });
}

export function makeActor(kind: ActorKind): THREE.Group {
  const root = new THREE.Group();
  root.name = kind;
  if (kind === "shadow") shadow(root);
  else if (kind === "drone") drone(root);
  else if (kind === "smoke") smoke(root);
  else if (kind === "energy") energy(root);
  else if (kind === "guardian") guardian(root);
  else boss(root, kind === "titan");
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
  return root;
}

export function actorStats(kind: ActorKind) {
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
}

export function animateActor(root: THREE.Group, time: number, kind: ActorKind) {
  const s = Math.sin(time * (kind === "drone" ? 6 : 3));
  if (kind === "drone") {
    root.position.y += Math.sin(time * 4) * 0;
    root.children[0]!.rotation.y = time * 1.4;
    root.rotation.z = Math.sin(time * 5) * 0.08;
  } else if (kind === "smoke") {
    root.rotation.y = Math.sin(time * 0.8) * 0.2;
    root.scale.y = 1 + Math.sin(time * 2) * 0.05;
  } else if (kind === "boss" || kind === "titan") {
    root.rotation.y = Math.sin(time * 0.7) * 0.12;
    const arm = root.getObjectByName("armL");
    const armR = root.getObjectByName("armR");
    if (arm) arm.rotation.z = 0.4 + s * 0.3;
    if (armR) armR.rotation.z = -0.4 - s * 0.3;
  } else {
    root.rotation.z = s * 0.04;
  }
}

function add(parent: THREE.Object3D, mesh: THREE.Mesh, x = 0, y = 0, z = 0) {
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function shadow(root: THREE.Group) {
  const body = standard(0x1a1020, 0x3a1028, 0.7);
  const eye = new THREE.MeshBasicMaterial({ color: 0xe25a24 });
  add(root, new THREE.Mesh(g("sh-body", () => new THREE.CapsuleGeometry(0.22, 0.7, 4, 8)), body), 0, 0.85, 0);
  add(root, new THREE.Mesh(g("sh-head", () => new THREE.SphereGeometry(0.18, 10, 8)), body), 0, 1.4, 0.05);
  const armL = add(root, new THREE.Mesh(g("sh-arm", () => new THREE.CapsuleGeometry(0.06, 0.55, 3, 6)), body), -0.28, 0.85, 0);
  armL.rotation.z = 0.7;
  const armR = armL.clone();
  armR.position.x = 0.28;
  armR.rotation.z = -0.7;
  root.add(armR);
  add(root, new THREE.Mesh(g("eye", () => new THREE.SphereGeometry(0.035, 6, 6)), eye), -0.07, 1.44, 0.14);
  add(root, new THREE.Mesh(g("eye", () => new THREE.SphereGeometry(0.035, 6, 6)), eye), 0.07, 1.44, 0.14);
}

function drone(root: THREE.Group) {
  const shell = standard(0x241820, 0x5a2010, 0.35);
  const eye = new THREE.MeshBasicMaterial({ color: 0xffb03a });
  const hub = new THREE.Group();
  root.add(hub);
  add(hub, new THREE.Mesh(g("oct", () => new THREE.OctahedronGeometry(0.28)), shell), 0, 0.9, 0);
  const wing = add(hub, new THREE.Mesh(g("wing", () => new THREE.BoxGeometry(0.7, 0.04, 0.18)), shell), 0, 0.95, 0);
  wing.scale.set(1, 1, 1);
  add(hub, new THREE.Mesh(g("eye", () => new THREE.SphereGeometry(0.07, 8, 6)), eye), 0, 0.9, 0.18);
}

function smoke(root: THREE.Group) {
  const puff = standard(0x2a2a2e, 0x1a1210, 0.9);
  add(root, new THREE.Mesh(g("p1", () => new THREE.SphereGeometry(0.32, 10, 8)), puff), 0, 0.45, 0);
  add(root, new THREE.Mesh(g("p2", () => new THREE.SphereGeometry(0.26, 10, 8)), puff), 0.08, 0.9, 0);
  add(root, new THREE.Mesh(g("p3", () => new THREE.SphereGeometry(0.18, 8, 6)), puff), -0.05, 1.25, 0);
  const eye = new THREE.MeshBasicMaterial({ color: 0xe7b04a });
  add(root, new THREE.Mesh(g("eye", () => new THREE.SphereGeometry(0.04, 6, 6)), eye), -0.08, 0.95, 0.18);
  add(root, new THREE.Mesh(g("eye", () => new THREE.SphereGeometry(0.04, 6, 6)), eye), 0.1, 0.98, 0.16);
}

function energy(root: THREE.Group) {
  const crystal = standard(0x3a2418, 0xe25a24, 0.25);
  crystal.emissiveIntensity = 0.6;
  add(root, new THREE.Mesh(g("ico", () => new THREE.IcosahedronGeometry(0.32, 0)), crystal), 0, 0.85, 0);
  add(root, new THREE.Mesh(g("ico2", () => new THREE.OctahedronGeometry(0.16)), crystal), 0, 1.35, 0);
  add(root, new THREE.Mesh(g("legc", () => new THREE.BoxGeometry(0.08, 0.4, 0.08)), crystal), -0.1, 0.3, 0);
  add(root, new THREE.Mesh(g("legc", () => new THREE.BoxGeometry(0.08, 0.4, 0.08)), crystal), 0.1, 0.3, 0);
}

function guardian(root: THREE.Group) {
  const plate = standard(0x1c140f, 0x3a2010, 0.45);
  const eye = new THREE.MeshBasicMaterial({ color: 0xe25a24 });
  add(root, new THREE.Mesh(g("gbody", () => new THREE.BoxGeometry(0.7, 0.9, 0.4)), plate), 0, 0.95, 0);
  add(root, new THREE.Mesh(g("ghead", () => new THREE.BoxGeometry(0.36, 0.32, 0.32)), plate), 0, 1.55, 0);
  const shield = add(root, new THREE.Mesh(g("shield", () => new THREE.BoxGeometry(0.45, 0.7, 0.08)), plate), -0.48, 1, 0.1);
  shield.rotation.z = 0.15;
  add(root, new THREE.Mesh(g("eye", () => new THREE.SphereGeometry(0.04, 6, 6)), eye), -0.08, 1.58, 0.16);
  add(root, new THREE.Mesh(g("eye", () => new THREE.SphereGeometry(0.04, 6, 6)), eye), 0.08, 1.58, 0.16);
}

function boss(root: THREE.Group, titan: boolean) {
  const scale = titan ? 1.45 : 1;
  const hide = standard(0x140c14, 0x4a1820, 0.5);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffb03a });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55 * scale, 1.3 * scale, 5, 10), hide);
  body.position.y = 1.5 * scale;
  root.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.38 * scale, 12, 10), hide);
  head.position.y = 2.45 * scale;
  root.add(head);
  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.08 * scale, 0.45 * scale, 6), hide);
  hornL.position.set(-0.18 * scale, 2.85 * scale, 0);
  hornL.rotation.z = 0.4;
  root.add(hornL);
  const hornR = hornL.clone();
  hornR.position.x = 0.18 * scale;
  hornR.rotation.z = -0.4;
  root.add(hornR);
  const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.12 * scale, 1.1 * scale, 4, 8), hide);
  armL.name = "armL";
  armL.position.set(-0.7 * scale, 1.7 * scale, 0);
  armL.rotation.z = 0.5;
  root.add(armL);
  const armR = armL.clone();
  armR.name = "armR";
  armR.position.x = 0.7 * scale;
  armR.rotation.z = -0.5;
  root.add(armR);
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.22 * scale), coreMat);
  gem.position.set(0, 1.55 * scale, 0.4 * scale);
  gem.name = "core";
  root.add(gem);
  if (titan) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 0.08), hide);
    wing.position.set(0, 2.1, -0.3);
    root.add(wing);
  }
  const eye = new THREE.MeshBasicMaterial({ color: 0xe25a24 });
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.06 * scale, 8, 6), eye);
  e1.position.set(-0.12 * scale, 2.5 * scale, 0.28 * scale);
  root.add(e1);
  const e2 = e1.clone();
  e2.position.x = 0.12 * scale;
  root.add(e2);
}
