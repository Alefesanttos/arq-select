/* ARQSELECT 5.5.1: não conserva scripts antigos e tolera upload ainda incompleto. */
const CACHE='arqselect-5.5.1.20260916.551';
const STATIC=['./offline.html','./assets/ui/fallback-geral.svg','./assets/suppliers/identidade-pendente.svg'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(STATIC.map(url=>cache.add(url)))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('arqselect-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin||url.searchParams.has('token')||url.pathname.endsWith('/arq-config.js'))return;
 const save=response=>{if(response&&response.ok)event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,response.clone())).catch(()=>{}));return response;};
 if(request.mode==='navigate'||/\.(?:js|css)$/i.test(url.pathname)){
  event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok)return save(response);const cached=await caches.match(request);return cached||response;}catch(error){const cached=await caches.match(request);if(cached)return cached;if(request.mode==='navigate')return (await caches.match('./offline.html'))||Response.error();return Response.error();}})());return;
 }
 event.respondWith((async()=>{const cached=await caches.match(request);const network=fetch(request).then(save).catch(()=>cached||Response.error());if(cached){event.waitUntil(network);return cached;}return network;})());
});
