# Instalação

1. Abra o projeto Apps Script que usa a planilha do ARQSELECT.
2. Faça backup do Code.gs atual.
3. Substitua pelo Code.gs deste pacote.
4. Execute `ARQSELECT_2_0_SETUP()`.
5. Execute `v2SetupAdmin("seu_usuario","uma_senha_segura")`.
6. Deploy > New deployment > Web app; execute como você e defina acesso conforme seu uso.
7. Atualize `js/app.js` com a URL /exec se necessário, ou use localStorage para configurá-la.
8. Publique os arquivos do frontend no GitHub Pages.
