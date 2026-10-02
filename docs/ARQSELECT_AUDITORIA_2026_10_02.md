# Auditoria visual e funcional — ARQSELECT

Data: 02/10/2026. Base: `f2505b156ba74f4e126408ff8b0d604358c80c7f`.

## Correções

- Faixa com 24 arquivos vetoriais de logos, em cores, servidos localmente. Removidos os símbolos monocromáticos da faixa e as artes promocionais usadas na seção de referências. Fontes em `assets/brands/color/SOURCES.md`.
- Loop horizontal a 42 px/s; pausa explícita, arraste/toque, teclas direcionais, pausa por foco e respeito a movimento reduzido. A faixa participa da rolagem normal e não cobre o cabeçalho.
- Proporções e margens dos logos equilibradas sem modificar seus caminhos vetoriais ou cores. Indicação discreta 99+ preservada e aviso de referências sem alegação de parceria.
- Tema inicial aplicado antes das folhas de estilo nas páginas que já possuíam bootstrap; preferência salva, sincronização entre abas e acompanhamento do Sistema. Correção do fallback quando o armazenamento está indisponível ou contém um valor inválido.
- Superfícies claras da home, contraste de botões dourados, cartões sobre fotografias, menu, rodapé, tipografia e espaçamento. Evitada a correção automática incorreta de texto sobre gradientes e fotografias.
- Seletor de tema com setas e retorno de foco. Menu fecha por Escape e clique externo; janela de acesso devolve o foco ao botão que a abriu.
- Links de categorias abrem filtros correspondentes no catálogo. WhatsApp e ferramentas rápidas ficam acima da navegação móvel; utilitários não cobrem a janela de acesso.
- Tratamento de falhas de conexão nas telas identificadas pela varredura (perfis, projetos, solicitações, conexões e ranking). Consultas de sessão desnecessárias não são disparadas durante redirecionamento de usuário deslogado.
- Atualização das versões de recursos compartilhados e do cache do service worker.

## Evidências e alcance

- Inspeção estática de 221 documentos HTML: nenhum destino local ausente nos atributos de links, imagens, scripts e folhas de estilo.
- `node tests/core-smoke.mjs`: aprovado.
- `node tests/source-audit.cjs`: 295 arquivos JavaScript e blocos inline validados sem erro sintático.
- Varredura em Chromium de 107 entradas HTML não redirecionadas por meta refresh, em 390 px e 1440 px (214 carregamentos). Páginas protegidas conduziram ao login; 55 rotas finais distintas foram observadas.
- Sem estouro horizontal de página ou imagens locais quebradas nas telas acessíveis. A API de tema alternou Claro/Escuro e os fundos mudaram em todos os carregamentos concluídos.
- A varredura encontrou uma falha residual no perfil do arquiteto; ela foi corrigida. O reteste específico em 390/1440 px passou sem erros de JavaScript, imagens quebradas ou estouro horizontal.
- Home testada em 320, 390, 768, 1440 e 1920 px. Capturas e inspeção visual em 390/1440 px nos temas Claro/Escuro.
- 39 verificações automatizadas da home aprovadas, sem erros de JavaScript. Testes de interação: animação, pausa, teclado, arraste e toque; redução de movimento; persistência e sincronização de tema; Sistema reagindo ao dispositivo; abertura/fechamento do menu e janela de acesso; navegação para categoria no catálogo.
- Consultas reais, somente de leitura, ao Apps Script: `portal_produtos`, `arq4_public_reviews` e `arq4_public_home_config` retornaram `sucesso: true`.

## Limitações

Os testes de navegador usam servidor local e bloqueiam requisições externas para testar também indisponibilidade, sem criar registros reais. As consultas públicas acima foram testadas separadamente contra o serviço real.

Não havia credenciais de teste de arquiteto, fornecedor, prestador ou administrador. Portanto, criação/envio real de projetos, propostas, mensagens, aceite, comissão, exclusão e reativação de usuários não foram executados. Os redirecionamentos de login não equivalem a testes dos painéis autenticados.

O código do Apps Script implantado não está neste repositório; não foi alterado. A revisão de celular foi por emulação de dimensões/toque em Chromium, não por aparelho físico ou Safari/iOS. Nenhum banco de dados foi apagado ou migrado.

## Reproduzir

Com um servidor estático na porta 8765 e Playwright/Chromium disponíveis:

```sh
node tests/core-smoke.mjs
node tests/source-audit.cjs
node tests/visual-audit.cjs
```

`ARQ_AUDIT_URL` permite outro servidor; `ARQ_CHROME` permite indicar o executável do Chromium; `ARQ_AUDIT_OUTPUT` seleciona a pasta temporária de resultados/capturas; `ARQ_AUDIT_PAGES` limita um reteste a nomes de arquivos separados por vírgula. O relatório de execução distingue as rotas acessíveis dos redirecionamentos de autenticação.

## Arquivos alterados

Além dos arquivos de estilo, comportamento e logos abaixo, os HTMLs receberam a versão atual do tema compartilhado para evitar recursos antigos em cache.

- `.github/workflows/core-smoke.yml`
- `403.html`
- `404.html`
- `500.html`
- `ARQSELECT_ARQUITETO_GUIA.html`
- `ARQSELECT_ARQUITETO_PERFIL.html`
- `ARQSELECT_ARQUITETO_PROJETOS.html`
- `ARQSELECT_ARQUITETO_SOLICITAR.html`
- `ARQSELECT_DASHBOARD_ARQUITETO.html`
- `ARQSELECT_DASHBOARD_FORNECEDOR.html`
- `ARQSELECT_FORNECEDOR_GUIA.html`
- `ARQSELECT_FORNECEDOR_PERFIL.html`
- `ARQSELECT_FORNECEDOR_PRODUTOS.html`
- `ARQSELECT_FORNECEDOR_PROJETOS.html`
- `ARQSELECT_FORNECEDOR_SOLICITACOES.html`
- `ARQSELECT_LOGIN_ARQUITETO.html`
- `ARQSELECT_LOGIN_FORNECEDOR.html`
- `ARQSELECT_LOGIN_PRESTADOR.html`
- `admin-catalogos.html`
- `admin-commerce.html`
- `admin-prestadores.html`
- `admin-qualidade.html`
- `admin-servicos.html`
- `admin-webhooks.html`
- `admin.html`
- `agenda-prestador.html`
- `agenda.html`
- `amostras.html`
- `analytics-fornecedor.html`
- `aprovacao-cliente.html`
- `arq-config.js`
- `arq-design-system.css`
- `arq-experience.js`
- `arquiteto.html`
- `arquitetos.html`
- `assets/brands/color/SOURCES.md`
- `assets/brands/color/abb.svg`
- `assets/brands/color/asian-paints.svg`
- `assets/brands/color/bosch.svg`
- `assets/brands/color/carrier.svg`
- `assets/brands/color/daikin-1.svg`
- `assets/brands/color/dewalt-1.svg`
- `assets/brands/color/dexco.svg`
- `assets/brands/color/docol.svg`
- `assets/brands/color/gerdau.svg`
- `assets/brands/color/grohe.svg`
- `assets/brands/color/havells.svg`
- `assets/brands/color/hilti.svg`
- `assets/brands/color/legrand-1.svg`
- `assets/brands/color/makita-1.svg`
- `assets/brands/color/mitsubishi-electric.svg`
- `assets/brands/color/osram.svg`
- `assets/brands/color/panasonic.svg`
- `assets/brands/color/philips.svg`
- `assets/brands/color/saint-gobain-logo.svg`
- `assets/brands/color/schneider-electric-2007-1.svg`
- `assets/brands/color/siemens.svg`
- `assets/brands/color/stanley.svg`
- `assets/brands/color/stihl.svg`
- `assets/brands/color/tramontina.svg`
- `assistente.html`
- `atividades.html`
- `avaliacoes.html`
- `biblioteca-tecnica.html`
- `blog.html`
- `boards.html`
- `calendario.html`
- `cases.html`
- `central-oportunidades.html`
- `chat.html`
- `clientes-projeto.html`
- `comparar-propostas.html`
- `comparar.html`
- `conexoes.html`
- `configuracoes.html`
- `configurar-api.html`
- `criar-oportunidade-servico.html`
- `crm-prestador.html`
- `dashboard-prestador.html`
- `descobrir.html`
- `em-alta.html`
- `especificacoes.html`
- `eventos.html`
- `execucao-servicos.html`
- `explorar.html`
- `exportar.html`
- `favoritos.html`
- `feed.html`
- `financeiro.html`
- `fornecedor.html`
- `fornecedores.html`
- `historico-portal.html`
- `home-4.js`
- `home-premium-2026.css`
- `home-premium-2026.js`
- `importar-catalogo.html`
- `index.html`
- `indicacoes.html`
- `login.html`
- `mapa.html`
- `matching.html`
- `mensagens.html`
- `moodboard.html`
- `networking.html`
- `notificacoes.html`
- `offline.html`
- `onboarding.html`
- `oportunidade-servico.html`
- `oportunidades-servicos.html`
- `oportunidades.html`
- `organizacao.html`
- `painel-negocios.html`
- `para-arquitetos.html`
- `para-fornecedores.html`
- `para-marcas.html`
- `para-prestadores.html`
- `pedidos.html`
- `planos.html`
- `politica-privacidade.html`
- `portal.html`
- `portfolio-prestador.html`
- `prestador-onboarding.html`
- `prestador.html`
- `prestadores.html`
- `produto.html`
- `proposta.html`
- `propostas-portal.html`
- `propostas-servicos.html`
- `propostas.html`
- `ranking.html`
- `recentes.html`
- `sala-projeto.html`
- `seguranca.html`
- `solicitacao.html`
- `solicitacoes-marketplace.html`
- `solicitar-orcamento.html`
- `status.html`
- `suporte.html`
- `sw.js`
- `termos-arqselect.html`
- `tests/source-audit.cjs`
- `tests/visual-audit.cjs`
