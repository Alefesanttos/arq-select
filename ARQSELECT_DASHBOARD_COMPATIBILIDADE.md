# ARQSELECT — Correção do Dashboard

O ADMIN agora tenta `dashboard_v4` e, se a implantação do Web App ainda estiver em uma versão anterior que não reconhece essa ação, faz fallback automático para `dashboard`.

Isso evita o erro `Ação não encontrada.` enquanto mantém compatibilidade com o backend legado.
