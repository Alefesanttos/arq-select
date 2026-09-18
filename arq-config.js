(function(){
  "use strict";
  const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbz_jLzNa87U_himraaCczzqGpQdq63AyIVogQ9-YGnqXuQYl3OSJfV4E7xYfPdnv8-d/exec";
  const KEY = "ARQSELECT_API_URL";
  function clean(value){
    return String(value || "").trim().replace(/\/+$/, "");
  }
  function valid(value){
    const url=clean(value);
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/i.test(url);
  }
  const stored = clean(localStorage.getItem(KEY));
  const active = valid(stored) ? stored : DEFAULT_API_URL;
  window.ARQSELECT_API_URL = active;
  window.ARQSELECT_CONFIG = Object.freeze({
    version: "5.6.0",
    SYSTEM_NAME: "ARQSELECT", VERSION: "5.6.0", API_URL: active, WHATSAPP: "5519981655013", SITE_URL: "https://arqselect.com.br/",
    systemName: "ARQSELECT", siteUrl: "https://arqselect.com.br/", mediaBaseUrl: "",
    build: "2026.09.17.560-PROJECT-COMMERCE",
    apiUrl: active,
    defaultApiUrl: DEFAULT_API_URL,
    apiStorageKey: KEY,
    whatsapp: "5519981655013",
    setApiUrl(value){
      const url=clean(value);
      if(!valid(url)) throw new Error("Informe uma URL válida do Web App terminando em /exec.");
      localStorage.setItem(KEY,url);
      return url;
    },
    clearApiUrl(){ localStorage.removeItem(KEY); },
    isValidApiUrl: valid
  });
})();

/* ARQSELECT visual 5.5.2 — arquivo único; configurações acima preservadas.
 * Contraste em superfícies sólidas e movimento progressivo das imagens.
 * Não troca fotos de produtos nem interfere nos eventos comerciais.
 */
(function () {
  'use strict';
  if (window.__arqVisual552) return;
  window.__arqVisual552 = true;
  function start() {
    const css = document.createElement('style');
    css.id = 'arq-contrast-motion-552';
    css.textContent = `
html.arq-premium-ui,html {--arq-muted:#57534d;--arq-subtle:#57534d;scroll-behavior:smooth}
html body :is(input:not([type=checkbox]):not([type=radio]),select,textarea){color:#242520!important;background-color:#fff!important;color-scheme:light}
html body :is(input,textarea)::placeholder{color:#625e56!important;opacity:1}
html body select option{color:#242520;background:#fff}
html body :is(.arq-market-header,.arq-footer,.topbar,.top,.header,.side,.sidebar,.sidenav,.navbar,.arq-hero__content){color:#f6f3ed!important;--arq-text:#f6f3ed;--arq-text-strong:#f6f3ed;--arq-muted:#d3cec4;--muted:#d3cec4}
html body :is(.arq-product-card,.arq-filter,.arq-dialog,.arq-modal__box,.card,.panel,.box,.tile,.arq-supplier-card){--arq-text:#20211f;--arq-text-strong:#20211f;--arq-muted:#57534d;--muted:#57534d;color:#20211f}
html body .arq-hero__content :is(h1,p){color:#f6f3ed!important}
html body .arq-hero__content .arq-kicker{color:#e0bf86!important}
html body :is(.arq-btn--gold,.btn.gold,.btn-primary){color:#211a10!important}
html body :is(.arq-btn--whatsapp,.arq-whatsapp-float,.arq-global-wa){background:#146b3c!important;border-color:#146b3c!important;color:#fff!important}
html body .arq-btn--ghost{color:#fff!important;background:#272924!important;border-color:#a49f94!important}
html body .arq-cat-link{color:#e8e2d8!important}
html body .arq-cat-link.active{color:#fff!important;border-bottom-color:#e0bf86!important}
html body :is(.arq-product-card__cat,.arq-breadcrumb,.arq-caption){color:#615034}
html body :is(.arq-product-card__desc,.arq-product-card__meta){color:#57534d!important}
html body :is(a,button,input,select,textarea):focus-visible{outline:3px solid #957036!important;outline-offset:3px;box-shadow:0 0 0 5px #fff!important}
html body .arq-photo-scroll{transition:object-position .22s linear}
@media(hover:hover) and (prefers-reduced-motion:no-preference){
html body :is(.arq-product-card,.arq-catalog-card){transition:transform .25s ease,box-shadow .25s ease}
html body :is(.arq-product-card,.arq-catalog-card):hover{transform:translateY(-4px);box-shadow:0 16px 36px #18140d1a}
}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}html body .arq-photo-scroll{transition:none!important}}
`;
    document.head.appendChild(css);
    const reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : {matches:true};
    const animations = new Set();
    const registered = new WeakSet();
    const visible = new Set();
    const pending = new Set();
    let scheduled = false, frame = 0;
    const photoSelector = '.arq-discovery img,.arq-product-card__media img,.arq-catalog-card__cover img,.arq-hero>img,.arq-inspiration,.story-image img,.story-media img,.editorial-story img,.arq-home img,main img,.arq-profile-cover img';
    const panSelector = '.arq-hero>img,.arq-inspiration,.editorial-story img,.arq-profile-cover img';
    const rgba = value => {
      const m = String(value).match(/^rgba?\(([^)]+)\)$/);
      if (!m) return null;
      const a = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      return a.length >= 3 && a.every(Number.isFinite) ? [a[0],a[1],a[2],a.length > 3 ? a[3] : 1] : null;
    };
    const blend = (front,back) => [0,1,2].map(i => front[i]*front[3]+back[i]*(1-front[3])).concat(1);
    const lum = color => color.slice(0,3).map(c => {c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
    const ratio = (a,b) => {a=lum(a);b=lum(b);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);};
    function background(el) {
      const layers=[];
      for(let node=el;node && node.nodeType===1;node=node.parentElement){
        const s=getComputedStyle(node);
        if(s.backgroundImage && s.backgroundImage!=='none') return null;
        const c=rgba(s.backgroundColor);
        if(c){layers.push(c);if(c[3]===1)break;}
      }
      return layers.reverse().reduce((back,front)=>blend(front,back),[255,255,255,1]);
    }
    function contrast(el) {
      if(document.documentElement.hasAttribute("data-arq-theme")) return;
      if(!el.isConnected || el.closest('svg,canvas,script,style,noscript,[aria-hidden="true"]')) return;
      const text = Array.from(el.childNodes).some(n=>n.nodeType===3 && n.textContent.trim());
      if(!text && !el.matches('input,textarea,select')) return;
      const s=getComputedStyle(el), fg=rgba(s.color), bg=background(el);
      if(!fg||!bg||s.display==='none'||s.visibility==='hidden') return;
      if(ratio(blend(fg,bg),bg)>=4.5)return;
      const dark=[32,33,31,1],light=[255,255,255,1];
      el.style.setProperty('color',ratio(dark,bg)>=ratio(light,bg)?'#20211f':'#ffffff','important');
    }
    function paint(){
      frame=0;
      if(reduce.matches || document.hidden)return;
      const height=window.innerHeight||800;
      visible.forEach(img=>{
        if(!img.isConnected){visible.delete(img);return;}
        const rect=img.getBoundingClientRect();
        const progress=Math.max(0,Math.min(1,(height-rect.top)/(height+rect.height)));
        img.style.objectPosition='50% '+(42+16*progress).toFixed(2)+'%';
      });
    }
    function scroll(){if(!frame && visible.size && !reduce.matches)frame=requestAnimationFrame(paint);}
    const observer = typeof IntersectionObserver==='function' ? new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const img=entry.target;
        if(entry.isIntersecting){
          if(!registered.has(img)){
            registered.add(img);
            if(!reduce.matches && typeof img.animate==='function'){
              const a=img.animate([{opacity:.45,transform:'translateY(12px) scale(1.015)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
              animations.add(a);a.onfinish=a.oncancel=()=>animations.delete(a);
            }
          }
          if(img.matches(panSelector)){img.classList.add('arq-photo-scroll');visible.add(img);scroll();}
          else observer.unobserve(img);
        }else visible.delete(img);
      });
    },{rootMargin:'0px',threshold:.08}) : null;
    const observed = new WeakSet();
    function scan(root){
      if(root.nodeType!==1)return;
      const elements=[root,...root.querySelectorAll('*')];
      for(const el of elements){
        pending.add(el);
        if(observer && el.matches(photoSelector) && !el.closest('.arq-thumbs,.arq-supplier-card,.avatar,.brand,.logo,nav,header') && !observed.has(el)){observed.add(el);observer.observe(el);}
      }
      schedule();
    }
    function flush(deadline){
      scheduled=false;
      let count=0;
      for(const el of pending){
        pending.delete(el);contrast(el);
        if(++count>=100 || (deadline && deadline.timeRemaining()<3))break;
      }
      if(pending.size)schedule();
    }
    function schedule(){
      if(scheduled)return;scheduled=true;
      if(window.requestIdleCallback)window.requestIdleCallback(flush,{timeout:300});
      else setTimeout(()=>flush(null),16);
    }
    scan(document.body);
    if(typeof MutationObserver==='function')new MutationObserver(records=>{
      records.forEach(record=>record.removedNodes.forEach(node=>{if(node.nodeType===1 && observer){const imgs=node.matches('img')?[node]:Array.from(node.querySelectorAll('img'));imgs.forEach(img=>{observer.unobserve(img);visible.delete(img);observed.delete(img);});}}));
      records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)scan(node);else if(node.nodeType===3 && node.parentElement){pending.add(node.parentElement);schedule();}}));
    }).observe(document.body,{childList:true,subtree:true});
    window.addEventListener('load',()=>scan(document.body),{once:true});
    window.addEventListener('scroll',scroll,{passive:true});
    window.addEventListener('resize',scroll,{passive:true});
    if(reduce.addEventListener)reduce.addEventListener('change',()=>{
      if(reduce.matches){animations.forEach(a=>a.cancel());visible.forEach(img=>img.style.removeProperty('object-position'));}
      else scroll();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

/* ARQSELECT 5.5.3 — acabamento visual e descoberta progressiva. */
(function(){
 'use strict';
 if(window.__arqModern553)return;window.__arqModern553=true;
 function init(){
  const style=document.createElement('style');style.id='arq-modern-553';
  style.textContent=`
html body .arq-access-left,html body [vw],html body .uwy,html body #userwayAccessibilityIcon,html body #accessibilityWidget,html body #accessibility-button,html body .accessibility-widget,html body .accessibility-button,html body .acessibilidade-botao{left:max(16px,env(safe-area-inset-left))!important;right:auto!important;inset-inline-start:16px!important;inset-inline-end:auto!important}
html body .uwy .uai,html body [vw-plugin-wrapper],html body [vw-access-button]{left:0!important;right:auto!important}
html body :is(.arq-product-card,.arq-catalog-card,.arq-supplier-card){border-radius:16px;overflow:hidden;border-color:#dfd7c9;box-shadow:0 5px 22px #241b0c08}
html body :is(.arq-btn,.arq-home .btn){border-radius:9px;min-height:46px;letter-spacing:.015em}
html body :is(.arq-btn--gold,.arq-home .btn-gold){background:linear-gradient(120deg,#ead0a1,#bd914f)!important;color:#251c10!important;box-shadow:0 5px 16px #84612c24}
html body .arq-market-header{box-shadow:0 8px 24px #00000012}
html body .arq-search{border-radius:9px}
html body .arq-filter{border-radius:14px}
html body .arq-product-card__body{gap:3px}
html body :is(.arq-home .step,.arq-home .category,.arq-home .story-principle){border-radius:14px}
html body .arq-home .story-frame{overflow:hidden;border-radius:20px}
html body .arq-discovery{width:min(1440px,94%);margin:64px auto;padding:clamp(22px,4vw,48px);background:#eeeadf;color:#20211f;border:1px solid #d8cfbf;border-radius:24px}
html body .arq-discovery h2{color:#20211f;font:400 clamp(29px,3.5vw,48px)/1.12 Georgia,serif;margin:10px 0 16px;max-width:24ch}
html body .arq-discovery p{color:#514b41;max-width:65ch;margin:0 0 20px}
html body .arq-discovery .arq-discovery-kicker{color:#725326;letter-spacing:.15em;font-size:12px;font-weight:800;text-transform:uppercase}
html body .arq-discovery-track{display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:thin;padding:8px 2px 20px}
html body .arq-discovery-card{flex:0 0 calc((100% - 36px)/3);min-width:230px;scroll-snap-align:start;background:#fff;color:#20211f;border-radius:14px;overflow:hidden;text-decoration:none;border:1px solid #e0d8cb}
html body .arq-discovery-card img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;transition:transform .5s ease}
html body .arq-discovery-card span{display:block;padding:18px;font-weight:700;color:#20211f}
html body .arq-discovery-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:16px}
html body .arq-discovery-actions a{padding:13px 20px;border-radius:9px;text-decoration:none;background:#20211f;color:#fff!important;font-weight:700}
html body .arq-discovery-actions a+a{color:#302717!important;background:#e6cfaa}
html body .arq-discovery-controls{display:flex;justify-content:flex-end;gap:8px}
html body .arq-discovery-controls button{background:#fff;color:#302717!important;border:1px solid #a89b84;border-radius:50%;width:44px;height:44px;font-size:22px;cursor:pointer}
@media(hover:hover) and (prefers-reduced-motion:no-preference){html body .arq-discovery-card:hover img{transform:scale(1.035)}html body :is(.arq-btn,.arq-home .btn,.arq-discovery-actions a){transition:transform .2s ease,box-shadow .2s ease}html body :is(.arq-btn,.arq-home .btn,.arq-discovery-actions a):hover{transform:translateY(-2px);box-shadow:0 9px 24px #241b0c24}}
@media(max-width:700px){html body .arq-discovery{margin:36px auto;border-radius:18px}html body .arq-discovery-card{flex-basis:84%;min-width:0}html body .arq-discovery-actions a{width:100%;text-align:center}}
@media(prefers-reduced-motion:reduce){html body .arq-discovery-track{scroll-behavior:auto!important}html body .arq-discovery-card img{transition:none!important}}
`;
  document.head.append(style);
  function moveAccess(root){
   const selector='button[aria-label],a[aria-label],[role="button"][aria-label],button[title],iframe[title]';
   const nodes=[...(root.matches&&root.matches(selector)?[root]:[]),...root.querySelectorAll(selector)];
   nodes.forEach(el=>{
    const label=(el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'');
    if(!/acessibilidade|accessibility|vlibras/i.test(label))return;
    let target=el;
    for(let n=el;n && n!==document.body;n=n.parentElement){if(getComputedStyle(n).position==='fixed'){target=n;break;}}
    if(getComputedStyle(target).position==='fixed')target.classList.add('arq-access-left');
   });
  }
  moveAccess(document.body);
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(n=>{if(n.nodeType===1)moveAccess(n);}))).observe(document.body,{subtree:true,childList:true});
  const path=location.pathname.split('/').pop();
  if(!document.body.classList.contains('arq-home') && path!=='explorar.html')return;
  if(document.getElementById('arq-discovery'))return;
  const block=document.createElement('section');block.id='arq-discovery';block.className='arq-discovery';block.setAttribute('aria-labelledby','arq-discovery-title');
  block.innerHTML='<div class="arq-discovery-kicker">Do desejo à especificação</div><h2 id="arq-discovery-title">Seu próximo projeto começa por uma boa escolha.</h2><p>Explore referências, salve seus favoritos e converse com a ARQSELECT para encontrar soluções para o seu projeto.</p><div class="arq-discovery-controls"><button type="button" aria-label="Ver referência anterior" data-direction="-1">←</button><button type="button" aria-label="Ver próxima referência" data-direction="1">→</button></div><div class="arq-discovery-track" tabindex="0" role="region" aria-label="Referências para seu projeto"></div><div class="arq-discovery-actions"><a href="explorar.html">Encontrar produtos →</a><a href="ARQSELECT_LOGIN_ARQUITETO.html#cadastro">Apresentar meu projeto</a></div>';
  const track=block.querySelector('.arq-discovery-track');
  [['arquitetura-editorial-interior-v1.webp','Ambientes que inspiram'],['materiais-curadoria-v1.webp','Materiais que valorizam'],['logistica-madeira-v1.webp','Da escolha à obra']].forEach(([src,title])=>{
   const a=document.createElement('a');a.href='explorar.html';a.className='arq-discovery-card';
   const img=document.createElement('img');img.src=src;img.alt=title;img.loading='lazy';img.decoding='async';img.width=600;img.height=450;
   const label=document.createElement('span');label.textContent=title+' →';a.append(img,label);track.append(a);
  });
  block.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('click',()=>{
   const step=(track.firstElementChild.getBoundingClientRect().width||280)+18;
   track.scrollBy({left:Number(button.dataset.direction)*step,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }));
  const controls=block.querySelector('.arq-discovery-controls');
  function updateControls(){controls.hidden=track.scrollWidth<=track.clientWidth+2;const buttons=controls.querySelectorAll('button');buttons[0].disabled=track.scrollLeft<=1;buttons[1].disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}
  track.addEventListener('scroll',updateControls,{passive:true});window.addEventListener('resize',updateControls,{passive:true});requestAnimationFrame(updateControls);
  const footer=document.querySelector('footer,.arq-footer');
  if(footer)footer.before(block);else (document.querySelector('main')||document.body).append(block);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* 5.6.1 — temas sincronizados e contraste reforçado em toda a plataforma. */
(function(){
 'use strict';if(window.__arqThemes554)return;window.__arqThemes554=true;
 const root=document.documentElement, key='ARQSELECT_THEME';
 const media=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):{matches:false};
 const read=()=>{try{return localStorage.getItem(key)}catch(_){return null}};
 const valid=v=>['light','dark','auto'].includes(v);
 let preference=valid(read())?read():'light';
 function apply(value,persist){
  preference=valid(value)?value:'light';
  const resolved=preference==='auto'?(media.matches?'dark':'light'):preference;
  if(root.dataset.theme!==resolved)root.dataset.theme=resolved;
  root.dataset.themePreference=preference;
  if(root.dataset.arqTheme!==resolved)root.dataset.arqTheme=resolved;
  if(persist)try{localStorage.setItem(key,preference)}catch(_){}
  const fallback=document.getElementById('arq-theme-fallback');
  if(fallback){fallback.textContent=resolved==='dark'?'☾':'☀';fallback.setAttribute('aria-label','Tema '+(resolved==='dark'?'escuro':'claro')+'. Alterar tema.');fallback.title=fallback.getAttribute('aria-label');}
 }
 apply(preference,false);
 function start(){
  const style=document.createElement('style');style.id='arq-themes-554';
  style.textContent=`
html[data-arq-theme=light]{color-scheme:light;--t-bg:#f6f3ed;--t-surface:#fff;--t-soft:#eee8de;--t-text:#20211f;--t-muted:#57534d;--t-line:#c9c0b0;--t-accent:#725326}
html[data-arq-theme=dark]{color-scheme:dark;--t-bg:#111411;--t-surface:#1c211c;--t-soft:#272e27;--t-text:#f4f1e9;--t-muted:#c5c7be;--t-line:#596050;--t-accent:#e0bf86}
html[data-arq-theme] body{--tone:var(--t-text);--muted-tone:var(--t-muted);--arq-bg:var(--t-bg);--arq-bg-soft:var(--t-soft);--arq-surface:var(--t-surface);--arq-surface-2:var(--t-soft);--arq-text:var(--t-text);--arq-text-strong:var(--t-text);--arq-muted:var(--t-muted);--arq-subtle:var(--t-muted);--arq-border:var(--t-line);--arq-line:var(--t-line);--arq-gold-2:var(--t-accent);--bg:var(--t-bg);--card:var(--t-surface);--text:var(--t-text);--muted:var(--t-muted);--line:var(--t-line);background:var(--t-bg)!important;color:var(--t-text)!important}
html[data-arq-theme] body :is(h1,h2,h3,h4,h5,h6,p,label,legend,small,li,dt,dd,span,strong,b){color:var(--tone,var(--t-text))!important}
html[data-arq-theme] body :is(.card,.panel,.box,.tile,.item,.stat,.metric,.notice,.empty,.table-wrap,.home-modal-card,.access-card,.sheet,.form,.arq-product-card,.arq-filter,.arq-dialog,.arq-modal__box,.arq-supplier-card,.arq-catalog-card,.arq-discovery-card,.step,.category,.benefit-panel,.tier,.eco-card,.quote,.num,.story-principle,.cta-box,.concierge-card,.arq-admin-card,.arq-benefit,.arq4-card,.arq4-attention-card,.arq6-card,.arq6-row,.arq6-table-wrap){--tone:var(--t-text);--muted-tone:var(--t-muted);background:var(--t-surface)!important;color:var(--t-text)!important;border-color:var(--t-line)!important}
html[data-arq-theme] body :is(.arq-discovery,.editorial-story,.cta){--tone:var(--t-text);background:var(--t-soft)!important;color:var(--t-text)!important;border-color:var(--t-line)!important}
html[data-arq-theme] body :is(.arq-market-header,.arq-footer,.topbar,.top,.header,.side,.sidebar,.sidenav,.navbar,.arq-hero__content,.story-caption,.hero,.arq-home .hero,.arq-auth .hero){--tone:#f6f3ed;--muted-tone:#d3cec4;color:#f6f3ed!important}
html[data-arq-theme] body :is(.arq-market-header,.arq-footer,.topbar,.top,.header,.side,.sidebar,.sidenav,.navbar,.arq-hero__content){background:#121612!important}
html[data-arq-theme] body :is(.muted,.hint,.arq-caption,.arq-product-card__desc,.arq-product-card__meta,.arq-breadcrumb){color:var(--muted-tone,var(--t-muted))!important}
html[data-arq-theme] body :is(.arq-kicker,.arq-product-card__cat,.arq-discovery-kicker){color:var(--t-accent)!important}
html[data-arq-theme] body .arq-hero__content .arq-kicker{color:#e0bf86!important}
html[data-arq-theme] body :is(input:not([type=checkbox]):not([type=radio]),select,textarea){background:var(--t-surface)!important;color:var(--t-text)!important;border-color:var(--t-line)!important;color-scheme:inherit}
html[data-arq-theme] body select option{background:var(--t-surface)!important;color:var(--t-text)!important}
html[data-arq-theme] body :is(input,textarea)::placeholder{color:var(--t-muted)!important;opacity:1}
html[data-arq-theme] body :is(th,td){color:var(--t-text)!important;border-color:var(--t-line)!important}
html[data-arq-theme] body th{background:var(--t-soft)!important}
html[data-arq-theme] body :is(.arq-btn,.arq6-btn,.btn,.button,.arq-close,.arq-modal__close,.home-modal-close,.arq-quick,.arq-fav,.arq-discovery-controls button){--tone:var(--t-text);background:var(--t-surface)!important;color:var(--t-text)!important;border-color:var(--t-line)!important}
html[data-arq-theme] body :is(.arq-btn--gold,.btn.gold,.btn-gold,.btn-primary){--tone:#251c10;background:linear-gradient(120deg,#ead0a1,#bd914f)!important;color:#251c10!important;border-color:#bd914f!important}
html[data-arq-theme] body :is(.arq-btn--dark,.arq-btn--ghost,.arq-fav.active,.arq-discovery-actions a){--tone:#fff;background:#252c25!important;color:#fff!important;border-color:#76816d!important}
html[data-arq-theme] body :is(.arq-btn--whatsapp,.arq-whatsapp-float,.arq-global-wa,.whatsapp-concierge){--tone:#fff;background:#146b3c!important;color:#fff!important}
html[data-arq-theme] body :is(.arq-toast,.arq-product-card__badge,.arq-zoom-label){--tone:#20211f;background:#f6f3ed!important;color:#20211f!important}
html[data-arq-theme] body .arq-discovery-card span{color:var(--t-text)!important}
html[data-arq-theme] body #arq-theme-left{position:fixed!important;left:max(16px,env(safe-area-inset-left))!important;right:auto!important;bottom:max(96px,calc(env(safe-area-inset-bottom) + 96px))!important;z-index:9998;display:flex!important;align-items:center;gap:8px;padding:6px;background:var(--t-surface)!important;border:1px solid var(--t-line);border-radius:30px;box-shadow:0 6px 22px #0003}
html[data-arq-theme] body #arq-theme-left button{position:static!important;inset:auto!important;transform:none!important;display:grid!important;place-items:center;width:44px!important;height:44px!important;min-width:44px;padding:8px;border:0!important;border-radius:50%;background:var(--t-soft)!important;color:var(--t-text)!important;cursor:pointer;font-size:23px}
html[data-arq-theme] body #arq-theme-left svg{width:22px;height:22px;stroke:currentColor}
html[data-arq-theme] body #arq-theme-left button:focus-visible{outline:3px solid var(--t-accent)!important;outline-offset:3px}
@media print{html[data-arq-theme] body #arq-theme-left{display:none!important}}
`;
  document.head.append(style);
  const host=document.createElement('div');host.id='arq-theme-left';host.setAttribute('role','group');host.setAttribute('aria-label','Aparência do site');
  document.body.append(host);
  const fallback=document.createElement('button');fallback.id='arq-theme-fallback';fallback.type='button';host.append(fallback);
  fallback.addEventListener('click',()=>apply(root.dataset.arqTheme==='dark'?'light':'dark',true));
  function relocate(){
   if(!document || !host.isConnected)return;
   const existing=document.querySelector('[data-arq4-theme]');
   if(existing && existing.parentElement!==host){fallback.remove();host.append(existing);}
  }
  relocate();apply(preference,false);
  new MutationObserver(relocate).observe(document.body,{childList:true,subtree:true});
  new MutationObserver(()=>{
   const resolved=root.dataset.theme;
   const stored=read();
   const selected=valid(root.dataset.themePreference)?root.dataset.themePreference:stored;
   if(valid(selected))preference=selected;
   if(root.dataset.arqTheme!==resolved)apply(selected==='auto'?'auto':resolved,false);
  }).observe(root,{attributes:true,attributeFilter:['data-theme','data-theme-preference']});
  if(media.addEventListener)media.addEventListener('change',()=>{if(preference==='auto')apply('auto',false)});
  window.addEventListener('storage',event=>{if(event.key===key)apply(event.newValue,true)});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();


/* ARQSELECT 5.6 — carrega a camada de workspace sem bloquear páginas legadas. */
(function(){
 'use strict';if(window.__arq560Loader)return;window.__arq560Loader=true;
 function load(){
  if(!document.querySelector('link[data-arq6]')){const l=document.createElement('link');l.rel='stylesheet';l.href='arqselect-6.css?v=5.6.0';l.dataset.arq6='1';document.head.append(l);}
  if(!document.querySelector('script[data-arq6]')){const s=document.createElement('script');s.src='arqselect-6.js?v=5.6.0';s.defer=true;s.dataset.arq6='1';document.head.append(s);}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
