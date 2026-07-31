# KABLOCK — Slide · Match · Clear

**▶ Play now: [jasraajdevz.github.io/kablock](https://jasraajdevz.github.io/kablock/)**
No download. No account. Just open it and play.

---

## Every block has a way out. Find it.

KABLOCK is a sliding-block puzzle with one beautifully simple rule: drag a block
to a gate of the same colour and it's gone. Sweep the gems on the way through.
Clear the board. Then do it again on a board that's just a little harder.

**It never plateaus.** Most puzzle games run out of ideas by level 50. KABLOCK's
difficulty climbs forever — mathematically guaranteed to keep rising and still be
solvable, whether you're on level 12 or level 12,000.

**Learn by playing, not by reading.** Ten hand-built opening levels teach you the
whole game one idea at a time — no wall of tutorial text, no way to fail.

## The Daily Puzzle

One board. The same board for every player on Earth. One attempt. Get graded
against par, then share your result — spoiler-free, so nobody spoils it for
anyone else.

## Six ways to play

| Mode | What it is |
|------|------------|
| **Classic** | Relaxed. No clock, no fail state. |
| **Timer** | Solve as many as you can before the clock runs out. |
| **Endless** | The ladder climbs faster and never stops. |
| **Extreme** | Denser boards, less room to think. |
| **Run** | One life. See how far you get. |
| **Nightmare** | Good luck. |

Plus **Fun Mode**, a pure sandbox where you set the difficulty dial and nothing
is ever scored — and **Cascade**, a whole second game: fill the 8×8 grid, clear
lines, and watch gravity chain the clears together.

## Power when you need it

Bank **rockets** to blow a stuck board wide open. **Shields**, **XP boosts** and
**time-stasis** for when a run gets tight. Keep a good run alive with a continue.

## Play the long game

Build a **daily streak**. Chase 60+ **achievements**. **Ascend** to trade your
level for permanent cores that make every gem you ever earn worth more. And every
clear rolls for a **surprise drop** — you never know when the jackpot lands.

## Make it yours

Four board skins, five backgrounds, five colour themes, ten soundtracks, and a
full accessibility pass: Calm mode, reduce-motion support, high contrast, and
haptics you can switch off.

---

## About this repository

> ⚠️ This repo contains the **compiled Flutter web build**, not source code.
> `main.dart.js` is a ~3 MB minified bundle produced by `flutter build web`.
> The Dart source (`lib/`, `pubspec.yaml`, …) lives in a separate private repo.

| Path | Purpose |
|------|---------|
| `index.html` | Entry point / app shell |
| `main.dart.js` | Compiled app code (minified) |
| `flutter.js`, `flutter_bootstrap.js` | Flutter web loader |
| `flutter_service_worker.js` | Cache kill-switch (see below) |
| `canvaskit/` | CanvasKit WASM renderer |
| `assets/` | Fonts (Inter, Space Grotesk), shaders, asset manifests |
| `icons/`, `favicon.png`, `icon.svg` | App icons |
| `manifest.json` | PWA manifest |

The live site is served from the **`gh-pages`** branch.

### Run it locally

Serve the folder over HTTP — opening `index.html` directly won't work, it needs a
server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### A note on caching

The build ships with `--pwa-strategy=none` and a deliberately self-destroying
service worker: on activate it clears every cache, unregisters itself, and
reloads open tabs. Flutter's default offline-first worker used to leave returning
players stuck on a stale build, and this is the fix. `KILL_VERSION` is bumped on
every deploy so returning devices re-run it.
