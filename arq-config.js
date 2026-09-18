/* ARQSELECT 5.7.0 — central configuration + theme runtime. */
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
    version:"5.7.0",SYSTEM_NAME:"ARQSELECT",VERSION:"5.7.0",API_URL:active,WHATSAPP:"5519981655013",SITE_URL:"https://arqselect.com.br/",
    systemName:"ARQSELECT",siteUrl:"https://arqselect.com.br/",mediaBaseUrl:"",build:"2026.09.17.570-DESIGN-SYSTEM",
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
  function apply(pref,persist){
    preference=valid(pref)?pref:"auto";
    const resolved=resolve(preference);
    root.dataset.theme=resolved;root.dataset.arqTheme=resolved;root.dataset.themePreference=preference;root.style.colorScheme=resolved;
    if(persist){try{localStorage.setItem(KEY,preference)}catch(_){}}
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",metaColor(resolved));
    try{window.dispatchEvent(new CustomEvent("arq-theme-change",{detail:{preference,resolved}}))}catch(_){window.dispatchEvent(new Event("arq-theme-change"))}
    return resolved;
  }
  apply(preference,false);
  window.ARQSELECT_THEME=Object.freeze({
    set(value,persist=true){return apply(value,persist)},
    getPreference(){return preference},getResolved(){return resolve(preference)},resolve
  });
  if(media.addEventListener)media.addEventListener("change",()=>{if(preference==="auto")apply("auto",false)});
  window.addEventListener("storage",event=>{if(event.key===KEY)apply(valid(event.newValue)?event.newValue:"auto",false)});
})();

/* Load workspace layer only when a legacy page has not already loaded it. */
(function(){
  "use strict";if(window.__arq570Loader)return;window.__arq570Loader=true;
  function load(){
    if(!document.querySelector('link[data-arq6]')){const l=document.createElement('link');l.rel='stylesheet';l.href='arqselect-6.css?v=5.7.0';l.dataset.arq6='1';document.head.append(l);}
    if(!document.querySelector('script[data-arq6]')){const s=document.createElement('script');s.src='arqselect-6.js?v=5.7.0';s.defer=true;s.dataset.arq6='1';document.head.append(s);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
