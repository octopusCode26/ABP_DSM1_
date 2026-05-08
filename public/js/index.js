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

function abrirPainel(tipo) {
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

function fecharPainel() {
  painelAuth.classList.add("fechando");

  painelAuth.addEventListener("animationend", function handler() {
    painelAuth.style.display = "none";
    overlayEscuro.style.display = "none";
    painelAuth.setAttribute("aria-hidden", "true");

    painelAuth.classList.remove("fechando");
    painelAuth.removeEventListener("animationend", handler);
  });
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