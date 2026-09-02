(function () {
  "use strict";
  if (typeof renderDashboard !== "function" || typeof api !== "function") return;
  let executive = null;
  const baseRenderDashboard4 = renderDashboard;
  const money4 = value => Number(value || 0).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
  const safe4 = value => typeof esc === "function" ? esc(value) : String(value ?? "");

  function attentionCard(level, label, list, destination) {
    return `<article class="arq4-attention-card" data-level="${level}"><div class="stat-label">${safe4(label)}</div><div class="arq4-attention-count">${list.length}</div><div class="muted">${list.length ? safe4(list[0].titulo) : "Nenhuma pendência"}</div>${list.length ? `<button class="btn light" style="margin-top:10px" onclick="nav('${destination}')">Abrir central</button>` : ""}</article>`;
  }

  function renderExecutive4() {
    if (!executive || currentPage !== "dashboard") return;
    const content = $("content");
    if (!content || content.querySelector("#arq4-executive")) return;
    const attention = executive.atencao || {}, funnel = executive.funil || {}, series = executive.serie || [], indicators = executive.indicadores || {};
    const maxProjects = Math.max(1, ...series.map(item => Number(item.projetos || 0)));
    const html = `<section id="arq4-executive">
      <div class="section-head"><div><div class="ey">CENTRO DE COMANDO</div><h2>Central de atenção</h2><div class="muted">Prioridades calculadas com os dados atuais da operação.</div></div><div class="actions"><button class="btn gold" onclick="nav('enviar-projeto')">+ Distribuir projeto</button><button class="btn light" onclick="nav('chat')">+ Mensagem</button></div></div>
      <div class="arq4-attention">
        ${attentionCard("urgent","Projetos parados",attention.urgente||[],"projetos")}
        ${attentionCard("warning","Propostas aguardando",attention.pendentes||[],"propostas")}
        ${attentionCard("info","Cadastros pendentes",attention.cadastros||[],"usuarios")}
        ${attentionCard("success","Tickets em aberto",attention.suporte||[],"suporte")}
      </div>
      <div class="grid" style="margin-bottom:16px">
        <div class="card"><div class="stat-label">GMV fechado</div><div class="stat-value">${money4(indicators.gmv)}</div><div class="stat-sub">Volume de negócios registrados</div></div>
        <div class="card"><div class="stat-label">Comissão gerada</div><div class="stat-value">${money4(indicators.comissao)}</div><div class="stat-sub">Somente negócios fechados</div></div>
        <div class="card"><div class="stat-label">Ticket médio</div><div class="stat-value">${money4(indicators.ticketMedio)}</div><div class="stat-sub">Negócios fechados</div></div>
        <div class="card"><div class="stat-label">Satisfação</div><div class="stat-value">${Number(indicators.notaMedia||0).toFixed(1)} ★</div><div class="stat-sub">${Number(indicators.avaliacoes||0)} avaliação(ões) publicada(s)</div></div>
      </div>
      <div class="two">
        <div class="card"><div class="section-head"><div><h2>Funil comercial</h2><div class="muted">Conversão por etapa registrada.</div></div></div><div class="arq4-funnel">${[["Projetos",funnel.projetos],["Direcionados",funnel.direcionados],["Propostas",funnel.propostas],["Negociação",funnel.negociacoes],["Fechados",funnel.fechados]].map(item=>`<div class="arq4-funnel-step"><span>${item[0]}</span><strong>${Number(item[1]||0)}</strong></div>`).join("")}</div></div>
        <div class="card"><div class="section-head"><div><h2>Projetos por mês</h2><div class="muted">Últimos seis meses.</div></div></div><div class="arq4-bars">${series.map(item=>`<div class="arq4-bar-col"><div class="arq4-bar-track" title="${Number(item.projetos||0)} projeto(s)"><div class="arq4-bar" style="height:${Math.max(3,Number(item.projetos||0)/maxProjects*100)}%"></div></div><span>${safe4(item.rotulo)}</span></div>`).join("")}</div></div>
      </div>
    </section>`;
    content.insertAdjacentHTML("afterbegin", html);
  }

  renderDashboard = function renderDashboardARQ4() {
    baseRenderDashboard4();
    renderExecutive4();
  };

  async function loadExecutive4() {
    if (!token) return;
    try {
      executive = await api("admin_executivo_arq4");
      if (executive?.sucesso && currentPage === "dashboard") renderDashboard();
    } catch (_) {}
  }

  const setupButton = $("setup");
  if (setupButton) setupButton.onclick = async () => {
    try {
      setupButton.disabled = true;
      setupButton.textContent = "Sincronizando…";
      const result = await api("setup_arqselect_4");
      toast(result.mensagem || "Base ARQSELECT 4.0 sincronizada.");
      await loadDashboard();
      await loadExecutive4();
      if (currentPage !== "dashboard") await loadPageData(currentPage);
    } catch (error) { toast(error.message || "Não foi possível sincronizar a base."); }
    finally { setupButton.disabled = false; setupButton.textContent = "Sincronizar base 4.0"; }
  };

  loadExecutive4();
  setInterval(loadExecutive4, 60000);
})();
