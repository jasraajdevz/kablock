// KABLOCK cache KILL-SWITCH service worker.
// Built with --pwa-strategy=none; this only evicts stale caches/workers then
// unregisters itself. Bump KILL_VERSION on every deploy.
const KILL_VERSION = 'v25-2026-07-31';
self.addEventListener('install', (event) => { self.skipWaiting(); });
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try { const keys = await caches.keys(); await Promise.all(keys.map((k) => caches.delete(k))); } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
    try {
      const windows = await self.clients.matchAll({ type: 'window' });
      for (const client of windows) { client.navigate(client.url); }
    } catch (_) {}
  })());
});
