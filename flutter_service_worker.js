// Self-destroying service worker — evicts any offline cache a previous build
// installed, then auto-reloads to the newest build. Deploy uses
// --pwa-strategy=none, so new visitors register no service worker at all.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try { const k = await caches.keys(); await Promise.all(k.map(function (c) { return caches.delete(c); })); } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    try { const cl = await self.clients.matchAll({ type: 'window' }); cl.forEach(function (c) { c.navigate(c.url); }); } catch (e) {}
  })());
});
