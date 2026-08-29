# ARQSELECT — Correção de integração CRM

## Diagnóstico confirmado
O diagnóstico do ADMIN confirmou conexão com a planilha correta e leitura de 10 usuários e 8 projetos. O problema restante estava na camada de execução/roteamento entre `admin.html` e `Code.gs`.

## Correções
- `doGet(e)`: criado alias de compatibilidade `dados = params` para handlers V4/legados.
- `doPost(e)`: criado alias de compatibilidade `params = dados` para handlers V4/legados.
- Mantidos endpoints existentes e autenticação.
- Corrigido o carregamento de módulos do ADMIN para validar resposta antes da renderização.
- Removido reload recursivo quando um módulo retorna lista vazia.
- Melhorado carregamento de projetos com estado vazio, erro técnico e retry.
- Mantido diagnóstico de conexão e sincronização da base.

## Resultado esperado
GET e POST passam a aceitar os mesmos nomes de parâmetros internamente, eliminando os `ReferenceError` relacionados a `dados`/`params` e permitindo que Dashboard, Usuários, Fornecedores, Projetos, Chat, Notificações, Solicitações e Propostas recebam as respostas do backend corretamente.

## Publicação
Substituir `Code.gs` no projeto do Google Apps Script e publicar uma nova versão do Web App. Depois validar no ADMIN com Diagnóstico e Sincronizar base.
