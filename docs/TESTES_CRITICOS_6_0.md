# ARQSELECT 6.0 — Plano de testes críticos

## Smoke obrigatório
1. Login Arquiteto/Fornecedor/Prestador.
2. Cadastro por papel.
3. Criar projeto e abrir Hub.
4. Autosave/restauração do projeto.
5. Adicionar produto/especificação.
6. Matching e convite de fornecedor.
7. Criar oportunidade de serviço.
8. Solicitar orçamento.
9. Fornecedor/prestador enviar proposta.
10. Comparar proposta.
11. Solicitar revisão / recusar / aceitar.
12. Abrir chat contextual.
13. Emitir pedido/execução sem duplicidade.
14. Favoritos/moodboard.
15. Upload/download técnico.
16. Avaliação elegível.
17. Tema claro/escuro.
18. Mobile 320/375/390/430/768.
19. Offline/reconexão.
20. 403/404/500.

## Segurança
- Token ausente/inválido.
- Usuário A não acessa projeto do usuário B.
- Prestador não acessa proposta de outro prestador.
- Endpoint público não vaza dados privados.
- XSS em texto, nome, comentário e URL.
- Upload inválido/maior que limite.
- Repetição de clique em aceitar não duplica fechamento.

## Qualidade de release
JS parseável, CSS balanceado, referências locais válidas, viewport presente, sem IDs duplicados críticos, Lighthouse CI sem regressão grave e todas as rotas P0 abrindo.
