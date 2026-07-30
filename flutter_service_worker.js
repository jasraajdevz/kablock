// KABLOCK cache KILL-SWITCH service worker.
//
// The app is built with `--pwa-strategy=none`, so it does NOT cache itself.
// This service worker exists ONLY to evict Flutter's old offline-first service
// worker + all caches that a returning device may still have installed, then
// unregister itself so the browser always fetches the freshest build.
//
// Bump KILL_VERSION on every deploy so returning devices re-run activate().
const KILL_VERSION = 'v15-2026-07-30';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}
    try {
      await self.registration.unregister();
    } catch (_) {}
    try {
      const windows = await self.clients.matchAll({ type: 'window' });
      for (const client of windows) {
        client.navigate(client.url);
      }
    } catch (_) {}
  })());
});
