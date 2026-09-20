/* ARQSELECT 6.0 — Ecosystem Core
   Cross-cutting resilience, canonical status vocabulary, drafts, recent views and share. */
(function(){
'use strict';
if(window.__ARQ_ECOSYSTEM_600__)return;window.__ARQ_ECOSYSTEM_600__=true;
const PREFIX='ARQ6_', doc=document;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const role=()=>String(localStorage.getItem('ARQSELECT_PORTAL_TIPO')||'').toUpperCase();
const token=()=>localStorage.getItem('ARQSELECT_PORTAL_TOKEN')||'';
const projectStatus=['NOVO','PLANEJAMENTO','COTAÇÃO','NEGOCIAÇÃO','EXECUÇÃO','CONCLUÍDO','CANCELADO'];
const leadStatus=['NOVO','VISUALIZADO','CONTATO INICIADO','PROPOSTA ENVIADA','NEGOCIAÇÃO','FECHADO','PERDIDO'];
const normalize=s=>String(s||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function canonicalStatus(value,type='project'){
 const raw=normalize(value),list=type==='lead'?leadStatus:projectStatus;
 const aliases={
  'EM ANALISE':'PLANEJAMENTO','EM ANALISE/ORCAMENTO':'COTAÇÃO','ORCAMENTO':'COTAÇÃO','ORÇAMENTO':'COTAÇÃO',
  'EM COTACAO':'COTAÇÃO','EM NEGOCIACAO':'NEGOCIAÇÃO','APROVADO':'NEGOCIAÇÃO','ACEITA':'NEGOCIAÇÃO',
  'EM EXECUCAO':'EXECUÇÃO','FINALIZADO':'CONCLUÍDO','FECHADO':'CONCLUÍDO','CANCELADO':'CANCELADO',
  'CONTATO':'CONTATO INICIADO','PROPOSTA':'PROPOSTA ENVIADA'
 };
 const candidate=aliases[raw]||value;
 return list.find(x=>normalize(x)===normalize(candidate))||String(value||list[0]);
}
function toast(message,options){return window.ARQSELECT_UI?.toast?.(message,options)||console.info('[ARQSELECT]',message)}
function store(key,value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value));return true}catch(_){return false}}
function read(key,fallback=null){try{const v=localStorage.getItem(PREFIX+key);return v==null?fallback:JSON.parse(v)}catch(_){return fallback}}
function draftKey(form){const page=location.pathname.split('/').pop()||'index',id=form.dataset.arqDraft||form.id||form.getAttribute('name')||'form';return 'DRAFT:'+page+':'+id}
function formData(form){const out={};new FormData(form).forEach((v,k)=>{if(v instanceof File)return;if(k in out)out[k]=[].concat(out[k],v);else out[k]=v});return out}
function applyDraft(form,data){if(!data||typeof data!=='object')return;Object.entries(data).forEach(([k,v])=>{const els=form.elements?.[k];if(!els)return;const list=els.length&&!els.tagName?[...els]:[els];list.forEach(el=>{if(el.type==='file'||el.type==='password')return;if(el.type==='checkbox'||el.type==='radio')el.checked=Array.isArray(v)?v.includes(el.value):String(v)===String(el.value)||v===true;else el.value=Array.isArray(v)?v[0]:v??''})})}
function autosave(){
 doc.querySelectorAll('form[data-arq-autosave],form[data-arq-draft]').forEach(form=>{
  if(form.dataset.arqAutosaveReady)return;form.dataset.arqAutosaveReady='1';
  const key=draftKey(form),saved=read(key);
  if(saved?.data){applyDraft(form,saved.data);form.dispatchEvent(new CustomEvent('arq:draft-restored',{bubbles:true,detail:saved}));}
  let timer;const save=()=>{clearTimeout(timer);timer=setTimeout(()=>store(key,{data:formData(form),savedAt:Date.now(),path:location.pathname}),350)};
  form.addEventListener('input',save);form.addEventListener('change',save);
  form.addEventListener('submit',()=>{try{localStorage.removeItem(PREFIX+key)}catch(_){}});
 });
}
function recent(){
 const map=[
  ['produto.html','PRODUTO'],['fornecedor.html','FORNECEDOR'],['arquiteto.html','ARQUITETO'],['prestador.html','PRESTADOR'],['projeto.html','PROJETO']
 ];
 const file=(location.pathname.split('/').pop()||'').toLowerCase(),found=map.find(x=>x[0]===file);if(!found)return;
 const q=new URLSearchParams(location.search),id=q.get('id')||q.get('projectId')||q.get('projetoId');if(!id)return;
 const list=read('RECENTES',[]).filter(x=>!(x.tipo===found[1]&&String(x.id)===String(id)));
 list.unshift({tipo:found[1],id:String(id),url:location.pathname+location.search,title:doc.title,at:Date.now()});store('RECENTES',list.slice(0,30));
}
function recentList(type){return read('RECENTES',[]).filter(x=>!type||x.tipo===type)}
function share(){
 doc.addEventListener('click',async e=>{const b=e.target.closest('[data-arq-share]');if(!b)return;e.preventDefault();const url=b.dataset.arqShareUrl||location.href,title=b.dataset.arqShareTitle||doc.title,text=b.dataset.arqShareText||'Veja na ARQSELECT';try{if(navigator.share)await navigator.share({title,text,url});else{await navigator.clipboard.writeText(url);toast('Link copiado.',{tone:'success'})}}catch(err){if(err?.name!=='AbortError')toast('Não foi possível compartilhar agora.',{tone:'error'})}});
}
function retries(){
 doc.addEventListener('click',e=>{const b=e.target.closest('[data-arq-retry]');if(!b)return;const event=b.dataset.arqRetry||'reload';if(event==='reload')location.reload();else window.dispatchEvent(new CustomEvent('arq:retry',{detail:{action:event,source:b}}))});
}
function network(){
 const banner=()=>{let el=doc.getElementById('arq-network-status');if(navigator.onLine){el?.remove();return}if(!el){el=doc.createElement('div');el.id='arq-network-status';el.className='arq-network-status';el.setAttribute('role','status');el.innerHTML='<b>Sem conexão.</b><span>Suas alterações locais continuam salvas. A ARQSELECT tentará novamente quando a internet voltar.</span>';doc.body.append(el)}};
 addEventListener('online',()=>{banner();toast('Conexão restabelecida.',{tone:'success'})});addEventListener('offline',banner);banner();
}
function privateDefaults(){
 doc.querySelectorAll('form').forEach(form=>{const el=form.elements?.visibilidade||form.elements?.privacidade||form.querySelector('[name="publico"]');if(!el||el.dataset.arqPrivacyReady)return;el.dataset.arqPrivacyReady='1';if(el.type==='checkbox'&&el.name==='publico')el.checked=false;else if(!el.value&&[...el.options||[]].some(o=>normalize(o.value)==='PRIVADO'))el.value=[...el.options].find(o=>normalize(o.value)==='PRIVADO').value});
}
function enhanceDynamic(){autosave();privateDefaults()}
function init(){autosave();recent();share();retries();network();privateDefaults();const mo=new MutationObserver(()=>{clearTimeout(init._t);init._t=setTimeout(enhanceDynamic,100)});mo.observe(doc.body,{childList:true,subtree:true});}
window.ARQSELECT_ECOSYSTEM={version:'6.0.0',role,token,canonicalStatus,projectStatus,leadStatus,toast,store,read,recentList,autosave,esc};
doc.readyState==='loading'?doc.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();