document.addEventListener("DOMContentLoaded", () => {
  revelarElementosEmSequencia();
  configurarTextoDigitado();
  configurarAcoesDesafio();
  configurarRegras();
});

function revelarElementosEmSequencia() {
  const passos = [
    { seletor: ".step-1", delay: 150 },
    { seletor: ".step-2", delay: 500 },
    { seletor: ".step-3", delay: 950 },
    { seletor: ".step-4", delay: 3600 },
    { seletor: ".step-5", delay: 4300 },
  ];

  passos.forEach((passo) => {
    const elemento = document.querySelector(passo.seletor);

    if (!elemento) return;

    setTimeout(() => {
      elemento.classList.add("is-visible");
    }, passo.delay);
  });
}

function configurarTextoDigitado() {
  const elemento = document.getElementById("bossTypeText");

  if (!elemento) return;

  const texto =
    "Responda às questões antes que o tempo termine, ou seja devorado pela Documentação Confusa.";

  let indice = 0;

  function digitar() {
    elemento.textContent = texto.slice(0, indice);
    indice += 1;

    if (indice <= texto.length) {
      setTimeout(digitar, 34);
    }
  }

  setTimeout(digitar, 1200);
}

function configurarAcoesDesafio() {
  const btnIniciar = document.getElementById("btnIniciarDesafio");
  const btnVoltarMapa = document.getElementById("btnVoltarMapa");

  if (btnIniciar) {
    btnIniciar.addEventListener("click", () => {
      sessionStorage.setItem("desafio1_iniciado", "true");
      sessionStorage.setItem("desafio1_inicio", String(Date.now()));

      window.location.href = "/questionario1";
    });
  }

  if (btnVoltarMapa) {
    btnVoltarMapa.addEventListener("click", () => {
      window.location.href = "/mapa";
    });
  }
}

function configurarRegras() {
  const card = document.querySelector(".rules-card");
  const botao = document.getElementById("btnToggleRegras");

  if (!card || !botao) return;

  setTimeout(() => {
    card.classList.add("is-open");
  }, 4700);

  botao.addEventListener("click", () => {
    card.classList.toggle("is-open");
  });
}