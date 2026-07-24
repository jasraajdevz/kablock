// Self-destroying service worker.
// This deploy is built with --pwa-strategy=none (no caching for new visitors).
// This file exists ONLY to evict the offline cache that a PREVIOUS build's
// service worker installed on returning devices: it clears every cache,
// unregisters itself, and reloads open windows so the newest build loads from
// the network. After it runs once, no service worker controls the page.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(function (c) { c.navigate(c.url); });
    } catch (e) {}
  })());
});
