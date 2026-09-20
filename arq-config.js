/* ARQSELECT 5.10.3 — central configuration + theme runtime + harmony loader. */
(function(){
  "use strict";
  const DEFAULT_API_URL="https://script.google.com/macros/s/AKfycbz_jLzNa87U_himraaCczzqGpQdq63AyIVogQ9-YGnqXuQYl3OSJfV4E7xYfPdnv8-d/exec";
  const KEY="ARQSELECT_API_URL";
  const clean=value=>String(value||"").trim().replace(/\/+$/,"");
  const valid=value=>/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/i.test(clean(value));
  let stored="";try{stored=clean(localStorage.getItem(KEY))}catch(_){stored=""}
  const active=valid(stored)?stored:DEFAULT_API_URL;
  window.ARQSELECT_API_URL=active;
  window.ARQSELECT_CONFIG=Object.freeze({
    version:"5.10.3",SYSTEM_NAME:"ARQSELECT",VERSION:"5.10.3",API_URL:active,WHATSAPP:"5519981655013",SITE_URL:"https://arqselect.com.br/",
    systemName:"ARQSELECT",siteUrl:"https://arqselect.com.br/",mediaBaseUrl:"",build:"2026.09.20.5103-LIGHT-HERO-BUTTONS",
    apiUrl:active,defaultApiUrl:DEFAULT_API_URL,apiStorageKey:KEY,whatsapp:"5519981655013",
    setApiUrl(value){const url=clean(value);if(!valid(url))throw new Error("Informe uma URL válida do Web App terminando em /exec.");localStorage.setItem(KEY,url);return url;},
    clearApiUrl(){localStorage.removeItem(KEY);},isValidApiUrl:valid
  });
})();
(function(){
  "use strict";
  if(window.ARQSELECT_THEME)return;
  const KEY="ARQSELECT_THEME",root=document.documentElement,media=window.matchMedia?matchMedia("(prefers-color-scheme: dark)"):{matches:false};
  const valid=v=>["light","dark","auto"].includes(v);
  const read=()=>{try{const v=localStorage.getItem(KEY);return valid(v)?v:"auto"}catch(_){return "auto"}};
  const resolve=pref=>pref==="auto"?(media.matches?"dark":"light"):(pref==="dark"?"dark":"light");
  let preference=read();
  function metaColor(theme){return theme==="dark"?"#0d100e":"#f4f1eb"}
  function apply(pref,persist){preference=valid(pref)?pref:"auto";const resolved=resolve(preference);root.dataset.theme=resolved;root.dataset.arqTheme=resolved;root.dataset.themePreference=preference;root.style.colorScheme=resolved;if(persist){try{localStorage.setItem(KEY,preference)}catch(_){}}const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",metaColor(resolved));try{window.dispatchEvent(new CustomEvent("arq-theme-change",{detail:{preference,resolved}}))}catch(_){window.dispatchEvent(new Event("arq-theme-change"))}return resolved}
  apply(preference,false);
  window.ARQSELECT_THEME=Object.freeze({set(value,persist=true){return apply(value,persist)},getPreference(){return preference},getResolved(){return resolve(preference)},resolve});
  if(media.addEventListener)media.addEventListener("change",()=>{if(preference==="auto")apply("auto",false)});
  window.addEventListener("storage",event=>{if(event.key===KEY)apply(valid(event.newValue)?event.newValue:"auto",false)});
})();
(function(){
  "use strict";if(window.__arq570Loader)return;window.__arq570Loader=true;
  function load(){
    if(!document.querySelector('link[data-arq6]')){const l=document.createElement('link');l.rel='stylesheet';l.href='arqselect-6.css?v=5.10.3';l.dataset.arq6='1';document.head.append(l);}
    if(!document.querySelector('script[data-arq6]')){const s=document.createElement('script');s.src='arqselect-6.js?v=5.10.3';s.defer=true;s.dataset.arq6='1';document.head.append(s);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
(function(){
  "use strict";
  if(window.__ARQ570_GLOBAL_DESIGN_LOADER__)return;
  window.__ARQ570_GLOBAL_DESIGN_LOADER__=true;
  function ensureAssets(){
    const head=document.head||document.documentElement;
    let design=document.querySelector('link#arq-design-system,link[href*="arq-design-system.css"]');
    if(!design){design=document.createElement('link');design.id='arq-design-system';design.rel='stylesheet';design.href='arq-design-system.css?v=5.10.3';head.append(design);}
    else{if(!design.id)design.id='arq-design-system';design.href='arq-design-system.css?v=5.10.3';}
    if(!document.querySelector('script[src*="arq-experience.js"]')){const experience=document.createElement('script');experience.src='arq-experience.js?v=5.10.3';experience.defer=true;experience.dataset.arqExperience='1';head.append(experience);}
    if(!document.querySelector('script[src*="arq-performance.js"]')){const perf=document.createElement('script');perf.src='arq-performance.js?v=5.10.3';perf.defer=true;perf.dataset.arqPerformance='1';head.append(perf);}
  }
  ensureAssets();
})();
(function(){"use strict";if(window.__ARQ_SW_5100__)return;window.__ARQ_SW_5100__=true;if('serviceWorker' in navigator&&location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{}),{once:true});}})();
