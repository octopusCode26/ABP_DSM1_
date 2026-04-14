<h1 align="center">Fatec Jacareí- ABP DSM 1º SEMESTRE</h1>

# Portal de Certificação em Metodologias Ágeis
## Sobre o Projeto
### <p align="justify"> O presente projeto surge através do desafio de criar um portal web voltado à certificação interna em metodologias ágeis, no qual o usuário se cadastra e raliza avaliações por níveis de dificuldade.  </p>

### <p align="justify"> O objetivo educacional é integrar, em um único projeto, os conteúdos do semestre: construção de 
páginas com HTML, CSS e JavaScript (sem frameworks), persistência de dados em PostgreSQL (DDL 
e DML), e organização do trabalho por Scrum e práticas ágeis básicas.</p>

 ## 🤝 Colaboradores

Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table>
  <tr>
    <td align="center" style="padding: 12px;">
      <a href="https://github.com/VtecturboBr" title="GitHub">
        <img src="https://github.com/user-attachments/assets/918a9362-28f0-4e59-9a9b-b7652fc39c76" width="100px" height="100px" style="border-radius: 50%; object-fit: cover;" alt="Alef Oliveira"/><br>
        <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px;">Alef Oliveira</strong>
      </a>
    </td>
    <td align="center" style="padding: 12px;">
      <a href="https://github.com/Cauaisq" title="GitHub">
        <img src="https://avatars.githubusercontent.com/Cauaisq" width="100px" height="100px" style="border-radius: 50%; object-fit: cover;" alt="Cauã Silva"/><br>
        <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px;">Cauã Silva</strong>
      </a>
    </td>
    <td align="center" style="padding: 12px;">
      <a href="https://github.com/EnzoSuzukiProkopas" title="GitHub">
        <img src="https://avatars.githubusercontent.com/EnzoSuzukiProkopas" width="100px" height="100px" style="border-radius: 50%; object-fit: cover;" alt="Enzo Prokopas"/><br>
        <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px;">Enzo Prokopas</strong>
      </a>
    </td>
    <td align="center" style="padding: 12px;">
      <a href="https://github.com/igoriansen" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/124407006?v=4" width="100px" height="100px" style="border-radius: 50%; object-fit: cover;" alt="Igor Iansen"/><br>
        <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px;">Igor Iansen</strong>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 12px;">
      <a href="https://github.com/LorenzoOMN" title="GitHub">
        <img src="https://github.com/user-attachments/assets/6450767b-cdf0-4379-ad2f-33affe69ab58" width="100px" height="100px" style="border-radius: 50%; object-fit: cover;" alt="Lorenzo Nogueira"/><br>
        <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px;">Lorenzo Nogueira</strong>
      </a>
    </td>
    <td align="center" style="padding: 12px;">
      <a href="https://github.com/renanrmsantos14" title="GitHub">
        <img src="https://avatars.githubusercontent.com/renanrmsantos14" width="100px" height="100px" style="border-radius: 50%; object-fit: cover;" alt="Renan Santos"/><br>
        <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px;">Renan Santos</strong>
      </a>
    </td>
    <td align="center" style="padding: 12px;">
      <a href="https://github.com/thiagosantos-17" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/205100877?v=4" width="100px" height="100px" style="border-radius: 50%; object-fit: cover;" alt="Thiago Santos"/><br>
        <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px;">Thiago Santos</strong>
      </a>
    </td>
    <td align="center" style="padding: 12px;">
      <a href="https://github.com/vitorhirch" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/173676857?v=4" width="100px" height="100px" style="border-radius: 50%; object-fit: cover;" alt="Vitor Hirch"/><br>
        <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px;">Vitor Hirch</strong>
      </a>
    </td>
  </tr>
</table>



## SPRINTS

| Sprint | Link        | Início      | Entrega     | Status |
|--------|-------------|-------------|-------------|--------|
| 01     | [Sprint 01]() | 13/04/2026  | 30/04/2026  |  -   |
| 02     | [Sprint 02]() | 04/05/2026  | 21/05/2026  |  -   |
| 03     | [Sprint 03]() | 25/05/2026  | 11/06/2026  |  -   |

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
| RF - 5                 |  Cada avaliação de nível apresentada ao usuário deve ser composta obrigatoriamente por 3 questões fáceis, 4 questões médias e 3 questões difíceis, selecionadas de forma aleatória | # # |
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
| RP - 3                    |  O back-end deve implementar a comunicação com o PostgreSQL e expor as funcionalidades necessárias ao front-end (por páginas dinâmicas e/ou endpoints HTTP)|-------------|
| RP - 4                    |  O sistema deve armazenar, no banco de dados, usuários, níveis, questões, alternativas, tentativas e resultados. |-------------|
| RP - 5                    |  O escopo do projeto deverá ser compatível com o tempo disponível para desenvolvimento ao longo do semestre, priorizando um MVP funcional.  |-------------|


## FIRST SPRINT BACKLOG

| Tarefa                          | Número do Requisito | Prioridades | Pontuação Poker Planning | Descrição do Requisito                                                                 | Responsável                  | Status Iniciada | Status Concluída |
|--------------------------------|---------------------|-------------|--------------------------|----------------------------------------------------------------------------------------|------------------------------|------------------|------------------|
| Prototipação                   | RNF01 / RF12        | 0           | 13                       | Figma: Prototipação do fluxo central de todo site (Mobile-first: celular, desktop).   | Renan, Enzo, Thiago, Vitor   | 1                |                  |
| Diagrama Caso de Uso           | RNF06               | 0           | 5                        | Desenvolver o diagrama de casos de uso em UML.                                         | Alef                         | 1                |                  |
| Organizar Ambiente virtual     | RNF06 / RNF05       | 0           | 1                        | Organizar Kanban e demais abas no GitHub.                                              | Lorenzo                      | 1                | 1                |
| Definição de conteúdo          | RF00                | 1           | 2,5                      | DOCs: Definir como o conteúdo será apresentado (título, textos e imagens dos 5 níveis, intro e desfecho). | Vitor                        | 1                |                  |
| Organizar Arquitetura          | RNF05 / RNF06       | 2           | 5                        | Organização das pastas (Visual Studio), subir na main branch, teste de funcionamento. | Cauã, Igor, Lorenzo          | 1                |                  |
| Diagrama de Classe             | RNF06               | 5           | 5                        | Definir diagrama de Classe utilizando UML.                                             | Igor, Lorenzo                |                  |                  |
| Nível 1                        | RFN01 / RNF02       | 8           | 3                        | Front-end: HTML e texto contendo o conteúdo a ser ensinado referente ao nível.        | Renan, Thiago, Cauã, Enzo    | 1                |                  |
| Diagramas Sequência            | RNF06               | 8           | 5                        | Definir diagrama de Sequência utilizando UML.                                          | Vitor, Lorenzo, Igor         |                  |                  |



