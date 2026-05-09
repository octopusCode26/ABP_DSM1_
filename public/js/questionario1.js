(function () {
  const botoesResposta = Array.from(document.querySelectorAll(".botaoresposta"));
  const barra = document.getElementById("progresso-dinamico");
  const textoPercentual = document.getElementById("texto-percentual");
  const barraContainer = document.querySelector(".barra-container");
<<<<<<< Updated upstream
=======
  const textoProgresso = document.getElementById("texto-progresso");
  const textoDificuldade = document.getElementById("texto-dificuldade");
  const enunciadoQuestao = document.getElementById("enunciado-questao");
  const imagemQuestaoContainer = document.getElementById("imagem-questao-container");
  const botaoConfirmar = document.querySelector(".confirmar");
  
>>>>>>> Stashed changes

  function atualizarPercentual() {
    if (!barra) {
      return;
    }

    const largura = barra.style.width || "0%";
    const valorNumerico = Number.parseFloat(largura);

    if (Number.isNaN(valorNumerico)) {
      return;
    }

    const percentualArredondado = Math.max(0, Math.min(100, Math.round(valorNumerico)));

    if (textoPercentual) {
      textoPercentual.textContent = `${percentualArredondado}%`;
    }

    if (barraContainer) {
      barraContainer.setAttribute("aria-valuenow", String(percentualArredondado));
    }
  }

  function animarBarra() {
    if (!barra) {
      return;
    }

    const larguraFinal = barra.style.width || "0%";
    barra.style.width = "0%";

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        barra.style.width = larguraFinal;
      });
    });
  }

  function selecionarAlternativa(botaoSelecionado) {
    botoesResposta.forEach(function (botao) {
      const estaSelecionado = botao === botaoSelecionado;

      botao.classList.toggle("is-selected", estaSelecionado);
      botao.setAttribute("aria-pressed", estaSelecionado ? "true" : "false");
    });
  }

<<<<<<< Updated upstream
=======
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
    const botao = document.querySelector(`.botaoresposta[data-alternativa="${letra}"]`);
    const resposta = botao?.querySelector(".resposta");

    if (resposta) {
      resposta.textContent = texto || "";
    }
  }

 function renderizarImagemQuestao(questao) {
  if (!imagemQuestaoContainer) {
    console.log("Container da imagem não encontrado");
    return;
  }

  imagemQuestaoContainer.innerHTML = "";

  if (!questao.imagem) {
    console.log("Questão sem imagem");
    return;
  }

  const nomeImagem = String(questao.imagem).split("/").pop();

  const caminhoImagem = `/assets/img/questoes/${nomeImagem}`;

  console.log("Imagem recebida:", questao.imagem);
  console.log("Nome tratado:", nomeImagem);
  console.log("Caminho montado:", caminhoImagem);

  imagemQuestaoContainer.innerHTML = `
    <img
      src="${caminhoImagem}"
      alt="Imagem relacionada à questão"
      class="questao-imagem"
      onerror="console.error('Erro ao carregar imagem:', this.src)"
    >
  `;
}

  function renderizarQuestao(questao) {
   console.log("Questão recebida da API:", questao);
    questaoAtual = questao;
    limparSelecao();

    if (textoProgresso) {
      textoProgresso.textContent = `Questao ${questao.numero} de ${totalQuestoes}`;
    }

    if (textoDificuldade) {
      textoDificuldade.textContent = questao.dificuldade || "--";
    }

    if (enunciadoQuestao) {
      enunciadoQuestao.textContent = questao.enunciado || "Pergunta indisponivel";
    }

    renderizarImagemQuestao(questao);

    preencherAlternativa("a", questao.alternativa_a);
    preencherAlternativa("b", questao.alternativa_b);
    preencherAlternativa("c", questao.alternativa_c);
    preencherAlternativa("d", questao.alternativa_d);
    atualizarPercentual(questao.numero);
    habilitarRespostas(true);
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

      if (response.status === 404 && data.message === "nenhuma questao pendente encontrada") {
        window.location.href = "/resultado";
        return;
      }

      if (!response.ok) {
        alert(data.message || "Erro ao carregar questao");
        window.location.href = "/mapa";
        return;
      }

      renderizarQuestao(data);
    } catch (error) {
      console.error(error);
      alert("Erro de conexao ao carregar questao");
      habilitarRespostas(true);
    }
  }

  async function confirmarResposta() {
    const token = obterToken();
    if (!token || !questaoAtual) return;

    if (!alternativaSelecionada) {
      alert("Selecione uma alternativa antes de confirmar.");
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
        alert(data.message || "Erro ao responder questao");
        habilitarRespostas(true);
        return;
      }

      await carregarProximaQuestao();
    } catch (error) {
      console.error(error);
      alert("Erro de conexao ao responder questao");
      habilitarRespostas(true);
    }
  }

>>>>>>> Stashed changes
  botoesResposta.forEach(function (botao) {
    botao.setAttribute("aria-pressed", "false");

    botao.addEventListener("click", function () {
      selecionarAlternativa(botao);
    });
  });

  animarBarra();
  atualizarPercentual();
})();
