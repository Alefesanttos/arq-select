# ARQSELECT — Rodada 2 (Apps Script / filtros / exclusão reversível)

Data: 2026-10-01

## Objetivo

Concluir a parte crítica iniciada na auditoria:

- exclusão reversível;
- usuários desativados/excluídos fora das listas ativas;
- fornecedores excluídos fora de marketplace, busca, mapa, recomendações e distribuição;
- sessões existentes invalidadas quando o usuário é desativado/excluído;
- nenhuma exclusão física de linha.

---

## 1. Arquivos que devem existir no projeto Apps Script

Copiar do repositório:

1. `apps-script/ARQSELECT_ADMIN_USER_STATUS_PATCH.gs`
2. `apps-script/ARQSELECT_ROUND2_PUBLIC_ELIGIBILITY_PATCH.gs`

Não remova os arquivos ARQSELECT3.gs, ARQSELECT4.gs, ARQSELECT6.gs, ARQSELECT7.gs, ARQSELECT8.gs, ARQSELECT9.gs ou ARQSELECT10.gs.

---

## 2. Inserir os roteadores no Code.gs

### No doGet(e)

Depois de montar `acao` e `dados`, mas ANTES dos roteadores ARQSELECT existentes:

```javascript
var respostaUsuariosAdmin =
  rotearAdminUsuariosExcluidosARQSELECT(acao, dados, "GET");
if (respostaUsuariosAdmin) return respostaUsuariosAdmin;

var respostaRodada2 =
  rotearARQSELECTRound2(acao, dados, "GET");
if (respostaRodada2) return respostaRodada2;
```

### No doPost(e)

Depois de montar `acao` e `dados`, mas ANTES dos roteadores ARQSELECT existentes:

```javascript
var respostaUsuariosAdmin =
  rotearAdminUsuariosExcluidosARQSELECT(acao, dados, "POST");
if (respostaUsuariosAdmin) return respostaUsuariosAdmin;

var respostaRodada2 =
  rotearARQSELECTRound2(acao, dados, "POST");
if (respostaRodada2) return respostaRodada2;
```

A ordem é importante: estes dois roteadores devem executar antes das versões antigas para impedir que uma rota insegura responda primeiro.

---

## 3. Invalidar sessões antigas de usuários removidos

No `Code.gs`, localize `obterSessaoPortal(token)`.

Existe uma validação semelhante a:

```javascript
if (
  atual &&
  ["BLOQUEADO","INATIVO"].indexOf(
    String(atual.STATUS||"").toUpperCase()
  ) !== -1
  ||
  atual &&
  String(atual["STATUS APROVACAO"]).toUpperCase() === "RECUSADO"
) {
  ...
}
```

Substitua a condição por:

```javascript
var statusAtual =
  String(atual && atual.STATUS || "ATIVO").toUpperCase();

var aprovacaoAtual =
  String(
    atual && atual["STATUS APROVACAO"] || "PENDENTE"
  ).toUpperCase();

if (
  atual &&
  (
    ["BLOQUEADO","INATIVO","EXCLUIDO","REMOVIDO"]
      .indexOf(statusAtual) !== -1
    ||
    ["RECUSADO","REPROVADO"]
      .indexOf(aprovacaoAtual) !== -1
  )
) {
  CacheService
    .getScriptCache()
    .remove(PORTAL_SESSION_PREFIX + String(token));

  return null;
}
```

Isso faz com que um usuário já logado perca a sessão na próxima chamada da API após ser excluído/desativado.

---

## 4. Bloquear novo login de EXCLUIDO / REMOVIDO

No `loginPortalUsuario(dados)`, localize a validação do usuário central.

Troque o trecho que bloqueia apenas `BLOQUEADO` e `INATIVO` por:

```javascript
var statusCentral =
  String(central && central.STATUS || "ATIVO").toUpperCase();

var aprovacaoCentral =
  String(
    central && central["STATUS APROVACAO"] || "PENDENTE"
  ).toUpperCase();

if (
  central &&
  (
    ["BLOQUEADO","INATIVO","EXCLUIDO","REMOVIDO"]
      .indexOf(statusCentral) !== -1
    ||
    ["RECUSADO","REPROVADO"]
      .indexOf(aprovacaoCentral) !== -1
  )
) {
  return respostaJSON({
    sucesso:false,
    autorizado:false,
    mensagem:
      "Acesso indisponível. Entre em contato com a ARQSELECT."
  });
}
```

Não é necessário impedir usuário PENDENTE de entrar se o seu fluxo atual permite onboarding antes da aprovação.

---

## 5. O que o patch da Rodada 2 protege

O roteador `rotearARQSELECTRound2` intercepta:

- `portal_produtos`
- `portal_produto`
- `portal_contatos`
- `portal_conversa_criar`
- `arq4_public_profile`
- `arq4_busca_global`
- `arq4_public_stats`
- `arq4_public_reviews`
- `public_busca_inteligente`
- `public_mapa_rede`
- `public_em_alta`
- `portal_vistos_recentes`
- `portal_rede_recomendacoes`
- `public_perfil_inteligencia`
- `public_produto_inteligencia`
- `portal_conexoes`
- `public_feed`
- `admin_v4_projeto_enviar_fornecedor`
- `admin_v4_projeto_informacao_fornecedor`

Para ARQUITETO/FORNECEDOR em superfície pública, a regra fica:

```
STATUS = ATIVO
E
STATUS APROVACAO = APROVADO
```

Para PRESTADOR público:

```
STATUS = ATIVO
```

---

## 6. Inicializar as colunas de status

Execute uma vez:

```javascript
instalarGestaoUsuariosExcluidosARQSELECT
```

O log esperado:

```
GESTAO_USUARIOS_EXCLUIDOS_OK
Não houve exclusão física de registros.
```

Depois execute:

```javascript
testarFiltrosRodada2ARQSELECT
```

Ele deve mostrar um resumo de:

- total de usuários;
- públicos elegíveis;
- fornecedores elegíveis;
- arquitetos elegíveis;
- inativos/excluídos;
- pendentes/recusados.

---

## 7. Publicar

Após salvar os arquivos:

1. Implantar
2. Gerenciar implantações
3. Editar a implantação atual
4. Versão → Nova versão
5. Implantar

Mantenha a MESMA URL `/exec` usada pelo site.

---

## 8. Teste obrigatório de exclusão

Use um usuário de teste.

### Teste A — exclusão

1. CRM → Fornecedores.
2. Clique em Excluir.
3. Confirme.
4. Atualize a página.
5. Deve sumir de Fornecedores.
6. Deve aparecer em Usuários excluídos.
7. Abra fornecedores.html.
8. Não pode aparecer.
9. Pesquise o nome.
10. Não pode aparecer.
11. Abra URL direta do perfil.
12. Deve retornar indisponível.
13. Abra mapa/recomendações.
14. Não pode aparecer.
15. Tente distribuir projeto para ele.
16. Backend deve recusar/ignorar.

### Teste B — login

1. Com o usuário excluído, tente login.
2. Deve receber acesso indisponível.
3. Se ele já estava logado antes da exclusão, atualize qualquer tela autenticada.
4. A sessão deve ser invalidada.

### Teste C — reativação

1. CRM → Usuários excluídos.
2. Reativar.
3. Atualizar.
4. Deve sair de Usuários excluídos.
5. Se APROVADO, deve voltar às superfícies públicas.
6. Login deve voltar a funcionar conforme as permissões.

---

## 9. Teste de distribuição de projeto

1. Selecione projeto.
2. Confirme que o dropdown mostra somente fornecedor ATIVO + APROVADO.
3. Tente chamar o endpoint manualmente com fornecedor INATIVO/EXCLUIDO.
4. Deve retornar `FORNECEDOR_INDISPONIVEL`.
5. Distribua para fornecedor válido.
6. Confirme:
   - PROJETO_FORNECEDORES;
   - oportunidade/proposta;
   - notificação;
   - conversa;
   - persistência após F5.

---

## 10. Situação desta rodada

### Alterações já feitas no GitHub

- admin.html: seção Usuários excluídos;
- admin.html: carregar excluídos pelo endpoint protegido;
- admin.html: fornecedores inativos removidos do seletor de distribuição;
- admin.html: usuários inativos removidos do seletor de nova conversa;
- patch de soft-delete;
- patch de filtros públicos;
- admin-v2/admin-v4/admin00 redirecionando para admin.html;
- proposta/solicitacao exigindo sessão/perfil válido.

### Ainda depende do Apps Script

Os dois arquivos `.gs` precisam ser copiados ao projeto e a implantação precisa ser atualizada. O GitHub não publica o backend do Google Apps Script automaticamente.

---

## Regra de conclusão

A Rodada 2 somente deve ser marcada como aprovada quando exclusão → ocultação pública → bloqueio de acesso → reativação → retorno às listas tiver sido executada em produção e persistir após recarregar a página.
