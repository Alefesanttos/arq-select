(function () {
  "use strict";

  if (window.ARQSELECT4?.initialized) return;

  const API_URL = (localStorage.getItem("ARQSELECT_API_URL") || "https://script.google.com/macros/s/AKfycbz_jLzNa87U_himraaCczzqGpQdq63AyIVogQ9-YGnqXuQYl3OSJfV4E7xYfPdnv8-d/exec").replace(/\/$/, "");
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const portalToken = localStorage.getItem("ARQSELECT_PORTAL_TOKEN") || "";
  const adminToken = localStorage.getItem("ARQSELECT_ADMIN_TOKEN") || "";
  const token = adminToken || portalToken;
  const role = adminToken ? "ADMIN" : (localStorage.getItem("ARQSELECT_PORTAL_TIPO") || "PUBLICO").toUpperCase();
  let installEvent = null;
  let commandItems = [];
  let activeIndex = 0;
  let searchTimer = null;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const icon = name => {
    const paths = {
      search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
      moon: '<path d="M20 15.2A8.5 8.5 0 1 1 8.8 4 7 7 0 0 0 20 15.2Z"></path>',
      sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>',
      auto: '<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path>',
      download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"></path>',
      home: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"></path>',
      project: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"></path>',
      explore: '<circle cx="12" cy="12" r="9"></circle><path d="m15.5 8.5-2 5-5 2 2-5Z"></path>',
      chat: '<path d="M4 5h16v11H8l-4 4Z"></path>',
      user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
      board: '<rect x="3" y="3" width="8" height="8" rx="1"></rect><rect x="13" y="3" width="8" height="5" rx="1"></rect><rect x="13" y="10" width="8" height="11" rx="1"></rect><rect x="3" y="13" width="8" height="8" rx="1"></rect>',
      compare: '<path d="M8 3v18M16 3v18M4 7h8M12 17h8"></path>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 10h18"></path>',
      activity: '<path d="M3 12h4l2-6 4 12 2-6h6"></path>',
      settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"></path>',
      finance: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18M7 15h3"></path>',
      help: '<circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.7-1.5 1.1-1.5 2.2M12 17h.01"></path>',
      shield: '<path d="M12 3 4 6v6c0 5 3.4 8.2 8 9 4.6-.8 8-4 8-9V6Z"></path><path d="m9 12 2 2 4-4"></path>',
      product: '<path d="m12 3 8 4-8 4-8-4 8-4Z"></path><path d="m4 7 8 4 8-4v9l-8 5-8-5Z"></path>',
      company: '<path d="M4 21V7l8-4v18M12 9h8v12M7 9h2M7 13h2M7 17h2M15 13h2M15 17h2"></path>',
      category: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"></path>',
      proposal: '<path d="M6 3h9l3 3v15H6Z"></path><path d="M14 3v4h4M9 12h6M9 16h6"></path>',
      status: '<circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16 9"></path>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.search}</svg>`;
  };

  async function api(action, data = {}, method = "GET") {
    const payload = {acao: action, ...data};
    if (token && !payload.token) payload.token = token;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 24000);
    try {
      let response;
      if (method === "POST") {
        response = await fetch(API_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8", "Accept":"application/json"}, body:JSON.stringify(payload), signal:controller.signal});
      } else {
        const url = new URL(API_URL);
        Object.entries(payload).forEach(([key,value]) => { if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value)); });
        response = await fetch(url, {cache:"no-store", headers:{"Accept":"application/json"}, signal:controller.signal});
      }
      const text = await response.text();
      try { return JSON.parse(text); } catch (_) { return {sucesso:false,mensagem:"O servidor retornou uma resposta inválida."}; }
    } catch (error) {
      return {sucesso:false,mensagem:error?.name === "AbortError" ? "O servidor demorou para responder." : "Não foi possível conectar ao servidor ARQSELECT."};
    } finally { clearTimeout(timer); }
  }

  function notify(message) {
    const existing = document.querySelector(".toast, #toast");
    if (existing && typeof window.toast === "function") { try { window.toast(message); return; } catch (_) {} }
    let node = document.querySelector(".arq4-toast");
    if (!node) { node = document.createElement("div"); node.className = "arq4-toast"; node.setAttribute("role","status"); document.body.appendChild(node); }
    node.textContent = message;
    node.hidden = false;
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => { node.hidden = true; }, 3200);
  }

  function resolveTheme(value) {
    if (value === "auto") return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    return value === "light" ? "light" : "dark";
  }

  function currentThemePreference() { return localStorage.getItem("ARQSELECT_THEME") || "dark"; }

  function applyTheme(value, persist = true) {
    const preference = ["dark","light","auto"].includes(value) ? value : "dark";
    document.documentElement.dataset.theme = resolveTheme(preference);
    document.documentElement.dataset.themePreference = preference;
    if (persist) localStorage.setItem("ARQSELECT_THEME", preference);
    const button = document.querySelector("[data-arq4-theme]");
    if (button) {
      const labels = {dark:"Tema escuro",light:"Tema claro",auto:"Tema automático"};
      button.innerHTML = icon(preference === "dark" ? "moon" : preference === "light" ? "sun" : "auto");
      button.title = `${labels[preference]}. Clique para alterar.`;
      button.setAttribute("aria-label", button.title);
    }
  }

  function cycleTheme() {
    const current = currentThemePreference();
    applyTheme(current === "dark" ? "light" : current === "light" ? "auto" : "dark");
    notify(`Tema ${currentThemePreference() === "dark" ? "escuro" : currentThemePreference() === "light" ? "claro" : "automático"} ativado.`);
  }

  function actionsForRole() {
    const common = [
      {title:"Explorar marketplace", sub:"Produtos, marcas e fornecedores", href:"explorar.html", icon:"explore", terms:"buscar piso iluminação produto fornecedor marketplace"},
      {title:"Comparar produtos", sub:"Compare até três soluções", href:"comparar.html", icon:"compare", terms:"comparar comparação produto"},
      {title:"Central de ajuda", sub:"Guias, segurança e comissão", href:"suporte.html", icon:"help", terms:"ajuda suporte comissão segurança"},
      {title:"Status da plataforma", sub:"Verificação dos serviços públicos", href:"status.html", icon:"status", terms:"status servidor sistema"}
    ];
    if (role === "ARQUITETO") return [
      {title:"Novo projeto", sub:"Cadastre um briefing", href:"ARQSELECT_ARQUITETO_SOLICITAR.html", icon:"project", terms:"novo projeto orçamento briefing"},
      {title:"Meus projetos", sub:"Acompanhe projetos e propostas", href:"ARQSELECT_ARQUITETO_PROJETOS.html", icon:"project", terms:"meus projetos propostas"},
      {title:"Minha seleção", sub:"Boards, referências e coleções", href:"boards.html", icon:"board", terms:"board coleção favoritos referências"},
      {title:"Mensagens", sub:"Conversas relacionadas aos projetos", href:"chat.html", icon:"chat", terms:"chat mensagens não lidas"},
      {title:"Atividades", sub:"Histórico organizado", href:"atividades.html", icon:"activity", terms:"atividade histórico timeline"},
      {title:"Agenda", sub:"Prazos e lembretes", href:"calendario.html", icon:"calendar", terms:"calendário agenda lembrete prazo"},
      {title:"Preferências", sub:"Privacidade, tema e notificações", href:"configuracoes.html", icon:"settings", terms:"configuração privacidade tema notificação"}
    ].concat(common);
    if (role === "FORNECEDOR") return [
      {title:"Oportunidades", sub:"Projetos direcionados pela ARQSELECT", href:"ARQSELECT_FORNECEDOR_PROJETOS.html", icon:"project", terms:"oportunidade projeto lead"},
      {title:"Cadastrar produto", sub:"Atualize seu catálogo", href:"ARQSELECT_FORNECEDOR_PRODUTOS.html", icon:"product", terms:"novo produto catálogo"},
      {title:"Mensagens", sub:"Conversas com projetos vinculados", href:"chat.html", icon:"chat", terms:"chat mensagens"},
      {title:"Desempenho financeiro", sub:"Negócios e comissões", href:"financeiro.html", icon:"finance", terms:"financeiro negócio comissão venda"},
      {title:"Atividades", sub:"Histórico organizado", href:"atividades.html", icon:"activity", terms:"atividade histórico timeline"},
      {title:"Agenda", sub:"Follow-ups e prazos", href:"calendario.html", icon:"calendar", terms:"calendário agenda lembrete follow up"},
      {title:"Preferências", sub:"Privacidade, tema e notificações", href:"configuracoes.html", icon:"settings", terms:"configuração privacidade tema notificação"}
    ].concat(common);
    if (role === "ADMIN") return [
      {title:"Central de gestão", sub:"Dashboard executivo ARQSELECT", href:"admin.html", icon:"home", terms:"dashboard admin central gestão"},
      {title:"Central financeira", sub:"Negócios, volume e comissões", href:"financeiro.html", icon:"finance", terms:"financeiro gmv comissão negócio"},
      {title:"Atividades", sub:"Histórico e auditoria", href:"atividades.html", icon:"activity", terms:"atividade histórico auditoria"},
      {title:"Agenda", sub:"Follow-ups e lembretes", href:"calendario.html", icon:"calendar", terms:"calendário agenda lembrete"},
      {title:"Segurança", sub:"Sessão e registros operacionais", href:"seguranca.html", icon:"shield", terms:"segurança sessão auditoria"}
    ].concat(common);
    return [
      {title:"Início", sub:"Conheça a ARQSELECT", href:"index.html", icon:"home", terms:"home início"},
      {title:"Sou arquiteto", sub:"Entrar ou criar acesso", href:"ARQSELECT_LOGIN_ARQUITETO.html", icon:"user", terms:"arquiteto login cadastro"},
      {title:"Sou fornecedor", sub:"Entrar ou cadastrar empresa", href:"ARQSELECT_LOGIN_FORNECEDOR.html", icon:"company", terms:"fornecedor login cadastro parceiro"}
    ].concat(common);
  }

  function renderCommand(items, groupTitle) {
    commandItems = items.filter(item => item.href);
    activeIndex = 0;
    const results = document.querySelector(".arq4-command-results");
    if (!results) return;
    if (!commandItems.length) {
      results.innerHTML = '<div class="empty"><b>Nenhum resultado encontrado.</b><span>Tente pesquisar por produto, fornecedor, projeto ou ação.</span></div>';
      return;
    }
    results.innerHTML = `<div class="arq4-command-group">${escapeHtml(groupTitle || "Atalhos")}</div>${commandItems.map((item,index) => `
      <button type="button" class="arq4-command-item${index === 0 ? " active" : ""}" data-command-index="${index}">
        <span class="arq4-command-icon">${icon(item.icon || iconForType(item.type))}</span>
        <span><span class="arq4-command-title">${escapeHtml(item.title)}</span><br><span class="arq4-command-sub">${escapeHtml(item.sub || item.type || "")}</span></span>
        <span class="arq4-key">Abrir</span>
      </button>`).join("")}`;
    results.querySelectorAll("[data-command-index]").forEach(button => {
      button.addEventListener("click", () => executeCommand(Number(button.dataset.commandIndex)));
      button.addEventListener("mouseenter", () => setActive(Number(button.dataset.commandIndex)));
    });
  }

  function iconForType(type) {
    return ({PRODUTO:"product",FORNECEDOR:"company",CATEGORIA:"category",PROJETO:"project",PROPOSTA:"proposal"})[String(type || "").toUpperCase()] || "search";
  }

  function setActive(index) {
    if (!commandItems.length) return;
    activeIndex = (index + commandItems.length) % commandItems.length;
    document.querySelectorAll(".arq4-command-item").forEach((node,i) => node.classList.toggle("active", i === activeIndex));
    document.querySelector(`.arq4-command-item[data-command-index="${activeIndex}"]`)?.scrollIntoView({block:"nearest"});
  }

  function executeCommand(index = activeIndex) {
    const item = commandItems[index];
    if (!item?.href) return;
    location.href = item.href;
  }

  async function searchCommand(value) {
    const query = String(value || "").trim();
    const actions = actionsForRole();
    if (!query) { renderCommand(actions, "Ações rápidas"); return; }
    const normalized = query.toLowerCase();
    const local = actions.filter(item => `${item.title} ${item.sub} ${item.terms}`.toLowerCase().includes(normalized));
    renderCommand(local, "Buscando na ARQSELECT…");
    const result = await api("arq4_busca_global", {q:query,limite:18});
    const remote = result.sucesso ? (result.resultados || []).map(item => ({title:item.titulo,sub:`${item.tipo}${item.subtitulo ? " · " + item.subtitulo : ""}`,href:item.href,icon:iconForType(item.tipo),type:item.tipo})) : [];
    const seen = new Set();
    renderCommand(local.concat(remote).filter(item => { const key = `${item.href}|${item.title}`; if (seen.has(key)) return false; seen.add(key); return true; }), "Resultados");
  }

  function openCommand() {
    const modal = document.querySelector(".arq4-command");
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    const input = modal.querySelector("input");
    input.value = "";
    renderCommand(actionsForRole(), "Ações rápidas");
    setTimeout(() => input.focus(), 20);
  }

  function closeCommand() {
    const modal = document.querySelector(".arq4-command");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  function buildCommandCenter() {
    const modal = document.createElement("div");
    modal.className = "arq4-command";
    modal.setAttribute("role","dialog");
    modal.setAttribute("aria-modal","true");
    modal.setAttribute("aria-label","Pesquisa global ARQSELECT");
    modal.setAttribute("aria-hidden","true");
    modal.innerHTML = `<div class="arq4-command-panel">
      <div class="arq4-command-head">${icon("search")}<input class="arq4-command-input" type="search" autocomplete="off" placeholder="Pesquise produtos, fornecedores, projetos ou ações…" aria-label="Pesquisar na ARQSELECT"><span class="arq4-key">ESC</span></div>
      <div class="arq4-command-results"></div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", event => { if (event.target === modal) closeCommand(); });
    modal.querySelector("input").addEventListener("input", event => { clearTimeout(searchTimer); searchTimer = setTimeout(() => searchCommand(event.target.value), 260); });
    modal.querySelector("input").addEventListener("keydown", event => {
      if (event.key === "ArrowDown") { event.preventDefault(); setActive(activeIndex + 1); }
      if (event.key === "ArrowUp") { event.preventDefault(); setActive(activeIndex - 1); }
      if (event.key === "Enter") { event.preventDefault(); executeCommand(); }
    });
  }

  function buildDock() {
    const dock = document.createElement("div");
    dock.className = "arq4-dock";
    dock.setAttribute("aria-label","Ferramentas rápidas");
    dock.innerHTML = `
      <button type="button" class="arq4-icon-button" data-arq4-search title="Pesquisar na ARQSELECT (Ctrl + K)" aria-label="Pesquisar na ARQSELECT">${icon("search")}</button>
      <button type="button" class="arq4-icon-button" data-arq4-theme title="Alterar tema" aria-label="Alterar tema">${icon("moon")}</button>
      <button type="button" class="arq4-icon-button arq4-install" data-arq4-install hidden title="Instalar ARQSELECT" aria-label="Instalar ARQSELECT">${icon("download")}</button>
      <a class="arq4-icon-button" href="status.html" title="Status da plataforma" aria-label="Status da plataforma"><span class="arq4-status-dot${navigator.onLine ? "" : " offline"}"></span></a>`;
    document.body.appendChild(dock);
    dock.querySelector("[data-arq4-search]").addEventListener("click", openCommand);
    dock.querySelector("[data-arq4-theme]").addEventListener("click", cycleTheme);
    dock.querySelector("[data-arq4-install]").addEventListener("click", async () => {
      if (!installEvent) return;
      installEvent.prompt();
      await installEvent.userChoice;
      installEvent = null;
      dock.querySelector("[data-arq4-install]").hidden = true;
    });
    applyTheme(currentThemePreference(), false);
  }

  function bottomItems() {
    if (role === "ADMIN") return [];
    if (role === "ARQUITETO") return [
      ["ARQSELECT_DASHBOARD_ARQUITETO.html","Início","home"],
      ["ARQSELECT_ARQUITETO_PROJETOS.html","Projetos","project"],
      ["explorar.html","Explorar","explore"],
      ["chat.html","Chat","chat"],
      ["ARQSELECT_ARQUITETO_PERFIL.html","Perfil","user"]
    ];
    if (role === "FORNECEDOR") return [
      ["ARQSELECT_DASHBOARD_FORNECEDOR.html","Início","home"],
      ["ARQSELECT_FORNECEDOR_PROJETOS.html","Projetos","project"],
      ["explorar.html","Explorar","explore"],
      ["chat.html","Chat","chat"],
      ["ARQSELECT_FORNECEDOR_PERFIL.html","Perfil","user"]
    ];
    return [
      ["index.html","Início","home"],
      ["explorar.html","Explorar","explore"],
      ["ARQSELECT_LOGIN_ARQUITETO.html","Arquiteto","user"],
      ["ARQSELECT_LOGIN_FORNECEDOR.html","Fornecedor","company"],
      ["suporte.html","Ajuda","help"]
    ];
  }

  function buildBottomNav() {
    const items = bottomItems();
    if (!items.length) return;
    const nav = document.createElement("nav");
    nav.className = "arq4-bottom-nav";
    nav.setAttribute("aria-label","Navegação rápida");
    nav.innerHTML = items.map(([href,label,iconName]) => `<a class="arq4-bottom-item" href="${href}"${page === href.toLowerCase() ? ' aria-current="page"' : ""}>${icon(iconName)}<span>${escapeHtml(label)}</span></a>`).join("");
    document.body.appendChild(nav);
  }

  function enhanceAccessibility() {
    if (!document.querySelector(".arq4-skip")) {
      const skip = document.createElement("a");
      skip.className = "arq4-skip";
      skip.href = "#arq4-main";
      skip.textContent = "Ir para o conteúdo";
      document.body.prepend(skip);
    }
    const main = document.querySelector("main, .main, [role='main']");
    if (main && !main.id) main.id = "arq4-main";
    document.querySelectorAll("nav").forEach((nav,index) => { if (!nav.hasAttribute("aria-label")) nav.setAttribute("aria-label", index ? "Navegação secundária" : "Navegação principal"); });
    document.querySelectorAll("a[href]").forEach(anchor => {
      const href = (anchor.getAttribute("href") || "").split(/[?#]/)[0].toLowerCase();
      if (href && href === page) anchor.setAttribute("aria-current","page");
      if (anchor.target === "_blank") anchor.rel = "noopener noreferrer";
    });
    document.querySelectorAll("img").forEach(image => { if (!image.hasAttribute("alt")) image.alt = ""; image.loading = image.loading || "lazy"; image.decoding = "async"; });
    document.querySelectorAll("button:not([type])").forEach(button => button.type = "button");
  }

  function scanLoading(root = document) {
    root.querySelectorAll?.(".loader, .empty, .card, .panel").forEach(node => {
      const text = node.textContent.trim().toLowerCase();
      const loading = /^(carregando|aguarde|verificando)/.test(text);
      node.classList.toggle("arq4-skeleton", loading);
      if (loading) node.setAttribute("aria-busy","true"); else node.removeAttribute("aria-busy");
    });
  }

  function compareIds() {
    try { return JSON.parse(localStorage.getItem("ARQSELECT_COMPARE_IDS") || "[]").filter(Boolean).slice(0,3); } catch (_) { return []; }
  }

  function addCompare(id) {
    const value = String(id || "").trim();
    if (!value) return;
    const ids = compareIds();
    if (ids.includes(value)) { notify("Este produto já está no comparador."); return; }
    if (ids.length >= 3) { notify("O comparador aceita até três produtos. Remova um item para continuar."); return; }
    ids.push(value);
    localStorage.setItem("ARQSELECT_COMPARE_IDS", JSON.stringify(ids));
    notify("Produto adicionado ao comparador.");
  }

  function shareCurrent(title) {
    const data = {title:title || document.title, text:title || document.title, url:location.href};
    if (navigator.share) navigator.share(data).catch(() => {});
    else navigator.clipboard?.writeText(location.href).then(() => notify("Link copiado."));
  }

  function enhanceProducts(root = document) {
    root.querySelectorAll?.('a[href*="produto.html?id="]').forEach(anchor => {
      const card = anchor.closest(".product, .card");
      if (!card || card.querySelector(".arq4-compare-add")) return;
      let id = "";
      try { id = new URL(anchor.href, location.href).searchParams.get("id") || ""; } catch (_) {}
      if (!id) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn light arq4-compare-add";
      button.textContent = "Comparar";
      button.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); addCompare(id); });
      card.appendChild(button);
    });
    if (page === "produto.html") {
      const toolbar = document.querySelector("#app .toolbar");
      const id = new URLSearchParams(location.search).get("id") || "";
      if (toolbar && id && !toolbar.querySelector(".arq4-product-tools")) {
        const wrap = document.createElement("span");
        wrap.className = "arq4-product-tools arq4-actions";
        const title = document.querySelector("#app h1")?.textContent || "Produto";
        wrap.innerHTML = '<button type="button" class="btn light" data-compare>Comparar</button><button type="button" class="btn light" data-board>Adicionar ao board</button><button type="button" class="btn light" data-share>Compartilhar</button>';
        wrap.querySelector("[data-compare]").onclick = () => addCompare(id);
        wrap.querySelector("[data-board]").onclick = () => { location.href = `boards.html?add=PRODUTO&id=${encodeURIComponent(id)}&titulo=${encodeURIComponent(title)}&url=${encodeURIComponent(location.href)}`; };
        wrap.querySelector("[data-share]").onclick = () => shareCurrent(title);
        toolbar.appendChild(wrap);
      }
    }
  }

  async function injectInsights() {
    if (!portalToken || !/dashboard-(arquiteto|fornecedor)|arqselect_dashboard_(arquiteto|fornecedor)/i.test(page)) return;
    const result = await api("arq4_insights");
    if (!result.sucesso || document.getElementById("arq4-insights")) return;
    const profile = result.perfil || {}, steps = result.onboarding || [], insights = result.insights || [], metrics = result.metricas || {};
    const metricCards = role === "FORNECEDOR" ? [
      ["ARQSELECT Score", metrics.score || 0],
      ["Posição no ranking", metrics.posicao ? `#${metrics.posicao}` : "—"],
      ["Oportunidades", metrics.oportunidades || 0],
      ["Propostas", metrics.propostas || 0]
    ] : [
      ["Projetos", metrics.projetos || 0],
      ["Propostas", metrics.propostas || 0],
      ["Itens favoritos", metrics.favoritos || 0]
    ];
    const section = document.createElement("section");
    section.id = "arq4-insights";
    section.className = "arq4-card arq4-onboarding";
    section.innerHTML = `<div class="arq4-section-head"><div><div class="ey">PRÓXIMOS PASSOS</div><h2>Seu espaço ARQSELECT</h2></div><span class="badge">Perfil ${Number(profile.completude || 0)}% completo</span></div>
      <div class="arq4-progress" aria-label="Perfil ${Number(profile.completude || 0)}% completo"><span style="width:${Math.max(0,Math.min(100,Number(profile.completude || 0)))}%"></span></div>
      <div class="arq4-onboarding-steps">${steps.map(step => `<div class="arq4-onboarding-step${step.concluido ? " done" : ""}">${step.concluido ? "✓" : "○"} ${escapeHtml(step.titulo)}</div>`).join("")}</div>
      <div class="arq4-grid" style="margin-top:14px">${metricCards.map(item => `<div class="arq4-card"><div class="stat-label">${escapeHtml(item[0])}</div><div class="arq4-stat-value">${escapeHtml(item[1])}</div></div>`).join("")}</div>
      ${insights.length ? `<div class="arq4-list" style="margin-top:14px">${insights.map(item => `<a class="arq4-list-item" href="${escapeHtml(item.href)}"><span class="arq4-list-icon">→</span><span><b>${escapeHtml(item.titulo)}</b><br><span class="muted">${escapeHtml(item.descricao)}</span></span><span class="badge">Abrir</span></a>`).join("")}</div>` : ""}`;
    const main = document.querySelector("main, .wrap");
    const hero = main?.querySelector(".hero, .cards, .grid");
    if (hero) hero.insertAdjacentElement("afterend", section); else main?.prepend(section);
  }

  function registerPwa() {
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      installEvent = event;
      const button = document.querySelector("[data-arq4-install]");
      if (button) button.hidden = false;
    });
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
    }
  }

  function bindGlobalEvents() {
    document.addEventListener("keydown", event => {
      const target = event.target;
      const typing = /input|textarea|select/i.test(target?.tagName) || target?.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openCommand(); }
      else if (event.key === "/" && !typing) { event.preventDefault(); openCommand(); }
      else if (event.key === "Escape") closeCommand();
    });
    addEventListener("online", () => { document.querySelectorAll(".arq4-status-dot").forEach(node => node.classList.remove("offline")); notify("Conexão restabelecida."); });
    addEventListener("offline", () => { document.querySelectorAll(".arq4-status-dot").forEach(node => node.classList.add("offline")); notify("Você está sem conexão. Algumas informações podem ficar indisponíveis."); });
    matchMedia("(prefers-color-scheme: light)").addEventListener?.("change", () => { if (currentThemePreference() === "auto") applyTheme("auto", false); });
  }

  function init() {
    buildCommandCenter();
    buildDock();
    buildBottomNav();
    enhanceAccessibility();
    scanLoading();
    enhanceProducts();
    injectInsights();
    registerPwa();
    bindGlobalEvents();
    const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      scanLoading(node);
      enhanceProducts(node);
    })));
    observer.observe(document.body, {childList:true,subtree:true});
  }

  window.ARQSELECT4 = {initialized:true, api, notify, openCommand, applyTheme, addCompare, compareIds, shareCurrent, role, token, build:"2026.09.02.40"};
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true}); else init();
})();
