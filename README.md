<h1 align="center">Fatec Jacareí- ABP DSM 1º SEMESTRE</h1>

#Portal de Certificação em Metodologias Ágeis
## Sobre o Projeto
### <p align="justify"> O presente projeto surge através do desafio de criar um portal web voltado à certificação interna em metodologias ágeis, no qual o usuário se cadastra e raliza avaliações por níveis de dificuldade.  </p>

### <p align="justify"> O objetivo educacional é integrar, em um único projeto, os conteúdos do semestre: construção de 
páginas com HTML, CSS e JavaScript (sem frameworks), persistência de dados em PostgreSQL (DDL 
e DML), e organização do trabalho por Scrum e práticas ágeis básicas.</p>

## Links
<br>

## SPRINTS

| Sprint | Link        | Início      | Entrega     | Status |
|--------|-------------|-------------|-------------|--------|
| 01     | [Sprint 01]() | 13/04/2026  | 30/04/2026  |  -   |
| 02     | [Sprint 02]() | 04/05/2026  | 21/05/2026  |  -   |
| 03     | [Sprint 03]() | 20/05/2026  | 12/06/2024  |  -   |

<br>

<span id="backlog">

<br>

## :page_with_curl: Product Backlog

### REQUISITOS FUNCIONAIS

| REQUISITO FUNCIONAL_ID | REQUISITOS                                                                                                 | SPRINTS |
|------------------------|------------------------------------------------------------------------------------------------------------|---------|
| RF - 1                 | O sistema deve permitir o cadastro do usuário utilizando CPF (como identificador único), nome completo, e-mail e senha.| #   |
| RF - 2                 | O login no sistema deve ser realizado exclusivamente por meio de CPF e senha.                                         | #   |
| RF - 3                 | Para cada nível, o sistema deve selecionar aleatoriamente 10 questões a partir de um banco com 30 questões daquele nível, respeitando a classificação de dificuldade.    | #   |
| RF - 4                 | As questões de cada nível devem ser classificadas em três graus de dificuldade: fáceis, médias e difíceis.          | #   |
| RF - 5                 |  Cada avaliação de nível apresentada ao usuário deve ser composta obrigatoriamente por 3 questões fáceis, 4 questões médias e 3 questões difíceis, selecionadas de forma aleatória dentro 
de cada categoria. | # # |
| RF - 6                 |  O usuário deve poder realizar no máximo 2 tentativas por nível.                                                    | #   |
| RF - 7                 | Para cada nível, a nota final do usuário deve ser a maior nota obtida entre as tentativas realizadas.               | #   |
| RF - 8                 | O sistema deve calcular o resultado final do usuário como a média das notas finais obtidas em cada nível.           | # # |
| RF - 9                 |  O sistema deve emitir um certificado final contendo, no mínimo: nome completo, CPF, e mail, data de emissão, e a média final (com discriminação das notas por nível, se desejável).  | # # |
| RF - 10                |  O sistema deve manter histórico das tentativas por nível (data/hora, pontuação, questões sorteadas) para auditoria e acompanhamento.  | # # |
| RF - 11                |   O sistema deve permitir a consulta do progresso do usuário (níveis concluídos, tentativas restantes, melhor nota por nível).| # # |
| RF - 12                |   (opcional – extensão): O sistema pode disponibilizar uma área administrativa para cadastro e manutenção das questões, níveis e imagens.| # # |


### REQUISITOS NÃO FUNCIONAIS

| REQUISITO NÃO_FUNCIONAL_ID | REQUISITOS                                                                                          | SPRINTS     |
|----------------------------|-----------------------------------------------------------------------------------------------------|-------------|
| RNF - 1                    | A interface deve ser simples, clara e responsiva, e responsiva.                                     |-------------|
| RNF - 2                    |  A aplicação deve apresentar tempo de resposta adequado para carregamento de páginas e registro de respostas.  | ------|
| RNF - 3                    |  Os dados pessoais (nome, e-mail e CPF) devem ser tratados em conformidade com a LGPD, com armazenamento e acesso restritos ao necessário. |-----       |
| RNF - 4                    | O sistema deve evitar fraudes triviais, garantindo que a contagem de tentativas e o cálculo das notas não possam ser alterados apenas por manipulação no front-end.   | ----       |
| RNF - 5                    | O projeto deverá adotar práticas básicas de desenvolvimento ágil, incluindo gestão de backlog, planejamento em sprints, versionamento de código e definição de critérios de pronto (DoD).|--|
| RNF - 6                    | Deve existir documentação mínima do projeto (modelo de dados, instruções de execução e descrição das rotas/funcionalidades).  |--------  |

<br>

### RESTRIÇÕES

|RESTRIÇÕES DE PROJETO | REQUISITOS                                                                                          | CHECK     |
|----------------------------|-----------------------------------------------------------------------------------------------------|-------------|
| RP - 1                    |  O front-end deve ser desenvolvido utilizando HTML, CSS e JavaScript, sem frameworks.                |-------------|
| RP - 2                    |  O banco de dados deve ser PostgreSQL, com uso explícito de DDL (criação de tabelas) e DML (inserção/consulta/atualização). |-------------|
| RP - 3                    |  O back-end deve implementar a comunicação com o PostgreSQL e expor as funcionalidades necessárias ao front-end (por páginas dinâmicas e/ou endpoints HTTP), utilizando tecnologia 
compatível com aplicações web modernas. |-------------|
| RP - 4                    |  O sistema deve armazenar, no banco de dados, usuários, níveis, questões, alternativas, tentativas e resultados. |-------------|
| RP - 5                    |  O escopo do projeto deverá ser compatível com o tempo disponível para desenvolvimento ao longo do semestre, priorizando um MVP funcional.  |-------------|


