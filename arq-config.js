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
    version: "5.5.1",
    SYSTEM_NAME: "ARQSELECT", VERSION: "5.5.1", API_URL: active, WHATSAPP: "5519981655013", SITE_URL: "https://arqselect.com.br/",
    systemName: "ARQSELECT", siteUrl: "https://arqselect.com.br/", mediaBaseUrl: "",
    build: "2026.09.16.551-CARGA-INTEGRADA",
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
html body :is(.arq-market-header,.arq-footer,.topbar,.sidebar,.sidenav,.navbar,.arq-hero__content){color:#f6f3ed!important;--arq-text:#f6f3ed;--arq-text-strong:#f6f3ed;--arq-muted:#d3cec4;--muted:#d3cec4}
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
    const photoSelector = '.arq-product-card__media img,.arq-catalog-card__cover img,.arq-hero>img,.arq-inspiration,.story-image img,.story-media img,.editorial-story img,.arq-home img,main img,.arq-profile-cover img';
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
