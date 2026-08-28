# ARQSELECT — Correção de Integração CRM

## O que foi corrigido
- O ADMIN V4 agora sincroniza as bases legadas para `ARQSELECT - USUARIOS`.
- Usuários antigos de `ACESSOS_ARQUITETOS`, `ACESSOS_FORNECEDORES`, `ARQSELECT – FORNECEDORES`, `FORNECEDORES` e `CRM - ARQUITETOS` passam a aparecer no CRM.
- Projetos continuam sendo lidos diretamente da aba `PROJETOS`, preservando os registros existentes.
- `admin.html` e `admin-v4.html` foram alinhados para a mesma versão.
- Adicionado diagnóstico de conexão no botão **Diagnóstico**.
- Melhor tratamento de erros de comunicação no ADMIN.
- Navegação passa a carregar os dados ao entrar em cada módulo.

## Instalação
1. Substitua o conteúdo do `Code.gs` pelo arquivo deste pacote.
2. Salve o projeto no Apps Script.
3. Faça uma nova implantação do Web App usando a mesma URL `/exec` configurada no site.
4. Publique/substitua `admin.html` no GitHub Pages.
5. Entre no ADMIN e clique em **Sincronizar base**.
6. Clique em **Diagnóstico** para confirmar a planilha, abas e quantidade de registros vistos pelo Web App.

A sincronização não apaga as abas antigas e não cria notificações em massa para usuários antigos. Novos cadastros continuam gerando notificação.
