# ARQSELECT 2.0 — GitHub Pages

Esta pasta está pronta para ser enviada **diretamente para a raiz** do repositório GitHub Pages.

## Estrutura

Os arquivos CSS e JS ficam na raiz para combinar com os caminhos relativos usados pelas páginas HTML.

Não mova `global.css`, `dashboard.css`, `forms.css`, `responsive.css` ou os arquivos `.js` para subpastas sem alterar os HTML.

## Publicação

1. Abra o repositório `Alefesanttos/arq-select`.
2. Faça upload de **todos os arquivos desta pasta**, mantendo `CNAME` na raiz.
3. Faça commit.
4. Aguarde o GitHub Pages atualizar.
5. Teste `https://www.arqselect.com.br/dashboard-arquiteto.html`.

## Google Apps Script

O `Code.gs` é backend e deve ser colocado no projeto Google Apps Script, não no GitHub Pages.

Depois de publicar o Web App do Apps Script, confirme a URL configurada em `app.js`. Ela pode ser alterada pelo navegador usando `localStorage` com a chave `ARQSELECT_API_URL`.

## Administrador

Não coloque a senha no GitHub.

No Apps Script execute uma vez, no editor, com sua senha escolhida:

`v2SetupAdmin("SEU_USUARIO", "SUA_SENHA")`

Depois apague/limpe qualquer chamada temporária que contenha a senha e não a publique no código.
