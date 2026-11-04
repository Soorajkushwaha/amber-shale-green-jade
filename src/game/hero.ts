import * as THREE from "three";

/** Hero drawn ~1.25x larger than the original rig. */
export const HERO_SCALE = 1.25;

export type HeroAnim = {
  time: number;
  vx: number;
  vy: number;
  grounded: boolean;
  sprint: boolean;
  shooting: boolean;
  aim: number;
  hurt: number;
  victory: boolean;
  defeat: boolean;
  land: number;
  facing: number;
};


export type HeroRig = {
  group: THREE.Group;
  light: THREE.PointLight;
  bobY: number;
  update: (anim: HeroAnim) => void;
  dispose: () => void;
};

export function createHero(): HeroRig {
  const mats: THREE.Material[] = [];
  const geos: THREE.BufferGeometry[] = [];
  const mat = (m: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial) => {
    mats.push(m);
    return m;
  };
  // Blocky chibi "Lightbearer" rig matching the reference art: masked hero in a navy
  // gold-trimmed coat, red scarf + cape, white dhoti, brown belt, dark boots, lantern.
  const std = (color: number, rough = 0.7, metal = 0.05, emissive = 0x000000, ei = 0) =>
    mat(new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, emissive, emissiveIntensity: ei }));
  const skin = std(0xe2ab84, 0.62, 0.02, 0x5a3020, 0.35);
  const hair = std(0x14100e, 0.5);
  const coat = std(0x1d2742, 0.68, 0.05, 0x0a1022, 0.4);
  const gold = std(0xe7b04a, 0.35, 0.7, 0x5a3a08, 0.35);
  const red = std(0xc8282a, 0.72, 0.02, 0x3a0606, 0.35);
  const white = std(0xf2ece0, 0.8);
  const belt = std(0x6a3e1e, 0.6);
  const boot = std(0x1a1512, 0.55);
  const mask = std(0x0c0a0c, 0.35);
  const eyeW = mat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const eyeD = mat(new THREE.MeshBasicMaterial({ color: 0x241408 }));
  const mouthM = mat(new THREE.MeshBasicMaterial({ color: 0x6a2a20 }));
  const flame = mat(new THREE.MeshBasicMaterial({ color: 0xffb03a }));
  const core = mat(new THREE.MeshBasicMaterial({ color: 0xfff1c2 }));
  const brass = std(0xb8862c, 0.3, 0.8, 0x3a2408, 0.3);

  const boxes = new Map<string, THREE.BoxGeometry>();
  const box = (w: number, h: number, d: number) => {
    const k = `${w}|${h}|${d}`;
    let g = boxes.get(k);
    if (!g) {
      g = new THREE.BoxGeometry(w, h, d);
      boxes.set(k, g);
      geos.push(g);
    }
    return g;
  };
  const group = new THREE.Group();
  group.name = "goranksh";

  const hips = new THREE.Group();
  hips.position.y = 0.9;
  group.add(hips);
  const torso = new THREE.Group();
  hips.add(torso);

  // Dhoti + belt
  mesh(box(0.42, 0.32, 0.28), white, hips, 0, -0.14, 0);
  mesh(box(0.42, 0.06, 0.28), belt, hips, 0, 0.03, 0);
  mesh(box(0.07, 0.05, 0.02), gold, hips, 0, 0.03, 0.145);
  // Coat torso
  mesh(box(0.4, 0.42, 0.25), coat, torso, 0, 0.27, 0);
  mesh(box(0.42, 0.04, 0.27), gold, torso, 0, 0.07, 0); // hem trim
  mesh(box(0.03, 0.4, 0.01), gold, torso, -0.075, 0.27, 0.128); // lapel trims
  mesh(box(0.03, 0.4, 0.01), gold, torso, 0.075, 0.27, 0.128);
  // Gold diya emblem on chest
  mesh(box(0.14, 0.045, 0.01), gold, torso, 0, 0.25, 0.131);
  mesh(box(0.08, 0.03, 0.01), gold, torso, 0, 0.22, 0.131);
  const emb = mesh(box(0.05, 0.08, 0.012), mat(new THREE.MeshBasicMaterial({ color: 0xffc14a })), torso, 0, 0.31, 0.132);
  emb.position.y = 0.31;
  emb.rotation.z = Math.PI / 4;
  // Coat tails
  mesh(box(0.14, 0.2, 0.02), coat, torso, -0.12, -0.04, 0.12);
  mesh(box(0.14, 0.2, 0.02), coat, torso, 0.12, -0.04, 0.12);
  // Shoulders
  mesh(box(0.13, 0.08, 0.27), coat, torso, -0.25, 0.46, 0);
  mesh(box(0.13, 0.08, 0.27), coat, torso, 0.25, 0.46, 0);
  // Red scarf + cape
  mesh(box(0.36, 0.08, 0.28), red, torso, 0, 0.5, 0);
  const scarfTail = mesh(box(0.08, 0.2, 0.03), red, torso, 0.1, 0.38, 0.14);
  scarfTail.rotation.z = 0.2;
  const cape = new THREE.Group();
  cape.position.set(0, 0.5, -0.14);
  torso.add(cape);
  const capeA = mesh(box(0.5, 0.55, 0.03), red, cape, 0, -0.27, 0);
  const capeB = mesh(box(0.6, 0.4, 0.03), red, cape, 0, -0.7, -0.07);
  capeB.rotation.x = 0.25;
  for (const sx of [-1, 1]) {
    const wing = mesh(box(0.03, 0.75, 0.22), red, cape, 0.26 * sx, -0.4, 0.06);
    wing.rotation.z = 0.12 * sx;
  }
  void capeA;

  // Head (big chibi block)
  const headP = new THREE.Group();
  headP.position.y = 0.52;
  headP.scale.setScalar(1.22);
  torso.add(headP);
  const head = mesh(box(0.34, 0.34, 0.32), skin, headP, 0, 0.18, 0);
  void head;
  mesh(box(0.36, 0.1, 0.34), hair, headP, 0, 0.37, -0.005);
  mesh(box(0.36, 0.2, 0.08), hair, headP, 0, 0.27, -0.14);
  mesh(box(0.05, 0.14, 0.3), hair, headP, -0.17, 0.28, -0.01);
  mesh(box(0.05, 0.14, 0.3), hair, headP, 0.17, 0.28, -0.01);
  // Puffy short hair volume with a swept tuft
  mesh(box(0.38, 0.12, 0.36), hair, headP, 0, 0.45, -0.01);
  mesh(box(0.3, 0.08, 0.3), hair, headP, -0.01, 0.53, -0.02);
  const tuft = mesh(box(0.16, 0.08, 0.12), hair, headP, 0.08, 0.5, 0.12);
  tuft.rotation.z = -0.35;
  mesh(box(0.3, 0.05, 0.04), hair, headP, 0, 0.33, 0.15); // fringe
  // Eye mask with holes and friendly eyes
  mesh(box(0.355, 0.085, 0.02), mask, headP, 0, 0.22, 0.165);
  const eyeL = mesh(box(0.06, 0.045, 0.01), eyeW, headP, -0.07, 0.22, 0.177);
  const eyeR = mesh(box(0.06, 0.045, 0.01), eyeW, headP, 0.07, 0.22, 0.177);
  mesh(box(0.028, 0.035, 0.01), eyeD, eyeL, 0.008, -0.002, 0.004);
  mesh(box(0.028, 0.035, 0.01), eyeD, eyeR, 0.008, -0.002, 0.004);
  mesh(box(0.01, 0.01, 0.01), eyeW, eyeL, 0.014, 0.008, 0.01);
  mesh(box(0.01, 0.01, 0.01), eyeW, eyeR, 0.014, 0.008, 0.01);
  // mask ties
  mesh(box(0.03, 0.03, 0.12), mask, headP, -0.17, 0.22, -0.18).rotation.x = 0.5;
  // nose + smile
  mesh(box(0.04, 0.05, 0.03), skin, headP, 0, 0.14, 0.17);
  mesh(box(0.1, 0.02, 0.01), mouthM, headP, 0, 0.075, 0.162);
  mesh(box(0.02, 0.02, 0.01), mouthM, headP, -0.055, 0.085, 0.162);
  mesh(box(0.02, 0.02, 0.01), mouthM, headP, 0.055, 0.085, 0.162);
  mesh(box(0.05, 0.08, 0.06), skin, headP, -0.185, 0.18, 0);
  mesh(box(0.05, 0.08, 0.06), skin, headP, 0.185, 0.18, 0);

  const arm = (side: number) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.27, 0.42, 0);
    torso.add(shoulder);
    mesh(box(0.12, 0.24, 0.13), coat, shoulder, 0, -0.12, 0);
    const elbow = new THREE.Group();
    elbow.position.y = -0.24;
    shoulder.add(elbow);
    mesh(box(0.115, 0.18, 0.125), coat, elbow, 0, -0.08, 0);
    mesh(box(0.125, 0.04, 0.135), gold, elbow, 0, -0.16, 0);
    const hand = new THREE.Group();
    hand.position.y = -0.22;
    elbow.add(hand);
    mesh(box(0.1, 0.09, 0.1), skin, hand, 0, 0, 0);
    return { shoulder, elbow, hand };
  };
  const left = arm(-1);
  const right = arm(1);

  // Glowing lantern carried in the left hand.
  const diya = new THREE.Group();
  diya.position.set(0, -0.08, 0.02);
  left.hand.add(diya);
  mesh(box(0.02, 0.06, 0.02), brass, diya, 0, -0.02, 0); // handle
  mesh(box(0.15, 0.03, 0.15), brass, diya, 0, -0.06, 0); // cap
  mesh(box(0.13, 0.03, 0.13), brass, diya, 0, -0.26, 0); // base
  for (const [x, z] of [[-0.06, -0.06], [0.06, -0.06], [-0.06, 0.06], [0.06, 0.06]] as const) mesh(box(0.02, 0.18, 0.02), brass, diya, x, -0.16, z);
  const glass = mat(new THREE.MeshBasicMaterial({ color: 0xffb648, transparent: true, opacity: 0.75 }));
  mesh(box(0.1, 0.16, 0.1), glass, diya, 0, -0.16, 0);
  const wick = mesh(box(0.04, 0.08, 0.04), flame, diya, 0, -0.15, 0);
  mesh(box(0.025, 0.04, 0.025), core, diya, 0, -0.17, 0);
  const light = new THREE.PointLight(0xffa040, 2.6, 8, 2);
  light.position.set(0, -0.16, 0.05);
  diya.add(light);
  const lanternGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: radial(), color: 0xffa040, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  lanternGlow.scale.setScalar(0.7);
  lanternGlow.position.set(0, -0.16, 0);
  diya.add(lanternGlow);

  const leg = (side: number) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.1, -0.06, 0);
    hips.add(hip);
    mesh(box(0.14, 0.26, 0.15), coat, hip, 0, -0.14, 0);
    const knee = new THREE.Group();
    knee.position.y = -0.3;
    hip.add(knee);
    mesh(box(0.14, 0.24, 0.15), boot, knee, 0, -0.14, 0);
    mesh(box(0.15, 0.03, 0.16), gold, knee, 0, -0.02, 0);
    const foot = mesh(box(0.15, 0.08, 0.22), boot, knee, 0, -0.27, 0.035);
    return { hip, knee, foot };
  };
  const legL = leg(-1);
  const legR = leg(1);
  const rimMat = mat(new THREE.MeshBasicMaterial({ color: 0xffc35a, side: THREE.BackSide, transparent: true, opacity: 0.55, depthWrite: false }));
  const bodyMeshes: THREE.Mesh[] = [];
  group.traverse((obj) => {
    const meshObj = obj as THREE.Mesh;
    if (meshObj.isMesh) {
      meshObj.castShadow = true;
      meshObj.receiveShadow = true;
      meshObj.geometry.computeBoundingSphere();
      if ((meshObj.geometry.boundingSphere?.radius ?? 0) > 0.07 && (meshObj.material as THREE.Material).type === "MeshStandardMaterial") bodyMeshes.push(meshObj);
    }
  });
  // Warm golden rim so the hero pops against the dark city.
  for (const b of bodyMeshes) {
    const shell = new THREE.Mesh(b.geometry, rimMat);
    shell.scale.setScalar(1.07);
    shell.castShadow = false;
    b.add(shell);
  }
  // Soft diya-glow halo behind the hero.
  const hc = document.createElement("canvas");
  hc.width = hc.height = 64;
  const hg = hc.getContext("2d")!;
  const grd = hg.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,200,120,0.9)");
  grd.addColorStop(1, "rgba(255,160,60,0)");
  hg.fillStyle = grd;
  hg.fillRect(0, 0, 64, 64);
  const haloTex = new THREE.CanvasTexture(hc);
  const heroHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, color: 0xffb060, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
  heroHalo.scale.set(1.8, 2.2, 1);
  heroHalo.position.set(0, 1.0, -0.2);
  group.add(heroHalo);

  const update = (a: HeroAnim) => {
    const speed = Math.abs(a.vx);
    const run = a.grounded && speed > 0.4;
    const sprint = run && a.sprint && speed > 8;
    const freq = sprint ? 11.5 : speed > 6 ? 8.4 : 6.2;
    const amp = sprint ? 0.9 : speed > 6 ? 0.68 : 0.46;
    const s = Math.sin(a.time * freq);
    legL.hip.rotation.x = 0;
    legR.hip.rotation.x = 0;
    legL.knee.rotation.x = 0;
    legR.knee.rotation.x = 0;
    left.shoulder.rotation.x = 0;
    right.shoulder.rotation.x = 0;
    left.elbow.rotation.x = 0.15;
    right.elbow.rotation.x = 0.2;
    torso.rotation.z = 0;
    torso.rotation.x = 0;
    hips.rotation.x = 0;
    headP.rotation.x = 0;
    torso.position.y = 0;
    let bob = 0;

    if (a.defeat) {
      hips.rotation.x = 1.15;
      hips.position.y = 0.45;
      torso.rotation.x = 0.4;
      return;
    }
    hips.position.y = 0.9;

    if (a.victory) {
      left.shoulder.rotation.x = -2.6;
      right.shoulder.rotation.x = -2.6;
      torso.rotation.x = -0.15;
      legL.hip.rotation.x = 0.2;
      legR.hip.rotation.x = -0.15;
    } else if (!a.grounded && a.vy > 1) {
      legL.hip.rotation.x = -0.7;
      legR.hip.rotation.x = -0.35;
      legL.knee.rotation.x = 1.0;
      legR.knee.rotation.x = 0.7;
      left.shoulder.rotation.x = -2.2;
      right.shoulder.rotation.x = -1.8;
    } else if (!a.grounded) {
      legL.hip.rotation.x = 0.25;
      legR.hip.rotation.x = -0.15;
      legL.knee.rotation.x = 0.3;
      left.shoulder.rotation.x = -0.6;
      right.shoulder.rotation.x = -0.4;
      torso.rotation.x = 0.12;
    } else if (run) {
      legL.hip.rotation.x = s * amp;
      legR.hip.rotation.x = -s * amp;
      legL.knee.rotation.x = Math.max(0, -s) * 1.05;
      legR.knee.rotation.x = Math.max(0, s) * 1.05;
      left.shoulder.rotation.x = -s * amp * 0.75;
      right.shoulder.rotation.x = s * amp * 0.55;
      torso.rotation.z = s * 0.04;
      bob = Math.abs(Math.sin(a.time * freq)) * (sprint ? 0.07 : 0.045);
    } else {
      const b = Math.sin(a.time * 1.7);
      torso.position.y = b * 0.012;
      left.shoulder.rotation.x = b * 0.06;
      right.shoulder.rotation.x = -b * 0.05;
      headP.rotation.x = b * 0.03;
    }

    if (a.shooting && !a.victory && !a.defeat) {
      const lift = Math.min(1.35, Math.max(-0.2, a.aim));
      right.shoulder.rotation.x = -1.15 - lift;
      right.elbow.rotation.x = 0.15;
    }

    if (a.hurt > 0) torso.rotation.x = 0.35;
    if (a.land > 0 && a.grounded) {
      const k = a.land / 0.12;
      group.scale.set((1 + 0.08 * k) * HERO_SCALE, (1 - 0.1 * k) * HERO_SCALE, HERO_SCALE);
    } else if (!a.grounded && a.vy > 0) {
      group.scale.set(0.94 * HERO_SCALE, 1.08 * HERO_SCALE, 0.94 * HERO_SCALE);
    } else {
      group.scale.setScalar(HERO_SCALE);
    }

    cape.rotation.x = 0.12 + (run ? 0.35 + Math.abs(s) * 0.15 : 0.05 + Math.sin(a.time * 1.3) * 0.04) + (!a.grounded ? 0.3 : 0);
    diya.rotation.x = run ? Math.sin(a.time * freq) * 0.25 : 0;
    const flick = 0.82 + Math.sin(a.time * 22) * 0.12 + Math.sin(a.time * 37) * 0.06;
    wick.scale.y = flick;
    light.intensity = 2.2 + Math.sin(a.time * 19) * 0.4;
    lanternGlow.scale.setScalar(0.62 + flick * 0.12);
    // 3/4 view toward the camera so the face reads while running.
    group.rotation.y = a.facing > 0 ? Math.PI / 2 - 0.75 : -Math.PI / 2 + 0.75;
    rig.bobY = bob;
  };

  const rig: HeroRig = {
    group,
    light,
    bobY: 0,
    update,
    dispose: () => {
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
    },
  };
  return rig;
}

function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

let radialTex: THREE.Texture | null = null;
function radial() {
  if (radialTex) return radialTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.35, "rgba(255,255,255,0.4)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  radialTex = new THREE.CanvasTexture(c);
  return radialTex;
}
