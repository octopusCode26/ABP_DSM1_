(function () {
  const botoesResposta = Array.from(document.querySelectorAll(".botaoresposta"));
  const barra = document.getElementById("progresso-dinamico");
  const textoPercentual = document.getElementById("texto-percentual");
  const barraContainer = document.querySelector(".barra-container");

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

  botoesResposta.forEach(function (botao) {
    botao.setAttribute("aria-pressed", "false");

    botao.addEventListener("click", function () {
      selecionarAlternativa(botao);
    });
  });

  animarBarra();
  atualizarPercentual();
})();
