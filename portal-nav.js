(function () {
  if (!document.querySelector('link[href="arqselect-4.css"]')) { const style=document.createElement("link");style.rel="stylesheet";style.href="arqselect-4.css";document.head.appendChild(style); }
  if (!document.querySelector('script[src="arqselect-4.js"]')) { const shared=document.createElement("script");shared.src="arqselect-4.js";document.body.appendChild(shared); }
  const nav=document.querySelector("nav"); if(!nav||nav.dataset.arqselect30)return; nav.dataset.arqselect30="true";
  const role=(localStorage.getItem("ARQSELECT_PORTAL_TIPO")||"").toUpperCase();
  const links=[
    ["central-oportunidades.html","Oportunidades"],
    ["propostas.html","Propostas"],["favoritos.html","Favoritos"],
    ...(role==="ARQUITETO"?[["boards.html","Minha seleção"],["comparar.html","Comparar"],["prestadores.html","Encontrar profissionais"],["criar-oportunidade-servico.html","Solicitar serviço"],["propostas-servicos.html","Propostas de serviços"]]:[]),
    ...(role==="FORNECEDOR"?[["financeiro.html","Financeiro"]]:[]),
    ...(role==="PRESTADOR"?[["dashboard-prestador.html","Painel prestador"],["oportunidades-servicos.html","Oportunidades de serviços"],["crm-prestador.html","CRM"],["portfolio-prestador.html","Portfólio"]]:[]),
    ["avaliacoes.html","Avaliações"],["ranking.html","Ranking"],["atividades.html","Atividades"],["calendario.html","Agenda"],["configuracoes.html","Preferências"],["suporte.html","Suporte"]
  ];
  const existing=new Set([...nav.querySelectorAll("a")].map(item=>item.getAttribute("href")));
  links.forEach(([href,label])=>{if(existing.has(href))return;const anchor=document.createElement("a");anchor.href=href;anchor.textContent=label;anchor.className="btn";nav.appendChild(anchor);});
})();