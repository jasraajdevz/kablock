# kablock

Compiled **Flutter web release build** for the app `kablock` (v1.0.0, build 1).

> ⚠️ This folder contains **build output**, not source code. `main.dart.js` is a
> ~3 MB minified/compiled bundle produced by `flutter build web`. The original
> Dart source (`lib/`, `pubspec.yaml`, etc.) is **not** included here.

## What's in here

| Path | Purpose |
|------|---------|
| `index.html` | Entry point / app shell |
| `main.dart.js` | Compiled app code (minified) |
| `flutter.js`, `flutter_bootstrap.js` | Flutter web loader |
| `flutter_service_worker.js`, `sw_kablock.js` | Service workers (offline cache) |
| `canvaskit/` | CanvasKit WASM renderer |
| `assets/` | Fonts (Inter, Space Grotesk), shaders, asset manifests |
| `icons/`, `favicon.png`, `icon.svg` | App icons |
| `manifest.json` | PWA manifest |
| `_headers`, `_redirects` | Netlify/Cloudflare Pages hosting config |

## Run it locally

Serve the folder over HTTP (opening `index.html` directly won't work — it needs a server):

```powershell
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open http://localhost:8000

## To edit the app

You need the **original Flutter source project** (the one that was `flutter build web`'d
to produce this). Editing the minified `main.dart.js` by hand is not practical.
