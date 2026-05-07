// MANTER NESTE C�DIGO SOMENTE FUN��ES E VARI�VEIS QUE S�O USADAS EM MAIS DE UMA P�GINA,
// CASO CONTR�RIO, COLOQUE O C�DIGO NA RESPECTIVA P�GINA HTML

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

function mostrarAlerta(mensagem) {
  const alerta = document.getElementById("custom-alert");
  const texto = document.getElementById("custom-alert-message");

  texto.innerText = mensagem;

  alerta.classList.remove("hidden");
}

function fecharAlerta() {
  document
    .getElementById("custom-alert")
    .classList.add("hidden");
}