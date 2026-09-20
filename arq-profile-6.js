(function(){
'use strict';
if(window.__ARQ_PROFILE_620__)return;window.__ARQ_PROFILE_620__=true;
const A=()=>window.ARQSELECT6,$=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),token=()=>localStorage.getItem('ARQSELECT_PORTAL_TOKEN')||'';
const api=(a,d={},m='GET')=>A()?.api?A().api(a,{...d,token:d.token??token()},m):Promise.resolve({sucesso:false});
const type=String(document.body.dataset.profileType||document.body.dataset.servicePage==='provider'?'PRESTADOR':'').toUpperCase(),id=new URLSearchParams(location.search).get('id')||'';
function toast(m,t='info'){window.ARQSELECT_UI?.toast?.(m,{tone:t})||A()?.toast?.(m)}
function badge(label,tone=''){return '<span class="arq-trust-badge '+tone+'">'+esc(label)+'</span>'}
function trust(r){
 const rep=r.reputacao||{},badges=r.badges||[];return '<section class="arq-profile-trust"><div class="arq-profile-trust-score"><span>REPUTAÇÃO ARQSELECT</span><strong>'+Math.round(Number(rep.score||0))+'</strong><small>/100</small></div><div class="arq-profile-trust-facts">'+
 '<div><b>'+Number(rep.avaliacao||0).toFixed(1)+' ★</b><span>'+Number(rep.avaliacoes||0)+' avaliações elegíveis</span></div>'+
 '<div><b>'+esc(rep.resposta||'Sem histórico suficiente')+'</b><span>Tempo de resposta</span></div>'+
 '<div><b>'+Math.round(Number(rep.completude||0))+'%</b><span>Perfil completo</span></div>'+
 '</div><div class="arq-profile-badges">'+(r.verificado?badge('✓ ARQSELECT Verificado','verified'):'')+badges.map(x=>badge(x)).join('')+'</div></section>'}
function supplierSections(p){
 return '<section class="arq6-card arq-showroom-section"><div class="arq6-kicker">SHOWROOM DIGITAL</div><h2>Sobre a empresa</h2><p>'+esc(p.historia||p.descricao||'Informações comerciais disponíveis mediante contato.')+'</p><div class="arq-profile-facts">'+
 [['Segmentos',p.segmentos],['Marcas',p.marcas],['Área atendida',p.areaAtendida||p.regiao],['Equipe',p.equipe],['Certificações',p.certificacoes]].filter(x=>x[1]).map(x=>'<div><span>'+x[0]+'</span><b>'+esc(Array.isArray(x[1])?x[1].join(' · '):x[1])+'</b></div>').join('')+
 '</div><div class="arq6-actions"><button class="arq6-btn gold" data-profile-cta="RFQ">SOLICITAR ORÇAMENTO</button><button class="arq6-btn" data-profile-cta="PROJECT">ADICIONAR AO PROJETO</button><button class="arq6-btn" data-profile-cta="CHAT">FALAR COM A EMPRESA</button></div></section>';
}
function architectSections(p){
 return '<section class="arq6-card arq-showroom-section"><div class="arq6-kicker">PORTFÓLIO PROFISSIONAL</div><h2>Atuação e linguagem</h2><p>'+esc(p.bio||p.descricao||'Perfil profissional ARQSELECT.')+'</p><div class="arq-profile-facts">'+
 [['Escritório',p.empresa],['Especialidades',p.especialidades],['Estilo',p.estilos],['Localização',p.regiao||[p.cidade,p.estado].filter(Boolean).join(' · ')],['Projetos publicados',p.projetosPublicados],['Conexões',p.conexoes]].filter(x=>x[1]!==undefined&&x[1]!==null&&x[1]!=='').map(x=>'<div><span>'+x[0]+'</span><b>'+esc(Array.isArray(x[1])?x[1].join(' · '):x[1])+'</b></div>').join('')+
 '</div></section>';
}
function providerSections(p){
 return '<section class="arq6-card arq-showroom-section"><div class="arq6-kicker">PERFIL PROFISSIONAL</div><h2>Serviços e capacidade</h2><div class="arq-profile-facts">'+
 [['Especialidades',p.especialidades],['Experiência',p.experiencia],['Região atendida',p.areaAtendida||p.regiao],['Disponibilidade',p.disponibilidade],['Equipe',p.equipe]].filter(x=>x[1]).map(x=>'<div><span>'+x[0]+'</span><b>'+esc(Array.isArray(x[1])?x[1].join(' · '):x[1])+'</b></div>').join('')+
 '</div></section>';
}
async function load(){
 if(!id)return;let t=type;if(!t){t=location.pathname.includes('fornecedor')?'FORNECEDOR':location.pathname.includes('arquiteto')?'ARQUITETO':'PRESTADOR'}
 let r=await api('public_perfil_profissional',{tipo:t,id,token:''});if(!r.sucesso)r=await api('public_reputacao',{tipo:t,id,token:''});if(!r.sucesso)return;
 const host=document.querySelector('#profileRoot,[data-public-provider],main');if(!host)return;
 const insert=()=>{if(document.getElementById('arqProfileTrust'))return false;const anchor=host.querySelector('.arq-section,.srv-profile-head,.srv-grid,h1')||host.firstElementChild;if(!anchor)return false;const wrap=document.createElement('div');wrap.id='arqProfileTrust';wrap.innerHTML=trust(r)+(t==='FORNECEDOR'?supplierSections(r.perfil||{}):t==='ARQUITETO'?architectSections(r.perfil||{}):providerSections(r.perfil||{}));anchor.insertAdjacentElement('afterend',wrap);bind(t,r);return true};
 if(!insert()){const mo=new MutationObserver(()=>{if(insert())mo.disconnect()});mo.observe(host,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),6000)}
}
function bind(t,r){
 document.querySelectorAll('[data-profile-cta]').forEach(b=>b.onclick=()=>{const action=b.dataset.profileCta;if(action==='RFQ'){if(!token()){location.href='login.html';return}A()?.chooseProject?.(projectId=>location.href='solicitar-orcamento.html?projectId='+encodeURIComponent(projectId)+'&fornecedorId='+encodeURIComponent(id));return}if(action==='PROJECT'){if(!token()){location.href='login.html';return}A()?.chooseProject?.(async projectId=>{const x=await api('portal_fornecedor_convidar',{projetoId:projectId,fornecedorId:id},'POST');toast(x.mensagem||'Fornecedor adicionado.',x.sucesso?'success':'error')});return}if(action==='CHAT'){if(!token()){location.href='login.html';return}location.href='chat.html?contatoId='+encodeURIComponent(id)+'&tipo='+encodeURIComponent(t)}})
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',load,{once:true}):load();
})();