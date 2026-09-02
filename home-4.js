(function () {
  "use strict";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const brlCompact = value => Number(value || 0).toLocaleString("pt-BR", {style:"currency",currency:"BRL",maximumFractionDigits:0});

  async function loadStats() {
    const result = await ARQSELECT4.api("arq4_public_stats");
    const root = document.getElementById("home-stats");
    if (!root) return;
    if (!result.sucesso) {
      root.innerHTML = '<div class="num" style="grid-column:1/-1"><strong>—</strong><span>Indicadores temporariamente indisponíveis</span></div>';
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

  Promise.allSettled([loadStats(), loadReviews(), loadProducts()]);
})();
