// Self-destroying service worker — v4 (bump the version on every deploy so a
// returning device with a stale SW always detects a change and re-runs this).
// Clears every cache, unregisters itself, and reloads open windows so the
// newest build loads from the network. Deploy uses --pwa-strategy=none, so new
// visitors register no service worker at all.
const KILL_VERSION = 'v4-2026-07-28';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try { const k = await caches.keys(); await Promise.all(k.map(function (c) { return caches.delete(c); })); } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    try { const cl = await self.clients.matchAll({ type: 'window' }); cl.forEach(function (c) { c.navigate(c.url); }); } catch (e) {}
  })());
});
