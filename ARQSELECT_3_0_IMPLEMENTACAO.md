# ARQSELECT 3.0 — Implementação

## Prioridade entregue
1. Estabilidade e compatibilidade com a base existente.
2. Chat com atualização automática (polling de 5 segundos).
3. Mensagens texto + anexos + áudio gravado no navegador e salvo no Google Drive.
4. Catálogo de produtos com cadastro do fornecedor e moderação já existente.
5. Página de produto e busca/exploração.
6. Solicitação de orçamento ligada a produto, projeto, fornecedor e conversa.
7. Favoritos e conexões.
8. Analytics básicos de eventos.
9. Notificações existentes preservadas.
10. WhatsApp da home atualizado para +55 19 98165-5013.

## Novas abas criadas automaticamente
- ARQSELECT - FAVORITOS
- ARQSELECT - CONEXOES
- ARQSELECT - ANALYTICS
- ARQSELECT - FEED

Nenhuma aba existente é apagada.

## Novas páginas
- chat.html
- explorar.html
- produto.html
- conexoes.html
- ARQSELECT_FORNECEDOR_SOLICITACOES.html

## Segurança/limites
- Anexos de chat validados por MIME permitido.
- Até 5 anexos por envio e limite agregado de aproximadamente 10 MB por requisição.
- Produtos e solicitações respeitam o token do portal e o ID do fornecedor/arquiteto.
- O chat respeita o vínculo da conversa com os participantes.

## Deploy
Substitua o Code.gs no projeto Apps Script, salve e publique uma nova versão do Web App `/exec`.
Os HTMLs devem continuar usando o mesmo URL do Web App já configurado no projeto.
