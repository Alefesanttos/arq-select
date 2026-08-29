# ARQSELECT 4.1.2 — Auditoria e correção do CRM ADMIN

## Causa raiz principal
O `Code.gs` tinha handlers V4 misturando os nomes `params` e `dados`. Em `doGet`, `dados` não existia; em `doPost`, `params` não existia. Isso provocava `ReferenceError` antes dos handlers de fornecedores, projetos, chat, notificações e demais módulos retornarem.

## Correção
Foi adicionado um alias compatível em cada endpoint (`dados = params` no GET e `params = dados` no POST), sem remover os contratos existentes.

Também foi reforçado o `api()` do `admin.html` para registrar requisição/resposta, aceitar envelopes compatíveis e apresentar o erro técnico real no console.

## Regra de publicação
Após substituir o `Code.gs`, salvar e criar nova versão da implantação do Web App `/exec`. O frontend usa o URL configurado na constante `API_URL`.
