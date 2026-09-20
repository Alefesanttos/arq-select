# ARQSELECT 6.3 — Auditoria completa e roadmap executável

Data: 2026-09-20

## Princípio de execução
- MELHORAR quando existe.
- FINALIZAR quando incompleto.
- UNIFICAR quando duplicado.
- CORRIGIR quando quebrado.
- CRIAR somente quando necessário.
- Preservar dados, rotas e compatibilidade.

## Legenda
EXISTE = funcionalidade operacional; PARCIAL/INCOMPLETO = base presente mas ainda não cumpre todo o requisito; AUSENTE = não localizada; EM IMPLEMENTAÇÃO = incluída nesta release; ATIVO/BASE = regra/infraestrutura.

## Matriz 1–127

| # | Requisito | Estado | Prioridade | Ação 6.x |
|---:|---|---|---|---|
| 1 | Missão principal | BASE | P0 | Auditoria 6.1 atualizada; execução por impacto e testes de integração. |
| 2 | ARQSELECT como ecossistema | PARCIAL | P0 | Unificar Conexões + Marketplace + Projetos + Oportunidades pelo projectId. |
| 3 | Motor de matching | PARCIAL 6.1 | P0 | Matching unificado de fornecedores por projeto implementado com critérios explicáveis; ampliar ticket/estilo/histórico para todos os papéis. |
| 4 | Score de compatibilidade | IMPLEMENTADO 6.1 | P0 | Score explicável por escopo, região, aprovação e disponibilidade; continua apoio à descoberta, nunca decisão automática. |
| 5 | Projetos como centro | IMPLEMENTADO 6.1 | P0 | Hub canônico consolidado; rota legado projeto.html redireciona preservando compatibilidade. |
| 6 | Hub do projeto | IMPLEMENTADO 6.0 | P0 | Hub canônico com 10 áreas e fallback para módulos existentes. |
| 7 | Solicitação de orçamento inteligente | IMPLEMENTADO 6.1 | P0 | RFQ canônico com projeto, itens, quantidade, medidas, anexos, prazo, localização e fornecedores selecionados/recomendados. |
| 8 | Central de cotações | IMPLEMENTADO 6.1 | P0 | Comparador unificado com favoritar, revisão, chat, aceitar, recusar e arquivar. |
| 9 | Marketplace inteligente | PARCIAL | P1 | Catálogo existe; contextualizar pelo projeto e intenção. |
| 10 | Catálogo profissional | PARCIAL | P1 | Campos premium existem em parte; consolidar schema. |
| 11 | Importação de catálogos | INCOMPLETO | P1 | Admin catálogo existe; falta pipeline PDF/XLS/CSV em massa. |
| 12 | Showroom digital | PARCIAL | P1 | Perfil fornecedor existe; completar história, marcas, certificações e CTAs. |
| 13 | Perfil do arquiteto | PARCIAL 6.2 | P1 | Inteligência de confiança integrada; portfólio/publicações permanecem evolutivos. |
| 14 | Conexões | IMPLEMENTADO 6.2 | P1 | Networking central com recomendações, conectar e salvar contato. |
| 15 | Feed profissional | PARCIAL | P1 | Feed funcional; ranking por relevância precisa evoluir. |
| 16 | Publicações de projetos | PARCIAL | P1 | Feed aceita PROJETO; vinculação produto/fornecedor precisa ser estruturada. |
| 17 | Produto aplicado | IMPLEMENTADO 6.3 | P2 | Página de produto recebe projetos aplicados quando houver vínculo real e autorizado. |
| 18 | Oportunidades | IMPLEMENTADO 6.1 | P0 | Central única agrega oportunidades de produto/fornecedor e serviços, preservando telas específicas legadas. |
| 19 | Oportunidades automáticas | PARCIAL 6.1 | P0 | RFQ recomendado cria distribuição por matching; automação integral por necessidades declaradas continua evoluindo. |
| 20 | Leads para fornecedores | IMPLEMENTADO 6.1 | P0 | Central unificada adota NOVO → VISUALIZADO → CONTATO INICIADO → PROPOSTA ENVIADA → NEGOCIAÇÃO → FECHADO/PERDIDO. |
| 21 | Mini CRM | PARCIAL 6.1 | P0 | Funil de oportunidades unificado; tarefas/contatos organizacionais amplos seguem P1. |
| 22 | Relacionamento | IMPLEMENTADO 6.1 | P0 | Eventos de RFQ/proposta/equipe/status persistem na timeline do projeto; timeline por contato segue P1. |
| 23 | Agenda | IMPLEMENTADO 6.2 | P1 | Agenda unificada para reuniões, visitas, ligações, follow-ups e prazos, com vínculo de projeto. |
| 24 | Notificações inteligentes | PARCIAL | P1 | Central existe; padronizar eventos e links. |
| 25 | Preferências de notificações | IMPLEMENTADO 6.0 | P1 | Controle por evento, canal e frequência na Central de Conta. |
| 26 | Verificação | PARCIAL | P1 | Prestador possui verificação; estender empresas/perfis. |
| 27 | Avaliações | PARCIAL | P1 | Avaliações existem; amarrar estritamente a transações elegíveis. |
| 28 | Reputação | PARCIAL | P1 | Nota usada em matching; criar score multidimensional. |
| 29 | Tempo de resposta | IMPLEMENTADO 6.2 | P2 | Inteligência de perfil expõe mediana quando houver histórico suficiente. |
| 30 | Favoritos | PARCIAL | P1 | Produtos e salvos existem; unificar entidades. |
| 31 | Coleções | PARCIAL | P1 | Boards cobrem parte; evoluir coleções privadas. |
| 32 | Moodboard | EXISTE | P1 | Boards/moodboard já operam; integrar ao projeto. |
| 33 | Lista de especificação | EXISTE | P0 | Especificações já existem; melhorar exportação e ambientes. |
| 34 | Biblioteca técnica | EXISTE | P1 | Publicação técnica existe; integrar downloads/analytics. |
| 35 | Downloads | INCOMPLETO | P2 | Arquivos existem; falta telemetria agregada por fornecedor. |
| 36 | Busca profissional | PARCIAL 6.1 | P0 | Descobrir permanece central e matching do projeto passa a expor razões; filtros avançados seguem P1. |
| 37 | Busca semântica | PARCIAL | P1 | Busca por tokens/contexto; preparar camada semântica futura. |
| 38 | Filtros avançados | INCOMPLETO | P1 | Filtros do marketplace não cobrem todo schema requerido. |
| 39 | Recomendações | PARCIAL 6.2 | P1 | Networking e Em Alta ampliam recomendações; personalização comportamental segue evolutiva. |
| 40 | IA ARQSELECT | PARCIAL | P2 | Assistente existe por atributos; falta raciocínio operacional completo. |
| 41 | Assistente do projeto | PARCIAL | P1 | portal_assistente_projeto existe; ampliar pendências/prazos/tarefas. |
| 42 | Completude do perfil | IMPLEMENTADO 6.2 | P1 | Indicador unificado nos perfis e Central de Conta. |
| 43 | Onboarding | IMPLEMENTADO 6.2 | P1 | Onboarding unificado adapta campos por papel. |
| 44 | Onboarding arquiteto | IMPLEMENTADO 6.2 | P1 | Segmentos, região, tipo de projeto, ticket e categorias. |
| 45 | Onboarding fornecedor | IMPLEMENTADO 6.2 | P1 | Segmentos, produtos, marcas, área, ticket, catálogo e contato comercial. |
| 46 | Onboarding prestador | EXISTE | P1 | Serviços/região/experiência/portfólio/disponibilidade já possuem base. |
| 47 | Dashboard personalizado | EXISTE | P0 | Há dashboards por papel; alinhar dados e atalhos. |
| 48 | Analytics | PARCIAL | P1 | Analytics fornecedor + negócios + Web Vitals existem; ampliar eventos. |
| 49 | Funil | PARCIAL | P1 | Painel de negócios possui funil; unificar leads/serviços. |
| 50 | Painel administrativo | PARCIAL | P1 | Admin robusto, mas fragmentado em páginas legadas. |
| 51 | Moderação | PARCIAL | P1 | Feed/denúncias existem; estender perfil/produto/avaliação/mensagem. |
| 52 | Auditoria | EXISTE | P0 | CRM possui auditoria; ampliar eventos das camadas novas. |
| 53 | Monetização | IMPLEMENTADO 6.3 | P2 | Comissão + arquitetura de planos/entitlements e destaques transparentes. |
| 54 | Planos | IMPLEMENTADO 6.3 | P2 | Página e contrato de planos criados; ativação comercial permanece configurável. |
| 55 | Destaques | IMPLEMENTADO 6.3 | P2 | Resultados patrocinados são identificados e não alteram reputação/compatibilidade. |
| 56 | Comissão | EXISTE | P0 | Registro de negócios/comissão implementado; integrar todos os fechamentos. |
| 57 | Segurança | PARCIAL | P0 | Sessões/permissões existem; rate limit/upload/CSP precisam revisão contínua. |
| 58 | LGPD | PARCIAL 6.0 | P0 | Exportação, consentimento e solicitação de exclusão implementados; ciclo operacional de atendimento permanece administrativo. |
| 59 | Performance | EXISTE | P0 | RUM + Lighthouse + lazy/cache já implementados. |
| 60 | Escalabilidade | PARCIAL | P0 | Apps Script/Sheets exige paginação/índices/caches e estratégia de migração futura. |
| 61 | SEO | PARCIAL | P1 | Públicas indexáveis existem; ampliar entidades/conteúdo. |
| 62 | URLs amigáveis | PARCIAL 6.3 | P2 | Aliases amigáveis iniciais criados preservando rotas legadas; expansão programática futura. |
| 63 | Compartilhamento | PARCIAL | P1 | Feed e Hub compartilham; padronizar demais entidades. |
| 64 | Landing pages | IMPLEMENTADO 6.2 | P1 | Landings para arquitetos, fornecedores, prestadores e marcas. |
| 65 | Blog/conteúdo | IMPLEMENTADO 6.2 | P2 | Hub editorial público criado; publica somente conteúdo real. |
| 66 | Tendências | IMPLEMENTADO 6.2 | P2 | Página Em Alta criada para produtos, categorias, projetos e conteúdo. |
| 67 | Eventos | IMPLEMENTADO 6.2 | P3 | Área pública de eventos e lançamentos criada, sem inventar programação. |
| 68 | Networking | IMPLEMENTADO 6.2 | P1 | Central de networking profissional implementada. |
| 69 | Convites | IMPLEMENTADO 6.3 | P1 | Convites e indicações profissionais passam a ter fluxo próprio. |
| 70 | Programa de indicação | IMPLEMENTADO 6.3 | P3 | Registro e acompanhamento de indicações criado sem mecânica de spam. |
| 71 | Badges | IMPLEMENTADO 6.3 | P2 | Inteligência de perfil suporta Verificado, Resposta rápida, Catálogo completo e Parceiro ARQSELECT. |
| 72 | Gamificação discreta | PARCIAL | P2 | Completude já é base; não criar mecânicas de jogo. |
| 73 | Central de ajuda | EXISTE | P1 | Guias/suporte existentes; consolidar FAQ/tutoriais. |
| 74 | Feedback do usuário | IMPLEMENTADO 6.0 | P1 | Feedback persistente integrado à Central de Conta. |
| 75 | Primeiro acesso | IMPLEMENTADO 6.2 | P1 | Onboarding orienta personalização por papel e próximo passo. |
| 76 | Call to Action | PARCIAL | P1 | Padronizar seis CTAs principais no Design System. |
| 77 | Evitar páginas sem propósito | PARCIAL 6.1 | P0 | projeto.html consolidado no Hub; demais aliases legados continuam sendo reduzidos gradualmente. |
| 78 | Empty states | EXISTE | P1 | Design System já orienta próxima ação; revisar módulos legados. |
| 79 | Social proof | INCOMPLETO | P2 | Não usar números inventados; mostrar apenas casos/dados reais. |
| 80 | Cases | AUSENTE | P2 | Criar quando houver casos reais autorizados. |
| 81 | Métrica principal | PARCIAL | P0 | BI mede projetos/propostas/fechados; criar North Star explícita. |
| 82 | Retenção | PARCIAL 6.2 | P1 | Agenda, Networking e Em Alta adicionam motivos recorrentes de retorno. |
| 83 | E-mails transacionais | PARCIAL | P1 | Existem envios pontuais; padronizar templates/eventos. |
| 84 | WhatsApp | PARCIAL | P2 | CTA existe; manter rastreamento interno antes de saída. |
| 85 | Mobile | EXISTE | P0 | 5.8.2/5.10 reforçaram responsividade e navegação mobile. |
| 86 | PWA | EXISTE | P1 | Manifest + Service Worker ativos; push ainda futuro. |
| 87 | Futuro app | PARCIAL 6.3 | P2 | PWA, APIs modulares e eventos/webhooks reduzem acoplamento para futuro app nativo. |
| 88 | Diferencial estratégico | PARCIAL | P0 | Projeto passa a ser eixo unificador na 6.0. |
| 89 | Ciclo completo | PARCIAL 6.1 | P0 | Projeto → matching → RFQ → proposta → negociação → aceite já está costurado; pós-venda/reputação ainda amadurece. |
| 90 | Efeito rede | BASE | P1 | Depende de crescimento e qualidade de dados; matching/feed sustentam o efeito. |
| 91 | Perfil público/privado | PARCIAL | P0 | Prestador já sanitizado; ampliar controles nos demais papéis. |
| 92 | Projetos privados | PARCIAL | P0 | Acesso autenticado já restringe; criar compartilhamentos explícitos. |
| 93 | Times | PARCIAL 6.0 | P1 | Equipe por projeto implementada; times organizacionais amplos permanecem P1. |
| 94 | Permissões | PARCIAL 6.0 | P0 | Permissões VIEW/EDIT/ADMIN por projeto implementadas; RBAC organizacional continua pendente. |
| 95 | Multiempresa | IMPLEMENTADO 6.3 | P3 | Organização, membros, papéis e permissões N:N preparados na camada 10. |
| 96 | Monitoramento | IMPLEMENTADO 6.0 | P0 | Web Vitals + erros JS/promises persistidos para diagnóstico autenticado. |
| 97 | Qualidade de dados | IMPLEMENTADO 6.0 | P0 | Painel Admin de duplicidades e auditoria criado; ampliar regras continuamente. |
| 98 | Evitar duplicidade | PARCIAL | P0 | Fornecedor possui dedupe; estender empresas/produtos/usuários. |
| 99 | Importação em massa | IMPLEMENTADO 6.3 | P1 | CSV/JSON com prévia e lote; PDF/XLS/XLSX enviados para processamento controlado. |
| 100 | Exportação | IMPLEMENTADO 6.3 | P1 | Central unificada exporta especificações, propostas, leads e negócios em CSV. |
| 101 | Página Explorar | PARCIAL | P1 | Marketplace + Descobrir separados; unificar descoberta sem quebrar URLs. |
| 102 | Mapa | IMPLEMENTADO 6.3 | P3 | Rede por cidade/estado/área profissional, sem expor endereço residencial preciso. |
| 103 | Comparador | EXISTE | P1 | Produtos e propostas já têm comparação. |
| 104 | Histórico de visualização | IMPLEMENTADO 6.3 | P2 | Histórico privado ganhou página própria de retomada. |
| 105 | Produtos relacionados | IMPLEMENTADO 6.3 | P2 | Produto recebe relacionados por categoria/atributos quando disponíveis. |
| 106 | Cross-sell | IMPLEMENTADO 6.3 | P2 | Complementares aparecem em contexto de produto, sem poluir descoberta geral. |
| 107 | Fornecedores alternativos | IMPLEMENTADO 6.3 | P1 | Alternativas compatíveis aparecem no produto com disponibilidade/região quando informadas. |
| 108 | Disponibilidade | PARCIAL | P1 | Prestador possui; fornecedor/produto precisam prazo/estoque. |
| 109 | Região de atendimento | PARCIAL | P1 | Prestador possui região/raio; fornecedor precisa granularidade. |
| 110 | Logística | PARCIAL | P1 | Propostas possuem frete/prazo; catálogo precisa retirada/entrega. |
| 111 | API | EXISTE | P0 | Web App baseado em ações; documentar contratos. |
| 112 | Webhooks | IMPLEMENTADO 6.3 | P2 | Admin configura endpoints e eventos project/proposal/lead/deal/message/profile. |
| 113 | Documentação | IMPLEMENTADO 6.0 | P0 | Arquitetura, APIs, permissões e roadmap formalizados em docs/. |
| 114 | Testes | PARCIAL 6.1 | P0 | Core Smoke agora exige Hub, RFQ, matching, proposta e oportunidades; E2E autenticado real continua obrigatório. |
| 115 | Experiência de erro | PARCIAL | P0 | 403/404/500 e shellError existem; padronizar API/retry. |
| 116 | Recuperação | IMPLEMENTADO 6.0 | P0 | Rascunho local/servidor e recuperação automática dos formulários marcados. |
| 117 | Autosave | IMPLEMENTADO 6.0 | P0 | Autosave seguro aplicado a projeto, catálogo/produto, prestador e oportunidade. |
| 118 | Rascunhos | PARCIAL 6.0 | P0 | Infraestrutura persistente e principais formulários implementados; publicação/proposta ainda entram na próxima integração. |
| 119 | Status | EXISTE | P0 | Status já definidos; normalizar nomes canônicos. |
| 120 | Timeline | IMPLEMENTADO 6.0 | P0 | Timeline persistente por projeto com fallback aos históricos existentes. |
| 121 | Roadmap interno | ATIVO 6.1 | P0 | Matriz 1–127 permanece rastreável e atualizada a cada release. |
| 122 | Não implementar aleatoriamente | ATIVO | P0 | Execução baseada nesta matriz. |
| 123 | Entregas incrementais | ATIVO | P0 | Base → fluxos → inteligência → crescimento. |
| 124 | Objetivo de negócio | ATIVO | P0 | Cada entrega marcada por aquisição/ativação/engajamento/conversão/retenção/receita/confiança. |
| 125 | Regra de simplicidade | ATIVO | P0 | Não criar duplicações; preferir integração. |
| 126 | Regra de qualidade | ATIVO | P0 | Finalizar módulos existentes antes de ampliar. |
| 127 | Missão final | EM EXECUÇÃO | P0 | Transformar catálogo/conexão em sistema operacional do relacionamento. |

## Entregas 6.1 + 6.2 concluídas
- Projeto canônico e compatibilidade de rota.
- RFQ inteligente completo no frontend + contrato backend.
- Matching explicável para seleção de fornecedores.
- Central de cotações com ações comerciais.
- Central unificada de oportunidades/leads.
- Timeline integrada aos principais eventos comerciais.
- Smoke test ampliado.

## Ordem de execução
### P0 — núcleo operacional
Projeto/HUB, matching, RFQ/comparação, oportunidades/leads/CRM, comissão, segurança/LGPD, dados, testes, recuperação/autosave, status/timeline.

### P1 — uso semanal
Marketplace contextual, showroom/perfis, feed/conexões, agenda/notificações, reputação, busca/filtros/recomendações, onboarding, analytics, landing pages, importação/exportação.

### P2 — crescimento e receita
IA avançada, monetização/planos/destaques, SEO/URLs, conteúdo, badges, histórico, cross-sell, webhooks.

### P3 — expansão futura
Eventos, programa de indicação, multiempresa completa, mapa e app nativo.

## North Star proposta
**Projetos ativos que geraram pelo menos uma interação comercial qualificada nos últimos 30 dias** (solicitação, proposta, conversa contextual, conexão, pedido ou fechamento).

## Regra de release
Nenhum item muda para EXISTE sem:
1. rota/UI acessível;
2. permissão;
3. estado vazio/erro;
4. persistência quando aplicável;
5. teste de integração;
6. documentação do contrato.


## Entrega 6.2
- Networking profissional.
- Agenda unificada.
- Em Alta / tendências.
- Onboarding por papel.
- Inteligência de perfil, badges, completude e tempo de resposta.
- Blog, cases e eventos com dados reais.
- Landing pages por público.


## Entrega 6.3
- Planos e entitlements preparados.
- Destaques patrocinados identificados sem alterar score/reputação.
- Programa de indicação.
- Organização/multiempresa com equipe e permissões.
- Importação em massa e central de exportação.
- Webhooks para integrações futuras.
- Histórico recente em página própria.
- Rede por localização profissional.
- Produto aplicado, relacionados, cross-sell e fornecedores alternativos.
- Aliases amigáveis iniciais preservando URLs antigas.
