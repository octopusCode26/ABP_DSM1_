
(function () {
    const menuToggle = document.getElementById('menuToggle');
    const menuPrincipal = document.getElementById('menuPrincipal');

    if (!menuToggle || !menuPrincipal) {
        return;
    }

    menuToggle.addEventListener('click', function () {
        const aberto = menuPrincipal.classList.toggle('ativo');
        menuToggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });

    menuPrincipal.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menuPrincipal.classList.remove('ativo');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            menuPrincipal.classList.remove('ativo');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
})();


// ================= NAVEGAÇÃO INFERIOR ATIVA =================

function marcarItemAtivoDaNavegacaoInferior() {
  const itens = document.querySelectorAll(".navegacao-inferior__item");

  if (!itens.length) return;

  const rotaAtual = window.location.pathname.replace(/\/$/, "");

  itens.forEach((item) => {
    const rotaItem = item.dataset.rota?.replace(/\/$/, "");

    item.classList.remove("ativo");

    if (rotaAtual === rotaItem) {
      item.classList.add("ativo");
    }
  });
}

document.addEventListener("DOMContentLoaded", marcarItemAtivoDaNavegacaoInferior);
window.addEventListener("load", marcarItemAtivoDaNavegacaoInferior);

// BOTÃO FUNCIONANDO MAS SEM VARIAÇÃO DE COR PARA SUCESSO E ERRO
// function mostrarAlerta(mensagem) {
//   const alerta = document.getElementById("custom-alert");
//   const texto = document.getElementById("custom-alert-message");

//   texto.innerText = mensagem;

//   alerta.classList.remove("hidden");
// }

// function fecharAlerta() {
//   document
//     .getElementById("custom-alert")
//     .classList.add("hidden");
// }

//  BOTÃO FUNCIONANDO MAS COM VARIAÇÃO DE SUCESSO E ERRO
function mostrarAlerta(mensagem, tipo) {
    const alerta = document.getElementById('custom-alert');
    const texto = document.getElementById('custom-alert-message');

    texto.innerText = mensagem;

    alerta.classList.remove('hidden', 'sucesso', 'erro');

    alerta.classList.add(tipo);

    alerta.style.display = 'flex';
}

function fecharAlerta() {
    const alerta = document.getElementById('custom-alert');

    alerta.classList.add('hidden');
    alerta.classList.remove('sucesso', 'erro');

    alerta.style.display = 'none';
}


// criar variável global para armazenar a altura do footer
function atualizarAlturaFooter() {
  const footer = document.querySelector("footer"); // ou seletor mais específico
  if (!footer) return;

  const alturaFooter = footer.offsetHeight;
  document.documentElement.style.setProperty("--footer-height", `${alturaFooter}px`);
}

// criar variável global para armazenar a altura do header
function atualizarAlturaHeader() {
  const header = document.querySelector("header"); // ou seletor mais específico
  if (!header) return;

  const alturaHeader = header.offsetHeight;
  document.documentElement.style.setProperty("--header-height", `${alturaHeader}px`);
}

// quando a página termina de carregar
window.addEventListener("load", atualizarAlturaFooter);
window.addEventListener("load", atualizarAlturaHeader);

// quando redimensionar a tela
window.addEventListener("resize", atualizarAlturaFooter);
window.addEventListener("resize", atualizarAlturaHeader);
