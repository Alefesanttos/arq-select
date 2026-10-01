/**
 * ARQSELECT — Gestão reversível de usuários excluídos/desativados
 * Compatível com a estrutura ARQSELECT 4+/6.x baseada em:
 * - ARQSELECT_4_SHEETS.USUARIOS
 * - garantirAbaV4 / lerAbaComoObjetos / localizarUsuarioV4
 * - exigirSessao / respostaJSON / incrementarVersaoDados
 *
 * IMPORTANTE:
 * 1) Adicione este arquivo ao projeto Google Apps Script.
 * 2) No Code.gs, nos roteadores GET e POST, antes dos roteadores genéricos,
 *    adicione:
 *
 *    var respostaUsuariosAdmin = rotearAdminUsuariosExcluidosARQSELECT(acao, dados, "GET");
 *    if (respostaUsuariosAdmin) return respostaUsuariosAdmin;
 *
 *    e no POST:
 *
 *    var respostaUsuariosAdmin = rotearAdminUsuariosExcluidosARQSELECT(acao, dados, "POST");
 *    if (respostaUsuariosAdmin) return respostaUsuariosAdmin;
 *
 * Não usa deleteRow(). Os registros permanecem preservados.
 */

function arqUserAdminNorm_(v) {
  return String(v == null ? "" : v).trim().toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function arqUserAdminEnsureColumns_() {
  var aba = garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS);
  var headers = obterCabecalhosAba(aba);
  ["DATA STATUS","ALTERADO POR","MOTIVO STATUS"].forEach(function(nome){
    if (!encontrarColuna(headers,nome)) {
      aba.getRange(1, aba.getLastColumn()+1).setValue(nome);
      headers = obterCabecalhosAba(aba);
    }
  });
  return aba;
}

function arqUserAdminSyncAccess_(u, status) {
  try {
    if (!u || !u.TIPO) return;
    var aba = obterAbaPortal(String(u.TIPO).toUpperCase());
    var vals = aba.getDataRange().getDisplayValues();
    var id = String(u.ID || "");
    var email = String(u["E-MAIL"] || "").trim().toLowerCase();
    for (var i=1;i<vals.length;i++) {
      var mesmaId = String(vals[i][0] || "") === id;
      var mesmoEmail = String(vals[i][4] || "").trim().toLowerCase() === email;
      if (mesmaId || (email && mesmoEmail)) {
        // O login portal já exige STATUS === ATIVO.
        // EXCLUIDO/INATIVO/BLOQUEADO permanecem sem acesso.
        aba.getRange(i+1,9).setValue(status);
        break;
      }
    }
  } catch (e) {
    try { registrarErro(e,"arqUserAdminSyncAccess_"); } catch (_) {}
  }
}

function adminUsuarioStatusARQSELECT(token, dados) {
  try {
    var admin = exigirSessao(token);
    dados = dados || {};
    var id = String(dados.id || "").trim();
    var status = arqUserAdminNorm_(dados.status || "");
    var motivo = String(dados.motivo || "").trim().slice(0,500);
    var permitidos = ["ATIVO","INATIVO","BLOQUEADO","EXCLUIDO"];

    if (!id) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Usuário inválido."});
    if (permitidos.indexOf(status) < 0) {
      return respostaJSON({sucesso:false,autorizado:true,mensagem:"Status inválido. Use ATIVO, INATIVO, BLOQUEADO ou EXCLUIDO."});
    }

    var aba = arqUserAdminEnsureColumns_();
    var u = localizarUsuarioV4(id);
    if (!u) return respostaJSON({sucesso:false,autorizado:true,mensagem:"Usuário não encontrado."});

    var headers = obterCabecalhosAba(aba);
    var cStatus = encontrarColuna(headers,"STATUS");
    var cData = encontrarColuna(headers,"DATA STATUS");
    var cPor = encontrarColuna(headers,"ALTERADO POR");
    var cMotivo = encontrarColuna(headers,"MOTIVO STATUS");
    var anterior = arqUserAdminNorm_(u.STATUS || "ATIVO");
    var agora = new Date();
    var alteradoPor = String((admin && (admin.usuario || admin.email || admin.nome)) || "ADMIN");

    if (!cStatus) throw new Error("Coluna STATUS não encontrada.");
    aba.getRange(u._linha,cStatus).setValue(status);
    if (cData) aba.getRange(u._linha,cData).setValue(agora);
    if (cPor) aba.getRange(u._linha,cPor).setValue(alteradoPor);
    if (cMotivo) aba.getRange(u._linha,cMotivo).setValue(motivo);

    arqUserAdminSyncAccess_(u,status);
    SpreadsheetApp.flush();
    if (typeof incrementarVersaoDados === "function") incrementarVersaoDados();

    try {
      registrarAuditoriaPublica(
        alteradoPor,
        status === "EXCLUIDO" ? "USUARIO_EXCLUIDO" : (status === "ATIVO" ? "USUARIO_REATIVADO" : "USUARIO_STATUS"),
        String(u.TIPO || "USUARIO"),
        id,
        anterior,
        status,
        motivo || ("Status administrativo alterado de "+anterior+" para "+status+".")
      );
    } catch (_) {}

    return respostaJSON({
      sucesso:true,
      autorizado:true,
      id:id,
      status:status,
      anterior:anterior,
      dataStatus:agora,
      alteradoPor:alteradoPor,
      mensagem: status === "EXCLUIDO"
        ? "Usuário excluído das listas ativas sem apagar seus dados."
        : (status === "ATIVO" ? "Usuário reativado com sucesso." : "Status do usuário atualizado.")
    });
  } catch (e) {
    try { registrarErro(e,"adminUsuarioStatusARQSELECT"); } catch (_) {}
    return respostaJSON({sucesso:false,autorizado:false,mensagem:e && e.message ? e.message : "Não foi possível atualizar o usuário."});
  }
}

function listarUsuariosExcluidosARQSELECT(token) {
  try {
    exigirSessao(token);
    arqUserAdminEnsureColumns_();
    var aba = garantirAbaV4(ARQSELECT_4_SHEETS.USUARIOS, ARQSELECT_4_HEADERS.USUARIOS);
    var usuarios = lerAbaComoObjetos(aba).filter(function(u){
      var st = arqUserAdminNorm_(u.STATUS || "ATIVO");
      return ["EXCLUIDO","INATIVO","BLOQUEADO"].indexOf(st) >= 0;
    }).reverse();
    return respostaJSON({sucesso:true,autorizado:true,usuarios:usuarios,total:usuarios.length});
  } catch (e) {
    return respostaJSON({sucesso:false,autorizado:false,mensagem:e && e.message ? e.message : "Não foi possível listar usuários excluídos."});
  }
}

function rotearAdminUsuariosExcluidosARQSELECT(acao, dados, method) {
  acao = String(acao || "").trim();
  dados = dados || {};
  method = String(method || "GET").toUpperCase();

  if (acao === "admin_usuario_status") {
    if (method !== "POST") return respostaJSON({sucesso:false,autorizado:true,mensagem:"Use POST para alterar status de usuário."});
    return adminUsuarioStatusARQSELECT(dados.token,dados);
  }
  if (acao === "admin_usuarios_excluidos") {
    return listarUsuariosExcluidosARQSELECT(dados.token);
  }
  return null;
}

function instalarGestaoUsuariosExcluidosARQSELECT() {
  var aba = arqUserAdminEnsureColumns_();
  Logger.log("GESTAO_USUARIOS_EXCLUIDOS_OK");
  Logger.log("Aba: " + aba.getName());
  Logger.log("Não houve exclusão física de registros.");
  return {sucesso:true,mensagem:"Estrutura de gestão reversível de usuários preparada."};
}
