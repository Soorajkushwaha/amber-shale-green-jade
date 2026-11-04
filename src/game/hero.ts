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

type Joint = THREE.Group;

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
  const skin = mat(new THREE.MeshStandardMaterial({ color: 0xc48a62, roughness: 0.58, metalness: 0.02 }));
  const hair = mat(new THREE.MeshStandardMaterial({ color: 0x1a120e, roughness: 0.42, metalness: 0.06 }));
  const kurta = mat(new THREE.MeshStandardMaterial({ color: 0xf3e2c4, roughness: 0.78 }));
  const jacket = mat(new THREE.MeshStandardMaterial({ color: 0x241c18, roughness: 0.6, metalness: 0.08 }));
  const gold = mat(new THREE.MeshStandardMaterial({ color: 0xe7b04a, roughness: 0.32, metalness: 0.74 }));
  const cloth = mat(new THREE.MeshStandardMaterial({ color: 0x3a2c24, roughness: 0.8 }));
  const shoe = mat(new THREE.MeshStandardMaterial({ color: 0x16110e, roughness: 0.52 }));
  const white = mat(new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.28 }));
  const dark = mat(new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.3 }));
  const lip = mat(new THREE.MeshStandardMaterial({ color: 0xa85a48, roughness: 0.48 }));
  const brass = mat(new THREE.MeshStandardMaterial({ color: 0xd4a24c, roughness: 0.28, metalness: 0.86 }));
  const flame = mat(new THREE.MeshBasicMaterial({ color: 0xffb03a }));
  const core = mat(new THREE.MeshBasicMaterial({ color: 0xfff1c2 }));

  const geo = (g: THREE.BufferGeometry) => {
    geos.push(g);
    return g;
  };
  const group = new THREE.Group();
  group.name = "goranksh";

  const hips = new THREE.Group();
  hips.position.y = 0.9;
  group.add(hips);

  const torso = new THREE.Group();
  hips.add(torso);

  const chest = mesh(geo(new THREE.CylinderGeometry(0.16, 0.15, 0.42, 10)), kurta, torso, 0, 0.2, 0);
  chest.scale.set(1.05, 1, 0.82);
  const jacketL = mesh(geo(new THREE.BoxGeometry(0.08, 0.4, 0.22)), jacket, torso, -0.16, 0.2, 0);
  const jacketR = mesh(geo(new THREE.BoxGeometry(0.08, 0.4, 0.22)), jacket, torso, 0.16, 0.2, 0);
  mesh(geo(new THREE.BoxGeometry(0.02, 0.38, 0.23)), gold, torso, -0.125, 0.2, 0);
  mesh(geo(new THREE.BoxGeometry(0.02, 0.38, 0.23)), gold, torso, 0.125, 0.2, 0);
  mesh(geo(new THREE.BoxGeometry(0.06, 0.08, 0.02)), gold, torso, 0, 0.28, 0.12);
  const skirt = mesh(geo(new THREE.CylinderGeometry(0.2, 0.24, 0.34, 10)), kurta, hips, 0, -0.12, 0);
  skirt.scale.z = 0.78;

  const headP = new THREE.Group();
  headP.position.y = 0.46;
  torso.add(headP);
  const head = mesh(geo(new THREE.SphereGeometry(0.125, 14, 12)), skin, headP, 0, 0.12, 0);
  head.scale.set(1, 1.08, 0.94);
  const hairCap = mesh(geo(new THREE.SphereGeometry(0.132, 14, 10)), hair, headP, 0, 0.16, -0.01);
  hairCap.scale.set(1.02, 0.72, 1.02);
  mesh(geo(new THREE.BoxGeometry(0.2, 0.06, 0.08)), hair, headP, 0, 0.2, 0.06);
  mesh(geo(new THREE.SphereGeometry(0.03, 8, 6)), skin, headP, -0.12, 0.1, 0);
  mesh(geo(new THREE.SphereGeometry(0.03, 8, 6)), skin, headP, 0.12, 0.1, 0);
  const eyeL = mesh(geo(new THREE.SphereGeometry(0.02, 8, 6)), white, headP, -0.045, 0.12, 0.1);
  const eyeR = mesh(geo(new THREE.SphereGeometry(0.02, 8, 6)), white, headP, 0.045, 0.12, 0.1);
  mesh(geo(new THREE.SphereGeometry(0.011, 8, 6)), dark, eyeL, 0, 0, 0.012);
  mesh(geo(new THREE.SphereGeometry(0.011, 8, 6)), dark, eyeR, 0, 0, 0.012);
  mesh(geo(new THREE.BoxGeometry(0.05, 0.012, 0.02)), hair, headP, -0.045, 0.15, 0.1);
  mesh(geo(new THREE.BoxGeometry(0.05, 0.012, 0.02)), hair, headP, 0.045, 0.15, 0.1);
  const nose = mesh(geo(new THREE.ConeGeometry(0.018, 0.045, 6)), skin, headP, 0, 0.09, 0.11);
  nose.rotation.x = Math.PI / 2;
  mesh(geo(new THREE.BoxGeometry(0.05, 0.014, 0.02)), lip, headP, 0, 0.055, 0.105);

  const arm = (side: number) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.2, 0.36, 0);
    torso.add(shoulder);
    mesh(geo(new THREE.CapsuleGeometry(0.045, 0.22, 4, 8)), jacket, shoulder, 0, -0.16, 0);
    const elbow = new THREE.Group();
    elbow.position.y = -0.3;
    shoulder.add(elbow);
    mesh(geo(new THREE.CapsuleGeometry(0.04, 0.2, 4, 8)), skin, elbow, 0, -0.14, 0);
    const hand = new THREE.Group();
    hand.position.y = -0.28;
    elbow.add(hand);
    mesh(geo(new THREE.SphereGeometry(0.048, 8, 6)), skin, hand, 0, 0, 0);
    return { shoulder, elbow, hand };
  };
  const left = arm(-1);
  const right = arm(1);

  const diya = new THREE.Group();
  right.hand.add(diya);
  mesh(geo(new THREE.CylinderGeometry(0.055, 0.04, 0.03, 10)), brass, diya, 0, 0.03, 0.02);
  mesh(geo(new THREE.TorusGeometry(0.05, 0.008, 6, 10)), gold, diya, 0, 0.045, 0.02).rotation.x = Math.PI / 2;
  const wick = mesh(geo(new THREE.ConeGeometry(0.022, 0.1, 8)), flame, diya, 0, 0.11, 0.02);
  mesh(geo(new THREE.SphereGeometry(0.016, 8, 6)), core, diya, 0, 0.08, 0.02);
  const light = new THREE.PointLight(0xffa040, 2.2, 7.5, 2);
  light.position.set(0, 0.1, 0.02);
  diya.add(light);

  const leg = (side: number) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.09, -0.02, 0);
    hips.add(hip);
    mesh(geo(new THREE.CapsuleGeometry(0.055, 0.28, 4, 8)), cloth, hip, 0, -0.2, 0);
    const knee = new THREE.Group();
    knee.position.y = -0.4;
    hip.add(knee);
    mesh(geo(new THREE.CapsuleGeometry(0.048, 0.26, 4, 8)), cloth, knee, 0, -0.18, 0);
    const foot = mesh(geo(new THREE.BoxGeometry(0.09, 0.06, 0.18)), shoe, knee, 0, -0.36, 0.04);
    return { hip, knee, foot };
  };
  const legL = leg(-1);
  const legR = leg(1);

  group.traverse((obj) => {
    const meshObj = obj as THREE.Mesh;
    if (meshObj.isMesh) {
      meshObj.castShadow = true;
      meshObj.receiveShadow = true;
    }
  });

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

    const flick = 0.82 + Math.sin(a.time * 22) * 0.12 + Math.sin(a.time * 37) * 0.06;
    wick.scale.y = flick;
    light.intensity = 1.8 + Math.sin(a.time * 19) * 0.35;
    group.rotation.y = a.facing > 0 ? Math.PI / 2 : -Math.PI / 2;
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
