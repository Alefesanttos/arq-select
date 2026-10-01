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

  // Credenciais ADMIN ficam em Script Properties.
  // Chaves: ARQSELECT_ADMIN_USERNAME e ARQSELECT_ADMIN_PASSWORD
  // Após o primeiro login válido, a senha em texto da propriedade é migrada
  // para ARQSELECT_ADMIN_PASSWORD_SHA256 e removida da propriedade original.
  ADMIN_USERNAME:
    "ADMIN",

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
    "5.9.0",

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
    "DATA DE LEITURA",
    "DESTINO",
    "DESTINO ID"

  ]

};


var ARQSELECT_BACKEND_BUILD = "2026.10.01.640-ARQSELECT-ROUND2-SAFE-USERS";

/* ==========================================================
   GET
========================================================== */

function doGet(e) {

  try {

    /* ARQSELECT BACKEND HARDENING v2026.08.29.01
       Normaliza os parâmetros do GET em uma única referência imutável.
       Isso evita referências acidentais a objetos inexistentes e mantém
       compatibilidade com handlers antigos que utilizam o nome `dados`. */
    const params = Object.assign({}, (e && e.parameter) ? e.parameter : {});
    const dados = Object.assign({}, params);

    const acao =
      String(
        params.acao ||
        params.action ||
        "teste"
      ).trim();


    /* ======================================================
       ARQSELECT ROUND 2 — FILTROS / SOFT DELETE / SEGURANÇA
       Executa antes das rotas legadas para garantir que
       usuários inativos/excluídos não escapem por aliases.
    ====================================================== */
    const round2Get = rotearARQSELECTRound2Integrado(acao, dados, "GET");
    if (round2Get) return round2Get;


    if (acao === "backend_build" || acao === "build" || acao === "health" || acao === "ping") {
      return respostaJSON({sucesso:true, autorizado:true, build:ARQSELECT_BACKEND_BUILD, servidor:"online"});
    }


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
        build: ARQSELECT_BACKEND_BUILD,
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

    if (acao === "login" || acao === "login_admin") {
      // Credentials in a GET URL leak into browser history, proxy logs and referrers.
      // The administrative frontend submits login_admin by POST.
      return respostaJSON({
        sucesso:false,
        autorizado:false,
        codigo:"AUTH_POST_REQUIRED",
        mensagem:"Envie o login administrativo por POST."
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

    if (acao === "login_prestador") {
      return loginPortalUsuario({
        tipo: "PRESTADOR",
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

    if (acao === "cadastrar_prestador" || acao === "cadastro_prestador" || acao === "registrar_prestador") {
      return cadastrarPortalUsuario(params, "PRESTADOR");
    }

    if (acao === "portal_sessao") {
      return validarSessaoPortal({ token: params.token });
    }

    if (acao === "portal_dashboard") {
      return dashboardPortalARQ(params.token);
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
    if (acao === "admin_v4_dashboard") return dashboardAdminARQ(dados.token);
    if (acao === "admin_v4_painel") return obterPainelAdminV4(dados.token);
    if (acao === "admin_v4_usuarios") return obterUsuariosV4(dados.token,dados.tipo,dados.busca);
    if (acao === "admin_v4_fornecedor") return obterFornecedorCRMDetalheV4(dados.token,dados.id);
    if (acao === "admin_v4_notificacoes") return listarNotificacoesV4(dados.token,dados.limite);
    if (acao === "admin_v4_notificacao_lida") return marcarNotificacaoV4(dados.token,dados.id);
    if (acao === "admin_v4_notificacoes_todas_lidas") return marcarTodasNotificacoesV4(dados.token);
    if (acao === "admin_v4_listar") return listarRegistrosAdminV4(dados.token,dados.modulo);
    if (acao === "admin_v4_conversa_criar") return criarConversaARQ(dados.token,dados);
    if (acao === "admin_v4_conversas") return listarConversasARQ(dados.token);
    if (acao === "admin_v4_mensagens") return listarMensagensARQ(dados.token,dados.conversaId);
    if (acao === "admin_v4_mensagem_enviar") return enviarMensagemARQ(dados.token,dados);
    if (acao === "admin_v4_produto_moderar") return moderarProdutoV4(dados.token,dados.id,dados.status);
    if (acao === "admin_v4_projeto_distribuir") return distribuirProjetoV4(dados.token,dados.idProjeto,dados.fornecedores);
    if (acao === "admin_v4_projeto_enviar_fornecedor") return distribuirProjetoV4(dados.token,dados.projetoId||dados.idProjeto,dados.fornecedores);
    if (acao === "admin_v4_solicitacao") return criarSolicitacaoV4(dados.token,dados);
    if (acao === "admin_v4_proposta") return criarPropostaV4(dados.token,dados);
    if (acao === "dashboard_v4" || acao === "dashboard_admin") return dashboardAdminARQ(dados.token);
    if (acao === "admin_comercial_resumo") return obterResumoComercialV4(dados.token);
    if (acao === "admin_oportunidades") return listarOportunidadesComerciaisV4(dados.token);
    if (acao === "admin_negocios") return listarNegociosV4(dados.token);
    if (acao === "admin_negocio_criar") return criarNegocioARQ(dados.token,dados);
    if (acao === "admin_comissao_config") return comissoesFixasARQ(dados.token);
    if (acao === "admin_comissao_salvar") return salvarComissoesFixasARQ(dados.token,dados);
    if (acao === "admin_v4_projeto_informacao_fornecedor") return enviarInformacaoProjetoFornecedorV4(dados.token,dados);
    /* ======================================================
       COMPATIBILIDADE DIRETA — USUARIOS / FORNECEDORES / ARQUITETOS
       Aceita aliases usados por versões anteriores do ADMIN.
    ====================================================== */
    if (acao === "usuarios" || acao === "admin_usuarios" || acao === "admin_usuarios_listar") {
      exigirSessao(params.token);
      return obterUsuariosV4(params.token, params.tipo || "", params.busca || "");
    }
    if (acao === "fornecedores" || acao === "admin_fornecedores") {
      exigirSessao(params.token);
      return obterUsuariosV4(params.token, "FORNECEDOR", params.busca || "");
    }
    if (acao === "arquitetos" || acao === "admin_arquitetos") {
      exigirSessao(params.token);
      return obterUsuariosV4(params.token, "ARQUITETO", params.busca || "");
    }

    /* ======================================================
       PORTAL PREMIUM — PROJETOS / STATUS
    ====================================================== */
    if (acao === "portal_projetos") return projetosPortalARQ(params.token);
    if (acao === "portal_atualizar_status") return atualizarStatusPortalSeguro(params.token, params.id, params.status);
    if (acao === "portal_solicitacoes") return projetosPortalARQ(params.token);
    if (acao === "portal_projeto_detalhe") return detalheProjetoPortalARQ(params.token, params.id);
    if (acao === "portal_logout") return logoutPortal(params.token);
    if (acao === "portal_fornecedor_projetos") return oportunidadesFornecedorARQ(params.token);
    if (acao === "portal_fornecedor_responder") return responderProjetoFornecedorARQ(params);
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


    // Camadas 6.3 e 6.0: preservam rotas legadas ao retornar null para outras ações.
    if (typeof rotearARQSELECT10 === "function") {
      const respostaArqselect10Get = rotearARQSELECT10(acao, dados, "GET");
      if (respostaArqselect10Get) return respostaArqselect10Get;
    }
    if (typeof rotearARQSELECT9 === "function") {
      const respostaArqselect9Get = rotearARQSELECT9(acao, dados, "GET");
      if (respostaArqselect9Get) return respostaArqselect9Get;
    }

    const respostaArqselect8Get = rotearARQSELECT8(acao, dados, "GET");
    if (respostaArqselect8Get) return respostaArqselect8Get;

    const respostaArqselect7Get = rotearARQSELECT7(acao, dados, "GET");
    if (respostaArqselect7Get) return respostaArqselect7Get;

    const respostaArqselect6Get = rotearARQSELECT6(acao, dados, "GET");
    if (respostaArqselect6Get) return respostaArqselect6Get;

    const respostaArqselect4Get = rotearARQSELECT4(acao, dados, "GET");
    if (respostaArqselect4Get) return respostaArqselect4Get;

    const respostaArqselect5Get = rotearARQSELECT5(acao, dados, "GET");
    if (respostaArqselect5Get) return respostaArqselect5Get;
    const respostaArqselect3Get = rotearARQSELECT3(acao, dados, "GET");
    if (respostaArqselect3Get) return respostaArqselect3Get;

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
    const params = dados;


    const acao =
      String(

        dados.acao ||
        dados.action ||
        ""

      ).trim();


    /* ======================================================
       ARQSELECT ROUND 2 — FILTROS / SOFT DELETE / SEGURANÇA
    ====================================================== */
    const round2Post = rotearARQSELECTRound2Integrado(acao, dados, "POST");
    if (round2Post) return round2Post;

    // Administrative controls are POST-only and validate the ADMIN session server-side.
    if (acao === "admin_usuario_painel") return painelUsuarioAdminARQSELECT(dados.token, dados);
    if (acao === "admin_catalogo_publicar") return publicarCatalogoAdminARQSELECT(dados.token, dados);


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
        build: ARQSELECT_BACKEND_BUILD,
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
        dados      );

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
    if (acao === "admin_v4_diagnostico") return diagnosticoAdminV4(params.token);
    if (acao === "admin_v4_dashboard") return dashboardAdminARQ(params.token);
    if (acao === "admin_v4_painel") return obterPainelAdminV4(params.token);
    if (acao === "admin_v4_usuarios") return obterUsuariosV4(params.token,params.tipo,params.busca);
    if (acao === "admin_v4_fornecedor") return obterFornecedorCRMDetalheV4(params.token,params.id);
    if (acao === "admin_v4_notificacoes") return listarNotificacoesV4(params.token,params.limite);
    if (acao === "admin_v4_notificacao_lida") return marcarNotificacaoV4(params.token,params.id);
    if (acao === "admin_v4_notificacoes_todas_lidas") return marcarTodasNotificacoesV4(params.token);
    if (acao === "admin_v4_listar") return listarRegistrosAdminV4(params.token,params.modulo);
    if (acao === "admin_v4_conversa_criar") return criarConversaARQ(params.token,params);
    if (acao === "admin_v4_conversas") return listarConversasARQ(params.token);
    if (acao === "admin_v4_mensagens") return listarMensagensARQ(params.token,params.conversaId);
    if (acao === "admin_v4_mensagem_enviar") return enviarMensagemARQ(params.token,params);
    if (acao === "admin_v4_produto_moderar") return moderarProdutoV4(params.token,params.id,params.status);
    if (acao === "admin_v4_projeto_distribuir") return distribuirProjetoV4(params.token,params.idProjeto,params.fornecedores);
    if (acao === "admin_v4_projeto_enviar_fornecedor") return distribuirProjetoV4(params.token,params.projetoId||params.idProjeto,params.fornecedores);
    if (acao === "admin_v4_solicitacao") return criarSolicitacaoV4(params.token,params);
    if (acao === "admin_v4_proposta") return criarPropostaV4(params.token,params);
    if (acao === "dashboard_v4" || acao === "dashboard_admin") return dashboardAdminARQ(params.token);
    if (acao === "admin_comercial_resumo") return obterResumoComercialV4(params.token);
    if (acao === "admin_oportunidades") return listarOportunidadesComerciaisV4(params.token);
    if (acao === "admin_negocios") return listarNegociosV4(params.token);
    if (acao === "admin_negocio_criar") return criarNegocioARQ(params.token,params);
    if (acao === "admin_comissao_config") return comissoesFixasARQ(params.token);
    if (acao === "admin_comissao_salvar") return salvarComissoesFixasARQ(params.token,params);
    if (acao === "admin_v4_projeto_informacao_fornecedor") return enviarInformacaoProjetoFornecedorV4(params.token,params);

        /* ======================================================
       PORTAL PREMIUM — PROJETOS / STATUS
    ====================================================== */
    if (acao === "portal_projetos") return projetosPortalARQ(dados.token);
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
      return dashboardPortalARQ(dados.token);
    }

    if (acao === "portal_solicitar_orcamento") {
      return criarSolicitacaoPortal(dados);
    }

    if (acao === "portal_fornecedor_responder") {
      return responderProjetoFornecedorARQ(dados);
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


    // Camadas 6.3 e 6.0: preservam rotas legadas ao retornar null para outras ações.
    if (typeof rotearARQSELECT10 === "function") {
      const respostaArqselect10Post = rotearARQSELECT10(acao, dados, "POST");
      if (respostaArqselect10Post) return respostaArqselect10Post;
    }
    if (typeof rotearARQSELECT9 === "function") {
      const respostaArqselect9Post = rotearARQSELECT9(acao, dados, "POST");
      if (respostaArqselect9Post) return respostaArqselect9Post;
    }

    const respostaArqselect8Post = rotearARQSELECT8(acao, dados, "POST");
    if (respostaArqselect8Post) return respostaArqselect8Post;

    const respostaArqselect7Post = rotearARQSELECT7(acao, dados, "POST");
    if (respostaArqselect7Post) return respostaArqselect7Post;

    const respostaArqselect6Post = rotearARQSELECT6(acao, dados, "POST");
    if (respostaArqselect6Post) return respostaArqselect6Post;

    const respostaArqselect4Post = rotearARQSELECT4(acao, dados, "POST");
    if (respostaArqselect4Post) return respostaArqselect4Post;

    const respostaArqselect5Post = rotearARQSELECT5(acao, dados, "POST");
    if (respostaArqselect5Post) return respostaArqselect5Post;
    const respostaArqselect3Post = rotearARQSELECT3(acao, dados, "POST");
    if (respostaArqselect3Post) return respostaArqselect3Post;

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
   CREDENCIAIS ADMIN SEGURAS — SCRIPT PROPERTIES
========================================================== */

function hashSenhaAdminARQ(senha) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(senha || ""),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    const v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? "0" + v : v;
  }).join("");
}

function normalizarUsuarioAdminARQ(valor) {
  return String(valor == null ? "" : valor).trim().toUpperCase();
}

function obterCredenciaisAdminARQ() {
  const props = PropertiesService.getScriptProperties();
  return {
    usuario: String(props.getProperty("ARQSELECT_ADMIN_USERNAME") || CONFIG.ADMIN_USERNAME || "ADMIN").trim(),
    senhaTemporaria: String(props.getProperty("ARQSELECT_ADMIN_PASSWORD") || ""),
    senhaHash: String(props.getProperty("ARQSELECT_ADMIN_PASSWORD_SHA256") || "").trim().toLowerCase()
  };
}

function credenciaisAdminConfiguradasARQ() {
  const c = obterCredenciaisAdminARQ();
  return Boolean(c.usuario && (c.senhaHash || c.senhaTemporaria));
}

function migrarSenhaAdminParaHashARQ(senha) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty("ARQSELECT_ADMIN_PASSWORD_SHA256", hashSenhaAdminARQ(senha));
  props.deleteProperty("ARQSELECT_ADMIN_PASSWORD");
}

/* ==========================================================
   RECUPERAÇÃO / DIAGNÓSTICO DO ACESSO ADMIN
   Execute estas funções manualmente no editor do Apps Script.
========================================================== */

function diagnosticarAcessoAdminARQSELECT() {
  const credenciais = obterCredenciaisAdminARQ();
  const diagnostico = {
    build: ARQSELECT_BACKEND_BUILD,
    scriptId: ScriptApp.getScriptId(),
    webAppUrl: (function(){ try { return ScriptApp.getService().getUrl() || ""; } catch(e) { return ""; } })(),
    usuarioAdmin: credenciais.usuario || "ADMIN",
    possuiSenhaTemporaria: Boolean(credenciais.senhaTemporaria),
    possuiSenhaHash: Boolean(credenciais.senhaHash),
    configurado: credenciaisAdminConfiguradasARQ()
  };
  Logger.log(JSON.stringify(diagnostico, null, 2));
  return diagnostico;
}

function redefinirAcessoAdminARQSELECT() {
  // Set ARQSELECT_ADMIN_USERNAME and ARQSELECT_ADMIN_PASSWORD in Script
  // Properties using the Apps Script editor before running this function.
  // The submitted password is never returned or written to execution logs.
  const props = PropertiesService.getScriptProperties();
  const usuario = String(props.getProperty("ARQSELECT_ADMIN_USERNAME") || "").trim();
  const senha = String(props.getProperty("ARQSELECT_ADMIN_PASSWORD") || "");
  if (!usuario || senha.length < 12) {
    const resultado = {
      sucesso:false,
      codigo:"AUTH_SETUP_INCOMPLETE",
      mensagem:"Defina ARQSELECT_ADMIN_USERNAME e ARQSELECT_ADMIN_PASSWORD (mínimo 12 caracteres) nas Propriedades do script e execute novamente."
    };
    Logger.log(resultado.codigo);
    return resultado;
  }

  props.setProperty("ARQSELECT_ADMIN_PASSWORD_SHA256", hashSenhaAdminARQ(senha));
  props.deleteProperty("ARQSELECT_ADMIN_PASSWORD");
  if (typeof limparFalhasLoginAdminARQ === "function") {
    limparFalhasLoginAdminARQ(usuario);
    limparFalhasLoginAdminARQ(normalizarUsuarioAdminARQ(usuario));
  }
  Logger.log("Credenciais administrativas configuradas; senha removida das propriedades em texto. Build: " + ARQSELECT_BACKEND_BUILD);
  return {
    sucesso:true,
    usuario:usuario,
    senhaHashConfigurada:true,
    build:ARQSELECT_BACKEND_BUILD,
    mensagem:"Credenciais configuradas. Publique uma nova versão da implantação existente para atualizar o Web App."
  };
}

function confirmarCredenciaisAdminARQSELECT(usuario, senha) {
  const credenciais = obterCredenciaisAdminARQ();
  return {
    usuarioConfere: normalizarUsuarioAdminARQ(usuario) === normalizarUsuarioAdminARQ(credenciais.usuario),
    senhaConfere: Boolean(
      (credenciais.senhaHash && hashSenhaAdminARQ(String(senha || "")) === credenciais.senhaHash) ||
      (credenciais.senhaTemporaria && String(senha || "") === credenciais.senhaTemporaria)
    ),
    configurado: credenciaisAdminConfiguradasARQ(),
    build: ARQSELECT_BACKEND_BUILD
  };
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

    if (typeof loginAdminPermitidoARQ === "function" && !loginAdminPermitidoARQ(usuario)) {
      return respostaJSON({sucesso:false,autorizado:false,mensagem:"Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente."});
    }


    const credenciaisAdmin =
      obterCredenciaisAdminARQ();


    if (!credenciaisAdminConfiguradasARQ()) {
      return respostaJSON({
        sucesso: false,
        autorizado: false,
        codigo: "AUTH_ADMIN_NOT_CONFIGURED",
        mensagem: "Acesso administrativo ainda não configurado. Execute redefinirAcessoAdminARQSELECT no editor do Apps Script ou configure as Script Properties."
      });
    }


    const usuarioValido =
      normalizarUsuarioAdminARQ(usuario) ===
      normalizarUsuarioAdminARQ(credenciaisAdmin.usuario);


    const senhaValida =
      (credenciaisAdmin.senhaHash && hashSenhaAdminARQ(senha) === credenciaisAdmin.senhaHash) ||
      (credenciaisAdmin.senhaTemporaria && senha === credenciaisAdmin.senhaTemporaria);


    if (
      !usuarioValido ||
      !senhaValida
    ) {

      if (typeof registrarFalhaLoginAdminARQ === "function") registrarFalhaLoginAdminARQ(usuario);

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
        codigo: "AUTH_ADMIN_INVALID",
        mensagem:
          "Usuário ou senha inválidos."

      });

    }


    if (credenciaisAdmin.senhaTemporaria) {
      migrarSenhaAdminParaHashARQ(senha);
    }


    const token =
      criarSessao(
        usuario
      );

    if (typeof limparFalhasLoginAdminARQ === "function") limparFalhasLoginAdminARQ(usuario);


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

      Math.min(CONFIG.SESSION_HOURS * 60 * 60, 21600)

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
    normalizarUsuarioAdminARQ(usuario) ===
    normalizarUsuarioAdminARQ(obterCredenciaisAdminARQ().usuario)
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

    // Validate before creating a Drive folder, allocating an ID or writing to Sheets.
    const nomeResponsavel = String(dados.nome || dados.arquiteto || "").trim();
    const emailResponsavel = String(dados.email || "").trim();
    const tituloProjeto = String(dados.projeto || dados.nome_projeto || "").trim();
    const briefingProjeto = [dados.descricao, dados.oque_orcar, dados.orcamento].map(function(v){return String(v || "").trim();}).find(function(v){return v.length >= 15;}) || "";
    const cidadeProjeto = String(dados.cidade || "").trim();
    if (!nomeResponsavel || !emailResponsavel || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailResponsavel) ||
        !tituloProjeto || !cidadeProjeto || briefingProjeto.length < 15) {
      return respostaJSON({sucesso:false, mensagem:"Informe nome e e-mail válido do responsável, nome do projeto, cidade e briefing com pelo menos 15 caracteres."});
    }
    dados.descricao = briefingProjeto;


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
  const meus = projetos.filter(function(p){
    if (sessao.tipo === "ARQUITETO") return String(p["E-MAIL"]||"").trim().toLowerCase() === email;
    return String(p["FORNECEDOR E-MAIL"]||"").trim().toLowerCase() === email;
  });
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
  const permitido = sessao.tipo === "ARQUITETO"
    ? String(p["E-MAIL"]||"").trim().toLowerCase() === email
    : String(p["FORNECEDOR E-MAIL"]||"").trim().toLowerCase() === email;
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
  SpreadsheetApp.flush();  try {
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
  HISTORICO: "ARQSELECT - HISTORICO"
};

const ARQSELECT_4_HEADERS = {
  USUARIOS:["ID","TIPO","DATA CADASTRO","NOME","EMPRESA","E-MAIL","TELEFONE","DOCUMENTO","STATUS","ULTIMO ACESSO","ORIGEM","DADOS JSON","STATUS APROVACAO"],
  PRODUTOS:["ID","FORNECEDOR ID","FORNECEDOR E-MAIL","NOME","SKU","CATEGORIA","SUBCATEGORIA","MARCA","MODELO","DESCRICAO","CARACTERISTICAS","DIMENSOES","MATERIAL","ACABAMENTO","COR","UNIDADE","PRECO","FAIXA PRECO","DISPONIBILIDADE","PRAZO","REGIAO","LINK","FICHA TECNICA","CATALOGO PDF","FOTOS","VIDEOS","STATUS","DATA CRIACAO","DATA ATUALIZACAO"],
  CONVERSAS:["ID","DATA CRIACAO","TIPO","PARTICIPANTE A","PARTICIPANTE A ID","PARTICIPANTE B","PARTICIPANTE B ID","PROJETO ID","PRODUTO ID","SOLICITACAO ID","PROPOSTA ID","ULTIMA MENSAGEM","ULTIMA DATA","STATUS"],
  MENSAGENS:["ID","CONVERSA ID","DATA","REMETENTE TIPO","REMETENTE ID","REMETENTE NOME","DESTINATARIO TIPO","DESTINATARIO ID","DESTINATARIO E-MAIL","PROJETO ID","MENSAGEM","ARQUIVOS","LIDA","DATA LEITURA"],
  SOLICITACOES:["ID","DATA","PROJETO ID","PRODUTO ID","ARQUITETO ID","ARQUITETO E-MAIL","FORNECEDOR ID","FORNECEDOR E-MAIL","PRODUTO","QUANTIDADE","MEDIDA","ESPECIFICACAO","PRAZO","OBSERVACOES","STATUS","DATA ATUALIZACAO"],
  PROPOSTAS:["ID","DATA","SOLICITACAO ID","PROJETO ID","FORNECEDOR ID","FORNECEDOR E-MAIL","ARQUITETO ID","ARQUITETO E-MAIL","PRODUTO","QUANTIDADE","VALOR UNITARIO","VALOR TOTAL","FRETE","PRAZO","VALIDADE","CONDICAO","OBSERVACOES","ANEXOS","STATUS","DATA ATUALIZACAO","TIPO_REGISTRO","ID OPORTUNIDADE","ORIGEM","PROJETO NOME"],
  PROJETO_FORNECEDORES:["ID","DATA","PROJETO ID","FORNECEDOR ID","FORNECEDOR E-MAIL","FORNECEDOR NOME","STATUS","DATA LEITURA","DATA RESPOSTA","OBSERVACOES"],
  HISTORICO:["ID","DATA","TIPO","USUARIO ID","USUARIO","MODULO","REGISTRO ID","ACAO","DESCRICAO","DADOS JSON"]
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
  obterAbaPortal("PRESTADOR");
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
        (atual && atual.STATUS) || obj.status || "ATIVO",
        obj.ultimoAcesso || (atual && atual["ULTIMO ACESSO"]) || "",
        obj.origem || (atual && atual.ORIGEM) || "LEGADO",
        typeof obj.dadosJson === "string" ? obj.dadosJson : JSON.stringify(obj.dadosJson || {}),
        (atual && atual["STATUS APROVACAO"]) || obj.aprovacao || "PENDENTE"
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

    const dadosPublicos = Object.assign({}, info.dados || {});
    Object.keys(dadosPublicos).forEach(function(k){if(/senha|password|token|secret|credential/i.test(k))delete dadosPublicos[k];});
    const dadosJson = JSON.stringify(dadosPublicos);
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
        "STATUS APROVACAO":info.statusAprovacao || "APROVADO"
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
        info.statusAprovacao || "APROVADO"
      ]);
    }

    if (tipo === "ARQUITETO") {
      sincronizarArquitetoCRMV4(info);
    } else if (tipo === "FORNECEDOR") {
      sincronizarFornecedorCRMV4(info);
    }

    const tituloCadastro = "Novo " + (tipo === "FORNECEDOR" ? "fornecedor" : (tipo === "PRESTADOR" ? "prestador" : "arquiteto")) + " cadastrado";
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
    STATUS:"Ativo",
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

function escolherRemetenteEmailV4(){
  const preferencias=["comercial@arqselect.com.br","contato@arqselect.com.br"];
  try{const aliases=GmailApp.getAliases();for(let i=0;i<preferencias.length;i++){if(aliases.map(String).map(x=>x.toLowerCase()).indexOf(preferencias[i])>=0)return preferencias[i];}}catch(e){}
  return "";
}
function enviarEmailCadastroV4(tipo, info, titulo, mensagem) {
  try {
    const destinatarioUsuario=String(info.email||"").trim();
    const alias=escolherRemetenteEmailV4();
    const origem=alias||Session.getEffectiveUser().getEmail()||"";
    if(!destinatarioUsuario||!origem) return false;
    const assunto="ARQSELECT | Cadastro realizado com sucesso";
    const corpo=[
      "Olá "+(info.nome||info.empresa||"" )+",",
      "",
      "Seu cadastro na ARQSELECT foi realizado com sucesso.",
      "Seu acesso já está ativo e você já pode utilizar a plataforma.",
      "",
      tipo==="FORNECEDOR" ? "Agora sua empresa poderá receber oportunidades qualificadas e se conectar com arquitetos." : (tipo==="PRESTADOR" ? "Agora você poderá montar seu perfil profissional, receber oportunidades compatíveis e enviar propostas pela ARQSELECT." : "Agora você poderá organizar seus projetos, encontrar fornecedores e acompanhar oportunidades."),
      "",
      "Cadastro: "+(info.id||""),
      "Empresa/Escritório: "+(info.empresa||""),
      "E-mail: "+destinatarioUsuario,
      "",
      "Bem-vindo(a) à ARQSELECT.",
      "Conectamos quem cria o projeto com quem fornece a solução.",
      "",
      "Atenciosamente,",
      "ARQSELECT"
    ].join("\n");
    const opts={to:destinatarioUsuario,subject:assunto,body:corpo};
    if(alias) GmailApp.sendEmail(destinatarioUsuario,assunto,corpo,{from:alias,name:"ARQSELECT"});
    else MailApp.sendEmail(opts);
    // Cópia administrativa para acompanhar o cadastro sem depender somente do painel.
    const adminEmail=CONFIG.NOTIFICATION_EMAIL||"comercial@arqselect.com.br";
    if(adminEmail && adminEmail.toLowerCase()!==destinatarioUsuario.toLowerCase()){
      const adminBody=[titulo||"Novo cadastro","",mensagem||"", "ID: "+(info.id||""),"Nome: "+(info.nome||""),"Empresa: "+(info.empresa||""),"E-mail: "+destinatarioUsuario].join("\n");
      const aopts={to:adminEmail,subject:"ARQSELECT | Novo cadastro",body:adminBody}; try{if(alias) GmailApp.sendEmail(adminEmail,aopts.subject,aopts.body,{from:alias,name:"ARQSELECT"}); else MailApp.sendEmail(aopts);}catch(e2){}
    }
    return true;
  } catch(e){registrarErro(e,"enviarEmailCadastroV4");return false;}
}

function criarNotificacaoV4(opts) {
  try {
    opts=opts||{};
    const headers=CRM_HEADERS.NOTIFICACOES.concat();
    const aba=garantirAbaV4(CRM_SHEETS.NOTIFICACOES,headers);
    const id=gerarIdCRM("NOT");
    const h=obterCabecalhosAba(aba), mapa={};
    h.forEach(function(x,i){mapa[String(x).trim()]=i+1;});
    const row=new Array(h.length).fill("");
    const vals={"ID":id,"DATA":new Date(),"USUÁRIO":opts.usuario||"ADMIN","TIPO":opts.tipo||"SISTEMA","TÍTULO":opts.titulo||"Nova notificação","MENSAGEM":opts.mensagem||"","REGISTRO":opts.registro||"","LIDA":"NÃO","DATA DE LEITURA":"","DESTINO":opts.destino||"dashboard","DESTINO ID":opts.destinoId||opts.registro||""};
    Object.keys(vals).forEach(function(k){if(mapa[k]) row[mapa[k]-1]=vals[k];});
    aba.appendRow(row); incrementarVersaoDados(); return id;
  } catch(erro) { registrarErro(erro,"criarNotificacaoV4"); return ""; }
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
    "ARQSELECT - CATALOGOS",
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

function criarConversaV4(token,dados){ return criarConversaARQ(token,dados); }

function obterSessaoAdmin(token){return obterSessao(token);}
function enviarMensagemV4(token,dados){
  const sessao=obterSessaoPortal(token)||obterSessao(token); if(!sessao)return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão inválida ou expirada."}); dados=dados||{};
  const conversaId=String(dados.conversaId||dados.conversaid||"").trim(), mensagem=String(dados.mensagem||"").trim(); if(!conversaId||!mensagem)return respostaJSON({sucesso:false,autorizado:true,mensagem:"Informe a conversa e a mensagem."});
  const convAba=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS), conv=lerAbaComoObjetos(convAba).find(x=>String(x.ID||"")===conversaId); if(!conv)return respostaJSON({sucesso:false,autorizado:true,mensagem:"Conversa não encontrada."});
  if(sessao.tipo!=="ADMIN"){const sid=String(sessao.id||"");if(String(conv["PARTICIPANTE A ID"]||"")!==sid&&String(conv["PARTICIPANTE B ID"]||"")!==sid)return respostaJSON({sucesso:false,autorizado:false,mensagem:"Você não participa desta conversa."});}
  const aba=garantirAbaV4(ARQSELECT_4_SHEETS.MENSAGENS,ARQSELECT_4_HEADERS.MENSAGENS), id="MSG-"+Utilities.getUuid().slice(0,8).toUpperCase();
  const origemTipo=sessao.tipo||"ADMIN", origemId=sessao.id||CONFIG.ADMIN_USERNAME, origemNome=sessao.nome||"ARQSELECT";
  aba.appendRow([id,conversaId,new Date(),origemTipo,origemId,origemNome,String(dados.destinatarioTipo||""),String(dados.destinatarioId||""),String(dados.destinatarioEmail||""),dados.projetoId||conv["PROJETO ID"]||"",mensagem,dados.arquivos||"","NÃO",""]);
  atualizarConversaUltimaMensagemV4(conversaId,mensagem); criarNotificacaoV4({usuario:dados.destinatarioId||"ADMIN",tipo:"MENSAGEM",titulo:"Nova mensagem",mensagem:origemNome+": "+limitarTexto(mensagem,180),registro:conversaId}); incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,id:id,conversaId:conversaId,mensagem:"Mensagem enviada com sucesso."});
}
function atualizarConversaUltimaMensagemV4(conversaId,mensagem){const aba=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS),row=encontrarLinhaPorID(aba,conversaId);if(!row)return false;const h=obterCabecalhosAba(aba),m=encontrarColuna(h,"ULTIMA MENSAGEM"),d=encontrarColuna(h,"ULTIMA DATA");if(m)aba.getRange(row,m).setValue(limitarTexto(mensagem,500));if(d)aba.getRange(row,d).setValue(new Date());return true;}
function sincronizarConversasPorMensagensV4(){const ca=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS),ma=garantirAbaV4(ARQSELECT_4_SHEETS.MENSAGENS,ARQSELECT_4_HEADERS.MENSAGENS),ids={};lerAbaComoObjetos(ca).forEach(x=>{if(x.ID)ids[String(x.ID)]=true;});let n=0;lerAbaComoObjetos(ma).forEach(m=>{const cid=String(m["CONVERSA ID"]||"").trim(),a=String(m["REMETENTE ID"]||"").trim(),b=String(m["DESTINATARIO ID"]||"").trim();if(!cid||ids[cid]||!a||!b)return;ca.appendRow([cid,m.DATA||new Date(),"GERAL",m["REMETENTE NOME"]||a,a,m["DESTINATARIO NOME"]||b,b,m["PROJETO ID"]||"","","","","",m.MENSAGEM||"",m.DATA||new Date(),"ABERTA"]);ids[cid]=true;n++;});if(n)SpreadsheetApp.flush();return n;}
function listarConversasV4(token){const sessao=obterSessaoPortal(token)||obterSessao(token);if(!sessao)return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão inválida."});sincronizarConversasPorMensagensV4();const aba=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS);let dados=lerAbaComoObjetos(aba);if(sessao.tipo!=="ADMIN"){const id=String(sessao.id||"");dados=dados.filter(x=>String(x["PARTICIPANTE A ID"]||"")===id||String(x["PARTICIPANTE B ID"]||"")===id);}dados.sort((a,b)=>new Date(b["ULTIMA DATA"]||b["DATA CRIACAO"]||0)-new Date(a["ULTIMA DATA"]||a["DATA CRIACAO"]||0));return respostaJSON({sucesso:true,autorizado:true,conversas:dados,total:dados.length});}
function listarMensagensV4(token,conversaId){const sessao=obterSessaoPortal(token)||obterSessao(token);if(!sessao)return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão inválida."});const aba=garantirAbaV4(ARQSELECT_4_SHEETS.CONVERSAS,ARQSELECT_4_HEADERS.CONVERSAS),cs=lerAbaComoObjetos(aba).find(x=>String(x.ID||"")===String(conversaId||""));if(!cs)return respostaJSON({sucesso:false,autorizado:true,mensagem:"Conversa não encontrada."});if(sessao.tipo!=="ADMIN"&&String(cs["PARTICIPANTE A ID"]||"")!==String(sessao.id||"")&&String(cs["PARTICIPANTE B ID"]||"")!==String(sessao.id||""))return respostaJSON({sucesso:false,autorizado:false,mensagem:"Acesso negado."});return respostaJSON({sucesso:true,autorizado:true,mensagens:listarMensagensInternasV4(conversaId),conversa:cs});}
function listarMensagensInternasV4(valor){const aba=garantirAbaV4(ARQSELECT_4_SHEETS.MENSAGENS,ARQSELECT_4_HEADERS.MENSAGENS),id=String(valor||"");return lerAbaComoObjetos(aba).filter(x=>String(x["CONVERSA ID"]||"")===id);}
function criarProdutoV4(token,dados) {
  const sessao=obterSessaoPortal(token);
  if(!sessao || sessao.tipo!=="FORNECEDOR") return respostaJSON({sucesso:false,autorizado:false,mensagem:"Sessão de fornecedor inválida."});
  dados=dados||{};
  dados.fotos=arq5Array(dados.fotos).filter(function(x){return /^assets\//.test(x)&&arq5MediaAllowed(x);}).join("\n")||arq5Fallback(dados.categoria);
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

function listarProdutosV4(token,filtro){ return listarProdutosARQ(token,filtro); }

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
  garantirEstruturaV4();
  const p=obterProjetoInterno(idProjeto);
  if(!p) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Projeto não encontrado."});
  fornecedores=Array.isArray(fornecedores)?fornecedores:String(fornecedores||"").split(",").map(function(x){return x.trim();}).filter(Boolean);
  const pfAba=garantirAbaV4(ARQSELECT_4_SHEETS.PROJETO_FORNECEDORES,ARQSELECT_4_HEADERS.PROJETO_FORNECEDORES);
  const propAba=garantirAbaV4(ARQSELECT_4_SHEETS.PROPOSTAS,ARQSELECT_4_HEADERS.PROPOSTAS);
  const usuarios=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS)).filter(function(x){return String(x.TIPO||"").toUpperCase()==="FORNECEDOR" && String(x.STATUS||"ATIVO").toUpperCase()==="ATIVO" && String(x["STATUS APROVACAO"]||"").toUpperCase()==="APROVADO";});
  const pfExistentes=lerAbaComoObjetos(pfAba);
  const propExistentes=lerAbaComoObjetos(propAba);
  const projetoNome=String(p["NOME DO PROJETO"]||p.NOME||idProjeto||"");
  let enviados=0,duplicados=0;
  fornecedores.forEach(function(ref){
    const u=usuarios.find(function(x){return String(x.ID)===String(ref)||String(x["E-MAIL"]||"").toLowerCase()===String(ref).toLowerCase();});
    if(!u) return;
    const jaEnviado=pfExistentes.some(function(x){return String(x["PROJETO ID"]||"")===String(idProjeto)&&String(x["FORNECEDOR ID"]||"")===String(u.ID)&&String(x.STATUS||"").toUpperCase()!=="CANCELADO";});
    if(jaEnviado){duplicados++;return;}
    const pfId="PF-"+Utilities.getUuid().slice(0,8).toUpperCase();
    pfAba.appendRow([pfId,new Date(),idProjeto,u.ID,u["E-MAIL"]||"",u.EMPRESA||u.NOME||"","ENVIADO","","",""]);
    const oportunidadeId="OPP-"+Utilities.getUuid().slice(0,8).toUpperCase();
    propAba.appendRow(["PROP-"+Utilities.getUuid().slice(0,8).toUpperCase(),new Date(),"",idProjeto,u.ID,u["E-MAIL"]||"",String(p["ARQUITETO ID"]||p["ARQUITETO"]||""),String(p["ARQUITETO E-MAIL"]||p["E-MAIL"]||""),String(p.CATEGORIA||p.PRODUTO||""),"","","","","",String(p.PRAZO||""),"","Oportunidade criada pela ARQSELECT.","","AGUARDANDO FORNECEDOR",new Date(),"OPORTUNIDADE",oportunidadeId,"ARQSELECT",projetoNome]);
    propExistentes.push({"ID OPORTUNIDADE":oportunidadeId,"ID PROJETO":idProjeto,"FORNECEDOR ID":u.ID,"FORNECEDOR E-MAIL":u["E-MAIL"]||"","PROJETO NOME":projetoNome,"TIPO_REGISTRO":"OPORTUNIDADE","STATUS":"AGUARDANDO FORNECEDOR"});
    const conversaOutput=criarConversaARQ(token,{participanteAId:"ADMIN",participanteANome:"ARQSELECT",participanteBId:u.ID,participanteBNome:u.EMPRESA||u.NOME||u["E-MAIL"],tipo:"PROJETO",projetoId:idProjeto});
    const conversa=JSON.parse(conversaOutput.getContent());
    const mensagem="📁 Novo projeto disponível para sua empresa.\n\nProjeto: "+projetoNome+"\n\nA oportunidade foi direcionada pela ARQSELECT. Acesse seu painel para analisar e enviar sua proposta.";
    if(conversa && conversa.sucesso && conversa.id){
      enviarMensagemARQ(token,{conversaId:conversa.id,destinatarioTipo:"FORNECEDOR",destinatarioId:u.ID,destinatarioEmail:u["E-MAIL"]||"",projetoId:idProjeto,mensagem:mensagem});
    }
    criarNotificacaoV4({usuario:u.ID,tipo:"PROJETO",titulo:"Novo projeto disponível",mensagem:projetoNome+" foi direcionado para sua empresa.",registro:idProjeto,destino:"projeto",destinoId:idProjeto});
    enviados++;
  });
  registrarHistoricoV4(CONFIG.ADMIN_USERNAME,CONFIG.ADMIN_USERNAME,"ADMIN","DISTRIBUIR","Projeto "+idProjeto+" enviado para "+enviados+" fornecedor(es).");
  incrementarVersaoDados();
  return respostaJSON({sucesso:true,autorizado:true,enviados:enviados,duplicados:duplicados,mensagem:enviados?"Projeto direcionado com sucesso para "+enviados+" fornecedor(es).":(duplicados?"Os fornecedores selecionados já receberam este projeto.":"Nenhum fornecedor válido selecionado.")});
}

function enviarInformacaoProjetoFornecedorV4(token,dados){
  exigirSessao(token);
  dados=dados||{};
  const projetoId=String(dados.projetoId||dados.idProjeto||"").trim();
  if(!projetoId) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Projeto não informado."});
  const uAba=garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS,ARQSELECT_4_HEADERS.USUARIOS);
  const us=lerAbaComoObjetos(uAba);
  const u=us.find(function(x){return String(x.ID)===String(dados.fornecedorId||"") || String(x["E-MAIL"]||"").toLowerCase()===String(dados.fornecedorEmail||"").toLowerCase();});
  if(!u || String(u.TIPO||"").toUpperCase()!=="FORNECEDOR" || String(u.STATUS||"ATIVO").toUpperCase()!=="ATIVO" || String(u["STATUS APROVACAO"]||"").toUpperCase()!=="APROVADO") return respostaJSON({sucesso:false,autorizado:true,codigo:"FORNECEDOR_INDISPONIVEL",mensagem:"Fornecedor não encontrado, inativo, excluído ou ainda não aprovado."});
  const convOutput=criarConversaARQ(token,{participanteAId:"ADMIN",participanteANome:"ARQSELECT",participanteBId:u.ID,participanteBNome:u.EMPRESA||u.NOME||u["E-MAIL"],tipo:"PROJETO",projetoId:projetoId});
  const conv=JSON.parse(convOutput.getContent());
  if(!conv || !conv.sucesso) return convOutput;
  const envio=enviarMensagemARQ(token,{conversaId:conv.id,destinatarioTipo:"FORNECEDOR",destinatarioId:u.ID,destinatarioEmail:u["E-MAIL"]||"",projetoId:projetoId,mensagem:String(dados.mensagem||"").trim()});
  criarNotificacaoV4({usuario:u.ID,tipo:"PROJETO",titulo:"Atualização sobre seu projeto",mensagem:String(dados.mensagem||"").trim(),registro:projetoId,destino:"chat",destinoId:conv.id});
  return envio;
}

function criarSolicitacaoV4(token,dados) {
 const ator=arq3ExigirAtor(token); if(ator.tipo!=='ARQUITETO'&&!ator.admin)throw arq5Error('Somente arquiteto ou ADMIN pode solicitar.','ACESSO_NEGADO');
 dados=dados||{}; arq5GuardProject(ator,arq3Texto(dados.projetoId));
 const nome=arq3Texto(dados.produto).slice(0,300);if(!nome)throw arq5Error('Informe o produto.','SOLICITACAO_INVALIDA');
 const requestId=arq3Texto(dados.requestId).slice(0,100),lock=LockService.getScriptLock();lock.waitLock(15000);
 try {
 const aba=garantirAbaV4(ARQSELECT_4_SHEETS.SOLICITACOES,ARQSELECT_4_HEADERS.SOLICITACOES.concat(['CIDADE','CATEGORIA','REQUEST ID']));
 const existing=requestId?lerAbaComoObjetos(aba).filter(function(x){return arq3Texto(x['REQUEST ID'])===requestId&&arq3Texto(x['ARQUITETO ID'])===ator.id;})[0]:null;
 if(existing)return respostaJSON({sucesso:true,id:existing.ID,status:existing.STATUS,mensagem:'Solicitação já registrada.'});
 const id=arq3Id('SOL');arq5Write(aba,{ID:id,DATA:new Date(),'PROJETO ID':arq3Texto(dados.projetoId),'PRODUTO ID':arq3Texto(dados.produtoId),'ARQUITETO ID':ator.id,'ARQUITETO E-MAIL':ator.email,'FORNECEDOR ID':'','FORNECEDOR E-MAIL':'',PRODUTO:nome,QUANTIDADE:arq3Texto(dados.quantidade).slice(0,80),MEDIDA:arq3Texto(dados.medida).slice(0,500),ESPECIFICACAO:arq3Texto(dados.especificacao).slice(0,4000),PRAZO:arq3Texto(dados.prazo).slice(0,150),OBSERVACOES:arq3Texto(dados.observacoes).slice(0,4000),STATUS:'NOVA','DATA ATUALIZACAO':new Date(),CIDADE:arq3Texto(dados.cidade).slice(0,150),CATEGORIA:arq3Texto(dados.categoria).slice(0,200),'REQUEST ID':requestId});
 criarNotificacaoV4({usuario:'ADMIN',tipo:'SOLICITACAO',titulo:'Nova solicitação de orçamento',mensagem:nome,registro:id,destino:'solicitacoes',destinoId:id});incrementarVersaoDados();
 return respostaJSON({sucesso:true,id:id,status:'NOVA',mensagem:'Solicitação enviada à ARQSELECT.'});
 } finally {lock.releaseLock();}
}

function criarPropostaV4(token,dados){ return enviarPropostaARQ(token,dados); }

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
  const usuariosAtivos=usuarios.filter(function(x){return String(x.STATUS||"ATIVO").toUpperCase()==="ATIVO";});
  const fornecedores=usuariosAtivos.filter(x=>x.TIPO==="FORNECEDOR");
  const arquitetos=usuariosAtivos.filter(x=>x.TIPO==="ARQUITETO");
  const usuariosExcluidos=usuarios.filter(function(x){return ["EXCLUIDO","REMOVIDO"].indexOf(String(x.STATUS||"").toUpperCase())!==-1;});
  const usuariosInativos=usuarios.filter(function(x){return ["INATIVO","BLOQUEADO"].indexOf(String(x.STATUS||"").toUpperCase())!==-1;});
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
      usuariosInativos:usuariosInativos.length,
      usuariosExcluidos:usuariosExcluidos.length,
      produtos:produtos.length,
      produtosPendentes:produtos.filter(x=>String(x.STATUS).toUpperCase()==="PENDENTE").length,
      projetos:projetos.length,
      projetosAtivos:projetos.filter(x=>["NOVO","Novo","EM ANÁLISE","Em análise","ORÇAMENTO","Orçamento","PROPOSTA_ENVIADA","Proposta enviada","NEGOCIAÇÃO","Negociação","APROVAÇÃO","Aprovação","EM_EXECUÇÃO","Em execução"].indexOf(String(x.STATUS||""))>=0).length,
      solicitacoes:solicitacoes.length,
      propostas:propostas.length,
      conversas:conversas.length,
      mensagensNaoLidas:listarMensagensNaoLidasV4("ADMIN").length,
      notificacoesNaoLidas:notificacoes.filter(x=>String(x.LIDA).toUpperCase()!=="SIM").length,
      novosCadastros:usuariosAtivos.filter(function(x){
        const d=converterData(x["DATA CADASTRO"]);
        if(!d) return false;
        const hoje=zerarHora(new Date());
        return zerarHora(d).getTime()===hoje.getTime();
      }).length
    },
    ultimosUsuarios:usuariosAtivos.slice().reverse().slice(0,12),
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
  const nome = tipo === "ARQUITETO" ? "ACESSOS_ARQUITETOS" : (tipo === "PRESTADOR" ? "ACESSOS_PRESTADORES" : "ACESSOS_FORNECEDORES");
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

    if (["ARQUITETO","FORNECEDOR","PRESTADOR"].indexOf(tipo) === -1) {
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
      const id = (tipo === "ARQUITETO" ? "ARQ-" : (tipo === "PRESTADOR" ? "PRE-" : "FOR-")) +
        Utilities.getUuid().slice(0,8).toUpperCase();

      const statusInicial = "ATIVO";
      const aprovacaoInicial = "APROVADO";

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
        dados: dados,
        status: statusInicial,
        statusAprovacao: aprovacaoInicial,
        origem: "PORTAL"
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
        mensagem:"Cadastro realizado com sucesso! Seu acesso já está ativo na ARQSELECT.", status:"ATIVO", statusAprovacao:"APROVADO"
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
  CacheService.getScriptCache().put(PORTAL_SESSION_PREFIX + token, JSON.stringify(sessao), Math.min(PORTAL_SESSION_HOURS*60*60,21600));
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
    var atual=arq3UsuarioPorId(sessao.id);
    if (atual) {
      var statusAtual=String(atual.STATUS||"ATIVO").trim().toUpperCase();
      var aprovacaoAtual=String(atual["STATUS APROVACAO"]||"PENDENTE").trim().toUpperCase();
      if (["BLOQUEADO","INATIVO","EXCLUIDO","REMOVIDO"].indexOf(statusAtual)!==-1 ||
          ["RECUSADO","REPROVADO"].indexOf(aprovacaoAtual)!==-1) {
        CacheService.getScriptCache().remove(PORTAL_SESSION_PREFIX+String(token));
        return null;
      }
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
    if (["ARQUITETO","FORNECEDOR","PRESTADOR"].indexOf(tipo) === -1) return respostaJSON({sucesso:false, autorizado:false, mensagem:"Tipo de acesso inválido."});
    const registro = localizarPortalUsuario(tipo, email);
    if (!registro || registro.dados[7] !== hashPortalSenha(senha) || String(registro.dados[8]).toUpperCase() !== "ATIVO") {
      registrarAuditoriaPublica(email, "LOGIN_FALHA", tipo, "", "", "", "Credenciais inválidas.");
      return respostaJSON({sucesso:false, autorizado:false, mensagem:"E-mail, senha ou acesso inválido."});
    }
    const central=arq3UsuarioPorId(registro.dados[0]);
    if (central) {
      const statusCentral=String(central.STATUS||"ATIVO").trim().toUpperCase();
      const aprovacaoCentral=String(central["STATUS APROVACAO"]||"PENDENTE").trim().toUpperCase();
      if (["BLOQUEADO","INATIVO","EXCLUIDO","REMOVIDO"].indexOf(statusCentral)!==-1 ||
          ["RECUSADO","REPROVADO"].indexOf(aprovacaoCentral)!==-1) {
        return respostaJSON({sucesso:false,autorizado:false,mensagem:"Acesso indisponível. Entre em contato com a ARQSELECT."});
      }
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

function encontrarLinhaPorID(aba, colunaID, id) {
  if (!aba || aba.getLastRow() < 2) return 0;
  if (arguments.length < 3) {
    id = colunaID;
    colunaID = encontrarColuna(obterCabecalhosAba(aba), "ID");
  }
  const coluna = Number(colunaID);
  if (!Number.isInteger(coluna) || coluna < 1 || coluna > aba.getLastColumn()) return 0;
  const procurado = String(id == null ? "" : id).trim();
  if (!procurado) return 0;
  const valores = aba.getRange(2, coluna, aba.getLastRow()-1, 1).getDisplayValues();
  for (let i=0;i<valores.length;i++) if (String(valores[i][0] == null ? "" : valores[i][0]).trim() === procurado) return i+2;
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
    "leads"  ) {

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
  ]    .forEach(
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
    obterCredenciaisAdminARQ().usuario ||
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


  if (typeof objeto.sucesso === 'boolean') {
    if (typeof objeto.mensagem !== 'string') objeto.mensagem = '';
    if (objeto.sucesso && !objeto.data) { objeto.data = {}; Object.keys(objeto).forEach(function(k){ if(['sucesso','mensagem','timestamp','data'].indexOf(k)===-1) objeto.data[k]=objeto[k]; }); }
    if (!objeto.sucesso && !objeto.codigo) objeto.codigo = objeto.autorizado===false?'ACESSO_NEGADO':'OPERACAO_FALHOU';
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
    obterCredenciaisAdminARQ().usuario
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
  const c = obterCredenciaisAdminARQ();
  Logger.log(JSON.stringify({
    usuarioConfigurado: Boolean(c.usuario),
    senhaConfigurada: Boolean(c.senhaHash || c.senhaTemporaria),
    senhaMigradaParaHash: Boolean(c.senhaHash)
  }));
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
  Logger.log("Sessões ADMIN são criadas após login válido. Use testarLogin() para validar a configuração sem expor senha.");
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


/* ==========================================================
   COMERCIAL / OPORTUNIDADES / NEGÓCIOS / COMISSÕES V4
========================================================== */
const NEGOCIOS_SHEET_V4="ARQSELECT - NEGÓCIOS";
const NEGOCIOS_HEADERS_V4=["ID","DATA","OPORTUNIDADE ID","PROJETO ID","FORNECEDOR ID","FORNECEDOR E-MAIL","ARQUITETO ID","VALOR","COMISSAO %","VALOR COMISSAO","STATUS","PAGAMENTO STATUS","DATA PAGAMENTO","OBSERVACOES"];
const COMISSOES_SHEET_V4="ARQSELECT - COMISSOES";
const COMISSOES_HEADERS_V4=["ID","VALOR MIN","VALOR MAX","PERCENTUAL","ATIVO","OBSERVACOES"];
function garantirEstruturasComerciaisV4(){garantirAbaV4(NEGOCIOS_SHEET_V4,NEGOCIOS_HEADERS_V4);const a=garantirAbaV4(COMISSOES_SHEET_V4,COMISSOES_HEADERS_V4);if(a.getLastRow()<2){[["COM-1",0,20000,15,"SIM","Até R$ 20.000"],["COM-2",20000,50000,10,"SIM","De R$ 20.000 a R$ 50.000"],["COM-3",50000,100000,8,"SIM","De R$ 50.000 a R$ 100.000"],["COM-4",100000,"",7,"SIM","Acima de R$ 100.000"]].forEach(r=>a.appendRow(r));}}
function obterFaixaComissaoV4(valor){garantirEstruturasComerciaisV4();const n=Number(String(valor||0).replace(/\./g,"").replace(",","."));const rows=lerAbaComoObjetos(garantirAbaV4(COMISSOES_SHEET_V4,COMISSOES_HEADERS_V4));for(let i=0;i<rows.length;i++){const r=rows[i];const min=Number(r["VALOR MIN"]||0),max=String(r["VALOR MAX"]||"").trim();const ativo=["SIM","1","TRUE","ATIVO"].indexOf(String(r.ATIVO).toUpperCase())>=0;if(ativo&&n>=min&&(!max||n<=Number(max)))return {percentual:Number(r.PERCENTUAL||0),id:r.ID};}return {percentual:0,id:""};}
function obterResumoComercialV4(token){exigirSessao(token);garantirEstruturasComerciaisV4();const ops=listarOportunidadesArrayV4(),neg=lerAbaComoObjetos(garantirAbaV4(NEGOCIOS_SHEET_V4,NEGOCIOS_HEADERS_V4));const fechado=neg.filter(x=>String(x.STATUS).toUpperCase().indexOf("FECH")>=0);return respostaJSON({sucesso:true,autorizado:true,resumo:{oportunidadesAbertas:ops.filter(x=>!['ACEITA','NEGÓCIO FECHADO','CANCELADO'].includes(String(x.STATUS).toUpperCase())).length,negociacoes:ops.filter(x=>['NEGOCIACAO','NEGOCIAÇÃO'].includes(String(x.STATUS).toUpperCase())).length,negociosFechados:fechado.length,volumeMovimentado:neg.reduce((s,x)=>s+Number(x.VALOR||0),0),comissoesPendentes:neg.filter(x=>String(x["PAGAMENTO STATUS"]||"").toUpperCase()!=="PAGO").reduce((s,x)=>s+Number(x["VALOR COMISSAO"]||0),0),comissoesRecebidas:neg.filter(x=>String(x["PAGAMENTO STATUS"]||"").toUpperCase()==="PAGO").reduce((s,x)=>s+Number(x["VALOR COMISSAO"]||0),0),taxaConversao:ops.length?fechado.length/ops.length*100:0}});}
function listarOportunidadesArrayV4(){const a=garantirAbaV4(ARQSELECT_4_SHEETS.PROPOSTAS,ARQSELECT_4_HEADERS.PROPOSTAS);return lerAbaComoObjetos(a).filter(x=>String(x.TIPO_REGISTRO||"").toUpperCase()==="OPORTUNIDADE");}
function listarOportunidadesComerciaisV4(token){exigirSessao(token);return respostaJSON({sucesso:true,autorizado:true,oportunidades:listarOportunidadesArrayV4()});}
function listarNegociosV4(token){exigirSessao(token);garantirEstruturasComerciaisV4();return respostaJSON({sucesso:true,autorizado:true,negocios:lerAbaComoObjetos(garantirAbaV4(NEGOCIOS_SHEET_V4,NEGOCIOS_HEADERS_V4))});}
function criarNegocioV4(token,dados){exigirSessao(token);garantirEstruturasComerciaisV4();dados=dados||{};const opp=listarOportunidadesArrayV4().find(x=>String(x["ID OPORTUNIDADE"]||"")===String(dados.oportunidadeId||""));if(!opp)return respostaJSON({sucesso:false,autorizado:true,mensagem:"Oportunidade não encontrada."});const valor=Number(String(dados.valor||0).replace(/\./g,"").replace(",","."));if(!(valor>0))return respostaJSON({sucesso:false,autorizado:true,mensagem:"Informe um valor válido para o negócio."});const faixa=obterFaixaComissaoV4(valor),id=gerarIdCRM("NEG");garantirAbaV4(NEGOCIOS_SHEET_V4,NEGOCIOS_HEADERS_V4).appendRow([id,new Date(),opp["ID OPORTUNIDADE"],opp["ID PROJETO"],opp["FORNECEDOR ID"],opp["FORNECEDOR E-MAIL"],opp["ARQUITETO ID"]||"",valor,faixa.percentual,valor*faixa.percentual/100,dados.status||"NEGÓCIO FECHADO","PENDENTE","",dados.observacoes||""]);incrementarVersaoDados();return respostaJSON({sucesso:true,autorizado:true,id:id,percentual:faixa.percentual,valorComissao:valor*faixa.percentual/100,mensagem:"Negócio registrado com sucesso."});}
function obterComissoesV4(token){exigirSessao(token);garantirEstruturasComerciaisV4();return respostaJSON({sucesso:true,autorizado:true,faixas:lerAbaComoObjetos(garantirAbaV4(COMISSOES_SHEET_V4,COMISSOES_HEADERS_V4))});}
function salvarComissoesV4(token,dados){exigirSessao(token);garantirEstruturasComerciaisV4();dados=dados||{};const faixas=Array.isArray(dados.faixas)?dados.faixas:[];const a=garantirAbaV4(COMISSOES_SHEET_V4,COMISSOES_HEADERS_V4);const rows=lerAbaComoObjetos(a);const h=obterCabecalhosAba(a);faixas.forEach(function(f){const row=rows.find(x=>String(x.ID||"")===String(f.id||""));const vals=[f.id||gerarIdCRM("COM"),f.min||0,f.max||"",f.percentual||0,f.ativo===false?"NAO":"SIM",f.observacoes||""];if(row){a.getRange(row._linha,1,1,h.length).setValues([h.map((k,i)=>vals[i]!==undefined?vals[i]:"")]);}else a.appendRow(vals);});incrementarVersaoDados();return respostaJSON({sucesso:true,autorizado:true,mensagem:"Faixas de comissão salvas."});}

/* ==========================================================
   ARQSELECT ROUND 2 — GESTÃO REVERSÍVEL + FILTROS PÚBLICOS
   Build 2026-10-01
   - Nunca usa deleteRow() para usuários.
   - EXCLUIDO preserva cadastro/histórico e bloqueia acesso.
   - Superfícies públicas só exibem usuários elegíveis.
========================================================== */

function arqR2Norm(v) {
  return String(v == null ? "" : v).trim().toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function arqR2Text(v) {
  return String(v == null ? "" : v).trim();
}

function arqR2Payload(output) {
  if (!output) return null;
  if (typeof output.getContent === "function") {
    try { return JSON.parse(output.getContent()); } catch (_) { return null; }
  }
  if (typeof output === "object") return output;
  try { return JSON.parse(String(output)); } catch (_) { return null; }
}

function arqR2Reply(obj) {
  return respostaJSON(obj || {});
}

function arqR2CentralUsers() {
  try {
    return lerAbaComoObjetos(
      garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS)
    );
  } catch (_) { return []; }
}

function arqR2CentralUser(id, tipo) {
  id = arqR2Text(id);
  tipo = arqR2Norm(tipo);
  return arqR2CentralUsers().filter(function(u) {
    return arqR2Text(u.ID) === id && (!tipo || arqR2Norm(u.TIPO) === tipo);
  })[0] || null;
}

function arqR2UserEligible(u, tipo) {
  if (!u) return false;
  if (tipo && arqR2Norm(u.TIPO) !== arqR2Norm(tipo)) return false;
  return arqR2Norm(u.STATUS || "ATIVO") === "ATIVO" &&
    arqR2Norm(u["STATUS APROVACAO"] || "") === "APROVADO";
}

function arqR2ProviderById(id) {
  try {
    if (typeof arq7Rows !== "function") return null;
    return arq7Rows("PRESTADORES").filter(function(p) {
      return arqR2Text(p.ID) === arqR2Text(id);
    })[0] || null;
  } catch (_) { return null; }
}

function arqR2ProviderEligible(p) {
  return !!p && arqR2Norm(p.STATUS || "ATIVO") === "ATIVO";
}

function arqR2TargetEligible(tipo, id) {
  tipo = arqR2Norm(tipo);
  if (tipo === "PRESTADOR") return arqR2ProviderEligible(arqR2ProviderById(id));
  if (tipo === "ARQUITETO" || tipo === "FORNECEDOR") {
    return arqR2UserEligible(arqR2CentralUser(id, tipo), tipo);
  }
  if (tipo === "ADMIN") return true;
  return false;
}

function arqR2ProductById(id) {
  try {
    return lerAbaComoObjetos(
      garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS, ARQSELECT_4_HEADERS.PRODUTOS)
    ).filter(function(p){ return arqR2Text(p.ID) === arqR2Text(id); })[0] || null;
  } catch (_) { return null; }
}

function arqR2ProductSupplierEligible(p) {
  if (!p) return false;
  var sid = arqR2Text(p["FORNECEDOR ID"] || p.FORNECEDOR_ID || p.fornecedorId);
  // Itens curatoriais/legados sem fornecedor vinculado continuam disponíveis.
  if (!sid) return true;
  return arqR2TargetEligible("FORNECEDOR", sid);
}

function arqR2CatalogSupplierEligible(c) {
  if (!c) return false;
  var sid = arqR2Text(c["FORNECEDOR ID"] || c.fornecedorId);
  return !sid || arqR2TargetEligible("FORNECEDOR", sid);
}

function arqR2EnsureUserStatusColumns() {
  var aba = garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS);
  var headers = obterCabecalhosAba(aba);
  ["DATA STATUS","ALTERADO POR","MOTIVO STATUS"].forEach(function(nome){
    if (!encontrarColuna(headers, nome)) {
      aba.getRange(1, aba.getLastColumn()+1).setValue(nome);
      headers = obterCabecalhosAba(aba);
    }
  });
  return aba;
}

function arqR2SyncPortalAccess(u, status) {
  try {
    if (!u || !u.TIPO) return;
    var aba = obterAbaPortal(arqR2Norm(u.TIPO));
    var vals = aba.getDataRange().getDisplayValues();
    var id = arqR2Text(u.ID);
    var email = arqR2Text(u["E-MAIL"]).toLowerCase();
    for (var i=1; i<vals.length; i++) {
      var sameId = arqR2Text(vals[i][0]) === id;
      var sameEmail = arqR2Text(vals[i][4]).toLowerCase() === email;
      if (sameId || (email && sameEmail)) {
        aba.getRange(i+1, 9).setValue(status);
        return;
      }
    }
  } catch (e) {
    try { registrarErro(e, "arqR2SyncPortalAccess"); } catch (_) {}
  }
}

function adminUsuarioStatusRound2(token, dados) {
  var lock = null;
  try {
    var admin = exigirSessao(token);
    dados = dados || {};
    var id = arqR2Text(dados.id);
    var status = arqR2Norm(dados.status);
    var motivo = arqR2Text(dados.motivo).slice(0,500);
    if (!id) return arqR2Reply({sucesso:false,autorizado:true,mensagem:"Usuário inválido."});
    if (["ATIVO","INATIVO","BLOQUEADO","EXCLUIDO"].indexOf(status) < 0) {
      return arqR2Reply({sucesso:false,autorizado:true,mensagem:"Status inválido. Use ATIVO, INATIVO, BLOQUEADO ou EXCLUIDO."});
    }

    lock = LockService.getScriptLock();
    lock.waitLock(15000);
    var aba = arqR2EnsureUserStatusColumns();
    var users = lerAbaComoObjetos(aba);
    var u = users.filter(function(x){ return arqR2Text(x.ID) === id; })[0];
    if (!u) return arqR2Reply({sucesso:false,autorizado:true,mensagem:"Usuário não encontrado."});

    var headers = obterCabecalhosAba(aba);
    var cStatus = encontrarColuna(headers,"STATUS");
    var cData = encontrarColuna(headers,"DATA STATUS");
    var cPor = encontrarColuna(headers,"ALTERADO POR");
    var cMotivo = encontrarColuna(headers,"MOTIVO STATUS");
    if (!cStatus) throw new Error("Coluna STATUS não encontrada.");

    var anterior = arqR2Norm(u.STATUS || "ATIVO");
    var agora = new Date();
    var alteradoPor = arqR2Text(admin.usuario || admin.email || "ADMIN") || "ADMIN";

    aba.getRange(u._linha,cStatus).setValue(status);
    if (cData) aba.getRange(u._linha,cData).setValue(agora);
    if (cPor) aba.getRange(u._linha,cPor).setValue(alteradoPor);
    if (cMotivo) aba.getRange(u._linha,cMotivo).setValue(motivo);

    arqR2SyncPortalAccess(u,status);
    SpreadsheetApp.flush();
    incrementarVersaoDados();

    try {
      registrarAuditoriaPublica(
        alteradoPor,
        status === "EXCLUIDO" ? "USUARIO_EXCLUIDO" : (status === "ATIVO" ? "USUARIO_REATIVADO" : "USUARIO_STATUS"),
        arqR2Text(u.TIPO || "USUARIO"), id, anterior, status,
        motivo || ("Status administrativo alterado de "+anterior+" para "+status+".")
      );
    } catch (_) {}

    try {
      registrarHistoricoV4(
        alteradoPor,"USUARIOS",alteradoPor,
        status === "EXCLUIDO" ? "EXCLUIR_REVERSIVEL" : (status === "ATIVO" ? "REATIVAR" : "ALTERAR_STATUS"),
        "Status: "+anterior+" → "+status,id,{tipo:u.TIPO||"",motivo:motivo}
      );
    } catch (_) {}

    return arqR2Reply({
      sucesso:true,autorizado:true,id:id,status:status,anterior:anterior,
      dataStatus:agora,alteradoPor:alteradoPor,
      mensagem:status === "EXCLUIDO"
        ? "Usuário excluído das listas ativas sem apagar seus dados."
        : (status === "ATIVO" ? "Usuário reativado com sucesso." : "Status do usuário atualizado.")
    });
  } catch (e) {
    try { registrarErro(e,"adminUsuarioStatusRound2"); } catch (_) {}
    return arqR2Reply({sucesso:false,autorizado:false,mensagem:obterMensagemErro(e)});
  } finally {
    if (lock) { try { lock.releaseLock(); } catch (_) {} }
  }
}

function adminUsuariosExcluidosRound2(token) {
  try {
    exigirSessao(token);
    arqR2EnsureUserStatusColumns();
    var users = arqR2CentralUsers().filter(function(u){
      return ["EXCLUIDO","REMOVIDO","INATIVO","BLOQUEADO"].indexOf(arqR2Norm(u.STATUS||"")) >= 0;
    }).sort(function(a,b){
      return new Date(b["DATA STATUS"]||b["DATA CADASTRO"]||0)-new Date(a["DATA STATUS"]||a["DATA CADASTRO"]||0);
    });
    return arqR2Reply({sucesso:true,autorizado:true,usuarios:users,total:users.length});
  } catch (e) {
    return arqR2Reply({sucesso:false,autorizado:false,mensagem:obterMensagemErro(e)});
  }
}

function arqR2FilterPublicResult(item) {
  var tipo = arqR2Norm(item && (item.tipo || item.TIPO));
  var id = arqR2Text(item && (item.id || item.ID || item["REGISTRO ID"]));
  if (tipo === "ARQUITETO" || tipo === "FORNECEDOR" || tipo === "PRESTADOR") {
    return arqR2TargetEligible(tipo,id);
  }
  if (tipo === "PRODUTO") return arqR2ProductSupplierEligible(arqR2ProductById(id));
  return true;
}

function arqR2PublicProfile(dados) {
  var tipo=arqR2Norm(dados.tipo), id=arqR2Text(dados.id);
  if (!arqR2TargetEligible(tipo,id)) return arqR2Reply({sucesso:false,mensagem:"Perfil não encontrado ou indisponível."});
  return publicProfileARQ4(tipo,id);
}

function arqR2GlobalSearch(dados) {
  var raw=buscaGlobalARQ4(dados.token,dados.q,dados.limite), p=arqR2Payload(raw);
  if (!p) return raw;
  p.resultados=(p.resultados||[]).filter(function(x){
    var tipo=arqR2Norm(x.tipo),id=arqR2Text(x.id);
    if (tipo === "FORNECEDOR" || tipo === "ARQUITETO") return arqR2TargetEligible(tipo,id);
    if (tipo === "PRODUTO") return arqR2ProductSupplierEligible(arqR2ProductById(id));
    return true;
  });
  p.total=p.resultados.length;
  return arqR2Reply(p);
}

function arqR2PublicStats() {
  var raw=publicStatsARQ4(),p=arqR2Payload(raw);
  if (!p || !p.estatisticas) return raw;
  var users=arqR2CentralUsers().filter(arqR2UserEligible);
  p.estatisticas.arquitetos=users.filter(function(u){return arqR2Norm(u.TIPO)==="ARQUITETO";}).length;
  p.estatisticas.fornecedores=users.filter(function(u){return arqR2Norm(u.TIPO)==="FORNECEDOR";}).length;
  try {
    var products=lerAbaComoObjetos(garantirAbaV4(ARQSELECT_4_SHEETS.PRODUTOS,ARQSELECT_4_HEADERS.PRODUTOS))
      .filter(function(x){return arqR2Norm(x.STATUS)==="APROVADO";})
      .filter(arqR2ProductSupplierEligible);
    p.estatisticas.produtos=products.length;
  } catch (_) {}
  return arqR2Reply(p);
}

function arqR2PublicReviews(dados) {
  try {
    var maximo=Math.max(1,Math.min(12,Number(dados.limite||6))),map={};
    arqR2CentralUsers().forEach(function(u){if(arqR2UserEligible(u))map[arqR2Text(u.ID)]=u;});
    var rows=arq3Registros("AVALIACOES").filter(function(r){
      return arqR2Norm(r.STATUS)==="PUBLICADA" && arqR2Text(r.COMENTARIO) && !!map[arqR2Text(r["AVALIADO ID"])];
    }).sort(function(a,b){return new Date(b.DATA||0)-new Date(a.DATA||0);}).slice(0,maximo).map(function(r){
      var u=map[arqR2Text(r["AVALIADO ID"])]||{};
      return {id:r.ID,nome:u.EMPRESA||u.NOME||"Profissional verificado",tipo:r["AVALIADO TIPO"]||u.TIPO||"PROFISSIONAL",nota:Number(r["NOTA GERAL"]||0),comentario:arqR2Text(r.COMENTARIO).slice(0,600),data:r.DATA};
    });
    return arqR2Reply({sucesso:true,avaliacoes:rows,total:rows.length});
  } catch (e) { return arqR2Reply({sucesso:false,mensagem:"Não foi possível carregar as avaliações públicas."}); }
}

function arqR2Products(dados) {
  var raw=listarProdutosARQ(dados.token,{q:dados.q,categoria:dados.categoria,marca:dados.marca,regiao:dados.regiao,disponibilidade:dados.disponibilidade,fornecedor:dados.fornecedor,ordenacao:dados.ordenacao,proprios:dados.proprios}),p=arqR2Payload(raw);
  if (!p) return raw;
  var actor=null;try{actor=arq3Ator(dados.token);}catch(_){}
  // ADMIN e fornecedor vendo seus próprios produtos mantêm visão administrativa.
  if (!(actor && actor.admin) && !(actor && actor.tipo==="FORNECEDOR" && arqR2Norm(dados.proprios)==="SIM")) {
    p.produtos=(p.produtos||[]).filter(function(x){return arqR2ProductSupplierEligible(arqR2ProductById(x.ID||x.id));});
  }
  return arqR2Reply(p);
}

function arqR2Product(dados) {
  var source=arqR2ProductById(dados.id),actor=null;try{actor=arq3Ator(dados.token);}catch(_){}
  var own=actor&&actor.tipo==="FORNECEDOR"&&source&&arqR2Text(source["FORNECEDOR ID"])===actor.id;
  if (!(actor&&actor.admin) && !own && (!source || !arqR2ProductSupplierEligible(source))) return arqR2Reply({sucesso:false,mensagem:"Produto indisponível."});
  return obterProdutoARQ(dados.token,dados.id);
}

function arqR2Catalogs(dados) {
  var raw=listarCatalogosARQ(dados.token,dados),p=arqR2Payload(raw);if(!p)return raw;
  var actor=null;try{actor=arq3Ator(dados.token);}catch(_){}
  if (!(actor&&actor.admin) && !(actor&&actor.tipo==="FORNECEDOR"&&arqR2Norm(dados.proprios)==="SIM")) {
    p.catalogos=(p.catalogos||[]).filter(arqR2CatalogSupplierEligible);
  }
  return arqR2Reply(p);
}

function arqR2Contacts(dados) {
  var raw=listarContatosARQ(dados.token),p=arqR2Payload(raw);if(!p)return raw;
  p.contatos=(p.contatos||[]).filter(function(x){return arqR2TargetEligible(x.TIPO||x.tipo,x.ID||x.id);});
  p.total=p.contatos.length;return arqR2Reply(p);
}

function arqR2ConversationCreate(dados) {
  var actor=arq3Ator(dados.token);
  if (!actor) return arqR2Reply({sucesso:false,autorizado:false,mensagem:"Sessão inválida ou expirada."});
  if (!actor.admin) {
    var a=arqR2Text(dados.participanteAId),b=arqR2Text(dados.participanteBId),other=a===actor.id?b:a,target=arqR2CentralUser(other,"");
    if (!target || !arqR2UserEligible(target)) return arqR2Reply({sucesso:false,autorizado:false,mensagem:"O contato está indisponível."});
  }
  return criarConversaARQ(dados.token,dados);
}

function arqR2ConnectionRequest(dados) {
  var id=arqR2Text(dados.destinatarioId||dados.usuarioId);
  var u=arqR2CentralUser(id,"");
  if (!u || !arqR2UserEligible(u)) return arqR2Reply({sucesso:false,mensagem:"Perfil de destino indisponível."});
  return solicitarConexaoProfissionalARQ(dados.token,dados);
}

function arqR2ConnectionSave(dados) {
  var tipo=arqR2Norm(dados.alvoTipo),id=arqR2Text(dados.alvoId);
  if (!arqR2TargetEligible(tipo,id)) return arqR2Reply({sucesso:false,mensagem:"Perfil de destino indisponível."});
  if (typeof a10Actor!=="function" || typeof a10Connection!=="function") return null;
  return a10Connection(a10Actor(dados.token),dados);
}

function arqR2Rankings(dados) {
  var tipo=arqR2Norm(dados.tipo||"FORNECEDOR"),raw=rankingsARQ(tipo),p=arqR2Payload(raw);if(!p)return raw;
  p.ranking=(p.ranking||[]).filter(function(x){return arqR2TargetEligible(tipo,x.id||x.ID);});
  p.ranking.forEach(function(x,i){x.posicao=i+1;});
  return arqR2Reply(p);
}

function arqR2Favorites(dados) {
  var raw=listarFavoritosARQ(dados.token),p=arqR2Payload(raw);if(!p)return raw;
  p.favoritos=(p.favoritos||[]).filter(function(f){
    var tipo=arqR2Norm(f.TIPO),id=arqR2Text(f["REGISTRO ID"]);
    if (tipo==="FORNECEDOR"||tipo==="ARQUITETO"||tipo==="PRESTADOR") return arqR2TargetEligible(tipo,id);
    if (tipo==="PRODUTO") return arqR2ProductSupplierEligible(arqR2ProductById(id));
    return true;
  });
  return arqR2Reply(p);
}

function arqR2SmartSearch(dados) {
  var raw=typeof arq8Search==="function"?arq8Search(dados):(typeof a10SmartSearch==="function"?a10SmartSearch(dados):null),p=arqR2Payload(raw);if(!p)return raw;
  p.resultados=(p.resultados||[]).filter(arqR2FilterPublicResult);return arqR2Reply(p);
}

function arqR2Map(dados) {
  if(typeof a10Map!=="function")return null;var raw=a10Map(dados),p=arqR2Payload(raw);if(!p)return raw;
  p.itens=(p.itens||[]).filter(arqR2FilterPublicResult);return arqR2Reply(p);
}

function arqR2Recommendations(dados) {
  if(typeof a10Actor!=="function"||typeof a10Recommendations!=="function")return null;
  var raw=a10Recommendations(a10Actor(dados.token),dados),p=arqR2Payload(raw);if(!p)return raw;
  p.recomendacoes=(p.recomendacoes||[]).filter(arqR2FilterPublicResult);return arqR2Reply(p);
}

function arqR2Connections(dados) {
  if(typeof a10Actor!=="function"||typeof a10Connections!=="function")return null;
  var raw=a10Connections(a10Actor(dados.token)),p=arqR2Payload(raw);if(!p)return raw;
  p.conexoes=(p.conexoes||[]).filter(function(x){
    var id="",m=String(x.URL||"").match(/[?&]id=([^&#]+)/i);if(m){try{id=decodeURIComponent(m[1]);}catch(_){id=m[1];}}
    return !id || arqR2TargetEligible(x.TIPO||x.tipo,id);
  });
  return arqR2Reply(p);
}

function arqR2ProfileIntel(dados) {
  if(!arqR2TargetEligible(dados.tipo,dados.id))return arqR2Reply({sucesso:false,mensagem:"Perfil não encontrado ou indisponível."});
  return typeof a10ProfileIntel==="function"?a10ProfileIntel(dados):null;
}

function arqR2ProductIntel(dados) {
  if(typeof a10ProductIntel!=="function")return null;
  var source=arqR2ProductById(dados.id);if(source&&!arqR2ProductSupplierEligible(source))return arqR2Reply({sucesso:false,mensagem:"Produto indisponível."});
  var raw=a10ProductIntel(dados),p=arqR2Payload(raw);if(!p)return raw;
  p.fornecedoresAlternativos=(p.fornecedoresAlternativos||[]).filter(function(x){return arqR2TargetEligible("FORNECEDOR",x.id||x.ID);});
  p.relacionados=(p.relacionados||[]).filter(function(x){return arqR2ProductSupplierEligible(arqR2ProductById(x.id||x.ID));});
  return arqR2Reply(p);
}

function arqR2Trending(dados) {
  if(typeof a10Trending!=="function")return null;var raw=a10Trending(dados),p=arqR2Payload(raw);if(!p)return raw;
  p.itens=(p.itens||[]).filter(arqR2FilterPublicResult);return arqR2Reply(p);
}

function arqR2Recent(dados) {
  if(typeof arq9RecentList!=="function")return null;var raw=arq9RecentList(dados.token,dados.limite),p=arqR2Payload(raw);if(!p)return raw;
  p.itens=(p.itens||[]).filter(function(x){return arqR2FilterPublicResult({tipo:x.TIPO,id:x["REGISTRO ID"]});});p.total=p.itens.length;return arqR2Reply(p);
}

function arqR2Feed(dados) {
  if(typeof arq6PublicFeed!=="function")return null;var raw=arq6PublicFeed(dados.token),p=arqR2Payload(raw);if(!p)return raw;
  p.posts=(p.posts||[]).filter(function(post){
    var tipo=arqR2Norm(post["AUTOR TIPO"]||post.autorTipo||post.tipoAutor),id=arqR2Text(post["AUTOR ID"]||post.autorId||post.usuarioId);
    return tipo==="ADMIN" || arqR2TargetEligible(tipo,id);
  }).map(function(post){
    if(Array.isArray(post.comentarios))post.comentarios=post.comentarios.filter(function(c){var tipo=arqR2Norm(c["USUARIO TIPO"]||c.usuarioTipo),id=arqR2Text(c["USUARIO ID"]||c.usuarioId);return tipo==="ADMIN"||arqR2TargetEligible(tipo,id);});
    return post;
  });
  p.total=p.posts.length;return arqR2Reply(p);
}

function instalarGestaoUsuariosExcluidosARQSELECT() {
  var aba=arqR2EnsureUserStatusColumns();
  Logger.log("GESTAO_USUARIOS_EXCLUIDOS_OK");
  Logger.log("Aba: "+aba.getName());
  Logger.log("Nenhum registro foi apagado fisicamente.");
  return {sucesso:true,mensagem:"Estrutura de gestão reversível preparada."};
}

function testarFiltrosRodada2ARQSELECT() {
  var users=arqR2CentralUsers(),resumo={
    build:ARQSELECT_BACKEND_BUILD,
    totalUsuarios:users.length,
    publicosElegiveis:users.filter(arqR2UserEligible).length,
    fornecedoresElegiveis:users.filter(function(u){return arqR2UserEligible(u,"FORNECEDOR");}).length,
    arquitetosElegiveis:users.filter(function(u){return arqR2UserEligible(u,"ARQUITETO");}).length,
    inativosOuExcluidos:users.filter(function(u){return arqR2Norm(u.STATUS||"ATIVO")!=="ATIVO";}).length,
    pendentesOuRecusados:users.filter(function(u){return arqR2Norm(u["STATUS APROVACAO"]||"")!=="APROVADO";}).length
  };
  Logger.log(JSON.stringify(resumo,null,2));return resumo;
}

function rotearARQSELECTRound2Integrado(acao,dados,method) {
  acao=arqR2Text(acao);dados=dados||{};method=arqR2Norm(method||"GET");
  switch(acao) {
    case "admin_usuario_status":
      if(method!=="POST")return arqR2Reply({sucesso:false,autorizado:true,mensagem:"Use POST para alterar o status do usuário."});
      return adminUsuarioStatusRound2(dados.token,dados);
    case "admin_usuarios_excluidos":
      if(method!=="POST")return arqR2Reply({sucesso:false,autorizado:true,mensagem:"Use POST para consultar usuários excluídos no CRM."});
      return adminUsuariosExcluidosRound2(dados.token);

    case "arq4_public_profile": return arqR2PublicProfile(dados);
    case "arq4_busca_global": return arqR2GlobalSearch(dados);
    case "arq4_public_stats": return arqR2PublicStats();
    case "arq4_public_reviews": return arqR2PublicReviews(dados);
    case "portal_produtos": return arqR2Products(dados);
    case "portal_produto": return arqR2Product(dados);
    case "portal_catalogos": return arqR2Catalogs(dados);
    case "portal_contatos": return arqR2Contacts(dados);
    case "portal_favoritos": return arqR2Favorites(dados);
    case "portal_rankings": return arqR2Rankings(dados);
    case "portal_conversa_criar":
      if(method!=="POST")return arqR2Reply({sucesso:false,mensagem:"Use POST para criar conversas."});
      return arqR2ConversationCreate(dados);
    case "portal_conexao_solicitar":
      if(method!=="POST")return arqR2Reply({sucesso:false,mensagem:"Use POST para solicitar conexão."});
      return arqR2ConnectionRequest(dados);
    case "portal_conexao_salvar":
      if(method!=="POST")return arqR2Reply({sucesso:false,mensagem:"Use POST para salvar conexão."});
      return arqR2ConnectionSave(dados);

    case "public_busca_inteligente": return arqR2SmartSearch(dados);
    case "public_mapa_rede": return arqR2Map(dados);
    case "public_em_alta": return arqR2Trending(dados);
    case "public_perfil_inteligencia": return arqR2ProfileIntel(dados);
    case "public_produto_inteligencia": return arqR2ProductIntel(dados);
    case "portal_rede_recomendacoes": return arqR2Recommendations(dados);
    case "portal_conexoes": return arqR2Connections(dados);
    case "portal_vistos_recentes":
    case "portal_vistos_recentemente": return arqR2Recent(dados);
    case "public_feed": return arqR2Feed(dados);
    default: return null;
  }
}
