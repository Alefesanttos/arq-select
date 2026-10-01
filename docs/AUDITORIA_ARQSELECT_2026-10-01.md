# Auditoria ARQSELECT — 2026-10-01

## Escopo e método

Auditoria estrutural do repositório de produção da ARQSELECT, cobrindo navegação, páginas, módulos, JavaScript, CSS, autenticação, integrações do CRM e arquitetura do Apps Script disponível no histórico do projeto.

**Inventário atual do repositório:** 225 arquivos HTML, 66 arquivos JavaScript e 14 arquivos CSS.

A auditoria incluiu:
- inventário completo de páginas;
- leitura dos principais fluxos e módulos;
- validação estática de sintaxe dos 66 arquivos JavaScript;
- análise da arquitetura de autenticação e sessão;
- análise dos roteadores e módulos do Google Apps Script disponíveis no projeto/histórico;
- revisão de páginas duplicadas/legadas;
- revisão de estados de usuário e filtros públicos;
- revisão do fluxo de redirecionamento de páginas intermediárias;
- implementação no frontend da área de usuários desativados/excluídos;
- criação de patch de backend para exclusão reversível.

**Limitação importante:** não houve browser automatizado conectado nesta execução. O dispositivo remoto disponível estava offline e o domínio não ficou acessível pela ferramenta HTTP de auditoria. Portanto, fluxos que exigem cliques, envio de formulários, uploads reais, sessão autenticada e persistência em produção permanecem marcados como **NÃO TESTADOS PONTA A PONTA** até execução em navegador real.

---

# 1. Mapeamento do site

## 1.1 Área pública / descoberta / marketing

- index.html
- explorar.html
- fornecedores.html
- prestadores.html
- fornecedor.html
- arquiteto.html
- prestador.html
- ranking.html
- comparar.html
- produto.html
- mapa.html
- descobrir.html
- networking.html
- em-alta.html
- feed.html
- blog.html
- cases.html
- eventos.html
- para-arquitetos.html
- para-fornecedores.html
- para-prestadores.html
- para-marcas.html
- planos.html
- biblioteca-tecnica.html
- avaliacoes.html
- assistente.html
- recentes.html
- onboarding.html
- suporte.html
- status.html
- politica-privacidade.html
- termos-arqselect.html
- marketplace/iluminacao/index.html
- marketplace/marcenaria/index.html
- marketplace/pisos/index.html
- fornecedores/esquadrias/index.html

## 1.2 Autenticação e entrada

- login.html
- ARQSELECT_LOGIN_ARQUITETO.html
- ARQSELECT_LOGIN_FORNECEDOR.html
- ARQSELECT_LOGIN_PRESTADOR.html

## 1.3 Área do arquiteto

- ARQSELECT_DASHBOARD_ARQUITETO.html
- ARQSELECT_ARQUITETO_GUIA.html
- ARQSELECT_ARQUITETO_PERFIL.html
- ARQSELECT_ARQUITETO_PROJETOS.html
- ARQSELECT_ARQUITETO_SOLICITAR.html
- dashboard-arquiteto.html (redirecionador legado)
- dashboard-arquiteto00.html (redirecionador legado)

## 1.4 Área do fornecedor

- ARQSELECT_DASHBOARD_FORNECEDOR.html
- ARQSELECT_FORNECEDOR_GUIA.html
- ARQSELECT_FORNECEDOR_PERFIL.html
- ARQSELECT_FORNECEDOR_PRODUTOS.html
- ARQSELECT_FORNECEDOR_PROJETOS.html
- ARQSELECT_FORNECEDOR_SOLICITACOES.html
- analytics-fornecedor.html
- dashboard-fornecedor.html (redirecionador legado)
- dashboard-fornecedor0.html (redirecionador legado)

## 1.5 Área do prestador

- dashboard-prestador.html
- crm-prestador.html
- agenda-prestador.html
- portfolio-prestador.html
- prestador-onboarding.html
- oportunidades-servicos.html
- oportunidade-servico.html
- criar-oportunidade-servico.html
- propostas-servicos.html
- execucao-servicos.html

## 1.6 Workspace / colaboração / negócio

- portal.html
- projeto.html
- sala-projeto.html
- solicitacao.html
- solicitacoes-marketplace.html
- solicitar-orcamento.html
- proposta.html
- propostas.html
- propostas-portal.html
- comparar-propostas.html
- pedidos.html
- financeiro.html
- painel-negocios.html
- chat.html
- mensagens.html
- notificacoes.html
- conexoes.html
- favoritos.html
- atividades.html
- calendario.html
- agenda.html
- moodboard.html
- boards.html
- matching.html
- central-oportunidades.html
- oportunidades.html
- clientes-projeto.html
- aprovacao-cliente.html
- especificacoes.html
- amostras.html
- historico-portal.html
- seguranca.html
- configuracoes.html
- organizacao.html
- indicacoes.html
- importar-catalogo.html
- exportar.html

## 1.7 Administração

- admin.html — CRM administrativo canônico
- admin-catalogos.html
- admin-commerce.html
- admin-prestadores.html
- admin-qualidade.html
- admin-servicos.html
- admin-webhooks.html
- configurar-api.html

Arquivos administrativos legados:
- admin-v2.html
- admin-v4.html
- admin00.html

**Correção aplicada:** os três arquivos legados foram convertidos em redirecionadores para `admin.html`, evitando quatro versões independentes do CRM.

## 1.8 Erro, offline e utilitários

- 403.html
- 404.html
- 500.html
- offline.html

## 1.9 Produtos LUX

Existem 106 páginas:
- produto-lux-001.html
- ...
- produto-lux-106.html

São páginas de redirecionamento/canonical para:
`produto.html?id=LUX-XXX`.

Amostras do início, meio e fim da sequência foram conferidas e seguem o mesmo padrão de redirecionamento.

---

# 2. Achados por prioridade

## CRÍTICO

### C1. Exclusão reversível não existia de forma completa no CRM atual

O CRM listava usuários, mas o `admin.html` atual não possuía fluxo completo para:
- excluir sem apagar;
- desativar;
- reativar;
- consultar usuários excluídos.

Além disso, existe uma função genérica de backend chamada `excluirRegistroModulo` que usa `deleteRow()`. Ela não deve ser usada para a gestão de usuários porque destrói fisicamente registros.

### Correção aplicada no frontend

Foi adicionada ao `admin.html`:
- seção **Usuários excluídos**;
- ação **Desativar**;
- ação **Excluir** com confirmação;
- ação **Reativar**;
- filtragem das listas ativas;
- distinção de ATIVO / INATIVO / BLOQUEADO / EXCLUIDO;
- exibição de DATA STATUS e ALTERADO POR quando presentes.

Commit:
`f338b34efe447173e2adaeb5760998ed9e48f0f2`

### Patch de backend criado

Arquivo:
`apps-script/ARQSELECT_ADMIN_USER_STATUS_PATCH.gs`

Ele:
- não usa `deleteRow()`;
- preserva dados e histórico;
- adiciona `DATA STATUS`, `ALTERADO POR` e `MOTIVO STATUS`;
- sincroniza o status com a aba de acesso;
- cria endpoint `admin_usuario_status`;
- cria endpoint `admin_usuarios_excluidos`;
- registra auditoria.

Commit:
`74f2ee17cb72ee4bbddeae1bff3d269ca4a9f511`

**Pendente:** adicionar o arquivo ao projeto Apps Script, integrar o roteador e publicar nova versão do Web App. Sem essa publicação, os botões novos do frontend não conseguem persistir EXCLUIDO no backend.

---

### C2. Alguns caminhos públicos ainda podem exibir usuários que não estejam ATIVOS

No backend auditado:
- o diretório principal de fornecedores já filtra `STATUS=ATIVO` e `STATUS APROVACAO=APROVADO`;
- matching principal também filtra usuários ativos;
- porém algumas rotas auxiliares/mais novas precisam do mesmo filtro.

Pontos que precisam ser alterados antes de considerar exclusão totalmente consistente:
- `publicProfileARQ4`: atualmente não exige explicitamente `STATUS=ATIVO`;
- distribuição de projeto: usa filtro “não BLOQUEADO”, permitindo potencialmente INATIVO;
- recomendações ARQSELECT10;
- mapa ARQSELECT10;
- fornecedores alternativos de produto ARQSELECT10;
- inteligência de perfil ARQSELECT10.

Regra recomendada para qualquer superfície pública:
`STATUS === ATIVO && STATUS APROVACAO === APROVADO`.

---

## ALTO

### A1. Fragmentação de versões do frontend

Foram encontradas referências simultâneas a assets 5.7, 5.10, 6.0, 6.2 e 6.3.1.

Exemplos:
- páginas públicas ainda carregam CSS/JS 5.7;
- prestadores usam 5.10;
- admin usa 6.0/6.3.1;
- módulos de inteligência usam 6.2.

Risco:
- comportamento diferente entre telas;
- cache difícil de invalidar;
- correções aplicadas em um módulo não refletirem em outro;
- inconsistência de componentes e temas.

Recomendação essencial:
criar um único manifesto de release e uma versão central para assets.

---

### A2. Sessões/token armazenados em localStorage

O admin e o portal utilizam tokens no `localStorage`.

Isso facilita navegação entre páginas, porém aumenta impacto de eventual XSS, porque JavaScript executado na origem consegue acessar esses tokens.

Recomendação:
- ADMIN: migrar para `sessionStorage` com TTL curto;
- PORTAL: revisar necessidade de persistência e considerar `sessionStorage` ou camada de sessão mais restrita;
- reforçar CSP e sanitização antes da migração.

---

### A3. Redirecionamento de proposta/solicitação assumia arquiteto quando não havia perfil válido

`proposta.html` e `solicitacao.html` usavam o tipo salvo no navegador e, se ele estivesse ausente, acabavam no fluxo de arquiteto.

Correção aplicada:
- valida token + tipo;
- sem autenticação válida → `login.html`;
- arquiteto → fluxo de arquiteto;
- fornecedor → fluxo de fornecedor;
- prestador → fluxo de serviços.

Commits:
- `6b1b35ef97e71451b8319314a9f01d2ef78cb348`
- `7772c11fcc1f8cedb390b34359fd8ebd61ee0a3c`

---

### A4. Distribuição de projeto precisa excluir fornecedores não ativos

A função de distribuição auditada aceita fornecedor cujo status seja qualquer um diferente de BLOQUEADO.

Deve ser:
- STATUS = ATIVO;
- STATUS APROVACAO = APROVADO.

Isso evita envio de oportunidade a fornecedor INATIVO ou EXCLUIDO.

---

## MÉDIO

### M1. Arquivos administrativos duplicados

Havia quatro páginas completas de CRM:
- admin.html
- admin-v2.html
- admin-v4.html
- admin00.html

Isso aumenta risco de alguém acessar uma versão antiga.

**Corrigido:** as três versões legadas agora redirecionam para a canônica.

Commits:
- `23ca1db5c93e7571f1ef72c2bfbbe41ad4b9689b`
- `ee7e47044fd9fda8a1e2d9df358feccf930d40c6`
- `6b82a7cba7b5713047f515675c1e1cc1e68e8207`

---

### M2. Dashboard administrativo conta registros sem separar ativos/inativos/excluídos

A implementação auditada calcula totais com todos os usuários.

Após implantar EXCLUIDO, o dashboard deve separar:
- ativos;
- pendentes;
- inativos;
- bloqueados;
- excluídos.

Isso evita métricas comerciais infladas.

---

### M3. Acessibilidade de formulários precisa revisão final

A auditoria estática marcou campos que não possuem associação explícita por `for`/ARIA em páginas como:
- ARQSELECT_FORNECEDOR_PRODUTOS.html
- ARQSELECT_FORNECEDOR_SOLICITACOES.html
- chat.html
- descobrir.html
- central-oportunidades.html
- mapa.html
- solicitar-orcamento.html
- prestador-onboarding.html

Alguns componentes usam `label` envolvendo o campo e podem estar semanticamente aceitáveis; por isso a correção deve ser confirmada com teste de teclado/leitor de tela.

---

### M4. CSP é inconsistente

Algumas páginas têm Content-Security-Policy parcial, outras dependem apenas da proteção padrão do navegador.

Recomendação:
criar uma política comum para:
- script-src;
- connect-src;
- img-src;
- frame-ancestors;
- object-src;
- base-uri.

---

### M5. Páginas públicas e páginas de workspace usam stacks de CSS diferentes

O `arq-design-system.css` é robusto e contém dezenas de media queries, foco visível e suporte a `prefers-reduced-motion`, mas nem todas as páginas usam exatamente a mesma pilha de estilos.

Resultado potencial:
- diferenças de espaçamento;
- botões inconsistentes;
- modo claro/escuro com comportamento diferente;
- responsividade diferente entre módulos.

---

## BAIXO

### B1. Títulos genéricos

Algumas páginas intermediárias usam somente “ARQSELECT” como title.

Exemplos:
- projeto.html
- proposta.html
- solicitacao.html
- redirects antigos.

Melhorar títulos ajuda orientação e acessibilidade.

### B2. 106 páginas estáticas de redirecionamento de produto

Funcionam como aliases SEO, mas aumentam manutenção.

No futuro pode-se substituir por:
- rotas amigáveis;
- geração automatizada;
- sitemap dinâmico.

---

# 3. Verificações técnicas

## JavaScript

Todos os **66 arquivos .js** existentes no repositório foram submetidos a validação estática de sintaxe.

Resultado:
**66/66 sem erro sintático detectado.**

Isso não significa que todos os fluxos runtime estão aprovados; apenas que os arquivos analisados são sintaticamente válidos.

## Responsividade

O design system principal possui ampla cobertura responsiva, incluindo múltiplas media queries e `prefers-reduced-motion`.

Páginas centrais:
- index.html;
- fornecedores.html;
- prestadores.html;
- dashboards;
- admin;

possuem viewport configurado.

Teste visual em 390px / tablet / 1366px / 1920px ainda precisa ser executado em navegador real.

## Service Worker

O `sw.js` usa estratégia network-first para navegações e JS/CSS, o que é positivo para evitar frontend preso permanentemente em cache.

Mesmo assim:
- a versão de cache deve acompanhar releases;
- páginas administrativas devem continuar preferindo rede;
- após mudança de backend, validar se asset antigo não é reutilizado.

---

# 4. Fluxos principais

Legenda:
- ✅ APROVADO = executado ponta a ponta;
- ❌ REPROVADO = executado e falhou;
- ⚠️ PARCIAL = arquitetura/código confirmado, sem teste runtime completo;
- ⏸ NÃO TESTADO = requer sessão/browser/dado real.

| Fluxo | Status | Evidência / observação |
|---|---|---|
| Cadastro de arquiteto | ⚠️ PARCIAL | Tela + rotas + backend de cadastro existem; persistência não foi testada nesta execução |
| Login arquiteto | ⚠️ PARCIAL | Fluxo e sessão existem; login real não executado nesta auditoria |
| Cadastro fornecedor | ⚠️ PARCIAL | Tela + rotas + backend existem |
| Login fornecedor | ⚠️ PARCIAL | Fluxo e sessão existem |
| Cadastro prestador | ⚠️ PARCIAL | `cadastrar_prestador` e UI existem |
| Login prestador | ⚠️ PARCIAL | `login_prestador` e UI existem |
| Recuperação de senha | ⚠️ PARCIAL | Backend possui rotina de redefinição; envio/link não foi testado ponta a ponta |
| Logout | ⚠️ PARCIAL | Rotinas de logout e invalidação de sessão existem |
| Criar/editar projeto | ⚠️ PARCIAL | APIs e interfaces existem; persistência runtime não testada |
| Busca fornecedor/produto/prestador | ⚠️ PARCIAL | Busca, matching e diretórios existem |
| Solicitar orçamento | ⚠️ PARCIAL | RFQ/solicitação implementados |
| Enviar proposta | ⚠️ PARCIAL | Rotas de proposta implementadas |
| Aceitar/recusar proposta | ⚠️ PARCIAL | Ações de proposta existem no workspace |
| Favoritos | ⚠️ PARCIAL | API e frontend existem |
| Conexões | ⚠️ PARCIAL | API e página existem |
| Notificações | ⚠️ PARCIAL | APIs de listar/marcar como lida existem |
| Chat | ⚠️ PARCIAL | criação de conversa, listar e enviar existem |
| Anexos/imagens | ⚠️ PARCIAL | módulos de anexo/upload existem |
| CRM admin / login | ✅ APROVADO pelo usuário | O login administrativo foi corrigido e confirmado funcionando pelo proprietário durante esta sessão |
| Funções administrativas internas | ⏸ NÃO TESTADO | Exigem sessão de navegador conectada |
| Comissão e fechamento | ⚠️ PARCIAL | endpoints comerciais e comissão existem; fechamento real não foi executado |
| Exclusão reversível | ⏸ PENDENTE DE DEPLOY BACKEND | UI implementada e patch backend preparado; ainda requer publicação no Apps Script |

---

# 5. Melhorias essenciais

1. **Implantar o backend de exclusão reversível.**
   Benefício: controle seguro sem perda de histórico.

2. **Aplicar filtro ATIVO+APROVADO em todas as superfícies públicas e comerciais.**
   Benefício: excluídos/inativos desaparecem de busca, mapa, matching e oportunidades.

3. **Unificar versão de release dos assets.**
   Benefício: reduz regressões e inconsistência de cache.

4. **Criar matriz de permissões por perfil.**
   ADMIN / ARQUITETO / FORNECEDOR / PRESTADOR / CLIENTE.
   Benefício: segurança e previsibilidade.

5. **Criar testes E2E mínimos.**
   Login → projeto → RFQ → proposta → aceite → negócio.
   Benefício: impede regressões silenciosas.

6. **Fortalecer sessão e CSP.**
   Benefício: reduz risco de sequestro de token.

7. **Separar claramente status administrativo de aprovação.**
   Exemplo:
   - STATUS ACESSO: ATIVO / INATIVO / BLOQUEADO / EXCLUIDO
   - STATUS APROVAÇÃO: PENDENTE / APROVADO / RECUSADO
   Benefício: elimina ambiguidade.

---

# 6. Melhorias opcionais de alto valor

- checklist de onboarding por perfil;
- percentual de completude do perfil;
- selo verificado com critérios claros;
- SLA médio de resposta de fornecedor;
- comparação de propostas lado a lado;
- timeline de projeto;
- histórico completo de ações;
- alertas de projeto parado;
- fornecedores sugeridos por região/especialidade;
- alertas de cadastro duplicado por CNPJ/e-mail/telefone;
- central de suporte com SLA;
- painel de qualidade de dados;
- relatórios de conversão por fornecedor e arquiteto;
- notificações configuráveis;
- auditoria de login e alterações administrativas.

---

# 7. Gestão de usuários excluídos — implantação final necessária

## Frontend
Já está publicado no repositório.

## Backend
Copiar para o Apps Script:
`apps-script/ARQSELECT_ADMIN_USER_STATUS_PATCH.gs`

Depois integrar ao `Code.gs`:

### GET
```javascript
var respostaUsuariosAdmin = rotearAdminUsuariosExcluidosARQSELECT(acao, dados, "GET");
if (respostaUsuariosAdmin) return respostaUsuariosAdmin;
```

### POST
```javascript
var respostaUsuariosAdmin = rotearAdminUsuariosExcluidosARQSELECT(acao, dados, "POST");
if (respostaUsuariosAdmin) return respostaUsuariosAdmin;
```

Executar uma vez:
`instalarGestaoUsuariosExcluidosARQSELECT`

Depois:
**Implantar → Gerenciar implantações → Editar → Nova versão → Implantar**

## Ajustes obrigatórios adicionais no backend

Onde existir filtro de usuário público, usar:
```javascript
STATUS === "ATIVO" && STATUS_APROVACAO === "APROVADO"
```

No login/sessão:
considerar `EXCLUIDO` como acesso indisponível.

Na distribuição de projeto:
fornecedor precisa ser `ATIVO` e `APROVADO`.

---

# 8. Critério para próxima rodada

Depois do deploy do patch do Apps Script, executar em navegador real:

1. excluir fornecedor;
2. atualizar a página;
3. confirmar sumiço da lista ativa;
4. abrir fornecedores públicos e confirmar sumiço;
5. conferir “Usuários excluídos”;
6. tentar login do excluído;
7. tentar matching/busca;
8. reativar;
9. atualizar página;
10. confirmar retorno às listas;
11. confirmar login;
12. confirmar histórico e data/responsável.

Somente depois desses 12 passos a funcionalidade deve ser marcada como **APROVADA**.
