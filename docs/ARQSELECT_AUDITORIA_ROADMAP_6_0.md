# ARQSELECT 6.0 — Auditoria completa e roadmap executável

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
| 1 | Missão principal | BASE | P0 | Auditoria 6.0 criada; execução por impacto. |
| 2 | ARQSELECT como ecossistema | PARCIAL | P0 | Unificar Conexões + Marketplace + Projetos + Oportunidades pelo projectId. |
| 3 | Motor de matching | PARCIAL | P0 | Já existe para fornecedores/prestadores; ampliar contexto/ticket/estilo/prazo. |
| 4 | Score de compatibilidade | PARCIAL | P0 | Score existe; padronizar critérios e explicabilidade. |
| 5 | Projetos como centro | PARCIAL | P0 | Hub canônico 6.0 em implementação. |
| 6 | Hub do projeto | IMPLEMENTADO 6.0 | P0 | Hub canônico com 10 áreas e fallback para módulos existentes. |
| 7 | Solicitação de orçamento inteligente | PARCIAL | P0 | Especificações cotam; ampliar anexos, medidas, fornecedores e matching. |
| 8 | Central de cotações | PARCIAL | P0 | Comparador existe; faltam revisão/favoritar/arquivar em fluxo único. |
| 9 | Marketplace inteligente | PARCIAL | P1 | Catálogo existe; contextualizar pelo projeto e intenção. |
| 10 | Catálogo profissional | PARCIAL | P1 | Campos premium existem em parte; consolidar schema. |
| 11 | Importação de catálogos | INCOMPLETO | P1 | Admin catálogo existe; falta pipeline PDF/XLS/CSV em massa. |
| 12 | Showroom digital | PARCIAL | P1 | Perfil fornecedor existe; completar história, marcas, certificações e CTAs. |
| 13 | Perfil do arquiteto | PARCIAL | P1 | Perfil existe; completar portfólio/publicações/conexões. |
| 14 | Conexões | PARCIAL | P1 | Solicitação de conexão existe no Feed; criar gestão e recomendações. |
| 15 | Feed profissional | PARCIAL | P1 | Feed funcional; ranking por relevância precisa evoluir. |
| 16 | Publicações de projetos | PARCIAL | P1 | Feed aceita PROJETO; vinculação produto/fornecedor precisa ser estruturada. |
| 17 | Produto aplicado | AUSENTE | P2 | Criar relação produto ↔ projeto publicado. |
| 18 | Oportunidades | PARCIAL | P0 | Fornecedor e prestador possuem fluxos distintos; unificar central. |
| 19 | Oportunidades automáticas | PARCIAL | P0 | Prestadores geram matching; fornecedor precisa automação por necessidades. |
| 20 | Leads para fornecedores | PARCIAL | P0 | CRM base existe; alinhar estágios e próxima ação. |
| 21 | Mini CRM | PARCIAL | P0 | Prestador e CRM legado existem; unificar por entidade. |
| 22 | Relacionamento | PARCIAL | P0 | Históricos separados; centralizar timeline por projeto/contato. |
| 23 | Agenda | PARCIAL | P1 | Agenda existe; integrar projeto/lead e lembretes. |
| 24 | Notificações inteligentes | PARCIAL | P1 | Central existe; padronizar eventos e links. |
| 25 | Preferências de notificações | IMPLEMENTADO 6.0 | P1 | Controle por evento, canal e frequência na Central de Conta. |
| 26 | Verificação | PARCIAL | P1 | Prestador possui verificação; estender empresas/perfis. |
| 27 | Avaliações | PARCIAL | P1 | Avaliações existem; amarrar estritamente a transações elegíveis. |
| 28 | Reputação | PARCIAL | P1 | Nota usada em matching; criar score multidimensional. |
| 29 | Tempo de resposta | AUSENTE | P2 | Medir e exibir mediana de resposta. |
| 30 | Favoritos | PARCIAL | P1 | Produtos e salvos existem; unificar entidades. |
| 31 | Coleções | PARCIAL | P1 | Boards cobrem parte; evoluir coleções privadas. |
| 32 | Moodboard | EXISTE | P1 | Boards/moodboard já operam; integrar ao projeto. |
| 33 | Lista de especificação | EXISTE | P0 | Especificações já existem; melhorar exportação e ambientes. |
| 34 | Biblioteca técnica | EXISTE | P1 | Publicação técnica existe; integrar downloads/analytics. |
| 35 | Downloads | INCOMPLETO | P2 | Arquivos existem; falta telemetria agregada por fornecedor. |
| 36 | Busca profissional | PARCIAL | P0 | Descobrir 5.9 existe; ampliar projeto/localidade/filtros. |
| 37 | Busca semântica | PARCIAL | P1 | Busca por tokens/contexto; preparar camada semântica futura. |
| 38 | Filtros avançados | INCOMPLETO | P1 | Filtros do marketplace não cobrem todo schema requerido. |
| 39 | Recomendações | PARCIAL | P1 | Matching e Descobrir já recomendam; personalização ainda limitada. |
| 40 | IA ARQSELECT | PARCIAL | P2 | Assistente existe por atributos; falta raciocínio operacional completo. |
| 41 | Assistente do projeto | PARCIAL | P1 | portal_assistente_projeto existe; ampliar pendências/prazos/tarefas. |
| 42 | Completude do perfil | PARCIAL | P1 | Prestador possui; estender arquiteto/fornecedor. |
| 43 | Onboarding | PARCIAL | P1 | Logins separados; onboarding não está completo para todos. |
| 44 | Onboarding arquiteto | INCOMPLETO | P1 | Adicionar segmentos/região/ticket/categorias. |
| 45 | Onboarding fornecedor | INCOMPLETO | P1 | Adicionar marcas/área/ticket/catálogo/contato comercial. |
| 46 | Onboarding prestador | EXISTE | P1 | Serviços/região/experiência/portfólio/disponibilidade já possuem base. |
| 47 | Dashboard personalizado | EXISTE | P0 | Há dashboards por papel; alinhar dados e atalhos. |
| 48 | Analytics | PARCIAL | P1 | Analytics fornecedor + negócios + Web Vitals existem; ampliar eventos. |
| 49 | Funil | PARCIAL | P1 | Painel de negócios possui funil; unificar leads/serviços. |
| 50 | Painel administrativo | PARCIAL | P1 | Admin robusto, mas fragmentado em páginas legadas. |
| 51 | Moderação | PARCIAL | P1 | Feed/denúncias existem; estender perfil/produto/avaliação/mensagem. |
| 52 | Auditoria | EXISTE | P0 | CRM possui auditoria; ampliar eventos das camadas novas. |
| 53 | Monetização | PARCIAL | P2 | Comissão existe; planos ainda não completos. |
| 54 | Planos | AUSENTE | P2 | Criar entitlements sem bloquear base gratuita inicialmente. |
| 55 | Destaques | AUSENTE | P2 | Preparar patrocinados identificados claramente. |
| 56 | Comissão | EXISTE | P0 | Registro de negócios/comissão implementado; integrar todos os fechamentos. |
| 57 | Segurança | PARCIAL | P0 | Sessões/permissões existem; rate limit/upload/CSP precisam revisão contínua. |
| 58 | LGPD | PARCIAL 6.0 | P0 | Exportação, consentimento e solicitação de exclusão implementados; ciclo operacional de atendimento permanece administrativo. |
| 59 | Performance | EXISTE | P0 | RUM + Lighthouse + lazy/cache já implementados. |
| 60 | Escalabilidade | PARCIAL | P0 | Apps Script/Sheets exige paginação/índices/caches e estratégia de migração futura. |
| 61 | SEO | PARCIAL | P1 | Públicas indexáveis existem; ampliar entidades/conteúdo. |
| 62 | URLs amigáveis | INCOMPLETO | P2 | GitHub Pages usa .html/query; preparar aliases/roteamento compatível. |
| 63 | Compartilhamento | PARCIAL | P1 | Feed e Hub compartilham; padronizar demais entidades. |
| 64 | Landing pages | INCOMPLETO | P1 | Home cobre papéis; faltam landings específicas. |
| 65 | Blog/conteúdo | AUSENTE | P2 | Criar editorial integrado ao Feed/SEO. |
| 66 | Tendências | PARCIAL | P2 | Feed fornece tendências; falta página Em alta. |
| 67 | Eventos | AUSENTE | P3 | Preparar feiras/workshops/lançamentos. |
| 68 | Networking | PARCIAL | P1 | Conexões existem no Feed; falta central de networking. |
| 69 | Convites | PARCIAL | P1 | Convite de prestador existe; ampliar usuários/empresas. |
| 70 | Programa de indicação | AUSENTE | P3 | Estrutura futura. |
| 71 | Badges | PARCIAL | P2 | Verificado existe; criar resposta rápida/catálogo completo/parceiro. |
| 72 | Gamificação discreta | PARCIAL | P2 | Completude já é base; não criar mecânicas de jogo. |
| 73 | Central de ajuda | EXISTE | P1 | Guias/suporte existentes; consolidar FAQ/tutoriais. |
| 74 | Feedback do usuário | IMPLEMENTADO 6.0 | P1 | Feedback persistente integrado à Central de Conta. |
| 75 | Primeiro acesso | PARCIAL | P1 | Home explica proposta; onboarding precisa completar ativação. |
| 76 | Call to Action | PARCIAL | P1 | Padronizar seis CTAs principais no Design System. |
| 77 | Evitar páginas sem propósito | INCOMPLETO | P0 | Ainda há páginas legadas/duplicadas; consolidar progressivamente. |
| 78 | Empty states | EXISTE | P1 | Design System já orienta próxima ação; revisar módulos legados. |
| 79 | Social proof | INCOMPLETO | P2 | Não usar números inventados; mostrar apenas casos/dados reais. |
| 80 | Cases | AUSENTE | P2 | Criar quando houver casos reais autorizados. |
| 81 | Métrica principal | PARCIAL | P0 | BI mede projetos/propostas/fechados; criar North Star explícita. |
| 82 | Retenção | PARCIAL | P1 | Feed/chat/oportunidades/projetos geram retorno; recomendações precisam maturar. |
| 83 | E-mails transacionais | PARCIAL | P1 | Existem envios pontuais; padronizar templates/eventos. |
| 84 | WhatsApp | PARCIAL | P2 | CTA existe; manter rastreamento interno antes de saída. |
| 85 | Mobile | EXISTE | P0 | 5.8.2/5.10 reforçaram responsividade e navegação mobile. |
| 86 | PWA | EXISTE | P1 | Manifest + Service Worker ativos; push ainda futuro. |
| 87 | Futuro app | PARCIAL | P2 | APIs de ação existem; padronização REST/eventos ainda incompleta. |
| 88 | Diferencial estratégico | PARCIAL | P0 | Projeto passa a ser eixo unificador na 6.0. |
| 89 | Ciclo completo | PARCIAL | P0 | Maioria das etapas existe; Hub fará a costura operacional. |
| 90 | Efeito rede | BASE | P1 | Depende de crescimento e qualidade de dados; matching/feed sustentam o efeito. |
| 91 | Perfil público/privado | PARCIAL | P0 | Prestador já sanitizado; ampliar controles nos demais papéis. |
| 92 | Projetos privados | PARCIAL | P0 | Acesso autenticado já restringe; criar compartilhamentos explícitos. |
| 93 | Times | PARCIAL 6.0 | P1 | Equipe por projeto implementada; times organizacionais amplos permanecem P1. |
| 94 | Permissões | PARCIAL 6.0 | P0 | Permissões VIEW/EDIT/ADMIN por projeto implementadas; RBAC organizacional continua pendente. |
| 95 | Multiempresa | AUSENTE | P3 | Planejar vínculo usuário↔organização N:N. |
| 96 | Monitoramento | IMPLEMENTADO 6.0 | P0 | Web Vitals + erros JS/promises persistidos para diagnóstico autenticado. |
| 97 | Qualidade de dados | IMPLEMENTADO 6.0 | P0 | Painel Admin de duplicidades e auditoria criado; ampliar regras continuamente. |
| 98 | Evitar duplicidade | PARCIAL | P0 | Fornecedor possui dedupe; estender empresas/produtos/usuários. |
| 99 | Importação em massa | INCOMPLETO | P1 | Catálogo admin existe; falta lote robusto. |
| 100 | Exportação | PARCIAL | P1 | Exportações pontuais; padronizar propostas/especificações/leads. |
| 101 | Página Explorar | PARCIAL | P1 | Marketplace + Descobrir separados; unificar descoberta sem quebrar URLs. |
| 102 | Mapa | AUSENTE | P3 | Futuro com geocodificação/consentimento. |
| 103 | Comparador | EXISTE | P1 | Produtos e propostas já têm comparação. |
| 104 | Histórico de visualização | IMPLEMENTADO 6.0 | P2 | Registro privado por usuário e recuperação em Descobrir. |
| 105 | Produtos relacionados | PARCIAL | P2 | Catálogo premium possui relações limitadas; automatizar por atributos. |
| 106 | Cross-sell | PARCIAL | P2 | Aplicar apenas em contexto de projeto/produto. |
| 107 | Fornecedores alternativos | PARCIAL | P1 | Matching cobre alternativas; exibir no produto/cotação. |
| 108 | Disponibilidade | PARCIAL | P1 | Prestador possui; fornecedor/produto precisam prazo/estoque. |
| 109 | Região de atendimento | PARCIAL | P1 | Prestador possui região/raio; fornecedor precisa granularidade. |
| 110 | Logística | PARCIAL | P1 | Propostas possuem frete/prazo; catálogo precisa retirada/entrega. |
| 111 | API | EXISTE | P0 | Web App baseado em ações; documentar contratos. |
| 112 | Webhooks | AUSENTE | P2 | Preparar eventos proposal/project/lead/deal. |
| 113 | Documentação | IMPLEMENTADO 6.0 | P0 | Arquitetura, APIs, permissões e roadmap formalizados em docs/. |
| 114 | Testes | PARCIAL 6.0 | P0 | Lighthouse + Core Smoke automatizado; E2E autenticado real continua obrigatório. |
| 115 | Experiência de erro | PARCIAL | P0 | 403/404/500 e shellError existem; padronizar API/retry. |
| 116 | Recuperação | IMPLEMENTADO 6.0 | P0 | Rascunho local/servidor e recuperação automática dos formulários marcados. |
| 117 | Autosave | IMPLEMENTADO 6.0 | P0 | Autosave seguro aplicado a projeto, catálogo/produto, prestador e oportunidade. |
| 118 | Rascunhos | PARCIAL 6.0 | P0 | Infraestrutura persistente e principais formulários implementados; publicação/proposta ainda entram na próxima integração. |
| 119 | Status | EXISTE | P0 | Status já definidos; normalizar nomes canônicos. |
| 120 | Timeline | IMPLEMENTADO 6.0 | P0 | Timeline persistente por projeto com fallback aos históricos existentes. |
| 121 | Roadmap interno | EM IMPLEMENTAÇÃO | P0 | Este documento é o roadmap rastreável. |
| 122 | Não implementar aleatoriamente | ATIVO | P0 | Execução baseada nesta matriz. |
| 123 | Entregas incrementais | ATIVO | P0 | Base → fluxos → inteligência → crescimento. |
| 124 | Objetivo de negócio | ATIVO | P0 | Cada entrega marcada por aquisição/ativação/engajamento/conversão/retenção/receita/confiança. |
| 125 | Regra de simplicidade | ATIVO | P0 | Não criar duplicações; preferir integração. |
| 126 | Regra de qualidade | ATIVO | P0 | Finalizar módulos existentes antes de ampliar. |
| 127 | Missão final | EM EXECUÇÃO | P0 | Transformar catálogo/conexão em sistema operacional do relacionamento. |

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
