import * as THREE from "three";
import { actorStats, animateActor, makeActor } from "@/game/actors";
import { buildLevel } from "@/game/campaign";
import { AudioBus } from "@/game/audio";
import { createHero } from "@/game/hero";
import type { ClearPayload, EnemyKind, GameEvent, Hud, LandmarkKind, Level, Quality, Solid, Theme } from "@/game/types";

const GRAVITY = 24;
const JUMP = 11.1;
const MOVE = 7.5;
const SPRINT = 10.8;
// Hitbox grows with the bigger hero (a bit under the visual 1.25x so existing gaps/ceilings stay passable).
/** Enemies only open fire inside these ranges (world units) and while roughly on screen. */
/** Turn characters ~40° toward the camera (3/4 view) so faces read. */
const FACE_TURN = 0.95;
const FOE_FIRE_RANGE = 8;
const BOSS_FIRE_RANGE = 13;
const FIRE_MAX_DY = 3.2;
const FOE_WINDUP = 0.5;
const BOSS_WINDUP = 0.45;
const PW = 0.48 * 1.12;
const PH = 1.55 * 1.18;

export type StartOpts = {
  cityId: string;
  cityName: string;
  cityIndex: number;
  areaIndex: number;
  weapon: number;
  cleared: boolean[];
  illums: number[];
};

type TouchState = { x: number; y: number; jump: boolean; shoot: boolean; sprint: boolean; using: boolean };

type Foe = {
  kind: EnemyKind;
  x: number;
  y: number;
  vy: number;
  hp: number;
  dir: number;
  left: number;
  right: number;
  cool: number;
  hurt: number;
  alive: boolean;
  fly: boolean;
  w: number;
  h: number;
  mesh: THREE.Group;
  /** Seconds left in the shot wind-up telegraph (0 = not winding up). */
  wind?: number;
};

type Pickup = {
  kind: "coin" | "flame" | "power";
  sub: string;
  x: number;
  y: number;
  base: number;
  alive: boolean;
  mesh: THREE.Object3D;
};

type Bolt = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  dmg: number;
  r: number;
  friendly: boolean;
  hits: number;
  alive: boolean;
  explode: boolean;
  seen: number[];
  mesh: THREE.Mesh;
};

type Boss = {
  wind?: number;
  name: string;
  hp: number;
  max: number;
  phase: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cool: number;
  dash: number;
  dir: number;
  mesh: THREE.Group;
};

type Wave = { x: number; r: number; life: number; mesh: THREE.Mesh };

type Facade = {
  x: number;
  h: number;
  index: number;
  start: number;
  count: number;
  lit: number;
  target: number;
};

type LampRec = { mesh: THREE.InstancedMesh; index: number; x: number };

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getX: () => number;
      getY: () => number;
      setKeys: (codes: string[]) => void;
      setSteer: (v: number) => void;
    };
    __gameReady?: boolean;
  }
}

export class Game {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(48, 1, 0.1, 200);
  private hero = createHero();
  private audio = new AudioBus();
  private keys = new Set<string>();
  private forced = new Set<string>();
  private steer = 0;
  private touch: TouchState = { x: 0, y: 0, jump: false, shoot: false, sprint: false, using: false };
  private prevJump = false;
  private pointerDown = false;
  private pointer = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private aimPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private hit = new THREE.Vector3();
  private desired = new THREE.Vector3();
  private look = new THREE.Vector3();
  private mouseFresh = 0;
  private dirx = 1;
  private diry = 0;
  private facing = 1;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private time = 0;
  private runTime = 0;
  private hudAcc = 0;
  private mode: "menu" | "play" = "menu";
  private paused = false;
  private quality: Quality;
  private shakeMag = 0;
  private portrait = false;
  private fps = 60;
  private dropped = false;
  private playClock = 0;
  private level: Level | null = null;
  private levelGroup = new THREE.Group();
  private solidMeshes: THREE.Mesh[] = [];
  private trashMat: THREE.Material[] = [];
  private trashGeo: THREE.BufferGeometry[] = [];
  private trashTex: THREE.Texture[] = [];
  private windows: THREE.InstancedMesh | null = null;
  private bodies: THREE.InstancedMesh | null = null;
  private facades: Facade[] = [];
  private lampRecs: LampRec[] = [];
  private lampMeshes: THREE.InstancedMesh[] = [];
  private diyaAwake = false;
  private lightReach = -999;
  private paintedReach = -1000;
  private landmarkMats: THREE.MeshStandardMaterial[] = [];
  private landmarkX = 0;
  private bodyOff = new THREE.Color("#121820");
  private bodyOn = new THREE.Color("#8a6234");
  private winOff = new THREE.Color(0x140e18);
  private winOn = new THREE.Color(0xffd27a);
  private lampDim = new THREE.Color(0x2a221c);
  private lampGold = new THREE.Color(0xe7b04a);
  private lampEmber = new THREE.Color(0xe25a24);
  private cWin = new THREE.Color();
  private cBody = new THREE.Color();
  private wakeLight = new THREE.PointLight(0xffb45a, 0, 18, 2);
  private foes: Foe[] = [];
  private foeTotal = 0;
  private pickups: Pickup[] = [];
  private bolts: Bolt[] = [];
  private waves: Wave[] = [];
  private boss: Boss | null = null;
  private bossActive = false;
  private sparks: Sparks;
  private lib = {
    box: new THREE.BoxGeometry(1, 1, 1),
    sphere: new THREE.SphereGeometry(1, 10, 8),
    coin: new THREE.CylinderGeometry(0.22, 0.22, 0.07, 12),
    flame: new THREE.ConeGeometry(0.16, 0.42, 8),
    bowl: new THREE.CylinderGeometry(0.18, 0.11, 0.09, 10),
    torus: new THREE.TorusGeometry(0.2, 0.06, 6, 10),
  };
  private hemi = new THREE.HemisphereLight(0xd0d8ff, 0x3a2a18, 0.85);
  private dir = new THREE.DirectionalLight(0xffe2b8, 1.15);
  private p = { x: 2.2, y: 0.3, vx: 0, vy: 0, grounded: false, coyote: 0, airJumps: 1, ride: -1, land: 0 };
  private cpX = 2.2;
  private cpY = 0.2;
  private hearts = 3;
  private maxHearts = 5;
  private weapon = 1;
  private shield = 0;
  private invuln = 0;
  private starT = 0;
  private jumpT = 0;
  private magnetT = 0;
  private flameT = 0;
  private shootT = 0;
  private coins = 0;
  private flames = 0;
  private kills = 0;
  private noDamage = true;
  private cleared: boolean[] = [];
  private illums: number[] = [];
  private cityName = "Gurugram";
  private cityIndex = 0;
  private areaIndex = 0;
  private cine: { kind: "clear" | "dead" | "boss"; t: number; dur: number } | null = null;
  private opts: StartOpts | null = null;
  private shootHeld = false;
  private sprintHeld = false;
  private readonly qa: boolean;

  constructor(
    private canvas: HTMLCanvasElement,
    quality: Quality,
    private onEvent: (e: GameEvent) => void,
    private onHud: (h: Hud) => void,
  ) {
    this.quality = quality;
    this.qa = import.meta.env.DEV || new URLSearchParams(location.search).has("qa");
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = quality !== "low";
    this.scene.add(this.levelGroup);
    this.scene.add(this.hemi);
    this.dir.position.set(12, 22, 14);
    this.dir.castShadow = quality !== "low";
    this.dir.shadow.mapSize.set(quality === "high" ? 1024 : 512, quality === "high" ? 1024 : 512);
    this.dir.shadow.camera.near = 1;
    this.dir.shadow.camera.far = 48;
    const cam = this.dir.shadow.camera as THREE.OrthographicCamera;
    cam.left = -16;
    cam.right = 16;
    cam.top = 14;
    cam.bottom = -8;
    this.scene.add(this.dir);
    this.scene.add(this.dir.target);
    this.scene.add(this.wakeLight);
    this.scene.add(this.hero.group);
    this.sparks = new Sparks(this.scene, quality === "low" ? 80 : 160);
    this.makeBoltPool();
    this.resize();
    this.setQuality(quality);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    window.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("resize", this.resize);
    document.addEventListener("visibilitychange", this.onVis);
    if (this.qa) {
      window.__controlsTest = {
        getYaw: () => (this.facing > 0 ? Math.PI / 2 : -Math.PI / 2),
        getSpeed: () => Math.abs(this.p.vx),
        getX: () => this.p.x,
        getY: () => this.p.y,
        setKeys: (codes) => {
          this.forced = new Set(codes);
        },
        setSteer: (v) => {
          this.steer = v;
        },
      };
    }
    this.showMenu();
    this.raf = requestAnimationFrame(this.frame);
    window.__gameReady = true;
    this.onEvent({ type: "ready" });
  }

  setQuality(q: Quality) {
    this.quality = q;
    const dpr = window.devicePixelRatio || 1;
    const ratio = q === "low" ? 1 : q === "medium" ? Math.min(1.35, dpr) : Math.min(1.75, dpr);
    this.renderer.setPixelRatio(ratio);
    this.renderer.shadowMap.enabled = q !== "low";
    this.dir.castShadow = q !== "low";
    this.hero.light.intensity = q === "low" ? 1.25 : 2.15;
    this.resize();
  }

  setMix(music: number, sfx: number, muted: boolean) {
    this.audio.setMix(music, sfx, muted);
  }

  unlockAudio() {
    this.audio.unlock();
  }

  setPaused(v: boolean) {
    this.paused = v;
    if (!v) this.audio.resume();
  }

  setTouch(partial: Partial<TouchState>) {
    this.touch = { ...this.touch, ...partial };
    if (partial.x || partial.y) this.touch.using = true;
  }

  showMenu() {
    this.mode = "menu";
    this.paused = false;
    this.cine = null;
    this.boss = null;
    this.bossActive = false;
    this.clearWorld();
    this.buildDiorama();
    this.audio.setMode("menu");
    this.hero.group.position.set(0, 0, 0.35);
  }

  startLevel(opts: StartOpts) {
    this.opts = opts;
    this.cityName = opts.cityName;
    this.cityIndex = opts.cityIndex;
    this.areaIndex = opts.areaIndex;
    this.weapon = opts.weapon;
    this.cleared = opts.cleared;
    this.illums = opts.illums;
    this.mode = "play";
    this.paused = false;
    this.cine = null;
    this.boss = null;
    this.bossActive = false;
    this.hearts = 3;
    this.shield = 0;
    this.invuln = 0;
    this.starT = 0;
    this.jumpT = 0;
    this.magnetT = 0;
    this.flameT = 0;
    this.coins = 0;
    this.flames = 0;
    this.kills = 0;
    this.noDamage = true;
    this.runTime = 0;
    this.shootT = 0;
    this.p = { x: 2.4, y: 0.2, vx: 0, vy: 0, grounded: false, coyote: 0, airJumps: 1, ride: -1, land: 0 };
    this.cpX = 2.4;
    this.cpY = 0.2;
    this.facing = 1;
    this.clearWorld();
    const level = buildLevel(opts.cityId, opts.areaIndex);
    this.level = level;
    this.paintTheme(level.theme);
    this.buildSolids(level);
    this.buildSpawns(level);
    this.dress(level);
    this.diyaAwake = true;
    this.audio.setMode(level.boss && (level.bossTriggerX ?? 99) < 8 ? "boss" : "play");
    this.pushHud();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("visibilitychange", this.onVis);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.clearWorld();
    this.hero.dispose();
    this.audio.dispose();
    this.lib.box.dispose();
    this.lib.sphere.dispose();
    this.lib.coin.dispose();
    this.lib.flame.dispose();
    this.lib.bowl.dispose();
    this.lib.torus.dispose();
    this.renderer.dispose();
    if (this.qa) delete window.__controlsTest;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    this.keys.add(e.code);
    if (e.code === "Escape" && this.mode === "play" && !this.cine) this.onEvent({ type: "pause" });
  };
  private onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.code);
  private onBlur = () => {
    this.keys.clear();
    this.pointerDown = false;
  };
  private onVis = () => {
    if (document.visibilityState === "visible") this.audio.resume();
  };
  private onPointerMove = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
    this.mouseFresh = 1.4;
  };
  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    this.pointerDown = true;
    this.audio.unlock();
  };
  private onPointerUp = () => {
    this.pointerDown = false;
  };
  private resize = () => {
    const parent = this.canvas.parentElement ?? this.canvas;
    const w = Math.max(1, parent.clientWidth);
    const h = Math.max(1, parent.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.portrait = w < h;
    this.camera.fov = this.portrait ? 60 : 48;
    this.camera.updateProjectionMatrix();
  };

  private held(code: string) {
    return this.keys.has(code) || this.forced.has(code);
  }

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    if (!this.last) this.last = now;
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    const sim = this.mode === "play" && !this.paused;
    if (sim) {
      this.acc += dt;
      let steps = 0;
      const h = 1 / 60;
      while (this.acc >= h && steps < 5) {
        this.step(h);
        this.acc -= h;
        steps++;
      }
      this.fps = this.fps * 0.94 + (1 / Math.max(dt, 0.001)) * 0.06;
      this.playClock += dt;
      if (this.playClock > 4 && this.fps < 27 && this.quality !== "low" && !this.dropped) {
        this.dropped = true;
        this.setQuality(this.quality === "high" ? "medium" : "low");
      }
    } else {
      this.time += dt;
      this.acc = 0;
    }
    this.render(dt);
    if (!this.paused) this.audio.tick();
    this.hudAcc += dt;
    if (this.hudAcc > 0.1) {
      this.hudAcc = 0;
      this.pushHud();
    }
  };

  private step(dt: number) {
    this.time += dt;
    this.runTime += dt;
    this.mouseFresh = Math.max(0, this.mouseFresh - dt);
    if (this.cine && (this.cine.kind === "clear" || this.cine.kind === "dead")) {
      this.cine.t += dt;
      if (this.cine.t >= this.cine.dur) this.finishCine();
      return;
    }
    const locked = this.cine?.kind === "boss";
    if (locked && this.cine) {
      this.cine.t += dt;
      if (this.cine.t >= this.cine.dur) this.finishCine();
    }
    if (!locked) this.control(dt);
    this.simulate(dt, locked);
  }

  private control(dt: number) {
    let axis = 0;
    if (this.held("KeyA") || this.held("ArrowLeft")) axis -= 1;
    if (this.held("KeyD") || this.held("ArrowRight")) axis += 1;
    if (this.touch.using && Math.abs(this.touch.x) > 0.12) axis = this.touch.x;
    axis -= this.steer;
    axis = Math.max(-1, Math.min(1, axis));
    this.sprintHeld = this.held("ShiftLeft") || this.held("ShiftRight") || this.touch.sprint;
    const max = this.sprintHeld ? SPRINT : MOVE;
    const target = axis * max;
    const rate = axis === 0 ? (this.p.grounded ? 30 : 4) : this.p.grounded ? 48 : 22;
    this.p.vx = approach(this.p.vx, target, rate * dt);
    if (Math.abs(axis) > 0.2) this.facing = axis > 0 ? 1 : -1;
    const jumpDown = this.held("Space") || this.touch.jump;
    const edge = jumpDown && !this.prevJump;
    this.prevJump = jumpDown;
    if (this.p.grounded) this.p.coyote = 0.12;
    else this.p.coyote = Math.max(0, this.p.coyote - dt);
    const jumpV = JUMP * (this.jumpT > 0 ? 1.42 : 1);
    if (edge) {
      if (this.p.grounded || this.p.coyote > 0) {
        this.p.vy = jumpV;
        this.p.grounded = false;
        this.p.coyote = 0;
        this.p.airJumps = 1;
        this.p.ride = -1;
        this.audio.jump();
      } else if (this.p.airJumps > 0) {
        this.p.airJumps -= 1;
        this.p.vy = jumpV * 0.9;
        this.audio.jump();
        this.sparks.burst(this.p.x, this.p.y + 0.1, 0.4, 0xffe2a0, 8);
      }
    }
    if (!jumpDown && this.p.vy > 2) this.p.vy = Math.min(this.p.vy, 4.4);
    const g = GRAVITY * (this.held("ArrowDown") || this.touch.y < -0.65 ? 1.7 : 1);
    this.p.vy -= g * dt;
    if (this.p.vy < -18) this.p.vy = -18;
    this.aim(axis);
    this.shootHeld = this.pointerDown || this.touch.shoot || this.held("KeyF") || this.held("KeyJ");
    if (this.shootHeld && Math.abs(this.dirx) > 0.3) this.facing = this.dirx > 0 ? 1 : -1;
  }

  private aim(axis: number) {
    if (this.mouseFresh > 0 && !this.touch.using) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hit = this.raycaster.ray.intersectPlane(this.aimPlane, this.hit);
      if (hit) {
        const dx = hit.x - this.p.x;
        const dy = hit.y - (this.p.y + 1.3);
        const m = Math.hypot(dx, dy) || 1;
        this.dirx = dx / m;
        this.diry = dy / m;
        return;
      }
    }
    const up = this.held("ArrowUp") || this.touch.y > 0.55;
    if (up && Math.abs(axis) < 0.35) {
      this.dirx = 0;
      this.diry = 1;
    } else if (up) {
      this.dirx = this.facing * 0.7;
      this.diry = 0.72;
      const m = Math.hypot(this.dirx, this.diry);
      this.dirx /= m;
      this.diry /= m;
    } else {
      this.dirx = this.facing;
      this.diry = 0;
    }
  }

  private simulate(dt: number, locked: boolean) {
    const level = this.level;
    if (!level) return;
    this.syncSolids(dt);
    if (!locked) {
      if (this.p.ride >= 0) {
        const s = level.solids[this.p.ride];
        if (s && !s.dead) {
          this.p.x += s.dx ?? 0;
          this.p.y += s.dy ?? 0;
        }
      }
      this.moveX(dt);
      this.moveY(dt);
      this.afterMove(dt);
      if (this.shootHeld) this.tryShoot(dt);
      else this.shootT = Math.max(0, this.shootT - dt);
    }
    this.updateFoes(dt);
    this.updateBoss(dt);
    this.updateBolts(dt);
    this.updatePickups(dt);
    this.updateWaves(dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.starT = Math.max(0, this.starT - dt);
    this.jumpT = Math.max(0, this.jumpT - dt);
    this.magnetT = Math.max(0, this.magnetT - dt);
    this.flameT = Math.max(0, this.flameT - dt);
    this.p.land = Math.max(0, this.p.land - dt);
    if (!this.cine && !this.bossActive && this.p.x >= level.goalX && this.p.grounded) this.beginClear();
    if (!this.boss && level.boss && level.bossTriggerX !== null && this.p.x > level.bossTriggerX) this.beginBoss();
    this.spreadLight(dt);
  }

  private syncSolids(dt: number) {
    const level = this.level;
    if (!level) return;
    for (const s of level.solids) {
      s.dx = 0;
      s.dy = 0;
      if (s.dead) continue;
      if (s.kind === "moving" && s.baseX !== undefined && s.baseY !== undefined) {
        const w = this.time * (s.speed ?? 1) + (s.phase ?? 0);
        const nx = s.axis === "y" ? s.baseX : s.baseX + Math.sin(w) * (s.amp ?? 1);
        const ny = s.axis === "y" ? s.baseY + Math.sin(w) * (s.amp ?? 1) : s.baseY;
        s.dx = nx - s.x;
        s.dy = ny - s.y;
        s.x = nx;
        s.y = ny;
      } else if (s.kind === "crumble" && s.falling) {
        s.vy = (s.vy ?? 0) + 30 * dt;
        s.dy = -(s.vy ?? 0) * dt;
        s.y += s.dy ?? 0;
        if (s.y < -14) s.dead = true;
      }
    }
  }

  private overlap(x: number, y: number, s: Solid) {
    if (s.dead) return false;
    return x + PW / 2 > s.x - s.w / 2 && x - PW / 2 < s.x + s.w / 2 && y + PH > s.y - s.h / 2 && y < s.y + s.h / 2;
  }

  private moveX(dt: number) {
    this.p.x += this.p.vx * dt;
    const solids = this.level?.solids ?? [];
    for (const s of solids) {
      if (!this.overlap(this.p.x, this.p.y, s)) continue;
      const top = s.y + s.h / 2;
      if (this.p.y >= top - 0.46 && this.p.y <= top + 0.05 && this.p.vy <= 2) {
        this.p.y = top;
        continue;
      }
      if (this.p.vx > 0) this.p.x = s.x - s.w / 2 - PW / 2 - 0.002;
      else if (this.p.vx < 0) this.p.x = s.x + s.w / 2 + PW / 2 + 0.002;
      else this.p.x += this.p.x < s.x ? -0.02 : 0.02;
      this.p.vx = 0;
    }
    const level = this.level;
    if (level) this.p.x = Math.max(0.6, Math.min(level.length - 0.8, this.p.x));
  }

  private moveY(dt: number) {
    const prev = this.p.y;
    this.p.y += this.p.vy * dt;
    this.p.grounded = false;
    let ride = -1;
    const solids = this.level?.solids ?? [];
    for (let i = 0; i < solids.length; i++) {
      const s = solids[i]!;
      if (!this.overlap(this.p.x, this.p.y, s)) continue;
      const top = s.y + s.h / 2;
      const bot = s.y - s.h / 2;
      if (this.p.vy <= 0 && prev >= top - 0.12) {
        this.p.y = top;
        if (s.kind === "bounce") {
          this.p.vy = this.jumpT > 0 ? 14.2 : 12.3;
          this.p.vx = Math.max(this.p.vx, 6.6);
          this.p.grounded = false;
          this.p.airJumps = 1;
          this.audio.jump();
        } else {
          const impact = this.p.vy;
          this.p.vy = 0;
          this.p.grounded = true;
          this.p.airJumps = 1;
          ride = i;
          if (impact < -8) this.p.land = 0.12;
        }
      } else if (this.p.vy > 0 && prev + PH <= bot + 0.12) {
        this.p.y = bot - PH - 0.002;
        this.p.vy = 0;
        if (s.kind === "break") this.chip(s, 1);
      }
    }
    this.p.ride = ride;
  }

  private afterMove(dt: number) {
    const solids = this.level?.solids ?? [];
    if (this.p.ride >= 0) {
      const s = solids[this.p.ride];
      if (s?.kind === "crumble" && !s.falling) {
        s.fall = (s.fall ?? 0) + dt;
        if ((s.fall ?? 0) > 0.45) s.falling = true;
      }
      if (s?.kind === "pulse") {
        const period = s.period ?? 2.2;
        const duty = s.duty ?? 0.4;
        const on = (this.time + (s.phase ?? 0)) % period < period * duty;
        if (on) this.damage(1);
      }
    }
    for (const s of solids) {
      if (s.kind === "crumble" && !s.falling && this.p.ride !== solids.indexOf(s)) s.fall = 0;
    }
    if (this.p.grounded && this.p.x > this.cpX + 16) {
      this.cpX = this.p.x;
      this.cpY = this.p.y;
    }
    if (this.p.y < -7.5 && !this.cine) {
      this.damage(1);
      if (!this.cine) {
        this.p.x = this.cpX;
        this.p.y = this.cpY + 0.2;
        this.p.vx = 0;
        this.p.vy = 0;
      }
    }
  }

  private chip(s: Solid, dmg: number) {
    s.hp = (s.hp ?? 3) - dmg;
    this.sparks.burst(s.x, s.y, 0.4, 0xe7b04a, 6);
    if ((s.hp ?? 0) <= 0) {
      s.dead = true;
      this.audio.hit();
    }
  }

  private tryShoot(dt: number) {
    this.shootT -= dt;
    if (this.shootT > 0) return;
    const lvl = this.flameT > 0 ? 5 : this.weapon;
    const cool = [0.28, 0.28, 0.32, 0.38, 0.5, 0.55][lvl] ?? 0.3;
    this.shootT = cool;
    const ox = this.p.x + this.dirx * 0.55;
    const oy = this.p.y + 1.3 + this.diry * 0.2;
    const spawn = (dx: number, dy: number, speed: number, dmg: number, r: number, hits: number, explode: boolean) => {
      const m = Math.hypot(dx, dy) || 1;
      this.spawnBolt(ox, oy, (dx / m) * speed, (dy / m) * speed, dmg, r, true, hits, explode);
    };
    if (lvl <= 1) spawn(this.dirx, this.diry, 18, 1, 0.16, 1, false);
    else if (lvl === 2) {
      const px = -this.diry;
      const py = this.dirx;
      spawn(this.dirx + px * 0.08, this.diry + py * 0.08, 18, 1, 0.14, 1, false);
      spawn(this.dirx - px * 0.08, this.diry - py * 0.08, 18, 1, 0.14, 1, false);
    } else if (lvl === 3) spawn(this.dirx, this.diry, 22, 2, 0.24, 3, false);
    else if (lvl === 4) spawn(this.dirx, this.diry, 13, 3, 0.32, 1, true);
    else {
      spawn(this.dirx, this.diry, 17, 2, 0.2, 4, false);
      spawn(this.dirx - this.diry * 0.45, this.diry + this.dirx * 0.45, 16, 2, 0.18, 2, false);
      spawn(this.dirx + this.diry * 0.45, this.diry - this.dirx * 0.45, 16, 2, 0.18, 2, false);
    }
    this.audio.shoot();
    this.sparks.burst(ox, oy, 0.45, 0xffe6b0, 5);
  }

  private spawnBolt(x: number, y: number, vx: number, vy: number, dmg: number, r: number, friendly: boolean, hits: number, explode: boolean) {
    const bolt = this.bolts.find((b) => !b.alive);
    if (!bolt) return;
    bolt.x = x;
    bolt.y = y;
    bolt.vx = vx;
    bolt.vy = vy;
    bolt.life = explode ? 1.3 : 1.15;
    bolt.dmg = dmg;
    bolt.r = r;
    bolt.friendly = friendly;
    bolt.hits = hits;
    bolt.alive = true;
    bolt.explode = explode;
    bolt.seen = [];
    bolt.mesh.visible = true;
    bolt.mesh.scale.setScalar(r * 6);
    (bolt.mesh.material as THREE.MeshBasicMaterial).color.set(friendly ? (explode ? 0xff8a3a : 0xffe29a) : 0xe25a24);
  }

  private updateBolts(dt: number) {
    const solids = this.level?.solids ?? [];
    for (const b of this.bolts) {
      if (!b.alive) continue;
      b.life -= dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.life <= 0) {
        if (b.explode) this.explode(b);
        b.alive = false;
        continue;
      }
      if (b.friendly) {
        for (const s of solids) {
          if (s.dead || s.kind !== "break") continue;
          if (Math.abs(b.x - s.x) < s.w / 2 + b.r && Math.abs(b.y - s.y) < s.h / 2 + b.r) {
            this.chip(s, b.dmg);
            b.hits -= 1;
            if (b.hits <= 0) {
              if (b.explode) this.explode(b);
              b.alive = false;
            }
          }
        }
        for (let i = 0; i < this.foes.length; i++) {
          const f = this.foes[i]!;
          if (!f.alive || b.seen.includes(i)) continue;
          if (this.hitFoe(f, b)) {
            b.seen.push(i);
            b.hits -= 1;
            if (b.hits <= 0) {
              if (b.explode) this.explode(b);
              b.alive = false;
              break;
            }
          }
        }
        if (b.alive && this.boss) {
          const boss = this.boss;
          if (b.x > boss.x - boss.w / 2 && b.x < boss.x + boss.w / 2 && b.y > boss.y && b.y < boss.y + boss.h) {
            this.hurtBoss(b.dmg);
            if (b.explode) this.explode(b);
            b.alive = false;
          }
        }
      } else if (Math.hypot(b.x - this.p.x, b.y - (this.p.y + 1.0)) < 0.65 + b.r) {
        this.damage(1);
        b.alive = false;
      }
    }
  }

  private hitFoe(f: Foe, b: Bolt) {
    const cx = f.x;
    const cy = f.y + f.h * 0.5;
    if (Math.hypot(b.x - cx, b.y - cy) > f.w * 0.5 + b.r) return false;
    this.wound(f, b.dmg);
    return true;
  }

  private explode(b: Bolt) {
    this.sparks.burst(b.x, b.y, 0.4, 0xff8a3a, 16);
    this.shakeMag = Math.min(0.4, this.shakeMag + 0.12);
    for (const f of this.foes) {
      if (!f.alive) continue;
      if (Math.hypot(f.x - b.x, f.y + f.h * 0.5 - b.y) < 1.7) this.wound(f, 2);
    }
    if (this.boss && Math.hypot(this.boss.x - b.x, this.boss.y + 1.4 - b.y) < 2.2) this.hurtBoss(2);
  }

  private wound(f: Foe, dmg: number) {
    if (!f.alive) return;
    f.hp -= dmg;
    f.hurt = 0.12;
    this.audio.hit();
    this.sparks.burst(f.x, f.y + f.h * 0.6, 0.4, 0xffd27a, 8);
    if (f.hp <= 0) {
      f.alive = false;
      f.mesh.visible = false;
      this.kills += 1;
      this.shakeMag = Math.min(0.35, this.shakeMag + 0.08);
      this.sparks.burst(f.x, f.y + 0.6, 0.4, 0xe7b04a, 14);
    }
  }

  private hurtBoss(dmg: number) {
    if (!this.boss) return;
    this.boss.hp -= dmg;
    this.shakeMag = Math.min(0.5, this.shakeMag + 0.1);
    this.audio.hit();
    this.sparks.burst(this.boss.x, this.boss.y + this.boss.h * 0.55, 0.5, 0xffe2a0, 10);
    const phase = this.boss.hp > this.boss.max * 0.66 ? 1 : this.boss.hp > this.boss.max * 0.33 ? 2 : 3;
    this.boss.phase = phase;
    if (this.boss.hp <= 0) {
      this.sparks.burst(this.boss.x, this.boss.y + 1.5, 0.5, 0xfff1c2, 28);
      this.boss.mesh.visible = false;
      this.kills += 1;
      this.boss = null;
      this.beginClear();
    }
  }

  private updateFoes(dt: number) {
    for (const f of this.foes) {
      if (!f.alive) continue;
      f.hurt = Math.max(0, f.hurt - dt);
      f.cool -= dt;
      const chase = Math.abs(this.p.x - f.x) < (f.fly ? 11 : 6.5) && Math.abs(this.p.y - f.y) < 2.4;
      if (chase) f.dir = Math.sign(this.p.x - f.x) || f.dir;
      const speed = f.fly ? 2.4 : f.kind === "guardian" ? 1.6 : f.kind === "smoke" ? 1.35 : 2.2;
      f.x += f.dir * speed * dt;
      if (f.x < f.left || f.x > f.right) {
        f.dir *= -1;
        f.x = Math.max(f.left, Math.min(f.right, f.x));
      }
      if (f.fly) {
        f.y += Math.sin(this.time * 3 + f.x) * 0.6 * dt;
        const inRange =
          Math.abs(this.p.x - f.x) < FOE_FIRE_RANGE && Math.abs(this.p.y - f.y) < FIRE_MAX_DY && this.onScreen(f.x, f.y + 0.5);
        let fire = false;
        if (f.wind && f.wind > 0) {
          f.wind -= dt;
          if (!inRange) f.wind = 0;
          else if (f.wind <= 0) {
            f.wind = 0;
            fire = true;
          }
        } else if (f.cool <= 0 && inRange) {
          f.wind = FOE_WINDUP;
          this.sparks.burst(f.x, f.y + 0.9, 0.2, 0xffb03a, 6);
        }
        if (fire) {
          f.cool = 1.9;
          const dx = this.p.x - f.x;
          const dy = this.p.y + 0.8 - (f.y + 0.4);
          const m = Math.hypot(dx, dy) || 1;
          this.spawnBolt(f.x, f.y + 0.5, (dx / m) * 7.5, (dy / m) * 7.5, 1, 0.16, false, 1, false);
        }
      } else {
        f.vy -= GRAVITY * dt;
        f.y += f.vy * dt;
        for (const s of this.level?.solids ?? []) {
          if (s.dead) continue;
          const top = s.y + s.h / 2;
          if (f.x > s.x - s.w / 2 && f.x < s.x + s.w / 2 && f.y <= top && f.y >= top - 0.45 && f.vy <= 0) {
            f.y = top;
            f.vy = 0;
          }
        }
        if (f.y < -6) f.alive = false;
      }
      const near = Math.abs(this.p.x - f.x) < f.w * 0.45 + 0.22 && this.p.y < f.y + f.h && this.p.y + PH > f.y;
      if (near) {
        if (this.starT > 0) this.wound(f, 9);
        else if (f.cool <= 0) {
          f.cool = 0.7;
          this.damage(1, f.x);
        }
      }
      animateActor(f.mesh, this.time, f.kind);
      const fw = f.wind && f.wind > 0 ? 1 - f.wind / FOE_WINDUP : 0;
      f.mesh.scale.setScalar(1 + fw * 0.18 + (fw > 0 ? Math.sin(this.time * 40) * 0.04 : 0));
      f.mesh.position.set(f.x, f.y, 0.15);
      f.mesh.rotation.y = f.dir > 0 ? Math.PI / 2 - FACE_TURN : -Math.PI / 2 + FACE_TURN;
      f.mesh.visible = f.alive && (f.hurt <= 0 || Math.sin(this.time * 45) > 0);
    }
  }

  private updateBoss(dt: number) {
    const boss = this.boss;
    if (!boss || !this.bossActive) return;
    boss.cool -= dt;
    const phase = boss.phase;
    if (boss.dash > 0) {
      boss.dash -= dt;
      boss.x += boss.dir * 7.5 * dt;
    } else if (phase >= 3 && boss.cool < 0.2 && Math.random() < dt * 0.4) {
      boss.dir = Math.sign(this.p.x - boss.x) || 1;
      boss.dash = 0.55;
      this.shakeMag = Math.min(0.45, this.shakeMag + 0.15);
    }
    const minX = 3;
    const maxX = (this.level?.length ?? 30) - 4;
    boss.x = Math.max(minX, Math.min(maxX, boss.x));
    const bossInRange =
      Math.abs(this.p.x - boss.x) < BOSS_FIRE_RANGE && Math.abs(this.p.y - boss.y) < FIRE_MAX_DY + 2 && this.onScreen(boss.x, boss.y + boss.h * 0.6);
    if (boss.cool <= 0 && bossInRange && !(boss.wind && boss.wind > 0) && boss.wind !== -1) {
      boss.wind = BOSS_WINDUP;
      this.sparks.burst(boss.x, boss.y + boss.h * 0.62, 0.35, 0xffb03a, 10);
    }
    if (boss.wind && boss.wind > 0) {
      boss.wind -= dt;
      if (boss.wind <= 0) boss.wind = -1;
    }
    if (boss.wind === -1) {
      boss.wind = 0;
      boss.cool = phase === 1 ? 1.55 : phase === 2 ? 1.15 : 0.85;
      const dx = this.p.x - boss.x;
      const dy = this.p.y + 0.9 - (boss.y + boss.h * 0.6);
      const m = Math.hypot(dx, dy) || 1;
      this.spawnBolt(boss.x, boss.y + boss.h * 0.62, (dx / m) * 8.2, (dy / m) * 8.2, 1, 0.2, false, 1, false);
      if (phase >= 2 && boss.cool > 0.5) {
        this.waves.push({ x: boss.x, r: 0.4, life: 1.3, mesh: this.makeWave() });
      }
      if (phase >= 3 && this.foes.filter((f) => f.alive).length < 2) this.spawnFoe("shadow", boss.x - boss.dir * 1.5, 0.2);
    }
    const touch = Math.abs(this.p.x - boss.x) < boss.w * 0.36 && this.p.y < boss.y + boss.h && this.p.y + PH > boss.y;
    if (touch) this.damage(1, boss.x);
    animateActor(boss.mesh, this.time, this.level?.titan ? "titan" : "boss");
    boss.mesh.position.set(boss.x, boss.y, 0);
    const bw = boss.wind && boss.wind > 0 ? 1 - boss.wind / BOSS_WINDUP : 0;
    boss.mesh.scale.setScalar(1 + bw * 0.1);
    boss.mesh.rotation.y = this.p.x < boss.x ? -Math.PI / 2 + FACE_TURN : Math.PI / 2 - FACE_TURN;
  }

  private updateWaves(dt: number) {
    for (const w of this.waves) {
      w.life -= dt;
      w.r += dt * 7;
      w.mesh.position.set(w.x, 0.08, 0.2);
      w.mesh.scale.setScalar(w.r);
      (w.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, w.life);
      w.mesh.visible = w.life > 0;
      if (w.life > 0 && this.p.grounded && Math.abs(this.p.x - w.x) < w.r && Math.abs(this.p.x - w.x) > w.r - 0.85 && this.p.y < 1.05) {
        this.damage(1);
      }
    }
    this.waves = this.waves.filter((w) => w.life > 0);
  }

  private updatePickups(dt: number) {
    for (const p of this.pickups) {
      if (!p.alive) continue;
      if (this.magnetT > 0 && (p.kind === "coin" || p.kind === "flame")) {
        const dx = this.p.x - p.x;
        const dy = this.p.y + 0.8 - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 4.4 && d > 0.05) {
          p.x += (dx / d) * 9 * dt;
          p.y += (dy / d) * 9 * dt;
        }
      }
      const reach = Math.hypot(p.x - this.p.x, p.y - (this.p.y + 0.7));
      if (reach < 0.72) this.collect(p);
      p.mesh.position.set(p.x, p.base + Math.sin(this.time * 3 + p.x) * 0.12, 0.4);
      p.mesh.rotation.y = this.time * 2;
    }
    void dt;
  }

  private collect(p: Pickup) {
    if (!p.alive) return;
    p.alive = false;
    p.mesh.visible = false;
    if (p.kind === "coin") {
      this.coins += 1;
      this.audio.coin();
      this.sparks.burst(p.x, p.y, 0.4, 0xe7b04a, 6);
    } else if (p.kind === "flame") {
      this.flames += 1;
      this.audio.flame();
      this.sparks.burst(p.x, p.y, 0.4, 0xffb03a, 10);
      this.shakeMag = Math.min(0.2, this.shakeMag + 0.05);
      this.igniteStreet(p.x);
    } else this.grant(p.sub);
  }

  private grant(id: string) {
    this.audio.flame();
    if (id === "star") this.starT = 8;
    else if (id === "mega") {
      this.weapon = Math.min(5, this.weapon + 1);
      this.onEvent({ type: "weapon", level: this.weapon });
    } else if (id === "shield") this.shield = 3;
    else if (id === "jump") this.jumpT = 12;
    else if (id === "magnet") this.magnetT = 12;
    else if (id === "life") this.hearts = Math.min(this.maxHearts, this.hearts + 1);
    else if (id === "flame") this.flameT = 10;
    this.sparks.burst(this.p.x, this.p.y + 1, 0.4, 0xfff1c2, 12);
  }

  private tmpV = new THREE.Vector3();
  /** True when a world point projects inside the camera view (with a small margin). */
  private onScreen(x: number, y: number) {
    const v = this.tmpV.set(x, y, 0).project(this.camera);
    return v.z < 1 && Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95;
  }

  private damage(n: number, fromX?: number) {
    if (this.invuln > 0 || this.starT > 0 || this.cine) return;
    if (this.shield > 0) {
      this.shield -= 1;
      this.invuln = 0.45;
      this.audio.hurt();
      return;
    }
    this.hearts -= n;
    this.noDamage = false;
    this.invuln = 1.4;
    this.shakeMag = Math.min(0.5, this.shakeMag + 0.22);
    this.p.vy = 6.5;
    this.p.vx = (fromX !== undefined ? Math.sign(this.p.x - fromX) || -this.facing : -this.facing) * 3.5;
    this.audio.hurt();
    if (this.hearts <= 0) {
      this.hearts = 0;
      this.cine = { kind: "dead", t: 0, dur: 0.85 };
    }
  }

  private beginClear() {
    if (this.cine?.kind === "clear") return;
    this.cine = { kind: "clear", t: 0, dur: 2.15 };
    this.shakeMag = Math.min(0.3, this.shakeMag + 0.12);
    this.diyaAwake = true;
    this.lightReach = 9999;
    for (const f of this.facades) {
      f.target = 1;
      f.lit = 1;
    }
    this.wakeLight.intensity = this.quality === "low" ? 1.15 : 2.15;
    this.wakeLight.position.set(this.p.x, 3.5, -5);
    for (const m of this.landmarkMats) m.emissiveIntensity = 0.7;
    this.paintFacades();
    this.audio.win();
  }

  private beginBoss() {
    const level = this.level;
    if (!level || this.boss) return;
    const titan = level.titan;
    const stats = actorStats(titan ? "titan" : "boss");
    const mesh = makeActor(titan ? "titan" : "boss");
    this.levelGroup.add(mesh);
    const hp = Math.round(stats.hp * (titan ? 1 : 1 + this.cityIndex * 0.035));
    this.boss = {
      name: level.bossName,
      hp,
      max: hp,
      phase: 1,
      x: Math.min(level.length - 5, Math.max(this.p.x + 8, level.length * 0.72)),
      y: 0,
      w: stats.w,
      h: stats.h,
      cool: 1.2,
      dash: 0,
      dir: -1,
      mesh,
    };
    this.cine = { kind: "boss", t: 0, dur: 1.8 };
    this.shakeMag = 0.4;
    this.audio.setMode("boss");
    this.onEvent({ type: "boss", name: level.bossName });
  }

  private finishCine() {
    const kind = this.cine?.kind;
    this.cine = null;
    if (kind === "boss") {
      this.bossActive = true;
      return;
    }
    this.paused = true;
    if (kind === "clear") {
      this.onEvent({ type: "cleared", payload: this.makePayload() });
    } else if (kind === "dead") {
      this.audio.defeat();
      this.onEvent({ type: "down" });
    }
  }

  private makePayload(): ClearPayload {
    const level = this.level!;
    const illum = Math.round(Math.max(this.areaIllum(), this.cine ? 1 : 0) * 100);
    const timeBonus = Math.max(0, 220 - Math.floor(this.runTime)) * 2;
    const score = this.coins * 10 + this.flames * 100 + this.kills * 50 + timeBonus + (this.noDamage ? 500 : 0);
    const areas = this.cleared.length || 1;
    const cityDone = this.areaIndex >= areas - 1;
    return {
      cityId: level.cityId,
      cityName: this.cityName,
      areaIndex: this.areaIndex,
      areaName: level.name,
      score,
      time: this.runTime,
      illum: this.boss === null && level.boss ? 100 : illum,
      noDamage: this.noDamage,
      cityDone,
      final: level.titan,
      best: score,
      coins: this.coins,
    };
  }

  private areaIllum() {
    if (this.cine?.kind === "clear") return 1;
    if (this.facades.length) {
      let sum = 0;
      for (const f of this.facades) sum += f.lit;
      return sum / this.facades.length;
    }
    const flames = this.pickups.filter((p) => p.kind === "flame");
    const coins = this.pickups.filter((p) => p.kind === "coin");
    const f = flames.length ? flames.filter((p) => !p.alive).length / flames.length : 1;
    const c = coins.length ? coins.filter((p) => !p.alive).length / coins.length : 1;
    const e = this.foeTotal ? Math.min(1, this.kills / this.foeTotal) : 1;
    return Math.max(0, Math.min(1, f * 0.62 + c * 0.23 + e * 0.15));
  }

  private igniteStreet(x: number) {
    this.diyaAwake = true;
    const reach = Math.max(this.lightReach, Math.max(this.p.x, x) + 4.2);
    this.lightReach = reach;
    for (const f of this.facades) {
      if (f.target >= 1 || f.x > reach) continue;
      f.target = 1;
      this.sparks.burst(f.x, 2.6, -1.5, 0xffd27a, 8);
    }
  }

  private spreadLight(dt: number) {
    if (this.diyaAwake) {
      const tip = this.p.x + 1.15;
      if (tip > this.lightReach) this.lightReach = tip;
    }
    let dirty = false;
    for (const f of this.facades) {
      if (this.diyaAwake && f.target < 1 && f.x <= this.lightReach) {
        f.target = 1;
        this.sparks.burst(f.x, 2.6, -1.5, 0xffd27a, 6);
        dirty = true;
      }
      const next = approach(f.lit, f.target, dt * 2.4);
      if (Math.abs(next - f.lit) > 0.012) {
        f.lit = next;
        dirty = true;
      } else if (f.lit !== f.target) {
        f.lit = f.target;
        dirty = true;
      }
    }
    const want = this.diyaAwake ? (this.quality === "low" ? 1.15 : 2.15) : 0;
    if (this.mode === "play") {
      this.wakeLight.intensity = approach(this.wakeLight.intensity, want, dt * 3.2);
      if (this.diyaAwake) this.wakeLight.position.set(Math.min(this.lightReach, this.p.x + 2.2), 3.5, -5.2);
    }
    const glow = this.diyaAwake && this.landmarkX <= this.lightReach + 1.5 ? 0.7 : 0.08;
    for (const m of this.landmarkMats) {
      if (Math.abs(m.emissiveIntensity - glow) > 0.03) m.emissiveIntensity = glow;
    }
    if (dirty || Math.abs(this.lightReach - this.paintedReach) > 0.35) {
      this.paintedReach = this.lightReach;
      this.paintFacades();
    }
  }

  private spawnFoe(kind: EnemyKind, x: number, y: number) {
    const stats = actorStats(kind);
    const mesh = makeActor(kind);
    this.levelGroup.add(mesh);
    const foe: Foe = {
      kind,
      x,
      y,
      vy: 0,
      hp: stats.hp,
      dir: Math.random() > 0.5 ? 1 : -1,
      left: x - 2.5,
      right: x + 2.6,
      cool: 0.4,
      hurt: 0,
      alive: true,
      fly: stats.fly,
      w: stats.w,
      h: stats.h,
      mesh,
    };
    this.foes.push(foe);
    return foe;
  }

  private render(dt: number) {
    this.shakeMag *= Math.exp(-3.2 * Math.max(dt, 0.001));
    const shooting = this.shootHeld && this.mode === "play" && !this.cine;
    const along = this.dirx * this.facing;
    const aim = Math.atan2(this.diry, Math.max(0.08, along));
    this.hero.update({
      time: this.time,
      vx: this.mode === "play" ? this.p.vx : 0,
      vy: this.p.vy,
      grounded: this.mode === "play" ? this.p.grounded : true,
      sprint: this.sprintHeld,
      shooting,
      aim,
      hurt: this.invuln > 0 && this.hearts > 0 ? this.invuln : 0,
      victory: this.cine?.kind === "clear",
      defeat: this.cine?.kind === "dead" || (this.hearts <= 0 && this.mode === "play"),
      land: this.p.land,
      facing: this.facing,
    });
    if (this.mode === "play") {
      const blink = this.invuln > 0 && Math.sin(this.time * 28) > 0;
      this.hero.group.visible = !blink;
      this.hero.group.position.set(this.p.x, this.p.y + this.hero.bobY, 0.35);
      const lookX = THREE.MathUtils.clamp(this.p.x + this.facing * 1.6, 1, (this.level?.length ?? 20) - 1);
      const lookY = this.p.y + 1.45;
      const dist = this.portrait ? 17.5 : this.cine?.kind === "boss" ? 18 : 13.8;
      const lift = this.cine?.kind === "clear" ? 2.4 : this.cine?.kind === "boss" ? 2.2 : 1.45;
      this.desired.set(lookX, lookY + lift, dist);
      this.look.set(lookX, lookY, 0);
    } else {
      this.hero.group.visible = true;
      this.hero.group.position.set(0.2, this.hero.bobY, 0.35);
      const a = this.time * 0.18;
      this.desired.set(Math.sin(a) * 1.6, 2.5, 9.4);
      this.look.set(0.2, 1.5, 0);
    }
    const k = 1 - Math.exp(-3.4 * Math.max(dt, 0.001));
    this.camera.position.lerp(this.desired, k);
    this.camera.position.x += Math.sin(this.time * 43) * this.shakeMag;
    this.camera.position.y += Math.cos(this.time * 37) * this.shakeMag * 0.6;
    this.camera.lookAt(this.look);
    this.dir.position.set(this.camera.position.x + 8, 18, 12);
    this.dir.target.position.set(this.look.x, 0, 0);
    this.dir.target.updateMatrixWorld();
    if (this.level) {
      for (let i = 0; i < this.level.solids.length; i++) {
        const s = this.level.solids[i]!;
        const mesh = this.solidMeshes[i];
        if (!mesh) continue;
        mesh.visible = !s.dead;
        mesh.position.set(s.x, s.y, 0);
        if (s.kind === "pulse") {
          const period = s.period ?? 2.2;
          const on = (this.time + (s.phase ?? 0)) % period < period * (s.duty ?? 0.4);
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissive.set(on ? 0xe25a24 : 0x3a2418);
          mat.emissiveIntensity = on ? 0.9 : 0.15;
        }
      }
    }
    for (const b of this.bolts) {
      b.mesh.visible = b.alive;
      if (!b.alive) continue;
      b.mesh.position.set(b.x, b.y, 0.45);
    }
    this.sparks.update(dt);
    this.renderer.render(this.scene, this.camera);
  }

  private pushHud() {
    const n = Math.max(1, this.cleared.length || this.level?.solids.length ? this.cleared.length || 1 : 1);
    const areas = this.cleared.length || 1;
    let sum = 0;
    for (let i = 0; i < areas; i++) sum += i === this.areaIndex && this.mode === "play" ? this.areaIllum() * 100 : (this.illums[i] ?? 0);
    const power = this.starT > 0 ? "Golden Star" : this.flameT > 0 ? "Flame Power" : this.jumpT > 0 ? "Super Jump" : this.magnetT > 0 ? "Light Magnet" : this.shield > 0 ? "Light Shield" : null;
    const hint =
      this.mode === "play" && this.opts?.cityId === "gurugram" && this.areaIndex === 0 && this.runTime < 8
        ? "Buildings light as Goranksh crosses them. Touch a street diya to flare the block."
        : null;
    const hud: Hud = {
      mode: this.mode,
      hearts: this.hearts,
      maxHearts: this.maxHearts,
      weapon: this.weapon,
      score: this.coins * 10 + this.flames * 100 + this.kills * 50,
      illum: this.mode === "play" ? Math.round(this.areaIllum() * 100) : Math.round(sum / areas),
      areasDone: this.cleared.filter(Boolean).length,
      areasTotal: areas,
      areaName: this.level?.name ?? "",
      cityName: this.cityName,
      boss: this.boss && this.bossActive ? { name: this.boss.name, hp: Math.max(0, this.boss.hp), max: this.boss.max, phase: this.boss.phase } : null,
      time: this.runTime,
      shield: this.shield,
      star: this.starT > 0,
      power,
      hint,
      noDamage: this.noDamage,
    };
    this.onHud(hud);
    void n;
  }

  private skyTex: THREE.Texture | null = null;
  /** Night-sky gradient with stars, a warm moon and a festive horizon glow. */
  private skyTexture(theme: Theme) {
    this.skyTex?.dispose();
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const top = new THREE.Color(theme.sky).multiplyScalar(0.35);
    const mid = new THREE.Color(theme.sky);
    const low = new THREE.Color(theme.sky).lerp(new THREE.Color("#e2742a"), 0.45);
    const grd = ctx.createLinearGradient(0, 0, 0, 512);
    grd.addColorStop(0, `#${top.getHexString()}`);
    grd.addColorStop(0.55, `#${mid.getHexString()}`);
    grd.addColorStop(1, `#${low.getHexString()}`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 512);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 110; i++) {
      const x = rnd() * 512;
      const y = rnd() * 330;
      const r = rnd() * 0.6 + 0.2;
      ctx.fillStyle = `rgba(255,${230 + Math.floor(rnd() * 25)},${190 + Math.floor(rnd() * 60)},${0.35 + rnd() * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const moon = ctx.createRadialGradient(400, 90, 0, 400, 90, 70);
    moon.addColorStop(0, "rgba(255,236,200,0.95)");
    moon.addColorStop(0.28, "rgba(255,220,160,0.75)");
    moon.addColorStop(0.32, "rgba(255,200,130,0.25)");
    moon.addColorStop(1, "rgba(255,180,90,0)");
    ctx.fillStyle = moon;
    ctx.fillRect(300, 0, 212, 200);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.skyTex = tex;
    return tex;
  }

  private paintTheme(theme: Theme) {
    this.scene.background = this.skyTexture(theme);
    this.scene.fog = new THREE.Fog(theme.fog, 18, this.portrait ? 46 : 62);
    this.hemi.color.set(theme.sky);
    this.hemi.groundColor.set(theme.ground);
  }

  private clearWorld() {
    this.scene.remove(this.levelGroup);
    for (const m of this.trashMat) m.dispose();
    for (const g of this.trashGeo) g.dispose();
    for (const t of this.trashTex) t.dispose();
    this.trashMat = [];
    this.trashGeo = [];
    this.trashTex = [];
    this.levelGroup = new THREE.Group();
    this.scene.add(this.levelGroup);
    this.solidMeshes = [];
    this.foes = [];
    this.foeTotal = 0;
    this.pickups = [];
    this.waves = [];
    this.windows = null;
    this.bodies = null;
    this.facades = [];
    this.lampRecs = [];
    this.lampMeshes = [];
    this.diyaAwake = false;
    this.lightReach = -999;
    this.paintedReach = -1000;
    this.landmarkMats = [];
    this.landmarkX = 0;
    this.wakeLight.intensity = 0;
    this.boss = null;
    for (const b of this.bolts) {
      b.alive = false;
      b.mesh.visible = false;
    }
  }

  private buildDiorama() {
    const theme: Theme = {
      sky: "#241848",
      fog: "#120e22",
      ground: "#2a3344",
      road: "#3c4a60",
      roof: "#2a3344",
      glass: "#8eafc4",
      foliage: "#1d3b34",
      accent: "#e7b04a",
      building: "#1b2433",
    };
    this.paintTheme(theme);
    const mat = new THREE.MeshStandardMaterial({ color: theme.road, roughness: 0.86 });
    this.trashMat.push(mat);
    const ground = new THREE.Mesh(this.lib.box, mat);
    ground.scale.set(16, 2, 8);
    ground.position.set(0, -1, 0);
    ground.receiveShadow = true;
    this.levelGroup.add(ground);
    this.addBuildings(theme, 28, 0, true);
    this.addLights(18);
    this.addLandmark("glass", 6, theme);
    this.wakeLight.intensity = 1.35;
    this.wakeLight.position.set(2, 3.2, -4);
    for (const m of this.landmarkMats) m.emissiveIntensity = 0.55;
    this.hero.group.position.set(0.2, 0, 0.35);
  }

  private buildSolids(level: Level) {
    const theme = level.theme;
    for (const s of level.solids) {
      const color = s.style === "glass" ? theme.glass : s.style === "bridge" ? theme.roof : s.style === "sand" ? theme.ground : s.style === "spire" ? theme.building : theme.road;
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: s.style === "glass" ? 0.28 : 0.84,
        metalness: s.style === "glass" ? 0.35 : 0.02,
        emissive: s.kind === "bounce" ? 0xe7b04a : 0x000000,
        emissiveIntensity: s.kind === "bounce" ? 0.35 : 0,
      });
      this.trashMat.push(mat);
      const mesh = new THREE.Mesh(this.lib.box, mat);
      const depth = s.style === "road" ? 5 : s.style === "bridge" ? 1.5 : 2.6;
      mesh.scale.set(s.w, s.h, depth);
      mesh.position.set(s.x, s.y, 0);
      mesh.castShadow = this.quality !== "low";
      mesh.receiveShadow = true;
      this.levelGroup.add(mesh);
      this.solidMeshes.push(mesh);
    }
  }

  private buildSpawns(level: Level) {
    for (const s of level.spawns) {
      if (s.kind === "enemy") {
        const kind = (s.sub as EnemyKind) || "shadow";
        this.spawnFoe(kind, s.x, s.y);
        this.foeTotal += 1;
        continue;
      }
      const mesh = this.pickupMesh(s.kind, s.sub ?? "");
      this.levelGroup.add(mesh);
      this.pickups.push({ kind: s.kind, sub: s.sub ?? "", x: s.x, y: s.y, base: s.y, alive: true, mesh });
    }
  }

  private pickupMesh(kind: "coin" | "flame" | "power", sub: string): THREE.Object3D {
    if (kind === "flame") {
      const brass = new THREE.MeshStandardMaterial({
        color: 0xd4a24c,
        emissive: 0x8a4a12,
        emissiveIntensity: 0.5,
        roughness: 0.28,
        metalness: 0.82,
      });
      const fire = new THREE.MeshStandardMaterial({ color: 0xffb03a, emissive: 0xffc15a, emissiveIntensity: 1, roughness: 0.35 });
      this.trashMat.push(brass, fire);
      const g = new THREE.Group();
      const bowl = new THREE.Mesh(this.lib.bowl, brass);
      const wick = new THREE.Mesh(this.lib.flame, fire);
      wick.position.y = 0.28;
      wick.scale.setScalar(0.9);
      g.add(bowl, wick);
      return g;
    }
    let geo: THREE.BufferGeometry = this.lib.coin;
    let color = 0xe7b04a;
    if (kind === "power") {
      geo = sub === "shield" ? this.lib.torus : sub === "jump" ? this.lib.box : this.lib.sphere;
      color = sub === "life" ? 0xfff1c2 : sub === "flame" ? 0xe25a24 : 0xe7b04a;
    }
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.4 });
    this.trashMat.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    if (kind === "coin") mesh.rotation.x = Math.PI / 2;
    if (sub === "jump") mesh.scale.set(0.28, 0.5, 0.28);
    else if (kind === "power" && sub !== "shield") mesh.scale.setScalar(0.28);
    else if (kind === "power") mesh.scale.setScalar(1.1);
    mesh.castShadow = true;
    return mesh;
  }

  private dress(level: Level) {
    this.addBuildings(level.theme, level.length, -2);
    this.addLights(level.length);
    this.addLandmark(level.landmarkKind, Math.min(level.length - 4, level.boss ? level.length * 0.78 : level.goalX), level.theme);
    const sign = labelTexture(level.name, level.blurb);
    this.trashTex.push(sign);
    const signMat = new THREE.MeshBasicMaterial({ map: sign, transparent: true, depthWrite: false });
    this.trashMat.push(signMat);
    const planeGeo = new THREE.PlaneGeometry(3.4, 1.7);
    this.trashGeo.push(planeGeo);
    const plane = new THREE.Mesh(planeGeo, signMat);
    plane.position.set(4.2, 2.5, -0.4);
    this.levelGroup.add(plane);
    this.addShop(Math.max(8, (level.boss ? level.length * 0.4 : level.goalX) - 6));
    const waterGeo = new THREE.PlaneGeometry(level.length + 30, 18);
    this.trashGeo.push(waterGeo);
    const waterMat = new THREE.MeshStandardMaterial({ color: level.theme.glass, transparent: true, opacity: 0.35, roughness: 0.2, metalness: 0.1 });
    this.trashMat.push(waterMat);
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(level.length / 2, -1.35, -1);
    this.levelGroup.add(water);
  }

  private addBuildings(theme: Theme, length: number, zBias: number, prelit = false) {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    this.trashMat.push(bodyMat);
    this.bodyOff.set(theme.building).multiplyScalar(0.42);
    this.cBody.set(theme.accent);
    this.bodyOn.copy(this.bodyOff).lerp(this.cBody, 0.78);
    const spots: { x: number; h: number; w: number; d: number; z: number }[] = [];
    for (let x = -4; x < length + 6; x += 6.5) {
      const h = 5 + ((Math.abs(Math.floor(x)) * 5) % 10);
      const back = Math.floor(x) % 2 === 0;
      spots.push({ x, h, w: 4.4, d: 3.2, z: (back ? -12 : -7.2) + zBias });
    }
    const bodies = new THREE.InstancedMesh(this.lib.box, bodyMat, Math.max(1, spots.length));
    bodies.castShadow = false;
    bodies.receiveShadow = true;
    const dummy = new THREE.Object3D();
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.trashMat.push(winMat);
    const wins = new THREE.InstancedMesh(this.lib.box, winMat, Math.max(1, spots.length * 8));
    let wi = 0;
    this.facades = [];
    for (let i = 0; i < spots.length; i++) {
      const s = spots[i]!;
      dummy.position.set(s.x, s.h / 2 - 0.2, s.z);
      dummy.scale.set(s.w, s.h, s.d);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);
      bodies.setColorAt(i, this.bodyOff);
      const start = wi;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
          dummy.position.set(s.x - 0.9 + col * 1.5, 1.2 + row * (s.h / 5.2), s.z + s.d / 2 + 0.05);
          dummy.scale.set(0.7, 0.9, 0.08);
          dummy.updateMatrix();
          wins.setMatrixAt(wi, dummy.matrix);
          wins.setColorAt(wi, this.winOff);
          wi++;
        }
      }
      this.facades.push({ x: s.x, h: s.h, index: i, start, count: wi - start, lit: 0, target: 0 });
    }
    this.levelGroup.add(bodies);
    this.levelGroup.add(wins);
    this.bodies = bodies;
    this.windows = wins;
    if (prelit) {
      this.diyaAwake = true;
      this.lightReach = 9999;
      for (const f of this.facades) {
        f.lit = 1;
        f.target = 1;
      }
    }
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3a2c24, roughness: 0.8 });
    const leafMat = new THREE.MeshStandardMaterial({ color: theme.foliage, roughness: 0.75 });
    this.trashMat.push(trunkMat, leafMat);
    for (let i = 0; i < 5; i++) {
      const x = 6 + i * (length / 6);
      const trunk = new THREE.Mesh(this.lib.box, trunkMat);
      trunk.scale.set(0.25, 1.3, 0.25);
      trunk.position.set(x, 0.65, -2.2);
      const leaf = new THREE.Mesh(this.lib.sphere, leafMat);
      leaf.scale.set(0.8, 1, 0.8);
      leaf.position.set(x, 1.7, -2.2);
      this.levelGroup.add(trunk, leaf);
    }
    this.paintFacades();
  }

  private addLights(length: number) {
    const matA = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const matB = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.trashMat.push(matA, matB);
    const n = Math.max(8, Math.floor(length / 1.6));
    const a = new THREE.InstancedMesh(this.lib.sphere, matA, n);
    const b = new THREE.InstancedMesh(this.lib.sphere, matB, n);
    const dummy = new THREE.Object3D();
    this.lampRecs = [];
    for (let i = 0; i < n; i++) {
      const x = i * 1.6;
      dummy.position.set(x, 3.1 + Math.sin(i * 0.8) * 0.35, -1.5);
      dummy.scale.setScalar(0.12);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      const mesh = i % 2 === 0 ? a : b;
      const hidden = i % 2 === 0 ? b : a;
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, this.lampDim);
      this.lampRecs.push({ mesh, index: i, x });
      dummy.scale.setScalar(0.001);
      dummy.updateMatrix();
      hidden.setMatrixAt(i, dummy.matrix);
      hidden.setColorAt(i, this.lampDim);
    }
    this.lampMeshes = [a, b];
    this.levelGroup.add(a, b);
    this.paintFacades();
  }

  private addLandmark(kind: LandmarkKind, x: number, theme: Theme) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: theme.glass, roughness: 0.4, metalness: 0.2, emissive: theme.accent, emissiveIntensity: 0.08 });
    const dark = new THREE.MeshStandardMaterial({ color: theme.building, roughness: 0.8 });
    this.trashMat.push(mat, dark);
    const box = (w: number, h: number, d: number, px: number, py: number, pz: number, material = dark) => {
      const m = new THREE.Mesh(this.lib.box, material);
      m.scale.set(w, h, d);
      m.position.set(px, py, pz);
      g.add(m);
    };
    if (kind === "arch") {
      box(0.6, 6, 0.8, -1.6, 3, 0);
      box(0.6, 6, 0.8, 1.6, 3, 0);
      box(4, 0.6, 0.9, 0, 6.1, 0, mat);
    } else if (kind === "dome") {
      box(3.2, 2.2, 3, 0, 1.1, 0);
      const dome = new THREE.Mesh(this.lib.sphere, mat);
      dome.scale.set(1.5, 1.1, 1.5);
      dome.position.y = 2.8;
      g.add(dome);
    } else if (kind === "palace" || kind === "fort") {
      box(6, 3, 2.4, 0, 1.5, 0);
      box(1, 2.4, 1, -2.4, 3.4, 0, mat);
      box(1, 3.2, 1, 0, 3.8, 0, mat);
      box(1, 2.4, 1, 2.4, 3.4, 0, mat);
    } else if (kind === "spire") {
      const coneGeo = new THREE.ConeGeometry(0.7, 3.2, 6);
      this.trashGeo.push(coneGeo);
      for (const px of [-1.1, 0, 1.1]) {
        const c = new THREE.Mesh(coneGeo, mat);
        c.position.set(px, 2.2, 0);
        c.scale.setScalar(px === 0 ? 1.2 : 0.8);
        g.add(c);
      }
    } else if (kind === "ghat") {
      for (let i = 0; i < 4; i++) box(5 - i * 0.4, 0.35, 2.2, 0, 0.3 + i * 0.35, -i * 0.7);
    } else if (kind === "bridge") {
      box(0.4, 5, 0.4, -2, 2.5, 0);
      box(0.4, 5, 0.4, 2, 2.5, 0);
      box(4.4, 0.25, 0.8, 0, 3.6, 0, mat);
    } else if (kind === "lake") {
      box(2.2, 1.4, 2, 0, 0.8, 0);
      const dome = new THREE.Mesh(this.lib.sphere, mat);
      dome.scale.set(0.9, 0.6, 0.9);
      dome.position.y = 1.8;
      g.add(dome);
    } else if (kind === "map") {
      for (let i = 0; i < 5; i++) {
        box(0.7, 0.8 + (i % 3) * 0.4, 0.7, (i - 2) * 1.1, 0.6, 0, mat);
      }
    } else {
      box(1.4, 7, 1.4, -1.4, 3.5, 0, mat);
      box(1.6, 9, 1.6, 0.4, 4.5, 0);
      box(1.2, 6, 1.2, 1.8, 3, 0, mat);
    }
    g.position.set(x, 0, -4.5);
    this.landmarkX = x;
    this.landmarkMats = [mat];
    this.levelGroup.add(g);
  }

  private addShop(x: number) {
    const tex = labelTexture("DesiDiya", "Night lamps · diyas · fairy lights");
    this.trashTex.push(tex);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    this.trashMat.push(mat);
    const geo = new THREE.PlaneGeometry(2.6, 1.3);
    this.trashGeo.push(geo);
    const plane = new THREE.Mesh(geo, mat);
    plane.position.set(x, 2.15, -1.2);
    const stallMat = new THREE.MeshStandardMaterial({ color: 0x241c18, roughness: 0.7 });
    this.trashMat.push(stallMat);
    const stall = new THREE.Mesh(this.lib.box, stallMat);
    stall.scale.set(2.4, 1.4, 1.2);
    stall.position.set(x, 0.7, -1.6);
    this.levelGroup.add(stall, plane);
  }

  private paintFacades() {
    const wins = this.windows;
    const bodies = this.bodies;
    if (wins) {
      for (const f of this.facades) {
        this.cWin.copy(this.winOff).lerp(this.winOn, f.lit);
        for (let i = 0; i < f.count; i++) wins.setColorAt(f.start + i, this.cWin);
      }
      if (wins.instanceColor) wins.instanceColor.needsUpdate = true;
    }
    if (bodies) {
      for (const f of this.facades) {
        this.cBody.copy(this.bodyOff).lerp(this.bodyOn, f.lit);
        bodies.setColorAt(f.index, this.cBody);
      }
      if (bodies.instanceColor) bodies.instanceColor.needsUpdate = true;
    }
    for (const lamp of this.lampRecs) {
      const on = (this.diyaAwake && lamp.x <= this.lightReach + 0.4) || this.lightReach > 900;
      lamp.mesh.setColorAt(lamp.index, on ? (lamp.index % 2 === 0 ? this.lampGold : this.lampEmber) : this.lampDim);
    }
    for (const mesh of this.lampMeshes) {
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }

  private makeWave() {
    const geo = new THREE.TorusGeometry(1, 0.08, 6, 18);
    this.trashGeo.push(geo);
    const mat = new THREE.MeshBasicMaterial({ color: 0xe25a24, transparent: true, opacity: 0.85 });
    this.trashMat.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    this.levelGroup.add(mesh);
    return mesh;
  }

  private makeBoltPool() {
    for (let i = 0; i < 36; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffe29a });
      const mesh = new THREE.Mesh(this.lib.sphere, mat);
      mesh.visible = false;
      mesh.scale.setScalar(0.2);
      this.scene.add(mesh);
      this.bolts.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        dmg: 1,
        r: 0.16,
        friendly: true,
        hits: 1,
        alive: false,
        explode: false,
        seen: [],
        mesh,
      });
    }
  }
}

class Sparks {
  pos: Float32Array;
  vel: Float32Array;
  life: Float32Array;
  geo: THREE.BufferGeometry;
  points: THREE.Points;
  n: number;
  private color = new THREE.Color();

  constructor(parent: THREE.Object3D, n: number) {
    this.n = n;
    this.pos = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.life = new Float32Array(n);
    const col = new Float32Array(n * 3);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    this.points = new THREE.Points(this.geo, mat);
    parent.add(this.points);
  }

  burst(x: number, y: number, z: number, hex: number, count: number) {
    this.color.setHex(hex);
    const col = this.geo.getAttribute("color") as THREE.BufferAttribute;
    let left = count;
    for (let i = 0; i < this.n && left > 0; i++) {
      if ((this.life[i] ?? 0) > 0) continue;
      this.life[i] = 0.28 + Math.random() * 0.28;
      this.pos[i * 3] = x;
      this.pos[i * 3 + 1] = y;
      this.pos[i * 3 + 2] = z;
      this.vel[i * 3] = (Math.random() - 0.5) * 7;
      this.vel[i * 3 + 1] = Math.random() * 5.5;
      this.vel[i * 3 + 2] = (Math.random() - 0.5) * 2;
      col.setXYZ(i, this.color.r, this.color.g, this.color.b);
      left--;
    }
    (this.geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    col.needsUpdate = true;
  }

  update(dt: number) {
    let dirty = false;
    for (let i = 0; i < this.n; i++) {
      if ((this.life[i] ?? 0) <= 0) continue;
      this.life[i] = (this.life[i] ?? 0) - dt;
      this.vel[i * 3 + 1] = (this.vel[i * 3 + 1] ?? 0) - 9 * dt;
      this.pos[i * 3] = (this.pos[i * 3] ?? 0) + (this.vel[i * 3] ?? 0) * dt;
      this.pos[i * 3 + 1] = (this.pos[i * 3 + 1] ?? 0) + (this.vel[i * 3 + 1] ?? 0) * dt;
      this.pos[i * 3 + 2] = (this.pos[i * 3 + 2] ?? 0) + (this.vel[i * 3 + 2] ?? 0) * dt;
      if ((this.life[i] ?? 0) <= 0) this.pos[i * 3 + 1] = -20;
      dirty = true;
    }
    if (dirty) (this.geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  }
}

function approach(v: number, to: number, maxDelta: number) {
  if (v < to) return Math.min(to, v + maxDelta);
  return Math.max(to, v - maxDelta);
}

function labelTexture(title: string, sub: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) {
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }
  g.clearRect(0, 0, 512, 256);
  g.fillStyle = "rgba(16,12,24,0.78)";
  g.fillRect(0, 40, 512, 176);
  g.fillStyle = "#e7b04a";
  g.font = "650 54px Fraunces, Georgia, serif";
  g.fillText(title, 28, 118);
  g.fillStyle = "#f4ead7";
  g.font = "500 28px Outfit, sans-serif";
  g.fillText(sub.slice(0, 42), 28, 168);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
