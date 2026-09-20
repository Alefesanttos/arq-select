# ARQSELECT 6.0 — Operating System Core

## Arquitetura incremental
A release 6.0 não substitui os módulos existentes. Ela cria uma camada de orquestração:

- **Projeto** é o contexto central.
- **sala-projeto.html** é a rota canônica do workspace de um projeto.
- Especificações, matching, propostas, chat, moodboard, clientes, pedidos e demais módulos continuam em suas URLs e recebem `projectId`.
- **ARQSELECT9.gs** adiciona funções de governança e resiliência sem alterar os contratos ARQSELECT7/8.

## Novos arquivos frontend
- `sala-projeto.html`
- `arq-project-hub.js`
- `arq-resilience.js`
- `arq-account.js`
- `admin-qualidade.html`
- `arq-admin-quality.js`

## Novas ações backend 6.0
### Projeto
- `portal_projeto_hub` — GET — acesso ao projeto exigido.
- `portal_projeto_timeline` — GET — acesso ao projeto exigido.
- `portal_projeto_membro_salvar` — POST — responsável/admin ou membro com permissão de edição.

### Resiliência
- `portal_rascunho_salvar` — POST.
- `portal_rascunhos` — GET.
- `portal_rascunho_excluir` — POST.
- `portal_monitor_evento` — POST.

### Conta e LGPD
- `portal_preferencias_notificacao` — GET.
- `portal_preferencias_notificacao_salvar` — POST.
- `portal_consentimentos` — GET.
- `portal_consentimento_salvar` — POST.
- `portal_exportar_meus_dados` — GET.
- `portal_perfil_completude` — GET.
- `portal_feedback_salvar` — POST.

### Descoberta
- `portal_vistos_recentemente` — GET.
- `portal_registrar_visualizacao` — POST.

### Administração
- `admin_qualidade_dados` — GET — ADMIN.
- `admin_auditoria_unificada` — GET — ADMIN.
- `arq9_setup` — POST — ADMIN.

## Novas tabelas
- ARQSELECT - PROJETO EVENTOS
- ARQSELECT - PROJETO EQUIPE
- ARQSELECT - RASCUNHOS
- ARQSELECT - NOTIFICACOES PREFS
- ARQSELECT - FEEDBACK
- ARQSELECT - MONITORAMENTO
- ARQSELECT - CONSENTIMENTOS
- ARQSELECT - VISTOS RECENTEMENTE

## Segurança
- Projetos continuam privados por padrão.
- O Hub valida o ator antes de retornar dados.
- Fornecedor só acessa projeto vinculado em leitura.
- Prestador só acessa projeto quando existe oportunidade/match permitido.
- Equipe possui permissões por projeto.
- Rascunhos nunca devem armazenar senha, token, arquivo, CPF ou CNPJ pelo runtime frontend.
- Perfil público continua separado dos dados internos.

## Compatibilidade
- O frontend do Hub possui fallback para `portal_sala_projeto`, `portal_especificacoes`, `portal_propostas_comparar` e `portal_matching_projeto`.
- Isso permite publicar o frontend 6.0 antes do backend sem derrubar os módulos existentes.
- Para habilitar timeline persistente, equipe, drafts servidor, preferências e governança, publique `ARQSELECT9.gs` e o `Code.gs` 6.0.

## Status da especificação 1–127
A matriz completa está em `docs/ARQSELECT_AUDITORIA_ROADMAP_6_0.md`.
Nenhum item ausente foi tratado como concluído. P0 é implementado primeiro; P1/P2/P3 permanecem rastreados até sua conclusão.
