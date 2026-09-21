(function(){
'use strict';
if(window.__ARQ_RESILIENCE_600__)return;window.__ARQ_RESILIENCE_600__=true;
const PREFIX='ARQ_DRAFT_600_',TTL=14*86400000;
const token=()=>localStorage.getItem('ARQSELECT_PORTAL_TOKEN')||'';
const api=(action,data,method='POST')=>window.ARQSELECT6?.api?window.ARQSELECT6.api(action,{...data,token:token()},method):Promise.resolve({sucesso:false});
const safeName=n=>!/senha|password|token|secret|arquivo|file|cpf|cnpj/i.test(String(n||''));
function formKey(form){return form.dataset.arqDraft||form.id||[location.pathname,location.search].join('')}
function serialize(form){const out={};[...form.elements].forEach(el=>{if(!el.name||!safeName(el.name)||el.disabled||['file','password','submit','button'].includes(el.type))return;if(el.type==='checkbox')out[el.name]=!!el.checked;else if(el.type==='radio'){if(el.checked)out[el.name]=el.value}else out[el.name]=String(el.value??'').slice(0,8000)});return out}
function restore(form,data){if(!data||typeof data!=='object')return 0;let n=0;Object.entries(data).forEach(([name,value])=>{if(!safeName(name))return;const els=[...form.querySelectorAll('[name="'+CSS.escape(name)+'"]')];els.forEach(el=>{if(['file','password'].includes(el.type))return;if(el.type==='checkbox')el.checked=!!value;else if(el.type==='radio')el.checked=String(el.value)===String(value);else if(!el.value)el.value=value;n++})});return n}
function localGet(key){try{const x=JSON.parse(localStorage.getItem(PREFIX+key)||'null');if(!x||Date.now()-Number(x.ts||0)>TTL){localStorage.removeItem(PREFIX+key);return null}return x}catch(_){return null}}
function localSave(key,data){try{localStorage.setItem(PREFIX+key,JSON.stringify({ts:Date.now(),data}))}catch(_){}}
function clear(form){const key=formKey(form);try{localStorage.removeItem(PREFIX+key)}catch(_){}if(token())api('portal_rascunho_excluir',{chave:key},'POST').catch(()=>{})}
async function hydrateServer(form,key){if(!token()||localGet(key))return;try{const r=await api('portal_rascunho_obter',{chave:key},'GET'),draft=r?.rascunho;if(draft?.dados&&restore(form,draft.dados)){localSave(key,draft.dados);window.ARQSELECT_UI?.toast?.('Rascunho recuperado do servidor.',{tone:'info',duration:3600})}}catch(_){}}
function bind(form){if(form.dataset.arqAutosaveBound)return;form.dataset.arqAutosaveBound='1';const key=formKey(form),local=localGet(key);if(local&&restore(form,local.data)){window.ARQSELECT_UI?.toast?.('Rascunho recuperado automaticamente.',{tone:'info',duration:3200})}else hydrateServer(form,key);
 let timer;const save=()=>{const data=serialize(form);localSave(key,data);if(token())api('portal_rascunho_salvar',{chave:key,tipo:form.dataset.arqDraftType||'FORMULARIO',projetoId:new URLSearchParams(location.search).get('projectId')||new URLSearchParams(location.search).get('id')||'',dados:data},'POST').catch(()=>{})};
 form.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(save,650)});form.addEventListener('change',()=>{clearTimeout(timer);timer=setTimeout(save,250)});form.addEventListener('reset',()=>setTimeout(()=>clear(form),0));
 form.addEventListener('arq:draft-clear',()=>clear(form));form.addEventListener('arq:submit-success',()=>clear(form));
}
function autoBind(){document.querySelectorAll('form[data-arq-autosave],form[data-arq-draft]').forEach(bind)}
function retryButton(root=document){root.querySelectorAll?.('[data-arq-retry]').forEach(b=>{if(b.dataset.arqRetryBound)return;b.dataset.arqRetryBound='1';b.addEventListener('click',()=>location.reload())})}
function monitor(){
 addEventListener('error',e=>{const d={tipo:'JS_ERROR',pagina:location.pathname,mensagem:String(e.message||'Erro de interface').slice(0,500),arquivo:String(e.filename||'').slice(0,300),linha:e.lineno||0};if(token())api('portal_monitor_evento',d,'POST').catch(()=>{})});
 addEventListener('unhandledrejection',e=>{const d={tipo:'PROMISE_REJECTION',pagina:location.pathname,mensagem:String(e.reason?.message||e.reason||'Falha assíncrona').slice(0,500)};if(token())api('portal_monitor_evento',d,'POST').catch(()=>{})});
}
function init(){autoBind();retryButton();monitor();const mo=new MutationObserver(()=>{autoBind();retryButton()});mo.observe(document.body,{childList:true,subtree:true});window.ARQSELECT_RESILIENCE={bind,clear,serialize}}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();