/* MK Aération — service worker
 * - Pages publiques : réseau d’abord, copie locale en secours, page hors ligne sinon.
 * - Polices, logos, images du site et fichiers statiques : cache d’abord.
 * - Jamais mis en cache : API, espace équipe, connexion, médias importés, vidéos.
 */
const VERSION = "mk-v1";
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const OFFLINE = "/hors-ligne";
const PRECACHE = [
  OFFLINE,
  "/brand/lockup.webp",
  "/brand/emblem.webp",
  "/brand/logo-mk-aeration.webp",
  "/fonts/archivo-var.woff2",
  "/fonts/plex-mono-400.woff2",
  "/fonts/plex-mono-500.woff2",
  "/apple-touch-icon.png",
];
const PRIVATE = /^\/(api|equipe|connexion|media|videos)(\/|$)/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trimPages() {
  const cache = await caches.open(PAGES);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - 40)).map((k) => cache.delete(k)));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (PRIVATE.test(url.pathname)) {
    if (request.mode === "navigate")
      event.respondWith(fetch(request).catch(() => caches.match(OFFLINE)));
    return;
  }
  if (request.headers.has("range")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && response.type === "basic" && !response.redirected) {
            const copy = response.clone();
            caches
              .open(PAGES)
              .then((c) => c.put(request, copy))
              .then(trimPages);
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match(OFFLINE)),
    );
    return;
  }

  if (/^\/(_next\/static|fonts|brand|images|splash)\//.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(STATIC).then((c) => c.put(request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
