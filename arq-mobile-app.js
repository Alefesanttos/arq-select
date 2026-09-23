(()=>{"use strict";
const roles={
  ARQUITETO:{label:"Arquiteto",login:"ARQSELECT_LOGIN_ARQUITETO.html",dashboard:"ARQSELECT_DASHBOARD_ARQUITETO.html",modules:[
    ["Projetos","Contexto e andamento","▦","ARQSELECT_ARQUITETO_PROJETOS.html"],
    ["Solicitar cotação","Criar um RFQ","＋","solicitar-orcamento.html"],
    ["Propostas","Comparar alternativas","⇄","comparar-propostas.html"],
    ["Marketplace","Produtos e soluções","⌕","explorar.html"],
    ["Fornecedores","Encontre parceiros","▧","fornecedores.html"],
    ["Chat","Conversas do projeto","▤","chat.html"],
    ["Networking","Conexões profissionais","◎","networking.html"],
    ["Agenda","Compromissos e prazos","◷","agenda.html"],
    ["Inspiração","Feed e referências","✧","feed.html"],
    ["Favoritos","Itens salvos","♡","favoritos.html"],
    ["Notificações","Atualizações da conta","♢","notificacoes.html"],
    ["Meu perfil","Dados profissionais","○","ARQSELECT_ARQUITETO_PERFIL.html"]
  ]},
  FORNECEDOR:{label:"Fornecedor",login:"ARQSELECT_LOGIN_FORNECEDOR.html",dashboard:"ARQSELECT_DASHBOARD_FORNECEDOR.html",modules:[
    ["Painel","Resumo comercial","▦","ARQSELECT_DASHBOARD_FORNECEDOR.html"],
    ["Oportunidades","Projetos direcionados","⌖","ARQSELECT_FORNECEDOR_SOLICITACOES.html"],
    ["Propostas","Respostas e negociação","⇄","propostas-portal.html"],
    ["Projetos","Demandas em andamento","▧","ARQSELECT_FORNECEDOR_PROJETOS.html"],
    ["Meu catálogo","Produtos publicados","▤","ARQSELECT_FORNECEDOR_PRODUTOS.html"],
    ["Chat","Conversas do projeto","▤","chat.html"],
    ["Networking","Conexões profissionais","◎","networking.html"],
    ["Agenda","Compromissos e prazos","◷","agenda.html"],
    ["Analytics","Desempenho do perfil","⌁","analytics-fornecedor.html"],
    ["Meu perfil","Dados da empresa","○","ARQSELECT_FORNECEDOR_PERFIL.html"],
    ["Notificações","Atualizações da conta","♢","notificacoes.html"],
    ["Suporte","Ajuda da plataforma","?","suporte.html"]
  ]},
  PRESTADOR:{label:"Prestador",login:"ARQSELECT_LOGIN_PRESTADOR.html",dashboard:"dashboard-prestador.html",modules:[
    ["Painel","Seu negócio","▦","dashboard-prestador.html"],
    ["Oportunidades","Serviços compatíveis","⌖","central-oportunidades.html"],
    ["Propostas","Valores e prazos","⇄","propostas-servicos.html"],
    ["CRM","Clientes e negócios","▤","crm-prestador.html"],
    ["Execução","Checklist e diário","✓","execucao-servicos.html"],
    ["Agenda","Visitas e prazos","◷","agenda-prestador.html"],
    ["Portfólio","Trabalhos realizados","▧","portfolio-prestador.html"],
    ["Perfil","Dados profissionais","○","prestador.html"],
    ["Chat","Conversas do serviço","▤","chat.html"],
    ["Notificações","Atualizações da conta","♢","notificacoes.html"],
    ["Networking","Conexões profissionais","◎","networking.html"],
    ["Suporte","Ajuda da plataforma","?","suporte.html"]
  ]},
  ADMIN:{label:"Administração",login:"admin.html",dashboard:"admin.html",modules:[
    ["Painel admin","Visão geral","▦","admin.html"],
    ["Operação comercial","Propostas e negócios","⇄","admin-commerce.html"],
    ["Painel de negócios","Pipeline e fechamento","▤","painel-negocios.html"],
    ["Prestadores","Cadastros e qualidade","⌖","admin-prestadores.html"],
    ["Serviços","Categorias e gestão","▧","admin-servicos.html"],
    ["Qualidade","Dados e auditoria","✓","admin-qualidade.html"],
    ["Webhooks","Integrações","⌘","admin-webhooks.html"],
    ["Organizações","Membros e permissões","◎","organizacao.html"],
    ["Exportação","Dados da plataforma","⇧","exportar.html"],
    ["Configurações","Preferências","⚙","configuracoes.html"],
    ["Notificações","Central de eventos","♢","notificacoes.html"],
    ["Suporte","Atendimentos","?","suporte.html"]
  ]}
};
const storage=(key)=>{try{return localStorage.getItem(key)||""}catch(_){return""}};
const token=storage("ARQSELECT_PORTAL_TOKEN");
let role=String(storage("ARQSELECT_PORTAL_TIPO")||"").toUpperCase();
if(!roles[role]){try{const s=JSON.parse(storage("ARQSELECT_SESSION")||"null");role=String(s?.perfil||s?.usuario?.PERFIL||s?.usuario?.perfil||"").toUpperCase();if(role==="PRESTADOR DE SERVIÇOS")role="PRESTADOR";if(role==="FORNECEDOR PARCEIRO")role="FORNECEDOR";if(!roles[role])role=""}catch(_){role=""}}
let selected=roles[role]?role:"ARQUITETO";
const $=s=>document.querySelector(s);
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const grid=$("#moduleGrid"),roleSwitch=$("#roleSwitch");
function renderRole(next){
 selected=roles[next]?next:"ARQUITETO";
 const data=roles[selected];
 document.querySelectorAll("[data-role]").forEach(b=>{b.hidden=b.dataset.role==="ADMIN";b.setAttribute("aria-pressed",String(b.dataset.role===selected))});
 $("#moduleEyebrow").textContent=data.label.toLocaleUpperCase("pt-BR");
 $("#moduleCount").textContent=data.modules.length+" módulos";
 grid.innerHTML=data.modules.map(([name,desc,icon,url])=>'<a class="module-card" href="./'+encodeURI(url)+'"><span class="module-icon" aria-hidden="true">'+escape(icon)+'</span><span><b>'+escape(name)+'</b><br><small>'+escape(desc)+'</small></span></a>').join("");
 const primary=$("#mainAction");
 primary.href="./"+(token&&roles[role]?roles[role].dashboard:data.login);
 primary.textContent=token&&roles[role]?"Abrir meu painel":"Acessar como "+data.label.toLocaleLowerCase("pt-BR");
 $("#projectsNav").href="./"+(selected==="FORNECEDOR"?"ARQSELECT_FORNECEDOR_PROJETOS.html":selected==="PRESTADOR"?"central-oportunidades.html":"ARQSELECT_ARQUITETO_PROJETOS.html");
 $("#accountNav").href="./"+(token&&roles[role]?roles[role].dashboard:data.login);
 $("#accountNav small").textContent=token&&roles[role]?"Conta":"Entrar";
 if(roleSwitch)roleSwitch.hidden=Boolean(token&&roles[role]);
}
if(roleSwitch)roleSwitch.addEventListener("click",event=>{const button=event.target.closest("[data-role]");if(button)renderRole(button.dataset.role)});
if(token&&roles[role]){
 $("#sessionCard").hidden=false;
 $("#sessionTitle").textContent="Acesso de "+roles[role].label.toLocaleLowerCase("pt-BR")+" detectado";
 $("#sessionDescription").textContent="Abra seu painel para continuar na plataforma.";
 $("#sessionLink").href="./"+roles[role].dashboard;
 $("#mainAction").href="./"+roles[role].dashboard;
 $("#mainAction").textContent="Continuar no meu painel";
 renderRole(role);
}else{renderRole(selected)}
function updateConnection(){const node=$("#connectionStatus");if(!node)return;node.dataset.state=navigator.onLine?"online":"offline";node.textContent=navigator.onLine?"Conectado":"Sem conexão"}
window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);updateConnection();
const themeButton=$("#themeToggle");
themeButton?.addEventListener("click",()=>{const current=window.ARQSELECT_THEME?.getResolved?.()||document.documentElement.dataset.theme||"dark";window.ARQSELECT_THEME?.set(current==="dark"?"light":"dark")});
const installButton=$("#installButton"),help=$("#installHelp");
let installPrompt;
window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();installPrompt=event;if(installButton)installButton.hidden=false});
installButton?.addEventListener("click",async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.hidden=true;return}if(help?.showModal)help.showModal()});
if(/iphone|ipad|ipod/i.test(navigator.userAgent)&&installButton){installButton.hidden=false;installButton.textContent="Adicionar à tela inicial"}
document.addEventListener("DOMContentLoaded",()=>{if("serviceWorker"in navigator&&location.protocol==="https:")navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{})});
})();