(function () {
  const apiUrl = window.API || (typeof API !== "undefined" ? API : "");
  const portalToken = typeof token !== "undefined" ? token : localStorage.getItem("ARQSELECT_PORTAL_TOKEN");
  const byId = typeof $ === "function" ? $ : id => document.getElementById(id);

  async function request(params) {
    const url = new URL(apiUrl);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value == null ? "" : value));
    const response = await fetch(url, { cache: "no-store" });
    return response.json();
  }

  async function opportunityForProject(projectId) {
    const response = await request({ acao: "portal_oportunidades", token: portalToken });
    return (response.oportunidades || []).find(item => String(item["ID PROJETO"] || "") === String(projectId || "")) || null;
  }

  window.abrir = async function abrirProjetoProtegido(id) {
    const data = await request({ acao: "portal_projeto_detalhe", token: portalToken, id });
    if (!data.sucesso) {
      alert(data.mensagem || "Não foi possível abrir o projeto.");
      return;
    }
    const project = data.projeto;
    if (project.acessoLimitado) {
      const opportunity = await opportunityForProject(project.id);
      const termsUrl = opportunity ? `termos-arqselect.html?oportunidadeId=${encodeURIComponent(opportunity["ID OPORTUNIDADE"])}` : "#";
      byId("conteudo").innerHTML = `
        <div class="ey">OPORTUNIDADE PROTEGIDA</div>
        <h2>${esc(project.projeto)}</h2>
        <div class="notice"><b>${esc(project.mensagemAcesso)}</b></div>
        <div class="grid">
          <div class="panel"><h3>Resumo autorizado</h3><p class="muted">${esc(project.descricao || "")}</p><p><b>Local:</b> ${esc(project.cidade || "—")} / ${esc(project.estado || "—")}<br><b>Área:</b> ${esc(project.area || "—")}<br><b>Prazo:</b> ${esc(project.prazo || "—")}</p></div>
          <div class="panel"><h3>Próximo passo</h3><p class="muted">A ARQSELECT protege os dados do arquiteto e libera o conteúdo completo após o aceite comercial e a aprovação do ADMIN.</p>${opportunity ? `<a class="btn gold" href="${termsUrl}">Ler e aceitar termos comerciais</a>` : `<button class="btn gold" onclick="solicitarConexao()">Solicitar conexão com a ARQSELECT</button>`}</div>
        </div>`;
      openM();
      return;
    }

    const links = (project.arquivos || []).map(url => `<a href="${esc(url)}" target="_blank" rel="noopener">📎 Abrir arquivo do projeto</a>`).join("");
    byId("conteudo").innerHTML = `
      <div class="ey">OPORTUNIDADE ARQSELECT</div><h2>${esc(project.projeto)}</h2>
      <div class="notice"><b>Arquiteto:</b> ${esc(project.nome)} · ${esc(project.escritorio)}<br><b>Local:</b> ${esc(project.cidade)} / ${esc(project.estado)} · <b>Área:</b> ${esc(project.area || "—")}<br><b>Prazo:</b> ${esc(project.prazo || "—")}</div>
      <div class="grid"><div class="panel"><h3>Briefing</h3><p class="muted">${esc(project.descricao || "")}</p><div class="links">${links || '<span class="muted">Sem anexos.</span>'}</div></div>
      <div class="panel"><h3>Enviar resposta</h3><form id="resp"><input type="hidden" name="id" value="${esc(project.id)}"><div class="field"><label>Orçamento / resposta comercial</label><textarea name="resposta" required placeholder="Informe valor, prazo, condições, validade e garantia."></textarea></div><div class="field files"><label>Anexar proposta</label><input id="respFiles" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"><div class="muted" style="font-size:12px">Até 5 arquivos de até 8 MB.</div></div><button class="btn gold" type="submit">Enviar resposta à ARQSELECT</button><span id="rmsg" class="muted"></span></form></div></div>`;
    openM();
    byId("resp").addEventListener("submit", enviarResposta);
  };

  window.loadComercial = async function carregarStatusComercial() {
    try {
      const data = await request({ acao: "portal_comercial_status", token: portalToken });
      const status = data.status || "NÃO CONECTADO";
      byId("comercialStatus").textContent = `Status: ${status}`;
      if (status.toUpperCase() === "CONECTADO") {
        byId("comercialAction").innerHTML = '<span class="pill">✓ Fornecedor conectado e aprovado pela ARQSELECT</span>';
        return;
      }
      const opportunityResponse = await request({ acao: "portal_oportunidades", token: portalToken });
      const opportunity = (opportunityResponse.oportunidades || [])[0];
      if (opportunity) {
        byId("comercialAction").innerHTML = `<a class="btn gold" href="termos-arqselect.html?oportunidadeId=${encodeURIComponent(opportunity["ID OPORTUNIDADE"])}">Revisar termos e concluir conexão</a>`;
      } else {
        byId("comercialAction").innerHTML = '<button class="btn gold" onclick="solicitarConexao()">Solicitar conexão com a ARQSELECT</button>';
      }
    } catch (error) {
      byId("comercialStatus").textContent = "Não foi possível consultar o status comercial.";
    }
  };

  window.solicitarConexao = async function solicitarConexaoSegura() {
    const data = await request({ acao: "portal_conexao_arqselect", token: portalToken, observacoes: "Solicitação feita pelo painel do fornecedor." });
    byId("comercialStatus").textContent = data.mensagem || data.status || "Solicitação enviada.";
    await window.loadComercial();
  };

  window.loadComercial();
})();
