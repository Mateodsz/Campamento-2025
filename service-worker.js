const CACHE_NAME = "campamento-cache-v2";
const urlsToCache = [
  "index.html",
  "img/logo vencedores.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("install", (event) => {
  self.skipWaiting(); // activa la nueva versión inmediatamente
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // borra cachés viejas
          }
        })
      )
    )
  );
});

