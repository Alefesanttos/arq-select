# ARQSELECT 6.0 — Arquitetura funcional

## Princípios
1. Projeto é o aggregate central.
2. Perfis são papéis com permissões, não versões separadas do produto.
3. Recursos transversais vivem em camadas compartilhadas.
4. URLs antigas continuam válidas até migração controlada.
5. Toda ação de negócio deve ser idempotente quando aplicável.
6. Dados privados nunca são inferidos como públicos.

## Camadas frontend
- arq-config.js: configuração e boot.
- arq-design-system.css: tokens/componentes/responsividade.
- arq-experience.js: experiência global/acessibilidade.
- arq-ecosystem-6.js: status, drafts, recentes, share, retry, offline.
- arqselect-6.js: API e utilidades de portal.
- arq-workspace-6.js: autenticação/contexto de projeto.
- arq-workspace-app-6.js: módulos do workspace.
- arq-services.js: ecossistema de prestadores.
- arq-intelligence.js: descoberta inteligente.
- arq-business.js: métricas de negócio.

## Aggregate Projeto
O Hub canônico é projeto.html?projectId=<id>. Áreas:
Visão geral, Produtos, Fornecedores, Prestadores, Orçamentos, Arquivos, Chat, Timeline, Favoritos e Equipe.

## Fronteiras
- Marketplace: descoberta e intenção.
- Projeto: contexto e decisão.
- Oportunidade: demanda acionável.
- Proposta: negociação.
- Pedido/Execução: fechamento e entrega.
- Relacionamento: chat, timeline, reputação.
- Analytics: leitura derivada, nunca fonte de verdade.

## Evolução de backend
Apps Script continua compatível, porém novos módulos devem ser adicionados por roteadores incrementais, sem renomear ações existentes. Sheets devem ser tratados como persistência transitória; caminhos de alta leitura devem migrar progressivamente para armazenamento indexado quando o volume exigir.
