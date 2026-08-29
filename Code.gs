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
    "3.1.0",

  /* E-mail que recebe respostas dos fornecedores.
     Se vazio, usa o e-mail efetivo do proprietário do Web App. */
  NOTIFICATION_EMAIL:
    ""

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

    // Compatibilidade: alguns handlers legados/V4 usam o nome "dados".
    // No GET, os parâmetros chegam em "params"; mantemos ambos apontando
    // para o mesmo objeto para evitar ReferenceError e divergência de contrato.
    const dados = params;

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

    // CADASTRO PÚBLICO — compatibilidade com os formulários do GitHub Pages
    if (acao === "cadastrar_arquiteto" || acao === "cadastro_arquiteto" || acao === "registrar_arquiteto") {
      return cadastrarPortalUsuario(params, "ARQUITETO");
    }

    if (acao === "cadastrar_fornecedor" || acao === "cadastro_fornecedor" || acao === "registrar_fornecedor") {
      return cadastrarPortalUsuario(params, "FORNECEDOR");
    }

    if (acao === "portal_sessao") {
      return validarSessaoPortal({ token: params.token });
    }

    if (acao === "portal_dashboard") {
      return obterDashboardPortal(params.token);
    }

    if (acao === "portal_contatos") return listarContatosPortal(params.token);
    if (acao === "portal_conversa_criar") return criarConversaPortal(params);
    if (acao === "portal_conversas") return listarConversasV4(params.token);
    if (acao === "portal_mensagens") return listarMensagensV4(params.token, params.conversaId);
    if (acao === "portal_mensagem_enviar") return enviarMensagemPortal(params);
    if (acao === "portal_notificacoes") return listarNotificacoesPortal(params.token, params.limite);
    if (acao === "portal_notificacao_lida") return marcarNotificacaoPortal(params.token, params.id);
    if (acao === "portal_produtos") return listarProdutosPortal(params);
    if (acao === "portal_produto") return obterProdutoPortal(params.token,params.id);
    if (acao === "portal_cotacao_produto") return solicitarCotacaoProdutoPortal(params);
    if (acao === "portal_favorito_toggle") return alternarFavoritoPortal(params);
    if (acao === "portal_solicitacoes_fornecedor") return listarSolicitacoesFornecedorPortal(params.token);
    if (acao === "portal_comercial_termos") return listarTermosPortal(params.token);
    if (acao === "portal_comercial_status") return statusComercialFornecedorPortal(params.token);


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
       ARQSELECT 4.0 — DIAGNÓSTICO DE CONEXÃO
    ====================================================== */
    if (acao === "admin_v4_diagnostico") return diagnosticoAdminV4(dados.token);

    /* ======================================================
       ARQSELECT 4.0 — ADMIN / CRM / COMUNICAÇÃO
    ====================================================== */
    if (acao === "v4_setup" || acao === "admin_v4_setup") {
      exigirSessao(dados.token);
      garantirEstruturaV4();
      return respostaJSON({sucesso:true,autorizado:true,mensagem:"Estrutura ARQSELECT 4.0 preparada."});
    }
    if (acao === "admin_v4_dashboard") return obterDashboardV4(dados.token);
    if (acao === "admin_v4_painel") return obterPainelAdminV4(dados.token);
    if (acao === "admin_v4_usuarios") return obterUsuariosV4(dados.token,dados.tipo,dados.busca);
    if (acao === "admin_v4_fornecedor") return obterFornecedorCRMDetalheV4(dados.token,dados.id);
    if (acao === "admin_v4_notificacoes") return listarNotificacoesV4(dados.token,dados.limite);
    if (acao === "admin_v4_notificacao_lida") return marcarNotificacaoV4(dados.token,dados.id);
    if (acao === "admin_v4_notificacoes_todas_lidas") return marcarTodasNotificacoesV4(dados.token);
    if (acao === "admin_v4_listar") return listarRegistrosAdminV4(dados.token,dados.modulo);
    if (acao === "admin_v4_conversa_criar") return criarConversaV4(dados.token,dados);
    if (acao === "admin_v4_conversas") return listarConversasV4(dados.token);
    if (acao === "admin_v4_mensagens") return listarMensagensV4(dados.token,dados.conversaId);
    if (acao === "admin_v4_mensagem_enviar") return enviarMensagemV4(dados.token,dados);
    if (acao === "admin_v4_produto_moderar") return moderarProdutoV4(dados.token,dados.id,dados.status);
    if (acao === "admin_v4_projeto_distribuir") return distribuirProjetoV4(dados.token,dados.idProjeto,dados.fornecedores);
    if (acao === "admin_v4_projeto_enviar_fornecedor") return enviarProjetoFornecedoresV4(dados.token,dados);
    if (acao === "admin_v4_solicitacao") return criarSolicitacaoV4(dados.token,dados);
    if (acao === "admin_v4_proposta") return criarPropostaV4(dados.token,dados);
    if (acao === "admin_v4_projeto_enviar_fornecedor") return enviarProjetoFornecedoresV4(dados.token,dados);
    if (acao === "admin_comercial_resumo") return adminComercialResumo(dados.token);
    if (acao === "admin_oportunidades") return adminOportunidades(dados.token);
    if (acao === "admin_negocios") return adminNegocios(dados.token);
    if (acao === "admin_comissao_config") return adminComissaoConfig(dados.token);
    /* ======================================================
       PORTAL PREMIUM — PROJETOS / STATUS
    ====================================================== */
    if (acao === "portal_projetos") return obterProjetosPortalSeguro(params.token);
    if (acao === "portal_atualizar_status") return atualizarStatusPortalSeguro(params.token, params.id, params.status);
    if (acao === "portal_solicitacoes") return obterSolicitacoesPortal(params.token);
    if (acao === "portal_projeto_detalhe") return obterDetalheProjetoPortal(params.token, params.id);
    if (acao === "portal_logout") return logoutPortal(params.token);
    if (acao === "portal_fornecedor_projetos") return obterProjetosFornecedorPortal(params.token);
    if (acao === "portal_fornecedor_responder") return responderProjetoFornecedorPortal(params);
    if (acao === "admin_atribuir_fornecedor") {
      exigirSessao(params.token);
      return atribuirFornecedorProjeto(params.id, params.fornecedor_email, params.fornecedor_nome);
    }

    // NOVO PROJETO — formulário público/portal do arquiteto
    if (acao === "receber_projeto" || acao === "receberProjeto" || acao === "solicitar_orcamento") {
      const tipoCadastro = String(params.tipo_cadastro || "").toLowerCase();
      if (tipoCadastro === "arquiteto") return receberProjetoArquiteto(params);
      return respostaJSON({sucesso:false, autorizado:false, mensagem:"Tipo de cadastro inválido para esta solicitação."});
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

    // Compatibilidade: os handlers V4 também podem receber "params".
    // No POST, o corpo normalizado fica em "dados"; mantemos um alias seguro.
    const params = dados;

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
       ARQSELECT 4.0 — ADMIN / CRM / COMUNICAÇÃO
    ====================================================== */
    if (acao === "v4_setup" || acao === "admin_v4_setup") {
      exigirSessao(params.token);
      garantirEstruturaV4();
      return respostaJSON({sucesso:true,autorizado:true,mensagem:"Estrutura ARQSELECT 4.0 preparada."});
    }
    if (acao === "admin_v4_dashboard") return obterDashboardV4(params.token);
    if (acao === "admin_v4_painel") return obterPainelAdminV4(params.token);
    if (acao === "admin_v4_usuarios") return obterUsuariosV4(params.token,params.tipo,params.busca);
    if (acao === "admin_v4_fornecedor") return obterFornecedorCRMDetalheV4(params.token,params.id);
    if (acao === "admin_v4_notificacoes") return listarNotificacoesV4(params.token,params.limite);
    if (acao === "admin_v4_notificacao_lida") return marcarNotificacaoV4(params.token,params.id);
    if (acao === "admin_v4_notificacoes_todas_lidas") return marcarTodasNotificacoesV4(params.token);
    if (acao === "admin_v4_listar") return listarRegistrosAdminV4(params.token,params.modulo);
    if (acao === "admin_v4_conversa_criar") return criarConversaV4(params.token,params);
    if (acao === "admin_v4_conversas") return listarConversasV4(params.token);
    if (acao === "admin_v4_mensagens") return listarMensagensV4(params.token,params.conversaId);
    if (acao === "admin_v4_mensagem_enviar") return enviarMensagemV4(params.token,params);
    if (acao === "admin_v4_produto_moderar") return moderarProdutoV4(params.token,params.id,params.status);
    if (acao === "admin_v4_projeto_distribuir") return distribuirProjetoV4(params.token,params.idProjeto,params.fornecedores);
    if (acao === "admin_v4_projeto_enviar_fornecedor") return enviarProjetoFornecedoresV4(params.token,params);
    if (acao === "admin_v4_solicitacao") return criarSolicitacaoV4(params.token,params);
    if (acao === "admin_v4_proposta") return criarPropostaV4(params.token,params);
    if (acao === "admin_negocio_criar") return adminNegocioCriar(params.token,params);
    if (acao === "admin_comissao_salvar") return adminComissaoSalvar(params.token,params);
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
    if (acao === "portal_contatos") return listarContatosPortal(dados.token);
    if (acao === "portal_conversa_criar") return criarConversaPortal(dados);
    if (acao === "portal_conversas") return listarConversasV4(dados.token);
    if (acao === "portal_mensagens") return listarMensagensV4(dados.token,dados.conversaId);
    if (acao === "portal_mensagem_enviar") return enviarMensagemPortal(dados);
    if (acao === "portal_notificacoes") return listarNotificacoesPortal(dados.token,dados.limite);
    if (acao === "portal_notificacao_lida") return marcarNotificacaoPortal(dados.token,dados.id);
    if (acao === "portal_produto_criar") return criarProdutoV4(dados.token,dados);
    if (acao === "portal_produto_upload") return uploadProdutoPortal(dados);
    if (acao === "portal_produto") return obterProdutoPortal(dados.token,dados.id);
    if (acao === "portal_cotacao_produto") return solicitarCotacaoProdutoPortal(dados);
    if (acao === "portal_favorito_toggle") return alternarFavoritoPortal(dados);
    if (acao === "portal_proposta_enviar") return criarPropostaV4(dados.token,dados);
    if (acao === "portal_solicitacoes_fornecedor") return listarSolicitacoesFornecedorPortal(dados.token);
    if (acao === "portal_comercial_termos") return listarTermosPortal(dados.token);
    if (acao === "portal_comercial_aceite") return aceitarTermosPortal(dados);
    if (acao === "portal_conexao_arqselect") return solicitarConexaoArqselect(dados);
    if (acao === "portal_comercial_status") return statusComercialFornecedorPortal(dados.token);

    if (acao === "portal_solicitar_orcamento") {
      return criarSolicitacaoPortal(dados);
    }

    if (acao === "portal_fornecedor_responder") {
      return responderProjetoFornecedorPortal(dados);
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
    "STATUS",
    "FORNECEDOR E-MAIL",
    "FORNECEDOR NOME",
    "DATA ENVIO FORNECEDOR",
    "RESPOSTA FORNECEDOR",
    "ARQUIVOS DO FORNECEDOR",
    "ULTIMA INTERAÇÃO"

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

function garantirColunasPortalProjetos() {
  const aba = obterPlanilha().getSheetByName(CRM_SHEETS.PROJETOS);
  if (!aba) return null;
  const extras = [
    "FORNECEDOR E-MAIL", "FORNECEDOR NOME", "DATA ENVIO FORNECEDOR",
    "RESPOSTA FORNECEDOR", "ARQUIVOS DO FORNECEDOR", "ULTIMA INTERAÇÃO"
  ];
  const last = Math.max(aba.getLastColumn(), 1);
  const headers = aba.getRange(1,1,1,last).getDisplayValues()[0];
  extras.forEach(function(h){
    if (headers.indexOf(h) === -1) {
      aba.getRange(1, aba.getLastColumn()+1).setValue(h);
      headers.push(h);
    }
  });
  return aba;
}

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
   PORTAL PREMIUM — FLUXO COMPLETO ARQUITETO ↔ ADMIN ↔ FORNECEDOR
========================================================== */
function criarSolicitacaoPortal(dados) {
  const sessao = obterSessaoPortal(dados && dados.token);
  if (!sessao || sessao.tipo !== "ARQUITETO") return respostaJSON({sucesso:false, autorizado:false, mensagem:"Sessão de arquiteto inválida ou expirada."});
  dados = dados || {};
  dados.tipo_cadastro = "arquiteto";
  dados.nome = sessao.nome || dados.nome;
  dados.escritorio = sessao.empresa || dados.escritorio;
  dados.email = sessao.email;
  const r = receberProjetoArquiteto(dados);
  try {
    const obj = JSON.parse(r.getContent());
    if (obj && obj.sucesso) {
      garantirColunasPortalProjetos();
      const p = obterProjetoInterno(obj.idProjeto);
      if (p) {
        const aba = obterPlanilha().getSheetByName(CRM_SHEETS.PROJETOS);
        aba.getRange(p._linha, 26).setValue(new Date());
      }
    }
  } catch(e) {}
  return r;
}

function obterSolicitacoesPortal(token) {
  const sessao = obterSessaoPortal(token);
  if (!sessao) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Sessão expirada."});
  garantirColunasPortalProjetos();
  const projetos = lerPlanilha(false);
  const email = String(sessao.email||"").trim().toLowerCase();
  let meus=[];
  if (sessao.tipo === "ARQUITETO") {
    meus = projetos.filter(function(p){ return String(p["E-MAIL"]||"").trim().toLowerCase() === email; });
  } else {
    const porEmail = projetos.filter(function(p){ return String(p["FORNECEDOR E-MAIL"]||"").trim().toLowerCase() === email; });
    const idsDistribuidos = {};
    try {
      const dist=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.PROJETO_FORNECEDORES,ARQSELECT_4_HEADERS.PROJETO_FORNECEDORES));
      dist.forEach(function(d){
        if(String(d["FORNECEDOR E-MAIL"]||"").trim().toLowerCase()===email && String(d.STATUS||"").toUpperCase()!=="CANCELADO") idsDistribuidos[String(d["PROJETO ID"]||"")]=true;
      });
    } catch(e) {}
    meus = projetos.filter(function(p){
      const id=String(p["ID PROJETO"]||"");
      return porEmail.indexOf(p)!==-1 || !!idsDistribuidos[id];
    });
  }
  return respostaJSON({sucesso:true, autorizado:true, tipo:sessao.tipo, projetos:meus.map(serializarProjetoPortalDetalhado)});
}

function serializarProjetoPortalDetalhado(p) {
  return {
    id:p["ID PROJETO"]||"", data:p["DATA / HORA"]||"", nome:p["NOME"]||"", escritorio:p["ESCRITÓRIO"]||"",
    email:p["E-MAIL"]||"", whatsapp:p["WHATSAPP"]||"", cidade:p["CIDADE"]||"", estado:p["ESTADO"]||"",
    projeto:p["NOME DO PROJETO"]||"", tipo:p["TIPO DE PROJETO"]||"", area:p["ÁREA"]||"", ambiente:p["AMBIENTE"]||"",
    prazo:p["PRAZO"]||"", descricao:p["DESCRIÇÃO / ORÇAMENTO"]||"", investimento:p["INVESTIMENTO"]||"", observacoes:p["OBSERVAÇÕES"]||"",
    arquivos:extrairURLs(p["ARQUIVOS"]||""), pasta:extrairURL(p["PASTA DO PROJETO"]||""), status:p["STATUS"]||"Novo",
    fornecedorEmail:p["FORNECEDOR E-MAIL"]||"", fornecedorNome:p["FORNECEDOR NOME"]||"",
    respostaFornecedor:p["RESPOSTA FORNECEDOR"]||"", arquivosFornecedor:extrairURLs(p["ARQUIVOS DO FORNECEDOR"]||""),
    dataResposta:p["DATA ENVIO FORNECEDOR"]||"", ultimaInteracao:p["ULTIMA INTERAÇÃO"]||""
  };
}

function obterDetalheProjetoPortal(token,id) {
  const sessao = obterSessaoPortal(token);
  if (!sessao) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Sessão expirada."});
  const p = obterProjetoInterno(id);
  if (!p) return respostaJSON({sucesso:false, autorizado:true, mensagem:"Projeto não encontrado."});
  const email = String(sessao.email||"").trim().toLowerCase();
  let permitido = sessao.tipo === "ARQUITETO"
    ? String(p["E-MAIL"]||"").trim().toLowerCase() === email
    : String(p["FORNECEDOR E-MAIL"]||"").trim().toLowerCase() === email;
  if (!permitido && sessao.tipo === "FORNECEDOR") {
    try {
      const dist=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.PROJETO_FORNECEDORES,ARQSELECT_4_HEADERS.PROJETO_FORNECEDORES));
      permitido=dist.some(function(d){return String(d["PROJETO ID"]||"")===String(id||"") && String(d["FORNECEDOR E-MAIL"]||"").trim().toLowerCase()===email && String(d.STATUS||"").toUpperCase()!=="CANCELADO";});
    } catch(e) {}
  }
  if (!permitido) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Você não possui acesso a este projeto."});
  return respostaJSON({sucesso:true, autorizado:true, projeto:serializarProjetoPortalDetalhado(p)});
}

function obterProjetosFornecedorPortal(token) {
  const sessao = obterSessaoPortal(token);
  if (!sessao || sessao.tipo !== "FORNECEDOR") return respostaJSON({sucesso:false, autorizado:false, mensagem:"Sessão de fornecedor inválida."});
  return obterSolicitacoesPortal(token);
}

function atribuirFornecedorProjeto(id, fornecedorEmail, fornecedorNome) {
  const email = String(fornecedorEmail||"").trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return respostaJSON({sucesso:false, autorizado:true,mensagem:"Informe um e-mail de fornecedor válido."});
  const p = obterProjetoInterno(id);
  if (!p) return respostaJSON({sucesso:false, autorizado:true,mensagem:"Projeto não encontrado."});
  garantirColunasPortalProjetos();
  const aba = obterPlanilha().getSheetByName(CRM_SHEETS.PROJETOS);
  aba.getRange(p._linha,21,1,2).setValues([[email, fornecedorNome||email]]);
  aba.getRange(p._linha,26).setValue(new Date());
  aba.getRange(p._linha,20).setValue("Em análise");
  SpreadsheetApp.flush();
  try {
    const assunto = "ARQSELECT | Novo projeto direcionado — " + (p["NOME DO PROJETO"]||id);
    const corpo = "Você recebeu um novo projeto no portal ARQSELECT.\n\nProjeto: " + (p["NOME DO PROJETO"]||id) + "\nArquiteto: " + (p["NOME"]||"") + "\nE-mail: " + (p["E-MAIL"]||"") + "\n\nAcesse o dashboard do fornecedor para consultar os arquivos e enviar sua resposta/orçamento.";
    MailApp.sendEmail(email, assunto, corpo);
  } catch(e) { registrarErro(e,"emailFornecedorProjeto"); }
  registrarAuditoria("ADMIN","ATRIBUIR","PROJETOS",id,"",email,"Projeto direcionado ao fornecedor.");
  return respostaJSON({sucesso:true, autorizado:true,mensagem:"Projeto direcionado ao fornecedor com sucesso.",fornecedorEmail:email});
}

function responderProjetoFornecedorPortal(dados) {
  const sessao = obterSessaoPortal(dados && dados.token);
  if (!sessao || sessao.tipo !== "FORNECEDOR") return respostaJSON({sucesso:false, autorizado:false,mensagem:"Sessão de fornecedor inválida."});
  const p = obterProjetoInterno(dados.id);
  if (!p) return respostaJSON({sucesso:false, autorizado:true,mensagem:"Projeto não encontrado."});
  if (String(p["FORNECEDOR E-MAIL"]||"").trim().toLowerCase() !== String(sessao.email||"").trim().toLowerCase()) return respostaJSON({sucesso:false, autorizado:false,mensagem:"Este projeto não está direcionado à sua empresa."});
  garantirColunasPortalProjetos();
  const aba = obterPlanilha().getSheetByName(CRM_SHEETS.PROJETOS);
  let arquivos = dados.arquivos || [];
  if (typeof arquivos === "string") { try { arquivos = JSON.parse(arquivos); } catch(e) { arquivos=[]; } }
  const pastaUrl = p["PASTA DO PROJETO"] ? extrairURL(p["PASTA DO PROJETO"]) : "";
  let pasta = null;
  try { const m = String(pastaUrl||"").match(/[-\w]{20,}/); if (m) pasta = DriveApp.getFolderById(m[0]); } catch(e) {}
  if (!pasta) {
    const raiz = obterPastaPrincipal(); pasta = raiz.createFolder(String(p["ID PROJETO"]||dados.id)+" - RESPOSTAS FORNECEDOR");
  }
  const links=[];
  (Array.isArray(arquivos)?arquivos:[]).forEach(function(a){ const salvo=salvarArquivo(a,pasta); if(salvo) links.push(salvo.url); });
  const resposta = String(dados.resposta||dados.orcamento||dados.mensagem||"").trim();
  aba.getRange(p._linha,23,1,4).setValues([[new Date(), resposta, links.join("\n"), new Date()]]);
  aba.getRange(p._linha,20).setValue("Proposta enviada");
  SpreadsheetApp.flush();
  const destino = CONFIG.NOTIFICATION_EMAIL || Session.getEffectiveUser().getEmail();
  const destinatarios = [];
  if (destino) destinatarios.push(destino);
  const emailArquiteto = String(p["E-MAIL"]||"").trim();
  if (emailArquiteto && destinatarios.indexOf(emailArquiteto) === -1) destinatarios.push(emailArquiteto);
  try {
    if (destinatarios.length) {
      destinatarios.forEach(function(dest){
        MailApp.sendEmail({to:dest,subject:"ARQSELECT | Resposta de fornecedor — "+(p["NOME DO PROJETO"]||p["ID PROJETO"]),body:"O fornecedor " + (sessao.empresa||sessao.nome||sessao.email) + " respondeu ao projeto.\n\nProjeto: "+(p["NOME DO PROJETO"]||p["ID PROJETO"]) + "\nArquiteto: "+(p["NOME"]||"")+"\n\nResposta/orçamento:\n"+resposta+"\n\nArquivos:\n"+(links.join("\n")||"Nenhum")});
      });
    }
  } catch(e) { registrarErro(e,"emailRespostaFornecedor"); }
  registrarAuditoria(sessao.email,"RESPONDER","PROJETOS",dados.id,"",resposta,"Fornecedor enviou resposta/orçamento.");
  return respostaJSON({sucesso:true, autorizado:true,mensagem:"Resposta enviada com sucesso.",arquivos:links,status:"Proposta enviada"});
}


/* ==========================================================
   ARQSELECT 4.0 — CENTRAL DE USUÁRIOS, NOTIFICAÇÕES, CHAT,
   PRODUTOS, SOLICITAÇÕES, PROPOSTAS E DISTRIBUIÇÃO DE PROJETOS
   Camada incremental: preserva as funções existentes.
========================================================== */

const ARQSELECT_4_SHEETS = {
  USUARIOS: "ARQSELECT - USUARIOS",
  PRODUTOS: "ARQSELECT - PRODUTOS",
  CONVERSAS: "ARQSELECT - CONVERSAS",
  MENSAGENS: "ARQSELECT - MENSAGENS",
  SOLICITACOES: "ARQSELECT - SOLICITACOES",
  PROPOSTAS: "ARQSELECT - PROPOSTAS",
  PROJETO_FORNECEDORES: "ARQSELECT - PROJETO_FORNECEDORES",
  HISTORICO: "ARQSELECT - HISTORICO",
  FAVORITOS: "ARQSELECT - FAVORITOS",
  CONEXOES: "ARQSELECT - CONEXOES",
  ANALYTICS: "ARQSELECT - ANALYTICS",
  FEED: "ARQSELECT - FEED",
  OPORTUNIDADES: "ARQSELECT - OPORTUNIDADES",
  NEGOCIOS: "ARQSELECT - NEGOCIOS",
  TERMOS: "ARQSELECT - TERMOS",
  ACEITES: "ARQSELECT - ACEITES",
  COMISSOES: "ARQSELECT - COMISSOES",
  AUDITORIA_COMERCIAL: "ARQSELECT - AUDITORIA_COMERCIAL"
};

const ARQSELECT_4_HEADERS = {
  USUARIOS:["ID","TIPO","DATA CADASTRO","NOME","EMPRESA","E-MAIL","TELEFONE","DOCUMENTO","STATUS","ULTIMO ACESSO","ORIGEM","DADOS JSON","STATUS APROVACAO"],
  PRODUTOS:["ID","FORNECEDOR ID","FORNECEDOR E-MAIL","NOME","SKU","CATEGORIA","SUBCATEGORIA","MARCA","MODELO","DESCRICAO","CARACTERISTICAS","DIMENSOES","MATERIAL","ACABAMENTO","COR","UNIDADE","PRECO","FAIXA PRECO","DISPONIBILIDADE","PRAZO","REGIAO","LINK","FICHA TECNICA","CATALOGO PDF","FOTOS","VIDEOS","STATUS","DATA CRIACAO","DATA ATUALIZACAO"],
  CONVERSAS:["ID","DATA CRIACAO","TIPO","PARTICIPANTE A","PARTICIPANTE A ID","PARTICIPANTE B","PARTICIPANTE B ID","PROJETO ID","PRODUTO ID","SOLICITACAO ID","PROPOSTA ID","ULTIMA MENSAGEM","ULTIMA DATA","STATUS"],
  MENSAGENS:["ID","CONVERSA ID","DATA","REMETENTE TIPO","REMETENTE ID","REMETENTE NOME","DESTINATARIO TIPO","DESTINATARIO ID","DESTINATARIO E-MAIL","PROJETO ID","MENSAGEM","ARQUIVOS","LIDA","DATA LEITURA"],
  SOLICITACOES:["ID","DATA","PROJETO ID","PRODUTO ID","ARQUITETO ID","ARQUITETO E-MAIL","FORNECEDOR ID","FORNECEDOR E-MAIL","PRODUTO","QUANTIDADE","MEDIDA","ESPECIFICACAO","PRAZO","OBSERVACOES","STATUS","DATA ATUALIZACAO"],
  PROPOSTAS:["ID","DATA","SOLICITACAO ID","PROJETO ID","FORNECEDOR ID","FORNECEDOR E-MAIL","ARQUITETO ID","ARQUITETO E-MAIL","PRODUTO","QUANTIDADE","VALOR UNITARIO","VALOR TOTAL","FRETE","PRAZO","VALIDADE","CONDICAO","OBSERVACOES","ANEXOS","STATUS","DATA ATUALIZACAO"],
  PROJETO_FORNECEDORES:["ID","DATA","PROJETO ID","FORNECEDOR ID","FORNECEDOR E-MAIL","FORNECEDOR NOME","STATUS","DATA LEITURA","DATA RESPOSTA","OBSERVACOES"],
  HISTORICO:["ID","DATA","TIPO","USUARIO ID","USUARIO","MODULO","REGISTRO ID","ACAO","DESCRICAO","DADOS JSON"],
  FAVORITOS:["ID","DATA","USUARIO ID","USUARIO TIPO","TIPO","REGISTRO ID","NOME","STATUS"],
  CONEXOES:["ID","DATA","ORIGEM ID","ORIGEM TIPO","DESTINO ID","DESTINO TIPO","STATUS","ULTIMA INTERACAO"],
  ANALYTICS:["ID","DATA","USUARIO ID","USUARIO TIPO","EVENTO","REGISTRO TIPO","REGISTRO ID","DADOS JSON"],
  FEED:["ID","DATA","AUTOR ID","AUTOR TIPO","TIPO","TITULO","CONTEUDO","MEDIA","STATUS"],
  OPORTUNIDADES:["ID OPORTUNIDADE","DATA","ID PROJETO","ARQUITETO ID","FORNECEDOR ID","FORNECEDOR E-MAIL","CATEGORIA","PRODUTO","VALOR ESTIMADO","STATUS","ORIGEM","RESPONSAVEL","COMISSAO %","ACEITE ID","HISTORICO"],
  NEGOCIOS:["ID","DATA","OPORTUNIDADE ID","PROJETO ID","ARQUITETO ID","FORNECEDOR ID","PRODUTO","VALOR","COMISSAO %","VALOR COMISSAO","STATUS","VENCIMENTO","PAGAMENTO STATUS","COMPROVANTE","OBSERVACOES"],
  TERMOS:["ID","VERSAO","TITULO","CONTEUDO","DATA PUBLICACAO","ATIVO"],
  ACEITES:["ID","DATA","USUARIO ID","USUARIO TIPO","EMPRESA","TERMO ID","VERSAO","OPORTUNIDADE ID","ACEITE","IP","OBSERVACOES"],
  COMISSOES:["ID","DATA","VALOR MIN","VALOR MAX","PERCENTUAL","ATIVO","OBSERVACOES"],
  AUDITORIA_COMERCIAL:["ID","DATA","USUARIO ID","USUARIO","ACAO","OPORTUNIDADE ID","NEGOCIO ID","DETALHES"]
};

function garantirAbaV4(nome, headers) {
  const ss = obterPlanilha();
  let aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
    aba.getRange(1,1,1,headers.length).setValues([headers]);
    aba.setFrozenRows(1);
    aba.getRange(1,1,1,headers.length).setFontWeight("bold");
    try { aba.autoResizeColumns(1, headers.length); } catch(e) {}
    return aba;
  }
  const lastCol = Math.max(aba.getLastColumn(), 1);
  const atual = aba.getRange(1,1,1,lastCol).getDisplayValues()[0];
  headers.forEach(function(h){
    if (atual.indexOf(h) === -1) {
      aba.getRange(1, aba.getLastColumn()+1).setValue(h);
      atual.push(h);
    }
  });
  return aba;
}

function garantirEstruturaV4() {
  Object.keys(ARQSELECT_4_SHEETS).forEach(function(k){
    garantirAbaV4(ARQSELECT_4_SHEETS[k], ARQSELECT_4_HEADERS[k]);
  });
  obterAbaPortal("ARQUITETO");
  obterAbaPortal("FORNECEDOR");
  garantirAbaCRM("arquitetos");
  garantirAbaV4(CRM_SHEETS.NOTIFICACOES, CRM_HEADERS.NOTIFICACOES);
  garantirColunasPortalProjetos();

  // Mantém a V4 sincronizada com as bases legadas já existentes.
  // A rotina é idempotente e não gera notificações em massa para registros antigos.
  sincronizarBaseLegadaV4();

  return true;
}

/* ==========================================================
   SINCRONIZAÇÃO DA BASE LEGADA → ÍNDICE CENTRAL V4
   Não apaga nem altera as abas antigas.
========================================================== */
function sincronizarBaseLegadaV4() {
  try {
    const ss = obterPlanilha();
    const usuariosAba = garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS);

    const porChave = {};
    const existentes = lerAbaComoObjetos(usuariosAba);
    existentes.forEach(function(u){
      const email = String(u["E-MAIL"] || "").trim().toLowerCase();
      const tipo = String(u.TIPO || "").trim().toUpperCase();
      const id = String(u.ID || "").trim();
      if (email && tipo) porChave[tipo + "|" + email] = u;
      if (id && tipo) porChave[tipo + "|#" + id] = u;
    });

    function col(headers, nomes) {
      for (let i=0;i<nomes.length;i++) {
        const idx = headers.indexOf(nomes[i]);
        if (idx >= 0) return idx;
      }
      return -1;
    }

    function addOrUpdate(tipo, obj) {
      const email = String(obj.email || "").trim().toLowerCase();
      const id = String(obj.id || "").trim();
      if (!email && !id) return false;

      const atual = (id && porChave[tipo + "|#" + id]) || (email && porChave[tipo + "|" + email]);
      const uid = id || (atual && atual.ID) || (tipo === "ARQUITETO" ? "ARQ-" : "FOR-") + Utilities.getUuid().slice(0,8).toUpperCase();
      const row = [
        uid,
        tipo,
        obj.data || (atual && atual["DATA CADASTRO"]) || new Date(),
        obj.nome || (atual && atual.NOME) || "",
        obj.empresa || (atual && atual.EMPRESA) || "",
        email || (atual && atual["E-MAIL"]) || "",
        obj.telefone || (atual && atual.TELEFONE) || "",
        obj.documento || (atual && atual.DOCUMENTO) || "",
        obj.status || (atual && atual.STATUS) || "ATIVO",
        obj.ultimoAcesso || (atual && atual["ULTIMO ACESSO"]) || "",
        obj.origem || (atual && atual.ORIGEM) || "LEGADO",
        typeof obj.dadosJson === "string" ? obj.dadosJson : JSON.stringify(obj.dadosJson || {}),
        obj.aprovacao || (atual && atual["STATUS APROVACAO"]) || "PENDENTE"
      ];
      if (atual && atual._linha) {
        usuariosAba.getRange(atual._linha,1,1,row.length).setValues([row]);
        porChave[tipo + "|#" + uid] = Object.assign({}, atual, {ID:uid});
        if (email) porChave[tipo + "|" + email] = porChave[tipo + "|#" + uid];
      } else {
        usuariosAba.appendRow(row);
        const criado = {_linha:usuariosAba.getLastRow(), ID:uid, TIPO:tipo, "E-MAIL":row[5], NOME:row[3], EMPRESA:row[4]};
        porChave[tipo + "|#" + uid] = criado;
        if (email) porChave[tipo + "|" + email] = criado;
      }
      return true;
    }

    // Acessos de arquitetos
    const arqAcesso = ss.getSheetByName("ACESSOS_ARQUITETOS");
    if (arqAcesso && arqAcesso.getLastRow() >= 2) {
      const vals=arqAcesso.getDataRange().getDisplayValues(), h=vals[0];
      const iId=col(h,["ID"]),iData=col(h,["DATA CADASTRO"]),iNome=col(h,["NOME"]),iEmp=col(h,["EMPRESA"]),iEmail=col(h,["E-MAIL"]),iTel=col(h,["TELEFONE"]),iDoc=col(h,["REGISTRO/CNPJ"]),iStatus=col(h,["STATUS"]),iUlt=col(h,["ULTIMO ACESSO"]);
      for(let r=1;r<vals.length;r++){ if(!vals[r].join("").trim()) continue; addOrUpdate("ARQUITETO",{id:iId>=0?vals[r][iId]:"",data:iData>=0?vals[r][iData]:"",nome:iNome>=0?vals[r][iNome]:"",empresa:iEmp>=0?vals[r][iEmp]:"",email:iEmail>=0?vals[r][iEmail]:"",telefone:iTel>=0?vals[r][iTel]:"",documento:iDoc>=0?vals[r][iDoc]:"",status:iStatus>=0?vals[r][iStatus]:"ATIVO",ultimoAcesso:iUlt>=0?vals[r][iUlt]:"",origem:"ACESSOS_ARQUITETOS",aprovacao:"APROVADO"}); }
    }

    // CRM de arquitetos já existente
    const arqCRM = ss.getSheetByName(CRM_SHEETS.ARQUITETOS);
    if (arqCRM && arqCRM.getLastRow() >= 2) {
      const vals=arqCRM.getDataRange().getDisplayValues(), h=vals[0];
      const iId=col(h,["ID"]),iData=col(h,["DATA DE CRIAÇÃO"]),iNome=col(h,["NOME"]),iEmp=col(h,["ESCRITÓRIO"]),iEmail=col(h,["E-MAIL"]),iTel=col(h,["TELEFONE"]),iDoc=col(h,["CAU"]),iStatus=col(h,["STATUS"]),iCid=col(h,["CIDADE"]),iEst=col(h,["ESTADO"]);
      for(let r=1;r<vals.length;r++){ if(!vals[r].join("").trim()) continue; addOrUpdate("ARQUITETO",{id:iId>=0?vals[r][iId]:"",data:iData>=0?vals[r][iData]:"",nome:iNome>=0?vals[r][iNome]:"",empresa:iEmp>=0?vals[r][iEmp]:"",email:iEmail>=0?vals[r][iEmail]:"",telefone:iTel>=0?vals[r][iTel]:"",documento:iDoc>=0?vals[r][iDoc]:"",status:iStatus>=0?vals[r][iStatus]:"Pendente",origem:"CRM - ARQUITETOS",dadosJson:{cidade:iCid>=0?vals[r][iCid]:"",estado:iEst>=0?vals[r][iEst]:""}}); }
    }

    // Acessos de fornecedores
    const forAcesso = ss.getSheetByName("ACESSOS_FORNECEDORES");
    if (forAcesso && forAcesso.getLastRow() >= 2) {
      const vals=forAcesso.getDataRange().getDisplayValues(), h=vals[0];
      const iId=col(h,["ID"]),iData=col(h,["DATA CADASTRO"]),iNome=col(h,["NOME"]),iEmp=col(h,["EMPRESA"]),iEmail=col(h,["E-MAIL"]),iTel=col(h,["TELEFONE"]),iDoc=col(h,["REGISTRO/CNPJ"]),iStatus=col(h,["STATUS"]),iUlt=col(h,["ULTIMO ACESSO"]);
      for(let r=1;r<vals.length;r++){ if(!vals[r].join("").trim()) continue; addOrUpdate("FORNECEDOR",{id:iId>=0?vals[r][iId]:"",data:iData>=0?vals[r][iData]:"",nome:iNome>=0?vals[r][iNome]:"",empresa:iEmp>=0?vals[r][iEmp]:"",email:iEmail>=0?vals[r][iEmail]:"",telefone:iTel>=0?vals[r][iTel]:"",documento:iDoc>=0?vals[r][iDoc]:"",status:iStatus>=0?vals[r][iStatus]:"ATIVO",ultimoAcesso:iUlt>=0?vals[r][iUlt]:"",origem:"ACESSOS_FORNECEDORES",aprovacao:"APROVADO"}); }
    }

    // Cadastro operacional de fornecedores; aceita nomes de abas usados pelas versões anteriores.
    const nomesFor=[CRM_SHEETS.FORNECEDORES,"FORNECEDORES","ARQSELECT - FORNECEDORES"];
    let forCRM=null;
    for(let i=0;i<nomesFor.length;i++){ const a=ss.getSheetByName(nomesFor[i]); if(a){ forCRM=a; break; } }
    if(forCRM && forCRM.getLastRow()>=2){
      const vals=forCRM.getDataRange().getDisplayValues(), h=vals[0];
      const iId=col(h,["ID"]),iData=col(h,["Data","DATA","DATA CADASTRO"]),iRazao=col(h,["Razão Social","RAZÃO SOCIAL"]),iFant=col(h,["Nome Fantasia","NOME FANTASIA"]),iCnpj=col(h,["CNPJ"]),iResp=col(h,["Responsável","RESPONSÁVEL"]),iEmail=col(h,["E-mail","E-MAIL"]),iTel=col(h,["Telefone","TELEFONE"]),iStatus=col(h,["Status","STATUS"]),iSite=col(h,["Site","SITE"]),iCid=col(h,["Cidade","CIDADE"]),iEst=col(h,["Estado","ESTADO"]);
      for(let r=1;r<vals.length;r++){
        if(!vals[r].join("").trim()) continue;
        const empresa=(iFant>=0?vals[r][iFant]:"") || (iRazao>=0?vals[r][iRazao]:"");
        addOrUpdate("FORNECEDOR",{id:iId>=0?vals[r][iId]:"",data:iData>=0?vals[r][iData]:"",nome:iResp>=0?vals[r][iResp]:"",empresa:empresa,email:iEmail>=0?vals[r][iEmail]:"",telefone:iTel>=0?vals[r][iTel]:"",documento:iCnpj>=0?vals[r][iCnpj]:"",status:iStatus>=0?vals[r][iStatus]:"Novo",origem:"CADASTRO_FORNECEDOR",dadosJson:{razao_social:iRazao>=0?vals[r][iRazao]:"",nome_fantasia:iFant>=0?vals[r][iFant]:"",site:iSite>=0?vals[r][iSite]:"",cidade:iCid>=0?vals[r][iCid]:"",estado:iEst>=0?vals[r][iEst]:""}});
      }
    }

    SpreadsheetApp.flush();
    return true;
  } catch(e) {
    registrarErro(e,"sincronizarBaseLegadaV4");
    return false;
  }
}

function localizarFornecedorOperacional(email, cnpj) {
  try {
    const aba = obterPlanilha().getSheetByName(CRM_SHEETS.FORNECEDORES);
    if (!aba || aba.getLastRow() < 2) return null;
    const vals = aba.getDataRange().getDisplayValues();
    const headers = vals[0];
    const idxEmail = headers.indexOf("E-mail");
    const idxCnpj = headers.indexOf("CNPJ");
    const e = String(email || "").trim().toLowerCase();
    const c = String(cnpj || "").replace(/\D/g,"");
    for (let i=1;i<vals.length;i++) {
      const rowEmail = idxEmail >= 0 ? String(vals[i][idxEmail]||"").trim().toLowerCase() : "";
      const rowCnpj = idxCnpj >= 0 ? String(vals[i][idxCnpj]||"").replace(/\D/g,"") : "";
      if (e && rowEmail && e === rowEmail) return {linha:i+1,dados:vals[i]};
      if (c && rowCnpj && c === rowCnpj) return {linha:i+1,dados:vals[i]};
    }
  } catch(e) {}
  return null;
}

function localizarUsuarioV4(id, tipo) {
  const aba = garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS);
  const vals = aba.getDataRange().getDisplayValues();
  for (let i=1;i<vals.length;i++) {
    if (String(vals[i][0]||"") === String(id||"") &&
        (!tipo || String(vals[i][1]||"").toUpperCase() === String(tipo).toUpperCase())) {
      const o={_linha:i+1};
      ARQSELECT_4_HEADERS.USUARIOS.forEach(function(h,c){ o[h]=vals[i][c] || ""; });
      return o;
    }
  }
  return null;
}

function localizarUsuarioPorEmailV4(email, tipo) {
  const aba = garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS);
  const vals = aba.getDataRange().getDisplayValues();
  const alvo=String(email||"").trim().toLowerCase();
  for (let i=1;i<vals.length;i++) {
    if (String(vals[i][5]||"").trim().toLowerCase() === alvo &&
        (!tipo || String(vals[i][1]||"").toUpperCase()===String(tipo).toUpperCase())) {
      const o={_linha:i+1};
      ARQSELECT_4_HEADERS.USUARIOS.forEach(function(h,c){o[h]=vals[i][c]||"";});
      return o;
    }
  }
  return null;
}

function registrarCadastroPortalCRM(info) {
  try {
    garantirEstruturaV4();

    const tipo = String(info.tipo || "").toUpperCase();
    const aba = garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS);
    let usuario = localizarUsuarioV4(info.id, tipo) || localizarUsuarioPorEmailV4(info.email, tipo);

    const dadosJson = JSON.stringify(info.dados || {});
    if (usuario) {
      const row = usuario._linha;
      const mapa = {};
      ARQSELECT_4_HEADERS.USUARIOS.forEach(function(h,i){ mapa[h]=i+1; });
      const patch = {
        "NOME":info.nome || "",
        "EMPRESA":info.empresa || "",
        "E-MAIL":info.email || "",
        "TELEFONE":info.telefone || "",
        "DOCUMENTO":info.documento || "",
        "STATUS":info.status || "ATIVO",
        "ORIGEM":info.origem || "PORTAL",
        "DADOS JSON":dadosJson,
        "STATUS APROVACAO":info.statusAprovacao || "PENDENTE"
      };
      Object.keys(patch).forEach(function(k){ if(mapa[k]) aba.getRange(row,mapa[k]).setValue(patch[k]); });
      info.id = usuario.ID;
    } else {
      aba.appendRow([
        info.id,
        tipo,
        new Date(),
        info.nome || "",
        info.empresa || "",
        info.email || "",
        info.telefone || "",
        info.documento || "",
        info.status || "ATIVO",
        "",
        info.origem || "PORTAL",
        dadosJson,
        info.statusAprovacao || "PENDENTE"
      ]);
    }

    if (tipo === "ARQUITETO") {
      sincronizarArquitetoCRMV4(info);
    } else if (tipo === "FORNECEDOR") {
      sincronizarFornecedorCRMV4(info);
    }

    const tituloCadastro = "Novo " + (tipo === "FORNECEDOR" ? "fornecedor" : "arquiteto") + " cadastrado";
    const mensagemCadastro = (info.empresa || info.nome || "Novo usuário") +
      " foi cadastrado na plataforma.";
    criarNotificacaoV4({
      usuario:"ADMIN",
      tipo:"CADASTRO",
      titulo:tituloCadastro,
      mensagem:mensagemCadastro,
      registro:info.id,
      extras:{tipo:tipo,email:info.email,nome:info.nome,empresa:info.empresa}
    });
    enviarEmailCadastroV4(tipo, info, tituloCadastro, mensagemCadastro);

    registrarHistoricoV4(
      tipo,
      info.id,
      info.email,
      "CADASTRO",
      "Novo " + tipo.toLowerCase() + " cadastrado e sincronizado."
    );

    return true;
  } catch (erro) {
    registrarErro(erro, "registrarCadastroPortalCRM");
    return false;
  }
}

function sincronizarArquitetoCRMV4(info) {
  const aba = garantirAbaCRM("arquitetos");
  const headers = CRM_HEADERS.ARQUITETOS;
  const email = String(info.email||"").trim().toLowerCase();
  const vals = aba.getDataRange().getDisplayValues();
  let linha = 0;
  for (let i=1;i<vals.length;i++) {
    if (String(vals[i][headers.indexOf("E-MAIL")]||"").trim().toLowerCase()===email) { linha=i+1; break; }
  }

  const registro = {
    ID:info.id,
    NOME:info.nome,
    ESCRITÓRIO:info.empresa,
    CAU:info.documento,
    TELEFONE:info.telefone,
    WHATSAPP:info.telefone,
    "E-MAIL":info.email,
    STATUS:"Pendente",
    "ÚLTIMA INTERAÇÃO":new Date(),
    "DATA DE CRIAÇÃO":new Date(),
    "DATA DE ATUALIZAÇÃO":new Date()
  };

  const row = headers.map(function(h){ return registro[h] !== undefined ? registro[h] : ""; });
  if (linha) aba.getRange(linha,1,1,headers.length).setValues([row]);
  else aba.appendRow(row);
}

function sincronizarFornecedorCRMV4(info) {
  try {
    const d=info.dados || {};
    const aba=obterPlanilha().getSheetByName(CRM_SHEETS.FORNECEDORES);
    if(!aba) return false;
    const headers=aba.getRange(1,1,1,Math.max(aba.getLastColumn(),1)).getDisplayValues()[0];
    const rowData={
      "Razão Social":d.razao_social || info.empresa || "",
      "Nome Fantasia":d.nome_fantasia || info.empresa || "",
      "CNPJ":d.cnpj || info.documento || "",
      "Site":d.site || "",
      "Instagram":d.instagram || "",
      "Cidade":d.cidade || "",
      "Estado":d.estado || "",
      "Responsável":d.responsavel || info.nome || "",
      "Cargo":d.cargo || "",
      "E-mail":d.email || info.email || "",
      "Telefone":d.telefone || info.telefone || "",
      "Produtos":d.produtos || "",
      "Marcas":d.marcas || "",
      "Prazo de Entrega":d.prazo_entrega || "",
      "Região":d.regiao || "",
      "Pedido Mínimo":d.pedido_minimo || "",
      "Pagamento":d.pagamento || "",
      "Tabela":d.tabela || "",
      "Proposta":d.proposta || "",
      "Status":d.status || "Novo"
    };
    const email=String(info.email||d.email||"").trim().toLowerCase();
    const cnpj=String(info.documento||d.cnpj||"").replace(/\D/g,"");
    const vals=aba.getDataRange().getDisplayValues();
    const iEmail=headers.indexOf("E-mail"), iCnpj=headers.indexOf("CNPJ");
    let row=0;
    for(let i=1;i<vals.length;i++){
      const re=iEmail>=0?String(vals[i][iEmail]||"").trim().toLowerCase():"";
      const rc=iCnpj>=0?String(vals[i][iCnpj]||"").replace(/\D/g,""):"";
      if((email&&re===email)||(cnpj&&rc===cnpj)){row=i+1;break;}
    }
    if(!row){
      const linha=headers.map(function(h){return h==="Data"?new Date():(rowData[h]!==undefined?rowData[h]:"");});
      aba.appendRow(linha);
    }else{
      headers.forEach(function(h,c){if(rowData[h]!==undefined)aba.getRange(row,c+1).setValue(rowData[h]);});
    }
    SpreadsheetApp.flush();
    return true;
  } catch(e) {
    registrarErro(e,"sincronizarFornecedorCRMV4");
    return false;
  }
}

function enviarEmailCadastroV4(tipo, info, titulo, mensagem) {
  try {
    const destino = CONFIG.NOTIFICATION_EMAIL || Session.getEffectiveUser().getEmail();
    if(!destino) return false;
    MailApp.sendEmail({
      to: destino,
      subject:"ARQSELECT | "+titulo,
      body:[
        titulo,
        "",
        "Tipo: "+tipo,
        "ID: "+(info.id||""),
        "Nome: "+(info.nome||""),
        "Empresa: "+(info.empresa||""),
        "E-mail: "+(info.email||""),
        "Telefone: "+(info.telefone||""),
        "Documento: "+(info.documento||""),
        "",
        mensagem,
        "",
        "Acesse o CRM ARQSELECT para visualizar o cadastro."
      ].join("\n")
    });
    return true;
  } catch(e) {
    registrarErro(e,"enviarEmailCadastroV4");
    return false;
  }
}

function criarNotificacaoV4(opts) {
  try {
    const aba = garantirAbaV4(CRM_SHEETS.NOTIFICACOES, CRM_HEADERS.NOTIFICACOES);
    const id = gerarIdCRM("NOT");
    aba.appendRow([
      id,
      new Date(),
      opts.usuario || "ADMIN",
      opts.tipo || "SISTEMA",
      opts.titulo || "Nova notificação",
      opts.mensagem || "",
      opts.registro || "",
      "NÃO",
      "",
    ]);
    incrementarVersaoDados();
    return id;
  } catch(erro) {
    registrarErro(erro, "criarNotificacaoV4");
    return "";
  }
}

function listarNotificacoesV4(token, limite) {
  exigirSessao(token);
  const aba = garantirAbaV4(CRM_SHEETS.NOTIFICACOES, CRM_HEADERS.NOTIFICACOES);
  const vals = lerAbaComoObjetos(aba);
  const n = Math.min(Math.max(Number(limite)||50,1),200);
  const ordenadas = vals.reverse().slice(0,n);
  return respostaJSON({
    sucesso:true,
    autorizado:true,
    notificacoes:ordenadas,
    naoLidas:ordenadas.filter(function(x){ return String(x.LIDA).toUpperCase()!=="SIM"; }).length,
    versao:obterVersaoDados()
  });
}

function marcarNotificacaoV4(token, id) {
  exigirSessao(token);
  const aba = garantirAbaV4(CRM_SHEETS.NOTIFICACOES, CRM_HEADERS.NOTIFICACOES);
  const row = encontrarLinhaPorID(aba,id);
  if (!row) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Notificação não encontrada."});
  const h=obterCabecalhosAba(aba);
  const cLida=encontrarColuna(h,"LIDA");
  const cData=encontrarColuna(h,"DATA DE LEITURA");
  if (cLida) aba.getRange(row,cLida).setValue("SIM");
  if (cData) aba.getRange(row,cData).setValue(new Date());
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true});
}

function marcarTodasNotificacoesV4(token) {
  exigirSessao(token);
  const aba = garantirAbaV4(CRM_SHEETS.NOTIFICACOES, CRM_HEADERS.NOTIFICACOES);
  const last=aba.getLastRow();
  if(last<2) return respostaJSON({sucesso:true,autorizado:true,quantidade:0});
  const h=obterCabecalhosAba(aba);
  const cLida=encontrarColuna(h,"LIDA"), cData=encontrarColuna(h,"DATA DE LEITURA");
  if(cLida) aba.getRange(2,cLida,last-1,1).setValues(Array.from({length:last-1},()=>["SIM"]));
  if(cData) aba.getRange(2,cData,last-1,1).setValues(Array.from({length:last-1},()=>[new Date()]));
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,quantidade:last-1});
}

function obterUsuariosV4(token, tipo, busca) {
  exigirSessao(token);
  sincronizarBaseLegadaV4();
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS);
  let dados=lerAbaComoObjetos(aba);
  tipo=String(tipo||"").trim().toUpperCase();
  busca=String(busca||"").trim().toLowerCase();
  if(tipo) dados=dados.filter(x=>String(x.TIPO||"").toUpperCase()===tipo);
  if(busca) dados=dados.filter(x=>[x.ID,x.NOME,x.EMPRESA,x["E-MAIL"],x.TELEFONE,x.DOCUMENTO].some(v=>String(v||"").toLowerCase().indexOf(busca)!==-1));
  const arquitetos=dados.filter(x=>x.TIPO==="ARQUITETO").length;
  const fornecedores=dados.filter(x=>x.TIPO==="FORNECEDOR").length;
  return respostaJSON({sucesso:true,autorizado:true,usuarios:dados,totais:{arquitetos:arquitetos,fornecedores:fornecedores,total:dados.length}});
}

function obterFornecedorCRMDetalheV4(token, id) {
  exigirSessao(token);
  const u=localizarUsuarioV4(id,"FORNECEDOR");
  if(!u) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Fornecedor não encontrado."});
  const produtos=listarRegistrosV4SemAuth("PRODUTOS", "FORNECEDOR ID", u.ID);
  const projetos=lerPlanilha(false).filter(function(p){
    const e=String(p["FORNECEDOR E-MAIL"]||"").toLowerCase();
    return e===String(u["E-MAIL"]||"").toLowerCase();
  });
  const msgs=listarMensagensInternasV4(u.ID).slice(-20).reverse();
  return respostaJSON({sucesso:true,autorizado:true,usuario:u,produtos:produtos,projetos:projetos,mensagens:msgs});
}

function listarRegistrosV4SemAuth(sheetKey, filtroCol, filtroVal) {
  const nome=ARQSELECT_4_SHEETS[sheetKey];
  const headers=ARQSELECT_4_HEADERS[sheetKey];
  if(!nome||!headers) return [];
  const aba=garantirAbaV4(nome,headers);
  let dados=lerAbaComoObjetos(aba);
  if(filtroCol) dados=dados.filter(function(x){return String(x[filtroCol]||"").toLowerCase()===String(filtroVal||"").toLowerCase();});
  return dados;
}

function diagnosticoAdminV4(token) {
  exigirSessao(token);
  const ss = obterPlanilha();
  const nomes = [
    "PROJETOS",
    "ARQSELECT - USUARIOS",
    "ACESSOS_ARQUITETOS",
    "ACESSOS_FORNECEDORES",
    "ARQSELECT – FORNECEDORES",
    "ARQSELECT - FORNECEDORES",
    "FORNECEDORES",
    "ARQSELECT - PRODUTOS",
    "ARQSELECT - SOLICITACOES",
    "ARQSELECT - PROPOSTAS"
  ];
  const abas = nomes.map(function(nome){
    const a=ss.getSheetByName(nome);
    return {nome:nome, existe:!!a, linhas:a?a.getLastRow():0, colunas:a?a.getLastColumn():0};
  });
  sincronizarBaseLegadaV4();
  const u=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS));
  const p=lerPlanilha(false);
  return respostaJSON({
    sucesso:true,
    autorizado:true,
    planilhaId:CONFIG.SPREADSHEET_ID,
    planilhaNome:ss.getName(),
    abas:abas,
    usuarios:{total:u.length,arquitetos:u.filter(x=>x.TIPO==="ARQUITETO").length,fornecedores:u.filter(x=>x.TIPO==="FORNECEDOR").length},
    projetos:p.length,
    timestamp:new Date().toISOString()
  });
}

function criarConversaV4(token, dados) {
  dados=dados||{};
  const sessao=dados._session || obterSessaoAdmin(token) || obterSessaoPortal(token);
  if(!sessao) { exigirSessao(token); }
  const a=String(dados.participanteAId||dados.remetenteId||"").trim();
  const b=String(dados.participanteBId||dados.destinatarioId||"").trim();
  if(!a||!b) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Informe os dois participantes."});
  const id="CONV-"+Utilities.getUuid().slice(0,8).toUpperCase();
  garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS).appendRow([
    id,new Date(),dados.tipo||"GERAL",
    dados.participanteANome||"",a,
    dados.participanteBNome||"",b,
    dados.projetoId||"",dados.produtoId||"",dados.solicitacaoId||"",dados.propostaId||"",
    "",new Date(),"ABERTA"
  ]);
  incrementarVersaoDados();
  registrarHistoricoV4(id,"ADMIN","ADMIN","CRIAR","Conversa criada.");
  return respostaJSON({sucesso:true,autorizado:true,id:id});
}

function obterSessaoAdmin(token) {
  return obterSessao(token);
}

function enviarMensagemV4(token,dados) {
  dados=dados||{};
  const sessao=dados._session || obterSessaoPortal(token) || obterSessao(token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão inválida ou expirada."});
  const conversaId=String(dados.conversaId||dados.conversaid||"").trim();
  const mensagem=String(dados.mensagem||"").trim();
  if(!conversaId||!mensagem) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Informe a conversa e a mensagem."});
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.MENSAGENS,ARQSELECT_4_HEADERS.MENSAGENS);
  const id="MSG-"+Utilities.getUuid().slice(0,8).toUpperCase();
  const origemTipo=sessao.tipo || "ADMIN";
  const origemId=sessao.id || CONFIG.ADMIN_USERNAME;
  const origemNome=sessao.nome || "ADMIN";
  const destinoTipo=dados.destinatarioTipo||"";
  const destinoId=dados.destinatarioId||"";
  const destinoEmail=dados.destinatarioEmail||"";
  aba.appendRow([
    id,conversaId,new Date(),origemTipo,origemId,origemNome,
    destinoTipo,destinoId,destinoEmail,dados.projetoId||"",mensagem,
    dados.arquivos||"","NÃO",""
  ]);
  atualizarConversaUltimaMensagemV4(conversaId,mensagem);
  criarNotificacaoV4({
    usuario:destinoId || "ADMIN",
    tipo:"MENSAGEM",
    titulo:"Nova mensagem",
    mensagem:origemNome + ": " + limitarTexto(mensagem,180),
    registro:conversaId
  });
  registrarHistoricoV4(origemId,origemId,origemNome,"MENSAGEM","Nova mensagem enviada.");
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,id:id});
}

function atualizarConversaUltimaMensagemV4(conversaId,mensagem) {
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS);
  const row=encontrarLinhaPorID(aba,conversaId);
  if(!row) return false;
  const h=obterCabecalhosAba(aba);
  const cMsg=encontrarColuna(h,"ULTIMA MENSAGEM"), cData=encontrarColuna(h,"ULTIMA DATA");
  if(cMsg) aba.getRange(row,cMsg).setValue(limitarTexto(mensagem,500));
  if(cData) aba.getRange(row,cData).setValue(new Date());
  return true;
}

function listarConversasV4(token) {
  const sessao=obterSessaoPortal(token) || obterSessao(token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão inválida."});
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS);
  let dados=lerAbaComoObjetos(aba);
  if(sessao.tipo!=="ADMIN") {
    const id=String(sessao.id||"");
    dados=dados.filter(x=>String(x["PARTICIPANTE A ID"]||"")===id || String(x["PARTICIPANTE B ID"]||"")===id);
  }
  return respostaJSON({sucesso:true,autorizado:true,conversas:dados.reverse()});
}

function listarMensagensV4(token, conversaId) {
  const sessao=obterSessaoPortal(token) || obterSessao(token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão inválida."});
  const conv=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS);
  const cs=lerAbaComoObjetos(conv).find(x=>String(x.ID||"")===String(conversaId||""));
  if(!cs) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Conversa não encontrada."});
  if(sessao.tipo!=="ADMIN" && String(cs["PARTICIPANTE A ID"]||"")!==String(sessao.id||"") && String(cs["PARTICIPANTE B ID"]||"")!==String(sessao.id||"")) {
    return respostaJSON({sucesso:false,autorizado:false,mensagem:"Acesso negado."});
  }
  const dados=listarMensagensInternasV4(conversaId);
  return respostaJSON({sucesso:true,autorizado:true,mensagens:dados});
}

function listarMensagensInternasV4(valor) {
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.MENSAGENS,ARQSELECT_4_HEADERS.MENSAGENS);
  return lerAbaComoObjetos(aba).filter(function(x){
    return String(x["CONVERSA ID"]||"")===String(valor||"") || String(x["REMETENTE ID"]||"")===String(valor||"") || String(x["DESTINATARIO ID"]||"")===String(valor||"");
  });
}

function criarProdutoV4(token,dados) {
  const sessao=obterSessaoPortal(token);
  if(!sessao || sessao.tipo!=="FORNECEDOR") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão de fornecedor inválida."});
  dados=dados||{};
  const nome=String(dados.nome||"").trim();
  if(!nome) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Informe o nome do produto."});
  const id="PROD-"+Utilities.getUuid().slice(0,8).toUpperCase();
  const agora=new Date();
  garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS).appendRow([
    id,sessao.id,sessao.email,nome,dados.sku||"",dados.categoria||"",dados.subcategoria||"",
    dados.marca||"",dados.modelo||"",dados.descricao||"",dados.caracteristicas||"",dados.dimensoes||"",
    dados.material||"",dados.acabamento||"",dados.cor||"",dados.unidade||"",dados.preco||"",
    dados.faixa_preco||"",dados.disponibilidade||"",dados.prazo||"",dados.regiao||"",dados.link||"",
    dados.ficha_tecnica||"",dados.catalogo_pdf||"",dados.fotos||"",dados.videos||"",
    "PENDENTE",agora,agora
  ]);
  criarNotificacaoV4({usuario:"ADMIN",tipo:"PRODUTO",titulo:"Novo produto pendente",mensagem:nome+" foi cadastrado por "+(sessao.empresa||sessao.nome),registro:id});
  registrarHistoricoV4(sessao.id,sessao.id,sessao.nome,"CRIAR","Produto criado: "+nome);
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,id:id,status:"PENDENTE",mensagem:"Produto enviado para aprovação."});
}

function listarProdutosV4(token,filtro) {
  const sessao=obterSessaoPortal(token);
  if(!sessao && token) { /* catálogo público não exige sessão */ }
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS);
  let dados=lerAbaComoObjetos(aba);
  if(!sessao || sessao.tipo!=="ADMIN") dados=dados.filter(x=>String(x.STATUS||"").toUpperCase()==="APROVADO");
  filtro=filtro||{};
  Object.keys(filtro).forEach(function(k){
    const v=String(filtro[k]||"").toLowerCase().trim();
    if(v) dados=dados.filter(function(x){return String(x[k]||"").toLowerCase().indexOf(v)!==-1;});
  });
  return respostaJSON({sucesso:true,autorizado:!!sessao,produtos:dados});
}

function moderarProdutoV4(token,id,status) {
  exigirSessao(token);
  const st=String(status||"").toUpperCase();
  if(["APROVADO","RECUSADO","PENDENTE","OCULTO","ALTERAR"].indexOf(st)===-1) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Status de produto inválido."});
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS);
  const row=encontrarLinhaPorID(aba,id);
  if(!row) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Produto não encontrado."});
  const h=obterCabecalhosAba(aba); const cStatus=encontrarColuna(h,"STATUS"), cData=encontrarColuna(h,"DATA ATUALIZACAO"), cNome=encontrarColuna(h,"NOME"), cFor=encontrarColuna(h,"FORNECEDOR E-MAIL");
  if(cStatus) aba.getRange(row,cStatus).setValue(st);
  if(cData) aba.getRange(row,cData).setValue(new Date());
  if(cFor) criarNotificacaoV4({usuario:aba.getRange(row,cFor).getDisplayValue(),tipo:"PRODUTO",titulo:"Status do produto atualizado",mensagem:String(cNome?aba.getRange(row,cNome).getDisplayValue():"Produto")+" → "+st,registro:id});
  incrementarVersaoDados();
  registrarHistoricoV4(CONFIG.ADMIN_USERNAME,CONFIG.ADMIN_USERNAME,"ADMIN","MODERAR","Produto "+id+" -> "+st);
  return respostaJSON({sucesso:true,autorizado:true,status:st});
}

function distribuirProjetoV4(token,idProjeto,fornecedores) {
  exigirSessao(token);
  const p=obterProjetoInterno(idProjeto);
  if(!p) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Projeto não encontrado."});
  fornecedores=Array.isArray(fornecedores)?fornecedores: String(fornecedores||"").split(",").map(function(x){return x.trim();}).filter(Boolean);
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.PROJETO_FORNECEDORES,ARQSELECT_4_HEADERS.PROJETO_FORNECEDORES);
  const usuarios=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS)).filter(x=>x.TIPO==="FORNECEDOR");
  let enviados=0;
  fornecedores.forEach(function(ref){
    const u=usuarios.find(function(x){return String(x.ID)===String(ref)||String(x["E-MAIL"]).toLowerCase()===String(ref).toLowerCase();});
    if(!u) return;
    const id="PF-"+Utilities.getUuid().slice(0,8).toUpperCase();
    aba.appendRow([id,new Date(),idProjeto,u.ID,u["E-MAIL"],u.EMPRESA||u.NOME,"ENVIADO","", "", ""]);
    criarNotificacaoV4({usuario:u.ID,tipo:"PROJETO",titulo:"Novo projeto disponível",mensagem:(p["NOME DO PROJETO"]||idProjeto)+" foi enviado para sua empresa.",registro:idProjeto});
    enviados++;
  });
  registrarHistoricoV4(CONFIG.ADMIN_USERNAME,CONFIG.ADMIN_USERNAME,"ADMIN","DISTRIBUIR","Projeto "+idProjeto+" enviado para "+enviados+" fornecedor(es).");
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,enviados:enviados});
}

function criarSolicitacaoV4(token,dados) {
  const sessao=obterSessaoPortal(token) || obterSessao(token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão inválida."});
  if(sessao.tipo!=="ARQUITETO" && sessao.tipo!=="ADMIN") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Somente arquiteto ou ADMIN pode solicitar."});
  dados=dados||{};
  const id="SOL-"+Utilities.getUuid().slice(0,8).toUpperCase();
  const arquitetoId=sessao.tipo==="ARQUITETO"?sessao.id:(dados.arquitetoId||"");
  const arquitetoEmail=sessao.tipo==="ARQUITETO"?sessao.email:(dados.arquitetoEmail||"");
  const p=dados.projetoId?obterProjetoInterno(dados.projetoId):null;
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.SOLICITACOES,ARQSELECT_4_HEADERS.SOLICITACOES);
  aba.appendRow([
    id,new Date(),dados.projetoId||"",dados.produtoId||"",arquitetoId,arquitetoEmail,
    dados.fornecedorId||"",dados.fornecedorEmail||"",dados.produto||"",dados.quantidade||"",dados.medida||"",
    dados.especificacao||"",dados.prazo||"",dados.observacoes||"","NOVA",new Date()
  ]);
  if(dados.fornecedorId || dados.fornecedorEmail) criarNotificacaoV4({
    usuario:dados.fornecedorId||dados.fornecedorEmail,
    tipo:"SOLICITACAO",
    titulo:"Nova solicitação de cotação",
    mensagem:"Você recebeu uma nova solicitação"+(p?" para o projeto "+(p["NOME DO PROJETO"]||dados.projetoId):"."),
    registro:id
  });
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,id:id,status:"NOVA"});
}

function criarPropostaV4(token,dados) {
  const sessao=obterSessaoPortal(token);
  if(!sessao || sessao.tipo!=="FORNECEDOR") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Somente fornecedor pode enviar proposta."});
  dados=dados||{};
  const id="PROP-"+Utilities.getUuid().slice(0,8).toUpperCase();
  const qtd=Number(dados.quantidade||0);
  const unit=Number(String(dados.valorUnitario||dados.valor_unitario||"0").replace(",","."))||0;
  const total=Number(dados.valorTotal||dados.valor_total||qtd*unit)||0;
  garantirAbaV4(ARQSELECT_4_SHEETS.PROPOSTAS,ARQSELECT_4_HEADERS.PROPOSTAS).appendRow([
    id,new Date(),dados.solicitacaoId||"",dados.projetoId||"",sessao.id,sessao.email,
    dados.arquitetoId||"",dados.arquitetoEmail||"",dados.produto||"",dados.quantidade||"",
    unit,total,dados.frete||"",dados.prazo||"",dados.validade||"",dados.condicao||"",
    dados.observacoes||"",dados.anexos||"","ENVIADA",new Date()
  ]);
  criarNotificacaoV4({usuario:dados.arquitetoId||dados.arquitetoEmail||"ADMIN",tipo:"PROPOSTA",titulo:"Nova proposta recebida",mensagem:"O fornecedor "+(sessao.empresa||sessao.nome)+" enviou uma proposta.",registro:id});
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,id:id,status:"ENVIADA",valorTotal:total});
}


function listarContatosPortal(token) {
  const sessao=obterSessaoPortal(token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão expirada."});
  sincronizarBaseLegadaV4();
  const usuarios=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS));
  const tipo=String(sessao.tipo||"").toUpperCase();
  const contatos=usuarios.filter(function(u){
    return String(u.TIPO||"").toUpperCase()!==tipo && String(u.STATUS||"ATIVO").toUpperCase()!=="BLOQUEADO" && String(u.STATUS||"ATIVO").toUpperCase()!=="INATIVO";
  }).map(function(u){
    return {ID:u.ID,TIPO:u.TIPO,NOME:u.NOME||u.EMPRESA||u["E-MAIL"]||u.ID,EMPRESA:u.EMPRESA||"", "E-MAIL":u["E-MAIL"]||"", TELEFONE:u.TELEFONE||"", STATUS:u.STATUS||"ATIVO"};
  });
  return respostaJSON({sucesso:true,autorizado:true,contatos:contatos});
}

function criarConversaPortal(dados) {
  dados=dados||{};
  const sessao=obterSessaoPortal(dados.token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão expirada. Faça login novamente."});
  const meuId=String(sessao.id||"").trim();
  const outro=String(dados.participanteBId||dados.destinatarioId||dados.participanteAId||"").trim();
  if(!meuId||!outro||meuId===outro) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Participante inválido."});
  const alvo=localizarUsuarioV4(outro, String(sessao.tipo).toUpperCase()==="ARQUITETO"?"FORNECEDOR":"ARQUITETO") || localizarUsuarioV4(outro,"ARQUITETO") || localizarUsuarioV4(outro,"FORNECEDOR");
  if(!alvo) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Contato não encontrado."});
  const conversas=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS));
  const projeto=String(dados.projetoId||"");
  const existente=conversas.find(function(c){
    const a=String(c["PARTICIPANTE A ID"]||""); const b=String(c["PARTICIPANTE B ID"]||"");
    const mesmo=(a===meuId&&b===outro)||(a===outro&&b===meuId);
    return mesmo && String(c["PROJETO ID"]||"")===projeto && String(c.STATUS||"ABERTA").toUpperCase()!=="ENCERRADA";
  });
  if(existente) return respostaJSON({sucesso:true,autorizado:true,id:existente.ID,existente:true});
  const meNome=sessao.nome||sessao.empresa||sessao.email;
  return criarConversaV4(null,{_session:sessao,participanteAId:meuId,participanteANome:meNome,participanteBId:outro,participanteBNome:alvo.NOME||alvo.EMPRESA||outro,tipo:projeto?"PROJETO":"GERAL",projetoId:projeto});
}

function enviarMensagemPortal(dados) {
  dados=dados||{};
  const sessao=obterSessaoPortal(dados.token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão expirada. Faça login novamente."});
  const convId=String(dados.conversaId||"").trim();
  const conv=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS)).find(function(c){return String(c.ID||"")===convId;});
  if(!conv) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Conversa não encontrada."});
  const souA=String(conv["PARTICIPANTE A ID"]||"")===String(sessao.id||"");
  const souB=String(conv["PARTICIPANTE B ID"]||"")===String(sessao.id||"");
  if(!souA&&!souB) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Você não participa desta conversa."});
  const destinoId=souA?conv["PARTICIPANTE B ID"]:conv["PARTICIPANTE A ID"];
  const destino=localizarUsuarioV4(destinoId) || {};
  let arquivos=dados.arquivos||"";
  if(Array.isArray(dados.arquivos)) {
    const lista=[];
    let pasta=null;
    try { pasta=obterPastaDrive("ARQSELECT", "CHAT"); } catch(e) {}
    if(pasta) {
      dados.arquivos.slice(0,8).forEach(function(f){
        if(!f||!f.base64)return;
        const arq=salvarArquivo(f,pasta);
        if(arq)lista.push(arq);
      });
    }
    arquivos=JSON.stringify(lista);
  }
  const payload={
    conversaId:convId,
    destinatarioTipo:destino.TIPO||"",
    destinatarioId:destinoId,
    destinatarioEmail:destino["E-MAIL"]||"",
    projetoId:conv["PROJETO ID"]||dados.projetoId||"",
    mensagem:String(dados.mensagem||""),
    arquivos:arquivos
  };
  if(!payload.mensagem && arquivos==="") return respostaJSON({sucesso:false,autorizado:true,mensagem:"Envie uma mensagem ou arquivo."});
  return enviarMensagemV4(null,Object.assign({},payload,{_session:sessao}));
}

function listarNotificacoesPortal(token,limite) {
  const sessao=obterSessaoPortal(token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão expirada."});
  const aba=garantirAbaV4(CRM_SHEETS.NOTIFICACOES,CRM_HEADERS.NOTIFICACOES);
  const n=lerAbaComoObjetos(aba).filter(function(x){
    const u=String(x["USUÁRIO"]||"").trim().toLowerCase();
    const id=String(sessao.id||"").trim().toLowerCase();
    const email=String(sessao.email||"").trim().toLowerCase();
    return !u || u===id || u===email;
  }).reverse().slice(0,Math.min(Math.max(Number(limite)||50,1),200));
  return respostaJSON({sucesso:true,autorizado:true,notificacoes:n,naoLidas:n.filter(function(x){return String(x.LIDA||"").toUpperCase()!=="SIM";}).length});
}

function marcarNotificacaoPortal(token,id) {
  const sessao=obterSessaoPortal(token);
  if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão expirada."});
  const aba=garantirAbaV4(CRM_SHEETS.NOTIFICACOES,CRM_HEADERS.NOTIFICACOES);
  const row=encontrarLinhaPorID(aba,id);
  if(!row) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Notificação não encontrada."});
  const o=lerAbaComoObjetos(aba).find(function(x){return String(x.ID||"")===String(id||"")});
  const u=String(o&&o["USUÁRIO"]||"").trim().toLowerCase();
  if(u && u!==String(sessao.id||"").trim().toLowerCase() && u!==String(sessao.email||"").trim().toLowerCase()) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Notificação não pertence à sua conta."});
  const h=obterCabecalhosAba(aba), cLida=encontrarColuna(h,"LIDA"), cData=encontrarColuna(h,"DATA DE LEITURA");
  if(cLida) aba.getRange(row,cLida).setValue("SIM"); if(cData) aba.getRange(row,cData).setValue(new Date());
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true});
}

function obterPastaDrive(nomeRaiz, subpasta) {
  const raiz=String(nomeRaiz||"ARQSELECT");
  const it=DriveApp.getFoldersByName(raiz);
  const pasta=it.hasNext()?it.next():DriveApp.createFolder(raiz);
  if(!subpasta) return pasta;
  const sit=pasta.getFoldersByName(subpasta);
  return sit.hasNext()?sit.next():pasta.createFolder(subpasta);
}

function enviarProjetoFornecedoresV4(token,dados) {
  const sessao=exigirSessao(token);
  dados=dados||{};
  const projetoId=String(dados.projetoId||dados.idProjeto||"").trim();
  if(!projetoId) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Selecione um projeto."});
  const projeto=obterProjetoInterno(projetoId);
  if(!projeto) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Projeto não encontrado."});
  let refs=dados.fornecedores;
  if(Array.isArray(refs)) refs=refs; else refs=String(refs||"").split(",").map(function(x){return x.trim();}).filter(Boolean);
  if(!refs.length) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Selecione pelo menos um fornecedor."});
  const usuarios=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS)).filter(function(x){return String(x.TIPO||"").toUpperCase()==="FORNECEDOR";});
  const dist=garantirAbaV4(ARQSELECT_4_SHEETS.PROJETO_FORNECEDORES,ARQSELECT_4_HEADERS.PROJETO_FORNECEDORES);
  const resultados=[];
  refs.forEach(function(ref){
    const u=usuarios.find(function(x){return String(x.ID)===String(ref)||String(x["E-MAIL"]||"").toLowerCase()===String(ref).toLowerCase();});
    if(!u) return;
    const idPF="PF-"+Utilities.getUuid().slice(0,8).toUpperCase();
    const mensagem=[
      dados.mensagem||"Novo projeto direcionado pela ARQSELECT.",
      dados.campos&&dados.campos.length?"":"",
      dados.campos&&dados.campos.indexOf("nome")>=0?"Projeto: "+(projeto["NOME DO PROJETO"]||projetoId):"",
      dados.campos&&dados.campos.indexOf("cliente")>=0?"Cliente: "+(projeto.CLIENTE||projeto["NOME CLIENTE"]||""):"",
      dados.campos&&dados.campos.indexOf("tipo")>=0?"Tipo: "+(projeto["TIPO DE PROJETO"]||""):"",
      dados.campos&&dados.campos.indexOf("localizacao")>=0?"Localização: "+(projeto.CIDADE||projeto.LOCALIZAÇÃO||projeto.LOCALIZACAO||""):"",
      dados.campos&&dados.campos.indexOf("area")>=0?"Área: "+(projeto["ÁREA"]||projeto.AREA||""):"",
      dados.campos&&dados.campos.indexOf("prazo")>=0?"Prazo: "+(projeto.PRAZO||""):"",
      dados.campos&&dados.campos.indexOf("arquiteto")>=0?"Arquiteto: "+(projeto.NOME||projeto["ARQUITETO NOME"]||projeto["E-MAIL"]||""):"",
      dados.campos&&dados.campos.indexOf("descricao")>=0?"Descrição: "+(projeto.DESCRIÇÃO||projeto.DESCRICAO||projeto["DESCRIÇÃO"]||""):""
    ].filter(function(x){return String(x||"").trim()!=="";}).join("\n");
    dist.appendRow([idPF,new Date(),projetoId,u.ID,u["E-MAIL"]||"",u.EMPRESA||u.NOME||"","ENVIADO","","",mensagem]);
    const conv=criarOuObterConversaAdminFornecedorV4(u,projeto,token);
    const env=enviarMensagemV4(token,{conversaId:conv.id,destinatarioTipo:"FORNECEDOR",destinatarioId:u.ID,destinatarioEmail:u["E-MAIL"]||"",projetoId:projetoId,mensagem:mensagem});
    criarNotificacaoV4({usuario:u.ID,tipo:"PROJETO",titulo:"Novo projeto direcionado",mensagem:(projeto["NOME DO PROJETO"]||projetoId)+" foi enviado para sua empresa.",registro:projetoId});
    resultados.push({fornecedor:u.ID,nome:u.EMPRESA||u.NOME,conversaId:conv.id});
  });
  registrarHistoricoV4(CONFIG.ADMIN_USERNAME,"ADMIN",CONFIG.ADMIN_USERNAME,"DISTRIBUIR","Projeto "+projetoId+" enviado para "+resultados.length+" fornecedor(es).",projetoId,{fornecedores:resultados});
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,enviados:resultados.length,resultados:resultados,mensagem:"Projeto enviado para "+resultados.length+" fornecedor(es)."});
}

function criarOuObterConversaAdminFornecedorV4(u,projeto,token) {
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS);
  const dados=lerAbaComoObjetos(aba);
  const existing=dados.find(function(c){
    const a=String(c["PARTICIPANTE A ID"]||"")==="ADMIN" && String(c["PARTICIPANTE B ID"]||"")===String(u.ID);
    const b=String(c["PARTICIPANTE B ID"]||"")==="ADMIN" && String(c["PARTICIPANTE A ID"]||"")===String(u.ID);
    return (a||b)&&String(c["PROJETO ID"]||"")===String(projeto["ID PROJETO"]||"");
  });
  if(existing) return {id:existing.ID,existente:true};
  return JSON.parse(criarConversaV4(token,{participanteAId:"ADMIN",participanteANome:"ARQSELECT",participanteBId:u.ID,participanteBNome:u.EMPRESA||u.NOME,tipo:"PROJETO",projetoId:projeto["ID PROJETO"]||""}).getContent());
}


function listarProdutosPortal(dados) {
  dados=dados||{}; const sessao=obterSessaoPortal(dados.token);
  const filtro={}; if(dados.q) filtro.NOME=dados.q; if(dados.categoria) filtro.CATEGORIA=dados.categoria;
  return listarProdutosV4(dados.token,filtro);
}

function obterProdutoPortal(token,id) {
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS);
  const p=lerAbaComoObjetos(aba).find(function(x){return String(x.ID||"")===String(id||"")});
  if(!p || String(p.STATUS||"").toUpperCase()!=="APROVADO") return respostaJSON({sucesso:false,autorizado:!!obterSessaoPortal(token),mensagem:"Produto não encontrado ou não publicado."});
  return respostaJSON({sucesso:true,autorizado:!!obterSessaoPortal(token),produto:p});
}

function uploadProdutoPortal(dados) {
  const sessao=obterSessaoPortal(dados&&dados.token);
  if(!sessao || sessao.tipo!=="FORNECEDOR") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão de fornecedor inválida."});
  const produtoId=String(dados.produtoId||""); const aba=garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS); const row=encontrarLinhaPorID(aba,produtoId);
  if(!row) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Produto não encontrado."});
  const obj=lerAbaComoObjetos(aba).find(function(x){return String(x.ID||"")===produtoId});
  if(String(obj["FORNECEDOR ID"]||"")!==String(sessao.id||"")) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Produto não pertence à sua empresa."});
  const arq=Array.isArray(dados.arquivos)?dados.arquivos.slice(0,10):[]; const fotos=[],videos=[]; let pasta;
  try{pasta=obterPastaDrive("ARQSELECT","PRODUTOS");}catch(e){return respostaJSON({sucesso:false,autorizado:true,mensagem:"Não foi possível acessar o armazenamento de arquivos."});}
  arq.forEach(function(f){if(!f||!f.base64)return; if(Number(f.tamanho||0)>10*1024*1024)return; const salvo=salvarArquivo(f,pasta); if(salvo){if(String(salvo.mimeType||"").indexOf("video/")===0)videos.push(salvo.url);else fotos.push(salvo.url);}});
  const h=obterCabecalhosAba(aba), cf=encontrarColuna(h,"FOTOS"), cv=encontrarColuna(h,"VIDEOS"), ca=encontrarColuna(h,"DATA ATUALIZACAO");
  if(cf && fotos.length) aba.getRange(row,cf).setValue((obj.FOTOS?obj.FOTOS+"\n":"")+fotos.join("\n"));
  if(cv && videos.length) aba.getRange(row,cv).setValue((obj.VIDEOS?obj.VIDEOS+"\n":"")+videos.join("\n"));
  if(ca) aba.getRange(row,ca).setValue(new Date()); incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,fotos:fotos,videos:videos,mensagem:"Arquivos do produto enviados."});
}

function solicitarCotacaoProdutoPortal(dados) {
  const sessao=obterSessaoPortal(dados&&dados.token); if(!sessao||sessao.tipo!=="ARQUITETO") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Somente arquitetos podem solicitar orçamento."});
  const p=obterProdutoPortal(dados.token,dados.produtoId); const po=JSON.parse(p.getContent()); if(!po.sucesso) return p;
  const prod=po.produto||{};
  return criarSolicitacaoV4(dados.token,{projetoId:dados.projetoId||"",produtoId:prod.ID,arquitetoId:sessao.id,arquitetoEmail:sessao.email,fornecedorId:prod["FORNECEDOR ID"],fornecedorEmail:prod["FORNECEDOR E-MAIL"],produto:prod.NOME,quantidade:dados.quantidade||"",medida:dados.medidas||dados.medida||"",especificacao:dados.observacoes||dados.especificacao||"",prazo:dados.prazo||"",observacoes:dados.observacoes||""});
}

function alternarFavoritoPortal(dados) {
  const sessao=obterSessaoPortal(dados&&dados.token); if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão expirada."});
  const tipo=String(dados.tipo||"PRODUTO").toUpperCase(); const rid=String(dados.registroId||dados.id||""); if(!rid) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Registro inválido."});
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.FAVORITOS,ARQSELECT_4_HEADERS.FAVORITOS); const rows=lerAbaComoObjetos(aba);
  const ex=rows.find(function(x){return String(x["USUARIO ID"])===String(sessao.id)&&String(x.TIPO).toUpperCase()===tipo&&String(x["REGISTRO ID"])===rid;});
  if(ex){const row=encontrarLinhaPorID(aba,ex.ID);if(row) aba.deleteRow(row);incrementarVersaoDados();return respostaJSON({sucesso:true,autorizado:true,favoritado:false});}
  let nome=rid;if(tipo==="PRODUTO"){const pr=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS)).find(x=>String(x.ID)===rid);nome=pr?pr.NOME:rid;}
  aba.appendRow([gerarIdCRM("FAV"),new Date(),sessao.id,sessao.tipo,tipo,rid,nome,"ATIVO"]);incrementarVersaoDados();return respostaJSON({sucesso:true,autorizado:true,favoritado:true});
}

function listarSolicitacoesFornecedorPortal(token) {
  const sessao=obterSessaoPortal(token); if(!sessao||sessao.tipo!=="FORNECEDOR") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão de fornecedor inválida."});
  const email=String(sessao.email||"").toLowerCase(); const dados=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.SOLICITACOES,ARQSELECT_4_HEADERS.SOLICITACOES)).filter(function(x){return String(x["FORNECEDOR E-MAIL"]||"").toLowerCase()===email;}).reverse();
  return respostaJSON({sucesso:true,autorizado:true,solicitacoes:dados});
}

function listarTermosPortal(token) {
  const sessao=obterSessaoPortal(token); if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão expirada."});
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.TERMOS,ARQSELECT_4_HEADERS.TERMOS); let termos=lerAbaComoObjetos(aba).filter(function(x){return String(x.ATIVO).toUpperCase()!=="NÃO";});
  if(!termos.length){aba.appendRow(["TERM-1","1.0","Termos de Intermediação ARQSELECT","Este documento representa a política comercial aplicável às oportunidades direcionadas pela ARQSELECT e deve ser substituído pelo instrumento jurídico oficial.",new Date(),"SIM"]);termos=lerAbaComoObjetos(aba);}
  return respostaJSON({sucesso:true,autorizado:true,termos:termos});
}

function aceitarTermosPortal(dados) {
  const sessao=obterSessaoPortal(dados&&dados.token); if(!sessao) return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão expirada."});
  const termoId=String(dados.termoId||""); const term=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.TERMOS,ARQSELECT_4_HEADERS.TERMOS)).find(function(x){return String(x.ID)===termoId;}); if(!term) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Termo não encontrado."});
  const aceiteId=gerarIdCRM("ACE"); garantirAbaV4(ARQSELECT_4_SHEETS.ACEITES,ARQSELECT_4_HEADERS.ACEITES).appendRow([aceiteId,new Date(),sessao.id,sessao.tipo,sessao.empresa||sessao.nome,term.ID,term.VERSAO,dados.oportunidadeId||"","SIM",dados.ip||"",dados.observacoes||""]); incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,id:aceiteId,mensagem:"Termos aceitos e registrados."});
}

function statusComercialFornecedorPortal(token) {
  const sessao=obterSessaoPortal(token); if(!sessao||sessao.tipo!=="FORNECEDOR") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão de fornecedor inválida."});
  const u=localizarUsuarioV4(sessao.id,"FORNECEDOR")||{}; let status=String(u["STATUS APROVACAO"]||"PENDENTE").toUpperCase();
  if(status==="APROVADO") status="CONECTADO";
  return respostaJSON({sucesso:true,autorizado:true,status:status,usuario:u});
}

function solicitarConexaoArqselect(dados) {
  const sessao=obterSessaoPortal(dados&&dados.token); if(!sessao||sessao.tipo!=="FORNECEDOR") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Somente fornecedores podem solicitar conexão comercial."});
  const u=localizarUsuarioV4(sessao.id,"FORNECEDOR"); if(!u) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Fornecedor não encontrado."});
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.CONEXOES,ARQSELECT_4_HEADERS.CONEXOES); aba.appendRow([gerarIdCRM("CON"),new Date(),sessao.id,"FORNECEDOR","ARQSELECT","ADMIN","PENDENTE",new Date()]); criarNotificacaoV4({usuario:"ADMIN",tipo:"CONEXAO",titulo:"Solicitação de conexão comercial",mensagem:(sessao.empresa||sessao.nome||sessao.email)+" solicitou conexão com a ARQSELECT.",registro:sessao.id}); incrementarVersaoDados(); return respostaJSON({sucesso:true,autorizado:true,mensagem:"Solicitação enviada para análise da ARQSELECT."});
}

function adminComercialResumo(token){exigirSessao(token);const ops=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.OPORTUNIDADES,ARQSELECT_4_HEADERS.OPORTUNIDADES));const neg=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.NEGOCIOS,ARQSELECT_4_HEADERS.NEGOCIOS));const fech=neg.filter(x=>String(x.STATUS).toUpperCase()==="NEGÓCIO FECHADO"||String(x.STATUS).toUpperCase()==="FECHADO");const vol=fech.reduce((a,x)=>a+Number(String(x.VALOR||0).replace(/[^0-9,.-]/g,"").replace(/\./g,"").replace(",",".")),0);return respostaJSON({sucesso:true,autorizado:true,resumo:{oportunidadesAbertas:ops.filter(x=>!['FECHADO','CANCELADO'].includes(String(x.STATUS).toUpperCase())).length,negociacoes:ops.filter(x=>String(x.STATUS).toUpperCase()==='NEGOCIAÇÃO').length,negociosFechados:fech.length,volumeMovimentado:vol,comissoesPendentes:neg.filter(x=>String(x["PAGAMENTO STATUS"]).toUpperCase()!=='PAGO').reduce((a,x)=>a+Number(x["VALOR COMISSAO"]||0),0),comissoesRecebidas:neg.filter(x=>String(x["PAGAMENTO STATUS"]).toUpperCase()==='PAGO').reduce((a,x)=>a+Number(x["VALOR COMISSAO"]||0),0),taxaConversao:ops.length?fech.length/ops.length*100:0}})}
function adminOportunidades(token){exigirSessao(token);return respostaJSON({sucesso:true,autorizado:true,oportunidades:lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.OPORTUNIDADES,ARQSELECT_4_HEADERS.OPORTUNIDADES)).reverse()})}
function adminNegocios(token){exigirSessao(token);return respostaJSON({sucesso:true,autorizado:true,negocios:lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.NEGOCIOS,ARQSELECT_4_HEADERS.NEGOCIOS)).reverse()})}
function adminComissaoConfig(token){exigirSessao(token);let a=garantirAbaV4(ARQSELECT_4_SHEETS.COMISSOES,ARQSELECT_4_HEADERS.COMISSOES);let d=lerAbaComoObjetos(a);if(!d.length){[["COM-1",new Date(),0,20000,15,"SIM",""],["COM-2",new Date(),20000,50000,10,"SIM",""],["COM-3",new Date(),50000,100000,8,"SIM",""],["COM-4",new Date(),100000,"",7,"SIM",""]].forEach(r=>a.appendRow(r));d=lerAbaComoObjetos(a);}return respostaJSON({sucesso:true,autorizado:true,faixas:d})}
function adminComissaoSalvar(token,dados){exigirSessao(token);const a=garantirAbaV4(ARQSELECT_4_SHEETS.COMISSOES,ARQSELECT_4_HEADERS.COMISSOES);(Array.isArray(dados.faixas)?dados.faixas:[]).forEach(function(f){const row=encontrarLinhaPorID(a,f.id);const vals=[f.id||gerarIdCRM("COM"),new Date(),Number(f.min||0),f.max===''?'':Number(f.max),Number(f.percentual||0),f.ativo===false?'NÃO':'SIM',f.observacoes||""];if(row)a.getRange(row,1,1,7).setValues([vals]);else a.appendRow(vals);});incrementarVersaoDados();return respostaJSON({sucesso:true,autorizado:true,mensagem:"Faixas de comissão atualizadas."})}
function adminNegocioCriar(token,dados){exigirSessao(token);const op=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.OPORTUNIDADES,ARQSELECT_4_HEADERS.OPORTUNIDADES)).find(x=>String(x["ID OPORTUNIDADE"])===String(dados.oportunidadeId||""));if(!op)return respostaJSON({sucesso:false,autorizado:true,mensagem:"Oportunidade não encontrada."});const valor=Number(String(dados.valor||0).replace(/\./g,"").replace(",","."))||0;if(valor<=0)return respostaJSON({sucesso:false,autorizado:true,mensagem:"Informe o valor final do negócio."});const faixas=JSON.parse(adminComissaoConfig(token).getContent()).faixas||[];let pct=0;faixas.forEach(f=>{const min=Number(f["VALOR MIN"]||0),max=f["VALOR MAX"]===''?Infinity:Number(f["VALOR MAX"]);if(valor>=min&&valor<=max&&String(f.ATIVO).toUpperCase()!=='NÃO')pct=Number(f.PERCENTUAL||0);});const vcom=valor*pct/100;const id=gerarIdCRM("NEG");garantirAbaV4(ARQSELECT_4_SHEETS.NEGOCIOS,ARQSELECT_4_HEADERS.NEGOCIOS).appendRow([id,new Date(),op["ID OPORTUNIDADE"],op["ID PROJETO"],op["ARQUITETO ID"],op["FORNECEDOR ID"],op.PRODUTO||"",valor,pct,vcom,String(dados.status||"NEGÓCIO FECHADO"),"","PENDENTE","",dados.observacoes||""]);registrarHistoricoV4(CONFIG.ADMIN_USERNAME,"ADMIN",CONFIG.ADMIN_USERNAME,"NEGOCIO_FECHADO","Negócio "+id+" registrado.",id,{valor:valor,pct:pct});incrementarVersaoDados();return respostaJSON({sucesso:true,autorizado:true,id:id,comissaoPercentual:pct,valorComissao:vcom,mensagem:"Negócio registrado e comissão calculada."})}

function listarRegistrosAdminV4(token,modulo) {
  exigirSessao(token);
  const mapa={
    usuarios:[ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS],
    produtos:[ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS],
    conversas:[ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS],
    mensagens:[ARQSELECT_4_SHEETS.MENSAGENS,ARQSELECT_4_HEADERS.MENSAGENS],
    solicitacoes:[ARQSELECT_4_SHEETS.SOLICITACOES,ARQSELECT_4_HEADERS.SOLICITACOES],
    propostas:[ARQSELECT_4_SHEETS.PROPOSTAS,ARQSELECT_4_HEADERS.PROPOSTAS],
    distribuicoes:[ARQSELECT_4_SHEETS.PROJETO_FORNECEDORES,ARQSELECT_4_HEADERS.PROJETO_FORNECEDORES],
    historico:[ARQSELECT_4_SHEETS.HISTORICO,ARQSELECT_4_HEADERS.HISTORICO],
    projetos:["PROJETOS",[]]
  };
  const m=mapa[String(modulo||"").toLowerCase()];
  if(!m) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Módulo inválido."});
  const aba=(m[0]==="PROJETOS" ? obterAbaProjetos() : garantirAbaV4(m[0],m[1]));
  const dados=lerAbaComoObjetos(aba).reverse();
  return respostaJSON({sucesso:true,autorizado:true,modulo:modulo,dados:dados});
}

function obterDashboardV4(token) {
  exigirSessao(token);
  garantirEstruturaV4();
  sincronizarBaseLegadaV4();
  const usuarios=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS));
  const fornecedores=usuarios.filter(x=>x.TIPO==="FORNECEDOR");
  const arquitetos=usuarios.filter(x=>x.TIPO==="ARQUITETO");
  const produtos=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS));
  const solicitacoes=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.SOLICITACOES,ARQSELECT_4_HEADERS.SOLICITACOES));
  const propostas=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.PROPOSTAS,ARQSELECT_4_HEADERS.PROPOSTAS));
  const conversas=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS));
  const projetos=lerPlanilha(false);
  const notificacoes=lerAbaComoObjetos(garantirAbaV4(CRM_SHEETS.NOTIFICACOES,CRM_HEADERS.NOTIFICACOES));
  return respostaJSON({
    sucesso:true,autorizado:true,
    indicadores:{
      arquitetos:arquitetos.length,
      fornecedores:fornecedores.length,
      fornecedoresPendentes:fornecedores.filter(x=>String(x["STATUS APROVACAO"]||"PENDENTE").toUpperCase()!=="APROVADO").length,
      fornecedoresAprovados:fornecedores.filter(x=>String(x["STATUS APROVACAO"]||"").toUpperCase()==="APROVADO").length,
      produtos:produtos.length,
      produtosPendentes:produtos.filter(x=>String(x.STATUS).toUpperCase()==="PENDENTE").length,
      projetos:projetos.length,
      projetosAtivos:projetos.filter(x=>["NOVO","Novo","EM ANÁLISE","Em análise","ORÇAMENTO","Orçamento","PROPOSTA_ENVIADA","Proposta enviada","NEGOCIAÇÃO","Negociação","APROVAÇÃO","Aprovação","EM_EXECUÇÃO","Em execução"].indexOf(String(x.STATUS||""))>=0).length,
      solicitacoes:solicitacoes.length,
      propostas:propostas.length,
      conversas:conversas.length,
      mensagensNaoLidas:listarMensagensNaoLidasV4("ADMIN").length,
      notificacoesNaoLidas:notificacoes.filter(x=>String(x.LIDA).toUpperCase()!=="SIM").length,
      novosCadastros:usuarios.filter(function(x){
        const d=converterData(x["DATA CADASTRO"]);
        if(!d) return false;
        const hoje=zerarHora(new Date());
        return zerarHora(d).getTime()===hoje.getTime();
      }).length
    },
    ultimosUsuarios:usuarios.reverse().slice(0,12),
    ultimasNotificacoes:notificacoes.reverse().slice(0,12)
  });
}

function listarMensagensNaoLidasV4(destinoId) {
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.MENSAGENS,ARQSELECT_4_HEADERS.MENSAGENS);
  return lerAbaComoObjetos(aba).filter(function(x){return String(x["DESTINATARIO ID"]||"").toUpperCase()===String(destinoId||"").toUpperCase() && String(x.LIDA||"").toUpperCase()!=="SIM";});
}

function registrarHistoricoV4(usuarioId, modulo, usuarioNome, acao, descricao, registroId, dados) {
  try {
    const aba=garantirAbaV4(ARQSELECT_4_SHEETS.HISTORICO,ARQSELECT_4_HEADERS.HISTORICO);
    aba.appendRow([
      gerarIdCRM("HST"),new Date(),modulo||"SISTEMA",usuarioId||"",usuarioNome||"",
      modulo||"SISTEMA",registroId||"",acao||"",descricao||"",dados?JSON.stringify(dados):""
    ]);
  } catch(e) {}
}

function obterPainelAdminV4(token) {
  exigirSessao(token);
  const dash=JSON.parse(obterDashboardV4(token).getContent());
  const usuarios=JSON.parse(obterUsuariosV4(token,"","").getContent());
  return respostaJSON({
    sucesso:true,autorizado:true,
    dashboard:dash.indicadores,
    usuarios:usuarios.usuarios,
    notificacoes:dash.ultimasNotificacoes || [],
    timestamp:new Date().toISOString(),
    versao:obterVersaoDados()
  });
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
    tipo = String(tipo || "").toUpperCase();

    if (["ARQUITETO","FORNECEDOR"].indexOf(tipo) === -1) {
      return respostaJSON({sucesso:false, autorizado:false, mensagem:"Tipo de cadastro inválido."});
    }

    const nome = String(dados.nome || dados.responsavel || "").trim();
    const email = String(dados.email || "").trim().toLowerCase();
    const senha = String(dados.senha || dados.password || "");
    const empresa = String(
      dados.empresa ||
      dados.escritorio ||
      dados.nome_fantasia ||
      dados.razao_social ||
      ""
    ).trim();
    const telefone = String(
      dados.telefone ||
      dados.whatsapp ||
      ""
    ).trim();
    const documento = String(
      dados.registro ||
      dados.registro_profissional ||
      dados.cau ||
      dados.cnpj ||
      ""
    ).trim();

    if (!nome || !email || !senha) {
      return respostaJSON({
        sucesso:false,
        autorizado:false,
        mensagem:"Preencha nome, e-mail e senha."
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return respostaJSON({
        sucesso:false,
        autorizado:false,
        mensagem:"Informe um e-mail válido."
      });
    }

    if (senha.length < 6) {
      return respostaJSON({
        sucesso:false,
        autorizado:false,
        mensagem:"A senha deve ter no mínimo 6 caracteres."
      });
    }

    if (localizarPortalUsuario(tipo, email)) {
      return respostaJSON({
        sucesso:false,
        autorizado:false,
        mensagem:"Já existe um acesso cadastrado para este e-mail."
      });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(15000);

    try {
      // Dobra a proteção contra dois cadastros simultâneos do mesmo e-mail.
      if (localizarPortalUsuario(tipo, email)) {
        return respostaJSON({
          sucesso:false,
          autorizado:false,
          mensagem:"Já existe um acesso cadastrado para este e-mail."
        });
      }

      const aba = obterAbaPortal(tipo);
      const id = (tipo === "ARQUITETO" ? "ARQ-" : "FOR-") +
        Utilities.getUuid().slice(0,8).toUpperCase();

      const statusInicial = "ATIVO";

      aba.appendRow([
        id,
        new Date(),
        nome,
        empresa,
        email,
        telefone,
        documento,
        hashPortalSenha(senha),
        statusInicial,
        ""
      ]);

      SpreadsheetApp.flush();

      const versao = incrementarVersaoDados();

      // Integração correta: cadastro de acesso -> CRM/usuários -> notificação.
      registrarCadastroPortalCRM({
        tipo: tipo,
        id: id,
        nome: nome,
        empresa: empresa,
        email: email,
        telefone: telefone,
        documento: documento,
        dados: dados
      });

      registrarAuditoriaPublica(
        email,
        "CADASTRO_PORTAL",
        tipo,
        id,
        "",
        "",
        "Novo acesso criado e sincronizado com o CRM."
      );

      return respostaJSON({
        sucesso:true,
        autorizado:true,
        id:id,
        tipo:tipo,
        versao:versao,
        mensagem:"Cadastro realizado com sucesso. Seu cadastro já foi enviado para análise administrativa."
      });
    } finally {
      try { lock.releaseLock(); } catch (e) {}
    }

  } catch (erro) {
    registrarErro(erro, "cadastrarPortalUsuario");
    return respostaJSON({
      sucesso:false,
      autorizado:false,
      mensagem:"Não foi possível concluir o cadastro.",
      detalhe:obterMensagemErro(erro)
    });
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
    if (sessao.tipo === "FORNECEDOR") {
      return String(p["FORNECEDOR E-MAIL"] || "").trim().toLowerCase() === email;
    }
    return String(p["E-MAIL"] || "").trim().toLowerCase() === email;
  });
  const contagem = {};
  meusProjetos.forEach(function(p) { const st = String(p["STATUS"] || "Novo").trim(); contagem[st] = (contagem[st]||0)+1; });
  const recentes = meusProjetos.slice(-8).reverse().map(function(p) {
    return {id:p["ID PROJETO"]||"", data:p["DATA / HORA"]||"", projeto:p["NOME DO PROJETO"]||"", tipo:p["TIPO DE PROJETO"]||"", investimento:p["INVESTIMENTO"]||"", status:p["STATUS"]||"Novo", cidade:p["CIDADE"]||"", fornecedorNome:p["FORNECEDOR NOME"]||"", fornecedorEmail:p["FORNECEDOR E-MAIL"]||"", respostaFornecedor:p["RESPOSTA FORNECEDOR"]||""};
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

    dados = dados || {};

    const planilha = obterPlanilha();
    const nomeAba = CRM_SHEETS.FORNECEDORES;

    let aba = planilha.getSheetByName(nomeAba);

    if (!aba) {
      aba = planilha.insertSheet(nomeAba);
      configurarCabecalhoFornecedor(aba);
    } else {
      configurarCabecalhoFornecedor(aba);
    }

    const email = String(dados.email || "").trim().toLowerCase();
    const cnpj = String(dados.cnpj || "").trim();
    const razao = String(dados.razao_social || "").trim();

    // Compatibilidade: evita duplicar o mesmo fornecedor em reenviados.
    const existente = localizarFornecedorOperacional(email, cnpj);
    let linha;

    if (existente) {
      linha = existente.linha;
      const cab = aba.getRange(1,1,1,aba.getLastColumn()).getDisplayValues()[0];
      const mapa = {};
      for (let i=0;i<cab.length;i++) mapa[String(cab[i]||"").trim()] = i + 1;

      const atualizacoes = {
        "Razão Social": dados.razao_social || "",
        "Nome Fantasia": dados.nome_fantasia || "",
        "CNPJ": dados.cnpj || "",
        "Site": dados.site || "",
        "Instagram": dados.instagram || "",
        "Cidade": dados.cidade || "",
        "Estado": dados.estado || "",
        "Responsável": dados.responsavel || "",
        "Cargo": dados.cargo || "",
        "E-mail": dados.email || "",
        "Telefone": dados.telefone || "",
        "Produtos": dados.produtos || "",
        "Marcas": dados.marcas || "",
        "Prazo de Entrega": dados.prazo_entrega || "",
        "Região": dados.regiao || "",
        "Pedido Mínimo": dados.pedido_minimo || "",
        "Pagamento": dados.pagamento || "",
        "Tabela": dados.tabela || "",
        "Proposta": dados.proposta || "",
        "Status": dados.status || "Novo"
      };

      Object.keys(atualizacoes).forEach(function(chave){
        if (mapa[chave]) aba.getRange(linha, mapa[chave]).setValue(atualizacoes[chave]);
      });
    } else {
      aba.appendRow([
        new Date(),
        dados.razao_social || "",
        dados.nome_fantasia || "",
        dados.cnpj || "",
        dados.site || "",
        dados.instagram || "",
        dados.cidade || "",
        dados.estado || "",
        dados.responsavel || "",
        dados.cargo || "",
        dados.email || "",
        dados.telefone || "",
        dados.produtos || "",
        dados.marcas || "",
        dados.prazo_entrega || "",
        dados.regiao || "",
        dados.pedido_minimo || "",
        dados.pagamento || "",
        dados.tabela || "",
        dados.proposta || "",
        dados.status || "Novo"
      ]);
      linha = aba.getLastRow();
    }

    SpreadsheetApp.flush();

    const versao = incrementarVersaoDados();

    const fornecedorId = "FOR-" + Utilities.getUuid().slice(0,8).toUpperCase();

    registrarCadastroPortalCRM({
      tipo:"FORNECEDOR",
      id:fornecedorId,
      nome:dados.responsavel || "",
      empresa:dados.nome_fantasia || razao,
      email:email,
      telefone:dados.telefone || "",
      documento:cnpj,
      dados:dados,
      origem:"FORMULARIO_PUBLICO_FORNECEDOR"
    });

    registrarAuditoria(
      "SISTEMA",
      "CRIAR",
      "FORNECEDORES",
      cnpj || razao || fornecedorId,
      "",
      JSON.stringify(dados),
      "Cadastro de fornecedor recebido, sincronizado com CRM e notificação gerada."
    );

    return respostaJSON({
      sucesso:true,
      autorizado:true,
      tipo:"fornecedor",
      fornecedorId:fornecedorId,
      linha:linha,
      versao:versao,
      mensagem:"Cadastro de fornecedor recebido com sucesso e enviado ao CRM."
    });

  } catch (erro) {

    registrarErro(
      erro,
      "receberFornecedor"
    );

    return respostaJSON({
      sucesso:false,
      autorizado:false,
      mensagem:"Não foi possível cadastrar o fornecedor.",
      detalhe:obterMensagemErro(erro)
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

function extrairURLs(valor) {
  const texto = String(valor || "");
  const encontrados = texto.match(/https?:\/\/[^\s<>"']+/g) || [];
  return encontrados.map(function(u){ return u.replace(/[\)\]\.,;]+$/g, ""); });
}

function extrairURL(valor) {
  const urls = extrairURLs(valor);
  return urls.length ? urls[0] : "";
}

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
