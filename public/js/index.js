// -------- INDEX: CONTROLE VISUAL DO MODAL DE LOGIN/CADASTRO --------

const botaoCadastro = document.getElementById("ir_cadastro");
const botaoLogin = document.getElementById("ir_login");
const painelAuth = document.getElementById("painelAuth");
const overlayEscuro = document.getElementById("overlayEscuro");
const botaoFechar = document.getElementById("fecharAuth");
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const botaoCadastreseAqui = document.getElementById("cadastreseaqui");
const botaoRealizeoLogin = document.getElementById("realizeologin");

const TEMPO_FECHAMENTO_MS = 240;
let timeoutFechamento = null;
let fechandoPainel = false;

function limparFechamentoPendente() {
  if (timeoutFechamento) {
    clearTimeout(timeoutFechamento);
    timeoutFechamento = null;
  }

  fechandoPainel = false;
  painelAuth.classList.remove("fechando");
  painelAuth.removeEventListener("animationend", finalizarFechamento);
}

function abrirPainel(tipo) {
  limparFechamentoPendente();

  painelAuth.style.display = "block";
  overlayEscuro.style.display = "block";
  painelAuth.setAttribute("aria-hidden", "false");

  if (tipo === "login") {
    formLogin.style.display = "flex";
    formCadastro.style.display = "none";
  }

  if (tipo === "cadastro") {
    formLogin.style.display = "none";
    formCadastro.style.display = "flex";
  }
}

function fecharPainel(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (fechandoPainel || getComputedStyle(painelAuth).display === "none") {
    return;
  }

  fechandoPainel = true;
  painelAuth.classList.add("fechando");

  painelAuth.addEventListener("animationend", finalizarFechamento);
  timeoutFechamento = setTimeout(finalizarFechamento, TEMPO_FECHAMENTO_MS);
}

function finalizarFechamento(event) {
  if (!fechandoPainel || (event && event.target !== painelAuth)) {
    return;
  }

  if (timeoutFechamento) {
    clearTimeout(timeoutFechamento);
    timeoutFechamento = null;
  }

  painelAuth.style.display = "none";
  overlayEscuro.style.display = "none";
  painelAuth.setAttribute("aria-hidden", "true");
  painelAuth.classList.remove("fechando");
  painelAuth.removeEventListener("animationend", finalizarFechamento);
  fechandoPainel = false;
}

if (botaoCadastro) {
  botaoCadastro.addEventListener("click", function () {
    abrirPainel("login");
  });
}

if (botaoLogin) {
  botaoLogin.addEventListener("click", function () {
    abrirPainel("cadastro");
  });
}

if (botaoFechar) {
  botaoFechar.addEventListener("click", fecharPainel);
}

if (overlayEscuro) {
  overlayEscuro.addEventListener("click", fecharPainel);
}

if (botaoCadastreseAqui) {
  botaoCadastreseAqui.addEventListener("click", function (event) {
    event.preventDefault();
    abrirPainel("cadastro");
  });
}

if (botaoRealizeoLogin) {
  botaoRealizeoLogin.addEventListener("click", function (event) {
    event.preventDefault();
    abrirPainel("login");
  });
}
