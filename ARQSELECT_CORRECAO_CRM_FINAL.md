# ARQSELECT — Auditoria e correção final do CRM Admin

## Causa raiz principal
O backend tinha inconsistência de variáveis entre `doGet(e)` e `doPost(e)`. O GET recebia parâmetros em `params`, mas rotinas V4 referenciavam `dados`. O POST recebia em `dados`, mas rotinas V4 referenciavam `params`. Isso provocava `ReferenceError` e interrompia vários endpoints antes da execução dos handlers.

## Correções aplicadas
- `doGet` passou a manter aliases compatíveis entre `params` e `dados`.
- `doPost` passou a manter aliases compatíveis entre `dados` e `params`.
- Endpoints V4 de dashboard, usuários, fornecedores, notificações, projetos, conversas, mensagens, produtos, solicitações e propostas foram alinhados.
- `admin.html` ganhou timeout de 20 segundos para evitar loading infinito.
- Erros de rede, timeout, JSON inválido e erros do backend ficam registrados no console com prefixo `[ARQSELECT]`.
- Dashboard agora substitui o loading por uma tela de erro com botão de nova tentativa quando a API falha.
- O fluxo de inicialização foi simplificado para evitar chamada duplicada de sessão.
- `admin.html`, `admin-v4.html`, `admin-v2.html` e `admin00.html` foram normalizados para a mesma interface administrativa.
- Todos os scripts inline das páginas HTML foram verificados com `node --check`.

## Limitação de validação
A execução real contra a conta Google Apps Script/Google Sheets do cliente não é possível neste ambiente. A validação local cobre sintaxe, referências estruturais e consistência do frontend/backend entregue. Após publicação da nova versão do Web App, o botão Diagnóstico do ADMIN deve ser utilizado para confirmar a planilha, abas e quantidade de registros reais.
