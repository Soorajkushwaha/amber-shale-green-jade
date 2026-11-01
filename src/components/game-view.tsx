import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  Crosshair,
  Flame,
  Heart,
  Lock,
  Pause,
  RotateCcw,
  Settings,
  Shield,
  Star,
} from "lucide-react";
import { CITIES, REGIONS, cityById, cityByIndex } from "@/game/campaign";
import { defaultSave, emptyProgress, loadSave, writeSave } from "@/game/save";
import { SLOGAN, PLAYER_NAME, WEAPONS, type CityProgress, type ClearPayload, type GameEvent, type Hud, type Quality, type RegionId, type SaveData } from "@/game/types";
import type { Game, StartOpts } from "@/game/runtime";

type Screen = "boot" | "menu" | "intro" | "regions" | "cities" | "play" | "pause" | "clear" | "citylit" | "down" | "final" | "error" | "help";

function progressOf(save: SaveData, cityId: string): CityProgress {
  const city = cityById(cityId);
  const got = save.cities[cityId];
  if (!got || got.areas.length !== city.areas.length) return emptyProgress(city.areas.length);
  return got;
}

function cityIllum(save: SaveData, cityId: string) {
  const p = progressOf(save, cityId);
  if (!p.illum.length) return 0;
  return Math.round(p.illum.reduce((a, b) => a + b, 0) / p.illum.length);
}

function nextMission(save: SaveData) {
  const city = cityByIndex(save.unlocked);
  const prog = progressOf(save, city.id);
  const open = prog.areas.findIndex((done) => !done);
  return { city, area: open < 0 ? 0 : open };
}

function areaOpen(save: SaveData, cityIndex: number, cityId: string, areaIndex: number) {
  if (cityIndex > save.unlocked) return false;
  if (areaIndex === 0) return true;
  return progressOf(save, cityId).areas[areaIndex - 1] === true;
}

export function GameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const saveRef = useRef<SaveData>(defaultSave());
  const [save, setSave] = useState<SaveData>(defaultSave());
  const [screen, setScreen] = useState<Screen>("boot");
  const [hud, setHud] = useState<Hud | null>(null);
  const [region, setRegion] = useState<RegionId>("north");
  const [cityId, setCityId] = useState("gurugram");
  const [result, setResult] = useState<ClearPayload | null>(null);
  const [bossName, setBossName] = useState<string | null>(null);
  const [settings, setSettings] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState("");
  const [coarse, setCoarse] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [helpFrom, setHelpFrom] = useState<"menu" | "pause">("menu");
  const [helpDevice, setHelpDevice] = useState<"pc" | "phone">("pc");

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
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

  useEffect(() => {
    const data = loadSave();
    saveRef.current = data;
    setSave(data);
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dead = false;
    let game: Game | null = null;
    const started = performance.now();
    const onHud = (h: Hud) => setHud(h);
    const commit = (next: SaveData) => {
      saveRef.current = next;
      setSave(next);
      writeSave(next);
    };
    const onEvent = (e: GameEvent) => {
      if (e.type === "pause") {
        game?.setPaused(true);
        setScreen("pause");
      } else if (e.type === "weapon") {
        commit({ ...saveRef.current, weapon: e.level });
      } else if (e.type === "cleared") {
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
            [city.id]: { areas, illum, best, bestTime, noDamage },
          },
        });
        setResult({ ...e.payload, best: best[e.payload.areaIndex] ?? e.payload.score });
        setBossName(null);
        setScreen(e.payload.final ? "final" : e.payload.cityDone ? "citylit" : "clear");
      } else if (e.type === "down") {
        setScreen("down");
      } else if (e.type === "boss") {
        setBossName(e.name);
      } else if (e.type === "fail") {
        setError(e.message);
        setScreen("error");
      }
    };
    void import("@/game/runtime")
      .then(({ Game }) => {
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
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "The game failed to load.");
        setScreen("error");
      });
    return () => {
      dead = true;
      game?.dispose();
      gameRef.current = null;
    };
  }, []);

  const openHelp = (from: "menu" | "pause") => {
    setHelpFrom(from);
    setHelpDevice(coarse ? "phone" : "pc");
    setScreen("help");
  };

  const play = (opts: StartOpts) => {
    setBossName(null);
    setSettings(false);
    setScreen("play");
    gameRef.current?.unlockAudio();
    gameRef.current?.setPaused(false);
    gameRef.current?.startLevel(opts);
  };

  const missionOpts = (id: string, area: number): StartOpts => {
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
      illums: prog.illum,
    };
  };

  const updateSettings = (partial: Partial<SaveData["settings"]>) => {
    const next = { ...saveRef.current, settings: { ...saveRef.current.settings, ...partial } };
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
  const weapon = WEAPONS[Math.max(0, Math.min(4, (hud?.weapon ?? save.weapon) - 1))]!;

  return (
    <main className="shell" onPointerDown={() => gameRef.current?.unlockAudio()}>
      <div className="stage">
        <canvas ref={canvasRef} />
      </div>

      {portrait && screen === "play" ? (
        <div className="rotate-note chip">Rotate for a wider night run</div>
      ) : null}

      {screen === "boot" ? (
        <section className="veil">
          <div className="panel">
            <BrandLogo />
            <h1 className="mt-2 text-center text-4xl text-cream">Light Up India</h1>
            <p className="slogan mt-1 text-center">{SLOGAN}</p>
            <div className="boot-bar mt-6">
              <span />
            </div>
            <p className="muted mt-3 text-sm">Raising the diya and the cities…</p>
          </div>
        </section>
      ) : null}

      {screen === "error" ? (
        <section className="veil">
          <div className="panel">
            <h1 className="text-3xl">The night would not start</h1>
            <p className="mt-3">{error}</p>
          </div>
        </section>
      ) : null}

      {screen === "menu" ? (
        <section className="veil">
          <div className="panel">
            <BrandLogo />
            <h1 className="mt-2 text-center text-4xl">Light Up India</h1>
            <p className="slogan mt-1 text-center">Play as {PLAYER_NAME}</p>
            <p className="mt-4 text-sm leading-relaxed">
              Carry the DesiDiya across twenty Indian cities. Touch the street diyas, cross the roofs, and the buildings light up in your wake.
            </p>
            <div className="mt-5 grid gap-2">
              <button className="btn btn-primary" onClick={() => (save.seenIntro ? setScreen("regions") : setScreen("intro"))}>
                Start Game
              </button>
              {hasContinue ? (
                <button
                  className="btn btn-ember"
                  onClick={() => {
                    const n = nextMission(save);
                    play(missionOpts(n.city.id, n.area));
                  }}
                >
                  Continue
                </button>
              ) : null}
              <button className="btn btn-ghost" onClick={() => setScreen("regions")}>
                Regions
              </button>
              <button className="btn btn-ghost" onClick={() => openHelp("menu")}>
                How to play
              </button>
              <button className="btn btn-ghost" onClick={() => setSettings(true)}>
                Settings
              </button>
            </div>
            <p className="muted mt-4 text-sm">
              <a className="text-gold underline" href="https://desidiya.com/" target="_blank" rel="noreferrer">
                desidiya.com
              </a>
            </p>
          </div>
        </section>
      ) : null}

      {screen === "intro" ? (
        <section className="veil">
          <div className="panel">
            <button className="icon-btn" onClick={() => setScreen("menu")} aria-label="Back">
              <ChevronLeft />
            </button>
            <p className="kicker mt-4">Lightbearer</p>
            <h1 className="mt-1 text-4xl">{PLAYER_NAME}</h1>
            <p className="mt-3 leading-relaxed">
              Cream kurta, a sharp jacket, and the DesiDiya still burning. The cities have gone dark. As {PLAYER_NAME} crosses each building, its windows wake. Street diyas flare the whole block.
            </p>
            <button
              className="btn btn-primary mt-5 w-full"
              onClick={() => {
                const next = { ...saveRef.current, seenIntro: true };
                saveRef.current = next;
                setSave(next);
                writeSave(next);
                play(missionOpts("gurugram", 0));
              }}
            >
              Take the Diya
            </button>
          </div>
        </section>
      ) : null}

      {screen === "regions" ? (
        <section className="veil">
          <div className="panel">
            <div className="flex items-center justify-between gap-3">
              <button className="icon-btn" onClick={() => setScreen("menu")} aria-label="Back">
                <ChevronLeft />
              </button>
              <h1 className="text-2xl">Regions</h1>
            </div>
            <div className="list mt-4">
              {REGIONS.map((item) => {
                const cities = CITIES.filter((c) => c.region === item.id);
                const open = cities.some((c) => CITIES.indexOf(c) <= save.unlocked);
                const lit = Math.round(cities.reduce((sum, c) => sum + cityIllum(save, c.id), 0) / cities.length);
                return (
                  <button
                    key={item.id}
                    className="card"
                    disabled={!open}
                    onClick={() => {
                      setRegion(item.id);
                      const first = cities.find((c) => CITIES.indexOf(c) <= save.unlocked) ?? cities[0]!;
                      setCityId(first.id);
                      setScreen("cities");
                    }}
                  >
                    <strong className="flex items-center justify-between gap-2">
                      {item.name}
                      {open ? <span className="text-gold">{lit}%</span> : <Lock className="size-4" />}
                    </strong>
                    <small className="mt-1 block">{open ? item.line : "Still in darkness"}</small>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {screen === "cities" ? (
        <section className="veil">
          <div className="panel">
            <div className="flex items-center justify-between gap-3">
              <button className="icon-btn" onClick={() => setScreen("regions")} aria-label="Back">
                <ChevronLeft />
              </button>
              <h1 className="text-2xl">{REGIONS.find((r) => r.id === region)?.name}</h1>
            </div>
            <div className="mt-4 flex gap-2 overflow-auto pb-1">
              {regionCities.map((city) => {
                const idx = CITIES.indexOf(city);
                const open = idx <= save.unlocked;
                return (
                  <button key={city.id} className={city.id === cityId ? "card on shrink-0" : "card shrink-0"} onClick={() => setCityId(city.id)}>
                    <strong className="flex items-center gap-2">
                      {open ? null : <Lock className="size-3.5" />}
                      {city.name}
                    </strong>
                    <small>{open ? `${cityIllum(save, city.id)}% lit` : "Locked"}</small>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm leading-relaxed">{selected.blurb}</p>
            <div className="list mt-3">
              {selected.areas.map((area, i) => {
                const open = areaOpen(save, selectedIndex, selected.id, i);
                const done = progressOf(save, selected.id).areas[i];
                return (
                  <button key={area.name} className="card" disabled={!open} onClick={() => play(missionOpts(selected.id, i))}>
                    <strong className="flex items-center justify-between gap-2">
                      <span>
                        {i + 1}. {area.name}
                      </span>
                      {open ? <span className="text-gold">{done ? "Lit" : "Play"}</span> : <Lock className="size-4" />}
                    </strong>
                    <small className="mt-1 block">{open ? area.blurb : "Finish the previous street first."}</small>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {screen === "play" || screen === "pause" ? (
        <div className={coarse && screen === "play" ? "hud hud-touch" : "hud"}>
          <div className="hud-top">
            <div className="chip">
              <div className="hearts" aria-label="Lives">
                {Array.from({ length: hud?.maxHearts ?? 5 }, (_, i) => (
                  <Heart key={i} className={i < (hud?.hearts ?? 0) ? "size-4 fill-current" : "dim size-4"} />
                ))}
              </div>
              <p className="mt-1 text-sm">
                {PLAYER_NAME} · {weapon.short}
              </p>
              <p className="text-sm text-gold">{hud?.score ?? 0}</p>
            </div>
            <div className="chip min-w-40 flex-1">
              <p className="text-xs tracking-wide text-gold">STREET LIGHT {hud?.illum ?? 0}%</p>
              <div className="meter mt-1">
                <span style={{ width: `${hud?.illum ?? 0}%` }} />
              </div>
              <p className="mt-1 text-sm">
                AREAS {hud?.areasDone ?? 0}/{hud?.areasTotal ?? 1}
              </p>
              <p className="muted text-sm">{hud?.areaName}</p>
            </div>
            <button
              className="icon-btn"
              aria-label="Pause"
              onClick={() => {
                gameRef.current?.setPaused(true);
                setScreen("pause");
              }}
            >
              <Pause className="size-5" />
            </button>
          </div>
          <div className="hud-bottom">
            <div className="chip text-sm">
              {hud?.power ? <span className="text-gold">{hud.power}</span> : <span className="muted">{selected.name}</span>}
              {hud?.shield ? (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Shield className="size-3.5" /> {hud.shield}
                </span>
              ) : null}
              {hud?.star ? <Star className="ml-2 inline size-3.5 text-gold" /> : null}
              {hud?.hint ? <p className="mt-1 max-w-xs">{hud.hint}</p> : null}
            </div>
            {hud?.boss ? (
              <div className="chip min-w-36 flex-1">
                <p className="text-sm">
                  {hud.boss.name} · phase {hud.boss.phase}
                </p>
                <div className="meter mt-1">
                  <span style={{ width: `${Math.max(0, (hud.boss.hp / hud.boss.max) * 100)}%` }} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {bossName && screen === "play" ? (
        <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center">
          <div className="chip text-center">
            <p className="kicker">Boss</p>
            <p className="font-display text-2xl">{bossName}</p>
          </div>
        </div>
      ) : null}

      {coarse && screen === "play" ? (
        <div className="touch">
          <Stick
            on={(x, y) => {
              gameRef.current?.setTouch({ x, y, using: true });
            }}
          />
          <div className="actions">
            <Hold label="Run" className="pad" onHold={(v) => gameRef.current?.setTouch({ sprint: v, using: true })} />
            <Hold label="Shoot" className="pad shoot" onHold={(v) => gameRef.current?.setTouch({ shoot: v, using: true })}>
              <Crosshair className="size-5" />
            </Hold>
            <Hold label="Jump" className="pad jump" onHold={(v) => gameRef.current?.setTouch({ jump: v, using: true })} />
          </div>
        </div>
      ) : null}

      {screen === "pause" ? (
        <section className="veil">
          <div className="panel">
            <h1 className="text-3xl">Paused</h1>
            <div className="mt-4 grid gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  gameRef.current?.setPaused(false);
                  setScreen("play");
                }}
              >
                Resume
              </button>
              <button className="btn btn-ghost" onClick={() => openHelp("pause")}>
                How to play
              </button>
              <button className="btn btn-ghost" onClick={() => setSettings(true)}>
                Settings
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  gameRef.current?.showMenu();
                  setScreen("cities");
                }}
              >
                City map
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {screen === "help" ? (
        <section className="veil">
          <div className="panel">
            <div className="flex items-center justify-between gap-3">
              <button className="icon-btn" onClick={() => setScreen(helpFrom)} aria-label="Back">
                <ChevronLeft />
              </button>
              <h1 className="text-2xl">How to play</h1>
            </div>
            <BrandLogo />
            <p className="kicker mt-2 text-center">Lightbearer {PLAYER_NAME}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className={helpDevice === "pc" ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setHelpDevice("pc")}>
                Computer
              </button>
              <button className={helpDevice === "phone" ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setHelpDevice("phone")}>
                Phone
              </button>
            </div>
            {helpDevice === "pc" ? (
              <ul className="rules">
                <li>
                  <kbd>A</kbd> <kbd>D</kbd> or arrow keys move. <kbd>A</kbd> is left, <kbd>D</kbd> is right.
                </li>
                <li>
                  <kbd>Space</kbd> jumps. Tap again in the air for a second hop.
                </li>
                <li>
                  <kbd>Shift</kbd> runs. <kbd>Up</kbd> aims the diya upward.
                </li>
                <li>
                  Aim with the mouse. Click, <kbd>F</kbd>, or <kbd>J</kbd> shoots light.
                </li>
                <li>
                  <kbd>Esc</kbd> pauses.
                </li>
              </ul>
            ) : (
              <ul className="rules">
                <li>The left stick moves {PLAYER_NAME}. Push up to aim the diya up, down to fall faster.</li>
                <li>Jump hops. Tap again in the air for a second hop.</li>
                <li>Run sprints along the roofs.</li>
                <li>Shoot fires the diya light at shadows.</li>
                <li>Pause is the button at the top right. Turn the phone sideways for a wider street.</li>
              </ul>
            )}
            <p className="kicker mt-4">Rules</p>
            <ol className="rules rules-num">
              <li>You play as {PLAYER_NAME}, carrying the DesiDiya.</li>
              <li>As {PLAYER_NAME} crosses a building, his diya wakes its windows and the fairy lights on that stretch.</li>
              <li>Touch the brass street diyas along the way. The light jumps ahead and the block you passed flares on together.</li>
              <li>Coins raise the score. Shadows, smoke, and drones cost a heart. A shield soaks one hit.</li>
              <li>Reach the far end of the street, on the ground, to finish it. On a boss street the city lights fully when the darkness falls.</li>
              <li>Streets you already lit stay lit on the India map.</li>
            </ol>
          </div>
        </section>
      ) : null}

      {screen === "clear" && result ? (
        <section className="veil">
          <ResultCard
            title={`${result.areaName} is lit`}
            result={result}
            action="Next street"
            onAction={() => play(missionOpts(result.cityId, result.areaIndex + 1))}
            onMap={() => {
              gameRef.current?.showMenu();
              setScreen("cities");
            }}
          />
        </section>
      ) : null}

      {screen === "citylit" && result ? (
        <section className="veil">
          <ResultCard
            title={`${result.cityName} illuminated`}
            result={result}
            action={save.unlocked < CITIES.length ? "Next city" : "India map"}
            onAction={() => {
              const idx = CITIES.findIndex((c) => c.id === result.cityId);
              const next = CITIES[Math.min(CITIES.length - 1, idx + 1)]!;
              setCityId(next.id);
              setRegion(next.region);
              play(missionOpts(next.id, 0));
            }}
            onMap={() => {
              gameRef.current?.showMenu();
              setCityId(result.cityId);
              setScreen("cities");
            }}
          />
        </section>
      ) : null}

      {screen === "final" && result ? (
        <section className="veil">
          <div className="panel text-center">
            <BrandLogo />
            <p className="kicker mt-3 inline-flex items-center justify-center gap-2">
              <Flame className="size-4" /> India awake
            </p>
            <h1 className="mt-2 text-4xl">{PLAYER_NAME} lit the night</h1>
            <p className="mt-3">The Darkness Titan falls. Every city keeps its light.</p>
            <p className="mt-2 text-gold tabular-nums">Score {result.score}</p>
            <button
              className="btn btn-primary mt-5 w-full"
              onClick={() => {
                gameRef.current?.showMenu();
                setScreen("menu");
              }}
            >
              Back to the terrace
            </button>
            <p className="muted mt-4 text-sm">
              <a className="text-gold underline" href="https://desidiya.com/" target="_blank" rel="noreferrer">
                desidiya.com
              </a>
            </p>
          </div>
        </section>
      ) : null}

      {screen === "down" ? (
        <section className="veil">
          <div className="panel">
            <h1 className="text-3xl">The diya went out</h1>
            <p className="mt-2">{PLAYER_NAME} can try this street again. The cities you already lit stay lit.</p>
            <div className="mt-4 grid gap-2">
              <button className="btn btn-primary" onClick={() => resultPlayAgain()}>
                Retry street
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  gameRef.current?.showMenu();
                  setScreen("cities");
                }}
              >
                City map
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {settings ? (
        <section className="veil z-10">
          <div className="panel">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl inline-flex items-center gap-2">
                <Settings className="size-5" /> Settings
              </h1>
              <button className="btn btn-ghost" onClick={() => { setSettings(false); setConfirmReset(false); }}>
                Close
              </button>
            </div>
            <p className="kicker mt-4">Graphics</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as Quality[]).map((q) => (
                <button key={q} className={save.settings.quality === q ? "btn btn-primary" : "btn btn-ghost"} onClick={() => updateSettings({ quality: q })}>
                  {q}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm">
              Music
              <input className="mt-1 w-full" type="range" min={0} max={1} step={0.01} value={save.settings.music} onChange={(e) => updateSettings({ music: Number(e.target.value) })} />
            </label>
            <label className="mt-3 block text-sm">
              Effects
              <input className="mt-1 w-full" type="range" min={0} max={1} step={0.01} value={save.settings.sfx} onChange={(e) => updateSettings({ sfx: Number(e.target.value) })} />
            </label>
            <button className="btn btn-ghost mt-4 w-full" onClick={() => updateSettings({ muted: !save.settings.muted })}>
              {save.settings.muted ? "Unmute" : "Mute"}
            </button>
            {confirmReset ? (
              <button
                className="btn btn-ember mt-3 w-full"
                onClick={() => {
                  const fresh = defaultSave();
                  commitSave(fresh);
                  gameRef.current?.setQuality(fresh.settings.quality);
                  gameRef.current?.setMix(fresh.settings.music, fresh.settings.sfx, false);
                  gameRef.current?.showMenu();
                  setConfirmReset(false);
                  setSettings(false);
                  setScreen("menu");
                }}
              >
                Confirm reset
              </button>
            ) : (
              <button className="btn btn-ghost mt-3 w-full" onClick={() => setConfirmReset(true)}>
                <RotateCcw className="mr-2 inline size-4" /> Reset journey
              </button>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );

  function resultPlayAgain() {
    const id = result?.cityId ?? cityId;
    const area = result?.areaIndex ?? 0;
    play(missionOpts(id, area));
  }

  function commitSave(next: SaveData) {
    saveRef.current = next;
    setSave(next);
    writeSave(next);
  }
}

function BrandLogo() {
  return (
    <img
      className="brand-logo"
      src="/desidiya-logo.webp"
      alt="DesiDiya — Naye Bharat ki Roshani"
    />
  );
}

function ResultCard({
  title,
  result,
  action,
  onAction,
  onMap,
}: {
  title: string;
  result: ClearPayload;
  action: string;
  onAction: () => void;
  onMap: () => void;
}) {
  return (
    <div className="panel">
      <p className="kicker">City light</p>
      <h1 className="mt-1 text-3xl">{title}</h1>
      <p className="mt-2 text-sm">
        Illumination {result.illum}% · score <span className="tabular-nums">{result.score}</span>
        {result.noDamage ? " · untouched" : ""}
      </p>
      <p className="muted text-sm tabular-nums">Best {result.best} · {Math.round(result.time)}s</p>
      <div className="mt-4 grid gap-2">
        <button className="btn btn-primary" onClick={onAction}>
          {action}
        </button>
        <button className="btn btn-ghost" onClick={onMap}>
          City map
        </button>
      </div>
    </div>
  );
}

function Stick({ on }: { on: (x: number, y: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const move = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    let x = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    let y = -((clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
    const mag = Math.hypot(x, y) || 1;
    if (mag > 1) {
      x /= mag;
      y /= mag;
    }
    setKnob({ x, y });
    on(x, y);
  };
  return (
    <div
      ref={ref}
      className="stick"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
        setKnob({ x: 0, y: 0 });
        on(0, 0);
      }}
    >
      <span className="knob" style={{ transform: `translate(${knob.x * 28}px, ${-knob.y * 28}px)` }} />
    </div>
  );
}

function Hold({
  label,
  className,
  onHold,
  children,
}: {
  label: string;
  className: string;
  onHold: (down: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <button
      className={className}
      aria-label={label}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onHold(true);
      }}
      onPointerUp={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
    >
      {children ?? label}
    </button>
  );
}
