// KABLOCK cache KILL-SWITCH service worker.
//
// The app is built with `--pwa-strategy=none`, so it does NOT cache itself.
// This service worker exists ONLY to evict Flutter's old offline-first service
// worker + all caches that a returning device may still have installed (the
// cause of "the fix isn't live for me" reports), then unregister itself so the
// browser always fetches the freshest build straight from the network.
//
// Bump KILL_VERSION on every deploy so returning devices re-run activate().
const KILL_VERSION = 'v12-2026-07-29';

self.addEventListener('install', (event) => {
  // Take over immediately instead of waiting for old tabs to close.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 1) Nuke every cache (kills any stale offline-first Flutter bundle).
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}
    // 2) Unregister this worker so nothing intercepts future requests.
    try {
      await self.registration.unregister();
    } catch (_) {}
    // 3) Hard-reload any open windows onto the fresh network build.
    try {
      const windows = await self.clients.matchAll({ type: 'window' });
      for (const client of windows) {
        client.navigate(client.url);
      }
    } catch (_) {}
  })());
});
