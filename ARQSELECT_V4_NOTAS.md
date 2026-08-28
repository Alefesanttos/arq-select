# ARQSELECT 4.0 — atualização incremental

## O que foi corrigido
- Cadastro de fornecedor e arquiteto agora gera registro em `ARQSELECT - USUARIOS`.
- Novo cadastro cria notificação administrativa e histórico.
- Cadastro de fornecedor do formulário público passou a usar o mesmo endpoint do restante da plataforma.
- Cadastro de fornecedor público passou a poder criar acesso ao Portal ARQSELECT.
- Cadastro de arquiteto deixou de usar a rotina de projeto como substituto de cadastro.
- Criada camada V4 de usuários, notificações, produtos, conversas, mensagens, solicitações, propostas, distribuição de projetos e histórico.
- Dashboard ADMIN 4.0 com atualização automática.
- Produtos entram como `PENDENTE` para moderação.
- Fluxo de projeto -> fornecedores possui registro próprio.
- Estrutura mantém compatibilidade com as abas existentes.

## Novas abas criadas automaticamente
- ARQSELECT - USUARIOS
- ARQSELECT - PRODUTOS
- ARQSELECT - CONVERSAS
- ARQSELECT - MENSAGENS
- ARQSELECT - SOLICITACOES
- ARQSELECT - PROPOSTAS
- ARQSELECT - PROJETO_FORNECEDORES
- ARQSELECT - HISTORICO

## Novo ADMIN
Abra `admin-v4.html` no GitHub Pages.

Após publicar o novo `Code.gs` como nova versão do Web App, faça login e use `Preparar estrutura` uma vez.

## Observação importante
O projeto ainda usa Google Sheets/Drive como backend e Google Apps Script como API. O deploy do Web App precisa estar publicado para a mesma URL configurada nos arquivos HTML.
