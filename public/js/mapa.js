document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("origemBurningdown");
  sessionStorage.removeItem("retornoBurningdown");
});

const mapaModulos = document.getElementById("mapaModulos");
const btnCertificado = document.getElementById("btnCertificado");

async function carregarMapa() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("/api/progresso/mapa", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarAlerta(data.message || "Erro ao carregar mapa", "erro");
      return;
    }

    renderizarMapa(data.modulos);
    atualizarAtalhos(data.modulos);
  } catch (error) {
    console.error(error);
    mostrarAlerta("Erro de conexão ao carregar mapa", "erro");
  }
}

function renderizarMapa(modulos) {
  mapaModulos.innerHTML = "";

  modulos.forEach((modulo) => {
    const card = document.createElement("article");

    const bloqueado = !modulo.historia_liberada;
    const historiaConcluida = modulo.historia_concluida;
    const desafioAtual = modulo.desafio_atual;
    const desafioConcluido =
      modulo.desafio_concluido || (historiaConcluida && !desafioAtual);

    let estadoPorta = "estado-incompleto";

    if (historiaConcluida && desafioConcluido) {
      estadoPorta = "estado-completo";
    } else if (historiaConcluida) {
      estadoPorta = "estado-historia";
    }

    card.className = `
      porta-card
      porta-${modulo.id_modulo}
      ${bloqueado ? "bloqueado" : "liberado"}
      ${estadoPorta}
      ${desafioAtual ? "desafio-atual" : ""}
    `;

    card.innerHTML = `
      <span class="porta-botao" aria-hidden="true">
        <span class="porta-imagem"></span>
      </span>

      <div id="porta-info-${modulo.id_modulo}" class="porta-info">
        <h2>${criarTituloModulo(modulo.id_modulo)}</h2>
        <p>${criarDescricaoImersiva(modulo.id_modulo)}</p>

        <div class="porta-acoes">
          <button 
            ${bloqueado ? "disabled" : ""}
            onclick="abrirHistoria(${modulo.id_modulo})"
          >
            História
          </button>

          <button 
            ${!historiaConcluida || !desafioAtual ? "disabled" : ""}
            onclick="abrirDesafio(${modulo.id_modulo})"
          >
            Desafio
          </button>
        </div>
      </div>
    `;

    mapaModulos.appendChild(card);
  });
}

function atualizarAtalhos(modulos) {
  const btnArtefatos = document.querySelector(".atalho-artefatos");
  const btnCertificado = document.getElementById("btnCertificado");
  const txtCertificado = document.getElementById("certificado-status");

  const primeiroModulo = modulos.find((modulo) => modulo.id_modulo === 1);

  const artefatosLiberados =
    primeiroModulo &&
    primeiroModulo.historia_concluida &&
    !primeiroModulo.desafio_atual;

  if (!artefatosLiberados) {
    btnArtefatos.disabled = true;
    btnArtefatos.classList.add("bloqueado");
  } else {
    btnArtefatos.disabled = false;
    btnArtefatos.classList.remove("bloqueado");
  }

  const certificadoLiberado = modulos.some((modulo) => modulo.certificado_liberado);

  if (btnCertificado) {
    btnCertificado.disabled = !certificadoLiberado;
    btnCertificado.classList.toggle("liberado", certificadoLiberado);

    if (txtCertificado) {
      txtCertificado.textContent = certificadoLiberado
        ? "Certificado liberado. Toque para emitir."
        : "Complete a jornada para desbloquear.";
    }

    if (certificadoLiberado) {
      btnCertificado.onclick = () => {
        window.location.href = "/certificado";
      };
    } else {
      btnCertificado.onclick = null;
    }
  }
}

function criarDescricaoImersiva(idModulo) {
  const descricoes = {
    1: "A primeira porta guarda os fundamentos das metodologias ágeis.",
    2: "Atrás desta passagem estão os papéis, eventos e artefatos do Scrum.",
    3: "O tempo corre nesta sala: aprenda o fluxo de trabalho do Scrum.",
    4: "Aqui, qualidade e melhoria contínua testam sua disciplina ágil.",
    5: "A última porta exige análise crítica para concluir sua jornada.",
  };

  return descricoes[idModulo] || "Uma nova etapa da masmorra aguarda você.";
}

function criarTituloModulo(idModulo) {
  const titulos = {
    1: "A lenda de Scrum",
    2: "Os Guardiões do Fluxo",
    3: "Reunião do Alvorecer",
    4: "O Ciclo do Tempo",
    5: "Scrum Master",
  };

  return titulos[idModulo] || `Capítulo ${idModulo}`;
}

function abrirHistoria(idModulo) {
  localStorage.setItem("moduloAtual", idModulo);
  window.location.href = `/capitulo${idModulo}`;
}

function abrirDesafio(idModulo) {
  localStorage.setItem("moduloAtual", idModulo);
  window.location.href = `/desafio${idModulo}`;
}

function definirTextoBotao(modulo) {
  if (!modulo.historia_liberada) {
    return "Bloqueado";
  }

  if (!modulo.historia_concluida) {
    return "Ler história";
  }

  if (modulo.desafio_atual) {
    return "Fazer desafio";
  }

  return "Revisitar";
}

function entrarModulo(idModulo) {
  localStorage.setItem("moduloAtual", idModulo);

  window.location.href = `/capitulo${idModulo}`;
}

carregarMapa();
