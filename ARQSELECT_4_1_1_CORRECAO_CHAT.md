# ARQSELECT 4.1.1 — Correção de integração ADMIN/CRM

## Correção principal
O `doGet(e)` usava blocos V4 com a variável `dados`, embora o objeto correto da requisição fosse `params`. Isso causava `ReferenceError: dados is not defined` e impedia que o fluxo de Chat V4 chegasse às funções `admin_v4_conversas` e `admin_v4_mensagens`.

## Alterações
- `Code.gs`: todos os handlers V4 no `doGet` usam `params`; também foi criado o alias de compatibilidade `const dados = params`.
- `admin.html`: chat com tratamento completo de erro, estado de carregamento, mensagem do erro real e botão de nova tentativa.
- `admin-v4.html`: mantido idêntico ao `admin.html`.
- Sintaxe JavaScript validada em Node.js para o JavaScript do ADMIN e para o `Code.gs`.

## Publicação
Após substituir o `Code.gs`, salvar e criar uma nova implantação do Web App do Apps Script. O HTML do ADMIN deve usar o mesmo endpoint `/exec` dessa implantação.
