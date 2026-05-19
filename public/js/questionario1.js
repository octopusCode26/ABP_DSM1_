(function () {
  const totalQuestoes = 10;

  const botoesResposta = Array.from(
    document.querySelectorAll(".botaoresposta"),
  );
  const barra = document.getElementById("progresso-dinamico");
  const textoPercentual = document.getElementById("texto-percentual");
  const barraContainer = document.querySelector(".barra-container");
  const textoProgresso = document.getElementById("texto-progresso");
  const textoDificuldade = document.getElementById("texto-dificuldade");
  const enunciadoQuestao = document.getElementById("enunciado-questao");
  const imagemQuestaoContainer = document.getElementById(
    "imagem-questao-container",
  );
  const botaoConfirmar = document.querySelector(".confirmar");

  let questaoAtual = null;
  let alternativaSelecionada = null;

  function obterToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return null;
    }

    return token;
  }

  function atualizarPercentual(numeroQuestao) {
  let percentual;
  const n = Number(numeroQuestao || 0);

  if (n > totalQuestoes) {
    percentual = 100;
  } else if (n === totalQuestoes) {
    percentual = 90;
  } else {
    percentual = Math.round(((n - 1) / (totalQuestoes - 1)) * 90);
    if (n === 1) percentual = 0;
  }

  percentual = Math.max(0, Math.min(100, percentual || 0));

  if (barra) {
    barra.style.width = `${percentual}%`;
  }

  if (textoPercentual) {
    textoPercentual.textContent = `${percentual}%`;
  }

  if (barraContainer) {
    barraContainer.setAttribute("aria-valuenow", String(percentual));
  }
}

  function selecionarAlternativa(botaoSelecionado) {
    alternativaSelecionada = botaoSelecionado.dataset.alternativa;

    botoesResposta.forEach(function (botao) {
      const estaSelecionado = botao === botaoSelecionado;

      botao.classList.toggle("is-selected", estaSelecionado);
      botao.setAttribute("aria-pressed", estaSelecionado ? "true" : "false");
    });
  }

  function habilitarRespostas(habilitado) {
    botoesResposta.forEach(function (botao) {
      botao.disabled = !habilitado;
    });

    if (botaoConfirmar) {
      botaoConfirmar.disabled = !habilitado;
    }
  }

  function limparSelecao() {
    alternativaSelecionada = null;

    botoesResposta.forEach(function (botao) {
      botao.classList.remove("is-selected");
      botao.setAttribute("aria-pressed", "false");
    });
  }

  function preencherAlternativa(letra, texto) {
    const botao = document.querySelector(
      `.botaoresposta[data-alternativa="${letra}"]`,
    );
    const resposta = botao?.querySelector(".resposta");

    if (resposta) {
      resposta.textContent = texto || "";
    }
  }

  function renderizarImagemQuestao(questao) {
    if (!imagemQuestaoContainer) return;

    imagemQuestaoContainer.innerHTML = "";

    if (!questao.imagem) return;

    const nomeImagem = String(questao.imagem).split("/").pop();
    const caminhoImagem = `/assets/img/questoes/${nomeImagem}`;

    imagemQuestaoContainer.innerHTML = `
      <img
        src="${caminhoImagem}"
        alt="Imagem relacionada à questão"
        class="questao-imagem"
      >
    `;
  }

  function renderizarQuestao(questao) {
    questaoAtual = questao;
    limparSelecao();

    if (textoProgresso) {
      textoProgresso.textContent = `Questão ${questao.numero} de ${totalQuestoes}`;
    }

    if (textoDificuldade) {
      textoDificuldade.textContent = questao.dificuldade || "--";
    }

    if (enunciadoQuestao) {
      enunciadoQuestao.textContent =
        questao.enunciado || "Pergunta indisponível";
    }

    renderizarImagemQuestao(questao);

    preencherAlternativa("a", questao.alternativa_a);
    preencherAlternativa("b", questao.alternativa_b);
    preencherAlternativa("c", questao.alternativa_c);
    preencherAlternativa("d", questao.alternativa_d);

    atualizarPercentual(questao.numero);
    habilitarRespostas(true);
  }

  async function finalizarQuestionario() {
    window.location.href = "/resultado";
  }

  async function carregarProximaQuestao() {
    const token = obterToken();

    if (!token) return;

    habilitarRespostas(false);

    try {
      const response = await fetch("/api/questoes/proxima-questao", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 404) {
        await finalizarQuestionario();
        return;
      }

      if (!response.ok) {
        mostrarAlerta(data.message || "Erro ao carregar questão", "erro");
        window.location.href = "/mapa";
        return;
      }

      renderizarQuestao(data);
    } catch (error) {
      console.error(error);
      mostrarAlerta("Erro de conexão ao carregar questão", "erro");
      habilitarRespostas(true);
    }
  }

  async function confirmarResposta() {
    const token = obterToken();

    if (!token || !questaoAtual) return;

    if (!alternativaSelecionada) {
      mostrarAlerta("Escolha uma alternativa antes de confirmar.", "erro");
      return;
    }

    habilitarRespostas(false);

    try {
      const response = await fetch("/api/questoes/responder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_exame: questaoAtual.id_exame,
          id_questao: questaoAtual.id_questao,
          resposta: alternativaSelecionada,
        }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 409) {
        mostrarAlerta(data.message || "Erro ao responder questão", "erro");
        habilitarRespostas(true);
        return;
      }

      await carregarProximaQuestao();
    } catch (error) {
      console.error(error);
      mostrarAlerta("Erro de conexão ao responder questão");
      habilitarRespostas(true);
    }
  }

  botoesResposta.forEach(function (botao) {
    botao.setAttribute("aria-pressed", "false");

    botao.addEventListener("click", function () {
      selecionarAlternativa(botao);
    });
  });

  if (botaoConfirmar) {
    botaoConfirmar.addEventListener("click", confirmarResposta);
  }

  carregarProximaQuestao();
})();
