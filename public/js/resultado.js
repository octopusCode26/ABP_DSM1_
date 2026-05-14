(function () {
  const resultadoAcertos = document.getElementById("resultadoAcertos");
  const resultadoRespondidas = document.getElementById("resultadoRespondidas");
  const resultadoNotaFinal = document.getElementById("resultadoNotaFinal");
  const resultadoDesempenho = document.getElementById("resultadoDesempenho");
  const resultadoTentativas = document.getElementById("resultadoTentativas");
  const resultadoMensagem = document.getElementById("resultadoMensagem");
  const btnAcaoResultado = document.getElementById("btnAcaoResultado");
  const btnRevisar = document.getElementById("btnRevisar");

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
      return "Parabens, voce atingiu os acertos necessarios e avancou nessa aventura. Aos poucos voce tem entendido os segredos de Scrum...";
    }

    return "Voce ainda nao atingiu a nota minima. Respire, revise o caminho e tente novamente para continuar sua aventura.";
  }

  function atualizarBotaoAcao(resultado) {
    if (!btnAcaoResultado) return;

    btnAcaoResultado.disabled = false;
    btnAcaoResultado.querySelector(".texto-botao").textContent =
      resultado.aprovado ? "Avancar" : "Tentar novamente";
  }

  function renderizarResultado(resultado) {
    const totalRespondidas = Number(resultado.total_respondidas) || 0;
    const acertos = Number(resultado.acertos) || 0;
    const percentual = formatarPercentual(resultado.percentual);

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

    if (resultadoTentativas) {
      resultadoTentativas.textContent = resultado.tentativa || "--";
    }

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
      alert("Erro de conexao ao carregar resultado");
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

      if (!response.ok) {
        alert(data.message || "Erro ao atualizar progresso");
        atualizarBotaoAcao(resultadoAtual);
        return;
      }

      if (data.resetou_run) {
        alert(data.message || "Sua run foi reiniciada.");
        window.location.href = "/mapa";
        return;
      }

      if (data.aprovado === false) {
        alert(data.message || "Você recebeu uma nova tentativa.");
        window.location.href = "/questionario1";
        return;
      }

      window.location.href = "/mapa";
    } catch (error) {
      console.error(error);
      alert("Erro de conexao ao atualizar progresso");
      atualizarBotaoAcao(resultadoAtual);
    }
  }

  if (btnAcaoResultado) {
    btnAcaoResultado.addEventListener("click", aplicarProgressao);
  }

  carregarResultado();
})();
