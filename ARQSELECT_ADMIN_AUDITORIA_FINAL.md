# ARQSELECT — Auditoria Final do CRM ADMIN

## Causa raiz encontrada

O problema de carregamento do CRM vinha principalmente de uma inconsistência de escopo nos endpoints do Google Apps Script:

- `doGet(e)` cria `params`, mas parte dos handlers V4 usava `dados`.
- `doPost(e)` cria `dados`, mas parte dos handlers V4 usava `params`.

Isso provocava `ReferenceError` no servidor antes da execução dos handlers de dashboard, fornecedores, usuários, projetos, notificações e chat. O frontend então recebia um erro genérico como `Falha ao carregar fornecedores` ou `Falha ao carregar chat`.

## Correção estrutural

Foram criados aliases compatíveis nos dois endpoints:

- GET: `const dados = params;`
- POST: `const params = dados;`

Isso preserva os contratos existentes sem reescrever o sistema.

## Melhorias no frontend ADMIN

`admin.html` agora:

- registra requisição e resposta da API no console;
- exibe erros técnicos reais no console;
- trata resposta JSON inválida;
- trata sessão expirada;
- aceita envelope compatível com `success`/`sucesso`;
- mostra loading, estado vazio e tentativa novamente;
- mantém atualização automática do dashboard;
- mantém chat com atualização manual e reabertura da conversa;
- usa uma única URL de Web App;
- continua consultando os dados reais da base central V4.

## Dados existentes

O backend continua sincronizando dados legados para `ARQSELECT - USUARIOS` a partir das bases existentes, incluindo acessos de arquitetos e fornecedores. A aba `PROJETOS` continua sendo a fonte de projetos.

## Compatibilidade

`admin-v4.html` permanece idêntico ao `admin.html`.

`admin-v2.html` agora redireciona para `admin.html`, evitando uma versão administrativa antiga que dependia de arquivos JS/CSS ausentes.

## Validações realizadas

- Sintaxe do `Code.gs`: OK via Node/V8-compatible syntax check.
- Sintaxe JavaScript do `admin.html`: OK via Node syntax check.
- Referências dos endpoints V4: conferidas.
- Referências de módulos do ADMIN: conferidas.
- Arquivos administrativos canônicos: conferidos.

## Limitação do teste externo

A execução real contra a conta Google, planilha e implantação `/exec` depende da conta do proprietário do Apps Script e não pode ser autenticada neste ambiente. Depois de substituir o `Code.gs`, é obrigatório publicar uma nova versão da implantação do Web App.
