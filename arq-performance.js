/* ARQSELECT 5.9 — Real User Monitoring + safe performance hints. */
(function(){
'use strict';
if(window.__ARQ_PERFORMANCE_590__)return;window.__ARQ_PERFORMANCE_590__=true;
const C=window.ARQSELECT_CONFIG||{},API=()=>window.ARQSELECT_API_URL||C.apiUrl||C.API_URL||'';
const sample=()=>{try{if(navigator.doNotTrack==='1')return false;const key='ARQ_RUM_SAMPLE_590';let v=sessionStorage.getItem(key);if(v==null){v=Math.random()<.35?'1':'0';sessionStorage.setItem(key,v)}return v==='1'}catch(_){return Math.random()<.35}};
const metrics={},start=performance.timeOrigin||Date.now();let sent=false;
function rating(name,value){if(name==='LCP')return value<=2500?'good':value<=4000?'needs-improvement':'poor';if(name==='INP')return value<=200?'good':value<=500?'needs-improvement':'poor';if(name==='CLS')return value<=.1?'good':value<=.25?'needs-improvement':'poor';return 'info'}
function put(name,value,extra){if(!Number.isFinite(value))return;metrics[name]={value:Math.round(value*1000)/1000,rating:rating(name,value),...(extra||{})}}
function observe(){
 try{new PerformanceObserver(list=>{for(const e of list.getEntries())put('LCP',e.startTime,{element:e.element?.tagName||''})}).observe({type:'largest-contentful-paint',buffered:true})}catch(_){}
 try{let cls=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)cls+=e.value;put('CLS',cls)}).observe({type:'layout-shift',buffered:true})}catch(_){}
 try{let max=0;new PerformanceObserver(list=>{for(const e of list.getEntries()){if(e.interactionId&&e.duration>max){max=e.duration;put('INP',max,{event:e.name||''})}}}).observe({type:'event',buffered:true,durationThreshold:40})}catch(_){}
 try{const nav=performance.getEntriesByType('navigation')[0];if(nav){put('TTFB',nav.responseStart);put('DOM_READY',nav.domContentLoadedEventEnd);put('LOAD',nav.loadEventEnd||0,{type:nav.type||''})}const fcp=performance.getEntriesByName('first-contentful-paint')[0];if(fcp)put('FCP',fcp.startTime)}catch(_){}
}
function optimizeImages(){
 const imgs=[...document.images];const vh=innerHeight||800;
 imgs.forEach((img,i)=>{img.decoding=img.decoding||'async';const r=img.getBoundingClientRect();const critical=i<2||r.top<vh*1.15||img.closest('.hero,.arq-hero,[data-lcp]');if(critical){if(!img.loading)img.loading='eager';try{img.fetchPriority='high'}catch(_){}}else if(!img.hasAttribute('loading'))img.loading='lazy';if(!img.hasAttribute('width')&&!img.hasAttribute('height')&&img.complete&&img.naturalWidth&&img.naturalHeight){img.width=img.naturalWidth;img.height=img.naturalHeight}});
}
function payload(){
 const conn=navigator.connection||{};return {acao:'public_web_vitals',build:C.build||C.version||'5.9',path:location.pathname.replace(/[^a-zA-Z0-9_\-./]/g,''),device:innerWidth<=680?'mobile':innerWidth<=1100?'tablet':'desktop',viewport:innerWidth+'x'+innerHeight,connection:conn.effectiveType||'',navigation:performance.getEntriesByType('navigation')[0]?.type||'',metrics,ts:Date.now()-start};
}
function send(){if(sent||!sample()||!Object.keys(metrics).length)return;sent=true;const url=API();if(!url)return;try{fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload()),keepalive:true,credentials:'omit',cache:'no-store'}).catch(()=>{})}catch(_){}}
observe();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',optimizeImages,{once:true});else optimizeImages();
addEventListener('load',()=>{setTimeout(()=>{try{const nav=performance.getEntriesByType('navigation')[0];if(nav&&nav.loadEventEnd)put('LOAD',nav.loadEventEnd)}catch(_){}},0)},{once:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')send()});
addEventListener('pagehide',send,{once:true});
setTimeout(send,15000);
})();