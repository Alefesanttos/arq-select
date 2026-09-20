(function(){
'use strict';
if(window.__ARQ_ONBOARDING_620__)return;window.__ARQ_ONBOARDING_620__=true;
const A=()=>window.ARQSELECT6,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const token=()=>localStorage.getItem('ARQSELECT_PORTAL_TOKEN')||'',role=()=>String(localStorage.getItem('ARQSELECT_PORTAL_TIPO')||'').toUpperCase();
const api=(a,d={},m='GET')=>A()?.api?A().api(a,{...d,token:d.token??token()},m):Promise.resolve({sucesso:false,mensagem:'API indisponível'});
const expected=String(document.body.dataset.onboardingRole||'').toUpperCase();
function toast(m,t='info'){window.ARQSELECT_UI?.toast?.(m,{tone:t})||A()?.toast?.(m)}
function values(name){return $$('[name="'+name+'"]:checked').map(x=>x.value)}
function fill(data={}){
 Object.entries(data).forEach(([k,v])=>{const els=$$('[name="'+CSS.escape(k)+'"]');if(!els.length)return;if(els[0].type==='checkbox'){const arr=Array.isArray(v)?v:String(v||'').split(/[,;]+/).map(x=>x.trim()).filter(Boolean);els.forEach(x=>x.checked=arr.includes(x.value))}else els[0].value=v??''});
 progress();
}
function payload(status='CONCLUIDO'){
 const out=Object.fromEntries(new FormData($('#onboardingForm')));
 for(const name of ['segmentos','categorias'])if($$('[name="'+name+'"]').length)out[name]=values(name);
 return {...out,papel:expected,status};
}
function progress(){
 const inputs=$$('#onboardingForm input:not([type=checkbox]),#onboardingForm select,#onboardingForm textarea');
 const groups=[...new Set($$('#onboardingForm input[type=checkbox]').map(x=>x.name))];
 const filled=inputs.filter(x=>String(x.value||'').trim()).length+groups.filter(n=>values(n).length).length,total=inputs.length+groups.length,pct=Math.round(filled/Math.max(1,total)*100);
 $('#onboardingProgress').innerHTML='<div class="arq-progress"><i style="width:'+pct+'%"></i></div><p><b>'+pct+'% completo</b> · informações melhores geram recomendações melhores.</p>';
}
async function save(status){
 const r=await api('portal_onboarding_salvar',payload(status),'POST');
 toast(r.mensagem||'Dados salvos.',r.sucesso?'success':'error');return r;
}
async function init(){
 if(!token()||role()!==expected){location.href='login.html';return}
 const r=await api('portal_onboarding_get',{papel:expected});if(r.sucesso)fill(r.dados||{});
 $('#onboardingForm').addEventListener('input',progress);
 $('#saveLater').onclick=()=>save('RASCUNHO');
 $('#onboardingForm').onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;const r=await save('CONCLUIDO');b.disabled=false;if(r.sucesso)setTimeout(()=>location.href=expected==='ARQUITETO'?'ARQSELECT_DASHBOARD_ARQUITETO.html':'ARQSELECT_DASHBOARD_FORNECEDOR.html',500)};
 progress();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();