(function () {
  "use strict";

  const carregarModuloOriginal = loadPageData;

  loadPageData = async function (page) {
    if (page !== "configuracoes") return carregarModuloOriginal(page);
    const content = document.getElementById("content");
    if (content) content.innerHTML = '<div class="card loader">Carregando configurações públicas…</div>';
    try {
      const result = await api("admin_home_config_arq4");
      if (!result || result.sucesso === false) throw new Error(result?.mensagem || "Não foi possível carregar as configurações.");
      pageData.configuracoes = result;
      renderConfiguracoes();
    } catch (error) {
      if (content) content.innerHTML = `<div class="card empty"><b>Falha ao carregar as configurações.</b><div style="margin-top:8px">${esc(error?.message || "Erro desconhecido")}</div><button class="btn light" style="margin-top:14px" onclick="loadPageData('configuracoes')">Tentar novamente</button></div>`;
      toast(error?.message || "Falha ao carregar configurações.");
    }
  };

  window.renderConfiguracoes = function () {
    const config = pageData.configuracoes?.home || {mostrarNumeros:false};
    const content = document.getElementById("content");
    if (!content) return;
    content.innerHTML = `
      <div class="section-head">
        <div><h2>Experiência da página inicial</h2><div class="muted">Você decide o que será exibido publicamente. A alteração não apaga nenhum dado do CRM.</div></div>
        <a class="btn light" href="index.html" target="_blank" rel="noopener">Visualizar página inicial</a>
      </div>
      <div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr)">
        <section class="card">
          <div class="settings-switch">
            <div><b>Exibir números públicos</b><div class="muted" style="margin-top:6px">Controla arquitetos, fornecedores, projetos, cotações e volume de negócios na página inicial.</div></div>
            <input id="publicNumbersToggle" type="checkbox" aria-label="Exibir números públicos" ${config.mostrarNumeros ? "checked" : ""}>
          </div>
          <div class="actions" style="margin-top:16px"><button id="saveHomeSettings" class="btn gold" type="button" onclick="salvarConfiguracaoHomeARQ4()">Salvar visibilidade</button></div>
        </section>
        <aside class="settings-preview">
          <span class="badge ${config.mostrarNumeros ? "green" : "gold"}">${config.mostrarNumeros ? "VISÍVEL" : "OCULTO"}</span>
          <h3 style="margin-top:14px">Números da operação</h3>
          <p class="muted" style="margin-top:8px">${config.mostrarNumeros ? "Os indicadores reais ficam disponíveis para visitantes." : "Nenhum indicador numérico é mostrado na página inicial."}</p>
        </aside>
      </div>`;
  };

  window.salvarConfiguracaoHomeARQ4 = async function () {
    const toggle = document.getElementById("publicNumbersToggle");
    const button = document.getElementById("saveHomeSettings");
    if (!toggle || !button) return;
    button.disabled = true;
    button.textContent = "Salvando…";
    try {
      const result = await api("admin_home_config_salvar_arq4", {mostrarNumeros:toggle.checked ? "SIM" : "NAO"});
      if (!result || result.sucesso === false) throw new Error(result?.mensagem || "Não foi possível salvar.");
      pageData.configuracoes = result;
      renderConfiguracoes();
      toast(result.mensagem || "Visibilidade atualizada.");
    } catch (error) {
      button.disabled = false;
      button.textContent = "Salvar visibilidade";
      toast(error?.message || "Falha ao salvar a visibilidade.");
    }
  };

  verificarConexaoLogin(false);
})();
