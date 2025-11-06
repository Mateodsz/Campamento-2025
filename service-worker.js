const CACHE_NAME = "campamento-cache-v8"; // nueva versión para forzar actualización

// Archivos a cachear
const urlsToCache = [
  "./", // importante para GitHub Pages
  "./index.html",
  "./programación.html",
  "./manifest.json",
  "./style.css",
  "./img/logo vencedores.png",
  "./icon.png"
];

// INSTALACIÓN
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Archivos cacheados correctamente");
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error("❌ Error al cachear archivos:", err))
  );

  // activa inmediatamente la nueva versión
  self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("🗑️ Eliminando caché vieja:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ✅ 1. Si hay respuesta en caché, úsala (ideal para recargas offline)
      if (cachedResponse) {
        return cachedResponse;
      }

      // ✅ 2. Si no hay en caché, intenta traerlo de la red
      return fetch(event.request).catch(() => {
        // ✅ 3. Si falla y es una navegación (recarga sin internet),
        // devuelve el index.html desde caché
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});

