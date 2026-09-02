(function () {
  const nav = document.querySelector("nav");
  if (!nav || nav.dataset.arqselect30) return;
  nav.dataset.arqselect30 = "true";
  const links = [
    ["propostas.html", "Propostas"],
    ["favoritos.html", "Favoritos"],
    ["avaliacoes.html", "Avaliações"],
    ["ranking.html", "Ranking"],
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
