/* ARQSELECT Experience Layer 5.7.0 — motion, theme UI, accessibility and progressive states */
(function(){
  'use strict';
  if(window.__ARQ_EXPERIENCE_570__)return;window.__ARQ_EXPERIENCE_570__=true;
  const doc=document,root=doc.documentElement;
  const reduce=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ready=fn=>doc.readyState==='loading'?doc.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  const themeApi=()=>window.ARQSELECT_THEME;

  function icon(theme){return theme==='dark'?'☾':theme==='light'?'☀':'◐'}
  function buildThemeControl(){
    if(doc.getElementById('arq-theme-control'))return;
    const host=doc.createElement('div');host.id='arq-theme-control';host.innerHTML=`<div id="arq-theme-menu" role="menu" aria-label="Escolher aparência" hidden>
      <button type="button" role="menuitemradio" data-theme-choice="light">☀ <span>Claro</span></button>
      <button type="button" role="menuitemradio" data-theme-choice="dark">☾ <span>Escuro</span></button>
      <button type="button" role="menuitemradio" data-theme-choice="auto">◐ <span>Sistema</span></button>
    </div><button id="arq-theme-trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Alterar tema"></button>`;
    doc.body.append(host);
    const trigger=host.querySelector('#arq-theme-trigger'),menu=host.querySelector('#arq-theme-menu');
    function sync(){const api=themeApi(),pref=api?.getPreference?.()||root.dataset.themePreference||'auto',resolved=api?.getResolved?.()||root.dataset.theme||'light';trigger.textContent=icon(resolved);trigger.title=`Tema ${resolved==='dark'?'escuro':'claro'} · preferência ${pref==='auto'?'do sistema':pref}`;menu.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.themeChoice===pref)))}
    function close(){menu.hidden=true;trigger.setAttribute('aria-expanded','false')}
    trigger.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(open)menu.querySelector('[aria-checked="true"]')?.focus()});
    menu.addEventListener('click',e=>{const b=e.target.closest('[data-theme-choice]');if(!b)return;themeApi()?.set?.(b.dataset.themeChoice,true);sync();close()});
    doc.addEventListener('click',e=>{if(!host.contains(e.target))close()});
    doc.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    window.addEventListener('arq-theme-change',sync);sync();
  }

  function markPage(){
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase(),b=doc.body;
    let page='generic',surface='content';
    if(file==='index.html'||b.classList.contains('arq-home')){page='home';surface='marketing'}
    else if(file==='feed.html'){page='feed';surface='workspace'}
    else if(file==='chat.html'||file==='mensagens.html'){page='chat';surface='workspace'}
    else if(file.includes('login')){page='login';surface='auth'}
    else if(file.startsWith('admin')){page='admin';surface='admin'}
    else if(file.includes('dashboard')){page='dashboard';surface='dashboard'}
    else if(file==='explorar.html'||file==='favoritos.html'||file==='comparar.html'||file==='fornecedores.html'||file==='arquitetos.html'){page='marketplace';surface='marketplace'}
    else if(file.startsWith('produto')){page='product';surface='marketplace'}
    else if(file==='fornecedor.html'){page='supplier';surface='marketplace'}
    else if(file==='arquiteto.html'){page='architect';surface='marketplace'}
    else if(b.dataset.module){page=b.dataset.module;surface='workspace'}
    else if(/projeto|proposta|solicit|oportunidade|avaliac|conex|notific|configur|atividade|calendario|financeiro|suporte|historico|ranking|seguranca/.test(file)){page=file.replace('.html','');surface='workspace'}
    b.dataset.arqPage=page;b.dataset.arqSurface=surface;
  }

  function activeNavigation(){
    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    doc.querySelectorAll('nav a[href],.sidebar a[href],.side a[href],.sidenav a[href]').forEach(a=>{const href=(a.getAttribute('href')||'').split(/[?#]/)[0].toLowerCase();if(href&&href===current)a.setAttribute('aria-current','page')});
  }

  function progress(){
    if(doc.querySelector('.arq-tech-progress'))return;
    const p=doc.createElement('div');p.className='arq-tech-progress';p.setAttribute('aria-hidden','true');doc.body.append(p);
    let ticking=false;const paint=()=>{ticking=false;const max=Math.max(1,doc.documentElement.scrollHeight-innerHeight);root.style.setProperty('--arq-progress',(Math.min(1,scrollY/max)*100).toFixed(2)+'%')};
    const request=()=>{if(!ticking){ticking=true;requestAnimationFrame(paint)}};paint();addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
  }

  function reveal(){
    if(reduce()||!('IntersectionObserver'in window))return;
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('arq-visible');obs.unobserve(e.target)}}),{rootMargin:'70px 0px -30px',threshold:.035});
    doc.querySelectorAll('main section,.arq6-card,.arq-product-card,.arq-supplier-card,.card,.panel').forEach((el,i)=>{if(el.closest('.modal,.arq6-modal,[role="dialog"]'))return;el.classList.add('arq-reveal');el.style.transitionDelay=Math.min(i%6,4)*30+'ms';obs.observe(el)});
  }

  function cardLight(){
    doc.querySelectorAll('.arq6-card,.arq-product-card,.arq-supplier-card,.card,.panel').forEach(el=>el.classList.add('arq-card-light'));
    if(reduce())return;
    doc.addEventListener('pointermove',e=>{const card=e.target.closest('.arq-card-light');if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty('--mx',((e.clientX-r.left)/Math.max(1,r.width)*100).toFixed(1)+'%');card.style.setProperty('--my',((e.clientY-r.top)/Math.max(1,r.height)*100).toFixed(1)+'%')},{passive:true});
  }

  function skeletons(){
    doc.querySelectorAll('.arq6-empty,.empty,.loading').forEach(el=>{if(!/carregando|buscando|abrindo/i.test(el.textContent||''))return;el.classList.add('arq-loading-stack');el.innerHTML='<span class="arq-skeleton arq-skeleton-line w60"></span><span class="arq-skeleton arq-skeleton-line w80"></span><span class="arq-skeleton arq-skeleton-card"></span>'});
  }

  function moveAccessibility(){
    const selectors='button[aria-label],a[aria-label],[role="button"][aria-label],button[title],iframe[title]';
    doc.querySelectorAll(selectors).forEach(el=>{const text=((el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||''));if(!/acessibilidade|accessibility|vlibras/i.test(text))return;let target=el;for(let n=el;n&&n!==doc.body;n=n.parentElement){if(getComputedStyle(n).position==='fixed'){target=n;break}}target.classList.add('arq-access-left');if(target.style)target.style.bottom='82px'});
  }

  function imageMotion(){
    if(reduce())return;
    const imgs=[...doc.querySelectorAll('.hero img,.hero-bg,.editorial-story img,.arq-profile-cover img')].filter(x=>!x.closest('.arq-thumbs'));
    if(!imgs.length)return;let frame=0;
    const paint=()=>{frame=0;const h=innerHeight||800;imgs.forEach(img=>{const r=img.getBoundingClientRect();if(r.bottom<0||r.top>h)return;const p=Math.max(0,Math.min(1,(h-r.top)/(h+r.height)));if(img.tagName==='IMG')img.style.objectPosition='50% '+(46+7*p).toFixed(2)+'%'})};
    addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(paint)},{passive:true});paint();
  }


  function discovery(){
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    if(file!=='index.html'&&file!=='explorar.html')return;if(doc.getElementById('arq-discovery'))return;
    const block=doc.createElement('section');block.id='arq-discovery';block.className='arq-discovery';block.setAttribute('aria-labelledby','arq-discovery-title');
    block.innerHTML='<div class="arq-discovery-kicker">Do desejo à especificação</div><h2 id="arq-discovery-title">Seu próximo projeto começa por uma boa escolha.</h2><p>Explore referências, salve seus favoritos e conecte materiais, fornecedores e decisões ao seu projeto dentro da ARQSELECT.</p><div class="arq-discovery-controls"><button type="button" aria-label="Ver referência anterior" data-direction="-1">←</button><button type="button" aria-label="Ver próxima referência" data-direction="1">→</button></div><div class="arq-discovery-track" tabindex="0" role="region" aria-label="Referências para seu projeto"></div><div class="arq-discovery-actions"><a href="explorar.html">Encontrar produtos →</a><a href="ARQSELECT_LOGIN_ARQUITETO.html#cadastro">Apresentar meu projeto</a></div>';
    const track=block.querySelector('.arq-discovery-track');
    [['arquitetura-editorial-interior-v1.webp','Ambientes que inspiram'],['materiais-curadoria-v1.webp','Materiais que valorizam'],['logistica-madeira-v1.webp','Da escolha à obra']].forEach(([src,title])=>{const a=doc.createElement('a');a.href='explorar.html';a.className='arq-discovery-card';a.innerHTML=`<img src="${src}" alt="${title}" loading="lazy" decoding="async" width="600" height="450"><span>${title} →</span>`;track.append(a)});
    block.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('click',()=>{const step=(track.firstElementChild?.getBoundingClientRect().width||280)+18;track.scrollBy({left:Number(button.dataset.direction)*step,behavior:reduce()?'auto':'smooth'})}));
    const footer=doc.querySelector('footer,.arq-footer');if(footer)footer.before(block);else(doc.querySelector('main')||doc.body).append(block);
  }

  function observeDynamic(){
    if(!('MutationObserver'in window))return;
    let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{skeletons();cardLight();activeNavigation()},80)}).observe(doc.body,{childList:true,subtree:true});
  }

  ready(()=>{
    markPage();buildThemeControl();activeNavigation();progress();discovery();skeletons();reveal();cardLight();moveAccessibility();imageMotion();observeDynamic();
    requestAnimationFrame(()=>root.dataset.themeMotion='ready');
  });
})();
