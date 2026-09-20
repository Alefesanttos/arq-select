# ARQSELECT 6.2 — Weekly Value

## Objetivo
Fechar os motivos de retorno semanal do P1 sem criar sistemas paralelos.

## Módulos
- conexoes.html + arq-network.js
- onboarding-arquiteto.html / onboarding-fornecedor.html + arq-onboarding.js
- descobrir.html + arq-intelligence.js
- arq-profile-6.js nos perfis públicos
- notificacoes.html + arq-notifications.js
- agenda.html + arq-agenda.js
- importar-catalogo.html + arq-catalog-import.js
- exportacoes.html + arq-exports.js
- admin-moderacao.html + arq-moderation.js
- landings para arquitetos, fornecedores, prestadores e marcas

## Novas ações ARQSELECT10
- portal_conexoes_rede
- portal_conexao_acao
- portal_recomendacoes_rede
- portal_onboarding_get
- portal_onboarding_salvar
- public_descoberta_avancada
- public_perfil_profissional
- public_reputacao
- public_feed_personalizado
- portal_notificacoes_unificadas
- portal_notificacao_acao
- portal_agenda_unificada
- portal_agenda_salvar
- portal_agenda_status
- portal_catalogo_importar_lote
- portal_catalogo_importacoes
- portal_exportacao_gerar
- portal_exportacoes_historico
- admin_moderacao_fila
- admin_moderacao_acao
- portal_download_tecnico_registrar
- public_fornecedores_alternativos
- portal_analytics_fornecedor_v2

## Reputação
Score multidimensional usa apenas sinais disponíveis: avaliação elegível, verificação, completude, tempo de resposta e histórico de negócios. Nunca substitui decisão do usuário.

## Notificações
Preferências por evento/canal/frequência continuam na Central de Conta. A central 6.2 agrega e marca leitura sem gerar notificações excessivas.

## Importação
CSV recebe prévia. Excel/PDF são preservados como lote e entram em processamento/curadoria. Nenhum parser inventa produto sem revisão.

## Compatibilidade
ARQSELECT10 é incremental e deve retornar null para ações desconhecidas, permitindo fallback para ARQSELECT9/8/7 e camadas anteriores.
