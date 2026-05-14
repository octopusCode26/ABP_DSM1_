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
      alert(data.message || "Erro ao carregar mapa");
      return;
    }

    renderizarMapa(data.modulos);
    atualizarAtalhos(data.modulos);
  } catch (error) {
    console.error(error);
    alert("Erro de conexão ao carregar mapa");
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
      <button class="porta-botao" onclick="selecionarPorta(this)" ${bloqueado ? "disabled" : ""}>
        <span class="porta-imagem"></span>
      </button>

      <div class="porta-info">
        <h2>Capítulo ${modulo.id_modulo}</h2>
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
}

function selecionarPorta(botao) {
  const portaCard = botao.closest(".porta-card");

  document.querySelectorAll(".porta-card").forEach((card) => {
    if (card !== portaCard) {
      card.classList.remove("selecionada");
    }
  });

  portaCard.classList.toggle("selecionada");
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

function abrirHistoria(idModulo) {
  localStorage.setItem("moduloAtual", idModulo);
  window.location.href = `/capitulo${idModulo}`;
}

function abrirDesafio(idModulo) {
  localStorage.setItem("moduloAtual", idModulo);
  window.location.href = "/questionario1";
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
