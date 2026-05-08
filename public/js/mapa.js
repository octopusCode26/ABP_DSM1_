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
  } catch (error) {
    console.error(error);
    alert("Erro de conexão ao carregar mapa");
  }
}

function renderizarMapa(modulos) {
  mapaModulos.innerHTML = "";

  let certificadoLiberado = false;

  modulos.forEach((modulo) => {
    const card = document.createElement("article");
    card.classList.add("modulo-card");

    if (!modulo.historia_liberada) {
      card.classList.add("bloqueado");
    } else {
      card.classList.add("liberado");
    }

    if (modulo.historia_concluida) {
      card.classList.add("concluido");
    }

    if (modulo.desafio_atual) {
      card.classList.add("desafio-atual");
    }

    if (modulo.certificado_liberado) {
      certificadoLiberado = true;
    }

    const textoBotao = definirTextoBotao(modulo);

    card.innerHTML = `
      <h2>Capítulo ${modulo.id_modulo}</h2>
      <p>${modulo.titulo}</p>
      <button 
        ${!modulo.historia_liberada ? "disabled" : ""}
        onclick="entrarModulo(${modulo.id_modulo})"
      >
        ${textoBotao}
      </button>
    `;

    mapaModulos.appendChild(card);
  });

  if (certificadoLiberado) {
    btnCertificado.disabled = false;
    btnCertificado.classList.add("liberado");
  }
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