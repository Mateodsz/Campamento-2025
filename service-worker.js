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

// FETCH (maneja recargas sin conexión)
self.addEventListener("fetch", (event) => {
  // Solo interceptamos peticiones de navegación (recargar, abrir nueva página, etc.)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Si falla la red, devolvemos el index.html guardado
          return caches.match("./index.html");
        })
    );
    return; // salimos para no interferir con otros recursos
  }

  // Para imágenes, css, js, etc. usamos cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

