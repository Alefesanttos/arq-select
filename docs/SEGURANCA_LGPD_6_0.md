# ARQSELECT 6.0 — Segurança, privacidade e LGPD

## P0
- Projeto privado por padrão.
- Autorização validada no servidor para toda leitura/escrita privada.
- Separação entre perfil público e dados internos.
- Sessões expiradas devem retornar erro autenticável, nunca dados parciais.
- Upload: validar extensão, MIME, tamanho, propriedade e nome seguro.
- Sanitização de conteúdo renderizado.
- Rate limit em login, cadastro, mensagens, propostas e uploads.
- Logs de auditoria para alteração de status, aprovação, moderação, plano, verificação e fechamento.

## Direitos do titular
Fluxos previstos: consentimento, política/termos, exportação, correção e exclusão. Exclusão deve respeitar retenções legais/financeiras e anonimizar histórico quando necessário.

## RBAC
ADMIN: administração global.
ARQUITETO: seus projetos e entidades compartilhadas.
FORNECEDOR: oportunidades/propostas/produtos da empresa.
PRESTADOR: oportunidades/propostas/execuções próprias.
CLIENTE: apenas itens explicitamente compartilhados.

Nunca confiar apenas no papel armazenado no localStorage; o backend é a autoridade.
