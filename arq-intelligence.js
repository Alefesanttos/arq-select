(function(){
'use strict';
if(window.__ARQ_INTELLIGENCE_620__)return;window.__ARQ_INTELLIGENCE_620__=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const token=()=>localStorage.getItem('ARQSELECT_PORTAL_TOKEN')||'';
const api=async(action,data={})=>window.ARQSELECT6?.api?window.ARQSELECT6.api(action,{...data,token:data.token??token()}):{sucesso:false,mensagem:'API indisponível'};
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let state={type:'',rows:[]};
function filters(){return {q:$('#smartQuery')?.value.trim()||'',cidade:$('#smartCity')?.value.trim()||'',estado:$('#smartState')?.value.trim()||'',categoria:$('#smartCategory')?.value||'',material:$('#smartMaterial')?.value.trim()||'',estilo:$('#smartStyle')?.value.trim()||'',faixaPreco:$('#smartPrice')?.value||'',verificado:$('#smartVerified')?.checked?'SIM':'',projetoId:$('#smartProject')?.value||'',tipo:$('#smartType')?.value||''}}
function localProducts(f){
 const A=window.ARQ;if(!A?.curated)return[];const terms=norm([f.q,f.material,f.estilo].filter(Boolean).join(' ')).split(/\s+/).filter(x=>x.length>1);
 return A.curated.map(p=>{const hay=norm([p.nome,p.categoria,p.subcategoria,p.material,p.marca,p.aplicacao,p.descricao,p.fornecedor,p.estilo,p.acabamento].join(' '));let hits=0;terms.forEach(t=>{if(hay.includes(t))hits++});let score=terms.length?Math.round(hits/terms.length*65):45,motivos=[];if(hits){motivos.push(hits+' termo(s) compatíveis')}if(f.categoria&&norm(p.categoria).includes(norm(f.categoria))){score+=20;motivos.push('Categoria compatível')}if(f.material&&hay.includes(norm(f.material))){score+=10;motivos.push('Material compatível')}if(f.estilo&&hay.includes(norm(f.estilo))){score+=5;motivos.push('Aplicação/estilo compatível')}return {tipo:'PRODUTO',id:p.id,nome:p.nome,subtitulo:p.categoria,cidade:p.cidade||'',estado:p.estado||'',score:Math.min(100,score),motivos:motivos.length?motivos:[p.categoria],url:'produto.html?id='+encodeURIComponent(p.id),imagem:p.imagem_thumb||p.imagem||'',categoria:p.categoria,material:p.material,verificado:true}}).filter(x=>(!terms.length||x.score>45)&&(!f.categoria||norm(x.categoria).includes(norm(f.categoria)))).sort((a,b)=>b.score-a.score).slice(0,32);
}
function card(x){return '<article class="arq6-card arq-discover-card">'+(x.imagem?'<img src="'+esc(x.imagem)+'" loading="lazy" decoding="async" alt="">':'')+'<div><div class="arq6-kicker">'+esc(x.tipo)+(x.verificado?' · ✓ VERIFICADO':'')+'</div><h3>'+esc(x.nome)+'</h3><p>'+esc(x.subtitulo||x.descricao||'')+'</p><div class="arq-discover-meta">'+([x.cidade,x.estado].filter(Boolean).join(' · ')?'<span>'+esc([x.cidade,x.estado].filter(Boolean).join(' · '))+'</span>':'')+'<b>'+Math.round(Number(x.score||0))+'% compatível</b></div><div class="arq-discover-reasons">'+(x.motivos||[]).slice(0,4).map(m=>'<span>'+esc(m)+'</span>').join('')+'</div><a class="arq6-btn gold" href="'+esc(x.url||'#')+'">Ver conexão</a></div></article>'}
function render(){
 const rows=state.type?state.rows.filter(x=>x.tipo===state.type):state.rows,counts={};state.rows.forEach(x=>counts[x.tipo]=(counts[x.tipo]||0)+1);
 $('#smartResults').innerHTML=rows.length?rows.map(card).join(''):'<div class="arq6-empty"><b>Nenhum resultado com esses critérios.</b><p>Remova um filtro ou tente uma descrição mais ampla.</p></div>';
 $('#smartTabs').innerHTML=[['','Todos'],['PRODUTO','Produtos'],['FORNECEDOR','Fornecedores'],['PRESTADOR','Prestadores'],['ARQUITETO','Arquitetos']].map(([v,l])=>'<button class="arq6-btn '+(state.type===v?'active':'')+'" data-type="'+v+'" role="tab">'+l+(v?' ('+Number(counts[v]||0)+')':'')+'</button>').join('');
 $$('[data-type]').forEach(b=>b.onclick=()=>{state.type=b.dataset.type;render()});
}
async function recent(){if(!token())return;const r=await api('portal_vistos_recentemente',{limite:10});if(!r.sucesso||!(r.itens||[]).length)return;$('#recentSection').hidden=false;$('#recentItems').innerHTML=(r.itens||[]).map(x=>'<a href="'+esc(x.URL||x.url||'#')+'"><b>'+esc(x.TITULO||x.titulo||'Conteúdo ARQSELECT')+'</b><small>'+esc(x.TIPO||x.tipo||'')+'</small></a>').join('')}
async function projects(){if(!token())return;const r=await api('portal_projetos');if(!r.sucesso)return;$('#smartProject').innerHTML='<option value="">Sem projeto específico</option>'+(r.projetos||[]).map(p=>'<option value="'+esc(p.id)+'">'+esc(p.projeto||p.id)+'</option>').join('');const q=new URLSearchParams(location.search).get('projectId');if(q)$('#smartProject').value=q}
async function search(){
 const f=filters();$('#smartResults').innerHTML='<div class="arq-loading-stack"><span class="arq-skeleton arq-skeleton-line w60"></span><span class="arq-skeleton arq-skeleton-card"></span></div>';
 let remote=await api('public_descoberta_avancada',{...f,token:token()});if(!remote.sucesso)remote=await api('public_busca_inteligente',{q:f.q,cidade:f.cidade,estado:f.estado,projetoId:f.projetoId,tipo:f.tipo,token:token()});
 const products=(!f.tipo||f.tipo==='PRODUTO')?localProducts(f):[],remoteRows=remote.sucesso?(remote.resultados||[]):[];
 const map=new Map();[...products,...remoteRows].forEach(x=>{if(f.verificado&&x.tipo!=='PRODUTO'&&!x.verificado)return;map.set(x.tipo+'|'+x.id,x)});
 state.rows=[...map.values()].sort((a,b)=>Number(b.score||0)-Number(a.score||0));state.type=f.tipo;
 $('#smartSummary').innerHTML='<b>'+state.rows.length+'</b> conexões encontradas'+(f.projetoId?' com contexto do projeto':'')+(remote.metodo?' · '+esc(remote.metodo):'');render();
 const u=new URL(location.href);f.q?u.searchParams.set('q',f.q):u.searchParams.delete('q');f.projetoId?u.searchParams.set('projectId',f.projetoId):u.searchParams.delete('projectId');history.replaceState(null,'',u);
}
function clear(){['smartQuery','smartCity','smartState','smartMaterial','smartStyle'].forEach(id=>{if($('#'+id))$('#'+id).value=''});['smartCategory','smartPrice','smartProject','smartType'].forEach(id=>{if($('#'+id))$('#'+id).value=''});if($('#smartVerified'))$('#smartVerified').checked=false;state={type:'',rows:[]};render()}
function init(){
 $('#smartSuggestions').innerHTML=['Marcenaria alto padrão','Pisos de madeira','Esquadrias pretas','Iluminação','Paisagismo','Automação residencial'].map(x=>'<button class="arq6-btn" type="button">'+x+'</button>').join('');
 $('#smartSuggestions').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('#smartQuery').value=b.textContent;search()});$('#smartSearch').onsubmit=e=>{e.preventDefault();search()};$('#smartClear').onclick=clear;
 $$('#smartCity,#smartState,#smartCategory,#smartMaterial,#smartStyle,#smartPrice,#smartVerified,#smartProject').forEach(el=>el.addEventListener('change',()=>{if(state.rows.length)search()}));
 const q=new URLSearchParams(location.search).get('q');if(q)$('#smartQuery').value=q;Promise.all([projects(),recent()]).then(()=>{if(q||new URLSearchParams(location.search).get('projectId'))search()});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();