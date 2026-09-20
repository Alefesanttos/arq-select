# ARQSELECT 6.0 — Auditoria executável e roadmap

Data: 2026-09-20  
Base auditada: main 5.10.3  
Princípio: **MELHORAR → FINALIZAR → UNIFICAR → CORRIGIR → CRIAR somente quando necessário.**

## Legenda
- ✅ existente e utilizável
- 🟡 existente, mas incompleto/fragmentado
- 🔴 ausente ou sem implementação operacional
- P0 crítico · P1 alta · P2 importante · P3 futuro

## Diagnóstico executivo
A ARQSELECT já possui marketplace, produtos, perfis, projetos, matching, especificações, comparação de propostas, chat, feed, moodboards, biblioteca técnica, amostras, pedidos, analytics, CRM de prestador, agenda, avaliações, notificações, busca inteligente, BI, PWA e administração. O maior gargalo é **fragmentação do fluxo**: recursos importantes existem em páginas separadas, mas o projeto ainda não funciona plenamente como o centro operacional do relacionamento.

## Matriz completa 1–127
| # | Requisito | Estado | Prioridade | Ação |
|---|---|---|---|---|
|1|Missão principal / ecossistema útil semanalmente|🟡|P0|Unificar jornada e métricas de valor|
|2|Ecossistema: conexões + marketplace + projetos + oportunidades|🟡|P0|Conectar navegação e contexto|
|3|Motor de matching|🟡|P0|Unificar fornecedores + prestadores + produtos|
|4|Score de compatibilidade|✅/🟡|P0|Padronizar score e explicação|
|5|Projetos como centro|🟡|P0|Evoluir Sala do Projeto para hub|
|6|Hub do projeto|🟡|P0|Criar abas canônicas no projeto|
|7|Solicitação de orçamento inteligente|🟡|P0|Completar dados, arquivos e seleção de parceiros|
|8|Central de cotações|🟡|P0|Adicionar revisão/favorito/recusa/arquivamento|
|9|Marketplace inteligente|✅/🟡|P1|Ampliar filtros/contexto|
|10|Catálogo profissional|🟡|P1|Completar schema de produto|
|11|Importação de catálogos|🟡|P1|Consolidar PDF/Excel/CSV em fluxo assistido|
|12|Showroom digital fornecedor|🟡|P1|Completar equipe/certificações/CTAs|
|13|Perfil do arquiteto|🟡|P1|Completar portfólio público|
|14|Conexões profissionais|🟡|P1|Finalizar seguir/conectar/salvar|
|15|Feed profissional|✅/🟡|P1|Aprimorar relevância|
|16|Publicações de projetos|🟡|P1|Vincular produtos e parceiros|
|17|Produto aplicado|🔴|P2|Criar vínculo produto↔projeto|
|18|Central de oportunidades|✅/🟡|P0|Unificar fornecedores/prestadores|
|19|Oportunidades automáticas|🟡|P1|Gerar a partir das necessidades do projeto|
|20|Leads fornecedores|🟡|P0|Padronizar pipeline|
|21|Mini CRM|🟡|P0|Unificar CRM fornecedor/prestador|
|22|Relacionamento / histórico|🟡|P0|Timeline canônica|
|23|Agenda|✅/🟡|P1|Unificar eventos e follow-ups|
|24|Notificações inteligentes|🟡|P1|Central única|
|25|Preferências de notificação|🔴/🟡|P1|Adicionar preferências|
|26|Verificação|🟡|P1|Padronizar selo e critérios|
|27|Avaliações pós-negócio|🟡|P1|Restringir a transações elegíveis|
|28|Reputação composta|🟡|P1|Score além de estrelas|
|29|Tempo de resposta|🔴/🟡|P2|Derivar de mensagens/propostas|
|30|Favoritos|✅/🟡|P1|Unificar todos os tipos|
|31|Coleções|✅/🟡|P1|Ampliar além de produtos|
|32|Moodboard|✅|P1|Vincular ao projeto|
|33|Lista de especificação|✅/🟡|P0|Exportação e versionamento|
|34|Biblioteca técnica|✅/🟡|P1|Métricas e taxonomia|
|35|Downloads|🟡|P2|Analytics por documento|
|36|Busca profissional|✅/🟡|P0|Cobrir todos os tipos|
|37|Busca semântica|🟡|P1|Evoluir ranking semântico|
|38|Filtros avançados|🟡|P1|Localidade/material/preço/verificação|
|39|Recomendações|🟡|P1|Contexto por projeto|
|40|IA ARQSELECT|🟡|P1|Assistente orientado a ações|
|41|Assistente do projeto|🟡|P0|Pendências, prazos e próximos passos|
|42|Completude do perfil|🟡|P1|Padronizar por papel|
|43|Onboarding por papel|✅/🟡|P1|Unificar padrões|
|44|Onboarding arquiteto|🟡|P1|Completar segmentos/ticket/categorias|
|45|Onboarding fornecedor|🟡|P1|Completar marcas/catálogo/ticket|
|46|Onboarding prestador|✅/🟡|P1|Completar documentos|
|47|Dashboard personalizado|✅/🟡|P0|Padronizar métricas e atalhos|
|48|Analytics fornecedor|✅/🟡|P1|Adicionar série temporal e perdas|
|49|Funil|✅/🟡|P0|Padronizar etapas|
|50|Admin profissional|✅/🟡|P0|Unificar admins legados|
|51|Moderação|🟡|P1|Cobrir perfil/produto/post/mensagem/avaliação|
|52|Auditoria|🟡|P0|Log central de ações sensíveis|
|53|Monetização|🟡|P2|Arquitetura de planos|
|54|Planos|🔴/🟡|P2|Entitlements por plano|
|55|Destaques patrocinados|🔴/🟡|P2|Sempre identificados|
|56|Comissão|✅/🟡|P0|Consolidar financeiro/comissão|
|57|Segurança|🟡|P0|RBAC, sessão, upload, rate limit|
|58|LGPD|🟡|P0|Consentimento/exportar/excluir|
|59|Performance|✅/🟡|P0|Paginação/cache/imagens/queries|
|60|Escalabilidade|🟡|P0|Separar Sheets do caminho crítico progressivamente|
|61|SEO|🟡|P1|Templates indexáveis|
|62|URLs amigáveis|🔴/🟡|P2|Rotas canônicas progressivas|
|63|Compartilhamento|🟡|P1|Web Share + links públicos|
|64|Landing pages|🟡|P1|Arquitetos/fornecedores/prestadores/marcas|
|65|Blog/conteúdo|🔴/🟡|P2|Editorial estruturado|
|66|Tendências|🟡|P2|Derivar de dados reais|
|67|Eventos|🔴|P3|Módulo futuro|
|68|Networking|🟡|P1|Sugestões por contexto|
|69|Convites|🟡|P1|Finalizar convites entre perfis|
|70|Programa de indicação|🔴|P3|Estrutura futura|
|71|Badges|🟡|P1|Catálogo de badges confiáveis|
|72|Gamificação discreta|🟡|P2|Missões de qualidade|
|73|Central de ajuda|✅/🟡|P1|Unificar FAQ/guias/suporte|
|74|Feedback do usuário|🔴/🟡|P1|Canal estruturado|
|75|Primeiro acesso|🟡|P0|Checklist por papel|
|76|CTAs padronizados|🟡|P0|Vocabulário único|
|77|Evitar páginas sem propósito|🟡|P0|Consolidar legadas|
|78|Empty states|✅/🟡|P1|Ação contextual|
|79|Social proof|🟡|P1|Somente dados reais|
|80|Cases|🔴|P2|Modelo editorial|
|81|Métrica principal|🟡|P0|North-star e eventos|
|82|Retenção|🟡|P0|Loops semanais|
|83|E-mails transacionais|🟡|P1|Padronizar templates/eventos|
|84|WhatsApp estratégico|✅/🟡|P1|Rastrear antes de sair|
|85|Mobile excelente|✅/🟡|P0|Continuar matriz de dispositivos|
|86|PWA|✅/🟡|P1|Instalação + push futuro|
|87|Futuro app|🟡|P2|APIs/componentes desacoplados|
|88|Diferencial estratégico|🟡|P0|Projeto como grafo central|
|89|Ciclo completo|🟡|P0|Fechar lacunas da jornada|
|90|Efeito de rede|🟡|P1|Recomendação baseada em atividade real|
|91|Perfil público/privado|🟡|P0|Controles de visibilidade|
|92|Projetos privados|🟡|P0|Privado por padrão|
|93|Times|🔴/🟡|P1|Membros por empresa|
|94|Permissões por cargo|🟡|P0|RBAC granular|
|95|Multiempresa|🔴|P2|Preparar modelo|
|96|Monitoramento|✅/🟡|P0|Web Vitals + erros/API|
|97|Qualidade de dados|🟡|P0|Taxonomias canônicas|
|98|Evitar duplicidade|🟡|P0|Deduplicação antes de gravar|
|99|Importação em massa|🟡|P1|Produtos/dados|
|100|Exportação|🟡|P1|CSV/PDF/XLSX onde útil|
|101|Página Explorar|✅/🟡|P1|Centro de descoberta multi-entidade|
|102|Mapa|🔴|P3|Futuro com geocodificação|
|103|Comparador|✅/🟡|P1|Expandir atributos|
|104|Vistos recentemente|🔴/🟡|P2|Implementar local + servidor opcional|
|105|Produtos relacionados|🟡|P1|Complementares por categoria|
|106|Cross-sell|🟡|P2|Somente contextual|
|107|Fornecedores alternativos|🟡|P1|Integrar ao produto/projeto|
|108|Disponibilidade|🟡|P1|Campo padronizado|
|109|Região de atendimento|🟡|P0|Estados/cidades/raio|
|110|Logística|🟡|P1|Frete/retirada/prazo|
|111|API futura|🟡|P0|Contratos estáveis|
|112|Webhooks|🔴|P2|Eventos de domínio|
|113|Documentação|🟡|P0|Documentar rotas/APIs/permissões|
|114|Testes críticos|🟡|P0|Smoke/E2E progressivo|
|115|Experiência de erro|✅/🟡|P0|Padronizar motivo/próxima ação|
|116|Recuperação|🟡|P0|Retry + drafts|
|117|Autosave|🔴/🟡|P1|Formulários longos|
|118|Rascunhos|🔴/🟡|P1|Projeto/post/produto/proposta|
|119|Status padronizados|🟡|P0|Vocabulário canônico|
|120|Timeline|🟡|P0|Central no projeto|
|121|Roadmap P0–P3|✅|P0|Este documento|
|122|Não implementar aleatoriamente|✅|P0|Auditoria antes do código|
|123|Entregas incrementais|✅|P0|6.0 base → fluxos → inteligência → crescimento|
|124|Objetivo de negócio|✅|P0|Cada módulo ligado a métrica|
|125|Regra de simplicidade|✅|P0|Evitar feature creep|
|126|Regra de qualidade|✅|P0|Completar antes de expandir|
|127|Missão final / sistema operacional do relacionamento|🟡|P0|Objetivo da linha 6.x|

## P0 — execução imediata 6.0
1. Projeto como hub canônico com navegação por contexto.
2. Status e timeline padronizados.
3. Matching explicável e acionável.
4. Cotação/comparação com ações completas.
5. Pipeline único de oportunidades/negócios.
6. Resiliência: retry, draft local, autosave seguro e monitoramento de falhas.
7. Segurança de contexto: projeto privado por padrão e controles de acesso no frontend + backend.
8. Padronização de CTAs/empty states/erros.
9. Documentação de rotas, ações API e eventos.
10. Testes estáticos e smoke tests dos fluxos críticos.

## P1 — alta prioridade após P0
Marketplace contextual, showroom completo, perfis profissionais, onboarding/completude, notificações/preferências, reputação/verificação, analytics temporal, importação em massa, compartilhamento, networking e biblioteca técnica avançada.

## P2
Planos, patrocínios claramente identificados, URLs amigáveis progressivas, conteúdo/editorial, tendências, app-ready APIs, webhooks, recentes/cross-sell e cases.

## P3
Eventos, programa de indicação e mapa geográfico avançado.

## Métricas norteadoras
- Projeto ativo semanal
- Solicitações enviadas por projeto
- Propostas válidas por solicitação
- Tempo mediano até primeira resposta
- Taxa solicitação → proposta
- Taxa proposta → negociação
- Taxa negociação → fechamento
- Negócios fechados e comissão gerada
- Retenção semanal por papel
- Perfis completos/verificados
- Produtos com documentação técnica completa

## Regra de release
Nenhum módulo é marcado como concluído sem: função utilizável, estado vazio, erro/retry, responsividade, permissões, telemetria mínima e compatibilidade com dados existentes.
