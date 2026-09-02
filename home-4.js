(function () {
  "use strict";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const brlCompact = value => Number(value || 0).toLocaleString("pt-BR", {style:"currency",currency:"BRL",maximumFractionDigits:0});

  async function loadStats() {
    const section = document.getElementById("public-results");
    const root = document.getElementById("home-stats");
    if (!root || !section) return;
    const config = await ARQSELECT4.api("arq4_public_home_config");
    if (!config.sucesso || !config.home || config.home.mostrarNumeros !== true) {
      section.hidden = true;
      root.innerHTML = "";
      return;
    }
    const result = await ARQSELECT4.api("arq4_public_stats");
    if (!result.sucesso) {
      section.hidden = true;
      return;
    }
    const stats = result.estatisticas || {};
    const values = [
      [stats.arquitetos || 0, "Arquitetos cadastrados"],
      [stats.fornecedores || 0, "Fornecedores parceiros"],
      [stats.projetos || 0, "Projetos recebidos"],
      [stats.cotacoes || 0, "Cotações registradas"],
      [brlCompact(stats.valorMovimentado), "Volume em negócios fechados"]
    ];
    root.innerHTML = values.map(item => `<div class="num"><strong>${esc(item[0])}</strong><span>${esc(item[1])}</span></div>`).join("");
    section.hidden = false;
  }

  async function loadReviews() {
    const root = document.getElementById("home-reviews");
    if (!root) return;
    const result = await ARQSELECT4.api("arq4_public_reviews", {limite:3});
    const rows = result.sucesso ? result.avaliacoes || [] : [];
    root.innerHTML = rows.length ? rows.map(item => `<article class="quote"><div class="badge green">Avaliação publicada · ${Number(item.nota || 0).toFixed(1)} ★</div><p>“${esc(item.comentario)}”</p><footer>${esc(item.nome)} · ${esc(item.tipo)}</footer></article>`).join("") : '<div class="quote empty" style="grid-column:1/-1"><b>As avaliações verificadas aparecerão aqui.</b><span>Somente experiências reais, publicadas após moderação, são exibidas.</span></div>';
  }

  async function loadProducts() {
    const root = document.getElementById("home-products");
    if (!root) return;
    const result = await ARQSELECT4.api("portal_produtos", {q:""});
    const rows = result.sucesso ? (result.produtos || []).slice(0,6) : [];
    root.innerHTML = rows.length ? rows.map(item => {
      const image = String(item.FOTOS || "").split(/\n/).filter(Boolean)[0];
      return `<article class="product arq4-card">${image ? `<img class="arq4-product-image" src="${esc(image)}" alt="${esc(item.NOME || "Produto")}">` : '<div class="arq4-product-image empty">Imagem não cadastrada</div>'}<div class="ey">${esc(item.CATEGORIA || "PRODUTO")}</div><h3>${esc(item.NOME || "Produto")}</h3><p class="muted">${esc([item.MARCA,item.REGIAO].filter(Boolean).join(" · ") || "Fornecedor ARQSELECT")}</p><a class="btn gold" href="produto.html?id=${encodeURIComponent(item.ID)}">Ver produto</a></article>`;
    }).join("") : '<div class="arq4-card empty" style="grid-column:1/-1"><b>O marketplace está pronto para receber os primeiros produtos aprovados.</b><a class="btn gold" href="ARQSELECT_LOGIN_FORNECEDOR.html#cadastro">Cadastrar minha empresa</a></div>';
  }

  function setupExperience() {
    const modal = document.getElementById("access-modal");
    const close = () => { if (!modal) return; modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; };
    const open = () => { if (!modal) return; modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; modal.querySelector("[data-close-access]")?.focus(); };
    document.querySelectorAll("[data-open-access]").forEach(button => button.addEventListener("click", event => { event.preventDefault(); open(); }));
    document.querySelectorAll("[data-close-access]").forEach(button => button.addEventListener("click", close));
    modal?.addEventListener("click", event => { if (event.target === modal) close(); });
    const storyContent = {
      projeto: {
        title: "Do repertório à decisão",
        html: "<p>O arquiteto apresenta o contexto do projeto e organiza o que precisa encontrar. A plataforma aproxima referências, produtos e parceiros sem perder a relação com o briefing original.</p><ul><li>Projeto e necessidade no centro da jornada</li><li>Seleções que podem ser revisitadas e comparadas</li><li>Conversas ligadas ao contexto correto</li></ul>"
      },
      materiais: {
        title: "Curadoria para especificar melhor",
        html: "<p>Materiais e soluções podem ser analisados por aplicação, acabamento, faixa de investimento e aderência ao projeto. O objetivo é tornar a escolha mais organizada e menos dispersa.</p><ul><li>Alternativas econômicas, intermediárias e premium</li><li>Produtos publicados após o fluxo de aprovação</li><li>Comparação com informações técnicas e comerciais</li></ul>"
      },
      logistica: {
        title: "Fornecimento com rastreabilidade",
        html: "<p>Cada oportunidade direcionada mantém fornecedor, proposta, mensagens e etapas comerciais vinculados ao mesmo projeto. Assim, a equipe acompanha o relacionamento sem perder histórico.</p><ul><li>Acesso somente aos projetos direcionados</li><li>Propostas e atualizações registradas</li><li>Controle administrativo de status e aprovação</li></ul>"
      }
    };
    const storyModal = document.getElementById("story-modal"), storyTitle = document.getElementById("story-modal-title"), storyBody = document.getElementById("story-modal-body");
    const closeStory = () => { if (!storyModal) return; storyModal.classList.remove("open"); storyModal.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; };
    const openStory = key => { const item = storyContent[key]; if (!item || !storyModal) return; storyTitle.textContent = item.title; storyBody.innerHTML = item.html; storyModal.classList.add("open"); storyModal.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; storyModal.querySelector("[data-close-story]")?.focus(); };
    document.querySelectorAll("[data-story-detail]").forEach(button => button.addEventListener("click", () => openStory(button.dataset.storyDetail)));
    document.querySelectorAll("[data-close-story]").forEach(button => button.addEventListener("click", closeStory));
    storyModal?.addEventListener("click", event => { if (event.target === storyModal) closeStory(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") { close(); closeStory(); } });
    const menu = document.getElementById("home-menu");
    const toggle = document.querySelector("[data-home-menu]");
    toggle?.addEventListener("click", () => { const opened = menu?.classList.toggle("open") || false; toggle.setAttribute("aria-expanded",String(opened)); });
    menu?.querySelectorAll("a,button").forEach(item => item.addEventListener("click", () => { menu.classList.remove("open"); toggle?.setAttribute("aria-expanded","false"); }));
  }

  setupExperience();
  Promise.allSettled([loadStats(), loadReviews(), loadProducts()]);
})();
