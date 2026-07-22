'use strict';

// ============================================================================
// KABLOCK offline service worker.
//
// Recent Flutter versions ship a service worker that UNREGISTERS itself on
// activate (no offline support). build_web.ps1 overwrites the generated
// build/web/flutter_service_worker.js with THIS file, so the Flutter loader
// registers a real caching worker instead — and the game works offline after
// the first load.
//
// Strategy:
//   • install   — precache the core app shell so an offline cold-start can boot.
//   • navigate  — network-first (online players always get the freshest shell),
//                 falling back to the cached shell when offline.
//   • assets    — stale-while-revalidate: serve instantly from cache, refresh in
//                 the background when online. First online load fills the cache
//                 (canvaskit, fonts, assets); every later load reuses it offline.
//     Because assets always revalidate against the network when online, a new
//     deploy propagates without the worker itself needing a version bump.
// ============================================================================

const CACHE = 'kablock-cache-v1';

// Stable-named files a Flutter web build always emits — enough to cold-boot
// offline. Everything else (canvaskit chunks, hashed fonts/assets) is cached
// on first load via stale-while-revalidate below. Missing entries are ignored
// so install never fails on an optional file.
const CORE = [
  'index.html',
  'flutter.js',
  'flutter_bootstrap.js',
  'main.dart.js',
  'manifest.json',
  'favicon.png',
  'icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res && res.ok) await cache.put(url, res);
      } catch (_) {
        /* optional file — ignore */
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Drop caches left by older worker versions.
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // only our own assets

  // App navigations: network-first, cached shell as the offline fallback.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (_) {
        return (await cache.match(req)) ||
               (await cache.match('index.html')) ||
               (await cache.match('/')) ||
               Response.error();
      }
    })());
    return;
  }

  // Assets: stale-while-revalidate.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const network = fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          cache.put(req, res.clone());
        }
        return res;
      })
      .catch(() => undefined);
    return cached || (await network) || Response.error();
  })());
});
