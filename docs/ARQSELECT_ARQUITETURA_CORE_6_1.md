# ARQSELECT 6.1 — Operational Core Completion

## Objetivo
A release 6.1 finaliza a costura operacional do P0 sem substituir módulos existentes.

## Fluxo canônico
PROJETO → MATCHING → RFQ → PROPOSTAS → NEGOCIAÇÃO/CHAT → ACEITE → NEGÓCIO → TIMELINE.

## Arquivos frontend
- `sala-projeto.html` + `arq-project-hub.js` — contexto central.
- `solicitar-orcamento.html` + `arq-rfq.js` — RFQ inteligente.
- `comparar-propostas.html` + `arq-workspace-app-6.js` — comparação e ações.
- `central-oportunidades.html` + `arq-opportunities.js` — funil unificado.
- `projeto.html` — alias compatível para o Hub.

## Ações backend ARQSELECT9
### Projeto/governança
- portal_projeto_hub
- portal_projeto_timeline
- portal_projeto_membro_salvar
- portal_rascunho_salvar / portal_rascunhos / portal_rascunho_excluir
- portal_monitor_evento
- portal_preferencias_notificacao / portal_preferencias_notificacao_salvar
- portal_consentimentos / portal_consentimento_salvar
- portal_exportar_meus_dados
- portal_perfil_completude
- portal_feedback_salvar
- portal_solicitar_exclusao_dados
- portal_vistos_recentemente / portal_registrar_visualizacao
- admin_qualidade_dados / admin_auditoria_unificada
- arq9_setup

### Operação 6.1
- portal_matching_unificado — GET
- portal_rfq_criar — POST
- portal_propostas_comparar — GET
- portal_proposta_acao — POST
- portal_oportunidades_unificadas — GET
- portal_oportunidade_status — POST

## RFQ
Recebe projeto, itens, quantidade, unidade, medidas, ambiente, prazo, cidade/estado/localização, observações, links, anexos e modo de envio.
- SELECIONADOS: um ou vários fornecedores escolhidos.
- RECOMENDADOS: até cinco fornecedores priorizados pelo matching.
- Sem candidato: mantém solicitação roteável para operação/Admin.

## Score de matching
O score é explicável e serve para descoberta. Critérios iniciais: aderência ao escopo, cidade/estado, aprovação cadastral e disponibilidade base. Não seleciona fornecedor automaticamente como decisão final.

## Propostas
A comparação retorna preço, frete, prazo, condição, garantia, reputação e status.
Ações: FAVORITAR, SOLICITAR_REVISAO, ABRIR_CHAT, ACEITAR, RECUSAR e ARQUIVAR.
ACEITAR é idempotente no negócio e recusa as demais propostas da mesma solicitação.

## Oportunidades
A central agrega produto/fornecedor e serviço/prestador, respeitando o ator autenticado. Estágios canônicos:
NOVO → VISUALIZADO → CONTATO INICIADO → PROPOSTA ENVIADA → NEGOCIAÇÃO → FECHADO ou PERDIDO.

## Segurança
- Projeto privado por padrão.
- Escrita exige proprietário/Admin ou membro com EDIT/ADMIN.
- Fornecedor/prestador vinculado recebe leitura, não administração do projeto.
- RFQ limita anexos, evita campos sensíveis em drafts e registra eventos relevantes.
- APIs antigas permanecem disponíveis como fallback.

## Compatibilidade
ARQSELECT9 deve ser roteado antes de ARQSELECT8/7/6/4/3. Se a ação não pertencer à camada 9, retorna null e o roteamento segue normalmente.

## Testes
`tests/core-smoke.mjs` exige versão 6.1, arquivos canônicos, ações RFQ/proposta/oportunidades, Hub e CSS válido.
