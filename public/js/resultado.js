(function () {
  const resultadoAcertos = document.getElementById("resultadoAcertos");
  const resultadoRespondidas = document.getElementById("resultadoRespondidas");
  const resultadoNotaFinal = document.getElementById("resultadoNotaFinal");
  const resultadoDesempenho = document.getElementById("resultadoDesempenho");
  const resultadoTentativas = document.getElementById("resultadoTentativas");
  const resultadoMensagem = document.getElementById("resultadoMensagem");
  const btnAcaoResultado = document.getElementById("btnAcaoResultado");
  const btnRevisar = document.getElementById("btnRevisar");
  const resultadoImagemArea = document.getElementById("resultadoImagemArea");
  const resultadoImagem = document.getElementById("resultadoImagem");
  const resultadoHoverTexto = document.getElementById("resultadoHoverTexto");
  const resultadoEtiqueta = document.getElementById("resultadoEtiqueta");
  const resultadoTituloPrincipal = document.getElementById(
    "resultadoTituloPrincipal",
  );

  const TOTAL_TENTATIVAS = 2;

  const RESULTADO_IMAGENS = {
    vitoria: "/assets/img/capitulo_1/resultado_venceu.png",
    perdeu: "/assets/img/capitulo_1/resultado_perdeu.png",
    esgotou: "/assets/img/capitulo_1/resultado_esgotou_tentativas.png",
  };

  const VIDA_IMAGEM = "/assets/img/vida-icon.png";
  const VIDA_PERDIDA_IMAGEM = "/assets/img/vida-icon-perdeu.png";

  let resultadoAtual = null;

  function obterToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return null;
    }

    return token;
  }

  function formatarPercentual(percentual) {
    const numero = Number(percentual) || 0;
    return Number.isInteger(numero) ? String(numero) : numero.toFixed(2);
  }

  function obterDesempenho(percentual) {
    const nota = Number(percentual) || 0;

    if (nota >= 90) return "Excelente";
    if (nota >= 70) return "Muito bom";
    if (nota >= 50) return "Bom";
    return "Precisa melhorar";
  }

  function obterMensagem(resultado) {
    if (resultado.aprovado) {
      return "Após uma árdua batalha mental, você encontrou os pontos fracos da criatura: objetivo claro, estrutura, detalhes úteis e entrega com valor.";
    }

    if (tentativasRestantes(resultado) <= 0) {
      return "Suas tentativas se esgotaram. O corvo surge em meio à energia roxa da dungeon para levá-lo de volta ao início da jornada.";
    }

    return "Você lutou bravamente, mas a criatura ainda se alimenta de informações soltas, excesso de detalhes e objetivos pouco claros. Revise seus passos, fortaleça sua estratégia e tente novamente.";
  }

  function tentativasUsadas(resultado) {
    return Math.min(Number(resultado.tentativa) || 1, TOTAL_TENTATIVAS);
  }

  function tentativasRestantes(resultado) {
    return Math.max(TOTAL_TENTATIVAS - tentativasUsadas(resultado), 0);
  }

  function obterEstadoResultado(resultado) {
    if (resultado.aprovado) {
      return "vitoria";
    }

    if (tentativasRestantes(resultado) <= 0) {
      return "esgotou";
    }

    return "perdeu";
  }

  function renderizarTentativas(resultado) {
    if (!resultadoTentativas) return;

    const usadas = tentativasUsadas(resultado);

    resultadoTentativas.innerHTML = "";

    for (let i = 1; i <= TOTAL_TENTATIVAS; i++) {
      const img = document.createElement("img");

      img.classList.add("vida-icon");

      if (i <= usadas && !resultado.aprovado) {
        img.src = VIDA_PERDIDA_IMAGEM;
        img.alt = "Tentativa perdida";
      } else {
        img.src = VIDA_IMAGEM;
        img.alt = "Tentativa disponível";
      }

      resultadoTentativas.appendChild(img);
    }
  }

  function configurarImagemResultado(resultado) {
    if (!resultadoImagemArea || !resultadoImagem || !resultadoHoverTexto)
      return;

    const estado = obterEstadoResultado(resultado);

    resultadoImagemArea.classList.remove(
      "estado-vitoria",
      "estado-perdeu",
      "estado-esgotou",
    );

    resultadoImagemArea.classList.add(`estado-${estado}`);
    resultadoImagem.src = RESULTADO_IMAGENS[estado];

    if (estado === "vitoria") {
      resultadoImagem.alt = "Aventureiro venceu a batalha";
      resultadoHoverTexto.textContent = "VOCÊ VENCEU";
    }

    if (estado === "perdeu") {
      resultadoImagem.alt = "Aventureiro perdeu uma tentativa";
      resultadoHoverTexto.textContent = "FUJA";
    }

    if (estado === "esgotou") {
      resultadoImagem.alt =
        "Corvo resgata o aventureiro após esgotar tentativas";
      resultadoHoverTexto.textContent = "VOE COM O CORVO";
    }
  }

  function atualizarBotaoAcao(resultado) {
    if (!btnAcaoResultado) return;

    btnAcaoResultado.disabled = false;
    btnAcaoResultado.querySelector(".texto-botao").textContent =
      resultado.aprovado ? "Avançar" : "Tentar novamente";
  }

  function renderizarResultado(resultado) {
    const totalRespondidas = Number(resultado.total_respondidas) || 0;
    const acertos = Number(resultado.acertos) || 0;
    const percentual = formatarPercentual(resultado.percentual);
    renderizarTituloResultado(resultado);

    if (resultadoAcertos) {
      resultadoAcertos.textContent = `${acertos}/${totalRespondidas}`;
    }

    if (resultadoRespondidas) {
      resultadoRespondidas.textContent = `Total respondidas: ${totalRespondidas}`;
    }

    if (resultadoNotaFinal) {
      resultadoNotaFinal.textContent = `Nota final: ${percentual}%`;
    }

    if (resultadoDesempenho) {
      resultadoDesempenho.textContent = obterDesempenho(resultado.percentual);
    }

    renderizarTentativas(resultado);
    configurarImagemResultado(resultado);

    if (resultadoMensagem) {
      resultadoMensagem.textContent = obterMensagem(resultado);
    }

    if (btnRevisar) {
      btnRevisar.disabled = true;
      btnRevisar.title = "Revisao ainda nao disponivel";
    }

    atualizarBotaoAcao(resultado);
  }

  async function carregarResultado() {
    const token = obterToken();
    if (!token) return;

    try {
      const response = await fetch("/api/questoes/resultado-atual", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // se não tem resultado, o usuário foi resetado ou chegou aqui sem querer
        // manda pro mapa que é o lugar certo
        window.location.href = "/mapa";
        return;
      }

      resultadoAtual = data;
      renderizarResultado(data);
    } catch (error) {
      console.error(error);
      mostrarAlerta("Erro de conexao ao carregar resultado");
    }
  }

   function renderizarTituloResultado(resultado) {
    const estado = obterEstadoResultado(resultado);

    if (resultadoTituloPrincipal) {
      if (estado === "vitoria") {
        resultadoTituloPrincipal.textContent = "Você venceu!";
      }

      if (estado === "perdeu") {
        resultadoTituloPrincipal.textContent = "Batalha perdida";
      }

      if (estado === "esgotou") {
        resultadoTituloPrincipal.textContent = "Run reiniciada";
      }
    }

    if (resultadoEtiqueta) {
      if (estado === "vitoria") {
        resultadoEtiqueta.textContent = "Missão concluída";
      }

      if (estado === "perdeu") {
        resultadoEtiqueta.textContent = "Tente novamente";
      }

      if (estado === "esgotou") {
        resultadoEtiqueta.textContent = "O corvo te resgatou";
      }
    }
  }

 async function aplicarProgressao() {
  const token = obterToken();

  if (!token || !resultadoAtual || !btnAcaoResultado) return;

  btnAcaoResultado.disabled = true;
  btnAcaoResultado.querySelector(".texto-botao").textContent = "Aguarde...";

  try {
    const response = await fetch("/api/questoes/proximo-modulo", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    /*
      Caso 1: o jogador venceu o desafio atual.
      Mesmo que o backend crie o próximo exame, ele deve voltar para o mapa.
    */
    if (resultadoAtual.aprovado) {
      window.location.href = "/mapa";
      return;
    }

    /*
      Caso 2: o jogador falhou 2 vezes e a run foi resetada.
      Nesse caso volta para o mapa para mostrar que a run retornou ao módulo 1.
    */
    const resetouRun =
      data.resetou_run === true ||
      (
        data.progresso &&
        Number(data.progresso.falhas_no_modulo) === 0 &&
        data.message &&
        data.message.toLowerCase().includes("falhou 2 vezes")
      );

    if (resetouRun) {
      window.location.href = "/mapa";
      return;
    }

    /*
      Caso 3: o jogador falhou, mas ainda tem tentativa.
      Agora sim ele vai para o questionário novamente.
    */
    if (!resultadoAtual.aprovado) {
      window.location.href = "/desafio1";
      return;
    }

    /*
      Caso 4: erro real.
    */
    if (!response.ok) {
      alert(data.message || "Erro ao atualizar progresso.");
      atualizarBotaoAcao(resultadoAtual);
      return;
    }

    window.location.href = "/mapa";
  } catch (error) {
    console.error(error);
    alert("Erro de conexão ao atualizar progresso.");
    atualizarBotaoAcao(resultadoAtual);
  }
}

  if (btnAcaoResultado) {
    btnAcaoResultado.addEventListener("click", aplicarProgressao);
  }

  carregarResultado();
})();
