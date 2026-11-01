import { n as buildLevel } from "./routes-CUmJjlQc.mjs";
import { A as Scene, C as Plane, D as PointsMaterial, E as Points, M as TorusGeometry, N as Vector2, O as Raycaster, P as Vector3, S as PerspectiveCamera, T as PointLight, _ as Mesh, a as CanvasTexture, b as Object3D, c as ConeGeometry, d as Fog, f as Group, g as MathUtils, h as InstancedMesh, i as BufferGeometry, j as SphereGeometry, k as SRGBColorSpace, l as CylinderGeometry, m as IcosahedronGeometry, n as BoxGeometry, o as CapsuleGeometry, p as HemisphereLight, r as BufferAttribute, s as Color, t as WebGLRenderer, u as DirectionalLight, v as MeshBasicMaterial, w as PlaneGeometry, x as OctahedronGeometry, y as MeshStandardMaterial } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/runtime-Bb3gLkj0.js
var cache = /* @__PURE__ */ new Map();
function g(key, build) {
	let geo = cache.get(key);
	if (!geo) {
		geo = build();
		cache.set(key, geo);
	}
	return geo;
}
function standard(color, emissive, rough = .6) {
	return new MeshStandardMaterial({
		color,
		emissive,
		roughness: rough,
		metalness: .08
	});
}
function makeActor(kind) {
	const root = new Group();
	root.name = kind;
	if (kind === "shadow") shadow(root);
	else if (kind === "drone") drone(root);
	else if (kind === "smoke") smoke(root);
	else if (kind === "energy") energy(root);
	else if (kind === "guardian") guardian(root);
	else boss(root, kind === "titan");
	root.traverse((obj) => {
		const mesh = obj;
		if (mesh.isMesh) {
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		}
	});
	return root;
}
function actorStats(kind) {
	switch (kind) {
		case "shadow": return {
			hp: 2,
			w: .7,
			h: 1.5,
			fly: false
		};
		case "drone": return {
			hp: 2,
			w: .8,
			h: .7,
			fly: true
		};
		case "smoke": return {
			hp: 4,
			w: .9,
			h: 1.6,
			fly: false
		};
		case "energy": return {
			hp: 3,
			w: .75,
			h: 1.45,
			fly: false
		};
		case "guardian": return {
			hp: 6,
			w: 1,
			h: 1.9,
			fly: false
		};
		case "boss": return {
			hp: 36,
			w: 2.4,
			h: 3.3,
			fly: false
		};
		case "titan": return {
			hp: 72,
			w: 3.4,
			h: 4.6,
			fly: false
		};
	}
}
function animateActor(root, time, kind) {
	const s = Math.sin(time * (kind === "drone" ? 6 : 3));
	if (kind === "drone") {
		root.position.y += Math.sin(time * 4) * 0;
		root.children[0].rotation.y = time * 1.4;
		root.rotation.z = Math.sin(time * 5) * .08;
	} else if (kind === "smoke") {
		root.rotation.y = Math.sin(time * .8) * .2;
		root.scale.y = 1 + Math.sin(time * 2) * .05;
	} else if (kind === "boss" || kind === "titan") {
		root.rotation.y = Math.sin(time * .7) * .12;
		const arm = root.getObjectByName("armL");
		const armR = root.getObjectByName("armR");
		if (arm) arm.rotation.z = .4 + s * .3;
		if (armR) armR.rotation.z = -.4 - s * .3;
	} else root.rotation.z = s * .04;
}
function add(parent, mesh, x = 0, y = 0, z = 0) {
	mesh.position.set(x, y, z);
	parent.add(mesh);
	return mesh;
}
function shadow(root) {
	const body = standard(1708064, 3805224, .7);
	const eye = new MeshBasicMaterial({ color: 14834212 });
	add(root, new Mesh(g("sh-body", () => new CapsuleGeometry(.22, .7, 4, 8)), body), 0, .85, 0);
	add(root, new Mesh(g("sh-head", () => new SphereGeometry(.18, 10, 8)), body), 0, 1.4, .05);
	const armL = add(root, new Mesh(g("sh-arm", () => new CapsuleGeometry(.06, .55, 3, 6)), body), -.28, .85, 0);
	armL.rotation.z = .7;
	const armR = armL.clone();
	armR.position.x = .28;
	armR.rotation.z = -.7;
	root.add(armR);
	add(root, new Mesh(g("eye", () => new SphereGeometry(.035, 6, 6)), eye), -.07, 1.44, .14);
	add(root, new Mesh(g("eye", () => new SphereGeometry(.035, 6, 6)), eye), .07, 1.44, .14);
}
function drone(root) {
	const shell = standard(2365472, 5906448, .35);
	const eye = new MeshBasicMaterial({ color: 16756794 });
	const hub = new Group();
	root.add(hub);
	add(hub, new Mesh(g("oct", () => new OctahedronGeometry(.28)), shell), 0, .9, 0);
	add(hub, new Mesh(g("wing", () => new BoxGeometry(.7, .04, .18)), shell), 0, .95, 0).scale.set(1, 1, 1);
	add(hub, new Mesh(g("eye", () => new SphereGeometry(.07, 8, 6)), eye), 0, .9, .18);
}
function smoke(root) {
	const puff = standard(2763310, 1708560, .9);
	add(root, new Mesh(g("p1", () => new SphereGeometry(.32, 10, 8)), puff), 0, .45, 0);
	add(root, new Mesh(g("p2", () => new SphereGeometry(.26, 10, 8)), puff), .08, .9, 0);
	add(root, new Mesh(g("p3", () => new SphereGeometry(.18, 8, 6)), puff), -.05, 1.25, 0);
	const eye = new MeshBasicMaterial({ color: 15183946 });
	add(root, new Mesh(g("eye", () => new SphereGeometry(.04, 6, 6)), eye), -.08, .95, .18);
	add(root, new Mesh(g("eye", () => new SphereGeometry(.04, 6, 6)), eye), .1, .98, .16);
}
function energy(root) {
	const crystal = standard(3810328, 14834212, .25);
	crystal.emissiveIntensity = .6;
	add(root, new Mesh(g("ico", () => new IcosahedronGeometry(.32, 0)), crystal), 0, .85, 0);
	add(root, new Mesh(g("ico2", () => new OctahedronGeometry(.16)), crystal), 0, 1.35, 0);
	add(root, new Mesh(g("legc", () => new BoxGeometry(.08, .4, .08)), crystal), -.1, .3, 0);
	add(root, new Mesh(g("legc", () => new BoxGeometry(.08, .4, .08)), crystal), .1, .3, 0);
}
function guardian(root) {
	const plate = standard(1840143, 3809296, .45);
	const eye = new MeshBasicMaterial({ color: 14834212 });
	add(root, new Mesh(g("gbody", () => new BoxGeometry(.7, .9, .4)), plate), 0, .95, 0);
	add(root, new Mesh(g("ghead", () => new BoxGeometry(.36, .32, .32)), plate), 0, 1.55, 0);
	const shield = add(root, new Mesh(g("shield", () => new BoxGeometry(.45, .7, .08)), plate), -.48, 1, .1);
	shield.rotation.z = .15;
	add(root, new Mesh(g("eye", () => new SphereGeometry(.04, 6, 6)), eye), -.08, 1.58, .16);
	add(root, new Mesh(g("eye", () => new SphereGeometry(.04, 6, 6)), eye), .08, 1.58, .16);
}
function boss(root, titan) {
	const scale = titan ? 1.45 : 1;
	const hide = standard(1313812, 4855840, .5);
	const coreMat = new MeshBasicMaterial({ color: 16756794 });
	const body = new Mesh(new CapsuleGeometry(.55 * scale, 1.3 * scale, 5, 10), hide);
	body.position.y = 1.5 * scale;
	root.add(body);
	const head = new Mesh(new SphereGeometry(.38 * scale, 12, 10), hide);
	head.position.y = 2.45 * scale;
	root.add(head);
	const hornL = new Mesh(new ConeGeometry(.08 * scale, .45 * scale, 6), hide);
	hornL.position.set(-.18 * scale, 2.85 * scale, 0);
	hornL.rotation.z = .4;
	root.add(hornL);
	const hornR = hornL.clone();
	hornR.position.x = .18 * scale;
	hornR.rotation.z = -.4;
	root.add(hornR);
	const armL = new Mesh(new CapsuleGeometry(.12 * scale, 1.1 * scale, 4, 8), hide);
	armL.name = "armL";
	armL.position.set(-.7 * scale, 1.7 * scale, 0);
	armL.rotation.z = .5;
	root.add(armL);
	const armR = armL.clone();
	armR.name = "armR";
	armR.position.x = .7 * scale;
	armR.rotation.z = -.5;
	root.add(armR);
	const gem = new Mesh(new OctahedronGeometry(.22 * scale), coreMat);
	gem.position.set(0, 1.55 * scale, .4 * scale);
	gem.name = "core";
	root.add(gem);
	if (titan) {
		const wing = new Mesh(new BoxGeometry(1.8, .9, .08), hide);
		wing.position.set(0, 2.1, -.3);
		root.add(wing);
	}
	const eye = new MeshBasicMaterial({ color: 14834212 });
	const e1 = new Mesh(new SphereGeometry(.06 * scale, 8, 6), eye);
	e1.position.set(-.12 * scale, 2.5 * scale, .28 * scale);
	root.add(e1);
	const e2 = e1.clone();
	e2.position.x = .12 * scale;
	root.add(e2);
}
var AudioBus = class {
	ctx = null;
	master = null;
	music = null;
	sfx = null;
	drone = [];
	next = 0;
	step = 0;
	mode = "menu";
	musicLevel = .7;
	sfxLevel = .85;
	muted = false;
	started = false;
	unlock() {
		if (!this.ctx) {
			const AC = window.AudioContext || window.webkitAudioContext;
			this.ctx = new AC({ latencyHint: "interactive" });
			this.master = this.ctx.createGain();
			this.music = this.ctx.createGain();
			this.sfx = this.ctx.createGain();
			this.music.connect(this.master);
			this.sfx.connect(this.master);
			this.master.connect(this.ctx.destination);
			this.applyGains();
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	setMix(music, sfx, muted) {
		this.musicLevel = music;
		this.sfxLevel = sfx;
		this.muted = muted;
		this.applyGains();
	}
	applyGains() {
		if (!this.ctx || !this.master || !this.music || !this.sfx) return;
		const m = this.muted ? 0 : this.musicLevel ** 2;
		const s = this.muted ? 0 : this.sfxLevel ** 2;
		const now = this.ctx.currentTime;
		this.music.gain.setTargetAtTime(.18 * m, now, .05);
		this.sfx.gain.setTargetAtTime(.9 * s, now, .03);
		this.master.gain.setTargetAtTime(this.muted ? 0 : 1, now, .03);
	}
	setMode(mode) {
		if (this.mode === mode) return;
		this.mode = mode;
		this.step = 0;
		if (this.ctx) this.next = this.ctx.currentTime + .05;
	}
	tick() {
		if (!this.ctx || !this.music || this.muted || this.musicLevel <= .01) return;
		if (!this.started) this.startDrone();
		const motif = this.mode === "boss" ? BOSS : this.mode === "win" ? WIN : YAMAN;
		const gap = this.mode === "boss" ? .24 : this.mode === "win" ? .2 : this.mode === "menu" ? .5 : .36;
		const base = this.mode === "boss" ? 185 : 220;
		const t = this.ctx.currentTime;
		while (this.next < t + .25) {
			const semi = motif[this.step % motif.length] ?? 0;
			this.tone(this.next, base * 2 ** (semi / 12), this.mode === "boss" ? .2 : .34, "triangle", .07);
			if (this.step % 4 === 0) this.tone(this.next, base * 2 ** (((motif[(this.step + 2) % motif.length] ?? 0) - 12) / 12), .3, "sine", .05);
			this.step++;
			this.next += gap;
		}
	}
	startDrone() {
		if (!this.ctx || !this.music || this.started) return;
		this.started = true;
		for (const freq of [110, 165]) {
			const o = this.ctx.createOscillator();
			const g = this.ctx.createGain();
			o.type = "sine";
			o.frequency.value = freq;
			g.gain.value = .04;
			o.connect(g);
			g.connect(this.music);
			o.start();
			this.drone.push(o);
		}
		this.next = this.ctx.currentTime + .05;
	}
	tone(when, freq, dur, type, gain) {
		if (!this.ctx || !this.music) return;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = type;
		o.frequency.setValueAtTime(freq, when);
		g.gain.setValueAtTime(1e-4, when);
		g.gain.exponentialRampToValueAtTime(gain, when + .02);
		g.gain.exponentialRampToValueAtTime(1e-4, when + dur);
		o.connect(g);
		g.connect(this.music);
		o.start(when);
		o.stop(when + dur + .02);
		o.onended = () => {
			o.disconnect();
			g.disconnect();
		};
	}
	blip(freq, dur, type, gain, slide = 0) {
		if (!this.ctx || !this.sfx || this.muted || this.sfxLevel <= .01) return;
		const now = this.ctx.currentTime;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = type;
		o.frequency.setValueAtTime(freq, now);
		if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + dur);
		g.gain.setValueAtTime(gain, now);
		g.gain.exponentialRampToValueAtTime(1e-4, now + dur);
		o.connect(g);
		g.connect(this.sfx);
		o.start(now);
		o.stop(now + dur + .02);
		o.onended = () => {
			o.disconnect();
			g.disconnect();
		};
	}
	jump() {
		this.blip(420 + Math.random() * 40, .12, "square", .05, 180);
	}
	shoot() {
		this.blip(680 + Math.random() * 80, .09, "sawtooth", .04, -300);
	}
	coin() {
		this.blip(880, .08, "sine", .06, 400);
	}
	flame() {
		this.blip(520, .22, "triangle", .07, 240);
	}
	hit() {
		this.blip(180, .1, "square", .06, -80);
	}
	hurt() {
		this.blip(140, .18, "sawtooth", .07, -90);
	}
	defeat() {
		this.blip(90, .4, "triangle", .08, -50);
	}
	win() {
		this.setMode("win");
		this.blip(523, .18, "triangle", .08, 0);
		window.setTimeout(() => this.blip(659, .18, "triangle", .08, 0), 140);
		window.setTimeout(() => this.blip(784, .28, "triangle", .08, 0), 280);
	}
	resume() {
		if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
	}
	dispose() {
		for (const o of this.drone) o.stop();
		this.drone = [];
		this.ctx?.close();
		this.ctx = null;
	}
};
var YAMAN = [
	0,
	2,
	4,
	6,
	7,
	9,
	11,
	12,
	11,
	9,
	7,
	6,
	4,
	2,
	4,
	7
];
var BOSS = [
	0,
	1,
	5,
	7,
	8,
	1,
	0,
	-1,
	5,
	8,
	7,
	1
];
var WIN = [
	0,
	4,
	7,
	12,
	7,
	4,
	9,
	12
];
function createHero() {
	const mats = [];
	const geos = [];
	const mat = (m) => {
		mats.push(m);
		return m;
	};
	const skin = mat(new MeshStandardMaterial({
		color: 12880482,
		roughness: .58,
		metalness: .02
	}));
	const hair = mat(new MeshStandardMaterial({
		color: 1708558,
		roughness: .42,
		metalness: .06
	}));
	const kurta = mat(new MeshStandardMaterial({
		color: 15983300,
		roughness: .78
	}));
	const jacket = mat(new MeshStandardMaterial({
		color: 2366488,
		roughness: .6,
		metalness: .08
	}));
	const gold = mat(new MeshStandardMaterial({
		color: 15183946,
		roughness: .32,
		metalness: .74
	}));
	const cloth = mat(new MeshStandardMaterial({
		color: 3812388,
		roughness: .8
	}));
	const shoe = mat(new MeshStandardMaterial({
		color: 1446158,
		roughness: .52
	}));
	const white = mat(new MeshStandardMaterial({
		color: 16052714,
		roughness: .28
	}));
	const dark = mat(new MeshStandardMaterial({
		color: 1708556,
		roughness: .3
	}));
	const lip = mat(new MeshStandardMaterial({
		color: 11033160,
		roughness: .48
	}));
	const brass = mat(new MeshStandardMaterial({
		color: 13935180,
		roughness: .28,
		metalness: .86
	}));
	const flame = mat(new MeshBasicMaterial({ color: 16756794 }));
	const core = mat(new MeshBasicMaterial({ color: 16773570 }));
	const geo = (g) => {
		geos.push(g);
		return g;
	};
	const group = new Group();
	group.name = "goranksh";
	const hips = new Group();
	hips.position.y = .9;
	group.add(hips);
	const torso = new Group();
	hips.add(torso);
	mesh(geo(new CylinderGeometry(.16, .15, .42, 10)), kurta, torso, 0, .2, 0).scale.set(1.05, 1, .82);
	mesh(geo(new BoxGeometry(.08, .4, .22)), jacket, torso, -.16, .2, 0);
	mesh(geo(new BoxGeometry(.08, .4, .22)), jacket, torso, .16, .2, 0);
	mesh(geo(new BoxGeometry(.02, .38, .23)), gold, torso, -.125, .2, 0);
	mesh(geo(new BoxGeometry(.02, .38, .23)), gold, torso, .125, .2, 0);
	mesh(geo(new BoxGeometry(.06, .08, .02)), gold, torso, 0, .28, .12);
	const skirt = mesh(geo(new CylinderGeometry(.2, .24, .34, 10)), kurta, hips, 0, -.12, 0);
	skirt.scale.z = .78;
	const headP = new Group();
	headP.position.y = .46;
	torso.add(headP);
	mesh(geo(new SphereGeometry(.125, 14, 12)), skin, headP, 0, .12, 0).scale.set(1, 1.08, .94);
	mesh(geo(new SphereGeometry(.132, 14, 10)), hair, headP, 0, .16, -.01).scale.set(1.02, .72, 1.02);
	mesh(geo(new BoxGeometry(.2, .06, .08)), hair, headP, 0, .2, .06);
	mesh(geo(new SphereGeometry(.03, 8, 6)), skin, headP, -.12, .1, 0);
	mesh(geo(new SphereGeometry(.03, 8, 6)), skin, headP, .12, .1, 0);
	const eyeL = mesh(geo(new SphereGeometry(.02, 8, 6)), white, headP, -.045, .12, .1);
	const eyeR = mesh(geo(new SphereGeometry(.02, 8, 6)), white, headP, .045, .12, .1);
	mesh(geo(new SphereGeometry(.011, 8, 6)), dark, eyeL, 0, 0, .012);
	mesh(geo(new SphereGeometry(.011, 8, 6)), dark, eyeR, 0, 0, .012);
	mesh(geo(new BoxGeometry(.05, .012, .02)), hair, headP, -.045, .15, .1);
	mesh(geo(new BoxGeometry(.05, .012, .02)), hair, headP, .045, .15, .1);
	const nose = mesh(geo(new ConeGeometry(.018, .045, 6)), skin, headP, 0, .09, .11);
	nose.rotation.x = Math.PI / 2;
	mesh(geo(new BoxGeometry(.05, .014, .02)), lip, headP, 0, .055, .105);
	const arm = (side) => {
		const shoulder = new Group();
		shoulder.position.set(side * .2, .36, 0);
		torso.add(shoulder);
		mesh(geo(new CapsuleGeometry(.045, .22, 4, 8)), jacket, shoulder, 0, -.16, 0);
		const elbow = new Group();
		elbow.position.y = -.3;
		shoulder.add(elbow);
		mesh(geo(new CapsuleGeometry(.04, .2, 4, 8)), skin, elbow, 0, -.14, 0);
		const hand = new Group();
		hand.position.y = -.28;
		elbow.add(hand);
		mesh(geo(new SphereGeometry(.048, 8, 6)), skin, hand, 0, 0, 0);
		return {
			shoulder,
			elbow,
			hand
		};
	};
	const left = arm(-1);
	const right = arm(1);
	const diya = new Group();
	right.hand.add(diya);
	mesh(geo(new CylinderGeometry(.055, .04, .03, 10)), brass, diya, 0, .03, .02);
	mesh(geo(new TorusGeometry(.05, .008, 6, 10)), gold, diya, 0, .045, .02).rotation.x = Math.PI / 2;
	const wick = mesh(geo(new ConeGeometry(.022, .1, 8)), flame, diya, 0, .11, .02);
	mesh(geo(new SphereGeometry(.016, 8, 6)), core, diya, 0, .08, .02);
	const light = new PointLight(16752704, 2.2, 7.5, 2);
	light.position.set(0, .1, .02);
	diya.add(light);
	const leg = (side) => {
		const hip = new Group();
		hip.position.set(side * .09, -.02, 0);
		hips.add(hip);
		mesh(geo(new CapsuleGeometry(.055, .28, 4, 8)), cloth, hip, 0, -.2, 0);
		const knee = new Group();
		knee.position.y = -.4;
		hip.add(knee);
		mesh(geo(new CapsuleGeometry(.048, .26, 4, 8)), cloth, knee, 0, -.18, 0);
		return {
			hip,
			knee,
			foot: mesh(geo(new BoxGeometry(.09, .06, .18)), shoe, knee, 0, -.36, .04)
		};
	};
	const legL = leg(-1);
	const legR = leg(1);
	group.traverse((obj) => {
		const meshObj = obj;
		if (meshObj.isMesh) {
			meshObj.castShadow = true;
			meshObj.receiveShadow = true;
		}
	});
	const update = (a) => {
		const speed = Math.abs(a.vx);
		const run = a.grounded && speed > .4;
		const sprint = run && a.sprint && speed > 8;
		const freq = sprint ? 11.5 : speed > 6 ? 8.4 : 6.2;
		const amp = sprint ? .9 : speed > 6 ? .68 : .46;
		const s = Math.sin(a.time * freq);
		legL.hip.rotation.x = 0;
		legR.hip.rotation.x = 0;
		legL.knee.rotation.x = 0;
		legR.knee.rotation.x = 0;
		left.shoulder.rotation.x = 0;
		right.shoulder.rotation.x = 0;
		left.elbow.rotation.x = .15;
		right.elbow.rotation.x = .2;
		torso.rotation.z = 0;
		torso.rotation.x = 0;
		hips.rotation.x = 0;
		headP.rotation.x = 0;
		torso.position.y = 0;
		let bob = 0;
		if (a.defeat) {
			hips.rotation.x = 1.15;
			hips.position.y = .45;
			torso.rotation.x = .4;
			return;
		}
		hips.position.y = .9;
		if (a.victory) {
			left.shoulder.rotation.x = -2.6;
			right.shoulder.rotation.x = -2.6;
			torso.rotation.x = -.15;
			legL.hip.rotation.x = .2;
			legR.hip.rotation.x = -.15;
		} else if (!a.grounded && a.vy > 1) {
			legL.hip.rotation.x = -.7;
			legR.hip.rotation.x = -.35;
			legL.knee.rotation.x = 1;
			legR.knee.rotation.x = .7;
			left.shoulder.rotation.x = -2.2;
			right.shoulder.rotation.x = -1.8;
		} else if (!a.grounded) {
			legL.hip.rotation.x = .25;
			legR.hip.rotation.x = -.15;
			legL.knee.rotation.x = .3;
			left.shoulder.rotation.x = -.6;
			right.shoulder.rotation.x = -.4;
			torso.rotation.x = .12;
		} else if (run) {
			legL.hip.rotation.x = s * amp;
			legR.hip.rotation.x = -s * amp;
			legL.knee.rotation.x = Math.max(0, -s) * 1.05;
			legR.knee.rotation.x = Math.max(0, s) * 1.05;
			left.shoulder.rotation.x = -s * amp * .75;
			right.shoulder.rotation.x = s * amp * .55;
			torso.rotation.z = s * .04;
			bob = Math.abs(Math.sin(a.time * freq)) * (sprint ? .07 : .045);
		} else {
			const b = Math.sin(a.time * 1.7);
			torso.position.y = b * .012;
			left.shoulder.rotation.x = b * .06;
			right.shoulder.rotation.x = -b * .05;
			headP.rotation.x = b * .03;
		}
		if (a.shooting && !a.victory && !a.defeat) {
			const lift = Math.min(1.35, Math.max(-.2, a.aim));
			right.shoulder.rotation.x = -1.15 - lift;
			right.elbow.rotation.x = .15;
		}
		if (a.hurt > 0) torso.rotation.x = .35;
		if (a.land > 0 && a.grounded) {
			const k = a.land / .12;
			group.scale.set(1 + .08 * k, 1 - .1 * k, 1);
		} else if (!a.grounded && a.vy > 0) group.scale.set(.94, 1.08, .94);
		else group.scale.set(1, 1, 1);
		const flick = .82 + Math.sin(a.time * 22) * .12 + Math.sin(a.time * 37) * .06;
		wick.scale.y = flick;
		light.intensity = 1.8 + Math.sin(a.time * 19) * .35;
		group.rotation.y = a.facing > 0 ? Math.PI / 2 : -Math.PI / 2;
		rig.bobY = bob;
	};
	const rig = {
		group,
		light,
		bobY: 0,
		update,
		dispose: () => {
			for (const g of geos) g.dispose();
			for (const m of mats) m.dispose();
		}
	};
	return rig;
}
function mesh(geometry, material, parent, x, y, z) {
	const m = new Mesh(geometry, material);
	m.position.set(x, y, z);
	parent.add(m);
	return m;
}
var GRAVITY = 24;
var JUMP = 11.1;
var MOVE = 7.5;
var SPRINT = 10.8;
var PW = .48;
var PH = 1.55;
var Game = class {
	canvas;
	onEvent;
	onHud;
	renderer;
	scene = new Scene();
	camera = new PerspectiveCamera(48, 1, .1, 200);
	hero = createHero();
	audio = new AudioBus();
	keys = /* @__PURE__ */ new Set();
	forced = /* @__PURE__ */ new Set();
	steer = 0;
	touch = {
		x: 0,
		y: 0,
		jump: false,
		shoot: false,
		sprint: false,
		using: false
	};
	prevJump = false;
	pointerDown = false;
	pointer = new Vector2();
	raycaster = new Raycaster();
	aimPlane = new Plane(new Vector3(0, 0, 1), 0);
	hit = new Vector3();
	desired = new Vector3();
	look = new Vector3();
	mouseFresh = 0;
	dirx = 1;
	diry = 0;
	facing = 1;
	raf = 0;
	last = 0;
	acc = 0;
	time = 0;
	runTime = 0;
	hudAcc = 0;
	mode = "menu";
	paused = false;
	quality;
	shakeMag = 0;
	portrait = false;
	fps = 60;
	dropped = false;
	playClock = 0;
	level = null;
	levelGroup = new Group();
	solidMeshes = [];
	trashMat = [];
	trashGeo = [];
	trashTex = [];
	windows = null;
	bodies = null;
	facades = [];
	lampRecs = [];
	lampMeshes = [];
	diyaAwake = false;
	lightReach = -999;
	paintedReach = -1e3;
	landmarkMats = [];
	landmarkX = 0;
	bodyOff = new Color("#121820");
	bodyOn = new Color("#8a6234");
	winOff = new Color(1314328);
	winOn = new Color(16765562);
	lampDim = new Color(2761244);
	lampGold = new Color(15183946);
	lampEmber = new Color(14834212);
	cWin = new Color();
	cBody = new Color();
	wakeLight = new PointLight(16757850, 0, 18, 2);
	foes = [];
	foeTotal = 0;
	pickups = [];
	bolts = [];
	waves = [];
	boss = null;
	bossActive = false;
	sparks;
	lib = {
		box: new BoxGeometry(1, 1, 1),
		sphere: new SphereGeometry(1, 10, 8),
		coin: new CylinderGeometry(.22, .22, .07, 12),
		flame: new ConeGeometry(.16, .42, 8),
		bowl: new CylinderGeometry(.18, .11, .09, 10),
		torus: new TorusGeometry(.2, .06, 6, 10)
	};
	hemi = new HemisphereLight(13687039, 3811864, .85);
	dir = new DirectionalLight(16769720, 1.15);
	p = {
		x: 2.2,
		y: .3,
		vx: 0,
		vy: 0,
		grounded: false,
		coyote: 0,
		airJumps: 1,
		ride: -1,
		land: 0
	};
	cpX = 2.2;
	cpY = .2;
	hearts = 3;
	maxHearts = 5;
	weapon = 1;
	shield = 0;
	invuln = 0;
	starT = 0;
	jumpT = 0;
	magnetT = 0;
	flameT = 0;
	shootT = 0;
	coins = 0;
	flames = 0;
	kills = 0;
	noDamage = true;
	cleared = [];
	illums = [];
	cityName = "Gurugram";
	cityIndex = 0;
	areaIndex = 0;
	cine = null;
	opts = null;
	shootHeld = false;
	sprintHeld = false;
	qa;
	constructor(canvas, quality, onEvent, onHud) {
		this.canvas = canvas;
		this.onEvent = onEvent;
		this.onHud = onHud;
		this.quality = quality;
		this.qa = new URLSearchParams(location.search).has("qa");
		this.renderer = new WebGLRenderer({
			canvas,
			antialias: false,
			alpha: false,
			powerPreference: "high-performance"
		});
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.toneMapping = 4;
		this.renderer.toneMappingExposure = 1.08;
		this.renderer.shadowMap.enabled = quality !== "low";
		this.scene.add(this.levelGroup);
		this.scene.add(this.hemi);
		this.dir.position.set(12, 22, 14);
		this.dir.castShadow = quality !== "low";
		this.dir.shadow.mapSize.set(quality === "high" ? 1024 : 512, quality === "high" ? 1024 : 512);
		this.dir.shadow.camera.near = 1;
		this.dir.shadow.camera.far = 48;
		const cam = this.dir.shadow.camera;
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
		if (this.qa) window.__controlsTest = {
			getYaw: () => this.facing > 0 ? Math.PI / 2 : -Math.PI / 2,
			getSpeed: () => Math.abs(this.p.vx),
			getX: () => this.p.x,
			getY: () => this.p.y,
			setKeys: (codes) => {
				this.forced = new Set(codes);
			},
			setSteer: (v) => {
				this.steer = v;
			}
		};
		this.showMenu();
		this.raf = requestAnimationFrame(this.frame);
		window.__gameReady = true;
		this.onEvent({ type: "ready" });
	}
	setQuality(q) {
		this.quality = q;
		const dpr = window.devicePixelRatio || 1;
		const ratio = q === "low" ? 1 : q === "medium" ? Math.min(1.35, dpr) : Math.min(1.75, dpr);
		this.renderer.setPixelRatio(ratio);
		this.renderer.shadowMap.enabled = q !== "low";
		this.dir.castShadow = q !== "low";
		this.hero.light.intensity = q === "low" ? 1.25 : 2.15;
		this.resize();
	}
	setMix(music, sfx, muted) {
		this.audio.setMix(music, sfx, muted);
	}
	unlockAudio() {
		this.audio.unlock();
	}
	setPaused(v) {
		this.paused = v;
		if (!v) this.audio.resume();
	}
	setTouch(partial) {
		this.touch = {
			...this.touch,
			...partial
		};
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
		this.hero.group.position.set(0, 0, .35);
	}
	startLevel(opts) {
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
		this.p = {
			x: 2.4,
			y: .2,
			vx: 0,
			vy: 0,
			grounded: false,
			coyote: 0,
			airJumps: 1,
			ride: -1,
			land: 0
		};
		this.cpX = 2.4;
		this.cpY = .2;
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
	onKeyDown = (e) => {
		if ([
			"Space",
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight"
		].includes(e.code)) e.preventDefault();
		this.keys.add(e.code);
		if (e.code === "Escape" && this.mode === "play" && !this.cine) this.onEvent({ type: "pause" });
	};
	onKeyUp = (e) => this.keys.delete(e.code);
	onBlur = () => {
		this.keys.clear();
		this.pointerDown = false;
	};
	onVis = () => {
		if (document.visibilityState === "visible") this.audio.resume();
	};
	onPointerMove = (e) => {
		const rect = this.canvas.getBoundingClientRect();
		this.pointer.x = (e.clientX - rect.left) / Math.max(1, rect.width) * 2 - 1;
		this.pointer.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
		this.mouseFresh = 1.4;
	};
	onPointerDown = (e) => {
		if (e.button !== 0) return;
		this.pointerDown = true;
		this.audio.unlock();
	};
	onPointerUp = () => {
		this.pointerDown = false;
	};
	resize = () => {
		const parent = this.canvas.parentElement ?? this.canvas;
		const w = Math.max(1, parent.clientWidth);
		const h = Math.max(1, parent.clientHeight);
		this.renderer.setSize(w, h, false);
		this.camera.aspect = w / h;
		this.portrait = w < h;
		this.camera.fov = this.portrait ? 60 : 48;
		this.camera.updateProjectionMatrix();
	};
	held(code) {
		return this.keys.has(code) || this.forced.has(code);
	}
	frame = (now) => {
		this.raf = requestAnimationFrame(this.frame);
		if (!this.last) this.last = now;
		const dt = Math.min(.1, (now - this.last) / 1e3);
		this.last = now;
		if (this.mode === "play" && !this.paused) {
			this.acc += dt;
			let steps = 0;
			const h = 1 / 60;
			while (this.acc >= h && steps < 5) {
				this.step(h);
				this.acc -= h;
				steps++;
			}
			this.fps = this.fps * .94 + 1 / Math.max(dt, .001) * .06;
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
		if (this.hudAcc > .1) {
			this.hudAcc = 0;
			this.pushHud();
		}
	};
	step(dt) {
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
	control(dt) {
		let axis = 0;
		if (this.held("KeyA") || this.held("ArrowLeft")) axis -= 1;
		if (this.held("KeyD") || this.held("ArrowRight")) axis += 1;
		if (this.touch.using && Math.abs(this.touch.x) > .12) axis = this.touch.x;
		axis -= this.steer;
		axis = Math.max(-1, Math.min(1, axis));
		this.sprintHeld = this.held("ShiftLeft") || this.held("ShiftRight") || this.touch.sprint;
		const max = this.sprintHeld ? SPRINT : MOVE;
		const target = axis * max;
		const rate = axis === 0 ? this.p.grounded ? 30 : 4 : this.p.grounded ? 48 : 22;
		this.p.vx = approach(this.p.vx, target, rate * dt);
		if (Math.abs(axis) > .2) this.facing = axis > 0 ? 1 : -1;
		const jumpDown = this.held("Space") || this.touch.jump;
		const edge = jumpDown && !this.prevJump;
		this.prevJump = jumpDown;
		if (this.p.grounded) this.p.coyote = .12;
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
				this.p.vy = jumpV * .9;
				this.audio.jump();
				this.sparks.burst(this.p.x, this.p.y + .1, .4, 16769696, 8);
			}
		}
		if (!jumpDown && this.p.vy > 2) this.p.vy = Math.min(this.p.vy, 4.4);
		const g = GRAVITY * (this.held("ArrowDown") || this.touch.y < -.65 ? 1.7 : 1);
		this.p.vy -= g * dt;
		if (this.p.vy < -18) this.p.vy = -18;
		this.aim(axis);
		this.shootHeld = this.pointerDown || this.touch.shoot || this.held("KeyF") || this.held("KeyJ");
		if (this.shootHeld && Math.abs(this.dirx) > .3) this.facing = this.dirx > 0 ? 1 : -1;
	}
	aim(axis) {
		if (this.mouseFresh > 0 && !this.touch.using) {
			this.raycaster.setFromCamera(this.pointer, this.camera);
			const hit = this.raycaster.ray.intersectPlane(this.aimPlane, this.hit);
			if (hit) {
				const dx = hit.x - this.p.x;
				const dy = hit.y - (this.p.y + 1.05);
				const m = Math.hypot(dx, dy) || 1;
				this.dirx = dx / m;
				this.diry = dy / m;
				return;
			}
		}
		const up = this.held("ArrowUp") || this.touch.y > .55;
		if (up && Math.abs(axis) < .35) {
			this.dirx = 0;
			this.diry = 1;
		} else if (up) {
			this.dirx = this.facing * .7;
			this.diry = .72;
			const m = Math.hypot(this.dirx, this.diry);
			this.dirx /= m;
			this.diry /= m;
		} else {
			this.dirx = this.facing;
			this.diry = 0;
		}
	}
	simulate(dt, locked) {
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
	syncSolids(dt) {
		const level = this.level;
		if (!level) return;
		for (const s of level.solids) {
			s.dx = 0;
			s.dy = 0;
			if (s.dead) continue;
			if (s.kind === "moving" && s.baseX !== void 0 && s.baseY !== void 0) {
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
	overlap(x, y, s) {
		if (s.dead) return false;
		return x + PW / 2 > s.x - s.w / 2 && x - PW / 2 < s.x + s.w / 2 && y + PH > s.y - s.h / 2 && y < s.y + s.h / 2;
	}
	moveX(dt) {
		this.p.x += this.p.vx * dt;
		const solids = this.level?.solids ?? [];
		for (const s of solids) {
			if (!this.overlap(this.p.x, this.p.y, s)) continue;
			const top = s.y + s.h / 2;
			if (this.p.y >= top - .46 && this.p.y <= top + .05 && this.p.vy <= 2) {
				this.p.y = top;
				continue;
			}
			if (this.p.vx > 0) this.p.x = s.x - s.w / 2 - PW / 2 - .002;
			else if (this.p.vx < 0) this.p.x = s.x + s.w / 2 + PW / 2 + .002;
			else this.p.x += this.p.x < s.x ? -.02 : .02;
			this.p.vx = 0;
		}
		const level = this.level;
		if (level) this.p.x = Math.max(.6, Math.min(level.length - .8, this.p.x));
	}
	moveY(dt) {
		const prev = this.p.y;
		this.p.y += this.p.vy * dt;
		this.p.grounded = false;
		let ride = -1;
		const solids = this.level?.solids ?? [];
		for (let i = 0; i < solids.length; i++) {
			const s = solids[i];
			if (!this.overlap(this.p.x, this.p.y, s)) continue;
			const top = s.y + s.h / 2;
			const bot = s.y - s.h / 2;
			if (this.p.vy <= 0 && prev >= top - .12) {
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
					if (impact < -8) this.p.land = .12;
				}
			} else if (this.p.vy > 0 && prev + PH <= bot + .12) {
				this.p.y = bot - PH - .002;
				this.p.vy = 0;
				if (s.kind === "break") this.chip(s, 1);
			}
		}
		this.p.ride = ride;
	}
	afterMove(dt) {
		const solids = this.level?.solids ?? [];
		if (this.p.ride >= 0) {
			const s = solids[this.p.ride];
			if (s?.kind === "crumble" && !s.falling) {
				s.fall = (s.fall ?? 0) + dt;
				if ((s.fall ?? 0) > .45) s.falling = true;
			}
			if (s?.kind === "pulse") {
				const period = s.period ?? 2.2;
				const duty = s.duty ?? .4;
				if ((this.time + (s.phase ?? 0)) % period < period * duty) this.damage(1);
			}
		}
		for (const s of solids) if (s.kind === "crumble" && !s.falling && this.p.ride !== solids.indexOf(s)) s.fall = 0;
		if (this.p.grounded && this.p.x > this.cpX + 16) {
			this.cpX = this.p.x;
			this.cpY = this.p.y;
		}
		if (this.p.y < -7.5 && !this.cine) {
			this.damage(1);
			if (!this.cine) {
				this.p.x = this.cpX;
				this.p.y = this.cpY + .2;
				this.p.vx = 0;
				this.p.vy = 0;
			}
		}
	}
	chip(s, dmg) {
		s.hp = (s.hp ?? 3) - dmg;
		this.sparks.burst(s.x, s.y, .4, 15183946, 6);
		if ((s.hp ?? 0) <= 0) {
			s.dead = true;
			this.audio.hit();
		}
	}
	tryShoot(dt) {
		this.shootT -= dt;
		if (this.shootT > 0) return;
		const lvl = this.flameT > 0 ? 5 : this.weapon;
		const cool = [
			.28,
			.28,
			.32,
			.38,
			.5,
			.55
		][lvl] ?? .3;
		this.shootT = cool;
		const ox = this.p.x + this.dirx * .55;
		const oy = this.p.y + 1.05 + this.diry * .2;
		const spawn = (dx, dy, speed, dmg, r, hits, explode) => {
			const m = Math.hypot(dx, dy) || 1;
			this.spawnBolt(ox, oy, dx / m * speed, dy / m * speed, dmg, r, true, hits, explode);
		};
		if (lvl <= 1) spawn(this.dirx, this.diry, 18, 1, .16, 1, false);
		else if (lvl === 2) {
			const px = -this.diry;
			const py = this.dirx;
			spawn(this.dirx + px * .08, this.diry + py * .08, 18, 1, .14, 1, false);
			spawn(this.dirx - px * .08, this.diry - py * .08, 18, 1, .14, 1, false);
		} else if (lvl === 3) spawn(this.dirx, this.diry, 22, 2, .24, 3, false);
		else if (lvl === 4) spawn(this.dirx, this.diry, 13, 3, .32, 1, true);
		else {
			spawn(this.dirx, this.diry, 17, 2, .2, 4, false);
			spawn(this.dirx - this.diry * .45, this.diry + this.dirx * .45, 16, 2, .18, 2, false);
			spawn(this.dirx + this.diry * .45, this.diry - this.dirx * .45, 16, 2, .18, 2, false);
		}
		this.audio.shoot();
		this.sparks.burst(ox, oy, .45, 16770736, 5);
	}
	spawnBolt(x, y, vx, vy, dmg, r, friendly, hits, explode) {
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
		bolt.mesh.material.color.set(friendly ? explode ? 16747066 : 16769690 : 14834212);
	}
	updateBolts(dt) {
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
					const f = this.foes[i];
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
			} else if (Math.hypot(b.x - this.p.x, b.y - (this.p.y + .8)) < .55 + b.r) {
				this.damage(1);
				b.alive = false;
			}
		}
	}
	hitFoe(f, b) {
		const cx = f.x;
		const cy = f.y + f.h * .5;
		if (Math.hypot(b.x - cx, b.y - cy) > f.w * .5 + b.r) return false;
		this.wound(f, b.dmg);
		return true;
	}
	explode(b) {
		this.sparks.burst(b.x, b.y, .4, 16747066, 16);
		this.shakeMag = Math.min(.4, this.shakeMag + .12);
		for (const f of this.foes) {
			if (!f.alive) continue;
			if (Math.hypot(f.x - b.x, f.y + f.h * .5 - b.y) < 1.7) this.wound(f, 2);
		}
		if (this.boss && Math.hypot(this.boss.x - b.x, this.boss.y + 1.4 - b.y) < 2.2) this.hurtBoss(2);
	}
	wound(f, dmg) {
		if (!f.alive) return;
		f.hp -= dmg;
		f.hurt = .12;
		this.audio.hit();
		this.sparks.burst(f.x, f.y + f.h * .6, .4, 16765562, 8);
		if (f.hp <= 0) {
			f.alive = false;
			f.mesh.visible = false;
			this.kills += 1;
			this.shakeMag = Math.min(.35, this.shakeMag + .08);
			this.sparks.burst(f.x, f.y + .6, .4, 15183946, 14);
		}
	}
	hurtBoss(dmg) {
		if (!this.boss) return;
		this.boss.hp -= dmg;
		this.shakeMag = Math.min(.5, this.shakeMag + .1);
		this.audio.hit();
		this.sparks.burst(this.boss.x, this.boss.y + this.boss.h * .55, .5, 16769696, 10);
		const phase = this.boss.hp > this.boss.max * .66 ? 1 : this.boss.hp > this.boss.max * .33 ? 2 : 3;
		this.boss.phase = phase;
		if (this.boss.hp <= 0) {
			this.sparks.burst(this.boss.x, this.boss.y + 1.5, .5, 16773570, 28);
			this.boss.mesh.visible = false;
			this.kills += 1;
			this.boss = null;
			this.beginClear();
		}
	}
	updateFoes(dt) {
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
				f.y += Math.sin(this.time * 3 + f.x) * .6 * dt;
				if (f.cool <= 0 && chase) {
					f.cool = 1.75;
					const dx = this.p.x - f.x;
					const dy = this.p.y + .8 - (f.y + .4);
					const m = Math.hypot(dx, dy) || 1;
					this.spawnBolt(f.x, f.y + .5, dx / m * 7.5, dy / m * 7.5, 1, .16, false, 1, false);
				}
			} else {
				f.vy -= GRAVITY * dt;
				f.y += f.vy * dt;
				for (const s of this.level?.solids ?? []) {
					if (s.dead) continue;
					const top = s.y + s.h / 2;
					if (f.x > s.x - s.w / 2 && f.x < s.x + s.w / 2 && f.y <= top && f.y >= top - .45 && f.vy <= 0) {
						f.y = top;
						f.vy = 0;
					}
				}
				if (f.y < -6) f.alive = false;
			}
			if (Math.abs(this.p.x - f.x) < f.w * .55 + .28 && this.p.y < f.y + f.h && this.p.y + PH > f.y) {
				if (this.starT > 0) this.wound(f, 9);
				else if (f.cool <= 0) {
					f.cool = .7;
					this.damage(1);
				}
			}
			animateActor(f.mesh, this.time, f.kind);
			f.mesh.position.set(f.x, f.y, .15);
			f.mesh.rotation.y = f.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
			f.mesh.visible = f.alive && (f.hurt <= 0 || Math.sin(this.time * 45) > 0);
		}
	}
	updateBoss(dt) {
		const boss = this.boss;
		if (!boss || !this.bossActive) return;
		boss.cool -= dt;
		const phase = boss.phase;
		if (boss.dash > 0) {
			boss.dash -= dt;
			boss.x += boss.dir * 7.5 * dt;
		} else if (phase >= 3 && boss.cool < .2 && Math.random() < dt * .4) {
			boss.dir = Math.sign(this.p.x - boss.x) || 1;
			boss.dash = .55;
			this.shakeMag = Math.min(.45, this.shakeMag + .15);
		}
		const minX = 3;
		const maxX = (this.level?.length ?? 30) - 4;
		boss.x = Math.max(minX, Math.min(maxX, boss.x));
		if (boss.cool <= 0) {
			boss.cool = phase === 1 ? 1.55 : phase === 2 ? 1.15 : .85;
			const dx = this.p.x - boss.x;
			const dy = this.p.y + .9 - (boss.y + boss.h * .6);
			const m = Math.hypot(dx, dy) || 1;
			this.spawnBolt(boss.x, boss.y + boss.h * .62, dx / m * 8.2, dy / m * 8.2, 1, .2, false, 1, false);
			if (phase >= 2 && boss.cool > .5) this.waves.push({
				x: boss.x,
				r: .4,
				life: 1.3,
				mesh: this.makeWave()
			});
			if (phase >= 3 && this.foes.filter((f) => f.alive).length < 2) this.spawnFoe("shadow", boss.x - boss.dir * 1.5, .2);
		}
		if (Math.abs(this.p.x - boss.x) < boss.w * .42 && this.p.y < boss.y + boss.h && this.p.y + PH > boss.y) this.damage(1);
		animateActor(boss.mesh, this.time, this.level?.titan ? "titan" : "boss");
		boss.mesh.position.set(boss.x, boss.y, 0);
		boss.mesh.rotation.y = this.p.x < boss.x ? -Math.PI / 2 : Math.PI / 2;
	}
	updateWaves(dt) {
		for (const w of this.waves) {
			w.life -= dt;
			w.r += dt * 7;
			w.mesh.position.set(w.x, .08, .2);
			w.mesh.scale.setScalar(w.r);
			w.mesh.material.opacity = Math.max(0, w.life);
			w.mesh.visible = w.life > 0;
			if (w.life > 0 && this.p.grounded && Math.abs(this.p.x - w.x) < w.r && Math.abs(this.p.x - w.x) > w.r - .85 && this.p.y < 1.05) this.damage(1);
		}
		this.waves = this.waves.filter((w) => w.life > 0);
	}
	updatePickups(dt) {
		for (const p of this.pickups) {
			if (!p.alive) continue;
			if (this.magnetT > 0 && (p.kind === "coin" || p.kind === "flame")) {
				const dx = this.p.x - p.x;
				const dy = this.p.y + .8 - p.y;
				const d = Math.hypot(dx, dy);
				if (d < 4.4 && d > .05) {
					p.x += dx / d * 9 * dt;
					p.y += dy / d * 9 * dt;
				}
			}
			if (Math.hypot(p.x - this.p.x, p.y - (this.p.y + .7)) < .72) this.collect(p);
			p.mesh.position.set(p.x, p.base + Math.sin(this.time * 3 + p.x) * .12, .4);
			p.mesh.rotation.y = this.time * 2;
		}
	}
	collect(p) {
		if (!p.alive) return;
		p.alive = false;
		p.mesh.visible = false;
		if (p.kind === "coin") {
			this.coins += 1;
			this.audio.coin();
			this.sparks.burst(p.x, p.y, .4, 15183946, 6);
		} else if (p.kind === "flame") {
			this.flames += 1;
			this.audio.flame();
			this.sparks.burst(p.x, p.y, .4, 16756794, 10);
			this.shakeMag = Math.min(.2, this.shakeMag + .05);
			this.igniteStreet(p.x);
		} else this.grant(p.sub);
	}
	grant(id) {
		this.audio.flame();
		if (id === "star") this.starT = 8;
		else if (id === "mega") {
			this.weapon = Math.min(5, this.weapon + 1);
			this.onEvent({
				type: "weapon",
				level: this.weapon
			});
		} else if (id === "shield") this.shield = 3;
		else if (id === "jump") this.jumpT = 12;
		else if (id === "magnet") this.magnetT = 12;
		else if (id === "life") this.hearts = Math.min(this.maxHearts, this.hearts + 1);
		else if (id === "flame") this.flameT = 10;
		this.sparks.burst(this.p.x, this.p.y + 1, .4, 16773570, 12);
	}
	damage(n) {
		if (this.invuln > 0 || this.starT > 0 || this.cine) return;
		if (this.shield > 0) {
			this.shield -= 1;
			this.invuln = .45;
			this.audio.hurt();
			return;
		}
		this.hearts -= n;
		this.noDamage = false;
		this.invuln = 1.15;
		this.shakeMag = Math.min(.5, this.shakeMag + .22);
		this.p.vy = 6.5;
		this.p.vx = -this.facing * 3.5;
		this.audio.hurt();
		if (this.hearts <= 0) {
			this.hearts = 0;
			this.cine = {
				kind: "dead",
				t: 0,
				dur: .85
			};
		}
	}
	beginClear() {
		if (this.cine?.kind === "clear") return;
		this.cine = {
			kind: "clear",
			t: 0,
			dur: 2.15
		};
		this.shakeMag = Math.min(.3, this.shakeMag + .12);
		this.diyaAwake = true;
		this.lightReach = 9999;
		for (const f of this.facades) {
			f.target = 1;
			f.lit = 1;
		}
		this.wakeLight.intensity = this.quality === "low" ? 1.15 : 2.15;
		this.wakeLight.position.set(this.p.x, 3.5, -5);
		for (const m of this.landmarkMats) m.emissiveIntensity = .7;
		this.paintFacades();
		this.audio.win();
	}
	beginBoss() {
		const level = this.level;
		if (!level || this.boss) return;
		const titan = level.titan;
		const stats = actorStats(titan ? "titan" : "boss");
		const mesh = makeActor(titan ? "titan" : "boss");
		this.levelGroup.add(mesh);
		const hp = Math.round(stats.hp * (titan ? 1 : 1 + this.cityIndex * .035));
		this.boss = {
			name: level.bossName,
			hp,
			max: hp,
			phase: 1,
			x: Math.min(level.length - 5, Math.max(this.p.x + 8, level.length * .72)),
			y: 0,
			w: stats.w,
			h: stats.h,
			cool: 1.2,
			dash: 0,
			dir: -1,
			mesh
		};
		this.cine = {
			kind: "boss",
			t: 0,
			dur: 1.8
		};
		this.shakeMag = .4;
		this.audio.setMode("boss");
		this.onEvent({
			type: "boss",
			name: level.bossName
		});
	}
	finishCine() {
		const kind = this.cine?.kind;
		this.cine = null;
		if (kind === "boss") {
			this.bossActive = true;
			return;
		}
		this.paused = true;
		if (kind === "clear") this.onEvent({
			type: "cleared",
			payload: this.makePayload()
		});
		else if (kind === "dead") {
			this.audio.defeat();
			this.onEvent({ type: "down" });
		}
	}
	makePayload() {
		const level = this.level;
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
			coins: this.coins
		};
	}
	areaIllum() {
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
		return Math.max(0, Math.min(1, f * .62 + c * .23 + e * .15));
	}
	igniteStreet(x) {
		this.diyaAwake = true;
		const reach = Math.max(this.lightReach, Math.max(this.p.x, x) + 4.2);
		this.lightReach = reach;
		for (const f of this.facades) {
			if (f.target >= 1 || f.x > reach) continue;
			f.target = 1;
			this.sparks.burst(f.x, 2.6, -1.5, 16765562, 8);
		}
	}
	spreadLight(dt) {
		if (this.diyaAwake) {
			const tip = this.p.x + 1.15;
			if (tip > this.lightReach) this.lightReach = tip;
		}
		let dirty = false;
		for (const f of this.facades) {
			if (this.diyaAwake && f.target < 1 && f.x <= this.lightReach) {
				f.target = 1;
				this.sparks.burst(f.x, 2.6, -1.5, 16765562, 6);
				dirty = true;
			}
			const next = approach(f.lit, f.target, dt * 2.4);
			if (Math.abs(next - f.lit) > .012) {
				f.lit = next;
				dirty = true;
			} else if (f.lit !== f.target) {
				f.lit = f.target;
				dirty = true;
			}
		}
		const want = this.diyaAwake ? this.quality === "low" ? 1.15 : 2.15 : 0;
		if (this.mode === "play") {
			this.wakeLight.intensity = approach(this.wakeLight.intensity, want, dt * 3.2);
			if (this.diyaAwake) this.wakeLight.position.set(Math.min(this.lightReach, this.p.x + 2.2), 3.5, -5.2);
		}
		const glow = this.diyaAwake && this.landmarkX <= this.lightReach + 1.5 ? .7 : .08;
		for (const m of this.landmarkMats) if (Math.abs(m.emissiveIntensity - glow) > .03) m.emissiveIntensity = glow;
		if (dirty || Math.abs(this.lightReach - this.paintedReach) > .35) {
			this.paintedReach = this.lightReach;
			this.paintFacades();
		}
	}
	spawnFoe(kind, x, y) {
		const stats = actorStats(kind);
		const mesh = makeActor(kind);
		this.levelGroup.add(mesh);
		const foe = {
			kind,
			x,
			y,
			vy: 0,
			hp: stats.hp,
			dir: Math.random() > .5 ? 1 : -1,
			left: x - 2.5,
			right: x + 2.6,
			cool: .4,
			hurt: 0,
			alive: true,
			fly: stats.fly,
			w: stats.w,
			h: stats.h,
			mesh
		};
		this.foes.push(foe);
		return foe;
	}
	render(dt) {
		this.shakeMag *= Math.exp(-3.2 * Math.max(dt, .001));
		const shooting = this.shootHeld && this.mode === "play" && !this.cine;
		const along = this.dirx * this.facing;
		const aim = Math.atan2(this.diry, Math.max(.08, along));
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
			defeat: this.cine?.kind === "dead" || this.hearts <= 0 && this.mode === "play",
			land: this.p.land,
			facing: this.facing
		});
		if (this.mode === "play") {
			const blink = this.invuln > 0 && Math.sin(this.time * 28) > 0;
			this.hero.group.visible = !blink;
			this.hero.group.position.set(this.p.x, this.p.y + this.hero.bobY, .35);
			const lookX = MathUtils.clamp(this.p.x + this.facing * 1.6, 1, (this.level?.length ?? 20) - 1);
			const lookY = this.p.y + 1.25;
			const dist = this.portrait ? 16.5 : this.cine?.kind === "boss" ? 17 : 12.8;
			const lift = this.cine?.kind === "clear" ? 2.4 : this.cine?.kind === "boss" ? 2.2 : 1.45;
			this.desired.set(lookX, lookY + lift, dist);
			this.look.set(lookX, lookY, 0);
		} else {
			this.hero.group.visible = true;
			this.hero.group.position.set(.2, this.hero.bobY, .35);
			const a = this.time * .18;
			this.desired.set(Math.sin(a) * 1.6, 2.15, 8.2);
			this.look.set(.2, 1.25, 0);
		}
		const k = 1 - Math.exp(-3.4 * Math.max(dt, .001));
		this.camera.position.lerp(this.desired, k);
		this.camera.position.x += Math.sin(this.time * 43) * this.shakeMag;
		this.camera.position.y += Math.cos(this.time * 37) * this.shakeMag * .6;
		this.camera.lookAt(this.look);
		this.dir.position.set(this.camera.position.x + 8, 18, 12);
		this.dir.target.position.set(this.look.x, 0, 0);
		this.dir.target.updateMatrixWorld();
		if (this.level) for (let i = 0; i < this.level.solids.length; i++) {
			const s = this.level.solids[i];
			const mesh = this.solidMeshes[i];
			if (!mesh) continue;
			mesh.visible = !s.dead;
			mesh.position.set(s.x, s.y, 0);
			if (s.kind === "pulse") {
				const period = s.period ?? 2.2;
				const on = (this.time + (s.phase ?? 0)) % period < period * (s.duty ?? .4);
				const mat = mesh.material;
				mat.emissive.set(on ? 14834212 : 3810328);
				mat.emissiveIntensity = on ? .9 : .15;
			}
		}
		for (const b of this.bolts) {
			b.mesh.visible = b.alive;
			if (!b.alive) continue;
			b.mesh.position.set(b.x, b.y, .45);
		}
		this.sparks.update(dt);
		this.renderer.render(this.scene, this.camera);
	}
	pushHud() {
		Math.max(1, this.cleared.length || this.level?.solids.length ? this.cleared.length || 1 : 1);
		const areas = this.cleared.length || 1;
		let sum = 0;
		for (let i = 0; i < areas; i++) sum += i === this.areaIndex && this.mode === "play" ? this.areaIllum() * 100 : this.illums[i] ?? 0;
		const power = this.starT > 0 ? "Golden Star" : this.flameT > 0 ? "Flame Power" : this.jumpT > 0 ? "Super Jump" : this.magnetT > 0 ? "Light Magnet" : this.shield > 0 ? "Light Shield" : null;
		const hint = this.mode === "play" && this.opts?.cityId === "gurugram" && this.areaIndex === 0 && this.runTime < 8 ? "Buildings light as Goranksh crosses them. Touch a street diya to flare the block." : null;
		const hud = {
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
			boss: this.boss && this.bossActive ? {
				name: this.boss.name,
				hp: Math.max(0, this.boss.hp),
				max: this.boss.max,
				phase: this.boss.phase
			} : null,
			time: this.runTime,
			shield: this.shield,
			star: this.starT > 0,
			power,
			hint,
			noDamage: this.noDamage
		};
		this.onHud(hud);
	}
	paintTheme(theme) {
		this.scene.background = new Color(theme.sky);
		this.scene.fog = new Fog(theme.fog, 18, this.portrait ? 46 : 62);
		this.hemi.color.set(theme.sky);
		this.hemi.groundColor.set(theme.ground);
	}
	clearWorld() {
		this.scene.remove(this.levelGroup);
		for (const m of this.trashMat) m.dispose();
		for (const g of this.trashGeo) g.dispose();
		for (const t of this.trashTex) t.dispose();
		this.trashMat = [];
		this.trashGeo = [];
		this.trashTex = [];
		this.levelGroup = new Group();
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
		this.paintedReach = -1e3;
		this.landmarkMats = [];
		this.landmarkX = 0;
		this.wakeLight.intensity = 0;
		this.boss = null;
		for (const b of this.bolts) {
			b.alive = false;
			b.mesh.visible = false;
		}
	}
	buildDiorama() {
		const theme = {
			sky: "#241848",
			fog: "#120e22",
			ground: "#2a3344",
			road: "#3c4a60",
			roof: "#2a3344",
			glass: "#8eafc4",
			foliage: "#1d3b34",
			accent: "#e7b04a",
			building: "#1b2433"
		};
		this.paintTheme(theme);
		const mat = new MeshStandardMaterial({
			color: theme.road,
			roughness: .86
		});
		this.trashMat.push(mat);
		const ground = new Mesh(this.lib.box, mat);
		ground.scale.set(16, 2, 8);
		ground.position.set(0, -1, 0);
		ground.receiveShadow = true;
		this.levelGroup.add(ground);
		this.addBuildings(theme, 28, 0, true);
		this.addLights(18);
		this.addLandmark("glass", 6, theme);
		this.wakeLight.intensity = 1.35;
		this.wakeLight.position.set(2, 3.2, -4);
		for (const m of this.landmarkMats) m.emissiveIntensity = .55;
		this.hero.group.position.set(.2, 0, .35);
	}
	buildSolids(level) {
		const theme = level.theme;
		for (const s of level.solids) {
			const color = s.style === "glass" ? theme.glass : s.style === "bridge" ? theme.roof : s.style === "sand" ? theme.ground : s.style === "spire" ? theme.building : theme.road;
			const mat = new MeshStandardMaterial({
				color,
				roughness: s.style === "glass" ? .28 : .84,
				metalness: s.style === "glass" ? .35 : .02,
				emissive: s.kind === "bounce" ? 15183946 : 0,
				emissiveIntensity: s.kind === "bounce" ? .35 : 0
			});
			this.trashMat.push(mat);
			const mesh = new Mesh(this.lib.box, mat);
			const depth = s.style === "road" ? 5 : s.style === "bridge" ? 1.5 : 2.6;
			mesh.scale.set(s.w, s.h, depth);
			mesh.position.set(s.x, s.y, 0);
			mesh.castShadow = this.quality !== "low";
			mesh.receiveShadow = true;
			this.levelGroup.add(mesh);
			this.solidMeshes.push(mesh);
		}
	}
	buildSpawns(level) {
		for (const s of level.spawns) {
			if (s.kind === "enemy") {
				const kind = s.sub || "shadow";
				this.spawnFoe(kind, s.x, s.y);
				this.foeTotal += 1;
				continue;
			}
			const mesh = this.pickupMesh(s.kind, s.sub ?? "");
			this.levelGroup.add(mesh);
			this.pickups.push({
				kind: s.kind,
				sub: s.sub ?? "",
				x: s.x,
				y: s.y,
				base: s.y,
				alive: true,
				mesh
			});
		}
	}
	pickupMesh(kind, sub) {
		if (kind === "flame") {
			const brass = new MeshStandardMaterial({
				color: 13935180,
				emissive: 9062930,
				emissiveIntensity: .5,
				roughness: .28,
				metalness: .82
			});
			const fire = new MeshStandardMaterial({
				color: 16756794,
				emissive: 16761178,
				emissiveIntensity: 1,
				roughness: .35
			});
			this.trashMat.push(brass, fire);
			const g = new Group();
			const bowl = new Mesh(this.lib.bowl, brass);
			const wick = new Mesh(this.lib.flame, fire);
			wick.position.y = .28;
			wick.scale.setScalar(.9);
			g.add(bowl, wick);
			return g;
		}
		let geo = this.lib.coin;
		let color = 15183946;
		if (kind === "power") {
			geo = sub === "shield" ? this.lib.torus : sub === "jump" ? this.lib.box : this.lib.sphere;
			color = sub === "life" ? 16773570 : sub === "flame" ? 14834212 : 15183946;
		}
		const mat = new MeshStandardMaterial({
			color,
			emissive: color,
			emissiveIntensity: .55,
			roughness: .35,
			metalness: .4
		});
		this.trashMat.push(mat);
		const mesh = new Mesh(geo, mat);
		if (kind === "coin") mesh.rotation.x = Math.PI / 2;
		if (sub === "jump") mesh.scale.set(.28, .5, .28);
		else if (kind === "power" && sub !== "shield") mesh.scale.setScalar(.28);
		else if (kind === "power") mesh.scale.setScalar(1.1);
		mesh.castShadow = true;
		return mesh;
	}
	dress(level) {
		this.addBuildings(level.theme, level.length, -2);
		this.addLights(level.length);
		this.addLandmark(level.landmarkKind, Math.min(level.length - 4, level.boss ? level.length * .78 : level.goalX), level.theme);
		const sign = labelTexture(level.name, level.blurb);
		this.trashTex.push(sign);
		const signMat = new MeshBasicMaterial({
			map: sign,
			transparent: true,
			depthWrite: false
		});
		this.trashMat.push(signMat);
		const planeGeo = new PlaneGeometry(3.4, 1.7);
		this.trashGeo.push(planeGeo);
		const plane = new Mesh(planeGeo, signMat);
		plane.position.set(4.2, 2.5, -.4);
		this.levelGroup.add(plane);
		this.addShop(Math.max(8, (level.boss ? level.length * .4 : level.goalX) - 6));
		const waterGeo = new PlaneGeometry(level.length + 30, 18);
		this.trashGeo.push(waterGeo);
		const waterMat = new MeshStandardMaterial({
			color: level.theme.glass,
			transparent: true,
			opacity: .35,
			roughness: .2,
			metalness: .1
		});
		this.trashMat.push(waterMat);
		const water = new Mesh(waterGeo, waterMat);
		water.rotation.x = -Math.PI / 2;
		water.position.set(level.length / 2, -1.35, -1);
		this.levelGroup.add(water);
	}
	addBuildings(theme, length, zBias, prelit = false) {
		const bodyMat = new MeshStandardMaterial({
			color: 16777215,
			roughness: .9
		});
		this.trashMat.push(bodyMat);
		this.bodyOff.set(theme.building).multiplyScalar(.42);
		this.cBody.set(theme.accent);
		this.bodyOn.copy(this.bodyOff).lerp(this.cBody, .78);
		const spots = [];
		for (let x = -4; x < length + 6; x += 6.5) {
			const h = 5 + Math.abs(Math.floor(x)) * 5 % 10;
			const back = Math.floor(x) % 2 === 0;
			spots.push({
				x,
				h,
				w: 4.4,
				d: 3.2,
				z: (back ? -12 : -7.2) + zBias
			});
		}
		const bodies = new InstancedMesh(this.lib.box, bodyMat, Math.max(1, spots.length));
		bodies.castShadow = false;
		bodies.receiveShadow = true;
		const dummy = new Object3D();
		const winMat = new MeshBasicMaterial({ color: 16777215 });
		this.trashMat.push(winMat);
		const wins = new InstancedMesh(this.lib.box, winMat, Math.max(1, spots.length * 8));
		let wi = 0;
		this.facades = [];
		for (let i = 0; i < spots.length; i++) {
			const s = spots[i];
			dummy.position.set(s.x, s.h / 2 - .2, s.z);
			dummy.scale.set(s.w, s.h, s.d);
			dummy.rotation.set(0, 0, 0);
			dummy.updateMatrix();
			bodies.setMatrixAt(i, dummy.matrix);
			bodies.setColorAt(i, this.bodyOff);
			const start = wi;
			for (let row = 0; row < 4; row++) for (let col = 0; col < 2; col++) {
				dummy.position.set(s.x - .9 + col * 1.5, 1.2 + row * (s.h / 5.2), s.z + s.d / 2 + .05);
				dummy.scale.set(.7, .9, .08);
				dummy.updateMatrix();
				wins.setMatrixAt(wi, dummy.matrix);
				wins.setColorAt(wi, this.winOff);
				wi++;
			}
			this.facades.push({
				x: s.x,
				h: s.h,
				index: i,
				start,
				count: wi - start,
				lit: 0,
				target: 0
			});
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
		const trunkMat = new MeshStandardMaterial({
			color: 3812388,
			roughness: .8
		});
		const leafMat = new MeshStandardMaterial({
			color: theme.foliage,
			roughness: .75
		});
		this.trashMat.push(trunkMat, leafMat);
		for (let i = 0; i < 5; i++) {
			const x = 6 + i * (length / 6);
			const trunk = new Mesh(this.lib.box, trunkMat);
			trunk.scale.set(.25, 1.3, .25);
			trunk.position.set(x, .65, -2.2);
			const leaf = new Mesh(this.lib.sphere, leafMat);
			leaf.scale.set(.8, 1, .8);
			leaf.position.set(x, 1.7, -2.2);
			this.levelGroup.add(trunk, leaf);
		}
		this.paintFacades();
	}
	addLights(length) {
		const matA = new MeshBasicMaterial({ color: 16777215 });
		const matB = new MeshBasicMaterial({ color: 16777215 });
		this.trashMat.push(matA, matB);
		const n = Math.max(8, Math.floor(length / 1.6));
		const a = new InstancedMesh(this.lib.sphere, matA, n);
		const b = new InstancedMesh(this.lib.sphere, matB, n);
		const dummy = new Object3D();
		this.lampRecs = [];
		for (let i = 0; i < n; i++) {
			const x = i * 1.6;
			dummy.position.set(x, 3.1 + Math.sin(i * .8) * .35, -1.5);
			dummy.scale.setScalar(.12);
			dummy.rotation.set(0, 0, 0);
			dummy.updateMatrix();
			const mesh = i % 2 === 0 ? a : b;
			const hidden = i % 2 === 0 ? b : a;
			mesh.setMatrixAt(i, dummy.matrix);
			mesh.setColorAt(i, this.lampDim);
			this.lampRecs.push({
				mesh,
				index: i,
				x
			});
			dummy.scale.setScalar(.001);
			dummy.updateMatrix();
			hidden.setMatrixAt(i, dummy.matrix);
			hidden.setColorAt(i, this.lampDim);
		}
		this.lampMeshes = [a, b];
		this.levelGroup.add(a, b);
		this.paintFacades();
	}
	addLandmark(kind, x, theme) {
		const g = new Group();
		const mat = new MeshStandardMaterial({
			color: theme.glass,
			roughness: .4,
			metalness: .2,
			emissive: theme.accent,
			emissiveIntensity: .08
		});
		const dark = new MeshStandardMaterial({
			color: theme.building,
			roughness: .8
		});
		this.trashMat.push(mat, dark);
		const box = (w, h, d, px, py, pz, material = dark) => {
			const m = new Mesh(this.lib.box, material);
			m.scale.set(w, h, d);
			m.position.set(px, py, pz);
			g.add(m);
		};
		if (kind === "arch") {
			box(.6, 6, .8, -1.6, 3, 0);
			box(.6, 6, .8, 1.6, 3, 0);
			box(4, .6, .9, 0, 6.1, 0, mat);
		} else if (kind === "dome") {
			box(3.2, 2.2, 3, 0, 1.1, 0);
			const dome = new Mesh(this.lib.sphere, mat);
			dome.scale.set(1.5, 1.1, 1.5);
			dome.position.y = 2.8;
			g.add(dome);
		} else if (kind === "palace" || kind === "fort") {
			box(6, 3, 2.4, 0, 1.5, 0);
			box(1, 2.4, 1, -2.4, 3.4, 0, mat);
			box(1, 3.2, 1, 0, 3.8, 0, mat);
			box(1, 2.4, 1, 2.4, 3.4, 0, mat);
		} else if (kind === "spire") {
			const coneGeo = new ConeGeometry(.7, 3.2, 6);
			this.trashGeo.push(coneGeo);
			for (const px of [
				-1.1,
				0,
				1.1
			]) {
				const c = new Mesh(coneGeo, mat);
				c.position.set(px, 2.2, 0);
				c.scale.setScalar(px === 0 ? 1.2 : .8);
				g.add(c);
			}
		} else if (kind === "ghat") for (let i = 0; i < 4; i++) box(5 - i * .4, .35, 2.2, 0, .3 + i * .35, -i * .7);
		else if (kind === "bridge") {
			box(.4, 5, .4, -2, 2.5, 0);
			box(.4, 5, .4, 2, 2.5, 0);
			box(4.4, .25, .8, 0, 3.6, 0, mat);
		} else if (kind === "lake") {
			box(2.2, 1.4, 2, 0, .8, 0);
			const dome = new Mesh(this.lib.sphere, mat);
			dome.scale.set(.9, .6, .9);
			dome.position.y = 1.8;
			g.add(dome);
		} else if (kind === "map") for (let i = 0; i < 5; i++) box(.7, .8 + i % 3 * .4, .7, (i - 2) * 1.1, .6, 0, mat);
		else {
			box(1.4, 7, 1.4, -1.4, 3.5, 0, mat);
			box(1.6, 9, 1.6, .4, 4.5, 0);
			box(1.2, 6, 1.2, 1.8, 3, 0, mat);
		}
		g.position.set(x, 0, -4.5);
		this.landmarkX = x;
		this.landmarkMats = [mat];
		this.levelGroup.add(g);
	}
	addShop(x) {
		const tex = labelTexture("DesiDiya", "Night lamps · diyas · fairy lights");
		this.trashTex.push(tex);
		const mat = new MeshBasicMaterial({
			map: tex,
			transparent: true
		});
		this.trashMat.push(mat);
		const geo = new PlaneGeometry(2.6, 1.3);
		this.trashGeo.push(geo);
		const plane = new Mesh(geo, mat);
		plane.position.set(x, 2.15, -1.2);
		const stallMat = new MeshStandardMaterial({
			color: 2366488,
			roughness: .7
		});
		this.trashMat.push(stallMat);
		const stall = new Mesh(this.lib.box, stallMat);
		stall.scale.set(2.4, 1.4, 1.2);
		stall.position.set(x, .7, -1.6);
		this.levelGroup.add(stall, plane);
	}
	paintFacades() {
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
			const on = this.diyaAwake && lamp.x <= this.lightReach + .4 || this.lightReach > 900;
			lamp.mesh.setColorAt(lamp.index, on ? lamp.index % 2 === 0 ? this.lampGold : this.lampEmber : this.lampDim);
		}
		for (const mesh of this.lampMeshes) if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
	}
	makeWave() {
		const geo = new TorusGeometry(1, .08, 6, 18);
		this.trashGeo.push(geo);
		const mat = new MeshBasicMaterial({
			color: 14834212,
			transparent: true,
			opacity: .85
		});
		this.trashMat.push(mat);
		const mesh = new Mesh(geo, mat);
		mesh.rotation.x = Math.PI / 2;
		this.levelGroup.add(mesh);
		return mesh;
	}
	makeBoltPool() {
		for (let i = 0; i < 36; i++) {
			const mat = new MeshBasicMaterial({ color: 16769690 });
			const mesh = new Mesh(this.lib.sphere, mat);
			mesh.visible = false;
			mesh.scale.setScalar(.2);
			this.scene.add(mesh);
			this.bolts.push({
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				life: 0,
				dmg: 1,
				r: .16,
				friendly: true,
				hits: 1,
				alive: false,
				explode: false,
				seen: [],
				mesh
			});
		}
	}
};
var Sparks = class {
	pos;
	vel;
	life;
	geo;
	points;
	n;
	color = new Color();
	constructor(parent, n) {
		this.n = n;
		this.pos = new Float32Array(n * 3);
		this.vel = new Float32Array(n * 3);
		this.life = new Float32Array(n);
		const col = new Float32Array(n * 3);
		this.geo = new BufferGeometry();
		this.geo.setAttribute("position", new BufferAttribute(this.pos, 3));
		this.geo.setAttribute("color", new BufferAttribute(col, 3));
		const mat = new PointsMaterial({
			size: .14,
			vertexColors: true,
			transparent: true,
			depthWrite: false,
			blending: 2
		});
		this.points = new Points(this.geo, mat);
		parent.add(this.points);
	}
	burst(x, y, z, hex, count) {
		this.color.setHex(hex);
		const col = this.geo.getAttribute("color");
		let left = count;
		for (let i = 0; i < this.n && left > 0; i++) {
			if ((this.life[i] ?? 0) > 0) continue;
			this.life[i] = .28 + Math.random() * .28;
			this.pos[i * 3] = x;
			this.pos[i * 3 + 1] = y;
			this.pos[i * 3 + 2] = z;
			this.vel[i * 3] = (Math.random() - .5) * 7;
			this.vel[i * 3 + 1] = Math.random() * 5.5;
			this.vel[i * 3 + 2] = (Math.random() - .5) * 2;
			col.setXYZ(i, this.color.r, this.color.g, this.color.b);
			left--;
		}
		this.geo.getAttribute("position").needsUpdate = true;
		col.needsUpdate = true;
	}
	update(dt) {
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
		if (dirty) this.geo.getAttribute("position").needsUpdate = true;
	}
};
function approach(v, to, maxDelta) {
	if (v < to) return Math.min(to, v + maxDelta);
	return Math.max(to, v - maxDelta);
}
function labelTexture(title, sub) {
	const c = document.createElement("canvas");
	c.width = 512;
	c.height = 256;
	const g = c.getContext("2d");
	if (!g) return new CanvasTexture(c);
	g.clearRect(0, 0, 512, 256);
	g.fillStyle = "rgba(16,12,24,0.78)";
	g.fillRect(0, 40, 512, 176);
	g.fillStyle = "#e7b04a";
	g.font = "650 54px Fraunces, Georgia, serif";
	g.fillText(title, 28, 118);
	g.fillStyle = "#f4ead7";
	g.font = "500 28px Outfit, sans-serif";
	g.fillText(sub.slice(0, 42), 28, 168);
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	return tex;
}
//#endregion
export { Game };
