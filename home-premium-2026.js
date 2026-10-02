/* ARQSELECT Home Premium 2026 */
(function(){
  "use strict";

  function initMarquee(){
    const viewport=document.querySelector(".hp-brand-viewport");
    const track=viewport&&viewport.querySelector(".hp-brand-track");
    const group=track&&track.querySelector(".hp-brand-group");
    if(!viewport||!track||!group||track.dataset.hpMarquee==="1") return;
    track.dataset.hpMarquee="1";

    const clone=group.cloneNode(true);
    clone.removeAttribute('role');clone.removeAttribute('aria-label');
    clone.setAttribute('aria-hidden','true');
    clone.querySelectorAll('[role]').forEach(el=>el.removeAttribute('role'));
    clone.querySelectorAll('img').forEach(img=>img.alt='');
    track.append(clone);
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const button=document.querySelector('.hp-brand-pause');
    let width=1,last=0,offset=0,paused=motion.matches,hover=false,focused=false,visible=true,drag=null,resumeAt=0;
    const paint=()=>{offset=((offset%width)+width)%width;viewport.scrollLeft=offset;};
    const measure=()=>{width=Math.max(1,group.getBoundingClientRect().width);paint()};
    const sync=()=>{button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Retomar movimento dos logos':'Pausar movimento dos logos');button.textContent=paused?'▶':'Ⅱ'};
    button.addEventListener('click',()=>{paused=!paused;sync()});
    motion.addEventListener('change',()=>{paused=motion.matches;sync()});
    viewport.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true});
    viewport.addEventListener('pointerleave',()=>{hover=false});
    viewport.addEventListener('focus',()=>{focused=true});
    viewport.addEventListener('blur',()=>{focused=false});
    viewport.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,offset};viewport.setPointerCapture(e.pointerId)});
    viewport.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;offset=drag.offset+drag.x-e.clientX;paint()});
    const release=()=>{drag=null;resumeAt=performance.now()+1800};
    viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);
    viewport.addEventListener('dragstart',e=>e.preventDefault());
    viewport.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();offset+=e.key==='ArrowRight'?180:-180;paint()});
    viewport.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();offset+=e.deltaX;paint();resumeAt=performance.now()+1800}},{passive:false});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting}).observe(viewport);
    if('ResizeObserver' in window)new ResizeObserver(measure).observe(group);else addEventListener('resize',measure,{passive:true});
    const frame=now=>{const dt=last?Math.min(50,now-last):0;last=now;if(!paused&&!hover&&!focused&&!drag&&visible&&!document.hidden&&now>resumeAt){offset+=42*dt/1000;paint()}requestAnimationFrame(frame)};
    measure();sync();requestAnimationFrame(frame);
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
