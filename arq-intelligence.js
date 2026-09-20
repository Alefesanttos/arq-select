(function(){
'use strict';
if(window.__ARQ_INTELLIGENCE_590__)return;window.__ARQ_INTELLIGENCE_590__=true;
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const token=()=>localStorage.getItem('ARQSELECT_PORTAL_TOKEN')||'';
const api=async(action,data={})=>window.ARQSELECT6?.api?window.ARQSELECT6.api(action,{...data,token:data.token??token()}):{sucesso:false,mensagem:'API indisponível'};
let state={type:'',rows:[]};
function localProducts(q){
 const A=window.ARQ;if(!A?.curated)return[];
 const terms=String(q||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\s+/).filter(x=>x.length>1);
 return A.curated.map(p=>{const hay=[p.nome,p.categoria,p.subcategoria,p.material,p.marca,p.aplicacao,p.descricao,p.fornecedor].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');let hits=0;terms.forEach(t=>{if(hay.includes(t))hits++});return {tipo:'PRODUTO',id:p.id,nome:p.nome,subtitulo:p.categoria,cidade:p.cidade||'',estado:p.estado||'',score:terms.length?Math.round(hits/terms.length*100):60,motivos:hits?[hits+' termo(s) compatíveis']:[p.categoria],url:'produto.html?id='+encodeURIComponent(p.id),imagem:p.imagem_thumb||p.imagem||''}}).filter(x=>!terms.length||x.score>0).sort((a,b)=>b.score-a.score).slice(0,24);
}
function card(x){return '<article class="arq6-card arq-discover-card">'+(x.imagem?'<img src="'+esc(x.imagem)+'" loading="lazy" decoding="async" alt="">':'')+'<div><div class="arq6-kicker">'+esc(x.tipo)+'</div><h3>'+esc(x.nome)+'</h3><p>'+esc(x.subtitulo||'')+'</p><div class="arq-discover-meta">'+([x.cidade,x.estado].filter(Boolean).join(' · ')?'<span>'+esc([x.cidade,x.estado].filter(Boolean).join(' · '))+'</span>':'')+'<b>'+Number(x.score||0)+'% compatível</b></div><div class="arq-discover-reasons">'+(x.motivos||[]).slice(0,3).map(m=>'<span>'+esc(m)+'</span>').join('')+'</div><a class="arq6-btn gold" href="'+esc(x.url||'#')+'">Ver conexão</a></div></article>'}
function render(){
 const type=state.type,rows=type?state.rows.filter(x=>x.tipo===type):state.rows;
 $('#smartResults').innerHTML=rows.length?rows.map(card).join(''):'<div class="arq6-empty">Nenhum resultado com esses critérios.</div>';
 const counts={};state.rows.forEach(x=>counts[x.tipo]=(counts[x.tipo]||0)+1);
 $('#smartTabs').innerHTML=[['','Todos'],['PRODUTO','Produtos'],['FORNECEDOR','Fornecedores'],['PRESTADOR','Prestadores'],['ARQUITETO','Arquitetos']].map(([v,l])=>'<button class="arq6-btn '+(state.type===v?'active':'')+'" data-type="'+v+'" role="tab">'+l+' '+(v?'('+Number(counts[v]||0)+')':'')+'</button>').join('');
 document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{state.type=b.dataset.type;render()});
}
async function projects(){
 if(!token())return;const r=await api('portal_projetos');if(!r.sucesso)return;$('#smartProject').innerHTML='<option value="">Sem projeto específico</option>'+(r.projetos||[]).map(p=>'<option value="'+esc(p.id)+'">'+esc(p.projeto||p.id)+'</option>').join('');
}
async function search(){
 const q=$('#smartQuery').value.trim(),city=$('#smartCity').value.trim(),stateUf=$('#smartState').value.trim(),projectId=$('#smartProject').value,type=$('#smartType').value;
 $('#smartResults').innerHTML='<div class="arq-loading-stack"><span class="arq-skeleton arq-skeleton-line w60"></span><span class="arq-skeleton arq-skeleton-card"></span></div>';
 const [remote]=await Promise.all([api('public_busca_inteligente',{token:token(),q,cidade:city,estado:stateUf,projetoId,tipo:type})]);
 const products=(!type||type==='PRODUTO')?localProducts(q):[];
 const remoteRows=remote.sucesso?(remote.resultados||[]):[];
 const map=new Map();[...products,...remoteRows].forEach(x=>map.set(x.tipo+'|'+x.id,x));
 state.rows=[...map.values()].sort((a,b)=>Number(b.score||0)-Number(a.score||0));state.type=type;
 $('#smartSummary').innerHTML='<b>'+state.rows.length+'</b> conexões encontradas'+(remote.metodo?' · '+esc(remote.metodo):'');
 render();
 const u=new URL(location.href);q?u.searchParams.set('q',q):u.searchParams.delete('q');history.replaceState(null,'',u);
}
function init(){
 $('#smartSuggestions').innerHTML=['Marcenaria alto padrão','Pisos de madeira','Esquadrias','Iluminação','Paisagismo','Automação residencial'].map(x=>'<button class="arq6-btn" type="button">'+x+'</button>').join('');
 $('#smartSuggestions').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('#smartQuery').value=b.textContent;search()});
 $('#smartSearch').onsubmit=e=>{e.preventDefault();search()};$('#smartClear').onclick=()=>{$('#smartQuery').value='';$('#smartCity').value='';$('#smartState').value='';$('#smartType').value='';state={type:'',rows:[]};render()};
 const q=new URLSearchParams(location.search).get('q');if(q){$('#smartQuery').value=q;setTimeout(search,80)}projects();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();