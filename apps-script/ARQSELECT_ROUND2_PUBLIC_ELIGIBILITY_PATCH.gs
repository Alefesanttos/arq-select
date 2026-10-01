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
  return arqR2Reply_(payload);
}

function arqR2PublicReviews_(dados) {
  var raw = publicReviewsARQ4(dados.limite);
  var payload = arqR2Payload_(raw);
  if (!payload) return raw;
  var eligible = {};
  arqR2CentralUsers_().forEach(function(u){
    if (arqR2UserEligible_(u)) eligible[arqR2Text_(u.ID)] = true;
  });
  payload.avaliacoes = (payload.avaliacoes || []).filter(function(r) {
    var id = arqR2Text_(r.avaliadoId || r["AVALIADO ID"] || r.usuarioId || r.idUsuario);
    // versões antigas não expõem avaliadoId no payload; nesses casos a filtragem
    // completa deve ser feita na função original. Não removemos dados sem referência.
    return !id || !!eligible[id];
  });
  payload.total = payload.avaliacoes.length;
  return arqR2Reply_(payload);
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
    return arqR2TargetEligible_(x.TIPO || x.tipo, x["ALVO ID"] || x.alvoId || x.ID_ALVO || x.idAlvo || x.id);
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
  });
  payload.total = payload.posts.length;
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
