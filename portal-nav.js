(function () {
  if (!document.querySelector('link[href="arqselect-4.css"]')) {
    const style=document.createElement("link");style.rel="stylesheet";style.href="arqselect-4.css";document.head.appendChild(style);
  }
  if (!document.querySelector('script[src="arqselect-4.js"]')) {
    const shared=document.createElement("script");shared.src="arqselect-4.js";document.body.appendChild(shared);
  }
  const nav = document.querySelector("nav");
  if (!nav || nav.dataset.arqselect30) return;
  nav.dataset.arqselect30 = "true";
  const role = (localStorage.getItem("ARQSELECT_PORTAL_TIPO") || "").toUpperCase();
  const links = [
    ["propostas.html", "Propostas"],
    ["favoritos.html", "Favoritos"],
    ...(role === "ARQUITETO" ? [["boards.html", "Minha seleção"], ["comparar.html", "Comparar"]] : []),
    ...(role === "FORNECEDOR" ? [["financeiro.html", "Financeiro"]] : []),
    ["avaliacoes.html", "Avaliações"],
    ["ranking.html", "Ranking"],
    ["atividades.html", "Atividades"],
    ["calendario.html", "Agenda"],
    ["configuracoes.html", "Preferências"],
    ["suporte.html", "Suporte"]
  ];
  const existing = new Set([...nav.querySelectorAll("a")].map(item => item.getAttribute("href")));
  links.forEach(([href, label]) => {
    if (existing.has(href)) return;
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.textContent = label;
    anchor.className = "btn";
    nav.appendChild(anchor);
  });
})();
