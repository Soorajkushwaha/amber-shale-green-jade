export class AudioBus {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private sfx: GainNode | null = null;
  private drone: OscillatorNode[] = [];
  private next = 0;
  private step = 0;
  private mode: "menu" | "play" | "boss" | "win" = "menu";
  musicLevel = 0.7;
  sfxLevel = 0.85;
  muted = false;
  private started = false;

  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC({ latencyHint: "interactive" });
      this.master = this.ctx.createGain();
      this.music = this.ctx.createGain();
      this.sfx = this.ctx.createGain();
      this.music.connect(this.master);
      this.sfx.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.applyGains();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMix(music: number, sfx: number, muted: boolean) {
    this.musicLevel = music;
    this.sfxLevel = sfx;
    this.muted = muted;
    this.applyGains();
  }

  private applyGains() {
    if (!this.ctx || !this.master || !this.music || !this.sfx) return;
    const m = this.muted ? 0 : this.musicLevel ** 2;
    const s = this.muted ? 0 : this.sfxLevel ** 2;
    const now = this.ctx.currentTime;
    this.music.gain.setTargetAtTime(0.18 * m, now, 0.05);
    this.sfx.gain.setTargetAtTime(0.9 * s, now, 0.03);
    this.master.gain.setTargetAtTime(this.muted ? 0 : 1, now, 0.03);
  }

  setMode(mode: "menu" | "play" | "boss" | "win") {
    if (this.mode === mode) return;
    this.mode = mode;
    this.step = 0;
    if (this.ctx) this.next = this.ctx.currentTime + 0.05;
  }

  tick() {
    if (!this.ctx || !this.music || this.muted || this.musicLevel <= 0.01) return;
    if (!this.started) this.startDrone();
    const motif = this.mode === "boss" ? BOSS : this.mode === "win" ? WIN : YAMAN;
    const gap = this.mode === "boss" ? 0.24 : this.mode === "win" ? 0.2 : this.mode === "menu" ? 0.5 : 0.36;
    const base = this.mode === "boss" ? 185 : 220;
    const t = this.ctx.currentTime;
    while (this.next < t + 0.25) {
      const semi = motif[this.step % motif.length] ?? 0;
      this.tone(this.next, base * 2 ** (semi / 12), this.mode === "boss" ? 0.2 : 0.34, "triangle", 0.07);
      if (this.step % 4 === 0) {
        this.tone(this.next, base * 2 ** (((motif[(this.step + 2) % motif.length] ?? 0) - 12) / 12), 0.3, "sine", 0.05);
      }
      this.step++;
      this.next += gap;
    }
  }

  private startDrone() {
    if (!this.ctx || !this.music || this.started) return;
    this.started = true;
    for (const freq of [110, 165]) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(this.music);
      o.start();
      this.drone.push(o);
    }
    this.next = this.ctx.currentTime + 0.05;
  }

  private tone(when: number, freq: number, dur: number, type: OscillatorType, gain: number) {
    if (!this.ctx || !this.music) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, when);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g);
    g.connect(this.music);
    o.start(when);
    o.stop(when + dur + 0.02);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }

  private blip(freq: number, dur: number, type: OscillatorType, gain: number, slide = 0) {
    if (!this.ctx || !this.sfx || this.muted || this.sfxLevel <= 0.01) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + dur);
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g);
    g.connect(this.sfx);
    o.start(now);
    o.stop(now + dur + 0.02);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }

  jump() {
    this.blip(420 + Math.random() * 40, 0.12, "square", 0.05, 180);
  }

  shoot() {
    this.blip(680 + Math.random() * 80, 0.09, "sawtooth", 0.04, -300);
  }

  coin() {
    this.blip(880, 0.08, "sine", 0.06, 400);
  }

  flame() {
    this.blip(520, 0.22, "triangle", 0.07, 240);
  }

  hit() {
    this.blip(180, 0.1, "square", 0.06, -80);
  }

  hurt() {
    this.blip(140, 0.18, "sawtooth", 0.07, -90);
  }

  defeat() {
    this.blip(90, 0.4, "triangle", 0.08, -50);
  }

  win() {
    this.setMode("win");
    this.blip(523, 0.18, "triangle", 0.08, 0);
    window.setTimeout(() => this.blip(659, 0.18, "triangle", 0.08, 0), 140);
    window.setTimeout(() => this.blip(784, 0.28, "triangle", 0.08, 0), 280);
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
  }

  dispose() {
    for (const o of this.drone) o.stop();
    this.drone = [];
    void this.ctx?.close();
    this.ctx = null;
  }
}

const YAMAN = [0, 2, 4, 6, 7, 9, 11, 12, 11, 9, 7, 6, 4, 2, 4, 7];
const BOSS = [0, 1, 5, 7, 8, 1, 0, -1, 5, 8, 7, 1];
const WIN = [0, 4, 7, 12, 7, 4, 9, 12];
