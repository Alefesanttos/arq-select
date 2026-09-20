# ARQSELECT 6.0 — Contratos de API e eventos

## Regras
- Toda resposta: {sucesso:boolean, mensagem?:string, ...payload}.
- Ações autenticadas exigem token e validação de papel no servidor.
- IDs são strings opacas.
- Nenhum endpoint público retorna CPF/CNPJ, telefone, e-mail privado ou endereço privado.
- Escritas críticas devem ser idempotentes.

## Ações críticas existentes
portal_projetos, portal_sala_projeto, portal_especificacoes, portal_especificacoes_cotar, portal_propostas_comparar, portal_proposta_status, portal_matching_projeto, portal_fornecedor_convidar, portal_pedido_criar, portal_amostras, portal_clientes_projeto, portal_pedidos, portal_analytics_fornecedor, public_busca_inteligente, portal_painel_negocios, prestador_oportunidades, prestador_proposta_enviar, portal_propostas_servicos.

## Eventos de domínio preparados
project.created
project.updated
project.status.changed
rfq.created
proposal.created
proposal.updated
proposal.accepted
lead.created
deal.closed
message.created
review.created
document.downloaded
profile.verified

Eventos futuros devem transportar eventId, occurredAt, actorId, actorRole, entityType, entityId e payload mínimo.
