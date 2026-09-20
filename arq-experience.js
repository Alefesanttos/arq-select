/* ARQSELECT Experience Layer 5.10.0 — motion, theme UI, accessibility, contrast, responsive runtime and progressive states */
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
    else if(file==='descobrir.html'){page='discover';surface='workspace'}
    else if(file==='painel-negocios.html'){page='business';surface='dashboard'}
    else if(file==='chat.html'||file==='mensagens.html'){page='chat';surface='workspace'}
    else if(file.includes('login')){page='login';surface='auth'}
    else if(file.startsWith('admin')){page='admin';surface='admin'}
    else if(file.includes('dashboard')){page='dashboard';surface='dashboard'}
    else if(file==='explorar.html'||file==='favoritos.html'||file==='comparar.html'||file==='fornecedores.html'||file==='arquitetos.html'||file==='prestadores.html'){page=file==='prestadores.html'?'providers':'marketplace';surface='marketplace'}
    else if(file.startsWith('produto')){page='product';surface='marketplace'}
    else if(file==='fornecedor.html'){page='supplier';surface='marketplace'}
    else if(file==='arquiteto.html'){page='architect';surface='marketplace'}
    else if(file==='prestador.html'){page='provider';surface='marketplace'}
    else if(b.dataset.servicePage){page='service-'+b.dataset.servicePage;surface=b.dataset.servicePage==='login'?'auth':'workspace'}
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


  function parseColor(value){
    const m=String(value||'').match(/^rgba?\(([^)]+)\)$/i);
    if(!m)return null;
    const p=m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    return p.length>=3&&p.slice(0,3).every(Number.isFinite)?[p[0],p[1],p[2],Number.isFinite(p[3])?p[3]:1]:null;
  }
  function luminance(rgb){
    const vals=rgb.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});
    return .2126*vals[0]+.7152*vals[1]+.0722*vals[2];
  }
  function blend(fg,bg){
    const a=fg[3]??1;return [fg[0]*a+bg[0]*(1-a),fg[1]*a+bg[1]*(1-a),fg[2]*a+bg[2]*(1-a),1];
  }
  function effectiveBackground(el){
    const layers=[];
    for(let node=el;node&&node.nodeType===1;node=node.parentElement){
      const s=getComputedStyle(node);
      if(s.backgroundImage&&s.backgroundImage!=='none'){
        if(/url\(/i.test(s.backgroundImage))return null;
      }
      const c=parseColor(s.backgroundColor);
      if(c){
        layers.push(c);
        if(c[3]===1){
          return layers.slice(0,-1).reverse().reduce((bg,layer)=>blend(layer,bg),c);
        }
      }
    }
    const fallback=root.dataset.arqTheme==='dark'?[13,16,14,1]:[244,241,235,1];
    return layers.reverse().reduce((bg,layer)=>blend(layer,bg),fallback);
  }
  function contrastRatio(a,b){
    const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
  }
  function clearAutoContrast(scope=doc.body){
    if(!scope)return;
    const nodes=[];
    if(scope.matches?.('[data-arq-auto-contrast]'))nodes.push(scope);
    scope.querySelectorAll?.('[data-arq-auto-contrast]').forEach(el=>nodes.push(el));
    nodes.forEach(el=>{
      const prev=el.dataset.arqPrevColor||'',priority=el.dataset.arqPrevColorPriority||'';
      if(prev)el.style.setProperty('color',prev,priority);else el.style.removeProperty('color');
      delete el.dataset.arqAutoContrast;delete el.dataset.arqPrevColor;delete el.dataset.arqPrevColorPriority;
    });
  }
  function scheduleContrastRepair(scope=doc.body){
    clearTimeout(scheduleContrastRepair._timer);
    clearAutoContrast(scope);
    scheduleContrastRepair._timer=setTimeout(()=>repairContrast(scope),80);
  }
  function repairContrast(scope=doc.body){
    if(!scope||!scope.querySelectorAll)return 0;
    const selector='h1,h2,h3,h4,h5,h6,p,span,a,button,label,small,li,td,th,input,textarea,select,strong,b';
    let fixed=0;
    scope.querySelectorAll(selector).forEach(el=>{
      if(el.closest('[data-arq-no-auto-contrast],.hero,.hero-content,.hero-bg,.arq-hero,.arq-hero-media,.arq-market-hero,.product-hero'))return;
      if(el.children.length>0&&!el.matches('a,button,label'))return;
      const s=getComputedStyle(el);
      if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return;
      const fg=parseColor(s.color),bg=effectiveBackground(el);
      if(!fg||!bg)return;
      const ratio=contrastRatio(blend(fg,bg),bg);
      const size=parseFloat(s.fontSize)||16,weight=parseInt(s.fontWeight,10)||400;
      const threshold=(size>=24||(size>=18.66&&weight>=700))?3:4.5;
      if(ratio+.03>=threshold)return;
      const dark=luminance(bg)<.42;
      const muted=el.matches('.muted,.meta,.small,.hint,.subtle,.role,.lead,.caption,.description,.desc,.helper,.help-text,.arq6-muted,.stat-sub,small');
      if(!('arqPrevColor' in el.dataset)){
        el.dataset.arqPrevColor=el.style.getPropertyValue('color')||'';
        el.dataset.arqPrevColorPriority=el.style.getPropertyPriority('color')||'';
      }
      const mode=dark?(muted?'dark-muted':'dark'):(muted?'light-muted':'light');
      const corrected=mode==='dark'?'#f5f2ea':mode==='dark-muted'?'#d3d0c6':mode==='light-muted'?'#4d4f49':'#171816';
      el.dataset.arqAutoContrast=mode;
      el.style.setProperty('color',corrected,'important');
      fixed++;
    });
    return fixed;
  }

  function responsiveRuntime(){
    const classify=()=>{
      const w=innerWidth||doc.documentElement.clientWidth||1366;
      root.dataset.arqViewport=w<=360?'xxs':w<=430?'xs':w<=680?'sm':w<=900?'md':w<=1180?'lg':'xl';
      doc.querySelectorAll('table').forEach(table=>{
        if(table.closest('.table-wrap,.arq6-table-wrap,.arq-responsive-table'))return;
        table.classList.add('arq-bare-table');
      });
      doc.querySelectorAll('.nav,.navlinks,.arq6-project-nav,.arq-categories-nav__inner').forEach(nav=>{
        nav.classList.toggle('arq-overflow-nav',nav.scrollWidth>nav.clientWidth+4);
      });
      doc.querySelectorAll('.toolbar,.actions,.top-actions,.arq-header-actions,.arq6-actions,.arq4-actions,.arq-form-actions,.srv-actions,.hero-actions').forEach(el=>el.classList.add('arq-action-wrap'));
    };
    classify();
    let timer;addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(classify,90)},{passive:true});
    addEventListener('orientationchange',()=>setTimeout(classify,120),{passive:true});
  }

  const iconPaths={
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9 20v-6h6v6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    project:'<path d="M4 5h16v14H4z"/><path d="M8 5V3h8v2"/><path d="M8 10h8M8 14h5"/>',
    briefcase:'<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V4h8v3M3 12h18"/>',
    message:'<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    grid:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'
  };
  function iconSvg(name,cls=''){return '<svg class="arq-ui-icon '+cls+'" viewBox="0 0 24 24" aria-hidden="true">'+(iconPaths[name]||iconPaths.info)+'</svg>'}

  function toastSystem(){
    if(doc.getElementById('arq-global-toast-host'))return;
    const host=doc.createElement('div');host.id='arq-global-toast-host';host.setAttribute('aria-live','polite');host.setAttribute('aria-atomic','false');doc.body.append(host);
    function toast(message,options={}){
      const tone=options.tone||'info',title=options.title||(tone==='success'?'Concluído':tone==='error'?'Não foi possível concluir':tone==='warning'?'Atenção':'ARQSELECT');
      const el=doc.createElement('div');el.className='arq-global-toast';el.dataset.tone=tone;el.setAttribute('role',tone==='error'?'alert':'status');
      const icon=tone==='success'?'check':tone==='error'||tone==='warning'?'alert':'info';
      el.innerHTML='<span class="arq-global-toast__icon">'+iconSvg(icon,'sm')+'</span><div class="arq-global-toast__copy"><b>'+escapeHtml(title)+'</b><span>'+escapeHtml(message||'')+'</span></div><button class="arq-global-toast__close" type="button" aria-label="Fechar">×</button>';
      const close=()=>{el.style.opacity='0';el.style.transform='translateY(8px)';setTimeout(()=>el.remove(),180)};
      el.querySelector('button').addEventListener('click',close);host.append(el);setTimeout(close,Math.max(2500,Number(options.duration)||4200));return el;
    }
    window.ARQSELECT_UI=Object.assign(window.ARQSELECT_UI||{},{toast,icon:iconSvg});
    window.addEventListener('arq:toast',event=>toast(event.detail?.message||event.detail?.text||'',event.detail||{}));
  }
  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

  function mobileNavigation(){
    if(doc.querySelector('.arq-mobile-nav'))return;
    const surface=doc.body.dataset.arqSurface||'',page=doc.body.dataset.arqPage||'';
    if(!['workspace','dashboard','admin'].includes(surface)||page==='login')return;
    const role=String(localStorage.getItem('ARQSELECT_PORTAL_TIPO')||'').toUpperCase();
    if(!role)return;
    const map={
      ARQUITETO:[['ARQSELECT_DASHBOARD_ARQUITETO.html','home','Início'],['ARQSELECT_ARQUITETO_PROJETOS.html','project','Projetos'],['descobrir.html','search','Descobrir',true],['chat.html','message','Chat'],['ARQSELECT_ARQUITETO_PERFIL.html','user','Perfil']],
      FORNECEDOR:[['ARQSELECT_DASHBOARD_FORNECEDOR.html','home','Início'],['oportunidades.html','briefcase','Leads'],['descobrir.html','search','Descobrir',true],['chat.html','message','Chat'],['ARQSELECT_FORNECEDOR_PERFIL.html','user','Perfil']],
      PRESTADOR:[['dashboard-prestador.html','home','Início'],['oportunidades-servicos.html','briefcase','Oportunidades'],['descobrir.html','search','Descobrir',true],['chat.html','message','Chat'],['prestador-onboarding.html','user','Perfil']],
      ADMIN:[['admin.html','grid','Admin'],['painel-negocios.html','briefcase','Negócios'],['descobrir.html','search','Descobrir',true],['chat.html','message','Chat'],['admin-prestadores.html','user','Rede']]
    };
    const items=map[role];if(!items)return;
    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const nav=doc.createElement('nav');nav.className='arq-mobile-nav';nav.setAttribute('aria-label','Navegação principal mobile');
    nav.innerHTML=items.map(([href,icon,label,primary])=>'<a href="'+href+'" '+((href.toLowerCase()===current)?'aria-current="page"':'')+' '+(primary?'data-primary="true"':'')+'>'+iconSvg(icon)+'<span>'+label+'</span></a>').join('');
    doc.body.append(nav);
  }

  function modalAccessibility(){
    const focusable='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const dialogs=()=>[...doc.querySelectorAll('.modal.open,.home-modal.open,.arq-modal.open,.arq6-modal:not([hidden]),[role="dialog"]:not([hidden])')].filter(el=>getComputedStyle(el).display!=='none');
    doc.querySelectorAll('.modal,.home-modal,.arq-modal,.arq6-modal,.modalbox,.modal-card,.modal-content,.dialog,.arq6-modal-card,.home-modal-card,.arq-dialog,.arq-modal__box').forEach(el=>{
      if(el.matches('.modal,.home-modal,.arq-modal,.arq6-modal')){if(!el.hasAttribute('role'))el.setAttribute('role','dialog');el.setAttribute('aria-modal','true')}
    });
    doc.addEventListener('keydown',e=>{
      const open=dialogs().at(-1);if(!open)return;
      if(e.key==='Escape'){const close=open.querySelector('.close,.home-modal-close,.arq-modal__close,[data-close],[data-modal-close]');if(close){e.preventDefault();close.click()}return}
      if(e.key!=='Tab')return;const list=[...open.querySelectorAll(focusable)].filter(x=>x.offsetParent!==null);if(!list.length)return;
      const first=list[0],last=list.at(-1);if(e.shiftKey&&doc.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&doc.activeElement===last){e.preventDefault();first.focus()}
    });
  }

  function mediaNormalization(){
    doc.querySelectorAll('.arq-product-card img,.arq-supplier-card img,.arq-catalog-card img,.profile-card img,.srv-card img,.arq-feed-post img').forEach(img=>{
      img.decoding='async';if(!img.closest('.hero,.arq-hero')&&!img.hasAttribute('loading'))img.loading='lazy';
    });
  }

  function actionFeedback(){
    doc.addEventListener('click',e=>{
      const el=e.target.closest('button,a');if(!el)return;
      if(el.matches('[aria-disabled="true"],:disabled')){e.preventDefault();return}
      if(el.matches('[data-copy]')){const value=el.dataset.copy||'';navigator.clipboard?.writeText(value).then(()=>window.ARQSELECT_UI?.toast?.('Copiado para a área de transferência.',{tone:'success'})).catch(()=>{})}
    });
  }

  function observeDynamic(){
    if(!('MutationObserver'in window))return;
    let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{skeletons();cardLight();mediaNormalization();activeNavigation();scheduleContrastRepair(doc.body)},80)}).observe(doc.body,{childList:true,subtree:true});
  }

  ready(()=>{
    markPage();responsiveRuntime();buildThemeControl();toastSystem();mobileNavigation();modalAccessibility();activeNavigation();progress();discovery();skeletons();reveal();cardLight();moveAccessibility();mediaNormalization();actionFeedback();imageMotion();scheduleContrastRepair(doc.body);observeDynamic();
    window.addEventListener('arq-theme-change',()=>scheduleContrastRepair(doc.body));requestAnimationFrame(()=>root.dataset.themeMotion='ready');
  });
})();
