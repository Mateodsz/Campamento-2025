const CACHE_NAME = "campamento-cache-v4"; // cambia versión para forzar actualización

const urlsToCache = [
  "index.html",
  "img/logo-vencedores.png", // usa el mismo nombre exacto que en tu carpeta
  "manifest.json"
];

// INSTALACIÓN
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Archivos cacheados");
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
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("🗑️ Eliminando caché vieja:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // asegura que las páginas usen el nuevo SW de inmediato
});

// FETCH (carga desde cache o red)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

