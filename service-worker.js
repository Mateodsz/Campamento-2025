const CACHE_NAME = "campamento-cache-v7"; // nueva versión para limpiar caché anterior

const urlsToCache = [
  "./", // importante para GitHub Pages
  "./index.html",
  "./programación.html",
  "./manifest.json",
  "./style.css",
  "./img/logo vencedores.png", // usa el mismo nombre exacto que en tu carpeta
  "./icon.png"
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

// FETCH (carga desde cache o red + recarga offline)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la petición se hace correctamente, devuelve la respuesta de la red
        return response;
      })
      .catch(() => {
        // Si falla (por ejemplo, sin internet), intenta servir desde caché
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse; // usa la versión cacheada si existe
            }

            // 👇 Esta parte es NUEVA:
            // Si la solicitud es una navegación (recarga) y no hay conexión,
            // devuelve el index.html desde caché para mantener la app funcionando
            if (event.request.mode === "navigate") {
              return caches.match("./index.html");
            }
          });
      })
  );
})