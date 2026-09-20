/* ARQSELECT 6.0 — progressive enhancement for matching and quote comparison. */
(function(){
'use strict';
if(window.__ARQ_PROJECT_ENH_600__)return;window.__ARQ_PROJECT_ENH_600__=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],A=()=>window.ARQSELECT6,W=()=>window.ARQSELECT_WORKSPACE,E=()=>window.ARQSELECT_ECOSYSTEM;
const projectId=()=>new URLSearchParams(location.search).get('projectId')||new URLSearchParams(location.search).get('projetoId')||'';
const money=n=>Number(String(n||'').replace(/[^0-9,.-]/g,'').replace(/\./g,'').replace(',','.'))||0;
function once(key,fn){if(document.documentElement.dataset[key])return;document.documentElement.dataset[key]='1';fn()}
function enhanceMatching(){
 const main=$('#moduleContent');if(!main||!main.querySelector('.arq6-score'))return;
 once('arqMatchEnh',()=>{
  const cards=$$('#moduleContent .arq6-card').filter(c=>c.querySelector('.arq6-score')),toolbar=document.createElement('section');toolbar.className='arq-match-filters arq6-card';
  const cats=[...new Set(cards.map(c=>(c.querySelector('p')?.textContent||'').split('·')[0].trim()).filter(Boolean))].sort();
  toolbar.innerHTML='<label>Categoria<select id="arqMatchCat"><option value="">Todas</option>'+cats.map(x=>'<option>'+x+'</option>').join('')+'</select></label><label>Compatibilidade mínima<select id="arqMatchScore"><option value="0">Qualquer</option><option value="60">60%+</option><option value="75">75%+</option><option value="90">90%+</option></select></label><label>Ordenar<select id="arqMatchSort"><option value="score">Maior compatibilidade</option><option value="name">Nome</option></select></label>';
  const grid=cards[0]?.parentElement;grid?.before(toolbar);
  const render=()=>{const cat=$('#arqMatchCat').value,min=Number($('#arqMatchScore').value),sort=$('#arqMatchSort').value;const list=cards.filter(c=>{const p=(c.querySelector('p')?.textContent||''),score=Number((c.querySelector('.arq6-score')?.textContent||'').match(/(\d+)/)?.[1]||0);return(!cat||p.startsWith(cat))&&score>=min}).sort((a,b)=>sort==='name'?(a.querySelector('h3')?.textContent||'').localeCompare(b.querySelector('h3')?.textContent||'','pt-BR'):Number((b.querySelector('.arq6-score')?.textContent||'').match(/(\d+)/)?.[1]||0)-Number((a.querySelector('.arq6-score')?.textContent||'').match(/(\d+)/)?.[1]||0));cards.forEach(c=>c.hidden=true);list.forEach(c=>{c.hidden=false;grid?.append(c)})};
  toolbar.querySelectorAll('select').forEach(x=>x.addEventListener('change',render));render();
 });
}
function enhanceCompare(){
 const main=$('#moduleContent'),table=main?.querySelector('table');if(!table)return;
 once('arqQuoteEnh',()=>{
  const rows=[...table.tBodies[0]?.rows||[]],head=table.tHead?.rows?.[0];if(!rows.length||!head)return;
  const favKey='PROPOSTAS_FAVORITAS:'+projectId(),read=()=>new Set(E()?.read?.(favKey,[])||[]),save=set=>E()?.store?.(favKey,[...set]);
  const toolbar=document.createElement('section');toolbar.className='arq-quote-toolbar arq6-card';toolbar.innerHTML='<label>Ordenar<select id="arqQuoteSort"><option value="value">Menor valor</option><option value="rating">Maior reputação</option><option value="supplier">Fornecedor</option></select></label><label><input type="checkbox" id="arqQuoteFav"> Somente favoritas</label>';
  table.closest('.arq6-table-wrap')?.before(toolbar);
  const star=document.createElement('th');star.textContent='★';head.prepend(star);
  rows.forEach(row=>{
    const details=row.querySelector('a[href*="propostas-portal.html?id="]'),id=details?new URL(details.href,location.href).searchParams.get('id'):'',cell=row.insertCell(0),button=document.createElement('button');button.className='arq6-btn ghost';button.dataset.proposalFav=id;button.type='button';cell.append(button);
    const actions=row.cells[row.cells.length-1]?.querySelector('.arq6-actions');if(actions&&id&&W()?.role?.()!=='FORNECEDOR'){
      const chat=document.createElement('a');chat.className='arq6-btn';chat.textContent='Chat';chat.href='chat.html?projetoId='+encodeURIComponent(projectId())+'&propostaId='+encodeURIComponent(id);actions.append(chat);
      [['Revisar','SOLICITAR ALTERAÇÃO',''],['Recusar','RECUSADA','danger'],['Aceitar','ACEITA','gold']].forEach(([label,status,cls])=>{const b=document.createElement('button');b.className='arq6-btn '+cls;b.type='button';b.textContent=label;b.addEventListener('click',async()=>{if(!confirm('Atualizar proposta para '+status+'?'))return;b.disabled=true;const r=await W().api('portal_proposta_status',{id,status},'POST');A()?.toast?.(r.mensagem||'Proposta atualizada.',r.sucesso?{tone:'success'}:{tone:'error'});if(r.sucesso)location.reload();else b.disabled=false});actions.append(b)});
    }
  });
  const render=()=>{const fav=read(),only=$('#arqQuoteFav').checked,sort=$('#arqQuoteSort').value;rows.forEach(r=>{const b=r.querySelector('[data-proposal-fav]'),id=b?.dataset.proposalFav||'';if(b){b.textContent=fav.has(id)?'★':'☆';b.setAttribute('aria-pressed',fav.has(id)?'true':'false');b.onclick=()=>{const set=read();set.has(id)?set.delete(id):set.add(id);save(set);render()}}r.hidden=only&&!fav.has(id)});const visible=rows.filter(r=>!r.hidden).sort((a,b)=>{if(sort==='supplier')return(a.cells[1]?.textContent||'').localeCompare(b.cells[1]?.textContent||'','pt-BR');if(sort==='rating')return money(b.cells[8]?.textContent)-money(a.cells[8]?.textContent);return money(a.cells[4]?.textContent)-money(b.cells[4]?.textContent)});visible.forEach(r=>table.tBodies[0].append(r))};
  toolbar.querySelectorAll('select,input').forEach(x=>x.addEventListener('change',render));render();
 });
}
function run(){const mod=document.body.dataset.module;if(mod==='matching')enhanceMatching();if(mod==='compare')enhanceCompare()}
const mo=new MutationObserver(()=>{clearTimeout(run._t);run._t=setTimeout(run,80)});mo.observe(document.documentElement,{childList:true,subtree:true});document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run,{once:true}):run();
})();