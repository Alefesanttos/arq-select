(function(){
'use strict';
if(window.__ARQ_RFQ_610__)return;window.__ARQ_RFQ_610__=true;
const A=()=>window.ARQSELECT6,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const token=()=>localStorage.getItem('ARQSELECT_PORTAL_TOKEN')||'';
const role=()=>String(localStorage.getItem('ARQSELECT_PORTAL_TIPO')||'').toUpperCase();
const qs=new URLSearchParams(location.search);let projectId=qs.get('projectId')||qs.get('projetoId')||'',specRows=[],supplierRows=[];
const api=(action,data={},method='GET')=>A()?.api?A().api(action,{...data,token:data.token??token()},method):Promise.resolve({sucesso:false,mensagem:'API indisponível'});
function toast(m,tone='info'){window.ARQSELECT_UI?.toast?.(m,{tone})||A()?.toast?.(m)}
function itemTemplate(data={}){
 const id='I'+Math.random().toString(36).slice(2,9),productOptions=['<option value="">Categoria/descrição livre</option>'].concat(specRows.map(x=>'<option value="'+esc(x.ID)+'" data-name="'+esc(x.NOME||'')+'" '+(String(data.especificacaoId||'')===String(x.ID)?'selected':'')+'>'+esc(x.NOME||x.CATEGORIA||'Item')+'</option>')).join('');
 return '<article class="arq-rfq-item" data-item="'+id+'"><div class="arq-rfq-item-head"><b>Item de cotação</b><button class="arq6-btn danger" type="button" data-remove-item>Remover</button></div><div class="arq6-form arq-rfq-form-grid"><label>Produto / especificação<select name="especificacaoId">'+productOptions+'</select></label><label>Categoria<input name="categoria" value="'+esc(data.categoria||'')+'" placeholder="Ex.: Esquadrias"></label><label class="full">Descrição do item<input name="descricao" required value="'+esc(data.descricao||'')+'" placeholder="Ex.: Esquadria preta para fachada"></label><label>Quantidade<input name="quantidade" inputmode="decimal" value="'+esc(data.quantidade||'1')+'"></label><label>Unidade<input name="unidade" value="'+esc(data.unidade||'un')+'" placeholder="m², un, m…"></label><label>Medidas<input name="medidas" value="'+esc(data.medidas||'')+'" placeholder="Ex.: 2,40 x 1,80 m"></label><label>Ambiente<input name="ambiente" value="'+esc(data.ambiente||'')+'" placeholder="Sala, suíte…"></label><label class="full">Observações do item<textarea name="itemObservacoes" rows="3">'+esc(data.observacoes||'')+'</textarea></label></div></article>';
}
function addItem(data={}){const host=$('#rfqItems');host.insertAdjacentHTML('beforeend',itemTemplate(data));bindItems();summary()}
function bindItems(){
 $$('#rfqItems [data-remove-item]').forEach(b=>b.onclick=()=>{if($$('#rfqItems .arq-rfq-item').length<=1)return toast('Mantenha pelo menos um item na solicitação.','warning');b.closest('.arq-rfq-item').remove();summary()});
 $$('#rfqItems select[name=especificacaoId]').forEach(sel=>sel.onchange=()=>{const row=specRows.find(x=>String(x.ID)===String(sel.value));if(!row)return;const card=sel.closest('.arq-rfq-item');card.querySelector('[name=descricao]').value=row.NOME||'';card.querySelector('[name=categoria]').value=row.CATEGORIA||'';card.querySelector('[name=quantidade]').value=row.QUANTIDADE||'1';card.querySelector('[name=unidade]').value=row.UNIDADE||'un';card.querySelector('[name=medidas]').value=row.MEDIDAS||'';card.querySelector('[name=ambiente]').value=row.AMBIENTE||'';summary()});
 $$('#rfqItems input,#rfqItems textarea,#rfqItems select').forEach(el=>el.oninput=summary);
}
function collectItems(){return $$('#rfqItems .arq-rfq-item').map(card=>Object.fromEntries([...card.querySelectorAll('input,select,textarea')].map(el=>[el.name,el.value]))).filter(x=>x.descricao||x.especificacaoId)}
function summary(){
 const items=collectItems(),selected=$$('#rfqSuppliers input[type=checkbox]:checked').length,mode=$('input[name=modoEnvio]:checked')?.value||'RECOMENDADOS';
 $('#rfqSummary').innerHTML='<div class="arq-rfq-summary-row"><span>Itens</span><b>'+items.length+'</b></div><div class="arq-rfq-summary-row"><span>Envio</span><b>'+(mode==='RECOMENDADOS'?'Recomendados':'Selecionados')+'</b></div><div class="arq-rfq-summary-row"><span>Parceiros marcados</span><b>'+selected+'</b></div>';
}
async function readFiles(files){
 const list=[...files].slice(0,6),out=[];
 for(const f of list){
   if(f.size>4*1024*1024){out.push({nome:f.name,tamanho:f.size,grande:true});continue}
   const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=reject;r.readAsDataURL(f)});
   out.push({nome:f.name,tipo:f.type||'',tamanho:f.size,data});
 }
 return out;
}
async function loadProjects(){
 const r=await api('portal_projetos');if(!r.sucesso){toast(r.mensagem||'Não foi possível carregar seus projetos.','error');return}
 const rows=r.projetos||[],sel=$('#rfqProject');sel.innerHTML='<option value="">Selecione</option>'+rows.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.projeto||p.nome||p.id)+'</option>').join('');
 if(projectId){sel.value=projectId;await projectChanged()}else if(rows.length===1){sel.value=rows[0].id;projectId=rows[0].id;await projectChanged()}
}
async function projectChanged(){
 projectId=$('#rfqProject').value||'';if(!projectId)return;
 $('#backToProject').href='sala-projeto.html?projectId='+encodeURIComponent(projectId);
 const [spec,match]=await Promise.all([api('portal_especificacoes',{projetoId:projectId}),api('portal_matching_unificado',{projetoId:projectId})]);
 specRows=spec.sucesso?(spec.especificacoes||[]):[];supplierRows=match.sucesso?(match.recomendados||match.fornecedores||[]):[];
 const existing=$$('#rfqItems .arq-rfq-item');if(existing.length===1&&!existing[0].querySelector('[name=descricao]').value&&specRows.length){$('#rfqItems').innerHTML='';specRows.slice(0,Math.min(3,specRows.length)).forEach(x=>addItem({especificacaoId:x.ID,descricao:x.NOME,categoria:x.CATEGORIA,quantidade:x.QUANTIDADE,unidade:x.UNIDADE,medidas:x.MEDIDAS,ambiente:x.AMBIENTE}))}
 renderSuppliers();summary();
}
function renderSuppliers(){
 const host=$('#rfqSuppliers');if(!supplierRows.length){host.innerHTML='<div class="arq6-empty"><b>Nenhum parceiro recomendado ainda.</b><p>Você pode enviar a solicitação para matching automático no backend.</p></div>';return}
 host.innerHTML=supplierRows.slice(0,20).map(x=>'<label class="arq-rfq-supplier"><input type="checkbox" value="'+esc(x.id||x.ID)+'"><span><b>'+esc(x.nome||x.EMPRESA||'Fornecedor')+'</b><small>'+esc([x.categoria,x.cidade,x.estado].filter(Boolean).join(' · '))+'</small><em>'+Number(x.score||0)+'%</em></span></label>').join('');
 $$('#rfqSuppliers input').forEach(x=>x.onchange=summary);
}
async function submit(e){
 e.preventDefault();if(!projectId)return toast('Selecione um projeto.','warning');
 const form=$('#rfqForm'),btn=form.querySelector('[type=submit]');btn.disabled=true;btn.setAttribute('aria-busy','true');
 try{
   const fd=Object.fromEntries(new FormData(form));const items=collectItems();if(!items.length)throw new Error('Adicione pelo menos um item à solicitação.');
   const modo=fd.modoEnvio||'RECOMENDADOS',fornecedores=modo==='SELECIONADOS'?$$('#rfqSuppliers input:checked').map(x=>x.value):[];
   if(modo==='SELECIONADOS'&&!fornecedores.length)throw new Error('Selecione pelo menos um fornecedor ou use recomendações automáticas.');
   const anexos=await readFiles($('#rfqFiles').files||[]);
   const r=await api('portal_rfq_criar',{projetoId,items,fornecedores,modoEnvio:modo,prazoDesejado:fd.prazoDesejado,cidade:fd.cidade,estado:fd.estado,localizacao:fd.localizacao,observacoes:fd.observacoes,links:String(fd.links||'').split(/\n+/).map(x=>x.trim()).filter(Boolean),anexos},'POST');
   if(!r.sucesso)throw new Error(r.mensagem||'Não foi possível criar a solicitação.');
   form.dispatchEvent(new CustomEvent('arq:draft-clear',{bubbles:true}));toast(r.mensagem||'Solicitação enviada com sucesso.', 'success');
   setTimeout(()=>location.href='comparar-propostas.html?projectId='+encodeURIComponent(projectId),700);
 }catch(err){toast(err.message||'Falha ao enviar solicitação.','error')}finally{btn.disabled=false;btn.removeAttribute('aria-busy')}
}
function init(){
 if(!token()||!['ARQUITETO','ADMIN'].includes(role())){location.href='login.html';return}
 $('#addRfqItem').onclick=()=>addItem();$('#rfqProject').onchange=projectChanged;$('#rfqForm').onsubmit=submit;$$('input[name=modoEnvio]').forEach(x=>x.onchange=summary);
 addItem();loadProjects();summary();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();