(function(){
  'use strict';
  if(window.ARQWorkspace6)return;
  const A=()=>window.ARQSELECT6;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=v=>{if(typeof v==='number')return Number.isFinite(v)?v:0;let s=String(v??0).replace(/[^0-9,.-]/g,'');if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');return Number(s)||0;};
  const brl=v=>money(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const date=v=>{const d=new Date(v);return isNaN(d)?String(v||'—'):d.toLocaleString('pt-BR',{dateStyle:'medium'});};
  const qs=name=>new URLSearchParams(location.search).get(name)||'';
  const token=()=>A()?.token?.()||localStorage.getItem('ARQSELECT_PORTAL_TOKEN')||'';
  const role=()=>A()?.role?.()||String(localStorage.getItem('ARQSELECT_PORTAL_TIPO')||'').toUpperCase();
  function loginUrl(){return role()==='FORNECEDOR'?'ARQSELECT_LOGIN_FORNECEDOR.html':'ARQSELECT_LOGIN_ARQUITETO.html';}
  function requireAuth(allowed){if(!token()){location.href=loginUrl();return false;}if(allowed&&allowed.length&&!allowed.includes(role())&&!allowed.includes('ANY')){location.href=role()==='FORNECEDOR'?'ARQSELECT_DASHBOARD_FORNECEDOR.html':'ARQSELECT_DASHBOARD_ARQUITETO.html';return false;}return true;}
  async function api(action,data={},method='GET'){return A().api(action,{...data,token:token()},method);}
  async function projects(){const r=await api('portal_projetos');return r.projetos||[];}
  async function projectSelector(el,{value='',all=false,label='Projeto'}={}){const list=await projects();el.innerHTML=(all?'<option value="">Todos os projetos</option>':'')+list.map(p=>`<option value="${esc(p.id)}" ${String(p.id)===String(value)?'selected':''}>${esc(p.projeto||p.id)}${p.cidade?' · '+esc(p.cidade):''}</option>`).join('');if(!all&&!value&&list[0])el.value=list[0].id;return list;}
  function setTitle(title,subtitle){const t=document.querySelector('[data-page-title]'),s=document.querySelector('[data-page-subtitle]');if(t)t.textContent=title;if(s)s.textContent=subtitle||'';document.title=title+' | ARQSELECT';}
  function empty(title,text,action=''){return `<div class="arq6-empty"><b>${esc(title)}</b><p>${esc(text||'')}</p>${action}</div>`;}
  function status(v){const x=String(v||'—').toUpperCase();return `<span class="arq6-badge">${esc(x)}</span>`;}
  function shellError(el,msg){el.innerHTML=empty('Não foi possível carregar',msg||'Tente novamente.');}
  window.ARQWorkspace6={esc,money,brl,date,qs,token,role,requireAuth,api,projects,projectSelector,setTitle,empty,status,shellError};
})();
