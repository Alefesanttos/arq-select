(function () {
  if (!document.querySelector('link[href="arqselect-4.css"]')) {
    const style=document.createElement("link");style.rel="stylesheet";style.href="arqselect-4.css";document.head.appendChild(style);
  }
  if (!document.querySelector('script[src="arqselect-4.js"]')) {
    const shared=document.createElement("script");shared.src="arqselect-4.js";document.body.appendChild(shared);
  }
  if (!document.querySelector('script[src="admin-4.js"]')) {
    const executive=document.createElement("script");executive.src="admin-4.js";document.body.appendChild(executive);
  }
  const baseLoadPageData = loadPageData;
  const baseRenderPage = renderPage;
  const baseShowUser = showUser;
  const baseRenderDashboard = renderDashboard;

  function money(value) {
    return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function records(page) {
    const value = pageData[page] || {};
    return Array.isArray(value.dados) ? value.dados : [];
  }

  async function loadExtended(page) {
    if (page === "arquitetos") {
      const response = await api("admin_v4_usuarios", { tipo: "ARQUITETO", busca: "" });
      pageData[page] = response;
      renderPage(page);
      return;
    }
    if (["avaliacoes", "suporte", "conexoes", "comercial"].includes(page)) {
      pageData[page] = await api("admin_listar_arqselect3", { modulo: page });
      renderPage(page);
      return;
    }
    if (page === "ranking") {
      const result = await Promise.all([
        api("portal_rankings", { tipo: "FORNECEDOR" }),
        api("portal_rankings", { tipo: "ARQUITETO" })
      ]);
      pageData[page] = { fornecedores: result[0].ranking || [], arquitetos: result[1].ranking || [], metodologia: result[0].metodologia || "" };
      renderPage(page);
      return;
    }
    if (page === "relatorios") {
      pageData[page] = await api("admin_relatorios");
      renderPage(page);
      return;
    }
    if (page === "configuracoes") {
      pageData[page] = await api("admin_configuracoes");
      renderPage(page);
      return;
    }
    if (page === "seguranca") {
      const result = await Promise.all([
        api("admin_v4_diagnostico"),
        api("admin_v4_listar", { modulo: "historico" })
      ]);
      pageData[page] = { diagnostico: result[0], dados: result[1].dados || [] };
      renderPage(page);
      return;
    }
    return baseLoadPageData(page);
  }

  function renderUsers(page) {
    const list = pageData[page]?.usuarios || usuarios || [];
    const filtered = list.filter(item => page === "fornecedores" ? item.TIPO === "FORNECEDOR" : page === "arquitetos" ? item.TIPO === "ARQUITETO" : true);
    $("content").innerHTML = `<div class="section-head"><div class="toolbar"><input id="searchUser" placeholder="Buscar nome, empresa, e-mail, CNPJ/CAU..."></div><div class="muted">${filtered.length} registro(s)</div></div><div id="userGrid" class="user-grid">${renderUserCards(filtered)}</div>`;
    $("searchUser").oninput = event => {
      const term = event.target.value.toLowerCase();
      $("userGrid").innerHTML = renderUserCards(filtered.filter(item => JSON.stringify(item).toLowerCase().includes(term)));
    };
  }

  function rankingRows(list) {
    return list.length ? list.map(item => `<tr><td><b>${item.posicao}º</b></td><td>${esc(item.nome)}</td><td>${Number(item.pontuacao || 0).toFixed(1)}</td><td>${Number(item.nota || 0).toFixed(1)} ★</td><td>${item.projetosConcluidos || 0}</td><td>${item.taxaResposta || 0}%</td><td>${(item.selos || []).map(value => badge(value)).join(" ")}</td></tr>`).join("") : '<tr><td colspan="7">Histórico insuficiente.</td></tr>';
  }

  function renderRanking() {
    const data = pageData.ranking || {};
    $("content").innerHTML = `<div class="card"><p class="muted">${esc(data.metodologia || "")}</p></div><div class="section"><h2>Fornecedores</h2><div class="card table-wrap"><table><thead><tr><th>#</th><th>Empresa</th><th>Pontos</th><th>Nota</th><th>Concluídos</th><th>Resposta</th><th>Selos</th></tr></thead><tbody>${rankingRows(data.fornecedores || [])}</tbody></table></div></div><div class="section"><h2>Arquitetos</h2><div class="card table-wrap"><table><thead><tr><th>#</th><th>Profissional</th><th>Pontos</th><th>Nota</th><th>Concluídos</th><th>Participação</th><th>Selos</th></tr></thead><tbody>${rankingRows(data.arquitetos || [])}</tbody></table></div></div>`;
  }

  function renderReviews() {
    const rows = records("avaliacoes");
    $("content").innerHTML = `<div class="section-head"><div><h2>Moderação de avaliações</h2><div class="muted">Notas válidas alimentam reputação e ranking.</div></div></div><div class="card table-wrap"><table><thead><tr><th>ID</th><th>Projeto</th><th>Avaliador</th><th>Avaliado</th><th>Nota</th><th>Comentário</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows.map(item => `<tr><td>${esc(item.ID)}</td><td>${esc(item["PROJETO ID"])}</td><td>${esc(item["AVALIADOR ID"])}</td><td>${esc(item["AVALIADO ID"])}</td><td>${Number(item["NOTA GERAL"] || 0).toFixed(1)} ★</td><td>${esc(item.COMENTARIO || "")}</td><td>${badge(item.STATUS)}</td><td><button class="btn light" onclick="moderateReview3('${esc(item.ID)}','PUBLICADA')">Publicar</button> <button class="btn danger" onclick="moderateReview3('${esc(item.ID)}','OCULTA')">Ocultar</button></td></tr>`).join("") || '<tr><td colspan="8">Nenhuma avaliação.</td></tr>'}</tbody></table></div>`;
  }

  function renderSupport() {
    const rows = records("suporte");
    $("content").innerHTML = `<div class="section-head"><div><h2>Tickets de suporte</h2><div class="muted">Atendimento com status e histórico.</div></div></div><div class="card table-wrap"><table><thead><tr><th>ID</th><th>Usuário</th><th>Categoria</th><th>Assunto</th><th>Prioridade</th><th>Status</th><th>Ação</th></tr></thead><tbody>${rows.map(item => `<tr><td>${esc(item.ID)}</td><td>${esc(item["USUARIO ID"])}</td><td>${esc(item.CATEGORIA)}</td><td><b>${esc(item.ASSUNTO)}</b><br><span class="muted">${esc(item.DESCRICAO)}</span></td><td>${badge(item.PRIORIDADE)}</td><td>${badge(item.STATUS)}</td><td><button class="btn gold" onclick="answerTicket3('${esc(item.ID)}')">Atender</button></td></tr>`).join("") || '<tr><td colspan="7">Nenhum ticket.</td></tr>'}</tbody></table></div>`;
  }

  function renderConnections() {
    const rows = records("conexoes");
    $("content").innerHTML = `<div class="section-head"><div><h2>Conexões profissionais</h2><div class="muted">A ARQSELECT controla quem pode conversar e acessar oportunidades.</div></div></div><div class="card table-wrap"><table><thead><tr><th>ID</th><th>Participante A</th><th>Participante B</th><th>Contexto</th><th>Projeto</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows.map(item => `<tr><td>${esc(item.ID)}</td><td>${esc(item["USUARIO A ID"])}</td><td>${esc(item["USUARIO B ID"])}</td><td>${esc(item.CONTEXTO)}</td><td>${esc(item["PROJETO ID"])}</td><td>${badge(item.STATUS)}</td><td><button class="btn gold" onclick="updateConnection3('${esc(item.ID)}','APROVADA')">Aprovar</button> <button class="btn danger" onclick="updateConnection3('${esc(item.ID)}','RECUSADA')">Recusar</button></td></tr>`).join("") || '<tr><td colspan="7">Nenhuma conexão.</td></tr>'}</tbody></table></div>`;
  }

  function renderCommercial() {
    const rows = records("comercial");
    $("content").innerHTML = `<div class="section-head"><div><h2>Aprovação comercial de fornecedores</h2><div class="muted">Somente fornecedores conectados acessam dados completos e enviam propostas.</div></div></div><div class="card table-wrap"><table><thead><tr><th>ID</th><th>Fornecedor</th><th>E-mail</th><th>Termo</th><th>Oportunidade</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows.map(item => `<tr><td>${esc(item.ID)}</td><td>${esc(item["FORNECEDOR ID"])}</td><td>${esc(item["FORNECEDOR E-MAIL"])}</td><td>${esc(item["TERMO ID"] || "Pendente")}</td><td>${esc(item["OPORTUNIDADE ID"])}</td><td>${badge(item.STATUS)}</td><td><button class="btn gold" onclick="updateCommercial3('${esc(item.ID)}','CONECTADO')">Conectar</button> <button class="btn danger" onclick="updateCommercial3('${esc(item.ID)}','RECUSADO')">Recusar</button></td></tr>`).join("") || '<tr><td colspan="7">Nenhuma solicitação comercial.</td></tr>'}</tbody></table></div>`;
  }

  function renderReports() {
    const data = pageData.relatorios || {}, summary = data.resumo || {};
    const metric = [["Projetos", summary.projetos], ["Produtos", summary.produtos], ["Propostas", summary.propostas], ["Negócios", summary.negocios], ["Volume", money(summary.volume)], ["Comissão", money(summary.comissao)], ["Ticket médio", money(summary.ticketMedio)], ["Conversão", `${Number(summary.conversao || 0).toFixed(1)}%`]];
    const table = (title, rows) => `<div class="section"><h2>${title}</h2><div class="card table-wrap"><table><thead><tr><th>Grupo</th><th>Total</th></tr></thead><tbody>${(rows || []).map(item => `<tr><td>${esc(item.nome)}</td><td>${item.total}</td></tr>`).join("") || '<tr><td colspan="2">Sem dados.</td></tr>'}</tbody></table></div></div>`;
    $("content").innerHTML = `<div class="grid">${metric.map(item => `<div class="card"><div class="stat-label">${item[0]}</div><div class="stat-value">${item[1] ?? 0}</div></div>`).join("")}</div>${table("Categorias com maior demanda", data.categorias)}${table("Distribuição regional", data.regioes)}${table("Status dos projetos", data.statusProjetos)}`;
  }

  function renderSettings() {
    const rows = pageData.configuracoes?.configuracoes || [];
    $("content").innerHTML = `<div class="section-head"><div><h2>Configurações operacionais</h2><div class="muted">Controles centrais sem necessidade de editar código.</div></div></div><div class="card">${rows.map((item, index) => `<div class="kv" style="margin-bottom:10px"><b>${esc(item.CHAVE)}</b><div class="two"><input data-setting="value" data-index="${index}" value="${esc(item.VALOR)}"><input data-setting="description" data-index="${index}" value="${esc(item.DESCRICAO)}"></div><button class="btn gold" style="margin-top:8px" onclick="saveSetting3(${index},'${esc(item.CHAVE)}')">Salvar</button></div>`).join("")}</div>`;
  }

  function renderSecurity() {
    const data = pageData.seguranca || {}, diagnostic = data.diagnostico || {}, logs = (data.dados || []).slice(0, 100);
    $("content").innerHTML = `<div class="grid"><div class="card"><div class="stat-label">Servidor</div><div class="stat-value">Online</div></div><div class="card"><div class="stat-label">Planilha</div><div style="margin-top:8px;font-weight:850">${esc(diagnostic.planilhaNome || "—")}</div></div><div class="card"><div class="stat-label">Usuários indexados</div><div class="stat-value">${diagnostic.usuarios?.total || 0}</div></div><div class="card"><div class="stat-label">Projetos</div><div class="stat-value">${diagnostic.projetos || 0}</div></div></div><div class="section"><h2>Eventos recentes de auditoria</h2><div class="card table-wrap"><table><thead><tr><th>Data</th><th>Usuário</th><th>Módulo</th><th>Ação</th><th>Registro</th><th>Descrição</th></tr></thead><tbody>${logs.map(item => `<tr><td>${esc(item.DATA)}</td><td>${esc(item.USUARIO || item["USUARIO ID"])}</td><td>${esc(item.MODULO || item.TIPO)}</td><td>${esc(item.ACAO)}</td><td>${esc(item["REGISTRO ID"])}</td><td>${esc(item.DESCRICAO || "")}</td></tr>`).join("") || '<tr><td colspan="6">Nenhum evento.</td></tr>'}</tbody></table></div></div>`;
  }

  window.renderAdmin3Page = function renderAdmin3Page(page) {
    if (page === "avaliacoes") return renderReviews();
    if (page === "suporte") return renderSupport();
    if (page === "conexoes") return renderConnections();
    if (page === "comercial") return renderCommercial();
    if (page === "ranking") return renderRanking();
    if (page === "relatorios") return renderReports();
    if (page === "configuracoes") return renderSettings();
    if (page === "seguranca") return renderSecurity();
  };

  window.moderateReview3 = async (id, status) => { await api("admin_avaliacao_moderar", { id, status }); toast("Avaliação atualizada."); loadExtended("avaliacoes"); };
  window.updateConnection3 = async (id, status) => { await api("admin_conexao_status", { id, status }); toast("Conexão atualizada."); loadExtended("conexoes"); };
  window.updateCommercial3 = async (id, status) => { await api("admin_comercial_status", { id, status }); toast("Status comercial atualizado."); loadExtended("comercial"); };
  window.answerTicket3 = id => { const response = prompt("Resposta ao usuário:", ""); if (response === null) return; const status = prompt("Status: ABERTO, EM ATENDIMENTO, AGUARDANDO USUÁRIO, RESOLVIDO ou ENCERRADO", "EM ATENDIMENTO"); if (!status) return; api("admin_ticket_status", { id, status, resposta: response }).then(() => { toast("Ticket atualizado."); loadExtended("suporte"); }).catch(error => toast(error.message)); };
  window.saveSetting3 = async (index, key) => { const value = document.querySelector(`[data-setting="value"][data-index="${index}"]`)?.value || ""; const description = document.querySelector(`[data-setting="description"][data-index="${index}"]`)?.value || ""; await api("admin_configuracao_salvar", { chave: key, valor: value, descricao: description }); toast("Configuração salva."); };
  window.updateUser3 = async (id, type) => {
    const status = $("userStatus3").value, approval = $("userApproval3").value, button = $("saveUserControl3"), feedback = $("userControlFeedback3");
    try {
      if (button) { button.disabled = true; button.textContent = "Salvando…"; }
      if (feedback) { feedback.className = "muted"; feedback.textContent = "Gravando na base e sincronizando o acesso…"; }
      const result = await apiMutation("admin_usuario_status", { id, tipo: type, status, aprovacao: approval });
      const pages = ["usuarios", "arquitetos", "fornecedores"];
      pages.forEach(page => {
        const list = pageData[page]?.usuarios;
        const item = Array.isArray(list) ? list.find(user => String(user.ID) === String(id) && String(user.TIPO) === String(type)) : null;
        if (item) { item.STATUS = result.status; item["STATUS APROVACAO"] = result.aprovacao; }
      });
      if (feedback) { feedback.className = "msg success"; feedback.textContent = `${result.status} · ${result.aprovacao} — alteração confirmada.`; }
      toast(result.mensagem || "Controle atualizado.");
      await loadExtended(currentPage);
      setTimeout(() => $("modal")?.classList.remove("open"), 450);
    } catch (error) {
      if (feedback) { feedback.className = "msg error"; feedback.textContent = error.message || "Não foi possível salvar o controle."; }
      toast(error.message || "Não foi possível salvar o controle.");
    } finally {
      if (button) { button.disabled = false; button.textContent = "Salvar controle"; }
    }
  };

  showUser = function showUserExtended(user) {
    baseShowUser(user);
    const body = $("modalBody");
    const controls = document.createElement("div");
    controls.className = "card";
    controls.style.marginTop = "14px";
    controls.innerHTML = `<div class="section-head"><div><div class="ey">ACESSO E MODERAÇÃO</div><h3>Controle administrativo</h3></div><div>${badge(user.STATUS)} ${badge(user["STATUS APROVACAO"] || "PENDENTE")}</div></div><div class="two"><label>Status de acesso<select id="userStatus3"><option ${String(user.STATUS).toUpperCase() === "ATIVO" ? "selected" : ""}>ATIVO</option><option ${String(user.STATUS).toUpperCase() === "INATIVO" ? "selected" : ""}>INATIVO</option><option ${String(user.STATUS).toUpperCase() === "BLOQUEADO" ? "selected" : ""}>BLOQUEADO</option></select></label><label>Status de aprovação<select id="userApproval3"><option ${String(user["STATUS APROVACAO"]).toUpperCase() === "PENDENTE" ? "selected" : ""}>PENDENTE</option><option ${String(user["STATUS APROVACAO"]).toUpperCase() === "APROVADO" ? "selected" : ""}>APROVADO</option><option ${String(user["STATUS APROVACAO"]).toUpperCase() === "RECUSADO" ? "selected" : ""}>RECUSADO</option></select></label></div><p class="muted" style="margin:12px 0 0">O status controla o login. A aprovação controla a visibilidade e a validação do cadastro.</p><div id="userControlFeedback3" class="muted" role="status" aria-live="polite" style="margin-top:10px"></div><button id="saveUserControl3" class="btn gold" style="margin-top:12px" onclick="updateUser3('${esc(user.ID)}','${esc(user.TIPO)}')">Salvar controle</button>`;
    body.appendChild(controls);
  };

  loadPageData = loadExtended;
  renderPage = function renderPageExtended(page) {
    if (["avaliacoes", "suporte", "conexoes", "comercial", "ranking", "relatorios", "configuracoes", "seguranca"].includes(page)) return renderAdmin3Page(page);
    if (["usuarios", "fornecedores", "arquitetos"].includes(page)) return renderUsers(page);
    const result = baseRenderPage(page);
    if (page === "negocios") {
      setTimeout(() => {
        document.querySelectorAll("[data-com]").forEach(input => { input.disabled = true; input.title = "Regra fixa ARQSELECT"; });
        const saveButton = document.querySelector('[onclick="salvarComissoes()"]');
        if (saveButton) { saveButton.disabled = true; saveButton.textContent = "Faixas fixas ARQSELECT"; }
      }, 0);
    }
    return result;
  };

  renderDashboard = function renderDashboardExtended() {
    baseRenderDashboard();
    const data = dashboard || {};
    const extra = [
      ["Negócios fechados", data.negociosFechados || 0, "Resultados registrados"],
      ["Volume movimentado", money(data.volumeMovimentado), "Negócios ARQSELECT"],
      ["Comissão gerada", money(data.comissaoGerada), "Prevista e confirmada"],
      ["Avaliações", data.avaliacoes || 0, "Reputação"],
      ["Tickets abertos", data.ticketsAbertos || 0, "Suporte"],
      ["Aprovações comerciais", data.aprovacoesComerciais || 0, "Aguardando ADMIN"]
    ];
    $("content").insertAdjacentHTML("afterbegin", `<div class="grid" style="margin-bottom:14px">${extra.map(item => `<div class="card"><div class="stat-label">${item[0]}</div><div class="stat-value">${item[1]}</div><div class="stat-sub">${item[2]}</div></div>`).join("")}</div>`);
  };
})();
