(function () {
  "use strict";
  const root = document.getElementById("grid");
  const toolbar = document.querySelector(".toolbar");
  if (!root || !toolbar) return;
  const esc4 = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const images = value => { try { const parsed=JSON.parse(value); return Array.isArray(parsed)?parsed:[]; } catch (_) { return String(value||"").split(/\n/).map(x=>x.trim()).filter(Boolean); } };
  const urlParams = new URLSearchParams(location.search);

  toolbar.innerHTML = `
    <input id="q" type="search" placeholder="Produto, material, marca ou fornecedor" aria-label="Pesquisar produtos">
    <select id="cat" aria-label="Categoria"><option value="">Todas as categorias</option></select>
    <input id="brand4" placeholder="Marca" aria-label="Filtrar por marca">
    <input id="region4" placeholder="Cidade ou região" aria-label="Filtrar por região">
    <select id="availability4" aria-label="Disponibilidade"><option value="">Toda disponibilidade</option><option value="disponível">Disponível</option><option value="sob encomenda">Sob encomenda</option></select>
    <select id="sort4" aria-label="Ordenar produtos"><option value="">Mais relevantes</option><option value="avaliacao">Melhor avaliação</option><option value="recentes">Mais recentes</option><option value="preco-menor">Menor preço</option><option value="preco-maior">Maior preço</option><option value="nome">Nome</option></select>
    <button class="btn gold" id="search4">Aplicar filtros</button>
    <button class="btn light" id="clear4">Limpar</button>`;

  document.getElementById("q").value = urlParams.get("q") || "";
  document.getElementById("brand4").value = urlParams.get("marca") || "";
  document.getElementById("region4").value = urlParams.get("regiao") || "";

  async function load4() {
    root.innerHTML = '<div class="arq4-card arq4-skeleton" aria-busy="true"></div><div class="arq4-card arq4-skeleton" aria-busy="true"></div><div class="arq4-card arq4-skeleton" aria-busy="true"></div>';
    const data = {
      q:document.getElementById("q").value,
      categoria:document.getElementById("cat").value,
      marca:document.getElementById("brand4").value,
      regiao:document.getElementById("region4").value,
      disponibilidade:document.getElementById("availability4").value,
      ordenacao:document.getElementById("sort4").value,
      fornecedor:urlParams.get("fornecedor") || ""
    };
    const result = await ARQSELECT4.api("portal_produtos", data);
    if (!result.sucesso) {
      root.innerHTML = `<div class="arq4-card empty" style="grid-column:1/-1"><b>Não conseguimos carregar o marketplace.</b><span>${esc4(result.mensagem||"Tente novamente.")}</span><button class="btn light" onclick="load()">Tentar novamente</button></div>`;
      return;
    }
    const category = document.getElementById("cat");
    if (category.options.length === 1) {
      (result.categorias || []).forEach(item => { const option=document.createElement("option");option.value=item.NOME;option.textContent=item.NOME;category.appendChild(option); });
      category.value = urlParams.get("categoria") || data.categoria || "";
      if (category.value !== data.categoria && category.value) return load4();
    }
    const products = result.produtos || [];
    root.innerHTML = products.length ? products.map(product => {
      const image = images(product.FOTOS)[0] || "";
      const rating = Number(product["AVALIACAO FORNECEDOR"] || 0);
      return `<article class="card product">
        <div class="thumb">${image?`<img src="${esc4(image)}" alt="${esc4(product.NOME||"Produto")}" loading="lazy">`:'<span class="muted">Imagem não cadastrada</span>'}</div>
        <div class="arq4-actions"><span class="badge">${esc4(product.CATEGORIA||"Produto")}</span>${product["FORNECEDOR VERIFICADO"]==="SIM"?'<span class="badge green">Fornecedor verificado</span>':''}</div>
        <h3>${esc4(product.NOME||"Produto")}</h3>
        <div class="muted">${esc4(product.MARCA||"")} ${product.FORNECEDOR?`· <a href="fornecedor.html?id=${encodeURIComponent(product["FORNECEDOR ID"]||"")}">${esc4(product.FORNECEDOR)}</a>`:""}</div>
        <div class="muted">${esc4(product.REGIAO||"")} ${rating?`· ${rating.toFixed(1)} ★`:""}</div>
        <div class="price">${esc4(product.PRECO||product["FAIXA PRECO"]||"Consultar")}</div>
        <a class="btn gold" href="produto.html?id=${encodeURIComponent(product.ID)}">Ver produto</a>
      </article>`;
    }).join("") : '<div class="arq4-card empty" style="grid-column:1/-1"><b>Nenhum produto encontrado.</b><span>Ajuste os filtros ou explore outra categoria.</span><button class="btn light" id="emptyClear">Limpar filtros</button></div>';
    document.getElementById("emptyClear")?.addEventListener("click", clear4);
  }

  function clear4() {
    ["q","brand4","region4"].forEach(id=>document.getElementById(id).value="");
    ["cat","availability4","sort4"].forEach(id=>document.getElementById(id).value="");
    history.replaceState(null,"",location.pathname);
    load4();
  }

  document.getElementById("search4").onclick = load4;
  document.getElementById("clear4").onclick = clear4;
  document.getElementById("q").addEventListener("keydown", event => { if (event.key === "Enter") load4(); });
  window.load = load4;
  load4();
})();
