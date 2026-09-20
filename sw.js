/* ARQSELECT 6.1.0 — cache resiliente e responsivo para todos os dispositivos. */
const CACHE='arqselect-6.1.0.20260920.610';
const STATIC=[
  './offline.html','./arq-design-system.css','./arq-experience.js','./arq-config.js',
  './arqselect-6.css','./arqselect-6.js','./arq-services.css','./arq-services.js','./arq-performance.js','./arq-intelligence.js','./arq-business.js',
  './arq-workspace-6.js','./arq-workspace-app-6.js','./login.html','./prestadores.html','./descobrir.html','./painel-negocios.html',
  './ARQSELECT_LOGIN_PRESTADOR.html','./arq-admin-quality.js','./admin-qualidade.html','./arq-account.js','./arq-resilience.js','./arq-project-hub.js','./arq-rfq.js','./solicitar-orcamento.html','./arq-opportunities.js','./central-oportunidades.html','./sala-projeto.html','./404.html','./403.html','./500.html','./icon-192.png','./icon-512.png',
  './assets/ui/fallback-geral.svg','./assets/suppliers/identidade-pendente.svg'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE)
    .then(cache=>Promise.allSettled(STATIC.map(url=>cache.add(url))))
    .then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key.startsWith('arqselect-')&&key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin||url.searchParams.has('token'))return;
  const save=response=>{
    if(response&&response.ok)event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,response.clone())).catch(()=>{}));
    return response;
  };
  const isCode=/\.(?:js|css)$/i.test(url.pathname);
  if(request.mode==='navigate'||isCode){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request,{cache:'no-store'});
        if(response.ok)return save(response);
        return (await caches.match(request))||response;
      }catch(_){
        const cached=await caches.match(request);
        if(cached)return cached;
        if(request.mode==='navigate')return (await caches.match('./offline.html'))||Response.error();
        return Response.error();
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(request);
    const network=fetch(request).then(save).catch(()=>cached||Response.error());
    if(cached){event.waitUntil(network);return cached}
    return network;
  })());
});