/* ARQSELECT Home Premium 2026 */
(function(){
  "use strict";

  function initMarquee(){
    const viewport=document.querySelector(".hp-brand-viewport");
    const track=viewport&&viewport.querySelector(".hp-brand-track");
    const group=track&&track.querySelector(".hp-brand-group");
    if(!viewport||!track||!group||track.dataset.hpMarquee==="1") return;
    track.dataset.hpMarquee="1";

    let offset=0;
    let width=1;
    let last=performance.now();
    const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed=reduce?18:42;

    const measure=()=>{
      width=Math.max(1,group.getBoundingClientRect().width);
      if(Math.abs(offset)>=width) offset=offset%width;
    };

    const frame=(now)=>{
      const dt=Math.min(50,Math.max(0,now-last));
      last=now;
      if(!document.hidden&&width>0){
        offset-=speed*(dt/1000);
        while(-offset>=width) offset+=width;
        track.style.transform="translate3d("+offset.toFixed(3)+"px,0,0)";
      }
      requestAnimationFrame(frame);
    };

    measure();
    if("ResizeObserver" in window){
      const ro=new ResizeObserver(measure);
      ro.observe(group);
      ro.observe(viewport);
    }else{
      window.addEventListener("resize",measure,{passive:true});
    }
    document.addEventListener("visibilitychange",()=>{last=performance.now()});
    requestAnimationFrame((now)=>{last=now;requestAnimationFrame(frame)});
  }

  function initReveals(){
    if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items=[...document.querySelectorAll("[data-hp-reveal]")];
    if(!items.length||!("IntersectionObserver" in window)) return;
    items.forEach(el=>el.classList.add("hp-reveal-ready"));
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("hp-reveal-in");
          io.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:"0px 0px -30px"});
    items.forEach(el=>io.observe(el));
  }

  function init(){
    initMarquee();
    initReveals();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
