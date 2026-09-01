# ARQSELECT 2.0

Evolução baseada nos arquivos enviados: frontend atual + Code.gs atual. O pacote preserva as páginas públicas existentes e adiciona a camada 2.0.

## Setup rápido
1. Substitua o Code.gs no Apps Script.
2. Execute `ARQSELECT_2_0_SETUP()`.
3. Execute `v2SetupAdmin("seu_usuario","sua_senha_segura")`.
4. Publique o Web App e use a URL `/exec`.
5. Se a URL mudar, defina `localStorage.setItem("ARQSELECT_API_URL","SUA_URL")` no domínio do frontend.
6. Publique no GitHub Pages mantendo CNAME.

## Segurança
A senha não fica embutida no código; o hash do administrador fica em Script Properties.


## Compatibilidade do Admin
`admin.html` original foi preservado. O novo painel 2.0 está em `admin-v2.html`, usando a API 2.0.
