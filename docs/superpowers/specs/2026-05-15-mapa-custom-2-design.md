# Mapa Custom 2 Design

## Contexto

A tela comum do mapa usa `public/pages/mapa.ejs`, `public/assets/css/mapa.css` e `public/js/mapa.js`.
A tela `mapa-custom` existente ja experimenta um visual mais elaborado, mas o pedido atual e criar uma segunda alternativa descartavel para visualizar em localhost antes de decidir se ela deve substituir algo.

## Objetivo

Criar uma tela `mapa-custom-2` mantendo a identidade limpa da tela de Burning Down e a estrutura funcional do mapa comum.
O ponto principal e tornar os acessos a Burning Down, Artefatos e Certificado mais visiveis, legiveis e previsiveis.

## Direcao Aprovada

Usar um painel de acoes fixo no lado direito da area do mapa.

O painel deve reunir:

- Burning Down, sempre disponivel, com destaque visual forte.
- Artefatos, com estado bloqueado ou liberado conforme a regra atual.
- Certificado, com estado bloqueado ou liberado conforme a regra atual.

Essa direcao foi escolhida por preservar o mapa comum no centro, mas dar aos tres botoes um lugar claro e escaneavel.

## Interface

A tela deve:

- Usar fundo escuro limpo, bordas douradas, tipografia Cinzel/Source Serif e contraste parecido com `burningdown.css`.
- Remover o excesso de texto introdutorio da versao custom atual.
- Manter o titulo e uma descricao curta, no padrao visual do Burning Down.
- Manter as cinco portas e os estados existentes do mapa comum.
- Mostrar os detalhes de cada porta sem sobrepor os botoes laterais.
- Tornar os estados bloqueado/liberado dos atalhos evidentes por opacidade, texto e cursor.
- Ser responsiva: em telas menores, o painel de acoes deve ficar acima ou abaixo do mapa em fluxo vertical.

## Arquitetura

Adicionar arquivos separados para facilitar remocao posterior:

- `public/pages/mapa-custom-2.ejs`
- `public/assets/css/mapa-custom-2.css`
- Opcionalmente `public/js/mapa-custom-2.js`, somente se for necessario separar comportamento.

Adicionar uma rota temporaria:

- `GET /mapa-custom-2`

A implementacao pode reutilizar `public/js/mapa.js` se o HTML mantiver os mesmos IDs e classes esperados.

## Dados e Regras

O carregamento continua usando `GET /api/progresso/mapa`.
As regras atuais permanecem:

- Usuario sem token volta para `/`.
- Artefatos liberam apos o primeiro modulo ter historia concluida e nao estar em desafio atual.
- Certificado libera quando algum modulo vier com `certificado_liberado`.
- Historia e desafio continuam usando as rotas atuais `capitulo{id}` e `desafio{id}`.

## Testes e Verificacao

A verificacao deve confirmar:

- A rota `/mapa-custom-2` renderiza.
- A tela carrega os modulos usando dados mockados no Playwright ou script equivalente.
- Burning Down, Artefatos e Certificado ficam visiveis sem depender de hover.
- Nao ha sobreposicao visual em desktop, tablet e mobile.
- Estados bloqueado/liberado continuam funcionando.

## Fora de Escopo

Esta alternativa nao deve:

- Substituir `/mapa`.
- Alterar `/mapa-custom`.
- Implementar a pagina real de Artefatos.
- Alterar regras de progresso, certificado ou desafios.
- Refatorar componentes globais de navegacao.
