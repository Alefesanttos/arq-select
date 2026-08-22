/************************************************************
 * ARQSELECT — CRM PREMIUM
 * GOOGLE APPS SCRIPT — Code.gs
 *
 * VERSÃO:
 * CRM + PROJETOS + ORÇAMENTOS + LEADS + CLIENTES
 * ARQUITETOS + FORNECEDORES + FOLLOW-UP + AGENDA
 * DASHBOARD + LOGS + AUDITORIA + CACHE + SESSÃO
 * VERSIONAMENTO + SINCRONIZAÇÃO + API GET/POST
 *
 * COMPATIBILIDADE:
 * - admin.html
 * - arquitetos.html
 * - fornecedores
 * - formulários existentes
 * - Google Sheets
 * - Google Drive
 * - Web App Apps Script
 ************************************************************/


/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

const CONFIG = {

  /* ========================================================
     GOOGLE SHEETS
  ======================================================== */

  SPREADSHEET_ID:
    "1Jh9KmMV3y7xasmxNFI6fMdSO4v7F9v_jkHIFkcE96Kc",

  SHEET_NAME:
    "PROJETOS",


  /* ========================================================
     GOOGLE DRIVE
  ======================================================== */

  DRIVE_FOLDER_NAME:
    "ARQSELECT - PROJETOS",


  /* ========================================================
     LOGIN ADMINISTRATIVO
  ======================================================== */

  ADMIN_USERNAME:
    "alefesantos27",

  ADMIN_PASSWORD:
    "@Sucesso01",


  /* ========================================================
     SESSÃO
  ======================================================== */

  SESSION_HOURS:
    6,


  /* ========================================================
     CACHE
  ======================================================== */

  CACHE_SECONDS:
    120,

  DASHBOARD_CACHE_SECONDS:
    60,

  SEARCH_CACHE_SECONDS:
    60,


  /* ========================================================
     SISTEMA
  ======================================================== */

  SYSTEM_NAME:
    "ARQSELECT CRM",

  SYSTEM_VERSION:
    "3.0.0"

};


/* ==========================================================
   STATUS EXISTENTES — NÃO REMOVER
========================================================== */

const STATUS_VALIDOS = [

  // Status exibidos no painel — mantidos em formato humano
  "Novo",
  "Em análise",
  "Orçamento",
  "Proposta enviada",
  "Negociação",
  "Aprovação",
  "Fechado",
  "Em execução",
  "Concluído",
  "Cancelado",

  // Compatibilidade com registros/integrações existentes
  "NOVO",
  "EM_ANÁLISE",
  "ORÇAMENTO",
  "PROPOSTA_ENVIADA",
  "NEGOCIAÇÃO",
  "APROVAÇÃO",
  "FECHADO",
  "EM_EXECUÇÃO",
  "CONCLUÍDO",
  "CANCELADO"

];


/* ==========================================================
   STATUS CRM — NOVOS
========================================================== */

const STATUS_PROJETO_CRM = [

  "NOVO",
  "EM_ANÁLISE",
  "ORÇAMENTO",
  "PROPOSTA_ENVIADA",
  "NEGOCIAÇÃO",
  "APROVAÇÃO",
  "FECHADO",
  "EM_EXECUÇÃO",
  "CONCLUÍDO",
  "CANCELADO"

];


const STATUS_ORCAMENTO = [

  "RASCUNHO",
  "ENVIADO",
  "VISUALIZADO",
  "NEGOCIAÇÃO",
  "APROVADO",
  "RECUSADO",
  "EXPIRADO"

];


const STATUS_LEAD = [

  "NOVO",
  "CONTATADO",
  "EM_NEGOCIAÇÃO",
  "PROPOSTA_ENVIADA",
  "AGUARDANDO_RETORNO",
  "FECHADO",
  "PERDIDO",
  "ARQUIVADO"

];


/* ==========================================================
   PREFIXOS
========================================================== */

const SESSION_PREFIX =
  "ARQSELECT_SESSION_";

const CACHE_PREFIX =
  "ARQSELECT_CACHE_";

const PROP_VERSION =
  "ARQSELECT_DATA_VERSION";

const PROP_COUNTER_PREFIX =
  "ARQSELECT_COUNTER_";


/* ==========================================================
   NOMES DAS ABAS CRM
========================================================== */

const CRM_SHEETS = {

  LEADS:
    "CRM - LEADS",

  CLIENTES:
    "CRM - CLIENTES",

  ARQUITETOS:
    "CRM - ARQUITETOS",

  FORNECEDORES:
    "ARQSELECT – FORNECEDORES",

  PROJETOS:
    "PROJETOS",

  ORCAMENTOS:
    "CRM - ORÇAMENTOS",

  FOLLOWUPS:
    "CRM - FOLLOW-UPS",

  AGENDA:
    "CRM - AGENDA",

  TAREFAS:
    "CRM - TAREFAS",

  LOGS:
    "CRM - LOGS",

  NOTIFICACOES:
    "CRM - NOTIFICAÇÕES"

};


/* ==========================================================
   CABEÇALHOS CRM
========================================================== */

const CRM_HEADERS = {

  LEADS: [

    "ID",
    "NOME",
    "EMPRESA",
    "TELEFONE",
    "WHATSAPP",
    "E-MAIL",
    "ORIGEM",
    "INTERESSE",
    "PRODUTO",
    "VALOR ESTIMADO",
    "STATUS",
    "RESPONSÁVEL",
    "PRIORIDADE",
    "DATA DE CRIAÇÃO",
    "ÚLTIMA INTERAÇÃO",
    "PRÓXIMO FOLLOW-UP",
    "OBSERVAÇÕES",
    "TAGS",
    "DATA DE ATUALIZAÇÃO"

  ],

  CLIENTES: [

    "ID",
    "NOME",
    "EMPRESA",
    "CPF/CNPJ",
    "TELEFONE",
    "WHATSAPP",
    "E-MAIL",
    "CIDADE",
    "ESTADO",
    "ORIGEM",
    "RESPONSÁVEL",
    "STATUS",
    "VALOR TOTAL",
    "OBSERVAÇÕES",
    "DATA DE CRIAÇÃO",
    "DATA DE ATUALIZAÇÃO"

  ],

  ARQUITETOS: [

    "ID",
    "NOME",
    "ESCRITÓRIO",
    "CAU",
    "TELEFONE",
    "WHATSAPP",
    "E-MAIL",
    "CIDADE",
    "ESTADO",
    "PROJETOS",
    "OPORTUNIDADES",
    "ORÇAMENTOS",
    "STATUS",
    "ÚLTIMA INTERAÇÃO",
    "PRÓXIMO CONTATO",
    "OBSERVAÇÕES",
    "DATA DE CRIAÇÃO",
    "DATA DE ATUALIZAÇÃO"

  ],

  ORCAMENTOS: [

    "ID",
    "NÚMERO",
    "PROJETO ID",
    "CLIENTE",
    "ARQUITETO",
    "RESPONSÁVEL",
    "PRODUTOS",
    "SERVIÇOS",
    "QUANTIDADE",
    "PREÇO UNITÁRIO",
    "DESCONTO",
    "SUBTOTAL",
    "VALOR TOTAL",
    "CONDIÇÃO DE PAGAMENTO",
    "VALIDADE",
    "STATUS",
    "OBSERVAÇÕES",
    "DATA DE CRIAÇÃO",
    "DATA DE ATUALIZAÇÃO"

  ],

  FOLLOWUPS: [

    "ID",
    "LEAD ID",
    "CLIENTE ID",
    "PROJETO ID",
    "RESPONSÁVEL",
    "TIPO",
    "DATA",
    "HORÁRIO",
    "OBSERVAÇÃO",
    "RESULTADO",
    "PRÓXIMO CONTATO",
    "STATUS",
    "DATA DE CRIAÇÃO",
    "DATA DE ATUALIZAÇÃO"

  ],

  AGENDA: [

    "ID",
    "TIPO",
    "DATA",
    "HORÁRIO",
    "RESPONSÁVEL",
    "CLIENTE",
    "PROJETO",
    "DESCRIÇÃO",
    "STATUS",
    "PRIORIDADE",
    "DATA DE CRIAÇÃO",
    "DATA DE ATUALIZAÇÃO"

  ],

  TAREFAS: [

    "ID",
    "TÍTULO",
    "DESCRIÇÃO",
    "RESPONSÁVEL",
    "CLIENTE",
    "PROJETO",
    "PRAZO",
    "PRIORIDADE",
    "STATUS",
    "DATA DE CRIAÇÃO",
    "DATA DE ATUALIZAÇÃO"

  ],

  LOGS: [

    "ID",
    "DATA",
    "USUÁRIO",
    "AÇÃO",
    "MÓDULO",
    "REGISTRO",
    "VALOR ANTERIOR",
    "VALOR NOVO",
    "IP/ORIGEM",
    "DETALHES"

  ],

  NOTIFICACOES: [

    "ID",
    "DATA",
    "USUÁRIO",
    "TIPO",
    "TÍTULO",
    "MENSAGEM",
    "REGISTRO",
    "LIDA",
    "DATA DE LEITURA"

  ]

};


/* ==========================================================
   GET
========================================================== */

function doGet(e) {

  try {

    const params =
      e &&
      e.parameter
        ? e.parameter
        : {};

    const acao =
      String(
        params.acao ||
        params.action ||
        "teste"
      ).trim();


    /* ======================================================
       TESTE
    ====================================================== */

    if (
      acao === "teste" ||
      acao === "test"
    ) {

      return respostaJSON({

        sucesso: true,
        autorizado: true,
        sistema: "ARQSELECT",
        servidor: "online",
        versao: CONFIG.SYSTEM_VERSION,
        mensagem:
          "API ARQSELECT funcionando corretamente.",
        horario:
          new Date().toISOString()

      });

    }


    /* ======================================================
       LOGIN
    ====================================================== */

    if (
      acao === "login" ||
      acao === "login_admin"
    ) {

      return loginAdmin({

        usuario:
          params.usuario ||
          params.username ||
          params.user,

        senha:
          params.senha ||
          params.password ||
          params.pass

      });

    }


    /* ======================================================
       PORTAL — ARQUITETO / FORNECEDOR
    ====================================================== */
    if (acao === "login_arquiteto") {
      return loginPortalUsuario({
        tipo: "ARQUITETO",
        email: params.email,
        senha: params.senha || params.password
      });
    }

    if (acao === "login_fornecedor") {
      return loginPortalUsuario({
        tipo: "FORNECEDOR",
        email: params.email,
        senha: params.senha || params.password
      });
    }

    if (acao === "portal_sessao") {
      return validarSessaoPortal({ token: params.token });
    }

    if (acao === "portal_dashboard") {
      return obterDashboardPortal(params.token);
    }


    /* ======================================================
       SESSÃO
    ====================================================== */

    if (
      acao === "sessao" ||
      acao === "validar_sessao_admin"
    ) {

      return validarSessaoAdmin({

        token:
          params.token

      });

    }


    /* ======================================================
       LOGOUT
    ====================================================== */

    if (
      acao === "logout" ||
      acao === "logout_admin"
    ) {

      return logoutAdmin({

        token:
          params.token

      });

    }


    /* ======================================================
       PROJETOS — COMPATIBILIDADE
    ====================================================== */

    if (
      acao === "projetos"
    ) {

      exigirSessao(
        params.token
      );

      return obterProjetos();

    }


    /* ======================================================
       PROJETO
    ====================================================== */

    if (
      acao === "projeto"
    ) {

      exigirSessao(
        params.token
      );

      return obterProjeto(
        params.id
      );

    }


    /* ======================================================
       ATUALIZAR STATUS — EXISTENTE
    ====================================================== */

    if (
      acao === "atualizarStatus"
    ) {

      exigirSessao(
        params.token
      );

      return atualizarStatus(

        params.linha,

        params.status

      );

    }


    /* ======================================================
       SINCRONIZAÇÃO
    ====================================================== */

    if (
      acao === "sincronizar" ||
      acao === "sync"
    ) {

      exigirSessao(
        params.token
      );

      return sincronizarCRM(
        params.versao
      );

    }


    /* ======================================================
       DASHBOARD
    ====================================================== */

    if (
      acao === "dashboard"
    ) {

      exigirSessao(
        params.token
      );

      return obterDashboard();

    }


    /* ======================================================
       BUSCA GLOBAL
    ====================================================== */

    if (
      acao === "buscar" ||
      acao === "busca_global"
    ) {

      exigirSessao(
        params.token
      );

      return buscaGlobal(
        params.q
      );

    }


    /* ======================================================
       LISTAR MÓDULO
    ====================================================== */

    if (
      acao === "listar"
    ) {

      exigirSessao(
        params.token
      );

      return listarModulo(
        params.modulo,
        params.limite,
        params.pagina
      );

    }


    /* ======================================================
       GET BY ID
    ====================================================== */

    if (
      acao === "getById"
    ) {

      exigirSessao(
        params.token
      );

      return obterRegistroModulo(
        params.modulo,
        params.id
      );

    }


    /* ======================================================
       PORTAL PREMIUM — PROJETOS / STATUS
    ====================================================== */
    if (acao === "portal_projetos") return obterProjetosPortalSeguro(params.token);
    if (acao === "portal_atualizar_status") return atualizarStatusPortalSeguro(params.token, params.id, params.status);

    /* ======================================================
       STATUS
    ====================================================== */

    if (
      acao === "status"
    ) {

      exigirSessao(
        params.token
      );

      return obterStatusSistema();

    }


    return respostaJSON({

      sucesso: false,
      autorizado: false,
      mensagem:
        "Ação não encontrada.",
      acao:
        acao

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "doGet"
    );

    return respostaJSON({

      sucesso: false,
      autorizado: false,
      error: true,
      mensagem:
        obterMensagemErro(
          erro
        ),
      timestamp:
        new Date().toISOString()

    });

  }

}


/* ==========================================================
   POST
========================================================== */

function doPost(e) {

  try {

    const dados =
      obterParametrosPost(e);


    const acao =
      String(

        dados.acao ||
        dados.action ||
        ""

      ).trim();


    /* ======================================================
       TESTE
    ====================================================== */

    if (
      acao === "teste" ||
      acao === "test"
    ) {

      return respostaJSON({

        sucesso: true,
        autorizado: true,
        sistema: "ARQSELECT",
        servidor: "online",
        versao:
          CONFIG.SYSTEM_VERSION,
        mensagem:
          "API ARQSELECT funcionando corretamente.",
        horario:
          new Date().toISOString()

      });

    }


    /* ======================================================
       LOGIN
    ====================================================== */

    if (
      acao === "login" ||
      acao === "login_admin"
    ) {

      return loginAdmin(
        dados
      );

    }


    /* ======================================================
       SESSÃO
    ====================================================== */

    if (
      acao === "sessao" ||
      acao === "validar_sessao_admin"
    ) {

      return validarSessaoAdmin(
        dados
      );

    }


    /* ======================================================
       LOGOUT
    ====================================================== */

    if (
      acao === "logout" ||
      acao === "logout_admin"
    ) {

      return logoutAdmin(
        dados
      );

    }


    /* ======================================================
       TESTE ADMIN
    ====================================================== */

    if (
      acao === "admin_teste"
    ) {

      exigirSessao(
        dados.token
      );

      return respostaJSON({

        sucesso: true,
        autorizado: true,
        mensagem:
          "API administrativa funcionando corretamente."

      });

    }


    /* ======================================================
       LISTAR PROJETOS
    ====================================================== */

    if (
      acao === "projetos"
    ) {

      exigirSessao(
        dados.token
      );

      return obterProjetos();

    }


    /* ======================================================
       BUSCAR PROJETO
    ====================================================== */

    if (
      acao === "projeto"
    ) {

      exigirSessao(
        dados.token
      );

      return obterProjeto(
        dados.id
      );

    }


    /* ======================================================
       ATUALIZAR STATUS
    ====================================================== */

    if (
      acao === "atualizarStatus"
    ) {

      exigirSessao(
        dados.token
      );

      return atualizarStatus(

        dados.linha,

        dados.status

      );

    }


    /* ======================================================
       SINCRONIZAR
    ====================================================== */

    if (
      acao === "sincronizar" ||
      acao === "sync"
    ) {

      exigirSessao(
        dados.token
      );

      return sincronizarCRM(
        dados.versao
      );

    }


    /* ======================================================
       DASHBOARD
    ====================================================== */

    if (
      acao === "dashboard"
    ) {

      exigirSessao(
        dados.token
      );

      return obterDashboard();

    }


    /* ======================================================
       BUSCA GLOBAL
    ====================================================== */

    if (
      acao === "buscar" ||
      acao === "busca_global"
    ) {

      exigirSessao(
        dados.token
      );

      return buscaGlobal(
        dados.q
      );

    }


    /* ======================================================
       CRIAR REGISTRO CRM
    ====================================================== */

    if (
      acao === "criar" ||
      acao === "create"
    ) {

      exigirSessao(
        dados.token
      );

      return criarRegistroModulo(
        dados.modulo,
        dados
      );

    }


    /* ======================================================
       ATUALIZAR REGISTRO CRM
    ====================================================== */

    if (
      acao === "atualizar" ||
      acao === "update"
    ) {

      exigirSessao(
        dados.token
      );

      return atualizarRegistroModulo(
        dados.modulo,
        dados.id,
        dados
      );

    }


    /* ======================================================
       EXCLUIR
    ====================================================== */

    if (
      acao === "excluir" ||
      acao === "delete"
    ) {

      exigirSessao(
        dados.token
      );

      return excluirRegistroModulo(
        dados.modulo,
        dados.id
      );

    }


    /* ======================================================
       ARQUIVAR
    ====================================================== */

    if (
      acao === "arquivar" ||
      acao === "archive"
    ) {

      exigirSessao(
        dados.token
      );

      return arquivarRegistroModulo(
        dados.modulo,
        dados.id
      );

    }


    /* ======================================================
       RESTAURAR
    ====================================================== */

    if (
      acao === "restaurar" ||
      acao === "restore"
    ) {

      exigirSessao(
        dados.token
      );

      return restaurarRegistroModulo(
        dados.modulo,
        dados.id
      );

    }


    /* ======================================================
       PORTAL PREMIUM — PROJETOS / STATUS
    ====================================================== */
    if (acao === "portal_projetos") return obterProjetosPortalSeguro(dados.token);
    if (acao === "portal_atualizar_status") return atualizarStatusPortalSeguro(dados.token, dados.id, dados.status);

    /* ======================================================
       PORTAL — CADASTRO / LOGIN / DASHBOARD
    ====================================================== */
    if (acao === "cadastrar_arquiteto") {
      return cadastrarPortalUsuario(dados, "ARQUITETO");
    }

    if (acao === "cadastrar_fornecedor") {
      return cadastrarPortalUsuario(dados, "FORNECEDOR");
    }

    if (acao === "login_arquiteto") {
      return loginPortalUsuario({ tipo:"ARQUITETO", email:dados.email, senha:dados.senha || dados.password });
    }

    if (acao === "login_fornecedor") {
      return loginPortalUsuario({ tipo:"FORNECEDOR", email:dados.email, senha:dados.senha || dados.password });
    }

    if (acao === "portal_dashboard") {
      return obterDashboardPortal(dados.token);
    }

    if (acao === "portal_logout") {
      return logoutPortal(dados.token);
    }

    /* ======================================================
       RECEBER ARQUITETO
    ====================================================== */

    if (
      String(
        dados.tipo_cadastro || ""
      ).toLowerCase() ===
      "arquiteto"
    ) {

      return receberProjetoArquiteto(
        dados
      );

    }


    /* ======================================================
       RECEBER FORNECEDOR
    ====================================================== */

    if (
      String(
        dados.tipo_cadastro || ""
      ).toLowerCase() ===
      "fornecedor"
    ) {

      return receberFornecedor(
        dados
      );

    }


    /* ======================================================
       COMPATIBILIDADE
    ====================================================== */

    if (
      dados.tipo ===
      "solicitacao_orcamento"
    ) {

      return receberProjetoArquiteto(
        dados
      );

    }


    return respostaJSON({

      sucesso: false,
      autorizado: false,
      mensagem:
        "Ação não reconhecida."

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "doPost"
    );

    return respostaJSON({

      sucesso: false,
      autorizado: false,
      error: true,
      mensagem:
        obterMensagemErro(
          erro
        ),
      timestamp:
        new Date().toISOString()

    });

  }

}


/* ==========================================================
   PARÂMETROS POST
========================================================== */

function obterParametrosPost(e) {

  if (
    e &&
    e.parameter &&
    Object.keys(
      e.parameter
    ).length > 0
  ) {

    const resultado = {};

    Object.keys(
      e.parameter
    ).forEach(
      function(chave) {

        resultado[chave] =
          e.parameter[chave];

      }
    );

    return resultado;

  }


  if (
    e &&
    e.postData &&
    e.postData.contents
  ) {

    const conteudo =
      String(
        e.postData.contents
      );


    if (
      conteudo.trim() !== ""
    ) {

      try {

        const json =
          JSON.parse(
            conteudo
          );


        if (
          json &&
          typeof json ===
          "object"
        ) {

          return json;

        }

      }

      catch (erroJSON) {

        // continua

      }


      return parseFormUrlEncoded(
        conteudo
      );

    }

  }


  return {};

}


/* ==========================================================
   PARSER FORM URLENCODED
========================================================== */

function parseFormUrlEncoded(
  texto
) {

  const objeto = {};


  String(
    texto || ""
  )
    .split("&")
    .forEach(
      function(par) {

        if (
          !par
        ) {

          return;

        }


        const partes =
          par.split("=");


        const chave =
          decodeURIComponent(

            (
              partes.shift() ||
              ""
            )
              .replace(
                /\+/g,
                " "
              )

          );


        const valor =
          decodeURIComponent(

            partes
              .join("=")
              .replace(
                /\+/g,
                " "
              )

          );


        objeto[chave] =
          valor;

      }
    );


  return objeto;

}


/* ==========================================================
   AUTENTICAÇÃO
========================================================== */

function loginAdmin(
  dados
) {

  try {

    dados =
      dados || {};


    const usuario =
      String(

        dados.usuario ||
        dados.username ||
        dados.user ||
        ""

      ).trim();


    const senha =
      String(

        dados.senha ||
        dados.password ||
        dados.pass ||
        ""

      );


    const usuarioValido =
      usuario ===
      CONFIG.ADMIN_USERNAME;


    const senhaValida =
      senha ===
      CONFIG.ADMIN_PASSWORD;


    if (
      !usuarioValido ||
      !senhaValida
    ) {

      registrarAuditoriaPublica(
        usuario,
        "LOGIN_FALHA",
        "AUTH",
        "",
        "",
        "",
        "Tentativa de login inválida."
      );


      return respostaJSON({

        sucesso: false,
        autorizado: false,
        mensagem:
          "Usuário ou senha inválidos."

      });

    }


    const token =
      criarSessao(
        usuario
      );


    const expiraEm =
      Date.now() +
      (
        CONFIG.SESSION_HOURS *
        60 *
        60 *
        1000
      );


    registrarAuditoriaPublica(
      usuario,
      "LOGIN",
      "AUTH",
      "",
      "",
      "",
      "Login realizado com sucesso."
    );


    return respostaJSON({

      sucesso: true,
      autorizado: true,

      token:
        token,

      usuario:
        usuario,

      perfil:
        obterPerfilUsuario(
          usuario
        ),

      permissoes:
        obterPermissoesUsuario(
          usuario
        ),

      expiraEm:
        expiraEm,

      versao:
        obterVersaoDados(),

      mensagem:
        "Login realizado com sucesso."

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "loginAdmin"
    );

    return respostaJSON({

      sucesso: false,
      autorizado: false,
      mensagem:
        "Erro ao realizar login."

    });

  }

}


/* ==========================================================
   CRIAR SESSÃO
========================================================== */

function criarSessao(
  usuario
) {

  const token =
    Utilities.getUuid() +
    "-" +
    Utilities.getUuid();


  const agora =
    Date.now();


  const expiraEm =
    agora +
    (
      CONFIG.SESSION_HOURS *
      60 *
      60 *
      1000
    );


  const sessao = {

    usuario:
      usuario,

    perfil:
      obterPerfilUsuario(
        usuario
      ),

    criadoEm:
      agora,

    expiraEm:
      expiraEm

  };


  CacheService
    .getScriptCache()
    .put(

      SESSION_PREFIX +
      token,

      JSON.stringify(
        sessao
      ),

      CONFIG.SESSION_HOURS *
      60

    );


  return token;

}


/* ==========================================================
   OBTER SESSÃO
========================================================== */

function obterSessao(
  token
) {

  if (
    !token
  ) {

    return null;

  }


  const chave =
    SESSION_PREFIX +
    String(
      token
    );


  const texto =
    CacheService
      .getScriptCache()
      .get(
        chave
      );


  if (
    !texto
  ) {

    return null;

  }


  try {

    const sessao =
      JSON.parse(
        texto
      );


    if (
      !sessao ||
      !sessao.expiraEm
    ) {

      CacheService
        .getScriptCache()
        .remove(
          chave
        );

      return null;

    }


    if (
      Date.now() >
      Number(
        sessao.expiraEm
      )
    ) {

      CacheService
        .getScriptCache()
        .remove(
          chave
        );

      return null;

    }


    return sessao;

  }

  catch (erro) {

    CacheService
      .getScriptCache()
      .remove(
        chave
      );

    return null;

  }

}


/* ==========================================================
   VALIDAR SESSÃO
========================================================== */

function validarSessaoAdmin(
  dados
) {

  dados =
    dados || {};


  const sessao =
    obterSessao(
      dados.token
    );


  if (
    !sessao
  ) {

    return respostaJSON({

      sucesso: false,
      autorizado: false,
      mensagem:
        "Sessão expirada ou inválida."

    });

  }


  return respostaJSON({

    sucesso: true,
    autorizado: true,

    usuario:
      sessao.usuario,

    perfil:
      sessao.perfil ||
      "ADMIN",

    permissoes:
      obterPermissoesUsuario(
        sessao.usuario
      ),

    criadoEm:
      sessao.criadoEm,

    expiraEm:
      sessao.expiraEm,

    versao:
      obterVersaoDados(),

    mensagem:
      "Sessão válida."

  });

}


/* ==========================================================
   EXIGIR SESSÃO
========================================================== */

function exigirSessao(
  token
) {

  const sessao =
    obterSessao(
      token
    );


  if (
    !sessao
  ) {

    throw new Error(
      "Acesso não autorizado. Faça login novamente."
    );

  }


  return sessao;

}


/* ==========================================================
   LOGOUT
========================================================== */

function logoutAdmin(
  dados
) {

  dados =
    dados || {};


  if (
    dados.token
  ) {

    const sessao =
      obterSessao(
        dados.token
      );


    CacheService
      .getScriptCache()
      .remove(

        SESSION_PREFIX +
        String(
          dados.token
        )

      );


    if (
      sessao
    ) {

      registrarAuditoriaPublica(
        sessao.usuario,
        "LOGOUT",
        "AUTH",
        "",
        "",
        "",
        "Sessão encerrada."
      );

    }

  }


  return respostaJSON({

    sucesso: true,
    autorizado: false,
    mensagem:
      "Sessão encerrada."

  });

}


/* ==========================================================
   PERFIL
========================================================== */

function obterPerfilUsuario(
  usuario
) {

  if (
    String(
      usuario || ""
    ) ===
    CONFIG.ADMIN_USERNAME
  ) {

    return "ADMIN";

  }


  return "COMERCIAL";

}


/* ==========================================================
   PERMISSÕES
========================================================== */

function obterPermissoesUsuario(
  usuario
) {

  const perfil =
    obterPerfilUsuario(
      usuario
    );


  if (
    perfil ===
    "ADMIN"
  ) {

    return [

      "TODAS",

      "CRM_VISUALIZAR",
      "CRM_CRIAR",
      "CRM_EDITAR",
      "CRM_EXCLUIR",

      "PROJETOS_VISUALIZAR",
      "PROJETOS_EDITAR",

      "ORCAMENTOS_VISUALIZAR",
      "ORCAMENTOS_EDITAR",

      "DASHBOARD",

      "LOGS",

      "CONFIGURACOES"

    ];

  }


  return [

    "CRM_VISUALIZAR",
    "CRM_CRIAR",
    "CRM_EDITAR",

    "PROJETOS_VISUALIZAR",

    "ORCAMENTOS_VISUALIZAR"

  ];

}


/* ==========================================================
   PLANILHA
========================================================== */

function obterPlanilha() {

  if (
    !CONFIG.SPREADSHEET_ID
  ) {

    throw new Error(
      "ID da planilha não configurado."
    );

  }


  try {

    return SpreadsheetApp
      .openById(
        CONFIG.SPREADSHEET_ID
      );

  }

  catch (erro) {

    throw new Error(
      "Não foi possível abrir a planilha. Verifique o ID da planilha e as permissões do Apps Script."
    );

  }

}


/* ==========================================================
   ABA PROJETOS
========================================================== */

function obterAbaProjetos() {

  const planilha =
    obterPlanilha();


  let aba =
    planilha.getSheetByName(
      CONFIG.SHEET_NAME
    );


  if (
    !aba
  ) {

    aba =
      planilha.insertSheet(
        CONFIG.SHEET_NAME
      );

    configurarCabecalhoProjetos(
      aba
    );

  }


  if (
    aba.getLastRow() === 0
  ) {

    configurarCabecalhoProjetos(
      aba
    );

  }


  return aba;

}


/* ==========================================================
   CABEÇALHO PROJETOS
========================================================== */

function configurarCabecalhoProjetos(
  aba
) {

  if (
    aba.getLastRow() > 0
  ) {

    return;

  }


  const cabecalho = [

    "ID PROJETO",
    "DATA / HORA",
    "NOME",
    "ESCRITÓRIO",
    "E-MAIL",
    "WHATSAPP",
    "CIDADE",
    "ESTADO",
    "REGISTRO PROFISSIONAL",
    "NOME DO PROJETO",
    "TIPO DE PROJETO",
    "ÁREA",
    "AMBIENTE",
    "PRAZO",
    "DESCRIÇÃO / ORÇAMENTO",
    "INVESTIMENTO",
    "OBSERVAÇÕES",
    "ARQUIVOS",
    "PASTA DO PROJETO",
    "STATUS"

  ];


  aba
    .getRange(
      1,
      1,
      1,
      cabecalho.length
    )
    .setValues([
      cabecalho
    ]);


  aba
    .getRange(
      1,
      1,
      1,
      cabecalho.length
    )
    .setFontWeight(
      "bold"
    );


  aba.setFrozenRows(
    1
  );


  aba.autoResizeColumns(
    1,
    cabecalho.length
  );

}


/* ==========================================================
   LEITURA DA PLANILHA
========================================================== */

function lerPlanilha(
  usarCache
) {

  usarCache =
    usarCache !== false;


  const cache =
    CacheService
      .getScriptCache();


  const chave =
    CACHE_PREFIX +
    "PROJETOS";


  if (
    usarCache
  ) {

    const cacheTexto =
      cache.get(
        chave
      );


    if (
      cacheTexto
    ) {

      try {

        return JSON.parse(
          cacheTexto
        );

      }

      catch (erroCache) {

        cache.remove(
          chave
        );

      }

    }

  }


  const aba =
    obterAbaProjetos();


  const ultimaLinha =
    aba.getLastRow();


  const ultimaColuna =
    aba.getLastColumn();


  if (
    ultimaLinha < 1 ||
    ultimaColuna < 1
  ) {

    return [];

  }


  const valores =
    aba
      .getRange(
        1,
        1,
        ultimaLinha,
        ultimaColuna
      )
      .getDisplayValues();


  if (
    valores.length < 1
  ) {

    return [];

  }


  const cabecalhos =
    valores[0].map(
      function(valor) {

        return String(
          valor || ""
        ).trim();

      }
    );


  const registros = [];


  for (
    let i = 1;
    i < valores.length;
    i++
  ) {

    const linha =
      valores[i];


    const projeto = {

      _linha:
        i + 1

    };


    let possuiDados =
      false;


    for (
      let c = 0;
      c < cabecalhos.length;
      c++
    ) {

      const chaveCabecalho =
        cabecalhos[c];


      if (
        !chaveCabecalho
      ) {

        continue;

      }


      const valor =
        linha[c] !== undefined
          ? linha[c]
          : "";


      projeto[chaveCabecalho] =
        valor;


      if (
        String(
          valor || ""
        ).trim() !== ""
      ) {

        possuiDados =
          true;

      }

    }


    if (
      possuiDados
    ) {

      projeto._whatsappUrl =
        extrairWhatsAppUrl(
          projeto["WHATSAPP"]
        );


      projeto._arquivos =
        extrairArquivos(
          projeto["ARQUIVOS"]
        );


      registros.push(
        projeto
      );

    }

  }


  if (
    usarCache
  ) {

    try {

      cache.put(
        chave,
        JSON.stringify(
          registros
        ),
        CONFIG.CACHE_SECONDS
      );

    }

    catch (erro) {

      // cache é opcional

    }

  }


  return registros;

}


/* ==========================================================
   INVALIDAR CACHE
========================================================== */

function invalidarCacheCRM() {

  const cache =
    CacheService
      .getScriptCache();


  cache.remove(
    CACHE_PREFIX +
    "PROJETOS"
  );


  cache.remove(
    CACHE_PREFIX +
    "DASHBOARD"
  );


  cache.remove(
    CACHE_PREFIX +
    "BUSCA"
  );

}


/* ==========================================================
   VERSIONAMENTO
========================================================== */

function obterVersaoDados() {

  const propriedades =
    PropertiesService
      .getScriptProperties();


  let versao =
    propriedades.getProperty(
      PROP_VERSION
    );


  if (
    !versao
  ) {

    versao =
      String(
        Date.now()
      );


    propriedades.setProperty(
      PROP_VERSION,
      versao
    );

  }


  return versao;

}


/* ==========================================================
   INCREMENTAR VERSÃO
========================================================== */

function incrementarVersaoDados() {

  const propriedades =
    PropertiesService
      .getScriptProperties();


  const novaVersao =
    String(
      Date.now()
    );


  propriedades.setProperty(
    PROP_VERSION,
    novaVersao
  );


  invalidarCacheCRM();


  return novaVersao;

}


/* ==========================================================
   LISTAR PROJETOS
========================================================== */

function obterProjetos() {

  const projetos =
    lerPlanilha(
      false
    );


  return respostaJSON({

    sucesso: true,
    autorizado: true,

    total:
      projetos.length,

    projetos:
      projetos,

    versao:
      obterVersaoDados(),

    atualizadoEm:
      new Date().toISOString()

  });

}


/* ==========================================================
   BUSCAR PROJETO
========================================================== */

function obterProjeto(
  id
) {

  const projetos =
    lerPlanilha(
      true
    );


  const procurado =
    String(
      id || ""
    ).trim();


  for (
    let i = 0;
    i < projetos.length;
    i++
  ) {

    const projeto =
      projetos[i];


    const idProjeto =
      String(

        projeto["ID PROJETO"] ||
        projeto["NUMERO DO PROJETO"] ||
        projeto["ID"] ||
        ""

      ).trim();


    if (
      idProjeto ===
      procurado
    ) {

      return respostaJSON({

        sucesso: true,
        autorizado: true,

        projeto:
          projeto,

        versao:
          obterVersaoDados()

      });

    }

  }


  return respostaJSON({

    sucesso: false,
    autorizado: true,

    mensagem:
      "Projeto não encontrado."

  });

}


/* ==========================================================
   NORMALIZAR STATUS DE PROJETO
   Aceita os nomes profissionais do painel e aliases antigos.
========================================================== */
function normalizarStatusProjeto(status) {

  const bruto = String(status || "").trim();
  const chave = bruto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, "_");

  const mapa = {
    "NOVO": "Novo",
    "EM_ANALISE": "Em análise",
    "ORCAMENTO": "Orçamento",
    "PROPOSTA_ENVIADA": "Proposta enviada",
    "NEGOCIACAO": "Negociação",
    "APROVACAO": "Aprovação",
    "FECHADO": "Fechado",
    "EM_EXECUCAO": "Em execução",
    "CONCLUIDO": "Concluído",
    "CANCELADO": "Cancelado"
  };

  return mapa[chave] || bruto;
}


/* ==========================================================
   ATUALIZAR STATUS — COMPATIBILIDADE TOTAL
========================================================== */

function atualizarStatus(
  linha,
  status
) {

  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);
  } catch (erroLock) {
    return respostaJSON({
      sucesso: false,
      autorizado: true,
      mensagem: "O sistema está processando outra atualização. Tente novamente."
    });
  }

  try {

  const numeroLinha =
    Number(
      linha
    );


  const novoStatus =
    normalizarStatusProjeto(status);


  if (
    !Number.isInteger(
      numeroLinha
    ) ||
    numeroLinha < 2
  ) {

    return respostaJSON({

      sucesso: false,
      autorizado: true,

      mensagem:
        "Linha do projeto inválida."

    });

  }


  if (
    STATUS_VALIDOS.indexOf(novoStatus) === -1
  ) {

    return respostaJSON({

      sucesso: false,
      autorizado: true,

      mensagem:
        "Status inválido."

    });

  }


  const aba =
    obterAbaProjetos();


  if (
    numeroLinha >
    aba.getLastRow()
  ) {

    return respostaJSON({

      sucesso: false,
      autorizado: true,

      mensagem:
        "A linha informada não existe."

    });

  }


  const ultimaColuna =
    aba.getLastColumn();


  const cabecalhos =
    aba
      .getRange(
        1,
        1,
        1,
        ultimaColuna
      )
      .getDisplayValues()[0];


  let colunaStatus =
    0;


  for (
    let i = 0;
    i < cabecalhos.length;
    i++
  ) {

    if (
      String(
        cabecalhos[i] || ""
      )
        .trim()
        .toUpperCase() ===
      "STATUS"
    ) {

      colunaStatus =
        i + 1;

      break;

    }

  }


  if (
    !colunaStatus
  ) {

    throw new Error(
      "A coluna STATUS não foi encontrada."
    );

  }


  const valorAnterior =
    aba
      .getRange(
        numeroLinha,
        colunaStatus
      )
      .getDisplayValue();


  const sessao =
    obterSessaoAtualOpcional();


  aba
    .getRange(
      numeroLinha,
      colunaStatus
    )
    .setValue(
      novoStatus
    );


  SpreadsheetApp.flush();

  // IMPORTANTE: o cache antigo não pode reaparecer no próximo refresh.
  // O status foi gravado na planilha; removemos imediatamente o cache
  // dos projetos para que o CRM leia o valor novo na próxima consulta.
  try {
    CacheService
      .getScriptCache()
      .remove(
        CACHE_PREFIX + "PROJETOS"
      );
  } catch (erroCache) {
    // cache é opcional; a gravação da planilha já foi concluída
  }


  const versao =
    incrementarVersaoDados();


  registrarAuditoria(

    sessao
      ? sessao.usuario
      : "SISTEMA",

    "STATUS_ALTERADO",

    "PROJETOS",

    obterIdProjetoPorLinha(
      aba,
      numeroLinha
    ),

    valorAnterior,

    novoStatus,

    "Status do projeto alterado."

  );


  return respostaJSON({

    sucesso: true,
    autorizado: true,

    linha:
      numeroLinha,

    status:
      novoStatus,

    anterior:
      valorAnterior,

    versao:
      versao,

    atualizadoEm:
      new Date().toISOString(),

    mensagem:
      "Status atualizado com sucesso."

  });

  } finally {
    lock.releaseLock();
  }

}


/* ==========================================================
   ATUALIZAR STATUS POR ID
========================================================== */

function atualizarStatusPorId(
  id,
  status
) {

  const projeto =
    obterProjetoInterno(
      id
    );


  if (
    !projeto
  ) {

    return respostaJSON({

      sucesso: false,
      autorizado: true,

      mensagem:
        "Projeto não encontrado."

    });

  }


  return atualizarStatus(

    projeto._linha,

    status

  );

}


/* ==========================================================
   OBTER ID POR LINHA
========================================================== */

function obterIdProjetoPorLinha(
  aba,
  linha
) {

  try {

    return String(
      aba
        .getRange(
          linha,
          1
        )
        .getDisplayValue()
        .trim()
    );

  }

  catch (erro) {

    return "";

  }

}


/* ==========================================================
   PROJETO INTERNO
========================================================== */

function obterProjetoInterno(
  id
) {

  const projetos =
    lerPlanilha(
      true
    );


  const procurado =
    String(
      id || ""
    ).trim();


  for (
    let i = 0;
    i < projetos.length;
    i++
  ) {

    const projeto =
      projetos[i];


    const idProjeto =
      String(

        projeto["ID PROJETO"] ||
        projeto["ID"] ||
        ""

      ).trim();


    if (
      idProjeto ===
      procurado
    ) {

      return projeto;

    }

  }


  return null;

}


/* ==========================================================
   DRIVE — PASTA PRINCIPAL
========================================================== */

function obterPastaPrincipal() {

  const pastas =
    DriveApp.getFoldersByName(
      CONFIG.DRIVE_FOLDER_NAME
    );


  if (
    pastas.hasNext()
  ) {

    return pastas.next();

  }


  return DriveApp.createFolder(
    CONFIG.DRIVE_FOLDER_NAME
  );

}


/* ==========================================================
   GERAR ID DO PROJETO
========================================================== */

function gerarIdProjeto() {

  const agora =
    new Date();


  const data =
    Utilities.formatDate(

      agora,

      Session.getScriptTimeZone(),

      "yyyyMMdd-HHmmss"

    );


  const numero =
    Math.floor(
      Math.random() *
      9000
    ) + 1000;


  return (
    "ARQ-" +
    data +
    "-" +
    numero
  );

}


/* ==========================================================
   GERAR ID CRM
========================================================== */

function gerarIdCRM(
  prefixo
) {

  const data =
    Utilities.formatDate(

      new Date(),

      Session.getScriptTimeZone(),

      "yyyyMMdd"

    );


  const propriedades =
    PropertiesService
      .getScriptProperties();


  const chave =
    PROP_COUNTER_PREFIX +
    prefixo +
    "_" +
    data;


  let numero =
    Number(
      propriedades.getProperty(
        chave
      ) || 0
    );


  numero++;


  propriedades.setProperty(
    chave,
    String(
      numero
    )
  );


  return (

    prefixo +
    "-" +
    data +
    "-" +
    padNumero(
      numero,
      4
    )

  );

}


/* ==========================================================
   PREENCHER NÚMERO
========================================================== */

function padNumero(
  numero,
  tamanho
) {

  let texto =
    String(
      numero
    );


  while (
    texto.length <
    tamanho
  ) {

    texto =
      "0" +
      texto;

  }


  return texto;

}


/* ==========================================================
   RECEBER PROJETO ARQUITETO
========================================================== */

function receberProjetoArquiteto(
  dados
) {

  try {

    dados =
      dados || {};


    const aba =
      obterAbaProjetos();


    const agora =
      new Date();


    const idProjeto =
      gerarIdProjeto();


    const pastaPrincipal =
      obterPastaPrincipal();


    const nomeProjeto =
      limparNome(

        dados.projeto ||
        dados.nome_projeto ||
        "Projeto sem nome"

      );


    const pastaProjeto =
      pastaPrincipal.createFolder(

        idProjeto +
        " - " +
        (
          nomeProjeto ||
          "Projeto"
        )

      );


    const linksArquivos = [];


    let arquivos =
      dados.arquivos;


    if (
      typeof arquivos ===
      "string"
    ) {

      try {

        arquivos =
          JSON.parse(
            arquivos
          );

      }

      catch (erro) {

        arquivos = [];

      }

    }


    if (
      arquivos &&
      Array.isArray(
        arquivos
      )
    ) {

      arquivos.forEach(
        function(arquivo) {

          const salvo =
            salvarArquivo(

              arquivo,

              pastaProjeto

            );


          if (
            salvo
          ) {

            linksArquivos.push(

              salvo.nome +
              " → " +
              salvo.url

            );

          }

        }
      );

    }


    const linkPasta =
      pastaProjeto.getUrl();


    const linha = [

      idProjeto,

      agora,

      dados.nome ||
      dados.arquiteto ||
      "",

      dados.escritorio ||
      "",

      dados.email ||
      "",

      dados.whatsapp ||
      "",

      dados.cidade ||
      "",

      dados.estado ||
      "",

      dados.registro ||
      dados.registro_profissional ||
      "",

      dados.projeto ||
      dados.nome_projeto ||
      "",

      dados.tipo_projeto ||
      "",

      dados.area ||
      "",

      dados.ambiente ||
      "",

      dados.prazo ||
      "",

      dados.descricao ||
      dados.oque_orcar ||
      dados.orcamento ||
      "",

      dados.investimento ||
      "",

      dados.observacoes ||
      "",

      linksArquivos.join(
        "\n"
      ),

      linkPasta,

      "Novo"

    ];


    aba.appendRow(
      linha
    );


    const ultimaLinha =
      aba.getLastRow();


    aba
      .getRange(
        ultimaLinha,
        19
      )
      .setFormula(

        '=HYPERLINK("' +
        linkPasta +
        '";"ABRIR PASTA")'

      );


    if (
      linksArquivos.length > 0
    ) {

      const linksFormula =
        linksArquivos
          .map(
            function(item) {

              const partes =
                item.split(
                  " → "
                );


              if (
                partes.length >= 2
              ) {

                const nome =
                  partes[0];


                const url =
                  partes.slice(
                    1
                  ).join(
                    " → "
                  );


                return (
                  '=HYPERLINK("' +
                  url +
                  '";"' +
                  nome.replace(
                    /"/g,
                    '""'
                  ) +
                  '")'
                );

              }


              return item;

            }
          );


      aba
        .getRange(
          ultimaLinha,
          18
        )
        .setFormula(
          linksFormula.join(
            "\n"
          )
        );

    }


    SpreadsheetApp.flush();


    const versao =
      incrementarVersaoDados();


    registrarAuditoria(

      "SISTEMA",

      "CRIAR",

      "PROJETOS",

      idProjeto,

      "",

      JSON.stringify({
        nome:
          dados.nome || "",
        projeto:
          nomeProjeto,
        status:
          "Novo"
      }),

      "Projeto recebido pelo formulário de arquiteto."

    );


    return respostaJSON({

      sucesso: true,
      autorizado: true,

      tipo:
        "arquiteto",

      idProjeto:
        idProjeto,

      pasta:
        linkPasta,

      arquivos:
        linksArquivos,

      status:
        "Novo",

      versao:
        versao,

      mensagem:
        "Projeto recebido com sucesso."

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "receberProjetoArquiteto"
    );

    return respostaJSON({

      sucesso: false,
      autorizado: false,

      mensagem:
        "Não foi possível receber o projeto.",
      detalhe:
        obterMensagemErro(
          erro
        )

    });

  }

}


/* ==========================================================
   SALVAR ARQUIVO DRIVE
========================================================== */

function salvarArquivo(
  arquivo,
  pasta
) {

  try {

    if (
      !arquivo
    ) {

      return null;

    }


    const nome =
      arquivo.nome ||
      arquivo.name ||
      "arquivo";


    const mimeType =
      arquivo.mimeType ||
      arquivo.type ||
      "application/octet-stream";


    let base64 =
      arquivo.base64 ||
      arquivo.data ||
      arquivo.conteudo;


    if (
      !base64
    ) {

      return null;

    }


    base64 =
      String(
        base64
      );


    if (
      base64.indexOf(",") !== -1
    ) {

      base64 =
        base64.split(
          ","
        )[1];

    }


    const bytes =
      Utilities.base64Decode(
        base64
      );


    const blob =
      Utilities.newBlob(

        bytes,

        mimeType,

        nome

      );


    const arquivoCriado =
      pasta.createFile(
        blob
      );


    return {

      nome:
        arquivoCriado.getName(),

      url:
        arquivoCriado.getUrl(),

      id:
        arquivoCriado.getId(),

      mimeType:
        mimeType

    };

  }

  catch (erro) {

    console.error(
      "Erro ao salvar arquivo:",
      erro
    );

    return null;

  }

}


/* ==========================================================
   PORTAL PREMIUM — ARQUITETOS E FORNECEDORES
   Contas separadas do ADMIN, com senha armazenada em SHA-256.
========================================================== */

const PORTAL_SESSION_PREFIX = "ARQSELECT_PORTAL_";
const PORTAL_SESSION_HOURS = 12;

function hashPortalSenha(senha) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(senha || ""),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    const v = b < 0 ? b + 256 : b;
    return (v < 16 ? "0" : "") + v.toString(16);
  }).join("");
}

function obterAbaPortal(tipo) {
  const ss = obterPlanilha();
  const nome = tipo === "ARQUITETO" ? "ACESSOS_ARQUITETOS" : "ACESSOS_FORNECEDORES";
  let aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
    aba.getRange(1,1,1,10).setValues([[
      "ID", "DATA CADASTRO", "NOME", "EMPRESA", "E-MAIL", "TELEFONE", "REGISTRO/CNPJ", "SENHA SHA256", "STATUS", "ULTIMO ACESSO"
    ]]);
    aba.setFrozenRows(1);
    aba.getRange(1,1,1,10).setFontWeight("bold");
  }
  return aba;
}

function localizarPortalUsuario(tipo, email) {
  const aba = obterAbaPortal(tipo);
  const valores = aba.getDataRange().getDisplayValues();
  const alvo = String(email || "").trim().toLowerCase();
  for (let i=1; i<valores.length; i++) {
    if (String(valores[i][4] || "").trim().toLowerCase() === alvo) {
      return { linha:i+1, dados:valores[i] };
    }
  }
  return null;
}

function cadastrarPortalUsuario(dados, tipo) {
  try {
    dados = dados || {};
    const nome = String(dados.nome || dados.responsavel || "").trim();
    const email = String(dados.email || "").trim().toLowerCase();
    const senha = String(dados.senha || dados.password || "");
    const empresa = String(dados.empresa || dados.escritorio || dados.nome_fantasia || dados.razao_social || "").trim();
    const telefone = String(dados.telefone || dados.whatsapp || "").trim();
    const documento = String(dados.registro || dados.registro_profissional || dados.cnpj || "").trim();

    if (!nome || !email || !senha) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Preencha nome, e-mail e senha."});
    if (!/^\S+@\S+\.\S+$/.test(email)) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Informe um e-mail válido."});
    if (senha.length < 6) return respostaJSON({sucesso:false, autorizado:false, mensagem:"A senha deve ter no mínimo 6 caracteres."});
    if (localizarPortalUsuario(tipo, email)) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Já existe um acesso cadastrado para este e-mail."});

    const aba = obterAbaPortal(tipo);
    const id = (tipo === "ARQUITETO" ? "ARQ-" : "FOR-") + Utilities.getUuid().slice(0,8).toUpperCase();
    aba.appendRow([id, new Date(), nome, empresa, email, telefone, documento, hashPortalSenha(senha), "ATIVO", ""]);
    SpreadsheetApp.flush();
    incrementarVersaoDados();

    // Mantém a integração com o cadastro operacional existente.
    if (tipo === "ARQUITETO") {
      try { receberProjetoArquiteto({nome:nome, arquiteto:nome, escritorio:empresa, email:email, whatsapp:telefone, registro:documento, projeto:"Cadastro de arquiteto"}); } catch(e) {}
    } else {
      try { receberFornecedor({razao_social:empresa, nome_fantasia:empresa, cnpj:documento, responsavel:nome, email:email, telefone:telefone}); } catch(e) {}
    }

    registrarAuditoriaPublica(email, "CADASTRO_PORTAL", tipo, id, "", "", "Novo acesso criado.");
    return respostaJSON({sucesso:true, autorizado:true, id:id, tipo:tipo, mensagem:"Cadastro realizado com sucesso. Agora você já pode entrar no portal."});
  } catch (erro) {
    registrarErro(erro, "cadastrarPortalUsuario");
    return respostaJSON({sucesso:false, autorizado:false, mensagem:"Não foi possível concluir o cadastro."});
  }
}

function criarSessaoPortal(tipo, registro) {
  const token = Utilities.getUuid() + "-" + Utilities.getUuid();
  const agora = Date.now();
  const sessao = { token:token, tipo:tipo, id:registro.dados[0], nome:registro.dados[2], empresa:registro.dados[3], email:registro.dados[4], criadoEm:agora, expiraEm:agora + PORTAL_SESSION_HOURS*60*60*1000 };
  CacheService.getScriptCache().put(PORTAL_SESSION_PREFIX + token, JSON.stringify(sessao), PORTAL_SESSION_HOURS*60);
  return sessao;
}

function obterSessaoPortal(token) {
  if (!token) return null;
  const raw = CacheService.getScriptCache().get(PORTAL_SESSION_PREFIX + String(token));
  if (!raw) return null;
  try {
    const sessao = JSON.parse(raw);
    if (!sessao || Date.now() > Number(sessao.expiraEm)) {
      CacheService.getScriptCache().remove(PORTAL_SESSION_PREFIX + String(token));
      return null;
    }
    return sessao;
  } catch(e) { return null; }
}

function loginPortalUsuario(dados) {
  try {
    dados = dados || {};
    const tipo = String(dados.tipo || "").toUpperCase();
    const email = String(dados.email || "").trim().toLowerCase();
    const senha = String(dados.senha || "");
    if (["ARQUITETO","FORNECEDOR"].indexOf(tipo) === -1) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Tipo de acesso inválido."});
    const registro = localizarPortalUsuario(tipo, email);
    if (!registro || registro.dados[7] !== hashPortalSenha(senha) || String(registro.dados[8]).toUpperCase() !== "ATIVO") {
      registrarAuditoriaPublica(email, "LOGIN_FALHA", tipo, "", "", "", "Credenciais inválidas.");
      return respostaJSON({sucesso:false, autorizado:false, mensagem:"E-mail, senha ou acesso inválido."});
    }
    const sessao = criarSessaoPortal(tipo, registro);
    obterAbaPortal(tipo).getRange(registro.linha, 10).setValue(new Date());
    registrarAuditoriaPublica(email, "LOGIN_PORTAL", tipo, sessao.id, "", "", "Login realizado.");
    return respostaJSON({sucesso:true, autorizado:true, token:sessao.token, expiraEm:sessao.expiraEm, perfil:{tipo:tipo,id:sessao.id,nome:sessao.nome,empresa:sessao.empresa,email:sessao.email}, mensagem:"Login realizado com sucesso."});
  } catch (erro) {
    registrarErro(erro, "loginPortalUsuario");
    return respostaJSON({sucesso:false, autorizado:false, mensagem:"Erro ao realizar login."});
  }
}

function validarSessaoPortal(dados) {
  const sessao = obterSessaoPortal(dados && dados.token);
  if (!sessao) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Sessão expirada. Faça login novamente."});
  return respostaJSON({sucesso:true, autorizado:true, perfil:sessao, expiraEm:sessao.expiraEm});
}

function logoutPortal(token) {
  if (token) CacheService.getScriptCache().remove(PORTAL_SESSION_PREFIX + String(token));
  return respostaJSON({sucesso:true, autorizado:false, mensagem:"Sessão encerrada."});
}

function obterDashboardPortal(token) {
  const sessao = obterSessaoPortal(token);
  if (!sessao) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Sessão expirada."});
  const projetos = lerPlanilha(false);
  const email = String(sessao.email || "").toLowerCase();
  const meusProjetos = projetos.filter(function(p) {
    return String(p["E-MAIL"] || "").trim().toLowerCase() === email;
  });
  const contagem = {};
  meusProjetos.forEach(function(p) { const st = String(p["STATUS"] || "Novo").trim(); contagem[st] = (contagem[st]||0)+1; });
  const recentes = meusProjetos.slice(-8).reverse().map(function(p) {
    return {id:p["ID PROJETO"]||"", data:p["DATA / HORA"]||"", projeto:p["NOME DO PROJETO"]||"", tipo:p["TIPO DE PROJETO"]||"", investimento:p["INVESTIMENTO"]||"", status:p["STATUS"]||"Novo", cidade:p["CIDADE"]||""};
  });
  return respostaJSON({sucesso:true, autorizado:true, perfil:sessao, metricas:{totalProjetos:meusProjetos.length, novos:contagem["Novo"]||0, emAnalise:contagem["Em análise"]||0, orcamentos:contagem["Orçamento"]||0, propostas:contagem["Proposta enviada"]||0, negociacao:contagem["Negociação"]||0, fechados:contagem["Fechado"]||0, execucao:contagem["Em execução"]||0, concluidos:contagem["Concluído"]||0}, recentes:recentes, mensagem:"Dashboard atualizado."});
}

/* ==========================================================
   PORTAL PREMIUM — PROJETOS E STATUS COM PERMISSÃO
========================================================== */
function obterProjetosPortalSeguro(token) {
  const sessao = obterSessaoPortal(token);
  if (!sessao) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Sessão expirada. Faça login novamente."});
  const projetos = lerPlanilha(false);
  const email = String(sessao.email || "").trim().toLowerCase();
  const meus = projetos.filter(function(p){ return String(p["E-MAIL"] || "").trim().toLowerCase() === email; });
  return respostaJSON({sucesso:true, autorizado:true, projetos:meus.map(function(p){ return {id:p["ID PROJETO"]||"", data:p["DATA / HORA"]||"", projeto:p["NOME DO PROJETO"]||"", tipo:p["TIPO DE PROJETO"]||"", investimento:p["INVESTIMENTO"]||"", status:p["STATUS"]||"Novo", cidade:p["CIDADE"]||"", area:p["ÁREA"]||p["AREA"]||"", prazo:p["PRAZO"]||""}; }), statusValidos:["Novo","Em análise","Orçamento","Proposta enviada","Negociação","Aprovação","Fechado","Em execução","Concluído","Cancelado"], mensagem:"Projetos carregados."});
}

function atualizarStatusPortalSeguro(token, id, status) {
  const sessao = obterSessaoPortal(token);
  if (!sessao) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Sessão expirada. Faça login novamente."});
  const projeto = obterProjetoInterno(id);
  if (!projeto) return respostaJSON({sucesso:false, autorizado:true, mensagem:"Projeto não encontrado."});
  const emailProjeto = String(projeto["E-MAIL"] || "").trim().toLowerCase();
  const emailSessao = String(sessao.email || "").trim().toLowerCase();
  if (!emailProjeto || emailProjeto !== emailSessao) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Você não possui permissão para alterar este projeto."});
  return atualizarStatus(projeto._linha, status);
}

/* ==========================================================
   RECEBER FORNECEDOR
   COMPATIBILIDADE MANTIDA
========================================================== */

function receberFornecedor(
  dados
) {

  try {

    dados =
      dados || {};


    const planilha =
      obterPlanilha();


    const nomeAba =
      CRM_SHEETS.FORNECEDORES;


    let aba =
      planilha.getSheetByName(
        nomeAba
      );


    if (
      !aba
    ) {

      aba =
        planilha.insertSheet(
          nomeAba
        );


      configurarCabecalhoFornecedor(
        aba
      );

    }


    aba.appendRow([

      new Date(),

      dados.razao_social ||
      "",

      dados.nome_fantasia ||
      "",

      dados.cnpj ||
      "",

      dados.site ||
      "",

      dados.instagram ||
      "",

      dados.cidade ||
      "",

      dados.estado ||
      "",

      dados.responsavel ||
      "",

      dados.cargo ||
      "",

      dados.email ||
      "",

      dados.telefone ||
      "",

      dados.produtos ||
      "",

      dados.marcas ||
      "",

      dados.prazo_entrega ||
      "",

      dados.regiao ||
      "",

      dados.pedido_minimo ||
      "",

      dados.pagamento ||
      "",

      dados.tabela ||
      "",

      dados.proposta ||
      "",

      "Novo"

    ]);


    SpreadsheetApp.flush();


    const versao =
      incrementarVersaoDados();


    registrarAuditoria(

      "SISTEMA",

      "CRIAR",

      "FORNECEDORES",

      dados.cnpj ||
      dados.razao_social ||
      "",

      "",

      JSON.stringify(
        dados
      ),

      "Cadastro de fornecedor recebido."

    );


    return respostaJSON({

      sucesso: true,
      autorizado: true,

      tipo:
        "fornecedor",

      versao:
        versao,

      mensagem:
        "Cadastro de fornecedor recebido com sucesso."

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "receberFornecedor"
    );

    return respostaJSON({

      sucesso: false,
      autorizado: false,

      mensagem:
        "Não foi possível cadastrar o fornecedor."

    });

  }

}


/* ==========================================================
   CABEÇALHO FORNECEDOR
========================================================== */

function configurarCabecalhoFornecedor(
  aba
) {

  if (
    aba.getLastRow() > 0
  ) {

    return;

  }


  const cabecalho = [

    "Data",
    "Razão Social",
    "Nome Fantasia",
    "CNPJ",
    "Site",
    "Instagram",
    "Cidade",
    "Estado",
    "Responsável",
    "Cargo",
    "E-mail",
    "Telefone",
    "Produtos",
    "Marcas",
    "Prazo de Entrega",
    "Região",
    "Pedido Mínimo",
    "Pagamento",
    "Tabela",
    "Proposta",
    "Status"

  ];


  aba
    .getRange(
      1,
      1,
      1,
      cabecalho.length
    )
    .setValues([
      cabecalho
    ]);


  aba
    .getRange(
      1,
      1,
      1,
      cabecalho.length
    )
    .setFontWeight(
      "bold"
    );


  aba.setFrozenRows(
    1
  );


  aba.autoResizeColumns(
    1,
    cabecalho.length
  );

}


/* ==========================================================
   CRIAR ABAS CRM
========================================================== */

function garantirAbaCRM(
  modulo
) {

  const chave =
    normalizarModulo(
      modulo
    );


  const mapa =
    obterMapaModulos();


  if (
    !mapa[chave]
  ) {

    throw new Error(
      "Módulo CRM inválido."
    );

  }


  const planilha =
    obterPlanilha();


  const nomeAba =
    mapa[chave].sheet;


  let aba =
    planilha.getSheetByName(
      nomeAba
    );


  if (
    !aba
  ) {

    aba =
      planilha.insertSheet(
        nomeAba
      );

  }


  const headers =
    mapa[chave].headers;


  if (
    aba.getLastRow() === 0
  ) {

    aba
      .getRange(
        1,
        1,
        1,
        headers.length
      )
      .setValues([
        headers
      ]);

    aba
      .getRange(
        1,
        1,
        1,
        headers.length
      )
      .setFontWeight(
        "bold"
      );

    aba.setFrozenRows(
      1
    );

  }


  return aba;

}


/* ==========================================================
   MAPA DE MÓDULOS
========================================================== */

function obterMapaModulos() {

  return {

    leads: {

      sheet:
        CRM_SHEETS.LEADS,

      headers:
        CRM_HEADERS.LEADS

    },

    clientes: {

      sheet:
        CRM_SHEETS.CLIENTES,

      headers:
        CRM_HEADERS.CLIENTES

    },

    arquitetos: {

      sheet:
        CRM_SHEETS.ARQUITETOS,

      headers:
        CRM_HEADERS.ARQUITETOS

    },

    orcamentos: {

      sheet:
        CRM_SHEETS.ORCAMENTOS,

      headers:
        CRM_HEADERS.ORCAMENTOS

    },

    followups: {

      sheet:
        CRM_SHEETS.FOLLOWUPS,

      headers:
        CRM_HEADERS.FOLLOWUPS

    },

    agenda: {

      sheet:
        CRM_SHEETS.AGENDA,

      headers:
        CRM_HEADERS.AGENDA

    },

    tarefas: {

      sheet:
        CRM_SHEETS.TAREFAS,

      headers:
        CRM_HEADERS.TAREFAS

    }

  };

}


/* ==========================================================
   NORMALIZAR MÓDULO
========================================================== */

function normalizarModulo(
  modulo
) {

  return String(
    modulo || ""
  )

    .toLowerCase()

    .trim()

    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )

    .replace(
      /[^a-z0-9_]/g,
      ""

    );

}


/* ==========================================================
   LISTAR MÓDULO
========================================================== */

function listarModulo(
  modulo,
  limite,
  pagina
) {

  const chave =
    normalizarModulo(
      modulo
    );


  const mapa =
    obterMapaModulos();


  if (
    !mapa[chave]
  ) {

    return respostaJSON({

      sucesso: false,
      mensagem:
        "Módulo não encontrado."

    });

  }


  const aba =
    garantirAbaCRM(
      chave
    );


  const registros =
    lerAbaComoObjetos(
      aba
    );


  const limiteNumero =
    Math.min(

      Math.max(
        Number(
          limite
        ) || 100,
        1
      ),

      500

    );


  const paginaNumero =
    Math.max(
      Number(
        pagina
      ) || 1,
      1
    );


  const inicio =
    (
      paginaNumero -
      1
    ) *
    limiteNumero;


  const dados =
    registros.slice(
      inicio,
      inicio +
      limiteNumero
    );


  return respostaJSON({

    sucesso: true,

    modulo:
      chave,

    total:
      registros.length,

    pagina:
      paginaNumero,

    limite:
      limiteNumero,

    paginas:
      Math.ceil(
        registros.length /
        limiteNumero
      ),

    dados:
      dados,

    versao:
      obterVersaoDados()

  });

}


/* ==========================================================
   LER ABA COMO OBJETOS
========================================================== */

function lerAbaComoObjetos(
  aba
) {

  const ultimaLinha =
    aba.getLastRow();


  const ultimaColuna =
    aba.getLastColumn();


  if (
    ultimaLinha < 2 ||
    ultimaColuna < 1
  ) {

    return [];

  }


  const valores =
    aba
      .getRange(
        1,
        1,
        ultimaLinha,
        ultimaColuna
      )
      .getDisplayValues();


  const headers =
    valores[0];


  const registros = [];


  for (
    let i = 1;
    i < valores.length;
    i++
  ) {

    const objeto = {

      _linha:
        i + 1

    };


    let possuiDados =
      false;


    for (
      let c = 0;
      c < headers.length;
      c++
    ) {

      const chave =
        String(
          headers[c] ||
          ""
        ).trim();


      if (
        !chave
      ) {

        continue;

      }


      const valor =
        valores[i][c] ||
        "";


      objeto[chave] =
        valor;


      if (
        String(
          valor
        ).trim() !== ""
      ) {

        possuiDados =
          true;

      }

    }


    if (
      possuiDados
    ) {

      registros.push(
        objeto
      );

    }

  }


  return registros;

}


/* ==========================================================
   CRIAR REGISTRO CRM
========================================================== */

function criarRegistroModulo(
  modulo,
  dados
) {

  try {

    const chave =
      normalizarModulo(
        modulo
      );


    const mapa =
      obterMapaModulos();


    if (
      !mapa[chave]
    ) {

      return respostaJSON({

        sucesso: false,
        mensagem:
          "Módulo inválido."

      });

    }


    const aba =
      garantirAbaCRM(
        chave
      );


    const headers =
      mapa[chave].headers;


    const prefixo =
      obterPrefixoModulo(
        chave
      );


    const id =
      gerarIdCRM(
        prefixo
      );


    const agora =
      new Date();


    const linha =
      headers.map(
        function(header) {

          const chaveDados =
            encontrarChaveDados(
              dados,
              header
            );


          if (
            chaveDados
          ) {

            return dados[
              chaveDados
            ];

          }


          if (
            header ===
            "ID"
          ) {

            return id;

          }


          if (
            header ===
            "DATA DE CRIAÇÃO"
          ) {

            return agora;

          }


          if (
            header ===
            "DATA DE ATUALIZAÇÃO"
          ) {

            return agora;

          }


          if (
            header ===
            "STATUS"
          ) {

            return obterStatusInicial(
              chave
            );

          }


          if (
            header ===
            "LIDA"
          ) {

            return "NÃO";

          }


          return "";

        }
      );


    aba.appendRow(
      linha
    );


    SpreadsheetApp.flush();


    const versao =
      incrementarVersaoDados();


    registrarAuditoria(

      obterUsuarioSistemaAtual(),

      "CRIAR",

      chave.toUpperCase(),

      id,

      "",

      JSON.stringify(
        dados
      ),

      "Registro CRM criado."

    );


    return respostaJSON({

      sucesso: true,

      id:
        id,

      modulo:
        chave,

      versao:
        versao,

      mensagem:
        "Registro criado com sucesso."

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "criarRegistroModulo"
    );

    return respostaJSON({

      sucesso: false,

      error: true,

      mensagem:
        obterMensagemErro(
          erro
        )

    });

  }

}


/* ==========================================================
   ATUALIZAR REGISTRO CRM
========================================================== */

function atualizarRegistroModulo(
  modulo,
  id,
  dados
) {

  try {

    const chave =
      normalizarModulo(
        modulo
      );


    const mapa =
      obterMapaModulos();


    if (
      !mapa[chave]
    ) {

      return respostaJSON({

        sucesso: false,
        mensagem:
          "Módulo inválido."

      });

    }


    const aba =
      garantirAbaCRM(
        chave
      );


    const headers =
      obterCabecalhosAba(
        aba
      );


    const colunaID =
      encontrarColuna(
        headers,
        "ID"
      );


    if (
      !colunaID
    ) {

      throw new Error(
        "Coluna ID não encontrada."
      );

    }


    const numeroLinha =
      encontrarLinhaPorID(
        aba,
        colunaID,
        id
      );


    if (
      !numeroLinha
    ) {

      return respostaJSON({

        sucesso: false,

        mensagem:
          "Registro não encontrado."

      });

    }


    const valoresAnteriores =
      aba
        .getRange(
          numeroLinha,
          1,
          1,
          headers.length
        )
        .getDisplayValues()[0];


    const linhaAtual =
      aba
        .getRange(
          numeroLinha,
          1,
          1,
          headers.length
        )
        .getValues()[0];


    for (
      let c = 0;
      c < headers.length;
      c++
    ) {

      const header =
        headers[c];


      const chaveDados =
        encontrarChaveDados(
          dados,
          header
        );


      if (
        chaveDados
      ) {

        linhaAtual[c] =
          dados[
            chaveDados
          ];

      }

    }


    const colunaAtualizacao =
      encontrarColuna(
        headers,
        "DATA DE ATUALIZAÇÃO"
      );


    if (
      colunaAtualizacao
    ) {

      linhaAtual[
        colunaAtualizacao - 1
      ] =
        new Date();

    }


    aba
      .getRange(
        numeroLinha,
        1,
        1,
        headers.length
      )
      .setValues([
        linhaAtual
      ]);


    SpreadsheetApp.flush();


    const versao =
      incrementarVersaoDados();


    registrarAuditoria(

      obterUsuarioSistemaAtual(),

      "EDITAR",

      chave.toUpperCase(),

      String(
        id
      ),

      JSON.stringify(
        valoresAnteriores
      ),

      JSON.stringify(
        linhaAtual
      ),

      "Registro CRM atualizado."

    );


    return respostaJSON({

      sucesso: true,

      id:
        id,

      modulo:
        chave,

      versao:
        versao,

      mensagem:
        "Registro atualizado com sucesso."

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "atualizarRegistroModulo"
    );

    return respostaJSON({

      sucesso: false,
      error: true,

      mensagem:
        obterMensagemErro(
          erro
        )

    });

  }

}


/* ==========================================================
   EXCLUIR REGISTRO
========================================================== */

function excluirRegistroModulo(
  modulo,
  id
) {

  try {

    const chave =
      normalizarModulo(
        modulo
      );


    const mapa =
      obterMapaModulos();


    if (
      !mapa[chave]
    ) {

      throw new Error(
        "Módulo inválido."
      );

    }


    const aba =
      garantirAbaCRM(
        chave
      );


    const headers =
      obterCabecalhosAba(
        aba
      );


    const colunaID =
      encontrarColuna(
        headers,
        "ID"
      );


    const linha =
      encontrarLinhaPorID(
        aba,
        colunaID,
        id
      );


    if (
      !linha
    ) {

      return respostaJSON({

        sucesso: false,

        mensagem:
          "Registro não encontrado."

      });

    }


    aba.deleteRow(
      linha
    );


    SpreadsheetApp.flush();


    const versao =
      incrementarVersaoDados();


    registrarAuditoria(

      obterUsuarioSistemaAtual(),

      "EXCLUIR",

      chave.toUpperCase(),

      String(
        id
      ),

      "",

      "",

      "Registro excluído."

    );


    return respostaJSON({

      sucesso: true,

      versao:
        versao,

      mensagem:
        "Registro excluído com sucesso."

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "excluirRegistroModulo"
    );

    return respostaJSON({

      sucesso: false,
      error: true,

      mensagem:
        obterMensagemErro(
          erro
        )

    });

  }

}


/* ==========================================================
   ARQUIVAR
========================================================== */

function arquivarRegistroModulo(
  modulo,
  id
) {

  return atualizarRegistroModulo(

    modulo,

    id,

    {

      status:
        "ARQUIVADO",

      STATUS:
        "ARQUIVADO"

    }

  );

}


/* ==========================================================
   RESTAURAR
========================================================== */

function restaurarRegistroModulo(
  modulo,
  id
) {

  return atualizarRegistroModulo(

    modulo,

    id,

    {

      status:
        "ATIVO",

      STATUS:
        "ATIVO"

    }

  );

}


/* ==========================================================
   OBTER REGISTRO POR ID
========================================================== */

function obterRegistroModulo(
  modulo,
  id
) {

  try {

    const chave =
      normalizarModulo(
        modulo
      );


    const mapa =
      obterMapaModulos();


    if (
      !mapa[chave]
    ) {

      return respostaJSON({

        sucesso: false,

        mensagem:
          "Módulo inválido."

      });

    }


    const aba =
      garantirAbaCRM(
        chave
      );


    const headers =
      obterCabecalhosAba(
        aba
      );


    const colunaID =
      encontrarColuna(
        headers,
        "ID"
      );


    const linha =
      encontrarLinhaPorID(
        aba,
        colunaID,
        id
      );


    if (
      !linha
    ) {

      return respostaJSON({

        sucesso: false,

        mensagem:
          "Registro não encontrado."

      });

    }


    const valores =
      aba
        .getRange(
          linha,
          1,
          1,
          headers.length
        )
        .getDisplayValues()[0];


    const registro =
      {};


    for (
      let i = 0;
      i < headers.length;
      i++
    ) {

      registro[
        headers[i]
      ] =
        valores[i];

    }


    registro._linha =
      linha;


    return respostaJSON({

      sucesso: true,

      modulo:
        chave,

      registro:
        registro,

      versao:
        obterVersaoDados()

    });

  }

  catch (erro) {

    registrarErro(
      erro,
      "obterRegistroModulo"
    );

    return respostaJSON({

      sucesso: false,

      mensagem:
        obterMensagemErro(
          erro
        )

    });

  }

}


/* ==========================================================
   CABEÇALHOS
========================================================== */

function obterCabecalhosAba(
  aba
) {

  if (
    aba.getLastColumn() < 1
  ) {

    return [];

  }


  return aba
    .getRange(
      1,
      1,
      1,
      aba.getLastColumn()
    )
    .getDisplayValues()[0];

}


/* ==========================================================
   ENCONTRAR COLUNA
========================================================== */

function encontrarColuna(
  headers,
  nome
) {

  const procurado =
    String(
      nome || ""
    )
      .trim()
      .toUpperCase();


  for (
    let i = 0;
    i < headers.length;
    i++
  ) {

    if (
      String(
        headers[i] || ""
      )
        .trim()
        .toUpperCase() ===
      procurado
    ) {

      return i + 1;

    }

  }


  return 0;

}


/* ==========================================================
   ENCONTRAR LINHA POR ID
========================================================== */

function encontrarLinhaPorID(
  aba,
  colunaID,
  id
) {

  if (
    !colunaID ||
    aba.getLastRow() < 2
  ) {

    return 0;

  }


  const quantidade =
    aba.getLastRow() - 1;


  const valores =
    aba
      .getRange(
        2,
        colunaID,
        quantidade,
        1
      )
      .getDisplayValues();


  const procurado =
    String(
      id || ""
    ).trim();


  for (
    let i = 0;
    i < valores.length;
    i++
  ) {

    if (
      String(
        valores[i][0] ||
        ""
      ).trim() ===
      procurado
    ) {

      return i + 2;

    }

  }


  return 0;

}


/* ==========================================================
   ENCONTRAR CHAVE DE DADOS
========================================================== */

function encontrarChaveDados(
  dados,
  header
) {

  if (
    !dados
  ) {

    return null;

  }


  const candidatos = [

    header,

    String(
      header
    ).toLowerCase(),

    String(
      header
    )
      .toLowerCase()
      .replace(
        /[^a-zA-Z0-9]+(.)/g,
        function(_, letra) {
          return letra
            ? letra.toUpperCase()
            : "";
        }
      )

  ];


  for (
    let i = 0;
    i < candidatos.length;
    i++
  ) {

    if (
      Object.prototype.hasOwnProperty.call(
        dados,
        candidatos[i]
      )
    ) {

      return candidatos[i];

    }

  }


  return null;

}


/* ==========================================================
   PREFIXO POR MÓDULO
========================================================== */

function obterPrefixoModulo(
  modulo
) {

  const mapa = {

    leads:
      "LEAD",

    clientes:
      "CLI",

    arquitetos:
      "ARQ",

    orcamentos:
      "ORC",

    followups:
      "TASK",

    agenda:
      "AGENDA",

    tarefas:
      "TASK"

  };


  return mapa[
    modulo
  ] || "REG";

}


/* ==========================================================
   STATUS INICIAL
========================================================== */

function obterStatusInicial(
  modulo
) {

  if (
    modulo ===
    "orcamentos"
  ) {

    return "RASCUNHO";

  }


  if (
    modulo ===
    "leads"
  ) {

    return "NOVO";

  }


  if (
    modulo ===
    "agenda"
  )
  {

    return "PENDENTE";

  }


  if (
    modulo ===
    "tarefas"
  ) {

    return "PENDENTE";

  }


  return "ATIVO";

}


/* ==========================================================
   BUSCA GLOBAL
========================================================== */

function buscaGlobal(
  consulta
) {

  const termo =
    String(
      consulta || ""
    )
      .trim()
      .toLowerCase();


  if (
    termo.length < 2
  ) {

    return respostaJSON({

      sucesso: true,

      total:
        0,

      resultados:
        [],

      mensagem:
        "Digite pelo menos 2 caracteres."

    });

  }


  const resultados = [];


  /* ========================================================
     PROJETOS
  ======================================================== */

  const projetos =
    lerPlanilha(
      true
    );


  projetos.forEach(
    function(projeto) {

      if (
        objetoContemTermo(
          projeto,
          termo
        )
      ) {

        resultados.push({

          modulo:
            "projetos",

          id:
            projeto["ID PROJETO"] ||
            "",

          nome:
            projeto["NOME DO PROJETO"] ||
            projeto["NOME"] ||
            "",

          status:
            projeto["STATUS"] ||
            "",

          dados:
            projeto

        });

      }

    }
  );


  /* ========================================================
     OUTROS MÓDULOS
  ======================================================== */

  const mapa =
    obterMapaModulos();


  Object.keys(
    mapa
  ).forEach(
    function(modulo) {

      try {

        const aba =
          garantirAbaCRM(
            modulo
          );


        const registros =
          lerAbaComoObjetos(
            aba
          );


        registros.forEach(
          function(registro) {

            if (
              objetoContemTermo(
                registro,
                termo
              )
            ) {

              resultados.push({

                modulo:
                  modulo,

                id:
                  registro.ID ||
                  "",

                nome:
                  registro.NOME ||
                  registro.TÍTULO ||
                  registro.EMPRESA ||
                  "",

                status:
                  registro.STATUS ||
                  "",

                dados:
                  registro

              });

            }

          }
        );

      }

      catch (erro) {

        console.error(
          erro
        );

      }

    }
  );


  return respostaJSON({

    sucesso: true,

    total:
      resultados.length,

    resultados:
      resultados.slice(
        0,
        200
      ),

    consulta:
      consulta,

    versao:
      obterVersaoDados()

  });

}


/* ==========================================================
   OBJETO CONTÉM TERMO
========================================================== */

function objetoContemTermo(
  objeto,
  termo
) {

  if (
    !objeto
  ) {

    return false;

  }


  const texto =
    Object.keys(
      objeto
    )
      .map(
        function(chave) {

          return String(
            objeto[chave] ||
            ""
          );

        }
      )
      .join(
        " "
      )
      .toLowerCase();


  return texto.indexOf(
    termo
  ) !== -1;

}


/* ==========================================================
   DASHBOARD
========================================================== */

function obterDashboard() {

  const cache =
    CacheService
      .getScriptCache();


  const chave =
    CACHE_PREFIX +
    "DASHBOARD";


  const cacheTexto =
    cache.get(
      chave
    );


  if (
    cacheTexto
  ) {

    try {

      return respostaJSON(
        JSON.parse(
          cacheTexto
        )
      );

    }

    catch (erro) {

      cache.remove(
        chave
      );

    }

  }


  const projetos =
    lerPlanilha(
      true
    );


  const dados = {

    totalLeads:
      contarModulo(
        "leads"
      ),

    leadsNovos:
      contarStatusModulo(
        "leads",
        "NOVO"
      ),

    leadsNegociacao:
      contarStatusModulo(
        "leads",
        "EM_NEGOCIAÇÃO"
      ),

    projetosAtivos:
      contarProjetosAtivos(
        projetos
      ),

    projetosFechados:
      contarProjetoStatus(
        projetos,
        [
          "Fechado",
          "FECHADO",
          "CONCLUÍDO"
        ]
      ),

    projetosPerdidos:
      contarProjetoStatus(
        projetos,
        [
          "Cancelado",
          "CANCELADO",
          "PERDIDO"
        ]
      ),

    orcamentosEnviados:
      contarStatusModulo(
        "orcamentos",
        "ENVIADO"
      ),

    orcamentosAprovados:
      contarStatusModulo(
        "orcamentos",
        "APROVADO"
      ),

    valorEmNegociacao:
      calcularValorProjetosPorStatus(
        projetos,
        [
          "Orçamento",
          "Orçamento",
          "ORÇAMENTO",
          "PROPOSTA_ENVIADA",
          "NEGOCIAÇÃO",
          "APROVAÇÃO"
        ]
      ),

    valorFechado:
      calcularValorProjetosPorStatus(
        projetos,
        [
          "Fechado",
          "FECHADO",
          "CONCLUÍDO"
        ]
      ),

    ticketMedio:
      calcularTicketMedio(
        projetos
      ),

    followUpsPendentes:
      contarPendenciasModulo(
        "followups"
      ),

    tarefasPendentes:
      contarPendenciasModulo(
        "tarefas"
      ),

    atividadesHoje:
      contarAtividadesHoje(),

    atividadesAtrasadas:
      contarAtividadesAtrasadas(),

    funil:
      obterFunilVendas(),

    versao:
      obterVersaoDados(),

    atualizadoEm:
      new Date().toISOString()

  };


  const resposta = {

    sucesso: true,

    dashboard:
      dados,

    versao:
      dados.versao,

    atualizadoEm:
      dados.atualizadoEm

  };


  try {

    cache.put(
      chave,
      JSON.stringify(
        resposta
      ),
      CONFIG.DASHBOARD_CACHE_SECONDS
    );

  }

  catch (erro) {

    // cache opcional

  }


  return respostaJSON(
    resposta
  );

}


/* ==========================================================
   CONTAR MÓDULO
========================================================== */

function contarModulo(
  modulo
) {

  try {

    const aba =
      garantirAbaCRM(
        modulo
      );


    return Math.max(
      aba.getLastRow() - 1,
      0
    );

  }

  catch (erro) {

    return 0;

  }

}


/* ==========================================================
   CONTAR STATUS
========================================================== */

function contarStatusModulo(
  modulo,
  status
) {

  try {

    const aba =
      garantirAbaCRM(
        modulo
      );


    const registros =
      lerAbaComoObjetos(
        aba
      );


    let total =
      0;


    registros.forEach(
      function(registro) {

        if (
          String(
            registro.STATUS ||
            ""
          )
            .trim()
            .toUpperCase() ===
          String(
            status
          )
            .trim()
            .toUpperCase()
        ) {

          total++;

        }

      }
    );


    return total;

  }

  catch (erro) {

    return 0;

  }

}


/* ==========================================================
   CONTAR PROJETOS ATIVOS
========================================================== */

function contarProjetosAtivos(
  projetos
) {

  const encerrados = [

    "Fechado",
    "Cancelado",
    "FECHADO",
    "CANCELADO",
    "CONCLUÍDO"

  ];


  let total =
    0;


  projetos.forEach(
    function(projeto) {

      const status =
        String(
          projeto.STATUS ||
          ""
        ).trim();


      if (
        status &&
        encerrados.indexOf(
          status
        ) === -1
      ) {

        total++;

      }

    }
  );


  return total;

}


/* ==========================================================
   CONTAR STATUS PROJETO
========================================================== */

function contarProjetoStatus(
  projetos,
  statusList
) {

  let total =
    0;


  projetos.forEach(
    function(projeto) {

      const status =
        String(
          projeto.STATUS ||
          ""
        ).trim();


      if (
        statusList.indexOf(
          status
        ) !== -1
      ) {

        total++;

      }

    }
  );


  return total;

}


/* ==========================================================
   VALOR POR STATUS
========================================================== */

function calcularValorProjetosPorStatus(
  projetos,
  statusList
) {

  let total =
    0;


  projetos.forEach(
    function(projeto) {

      const status =
        String(
          projeto.STATUS ||
          ""
        ).trim();


      if (
        statusList.indexOf(
          status
        ) !== -1
      ) {

        total +=
          converterNumero(
            projeto.INVESTIMENTO ||
            projeto["INVESTIMENTO"] ||
            0
          );

      }

    }
  );


  return total;

}


/* ==========================================================
   TICKET MÉDIO
========================================================== */

function calcularTicketMedio(
  projetos
) {

  let total =
    0;

  let quantidade =
    0;


  projetos.forEach(
    function(projeto) {

      const status =
        String(
          projeto.STATUS ||
          ""
        ).trim();


      if (
        status ===
        "Fechado" ||
        status ===
        "FECHADO"
      ) {

        const valor =
          converterNumero(
            projeto.INVESTIMENTO ||
            0
          );


        if (
          valor > 0
        ) {

          total +=
            valor;

          quantidade++;

        }

      }

    }
  );


  if (
    quantidade === 0
  ) {

    return 0;

  }


  return total /
    quantidade;

}


/* ==========================================================
   CONVERTER NÚMERO
========================================================== */

function converterNumero(
  valor
) {

  if (
    typeof valor ===
    "number"
  ) {

    return valor;

  }


  let texto =
    String(
      valor || ""
    )
      .trim();


  if (
    !texto
  ) {

    return 0;

  }


  texto =
    texto.replace(
      /R\$/gi,
      ""
    )
    .replace(
      /\s/g,
      ""
    );


  if (
    texto.indexOf(",") !== -1
  ) {

    texto =
      texto.replace(
        /\./g,
        ""
      )
      .replace(
        ",",
        "."
      );

  }


  texto =
    texto.replace(
      /[^0-9.-]/g,
      ""
    );


  const numero =
    Number(
      texto
    );


  return isNaN(
    numero
  )
    ? 0
    : numero;

}


/* ==========================================================
   FOLLOW-UP PENDENTE
========================================================== */

function contarPendenciasModulo(
  modulo
) {

  try {

    const aba =
      garantirAbaCRM(
        modulo
      );


    const registros =
      lerAbaComoObjetos(
        aba
      );


    let total =
      0;


    registros.forEach(
      function(registro) {

        const status =
          String(
            registro.STATUS ||
            ""
          )
            .trim()
            .toUpperCase();


        if (
          status !==
          "CONCLUÍDO" &&
          status !==
          "CONCLUIDO" &&
          status !==
          "FECHADO" &&
          status !==
          "CANCELADO"
        ) {

          total++;

        }

      }
    );


    return total;

  }

  catch (erro) {

    return 0;

  }

}


/* ==========================================================
   ATIVIDADES HOJE
========================================================== */

function contarAtividadesHoje() {

  let total =
    0;


  total +=
    contarDataHojeModulo(
      "agenda",
      "DATA"
    );


  total +=
    contarDataHojeModulo(
      "followups",
      "DATA"
    );


  total +=
    contarDataHojeModulo(
      "tarefas",
      "PRAZO"
    );


  return total;

}


/* ==========================================================
   ATIVIDADES ATRASADAS
========================================================== */

function contarAtividadesAtrasadas() {

  const hoje =
    zerarHora(
      new Date()
    );


  let total =
    0;


  [
    "agenda",
    "followups",
    "tarefas"
  ]
    .forEach(
      function(modulo) {

        try {

          const aba =
            garantirAbaCRM(
              modulo
            );


          const registros =
            lerAbaComoObjetos(
              aba
            );


          registros.forEach(
            function(registro) {

              const campo =
                modulo ===
                "tarefas"
                  ? registro.PRAZO
                  : registro.DATA;


              const data =
                converterData(
                  campo
                );


              if (
                data &&
                zerarHora(
                  data
                ) < hoje
              ) {

                const status =
                  String(
                    registro.STATUS ||
                    ""
                  )
                    .toUpperCase();


                if (
                  status !==
                  "CONCLUÍDO" &&
                  status !==
                  "CONCLUIDO" &&
                  status !==
                  "FECHADO" &&
                  status !==
                  "CANCELADO"
                ) {

                  total++;

                }

              }

            }
          );

        }

        catch (erro) {

          // módulo opcional

        }

      }
    );


  return total;

}


/* ==========================================================
   CONTAR DATA HOJE
========================================================== */

function contarDataHojeModulo(
  modulo,
  campo
) {

  try {

    const aba =
      garantirAbaCRM(
        modulo
      );


    const registros =
      lerAbaComoObjetos(
        aba
      );


    const hoje =
      zerarHora(
        new Date()
      );


    let total =
      0;


    registros.forEach(
      function(registro) {

        const data =
          converterData(
            registro[campo]
          );


        if (
          data &&
          zerarHora(
            data
          ).getTime() ===
          hoje.getTime()
        ) {

          total++;

        }

      }
    );


    return total;

  }

  catch (erro) {

    return 0;

  }

}


/* ==========================================================
   FUNIL
========================================================== */

function obterFunilVendas() {

  const projetos =
    lerPlanilha(
      true
    );


  const funil = {

    LEADS:
      contarModulo(
        "leads"
      ),

    CONTATADOS:
      contarStatusModulo(
        "leads",
        "CONTATADO"
      ),

    NEGOCIACAO:
      contarStatusModulo(
        "leads",
        "EM_NEGOCIAÇÃO"
      ),

    PROPOSTA:
      contarStatusModulo(
        "leads",
        "PROPOSTA_ENVIADA"
      ),

    APROVACAO:
      contarProjetoStatus(
        projetos,
        [
          "APROVAÇÃO"
        ]
      ),

    FECHADO:
      contarProjetoStatus(
        projetos,
        [
          "Fechado",
          "FECHADO"
        ]
      )

  };


  return funil;

}


/* ==========================================================
   SINCRONIZAÇÃO
========================================================== */

function sincronizarCRM(
  versaoCliente
) {

  const versaoAtual =
    obterVersaoDados();


  const mesmaVersao =
    String(
      versaoCliente || ""
    ) ===
    String(
      versaoAtual
    );


  if (
    mesmaVersao
  ) {

    return respostaJSON({

      sucesso: true,

      alterado:
        false,

      versao:
        versaoAtual,

      timestamp:
        new Date().toISOString(),

      mensagem:
        "Nenhuma alteração nova."

    });

  }


  const projetos =
    lerPlanilha(
      false
    );


  return respostaJSON({

    sucesso: true,

    alterado:
      true,

    versao:
      versaoAtual,

    total:
      projetos.length,

    projetos:
      projetos,

    timestamp:
      new Date().toISOString(),

    mensagem:
      "Dados atualizados."

  });

}


/* ==========================================================
   STATUS DO SISTEMA
========================================================== */

function obterStatusSistema() {

  return respostaJSON({

    sucesso: true,

    sistema:
      CONFIG.SYSTEM_NAME,

    versao:
      CONFIG.SYSTEM_VERSION,

    dadosVersao:
      obterVersaoDados(),

    servidor:
      "online",

    timestamp:
      new Date().toISOString(),

    modulos: {

      projetos:
        true,

      leads:
        true,

      clientes:
        true,

      arquitetos:
        true,

      fornecedores:
        true,

      orcamentos:
        true,

      followups:
        true,

      agenda:
        true,

      tarefas:
        true,

      dashboard:
        true,

      logs:
        true

    }

  });

}


/* ==========================================================
   LOGS / AUDITORIA
========================================================== */

function registrarAuditoria(
  usuario,
  acao,
  modulo,
  registro,
  anterior,
  novo,
  detalhes
) {

  try {

    const planilha =
      obterPlanilha();


    let aba =
      planilha.getSheetByName(
        CRM_SHEETS.LOGS
      );


    if (
      !aba
    ) {

      aba =
        planilha.insertSheet(
          CRM_SHEETS.LOGS
        );


      aba
        .getRange(
          1,
          1,
          1,
          CRM_HEADERS.LOGS.length
        )
        .setValues([
          CRM_HEADERS.LOGS
        ]);


      aba
        .getRange(
          1,
          1,
          1,
          CRM_HEADERS.LOGS.length
        )
        .setFontWeight(
          "bold"
        );

    }


    const id =
      gerarIdCRM(
        "LOG"
      );


    aba.appendRow([

      id,

      new Date(),

      usuario ||
      "SISTEMA",

      acao ||
      "",

      modulo ||
      "",

      registro ||
      "",

      limitarTexto(
        anterior,
        5000
      ),

      limitarTexto(
        novo,
        5000
      ),

      "WEB_APP",

      limitarTexto(
        detalhes,
        5000
      )

    ]);

  }

  catch (erro) {

    console.error(
      "Erro no log:",
      erro
    );

  }

}


/* ==========================================================
   LOG PÚBLICO
========================================================== */

function registrarAuditoriaPublica(
  usuario,
  acao,
  modulo,
  registro,
  anterior,
  novo,
  detalhes
) {

  try {

    registrarAuditoria(

      usuario,
      acao,
      modulo,
      registro,
      anterior,
      novo,
      detalhes

    );

  }

  catch (erro) {

    // Nunca deixar log derrubar login.

  }

}


/* ==========================================================
   REGISTRAR ERRO
========================================================== */

function registrarErro(
  erro,
  origem
) {

  try {

    registrarAuditoria(

      obterUsuarioSistemaAtual(),

      "ERRO",

      "SISTEMA",

      origem ||
      "",

      "",

      "",

      obterMensagemErro(
        erro
      )

    );

  }

  catch (erroLog) {

    console.error(
      erro
    );

  }

}


/* ==========================================================
   USUÁRIO ATUAL
========================================================== */

function obterUsuarioSistemaAtual() {

  return (
    CONFIG.ADMIN_USERNAME ||
    "SISTEMA"
  );

}


/* ==========================================================
   SESSÃO OPCIONAL
========================================================== */

function obterSessaoAtualOpcional() {

  return null;

}


/* ==========================================================
   DATA
========================================================== */

function converterData(
  valor
) {

  if (
    !valor
  ) {

    return null;

  }


  if (
    Object.prototype.toString.call(
      valor
    ) ===
    "[object Date]"
  ) {

    if (
      isNaN(
        valor.getTime()
      )
    ) {

      return null;

    }


    return valor;

  }


  const texto =
    String(
      valor
    ).trim();


  if (
    !texto
  ) {

    return null;

  }


  const data =
    new Date(
      texto
    );


  if (
    !isNaN(
      data.getTime()
    )
  ) {

    return data;

  }


  const partes =
    texto.split(
      "/"
    );


  if (
    partes.length === 3
  ) {

    const dia =
      Number(
        partes[0]
      );

    const mes =
      Number(
        partes[1]
      ) - 1;

    const ano =
      Number(
        partes[2]
      );


    const brasileira =
      new Date(
        ano,
        mes,
        dia
      );


    if (
      !isNaN(
        brasileira.getTime()
      )
    ) {

      return brasileira;

    }

  }


  return null;

}


/* ==========================================================
   ZERAR HORA
========================================================== */

function zerarHora(
  data
) {

  const nova =
    new Date(
      data
    );


  nova.setHours(
    0,
    0,
    0,
    0
  );


  return nova;

}


/* ==========================================================
   WHATSAPP
========================================================== */

function extrairWhatsAppUrl(
  valor
) {

  const texto =
    String(
      valor || ""
    ).trim();


  if (
    !texto
  ) {

    return "";

  }


  const url =
    texto.match(
      /(https?:\/\/[^\s]+)/i
    );


  if (
    url
  ) {

    return url[1];

  }


  let numero =
    texto.replace(
      /\D/g,
      ""
    );


  if (
    numero.length === 10 ||
    numero.length === 11
  ) {

    numero =
      "55" +
      numero;

  }


  if (
    numero.length >= 12
  ) {

    return (
      "https://wa.me/" +
      numero
    );

  }


  return "";

}


/* ==========================================================
   EXTRAIR ARQUIVOS
========================================================== */

function extrairArquivos(
  valor
) {

  const texto =
    String(
      valor || ""
    ).trim();


  if (
    !texto
  ) {

    return [];

  }


  const arquivos = [];


  const linhas =
    texto.split(
      /\r?\n/
    );


  linhas.forEach(
    function(linha) {

      const item =
        linha.trim();


      if (
        !item
      ) {

        return;

      }


      let nome =
        item;


      let url =
        "";


      const seta =
        item.indexOf(
          "→"
        );


      if (
        seta !== -1
      ) {

        nome =
          item.substring(
            0,
            seta
          ).trim();


        url =
          item.substring(
            seta + 1
          ).trim();

      }


      const urlMatch =
        item.match(
          /(https?:\/\/[^\s]+)/i
        );


      if (
        !url &&
        urlMatch
      ) {

        url =
          urlMatch[1];


        nome =
          item
            .replace(
              url,
              ""
            )
            .replace(
              /→/g,
              ""
            )
            .trim();

      }


      if (
        url
      ) {

        arquivos.push({

          nome:
            nome ||
            "Arquivo",

          url:
            url

        });

      }

    }
  );


  return arquivos;

}


/* ==========================================================
   LIMPAR NOME
========================================================== */

function limparNome(
  nome
) {

  return String(
    nome || ""
  )

    .replace(
      /[\\\/:*?"<>|#%{}]/g,
      ""
    )

    .replace(
      /\s+/g,
      " "
    )

    .trim()

    .substring(
      0,
      100
    );

}


/* ==========================================================
   LIMITAR TEXTO
========================================================== */

function limitarTexto(
  texto,
  limite
) {

  const valor =
    String(
      texto || ""
    );


  if (
    valor.length <=
    limite
  ) {

    return valor;

  }


  return valor.substring(
    0,
    limite
  ) +
  "...";

}


/* ==========================================================
   MENSAGEM DE ERRO
========================================================== */

function obterMensagemErro(
  erro
) {

  if (
    erro &&
    erro.message
  ) {

    return String(
      erro.message
    );

  }


  return "Erro interno do servidor.";

}


/* ==========================================================
   RESPOSTA JSON
========================================================== */

function respostaJSON(
  objeto
) {

  if (
    !objeto
  ) {

    objeto = {};

  }


  if (
    !objeto.timestamp
  ) {

    objeto.timestamp =
      new Date().toISOString();

  }


  return ContentService

    .createTextOutput(
      JSON.stringify(
        objeto
      )
    )

    .setMimeType(
      ContentService.MimeType.JSON
    );

}


/* ==========================================================
   TESTE COMPLETO
========================================================== */

function testarSistema() {

  Logger.log(
    "========================================"
  );


  Logger.log(
    "ARQSELECT — CRM PREMIUM"
  );


  Logger.log(
    "========================================"
  );


  Logger.log(
    "Script ID: " +
    ScriptApp.getScriptId()
  );


  Logger.log(
    "Sistema: " +
    CONFIG.SYSTEM_NAME
  );


  Logger.log(
    "Versão: " +
    CONFIG.SYSTEM_VERSION
  );


  Logger.log(
    "Usuário: " +
    CONFIG.ADMIN_USERNAME
  );


  Logger.log(
    "Planilha ID: " +
    CONFIG.SPREADSHEET_ID
  );


  const planilha =
    obterPlanilha();


  Logger.log(
    "Planilha encontrada: " +
    planilha.getName()
  );


  const aba =
    obterAbaProjetos();


  Logger.log(
    "Aba encontrada: " +
    aba.getName()
  );


  const pasta =
    obterPastaPrincipal();


  Logger.log(
    "Pasta Drive: " +
    pasta.getName()
  );


  Logger.log(
    "URL Drive: " +
    pasta.getUrl()
  );


  Logger.log(
    "Versão dos dados: " +
    obterVersaoDados()
  );


  Logger.log(
    "========================================"
  );


  Logger.log(
    "SISTEMA CONFIGURADO CORRETAMENTE"
  );


  Logger.log(
    "========================================"
  );

}


/* ==========================================================
   TESTE LOGIN
========================================================== */

function testarLogin() {

  const resposta =
    loginAdmin({

      usuario:
        CONFIG.ADMIN_USERNAME,

      senha:
        CONFIG.ADMIN_PASSWORD

    });


  Logger.log(
    resposta.getContent()
  );

}


/* ==========================================================
   TESTE PLANILHA
========================================================== */

function testarPlanilha() {

  const projetos =
    lerPlanilha(
      false
    );


  Logger.log(
    "Total de registros: " +
    projetos.length
  );


  if (
    projetos.length > 0
  ) {

    Logger.log(
      JSON.stringify(
        projetos[0],
        null,
        2
      )
    );

  }

}


/* ==========================================================
   TESTE SESSÃO
========================================================== */

function testarSessao() {

  const login =
    loginAdmin({

      usuario:
        CONFIG.ADMIN_USERNAME,

      senha:
        CONFIG.ADMIN_PASSWORD

    });


  const dados =
    JSON.parse(
      login.getContent()
    );


  if (
    !dados.token
  ) {

    Logger.log(
      "LOGIN FALHOU"
    );

    return;

  }


  Logger.log(
    "TOKEN GERADO:"
  );


  Logger.log(
    dados.token
  );


  const validacao =
    validarSessaoAdmin({

      token:
        dados.token

    });


  Logger.log(
    validacao.getContent()
  );

}


/* ==========================================================
   TESTE API
========================================================== */

function testarAPI() {

  return respostaJSON({

    sucesso: true,

    sistema:
      "ARQSELECT",

    versao:
      CONFIG.SYSTEM_VERSION,

    mensagem:
      "API funcionando.",

    scriptId:
      ScriptApp.getScriptId(),

    spreadsheetId:
      CONFIG.SPREADSHEET_ID,

    sheet:
      CONFIG.SHEET_NAME,

    webApp:
      "https://script.google.com/macros/s/AKfycbz_jLzNa87U_himraaCczzqGpQdq63AyIVogQ9-YGnqXuQYl3OSJfV4E7xYfPdnv8-d/exec",

    dadosVersao:
      obterVersaoDados(),

    horario:
      new Date().toISOString()

  });

}


/* ==========================================================
   TESTE DASHBOARD
========================================================== */

function testarDashboard() {

  const resposta =
    obterDashboard();


  Logger.log(
    resposta.getContent()
  );

}


/* ==========================================================
   TESTE SINCRONIZAÇÃO
========================================================== */

function testarSincronizacao() {

  const resposta =
    sincronizarCRM(
      ""
    );


  Logger.log(
    resposta.getContent()
  );

}


/* ==========================================================
   TESTE GERAÇÃO DE ID
========================================================== */

function testarIDs() {

  Logger.log(
    gerarIdCRM(
      "LEAD"
    )
  );


  Logger.log(
    gerarIdCRM(
      "PROJ"
    )
  );


  Logger.log(
    gerarIdCRM(
      "ORC"
    )
  );


  Logger.log(
    gerarIdCRM(
      "TASK"
    )
  );

}