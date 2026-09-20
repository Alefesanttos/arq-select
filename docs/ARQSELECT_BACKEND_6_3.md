# ARQSELECT 6.3 — Backend incremental

## Camadas
A ordem de roteamento recomendada é:

ARQSELECT10 → ARQSELECT9 → ARQSELECT8 → ARQSELECT7 → ARQSELECT6 → ARQSELECT4/5/3 → legado.

## ARQSELECT9
Responsável pelo core operacional 6.1:
- projeto/hub/timeline/equipe;
- rascunhos/autosave;
- monitoramento;
- preferências de notificações;
- consentimentos/LGPD/exportação;
- vistos recentemente;
- matching unificado;
- RFQ;
- ações de proposta;
- oportunidades/leads;
- qualidade de dados/auditoria.

## ARQSELECT10
Responsável por 6.2/6.3:
- networking/conexões;
- tendências;
- agenda;
- onboarding;
- inteligência/reputação de perfil;
- conteúdo/cases/eventos;
- planos e destaques transparentes;
- indicações;
- organizações/multiempresa;
- importação/exportação;
- webhooks;
- localização profissional;
- inteligência de produto;
- filtros avançados da busca.

## Compatibilidade
As camadas retornam null quando a ação não pertence a elas. Isso preserva handlers antigos.

## Publicação
Adicionar os arquivos 9/10 ao Apps Script e inserir os dois roteamentos antes do ARQSELECT8 em doGet/doPost. Publicar uma nova versão do Web App mantendo a mesma URL /exec.

## Segurança
Projetos são privados por padrão; edição requer proprietário/Admin/permissão. Webhooks exigem HTTPS. Mapa usa apenas localização profissional pública. Patrocínio não altera score ou reputação.
