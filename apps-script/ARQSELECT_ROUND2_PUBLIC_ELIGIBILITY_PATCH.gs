/**
 * ARQSELECT — Rodada 2 de segurança/consistência
 * Objetivo:
 * - impedir usuários INATIVO/BLOQUEADO/EXCLUIDO de aparecerem em superfícies ativas;
 * - exigir ATIVO + APROVADO para arquitetos/fornecedores públicos;
 * - impedir distribuição de projeto para fornecedor indisponível;
 * - preservar histórico, sem deleteRow().
 *
 * COMO INTEGRAR NO Code.gs
 * ------------------------
 * No doGet, ANTES dos roteadores ARQSELECT 10/9/8/7/6/5/4/3:
 *
 *   var r2 = rotearARQSELECTRound2(acao, dados, "GET");
 *   if (r2) return r2;
 *
 * No doPost, ANTES dos roteadores ARQSELECT 10/9/8/7/6/5/4/3:
 *
 *   var r2 = rotearARQSELECTRound2(acao, dados, "POST");
 *   if (r2) return r2;
 *
 * Depois publique nova versão da MESMA implantação /exec.
 */

function arqR2Norm_(v) {
  return String(v == null ? "" : v).trim().toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function arqR2Text_(v) {
  return String(v == null ? "" : v).trim();
}

function arqR2Reply_(obj) {
  if (typeof respostaJSON === "function") return respostaJSON(obj);
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function arqR2Payload_(out) {
  if (!out) return null;
  if (typeof out.getContent === "function") {
    try { return JSON.parse(out.getContent()); } catch (_) { return null; }
  }
  if (typeof out === "object") return out;
  try { return JSON.parse(String(out)); } catch (_) { return null; }
}

function arqR2CentralUsers_() {
  try {
    return lerAbaComoObjetos(
      garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS)
    );
  } catch (_) {
    return [];
  }
}

function arqR2CentralUser_(id, tipo) {
  id = arqR2Text_(id);
  tipo = arqR2Norm_(tipo);
  return arqR2CentralUsers_().filter(function(u) {
    return arqR2Text_(u.ID) === id &&
      (!tipo || arqR2Norm_(u.TIPO) === tipo);
  })[0] || null;
}

function arqR2UserEligible_(u, tipo) {
  if (!u) return false;
  if (tipo && arqR2Norm_(u.TIPO) !== arqR2Norm_(tipo)) return false;
  return arqR2Norm_(u.STATUS || "ATIVO") === "ATIVO" &&
    arqR2Norm_(u["STATUS APROVACAO"] || "") === "APROVADO";
}

function arqR2ProviderById_(id) {
  try {
    if (typeof arq7Rows !== "function") return null;
    return arq7Rows("PRESTADORES").filter(function(p) {
      return arqR2Text_(p.ID) === arqR2Text_(id);
    })[0] || null;
  } catch (_) {
    return null;
  }
}

function arqR2ProviderEligible_(p) {
  return !!p && arqR2Norm_(p.STATUS || "ATIVO") === "ATIVO";
}

function arqR2TargetEligible_(tipo, id) {
  tipo = arqR2Norm_(tipo);
  if (tipo === "PRESTADOR") return arqR2ProviderEligible_(arqR2ProviderById_(id));
  if (tipo === "ARQUITETO" || tipo === "FORNECEDOR") {
    return arqR2UserEligible_(arqR2CentralUser_(id,tipo),tipo);
  }
  if (tipo === "ADMIN") return true;
  return false;
}

function arqR2EligibleSupplierRefs_(refs) {
  var list = Array.isArray(refs) ? refs : String(refs || "").split(",");
  var users = arqR2CentralUsers_().filter(function(u) {
    return arqR2UserEligible_(u,"FORNECEDOR");
  });
  var ok = [], ignored = [];
  list.map(function(x){ return arqR2Text_(x); }).filter(Boolean).forEach(function(ref) {
    var low = ref.toLowerCase();
    var u = users.filter(function(x) {
      return arqR2Text_(x.ID) === ref ||
        arqR2Text_(x["E-MAIL"]).toLowerCase() === low;
    })[0];
    if (u) {
      if (ok.indexOf(arqR2Text_(u.ID)) < 0) ok.push(arqR2Text_(u.ID));
    } else {
      ignored.push(ref);
    }
  });
  return {ok:ok,ignored:ignored};
}

function arqR2FilterSearchResults_(arr) {
  return (Array.isArray(arr) ? arr : []).filter(function(x) {
    var tipo = arqR2Norm_(x.tipo || x.TIPO);
    var id = arqR2Text_(x.id || x.ID || x["USUARIO ID"] || x["PRESTADOR ID"]);
    if (tipo === "ARQUITETO" || tipo === "FORNECEDOR" || tipo === "PRESTADOR") {
      return arqR2TargetEligible_(tipo,id);
    }
    return true;
  });
}

/* ---------- superfícies públicas ARQ4 ---------- */

function arqR2PublicProfile_(dados) {
  var tipo = arqR2Norm_(dados.tipo), id = arqR2Text_(dados.id);
  if (!arqR2TargetEligible_(tipo,id)) {
    return arqR2Reply_({sucesso:false,mensagem:"Perfil não encontrado ou indisponível."});
  }
  return publicProfileARQ4(tipo,id);
}

function arqR2GlobalSearch_(dados) {
  var raw = buscaGlobalARQ4(dados.token,dados.q,dados.limite);
  var payload = arqR2Payload_(raw);
  if (!payload) return raw;
  payload.resultados = arqR2FilterSearchResults_(payload.resultados || []);
  payload.total = payload.resultados.length;
  return arqR2Reply_(payload);
}

function arqR2PublicStats_() {
  var raw = publicStatsARQ4();
  var payload = arqR2Payload_(raw);
  if (!payload || !payload.estatisticas) return raw;
  var users = arqR2CentralUsers_().filter(function(u){ return arqR2UserEligible_(u); });
  payload.estatisticas.arquitetos = users.filter(function(u){ return arqR2Norm_(u.TIPO)==="ARQUITETO"; }).length;
  payload.estatisticas.fornecedores = users.filter(function(u){ return arqR2Norm_(u.TIPO)==="FORNECEDOR"; }).length;
  try {
    var products=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS))
      .filter(function(p){return ["APROVADO","PUBLICADO","ATIVO"].indexOf(arqR2Norm_(p.STATUS))>=0;})
      .filter(arqR2ProductSupplierEligible_);
    payload.estatisticas.produtos=products.length;
  } catch (_) {}
  return arqR2Reply_(payload);
}

function arqR2PublicReviews_(dados) {
  try {
    var maximo = Math.max(1,Math.min(12,Number(dados.limite||6)));
    var users = arqR2CentralUsers_(), map = {};
    users.forEach(function(u){
      if (arqR2UserEligible_(u)) map[arqR2Text_(u.ID)] = u;
    });
    var rows = (typeof arq3Registros==="function" ? arq3Registros("AVALIACOES") : [])
      .filter(function(r){
        var id=arqR2Text_(r["AVALIADO ID"]);
        return arqR2Norm_(r.STATUS)==="PUBLICADA" && arqR2Text_(r.COMENTARIO) && !!map[id];
      })
      .sort(function(a,b){return new Date(b.DATA||0)-new Date(a.DATA||0);})
      .slice(0,maximo)
      .map(function(r){
        var u=map[arqR2Text_(r["AVALIADO ID"])]||{};
        return {
          id:r.ID,
          nome:u.EMPRESA||u.NOME||"Profissional verificado",
          tipo:r["AVALIADO TIPO"]||u.TIPO||"PROFISSIONAL",
          nota:Number(r["NOTA GERAL"]||0),
          comentario:arqR2Text_(r.COMENTARIO).slice(0,600),
          data:r.DATA
        };
      });
    return arqR2Reply_({sucesso:true,avaliacoes:rows,total:rows.length});
  } catch (e) {
    return arqR2Reply_({sucesso:false,mensagem:"Não foi possível carregar as avaliações públicas."});
  }
}

/* ---------- marketplace / produtos ---------- */

function arqR2ProductSupplierEligible_(p) {
  var sid = arqR2Text_(p && (p["FORNECEDOR ID"] || p.FORNECEDOR_ID || p.fornecedorId));
  if (!sid) return true; // curadoria/legado sem fornecedor associado
  return arqR2TargetEligible_("FORNECEDOR",sid);
}

function arqR2Products_(dados) {
  var raw = listarProdutosARQ(dados.token,{
    q:dados.q,categoria:dados.categoria,marca:dados.marca,regiao:dados.regiao,
    disponibilidade:dados.disponibilidade,fornecedor:dados.fornecedor,ordenacao:dados.ordenacao
  });
  var payload = arqR2Payload_(raw);
  if (!payload) return raw;
  var actor = null;
  try { actor = typeof arq3Ator==="function" ? arq3Ator(dados.token) : null; } catch (_) {}
  if (!(actor && actor.admin)) {
    payload.produtos = (payload.produtos || []).filter(arqR2ProductSupplierEligible_);
  }
  return arqR2Reply_(payload);
}

function arqR2Product_(dados) {
  var raw = obterProdutoARQ(dados.token,dados.id), payload = arqR2Payload_(raw);
  if (!payload || !payload.sucesso || !payload.produto) return raw;
  var actor = null;
  try { actor = typeof arq3Ator==="function" ? arq3Ator(dados.token) : null; } catch (_) {}
  if (!(actor && actor.admin) && !arqR2ProductSupplierEligible_(payload.produto)) {
    return arqR2Reply_({sucesso:false,mensagem:"Produto indisponível."});
  }
  return arqR2Reply_(payload);
}

function arqR2Contacts_(dados) {
  var raw = listarContatosARQ(dados.token), payload = arqR2Payload_(raw);
  if (!payload) return raw;
  var actor = null;
  try { actor = typeof arq3Ator==="function" ? arq3Ator(dados.token) : null; } catch (_) {}
  if (!(actor && actor.admin)) {
    payload.contatos = (payload.contatos || []).filter(function(x){
      return arqR2TargetEligible_(x.TIPO||x.tipo,x.ID||x.id);
    });
    payload.total = payload.contatos.length;
  }
  return arqR2Reply_(payload);
}

function arqR2ConversationCreate_(dados) {
  var actor = typeof arq3Ator==="function" ? arq3Ator(dados.token) : null;
  if (!actor) return arqR2Reply_({sucesso:false,autorizado:false,mensagem:"Sessão inválida ou expirada."});
  if (!actor.admin) {
    var a=arqR2Text_(dados.participanteAId),b=arqR2Text_(dados.participanteBId),other=a===actor.id?b:a;
    var target=arqR2CentralUser_(other,"");
    if (!target || !arqR2UserEligible_(target)) {
      return arqR2Reply_({sucesso:false,autorizado:false,mensagem:"O contato está indisponível."});
    }
  }
  return criarConversaARQ(dados.token,dados);
}

/* ---------- busca inteligente / rede / mapa ---------- */

function arqR2SmartSearch_(dados) {
  var raw = (typeof arq8Search === "function") ? arq8Search(dados) :
    ((typeof a10SmartSearch === "function") ? a10SmartSearch(dados) : null);
  if (!raw) return null;
  var payload = arqR2Payload_(raw);
  if (!payload) return raw;
  payload.resultados = arqR2FilterSearchResults_(payload.resultados || []);
  return arqR2Reply_(payload);
}

function arqR2Map_(dados) {
  if (typeof a10Map !== "function") return null;
  var raw = a10Map(dados), payload = arqR2Payload_(raw);
  if (!payload) return raw;
  payload.itens = arqR2FilterSearchResults_(payload.itens || []);
  return arqR2Reply_(payload);
}

function arqR2Recommendations_(dados) {
  if (typeof a10Actor !== "function" || typeof a10Recommendations !== "function") return null;
  var actor = a10Actor(dados.token);
  var raw = a10Recommendations(actor,dados), payload = arqR2Payload_(raw);
  if (!payload) return raw;
  payload.recomendacoes = arqR2FilterSearchResults_(payload.recomendacoes || []);
  return arqR2Reply_(payload);
}

function arqR2ProfileIntel_(dados) {
  var tipo = arqR2Norm_(dados.tipo), id = arqR2Text_(dados.id);
  if (!arqR2TargetEligible_(tipo,id)) {
    return arqR2Reply_({sucesso:false,mensagem:"Perfil não encontrado ou indisponível."});
  }
  return typeof a10ProfileIntel === "function" ? a10ProfileIntel(dados) : null;
}

function arqR2ProductIntel_(dados) {
  if (typeof a10ProductIntel !== "function") return null;
  var raw = a10ProductIntel(dados), payload = arqR2Payload_(raw);
  if (!payload) return raw;
  payload.fornecedoresAlternativos = (payload.fornecedoresAlternativos || []).filter(function(x) {
    return arqR2TargetEligible_("FORNECEDOR",x.id || x.ID);
  });
  return arqR2Reply_(payload);
}

function arqR2Connections_(dados) {
  if (typeof a10Actor !== "function" || typeof a10Connections !== "function") return null;
  var actor = a10Actor(dados.token);
  var raw = a10Connections(actor), payload = arqR2Payload_(raw);
  if (!payload) return raw;
  payload.conexoes = (payload.conexoes || []).filter(function(x) {
    var tipo = x.TIPO || x.tipo;
    var alvo = x["ALVO ID"] || x.alvoId || x.ID_ALVO || x.idAlvo || "";
    if (!alvo && x.URL) {
      var m = String(x.URL).match(/[?&]id=([^&#]+)/i);
      if (m) {
        try { alvo = decodeURIComponent(m[1]); } catch (_) { alvo = m[1]; }
      }
    }
    return alvo ? arqR2TargetEligible_(tipo,alvo) : true;
  });
  return arqR2Reply_(payload);
}

/* ---------- feed ---------- */

function arqR2Feed_(dados) {
  if (typeof arq6PublicFeed !== "function") return null;
  var raw = arq6PublicFeed(dados.token), payload = arqR2Payload_(raw);
  if (!payload) return raw;
  payload.posts = (payload.posts || []).filter(function(p) {
    var tipo = arqR2Norm_(p["AUTOR TIPO"] || p.autorTipo || p.tipoAutor);
    var id = arqR2Text_(p["AUTOR ID"] || p.autorId || p.usuarioId);
    if (tipo === "ADMIN") return true;
    return arqR2TargetEligible_(tipo,id);
  }).map(function(p){
    if (Array.isArray(p.comentarios)) {
      p.comentarios = p.comentarios.filter(function(c){
        var tipo=arqR2Norm_(c["USUARIO TIPO"]||c.usuarioTipo||c.tipoUsuario);
        var id=arqR2Text_(c["USUARIO ID"]||c.usuarioId);
        return tipo==="ADMIN" || arqR2TargetEligible_(tipo,id);
      });
      p.comentariosTotal = p.comentarios.length;
    }
    return p;
  });
  payload.total = payload.posts.length;
  return arqR2Reply_(payload);
}

function arqR2Trending_(dados) {
  if (typeof a10Trending!=="function") return null;
  var raw=a10Trending(dados),payload=arqR2Payload_(raw);
  if(!payload)return raw;
  payload.itens=(payload.itens||[]).filter(function(x){
    var tipo=arqR2Norm_(x.tipo||x.TIPO),id=arqR2Text_(x.id||x.ID);
    return ["ARQUITETO","FORNECEDOR","PRESTADOR"].indexOf(tipo)<0 || arqR2TargetEligible_(tipo,id);
  });
  return arqR2Reply_(payload);
}

function arqR2Recent_(dados) {
  if (typeof arq9RecentList!=="function") return null;
  var raw=arq9RecentList(dados.token,dados.limite),payload=arqR2Payload_(raw);
  if(!payload)return raw;
  payload.itens=(payload.itens||[]).filter(function(x){
    var tipo=arqR2Norm_(x.TIPO||x.tipo),id=arqR2Text_(x["REGISTRO ID"]||x.registroId||x.id);
    return ["ARQUITETO","FORNECEDOR","PRESTADOR"].indexOf(tipo)<0 || arqR2TargetEligible_(tipo,id);
  });
  payload.total=payload.itens.length;
  return arqR2Reply_(payload);
}

/* ---------- distribuição/admin ---------- */

function arqR2DistributeProject_(dados) {
  var checked = arqR2EligibleSupplierRefs_(dados.fornecedores);
  if (!checked.ok.length) {
    return arqR2Reply_({
      sucesso:false,
      autorizado:true,
      codigo:"FORNECEDOR_INDISPONIVEL",
      mensagem:"Nenhum fornecedor ATIVO e APROVADO foi selecionado.",
      ignorados:checked.ignored
    });
  }
  var raw = distribuirProjetoV4(dados.token,dados.projetoId||dados.idProjeto,checked.ok);
  var payload = arqR2Payload_(raw);
  if (!payload) return raw;
  payload.fornecedoresIgnorados = checked.ignored;
  if (checked.ignored.length) {
    payload.aviso = checked.ignored.length+" seleção(ões) foram ignoradas por não estarem ATIVAS e APROVADAS.";
  }
  return arqR2Reply_(payload);
}

function arqR2ProjectSupplierMessage_(dados) {
  var ref = arqR2Text_(dados.fornecedorId || dados.fornecedorEmail);
  var checked = arqR2EligibleSupplierRefs_([ref]);
  if (!checked.ok.length) {
    return arqR2Reply_({
      sucesso:false,
      autorizado:true,
      codigo:"FORNECEDOR_INDISPONIVEL",
      mensagem:"O fornecedor está inativo, excluído, bloqueado, não aprovado ou não existe."
    });
  }
  dados.fornecedorId = checked.ok[0];
  return enviarInformacaoProjetoFornecedorV4(dados.token,dados);
}

/* ---------- teste seguro da rodada 2 ---------- */

function testarFiltrosRodada2ARQSELECT() {
  var users = arqR2CentralUsers_();
  var resumo = {
    totalUsuarios:users.length,
    publicosElegiveis:users.filter(function(u){return arqR2UserEligible_(u);}).length,
    fornecedoresElegiveis:users.filter(function(u){return arqR2UserEligible_(u,"FORNECEDOR");}).length,
    arquitetosElegiveis:users.filter(function(u){return arqR2UserEligible_(u,"ARQUITETO");}).length,
    inativosOuExcluidos:users.filter(function(u){return arqR2Norm_(u.STATUS||"ATIVO")!=="ATIVO";}).length,
    pendentesOuRecusados:users.filter(function(u){return arqR2Norm_(u["STATUS APROVACAO"]||"")!=="APROVADO";}).length
  };
  Logger.log(JSON.stringify(resumo,null,2));
  return resumo;
}

/* ---------- roteador interceptador ---------- */

function rotearARQSELECTRound2(acao,dados,method) {
  acao = arqR2Text_(acao);
  dados = dados || {};
  method = arqR2Norm_(method || "GET");

  switch (acao) {
    case "portal_produtos":
      return arqR2Products_(dados);
    case "portal_produto":
      return arqR2Product_(dados);
    case "portal_contatos":
      return arqR2Contacts_(dados);
    case "portal_conversa_criar":
      if (method !== "POST") return arqR2Reply_({sucesso:false,mensagem:"Use POST para criar conversas."});
      return arqR2ConversationCreate_(dados);
    case "arq4_public_profile":
      return arqR2PublicProfile_(dados);
    case "arq4_busca_global":
      return arqR2GlobalSearch_(dados);
    case "arq4_public_stats":
      return arqR2PublicStats_();
    case "arq4_public_reviews":
      return arqR2PublicReviews_(dados);
    case "public_busca_inteligente":
      return arqR2SmartSearch_(dados);
    case "public_mapa_rede":
      return arqR2Map_(dados);
    case "public_em_alta":
      return arqR2Trending_(dados);
    case "portal_vistos_recentes":
      return arqR2Recent_(dados);
    case "portal_rede_recomendacoes":
      return arqR2Recommendations_(dados);
    case "public_perfil_inteligencia":
      return arqR2ProfileIntel_(dados);
    case "public_produto_inteligencia":
      return arqR2ProductIntel_(dados);
    case "portal_conexoes":
      return arqR2Connections_(dados);
    case "public_feed":
      return arqR2Feed_(dados);
    case "admin_v4_projeto_enviar_fornecedor":
      if (method !== "POST") return arqR2Reply_({sucesso:false,autorizado:true,mensagem:"Use POST para distribuir projetos."});
      return arqR2DistributeProject_(dados);
    case "admin_v4_projeto_informacao_fornecedor":
      if (method !== "POST") return arqR2Reply_({sucesso:false,autorizado:true,mensagem:"Use POST para enviar informações."});
      return arqR2ProjectSupplierMessage_(dados);
    default:
      return null;
  }
}
