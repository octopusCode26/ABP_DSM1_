<div align="center">

<br>

<img src="https://github.com/igoriansen/Test-Room/blob/abp/assets/images/logo%202.png?raw=true" width="450" alt="Scrum Dungeon"/>

<br>

<div align="center">

<div align="center">

> *"Aventureiro... os segredos do Scrum Master aguardam além desta porta.*
> *Você tem coragem de enfrentar a dungeon?"*
>
> — **O Corvo**

</div>

</div>

<br>

[![▶ Entrar na Dungeon](https://img.shields.io/badge/▶_Entrar_na_Dungeon-7B4FBF?style=plastic)](https://github.com/octopusCode26/ABP_DSM1_)
[![Protótipo](https://img.shields.io/badge/Ver_Protótipo-c8922a?style=plastic&logo=figma&logoColor=white)](https://www.figma.com/design/96DMn9UVu2MT9xJIi5pBiQ/Prototipo_Scrum-Dungeon)
[![Sprint Atual](https://img.shields.io/badge/Sprint_2_·_Em_Andamento-5865F2?style=plastic)]()

</div>

---

<div align="center">

<h3>🧭 Sumário</h3>

<table>
  <tr>
    <td><a href="#sobre-o-projeto">⚔️ Sobre o Projeto</a></td>
    <td><a href="#como-funciona">🗺️ Como Funciona</a></td>
    <td><a href="#tecnologias">🛠️ Tecnologias</a></td>
    <td><a href="#sprints">🕰️ Sprints</a></td>
  </tr>
  <tr>
    <td><a href="#como-executar">▶️ Como Executar</a></td>
    <td><a href="#requisitos">📜 Requisitos</a></td>
    <td colspan="2"><a href="#os-aventureiros">🐙 Os Aventureiros</a></td>
  </tr>
</table>

</div>

---

<span id="sobre-o-projeto"></span>

<h2><img src="https://github.com/igoriansen/Test-Room/blob/abp/assets/icons/fc155%201.png?raw=true" width="22" valign="middle"/> Sobre o Projeto</h2>

Scrum Dungeon é um RPG educativo desenvolvido como projeto integrador do 1º semestre do curso de **Desenvolvimento de Software Multiplataforma na FATEC Jacareí**, sob orientação do **Prof. Antonio Egydio São Thiago Graça** e com acompanhamento do **Prof. Marcelo Augusto Sudo**.

O projeto propõe uma **abordagem diferente** para o aprendizado de metodologias ágeis: em vez de memorizar conceitos isolados, o usuário os **vivencia** dentro de uma narrativa interativa. Cada mecânica do sistema foi pensada para refletir um aspecto real do Scrum — as regras do jogo são as regras do framework.

Desenvolvido em três sprints pelo grupo **Octopus Code**, o projeto aplica na prática a mesma metodologia que ensina.

---

<span id="como-funciona"></span>

<h2><img src="https://github.com/igoriansen/Test-Room/blob/abp/assets/icons/fc1841%201.png?raw=true" width="22" valign="middle"/> Como Funciona</h2>

A dungeon é composta por 5 níveis progressivos, cada um abordando um conjunto de conceitos do Scrum. O jogador avança de sala em sala respondendo questões — e só conquista o próximo nível ao demonstrar que dominou o anterior.

```
ENTRADA
   │
   ▼
+----------+   +----------+   +----------+   +----------+   +----------+
|  NIVEL I |-->| NIVEL II |-->| NIVEL III|-->| NIVEL IV |-->|  NIVEL V |
|          |   |          |   |          |   |          |   |          |
|Fundamentos|  | Papéis e |   | Cerimôni-|   | Artefatos|   |  Ciclo   |
|  do Scrum|   |  Times   |   |    as    |   |  e Fluxo |   | Completo |
+----------+   +----------+   +----------+   +----------+   +----------+
                                                                  |
                                                                  v
                                                          [CERTIFICADO]
```

**Regras da dungeon:**

| Regra | Detalhe |
|-------|---------|
| Questões por nível | 10 sorteadas de um banco de 30 |
| Composição | 3 fáceis · 4 médias · 3 difíceis |
| Tentativas | Máximo de 2 por nível |
| Nota do nível | A maior entre as tentativas |
| Resultado final | Média das melhores notas |
| Recompensa | Certificado digital ao completar os 5 níveis |

---

<span id="tecnologias"></span>

<h2><img src="https://github.com/igoriansen/Test-Room/blob/abp/assets/icons/fc950%201.png?raw=true" width="22" valign="middle"/> Tecnologias</h2>

<div align="center">
<img src="https://cdn.simpleicons.org/html5/fff" height="40" alt="HTML5"/>
<img src="https://cdn.simpleicons.org/css/fff" height="40" alt="CSS3"/>
<img src="https://cdn.simpleicons.org/javascript/fff" height="40" alt="JavaScript"/>
<img src="https://cdn.simpleicons.org/nodedotjs/fff" height="40" alt="Node.js"/>
<img src="https://cdn.simpleicons.org/express/fff" height="40" alt="Express"/>
<img src="https://cdn.simpleicons.org/ejs/fff" height="40" alt="EJS"/>
<img src="https://cdn.simpleicons.org/postgresql/fff" height="40" alt="PostgreSQL"/>
<img src="https://cdn.simpleicons.org/git/fff" height="40" alt="Git"/>
<img src="https://cdn.simpleicons.org/figma/fff" height="40" alt="Figma"/>
</div>

<br>

O **front-end** é desenvolvido com **HTML, CSS e JavaScript puro**, com **EJS** como template engine para renderização de páginas no servidor, sem o uso de frameworks ou bibliotecas de UI. O **back-end** utiliza **Node.js com Express** para gerenciar as rotas da aplicação, centralizando toda a lógica de negócio no servidor — cálculo de notas, controle de tentativas e emissão do certificado são processados exclusivamente no back-end. O banco de dados é **PostgreSQL**, manipulado com instruções DDL e DML escritas diretamente, sem o uso de ORMs. O versionamento adota **Git Flow adaptado**, com integração de código via Pull Request revisado. O design foi prototipado no **Figma**.

---

<span id="sprints"></span>

<h2>🕰️ Sprints</h2>

| Sprint | Período | Entregas | Status |
|--------|---------|----------|--------|
| **Sprint 1** | 13/04 — 30/04/2026 | Prototipação · Diagramas UML · Arquitetura · Nível 1 | ✔️ Finalizada |
| **Sprint 2** | 04/05 — 21/05/2026 | Cadastro · Login · Banco de questões · Sistema de avaliação | 🔵 Em Andamento |
| **Sprint 3** | 25/05 — 11/06/2026 | Certificado · Histórico · Resultado final | ⚪ Aguardando |
| **Apresentação** | 22/06/2026 | Entrega e demonstração na FATEC Jacareí | ⚪ Aguardando |

<details>
<summary>📌 Sprint 1</summary>
<br>

<div align="center"><b>Backlog de Tarefas</b>
<br>

[![Kanban](https://img.shields.io/badge/Acompanhar_Kanban-163451?style=plastic&logo=github&logoColor=white)](https://github.com/users/octopusCode26/projects/8)

| Tarefa | Responsável | Requisitos | Iniciada | Concluída |
|--------|-------------|:----------:|:--------:|:---------:|
| Organizar Ambiente Virtual | Lorenzo, Igor | `RF-00` | ✔️ | ✔️ |
| Definição de Conteúdo | Vitor | `RF-00` | ✔️ | ✔️ |
| Fluxo Principal do Usuário | Vitor | `RNF-01` | ✔️ | ✔️ |
| Prototipação (Figma) | Renan, Enzo, Thiago, Vitor | `RNF-01` | ✔️ | ✔️ |
| Organizar Arquitetura | Cauã, Igor | `RF-01` `RF-02` `RNF-05` `RNF-06` | ✔️ | ✔️ |
| Diagrama de Caso de Uso | Alef | `RNF-06` | ✔️ | ✔️ |
| Diagrama de Classe | Alef, Igor | `RNF-06` | ✔️ | ✔️ |
| Diagramas de Sequência | Alef, Vitor | `RNF-06` | ✔️ | ✔️ |
| Nível 1 (Front-end) | Renan, Thiago, Lorenzo | `RNF-01` `RNF-02` | ✔️ | ✔️ |

</div>

<h5>🗃️ Burndown da 1° Sprint</h5>
<h5>📌 Acesse o burndown do que foi desenvolvido nessa 1° Sprint:</h5>
<h5><a href="https://github.com/octopusCode26/ABP_DSM1_/blob/develop/docs/first%20sprint%20burndown.png">Clique aqui</a></h5>

<h5>📺 Vídeo da 1° Sprint</h5>
<h5>📌 Acesse o vídeo com informações do que foi desenvolvido na 1° Sprint:</h5>
<h5><a href="https://youtu.be/0MVQDj3I3wc">Clique aqui</a></h5>

</details>

<br>

<details>
<summary>📌 Sprint 2</summary>
<br>

<div align="center"><b>Backlog de Tarefas</b>
<br>

[![Kanban](https://img.shields.io/badge/Acompanhar_Kanban-163451?style=plastic&logo=github&logoColor=white)](https://github.com/users/octopusCode26/projects/13)

| Tarefa | Responsável | Requisitos | Prioridade | Dificuldade | Iniciada | Concluída |
|--------|-------------|:----------:|:----------:|:-----------:|:--------:|:---------:|
| Sistema Cadastro | Patricia, Lorenzo, Cauã | `RF-01` `RNF-03` | Alta | Médio | ✔️ | ✔️ |
| Tela Cadastro | Patricia, Lorenzo, Cauã | `RF-01` `RNF-01` | Alta | Médio | ✔️ | ✔️ |
| Sistema de Login | Patricia, Lorenzo, Cauã | `RF-02` | Alta | Médio | ✔️ | ✔️ |
| Tela de Login | Patricia, Lorenzo, Cauã | `RF-02` | Alta | Médio | ✔️ | ✔️ |
| Sistema Questionário | Renan, Alef, Thiago | `RF-03` `RF-04` `RF-05` | Alta | Difícil | ✔️ | ✔️ |
| Tela de Questionário | Renan, Alef, Thiago | `RF-03` `RF-04` `RF-05` | Alta | Difícil | ✔️ | ✔️ |
| Resultado Questionário | Renan, Alef, Thiago | `RF-06` `RF-07` `RF-08` | Média | Médio | ✔️ | ✔️ |
| Tela Revisão Questionário | Renan, Alef, Thiago | `RF-06` | Baixa | Médio | ✔️ | — |
| Sistema Mapa | Vitor, Igor, Enzo | `RNF-01` `RNF-02` | Alta | Difícil | ✔️ | ✔️ |
| Tela Mapa | Vitor, Igor, Enzo | `RNF-01` `RNF-02` | Alta | Difícil | ✔️ | ✔️ |
| Sistema Progresso | Vitor, Igor, Enzo | `RF-10` `RF-11` | Alta | Médio | ✔️ | ✔️ |
| Tela Progresso | Vitor, Igor, Enzo | `RF-10` `RF-11` | Alta | Médio | ✔️ | ✔️ |
| Sistema Histórico | — | `RF-10` `RNF-04` | Alta | Médio | ✔️ | ✔️ |
| Sistema de Tentativas | — | `RF-06` `RNF-04` | Média | Fácil | ✔️ | ✔️ |
| Sistema Emissão de Certificado | — | `RF-09` `RNF-04` | Média | Fácil | ✔️ | ✔️ |
| Tela de Emissão de Certificado | Patricia, Alef | `RF-09` `RNF-04` | Média | Fácil | ✔️ | ✔️ |

</details>
</div>

---

<span id="como-executar"></span>

<h2><img src="https://github.com/igoriansen/Test-Room/blob/abp/assets/icons/fc16%201.png?raw=true" width="22" valign="middle"/> Como Executar</h2>

> **Pré-requisitos:** Node.js 18+ e PostgreSQL 14+ instalados.

**1. Clone o repositório**
```bash
git clone https://github.com/octopusCode26/ABP_DSM1_.git
cd ABP_DSM1_
npm install
```

**2. Configure o `.env`**

Crie um arquivo `.env` na raiz:

```env
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=abp
POSTGRES_PORT=5432

JWT_SECRET=sua_chave_secreta
DEFAULT_EXPIRES_IN_SECONDS=600
```

> ⚠️ Nunca commite o `.env` — ele já está no `.gitignore`.

**3. Inicialize o banco**

Crie um banco chamado `abp` no PostgreSQL, depois execute:

```bash
npm run db:init
```

**4. Inicie o servidor**
```bash
npm run dev
```

Acesse em `http://localhost:3000`

---

<span id="requisitos"></span>

<h2>📜 Requisitos</h2>

<details>
<summary>Funcionais</summary>
<br>

| ID | Requisito |
|----|-----------|
| RF-1 | Cadastro com CPF, nome, e-mail e senha |
| RF-2 | Login por CPF e senha |
| RF-3 | Sorteio de 10 questões por nível (banco de 30) |
| RF-4 | Questões em três dificuldades: fácil, médio e difícil |
| RF-5 | Composição: 3 fáceis · 4 médias · 3 difíceis |
| RF-6 | Máximo de 2 tentativas por nível |
| RF-7 | Nota do nível = maior entre as tentativas |
| RF-8 | Resultado final = média das notas por nível |
| RF-9 | Certificado digital com nome, CPF, e-mail, data e notas |
| RF-10 | Histórico de tentativas com data, hora e pontuação |
| RF-11 | Consulta de progresso em tempo real |
| RF-12 | *(Opcional)* Área administrativa de questões |

</details>

<details>
<summary>Não funcionais</summary>
<br>

| ID | Requisito |
|----|-----------|
| RNF-1 | Interface simples, clara e responsiva |
| RNF-2 | Tempo de resposta adequado |
| RNF-3 | Conformidade com a LGPD |
| RNF-4 | Notas e tentativas não manipuláveis via front-end |
| RNF-5 | Backlog, sprints, versionamento e DoD documentados |
| RNF-6 | Documentação mínima: modelo de dados, rotas e instruções |

</details>

<details>
<summary>Restrições de Projeto</summary>
<br>

| ID | Restrição |
|----|-----------|
| RP-01 | O front-end deve ser desenvolvido exclusivamente com HTML, CSS e JavaScript puro — sem uso de frameworks ou bibliotecas de UI |
| RP-02 | O banco de dados é exclusivamente PostgreSQL, com DDL e DML explícitos — sem uso de ORMs |
| RP-03 | O sistema deve ser entregue e funcional dentro do prazo das 3 sprints definidas no cronograma |
| RP-04 | Toda a lógica de negócio (cálculo de notas, controle de tentativas) deve residir no back-end, nunca no front-end |
| RP-05 | O versionamento deve seguir o fluxo Git Flow adaptado, com contribuições via Pull Request aprovado |

</details>

<details>
<summary>User Stories</summary>
<br>

| ID referência | Remetente | Instrução | Finalidade |
| ------------- | --------- | --------- | ---------- |
| RF-01 / RF-02 / RNF-03 | Usuário | Quero me cadastrar informando CPF, nome completo, e-mail e senha, e depois fazer login com CPF e senha. | Para criar minha conta e acessar o sistema de avaliações de forma segura. |
| RF-03 / RF-04 / RF-05 | Usuário | Quero receber uma prova com questões aleatórias classificadas por nível e dificuldade, com distribuição equilibrada. | Para testar meu conhecimento de forma justa e balanceada. |
| RF-04 / RNF-04 | Admin | Quero classificar as questões por nível e dificuldade, com as regras de cálculo protegidas no backend. | Para garantir avaliações equilibradas e evitar manipulações indevidas. |
| RF-06 / RF-07 | Usuário | Quero ter até 2 tentativas por nível, com a melhor nota sendo considerada. | Para melhorar meu desempenho e ter meu melhor resultado reconhecido. |
| RF-08 / RF-10 / RF-11 / RNF-01 / RNF-02 | Usuário | Quero visualizar minha média final, histórico de tentativas e progresso nos níveis, em qualquer dispositivo e com carregamento rápido. | Para acompanhar minha evolução de forma fluida e acessível. |
| RF-09 | Usuário | Quero gerar um certificado com meus dados e desempenho ao ser aprovado. | Para comprovar minha conclusão no sistema de avaliações. |
| RNF-05 / RNF-06 | Avaliador | Quero que a equipe utilize práticas ágeis e disponibilize documentação básica do projeto. | Para acompanhar a evolução do projeto e entender sua estrutura e funcionamento. |

</details>

<details>
<summary>User Flow</summary>
<br>
<img src="./docs/Fluxo_principal_do_usuário_IMG.png">
</details>

---

<span id="os-aventureiros"></span>

<h2><img src="https://github.com/igoriansen/Test-Room/blob/abp/assets/icons/fc5%201.png?raw=true" width="22" valign="middle"/> Os Aventureiros</h2>

<div align="center">

<img src="https://github.com/igoriansen/Test-Room/blob/abp/assets/images/Layer%200%201.png?raw=true" width="100" height="100" alt="Octopus Code"/>

**`< OCTOPUS_CODE >;`**

<br>

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/VtecturboBr">
        <img src="https://github.com/user-attachments/assets/918a9362-28f0-4e59-9a9b-b7652fc39c76" width="72" style="border-radius:50%"/><br>
        <sub><b>Alef Oliveira</b></sub>
      </a><br><sub>Desenvolvedor</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Cauaisq">
        <img src="https://avatars.githubusercontent.com/Cauaisq" width="72" style="border-radius:50%"/><br>
        <sub><b>Cauã Silva</b></sub>
      </a><br><sub>Desenvolvedor</sub>
    </td>
    <td align="center">
      <a href="https://github.com/EnzoSuzukiProkopas">
        <img src="https://avatars.githubusercontent.com/EnzoSuzukiProkopas" width="72" style="border-radius:50%"/><br>
        <sub><b>Enzo Prokopas</b></sub>
      </a><br><sub>Desenvolvedor</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/igoriansen">
        <img src="https://avatars.githubusercontent.com/u/124407006?v=4" width="72" style="border-radius:50%"/><br>
        <sub><b>Igor Iansen</b></sub>
      </a><br><sub>Desenvolvedor</sub>
    </td>
    <td align="center">
      <a href="https://github.com/LorenzoOMN">
        <img src="https://github.com/thiagosantos-17/fotos_abp/blob/main/lorenzo.jpeg?raw=true" width="72" height="72" style="border-radius:50%"/><br>
        <sub><b>Lorenzo Nogueira</b></sub>
      </a><br><sub>Scrum Master</sub>
    </td>
    <td align="center">
      <a href="https://github.com/renanrmsantos14">
        <img src="https://avatars.githubusercontent.com/renanrmsantos14" width="72" style="border-radius:50%"/><br>
        <sub><b>Renan Santos</b></sub>
      </a><br><sub>Desenvolvedor</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/thiagosantos-17">
        <img src="https://avatars.githubusercontent.com/u/205100877?v=4" width="72" style="border-radius:50%"/><br>
        <sub><b>Thiago Santos</b></sub>
      </a><br><sub>Desenvolvedor</sub>
    </td>
    <td align="center">
      <a href="https://github.com/vitorhirch">
        <img src="https://avatars.githubusercontent.com/u/173676857?v=4" width="72" style="border-radius:50%"/><br>
        <sub><b>Vitor Hirch</b></sub>
      </a><br><sub>Product Owner</sub>
    </td>
    <td align="center">
      <a href="https://github.com/PatyMaidana">
        <img src="https://avatars.githubusercontent.com/u/155653067?v=4" width="72" style="border-radius:50%"/><br>
        <sub><b>Patricia Maidana</b></sub>
      </a><br><sub>Desenvolvedor</sub>
    </td>
  </tr>
</table>

</div>

---

<div align="center">

<img src="https://github.com/igoriansen/Test-Room/blob/abp/assets/images/corvo%201.png?raw=true" width="80" alt="O Corvo"/>

<br>

*"A dungeon foi conquistada. Até a próxima jornada."*

`1DSM · FATEC Jacareí · 2026/1`

</div>
