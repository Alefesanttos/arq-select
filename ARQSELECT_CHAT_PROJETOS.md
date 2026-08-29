# ARQSELECT — Chat e envio de projetos ao fornecedor

## Novidades
- ADMIN pode iniciar conversas com arquitetos e fornecedores.
- ADMIN pode responder conversas existentes.
- Nova aba `Enviar projeto` permite selecionar projeto e um ou vários fornecedores.
- É possível escolher quais informações do projeto serão compartilhadas.
- É possível incluir links/arquivos detectados nos campos do projeto.
- O envio cria/reaproveita uma conversa vinculada ao projeto.
- O envio também registra a distribuição em `ARQSELECT - PROJETO_FORNECEDORES`, notificação e histórico.

## Publicação
1. Substitua o `Code.gs` no Apps Script.
2. Salve e publique uma nova versão do Web App.
3. Substitua o `admin.html` no GitHub/host.
4. O `admin-v4.html` acompanha a mesma versão do `admin.html`.
5. No CRM, use `Chat` para novas mensagens e `Enviar projeto` para distribuir projetos.
