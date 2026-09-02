(function () {
  "use strict";
  const root=document.getElementById("profileRoot"),type=(document.body.dataset.profileType||"").toUpperCase(),id=new URLSearchParams(location.search).get("id")||"";
  if(!root)return;
  const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const safeUrl=value=>{try{const url=new URL(value,location.href);return url.protocol==="https:"?url.href:"";}catch(_){return "";}};
  const stars=value=>`${Number(value||0).toFixed(1)} ★`;
  const loginHref=type==="FORNECEDOR"?"ARQSELECT_LOGIN_ARQUITETO.html":"login.html";

  async function connect() {
    if(!ARQSELECT4.token){location.href=loginHref;return;}
    const result=await ARQSELECT4.api("portal_conexao_solicitar",{destinatarioId:id,contexto:"PERFIL_PUBLICO"},"POST");
    ARQSELECT4.notify(result.mensagem||"Não foi possível enviar a solicitação.");
  }

  function productCard(item){return `<article class="card product"><div class="thumb">${safeUrl(item.foto)?`<img src="${esc(item.foto)}" alt="${esc(item.nome||"Produto")}" loading="lazy">`:'<span class="muted">Imagem não cadastrada</span>'}</div><span class="badge">${esc(item.categoria||"Produto")}</span><h3>${esc(item.nome||"Produto")}</h3><p class="muted">${esc([item.marca,item.regiao].filter(Boolean).join(" · "))}</p><div class="price">${esc(item.preco||"Consultar")}</div><a class="btn gold" href="produto.html?id=${encodeURIComponent(item.id)}">Ver produto</a></article>`;}

  async function load(){
    if(!id||!["ARQUITETO","FORNECEDOR"].includes(type)){root.innerHTML='<section class="arq4-card empty"><b>Perfil inválido.</b><span>Volte ao ranking ou ao marketplace para escolher um profissional.</span><a class="btn gold" href="ranking.html">Ver ranking</a></section>';return;}
    const result=await ARQSELECT4.api("arq4_public_profile",{tipo:type,id});
    if(!result.sucesso||!result.perfil){root.innerHTML=`<section class="arq4-card empty"><b>Perfil indisponível.</b><span>${esc(result.mensagem||"Não foi possível carregar este perfil.")}</span><a class="btn gold" href="${type==="FORNECEDOR"?"explorar.html":"ranking.html"}">Continuar explorando</a></section>`;return;}
    const profile=result.perfil,logo=safeUrl(profile.logo),cover=safeUrl(profile.capa);
    document.title=`${profile.nome} | ARQSELECT`;
    root.innerHTML=`
      <section class="hero arq4-profile-hero"${cover?` style="background-image:linear-gradient(90deg,rgba(7,8,7,.94),rgba(7,8,7,.64)),url('${esc(cover)}')!important"`:""}>
        <div class="arq4-profile-main">${logo?`<img class="arq4-profile-logo" src="${esc(logo)}" alt="Marca de ${esc(profile.nome)}">`:`<div class="arq4-profile-logo arq4-profile-initial">${esc(profile.nome.slice(0,1))}</div>`}<div><div class="ey">${type==="FORNECEDOR"?"FORNECEDOR":"ARQUITETO"} ARQSELECT</div><h1>${esc(profile.nome)}</h1><p class="muted">${esc(profile.regiao||"Atuação informada no cadastro")}</p><div class="arq4-actions">${profile.verificado?'<span class="badge green">✓ Cadastro verificado</span>':'<span class="badge">Cadastro em validação</span>'}${(profile.selos||[]).filter(item=>item!=="Cadastro verificado").map(item=>`<span class="badge">${esc(item)}</span>`).join("")}</div></div></div>
        <div class="arq4-actions"><button class="btn gold" id="connectProfile">Solicitar conexão</button><button class="btn light" id="shareProfile">Compartilhar</button>${safeUrl(profile.site)?`<a class="btn light" href="${esc(profile.site)}" target="_blank" rel="noopener">Visitar site</a>`:""}</div>
      </section>
      <section class="arq4-grid arq4-profile-stats"><article class="arq4-card"><div class="stat-label">Avaliação</div><div class="arq4-stat-value">${profile.totalAvaliacoes?stars(profile.nota):"—"}</div><span class="muted">${Number(profile.totalAvaliacoes||0)} avaliação(ões) publicada(s)</span></article><article class="arq4-card"><div class="stat-label">Projetos concluídos</div><div class="arq4-stat-value">${Number(profile.projetosConcluidos||0)}</div><span class="muted">Histórico registrado na plataforma</span></article><article class="arq4-card"><div class="stat-label">Participação</div><div class="arq4-stat-value">${Number(profile.taxaResposta||0)}%</div><span class="muted">Resposta e conclusão no histórico</span></article></section>
      <section class="arq4-grid two"><article class="arq4-card"><div class="ey">SOBRE</div><h2>${type==="FORNECEDOR"?"Empresa e atuação":"Perfil profissional"}</h2><p class="muted">${esc(profile.descricao||"Este perfil ainda não publicou uma apresentação detalhada.")}</p>${profile.especialidades?`<p><b>Especialidades</b><br><span class="muted">${esc(profile.especialidades)}</span></p>`:""}${profile.responsavel?`<p><b>Responsável</b><br><span class="muted">${esc(profile.responsavel)}</span></p>`:""}<div class="arq4-actions">${profile.email?`<a class="btn light" href="mailto:${esc(profile.email)}">E-mail público</a>`:""}${profile.telefone?`<a class="btn light" href="tel:${esc(profile.telefone)}">Telefone público</a>`:""}</div></article><article class="arq4-card"><div class="ey">REPUTAÇÃO</div><h2>Avaliações moderadas</h2><div class="arq4-list">${(result.avaliacoes||[]).length?(result.avaliacoes||[]).map(item=>`<div class="arq4-list-item"><span class="arq4-list-icon">★</span><span><b>${stars(item.nota)}</b><br><span class="muted">${esc(item.comentario||"Avaliação sem comentário público")}</span></span></div>`).join(""):'<div class="empty"><b>Nenhuma avaliação publicada.</b><span>As avaliações aparecem após moderação.</span></div>'}</div></article></section>
      ${type==="FORNECEDOR"?`<section class="arq4-section"><div class="arq4-section-head"><div><div class="ey">CATÁLOGO</div><h2>Produtos aprovados</h2></div><a class="btn light" href="explorar.html?fornecedor=${encodeURIComponent(id)}">Ver no marketplace</a></div><div class="grid">${(result.produtos||[]).length?(result.produtos||[]).map(productCard).join(""):'<div class="arq4-card empty" style="grid-column:1/-1"><b>Nenhum produto público.</b><span>Produtos aparecem aqui após aprovação da ARQSELECT.</span></div>'}</div></section>`:""}`;
    document.getElementById("connectProfile").onclick=connect;
    document.getElementById("shareProfile").onclick=()=>ARQSELECT4.shareCurrent(profile.nome);
  }
  load();
})();
