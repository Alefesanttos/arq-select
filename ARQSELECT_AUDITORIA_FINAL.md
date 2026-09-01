# ARQSELECT — Auditoria Integrada Final

Data da build: 2026-08-31
Build backend: 2026.08.31.FULL-AUDIT-02

## Resultado estático

- 39 páginas HTML analisadas.
- 41 blocos JavaScript inline analisados.
- Code.gs validado com Node.js: OK.
- Scripts JavaScript das páginas: 0 falhas de sintaxe.
- Ações identificadas no frontend: 54.
- Ações chamadas pelo frontend sem rota em doGet/doPost: 0.
- Funções duplicadas no Code.gs: 0.
- URL de Web App encontrada nos HTMLs: 1 endpoint consistente.
- Referências locais não encontradas: somente duas strings dinâmicas no arquivo de notificações, não são referências estáticas quebradas.

## Correções principais

1. Compatibilidade central entre params/dados em GET e POST.
2. IDs textuais CONV-/MSG-/PROD-/SOL-/PROP- tratados como texto, nunca como número de coluna.
3. Criação e envio de conversas com participantes autorizados.
4. Chat incremental para evitar reconstrução/pisca da conversa.
5. Distribuição de projeto com registro em PROJETO_FORNECEDORES.
6. Oportunidade comercial criada quando um projeto é direcionado pela ARQSELECT.
7. Conversa e mensagem comercial criadas no envio do projeto.
8. Acesso do fornecedor ao projeto validado por ID e e-mail e pela distribuição.
9. Resposta do fornecedor ao projeto usa a mesma autorização.
10. Portal de notificações com leitura e filtro por usuário.
11. Catálogo de produtos, favoritos, solicitações e propostas com rotas correspondentes.
12. Comissões com aliases de campos e status de negócio fechado compatíveis com o ADMIN.
13. Senhas removidas dos dados JSON usados para CRM/auditoria.
14. Build identificável via backend_health.
15. WhatsApp da plataforma mantido no número +55 19 98165-5013 com ícone visual.

## Compatibilidade preservada

As estruturas existentes de usuários, fornecedores, arquitetos, projetos, produtos, solicitações e propostas foram mantidas. As novas abas são criadas somente quando necessárias.

## Validação ao vivo

Não é possível executar uma gravação/leitura real na conta Google do proprietário a partir deste ambiente. Portanto, a validação de sintaxe, paridade frontend/backend e consistência estrutural foi feita aqui; o comportamento de produção depende da versão publicada do Web App e das permissões da conta Google.

## Publicação

Substituir o Code.gs pelo arquivo desta build, salvar e publicar uma nova versão do Web App. Depois, fazer atualização forçada do site/ADMIN.
