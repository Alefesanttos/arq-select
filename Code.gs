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
    "",

  ADMIN_PASSWORD:
    "",


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
    "4.0.0"

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


    if (v2IsAction(acao)) return v2HandleGet(acao, params);

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


    if (v2IsAction(acao)) return v2HandlePost(acao, dados);

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


    const adminCred = v2GetAdminCredentials();
    const usuarioValido = usuario === adminCred.usuario;
    const senhaValida = v2Hash(senha) === adminCred.hash;


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

  const u = String(usuario || "").trim();
  const admin = v2GetAdminCredentials();
  if (u && u === admin.usuario) return "ADMIN";
  const user = v2FindUserByLogin(u);
  if (user && user.PERFIL) return String(user.PERFIL).toUpperCase();
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
      true
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

  return (v2GetAdminCredentials().usuario || "SISTEMA");

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

/* ARQSELECT 2.0 */
const V2={SHEETS:{USERS:"USUARIOS",SUPPLIERS:"ARQSELECT – FORNECEDORES",ARCHITECTS:"CRM - ARQUITETOS",PROJECTS:"PROJETOS",REQUESTS:"SOLICITACOES",PROPOSALS:"PROPOSTAS",PRODUCTS:"PRODUTOS",SERVICES:"SERVICOS",MESSAGES:"MENSAGENS",NOTIFICATIONS:"CRM - NOTIFICAÇÕES",TIMELINE:"HISTORICO",FAVORITES:"FAVORITOS",CATEGORIES:"CATEGORIAS"},SESSION_PREFIX:"ARQSELECT_V2_SESSION_"};
const V2_HEADERS={USERS:["ID","LOGIN","NOME","EMAIL","TELEFONE","PERFIL","STATUS","REF_ID","SENHA_HASH","DATA_CRIACAO","DATA_ATUALIZACAO"],REQUESTS:["ID","PROJETO_ID","ARQUITETO_ID","FORNECEDOR_ID","CATEGORIA","PRODUTO","SERVICO","QUANTIDADE","UNIDADE","LOCALIZACAO","PRAZO","DESCRICAO","STATUS","DATA_CRIACAO","DATA_ATUALIZACAO"],PROPOSALS:["ID","SOLICITACAO_ID","PROJETO_ID","FORNECEDOR_ID","ARQUITETO_ID","VALOR","FRETE","DESCONTO","VALOR_TOTAL","PRAZO","PAGAMENTO","VALIDADE","GARANTIA","OBSERVACOES","ANEXOS","STATUS","DATA_CRIACAO","DATA_ATUALIZACAO"],PRODUCTS:["ID","FORNECEDOR_ID","NOME","CODIGO","CATEGORIA","MARCA","DESCRICAO","UNIDADE","PRECO_BASE","GARANTIA","IMAGENS","FICHA_TECNICA","STATUS","DATA_CRIACAO","DATA_ATUALIZACAO"],SERVICES:["ID","FORNECEDOR_ID","NOME","CATEGORIA","DESCRICAO","REGIAO","PRECO_BASE","GARANTIA","STATUS","DATA_CRIACAO","DATA_ATUALIZACAO"],MESSAGES:["ID","PROJETO_ID","SOLICITACAO_ID","REMETENTE_ID","DESTINATARIO_ID","MENSAGEM","ANEXOS","LIDA","DATA_CRIACAO"],TIMELINE:["ID","PROJETO_ID","SOLICITACAO_ID","PROPOSTA_ID","USUARIO_ID","ACAO","DESCRICAO","DATA"],FAVORITES:["ID","USUARIO_ID","TIPO","REGISTRO_ID","DATA"],CATEGORIES:["ID","NOME","TIPO","STATUS","DATA_CRIACAO"],NOTIFICATIONS:["ID","USUARIO_ID","TIPO","TITULO","MENSAGEM","REGISTRO_ID","LINK","LIDA","DATA","DATA_LEITURA"]};
function v2Hash(v){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(v||""),Utilities.Charset.UTF_8).map(b=>{b=b<0?b+256:b;return(b<16?"0":"")+b.toString(16)}).join("")}
function v2GetAdminCredentials(){const p=PropertiesService.getScriptProperties();return{usuario:p.getProperty("ARQSELECT_ADMIN_USERNAME")||CONFIG.ADMIN_USERNAME||"",hash:p.getProperty("ARQSELECT_ADMIN_PASSWORD_HASH")||(CONFIG.ADMIN_PASSWORD?v2Hash(CONFIG.ADMIN_PASSWORD):"")}}
function v2SetupAdmin(usuario,senha){usuario=String(usuario||"").trim();senha=String(senha||"");if(!usuario||senha.length<8)throw Error("Usuário obrigatório e senha mínima de 8 caracteres.");const p=PropertiesService.getScriptProperties();p.setProperty("ARQSELECT_ADMIN_USERNAME",usuario);p.setProperty("ARQSELECT_ADMIN_PASSWORD_HASH",v2Hash(senha));return{sucesso:true,usuario}}
function v2EnsureSheet(name,headers){const ss=obterPlanilha();let sh=ss.getSheetByName(name);if(!sh)sh=ss.insertSheet(name);if(sh.getLastRow()===0)sh.getRange(1,1,1,headers.length).setValues([headers]);return sh}
function v2EnsureSheets(){Object.keys(V2_HEADERS).forEach(k=>v2EnsureSheet(V2.SHEETS[k],V2_HEADERS[k]));return{sucesso:true,abas:Object.values(V2.SHEETS)}}
function v2Rows(name){const key=Object.keys(V2.SHEETS).find(k=>V2.SHEETS[k]===name);const sh=v2EnsureSheet(name,V2_HEADERS[key]||["ID"]);const v=sh.getDataRange().getValues();if(v.length<2)return[];const h=v[0].map(String);return v.slice(1).filter(r=>r.some(x=>String(x).trim()!=="")).map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]);return o})}
function v2FindById(name,id){return v2Rows(name).find(r=>String(r.ID)===String(id))||null}
function v2FindUserByLogin(login){const x=String(login||"").trim().toLowerCase();return v2Rows(V2.SHEETS.USERS).find(r=>String(r.LOGIN||"").toLowerCase()===x)||null}
function v2NextId(p){return p+"-"+Utilities.getUuid().split("-")[0].toUpperCase()}
function v2SessionCreate(u){const token=Utilities.getUuid()+"-"+Utilities.getUuid(),exp=Date.now()+CONFIG.SESSION_HOURS*3600000;CacheService.getScriptCache().put(V2.SESSION_PREFIX+token,JSON.stringify({usuario:u.LOGIN||u.usuario,id:u.ID||"ADMIN",perfil:u.PERFIL||"ADMIN",expiraEm:exp}),CONFIG.SESSION_HOURS*60);return{token,expiraEm:exp}}
function v2Session(token){const raw=CacheService.getScriptCache().get(V2.SESSION_PREFIX+String(token||""));if(!raw)return null;try{const s=JSON.parse(raw);return Number(s.expiraEm)>Date.now()?s:null}catch(e){return null}}
function v2Require(token,roles){const s=v2Session(token);if(!s)throw Error("Sessão inválida ou expirada.");if(roles&&roles.length&&!roles.includes(String(s.perfil).toUpperCase()))throw Error("Acesso não autorizado.");return s}
function v2IsAction(a){return ["login_v2","logout_v2","me","dashboard_v2","projetos_v2","projeto_v2","solicitacoes","solicitacao_v2","propostas","proposta_v2","fornecedores_v2","fornecedor_v2","produtos","produto_v2","servicos","mensagens","notificacoes","timeline","buscar_v2","admin_v2","usuarios_v2","criar_projeto_v2","criar_solicitacao","criar_proposta","enviar_mensagem","marcar_notificacao","favoritar","atualizar_status_v2","aprovar_proposta","recusar_proposta","revisao_proposta"].includes(a)}
function v2HandleGet(a,p){if(a==="login_v2")return respostaJSON({sucesso:false,mensagem:"Use POST para login."});if(a==="logout_v2"){CacheService.getScriptCache().remove(V2.SESSION_PREFIX+String(p.token||""));return respostaJSON({sucesso:true})}const s=v2Require(p.token);if(a==="me")return respostaJSON({sucesso:true,usuario:v2PublicUser(s)});if(a==="dashboard_v2")return respostaJSON({sucesso:true,dashboard:v2Dashboard(s)});if(a==="projetos_v2")return v2ListProjects(s);if(a==="projeto_v2")return respostaJSON({sucesso:true,projeto:v2ProjectDetail(p.id,s)});if(a==="solicitacoes")return v2ListOwned(V2.SHEETS.REQUESTS,s);if(a==="solicitacao_v2")return respostaJSON({sucesso:true,solicitacao:v2RequestDetail(p.id)});if(a==="propostas")return v2ListOwned(V2.SHEETS.PROPOSALS,s);if(a==="proposta_v2")return respostaJSON({sucesso:true,proposta:v2FindById(V2.SHEETS.PROPOSALS,p.id)});if(a==="fornecedores_v2")return respostaJSON({sucesso:true,fornecedores:v2Rows(V2.SHEETS.SUPPLIERS).filter(r=>!p.q||Object.values(r).some(v=>String(v).toLowerCase().includes(String(p.q).toLowerCase())))});if(a==="fornecedor_v2")return respostaJSON({sucesso:true,fornecedor:v2FindById(V2.SHEETS.SUPPLIERS,p.id)});if(a==="produtos")return respostaJSON({sucesso:true,produtos:v2Rows(V2.SHEETS.PRODUCTS)});if(a==="produto_v2")return respostaJSON({sucesso:true,produto:v2FindById(V2.SHEETS.PRODUCTS,p.id)});if(a==="servicos")return respostaJSON({sucesso:true,servicos:v2Rows(V2.SHEETS.SERVICES)});if(a==="mensagens")return respostaJSON({sucesso:true,mensagens:v2Messages(s,p.projeto_id)});if(a==="notificacoes")return respostaJSON({sucesso:true,notificacoes:v2Notifications(s)});if(a==="timeline")return respostaJSON({sucesso:true,timeline:v2Timeline(p.projeto_id)});if(a==="buscar_v2")return respostaJSON({sucesso:true,resultados:v2Search(p.q)});if(a==="admin_v2"){v2Require(p.token,["ADMIN"]);return respostaJSON({sucesso:true,dashboard:v2AdminDashboard()})}if(a==="usuarios_v2"){v2Require(p.token,["ADMIN"]);return respostaJSON({sucesso:true,usuarios:v2Rows(V2.SHEETS.USERS).map(v2PublicUser)})}return respostaJSON({sucesso:false,mensagem:"Ação não encontrada."})}
function v2HandlePost(a,d){if(a==="login_v2")return v2Login(d);if(a==="logout_v2"){CacheService.getScriptCache().remove(V2.SESSION_PREFIX+String(d.token||""));return respostaJSON({sucesso:true})}const s=v2Require(d.token);if(a==="criar_projeto_v2")return respostaJSON(v2CreateProject(d,s));if(a==="criar_solicitacao")return respostaJSON(v2CreateRequest(d,s));if(a==="criar_proposta")return respostaJSON(v2CreateProposal(d,s));if(a==="enviar_mensagem")return respostaJSON(v2SendMessage(d,s));if(a==="marcar_notificacao")return respostaJSON(v2MarkNotification(d,s));if(a==="favoritar")return respostaJSON(v2Favorite(d,s));if(a==="atualizar_status_v2")return respostaJSON(v2UpdateStatus(d,s));if(a==="aprovar_proposta")return respostaJSON(v2UpdateStatus({tipo:"PROPOSTA",id:d.id,status:"APROVADA"},s));if(a==="recusar_proposta")return respostaJSON(v2UpdateStatus({tipo:"PROPOSTA",id:d.id,status:"RECUSADA"},s));if(a==="revisao_proposta")return respostaJSON(v2UpdateStatus({tipo:"PROPOSTA",id:d.id,status:"REVISAO_SOLICITADA"},s));return respostaJSON({sucesso:false,mensagem:"Ação não encontrada."})}
function v2Login(d){v2EnsureSheets();const login=String(d.usuario||d.username||"").trim(),senha=String(d.senha||d.password||"");const ad=v2GetAdminCredentials();if(ad.usuario&&login===ad.usuario&&v2Hash(senha)===ad.hash){const ss=v2SessionCreate({LOGIN:login,ID:"ADMIN",PERFIL:"ADMIN"});return respostaJSON({sucesso:true,token:ss.token,expiraEm:ss.expiraEm,usuario:{ID:"ADMIN",LOGIN:login,NOME:"Administrador",PERFIL:"ADMIN",STATUS:"ATIVO"}})}const u=v2FindUserByLogin(login);if(!u||String(u.STATUS).toUpperCase()!=="ATIVO"||v2Hash(senha)!==String(u.SENHA_HASH))return respostaJSON({sucesso:false,mensagem:"Usuário ou senha inválidos."});const ss=v2SessionCreate(u);return respostaJSON({sucesso:true,token:ss.token,expiraEm:ss.expiraEm,usuario:v2PublicUser(u)})}
function v2PublicUser(u){return{ID:u.ID||u.id,LOGIN:u.LOGIN||u.usuario,NOME:u.NOME||u.nome,EMAIL:u.EMAIL||u.email,TELEFONE:u.TELEFONE||u.telefone,PERFIL:String(u.PERFIL||u.perfil||"").toUpperCase(),STATUS:u.STATUS||u.status,REF_ID:u.REF_ID||u.ref_id}}
function v2Write(name,headers,o){const sh=v2EnsureSheet(name,headers),now=new Date();sh.appendRow(headers.map(h=>["DATA","DATA_CRIACAO","DATA_ATUALIZACAO"].includes(h)?now:(o[h]??"")));return o}
function v2Notify(uid,t,tit,msg,rid,link){v2Write(V2.SHEETS.NOTIFICATIONS,V2_HEADERS.NOTIFICATIONS,{ID:v2NextId("NOT"),USUARIO_ID:uid,TIPO:t,TITULO:tit,MENSAGEM:msg,REGISTRO_ID:rid||"",LINK:link||"",LIDA:"NÃO"})}
function v2TimelineAdd(pid,sid,prid,uid,a,d){v2Write(V2.SHEETS.TIMELINE,V2_HEADERS.TIMELINE,{ID:v2NextId("HIS"),PROJETO_ID:pid||"",SOLICITACAO_ID:sid||"",PROPOSTA_ID:prid||"",USUARIO_ID:uid||"",ACAO:a,DESCRICAO:d})}
function v2LoginOnlyUserRole(s,role){if(s.perfil!==role&&s.perfil!=="ADMIN")throw Error("Sem permissão.")}
function v2CreateProject(d,s){v2LoginOnlyUserRole(s,"ARQUITETO");const u=v2FindUserByLogin(s.usuario),id=v2NextId("PROJ"),sh=obterAbaProjetos(),h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0],o={"ID PROJETO":id,"NOME DO PROJETO":d.nome||"","ARQUITETO":d.arquiteto||s.usuario,"E-MAIL":d.email||u?.EMAIL||"","CLIENTE":d.cliente||"","CIDADE":d.cidade||"","ESTADO":d.estado||"","DESCRIÇÃO":d.descricao||"","STATUS":"Novo","DATA DE CRIAÇÃO":new Date()};sh.appendRow(h.map(k=>o[k]??""));incrementarVersaoDados();v2TimelineAdd(id,"","",u?.ID||s.usuario,"PROJETO_CRIADO","Projeto criado");return{sucesso:true,id,mensagem:"Projeto criado com sucesso."}}
function v2CreateRequest(d,s){v2LoginOnlyUserRole(s,"ARQUITETO");const u=v2FindUserByLogin(s.usuario),o={ID:v2NextId("REQ"),PROJETO_ID:d.projeto_id||"",ARQUITETO_ID:u?.ID||s.usuario,FORNECEDOR_ID:d.fornecedor_id||"",CATEGORIA:d.categoria||"",PRODUTO:d.produto||"",SERVICO:d.servico||"",QUANTIDADE:d.quantidade||"",UNIDADE:d.unidade||"",LOCALIZACAO:d.localizacao||"",PRAZO:d.prazo||"",DESCRICAO:d.descricao||"",STATUS:"ABERTA"};v2Write(V2.SHEETS.REQUESTS,V2_HEADERS.REQUESTS,o);v2TimelineAdd(o.PROJETO_ID,o.ID,"",u?.ID||s.usuario,"SOLICITACAO_CRIADA","Solicitação criada");if(o.FORNECEDOR_ID)v2Notify(o.FORNECEDOR_ID,"SOLICITACAO","Nova solicitação","Uma nova solicitação foi enviada.",o.ID,"solicitacao.html?id="+o.ID);return o}
function v2CreateProposal(d,s){v2LoginOnlyUserRole(s,"FORNECEDOR");const u=v2FindUserByLogin(s.usuario),req=v2FindById(V2.SHEETS.REQUESTS,d.solicitacao_id),v=n=>Number(String(n||0).replace(/\./g,"").replace(",","."))||0,valor=v(d.valor),frete=v(d.frete),desconto=v(d.desconto),o={ID:v2NextId("PROP"),SOLICITACAO_ID:d.solicitacao_id||"",PROJETO_ID:d.projeto_id||req?.PROJETO_ID||"",FORNECEDOR_ID:u?.ID||s.usuario,ARQUITETO_ID:req?.ARQUITETO_ID||d.arquiteto_id||"",VALOR:valor,FRETE:frete,DESCONTO:desconto,VALOR_TOTAL:Math.max(0,valor+frete-desconto),PRAZO:d.prazo||"",PAGAMENTO:d.pagamento||"",VALIDADE:d.validade||"",GARANTIA:d.garantia||"",OBSERVACOES:d.observacoes||"",ANEXOS:d.anexos||"",STATUS:"ENVIADA"};v2Write(V2.SHEETS.PROPOSALS,V2_HEADERS.PROPOSALS,o);v2TimelineAdd(o.PROJETO_ID,o.SOLICITACAO_ID,o.ID,u?.ID||s.usuario,"PROPOSTA_ENVIADA","Proposta enviada");if(o.ARQUITETO_ID)v2Notify(o.ARQUITETO_ID,"PROPOSTA","Nova proposta","Você recebeu uma nova proposta.",o.ID,"proposta.html?id="+o.ID);return o}
function v2SendMessage(d,s){const u=v2FindUserByLogin(s.usuario),o={ID:v2NextId("MSG"),PROJETO_ID:d.projeto_id||"",SOLICITACAO_ID:d.solicitacao_id||"",REMETENTE_ID:u?.ID||s.usuario,DESTINATARIO_ID:d.destinatario_id||"",MENSAGEM:String(d.mensagem||"").trim(),ANEXOS:d.anexos||"",LIDA:"NÃO"};if(!o.MENSAGEM)throw Error("Mensagem vazia.");v2Write(V2.SHEETS.MESSAGES,V2_HEADERS.MESSAGES,o);if(o.DESTINATARIO_ID)v2Notify(o.DESTINATARIO_ID,"MENSAGEM","Nova mensagem",o.MENSAGEM.slice(0,120),o.ID,"mensagens.html?projeto_id="+o.PROJETO_ID);return o}
function v2Messages(s,pid){return v2Rows(V2.SHEETS.MESSAGES).filter(r=>pid?String(r.PROJETO_ID)===String(pid):String(r.REMETENTE_ID)===String(s.id)||String(r.DESTINATARIO_ID)===String(s.id))}
function v2Notifications(s){return v2Rows(V2.SHEETS.NOTIFICATIONS).filter(r=>String(r.USUARIO_ID)===String(s.id)).sort((a,b)=>new Date(b.DATA)-new Date(a.DATA))}
function v2MarkNotification(d,s){const sh=v2EnsureSheet(V2.SHEETS.NOTIFICATIONS,V2_HEADERS.NOTIFICATIONS),v=sh.getDataRange().getValues(),h=v[0].map(String),ii=h.indexOf("ID"),iu=h.indexOf("USUARIO_ID"),il=h.indexOf("LIDA"),id=h.indexOf("DATA_LEITURA");for(let r=1;r<v.length;r++)if(String(v[r][ii])===String(d.id)&&String(v[r][iu])===String(s.id)){v[r][il]="SIM";if(id>=0)v[r][id]=new Date();sh.getRange(r+1,1,1,h.length).setValues([v[r]]);return{sucesso:true}}throw Error("Notificação não encontrada.")}
function v2Favorite(d,s){const rows=v2Rows(V2.SHEETS.FAVORITES),old=rows.find(r=>String(r.USUARIO_ID)===String(s.id)&&String(r.TIPO)===String(d.tipo)&&String(r.REGISTRO_ID)===String(d.registro_id));if(old)return{sucesso:true,removido:true,id:old.ID};const o={ID:v2NextId("FAV"),USUARIO_ID:s.id,TIPO:d.tipo||"",REGISTRO_ID:d.registro_id||""};v2Write(V2.SHEETS.FAVORITES,V2_HEADERS.FAVORITES,o);return{sucesso:true,adicionado:true,id:o.ID}}
function v2UpdateStatus(d,s){const type=String(d.tipo||"SOLICITACAO").toUpperCase(),name=type==="PROPOSTA"?V2.SHEETS.PROPOSALS:V2.SHEETS.REQUESTS,keys=type==="PROPOSTA"?V2_HEADERS.PROPOSALS:V2_HEADERS.REQUESTS,sh=v2EnsureSheet(name,keys),v=sh.getDataRange().getValues(),h=v[0].map(String),ii=h.indexOf("ID"),is=h.indexOf("STATUS"),iu=h.indexOf("DATA_ATUALIZACAO");for(let r=1;r<v.length;r++)if(String(v[r][ii])===String(d.id)){v[r][is]=d.status;if(iu>=0)v[r][iu]=new Date();sh.getRange(r+1,1,1,h.length).setValues([v[r]]);incrementarVersaoDados();return{sucesso:true}}throw Error("Registro não encontrado.")}
function v2ListOwned(name,s){const rows=v2Rows(name);if(s.perfil==="ADMIN")return respostaJSON({sucesso:true,registros:rows});const u=v2FindUserByLogin(s.usuario),id=u?.ID,ref=u?.REF_ID;return respostaJSON({sucesso:true,registros:rows.filter(r=>String(r.ARQUITETO_ID)===String(id)||String(r.FORNECEDOR_ID)===String(id)||String(r.ARQUITETO_ID)===String(ref)||String(r.FORNECEDOR_ID)===String(ref))})}
function v2ListProjects(s){let rows=lerPlanilha(true);if(s.perfil==="ARQUITETO"){const u=v2FindUserByLogin(s.usuario);rows=rows.filter(p=>String(p["E-MAIL"]||"").toLowerCase()===String(u?.EMAIL||"").toLowerCase()||String(p.ARQUITETO||"")===String(u?.NOME||s.usuario))}return respostaJSON({sucesso:true,projetos:rows,versao:obterVersaoDados()})}
function v2ProjectDetail(id,s){const p=obterProjetoInterno(id);if(!p)throw Error("Projeto não encontrado.");return Object.assign({},p,{solicitacoes:v2Rows(V2.SHEETS.REQUESTS).filter(r=>String(r.PROJETO_ID)===String(id)),propostas:v2Rows(V2.SHEETS.PROPOSALS).filter(r=>String(r.PROJETO_ID)===String(id)),timeline:v2Timeline(id),mensagens:v2Messages(s,id)})}
function v2RequestDetail(id){const r=v2FindById(V2.SHEETS.REQUESTS,id);if(!r)throw Error("Solicitação não encontrada.");return Object.assign({},r,{propostas:v2Rows(V2.SHEETS.PROPOSALS).filter(p=>String(p.SOLICITACAO_ID)===String(id)),timeline:v2Timeline(r.PROJETO_ID)})}
function v2Timeline(id){return v2Rows(V2.SHEETS.TIMELINE).filter(r=>!id||String(r.PROJETO_ID)===String(id)).sort((a,b)=>new Date(b.DATA)-new Date(a.DATA))}
function v2Dashboard(s){const d=v2AdminDashboard();if(s.perfil!=="ADMIN"){const u=v2FindUserByLogin(s.usuario),id=u?.ID,req=v2Rows(V2.SHEETS.REQUESTS).filter(r=>String(r.ARQUITETO_ID)===String(id)||String(r.FORNECEDOR_ID)===String(id)),prop=v2Rows(V2.SHEETS.PROPOSALS).filter(r=>String(r.ARQUITETO_ID)===String(id)||String(r.FORNECEDOR_ID)===String(id));return{projetos:lerPlanilha(true).length,solicitacoes:req.length,propostas:prop.length,mensagens:v2Messages(s).filter(x=>String(x.LIDA).toUpperCase()!=="SIM").length,notificacoes:v2Notifications(s).filter(x=>String(x.LIDA).toUpperCase()!=="SIM").length,projetosAtivos:lerPlanilha(true).filter(x=>!["Concluído","CONCLUÍDO","Cancelado","CANCELADO"].includes(String(x.STATUS))).length}}return d}
function v2AdminDashboard(){return{usuarios:v2Rows(V2.SHEETS.USERS).length,arquitetos:v2Rows(V2.SHEETS.ARCHITECTS).length,fornecedores:v2Rows(V2.SHEETS.SUPPLIERS).length,projetos:lerPlanilha(true).length,solicitacoes:v2Rows(V2.SHEETS.REQUESTS).length,propostas:v2Rows(V2.SHEETS.PROPOSALS).length,mensagens:v2Rows(V2.SHEETS.MESSAGES).length,notificacoes:v2Rows(V2.SHEETS.NOTIFICATIONS).length}}
function v2Search(q){const x=String(q||"").toLowerCase();const out=[];[["fornecedor",V2.SHEETS.SUPPLIERS],["produto",V2.SHEETS.PRODUCTS],["servico",V2.SHEETS.SERVICES]].forEach(([tipo,n])=>v2Rows(n).filter(r=>!x||Object.values(r).some(v=>String(v).toLowerCase().includes(x))).slice(0,25).forEach(registro=>out.push({tipo,registro})));return out}
function ARQSELECT_2_0_SETUP(){v2EnsureSheets();return"Abas ARQSELECT 2.0 criadas/verificadas."}
