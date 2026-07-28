// Self-destroying service worker — v5. Clears every cache, unregisters itself,
// and reloads open windows so the newest build loads from the network.
const KILL_VERSION = 'v5-2026-07-28';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try { const k = await caches.keys(); await Promise.all(k.map(function (c) { return caches.delete(c); })); } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    try { const cl = await self.clients.matchAll({ type: 'window' }); cl.forEach(function (c) { c.navigate(c.url); }); } catch (e) {}
  })());
});
