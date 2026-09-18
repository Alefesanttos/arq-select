ARQSELECT 5.6.1 — PREMIUM UX + SOCIAL FEED
Build: 2026-09-17.561-PREMIUM-SOCIAL

OBJETIVO
Elevar a ARQSELECT 5.6 para uma experiência premium, tecnológica e consistente em modo claro/escuro, fortalecer a identidade visual e transformar o Feed em uma rede profissional voltada a arquitetura, especificação, materiais, fornecedores, projetos e oportunidades.

PRINCIPAIS EVOLUÇÕES
1. Tema claro/escuro endurecido globalmente
- Camada de tokens de contraste para superfícies, cards, formulários, tabelas, modais, chats, headers e sidebars.
- Tratamento específico de áreas com fotografia/hero e elementos de interface escuros.
- Estados hover/focus/active mais claros e acessíveis.
- Preferência de movimento reduzido respeitada.

2. Visual Premium Tech
- Header com efeito glass/blur.
- Elevações e profundidade em cards.
- Glow dourado discreto e gradientes tecnológicos.
- Reveal de conteúdo por viewport.
- Progress indicator de rolagem.
- Microinterações/ripple em botões.
- Motion suave e responsivo.

3. Feed Profissional ARQSELECT
- Timeline em 3 colunas no desktop.
- Tipos de publicação: Projeto, Material, Lançamento, Inspiração, Oportunidade e Atualização.
- Publicação com texto, imagem, link e projeto relacionado.
- Upload de imagem JPG/PNG/WebP de até 6 MB.
- Reações: Curtir, Inspirou e Salvar.
- Comentários e threads.
- Compartilhamento via Web Share API ou área de transferência.
- Solicitação de conexão profissional diretamente pelo post.
- Filtros por tipo de conteúdo.
- Assuntos em alta / tendências.
- Painel de valores e boas práticas ARQSELECT.
- Denúncia e moderação de conteúdo.
- Moderação administrativa de comentários e denúncias.

4. Identidade / Ícone do site
- icon-master.svg como favicon moderno.
- favicon.ico como fallback universal.
- icon-192.png / icon-512.png para PWA.
- Apple touch icon.
- Aplicado em todas as 178 páginas HTML.

5. PWA e cache
- Cache atualizado para a versão 5.6.1.
- Nova camada premium incluída no cache estático.
- Atalho do Feed renomeado para “Feed profissional”.

6. Analytics e segurança social
- Eventos de publicação integrados ao Analytics.
- Upload validado por MIME/type, tamanho e sessão.
- Denúncia não permitida para o próprio post.
- Evita denúncia duplicada em aberto.
- Atualizações de moderação exigem POST e sessão administrativa.

VALIDAÇÃO
- 178 páginas HTML analisadas.
- 2.838 links HTML internos verificados: 0 destinos ausentes.
- 178/178 páginas com arq-config.js.
- 178/178 páginas com arq-premium-tech.css.
- 178/178 páginas com arq-premium-tech.js.
- 178/178 páginas com favicon SVG e favicon.ico.
- Todos os arquivos JavaScript principais passaram em validação de sintaxe.
- Todos os arquivos .gs passaram na validação de sintaxe JavaScript compatível.
- manifest.webmanifest e appsscript.json são JSON válidos.

CONTRASTE DOS TOKENS PRINCIPAIS (WCAG)
Modo claro:
- Texto principal sobre superfície: 16,72:1
- Texto secundário sobre superfície: 7,11:1
- Destaque/foco sobre superfície: 6,94:1
Modo escuro:
- Texto principal sobre superfície: 15,46:1
- Texto secundário sobre superfície: 9,98:1
- Destaque/foco sobre superfície: 9,78:1
Interface escura:
- Texto de header: 16,65:1
- Texto escuro em botão dourado: 6,69:1
Todos os pares acima excedem o mínimo AA de 4,5:1 para texto normal.

OBSERVAÇÃO DE QA
A validação foi feita contra o projeto completo, HTML/CSS/JS renderizado estaticamente e os arquivos do backend. O ambiente de execução bloqueou navegação automatizada direta no domínio/localhost; por isso, após publicar a versão, recomenda-se um smoke test visual autenticado no domínio real para estados dependentes de dados, imagens externas e conteúdo criado por usuários.

PUBLICAÇÃO
GITHUB PAGES
- Substitua o conteúdo pelo pacote ARQSELECT_5_6_1_GITHUB.zip preservando a estrutura de pastas.
- Não remova CNAME.

GOOGLE APPS SCRIPT
- Atualize Code.gs, ARQSELECT3.gs, ARQSELECT4.gs, ARQSELECT6.gs e appsscript.json com o pacote ARQSELECT_5_6_1_APPS_SCRIPT.zip.
- Publique uma nova versão do Web App mantendo a mesma URL /exec usada pelo site.

IMPORTANTE
Esta versão é incremental. Não renomeia as planilhas existentes e mantém compatibilidade com a arquitetura 5.6.
