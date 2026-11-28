/* 極簡離線快取：只快取靜態殼，不快取 /api（避免過期報價）。 */
/* Paths are resolved against this script's URL so the same file works at / and /us-stock-screener/. */
const CACHE = "us-stock-monitor-shell-v2";
const SHELL = new URL("./", self.location).href;
const API_PREFIX = new URL("./api", self.location).pathname;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        SHELL,
        new URL("./manifest.webmanifest", self.location).href,
        new URL("./icon.svg", self.location).href,
      ]),
    ),
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === API_PREFIX || url.pathname.startsWith(`${API_PREFIX}/`)) return;
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match(SHELL))),
  );
});
