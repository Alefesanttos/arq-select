const CACHE = "arqselect-5.5.0.20260915.550";
const STATIC = [
  "./",
  "./index.html",
  "./explorar.html",
  "./produto.html",
  "./favoritos.html",
  "./offline.html",
  "./arqselect-4.css",
  "./arq-premium.css",
  "./marketplace-premium.css",
  "./arqselect-4.js",
  "./arq-premium.js",
  "./arq-ui-5.css",
  "./arq-polish.css",
  "./assets/ui/fallback-geral.svg",
  "./assets/suppliers/identidade-pendente.svg",
  "./arq-commerce.js",
  "./favoritos-premium.js",
  "./marketplace-premium.js",
  "./produto-premium.js",
  "./catalogo-premium-data.js",
  "./home-4.js",
  "./arquitetura-premium-v2.webp",
  "./arquitetura-editorial-interior-v1.webp",
  "./materiais-curadoria-v1.webp",
  "./logistica-madeira-v1.webp",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("arqselect-") && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if(url.pathname.endsWith("/arq-config.js")||url.searchParams.has("token"))return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then(response => response || caches.match("./offline.html"))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => {
    const network = fetch(request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => cached);
    return cached || network;
  }));
});
